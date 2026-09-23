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
 * 3. SOUTH AMERICA CONTINENT (Authentic High-Density Atlantic & Continental Bounds)
 */
const SOUTH_AMERICA_COORDS: [number, number][] = [
  // Caribbean Coast of Colombia & Venezuela
  [8.2, -77.5],   // Darién / Colombia border
  [8.8, -76.8],   // Gulf of Urabá
  [9.4, -75.8],   // Tolú
  [10.4, -75.5],  // Cartagena de Indias
  [10.9, -74.8],  // Barranquilla / Magdalena River
  [11.2, -74.2],  // Santa Marta
  [11.8, -72.9],  // Riohacha (La Guajira)
  [12.2, -72.0],  // Cabo de la Vela
  [12.5, -71.6],  // Punta Gallinas (Northernmost Point of South America)
  [11.8, -71.3],  // Gulf of Venezuela West
  [11.0, -71.6],  // Maracaibo Channel
  [11.7, -70.2],  // Paraguaná Peninsula (Coro)
  [11.9, -69.9],  // Cape San Román
  [10.8, -69.2],  // Tucacas
  [10.5, -68.0],  // Puerto Cabello
  [10.6, -66.9],  // La Guaira / Caracas
  [10.5, -66.0],  // Higuerote
  [10.2, -64.7],  // Puerto La Cruz / Barcelona
  [10.5, -63.8],  // Cumaná
  [10.6, -62.0],  // Paria Peninsula
  [9.8, -62.2],   // Gulf of Paria (Guiria)
  // Orinoco Delta & The Guianas
  [8.6, -60.4],   // Orinoco River Delta
  [7.8, -59.5],   // Moruka / Essequibo
  [6.8, -58.1],   // Georgetown (Demerara, Guyana)
  [6.3, -57.5],   // Berbice
  [5.9, -56.5],   // Corantijn River
  [5.8, -55.2],   // Paramaribo (Suriname River)
  [5.4, -54.0],   // Maroni River (French Guiana border)
  [4.9, -52.3],   // Cayenne (French Guiana)
  [4.4, -51.6],   // Cape Orange / Oyapock River
  // Equatorial Brazil & Amazon Basin
  [2.0, -50.5],   // Amapá Coast
  [0.5, -50.0],   // Equator / Amazon Delta North
  [-0.5, -48.5],  // Marajó Island / Pará River Estuary
  [-1.4, -48.5],  // Belém do Pará
  [-1.2, -46.8],  // Bragança Coast
  [-1.8, -45.0],  // Gurupi River
  [-2.5, -44.3],  // Baía de São Marcos / São Luís (Maranhão)
  [-2.8, -42.8],  // Lençóis Maranhenses
  [-2.9, -41.8],  // Parnaíba Delta (Piauí)
  [-3.0, -40.5],  // Camocim
  [-3.7, -38.5],  // Fortaleza (Ceará)
  [-4.4, -37.8],  // Aracati
  [-5.1, -36.6],  // Macau (Rio Grande do Norte)
  [-5.5, -35.2],  // Cape São Roque / Touros
  [-5.8, -35.2],  // Natal (Eastern Atlantic Salient)
  [-6.5, -35.0],  // Baía Formosa
  [-7.15, -34.8], // Ponta do Seixas / João Pessoa (Easternmost tip of Americas)
  [-8.05, -34.9], // Recife / Olinda (Pernambuco)
  [-8.7, -35.1],  // Tamandaré
  [-9.7, -35.7],  // Maceió (Alagoas)
  [-10.5, -36.4], // São Francisco River Mouth
  [-10.9, -37.0], // Aracaju (Sergipe)
  [-11.5, -37.4], // Mangue Seco
  [-12.7, -38.0], // Praia do Forte
  [-12.98, -38.5],// Salvador da Bahia (Bay of All Saints)
  [-13.8, -39.0], // Camamu Bay
  [-14.8, -39.0], // Ilhéus
  [-15.6, -38.9], // Canavieiras
  [-16.4, -39.1], // Porto Seguro / Santa Cruz Cabrália (1500 Landfall)
  [-17.9, -39.5], // Caravelas / Abrolhos Archipelago
  [-18.5, -39.7], // Mucuri / Conceição da Barra
  [-19.6, -39.8], // Linhares / Rio Doce
  [-20.3, -40.3], // Vitória / Vila Velha (Espírito Santo)
  [-20.8, -40.6], // Guarapari
  [-21.8, -41.0], // Campos dos Goytacazes / Cabo de São Tomé
  [-22.5, -41.9], // Macaé
  [-22.98, -42.0],// Cabo Frio / Búzios
  [-22.95, -43.15],// Rio de Janeiro / Guanabara Bay (Valongo Complex)
  [-23.1, -44.2], // Ilha Grande / Angra dos Reis
  [-23.2, -44.7], // Paraty
  [-23.5, -45.1], // Ubatuba
  [-23.8, -45.4], // Ilhabela / São Sebastião
  [-23.95, -46.3],// Santos / São Paulo
  [-24.5, -47.0], // Peruíbe
  [-25.0, -47.8], // Cananéia / Ilha Comprida
  [-25.5, -48.5], // Paranaguá (Paraná)
  [-26.2, -48.6], // São Francisco do Sul
  [-27.0, -48.6], // Itajaí
  [-27.6, -48.5], // Florianópolis / Santa Catarina Island
  [-28.3, -48.7], // Imbituba
  [-28.5, -48.8], // Laguna
  [-29.3, -49.7], // Araranguá
  [-30.0, -50.1], // Tramandaí (Rio Grande do Sul)
  [-31.3, -51.0], // Lagoa dos Patos
  [-32.0, -52.1], // Rio Grande / Pelotas
  [-32.6, -52.5], // Hermenegildo
  [-33.7, -53.5], // Chuy / Barra del Chuy (Uruguay border)
  // Uruguay & Río de la Plata Estuary
  [-34.4, -53.8], // La Paloma (Rocha)
  [-34.9, -54.9], // Punta del Este / Maldonado
  [-34.9, -56.2], // Montevideo (Bahía de Montevideo)
  [-34.5, -57.8], // Colonia del Sacramento
  [-34.2, -58.4], // Delta del Paraná
  [-34.6, -58.4], // Buenos Aires (Puerto de Buenos Aires, Argentina)
  [-35.2, -57.3], // La Plata / Punta Indio
  [-35.8, -57.4], // Bahía de Samborombón
  [-36.3, -56.7], // Cabo San Antonio
  [-37.0, -56.8], // Pinamar
  [-38.0, -57.5], // Mar del Plata (Cabo Corrientes)
  [-38.0, -62.0], // Bahía Blanca / Colorado River Estuary
  // Natural Continental Interior / Pacific Contour
  [-38.0, -73.5], // Chilean Pacific Coast
  [-33.0, -71.6], // Valparaíso / Santiago
  [-23.6, -70.4], // Antofagasta
  [-18.5, -70.3], // Arica
  [-12.0, -77.1], // Callao / Lima (Peru)
  [-5.0, -81.1],  // Cabo Blanco / Piura
  [-2.2, -80.0],  // Guayaquil (Ecuador)
  [1.0, -79.0],   // Esmeraldas
  [3.9, -77.1],   // Buenaventura (Colombia)
  [6.5, -77.4],   // Nuquí
  [8.2, -77.5]    // Darién Closure
];

