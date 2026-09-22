/**
 * akpThematicOverlays.ts
 * Georeferenced Thematic Corridors, Infrastructure Arteries & Dynamic Assets
 * Native SVG Coordinate Space: 5796 x 5867
 * Authoritative Data Sources: EC JRC AKP, AU AfCFTA, Copernicus, UNEP, IRENA, GHSL
 */

export interface ThematicPath {
  id: string;
  name: string;
  category: 'energy_infra' | 'environment' | 'agriculture' | 'demographics' | 'economic';
  d: string;
  color: string;
  strokeWidth: number;
  dashArray?: string;
  speedSec: number;
  description: string;
  stats: { label: string; value: string }[];
  source: string;
}

export interface ThematicPulseNode {
  id: string;
  name: string;
  category: 'energy_infra' | 'environment' | 'agriculture' | 'demographics' | 'economic';
  x: number;
  y: number;
  color: string;
  pulseColor: string;
  radius: number;
  label: string;
  subtitle: string;
  type: string;
  stats: { label: string; value: string }[];
  description: string;
  source: string;
  badge: string;
  labelOffset?: { x: number; y: number };
}

export interface ThematicAreaAura {
  id: string;
  name: string;
  category: 'energy_infra' | 'environment' | 'agriculture' | 'demographics' | 'economic';
  d: string;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  description: string;
  stats: { label: string; value: string }[];
  source: string;
}

