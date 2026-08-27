/**
 * Africa Data Atlas v1.3 - 21 Sovereign and Regional Entity Blocs
 * Harmonized classifications covering continental groupings, income tiers,
 * resource intensity profiles, and Regional Economic Communities (RECs).
 */

export type EntityBlocId =
  // Continental & Income Tiers
  | 'NOA'      // Northern Africa (6)
  | 'SSA'      // Sub-Saharan Africa (48)
  | 'MIC'      // Middle-Income Countries (21)
  | 'LIC'      // Low-Income Countries (23)
  | 'CFS'      // Countries in Fragile Situations (19)
  | 'OEC'      // Oil-Exporting Countries (8)
  | 'ORIC'     // Other Resource-Intensive Countries (15)
  | 'NRIC'     // Non-Resource Intensive Countries (22)
  // Regional Economic Communities (RECs) & Customs Unions
  | 'ECOWAS'   // Economic Community of West African States (15)
  | 'WAEMU'    // West African Economic and Monetary Union (8)
  | 'CEMAC'    // Central African Economic and Monetary Community (6)
  | 'ECCAS'    // Economic Community of Central African States (11)
  | 'EAC'      // East African Community (7)
  | 'EAC5'     // East African Community Core Five (6)
  | 'SADC'     // Southern African Development Community (16)
  | 'SACU'     // Southern African Customs Union (5)
  | 'COMESA'   // Common Market for Eastern and Southern Africa (21)
  | 'AMU'      // Arab Maghreb Union (5)
  | 'CEN_SAD'  // Community of Sahel-Saharan States (29)
  | 'IGAD'     // Intergovernmental Authority on Development (8)
  | 'CwA';     // G20 Compact with Africa (13)

export type BlocCategory = 
  | 'Continental Tiers'
  | 'Income & Vulnerability'
  | 'Resource Intensity'
  | 'Regional Economic Communities'
  | 'Trade & Customs Unions';

export interface EntityBlocDefinition {
  id: EntityBlocId;
  name: string;
  shortName: string;
  category: BlocCategory;
  description: string;
  headquarters?: string;
  establishedYear?: number;
  memberCount: number;
  memberIso3s: string[];
  color: string;
}

