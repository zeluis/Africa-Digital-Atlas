/**
 * Asynchronous In-Memory Cached SVG Map Loader
 * Loads the raw public/africa-final.svg file once and extracts structured layer elements
 * completely decoupled from the JavaScript bundle.
 */

import { useState, useEffect } from 'react';
import { 
  AFRICA_FINAL_MAP, 
  AfricaFinalCountryPath, 
  AfricaFinalAdmin1Path,
  updateAfricaFinalMapWithAdmin1 
} from '../data/africaFinalGeometry';

/**
 * Asynchronous In-Memory Cached SVG Map Loader
 * Loads the raw public/africa-final.svg file once and extracts structured layer elements
 * completely decoupled from the JavaScript bundle.
 */

let cachedSvgText: string | null = null;
let cachedSvgPromise: Promise<string> | null = null;
let parsedCountryMapCache: Record<string, AfricaFinalCountryPath> | null = null;

export async function fetchAfricaFinalSvg(): Promise<string> {
  if (cachedSvgText) {
    return cachedSvgText;
  }
  if (cachedSvgPromise) {
    return cachedSvgPromise;
  }

  cachedSvgPromise = (async () => {
    // Resolve asset path respecting Vite base path (crucial for GitHub Pages /sub-path/ deployment)
    const base = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
    const assetCandidates = [
      `${base}/africa-final.svg`,
      './africa-final.svg',
      '/africa-final.svg'
    ];

    let lastError: Error | null = null;
    for (const url of assetCandidates) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const text = await response.text();
          // Ensure we actually got an SVG and not an HTML 404 fallback page
          if (text.includes('<svg') || text.includes('xmlns="http://www.w3.org/2000/svg"')) {
            cachedSvgText = text;
            return text;
          }
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    cachedSvgPromise = null;
    throw lastError || new Error('Failed to load vector map asset from any known base path candidate.');
  })();

  return cachedSvgPromise;
}

export interface ParsedSvgFeature {
  id: string;
  d: string;
  originalFill: string;
  originalClass?: string;
}

export interface ParsedAfricaMapData {
  viewBox: string;
  nonAfricanLands: ParsedSvgFeature[];
  coastlineIslands: ParsedSvgFeature[];
  waterBodies: ParsedSvgFeature[];
  countries: ParsedSvgFeature[];
  admin1Paths: ParsedSvgFeature[];
}

let parsedMapDataCache: ParsedAfricaMapData | null = null;

