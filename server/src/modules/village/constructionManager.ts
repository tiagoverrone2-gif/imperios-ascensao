/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Fase 3: Construção e Persistência
 * Gerenciador de ciclo de vida de obras, filas de construtores e melhorias de nível
 */

import {
  BuildingType,
  BUILDINGS_CATALOG,
  BuildingOperationalState,
  VillageBuildingInstance,
  ResourceAmount,
  CivilizationId
} from '@imperios/shared';
import { EconomyService } from '../economy/economyService.js';

export interface ConstructionJob {
  id: string;
  villageId: string;
  buildingId: string;
  type: BuildingType;
  targetLevel: number;
  isUpgrade: boolean;
  startTime: number;
  finishTime: number;
  totalDurationSeconds: number;
}

export class ConstructionManager {
  private static MAX_CONCURRENT_BUILDERS = 2;

  /**
   * Verifica se há construtores livres na vila
   */
  static hasAvailableBuilder(activeJobs: ConstructionJob[], maxBuilders: number = this.MAX_CONCURRENT_BUILDERS): boolean {
    const now = Date.now();
    const running = activeJobs.filter(j => j.finishTime > now);
    return running.length < maxBuilders;
  }

  /**
   * Inicia a construção de um novo edifício com tempo de obra
   */
  static startConstruction(
    villageId: string,
    buildingId: string,
    type: BuildingType,
    civilization: CivilizationId,
    activeJobs: ConstructionJob[],
    currentTime: number = Date.now(),
    maxBuilders: number = this.MAX_CONCURRENT_BUILDERS
  ): { success: boolean; job?: ConstructionJob; error?: string } {
    if (!this.hasAvailableBuilder(activeJobs, maxBuilders)) {
      return { success: false, error: 'Todos os construtores estão ocupados com outras obras!' };
    }

    const def = BUILDINGS_CATALOG[type];
    if (!def) {
      return { success: false, error: 'Edifício inexistente no catálogo.' };
    }

    const durationSeconds = def.costsByLevel[1]?.timeSeconds || 10;
    const finishTime = currentTime + durationSeconds * 1000;

    const job: ConstructionJob = {
      id: `job_build_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      villageId,
      buildingId,
      type,
      targetLevel: 1,
      isUpgrade: false,
      startTime: currentTime,
      finishTime,
      totalDurationSeconds: durationSeconds
    };

    activeJobs.push(job);
    return { success: true, job };
  }

  /**
   * Inicia o upgrade de nível de um edifício existente
   */
  static startUpgrade(
    building: VillageBuildingInstance,
    activeJobs: ConstructionJob[],
    currentTime: number = Date.now(),
    maxBuilders: number = this.MAX_CONCURRENT_BUILDERS
  ): { success: boolean; job?: ConstructionJob; error?: string } {
    if (building.state === BuildingOperationalState.CONSTRUCTING || building.state === BuildingOperationalState.UPGRADING) {
      return { success: false, error: 'Este edifício já possui uma obra em andamento.' };
    }

    if (!this.hasAvailableBuilder(activeJobs, maxBuilders)) {
      return { success: false, error: 'Todos os construtores estão ocupados.' };
    }

    const def = BUILDINGS_CATALOG[building.type];
    const nextLevel = building.level + 1;
    if (nextLevel > def.maxLevel) {
      return { success: false, error: 'Edifício já atingiu o nível máximo permitido nesta era.' };
    }

    const levelCost = def.costsByLevel[nextLevel];
    const durationSeconds = levelCost?.timeSeconds || nextLevel * 30;
    const finishTime = currentTime + durationSeconds * 1000;

    building.state = BuildingOperationalState.UPGRADING;
    building.upgradeFinishedAt = finishTime;

    const job: ConstructionJob = {
      id: `job_upgrade_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      villageId: building.villageId,
      buildingId: building.id,
      type: building.type,
      targetLevel: nextLevel,
      isUpgrade: true,
      startTime: currentTime,
      finishTime,
      totalDurationSeconds: durationSeconds
    };

    activeJobs.push(job);
    return { success: true, job };
  }

  /**
   * Finaliza obras cujo tempo de conclusão já tenha sido atingido
   */
  static processCompletedJobs(
    buildings: VillageBuildingInstance[],
    activeJobs: ConstructionJob[],
    currentTime: number = Date.now()
  ): { completedBuildingIds: string[]; remainingJobs: ConstructionJob[] } {
    const completedBuildingIds: string[] = [];
    const remainingJobs: ConstructionJob[] = [];

    for (const job of activeJobs) {
      if (currentTime >= job.finishTime) {
        const bld = buildings.find(b => b.id === job.buildingId);
        if (bld) {
          bld.level = job.targetLevel;
          bld.state = BuildingOperationalState.OPERATIONAL;
          bld.upgradeFinishedAt = undefined;
          const def = BUILDINGS_CATALOG[bld.type];
          if (def && def.maxHealthByLevel[bld.level]) {
            bld.maxHealth = def.maxHealthByLevel[bld.level];
            bld.currentHealth = bld.maxHealth;
          }
          completedBuildingIds.push(bld.id);
        }
      } else {
        remainingJobs.push(job);
      }
    }

    return { completedBuildingIds, remainingJobs };
  }
}
