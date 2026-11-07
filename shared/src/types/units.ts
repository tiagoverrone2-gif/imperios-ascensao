/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Catálogo e contratos para Unidades Militares e Civis
 */

import { ResourceAmount } from './economy.js';

export enum UnitType {
  // Civis
  TRABALHADOR = 'TRABALHADOR',
  // Militares
  INFANTARIA_LEVE = 'INFANTARIA_LEVE',
  INFANTARIA_PESADA = 'INFANTARIA_PESADA',
  LANCEIRO = 'LANCEIRO',
  ARQUEIRO = 'ARQUEIRO',
  BESTEIRO = 'BESTEIRO',
  CAVALARIA_LEVE = 'CAVALARIA_LEVE',
  CAVALARIA_PESADA = 'CAVALARIA_PESADA',
  ARQUEIRO_MONTADO = 'ARQUEIRO_MONTADO',
  UNIDADE_CERCO = 'UNIDADE_CERCO',
  // Unidade Especial Persa
  IMORTAL_PERSA = 'IMORTAL_PERSA'
}

export enum TargetPriority {
  ANY = 'ANY',
  DEFENSES = 'DEFENSES',
  RESOURCES = 'RESOURCES',
  WALLS = 'WALLS'
}

export interface UnitDefinition {
  type: UnitType;
  name: string;
  description: string;
  category: 'infantaria' | 'arquearia' | 'cavalaria' | 'cerco' | 'especial';
  housingSpace: number;
  cost: Partial<ResourceAmount>;
  trainingTimeSeconds: number;
  health: number;
  damage: number;
  defense: number;
  speed: number; // células por segundo
  range: number; // alcance em células da grade
  attackSpeed: number; // ataques por segundo
  targetPriority: TargetPriority;
  bonusMultiplierAgainst: Partial<Record<UnitType | 'EDIFICIOS_DEFESA' | 'MURALHAS', number>>;
}

