export interface HistoricalMapPlate {
  id: string;
  title: string;
  cartographer: string;
  year: string;
  century: string;
  region: string;
  imageUrl: string;
  fallbackUrls?: string[];
  thumbnailUrl: string;
  source: string;
  institution: string;
  description: string;
  historicalSignificance: string;
  toponymsToObserve: string[];
  homographyBounds: {
    north: number;
    south: number;
    west: number;
    east: number;
  };
  svgOverlayTransform?: {
    scale: number;
    offsetX: number;
    offsetY: number;
  };
}

export interface PreColonialEntity {
  id: string;
  name: string;
  period: string;
  region: string;
  regionBadge: string;
  capital: string;
  coordinates: [number, number]; // [lat, lng]
  svgCoordinates: [number, number]; // [svgX, svgY] in native 5796x5867 coordinate space
  modernCountries: string[];
  significance: string;
  tradeSpecialty: string;
  color: string;
}

export interface OceanCurrentDef {
  id: string;
  name: string;
  type: 'cold' | 'warm' | 'equatorial';
  flowDirection: string;
  velocityKnots: string;
  description: string;
  historicalImpact: string;
  pathCoordinates: Array<[number, number]>; // [lat, lng]
}

export interface SeasonalWindRegime {
  id: 'q1' | 'q2' | 'q3' | 'q4';
  seasonName: string;
  months: string;
  tradeWindsBehavior: string;
  itczPosition: string;
  transatlanticPassageDurationDays: {
    senegambiaToCaribbean: number;
    bightOfBeninToBahia: number;
    angolaToRioDeJaneiro: number;
    mozambiqueToBrazil: number;
  };
  mortalityImpactNote: string;
  harmattanIntensity: 'Low' | 'Moderate' | 'Severe';
}