export const SOUTH_AMERICA_PATH = coordsToPath(SOUTH_AMERICA_COORDS);

/**
 * 4. NORTH AMERICA, CENTRAL AMERICA & GULF OF MEXICO (High-Fidelity)
 */
const NORTH_AMERICA_COORDS: [number, number][] = [
  // Central America Isthmus
  [8.2, -77.5],   // Darién / Panama
  [9.0, -79.5],   // Panama Pacific / Canal Corridor
  [9.3, -79.9],   // Colón / Portobelo
  [9.6, -82.4],   // Bocas del Toro
  [10.0, -83.0],  // Puerto Limón (Costa Rica)
  [10.9, -83.7],  // San Juan del Norte / Greytown
  [12.0, -83.7],  // Bluefields (Mosquito Coast, Nicaragua)
  [14.0, -83.3],  // Puerto Cabezas / Bilwi
  [15.0, -83.1],  // Cabo Gracias a Dios
  [15.9, -86.0],  // Trujillo (Honduras)
  [15.8, -87.5],  // La Ceiba
  [15.8, -88.0],  // Puerto Cortés / Gulf of Honduras
  [16.0, -88.8],  // Livingston / Puerto Barrios (Guatemala)
  [17.5, -88.2],  // Belize City
  [18.5, -88.3],  // Chetumal (Yucatán Peninsula)
  [19.6, -87.4],  // Bahía de la Ascensión
  [20.5, -86.9],  // Cozumel Channel
  [21.2, -86.8],  // Cancún (Quintana Roo)
  [21.6, -87.1],  // Cabo Catoche
  [21.5, -88.2],  // Río Lagartos
  [21.3, -89.6],  // Progreso / Mérida (Yucatán)
  [20.8, -90.4],  // Celestún
  [19.8, -90.5],  // Campeche
  [18.6, -91.8],  // Ciudad del Carmen / Laguna de Términos
  [18.4, -93.2],  // Frontera / Tabasco
  [18.1, -94.5],  // Coatzacoalcos
  [18.6, -95.0],  // Los Tuxtlas
  [19.2, -96.1],  // Veracruz (San Juan de Ulúa)
  [20.5, -97.3],  // Tuxpan
  [22.2, -97.8],  // Tampico (Tamaulipas)
  [24.0, -97.7],  // La Pesca
  [25.9, -97.1],  // Matamoros / Rio Grande Estuary
  // United States Gulf Coast
  [27.8, -97.4],  // Corpus Christi (Texas)
  [28.7, -95.6],  // Matagorda Bay
  [29.3, -94.8],  // Galveston Island / Bay
  [29.7, -93.8],  // Sabine Pass / Port Arthur
  [29.8, -92.5],  // Vermilion Bay (Louisiana)
  [29.2, -90.0],  // Barataria Bay
  [29.1, -89.2],  // Mississippi River Balize (Delta South Pass)
  [29.6, -89.3],  // Chandeleur Sound
  [30.0, -89.8],  // Lake Borgne / New Orleans
  [30.4, -88.5],  // Pascagoula / Mississippi Coast
  [30.2, -88.0],  // Mobile Bay (Africatown / Fort Morgan)
  [30.4, -87.2],  // Pensacola Bay (Florida)
  [30.1, -85.6],  // Panama City / St. Andrew Bay
  [29.7, -85.0],  // Apalachicola Bay / Cape San Blas
  [29.9, -84.0],  // Apalachee Bay
  [29.1, -83.0],  // Suwannee / Cedar Key
  [28.0, -82.8],  // Tampa Bay / St. Petersburg
  [27.4, -82.6],  // Sarasota
  [26.7, -82.2],  // Charlotte Harbor
  [26.1, -81.8],  // Naples / Marco Island
  [25.5, -81.2],  // Ten Thousand Islands
  [25.1, -81.1],  // Cape Sable / Florida Bay
  [24.5, -81.8],  // Key West (Southernmost Point)
  [24.8, -80.7],  // Marathon / Seven Mile Reef
  [25.1, -80.4],  // Key Largo
  // United States Atlantic Seaboard
  [25.8, -80.1],  // Miami / Biscayne Bay
  [26.1, -80.1],  // Fort Lauderdale
  [26.7, -80.0],  // Palm Beach
  [27.5, -80.3],  // Fort Pierce
  [28.4, -80.5],  // Cape Canaveral
  [29.2, -81.0],  // Daytona Beach
  [29.9, -81.3],  // St. Augustine (Oldest European City in USA)
  [30.4, -81.4],  // Jacksonville / St. Johns River
  [30.8, -81.4],  // Cumberland Island (Georgia)
  [31.2, -81.4],  // St. Simons Island / Brunswick
  [31.6, -81.2],  // Sapelo Island
  [32.0, -80.9],  // Savannah (Tybee Island)
  [32.3, -80.6],  // Port Royal / Beaufort / St. Helena
  [32.8, -79.8],  // Charleston Harbor / Sullivan's Island
  [33.3, -79.2],  // Georgetown / Winyah Bay
  [33.9, -78.0],  // Cape Fear / Wilmington (North Carolina)
  [34.6, -76.5],  // Cape Lookout
  [35.2, -75.5],  // Cape Hatteras (Outer Banks / Diamond Shoals)
  [35.8, -75.5],  // Roanoke Island / Nags Head
  [36.9, -76.0],  // Cape Henry / Chesapeake Bay Entrance
  [37.2, -76.3],  // Yorktown / Hampton Roads (Virginia)
  [37.7, -76.3],  // Rappahannock Estuary
  [38.3, -76.4],  // Potomac Estuary / St. Mary's
  [38.8, -75.1],  // Cape Henlopen / Delaware Bay
  [38.9, -74.9],  // Cape May (New Jersey)
  [39.4, -74.4],  // Atlantic City
  [40.4, -74.0],  // Sandy Hook / Raritan Bay
  [40.7, -74.0],  // New York Harbor / Manhattan / Staten Island
  [40.6, -73.3],  // Fire Island / Long Island South Shore
  [41.0, -71.8],  // Montauk Point (Long Island tip)
  [41.3, -72.0],  // Long Island Sound / New London
  [41.5, -71.3],  // Narragansett Bay / Newport / Providence
  [41.7, -70.6],  // Buzzards Bay
  [41.3, -70.6],  // Martha's Vineyard
  [41.3, -70.1],  // Nantucket
  [41.7, -70.0],  // Cape Cod / Chatham
  [42.0, -70.2],  // Provincetown / Race Point
  [42.3, -70.9],  // Boston Harbor / Massachusetts Bay
  [42.6, -70.6],  // Cape Ann / Gloucester
  [43.0, -70.7],  // Portsmouth (New Hampshire)
  [43.6, -70.2],  // Portland / Casco Bay (Maine)
  [44.2, -69.0],  // Penobscot Bay
  [44.4, -68.2],  // Mount Desert Island / Bar Harbor
  [45.0, -67.0],  // Passamaquoddy Bay / Bay of Fundy
  // Atlantic Canada
  [43.8, -66.1],  // Yarmouth (Nova Scotia)
  [44.6, -63.6],  // Halifax Harbor
  [45.3, -61.0],  // Cape Canso
  [46.3, -60.5],  // Cape Breton Island / Louisbourg
  [46.6, -53.0],  // Cape Race (Newfoundland)
  [47.5, -52.7],  // St. John's Harbor
  [51.5, -55.5],  // Strait of Belle Isle
  [54.0, -57.0],  // Hamilton Inlet / Labrador
  [58.0, -62.5],  // Northern Labrador Coast
  // Clean Continental Margin
  [58.0, -105.0], // Northwest Viewport Boundary
  [30.0, -105.0], // Inland Southwest Margin
  [16.0, -95.0],  // Isthmus of Tehuantepec (Pacific)
  [14.0, -91.0],  // Guatemala Pacific Coast
  [8.2, -77.5]    // Darién Closure
];

