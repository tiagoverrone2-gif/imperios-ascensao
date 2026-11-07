/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Motor de Combate Autoritativo e Batalhas PvP Assíncronas
 */

import { UnitType } from './units.js';
import { ResourceAmount } from './economy.js';

export interface DefensiveSnapshotBuilding {
  id: string;
  type: string;
  level: number;
  gridX: number;
  gridY: number;
  maxHealth: number;
  currentHealth: number;
  isDefense: boolean;
  damagePerSecond?: number;
  range?: number;
}

export interface DefensiveSnapshot {
  villageId: string;
  defenderUserId: string;
  defenderName: string;
  civilization: string;
  era: number;
  shieldActiveUntil: number; // ms
  availableLoot: ResourceAmount;
  buildings: DefensiveSnapshotBuilding[];
}

export interface AttackingArmyUnit {
  unitType: UnitType;
  count: number;
}

export interface BattleEventLog {
  timestampSec: number;
  eventType: 'SPAWN_UNIT' | 'ATTACK_HIT' | 'BUILDING_DESTROYED' | 'UNIT_DIED' | 'BATTLE_CONCLUDED';
  sourceId: string;
  targetId?: string;
  value?: number;
  position?: { x: number; y: number };
}

export interface BattleSimulationResult {
  battleId: string;
  attackerId: string;
  defenderId: string;
  destructionPercentage: number; // 0 a 100
  stars: number; // 0 a 3
  isVictory: boolean;
  lootPlundered: ResourceAmount;
  attackerLosses: Partial<Record<UnitType, number>>;
  durationSeconds: number;
  events: BattleEventLog[];
}

/**
 * Regra canônica de estrelas de vitória:
 * 1 Estrela: Destruir pelo menos 50% dos edifícios OU destruir o Centro Imperial
 * 2 Estrelas: Destruir o Centro Imperial E pelo menos 50% dos edifícios
 * 3 Estrelas: 100% de destruição da vila
 */
export function calculateBattleStars(destructionPct: number, imperialCenterDestroyed: boolean): number {
  if (destructionPct >= 100) return 3;
  if (imperialCenterDestroyed && destructionPct >= 50) return 2;
  if (imperialCenterDestroyed || destructionPct >= 50) return 1;
  return 0;
}
