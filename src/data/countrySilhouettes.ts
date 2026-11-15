/**
 * countrySilhouettes.ts - High-Precision Geographic Silhouette Vectors for African Nations
 * Authentic vector boundary contours extracted from Natural Earth 50m resolution
 * Covering all 54 sovereign African states + Western Sahara
 */

import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface CountrySilhouetteData {
  id: string; // ISO3
  name: string;
  viewBox: string;
  path: string;
  islandPaths?: string[];
  capital: { name: string; x: number; y: number };
  geoCenter: { lat: number; lng: number };
  coastlineKm?: number;
  shapeType: 'continental' | 'archipelago' | 'island' | 'landlocked' | 'coastal';
  borderNeighborCount?: number;
}

const countrySilhouettesUrl = new URL('./countrySilhouettes.json', import.meta.url).href;

export const COUNTRY_SILHOUETTES: Record<string, CountrySilhouetteData> = {};

const countrySilhouettesStore = createLazyAssetStore<Record<string, CountrySilhouetteData>>(
  [countrySilhouettesUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      Object.assign(COUNTRY_SILHOUETTES, payload);
    }
    return COUNTRY_SILHOUETTES;
  },
  () => COUNTRY_SILHOUETTES
);

export const ensureCountrySilhouettesLoaded = countrySilhouettesStore.ensureLoaded;
export const isCountrySilhouettesLoaded = countrySilhouettesStore.isLoaded;
export const subscribeCountrySilhouettes = countrySilhouettesStore.subscribe;
export const useCountrySilhouettesLoaded = countrySilhouettesStore.useLoaded;

export function getCountrySilhouette(iso3: string): CountrySilhouetteData | undefined {
  return COUNTRY_SILHOUETTES[iso3.toUpperCase()];
}
