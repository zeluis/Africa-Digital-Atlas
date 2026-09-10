import { AfricanRegion } from './types';

export interface EthnicNode {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: AfricanRegion;
  percentage: number; // Calibrated representation / demographic share %
  branchAngle: number; // Polar angle in degrees (0 - 360)
  radialDistance: number; // Distance from center (0 to 1 normalized)
  cluster: 'west-central' | 'bight-coastal' | 'creole-sudanic' | 'perimeter';
  color: string;
  tastContext: string;
  historicalEmbarkation: string;
  wikipediaSlug: string;
  reportReferenceId?: string;
  linguisticFamily: string;
  estimatedDemographicPopulation?: string;
}

export interface CountryBranch {
  name: string;
  countryCode: string;
  region: AfricanRegion;
  color: string;
  startAngle: number;
  endAngle: number;
  meanAngle: number;
  tastVolumeShare: number; // Estimated % share in slave trade database
  totalNodes: number;
  keyPorts: string[];
}

export interface CoreClusterNode {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  percentage: number;
  color: string;
  clusterGroup: 1 | 2 | 3;
  description: string;
}

// 40 Sovereign country branch conduits matching AFRICALIA SVG color taxonomy
export const COUNTRY_BRANCHES: Record<string, CountryBranch> = {
  Nigeria: {
    name: 'Nigeria',
    countryCode: 'NGA',
    region: 'Western Africa',
    color: '#049B4D',
    startAngle: 110,
    endAngle: 155,
    meanAngle: 132.5,
    tastVolumeShare: 24.2,
    totalNodes: 18,
    keyPorts: ['Bonny', 'Calabar', 'Lagos', 'Badagry']
  },
  Benin: {
    name: 'Benin',
    countryCode: 'BEN',
    region: 'Western Africa',
    color: '#47AF48',
    startAngle: 156,
    endAngle: 168,
    meanAngle: 162,
    tastVolumeShare: 14.8,
    totalNodes: 7,
    keyPorts: ['Ouidah', 'Porto-Novo', 'Grand-Popo']
  },
  Ghana: {
    name: 'Ghana',
    countryCode: 'GHA',
    region: 'Western Africa',
    color: '#84A33A',
    startAngle: 169,
    endAngle: 180,
    meanAngle: 174.5,
    tastVolumeShare: 12.1,
    totalNodes: 8,
    keyPorts: ['Elmina Castle', 'Cape Coast Castle', 'Anomabu', 'Christiansborg']
  },
  IvoryCoast: {
    name: 'Ivory Coast',
    countryCode: 'CIV',
    region: 'Western Africa',
    color: '#C5D143',
    startAngle: 181,
    endAngle: 191,
    meanAngle: 186,
    tastVolumeShare: 3.4,
    totalNodes: 6,
    keyPorts: ['Grand-Bassam', 'Sassandra']
  },
  BurkinaFaso: {
    name: 'Burkina Faso',
    countryCode: 'BFA',
    region: 'Western Africa',
    color: '#D4E157',
    startAngle: 192,
    endAngle: 200,
    meanAngle: 196,
    tastVolumeShare: 2.1,
    totalNodes: 5,
    keyPorts: ['Sahel-Savannah Caravan Feeder routes']
  },
  SierraLeone: {
    name: 'Sierra Leone',
    countryCode: 'SLE',
    region: 'Western Africa',
    color: '#E6EE9C',
    startAngle: 201,
    endAngle: 211,
    meanAngle: 206,
    tastVolumeShare: 5.8,
    totalNodes: 6,
    keyPorts: ['Bunce Island', 'Freetown Estuary', 'Sherbro Island']
  },
  GuineaConakry: {
    name: 'Guinea Conakry',
    countryCode: 'GIN',
    region: 'Western Africa',
    color: '#AEEA00',
    startAngle: 212,
    endAngle: 220,
    meanAngle: 216,
    tastVolumeShare: 4.2,
    totalNodes: 5,
    keyPorts: ['Rio Pongo', 'Iles de Los', 'Boke']
  },
  GuineaBissau: {
    name: 'Guinea Bissau',
    countryCode: 'GNB',
    region: 'Western Africa',
    color: '#00C853',
    startAngle: 221,
    endAngle: 228,
    meanAngle: 224.5,
    tastVolumeShare: 3.1,
    totalNodes: 5,
    keyPorts: ['Cacheu', 'Bissau', 'Gebas']
  },
  Senegal: {
    name: 'Senegal',
    countryCode: 'SEN',
    region: 'Western Africa',
    color: '#1F8D3E',
    startAngle: 229,
    endAngle: 242,
    meanAngle: 235.5,
    tastVolumeShare: 6.9,
    totalNodes: 7,
    keyPorts: ['Gorée Island', 'Saint-Louis', 'Saloum']
  },
  CapeVerde: {
    name: 'Cape Verde Mix',
    countryCode: 'CPV',
    region: 'Western Africa',
    color: '#A4723A',
    startAngle: 243,
    endAngle: 248,
    meanAngle: 245.5,
    tastVolumeShare: 8.5,
    totalNodes: 4,
    keyPorts: ['Ribeira Grande (Cidade Velha)', 'Praia', 'Mindelo']
  },
  SouthAfrica: {
    name: 'South Africa',
    countryCode: 'ZAF',
    region: 'Southern Africa',
    color: '#FFC107',
    startAngle: 249,
    endAngle: 258,
    meanAngle: 253.5,
    tastVolumeShare: 2.3,
    totalNodes: 6,
    keyPorts: ['Cape Town (VOC slave lodge)', 'Simonstown']
  },
  Namibia: {
    name: 'Namibia',
    countryCode: 'NAM',
    region: 'Southern Africa',
    color: '#FFB300',
    startAngle: 259,
    endAngle: 265,
    meanAngle: 262,
    tastVolumeShare: 0.8,
    totalNodes: 3,
    keyPorts: ['Walvis Bay', 'Angra Pequena']
  },
  Botswana: {
    name: 'Botswana',
    countryCode: 'BWA',
    region: 'Southern Africa',
    color: '#F57C00',
    startAngle: 266,
    endAngle: 271,
    meanAngle: 268.5,
    tastVolumeShare: 0.6,
    totalNodes: 3,
    keyPorts: ['Kalahari interior conduits']
  },
  Zimbabwe: {
    name: 'Zimbabwe',
    countryCode: 'ZWE',
    region: 'Southern Africa',
    color: '#B2583A',
    startAngle: 272,
    endAngle: 277,
    meanAngle: 274.5,
    tastVolumeShare: 1.2,
    totalNodes: 4,
    keyPorts: ['Zambezi Valley routes to Sofala']
  },
  Mozambique: {
    name: 'Mozambique',
    countryCode: 'MOZ',
    region: 'Southern Africa',
    color: '#A0522D',
    startAngle: 278,
    endAngle: 286,
    meanAngle: 282,
    tastVolumeShare: 5.4,
    totalNodes: 6,
    keyPorts: ['Ilha de Moçambique', 'Quelimane', 'Inhambane', 'Lourenço Marques']
  },
  Malawi: {
    name: 'Malawi',
    countryCode: 'MWI',
    region: 'Southern Africa',
    color: '#8D6E63',
    startAngle: 287,
    endAngle: 292,
    meanAngle: 289.5,
    tastVolumeShare: 1.4,
    totalNodes: 3,
    keyPorts: ['Lake Nyasa trade hubs']
  },
  Zambia: {
    name: 'Zambia',
    countryCode: 'ZMB',
    region: 'Southern Africa',
    color: '#81522E',
    startAngle: 293,
    endAngle: 298,
    meanAngle: 295.5,
    tastVolumeShare: 1.7,
    totalNodes: 4,
    keyPorts: ['Kazembe Lunda trade corridors']
  },
  Angola: {
    name: 'Angola',
    countryCode: 'AGO',
    region: 'Central Africa',
    color: '#D66B17',
    startAngle: 299,
    endAngle: 316,
    meanAngle: 307.5,
    tastVolumeShare: 28.6,
    totalNodes: 12,
    keyPorts: ['Luanda', 'Benguela', 'Cabinda', 'Ambriz']
  },
  Tunisia: {
    name: 'Tunisia',
    countryCode: 'TUN',
    region: 'Northern Africa',
    color: '#B099C4',
    startAngle: 317,
    endAngle: 323,
    meanAngle: 320,
    tastVolumeShare: 1.1,
    totalNodes: 3,
    keyPorts: ['Tunis', 'Sousse', 'Djerba (Trans-Saharan)']
  },
  Algeria: {
    name: 'Algeria',
    countryCode: 'DZA',
    region: 'Northern Africa',
    color: '#9E94C3',
    startAngle: 324,
    endAngle: 331,
    meanAngle: 327.5,
    tastVolumeShare: 1.3,
    totalNodes: 4,
    keyPorts: ['Algiers', 'Oran', 'Ghardaia oasis']
  },
  Morocco: {
    name: 'Morocco',
    countryCode: 'MAR',
    region: 'Northern Africa',
    color: '#8A2BE2',
    startAngle: 332,
    endAngle: 341,
    meanAngle: 336.5,
    tastVolumeShare: 1.9,
    totalNodes: 5,
    keyPorts: ['Essaouira', 'Salé', 'Tangier', 'Marrakech oasis']
  },
  Egypt: {
    name: 'Egypt',
    countryCode: 'EGY',
    region: 'Northern Africa',
    color: '#DDA0DD',
    startAngle: 342,
    endAngle: 348,
    meanAngle: 345,
    tastVolumeShare: 2.0,
    totalNodes: 4,
    keyPorts: ['Alexandria', 'Cairo Darb al-Arba\'in terminus']
  },
  Libya: {
    name: 'Libya',
    countryCode: 'LBY',
    region: 'Northern Africa',
    color: '#D8BFD8',
    startAngle: 349,
    endAngle: 355,
    meanAngle: 352,
    tastVolumeShare: 1.4,
    totalNodes: 3,
    keyPorts: ['Tripoli', 'Benghazi', 'Murzuk oasis']
  },
  Somalia: {
    name: 'Somalia',
    countryCode: 'SOM',
    region: 'Eastern Africa',
    color: '#CD853F',
    startAngle: 356,
    endAngle: 2,
    meanAngle: 359,
    tastVolumeShare: 1.2,
    totalNodes: 3,
    keyPorts: ['Mogadishu', 'Berbera', 'Kismayo']
  },
  Eritrea: {
    name: 'Eritrea',
    countryCode: 'ERI',
    region: 'Eastern Africa',
    color: '#B38228',
    startAngle: 3,
    endAngle: 8,
    meanAngle: 5.5,
    tastVolumeShare: 0.9,
    totalNodes: 3,
    keyPorts: ['Massawa', 'Adulis ancient corridor']
  },
  Ethiopia: {
    name: 'Ethiopia',
    countryCode: 'ETH',
    region: 'Eastern Africa',
    color: '#E46B28',
    startAngle: 9,
    endAngle: 18,
    meanAngle: 13.5,
    tastVolumeShare: 2.2,
    totalNodes: 5,
    keyPorts: ['Gondar / Harar routes to Zeila']
  },
  Sudan: {
    name: 'Sudan',
    countryCode: 'SDN',
    region: 'Northern Africa',
    color: '#9D8356',
    startAngle: 19,
    endAngle: 28,
    meanAngle: 23.5,
    tastVolumeShare: 3.2,
    totalNodes: 5,
    keyPorts: ['Suakin', 'Shendi', 'Sennar', 'Kordofan hubs']
  },
  NubiaSouthSudan: {
    name: 'Nubia-South Sudan',
    countryCode: 'SSD',
    region: 'Eastern Africa',
    color: '#9F4327',
    startAngle: 29,
    endAngle: 37,
    meanAngle: 33,
    tastVolumeShare: 2.7,
    totalNodes: 4,
    keyPorts: ['Bahr el Ghazal zariba network', 'Gondokoro']
  },
  Tanzania: {
    name: 'Tanzania',
    countryCode: 'TZA',
    region: 'Eastern Africa',
    color: '#E95F69',
    startAngle: 38,
    endAngle: 48,
    meanAngle: 43,
    tastVolumeShare: 4.8,
    totalNodes: 6,
    keyPorts: ['Zanzibar Stone Town', 'Kilwa Kisiwani', 'Bagamoyo']
  },
  Rwanda: {
    name: 'Rwanda',
    countryCode: 'RWA',
    region: 'Eastern Africa',
    color: '#A5D6A7',
    startAngle: 49,
    endAngle: 53,
    meanAngle: 51,
    tastVolumeShare: 0.4,
    totalNodes: 2,
    keyPorts: ['Great Lakes interior borderlands']
  },
  Uganda: {
    name: 'Uganda',
    countryCode: 'UGA',
    region: 'Eastern Africa',
    color: '#81C784',
    startAngle: 54,
    endAngle: 60,
    meanAngle: 57,
    tastVolumeShare: 0.9,
    totalNodes: 3,
    keyPorts: ['Buganda Kingdom Lake Victoria hubs']
  },
  Kenya: {
    name: 'Kenya',
    countryCode: 'KEN',
    region: 'Eastern Africa',
    color: '#2E7D32',
    startAngle: 61,
    endAngle: 69,
    meanAngle: 65,
    tastVolumeShare: 2.1,
    totalNodes: 5,
    keyPorts: ['Mombasa (Fort Jesus)', 'Lamu', 'Malindi']
  },
  Chad: {
    name: 'Chad',
    countryCode: 'TCD',
    region: 'Central Africa',
    color: '#BC9F75',
    startAngle: 70,
    endAngle: 75,
    meanAngle: 72.5,
    tastVolumeShare: 1.5,
    totalNodes: 3,
    keyPorts: ['Kanem-Bornu / Wadai routes']
  },
  RC: {
    name: 'Republic of Congo',
    countryCode: 'COG',
    region: 'Central Africa',
    color: '#DCE775',
    startAngle: 76,
    endAngle: 81,
    meanAngle: 78.5,
    tastVolumeShare: 4.1,
    totalNodes: 4,
    keyPorts: ['Loango', 'Pointe-Noire', 'Mpinda']
  },
  CAR: {
    name: 'Central African Rep.',
    countryCode: 'CAF',
    region: 'Central Africa',
    color: '#C0CA33',
    startAngle: 82,
    endAngle: 86,
    meanAngle: 84,
    tastVolumeShare: 1.1,
    totalNodes: 3,
    keyPorts: ['Ubangi River conduits']
  },
  DRC: {
    name: 'DR Congo',
    countryCode: 'COD',
    region: 'Central Africa',
    color: '#7CB342',
    startAngle: 87,
    endAngle: 96,
    meanAngle: 91.5,
    tastVolumeShare: 11.2,
    totalNodes: 7,
    keyPorts: ['Boma', 'Banana', 'Matadi', 'Congo River mouth']
  },
  Gabon: {
    name: 'Gabon',
    countryCode: 'GAB',
    region: 'Central Africa',
    color: '#DEA715',
    startAngle: 97,
    endAngle: 102,
    meanAngle: 99.5,
    tastVolumeShare: 2.5,
    totalNodes: 4,
    keyPorts: ['Libreville Estuary', 'Cape Lopez']
  },
  GuineaEq: {
    name: 'Equatorial Guinea',
    countryCode: 'GNQ',
    region: 'Central Africa',
    color: '#F5B20B',
    startAngle: 103,
    endAngle: 107,
    meanAngle: 105,
    tastVolumeShare: 1.8,
    totalNodes: 3,
    keyPorts: ['Bioko Island (Fernando Po)', 'Corisco Bay']
  },
  Cameroon: {
    name: 'Cameroon',
    countryCode: 'CMR',
    region: 'Central Africa',
    color: '#AD7D29',
    startAngle: 108,
    endAngle: 116,
    meanAngle: 112,
    tastVolumeShare: 6.4,
    totalNodes: 6,
    keyPorts: ['Bimbia', 'Douala (Cameroons River)', 'Rio del Rey']
  },
  Niger: {
    name: 'Niger',
    countryCode: 'NER',
    region: 'Western Africa',
    color: '#5B99B1',
    startAngle: 117,
    endAngle: 122,
    meanAngle: 119.5,
    tastVolumeShare: 1.8,
    totalNodes: 4,
    keyPorts: ['Agadez Trans-Saharan hub', 'Zinder']
  },
  Mali: {
    name: 'Mali',
    countryCode: 'MLI',
    region: 'Western Africa',
    color: '#26ABDF',
    startAngle: 123,
    endAngle: 130,
    meanAngle: 126.5,
    tastVolumeShare: 3.5,
    totalNodes: 5,
    keyPorts: ['Timbuktu', 'Gao', 'Djenné', 'Niger River bend']
  },
  Mauritania: {
    name: 'Mauritania',
    countryCode: 'MRT',
    region: 'Western Africa',
    color: '#A4CEEA',
    startAngle: 131,
    endAngle: 136,
    meanAngle: 133.5,
    tastVolumeShare: 1.6,
    totalNodes: 4,
    keyPorts: ['Arguin Island', 'Portendick', 'Chinguetti']
  }
};

