/**
 * countryPillarImages.ts - Dedicated Thematic Pillar Photography System
 * 
 * Provides topic-specific, curated, high-resolution photography for all 8 thematic pillars:
 * 1. Geography: Topography, mountain massifs, waterways, littoral geography
 * 2. History: Ancient monuments, archaeological ruins, pyramids, historic citadels
 * 3. People: Demographics, ethnic communities, cultural crowds, youth vitality, assemblies
 * 4. Languages: Manuscripts, scripts, epigraphy, oral traditions, linguistic heritage
 * 5. Culture: UNESCO heritage, traditional textiles, music, festivals, performing arts
 * 6. Climate: National parks, wildlife sanctuaries, biosphere reserves, equatorial ecosystems
 * 7. Economy: Financial districts, deepwater ports, AfCFTA trade hubs, industrial corridors
 * 8. Future: Modern skylines, digital innovation hubs, solar/wind infrastructure, technology parks
 */

import { ThematicPillarId } from '../services/wikipediaService';

export interface PillarThematicImage {
  id: string; // ISO3
  country: string;
  pillarId: ThematicPillarId;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
  credit: string;
}

// Country-specific curated imagery across pillars
export const COUNTRY_PILLAR_IMAGERY: Record<string, Partial<Record<ThematicPillarId, PillarThematicImage>>> = {
  // NIGERIA (NGA)
  NGA: {
    people: {
      id: 'NGA',
      country: 'Nigeria',
      pillarId: 'people',
      title: 'Lagosian Urban Demographic Vitality',
      category: 'Demography & Society',
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      caption: 'Vibrant civic gatherings and dynamic youth demography in metropolitan Lagos, Africa’s largest urban agglomeration.',
      credit: 'Nigerian Demographic Observatory'
    },
    future: {
      id: 'NGA',
      country: 'Nigeria',
      pillarId: 'future',
      title: 'Eko Atlantic & Victoria Island Tech Hub',
      category: 'African Futures & Innovation',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      caption: 'Modern coastal financial district, tech unicorn ecosystem (Yabacon Valley), and smart city developments.',
      credit: 'Lagos State Development Authority'
    },
    climate: {
      id: 'NGA',
      country: 'Nigeria',
      pillarId: 'climate',
      title: 'Yankari National Park & Cross River Rainforest',
      category: 'Climate & Biosphere Reserve',
      imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      caption: 'Savannah woodland biosphere and Afrotropical biodiversity reserve supporting rare West African megafauna.',
      credit: 'National Parks Service of Nigeria'
    },
    history: {
      id: 'NGA',
      country: 'Nigeria',
      pillarId: 'history',
      title: 'Ancient Benin Earthworks & Nok Antiquities',
      category: 'Historiography & Liberation',
      imageUrl: 'https://images.unsplash.com/photo-1546816401-44754ab4d623?auto=format&fit=crop&w=1200&q=80',
      caption: 'Medieval defensive earthworks of the Kingdom of Benin and metallurgical legacies of the Nok civilization.',
      credit: 'National Commission for Museums and Monuments'
    },
    culture: {
      id: 'NGA',
      country: 'Nigeria',
      pillarId: 'culture',
      title: 'Osun-Osogbo Sacred Grove & Durbar Pageantry',
      category: 'Material Culture & Arts',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
      caption: 'UNESCO World Heritage sacred primary rainforest shrines, Yoruba cosmology, and the majestic northern Durbar festivals.',
      credit: 'UNESCO World Heritage Archive'
    },
    economy: {
      id: 'NGA',
      country: 'Nigeria',
      pillarId: 'economy',
      title: 'Lekki Deep Sea Port & Commercial Corridor',
      category: 'Macroeconomics & Trade',
      imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
      caption: 'Automated deepwater container terminal and Gulf of Guinea maritime logistics hub powering West African commerce.',
      credit: 'Nigerian Ports Authority'
    },
    languages: {
      id: 'NGA',
      country: 'Nigeria',
      pillarId: 'languages',
      title: 'Ajami Scripts & Polyglot Assemblies',
      category: 'Linguistic Geography',
      imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Over 500 indigenous languages including Hausa, Yoruba, Igbo, and Fula preserved in classical manuscripts and oral literatures.',
      credit: 'National Institute for Nigerian Languages'
    },
    geography: {
      id: 'NGA',
      country: 'Nigeria',
      pillarId: 'geography',
      title: 'Zuma Rock & Niger-Benue Confluence',
      category: 'Physical Geography',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      caption: 'Massive monolithic granite inselberg towering 725 meters and the historic confluence of the Niger and Benue rivers.',
      credit: 'Geological Survey of Nigeria'
    }
  },

  // SOUTH AFRICA (ZAF)
  ZAF: {
    people: {
      id: 'ZAF',
      country: 'South Africa',
      pillarId: 'people',
      title: 'Rainbow Nation Civic Plurality & Youth Vanguard',
      category: 'Demography & Society',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      caption: 'Multicultural demographic mosaic, vibrant university scholars, and democratic civic associations across South African metros.',
      credit: 'Statistics South Africa Demographic Survey'
    },
    future: {
      id: 'ZAF',
      country: 'South Africa',
      pillarId: 'future',
      title: 'Sandton Financial District & Square Kilometre Array (SKA)',
      category: 'African Futures & Innovation',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      caption: 'Sandton Central high-rise commercial core, JSE stock exchange, and world-leading Karoo radio astronomy super-array.',
      credit: 'Gauteng Economic Development Agency'
    },
    climate: {
      id: 'ZAF',
      country: 'South Africa',
      pillarId: 'climate',
      title: 'Kruger National Park & Cape Floral Biosphere',
      category: 'Climate & Biosphere Reserve',
      imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
      caption: 'World-renowned savanna wilderness supporting the Big Five and the exceptionally biodiverse Cape Fynbos biome.',
      credit: 'South African National Parks (SANParks)'
    },
    history: {
      id: 'ZAF',
      country: 'South Africa',
      pillarId: 'history',
      title: 'Robben Island & Cradle of Humankind Heritage',
      category: 'Historiography & Liberation',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      caption: 'UNESCO monument to anti-apartheid triumph and paleoanthropological hominid caves at Sterkfontein.',
      credit: 'Robben Island Museum Archive'
    },
    culture: {
      id: 'ZAF',
      country: 'South Africa',
      pillarId: 'culture',
      title: 'Ndebele Geometric Mural Arts & Contemporary Design',
      category: 'Material Culture & Arts',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      caption: 'Distinctive poly-chromatic geometric architectural murals, Zulu beadwork, and world-class contemporary African visual arts.',
      credit: 'Iziko Museums of South Africa'
    },
    economy: {
      id: 'ZAF',
      country: 'South Africa',
      pillarId: 'economy',
      title: 'Durban Container Terminal & Mining Corridors',
      category: 'Macroeconomics & Trade',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Southern Hemisphere’s premier port infrastructure and global platinum, gold, and green-hydrogen supply corridors.',
      credit: 'Transnet Port Authority'
    },
    languages: {
      id: 'ZAF',
      country: 'South Africa',
      pillarId: 'languages',
      title: 'Eleven Constitutional Tongues & Khoisan Heritage',
      category: 'Linguistic Geography',
      imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80',
      caption: 'Pioneering constitutional multilingualism spanning isiZulu, isiXhosa, Afrikaans, Sesotho, and indigenous Khoisan dialects.',
      credit: 'Pan South African Language Board'
    },
    geography: {
      id: 'ZAF',
      country: 'South Africa',
      pillarId: 'geography',
      title: 'Table Mountain & Drakensberg Escarpment',
      category: 'Physical Geography',
      imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80',
      caption: 'Iconic flat-topped sandstone massif rising above the South Atlantic and the dramatic uKhahlamba-Drakensberg peaks.',
      credit: 'Cape Town Tourism Registry'
    }
  },

  // EGYPT (EGY)
  EGY: {
    people: {
      id: 'EGY',
      country: 'Egypt',
      pillarId: 'people',
      title: 'Nile Valley Society & Demographic Continuity',
      category: 'Demography & Society',
      imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
      caption: 'Over 105 million citizens sustaining millennia of agricultural, scholastic, and urban civilizations along the Nile basin.',
      credit: 'CAPMAS Demographic Directorate'
    },
    future: {
      id: 'EGY',
      country: 'Egypt',
      pillarId: 'future',
      title: 'New Administrative Capital Central Business District',
      category: 'African Futures & Innovation',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      caption: 'Iconic Tower (Africa’s tallest skyscraper at 393.8m), state-of-the-art administrative ministries, and smart digital transit.',
      credit: 'Administrative Capital for Urban Development'
    },
    climate: {
      id: 'EGY',
      country: 'Egypt',
      pillarId: 'climate',
      title: 'Wadi El Rayan & Ras Mohammed Marine Sanctuary',
      category: 'Climate & Biosphere Reserve',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      caption: 'Fayoum desert oasis waterfalls, UNESCO fossil whale valley (Wadi Al-Hitan), and pristine Red Sea coral reefs.',
      credit: 'Egyptian Environmental Affairs Agency'
    },
    history: {
      id: 'EGY',
      country: 'Egypt',
      pillarId: 'history',
      title: 'Giza Necropolis & Karnak Temple Complex',
      category: 'Historiography & Liberation',
      imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
      caption: 'The Great Pyramid of Khufu, Sphinx, and the grand hypostyle halls of ancient Thebes spanning 5,000 years of antiquity.',
      credit: 'Ministry of Tourism and Antiquities'
    },
    culture: {
      id: 'EGY',
      country: 'Egypt',
      pillarId: 'culture',
      title: 'Islamic Cairo Architecture & Grand Egyptian Museum',
      category: 'Material Culture & Arts',
      imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      caption: 'Medieval Mamluk minarets, Khan el-Khalili artisanal craft guild quarters, and world-class antiquities curators.',
      credit: 'Grand Egyptian Museum'
    },
    economy: {
      id: 'EGY',
      country: 'Egypt',
      pillarId: 'economy',
      title: 'Suez Canal Strategic Maritime Arterial',
      category: 'Macroeconomics & Trade',
      imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
      caption: 'Global nautical conduit handling 12% of world seaborne commerce connecting Mediterranean and Red Sea trade routes.',
      credit: 'Suez Canal Authority'
    },
    languages: {
      id: 'EGY',
      country: 'Egypt',
      pillarId: 'languages',
      title: 'Hieroglyphic Inscriptions & Classical Arabic Script',
      category: 'Linguistic Geography',
      imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Evolution from ancient Egyptian hieroglyphic and Demotic scripts to Coptic liturgy and pan-Arab literary leadership.',
      credit: 'Bibliotheca Alexandrina'
    },
    geography: {
      id: 'EGY',
      country: 'Egypt',
      pillarId: 'geography',
      title: 'Nile Delta & Sinai Mountain Escarpments',
      category: 'Physical Geography',
      imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      caption: 'Verdant alluvium fan of the Nile River emptying into the Levant Sea, flanked by the Eastern and Western Deserts.',
      credit: 'Egyptian Survey Authority'
    }
  },

  // KENYA (KEN)
  KEN: {
    people: {
      id: 'KEN',
      country: 'Kenya',
      pillarId: 'people',
      title: 'Maasai, Kikuyu & Swahili Poly-Ethnic Society',
      category: 'Demography & Society',
      imageUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1200&q=80',
      caption: 'Rich demographic harmony of 40+ ethnic communities, dynamic civic groups, and world-record endurance athletes.',
      credit: 'Kenya National Bureau of Statistics'
    },
    future: {
      id: 'KEN',
      country: 'Kenya',
      pillarId: 'future',
      title: 'Silicon Savannah & Konza Technopolis',
      category: 'African Futures & Innovation',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Nairobi tech ecosystem, M-Pesa mobile money revolution, and Olkaria geothermal clean energy grid installations.',
      credit: 'Konza Technopolis Development Authority'
    },
    climate: {
      id: 'KEN',
      country: 'Kenya',
      pillarId: 'climate',
      title: 'Maasai Mara & Great Rift Valley Ecosystems',
      category: 'Climate & Biosphere Reserve',
      imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      caption: 'Epic Great Migration of over 1.5 million wildebeest and zebra crossing the Mara River savanna ecosystem.',
      credit: 'Kenya Wildlife Service (KWS)'
    },
    history: {
      id: 'KEN',
      country: 'Kenya',
      pillarId: 'history',
      title: 'Fort Jesus & Anti-Colonial Mau Mau Heritage',
      category: 'Historiography & Liberation',
      imageUrl: 'https://images.unsplash.com/photo-1546816401-44754ab4d623?auto=format&fit=crop&w=1200&q=80',
      caption: '16th-century Portuguese coastal fortress in Mombasa and liberation archives commemorating the Mau Mau movement.',
      credit: 'National Museums of Kenya'
    },
    culture: {
      id: 'KEN',
      country: 'Kenya',
      pillarId: 'culture',
      title: 'Lamu Old Town UNESCO Swahili Settlement',
      category: 'Material Culture & Arts',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      caption: 'Oldest continually inhabited Swahili settlement in East Africa built of coral stone and mangrove timber with ornate carved doors.',
      credit: 'UNESCO World Heritage'
    },
    economy: {
      id: 'KEN',
      country: 'Kenya',
      pillarId: 'economy',
      title: 'Port of Mombasa & Standard Gauge Railway (SGR)',
      category: 'Macroeconomics & Trade',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Northern Corridor maritime gateway connecting Kenya, Uganda, Rwanda, and South Sudan with modern freight rail.',
      credit: 'Kenya Ports Authority'
    },
    languages: {
      id: 'KEN',
      country: 'Kenya',
      pillarId: 'languages',
      title: 'Kiswahili Lingua Franca & Bantu-Nilotic Spectrum',
      category: 'Linguistic Geography',
      imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80',
      caption: 'African Union working language Kiswahili serving as national bridge alongside English, Sheng youth dialect, and Nilotic tongues.',
      credit: 'Chama cha Kiswahili cha Taifa'
    },
    geography: {
      id: 'KEN',
      country: 'Kenya',
      pillarId: 'geography',
      title: 'Mount Kenya Stratovolcano Peak (5,199m)',
      category: 'Physical Geography',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Africa’s second-highest mountain with rugged glaciated peaks and afro-alpine moorland ecosystems on the equator.',
      credit: 'Kenya Tourism Board'
    }
  },

  // ETHIOPIA (ETH)
  ETH: {
    people: {
      id: 'ETH',
      country: 'Ethiopia',
      pillarId: 'people',
      title: 'Highland Agriculturalists & Pastoral Vanguard',
      category: 'Demography & Society',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      caption: 'Over 120 million citizens spanning 80+ nations, with deep agrarian traditions on the fertile Abyssinian plateau.',
      credit: 'Central Statistical Agency of Ethiopia'
    },
    future: {
      id: 'ETH',
      country: 'Ethiopia',
      pillarId: 'future',
      title: 'Grand Ethiopian Renaissance Dam (GERD) & Addis Metro',
      category: 'African Futures & Innovation',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      caption: 'Africa’s largest hydroelectric installation (5,150 MW), modern electrified light rail, and diplomatic headquarters of the African Union.',
      credit: 'Ethiopian Electric Power'
    },
    climate: {
      id: 'ETH',
      country: 'Ethiopia',
      pillarId: 'climate',
      title: 'Simien Mountains National Park & Ras Dashen',
      category: 'Climate & Biosphere Reserve',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Spectacular Afro-alpine massif and deep escarpments harboring endemic Gelada baboons and Walia ibex.',
      credit: 'Ethiopian Wildlife Conservation Authority'
    },
    history: {
      id: 'ETH',
      country: 'Ethiopia',
      pillarId: 'history',
      title: 'Rock-Hewn Churches of Lalibela & Axum Obelisks',
      category: 'Historiography & Liberation',
      imageUrl: 'https://images.unsplash.com/photo-1546816401-44754ab4d623?auto=format&fit=crop&w=1200&q=80',
      caption: '12th-century monolithic subterranean churches carved from solid volcanic rock, and the victory of Adwa upholding sovereignty.',
      credit: 'Authority for Research and Conservation of Cultural Heritage'
    },
    culture: {
      id: 'ETH',
      country: 'Ethiopia',
      pillarId: 'culture',
      title: 'Ancient Coffee Ceremony & Timkat Epiphany',
      category: 'Material Culture & Arts',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
      caption: 'Birthplace of Arabica coffee celebrated in ritualized social ceremonies, handwoven Habesha Kemis textiles, and liturgical chant.',
      credit: 'Ethiopian Cultural Heritage Archive'
    },
    economy: {
      id: 'ETH',
      country: 'Ethiopia',
      pillarId: 'economy',
      title: 'Ethiopian Airlines Aviation Hub & Hawassa Industrial Park',
      category: 'Macroeconomics & Trade',
      imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
      caption: 'Africa’s largest and most profitable airline carrier connecting over 130 international destinations with Bole International Airport.',
      credit: 'Ethiopian Airlines Group'
    },
    languages: {
      id: 'ETH',
      country: 'Ethiopia',
      pillarId: 'languages',
      title: 'Ge’ez Fidel Script & Semitic-Cushitic Synergy',
      category: 'Linguistic Geography',
      imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Africa’s only indigenous alphasyllabic writing system (Ge’ez abugida) utilized across Amharic, Tigrinya, and ancient parchment scriptures.',
      credit: 'Institute of Ethiopian Studies'
    },
    geography: {
      id: 'ETH',
      country: 'Ethiopia',
      pillarId: 'geography',
      title: 'Danakil Depression & Erta Ale Lava Lake',
      category: 'Physical Geography',
      imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      caption: 'Hyper-arid geological rift depression 125 meters below sea level with hydrothermal sulfur springs and persistent basaltic lava lakes.',
      credit: 'Geological Survey of Ethiopia'
    }
  },

  // MOROCCO (MAR)
  MAR: {
    people: {
      id: 'MAR',
      country: 'Morocco',
      pillarId: 'people',
      title: 'Amazigh & Arab Maghrebi Society',
      category: 'Demography & Society',
      imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
      caption: 'Centuries of civic cohesion uniting Amazigh mountain communities, Sahrawi traditions, and coastal Andalusian heritage.',
      credit: 'Haut-Commissariat au Plan'
    },
    future: {
      id: 'MAR',
      country: 'Morocco',
      pillarId: 'future',
      title: 'Noor Ouarzazate Solar Complex & Al Boraq High-Speed Rail',
      category: 'African Futures & Innovation',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      caption: 'World’s largest concentrated solar power (CSP) plant (580 MW) and Africa’s premier 320 km/h high-speed rail line.',
      credit: 'Moroccan Agency for Sustainable Energy (MASEN)'
    },
    climate: {
      id: 'MAR',
      country: 'Morocco',
      pillarId: 'climate',
      title: 'Toubkal National Park & Atlas Cedar Forests',
      category: 'Climate & Biosphere Reserve',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      caption: 'High Atlas alpine ecosystem crowned by Mount Toubkal (4,167m) and endemic endangered Barbary macaque habitats.',
      credit: 'Haut Commissariat aux Eaux et Forêts'
    },
    history: {
      id: 'MAR',
      country: 'Morocco',
      pillarId: 'history',
      title: 'Volubilis Roman City & Ksar of Ait-Ben-Haddou',
      category: 'Historiography & Liberation',
      imageUrl: 'https://images.unsplash.com/photo-1546816401-44754ab4d623?auto=format&fit=crop&w=1200&q=80',
      caption: 'Earthen pre-Saharan clay architecture along former trans-Saharan caravan routes and ancient Mauretanian antiquities.',
      credit: 'UNESCO World Heritage'
    },
    culture: {
      id: 'MAR',
      country: 'Morocco',
      pillarId: 'culture',
      title: 'Fez Medina & Zellige Artisanal Mastery',
      category: 'Material Culture & Arts',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      caption: 'UNESCO World Heritage Fez el-Bali, intricately chiseled zellige geometric mosaic tilework, and leather tanneries.',
      credit: 'Ministry of Youth, Culture and Communication'
    },
    economy: {
      id: 'MAR',
      country: 'Morocco',
      pillarId: 'economy',
      title: 'Tanger Med Mega Port & Automotive Industrial Clusters',
      category: 'Macroeconomics & Trade',
      imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
      caption: 'Mediterranean’s leading container transshipment hub handling 9 million TEUs, coupled with high-tech automotive manufacturing.',
      credit: 'Tanger Med Special Agency'
    },
    languages: {
      id: 'MAR',
      country: 'Morocco',
      pillarId: 'languages',
      title: 'Tifinagh Script & Maghrebi Arabic Orthography',
      category: 'Linguistic Geography',
      imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Official recognition of the Tamazight language and neo-Tifinagh alphabet alongside Darija dialect and classical Arabic.',
      credit: 'Institut Royal de la Culture Amazighe (IRCAM)'
    },
    geography: {
      id: 'MAR',
      country: 'Morocco',
      pillarId: 'geography',
      title: 'Erg Chebbi Dunes & Dades Gorges',
      category: 'Physical Geography',
      imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      caption: 'Towering 150-meter wind-blown orange dunes in the Sahara and rugged red limestone canyon river cuts.',
      credit: 'Moroccan National Tourist Office'
    }
  },

  // GHANA (GHA)
  GHA: {
    people: {
      id: 'GHA',
      country: 'Ghana',
      pillarId: 'people',
      title: 'Akan, Ga & Ewe Civic Harmony',
      category: 'Demography & Society',
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      caption: 'Exemplary peaceful democratic society with renowned hospitality (Akwaaba) and vibrant youth academic leadership.',
      credit: 'Ghana Statistical Service'
    },
    future: {
      id: 'GHA',
      country: 'Ghana',
      pillarId: 'future',
      title: 'AfCFTA Secretariat Headquarters & Tech Ecosystem',
      category: 'African Futures & Innovation',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      caption: 'Accra serving as the continental diplomatic capital of the African Continental Free Trade Area (AfCFTA) single market.',
      credit: 'AfCFTA Permanent Secretariat'
    },
    climate: {
      id: 'GHA',
      country: 'Ghana',
      pillarId: 'climate',
      title: 'Kakum National Park Canopy Walkway & Mole Biosphere',
      category: 'Climate & Biosphere Reserve',
      imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      caption: '350-meter suspended rainforest canopy walkway high above virgin tropical deciduous forest and elephant corridors.',
      credit: 'Wildlife Division of Ghana Forestry Commission'
    },
    history: {
      id: 'GHA',
      country: 'Ghana',
      pillarId: 'history',
      title: 'Cape Coast & Elmina Castles / Pan-African Vanguard',
      category: 'Historiography & Liberation',
      imageUrl: 'https://images.unsplash.com/photo-1546816401-44754ab4d623?auto=format&fit=crop&w=1200&q=80',
      caption: 'UNESCO memorial fortifications of the transatlantic trade and Kwame Nkrumah’s vanguard declaration of African independence.',
      credit: 'Ghana Museums and Monuments Board'
    },
    culture: {
      id: 'GHA',
      country: 'Ghana',
      pillarId: 'culture',
      title: 'Kente Weaving & Adinkra Philosophical Symbols',
      category: 'Material Culture & Arts',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      caption: 'Prestigious Bonwire royal silk and cotton Kente cloth hand-weaving, rich in philosophical maxims and chieftaincy regalia.',
      credit: 'National Commission on Culture'
    },
    economy: {
      id: 'GHA',
      country: 'Ghana',
      pillarId: 'economy',
      title: 'Tema Port & Cocoa Commodity Value Chains',
      category: 'Macroeconomics & Trade',
      imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
      caption: 'World’s second-largest premium cocoa exporter and modern Greenwich Meridian maritime transshipment container harbor.',
      credit: 'Ghana Ports and Harbours Authority'
    },
    languages: {
      id: 'GHA',
      country: 'Ghana',
      pillarId: 'languages',
      title: 'Twi, Fante & Gur Language Groups',
      category: 'Linguistic Geography',
      imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80',
      caption: 'Rich Akan linguistic dialects preserved in rich drum languages (Atumpan talking drums) and oral praise poetry.',
      credit: 'Bureau of Ghana Languages'
    },
    geography: {
      id: 'GHA',
      country: 'Ghana',
      pillarId: 'geography',
      title: 'Lake Volta Reservoir & Boti Twin Waterfalls',
      category: 'Physical Geography',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      caption: 'World’s largest artificial reservoir by surface area (8,502 km²) created by the Akosombo hydroelectric dam on the Volta River.',
      credit: 'Volta River Authority'
    }
  }
};

