/**
 * svgMaps.ts - Accurate Geographic SVG Map Paths for Africa
 * Aligned to the United Nations Geoscheme for Africa (M49 standard)
 * 54 Sovereign African States + Western Sahara with Natural Earth 50m Geographic Boundaries
 */

import { createLazyAssetStore } from '../utils/lazyDataLoader';

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

export const AFRICA_REGIONS_VIEWBOX = "0 0 1000 1100";

export interface BackgroundSurroundingPath {
  d: string;
}

export interface BackgroundSurroundingCircle {
  cx: number;
  cy: number;
  r: number;
}

export interface RegionStructureData {
  name: 'Northern Africa' | 'Western Africa' | 'Central Africa' | 'Eastern Africa' | 'Southern Africa';
  countryIds: string[];
  islandCircles?: Array<{ cx: number; cy: number; r: number; name: string }>;
  labelX: number;
  labelY: number;
}

const africaSvgMapUrl = new URL('./africaSvgMap.json', import.meta.url).href;

// 1000x1100 Unified Continental Coordinate System for Africa (Natural Earth 50m / UN Geoscheme)
export const AFRICA_SVG_MAP: Record<string, CountrySvgPath> = {};

export const BACKGROUND_SURROUNDING_PATHS: BackgroundSurroundingPath[] = [];

export const BACKGROUND_SURROUNDING_CIRCLES: BackgroundSurroundingCircle[] = [];

export const AFRICA_UN_REGIONS_STRUCTURED: Record<
  'Northern Africa' | 'Western Africa' | 'Central Africa' | 'Eastern Africa' | 'Southern Africa',
  RegionStructureData
> = {
  'Northern Africa': { name: 'Northern Africa', countryIds: [], labelX: 470, labelY: 170 },
  'Western Africa': { name: 'Western Africa', countryIds: [], labelX: 250, labelY: 410 },
  'Central Africa': { name: 'Central Africa', countryIds: [], labelX: 490, labelY: 530 },
  'Eastern Africa': { name: 'Eastern Africa', countryIds: [], labelX: 740, labelY: 490 },
  'Southern Africa': { name: 'Southern Africa', countryIds: [], labelX: 520, labelY: 880 },
};

const africaSvgMapStore = createLazyAssetStore<Record<string, CountrySvgPath>>(
  [africaSvgMapUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      if (payload.countries && typeof payload.countries === 'object') {
        Object.assign(AFRICA_SVG_MAP, payload.countries);
      }
      if (Array.isArray(payload.backgroundSurroundingPaths)) {
        BACKGROUND_SURROUNDING_PATHS.splice(0, BACKGROUND_SURROUNDING_PATHS.length, ...payload.backgroundSurroundingPaths);
      }
      if (Array.isArray(payload.backgroundSurroundingCircles)) {
        BACKGROUND_SURROUNDING_CIRCLES.splice(0, BACKGROUND_SURROUNDING_CIRCLES.length, ...payload.backgroundSurroundingCircles);
      }
      if (payload.unRegionsStructured && typeof payload.unRegionsStructured === 'object') {
        Object.assign(AFRICA_UN_REGIONS_STRUCTURED, payload.unRegionsStructured);
      }
    }
    return AFRICA_SVG_MAP;
  },
  () => AFRICA_SVG_MAP
);

export const ensureAfricaSvgMapLoaded = africaSvgMapStore.ensureLoaded;
export const isAfricaSvgMapLoaded = africaSvgMapStore.isLoaded;
export const subscribeAfricaSvgMap = africaSvgMapStore.subscribe;
export const useAfricaSvgMapLoaded = africaSvgMapStore.useLoaded;
