/**
 * atlanticMapGeometry.ts
 * High-precision vector geometry and cartographic projections for the Atlantic Basin Flow Map.
 * Standardized for the 1000x580 SVG viewport covering Latitudes -38° to +58°, Longitudes -105° to +52°.
 * 
 * Uses high-fidelity Natural Earth 1:50m geometries for Europe, the Americas, and the Caribbean.
 */

import {
  NATURAL_EARTH_SOUTH_AMERICA_PATH,
  NATURAL_EARTH_NORTH_AMERICA_PATH,
  NATURAL_EARTH_EUROPE_MAINLAND_PATH,
  NATURAL_EARTH_GREAT_BRITAIN_PATH,
  NATURAL_EARTH_IRELAND_PATH,
  NATURAL_EARTH_CUBA_PATH,
  NATURAL_EARTH_HISPANIOLA_PATH,
  NATURAL_EARTH_JAMAICA_PATH,
  NATURAL_EARTH_PUERTO_RICO_PATH,
  NATURAL_EARTH_BAHAMAS_PATH,
  NATURAL_EARTH_LESSER_ANTILLES_PATH,
  NATURAL_EARTH_BALEARIC_PATH,
  NATURAL_EARTH_SARDINIA_CORSICA_PATH,
  NATURAL_EARTH_SICILY_PATH,
  NATURAL_EARTH_INTERNATIONAL_BORDERS_PATH
} from './atlanticNaturalEarthPaths';

export interface GeoPoint {
  lat: number;
  lng: number;
  label?: string;
}

// Fixed Projection: Geographic (Plate Carrée / Equirectangular with calibrated scale)
export function projectCoord(lat: number, lng: number): [number, number] {
  const minLng = -105;
  const maxLng = 52;
  const minLat = -38;
  const maxLat = 58;

  const x = ((lng - minLng) / (maxLng - minLng)) * 960 + 20;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 540 + 20;
  return [x, y];
}