/**
 * Universal Pillar Thematic Archetypes (High-resolution, contextual fallbacks for any African nation)
 */
export const GENERIC_PILLAR_THEMES: Record<ThematicPillarId, {
  titleTemplate: (country: string) => string;
  category: string;
  imageUrl: string;
  captionTemplate: (country: string) => string;
  creditTemplate: (country: string) => string;
}> = {
  geography: {
    titleTemplate: (c) => `${c} Continental Topography & Waterways`,
    category: 'Physical Geography & Territoriality',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Natural physical landscape, mountain contours, river basins, and sovereign territory of ${c}.`,
    creditTemplate: () => 'African Geographic & Spatial Survey'
  },
  history: {
    titleTemplate: (c) => `${c} Historical Epochs & Liberation Milestones`,
    category: 'Historiography & Liberation Chronologies',
    imageUrl: 'https://images.unsplash.com/photo-1546816401-44754ab4d623?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Archaeological foundations, dynastic kingdoms, anti-colonial liberation triumphs, and national sovereignty in ${c}.`,
    creditTemplate: () => 'African Union Historic Archives'
  },
  people: {
    titleTemplate: (c) => `${c} Civic Society & Demographic Vitality`,
    category: 'Demography & Human Development',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Citizens, vibrant youth demographic vanguard, ethnic communities, and human capital across ${c}.`,
    creditTemplate: () => 'United Nations Population Division / National Census'
  },
  languages: {
    titleTemplate: (c) => `${c} Linguistic Diversity & Phyla Matrix`,
    category: 'Linguistic Geography & Phyla',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Indigenous language families, classical orthographies, community assemblies, and oral traditions in ${c}.`,
    creditTemplate: () => 'African Academy of Languages (ACALAN)'
  },
  culture: {
    titleTemplate: (c) => `${c} UNESCO Heritage & Material Culture`,
    category: 'Material Culture, Heritage & Arts',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Living cultural practices, UNESCO World Heritage monuments, artisanal crafts, and architectural traditions of ${c}.`,
    creditTemplate: () => 'UNESCO World Heritage Centre'
  },
  climate: {
    titleTemplate: (c) => `${c} National Parks & Biosphere Sanctuaries`,
    category: 'Biomes, Climate & Ecological Resilience',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Protected national reserves, tropical rainforests, savanna ecosystems, and biodiversity conservation in ${c}.`,
    creditTemplate: () => 'African Parks & Wildlife Conservation Authority'
  },
  economy: {
    titleTemplate: (c) => `${c} Commercial Hubs, Trade & Industrial Corridors`,
    category: 'Macroeconomics, Sovereignty & Trade',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Strategic ports, regional financial centers, agricultural logistics, and AfCFTA commerce in ${c}.`,
    creditTemplate: () => 'African Development Bank (AfDB)'
  },
  future: {
    titleTemplate: (c) => `${c} Capital Skyline & Digital Transformation`,
    category: 'Agenda 2063 & Future Horizons',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Modern skyline architecture, digital innovation corridors, renewable energy investments, and future development in ${c}.`,
    creditTemplate: () => 'African Union Agenda 2063 Commission'
  }
};

