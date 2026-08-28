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
    unBaseColor: '#FFA500', // Canonical UN Base (Sunburst Orange)
    displayName: 'Eastern Africa',
    shortName: 'East',
    cssVarKey: 'eastern',
    onSolidText: '#FFFFFF',
    warmAccent: '#FB923C',
    lightTint: '#FFEDD5',
    deepTone: '#C2410C',
    glowRgba: 'rgba(234, 88, 12, 0.25)',
    svgStroke: '#EA580C',
    svgFillOpacity: 0.12,
    svgFillOpacityActive: 0.35,
    svgFillRgba: 'rgba(234, 88, 12, 0.08)',
    svgFillActiveRgba: 'rgba(234, 88, 12, 0.28)',
    badge: {
      bg: 'bg-orange-500/10 dark:bg-orange-500/15',
      border: 'border-orange-500/25 dark:border-orange-500/35',
      text: 'text-orange-800 dark:text-orange-300',
      dot: 'bg-[#EA580C]'
    },
    pill: {
      bg: 'bg-orange-50 dark:bg-orange-950/40',
      border: 'border-orange-200/80 dark:border-orange-800/50',
      text: 'text-orange-800 dark:text-orange-300',
      activeBg: 'bg-[#EA580C] text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-orange-500/40',
      bgHover: 'hover:bg-orange-500/[0.03]',
      glow: 'shadow-orange-500/10',
      accentText: 'text-orange-600 dark:text-orange-400'
    },
    button: {
      primary: 'bg-[#EA580C] hover:bg-orange-600 text-white shadow-orange-500/20',
      outline: 'border-orange-500/30 text-orange-700 dark:text-orange-300 hover:bg-orange-500/10'
    },
    gradient: 'from-[#EA580C] via-amber-500 to-orange-600'
  },

  'Central Africa': {
    id: 'Central Africa',
    m49Code: '017',
    unBaseColor: '#FF00FE', // Canonical UN Base (Magenta / Fuchsia)
    displayName: 'Central Africa (Middle Africa)',
    shortName: 'Central',
    cssVarKey: 'middle',
    onSolidText: '#FFFFFF',
    warmAccent: '#818CF8',
    lightTint: '#E0E7FF',
    deepTone: '#4338CA',
    glowRgba: 'rgba(99, 102, 241, 0.25)',
    svgStroke: '#6366F1',
    svgFillOpacity: 0.12,
    svgFillOpacityActive: 0.35,
    svgFillRgba: 'rgba(99, 102, 241, 0.08)',
    svgFillActiveRgba: 'rgba(99, 102, 241, 0.28)',
    badge: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
      border: 'border-indigo-500/25 dark:border-indigo-500/35',
      text: 'text-indigo-800 dark:text-indigo-300',
      dot: 'bg-[#6366F1]'
    },
    pill: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200/80 dark:border-indigo-800/50',
      text: 'text-indigo-800 dark:text-indigo-300',
      activeBg: 'bg-[#6366F1] text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-indigo-500/40',
      bgHover: 'hover:bg-indigo-500/[0.03]',
      glow: 'shadow-indigo-500/10',
      accentText: 'text-indigo-600 dark:text-indigo-400'
    },
    button: {
      primary: 'bg-[#6366F1] hover:bg-indigo-600 text-white shadow-indigo-500/20',
      outline: 'border-indigo-500/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/10'
    },
    gradient: 'from-[#6366F1] via-purple-500 to-indigo-600'
  },

  'Northern Africa': {
    id: 'Northern Africa',
    m49Code: '015',
    unBaseColor: '#1802FF', // Canonical UN Base (Deep Cobalt Blue)
    displayName: 'Northern Africa',
    shortName: 'North',
    cssVarKey: 'northern',
    onSolidText: '#FFFFFF',
    warmAccent: '#FBBF24',
    lightTint: '#FEF3C7',
    deepTone: '#B45309',
    glowRgba: 'rgba(217, 119, 6, 0.25)',
    svgStroke: '#D97706',
    svgFillOpacity: 0.12,
    svgFillOpacityActive: 0.35,
    svgFillRgba: 'rgba(217, 119, 6, 0.08)',
    svgFillActiveRgba: 'rgba(217, 119, 6, 0.28)',
    badge: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/15',
      border: 'border-amber-500/25 dark:border-amber-500/35',
      text: 'text-amber-800 dark:text-amber-300',
      dot: 'bg-[#D97706]'
    },
    pill: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200/80 dark:border-amber-800/50',
      text: 'text-amber-800 dark:text-amber-300',
      activeBg: 'bg-[#D97706] text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-amber-500/40',
      bgHover: 'hover:bg-amber-500/[0.03]',
      glow: 'shadow-amber-500/10',
      accentText: 'text-amber-600 dark:text-amber-400'
    },
    button: {
      primary: 'bg-[#D97706] hover:bg-amber-600 text-white shadow-amber-500/20',
      outline: 'border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10'
    },
    gradient: 'from-[#D97706] via-yellow-500 to-amber-600'
  },

  'Southern Africa': {
    id: 'Southern Africa',
    m49Code: '018',
    unBaseColor: '#FF0A0A', // Canonical UN Base (Red)
    displayName: 'Southern Africa',
    shortName: 'South',
    cssVarKey: 'southern',
    onSolidText: '#FFFFFF',
    warmAccent: '#FB7185',
    lightTint: '#FFE4E6',
    deepTone: '#BE123C',
    glowRgba: 'rgba(225, 29, 72, 0.25)',
    svgStroke: '#E11D48',
    svgFillOpacity: 0.12,
    svgFillOpacityActive: 0.35,
    svgFillRgba: 'rgba(225, 29, 72, 0.08)',
    svgFillActiveRgba: 'rgba(225, 29, 72, 0.28)',
    badge: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/15',
      border: 'border-rose-500/25 dark:border-rose-500/35',
      text: 'text-rose-800 dark:text-rose-300',
      dot: 'bg-[#E11D48]'
    },
    pill: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200/80 dark:border-rose-800/50',
      text: 'text-rose-800 dark:text-rose-300',
      activeBg: 'bg-[#E11D48] text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-rose-500/40',
      bgHover: 'hover:bg-rose-500/[0.03]',
      glow: 'shadow-rose-500/10',
      accentText: 'text-rose-600 dark:text-rose-400'
    },
    button: {
      primary: 'bg-[#E11D48] hover:bg-rose-600 text-white shadow-rose-500/20',
      outline: 'border-rose-500/30 text-rose-700 dark:text-rose-300 hover:bg-rose-500/10'
    },
    gradient: 'from-[#E11D48] via-rose-500 to-red-600'
  },

  'Western Africa': {
    id: 'Western Africa',
    m49Code: '011',
    unBaseColor: '#00FF00', // Canonical UN Base (Green)
    displayName: 'Western Africa',
    shortName: 'West',
    cssVarKey: 'western',
    onSolidText: '#FFFFFF',
    warmAccent: '#34D399',
    lightTint: '#D1FAE5',
    deepTone: '#047857',
    glowRgba: 'rgba(5, 150, 105, 0.25)',
    svgStroke: '#059669',
    svgFillOpacity: 0.12,
    svgFillOpacityActive: 0.35,
    svgFillRgba: 'rgba(5, 150, 105, 0.08)',
    svgFillActiveRgba: 'rgba(5, 150, 105, 0.28)',
    badge: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      border: 'border-emerald-500/25 dark:border-emerald-500/35',
      text: 'text-emerald-800 dark:text-emerald-300',
      dot: 'bg-[#059669]'
    },
    pill: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200/80 dark:border-emerald-800/50',
      text: 'text-emerald-800 dark:text-emerald-300',
      activeBg: 'bg-[#059669] text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-emerald-500/40',
      bgHover: 'hover:bg-emerald-500/[0.03]',
      glow: 'shadow-emerald-500/10',
      accentText: 'text-emerald-600 dark:text-emerald-400'
    },
    button: {
      primary: 'bg-[#059669] hover:bg-emerald-600 text-white shadow-emerald-500/20',
      outline: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10'
    },
    gradient: 'from-[#059669] via-teal-500 to-emerald-600'
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
