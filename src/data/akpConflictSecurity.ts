/**
 * akpConflictSecurity.ts - Conflict, Security & Stability Beacons
 * Native SVG Coordinate Engine: 5796 x 5867
 * Authoritative Sources: ACLED, UCDP (Uppsala Conflict Data Program), IIAG, AU Peace & Security Council, UN Peacekeeping
 */

export type ConflictCategory = 'battle' | 'civilian_violence' | 'remote_strike' | 'resource_dispute';

export interface ConflictBeacon {
  id: string;
  name: string;
  countryIso3: string;
  countryName: string;
  category: ConflictCategory;
  categoryLabel: string;
  intensity: 'critical' | 'high' | 'moderate' | 'monitoring';
  x: number;
  y: number;
  radius: number;
  color: string;
  pulseColor: string;
  eventCount12M: number;
  fatalities12M: number;
  actorsInvolved: string[];
  peaceMission?: string;
  humanitarianImpact: string;
  description: string;
  source: string;
  labelOffset?: { x: number; y: number };
}

export const CONFLICT_CATEGORY_CONFIG: Record<ConflictCategory, { label: string; color: string; pulseColor: string; badge: string }> = {
  battle: {
    label: 'Armed Battles & Clashes',
    color: '#ef4444', // Red
    pulseColor: 'rgba(239, 68, 68, 0.45)',
    badge: '⚔️ Armed Battles'
  },
  civilian_violence: {
    label: 'Violence Against Civilians',
    color: '#f97316', // Orange
    pulseColor: 'rgba(249, 115, 22, 0.45)',
    badge: '🛡️ Civilian Risk'
  },
  remote_strike: {
    label: 'Remote Explosions & Air Operations',
    color: '#a855f7', // Purple
    pulseColor: 'rgba(168, 85, 247, 0.45)',
    badge: '💥 Remote Strikes'
  },
  resource_dispute: {
    label: 'Resource & Pastoral Disputes',
    color: '#eab308', // Amber-Yellow
    pulseColor: 'rgba(234, 179, 8, 0.45)',
    badge: '🌾 Resource Tensions'
  }
};

