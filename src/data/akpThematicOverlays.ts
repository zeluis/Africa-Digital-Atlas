/**
 * akpThematicOverlays.ts - Cartographic Geospatial Layer Overlays & Color Scales
 * Mapped in exact native 5796 x 5867 SVG coordinate space of africa-final.svg.
 * Provides Trade Corridors, Ecological Biomes/Basins, Demographic Nodes, and Metric Choropleth Ramps.
 */
import { createLazyAssetStore } from '../utils/lazyDataLoader';
import type { AkpCategory } from './akpDatasets';

export interface ThematicPath {
  id: string;
  name: string;
  category: AkpCategory;
  d: string; // SVG path data in 5796x5867 space
  color: string;
  strokeWidth: number;
  speedSec: number;
  dashArray?: string;
  description: string;
  stats: { label: string; value: string }[];
  source: string;
}

export interface ThematicPulseNode {
  id: string;
  name: string;
  category: AkpCategory;
  x: number;
  y: number;
  color: string;
  pulseColor: string;
  radius: number;
  label: string;
  subtitle: string;
  type: string;
  badge: string;
  labelOffset?: { x: number; y: number };
  stats: { label: string; value: string }[];
  description: string;
  source: string;
}

export interface ThematicAreaAura {
  id: string;
  name: string;
  category: AkpCategory;
  d: string;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  description: string;
  stats: { label: string; value: string }[];
  source: string;
}

const akpThematicOverlaysUrl = new URL('./akpThematicOverlays.json', import.meta.url).href;

export const THEMATIC_CORRIDORS: ThematicPath[] = [];
export const THEMATIC_AURAS: ThematicAreaAura[] = [];
export const THEMATIC_PULSE_NODES: ThematicPulseNode[] = [];

const akpThematicOverlaysStore = createLazyAssetStore<{
  thematicCorridors: ThematicPath[];
  thematicAuras: ThematicAreaAura[];
  thematicPulseNodes: ThematicPulseNode[];
}>(
  [akpThematicOverlaysUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      if (Array.isArray(payload.thematicCorridors) && THEMATIC_CORRIDORS.length === 0) {
        THEMATIC_CORRIDORS.push(...payload.thematicCorridors);
      }
      if (Array.isArray(payload.thematicAuras) && THEMATIC_AURAS.length === 0) {
        THEMATIC_AURAS.push(...payload.thematicAuras);
      }
      if (Array.isArray(payload.thematicPulseNodes) && THEMATIC_PULSE_NODES.length === 0) {
        THEMATIC_PULSE_NODES.push(...payload.thematicPulseNodes);
      }
    }
    return {
      thematicCorridors: THEMATIC_CORRIDORS,
      thematicAuras: THEMATIC_AURAS,
      thematicPulseNodes: THEMATIC_PULSE_NODES,
    };
  },
  () => ({
    thematicCorridors: THEMATIC_CORRIDORS,
    thematicAuras: THEMATIC_AURAS,
    thematicPulseNodes: THEMATIC_PULSE_NODES,
  })
);

export const ensureAkpThematicOverlaysLoaded = akpThematicOverlaysStore.ensureLoaded;
export const isAkpThematicOverlaysLoaded = akpThematicOverlaysStore.isLoaded;
export const subscribeAkpThematicOverlays = akpThematicOverlaysStore.subscribe;
export const useAkpThematicOverlaysLoaded = akpThematicOverlaysStore.useLoaded;

/**
 * Enhanced Indicator Color Ramp Definitions with High Contrast and High Opacity Tints
 */
export interface MetricColorPalette {
  metricId: string;
  name: string;
  category: string;
  stops: [string, string, string, string]; // min, low-mid, high-mid, max
  unit: string;
  opacity: number;
}

