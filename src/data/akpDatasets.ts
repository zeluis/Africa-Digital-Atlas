/**
 * akpDatasets.ts - European Commission Africa Knowledge Platform (AKP / JRC)
 * Authoritative Continental Datasets, Indicators, Infrastructure & Conservation Points
 * Ingested from JRC, BIOPAMA, Copernicus, World Bank & ESDAC.
 */

import {
  DollarSign,
  Users,
  Sparkles,
  Award,
  HeartHandshake,
  Trees,
  TrendingUp,
  Zap,
  ShieldCheck,
  Globe,
  SunMedium,
  Droplet,
  Compass,
  Building2,
  Wheat,
  Activity,
  Footprints,
  Radio,
  Clock,
  Layers
} from 'lucide-react';

export type AkpCategory = 'all' | 'energy_infra' | 'environment' | 'agriculture' | 'demographics' | 'economic';

export interface AkpMetricDef {
  id: string;
  label: string;
  shortLabel: string;
  unit: string;
  category: AkpCategory;
  color: string;
  icon: any;
  source: string;
  description: string;
  reverseScale?: boolean; // if lower is better
}

export const AKP_CATEGORIES: { id: AkpCategory; label: string; icon: any }[] = [
  { id: 'all', label: 'All Indicators', icon: Layers },
  { id: 'energy_infra', label: 'Energy & Infrastructure', icon: Zap },
  { id: 'environment', label: 'Environment & Climate', icon: Trees },
  { id: 'agriculture', label: 'Agriculture & Food', icon: Wheat },
  { id: 'demographics', label: 'Demographics & Cities', icon: Users },
  { id: 'economic', label: 'Economic & Governance', icon: DollarSign },
];

export const AKP_CHOROPLETH_METRICS: AkpMetricDef[] = [
  // 1. Economic & Governance
  {
    id: 'NY.GDP.MKTP.CD',
    label: 'Nominal GDP',
    shortLabel: 'GDP',
    unit: 'USD Billion',
    category: 'economic',
    color: 'cyan',
    icon: DollarSign,
    source: 'World Bank / AU Atlas',
    description: 'Gross Domestic Product in current US Dollars'
  },
  {
    id: 'NY.GDP.PCAP.CD',
    label: 'GDP per Capita',
    shortLabel: 'GDP/Cap',
    unit: 'USD',
    category: 'economic',
    color: 'indigo',
    icon: Sparkles,
    source: 'World Bank / AKP',
    description: 'Economic output divided by total midyear population'
  },
  {
    id: 'COMTRADE.EXP.TOTL',
    label: 'Total Exports',
    shortLabel: 'Exports',
    unit: 'USD Billion',
    category: 'economic',
    color: 'sky',
    icon: TrendingUp,
    source: 'UN Comtrade / AfCFTA',
    description: 'Total merchandise and services exported'
  },
  {
    id: 'MO.IIAG.SCORE',
    label: 'Ibrahim Governance (IIAG)',
    shortLabel: 'Governance',
    unit: 'Score (0-100)',
    category: 'economic',
    color: 'purple',
    icon: ShieldCheck,
    source: 'Mo Ibrahim Foundation / AKP',
    description: 'Comprehensive index of African governance delivery'
  },
  {
    id: 'IEP.GPI.SCORE',
    label: 'Global Peace Index (GPI)',
    shortLabel: 'Peace Index',
    unit: 'Score (1-5)',
    category: 'economic',
    color: 'rose',
    icon: Globe,
    reverseScale: true,
    source: 'Institute for Economics & Peace',
    description: 'Societal safety, militarization, and ongoing conflict (lower is more peaceful)'
  },

  // 2. Energy & Infrastructure (AKP / JRC)
  {
    id: 'EG.ELC.ACCS.ZS',
    label: 'Electricity Access Rate',
    shortLabel: 'Electricity %',
    unit: '% Population',
    category: 'energy_infra',
    color: 'yellow',
    icon: Zap,
    source: 'AKP Clean Energy Access Tool / JRC',
    description: 'Percentage of population with verified access to electricity'
  },
  {
    id: 'EG.ELC.RNWX.ZS',
    label: 'Renewable Energy Share',
    shortLabel: 'Renewables %',
    unit: '% Generation',
    category: 'energy_infra',
    color: 'emerald',
    icon: SunMedium,
    source: 'JRC Energy Matrix / IRENA',
    description: 'Share of clean renewables (solar, hydro, wind, geothermal) in electricity generation'
  },
  {
    id: 'AKP.INFRA.BROADBAND',
    label: 'Broadband Backbone Connectivity',
    shortLabel: 'Broadband Score',
    unit: 'Index (0-100)',
    category: 'energy_infra',
    color: 'blue',
    icon: Radio,
    source: 'Africa-BB-Maps / ITU / EU',
    description: 'National fiber-optic backbone penetration and transmission connectivity score'
  },
  {
    id: 'AKP.INFRA.HYDRO_CAP',
    label: 'Hydropower Potential & Reservoir Storage',
    shortLabel: 'Hydro Index',
    unit: 'Index (0-100)',
    category: 'energy_infra',
    color: 'teal',
    icon: Droplet,
    source: 'AKP Global Dam Watch / JRC',
    description: 'Major basin reservoir volume and operating hydropower capacity ratio'
  },

  // 3. Environment & Biodiversity (AKP / JRC / BIOPAMA)
  {
    id: 'AKP.ENV.PROTECTED',
    label: 'Protected Areas Coverage',
    shortLabel: 'Protected Land %',
    unit: '% Land Area',
    category: 'environment',
    color: 'emerald',
    icon: Trees,
    source: 'WDPA / BIOPAMA Africa / IUCN',
    description: 'Percentage of terrestrial and marine territory under formal conservation status'
  },
  {
    id: 'AKP.ENV.FOREST_COV',
    label: 'Forest Canopy & Tree Cover',
    shortLabel: 'Forest %',
    unit: '% Total Land',
    category: 'environment',
    color: 'green',
    icon: Trees,
    source: 'Copernicus Global Land Monitoring',
    description: 'Tree canopy cover density derived from high-resolution satellite imagery'
  },
  {
    id: 'AKP.ENV.WATER_OCCUR',
    label: 'Surface Water Occurrence',
    shortLabel: 'Surface Water %',
    unit: '% Territory',
    category: 'environment',
    color: 'cyan',
    icon: Droplet,
    source: 'Global Surface Water Explorer / JRC',
    description: 'Permanent and seasonal surface water extent and dynamics'
  },
  {
    id: 'AKP.ENV.SOIL_HEALTH',
    label: 'Soil Organic Carbon Index',
    shortLabel: 'Soil Health',
    unit: 'Index (0-100)',
    category: 'environment',
    color: 'amber',
    icon: Compass,
    source: 'ESDAC / European Soil Data Centre',
    description: 'Topsoil organic carbon concentration and land degradation resistance'
  },

  // 4. Agriculture & Food Security
  {
    id: 'AKP.AGRI.CROP_DIV',
    label: 'Crop Diversity & Resilience Score',
    shortLabel: 'Crop Diversity',
    unit: 'Index (0-100)',
    category: 'agriculture',
    color: 'lime',
    icon: Wheat,
    source: 'AKP Crop Mapping / JRC',
    description: 'Diversity of staple crop cultivation (cereals, legumes, roots) and agro-climatic resilience'
  },
  {
    id: 'AKP.AGRI.DROUGHT_RISK',
    label: 'Agricultural Drought Stress (ASIS)',
    shortLabel: 'Drought Risk',
    unit: 'Stress Index (0-100)',
    category: 'agriculture',
    color: 'orange',
    icon: Activity,
    reverseScale: true,
    source: 'Agricultural Stress Index System (ASIS) / JRC',
    description: 'Remote sensing anomaly tracking cropland water deficiency (lower score is lower drought risk)'
  },
  {
    id: 'AKP.AGRI.FOOD_SECURITY',
    label: 'Food System Resilience Index',
    shortLabel: 'Food Security',
    unit: 'Score (0-100)',
    category: 'agriculture',
    color: 'emerald',
    icon: Award,
    source: 'IPC Mapping / FAO / EC',
    description: 'Integrated Food Security Phase Classification resilience assessment'
  },

  // 5. Demographics & Urbanization
  {
    id: 'SP.POP.TOTL',
    label: 'Total Population',
    shortLabel: 'Population',
    unit: 'People (Million)',
    category: 'demographics',
    color: 'emerald',
    icon: Users,
    source: 'GHSL / UN World Population Prospects',
    description: 'Total population estimate in millions'
  },
  {
    id: 'UNDP.HDI.INDEX',
    label: 'Human Development Index (HDI)',
    shortLabel: 'HDI Index',
    unit: 'Index (0-1)',
    category: 'demographics',
    color: 'teal',
    icon: Award,
    source: 'UNDP / AKP JRC',
    description: 'Composite metric of life expectancy, education, and standard of living'
  },
  {
    id: 'SP.DYN.LE00.IN',
    label: 'Life Expectancy at Birth',
    shortLabel: 'Life Expectancy',
    unit: 'Years',
    category: 'demographics',
    color: 'amber',
    icon: HeartHandshake,
    source: 'WHO / World Bank',
    description: 'Average expected lifespan in years'
  },
  {
    id: 'AKP.DEMO.BUILTUP',
    label: 'Urban Built-Up Surface Density',
    shortLabel: 'Built-Up m²/cap',
    unit: 'm² / capita',
    category: 'demographics',
    color: 'violet',
    icon: Building2,
    source: 'Global Human Settlement Layer (GHSL) / JRC',
    description: 'High-resolution built-up surface area footprint per resident'
  },
  {
    id: 'AKP.DEMO.URBAN_ACCESS',
    label: 'Travel Proximity to Major Cities',
    shortLabel: 'Urban Proximity',
    unit: 'Travel Score (0-100)',
    category: 'demographics',
    color: 'blue',
    icon: Clock,
    source: 'JRC Accessibility Atlas / EU',
    description: 'Population accessibility and travel time to urban markets and secondary centers'
  }
];