// Convert a list of [lat, lng] coordinates into a smooth Catmull-Rom cubic Bézier SVG Path
export function coordsToSmoothPath(coords: [number, number][], closePath = true, tension = 0.22): string {
  if (coords.length === 0) return '';
  const pts = coords.map(([lat, lng]) => projectCoord(lat, lng));
  const n = pts.length;
  if (n < 3) {
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < n; i++) d += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
    if (closePath) d += ' Z';
    return d;
  }

  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;

  const numSegments = closePath ? n : n - 1;
  for (let i = 0; i < numSegments; i++) {
    const pPrev = closePath ? pts[(i - 1 + n) % n] : pts[Math.max(i - 1, 0)];
    const pCurr = pts[i];
    const pNext = closePath ? pts[(i + 1) % n] : pts[i + 1];
    const pNext2 = closePath ? pts[(i + 2) % n] : pts[Math.min(i + 2, n - 1)];

    // Tangents with tension control
    const factor = (1 - tension) / 6;
    const cp1x = pCurr[0] + (pNext[0] - pPrev[0]) * factor;
    const cp1y = pCurr[1] + (pNext[1] - pPrev[1]) * factor;
    const cp2x = pNext[0] - (pNext2[0] - pCurr[0]) * factor;
    const cp2y = pNext[1] - (pNext2[1] - pCurr[1]) * factor;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${pNext[0].toFixed(1)} ${pNext[1].toFixed(1)}`;
  }

  if (closePath) d += ' Z';
  return d;
}

// Convert a list of [lat, lng] coordinates into an SVG Path string
export function coordsToPath(coords: [number, number][], closePath = true): string {
  return coordsToSmoothPath(coords, closePath, 0.22);
}

/**
 * 1. AFRICAN CONTINENT OUTLINE (High fidelity coastline)
 * Traces Morocco, Mediterranean, Red Sea, Horn of Africa, East Coast, Cape of Good Hope, West Central Africa, Gulf of Guinea, Senegambia.
 */
const AFRICA_COASTLINE_COORDS: [number, number][] = [
  // North / Mediterranean
  [35.8, -5.8],   // Tangier
  [35.2, -3.9],   // Al Hoceima
  [35.2, -1.6],   // Melilla / Moroccan Border
  [35.7, -0.6],   // Oran (Algeria)
  [36.8, 3.0],    // Algiers
  [36.9, 7.8],    // Annaba
  [37.3, 9.8],    // Bizerte (Tunisia)
  [36.8, 10.3],   // Tunis / Carthage
  [35.0, 11.0],   // Sfax
  [33.9, 10.1],   // Gabès
  [32.9, 13.2],   // Tripoli (Libya)
  [31.2, 16.6],   // Sirte / Gulf of Sidra
  [32.1, 20.1],   // Benghazi
  [32.8, 22.0],   // Derna
  [31.6, 25.1],   // Sallum (Egypt Border)
  [31.3, 27.2],   // Mersa Matruh
  [31.2, 29.9],   // Alexandria
  [31.3, 32.3],   // Port Said (Suez Canal)
  // Red Sea & Horn of Africa
  [29.9, 32.5],   // Suez
  [27.2, 33.8],   // Hurghada
  [24.0, 35.5],   // Berenice
  [22.0, 36.9],   // Halaib Triangle
  [19.6, 37.2],   // Port Sudan
  [15.6, 39.5],   // Massawa (Eritrea)
  [12.8, 43.0],   // Bab-el-Mandeb Strait (Red Sea Exit)
  [11.6, 43.1],   // Djibouti
  [11.5, 47.3],   // Bosaso (Somalia, Gulf of Aden)
  [11.8, 51.3],   // Cape Guardafui (Horn of Africa Tip)
  [10.4, 51.2],   // Ras Hafun
  [5.3, 48.5],    // Obbia
  [2.0, 45.3],    // Mogadishu
  [-0.1, 42.8],   // Kismayo
  // East Africa & Mozambique Channel
  [-1.7, 41.5],   // Lamu (Kenya)
  [-3.2, 40.1],   // Malindi
  [-4.1, 39.7],   // Mombasa
  [-5.1, 39.1],   // Tanga (Tanzania)
  [-6.2, 39.2],   // Dar es Salaam
  [-8.0, 39.4],   // Kilwa Kisiwani
  [-10.2, 40.2],  // Mtwara / Ruvuma River (Mozambique Border)
  [-11.4, 40.5],  // Cabo Delgado
  [-12.2, 40.6],  // Pemba
  [-15.0, 40.7],  // Mozambique Island (Ilha de Moçambique)
  [-16.0, 39.9],  // Quelimane
  [-19.0, 35.0],  // Beira
  [-22.0, 35.5],  // Bazaruto Archipelago
  [-23.9, 35.5],  // Inhambane
  [-25.9, 32.6],  // Maputo (Delagoa Bay)
  // South Africa & Cape of Good Hope
  [-26.9, 32.9],  // Kosi Bay (South Africa Border)
  [-28.8, 32.1],  // Richards Bay
  [-29.9, 31.0],  // Durban
  [-33.0, 27.9],  // East London
  [-33.9, 25.6],  // Port Elizabeth / Algoa Bay
  [-34.2, 22.1],  // Mossel Bay
  [-34.8, 20.0],  // Cape Agulhas (Southernmost Point of Africa)
  [-34.4, 18.5],  // Cape of Good Hope / Cape Peninsula
  [-33.9, 18.4],  // Cape Town / Table Bay
  [-32.8, 17.9],  // Saldanha Bay
  [-31.6, 18.2],  // Olifants River Mouth
  // West Coast / Namibia, Angola & West Central Africa
  [-28.6, 16.5],  // Orange River Mouth (Namibia Border)
  [-26.6, 15.1],  // Lüderitz
  [-22.9, 14.5],  // Walvis Bay
  [-17.3, 11.8],  // Kunene River Mouth (Angola Border)
  [-15.2, 12.1],  // Namibe (Moçâmedes)
  [-12.6, 13.4],  // Benguela
  [-12.3, 13.5],  // Lobito
  [-11.2, 13.8],  // Porto Amboim
  [-8.8, 13.3],   // Luanda (Angola)
  [-7.6, 13.0],   // Ambriz
  [-6.0, 12.3],   // Congo River Mouth (Soyo)
  [-5.6, 12.2],   // Cabinda
  [-4.8, 11.8],   // Pointe-Noire (Congo)
  [-0.6, 9.3],    // Cape Lopez (Gabon)
  [0.4, 9.4],     // Libreville
  [1.0, 9.6],     // Corisco Bay
  [2.2, 9.8],     // Kribi (Cameroon)
  [4.0, 9.2],     // Douala / Mount Cameroon
  // Gulf of Guinea (Bights of Biafra & Benin, Gold Coast, Windward Coast)
  [4.5, 8.3],     // Calabar (Cross River)
  [4.4, 7.2],     // Bonny / Niger Delta East
  [4.3, 6.0],     // Brass / Akassa (Niger Delta Apex)
  [5.5, 5.7],     // Forcados / Warri
  [6.4, 3.4],     // Lagos
  [6.3, 2.1],     // Ouidah (Bight of Benin)
  [6.2, 1.6],     // Grand-Popo
  [6.1, 1.2],     // Lomé (Togo)
  [5.9, 0.9],     // Keta (Ghana)
  [5.8, 0.6],     // Ada / Volta River
  [5.6, -0.2],    // Accra
  [5.3, -0.6],    // Winneba
  [5.1, -1.2],    // Cape Coast / Elmina
  [4.8, -2.1],    // Cape Three Points
  [5.0, -2.8],    // Half Assini
  [5.2, -3.7],    // Grand-Bassam (Ivory Coast)
  [5.3, -4.0],    // Abidjan
  [4.9, -6.1],    // Sassandra
  [4.7, -6.6],    // San Pedro
  // Windward Coast, Sierra Leone & Senegambia
  [4.4, -7.7],    // Cape Palmas (Liberia)
  [5.0, -9.0],    // Greenville
  [6.3, -10.8],   // Monrovia
  [6.7, -11.4],   // Cape Mount
  [7.5, -12.5],   // Sherbro Island
  [8.5, -13.2],   // Freetown / Bunce Island (Sierra Leone)
  [9.5, -13.7],   // Conakry (Guinea)
  [10.2, -14.2],  // Rio Pongo
  [10.9, -14.7],  // Rio Nunez
  [11.8, -15.6],  // Bissau / Cacheu
  [12.3, -16.5],  // Cape Roxo
  [13.4, -16.6],  // Banjul (Gambia River)
  [14.1, -16.8],  // Saloum Delta
  [14.7, -17.5],  // Cap-Vert / Dakar / Gorée (Westernmost Africa)
  [15.8, -16.5],  // Saint-Louis (Senegal River)
  [18.1, -16.0],  // Nouakchott (Mauritania)
  [20.7, -17.0],  // Cap Blanc (Banc d'Arguin)
  [23.7, -15.9],  // Dakhla (Western Sahara)
  [27.1, -13.2],  // Laayoune
  [28.0, -12.2],  // Cape Bojador
  [28.4, -11.3],  // Tarfaya (Cap Juby)
  [30.4, -9.6],   // Agadir (Morocco)
  [31.5, -9.8],   // Essaouira (Mogador)
  [32.3, -9.2],   // Safi
  [33.6, -7.6],   // Casablanca
  [34.0, -6.8],   // Rabat / Salé
  [35.2, -6.1],   // Larache
  [35.8, -5.8]    // Tangier / Straits of Gibraltar
];

export const AFRICA_PATH = coordsToPath(AFRICA_COASTLINE_COORDS);

/**
 * 2. MADAGASCAR
 */
const MADAGASCAR_COORDS: [number, number][] = [
  [-12.0, 49.3],  // Antsiranana (Diego Suarez)
  [-15.3, 50.5],  // Cap d'Ambre / Antalaha
  [-18.1, 49.4],  // Toamasina (Tamatave)
  [-21.4, 48.6],  // Manakara
  [-25.0, 47.0],  // Tolagnaro (Fort Dauphin)
  [-25.6, 45.1],  // Cap Sainte-Marie (South)
  [-23.3, 43.7],  // Toliara (Tuléar)
  [-20.3, 44.3],  // Morondava
  [-15.7, 46.3],  // Mahajanga (Majunga)
  [-13.3, 48.2],  // Nosy Be
  [-12.0, 49.3]
];

export const MADAGASCAR_PATH = coordsToPath(MADAGASCAR_COORDS);

/**
 * Authoritative, high-fidelity landmasses mapped directly from the Natural Earth 50m TopoJSON.
 */
export const SOUTH_AMERICA_PATH = NATURAL_EARTH_SOUTH_AMERICA_PATH;
export const NORTH_AMERICA_PATH = NATURAL_EARTH_NORTH_AMERICA_PATH;
export const EUROPE_MAINLAND_PATH = NATURAL_EARTH_EUROPE_MAINLAND_PATH;
export const GREAT_BRITAIN_PATH = NATURAL_EARTH_GREAT_BRITAIN_PATH;
export const IRELAND_PATH = NATURAL_EARTH_IRELAND_PATH;
export const CUBA_PATH = NATURAL_EARTH_CUBA_PATH;
export const HISPANIOLA_PATH = NATURAL_EARTH_HISPANIOLA_PATH;
export const JAMAICA_PATH = NATURAL_EARTH_JAMAICA_PATH;
export const PUERTO_RICO_PATH = NATURAL_EARTH_PUERTO_RICO_PATH;
export const BAHAMAS_PATH = NATURAL_EARTH_BAHAMAS_PATH;
export const LESSER_ANTILLES_PATH = NATURAL_EARTH_LESSER_ANTILLES_PATH;
export const BALEARIC_PATH = NATURAL_EARTH_BALEARIC_PATH;
export const SARDINIA_CORSICA_PATH = NATURAL_EARTH_SARDINIA_CORSICA_PATH;
export const SICILY_PATH = NATURAL_EARTH_SICILY_PATH;
export const INTERNATIONAL_BORDERS_PATH = NATURAL_EARTH_INTERNATIONAL_BORDERS_PATH;

/**
 * 7. HISTORICAL EMBARKATION REGION HIGHLIGHT ZONES (Coastline badges)
 */
export interface CoastalEmbarkationZone {
  id: string;
  name: string;
  century: string;
  captiveShare: string;
  color: string;
  center: [number, number]; // lat, lng
  polygonCoords: [number, number][];
}

export const EMBARKATION_ZONES: CoastalEmbarkationZone[] = [
  {
    id: 'senegambia',
    name: 'Senegambia',
    century: '16th–19th C.',
    captiveShare: '755k captives (6.0%)',
    color: '#10b981',
    center: [14.5, -17.0],
    polygonCoords: [[16.5, -16.0], [14.0, -17.5], [12.5, -16.5], [13.0, -14.5], [16.0, -14.0]]
  },
  {
    id: 'sierra_leone',
    name: 'Sierra Leone & Windward Coast',
    century: '17th–19th C.',
    captiveShare: '725k captives (5.8%)',
    color: '#06b6d4',
    center: [7.5, -12.0],
    polygonCoords: [[10.5, -14.5], [8.0, -13.5], [4.5, -7.5], [5.5, -6.5], [9.5, -11.0]]
  },
  {
    id: 'gold_coast',
    name: 'Gold Coast (Ghana)',
    century: '17th–18th C.',
    captiveShare: '1.21M captives (9.7%)',
    color: '#f59e0b',
    center: [5.2, -1.2],
    polygonCoords: [[5.5, -3.0], [4.7, -2.1], [5.1, -1.2], [5.9, 0.8], [6.8, 0.0], [6.5, -2.5]]
  },
  {
    id: 'bight_of_benin',
    name: 'Bight of Benin (Slave Coast)',
    century: '17th–19th C.',
    captiveShare: '2.00M captives (16.0%)',
    color: '#ec4899',
    center: [6.3, 2.5],
    polygonCoords: [[6.0, 1.0], [6.3, 2.1], [6.4, 3.8], [6.0, 5.0], [7.5, 4.5], [7.5, 1.5]]
  },
  {
    id: 'bight_of_biafra',
    name: 'Bight of Biafra',
    century: '18th–19th C.',
    captiveShare: '1.59M captives (12.7%)',
    color: '#8b5cf6',
    center: [4.5, 7.5],
    polygonCoords: [[5.5, 5.5], [4.3, 6.0], [4.5, 8.5], [3.5, 9.5], [5.0, 10.0], [6.0, 7.0]]
  },
  {
    id: 'west_central_africa',
    name: 'West Central Africa (Angola / Congo)',
    century: '16th–19th C.',
    captiveShare: '5.69M captives (45.4%)',
    color: '#ef4444',
    center: [-9.0, 13.5],
    polygonCoords: [[-4.5, 11.5], [-6.0, 12.3], [-8.8, 13.3], [-12.6, 13.4], [-15.5, 12.0], [-13.0, 16.5], [-5.0, 15.5]]
  },
  {
    id: 'southeast_africa',
    name: 'Southeast Africa & Mozambique',
    century: '18th–19th C.',
    captiveShare: '543k captives (4.3%)',
    color: '#14b8a6',
    center: [-16.0, 40.0],
    polygonCoords: [[-10.0, 40.0], [-15.0, 40.7], [-20.0, 35.0], [-26.0, 33.0], [-24.0, 30.0], [-12.0, 36.0]]
  }
];

/**
 * 8. HISTORICAL TRADE WINDS & OCEANIC CURRENTS
 * The physical meteorological forces that defined the triangular routes.
 */
export interface TradeWindVector {
  id: string;
  name: string;
  description: string;
  startLat: number;
  startLng: number;
  ctrlLat: number;
  ctrlLng: number;
  endLat: number;
  endLng: number;
  color: string;
}

export const TRADE_WINDS: TradeWindVector[] = [
  {
    id: 'northeast_trades',
    name: 'Northeast Trade Winds (Middle Passage)',
    description: 'Blowing steadily SW from Canaries / West Africa directly into Caribbean & Gulf of Mexico',
    startLat: 22.0,
    startLng: -18.0,
    ctrlLat: 16.0,
    ctrlLng: -45.0,
    endLat: 14.0,
    endLng: -62.0,
    color: '#38bdf8'
  },
  {
    id: 'southeast_trades',
    name: 'Southeast Trade Winds (Brazil Route)',
    description: 'Powers direct transit from Luanda & Benguela to Bahia and Rio de Janeiro in 30–40 days',
    startLat: -10.0,
    startLng: 10.0,
    ctrlLat: -12.0,
    ctrlLng: -15.0,
    endLat: -13.0,
    endLng: -37.0,
    color: '#34d399'
  },
  {
    id: 'westerlies_return',
    name: 'The Westerlies (Triangular Return Route)',
    description: 'Fast westerly winds taking sugar, rum & tobacco back from American colonies to Europe',
    startLat: 34.0,
    startLng: -72.0,
    ctrlLat: 42.0,
    ctrlLng: -38.0,
    endLat: 48.0,
    endLng: -10.0,
    color: '#fbbf24'
  },
  {
    id: 'canaries_current',
    name: 'Canaries Current (European Departure)',
    description: 'Southward Atlantic current carrying slave ships from Liverpool, Nantes & Lisbon to Africa',
    startLat: 46.0,
    startLng: -8.0,
    ctrlLat: 33.0,
    ctrlLng: -14.0,
    endLat: 18.0,
    endLng: -18.0,
    color: '#a78bfa'
  }
];

/**
 * 9. HISTORICAL CONTINENTAL NAVIGATIONAL RIVERS
 * Major river systems that shaped transatlantic trade, disembarkation corridors, and internal colonial settlements.
 */
export interface HistoricRiver {
  id: string;
  name: string;
  path: string;
}

export const HISTORIC_RIVERS: HistoricRiver[] = [
  // North America
  {
    id: 'mississippi_main',
    name: 'Mississippi River & Delta',
    path: coordsToSmoothPath([
      [47.2, -95.2], [44.9, -93.2], [41.5, -90.5], [38.6, -90.2], [37.0, -89.1],
      [35.1, -90.1], [32.3, -90.9], [30.4, -91.2], [29.9, -90.1], [29.1, -89.2]
    ], false, 0.2)
  },
  {
    id: 'ohio_river',
    name: 'Ohio River',
    path: coordsToSmoothPath([
      [40.4, -80.0], [39.1, -84.5], [38.2, -85.7], [37.9, -87.5], [37.0, -89.1]
    ], false, 0.2)
  },
  {
    id: 'st_lawrence',
    name: 'St. Lawrence River',
    path: coordsToSmoothPath([
      [44.2, -76.5], [45.0, -74.7], [45.5, -73.6], [46.8, -71.2], [48.6, -68.5], [49.5, -64.5]
    ], false, 0.2)
  },
  {
    id: 'hudson_river',
    name: 'Hudson River',
    path: coordsToSmoothPath([
      [43.3, -73.6], [42.6, -73.7], [41.7, -73.9], [40.7, -74.0]
    ], false, 0.2)
  },
  // South America
  {
    id: 'amazon_main',
    name: 'Amazon River',
    path: coordsToSmoothPath([
      [-4.4, -73.5], [-3.8, -68.0], [-3.1, -60.0], [-2.4, -54.7], [-1.8, -51.5], [-0.5, -49.5]
    ], false, 0.2)
  },
  {
    id: 'rio_negro',
    name: 'Rio Negro',
    path: coordsToSmoothPath([
      [1.0, -67.0], [-0.5, -63.0], [-3.1, -60.0]
    ], false, 0.2)
  },
  {
    id: 'orinoco_river',
    name: 'Orinoco River',
    path: coordsToSmoothPath([
      [3.0, -66.0], [5.6, -67.6], [7.8, -66.5], [8.3, -62.7], [8.6, -60.4]
    ], false, 0.2)
  },
  {
    id: 'sao_francisco',
    name: 'Rio São Francisco',
    path: coordsToSmoothPath([
      [-20.0, -46.5], [-16.0, -45.0], [-12.0, -43.0], [-9.4, -40.5], [-9.5, -38.0], [-10.5, -36.4]
    ], false, 0.2)
  },
  {
    id: 'rio_de_la_plata',
    name: 'Paraná & Río de la Plata',
    path: coordsToSmoothPath([
      [-20.0, -51.0], [-25.5, -54.5], [-27.5, -58.8], [-31.7, -60.5], [-34.2, -58.4], [-35.5, -56.5]
    ], false, 0.2)
  },
  // Western Europe
  {
    id: 'tagus_river',
    name: 'Tagus River (Tejo)',
    path: coordsToSmoothPath([
      [40.3, -1.7], [39.9, -4.0], [39.8, -6.5], [39.5, -7.8], [38.7, -9.2]
    ], false, 0.2)
  },
  {
    id: 'loire_river',
    name: 'Loire River (Nantes)',
    path: coordsToSmoothPath([
      [45.0, 3.9], [47.0, 3.0], [47.9, 1.9], [47.4, 0.7], [47.4, -0.5], [47.2, -2.2]
    ], false, 0.2)
  },
  {
    id: 'seine_river',
    name: 'Seine River (Le Havre)',
    path: coordsToSmoothPath([
      [47.5, 4.8], [48.5, 2.7], [48.85, 2.35], [49.4, 1.1], [49.5, 0.1]
    ], false, 0.2)
  },
  {
    id: 'thames_river',
    name: 'Thames River (London)',
    path: coordsToSmoothPath([
      [51.7, -1.8], [51.8, -1.2], [51.4, -0.9], [51.5, -0.1], [51.5, 0.6]
    ], false, 0.2)
  },
  {
    id: 'rhine_river',
    name: 'Rhine River (Rotterdam)',
    path: coordsToSmoothPath([
      [47.6, 7.6], [49.0, 8.4], [50.1, 8.3], [50.9, 6.9], [51.9, 4.2]
    ], false, 0.2)
  }
];

/**
 * 10. HISTORICAL INTERNAL REGIONAL / COLONIAL BORDERS
 * Subdivisions representing historical captaincies, colonial jurisdictions, and viceroyalties.
 */
export interface HistoricBoundary {
  id: string;
  name: string;
  region: string;
  path: string;
}

export const HISTORIC_INTERNAL_BOUNDARIES: HistoricBoundary[] = [
  // North America
  {
    id: 'na_proclamation_line',
    name: 'Appalachian Proclamation Line (1763)',
    region: 'North America',
    path: coordsToSmoothPath([
      [30.5, -84.0], [34.0, -82.5], [36.5, -81.5], [38.5, -79.5], [41.0, -76.5], [44.0, -73.5]
    ], false, 0.25)
  },
  {
    id: 'na_florida_border',
    name: 'Spanish Florida Border (31°N)',
    region: 'North America',
    path: coordsToSmoothPath([[30.8, -87.5], [30.8, -82.0]], false, 0.1)
  },
  // South America
  {
    id: 'sa_captaincy_pernambuco',
    name: 'Captaincy of Pernambuco Boundary',
    region: 'South America',
    path: coordsToSmoothPath([[-5.0, -42.0], [-8.0, -40.0], [-10.5, -36.4]], false, 0.2)
  },
  {
    id: 'sa_captaincy_bahia',
    name: 'Captaincy of Bahia Boundary',
    region: 'South America',
    path: coordsToSmoothPath([[-10.5, -44.0], [-13.0, -42.0], [-15.5, -39.0]], false, 0.2)
  },
  {
    id: 'sa_captaincy_rio',
    name: 'Captaincy of Rio de Janeiro Boundary',
    region: 'South America',
    path: coordsToSmoothPath([[-15.5, -45.0], [-19.0, -44.0], [-22.0, -41.0]], false, 0.2)
  },
  {
    id: 'sa_captaincy_saopaulo',
    name: 'Captaincy of São Paulo Boundary',
    region: 'South America',
    path: coordsToSmoothPath([[-20.0, -48.0], [-23.0, -47.0], [-25.5, -48.5]], false, 0.2)
  },
  {
    id: 'sa_new_granada_divide',
    name: 'New Granada Frontier',
    region: 'South America',
    path: coordsToSmoothPath([[11.5, -72.0], [7.0, -71.5], [4.0, -70.0], [1.0, -67.0]], false, 0.2)
  },
  // Europe
  {
    id: 'eu_pyrenees',
    name: 'Pyrenees (Franco-Spanish Frontier)',
    region: 'Europe',
    path: coordsToSmoothPath([[43.3, -1.8], [42.8, 0.0], [42.4, 3.1]], false, 0.15)
  },
  {
    id: 'eu_portugal_border',
    name: 'Raia / Portuguese-Spanish Border',
    region: 'Europe',
    path: coordsToSmoothPath([[42.0, -8.2], [41.8, -6.8], [40.0, -7.0], [38.5, -7.0], [37.2, -7.4]], false, 0.2)
  },
  {
    id: 'eu_scotland_border',
    name: 'Anglo-Scottish Border',
    region: 'Europe',
    path: coordsToSmoothPath([[54.9, -3.1], [55.3, -2.4], [55.8, -2.0]], false, 0.15)
  }
];
