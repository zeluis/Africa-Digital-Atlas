import { AfricanRegion } from './types';

// ==========================================
// 1. AfCFTA INTRA-REGIONAL TRADE FLOWS
// ==========================================

export interface RegionalTradeCorridor {
  id: string;
  name: string;
  connectingNations: string[];
  distanceKm: number;
  tradeVolumeAnnualUSD: string;
  intraTradeShare: string;
  primaryGoods: string[];
  keyBorderPosts: {
    name: string;
    countries: [string, string];
    type: 'OSBP' | 'Standard' | 'Digital Multi-Agency';
    avgCrossingHours: number;
  }[];
  afcftaTariffStatus: string;
  strategicNote: string;
}

export interface RegionalTradeProfile {
  region: AfricanRegion;
  intraRegionalTradePct: number;
  leadingTradePartners: { partner: string; sharePct: number }[];
  corridors: RegionalTradeCorridor[];
  gtiStatus: string; // Guided Trade Initiative
  keyManufacturedGoods: string[];
  challenges: string[];
}

export const REGIONAL_TRADE_PROFILES: Record<AfricanRegion, RegionalTradeProfile> = {
  'Western Africa': {
    region: 'Western Africa',
    intraRegionalTradePct: 12.8,
    leadingTradePartners: [
      { partner: 'Nigeria ↔ Ghana / Côte d\'Ivoire', sharePct: 32 },
      { partner: 'Côte d\'Ivoire ↔ Mali / Burkina Faso', sharePct: 24 },
      { partner: 'Senegal ↔ Mali', sharePct: 18 }
    ],
    gtiStatus: 'Pilot shipments certified under AfCFTA GTI for cocoa products, palm oil, and ceramic tiles.',
    keyManufacturedGoods: ['Refined Petroleum', 'Cement & Clinker', 'Processed Cocoa & Shea Butter', 'Plastics & Textiles', 'Pharmaceuticals'],
    challenges: ['Informal cross-border trade friction', 'Non-tariff customs checkpoints along coastal corridors', 'Dual currency zones (CFA Franc vs Naira/Cedi)'],
    corridors: [
      {
        id: 'abidjan-lagos',
        name: 'Abidjan–Lagos Coastal Megalopolis Corridor',
        connectingNations: ['Côte d\'Ivoire', 'Ghana', 'Togo', 'Benin', 'Nigeria'],
        distanceKm: 1028,
        tradeVolumeAnnualUSD: '$14.2 Billion',
        intraTradeShare: '65% of ECOWAS coastal GDP',
        primaryGoods: ['Petrochemicals', 'Consumer Goods', 'Cement', 'Agro-processing', 'Automotive Assemblies'],
        keyBorderPosts: [
          { name: 'Seme-Kraké OSBP', countries: ['Benin', 'Nigeria'], type: 'OSBP', avgCrossingHours: 4.5 },
          { name: 'Noépé-Sanvee Condji OSBP', countries: ['Ghana', 'Togo'], type: 'OSBP', avgCrossingHours: 3.2 },
          { name: 'Elubo-Noé OSBP', countries: ['Ghana', 'Côte d\'Ivoire'], type: 'OSBP', avgCrossingHours: 2.8 }
        ],
        afcftaTariffStatus: '90% originating tariff lines eliminated under ECOWAS ETLS and AfCFTA Category A schedules.',
        strategicNote: 'Generates over 75% of regional commercial truck flows, currently being upgraded to a 6-lane supranational highway.'
      },
      {
        id: 'dakar-bamako',
        name: 'Dakar–Bamako Landlocked Transit Corridor',
        connectingNations: ['Senegal', 'Mali'],
        distanceKm: 1220,
        tradeVolumeAnnualUSD: '$3.8 Billion',
        intraTradeShare: '70% of Mali maritime imports',
        primaryGoods: ['Hydrocarbons', 'Cotton', 'Fertilizer', 'Rice', 'Livestock'],
        keyBorderPosts: [
          { name: 'Kidira-Diboli Border Post', countries: ['Senegal', 'Mali'], type: 'Digital Multi-Agency', avgCrossingHours: 6.0 }
        ],
        afcftaTariffStatus: 'Transit duties waived; digital tracking seals deployed to curb cargo diversion.',
        strategicNote: 'Crucial lifeline connecting the Atlantic deepwater Port of Dakar with Mali\'s industrial and mining centers.'
      }
    ]
  },
  'Eastern Africa': {
    region: 'Eastern Africa',
    intraRegionalTradePct: 20.4,
    leadingTradePartners: [
      { partner: 'Kenya ↔ Uganda', sharePct: 35 },
      { partner: 'Tanzania ↔ Kenya / Rwanda', sharePct: 26 },
      { partner: 'Ethiopia ↔ Djibouti', sharePct: 22 }
    ],
    gtiStatus: 'Highest intra-regional REC compliance; active tea, coffee, batteries, and manufactured exports under AfCFTA.',
    keyManufacturedGoods: ['Packaged Tea & Coffee', 'Iron & Steel Billets', 'Edible Oils', 'Footwear', 'Pharmaceuticals'],
    challenges: ['Bilateral non-tariff sanitary and phytosanitary (SPS) barriers', 'Fuel price disparity across borders'],
    corridors: [
      {
        id: 'northern-corridor-east',
        name: 'Northern Corridor (Mombasa ↔ Great Lakes)',
        connectingNations: ['Kenya', 'Uganda', 'Rwanda', 'Burundi', 'South Sudan', 'DR Congo'],
        distanceKm: 1700,
        tradeVolumeAnnualUSD: '$18.5 Billion',
        intraTradeShare: 'Leading multination transit spine in Sub-Saharan Africa',
        primaryGoods: ['Refined Fuels', 'Machinery', 'Agricultural Produce', 'Construction Materials'],
        keyBorderPosts: [
          { name: 'Malaba OSBP', countries: ['Kenya', 'Uganda'], type: 'OSBP', avgCrossingHours: 3.5 },
          { name: 'Busia OSBP', countries: ['Kenya', 'Uganda'], type: 'OSBP', avgCrossingHours: 2.5 },
          { name: 'Gatuna / Katuna OSBP', countries: ['Uganda', 'Rwanda'], type: 'OSBP', avgCrossingHours: 1.8 }
        ],
        afcftaTariffStatus: 'EAC Common External Tariff (CET) Version 2022 harmonized with AfCFTA Phase 1 modalities.',
        strategicNote: 'Features the Single Customs Territory (SCT), reducing container transit time from Mombasa to Kigali from 21 days to 5 days.'
      },
      {
        id: 'central-corridor-east',
        name: 'Central Corridor (Dar es Salaam ↔ Great Lakes)',
        connectingNations: ['Tanzania', 'Burundi', 'Rwanda', 'Uganda', 'DR Congo'],
        distanceKm: 1400,
        tradeVolumeAnnualUSD: '$8.2 Billion',
        intraTradeShare: 'Alternate multimodal route serving inland lake ports',
        primaryGoods: ['Copper Concentrates', 'Fertilizer', 'Grains', 'Mining Equipment'],
        keyBorderPosts: [
          { name: 'Rusumo OSBP', countries: ['Tanzania', 'Rwanda'], type: 'OSBP', avgCrossingHours: 2.1 },
          { name: 'Kabanga / Kobero OSBP', countries: ['Tanzania', 'Burundi'], type: 'OSBP', avgCrossingHours: 3.0 }
        ],
        afcftaTariffStatus: 'Tariff-free trade among EAC customs union partners with automated single-window processing.',
        strategicNote: 'Standard Gauge Railway (SGR) expansion currently accelerating freight turnaround times from Dar es Salaam port.'
      }
    ]
  },
  'Central Africa': {
    region: 'Central Africa',
    intraRegionalTradePct: 4.2,
    leadingTradePartners: [
      { partner: 'Cameroon ↔ Chad', sharePct: 38 },
      { partner: 'Cameroon ↔ Central African Republic', sharePct: 28 },
      { partner: 'Equatorial Guinea ↔ Gabon', sharePct: 15 }
    ],
    gtiStatus: 'Cameroon enacted initial AfCFTA shipments of aluminum and rubber; CEMAC digital customs integration ongoing.',
    keyManufacturedGoods: ['Aluminum Ingots', 'Processed Wood & Veneer', 'Palm Oil & Soap', 'Beverages', 'Hydrocarbons'],
    challenges: ['Dense rainforest terrain increasing transport costs', 'Tariff classification differences between ECCAS and CEMAC'],
    corridors: [
      {
        id: 'douala-ndjamena',
        name: 'Douala–N\'Djamena Multimodal Corridor',
        connectingNations: ['Cameroon', 'Chad'],
        distanceKm: 1850,
        tradeVolumeAnnualUSD: '$2.9 Billion',
        intraTradeShare: '82% of Chadian international freight',
        primaryGoods: ['Petroleum Products', 'Cotton', 'Livestock', 'Industrial Machinery'],
        keyBorderPosts: [
          { name: 'Kousseri-N\'Djamena Border Complex', countries: ['Cameroon', 'Chad'], type: 'Digital Multi-Agency', avgCrossingHours: 7.5 }
        ],
        afcftaTariffStatus: 'CEMAC free trade zone provisions applicable with electronic customs transit seal management.',
        strategicNote: 'Anchored by the Port of Douala and the new Kribi Deep Seaport providing critical ocean access for Chad.'
      },
      {
        id: 'douala-bangui',
        name: 'Douala–Bangui Central Spine',
        connectingNations: ['Cameroon', 'Central African Republic'],
        distanceKm: 1450,
        tradeVolumeAnnualUSD: '$1.4 Billion',
        intraTradeShare: 'Principal supply artery for CAR',
        primaryGoods: ['Timber', 'Fuel', 'Pharmaceuticals', 'Foodstuffs'],
        keyBorderPosts: [
          { name: 'Garoua-Boulaï OSBP', countries: ['Cameroon', 'Central African Republic'], type: 'OSBP', avgCrossingHours: 5.0 }
        ],
        afcftaTariffStatus: 'Humanitarian and industrial cargo fast-tracked under regional transit conventions.',
        strategicNote: 'Essential trade route passing through eastern Cameroon into western CAR.'
      }
    ]
  },
  'Southern Africa': {
    region: 'Southern Africa',
    intraRegionalTradePct: 22.6,
    leadingTradePartners: [
      { partner: 'South Africa ↔ Mozambique / Zimbabwe', sharePct: 42 },
      { partner: 'South Africa ↔ Botswana / Namibia / Eswatini / Lesotho (SACU)', sharePct: 36 },
      { partner: 'Zambia ↔ DR Congo (Katanga)', sharePct: 14 }
    ],
    gtiStatus: 'South Africa and SACU launched official preferential trading under AfCFTA in January 2024.',
    keyManufacturedGoods: ['Automotive Vehicles & Parts', 'Mining Equipment & Drills', 'Processed Foods', 'Chemicals & Fertilizers', 'Iron & Steel'],
    challenges: ['Congestion at Beitbridge border crossing', 'Rail-to-road freight imbalance overburdening highway infrastructure'],
    corridors: [
      {
        id: 'north-south-corridor-south',
        name: 'North–South Corridor (Durban ↔ Copperbelt)',
        connectingNations: ['South Africa', 'Zimbabwe', 'Botswana', 'Zambia', 'DR Congo'],
        distanceKm: 2700,
        tradeVolumeAnnualUSD: '$26.4 Billion',
        intraTradeShare: 'Highest commercial freight value in Africa',
        primaryGoods: ['Copper & Cobalt Cathodes', 'Automobiles', 'Mining Chemicals', 'Heavy Machinery'],
        keyBorderPosts: [
          { name: 'Beitbridge Border Post', countries: ['South Africa', 'Zimbabwe'], type: 'Digital Multi-Agency', avgCrossingHours: 8.0 },
          { name: 'Kazungula Bridge OSBP', countries: ['Botswana', 'Zambia'], type: 'OSBP', avgCrossingHours: 2.2 },
          { name: 'Chirundu OSBP', countries: ['Zimbabwe', 'Zambia'], type: 'OSBP', avgCrossingHours: 3.5 }
        ],
        afcftaTariffStatus: 'SACU free movement of goods combined with SADC Trade Protocol zero-tariff status.',
        strategicNote: 'Features the iconic curved Kazungula Bridge over the Zambezi River, eliminating pontoon ferry delays.'
      },
      {
        id: 'maputo-corridor',
        name: 'Maputo Development Corridor (Gauteng ↔ Port of Maputo)',
        connectingNations: ['South Africa', 'Mozambique'],
        distanceKm: 590,
        tradeVolumeAnnualUSD: '$7.8 Billion',
        intraTradeShare: 'Fastest port outlet for South Africa\'s industrial heartland',
        primaryGoods: ['Magnetite & Coal', 'Citrus Fruit', 'Stainless Steel', 'Petroleum'],
        keyBorderPosts: [
          { name: 'Lebombo / Ressano Garcia OSBP', countries: ['South Africa', 'Mozambique'], type: 'OSBP', avgCrossingHours: 3.0 }
        ],
        afcftaTariffStatus: 'Bilateral transit protocol with 24-hour freight clearance lanes.',
        strategicNote: 'Showcase public-private partnership (PPP) infrastructure linking Pretoria/Johannesburg to the Indian Ocean.'
      }
    ]
  },
  'Northern Africa': {
    region: 'Northern Africa',
    intraRegionalTradePct: 5.6,
    leadingTradePartners: [
      { partner: 'Egypt ↔ Libya / Sudan', sharePct: 36 },
      { partner: 'Morocco ↔ Tunisia', sharePct: 24 },
      { partner: 'Algeria ↔ Tunisia', sharePct: 20 }
    ],
    gtiStatus: 'Egypt and Tunisia active in AfCFTA Guided Trade Initiative; Morocco expanded trade with West Africa.',
    keyManufacturedGoods: ['Automotive Assemblies & Wiring', 'Phosphate Fertilizers', 'Petrochemicals & Plastics', 'Textiles & Leather', 'Household Appliances'],
    challenges: ['Border closures and geopolitical rivalries across the Maghreb', 'Heavy trade orientation towards the European Union'],
    corridors: [
      {
        id: 'trans-maghreb-corridor',
        name: 'Trans-Maghreb Highway & Coastal Corridor',
        connectingNations: ['Morocco', 'Algeria', 'Tunisia', 'Libya'],
        distanceKm: 3200,
        tradeVolumeAnnualUSD: '$6.5 Billion',
        intraTradeShare: 'Pan-Maghreb transit potential',
        primaryGoods: ['Phosphates', 'Industrial Components', 'Agricultural Produce', 'Natural Gas Byproducts'],
        keyBorderPosts: [
          { name: 'Ras Ajdir Border Post', countries: ['Tunisia', 'Libya'], type: 'Digital Multi-Agency', avgCrossingHours: 4.0 },
          { name: 'Bouchebka Border Post', countries: ['Algeria', 'Tunisia'], type: 'Standard', avgCrossingHours: 3.5 }
        ],
        afcftaTariffStatus: 'Agadir Agreement & GAFTA preferences converging under AfCFTA continent-wide rules of origin.',
        strategicNote: 'High industrial complementarity between Moroccan automotive/aerospace supply chains and Tunisian electronics.'
      },
      {
        id: 'cairo-cape-town-north',
        name: 'Trans-African Highway 4 (Cairo ↔ Khartoum Corridor)',
        connectingNations: ['Egypt', 'Sudan'],
        distanceKm: 1750,
        tradeVolumeAnnualUSD: '$2.8 Billion',
        intraTradeShare: 'Eastern Nile trade trunkline',
        primaryGoods: ['Cereals & Foodstuffs', 'Livestock', 'Building Materials', 'Textiles'],
        keyBorderPosts: [
          { name: 'Qustul / Ashkeet Land Port', countries: ['Egypt', 'Sudan'], type: 'OSBP', avgCrossingHours: 3.8 }
        ],
        afcftaTariffStatus: 'COMESA free trade area rules combined with AfCFTA fast-track trade certificates.',
        strategicNote: 'Opens Mediterranean industrial products to the broader Eastern African interior markets.'
      }
    ]
  }
};

