import { AfricanRegion } from './types';

export interface RegionalWikiDossier {
  region: AfricanRegion;
  m49Code: string;
  auRegion: string;
  wikipediaArticle: string;
  canonicalTitle: string;
  url: string;
  thumbnail: string;
  extract: string;
  summaryNarrative: string[];
  geography: {
    landAreaKm2: number;
    landAreaFormatted: string;
    majorRivers: string[];
    majorBiomes: string[];
    climateTypes: string[];
    ecologicalHighlights: string;
  };
  demographics: {
    estimatedPopulation: number;
    populationFormatted: string;
    urbanizationRate: string;
    medianAgeYears: number;
    lifeExpectancyAvg: number;
    demographicTrajectory: string;
  };
  economy: {
    combinedGdpBillions: number;
    gdpFormatted: string;
    gdpPerCapitaAvg: number;
    topCommodities: string[];
    keyEconomicSectors: string[];
    growthOutlook: string;
  };
  politics: {
    primaryRecs: {
      acronym: string;
      fullName: string;
      headquarters: string;
      treatyYear: number;
    }[];
    institutionalHubs: string[];
    governanceProfile: string;
  };
  languages: {
    majorPhyla: string[];
    vehicularLanguages: string[];
    indigenousScripts: string[];
    polyglotDescription: string;
  };
  tastAssociation: {
    embarkationZones: string[];
    estimatedCaptivesEmbarked: string;
    primaryHistoricPorts: string[];
    voyagesHistoricalNotes: string;
    diasporicDestinations: string[];
  };
}

