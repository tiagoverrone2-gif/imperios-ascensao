/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Serviço de Gerenciamento de Vila, Grade e Construções
 */

import {
  CivilizationId,
  BuildingType,
  BUILDINGS_CATALOG,
  IsometricGridValidator,
  VILLAGE_GRID_SIZE,
  VillageBuildingInstance,
  BuildingOperationalState,
  ResourceAmount,
  ResourceType
} from '@imperios/shared';
import { EconomyService } from '../economy/economyService.js';

export class VillageService {
  /**
   * Cria uma vila inicial para o Império Persa com as construções fundamentais
   */
  static createInitialPersianVillage(villageId: string): VillageBuildingInstance[] {
    const now = Date.now();
    return [
      // Centro Imperial Persa (Apadana) no centro da grade (x: 18, y: 18)
      {
        id: `bld_${villageId}_apadana`,
        villageId,
        type: BuildingType.CENTRO_IMPERIAL,
        civilization: CivilizationId.PERSA,
        level: 1,
        position: { x: 18, y: 18 },
        dimensions: BUILDINGS_CATALOG[BuildingType.CENTRO_IMPERIAL].dimensions,
        currentHealth: BUILDINGS_CATALOG[BuildingType.CENTRO_IMPERIAL].maxHealthByLevel[1],
        maxHealth: BUILDINGS_CATALOG[BuildingType.CENTRO_IMPERIAL].maxHealthByLevel[1],
        state: BuildingOperationalState.OPERATIONAL,
        createdAt: now
      },
      // Fazenda com Qanat (x: 14, y: 18)
      {
        id: `bld_${villageId}_farm1`,
        villageId,
        type: BuildingType.FAZENDA,
        civilization: CivilizationId.PERSA,
        level: 1,
        position: { x: 14, y: 18 },
        dimensions: BUILDINGS_CATALOG[BuildingType.FAZENDA].dimensions,
        currentHealth: BUILDINGS_CATALOG[BuildingType.FAZENDA].maxHealthByLevel[1],
        maxHealth: BUILDINGS_CATALOG[BuildingType.FAZENDA].maxHealthByLevel[1],
        state: BuildingOperationalState.OPERATIONAL,
        createdAt: now
      },
      // Serraria de Cedro (x: 23, y: 18)
      {
        id: `bld_${villageId}_sawmill1`,
        villageId,
        type: BuildingType.SERRARIA,
        civilization: CivilizationId.PERSA,
        level: 1,
        position: { x: 23, y: 18 },
        dimensions: BUILDINGS_CATALOG[BuildingType.SERRARIA].dimensions,
        currentHealth: BUILDINGS_CATALOG[BuildingType.SERRARIA].maxHealthByLevel[1],
        maxHealth: BUILDINGS_CATALOG[BuildingType.SERRARIA].maxHealthByLevel[1],
        state: BuildingOperationalState.OPERATIONAL,
        createdAt: now
      },
      // Quartel da Guarda Real (x: 18, y: 23)
      {
        id: `bld_${villageId}_barracks1`,
        villageId,
        type: BuildingType.QUARTEL,
        civilization: CivilizationId.PERSA,
        level: 1,
        position: { x: 18, y: 23 },
        dimensions: BUILDINGS_CATALOG[BuildingType.QUARTEL].dimensions,
        currentHealth: BUILDINGS_CATALOG[BuildingType.QUARTEL].maxHealthByLevel[1],
        maxHealth: BUILDINGS_CATALOG[BuildingType.QUARTEL].maxHealthByLevel[1],
        state: BuildingOperationalState.OPERATIONAL,
        createdAt: now
      },
      // Torre de Arqueiros de Susa (x: 18, y: 15)
      {
        id: `bld_${villageId}_tower1`,
        villageId,
        type: BuildingType.TORRE_ARQUEIROS,
        civilization: CivilizationId.PERSA,
        level: 1,
        position: { x: 18, y: 15 },
        dimensions: BUILDINGS_CATALOG[BuildingType.TORRE_ARQUEIROS].dimensions,
        currentHealth: BUILDINGS_CATALOG[BuildingType.TORRE_ARQUEIROS].maxHealthByLevel[1],
        maxHealth: BUILDINGS_CATALOG[BuildingType.TORRE_ARQUEIROS].maxHealthByLevel[1],
        state: BuildingOperationalState.OPERATIONAL,
        createdAt: now
      }
    ];
  }

  /**
   * Valida e posiciona um novo edifício na grade da vila
   */
  static placeBuilding(
    existingBuildings: VillageBuildingInstance[],
    type: BuildingType,
    civilization: CivilizationId,
    gridX: number,
    gridY: number,
    villageId: string
  ): { success: boolean; error?: string; newBuilding?: VillageBuildingInstance } {
    const definition = BUILDINGS_CATALOG[type];
    if (!definition) {
      return { success: false, error: 'Tipo de edifício desconhecido.' };
    }

    const position = { x: gridX, y: gridY };
    const dimensions = definition.dimensions;

    // 1. Limites do mapa
    if (!IsometricGridValidator.isWithinBounds(position, dimensions, VILLAGE_GRID_SIZE)) {
      return { success: false, error: 'Construção fora dos limites permitidos da grade.' };
    }

    // 2. Colisão com edifícios existentes
    for (const bld of existingBuildings) {
      if (IsometricGridValidator.checkCollision(position, dimensions, bld.position, bld.dimensions)) {
        return { success: false, error: `Colisão detectada com ${bld.type} em (${bld.position.x}, ${bld.position.y}).` };
      }
    }

    const newBuilding: VillageBuildingInstance = {
      id: `bld_${villageId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      villageId,
      type,
      civilization,
      level: 1,
      position,
      dimensions,
      currentHealth: definition.maxHealthByLevel[1] || 500,
      maxHealth: definition.maxHealthByLevel[1] || 500,
      state: BuildingOperationalState.OPERATIONAL,
      createdAt: Date.now()
    };

    return { success: true, newBuilding };
  }

  /**
   * Recalcula taxas de produção horária e capacidade de armazenamento de uma vila
   */
  static calculateVillageRates(buildings: VillageBuildingInstance[]): {
    productionPerHour: ResourceAmount;
    capacities: ResourceAmount;
  } {
    const productionPerHour: ResourceAmount = {
      alimento: 50, // Produção base da vila
      madeira: 50,
      pedra: 30,
      ferro: 20,
      ouro: 40,
      gemas: 0
    };

    const capacities: ResourceAmount = {
      alimento: 2500,
      madeira: 2500,
      pedra: 2000,
      ferro: 1500,
      ouro: 2000,
      gemas: 999999
    };

    for (const bld of buildings) {
      if (bld.state !== BuildingOperationalState.OPERATIONAL) continue;
      const def = BUILDINGS_CATALOG[bld.type];
      if (!def) continue;

      // Produção
      if (def.productionPerHourByLevel && def.productionPerHourByLevel[bld.level]) {
        const prod = def.productionPerHourByLevel[bld.level];
        const resKey = prod.resource as keyof ResourceAmount;
        if (productionPerHour[resKey] !== undefined) {
          productionPerHour[resKey] += prod.rate;
        }
      }

      // Capacidade
      if (def.storageCapacityByLevel && def.storageCapacityByLevel[bld.level]) {
        const cap = def.storageCapacityByLevel[bld.level];
        const resKey = cap.resource as keyof ResourceAmount;
        if (capacities[resKey] !== undefined) {
          capacities[resKey] += cap.capacity;
        }
      }
    }

    return { productionPerHour, capacities };
  }
}
