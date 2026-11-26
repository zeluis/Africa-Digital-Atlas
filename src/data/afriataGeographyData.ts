/**
 * afriataGeographyData.ts
 * UN M49 Regional Hierarchy & First-Level Administrative Subdivisions (Admin-1)
 * Schema: afriata-geography/1
 */

import { AfriataGeographyHierarchy, AfriataAdmin1 } from './types';
import { createLazyAssetStore } from '../utils/lazyDataLoader';

const afriataGeographyUrl = new URL('./afriataGeographyData.json', import.meta.url).href;

export const AFRIATA_GEOGRAPHY_DATA: AfriataGeographyHierarchy = {
  schema: 'afriata-geography/1',
  root: 'AFRICA',
  sources: {
    admin1: 'UN Geoscheme M49 / Natural Earth / National Cartographic Bureaus',
    admin2: ''
  },
  regions: []
};

// Flattened lookup for all Admin1 entities (hydrated lazily from afriataGeographyData.json)
export const ALL_ADMIN1_SUBDIVISIONS: AfriataAdmin1[] = [];

const afriataGeographyStore = createLazyAssetStore<AfriataGeographyHierarchy>(
  [afriataGeographyUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object' && Array.isArray(payload.regions)) {
      Object.assign(AFRIATA_GEOGRAPHY_DATA, payload);
      if (ALL_ADMIN1_SUBDIVISIONS.length === 0) {
        const flat: AfriataAdmin1[] = payload.regions.flatMap((region: AfriataGeographyHierarchy['regions'][number]) =>
          region.countries.flatMap(country =>
            country.admin1.map(adm => ({
              ...adm,
              iso3: country.iso3,
              countryName: country.name,
              regionName: region.name
            }))
          )
        );
        ALL_ADMIN1_SUBDIVISIONS.push(...flat);
      }
    }
    return AFRIATA_GEOGRAPHY_DATA;
  },
  () => AFRIATA_GEOGRAPHY_DATA
);

export const ensureAfriataGeographyLoaded = afriataGeographyStore.ensureLoaded;
export const isAfriataGeographyLoaded = afriataGeographyStore.isLoaded;
export const subscribeAfriataGeography = afriataGeographyStore.subscribe;
export const useAfriataGeographyLoaded = afriataGeographyStore.useLoaded;

export function getAdmin1ForCountry(iso3: string): AfriataAdmin1[] {
  return ALL_ADMIN1_SUBDIVISIONS.filter(a => a.iso3 === iso3);
}

export function searchAdmin1Subdivisions(query: string): AfriataAdmin1[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return ALL_ADMIN1_SUBDIVISIONS.filter(a =>
    a.name.toLowerCase().includes(q) ||
    (a.sourceName && a.sourceName.toLowerCase().includes(q)) ||
    (a.countryName && a.countryName.toLowerCase().includes(q)) ||
    (a.admin1Code && a.admin1Code.toLowerCase().includes(q))
  );
}
