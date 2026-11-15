/**
 * svgGeographySystem.ts - Build-Phase SVG Geography Pipeline & Architecture
 * Standardized according to UN M49 Geoscheme & Natural Earth 50m Geographic Boundaries
 */

import { AfricanRegion } from './types';
import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface M49EntityMetadata {
  iso3: string;
  iso2: string;
  m49Code: string;
  name: string;
  unRegion: AfricanRegion;
  unRegionCode: string;
  shapeType: 'continental' | 'archipelago' | 'island' | 'landlocked' | 'coastal';
  vertexCount: number;
  simplificationMethod: string;
  validationStatus: 'verified' | 'provisional';
  viewBox: string;
  pathLength: number;
}

export interface RegionalSilhouetteData {
  region: AfricanRegion;
  m49Code: string;
  name: string;
  shortName: string;
  viewBox: string;
  primaryPath: string;
  memberIso3: string[];
  centroid: { x: number; y: number };
  palette: {
    primary: string;
    light: string;
    dark: string;
    border: string;
    glow: string;
  };
  keyCapitals: Array<{ name: string; country: string; x: number; y: number }>;
  description: string;
}

// UN M49 Regional Codes
export const UN_M49_REGIONS: Record<AfricanRegion, { code: string; name: string }> = {
  'Northern Africa': { code: '015', name: 'Northern Africa' },
  'Western Africa': { code: '011', name: 'Western Africa' },
  'Central Africa': { code: '017', name: 'Central Africa' },
  'Eastern Africa': { code: '014', name: 'Eastern Africa' },
  'Southern Africa': { code: '018', name: 'Southern Africa' }
};

// Curated UN M49 Numeric Codes for African Nations
export const UN_M49_NUMERIC_CODES: Record<string, string> = {
  DZA: '012', AGO: '024', BEN: '204', BWA: '072', BFA: '854',
  BDI: '108', CPV: '132', CMR: '120', CAF: '140', TCD: '148',
  COM: '174', COG: '178', COD: '180', CIV: '384', DJI: '262',
  EGY: '818', GNQ: '226', ERI: '232', SWZ: '748', ETH: '231',
  GAB: '266', GMB: '270', GHA: '288', GIN: '324', GNB: '624',
  KEN: '404', LSO: '426', LBR: '430', LBY: '434', MDG: '450',
  MWI: '454', MLI: '466', MRT: '478', MUS: '480', MAR: '504',
  MOZ: '508', NAM: '516', NER: '562', NGA: '566', RWA: '646',
  STP: '678', SEN: '686', SYC: '690', SLE: '694', SOM: '706',
  ZAF: '710', SSD: '728', SDN: '729', TZA: '834', TGO: '768',
  TUN: '788', UGA: '800', ESH: '732', ZMB: '894', ZWE: '716'
};

const regionalSilhouettesUrl = new URL('./unRegionalSilhouettes.json', import.meta.url).href;

// Documented UN M49 Regional Silhouettes hydrated lazily from Workbox-precached JSON
export const UN_REGIONAL_SILHOUETTES: Partial<Record<AfricanRegion, RegionalSilhouetteData>> = {};
export const REGIONAL_SILHOUETTES = UN_REGIONAL_SILHOUETTES;

const regionalSilhouettesStore = createLazyAssetStore<Partial<Record<AfricanRegion, RegionalSilhouetteData>>>(
  [regionalSilhouettesUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      Object.assign(UN_REGIONAL_SILHOUETTES, payload);
    }
    return UN_REGIONAL_SILHOUETTES;
  },
  () => UN_REGIONAL_SILHOUETTES
);

export const ensureRegionalSilhouettesLoaded = regionalSilhouettesStore.ensureLoaded;
export const isRegionalSilhouettesLoaded = regionalSilhouettesStore.isLoaded;
export const subscribeRegionalSilhouettes = regionalSilhouettesStore.subscribe;
export const useRegionalSilhouettesLoaded = regionalSilhouettesStore.useLoaded;

export function getRegionalSilhouette(region: AfricanRegion): RegionalSilhouetteData | undefined {
  return UN_REGIONAL_SILHOUETTES[region];
}

