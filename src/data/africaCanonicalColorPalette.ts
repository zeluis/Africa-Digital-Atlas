/**
 * africaCanonicalColorPalette.ts
 * 
 * Canonical Single Source of Truth (SSOT) for Africa Countries, Territories,
 * and Admin-1 Subdivisions color assignments based on the authoritative M49 palette.
 */

import canonicalColorsData from './africaCanonicalColors.json';

export interface CanonicalColorGroup {
  label: string;
  paths: string[];
}

export interface CanonicalColorPaletteData {
  title: string;
  groups: Record<string, CanonicalColorGroup>;
}

export const CANONICAL_PALETTE_DATA: CanonicalColorPaletteData = canonicalColorsData as CanonicalColorPaletteData;

// Country Name / ISO aliases to canonical Hex
export const COUNTRY_CANONICAL_HEX: Record<string, string> = {};

// Specific Admin-1 SVG Path ID to canonical Hex
export const PATH_CANONICAL_HEX: Record<string, string> = {};

// Map of canonical country names to their ISO3 / ISO2 codes
export const CANONICAL_LABEL_TO_ISO3: Record<string, string> = {
  "Algeria": "DZA",
  "Angola": "AGO",
  "Benin": "BEN",
  "Botswana": "BWA",
  "Burkina Faso": "BFA",
  "Burundi": "BDI",
  "Cameroon": "CMR",
  "Cape Verde": "CPV",
  "Central African Republic": "CAF",
  "Chad": "TCD",
  "Comoros": "COM",
  "Congo": "COG",
  "Cote d'Ivoire": "CIV",
  "Djibouti": "DJI",
  "DR Congo": "COD",
  "Egypt": "EGY",
  "Equatorial Guinea": "GNQ",
  "Eritrea": "ERI",
  "Eswatini": "SWZ",
  "Ethiopia": "ETH",
  "France": "FRA",
  "French Southern Territories": "ATF",
  "Gabon": "GAB",
  "Gambia": "GMB",
  "Ghana": "GHA",
  "Guinea": "GIN",
  "Guinea Bissau": "GNB",
  "Kenya": "KEN",
  "Lesotho": "LSO",
  "Liberia": "LBR",
  "Libya": "LBY",
  "Madagascar": "MDG",
  "Malawi": "MWI",
  "Mali": "MLI",
  "Mauritania": "MRT",
  "Mauritius": "MUS",
  "Morocco": "MAR",
  "Mozambique": "MOZ",
  "Namibia": "NAM",
  "Niger": "NER",
  "Nigeria": "NGA",
  "Rwanda": "RWA",
  "Saint Helena": "SHN",
  "Sao Tome and Principe": "STP",
  "Senegal": "SEN",
  "Seychelles": "SYC",
  "Sierra Leone": "SLE",
  "Somalia": "SOM",
  "South Africa": "ZAF",
  "South Sudan": "SSD",
  "Spain": "ESP",
  "Sudan": "SDN",
  "Tanzania": "TZA",
  "Togo": "TGO",
  "Tunisia": "TUN",
  "Uganda": "UGA",
  "Western Sahara": "ESH",
  "Zambia": "ZMB",
  "Zimbabwe": "ZWE",
  "Abyei": "QSY",
  "Somaliland": "SOM_SL"
};

