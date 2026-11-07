/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Fastify Server Application & RESTful API Endpoints (Fases 1 a 14)
 */

import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import {
  CivilizationId,
  PERSIAN_CIVILIZATION,
  ERAS_CATALOG,
  BUILDINGS_CATALOG,
  UNITS_CATALOG,
  BuildingType,
  UnitType,
  DefensiveSnapshot
} from '@imperios/shared';
import { ENV } from './config/environment.js';
import { AuthService, inMemoryDb } from './modules/auth/authService.js';
import { EconomyService } from './modules/economy/economyService.js';
import { VillageService } from './modules/village/villageService.js';
import { CombatService } from './modules/combat/combatService.js';
import { ConstructionManager } from './modules/village/constructionManager.js';
import { EraProgressionManager } from './modules/economy/eraProgressionManager.js';
import { PVE_CAMPAIGN_MISSIONS } from './modules/combat/pveCampaignManager.js';
import { ALL_CIVILIZATIONS_CATALOG } from './modules/civilization/civilizationsCatalog.js';
import { STORE_CATALOG, ShieldAndStoreManager } from './modules/shield/shieldAndStoreManager.js';
import { AllianceManager } from './modules/alliance/allianceManager.js';
import { AdminService } from './modules/admin/adminService.js';
import { SecurityService } from './modules/security/securityService.js';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: ENV.NODE_ENV !== 'test'
  });

  // Plugins
  app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  });

  app.register(jwt, {
    secret: ENV.JWT_SECRET
  });

  // Middleware auxiliar para verificar autenticação
  const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Token JWT inválido ou ausente.' },
        serverTimestamp: Date.now()
      });
    }
  };

  // 1. Health check & Status
  app.get('/api/health', async (req: FastifyRequest) => {
    const clientId = req.ip || 'unknown';
    const rateCheck = SecurityService.checkRateLimit(clientId);

    return {
      success: true,
      data: {
        status: 'UP',
        game: 'IMPÉRIOS — Ascensão das Civilizações',
        version: '1.0.0-full-pipeline',
        uptimeSeconds: Math.floor(process.uptime()),
        rateLimitRemaining: rateCheck.remaining,
        timestamp: Date.now()
      },
      serverTimestamp: Date.now()
    };
  });

  // 2. Civilizações (Persa ativa & Catálogo completo das 12 Civilizações)
  app.get('/api/civilizations', async () => {
    return {
      success: true,
      data: {
        activeCivilization: PERSIAN_CIVILIZATION,
        eras: ERAS_CATALOG,
        buildingsCatalog: BUILDINGS_CATALOG,
        unitsCatalog: UNITS_CATALOG
      },
      serverTimestamp: Date.now()
    };
  });

  app.get('/api/civilizations/all', async () => {
    return {
      success: true,
      data: {
        totalCivilizations: Object.keys(ALL_CIVILIZATIONS_CATALOG).length,
        civilizations: ALL_CIVILIZATIONS_CATALOG
      },
      serverTimestamp: Date.now()
    };
  });

  // 3. Autenticação Convidado (Guest)
  app.post('/api/auth/guest', async (req: FastifyRequest<{ Body: { deviceId?: string; playerName?: string; civilization?: CivilizationId } }>, reply) => {
    const { deviceId = `guest_dev_${Math.floor(Math.random() * 1000000)}`, playerName = 'Grande Sátrapa', civilization = CivilizationId.PERSA } = req.body || {};

    const session = AuthService.authenticateGuest(deviceId, playerName, civilization);
    const token = app.jwt.sign({ userId: session.userId, villageId: session.villageId, civ: session.civilization });

    return {
      success: true,
      data: {
        token,
        userId: session.userId,
        villageId: session.villageId,
        playerName: session.playerName,
        civilization: session.civilization
      },
      serverTimestamp: Date.now()
    };
  });

  // 4. Estado da Vila com cálculo offline em tempo real e progressão de eras
  app.get('/api/village/state', { preHandler: [authenticate] }, async (req: FastifyRequest) => {
    const userPayload = req.user as { userId: string; villageId: string };
    const village = inMemoryDb.villages.get(userPayload.villageId);

    if (!village) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Vila não encontrada.' }, serverTimestamp: Date.now() };
    }

    EconomyService.tickVillageResources(village, Date.now());

    // Avalia Era com base no Centro Imperial
    const imperialCenter = village.buildings.find(b => b.type === BuildingType.CENTRO_IMPERIAL);
    const eraStatus = EraProgressionManager.evaluateVillageEra(imperialCenter?.level || 1, village.era as any);

    return {
      success: true,
      data: {
        villageId: village.villageId,
        name: village.name,
        civilization: village.civ,
        era: eraStatus.currentEra,
        eraStatus,
        economy: {
          villageId: village.villageId,
          balances: village.balances,
          capacities: village.capacities,
          productionPerHour: village.productionPerHour,
          lastCalculatedAt: village.lastCalculatedAt
        },
        buildings: village.buildings,
        units: village.units,
        shieldActiveUntil: village.shieldActiveUntil
      },
      serverTimestamp: Date.now()
    };
  });

  // 5. Posicionamento de Novo Edifício
  app.post('/api/village/build', { preHandler: [authenticate] }, async (req: FastifyRequest<{ Body: { type: BuildingType; gridX: number; gridY: number } }>, reply) => {
    const userPayload = req.user as { userId: string; villageId: string; civ: CivilizationId };
    const { type, gridX, gridY } = req.body || {};

    const village = inMemoryDb.villages.get(userPayload.villageId);
    if (!village) {
      return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Vila não encontrada.' } });
    }

    const def = BUILDINGS_CATALOG[type];
    if (!def) {
      return reply.status(400).send({ success: false, error: { code: 'INVALID_BUILDING', message: 'Tipo inválido.' } });
    }

    const cost = def.costsByLevel[1]?.resources || {};
    EconomyService.tickVillageResources(village, Date.now());

    if (!EconomyService.canAfford(village.balances, cost)) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INSUFFICIENT_RESOURCES', message: 'Recursos insuficientes.' },
        serverTimestamp: Date.now()
      });
    }

    const placeResult = VillageService.placeBuilding(
      village.buildings,
      type,
      userPayload.civ || CivilizationId.PERSA,
      gridX,
      gridY,
      village.villageId
    );

    if (!placeResult.success || !placeResult.newBuilding) {
      return reply.status(400).send({
        success: false,
        error: { code: 'GRID_PLACEMENT_ERROR', message: placeResult.error },
        serverTimestamp: Date.now()
      });
    }

    const deduct = EconomyService.deductResources(village.balances, cost);
    village.balances = deduct.newBalances;
    village.buildings.push(placeResult.newBuilding);

    const rates = VillageService.calculateVillageRates(village.buildings);
    village.productionPerHour = rates.productionPerHour;
    village.capacities = rates.capacities;

    return {
      success: true,
      data: {
        building: placeResult.newBuilding,
        newBalances: village.balances,
        newRates: rates
      },
      serverTimestamp: Date.now()
    };
  });

  // 6. Recrutamento de Tropas
  app.post('/api/units/train', { preHandler: [authenticate] }, async (req: FastifyRequest<{ Body: { unitType: UnitType; count: number } }>, reply) => {
    const userPayload = req.user as { userId: string; villageId: string };
    const { unitType, count } = req.body || {};

    const village = inMemoryDb.villages.get(userPayload.villageId);
    if (!village) {
      return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Vila não encontrada.' } });
    }

    const def = UNITS_CATALOG[unitType];
    if (!def || !count || count <= 0) {
      return reply.status(400).send({ success: false, error: { code: 'INVALID_REQUEST', message: 'Parâmetros inválidos.' } });
    }

    const totalCost = {
      alimento: (def.cost.alimento || 0) * count,
      madeira: (def.cost.madeira || 0) * count,
      pedra: (def.cost.pedra || 0) * count,
      ferro: (def.cost.ferro || 0) * count,
      ouro: (def.cost.ouro || 0) * count
    };

    EconomyService.tickVillageResources(village, Date.now());

    if (!EconomyService.canAfford(village.balances, totalCost)) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INSUFFICIENT_RESOURCES', message: 'Recursos insuficientes.' },
        serverTimestamp: Date.now()
      });
    }

    const deduct = EconomyService.deductResources(village.balances, totalCost);
    village.balances = deduct.newBalances;
    village.units[unitType] = (village.units[unitType] || 0) + count;

    return {
      success: true,
      data: {
        trainedUnit: unitType,
        count,
        totalQuantity: village.units[unitType],
        newBalances: village.balances
      },
      serverTimestamp: Date.now()
    };
  });

  // 7. Campanha Histórica PvE
  app.get('/api/combat/pve', { preHandler: [authenticate] }, async () => {
    return {
      success: true,
      data: {
        missions: PVE_CAMPAIGN_MISSIONS
      },
      serverTimestamp: Date.now()
    };
  });

  // 8. Matchmaking PvP
  app.get('/api/combat/matchmaking', { preHandler: [authenticate] }, async (req: FastifyRequest) => {
    const targetSnapshot: DefensiveSnapshot = {
      villageId: 'vlg_rival_babilionia_01',
      defenderUserId: 'usr_rival_01',
      defenderName: 'Rei Nabonido da Babilônia',
      civilization: 'babiloneo',
      era: 1,
      shieldActiveUntil: 0,
      availableLoot: { alimento: 2400, madeira: 1800, pedra: 1200, ferro: 600, ouro: 1500, gemas: 0 },
      buildings: [
        { id: 'def_bld_center', type: 'CENTRO_IMPERIAL', level: 1, gridX: 20, gridY: 20, maxHealth: 2000, currentHealth: 2000, isDefense: false },
        { id: 'def_bld_tower1', type: 'TORRE_ARQUEIROS', level: 1, gridX: 18, gridY: 18, maxHealth: 600, currentHealth: 600, isDefense: true, damagePerSecond: 35, range: 5 },
        { id: 'def_bld_granary', type: 'CELEIRO', level: 1, gridX: 23, gridY: 20, maxHealth: 700, currentHealth: 700, isDefense: false },
        { id: 'def_bld_warehouse', type: 'ARMAZEM', level: 1, gridX: 20, gridY: 24, maxHealth: 800, currentHealth: 800, isDefense: false }
      ]
    };

    return {
      success: true,
      data: {
        targets: [targetSnapshot]
      },
      serverTimestamp: Date.now()
    };
  });

  // 9. Simulação Autoritativa de Combate
  app.post('/api/combat/simulate', { preHandler: [authenticate] }, async (req: FastifyRequest<{ Body: { defenderVillageId: string; deployedArmy: { unitType: UnitType; count: number }[] } }>, reply) => {
    const userPayload = req.user as { userId: string; villageId: string };
    const { deployedArmy } = req.body || {};

    const village = inMemoryDb.villages.get(userPayload.villageId);
    if (!village) {
      return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Vila atacante não encontrada.' } });
    }

    const defenderSnapshot: DefensiveSnapshot = {
      villageId: 'vlg_rival_babilionia_01',
      defenderUserId: 'usr_rival_01',
      defenderName: 'Guarnição Rebelde',
      civilization: 'babiloneo',
      era: 1,
      shieldActiveUntil: 0,
      availableLoot: { alimento: 2000, madeira: 1500, pedra: 800, ferro: 400, ouro: 1200, gemas: 0 },
      buildings: [
        { id: 't_bld_1', type: 'CENTRO_IMPERIAL', level: 1, gridX: 20, gridY: 20, maxHealth: 2000, currentHealth: 2000, isDefense: false },
        { id: 't_bld_2', type: 'TORRE_ARQUEIROS', level: 1, gridX: 18, gridY: 18, maxHealth: 600, currentHealth: 600, isDefense: true, damagePerSecond: 30, range: 5 },
        { id: 't_bld_3', type: 'CELEIRO', level: 1, gridX: 22, gridY: 20, maxHealth: 700, currentHealth: 700, isDefense: false }
      ]
    };

    const battleId = `btl_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const simResult = CombatService.simulateBattle(
      battleId,
      userPayload.villageId,
      defenderSnapshot,
      deployedArmy || [{ unitType: UnitType.IMORTAL_PERSA, count: 10 }]
    );

    if (simResult.isVictory && simResult.lootPlundered) {
      village.balances = EconomyService.creditResources(village.balances, village.capacities, simResult.lootPlundered);
    }

    return {
      success: true,
      data: {
        battleResult: simResult,
        updatedBalances: village.balances
      },
      serverTimestamp: Date.now()
    };
  });

  // 10. Loja e Compras
  app.get('/api/store/products', async () => {
    return {
      success: true,
      data: {
        catalog: STORE_CATALOG
      },
      serverTimestamp: Date.now()
    };
  });

  app.post('/api/store/purchase', { preHandler: [authenticate] }, async (req: FastifyRequest<{ Body: { receiptToken: string; sku: string } }>, reply) => {
    const userPayload = req.user as { userId: string; villageId: string };
    const { receiptToken, sku } = req.body || {};

    const village = inMemoryDb.villages.get(userPayload.villageId);
    if (!village) {
      return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Vila não encontrada.' } });
    }

    const purchase = ShieldAndStoreManager.processPurchase(
      receiptToken || `token_${Date.now()}`,
      sku,
      village.balances.gemas,
      village.shieldActiveUntil
    );

    if (!purchase.success) {
      return reply.status(400).send({ success: false, error: { code: 'PURCHASE_FAILED', message: purchase.error } });
    }

    village.balances.gemas = purchase.newGems;
    village.shieldActiveUntil = purchase.newShieldExpiresAt;

    return {
      success: true,
      data: {
        newGems: purchase.newGems,
        newShieldExpiresAt: purchase.newShieldExpiresAt,
        entitlement: purchase.entitlementGranted
      },
      serverTimestamp: Date.now()
    };
  });

  // 11. Alianças
  app.post('/api/alliance/create', { preHandler: [authenticate] }, async (req: FastifyRequest<{ Body: { name: string; tag: string; description: string } }>, reply) => {
    const userPayload = req.user as { userId: string };
    const { name, tag, description } = req.body || {};

    const result = AllianceManager.createAlliance(userPayload.userId, 'Sátrapa Imperial', name, tag, description);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: { code: 'ALLIANCE_ERROR', message: result.error } });
    }

    return {
      success: true,
      data: {
        alliance: result.alliance
      },
      serverTimestamp: Date.now()
    };
  });

  // 12. Painel Administrativo
  app.get('/api/admin/metrics', async () => {
    const stats = AdminService.computeGlobalEconomyStats(1500000, 3200000, 85000, 420);
    return {
      success: true,
      data: {
        globalStats: stats,
        auditLogs: AdminService.getAuditLogs()
      },
      serverTimestamp: Date.now()
    };
  });

  return app;
}