// 1. TRANSMISSION LINES & MULTIMODAL CORRIDORS (5796 x 5867)
export const THEMATIC_CORRIDORS: ThematicPath[] = [
  // --- ENERGY: Continental Power Pools & HVDC Backbones ---
  {
    id: 'hvdc-inga-kolwezi-joburg',
    name: 'Inga–Kolwezi–Johannesburg Southern HVDC Power Backbone',
    category: 'energy_infra',
    d: 'M 2780 3260 Q 3050 3550 3280 3780 T 3450 4050 T 3380 4720',
    color: '#38bdf8',
    strokeWidth: 26,
    speedSec: 2.2,
    description: 'High-Voltage Direct Current (HVDC) corridor interconnecting the Congo River hydro complex through the Zambian Copperbelt into the Southern African Power Pool (SAPP).',
    stats: [
      { label: 'Transmission Voltage', value: '500 kV DC' },
      { label: 'Installed Interconnect Capacity', value: '3,800 MW' },
      { label: 'Basin Origin', value: 'Inga Dam (Congo River)' },
      { label: 'Grid Region', value: 'SAPP / Central Africa Intertie' }
    ],
    source: 'EC JRC Clean Energy Access Tool & SAPP Grid Atlas'
  },
  {
    id: 'wapp-coastal-transmission',
    name: 'West African Power Pool (WAPP) Coastal Interconnector',
    category: 'energy_infra',
    d: 'M 750 2150 Q 1150 2400 1350 2520 T 1720 2500 T 2050 2580 T 2520 2620',
    color: '#38bdf8',
    strokeWidth: 22,
    speedSec: 2.6,
    description: '330 kV transmission spine linking Senegal, Côte d’Ivoire, Ghana, Togo, Benin, and Nigeria to create a unified West African electricity market.',
    stats: [
      { label: 'Transmission Voltage', value: '330 kV AC' },
      { label: 'Coverage', value: '6 West African Nations' },
      { label: 'Status', value: 'Synchronized & Operational' },
      { label: 'Renewable Feed-in', value: 'Solar & Gas CCGT' }
    ],
    source: 'WAPP Secretariat / AKP Energy Explorer'
  },
  {
    id: 'eapp-ethiopia-kenya-tanzania',
    name: 'Eastern Africa Power Pool (EAPP) High-Voltage Interconnector',
    category: 'energy_infra',
    d: 'M 3880 2260 Q 4020 2580 4100 2780 T 4060 2980 T 4120 3520',
    color: '#06b6d4',
    strokeWidth: 24,
    speedSec: 2.4,
    description: '500 kV HVDC intertie wheeling renewable hydroelectric power from Ethiopia’s highlands and Lake Turkana wind energy to Kenya and Tanzania.',
    stats: [
      { label: 'Voltage', value: '500 kV HVDC' },
      { label: 'Power Transfer Capacity', value: '2,000 MW' },
      { label: 'Primary Generation', value: 'Hydro (GERD) & Geothermal' },
      { label: 'Pool', value: 'EAPP' }
    ],
    source: 'EAPP Master Plan / JRC Energy Matrix'
  },

  // --- ENVIRONMENT: Great Continental Wildlife & Eco-Corridors ---
  {
    id: 'kavango-zambezi-corridor',
    name: 'Kavango–Zambezi (KAZA) Transfrontier Wildlife Corridor',
    category: 'environment',
    d: 'M 3020 4220 Q 3200 4280 3450 4180 T 3680 4080',
    color: '#10b981',
    strokeWidth: 28,
    speedSec: 3.5,
    description: 'The world’s largest transboundary conservation area encompassing 520,000 km² across Angola, Botswana, Namibia, Zambia, and Zimbabwe.',
    stats: [
      { label: 'Total Surface Area', value: '520,000 km²' },
      { label: 'Elephant Population', value: '~250,000 (Largest on Earth)' },
      { label: 'Participating States', value: '5 Southern African Nations' },
      { label: 'Conservation Status', value: 'Transfrontier Biosphere' }
    ],
    source: 'BIOPAMA Africa / KAZA Secretariat / IUCN'
  },
  {
    id: 'nile-freshwater-artery',
    name: 'Nile Basin Freshwater & Ecological Lifeline',
    category: 'environment',
    d: 'M 3860 2930 Q 3750 2480 3760 2080 T 3820 1480 T 3850 1180 T 3920 820',
    color: '#06b6d4',
    strokeWidth: 30,
    speedSec: 2.8,
    description: 'Vital continental freshwater spine spanning 6,650 km supporting over 300 million people across 11 riparian nations.',
    stats: [
      { label: 'Basin Length', value: '6,650 km' },
      { label: 'Riparian States', value: '11 Nations' },
      { label: 'Freshwater Share', value: '97% of Egypt & Sudan Water' },
      { label: 'Monitoring', value: 'Copernicus Global Water Surface' }
    ],
    source: 'Global Surface Water Explorer / EC JRC'
  },

  // --- AGRICULTURE: Food Corridors & Grain Transport Logistics ---
  {
    id: 'guinea-savanna-breadbasket',
    name: 'Guinea Savanna Agricultural Transformation Belt',
    category: 'agriculture',
    d: 'M 880 2220 Q 1400 2300 1880 2380 T 2400 2480 T 3100 2520',
    color: '#eab308',
    strokeWidth: 26,
    speedSec: 3.0,
    description: 'A 600-million hectare agricultural frontier with high agro-ecological potential for maize, soybean, cassava, and livestock.',
    stats: [
      { label: 'Arable Land Area', value: '600 Million Hectares' },
      { label: 'Under Cultivation', value: '< 15%' },
      { label: 'Target Crops', value: 'Cassava, Maize, Sorghum, Rice' },
      { label: 'Agro-Zone', value: 'Sub-Humid Savanna' }
    ],
    source: 'FAO / EC JRC Agricultural Stress Index System (ASIS)'
  },
  {
    id: 'east-african-grain-corridor',
    name: 'East African Rift Agricultural & Grain Artery',
    category: 'agriculture',
    d: 'M 3880 2260 Q 3950 2620 4050 2920 T 4020 3480 T 3750 3980',
    color: '#f59e0b',
    strokeWidth: 24,
    speedSec: 2.7,
    description: 'High-fertility volcanic rift valley corridor linking Ethiopian teff/coffee highlands to Kenyan and Tanzanian cereal belts.',
    stats: [
      { label: 'Annual Cereal Output', value: '42 Million Tonnes' },
      { label: 'Rainfall Reliability', value: 'Bimodal (Long & Short Rains)' },
      { label: 'Soil Organic Carbon', value: 'High (> 65 mg/g)' },
      { label: 'Resilience Status', value: 'High Agro-Biodiversity' }
    ],
    source: 'AKP Crop Mapping & Monitoring / JRC'
  },

  // --- DEMOGRAPHICS: Urban Megalopolis Mobility Arcs ---
  {
    id: 'abidjan-lagos-megalopolis',
    name: 'Abidjan–Lagos Coastal Megalopolis Corridor',
    category: 'demographics',
    d: 'M 1220 2680 Q 1520 2600 1780 2540 T 2050 2580 T 2350 2600',
    color: '#a855f7',
    strokeWidth: 32,
    speedSec: 2.0,
    description: 'One of the world’s fastest-growing urban agglomerations, projected to house over 50 million people by 2035 along a continuous 1,000 km coastal belt.',
    stats: [
      { label: 'Corridor Population', value: '38 Million (2025)' },
      { label: 'Projected 2050 Pop', value: '75 Million+' },
      { label: 'Economic Output', value: '~70% of Regional GDP' },
      { label: 'GHSL Density', value: 'High Built-up Cluster' }
    ],
    source: 'Global Human Settlement Layer (GHSL) / JRC'
  },
  {
    id: 'gauteng-durban-corridor',
    name: 'Gauteng–Durban Industrial & Demographic Belt',
    category: 'demographics',
    d: 'M 3380 4720 Q 3520 4820 3650 4920',
    color: '#c084fc',
    strokeWidth: 26,
    speedSec: 2.2,
    description: 'South Africa’s primary industrial artery connecting the 16-million Gauteng urban agglomeration to the continent’s busiest container terminal at Port of Durban.',
    stats: [
      { label: 'Urban Population', value: '16.2 Million' },
      { label: 'Freight Volume', value: '32M Tonnes / Year' },
      { label: 'Built-up Area', value: 'High Industrial Density' },
      { label: 'Transit Time', value: '6-8 Hours Motorway' }
    ],
    source: 'GHSL / World Bank Urban Accessibility Index'
  },

  // --- ECONOMIC: AfCFTA Trans-African Highways & Multimodal Trade ---
  {
    id: 'tah1-trans-sahara',
    name: 'Trans-Sahara Multimodal Highway (TAH 2 / Algiers–Lagos)',
    category: 'economic',
    d: 'M 2150 680 Q 2350 1350 2480 2000 T 2350 2600',
    color: '#0284c7',
    strokeWidth: 28,
    dashArray: '12 8',
    speedSec: 3.2,
    description: 'Strategic 4,500 km transcontinental trade highway linking the Mediterranean at Algiers through Niger to the Atlantic at Lagos, anchoring the AfCFTA interior trade.',
    stats: [
      { label: 'Total Distance', value: '4,500 km' },
      { label: 'Paved Completion', value: '> 90%' },
      { label: 'AfCFTA Trade Target', value: '$12 Billion Annual Freight' },
      { label: 'Terminus Ports', value: 'Algiers (Med) & Lagos (Atlantic)' }
    ],
    source: 'AU AfCFTA Secretariat & UN ECA Infrastructure Master Plan'
  },
  {
    id: 'northern-corridor-mombasa-kigali',
    name: 'East African Northern Trade Corridor (Mombasa–Nairobi–Kigali)',
    category: 'economic',
    d: 'M 4250 3120 Q 4060 2980 3860 2930 T 3620 3050',
    color: '#38bdf8',
    strokeWidth: 28,
    speedSec: 2.1,
    description: 'The highest-throughput logistics corridor in Eastern and Central Africa, connecting landlocked Uganda, Rwanda, Burundi, and Eastern DRC to the Port of Mombasa.',
    stats: [
      { label: 'Port Gateway', value: 'Port of Mombasa (Kenya)' },
      { label: 'Corridor Throughput', value: '34 Million Metric Tonnes' },
      { label: 'Standard Gauge Rail', value: 'Operational (Mombasa–Naivasha)' },
      { label: 'Customs Clearance', value: 'Single Customs Territory' }
    ],
    source: 'Northern Corridor Transit and Transport Coordination Authority'
  }
];

