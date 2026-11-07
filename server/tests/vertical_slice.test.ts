import { describe, it, expect } from 'vitest';
import {
  calculateOfflineProduction,
  IsometricGridValidator,
  BuildingType,
  CivilizationId,
  UnitType,
  calculateBattleStars,
  ResourceAmount
} from '@imperios/shared';
import { EconomyService } from '../src/modules/economy/economyService.js';
import { VillageService } from '../src/modules/village/villageService.js';
import { CombatService } from '../src/modules/combat/combatService.js';
import { buildApp } from '../src/app.js';

describe('FASE 1: SUITE DE TESTES AUTOMATIZADOS - VERTICAL SLICE PERSA', () => {

  describe('1. Economia Autoritativa e Produção Offline Segura', () => {
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
      expect(deductResult.newBalances.alimento).toBe(100); // Saldo permanece inalterado
    });
  });

  describe('2. Validação Espacial da Grade Isométrica', () => {
    it('deve detectar corretamente colisões entre edifícios na grade', () => {
      const buildingA = { x: 10, y: 10 };
      const dimsA = { width: 3, height: 3 }; // Ocupa de 10 a 12 em X e Y

      const collidingBuilding = { x: 12, y: 11 };
      const dimsCol = { width: 2, height: 2 }; // Ocupa 12 e 13 -> sobrepõe em 12

      const nonCollidingBuilding = { x: 13, y: 10 };
      const dimsNon = { width: 2, height: 2 };

      expect(IsometricGridValidator.checkCollision(buildingA, dimsA, collidingBuilding, dimsCol)).toBe(true);
      expect(IsometricGridValidator.checkCollision(buildingA, dimsA, nonCollidingBuilding, dimsNon)).toBe(false);
    });

    it('deve rejeitar edifícios que ultrapassem a borda da vila (40x40)', () => {
      const outOfBoundsCoord = { x: 39, y: 39 };
      const farmDims = { width: 3, height: 3 }; // 39 + 3 = 42 > 40

      expect(IsometricGridValidator.isWithinBounds(outOfBoundsCoord, farmDims, 40)).toBe(false);
    });
  });

  describe('3. Motor de Combate Autoritativo e Regras de Estrelas', () => {
    it('deve calcular estrelas canônicas rigorosamente', () => {
      // 0% sem centro imperial = 0 estrelas
      expect(calculateBattleStars(20, false)).toBe(0);
      // Destruição de 50% sem centro imperial = 1 estrela
      expect(calculateBattleStars(50, false)).toBe(1);
      // Destruição do Centro Imperial com menos de 50% = 1 estrela
      expect(calculateBattleStars(30, true)).toBe(1);
      // Centro Imperial destruído E pelo menos 50% = 2 estrelas
      expect(calculateBattleStars(50, true)).toBe(2);
      // 100% de destruição = 3 estrelas supremas
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

      // 10 Imortais Persas atacam um centro imperial fraco
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

  describe('4. Integração dos Endpoints da API REST (Fastify)', () => {
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
          deviceId: 'test_device_persia_123',
          playerName: 'Ciro, o Grande',
          civilization: CivilizationId.PERSA
        }
      });

      expect(response.statusCode).toBe(200);
      const json = JSON.parse(response.payload);
      expect(json.success).toBe(true);
      expect(json.data.token).toBeDefined();
      expect(json.data.civilization).toBe('persa');

      // Testa requisição autenticada subsequente
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
      expect(stateJson.data.buildings.length).toBeGreaterThanOrEqual(4); // Centro, fazenda, serraria, quartel
      expect(stateJson.data.civilization).toBe('persa');
    });
  });

});
