/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Contratos de API RESTful Tipados
 */

import { CivilizationId } from '../types/civilizations.js';
import { ResourceBalanceState, ResourceAmount } from '../types/economy.js';
import { BuildingType, VillageBuildingInstance } from '../types/buildings.js';
import { UnitType } from '../types/units.js';
import { DefensiveSnapshot, BattleSimulationResult, AttackingArmyUnit } from '../types/combat.js';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  serverTimestamp: number;
}

export interface GuestAuthRequest {
  deviceId: string;
  civilizationChoice?: CivilizationId;
  playerName?: string;
}

export interface AuthResponseData {
  token: string;
  userId: string;
  villageId: string;
  playerName: string;
  civilization: CivilizationId;
}

export interface VillageStateResponseData {
  villageId: string;
  name: string;
  civilization: CivilizationId;
  era: number;
  economy: ResourceBalanceState;
  buildings: VillageBuildingInstance[];
  units: Record<string, number>;
  shieldActiveUntil: number;
}

export interface PlaceBuildingRequest {
  type: BuildingType;
  gridX: number;
  gridY: number;
}

export interface UpgradeBuildingRequest {
  buildingInstanceId: string;
}

export interface CollectResourcesResponseData {
  collected: ResourceAmount;
  newBalances: ResourceAmount;
}

export interface TrainUnitsRequest {
  unitType: UnitType;
  count: number;
}

export interface MatchmakingResponseData {
  targets: DefensiveSnapshot[];
}

export interface StartBattleRequest {
  defenderVillageId: string;
  deployedArmy: AttackingArmyUnit[];
}

export interface BattleResultResponseData {
  battleResult: BattleSimulationResult;
}
