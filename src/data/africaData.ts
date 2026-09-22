/**
 * africaData.ts - UN Geoscheme Regional Data and Geographic Structure for Africa
 * Standardized according to UN M49 Geoscheme & African Union Frameworks
 */

import { AfricanRegion } from './types';

export interface UnGeoschemeRegionData {
  id: AfricanRegion;
  code: string; // UN M49 code
  name: string;
  shortName: string;
  memberCountries: string[]; // ISO3
  palette: {
    primary: string;
    light: string;
    dark: string;
    glow: string;
    bgBadge: string;
    borderBadge: string;
    textAccent: string;
  };
  economicBlocs: string[];
  headquarters?: string;
  description: string;
}

export const UN_REGIONS: AfricanRegion[] = [
  'Northern Africa',
  'Western Africa',
  'Central Africa',
  'Eastern Africa',
  'Southern Africa'
];

export const REGION_META: Record<AfricanRegion, {
  name: AfricanRegion;
  shortName: string;
  color: string;
  lightColor: string;
  darkColor: string;
  glow: string;
  desc: string;
}> = {
  'Northern Africa': {
    name: 'Northern Africa',
    shortName: 'North',
    color: '#1802FF', // Strict Brand Color (Pure Blue)
    lightColor: '#4B5EFC',
    darkColor: '#1E1B4B',
    glow: 'rgba(24, 2, 255, 0.35)',
    desc: 'Mediterranean and Saharan economies with strategic energy corridors.'
  },
  'Western Africa': {
    name: 'Western Africa',
    shortName: 'West',
    color: '#00FF00', // Strict Brand Color (Neon Green)
    lightColor: '#33FF33',
    darkColor: '#065F46',
    glow: 'rgba(0, 255, 0, 0.35)',
    desc: 'Dynamic demographic powerhouse led by ECOWAS and Atlantic trade hubs.'
  },
  'Central Africa': {
    name: 'Central Africa',
    shortName: 'Central',
    color: '#FF00FE', // Strict Brand Color (Magenta / Fuchsia)
    lightColor: '#FF55FE',
    darkColor: '#86198F',
    glow: 'rgba(255, 0, 254, 0.35)',
    desc: 'Congo Basin ecological sanctuary and critical mineral reserves.'
  },
  'Eastern Africa': {
    name: 'Eastern Africa',
    shortName: 'East',
    color: '#FFA500', // Strict Brand Color (Orange)
    lightColor: '#FFB84A',
    darkColor: '#C2410C',
    glow: 'rgba(255, 165, 0, 0.35)',
    desc: 'Fastest growing regional integration bloc (EAC) and Indian Ocean trade.'
  },
  'Southern Africa': {
    name: 'Southern Africa',
    shortName: 'South',
    color: '#FF0A0A', // Strict Brand Color (Pure Red)
    lightColor: '#FF4D4D',
    darkColor: '#991B1B',
    glow: 'rgba(255, 10, 10, 0.35)',
    desc: 'Advanced industrial, mining, and financial corridor centered on SADC.'
  }
};

