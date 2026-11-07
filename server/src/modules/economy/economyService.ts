/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Serviço de Economia e Cálculo Autoritativo de Recursos Offline
 */

import {
  ResourceType,
  ResourceAmount,
  calculateOfflineProduction,
  TransactionType,
  ResourceTransactionRecord
} from '@imperios/shared';

export interface VillageEconomyState {
  villageId: string;
  balances: ResourceAmount;
  capacities: ResourceAmount;
  productionPerHour: ResourceAmount;
  lastCalculatedAt: number; // ms
}

export class EconomyService {
  /**
   * Atualiza os saldos de uma vila com base no tempo decorrido desde a última sincronização
   */
  static tickVillageResources(
    state: VillageEconomyState,
    currentTimeMs: number = Date.now()
  ): { updatedState: VillageEconomyState; producedTotal: Partial<ResourceAmount> } {
    const elapsedSeconds = Math.max(0, Math.floor((currentTimeMs - state.lastCalculatedAt) / 1000));
    const producedTotal: Partial<ResourceAmount> = {};

    const resourceKeys: (keyof ResourceAmount)[] = ['alimento', 'madeira', 'pedra', 'ferro', 'ouro'];

    for (const res of resourceKeys) {
      const current = state.balances[res];
      const capacity = state.capacities[res];
      const hourlyRate = state.productionPerHour[res];

      const { currentAmount, produced } = calculateOfflineProduction(
        current,
        capacity,
        hourlyRate,
        state.lastCalculatedAt,
        currentTimeMs
      );

      state.balances[res] = currentAmount;
      producedTotal[res] = produced;
    }

    state.lastCalculatedAt = currentTimeMs;
    return { updatedState: state, producedTotal };
  }

  /**
   * Verifica se a vila possui recursos suficientes para uma operação
   */
  static canAfford(balances: ResourceAmount, cost: Partial<ResourceAmount>): boolean {
    for (const [key, amount] of Object.entries(cost)) {
      const resKey = key as keyof ResourceAmount;
      if (amount && (balances[resKey] || 0) < amount) {
        return false;
      }
    }
    return true;
  }

  /**
   * Deduz recursos de forma atômica garantindo que nenhum saldo fique negativo
   */
  static deductResources(
    balances: ResourceAmount,
    cost: Partial<ResourceAmount>
  ): { success: boolean; newBalances: ResourceAmount } {
    if (!this.canAfford(balances, cost)) {
      return { success: false, newBalances: { ...balances } };
    }

    const newBalances = { ...balances };
    for (const [key, amount] of Object.entries(cost)) {
      const resKey = key as keyof ResourceAmount;
      if (amount) {
        newBalances[resKey] = Math.max(0, newBalances[resKey] - amount);
      }
    }

    return { success: true, newBalances };
  }

  /**
   * Adiciona recursos respeitando os tetos de capacidade de armazenamento
   */
  static creditResources(
    balances: ResourceAmount,
    capacities: ResourceAmount,
    gains: Partial<ResourceAmount>
  ): ResourceAmount {
    const newBalances = { ...balances };
    for (const [key, amount] of Object.entries(gains)) {
      const resKey = key as keyof ResourceAmount;
      if (amount) {
        const cap = capacities[resKey] ?? Number.MAX_SAFE_INTEGER;
        newBalances[resKey] = Math.min(cap, newBalances[resKey] + amount);
      }
    }
    return newBalances;
  }
}
