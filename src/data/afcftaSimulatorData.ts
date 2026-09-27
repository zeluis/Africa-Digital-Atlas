import { AfricanRegion } from './types';

export interface BorderPostDetail {
  id: string;
  name: string;
  countryA: string;
  countryB: string;
  type: 'OSBP' | 'Traditional Dual-Post';
  baselineHours: number;
  afcftaSingleWindowHours: number;
  commonBottlenecks: string[];
}

export interface TradeCorridorPreset {
  id: string;
  name: string;
  rec: string;
  region: AfricanRegion;
  originCountry: string;
  originPort: string;
  destinationCountry: string;
  destinationHub: string;
  transitCountries: string[];
  distanceKm: number;
  baselineRoadDays: number;
  baselineBorderDays: number;
  afcftaOptimizedDays: number;
  annualTradeVolumeUSD: string;
  borderPosts: BorderPostDetail[];
  strategicLogisticsNote: string;
}

export interface HsCommodity {
  hsCode: string;
  name: string;
  category: string;
  defaultMfnTariffRate: number; // percentage, e.g. 20 for 20%
  recTariffRate: number;
  afcftaCatATariffRate: number; // usually 0%
  afcftaCatBTariffRate: number; // sensitive goods
  rulesOfOriginCriteria: string;
  minLocalContentPct: number;
  papssApproved: boolean;
  typicalContainerValueUSD: number;
}

export const AFCFTA_COMMODITIES: HsCommodity[] = [
  {
    hsCode: 'HS 1803',
    name: 'Processed Cocoa Paste, Butter & Powder',
    category: 'Agro-Processing & Food',
    defaultMfnTariffRate: 20.0,
    recTariffRate: 5.0,
    afcftaCatATariffRate: 0.0,
    afcftaCatBTariffRate: 10.0,
    rulesOfOriginCriteria: 'Wholly obtained beans or 40% local value addition in processing',
    minLocalContentPct: 40,
    papssApproved: true,
    typicalContainerValueUSD: 120000
  },
  {
    hsCode: 'HS 0901',
    name: 'Roasted Specialty Coffee & Tea Blends',
    category: 'Agro-Processing & Food',
    defaultMfnTariffRate: 25.0,
    recTariffRate: 7.5,
    afcftaCatATariffRate: 0.0,
    afcftaCatBTariffRate: 12.0,
    rulesOfOriginCriteria: 'Wholly obtained crop or 35% domestic milling & roasting',
    minLocalContentPct: 35,
    papssApproved: true,
    typicalContainerValueUSD: 85000
  },
  {
    hsCode: 'HS 8544',
    name: 'Refined Copper Wire, Insulated Cables & Conductors',
    category: 'Industrial Manufacturing & Energy',
    defaultMfnTariffRate: 15.0,
    recTariffRate: 4.0,
    afcftaCatATariffRate: 0.0,
    afcftaCatBTariffRate: 6.0,
    rulesOfOriginCriteria: 'Smelted continental cathode with 35% regional extrusion value-add',
    minLocalContentPct: 35,
    papssApproved: true,
    typicalContainerValueUSD: 180000
  },
  {
    hsCode: 'HS 8708',
    name: 'Commercial Vehicle Parts, Axles & Assembly Kits',
    category: 'Automotive & Heavy Industry',
    defaultMfnTariffRate: 25.0,
    recTariffRate: 10.0,
    afcftaCatATariffRate: 0.0,
    afcftaCatBTariffRate: 12.5,
    rulesOfOriginCriteria: 'Substantial local assembly with 40% value addition or CBU tariff change',
    minLocalContentPct: 40,
    papssApproved: true,
    typicalContainerValueUSD: 240000
  },
  {
    hsCode: 'HS 3004',
    name: 'Essential Medicines, Antibiotics & Vaccines',
    category: 'Pharmaceuticals & Health',
    defaultMfnTariffRate: 10.0,
    recTariffRate: 2.5,
    afcftaCatATariffRate: 0.0,
    afcftaCatBTariffRate: 5.0,
    rulesOfOriginCriteria: 'Active Pharmaceutical Ingredient (API) formulation or sterile fill-and-finish in member state',
    minLocalContentPct: 30,
    papssApproved: true,
    typicalContainerValueUSD: 160000
  },
  {
    hsCode: 'HS 3105',
    name: 'Mineral Fertilizers (NPK) & Soil Nutrients',
    category: 'Chemicals & Agriculture Inputs',
    defaultMfnTariffRate: 12.0,
    recTariffRate: 3.0,
    afcftaCatATariffRate: 0.0,
    afcftaCatBTariffRate: 6.0,
    rulesOfOriginCriteria: 'Chemical blending & granulating within African continental industrial parks',
    minLocalContentPct: 35,
    papssApproved: true,
    typicalContainerValueUSD: 95000
  },
  {
    hsCode: 'HS 6203',
    name: 'Woven Cotton Garments, Denim & Apparel',
    category: 'Textiles & Leather',
    defaultMfnTariffRate: 35.0,
    recTariffRate: 10.0,
    afcftaCatATariffRate: 0.0,
    afcftaCatBTariffRate: 15.0,
    rulesOfOriginCriteria: 'Double transformation rule (spinning and weaving within African bloc)',
    minLocalContentPct: 40,
    papssApproved: true,
    typicalContainerValueUSD: 70000
  },
  {
    hsCode: 'HS 6907',
    name: 'Ceramic Floor Tiles & Architectural Ceramics',
    category: 'Construction Materials',
    defaultMfnTariffRate: 20.0,
    recTariffRate: 6.0,
    afcftaCatATariffRate: 0.0,
    afcftaCatBTariffRate: 10.0,
    rulesOfOriginCriteria: 'Clay firing and glazing with minimum 35% local raw mineral feedstock',
    minLocalContentPct: 35,
    papssApproved: true,
    typicalContainerValueUSD: 65000
  },
  {
    hsCode: 'HS 2710',
    name: 'Refined Petroleum Fuels & Lubricants',
    category: 'Energy & Fuels',
    defaultMfnTariffRate: 10.0,
    recTariffRate: 3.0,
    afcftaCatATariffRate: 0.0,
    afcftaCatBTariffRate: 5.0,
    rulesOfOriginCriteria: 'Atmospheric distillation or catalytic reforming in African refinery',
    minLocalContentPct: 40,
    papssApproved: true,
    typicalContainerValueUSD: 210000
  }
];