// ==========================================
// 2. HISTORICAL TRADE CORRIDORS & MARITIME ROUTES
// ==========================================

export interface HistoricalTradeRoute {
  id: string;
  name: string;
  era: string;
  regions: AfricanRegion[];
  nodalHubs: string[];
  exchangeCommodities: {
    exports: string[];
    imports: string[];
  };
  navigationTechnology: string;
  historicalSignificance: string;
}

export const HISTORICAL_REGIONAL_ROUTES: Record<AfricanRegion, HistoricalTradeRoute[]> = {
  'Western Africa': [
    {
      id: 'western-trans-saharan',
      name: 'Western Trans-Saharan Gold & Salt Highway',
      era: '8th – 16th Century CE (Ghana, Mali, and Songhai Empires)',
      regions: ['Western Africa', 'Northern Africa'],
      nodalHubs: ['Taghaza (Salt Mines)', 'Timbuktu', 'Gao', 'Djenné', 'Oualata', 'Sijilmasa'],
      exchangeCommodities: {
        exports: ['Bambuk & Bure Gold', 'Kola Nuts', 'Ivory', 'Shea Butter', 'Arabic Calligraphic Manuscripts'],
        imports: ['Rock Salt Slabs', 'Fine Silks & Damask', 'Copper Bars', 'Venetian Glass Beads', 'Paper & Books']
      },
      navigationTechnology: 'Berber camel caravans (azalai) navigating by astral constellations across the Sahara Erg deserts.',
      historicalSignificance: 'Funded the Islamic Golden Age; Mansa Musa\'s 1324 pilgrimage spent so much gold in Cairo that it devalued gold globally for over a decade.'
    },
    {
      id: 'central-trans-saharan',
      name: 'Hausaland–Fezzan Trans-Saharan Route',
      era: '11th – 19th Century CE (Hausa City-States & Kanem-Bornu)',
      regions: ['Western Africa', 'Northern Africa', 'Central Africa'],
      nodalHubs: ['Kano (Indigo Dye Pits)', 'Katsina', 'Agadez', 'Bilma (Salt Oases)', 'Ghat', 'Tripoli'],
      exchangeCommodities: {
        exports: ['Kano Morrocan Leather', 'Indigo-Dyed Textiles', 'Kola Nuts', 'Carved Calabashes'],
        imports: ['Saharan Salt', 'European Firearms', 'Mediterranean Coral', 'Brass Basins']
      },
      navigationTechnology: 'Tuareg caravan escorts using traditional well network (foggaras) and pack camels.',
      historicalSignificance: 'Established Kano as the supreme manufacturing and tanning metropolis of the West African savanna.'
    }
  ],
  'Eastern Africa': [
    {
      id: 'swahili-coast-monsoon',
      name: 'Swahili Coast Monsoon Maritime Corridor',
      era: '1st – 18th Century CE (Kilwa Sultanate, Zanzibar, Mombasa)',
      regions: ['Eastern Africa'],
      nodalHubs: ['Kilwa Kisiwani', 'Zanzibar (Stone Town)', 'Mombasa', 'Lamu', 'Sofala', 'Mogadishu'],
      exchangeCommodities: {
        exports: ['Gold from Great Zimbabwe', 'Ivory', 'Mangrove Timber', 'Frankincense', 'Rock Crystal'],
        imports: ['Chinese Ming Celadon & Porcelain', 'Indian Silk & Cotton', 'Persian Ceramics', 'Glass Beads']
      },
      navigationTechnology: 'Mtepe sewn-wood dhows and lateen sails harnessing the seasonal Kaskazi (northeast) and Kusi (southwest) trade monsoons.',
      historicalSignificance: 'Created the cosmopolitan, polyglot Swahili culture and urban stone architectural civilization along a 3,000 km coastal corridor.'
    },
    {
      id: 'great-lakes-caravan',
      name: 'Great Lakes & Swahili Interior Caravans',
      era: '16th – 19th Century CE (Buganda, Bunyoro, Nyamwezi)',
      regions: ['Eastern Africa', 'Central Africa'],
      nodalHubs: ['Ujiji (Lake Tanganyika)', 'Tabora (Kazeh)', 'Karagwe', 'Menggo (Buganda)', 'Bagamoyo'],
      exchangeCommodities: {
        exports: ['Ivory', 'Copper Ingots', 'Bark Cloth', 'Smelted Iron Tools'],
        imports: ['Indian Calico Cloth (Merikani)', 'Cowrie Shells', 'Brass Wire', 'Glass Beads']
      },
      navigationTechnology: 'Nyamwezi porter caravans carrying 30kg loads on foot over 1,200 km trails, and dugout canoes traversing inland rift lakes.',
      historicalSignificance: 'Integrated inland equatorial lake monarchies into the global mercantile trade before colonial conquest.'
    }
  ],
  'Central Africa': [
    {
      id: 'congo-basin-riverine',
      name: 'Congo River & Pool Malebo Commerce System',
      era: '14th – 19th Century CE (Kingdom of Kongo, Teke / Anziku, Luba Empire)',
      regions: ['Central Africa'],
      nodalHubs: ['Mbanza Kongo', 'Malebo Pool (Kinshasa/Brazzaville)', 'Mpinda Port', 'Upemba Depression'],
      exchangeCommodities: {
        exports: ['Raffia Cloth (Libongo Currency)', 'Smelted Iron Blades', 'Copper Crosses (Katanga)', 'Pottery'],
        imports: ['Salt', 'Dried Ocean Fish', 'Cowrie Shells (Nzimbu)', 'European Brass Basins']
      },
      navigationTechnology: 'Large dugout river pirogues crewed by up to 80 paddlers on the navigable upper and lower reaches of the Congo River.',
      historicalSignificance: 'Supported dense urban political systems and sophisticated metallurgical currencies throughout equatorial rainforest networks.'
    }
  ],
  'Southern Africa': [
    {
      id: 'great-zimbabwe-limpopo',
      name: 'Great Zimbabwe–Save River Maritime Highway',
      era: '11th – 15th Century CE (Kingdom of Zimbabwe & Mapungubwe)',
      regions: ['Southern Africa', 'Eastern Africa'],
      nodalHubs: ['Great Zimbabwe', 'Mapungubwe', 'Thulamela', 'Chibuene (Ocean Port)', 'Sofala'],
      exchangeCommodities: {
        exports: ['Alluvial Gold Ingots', 'Ivory Tusks', 'Soapstone Carvings', 'Iron Tools'],
        imports: ['Persian Glazed Earthenware', 'Chinese Longquan Celadon', 'Indo-Pacific Glass Beads', 'Spices']
      },
      navigationTechnology: 'Inland river navigation along the Limpopo and Save rivers combined with coastal dhow connections into the Mozambique Channel.',
      historicalSignificance: 'Fueled the dry-stone architectural engineering of the Great Enclosure at Great Zimbabwe, housing over 18,000 citizens.'
    }
  ],
  'Northern Africa': [
    {
      id: 'darb-al-arbain',
      name: 'Darb al-Arba\'in (Forty Days Road)',
      era: 'Pharaonic Era through 19th Century CE',
      regions: ['Northern Africa', 'Eastern Africa'],
      nodalHubs: ['Asyut (Nile Valley)', 'Kharga Oasis', 'Selima Oasis', 'El Fasher (Darfur Sultanate)'],
      exchangeCommodities: {
        exports: ['Alum Salt', 'Gum Arabic', 'Ivory', 'Ostrich Feathers', 'Ebony Wood'],
        imports: ['Wheat', 'Egyptian Textiles', 'Copper Vessels', 'Spices', 'Books & Paper']
      },
      navigationTechnology: 'Caravans traveling between critical desert water points across 1,800 kilometers of hyper-arid desert sands.',
      historicalSignificance: 'One of the oldest recorded overland long-distance trade arteries in human history, operating continuously for over three millennia.'
    },
    {
      id: 'mediterranean-maghreb-coastal',
      name: 'Trans-Maghreb & Mediterranean Coastal Network',
      era: 'Carthaginian, Roman, and Fatimid Eras',
      regions: ['Northern Africa'],
      nodalHubs: ['Carthage / Tunis', 'Alexandria', 'Tripoli', 'Tangier', 'Algiers', 'Ceuta'],
      exchangeCommodities: {
        exports: ['Olive Oil', 'Wheat / Durum Grain', 'Garum Fish Sauce', 'Purple Tyrian Dye', 'Fine Wool'],
        imports: ['Tin & Silver', 'Wine', 'Marble', 'Mediterranean Pottery']
      },
      navigationTechnology: 'Galleys and round merchant ships navigating the Mediterranean littoral utilizing coastal landmarks and portolan charts.',
      historicalSignificance: 'Provided the agricultural grain foundation that fed the classical Mediterranean civilizations and medieval Islamic caliphates.'
    }
  ]
};