export const METRIC_COLOR_PALETTES: Record<string, MetricColorPalette> = {
  // 1. Economic & Governance
  'NY.GDP.MKTP.CD': {
    metricId: 'NY.GDP.MKTP.CD',
    name: 'Nominal GDP',
    category: 'economic',
    stops: ['#082f49', '#0284c7', '#06b6d4', '#38bdf8'],
    unit: 'USD Billion',
    opacity: 0.94
  },
  'NY.GDP.PCAP.CD': {
    metricId: 'NY.GDP.PCAP.CD',
    name: 'GDP per Capita',
    category: 'economic',
    stops: ['#1e1b4b', '#4f46e5', '#818cf8', '#c7d2fe'],
    unit: 'USD',
    opacity: 0.94
  },
  'COMTRADE.EXP.TOTL': {
    metricId: 'COMTRADE.EXP.TOTL',
    name: 'Total Exports',
    category: 'economic',
    stops: ['#083344', '#0891b2', '#22d3ee', '#67e8f9'],
    unit: 'USD Billion',
    opacity: 0.94
  },
  'MO.IIAG.SCORE': {
    metricId: 'MO.IIAG.SCORE',
    name: 'Ibrahim Governance (IIAG)',
    category: 'economic',
    stops: ['#2e1065', '#7e22ce', '#a855f7', '#d8b4fe'],
    unit: 'Score (0-100)',
    opacity: 0.95
  },
  'IEP.GPI.SCORE': {
    metricId: 'IEP.GPI.SCORE',
    name: 'Global Peace Index (GPI)',
    category: 'economic',
    stops: ['#064e3b', '#059669', '#f59e0b', '#dc2626'], // Inverted logic in color evaluation
    unit: 'Score (1-5)',
    opacity: 0.95
  },

  // 2. Energy & Infrastructure
  'EG.ELC.ACCS.ZS': {
    metricId: 'EG.ELC.ACCS.ZS',
    name: 'Electricity Access Rate',
    category: 'energy_infra',
    stops: ['#451a03', '#b45309', '#f59e0b', '#fde047'],
    unit: '% Population',
    opacity: 0.96
  },
  'EG.ELC.RNWX.ZS': {
    metricId: 'EG.ELC.RNWX.ZS',
    name: 'Renewable Energy Share',
    category: 'energy_infra',
    stops: ['#064e3b', '#059669', '#10b981', '#6ee7b7'],
    unit: '% Generation',
    opacity: 0.96
  },
  'AKP.INFRA.BROADBAND': {
    metricId: 'AKP.INFRA.BROADBAND',
    name: 'Broadband Backbone Connectivity',
    category: 'energy_infra',
    stops: ['#172554', '#2563eb', '#3b82f6', '#93c5fd'],
    unit: 'Index (0-100)',
    opacity: 0.95
  },
  'AKP.INFRA.HYDRO_CAP': {
    metricId: 'AKP.INFRA.HYDRO_CAP',
    name: 'Hydropower Potential & Reservoir Storage',
    category: 'energy_infra',
    stops: ['#042f2e', '#0f766e', '#14b8a6', '#5eead4'],
    unit: 'Index (0-100)',
    opacity: 0.95
  },

  // 3. Environment & Biodiversity
  'AKP.ENV.PROTECTED': {
    metricId: 'AKP.ENV.PROTECTED',
    name: 'Protected Areas Coverage',
    category: 'environment',
    stops: ['#052e16', '#166534', '#16a34a', '#86efac'],
    unit: '% Land Area',
    opacity: 0.96
  },
  'AKP.ENV.FOREST_COV': {
    metricId: 'AKP.ENV.FOREST_COV',
    name: 'Forest Canopy & Tree Cover',
    category: 'environment',
    stops: ['#022c22', '#047857', '#10b981', '#a7f3d0'],
    unit: '% Total Land',
    opacity: 0.96
  },
  'AKP.ENV.WATER_OCCUR': {
    metricId: 'AKP.ENV.WATER_OCCUR',
    name: 'Surface Water Occurrence',
    category: 'environment',
    stops: ['#082f49', '#0284c7', '#06b6d4', '#7dd3fc'],
    unit: '% Territory',
    opacity: 0.95
  },
  'AKP.ENV.SOIL_HEALTH': {
    metricId: 'AKP.ENV.SOIL_HEALTH',
    name: 'Soil Organic Carbon Index',
    category: 'environment',
    stops: ['#3b1805', '#92400e', '#d97706', '#fcd34d'],
    unit: 'Index (0-100)',
    opacity: 0.95
  },

  // 4. Agriculture & Food
  'AKP.AGRI.CROP_DIV': {
    metricId: 'AKP.AGRI.CROP_DIV',
    name: 'Crop Diversity & Resilience Score',
    category: 'agriculture',
    stops: ['#1a2e05', '#4d7c0f', '#84cc16', '#bef264'],
    unit: 'Index (0-100)',
    opacity: 0.95
  },
  'AKP.AGRI.DROUGHT_RISK': {
    metricId: 'AKP.AGRI.DROUGHT_RISK',
    name: 'Agricultural Drought Stress (ASIS)',
    category: 'agriculture',
    stops: ['#065f46', '#eab308', '#ea580c', '#b91c1c'],
    unit: 'Stress Index (0-100)',
    opacity: 0.95
  },
  'AKP.AGRI.FOOD_SECURITY': {
    metricId: 'AKP.AGRI.FOOD_SECURITY',
    name: 'Food System Resilience Index',
    category: 'agriculture',
    stops: ['#450a0a', '#b91c1c', '#16a34a', '#4ade80'],
    unit: 'Score (0-100)',
    opacity: 0.95
  },

  // 5. Demographics & Cities
  'SP.POP.TOTL': {
    metricId: 'SP.POP.TOTL',
    name: 'Total Population',
    category: 'demographics',
    stops: ['#022c22', '#0f766e', '#10b981', '#6ee7b7'],
    unit: 'People (Million)',
    opacity: 0.95
  },
  'UNDP.HDI.INDEX': {
    metricId: 'UNDP.HDI.INDEX',
    name: 'Human Development Index (HDI)',
    category: 'demographics',
    stops: ['#1e1b4b', '#4338ca', '#6366f1', '#a5b4fc'],
    unit: 'Index (0-1)',
    opacity: 0.96
  },
  'SP.DYN.LE00.IN': {
    metricId: 'SP.DYN.LE00.IN',
    name: 'Life Expectancy at Birth',
    category: 'demographics',
    stops: ['#3f1200', '#c2410c', '#f97316', '#fed7aa'],
    unit: 'Years',
    opacity: 0.95
  },
  'AKP.DEMO.BUILTUP': {
    metricId: 'AKP.DEMO.BUILTUP',
    name: 'Urban Built-Up Surface Density',
    category: 'demographics',
    stops: ['#2e1065', '#6d28d9', '#8b5cf6', '#ddd6fe'],
    unit: 'm² / capita',
    opacity: 0.96
  },
  'AKP.DEMO.URBAN_ACCESS': {
    metricId: 'AKP.DEMO.URBAN_ACCESS',
    name: 'Travel Proximity to Major Cities',
    category: 'demographics',
    stops: ['#0c4a6e', '#0369a1', '#0ea5e9', '#bae6fd'],
    unit: 'Travel Score (0-100)',
    opacity: 0.95
  }
};