export const NORTH_AMERICA_PATH = coordsToPath(NORTH_AMERICA_COORDS);

/**
 * 5. CARIBBEAN ARCHIPELAGO (High-Detail Geometry)
 */
// Cuba (Detailed Coastline from Cabo San Antonio to Maisí)
export const CUBA_PATH = coordsToPath([
  [21.8, -84.9], [22.0, -84.3], [22.4, -83.7], [22.9, -83.2], [23.1, -82.4],
  [23.2, -81.2], [23.1, -80.5], [22.8, -79.5], [22.3, -78.3], [21.5, -77.0],
  [21.2, -76.0], [20.6, -75.0], [20.2, -74.15],[20.0, -74.4], [19.8, -75.2],
  [19.9, -76.0], [19.9, -77.3], [20.4, -77.7], [21.5, -79.0], [21.8, -80.5],
  [22.1, -82.0], [22.1, -83.5], [21.8, -84.9]
]);

// Hispaniola (Haiti & Dominican Republic)
export const HISPANIOLA_PATH = coordsToPath([
  [19.9, -72.7], [19.8, -71.8], [19.9, -71.0], [19.8, -70.0], [19.3, -69.0],
  [18.6, -68.3], [18.3, -68.8], [18.4, -69.6], [18.3, -70.3], [18.2, -71.2],
  [18.1, -71.7], [18.2, -73.0], [18.2, -74.4], [18.6, -74.4], [18.5, -73.5],
  [19.1, -72.8], [19.5, -73.3], [19.9, -72.7]
]);

