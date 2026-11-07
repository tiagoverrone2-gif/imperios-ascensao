/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Serviço de Autenticação, Identidade e Vinculação de Dispositivo
 */

import { CivilizationId } from '@imperios/shared';
import { VillageService } from '../village/villageService.js';
import { VillageBuildingInstance, ResourceAmount } from '@imperios/shared';

export interface UserSessionData {
  userId: string;
  deviceId: string;
  villageId: string;
  playerName: string;
  civilization: CivilizationId;
}

// Armazenamento em memória autoritativo para a Vertical Slice (sincronizável com Prisma / D1)
export const inMemoryDb = {
  users: new Map<string, { id: string; deviceId: string; name: string; civ: CivilizationId; villageId: string }>(),
  villages: new Map<string, {
    villageId: string;
    userId: string;
    name: string;
    civ: CivilizationId;
    era: number;
    buildings: VillageBuildingInstance[];
    balances: ResourceAmount;
    capacities: ResourceAmount;
    productionPerHour: ResourceAmount;
    lastCalculatedAt: number;
    units: Record<string, number>;
    shieldActiveUntil: number;
  }>()
};

export class AuthService {
  static authenticateGuest(
    deviceId: string,
    playerName: string = 'Sátrapa Imperial',
    chosenCiv: CivilizationId = CivilizationId.PERSA
  ): UserSessionData {
    let existingUser = Array.from(inMemoryDb.users.values()).find((u) => u.deviceId === deviceId);

    if (!existingUser) {
      const userId = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const villageId = `vlg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const initialBuildings = VillageService.createInitialPersianVillage(villageId);
      const { productionPerHour, capacities } = VillageService.calculateVillageRates(initialBuildings);

      const initialBalances: ResourceAmount = {
        alimento: 1000,
        madeira: 1000,
        pedra: 800,
        ferro: 500,
        ouro: 800,
        gemas: 250 // Bônus inicial de gemas
      };

      inMemoryDb.villages.set(villageId, {
        villageId,
        userId,
        name: `Vila de ${playerName}`,
        civ: chosenCiv,
        era: 1,
        buildings: initialBuildings,
        balances: initialBalances,
        capacities,
        productionPerHour,
        lastCalculatedAt: Date.now(),
        units: {
          IMORTAL_PERSA: 15,
          ARQUEIRO: 20,
          LANCEIRO: 10
        },
        shieldActiveUntil: Date.now() + 24 * 3600 * 1000 // Escudo de iniciante 24h
      });

      existingUser = {
        id: userId,
        deviceId,
        name: playerName,
        civ: chosenCiv,
        villageId
      };

      inMemoryDb.users.set(userId, existingUser);
    }

    return {
      userId: existingUser.id,
      deviceId: existingUser.deviceId,
      villageId: existingUser.villageId,
      playerName: existingUser.name,
      civilization: existingUser.civ
    };
  }
}