// Additional country aliases
export const ISO3_ALIASES: Record<string, string> = {
  "DZA": "#41b6c4",
  "AGO": "#fc2ae8",
  "BEN": "#bef870",
  "BWA": "#fd8d3c",
  "BFA": "#a0f60e",
  "BDI": "#ffeb33",
  "CMR": "#f8b3f4",
  "CPV": "#81dc05",
  "CAF": "#ff8bdc",
  "TCD": "#fdd1fa",
  "COM": "#fdb462",
  "COG": "#f781bf",
  "CIV": "#73af48",
  "DJI": "#fed976",
  "COD": "#e793e3",
  "EGY": "#023cf8",
  "GNQ": "#f7ddf6",
  "ERI": "#f9e565",
  "SWZ": "#fbdcd4",
  "ETH": "#fdae61",
  "FRA": "#ff7f00",
  "REU": "#ff7f00",
  "MYT": "#ff7f00",
  "ATF": "#60e6bb",
  "GAB": "#f389e5",
  "GMB": "#33a02c",
  "GHA": "#7bfc36",
  "GIN": "#c1fd09",
  "GNB": "#4daf4a",
  "KEN": "#fabd04",
  "LSO": "#fa898a",
  "LBR": "#65eb9b",
  "LBY": "#6de0e7",
  "MDG": "#fad031",
  "MWI": "#e3ce4c",
  "MLI": "#7ef646",
  "MRT": "#b3e571",
  "MUS": "#f8e953",
  "MAR": "#74add1",
  "MOZ": "#fbcd52",
  "NAM": "#fb9782",
  "NER": "#86d22e",
  "NGA": "#42d003",
  "RWA": "#f1bb0f",
  "SHN": "#fcc7fa",
  "STP": "#feaff9",
  "SEN": "#3ef33e",
  "SYC": "#e9d122",
  "SLE": "#b1df14",
  "SOM": "#f2d15a",
  "ZAF": "#fc4e2a",
  "SSD": "#fae594",
  "ESP": "#95fdde",
  "SDN": "#4eb3d3",
  "TZA": "#fdbf6f",
  "TGO": "#a7e23c",
  "TUN": "#7bccc4",
  "UGA": "#fee090",
  "ESH": "#3690c0",
  "ZMB": "#fded7c",
  "ZWE": "#f8de5e",
  "QSY": "#ffff00",
  "QS": "#ffff00",
  "SOM_SL": "#fff626",
  "XS": "#fff626"
};

// Populate the lookup tables
for (const [hex, group] of Object.entries(CANONICAL_PALETTE_DATA.groups)) {
  COUNTRY_CANONICAL_HEX[group.label.toLowerCase()] = hex;
  const iso3 = CANONICAL_LABEL_TO_ISO3[group.label];
  if (iso3) {
    COUNTRY_CANONICAL_HEX[iso3.toUpperCase()] = hex;
  }

  for (const pathId of group.paths) {
    PATH_CANONICAL_HEX[pathId] = hex;
    PATH_CANONICAL_HEX[pathId.toLowerCase()] = hex;
    
    // Extract country ISO2 suffix (e.g. "_DZ" from "Oran_DZ")
    const match = pathId.match(/_([A-Z]{2})$/);
    if (match) {
      const iso2 = match[1];
      if (!COUNTRY_CANONICAL_HEX[iso2]) {
        COUNTRY_CANONICAL_HEX[iso2] = hex;
      }
    }
  }
}

// Ensure all ISO3 aliases are registered
for (const [iso3, hex] of Object.entries(ISO3_ALIASES)) {
  COUNTRY_CANONICAL_HEX[iso3.toUpperCase()] = hex;
  COUNTRY_CANONICAL_HEX[iso3.toLowerCase()] = hex;
}

/**
 * Get the authoritative canonical color for any Country (by ISO3, ISO2, or full Name)
 */
export function getCanonicalCountryColor(countryIdOrName: string): string {
  if (!countryIdOrName) return '#10b981';
  
  const clean = countryIdOrName.trim();
  const upper = clean.toUpperCase();
  const lower = clean.toLowerCase();

  if (COUNTRY_CANONICAL_HEX[upper]) return COUNTRY_CANONICAL_HEX[upper];
  if (COUNTRY_CANONICAL_HEX[lower]) return COUNTRY_CANONICAL_HEX[lower];
  if (ISO3_ALIASES[upper]) return ISO3_ALIASES[upper];

  // Try matching partial name
  for (const [name, hex] of Object.entries(COUNTRY_CANONICAL_HEX)) {
    if (lower.includes(name) || name.includes(lower)) {
      return hex;
    }
  }

  return '#10b981';
}

/**
 * Get the authoritative canonical color for an Admin-1 SVG path ID
 */
export function getCanonicalAdmin1PathColor(pathId: string, fallbackCountryId?: string): string {
  if (pathId && PATH_CANONICAL_HEX[pathId]) {
    return PATH_CANONICAL_HEX[pathId];
  }
  if (pathId && PATH_CANONICAL_HEX[pathId.toLowerCase()]) {
    return PATH_CANONICAL_HEX[pathId.toLowerCase()];
  }
  if (fallbackCountryId) {
    return getCanonicalCountryColor(fallbackCountryId);
  }
  return '#10b981';
}

/**
 * Resolves color with WCAG-compliant on-solid text contrast
 */
export function getCanonicalContrastText(hexColor: string): '#111827' | '#FFFFFF' {
  const hex = hexColor.replace('#', '');
  if (hex.length < 6) return '#111827';
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  return luminance > 0.4 ? '#111827' : '#FFFFFF';
}