// Jamaica
export const JAMAICA_PATH = coordsToPath([
  [18.5, -78.3], [18.5, -77.7], [18.4, -76.8], [18.2, -76.3], [17.9, -76.2],
  [17.8, -76.9], [17.7, -77.4], [17.9, -78.1], [18.2, -78.3], [18.5, -78.3]
]);

// Puerto Rico
export const PUERTO_RICO_PATH = coordsToPath([
  [18.5, -67.2], [18.5, -66.5], [18.4, -65.6], [18.2, -65.6], [17.9, -65.9],
  [17.9, -66.6], [18.0, -67.2], [18.2, -67.2], [18.5, -67.2]
]);

// Bahamas Arc
export const BAHAMAS_PATH = coordsToPath([
  [26.9, -78.9], [26.5, -77.8], [25.8, -77.3], [25.0, -76.1], [24.0, -74.5],
  [23.0, -73.2], [21.5, -71.5], [21.0, -71.2], [21.8, -72.2], [22.7, -73.8],
  [23.8, -75.2], [24.8, -76.8], [25.8, -78.0], [26.9, -78.9]
]);

// Lesser Antilles Chain (Windward & Leeward Islands: Guadeloupe, Martinique, Barbados, Trinidad)
export const LESSER_ANTILLES_PATH = coordsToPath([
  [17.8, -62.8], [17.1, -61.8], [16.3, -61.5], [15.4, -61.3],
  [14.7, -61.0], [14.0, -60.9], [13.2, -59.5], [13.1, -61.2],
  [12.1, -61.7], [10.8, -61.0], [10.1, -61.0], [10.2, -61.9],
  [10.8, -61.5], [12.2, -62.0], [14.1, -61.2], [16.4, -61.8],
  [17.8, -62.8]
]);

