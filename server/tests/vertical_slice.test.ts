import { describe, it, expect } from 'vitest';
import {
  calculateOfflineProduction,
  IsometricGridValidator,
  AStarPathfinder,
  TerrainType,
  BuildingType,
  CivilizationId,
  UnitType,
  calculateBattleStars,
  ResourceAmount,
  VILLAGE_GRID_SIZE,
  EraId
} from '@imperios/shared';
import { EconomyService } from '../src/modules/economy/economyService.js';
import { VillageService } from '../src/modules/village/villageService.js';
import { CombatService } from '../src/modules/combat/combatService.js';
import { ConstructionManager } from '../src/modules/village/constructionManager.js';
import { EraProgressionManager } from '../src/modules/economy/eraProgressionManager.js';
import { CharacterFSM, CharacterRole, CharacterState } from '../src/modules/units/characterFsm.js';
import { TrainingQueueManager } from '../src/modules/units/trainingQueueManager.js';
import { PVE_CAMPAIGN_MISSIONS } from '../src/modules/combat/pveCampaignManager.js';
import { PvPMatchmakingManager } from '../src/modules/combat/pvpMatchmakingManager.js';
import { ALL_CIVILIZATIONS_CATALOG } from '../src/modules/civilization/civilizationsCatalog.js';
import { STORE_CATALOG, ShieldAndStoreManager } from '../src/modules/shield/shieldAndStoreManager.js';
import { AllianceManager, AllianceRole } from '../src/modules/alliance/allianceManager.js';
import { AdminService } from '../src/modules/admin/adminService.js';
import { SecurityService } from '../src/modules/security/securityService.js';
import { buildApp } from '../src/app.js';

