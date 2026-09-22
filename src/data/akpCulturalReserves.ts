/**
 * akpCulturalReserves.ts - UNESCO World Heritage & Continental Sanctuaries
 * Coordinate Space: 5796 x 5867 Native SVG Space
 * Authoritative Sources: UNESCO World Heritage Centre, IUCN, UNEP-WCMC BIOPAMA
 */

export type HeritageType = 'cultural' | 'natural' | 'mixed';

export interface HeritageSanctuarySite {
  id: string;
  name: string;
  countryIso3: string;
  countryName: string;
  type: HeritageType;
  x: number;
  y: number;
  areaKm2?: string;
  inscriptionYear: number;
  unescoCriteria: string;
  color: string;
  pulseColor: string;
  radius: number;
  badge: string;
  stats: { label: string; value: string }[];
  description: string;
  source: string;
  labelOffset?: { x: number; y: number };
}

export const HERITAGE_SITES_DATA: HeritageSanctuarySite[] = [
  // ==========================================
  // 1. UNESCO CULTURAL HERITAGE (GOLD / AMBER)
  // ==========================================
  {
    id: 'heritage-lalibela',
    name: 'Rock-Hewn Monolithic Churches of Lalibela',
    countryIso3: 'ETH',
    countryName: 'Ethiopia',
    type: 'cultural',
    x: 4100,
    y: 2180,
    inscriptionYear: 1978,
    unescoCriteria: 'Cultural: (i)(ii)(iii)',
    color: '#eab308',
    pulseColor: 'rgba(234, 179, 8, 0.60)',
    radius: 40,
    badge: '🏛️ UNESCO Cultural Jewel',
    stats: [
      { label: 'Monuments', value: '11 Monolithic Cave Churches' },
      { label: 'Masterpiece', value: 'Biete Giyorgis (Church of St. George)' },
      { label: 'Construction', value: 'Carved from Single Volcanic Basalt Blocks (12th-13th Century)' },
      { label: 'Living Pilgrimage', value: 'Active Ethiopian Orthodox Worship Center' }
    ],
    description: 'Eleven medieval monolithic rock-hewn churches carved out of solid volcanic rock in the mountains of Lasta, considered an engineering wonder of the medieval world.',
    source: 'UNESCO World Heritage Centre / Authority for Research and Conservation of Cultural Heritage (ARCCH)',
    labelOffset: { x: 300, y: -80 }
  },
  {
    id: 'heritage-axum',
    name: 'Kingdom of Aksum & Stelae Field',
    countryIso3: 'ETH',
    countryName: 'Ethiopia',
    type: 'cultural',
    x: 4050,
    y: 2060,
    inscriptionYear: 1980,
    unescoCriteria: 'Cultural: (i)(iv)',
    color: '#eab308',
    pulseColor: 'rgba(234, 179, 8, 0.55)',
    radius: 36,
    badge: '🏛️ UNESCO Ancient Capital',
    stats: [
      { label: 'Great Stela Height', value: '33 Meters (520 Ton Single Granite Slab)' },
      { label: 'Historical Empire', value: 'Aksumite Empire (1st to 8th Century CE)' },
      { label: 'Religious Significance', value: 'Church of Our Lady Mary of Zion (Ark of Covenant Sanctuary)' },
      { label: 'Inscriptions', value: 'Trilingual Royal Inscriptions (Ge\'ez, Sabaean, Greek)' }
    ],
    description: 'The ancient capital of the Aksumite Empire, marked by massive carved monolithic obelisks, royal tombs, and the cradle of Ethiopian civilization.',
    source: 'UNESCO World Heritage Centre',
    labelOffset: { x: -300, y: -70 }
  },
  {
    id: 'heritage-giza-pyramids',
    name: 'Memphis & its Necropolis – Pyramid Fields from Giza to Dahshur',
    countryIso3: 'EGY',
    countryName: 'Egypt',
    type: 'cultural',
    x: 3840,
    y: 1060,
    inscriptionYear: 1979,
    unescoCriteria: 'Cultural: (i)(iii)(vi)',
    color: '#eab308',
    pulseColor: 'rgba(234, 179, 8, 0.65)',
    radius: 46,
    badge: '🏛️ Seven Wonders of the Ancient World',
    stats: [
      { label: 'Great Pyramid Age', value: 'Circa 2560 BCE (4,580+ Years Old)' },
      { label: 'Height / Base', value: '146.6m Original Height, 2.3M Limestone Blocks' },
      { label: 'Key Monuments', value: 'Great Pyramid of Khufu, Khafre, Menkaure & Great Sphinx' },
      { label: 'World Status', value: 'Only Surviving Wonder of the Ancient World' }
    ],
    description: 'The capital of the Old Kingdom of Egypt with extraordinary funerary monuments, rock tombs, mastabas, temples, and the colossal Giza pyramids.',
    source: 'Supreme Council of Antiquities Egypt / UNESCO',
    labelOffset: { x: -300, y: 70 }
  },
  {
    id: 'heritage-djenne-timbuktu',
    name: 'Old Towns of Djenné & Great Mud Mosque',
    countryIso3: 'MLI',
    countryName: 'Mali',
    type: 'cultural',
    x: 1280,
    y: 2060,
    inscriptionYear: 1988,
    unescoCriteria: 'Cultural: (iii)(iv)',
    color: '#eab308',
    pulseColor: 'rgba(234, 179, 8, 0.55)',
    radius: 36,
    badge: '🏛️ Earth Architecture Masterpiece',
    stats: [
      { label: 'Structure', value: 'World’s Largest Mud-Brick / Adobe Building' },
      { label: 'Annual Ritual', value: 'Crépissage (Annual Communal Plastering Festival)' },
      { label: 'Trade History', value: 'Major Trans-Saharan Gold & Salt Entrepôt (250 BCE)' },
      { label: 'Architecture', value: 'Sudano-Sahelian Adobe Style' }
    ],
    description: 'Inhabited since 250 B.C., Djenné became a market center and an important link in the trans-Saharan gold trade with its awe-inspiring earthen Great Mosque.',
    source: 'UNESCO World Heritage Centre / Ministère de la Culture du Mali',
    labelOffset: { x: -300, y: 70 }
  },
  {
    id: 'heritage-great-zimbabwe',
    name: 'Great Zimbabwe National Monument',
    countryIso3: 'ZWE',
    countryName: 'Zimbabwe',
    type: 'cultural',
    x: 3550,
    y: 4320,
    inscriptionYear: 1986,
    unescoCriteria: 'Cultural: (i)(iii)(vi)',
    color: '#eab308',
    pulseColor: 'rgba(234, 179, 8, 0.55)',
    radius: 38,
    badge: '🏛️ UNESCO Medieval Stone Citadel',
    stats: [
      { label: 'Construction Style', value: 'Dry Stone Masonry (Built Without Mortar)' },
      { label: 'Peak Civilization', value: 'Shona Kingdom of Zimbabwe (11th-15th Century)' },
      { label: 'Great Enclosure', value: 'Outer Wall 250m Circumference, 11m Height' },
      { label: 'Artifacts', value: 'Carved Soapstone Zimbabwe Birds (National Emblem)' }
    ],
    description: 'The ruined city that was the capital of the Kingdom of Zimbabwe during the Late Iron Age, built of dry-stone granite walls spanning 722 hectares.',
    source: 'National Museums and Monuments of Zimbabwe / UNESCO',
    labelOffset: { x: 300, y: 70 }
  },
  {
    id: 'heritage-goree-island',
    name: 'Island of Gorée (Memorial to Transatlantic Slave Trade)',
    countryIso3: 'SEN',
    countryName: 'Senegal',
    type: 'cultural',
    x: 650,
    y: 2160,
    inscriptionYear: 1978,
    unescoCriteria: 'Cultural: (vi)',
    color: '#eab308',
    pulseColor: 'rgba(234, 179, 8, 0.55)',
    radius: 34,
    badge: '🏛️ World Memorial Site',
    stats: [
      { label: 'Landmark', value: 'Maison des Esclaves & "Door of No Return"' },
      { label: 'Historical Period', value: '15th to 19th Century Atlantic Trade' },
      { label: 'Geography', value: 'Volcanic Island 3km off Coast of Dakar' },
      { label: 'Symbolism', value: 'Global Memorial for Human Rights and Reconciliation' }
    ],
    description: 'Lying off the coast of Senegal opposite Dakar, Gorée was the largest slave-trading center on the African coast from the 15th to the 19th century.',
    source: 'UNESCO World Heritage Centre',
    labelOffset: { x: -300, y: 80 }
  },
  {
    id: 'heritage-kilwa-kisiwani',
    name: 'Ruins of Kilwa Kisiwani & Songo Mnara',
    countryIso3: 'TZA',
    countryName: 'Tanzania',
    type: 'cultural',
    x: 4220,
    y: 3680,
    inscriptionYear: 1981,
    unescoCriteria: 'Cultural: (iii)',
    color: '#eab308',
    pulseColor: 'rgba(234, 179, 8, 0.50)',
    radius: 32,
    badge: '🏛️ Swahili Maritime Empire',
    stats: [
      { label: 'Key Monument', value: 'Great Mosque & Husuni Kubwa Palace' },
      { label: 'Building Material', value: 'Carved Coral Rag & Mangrove Timber' },
      { label: 'Gold Trade Hub', value: 'Controlled Zimbabwe Gold Sea Route (13th-15th Century)' },
      { label: 'Visited By', value: 'Ibn Battuta (1331) & Vasco da Gama (1502)' }
    ],
    description: 'The ruins of two great Swahili trading cities on islands off the southern coast of Tanzania that commanded the gold trade of the Indian Ocean.',
    source: 'UNESCO World Heritage Centre / Antiquities Division Tanzania',
    labelOffset: { x: 300, y: 60 }
  },

  // ==========================================
  // 2. EXPANDED NATURAL BIOSPHERES & WONDERS (EMERALD / GREEN)
  // ==========================================
  {
    id: 'reserve-kruger',
    name: 'Kruger National Park & Great Limpopo Transfrontier',
    countryIso3: 'ZAF',
    countryName: 'South Africa / Mozambique / Zimbabwe',
    type: 'natural',
    x: 3640,
    y: 4720,
    areaKm2: '19,485 km² (Transfrontier: 35,000 km²)',
    inscriptionYear: 1926,
    unescoCriteria: 'Biosphere Reserve',
    color: '#10b981',
    pulseColor: 'rgba(16, 185, 129, 0.60)',
    radius: 46,
    badge: '🌿 Mega Transfrontier Park',
    stats: [
      { label: 'Total Area', value: '19,485 km² (Size of Israel/Slovenia)' },
      { label: 'Mammal Diversity', value: '147 Species (Largest in Africa)' },
      { label: 'Big Five Population', value: 'Over 13,000 Elephants, 1,700 Lions' },
      { label: 'Transfrontier Corridor', value: 'Limpopo (Mozambique) & Gonarezhou (Zimbabwe)' }
    ],
    description: 'One of the largest and most ecologically intact wildlife sanctuaries in the world, anchoring the Great Limpopo Transfrontier Conservation Area.',
    source: 'SANParks (South African National Parks) / Peace Parks Foundation',
    labelOffset: { x: 300, y: -70 }
  },
  {
    id: 'reserve-kilimanjaro',
    name: 'Mount Kilimanjaro National Park',
    countryIso3: 'TZA',
    countryName: 'Tanzania',
    type: 'natural',
    x: 4120,
    y: 3120,
    areaKm2: '1,668 km²',
    inscriptionYear: 1987,
    unescoCriteria: 'Natural: (vii)',
    color: '#10b981',
    pulseColor: 'rgba(16, 185, 129, 0.60)',
    radius: 44,
    badge: '🌿 "Roof of Africa" (5,895m)',
    stats: [
      { label: 'Peak Elevation', value: '5,895m (Highest Free-Standing Mountain Globally)' },
      { label: 'Ecological Zones', value: '5 Zones: Rain Forest, Moorland, Alpine, Arctic Summit' },
      { label: 'Glacier Status', value: 'Furtwängler Glacier (High-Risk Climate Sentinel)' },
      { label: 'Volcanic Origin', value: 'Stratovolcano with 3 Cones (Kibo, Mawenzi, Shira)' }
    ],
    description: 'At 5,895 m, Kilimanjaro is the highest peak in Africa. The park encompasses the mountain above the tree line and montane forest belt.',
    source: 'Tanzania National Parks (TANAPA) / UNESCO',
    labelOffset: { x: 300, y: 70 }
  },
  {
    id: 'reserve-victoria-falls',
    name: 'Mosi-oa-Tunya / Victoria Falls',
    countryIso3: 'ZMB',
    countryName: 'Zambia / Zimbabwe',
    type: 'natural',
    x: 3380,
    y: 4200,
    areaKm2: '68 km² (Zambezi Gorges)',
    inscriptionYear: 1989,
    unescoCriteria: 'Natural: (vii)(viii)',
    color: '#10b981',
    pulseColor: 'rgba(16, 185, 129, 0.60)',
    radius: 44,
    badge: '💧 "The Smoke that Thunders"',
    stats: [
      { label: 'Curtain Width', value: '1,708 Meters (Largest Sheet of Falling Water on Earth)' },
      { label: 'Drop Height', value: '108 Meters into Batoka Gorge' },
      { label: 'Peak Flow Volume', value: 'Over 500 Million Litres / Minute' },
      { label: 'River Basin', value: 'Zambezi River' }
    ],
    description: 'The world’s greatest sheet of falling water, creating a 500-meter cloud of rainbow-lit spray visible from 50 kilometers away.',
    source: 'UNESCO World Heritage Centre / Zambezi River Authority',
    labelOffset: { x: -300, y: -70 }
  },
  {
    id: 'reserve-virunga-volcanoes',
    name: 'Virunga & Volcanoes National Parks (Mountain Gorilla Sanctuary)',
    countryIso3: 'COD',
    countryName: 'DR Congo / Rwanda / Uganda',
    type: 'natural',
    x: 3550,
    y: 3080,
    areaKm2: '7,800 km²',
    inscriptionYear: 1979,
    unescoCriteria: 'Natural: (vii)(viii)(x)',
    color: '#10b981',
    pulseColor: 'rgba(16, 185, 129, 0.65)',
    radius: 42,
    badge: '🦍 Mountain Gorilla Sanctuary',
    stats: [
      { label: 'Gorilla Population', value: 'Hosts 50%+ of World’s Remaining Mountain Gorillas' },
      { label: 'Active Volcanoes', value: 'Mount Nyiragongo & Nyamuragira (Lava Lakes)' },
      { label: 'Biodiversity Rank', value: 'Most Biodiverse Protected Area in Africa' },
      { label: 'Africa’s Oldest', value: 'Established in 1925 (Albert National Park)' }
    ],
    description: 'Africa’s first national park, harboring glacial Rwenzori peaks, active lava lake volcanoes, and the critically endangered mountain gorillas.',
    source: 'Institut Congolais pour la Conservation de la Nature (ICCN) / UNESCO',
    labelOffset: { x: -300, y: -70 }
  },
  {
    id: 'reserve-bwindi',
    name: 'Bwindi Impenetrable National Park',
    countryIso3: 'UGA',
    countryName: 'Uganda',
    type: 'natural',
    x: 3720,
    y: 3040,
    areaKm2: '321 km²',
    inscriptionYear: 1994,
    unescoCriteria: 'Natural: (vii)(x)',
    color: '#10b981',
    pulseColor: 'rgba(16, 185, 129, 0.55)',
    radius: 36,
    badge: '🌿 Primeval Rainforest',
    stats: [
      { label: 'Rainforest Age', value: 'Over 25,000 Years Old (Pleistocene Refugium)' },
      { label: 'Gorilla Habitat', value: 'Home to 459 Individual Mountain Gorillas' },
      { label: 'Tree Species', value: 'Over 200 Tree Species (10 Endemic to Albertine Rift)' },
      { label: 'Bird Life', value: '350 Species (23 Albertine Rift Endemics)' }
    ],
    description: 'An ancient, montane, and lowland rainforest in southwestern Uganda on the edge of the Albertine Rift Valley.',
    source: 'Uganda Wildlife Authority (UWA) / UNESCO',
    labelOffset: { x: 300, y: 70 }
  },
  {
    id: 'reserve-okavango',
    name: 'Okavango Delta Wetland Oasis',
    countryIso3: 'BWA',
    countryName: 'Botswana',
    type: 'natural',
    x: 3120,
    y: 4420,
    areaKm2: '20,236 km²',
    inscriptionYear: 2014,
    unescoCriteria: 'Natural: (vii)(ix)(x)',
    color: '#10b981',
    pulseColor: 'rgba(16, 185, 129, 0.60)',
    radius: 44,
    badge: '💧 1000th UNESCO World Heritage Site',
    stats: [
      { label: 'Delta Type', value: 'Permanent & Seasonal Endorheic Basin (No Ocean Outlet)' },
      { label: 'Inflow Volume', value: '11 Trillion Litres of Water Translocated Annually' },
      { label: 'Elephant Sanctuary', value: 'Core of Largest Elephant Population in the World' },
      { label: 'Pristine State', value: 'One of the Very Few Intact Inland Delta Systems' }
    ],
    description: 'An endorheic delta in north-west Botswana where the Okavango River spills into the Kalahari sands, creating a permanent oasis of biological wonders.',
    source: 'UNESCO World Heritage Centre / Botswana Department of Wildlife',
    labelOffset: { x: -300, y: 70 }
  }
];