export const UN_GEOSCHEME_REGIONS: Record<AfricanRegion, UnGeoschemeRegionData> = {
  'Northern Africa': {
    id: 'Northern Africa',
    code: '015',
    name: 'Northern Africa',
    shortName: 'North',
    memberCountries: ['DZA', 'EGY', 'LBY', 'MAR', 'SDN', 'TUN', 'ESH'],
    palette: {
      primary: '#1802FF', // Strict Brand Pure Blue
      light: '#4B5EFC',
      dark: '#1E1B4B',
      glow: 'rgba(24, 2, 255, 0.30)',
      bgBadge: 'bg-blue-500/10 dark:bg-blue-950/40',
      borderBadge: 'border-blue-500/25 dark:border-blue-700/40',
      textAccent: 'text-blue-700 dark:text-blue-400'
    },
    economicBlocs: ['AMU', 'COMESA', 'AfCFTA'],
    headquarters: 'Rabat / Cairo',
    description: 'Mediterranean and Saharan economies characterized by maritime trade corridors, hydrocarbon wealth, renewable solar energy, and rich ancient cultural heritage.'
  },
  'Western Africa': {
    id: 'Western Africa',
    code: '011',
    name: 'Western Africa',
    shortName: 'West',
    memberCountries: ['BEN', 'BFA', 'CPV', 'CIV', 'GMB', 'GHA', 'GIN', 'GNB', 'LBR', 'MLI', 'MRT', 'NER', 'NGA', 'SEN', 'SLE', 'TGO'],
    palette: {
      primary: '#00FF00', // Strict Brand Neon Green
      light: '#33FF33',
      dark: '#065F46',
      glow: 'rgba(0, 255, 0, 0.30)',
      bgBadge: 'bg-emerald-500/10 dark:bg-emerald-950/40',
      borderBadge: 'border-emerald-500/25 dark:border-emerald-700/40',
      textAccent: 'text-emerald-700 dark:text-emerald-400'
    },
    economicBlocs: ['ECOWAS', 'WAEMU', 'AfCFTA'],
    headquarters: 'Abuja, Nigeria',
    description: 'Dynamic demographic powerhouse led by ECOWAS, spanning Atlantic coastal hubs, Sahelian agricultural belts, fintech innovation, and mining resources.'
  },
  'Central Africa': {
    id: 'Central Africa',
    code: '017',
    name: 'Central Africa',
    shortName: 'Central',
    memberCountries: ['AGO', 'CMR', 'CAF', 'TCD', 'COG', 'COD', 'GNQ', 'GAB', 'STP'],
    palette: {
      primary: '#FF00FE', // Strict Brand Magenta / Fuchsia
      light: '#FF55FE',
      dark: '#86198F',
      glow: 'rgba(255, 0, 254, 0.30)',
      bgBadge: 'bg-fuchsia-500/10 dark:bg-fuchsia-950/40',
      borderBadge: 'border-fuchsia-500/25 dark:border-fuchsia-700/40',
      textAccent: 'text-fuchsia-700 dark:text-fuchsia-400'
    },
    economicBlocs: ['ECCAS', 'CEMAC', 'AfCFTA'],
    headquarters: 'Libreville, Gabon',
    description: 'The Congo Basin ecological lung of the planet, rich in critical minerals, hydropower potential, timber reserves, and strategic maritime logistics.'
  },
  'Eastern Africa': {
    id: 'Eastern Africa',
    code: '014',
    name: 'Eastern Africa',
    shortName: 'East',
    memberCountries: ['BDI', 'COM', 'DJI', 'ERI', 'ETH', 'KEN', 'MDG', 'MWI', 'MUS', 'MOZ', 'RWA', 'SYC', 'SOM', 'SSD', 'TZA', 'UGA', 'ZMB', 'ZWE'],
    palette: {
      primary: '#FFA500', // Strict Brand Orange
      light: '#FFB84A',
      dark: '#C2410C',
      glow: 'rgba(255, 165, 0, 0.30)',
      bgBadge: 'bg-orange-500/10 dark:bg-orange-950/40',
      borderBadge: 'border-orange-500/25 dark:border-orange-700/40',
      textAccent: 'text-orange-700 dark:text-orange-400'
    },
    economicBlocs: ['EAC', 'COMESA', 'IGAD', 'AfCFTA'],
    headquarters: 'Arusha / Nairobi / Addis Ababa',
    description: 'Rapidly growing East African Community and Horn of Africa economic corridors, mobile financial innovation, geothermal energy, and Indian Ocean trade.'
  },
  'Southern Africa': {
    id: 'Southern Africa',
    code: '018',
    name: 'Southern Africa',
    shortName: 'South',
    memberCountries: ['BWA', 'SWZ', 'LSO', 'NAM', 'ZAF'],
    palette: {
      primary: '#FF0A0A', // Strict Brand Red
      light: '#FF4D4D',
      dark: '#991B1B',
      glow: 'rgba(255, 10, 10, 0.30)',
      bgBadge: 'bg-red-500/10 dark:bg-red-950/40',
      borderBadge: 'border-red-500/25 dark:border-red-700/40',
      textAccent: 'text-rose-700 dark:text-rose-400'
    },
    economicBlocs: ['SADC', 'SACU', 'AfCFTA'],
    headquarters: 'Gaborone / Pretoria',
    description: 'Advanced industrial and financial hub centered around SADC and SACU, featuring deep capital markets, mineral value chains, platinum group metals, and automotive manufacturing.'
  }
};