/**
 * 6. WESTERN EUROPE & BRITISH ISLES (Authentic High-Density Coastline)
 * Strictly calibrated north of 36.0°N to guarantee the Strait of Gibraltar & zero overlap with Africa.
 */
const EUROPE_MAINLAND_COORDS: [number, number][] = [
  // Strait of Gibraltar & Southern Spain (Strictly Lat >= 36.0°N)
  [36.0, -5.6],   // Tarifa / Strait of Gibraltar (Southernmost point of mainland Europe)
  [36.14, -5.35], // Gibraltar (The Rock)
  [36.5, -6.3],   // Cádiz / Sanlúcar de Barrameda
  [37.1, -6.9],   // Huelva / Palos de la Frontera (Columbus 1492 Departure)
  [37.0, -7.9],   // Faro (Algarve, Portugal)
  [37.0, -9.0],   // Cape St. Vincent (Sagres / Infante Dom Henrique Navigation School)
  [37.9, -8.9],   // Sines (Vasco da Gama Birthplace)
  [38.4, -9.0],   // Cabo Espichel
  [38.7, -9.2],   // Lisbon (Tagus Estuary / Belém Tower)
  [38.8, -9.5],   // Cabo da Roca (Westernmost Point of Mainland Europe)
  [39.3, -9.4],   // Peniche
  [39.6, -9.1],   // Nazaré
  [40.2, -8.9],   // Figueira da Foz (Mondego)
  [40.6, -8.7],   // Aveiro Lagoon
  [41.15, -8.7],  // Porto (Douro River Estuary)
  [41.7, -8.8],   // Viana do Castelo
  [42.0, -8.9],   // Minho River Mouth (Portugal/Spain Border)
  [42.2, -8.8],   // Rías Baixas / Vigo (Galicia)
  [42.5, -9.0],   // Ría de Arousa
  [42.9, -9.3],   // Cape Finisterre (End of the Known World)
  [43.4, -8.4],   // A Coruña (Tower of Hercules)
  [43.7, -7.9],   // Cabo Ortegal
  [43.5, -7.0],   // Ribadeo (Asturias Border)
  [43.5, -5.7],   // Gijón / Avilés
  [43.5, -3.8],   // Santander (Cantabria)
  [43.3, -3.0],   // Bilbao / Nervión Estuary (Basque Country)
  [43.3, -2.0],   // San Sebastián / Bay of Biscay
  [43.5, -1.5],   // Biarritz / Bayonne (France)
  [44.6, -1.2],   // Arcachon Basin / Dune du Pilat
  [45.6, -1.0],   // Gironde Estuary / Bordeaux Corridor
  [46.15, -1.2],  // La Rochelle (Major Atlantic Slave Trade Port)
  [46.5, -1.8],   // Les Sables-d'Olonne (Vendée)
  [47.2, -2.2],   // Saint-Nazaire / Nantes (Loire Estuary, Top French Slave Port)
  [47.5, -3.1],   // Quiberon Peninsula
  [47.7, -3.4],   // Lorient (French East India Company base)
  [48.0, -4.7],   // Pointe du Raz
  [48.4, -4.5],   // Brest (Finistère, French Atlantic Naval Base)
  [48.6, -1.5],   // Mont Saint-Michel / Saint-Malo (Corsair Port)
  [49.6, -1.6],   // Cherbourg (Cotentin Peninsula, Normandy)
  [49.5, 0.1],    // Le Havre (Seine Estuary, Triangular Trade Base)
  [49.9, 1.1],    // Dieppe
  [50.7, 1.6],    // Boulogne-sur-Mer
  [50.95, 1.85],  // Calais / Strait of Dover
  [51.05, 2.4],   // Dunkirk
  [51.2, 2.9],    // Ostend (Flanders, Belgium)
  [51.3, 3.2],    // Zeebrugge / Bruges
  [51.5, 4.0],    // Scheldt Estuary / Antwerp
  [51.9, 4.2],    // Rotterdam (Rhine-Meuse Delta)
  [52.1, 4.3],    // The Hague / Scheveningen
  [52.45, 4.6],   // IJmuiden / Amsterdam
  [52.95, 4.75],  // Den Helder / Texel / Zuiderzee
  [53.4, 6.9],    // Ems Estuary (Groningen / Emden)
  [53.55, 8.6],   // Weser Estuary / Bremerhaven / Bremen
  [53.9, 8.7],    // Cuxhaven / Elbe Estuary / Hamburg
  [54.8, 8.5],    // North Frisian Coast
  [55.5, 8.4],    // Esbjerg (Jutland, Denmark)
  [57.7, 10.6],   // Skagen (Northernmost Denmark)
  [56.1, 10.2],   // Kattegat Coast
  [55.7, 12.6],   // Copenhagen / Øresund Sound
  // Continental East Margin
  [58.0, 11.5],   // Skagerrak
  [58.0, 30.0],   // Baltic Margin
  [45.0, 20.0],   // Central Europe Frame
  // European Mediterranean Coastline (Stays strictly Lat >= 36.5°N)
  [45.65, 13.78], // Trieste (Adriatic)
  [45.4, 12.3],   // Venice Lagoon
  [44.0, 12.5],   // Rimini
  [43.6, 13.5],   // Ancona
  [41.8, 16.0],   // Gargano Peninsula
  [40.8, 17.5],   // Bari
  [40.14, 18.5],  // Otranto (Apulia)
  [40.47, 17.24], // Taranto (Gulf of Taranto)
  [39.0, 17.1],   // Crotone (Calabria)
  [38.11, 15.65], // Strait of Messina / Reggio Calabria
  [39.0, 16.0],   // Tyrrhenian Calabria
  [40.6, 14.8],   // Salerno
  [40.85, 14.26], // Naples / Bay of Naples
  [41.73, 12.28], // Rome / Ostia (Tiber Mouth)
  [43.54, 10.31], // Livorno (Tuscany)
  [44.4, 8.93],   // Genoa / Ligurian Coast
  [43.7, 7.26],   // Nice / Monaco / French Riviera
  [43.29, 5.37],  // Marseille / Gulf of Lion
  [43.4, 4.6],    // Rhône Delta / Camargue
  [43.4, 3.7],    // Sète
  [42.6, 3.0],    // Perpignan / Pyrenees Mediterranean border
  [42.26, 3.17],  // Costa Brava / Roses
  [41.38, 2.18],  // Barcelona (Catalonia)
  [40.71, 0.72],  // Ebro River Delta
  [39.47, -0.37], // Valencia / Gulf of Valencia
  [38.34, -0.48], // Alicante / Cabo de la Nao
  [37.6, -0.98],  // Cartagena (Murcia)
  [36.72, -2.19], // Cabo de Gata (Almería)
  [36.72, -4.42], // Málaga (Costa del Sol)
  [36.5, -4.9],   // Marbella
  [36.0, -5.6]    // Return cleanly to Tarifa / Strait of Gibraltar
];