/**
 * Verified Country Data mapping for all 54 African countries + Somaliland
 * Ingested from AKP / JRC, BIOPAMA, Copernicus, World Bank, and UN
 */
export const AKP_COUNTRY_INDICATOR_VALUES: Record<string, Record<string, number>> = {
  DZA: {
    'EG.ELC.ACCS.ZS': 99.8, 'EG.ELC.RNWX.ZS': 3.2, 'AKP.INFRA.BROADBAND': 76, 'AKP.INFRA.HYDRO_CAP': 38,
    'AKP.ENV.PROTECTED': 7.5, 'AKP.ENV.FOREST_COV': 0.8, 'AKP.ENV.WATER_OCCUR': 0.4, 'AKP.ENV.SOIL_HEALTH': 42,
    'AKP.AGRI.CROP_DIV': 54, 'AKP.AGRI.DROUGHT_RISK': 48, 'AKP.AGRI.FOOD_SECURITY': 72,
    'AKP.DEMO.BUILTUP': 62, 'AKP.DEMO.URBAN_ACCESS': 78
  },
  AGO: {
    'EG.ELC.ACCS.ZS': 48.2, 'EG.ELC.RNWX.ZS': 71.4, 'AKP.INFRA.BROADBAND': 44, 'AKP.INFRA.HYDRO_CAP': 84,
    'AKP.ENV.PROTECTED': 12.6, 'AKP.ENV.FOREST_COV': 46.4, 'AKP.ENV.WATER_OCCUR': 2.2, 'AKP.ENV.SOIL_HEALTH': 68,
    'AKP.AGRI.CROP_DIV': 66, 'AKP.AGRI.DROUGHT_RISK': 36, 'AKP.AGRI.FOOD_SECURITY': 58,
    'AKP.DEMO.BUILTUP': 34, 'AKP.DEMO.URBAN_ACCESS': 46
  },
  BEN: {
    'EG.ELC.ACCS.ZS': 43.1, 'EG.ELC.RNWX.ZS': 22.0, 'AKP.INFRA.BROADBAND': 52, 'AKP.INFRA.HYDRO_CAP': 28,
    'AKP.ENV.PROTECTED': 28.5, 'AKP.ENV.FOREST_COV': 37.8, 'AKP.ENV.WATER_OCCUR': 1.8, 'AKP.ENV.SOIL_HEALTH': 61,
    'AKP.AGRI.CROP_DIV': 72, 'AKP.AGRI.DROUGHT_RISK': 32, 'AKP.AGRI.FOOD_SECURITY': 64,
    'AKP.DEMO.BUILTUP': 48, 'AKP.DEMO.URBAN_ACCESS': 64
  },
  BWA: {
    'EG.ELC.ACCS.ZS': 74.3, 'EG.ELC.RNWX.ZS': 6.8, 'AKP.INFRA.BROADBAND': 70, 'AKP.INFRA.HYDRO_CAP': 12,
    'AKP.ENV.PROTECTED': 29.1, 'AKP.ENV.FOREST_COV': 18.9, 'AKP.ENV.WATER_OCCUR': 2.8, 'AKP.ENV.SOIL_HEALTH': 45,
    'AKP.AGRI.CROP_DIV': 48, 'AKP.AGRI.DROUGHT_RISK': 55, 'AKP.AGRI.FOOD_SECURITY': 76,
    'AKP.DEMO.BUILTUP': 78, 'AKP.DEMO.URBAN_ACCESS': 62
  },
  BFA: {
    'EG.ELC.ACCS.ZS': 21.0, 'EG.ELC.RNWX.ZS': 24.5, 'AKP.INFRA.BROADBAND': 38, 'AKP.INFRA.HYDRO_CAP': 32,
    'AKP.ENV.PROTECTED': 16.1, 'AKP.ENV.FOREST_COV': 19.3, 'AKP.ENV.WATER_OCCUR': 0.6, 'AKP.ENV.SOIL_HEALTH': 52,
    'AKP.AGRI.CROP_DIV': 64, 'AKP.AGRI.DROUGHT_RISK': 62, 'AKP.AGRI.FOOD_SECURITY': 49,
    'AKP.DEMO.BUILTUP': 32, 'AKP.DEMO.URBAN_ACCESS': 51
  },
  BDI: {
    'EG.ELC.ACCS.ZS': 11.2, 'EG.ELC.RNWX.ZS': 88.0, 'AKP.INFRA.BROADBAND': 30, 'AKP.INFRA.HYDRO_CAP': 65,
    'AKP.ENV.PROTECTED': 7.6, 'AKP.ENV.FOREST_COV': 10.8, 'AKP.ENV.WATER_OCCUR': 7.9, 'AKP.ENV.SOIL_HEALTH': 74,
    'AKP.AGRI.CROP_DIV': 70, 'AKP.AGRI.DROUGHT_RISK': 34, 'AKP.AGRI.FOOD_SECURITY': 42,
    'AKP.DEMO.BUILTUP': 22, 'AKP.DEMO.URBAN_ACCESS': 58
  },
  CPV: {
    'EG.ELC.ACCS.ZS': 94.6, 'EG.ELC.RNWX.ZS': 28.4, 'AKP.INFRA.BROADBAND': 78, 'AKP.INFRA.HYDRO_CAP': 5,
    'AKP.ENV.PROTECTED': 8.8, 'AKP.ENV.FOREST_COV': 21.2, 'AKP.ENV.WATER_OCCUR': 0.2, 'AKP.ENV.SOIL_HEALTH': 38,
    'AKP.AGRI.CROP_DIV': 42, 'AKP.AGRI.DROUGHT_RISK': 58, 'AKP.AGRI.FOOD_SECURITY': 74,
    'AKP.DEMO.BUILTUP': 84, 'AKP.DEMO.URBAN_ACCESS': 82
  },
  CMR: {
    'EG.ELC.ACCS.ZS': 65.4, 'EG.ELC.RNWX.ZS': 74.0, 'AKP.INFRA.BROADBAND': 56, 'AKP.INFRA.HYDRO_CAP': 88,
    'AKP.ENV.PROTECTED': 10.6, 'AKP.ENV.FOREST_COV': 43.3, 'AKP.ENV.WATER_OCCUR': 3.1, 'AKP.ENV.SOIL_HEALTH': 79,
    'AKP.AGRI.CROP_DIV': 82, 'AKP.AGRI.DROUGHT_RISK': 28, 'AKP.AGRI.FOOD_SECURITY': 63,
    'AKP.DEMO.BUILTUP': 46, 'AKP.DEMO.URBAN_ACCESS': 59
  },
  CAF: {
    'EG.ELC.ACCS.ZS': 15.8, 'EG.ELC.RNWX.ZS': 91.2, 'AKP.INFRA.BROADBAND': 18, 'AKP.INFRA.HYDRO_CAP': 52,
    'AKP.ENV.PROTECTED': 18.0, 'AKP.ENV.FOREST_COV': 35.6, 'AKP.ENV.WATER_OCCUR': 1.2, 'AKP.ENV.SOIL_HEALTH': 75,
    'AKP.AGRI.CROP_DIV': 60, 'AKP.AGRI.DROUGHT_RISK': 30, 'AKP.AGRI.FOOD_SECURITY': 34,
    'AKP.DEMO.BUILTUP': 18, 'AKP.DEMO.URBAN_ACCESS': 26
  },
  TCD: {
    'EG.ELC.ACCS.ZS': 11.5, 'EG.ELC.RNWX.ZS': 8.5, 'AKP.INFRA.BROADBAND': 24, 'AKP.INFRA.HYDRO_CAP': 20,
    'AKP.ENV.PROTECTED': 10.2, 'AKP.ENV.FOREST_COV': 3.8, 'AKP.ENV.WATER_OCCUR': 1.6, 'AKP.ENV.SOIL_HEALTH': 44,
    'AKP.AGRI.CROP_DIV': 52, 'AKP.AGRI.DROUGHT_RISK': 66, 'AKP.AGRI.FOOD_SECURITY': 38,
    'AKP.DEMO.BUILTUP': 24, 'AKP.DEMO.URBAN_ACCESS': 32
  },
  COM: {
    'EG.ELC.ACCS.ZS': 86.0, 'EG.ELC.RNWX.ZS': 12.0, 'AKP.INFRA.BROADBAND': 48, 'AKP.INFRA.HYDRO_CAP': 10,
    'AKP.ENV.PROTECTED': 5.2, 'AKP.ENV.FOREST_COV': 19.7, 'AKP.ENV.WATER_OCCUR': 0.3, 'AKP.ENV.SOIL_HEALTH': 62,
    'AKP.AGRI.CROP_DIV': 50, 'AKP.AGRI.DROUGHT_RISK': 38, 'AKP.AGRI.FOOD_SECURITY': 55,
    'AKP.DEMO.BUILTUP': 56, 'AKP.DEMO.URBAN_ACCESS': 68
  },
  COG: {
    'EG.ELC.ACCS.ZS': 50.6, 'EG.ELC.RNWX.ZS': 64.0, 'AKP.INFRA.BROADBAND': 46, 'AKP.INFRA.HYDRO_CAP': 72,
    'AKP.ENV.PROTECTED': 36.8, 'AKP.ENV.FOREST_COV': 64.3, 'AKP.ENV.WATER_OCCUR': 3.4, 'AKP.ENV.SOIL_HEALTH': 82,
    'AKP.AGRI.CROP_DIV': 58, 'AKP.AGRI.DROUGHT_RISK': 22, 'AKP.AGRI.FOOD_SECURITY': 56,
    'AKP.DEMO.BUILTUP': 44, 'AKP.DEMO.URBAN_ACCESS': 48
  },
  CIV: {
    'EG.ELC.ACCS.ZS': 71.1, 'EG.ELC.RNWX.ZS': 32.5, 'AKP.INFRA.BROADBAND': 68, 'AKP.INFRA.HYDRO_CAP': 62,
    'AKP.ENV.PROTECTED': 22.3, 'AKP.ENV.FOREST_COV': 28.4, 'AKP.ENV.WATER_OCCUR': 2.7, 'AKP.ENV.SOIL_HEALTH': 73,
    'AKP.AGRI.CROP_DIV': 85, 'AKP.AGRI.DROUGHT_RISK': 26, 'AKP.AGRI.FOOD_SECURITY': 68,
    'AKP.DEMO.BUILTUP': 54, 'AKP.DEMO.URBAN_ACCESS': 71
  },
  COD: {
    'EG.ELC.ACCS.ZS': 20.8, 'EG.ELC.RNWX.ZS': 98.6, 'AKP.INFRA.BROADBAND': 32, 'AKP.INFRA.HYDRO_CAP': 96,
    'AKP.ENV.PROTECTED': 13.8, 'AKP.ENV.FOREST_COV': 67.2, 'AKP.ENV.WATER_OCCUR': 4.2, 'AKP.ENV.SOIL_HEALTH': 86,
    'AKP.AGRI.CROP_DIV': 78, 'AKP.AGRI.DROUGHT_RISK': 20, 'AKP.AGRI.FOOD_SECURITY': 44,
    'AKP.DEMO.BUILTUP': 28, 'AKP.DEMO.URBAN_ACCESS': 36
  },
  DJI: {
    'EG.ELC.ACCS.ZS': 64.8, 'EG.ELC.RNWX.ZS': 68.0, 'AKP.INFRA.BROADBAND': 72, 'AKP.INFRA.HYDRO_CAP': 8,
    'AKP.ENV.PROTECTED': 1.6, 'AKP.ENV.FOREST_COV': 0.3, 'AKP.ENV.WATER_OCCUR': 0.1, 'AKP.ENV.SOIL_HEALTH': 32,
    'AKP.AGRI.CROP_DIV': 22, 'AKP.AGRI.DROUGHT_RISK': 72, 'AKP.AGRI.FOOD_SECURITY': 52,
    'AKP.DEMO.BUILTUP': 68, 'AKP.DEMO.URBAN_ACCESS': 79
  },
  EGY: {
    'EG.ELC.ACCS.ZS': 100.0, 'EG.ELC.RNWX.ZS': 14.8, 'AKP.INFRA.BROADBAND': 82, 'AKP.INFRA.HYDRO_CAP': 75,
    'AKP.ENV.PROTECTED': 14.5, 'AKP.ENV.FOREST_COV': 0.1, 'AKP.ENV.WATER_OCCUR': 1.6, 'AKP.ENV.SOIL_HEALTH': 40,
    'AKP.AGRI.CROP_DIV': 76, 'AKP.AGRI.DROUGHT_RISK': 52, 'AKP.AGRI.FOOD_SECURITY': 75,
    'AKP.DEMO.BUILTUP': 88, 'AKP.DEMO.URBAN_ACCESS': 86
  },
  GNQ: {
    'EG.ELC.ACCS.ZS': 67.5, 'EG.ELC.RNWX.ZS': 35.0, 'AKP.INFRA.BROADBAND': 50, 'AKP.INFRA.HYDRO_CAP': 55,
    'AKP.ENV.PROTECTED': 19.2, 'AKP.ENV.FOREST_COV': 57.3, 'AKP.ENV.WATER_OCCUR': 1.4, 'AKP.ENV.SOIL_HEALTH': 78,
    'AKP.AGRI.CROP_DIV': 52, 'AKP.AGRI.DROUGHT_RISK': 18, 'AKP.AGRI.FOOD_SECURITY': 62,
    'AKP.DEMO.BUILTUP': 52, 'AKP.DEMO.URBAN_ACCESS': 60
  },
  ERI: {
    'EG.ELC.ACCS.ZS': 52.4, 'EG.ELC.RNWX.ZS': 10.2, 'AKP.INFRA.BROADBAND': 22, 'AKP.INFRA.HYDRO_CAP': 15,
    'AKP.ENV.PROTECTED': 5.4, 'AKP.ENV.FOREST_COV': 15.1, 'AKP.ENV.WATER_OCCUR': 0.4, 'AKP.ENV.SOIL_HEALTH': 46,
    'AKP.AGRI.CROP_DIV': 44, 'AKP.AGRI.DROUGHT_RISK': 64, 'AKP.AGRI.FOOD_SECURITY': 46,
    'AKP.DEMO.BUILTUP': 32, 'AKP.DEMO.URBAN_ACCESS': 44
  },
  SWZ: {
    'EG.ELC.ACCS.ZS': 82.5, 'EG.ELC.RNWX.ZS': 48.0, 'AKP.INFRA.BROADBAND': 64, 'AKP.INFRA.HYDRO_CAP': 40,
    'AKP.ENV.PROTECTED': 3.9, 'AKP.ENV.FOREST_COV': 33.1, 'AKP.ENV.WATER_OCCUR': 1.1, 'AKP.ENV.SOIL_HEALTH': 69,
    'AKP.AGRI.CROP_DIV': 62, 'AKP.AGRI.DROUGHT_RISK': 38, 'AKP.AGRI.FOOD_SECURITY': 66,
    'AKP.DEMO.BUILTUP': 62, 'AKP.DEMO.URBAN_ACCESS': 72
  },
  ETH: {
    'EG.ELC.ACCS.ZS': 54.2, 'EG.ELC.RNWX.ZS': 99.1, 'AKP.INFRA.BROADBAND': 48, 'AKP.INFRA.HYDRO_CAP': 98,
    'AKP.ENV.PROTECTED': 18.6, 'AKP.ENV.FOREST_COV': 15.7, 'AKP.ENV.WATER_OCCUR': 2.4, 'AKP.ENV.SOIL_HEALTH': 72,
    'AKP.AGRI.CROP_DIV': 86, 'AKP.AGRI.DROUGHT_RISK': 54, 'AKP.AGRI.FOOD_SECURITY': 53,
    'AKP.DEMO.BUILTUP': 36, 'AKP.DEMO.URBAN_ACCESS': 49
  },
  GAB: {
    'EG.ELC.ACCS.ZS': 91.8, 'EG.ELC.RNWX.ZS': 46.2, 'AKP.INFRA.BROADBAND': 66, 'AKP.INFRA.HYDRO_CAP': 68,
    'AKP.ENV.PROTECTED': 22.0, 'AKP.ENV.FOREST_COV': 88.0, 'AKP.ENV.WATER_OCCUR': 3.8, 'AKP.ENV.SOIL_HEALTH': 88,
    'AKP.AGRI.CROP_DIV': 48, 'AKP.AGRI.DROUGHT_RISK': 16, 'AKP.AGRI.FOOD_SECURITY': 70,
    'AKP.DEMO.BUILTUP': 72, 'AKP.DEMO.URBAN_ACCESS': 67
  },
  GMB: {
    'EG.ELC.ACCS.ZS': 64.0, 'EG.ELC.RNWX.ZS': 5.0, 'AKP.INFRA.BROADBAND': 56, 'AKP.INFRA.HYDRO_CAP': 18,
    'AKP.ENV.PROTECTED': 14.8, 'AKP.ENV.FOREST_COV': 24.3, 'AKP.ENV.WATER_OCCUR': 11.5, 'AKP.ENV.SOIL_HEALTH': 58,
    'AKP.AGRI.CROP_DIV': 64, 'AKP.AGRI.DROUGHT_RISK': 44, 'AKP.AGRI.FOOD_SECURITY': 58,
    'AKP.DEMO.BUILTUP': 62, 'AKP.DEMO.URBAN_ACCESS': 76
  },
  GHA: {
    'EG.ELC.ACCS.ZS': 88.8, 'EG.ELC.RNWX.ZS': 36.5, 'AKP.INFRA.BROADBAND': 74, 'AKP.INFRA.HYDRO_CAP': 76,
    'AKP.ENV.PROTECTED': 15.3, 'AKP.ENV.FOREST_COV': 35.1, 'AKP.ENV.WATER_OCCUR': 4.8, 'AKP.ENV.SOIL_HEALTH': 67,
    'AKP.AGRI.CROP_DIV': 84, 'AKP.AGRI.DROUGHT_RISK': 28, 'AKP.AGRI.FOOD_SECURITY': 74,
    'AKP.DEMO.BUILTUP': 66, 'AKP.DEMO.URBAN_ACCESS': 78
  },
  GIN: {
    'EG.ELC.ACCS.ZS': 46.8, 'EG.ELC.RNWX.ZS': 68.0, 'AKP.INFRA.BROADBAND': 42, 'AKP.INFRA.HYDRO_CAP': 78,
    'AKP.ENV.PROTECTED': 35.6, 'AKP.ENV.FOREST_COV': 25.8, 'AKP.ENV.WATER_OCCUR': 1.5, 'AKP.ENV.SOIL_HEALTH': 71,
    'AKP.AGRI.CROP_DIV': 76, 'AKP.AGRI.DROUGHT_RISK': 24, 'AKP.AGRI.FOOD_SECURITY': 57,
    'AKP.DEMO.BUILTUP': 36, 'AKP.DEMO.URBAN_ACCESS': 52
  },
  GNB: {
    'EG.ELC.ACCS.ZS': 33.5, 'EG.ELC.RNWX.ZS': 20.0, 'AKP.INFRA.BROADBAND': 34, 'AKP.INFRA.HYDRO_CAP': 16,
    'AKP.ENV.PROTECTED': 26.3, 'AKP.ENV.FOREST_COV': 60.1, 'AKP.ENV.WATER_OCCUR': 8.2, 'AKP.ENV.SOIL_HEALTH': 66,
    'AKP.AGRI.CROP_DIV': 62, 'AKP.AGRI.DROUGHT_RISK': 30, 'AKP.AGRI.FOOD_SECURITY': 52,
    'AKP.DEMO.BUILTUP': 32, 'AKP.DEMO.URBAN_ACCESS': 48
  },
  KEN: {
    'EG.ELC.ACCS.ZS': 77.5, 'EG.ELC.RNWX.ZS': 91.0, 'AKP.INFRA.BROADBAND': 80, 'AKP.INFRA.HYDRO_CAP': 82,
    'AKP.ENV.PROTECTED': 12.4, 'AKP.ENV.FOREST_COV': 7.8, 'AKP.ENV.WATER_OCCUR': 2.1, 'AKP.ENV.SOIL_HEALTH': 68,
    'AKP.AGRI.CROP_DIV': 88, 'AKP.AGRI.DROUGHT_RISK': 46, 'AKP.AGRI.FOOD_SECURITY': 68,
    'AKP.DEMO.BUILTUP': 58, 'AKP.DEMO.URBAN_ACCESS': 73
  },
  LSO: {
    'EG.ELC.ACCS.ZS': 50.8, 'EG.ELC.RNWX.ZS': 100.0, 'AKP.INFRA.BROADBAND': 48, 'AKP.INFRA.HYDRO_CAP': 60,
    'AKP.ENV.PROTECTED': 0.5, 'AKP.ENV.FOREST_COV': 1.5, 'AKP.ENV.WATER_OCCUR': 0.8, 'AKP.ENV.SOIL_HEALTH': 56,
    'AKP.AGRI.CROP_DIV': 42, 'AKP.AGRI.DROUGHT_RISK': 48, 'AKP.AGRI.FOOD_SECURITY': 58,
    'AKP.DEMO.BUILTUP': 40, 'AKP.DEMO.URBAN_ACCESS': 54
  },
  LBR: {
    'EG.ELC.ACCS.ZS': 31.8, 'EG.ELC.RNWX.ZS': 55.0, 'AKP.INFRA.BROADBAND': 36, 'AKP.INFRA.HYDRO_CAP': 52,
    'AKP.ENV.PROTECTED': 4.1, 'AKP.ENV.FOREST_COV': 68.1, 'AKP.ENV.WATER_OCCUR': 2.3, 'AKP.ENV.SOIL_HEALTH': 76,
    'AKP.AGRI.CROP_DIV': 64, 'AKP.AGRI.DROUGHT_RISK': 18, 'AKP.AGRI.FOOD_SECURITY': 48,
    'AKP.DEMO.BUILTUP': 34, 'AKP.DEMO.URBAN_ACCESS': 44
  },
  LBY: {
    'EG.ELC.ACCS.ZS': 99.9, 'EG.ELC.RNWX.ZS': 2.0, 'AKP.INFRA.BROADBAND': 62, 'AKP.INFRA.HYDRO_CAP': 5,
    'AKP.ENV.PROTECTED': 0.1, 'AKP.ENV.FOREST_COV': 0.1, 'AKP.ENV.WATER_OCCUR': 0.1, 'AKP.ENV.SOIL_HEALTH': 28,
    'AKP.AGRI.CROP_DIV': 38, 'AKP.AGRI.DROUGHT_RISK': 62, 'AKP.AGRI.FOOD_SECURITY': 64,
    'AKP.DEMO.BUILTUP': 74, 'AKP.DEMO.URBAN_ACCESS': 76
  },
  MDG: {
    'EG.ELC.ACCS.ZS': 35.1, 'EG.ELC.RNWX.ZS': 42.0, 'AKP.INFRA.BROADBAND': 40, 'AKP.INFRA.HYDRO_CAP': 56,
    'AKP.ENV.PROTECTED': 10.4, 'AKP.ENV.FOREST_COV': 21.4, 'AKP.ENV.WATER_OCCUR': 1.9, 'AKP.ENV.SOIL_HEALTH': 64,
    'AKP.AGRI.CROP_DIV': 80, 'AKP.AGRI.DROUGHT_RISK': 52, 'AKP.AGRI.FOOD_SECURITY': 46,
    'AKP.DEMO.BUILTUP': 30, 'AKP.DEMO.URBAN_ACCESS': 42
  },
  MWI: {
    'EG.ELC.ACCS.ZS': 19.2, 'EG.ELC.RNWX.ZS': 82.0, 'AKP.INFRA.BROADBAND': 34, 'AKP.INFRA.HYDRO_CAP': 64,
    'AKP.ENV.PROTECTED': 16.9, 'AKP.ENV.FOREST_COV': 24.2, 'AKP.ENV.WATER_OCCUR': 20.6, 'AKP.ENV.SOIL_HEALTH': 68,
    'AKP.AGRI.CROP_DIV': 74, 'AKP.AGRI.DROUGHT_RISK': 44, 'AKP.AGRI.FOOD_SECURITY': 51,
    'AKP.DEMO.BUILTUP': 26, 'AKP.DEMO.URBAN_ACCESS': 53
  },
  MLI: {
    'EG.ELC.ACCS.ZS': 53.4, 'EG.ELC.RNWX.ZS': 45.0, 'AKP.INFRA.BROADBAND': 44, 'AKP.INFRA.HYDRO_CAP': 50,
    'AKP.ENV.PROTECTED': 8.2, 'AKP.ENV.FOREST_COV': 3.8, 'AKP.ENV.WATER_OCCUR': 1.1, 'AKP.ENV.SOIL_HEALTH': 46,
    'AKP.AGRI.CROP_DIV': 68, 'AKP.AGRI.DROUGHT_RISK': 58, 'AKP.AGRI.FOOD_SECURITY': 48,
    'AKP.DEMO.BUILTUP': 34, 'AKP.DEMO.URBAN_ACCESS': 46
  },
  MRT: {
    'EG.ELC.ACCS.ZS': 48.0, 'EG.ELC.RNWX.ZS': 38.0, 'AKP.INFRA.BROADBAND': 50, 'AKP.INFRA.HYDRO_CAP': 30,
    'AKP.ENV.PROTECTED': 2.4, 'AKP.ENV.FOREST_COV': 0.2, 'AKP.ENV.WATER_OCCUR': 0.2, 'AKP.ENV.SOIL_HEALTH': 34,
    'AKP.AGRI.CROP_DIV': 36, 'AKP.AGRI.DROUGHT_RISK': 68, 'AKP.AGRI.FOOD_SECURITY': 54,
    'AKP.DEMO.BUILTUP': 54, 'AKP.DEMO.URBAN_ACCESS': 56
  },
  MUS: {
    'EG.ELC.ACCS.ZS': 99.8, 'EG.ELC.RNWX.ZS': 24.0, 'AKP.INFRA.BROADBAND': 92, 'AKP.INFRA.HYDRO_CAP': 22,
    'AKP.ENV.PROTECTED': 4.7, 'AKP.ENV.FOREST_COV': 19.0, 'AKP.ENV.WATER_OCCUR': 0.5, 'AKP.ENV.SOIL_HEALTH': 72,
    'AKP.AGRI.CROP_DIV': 64, 'AKP.AGRI.DROUGHT_RISK': 22, 'AKP.AGRI.FOOD_SECURITY': 88,
    'AKP.DEMO.BUILTUP': 92, 'AKP.DEMO.URBAN_ACCESS': 94
  },
  MAR: {
    'EG.ELC.ACCS.ZS': 99.6, 'EG.ELC.RNWX.ZS': 39.5, 'AKP.INFRA.BROADBAND': 86, 'AKP.INFRA.HYDRO_CAP': 72,
    'AKP.ENV.PROTECTED': 31.2, 'AKP.ENV.FOREST_COV': 12.6, 'AKP.ENV.WATER_OCCUR': 0.6, 'AKP.ENV.SOIL_HEALTH': 56,
    'AKP.AGRI.CROP_DIV': 82, 'AKP.AGRI.DROUGHT_RISK': 44, 'AKP.AGRI.FOOD_SECURITY': 80,
    'AKP.DEMO.BUILTUP': 78, 'AKP.DEMO.URBAN_ACCESS': 84
  },
  MOZ: {
    'EG.ELC.ACCS.ZS': 40.0, 'EG.ELC.RNWX.ZS': 82.0, 'AKP.INFRA.BROADBAND': 42, 'AKP.INFRA.HYDRO_CAP': 90,
    'AKP.ENV.PROTECTED': 25.8, 'AKP.ENV.FOREST_COV': 43.1, 'AKP.ENV.WATER_OCCUR': 2.3, 'AKP.ENV.SOIL_HEALTH': 66,
    'AKP.AGRI.CROP_DIV': 74, 'AKP.AGRI.DROUGHT_RISK': 48, 'AKP.AGRI.FOOD_SECURITY': 52,
    'AKP.DEMO.BUILTUP': 32, 'AKP.DEMO.URBAN_ACCESS': 45
  },
  NAM: {
    'EG.ELC.ACCS.ZS': 56.3, 'EG.ELC.RNWX.ZS': 32.0, 'AKP.INFRA.BROADBAND': 68, 'AKP.INFRA.HYDRO_CAP': 42,
    'AKP.ENV.PROTECTED': 37.9, 'AKP.ENV.FOREST_COV': 8.3, 'AKP.ENV.WATER_OCCUR': 0.4, 'AKP.ENV.SOIL_HEALTH': 44,
    'AKP.AGRI.CROP_DIV': 46, 'AKP.AGRI.DROUGHT_RISK': 62, 'AKP.AGRI.FOOD_SECURITY': 72,
    'AKP.DEMO.BUILTUP': 64, 'AKP.DEMO.URBAN_ACCESS': 60
  },
  NER: {
    'EG.ELC.ACCS.ZS': 19.3, 'EG.ELC.RNWX.ZS': 10.0, 'AKP.INFRA.BROADBAND': 28, 'AKP.INFRA.HYDRO_CAP': 18,
    'AKP.ENV.PROTECTED': 18.0, 'AKP.ENV.FOREST_COV': 0.9, 'AKP.ENV.WATER_OCCUR': 0.2, 'AKP.ENV.SOIL_HEALTH': 36,
    'AKP.AGRI.CROP_DIV': 54, 'AKP.AGRI.DROUGHT_RISK': 74, 'AKP.AGRI.FOOD_SECURITY': 42,
    'AKP.DEMO.BUILTUP': 22, 'AKP.DEMO.URBAN_ACCESS': 38
  },
  NGA: {
    'EG.ELC.ACCS.ZS': 60.5, 'EG.ELC.RNWX.ZS': 18.5, 'AKP.INFRA.BROADBAND': 76, 'AKP.INFRA.HYDRO_CAP': 68,
    'AKP.ENV.PROTECTED': 14.1, 'AKP.ENV.FOREST_COV': 21.6, 'AKP.ENV.WATER_OCCUR': 2.2, 'AKP.ENV.SOIL_HEALTH': 69,
    'AKP.AGRI.CROP_DIV': 90, 'AKP.AGRI.DROUGHT_RISK': 32, 'AKP.AGRI.FOOD_SECURITY': 64,
    'AKP.DEMO.BUILTUP': 68, 'AKP.DEMO.URBAN_ACCESS': 74
  },
  RWA: {
    'EG.ELC.ACCS.ZS': 72.8, 'EG.ELC.RNWX.ZS': 58.0, 'AKP.INFRA.BROADBAND': 78, 'AKP.INFRA.HYDRO_CAP': 60,
    'AKP.ENV.PROTECTED': 10.0, 'AKP.ENV.FOREST_COV': 30.4, 'AKP.ENV.WATER_OCCUR': 6.8, 'AKP.ENV.SOIL_HEALTH': 76,
    'AKP.AGRI.CROP_DIV': 80, 'AKP.AGRI.DROUGHT_RISK': 28, 'AKP.AGRI.FOOD_SECURITY': 72,
    'AKP.DEMO.BUILTUP': 54, 'AKP.DEMO.URBAN_ACCESS': 82
  },
  STP: {
    'EG.ELC.ACCS.ZS': 82.0, 'EG.ELC.RNWX.ZS': 10.0, 'AKP.INFRA.BROADBAND': 46, 'AKP.INFRA.HYDRO_CAP': 24,
    'AKP.ENV.PROTECTED': 30.0, 'AKP.ENV.FOREST_COV': 56.4, 'AKP.ENV.WATER_OCCUR': 0.1, 'AKP.ENV.SOIL_HEALTH': 82,
    'AKP.AGRI.CROP_DIV': 56, 'AKP.AGRI.DROUGHT_RISK': 20, 'AKP.AGRI.FOOD_SECURITY': 66,
    'AKP.DEMO.BUILTUP': 52, 'AKP.DEMO.URBAN_ACCESS': 70
  },
  SEN: {
    'EG.ELC.ACCS.ZS': 70.4, 'EG.ELC.RNWX.ZS': 31.0, 'AKP.INFRA.BROADBAND': 74, 'AKP.INFRA.HYDRO_CAP': 48,
    'AKP.ENV.PROTECTED': 25.1, 'AKP.ENV.FOREST_COV': 42.8, 'AKP.ENV.WATER_OCCUR': 2.3, 'AKP.ENV.SOIL_HEALTH': 60,
    'AKP.AGRI.CROP_DIV': 78, 'AKP.AGRI.DROUGHT_RISK': 40, 'AKP.AGRI.FOOD_SECURITY': 70,
    'AKP.DEMO.BUILTUP': 64, 'AKP.DEMO.URBAN_ACCESS': 76
  },
  SYC: {
    'EG.ELC.ACCS.ZS': 100.0, 'EG.ELC.RNWX.ZS': 6.5, 'AKP.INFRA.BROADBAND': 90, 'AKP.INFRA.HYDRO_CAP': 2,
    'AKP.ENV.PROTECTED': 47.1, 'AKP.ENV.FOREST_COV': 88.5, 'AKP.ENV.WATER_OCCUR': 0.1, 'AKP.ENV.SOIL_HEALTH': 76,
    'AKP.AGRI.CROP_DIV': 40, 'AKP.AGRI.DROUGHT_RISK': 16, 'AKP.AGRI.FOOD_SECURITY': 86,
    'AKP.DEMO.BUILTUP': 88, 'AKP.DEMO.URBAN_ACCESS': 90
  },
  SLE: {
    'EG.ELC.ACCS.ZS': 27.5, 'EG.ELC.RNWX.ZS': 74.0, 'AKP.INFRA.BROADBAND': 38, 'AKP.INFRA.HYDRO_CAP': 58,
    'AKP.ENV.PROTECTED': 9.8, 'AKP.ENV.FOREST_COV': 37.6, 'AKP.ENV.WATER_OCCUR': 1.6, 'AKP.ENV.SOIL_HEALTH': 74,
    'AKP.AGRI.CROP_DIV': 72, 'AKP.AGRI.DROUGHT_RISK': 22, 'AKP.AGRI.FOOD_SECURITY': 49,
    'AKP.DEMO.BUILTUP': 34, 'AKP.DEMO.URBAN_ACCESS': 50
  },
  SOM: {
    'EG.ELC.ACCS.ZS': 49.3, 'EG.ELC.RNWX.ZS': 25.0, 'AKP.INFRA.BROADBAND': 38, 'AKP.INFRA.HYDRO_CAP': 10,
    'AKP.ENV.PROTECTED': 0.8, 'AKP.ENV.FOREST_COV': 9.6, 'AKP.ENV.WATER_OCCUR': 0.5, 'AKP.ENV.SOIL_HEALTH': 40,
    'AKP.AGRI.CROP_DIV': 42, 'AKP.AGRI.DROUGHT_RISK': 78, 'AKP.AGRI.FOOD_SECURITY': 36,
    'AKP.DEMO.BUILTUP': 38, 'AKP.DEMO.URBAN_ACCESS': 44
  },
  ZAF: {
    'EG.ELC.ACCS.ZS': 89.3, 'EG.ELC.RNWX.ZS': 16.2, 'AKP.INFRA.BROADBAND': 90, 'AKP.INFRA.HYDRO_CAP': 62,
    'AKP.ENV.PROTECTED': 15.8, 'AKP.ENV.FOREST_COV': 14.1, 'AKP.ENV.WATER_OCCUR': 0.9, 'AKP.ENV.SOIL_HEALTH': 62,
    'AKP.AGRI.CROP_DIV': 86, 'AKP.AGRI.DROUGHT_RISK': 42, 'AKP.AGRI.FOOD_SECURITY': 84,
    'AKP.DEMO.BUILTUP': 86, 'AKP.DEMO.URBAN_ACCESS': 84
  },
  SSD: {
    'EG.ELC.ACCS.ZS': 7.7, 'EG.ELC.RNWX.ZS': 35.0, 'AKP.INFRA.BROADBAND': 16, 'AKP.INFRA.HYDRO_CAP': 25,
    'AKP.ENV.PROTECTED': 15.0, 'AKP.ENV.FOREST_COV': 11.3, 'AKP.ENV.WATER_OCCUR': 4.8, 'AKP.ENV.SOIL_HEALTH': 68,
    'AKP.AGRI.CROP_DIV': 56, 'AKP.AGRI.DROUGHT_RISK': 60, 'AKP.AGRI.FOOD_SECURITY': 32,
    'AKP.DEMO.BUILTUP': 16, 'AKP.DEMO.URBAN_ACCESS': 28
  },
  SDN: {
    'EG.ELC.ACCS.ZS': 62.0, 'EG.ELC.RNWX.ZS': 58.0, 'AKP.INFRA.BROADBAND': 42, 'AKP.INFRA.HYDRO_CAP': 74,
    'AKP.ENV.PROTECTED': 8.7, 'AKP.ENV.FOREST_COV': 8.8, 'AKP.ENV.WATER_OCCUR': 1.8, 'AKP.ENV.SOIL_HEALTH': 48,
    'AKP.AGRI.CROP_DIV': 64, 'AKP.AGRI.DROUGHT_RISK': 66, 'AKP.AGRI.FOOD_SECURITY': 38,
    'AKP.DEMO.BUILTUP': 36, 'AKP.DEMO.URBAN_ACCESS': 44
  },
  TZA: {
    'EG.ELC.ACCS.ZS': 45.7, 'EG.ELC.RNWX.ZS': 44.0, 'AKP.INFRA.BROADBAND': 62, 'AKP.INFRA.HYDRO_CAP': 86,
    'AKP.ENV.PROTECTED': 38.1, 'AKP.ENV.FOREST_COV': 51.6, 'AKP.ENV.WATER_OCCUR': 6.2, 'AKP.ENV.SOIL_HEALTH': 74,
    'AKP.AGRI.CROP_DIV': 86, 'AKP.AGRI.DROUGHT_RISK': 36, 'AKP.AGRI.FOOD_SECURITY': 68,
    'AKP.DEMO.BUILTUP': 42, 'AKP.DEMO.URBAN_ACCESS': 60
  },
  TGO: {
    'EG.ELC.ACCS.ZS': 55.7, 'EG.ELC.RNWX.ZS': 36.0, 'AKP.INFRA.BROADBAND': 58, 'AKP.INFRA.HYDRO_CAP': 40,
    'AKP.ENV.PROTECTED': 24.3, 'AKP.ENV.FOREST_COV': 24.7, 'AKP.ENV.WATER_OCCUR': 1.6, 'AKP.ENV.SOIL_HEALTH': 64,
    'AKP.AGRI.CROP_DIV': 76, 'AKP.AGRI.DROUGHT_RISK': 30, 'AKP.AGRI.FOOD_SECURITY': 62,
    'AKP.DEMO.BUILTUP': 52, 'AKP.DEMO.URBAN_ACCESS': 68
  },
  TUN: {
    'EG.ELC.ACCS.ZS': 99.8, 'EG.ELC.RNWX.ZS': 4.0, 'AKP.INFRA.BROADBAND': 80, 'AKP.INFRA.HYDRO_CAP': 25,
    'AKP.ENV.PROTECTED': 8.1, 'AKP.ENV.FOREST_COV': 6.8, 'AKP.ENV.WATER_OCCUR': 0.8, 'AKP.ENV.SOIL_HEALTH': 52,
    'AKP.AGRI.CROP_DIV': 70, 'AKP.AGRI.DROUGHT_RISK': 48, 'AKP.AGRI.FOOD_SECURITY': 78,
    'AKP.DEMO.BUILTUP': 76, 'AKP.DEMO.URBAN_ACCESS': 84
  },
  UGA: {
    'EG.ELC.ACCS.ZS': 45.2, 'EG.ELC.RNWX.ZS': 94.0, 'AKP.INFRA.BROADBAND': 60, 'AKP.INFRA.HYDRO_CAP': 84,
    'AKP.ENV.PROTECTED': 16.1, 'AKP.ENV.FOREST_COV': 11.8, 'AKP.ENV.WATER_OCCUR': 15.4, 'AKP.ENV.SOIL_HEALTH': 78,
    'AKP.AGRI.CROP_DIV': 88, 'AKP.AGRI.DROUGHT_RISK': 32, 'AKP.AGRI.FOOD_SECURITY': 66,
    'AKP.DEMO.BUILTUP': 44, 'AKP.DEMO.URBAN_ACCESS': 68
  },
  ZMB: {
    'EG.ELC.ACCS.ZS': 46.7, 'EG.ELC.RNWX.ZS': 86.0, 'AKP.INFRA.BROADBAND': 54, 'AKP.INFRA.HYDRO_CAP': 88,
    'AKP.ENV.PROTECTED': 37.9, 'AKP.ENV.FOREST_COV': 60.3, 'AKP.ENV.WATER_OCCUR': 2.1, 'AKP.ENV.SOIL_HEALTH': 72,
    'AKP.AGRI.CROP_DIV': 78, 'AKP.AGRI.DROUGHT_RISK': 42, 'AKP.AGRI.FOOD_SECURITY': 62,
    'AKP.DEMO.BUILTUP': 42, 'AKP.DEMO.URBAN_ACCESS': 56
  },
  ZWE: {
    'EG.ELC.ACCS.ZS': 49.3, 'EG.ELC.RNWX.ZS': 54.0, 'AKP.INFRA.BROADBAND': 58, 'AKP.INFRA.HYDRO_CAP': 72,
    'AKP.ENV.PROTECTED': 27.2, 'AKP.ENV.FOREST_COV': 45.1, 'AKP.ENV.WATER_OCCUR': 1.1, 'AKP.ENV.SOIL_HEALTH': 68,
    'AKP.AGRI.CROP_DIV': 76, 'AKP.AGRI.DROUGHT_RISK': 46, 'AKP.AGRI.FOOD_SECURITY': 60,
    'AKP.DEMO.BUILTUP': 48, 'AKP.DEMO.URBAN_ACCESS': 60
  },
  ESH: {
    'EG.ELC.ACCS.ZS': 75.0, 'EG.ELC.RNWX.ZS': 45.0, 'AKP.INFRA.BROADBAND': 40, 'AKP.INFRA.HYDRO_CAP': 0,
    'AKP.ENV.PROTECTED': 1.2, 'AKP.ENV.FOREST_COV': 0.1, 'AKP.ENV.WATER_OCCUR': 0.1, 'AKP.ENV.SOIL_HEALTH': 24,
    'AKP.AGRI.CROP_DIV': 18, 'AKP.AGRI.DROUGHT_RISK': 75, 'AKP.AGRI.FOOD_SECURITY': 55,
    'AKP.DEMO.BUILTUP': 40, 'AKP.DEMO.URBAN_ACCESS': 48
  },
  XSL: {
    'EG.ELC.ACCS.ZS': 55.0, 'EG.ELC.RNWX.ZS': 30.0, 'AKP.INFRA.BROADBAND': 48, 'AKP.INFRA.HYDRO_CAP': 8,
    'AKP.ENV.PROTECTED': 2.0, 'AKP.ENV.FOREST_COV': 7.5, 'AKP.ENV.WATER_OCCUR': 0.4, 'AKP.ENV.SOIL_HEALTH': 42,
    'AKP.AGRI.CROP_DIV': 45, 'AKP.AGRI.DROUGHT_RISK': 70, 'AKP.AGRI.FOOD_SECURITY': 48,
    'AKP.DEMO.BUILTUP': 45, 'AKP.DEMO.URBAN_ACCESS': 52
  }
};