export const AFCFTA_CORRIDOR_PRESETS: TradeCorridorPreset[] = [
  {
    id: 'abidjan-lagos',
    name: 'Abidjan–Lagos Coastal Megacity Corridor',
    rec: 'ECOWAS',
    region: 'Western Africa',
    originCountry: 'Ivory Coast',
    originPort: 'Port Autonome d’Abidjan',
    destinationCountry: 'Nigeria',
    destinationHub: 'Lagos (Apapa & Lekki Deep Sea Port)',
    transitCountries: ['Ivory Coast', 'Ghana', 'Togo', 'Benin', 'Nigeria'],
    distanceKm: 1022,
    baselineRoadDays: 2.5,
    baselineBorderDays: 5.8,
    afcftaOptimizedDays: 2.2,
    annualTradeVolumeUSD: '$16.8 Billion',
    borderPosts: [
      {
        id: 'noe-elubo',
        name: 'Noé – Elubo Border Post',
        countryA: 'Ivory Coast',
        countryB: 'Ghana',
        type: 'OSBP',
        baselineHours: 28,
        afcftaSingleWindowHours: 6,
        commonBottlenecks: ['Single-lane bridge crossing', 'Bilingual customs document translation friction']
      },
      {
        id: 'aflao-kodjoviakope',
        name: 'Aflao – Kodjoviakopé Border Post',
        countryA: 'Ghana',
        countryB: 'Togo',
        type: 'OSBP',
        baselineHours: 22,
        afcftaSingleWindowHours: 4,
        commonBottlenecks: ['High pedestrian trader density', 'Cargo scan queue congestion']
      },
      {
        id: 'sanvee-hillacondji',
        name: 'Sanvee-Condji – Hillacondji Border Post',
        countryA: 'Togo',
        countryB: 'Benin',
        type: 'Traditional Dual-Post',
        baselineHours: 32,
        afcftaSingleWindowHours: 8,
        commonBottlenecks: ['Dual customs inspection bays', 'Disparate transit bond regimes']
      },
      {
        id: 'seme-krake',
        name: 'Sémé – Kraké Joint Border Post',
        countryA: 'Benin',
        countryB: 'Nigeria',
        type: 'OSBP',
        baselineHours: 48,
        afcftaSingleWindowHours: 12,
        commonBottlenecks: ['Intermittent border security checks', 'Multiple agency physical inspections']
      }
    ],
    strategicLogisticsNote: 'Generates 75% of West African commercial trade. Connecting 5 nations and over 45 million urban consumers along the Gulf of Guinea.'
  },
  {
    id: 'northern-corridor',
    name: 'Northern Corridor (Mombasa – Kigali – Goma)',
    rec: 'EAC',
    region: 'Eastern Africa',
    originCountry: 'Kenya',
    originPort: 'Port of Mombasa (Kilindini Harbour)',
    destinationCountry: 'Rwanda',
    destinationHub: 'Kigali Logistics Platform (KLP)',
    transitCountries: ['Kenya', 'Uganda', 'Rwanda', 'DRC'],
    distanceKm: 1700,
    baselineRoadDays: 3.5,
    baselineBorderDays: 6.2,
    afcftaOptimizedDays: 3.0,
    annualTradeVolumeUSD: '$12.4 Billion',
    borderPosts: [
      {
        id: 'malaba-osbp',
        name: 'Malaba One-Stop Border Post',
        countryA: 'Kenya',
        countryB: 'Uganda',
        type: 'OSBP',
        baselineHours: 36,
        afcftaSingleWindowHours: 7,
        commonBottlenecks: ['Truck queue tailbacks exceeding 15 km', 'Customs digital server unsynchronized downtime']
      },
      {
        id: 'gatuna-katuna',
        name: 'Gatuna – Katuna Border Post',
        countryA: 'Uganda',
        countryB: 'Rwanda',
        type: 'OSBP',
        baselineHours: 20,
        afcftaSingleWindowHours: 4,
        commonBottlenecks: ['Mountainous topography approach', 'Axle load weighbridge calibration audits']
      }
    ],
    strategicLogisticsNote: 'Lifeline artery for landlocked East Africa (Uganda, Rwanda, Burundi, South Sudan, and eastern DRC). Standard Gauge Railway (SGR) integration underway.'
  },
  {
    id: 'north-south-corridor',
    name: 'North–South Mineral Corridor (Durban – Lubumbashi)',
    rec: 'SADC / COMESA',
    region: 'Southern Africa',
    originCountry: 'South Africa',
    originPort: 'Port of Durban Container Terminal',
    destinationCountry: 'DR Congo',
    destinationHub: 'Lubumbashi Mining Cluster (Katanga)',
    transitCountries: ['South Africa', 'Zimbabwe', 'Zambia', 'DR Congo'],
    distanceKm: 2750,
    baselineRoadDays: 5.5,
    baselineBorderDays: 8.5,
    afcftaOptimizedDays: 4.8,
    annualTradeVolumeUSD: '$21.5 Billion',
    borderPosts: [
      {
        id: 'beitbridge-osbp',
        name: 'Beitbridge Border Post (Limpopo Crossing)',
        countryA: 'South Africa',
        countryB: 'Zimbabwe',
        type: 'OSBP',
        baselineHours: 40,
        afcftaSingleWindowHours: 8,
        commonBottlenecks: ['Bridge concession toll processing', 'High freight volume during holiday periods']
      },
      {
        id: 'chirundu-osbp',
        name: 'Chirundu One-Stop Border Post (Zambezi)',
        countryA: 'Zimbabwe',
        countryB: 'Zambia',
        type: 'OSBP',
        baselineHours: 26,
        afcftaSingleWindowHours: 5,
        commonBottlenecks: ['Pioneer African OSBP; scanner maintenance windows']
      },
      {
        id: 'kasumbalesa-border',
        name: 'Kasumbalesa Copperbelt Border Post',
        countryA: 'Zambia',
        countryB: 'DR Congo',
        type: 'Traditional Dual-Post',
        baselineHours: 72,
        afcftaSingleWindowHours: 16,
        commonBottlenecks: ['Extreme truck queues up to 3 days', 'Non-harmonized transit visa surcharges']
      }
    ],
    strategicLogisticsNote: 'Primary export corridor for global battery minerals (copper, cobalt, lithium) and heavy industrial equipment from South African factories.'
  },
  {
    id: 'central-corridor',
    name: 'Central Corridor (Dar es Salaam – Kigali)',
    rec: 'EAC / SADC',
    region: 'Eastern Africa',
    originCountry: 'Tanzania',
    originPort: 'Port of Dar es Salaam',
    destinationCountry: 'Rwanda',
    destinationHub: 'Kigali Logistics Platform',
    transitCountries: ['Tanzania', 'Rwanda', 'Burundi'],
    distanceKm: 1450,
    baselineRoadDays: 3.0,
    baselineBorderDays: 4.5,
    afcftaOptimizedDays: 2.8,
    annualTradeVolumeUSD: '$8.2 Billion',
    borderPosts: [
      {
        id: 'rusumo-osbp',
        name: 'Rusumo International Border Post',
        countryA: 'Tanzania',
        countryB: 'Rwanda',
        type: 'OSBP',
        baselineHours: 24,
        afcftaSingleWindowHours: 5,
        commonBottlenecks: ['Single carriageway approach bridge', 'Electronic cargo tracking tag handoff']
      }
    ],
    strategicLogisticsNote: 'Offers competitive alternative to the Northern Corridor, connected by Tanzania Standard Gauge Railway (SGR) under construction.'
  },
  {
    id: 'trans-kalahari',
    name: 'Trans-Kalahari Corridor (Walvis Bay – Gauteng)',
    rec: 'SACU / SADC',
    region: 'Southern Africa',
    originCountry: 'Namibia',
    originPort: 'Port of Walvis Bay',
    destinationCountry: 'South Africa',
    destinationHub: 'Gauteng Industrial Hub (Johannesburg)',
    transitCountries: ['Namibia', 'Botswana', 'South Africa'],
    distanceKm: 1900,
    baselineRoadDays: 2.8,
    baselineBorderDays: 3.2,
    afcftaOptimizedDays: 2.0,
    annualTradeVolumeUSD: '$6.5 Billion',
    borderPosts: [
      {
        id: 'trans-kalahari-mamuno',
        name: 'Trans-Kalahari / Mamuno Border Post',
        countryA: 'Namibia',
        countryB: 'Botswana',
        type: 'OSBP',
        baselineHours: 12,
        afcftaSingleWindowHours: 3,
        commonBottlenecks: ['Remote desert infrastructure', 'Night-time border operating hour limitations']
      },
      {
        id: 'skilpadshek-pioneer',
        name: 'Pioneer Gate / Skilpadshek Border Post',
        countryA: 'Botswana',
        countryB: 'South Africa',
        type: 'OSBP',
        baselineHours: 14,
        afcftaSingleWindowHours: 3,
        commonBottlenecks: ['SACU common customs documentation alignment']
      }
    ],
    strategicLogisticsNote: 'Fastest Atlantic ocean route connecting Europe and the Americas directly to Southern Africa’s industrial heartland.'
  },
  {
    id: 'trans-sahara',
    name: 'Trans-Saharan Trade Highway (Algiers – Kano – Lagos)',
    rec: 'AMU / ECOWAS',
    region: 'Northern Africa',
    originCountry: 'Algeria',
    originPort: 'Port of Algiers',
    destinationCountry: 'Nigeria',
    destinationHub: 'Kano Dry Port & Lagos',
    transitCountries: ['Algeria', 'Niger', 'Nigeria'],
    distanceKm: 4500,
    baselineRoadDays: 9.0,
    baselineBorderDays: 7.0,
    afcftaOptimizedDays: 6.5,
    annualTradeVolumeUSD: '$4.2 Billion',
    borderPosts: [
      {
        id: 'in-guezzam',
        name: 'In Guezzam – Assamaka Desert Border Post',
        countryA: 'Algeria',
        countryB: 'Niger',
        type: 'Traditional Dual-Post',
        baselineHours: 48,
        afcftaSingleWindowHours: 14,
        commonBottlenecks: ['Desert convoy security checkpoints', 'Manual paper manifest processing']
      },
      {
        id: 'magaria-kongolam',
        name: 'Magaria – Kongolam Border Post',
        countryA: 'Niger',
        countryB: 'Nigeria',
        type: 'Traditional Dual-Post',
        baselineHours: 36,
        afcftaSingleWindowHours: 8,
        commonBottlenecks: ['Non-harmonized transit vehicle roadworthiness standards']
      }
    ],
    strategicLogisticsNote: '4,500 km transcontinental trade link bridging the Mediterranean with the Gulf of Guinea, key for agricultural and gas integration.'
  },
  {
    id: 'lekki-douala',
    name: 'Lekki – Douala Central Corridor',
    rec: 'ECOWAS / ECCAS',
    region: 'Central Africa',
    originCountry: 'Nigeria',
    originPort: 'Lekki Deep Sea Port, Lagos',
    destinationCountry: 'Cameroon',
    destinationHub: 'Port of Douala & Yaoundé',
    transitCountries: ['Nigeria', 'Cameroon'],
    distanceKm: 1180,
    baselineRoadDays: 3.2,
    baselineBorderDays: 4.8,
    afcftaOptimizedDays: 2.6,
    annualTradeVolumeUSD: '$3.8 Billion',
    borderPosts: [
      {
        id: 'mfum-ekok',
        name: 'Mfum – Ekok Joint Border Post',
        countryA: 'Nigeria',
        countryB: 'Cameroon',
        type: 'OSBP',
        baselineHours: 30,
        afcftaSingleWindowHours: 6,
        commonBottlenecks: ['Cross River mountainous terrain road wear', 'Inter-bloc currency convertibility between NGN and XAF']
      }
    ],
    strategicLogisticsNote: 'AfDB-funded Cross River bridge and OSBP directly connects West Africa’s largest economy with Central Africa (CEMAC).'
  }
];