export const EUROPE_MAINLAND_PATH = coordsToPath(EUROPE_MAINLAND_COORDS);

// Great Britain (Authentic Detailed Coastline)
const GREAT_BRITAIN_COORDS: [number, number][] = [
  [50.1, -5.7],   // Land's End (Cornwall)
  [50.0, -5.2],   // Lizard Point (Southernmost Point)
  [50.3, -4.8],   // Falmouth
  [50.4, -4.1],   // Plymouth Sound
  [50.4, -3.5],   // Torbay
  [50.6, -2.4],   // Portland Bill / Weymouth
  [50.7, -1.9],   // Poole Harbour
  [50.8, -1.1],   // Portsmouth / The Solent
  [50.8, 0.0],    // Beachy Head
  [51.1, 1.3],    // Dover (White Cliffs)
  [51.4, 1.4],    // North Foreland (Thanet)
  [51.5, 0.5],    // Thames Estuary / Port of London
  [51.8, 1.3],    // Harwich / Essex
  [52.1, 1.6],    // Aldeburgh (Suffolk)
  [52.5, 1.7],    // Great Yarmouth (Norfolk)
  [53.0, 0.3],    // The Wash
  [53.7, -0.3],   // Humber Estuary / Kingston upon Hull
  [54.1, -0.1],   // Flamborough Head
  [54.5, -0.6],   // Whitby
  [55.0, -1.4],   // Newcastle upon Tyne / Tynemouth
  [55.8, -2.0],   // Berwick-upon-Tweed (Scotland Border)
  [56.0, -3.2],   // Edinburgh / Firth of Forth
  [56.5, -2.6],   // Dundee / Firth of Tay
  [57.1, -2.1],   // Aberdeen
  [57.7, -3.4],   // Moray Firth / Inverness
  [58.6, -3.1],   // John o' Groats (Scotland North)
  [58.6, -4.9],   // Cape Wrath (Scottish Highlands)
  [57.8, -5.7],   // Wester Ross / Isle of Skye Minch
  [56.5, -5.5],   // Oban / Argyll
  [55.9, -4.7],   // Glasgow / Greenock (Firth of Clyde, Tobacco Trade Hub)
  [54.8, -3.6],   // Solway Firth
  [54.1, -3.2],   // Barrow-in-Furness
  [54.0, -2.9],   // Lancaster / Morecambe Bay (Slave Port)
  [53.4, -3.0],   // Liverpool / Mersey Estuary (Top Global Slave Trading Port)
  [53.3, -4.3],   // Anglesey / Holyhead (Wales)
  [52.8, -4.2],   // Cardigan Bay
  [52.0, -5.3],   // St David's Head (Pembrokeshire)
  [51.7, -5.0],   // Milford Haven
  [51.6, -3.9],   // Swansea
  [51.5, -3.2],   // Cardiff
  [51.5, -2.6],   // Bristol / Avonmouth (Historic Triangular Trade Capital)
  [51.2, -3.5],   // Exmoor Coast
  [51.0, -4.2],   // Bideford / Barnstaple (Devon)
  [50.7, -4.5],   // Bude
  [50.1, -5.7]    // Return to Land's End
];