export const REGIONS_DATA: Record<AfricanRegion, {
  name: AfricanRegion;
  countries: number;
  members: string[];
  largestEconomy: string;
  climateProfile: string;
  totalPopM: number;
  totalGdpB: number;
}> = {
  'Northern Africa': {
    name: 'Northern Africa',
    countries: 7,
    members: ['DZA', 'EGY', 'LBY', 'MAR', 'SDN', 'TUN', 'ESH'],
    largestEconomy: 'Egypt ($393B)',
    climateProfile: 'Arid Saharan & Mediterranean',
    totalPopM: 260.4,
    totalGdpB: 890.5
  },
  'Western Africa': {
    name: 'Western Africa',
    countries: 16,
    members: ['BEN', 'BFA', 'CPV', 'CIV', 'GMB', 'GHA', 'GIN', 'GNB', 'LBR', 'MLI', 'MRT', 'NER', 'NGA', 'SEN', 'SLE', 'TGO'],
    largestEconomy: 'Nigeria ($374B)',
    climateProfile: 'Tropical Monsoon, Guinean & Sahelian',
    totalPopM: 440.8,
    totalGdpB: 760.2
  },
  'Central Africa': {
    name: 'Central Africa',
    countries: 9,
    members: ['AGO', 'CMR', 'CAF', 'TCD', 'COG', 'COD', 'GNQ', 'GAB', 'STP'],
    largestEconomy: 'Angola ($93B)',
    climateProfile: 'Equatorial Rainforest & Savanna',
    totalPopM: 195.6,
    totalGdpB: 245.8
  },
  'Eastern Africa': {
    name: 'Eastern Africa',
    countries: 18,
    members: ['BDI', 'COM', 'DJI', 'ERI', 'ETH', 'KEN', 'MDG', 'MWI', 'MUS', 'MOZ', 'RWA', 'SYC', 'SOM', 'SSD', 'TZA', 'UGA', 'ZMB', 'ZWE'],
    largestEconomy: 'Ethiopia ($163B) / Kenya ($112B)',
    climateProfile: 'Great Rift Valley, Highlands & Swahili Coast',
    totalPopM: 485.2,
    totalGdpB: 430.4
  },
  'Southern Africa': {
    name: 'Southern Africa',
    countries: 5,
    members: ['BWA', 'SWZ', 'LSO', 'NAM', 'ZAF'],
    largestEconomy: 'South Africa ($377B)',
    climateProfile: 'Subtropical, Semi-Arid Karoo & Highveld',
    totalPopM: 70.2,
    totalGdpB: 445.6
  }
};

