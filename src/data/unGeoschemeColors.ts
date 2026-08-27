/**
 * UN Geoscheme Color Palette & Warm Dynamic Tonal Variations for Africa
 * 
 * Official UN Geoscheme Africa Base Colors:
 * - Eastern Africa: #FFA500 (Vibrant Sunburst Orange)
 * - Middle Africa (Central Africa): #FF00FE (Electric Orchid Magenta)
 * - Northern Africa: #1802FF (Deep Mediterranean Royal Blue)
 * - Southern Africa: #FF0A0A (Kalahari Crimson Red)
 * - Western Africa: #00FF00 (Electric Guinean Green)
 * 
 * Includes warm and dynamic tonal variations engineered for high legibility,
 * optimistic aesthetics representing Africa's dynamic growth and future,
 * and seamless light/dark mode contrast (WCAG AA/AAA).
 */

import { AfricanRegion } from './types';
import { atlas } from './atlas-store';

export interface UnGeoschemeTonalPalette {
  id: AfricanRegion;
  m49Code: string;
  unBaseColor: string;          // Exact UN Geoscheme official hex
  displayName: string;
  shortName: string;
  
  // Warm & dynamic tonal variations
  warmAccent: string;           // Optimistic warm focal hex
  lightTint: string;            // Light mode soft tint / gradient stop
  deepTone: string;             // Rich dark tone for contrast & light mode typography
  glowRgba: string;             // Soft atmospheric glow
  
  // SVG Silhouette & Map Vector properties
  svgStroke: string;            // Crisp vector path stroke
  svgFillOpacity: number;       // Default fill opacity (0.2)
  svgFillOpacityActive: number; // Active/hover fill opacity (0.4)
  svgFillRgba: string;          // Translucent fill
  svgFillActiveRgba: string;    // Rich translucent fill
  
  // Tailwind Utility Presets
  badge: {
    bg: string;
    border: string;
    text: string;
    dot: string;
  };
  pill: {
    bg: string;
    border: string;
    text: string;
    activeBg: string;
    activeText: string;
  };
  card: {
    borderHover: string;
    bgHover: string;
    glow: string;
    accentText: string;
  };
  button: {
    primary: string;
    outline: string;
  };
  gradient: string;
}

