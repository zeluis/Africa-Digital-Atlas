/**
 * Asynchronous In-Memory Cached SVG Map Loader
 * Loads the raw public/africa-final.svg file once and extracts structured layer elements
 * completely decoupled from the JavaScript bundle.
 */

let cachedSvgText: string | null = null;
let cachedSvgPromise: Promise<string> | null = null;

export async function fetchAfricaFinalSvg(): Promise<string> {
  if (cachedSvgText) {
    return cachedSvgText;
  }
  if (cachedSvgPromise) {
    return cachedSvgPromise;
  }

  cachedSvgPromise = (async () => {
    try {
      const response = await fetch('/africa-final.svg');
      if (!response.ok) {
        throw new Error(`Failed to load vector map asset: ${response.statusText}`);
      }
      const text = await response.text();
      cachedSvgText = text;
      return text;
    } catch (err) {
      cachedSvgPromise = null;
      throw err;
    }
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