export const COUNTRIES_DATA: Record<string, {
  id: string;
  name: string;
  pop: string;
  gdp: string;
  capital: string;
  region: AfricanRegion;
}> = {
  NGA: { id: 'NGA', name: 'Nigeria', pop: '223.8M', gdp: '$374.9B', capital: 'Abuja', region: 'Western Africa' },
  ETH: { id: 'ETH', name: 'Ethiopia', pop: '126.5M', gdp: '$163.7B', capital: 'Addis Ababa', region: 'Eastern Africa' },
  EGY: { id: 'EGY', name: 'Egypt', pop: '112.7M', gdp: '$393.6B', capital: 'Cairo', region: 'Northern Africa' },
  COD: { id: 'COD', name: 'DR Congo', pop: '102.2M', gdp: '$69.8B', capital: 'Kinshasa', region: 'Central Africa' },
  TZA: { id: 'TZA', name: 'Tanzania', pop: '67.4M', gdp: '$79.2B', capital: 'Dodoma', region: 'Eastern Africa' },
  ZAF: { id: 'ZAF', name: 'South Africa', pop: '60.4M', gdp: '$377.8B', capital: 'Pretoria', region: 'Southern Africa' },
  KEN: { id: 'KEN', name: 'Kenya', pop: '55.1M', gdp: '$112.7B', capital: 'Nairobi', region: 'Eastern Africa' },
  UGA: { id: 'UGA', name: 'Uganda', pop: '48.5M', gdp: '$49.3B', capital: 'Kampala', region: 'Eastern Africa' },
  SDN: { id: 'SDN', name: 'Sudan', pop: '48.1M', gdp: '$32.8B', capital: 'Khartoum', region: 'Northern Africa' },
  DZA: { id: 'DZA', name: 'Algeria', pop: '45.6M', gdp: '$244.7B', capital: 'Algiers', region: 'Northern Africa' },
  MAR: { id: 'MAR', name: 'Morocco', pop: '37.8M', gdp: '$147.3B', capital: 'Rabat', region: 'Northern Africa' },
  AGO: { id: 'AGO', name: 'Angola', pop: '36.6M', gdp: '$93.8B', capital: 'Luanda', region: 'Central Africa' },
  GHA: { id: 'GHA', name: 'Ghana', pop: '34.1M', gdp: '$76.4B', capital: 'Accra', region: 'Western Africa' },
  MOZ: { id: 'MOZ', name: 'Mozambique', pop: '33.8M', gdp: '$20.6B', capital: 'Maputo', region: 'Eastern Africa' },
  MDG: { id: 'MDG', name: 'Madagascar', pop: '30.3M', gdp: '$15.9B', capital: 'Antananarivo', region: 'Eastern Africa' },
  CIV: { id: 'CIV', name: "Côte d'Ivoire", pop: '29.3M', gdp: '$78.8B', capital: 'Yamoussoukro', region: 'Western Africa' },
  CMR: { id: 'CMR', name: 'Cameroon', pop: '28.6M', gdp: '$47.9B', capital: 'Yaoundé', region: 'Central Africa' },
  NER: { id: 'NER', name: 'Niger', pop: '27.2M', gdp: '$16.8B', capital: 'Niamey', region: 'Western Africa' },
  MLI: { id: 'MLI', name: 'Mali', pop: '23.2M', gdp: '$20.9B', capital: 'Bamako', region: 'Western Africa' },
  BFA: { id: 'BFA', name: 'Burkina Faso', pop: '23.2M', gdp: '$20.3B', capital: 'Ouagadougou', region: 'Western Africa' },
  MWI: { id: 'MWI', name: 'Malawi', pop: '20.9M', gdp: '$13.1B', capital: 'Lilongwe', region: 'Eastern Africa' },
  ZMB: { id: 'ZMB', name: 'Zambia', pop: '20.5M', gdp: '$28.2B', capital: 'Lusaka', region: 'Eastern Africa' },
  TCD: { id: 'TCD', name: 'Chad', pop: '18.2M', gdp: '$13.1B', capital: "N'Djamena", region: 'Central Africa' },
  SOM: { id: 'SOM', name: 'Somalia', pop: '18.1M', gdp: '$11.5B', capital: 'Mogadishu', region: 'Eastern Africa' },
  SEN: { id: 'SEN', name: 'Senegal', pop: '17.7M', gdp: '$31.0B', capital: 'Dakar', region: 'Western Africa' },
  ZWE: { id: 'ZWE', name: 'Zimbabwe', pop: '16.6M', gdp: '$27.4B', capital: 'Harare', region: 'Eastern Africa' },
  GIN: { id: 'GIN', name: 'Guinea', pop: '14.1M', gdp: '$23.2B', capital: 'Conakry', region: 'Western Africa' },
  RWA: { id: 'RWA', name: 'Rwanda', pop: '14.0M', gdp: '$14.1B', capital: 'Kigali', region: 'Eastern Africa' },
  BEN: { id: 'BEN', name: 'Benin', pop: '13.7M', gdp: '$19.7B', capital: 'Porto-Novo', region: 'Western Africa' },
  BDI: { id: 'BDI', name: 'Burundi', pop: '13.2M', gdp: '$3.1B', capital: 'Gitega', region: 'Eastern Africa' },
  TUN: { id: 'TUN', name: 'Tunisia', pop: '12.4M', gdp: '$48.5B', capital: 'Tunis', region: 'Northern Africa' },
  SSD: { id: 'SSD', name: 'South Sudan', pop: '11.0M', gdp: '$7.3B', capital: 'Juba', region: 'Eastern Africa' },
  TGO: { id: 'TGO', name: 'Togo', pop: '9.0M', gdp: '$9.1B', capital: 'Lomé', region: 'Western Africa' },
  SLE: { id: 'SLE', name: 'Sierra Leone', pop: '8.7M', gdp: '$4.1B', capital: 'Freetown', region: 'Western Africa' },
  LBY: { id: 'LBY', name: 'Libya', pop: '6.8M', gdp: '$45.8B', capital: 'Tripoli', region: 'Northern Africa' },
  COG: { id: 'COG', name: 'Congo', pop: '6.1M', gdp: '$15.3B', capital: 'Brazzaville', region: 'Central Africa' },
  CAF: { id: 'CAF', name: 'Central African Republic', pop: '5.7M', gdp: '$2.6B', capital: 'Bangui', region: 'Central Africa' },
  LBR: { id: 'LBR', name: 'Liberia', pop: '5.4M', gdp: '$4.3B', capital: 'Monrovia', region: 'Western Africa' },
  MRT: { id: 'MRT', name: 'Mauritania', pop: '4.8M', gdp: '$10.4B', capital: 'Nouakchott', region: 'Western Africa' },
  ERI: { id: 'ERI', name: 'Eritrea', pop: '3.7M', gdp: '$2.4B', capital: 'Asmara', region: 'Eastern Africa' },
  NAM: { id: 'NAM', name: 'Namibia', pop: '2.6M', gdp: '$12.6B', capital: 'Windhoek', region: 'Southern Africa' },
  GMB: { id: 'GMB', name: 'Gambia', pop: '2.7M', gdp: '$2.3B', capital: 'Banjul', region: 'Western Africa' },
  BWA: { id: 'BWA', name: 'Botswana', pop: '2.6M', gdp: '$20.4B', capital: 'Gaborone', region: 'Southern Africa' },
  GNB: { id: 'GNB', name: 'Guinea-Bissau', pop: '2.1M', gdp: '$2.0B', capital: 'Bissau', region: 'Western Africa' },
  GAB: { id: 'GAB', name: 'Gabon', pop: '2.4M', gdp: '$20.5B', capital: 'Libreville', region: 'Central Africa' },
  LSO: { id: 'LSO', name: 'Lesotho', pop: '2.3M', gdp: '$2.4B', capital: 'Maseru', region: 'Southern Africa' },
  GNQ: { id: 'GNQ', name: 'Equatorial Guinea', pop: '1.7M', gdp: '$12.1B', capital: 'Malabo', region: 'Central Africa' },
  MUS: { id: 'MUS', name: 'Mauritius', pop: '1.3M', gdp: '$14.4B', capital: 'Port Louis', region: 'Eastern Africa' },
  SWZ: { id: 'SWZ', name: 'Eswatini', pop: '1.2M', gdp: '$4.8B', capital: 'Mbabane', region: 'Southern Africa' },
  DJI: { id: 'DJI', name: 'Djibouti', pop: '1.1M', gdp: '$3.7B', capital: 'Djibouti City', region: 'Eastern Africa' },
  COM: { id: 'COM', name: 'Comoros', pop: '0.85M', gdp: '$1.3B', capital: 'Moroni', region: 'Eastern Africa' },
  CPV: { id: 'CPV', name: 'Cabo Verde', pop: '0.59M', gdp: '$2.6B', capital: 'Praia', region: 'Western Africa' },
  STP: { id: 'STP', name: 'São Tomé and Príncipe', pop: '0.23M', gdp: '$0.54B', capital: 'São Tomé', region: 'Central Africa' },
  SYC: { id: 'SYC', name: 'Seychelles', pop: '0.10M', gdp: '$2.1B', capital: 'Victoria', region: 'Eastern Africa' },
  ESH: { id: 'ESH', name: 'Western Sahara', pop: '0.58M', gdp: '$0.9B', capital: 'Laayoune', region: 'Northern Africa' },
  XSL: { id: 'XSL', name: 'Somaliland', pop: '5.7M', gdp: '$3.4B', capital: 'Hargeisa', region: 'Eastern Africa' }
};

