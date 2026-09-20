/**
 * africaFinalGeometry.ts
 * Ingested vector geometry from public/africa-final.svg
 * 57 African sovereign states & territories with 1,017 Admin-1 subdivisions
 * Native coordinate system: viewBox "0 0 5796 5867" with transform "translate(-216.0198 -66.614)"
 */

import rawData from './africaFinalMapData.json';
import { AfricanRegion } from './types';
import { getCanonicalCountryColor } from './africaCanonicalColorPalette';

export interface AfricaFinalAdmin1Path {
  id: string;
  name: string;
  seq: string;
  d: string;
}

export interface AfricaFinalCountryPath {
  id: string; // ISO3
  groupId: string;
  m49: string;
  unRegion: AfricanRegion;
  name: string;
  originalClass?: string;
  originalColor?: string;
  area?: number;
  admin1: AfricaFinalAdmin1Path[];
  bbox?: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  centroid?: {
    x: number;
    y: number;
  };
}

const parsedMap = rawData as unknown as Record<string, AfricaFinalCountryPath>;

// Ensure all countries in the authoritative map have their canonical colors mapped
for (const country of Object.values(parsedMap)) {
  const canonical = getCanonicalCountryColor(country.id) || getCanonicalCountryColor(country.name);
  if (canonical) {
    country.originalColor = canonical;
  }
}

export const AFRICA_FINAL_MAP: Record<string, AfricaFinalCountryPath> = parsedMap;

export const AFRICA_FINAL_VIEWBOX = "0 0 5796 5867";
export const AFRICA_FINAL_TRANSFORM = "translate(-216.0198 -66.614)";

