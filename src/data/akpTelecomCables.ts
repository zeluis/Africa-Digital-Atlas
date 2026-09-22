/**
 * akpTelecomCables.ts - Subsea Oceanic Fiber-Optic Cables & Landing Stations
 * Authoritative Coordinate Engine: 5796 x 5867 Native SVG Space
 * Data Sources: ITU, Submarine Cable Map, TeleGeography & EC JRC AKP
 */

export interface SubseaCablePath {
  id: string;
  name: string;
  operator: string;
  lengthKm: number;
  designCapacityTbps: number;
  rfsYear: number; // Ready for service
  color: string;
  strokeWidth: number;
  speedSec: number;
  dashArray?: string;
  d: string;
  description: string;
  landingCountries: string[];
  stats: { label: string; value: string }[];
  source: string;
}

export interface CableLandingStation {
  id: string;
  name: string;
  city: string;
  countryIso3: string;
  x: number;
  y: number;
  cablesConnected: string[];
  totalBandwidthTbps: number;
  status: 'Operational' | 'Upgraded' | 'Expanding';
  operator: string;
  description: string;
  labelOffset?: { x: number; y: number };
}

export const SUBSEA_CABLES_DATA: SubseaCablePath[] = [
  // 1. 2AFRICA (World's Longest Subsea Cable - 45,000 km encirclement)
  {
    id: 'cable-2africa',
    name: '2Africa Subsea Cable System',
    operator: 'Meta, Vodafone, Orange, China Mobile, Telecom Egypt',
    lengthKm: 45000,
    designCapacityTbps: 180,
    rfsYear: 2024,
    color: '#00f0ff',
    strokeWidth: 20,
    speedSec: 2.8,
    dashArray: '36 18',
    // Complete oceanic loop encircling Africa: Western Atlantic down to Cape, around to East Africa & Red Sea
    d: 'M 1780 620 C 1300 750, 480 1500, 450 2150 C 420 2800, 750 3300, 1400 3600 C 1750 3800, 2100 4200, 2500 4800 C 2700 5200, 2950 5450, 3350 5350 C 3750 5200, 4200 4700, 4250 4200 C 4300 3700, 4650 3200, 4750 2600 C 4800 2200, 4600 1800, 4250 1500 C 4000 1200, 3950 900, 3900 800',
    description: 'The world’s most comprehensive subsea cable project, interconnecting 33 countries across Africa, Europe, and the Middle East with up to 180 Tbps design capacity.',
    landingCountries: ['Egypt', 'Morocco', 'Senegal', 'Ivory Coast', 'Ghana', 'Nigeria', 'Angola', 'South Africa', 'Mozambique', 'Tanzania', 'Kenya', 'Djibouti', 'Sudan'],
    stats: [
      { label: 'System Length', value: '45,000 km (Longest Globally)' },
      { label: 'Design Capacity', value: '180 Tbps (Spatial Division Mux)' },
      { label: 'Landing Points', value: '46 Coastal Gateways' },
      { label: 'Fiber Pairs', value: '16 FP SDM Technology' }
    ],
    source: '2Africa Consortium / ITU Submarine Cable Register'
  },

  // 2. GOOGLE EQUIANO (Western Atlantic Super-Highway)
  {
    id: 'cable-equiano',
    name: 'Google Equiano Subsea Cable',
    operator: 'Google Cloud, Liquid Intelligent Technologies, WIOCC',
    lengthKm: 15000,
    designCapacityTbps: 144,
    rfsYear: 2023,
    color: '#a855f7',
    strokeWidth: 22,
    speedSec: 2.3,
    dashArray: '40 20',
    // Portugal -> Togo -> Nigeria -> Namibia -> South Africa
    d: 'M 1600 500 C 1200 800, 380 1600, 400 2300 C 420 2850, 950 3200, 1680 3050 C 2050 2950, 2150 3400, 2350 3950 C 2550 4500, 2680 5000, 2850 5320',
    description: 'Google’s state-of-the-art private subsea cable incorporating optical switching at the fiber-pair level rather than traditional wavelength switching.',
    landingCountries: ['Togo', 'Nigeria', 'Namibia', 'South Africa', 'Saint Helena'],
    stats: [
      { label: 'System Length', value: '15,000 km' },
      { label: 'Design Capacity', value: '144 Tbps' },
      { label: 'Latency Benefit', value: '~44ms Reduction to Europe' },
      { label: 'Economic Impact', value: 'Estimated +$10B GDP Boost' }
    ],
    source: 'Google Cloud Infrastructure / TeleGeography'
  },

  // 3. SEACOM / EASSy (East African Backbone)
  {
    id: 'cable-seacom-eassy',
    name: 'SEACOM & EASSy Eastern Marine Artery',
    operator: 'SEACOM, WIOCC, Liquid Dataport, Telkom Kenya',
    lengthKm: 17000,
    designCapacityTbps: 48,
    rfsYear: 2022,
    color: '#38bdf8',
    strokeWidth: 18,
    speedSec: 3.1,
    dashArray: '32 16',
    // Red Sea -> Djibouti -> Mombasa -> Dar es Salaam -> Maputo -> Mtunzini / Durban
    d: 'M 4050 1450 C 4300 1900, 4650 2300, 4600 2700 C 4550 3000, 4350 3250, 4280 3650 C 4200 4050, 4150 4400, 3950 4700 C 3750 4950, 3350 5250, 2900 5350',
    description: 'Pioneering private subsea arterial network connecting East and Southern Africa directly with Europe and India across the Indian Ocean.',
    landingCountries: ['Sudan', 'Djibouti', 'Somalia', 'Kenya', 'Tanzania', 'Mozambique', 'South Africa', 'Madagascar'],
    stats: [
      { label: 'System Length', value: '17,000 km' },
      { label: 'Capacity Upgrades', value: '48 Tbps (Coherent Optics)' },
      { label: 'Subsea Nodes', value: '11 Landing Stations' },
      { label: 'Cross-Border Feed', value: 'Feeds 9 Landlocked States' }
    ],
    source: 'SEACOM Ltd & EASSy Consortium'
  },

  // 4. ACE (Africa Coast to Europe)
  {
    id: 'cable-ace',
    name: 'ACE (Africa Coast to Europe) Cable System',
    operator: 'Orange, Sonatel, Sierra Leone Cable, Gamtel, Orange Côte d’Ivoire',
    lengthKm: 17000,
    designCapacityTbps: 21,
    rfsYear: 2020,
    color: '#f59e0b',
    strokeWidth: 16,
    speedSec: 3.4,
    dashArray: '28 14',
    // France down the West African shelf to South Africa
    d: 'M 1750 550 C 1450 850, 600 1750, 580 2200 C 560 2600, 950 2850, 1380 2900 C 1800 2950, 2180 3250, 2400 3800 C 2600 4350, 2750 4900, 2860 5290',
    description: 'Major multi-operator consortium cable connecting 24 countries from Brittany to Cape Town, providing first-time redundant connectivity to West Africa.',
    landingCountries: ['Morocco', 'Mauritania', 'Senegal', 'Gambia', 'Guinea', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Ghana', 'Benin', 'Nigeria', 'Cameroon', 'Equatorial Guinea', 'Gabon', 'Sao Tome', 'South Africa'],
    stats: [
      { label: 'Length', value: '17,000 km' },
      { label: 'Countries Connected', value: '24 Nations' },
      { label: 'Design Capacity', value: '21.6 Tbps' },
      { label: 'Key Role', value: 'Essential West African Redundancy' }
    ],
    source: 'ACE Consortium / Orange Wholesale'
  },

  // 5. PEACE CABLE (Pakistan & East Africa Connecting Europe)
  {
    id: 'cable-peace',
    name: 'PEACE Cable (Pakistan & East Africa Connecting Europe)',
    operator: 'PEACE Cable International, Cybernet, Orange, PCCW Global',
    lengthKm: 15000,
    designCapacityTbps: 96,
    rfsYear: 2023,
    color: '#10b981',
    strokeWidth: 18,
    speedSec: 2.6,
    dashArray: '34 16',
    // Europe -> Egypt -> Djibouti -> Kenya -> Seychelles
    d: 'M 3780 720 C 3920 1000, 4200 1600, 4480 2300 C 4650 2650, 4450 3000, 4280 3300 C 4200 3450, 4550 3600, 4950 3650',
    description: 'High-speed, open-access 200G/400G WDM subsea system providing lowest-latency routing between Asia, East Africa, and Europe.',
    landingCountries: ['Egypt', 'Djibouti', 'Kenya', 'Seychelles'],
    stats: [
      { label: 'Total Length', value: '15,000 km' },
      { label: 'Design Capacity', value: '96 Tbps' },
      { label: 'East Africa Latency', value: '78ms (Mombasa to Marseille)' },
      { label: 'Optics Architecture', value: 'Repeaterless Ultra-Long Haul' }
    ],
    source: 'PEACE Cable Network'
  }
];

export const SUBSEA_LANDING_STATIONS: CableLandingStation[] = [
  {
    id: 'station-tanger',
    name: 'Tanger Med / Asilah Gateway',
    city: 'Tangier',
    countryIso3: 'MAR',
    x: 1850,
    y: 720,
    cablesConnected: ['2Africa', 'SeaMeWe-3', 'Eurafrica'],
    totalBandwidthTbps: 220,
    status: 'Operational',
    operator: 'Maroc Telecom / Orange',
    description: 'Key North African crossroads connecting Maghreb terrestrial fiber to Mediterranean and Atlantic subsea routes.',
    labelOffset: { x: -280, y: -70 }
  },
  {
    id: 'station-alexandria',
    name: 'Alexandria & Zafarana Gateway',
    city: 'Alexandria / Suez',
    countryIso3: 'EGY',
    x: 3820,
    y: 980,
    cablesConnected: ['2Africa', 'PEACE', 'SeaMeWe-5', 'AAE-1', 'FLAG'],
    totalBandwidthTbps: 580,
    status: 'Operational',
    operator: 'Telecom Egypt',
    description: 'The world’s busiest digital transit choke point connecting the Mediterranean Sea and Red Sea via terrestrial optical corridors across Egypt.',
    labelOffset: { x: -300, y: -90 }
  },
  {
    id: 'station-dakar',
    name: 'Dakar Yoff Landing Hub',
    city: 'Dakar',
    countryIso3: 'SEN',
    x: 680,
    y: 2160,
    cablesConnected: ['2Africa', 'ACE', 'SAT-3/WASC', 'MainOne'],
    totalBandwidthTbps: 160,
    status: 'Operational',
    operator: 'Sonatel / Orange',
    description: 'The principal digital gateway of West Africa, bridging the ECOWAS region with direct routes to Europe and the Americas.',
    labelOffset: { x: -300, y: -70 }
  },
  {
    id: 'station-lagos',
    name: 'Lagos Victoria Island / Lekki Hub',
    city: 'Lagos',
    countryIso3: 'NGA',
    x: 2050,
    y: 2680,
    cablesConnected: ['2Africa', 'Equiano', 'MainOne', 'ACE', 'SAT-3', 'WACS'],
    totalBandwidthTbps: 340,
    status: 'Operational',
    operator: 'MainOne / Equinix / Google',
    description: 'The largest subsea broadband landing cluster in Sub-Saharan Africa, powering Nigeria’s booming fintech and tech startup ecosystem.',
    labelOffset: { x: -300, y: 110 }
  },
  {
    id: 'station-abidjan',
    name: 'Abidjan Port-Bouët Landing Hub',
    city: 'Abidjan',
    countryIso3: 'CIV',
    x: 1380,
    y: 2710,
    cablesConnected: ['2Africa', 'ACE', 'MainOne', 'WACS'],
    totalBandwidthTbps: 180,
    status: 'Operational',
    operator: 'Orange CI / MTN',
    description: 'Francophone West Africa’s primary cloud and data center hub, feeding landlocked Mali and Burkina Faso.',
    labelOffset: { x: -290, y: 80 }
  },
  {
    id: 'station-luanda',
    name: 'Luanda Sangano Landing Station',
    city: 'Luanda',
    countryIso3: 'AGO',
    x: 2650,
    y: 3580,
    cablesConnected: ['2Africa', 'SACS (South Atlantic Cable System)', 'WACS', 'Monet'],
    totalBandwidthTbps: 190,
    status: 'Operational',
    operator: 'Angola Cables',
    description: 'Direct trans-Atlantic gateway connecting Africa to South America (Fortaleza, Brazil) and onward to North America.',
    labelOffset: { x: -300, y: 70 }
  },
  {
    id: 'station-capetown',
    name: 'Cape Town Melkbosstrand & Yzerfontein',
    city: 'Cape Town',
    countryIso3: 'ZAF',
    x: 2850,
    y: 5260,
    cablesConnected: ['2Africa', 'Equiano', 'WACS', 'SAT-3/WASC', 'SAFE', 'ACE'],
    totalBandwidthTbps: 420,
    status: 'Operational',
    operator: 'Telkom SA / Liquid Telecom / Google',
    description: 'The southern terminus of continental connectivity, linking the Atlantic and Indian Ocean fiber rings into Southern Africa.',
    labelOffset: { x: -300, y: -70 }
  },
  {
    id: 'station-mtunzini',
    name: 'Mtunzini / Durban Cable Terminal',
    city: 'Durban / Mtunzini',
    countryIso3: 'ZAF',
    x: 3880,
    y: 4700,
    cablesConnected: ['2Africa', 'SEACOM', 'EASSy', 'SAFE', 'METISS'],
    totalBandwidthTbps: 310,
    status: 'Operational',
    operator: 'Telkom SA / SEACOM',
    description: 'The Indian Ocean gateway providing high-speed direct backbones north through Mozambique and east to Madagascar and Mauritius.',
    labelOffset: { x: 300, y: 80 }
  },
  {
    id: 'station-mombasa',
    name: 'Mombasa Nyali Subsea Terminal',
    city: 'Mombasa',
    countryIso3: 'KEN',
    x: 4220,
    y: 3120,
    cablesConnected: ['2Africa', 'PEACE', 'SEACOM', 'EASSy', 'TEAMS', 'LION2'],
    totalBandwidthTbps: 360,
    status: 'Operational',
    operator: 'Telkom Kenya / Safaricom / WIOCC',
    description: 'The East African Silicon Savannah gateway, distributing multi-terabit bandwidth across Kenya, Uganda, Rwanda, South Sudan, and Eastern DRC.',
    labelOffset: { x: 300, y: -40 }
  },
  {
    id: 'station-djibouti',
    name: 'Djibouti City Marine Terminal',
    city: 'Djibouti City',
    countryIso3: 'DJI',
    x: 4460,
    y: 2360,
    cablesConnected: ['2Africa', 'PEACE', 'SEACOM', 'EASSy', 'AAE-1', 'SeaMeWe-5', 'DAHRE'],
    totalBandwidthTbps: 450,
    status: 'Operational',
    operator: 'Djibouti Telecom',
    description: 'Strategically situated at the Bab-el-Mandeb Strait, hosting 10+ subsea cables and acting as the digital gateway for the Horn of Africa and landlocked Ethiopia.',
    labelOffset: { x: 300, y: -70 }
  }
];
