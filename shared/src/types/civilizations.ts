/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Catálogo e contratos orientados a dados para as Civilizações e Eras Históricas
 */

export enum CivilizationId {
  PERSA = 'persa',
  ROMANO = 'romano',
  CHINES = 'chines',
  ARABE = 'arabe',
  EGIPCIO = 'egipcio',
  GREGO = 'grego',
  MONGOL = 'mongol',
  JAPONES = 'japones',
  INDIANO = 'indiano',
  OTOMANO = 'otomano',
  CARTAGINES = 'cartagines',
  VIKING = 'viking'
}

export enum EraId {
  FUNDACAO = 1,
  CONSOLIDACAO = 2,
  EXPANSAO = 3,
  FORTIFICACAO = 4,
  APOGEU = 5,
  ERA_IMPERIAL = 6
}

export interface EraDefinition {
  id: EraId;
  name: string;
  description: string;
  minCenterLevel: number;
  unlockedBuildingTypes: string[];
  unlockedUnitTypes: string[];
  baseStorageBonusPct: number;
}

export interface CivilizationBonus {
  economyBonus: {
    description: string;
    resourceType: string;
    multiplier: number;
  };
  militaryBonus: {
    description: string;
    unitCategory: string;
    attackMultiplier: number;
    defenseMultiplier: number;
  };
}

export interface CivilizationDefinition {
  id: CivilizationId;
  name: string;
  historicalPeriod: string;
  architecturalStyle: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    banner: string;
  };
  description: string;
  bonuses: CivilizationBonus;
  uniqueUnits: string[];
  uniqueBuildings: string[];
}

export const ERAS_CATALOG: Record<EraId, EraDefinition> = {
  [EraId.FUNDACAO]: {
    id: EraId.FUNDACAO,
    name: 'Fundação',
    description: 'Os primeiros assentamentos, coleta de recursos básicos e demarcação territorial.',
    minCenterLevel: 1,
    unlockedBuildingTypes: ['CENTRO_IMPERIAL', 'CASA', 'FAZENDA', 'SERRARIA', 'QUARTEL', 'ARMAZEM'],
    unlockedUnitTypes: ['INFANTARIA_LEVE', 'LANCEIRO'],
    baseStorageBonusPct: 0
  },
  [EraId.CONSOLIDACAO]: {
    id: EraId.CONSOLIDACAO,
    name: 'Consolidação',
    description: 'Estabelecimento de defesas, celeiros e mineração avançada.',
    minCenterLevel: 3,
    unlockedBuildingTypes: ['PEDREIRA', 'CELEIRO', 'TORRE_ARQUEIROS', 'ESTABULO'],
    unlockedUnitTypes: ['ARQUEIRO', 'CAVALARIA_LEVE'],
    baseStorageBonusPct: 25
  },
  [EraId.EXPANSAO]: {
    id: EraId.EXPANSAO,
    name: 'Expansão',
    description: 'Expansão da rede comercial, forja de armamentos e fundição de ferro.',
    minCenterLevel: 5,
    unlockedBuildingTypes: ['MINA_FERRO', 'MERCADO', 'FERRARIA', 'MURALHA'],
    unlockedUnitTypes: ['INFANTARIA_PESADA', 'BESTEIRO'],
    baseStorageBonusPct: 60
  },
  [EraId.FORTIFICACAO]: {
    id: EraId.FORTIFICACAO,
    name: 'Fortificação',
    description: 'Engenharia de cerco, minas de ouro e muralhas reforçadas.',
    minCenterLevel: 7,
    unlockedBuildingTypes: ['MINA_OURO', 'OFICINA_ARMAMENTOS', 'PORTAO', 'TORRE_VIGILANCIA'],
    unlockedUnitTypes: ['UNIDADE_CERCO', 'CAVALARIA_PESADA'],
    baseStorageBonusPct: 120
  },
  [EraId.APOGEU]: {
    id: EraId.APOGEU,
    name: 'Apogeu',
    description: 'Unidades de elite da civilização, templos culturais e palácios majestosos.',
    minCenterLevel: 9,
    unlockedBuildingTypes: ['PALACIO', 'TEMPLO_CULTURAL', 'FORTALEZA', 'ACADEMIA_MILITAR'],
    unlockedUnitTypes: ['UNIDADE_ESPECIAL'],
    baseStorageBonusPct: 200
  },
  [EraId.ERA_IMPERIAL]: {
    id: EraId.ERA_IMPERIAL,
    name: 'Era Imperial',
    description: 'Domínio geopolítico, prestígio e glória militar eterna.',
    minCenterLevel: 12,
    unlockedBuildingTypes: ['MARAVILHA_IMPERIAL', 'JARDIM_SUSPENSO', 'CENTRO_COMERCIAL_GLOBAL'],
    unlockedUnitTypes: ['GUARDA_IMPERIAL'],
    baseStorageBonusPct: 350
  }
};

/**
 * Definição inicial do Império Persa (Achaemenid Empire) - Foco da Vertical Slice
 */
export const PERSIAN_CIVILIZATION: CivilizationDefinition = {
  id: CivilizationId.PERSA,
  name: 'Império Persa',
  historicalPeriod: 'Império Aquemênida (c. 550 a.C. – 330 a.C.)',
  architecturalStyle: 'Aquemênida / Persépolis (Apadana, colunas duplas de touros, relevos de tijolos esmaltados, relevos dourados e lápis-lazúli)',
  colorPalette: {
    primary: '#1D3557',     // Azul imperial profundo
    secondary: '#D4AF37',   // Ouro aquemênida
    accent: '#B22222',      // Carmesim real persa
    banner: '#E9C46A'       // Amarelo açafrão
  },
  description: 'Mestres da administração imperial via Satrapias, coletores eficientes de tributos e comandantes dos lendários Imortais Persas.',
  bonuses: {
    economyBonus: {
      description: 'Estrada Real & Satrapias: +15% de produção em Ouro e Comércio',
      resourceType: 'ouro',
      multiplier: 1.15
    },
    militaryBonus: {
      description: 'Táticas dos Dez Mil: Infantaria de elite (Imortais) recebe +20% de vida e regeneração pós-combate',
      unitCategory: 'infantaria_elite',
      attackMultiplier: 1.10,
      defenseMultiplier: 1.20
    }
  },
  uniqueUnits: ['imortal_persa', 'arqueiro_de_susa'],
  uniqueBuildings: ['apadana_imperial', 'satrapeia_fiscal', 'jardim_paraiso_persa']
};
