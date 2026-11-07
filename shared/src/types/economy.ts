/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Modelo econômico seguro com representação em Inteiros (microunidades ou inteiros estritos)
 */

export enum ResourceType {
  ALIMENTO = 'alimento',
  MADEIRA = 'madeira',
  PEDRA = 'pedra',
  FERRO = 'ferro',
  OURO = 'ouro',
  GEMAS = 'gemas' // Moeda Premium
}

export interface ResourceAmount {
  alimento: number;
  madeira: number;
  pedra: number;
  ferro: number;
  ouro: number;
  gemas: number;
}

export interface ResourceBalanceState {
  villageId: string;
  balances: ResourceAmount;
  capacities: ResourceAmount;
  productionPerHour: ResourceAmount;
  lastCalculatedAt: number; // Unix timestamp em milissegundos UTC do servidor
}

export enum TransactionType {
  COLLECTION = 'COLLECTION',
  BUILDING_CONSTRUCTION = 'BUILDING_CONSTRUCTION',
  BUILDING_UPGRADE = 'BUILDING_UPGRADE',
  UNIT_TRAINING = 'UNIT_TRAINING',
  RESEARCH_START = 'RESEARCH_START',
  PVP_LOOT_WON = 'PVP_LOOT_WON',
  PVP_LOOT_LOST = 'PVP_LOOT_LOST',
  STORE_PURCHASE = 'STORE_PURCHASE',
  ADMIN_ADJUSTMENT = 'ADMIN_ADJUSTMENT'
}

export interface ResourceTransactionRecord {
  id: string;
  villageId: string;
  resource: ResourceType;
  delta: number; // Positivo para crédito, negativo para débito
  balanceAfter: number;
  transactionType: TransactionType;
  referenceId?: string;
  createdAt: number;
}

/**
 * Utilitário determinístico do servidor para cálculo offline de recursos
 * Respeita capacidades máximas e timestamps imutáveis do servidor
 */
export function calculateOfflineProduction(
  lastBalance: number,
  capacity: number,
  productionPerHour: number,
  lastTimestampMs: number,
  currentTimestampMs: number
): { currentAmount: number; produced: number } {
  if (currentTimestampMs <= lastTimestampMs || productionPerHour <= 0) {
    return { currentAmount: Math.min(lastBalance, capacity), produced: 0 };
  }

  const elapsedSeconds = Math.floor((currentTimestampMs - lastTimestampMs) / 1000);
  const productionPerSecond = productionPerHour / 3600;
  const potentialProduction = Math.floor(elapsedSeconds * productionPerSecond);

  const availableSpace = Math.max(0, capacity - lastBalance);
  const actualProduced = Math.min(availableSpace, potentialProduction);
  const currentAmount = Math.min(capacity, lastBalance + actualProduced);

  return {
    currentAmount,
    produced: actualProduced
  };
}