export interface SimulationResult {
  consignmentValueUSD: number;
  containerCount: number;
  mfnDutyUSD: number;
  mfnDutyPct: number;
  simulatedDutyUSD: number;
  simulatedDutyPct: number;
  directTariffSavingsUSD: number;
  directTariffSavingsPct: number;
  papssFxSavingsUSD: number; // 3.5% saved by avoiding double FX via USD
  baselineTransitDays: number;
  simulatedTransitDays: number;
  daysSaved: number;
  borderClearanceHoursTotal: number;
  borderClearanceHoursBaseline: number;
  rooCompliant: boolean;
  rooCriteria: string;
  totalLandedSavingsUSD: number;
  carbonEmissionBaselineKg: number;
  carbonEmissionOptimizedKg: number;
}

export function runAfcftaSimulation(params: {
  corridor: TradeCorridorPreset;
  commodity: HsCommodity;
  consignmentValueUSD: number;
  containerCount: number;
  regime: 'mfn' | 'rec' | 'afcfta_cat_a' | 'afcfta_cat_b';
  usePapss: boolean;
  useSingleWindow: boolean;
  useGreenLane: boolean;
}): SimulationResult {
  const { corridor, commodity, consignmentValueUSD, containerCount, regime, usePapss, useSingleWindow, useGreenLane } = params;

  // 1. Calculate Tariff Duty
  const mfnDutyPct = commodity.defaultMfnTariffRate;
  let simulatedDutyPct = mfnDutyPct;

  if (regime === 'rec') {
    simulatedDutyPct = commodity.recTariffRate;
  } else if (regime === 'afcfta_cat_a') {
    simulatedDutyPct = commodity.afcftaCatATariffRate;
  } else if (regime === 'afcfta_cat_b') {
    simulatedDutyPct = commodity.afcftaCatBTariffRate;
  }

  const mfnDutyUSD = (consignmentValueUSD * mfnDutyPct) / 100;
  const simulatedDutyUSD = (consignmentValueUSD * simulatedDutyPct) / 100;
  const directTariffSavingsUSD = Math.max(0, mfnDutyUSD - simulatedDutyUSD);
  const directTariffSavingsPct = mfnDutyUSD > 0 ? (directTariffSavingsUSD / mfnDutyUSD) * 100 : 0;

  // 2. PAPSS Currency Conversion Savings (typically 3.8% of consignment value lost in USD/EUR intermediary banking)
  const papssFxSavingsUSD = usePapss ? consignmentValueUSD * 0.038 : 0;

  // 3. Border Clearance Times (Hours)
  let totalBaselineBorderHours = 0;
  let totalSimulatedBorderHours = 0;

  corridor.borderPosts.forEach(post => {
    totalBaselineBorderHours += post.baselineHours;
    let postSimulatedHours = post.baselineHours;

    if (useSingleWindow) {
      postSimulatedHours = post.afcftaSingleWindowHours;
    }
    if (useGreenLane) {
      postSimulatedHours = Math.max(2, postSimulatedHours * 0.65);
    }
    totalSimulatedBorderHours += postSimulatedHours;
  });

  const baselineTransitDays = corridor.baselineRoadDays + corridor.baselineBorderDays;
  const simulatedBorderDays = totalSimulatedBorderHours / 24;
  const simulatedRoadDays = corridor.baselineRoadDays * (useGreenLane ? 0.9 : 1.0);
  const simulatedTransitDays = Number((simulatedRoadDays + simulatedBorderDays).toFixed(1));
  const daysSaved = Number(Math.max(0, baselineTransitDays - simulatedTransitDays).toFixed(1));

  // 4. Logistics cost per day of delay ($250 per container/day idling)
  const demurrageSavings = daysSaved * (250 * containerCount);

  // Total landed savings
  const totalLandedSavingsUSD = directTariffSavingsUSD + papssFxSavingsUSD + demurrageSavings;

  // Carbon emissions: approx 0.082 kg CO2 per ton-km, average container 18 tons
  const totalTonKm = corridor.distanceKm * containerCount * 18;
  const carbonEmissionBaselineKg = Math.round(totalTonKm * 0.085);
  // Optimized routing and no border queue idling saves ~14% fuel emissions
  const carbonEmissionOptimizedKg = Math.round(carbonEmissionBaselineKg * 0.86);

  return {
    consignmentValueUSD,
    containerCount,
    mfnDutyUSD,
    mfnDutyPct,
    simulatedDutyUSD,
    simulatedDutyPct,
    directTariffSavingsUSD,
    directTariffSavingsPct,
    papssFxSavingsUSD,
    baselineTransitDays,
    simulatedTransitDays,
    daysSaved,
    borderClearanceHoursTotal: Math.round(totalSimulatedBorderHours),
    borderClearanceHoursBaseline: Math.round(totalBaselineBorderHours),
    rooCompliant: true,
    rooCriteria: commodity.rulesOfOriginCriteria,
    totalLandedSavingsUSD,
    carbonEmissionBaselineKg,
    carbonEmissionOptimizedKg
  };
}