// 3 Central Quantitative Embarkation Clusters
export const CORE_CLUSTERS: CoreClusterNode[] = [
  {
    id: 'cluster-bight-benin-biafra',
    label: 'Bight of Benin & Biafra Core',
    x: 820,
    y: 980,
    radius: 54,
    percentage: 36.4,
    color: '#59453D',
    clusterGroup: 1,
    description: 'Primary Atlantic departure hub for Yoruba, Igbo, Ibibio, Fon, and Akan lineages, supplying plantation complexes in Bahia, Saint-Domingue, and Jamaica.'
  },
  {
    id: 'cluster-west-central-angola',
    label: 'West Central Africa & Congo Basin',
    x: 1180,
    y: 840,
    radius: 56,
    percentage: 42.1,
    color: '#795D38',
    clusterGroup: 2,
    description: 'The largest aggregate embarkation zone in human history. Centers Bakongo, Mbundu, Ovimbundu, and Teke demographic flows to Rio de Janeiro and the Caribbean.'
  },
  {
    id: 'cluster-senegambia-windward',
    label: 'Upper Guinea & Senegambia Nexus',
    x: 1010,
    y: 1240,
    radius: 46,
    percentage: 16.5,
    color: '#A4723A',
    clusterGroup: 3,
    description: 'Pioneering embarkation sector connecting Mandinka, Wolof, Fula, and Balanta populations, with maritime Creole ad-mixture anchored at Cabo Verde and Gorée.'
  },
  {
    id: 'cluster-cape-verde-anchor',
    label: 'Cape Verde Creole Epicenter',
    x: 640,
    y: 1210,
    radius: 44,
    percentage: 12.8,
    color: '#A4723A',
    clusterGroup: 3,
    description: 'Atlantic creolization crucible where West African lineages (Bambara, Wolof, Mandinka, Papel) fused into the first Afro-Atlantic Creole society.'
  }
];