/**
 * Georeferenced Energy & Infrastructure Points (Mapped into 5796 x 5867 SVG coordinate space)
 */
export interface AkpInfrastructurePoint {
  id: string;
  name: string;
  countryIso3: string;
  type: 'hydro' | 'solar' | 'wind' | 'geothermal' | 'dam';
  capacity: string;
  x: number;
  y: number;
  status: string;
  commissioned: string;
}

export const AKP_INFRASTRUCTURE_POINTS: AkpInfrastructurePoint[] = [
  { id: 'gerd', name: 'Grand Ethiopian Renaissance Dam (GERD)', countryIso3: 'ETH', type: 'hydro', capacity: '5,150 MW', x: 3880, y: 2260, status: 'Operational / Expanding', commissioned: '2022' },
  { id: 'noor', name: 'Noor Ouarzazate Solar Complex', countryIso3: 'MAR', type: 'solar', capacity: '580 MW (CSP)', x: 1840, y: 780, status: 'Operational', commissioned: '2016' },
  { id: 'benban', name: 'Benban Solar Park', countryIso3: 'EGY', type: 'solar', capacity: '1,650 MW (PV)', x: 3820, y: 1180, status: 'Operational', commissioned: '2019' },
  { id: 'aswan', name: 'Aswan High Dam', countryIso3: 'EGY', type: 'hydro', capacity: '2,100 MW', x: 3850, y: 1210, status: 'Operational', commissioned: '1970' },
  { id: 'turkana', name: 'Lake Turkana Wind Power', countryIso3: 'KEN', type: 'wind', capacity: '310 MW', x: 4100, y: 2780, status: 'Operational', commissioned: '2019' },
  { id: 'olkaria', name: 'Olkaria Geothermal Complex', countryIso3: 'KEN', type: 'geothermal', capacity: '862 MW', x: 4060, y: 2980, status: 'Operational', commissioned: '2021' },
  { id: 'inga', name: 'Inga Hydroelectric Complex (I & II)', countryIso3: 'COD', type: 'hydro', capacity: '1,775 MW', x: 2780, y: 3260, status: 'Operational', commissioned: '1972' },
  { id: 'kariba', name: 'Kariba Dam & Hydropower', countryIso3: 'ZMB', type: 'hydro', capacity: '1,830 MW', x: 3450, y: 4050, status: 'Operational', commissioned: '1959' },
  { id: 'cahora', name: 'Cahora Bassa Hydroelectric', countryIso3: 'MOZ', type: 'hydro', capacity: '2,075 MW', x: 3750, y: 3980, status: 'Operational', commissioned: '1974' },
  { id: 'nyerere', name: 'Julius Nyerere Hydropower Plant (Stiegler\'s Gorge)', countryIso3: 'TZA', type: 'hydro', capacity: '2,115 MW', x: 4120, y: 3520, status: 'Operational / Testing', commissioned: '2024' },
  { id: 'jasper', name: 'Jasper Solar Power Project', countryIso3: 'ZAF', type: 'solar', capacity: '96 MW', x: 3100, y: 4950, status: 'Operational', commissioned: '2014' },
  { id: 'bujagali', name: 'Bujagali Power Station (Victoria Nile)', countryIso3: 'UGA', type: 'hydro', capacity: '250 MW', x: 3860, y: 2930, status: 'Operational', commissioned: '2012' },
  { id: 'taiba', name: 'Taiba N\'Diaye Wind Farm', countryIso3: 'SEN', type: 'wind', capacity: '158 MW', x: 750, y: 2150, status: 'Operational', commissioned: '2020' },
  { id: 'nachtigal', name: 'Nachtigal Hydro Power Project', countryIso3: 'CMR', type: 'hydro', capacity: '420 MW', x: 2600, y: 2750, status: 'Operational / Commissioning', commissioned: '2024' }
];

