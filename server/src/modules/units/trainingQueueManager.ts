/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Fase 6: Recrutamento e Filas de Tropas
 */

import { UnitType, UNITS_CATALOG, UnitDefinition, ResourceAmount } from '@imperios/shared';
import { EconomyService } from '../economy/economyService.js';

export interface TrainingQueueEntry {
  id: string;
  villageId: string;
  unitType: UnitType;
  count: number;
  housingSpacePerUnit: number;
  totalDurationSeconds: number;
  startTime: number;
  finishTime: number;
}

export class TrainingQueueManager {
  private static MAX_HOUSING_BASE = 100;

  /**
   * Calcula o espaço de habitação ocupado e disponível na vila
   */
  static calculateHousing(
    army: Record<string, number>,
    queue: TrainingQueueEntry[],
    maxHousingCapacity: number = this.MAX_HOUSING_BASE
  ): { occupiedSpace: number; queuedSpace: number; freeSpace: number } {
    let occupiedSpace = 0;
    for (const [unitType, count] of Object.entries(army)) {
      const def = UNITS_CATALOG[unitType as UnitType];
      if (def) occupiedSpace += def.housingSpace * count;
    }

    let queuedSpace = 0;
    for (const entry of queue) {
      queuedSpace += entry.housingSpacePerUnit * entry.count;
    }

    const freeSpace = Math.max(0, maxHousingCapacity - occupiedSpace - queuedSpace);
    return { occupiedSpace, queuedSpace, freeSpace };
  }

  /**
   * Adiciona um lote de recrutamento à fila do quartel
   */
  static enqueueRecruitment(
    villageId: string,
    unitType: UnitType,
    count: number,
    army: Record<string, number>,
    queue: TrainingQueueEntry[],
    currentTime: number = Date.now(),
    maxHousing: number = this.MAX_HOUSING_BASE
  ): { success: boolean; entry?: TrainingQueueEntry; error?: string } {
    const def = UNITS_CATALOG[unitType];
    if (!def) return { success: false, error: 'Tipo de unidade inválido.' };

    const spaceRequired = def.housingSpace * count;
    const { freeSpace } = this.calculateHousing(army, queue, maxHousing);

    if (spaceRequired > freeSpace) {
      return { success: false, error: `Espaço de habitação insuficiente! Necessário: ${spaceRequired}, Disponível: ${freeSpace}.` };
    }

    // Tempo de treinamento cumulativo na fila
    const lastFinish = queue.length > 0 ? queue[queue.length - 1].finishTime : currentTime;
    const totalDurationSeconds = def.trainingTimeSeconds * count;
    const finishTime = lastFinish + totalDurationSeconds * 1000;

    const entry: TrainingQueueEntry = {
      id: `queue_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      villageId,
      unitType,
      count,
      housingSpacePerUnit: def.housingSpace,
      totalDurationSeconds,
      startTime: lastFinish,
      finishTime
    };

    queue.push(entry);
    return { success: true, entry };
  }

  /**
   * Processa tropas treinadas com base no timestamp atual
   */
  static processCompletedTraining(
    army: Record<string, number>,
    queue: TrainingQueueEntry[],
    currentTime: number = Date.now()
  ): { trainedUnits: Partial<Record<UnitType, number>>; remainingQueue: TrainingQueueEntry[] } {
    const trainedUnits: Partial<Record<UnitType, number>> = {};
    const remainingQueue: TrainingQueueEntry[] = [];

    for (const entry of queue) {
      if (currentTime >= entry.finishTime) {
        army[entry.unitType] = (army[entry.unitType] || 0) + entry.count;
        trainedUnits[entry.unitType] = (trainedUnits[entry.unitType] || 0) + entry.count;
      } else {
        remainingQueue.push(entry);
      }
    }

    return { trainedUnits, remainingQueue };
  }
}
