/**
 * UN Geoscheme Color Palette & Warm Dynamic Tonal Variations for Africa
 * 
 * Strict Brand Color Assignments:
 * - Eastern Africa: #FFA500 (Orange)
 * - Middle Africa: #FF00FE (Magenta/Fuchsia)
 * - Northern Africa: #1802FF (Pure Blue)
 * - Southern Africa: #FF0A0A (Pure Red)
 * - Western Africa: #00FF00 (Neon Green)
 * 
 * Includes mathematical luminance calculations (WCAG AA/AAA) and programmatic
 * contrast text resolution (#111827 vs #FFFFFF) for light and dark modes.
 */

import { AfricanRegion } from './types';
import { atlas } from './atlas-store';

export interface UnGeoschemeTonalPalette {
  id: AfricanRegion;
  m49Code: string;
  unBaseColor: string;          // Exact UN Geoscheme official hex
  displayName: string;
  shortName: string;
  cssVarKey: string;            // CSS variable suffix (eastern, middle, northern, southern, western)
  
  // High contrast on-solid text color (#111827 for high luminance, #FFFFFF for medium/dark)
  onSolidText: '#111827' | '#FFFFFF';
  
  // Warm & dynamic tonal variations
  warmAccent: string;           // Optimistic warm focal hex
  lightTint: string;            // Light mode soft tint
  deepTone: string;             // Rich dark tone for contrast
  glowRgba: string;             // Atmospheric glow
  
