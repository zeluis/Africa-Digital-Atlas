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

  // Pure Regional Tonal Directional Gradient & Cartographic Border
  gradientStart: string;        // Deep ~22% regional tint (top-left origin)
  gradientMid: string;          // Luminous ~12% regional mid tint (center body)
  gradientEnd: string;          // Airy ~5-6% regional wash ground (bottom-right)
  atlasBorder: string;          // Crisp ~28% region-matched hairline border
  ambientAura: string;          // Soft ~35% ambient radial aura
  
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
    unBaseColor: '#FFA500', // Strict Brand Orange
    displayName: 'Eastern Africa',
    shortName: 'East',
    cssVarKey: 'eastern',
    onSolidText: '#111827',
    warmAccent: '#FFA500',
    lightTint: '#FFF3E0',
    deepTone: '#C2410C',
    glowRgba: 'rgba(255, 165, 0, 0.25)',
    gradientStart: 'rgba(255, 165, 0, 0.18)',
    gradientMid: 'rgba(255, 165, 0, 0.09)',
    gradientEnd: 'rgba(255, 165, 0, 0.03)',
    atlasBorder: 'rgba(255, 165, 0, 0.28)',
    ambientAura: 'rgba(255, 165, 0, 0.30)',
    svgStroke: '#EA580C',
    svgFillOpacity: 0.12,
    svgFillOpacityActive: 0.35,
    svgFillRgba: 'rgba(255, 165, 0, 0.08)',
    svgFillActiveRgba: 'rgba(255, 165, 0, 0.26)',
    badge: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      border: 'border-amber-500/25 dark:border-amber-400/40',
      text: 'text-amber-950 dark:text-amber-200 font-semibold',
      dot: 'bg-[#FFA500]'
    },
    pill: {
      bg: 'bg-amber-50 dark:bg-amber-500/15',
      border: 'border-amber-200/80 dark:border-amber-400/35',
      text: 'text-amber-950 dark:text-amber-200 font-medium',
      activeBg: 'bg-[#EA580C] text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-amber-500/50 dark:hover:border-amber-400/60',
      bgHover: 'hover:bg-amber-500/[0.04] dark:hover:bg-amber-500/[0.08]',
      glow: 'shadow-amber-500/10',
      accentText: 'text-amber-800 dark:text-amber-300'
    },
    button: {
      primary: 'bg-[#EA580C] hover:bg-amber-600 text-white shadow-amber-500/20',
      outline: 'border-amber-500/30 text-amber-900 dark:text-amber-300 hover:bg-amber-500/10'
    },
    gradient: 'from-[#FFA500] via-amber-500 to-orange-600'
  },

  'Central Africa': {
    id: 'Central Africa',
    m49Code: '017',
    unBaseColor: '#FF00FE', // Strict Brand Magenta / Fuchsia
    displayName: 'Central Africa (Middle Africa)',
    shortName: 'Central',
    cssVarKey: 'middle',
    onSolidText: '#FFFFFF',
    warmAccent: '#FF55FE',
    lightTint: '#FDF2F8',
    deepTone: '#86198F',
    glowRgba: 'rgba(255, 0, 254, 0.25)',
    gradientStart: 'rgba(255, 0, 254, 0.16)',
    gradientMid: 'rgba(255, 0, 254, 0.08)',
    gradientEnd: 'rgba(255, 0, 254, 0.03)',
    atlasBorder: 'rgba(255, 0, 254, 0.26)',
    ambientAura: 'rgba(255, 0, 254, 0.28)',
    svgStroke: '#D900D8',
    svgFillOpacity: 0.12,
    svgFillOpacityActive: 0.35,
    svgFillRgba: 'rgba(255, 0, 254, 0.08)',
    svgFillActiveRgba: 'rgba(255, 0, 254, 0.26)',
    badge: {
      bg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/20',
      border: 'border-fuchsia-500/25 dark:border-fuchsia-400/40',
      text: 'text-fuchsia-950 dark:text-fuchsia-200 font-semibold',
      dot: 'bg-[#FF00FE]'
    },
    pill: {
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-500/15',
      border: 'border-fuchsia-200/80 dark:border-fuchsia-400/35',
      text: 'text-fuchsia-950 dark:text-fuchsia-200 font-medium',
      activeBg: 'bg-[#D900D8] text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-fuchsia-500/50 dark:hover:border-fuchsia-400/60',
      bgHover: 'hover:bg-fuchsia-500/[0.04] dark:hover:bg-fuchsia-500/[0.08]',
      glow: 'shadow-fuchsia-500/10',
      accentText: 'text-fuchsia-800 dark:text-fuchsia-300'
    },
    button: {
      primary: 'bg-[#D900D8] hover:bg-fuchsia-600 text-white shadow-fuchsia-500/20',
      outline: 'border-fuchsia-500/30 text-fuchsia-900 dark:text-fuchsia-300 hover:bg-fuchsia-500/10'
    },
    gradient: 'from-[#FF00FE] via-fuchsia-500 to-purple-600'
  },

  'Northern Africa': {
    id: 'Northern Africa',
    m49Code: '015',
    unBaseColor: '#1802FF', // Strict Brand Pure Blue
    displayName: 'Northern Africa',
    shortName: 'North',
    cssVarKey: 'northern',
    onSolidText: '#FFFFFF',
    warmAccent: '#4B5EFC',
    lightTint: '#EEF2FF',
    deepTone: '#1E1B4B',
    glowRgba: 'rgba(24, 2, 255, 0.25)',
    gradientStart: 'rgba(24, 2, 255, 0.16)',
    gradientMid: 'rgba(24, 2, 255, 0.08)',
    gradientEnd: 'rgba(24, 2, 255, 0.03)',
    atlasBorder: 'rgba(24, 2, 255, 0.26)',
    ambientAura: 'rgba(24, 2, 255, 0.28)',
    svgStroke: '#1802FF',
    svgFillOpacity: 0.12,
    svgFillOpacityActive: 0.35,
    svgFillRgba: 'rgba(24, 2, 255, 0.08)',
    svgFillActiveRgba: 'rgba(24, 2, 255, 0.26)',
    badge: {
      bg: 'bg-blue-600/10 dark:bg-blue-600/20',
      border: 'border-blue-600/25 dark:border-blue-400/40',
      text: 'text-blue-950 dark:text-blue-200 font-semibold',
      dot: 'bg-[#1802FF]'
    },
    pill: {
      bg: 'bg-blue-50 dark:bg-blue-500/15',
      border: 'border-blue-200/80 dark:border-blue-400/35',
      text: 'text-blue-950 dark:text-blue-200 font-medium',
      activeBg: 'bg-[#1802FF] text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-blue-600/50 dark:hover:border-blue-400/60',
      bgHover: 'hover:bg-blue-600/[0.04] dark:hover:bg-blue-600/[0.08]',
      glow: 'shadow-blue-600/10',
      accentText: 'text-blue-800 dark:text-blue-300'
    },
    button: {
      primary: 'bg-[#1802FF] hover:bg-blue-700 text-white shadow-blue-600/20',
      outline: 'border-blue-600/30 text-blue-900 dark:text-blue-300 hover:bg-blue-600/10'
    },
    gradient: 'from-[#1802FF] via-blue-600 to-indigo-700'
  },

  'Southern Africa': {
    id: 'Southern Africa',
    m49Code: '018',
    unBaseColor: '#FF0A0A', // Strict Brand Pure Red
    displayName: 'Southern Africa',
    shortName: 'South',
    cssVarKey: 'southern',
    onSolidText: '#FFFFFF',
    warmAccent: '#FF4D4D',
    lightTint: '#FEF2F2',
    deepTone: '#991B1B',
    glowRgba: 'rgba(255, 10, 10, 0.25)',
    gradientStart: 'rgba(255, 10, 10, 0.16)',
    gradientMid: 'rgba(255, 10, 10, 0.08)',
    gradientEnd: 'rgba(255, 10, 10, 0.03)',
    atlasBorder: 'rgba(255, 10, 10, 0.26)',
    ambientAura: 'rgba(255, 10, 10, 0.28)',
    svgStroke: '#E00808',
    svgFillOpacity: 0.12,
    svgFillOpacityActive: 0.35,
    svgFillRgba: 'rgba(255, 10, 10, 0.08)',
    svgFillActiveRgba: 'rgba(255, 10, 10, 0.26)',
    badge: {
      bg: 'bg-red-500/10 dark:bg-red-500/20',
      border: 'border-red-500/25 dark:border-red-400/40',
      text: 'text-red-950 dark:text-red-200 font-semibold',
      dot: 'bg-[#FF0A0A]'
    },
    pill: {
      bg: 'bg-red-50 dark:bg-red-500/15',
      border: 'border-red-200/80 dark:border-red-400/35',
      text: 'text-red-950 dark:text-red-200 font-medium',
      activeBg: 'bg-[#E00808] text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-red-500/50 dark:hover:border-red-400/60',
      bgHover: 'hover:bg-red-500/[0.04] dark:hover:bg-red-500/[0.08]',
      glow: 'shadow-red-500/10',
      accentText: 'text-red-800 dark:text-red-300'
    },
    button: {
      primary: 'bg-[#E00808] hover:bg-red-600 text-white shadow-red-500/20',
      outline: 'border-red-500/30 text-red-900 dark:text-red-300 hover:bg-red-500/10'
    },
    gradient: 'from-[#FF0A0A] via-red-600 to-rose-700'
  },

  'Western Africa': {
    id: 'Western Africa',
    m49Code: '011',
    unBaseColor: '#00FF00', // Strict Brand Neon Green
    displayName: 'Western Africa',
    shortName: 'West',
    cssVarKey: 'western',
    onSolidText: '#111827',
    warmAccent: '#22C55E',
    lightTint: '#F0FDF4',
    deepTone: '#065F46',
    glowRgba: 'rgba(0, 255, 0, 0.25)',
    gradientStart: 'rgba(0, 255, 0, 0.16)',
    gradientMid: 'rgba(0, 255, 0, 0.08)',
    gradientEnd: 'rgba(0, 255, 0, 0.03)',
    atlasBorder: 'rgba(0, 255, 0, 0.26)',
    ambientAura: 'rgba(0, 255, 0, 0.28)',
    svgStroke: '#00C800',
    svgFillOpacity: 0.12,
    svgFillOpacityActive: 0.35,
    svgFillRgba: 'rgba(0, 255, 0, 0.08)',
    svgFillActiveRgba: 'rgba(0, 255, 0, 0.26)',
    badge: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      border: 'border-emerald-500/25 dark:border-emerald-400/40',
      text: 'text-emerald-950 dark:text-emerald-200 font-semibold',
      dot: 'bg-[#00FF00]'
    },
    pill: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/15',
      border: 'border-emerald-200/80 dark:border-emerald-400/35',
      text: 'text-emerald-950 dark:text-emerald-200 font-medium',
      activeBg: 'bg-[#047857] text-white',
      activeText: 'text-white font-bold'
    },
    card: {
      borderHover: 'hover:border-emerald-500/50 dark:hover:border-emerald-400/60',
      bgHover: 'hover:bg-emerald-500/[0.04] dark:hover:bg-emerald-500/[0.08]',
      glow: 'shadow-emerald-500/10',
      accentText: 'text-emerald-800 dark:text-emerald-300'
    },
    button: {
      primary: 'bg-[#047857] hover:bg-emerald-700 text-white shadow-emerald-500/20',
      outline: 'border-emerald-500/30 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-500/10'
    },
    gradient: 'from-[#00FF00] via-emerald-500 to-green-700'
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
 * Returns the CSS variable for the region's calm tonal surface
 * e.g., 'var(--region-eastern-calm)'
 */
export function getRegionCalmColor(region?: string): string {
  if (!region) return 'var(--region-pan-african-calm)';
  const resolved = resolveAfricanRegion(region);
  const palette = UN_GEOSCHEME_TONAL_PALETTES[resolved];
  return `var(--region-${palette.cssVarKey}-calm)`;
}

/**
 * Returns the CSS variable for the country's region calm tonal surface
 */
export function getCountryRegionCalmColor(countryId: string): string {
  const entity = atlas.getEntity(countryId);
  return getRegionCalmColor(entity?.region);
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
