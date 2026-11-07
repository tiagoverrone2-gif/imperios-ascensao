/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Fase 4: Economia e Progressão das 6 Eras Históricas
 */

import { EraId, ERAS_CATALOG, EraDefinition, VillageBuildingInstance, BuildingType } from '@imperios/shared';

export interface VillageEraStatus {
  currentEra: EraId;
  eraName: string;
  imperialCenterLevel: number;
  canAdvanceEra: boolean;
  nextEra?: EraDefinition;
  storageBonusPct: number;
  prestigePoints: number;
}

export class EraProgressionManager {
  /**
   * Avalia a era atual da vila com base no nível do Centro Imperial
   */
  static evaluateVillageEra(
    imperialCenterLevel: number,
    currentEra: EraId = EraId.FUNDACAO,
    prestigePoints: number = 0
  ): VillageEraStatus {
    let resolvedEra = EraId.FUNDACAO;

    for (let era = EraId.ERA_IMPERIAL; era >= EraId.FUNDACAO; era--) {
      const eraDef = ERAS_CATALOG[era as EraId];
      if (imperialCenterLevel >= eraDef.minCenterLevel) {
        resolvedEra = era as EraId;
        break;
      }
    }

    const currentDef = ERAS_CATALOG[resolvedEra];
    const nextEraId = (resolvedEra < EraId.ERA_IMPERIAL ? resolvedEra + 1 : undefined) as EraId | undefined;
    const nextEraDef = nextEraId ? ERAS_CATALOG[nextEraId] : undefined;

    const canAdvanceEra = nextEraDef ? imperialCenterLevel >= nextEraDef.minCenterLevel : false;

    return {
      currentEra: resolvedEra,
      eraName: currentDef.name,
      imperialCenterLevel,
      canAdvanceEra,
      nextEra: nextEraDef,
      storageBonusPct: currentDef.baseStorageBonusPct,
      prestigePoints
    };
  }

  /**
   * Concede pontos de prestígio após o Apogeu / Era Imperial
   */
  static calculateSeasonalPrestigeGains(
    era: EraId,
    trophies: number,
    pvpVictories: number
  ): number {
    if (era < EraId.APOGEU) return 0;
    const basePoints = era === EraId.ERA_IMPERIAL ? 500 : 200;
    return basePoints + Math.floor(trophies * 0.1) + (pvpVictories * 25);
  }
}
