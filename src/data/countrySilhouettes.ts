/**
 * countrySilhouettes.ts - High-Precision Geographic Silhouette Vectors for African Nations
 * Unified vector contours dynamically mapped to the authoritative African continental vector model.
 * Covering all 54 sovereign African states + Western Sahara.
 */

import { AFRICA_FINAL_MAP, AfricaFinalCountryPath } from './africaFinalGeometry';
import { atlas } from './atlas-store';

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

function buildSilhouetteForCountry(country: AfricaFinalCountryPath): CountrySilhouetteData {
  const entity = atlas.getEntity(country.id);
  const bbox = country.bbox || { minX: 0, minY: 0, maxX: 400, maxY: 400 };
  const w = Math.max((bbox.maxX || 400) - (bbox.minX || 0), 10);
  const h = Math.max((bbox.maxY || 400) - (bbox.minY || 0), 10);
  const padX = Math.max(w * 0.06, 12);
  const padY = Math.max(h * 0.06, 12);
  const minX = (bbox.minX || 0) - padX;
  const minY = (bbox.minY || 0) - padY;
  const totalW = w + padX * 2;
  const totalH = h + padY * 2;
  const viewBox = `${minX.toFixed(1)} ${minY.toFixed(1)} ${totalW.toFixed(1)} ${totalH.toFixed(1)}`;

  const path = country.admin1 && country.admin1.length > 0
    ? country.admin1.map(a => a.d).join(' ')
    : '';

  const shapeType: 'continental' | 'archipelago' | 'island' | 'landlocked' | 'coastal' =
    entity?.geographicType === 'Island'
      ? 'island'
      : entity?.geographicType === 'Landlocked'
      ? 'landlocked'
      : entity?.geographicType === 'Coastal'
      ? 'coastal'
      : 'continental';

  return {
    id: country.id,
    name: country.name || entity?.name || country.id,
    viewBox,
    path,
    capital: {
      name: entity?.capital || '',
      x: country.centroid?.x || ((bbox.minX || 0) + w / 2),
      y: country.centroid?.y || ((bbox.minY || 0) + h / 2)
    },
    geoCenter: entity?.coordinates || { lat: 0, lng: 0 },
    coastlineKm: entity?.geographicType === 'Island' || entity?.geographicType === 'Coastal' ? 100 : 0,
    shapeType,
    borderNeighborCount: entity?.borders?.length || 0
  };
}

export const COUNTRY_SILHOUETTES: Record<string, CountrySilhouetteData> = new Proxy({}, {
  get: (_target, prop: string) => {
    const country = AFRICA_FINAL_MAP[prop];
    if (!country) return undefined;
    return buildSilhouetteForCountry(country);
  },
  ownKeys: () => {
    return Object.keys(AFRICA_FINAL_MAP);
  },
  getOwnPropertyDescriptor: (_target, prop) => {
    if (typeof prop === 'string' && AFRICA_FINAL_MAP[prop]) {
      return {
        configurable: true,
        enumerable: true,
        value: buildSilhouetteForCountry(AFRICA_FINAL_MAP[prop])
      };
    }
    return undefined;
  }
});

export function getCountrySilhouette(iso3: string): CountrySilhouetteData | undefined {
  const country = AFRICA_FINAL_MAP[iso3];
  if (!country) return undefined;
  return buildSilhouetteForCountry(country);
}
