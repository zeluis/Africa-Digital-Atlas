/**
 * svgMaps.ts - Accurate Geographic SVG Map Paths for Africa
 * Aligned to the United Nations Geoscheme for Africa (M49 standard)
 * 54 Sovereign African States + Western Sahara mapped dynamically to the authoritative vector model.
 */

import { AFRICA_FINAL_MAP, AfricaFinalCountryPath } from './africaFinalGeometry';
import { atlas } from './atlas-store';

export interface CountrySvgPath {
  id: string; // ISO3
  name: string;
  iso2: string;
  unRegion: 'Northern Africa' | 'Western Africa' | 'Central Africa' | 'Eastern Africa' | 'Southern Africa';
  path: string;
  islands?: string[];
  centroid: { x: number; y: number };
  capital: { name: string; x: number; y: number };
  labelPos: { x: number; y: number };
  boundingBox: { minX: number; minY: number; maxX: number; maxY: number };
}

export const AFRICA_REGIONS_VIEWBOX = "-240 0 6036 5867";

export interface BackgroundSurroundingPath {
  name: string;
  d: string;
}

export interface BackgroundSurroundingCircle {
  name: string;
  cx: number;
  cy: number;
  r: number;
}

export const BACKGROUND_SURROUNDING_PATHS: BackgroundSurroundingPath[] = [];
export const BACKGROUND_SURROUNDING_CIRCLES: BackgroundSurroundingCircle[] = [];

export interface RegionStructureData {
  name?: string;
  region: 'Northern Africa' | 'Western Africa' | 'Central Africa' | 'Eastern Africa' | 'Southern Africa';
  countryIds: string[];
  labelX: number;
  labelY: number;
  islandCircles?: Array<{ cx: number; cy: number; r: number; name: string }>;
}

export const AFRICA_UN_REGIONS_STRUCTURED: Record<'Northern Africa' | 'Western Africa' | 'Central Africa' | 'Eastern Africa' | 'Southern Africa', RegionStructureData> = {
  "Northern Africa": {
    "region": "Northern Africa",
    "name": "Northern Africa",
    "countryIds": ["MAR", "ESH", "DZA", "TUN", "LBY", "EGY", "SDN"],
    "labelX": 2800,
    "labelY": 1200
  },
  "Western Africa": {
    "region": "Western Africa",
    "name": "Western Africa",
    "countryIds": [
      "MRT", "SEN", "GMB", "GNB", "GIN", "SLE", "LBR", "MLI", "CIV", "BFA",
      "GHA", "TGO", "BEN", "NER", "NGA", "CPV"
    ],
    "islandCircles": [
      { "cx": 100, "cy": 2500, "r": 25, "name": "Cabo Verde" }
    ],
    "labelX": 1600,
    "labelY": 2400
  },
  "Central Africa": {
    "region": "Central Africa",
    "name": "Central Africa",
    "countryIds": [
      "TCD", "CMR", "CAF", "GNQ", "GAB", "COG", "COD", "AGO", "STP"
    ],
    "islandCircles": [
      { "cx": 2200, "cy": 3300, "r": 20, "name": "São Tomé and Príncipe" }
    ],
    "labelX": 3000,
    "labelY": 3200
  },
  "Eastern Africa": {
    "region": "Eastern Africa",
    "name": "Eastern Africa",
    "countryIds": [
      "ERI", "DJI", "ETH", "SOM", "SSD", "UGA", "KEN", "RWA", "BDI", "TZA",
      "MWI", "ZMB", "MOZ", "ZWE", "MDG", "COM", "SYC", "MUS"
    ],
    "islandCircles": [
      { "cx": 4700, "cy": 3900, "r": 20, "name": "Comoros" },
      { "cx": 5500, "cy": 3300, "r": 20, "name": "Seychelles" },
      { "cx": 5700, "cy": 4500, "r": 20, "name": "Mauritius" }
    ],
    "labelX": 4300,
    "labelY": 3000
  },
  "Southern Africa": {
    "region": "Southern Africa",
    "name": "Southern Africa",
    "countryIds": [
      "NAM", "BWA", "ZAF", "LSO", "SWZ"
    ],
    "labelX": 3500,
    "labelY": 5100
  }
};

function buildCountrySvgPath(c: AfricaFinalCountryPath): CountrySvgPath {
  const entity = atlas.getEntity(c.id);
  const bbox = c.bbox || { minX: 0, minY: 0, maxX: 400, maxY: 400 };
  const w = (bbox.maxX || 400) - (bbox.minX || 0);
  const h = (bbox.maxY || 400) - (bbox.minY || 0);
  const path = c.admin1 && c.admin1.length > 0
    ? c.admin1.map(a => a.d).join(' ')
    : '';

  return {
    id: c.id,
    name: c.name || entity?.name || c.id,
    iso2: entity?.iso2 || c.id.slice(0, 2),
    unRegion: c.unRegion as any,
    path,
    islands: [],
    centroid: c.centroid || { x: (bbox.minX || 0) + w / 2, y: (bbox.minY || 0) + h / 2 },
    capital: {
      name: entity?.capital || '',
      x: c.centroid?.x || (bbox.minX || 0) + w / 2,
      y: c.centroid?.y || (bbox.minY || 0) + h / 2
    },
    labelPos: c.centroid || { x: (bbox.minX || 0) + w / 2, y: (bbox.minY || 0) + h / 2 },
    boundingBox: {
      minX: bbox.minX || 0,
      minY: bbox.minY || 0,
      maxX: bbox.maxX || 400,
      maxY: bbox.maxY || 400
    }
  };
}

export const AFRICA_SVG_MAP: Record<string, CountrySvgPath> = new Proxy({}, {
  get: (_target, prop: string) => {
    const c = AFRICA_FINAL_MAP[prop];
    if (!c) return undefined;
    return buildCountrySvgPath(c);
  },
  ownKeys: () => {
    return Object.keys(AFRICA_FINAL_MAP);
  },
  getOwnPropertyDescriptor: (_target, prop) => {
    if (typeof prop === 'string' && AFRICA_FINAL_MAP[prop]) {
      return {
        configurable: true,
        enumerable: true,
        value: buildCountrySvgPath(AFRICA_FINAL_MAP[prop])
      };
    }
    return undefined;
  }
});
