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
  VILLAGE_GRID_SIZE
} from '@imperios/shared';
import { EconomyService } from '../src/modules/economy/economyService.js';
import { VillageService } from '../src/modules/village/villageService.js';
import { CombatService } from '../src/modules/combat/combatService.js';
import { buildApp } from '../src/app.js';

describe('SUITE DE TESTES AUTOMATIZADOS — PROJETO IMPÉRIOS', () => {

  describe('FASE 1: Economia Autoritativa e Produção Offline Segura', () => {
    it('deve calcular a produção offline respeitando timestamps exatos do servidor', () => {
      const lastBalance = 500;
      const capacity = 2000;
      const productionPerHour = 3600; // 1 recurso por segundo
      const lastTimestamp = 1000000;
      const currentTimestamp = lastTimestamp + 30000; // 30 segundos decorridos

      const result = calculateOfflineProduction(
        lastBalance,
        capacity,
        productionPerHour,
        lastTimestamp,
        currentTimestamp
      );

      expect(result.produced).toBe(30);
      expect(result.currentAmount).toBe(530);
    });

    it('não deve exceder a capacidade máxima de armazenamento de celeiro/armazém', () => {
      const lastBalance = 1950;
      const capacity = 2000;
      const productionPerHour = 7200; // 2 recursos por segundo
      const lastTimestamp = 1000000;
      const currentTimestamp = lastTimestamp + 60000; // 60 segundos (produziria 120, mas cabe apenas 50)

      const result = calculateOfflineProduction(
        lastBalance,
        capacity,
        productionPerHour,
        lastTimestamp,
        currentTimestamp
      );

      expect(result.produced).toBe(50);
      expect(result.currentAmount).toBe(2000);
    });

    it('deve impedir saldos negativos e transações fraudulentas', () => {
      const currentBalances: ResourceAmount = {
        alimento: 100,
        madeira: 50,
        pedra: 0,
        ferro: 0,
        ouro: 0,
        gemas: 10
      };

      const highCost = { alimento: 200, madeira: 50 };
      expect(EconomyService.canAfford(currentBalances, highCost)).toBe(false);

      const deductResult = EconomyService.deductResources(currentBalances, highCost);
      expect(deductResult.success).toBe(false);
      expect(deductResult.newBalances.alimento).toBe(100);
    });
  });

  describe('FASE 1: Motor de Combate Autoritativo e Regras de Estrelas', () => {
    it('deve calcular estrelas canônicas rigorosamente', () => {
      expect(calculateBattleStars(20, false)).toBe(0);
      expect(calculateBattleStars(50, false)).toBe(1);
      expect(calculateBattleStars(30, true)).toBe(1);
      expect(calculateBattleStars(50, true)).toBe(2);
      expect(calculateBattleStars(100, true)).toBe(3);
    });

    it('deve simular batalha determinística de Imortais Persas com vitória', () => {
      const dummySnapshot = {
        villageId: 'rival_test_01',
        defenderUserId: 'rival_u1',
        defenderName: 'Posto Fronteiriço',
        civilization: 'babiloneo',
        era: 1,
        shieldActiveUntil: 0,
        availableLoot: { alimento: 1000, madeira: 1000, pedra: 500, ferro: 200, ouro: 500, gemas: 0 },
        buildings: [
          {
            id: 'bld_center',
            type: 'CENTRO_IMPERIAL',
            level: 1,
            gridX: 20,
            gridY: 20,
            maxHealth: 500,
            currentHealth: 500,
            isDefense: false
          }
        ]
      };

      const result = CombatService.simulateBattle(
        'test_battle_01',
        'attacker_01',
        dummySnapshot,
        [{ unitType: UnitType.IMORTAL_PERSA, count: 10 }],
        60
      );

      expect(result.destructionPercentage).toBe(100);
      expect(result.stars).toBe(3);
      expect(result.isVictory).toBe(true);
      expect(result.lootPlundered.ouro).toBeGreaterThan(0);
      expect(result.events.length).toBeGreaterThan(0);
    });
  });

  describe('FASE 2: Terreno, Câmera e Grade Isométrica', () => {
    it('deve gerar corretamente o bioma do planalto persa (40x40 com oásis e rochas)', () => {
      const terrain = IsometricGridValidator.createPersianVillageTerrain(VILLAGE_GRID_SIZE);
      expect(terrain.length).toBe(40);
      expect(terrain[0].length).toBe(40);

      // Verifica Oásis em (6, 6)
      expect(terrain[6][6].terrain).toBe(TerrainType.AGUA_OASIS);
      expect(terrain[6][6].isWalkable).toBe(false);

      // Verifica Rocha em (33, 7)
      expect(terrain[33][7].terrain).toBe(TerrainType.ROCHA);
      expect(terrain[33][7].isWalkable).toBe(false);

      // Verifica Estrada Real em (10, 20) com custo de movimento reduzido
      expect(terrain[10][20].terrain).toBe(TerrainType.ESTRADA_REAL);
      expect(terrain[10][20].isWalkable).toBe(true);
      expect(terrain[10][20].movementCost).toBeLessThan(1.0);
    });

    it('deve realizar conversão precisa e reversível entre Grade e Tela Isométrica 2:1', () => {
      const origX = 14;
      const origY = 22;
      const tileW = 64;
      const tileH = 32;

      const { isoX, isoY } = IsometricGridValidator.gridToIsometric(origX, origY, tileW, tileH);
      const converted = IsometricGridValidator.isometricToGrid(isoX, isoY, tileW, tileH);

      expect(converted.x).toBe(origX);
      expect(converted.y).toBe(origY);
    });

    it('deve calcular caminho viável com A* contornando obstáculos naturais (Oásis)', () => {
      const terrain = IsometricGridValidator.createPersianVillageTerrain(VILLAGE_GRID_SIZE);
      const start = { x: 2, y: 6 }; // Oeste do Oásis
      const target = { x: 10, y: 6 }; // Leste do Oásis (Oásis está no meio em x: 6, y: 6)

      const path = AStarPathfinder.findPath(start, target, terrain, VILLAGE_GRID_SIZE);

      expect(path.length).toBeGreaterThan(0);
      expect(path[0]).toEqual(start);
      expect(path[path.length - 1]).toEqual(target);

      // Nenhum nó do caminho pode passar por água ou obstáculo intransponível
      for (const node of path) {
        expect(terrain[node.x][node.y].isWalkable).toBe(true);
      }
    });

    it('deve retornar caminho vazio quando o alvo for intransponível', () => {
      const terrain = IsometricGridValidator.createPersianVillageTerrain(VILLAGE_GRID_SIZE);
      const start = { x: 2, y: 2 };
      const waterTarget = { x: 6, y: 6 }; // Centro do Oásis

      const path = AStarPathfinder.findPath(start, waterTarget, terrain, VILLAGE_GRID_SIZE);
      expect(path.length).toBe(0);
    });
  });

  describe('Integração dos Endpoints da API REST (Fastify)', () => {
    const app = buildApp();

    it('GET /api/health deve retornar status UP e timestamp', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/health'
      });

      expect(response.statusCode).toBe(200);
      const json = JSON.parse(response.payload);
      expect(json.success).toBe(true);
      expect(json.data.game).toBe('IMPÉRIOS — Ascensão das Civilizações');
    });

    it('POST /api/auth/guest deve criar usuário e vila persa inicial com JWT', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/guest',
        payload: {
          deviceId: 'test_device_persia_fase2',
          playerName: 'Dario I',
          civilization: CivilizationId.PERSA
        }
      });

      expect(response.statusCode).toBe(200);
      const json = JSON.parse(response.payload);
      expect(json.success).toBe(true);
      expect(json.data.token).toBeDefined();

      const stateResponse = await app.inject({
        method: 'GET',
        url: '/api/village/state',
        headers: {
          authorization: `Bearer ${json.data.token}`
        }
      });

      expect(stateResponse.statusCode).toBe(200);
      const stateJson = JSON.parse(stateResponse.payload);
      expect(stateJson.success).toBe(true);
      expect(stateJson.data.buildings.length).toBeGreaterThanOrEqual(4);
    });
  });

});
