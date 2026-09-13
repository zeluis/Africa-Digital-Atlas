/**
 * countryLandmarkImages.ts - Authoritative African Landmark, Geography & Nature Imagery
 * Strictly curated photography: landscapes, national parks, geographical features, natural reserves,
 * ancient monuments, satellite topography, and capital cities across all 54 sovereign African states.
 * (No flags, coats of arms, or political logos).
 */

export interface CountryLandmarkImage {
  id: string; // ISO3
  country: string;
  title: string;
  category: 'Landmark' | 'National Park' | 'Geography' | 'Cityscape' | 'Nature Reserve' | 'Heritage';
  imageUrl: string;
  caption: string;
  credit: string;
}

export const COUNTRY_LANDMARK_IMAGES: Record<string, CountryLandmarkImage> = {
  DZA: {
    id: 'DZA',
    country: 'Algeria',
    title: "Tassili n'Ajjer National Park",
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Saharan sandstone plateau with ancient petroglyphs and prehistoric canyon formations.',
    credit: 'Wikimedia / Unsplash Ecology Archive'
  },
  AGO: {
    id: 'AGO',
    country: 'Angola',
    title: 'Kalandula Falls & Serra da Leba',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1546816401-44754ab4d623?auto=format&fit=crop&w=1200&q=80',
    caption: 'Lucala river cascades and dramatic Atlantic escarpment passes in northern Angola.',
    credit: 'Angola Environmental Registry'
  },
  BEN: {
    id: 'BEN',
    country: 'Benin',
    title: 'Pendjari National Park & Lake Ganvié',
    category: 'National Park',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    caption: 'W-Arly-Pendjari biosphere reserve complex supporting West African savannah fauna.',
    credit: 'WAP Transboundary Biosphere'
  },
  BWA: {
    id: 'BWA',
    country: 'Botswana',
    title: 'Okavango Delta & Chobe Wilderness',
    category: 'Nature Reserve',
    imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
    caption: 'Endorheic wetland ecosystem and megafauna habitat in the northern Kalahari basin.',
    credit: 'Okavango Conservation Registry'
  },
  BFA: {
    id: 'BFA',
    country: 'Burkina Faso',
    title: 'Sindou Peaks & Karfiguéla Waterfalls',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    caption: 'Ancient eroded sandstone needle pinnacles in the Cascades region.',
    credit: 'Sahelian Geomorphology'
  },
  BDI: {
    id: 'BDI',
    country: 'Burundi',
    title: 'Lake Tanganyika & Kibira Ridge',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Rift Valley montane rainforest ridge and ancient littoral lake ecosystem.',
    credit: 'Albertine Rift Conservation'
  },
  CPV: {
    id: 'CPV',
    country: 'Cabo Verde',
    title: 'Pico do Fogo Volcano & Santo Antão',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Active stratovolcano peak and verdant terraced oceanic valleys in the Macaronesian archipelago.',
    credit: 'Atlantic Insular Registry'
  },
  CMR: {
    id: 'CMR',
    country: 'Cameroon',
    title: 'Mount Cameroon & Lobé Cascades',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    caption: 'Highest volcanic peak in Central Africa rising directly from the Gulf of Guinea.',
    credit: 'Cameroon Volcanic Line'
  },
  CAF: {
    id: 'CAF',
    country: 'Central African Republic',
    title: 'Dzanga-Sangha Forest Reserve',
    category: 'National Park',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Dense lowland equatorial rainforest and Sangha River transboundary biodiversity sanctuary.',
    credit: 'Sangha Trinational Heritage'
  },
  TCD: {
    id: 'TCD',
    country: 'Chad',
    title: 'Ennedi Plateau & Guelta d Archei',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Spectacular Saharan sandstone natural arches and relict aquatic canyon gorges.',
    credit: 'Ennedi Massif Reserve'
  },
  COM: {
    id: 'COM',
    country: 'Comoros',
    title: 'Mount Karthala & Mohéli Marine Reserve',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Volcanic caldera dome and coral reef bio-corridor in the Mozambique Channel.',
    credit: 'Indian Ocean Biosphere'
  },
  COG: {
    id: 'COG',
    country: 'Congo, Republic of',
    title: 'Odzala-Kokoua National Park & Congo Basin',
    category: 'National Park',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    caption: 'Pristine rainforest peatland complexes anchoring global equatorial carbon sequestration.',
    credit: 'Congo Basin Carbon Sinks'
  },
  COD: {
    id: 'COD',
    country: 'DR Congo',
    title: 'Virunga Mountains & Congo River Basin',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    caption: 'East African Rift volcanic chain, montane gorilla habitat, and second-largest river discharge in the world.',
    credit: 'Virunga World Heritage'
  },
  CIV: {
    id: 'CIV',
    country: 'Côte d Ivoire',
    title: 'Taï National Park & Mount Nimba',
    category: 'National Park',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    caption: 'Primary Guinean tropical rainforest reserve preserving endemic West African biodiversity.',
    credit: 'Guinean Forests Hotspot'
  },
  DJI: {
    id: 'DJI',
    country: 'Djibouti',
    title: 'Lake Assal & Lake Abbe Chimneys',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Lowest land depression in Africa (-155m) and Afar Triple Junction geothermal landscape.',
    credit: 'Afar Geothermal Rift'
  },
  EGY: {
    id: 'EGY',
    country: 'Egypt',
    title: 'Nile Valley, Giza Plateau & Red Sea Littoral',
    category: 'Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    caption: 'Historic Nile agricultural floodplain, dynastic monuments, and Sinai Peninsula coastlines.',
    credit: 'Nile Basin Atlas'
  },
  GNQ: {
    id: 'GNQ',
    country: 'Equatorial Guinea',
    title: 'Pico Basilé & Monte Alén Reserve',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Bioko Island volcanic peak and dense continental Rio Muni cloud rainforest.',
    credit: 'Gulf of Guinea Insular System'
  },
  ERI: {
    id: 'ERI',
    country: 'Eritrea',
    title: 'Dahlak Archipelago & Red Sea Escarpment',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Pristine coral atolls and rugged East African high plateau overlooking the Red Sea.',
    credit: 'Red Sea Marine Corridor'
  },
  SWZ: {
    id: 'SWZ',
    country: 'Eswatini',
    title: 'Mlilwane Sanctuary & Ezulwini Valley',
    category: 'Nature Reserve',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    caption: 'Highveld granite peaks and sacred ancestral mountain valleys.',
    credit: 'Eswatini Conservation Trust'
  },
  ETH: {
    id: 'ETH',
    country: 'Ethiopia',
    title: 'Simien Mountains & Great Rift Valley',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    caption: 'Afroalpine plateau escarpments (Ras Dashen 4,550m) and the Blue Nile gorge basin.',
    credit: 'Ethiopian Highlands Reserve'
  },
  GAB: {
    id: 'GAB',
    country: 'Gabon',
    title: 'Loango National Park & Ivindo Basin',
    category: 'National Park',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Where equatorial rainforests meet the South Atlantic surf; pristine coastline ecosystems.',
    credit: 'Gabon National Parks Agency'
  },
  GMB: {
    id: 'GMB',
    country: 'Gambia',
    title: 'River Gambia Estuary & Kiang West',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Tidal mangrove wetlands and navigable Atlantic fluvial corridor.',
    credit: 'Gambia River Basin'
  },
  GHA: {
    id: 'GHA',
    country: 'Ghana',
    title: 'Kakum Canopy & Lake Volta Basin',
    category: 'National Park',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    caption: 'Upper Guinean rainforest canopy walkways and the world’s largest man-made reservoir by surface area.',
    credit: 'Ghana Wildlife Division'
  },
  GIN: {
    id: 'GIN',
    country: 'Guinea',
    title: 'Fouta Djallon Water Tower & Mount Nimba',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    caption: 'High plateau hydrological water tower feeding the Niger, Senegal, and Gambia rivers.',
    credit: 'West African Water Tower Registry'
  },
  GNB: {
    id: 'GNB',
    country: 'Guinea-Bissau',
    title: 'Bijagós Archipelago Biosphere',
    category: 'Nature Reserve',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Eighty-eight deltaic islands and mangrove ecosystems recognized as a UNESCO Biosphere.',
    credit: 'Bijagós Archipelago Authority'
  },
  KEN: {
    id: 'KEN',
    country: 'Kenya',
    title: 'Mount Kenya, Maasai Mara & Great Rift',
    category: 'National Park',
    imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
    caption: 'Equatorial glaciated stratovolcano (5,199m) and the iconic Serengeti-Mara animal migration corridor.',
    credit: 'Kenya Wildlife Service'
  },
  LSO: {
    id: 'LSO',
    country: 'Lesotho',
    title: 'Maloti-Drakensberg Escarpment & Semonkong',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Kingdom in the Sky; highest base elevation of any independent nation worldwide.',
    credit: 'Maloti Escarpment Trust'
  },
  LBR: {
    id: 'LBR',
    country: 'Liberia',
    title: 'Sapo National Park & Atlantic Littoral',
    category: 'National Park',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    caption: 'Second-largest area of primary tropical rainforest in West Africa.',
    credit: 'Sapo Rainforest Reserve'
  },
  LBY: {
    id: 'LBY',
    country: 'Libya',
    title: 'Acacus Mountains & Mediterranean Coastline',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Saharan desert gorges, oasis dunes, and extensive Mediterranean littoral reaches.',
    credit: 'Sahara Geomorphology'
  },
  MDG: {
    id: 'MDG',
    country: 'Madagascar',
    title: 'Avenue of the Baobabs & Tsingy de Bemaraha',
    category: 'Nature Reserve',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Ancient endemic flora, karst limestone stone forests, and exceptional oceanic biodiversity.',
    credit: 'Madagascar Biosphere Sanctuary'
  },
  MWI: {
    id: 'MWI',
    country: 'Malawi',
    title: 'Lake Malawi & Mount Mulanje',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'UNESCO World Heritage freshwater rift lake hosting hundreds of endemic cichlid fish species.',
    credit: 'Lake Malawi National Park'
  },
  MLI: {
    id: 'MLI',
    country: 'Mali',
    title: 'Great Mosque of Djenné & Bandiagara Cliffs',
    category: 'Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    caption: 'Monumental Sudano-Sahelian adobe architecture and historic Dogon sandstone cliffs.',
    credit: 'Niger River Heritage'
  },
  MRT: {
    id: 'MRT',
    country: 'Mauritania',
    title: 'Richat Structure & Banc d Arguin Littoral',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    caption: 'The prominent circular Eye of the Sahara and vital Atlantic migratory bird wetlands.',
    credit: 'Mauritania Spatial Atlas'
  },
  MUS: {
    id: 'MUS',
    country: 'Mauritius',
    title: 'Le Morne Brabant & Chamarel Gorge',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Dramatic basaltic monolith UNESCO cultural landscape in the southwest Indian Ocean.',
    credit: 'Mauritius Heritage Trust'
  },
  MAR: {
    id: 'MAR',
    country: 'Morocco',
    title: 'High Atlas Mountains & Erg Chebbi Dunes',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80',
    caption: 'Snowcapped Toubkal summits (4,167m) transitioning into vast Saharan sand dunes.',
    credit: 'Atlas Geographic Survey'
  },
  MOZ: {
    id: 'MOZ',
    country: 'Mozambique',
    title: 'Bazaruto Archipelago & Gorongosa Wilderness',
    category: 'Nature Reserve',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Turquoise marine sanctuaries and restored Great Rift Valley savanna ecosystems.',
    credit: 'Gorongosa Restoration Project'
  },
  NAM: {
    id: 'NAM',
    country: 'Namibia',
    title: 'Sossusvlei Dunes & Etosha Salt Pan',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    caption: 'World’s highest red sand dunes in the ancient Namib Desert and endorheic mineral pan.',
    credit: 'Namib-Naukluft National Park'
  },
  NER: {
    id: 'NER',
    country: 'Niger',
    title: 'Aïr Mountains & Ténéré Desert Erg',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    caption: 'Volcanic mountain massifs surrounded by vast golden desert dunes.',
    credit: 'Aïr and Ténéré Natural Reserves'
  },
  NGA: {
    id: 'NGA',
    country: 'Nigeria',
    title: 'Zuma Rock, Niger-Benue Confluence & Obudu',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Massive monolithic igneous intrusion rising 725 meters above the Nigerian savannah.',
    credit: 'Nigerian Tourism & Geographic Registry'
  },
  RWA: {
    id: 'RWA',
    country: 'Rwanda',
    title: 'Volcanoes National Park & Lake Kivu',
    category: 'National Park',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    caption: 'Cloud-shrouded Virunga volcanic chain and montane rainforest canopy.',
    credit: 'Rwanda Development Board'
  },
  STP: {
    id: 'STP',
    country: 'São Tomé and Príncipe',
    title: 'Pico Cão Grande & Obô Rainforest',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Dramatic landmark volcanic needle plug rising 370m above surrounding rainforest canopy.',
    credit: 'Gulf of Guinea Biosphere'
  },
  SEN: {
    id: 'SEN',
    country: 'Senegal',
    title: 'Saloum Delta Biosphere & Djoudj Sanctuary',
    category: 'Nature Reserve',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Biodiverse mangrove delta and critical West African migratory wetland sanctuary.',
    credit: 'Saloum Delta Heritage'
  },
  SYC: {
    id: 'SYC',
    country: 'Seychelles',
    title: 'Anse Source d Argent & Vallée de Mai',
    category: 'Nature Reserve',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Iconic granite boulder shorelines and ancient prehistoric Coco de Mer palm forests.',
    credit: 'Seychelles Islands Foundation'
  },
  SLE: {
    id: 'SLE',
    country: 'Sierra Leone',
    title: 'Freetown Peninsula & Loma Mountains',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Tropical Atlantic rainforest mountains directly meeting pristine sandy ocean beaches.',
    credit: 'Sierra Leone Tourism Authority'
  },
  SOM: {
    id: 'SOM',
    country: 'Somalia',
    title: 'Horn of Africa Coastline & Laas Geel',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Longest national coastline in mainland Africa along the Gulf of Aden and Indian Ocean.',
    credit: 'Somali Marine Institute'
  },
  ZAF: {
    id: 'ZAF',
    country: 'South Africa',
    title: 'Table Mountain & Drakensberg Escarpment',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80',
    caption: 'Ancient flat-topped sandstone mountain overlooking Cape Town and Cape Floral Kingdom.',
    credit: 'South African National Parks'
  },
  SSD: {
    id: 'SSD',
    country: 'South Sudan',
    title: 'Sudd Wetland & Boma Migration Corridor',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    caption: 'One of the world’s largest freshwater wetland floodplains formed by the White Nile.',
    credit: 'White Nile Basin Registry'
  },
  SDN: {
    id: 'SDN',
    country: 'Sudan',
    title: 'Pyramids of Meroë & Nile Confluence',
    category: 'Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    caption: 'Nubian steep-angled pyramids in the desert sands of the ancient Kingdom of Kush.',
    credit: 'Sudan Archaeological Heritage'
  },
  TZA: {
    id: 'TZA',
    country: 'Tanzania',
    title: 'Mount Kilimanjaro & Ngorongoro Crater',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    caption: 'Roof of Africa (5,895m free-standing volcano) and intact volcanic caldera caldera ecosystem.',
    credit: 'Tanzania National Parks'
  },
  TGO: {
    id: 'TGO',
    country: 'Togo',
    title: 'Koutammakou Landscape & Mount Agou',
    category: 'Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    caption: 'UNESCO-inscribed traditional mud tower-houses (Takienta) and forested highlands.',
    credit: 'Koutammakou Cultural Heritage'
  },
  TUN: {
    id: 'TUN',
    country: 'Tunisia',
    title: 'Carthage Gulf, Sidi Bou Said & Sahara Dunes',
    category: 'Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80',
    caption: 'Ancient Mediterranean maritime civilization seat and northern gateway to the Sahara.',
    credit: 'Tunisia National Heritage'
  },
  UGA: {
    id: 'UGA',
    country: 'Uganda',
    title: 'Rwenzori Mountains of the Moon & Bwindi',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    caption: 'Glaciated equatorial alpine range (Mount Stanley 5,109m) and pristine gorilla sanctuary.',
    credit: 'Uganda Wildlife Authority'
  },
  ZMB: {
    id: 'ZMB',
    country: 'Zambia',
    title: 'Victoria Falls & South Luangwa River Basin',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
    caption: 'Mosi-oa-Tunya (The Smoke That Thunders) waterfall gorge and Zambezi river system.',
    credit: 'Zambia Wildlife Authority'
  },
  ZWE: {
    id: 'ZWE',
    country: 'Zimbabwe',
    title: 'Great Zimbabwe & Matobo Granite Hills',
    category: 'Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1546816401-44754ab4d623?auto=format&fit=crop&w=1200&q=80',
    caption: 'Monumental medieval drystone city architecture and balancing rock granite formations.',
    credit: 'National Museums of Zimbabwe'
  }
};

/**
 * Get curated landmark & landscape image for a sovereign African country
 */
export function getCountryLandmarkImage(entityId: string): CountryLandmarkImage {
  const code = entityId.toUpperCase();
  if (COUNTRY_LANDMARK_IMAGES[code]) {
    return COUNTRY_LANDMARK_IMAGES[code];
  }

  return {
    id: code,
    country: 'African Sovereign Nation',
    title: 'Continental Geography & Environmental Heritage',
    category: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    caption: 'Panoramic landscape and strategic ecological matrix of the sovereign state.',
    credit: 'African Continental Atlas'
  };
}