export const HISTORICAL_MAP_PLATES: HistoricalMapPlate[] = [
  {
    id: 'danville-1749',
    title: "Afrique Publiée sous les Auspices de Monseigneur le Duc d'Orléans",
    cartographer: "Jean-Baptiste Bourguignon d'Anville",
    year: "1749",
    century: "18th Century (Enlightenment)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/danville-1749.jpg",
    fallbackUrls: [
      "https://gallica.bnf.fr/iiif/ark:/12148/btv1b53053165w/f1/full/1600,/0/native.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/79/Afrique_-_publi%C3%A9e_sous_les_auspices_de_Monseigneur_le_Duc_d%27Orl%C3%A9ans..._par_le_Sr_d%27Anville_%3B_grav%C3%A9_par_Guill%27Delahaye_-_btv1b53053165w.jpg"
    ],
    thumbnailUrl: "/cartography/danville-1749.jpg",
    source: "Jean-Baptiste Bourguignon d'Anville, Paris (1749). Hand-colored copperplate engraving.",
    institution: "Bibliothèque nationale de France / Geographicus Rare Maps Collection",
    description: "A landmark in scientific cartography. D'Anville famously excised mythical geographic features (such as the speculative Lake Ptolemy and imaginary Central African mountain ranges), leaving uncharted interior zones blank ('terra incognita') while meticulously detailing the maritime coasts.",
    historicalSignificance: "Initiated modern empirical cartography of Africa by refusing to fill inland voids with speculative kingdoms or mythical creatures.",
    toponymsToObserve: [
      "Guinée Septentrionale & Méridionale",
      "Royaume de Juda (Whydah / Dahomey)",
      "Côte de l'Or (Gold Coast)",
      "Côte des Dents (Ivory Coast)",
      "Côte des Esclaves (Slave Coast)",
      "Royaume de Congo",
      "Nigritie / Soudan"
    ],
    homographyBounds: {
      north: 37.5,
      south: -35.2,
      west: -20.5,
      east: 52.0
    },
    svgOverlayTransform: {
      scale: 1.0,
      offsetX: 0,
      offsetY: 0
    }
  },
  {
    id: 'blaeu-1644',
    title: "Africae nova descriptio (New Description of Africa)",
    cartographer: "Willem Janszoon Blaeu",
    year: "1644",
    century: "17th Century (Golden Age of Dutch Cartography)",
    region: "Pan-African Continental & Atlantic Rim",
    imageUrl: "/cartography/blaeu-1644.jpg",
    fallbackUrls: [
      "https://gallica.bnf.fr/iiif/ark:/12148/btv1b8468537z/f1/full/1600,/0/native.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/Blaeu_Africae_Nova_Descriptio_1617_UTA.jpg"
    ],
    thumbnailUrl: "/cartography/blaeu-1644.jpg",
    source: "Willem Blaeu, Theatrum Orbis Terrarum, Amsterdam (1644). Copperplate with original hand wash.",
    institution: "University of Amsterdam Special Collections / Library of Congress",
    description: "One of the most famous and visually ornate baroque maps of Africa. Decorated with side panels depicting indigenous African peoples in regional dress and top border vignettes of nine major ports (Alexandria, Algiers, Cairo, Mina, Mozambique, etc.).",
    historicalSignificance: "Illustrates 17th-century European geographic understanding prior to the interior exploration era, detailing coastal trading forts from Senegambia to the Cape of Good Hope.",
    toponymsToObserve: [
      "Barbaria (Maghreb)",
      "Biafara Regnum",
      "Monomotapa Regnum (Great Zimbabwe)",
      "Zanguebar (Swahili Coast)",
      "Caput Bonae Spei (Cape of Good Hope)",
      "Congo Regnum",
      "Aethiopia Superior & Inferior"
    ],
    homographyBounds: {
      north: 38.0,
      south: -36.0,
      west: -22.0,
      east: 54.0
    },
    svgOverlayTransform: {
      scale: 1.04,
      offsetX: 2,
      offsetY: 0
    }
  },
  {
    id: 'sanson-1656',
    title: "Afrique Divisée en ses Principaux Empires, Royaumes et Estats",
    cartographer: "Nicolas Sanson d'Abbeville",
    year: "1656",
    century: "17th Century (French Royal Cartography)",
    region: "Pan-African & Atlantic Maritime Corridors",
    imageUrl: "/cartography/sanson-1656.jpg",
    fallbackUrls: [
      "https://gallica.bnf.fr/iiif/ark:/12148/btv1b8468494n/f1/full/1600,/0/native.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/Afrique._Par_le_Sur._Sanson_d%27Abbeville%2C_Geographe_du_Roy._Avec_privilege_pour_vingtans._A_Paris_chez_l%27Autheur._1656._A._%28IA_dr_afrique-par-le-sur-sanson-dabbeville-geographe-du-roy-avec-privilege-p-11575005%29.jpg"
    ],
    thumbnailUrl: "/cartography/sanson-1656.jpg",
    source: "Nicolas Sanson, Geographer to the King of France, Paris (1656).",
    institution: "Bibliothèque nationale de France, Département Cartes et Plans",
    description: "Published under the patronage of Louis XIV, this map highlights the political units and trans-Saharan trading routes recognized by French royal geographers in the mid-17th century.",
    historicalSignificance: "Demonstrates early French mapping of West African river basins (Senegal and Gambia rivers) and their connection to Atlantic commerce.",
    toponymsToObserve: [
      "Royaume de Tombut (Timbuktu)",
      "Royaume de Benin",
      "Guinée Proprement Dite",
      "Borno Regnum (Kanem-Bornu)",
      "Abissinie (Ethiopia)",
      "Costa d'Ambra"
    ],
    homographyBounds: {
      north: 37.0,
      south: -35.0,
      west: -21.0,
      east: 53.0
    },
    svgOverlayTransform: {
      scale: 1.0,
      offsetX: 0,
      offsetY: 0
    }
  },
  {
    id: 'bonne-1780',
    title: "Carte de l'Afrique Divisée en ses Principaux Etats",
    cartographer: "Rigobert Bonne (Ingénieur-Hydrographe de la Marine)",
    year: "1780",
    century: "18th Century (French Enlightenment)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/bonne-1780.jpg",
    fallbackUrls: [
      "/cartography/danville-1749.jpg",
      "https://gallica.bnf.fr/iiif/ark:/12148/btv1b530275597/f1/full/1600,/0/native.jpg"
    ],
    thumbnailUrl: "/cartography/bonne-1780.jpg",
    source: "Rigobert Bonne, Atlas Encyclopédique, Paris (1780). Copperplate engraving with hand coloring.",
    institution: "Dépôt de la Marine / Bibliothèque nationale de France",
    description: "An authoritative late 18th-century Enlightenment map of the entire African continent by the Royal Hydrographer to the King of France. Characterized by scientific coastal trigonometrical accuracy, crisp French toponyms, and precise delineations of regional kingdoms.",
    historicalSignificance: "Represents the culmination of 18th-century continental copperplate cartography prior to the 19th-century colonial scramble, accurately charting major maritime capes, coastal kingdoms, and trans-Saharan corridors.",
    toponymsToObserve: [
      "Barbarie & Royaumes de Fez et Maroc",
      "Nigritie & Haute Guinée",
      "Côte d'Or & Côte des Esclaves",
      "Royaumes de Benin, Juda et d'Ardres",
      "Royaume de Congo & Angola",
      "Aethiopie / Nubie / Abyssinie",
      "Monomotapa & Terres des Cafres"
    ],
    homographyBounds: {
      north: 37.5,
      south: -35.0,
      west: -21.0,
      east: 53.0
    },
    svgOverlayTransform: {
      scale: 1.0,
      offsetX: 0,
      offsetY: 0
    }
  }
];