// ==========================================
// 3. CROSS-BORDER ECOLOGICAL INFRASTRUCTURE
// ==========================================

export interface TransboundaryEcology {
  id: string;
  name: string;
  type: 'Biosphere Reserve' | 'River Basin' | 'Transfrontier Conservation Area' | 'Continental Corridor';
  participatingCountries: string[];
  areaKm2: string;
  keystoneFloraFauna: string[];
  climateMitigationValue: string;
  governingTreaty: string;
  strategicSignificance: string;
}

export const REGIONAL_ECOLOGICAL_SYSTEMS: Record<AfricanRegion, TransboundaryEcology[]> = {
  'Western Africa': [
    {
      id: 'great-green-wall-west',
      name: 'The Great Green Wall (Sahel & Sahara Initiative)',
      type: 'Continental Corridor',
      participatingCountries: ['Senegal', 'Mauritania', 'Mali', 'Burkina Faso', 'Niger', 'Nigeria', 'Chad'],
      areaKm2: '8,000 km across Africa (100M hectares targeted)',
      keystoneFloraFauna: ['Acacia senegal (Gum Arabic)', 'Balanites aegyptiaca (Desert Date)', 'Faidherbia albida', 'Dorcas Gazelle'],
      climateMitigationValue: 'Sequesters 250M tonnes of carbon, restores degraded drylands, and creates 10 million green rural jobs.',
      governingTreaty: 'African Union Great Green Wall Convention & UNCCD Pan-African Agency.',
      strategicSignificance: 'World\'s largest nature-based climate resilience shield halting the southward encroachment of the Sahara Desert.'
    },
    {
      id: 'niger-basin-authority',
      name: 'Niger River Basin Ecosystem',
      type: 'River Basin',
      participatingCountries: ['Guinea', 'Mali', 'Niger', 'Benin', 'Nigeria', 'Cameroon', 'Burkina Faso', 'Chad', 'Côte d\'Ivoire'],
      areaKm2: '2,117,700 km²',
      keystoneFloraFauna: ['African Manatee (Trichechus senegalensis)', 'Nile Perch', 'Hippopotamus', 'Inner Niger Delta Migratory Waterfowl'],
      climateMitigationValue: 'Vital inland wetland supporting 130+ million people with food security, freshwater aquifers, and pastoral livelihoods.',
      governingTreaty: 'Niger Basin Authority (NBA / ABN) Revised Convention (est. 1980, Niamey).',
      strategicSignificance: 'The third-longest river in Africa with the Inner Niger Delta acting as an emerald oasis in the arid Sahel.'
    }
  ],
  'Eastern Africa': [
    {
      id: 'mara-serengeti',
      name: 'Serengeti–Maasai Mara Transboundary Ecosystem',
      type: 'Transfrontier Conservation Area',
      participatingCountries: ['Tanzania', 'Kenya'],
      areaKm2: '30,000 km²',
      keystoneFloraFauna: ['1.5M Blue Wildebeest', '250,000 Plains Zebra', 'African Lion', 'Cheetah', 'Nile Crocodile'],
      climateMitigationValue: 'Intact savanna grassland biomass recycling, natural herbivore carbon cycling, and sustainable eco-tourism revenue.',
      governingTreaty: 'EAC Environmental and Natural Resource Protocol & Cross-Border Mara River Basin MoU.',
      strategicSignificance: 'Host to the Great Wildebeest Migration, recognized as one of the Seven Natural Wonders of the World.'
    },
    {
      id: 'nile-basin-initiative',
      name: 'Nile Basin Aquatic Ecosystem',
      type: 'River Basin',
      participatingCountries: ['Burundi', 'DR Congo', 'Egypt', 'Ethiopia', 'Kenya', 'Rwanda', 'South Sudan', 'Sudan', 'Tanzania', 'Uganda'],
      areaKm2: '3,254,555 km²',
      keystoneFloraFauna: ['Papyrus Swamps', 'African Fish Eagle', 'Shoebill Stork (Balaeniceps rex)', 'Nile Softshell Turtle'],
      climateMitigationValue: 'Crucial water lifeline spanning 11 riparian sovereign states, supporting agriculture, hydropower, and fisheries.',
      governingTreaty: 'Nile Basin Initiative (NBI) Entebbe Agreement & Cooperative Framework Agreement (CFA).',
      strategicSignificance: 'The world\'s longest river system uniting equatorial highland rainforests with Mediterranean coastal deltas.'
    }
  ],
  'Central Africa': [
    {
      id: 'congo-basin-peatlands',
      name: 'Congo Basin Forest & Cuvette Centrale Peatlands',
      type: 'Continental Corridor',
      participatingCountries: ['DR Congo', 'Republic of Congo', 'Cameroon', 'Gabon', 'Central African Republic', 'Equatorial Guinea'],
      areaKm2: '2,000,000 km² (World\'s 2nd largest rainforest)',
      keystoneFloraFauna: ['Western Lowland Gorilla', 'Forest Elephant (Loxodonta cyclotis)', 'Bonobo (Pan paniscus)', 'Okapi'],
      climateMitigationValue: 'Cuvette Centrale peatland stores 30 Billion tonnes of carbon (equivalent to 3 years of global fossil emissions).',
      governingTreaty: 'Congo Basin Forest Partnership (CBFP) & COMIFAC Yaoundé Declaration.',
      strategicSignificance: 'The Earth\'s "Second Green Lung", absorbing more carbon annually than the Amazon rainforest.'
    },
    {
      id: 'sangha-trinational',
      name: 'Sangha Trinational Complex (TNS)',
      type: 'Biosphere Reserve',
      participatingCountries: ['Cameroon', 'Central African Republic', 'Republic of Congo'],
      areaKm2: '44,000 km²',
      keystoneFloraFauna: ['Bongo Antelope', 'Chimpanzee', 'Giant Pangolin', 'African Teak (Iroko)'],
      climateMitigationValue: 'Pristine contiguous tropical moist forest canopy safeguarding primary old-growth carbon reserves.',
      governingTreaty: 'UNESCO World Heritage Tri-National Agreement (est. 2000).',
      strategicSignificance: 'A contiguous wilderness landscape preserved entirely without internal commercial logging roads.'
    }
  ],
  'Southern Africa': [
    {
      id: 'kaza-tfca',
      name: 'Kavango–Zambezi Transfrontier Conservation Area (KAZA)',
      type: 'Transfrontier Conservation Area',
      participatingCountries: ['Angola', 'Botswana', 'Namibia', 'Zambia', 'Zimbabwe'],
      areaKm2: '520,000 km² (World\'s largest terrestrial TFCA)',
      keystoneFloraFauna: ['250,000 African Savanna Elephants (50% of global population)', 'African Wild Dog', 'Roan Antelope', 'Baobab'],
      climateMitigationValue: 'Protects the Okavango Delta inland wetland and Victoria Falls watershed; vital transnational migratory corridors.',
      governingTreaty: 'KAZA TFCA Treaty signed in Luanda, Angola (2011).',
      strategicSignificance: 'Larger than Austria, Germany, and Switzerland combined, demonstrating world-leading multi-nation conservation diplomacy.'
    },
    {
      id: 'zambezi-basin',
      name: 'Zambezi River Basin Ecosystem',
      type: 'River Basin',
      participatingCountries: ['Angola', 'Botswana', 'Malawi', 'Mozambique', 'Namibia', 'Tanzania', 'Zambia', 'Zimbabwe'],
      areaKm2: '1,390,000 km²',
      keystoneFloraFauna: ['Tigerfish', 'Carmine Bee-eater', 'Lechwe Antelope', 'Zambezi Mopane Woodlands'],
      climateMitigationValue: 'Hydroelectric energy generation (Kariba & Cahora Bassa) and wetland biodiversity regulation.',
      governingTreaty: 'Zambezi Watercourse Commission (ZAMCOM) Agreement (2004).',
      strategicSignificance: 'The largest river flowing eastward into the Indian Ocean from the African continent.'
    }
  ],
  'Northern Africa': [
    {
      id: 'nubian-sandstone-aquifer',
      name: 'Nubian Sandstone Aquifer System (NSAS)',
      type: 'Continental Corridor',
      participatingCountries: ['Egypt', 'Libya', 'Chad', 'Sudan'],
      areaKm2: '2,200,000 km² (Fossil Water Volume: 150,000 km³)',
      keystoneFloraFauna: ['Desert Date Palm (Phoenix dactylifera)', 'Acacia tortilis', 'Fennec Fox', 'Sand Cat'],
      climateMitigationValue: 'Supplies freshwater to hyper-arid desert agricultural zones, mitigating acute regional water stress.',
      governingTreaty: 'Joint Authority for the Study and Development of the Nubian Sandstone Aquifer Waters (est. 1992).',
      strategicSignificance: 'The world\'s largest known fossil water aquifer system, sustaining Libya\'s Great Man-Made River and Egyptian desert oases.'
    },
    {
      id: 'north-western-sahara-aquifer',
      name: 'North-Western Sahara Aquifer System (SASS)',
      type: 'River Basin',
      participatingCountries: ['Algeria', 'Tunisia', 'Libya'],
      areaKm2: '1,000,000 km²',
      keystoneFloraFauna: ['Deglet Nour Date Palm', 'Saharan Horned Viper', 'Dorcas Gazelle'],
      climateMitigationValue: 'Groundwater replenishment mechanism and shared transboundary pumping governance framework.',
      governingTreaty: 'Consultation Mechanism for the North-Western Sahara Aquifer System (2002).',
      strategicSignificance: 'Pioneered joint data-sharing protocols to prevent over-abstraction of deep non-renewable Saharan water tables.'
    }
  ]
};

