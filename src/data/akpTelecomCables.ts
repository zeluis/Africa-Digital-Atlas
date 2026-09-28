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
    // Complete oceanic loop: Gibraltar Atlantic entrance -> Moroccan shelf -> Mauritania -> Cap-Vert -> Gulf of Guinea -> Southern Ocean rounding Agulhas -> Indian Ocean -> Red Sea & Suez
    d: 'M 1420 180 C 1320 380, 1180 720, 980 1150 C 780 1580, 580 1900, 320 2180 C 450 2520, 750 2820, 1380 2860 C 1680 2880, 1950 2860, 2080 2880 C 2240 2950, 2380 3150, 2460 3400 C 2550 3750, 2660 4350, 2740 4950 C 2850 5450, 2980 5650, 3220 5860 C 3550 5920, 3880 5860, 4180 5650 C 4420 5200, 4580 4650, 4680 4000 C 4750 3200, 4820 2600, 5450 1780 C 5650 1680, 5300 1580, 4950 1620 C 4720 1620, 4520 1350, 4420 1050 C 4350 850, 4280 650, 4220 450 C 4150 300, 3750 250, 3450 240',
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
    // Portugal -> Moroccan Shelf -> Dakar Loop -> Gulf of Guinea -> Namibia -> Southern Ocean Cape Terminal
    d: 'M 1380 120 C 1280 340, 1140 680, 940 1100 C 740 1520, 540 1850, 280 2160 C 420 2500, 720 2800, 1350 2840 C 1650 2860, 1850 2870, 2050 2870 C 2200 2930, 2350 3120, 2430 3380 C 2520 3720, 2630 4320, 2720 4920 C 2820 5420, 2960 5620, 3200 5840 C 3480 5900, 3680 5880, 3850 5780',
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
    // Red Sea -> Gulf of Aden -> Guardafui Loop -> Mombasa -> Mozambique Channel -> Rounding South Africa in Southern Ocean
    d: 'M 4220 450 C 4320 750, 4450 1150, 4580 1480 C 4720 1650, 5050 1620, 5420 1650 C 5680 1780, 5450 2150, 5100 2550 C 4850 2900, 4750 3400, 4650 3950 C 4550 4500, 4400 5150, 4150 5620 C 3850 5860, 3520 5900, 3200 5840',
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
    // France -> Gibraltar Atlantic shelf -> Morocco -> Dakar -> Gulf of Guinea -> South Africa Cape
    d: 'M 1400 150 C 1300 360, 1160 700, 960 1120 C 760 1540, 560 1870, 300 2170 C 440 2510, 740 2810, 1360 2850 C 1660 2870, 1920 2865, 2060 2875 C 2220 2940, 2360 3140, 2440 3390 C 2530 3730, 2640 4330, 2730 4930 C 2830 5430, 2970 5630, 3210 5850 C 3500 5910, 3700 5870, 3880 5770',
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
    // Europe -> Mediterranean -> Suez -> Red Sea -> Gulf of Aden -> Seychelles (Indian Ocean Corridor)
    d: 'M 3500 250 C 3850 320, 4150 420, 4220 450 C 4320 750, 4450 1150, 4580 1480 C 4720 1650, 5050 1620, 5420 1650 C 5680 1780, 5450 2150, 5150 2550 C 4950 2850, 5150 3150, 5450 3350 C 5650 3480, 5820 3550, 5950 3580',
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
    x: 1550,
    y: 120,
    cablesConnected: ['2Africa', 'SeaMeWe-3', 'Eurafrica'],
    totalBandwidthTbps: 220,
    status: 'Operational',
    operator: 'Maroc Telecom / Orange',
    description: 'Key North African crossroads connecting Maghreb terrestrial fiber to Mediterranean and Atlantic subsea routes.',
    labelOffset: { x: -300, y: -70 }
  },
  {
    id: 'station-alexandria',
    name: 'Alexandria & Zafarana Gateway',
    city: 'Alexandria / Suez',
    countryIso3: 'EGY',
    x: 4150,
    y: 520,
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
    x: 480,
    y: 2160,
    cablesConnected: ['2Africa', 'ACE', 'SAT-3/WASC', 'MainOne'],
    totalBandwidthTbps: 160,
    status: 'Operational',
    operator: 'Sonatel / Orange',
    description: 'The principal digital gateway of West Africa, bridging the ECOWAS region with direct routes to Europe and the Americas.',
    labelOffset: { x: -320, y: -360 }
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
    labelOffset: { x: 0, y: 180 }
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
    x: 2750,
    y: 3600,
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
    x: 2900,
    y: 5750,
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
    x: 4350,
    y: 5100,
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
    x: 5150,
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
    x: 4850,
    y: 1950,
    cablesConnected: ['2Africa', 'PEACE', 'SEACOM', 'EASSy', 'AAE-1', 'SeaMeWe-5', 'DAHRE'],
    totalBandwidthTbps: 450,
    status: 'Operational',
    operator: 'Djibouti Telecom',
    description: 'Strategically situated at the Bab-el-Mandeb Strait, hosting 10+ subsea cables and acting as the digital gateway for the Horn of Africa and landlocked Ethiopia.',
    labelOffset: { x: 300, y: -70 }
  }
];