// 2. THEMATIC AREA AURAS (Biodiversity Shields, Great Green Wall, Breadbaskets)
export const THEMATIC_AURAS: ThematicAreaAura[] = [
  {
    id: 'great-green-wall',
    name: 'The Great Green Wall of Africa (Sahelian Restoration Belt)',
    category: 'environment',
    d: 'M 750 2100 Q 1400 1950 2100 2050 T 2800 2150 T 3500 2180 T 4100 2050 L 4150 2180 Q 3500 2300 2800 2280 T 2100 2200 T 1400 2100 T 750 2220 Z',
    fillColor: '#10b981',
    strokeColor: '#34d399',
    strokeWidth: 8,
    description: 'An 8,000 km natural wonder initiative spanning 11 nations across the width of the continent to restore 100 million hectares of degraded land and sequester 250M tons of carbon.',
    stats: [
      { label: 'Length', value: '8,000 km across 11 Countries' },
      { label: 'Restoration Target', value: '100 Million Hectares by 2030' },
      { label: 'Carbon Sequestration', value: '250 Million Tonnes CO2' },
      { label: 'Pillar Agency', value: 'African Union & Pan-African Agency' }
    ],
    source: 'Pan-African Agency of the Great Green Wall / EC JRC'
  },
  {
    id: 'congo-basin-rainforest-shield',
    name: 'Congo Basin Primary Rainforest Ecological Shield',
    category: 'environment',
    d: 'M 2600 2700 Q 3000 2600 3400 2800 T 3550 3300 T 3100 3600 T 2600 3300 Z',
    fillColor: '#059669',
    strokeColor: '#10b981',
    strokeWidth: 10,
    description: 'The second largest tropical rainforest on Earth and the world’s most effective net carbon sink, absorbing 1.5 billion tons of CO2 annually.',
    stats: [
      { label: 'Total Area', value: '3.7 Million km²' },
      { label: 'Net Carbon Absorption', value: '1.5 Billion Tonnes / Year' },
      { label: 'Endemic Species', value: '> 10,000 Plant Species' },
      { label: 'Peatland Storage', value: '30 Billion Tonnes Carbon (Cuvette Centrale)' }
    ],
    source: 'Copernicus Global Land Cover & Global Forest Watch / JRC'
  }
];