export const UN_GEOSCHEME_TONAL_PALETTES: Record<AfricanRegion, UnGeoschemeTonalPalette> = {
  'Eastern Africa': {
    id: 'Eastern Africa',
    m49Code: '014',
    unBaseColor: '#FFA500',
    displayName: 'Eastern Africa',
    shortName: 'East',
    warmAccent: '#F59E0B',
    lightTint: '#FDE68A',
    deepTone: '#B45309',
    glowRgba: 'rgba(255, 165, 0, 0.35)',
    svgStroke: '#F59E0B',
    svgFillOpacity: 0.22,
    svgFillOpacityActive: 0.45,
    svgFillRgba: 'rgba(255, 165, 0, 0.20)',
    svgFillActiveRgba: 'rgba(255, 165, 0, 0.45)',
    badge: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/15',
      border: 'border-amber-500/30 dark:border-amber-500/40',
      text: 'text-amber-700 dark:text-amber-300',
      dot: 'bg-amber-500'
    },
    pill: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800/60',
      text: 'text-amber-800 dark:text-amber-300',
      activeBg: 'bg-amber-500 text-zinc-950',
      activeText: 'text-zinc-950 font-bold'
    },
    card: {
      borderHover: 'hover:border-amber-500/50',
      bgHover: 'hover:bg-amber-500/5',
      glow: 'shadow-amber-500/10',
      accentText: 'text-amber-600 dark:text-amber-400'
    },
    button: {
      primary: 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20',
      outline: 'border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10'
    },
    gradient: 'from-amber-500 via-orange-500 to-amber-600'
  },

  'Central Africa': {
    id: 'Central Africa',
    m49Code: '017',
    unBaseColor: '#FF00FE', // Middle Africa
    displayName: 'Central Africa (Middle Africa)',
    shortName: 'Central',
    warmAccent: '#E040FB',
    lightTint: '#F5D0FE',
    deepTone: '#A21CAF',
    glowRgba: 'rgba(255, 0, 254, 0.35)',
    svgStroke: '#E040FB',
    svgFillOpacity: 0.22,
    svgFillOpacityActive: 0.45,
    svgFillRgba: 'rgba(255, 0, 254, 0.18)',
    svgFillActiveRgba: 'rgba(255, 0, 254, 0.42)',
    badge: {
      bg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/15',
      border: 'border-fuchsia-500/30 dark:border-fuchsia-500/40',
      text: 'text-fuchsia-700 dark:text-fuchsia-300',
      dot: 'bg-fuchsia-500'
    },
    pill: {
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
      border: 'border-fuchsia-200 dark:border-fuchsia-800/60',
      text: 'text-fuchsia-800 dark:text-fuchsia-300',
      activeBg: 'bg-fuchsia-500 text-zinc-950',
      activeText: 'text-zinc-950 font-bold'
    },
    card: {
      borderHover: 'hover:border-fuchsia-500/50',
      bgHover: 'hover:bg-fuchsia-500/5',
      glow: 'shadow-fuchsia-500/10',
      accentText: 'text-fuchsia-600 dark:text-fuchsia-400'
    },
    button: {
      primary: 'bg-fuchsia-500 hover:bg-fuchsia-400 text-zinc-950 shadow-fuchsia-500/20',
      outline: 'border-fuchsia-500/40 text-fuchsia-700 dark:text-fuchsia-300 hover:bg-fuchsia-500/10'
    },
    gradient: 'from-fuchsia-500 via-pink-500 to-purple-600'
  },

  'Northern Africa': {
    id: 'Northern Africa',
    m49Code: '015',
    unBaseColor: '#1802FF',
    displayName: 'Northern Africa',
    shortName: 'North',
    warmAccent: '#3B82F6',
    lightTint: '#BFDBFE',
    deepTone: '#1D4ED8',
    glowRgba: 'rgba(24, 2, 255, 0.35)',
    svgStroke: '#3B82F6',
    svgFillOpacity: 0.22,
    svgFillOpacityActive: 0.45,
    svgFillRgba: 'rgba(24, 2, 255, 0.18)',
    svgFillActiveRgba: 'rgba(24, 2, 255, 0.42)',
    badge: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/15',
      border: 'border-blue-500/30 dark:border-blue-500/40',
      text: 'text-blue-700 dark:text-blue-300',
      dot: 'bg-blue-500'
    },
    pill: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-800/60',
      text: 'text-blue-800 dark:text-blue-300',
      activeBg: 'bg-blue-500 text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-blue-500/50',
      bgHover: 'hover:bg-blue-500/5',
      glow: 'shadow-blue-500/10',
      accentText: 'text-blue-600 dark:text-blue-400'
    },
    button: {
      primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20',
      outline: 'border-blue-500/40 text-blue-700 dark:text-blue-300 hover:bg-blue-500/10'
    },
    gradient: 'from-blue-600 via-indigo-500 to-cyan-500'
  },

  'Southern Africa': {
    id: 'Southern Africa',
    m49Code: '018',
    unBaseColor: '#FF0A0A',
    displayName: 'Southern Africa',
    shortName: 'South',
    warmAccent: '#F43F5E',
    lightTint: '#FECDD3',
    deepTone: '#BE123C',
    glowRgba: 'rgba(255, 10, 10, 0.35)',
    svgStroke: '#F43F5E',
    svgFillOpacity: 0.22,
    svgFillOpacityActive: 0.45,
    svgFillRgba: 'rgba(255, 10, 10, 0.18)',
    svgFillActiveRgba: 'rgba(255, 10, 10, 0.42)',
    badge: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/15',
      border: 'border-rose-500/30 dark:border-rose-500/40',
      text: 'text-rose-700 dark:text-rose-300',
      dot: 'bg-rose-500'
    },
    pill: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-800/60',
      text: 'text-rose-800 dark:text-rose-300',
      activeBg: 'bg-rose-500 text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-rose-500/50',
      bgHover: 'hover:bg-rose-500/5',
      glow: 'shadow-rose-500/10',
      accentText: 'text-rose-600 dark:text-rose-400'
    },
    button: {
      primary: 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20',
      outline: 'border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-500/10'
    },
    gradient: 'from-rose-500 via-red-500 to-orange-500'
  },

  'Western Africa': {
    id: 'Western Africa',
    m49Code: '011',
    unBaseColor: '#00FF00',
    displayName: 'Western Africa',
    shortName: 'West',
    warmAccent: '#10B981',
    lightTint: '#A7F3D0',
    deepTone: '#047857',
    glowRgba: 'rgba(0, 255, 0, 0.35)',
    svgStroke: '#10B981',
    svgFillOpacity: 0.22,
    svgFillOpacityActive: 0.45,
    svgFillRgba: 'rgba(0, 255, 0, 0.18)',
    svgFillActiveRgba: 'rgba(0, 255, 0, 0.42)',
    badge: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      border: 'border-emerald-500/30 dark:border-emerald-500/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500'
    },
    pill: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      text: 'text-emerald-800 dark:text-emerald-300',
      activeBg: 'bg-emerald-500 text-zinc-950',
      activeText: 'text-zinc-950 font-bold'
    },
    card: {
      borderHover: 'hover:border-emerald-500/50',
      bgHover: 'hover:bg-emerald-500/5',
      glow: 'shadow-emerald-500/10',
      accentText: 'text-emerald-600 dark:text-emerald-400'
    },
    button: {
      primary: 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20',
      outline: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10'
    },
    gradient: 'from-emerald-500 via-teal-500 to-green-600'
  }
};

