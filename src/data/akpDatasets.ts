/**
 * akpDatasets.ts - European Commission Africa Knowledge Platform (AKP / JRC)
 * Curated Continental Datasets, Indicators, Infrastructure & Conservation Points
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
  Radio,
  Clock,
  Layers
} from 'lucide-react';
import { createLazyAssetStore } from '../utils/lazyDataLoader';

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
  labelOffset?: { x: number; y: number };
}

export interface AkpProtectedArea {
  id: string;
  name: string;
  countryIso3: string;
  category: string;
  areaKm2: string;
  x: number;
  y: number;
  designation: string;
  labelOffset?: { x: number; y: number };
}

const akpDatasetsDataUrl = new URL('./akpDatasetsData.json', import.meta.url).href;

export const AKP_COUNTRY_INDICATOR_VALUES: Record<string, Record<string, number>> = {};
export const AKP_INFRASTRUCTURE_POINTS: AkpInfrastructurePoint[] = [];
export const AKP_PROTECTED_AREAS: AkpProtectedArea[] = [];

const akpDatasetsStore = createLazyAssetStore<{
  countryIndicatorValues: Record<string, Record<string, number>>;
  infrastructurePoints: AkpInfrastructurePoint[];
  protectedAreas: AkpProtectedArea[];
}>(
  [akpDatasetsDataUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      if (payload.countryIndicatorValues && typeof payload.countryIndicatorValues === 'object') {
        Object.assign(AKP_COUNTRY_INDICATOR_VALUES, payload.countryIndicatorValues);
      }
      if (Array.isArray(payload.infrastructurePoints) && AKP_INFRASTRUCTURE_POINTS.length === 0) {
        AKP_INFRASTRUCTURE_POINTS.push(...payload.infrastructurePoints);
      }
      if (Array.isArray(payload.protectedAreas) && AKP_PROTECTED_AREAS.length === 0) {
        AKP_PROTECTED_AREAS.push(...payload.protectedAreas);
      }
    }
    return {
      countryIndicatorValues: AKP_COUNTRY_INDICATOR_VALUES,
      infrastructurePoints: AKP_INFRASTRUCTURE_POINTS,
      protectedAreas: AKP_PROTECTED_AREAS,
    };
  },
  () => ({
    countryIndicatorValues: AKP_COUNTRY_INDICATOR_VALUES,
    infrastructurePoints: AKP_INFRASTRUCTURE_POINTS,
    protectedAreas: AKP_PROTECTED_AREAS,
  })
);

export const ensureAkpDatasetsLoaded = akpDatasetsStore.ensureLoaded;
export const isAkpDatasetsLoaded = akpDatasetsStore.isLoaded;
export const subscribeAkpDatasets = akpDatasetsStore.subscribe;
export const useAkpDatasetsLoaded = akpDatasetsStore.useLoaded;

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