// 3. THEMATIC NODES & METROPOLITAN MEGAHUBS (5796 x 5867)
export const THEMATIC_PULSE_NODES: ThematicPulseNode[] = [
  // --- ENERGY: Landmark Generation Hubs ---
  {
    id: 'node-gerd',
    name: 'Grand Ethiopian Renaissance Dam (GERD)',
    category: 'energy_infra',
    x: 3880,
    y: 2260,
    color: '#0891b2',
    pulseColor: '#22d3ee',
    radius: 38,
    label: 'GERD Hydro Complex',
    subtitle: 'Hydroelectric Super-Project',
    type: 'Hydroelectric (5,150 MW)',
    badge: '⚡ Clean Energy',
    labelOffset: { x: 260, y: -70 },
    stats: [
      { label: 'Installed Capacity', value: '5,150 MW' },
      { label: 'Reservoir Volume', value: '74 Billion m³' },
      { label: 'Basin', value: 'Blue Nile' },
      { label: 'Commissioned', value: 'Operational / Expanding' }
    ],
    description: 'Africa’s largest hydroelectric facility, doubling Ethiopia’s electricity generation and exporting clean baseload power to Sudan, Djibouti, and Kenya.',
    source: 'EC JRC Global Dam Watch / Ethiopian Electric Power'
  },
  {
    id: 'node-noor',
    name: 'Noor Ouarzazate Solar Complex',
    category: 'energy_infra',
    x: 1840,
    y: 780,
    color: '#d97706',
    pulseColor: '#fbbf24',
    radius: 36,
    label: 'Noor Solar CSP',
    subtitle: 'Concentrated Solar Power',
    type: 'Solar CSP + PV (580 MW)',
    badge: '☀️ Solar Superhub',
    labelOffset: { x: 0, y: 170 },
    stats: [
      { label: 'Capacity', value: '580 MW' },
      { label: 'Thermal Storage', value: '7.5 Hours Molten Salt' },
      { label: 'CO2 Offset', value: '760,000 Tonnes / Year' },
      { label: 'Area', value: '3,000 Hectares' }
    ],
    description: 'One of the world’s largest concentrated solar power (CSP) installations with utility-scale molten-salt thermal energy storage delivering power through night-time peak hours.',
    source: 'MASEN / AKP Clean Energy Matrix'
  },
  {
    id: 'node-benban',
    name: 'Benban Solar Park',
    category: 'energy_infra',
    x: 3820,
    y: 1180,
    color: '#eab308',
    pulseColor: '#fef08a',
    radius: 38,
    label: 'Benban Solar Park',
    subtitle: 'Photovoltaic Mega-Array',
    type: 'Solar Photovoltaic (1,650 MW)',
    badge: '☀️ Utility Solar',
    labelOffset: { x: 270, y: 60 },
    stats: [
      { label: 'Capacity', value: '1,650 MW' },
      { label: 'Plots', value: '41 Individual PV Plants' },
      { label: 'Solar Irradiance', value: '2,300 kWh/m²/yr' },
      { label: 'Investment', value: '$4.0 Billion' }
    ],
    description: 'A 37.2 km² solar park in Egypt’s Western Desert, visibly distinct from orbit and supplying clean electricity to over 1 million homes.',
    source: 'New and Renewable Energy Authority (NREA) / AKP'
  },
  {
    id: 'node-turkana',
    name: 'Lake Turkana Wind Power Project',
    category: 'energy_infra',
    x: 4100,
    y: 2780,
    color: '#0284c7',
    pulseColor: '#38bdf8',
    radius: 35,
    label: 'Lake Turkana Wind',
    subtitle: 'Sub-Saharan Wind Farm',
    type: 'Wind Energy (310 MW)',
    badge: '💨 Wind Energy',
    labelOffset: { x: 270, y: -40 },
    stats: [
      { label: 'Capacity', value: '310 MW' },
      { label: 'Turbines', value: '365 Vestas Turbines' },
      { label: 'Grid Share', value: '~17% of Kenya Electricity' },
      { label: 'Capacity Factor', value: '> 60% (Global Top Tier)' }
    ],
    description: 'Africa’s largest wind farm, tapping into the hyper-reliable Turkana low-level jet stream to feed the Kenyan national grid.',
    source: 'LTWP / IRENA Renewable Energy Atlas'
  },

  // --- ENVIRONMENT: Biospheres & Wetland Beacons ---
  {
    id: 'node-serengeti',
    name: 'Serengeti & Ngorongoro Ecosystem',
    category: 'environment',
    x: 4020,
    y: 3180,
    color: '#059669',
    pulseColor: '#34d399',
    radius: 36,
    label: 'Serengeti Biosphere',
    subtitle: 'UNESCO World Heritage',
    type: 'Wildlife Ecosystem (14,763 km²)',
    badge: '🌿 World Heritage',
    labelOffset: { x: 280, y: 70 },
    stats: [
      { label: 'Area', value: '14,763 km²' },
      { label: 'Annual Migration', value: '1.5 Million Wildebeest' },
      { label: 'Status', value: 'UNESCO World Heritage' },
      { label: 'Bio-Density', value: 'World’s Greatest Mammal Migration' }
    ],
    description: 'The oldest and most protected grassland ecosystem on Earth, featuring the iconic annual circular migration of over 2 million ungulates.',
    source: 'BIOPAMA / UNESCO World Heritage Centre'
  },
  {
    id: 'node-okavango',
    name: 'Okavango Delta Inland Wetland',
    category: 'environment',
    x: 3120,
    y: 4420,
    color: '#0d9488',
    pulseColor: '#2dd4bf',
    radius: 38,
    label: 'Okavango Delta',
    subtitle: 'Ramsar Wetland Site',
    type: 'Endorheic Delta (20,236 km²)',
    badge: '💧 Global Ramsar Wetland',
    labelOffset: { x: -280, y: 30 },
    stats: [
      { label: 'Wetland Area', value: '20,236 km²' },
      { label: 'Annual Inflow', value: '11 Trillion Litres' },
      { label: 'Designation', value: '1000th UNESCO World Heritage Site' },
      { label: 'Water Fate', value: '96% Transpired / Evaporated' }
    ],
    description: 'One of the few interior delta systems without an oceanic outlet, flooding during the dry winter season to create an oasis for African biodiversity.',
    source: 'BIOPAMA / Ramsar Wetlands Convention / JRC'
  },

  // --- DEMOGRAPHICS: Megacity Hubs (GHSL Ingested) ---
  {
    id: 'node-lagos',
    name: 'Lagos Metropolitan Megacity',
    category: 'demographics',
    x: 2050,
    y: 2580,
    color: '#7c3aed',
    pulseColor: '#a855f7',
    radius: 42,
    label: 'Lagos Megacity',
    subtitle: 'Commercial Powerhouse',
    type: 'Megacity (Pop: 21.3M)',
    badge: '🏙️ Megacity Hub',
    labelOffset: { x: -260, y: 110 },
    stats: [
      { label: 'Metropolitan Population', value: '21.3 Million' },
      { label: 'GDP Contribution', value: '~$102 Billion (Larger than Kenya)' },
      { label: 'Port Throughput', value: '80% of Nigerian Imports' },
      { label: 'GHSL Growth', value: '+3.4% Annual Expansion' }
    ],
    description: 'Sub-Saharan Africa’s largest urban economy and financial nexus, expanding rapidly with Lekki Deep Sea Port and financial free zones.',
    source: 'Global Human Settlement Layer (GHSL) / UN Habitat'
  },
  {
    id: 'node-cairo',
    name: 'Greater Cairo Metropolitan Area',
    category: 'demographics',
    x: 3850,
    y: 820,
    color: '#6d28d9',
    pulseColor: '#8b5cf6',
    radius: 42,
    label: 'Greater Cairo',
    subtitle: 'Continental Megacity',
    type: 'Megacity (Pop: 22.1M)',
    badge: '🏙️ Megacity Hub',
    labelOffset: { x: 270, y: -70 },
    stats: [
      { label: 'Urban Population', value: '22.1 Million' },
      { label: 'New Administrative Capital', value: '6.5M Planned Capacity' },
      { label: 'Metro Ridership', value: '4.0 Million / Day' },
      { label: 'Built-up Density', value: 'Highest in North Africa' }
    ],
    description: 'The largest metropolitan area in Africa and the Arab world, pioneering smart urban expansion with the New Administrative Capital.',
    source: 'GHSL / World Bank Urban Development Unit'
  },
  {
    id: 'node-joburg',
    name: 'Gauteng Megalopolis (Johannesburg–Pretoria)',
    category: 'demographics',
    x: 3380,
    y: 4720,
    color: '#9333ea',
    pulseColor: '#c084fc',
    radius: 40,
    label: 'Johannesburg–Pretoria',
    subtitle: 'Financial & Industrial Hub',
    type: 'Conurbation (Pop: 16.2M)',
    badge: '🏙️ Megacity Hub',
    labelOffset: { x: -290, y: -50 },
    stats: [
      { label: 'Conurbation Population', value: '16.2 Million' },
      { label: 'Stock Exchange', value: 'JSE (Top 20 Worldwide)' },
      { label: 'Share of SA GDP', value: '35%' },
      { label: 'Urban Mobility', value: 'Gautrain High-Speed Rail' }
    ],
    description: 'Africa’s primary financial capital and corporate command center, anchoring the economic engine of Southern Africa.',
    source: 'GHSL / South Africa Statistics'
  },

  // --- ECONOMIC: Strategic Deepwater Maritime Gateways (AfCFTA Hubs) ---
  {
    id: 'node-tanger-med',
    name: 'Tanger Med Port Complex & Logistics Free Zone',
    category: 'economic',
    x: 1720,
    y: 520,
    color: '#0284c7',
    pulseColor: '#38bdf8',
    radius: 38,
    label: 'Tanger Med Gateway',
    subtitle: 'Global Mediterranean Transshipment',
    type: 'Port Hub (9.0M TEU)',
    badge: '🚢 AfCFTA Gateway',
    labelOffset: { x: -270, y: -80 },
    stats: [
      { label: 'Container Throughput', value: '9.0 Million TEU (2024)' },
      { label: 'Global Rank', value: '#1 in Mediterranean & Africa' },
      { label: 'Industrial Zone', value: '1,200+ Export Companies' },
      { label: 'Automotive Hub', value: 'Renault & Stellantis Mega-plants' }
    ],
    description: 'The leading container port on the African continent and in the Mediterranean basin, directly connecting 180 global ports across 70 countries.',
    source: 'Tanger Med Port Authority / UNCTAD Maritime Review'
  },
  {
    id: 'node-durban',
    name: 'Port of Durban Multimodal Trade Gateway',
    category: 'economic',
    x: 3650,
    y: 4920,
    color: '#0369a1',
    pulseColor: '#38bdf8',
    radius: 36,
    label: 'Port of Durban',
    subtitle: 'Southern African Sea Hub',
    type: 'Container Terminal (3.0M TEU)',
    badge: '🚢 AfCFTA Gateway',
    labelOffset: { x: 270, y: 90 },
    stats: [
      { label: 'Container Capacity', value: '3.0 Million TEU' },
      { label: 'Share of SA Maritime Cargo', value: '60%' },
      { label: 'Corridor Connection', value: 'NATCOR Rail to Gauteng' },
      { label: 'Automotive Exports', value: '500,000+ Vehicles / Year' }
    ],
    description: 'The primary maritime trade gate for South Africa and landlocked neighbors including Botswana, Zimbabwe, and Zambia.',
    source: 'Transnet National Ports Authority / AfCFTA Trade Map'
  }
];

