export interface DynasticNode {
  id: string;
  name: string;
  title: string;
  reign: string;
  century: number;
  type: 'monarch' | 'queen_mother' | 'constitutional_milestone' | 'co_ruler';
  feat: string;
  predecessorId?: string;
  constitutionalImpact?: string;
  regalia?: string;
}

export interface Artifact3DRecord {
  id: string;
  title: string;
  nativeTitle: string;
  period: string;
  material: 'cast_bronze' | 'hammered_gold' | 'granite_stone' | 'illuminated_parchment' | 'carved_ivory' | 'terracotta' | 'kente_silk';
  dimensions: string;
  provenance: string;
  currentLocation: string;
  description: string;
  materialDetails: string;
  historicalSignificance: string;
  shaderType: 'bronze_patina' | 'gold_specular' | 'granite_grain' | 'aged_manuscript' | 'ivory_sheen';
  accentColor: string;
}

export interface TradeCorridorPath {
  id: string;
  name: string;
  commodity: 'gold' | 'salt' | 'cowries' | 'textiles' | 'kola' | 'copper' | 'ivory';
  color: string;
  startName: string;
  endName: string;
  points: [number, number][]; // SVG map coordinates in native 5796x5867 space
  flowDirection: 'north' | 'south' | 'east' | 'west' | 'bidirectional';
  volumeDescription: string;
  activeCenturies: number[];
  kingdomId?: string;
  kingdomName?: string;
  transportMode?: 'maritime_dhow' | 'camel_caravan' | 'riverine_flotilla' | 'cavalry_corridor' | 'forest_porters';
  historicalPeriod?: string;
  keyStops?: { name: string; role: string; modernCountry?: string }[];
  economicSignificance?: string;
  historicalQuote?: { text: string; author: string; source: string; year?: string };
  cargoTypes?: string[];
  modernLegacy?: string;
}

export interface ToponymConcordanceItem {
  antiqueName: string;
  plateSource: string;
  indigenousName: string;
  modernName: string;
  modernCountry: string;
  category: 'polity' | 'metropolis' | 'river' | 'coast' | 'mountain';
  coordinates: [number, number];
  svgCoordinates: [number, number];
  note: string;
}

export interface ModernEconomicBridge {
  historicalCommodity: string;
  modernEquivalentSector: string;
  modernValueMetric: string;
  modernKeyCountries: { iso3: string; name: string; shareOfGlobalMarket?: string }[];
  heritagePreservationStatus: string;
}

export interface RulerProfile {
  name: string;
  reign: string;
  feat: string;
}

export interface ScholarlyPublication {
  title: string;
  author: string;
  year: number;
  publisher: string;
  doiOrUrl?: string;
}

export interface KingdomDetailedRecord {
  id: string;
  name: string;
  nativeName: string;
  period: string;
  peakCentury: string;
  peakYear: number;
  region: string;
  regionBadge: string;
  color: string;
  capital: string;
  coordinates: [number, number];
  svgCoordinates: [number, number];
  territoryPolygonPath: string; // SVG path data in 5796x5867 coordinates
  modernCountries: string[];
  modernIso3Codes: string[];
  royalTitle: string;
  dynasty: string;
  indigenousScript: {
    scriptName: string;
    nativeCharacters: string;
    phoneticSpelling: string;
    historicalUsage: string;
  };
  foundingNarrative: string;
  famousRulers: RulerProfile[];
  dynasticTree: DynasticNode[];
  artifacts3D: Artifact3DRecord[];
  governanceSystem: string;
  stateCouncil: string;
  militaryStructure: string;
  currencySystem: string;
  majorCommodities: string[];
  tradeRoutes: string[];
  tradeCorridorPaths: TradeCorridorPath[];
  architecturalMonuments: string[];
  metallurgyAndArts: string[];
  unescoHeritageSites?: string[];
  historicalQuote?: {
    text: string;
    author: string;
    source: string;
    year?: string;
  };
  scholarlyPublications: ScholarlyPublication[];
  wikipediaUrl: string;
  summaryNarrative: string;
  economicBridge: ModernEconomicBridge;
}