export const PRE_COLONIAL_ENTITIES: PreColonialEntity[] = [
  {
    id: 'kongo-kingdom',
    name: "Kingdom of Kongo (Kongo dya Ntotila)",
    period: "c. 1390 – 1914",
    region: "Central Africa",
    regionBadge: "Central Africa",
    capital: "M'banza-Kongo (São Salvador)",
    coordinates: [-6.267, 14.242],
    svgCoordinates: [2950, 3520],
    modernCountries: ["Angola", "DR Congo", "Congo", "Gabon"],
    significance: "One of the most centralized pre-colonial states in Central Africa, with sophisticated metallurgy, currency (nzimbu shells), and early diplomatic ties with Lisbon and Rome.",
    tradeSpecialty: "Textiles, copper, ivory, and raffia cloth",
    color: "#9333ea"
  },
  {
    id: 'oyo-empire',
    name: "Oyo Empire",
    period: "c. 1300 – 1896",
    region: "Western Africa",
    regionBadge: "Western Africa",
    capital: "Oyo-Ile (Old Oyo)",
    coordinates: [8.983, 4.317],
    svgCoordinates: [2280, 2380],
    modernCountries: ["Nigeria", "Benin", "Togo"],
    significance: "Yoruba cavalry empire governing extensive trade routes between the Niger River and the Atlantic coast; renowned for the Alaafin executive and the Oyo Mesi council of state.",
    tradeSpecialty: "Horses, textiles, brasswork, agricultural surplus",
    color: "#16a34a"
  },
  {
    id: 'dahomey-kingdom',
    name: "Kingdom of Dahomey (Danxome)",
    period: "c. 1600 – 1904",
    region: "Western Africa",
    regionBadge: "Western Africa",
    capital: "Abomey",
    coordinates: [7.183, 1.983],
    svgCoordinates: [2100, 2360],
    modernCountries: ["Benin"],
    significance: "Highly militarized Fon kingdom noted for the Ahosi (all-female frontline military corps / Dahomey Amazons) and intricate bronze bas-relief palace architecture.",
    tradeSpecialty: "Palm oil, woven cloths, brass casting",
    color: "#ca8a04"
  },
  {
    id: 'ashanti-empire',
    name: "Ashanti Empire (Asanteman)",
    period: "1701 – 1957",
    region: "Western Africa",
    regionBadge: "Western Africa",
    capital: "Kumasi",
    coordinates: [6.688, -1.624],
    svgCoordinates: [1865, 2460],
    modernCountries: ["Ghana", "Ivory Coast"],
    significance: "Federation of Akan states unified under Osei Tutu I and the sacred Golden Stool (Sika Dwa Kofi); master goldsmiths and formidable military strategists.",
    tradeSpecialty: "Gold dust (sika), kente textiles, kola nuts",
    color: "#ea580c"
  },
  {
    id: 'benin-kingdom',
    name: "Kingdom of Benin (Edo)",
    period: "c. 1180 – 1897",
    region: "Western Africa",
    regionBadge: "Western Africa",
    capital: "Edo (Benin City)",
    coordinates: [6.335, 5.603],
    svgCoordinates: [2360, 2520],
    modernCountries: ["Nigeria"],
    significance: "Renowned for its world-famous lost-wax cast Benin Bronzes, sophisticated earthworks (the historic Great Wall of Benin), and powerful Oba hereditary monarchies.",
    tradeSpecialty: "Cast bronze plaques, ivory carvings, coral regalia",
    color: "#e11d48"
  },
  {
    id: 'songhai-empire',
    name: "Songhai Empire",
    period: "c. 1464 – 1591",
    region: "Western / Sahelian Africa",
    regionBadge: "Sahelian West",
    capital: "Gao",
    coordinates: [16.272, -0.044],
    svgCoordinates: [1650, 1750],
    modernCountries: ["Mali", "Niger", "Nigeria", "Mauritania", "Senegal"],
    significance: "The largest imperial state in West African history, governing the trans-Saharan trade hubs of Timbuktu and Djenné with the renowned University of Sankoré.",
    tradeSpecialty: "Salt slabs, gold ingots, Saharan scholarship & manuscripts",
    color: "#2563eb"
  },
  {
    id: 'mali-empire',
    name: "Mali Empire (Manden Kurufaba)",
    period: "c. 1235 – 1670",
    region: "Western Africa",
    regionBadge: "Western Africa",
    capital: "Niani / Kangaba",
    coordinates: [12.650, -8.000],
    svgCoordinates: [1320, 2050],
    modernCountries: ["Mali", "Guinea", "Senegal", "Gambia"],
    significance: "Founded by Sundiata Keita (Kouroukan Fouga constitutional charter); ruled by Mansa Musa whose famous 1324 pilgrimage distributed historic tons of West African gold.",
    tradeSpecialty: "Bambuk goldfields, salt caravans, griot oral epics",
    color: "#d97706"
  },
  {
    id: 'kush-nubia',
    name: "Kingdom of Kush (Nubia / Meroë)",
    period: "c. 1070 BCE – 350 CE",
    region: "Northern / Eastern Africa",
    regionBadge: "Nile Valley",
    capital: "Meroë / Napata",
    coordinates: [16.933, 33.750],
    svgCoordinates: [4116, 1650],
    modernCountries: ["Sudan", "South Sudan", "Egypt"],
    significance: "Ancient Nile civilization renowned for constructing more steep-sided pyramids at Meroë and Napata than Egypt; governed the 25th Dynasty Black Pharaohs.",
    tradeSpecialty: "Iron smelting, Nubian gold, ebony, Meroitic script",
    color: "#b45309"
  },
  {
    id: 'aksum-kingdom',
    name: "Kingdom of Aksum",
    period: "c. 100 – 940 CE",
    region: "Eastern Africa (Horn)",
    regionBadge: "Horn of Africa",
    capital: "Aksum",
    coordinates: [14.133, 38.717],
    svgCoordinates: [4600, 2020],
    modernCountries: ["Ethiopia", "Eritrea"],
    significance: "Major global maritime trading power minting its own currency, erecting towering monumental granite stelae, and linking the Red Sea with Rome and India.",
    tradeSpecialty: "Myrrh, frankincense, ivory, minted gold coins",
    color: "#0891b2"
  },
  {
    id: 'monomotapa-kingdom',
    name: "Kingdom of Mutapa (Monomotapa)",
    period: "c. 1430 – 1760",
    region: "Southern Africa",
    regionBadge: "Southern Africa",
    capital: "Zvongombe (near Great Zimbabwe)",
    coordinates: [-17.500, 31.000],
    svgCoordinates: [4046, 4621],
    modernCountries: ["Zimbabwe", "Mozambique", "Zambia", "South Africa"],
    significance: "Shona empire renowned in Portuguese cartography for its sophisticated stone architectural masonry (Great Zimbabwe dry-stone walls) and Indian Ocean gold trade via Sofala.",
    tradeSpecialty: "Gold mining, ivory, copper ingots, iron smelting",
    color: "#dc2626"
  },
  {
    id: 'kanem-bornu-empire',
    name: "Kanem-Bornu Empire",
    period: "c. 700 – 1893",
    region: "Central / Sahelian Africa",
    regionBadge: "Lake Chad Sahel",
    capital: "Ngazargamu",
    coordinates: [13.000, 12.000],
    svgCoordinates: [2850, 2050],
    modernCountries: ["Chad", "Nigeria", "Cameroon", "Niger"],
    significance: "Over a millennium of continuous dynastic statehood around the Lake Chad basin, known for the Mais (kings), armored heavy cavalry, and trans-Saharan diplomacy with Cairo and Tripoli.",
    tradeSpecialty: "Natron, cotton textiles, leather goods, trans-Saharan salt",
    color: "#0284c7"
  },
  {
    id: 'kilwa-sultanate',
    name: "Kilwa Sultanate",
    period: "c. 957 – 1513",
    region: "Eastern Africa (Swahili Coast)",
    regionBadge: "Swahili Coast",
    capital: "Kilwa Kisiwani",
    coordinates: [-8.958, 39.512],
    svgCoordinates: [4620, 3720],
    modernCountries: ["Tanzania", "Mozambique", "Kenya"],
    significance: "Thriving Swahili city-state controlling Indian Ocean maritime trade routes connecting Sofala's goldfields with Arabia, Persia, India, and Ming China.",
    tradeSpecialty: "Gold, pearls, mangrove timber, coral rag architecture",
    color: "#059669"
  },
  {
    id: 'buganda-kingdom',
    name: "Kingdom of Buganda",
    period: "c. 1300 – Present",
    region: "Eastern Africa (Great Lakes)",
    regionBadge: "Great Lakes",
    capital: "Mengo (Kampala)",
    coordinates: [0.316, 32.581],
    svgCoordinates: [4253, 3003],
    modernCountries: ["Uganda"],
    significance: "Powerful centralized Great Lakes kingdom ruled by the Kabaka, with sophisticated royal fleets on Lake Victoria (Nnalubaale) and Kasubi royal tombs.",
    tradeSpecialty: "Barkcloth manufacturing, brass smithing, canoe navigation",
    color: "#7c3aed"
  },
  {
    id: 'merina-kingdom',
    name: "Kingdom of Imerina (Merina)",
    period: "c. 1540 – 1897",
    region: "Eastern Africa (Madagascar)",
    regionBadge: "Madagascar",
    capital: "Antananarivo (Rova)",
    coordinates: [-18.913, 47.536],
    svgCoordinates: [5255, 4522],
    modernCountries: ["Madagascar"],
    significance: "Unified the Malagasy highland plateau under King Andrianampoinimerina; renowned for terraced rice irrigation and the royal Rova palace complex.",
    tradeSpecialty: "Silk weaving (Lamba Arlandy), metallurgy, rice agriculture",
    color: "#c026d3"
  },
  {
    id: 'luba-empire',
    name: "Luba Empire",
    period: "c. 1585 – 1889",
    region: "Central Africa",
    regionBadge: "Central Africa",
    capital: "Mwibele (Katanga)",
    coordinates: [-7.500, 25.500],
    svgCoordinates: [3500, 3680],
    modernCountries: ["DR Congo", "Zambia"],
    significance: "Innovators of the sacred Lukasa memory boards (mnemonic historical encoding devices) and complex sacred kingship governance across Central Africa.",
    tradeSpecialty: "Lukasa memory crafts, copper cruciform ingots, iron regalia",
    color: "#0d9488"
  }
];

