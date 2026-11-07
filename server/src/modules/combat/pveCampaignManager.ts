/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Fase 7: Sistema de Conquistas e Campanha Histórica PvE
 */

import { ResourceAmount, DefensiveSnapshot } from '@imperios/shared';
import { CombatService } from './combatService.js';

export interface PvECampaignMission {
  missionId: string;
  chapter: number;
  name: string;
  description: string;
  requiredEra: number;
  firstClearRewards: ResourceAmount;
  snapshot: DefensiveSnapshot;
}

export const PVE_CAMPAIGN_MISSIONS: PvECampaignMission[] = [
  {
    missionId: 'pve_01_estepe',
    chapter: 1,
    name: '1. Incursão das Tribos da Estepe',
    description: 'Bandos nômades atacam caravanas comerciais nas fronteiras do planalto.',
    requiredEra: 1,
    firstClearRewards: { alimento: 500, madeira: 500, pedra: 300, ferro: 100, ouro: 300, gemas: 25 },
    snapshot: {
      villageId: 'pve_vlg_01',
      defenderUserId: 'pve_nomad_chief',
      defenderName: 'Chefe Nômade da Estepe',
      civilization: 'mongol',
      era: 1,
      shieldActiveUntil: 0,
      availableLoot: { alimento: 600, madeira: 400, pedra: 200, ferro: 100, ouro: 300, gemas: 0 },
      buildings: [
        { id: 'pve_b1', type: 'CENTRO_IMPERIAL', level: 1, gridX: 20, gridY: 20, maxHealth: 800, currentHealth: 800, isDefense: false },
        { id: 'pve_b2', type: 'FAZENDA', level: 1, gridX: 16, gridY: 20, maxHealth: 300, currentHealth: 300, isDefense: false }
      ]
    }
  },
  {
    missionId: 'pve_02_rebeliao_babilonea',
    chapter: 1,
    name: '2. Posto Avançado de Susa',
    description: 'Guarnição rebelde tenta cortar a Estrada Real aquemênida.',
    requiredEra: 1,
    firstClearRewards: { alimento: 1000, madeira: 1000, pedra: 800, ferro: 400, ouro: 600, gemas: 50 },
    snapshot: {
      villageId: 'pve_vlg_02',
      defenderUserId: 'pve_rebel_general',
      defenderName: 'General Rebelde de Susa',
      civilization: 'babiloneo',
      era: 1,
      shieldActiveUntil: 0,
      availableLoot: { alimento: 1200, madeira: 1000, pedra: 600, ferro: 300, ouro: 800, gemas: 0 },
      buildings: [
        { id: 'pve2_b1', type: 'CENTRO_IMPERIAL', level: 1, gridX: 20, gridY: 20, maxHealth: 1500, currentHealth: 1500, isDefense: false },
        { id: 'pve2_b2', type: 'TORRE_ARQUEIROS', level: 1, gridX: 18, gridY: 18, maxHealth: 500, currentHealth: 500, isDefense: true, damagePerSecond: 25, range: 5 },
        { id: 'pve2_b3', type: 'CELEIRO', level: 1, gridX: 23, gridY: 20, maxHealth: 600, currentHealth: 600, isDefense: false }
      ]
    }
  },
  {
    missionId: 'pve_03_portoes_da_babilonia',
    chapter: 2,
    name: '3. Os Portões de Ishtar',
    description: 'A histórica tomada da Babilônia por Ciro, o Grande.',
    requiredEra: 2,
    firstClearRewards: { alimento: 3000, madeira: 3000, pedra: 2000, ferro: 1000, ouro: 2500, gemas: 100 },
    snapshot: {
      villageId: 'pve_vlg_03',
      defenderUserId: 'pve_nabonidus',
      defenderName: 'Corte do Rei Nabonido',
      civilization: 'babiloneo',
      era: 2,
      shieldActiveUntil: 0,
      availableLoot: { alimento: 4000, madeira: 3500, pedra: 2500, ferro: 1500, ouro: 3000, gemas: 0 },
      buildings: [
        { id: 'pve3_b1', type: 'CENTRO_IMPERIAL', level: 2, gridX: 20, gridY: 20, maxHealth: 3000, currentHealth: 3000, isDefense: false },
        { id: 'pve3_b2', type: 'TORRE_ARQUEIROS', level: 2, gridX: 17, gridY: 17, maxHealth: 800, currentHealth: 800, isDefense: true, damagePerSecond: 40, range: 5 },
        { id: 'pve3_b3', type: 'TORRE_ARQUEIROS', level: 2, gridX: 23, gridY: 17, maxHealth: 800, currentHealth: 800, isDefense: true, damagePerSecond: 40, range: 5 },
        { id: 'pve3_b4', type: 'ARMAZEM', level: 2, gridX: 20, gridY: 24, maxHealth: 1200, currentHealth: 1200, isDefense: false }
      ]
    }
  }
];
