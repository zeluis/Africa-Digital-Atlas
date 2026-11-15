/**
 * atlanticNaturalEarthPaths.ts
 * High-precision land contours mapped from Natural Earth 1:50m TopoJSON (countries-50m.json)
 * Projection: Plate Carrée (Equirectangular) mapped to 1000x580 Viewport covering Lat -38° to +58°, Lng -105° to +52°.
 * Includes continental outlines + international country borders for accurate historic & geographic orientation.
 *
 * Hydrated lazily from a Workbox-precached JSON bundle to keep runtime JS bundles lean.
 */

import { createLazyAssetStore } from '../../utils/lazyDataLoader';

const nePathsUrl = new URL('./atlanticNaturalEarthPaths.json', import.meta.url).href;

export let NATURAL_EARTH_SOUTH_AMERICA_PATH = '';
export let NATURAL_EARTH_NORTH_AMERICA_PATH = '';
export let NATURAL_EARTH_EUROPE_MAINLAND_PATH = '';
export let NATURAL_EARTH_GREAT_BRITAIN_PATH = '';
export let NATURAL_EARTH_IRELAND_PATH = '';
export let NATURAL_EARTH_BALEARIC_PATH = '';
export let NATURAL_EARTH_SARDINIA_CORSICA_PATH = '';
export let NATURAL_EARTH_SICILY_PATH = '';
export let NATURAL_EARTH_CUBA_PATH = '';
export let NATURAL_EARTH_HISPANIOLA_PATH = '';
export let NATURAL_EARTH_JAMAICA_PATH = '';
export let NATURAL_EARTH_PUERTO_RICO_PATH = '';
export let NATURAL_EARTH_BAHAMAS_PATH = '';
export let NATURAL_EARTH_LESSER_ANTILLES_PATH = '';
export let NATURAL_EARTH_INTERNATIONAL_BORDERS_PATH = '';

export const ATLANTIC_NATURAL_EARTH_PATHS: Record<string, string> = {};

const atlanticPathsStore = createLazyAssetStore<Record<string, string>>(
  [nePathsUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      Object.assign(ATLANTIC_NATURAL_EARTH_PATHS, payload);
      NATURAL_EARTH_SOUTH_AMERICA_PATH = payload.NATURAL_EARTH_SOUTH_AMERICA_PATH || '';
      NATURAL_EARTH_NORTH_AMERICA_PATH = payload.NATURAL_EARTH_NORTH_AMERICA_PATH || '';
      NATURAL_EARTH_EUROPE_MAINLAND_PATH = payload.NATURAL_EARTH_EUROPE_MAINLAND_PATH || '';
      NATURAL_EARTH_GREAT_BRITAIN_PATH = payload.NATURAL_EARTH_GREAT_BRITAIN_PATH || '';
      NATURAL_EARTH_IRELAND_PATH = payload.NATURAL_EARTH_IRELAND_PATH || '';
      NATURAL_EARTH_BALEARIC_PATH = payload.NATURAL_EARTH_BALEARIC_PATH || '';
      NATURAL_EARTH_SARDINIA_CORSICA_PATH = payload.NATURAL_EARTH_SARDINIA_CORSICA_PATH || '';
      NATURAL_EARTH_SICILY_PATH = payload.NATURAL_EARTH_SICILY_PATH || '';
      NATURAL_EARTH_CUBA_PATH = payload.NATURAL_EARTH_CUBA_PATH || '';
      NATURAL_EARTH_HISPANIOLA_PATH = payload.NATURAL_EARTH_HISPANIOLA_PATH || '';
      NATURAL_EARTH_JAMAICA_PATH = payload.NATURAL_EARTH_JAMAICA_PATH || '';
      NATURAL_EARTH_PUERTO_RICO_PATH = payload.NATURAL_EARTH_PUERTO_RICO_PATH || '';
      NATURAL_EARTH_BAHAMAS_PATH = payload.NATURAL_EARTH_BAHAMAS_PATH || '';
      NATURAL_EARTH_LESSER_ANTILLES_PATH = payload.NATURAL_EARTH_LESSER_ANTILLES_PATH || '';
      NATURAL_EARTH_INTERNATIONAL_BORDERS_PATH = payload.NATURAL_EARTH_INTERNATIONAL_BORDERS_PATH || '';
    }
    return ATLANTIC_NATURAL_EARTH_PATHS;
  },
  () => ATLANTIC_NATURAL_EARTH_PATHS
);

export const ensureAtlanticPathsLoaded = atlanticPathsStore.ensureLoaded;
export const isAtlanticPathsLoaded = atlanticPathsStore.isLoaded;
export const subscribeAtlanticPaths = atlanticPathsStore.subscribe;
export const useAtlanticPathsLoaded = atlanticPathsStore.useLoaded;