export function parseAfricaFinalSvg(svgText: string): ParsedAfricaMapData {
  if (parsedMapDataCache) {
    return parsedMapDataCache;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');
  const viewBox = svgEl?.getAttribute('viewBox') || '0 0 5796.6572 5867.728';

  const nonAfricanLands: ParsedSvgFeature[] = [];
  const coastlineIslands: ParsedSvgFeature[] = [];
  const waterBodies: ParsedSvgFeature[] = [];
  const countries: ParsedSvgFeature[] = [];
  const admin1Paths: ParsedSvgFeature[] = [];

  const paths = doc.querySelectorAll('path');
  paths.forEach((path) => {
    const id = path.getAttribute('id') || '';
    const d = path.getAttribute('d') || '';
    const fill = path.getAttribute('fill') || path.style.fill || '#10b981';
    const className = path.getAttribute('class') || '';

    if (!d) return;

    const feature: ParsedSvgFeature = {
      id,
      d,
      originalFill: fill,
      originalClass: className
    };

    if (id.startsWith('path') || id.startsWith('non-afr') || id.includes('Europe') || id.includes('Arabia')) {
      nonAfricanLands.push(feature);
    } else if (id.startsWith('water') || id.includes('lake') || fill === '#38bdf8' || fill === '#0284c7') {
      waterBodies.push(feature);
    } else if (id.startsWith('island') || id.startsWith('coast')) {
      coastlineIslands.push(feature);
    } else if (id.length === 3 || id.length === 2 || /^[A-Z]{2,3}$/.test(id)) {
      countries.push(feature);
    } else if (id.includes('_') || id.startsWith('sub_') || id.startsWith('adm1_')) {
      admin1Paths.push(feature);
    } else {
      countries.push(feature);
    }
  });

  parsedMapDataCache = {
    viewBox,
    nonAfricanLands,
    coastlineIslands,
    waterBodies,
    countries,
    admin1Paths
  };

  return parsedMapDataCache;
}

/**
 * Extracts all 1,017 Admin-1 vector geometries and groups them by sovereign country ISO3.
 * Merges with the lightweight country metadata into AFRICA_FINAL_MAP.
 */
export function parseAfricaFinalCountryMap(svgText: string): Record<string, AfricaFinalCountryPath> {
  if (parsedCountryMapCache) {
    return parsedCountryMapCache;
  }

  const admin1ByCountry: Record<string, AfricaFinalAdmin1Path[]> = {};
  for (const iso3 of Object.keys(AFRICA_FINAL_MAP)) {
    admin1ByCountry[iso3] = [];
  }

  // Fast DOM-based path extraction
  if (typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const admin1Els = doc.querySelectorAll('path[data-level="admin1"]');

      if (admin1Els.length > 0) {
        admin1Els.forEach((path) => {
          const iso3 = path.getAttribute('data-iso3') || '';
          const id = path.getAttribute('id') || '';
          const name = path.getAttribute('data-label') || '';
          const seq = path.getAttribute('data-admin1-seq') || '';
          const d = path.getAttribute('d') || '';

          if (iso3 && d && admin1ByCountry[iso3]) {
            admin1ByCountry[iso3].push({ id, name, seq, d });
          }
        });
      }
    } catch {
      // Fall through to regex parser
    }
  }

  // Regex fallback if DOMParser is unavailable or yielded no paths
  const firstCountryCount = Object.values(admin1ByCountry)[0]?.length || 0;
  if (firstCountryCount === 0) {
    const pathRegex = /<path id="([^"]+)" class="[^"]*" d="([^"]+)" transform="[^"]*" data-level="admin1" data-m49="[^"]*" data-iso3="([^"]+)" data-region-m49="[^"]*" data-admin1-seq="([^"]+)" data-label="([^"]+)"/g;
    let match: RegExpExecArray | null;
    while ((match = pathRegex.exec(svgText)) !== null) {
      const [, id, d, iso3, seq, label] = match;
      if (admin1ByCountry[iso3] && d) {
        admin1ByCountry[iso3].push({ id, name: label, seq, d });
      }
    }
  }

  // Update in-memory AFRICA_FINAL_MAP so synchronous references have the paths
  const updatedMap = updateAfricaFinalMapWithAdmin1(admin1ByCountry);
  parsedCountryMapCache = { ...updatedMap };
  return parsedCountryMapCache;
}

/**
 * Asynchronously streams and parses the decoupled public/africa-final.svg asset.
 */
export async function loadAfricaFinalCountryMap(): Promise<Record<string, AfricaFinalCountryPath>> {
  if (parsedCountryMapCache) {
    return parsedCountryMapCache;
  }
  const svgText = await fetchAfricaFinalSvg();
  return parseAfricaFinalCountryMap(svgText);
}

/**
 * React hook to consume streamed Africa vector map data with loading & error states.
 */
export function useAfricaFinalMap() {
  const [mapData, setMapData] = useState<Record<string, AfricaFinalCountryPath>>(parsedCountryMapCache || AFRICA_FINAL_MAP);
  const [isLoaded, setIsLoaded] = useState<boolean>(!!parsedCountryMapCache || Object.values(AFRICA_FINAL_MAP).some(c => c.admin1 && c.admin1.length > 0));
  const [isLoading, setIsLoading] = useState<boolean>(!isLoaded);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (parsedCountryMapCache || Object.values(AFRICA_FINAL_MAP).some(c => c.admin1 && c.admin1.length > 0)) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    loadAfricaFinalCountryMap()
      .then((data) => {
        if (isMounted) {
          setMapData(data);
          setIsLoaded(true);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { mapData, isLoaded, isLoading, error };
}