// ==========================================
// 4. REGIONAL POWER POOLS & RENEWABLE GRIDS
// ==========================================

export interface RegionalPowerPool {
  id: string;
  acronym: string;
  name: string;
  headquarters: string;
  establishedYear: number;
  participatingNations: number;
  totalInstalledCapacityMW: number;
  peakDemandMW: number;
  energyMix: {
    hydroPct: number;
    solarWindPct: number;
    thermalGasCoalPct: number;
    geothermalPct: number;
  };
  flagshipTransmissionProjects: {
    name: string;
    voltageKV: string;
    countries: string[];
    capacityMW: number;
    status: 'Operational' | 'Under Construction' | 'Financing';
  }[];
  strategicVision: string;
}

export const REGIONAL_POWER_POOLS: Record<AfricanRegion, RegionalPowerPool> = {
  'Western Africa': {
    id: 'wapp',
    acronym: 'WAPP',
    name: 'West African Power Pool',
    headquarters: 'Cotonou, Benin',
    establishedYear: 1999,
    participatingNations: 14,
    totalInstalledCapacityMW: 26500,
    peakDemandMW: 19200,
    energyMix: {
      hydroPct: 32,
      solarWindPct: 8,
      thermalGasCoalPct: 60,
      geothermalPct: 0
    },
    flagshipTransmissionProjects: [
      {
        name: 'CLSG Interconnection (Côte d\'Ivoire–Liberia–Sierra Leone–Guinea)',
        voltageKV: '225 kV',
        countries: ['Côte d\'Ivoire', 'Liberia', 'Sierra Leone', 'Guinea'],
        capacityMW: 450,
        status: 'Operational'
      },
      {
        name: 'WAPP North Core Interconnection Project',
        voltageKV: '330 kV',
        countries: ['Nigeria', 'Niger', 'Benin', 'Burkina Faso'],
        capacityMW: 620,
        status: 'Under Construction'
      },
      {
        name: 'Desert to Power Solar Initiative (Sahel Grid)',
        voltageKV: '400 kV HVDC',
        countries: ['Mali', 'Burkina Faso', 'Niger'],
        capacityMW: 10000,
        status: 'Financing'
      }
    ],
    strategicVision: 'Unifying all 14 ECOWAS national grids into a single competitive wholesale electricity market with cross-border trading.'
  },
  'Eastern Africa': {
    id: 'eapp',
    acronym: 'EAPP',
    name: 'Eastern Africa Power Pool',
    headquarters: 'Addis Ababa, Ethiopia',
    establishedYear: 2005,
    participatingNations: 13,
    totalInstalledCapacityMW: 67000,
    peakDemandMW: 48500,
    energyMix: {
      hydroPct: 58,
      solarWindPct: 14,
      thermalGasCoalPct: 22,
      geothermalPct: 6
    },
    flagshipTransmissionProjects: [
      {
        name: 'Ethiopia–Kenya 500kV HVDC Highway',
        voltageKV: '500 kV HVDC',
        countries: ['Ethiopia', 'Kenya'],
        capacityMW: 2000,
        status: 'Operational'
      },
      {
        name: 'Grand Ethiopian Renaissance Dam (GERD)',
        voltageKV: '500 kV',
        countries: ['Ethiopia', 'Sudan', 'Egypt'],
        capacityMW: 5150,
        status: 'Operational'
      },
      {
        name: 'Kenya–Tanzania Interconnector (KTIP)',
        voltageKV: '400 kV',
        countries: ['Kenya', 'Tanzania'],
        capacityMW: 1300,
        status: 'Operational'
      },
      {
        name: 'Olkaria Geothermal Expansion & Lake Turkana Wind',
        voltageKV: '400 kV',
        countries: ['Kenya'],
        capacityMW: 1200,
        status: 'Operational'
      }
    ],
    strategicVision: 'Harnessing the immense hydroelectric power of Ethiopia and East African Rift geothermal to power the continent.'
  },
  'Central Africa': {
    id: 'capp',
    acronym: 'CAPP / PEAC',
    name: 'Central African Power Pool (Pool Energétique d\'Afrique Centrale)',
    headquarters: 'Brazzaville, Republic of Congo',
    establishedYear: 2003,
    participatingNations: 10,
    totalInstalledCapacityMW: 12400,
    peakDemandMW: 8900,
    energyMix: {
      hydroPct: 78,
      solarWindPct: 3,
      thermalGasCoalPct: 19,
      geothermalPct: 0
    },
    flagshipTransmissionProjects: [
      {
        name: 'Grand Inga Hydroelectric Scheme (Congo River)',
        voltageKV: '800 kV UHVDC',
        countries: ['DR Congo', 'Pan-African Interconnectors'],
        capacityMW: 42000,
        status: 'Financing'
      },
      {
        name: 'Cameroon–Chad Interconnection (PIRECT)',
        voltageKV: '225 kV',
        countries: ['Cameroon', 'Chad'],
        capacityMW: 300,
        status: 'Under Construction'
      },
      {
        name: 'Inga 1 & 2 Rehabilitation & Kolwezi Mining Link',
        voltageKV: '500 kV HVDC',
        countries: ['DR Congo'],
        capacityMW: 1774,
        status: 'Operational'
      }
    ],
    strategicVision: 'Realizing the Inga Rapids hydroelectric potential, with enough power (40+ GW) to satisfy over one-third of the entire African continent.'
  },
  'Southern Africa': {
    id: 'sapp',
    acronym: 'SAPP',
    name: 'Southern African Power Pool',
    headquarters: 'Harare, Zimbabwe',
    establishedYear: 1995,
    participatingNations: 12,
    totalInstalledCapacityMW: 74500,
    peakDemandMW: 56200,
    energyMix: {
      hydroPct: 24,
      solarWindPct: 11,
      thermalGasCoalPct: 65,
      geothermalPct: 0
    },
    flagshipTransmissionProjects: [
      {
        name: 'ZIZABONA Transmission Interconnector',
        voltageKV: '400 kV',
        countries: ['Zimbabwe', 'Zambia', 'Botswana', 'Namibia'],
        capacityMW: 600,
        status: 'Under Construction'
      },
      {
        name: 'Cahora Bassa Hydro HVDC Link',
        voltageKV: '533 kV HVDC',
        countries: ['Mozambique', 'South Africa'],
        capacityMW: 1920,
        status: 'Operational'
      },
      {
        name: 'Mozambique–Malawi Interconnector (MOMA)',
        voltageKV: '400 kV',
        countries: ['Mozambique', 'Malawi'],
        capacityMW: 120,
        status: 'Operational'
      },
      {
        name: 'South Africa Renewable Energy Independent Power Producer Procurement (REIPPPP)',
        voltageKV: '400 kV',
        countries: ['South Africa'],
        capacityMW: 6300,
        status: 'Operational'
      }
    ],
    strategicVision: 'Africa\'s most established competitive day-ahead and intra-day electricity trading market, transitioning from coal to clean renewables.'
  },
  'Northern Africa': {
    id: 'comelec',
    acronym: 'COMELEC',
    name: 'Comité Maghrébin de l\'Electricité & Pan-Arab Grid',
    headquarters: 'Algiers, Algeria',
    establishedYear: 1989,
    participatingNations: 5,
    totalInstalledCapacityMW: 82000,
    peakDemandMW: 61000,
    energyMix: {
      hydroPct: 6,
      solarWindPct: 18,
      thermalGasCoalPct: 76,
      geothermalPct: 0
    },
    flagshipTransmissionProjects: [
      {
        name: 'Morocco–Spain Subsea Interconnection Link (1 & 2)',
        voltageKV: '400 kV AC',
        countries: ['Morocco', 'Spain'],
        capacityMW: 1400,
        status: 'Operational'
      },
      {
        name: 'Egypt–Saudi Arabia HVDC Link',
        voltageKV: '500 kV HVDC',
        countries: ['Egypt', 'Saudi Arabia'],
        capacityMW: 3000,
        status: 'Under Construction'
      },
      {
        name: 'Noor Ouarzazate Solar Complex (CSP + PV)',
        voltageKV: '400 kV',
        countries: ['Morocco'],
        capacityMW: 580,
        status: 'Operational'
      },
      {
        name: 'Benban Solar Park (Aswan)',
        voltageKV: '220 kV',
        countries: ['Egypt'],
        capacityMW: 1650,
        status: 'Operational'
      }
    ],
    strategicVision: 'Serving as the transcontinental green electricity bridge between Africa, Southern Europe, and the Middle East.'
  }
};