export const ENTITY_BLOCS: Record<EntityBlocId, EntityBlocDefinition> = {
  // 1. Continental Tiers
  NOA: {
    id: 'NOA',
    name: 'Northern Africa Regional Tier',
    shortName: 'North Africa',
    category: 'Continental Tiers',
    description: 'Sovereign nations bordering the Mediterranean and Sahara northern rim.',
    memberCount: 6,
    memberIso3s: ['DZA', 'EGY', 'LBY', 'MAR', 'SDN', 'TUN'],
    color: '#0284c7'
  },
  SSA: {
    id: 'SSA',
    name: 'Sub-Saharan Africa Regional Tier',
    shortName: 'Sub-Saharan Africa',
    category: 'Continental Tiers',
    description: '48 continental and island sovereign nations south of the Sahara desert.',
    memberCount: 48,
    memberIso3s: [
      'AGO', 'BEN', 'BWA', 'BFA', 'BDI', 'CMR', 'CPV', 'CAF', 'TCD', 'COM',
      'COG', 'COD', 'CIV', 'DJI', 'GNQ', 'ERI', 'SWZ', 'ETH', 'GAB', 'GMB',
      'GHA', 'GIN', 'GNB', 'KEN', 'LSO', 'LBR', 'MDG', 'MWI', 'MLI', 'MRT',
      'MUS', 'MOZ', 'NAM', 'NER', 'NGA', 'RWA', 'STP', 'SEN', 'SYC', 'SLE',
      'SOM', 'ZAF', 'SSD', 'TZA', 'TGO', 'UGA', 'ZMB', 'ZWE'
    ],
    color: '#10b981'
  },

  // 2. Income & Vulnerability
  MIC: {
    id: 'MIC',
    name: 'Middle-Income African Economies',
    shortName: 'Middle-Income (MIC)',
    category: 'Income & Vulnerability',
    description: 'Nations categorized in lower-middle and upper-middle income brackets by the World Bank.',
    memberCount: 21,
    memberIso3s: [
      'DZA', 'AGO', 'BWA', 'CPV', 'CMR', 'COG', 'CIV', 'DJI', 'EGY', 'GNQ',
      'SWZ', 'GAB', 'GHA', 'KEN', 'LSO', 'MRT', 'MUS', 'MAR', 'NAM', 'NGA',
      'SEN', 'ZAF', 'TUN'
    ],
    color: '#3b82f6'
  },
  LIC: {
    id: 'LIC',
    name: 'Low-Income African Economies',
    shortName: 'Low-Income (LIC)',
    category: 'Income & Vulnerability',
    description: 'Economies with GNI per capita beneath the World Bank low-income operational threshold.',
    memberCount: 23,
    memberIso3s: [
      'BDI', 'BFA', 'CAF', 'TCD', 'COM', 'COD', 'ERI', 'ETH', 'GMB', 'GIN',
      'GNB', 'LBR', 'MDG', 'MWI', 'MLI', 'MOZ', 'NER', 'RWA', 'SLE', 'SOM',
      'SSD', 'SDN', 'TGO', 'UGA', 'ZMB'
    ],
    color: '#f59e0b'
  },
  CFS: {
    id: 'CFS',
    name: 'Countries in Fragile & Conflict-Affected Situations',
    shortName: 'Fragile Situations (CFS)',
    category: 'Income & Vulnerability',
    description: 'Nations facing institutional, governance, peacebuilding or climate-fragility headwinds.',
    memberCount: 19,
    memberIso3s: [
      'BDI', 'BFA', 'CMR', 'CAF', 'TCD', 'COM', 'COG', 'COD', 'ERI', 'GNB',
      'LBR', 'LBY', 'MLI', 'MOZ', 'NER', 'NGA', 'SOM', 'SSD', 'SDN', 'ZWE'
    ],
    color: '#ef4444'
  },

  // 3. Resource Intensity Profiles
  OEC: {
    id: 'OEC',
    name: 'Oil-Exporting African Economies',
    shortName: 'Oil Exporters (OEC)',
    category: 'Resource Intensity',
    description: 'Major hydrocarbons and petroleum producer nations where fuel exports dominate current account revenues.',
    memberCount: 8,
    memberIso3s: ['DZA', 'AGO', 'TCD', 'COG', 'GNQ', 'GAB', 'LBY', 'NGA'],
    color: '#8b5cf6'
  },
  ORIC: {
    id: 'ORIC',
    name: 'Other Resource-Intensive Economies',
    shortName: 'Mineral / Resource Rich',
    category: 'Resource Intensity',
    description: 'Nations with high mineral, metal, and critical raw materials extraction shares (copper, cobalt, gold, diamonds).',
    memberCount: 15,
    memberIso3s: [
      'BWA', 'BFA', 'CAF', 'COD', 'GHA', 'GIN', 'LBR', 'MLI', 'MRT', 'NAM',
      'NER', 'SLE', 'ZAF', 'ZMB', 'ZWE'
    ],
    color: '#d97706'
  },
  NRIC: {
    id: 'NRIC',
    name: 'Non-Resource Intensive Economies',
    shortName: 'Diversified / Non-Resource',
    category: 'Resource Intensity',
    description: 'Economies driven primarily by agriculture, services, manufacturing, technology, and regional transit.',
    memberCount: 22,
    memberIso3s: [
      'BEN', 'BDI', 'CPV', 'COM', 'CIV', 'DJI', 'EGY', 'ERI', 'ETH', 'GMB',
      'GNB', 'KEN', 'LSO', 'MDG', 'MWI', 'MUS', 'MAR', 'RWA', 'STP', 'SEN',
      'SYC', 'SOM', 'SWZ', 'TZA', 'TGO', 'TUN', 'UGA'
    ],
    color: '#06b6d4'
  },

  // 4. Regional Economic Communities (RECs)
  ECOWAS: {
    id: 'ECOWAS',
    name: 'Economic Community of West African States',
    shortName: 'ECOWAS',
    category: 'Regional Economic Communities',
    description: '15-member regional political and economic union of West Africa fostering trade integration and monetary cooperation.',
    headquarters: 'Abuja, Nigeria',
    establishedYear: 1975,
    memberCount: 15,
    memberIso3s: [
      'BEN', 'BFA', 'CPV', 'CIV', 'GMB', 'GHA', 'GIN', 'GNB', 'LBR', 'MLI',
      'NER', 'NGA', 'SEN', 'SLE', 'TGO'
    ],
    color: '#10b981'
  },
  WAEMU: {
    id: 'WAEMU',
    name: 'West African Economic and Monetary Union (UEMOA)',
    shortName: 'WAEMU / UEMOA',
    category: 'Trade & Customs Unions',
    description: '8 Francophone West African states sharing the West African CFA franc currency and central bank (BCEAO).',
    headquarters: 'Ouagadougou, Burkina Faso',
    establishedYear: 1994,
    memberCount: 8,
    memberIso3s: ['BEN', 'BFA', 'CIV', 'GNB', 'MLI', 'NER', 'SEN', 'TGO'],
    color: '#059669'
  },
  CEMAC: {
    id: 'CEMAC',
    name: 'Central African Economic and Monetary Community',
    shortName: 'CEMAC',
    category: 'Trade & Customs Unions',
    description: '6 Central African states sharing the Central African CFA franc currency and BEAC central banking system.',
    headquarters: 'Bangui, Central African Republic',
    establishedYear: 1999,
    memberCount: 6,
    memberIso3s: ['CMR', 'CAF', 'TCD', 'COG', 'GNQ', 'GAB'],
    color: '#f97316'
  },
  ECCAS: {
    id: 'ECCAS',
    name: 'Economic Community of Central African States (CEEAC)',
    shortName: 'ECCAS / CEEAC',
    category: 'Regional Economic Communities',
    description: '11 sovereign states promoting economic cooperation and peace in Central Africa.',
    headquarters: 'Libreville, Gabon',
    establishedYear: 1983,
    memberCount: 11,
    memberIso3s: ['AGO', 'BDI', 'CMR', 'CAF', 'TCD', 'COG', 'COD', 'GNQ', 'GAB', 'RWA', 'STP'],
    color: '#ea580c'
  },
  EAC: {
    id: 'EAC',
    name: 'East African Community',
    shortName: 'EAC',
    category: 'Regional Economic Communities',
    description: '8-member intergovernmental organization of the Great Lakes region and Horn of Africa operating a customs union.',
    headquarters: 'Arusha, Tanzania',
    establishedYear: 2000,
    memberCount: 8,
    memberIso3s: ['BDI', 'COD', 'KEN', 'RWA', 'SOM', 'SSD', 'TZA', 'UGA'],
    color: '#6366f1'
  },
  EAC5: {
    id: 'EAC5',
    name: 'East African Community Core Five Founders',
    shortName: 'EAC Core 5',
    category: 'Regional Economic Communities',
    description: 'Historical core constituent states of the East African Community single customs territory.',
    memberCount: 6,
    memberIso3s: ['BDI', 'KEN', 'RWA', 'SSD', 'TZA', 'UGA'],
    color: '#4f46e5'
  },
  SADC: {
    id: 'SADC',
    name: 'Southern African Development Community',
    shortName: 'SADC',
    category: 'Regional Economic Communities',
    description: '16-country inter-governmental body advancing socio-economic and security integration in Southern Africa.',
    headquarters: 'Gaborone, Botswana',
    establishedYear: 1980,
    memberCount: 16,
    memberIso3s: [
      'AGO', 'BWA', 'COM', 'COD', 'SWZ', 'LSO', 'MDG', 'MWI', 'MUS', 'MOZ',
      'NAM', 'SYC', 'ZAF', 'TZA', 'ZMB', 'ZWE'
    ],
    color: '#ec4899'
  },
  SACU: {
    id: 'SACU',
    name: 'Southern African Customs Union',
    shortName: 'SACU',
    category: 'Trade & Customs Unions',
    description: 'Oldest existing customs union in the world, maintaining a common external tariff among 5 Southern African partners.',
    headquarters: 'Windhoek, Namibia',
    establishedYear: 1910,
    memberCount: 5,
    memberIso3s: ['BWA', 'SWZ', 'LSO', 'NAM', 'ZAF'],
    color: '#db2777'
  },
  COMESA: {
    id: 'COMESA',
    name: 'Common Market for Eastern and Southern Africa',
    shortName: 'COMESA',
    category: 'Trade & Customs Unions',
    description: 'Free trade area extending from Egypt down to Eswatini spanning 21 member nations.',
    headquarters: 'Lusaka, Zambia',
    establishedYear: 1994,
    memberCount: 21,
    memberIso3s: [
      'BDI', 'COM', 'COD', 'DJI', 'EGY', 'ERI', 'SWZ', 'ETH', 'KEN', 'LBY',
      'MDG', 'MWI', 'MUS', 'RWA', 'SYC', 'SOM', 'SDN', 'TUN', 'UGA', 'ZMB', 'ZWE'
    ],
    color: '#14b8a6'
  },
  AMU: {
    id: 'AMU',
    name: 'Arab Maghreb Union (UMA)',
    shortName: 'AMU / UMA',
    category: 'Regional Economic Communities',
    description: 'Trade and political agreement between 5 North African Maghreb nations.',
    headquarters: 'Rabat, Morocco',
    establishedYear: 1989,
    memberCount: 5,
    memberIso3s: ['DZA', 'LBY', 'MAR', 'MRT', 'TUN'],
    color: '#0284c7'
  },
  CEN_SAD: {
    id: 'CEN_SAD',
    name: 'Community of Sahel-Saharan States',
    shortName: 'CEN-SAD',
    category: 'Regional Economic Communities',
    description: 'Economic framework established to create a free trade zone and sustainable development across Sahelian states.',
    headquarters: 'Tripoli, Libya',
    establishedYear: 1998,
    memberCount: 25,
    memberIso3s: [
      'BEN', 'BFA', 'CAF', 'TCD', 'COM', 'CIV', 'DJI', 'EGY', 'ERI', 'GMB',
      'GHA', 'GIN', 'GNB', 'LBY', 'MLI', 'MRT', 'MAR', 'NER', 'NGA', 'SEN',
      'SLE', 'SOM', 'SDN', 'TGO', 'TUN'
    ],
    color: '#84cc16'
  },
  IGAD: {
    id: 'IGAD',
    name: 'Intergovernmental Authority on Development',
    shortName: 'IGAD',
    category: 'Regional Economic Communities',
    description: '8-country trade and peace bloc in the Horn of Africa, Nile Valley, and Great Lakes region.',
    headquarters: 'Djibouti City, Djibouti',
    establishedYear: 1996,
    memberCount: 8,
    memberIso3s: ['DJI', 'ERI', 'ETH', 'KEN', 'SOM', 'SSD', 'SDN', 'UGA'],
    color: '#f59e0b'
  },
  CwA: {
    id: 'CwA',
    name: 'G20 Compact with Africa',
    shortName: 'G20 CwA',
    category: 'Trade & Customs Unions',
    description: 'Initiative promoting private investment, infrastructure modernization, and economic reform with G20 partners.',
    establishedYear: 2017,
    memberCount: 13,
    memberIso3s: [
      'BEN', 'BFA', 'CIV', 'COD', 'EGY', 'ETH', 'GHA', 'GIN', 'MAR', 'RWA',
      'SEN', 'TGO', 'TUN'
    ],
    color: '#a855f7'
  }
};