export const GREAT_BRITAIN_PATH = coordsToPath(GREAT_BRITAIN_COORDS);

// Ireland (Authentic Detailed Coastline)
const IRELAND_COORDS: [number, number][] = [
  [51.9, -8.3],   // Cork Harbour / Cobh
  [51.5, -9.0],   // Kinsale
  [51.4, -9.6],   // Mizen Head (Southwesternmost Tip)
  [51.6, -9.8],   // Bantry Bay
  [51.8, -10.3],  // Iveragh Peninsula (Ring of Kerry)
  [52.1, -10.3],  // Dingle Peninsula
  [52.6, -9.6],   // Loop Head / Shannon Estuary
  [52.9, -9.4],   // Cliffs of Moher
  [53.3, -9.1],   // Galway Bay / The Claddagh
  [53.5, -10.1],  // Connemara / Slyne Head
  [53.8, -9.6],   // Clew Bay / Westport
  [54.3, -10.0],  // Erris Head / Mayo
  [54.5, -8.5],   // Sligo Bay / Donegal Bay
  [54.7, -8.8],   // Slieve League (Donegal)
  [55.3, -7.4],   // Malin Head (Northernmost Ireland)
  [55.2, -6.5],   // Giant's Causeway / Antrim Coast
  [54.6, -5.9],   // Belfast Lough
  [54.3, -5.5],   // Strangford Lough
  [54.0, -6.2],   // Dundalk Bay
  [53.7, -6.2],   // Boyne Estuary / Drogheda
  [53.35, -6.2],  // Dublin Bay (Liffey)
  [52.8, -6.0],   // Wicklow Head
  [52.3, -6.4],   // Wexford Harbour / Rosslare
  [52.2, -6.9],   // Hook Head
  [52.2, -7.0],   // Waterford / Suir Estuary
  [51.9, -7.8],   // Youghal
  [51.9, -8.3]    // Return to Cork
];

export const IRELAND_PATH = coordsToPath(IRELAND_COORDS);

// Mediterranean Islands (Balearic Islands, Corsica & Sardinia, Sicily)
export const BALEARIC_PATH = coordsToPath([
  [39.6, 2.4], [39.9, 3.1], [39.7, 3.4], [39.3, 3.2], [39.5, 2.4], [39.6, 2.4]
]);

export const SARDINIA_CORSICA_PATH = coordsToPath([
  [43.0, 9.4], [42.0, 9.5], [41.4, 9.2], [41.2, 9.4], [39.2, 9.3],
  [38.9, 8.8], [39.3, 8.4], [40.8, 8.2], [41.2, 8.6], [41.4, 8.6],
  [42.6, 8.7], [43.0, 9.4]
]);

export const SICILY_PATH = coordsToPath([
  [38.2, 12.5], [38.3, 15.6], [37.0, 15.3], [36.7, 14.8], [37.5, 12.5], [38.2, 12.5]
]);

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