export const UNITS_CATALOG: Record<UnitType, UnitDefinition> = {
  [UnitType.TRABALHADOR]: {
    type: UnitType.TRABALHADOR,
    name: 'Trabalhador Civil',
    description: 'Constrói estruturas e auxilia na extração de recursos.',
    category: 'infantaria',
    housingSpace: 1,
    cost: { alimento: 50 },
    trainingTimeSeconds: 10,
    health: 80,
    damage: 5,
    defense: 2,
    speed: 1.5,
    range: 1.0,
    attackSpeed: 1.0,
    targetPriority: TargetPriority.ANY,
    bonusMultiplierAgainst: {}
  },
  [UnitType.INFANTARIA_LEVE]: {
    type: UnitType.INFANTARIA_LEVE,
    name: 'Espadachim Levado',
    description: 'Infantaria básica de combate corpo-a-corpo.',
    category: 'infantaria',
    housingSpace: 1,
    cost: { alimento: 60, madeira: 20 },
    trainingTimeSeconds: 15,
    health: 120,
    damage: 18,
    defense: 6,
    speed: 2.0,
    range: 1.0,
    attackSpeed: 1.0,
    targetPriority: TargetPriority.ANY,
    bonusMultiplierAgainst: {
      [UnitType.ARQUEIRO]: 1.3
    }
  },
  [UnitType.LANCEIRO]: {
    type: UnitType.LANCEIRO,
    name: 'Lanceiro de Formação',
    description: 'Especialista em deter cargas de cavalaria inimiga com lanças longas.',
    category: 'infantaria',
    housingSpace: 1,
    cost: { alimento: 50, madeira: 40 },
    trainingTimeSeconds: 18,
    health: 140,
    damage: 16,
    defense: 8,
    speed: 1.8,
    range: 1.2,
    attackSpeed: 0.9,
    targetPriority: TargetPriority.ANY,
    bonusMultiplierAgainst: {
      [UnitType.CAVALARIA_LEVE]: 2.0,
      [UnitType.CAVALARIA_PESADA]: 1.8
    }
  },
  [UnitType.ARQUEIRO]: {
    type: UnitType.ARQUEIRO,
    name: 'Arqueiro de Pelotão',
    description: 'Atirador ágil que dispara por cima de muralhas.',
    category: 'arquearia',
    housingSpace: 1,
    cost: { alimento: 40, madeira: 70 },
    trainingTimeSeconds: 22,
    health: 90,
    damage: 22,
    defense: 4,
    speed: 1.8,
    range: 4.5,
    attackSpeed: 0.8,
    targetPriority: TargetPriority.ANY,
    bonusMultiplierAgainst: {
      [UnitType.LANCEIRO]: 1.4,
      [UnitType.INFANTARIA_LEVE]: 1.2
    }
  },
  [UnitType.BESTEIRO]: {
    type: UnitType.BESTEIRO,
    name: 'Besteiro de Precisão',
    description: 'Projéteis perfurantes capazes de furar armaduras pesadas.',
    category: 'arquearia',
    housingSpace: 2,
    cost: { alimento: 80, madeira: 100, ferro: 40 },
    trainingTimeSeconds: 35,
    health: 130,
    damage: 35,
    defense: 8,
    speed: 1.4,
    range: 4.0,
    attackSpeed: 0.6,
    targetPriority: TargetPriority.ANY,
    bonusMultiplierAgainst: {
      [UnitType.INFANTARIA_PESADA]: 1.7,
      [UnitType.CAVALARIA_PESADA]: 1.5
    }
  },
  [UnitType.INFANTARIA_PESADA]: {
    type: UnitType.INFANTARIA_PESADA,
    name: 'Guerreiro Couraçado',
    description: 'Tanque de absorção de dano com escudos maciços.',
    category: 'infantaria',
    housingSpace: 2,
    cost: { alimento: 100, ferro: 80 },
    trainingTimeSeconds: 40,
    health: 320,
    damage: 28,
    defense: 20,
    speed: 1.3,
    range: 1.0,
    attackSpeed: 0.8,
    targetPriority: TargetPriority.ANY,
    bonusMultiplierAgainst: {
      [UnitType.LANCEIRO]: 1.3
    }
  },
  [UnitType.CAVALARIA_LEVE]: {
    type: UnitType.CAVALARIA_LEVE,
    name: 'Batedor Montado',
    description: 'Velocidade extrema para flanquear arqueiros e saquear celeiros.',
    category: 'cavalaria',
    housingSpace: 3,
    cost: { alimento: 150, ouro: 30 },
    trainingTimeSeconds: 45,
    health: 220,
    damage: 30,
    defense: 10,
    speed: 3.2,
    range: 1.0,
    attackSpeed: 1.1,
    targetPriority: TargetPriority.RESOURCES,
    bonusMultiplierAgainst: {
      [UnitType.ARQUEIRO]: 1.8
    }
  },
  [UnitType.CAVALARIA_PESADA]: {
    type: UnitType.CAVALARIA_PESADA,
    name: 'Catafracta Blindado',
    description: 'Montaria e cavaleiro revestidos em escamas de ferro.',
    category: 'cavalaria',
    housingSpace: 4,
    cost: { alimento: 220, ferro: 140, ouro: 80 },
    trainingTimeSeconds: 70,
    health: 550,
    damage: 48,
    defense: 25,
    speed: 2.4,
    range: 1.0,
    attackSpeed: 0.9,
    targetPriority: TargetPriority.DEFENSES,
    bonusMultiplierAgainst: {
      [UnitType.INFANTARIA_LEVE]: 1.6
    }
  },
  [UnitType.ARQUEIRO_MONTADO]: {
    type: UnitType.ARQUEIRO_MONTADO,
    name: 'Tiroteador Cita-Persa',
    description: 'Dispara em movimento com o famoso tiro parta.',
    category: 'arquearia',
    housingSpace: 3,
    cost: { alimento: 140, madeira: 110, ouro: 40 },
    trainingTimeSeconds: 50,
    health: 180,
    damage: 26,
    defense: 7,
    speed: 2.8,
    range: 4.0,
    attackSpeed: 0.9,
    targetPriority: TargetPriority.ANY,
    bonusMultiplierAgainst: {
      [UnitType.INFANTARIA_PESADA]: 1.3
    }
  },
  [UnitType.UNIDADE_CERCO]: {
    type: UnitType.UNIDADE_CERCO,
    name: 'Trabuco / Aríete de Cerco',
    description: 'Derruba fortificações e muralhas com dano massivo concentrado.',
    category: 'cerco',
    housingSpace: 5,
    cost: { madeira: 300, ferro: 100, ouro: 50 },
    trainingTimeSeconds: 90,
    health: 400,
    damage: 120,
    defense: 12,
    speed: 1.0,
    range: 6.0,
    attackSpeed: 0.3,
    targetPriority: TargetPriority.DEFENSES,
    bonusMultiplierAgainst: {
      MURALHAS: 3.5,
      EDIFICIOS_DEFESA: 2.5
    }
  },
  [UnitType.IMORTAL_PERSA]: {
    type: UnitType.IMORTAL_PERSA,
    name: 'Imortal Aquemênida (Os Dez Mil)',
    description: 'Guarda pessoal do Grande Rei. Portam arco composto e lança com maçã de prata/ouro. Quando um tomba, outro toma imediatamente seu posto.',
    category: 'especial',
    housingSpace: 2,
    cost: { alimento: 120, ferro: 60, ouro: 40 },
    trainingTimeSeconds: 45,
    health: 380, // Bônus de vida da civilização persa
    damage: 42,
    defense: 18,
    speed: 2.0,
    range: 2.5, // Híbrido: ataca à meia distância e corpo a corpo
    attackSpeed: 1.1,
    targetPriority: TargetPriority.DEFENSES,
    bonusMultiplierAgainst: {
      [UnitType.INFANTARIA_LEVE]: 1.5,
      [UnitType.LANCEIRO]: 1.4,
      [UnitType.CAVALARIA_LEVE]: 1.3
    }
  }
};