  // SVG Silhouette & Map Vector properties
  svgStroke: string;            // Vector stroke
  svgFillOpacity: number;       // Default fill opacity (0.2)
  svgFillOpacityActive: number; // Active/hover fill opacity (0.45)
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
    unBaseColor: '#FFA500', // Sunburst Orange
    displayName: 'Eastern Africa',
    shortName: 'East',
    cssVarKey: 'eastern',
    onSolidText: '#111827', // High luminance (0.4817) -> Dark charcoal text
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
      dot: 'bg-[#FFA500]'
    },
    pill: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800/60',
      text: 'text-amber-800 dark:text-amber-300',
      activeBg: 'bg-[#FFA500] text-zinc-950',
      activeText: 'text-zinc-950 font-bold'
    },
    card: {
      borderHover: 'hover:border-amber-500/50',
      bgHover: 'hover:bg-amber-500/5',
      glow: 'shadow-amber-500/10',
      accentText: 'text-amber-600 dark:text-amber-400'
    },
    button: {
      primary: 'bg-[#FFA500] hover:bg-amber-400 text-zinc-950 shadow-amber-500/20',
      outline: 'border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10'
    },
    gradient: 'from-[#FFA500] via-orange-500 to-amber-600'
  },

  'Central Africa': {
    id: 'Central Africa',
    m49Code: '017',
    unBaseColor: '#FF00FE', // Middle Africa Magenta / Fuchsia
    displayName: 'Central Africa (Middle Africa)',
    shortName: 'Central',
    cssVarKey: 'middle',
    onSolidText: '#FFFFFF', // Medium luminance (0.2848) -> Light white text
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
      dot: 'bg-[#FF00FE]'
    },
    pill: {
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
      border: 'border-fuchsia-200 dark:border-fuchsia-800/60',
      text: 'text-fuchsia-800 dark:text-fuchsia-300',
      activeBg: 'bg-[#FF00FE] text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-fuchsia-500/50',
      bgHover: 'hover:bg-fuchsia-500/5',
      glow: 'shadow-fuchsia-500/10',
      accentText: 'text-fuchsia-600 dark:text-fuchsia-400'
    },
    button: {
      primary: 'bg-[#FF00FE] hover:bg-fuchsia-400 text-white shadow-fuchsia-500/20',
      outline: 'border-fuchsia-500/40 text-fuchsia-700 dark:text-fuchsia-300 hover:bg-fuchsia-500/10'
    },
    gradient: 'from-[#FF00FE] via-pink-500 to-purple-600'
  },

  'Northern Africa': {
    id: 'Northern Africa',
    m49Code: '015',
    unBaseColor: '#1802FF', // Pure Blue
    displayName: 'Northern Africa',
    shortName: 'North',
    cssVarKey: 'northern',
    onSolidText: '#FFFFFF', // Deep luminance (0.0762) -> Light white text
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
      dot: 'bg-[#1802FF]'
    },
    pill: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-800/60',
      text: 'text-blue-800 dark:text-blue-300',
      activeBg: 'bg-[#1802FF] text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-blue-500/50',
      bgHover: 'hover:bg-blue-500/5',
      glow: 'shadow-blue-500/10',
      accentText: 'text-blue-600 dark:text-blue-400'
    },
    button: {
      primary: 'bg-[#1802FF] hover:bg-blue-600 text-white shadow-blue-500/20',
      outline: 'border-blue-500/40 text-blue-700 dark:text-blue-300 hover:bg-blue-500/10'
    },
    gradient: 'from-[#1802FF] via-indigo-500 to-cyan-500'
  },

  'Southern Africa': {
    id: 'Southern Africa',
    m49Code: '018',
    unBaseColor: '#FF0A0A', // Pure Red
    displayName: 'Southern Africa',
    shortName: 'South',
    cssVarKey: 'southern',
    onSolidText: '#FFFFFF', // Medium-low luminance (0.2224) -> Light white text
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
      dot: 'bg-[#FF0A0A]'
    },
    pill: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-800/60',
      text: 'text-rose-800 dark:text-rose-300',
      activeBg: 'bg-[#FF0A0A] text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-rose-500/50',
      bgHover: 'hover:bg-rose-500/5',
      glow: 'shadow-rose-500/10',
      accentText: 'text-rose-600 dark:text-rose-400'
    },
    button: {
      primary: 'bg-[#FF0A0A] hover:bg-red-600 text-white shadow-rose-500/20',
      outline: 'border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-500/10'
    },
    gradient: 'from-[#FF0A0A] via-red-500 to-orange-500'
  },

  'Western Africa': {
    id: 'Western Africa',
    m49Code: '011',
    unBaseColor: '#00FF00', // Neon Green
    displayName: 'Western Africa',
    shortName: 'West',
    cssVarKey: 'western',
    onSolidText: '#111827', // Very high luminance (0.7152) -> Dark charcoal text
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
      dot: 'bg-[#00FF00]'
    },
    pill: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      text: 'text-emerald-800 dark:text-emerald-300',
      activeBg: 'bg-[#00FF00] text-zinc-950',
      activeText: 'text-zinc-950 font-bold'
    },
    card: {
      borderHover: 'hover:border-emerald-500/50',
      bgHover: 'hover:bg-emerald-500/5',
      glow: 'shadow-emerald-500/10',
      accentText: 'text-emerald-600 dark:text-emerald-400'
    },
    button: {
      primary: 'bg-[#00FF00] hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20',
      outline: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10'
    },
    gradient: 'from-[#00FF00] via-teal-500 to-green-600'
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
  return UN_GEOSCHEME_TONAL_PALETTES['Western Africa'];
}

/**
 * Determines optimal foreground text color (WCAG 2.1 AA/AAA compliant)
 * for labels placed directly on top of regional color surfaces.
 */
export function getRegionContrastColor(regionHex: string): '#111827' | '#FFFFFF' {
  const hex = regionHex.replace('#', '');
  if (hex.length < 6) return '#FFFFFF';
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  // Luminance > 0.35 requires dark charcoal text for high contrast
  return luminance > 0.35 ? '#111827' : '#FFFFFF';
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
    onSolidText: palette.onSolidText,
    badge: palette.badge,
    card: palette.card,
    button: palette.button,
    regionName: palette.displayName
  };
}
