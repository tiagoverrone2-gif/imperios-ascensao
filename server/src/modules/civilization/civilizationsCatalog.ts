/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Fase 9: Catálogo Mestre Completo das 12 Civilizações Históricas (Data-Driven)
 */

import { CivilizationId, CivilizationDefinition } from '@imperios/shared';

export const ALL_CIVILIZATIONS_CATALOG: Record<CivilizationId, CivilizationDefinition> = {
  [CivilizationId.PERSA]: {
    id: CivilizationId.PERSA,
    name: 'Império Persa (Aquemênida)',
    historicalPeriod: 'c. 550 a.C. – 330 a.C.',
    architecturalStyle: 'Aquemênida / Persépolis (Colunas taurinas, apadanas e tijolos esmaltados)',
    colorPalette: { primary: '#1D3557', secondary: '#D4AF37', accent: '#A61C1C', banner: '#E9C46A' },
    description: 'Mestres da logística pela Estrada Real e comandos da lendária guarda dos Imortais.',
    bonuses: {
      economyBonus: { description: '+15% Ouro por Satrapias', resourceType: 'ouro', multiplier: 1.15 },
      militaryBonus: { description: '+20% Vida para Imortais', unitCategory: 'infantaria_elite', attackMultiplier: 1.10, defenseMultiplier: 1.20 }
    },
    uniqueUnits: ['imortal_persa', 'arqueiro_de_susa'],
    uniqueBuildings: ['apadana_imperial', 'satrapeia_fiscal', 'jardim_paraiso']
  },
  [CivilizationId.ROMANO]: {
    id: CivilizationId.ROMANO,
    name: 'Império Romano',
    historicalPeriod: 'c. 27 a.C. – 476 d.C.',
    architecturalStyle: 'Clássico Romano (Arcos de triunfo, mármore travertino e basílicas)',
    colorPalette: { primary: '#780000', secondary: '#DDA15E', accent: '#669BBC', banner: '#BC6C25' },
    description: 'Engenharia de estradas militares imbatível e legiões disciplinadas em formação tartaruga.',
    bonuses: {
      economyBonus: { description: '+15% Velocidade de construção de muralhas e edifícios', resourceType: 'pedra', multiplier: 1.15 },
      militaryBonus: { description: '+15% Armadura para Legionários', unitCategory: 'infantaria', attackMultiplier: 1.05, defenseMultiplier: 1.15 }
    },
    uniqueUnits: ['legionario_romano', 'pretoriano'],
    uniqueBuildings: ['castrum_militar', 'termas_imperiais']
  },
  [CivilizationId.CHINES]: {
    id: CivilizationId.CHINES,
    name: 'Império Chinês (Dinastia Tang)',
    historicalPeriod: 'c. 618 d.C. – 907 d.C.',
    architecturalStyle: 'Imperial Dinástica (Pagodes, telhados curvados esmaltados e madeira nobre)',
    colorPalette: { primary: '#C1121F', secondary: '#FDF0D5', accent: '#003049', banner: '#669BBC' },
    description: 'Inovadores da pólvora, confecção de seda e baluartes monumentais da Grande Muralha.',
    bonuses: {
      economyBonus: { description: '+15% Pesquisa e produção de Alimentos', resourceType: 'alimento', multiplier: 1.15 },
      militaryBonus: { description: '+20% Dano de Besteiros de Repetição Chu-ko-nu', unitCategory: 'arquearia', attackMultiplier: 1.20, defenseMultiplier: 1.0 }
    },
    uniqueUnits: ['besteiro_chuko_nu', 'artilheiro_fogo'],
    uniqueBuildings: ['pagode_da_sabedoria', 'portao_celestial']
  },
  [CivilizationId.ARABE]: {
    id: CivilizationId.ARABE,
    name: 'Califado Árabe (Abássida)',
    historicalPeriod: 'c. 750 d.C. – 1258 d.C.',
    architecturalStyle: 'Islâmica Dourada (Cúpulas ogivais, arabescos geométricos e minaretes)',
    colorPalette: { primary: '#1B4332', secondary: '#D8F3DC', accent: '#D4AF37', banner: '#2D6A4F' },
    description: 'Fervor caravaneiro na Rota das Especiarias e cavaleiros mamelucos velozes.',
    bonuses: {
      economyBonus: { description: '+20% Trocas e Comércio no Bazar', resourceType: 'ouro', multiplier: 1.20 },
      militaryBonus: { description: '+15% Velocidade e ataque para Cavalaria do Deserto', unitCategory: 'cavalaria', attackMultiplier: 1.15, defenseMultiplier: 1.05 }
    },
    uniqueUnits: ['cavaleiro_mameluco', 'arqueiro_cameleiro'],
    uniqueBuildings: ['casa_da_sabedoria', 'caravancarai']
  },
  [CivilizationId.EGIPCIO]: {
    id: CivilizationId.EGIPCIO,
    name: 'Império Egípcio (Novo Império)',
    historicalPeriod: 'c. 1550 a.C. – 1077 a.C.',
    architecturalStyle: 'Faraônica (Pilones monumentais, arenito dourado e hieróglifos policromados)',
    colorPalette: { primary: '#0077B6', secondary: '#F4A261', accent: '#E76F51', banner: '#E9C46A' },
    description: 'Fertilidade divina das cheias do Nilo e carros de guerra faraônicos devastadores.',
    bonuses: {
      economyBonus: { description: '+25% Colheita de Alimentos às margens de canais', resourceType: 'alimento', multiplier: 1.25 },
      militaryBonus: { description: '+15% Velocidade de Carros de Guerra', unitCategory: 'cavalaria', attackMultiplier: 1.15, defenseMultiplier: 1.0 }
    },
    uniqueUnits: ['carro_de_guerra_faraonico', 'guerreiro_khopesh'],
    uniqueBuildings: ['templo_solar_karnak', 'obelisco_sagrado']
  },
  [CivilizationId.GREGO]: {
    id: CivilizationId.GREGO,
    name: 'Cidades-Estado Gregas',
    historicalPeriod: 'c. 500 a.C. – 146 a.C.',
    architecturalStyle: 'Helênica (Colunas dóricas, jônicas e coríntias em mármore branco)',
    colorPalette: { primary: '#005F73', secondary: '#94D2BD', accent: '#EE9B00', banner: '#0A9396' },
    description: 'Falanges espartanas impenetráveis e filosofia que acelera árvores de tecnologia.',
    bonuses: {
      economyBonus: { description: '+15% Velocidade de pesquisa militar e civil', resourceType: 'ouro', multiplier: 1.15 },
      militaryBonus: { description: '+25% Resistência frontal de Hoplitas em falange', unitCategory: 'infantaria', attackMultiplier: 1.05, defenseMultiplier: 1.25 }
    },
    uniqueUnits: ['hoplita_espartano', 'companheiro_macedonico'],
    uniqueBuildings: ['partenon_acropole', 'agora_filosofica']
  },
  [CivilizationId.MONGOL]: {
    id: CivilizationId.MONGOL,
    name: 'Império Mongol',
    historicalPeriod: 'c. 1206 d.C. – 1368 d.C.',
    architecturalStyle: 'Estepes & Nômade (Yurts ornamentadas, tendas reais e paliçadas móveis)',
    colorPalette: { primary: '#3A0CA3', secondary: '#4CC9F0', accent: '#F72585', banner: '#7209B7' },
    description: 'Mobilidade suprema em combate montado e saque de recursos em ataques relâmpago.',
    bonuses: {
      economyBonus: { description: '+20% Saque adicional em ataques PvP', resourceType: 'ouro', multiplier: 1.20 },
      militaryBonus: { description: '+25% Velocidade e alcance de Arqueiros Montados Mangudai', unitCategory: 'arquearia', attackMultiplier: 1.20, defenseMultiplier: 1.05 }
    },
    uniqueUnits: ['mangudai_arqueiro_montado', 'lanceiro_da_horda'],
    uniqueBuildings: ['yurt_do_grande_khan', 'totem_espiritual']
  },
  [CivilizationId.JAPONES]: {
    id: CivilizationId.JAPONES,
    name: 'Xogunato Japonês (Período Sengoku)',
    historicalPeriod: 'c. 1467 d.C. – 1603 d.C.',
    architecturalStyle: 'Feudal Japonesa (Castelos com fosso, telhados de telha preta e dojos)',
    colorPalette: { primary: '#D90429', secondary: '#EF233C', accent: '#2B2D42', banner: '#8D99AE' },
    description: 'Código Bushido inabalável que confere honra até a última gota de vida dos Samurais.',
    bonuses: {
      economyBonus: { description: '+15% Pesca e extração de Madeira de bordo', resourceType: 'madeira', multiplier: 1.15 },
      militaryBonus: { description: '+20% Velocidade de ataque de Samurais e bônus de duelo', unitCategory: 'infantaria_elite', attackMultiplier: 1.20, defenseMultiplier: 1.10 }
    },
    uniqueUnits: ['samurai_katana', 'ninja_shinobi'],
    uniqueBuildings: ['castelo_himeji', 'dojo_marcial']
  },
  [CivilizationId.INDIANO]: {
    id: CivilizationId.INDIANO,
    name: 'Império Máuria / Gupta',
    historicalPeriod: 'c. 322 a.C. – 550 d.C.',
    architecturalStyle: 'Védica Clássica (Templos talhados em rocha, estupas e portais torana)',
    colorPalette: { primary: '#FB8500', secondary: '#FFB703', accent: '#023047', banner: '#219EBC' },
    description: 'Elefantes de guerra couraçados com castelos montados e riqueza das minas de pedras preciosas.',
    bonuses: {
      economyBonus: { description: '+15% Produção de Gemas e Ouro', resourceType: 'ouro', multiplier: 1.15 },
      militaryBonus: { description: '+25% Vida e esmagamento de Elefantes de Guerra', unitCategory: 'cerco', attackMultiplier: 1.20, defenseMultiplier: 1.25 }
    },
    uniqueUnits: ['elefante_de_guerra_indiano', 'guerreiro_urumi'],
    uniqueBuildings: ['estupa_sagrada', 'palacio_dos_marajas']
  },
  [CivilizationId.OTOMANO]: {
    id: CivilizationId.OTOMANO,
    name: 'Império Otomano',
    historicalPeriod: 'c. 1299 d.C. – 1922 d.C.',
    architecturalStyle: 'Otomana Monumental (Mesquitas imperiais com cúpulas suspensas e fundições de bronze)',
    colorPalette: { primary: '#B5179E', secondary: '#7209B7', accent: '#F72585', banner: '#480CA8' },
    description: 'Janízaros implacáveis e os lendários canhões de bombarda de Dardanelos.',
    bonuses: {
      economyBonus: { description: '+15% Extração de Ferro e forja de armamentos', resourceType: 'ferro', multiplier: 1.15 },
      militaryBonus: { description: '+30% Dano de cerco contra muralhas e fortificações', unitCategory: 'cerco', attackMultiplier: 1.30, defenseMultiplier: 1.05 }
    },
    uniqueUnits: ['janizaro_elite', 'bombarda_de_bronze'],
    uniqueBuildings: ['arsenal_topkapi', 'fundicao_imperial']
  },
  [CivilizationId.CARTAGINES]: {
    id: CivilizationId.CARTAGINES,
    name: 'Império Cartaginês',
    historicalPeriod: 'c. 814 a.C. – 146 a.C.',
    architecturalStyle: 'Púnica Marítima (Porto circular cothon, estelas funerárias e fortalezas costeiras)',
    colorPalette: { primary: '#03045E', secondary: '#0077B6', accent: '#00B4D8', banner: '#90E0EF' },
    description: 'Monopólio naval mercantil e generais brilhantes capazes de contratar mercenários de elite.',
    bonuses: {
      economyBonus: { description: '+25% Renda comercial e armazenamento portuário', resourceType: 'ouro', multiplier: 1.25 },
      militaryBonus: { description: '+15% Bônus em unidades mercenárias e infantaria púnica', unitCategory: 'infantaria', attackMultiplier: 1.15, defenseMultiplier: 1.10 }
    },
    uniqueUnits: ['batalhao_sagrado_cartagines', 'cavalaria_numida'],
    uniqueBuildings: ['porto_militar_cothon', 'bazar_fenicio']
  },
  [CivilizationId.VIKING]: {
    id: CivilizationId.VIKING,
    name: 'Reinos Nórdicos / Vikings',
    historicalPeriod: 'c. 793 d.C. – 1066 d.C.',
    architecturalStyle: 'Nórdica de Madeira (Stave churches, longhouses de turfa e entalhes de dragão)',
    colorPalette: { primary: '#2B2D42', secondary: '#8D99AE', accent: '#D90429', banner: '#EDF2F4' },
    description: 'Guerreiros Berserkers destemidos que atacam com fúria cega e resistem a climas hostis.',
    bonuses: {
      economyBonus: { description: '+20% Extração rápida de Madeira nas florestas densas', resourceType: 'madeira', multiplier: 1.20 },
      militaryBonus: { description: '+25% Fúria e dano crítico para Berserkers com machado', unitCategory: 'infantaria', attackMultiplier: 1.25, defenseMultiplier: 0.95 }
    },
    uniqueUnits: ['berserker_do_machado', 'huscarle_com_escudo'],
    uniqueBuildings: ['meadhall_dos_jarls', 'estaleiro_drakkar']
  }
};
