export interface HistoricalMapPlate {
  id: string;
  title: string;
  shortTitle: string;
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
    title: "Afrique Publiée sous les Auspices de Monseigneur le Duc d'Orléans (1749)",
    shortTitle: "Afrique (1749)",
    cartographer: "Jean-Baptiste Bourguignon d'Anville",
    year: "1749",
    century: "18th Century (Enlightenment)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/plate-03-tilte-Afrique,\" created by Jean Baptiste Bourguignon d'Anville in 1749-default.jpg",
    fallbackUrls: [
      "/cartography/thumbs/Plate-01-tilte-Afrique,\" created by Jean Baptiste Bourguignon d'Anville in 1749-default-thumb.jpg",
      "/cartography/thumbs/danville-1749-opt-thumb.jpg"
    ],
    thumbnailUrl: "/cartography/thumbs/Plate-01-tilte-Afrique,\" created by Jean Baptiste Bourguignon d'Anville in 1749-default-thumb.jpg",
    source: "Jean-Baptiste Bourguignon d'Anville, Paris (1749). Hand-colored copperplate engraving published under the auspices of the Duke of Orléans.",
    institution: "Bibliothèque nationale de France / Geographicus Rare Maps Collection",
    description: "Titled \"Afrique\", created by Jean Baptiste Bourguignon d'Anville in 1749. A landmark turning point in scientific cartography: D'Anville famously excised speculative mythical interior kingdoms, leaving unverified interior zones blank ('terra incognita') while meticulously detailing empirical coastal soundings.",
    historicalSignificance: "Initiated modern empirical cartography of Africa by refusing to fill inland voids with speculative kingdoms or mythical creatures.",
    toponymsToObserve: [
      "Guinée Septentrionale & Méridionale",
      "Royaume de Juda",
      "Côte de l'Or",
      "Côte des Esclaves",
      "Royaume de Congo"
    ],
    homographyBounds: { north: 37.5, south: -35.2, west: -20.5, east: 52.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
  },
  {
    id: 'bellin-1747',
    title: "Carte de l'Afrique pour servir à l'Histoire Générale des Voyages (1747)",
    shortTitle: "Bellin (1747)",
    cartographer: "Jacques-Nicolas Bellin",
    year: "1747",
    century: "18th Century (French Hydrographic Office)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/plate-00-tilte-bellin-1747.jpg",
    fallbackUrls: ["/cartography/thumbs/bellin-1747-thumb.jpg"],
    thumbnailUrl: "/cartography/thumbs/bellin-1747-thumb.jpg",
    source: "Jacques-Nicolas Bellin, Chief Cartographer to the French Navy (Dépôt de la Marine), Paris (1747).",
    institution: "Dépôt de la Marine / Bibliothèque nationale de France",
    description: "Created by Jacques-Nicolas Bellin in 1747 for Abbé Prévost's monumental travel compilation \"Histoire Générale des Voyages\". Bellin streamlined naval navigation charts, eliminating obsolete mythical interior topography.",
    historicalSignificance: "Set the empirical standard for 18th-century French naval cartography and hydrographic surveys during the Enlightenment.",
    toponymsToObserve: ["Barbarie", "Soudan", "Haute Guinée", "Biledulgerid", "Congo", "Abyssinie"],
    homographyBounds: { north: 37.5, south: -35.0, west: -21.0, east: 53.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
  },
  {
    id: 'arrowsmith-1802',
    title: "Africa (Created by Aaron Arrowsmith, Published November 1, 1802)",
    shortTitle: "Arrowsmith (1802)",
    cartographer: "Aaron Arrowsmith",
    year: "1802",
    century: "19th Century (British Hydrography)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/Plate-001-tilte-titled \"Africa,\" was created by Aaron Arrowsmith and published on November 1, 1802.jpg",
    fallbackUrls: ["/cartography/thumbs/arrowsmith-1802-thumb.jpg"],
    thumbnailUrl: "/cartography/thumbs/arrowsmith-1802-thumb.jpg",
    source: "Aaron Arrowsmith, Hydrographer to the Prince of Wales, London (Published November 1, 1802).",
    institution: "Arrowsmith London Cartographic Archive / Royal Geographical Society",
    description: "Titled \"Africa\", created by Aaron Arrowsmith and published on November 1, 1802. Arrowsmith synthesized Mungo Park's pioneering Niger River explorations and Admiralty coastal surveys at the dawn of 19th-century African exploration.",
    historicalSignificance: "The authoritative scientific reference map used by the African Association to coordinate early Niger River and Saharan expeditions.",
    toponymsToObserve: ["Barbary States", "Sahara Desert", "Soudan", "Upper Guinea", "Lower Guinea", "Cape Colony"],
    homographyBounds: { north: 38.0, south: -36.0, west: -22.0, east: 54.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
  },
  {
    id: 'anselmi-1873',
    title: "Africa (1873)",
    shortTitle: "Anselmi (1873)",
    cartographer: "Giorgio Ermanno Anselmi",
    year: "1873",
    century: "19th Century (Late 19th-Century Manuscript)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/plate-01-tilte-giorgio ermanno anselmi-africa-1.jpg",
    fallbackUrls: ["/cartography/thumbs/Plate-06-tilte-Giorgio Ermanno Anselmi-Africa-1-thumb.jpg"],
    thumbnailUrl: "/cartography/thumbs/Plate-06-tilte-Giorgio Ermanno Anselmi-Africa-1-thumb.jpg",
    source: "Giorgio Ermanno Anselmi (c. 1873). Geographical map of Africa drawn in Indian ink, with watercolor borders.",
    institution: "Wikimedia Commons / Giorgio Ermanno Anselmi Collection",
    description: "Geographical map of Africa drawn in Indian ink, with the borders between delimited states in watercolor. Created in the late 19th century—certainly after the Mexican-American War (1846–1848) and the localization of Timbuktu on maps (1854); likely before the War of the Pacific (1879–1884) and prior to the 1884 Berlin Conference and the Scramble for Africa.",
    historicalSignificance: "An intriguing hand-drawn manuscript map documenting late 19th-century African geopolitical entities, river systems, and commercial networks prior to European colonial partition.",
    toponymsToObserve: ["Timbuktu", "Soudan", "Sahara", "Guinée", "Congo", "Abyssinie", "Zanguebar", "Cap de Bonne-Espérance"],
    homographyBounds: { north: 37.0, south: -35.0, west: -21.0, east: 53.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
  },
  {
    id: 'berghaus-1824',
    title: "Karte von Afrika nach den neuesten Entdeckungen... bearbeitet im Jahre 1824",
    shortTitle: "Berghaus (1824)",
    cartographer: "Heinrich Berghaus & Heinrich Brose",
    year: "1824",
    century: "19th Century (German Scientific Geography)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/plate-02-tilte-title- *karte von afrika nach den neuesten entdeckungen... bearbeitet im jahre 1824* author- heinrich berghaus (1797–1884) engraver- heinrich brose publisher- j. g. cotta, stuttgart date- 1824 (issued 1826)-16777000.jpg",
    fallbackUrls: [
      "/cartography/thumbs/Plate-03-tilte-Title- *Karte von Afrika nach den neuesten Entdeckungen... bearbeitet im Jahre 1824* Author- Heinrich Berghaus (1797–1884) Engraver- Heinrich Brose Publisher- J. G. Cotta, Stuttgart Date- 1824 (issued 1826)-16777000-thumb.jpg"
    ],
    thumbnailUrl: "/cartography/thumbs/Plate-03-tilte-Title- *Karte von Afrika nach den neuesten Entdeckungen... bearbeitet im Jahre 1824* Author- Heinrich Berghaus (1797–1884) Engraver- Heinrich Brose Publisher- J. G. Cotta, Stuttgart Date- 1824 (issued 1826)-16777000-thumb.jpg",
    source: "Author: Heinrich Berghaus (1797–1884), Engraver: Heinrich Brose, Publisher: J. G. Cotta, Stuttgart (1824, issued 1826).",
    institution: "J. G. Cotta Publishing Archive / Berlin Geographical Society",
    description: "Titled \"Karte von Afrika nach den neuesten Entdeckungen... bearbeitet im Jahre 1824\", authored by Heinrich Berghaus (1797–1884), engraved by Heinrich Brose, and published by J. G. Cotta in Stuttgart (date 1824, issued 1826). A triumph of German thematic and physical cartography.",
    historicalSignificance: "Pioneered systematic physical geography, climate regimes, and precise hypsometric altitude modeling across Africa.",
    toponymsToObserve: ["Nordafrika", "Sahara", "Sudan", "Äthiopien", "Kapkolonie", "Guinea-Küste"],
    homographyBounds: { north: 38.0, south: -36.0, west: -22.0, east: 54.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
  },
  {
    id: 'meurs-1668',
    title: "Africae Accurata Tabula (1668)",
    shortTitle: "Van Meurs (1668)",
    cartographer: "Jacob van Meurs",
    year: "1668",
    century: "17th Century (Dutch Golden Age)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/plate-04-tilte-jacob_van_meurs,_africae-meurs-1668.jpg",
    fallbackUrls: ["/cartography/thumbs/meurs-1668-opt-thumb.jpg"],
    thumbnailUrl: "/cartography/thumbs/meurs-1668-opt-thumb.jpg",
    source: "Jacob van Meurs, Amsterdam (1668). Engraved for Olfert Dapper's Description of Africa.",
    institution: "University of Amsterdam Special Collections",
    description: "Titled \"Africae Accurata Tabula\", created by Jacob van Meurs in Amsterdam (1668) for Olfert Dapper's authoritative treatise. Lavishly engraved with regional wildlife, maritime routes, and detailed depictions of West and Central African sovereign kingdoms.",
    historicalSignificance: "Captured vital 17th-century geographical and ethnographic intelligence gathered by Dutch East and West India Companies.",
    toponymsToObserve: ["Aegyptus", "Barbaria", "Nigritia", "Congo", "Monomotapa", "Cafraria", "Zanguebar"],
    homographyBounds: { north: 38.0, south: -36.0, west: -22.0, east: 54.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
  },
  {
    id: 'bartholomew-1885',
    title: "Africa (Edinburgh Geographical Institute, 1885)",
    shortTitle: "Bartholomew (1885)",
    cartographer: "John George Bartholomew",
    year: "1885",
    century: "19th Century (Victorian Cartography)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/plate-05-tilte-j. bartholomew-africa_1885.jpg",
    fallbackUrls: ["/cartography/thumbs/Plate-02-tilte-J. Bartholomew-africa_1885-thumb.jpg"],
    thumbnailUrl: "/cartography/thumbs/Plate-02-tilte-J. Bartholomew-africa_1885-thumb.jpg",
    source: "John Bartholomew & Co., Edinburgh Geographical Institute (1885).",
    institution: "National Library of Scotland / Edinburgh Geographical Archive",
    description: "Titled \"Africa\", created by J. Bartholomew in 1885. Published on the eve of the Berlin Conference, detailing European colonial partition lines, telegraph routes, and transcontinental trade concessions.",
    historicalSignificance: "Captured the exact geopolitical snapshot of Africa at the formal onset of the Scramble for Africa.",
    toponymsToObserve: ["Egypt", "Tripoli", "Sahara", "Congo Free State", "Transvaal", "Cape Colony", "Zanzibar"],
    homographyBounds: { north: 38.0, south: -36.0, west: -22.0, east: 54.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
  },
  {
    id: 'blaeu-1644',
    title: "Africae Nova Descriptio (Special Collections University of Amsterdam)",
    shortTitle: "Blaeu (1644)",
    cartographer: "Willem Janszoon Blaeu",
    year: "1644",
    century: "17th Century (Golden Age of Dutch Cartography)",
    region: "Pan-African Continental & Atlantic Rim",
    imageUrl: "/cartography/plate-06-tilte-map_-_special_collections_university_of_amsterdam.jpg",
    fallbackUrls: [
      "/cartography/thumbs/Plate-09-tilte-map_-_special_collections_university_of_amsterdam_-_otm-_hb-kzl_33.17.49-thumb.jpg",
      "/cartography/thumbs/blaeu-1644-opt-thumb.jpg"
    ],
    thumbnailUrl: "/cartography/thumbs/Plate-09-tilte-map_-_special_collections_university_of_amsterdam_-_otm-_hb-kzl_33.17.49-thumb.jpg",
    source: "Willem Janszoon Blaeu, Amsterdam (1644). Preserved at Special Collections University of Amsterdam (OTM: HB-KZL 33.17.49).",
    institution: "Special Collections, University of Amsterdam",
    description: "Historic map preserved in the Special Collections of the University of Amsterdam. Features Blaeu's iconic decorative borders depicting African city harbors (Alexandria, Algiers, Cairo, Mozambique) and side vignettes of indigenous costumes.",
    historicalSignificance: "One of the most famous and visually ornate baroque maps of Africa produced during the 17th century.",
    toponymsToObserve: [
      "Barbaria",
      "Biafara Regnum",
      "Monomotapa Regnum",
      "Zanguebar",
      "Caput Bonae Spei",
      "Congo Regnum"
    ],
    homographyBounds: { north: 38.0, south: -36.0, west: -22.0, east: 54.0 },
    svgOverlayTransform: { scale: 1.04, offsetX: 2, offsetY: 0 }
  },
  {
    id: 'bowen-1747',
    title: "A New and Accurate Map of Africa, from the Latest and Best Observations (1747)",
    shortTitle: "Bowen (1747)",
    cartographer: "Emanuel Bowen",
    year: "1747",
    century: "18th Century (British Enlightenment Cartography)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/plate-07-tilte-a_new_and_accurate_map_of_africa,_from_the_latest_and_best_observations_1747.jpg",
    fallbackUrls: ["/cartography/thumbs/bowen-1747-opt-thumb.jpg"],
    thumbnailUrl: "/cartography/thumbs/bowen-1747-opt-thumb.jpg",
    source: "Emanuel Bowen, Geographer to His Majesty George II, London (1747).",
    institution: "Royal Society of London / Historical Cartography Collection",
    description: "Titled \"A New and Accurate Map of Africa, from the Latest and Best Observations 1747\", authored by Emanuel Bowen. Details trading factories, coastal anchorages, seasonal trade winds, and extensive historical commentary in the margins.",
    historicalSignificance: "Provided British merchants and statesmen with comprehensive geographic intelligence on West, Central, and East African commercial hubs.",
    toponymsToObserve: ["Barbary", "Zaara or Desert", "Negroland", "Guinea", "Congo", "Monomotapa", "Abissinia"],
    homographyBounds: { north: 38.0, south: -36.0, west: -22.0, east: 54.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
  },
  {
    id: 'sandrart-1680',
    title: "Accuratissima Totius Africae Tabula in Lucem Producta (c. 1680)",
    shortTitle: "Sandrart (c. 1680)",
    cartographer: "Jacob von Sandrart & J.B. Homann",
    year: "1680",
    century: "17th Century (German Baroque Cartography)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/plate-08-tilte-sandrart-1680.jpg",
    fallbackUrls: ["/cartography/thumbs/sandrart-1680-opt-thumb.jpg"],
    thumbnailUrl: "/cartography/thumbs/sandrart-1680-opt-thumb.jpg",
    source: "Jacob von Sandrart, Nuremberg (c. 1680). Engraved by Johann Baptist Homann.",
    institution: "Nuremberg Cartographic Archive / German National Museum",
    description: "Titled \"Accuratissima Totius Africae Tabula\", created by Jacob von Sandrart in Nuremberg (c. 1680) with engraving by J.B. Homann. Features ornate baroque title cartouches and detailed representations of African inland river systems.",
    historicalSignificance: "Exemplifies the transition of German cartography into precision copperplate engraving and scientific map publishing.",
    toponymsToObserve: ["Aegyptus", "Barbaria", "Biledulgerid", "Nigritia", "Abissinia", "Congo", "Monomotapa"],
    homographyBounds: { north: 38.0, south: -36.0, west: -22.0, east: 54.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
  },
  {
    id: 'allardt-1650',
    title: "Nova Africae Descriptio (Hugo Allardt, c. 1650)",
    shortTitle: "Allardt (c. 1650)",
    cartographer: "Hugo Allardt",
    year: "1650",
    century: "17th Century (Dutch Maritime Cartography)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/plate-09-tilte-Nova_Africa_by_Hugo_Allardt.jpg",
    fallbackUrls: [
      "/cartography/thumbs/Plate-11-tilte-Nova_Africa_-_Hugo_Allardt,_excudit_-_btv1b8469595q-thumb.jpg",
      "/cartography/thumbs/allardt-1650-opt-thumb.jpg"
    ],
    thumbnailUrl: "/cartography/thumbs/Plate-11-tilte-Nova_Africa_-_Hugo_Allardt,_excudit_-_btv1b8469595q-thumb.jpg",
    source: "Hugo Allardt, Amsterdam (c. 1650). Copperplate engraving with decorative marine cartouches.",
    institution: "Bibliothèque nationale de France, Département Cartes et Plans (btv1b8469595q)",
    description: "Titled \"Nova Africa\", created by Hugo Allardt in Amsterdam (c. 1650). A masterwork of Dutch sea-atlas cartography highlighting trade winds, shipping lanes, and coastal trading kingdoms.",
    historicalSignificance: "Documents Dutch maritime expansion around the Cape of Good Hope toward the Atlantic and Indian Oceans.",
    toponymsToObserve: ["Guineae Nova Descriptio", "Congo", "Angola", "Mozambique", "Madagascar", "Caput Bonae Spei"],
    homographyBounds: { north: 38.0, south: -36.0, west: -22.0, east: 54.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
  },
  {
    id: 'visscher-1690',
    title: "Africa Accurate in Imperia, Regna et Status Divisa (c. 1690)",
    shortTitle: "Visscher (c. 1690)",
    cartographer: "Nicolaes Visscher II",
    year: "1690",
    century: "17th Century (Dutch Golden Age)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/plate-10-tilte-Nicolass-Visscher-Map-of-Africa-visscher-1690.jpg",
    fallbackUrls: [
      "/cartography/thumbs/Plate-07-tilte-Nicolass-Visscher-Map-of-Africa-thumb.jpg",
      "/cartography/thumbs/visscher-1690-opt-thumb.jpg"
    ],
    thumbnailUrl: "/cartography/thumbs/Plate-07-tilte-Nicolass-Visscher-Map-of-Africa-thumb.jpg",
    source: "Nicolaes Visscher II, Amsterdam (c. 1690). Hand-colored copperplate map with decorative royal cartouche.",
    institution: "Visscher Atlas Collection / Amsterdam Historical Cartography Archive",
    description: "Titled \"Africa Accurate in Imperia, Regna et Status Divisa\", created by Nicolaes Visscher II in Amsterdam (c. 1690). Renowned for its rich color delineations of African sovereign states, imperial realms, and coastal hydrography.",
    historicalSignificance: "Demonstrates the pinnacle of Dutch cartographic artistry and regional kingdom boundaries at the end of the 17th century.",
    toponymsToObserve: ["Barbaria", "Nigritia", "Guineae Pars", "Congo", "Monomotapa", "Zanguebar", "Cafraria"],
    homographyBounds: { north: 38.0, south: -36.0, west: -22.0, east: 54.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
  },
  {
    id: 'ottoman-1893',
    title: "\"Afrika Kıtası\" (Continent of Africa, 1893)",
    shortTitle: "Ottoman Atlas (1893)",
    cartographer: "Ali Şeref Paşa & Hafız Ali Eşref",
    year: "1893",
    century: "19th Century (Late Ottoman Empire)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/plate-11-tilte-Ottoman-Turkish-Africa-Map.jpg",
    fallbackUrls: ["/cartography/thumbs/plate-11-ottoman-1893-thumb.jpg"],
    thumbnailUrl: "/cartography/thumbs/plate-11-ottoman-1893-thumb.jpg",
    source: "Ali Şeref Paşa & Hafız Ali Eşref, \"Yeni coğrafya atlası\" (New Geographical Atlas). Published by Hasan Ferid, Matbaa-i Amire Press, Dersa'adet (Istanbul), 1309–1311 AH / 1891–1893 AD.",
    institution: "David Rumsey Map Collection, Stanford University Libraries / Matbaa-i Amire Press, Istanbul",
    description: "Historical lithographed color map titled \"Afrika Kıtası\" (Continent of Africa) from the \"Yeni coğrafya atlası\" (New Geographical Atlas), published in Istanbul in 1893. Features a pastel color palette, relief hachures, and inscriptions in Ottoman Turkish depicting the geopolitical landscape and colonial boundaries during the height of late 19th-century European expansion.",
    historicalSignificance: "Reflects the late Ottoman Empire's strategic engagement with global geography and politics, illustrating how Istanbul monitored contemporary European colonial divisions in Africa.",
    toponymsToObserve: ["Afrika Kıtası", "Mısır (Egypt)", "Trablusgarp (Tripoli)", "Sudan", "Kongo", "Habeşistan (Abyssinia)", "Nil Nehri"],
    homographyBounds: { north: 38.0, south: -36.0, west: -22.0, east: 54.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
  },
  {
    id: 'daikokuya-1876',
    title: "Africa from Russia (アフリカ - АФРИКА)",
    shortTitle: "Daikokuya (1876)",
    cartographer: "Daikokuya Kōdayū & Katsuragawa Hoshū",
    year: "1876",
    century: "19th Century (Meiji Era / Japanese Manuscript)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/plate-12-tilte-japanese-plate-53cm.jpg",
    fallbackUrls: ["/cartography/thumbs/plate-12-daikokuya-1876-thumb.jpg"],
    thumbnailUrl: "/cartography/thumbs/plate-12-daikokuya-1876-thumb.jpg",
    source: "Hand-drawn Japanese manuscript transcription based on Russian Imperial charts brought home by Captain Daikokuya Kōdayū (大黒屋 光太夫) after his 1782–1792 Siberian odyssey. Documented in the Hokusabenryaku (北槎聞略) under Katsuragawa Hoshū; stamped with official Meiji seals of the Asakusa Library (浅草文庫, 1874) and Cabinet Library (内閣文庫, 1885).",
    institution: "National Archives of Japan (国立公文書館) / Naikaku Bunko (Cabinet Library)",
    description: "Late 19th-century Japanese manuscript map pairing Cyrillic headline 'АФРИКА' with traditional kanji and katakana translations. Based on Russian geographical charts brought home by Captain Daikokuya Kōdayū following his royal audience with Catherine the Great in Saint Petersburg. Details rivers, coasts, and marks unexplored interior voids simply as '未詳地' (Unknown Territory).",
    historicalSignificance: "Marks the pioneering transmission of Russian and Western geographical intelligence into Japan, preserved in the Japanese Cabinet Library as vital geopolitical intelligence.",
    toponymsToObserve: ["АФРИКА (Africa)", "大沙漠 (Great Desert)", "泥児利亜 (Nigeria)", "コンゴ (Congo)", "喜望峰 (Cape of Good Hope)", "エギプト (Egypt)", "アビシニア (Abyssinia)", "モノモタパ (Monomotapa)", "未詳地 (Unexplored Region)"],
    homographyBounds: { north: 38.0, south: -36.0, west: -22.0, east: 54.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
  },
  {
    id: 'carey-1814',
    title: "Africa According to the Best Authorities (1814)",
    shortTitle: "Carey (1814)",
    cartographer: "Mathew Carey",
    year: "1814",
    century: "19th Century (Early American Cartography)",
    region: "Pan-African Continental",
    imageUrl: "/cartography/plate-13-tilte-Africa_According_to_the_best_Authorities-Matthew Carey-1814.jpg",
    fallbackUrls: ["/cartography/thumbs/plate-13-carey-1814-thumb.jpg"],
    thumbnailUrl: "/cartography/thumbs/plate-13-carey-1814-thumb.jpg",
    source: "Mathew Carey, Carey's General Atlas, Philadelphia (1814 edition, preface dated March 17, 1814). Engraved with original publisher hand-coloring.",
    institution: "David Rumsey Map Collection, David Rumsey Map Center, Stanford University Libraries (Pub List No: 4577.000 / List No: 4577.056)",
    description: "Engraved for Mathew Carey's American edition of the General Atlas, published in Philadelphia in late 1814. Renowned as the first atlas produced in the United States to employ standard original publisher color on maps. Depicts regional indigenous kingdoms such as Nubia and traditional landmarks including the legendary 'Mountains of the Moon'.",
    historicalSignificance: "A foundational milestone in early United States atlas publishing, capturing American geographic knowledge and cartographic style in the early Republic.",
    toponymsToObserve: ["Mountains of the Moon", "Kingdom of Nubia", "Barbary", "Negroland", "Guinea", "The Hottentots", "Cape of Good Hope"],
    homographyBounds: { north: 38.0, south: -36.0, west: -22.0, east: 54.0 },
    svgOverlayTransform: { scale: 1.0, offsetX: 0, offsetY: 0 }
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
    id: 'great-zimbabwe',
    name: "Kingdom of Zimbabwe",
    period: "c. 1220 – 1450",
    region: "Southern Africa",
    regionBadge: "Southern Africa",
    capital: "Great Zimbabwe",
    coordinates: [-20.267, 30.933],
    svgCoordinates: [3980, 4640],
    modernCountries: ["Zimbabwe", "Mozambique"],
    significance: "Master stonemasons who constructed the massive dry-stone Great Enclosure; central nexus of the Indian Ocean gold and ivory trade linking Sofala to Kilwa and China.",
    tradeSpecialty: "Gold, copper, cattle, soapstone carvings",
    color: "#059669"
  },
  {
    id: 'axum-empire',
    name: "Kingdom of Aksum (Axum)",
    period: "c. 100 – 940 CE",
    region: "Eastern Africa",
    regionBadge: "Eastern Africa",
    capital: "Aksum",
    coordinates: [14.133, 38.717],
    svgCoordinates: [4200, 2050],
    modernCountries: ["Ethiopia", "Eritrea", "Sudan"],
    significance: "Major global maritime trading empire minting its own gold coinage; one of the first nations to officially adopt Christianity under King Ezana.",
    tradeSpecialty: "Frankincense, myrrh, ivory, gold, emeralds",
    color: "#7c3aed"
  },
  {
    id: 'kanem-bornu',
    name: "Kanem-Bornu Empire",
    period: "c. 700 – 1900",
    region: "Central / Sahelian Africa",
    regionBadge: "Lake Chad Basin",
    capital: "Njimi / Ngazargamu",
    coordinates: [13.000, 14.000],
    svgCoordinates: [2750, 2050],
    modernCountries: ["Chad", "Nigeria", "Niger", "Cameroon"],
    significance: "One of the longest-lasting states in African history; Islamic scholarship center controlling trans-Saharan trade routes across the Lake Chad basin.",
    tradeSpecialty: "Ostrich feathers, natron, livestock, cotton textiles",
    color: "#dc2626"
  }
];

export const OCEAN_CURRENTS: OceanCurrentDef[] = [
  {
    id: 'canary-current',
    name: "Canary Current",
    type: 'cold',
    flowDirection: "Southward along Northwest African coast toward West Africa",
    velocityKnots: "0.5 – 1.2 knots",
    description: "A wind-driven surface current that is part of the North Atlantic Gyre, flowing south along the coast of Northwest Africa.",
    historicalImpact: "Provided the crucial maritime tailwind for Portuguese caravels exploring down the Atlantic coast of Africa during the 15th century.",
    pathCoordinates: [[32.0, -10.0], [25.0, -16.0], [18.0, -18.0], [10.0, -20.0]]
  },
  {
    id: 'benguela-current',
    name: "Benguela Current",
    type: 'cold',
    flowDirection: "North-northwestward along the southwest coast of Africa",
    velocityKnots: "0.5 – 1.5 knots",
    description: "The eastern branch of the South Atlantic Gyre, carrying cold sub-Antarctic waters northward along the coasts of South Africa and Namibia.",
    historicalImpact: "Created rich upwelling fisheries while presenting formidable headwind barriers for early southbound mariners rounding the Cape.",
    pathCoordinates: [[-34.0, 18.0], [-28.0, 14.0], [-20.0, 11.0], [-10.0, 10.0]]
  },
  {
    id: 'agulhas-current',
    name: "Agulhas Current",
    type: 'warm',
    flowDirection: "Southwestward down the east coast of Africa, retroflecting eastward",
    velocityKnots: "2.0 – 4.5 knots (very strong)",
    description: "The western boundary current of the southwest Indian Ocean, flowing fast down the Mozambique and South African coastline.",
    historicalImpact: "Notoriously violent sea conditions at the southern tip of Africa (Cape Agulhas), responsible for numerous historic shipwrecks.",
    pathCoordinates: [[-25.0, 35.0], [-30.0, 32.0], [-35.0, 25.0], [-37.0, 20.0]]
  },
  {
    id: 'guinea-current',
    name: "Guinea Current",
    type: 'warm',
    flowDirection: "Eastward along the Gulf of Guinea coast",
    velocityKnots: "0.8 – 1.8 knots",
    description: "A warm, slow eastward flowing ocean current stretching along the West African coast from Cape Palmas to the Niger Delta.",
    historicalImpact: "Governed coastal navigation schedules between the Gold Coast, the Slave Coast, and the Bight of Benin.",
    pathCoordinates: [[4.0, -8.0], [4.5, -2.0], [4.0, 4.0], [3.5, 7.0]]
  }
];

export const SEASONAL_WIND_REGIMES: SeasonalWindRegime[] = [
  {
    id: 'q1',
    seasonName: "Q1: Winter Northeast Monsoon & Harmattan Season",
    months: "January – March",
    tradeWindsBehavior: "Strong NE Harmattan trade winds blowing dust off the Sahara across West Africa; steady Easterlies south of the equator.",
    itczPosition: "Southernmost position (approx. 5°S to 10°S)",
    transatlanticPassageDurationDays: {
      senegambiaToCaribbean: 28,
      bightOfBeninToBahia: 34,
      angolaToRioDeJaneiro: 39,
      mozambiqueToBrazil: 62
    },
    mortalityImpactNote: "Dry Harmattan conditions reduced airborne malaria vector activity in northern corridors but increased respiratory distress during long maritime confinement.",
    harmattanIntensity: 'Severe'
  },
  {
    id: 'q2',
    seasonName: "Q2: Spring Equinox & ITCZ Northward Transition",
    months: "April – June",
    tradeWindsBehavior: "NE trades weaken as the sun crosses the equator; Atlantic equatorial counter-current intensifies eastward.",
    itczPosition: "Shifting rapidly northward across the Equator to 5°N",
    transatlanticPassageDurationDays: {
      senegambiaToCaribbean: 31,
      bightOfBeninToBahia: 36,
      angolaToRioDeJaneiro: 42,
      mozambiqueToBrazil: 68
    },
    mortalityImpactNote: "Monsoon rains begin in West Africa, creating high humidity and acute dysentery outbreaks in coastal slave factories (forts).",
    harmattanIntensity: 'Moderate'
  },
  {
    id: 'q3',
    seasonName: "Q3: Summer Southwest Monsoon & Peak Rainfalls",
    months: "July – September",
    tradeWindsBehavior: "Southwest monsoon winds dominate West Africa, delivering torrential rains; powerful Southeast trades in the South Atlantic.",
    itczPosition: "Northernmost position (approx. 15°N)",
    transatlanticPassageDurationDays: {
      senegambiaToCaribbean: 26,
      bightOfBeninToBahia: 32,
      angolaToRioDeJaneiro: 37,
      mozambiqueToBrazil: 58
    },
    mortalityImpactNote: "Peak rainy season in West Africa; severe gastrointestinal and malarial mortality spikes in coastal holding barracks.",
    harmattanIntensity: 'Low'
  },
  {
    id: 'q4',
    seasonName: "Q4: Autumn Southerly Retreat & Calm Equatorial Belts",
    months: "October – December",
    tradeWindsBehavior: "Monsoon retreats southward; NE trades begin to re-establish across the Sahara and Sahel.",
    itczPosition: "Moving southward toward the Equator",
    transatlanticPassageDurationDays: {
      senegambiaToCaribbean: 29,
      bightOfBeninToBahia: 33,
      angolaToRioDeJaneiro: 38,
      mozambiqueToBrazil: 60
    },
    mortalityImpactNote: "Favourable sailing conditions across the South Atlantic from Angola and Mozambique as stable high-pressure cells stabilize.",
    harmattanIntensity: 'Moderate'
  }
];