export const WIKIPEDIA_REGIONAL_ATLAS: Record<AfricanRegion, RegionalWikiDossier> = {
  'Western Africa': {
    region: 'Western Africa',
    m49Code: '011',
    auRegion: 'Western Region',
    wikipediaArticle: 'West_Africa',
    canonicalTitle: 'West Africa',
    url: 'https://en.wikipedia.org/wiki/West_Africa',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/West_Africa_satellite_orthographic.jpg/640px-West_Africa_satellite_orthographic.jpg',
    extract: 'West Africa is the westernmost region of Africa. The United Nations defines Western Africa as the 16 countries of Benin, Burkina Faso, Cape Verde, The Gambia, Ghana, Guinea, Guinea-Bissau, Ivory Coast, Liberia, Mali, Mauritania, Niger, Nigeria, Senegal, Sierra Leone, and Togo. The population of West Africa is estimated at about 430 million people, and geographically it encompasses the arid Sahel in the north and the lush Guinean forests and Atlantic coastline in the south.',
    summaryNarrative: [
      'West Africa occupies an immense geographic expanse bounded by the Atlantic Ocean to the west and south, and the Sahara Desert to the north. It is a historical epicenter of medieval empires including the Ghana, Mali, and Songhai Empires.',
      'The region is characterized by high demographic dynamism, youthful energy, and thriving urban economic centers such as Lagos, Abidjan, Accra, and Dakar.',
      'Through regional integration initiatives spearheaded by the Economic Community of West African States (ECOWAS), member countries coordinate monetary policy, free movement of persons, and cross-border energy infrastructure.'
    ],
    geography: {
      landAreaKm2: 5112903,
      landAreaFormatted: '5.11 Million km²',
      majorRivers: ['Niger River (4,180 km)', 'Senegal River (1,086 km)', 'Volta River (1,500 km)', 'Gambia River (1,120 km)'],
      majorBiomes: ['Sahelian Acacia Savanna', 'Guinean Forest-Savanna Mosaic', 'Upper Guinean Lowland Rainforest', 'Mangrove Swamps'],
      climateTypes: ['Tropical Wet-and-Dry (Sudanian)', 'Tropical Rainforest (Guinean)', 'Semi-Arid (Sahelian)', 'Hot Arid (Sahara)'],
      ecologicalHighlights: 'Encompasses the Guinean Forests of West Africa biodiversity hotspot and the vital Great Green Wall ecological transition zone.'
    },
    demographics: {
      estimatedPopulation: 430000000,
      populationFormatted: '430 Million',
      urbanizationRate: '48.2%',
      medianAgeYears: 18.2,
      lifeExpectancyAvg: 58.4,
      demographicTrajectory: 'One of the youngest and fastest-growing regional populations in the world, generating a substantial demographic dividend.'
    },
    economy: {
      combinedGdpBillions: 785.4,
      gdpFormatted: '$785.4 Billion',
      gdpPerCapitaAvg: 1826,
      topCommodities: ['Cocoa (Côte d\'Ivoire & Ghana >60% world supply)', 'Crude Petroleum (Nigeria)', 'Bauxite (Guinea #1 global reserves)', 'Gold (Ghana, Mali)', 'Cashews', 'Cotton'],
      keyEconomicSectors: ['Agribusiness & Cocoa Value Chains', 'Hydrocarbons & Offshore Mining', 'Fintech & Digital Payments (Lagos Hub)', 'Creative Industries (Afrobeats, Nollywood)'],
      growthOutlook: 'Projected 4.1% annual GDP expansion driven by services, digital infrastructure, and the operationalization of the Dangote mega-refinery.'
    },
    politics: {
      primaryRecs: [
        { acronym: 'ECOWAS', fullName: 'Economic Community of West African States', headquarters: 'Abuja, Nigeria', treatyYear: 1975 },
        { acronym: 'UEMOA', fullName: 'West African Economic and Monetary Union', headquarters: 'Ouagadougou, Burkina Faso', treatyYear: 1994 },
        { acronym: 'MRU', fullName: 'Mano River Union', headquarters: 'Freetown, Sierra Leone', treatyYear: 1973 }
      ],
      institutionalHubs: ['Abuja (ECOWAS Commission)', 'Lomé (EBID & Ecobank HQ)', 'Ouagadougou (UEMOA HQ)'],
      governanceProfile: 'Robust democratic consolidation in coastal states (Cabo Verde, Ghana, Senegal) contrasted with transitional security councils in the Central Sahel.'
    },
    languages: {
      majorPhyla: ['Niger–Congo (Atlantic–Congo, Mande, Volta–Niger, Gur, Kwa)', 'Afroasiatic (Chadic/Hausa, Berber)', 'Nilo-Saharan (Songhai, Kanuri)'],
      vehicularLanguages: ['Hausa (75M+)', 'Yoruba (45M+)', 'Igbo (30M+)', 'Fula/Pulaar (35M+)', 'Akan/Twi (12M+)', 'Wolof (10M+)', 'Mandinka/Bambara (15M+)', 'French', 'English', 'Portuguese'],
      indigenousScripts: ['N\'Ko (Mande alphabet created by Solomana Kante)', 'Vai Syllabary (Liberia)', 'Nsibidi (Nigeria/Cameroon ideograms)', 'Garay (Wolof)', 'Adlam (Fula)'],
      polyglotDescription: 'Extraordinary linguistic plurality where polyglot citizens routinely navigate mother tongues alongside cross-border trade idioms and official state languages.'
    },
    tastAssociation: {
      embarkationZones: ['Senegambia', 'Sierra Leone', 'Windward Coast', 'Gold Coast', 'Bight of Benin', 'Bight of Biafra'],
      estimatedCaptivesEmbarked: '6.5+ Million Captives',
      primaryHistoricPorts: ['Ouidah (Benin)', 'Bonny & Calabar (Nigeria)', 'Elmina & Cape Coast (Ghana)', 'Gorée Island (Senegal)', 'Bunce Island (Sierra Leone)'],
      voyagesHistoricalNotes: 'The Transatlantic Slave Trade Database documents that more than half of all enslaved Africans brought to the Americas departed from West African littoral nodes. The genetic and cultural legacy survives across Brazil, the Caribbean, the Gullah Geechee coast, and Latin America.',
      diasporicDestinations: ['Bahia (Brazil)', 'Haiti & French Caribbean', 'Jamaica & British Caribbean', 'Cuba', 'United States Coastal Lowcountry']
    }
  },

  'Northern Africa': {
    region: 'Northern Africa',
    m49Code: '015',
    auRegion: 'Northern Region',
    wikipediaArticle: 'North_Africa',
    canonicalTitle: 'North Africa',
    url: 'https://en.wikipedia.org/wiki/North_Africa',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/North_Africa_%28orthographic_projection%29.svg/640px-North_Africa_%28orthographic_projection%29.svg.png',
    extract: 'North Africa is a region encompassing the northern portion of the African continent. The UN geoscheme defines Northern Africa as comprising Algeria, Egypt, Libya, Morocco, Sudan, Tunisia, and Western Sahara. Geographically, it is dominated by the Sahara Desert and bounded by the Mediterranean Sea to the north and the Red Sea to the east. It is a civilizational cradle featuring Ancient Egypt, Carthage, Islamic caliphates, and the Maghreb.',
    summaryNarrative: [
      'North Africa spans the southern Mediterranean basin, forming a historic geopolitical and commercial bridge between the African continent, Southern Europe, and the Middle East.',
      'The region houses the longest river in the world, the Nile, whose floodplains gave rise to Pharaonic civilization, alongside the Atlas Mountain ranges and the vast Sahara erg systems.',
      'Economically, North Africa features Africa\'s second and third largest economies (Egypt and Algeria) with diversified energy complexes, automotive manufacturing, and transcontinental maritime transit via the Suez Canal.'
    ],
    geography: {
      landAreaKm2: 8259000,
      landAreaFormatted: '8.26 Million km²',
      majorRivers: ['Nile River (6,650 km)', 'Medjerda River (450 km)', 'Moulouya River (520 km)', 'Sebou River (496 km)'],
      majorBiomes: ['Sahara Desert (Ergs & Regs)', 'Mediterranean Forests, Woodlands & Scrub', 'Atlas Montane Alpine Steppe', 'Nile Delta Wetlands'],
      climateTypes: ['Mediterranean (Warm coastal dry summer)', 'Hyper-Arid (Sahara Desert)', 'Semi-Arid Steppe (Sahelian transition)'],
      ecologicalHighlights: 'Contains the Atlas Mountains biodiversity corridor (Barbary macaque, cedar forests) and the vital Nile River Basin freshwater lifelines.'
    },
    demographics: {
      estimatedPopulation: 260000000,
      populationFormatted: '260 Million',
      urbanizationRate: '54.6%',
      medianAgeYears: 25.8,
      lifeExpectancyAvg: 72.8,
      demographicTrajectory: 'Higher median age and demographic transition maturity relative to sub-Saharan Africa, accompanied by rapid urban university graduation rates.'
    },
    economy: {
      combinedGdpBillions: 892.1,
      gdpFormatted: '$892.1 Billion',
      gdpPerCapitaAvg: 3431,
      topCommodities: ['Natural Gas & LNG (Algeria, Egypt)', 'Crude Petroleum (Libya, Algeria)', 'Phosphates & Fertilizers (Morocco holds ~70% world reserves)', 'Automotive & Aeronautics (Morocco)', 'Citrus & Olive Oil (Tunisia, Morocco)'],
      keyEconomicSectors: ['Energy & Petrochemical Refining', 'Maritime Logistics & Global Shipping (Suez Canal, Tanger Med Port)', 'Automotive & Aerospace Manufacturing', 'Tourism & Cultural Heritage'],
      growthOutlook: 'Expanded green hydrogen corridors toward Europe and industrial automotive assembly plants positioning the region as a primary nearshoring hub.'
    },
    politics: {
      primaryRecs: [
        { acronym: 'AMU', fullName: 'Arab Maghreb Union', headquarters: 'Rabat, Morocco', treatyYear: 1989 },
        { acronym: 'COMESA', fullName: 'Common Market for Eastern and Southern Africa (Egypt, Sudan, Tunisia, Libya)', headquarters: 'Lusaka, Zambia', treatyYear: 1994 },
        { acronym: 'LAS', fullName: 'League of Arab States', headquarters: 'Cairo, Egypt', treatyYear: 1945 }
      ],
      institutionalHubs: ['Cairo (Arab League HQ)', 'Rabat (AMU Secretariat)', 'Tunis (Pan-Mediterranean Forum)'],
      governanceProfile: 'Constitutional monarchies and presidential republics actively coordinating on Mediterranean maritime security, energy interconnection, and trade.'
    },
    languages: {
      majorPhyla: ['Afroasiatic (Semitic/Arabic, Berber/Tamazight, Cushitic/Beja, historical Coptic)', 'Nilo-Saharan (Nubian)'],
      vehicularLanguages: ['Arabic (Modern Standard, Egyptian, Maghrebi Darija, Sudanese)', 'Tamazight (Kabyle, Shilha, Riffian, Tuareg Tamahaq)', 'French', 'English'],
      indigenousScripts: ['Tifinagh (Ancient Libyco-Berber script, official in Morocco & Algeria)', 'Arabic Calligraphy (Maghrebi script)', 'Coptic Script', 'Egyptian Hieroglyphs'],
      polyglotDescription: 'Bilingual and trilingual cultures where Modern Standard Arabic and national colloquial dialects blend with Amazigh idioms and international diplomatic tongues.'
    },
    tastAssociation: {
      embarkationZones: ['Trans-Saharan Caravans', 'Red Sea & Mediterranean Maritime Networks'],
      estimatedCaptivesEmbarked: 'Trans-Saharan & Red Sea Routes (~1.5M over multiple centuries)',
      primaryHistoricPorts: ['Alexandria (Egypt)', 'Tripoli (Libya)', 'Tunis & Carthage (Tunisia)', 'Suakin (Sudan Red Sea)'],
      voyagesHistoricalNotes: 'While the Transatlantic Slave Trade primarily departed from Atlantic African ports, trans-Saharan and Mediterranean maritime trade routes connected North Africa to the African interior and Ottoman/Levantine networks for millennia.',
      diasporicDestinations: ['Mediterranean Rim', 'Levant & Ottoman territories', 'Red Sea maritime hubs']
    }
  },

  'Central Africa': {
    region: 'Central Africa',
    m49Code: '017',
    auRegion: 'Central Region',
    wikipediaArticle: 'Central_Africa',
    canonicalTitle: 'Central Africa',
    url: 'https://en.wikipedia.org/wiki/Central_Africa',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Central_Africa_%28orthographic_projection%29.svg/640px-Central_Africa_%28orthographic_projection%29.svg.png',
    extract: 'Central Africa is a subregion of the African continent comprising Angola, Cameroon, the Central African Republic, Chad, the Democratic Republic of the Congo, the Republic of the Congo, Equatorial Guinea, Gabon, and São Tomé and Príncipe. Dominated by the Congo River basin, it contains the second-largest contiguous tropical rainforest on Earth (the "Lungs of Africa"), rich mineral wealth, and extraordinary biodiversity.',
    summaryNarrative: [
      'Central Africa is anchored by the Congo River Basin—the second largest river system by discharge on Earth—and the vast equatorial rainforests of the Congo Basin, which sequester more carbon than the Amazon.',
      'The region holds indispensable strategic mineral reserves for the global energy transition, including more than 70% of the world\'s cobalt, world-class copper belts, coltan, diamonds, and lithium in the Katanga crescent.',
      'Through the Economic Community of Central African States (ECCAS) and CEMAC, the region coordinates forestry preservation, cross-border conservation complexes, and monetary integration.'
    ],
    geography: {
      landAreaKm2: 6613000,
      landAreaFormatted: '6.61 Million km²',
      majorRivers: ['Congo River (4,700 km, depth up to 220m)', 'Ogooué River (1,200 km)', 'Sanaga River (918 km)', 'Ubangi River (1,060 km)'],
      majorBiomes: ['Congo Basin Equatorial Lowland Rainforest', 'Albertine Rift Montane Forests', 'Northern Congolian Forest-Savanna', 'Cuvette Centrale Peatlands'],
      climateTypes: ['Equatorial Wet (Year-round rain)', 'Tropical Monsoon', 'Wet-and-Dry Savanna (North & South periphery)'],
      ecologicalHighlights: 'Houses the Sangha Trinational UNESCO site, Virunga national park (mountain gorillas), and the world\'s largest tropical peatland complex (sequestering 30B tons of carbon).'
    },
    demographics: {
      estimatedPopulation: 195000000,
      populationFormatted: '195 Million',
      urbanizationRate: '49.1%',
      medianAgeYears: 17.5,
      lifeExpectancyAvg: 60.1,
      demographicTrajectory: 'A profoundly youthful population anchored by major metropolitan agglomerations such as Kinshasa, Luanda, Douala, and Brazzaville.'
    },
    economy: {
      combinedGdpBillions: 268.5,
      gdpFormatted: '$268.5 Billion',
      gdpPerCapitaAvg: 1376,
      topCommodities: ['Cobalt (>70% world supply, DRC)', 'Copper & Coltan (DRC)', 'Crude Petroleum (Angola, Gabon, Eq. Guinea, RoC)', 'Timber (Gabon certified sustainably)', 'Diamonds', 'Manganese'],
      keyEconomicSectors: ['Strategic Battery Mineral Extraction', 'Hydrocarbons & Offshore Drilling', 'Sustainable Forestry & Wood Processing', 'Hydroelectric Power Generation (Inga Dams)'],
      growthOutlook: 'Critical global supply bottleneck for green energy transition minerals driving record infrastructure investments into the Lobito Atlantic Corridor.'
    },
    politics: {
      primaryRecs: [
        { acronym: 'ECCAS', fullName: 'Economic Community of Central African States', headquarters: 'Libreville, Gabon', treatyYear: 1983 },
        { acronym: 'CEMAC', fullName: 'Central African Economic and Monetary Community', headquarters: 'Bangui, CAR', treatyYear: 1994 },
        { acronym: 'COMIFAC', fullName: 'Central African Forest Commission', headquarters: 'Yaoundé, Cameroon', treatyYear: 2005 }
      ],
      institutionalHubs: ['Libreville (ECCAS HQ)', 'Yaoundé (CEMAC Parliament & Bank)', 'Brazzaville (Congo Basin Climate Commission)'],
      governanceProfile: 'Coordinated transboundary conservation treaties (COMIFAC) alongside regional energy pooling through the Central African Power Pool (PEAC).'
    },
    languages: {
      majorPhyla: ['Niger–Congo (Bantu Expansion epicenter, Ubangian, Adamawa)', 'Nilo-Saharan (Central Sudanic, Sara)', 'Ubangian (Sango)'],
      vehicularLanguages: ['Lingala (40M+ across DRC and RoC)', 'Kikongo / Kituba (15M+)', 'Swahili (Eastern DRC)', 'Tshiluba (8M+)', 'Fang', 'Sango', 'French', 'Portuguese', 'Spanish'],
      indigenousScripts: ['Mwangwego script', 'Bantu orthographies', 'Pygmy oral linguistic heritage'],
      polyglotDescription: 'The ancestral cradle of the great Bantu expansion, featuring deeply rooted shared linguistic roots and vibrant vehicular urban tongues.'
    },
    tastAssociation: {
      embarkationZones: ['West Central Africa (Angola, Cabinda, Kingdom of Kongo)'],
      estimatedCaptivesEmbarked: '5.7+ Million Captives (45% of total transatlantic volume)',
      primaryHistoricPorts: ['Luanda (Angola - world\'s largest single embarkation port)', 'Benguela (Angola)', 'Cabinda', 'Mpinda & Congo River estuary', 'São Tomé'],
      voyagesHistoricalNotes: 'West Central Africa was the largest single geographic source of transatlantic enslaved people in human history. Millions of Kongo and Mbundu individuals were shipped directly to Brazil and the Caribbean, founding the capoeira, candomblé, and samba cultures.',
      diasporicDestinations: ['Rio de Janeiro & Salvador da Bahia (Brazil)', 'Cuba', 'Haiti (Saint-Domingue)', 'Cartagena (Colombia)', 'New Orleans & Chesapeake']
    }
  },

  'Eastern Africa': {
    region: 'Eastern Africa',
    m49Code: '014',
    auRegion: 'Eastern Region',
    wikipediaArticle: 'East_Africa',
    canonicalTitle: 'East Africa',
    url: 'https://en.wikipedia.org/wiki/East_Africa',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Eastern_Africa_%28orthographic_projection%29.svg/640px-Eastern_Africa_%28orthographic_projection%29.svg.png',
    extract: 'East Africa is the eastern subregion of the African continent. In the UN geoscheme, it comprises 18 sovereign states and 2 territories: Burundi, Comoros, Djibouti, Eritrea, Ethiopia, Kenya, Madagascar, Malawi, Mauritius, Mozambique, Rwanda, Seychelles, Somalia, South Sudan, Tanzania, Uganda, Zambia, and Zimbabwe. Renowned as the cradle of humankind, it features the Great Rift Valley, Mount Kilimanjaro, the African Great Lakes, and dynamic tech and agricultural economies.',
    summaryNarrative: [
      'East Africa is world-renowned as the paleoanthropological cradle of humankind, where fossils of early hominins (Australopithecus afarensis / "Lucy") and modern Homo sapiens were discovered in the Great Rift Valley.',
      'Geographically, the region is defined by geological rifting, Africa\'s highest peak (Mount Kilimanjaro at 5,895m), and the African Great Lakes system (Lake Victoria, Lake Tanganyika).',
      'The East African Community (EAC) represents Africa\'s most deeply integrated economic bloc, with advanced customs union protocols, common market frameworks, and plans for a single currency.'
    ],
    geography: {
      landAreaKm2: 7070000,
      landAreaFormatted: '7.07 Million km²',
      majorRivers: ['White Nile & Blue Nile', 'Zambezi River (2,574 km)', 'Ruvuma River', 'Jubba & Shabelle'],
      majorBiomes: ['Serengeti-Mara Savanna Ecosystem', 'Great Rift Valley Lakes', 'East African Montane Forest & Moorland', 'Horn of Africa Xeric Shrublands', 'Madagascar Spiny Thicket'],
      climateTypes: ['Equatorial Highland (Temperate Nairobi & Addis Ababa)', 'Tropical Semi-Arid (Savanna)', 'Arid Desert (Horn of Africa)', 'Humid Subtropical (Coastal Indian Ocean)'],
      ecologicalHighlights: 'Features the Great Serengeti-Mara Wildebeest Migration, Ngorongoro Crater, the endemic biodiversity of Madagascar, and Victoria Falls.'
    },
    demographics: {
      estimatedPopulation: 470000000,
      populationFormatted: '470 Million',
      urbanizationRate: '31.5%',
      medianAgeYears: 18.9,
      lifeExpectancyAvg: 65.2,
      demographicTrajectory: 'The most populous UN subregion of Africa, with dynamic rural-urban migration and expanding secondary urban nodes.'
    },
    economy: {
      combinedGdpBillions: 452.3,
      gdpFormatted: '$452.3 Billion',
      gdpPerCapitaAvg: 962,
      topCommodities: ['Coffee (Ethiopia #1 in Africa, Kenya, Rwanda)', 'Tea (Kenya #1 global exporter)', 'Horticulture & Cut Flowers (Kenya, Ethiopia)', 'Gold (Tanzania, Zimbabwe)', 'Titanium & Rare Earths', 'Blue Economy / Tourism (Seychelles, Mauritius)'],
      keyEconomicSectors: ['Digital Finance & Mobile Money (Silicon Savannah / M-Pesa)', 'Commercial Agriculture & Agro-processing', 'Renewable Geothermal & Hydro Energy (Olkaria, GERD Dam)', 'Eco-Tourism & Wildlife Safaris'],
      growthOutlook: 'Consistently among the fastest growing economic zones in Africa, projected at 5.2% annual GDP expansion led by infrastructure investments and manufacturing.'
    },
    politics: {
      primaryRecs: [
        { acronym: 'EAC', fullName: 'East African Community (8 sovereign states)', headquarters: 'Arusha, Tanzania', treatyYear: 1999 },
        { acronym: 'IGAD', fullName: 'Intergovernmental Authority on Development', headquarters: 'Djibouti City, Djibouti', treatyYear: 1996 },
        { acronym: 'COMESA', fullName: 'Common Market for Eastern and Southern Africa', headquarters: 'Lusaka, Zambia', treatyYear: 1994 }
      ],
      institutionalHubs: ['Addis Ababa (African Union Headquarters & UNECA)', 'Arusha (EAC Secretariat & East African Court of Justice)', 'Nairobi (UNEP & UN-Habitat Global HQs)'],
      governanceProfile: 'High degree of institutional integration under the EAC Treaty, supported by the African Union diplomatic headquarters in Addis Ababa.'
    },
    languages: {
      majorPhyla: ['Niger–Congo (Bantu branch)', 'Afroasiatic (Cushitic, Semitic/Amharic, Omotic)', 'Nilo-Saharan (Nilotic/Maasai/Luo)', 'Austronesian (Malagasy)'],
      vehicularLanguages: ['Swahili (Kiswahili, 150M+ speakers, official AU working language)', 'Amharic (50M+)', 'Oromo (40M+)', 'Somali (22M+)', 'Tigrinya', 'Malagasy (28M+)', 'Luganda', 'Shona', 'English', 'French', 'Portuguese'],
      indigenousScripts: ['Ge\'ez / Ethiopic script (one of world\'s oldest continuous writing systems)', 'Osmanya script (Somali)', 'Swahili historic Ajami and Latin scripts'],
      polyglotDescription: 'Home to Swahili, the premier indigenous lingua franca of the African continent and official working language of both the African Union and SADC.'
    },
    tastAssociation: {
      embarkationZones: ['South-East Africa & Mozambique Channel', 'Swahili Coast'],
      estimatedCaptivesEmbarked: '542,000+ Captives in Transatlantic Voyages + Indian Ocean Trade',
      primaryHistoricPorts: ['Mozambique Island', 'Quelimane (Mozambique)', 'Kilwa Kisiwani (Tanzania)', 'Zanzibar Stone Town', 'Inhambane'],
      voyagesHistoricalNotes: 'The 19th-century transatlantic trade saw thousands of captives embarked from Mozambique ports around the Cape of Good Hope to Brazil and Cuba. Concurrently, Swahili coast trade nodes connected the Indian Ocean basin with Mauritius, Réunion, and the Persian Gulf.',
      diasporicDestinations: ['Rio de Janeiro & São Paulo (Brazil)', 'Cuba', 'Mauritius & Réunion', 'Oman & Persian Gulf', 'Gujarat (Siddi communities)']
    }
  },

  'Southern Africa': {
    region: 'Southern Africa',
    m49Code: '018',
    auRegion: 'Southern Region',
    wikipediaArticle: 'Southern_Africa',
    canonicalTitle: 'Southern Africa',
    url: 'https://en.wikipedia.org/wiki/Southern_Africa',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Southern_Africa_%28orthographic_projection%29.svg/640px-Southern_Africa_%28orthographic_projection%29.svg.png',
    extract: 'Southern Africa is the southernmost subregion of the African continent. Under the UN geoscheme, it strictly consists of Botswana, Eswatini, Lesotho, Namibia, and South Africa. Characterized by high plateaus (Highveld, Drakensberg), the Kalahari and Namib deserts, and the Cape Floral Kingdom (one of six global floral kingdoms), Southern Africa possesses industrialized manufacturing hubs, deep financial markets, and world-leading mineral reserves.',
    summaryNarrative: [
      'Southern Africa encompasses the southernmost territories of the continent, flanked by the cold Atlantic Benguela Current to the west and the warm Indian Ocean Agulhas Current to the east.',
      'It hosts Africa\'s most sophisticated industrial and financial economy (South Africa), the world\'s leading diamond producer by value (Botswana), and breathtaking geographic wonders like the Kalahari Desert and the Drakensberg mountains.',
      'The Southern African Customs Union (SACU), founded in 1910, is the oldest operating customs union in the world, facilitating seamless internal tariff-free trade.'
    ],
    geography: {
      landAreaKm2: 2693418,
      landAreaFormatted: '2.69 Million km²',
      majorRivers: ['Orange River (2,200 km)', 'Limpopo River (1,750 km)', 'Okavango River & Inland Delta', 'Vaal River (1,120 km)'],
      majorBiomes: ['Cape Floral Kingdom (Fynbos & Renosterveld)', 'Succulent Karoo & Nama Karoo', 'Kalahari Xeric Savanna', 'Namib Desert (world\'s oldest desert)', 'Highveld Grasslands'],
      climateTypes: ['Mediterranean (Western Cape)', 'Semi-Arid Steppe (Karoo & Kalahari)', 'Subtropical Humid (KwaZulu-Natal)', 'Desert (Namib)'],
      ecologicalHighlights: 'Contains the Cape Floral Region—a global botanical biodiversity marvel with >9,000 plant species (69% endemic)—and the Okavango Inland Delta UNESCO wetland.'
    },
    demographics: {
      estimatedPopulation: 69000000,
      populationFormatted: '69 Million',
      urbanizationRate: '67.8%',
      medianAgeYears: 27.2,
      lifeExpectancyAvg: 64.9,
      demographicTrajectory: 'The highest urbanization rate on the African continent, with concentrated metropolitan corridors across Gauteng (Johannesburg-Pretoria), Cape Town, and Durban.'
    },
    economy: {
      combinedGdpBillions: 432.8,
      gdpFormatted: '$432.8 Billion',
      gdpPerCapitaAvg: 6272,
      topCommodities: ['Platinum Group Metals (>75% world supply, South Africa)', 'Gem Diamonds (Botswana #1 global producer by value, Namibia)', 'Gold & Manganese', 'Automotive Assemblies (BMW, Mercedes, Toyota, Ford)', 'Wine & Citrus Fruit'],
      keyEconomicSectors: ['Advanced Financial Services (Johannesburg Stock Exchange JSE)', 'Automotive & Heavy Industrial Manufacturing', 'Deep-Level Mineral Extraction & Beneficiation', 'Renewable Wind & Solar Mega-Projects (Northern Cape)'],
      growthOutlook: 'Supported by deep institutional capital markets, green hydrogen corridors in Namibia, and critical mineral value addition.'
    },
    politics: {
      primaryRecs: [
        { acronym: 'SACU', fullName: 'Southern African Customs Union (Oldest in the world, est. 1910)', headquarters: 'Windhoek, Namibia', treatyYear: 1910 },
        { acronym: 'SADC', fullName: 'Southern African Development Community', headquarters: 'Gaborone, Botswana', treatyYear: 1992 }
      ],
      institutionalHubs: ['Gaborone (SADC Headquarters)', 'Windhoek (SACU Secretariat)', 'Johannesburg (Pan-African Parliament)'],
      governanceProfile: 'Long-standing constitutional democracies, independent judicial institutions, and peer-reviewed electoral transitions.'
    },
    languages: {
      majorPhyla: ['Niger–Congo (Southern Bantu: Nguni, Sotho–Tswana, Tsonga, Venda)', 'Khoisan families (Kx\'a, Tuu, Khoe-Kwadi)', 'Indo-European (Afrikaans, English)'],
      vehicularLanguages: ['isiZulu (12M+)', 'isiXhosa (8M+)', 'Afrikaans (7M+)', 'Setswana (5M+)', 'Sesotho', 'Sepedi', 'English', 'Khoekhoegowab (Nama)'],
      indigenousScripts: ['Latin orthographies featuring specialized click consonant letters (c, q, x, ǃ, ǂ, ǁ)', 'San ancient rock art petroglyphs and cosmograms'],
      polyglotDescription: 'Famous for its 12 official languages in South Africa, rich click consonant phonologies inherited from indigenous Khoe-San first nations, and vibrant multilingual townships.'
    },
    tastAssociation: {
      embarkationZones: ['Cape of Good Hope Maritime Crossroads', 'VOC Indian Ocean & Atlantic Slave Systems'],
      estimatedCaptivesEmbarked: 'Direct Transatlantic: Minor (~60,000); Cape Slaving Station: 65,000+ imported',
      primaryHistoricPorts: ['Cape Town (Table Bay)', 'Saldanha Bay', 'Lüderitz (historic maritime)'],
      voyagesHistoricalNotes: 'The Cape of Good Hope served as the strategic pivot point between the Atlantic and Indian Ocean slave trade circuits. Enslaved persons from Madagascar, Mozambique, Indonesia, and India were imported by the VOC, forging the distinctive Cape Malay cultural and architectural heritage.',
      diasporicDestinations: ['Cape Town / Bo-Kaap', 'Transatlantic maritime provisioning networks', 'St. Helena']
    }
  }
};