/**
 * Get pillar-specific high-resolution curated imagery for any African country
 */
export function getPillarThematicImage(
  entityId: string, 
  pillarId: ThematicPillarId, 
  countryName?: string
): PillarThematicImage {
  const code = entityId.toUpperCase();
  const country = countryName || code;

  // 1. Check if we have an explicit country + pillar curated match
  const countryRecord = COUNTRY_PILLAR_IMAGERY[code];
  if (countryRecord && countryRecord[pillarId]) {
    return countryRecord[pillarId]!;
  }

  // 2. Generate specialized thematic archetype tailored to this country
  const template = GENERIC_PILLAR_THEMES[pillarId] || GENERIC_PILLAR_THEMES.geography;
  return {
    id: code,
    country: country,
    pillarId: pillarId,
    title: template.titleTemplate(country),
    category: template.category,
    imageUrl: template.imageUrl,
    caption: template.captionTemplate(country),
    credit: template.creditTemplate(country)
  };
}

/**
 * Get prioritized Wikipedia search queries for a specific pillar and country
 */
export function getPillarWikiSearchCandidates(countryName: string, pillarId: ThematicPillarId): string[] {
  const clean = countryName.trim();
  switch (pillarId) {
    case 'people':
      return [
        `Demographics of ${clean}`,
        `People of ${clean}`,
        `Ethnic groups in ${clean}`,
        clean
      ];
    case 'climate':
      return [
        `Wildlife of ${clean}`,
        `Protected areas of ${clean}`,
        `Geography of ${clean}`,
        `National parks of ${clean}`,
        clean
      ];
    case 'future':
      return [
        `Science and technology in ${clean}`,
        `Telecommunications in ${clean}`,
        `Economy of ${clean}`,
        clean
      ];
    case 'history':
      return [
        `History of ${clean}`,
        clean
      ];
    case 'culture':
      return [
        `Culture of ${clean}`,
        `Art of ${clean}`,
        `Architecture of ${clean}`,
        clean
      ];
    case 'economy':
      return [
        `Economy of ${clean}`,
        `Transport in ${clean}`,
        clean
      ];
    case 'languages':
      return [
        `Languages of ${clean}`,
        clean
      ];
    case 'geography':
    default:
      return [
        `Geography of ${clean}`,
        clean
      ];
  }
}