/**
 * Normalized Region Name Resolver
 */
export function resolveAfricanRegion(regionQuery: string): AfricanRegion {
  const q = regionQuery.trim().toLowerCase();
  if (q.includes('north')) return 'Northern Africa';
  if (q.includes('west')) return 'Western Africa';
  if (q.includes('middle') || q.includes('central')) return 'Central Africa';
  if (q.includes('east')) return 'Eastern Africa';
  if (q.includes('south')) return 'Southern Africa';
  return 'Western Africa';
}

/**
 * Get the full UN Geoscheme Tonal Palette for a region
 */
export function getRegionTonalPalette(region: string): UnGeoschemeTonalPalette {
  const resolved = resolveAfricanRegion(region);
  return UN_GEOSCHEME_TONAL_PALETTES[resolved];
}

/**
 * Get the UN Geoscheme Tonal Palette for any African Country (by ISO3 or ISO2)
 */
export function getCountryRegionTonalPalette(countryIdOrIso: string): UnGeoschemeTonalPalette {
  const id = countryIdOrIso.toUpperCase();
  const entity = atlas.getEntity(id);
  if (entity?.region) {
    return getRegionTonalPalette(entity.region);
  }
  // Default fallback
  return UN_GEOSCHEME_TONAL_PALETTES['Western Africa'];
}

/**
 * Get silhouette styling parameters for a country based on its UN Geoscheme region
 */
export function getCountrySilhouettePalette(countryId: string) {
  const palette = getCountryRegionTonalPalette(countryId);
  return {
    stroke: palette.svgStroke,
    unBaseColor: palette.unBaseColor,
    warmAccent: palette.warmAccent,
    fillRgba: palette.svgFillRgba,
    fillActiveRgba: palette.svgFillActiveRgba,
    fillOpacity: palette.svgFillOpacity,
    badge: palette.badge,
    card: palette.card,
    button: palette.button,
    regionName: palette.displayName
  };
}
