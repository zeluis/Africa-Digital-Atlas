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
    // Complete oceanic loop: Deep Atlantic shelf off Morocco/Mauritania/Dakar -> Gulf of Guinea shelf -> Offshore Gabon/Angola/Namibia -> Southern Ocean south of Cape Agulhas -> Middle of Mozambique Channel fairway -> Somali Basin -> Horn of Africa Loop -> Red Sea & Suez
    d: 'M 1260 50 C 920 380, 620 850, 420 1320 C 250 1650, 180 1950, 160 2200 C 140 2520, 480 2840, 1100 2880 C 1400 2900, 1850 2920, 2060 2920 C 2240 3050, 2380 3350, 2480 3750 C 2560 4150, 2620 4550, 2680 4950 C 2720 5250, 2760 5550, 2850 5800 C 2980 6100, 3250 6260, 3600 6260 C 4000 6220, 4360 5980, 4580 5550 C 4680 5320, 4750 5050, 4790 4780 C 4820 4520, 4880 4350, 4920 4150 C 4980 3750, 5180 3350, 5320 2900 C 5450 2500, 5720 2250, 5680 1980 C 5550 1880, 5150 1820, 4850 1780 C 4650 1550, 4450 1150, 4320 750 C 4240 550, 4180 380, 3850 320 C 3550 280, 3450 260, 3450 260',
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
    // Portugal -> Deep Atlantic Shelf -> West of Dakar -> Gulf of Guinea -> West of Gabon/Angola/Namibia -> Southern Ocean south of Cape Agulhas
    d: 'M 1240 40 C 900 370, 600 840, 400 1310 C 230 1640, 160 1940, 140 2190 C 120 2510, 460 2830, 1080 2870 C 1380 2890, 1830 2910, 2050 2910 C 2220 3040, 2360 3340, 2460 3740 C 2540 4140, 2600 4540, 2660 4940 C 2700 5240, 2740 5540, 2820 5780 C 2950 6080, 3180 6220, 3500 6220',
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
    // Red Sea -> Gulf of Aden -> Horn of Africa Loop -> Somali Basin -> Middle of Mozambique Channel fairway -> Southern Ocean south of Cape Agulhas
    d: 'M 4200 450 C 4280 650, 4380 950, 4500 1250 C 4650 1520, 4850 1750, 4950 1820 C 5200 1850, 5500 1900, 5680 2000 C 5720 2250, 5450 2520, 5340 2920 C 5200 3370, 5000 3770, 4940 4170 C 4900 4370, 4840 4520, 4800 4770 C 4760 5070, 4700 5340, 4600 5570 C 4380 6000, 4020 6240, 3620 6260 C 3270 6260, 3000 6100, 2870 5800 C 2780 5450, 2780 5450, 2780 5450',
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
    // France -> Deep Atlantic shelf west of Gibraltar/Morocco/Dakar -> Gulf of Guinea -> West of Gabon/Angola/Namibia -> Southern Ocean
    d: 'M 1250 45 C 910 375, 610 845, 410 1315 C 240 1645, 170 1945, 150 2195 C 130 2515, 470 2835, 1090 2875 C 1390 2895, 1840 2915, 2055 2915 C 2230 3045, 2370 3345, 2470 3745 C 2550 4145, 2610 4545, 2670 4945 C 2710 5245, 2750 5545, 2835 5785 C 2965 6085, 3210 6240, 3550 6240',
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
    // Europe -> Mediterranean -> Suez -> Red Sea -> Gulf of Aden -> Horn of Africa Loop -> Somali Basin -> Seychelles (Indian Ocean Corridor)
    d: 'M 3500 250 C 3850 320, 4150 420, 4200 450 C 4280 650, 4380 950, 4500 1250 C 4650 1520, 4850 1750, 4950 1820 C 5200 1850, 5500 1900, 5680 2000 C 5720 2250, 5500 2550, 5400 2950 C 5320 3280, 5580 3400, 5950 3450',
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