/**
 * Enhanced Indicator Color Ramp Definitions with High Contrast and High Opacity Tints
 */
export interface MetricColorPalette {
  metricId: string;
  name: string;
  category: string;
  stops: [string, string, string, string]; // min, low-mid, high-mid, max
  unit: string;
  opacity: number;
}

export const METRIC_COLOR_PALETTES: Record<string, MetricColorPalette> = {
  // 1. Economic & Governance
  'NY.GDP.MKTP.CD': {
    metricId: 'NY.GDP.MKTP.CD',
    name: 'Nominal GDP',
    category: 'economic',
    stops: ['#082f49', '#0284c7', '#06b6d4', '#38bdf8'],
    unit: 'USD Billion',
    opacity: 0.94
  },
  'NY.GDP.PCAP.CD': {
    metricId: 'NY.GDP.PCAP.CD',
    name: 'GDP per Capita',
    category: 'economic',
    stops: ['#1e1b4b', '#4f46e5', '#818cf8', '#c7d2fe'],
    unit: 'USD',
    opacity: 0.94
  },
  'COMTRADE.EXP.TOTL': {
    metricId: 'COMTRADE.EXP.TOTL',
    name: 'Total Exports',
    category: 'economic',
    stops: ['#083344', '#0891b2', '#22d3ee', '#67e8f9'],
    unit: 'USD Billion',
    opacity: 0.94
  },
  'MO.IIAG.SCORE': {
    metricId: 'MO.IIAG.SCORE',
    name: 'Ibrahim Governance (IIAG)',
    category: 'economic',
    stops: ['#2e1065', '#7e22ce', '#a855f7', '#d8b4fe'],
    unit: 'Score (0-100)',
    opacity: 0.95
  },
  'IEP.GPI.SCORE': {
    metricId: 'IEP.GPI.SCORE',
    name: 'Global Peace Index (GPI)',
    category: 'economic',
    stops: ['#064e3b', '#059669', '#f59e0b', '#dc2626'], // Inverted logic in color evaluation
    unit: 'Score (1-5)',
    opacity: 0.95
  },

  // 2. Energy & Infrastructure
  'EG.ELC.ACCS.ZS': {
    metricId: 'EG.ELC.ACCS.ZS',
    name: 'Electricity Access Rate',
    category: 'energy_infra',
    stops: ['#451a03', '#b45309', '#f59e0b', '#fde047'],
    unit: '% Population',
    opacity: 0.96
  },
  'EG.ELC.RNWX.ZS': {
    metricId: 'EG.ELC.RNWX.ZS',
    name: 'Renewable Energy Share',
    category: 'energy_infra',
    stops: ['#064e3b', '#059669', '#10b981', '#6ee7b7'],
    unit: '% Generation',
    opacity: 0.96
  },
  'AKP.INFRA.BROADBAND': {
    metricId: 'AKP.INFRA.BROADBAND',
    name: 'Broadband Backbone Connectivity',
    category: 'energy_infra',
    stops: ['#172554', '#2563eb', '#3b82f6', '#93c5fd'],
    unit: 'Index (0-100)',
    opacity: 0.95
  },
  'AKP.INFRA.HYDRO_CAP': {
    metricId: 'AKP.INFRA.HYDRO_CAP',
    name: 'Hydropower Potential & Reservoir Storage',
    category: 'energy_infra',
    stops: ['#042f2e', '#0f766e', '#14b8a6', '#5eead4'],
    unit: 'Index (0-100)',
    opacity: 0.95
  },

  // 3. Environment & Biodiversity
  'AKP.ENV.PROTECTED': {
    metricId: 'AKP.ENV.PROTECTED',
    name: 'Protected Areas Coverage',
    category: 'environment',
    stops: ['#052e16', '#166534', '#16a34a', '#86efac'],
    unit: '% Land Area',
    opacity: 0.96
  },
  'AKP.ENV.FOREST_COV': {
    metricId: 'AKP.ENV.FOREST_COV',
    name: 'Forest Canopy & Tree Cover',
    category: 'environment',
    stops: ['#022c22', '#047857', '#10b981', '#a7f3d0'],
    unit: '% Total Land',
    opacity: 0.96
  },
  'AKP.ENV.WATER_OCCUR': {
    metricId: 'AKP.ENV.WATER_OCCUR',
    name: 'Surface Water Occurrence',
    category: 'environment',
    stops: ['#082f49', '#0284c7', '#06b6d4', '#7dd3fc'],
    unit: '% Territory',
    opacity: 0.95
  },
  'AKP.ENV.SOIL_HEALTH': {
    metricId: 'AKP.ENV.SOIL_HEALTH',
    name: 'Soil Organic Carbon Index',
    category: 'environment',
    stops: ['#3b1805', '#92400e', '#d97706', '#fcd34d'],
    unit: 'Index (0-100)',
    opacity: 0.95
  },

  // 4. Agriculture & Food
  'AKP.AGRI.CROP_DIV': {
    metricId: 'AKP.AGRI.CROP_DIV',
    name: 'Crop Diversity & Resilience Score',
    category: 'agriculture',
    stops: ['#1a2e05', '#4d7c0f', '#84cc16', '#bef264'],
    unit: 'Index (0-100)',
    opacity: 0.95
  },
  'AKP.AGRI.DROUGHT_RISK': {
    metricId: 'AKP.AGRI.DROUGHT_RISK',
    name: 'Agricultural Drought Stress (ASIS)',
    category: 'agriculture',
    stops: ['#065f46', '#eab308', '#ea580c', '#b91c1c'],
    unit: 'Stress Index (0-100)',
    opacity: 0.95
  },
  'AKP.AGRI.FOOD_SECURITY': {
    metricId: 'AKP.AGRI.FOOD_SECURITY',
    name: 'Food System Resilience Index',
    category: 'agriculture',
    stops: ['#450a0a', '#b91c1c', '#16a34a', '#4ade80'],
    unit: 'Score (0-100)',
    opacity: 0.95
  },

  // 5. Demographics & Cities
  'SP.POP.TOTL': {
    metricId: 'SP.POP.TOTL',
    name: 'Total Population',
    category: 'demographics',
    stops: ['#022c22', '#0f766e', '#10b981', '#6ee7b7'],
    unit: 'People (Million)',
    opacity: 0.95
  },
  'UNDP.HDI.INDEX': {
    metricId: 'UNDP.HDI.INDEX',
    name: 'Human Development Index (HDI)',
    category: 'demographics',
    stops: ['#1e1b4b', '#4338ca', '#6366f1', '#a5b4fc'],
    unit: 'Index (0-1)',
    opacity: 0.96
  },
  'SP.DYN.LE00.IN': {
    metricId: 'SP.DYN.LE00.IN',
    name: 'Life Expectancy at Birth',
    category: 'demographics',
    stops: ['#3f1200', '#c2410c', '#f97316', '#fed7aa'],
    unit: 'Years',
    opacity: 0.95
  },
  'AKP.DEMO.BUILTUP': {
    metricId: 'AKP.DEMO.BUILTUP',
    name: 'Urban Built-Up Surface Density',
    category: 'demographics',
    stops: ['#2e1065', '#6d28d9', '#8b5cf6', '#ddd6fe'],
    unit: 'm² / capita',
    opacity: 0.96
  },
  'AKP.DEMO.URBAN_ACCESS': {
    metricId: 'AKP.DEMO.URBAN_ACCESS',
    name: 'Travel Proximity to Major Cities',
    category: 'demographics',
    stops: ['#0c4a6e', '#0369a1', '#0ea5e9', '#bae6fd'],
    unit: 'Travel Score (0-100)',
    opacity: 0.95
  }
};