export const DETAILED_KINGDOMS_DATA: Record<string, KingdomDetailedRecord> = {
  'kongo-kingdom': {
    id: 'kongo-kingdom',
    name: "Kingdom of Kongo",
    nativeName: "Kongo dya Ntotila",
    period: "c. 1390 – 1914 CE",
    peakCentury: "15th–17th Century",
    peakYear: 1550,
    region: "Central Africa",
    regionBadge: "Central Africa",
    color: "#9333ea",
    capital: "M'banza-Kongo (São Salvador)",
    coordinates: [-6.267, 14.242],
    svgCoordinates: [2950, 3520],
    territoryPolygonPath: "M 2650,3200 Q 2950,3050 3300,3250 T 3450,3700 Q 3200,4000 2800,3900 T 2550,3500 Z",
    modernCountries: ["Angola", "Democratic Republic of the Congo", "Republic of the Congo", "Gabon"],
    modernIso3Codes: ["AGO", "COD", "COG", "GAB"],
    royalTitle: "Manikongo (Mwene Kongo)",
    dynasty: "Kilukeni & Nimi Dynastic Houses",
    indigenousScript: {
      scriptName: "Kikongo Royal Epigraphy & Latin Correspondence",
      nativeCharacters: "Ntinu a Kongo / Lukeni",
      phoneticSpelling: "mah-nee-KOHN-goh",
      historicalUsage: "Official royal chancellery correspondence preserved in Portuguese and Latin archives, combined with oral Kikongo drum and horn heraldry."
    },
    foundingNarrative: "Founded around 1390 by Lukeni lua Nimi through the confederated alliance of the Mpemba Kasi and Mbata dynasties along the lower Congo River basin.",
    famousRulers: [
      { name: "Lukeni lua Nimi", reign: "c. 1390 – 1420", feat: "Founder and first Manikongo who established the royal citadel at M'banza-Kongo." },
      { name: "Nzinga a Nkuwu (João I)", reign: "c. 1470 – 1506", feat: "Welcomed the first Portuguese maritime mission under Diogo Cão in 1482." },
      { name: "Afonso I (Mvemba a Nzinga)", reign: "1506 – 1543", feat: "Celebrated sovereign who expanded education, established a modern chancellery, and conducted high-level diplomacy with the Vatican." },
      { name: "Dona Beatriz Kimpa Vita", reign: "1684 – 1706", feat: "Visionary religious and political reformer who organized the Antonian movement to restore kingdom unity." }
    ],
    dynasticTree: [
      { id: 'kongo-1', name: 'Lukeni lua Nimi', title: 'Manikongo (Founder)', reign: 'c. 1390–1420', century: 14, type: 'monarch', feat: 'Unification of Mpemba Kasi & Mbata' },
      { id: 'kongo-2', name: 'Nzinga a Nkuwu', title: 'Manikongo (João I)', reign: '1470–1506', century: 15, type: 'monarch', predecessorId: 'kongo-1', feat: 'First European diplomatic exchange (1482)' },
      { id: 'kongo-3', name: 'Afonso I (Mvemba a Nzinga)', title: 'Manikongo', reign: '1506–1543', century: 16, type: 'monarch', predecessorId: 'kongo-2', feat: 'Royal chancellery & diplomatic letters' },
      { id: 'kongo-4', name: 'Electoral Council Reform', title: 'Constitutional Milestone', reign: '1570', century: 16, type: 'constitutional_milestone', predecessorId: 'kongo-3', feat: 'Institutionalization of the 12-member Royal Electorate' },
      { id: 'kongo-5', name: 'Dona Beatriz Kimpa Vita', title: 'Antonian Prophetess & Reformer', reign: '1684–1706', century: 17, type: 'queen_mother', predecessorId: 'kongo-4', feat: 'National unification movement' }
    ],
    artifacts3D: [
      {
        id: 'kongo-crucifix',
        title: "Nkangi Kiditu (Cast Brass Triple Crucifix)",
        nativeTitle: "Nkangi Kiditu",
        period: "16th – 17th Century",
        material: "cast_bronze",
        dimensions: "28.5 cm × 18.2 cm × 2.4 cm",
        provenance: "M'banza-Kongo Royal Chancellery",
        currentLocation: "National Museum of African Art / Royal Museum for Central Africa",
        description: "An authentic Afro-Christian masterwork combining Kongolese ancestral iconography with Christian motifs, cast in solid brass with attendant prayer figures.",
        materialDetails: "Lost-wax cast leaded bronze with dark greenish-gold patina and geometric hand-stippled incisions.",
        historicalSignificance: "Demonstrates Kongolese sovereign adaptation of Christian symbology into their own cosmological framework without colonial subjugation.",
        shaderType: "bronze_patina",
        accentColor: "#a855f7"
      },
      {
        id: 'kongo-raffia-velvet',
        title: "Kasai-Kongo Geometric Cut-Pile Raffia Textile",
        nativeTitle: "Lubongo / Mbadi",
        period: "17th Century",
        material: "kente_silk",
        dimensions: "64 cm × 58 cm",
        provenance: "Soyo Province",
        currentLocation: "Museum of Ethnography, Geneva",
        description: "Intricately woven velvet-pile raffia cloth with repeating labyrinthine rhomboid patterns, serving as both royal status regalia and high-denomination currency.",
        materialDetails: "Hand-carded and dyed natural palm-leaf raffia fiber with raised cut-pile velvet knotting.",
        historicalSignificance: "Regarded across Renaissance Europe as equal to Italian silk velvets in precision and craftsmanship.",
        shaderType: "aged_manuscript",
        accentColor: "#eab308"
      }
    ],
    governanceSystem: "Centralized constitutional monarchy governed by six core provinces (Mpangu, Mbata, Mbamba, Soyo, Nsundi, Mpemba) with appointed governors and hereditary councils.",
    stateCouncil: "The Royal Electoral Council of Twelve Elders comprising hereditary nobles and provincial governors who vetted and elected the Manikongo.",
    militaryStructure: "Permanent royal bodyguard regiment (Lokole) backed by provincial archer contingents and heavy shield infantry armed with iron-tipped spears (Mpanzu).",
    currencySystem: "Nzimbu shell currency gathered at Luanda Island (Ilha de Luanda), graded raffia cloth bolts (Lubongo), and copper ingots.",
    majorCommodities: ["Raffia textiles", "Copper ingots", "Ivory carvings", "High-grade iron smelting", "Salt"],
    tradeRoutes: ["Lower Congo River transport", "Soyo coastal port", "Malebo Pool regional trade network", "Kwilu-Kwanza copper route"],
    tradeCorridorPaths: [
      {
        id: 'kongo-luanda-route',
        name: "Luanda Nzimbu Shell Currency & Raffia Maritime Conduit",
        commodity: 'cowries',
        color: '#a855f7',
        startName: "Luanda Island Shell Fisheries",
        endName: "M'banza-Kongo Imperial Capital",
        points: [[2820, 3750], [2880, 3630], [2950, 3520]],
        flowDirection: 'north',
        volumeDescription: "Annual extraction of over 20 million Nzimbu shells circulating across Central Africa as official legal tender.",
        activeCenturies: [14, 15, 16, 17, 18],
        kingdomId: 'kongo-kingdom',
        kingdomName: "Kingdom of Kongo",
        transportMode: 'maritime_dhow',
        historicalPeriod: "14th – 18th Century CE",
        cargoTypes: ["Nzimbu cowries", "Palm raffia cloth", "Salt slabs", "Dried marine fish"],
        keyStops: [
          { name: "Ilha de Luanda", role: "Royal shell fisheries & currency harvest", modernCountry: "Angola" },
          { name: "Ambriz River Littoral", role: "Coastal caravanserai & salt drying station", modernCountry: "Angola" },
          { name: "M'banza-Kongo", role: "Imperial Chancellery & Treasury", modernCountry: "Angola" }
        ],
        economicSignificance: "Extracted over 20 million Nzimbu shell currency units annually, which functioned as the universal legal tender across Central and West-Central Africa.",
        historicalQuote: {
          text: "The money which current in this country is a kind of little shell... they are fished at the island of Luanda and are the King's own monopoly.",
          author: "Duarte Lopes & Filippo Pigafetta",
          source: "Relatione del Reame di Congo",
          year: "1591"
        },
        modernLegacy: "Precursor to modern Angolan Atlantic port infrastructure and Luanda's financial prominence."
      },
      {
        id: 'kongo-malebo-copper',
        name: "Mindouli Copper & Soyo Atlantic Fluvial Conduit",
        commodity: 'copper',
        color: '#f97316',
        startName: "Mindouli Copper Mines",
        endName: "Soyo Atlantic Port",
        points: [[3000, 3320], [3060, 3380], [2950, 3520], [2810, 3470]],
        flowDirection: 'west',
        volumeDescription: "High-purity forged copper bars and raffia velvets traded for Atlantic prestige wares.",
        activeCenturies: [14, 15, 16, 17],
        kingdomId: 'kongo-kingdom',
        kingdomName: "Kingdom of Kongo",
        transportMode: 'riverine_flotilla',
        historicalPeriod: "14th – 17th Century CE",
        cargoTypes: ["High-purity copper ingots", "Ivory tusks", "Lubongo raffia velvet", "Iron blades"],
        keyStops: [
          { name: "Mindouli Mines", role: "High-grade copper extraction & smelting", modernCountry: "Republic of the Congo" },
          { name: "Malebo Pool", role: "Inland river trading emporium & flotilla terminus", modernCountry: "DR Congo" },
          { name: "M'banza-Kongo", role: "Royal inspection & tax collection", modernCountry: "Angola" },
          { name: "Port of Soyo", role: "Atlantic deepwater maritime outlet", modernCountry: "Angola" }
        ],
        economicSignificance: "Linked the rich copper deposits of the Niari basin with the Congo River waterway and Atlantic maritime commerce.",
        modernLegacy: "Precursor to the modern Central African Copperbelt transport corridors."
      }
    ],
    architecturalMonuments: [
      "Royal Compound of M'banza-Kongo",
      "Cathedral of the Holy Saviour of Congo (São Salvador, constructed 1548 — oldest cathedral in sub-Saharan Africa)",
      "Terraced granite stone enclosures of the Mbata plateau"
    ],
    metallurgyAndArts: [
      "Geometric raffia velvet pile weaving (Lubongo)",
      "Cast bronze and brass devotional crucifixes (Nkangi Kiditu)",
      "Carved ivory ceremonial horns (Mpungi)",
      "Power figures and protective reliquaries (Nkisi Nkondi)"
    ],
    unescoHeritageSites: ["M'banza Kongo, Vestiges of the Capital of the former Kingdom of Kongo (UNESCO World Heritage Site, 2017)"],
    historicalQuote: {
      text: "The city of São Salvador is situated on a high and pleasant mountain, well cultivated with groves of palm and fruit trees, having wholesome springs of sweet water.",
      author: "Filippo Pigafetta & Duarte Lopes",
      source: "Report of the Kingdom of Congo",
      year: "1591"
    },
    scholarlyPublications: [
      { title: "The Kingdom of Kongo: Civil War and Transition 1641-1718", author: "John K. Thornton", year: 1983, publisher: "University of Wisconsin Press" },
      { title: "The Kongolese Saint Anthony: Dona Beatriz Kimpa Vita and the Antonian Movement", author: "John K. Thornton", year: 1998, publisher: "Cambridge University Press" },
      { title: "Kingdoms of the Savanna", author: "Jan Vansina", year: 1966, publisher: "University of Wisconsin Press" }
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Kingdom_of_Kongo",
    summaryNarrative: "The Kingdom of Kongo was one of the most organized and centralized sovereign polities in pre-colonial Central Africa. Governing over 500,000 subjects across modern Angola, the DRC, and Republic of the Congo, it maintained independent diplomatic and scholastic embassies to Lisbon, Madrid, and the Holy See throughout the 16th and 17th centuries.",
    economicBridge: {
      historicalCommodity: "Raffia textiles, Mindouli copper ingots & nzimbu shell standard",
      modernEquivalentSector: "Central African Copperbelt & Strategic Mineral Infrastructure",
      modernValueMetric: "DRC & Angola hold over 68% of global cobalt reserves and major copper reserves valued at over $120B annually.",
      modernKeyCountries: [
        { iso3: "COD", name: "DR Congo", shareOfGlobalMarket: "70% of Cobalt, top 3 in Copper" },
        { iso3: "AGO", name: "Angola", shareOfGlobalMarket: "Major petroleum & diamond producer" }
      ],
      heritagePreservationStatus: "M'banza Kongo UNESCO preservation and digital 3D archaeological LiDAR mapping ongoing."
    }
  },

  'oyo-empire': {
    id: 'oyo-empire',
    name: "Oyo Empire",
    nativeName: "Ilẹ̀ Ọba Ọ̀yọ́",
    period: "c. 1300 – 1896 CE",
    peakCentury: "17th–18th Century",
    peakYear: 1750,
    region: "Western Africa",
    regionBadge: "Western Africa",
    color: "#16a34a",
    capital: "Oyo-Ile (Katunga / Old Oyo)",
    coordinates: [8.983, 4.317],
    svgCoordinates: [2280, 2380],
    territoryPolygonPath: "M 2050,2180 Q 2350,2100 2550,2250 T 2600,2650 Q 2350,2700 2100,2600 T 2050,2180 Z",
    modernCountries: ["Nigeria", "Benin", "Togo"],
    modernIso3Codes: ["NGA", "BEN", "TGO"],
    royalTitle: "Alaafin of Oyo ('Owner of the Palace / Lord of the Realm')",
    dynasty: "Oranyan Dynasty (Oduduwa Royal Lineage)",
    indigenousScript: {
      scriptName: "Yoruba Royal Heraldry & Drum Language (Ayan)",
      nativeCharacters: "Aláàfin Ọ̀yọ́ / Ọ̀rànmíyàn",
      phoneticSpelling: "ah-lah-ah-FEEN of AW-yoh",
      historicalUsage: "Gbedu royal sacred drum communication, beaded crown epigraphy (Ade), and Arokin royal court historian oral records."
    },
    foundingNarrative: "Established around 1300 by Prince Oranyan of Ile-Ife, positioning the capital in the northern savanna to develop a peerless cavalry army.",
    famousRulers: [
      { name: "Oranyan", reign: "c. 1300", feat: "Legendary founder of Oyo-Ile and progenitor of the imperial dynastic lineage." },
      { name: "Alaafin Orompoto", reign: "c. 1554 – 1562", feat: "Celebrated female warrior-monarch who pioneered the creation of the invincible Oyo cavalry corps." },
      { name: "Alaafin Abiodun", reign: "1774 – 1789", feat: "Presided over the golden age of commerce and diplomatic pacification across West Africa." }
    ],
    dynasticTree: [
      { id: 'oyo-1', name: 'Oranyan', title: 'Founding Alaafin', reign: 'c. 1300', century: 14, type: 'monarch', feat: 'Foundation of Oyo-Ile capital' },
      { id: 'oyo-2', name: 'Alaafin Orompoto', title: 'Empress & Supreme Commander', reign: '1554–1562', century: 16, type: 'queen_mother', predecessorId: 'oyo-1', feat: 'Creation of the 30,000-horse Cavalry Corps' },
      { id: 'oyo-3', name: 'Oyo Mesi Separation of Powers', title: 'Constitutional Milestone', reign: '1600', century: 16, type: 'constitutional_milestone', predecessorId: 'oyo-2', feat: 'Bashorun Prime Minister veto power established' },
      { id: 'oyo-4', name: 'Alaafin Abiodun', title: 'Alaafin (Golden Age)', reign: '1774–1789', century: 18, type: 'monarch', predecessorId: 'oyo-3', feat: 'Commercial zenith & trans-regional treaties' }
    ],
    artifacts3D: [
      {
        id: 'oyo-beaded-crown',
        title: "Ade Nla (Sacred Beaded Royal Crown with Veil)",
        nativeTitle: "Adé Ńlá Aláàfin",
        period: "18th Century",
        material: "kente_silk",
        dimensions: "92 cm height × 26 cm diameter",
        provenance: "Afin Oyo (Old Oyo Palace)",
        currentLocation: "National Museum Lagos / Palace Archives",
        description: "High conical sacred crown covered in thousands of tiny glass seed beads with projecting beaded birds and a long fringe veil concealing the monarch's divine countenance.",
        materialDetails: "Woven palm-rib armature layered with starched cotton and micro-bead embroidery featuring ancestral chameleon and bird motifs.",
        historicalSignificance: "Embodied the direct spiritual presence of Oduduwa; only monarchs with validated dynastic lineage were permitted to wear it.",
        shaderType: "aged_manuscript",
        accentColor: "#16a34a"
      },
      {
        id: 'oyo-shango-wand',
        title: "Oshe Shango (Ceremonial Thunder Deity Wand)",
        nativeTitle: "Ọṣẹ Ṣàngó",
        period: "18th Century",
        material: "cast_bronze",
        dimensions: "44 cm × 14 cm × 8 cm",
        provenance: "Koso Ancestral Shrine",
        currentLocation: "British Museum / Ethnologisches Museum Berlin",
        description: "Carved hardwood and brass wand surmounted by a double-axe (Edun Ara) motif representing the lightning and royal thunder of Alaafin Shango.",
        materialDetails: "Dense Iroko wood carving with brass plate bindings and palm oil polish.",
        historicalSignificance: "Symbolized divine judicial authority and lightning power wielded by the Alaafin's judicial priests.",
        shaderType: "bronze_patina",
        accentColor: "#dc2626"
      }
    ],
    governanceSystem: "Constitutional monarchy with an extraordinary system of checks and balances between the Alaafin (executive), the Oyo Mesi (nobility council), and the Ogboni (judicial priesthood).",
    stateCouncil: "The Oyo Mesi (Council of Seven Kingmakers led by the Bashorun / Prime Minister) with constitutional power to depose autocratic monarchs.",
    militaryStructure: "Elite cavalry army (Eso Ikoyi) commanding over 30,000 horsemen in the northern savannas, backed by disciplined archers and spearmen.",
    currencySystem: "Cowrie shells (Cyprea moneta) measured in standardized heads and bags (Apo), iron currencies, and woven Aso-Oke textiles.",
    majorCommodities: ["Horses from the Sahara", "Woven Aso-Oke cotton & silk", "Brass regalia", "Iron weaponry", "Kola nuts"],
    tradeRoutes: ["Trans-Saharan Nupe/Hausa route", "Atlantic coastal trade through Porto-Novo and Badagry", "Niger River transit at Jebba"],
    tradeCorridorPaths: [
      {
        id: 'oyo-cavalry-route',
        name: "Savanna Cavalry Horse & Leather Highway",
        commodity: 'textiles',
        color: '#16a34a',
        startName: "Hausaland & Nupe Markets",
        endName: "Oyo-Ile Imperial Capital",
        points: [[2550, 2120], [2400, 2260], [2280, 2380]],
        flowDirection: 'south',
        volumeDescription: "Import of thousands of northern Barbary cavalry war horses exchanged for southern forest kola nuts and dyed indigo textiles.",
        activeCenturies: [15, 16, 17, 18],
        kingdomId: 'oyo-empire',
        kingdomName: "Oyo Empire",
        transportMode: 'cavalry_corridor',
        historicalPeriod: "15th – 18th Century CE",
        cargoTypes: ["Barbary war horses", "Tanned red leather", "Sahara rock salt", "Sahelian brass"],
        keyStops: [
          { name: "Kano Kurmi Market", role: "Trans-Saharan horse and leather exchange", modernCountry: "Nigeria" },
          { name: "Jebba Niger Crossing", role: "Strategic river ford and Nupe frontier", modernCountry: "Nigeria" },
          { name: "Oyo-Ile (Old Oyo)", role: "Imperial military headquarters of the Eso Ikoyi cavalry", modernCountry: "Nigeria" }
        ],
        economicSignificance: "Supplied the 30,000-strong cavalry corps of the Oyo Empire that maintained imperial hegemony over the West African savanna.",
        modernLegacy: "Precursor to the modern Lagos-Ibadan-Kano trade and rail corridor."
      },
      {
        id: 'oyo-coast-route',
        name: "Oyo Coastal Export Highway to Badagry & Porto-Novo",
        commodity: 'kola',
        color: '#ca8a04',
        startName: "Oyo-Ile Imperial Capital",
        endName: "Atlantic Ports (Badagry & Whydah)",
        points: [[2280, 2380], [2250, 2490], [2200, 2600]],
        flowDirection: 'south',
        volumeDescription: "Mass transit of agricultural surplus, woven Aso-Oke cloth, and regional manufactures.",
        activeCenturies: [16, 17, 18, 19],
        kingdomId: 'oyo-empire',
        kingdomName: "Oyo Empire",
        transportMode: 'forest_porters',
        historicalPeriod: "16th – 19th Century CE",
        cargoTypes: ["Aso-Oke woven textiles", "Kola nuts", "Palm oil", "European trade wares"],
        keyStops: [
          { name: "Oyo-Ile", role: "Imperial chancellery and textile guild workshops", modernCountry: "Nigeria" },
          { name: "Abeokuta & Ibadan Corridor", role: "Forest caravan transit & toll collection", modernCountry: "Nigeria" },
          { name: "Port of Badagry", role: "Atlantic export lodge and customs house", modernCountry: "Nigeria" }
        ],
        economicSignificance: "Enabled Oyo to control both northern savanna cavalry corridors and southern Atlantic maritime trading outlets.",
        modernLegacy: "The primary high-density commercial backbone connecting Lagos and the Nigerian hinterland."
      }
    ],
    architecturalMonuments: ["Royal Palace Compound of Oyo-Ile (250+ hectares)", "Great Defensive Earthen Walls of Old Oyo", "Koso and Bara imperial ancestral shrines"],
    metallurgyAndArts: ["Lost-wax cast bronze bells & crowns", "Wood-carved palace veranda posts (Olowe of Ise school)", "Aso-Oke strip-loom textiles", "Ade beaded crowns"],
    unescoHeritageSites: ["Old Oyo National Park & Ruins (Tentative List)"],
    historicalQuote: {
      text: "The King of Oyo is the most powerful sovereign in this part of Africa; his cavalry is celebrated and feared throughout all the neighboring kingdoms.",
      author: "Hugh Clapperton & Richard Lander",
      source: "Journal of a Second Expedition into the Interior of Africa",
      year: "1829"
    },
    scholarlyPublications: [
      { title: "The Oyo Empire c. 1600–c. 1836", author: "Robin Law", year: 1977, publisher: "Oxford University Press" },
      { title: "The History of the Yorubas", author: "Samuel Johnson", year: 1921, publisher: "Routledge" },
      { title: "A History of Nigeria", author: "Toyin Falola", year: 2008, publisher: "Cambridge University Press" }
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Oyo_Empire",
    summaryNarrative: "The Oyo Empire was the dominant Yoruba imperial power in West Africa from the 17th through late 18th century. Renowned for its institutionalized separation of powers and formidable cavalry army, it asserted hegemony over Dahomey and the coastal kingdoms, fostering a vast commercial sphere from the Niger River to the Atlantic.",
    economicBridge: {
      historicalCommodity: "Textiles (Aso-Oke), cavalry breeding & agricultural trade",
      modernEquivalentSector: "Nigerian Commercial Hubs & West African Agribusiness",
      modernValueMetric: "Southwestern Nigeria (Lagos/Oyo) accounts for over $140B in commercial activity and Africa's largest creative economy.",
      modernKeyCountries: [
        { iso3: "NGA", name: "Nigeria", shareOfGlobalMarket: "Largest economy in West Africa, leading film/textile hub" },
        { iso3: "BEN", name: "Benin", shareOfGlobalMarket: "Top regional cotton exporter" }
      ],
      heritagePreservationStatus: "Old Oyo National Park eco-archaeology and Ile-Ife art conservation."
    }
  },

  'benin-kingdom': {
    id: 'benin-kingdom',
    name: "Kingdom of Benin",
    nativeName: "Ẹ̀dó / Ìbínú",
    period: "c. 1180 – 1897 CE",
    peakCentury: "15th–17th Century",
    peakYear: 1500,
    region: "Western Africa",
    regionBadge: "Western Africa",
    color: "#e11d48",
    capital: "Edo (Benin City)",
    coordinates: [6.335, 5.603],
    svgCoordinates: [2360, 2520],
    territoryPolygonPath: "M 2240,2400 Q 2480,2380 2580,2500 T 2520,2720 Q 2350,2760 2200,2650 T 2240,2400 Z",
    modernCountries: ["Nigeria"],
    modernIso3Codes: ["NGA"],
    royalTitle: "Oba of Benin & Iyoba (Queen Mother)",
    dynasty: "Eweka Dynastic Lineage",
    indigenousScript: {
      scriptName: "Edo Visual Glyphs & Lost-Wax Commemorative Reliefs",
      nativeCharacters: "Ọba n'Ẹdó / Ìyọ́ba Ìdíà",
      phoneticSpelling: "OH-bah of beh-NEEN",
      historicalUsage: "Cast bronze palace plaques recording historical battles, dynastic treaties, and celestial court rituals with complete precision."
    },
    foundingNarrative: "Reorganized around 1180 CE under Prince Oranmiyan and King Eweka I, transitioning from the ancient Ogiso era into a monumental urban civilization.",
    famousRulers: [
      { name: "Ewuare I (The Great)", reign: "1440 – 1473", feat: "Constructed the 16,000 km Great Wall of Benin (Iya) and institutionalized royal artisan guilds." },
      { name: "Ozolua (The Conqueror)", reign: "1481 – 1504", feat: "Expanded borders westward and established first Portuguese diplomatic ties." },
      { name: "Esigie", reign: "1504 – 1550", feat: "Created the office of Iyoba for Queen Idia; fostered metallurgical golden age." },
      { name: "Queen Idia", reign: "c. 1504 – 1540", feat: "Formidable Queen Mother, military strategist, and patron of exquisite ivory and bronze arts." }
    ],
    dynasticTree: [
      { id: 'benin-1', name: 'Eweka I', title: 'First Oba of Eweka Dynasty', reign: 'c. 1180–1246', century: 12, type: 'monarch', feat: 'Foundation of modern Edo royal line' },
      { id: 'benin-2', name: 'Ewuare the Great', title: 'Oba & Urban Visionary', reign: '1440–1473', century: 15, type: 'monarch', predecessorId: 'benin-1', feat: 'Construction of the 16,000km Great Walls of Benin' },
      { id: 'benin-3', name: 'Queen Idia', title: 'First Iyoba (Queen Mother)', reign: '1504–1540', century: 16, type: 'queen_mother', predecessorId: 'benin-2', feat: 'Idah War victory & diplomatic innovation' },
      { id: 'benin-4', name: 'Oba Esigie', title: 'Oba (Artistic Golden Age)', reign: '1504–1550', century: 16, type: 'monarch', predecessorId: 'benin-3', feat: 'Commission of the master Benin Bronzes' }
    ],
    artifacts3D: [
      {
        id: 'benin-idia-mask',
        title: "Queen Mother Idia Commemorative Ivory Pendant Mask",
        nativeTitle: "Uhunmwun Elao n'Iyoba Idia",
        period: "Early 16th Century (c. 1520)",
        material: "carved_ivory",
        dimensions: "24.5 cm × 12.5 cm × 6.0 cm",
        provenance: "Royal Court of Oba Esigie, Benin City",
        currentLocation: "British Museum / Metropolitan Museum of Art",
        description: "Masterwork of global portraiture featuring Queen Mother Idia wearing a tiara adorned with carved Portuguese heads and mudfish, symbolizing maritime diplomacy and divine power.",
        materialDetails: "Hand-carved solid African elephant ivory inlaid with iron wire pupillary details and coral beadwork accents.",
        historicalSignificance: "Chosen as the official emblem of the Second World Black and African Festival of Arts and Culture (FESTAC '77).",
        shaderType: "ivory_sheen",
        accentColor: "#e11d48"
      },
      {
        id: 'benin-equestrian-bronze',
        title: "Equestrian Oba Bronze Palace Relief Plaque",
        nativeTitle: "Ama (Cast Bronze Plaque)",
        period: "16th Century",
        material: "cast_bronze",
        dimensions: "49.5 cm × 38.0 cm × 9.5 cm",
        provenance: "Pillars of the Royal Palace of the Oba",
        currentLocation: "Edo Museum of West African Art / Humboldt Forum Berlin",
        description: "High-relief lost-wax cast brass plaque depicting the Oba on horseback in full ceremonial armor, flanked by royal umbrella bearers and court dignitaries.",
        materialDetails: "High-copper quaternary alloy (copper, zinc, lead, tin) with intricate background quatrefoil river-leaf stippling.",
        historicalSignificance: "Showcases the pinnacle of global lost-wax casting technology superior to contemporary European renaissance casting.",
        shaderType: "bronze_patina",
        accentColor: "#b91c1c"
      }
    ],
    governanceSystem: "Hereditary divine monarchy supported by three high chieftaincy orders: Uzama (kingmakers), Eghaevbo n'Ore (town chiefs), and Eghaevbo n'Ogbe (palace chiefs).",
    stateCouncil: "The Uzama Nihiron (Seven Kingmakers) presiding over coronation and constitutional rites.",
    militaryStructure: "Standing army commanded by the Ezomo (supreme general) and Iyase, mobilizing up to 100,000 soldiers with iron swords, javelins, and shields.",
    currencySystem: "Manillas (copper and bronze armlets), cowrie shells (Igo), and brass rods.",
    majorCommodities: ["Lost-wax cast bronze plaques", "Carved ivory tusks", "Woven Benin cloth", "Pepper", "Palm oil"],
    tradeRoutes: ["River Niger delta navigation", "Coastal lagoon network to Lagos", "Atlantic maritime port of Ughoton (Gwato)"],
    tradeCorridorPaths: [
      {
        id: 'benin-manilla-route',
        name: "Ughoton Port Atlantic Trade & Metallurgy Conduit",
        commodity: 'copper',
        color: '#e11d48',
        startName: "Port of Ughoton (Gwato)",
        endName: "Edo Imperial Palace Foundry",
        points: [[2310, 2580], [2335, 2550], [2360, 2520]],
        flowDirection: 'east',
        volumeDescription: "Importation of millions of European brass manillas recast into world-famous Benin bronze masterpieces.",
        activeCenturies: [15, 16, 17, 18],
        kingdomId: 'benin-kingdom',
        kingdomName: "Kingdom of Benin",
        transportMode: 'riverine_flotilla',
        historicalPeriod: "15th – 18th Century CE",
        cargoTypes: ["Brass manillas", "Copper ingots", "Ivory carvings", "Benin pepper (uziza)", "Coral beads"],
        keyStops: [
          { name: "Port of Ughoton (Gwato)", role: "Sovereign customs post for Portuguese and Dutch fleets", modernCountry: "Nigeria" },
          { name: "Ikpoba River Waterway", role: "Canoe transport highway to the city gates", modernCountry: "Nigeria" },
          { name: "Edo (Benin City)", role: "Royal Igun Eronmwon lost-wax guild foundry", modernCountry: "Nigeria" }
        ],
        economicSignificance: "Imported millions of European brass and copper manillas which were systematically melted down and cast into the immortal Benin Bronzes.",
        historicalQuote: {
          text: "The King of Benin has ordered that none of his subjects shall trade with foreigners except at the port of Gwato, where his officers collect the customs.",
          author: "Duarte Pacheco Pereira",
          source: "Esmeraldo de Situ Orbis",
          year: "1508"
        },
        modernLegacy: "Historic gateway to Benin City and the current site of the EMOWAA cultural ecosystem."
      },
      {
        id: 'benin-lagoon-network',
        name: "Bight of Benin Coastal Lagoon & Niger Delta Network",
        commodity: 'ivory',
        color: '#f43f5e',
        startName: "Edo Imperial Capital",
        endName: "Niger Delta & Onitsha Markets",
        points: [[2360, 2520], [2420, 2620], [2500, 2560]],
        flowDirection: 'east',
        volumeDescription: "Interconnected coastal canoe network moving salt, dried fish, woven cloths, and bronze ceremonial regalia.",
        activeCenturies: [15, 16, 17, 18, 19],
        kingdomId: 'benin-kingdom',
        kingdomName: "Kingdom of Benin",
        transportMode: 'riverine_flotilla',
        historicalPeriod: "15th – 19th Century CE",
        cargoTypes: ["Woven Benin cloth", "Smelted bronze regalia", "Palm oil", "Smoked delta fish"],
        keyStops: [
          { name: "Benin City", role: "Artisan workshops and royal palace", modernCountry: "Nigeria" },
          { name: "Forcados River Delta", role: "Mangrove waterway junction", modernCountry: "Nigeria" },
          { name: "Lower Niger River Confluence", role: "Inland riverine commodity exchange", modernCountry: "Nigeria" }
        ],
        economicSignificance: "Integrated the coastal mangrove lagoons with the River Niger fluvial trade basin.",
        modernLegacy: "Precursor to modern Niger Delta maritime waterways and petrochemical logistics."
      }
    ],
    architecturalMonuments: [
      "The Walls of Benin (Iya) — 16,000 km of interconnected ramparts enclosing 6,500 sq km",
      "The Royal Palace of the Oba of Benin with cast bronze serpent turrets",
      "Urban grid layout of pre-1897 Edo with underground drainage"
    ],
    metallurgyAndArts: ["Lost-wax cast Benin Bronzes", "Carved ivory Idia masks", "Coral beaded crowns (Ede)", "Bronze palace pillar plaques"],
    unescoHeritageSites: ["The Sungbo's Eredo and Iya of Benin (Tentative UNESCO List)"],
    historicalQuote: {
      text: "The town seems to be very great; when you enter into it, you go into a great broad street, not paved, which seems to be seven or eight times broader than the Warmoes street in Amsterdam.",
      author: "Olfert Dapper",
      source: "Description of Africa",
      year: "1668"
    },
    scholarlyPublications: [
      { title: "A Short History of Benin", author: "Jacob U. Egharevba", year: 1968, publisher: "Ibadan University Press" },
      { title: "The Art of Benin", author: "Paula Girshick Ben-Amos", year: 1995, publisher: "British Museum Press" },
      { title: "Benin and the Europeans 1485-1897", author: "Alan F.C. Ryder", year: 1969, publisher: "Longmans" }
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Kingdom_of_Benin",
    summaryNarrative: "The Kingdom of Benin (Edo) was one of the most distinguished civilizations in global art history and urban engineering. Located in modern southern Nigeria, its massive earthen ramparts (Iya) and exquisite masterworks in lost-wax bronze and ivory represent the pinnacle of pre-colonial metallurgical genius.",
    economicBridge: {
      historicalCommodity: "Lost-wax metallurgy, high-grade ivory carvings & palm products",
      modernEquivalentSector: "Global Art Restitution, Heritage Tourism & Edo Industrial Zone",
      modernValueMetric: "Restitution of over 1,000 Benin Bronzes from international museums and development of the Edo Museum of West African Art (EMOWAA).",
      modernKeyCountries: [{ iso3: "NGA", name: "Nigeria", shareOfGlobalMarket: "Global pioneer in cultural heritage restitution" }],
      heritagePreservationStatus: "Construction of EMOWAA pavilion and UNESCO digital archiving of the Iya earthworks."
    }
  },

  'ashanti-empire': {
    id: 'ashanti-empire',
    name: "Ashanti Empire",
    nativeName: "Asanteman",
    period: "1701 – 1957 CE",
    peakCentury: "18th–19th Century",
    peakYear: 1800,
    region: "Western Africa",
    regionBadge: "Western Africa",
    color: "#ea580c",
    capital: "Kumasi ('The Garden City')",
    coordinates: [6.688, -1.624],
    svgCoordinates: [1865, 2460],
    territoryPolygonPath: "M 1680,2300 Q 1980,2250 2080,2400 T 2020,2650 Q 1850,2700 1650,2550 T 1680,2300 Z",
    modernCountries: ["Ghana", "Ivory Coast", "Togo"],
    modernIso3Codes: ["GHA", "CIV", "TGO"],
    royalTitle: "Asantehene & Asantehemaa (Queen Mother)",
    dynasty: "Oyoko Dynastic House",
    indigenousScript: {
      scriptName: "Adinkra Ideographic Script & Atumpan Drum Poetry",
      nativeCharacters: "Asantehene / Sika Dwa Kofi",
      phoneticSpelling: "ah-shahn-TEE / ah-sahn-teh-HEH-neh",
      historicalUsage: "Adinkra symbolic stamped glyphs conveying philosophical axioms, complemented by pair-tuned Atumpan talking drums."
    },
    foundingNarrative: "Unified around 1701 by King Osei Tutu I and high priest Okomfo Anokye, summoning the sacred Golden Stool (Sika Dwa Kofi) from the heavens.",
    famousRulers: [
      { name: "Osei Tutu I", reign: "1701 – 1717", feat: "Founding Asantehene who unified the Akan states and established the national constitution." },
      { name: "Opoku Ware I", reign: "1720 – 1750", feat: "Tripled imperial territory and opened the northern trans-Saharan trade corridors." },
      { name: "Osei Kwadwo", reign: "1764 – 1777", feat: "Instituted the Kwadwoan administrative civil service revolution based on meritocracy." },
      { name: "Yaa Asantewaa", reign: "1900", feat: "Queen Mother of Ejisu who led the War of the Golden Stool against British colonial forces." }
    ],
    dynasticTree: [
      { id: 'ashanti-1', name: 'Osei Tutu I & Okomfo Anokye', title: 'Founding Monarch & High Priest', reign: '1701–1717', century: 18, type: 'monarch', feat: 'Descent of the Golden Stool (Sika Dwa Kofi)' },
      { id: 'ashanti-2', name: 'Asanteman Kotoko Council', title: 'Constitutional Milestone', reign: '1705', century: 18, type: 'constitutional_milestone', predecessorId: 'ashanti-1', feat: 'Confederacy Constitution & Paramount Chiefs' },
      { id: 'ashanti-3', name: 'Opoku Ware I', title: 'Asantehene (The Expander)', reign: '1720–1750', century: 18, type: 'monarch', predecessorId: 'ashanti-2', feat: 'Northern trade route consolidation' },
      { id: 'ashanti-4', name: 'Yaa Asantewaa', title: 'Asantehemaa (Queen Mother of Ejisu)', reign: '1900', century: 19, type: 'queen_mother', predecessorId: 'ashanti-3', feat: 'War of the Golden Stool commander' }
    ],
    artifacts3D: [
      {
        id: 'ashanti-golden-stool',
        title: "Sika Dwa Kofi (The Sacred Golden Stool of Asante)",
        nativeTitle: "Sikadwa Kofi",
        period: "1701 – Present",
        material: "hammered_gold",
        dimensions: "46 cm height × 61 cm length × 30 cm width",
        provenance: "Sacred Palace Sanctuary, Kumasi",
        currentLocation: "Sacred Throne of the Asantehene, Manhyia Palace, Kumasi",
        description: "The supreme sacred regalia and soul (Sunsum) of the entire Ashanti nation, carved from solid wood and encased entirely in pure hammered sheet gold, hung with golden bells.",
        materialDetails: "Solid Osese wood core clad with 24-karat repoussé gold plates, brass bells, and cast gold amulets.",
        historicalSignificance: "Never allowed to touch the ground or be sat upon by any human being; represents the eternal spiritual bond of Asanteman.",
        shaderType: "gold_specular",
        accentColor: "#ea580c"
      },
      {
        id: 'ashanti-goldweight-abrammoo',
        title: "Figurative Cast Brass Goldweight (Abrammoo)",
        nativeTitle: "Abrammoo (Mbrafo)",
        period: "18th Century",
        material: "cast_bronze",
        dimensions: "6.8 cm × 4.2 cm × 2.1 cm",
        provenance: "Kumasi Royal Treasury",
        currentLocation: "National Museum of Ghana / British Museum",
        description: "Miniature lost-wax cast brass weight depicting a proverb with two crocodiles sharing one stomach, used to measure pure alluvial gold dust currency.",
        materialDetails: "Direct beeswax-modeled cast bronze with calibrated precise mass (12.4 grams).",
        historicalSignificance: "Served as both an exact economic weighing standard and a visual system of moral philosophy and civic law.",
        shaderType: "bronze_patina",
        accentColor: "#eab308"
      }
    ],
    governanceSystem: "Federal constitutional monarchy governed by the Asanteman Council with a co-equal dual-monarchy between the Asantehene and the Asantehemaa.",
    stateCouncil: "The Asanteman Kotoko (Supreme Executive Council) representing the confederate states, guided by the Golden Stool oath.",
    militaryStructure: "National army organized into wings (Adonten vanguard, Nifa right wing, Benkum left wing, Kyidom rearguard) with musket artillery and horn communications.",
    currencySystem: "Gold dust (Sika) weighed against calibrated geometric brass weights (Abrammoo).",
    majorCommodities: ["Gold dust (Sika)", "Kente silk textiles", "Kola nuts", "Timber", "Adinkra cloths"],
    tradeRoutes: ["Salaga northern route to the Sahel", "Southern coastal route to Elmina and Cape Coast", "Ivory Coast links"],
    tradeCorridorPaths: [
      {
        id: 'ashanti-gold-salaga',
        name: "Great Northern Gold & Kola Caravan Highway",
        commodity: 'gold',
        color: '#eab308',
        startName: "Kumasi Goldfields",
        endName: "Salaga Market & Hausaland",
        points: [[1865, 2460], [1950, 2320], [2200, 2150]],
        flowDirection: 'north',
        volumeDescription: "Vast shipments of gold dust and millions of forest kola nuts exchanged for trans-Saharan rock salt, leather, and manuscripts.",
        activeCenturies: [18, 19],
        kingdomId: 'ashanti-empire',
        kingdomName: "Ashanti Empire",
        transportMode: 'camel_caravan',
        historicalPeriod: "18th – 19th Century CE",
        cargoTypes: ["Alluvial gold dust (Sika)", "Fresh kola nuts", "Kente silk", "Saharan rock salt", "Manuscripts"],
        keyStops: [
          { name: "Kumasi", role: "Imperial capital and royal gold treasury", modernCountry: "Ghana" },
          { name: "Mampong Escarpment", role: "Northern frontier toll gate", modernCountry: "Ghana" },
          { name: "Salaga Market", role: "Great caravanserai of the Volta Basin", modernCountry: "Ghana" },
          { name: "Hausaland Emporia", role: "Trans-Saharan terminus", modernCountry: "Nigeria" }
        ],
        economicSignificance: "Exchanged hundreds of tons of forest kola nuts and pure gold dust for trans-Saharan leather goods, salt slabs, and Islamic scholastic books.",
        modernLegacy: "The historic trade route that structured the modern Ghana-Burkina Faso-Mali transport corridor."
      },
      {
        id: 'ashanti-coastal-route',
        name: "Kumasi to Elmina & Cape Coast Royal Highway",
        commodity: 'gold',
        color: '#f59e0b',
        startName: "Kumasi Imperial Capital",
        endName: "Elmina & Cape Coast Castles",
        points: [[1865, 2460], [1880, 2560], [1890, 2650]],
        flowDirection: 'south',
        volumeDescription: "Royal chancellery corridor connecting the Akan interior goldfields directly with Atlantic maritime forts.",
        activeCenturies: [18, 19],
        kingdomId: 'ashanti-empire',
        kingdomName: "Ashanti Empire",
        transportMode: 'forest_porters',
        historicalPeriod: "18th – 19th Century CE",
        cargoTypes: ["Gold nuggets & dust", "Timber", "Muskets & gunpowder", "Dutch trade gin", "Brass bowls"],
        keyStops: [
          { name: "Kumasi", role: "Metropolitan capital", modernCountry: "Ghana" },
          { name: "Pra River Station", role: "Border crossing & military checkpoint", modernCountry: "Ghana" },
          { name: "Elmina Castle (São Jorge da Mina)", role: "Atlantic maritime trade emporium", modernCountry: "Ghana" }
        ],
        economicSignificance: "Secured direct Ashanti access to European maritime merchant shipping along the Gold Coast.",
        modernLegacy: "The primary commercial artery connecting Kumasi to Ghana's coastal deepwater ports (Takoradi/Tema)."
      }
    ],
    architecturalMonuments: [
      "Manhyia Palace Compound in Kumasi",
      "Traditional Ashanti Courtyard Shrines with steep thatch roofs and geometric fretwork",
      "Lake Bosumtwi sacred cultural landscape"
    ],
    metallurgyAndArts: ["Kente loom-woven silk textiles", "Adinkra philosophical aphorism block-printing", "Brass goldweights (Abrammoo)", "Golden linguist staffs (Okyeame Poma)"],
    unescoHeritageSites: ["Asante Traditional Buildings (UNESCO World Heritage Site, 1980)"],
    historicalQuote: {
      text: "The palace of the King at Coomassie was an immense building of several courtyards... with magnificent wood carvings, gold ornaments of marvelous weight, and rich silks.",
      author: "Thomas Edward Bowdich",
      source: "Mission from Cape Coast Castle to Ashantee",
      year: "1819"
    },
    scholarlyPublications: [
      { title: "Asante in the Nineteenth Century", author: "Ivor Wilks", year: 1975, publisher: "Cambridge University Press" },
      { title: "Forests of Gold: Essays on the Akan and Asante", author: "Ivor Wilks", year: 1993, publisher: "Ohio University Press" },
      { title: "The Golden Stool", author: "Edwin W. Smith", year: 1926, publisher: "Edinburgh House" }
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Ashanti_Empire",
    summaryNarrative: "The Ashanti Empire (Asanteman) was one of the most powerful and sophisticated state confederacies in pre-colonial West Africa. Established at the dawn of the 18th century around the sacred Golden Stool, Ashanti developed advanced administrative civil services, gold metallurgy, and formidable military organizations that contested British colonial dominance in five successive Anglo-Ashanti wars.",
    economicBridge: {
      historicalCommodity: "Alluvial gold extraction (Sika), Kente weaving & kola trade",
      modernEquivalentSector: "Ghanaian Sovereign Gold Mining & High-Value Cocoa Exports",
      modernValueMetric: "Ghana is Africa's #1 gold producer (over 130 metric tons annually) and world's #2 cocoa producer generating over $10B.",
      modernKeyCountries: [
        { iso3: "GHA", name: "Ghana", shareOfGlobalMarket: "Top gold producer in Africa, 20% of global cocoa" },
        { iso3: "CIV", name: "Ivory Coast", shareOfGlobalMarket: "World's #1 cocoa producer (45%)" }
      ],
      heritagePreservationStatus: "Manhyia Palace Museum and UNESCO Asante Traditional Buildings in Kumasi."
    }
  },

  'mali-empire': {
    id: 'mali-empire',
    name: "Mali Empire",
    nativeName: "Manden Kurufaba",
    period: "c. 1235 – 1670 CE",
    peakCentury: "13th–14th Century",
    peakYear: 1324,
    region: "Western Africa",
    regionBadge: "Western Africa",
    color: "#d97706",
    capital: "Niani / Kangaba",
    coordinates: [12.650, -8.000],
    svgCoordinates: [1320, 2050],
    territoryPolygonPath: "M 850,1750 Q 1450,1500 1850,1800 T 1750,2250 Q 1300,2400 800,2200 T 850,1750 Z",
    modernCountries: ["Mali", "Guinea", "Senegal", "The Gambia", "Mauritania", "Ivory Coast"],
    modernIso3Codes: ["MLI", "GIN", "SEN", "GMB", "MRT", "CIV"],
    royalTitle: "Mansa ('Emperor / King of Kings')",
    dynasty: "Keita Dynasty",
    indigenousScript: {
      scriptName: "Timbuktu Saharan Calligraphy & Mandinka Griot Oral Epics",
      nativeCharacters: "Mansa Musa / Manden Kurufaba",
      phoneticSpelling: "MAHN-sah of MAH-lee",
      historicalUsage: "Arabic-Ajami scholastic manuscripts preserved in Timbuktu and epic oral transmission by the Jeliw (Griots) with Kora harp accompaniment."
    },
    foundingNarrative: "Founded around 1235 by Sundiata Keita after the Battle of Kirina, establishing the Kouroukan Fouga (one of the world's earliest constitutional human rights charters).",
    famousRulers: [
      { name: "Sundiata Keita", reign: "c. 1235 – 1255", feat: "Founder of the empire, architect of the Manden Kurufaba confederacy and the Kouroukan Fouga charter." },
      { name: "Mansa Abu Bakr II", reign: "c. 1310 – 1312", feat: "Visionary navigator who launched an expedition of 2,000 vessels into the Atlantic Ocean." },
      { name: "Mansa Musa I", reign: "1312 – 1337", feat: "Celebrated worldwide for his 1324 pilgrimage distributing tons of gold, immortalized on the 1375 Catalan Atlas." },
      { name: "Mansa Suleyman", reign: "1341 – 1360", feat: "Host to Ibn Battuta, celebrated for exemplary governance and public justice." }
    ],
    dynasticTree: [
      { id: 'mali-1', name: 'Sundiata Keita', title: 'Founding Mansa (Mari Djata)', reign: '1235–1255', century: 13, type: 'monarch', feat: 'Battle of Kirina & Kouroukan Fouga proclamation' },
      { id: 'mali-2', name: 'Kouroukan Fouga Charter', title: 'Constitutional Milestone', reign: '1235', century: 13, type: 'constitutional_milestone', predecessorId: 'mali-1', feat: 'Universal charter of rights & 16 clan divisions' },
      { id: 'mali-3', name: 'Mansa Abu Bakr II', title: 'Mansa & Atlantic Navigator', reign: '1310–1312', century: 14, type: 'monarch', predecessorId: 'mali-2', feat: 'Atlantic maritime exploratory fleet' },
      { id: 'mali-4', name: 'Mansa Musa I', title: 'Mansa (Golden Age)', reign: '1312–1337', century: 14, type: 'monarch', predecessorId: 'mali-3', feat: '1324 Hajj & Catalan Atlas immortalization' }
    ],
    artifacts3D: [
      {
        id: 'mali-catalan-atlas-manuscript',
        title: "Catalan Atlas Gold Folio of Mansa Musa",
        nativeTitle: "Mansa Musa in the 1375 Catalan Atlas",
        period: "1375 CE",
        material: "illuminated_parchment",
        dimensions: "65 cm × 50 cm",
        provenance: "Palma de Mallorca (Abraham Cresques) / Royal Court of France",
        currentLocation: "Bibliothèque nationale de France (BnF, Paris)",
        description: "Illuminated vellum map folio depicting Mansa Musa enthroned in royal robes holding a solid golden orb and golden scepter, illustrating the immense prestige of Malian gold.",
        materialDetails: "Fine calfskin vellum illuminated with 24K gold leaf, lapis lazuli, vermilion, and malachite pigments.",
        historicalSignificance: "The definitive medieval cartographic proof connecting West African sovereign wealth directly to the Mediterranean world.",
        shaderType: "aged_manuscript",
        accentColor: "#d97706"
      },
      {
        id: 'mali-djenné-terracotta',
        title: "Djenné-Djenno Terracotta Equestrian Figure",
        nativeTitle: "So-Tigi (Horseman of the Inland Delta)",
        period: "13th – 14th Century",
        material: "terracotta",
        dimensions: "70.5 cm × 45.0 cm × 22.0 cm",
        provenance: "Inland Niger Delta, Mali",
        currentLocation: "National Museum of Mali, Bamako / Musée du Quai Branly",
        description: "Sculpted terracotta equestrian rider in full battle regalia with quiver and amulets, capturing the elite Mandinka cavalry corps.",
        materialDetails: "High-fired ferruginous clay with natural slip burnishing and detailed scarification incising.",
        historicalSignificance: "Archaeological evidence of the formidable cavalry units that guaranteed trade route security across the empire.",
        shaderType: "granite_grain",
        accentColor: "#b45309"
      }
    ],
    governanceSystem: "Federal imperial constitutional monarchy structured under the Kouroukan Fouga charter, dividing society into 16 clans of free warriors, 4 maraboutic castes, and specialized guilds.",
    stateCouncil: "The Gbara (Grand Assembly of the Manden Kurufaba) representing the 29 founding Mandinka clans.",
    militaryStructure: "Elite cavalry corps (Ton-Tigi) and archer divisions (Kèlè-Kè) fielding over 100,000 soldiers with iron-tipped weapons.",
    currencySystem: "Gold dust (Tibar), gold mithqals, copper rods, and cowrie shells.",
    majorCommodities: ["Gold from Bambuk and Bure goldfields", "Trans-Saharan rock salt", "Cotton textiles", "Kola nuts", "Copper"],
    tradeRoutes: ["Trans-Saharan Gold-Salt highway to Cairo & Marrakech", "Senegambia Atlantic route", "Niger River trade network"],
    tradeCorridorPaths: [
      {
        id: 'mali-gold-trans-saharan',
        name: "Trans-Saharan Imperial Gold-Salt Highway (Mansa Musa Hajj Route)",
        commodity: 'gold',
        color: '#d97706',
        startName: "Bure & Bambuk Goldfields",
        endName: "Cairo & Alexandria (Mediterranean)",
        points: [[1280, 2200], [1350, 2100], [1520, 1950], [1620, 1800], [2050, 1350], [2600, 1080], [3300, 950], [3770, 850]],
        flowDirection: 'east',
        volumeDescription: "Historic conveyance of metric tons of pure West African gold that supplied over 60% of medieval European and Islamic coin mints.",
        activeCenturies: [13, 14, 15, 16],
        kingdomId: 'mali-empire',
        kingdomName: "Mali Empire",
        transportMode: 'camel_caravan',
        historicalPeriod: "13th – 16th Century CE",
        cargoTypes: ["Pure gold dust (Tibar)", "Gold mithqals", "Rock salt", "Manuscripts", "Textiles"],
        keyStops: [
          { name: "Bure Goldfields", role: "Primary alluvial gold source", modernCountry: "Guinea / Mali" },
          { name: "Niani", role: "Imperial capital of Sundiata Keita", modernCountry: "Guinea" },
          { name: "Timbuktu", role: "University of Sankoré & scholastic entrepôt", modernCountry: "Mali" },
          { name: "In Salah / Tuat Oasis", role: "Central Saharan water and camel station", modernCountry: "Algeria" },
          { name: "Ghadames Oasis", role: "Crossroads to Tripoli and Egypt", modernCountry: "Libya" },
          { name: "Cairo & Alexandria", role: "Mamluk Sultanate capital and Mediterranean port", modernCountry: "Egypt" }
        ],
        economicSignificance: "Supplied more than 60% of all gold circulating throughout medieval Europe and the Mediterranean basin, famously documented during Mansa Musa's 1324 pilgrimage.",
        historicalQuote: {
          text: "Gold was so plentiful in Cairo during Mansa Musa's stay that the value of the dinar fell by twelve silver dirhams and remained depressed for over a decade.",
          author: "Al-Umari",
          source: "Masalik al-Absar",
          year: "1342"
        },
        modernLegacy: "The defining trans-continental trade corridor immortalized on the 1375 Catalan Atlas."
      },
      {
        id: 'mali-salt-taghaza',
        name: "Taghaza-Taoudenni Azalai Rock Salt Caravan",
        commodity: 'salt',
        color: '#38bdf8',
        startName: "Taghaza Salt Mines (Central Sahara)",
        endName: "Djenné Inland Niger Delta",
        points: [[1600, 1300], [1610, 1550], [1620, 1800], [1520, 1950]],
        flowDirection: 'south',
        volumeDescription: "Caravans of thousands of camels transporting standard 200kg salt slabs traded weight-for-weight for gold.",
        activeCenturies: [13, 14, 15, 16],
        kingdomId: 'mali-empire',
        kingdomName: "Mali Empire",
        transportMode: 'camel_caravan',
        historicalPeriod: "13th – 16th Century CE",
        cargoTypes: ["Standard 200kg rock salt slabs", "Dried desert dates", "Leather baggage"],
        keyStops: [
          { name: "Taghaza Mines", role: "Subterranean salt quarrying in the Sahara", modernCountry: "Mali" },
          { name: "Araouane Oasis", role: "Desert well station and guide junction", modernCountry: "Mali" },
          { name: "Timbuktu", role: "River-desert port of transshipment", modernCountry: "Mali" },
          { name: "Djenné", role: "Inland agricultural hub and grain exchange", modernCountry: "Mali" }
        ],
        economicSignificance: "Transported hundreds of thousands of salt slabs traded weight-for-weight against gold dust across the Sahel.",
        modernLegacy: "The famous Azalai salt caravan tradition that continues to this day in northern Mali."
      }
    ],
    architecturalMonuments: ["Djinguereber Mosque in Timbuktu (built 1327 by al-Sahili)", "University of Sankoré campus", "Great Palace of Niani"],
    metallurgyAndArts: ["Griot oral epics and Kora harp traditions", "Numu artisan iron forging", "Bogolanfini mud cloth fermentation dyeing"],
    unescoHeritageSites: [
      "Timbuktu: Mosques and Shrines (UNESCO World Heritage Site, 1988)",
      "Old Towns of Djenné (UNESCO World Heritage Site, 1988)",
      "The Manden Charter / Kouroukan Fouga (UNESCO Intangible Cultural Heritage, 2009)"
    ],
    historicalQuote: {
      text: "This King is Mansa Musa, Lord of the Negroes of Guinea. So abundant is the gold which is found in his country that he is the richest and most noble lord in all the world.",
      author: "Cresques Abraham",
      source: "The Catalan Atlas",
      year: "1375"
    },
    scholarlyPublications: [
      { title: "Sundiata: An Epic of Old Mali", author: "D.T. Niane", year: 1965, publisher: "Longman" },
      { title: "Mansa Musa and the Empire of Mali", author: "P. James Oliver", year: 2013, publisher: "African American Images" },
      { title: "Travels in Asia and Africa 1325–1354", author: "Ibn Battuta", year: 1929, publisher: "Routledge" }
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Mali_Empire",
    summaryNarrative: "The Mali Empire was the legendary sovereign powerhouse of medieval West Africa. Controlling the world's most productive goldfields, it produced the monumental Kouroukan Fouga constitutional charter and gained international renown under Mansa Musa, whose extraordinary wealth and architectural patronage connected the Sahel directly to global trade and scholarship.",
    economicBridge: {
      historicalCommodity: "Trans-Saharan gold extraction, salt exchange & Sahelian scholarship",
      modernEquivalentSector: "Sahelian Solar Power, Mining & Cultural Tourism",
      modernValueMetric: "Mali is Africa's 3rd largest gold producer with over $5B annual mineral exports and 700,000 digitized Timbuktu manuscripts.",
      modernKeyCountries: [
        { iso3: "MLI", name: "Mali", shareOfGlobalMarket: "Top 3 gold producer in Africa" },
        { iso3: "SEN", name: "Senegal", shareOfGlobalMarket: "Major regional maritime transit & tech hub" }
      ],
      heritagePreservationStatus: "UNESCO emergency restoration of Djinguereber Mosque and Timbuktu manuscript digitization."
    }
  },

  'great-zimbabwe': {
    id: 'great-zimbabwe',
    name: "Kingdom of Zimbabwe",
    nativeName: "Dzimba-dza-Mabwe",
    period: "c. 1220 – 1450 CE",
    peakCentury: "13th–14th Century",
    peakYear: 1350,
    region: "Southern Africa",
    regionBadge: "Southern Africa",
    color: "#059669",
    capital: "Great Zimbabwe",
    coordinates: [-20.267, 30.933],
    svgCoordinates: [3980, 4640],
    territoryPolygonPath: "M 3650,4400 Q 4250,4300 4450,4600 T 4250,5000 Q 3800,5100 3500,4800 T 3650,4400 Z",
    modernCountries: ["Zimbabwe", "Mozambique", "Botswana", "South Africa"],
    modernIso3Codes: ["ZWE", "MOZ", "BWA", "ZAF"],
    royalTitle: "Mwenemutapa / Mambo",
    dynasty: "Gokomere / Ancestral Shona Dynastic Lineage",
    indigenousScript: {
      scriptName: "Shona Architectural Masonry Glyphs & Stone Bird Heraldry",
      nativeCharacters: "Dzimba-dza-Mabwe / Shiri yaMwari",
      phoneticSpelling: "mweh-neh-moo-TAH-pah",
      historicalUsage: "Chevron, herringbone, and dentelle dry-stone architectural motifs encoding royal dynastic authority without mortar."
    },
    foundingNarrative: "Emerged around 1220 from Mapungubwe, consolidating control over the gold-bearing plateau and constructing a dry-stone capital housing over 18,000 citizens.",
    famousRulers: [
      { name: "Nyatsimba Mutota", reign: "c. 1430 – 1450", feat: "Great builder and military strategist who expanded north to found the Mutapa Empire." },
      { name: "Matope", reign: "c. 1450 – 1480", feat: "Expanded Shona control across the Zambezi valley to the Indian Ocean coast." }
    ],
    dynasticTree: [
      { id: 'zim-1', name: 'Ancestral Shona Founders', title: 'Mambo of Great Zimbabwe', reign: 'c. 1220', century: 13, type: 'monarch', feat: 'Construction of the Great Enclosure' },
      { id: 'zim-2', name: 'Dare Assembly System', title: 'Constitutional Milestone', reign: '1300', century: 14, type: 'constitutional_milestone', predecessorId: 'zim-1', feat: 'Council of Elders and cattle-wealth judicial treaties' },
      { id: 'zim-3', name: 'Nyatsimba Mutota', title: 'Mwenemutapa (Founder of Mutapa)', reign: '1430–1450', century: 15, type: 'monarch', predecessorId: 'zim-2', feat: 'Northern expansion across Zambezi basin' }
    ],
    artifacts3D: [
      {
        id: 'zimbabwe-bird',
        title: "The Sacred Soapstone Zimbabwe Bird (Shiri yaMwari)",
        nativeTitle: "Shiri yaMwari",
        period: "c. 1250 – 1400 CE",
        material: "granite_stone",
        dimensions: "35 cm height (bird) on 1.2m soapstone monolith",
        provenance: "Hill Complex Royal Acropolis, Great Zimbabwe",
        currentLocation: "Great Zimbabwe Museum, Masvingo",
        description: "Exquisitely carved monolithic soapstone raptor (bateleur eagle / fish eagle) standing on a column with human-like feet and chevron markings, symbolizing the celestial link between the living Mambo and ancestral spirits.",
        materialDetails: "Fine green-grey talc-schist (soapstone) carved and polished with silica abrasives.",
        historicalSignificance: "The national emblem of modern Zimbabwe, featured on the national flag, coat of arms, and currency.",
        shaderType: "granite_grain",
        accentColor: "#059669"
      }
    ],
    governanceSystem: "Centralized sacred monarchy centered on the royal hill complex, supported by hereditary provincial lords managing cattle wealth and tributary gold mining.",
    stateCouncil: "Dare (Council of Elders and Royal Advisors) advising the Mambo on judicial matters and regional alliances.",
    militaryStructure: "Disciplined infantry regiments armed with iron battleaxes (Gano), throwing spears, and hide shields.",
    currencySystem: "Cast copper cross ingots (Hanga), gold beads, and cattle herds.",
    majorCommodities: ["Alluvial gold", "Refined copper ingots", "Elephant ivory", "Cattle herds", "Soapstone artwork"],
    tradeRoutes: ["Save River and Limpopo River routes to Sofala", "Indian Ocean trade linking Kilwa, India, and Ming China"],
    tradeCorridorPaths: [
      {
        id: 'zim-sofala-route',
        name: "Save River to Sofala & Kilwa Swahili Gold Highway",
        commodity: 'gold',
        color: '#10b981',
        startName: "Great Zimbabwe Plateau",
        endName: "Port of Sofala & Kilwa Sultanate",
        points: [[3710, 4490], [3920, 4490], [4160, 4480], [4280, 4200], [4320, 3820]],
        flowDirection: 'east',
        volumeDescription: "Conveyance of thousands of ounces of pure plateau gold loaded onto Swahili dhows for India and China in exchange for Ming celadon porcelain and Persian glassware.",
        activeCenturies: [13, 14, 15],
        kingdomId: 'great-zimbabwe',
        kingdomName: "Kingdom of Zimbabwe",
        transportMode: 'maritime_dhow',
        historicalPeriod: "13th – 15th Century CE",
        cargoTypes: ["Refined alluvial gold", "Elephant ivory", "Soapstone carvings", "Ming porcelain", "Persian glassware", "Indian cottons"],
        keyStops: [
          { name: "Great Zimbabwe Acropolis", role: "Shona royal capital and gold collection citadel", modernCountry: "Zimbabwe" },
          { name: "Save-Buzi River Corridors", role: "Highland-to-coastal fluvial navigation path", modernCountry: "Zimbabwe / Mozambique" },
          { name: "Port of Sofala", role: "Primary Indian Ocean gold-loading harbor", modernCountry: "Mozambique" },
          { name: "Mozambique Island", role: "Monsoon anchorage and dhow waystation", modernCountry: "Mozambique" },
          { name: "Kilwa Kisiwani", role: "Swahili Sultanate capital minting gold coins", modernCountry: "Tanzania" }
        ],
        economicSignificance: "Connected the gold-bearing plateau of Southern Africa with the Indian Ocean Swahili maritime trade web reaching Kilwa, Arabia, India, and Ming-era China.",
        historicalQuote: {
          text: "From Sofala the Moors bring much gold to Kilwa... and they load great quantities onto their vessels to take across the Indian Ocean to Cambay and Malacca.",
          author: "Duarte Barbosa",
          source: "The Book of Duarte Barbosa",
          year: "1518"
        },
        modernLegacy: "The ancient gold trade route that evolved into the modern Beira & Maputo development corridors."
      },
      {
        id: 'zim-mapungubwe-limpopo',
        name: "Limpopo-Shashe Gold & Ivory Inland Corridor",
        commodity: 'copper',
        color: '#059669',
        startName: "Mapungubwe Goldfields",
        endName: "Delagoa Bay & Inhambane",
        points: [[3550, 4720], [3710, 4490], [3950, 4580], [4100, 4780]],
        flowDirection: 'east',
        volumeDescription: "Interlocking inland trail moving copper cross ingots (Hanga), gold beads, and cattle wealth to southeastern ocean harbors.",
        activeCenturies: [12, 13, 14],
        kingdomId: 'great-zimbabwe',
        kingdomName: "Kingdom of Zimbabwe",
        transportMode: 'riverine_flotilla',
        historicalPeriod: "12th – 14th Century CE",
        cargoTypes: ["Gold foil ornaments", "Cast copper cross ingots (Hanga)", "Cattle wealth", "Glass trade beads"],
        keyStops: [
          { name: "Mapungubwe Hill", role: "Ancestral gold metallurgy center", modernCountry: "South Africa" },
          { name: "Great Zimbabwe", role: "Imperial administrative capital", modernCountry: "Zimbabwe" },
          { name: "Manyikeni", role: "Granite coastal outpost of Zimbabwe culture", modernCountry: "Mozambique" },
          { name: "Delagoa Bay", role: "Southern Indian Ocean maritime shelter", modernCountry: "Mozambique" }
        ],
        economicSignificance: "Integrated the ancestral Limpopo gold-working tradition with the emerging coastal trade posts of southeastern Africa.",
        modernLegacy: "Precursor to the modern Limpopo Transfrontier Conservation and trade network."
      }
    ],
    architecturalMonuments: [
      "The Great Enclosure (outer wall 250m long, 11m high, 1 million granite blocks without mortar)",
      "The Conical Tower",
      "The Hill Complex sacred royal acropolis"
    ],
    metallurgyAndArts: ["Carved Soapstone Zimbabwe Birds", "Patterned dry-stone granite masonry", "Gold foil beads and beaten copper bangles"],
    unescoHeritageSites: ["Great Zimbabwe National Monument (UNESCO World Heritage Site, 1986)"],
    historicalQuote: {
      text: "In the interior between the rivers Zambezi and Limpopo is a great city called Zimbabwe... built of large square stones with great skill, without any mortar.",
      author: "Duarte Barbosa",
      source: "The Book of Duarte Barbosa",
      year: "1518"
    },
    scholarlyPublications: [
      { title: "Great Zimbabwe: Described and Explained", author: "Peter Garlake", year: 1982, publisher: "Zimbabwe Publishing House" },
      { title: "The Archaeology of Africa", author: "Thurstan Shaw et al.", year: 1993, publisher: "Routledge" }
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Kingdom_of_Zimbabwe",
    summaryNarrative: "The Kingdom of Zimbabwe was the foremost medieval civilization in Southern Africa. Famous for its magnificent dry-stone granite architecture at Great Zimbabwe, it controlled the lucrative Indian Ocean gold and ivory trade routes that connected interior Africa with Kilwa, India, and China.",
    economicBridge: {
      historicalCommodity: "Dry-stone granite architecture, gold mining & Indian Ocean maritime trade",
      modernEquivalentSector: "Platinum/Lithium Strategic Reserves & SADC Trade Corridors",
      modernValueMetric: "Zimbabwe holds the world's 2nd largest platinum and high-grade lithium reserves essential for global energy transition.",
      modernKeyCountries: [
        { iso3: "ZWE", name: "Zimbabwe", shareOfGlobalMarket: "Top global lithium & platinum reserves" },
        { iso3: "MOZ", name: "Mozambique", shareOfGlobalMarket: "Major LNG export terminal and port hub" }
      ],
      heritagePreservationStatus: "Great Zimbabwe UNESCO monitoring and dry-stone restoration masterplan."
    }
  },

  'axum-empire': {
    id: 'axum-empire',
    name: "Kingdom of Aksum",
    nativeName: "መንግሥተ አክሱም",
    period: "c. 100 – 940 CE",
    peakCentury: "3rd–6th Century",
    peakYear: 350,
    region: "Eastern Africa / Horn of Africa",
    regionBadge: "Horn of Africa",
    color: "#7c3aed",
    capital: "Aksum (Axum)",
    coordinates: [14.133, 38.717],
    svgCoordinates: [4200, 2050],
    territoryPolygonPath: "M 3950,1850 Q 4350,1750 4600,1950 T 4500,2350 Q 4150,2450 3850,2200 T 3950,1850 Z",
    modernCountries: ["Ethiopia", "Eritrea", "Sudan", "Yemen", "Saudi Arabia"],
    modernIso3Codes: ["ETH", "ERI", "SDN", "YEM", "SAU"],
    royalTitle: "Negusa Nagast ('King of Kings')",
    dynasty: "Solomonic & Axumite Royal Lineage",
    indigenousScript: {
      scriptName: "Ge'ez Script (Abugida) & Bilingual Greek Inscriptions",
      nativeCharacters: "መንግሥተ አክሱም / ንጉሠ ነገሥት",
      phoneticSpelling: "neh-GOOS-ah nah-GAHST of AHK-soom",
      historicalUsage: "Official imperial Ge'ez script die-struck on royal gold coins, trilingual stone stelae (Ezana Stone), and Garima Gospels."
    },
    foundingNarrative: "Emerged in the 1st century CE on the Tigray plateau, controlling the maritime Red Sea trade port of Adulis connecting the Roman Empire, Egypt, and India.",
    famousRulers: [
      { name: "Zoskales", reign: "c. 100 CE", feat: "Recorded in the Greek Periplus of the Erythraean Sea." },
      { name: "King Ezana", reign: "c. 320 – 360 CE", feat: "Converted to Christianity in 330 CE; minted coins inscribed with the Cross and erected the trilingual Ezana Stone." },
      { name: "Kaleb of Axum", reign: "c. 510 – 540 CE", feat: "Launched naval expeditions across the Red Sea to protect Christian communities in Himyar (Yemen)." }
    ],
    dynasticTree: [
      { id: 'axum-1', name: 'King Zoskales', title: 'Early King of Aksum', reign: 'c. 100 CE', century: 1, type: 'monarch', feat: 'Adulis maritime Red Sea trade expansion' },
      { id: 'axum-2', name: 'King Ezana', title: 'Negusa Nagast (Golden Age)', reign: '320–360 CE', century: 4, type: 'monarch', predecessorId: 'axum-1', feat: 'Official adoption of Christianity & gold coinage' },
      { id: 'axum-3', name: 'Ezana Trilingual Stone Proclamation', title: 'Constitutional Milestone', reign: '350 CE', century: 4, type: 'constitutional_milestone', predecessorId: 'axum-2', feat: 'Bilingual Ge\'ez, Sabaean, and Greek royal edicts' },
      { id: 'axum-4', name: 'King Kaleb', title: 'Negusa Nagast (Imperial Zenith)', reign: '510–540 CE', century: 6, type: 'monarch', predecessorId: 'axum-3', feat: 'Trans-Red Sea naval fleet across Yemen' }
    ],
    artifacts3D: [
      {
        id: 'axum-ezana-gold-coin',
        title: "Gold Dinar Coin of King Ezana with Christian Cross",
        nativeTitle: "Ezana Gold Coin (ንጉሥ ዔዛና)",
        period: "c. 340 – 356 CE",
        material: "hammered_gold",
        dimensions: "1.7 cm diameter × 1.6 grams (solid gold)",
        provenance: "Aksum Royal Mint",
        currentLocation: "National Museum of Ethiopia, Addis Ababa / British Museum",
        description: "Extremely fine solid gold coin showing crowned King Ezana holding a spear on the obverse, with the Christian Cross on the reverse, inscribed in Greek: EZANA BACILEYC (King Ezana).",
        materialDetails: "Precision die-struck 95% pure alluvial gold with raised border beading.",
        historicalSignificance: "One of the earliest coins in world history to bear the Christian Cross, affirming Aksum as a premier global superpower alongside Rome and Persia.",
        shaderType: "gold_specular",
        accentColor: "#7c3aed"
      },
      {
        id: 'axum-stele-monolith',
        title: "The Great Obelisk / Stela of Aksum (Multi-Story Granite Monolith)",
        nativeTitle: "Hawulti Aksum (ሐውልቲ ኣኽሱም)",
        period: "4th Century CE",
        material: "granite_stone",
        dimensions: "24 meters height × 160 metric tons (single block of granite)",
        provenance: "Northern Stele Park, Aksum",
        currentLocation: "Aksum Archaeological Site, Tigray, Ethiopia",
        description: "Monumental monolithic granite obelisk intricately carved to represent a ten-story skyscraper with false windows, doors, and structural cross-beams (monkey-heads).",
        materialDetails: "Single quarried slab of hard grey nepheline phonolite granite carved with bronze and iron chisels.",
        historicalSignificance: "The largest single monolithic stone structure ever successfully quarried, transported, and erected in human history.",
        shaderType: "granite_grain",
        accentColor: "#6d28d9"
      }
    ],
    governanceSystem: "Federal imperial monarchy commanding tributary kingdoms across both sides of the Red Sea, supported by high judicial clergy and provincial military governors.",
    stateCouncil: "Imperial Senate of Nobility and the Patriarchate of the Ethiopian Orthodox Tewahedo Church.",
    militaryStructure: "Combined arms military with disciplined spear phalanxes, camel cavalry, and an ocean-going naval fleet stationed at the Red Sea port of Adulis.",
    currencySystem: "Standardized gold, silver, and bronze coinage minted in Aksum with inscriptions in Ge'ez and Greek.",
    majorCommodities: ["Frankincense and myrrh", "African elephant ivory", "Gold and emeralds", "Live animals and tortoiseshell", "Glassware imports"],
    tradeRoutes: ["Red Sea route to Alexandria and Rome", "Indian Ocean monsoon route to India and Sri Lanka", "Nile Valley route to Meroë"],
    tradeCorridorPaths: [
      {
        id: 'axum-adulis-red-sea',
        name: "Adulis Red Sea & Greco-Roman Maritime Gateway",
        commodity: 'gold',
        color: '#7c3aed',
        startName: "Aksum Highlands & Port of Adulis",
        endName: "Alexandria & Byzantine Mediterranean",
        points: [[4200, 2050], [4400, 2080], [4320, 1750], [4180, 1400], [4020, 1120], [3920, 960], [3770, 820]],
        flowDirection: 'north',
        volumeDescription: "Vital maritime conduit delivering Ethiopian highlands gold, African ivory, and Arabian frankincense directly to Roman, Byzantine, and Levantine markets.",
        activeCenturies: [1, 2, 3, 4, 5, 6],
        kingdomId: 'axum-empire',
        kingdomName: "Kingdom of Aksum",
        transportMode: 'maritime_dhow',
        historicalPeriod: "1st – 7th Century CE",
        cargoTypes: ["Ivory tusks", "Frankincense & myrrh", "Gold dinar coins", "Roman glass", "Amphorae of wine & olive oil"],
        keyStops: [
          { name: "Aksum Highlands", role: "Imperial capital, royal mint & obelisk sanctuaries", modernCountry: "Ethiopia" },
          { name: "Port of Adulis (Gulf of Zula)", role: "Premier classical deepwater port of the Red Sea", modernCountry: "Eritrea" },
          { name: "Dahlak & Suakin Channel", role: "Red Sea coral channel navigation waystation", modernCountry: "Eritrea / Sudan" },
          { name: "Berenike Troglodytica", role: "Greco-Roman desert caravan terminus", modernCountry: "Egypt" },
          { name: "Clysma (Suez) & Pelusium", role: "Isthmus gateway to the Nile Delta", modernCountry: "Egypt" },
          { name: "Alexandria", role: "Mediterranean metropolis and scholastic capital", modernCountry: "Egypt" }
        ],
        economicSignificance: "The foremost Red Sea commercial artery connecting sub-Saharan Africa with the Roman, Byzantine, and Mediterranean empires.",
        historicalQuote: {
          text: "From Adulis it is a journey of eight days to the city of the people called Auxumites, where all the ivory is brought from the country beyond the Nile.",
          author: "Anonymous (Greek Merchant)",
          source: "Periplus of the Erythraean Sea",
          year: "c. 50 CE"
        },
        modernLegacy: "The geostrategic Red Sea maritime choke point and modern Horn of Africa trade route."
      },
      {
        id: 'axum-himyar-yemen',
        name: "Red Sea Bab el-Mandeb Trans-Arabian Gateway",
        commodity: 'ivory',
        color: '#9333ea',
        startName: "Port of Adulis",
        endName: "Zafar & Himyarite Kingdom (Yemen)",
        points: [[4400, 2080], [4550, 2220], [4680, 2350], [4820, 2300]],
        flowDirection: 'east',
        volumeDescription: "Cross-strait naval and merchant conduit linking Aksumite East Africa with South Arabian frankincense kingdoms.",
        activeCenturies: [3, 4, 5, 6],
        kingdomId: 'axum-empire',
        kingdomName: "Kingdom of Aksum",
        transportMode: 'maritime_dhow',
        historicalPeriod: "3rd – 6th Century CE",
        cargoTypes: ["South Arabian frankincense", "Indian Ocean spices", "Silk fabrics", "Obsidian blades"],
        keyStops: [
          { name: "Port of Adulis", role: "Aksumite naval fleet base", modernCountry: "Eritrea" },
          { name: "Bab el-Mandeb ('Gate of Tears')", role: "Strategic maritime strait", modernCountry: "Djibouti / Yemen" },
          { name: "Mocha & Aden", role: "Arabian incense trade harbors", modernCountry: "Yemen" },
          { name: "Zafar", role: "Himyarite royal mountain capital", modernCountry: "Yemen" }
        ],
        economicSignificance: "Maintained Aksum's trans-continental hegemony over both the African and Arabian shores of the Red Sea under King Kaleb.",
        modernLegacy: "The vital Bab el-Mandeb strait connecting Asia, Africa, and European sea lines of communication."
      }
    ],
    architecturalMonuments: ["The Obelisks of Aksum (Ezana Stele)", "Church of Our Lady Mary of Zion", "Palace of Dungur"],
    metallurgyAndArts: ["Ge'ez script development", "Gold coin minting", "Garima Gospels illuminated manuscripts", "Monolithic rock architecture"],
    unescoHeritageSites: ["Aksum (UNESCO World Heritage Site, 1980)"],
    historicalQuote: {
      text: "There are four great kingdoms on Earth: the Kingdom of Babylon and Persia, the Kingdom of Rome, the Kingdom of the Aksumites, and the Kingdom of China.",
      author: "Mani",
      source: "Kephalaia of the Teacher",
      year: "c. 270 CE"
    },
    scholarlyPublications: [
      { title: "Ancient Ethiopia: Aksum", author: "David W. Phillipson", year: 1998, publisher: "British Museum Press" },
      { title: "Aksum: An African Civilisation of Late Antiquity", author: "Stuart Munro-Hay", year: 1991, publisher: "Edinburgh University Press" }
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Kingdom_of_Aksum",
    summaryNarrative: "The Kingdom of Aksum was one of the four great classical empires of the ancient world alongside Rome, Persia, and China. Located in modern Ethiopia and Eritrea, it minted its own internationally recognized gold coinage, developed the Ge'ez script, and adopted Christianity in 330 CE.",
    economicBridge: {
      historicalCommodity: "Red Sea maritime commerce, gold minting & Frankincense exports",
      modernEquivalentSector: "Horn of Africa Renewable Energy & Red Sea Geostrategic Ports",
      modernValueMetric: "Ethiopian Grand Renaissance Dam (GERD) generates over 5,000 MW powering East African industrial development.",
      modernKeyCountries: [
        { iso3: "ETH", name: "Ethiopia", shareOfGlobalMarket: "Fastest growing economy in East Africa, top coffee producer" },
        { iso3: "ERI", name: "Eritrea", shareOfGlobalMarket: "Red Sea geostrategic coastlines & potash mining" }
      ],
      heritagePreservationStatus: "Aksum UNESCO World Heritage conservation and restoration of the Ezana Monolith."
    }
  },

  'kanem-bornu': {
    id: 'kanem-bornu',
    name: "Kanem-Bornu Empire",
    nativeName: "Kanem-Borno / Sayfawa",
    period: "c. 700 – 1900 CE",
    peakCentury: "16th Century",
    peakYear: 1580,
    region: "Central / Sahelian Africa",
    regionBadge: "Lake Chad Basin",
    color: "#dc2626",
    capital: "Njimi / Ngazargamu",
    coordinates: [13.000, 14.000],
    svgCoordinates: [2750, 2050],
    territoryPolygonPath: "M 2450,1800 Q 2950,1700 3200,1950 T 3100,2350 Q 2750,2450 2400,2200 T 2450,1800 Z",
    modernCountries: ["Chad", "Nigeria", "Niger", "Cameroon", "Libya"],
    modernIso3Codes: ["TCD", "NGA", "NER", "CMR", "LBY"],
    royalTitle: "Mai (Emperor) & Magira (Queen Mother)",
    dynasty: "Sayfawa Dynasty (c. 700–1846 CE — 1,100+ years unbroken)",
    indigenousScript: {
      scriptName: "Kanuri Royal Calligraphy & Bornu Quranic Hand",
      nativeCharacters: "Mai Idris Alooma / Sayfawa",
      phoneticSpelling: "MAH-ee of KAH-nem BOHR-noo",
      historicalUsage: "Unique ornamental Maghribi-Bornu calligraphic script recorded on leather parchment documents."
    },
    foundingNarrative: "Founded around 700 CE by the nomadic Duguwa and Sayfawa dynasties east of Lake Chad, uniting Saharan trade routes into a millennium-long imperial realm.",
    famousRulers: [
      { name: "Mai Hummay", reign: "1075 – 1086", feat: "First Muslim monarch who established Islam as state religion." },
      { name: "Mai Dunama Dibbalemi", reign: "1210 – 1248", feat: "Expanded Kanem to its territorial peak, commanding 40,000 cavalry." },
      { name: "Mai Idris Alooma", reign: "1571 – 1603", feat: "Acquired Ottoman Turkish firearms and wrote the legal code of Bornu." },
      { name: "Magira Aisa Kili", reign: "c. 1560 – 1575", feat: "Formidable Queen Mother and regent who prepared Mai Idris Alooma for statecraft." }
    ],
    dynasticTree: [
      { id: 'kb-1', name: 'Mai Hummay', title: 'First Muslim Mai', reign: '1075–1086', century: 11, type: 'monarch', feat: 'Establishment of Sayfawa Islamic Chancellery' },
      { id: 'kb-2', name: 'Grand Council of Twelve', title: 'Constitutional Milestone', reign: '1150', century: 12, type: 'constitutional_milestone', predecessorId: 'kb-1', feat: 'Kaigama Army Commander & Yerima Northern Governor' },
      { id: 'kb-3', name: 'Magira Aisa Kili', title: 'Magira (Queen Mother & Regent)', reign: '1560–1575', century: 16, type: 'queen_mother', predecessorId: 'kb-2', feat: 'Dynastic regency and constitutional stabilization' },
      { id: 'kb-4', name: 'Mai Idris Alooma', title: 'Mai (Military & Legal Reformer)', reign: '1571–1603', century: 16, type: 'monarch', predecessorId: 'kb-3', feat: 'Ottoman musketeer integration & Birni Ngazargamu capital' }
    ],
    artifacts3D: [
      {
        id: 'kanem-chainmail-armor',
        title: "Lifidi Quilted Heavy Cavalry Armor & Iron Chainmail Helmet",
        nativeTitle: "Lifidi & Sulke",
        period: "16th – 17th Century",
        material: "cast_bronze",
        dimensions: "115 cm length × 60 cm chest span",
        provenance: "Birni Ngazargamu Arsenal",
        currentLocation: "National Museum Jos / Pitt Rivers Museum Oxford",
        description: "Heavy quilted cotton armor (Lifidi) worn under riveted iron and brass chainmail (Sulke) for both horse and rider, capable of deflecting poison arrows and lances.",
        materialDetails: "Hand-forged iron rings riveted with brass links and thick kapok-stuffed quilted cotton protective padding.",
        historicalSignificance: "Equipped the feared Sayfawa armored cavalry that protected the Lake Chad basin caravan routes for over 800 years.",
        shaderType: "bronze_patina",
        accentColor: "#dc2626"
      }
    ],
    governanceSystem: "Centralized bureaucratic monarchy supported by the Grand Council of Twelve and influential royal women (Magira / Queen Mother).",
    stateCouncil: "The Grand Council of Twelve (Kaigama army chief, Yerima northern governor, and chief ministers).",
    militaryStructure: "Heavy cavalry armed with chainmail armor, quilted horse barding (Lifidi), and Ottoman-trained Turkish musketeer brigades.",
    currencySystem: "Woven cloth strips (Dandi), copper bars, and cowries.",
    majorCommodities: ["Trans-Saharan natron & salt", "Ostrich feathers", "Leather goods & horses", "Woven Bornu textiles"],
    tradeRoutes: ["Fezzan route through Bilma to Tripoli", "East-West savanna route to Nile Valley", "Southward route to Hausaland"],
    tradeCorridorPaths: [
      {
        id: 'kb-fezzan-tripoli',
        name: "Central Trans-Saharan Bilma-Fezzan Highway to Tripoli",
        commodity: 'salt',
        color: '#dc2626',
        startName: "Lake Chad (Ngazargamu)",
        endName: "Bilma Oasis, Fezzan & Tripoli",
        points: [[2750, 2100], [2820, 1680], [2750, 1250], [2680, 780]],
        flowDirection: 'north',
        volumeDescription: "Continuous millennium-long trans-Saharan trade route transporting Bilma natron, ostrich feathers, and high-grade leather to Mediterranean ports.",
        activeCenturies: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        kingdomId: 'kanem-bornu',
        kingdomName: "Kanem-Bornu Empire",
        transportMode: 'camel_caravan',
        historicalPeriod: "8th – 19th Century CE",
        cargoTypes: ["Bilma natron salt", "Ostrich plumes", "Tanned Bornu red leather", "Muskets", "Venetian trade glass"],
        keyStops: [
          { name: "Birni Ngazargamu", role: "Burnt-brick imperial capital and Sayfawa court", modernCountry: "Nigeria" },
          { name: "Bilma Salt Escarpment", role: "Vital Saharan natron and salt mines", modernCountry: "Niger" },
          { name: "Murzuk (Fezzan)", role: "Great desert caravanserai and customs depot", modernCountry: "Libya" },
          { name: "Port of Tripoli", role: "Ottoman regency and Mediterranean maritime outlet", modernCountry: "Libya" }
        ],
        economicSignificance: "One of the oldest continuously operated trans-Saharan highways in world history, sustaining the Sayfawa dynasty for over a thousand years.",
        historicalQuote: {
          text: "The King of Bornu has Turkish musketeers and cavalry clad in chain mail... his empire is rich, tranquil, and celebrated for scholars.",
          author: "Imam Ahmad ibn Fartuwa",
          source: "The Bornu Chronicle",
          year: "1576"
        },
        modernLegacy: "Precursor to the modern Trans-Sahara Highway (Algiers-Lagos / Tripoli corridor)."
      }
    ],
    architecturalMonuments: ["The Fortified Red-Brick City of Birni Ngazargamu (200,000 residents, 7m brick walls)", "Sayfawa royal mosques"],
    metallurgyAndArts: ["Cavalry chainmail (Lifidi)", "Bornu Calligraphic Script Quranic folios", "Indigo textile weaving"],
    unescoHeritageSites: ["Lake Chad Cultural Landscape (Tentative UNESCO List)"],
    historicalQuote: {
      text: "The King of Bornu has Turkish musketeers and cavalry clad in chain mail... his empire is rich, tranquil, and celebrated for scholars.",
      author: "Imam Ahmad ibn Fartuwa",
      source: "The Bornu Chronicle",
      year: "1576"
    },
    scholarlyPublications: [
      { title: "A History of the Kanuri Language and Sayfawa State", author: "Norbert Cyffer", year: 1989, publisher: "Rüdiger Köppe" },
      { title: "The Bornu Sahara and Sudan", author: "Sir Richmond Palmer", year: 1936, publisher: "John Murray" }
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Kanem%E2%80%93Bornu_Empire",
    summaryNarrative: "The Kanem-Bornu Empire was one of the longest-lasting sovereign states in human history, enduring for over a thousand years in the Lake Chad basin. Ruled by the Sayfawa dynasty, it commanded vital trans-Saharan trade corridors to Tripoli, fielded armored chainmail cavalry, and was celebrated for its scholastic institutions.",
    economicBridge: {
      historicalCommodity: "Trans-Saharan natron mining, leather craft & oasis agriculture",
      modernEquivalentSector: "Lake Chad Basin Water Conservation & Trans-Saharan Highway",
      modernValueMetric: "Lake Chad basin supports over 30 million people in livestock, agriculture, and cross-border commercial transit.",
      modernKeyCountries: [
        { iso3: "TCD", name: "Chad", shareOfGlobalMarket: "Central African livestock and crude oil exporter" },
        { iso3: "NER", name: "Niger", shareOfGlobalMarket: "Uranium and Trans-Saharan trade crossroads" }
      ],
      heritagePreservationStatus: "Archaeological preservation of Birni Ngazargamu burnt-brick city ramparts."
    }
  },

  'songhai-empire': {
    id: 'songhai-empire',
    name: "Songhai Empire",
    nativeName: "Songhay / Kawkaw",
    period: "c. 1464 – 1591 CE",
    peakCentury: "15th–16th Century",
    peakYear: 1520,
    region: "Sahelian West Africa",
    regionBadge: "Sahelian West",
    color: "#2563eb",
    capital: "Gao (with secondary capital at Timbuktu)",
    coordinates: [16.272, -0.044],
    svgCoordinates: [1650, 1750],
    territoryPolygonPath: "M 1150,1500 Q 1850,1300 2250,1600 T 2150,2050 Q 1650,2200 1100,1950 T 1150,1500 Z",
    modernCountries: ["Mali", "Niger", "Nigeria", "Mauritania", "Senegal", "Burkina Faso"],
    modernIso3Codes: ["MLI", "NER", "NGA", "MRT", "SEN", "BFA"],
    royalTitle: "Askia ('Emperor of Songhai')",
    dynasty: "Askia Dynastic House",
    indigenousScript: {
      scriptName: "Timbuktu Scholastic Arabic-Ajami Script",
      nativeCharacters: "Askia Muhammad / Sankore",
      phoneticSpelling: "ahs-KEE-ah of SOHNG-hye",
      historicalUsage: "Over 700,000 illuminated manuscripts in astronomy, medicine, jurisprudence, and mathematics produced in Timbuktu."
    },
    foundingNarrative: "Rose to imperial zenith under Sonni Ali Ber (1464–1492) with a war fleet of 400 canoes, followed by Askia Muhammad I who organized centralized ministries and university institutions.",
    famousRulers: [
      { name: "Sonni Ali Ber", reign: "1464 – 1492", feat: "Conquered Timbuktu and Djenné; forged the largest territorial empire in West Africa." },
      { name: "Askia the Great (Muhammad I)", reign: "1493 – 1528", feat: "Standardized weights and measures; elevated the University of Sankoré." },
      { name: "Askia Daoud", reign: "1549 – 1582", feat: "Presided over the golden age of peace and built vast libraries across Gao and Timbuktu." }
    ],
    dynasticTree: [
      { id: 'songhai-1', name: 'Sonni Ali Ber', title: 'Sonni (Emperor & Fleet Commander)', reign: '1464–1492', century: 15, type: 'monarch', feat: 'Niger River war flotilla & imperial expansion' },
      { id: 'songhai-2', name: 'Askia the Great (Muhammad I)', title: 'Askia (Administrative Reformer)', reign: '1493–1528', century: 15, type: 'monarch', predecessorId: 'songhai-1', feat: 'Weights & measures standardization, Sankore patron' },
      { id: 'songhai-3', name: 'Imperial Administrative Council', title: 'Constitutional Milestone', reign: '1500', century: 16, type: 'constitutional_milestone', predecessorId: 'songhai-2', feat: 'Hi-Koy Naval Admiral & Fari-Mondyo Tax Ministries' }
    ],
    artifacts3D: [
      {
        id: 'timbuktu-astronomy-manuscript',
        title: "Timbuktu Illuminated Astronomical & Mathematical Treatise",
        nativeTitle: "Timbuktu Manuscript on Celestial Mechanics",
        period: "16th Century",
        material: "illuminated_parchment",
        dimensions: "28 cm × 21 cm × 4.5 cm",
        provenance: "Ahmed Baba Institute of Higher Islamic Studies, Timbuktu",
        currentLocation: "Ahmed Baba Institute / Mamma Haidara Commemorative Library",
        description: "Illuminated scientific manuscript featuring planetary orbit diagrams, lunar calculations, and trigonometric tables written in gold and vermilion calligraphic inks.",
        materialDetails: "Handmade rag paper bound in embossed goat leather with natural plant inks and gold leaf highlighting.",
        historicalSignificance: "Proves the existence of advanced indigenous scientific research in astronomy and optics centuries before colonial contact.",
        shaderType: "aged_manuscript",
        accentColor: "#2563eb"
      }
    ],
    governanceSystem: "Centralized imperial bureaucracy with specialized ministries (Finance, Agriculture, Justice, Navigation) and imperial governors (Faris).",
    stateCouncil: "Imperial Supreme Council (Hi-Koy admiral of the fleet, Fari-Mondyo tax inspector, Chief Qadi supreme justice).",
    militaryStructure: "Standing army of 30,000 infantry and 10,000 armored cavalry, supported by the Niger River war flotilla.",
    currencySystem: "Gold dinars and mithqals, standardized salt slabs (Taghaza), and cowrie shells.",
    majorCommodities: ["Trans-Saharan salt slabs", "Gold ingots", "Scholarly manuscripts", "Kola nuts", "Gum arabic"],
    tradeRoutes: ["Western Trans-Saharan route to Marrakech", "Eastern route to Tripoli & Cairo", "Niger River waterway"],
    tradeCorridorPaths: [
      {
        id: 'songhai-niger-flotilla',
        name: "Niger River Imperial Flotilla Grain & Gold Highway",
        commodity: 'gold',
        color: '#2563eb',
        startName: "Djenné & Timbuktu",
        endName: "Gao & Hausaland Emporia",
        points: [[1520, 1950], [1620, 1800], [1780, 1850], [2020, 2020], [2250, 2100]],
        flowDirection: 'east',
        volumeDescription: "2,000 km fluvial transit corridor moving agricultural grain surplus, dried river fish, salt slabs, and gold with a standing navy of 400 war canoes.",
        activeCenturies: [15, 16],
        kingdomId: 'songhai-empire',
        kingdomName: "Songhai Empire",
        transportMode: 'riverine_flotilla',
        historicalPeriod: "15th – 16th Century CE",
        cargoTypes: ["Surplus grain & millet", "Smoked Niger fish", "Gold dinars", "Manuscripts", "Salt slabs"],
        keyStops: [
          { name: "Djenné", role: "Inland Niger Delta agricultural capital", modernCountry: "Mali" },
          { name: "Timbuktu", role: "University of Sankoré & library collections", modernCountry: "Mali" },
          { name: "Gao", role: "Imperial capital of Askia the Great", modernCountry: "Mali" },
          { name: "Niamey Bend", role: "Riverine toll checkpoint", modernCountry: "Niger" },
          { name: "Kebbi / Kano", role: "Hausa textile and metalworking emporia", modernCountry: "Nigeria" }
        ],
        economicSignificance: "Patrolled by a standing imperial navy of 400 war canoes commanded by the Hi-Koy (Grand Admiral of the Songhai Fleet).",
        modernLegacy: "The primary navigational lifeline of the Niger Basin Authority serving 100M+ people."
      }
    ],
    architecturalMonuments: ["Tomb of Askia in Gao (monumental mud-brick pyramidal mausoleum)", "University of Sankoré in Timbuktu", "Great Mosque of Djenné"],
    metallurgyAndArts: ["700,000 Timbuktu manuscripts", "Sudano-Sahelian monumental architecture", "Filigree gold jewelry"],
    unescoHeritageSites: ["Tomb of Askia (UNESCO World Heritage Site, 2004)", "Timbuktu Mosques and Shrines (1988)"],
    historicalQuote: {
      text: "In Timbuktu there are numerous judges, scholars, and priests... Many books and manuscripts are imported and sold here for more money than any other merchandise.",
      author: "Leo Africanus",
      source: "Description of Africa",
      year: "1526"
    },
    scholarlyPublications: [
      { title: "Timbuktu and the Songhay Empire", author: "John O. Hunwick", year: 1999, publisher: "Brill" },
      { title: "The UNESCO General History of Africa: Vol. IV", author: "D.T. Niane", year: 1984, publisher: "UNESCO" }
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Songhai_Empire",
    summaryNarrative: "The Songhai Empire was the largest and most powerful state in West African history. Spanning thousands of kilometers along the Niger River, it was renowned for its sophisticated administrative ministries, vast library collections in Timbuktu, and rigorous standardization of weights, measures, and judicial law.",
    economicBridge: {
      historicalCommodity: "Trans-Saharan scholastic trade, salt-gold standardization & river navigation",
      modernEquivalentSector: "Sahelian Digital Knowledge Economy & Agritech Irrigation",
      modernValueMetric: "Niger River Basin Authority oversees river management for over 100 million people across 9 countries.",
      modernKeyCountries: [
        { iso3: "NER", name: "Niger", shareOfGlobalMarket: "Key agricultural and transit corridor" },
        { iso3: "BFA", name: "Burkina Faso", shareOfGlobalMarket: "Major West African gold and cotton producer" }
      ],
      heritagePreservationStatus: "Tomb of Askia conservation and international Timbuktu manuscript preservation network."
    }
  },

  'dahomey-kingdom': {
    id: 'dahomey-kingdom',
    name: "Kingdom of Dahomey",
    nativeName: "Danxome / Danhomè",
    period: "c. 1600 – 1904 CE",
    peakCentury: "18th–19th Century",
    peakYear: 1850,
    region: "Western Africa",
    regionBadge: "Western Africa",
    color: "#ca8a04",
    capital: "Abomey",
    coordinates: [7.183, 1.983],
    svgCoordinates: [2100, 2360],
    territoryPolygonPath: "M 1980,2240 Q 2180,2220 2250,2320 T 2220,2500 Q 2120,2540 2000,2460 T 1980,2240 Z",
    modernCountries: ["Benin"],
    modernIso3Codes: ["BEN"],
    royalTitle: "Ahosu (King of Danxome)",
    dynasty: "Alladahonu Dynastic Lineage",
    indigenousScript: {
      scriptName: "Fon Royal Bas-Reliefs & Pictorial Appliqué Banners",
      nativeCharacters: "Axɔ́sú Dànhòmɛ̀ / Ahosi (Mino)",
      phoneticSpelling: "ah-HOH-soo of DAHN-hoh-may",
      historicalUsage: "Polychrome clay bas-reliefs on palace walls and vivid Appliqué banners recording military victories and royal proverbs."
    },
    foundingNarrative: "Founded around 1600 by Do-Aklin on the Abomey plateau, transformed into a regional power by King Houegbadja and King Agaja who expanded to the coast at Whydah.",
    famousRulers: [
      { name: "Houegbadja", reign: "c. 1645 – 1685", feat: "Architect of Dahomean statutory law and meritocratic administration." },
      { name: "Agaja (Trudo)", reign: "1718 – 1740", feat: "Conquered Whydah (Ouidah) to open direct diplomatic relations with Europe." },
      { name: "Ghezo", reign: "1818 – 1858", feat: "Reformed the economy toward palm oil production and expanded the Ahosi female combat regiments." },
      { name: "Seh-Dong-Hong-Beh", reign: "c. 1850", feat: "Famed Supreme Leader of the Ahosi female army." }
    ],
    dynasticTree: [
      { id: 'dahomey-1', name: 'Houegbadja', title: 'Founding Ahosu', reign: '1645–1685', century: 17, type: 'monarch', feat: 'Establishment of statutory royal law and taxation' },
      { id: 'dahomey-2', name: 'Agaja', title: 'Ahosu (Coastal Expansion)', reign: '1718–1740', century: 18, type: 'monarch', predecessorId: 'dahomey-1', feat: 'Capture of Ouidah & direct Atlantic diplomacy' },
      { id: 'dahomey-3', name: 'Ahosi Military Institutionalization', title: 'Constitutional Milestone', reign: '1720', century: 18, type: 'constitutional_milestone', predecessorId: 'dahomey-2', feat: 'Formalization of the 6,000-strong all-female frontline combat corps' },
      { id: 'dahomey-4', name: 'Seh-Dong-Hong-Beh', title: 'Supreme General of the Ahosi', reign: 'c. 1850', century: 19, type: 'queen_mother', predecessorId: 'dahomey-3', feat: 'Command of the Mino regiments' }
    ],
    artifacts3D: [
      {
        id: 'dahomey-makpo-scepter',
        title: "Royal Silver Recurve Scepter (Makpo of King Ghezo)",
        nativeTitle: "Mákpó (Royal Weapon-Scepter)",
        period: "19th Century (c. 1830)",
        material: "cast_bronze",
        dimensions: "58 cm × 16 cm × 4 cm",
        provenance: "Royal Palaces of Abomey",
        currentLocation: "Musée Historique d'Abomey / Musée du Quai Branly",
        description: "Ornate silver-sheathed hardwood ceremonial weapon-scepter carved with the buffalo motif of King Ghezo, carried by royal ambassadors as sovereign credentials.",
        materialDetails: "Hardwood core encased with hammered repoussé silver plates and brass pins.",
        historicalSignificance: "Represented the absolute diplomatic authority of the Ahosu; royal couriers holding the Makpo were granted immediate right of way.",
        shaderType: "bronze_patina",
        accentColor: "#ca8a04"
      },
      {
        id: 'dahomey-palace-relief',
        title: "Polychrome Clay Palace Bas-Relief of the Lion King",
        nativeTitle: "Palace Bas-Relief of King Glele",
        period: "19th Century",
        material: "terracotta",
        dimensions: "72 cm × 72 cm × 8 cm",
        provenance: "Hall of King Glele, Royal Palaces of Abomey",
        currentLocation: "Royal Palaces of Abomey Site Museum",
        description: "Vibrant high-relief polychrome earth bas-relief depicting the royal lion of King Glele clutching a captured battle weapon, celebrating sovereign invincibility.",
        materialDetails: "Fired local laterite clay with natural pigment washes (ochre, kaolin, indigo).",
        historicalSignificance: "UNESCO World Heritage cultural artifact illustrating the historical chronicles of the Alladahonu dynasty.",
        shaderType: "granite_grain",
        accentColor: "#eab308"
      }
    ],
    governanceSystem: "Centralized militarized monarchy with a meritocratic civil service, precise census taking (Kpe), and female co-ministers (Naye).",
    stateCouncil: "The Migan (prime minister) and Meu (finance minister), vetted in parallel by the Naye.",
    militaryStructure: "Professional standing army renowned for the Ahosi (Mino / 'Dahomey Amazons') — 6,000-strong all-female frontline combat corps.",
    currencySystem: "Cowrie shells strung into uniform counts (kaki & cordes) and European silver talers.",
    majorCommodities: ["Palm oil", "Appliqué tapestries", "Cast brass sculptures", "Agricultural produce"],
    tradeRoutes: ["Royal Highway from Abomey to Ouidah", "Trans-savanna routes to Borgu", "Atlantic port of Ouidah"],
    tradeCorridorPaths: [
      {
        id: 'dahomey-ouidah-palm',
        name: "Abomey Royal Highway to Port of Ouidah",
        commodity: 'kola',
        color: '#ca8a04',
        startName: "Abomey Royal Palaces",
        endName: "Port of Ouidah (Bight of Benin)",
        points: [[2200, 2480], [2210, 2540], [2220, 2600]],
        flowDirection: 'south',
        volumeDescription: "Large-scale conveyance of thousands of puncheons of palm oil driving West Africa's 19th-century agricultural export revolution.",
        activeCenturies: [18, 19],
        kingdomId: 'dahomey-kingdom',
        kingdomName: "Kingdom of Dahomey",
        transportMode: 'forest_porters',
        historicalPeriod: "18th – 19th Century CE",
        cargoTypes: ["Palm oil casks", "Appliqué banners", "Brass bocio sculptures", "European flintlock muskets"],
        keyStops: [
          { name: "Royal Palaces of Abomey", role: "Alladahonu royal court and agricultural estates", modernCountry: "Benin" },
          { name: "Allada", role: "Regional grain and palm clearinghouse", modernCountry: "Benin" },
          { name: "Port of Ouidah (Whydah)", role: "Atlantic deepwater trade beach and European lodges", modernCountry: "Benin" }
        ],
        economicSignificance: "Spearheaded the 19th-century palm oil export revolution that sustained Dahomey's economic independence.",
        modernLegacy: "Precursor to the modern Cotonou-Parakou transport corridor in Benin."
      }
    ],
    architecturalMonuments: ["Royal Palaces of Abomey (ten interconnected palace complexes covering 47 hectares)", "Fort of Ouidah"],
    metallurgyAndArts: ["Polychrome clay bas-reliefs", "Pictorial Appliqué cloth banners", "Cast bronze bocio sculptures", "Royal thrones"],
    unescoHeritageSites: ["Royal Palaces of Abomey (UNESCO World Heritage Site, 1985)"],
    historicalQuote: {
      text: "The discipline of the Amazons was extraordinary; they were armed with blunderbusses, flintlocks, and huge razors, moving with ferocious courage.",
      author: "Sir Richard Burton",
      source: "A Mission to Gelele, King of Dahome",
      year: "1864"
    },
    scholarlyPublications: [
      { title: "The Kingdom of Dahomey", author: "Karl Polanyi", year: 1966, publisher: "Northwestern University Press" },
      { title: "Royal Arts of Africa", author: "Suzanne Preston Blier", year: 1998, publisher: "Laurence King" }
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Dahomey",
    summaryNarrative: "Dahomey was a highly organized pre-colonial West African state that dominated the Bight of Benin from the 17th through late 19th century. Renowned for its meritocratic administration, architectural bas-reliefs in Abomey, and the famed Ahosi female combat regiments, it mounted formidable resistance against European colonization.",
    economicBridge: {
      historicalCommodity: "Palm oil export revolution, bronze regalia & palace architecture",
      modernEquivalentSector: "Port of Cotonou Logistics, Cotton & Agribusiness",
      modernValueMetric: "Port of Cotonou processes over 12 million tons of cargo annually as the vital maritime transit hub for the Sahel.",
      modernKeyCountries: [{ iso3: "BEN", name: "Benin", shareOfGlobalMarket: "Major West African transit port & cotton producer" }],
      heritagePreservationStatus: "Restoration of the UNESCO Royal Palaces of Abomey and Ouidah Heritage Route."
    }
  }
};

export const TOPONYM_CONCORDANCE_INDEX: ToponymConcordanceItem[] = [
  {
    antiqueName: "Congo Regnum / Manicongo",
    plateSource: "1690 Visscher & 1747 Bowen",
    indigenousName: "Kongo dya Ntotila",
    modernName: "M'banza-Kongo / Congo Basin",
    modernCountry: "Angola / DR Congo",
    category: "polity",
    coordinates: [-6.267, 14.242],
    svgCoordinates: [2950, 3520],
    note: "Prominently inscribed across 17th–18th century Dutch and English atlases as the supreme sovereign kingdom of Central Africa."
  },
  {
    antiqueName: "Empire of Monomotapa",
    plateSource: "1747 Bowen & 1787 Cary",
    indigenousName: "Wene weMutapa / Great Zimbabwe",
    modernName: "Masvingo & Zimbabwe Plateau",
    modernCountry: "Zimbabwe / Mozambique",
    category: "polity",
    coordinates: [-20.267, 30.933],
    svgCoordinates: [3980, 4640],
    note: "Legendary gold-producing Shona empire celebrated in Portuguese cartography for its dry-stone granite citadels."
  },
  {
    antiqueName: "Negroland / Nigritia",
    plateSource: "1690 Visscher, 1747 Bowen, 1787 Cary",
    indigenousName: "Bilad al-Sudan / Manden / Songhay",
    modernName: "Sahel & Niger River Basin",
    modernCountry: "Mali / Niger / Nigeria",
    category: "polity",
    coordinates: [14.0, 0.0],
    svgCoordinates: [1650, 1850],
    note: "Archival European blanket term for the vast Sahelian urban empires of Mali, Songhai, and Hausaland."
  },
  {
    antiqueName: "Kingdom of Benin / Oedo",
    plateSource: "1690 Visscher & 1747 Bowen",
    indigenousName: "Ẹ̀dó / Ìbínú",
    modernName: "Benin City",
    modernCountry: "Nigeria",
    category: "metropolis",
    coordinates: [6.335, 5.603],
    svgCoordinates: [2360, 2520],
    note: "Celebrated on archival maritime charts for its enormous urban walls and diplomatic court of the Oba."
  },
  {
    antiqueName: "Kingdom of Juda / Fida / Ajuda",
    plateSource: "1747 Bowen & 1787 Cary",
    indigenousName: "Whydah / Ouidah / Xwéda",
    modernName: "Ouidah",
    modernCountry: "Benin",
    category: "metropolis",
    coordinates: [6.363, 2.085],
    svgCoordinates: [2160, 2550],
    note: "The primary maritime port of the Kingdom of Dahomey, marked by Portuguese, French, and English trading lodges."
  },
  {
    antiqueName: "Abissinia / Kingdom of Tigre / Axum",
    plateSource: "1690 Visscher & 1787 Cary",
    indigenousName: "መንግሥተ አክሱም (Mängəśtä Aksum)",
    modernName: "Aksum / Tigray",
    modernCountry: "Ethiopia",
    category: "polity",
    coordinates: [14.133, 38.717],
    svgCoordinates: [4200, 2050],
    note: "Ancient classical civilization recognized on world maps since Ptolemy for its monolithic stelae and Red Sea trade."
  },
  {
    antiqueName: "Kingdom of Bornou / Lake Chad",
    plateSource: "1747 Bowen & 1805 Carey",
    indigenousName: "Kanem-Borno",
    modernName: "Birni Ngazargamu / Lake Chad",
    modernCountry: "Nigeria / Chad",
    category: "polity",
    coordinates: [13.0, 14.0],
    svgCoordinates: [2750, 2050],
    note: "Centuries-long Sayfawa Islamic empire dominating trans-Saharan trade to the Mediterranean."
  },
  {
    antiqueName: "Mountains of the Moon (Lunae Montes)",
    plateSource: "1690 Visscher, 1747 Bowen, 1787 Cary, 1805 Carey",
    indigenousName: "Rwenzori (The Rainmaker Mountains)",
    modernName: "Rwenzori Mountains",
    modernCountry: "Uganda / DR Congo",
    category: "mountain",
    coordinates: [0.383, 29.867],
    svgCoordinates: [3620, 3100],
    note: "Legendary Ptolemaic mountain range believed on historic maps to be the source of the White Nile."
  },
  {
    antiqueName: "Gold Coast / Coast of Guinea",
    plateSource: "1690 Visscher & 1747 Bowen",
    indigenousName: "Asanteman / Akan Coast",
    modernName: "Elmina, Cape Coast, Kumasi",
    modernCountry: "Ghana",
    category: "coast",
    coordinates: [5.1, -1.2],
    svgCoordinates: [1865, 2580],
    note: "The primary gold-exporting littoral of West Africa governed by the Ashanti and Fante confederacies."
  }
];

export const ALL_TRADE_CORRIDORS: TradeCorridorPath[] = Object.values(DETAILED_KINGDOMS_DATA).flatMap(k => k.tradeCorridorPaths);

export function getTradeCorridorById(id: string): TradeCorridorPath | undefined {
  return ALL_TRADE_CORRIDORS.find(c => c.id === id);
}

