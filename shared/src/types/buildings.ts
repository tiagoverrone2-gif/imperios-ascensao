/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Catálogo e interfaces orientadas a dados para Construções
 */

import { CivilizationId } from './civilizations.js';
import { ResourceType, ResourceAmount } from './economy.js';
import { GridCoordinate, GridDimensions } from './grid.js';

export enum BuildingType {
  CENTRO_IMPERIAL = 'CENTRO_IMPERIAL',
  CASA = 'CASA',
  FAZENDA = 'FAZENDA',
  SERRARIA = 'SERRARIA',
  PEDREIRA = 'PEDREIRA',
  MINA_FERRO = 'MINA_FERRO',
  MINA_OURO = 'MINA_OURO',
  ARMAZEM = 'ARMAZEM',
  CELEIRO = 'CELEIRO',
  MERCADO = 'MERCADO',
  QUARTEL = 'QUARTEL',
  ESTABULO = 'ESTABULO',
  OFICINA_ARMAMENTOS = 'OFICINA_ARMAMENTOS',
  FERRARIA = 'FERRARIA',
  TORRE_ARQUEIROS = 'TORRE_ARQUEIROS',
  TORRE_VIGILANCIA = 'TORRE_VIGILANCIA',
  MURALHA = 'MURALHA',
  PORTAO = 'PORTAO',
  FORTALEZA = 'FORTALEZA',
  PALACIO = 'PALACIO'
}

export enum BuildingOperationalState {
  CONSTRUCTING = 'CONSTRUCTING',
  UPGRADING = 'UPGRADING',
  OPERATIONAL = 'OPERATIONAL',
  DAMAGED = 'DAMAGED',
  DESTROYED = 'DESTROYED'
}

export interface BuildingCost {
  resources: Partial<ResourceAmount>;
  timeSeconds: number;
}

export interface BuildingDefinition {
  type: BuildingType;
  name: string;
  description: string;
  dimensions: GridDimensions;
  maxLevel: number;
  costsByLevel: Record<number, BuildingCost>;
  maxHealthByLevel: Record<number, number>;
  productionPerHourByLevel?: Record<number, { resource: ResourceType; rate: number }>;
  storageCapacityByLevel?: Record<number, { resource: ResourceType; capacity: number }>;
  visualAssetsByCivilization: Record<CivilizationId, {
    model3dPath: string;
    iconPath: string;
    sfxBuild: string;
    sfxWork?: string;
  }>;
}

export interface VillageBuildingInstance {
  id: string;
  villageId: string;
  type: BuildingType;
  civilization: CivilizationId;
  level: number;
  position: GridCoordinate;
  dimensions: GridDimensions;
  currentHealth: number;
  maxHealth: number;
  state: BuildingOperationalState;
  upgradeFinishedAt?: number; // Unix timestamp ms
  createdAt: number;
}

/**
 * Catálogo Base de Edifícios (Amostra Inicial Vertical Slice: Império Persa)
 */