/**
 * Interpolate hex color through 4-stop ramp with exponential emphasis (gamma = 1.35)
 */
export function getMetricChoroplethColor(
  metricId: string,
  normalizedT: number, // 0 to 1
  reverseScale: boolean = false
): { color: string; opacity: number } {
  const palette = METRIC_COLOR_PALETTES[metricId] || METRIC_COLOR_PALETTES['NY.GDP.MKTP.CD'];
  let t = Math.max(0, Math.min(1, normalizedT));

  if (reverseScale) {
    t = 1 - t;
  }

  // Apply contrast gamma curve (t^1.35) so higher values pop with dramatic saturation
  const curvedT = Math.pow(t, 1.35);

  const stops = palette.stops;

  let startHex: string;
  let endHex: string;
  let segT: number;

  if (curvedT <= 0.33) {
    startHex = stops[0];
    endHex = stops[1];
    segT = curvedT / 0.33;
  } else if (curvedT <= 0.66) {
    startHex = stops[1];
    endHex = stops[2];
    segT = (curvedT - 0.33) / 0.33;
  } else {
    startHex = stops[2];
    endHex = stops[3];
    segT = (curvedT - 0.66) / 0.34;
  }

  const c1 = hexToRgb(startHex);
  const c2 = hexToRgb(endHex);

  const r = Math.round(c1.r + (c2.r - c1.r) * segT);
  const g = Math.round(c1.g + (c2.g - c1.g) * segT);
  const b = Math.round(c1.b + (c2.b - c1.b) * segT);

  return {
    color: `rgb(${r}, ${g}, ${b})`,
    opacity: palette.opacity
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}
