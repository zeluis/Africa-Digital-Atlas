import { EntityBlocId } from './entityBlocs';

export interface BlocWikiDossier {
  blocId: EntityBlocId;
  canonicalTitle: string;
  url: string;
  extract: string;
  summaryNarrative: string[];
  headquartersCity: string;
  establishedDate: string;
  foundingTreaty: string;
  officialWorkingLanguages: string[];
  indicators: {
    customsUnionStatus: string;
    tradeIntegrationScore: string;
    intraBlocTradeShare: string;
    monetaryFramework: string;
    keyEconomicPillars: string[];
  };
  demographics: {
    estimatedPopulation: string;
    urbanizationRate: string;
    medianAge: string;
    majorEthnolinguisticPhyla: string[];
  };
  geography: {
    landAreaKm2Formatted: string;
    majorWaterways: string[];
    dominantBiomes: string[];
    climateZones: string[];
  };
  landmarksEcology: {
    transboundaryReserves: string[];
    unescoBiospheres: string[];
    notableLandmarks: string[];
    ecologicalThreats: string[];
  };
  institutionsTreaties: {
    executiveOrgans: string[];
    parliamentaryOrJudicialBodies: string[];
    financialInstitutions: string[];
    landmarkAgreements: string[];
  };
}

export const WIKIPEDIA_BLOC_DOSSIERS: Record<EntityBlocId, BlocWikiDossier> = {
  ECOWAS: {
    blocId: 'ECOWAS',
    canonicalTitle: 'Economic Community of West African States',
    url: 'https://en.wikipedia.org/wiki/Economic_Community_of_West_African_States',
    extract: 'The Economic Community of West African States (ECOWAS) is a regional political and economic union of 15 countries located in West Africa. Established in 1975 via the Treaty of Lagos, its goal is to achieve collective self-sufficiency, foster free movement of persons, create a single large trading bloc, and establish an economic and monetary union.',
    summaryNarrative: [
      'Founded on 28 May 1975 with the signing of the Treaty of Lagos, ECOWAS was established to promote economic integration across all fields of activity, particularly industry, transport, telecommunications, energy, agriculture, natural resources, commerce, monetary and financial questions, and social and cultural matters.',
      'ECOWAS operates as a customs union and regional peacekeeping mechanism through its monitoring group (ECOMOG). The bloc is also developing the Eco single currency project and enforcing the ECOWAS Trade Liberalization Scheme (ETLS) to facilitate tariff-free trade on originating goods across the sub-region.'
    ],
    headquartersCity: 'Abuja, Nigeria',
    establishedDate: '28 May 1975',
    foundingTreaty: 'Treaty of Lagos (Revised 1993, Cotonou)',
    officialWorkingLanguages: ['English', 'French', 'Portuguese'],
    indicators: {
      customsUnionStatus: 'Common External Tariff (CET) in force since 2015',
      tradeIntegrationScore: 'Highest intra-African mobility rate (ECOWAS Passport)',
      intraBlocTradeShare: '~12.5% of total merchandise trade',
      monetaryFramework: 'Eco currency convergence zone (WAMI) + CFA Franc zone (WAEMU)',
      keyEconomicPillars: ['Petroleum & Gas (Nigeria)', 'Cocoa & Gold (Ghana, Côte d\'Ivoire)', 'Agriculture & Cotton (Sahel)']
    },
    demographics: {
      estimatedPopulation: '440+ Million',
      urbanizationRate: '49.5%',
      medianAge: '18.2 Years',
      majorEthnolinguisticPhyla: ['Niger-Congo (Atlantic, Volta-Niger, Kwa, Mande)', 'Afroasiatic (Chadic/Hausa)']
    },
    geography: {
      landAreaKm2Formatted: '5,112,903 km²',
      majorWaterways: ['Niger River', 'Senegal River', 'Volta River Basin', 'Gambia River', 'Benue River'],
      dominantBiomes: ['Guinean Moist Forests', 'West Sudanian Savanna', 'Sahel Acacia Savanna', 'Mangrove Littoral'],
      climateZones: ['Tropical Wet-and-Dry', 'Equatorial Monsoon', 'Semi-Arid Sahelian']
    },
    landmarksEcology: {
      transboundaryReserves: ['W-Arly-Pendjari (WAP) Complex (Benin, Burkina Faso, Niger)', 'Tai-Grebo-Krahn Forest Corridor (Côte d\'Ivoire, Liberia)'],
      unescoBiospheres: ['Mount Nimba Strict Nature Reserve', 'Djoudj National Bird Sanctuary', 'Saloum Delta Biosphere'],
      notableLandmarks: ['Historic City of Grand-Bassam', 'Tomb of Askia', 'Cape Coast & Elmina Castles', 'Zuma Rock'],
      ecologicalThreats: ['Sahelian Desertification', 'Coastal Erosion in Gulf of Guinea', 'Deforestation for Cash Crops']
    },
    institutionsTreaties: {
      executiveOrgans: ['ECOWAS Commission (Abuja)', 'Authority of Heads of State and Government', 'Council of Ministers'],
      parliamentaryOrJudicialBodies: ['ECOWAS Community Parliament (Abuja)', 'Community Court of Justice (Abuja)'],
      financialInstitutions: ['ECOWAS Bank for Investment and Development (EBID, Lomé)', 'West African Monetary Institute (WAMI, Accra)'],
      landmarkAgreements: ['1979 Protocol on Free Movement of Persons', 'ECOWAS Trade Liberalisation Scheme (ETLS)', '2001 Protocol on Democracy and Good Governance']
    }
  },

  WAEMU: {
    blocId: 'WAEMU',
    canonicalTitle: 'West African Economic and Monetary Union',
    url: 'https://en.wikipedia.org/wiki/West_African_Economic_and_Monetary_Union',
    extract: 'The West African Economic and Monetary Union (also known by its French acronym UEMOA) is an organization of eight mostly Francophone West African states. Established in 1994, it features a complete customs union, common currency (the West African CFA franc), and a unified central bank (BCEAO).',
    summaryNarrative: [
      'Created by treaty signed in Dakar on 10 January 1994 following the 50% devaluation of the CFA franc, WAEMU aims to achieve greater economic competitiveness through open markets and the rationalization and harmonization of legal environments.',
      'WAEMU represents the deepest monetary and macroeconomic integration on the continent, with common external tariffs, harmonized fiscal convergence criteria, and the regional securities market (BRVM) based in Abidjan.'
    ],
    headquartersCity: 'Ouagadougou, Burkina Faso',
    establishedDate: '10 January 1994',
    foundingTreaty: 'Dakar Treaty of the WAEMU',
    officialWorkingLanguages: ['French', 'Portuguese (Guinea-Bissau)'],
    indicators: {
      customsUnionStatus: 'Full Customs & Monetary Union with Common Tariff since 2000',
      tradeIntegrationScore: 'High monetary convergence & shared capital markets (BRVM)',
      intraBlocTradeShare: '~15.8% intra-zone merchandise commerce',
      monetaryFramework: 'West African CFA Franc (XOF) pegged to the Euro (BCEAO)',
      keyEconomicPillars: ['Agriculture & Agro-industries', 'Cocoa, Coffee & Cashews', 'Cotton, Gold & Phosphate Mining']
    },
    demographics: {
      estimatedPopulation: '140+ Million',
      urbanizationRate: '41.2%',
      medianAge: '17.9 Years',
      majorEthnolinguisticPhyla: ['Niger-Congo (Mande, Gur, Kwa, Atlantic)', 'Afroasiatic (Berber, Songhay)']
    },
    geography: {
      landAreaKm2Formatted: '3,506,126 km²',
      majorWaterways: ['Niger River', 'Senegal River Basin', 'Bandama River', 'Comoé River'],
      dominantBiomes: ['Sudano-Sahelian Savanna', 'Guinean Forest-Savanna Mosaic', 'Coastal Lagoons'],
      climateZones: ['Sahelian Semi-Arid', 'Tropical Savanna', 'Humid Tropical']
    },
    landmarksEcology: {
      transboundaryReserves: ['Parc National du W', 'Niokolo-Koba National Park'],
      unescoBiospheres: ['Comoé National Park', 'Mare aux Hippopotames Biosphere Reserve', 'Bijagós Archipelago Biosphere'],
      notableLandmarks: ['Basilica of Our Lady of Peace (Yamoussoukro)', 'Island of Gorée', 'Koutammakou Landscape'],
      ecologicalThreats: ['Harmattan Drought Stress', 'Mangrove Forest Depletion', 'Overgrazing']
    },
    institutionsTreaties: {
      executiveOrgans: ['WAEMU Commission (Ouagadougou)', 'Conference of Heads of State'],
      parliamentaryOrJudicialBodies: ['Inter-Parliamentary Committee (Bamako)', 'WAEMU Court of Justice (Ouagadougou)', 'Court of Accounts'],
      financialInstitutions: ['Central Bank of West African States (BCEAO, Dakar)', 'West African Development Bank (BOAD, Lomé)', 'Regional Council for Public Savings and Financial Markets (CREPMF)'],
      landmarkAgreements: ['1994 Dakar Treaty', 'Treaty on the Establishment of the Regional Stock Exchange (BRVM)', 'Community Investment Code']
    }
  },

  EAC: {
    blocId: 'EAC',
    canonicalTitle: 'East African Community',
    url: 'https://en.wikipedia.org/wiki/East_African_Community',
    extract: 'The East African Community (EAC) is an intergovernmental organisation composed of 8 partner states in the African Great Lakes region of East Africa. Originally founded in 1967, collapsed in 1977, and officially revived in 2000, it operates a customs union and common market, with long-term goals of a monetary union and political federation.',
    summaryNarrative: [
      'The EAC Treaty was signed on 30 November 1999 and entered into force on 7 July 2000 following ratification by the original three partner states: Kenya, Tanzania, and Uganda. It subsequently expanded to include Rwanda, Burundi, South Sudan, the Democratic Republic of the Congo, and Somalia.',
      'The EAC is widely recognized as one of the fastest-integrating regional blocs in Africa, featuring an operational Single Customs Territory, electronic cargo tracking, and the EAC Common Market Protocol allowing free movement of labour, capital, goods, and services.'
    ],
    headquartersCity: 'Arusha, Tanzania',
    establishedDate: '7 July 2000 (Revived)',
    foundingTreaty: 'Treaty for the Establishment of the East African Community',
    officialWorkingLanguages: ['English', 'Kiswahili', 'French'],
    indicators: {
      customsUnionStatus: 'Operational Single Customs Territory (SCT) with common tariff',
      tradeIntegrationScore: 'Very High (~22% intra-regional trade intensity)',
      intraBlocTradeShare: '~22.1% of combined partner state exports',
      monetaryFramework: 'East African Monetary Union (EAMU) Protocol in phased rollout',
      keyEconomicPillars: ['Agriculture & Horticulture (Tea, Coffee, Cut Flowers)', 'Transit Corridors (Northern & Central Corridors)', 'Minerals, Oil & Geothermal Energy']
    },
    demographics: {
      estimatedPopulation: '315+ Million',
      urbanizationRate: '31.8%',
      medianAge: '18.7 Years',
      majorEthnolinguisticPhyla: ['Niger-Congo (Bantu branches)', 'Nilo-Saharan (Nilotic, Cushitic)', 'Afroasiatic (Somali, Oromo)']
    },
    geography: {
      landAreaKm2Formatted: '4,810,363 km²',
      majorWaterways: ['Lake Victoria', 'Lake Tanganyika', 'Lake Albert', 'White Nile', 'Congo River Basin (DRC reach)'],
      dominantBiomes: ['East African Montane Forests', 'Serengeti Acacia Savanna', 'Albertine Rift Montane', 'Congo Basin Rainforests'],
      climateZones: ['Equatorial Highlands', 'Semi-Arid Savanna', 'Humid Tropical Rift Valley']
    },
    landmarksEcology: {
      transboundaryReserves: ['Serengeti-Mara Ecosystem (Tanzania, Kenya)', 'Virunga-Bwindi Mountain Gorilla Landscape (Rwanda, Uganda, DRC)'],
      unescoBiospheres: ['Mount Kenya National Park', 'Ngorongoro Conservation Area', 'Kilimanjaro National Park', 'Kahuzi-Biega National Park'],
      notableLandmarks: ['Mount Kilimanjaro (Roof of Africa)', 'Olduvai Gorge (Cradle of Humankind)', 'Lamu Old Town', 'Zanzibar Stone Town'],
      ecologicalThreats: ['Lake Victoria Water Hyacinth Infestation', 'Poaching & Habitat Fragmentation', 'Volcanic & Seismic Rift Activity']
    },
    institutionsTreaties: {
      executiveOrgans: ['EAC Secretariat (Arusha)', 'Summit of EAC Heads of State', 'Council of Ministers'],
      parliamentaryOrJudicialBodies: ['East African Legislative Assembly (EALA, Arusha)', 'East African Court of Justice (EACJ, Arusha)'],
      financialInstitutions: ['East African Development Bank (EADB, Kampala)', 'Lake Victoria Basin Commission (LVBC, Kisumu)', 'Civil Aviation Safety and Security Oversight Agency (CASSOA)'],
      landmarkAgreements: ['2005 EAC Customs Union Protocol', '2010 EAC Common Market Protocol', '2013 East African Monetary Union Protocol']
    }
  },

  EAC5: {
    blocId: 'EAC5',
    canonicalTitle: 'East African Community Core Five',
    url: 'https://en.wikipedia.org/wiki/East_African_Community',
    extract: 'The EAC Core Five represents the deeply integrated historic core of the East African Community, comprising Kenya, Tanzania, Uganda, Rwanda, and Burundi. These nations have established seamless one-stop border posts, harmonized telecommunications ("One Network Area"), and unified transport corridors.',
    summaryNarrative: [
      'Forming the geographic and institutional anchor of East Africa, the EAC Core Five encompasses the historic Great Lakes trade routes connecting the ports of Mombasa and Dar es Salaam with the inland capitals of Nairobi, Kampala, Kigali, and Gitega.',
      'This sub-grouping possesses the highest level of regulatory convergence in the region, with operational national identity card travel, harmonized academic curricula standards, and interconnected power pools.'
    ],
    headquartersCity: 'Arusha, Tanzania',
    establishedDate: '1999–2007',
    foundingTreaty: 'EAC Treaty (Expanded 2007)',
    officialWorkingLanguages: ['English', 'Kiswahili', 'French'],
    indicators: {
      customsUnionStatus: 'Full Single Customs Territory with One-Stop Border Posts (OSBP)',
      tradeIntegrationScore: 'Deep integration: Cross-border mobile payments & ID travel',
      intraBlocTradeShare: '~24.5% of total merchandise trade',
      monetaryFramework: 'National central banks aligned under EAMU convergence criteria',
      keyEconomicPillars: ['Agri-business & Food Processing', 'Port Logistics & Standard Gauge Railway', 'Financial Tech & Mobile Money (M-Pesa)']
    },
    demographics: {
      estimatedPopulation: '195+ Million',
      urbanizationRate: '28.5%',
      medianAge: '18.4 Years',
      majorEthnolinguisticPhyla: ['Niger-Congo (Bantu - Gikuyu, Sukuma, Baganda, Kinyarwanda, Kirundi)', 'Nilo-Saharan (Luo, Kalenjin, Maasai)']
    },
    geography: {
      landAreaKm2Formatted: '1,817,760 km²',
      majorWaterways: ['Lake Victoria (shared by 3 core states)', 'Lake Tanganyika', 'Nile River headwaters', 'Ruvubu River'],
      dominantBiomes: ['Montane Moist Forests', 'Acacia-Commiphora Bushlands', 'Papyrus Wetlands'],
      climateZones: ['Bimodal Tropical Rainfall Highlands', 'Equatorial Lake Basin', 'Arid Northern Valleys']
    },
    landmarksEcology: {
      transboundaryReserves: ['Greater Serengeti-Mara Biosphere', 'Volcanoes-Mgahinga Gorilla Corridor'],
      unescoBiospheres: ['Bwindi Impenetrable National Park', 'Mount Elgon Biosphere', 'Selous Game Reserve (Nyerere NP)'],
      notableLandmarks: ['Great Rift Valley Escarpment', 'Source of the Nile (Jinja)', 'Fort Jesus (Mombasa)'],
      ecologicalThreats: ['Soil Erosion in High-Altitude Slopes', 'Wetland Encroachment', 'Deforestation in Water Towers']
    },
    institutionsTreaties: {
      executiveOrgans: ['EAC Secretariat', 'East African Business Council (EABC)'],
      parliamentaryOrJudicialBodies: ['East African Legislative Assembly', 'EACJ'],
      financialInstitutions: ['EADB', 'Inter-University Council for East Africa (IUCEA)'],
      landmarkAgreements: ['Northern Corridor Integration Projects (NCIP)', 'Central Corridor Transit Transport Agreement']
    }
  },

  SADC: {
    blocId: 'SADC',
    canonicalTitle: 'Southern African Development Community',
    url: 'https://en.wikipedia.org/wiki/Southern_African_Development_Community',
    extract: 'The Southern African Development Community (SADC) is an inter-governmental organization of 16 Southern African countries. Established in 1992 in Windhoek to succeed the Frontline States alliance (SADCC), its goal is to advance socio-economic cooperation and integration as well as political and security cooperation.',
    summaryNarrative: [
      'Originating from the Southern African Development Coordination Conference (SADCC) formed in Lusaka in 1980, SADC was formally reconstituted by treaty in Windhoek in August 1992. It comprises resource-rich continental powers and southwest Indian Ocean island states.',
      'SADC manages the Southern African Power Pool (SAPP), one of the world\'s most sophisticated regional electricity trading grids, and maintains a Free Trade Area covering industrial goods, mineral supply chains, and agricultural trade.'
    ],
    headquartersCity: 'Gaborone, Botswana',
    establishedDate: '17 August 1992',
    foundingTreaty: 'Declaration and Treaty of SADC (Windhoek Treaty)',
    officialWorkingLanguages: ['English', 'French', 'Portuguese'],
    indicators: {
      customsUnionStatus: 'SADC Free Trade Area (FTA) in force since 2008',
      tradeIntegrationScore: 'Advanced energy integration (SAPP) & transport corridors',
      intraBlocTradeShare: '~19.4% of total merchandise trade',
      monetaryFramework: 'Common Monetary Area (CMA Rand zone) alongside national currencies',
      keyEconomicPillars: ['Mining (Platinum, Diamonds, Copper, Cobalt, Gold)', 'Heavy Manufacturing & Automotive (South Africa)', 'Agro-forestry & Blue Economy']
    },
    demographics: {
      estimatedPopulation: '385+ Million',
      urbanizationRate: '47.8%',
      medianAge: '21.5 Years',
      majorEthnolinguisticPhyla: ['Niger-Congo (Southern & Central Bantu: Zulu, Xhosa, Shona, Chewa, Ovambo)', 'Khoisan families', 'Austronesian (Malagasy)']
    },
    geography: {
      landAreaKm2Formatted: '9,882,959 km²',
      majorWaterways: ['Zambezi River', 'Limpopo River', 'Orange-Senqu River', 'Okavango River Basin', 'Lake Malawi / Niassa'],
      dominantBiomes: ['Kalahari Xeric Savanna', 'Miombo Woodlands', 'Succulent Karoo', 'Fynbos Floral Kingdom', 'Madagascar Moist Forests'],
      climateZones: ['Mediterranean (Western Cape)', 'Semi-Arid & Desert', 'Subtropical Humid', 'Tropical Savanna']
    },
    landmarksEcology: {
      transboundaryReserves: ['Kavango-Zambezi (KAZA) Transfrontier Conservation Area (world\'s largest TFCA)', 'Great Limpopo Transfrontier Park (South Africa, Mozambique, Zimbabwe)'],
      unescoBiospheres: ['Okavango Delta (1000th World Heritage Site)', 'Victoria Falls (Mosi-oa-Tunya)', 'Cape Floral Region Protected Areas', 'iSimangaliso Wetland Park'],
      notableLandmarks: ['Great Zimbabwe Ruins', 'Table Mountain', 'Cradle of Humankind', 'Namib Sand Sea'],
      ecologicalThreats: ['Drought Cycles & El Niño Impacts', 'Rhino & Elephant Poaching', 'Water Scarcity in Southern Basins']
    },
    institutionsTreaties: {
      executiveOrgans: ['SADC Secretariat (Gaborone)', 'Summit of Heads of State or Government', 'Organ on Politics, Defence and Security Cooperation'],
      parliamentaryOrJudicialBodies: ['SADC Parliamentary Forum (Windhoek)', 'SADC Administrative Tribunal (SADCAT)'],
      financialInstitutions: ['Development Bank of Southern Africa (DBSA)', 'Southern African Power Pool (SAPP Coordination Centre, Harare)'],
      landmarkAgreements: ['SADC Protocol on Trade (1996)', 'SADC Protocol on Shared Watercourses', 'SADC Mutual Defence Pact (2003)']
    }
  },

  SACU: {
    blocId: 'SACU',
    canonicalTitle: 'Southern African Customs Union',
    url: 'https://en.wikipedia.org/wiki/Southern_African_Customs_Union',
    extract: 'The Southern African Customs Union (SACU) is a customs union among five countries of Southern Africa: Botswana, Eswatini, Lesotho, Namibia, and South Africa. Established in 1910, SACU is the oldest existing customs union in the world, featuring a single customs territory and revenue-sharing mechanism.',
    summaryNarrative: [
      'Established by the 1910 Customs Union Agreement between the Union of South Africa and the High Commission Territories, SACU was renegotiated in 1969 and again under the 2002 SACU Agreement to establish democratic governance and autonomous secretarial institutions.',
      'Members maintain a common external tariff, zero tariffs on intra-union trade, and deposit all collected customs and excise revenues into the Common Revenue Pool (CRP), distributed according to a developmentally weighted revenue-sharing formula.'
    ],
    headquartersCity: 'Windhoek, Namibia',
    establishedDate: '1910 (2002 Agreement)',
    foundingTreaty: '2002 Southern African Customs Union Agreement',
    officialWorkingLanguages: ['English'],
    indicators: {
      customsUnionStatus: 'World\'s oldest continuous customs union (100% duty-free intra-trade)',
      tradeIntegrationScore: 'Complete customs harmony and Common Revenue Pool (CRP)',
      intraBlocTradeShare: '~31.2% intra-union trade volume',
      monetaryFramework: 'Common Monetary Area (CMA): Loti, Lilangeni, and Namibia Dollar pegged 1:1 to SA Rand',
      keyEconomicPillars: ['Automotive & Heavy Industry (RSA)', 'Diamond Mining (Botswana, Namibia)', 'Textiles, Sugar & Beef (Eswatini, Lesotho)']
    },
    demographics: {
      estimatedPopulation: '68+ Million',
      urbanizationRate: '66.2%',
      medianAge: '26.8 Years',
      majorEthnolinguisticPhyla: ['Niger-Congo (Nguni, Sotho-Tswana)', 'Khoisan Phyla', 'Indo-European (Afrikaans, English)']
    },
    geography: {
      landAreaKm2Formatted: '2,693,418 km²',
      majorWaterways: ['Orange River Basin', 'Vaal River', 'Limpopo River Border', 'Okavango Delta (Botswana)'],
      dominantBiomes: ['Karoo Desert', 'Kalahari Basin', 'Highveld Grasslands', 'Fynbos Kingdom'],
      climateZones: ['Subtropical Highland', 'Arid Desert', 'Mediterranean Littoral']
    },
    landmarksEcology: {
      transboundaryReserves: ['Kgalagadi Transfrontier Park (Botswana, South Africa)', 'Maloti-Drakensberg Park (Lesotho, South Africa)'],
      unescoBiospheres: ['Tsodilo Hills Rock Art', 'Richtersveld Cultural and Botanical Landscape', 'Vredefort Dome'],
      notableLandmarks: ['Table Mountain & Cape Point', 'Sani Pass', 'Makgadikgadi Salt Pans'],
      ecologicalThreats: ['Severe Water Scarcity', 'Soil Salinization', 'Invasive Alien Plant Spread']
    },
    institutionsTreaties: {
      executiveOrgans: ['SACU Secretariat (Windhoek)', 'Council of Ministers', 'Commission of Senior Officials'],
      parliamentaryOrJudicialBodies: ['SACU Tribunal', 'National Bodies & Tariff Board'],
      financialInstitutions: ['Common Revenue Pool managed by the South African Reserve Bank'],
      landmarkAgreements: ['2002 SACU Agreement', 'SACU-EFTA Free Trade Agreement', 'SACU-Mercosur Preferential Trade Agreement']
    }
  },

  ECCAS: {
    blocId: 'ECCAS',
    canonicalTitle: 'Economic Community of Central African States',
    url: 'https://en.wikipedia.org/wiki/Economic_Community_of_Central_African_States',
    extract: 'The Economic Community of Central African States (ECCAS / CEEAC) is an Economic Community of the African Union for the promotion of regional economic co-operation in Central Africa. It comprises 11 member states spanning the Congo Basin, Atlantic coastline, and Great Lakes periphery.',
    summaryNarrative: [
      'Established in October 1983 in Libreville, Gabon, ECCAS encompasses the world\'s second-largest contiguous tropical rainforest in the Congo Basin. The community underwent deep structural institutional reforms in 2019 to transform its General Secretariat into a Commission.',
      'ECCAS promotes peace and security through its Peace and Security Council for Central Africa (COPAX) and coordinates sustainable forest stewardship, river navigation, and mineral resource value addition.'
    ],
    headquartersCity: 'Libreville, Gabon',
    establishedDate: '18 October 1983',
    foundingTreaty: 'Treaty Establishing the Economic Community of Central African States',
    officialWorkingLanguages: ['French', 'Portuguese', 'Spanish', 'English'],
    indicators: {
      customsUnionStatus: 'Preferential Tariff Regime with transition toward unified Common Tariff',
      tradeIntegrationScore: 'Moderate, with massive riverine and logistical potential',
      intraBlocTradeShare: '~4.8% intra-regional trade volume',
      monetaryFramework: 'Central African CFA Franc (BEAC) + National currencies (Angola Kwanza, DRC Franc, etc.)',
      keyEconomicPillars: ['Petroleum & Liquefied Gas', 'Timber & Forestry Products', 'Critical Minerals (Cobalt, Copper, Coltan, Manganese)']
    },
    demographics: {
      estimatedPopulation: '210+ Million',
      urbanizationRate: '46.1%',
      medianAge: '17.8 Years',
      majorEthnolinguisticPhyla: ['Niger-Congo (Equatorial & Western Bantu)', 'Nilo-Saharan (Central Sudanic)', 'Indigenous Pygmy Forager Communities']
    },
    geography: {
      landAreaKm2Formatted: '6,667,087 km²',
      majorWaterways: ['Congo River (world\'s second largest discharge)', 'Ogooué River', 'Sanaga River', 'Lake Tanganyika', 'Kasaï River'],
      dominantBiomes: ['Congo Basin Tropical Rainforest', 'Northern Congolian Forest-Savanna', 'Albertine Rift Montane'],
      climateZones: ['Equatorial Wet', 'Tropical Monsoon', 'Highland Wet Subtropical']
    },
    landmarksEcology: {
      transboundaryReserves: ['Sangha Trinational (Cameroon, Central African Republic, Congo)', 'Mayumba-Conkouati Transboundary Marine Park (Gabon, Congo)'],
      unescoBiospheres: ['Salonga National Park (world\'s largest tropical rainforest park)', 'Lopé-Okanda Landscape', 'Dja Faunal Reserve', 'Virunga National Park'],
      notableLandmarks: ['Congo River Rapids at Malebo Pool', 'Mount Cameroon (active volcano)', 'Odzala-Kokoua Primates Sanctuary'],
      ecologicalThreats: ['Illegal Logging & Bushmeat Trade', 'Artisanal Mining Encroachment', 'Peatland Disturbance']
    },
    institutionsTreaties: {
      executiveOrgans: ['ECCAS Commission (Libreville)', 'Conference of Heads of State and Government', 'Council of Ministers'],
      parliamentaryOrJudicialBodies: ['Central African Parliament (REPAC)', 'ECCAS Court of Justice'],
      financialInstitutions: ['Development Bank of the Central African States (BDEAC, Brazzaville)'],
      landmarkAgreements: ['1983 Libreville Treaty', '2000 Protocol Relating to the Peace and Security Council of Central Africa (COPAX)']
    }
  },

  CEMAC: {
    blocId: 'CEMAC',
    canonicalTitle: 'Central African Economic and Monetary Community',
    url: 'https://en.wikipedia.org/wiki/Central_African_Economic_and_Monetary_Community',
    extract: 'The Central African Economic and Monetary Community (CEMAC / CEEAC) is an organization of six Central African states: Cameroon, Central African Republic, Chad, Republic of the Congo, Equatorial Guinea, and Gabon. It represents a complete monetary union utilizing the Central African CFA franc.',
    summaryNarrative: [
      'Established in March 1994 by treaty in N\'Djamena to succeed the Customs and Economic Union of Central Africa (UDEAC), CEMAC operates a Common External Tariff, a common central bank (BEAC) in Yaoundé, and an integrated banking supervisor (COBAC).',
      'The bloc is rich in hydrocarbons and timber, with joint policies aimed at domestic oil refining, forest conservation, and the free movement of citizens and goods across member borders.'
    ],
    headquartersCity: 'Bangui, Central African Republic (Secretariat currently in Malabo/Yaoundé)',
    establishedDate: '16 March 1994',
    foundingTreaty: 'N\'Djamena Treaty of the CEMAC',
    officialWorkingLanguages: ['French', 'Spanish', 'Arabic (Chad)'],
    indicators: {
      customsUnionStatus: 'Common External Tariff (CET) with 4-tier harmonized customs code',
      tradeIntegrationScore: 'Deep monetary union with central monetary policy (BEAC)',
      intraBlocTradeShare: '~5.5% of total merchandise exports',
      monetaryFramework: 'Central African CFA Franc (XAF) pegged to the Euro via the French Treasury',
      keyEconomicPillars: ['Crude Petroleum (Gabon, Congo, Chad, Equatorial Guinea)', 'Timber & Wood Products', 'Agricultural Exports (Cocoa, Cotton, Bananas)']
    },
    demographics: {
      estimatedPopulation: '60+ Million',
      urbanizationRate: '54.5%',
      medianAge: '18.1 Years',
      majorEthnolinguisticPhyla: ['Niger-Congo (Bantu, Adamawa-Ubangi)', 'Afroasiatic (Chadic, Arabic)', 'Nilo-Saharan (Sara)']
    },
    geography: {
      landAreaKm2Formatted: '3,020,144 km²',
      majorWaterways: ['Sanaga River', 'Chari-Logone River System', 'Ogooué River', 'Lake Chad (southern reach)'],
      dominantBiomes: ['Atlantic Equatorial Coastal Forests', 'Northwestern Congolian Lowland Forests', 'Sahelian Acacia Grasslands'],
      climateZones: ['Equatorial Humid', 'Tropical Wet-Dry', 'Sahelian Semi-Arid']
    },
    landmarksEcology: {
      transboundaryReserves: ['Sangha Trinational Forest Complex', 'Lake Chad Basin Ecosystem'],
      unescoBiospheres: ['Dja Faunal Reserve', 'Manovo-Gounda St. Floris National Park', 'Lopé National Park'],
      notableLandmarks: ['Mount Cameroon', 'Zakouma National Park', 'Pico Basile (Bioko Island)'],
      ecologicalThreats: ['Shrinking of Lake Chad Basin', 'Industrial Logging', 'Oil Spills in Littoral Mangroves']
    },
    institutionsTreaties: {
      executiveOrgans: ['CEMAC Commission', 'Conference of Heads of State'],
      parliamentaryOrJudicialBodies: ['CEMAC Community Parliament (Malabo)', 'CEMAC Court of Justice (N\'Djamena)'],
      financialInstitutions: ['Bank of Central African States (BEAC, Yaoundé)', 'Central African Banking Commission (COBAC, Libreville)', 'BDEAC'],
      landmarkAgreements: ['1994 N\'Djamena Treaty', 'CEMAC Common External Tariff Code', 'Agreement on Free Circulation of CEMAC Nationals (2017)']
    }
  },

  COMESA: {
    blocId: 'COMESA',
    canonicalTitle: 'Common Market for Eastern and Southern Africa',
    url: 'https://en.wikipedia.org/wiki/Common_Market_for_Eastern_and_Southern_Africa',
    extract: 'The Common Market for Eastern and Southern Africa (COMESA) is a regional economic community in Africa with twenty-one member states stretching from Tunisia to Eswatini. Formed in December 1994 to succeed the Preferential Trade Area (PTA), COMESA operates Africa\'s largest Free Trade Area by membership.',
    summaryNarrative: [
      'COMESA was formed in December 1994 to replace the Preferential Trade Area (PTA) that had existed since 1981. It launched Africa\'s first operational Free Trade Area in 2000, eliminating tariffs on originating goods among participating member states.',
      'COMESA is a foundational pillar of the Tripartite Free Trade Area (TFTA) linking COMESA, EAC, and SADC, and operates world-class specialized institutions including the Trade and Development Bank (TDB) and the COMESA Competition Commission.'
    ],
    headquartersCity: 'Lusaka, Zambia',
    establishedDate: '8 December 1994',
    foundingTreaty: 'Treaty Establishing the Common Market for Eastern and Southern Africa',
    officialWorkingLanguages: ['English', 'French', 'Arabic'],
    indicators: {
      customsUnionStatus: 'Operational Free Trade Area (FTA) with COMESA Rules of Origin & Simplified Trade Regime',
      tradeIntegrationScore: 'Large-scale trade facilitation, Yellow Card Motor Vehicle Insurance Scheme',
      intraBlocTradeShare: '~11.8% of combined merchandise exports',
      monetaryFramework: 'Regional Payment and Settlement System (REPSS) in hard currencies',
      keyEconomicPillars: ['Agriculture, Sugar & Tea', 'Copper & Cobalt Mining (Zambia, DRC)', 'Manufacturing & Garments (Egypt, Mauritius, Madagascar)']
    },
    demographics: {
      estimatedPopulation: '640+ Million',
      urbanizationRate: '38.6%',
      medianAge: '19.4 Years',
      majorEthnolinguisticPhyla: ['Afroasiatic (Semitic, Berber, Cushitic)', 'Niger-Congo (Bantu branches)', 'Austronesian (Malagasy)', 'Nilo-Saharan']
    },
    geography: {
      landAreaKm2Formatted: '11,827,848 km²',
      majorWaterways: ['Nile River System', 'Zambezi River', 'Red Sea Coastline', 'Suez Canal / Mediterranean', 'Lake Victoria & Lake Tanganyika'],
      dominantBiomes: ['Sahara & Nubian Deserts', 'Eastern African Savannahs', 'Miombo Woodlands', 'Red Sea Coral Ecosystems'],
      climateZones: ['Arid Desert', 'Equatorial Tropical', 'Mediterranean', 'Highland Alpine']
    },
    landmarksEcology: {
      transboundaryReserves: ['Nile Basin Ecological Corridor', 'Kavango-Zambezi Landscape'],
      unescoBiospheres: ['Pyramids of Giza & Memphis', 'Simien National Park', 'Victoria Falls', 'Tsingy de Bemaraha'],
      notableLandmarks: ['Suez Canal Maritime Gateway', 'Great Rift Valley', 'Carthage Ruins', 'Rock-Hewn Churches of Lalibela'],
      ecologicalThreats: ['Nile Water Security & Allocation', 'Drought in the Horn of Africa', 'Coral Reef Bleaching in Red Sea']
    },
    institutionsTreaties: {
      executiveOrgans: ['COMESA Secretariat (Lusaka)', 'Authority of Heads of State and Government', 'Council of Ministers'],
      parliamentaryOrJudicialBodies: ['COMESA Court of Justice (Khartoum)'],
      financialInstitutions: ['Trade and Development Bank (TDB, Nairobi/Bujumbura)', 'COMESA Re-Insurance Company (ZEP-RE, Nairobi)', 'African Trade Insurance Agency (ATI, Nairobi)', 'COMESA Clearing House'],
      landmarkAgreements: ['1994 COMESA Treaty', 'COMESA Free Trade Area Protocol (2000)', 'COMESA Yellow Card Scheme']
    }
  },

  AMU: {
    blocId: 'AMU',
    canonicalTitle: 'Arab Maghreb Union',
    url: 'https://en.wikipedia.org/wiki/Arab_Maghreb_Union',
    extract: 'The Arab Maghreb Union (AMU / UMA) is a trade agreement aiming for economic and future political unity among Arab countries of the Maghreb in North Africa. Its members are Algeria, Libya, Mauritania, Morocco, and Tunisia. Established in 1989 in Marrakech, it is one of the eight recognized African Union RECs.',
    summaryNarrative: [
      'The AMU treaty was signed on 17 February 1989 by the heads of state of Algeria, Libya, Mauritania, Morocco, and Tunisia in Marrakech. The union was envisioned to build a common market, establish free movement of people and services, and reinforce cultural and economic solidarity across the Maghreb.',
      'Geopolitically positioned at the crossroads of Africa, the Arab World, and Europe, the Maghreb region possesses vast natural gas, phosphate, and petroleum reserves, alongside modern manufacturing and renewable solar power infrastructure.'
    ],
    headquartersCity: 'Rabat, Morocco',
    establishedDate: '17 February 1989',
    foundingTreaty: 'Treaty Instituting the Arab Maghreb Union (Marrakech Treaty)',
    officialWorkingLanguages: ['Arabic'],
    indicators: {
      customsUnionStatus: 'Framework Trade Agreement with bilateral free-trade protocols',
      tradeIntegrationScore: 'Untapped potential (~3-4% intra-regional trade volume)',
      intraBlocTradeShare: '~3.2% intra-Maghreb trade volume',
      monetaryFramework: 'Independent sovereign currencies with Maghreb Bank for Investment and Foreign Trade (BMICE)',
      keyEconomicPillars: ['Hydrocarbons (Algeria, Libya)', 'Phosphates & Fertilizers (Morocco, Tunisia)', 'Automotive & Aerospace (Morocco, Tunisia)', 'Fisheries & Iron Ore (Mauritania)']
    },
    demographics: {
      estimatedPopulation: '105+ Million',
      urbanizationRate: '68.4%',
      medianAge: '28.9 Years',
      majorEthnolinguisticPhyla: ['Afroasiatic (Maghrebi Arabic/Darija, Tamazight/Berber dialects)']
    },
    geography: {
      landAreaKm2Formatted: '6,045,463 km²',
      majorWaterways: ['Medjerda River', 'Moulouya River', 'Chelif River', 'Mediterranean Sea & Atlantic Ocean Littoral'],
      dominantBiomes: ['Atlas Mountains Conifer & Mixed Forests', 'Sahara Desert Dunes & Regs', 'Mediterranean Scrubland'],
      climateZones: ['Mediterranean Warm-Summer', 'Semi-Arid Steppe', 'Hyper-Arid Desert']
    },
    landmarksEcology: {
      transboundaryReserves: ['Intercontinental Biosphere Reserve of the Mediterranean (Morocco-Spain)', 'Tassili n\'Ajjer - Tadrart Acacus Saharan Corridor'],
      unescoBiospheres: ['Tassili n\'Ajjer UNESCO World Heritage', 'Ichkeul National Park', 'Banc d\'Arguin National Park', 'Medina of Fez & Marrakech'],
      notableLandmarks: ['Atlas Mountain Range (Toubkal Peak)', 'Roman Ruins of Leptis Magna & El Jem', 'Sahara Erg Chebbi'],
      ecologicalThreats: ['Desertification & Dune Encroachment', 'Extreme Ground Water Depletion', 'Wildfire Vulnerability in Mediterranean Forests']
    },
    institutionsTreaties: {
      executiveOrgans: ['AMU General Secretariat (Rabat)', 'Council of the Presidency', 'Council of Foreign Ministers'],
      parliamentaryOrJudicialBodies: ['Consultative Council (Algiers)', 'Maghreb Judicial Body (Nouakchott)'],
      financialInstitutions: ['Maghreb Bank for Investment and Foreign Trade (BMICE, Tunis)', 'Maghreb Academy of Sciences'],
      landmarkAgreements: ['1989 Marrakech Treaty', 'Convention on the Exchange of Agricultural Products', 'Maghreb Free Trade Zone Protocols']
    }
  },

  CEN_SAD: {
    blocId: 'CEN_SAD',
    canonicalTitle: 'Community of Sahel-Saharan States',
    url: 'https://en.wikipedia.org/wiki/Community_of_Sahel-Saharan_States',
    extract: 'The Community of Sahel-Saharan States (CEN-SAD) is an African regional economic community established in 1998 in Tripoli. With 29 member states, it is the largest REC by membership, spanning North Africa, the Sahel, West Africa, Central Africa, and the Horn of Africa.',
    summaryNarrative: [
      'Established on 4 February 1998 following a summit conference of heads of state held in Tripoli, CEN-SAD was formed to establish a comprehensive economic union with free movement of persons and capital, coordination of foreign trade, and joint security against cross-border threats.',
      'CEN-SAD is actively engaged in the Great Green Wall of Africa initiative, combating desertification across the Sahelian belt, and hosts the Sahel-Saharan Bank for Investment and Trade (BSIC).'
    ],
    headquartersCity: 'Tripoli, Libya (Operational offices in N\'Djamena, Chad)',
    establishedDate: '4 February 1998',
    foundingTreaty: 'Treaty Establishing the Community of Sahel-Saharan States',
    officialWorkingLanguages: ['Arabic', 'French', 'English', 'Portuguese'],
    indicators: {
      customsUnionStatus: 'Preferential Trade Area framework with sub-regional customs overlap',
      tradeIntegrationScore: 'Extensive continental geographic coverage',
      intraBlocTradeShare: '~8.2% intra-community trade volume',
      monetaryFramework: 'Multiple monetary zones (CFA zones, North African currencies, East African currencies)',
      keyEconomicPillars: ['Oil & Natural Gas', 'Livestock & Pastoralist Agriculture', 'Cotton, Gum Arabic & Solar Power']
    },
    demographics: {
      estimatedPopulation: '620+ Million',
      urbanizationRate: '43.5%',
      medianAge: '18.5 Years',
      majorEthnolinguisticPhyla: ['Afroasiatic (Arabic, Berber, Hausa, Cushitic)', 'Niger-Congo (Mande, Atlantic, Volta-Niger, Bantu)', 'Nilo-Saharan']
    },
    geography: {
      landAreaKm2Formatted: '14,200,000 km²',
      majorWaterways: ['Nile River', 'Niger River', 'Senegal River', 'Lake Chad Basin'],
      dominantBiomes: ['Sahara Hyper-Arid Desert', 'Sahelian Acacia Savanna', 'Sudanian Savanna', 'Guinean Moist Forest fringes'],
      climateZones: ['Hyper-Arid Desert', 'Semi-Arid Tropical', 'Wet-and-Dry Savanna']
    },
    landmarksEcology: {
      transboundaryReserves: ['Great Green Wall Initiative Corridor (11 Nations, 8,000 km)', 'W-Arly-Pendjari Biosphere'],
      unescoBiospheres: ['Aïr and Ténéré Natural Reserves', 'Ennedi Massif Natural and Cultural Landscape', 'Banc d\'Arguin'],
      notableLandmarks: ['Historic Town of Agadez', 'Lake Chad Oasis', 'Pyramids of Meroë (Sudan)'],
      ecologicalThreats: ['Severe Desertification & Land Degradation', 'Water Table Depletion in Oases', 'Climate-Induced Pastoral Conflict']
    },
    institutionsTreaties: {
      executiveOrgans: ['CEN-SAD General Secretariat', 'Conference of Heads of State and Government', 'Executive Council'],
      parliamentaryOrJudicialBodies: ['CEN-SAD Economic, Social and Cultural Council'],
      financialInstitutions: ['Sahel-Saharan Bank for Investment and Trade (BSIC, Tripoli/Regional Branches)'],
      landmarkAgreements: ['1998 Tripoli Treaty', 'Charter on Peace and Security in the Sahel-Sahara Region', 'Great Green Wall Convention']
    }
  },

  IGAD: {
    blocId: 'IGAD',
    canonicalTitle: 'Intergovernmental Authority on Development',
    url: 'https://en.wikipedia.org/wiki/Intergovernmental_Authority_on_Development',
    extract: 'The Intergovernmental Authority on Development (IGAD) is an eight-country trade bloc in East Africa and the Horn of Africa. Established in 1996 in Djibouti to succeed the drought authority (IGADD), it coordinates regional food security, peace negotiations, infrastructure corridors, and disaster resilience.',
    summaryNarrative: [
      'Originally established in 1986 as the Intergovernmental Authority on Drought and Development (IGADD) to mitigate recurring droughts and ecological disasters in the Horn of Africa, it was revitalized in 1996 with expanded mandates for economic integration and peace mediation.',
      'IGAD has been instrumental in leading peace negotiations for Sudan and South Sudan, coordinating the Red Sea and Gulf of Aden maritime security dialogue, and housing the IGAD Climate Prediction and Applications Centre (ICPAC).'
    ],
    headquartersCity: 'Djibouti City, Djibouti',
    establishedDate: '21 March 1996 (Revitalized)',
    foundingTreaty: 'Agreement Establishing the Intergovernmental Authority on Development',
    officialWorkingLanguages: ['English', 'French'],
    indicators: {
      customsUnionStatus: 'Free Trade Protocol under harmonization with COMESA & EAC',
      tradeIntegrationScore: 'High strategic infrastructure focus (LAPSSET & Djibouti-Addis Corridor)',
      intraBlocTradeShare: '~10.5% intra-bloc commerce',
      monetaryFramework: 'National central banks with cross-border transit payment arrangements',
      keyEconomicPillars: ['Livestock Export & Pastoral Economy', 'Port Logistics & Transshipment (Djibouti, Berbera, Lamu)', 'Coffee, Oilseeds & Geothermal Energy']
    },
    demographics: {
      estimatedPopulation: '290+ Million',
      urbanizationRate: '27.4%',
      medianAge: '18.9 Years',
      majorEthnolinguisticPhyla: ['Afroasiatic (Cushitic: Oromo, Somali, Afar; Semitic: Amharic, Tigrinya, Arabic)', 'Nilo-Saharan (Nilotic: Dinka, Nuer, Luo)', 'Niger-Congo']
    },
    geography: {
      landAreaKm2Formatted: '5,210,000 km²',
      majorWaterways: ['Blue Nile (Abay)', 'White Nile Basin', 'Omo River', 'Jubba and Shabelle Rivers', 'Lake Turkana'],
      dominantBiomes: ['Ethiopian Montane Grasslands', 'Somali Acacia-Commiphora Bushlands', 'Danakil Depression Saline Deserts', 'Red Sea Coastal Littoral'],
      climateZones: ['Afroalpine Montane', 'Semi-Arid to Hyper-Arid (Danakil)', 'Tropical Savanna']
    },
    landmarksEcology: {
      transboundaryReserves: ['Boma-Jonglei Landscape (world\'s largest terrestrial mammal migration in South Sudan)', 'Great Rift Valley Lakes System'],
      unescoBiospheres: ['Simien Mountains National Park', 'Lake Turkana National Parks', 'Rock-Hewn Churches of Lalibela', 'Fasil Ghebbi'],
      notableLandmarks: ['Danakil Depression (hottest inhabited place on Earth)', 'Bab-el-Mandeb Strait', 'Mount Ras Dejen'],
      ecologicalThreats: ['Recurrent Multi-Season Droughts', 'Locust Swarm Outbreaks', 'Overgrazing & Siltation in River Basins']
    },
    institutionsTreaties: {
      executiveOrgans: ['IGAD Secretariat (Djibouti)', 'Assembly of Heads of State and Government', 'Council of Ministers'],
      parliamentaryOrJudicialBodies: ['IGAD Inter-Parliamentary Union (IPU-IGAD)'],
      financialInstitutions: ['IGAD Climate Prediction and Applications Centre (ICPAC, Nairobi)', 'Conflict Early Warning and Response Mechanism (CEWARN, Addis Ababa)'],
      landmarkAgreements: ['1996 Revitalized IGAD Agreement', 'Comprehensive Peace Agreement (CPA) Facilitation', 'IGAD Free Movement of Persons Protocol (2020)']
    }
  },

  CwA: {
    blocId: 'CwA',
    canonicalTitle: 'G20 Compact with Africa',
    url: 'https://en.wikipedia.org/wiki/Compact_with_Africa',
    extract: 'The G20 Compact with Africa (CwA) was initiated under the German G20 Presidency in 2017 to promote private investment in Africa. Comprising 13 reform-minded African partner countries, it coordinates targeted macroeconomic reforms, business-enabling regulations, and international financing.',
    summaryNarrative: [
      'Launched in 2017 in Berlin, the Compact with Africa brings together reform-committed African nations, international organizations (World Bank, IMF, African Development Bank), and bilateral G20 partners to accelerate private capital mobilization and infrastructure development.',
      'Member countries implement tailored reform matrices to improve fiscal frameworks, establish transparent public-private partnerships (PPPs), and derisk industrial supply chains for global manufacturing and green transition investments.'
    ],
    headquartersCity: 'Coordinated via G20 Africa Advisory Group & AfDB/WB/IMF',
    establishedDate: 'March 2017',
    foundingTreaty: 'G20 Compact with Africa Declaration (Berlin)',
    officialWorkingLanguages: ['English', 'French', 'Portuguese', 'Arabic'],
    indicators: {
      customsUnionStatus: 'Global investment partnership & reform benchmark tier',
      tradeIntegrationScore: 'High international FDI inflows & sovereign credit ratings',
      intraBlocTradeShare: '~14.2% across participating African economies',
      monetaryFramework: 'Sound fiscal management framework aligned with IMF Article IV consultations',
      keyEconomicPillars: ['Green Hydrogen & Renewable Energy', 'Industrial Parks & Special Economic Zones (SEZs)', 'Automotive, Agribusiness & ICT']
    },
    demographics: {
      estimatedPopulation: '410+ Million',
      urbanizationRate: '51.8%',
      medianAge: '20.6 Years',
      majorEthnolinguisticPhyla: ['Pan-African diverse linguistic families (Afroasiatic, Niger-Congo)']
    },
    geography: {
      landAreaKm2Formatted: '6,480,000 km²',
      majorWaterways: ['Nile, Niger, Congo, Volta, and Senegal river basins'],
      dominantBiomes: ['Mediterranean scrub, Guinean rainforests, Sahelian and Southern savannas'],
      climateZones: ['Diverse pan-continental climatic zones']
    },
    landmarksEcology: {
      transboundaryReserves: ['Major renewable energy corridors (Noor Solar Complex, Benban Solar Park, Lake Turkana Wind)'],
      unescoBiospheres: ['Rich UNESCO cultural and natural assets across 13 member states'],
      notableLandmarks: ['Suez Canal Logistics Zone', 'Tanger Med Port (Africa\'s busiest container port)', 'Kigali Innovation City'],
      ecologicalThreats: ['Climate Transition Vulnerability', 'Global Capital Market Shocks', 'Green Infrastructure Financing Gaps']
    },
    institutionsTreaties: {
      executiveOrgans: ['G20 Africa Advisory Group (AAG)', 'African Development Bank Compact Desk', 'World Bank Group CwA Secretariat'],
      parliamentaryOrJudicialBodies: ['Country-Specific Public-Private Dialogue Platforms'],
      financialInstitutions: ['AfDB', 'International Finance Corporation (IFC)', 'Multilateral Investment Guarantee Agency (MIGA)', 'KfW & Proparco'],
      landmarkAgreements: ['2017 G20 Berlin Communiqué', 'Country-Specific Investment Compact Policy Matrices']
    }
  },

  NOA: {
    blocId: 'NOA',
    canonicalTitle: 'North Africa',
    url: 'https://en.wikipedia.org/wiki/North_Africa',
    extract: 'North Africa is the northernmost region of the African continent, spanning Algeria, Egypt, Libya, Morocco, Sudan, and Tunisia. Bounded by the Mediterranean Sea to the north, the Red Sea to the east, and the Sahara desert, it has a rich shared history spanning millennia of ancient civilization and trade.',
    summaryNarrative: [
      'North Africa represents an ancient crossroads linking Africa, the Middle East, and Southern Europe. Home to the Nile River basin and the Atlas Mountains, it is characterized by substantial industrialization, extensive hydrocarbon reserves, and prominent tourism and maritime sectors.',
      'The sub-region hosts some of the continent\'s largest economies and most sophisticated manufacturing ecosystems, from automotive hubs in Morocco to heavy industrial complexes along the Nile Valley.'
    ],
    headquartersCity: 'Regional Geographic Tier (AU Northern Region)',
    establishedDate: '1963 (OAU / AU Demarcation)',
    foundingTreaty: 'African Union Regional Harmonization Tier',
    officialWorkingLanguages: ['Arabic', 'Tamazight', 'English', 'French'],
    indicators: {
      customsUnionStatus: 'Covered under AfCFTA, GAFTA, and Euro-Mediterranean partnerships',
      tradeIntegrationScore: 'High integration with Mediterranean and Gulf economies',
      intraBlocTradeShare: '~4.5% intra-North African commerce',
      monetaryFramework: 'Sovereign national central banks with substantial foreign exchange reserves',
      keyEconomicPillars: ['Oil & Natural Gas (Algeria, Libya, Egypt)', 'Phosphates & Renewable Energy (Morocco, Egypt)', 'Textiles, Automotive & Tourism (Morocco, Egypt, Tunisia)']
    },
    demographics: {
      estimatedPopulation: '210+ Million',
      urbanizationRate: '58.2%',
      medianAge: '26.5 Years',
      majorEthnolinguisticPhyla: ['Afroasiatic (Arabic dialects, Tamazight/Berber, Nubian languages)']
    },
    geography: {
      landAreaKm2Formatted: '7,772,000 km²',
      majorWaterways: ['Nile River (world\'s longest river)', 'Suez Canal', 'Medjerda River', 'Lake Nasser / Nubia'],
      dominantBiomes: ['Sahara Hyper-Arid Desert', 'Mediterranean Forests & Maquis', 'Nile Delta Wetlands'],
      climateZones: ['Mediterranean Dry-Summer', 'Subtropical Desert', 'Semi-Arid Steppe']
    },
    landmarksEcology: {
      transboundaryReserves: ['Nile Basin Eco-Corridor', 'Great Sand Sea Transboundary Zone'],
      unescoBiospheres: ['Pyramids of Giza & Karnak', 'Wadi Al-Hitan (Whale Valley)', 'Ancient Carthage & Medina of Tunis', 'Volubilis & Fez'],
      notableLandmarks: ['Aswan High Dam', 'Suez Canal', 'Valley of the Kings', 'Strait of Gibraltar Overlook'],
      ecologicalThreats: ['Severe Fresh Water Scarcity & Nile Allocation', 'Sea-Level Rise in Nile Delta', 'Urban Heat Islanding']
    },
    institutionsTreaties: {
      executiveOrgans: ['AU Northern Region Coordinating Committee', 'Arab League Liaison Offices'],
      parliamentaryOrJudicialBodies: ['Pan-African Parliament Northern Caucus'],
      financialInstitutions: ['African Development Bank Regional Hub (Tunis)', 'Arab Fund for Economic and Social Development'],
      landmarkAgreements: ['AfCFTA Agreement', 'Agadir Agreement', 'Greater Arab Free Trade Area (GAFTA)']
    }
  },

  SSA: {
    blocId: 'SSA',
    canonicalTitle: 'Sub-Saharan Africa',
    url: 'https://en.wikipedia.org/wiki/Sub-Saharan_Africa',
    extract: 'Sub-Saharan Africa is the area of the continent of Africa that lies south of the Sahara. It consists of 48 sovereign African countries, encompassing the world\'s youngest demographic population, the second-largest rainforest on Earth, and vast mineral and agricultural endowments.',
    summaryNarrative: [
      'Encompassing 48 sovereign nations across West, Central, East, and Southern Africa, Sub-Saharan Africa is home to over 1.2 billion people with an average median age under 19. It contains unparalleled biological, linguistic, and cultural diversity.',
      'The region is the primary engine of the African Continental Free Trade Area (AfCFTA) and is experiencing rapid digital leapfrogging in fintech, renewable energy minigrids, and urbanization.'
    ],
    headquartersCity: 'Continental Sub-Saharan Tier',
    establishedDate: '1963 / AU Regional System',
    foundingTreaty: 'OAU / AU Continental Framework',
    officialWorkingLanguages: ['English', 'French', 'Portuguese', 'Kiswahili', 'Arabic', 'Spanish'],
    indicators: {
      customsUnionStatus: 'Covered by 7 Regional Economic Communities and the overarching AfCFTA',
      tradeIntegrationScore: 'Rapidly accelerating via AfCFTA Guided Trade Initiative',
      intraBlocTradeShare: '~16.8% of combined merchandise exports',
      monetaryFramework: 'Two CFA Franc currency unions, SACU Common Monetary Area, and sovereign floating currencies',
      keyEconomicPillars: ['Critical Minerals (Lithium, Cobalt, Platinum, Copper)', 'Agri-food & Tropical Cash Crops (Cocoa, Coffee, Tea)', 'FinTech, Telecoms & Creative Industries']
    },
    demographics: {
      estimatedPopulation: '1.25+ Billion',
      urbanizationRate: '43.2%',
      medianAge: '18.8 Years',
      majorEthnolinguisticPhyla: ['Niger-Congo (Bantu, Kwa, Mande, Atlantic)', 'Nilo-Saharan', 'Afroasiatic', 'Khoisan', 'Austronesian']
    },
    geography: {
      landAreaKm2Formatted: '22,400,000 km²',
      majorWaterways: ['Congo River', 'Niger River', 'Zambezi River', 'Lake Victoria', 'Lake Tanganyika', 'Orange River'],
      dominantBiomes: ['Congo Rainforest', 'Sahelian & Sudanian Savannas', 'Miombo Woodlands', 'Kalahari Basin', 'Great Rift Highlands'],
      climateZones: ['Equatorial Rainforest', 'Tropical Wet-Dry', 'Semi-Arid', 'Oceanic & Mediterranean']
    },
    landmarksEcology: {
      transboundaryReserves: ['Kavango-Zambezi (KAZA) TFCA', 'Greater Virunga Landscape', 'Sangha Trinational'],
      unescoBiospheres: ['Serengeti National Park', 'Okavango Delta', 'Mount Kilimanjaro', 'Dja Faunal Reserve'],
      notableLandmarks: ['Victoria Falls', 'Ngorongoro Crater', 'Great Zimbabwe', 'Djenné Great Mosque'],
      ecologicalThreats: ['Deforestation & Wildfire Risk', 'Drought in Horn and Southern Africa', 'Coastal Erosion in West Africa']
    },
    institutionsTreaties: {
      executiveOrgans: ['African Union Commission (Addis Ababa)', 'AfCFTA Secretariat (Accra)', 'UNECA (Addis Ababa)'],
      parliamentaryOrJudicialBodies: ['Pan-African Parliament (Midrand)', 'African Court on Human and Peoples\' Rights (Arusha)'],
      financialInstitutions: ['African Development Bank Group (Abidjan)', 'Afreximbank (Cairo)', 'Africa Finance Corporation (AFC, Lagos)'],
      landmarkAgreements: ['Abuja Treaty Establishing the African Economic Community', 'AfCFTA Agreement', 'AU Agenda 2063']
    }
  },

  MIC: {
    blocId: 'MIC',
    canonicalTitle: 'Middle-Income African Economies',
    url: 'https://en.wikipedia.org/wiki/Developing_country#Middle-income_country',
    extract: 'Middle-Income African Economies comprise 21 sovereign nations classified into lower-middle and upper-middle income brackets by the World Bank. These countries account for the vast majority of Africa\'s total GDP, manufacturing output, and formal financial system assets.',
    summaryNarrative: [
      'This grouping includes industrial and demographic powerhouses such as South Africa, Egypt, Nigeria, Algeria, Morocco, Kenya, Côte d\'Ivoire, Ghana, and Botswana. These economies possess diversified service sectors, domestic industrial bases, and deepening consumer markets.',
      'Middle-income African nations serve as the primary source of intra-African foreign direct investment (FDI), cross-border banking expansion, and technological innovation across the continent.'
    ],
    headquartersCity: 'World Bank & AfDB Harmonized Classification Tier',
    establishedDate: 'Continuous Economic Harmonization',
    foundingTreaty: 'World Bank / AfDB Income Metric Framework',
    officialWorkingLanguages: ['English', 'French', 'Arabic', 'Portuguese'],
    indicators: {
      customsUnionStatus: 'Anchors of Africa\'s primary RECs (ECOWAS, SADC, COMESA, AMU, EAC)',
      tradeIntegrationScore: 'Very High (~80% of total continental manufacturing value-add)',
      intraBlocTradeShare: '~68.5% of total intra-African trade origins',
      monetaryFramework: 'Deep sovereign capital markets and sovereign wealth funds (e.g. Nigeria, Morocco, Angola)',
      keyEconomicPillars: ['Automotive, Aerospace & Heavy Manufacturing', 'Financial Services & Mobile Tech Ecosystems', 'Energy, Petrochemicals & High-Value Mining']
    },
    demographics: {
      estimatedPopulation: '780+ Million',
      urbanizationRate: '56.4%',
      medianAge: '22.8 Years',
      majorEthnolinguisticPhyla: ['Pan-African polyglot distribution']
    },
    geography: {
      landAreaKm2Formatted: '14,800,000 km²',
      majorWaterways: ['Nile, Niger, Congo, Orange, and Limpopo river networks'],
      dominantBiomes: ['Coastal littoral zones, tropical savannahs, Mediterranean belts, and rich arable plains'],
      climateZones: ['Diverse from Mediterranean North to Subtropical South']
    },
    landmarksEcology: {
      transboundaryReserves: ['Primary industrial logistics corridors and major UNESCO heritage destinations'],
      unescoBiospheres: ['Table Mountain', 'Pyramids of Giza', 'Medina of Fez', 'Kruger National Park'],
      notableLandmarks: ['Noor Ouarzazate Solar Complex', 'Dangote Refinery Complex', 'New Administrative Capital (Egypt)', 'Sandton Financial Hub'],
      ecologicalThreats: ['Industrial Carbon Footprints', 'Urban Air Quality', 'Water Scarcity in High-Density Basins']
    },
    institutionsTreaties: {
      executiveOrgans: ['AfDB MIC Technical Assistance Fund', 'African Sovereign Wealth Funds Forum'],
      parliamentaryOrJudicialBodies: ['National stock exchanges (JSE, EGX, Casablanca, NGX, BRVM)'],
      financialInstitutions: ['AfDB', 'Afreximbank', 'Africa Finance Corporation (AFC)', 'Development Bank of Southern Africa (DBSA)'],
      landmarkAgreements: ['AfCFTA National Implementation Strategies', 'OECD/G20 BEPS Inclusive Framework']
    }
  },

  LIC: {
    blocId: 'LIC',
    canonicalTitle: 'Low-Income African Economies',
    url: 'https://en.wikipedia.org/wiki/Least_developed_countries',
    extract: 'Low-Income African Economies comprise 23 sovereign states characterized by Gross National Income (GNI) per capita below the World Bank low-income threshold. These nations possess tremendous untapped agricultural, mineral, and demographic vitality.',
    summaryNarrative: [
      'Spanning countries such as the Democratic Republic of the Congo, Ethiopia, Mozambique, Madagascar, Uganda, and Mali, this grouping holds some of the world\'s largest arable land reserves, massive hydroelectric potential, and critical mineral deposits.',
      'Development programs in these economies focus heavily on basic infrastructure connectivity, rural electrification, value addition to raw agricultural commodities, and human capital development in health and primary education.'
    ],
    headquartersCity: 'UN-OHRLLS & World Bank Classification Group',
    establishedDate: 'Continuous Development Metric',
    foundingTreaty: 'UN Least Developed Countries (LDC) Programme of Action',
    officialWorkingLanguages: ['English', 'French', 'Portuguese', 'Arabic'],
    indicators: {
      customsUnionStatus: 'Beneficiaries of AfCFTA Special and Differential Treatment (SDT)',
      tradeIntegrationScore: 'Rapidly growing regional trade and commodity corridors',
      intraBlocTradeShare: '~14.5% of exports directed to regional REC neighbors',
      monetaryFramework: 'Concessional international financing (IDA, ADF) alongside domestic central banks',
      keyEconomicPillars: ['Smallholder & Commercial Agriculture (Coffee, Sesame, Cashew, Vanilla)', 'Hydroelectric Power (Grand Renaissance Dam, Inga Dams)', 'Extractive Industries (Cobalt, Gold, Graphite, Bauxite)']
    },
    demographics: {
      estimatedPopulation: '590+ Million',
      urbanizationRate: '32.1%',
      medianAge: '17.4 Years',
      majorEthnolinguisticPhyla: ['Extensive indigenous African ethnolinguistic diversity']
    },
    geography: {
      landAreaKm2Formatted: '12,500,000 km²',
      majorWaterways: ['Congo River Basin', 'Blue Nile & Omo Basins', 'Zambezi River', 'Lake Tanganyika', 'Lake Malawi'],
      dominantBiomes: ['Equatorial Tropical Rainforests', 'Sudanian & Zambezian Savannas', 'Madagascar Spiny Thickets'],
      climateZones: ['Tropical Wet, Monsoonal, and Semi-Arid Sahelian']
    },
    landmarksEcology: {
      transboundaryReserves: ['Virunga-Bwindi Landscape', 'Sangha Trinational', 'Great Limpopo TFCA'],
      unescoBiospheres: ['Simien Mountains', 'Salonga National Park', 'Tsingy de Bemaraha', 'Manovo-Gounda'],
      notableLandmarks: ['Grand Ethiopian Renaissance Dam (GERD)', 'Inga Hydro Falls', 'Bale Mountains'],
      ecologicalThreats: ['Deforestation for Fuelwood', 'Vulnerability to Climate Weather Extremes', 'Agricultural Land Degradation']
    },
    institutionsTreaties: {
      executiveOrgans: ['UN-OHRLLS African Caucus', 'G77+ LDC Ministerial Forum'],
      parliamentaryOrJudicialBodies: ['AfCFTA Sub-Committee on Least Developed Countries'],
      financialInstitutions: ['African Development Fund (ADF)', 'World Bank International Development Association (IDA)', 'International Fund for Agricultural Development (IFAD)'],
      landmarkAgreements: ['Doha Programme of Action for LDCs (2022–2031)', 'Paris Agreement Article 9 Concessional Support']
    }
  },

  CFS: {
    blocId: 'CFS',
    canonicalTitle: 'Fragile and Conflict-Affected Situations',
    url: 'https://en.wikipedia.org/wiki/Fragile_state',
    extract: 'Countries in Fragile Situations (CFS) comprise 19 African sovereign states confronting institutional and social fragility, political transitions, or environmental stress. The African Development Bank maintains specialized transition support facilities for these economies.',
    summaryNarrative: [
      'Identified through harmonized AfDB and World Bank Country Policy and Institutional Assessments (CPIA), these countries include Somalia, South Sudan, Sudan, Chad, Central African Republic, Mali, Burkina Faso, and Niger.',
      'International and regional interventions center on peacebuilding, rebuilding public financial management institutions, restoring energy and water access, and providing social safety nets to vulnerable youth and rural communities.'
    ],
    headquartersCity: 'AfDB Transition Support Facility (TSF, Abidjan)',
    establishedDate: '2008 (AfDB Transition Support Mechanism)',
    foundingTreaty: 'AfDB Strategy for Addressing Fragility and Building Resilience',
    officialWorkingLanguages: ['French', 'English', 'Arabic', 'Portuguese'],
    indicators: {
      customsUnionStatus: 'Beneficiaries of regional humanitarian trade corridors and AfCFTA flexibility',
      tradeIntegrationScore: 'Cross-border informal trade and regional security partnerships',
      intraBlocTradeShare: '~9.5% intra-regional trade volume',
      monetaryFramework: 'Transition financing and humanitarian currency stabilization facilities',
      keyEconomicPillars: ['Livestock & Pastoralist Husbandry', 'Artisanal & Industrial Gold/Mineral Extraction', 'Humanitarian Services & Critical Infrastructure Rebuilding']
    },
    demographics: {
      estimatedPopulation: '260+ Million',
      urbanizationRate: '34.2%',
      medianAge: '16.9 Years',
      majorEthnolinguisticPhyla: ['Afroasiatic, Niger-Congo, and Nilo-Saharan lineages']
    },
    geography: {
      landAreaKm2Formatted: '9,850,000 km²',
      majorWaterways: ['Nile River, Lake Chad, Niger River bend, and Ubangi River'],
      dominantBiomes: ['Sahelian semi-desert, Sudanian savannas, and Central African forest fringes'],
      climateZones: ['Semi-Arid, Arid, and Wet-and-Dry Tropical']
    },
    landmarksEcology: {
      transboundaryReserves: ['Great Green Wall Resilience Belts', 'Lake Chad Basin Commission Zone'],
      unescoBiospheres: ['Ennedi Massif', 'Aïr and Ténéré Natural Reserves', 'Tomb of Askia'],
      notableLandmarks: ['Cliff of Bandiagara (Dogon Country)', 'Jebel Barkal (Sudan)', 'Mogadishu Old Lighthouse'],
      ecologicalThreats: ['Severe Water Scarcity', 'Rapid Desertification', 'Loss of Grazing Land for Pastoralists']
    },
    institutionsTreaties: {
      executiveOrgans: ['AfDB Transition Support Facility (TSF)', 'AU Peace and Security Council (AU-PSC)'],
      parliamentaryOrJudicialBodies: ['G7+ Association of Fragile and Conflict-Affected States'],
      financialInstitutions: ['Transition Support Facility Pillar I & II Grants', 'UN Peacebuilding Fund (PBF)'],
      landmarkAgreements: ['New Deal for Engagement in Fragile States', 'AU Post-Conflict Reconstruction and Development (PCRD) Policy']
    }
  },

  OEC: {
    blocId: 'OEC',
    canonicalTitle: 'African Petroleum Producers Organization',
    url: 'https://en.wikipedia.org/wiki/African_Petroleum_Producers%27_Organization',
    extract: 'Oil-Exporting African Economies (OEC) comprise 8 major continental hydrocarbon producers: Nigeria, Angola, Algeria, Libya, Republic of the Congo, Gabon, Equatorial Guinea, and Chad. These nations supply petroleum, LNG, and refined fuels to global and regional markets.',
    summaryNarrative: [
      'Organized continentally through the African Petroleum Producers\' Organization (APPO) and globally in OPEC/OPEC+, these economies generate the bulk of Africa\'s energy export revenues and are now actively investing in domestic refining and natural gas monetization.',
      'Key flagship initiatives include the African Energy Bank (established in Abuja in 2024), trans-Saharan natural gas pipelines, and the development of gas-to-power infrastructure to drive industrialization.'
    ],
    headquartersCity: 'African Petroleum Producers\' Organization (APPO, Brazzaville)',
    establishedDate: '1987 (APPO Founding, Lagos)',
    foundingTreaty: 'Statute of the African Petroleum Producers\' Organization',
    officialWorkingLanguages: ['English', 'French', 'Arabic', 'Portuguese', 'Spanish'],
    indicators: {
      customsUnionStatus: 'Global oil export quotas (OPEC+) and AfCFTA Energy Market integration',
      tradeIntegrationScore: 'Suppliers of over 75% of Africa\'s commercial energy and liquid fuels',
      intraBlocTradeShare: '~8.9% intra-African refined energy trade',
      monetaryFramework: 'Sovereign oil stabilization funds and substantial foreign reserves',
      keyEconomicPillars: ['Crude Oil & Petroleum Refining', 'Liquefied Natural Gas (LNG) & Gas-to-Power', 'Petrochemicals & Fertilizer Production']
    },
    demographics: {
      estimatedPopulation: '375+ Million',
      urbanizationRate: '55.8%',
      medianAge: '19.8 Years',
      majorEthnolinguisticPhyla: ['Yoruba, Hausa, Igbo, Ijaw, Umbundu, Kimbundu, Algerian Arabic, Berber, Fang, Sara']
    },
    geography: {
      landAreaKm2Formatted: '7,920,000 km²',
      majorWaterways: ['Niger Delta Littoral', 'Congo River Estuary', 'Mediterranean Coastline of North Africa'],
      dominantBiomes: ['Niger Delta Mangroves', 'Atlantic Equatorial Forests', 'Sahara Desert Basins'],
      climateZones: ['Equatorial Monsoon, Tropical Savanna, and Arid Desert']
    },
    landmarksEcology: {
      transboundaryReserves: ['Gulf of Guinea Marine Protected Areas', 'Niger Delta Biosphere Reserves'],
      unescoBiospheres: ['Lopé National Park', 'Tassili n\'Ajjer', 'Sukur Cultural Landscape'],
      notableLandmarks: ['Dangote Petroleum Refinery (world\'s largest single-train refinery)', 'Bonny Island LNG Terminal', 'Hassi Messaoud Oil Field'],
      ecologicalThreats: ['Oil Spills & Gas Flaring in Mangroves', 'Coastal Water Pollution', 'Energy Transition Demand Shocks']
    },
    institutionsTreaties: {
      executiveOrgans: ['APPO Council of Ministers', 'APPO Secretariat (Brazzaville)'],
      parliamentaryOrJudicialBodies: ['African Energy Commission (AFREC, Algiers)'],
      financialInstitutions: ['Africa Energy Bank (AEB, Abuja / joint initiative with Afreximbank)', 'Petroleum Technology Development Fund (PTDF)'],
      landmarkAgreements: ['1987 Lagos Agreement on APPO', 'African Energy Transition Programme (AFREC)', 'Gas Exporting Countries Forum (GECF) Charters']
    }
  },

  ORIC: {
    blocId: 'ORIC',
    canonicalTitle: 'Mining in Africa',
    url: 'https://en.wikipedia.org/wiki/Mining_in_Africa',
    extract: 'Other Resource-Intensive African Economies (ORIC) comprise 15 non-oil mineral exporting countries whose revenues depend heavily on metals, diamonds, gold, critical energy transition minerals, and agricultural bulk commodities.',
    summaryNarrative: [
      'This grouping includes mineral superpowers such as South Africa (platinum, gold, manganese), DRC and Zambia (copper, cobalt), Botswana and Namibia (diamonds, uranium), Guinea (bauxite, iron ore), Ghana, Mali, and Burkina Faso (gold), and Zimbabwe (lithium, platinum).',
      'These nations are spearheading Africa\'s critical minerals value-addition drive, requiring domestic processing and battery precursor manufacturing under the AfCFTA and the Africa Mining Vision (AMV).'
    ],
    headquartersCity: 'African Minerals Development Centre (AMDC, Conakry)',
    establishedDate: '2009 (Africa Mining Vision)',
    foundingTreaty: 'AU Africa Mining Vision (AMV)',
    officialWorkingLanguages: ['English', 'French', 'Portuguese'],
    indicators: {
      customsUnionStatus: 'Aligned with AfCFTA Critical Minerals Strategy and REC trade corridors',
      tradeIntegrationScore: 'Crucial suppliers to global industrial and electric vehicle supply chains',
      intraBlocTradeShare: '~18.5% intra-continental mineral feedstock trade',
      monetaryFramework: 'Sovereign mining fiscal codes, royalty structures, and mineral development funds',
      keyEconomicPillars: ['Battery & Transition Minerals (Cobalt, Lithium, Nickel, Graphite)', 'Precious Metals (Gold, Platinum Group Metals)', 'Industrial Bulks (Copper, Bauxite, Iron Ore, Phosphates, Diamonds)']
    },
    demographics: {
      estimatedPopulation: '380+ Million',
      urbanizationRate: '45.7%',
      medianAge: '20.1 Years',
      majorEthnolinguisticPhyla: ['Broad pan-African distribution across Southern, Central, and West Africa']
    },
    geography: {
      landAreaKm2Formatted: '10,400,000 km²',
      majorWaterways: ['Zambezi, Orange, Congo, and Niger river basins'],
      dominantBiomes: ['Central African Copperbelt, Highveld Grasslands, Guinean Savannas, Kalahari Plains'],
      climateZones: ['Subtropical Highland, Tropical Wet-Dry, Semi-Arid']
    },
    landmarksEcology: {
      transboundaryReserves: ['Central African Copperbelt Transboundary Logistics Corridor (Lobito Corridor)', 'Kavango-Zambezi Landscape'],
      unescoBiospheres: ['Mount Nimba Strict Nature Reserve', 'Great Zimbabwe', 'Vredefort Dome', 'Okavango Delta'],
      notableLandmarks: ['Witwatersrand Gold Basin', 'Kolwezi Cobalt Mines (DRC)', 'Simandou Iron Ore Range (Guinea)', 'Jwaneng Diamond Mine'],
      ecologicalThreats: ['Mine Tailings & Acid Mine Drainage', 'Artisanal Mining Deforestation', 'Water Usage in Mineral Extraction']
    },
    institutionsTreaties: {
      executiveOrgans: ['African Minerals Development Centre (AMDC)', 'AU Department of Economic Development and Trade'],
      parliamentaryOrJudicialBodies: ['African Mining Indaba Coordinating Assemblies'],
      financialInstitutions: ['Africa Finance Corporation (AFC)', 'Development Bank of Southern Africa (DBSA)', 'Afreximbank Project Finance Desk'],
      landmarkAgreements: ['Africa Mining Vision (2009)', 'DRC-Zambia Transboundary Battery Precursor Initiative (2022)', 'Lobito Atlantic Railway Corridor Agreement']
    }
  },

  NRIC: {
    blocId: 'NRIC',
    canonicalTitle: 'Economic history of Africa',
    url: 'https://en.wikipedia.org/wiki/Economy_of_Africa',
    extract: 'Non-Resource Intensive African Economies (NRIC) comprise 22 sovereign nations whose economic growth is driven primarily by agriculture, services, tourism, logistics, light manufacturing, and technological innovation rather than extractive minerals or hydrocarbons.',
    summaryNarrative: [
      'Featuring some of Africa\'s fastest-growing and most resilient economies—including Rwanda, Kenya, Senegal, Mauritius, Seychelles, Morocco, Tunisia, Togo, and Benin—this grouping has consistently outperformed commodity-dependent nations in GDP growth consistency and ease of doing business.',
      'These economies excel in services export, digital payments, transshipment logistics (e.g. Lomé Port, Port of Djibouti, Tanger Med), high-value horticulture, financial technology, and sustainable tourism.'
    ],
    headquartersCity: 'AfDB Economic Diversification & Trade Policy Tier',
    establishedDate: 'Continuous Structural Transformation Benchmark',
    foundingTreaty: 'AfDB / World Bank Economic Diversification Matrix',
    officialWorkingLanguages: ['English', 'French', 'Arabic', 'Portuguese'],
    indicators: {
      customsUnionStatus: 'Pioneers of AfCFTA Guided Trade Initiative and regional digital trade protocols',
      tradeIntegrationScore: 'Highest trade diversification and logistics performance indexes in Africa',
      intraBlocTradeShare: '~22.8% intra-African commerce intensity',
      monetaryFramework: 'Diversified revenue bases with low commodity price cycle vulnerability',
      keyEconomicPillars: ['Financial Services, FinTech & Business Process Outsourcing (BPO)', 'Agricultural Processing & Cut Flowers/Tea/Coffee', 'Logistics Hubs, Maritime Transshipment & Eco-Tourism']
    },
    demographics: {
      estimatedPopulation: '320+ Million',
      urbanizationRate: '48.9%',
      medianAge: '22.2 Years',
      majorEthnolinguisticPhyla: ['High polyglot literacy and diverse African language communities']
    },
    geography: {
      landAreaKm2Formatted: '4,650,000 km²',
      majorWaterways: ['Rift Valley Lakes, Senegal River, Volta River, Atlantic & Indian Ocean Island archipelagos'],
      dominantBiomes: ['Highland agro-ecological zones, coastal mangroves, coral reefs, and fertile valleys'],
      climateZones: ['Tropical Highland, Maritime Oceanic, Mediterranean, and Wet Savanna']
    },
    landmarksEcology: {
      transboundaryReserves: ['Western Indian Ocean Marine Protected Areas', 'East African Montane Conservation Zones'],
      unescoBiospheres: ['Aldabra Atoll', 'Vallée de Mai Nature Reserve', 'Volcanoes National Park', 'Medina of Marrakech'],
      notableLandmarks: ['Port of Lomé (deepest natural container port in West Africa)', 'Kigali Special Economic Zone', 'Ebene Cybercity (Mauritius)', 'Tanger Med Port'],
      ecologicalThreats: ['Coastal Tourism Impacts', 'Soil Nutrient Depletion from Intensive Cropping', 'Climate Rainfall Variability']
    },
    institutionsTreaties: {
      executiveOrgans: ['AfDB Industrialization and Trade Department', 'African Tourism Board'],
      parliamentaryOrJudicialBodies: ['International arbitration centers (Kigali, Mauritius, Cairo, Casablanca)'],
      financialInstitutions: ['Trade and Development Bank (TDB)', 'BOAD', 'BCEAO', 'Regional Stock Exchange (BRVM)'],
      landmarkAgreements: ['AfCFTA Protocol on Digital Trade', 'Single African Air Transport Market (SAATM)', 'Smart Africa Alliance Protocols']
    }
  }
};