export const OCEAN_CURRENTS: OceanCurrentDef[] = [
  {
    id: 'canary-current',
    name: "Canary Current (Corriente de Canarias)",
    type: 'cold',
    flowDirection: "South-Southwest along Northwest African seaboard",
    velocityKnots: "0.5 – 1.8 knots",
    description: "A cold, nutrient-rich coastal upwelling current flowing southward from the Iberian peninsula past Morocco, the Canary Islands, and Cape Verde, feeding into the North Equatorial Current.",
    historicalImpact: "Facilitated rapid southward navigation for European sailing ships from Lisbon, Cadiz, and Bristol down to the Senegambia and Gold Coast estuaries.",
    pathCoordinates: [
      [36.0, -10.0],
      [31.0, -12.5],
      [26.0, -16.0],
      [20.0, -18.5],
      [14.0, -21.0],
      [10.0, -25.0]
    ]
  },
  {
    id: 'guinea-current',
    name: "Guinea Current (Courant de Guinée)",
    type: 'warm',
    flowDirection: "Eastward along the Bight of Benin and Biafra",
    velocityKnots: "1.0 – 3.0 knots",
    description: "A warm, fast eastward-flowing boundary current hugging the Gulf of Guinea coastline from Liberia past Ivory Coast, Ghana, Togo, Benin, and Nigeria into Cameroon.",
    historicalImpact: "Created treacherous navigational conditions for return journeys, compelling sailing ships to loop far south into the South Atlantic gyre rather than sailing back against the current.",
    pathCoordinates: [
      [4.5, -9.0],
      [4.2, -4.0],
      [5.0, 1.0],
      [4.0, 6.0],
      [3.0, 9.0]
    ]
  },
  {
    id: 'benguela-current',
    name: "Benguela Current",
    type: 'cold',
    flowDirection: "North-Northwest from Cape of Good Hope to Angola",
    velocityKnots: "0.8 – 2.2 knots",
    description: "A vigorous, cold sub-Antarctic upwelling current flowing northward along the Namibian and Angolan coastline, merging into the South Equatorial Current near Point Noire.",
    historicalImpact: "Provided the fastest natural oceanic highway across the Atlantic, enabling slave ships embarking from Luanda and Benguela to reach Salvador da Bahia and Rio de Janeiro in under 30–35 days.",
    pathCoordinates: [
      [-34.0, 18.0],
      [-28.0, 14.5],
      [-22.0, 12.0],
      [-15.0, 10.5],
      [-8.0, 8.0],
      [-3.0, 2.0]
    ]
  },
  {
    id: 'south-equatorial-current',
    name: "South Equatorial Current",
    type: 'equatorial',
    flowDirection: "Westward across the Atlantic to Brazil & Caribbean",
    velocityKnots: "1.5 – 3.5 knots",
    description: "The primary trans-oceanic conveyor of the tropical Atlantic, driven by steady Southeast Trade Winds spanning from the Gulf of Guinea to the Brazilian bulge (Cabo de São Roque).",
    historicalImpact: "The direct oceanic engine of the Middle Passage; ships captured in its grip made rapid westerly headway toward Recife, Bahia, Barbados, and Jamaica.",
    pathCoordinates: [
      [-2.0, 5.0],
      [-4.0, -10.0],
      [-6.0, -25.0],
      [-7.0, -34.0],
      [-8.0, -36.0]
    ]
  }
];