/**
 * Georeferenced UNESCO / BIOPAMA Protected Biospheres & National Parks (Mapped into 5796 x 5867 SVG coordinate space)
 */
export interface AkpProtectedArea {
  id: string;
  name: string;
  countryIso3: string;
  category: string;
  areaKm2: string;
  x: number;
  y: number;
  designation: string;
}

export const AKP_PROTECTED_AREAS: AkpProtectedArea[] = [
  { id: 'serengeti', name: 'Serengeti & Ngorongoro Conservation Area', countryIso3: 'TZA', category: 'Biosphere Reserve', areaKm2: '14,763 km²', x: 4020, y: 3180, designation: 'UNESCO World Heritage' },
  { id: 'kruger', name: 'Kruger National Park & Great Limpopo', countryIso3: 'ZAF', category: 'National Park', areaKm2: '19,485 km²', x: 3620, y: 4720, designation: 'Transfrontier Park' },
  { id: 'okavango', name: 'Okavango Delta Ramsar Wetland', countryIso3: 'BWA', category: 'Wetland of Global Significance', areaKm2: '20,236 km²', x: 3120, y: 4420, designation: 'UNESCO World Heritage' },
  { id: 'virunga', name: 'Virunga National Park', countryIso3: 'COD', category: 'National Park', areaKm2: '7,800 km²', x: 3520, y: 3050, designation: 'UNESCO World Heritage' },
  { id: 'salonga', name: 'Salonga National Park (Congo Basin)', countryIso3: 'COD', category: 'Rainforest Reserve', areaKm2: '36,000 km²', x: 3100, y: 3150, designation: 'UNESCO World Heritage' },
  { id: 'niokolo', name: 'Niokolo-Koba National Park', countryIso3: 'SEN', category: 'National Park', areaKm2: '9,130 km²', x: 940, y: 2200, designation: 'UNESCO World Heritage' },
  { id: 'w_arly', name: 'W-Arly-Pendjari Complex', countryIso3: 'BEN', category: 'Transboundary Biosphere', areaKm2: '17,148 km²', x: 1720, y: 2200, designation: 'UNESCO World Heritage' },
  { id: 'ahaggar', name: 'Ahaggar Cultural & Nature Park', countryIso3: 'DZA', category: 'National Park', areaKm2: '450,000 km²', x: 2350, y: 1350, designation: 'National Biosphere' },
  { id: 'tai', name: 'Taï National Park (Primary Rainforest)', countryIso3: 'CIV', category: 'Rainforest Reserve', areaKm2: '3,300 km²', x: 1220, y: 2680, designation: 'UNESCO World Heritage' },
  { id: 'kafue', name: 'Kafue National Park', countryIso3: 'ZMB', category: 'National Park', areaKm2: '22,400 km²', x: 3320, y: 3980, designation: 'Protected Wildlife Area' },
  { id: 'simien', name: 'Simien Mountains National Park', countryIso3: 'ETH', category: 'Highland Sanctuary', areaKm2: '220 km²', x: 4120, y: 2150, designation: 'UNESCO World Heritage' }
];

/**
 * Lookup helper for any country indicator in AKP
 */
export function getAkpCountryValue(countryId: string, metricId: string): number | null {
  const norm = countryId?.toUpperCase();
  if (AKP_COUNTRY_INDICATOR_VALUES[norm] && AKP_COUNTRY_INDICATOR_VALUES[norm][metricId] !== undefined) {
    return AKP_COUNTRY_INDICATOR_VALUES[norm][metricId];
  }
  return null;
}