/**
 * Multi-dimensional entity-to-bloc membership index
 * Provides O(1) lookup of all 21 blocs a country belongs to.
 */
export const ENTITY_BLOC_MEMBERSHIP: Record<string, EntityBlocId[]> = (() => {
  const map: Record<string, EntityBlocId[]> = {};
  
  Object.values(ENTITY_BLOCS).forEach(bloc => {
    bloc.memberIso3s.forEach(iso3 => {
      if (!map[iso3]) {
        map[iso3] = [];
      }
      map[iso3].push(bloc.id);
    });
  });
  
  return map;
})();

/**
 * Lookup helper: Get all bloc IDs for a given country ISO3
 */
export function getCountryBlocs(iso3: string): EntityBlocDefinition[] {
  const blocIds = ENTITY_BLOC_MEMBERSHIP[iso3.toUpperCase()] || [];
  return blocIds.map(id => ENTITY_BLOCS[id]);
}

/**
 * Lookup helper: Get all countries in a given bloc
 */
export function getBlocMembers(blocId: EntityBlocId): string[] {
  return ENTITY_BLOCS[blocId]?.memberIso3s || [];
}

/**
 * Filter all 21 blocs by analytical category
 */
export function getBlocsByCategory(category: BlocCategory): EntityBlocDefinition[] {
  return Object.values(ENTITY_BLOCS).filter(b => b.category === category);
}

/**
 * List all available 21 analytical blocs
 */
export function getAllBlocs(): EntityBlocDefinition[] {
  return Object.values(ENTITY_BLOCS);
}