/**
 * Format compact number helper
 */
export const formatCompactNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toLocaleString();
};

/**
 * Format currency helper
 */
export const formatCurrency = (num: number | null | undefined): string => {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return `$${num.toLocaleString()}`;
};

/**
 * Parse number string helper
 */
export const parseNumberString = (val: any): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const str = String(val).trim().toUpperCase();
  if (str.endsWith('T')) return parseFloat(str) * 1e12;
  if (str.endsWith('B')) return parseFloat(str) * 1e9;
  if (str.endsWith('M')) return parseFloat(str) * 1e6;
  if (str.endsWith('K')) return parseFloat(str) * 1e3;
  const clean = str.replace(/[^0-9.-]/g, '');
  return parseFloat(clean) || 0;
};

/**
 * Get UN Geoscheme region definition by country ISO3
 */
export const getUnRegionByCountry = (entityId: string): UnGeoschemeRegionData | undefined => {
  const norm = entityId.toUpperCase();
  for (const region of Object.values(UN_GEOSCHEME_REGIONS)) {
    if (region.memberCountries.includes(norm)) {
      return region;
    }
  }
  return undefined;
};

/**
 * Get color for UN Geoscheme region
 */
export const getUnRegionColor = (regionName: AfricanRegion | string): string => {
  const reg = UN_GEOSCHEME_REGIONS[regionName as AfricanRegion];
  return reg ? reg.palette.primary : '#10b981';
};