export const BUILDINGS_CATALOG: Record<BuildingType, BuildingDefinition> = {
  [BuildingType.CENTRO_IMPERIAL]: {
    type: BuildingType.CENTRO_IMPERIAL,
    name: 'Centro Imperial Persa (Apadana)',
    description: 'Coração político e administrativo do império. Desbloqueia novas eras e edifícios.',
    dimensions: { width: 4, height: 4 },
    maxLevel: 12,
    maxHealthByLevel: {
      1: 2000, 2: 3200, 3: 5000, 4: 7500, 5: 11000, 6: 16000
    },
    costsByLevel: {
      1: { resources: { madeira: 500, pedra: 500 }, timeSeconds: 10 },
      2: { resources: { madeira: 1500, pedra: 1500, ouro: 500 }, timeSeconds: 60 },
      3: { resources: { madeira: 4000, pedra: 4000, ouro: 2000 }, timeSeconds: 300 }
    },
    storageCapacityByLevel: {
      1: { resource: ResourceType.OURO, capacity: 5000 },
      2: { resource: ResourceType.OURO, capacity: 12000 },
      3: { resource: ResourceType.OURO, capacity: 30000 }
    },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: {
        model3dPath: 'Buildings/Persian/Apadana_Lvl{lvl}',
        iconPath: 'UI/Icons/persian_apadana.png',
        sfxBuild: 'Audio/SFX/persian_gong_complete.mp3'
      },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.FAZENDA]: {
    type: BuildingType.FAZENDA,
    name: 'Fazenda com Canais Qanat',
    description: 'Irrigação ancestral persa por galerias subterrâneas garantindo colheitas abundantes.',
    dimensions: { width: 3, height: 3 },
    maxLevel: 10,
    maxHealthByLevel: { 1: 450, 2: 700, 3: 1100 },
    costsByLevel: {
      1: { resources: { madeira: 100 }, timeSeconds: 15 },
      2: { resources: { madeira: 300, pedra: 100 }, timeSeconds: 45 }
    },
    productionPerHourByLevel: {
      1: { resource: ResourceType.ALIMENTO, rate: 250 },
      2: { resource: ResourceType.ALIMENTO, rate: 500 }
    },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: {
        model3dPath: 'Buildings/Persian/QanatFarm_Lvl{lvl}',
        iconPath: 'UI/Icons/persian_farm.png',
        sfxBuild: 'Audio/SFX/farm_complete.mp3'
      },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.SERRARIA]: {
    type: BuildingType.SERRARIA,
    name: 'Serraria de Cedro Real',
    description: 'Corte e tratamento de madeiras nobres para construção e maquinário.',
    dimensions: { width: 3, height: 3 },
    maxLevel: 10,
    maxHealthByLevel: { 1: 500, 2: 800, 3: 1200 },
    costsByLevel: {
      1: { resources: { alimento: 80, pedra: 50 }, timeSeconds: 20 },
      2: { resources: { alimento: 250, pedra: 180 }, timeSeconds: 60 }
    },
    productionPerHourByLevel: {
      1: { resource: ResourceType.MADEIRA, rate: 200 },
      2: { resource: ResourceType.MADEIRA, rate: 420 }
    },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: {
        model3dPath: 'Buildings/Persian/LumberCamp_Lvl{lvl}',
        iconPath: 'UI/Icons/persian_lumber.png',
        sfxBuild: 'Audio/SFX/sawmill_complete.mp3'
      },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.QUARTEL]: {
    type: BuildingType.QUARTEL,
    name: 'Quartel da Guarda Real',
    description: 'Treinamento de infantaria, arqueiros e dos lendários Imortais Persas.',
    dimensions: { width: 3, height: 3 },
    maxLevel: 10,
    maxHealthByLevel: { 1: 800, 2: 1300, 3: 2000 },
    costsByLevel: {
      1: { resources: { madeira: 200, pedra: 150 }, timeSeconds: 30 },
      2: { resources: { madeira: 500, pedra: 400, ouro: 100 }, timeSeconds: 90 }
    },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: {
        model3dPath: 'Buildings/Persian/Barracks_Lvl{lvl}',
        iconPath: 'UI/Icons/persian_barracks.png',
        sfxBuild: 'Audio/SFX/barracks_complete.mp3'
      },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.TORRE_ARQUEIROS]: {
    type: BuildingType.TORRE_ARQUEIROS,
    name: 'Torre de Arqueiros de Susa',
    description: 'Guarnição defensiva de atiradores de flechas compostas de longo alcance.',
    dimensions: { width: 2, height: 2 },
    maxLevel: 10,
    maxHealthByLevel: { 1: 600, 2: 1000, 3: 1600 },
    costsByLevel: {
      1: { resources: { madeira: 250, pedra: 250 }, timeSeconds: 25 },
      2: { resources: { madeira: 600, pedra: 600 }, timeSeconds: 80 }
    },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: {
        model3dPath: 'Buildings/Persian/ArcherTower_Lvl{lvl}',
        iconPath: 'UI/Icons/persian_tower.png',
        sfxBuild: 'Audio/SFX/tower_complete.mp3'
      },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.ARMAZEM]: {
    type: BuildingType.ARMAZEM,
    name: 'Armazém Imperial',
    description: 'Guarda segura para grandes reservas de madeira, pedra e ferro.',
    dimensions: { width: 3, height: 3 },
    maxLevel: 10,
    maxHealthByLevel: { 1: 800, 2: 1400 },
    costsByLevel: {
      1: { resources: { madeira: 300, pedra: 100 }, timeSeconds: 30 }
    },
    storageCapacityByLevel: {
      1: { resource: ResourceType.MADEIRA, capacity: 8000 }
    },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/Warehouse_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.CASA]: {
    type: BuildingType.CASA,
    name: 'Residência Persa',
    description: 'Acomoda a população trabalhadora e aumenta a capacidade de mão de obra.',
    dimensions: { width: 2, height: 2 },
    maxLevel: 10,
    maxHealthByLevel: { 1: 300, 2: 500 },
    costsByLevel: { 1: { resources: { madeira: 60, pedra: 30 }, timeSeconds: 10 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/House_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.PEDREIRA]: {
    type: BuildingType.PEDREIRA,
    name: 'Pedreira Imperial',
    description: 'Extração de blocos de rocha calcária e mármore.',
    dimensions: { width: 3, height: 3 },
    maxLevel: 10,
    maxHealthByLevel: { 1: 500 },
    costsByLevel: { 1: { resources: { madeira: 150 }, timeSeconds: 25 } },
    productionPerHourByLevel: { 1: { resource: ResourceType.PEDRA, rate: 180 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/Quarry_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.MINA_FERRO]: {
    type: BuildingType.MINA_FERRO,
    name: 'Mina de Ferro',
    description: 'Minério essencial para forja de armaduras e lâminas.',
    dimensions: { width: 3, height: 3 },
    maxLevel: 10,
    maxHealthByLevel: { 1: 550 },
    costsByLevel: { 1: { resources: { madeira: 300, pedra: 300 }, timeSeconds: 40 } },
    productionPerHourByLevel: { 1: { resource: ResourceType.FERRO, rate: 120 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/IronMine_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.MINA_OURO]: {
    type: BuildingType.MINA_OURO,
    name: 'Casa da Moeda / Mina de Dárico',
    description: 'Cunhagem do Dárico de Ouro aquemênida, a moeda universal do império.',
    dimensions: { width: 3, height: 3 },
    maxLevel: 10,
    maxHealthByLevel: { 1: 600 },
    costsByLevel: { 1: { resources: { madeira: 500, pedra: 500, ferro: 200 }, timeSeconds: 60 } },
    productionPerHourByLevel: { 1: { resource: ResourceType.OURO, rate: 100 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/GoldMint_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.CELEIRO]: {
    type: BuildingType.CELEIRO,
    name: 'Celeiro Real',
    description: 'Armazenamento seguro de grãos e cereais.',
    dimensions: { width: 3, height: 3 },
    maxLevel: 10,
    maxHealthByLevel: { 1: 700 },
    costsByLevel: { 1: { resources: { madeira: 200, pedra: 100 }, timeSeconds: 20 } },
    storageCapacityByLevel: { 1: { resource: ResourceType.ALIMENTO, capacity: 8000 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/Granary_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.MERCADO]: {
    type: BuildingType.MERCADO,
    name: 'Bazar Central',
    description: 'Comércio de excedentes e trocas caravaneiras.',
    dimensions: { width: 3, height: 3 },
    maxLevel: 8,
    maxHealthByLevel: { 1: 650 },
    costsByLevel: { 1: { resources: { madeira: 400, pedra: 300 }, timeSeconds: 40 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/Bazaar_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.ESTABULO]: {
    type: BuildingType.ESTABULO,
    name: 'Coudelaria de Nisa',
    description: 'Criação dos célebres cavalos neséios para a cavalaria aquemênida.',
    dimensions: { width: 3, height: 3 },
    maxLevel: 8,
    maxHealthByLevel: { 1: 900 },
    costsByLevel: { 1: { resources: { madeira: 450, pedra: 250 }, timeSeconds: 45 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/Stables_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.OFICINA_ARMAMENTOS]: {
    type: BuildingType.OFICINA_ARMAMENTOS,
    name: 'Oficina de Cerco',
    description: 'Construção de aríetes, catapultas e balistas.',
    dimensions: { width: 3, height: 3 },
    maxLevel: 6,
    maxHealthByLevel: { 1: 1000 },
    costsByLevel: { 1: { resources: { madeira: 800, pedra: 400, ferro: 200 }, timeSeconds: 60 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/SiegeWorkshop_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.FERRARIA]: {
    type: BuildingType.FERRARIA,
    name: 'Ferraria Imperial',
    description: 'Aprimoramento de metalurgia, afiação de espadas e reforço de couraças.',
    dimensions: { width: 3, height: 3 },
    maxLevel: 8,
    maxHealthByLevel: { 1: 750 },
    costsByLevel: { 1: { resources: { madeira: 350, pedra: 350, ferro: 100 }, timeSeconds: 40 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/Blacksmith_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.TORRE_VIGILANCIA]: {
    type: BuildingType.TORRE_VIGILANCIA,
    name: 'Atalaia de Sinalização',
    description: 'Alerta antecipado contra ataques e fogueiras de sinalização.',
    dimensions: { width: 2, height: 2 },
    maxLevel: 6,
    maxHealthByLevel: { 1: 500 },
    costsByLevel: { 1: { resources: { madeira: 200, pedra: 150 }, timeSeconds: 20 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/Watchtower_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.MURALHA]: {
    type: BuildingType.MURALHA,
    name: 'Muralha de Pedra e Tijolos Esmaltados',
    description: 'Barreira física robusta que atrasa o avanço inimigo.',
    dimensions: { width: 1, height: 1 },
    maxLevel: 12,
    maxHealthByLevel: { 1: 1500, 2: 2500, 3: 4000 },
    costsByLevel: { 1: { resources: { pedra: 100 }, timeSeconds: 5 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/Wall_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.PORTAO]: {
    type: BuildingType.PORTAO,
    name: 'Portão de Todas as Nações',
    description: 'Portão fortificado monumental inspirado em Persépolis.',
    dimensions: { width: 2, height: 1 },
    maxLevel: 10,
    maxHealthByLevel: { 1: 2200 },
    costsByLevel: { 1: { resources: { pedra: 300, madeira: 200 }, timeSeconds: 30 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/Gate_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.FORTALEZA]: {
    type: BuildingType.FORTALEZA,
    name: 'Cidadela Militar Aquemênida',
    description: 'Baluarte supremo que abriga forças de contra-ataque.',
    dimensions: { width: 4, height: 4 },
    maxLevel: 6,
    maxHealthByLevel: { 1: 5000 },
    costsByLevel: { 1: { resources: { pedra: 2000, madeira: 1500, ferro: 800 }, timeSeconds: 180 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/Citadel_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  },
  [BuildingType.PALACIO]: {
    type: BuildingType.PALACIO,
    name: 'Palácio de Dario I',
    description: 'Sede da corte imperial, atrai emissários estrangeiros e tributos.',
    dimensions: { width: 4, height: 4 },
    maxLevel: 5,
    maxHealthByLevel: { 1: 4000 },
    costsByLevel: { 1: { resources: { pedra: 3000, madeira: 2000, ouro: 1000 }, timeSeconds: 240 } },
    visualAssetsByCivilization: {
      [CivilizationId.PERSA]: { model3dPath: 'Buildings/Persian/Palace_Lvl{lvl}', iconPath: '', sfxBuild: '' },
      [CivilizationId.ROMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CHINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.ARABE]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.EGIPCIO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.GREGO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.MONGOL]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.JAPONES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.INDIANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.OTOMANO]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.CARTAGINES]: { model3dPath: '', iconPath: '', sfxBuild: '' },
      [CivilizationId.VIKING]: { model3dPath: '', iconPath: '', sfxBuild: '' }
    }
  }
};