export const M49_ENTITIES: M49EntityMetadata[] = [
  {
    "iso3": "MAR",
    "iso2": "MA",
    "m49Code": "504",
    "name": "Morocco",
    "unRegion": "Northern Africa",
    "unRegionCode": "015",
    "shapeType": "coastal",
    "vertexCount": 368,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 4199
  },
  {
    "iso3": "ESH",
    "iso2": "EH",
    "m49Code": "732",
    "name": "Western Sahara",
    "unRegion": "Northern Africa",
    "unRegionCode": "015",
    "shapeType": "coastal",
    "vertexCount": 229,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2659
  },
  {
    "iso3": "DZA",
    "iso2": "DZ",
    "m49Code": "012",
    "name": "Algeria",
    "unRegion": "Northern Africa",
    "unRegionCode": "015",
    "shapeType": "coastal",
    "vertexCount": 382,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 4317
  },
  {
    "iso3": "TUN",
    "iso2": "TN",
    "m49Code": "788",
    "name": "Tunisia",
    "unRegion": "Northern Africa",
    "unRegionCode": "015",
    "shapeType": "coastal",
    "vertexCount": 187,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2038
  },
  {
    "iso3": "LBY",
    "iso2": "LY",
    "m49Code": "434",
    "name": "Libya",
    "unRegion": "Northern Africa",
    "unRegionCode": "015",
    "shapeType": "coastal",
    "vertexCount": 257,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2947
  },
  {
    "iso3": "EGY",
    "iso2": "EG",
    "m49Code": "818",
    "name": "Egypt",
    "unRegion": "Northern Africa",
    "unRegionCode": "015",
    "shapeType": "coastal",
    "vertexCount": 254,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2937
  },
  {
    "iso3": "SDN",
    "iso2": "SD",
    "m49Code": "729",
    "name": "Sudan",
    "unRegion": "Northern Africa",
    "unRegionCode": "015",
    "shapeType": "coastal",
    "vertexCount": 447,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 5185
  },
  {
    "iso3": "MRT",
    "iso2": "MR",
    "m49Code": "478",
    "name": "Mauritania",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "coastal",
    "vertexCount": 322,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 3740
  },
  {
    "iso3": "SEN",
    "iso2": "SN",
    "m49Code": "686",
    "name": "Senegal",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "coastal",
    "vertexCount": 244,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2803
  },
  {
    "iso3": "GMB",
    "iso2": "GM",
    "m49Code": "270",
    "name": "The Gambia",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "coastal",
    "vertexCount": 74,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 841
  },
  {
    "iso3": "GNB",
    "iso2": "GW",
    "m49Code": "624",
    "name": "Guinea-Bissau",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "coastal",
    "vertexCount": 156,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 1723
  },
  {
    "iso3": "GIN",
    "iso2": "GN",
    "m49Code": "324",
    "name": "Guinea",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "coastal",
    "vertexCount": 349,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 4025
  },
  {
    "iso3": "SLE",
    "iso2": "SL",
    "m49Code": "694",
    "name": "Sierra Leone",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "coastal",
    "vertexCount": 127,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 1454
  },
  {
    "iso3": "LBR",
    "iso2": "LR",
    "m49Code": "430",
    "name": "Liberia",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "coastal",
    "vertexCount": 140,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 1589
  },
  {
    "iso3": "CIV",
    "iso2": "CI",
    "m49Code": "384",
    "name": "Côte d'Ivoire",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "coastal",
    "vertexCount": 295,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 3350
  },
  {
    "iso3": "MLI",
    "iso2": "ML",
    "m49Code": "466",
    "name": "Mali",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "landlocked",
    "vertexCount": 475,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 5487
  },
  {
    "iso3": "BFA",
    "iso2": "BF",
    "m49Code": "854",
    "name": "Burkina Faso",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "landlocked",
    "vertexCount": 254,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2933
  },
  {
    "iso3": "GHA",
    "iso2": "GH",
    "m49Code": "288",
    "name": "Ghana",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "coastal",
    "vertexCount": 214,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2439
  },
  {
    "iso3": "TGO",
    "iso2": "TG",
    "m49Code": "768",
    "name": "Togo",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "coastal",
    "vertexCount": 131,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 1509
  },
  {
    "iso3": "BEN",
    "iso2": "BJ",
    "m49Code": "204",
    "name": "Benin",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "coastal",
    "vertexCount": 148,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 1693
  },
  {
    "iso3": "NER",
    "iso2": "NE",
    "m49Code": "562",
    "name": "Niger",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "landlocked",
    "vertexCount": 255,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2959
  },
  {
    "iso3": "NGA",
    "iso2": "NG",
    "m49Code": "566",
    "name": "Nigeria",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "coastal",
    "vertexCount": 365,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 4202
  },
  {
    "iso3": "CPV",
    "iso2": "CV",
    "m49Code": "132",
    "name": "Cabo Verde",
    "unRegion": "Western Africa",
    "unRegionCode": "011",
    "shapeType": "island",
    "vertexCount": 88,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 853
  },
  {
    "iso3": "TCD",
    "iso2": "TD",
    "m49Code": "148",
    "name": "Chad",
    "unRegion": "Central Africa",
    "unRegionCode": "017",
    "shapeType": "landlocked",
    "vertexCount": 292,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 3351
  },
  {
    "iso3": "CMR",
    "iso2": "CM",
    "m49Code": "120",
    "name": "Cameroon",
    "unRegion": "Central Africa",
    "unRegionCode": "017",
    "shapeType": "coastal",
    "vertexCount": 351,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 4057
  },
  {
    "iso3": "CAF",
    "iso2": "CF",
    "m49Code": "140",
    "name": "Central African Republic",
    "unRegion": "Central Africa",
    "unRegionCode": "017",
    "shapeType": "landlocked",
    "vertexCount": 325,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 3753
  },
  {
    "iso3": "GNQ",
    "iso2": "GQ",
    "m49Code": "226",
    "name": "Equatorial Guinea",
    "unRegion": "Central Africa",
    "unRegionCode": "017",
    "shapeType": "coastal",
    "vertexCount": 68,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 762
  },
  {
    "iso3": "GAB",
    "iso2": "GA",
    "m49Code": "266",
    "name": "Gabon",
    "unRegion": "Central Africa",
    "unRegionCode": "017",
    "shapeType": "coastal",
    "vertexCount": 272,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 3143
  },
  {
    "iso3": "COG",
    "iso2": "CG",
    "m49Code": "178",
    "name": "Republic of the Congo",
    "unRegion": "Central Africa",
    "unRegionCode": "017",
    "shapeType": "coastal",
    "vertexCount": 324,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 3749
  },
  {
    "iso3": "COD",
    "iso2": "CD",
    "m49Code": "180",
    "name": "Democratic Republic of the Congo",
    "unRegion": "Central Africa",
    "unRegionCode": "017",
    "shapeType": "coastal",
    "vertexCount": 610,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 7039
  },
  {
    "iso3": "AGO",
    "iso2": "AO",
    "m49Code": "024",
    "name": "Angola",
    "unRegion": "Central Africa",
    "unRegionCode": "017",
    "shapeType": "coastal",
    "vertexCount": 339,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 3888
  },
  {
    "iso3": "STP",
    "iso2": "ST",
    "m49Code": "678",
    "name": "São Tomé and Príncipe",
    "unRegion": "Central Africa",
    "unRegionCode": "017",
    "shapeType": "island",
    "vertexCount": 23,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 236
  },
  {
    "iso3": "ERI",
    "iso2": "ER",
    "m49Code": "232",
    "name": "Eritrea",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "coastal",
    "vertexCount": 193,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2209
  },
  {
    "iso3": "DJI",
    "iso2": "DJ",
    "m49Code": "262",
    "name": "Djibouti",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "coastal",
    "vertexCount": 57,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 635
  },
  {
    "iso3": "ETH",
    "iso2": "ET",
    "m49Code": "231",
    "name": "Ethiopia",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "landlocked",
    "vertexCount": 303,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 3503
  },
  {
    "iso3": "SOM",
    "iso2": "SO",
    "m49Code": "706",
    "name": "Somalia",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "coastal",
    "vertexCount": 144,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 1627
  },
  {
    "iso3": "SSD",
    "iso2": "SS",
    "m49Code": "728",
    "name": "South Sudan",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "landlocked",
    "vertexCount": 326,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 3749
  },
  {
    "iso3": "UGA",
    "iso2": "UG",
    "m49Code": "800",
    "name": "Uganda",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "landlocked",
    "vertexCount": 181,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2075
  },
  {
    "iso3": "KEN",
    "iso2": "KE",
    "m49Code": "404",
    "name": "Kenya",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "coastal",
    "vertexCount": 226,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2590
  },
  {
    "iso3": "RWA",
    "iso2": "RW",
    "m49Code": "646",
    "name": "Rwanda",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "landlocked",
    "vertexCount": 84,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 953
  },
  {
    "iso3": "BDI",
    "iso2": "BI",
    "m49Code": "108",
    "name": "Burundi",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "landlocked",
    "vertexCount": 79,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 893
  },
  {
    "iso3": "TZA",
    "iso2": "TZ",
    "m49Code": "834",
    "name": "Tanzania",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "coastal",
    "vertexCount": 377,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 4298
  },
  {
    "iso3": "MWI",
    "iso2": "MW",
    "m49Code": "454",
    "name": "Malawi",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "landlocked",
    "vertexCount": 246,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2795
  },
  {
    "iso3": "ZMB",
    "iso2": "ZM",
    "m49Code": "894",
    "name": "Zambia",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "landlocked",
    "vertexCount": 377,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 4331
  },
  {
    "iso3": "MOZ",
    "iso2": "MZ",
    "m49Code": "508",
    "name": "Mozambique",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "coastal",
    "vertexCount": 470,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 5399
  },
  {
    "iso3": "ZWE",
    "iso2": "ZW",
    "m49Code": "716",
    "name": "Zimbabwe",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "landlocked",
    "vertexCount": 170,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 1959
  },
  {
    "iso3": "MDG",
    "iso2": "MG",
    "m49Code": "450",
    "name": "Madagascar",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "coastal",
    "vertexCount": 252,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2903
  },
  {
    "iso3": "COM",
    "iso2": "KM",
    "m49Code": "174",
    "name": "Comoros",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "island",
    "vertexCount": 36,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 373
  },
  {
    "iso3": "SYC",
    "iso2": "SC",
    "m49Code": "690",
    "name": "Seychelles",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "island",
    "vertexCount": 9,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 79
  },
  {
    "iso3": "MUS",
    "iso2": "MU",
    "m49Code": "480",
    "name": "Mauritius",
    "unRegion": "Eastern Africa",
    "unRegionCode": "014",
    "shapeType": "island",
    "vertexCount": 20,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 211
  },
  {
    "iso3": "NAM",
    "iso2": "NA",
    "m49Code": "516",
    "name": "Namibia",
    "unRegion": "Southern Africa",
    "unRegionCode": "018",
    "shapeType": "coastal",
    "vertexCount": 236,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2707
  },
  {
    "iso3": "BWA",
    "iso2": "BW",
    "m49Code": "072",
    "name": "Botswana",
    "unRegion": "Southern Africa",
    "unRegionCode": "018",
    "shapeType": "landlocked",
    "vertexCount": 222,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 2545
  },
  {
    "iso3": "ZAF",
    "iso2": "ZA",
    "m49Code": "710",
    "name": "South Africa",
    "unRegion": "Southern Africa",
    "unRegionCode": "018",
    "shapeType": "coastal",
    "vertexCount": 443,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 5102
  },
  {
    "iso3": "LSO",
    "iso2": "LS",
    "m49Code": "426",
    "name": "Lesotho",
    "unRegion": "Southern Africa",
    "unRegionCode": "018",
    "shapeType": "landlocked",
    "vertexCount": 78,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 897
  },
  {
    "iso3": "SWZ",
    "iso2": "SZ",
    "m49Code": "748",
    "name": "Eswatini",
    "unRegion": "Southern Africa",
    "unRegionCode": "018",
    "shapeType": "landlocked",
    "vertexCount": 39,
    "simplificationMethod": "Natural Earth 50m Vector Pipeline",
    "validationStatus": "verified",
    "viewBox": "0 0 400 400",
    "pathLength": 425
  }
];

export function getEntityGeographyMetadata(iso3: string): M49EntityMetadata | undefined {
  return M49_ENTITIES.find(e => e.iso3 === iso3);
}

export function getSvgGeographySystemStats() {
  const totalEntities = M49_ENTITIES.length;
  const verifiedEntities = M49_ENTITIES.filter(e => e.validationStatus === 'verified').length;
  const totalVertices = M49_ENTITIES.reduce((acc, curr) => acc + curr.vertexCount, 0);
  const avgVerticesPerCountry = Math.round(totalVertices / totalEntities);

  return {
    totalEntities,
    verifiedEntities,
    totalVertices,
    avgVerticesPerCountry,
    regionsCovered: 5,
    m49Compliance: '100% UN M49 Aligned'
  };
}