export const CONFLICT_BEACONS_DATA: ConflictBeacon[] = [
  // 1. SUDAN: Khartoum & Darfur Theater
  {
    id: 'conflict-sudan-khartoum',
    name: 'Khartoum & Omdurman Metropolitan Front',
    countryIso3: 'SDN',
    countryName: 'Sudan',
    category: 'battle',
    categoryLabel: 'Armed Battles & Clashes',
    intensity: 'critical',
    x: 3900,
    y: 1950,
    radius: 46,
    color: '#ef4444',
    pulseColor: 'rgba(239, 68, 68, 0.65)',
    eventCount12M: 1840,
    fatalities12M: 14200,
    actorsInvolved: ['Sudanese Armed Forces (SAF)', 'Rapid Support Forces (RSF)', 'Allied Militias'],
    humanitarianImpact: 'Over 8.5 million displaced; critical urban infrastructure and healthcare collapse.',
    description: 'Intense military confrontations between the SAF and RSF spanning urban Khartoum, heavy artillery engagements, and bridge choke points.',
    source: 'ACLED Conflict Monitor / UN OCHA Sudan Situation Report',
    labelOffset: { x: 300, y: -60 }
  },
  {
    id: 'conflict-sudan-darfur',
    name: 'El Fasher & North Darfur Encirclement',
    countryIso3: 'SDN',
    countryName: 'Sudan',
    category: 'battle',
    categoryLabel: 'Armed Battles & Clashes',
    intensity: 'critical',
    x: 3450,
    y: 1920,
    radius: 42,
    color: '#ef4444',
    pulseColor: 'rgba(239, 68, 68, 0.60)',
    eventCount12M: 920,
    fatalities12M: 6800,
    actorsInvolved: ['RSF', 'Joint Force of Armed Movements', 'SAF', 'Local Defense Groups'],
    humanitarianImpact: 'Severe famine alert (IPC Phase 5); massive IDP camps at Zamzam besieged.',
    description: 'Sustained offensive and encirclement around El Fasher, the last government-held state capital in greater Darfur.',
    source: 'ACLED / Integrated Food Security Phase Classification (IPC)',
    labelOffset: { x: -300, y: -70 }
  },

  // 2. EASTERN DRC: North Kivu & Ituri
  {
    id: 'conflict-drc-kivu',
    name: 'North Kivu (Rutshuru, Masisi & Goma Axis)',
    countryIso3: 'COD',
    countryName: 'DR Congo',
    category: 'battle',
    categoryLabel: 'Armed Battles & Clashes',
    intensity: 'critical',
    x: 3580,
    y: 3120,
    radius: 44,
    color: '#ef4444',
    pulseColor: 'rgba(239, 68, 68, 0.65)',
    eventCount12M: 2150,
    fatalities12M: 5200,
    actorsInvolved: ['M23 (March 23 Movement)', 'FARDC (Congolese Military)', 'Wazalendo Coalition', 'FDLR'],
    peaceMission: 'SAMIDRC (SADC Mission in the DRC) & MONUSCO',
    humanitarianImpact: 'Over 1.7 million internally displaced persons around Goma basin.',
    description: 'High-intensity territorial battles for strategic supply roads (RN2) and mineral transport corridors bordering Lake Kivu and Rwanda.',
    source: 'Kivu Security Tracker / ACLED / UN MONUSCO',
    labelOffset: { x: -310, y: 130 }
  },
  {
    id: 'conflict-drc-ituri',
    name: 'Ituri Gold Basin (Djugu & Irumu)',
    countryIso3: 'COD',
    countryName: 'DR Congo',
    category: 'civilian_violence',
    categoryLabel: 'Violence Against Civilians',
    intensity: 'high',
    x: 3620,
    y: 2820,
    radius: 36,
    color: '#f97316',
    pulseColor: 'rgba(249, 115, 22, 0.55)',
    eventCount12M: 680,
    fatalities12M: 1950,
    actorsInvolved: ['CODECO', 'ADF (Allied Democratic Forces)', 'Zaire Militia', 'FARDC'],
    humanitarianImpact: 'Attacks on artisanal mining communities and agricultural settlements.',
    description: 'Inter-communal militia violence targeting civilian camps and artisanal gold extraction centers.',
    source: 'UN High Commissioner for Human Rights (OHCHR)',
    labelOffset: { x: -300, y: -70 }
  },

  // 3. CENTRAL SAHEL: Liptako-Gourma Tri-Border
  {
    id: 'conflict-sahel-liptako',
    name: 'Liptako-Gourma Tri-Border (Burkina Faso / Mali / Niger)',
    countryIso3: 'BFA',
    countryName: 'Burkina Faso / Mali / Niger',
    category: 'civilian_violence',
    categoryLabel: 'Violence Against Civilians',
    intensity: 'high',
    x: 1550,
    y: 1980,
    radius: 40,
    color: '#f97316',
    pulseColor: 'rgba(249, 115, 22, 0.60)',
    eventCount12M: 1450,
    fatalities12M: 7800,
    actorsInvolved: ['JNIM (Al-Qaeda affiliate)', 'ISGS (Islamic State Sahel Province)', 'AES National Armies', 'VDP Auxiliaries'],
    humanitarianImpact: 'Over 2.2 million displaced in Burkina Faso alone; hundreds of schools closed.',
    description: 'Asymmetric insurgency targeting rural garrisons, civilian supply convoys, and mining infrastructure across the Sahelian core.',
    source: 'Sahel Security Dashboard / ACLED / ISS Africa',
    labelOffset: { x: 300, y: -60 }
  },

  // 4. LAKE CHAD BASIN: Borno & Far North Cameroon
  {
    id: 'conflict-lake-chad',
    name: 'Lake Chad Basin & Sambisa (Borno / Far North Cameroon)',
    countryIso3: 'NGA',
    countryName: 'Nigeria / Cameroon / Chad',
    category: 'remote_strike',
    categoryLabel: 'Remote Explosions & Air Operations',
    intensity: 'high',
    x: 2350,
    y: 2280,
    radius: 38,
    color: '#a855f7',
    pulseColor: 'rgba(168, 85, 247, 0.55)',
    eventCount12M: 840,
    fatalities12M: 2400,
    actorsInvolved: ['ISWAP (Islamic State West Africa)', 'Boko Haram (JAS)', 'MNJTF (Multinational Joint Task Force)'],
    peaceMission: 'MNJTF (Multinational Joint Task Force)',
    humanitarianImpact: 'Disruption of cross-border fish and cattle trade routes; persistent IED hazards.',
    description: 'Ambushes, improvised explosive device (IED) emplacements, and military counter-insurgency air strikes around the islands and shorelines of Lake Chad.',
    source: 'MNJTF Secretariat / Institute for Security Studies',
    labelOffset: { x: 300, y: -60 }
  },

  // 5. SOMALIA: Lower Shabelle & Jubaland
  {
    id: 'conflict-somalia-shabelle',
    name: 'Lower Shabelle & Middle Juba Corridor',
    countryIso3: 'SOM',
    countryName: 'Somalia',
    category: 'remote_strike',
    categoryLabel: 'Remote Explosions & Air Operations',
    intensity: 'high',
    x: 4580,
    y: 2950,
    radius: 36,
    color: '#a855f7',
    pulseColor: 'rgba(168, 85, 247, 0.55)',
    eventCount12M: 780,
    fatalities12M: 2100,
    actorsInvolved: ['Al-Shabaab', 'Somali National Army (SNA)', 'US AFRICOM', 'ATMIS Troops'],
    peaceMission: 'ATMIS (AU Transition Mission in Somalia) / AUSSOM',
    humanitarianImpact: 'Extortion checkpoints along trade roads to Mogadishu; drought-conflict compound risk.',
    description: 'Targeted counter-terror drone strikes, complex VBIED detonations, and offensive operations in agricultural riverine basins.',
    source: 'ACLED / African Union Peace & Security Council',
    labelOffset: { x: 300, y: 70 }
  },

  // 6. MOZAMBIQUE: Cabo Delgado Gas Basin
  {
    id: 'conflict-cabo-delgado',
    name: 'Cabo Delgado (Macomia, Mocímboa da Praia & Palma)',
    countryIso3: 'MOZ',
    countryName: 'Mozambique',
    category: 'battle',
    categoryLabel: 'Armed Battles & Clashes',
    intensity: 'moderate',
    x: 4120,
    y: 4050,
    radius: 34,
    color: '#ef4444',
    pulseColor: 'rgba(239, 68, 68, 0.50)',
    eventCount12M: 320,
    fatalities12M: 650,
    actorsInvolved: ['Ahlu Sunna Wal Jammah (IS-Mozambique)', 'FADM (Mozambique Military)', 'Rwanda Security Forces (RSF)'],
    humanitarianImpact: 'Delayed commissioning of offshore LNG mega-trains (TotalEnergies / ExxonMobil); over 700k IDPs.',
    description: 'Insurgent raids along the coastal road network and forest redoubts threatening energy infrastructure zones.',
    source: 'Cabo Ligado Conflict Observatory / ACLED',
    labelOffset: { x: 300, y: -50 }
  },

  // 7. NIGERIA MIDDLE BELT: Benue & Plateau Pastoral Disputes
  {
    id: 'conflict-nigeria-middlebelt',
    name: 'Middle Belt Agro-Pastoral Corridor (Benue & Plateau)',
    countryIso3: 'NGA',
    countryName: 'Nigeria',
    category: 'resource_dispute',
    categoryLabel: 'Resource & Pastoral Disputes',
    intensity: 'moderate',
    x: 2120,
    y: 2480,
    radius: 32,
    color: '#eab308',
    pulseColor: 'rgba(234, 179, 8, 0.50)',
    eventCount12M: 410,
    fatalities12M: 1350,
    actorsInvolved: ['Pastoralist Militia Groups', 'Farming Community Defense Vigilantes', 'Nigerian Police'],
    humanitarianImpact: 'Crop harvest destruction and disruption of the national food basket.',
    description: 'Resource competition between semi-nomadic pastoralists and sedentary agriculturalists exacerbated by grazing reserve depletion and climate shifts.',
    source: 'Nigeria Security Tracker / SBM Intelligence',
    labelOffset: { x: 300, y: 60 }
  },

  // 8. SOUTH SUDAN: Jonglei & Unity State
  {
    id: 'conflict-south-sudan-jonglei',
    name: 'Greater Jonglei & Pibor Wetlands',
    countryIso3: 'SSD',
    countryName: 'South Sudan',
    category: 'resource_dispute',
    categoryLabel: 'Resource & Pastoral Disputes',
    intensity: 'moderate',
    x: 3750,
    y: 2680,
    radius: 32,
    color: '#eab308',
    pulseColor: 'rgba(234, 179, 8, 0.50)',
    eventCount12M: 290,
    fatalities12M: 880,
    actorsInvolved: ['White Army Youth Militias', 'Murle Armed Groups', 'SSPDF Command'],
    peaceMission: 'UNMISS (UN Mission in South Sudan)',
    humanitarianImpact: 'Seasonal cattle-raiding surges and revenge displacement during dry season migration.',
    description: 'Cyclical inter-communal raiding, youth mobilization, and access disputes over flood-receded grazing pastures.',
    source: 'UNMISS Human Rights Division / Small Arms Survey',
    labelOffset: { x: -300, y: 70 }
  }
];
