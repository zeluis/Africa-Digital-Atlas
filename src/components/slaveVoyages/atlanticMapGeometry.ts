/**
 * atlanticMapGeometry.ts
 * High-precision vector geometry and cartographic projections for the Atlantic Basin Flow Map.
 * Standardized for the 1000x580 SVG viewport covering Latitudes -38° to +58°, Longitudes -105° to +52°.
 */

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

// Convert a list of [lat, lng] coordinates into a smooth SVG Path string
export function coordsToPath(coords: [number, number][], closePath = true): string {
  if (coords.length === 0) return '';
  const projected = coords.map(([lat, lng]) => projectCoord(lat, lng));
  const first = projected[0];
  let d = `M ${first[0].toFixed(1)} ${first[1].toFixed(1)}`;
  
  for (let i = 1; i < projected.length; i++) {
    const pt = projected[i];
    d += ` L ${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`;
  }
  
  if (closePath) d += ' Z';
  return d;
}

/**
 * 1. AFRICAN CONTINENT OUTLINE (High fidelity coastline)
 * Traces Morocco, Mediterranean, Red Sea, Horn of Africa, East Coast, Cape of Good Hope, West Central Africa, Gulf of Guinea, Senegambia.
 */
const AFRICA_COASTLINE_COORDS: [number, number][] = [
  // North / Mediterranean
  [35.8, -5.8],   // Tangier
  [35.6, -0.6],   // Oran
  [36.8, 3.0],    // Algiers
  [37.2, 9.8],    // Bizerte / Tunis
  [35.8, 10.6],   // Sousse
  [33.9, 10.1],   // Gabès
  [32.9, 13.2],   // Tripoli
  [31.2, 16.6],   // Gulf of Sidra
  [32.1, 20.1],   // Benghazi
  [32.8, 22.6],   // Derna
  [31.5, 25.1],   // Sallum
  [31.2, 29.9],   // Alexandria
  [31.4, 31.8],   // Damietta / Port Said
  // Red Sea & Horn
  [29.9, 32.5],   // Suez
  [27.2, 33.8],   // Hurghada
  [24.1, 35.7],   // Ras Banas
  [19.6, 37.2],   // Port Sudan
  [15.6, 39.4],   // Massawa (Eritrea)
  [12.6, 43.1],   // Assab
  [11.6, 43.1],   // Djibouti
  [10.5, 45.0],   // Berbera (Somaliland)
  [11.8, 51.2],   // Cape Guardafui (Horn of Africa)
  [7.9, 49.8],    // Ras Hafun
  [5.3, 48.5],    // Hobyo
  [2.0, 45.3],    // Mogadishu
  [-0.4, 42.6],   // Kismayo
  // East Africa / Swahili Coast
  [-2.3, 40.9],   // Lamu
  [-4.0, 39.7],   // Mombasa
  [-5.1, 39.1],   // Tanga
  [-6.8, 39.3],   // Dar es Salaam
  [-8.9, 39.5],   // Kilwa Kivinje
  [-10.3, 40.2],  // Mtwara / Ruvuma River
  [-12.9, 40.5],  // Pemba (Mozambique)
  [-15.0, 40.7],  // Mozambique Island
  [-17.9, 36.9],  // Quelimane (Zambezi Delta)
  [-19.8, 34.8],  // Beira
  [-23.8, 35.3],  // Inhambane
  [-26.0, 32.6],  // Maputo (Delagoa Bay)
  // Southern Africa
  [-28.8, 32.0],  // Richards Bay
  [-29.9, 31.0],  // Durban
  [-33.0, 27.9],  // East London
  [-33.9, 25.6],  // Port Elizabeth (Algoa Bay)
  [-34.8, 20.0],  // Cape Agulhas (Southernmost Point of Africa)
  [-34.4, 18.5],  // Cape of Good Hope
  [-33.9, 18.4],  // Cape Town (Table Bay)
  [-33.0, 18.0],  // Saldanha Bay
  [-31.6, 18.2],  // Lambert's Bay
  [-28.6, 16.5],  // Orange River Mouth
  [-26.6, 15.1],  // Lüderitz
  [-22.9, 14.5],  // Walvis Bay
  [-19.0, 12.5],  // Skeleton Coast
  [-17.2, 11.8],  // Cunene River Mouth (Namibia/Angola border)
  // West Central Africa
  [-15.8, 11.8],  // Tombua
  [-15.2, 12.1],  // Namibe
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
 * 3. SOUTH AMERICA CONTINENT (Atlantic & Pacific bounds)
 */
const SOUTH_AMERICA_COORDS: [number, number][] = [
  // Caribbean Coast & Guianas
  [8.5, -78.0],   // Panama Border (Darién)
  [8.8, -76.8],   // Gulf of Urabá (Colombia)
  [10.4, -75.5],  // Cartagena de Indias
  [11.2, -74.2],  // Santa Marta
  [11.8, -72.9],  // Riohacha
  [12.5, -71.7],  // Punta Gallinas (Northernmost Point of South America)
  [11.7, -70.2],  // Paraguaná Peninsula (Venezuela)
  [10.6, -69.8],  // Coro
  [10.5, -66.9],  // Caracas / La Guaira
  [10.2, -63.8],  // Cumaná
  [10.6, -61.9],  // Paria Peninsula
  [8.6, -60.0],   // Orinoco Delta
  [6.8, -58.1],   // Georgetown (Guyana)
  [5.8, -55.2],   // Paramaribo (Suriname)
  [4.9, -52.3],   // Cayenne (French Guiana)
  [3.8, -51.8],   // Oyapock River Mouth
  // Brazil Coastline (North to South)
  [1.0, -50.0],   // Amapá
  [-0.5, -48.5],  // Amazon Delta / Belém
  [-1.2, -46.8],  // Bragança
  [-2.5, -44.3],  // São Luís (Maranhão)
  [-2.9, -41.8],  // Parnaíba Delta (Piauí)
  [-3.7, -38.5],  // Fortaleza (Ceará)
  [-5.1, -36.6],  // Macau
  [-5.8, -35.2],  // Cape São Roque / Natal (Easternmost tip of South America)
  [-7.1, -34.8],  // João Pessoa (Paraíba)
  [-8.0, -34.9],  // Recife / Olinda (Pernambuco)
  [-9.7, -35.7],  // Maceió (Alagoas)
  [-10.9, -37.0], // Aracaju (Sergipe)
  [-13.0, -38.5], // Salvador da Bahia (Bay of All Saints)
  [-14.8, -39.0], // Ilhéus
  [-16.4, -39.1], // Porto Seguro (Cabral 1500 Landing)
  [-18.0, -39.5], // Caravelas / Abrolhos
  [-20.3, -40.3], // Vitória (Espírito Santo)
  [-21.8, -41.0], // Campos dos Goytacazes
  [-22.9, -42.0], // Cabo Frio
  [-22.9, -43.2], // Rio de Janeiro (Valongo / Guanabara Bay)
  [-23.9, -46.3], // Santos / São Paulo
  [-25.5, -48.5], // Paranaguá
  [-27.6, -48.5], // Florianópolis (Santa Catarina)
  [-30.0, -50.1], // Tramandaí
  [-32.0, -52.1], // Rio Grande (Rio Grande do Sul)
  // River Plate & Southern Cone
  [-34.0, -53.5], // Chuy (Uruguay)
  [-34.9, -54.9], // Punta del Este
  [-34.9, -56.2], // Montevideo
  [-34.4, -57.8], // Colonia del Sacramento
  [-34.6, -58.4], // Buenos Aires (Argentina)
  [-35.7, -57.4], // Samborombón Bay
  [-38.0, -57.5], // Mar del Plata
  [-38.0, -62.0], // Bahía Blanca (Patagonia border)
  // Interior / Pacific Cutoff bounding polygon for 1000x580 canvas
  [-38.0, -73.5], // Pacific Coast (Chile)
  [-33.0, -71.6], // Valparaíso / Santiago
  [-23.6, -70.4], // Antofagasta
  [-18.5, -70.3], // Arica
  [-12.0, -77.1], // Lima / Callao (Peru)
  [-5.0, -81.1],  // Piura
  [-2.2, -79.9],  // Guayaquil (Ecuador)
  [1.0, -79.0],   // Esmeraldas
  [3.9, -77.1],   // Buenaventura (Colombia)
  [6.5, -77.4],   // Nuquí
  [8.5, -78.0]    // Return to Darién
];

export const SOUTH_AMERICA_PATH = coordsToPath(SOUTH_AMERICA_COORDS);

/**
 * 4. NORTH AMERICA, CENTRAL AMERICA & GULF OF MEXICO
 */
const NORTH_AMERICA_COORDS: [number, number][] = [
  // Central America Isthmus
  [8.5, -78.0],   // Panama (Darien)
  [9.5, -79.6],   // Portobelo / Colón
  [10.0, -83.0],  // Puerto Limón (Costa Rica)
  [12.0, -83.5],  // Bluefields (Nicaragua / Mosquito Coast)
  [15.0, -83.2],  // Cabo Gracias a Dios
  [15.8, -86.5],  // Trujillo (Honduras)
  [15.7, -88.6],  // Puerto Barrios (Guatemala)
  [17.5, -88.2],  // Belize City
  [18.5, -88.3],  // Chetumal (Mexico)
  [21.2, -86.8],  // Cancún (Yucatán)
  [21.3, -89.5],  // Progreso
  [19.8, -90.5],  // Campeche
  [18.7, -91.8],  // Ciudad del Carmen
  [18.2, -94.4],  // Coatzacoalcos
  [19.2, -96.1],  // Veracruz
  [22.3, -97.8],  // Tampico
  [26.0, -97.1],  // Brownsville / Matamoros
  // US Gulf Coast
  [28.0, -97.0],  // Corpus Christi (Texas)
  [29.3, -94.8],  // Galveston
  [29.7, -93.9],  // Port Arthur
  [29.5, -89.5],  // Mississippi River Delta (New Orleans)
  [30.4, -87.2],  // Mobile Bay / Pensacola
  [29.8, -84.0],  // Apalachee Bay
  [28.0, -82.8],  // Tampa Bay (Florida)
  [26.1, -81.8],  // Naples
  [25.0, -81.1],  // Cape Sable / Florida Keys
  // US East Coast & Atlantic Seaboard
  [25.8, -80.2],  // Miami
  [26.7, -80.0],  // Palm Beach
  [28.4, -80.5],  // Cape Canaveral
  [29.9, -81.3],  // St. Augustine
  [30.3, -81.4],  // Jacksonville
  [32.0, -81.0],  // Savannah (Georgia)
  [32.8, -79.9],  // Charleston (South Carolina)
  [33.9, -78.0],  // Cape Fear (Wilmington, NC)
  [35.2, -75.5],  // Cape Hatteras (Outer Banks, NC)
  [36.9, -76.0],  // Chesapeake Bay Entrance (Norfolk / Virginia)
  [38.3, -75.1],  // Ocean City (Maryland)
  [39.0, -75.0],  // Delaware Bay (Lewes / Cape May)
  [40.5, -74.0],  // New York Harbor (Manhattan / Staten Island)
  [41.0, -72.0],  // Montauk Point (Long Island)
  [41.5, -71.3],  // Newport (Rhode Island)
  [42.0, -70.1],  // Cape Cod / Provincetown (Massachusetts)
  [42.4, -71.0],  // Boston Harbor
  [43.6, -70.2],  // Portland (Maine)
  [44.5, -67.0],  // Bay of Fundy
  [44.6, -63.6],  // Halifax (Nova Scotia)
  [46.0, -60.0],  // Cape Breton Island
  [48.0, -59.0],  // Newfoundland / St. Lawrence Estuary
  [51.5, -55.5],  // Belle Isle Strait
  [58.0, -62.5],  // Northern Labrador Coast
  // Continental Inland Boundary (Framing the western canvas margin)
  [58.0, -105.0], // NW Margin
  [30.0, -105.0], // West Texas / Mexico interior
  [16.0, -95.0],  // Tehuantepec (Pacific)
  [14.0, -91.0],  // Guatemala Pacific
  [8.5, -78.0]    // Darién Closure
];

export const NORTH_AMERICA_PATH = coordsToPath(NORTH_AMERICA_COORDS);

/**
 * 5. CARIBBEAN ISLANDS (Accurate individual islands)
 */
// Cuba
export const CUBA_PATH = coordsToPath([
  [21.8, -84.9], [22.4, -84.0], [23.1, -82.4], [23.2, -80.5],
  [22.5, -78.5], [21.5, -77.0], [20.2, -74.2], [19.9, -75.8],
  [20.0, -77.7], [21.5, -80.0], [22.0, -83.5], [21.8, -84.9]
]);

// Hispaniola (Haiti & Dominican Republic)
export const HISPANIOLA_PATH = coordsToPath([
  [19.9, -72.7], [19.9, -71.0], [19.3, -69.0], [18.4, -68.3],
  [18.3, -69.9], [18.2, -71.5], [18.2, -74.4], [18.6, -74.4],
  [19.1, -72.8], [19.9, -72.7]
]);

// Jamaica
export const JAMAICA_PATH = coordsToPath([
  [18.5, -78.3], [18.5, -76.8], [17.9, -76.2], [17.7, -77.2],
  [18.0, -78.3], [18.5, -78.3]
]);

// Puerto Rico
export const PUERTO_RICO_PATH = coordsToPath([
  [18.5, -67.2], [18.5, -65.6], [18.0, -65.6], [17.9, -67.2], [18.5, -67.2]
]);

// Bahamas Arc
export const BAHAMAS_PATH = coordsToPath([
  [26.5, -78.8], [26.0, -77.4], [25.0, -76.0], [24.0, -74.5],
  [22.5, -73.0], [21.5, -72.0], [21.0, -71.0], [22.0, -72.5],
  [23.5, -75.0], [25.0, -77.5], [26.5, -78.8]
]);

/**
 * 6. WESTERN EUROPE & BRITISH ISLES
 */
// Mainland Europe (Spain, Portugal, France, Low Countries, Germany)
const EUROPE_MAINLAND_COORDS: [number, number][] = [
  [36.1, -5.3],   // Gibraltar
  [36.5, -6.3],   // Cádiz
  [37.0, -9.0],   // Cape St. Vincent (Sagres / Algarve)
  [38.7, -9.1],   // Lisbon (Tagus Estuary)
  [40.2, -8.9],   // Figueira da Foz
  [41.1, -8.6],   // Porto (Douro)
  [42.2, -8.7],   // Vigo (Galicia)
  [43.0, -9.3],   // Cape Finisterre
  [43.6, -7.5],   // Ribadeo
  [43.5, -5.6],   // Gijón
  [43.4, -3.8],   // Santander
  [43.3, -2.0],   // San Sebastián / Bay of Biscay
  [43.5, -1.5],   // Biarritz (France)
  [44.8, -1.2],   // Arcachon / Bordeaux
  [45.6, -1.0],   // Gironde Estuary
  [46.1, -1.2],   // La Rochelle
  [47.2, -2.2],   // Saint-Nazaire / Nantes (Loire)
  [48.0, -4.5],   // Quimper (Brittany)
  [48.4, -4.5],   // Brest
  [48.6, -1.5],   // Saint-Malo
  [49.6, -1.6],   // Cherbourg
  [49.5, 0.1],    // Le Havre (Seine)
  [50.0, 1.4],    // Dieppe
  [50.9, 1.8],    // Calais
  [51.2, 3.2],    // Zeebrugge / Ostend (Flanders)
  [51.9, 4.1],    // Rotterdam (Rhine Delta)
  [52.4, 4.9],    // Amsterdam / Zuiderzee
  [53.5, 8.6],    // Bremerhaven / Weser
  [53.9, 9.1],    // Hamburg / Elbe
  [55.0, 8.5],    // Jutland / Denmark border
  // East / inland border of view
  [58.0, 12.0],   // Skagerrak
  [58.0, 30.0],   // Baltic NE margin
  [45.0, 30.0],   // Central Europe
  [36.0, 15.0],   // Mediterranean
  [36.7, -4.4],   // Málaga
  [36.1, -5.3]    // Return to Gibraltar
];

export const EUROPE_MAINLAND_PATH = coordsToPath(EUROPE_MAINLAND_COORDS);

// Great Britain
const GREAT_BRITAIN_COORDS: [number, number][] = [
  [50.1, -5.7],   // Land's End (Cornwall)
  [50.4, -4.1],   // Plymouth
  [50.6, -2.4],   // Weymouth
  [50.8, -1.1],   // Portsmouth
  [51.1, 1.3],    // Dover
  [51.5, 0.5],    // Thames Estuary (London)
  [52.5, 1.7],    // Great Yarmouth (Norfolk)
  [53.0, 0.3],    // The Wash
  [53.7, -0.3],   // Kingston upon Hull (Humber)
  [55.0, -1.4],   // Newcastle upon Tyne
  [56.0, -3.2],   // Edinburgh (Firth of Forth)
  [57.1, -2.1],   // Aberdeen
  [58.6, -3.1],   // John o' Groats (Scotland North)
  [58.5, -5.0],   // Cape Wrath
  [56.5, -5.5],   // Oban / Argyll
  [55.9, -4.7],   // Greenock / Glasgow (Firth of Clyde)
  [54.8, -3.6],   // Solway Firth
  [54.0, -2.9],   // Lancaster
  [53.4, -3.0],   // Liverpool (Mersey)
  [53.3, -4.3],   // Anglesey (Wales)
  [52.0, -5.3],   // St David's Head (Pembrokeshire)
  [51.5, -3.2],   // Cardiff
  [51.5, -2.6],   // Bristol (Avonmouth)
  [51.0, -4.2],   // Bideford (Devon)
  [50.1, -5.7]    // Return to Land's End
];

export const GREAT_BRITAIN_PATH = coordsToPath(GREAT_BRITAIN_COORDS);

// Ireland
const IRELAND_COORDS: [number, number][] = [
  [51.9, -8.3],   // Cork / Cobh
  [51.4, -9.6],   // Mizen Head (Southwest tip)
  [52.1, -10.3],  // Dingle Peninsula
  [52.6, -9.6],   // Loop Head (Shannon Estuary)
  [53.3, -9.1],   // Galway Bay
  [54.3, -10.0],  // Erris Head (Mayo)
  [55.4, -7.4],   // Malin Head (Northernmost Ireland)
  [54.6, -5.9],   // Belfast Lough
  [54.0, -6.2],   // Dundalk
  [53.3, -6.2],   // Dublin Bay
  [52.3, -6.4],   // Wexford / Rosslare
  [52.2, -7.0],   // Waterford
  [51.9, -8.3]    // Return to Cork
];

export const IRELAND_PATH = coordsToPath(IRELAND_COORDS);

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