describe('SUITE COMPLETA DE TESTES AUTOMATIZADOS (FASES 1 A 14) — IMPÉRIOS', () => {

  describe('FASE 1: Economia Autoritativa e Integridade de Saldos', () => {
    it('deve calcular a produção offline respeitando timestamps exatos do servidor', () => {
      const result = calculateOfflineProduction(500, 2000, 3600, 1000000, 1030000);
      expect(result.produced).toBe(30);
      expect(result.currentAmount).toBe(530);
    });

    it('não deve exceder a capacidade máxima de celeiro/armazém', () => {
      const result = calculateOfflineProduction(1950, 2000, 7200, 1000000, 1060000);
      expect(result.produced).toBe(50);
      expect(result.currentAmount).toBe(2000);
    });

    it('deve prevenir saldos negativos em deduções', () => {
      const balances: ResourceAmount = { alimento: 100, madeira: 50, pedra: 0, ferro: 0, ouro: 0, gemas: 10 };
      expect(EconomyService.canAfford(balances, { alimento: 200 })).toBe(false);
      const res = EconomyService.deductResources(balances, { alimento: 200 });
      expect(res.success).toBe(false);
      expect(res.newBalances.alimento).toBe(100);
    });
  });

  describe('FASE 2: Terreno, Grade Isométrica 40x40 e Pathfinding A*', () => {
    it('deve gerar matriz de terreno 40x40 com Estrada Real, Oásis e Rocha', () => {
      const terrain = IsometricGridValidator.createPersianVillageTerrain(VILLAGE_GRID_SIZE);
      expect(terrain.length).toBe(40);
      expect(terrain[6][6].terrain).toBe(TerrainType.AGUA_OASIS);
      expect(terrain[6][6].isWalkable).toBe(false);
      expect(terrain[10][20].terrain).toBe(TerrainType.ESTRADA_REAL);
      expect(terrain[10][20].movementCost).toBeLessThan(1.0);
    });

    it('deve converter coordenadas isometricamente com precisão reversível', () => {
      const { isoX, isoY } = IsometricGridValidator.gridToIsometric(14, 22);
      const converted = IsometricGridValidator.isometricToGrid(isoX, isoY);
      expect(converted.x).toBe(14);
      expect(converted.y).toBe(22);
    });

    it('deve encontrar rota navegável com A* contornando corpos dágua', () => {
      const terrain = IsometricGridValidator.createPersianVillageTerrain(VILLAGE_GRID_SIZE);
      const path = AStarPathfinder.findPath({ x: 2, y: 6 }, { x: 10, y: 6 }, terrain, VILLAGE_GRID_SIZE);
      expect(path.length).toBeGreaterThan(0);
      for (const node of path) {
        expect(terrain[node.x][node.y].isWalkable).toBe(true);
      }
    });
  });

  describe('FASE 3: Ciclo de Vida de Construção e Filas de Construtores', () => {
    it('deve limitar a quantidade de obras simultâneas pelo número de construtores', () => {
      const activeJobs: any[] = [];
      const now = Date.now();

      const job1 = ConstructionManager.startConstruction('v1', 'b1', BuildingType.FAZENDA, CivilizationId.PERSA, activeJobs, now, 2);
      expect(job1.success).toBe(true);

      const job2 = ConstructionManager.startConstruction('v1', 'b2', BuildingType.SERRARIA, CivilizationId.PERSA, activeJobs, now, 2);
      expect(job2.success).toBe(true);

      const job3 = ConstructionManager.startConstruction('v1', 'b3', BuildingType.QUARTEL, CivilizationId.PERSA, activeJobs, now, 2);
      expect(job3.success).toBe(false);
      expect(job3.error).toContain('ocupados');
    });

    it('deve processar e concluir obras após o tempo de término', () => {
      const buildings = VillageService.createInitialPersianVillage('v1');
      const farm = buildings.find(b => b.type === BuildingType.FAZENDA)!;
      const activeJobs: any[] = [];
      const now = 1000000;

      ConstructionManager.startUpgrade(farm, activeJobs, now);
      expect(activeJobs.length).toBe(1);

      // Simula tempo futuro após a conclusão da obra
      const finishTime = activeJobs[0].finishTime;
      const result = ConstructionManager.processCompletedJobs(buildings, activeJobs, finishTime + 1000);

      expect(result.completedBuildingIds).toContain(farm.id);
      expect(farm.level).toBe(2);
      expect(result.remainingJobs.length).toBe(0);
    });
  });

  describe('FASE 4: Progressão das 6 Eras e Prestígio', () => {
    it('deve avaliar a era correta com base no nível do Centro Imperial', () => {
      const era1 = EraProgressionManager.evaluateVillageEra(1);
      expect(era1.currentEra).toBe(EraId.FUNDACAO);

      const era2 = EraProgressionManager.evaluateVillageEra(3);
      expect(era2.currentEra).toBe(EraId.CONSOLIDACAO);

      const era6 = EraProgressionManager.evaluateVillageEra(12);
      expect(era6.currentEra).toBe(EraId.ERA_IMPERIAL);
    });

    it('deve calcular prestígio sazonal apenas após atingir o Apogeu', () => {
      expect(EraProgressionManager.calculateSeasonalPrestigeGains(EraId.FUNDACAO, 500, 10)).toBe(0);
      const prestige = EraProgressionManager.calculateSeasonalPrestigeGains(EraId.ERA_IMPERIAL, 1000, 20);
      expect(prestige).toBeGreaterThan(500);
    });
  });

  describe('FASE 5: Máquina de Estados Finitos (FSM) dos Personagens', () => {
    it('deve transicionar trabalhadores civis de IDLE para WORKING', () => {
      const ctx = {
        id: 'c1',
        role: CharacterRole.CIVILIAN_WORKER,
        state: CharacterState.IDLE,
        health: 100,
        maxHealth: 100,
        position: { x: 10, y: 10 },
        homePosition: { x: 10, y: 10 },
        attackRange: 1,
        attackSpeed: 1,
        lastActionSec: 0
      };

      const nextState = CharacterFSM.updateState(ctx, 1);
      expect(nextState).toBe(CharacterState.WORKING);
    });

    it('deve definir estado DEAD se a vida zerar', () => {
      const ctx = {
        id: 'c2',
        role: CharacterRole.MILITARY_MELEE,
        state: CharacterState.ATTACKING,
        health: 0,
        maxHealth: 100,
        position: { x: 10, y: 10 },
        homePosition: { x: 10, y: 10 },
        attackRange: 1,
        attackSpeed: 1,
        lastActionSec: 0
      };

      expect(CharacterFSM.updateState(ctx, 1)).toBe(CharacterState.DEAD);
    });
  });

  describe('FASE 6: Recrutamento e Filas de Tropas', () => {
    it('deve respeitar a capacidade máxima de habitação', () => {
      const army = { [UnitType.IMORTAL_PERSA]: 45 }; // 45 * 2 = 90 espaço
      const queue: any[] = [];
      const res = TrainingQueueManager.enqueueRecruitment('v1', UnitType.IMORTAL_PERSA, 10, army, queue, Date.now(), 100);
      expect(res.success).toBe(false); // Precisa de 20 de espaço, mas só restam 10
      expect(res.error).toContain('insuficiente');
    });

    it('deve recrutar e adicionar tropas ao exército após conclusão do tempo', () => {
      const army = { [UnitType.IMORTAL_PERSA]: 10 };
      const queue: any[] = [];
      const now = 1000000;
      TrainingQueueManager.enqueueRecruitment('v1', UnitType.IMORTAL_PERSA, 2, army, queue, now, 100);

      expect(queue.length).toBe(1);
      const finishTime = queue[0].finishTime;

      const res = TrainingQueueManager.processCompletedTraining(army, queue, finishTime + 100);
      expect(res.trainedUnits[UnitType.IMORTAL_PERSA]).toBe(2);
      expect(army[UnitType.IMORTAL_PERSA]).toBe(12);
      expect(res.remainingQueue.length).toBe(0);
    });
  });

  describe('FASE 7: Campanha Histórica PvE', () => {
    it('deve conter missões históricas válidas com snapshots de combate', () => {
      expect(PVE_CAMPAIGN_MISSIONS.length).toBeGreaterThanOrEqual(3);
      const mission1 = PVE_CAMPAIGN_MISSIONS[0];
      expect(mission1.missionId).toBe('pve_01_estepe');
      expect(mission1.firstClearRewards.gemas).toBeGreaterThan(0);
      expect(mission1.snapshot.buildings.length).toBeGreaterThan(0);
    });
  });

  describe('FASE 8: PvP Matchmaking e Bloqueio Concorrente', () => {
    it('deve conceder escudo proporcional às estrelas de destruição sofrida', () => {
      expect(PvPMatchmakingManager.calculateDefeatShieldDuration(3, 100)).toBe(16 * 3600 * 1000);
      expect(PvPMatchmakingManager.calculateDefeatShieldDuration(2, 65)).toBe(12 * 3600 * 1000);
      expect(PvPMatchmakingManager.calculateDefeatShieldDuration(0, 10)).toBe(0);
    });

    it('deve impedir dois ataques simultâneos à mesma vila via trava concorrente', () => {
      const vId = 'target_village_lock_test';
      expect(PvPMatchmakingManager.acquireAttackLock(vId, 'attacker_1', 180)).toBe(true);
      expect(PvPMatchmakingManager.acquireAttackLock(vId, 'attacker_2', 180)).toBe(false);
      PvPMatchmakingManager.releaseAttackLock(vId);
      expect(PvPMatchmakingManager.acquireAttackLock(vId, 'attacker_2', 180)).toBe(true);
      PvPMatchmakingManager.releaseAttackLock(vId);
    });
  });

  describe('FASE 9: Catálogo Completo das 12 Civilizações', () => {
    it('deve conter exatamente as 12 civilizações configuradas de forma orientada a dados', () => {
      const civKeys = Object.keys(ALL_CIVILIZATIONS_CATALOG);
      expect(civKeys.length).toBe(12);
      expect(ALL_CIVILIZATIONS_CATALOG[CivilizationId.PERSA].name).toContain('Persa');
      expect(ALL_CIVILIZATIONS_CATALOG[CivilizationId.ROMANO].name).toContain('Romano');
      expect(ALL_CIVILIZATIONS_CATALOG[CivilizationId.VIKING].name).toContain('Viking');
    });
  });

  describe('FASE 10: Escudos e Loja Idempotente', () => {
    it('deve processar compra de pacote de gemas e impedir duplicidade com mesmo recibo', () => {
      const receipt = 'receipt_test_token_unique_1';
      const initialGems = 100;
      const initialShield = Date.now();

      const p1 = ShieldAndStoreManager.processPurchase(receipt, 'gems_pouch_500', initialGems, initialShield);
      expect(p1.success).toBe(true);
      expect(p1.newGems).toBe(600);

      const p2 = ShieldAndStoreManager.processPurchase(receipt, 'gems_pouch_500', 600, initialShield);
      expect(p2.success).toBe(false);
      expect(p2.error).toContain('Anti-Replay');
    });
  });

  describe('FASE 11: Sistema de Alianças e Doações', () => {
    it('deve criar aliança com líder e permitir entrada e doação de tropas', () => {
      const createRes = AllianceManager.createAlliance('u1', 'Ciro', 'Legião de Persépolis', 'PERS', 'Aliança oficial');
      expect(createRes.success).toBe(true);
      const allianceId = createRes.alliance!.id;

      const joinRes = AllianceManager.joinAlliance(allianceId, 'u2', 'Dario', 1200);
      expect(joinRes.success).toBe(true);

      const donateRes = AllianceManager.donateTroops(allianceId, 'u1', 'u2', 'IMORTAL_PERSA', 5);
      expect(donateRes.success).toBe(true);
    });
  });

  describe('FASE 12: Painel Administrativo e Auditoria', () => {
    it('deve banir usuário e registrar log de auditoria rastreável', () => {
      const audit = AdminService.banUser('admin_root', 'user_cheater_99', 'Uso de modificações não autorizadas');
      expect(audit.action).toBe('BAN_USER');
      expect(AdminService.isUserBanned('user_cheater_99')).toBe(true);

      AdminService.unbanUser('admin_root', 'user_cheater_99');
      expect(AdminService.isUserBanned('user_cheater_99')).toBe(false);
    });
  });

  describe('FASE 13: Segurança e Rate Limiting', () => {
    it('deve aplicar limitação de taxa (Rate Limit) após exceder requisições por minuto', () => {
      const clientId = 'ip_test_rate_limiter';
      for (let i = 0; i < 59; i++) {
        expect(SecurityService.checkRateLimit(clientId, 60).allowed).toBe(true);
      }
      expect(SecurityService.checkRateLimit(clientId, 60).allowed).toBe(true); // 60ª
      expect(SecurityService.checkRateLimit(clientId, 60).allowed).toBe(false); // 61ª bloqueada
    });
  });

  describe('FASE 14: Integração de Endpoints REST (Fastify)', () => {
    const app = buildApp();

    it('GET /api/health deve responder com métricas de sistema', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/health' });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload).success).toBe(true);
    });

    it('GET /api/civilizations/all deve listar todas as 12 civilizações', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/civilizations/all' });
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.payload).data;
      expect(data.totalCivilizations).toBe(12);
    });

    it('GET /api/store/products deve retornar o catálogo da loja', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/store/products' });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload).data.catalog.length).toBeGreaterThan(0);
    });
  });

});