/**
 * Interpolate hex color through 4-stop ramp with exponential emphasis (gamma = 1.35)
 */
export function getMetricChoroplethColor(
  metricId: string,
  normalizedT: number, // 0 to 1
  reverseScale: boolean = false
): { color: string; opacity: number } {
  const palette = METRIC_COLOR_PALETTES[metricId] || METRIC_COLOR_PALETTES['NY.GDP.MKTP.CD'];
  let t = Math.max(0, Math.min(1, normalizedT));

  if (reverseScale) {
    t = 1 - t;
  }

  // Apply contrast gamma curve (t^1.35) so higher values pop with dramatic saturation
  const curvedT = Math.pow(t, 1.35);

  const stops = palette.stops;

  let startHex: string;
  let endHex: string;
  let segT: number;

  if (curvedT <= 0.33) {
    startHex = stops[0];
    endHex = stops[1];
    segT = curvedT / 0.33;
  } else if (curvedT <= 0.66) {
    startHex = stops[1];
    endHex = stops[2];
    segT = (curvedT - 0.33) / 0.33;
  } else {
    startHex = stops[2];
    endHex = stops[3];
    segT = (curvedT - 0.66) / 0.34;
  }

  const c1 = hexToRgb(startHex);
  const c2 = hexToRgb(endHex);

  const r = Math.round(c1.r + (c2.r - c1.r) * segT);
  const g = Math.round(c1.g + (c2.g - c1.g) * segT);
  const b = Math.round(c1.b + (c2.b - c1.b) * segT);

  return {
    color: `rgb(${r}, ${g}, ${b})`,
    opacity: palette.opacity
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}