// Curated comprehensive dictionary of African Ethnic Groups mapped to the tree
export const ETHNIC_NODES: EthnicNode[] = [
  // NIGERIA
  {
    id: 'yoruba',
    name: 'Yoruba',
    country: 'Nigeria',
    countryCode: 'NGA',
    region: 'Western Africa',
    percentage: 14.2,
    branchAngle: 115,
    radialDistance: 0.92,
    cluster: 'bight-coastal',
    color: '#049B4D',
    tastContext: 'Major representation in Bahia (Nagô), Cuba (Lucumí), Trinidad, and Sierra Leone recaptive settlements.',
    historicalEmbarkation: 'Bight of Benin (Lagos, Badagry, Porto-Novo, Ouidah)',
    wikipediaSlug: 'Yoruba_people',
    reportReferenceId: 'report-genetic-linguistic-blueprints',
    linguisticFamily: 'Niger-Congo (Defoid / Yoruboid)',
    estimatedDemographicPopulation: '47 Million'
  },
  {
    id: 'igbo',
    name: 'Igbo',
    country: 'Nigeria',
    countryCode: 'NGA',
    region: 'Western Africa',
    percentage: 13.8,
    branchAngle: 122,
    radialDistance: 0.94,
    cluster: 'bight-coastal',
    color: '#049B4D',
    tastContext: 'Predominant in Chesapeake Virginia, Maryland, Jamaica, Barbados, and Saint Kitts.',
    historicalEmbarkation: 'Bight of Biafra (Bonny, Calabar)',
    wikipediaSlug: 'Igbo_people',
    reportReferenceId: 'report-ancestry-ideology-underdevelopment',
    linguisticFamily: 'Niger-Congo (Igboid)',
    estimatedDemographicPopulation: '44 Million'
  },
  {
    id: 'hausa',
    name: 'Hausa',
    country: 'Nigeria',
    countryCode: 'NGA',
    region: 'Western Africa',
    percentage: 5.2,
    branchAngle: 128,
    radialDistance: 0.90,
    cluster: 'west-central',
    color: '#049B4D',
    tastContext: 'Present in the 1835 Malê revolt in Bahia; overland Trans-Saharan and Atlantic trade nexus.',
    historicalEmbarkation: 'Northern Nigeria / Trans-Saharan to Mediterranean & Lagos',
    wikipediaSlug: 'Hausa_people',
    reportReferenceId: 'report-sociological-origins-racism',
    linguisticFamily: 'Afroasiatic (Chadic)',
    estimatedDemographicPopulation: '78 Million'
  },
  {
    id: 'edo-bini',
    name: 'Edo / Bini',
    country: 'Nigeria',
    countryCode: 'NGA',
    region: 'Western Africa',
    percentage: 4.1,
    branchAngle: 134,
    radialDistance: 0.91,
    cluster: 'bight-coastal',
    color: '#049B4D',
    tastContext: 'Benin Kingdom imperial core; documented across Caribbean and Guyanese plantation registers.',
    historicalEmbarkation: 'Bight of Benin (Ughoton, Gwato, Lagos)',
    wikipediaSlug: 'Edo_people',
    reportReferenceId: 'report-ancestry-ideology-underdevelopment',
    linguisticFamily: 'Niger-Congo (Edoid)',
    estimatedDemographicPopulation: '5 Million'
  },
  {
    id: 'ibibio',
    name: 'Ibibio / Efik',
    country: 'Nigeria',
    countryCode: 'NGA',
    region: 'Western Africa',
    percentage: 6.7,
    branchAngle: 140,
    radialDistance: 0.93,
    cluster: 'bight-coastal',
    color: '#049B4D',
    tastContext: 'Foundational in Cuban Abakuá secret societies and Jamaican Maroon cultural patterns.',
    historicalEmbarkation: 'Bight of Biafra (Old Calabar, Cross River)',
    wikipediaSlug: 'Ibibio_people',
    reportReferenceId: 'report-genetic-linguistic-blueprints',
    linguisticFamily: 'Niger-Congo (Cross River)',
    estimatedDemographicPopulation: '7 Million'
  },
  {
    id: 'tiv',
    name: 'Tiv',
    country: 'Nigeria',
    countryCode: 'NGA',
    region: 'Western Africa',
    percentage: 2.8,
    branchAngle: 146,
    radialDistance: 0.89,
    cluster: 'bight-coastal',
    color: '#049B4D',
    tastContext: 'Middle Belt Benue Valley lineage transported through Niger River trading networks.',
    historicalEmbarkation: 'Bight of Biafra & Niger Delta ports',
    wikipediaSlug: 'Tiv_people',
    reportReferenceId: 'report-rao-model-socioeconomic',
    linguisticFamily: 'Niger-Congo (Tivoid)',
    estimatedDemographicPopulation: '5 Million'
  },
  {
    id: 'fulani-nigeria',
    name: 'Fulani / Fula',
    country: 'Nigeria',
    countryCode: 'NGA',
    region: 'Western Africa',
    percentage: 5.6,
    branchAngle: 152,
    radialDistance: 0.92,
    cluster: 'creole-sudanic',
    color: '#049B4D',
    tastContext: 'Prominent in biographical slave narratives (e.g. Omar ibn Said, Bilali Muhammad, Abdulrahman Ibrahim Ibn Sori).',
    historicalEmbarkation: 'Senegambia, Bight of Benin',
    wikipediaSlug: 'Fula_people',
    reportReferenceId: 'report-genetic-linguistic-blueprints',
    linguisticFamily: 'Niger-Congo (Senegambian)',
    estimatedDemographicPopulation: '40 Million'
  },

  // BENIN
  {
    id: 'fon',
    name: 'Fon / Dahomey',
    country: 'Benin',
    countryCode: 'BEN',
    region: 'Western Africa',
    percentage: 11.4,
    branchAngle: 159,
    radialDistance: 0.94,
    cluster: 'bight-coastal',
    color: '#47AF48',
    tastContext: 'Foundational lineage in Haitian Vodou (Rada rites), Brazilian Candomblé Jeje, and Louisiana Voodoo.',
    historicalEmbarkation: 'Bight of Benin (Ouidah, Kingdom of Dahomey)',
    wikipediaSlug: 'Fon_people',
    reportReferenceId: 'report-genetic-linguistic-blueprints',
    linguisticFamily: 'Niger-Congo (Gbe)',
    estimatedDemographicPopulation: '4.5 Million'
  },
  {
    id: 'aja',
    name: 'Aja',
    country: 'Benin',
    countryCode: 'BEN',
    region: 'Western Africa',
    percentage: 3.2,
    branchAngle: 164,
    radialDistance: 0.91,
    cluster: 'bight-coastal',
    color: '#47AF48',
    tastContext: 'Integral component of the Gbe language-speaking diasporas in the Caribbean and Maranhão.',
    historicalEmbarkation: 'Bight of Benin (Ouidah, Grand-Popo)',
    wikipediaSlug: 'Aja_people',
    reportReferenceId: 'report-genetic-linguistic-blueprints',
    linguisticFamily: 'Niger-Congo (Gbe)',
    estimatedDemographicPopulation: '2.5 Million'
  },

  // GHANA
  {
    id: 'akan-ashanti',
    name: 'Akan / Ashanti / Fante',
    country: 'Ghana',
    countryCode: 'GHA',
    region: 'Western Africa',
    percentage: 12.8,
    branchAngle: 172,
    radialDistance: 0.95,
    cluster: 'bight-coastal',
    color: '#84A33A',
    tastContext: 'Known as "Coromantee" in Jamaica and Barbados; led major 18th-century slave rebellions (Tacky\'s Rebellion, Maroon Wars).',
    historicalEmbarkation: 'Gold Coast (Cape Coast, Elmina, Anomabu)',
    wikipediaSlug: 'Akan_people',
    reportReferenceId: 'report-ancestry-ideology-underdevelopment',
    linguisticFamily: 'Niger-Congo (Kwa)',
    estimatedDemographicPopulation: '20 Million'
  },
  {
    id: 'ga-adangbe',
    name: 'Ga-Adangbe',
    country: 'Ghana',
    countryCode: 'GHA',
    region: 'Western Africa',
    percentage: 3.4,
    branchAngle: 177,
    radialDistance: 0.90,
    cluster: 'bight-coastal',
    color: '#84A33A',
    tastContext: 'Coastal maritime population embarking from Christiansborg Castle; established communities in the Danish West Indies.',
    historicalEmbarkation: 'Gold Coast (Osu, Accra, Keta)',
    wikipediaSlug: 'Ga-Adangbe_people',
    reportReferenceId: 'report-genetic-linguistic-blueprints',
    linguisticFamily: 'Niger-Congo (Kwa)',
    estimatedDemographicPopulation: '3.8 Million'
  },

  // SENEGAL & GAMBIA
  {
    id: 'wolof',
    name: 'Wolof',
    country: 'Senegal',
    countryCode: 'SEN',
    region: 'Western Africa',
    percentage: 7.8,
    branchAngle: 232,
    radialDistance: 0.93,
    cluster: 'creole-sudanic',
    color: '#1F8D3E',
    tastContext: 'Early 16th-century embarkations to Spanish colonies (Hispaniola); profound linguistic imprint on Papiamento and African American vernacular.',
    historicalEmbarkation: 'Senegambia (Gorée, Saint-Louis)',
    wikipediaSlug: 'Wolof_people',
    reportReferenceId: 'report-creole-admixture-cabo-verde',
    linguisticFamily: 'Niger-Congo (Senegambian)',
    estimatedDemographicPopulation: '8 Million'
  },
  {
    id: 'mandinka',
    name: 'Mandinka / Malinke',
    country: 'Senegal',
    countryCode: 'SEN',
    region: 'Western Africa',
    percentage: 8.5,
    branchAngle: 238,
    radialDistance: 0.94,
    cluster: 'creole-sudanic',
    color: '#1F8D3E',
    tastContext: 'Celebrated in Alex Haley\'s Roots (Kunta Kinte); extensive presence in Chesapeake, Louisiana, and Suriname.',
    historicalEmbarkation: 'Gambia River, James Island, Albreda',
    wikipediaSlug: 'Mandinka_people',
    reportReferenceId: 'report-creole-admixture-cabo-verde',
    linguisticFamily: 'Niger-Congo (Mande)',
    estimatedDemographicPopulation: '13 Million'
  },

  // CAPE VERDE
  {
    id: 'cape-verde-creole',
    name: 'Crioulo Caboverdiano',
    country: 'Cape Verde Mix',
    countryCode: 'CPV',
    region: 'Western Africa',
    percentage: 12.8,
    branchAngle: 245,
    radialDistance: 0.82,
    cluster: 'creole-sudanic',
    color: '#A4723A',
    tastContext: 'First Creole society in human history (1462); genetic bridge between Upper Guinea Mande/Atlantic populations and Southern Iberia.',
    historicalEmbarkation: 'Ribeira Grande, Praia, Ilha de Santiago',
    wikipediaSlug: 'Cape_Verdeans',
    reportReferenceId: 'report-genetic-social-structure-cape-verde',
    linguisticFamily: 'Creole (Portuguese lexical base + Senegambian substrate)',
    estimatedDemographicPopulation: '560,000 (Archipelago) + 1M (Diaspora)'
  },

  // ANGOLA & CONGO BASIN
  {
    id: 'bakongo',
    name: 'Bakongo / Kongo',
    country: 'Angola',
    countryCode: 'AGO',
    region: 'Central Africa',
    percentage: 18.5,
    branchAngle: 304,
    radialDistance: 0.96,
    cluster: 'west-central',
    color: '#D66B17',
    tastContext: 'Kingdom of Kongo core. Foundational demographic contributor to Brazil (Congadas), Cuba (Palo Monte), and Colombia (Palenque).',
    historicalEmbarkation: 'West Central Africa (Luanda, Cabinda, Mpinda)',
    wikipediaSlug: 'Kongo_people',
    reportReferenceId: 'report-latest-developments-genetic-legacy',
    linguisticFamily: 'Niger-Congo (Bantu)',
    estimatedDemographicPopulation: '10.5 Million'
  },
  {
    id: 'mbundu',
    name: 'Mbundu / Kimbundu',
    country: 'Angola',
    countryCode: 'AGO',
    region: 'Central Africa',
    percentage: 14.6,
    branchAngle: 310,
    radialDistance: 0.95,
    cluster: 'west-central',
    color: '#D66B17',
    tastContext: 'Kingdom of Ndongo (Queen Nzinga). Major source for colonial sugar and gold mines in Minas Gerais and Bahia.',
    historicalEmbarkation: 'Luanda, Kwanza River basin',
    wikipediaSlug: 'Mbundu_people',
    reportReferenceId: 'report-latest-developments-genetic-legacy',
    linguisticFamily: 'Niger-Congo (Bantu)',
    estimatedDemographicPopulation: '8 Million'
  },
  {
    id: 'ovimbundu',
    name: 'Ovimbundu',
    country: 'Angola',
    countryCode: 'AGO',
    region: 'Central Africa',
    percentage: 10.2,
    branchAngle: 314,
    radialDistance: 0.93,
    cluster: 'west-central',
    color: '#D66B17',
    tastContext: 'Bie Plateau traders; predominant in 18th and 19th century Brazilian arrivals via Benguela.',
    historicalEmbarkation: 'Benguela, Novo Redondo',
    wikipediaSlug: 'Ovimbundu_people',
    reportReferenceId: 'report-latest-developments-genetic-legacy',
    linguisticFamily: 'Niger-Congo (Bantu)',
    estimatedDemographicPopulation: '13 Million'
  },

  // MOZAMBIQUE
  {
    id: 'makua',
    name: 'Makua / Makhuwa',
    country: 'Mozambique',
    countryCode: 'MOZ',
    region: 'Southern Africa',
    percentage: 4.6,
    branchAngle: 281,
    radialDistance: 0.91,
    cluster: 'west-central',
    color: '#A0522D',
    tastContext: '19th-century Southwest Indian Ocean trade to Brazil, Cuba, and French Indian Ocean islands (Réunion, Mauritius).',
    historicalEmbarkation: 'Ilha de Moçambique, Quelimane',
    wikipediaSlug: 'Makua_people',
    reportReferenceId: 'report-slavery-international-law-reparatory',
    linguisticFamily: 'Niger-Congo (Bantu)',
    estimatedDemographicPopulation: '9 Million'
  },

  // CAMEROON
  {
    id: 'duala',
    name: 'Duala / Sawa',
    country: 'Cameroon',
    countryCode: 'CMR',
    region: 'Central Africa',
    percentage: 3.5,
    branchAngle: 111,
    radialDistance: 0.91,
    cluster: 'bight-coastal',
    color: '#AD7D29',
    tastContext: 'Wouri Estuary trading middlemen documented in British and Dutch 18th-century ledgers.',
    historicalEmbarkation: 'Bimbia, Rio del Rey, Douala',
    wikipediaSlug: 'Duala_people',
    reportReferenceId: 'report-ancestry-ideology-underdevelopment',
    linguisticFamily: 'Niger-Congo (Bantu)',
    estimatedDemographicPopulation: '2.5 Million'
  },
  {
    id: 'bamileke',
    name: 'Bamileke / Grassfields',
    country: 'Cameroon',
    countryCode: 'CMR',
    region: 'Central Africa',
    percentage: 4.8,
    branchAngle: 114,
    radialDistance: 0.92,
    cluster: 'bight-coastal',
    color: '#AD7D29',
    tastContext: 'Grassfield kingdoms with significant representation in Saint-Domingue (Haiti) and French Martinique.',
    historicalEmbarkation: 'Bimbia, Calabar estuary',
    wikipediaSlug: 'Bamileke_people',
    reportReferenceId: 'report-ancestry-ideology-underdevelopment',
    linguisticFamily: 'Niger-Congo (Grassfields Bantu)',
    estimatedDemographicPopulation: '4.8 Million'
  },

  // ETHIOPIA & HORN
  {
    id: 'oromo',
    name: 'Oromo',
    country: 'Ethiopia',
    countryCode: 'ETH',
    region: 'Eastern Africa',
    percentage: 3.8,
    branchAngle: 12,
    radialDistance: 0.90,
    cluster: 'creole-sudanic',
    color: '#E46B28',
    tastContext: 'Red Sea and Indian Ocean trade routes documented in Red Sea port records and Ottoman archives.',
    historicalEmbarkation: 'Zeila, Berbera, Massawa',
    wikipediaSlug: 'Oromo_people',
    reportReferenceId: 'report-sovereign-responsibility-reparations',
    linguisticFamily: 'Afroasiatic (Cushitic)',
    estimatedDemographicPopulation: '42 Million'
  },

  // SUDAN
  {
    id: 'dinka',
    name: 'Dinka',
    country: 'Nubia-South Sudan',
    countryCode: 'SSD',
    region: 'Eastern Africa',
    percentage: 2.9,
    branchAngle: 32,
    radialDistance: 0.89,
    cluster: 'creole-sudanic',
    color: '#9F4327',
    tastContext: 'White Nile and Bahr el Ghazal zariba raids; depicted in 19th-century abolitionist expedition reports.',
    historicalEmbarkation: 'Bahr el Ghazal, Khartoum Nile riverways',
    wikipediaSlug: 'Dinka_people',
    reportReferenceId: 'report-reparations-debt-anthropocene',
    linguisticFamily: 'Nilo-Saharan (Nilotic)',
    estimatedDemographicPopulation: '4.5 Million'
  }
];

export const TOTAL_AFRICAN_ETHNICITIES_INDEXED = ETHNIC_NODES.length;
export const TOTAL_COUNTRIES_INDEXED = Object.keys(COUNTRY_BRANCHES).length;