export const SEASONAL_WIND_REGIMES: SeasonalWindRegime[] = [
  {
    id: 'q1',
    seasonName: "Boreal Winter / Dry Season (Jan – Mar)",
    months: "January – March",
    tradeWindsBehavior: "Strong, reliable Northeast Trade Winds; intense desert Harmattan winds sweeping dust seaward across Upper Guinea.",
    itczPosition: "Southernmost position (near 2°N to 4°S), creating a narrow doldrums belt in the Atlantic.",
    transatlanticPassageDurationDays: {
      senegambiaToCaribbean: 32,
      bightOfBeninToBahia: 42,
      angolaToRioDeJaneiro: 30,
      mozambiqueToBrazil: 68
    },
    mortalityImpactNote: "Fastest crossing times for Senegambia and Angola corridors; lower mortality rate (~8.5%) due to reduced transit duration and steady winds.",
    harmattanIntensity: "Severe"
  },
  {
    id: 'q2',
    seasonName: "Boreal Spring / Pre-Monsoon (Apr – Jun)",
    months: "April – June",
    tradeWindsBehavior: "Northeast Trades begin to weaken; Southeast Trades strengthen and expand north of the equator.",
    itczPosition: "Migrating northward toward 6°N – 8°N, expanding the convective rain zone.",
    transatlanticPassageDurationDays: {
      senegambiaToCaribbean: 39,
      bightOfBeninToBahia: 48,
      angolaToRioDeJaneiro: 34,
      mozambiqueToBrazil: 74
    },
    mortalityImpactNote: "Moderate crossing times; frequent squalls and tropical depressions emerging near the Cape Verde archipelago.",
    harmattanIntensity: "Low"
  },
  {
    id: 'q3',
    seasonName: "Boreal Summer / Monsoon & Hurricane Peak (Jul – Sep)",
    months: "July – September",
    tradeWindsBehavior: "Southwest Monsoon active across Gulf of Guinea; wide equatorial calms (Doldrums) stalling vessels; Atlantic hurricane season begins.",
    itczPosition: "Northernmost position (10°N – 14°N), creating expansive windless doldrum zones.",
    transatlanticPassageDurationDays: {
      senegambiaToCaribbean: 54,
      bightOfBeninToBahia: 62,
      angolaToRioDeJaneiro: 38,
      mozambiqueToBrazil: 86
    },
    mortalityImpactNote: "Highest mortality risk (~16.2%) caused by ships becoming becalmed in the Doldrums for weeks, exhausting freshwater provisions and triggering dysentery outbreaks.",
    harmattanIntensity: "Low"
  },
  {
    id: 'q4',
    seasonName: "Boreal Autumn / Post-Monsoon Transition (Oct – Dec)",
    months: "October – December",
    tradeWindsBehavior: "Northeast Trades re-establish strength; Southeast Trades retreat southward; sea surface temperatures cool.",
    itczPosition: "Retreating southward toward the geographical equator.",
    transatlanticPassageDurationDays: {
      senegambiaToCaribbean: 36,
      bightOfBeninToBahia: 45,
      angolaToRioDeJaneiro: 32,
      mozambiqueToBrazil: 71
    },
    mortalityImpactNote: "Transit times normalize; maritime navigation stabilizes across the Windward and Leeward passage routes.",
    harmattanIntensity: "Moderate"
  }
];
