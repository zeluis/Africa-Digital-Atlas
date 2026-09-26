export interface CastasArchivalItem {
  id: string;
  title: string;
  creator: string;
  institution: string;
  date: string;
  category: string;
  description: string;
  historicalSignificance: string;
  imageUrl: string;
  thumbnailUrl: string;
}

export const CASTAS_ARCHIVE_ITEMS: CastasArchivalItem[] = [
  // --- SERIES 1 (Plates A through P - 16 Full Plates) ---
  {
    id: 'casta-1o-a',
    title: '1. De Español y India, Mestiza',
    creator: 'Anonymous Master Painter of New Spain',
    institution: 'Museo de América, Madrid / Colonial Archival Repository',
    date: 'c. 1750 – 1775',
    category: 'Castas Painting Series I (Oil on Canvas)',
    description: 'First plate from an 18th-century casta painting series depicting racial mixing (mestizaje) in colonial New Spain. It portrays a Spanish gentleman in silk frock, an Indigenous woman in an embroidered huipil, and their mestiza child with native flora and basketry.',
    historicalSignificance: 'Casta paintings served as visual encyclopedias of racial and social hierarchy commissioned by colonial elites to classify the demographic complexity of the Spanish American viceroyalties.',
    imageUrl: '/castas/castaS1o-a.jpg',
    thumbnailUrl: '/castas/castaS1o-a.jpg'
  },
  {
    id: 'casta-1o-b',
    title: '2. De Mestizo y Española, Castiza',
    creator: 'Attributed to Miguel Cabrera Workshop',
    institution: 'Real Academia de Bellas Artes de San Fernando, Madrid',
    date: 'c. 1763',
    category: 'Castas Painting Series I',
    description: 'Illustrating the offspring of a mestizo and a Spaniard (yielding a castiza). The figures are depicted with refined colonial attire, ornate lace collars, and fine porcelain dining ware.',
    historicalSignificance: 'Reflects the Enlightenment-era Spanish obsession with taxonomy and racial categorization, merging scientific inquiry with colonial social control.',
    imageUrl: '/castas/castaS1o-b.jpg',
    thumbnailUrl: '/castas/castaS1o-b.jpg'
  },
  {
    id: 'casta-1o-c',
    title: '3. De Español y Negra, Mulata',
    creator: 'Anonymous Viceroyalty Workshop',
    institution: 'Bibliothèque nationale de France, Paris / Archivo General de Indias',
    date: 'c. 1770',
    category: 'Castas Painting Series I',
    description: 'Depicts a Spanish father and African mother with their mulata child in a bustling marketplace surrounded by tropical fruits (papayas, pineapples) and woven baskets.',
    historicalSignificance: 'Highlights the vital economic and cultural presence of Afro-descendant populations in urban colonial centers such as Mexico City, Puebla, and Veracruz.',
    imageUrl: '/castas/castaS1o-c.jpg',
    thumbnailUrl: '/castas/castaS1o-c.jpg'
  },
  {
    id: 'casta-1o-d',
    title: '4. De Español y Mulata, Morisca',
    creator: 'Ignacio María Barreda (New Spain)',
    institution: 'Los Angeles County Museum of Art (LACMA) Special Collections',
    date: 'c. 1777',
    category: 'Castas Painting Series I',
    description: 'Detailed interior study showing familial interaction, artisanal textile weaving, and domestic ornamentation characteristic of 18th-century viceregal households.',
    historicalSignificance: 'Demonstrates the sophisticated artistic output of colonial academies and the codification of skin tone gradations into official legal and social categories.',
    imageUrl: '/castas/castaS1o-d.jpg',
    thumbnailUrl: '/castas/castaS1o-d.jpg'
  },
  {
    id: 'casta-1o-e',
    title: '5. De Español y Morisca, Albina (Tornaatrás)',
    creator: 'Anonymous Master Painter',
    institution: 'Museo Nacional de Historia, Castillo de Chapultepec, Mexico City',
    date: 'c. 1760 – 1780',
    category: 'Castas Painting Series I',
    description: 'Portrays the complex categorization resulting from the union of a Spaniard and a morisca. Features elaborate velvet garments, gold filigree buttons, and silver jewelry.',
    historicalSignificance: 'Illustrates how colonial painters used elaborate costume and domestic backdrops to signal wealth, regional provenance, and social hierarchy.',
    imageUrl: '/castas/castaS1o-e.jpg',
    thumbnailUrl: '/castas/castaS1o-e.jpg'
  },
  {
    id: 'casta-1o-f',
    title: '6. De Español y Albina, Tornaatrás / Tente en el Aire',
    creator: 'Attributed to José de Alcíbar',
    institution: 'Denver Art Museum / Colonial Latin American Collection',
    date: 'c. 1785',
    category: 'Castas Painting Series I',
    description: 'Depicts the "tornaatrás" / "tente en el aire" category with outdoor market stalls, cacao bean trading, artisanal sweets, and indigenous ceramics.',
    historicalSignificance: 'Provides historians with invaluable material culture evidence regarding 18th-century diet, currency exchange, and street commerce in New Spain.',
    imageUrl: '/castas/castaS1o-f.jpg',
    thumbnailUrl: '/castas/castaS1o-f.jpg'
  },
  {
    id: 'casta-1o-g',
    title: '7. De Negro y India, Zambaiga / Chino',
    creator: 'Colonial Archival Painter of New Spain',
    institution: 'Museo de América, Madrid',
    date: 'c. 1775',
    category: 'Castas Painting Series I',
    description: 'Depicts the union between an African male and an Indigenous female, highlighting artisanal labor roles, blacksmithing tools, and rural domestic settings.',
    historicalSignificance: 'Documents Afro-Indigenous alliances, labor stratification, and syncretic cultural traditions in colonial hinterlands and mining camps.',
    imageUrl: '/castas/castaS1o-g.jpg',
    thumbnailUrl: '/castas/castaS1o-g.jpg'
  },
  {
    id: 'casta-1o-h',
    title: '8. De Mestizo y India, Coyote',
    creator: 'Workshop of New Spain',
    institution: 'Real Academia de Historia, Madrid',
    date: 'c. 1780',
    category: 'Castas Painting Series I',
    description: 'Portrays the colloquial "coyote" classification in a pastoral setting with livestock, maguey plants, and traditional backstrap weaving apparatus.',
    historicalSignificance: 'Examines rural labor strata and vernacular naming conventions used in provincial parish baptismal and matrimonial registries.',
    imageUrl: '/castas/castaS1o-h.jpg',
    thumbnailUrl: '/castas/castaS1o-h.jpg'
  },
  {
    id: 'casta-1o-i',
    title: '9. De Coyote e India, Chamizo',
    creator: 'Viceroyalty Workshop',
    institution: 'Museo Soumaya, Mexico City',
    date: 'c. 1775',
    category: 'Castas Painting Series I',
    description: 'Shows an artisan workshop setting with leather tanning, saddle-making tools, and domestic pottery indicative of provincial trades.',
    historicalSignificance: 'Records the everyday material culture, clothing textiles, and manual crafts practiced by mixed-lineage families.',
    imageUrl: '/castas/castaS1o-i.jpg',
    thumbnailUrl: '/castas/castaS1o-i.jpg'
  },
  {
    id: 'casta-1o-j',
    title: '10. De Chamizo y Mestiza, Cambujo',
    creator: 'Master of the Viceroyalty Guilds',
    institution: 'Museo de Historia Mexicana, Monterrey',
    date: 'c. 1778',
    category: 'Castas Painting Series I',
    description: 'Depicts a family tending to an orchard of avocados and nopales with woven carrying crates and ceramic water vessels.',
    historicalSignificance: 'Demonstrates botanical accuracy and agrarian practices in central Mexican valleys during the late Bourbon era.',
    imageUrl: '/castas/castaS1o-j.jpg',
    thumbnailUrl: '/castas/castaS1o-j.jpg'
  },
  {
    id: 'casta-1o-k',
    title: '11. De Cambujo e India, Albarazado',
    creator: 'Anonymous Viceroyalty Painter',
    institution: 'Colección Particular / Archivo de Indias',
    date: 'c. 1780',
    category: 'Castas Painting Series I',
    description: 'Illustrates the albarazado casta within a rustic kitchen setting, preparing maize tortillas on a traditional clay comal.',
    historicalSignificance: 'Illuminates domestic gastronomy, gender labor divisions, and culinary continuities across indigenous and African households.',
    imageUrl: '/castas/castaS1o-k.jpg',
    thumbnailUrl: '/castas/castaS1o-k.jpg'
  },
  {
    id: 'casta-1o-l',
    title: '12. De Albarazado y Negra, Barcino',
    creator: 'Workshop of Puebla de los Ángeles',
    institution: 'Museo Amparo, Puebla',
    date: 'c. 1782',
    category: 'Castas Painting Series I',
    description: 'Features textile dyeing with cochineal and indigo vats, showcasing regional chemical craft and fabric production.',
    historicalSignificance: 'Documents the crucial economic contribution of non-elite laborers to the global trade in New World dyes and textiles.',
    imageUrl: '/castas/castaS1o-l.jpg',
    thumbnailUrl: '/castas/castaS1o-l.jpg'
  },
  {
    id: 'casta-1o-m',
    title: '13. De Barcino e India, Calpamulato',
    creator: 'Anonymous Master Painter',
    institution: 'Museo Nacional del Virreinato, Tepotzotlán',
    date: 'c. 1784',
    category: 'Castas Painting Series I',
    description: 'Depicts a family in a rural homestead cultivating chili peppers and squash with traditional agricultural implements.',
    historicalSignificance: 'Reveals the deep integration of indigenous agricultural heritage with evolving multi-ethnic colonial demographics.',
    imageUrl: '/castas/castaS1o-m.jpg',
    thumbnailUrl: '/castas/castaS1o-m.jpg'
  },
  {
    id: 'casta-1o-n',
    title: '14. De Calpamulato y Cambuja, Jíbaro',
    creator: 'Workshop of New Spain',
    institution: 'Archivo General de la Nación, Mexico City',
    date: 'c. 1785',
    category: 'Castas Painting Series I',
    description: 'Depicts the jíbaro categorization in a woodland environment with woodcutting tools, clay pipes, and vernacular garments.',
    historicalSignificance: 'Illustrates the expansive linguistic taxonomy utilized by colonial authorities to track demographic expansion into frontier zones.',
    imageUrl: '/castas/castaS1o-n.jpg',
    thumbnailUrl: '/castas/castaS1o-n.jpg'
  },
  {
    id: 'casta-1o-o',
    title: '15. De Jíbaro y Mulata, Albarazado Tornaatrás',
    creator: 'Attributed to Francisco Antonio Vallejo Workshop',
    institution: 'Museo de Bellas Artes, Valencia',
    date: 'c. 1786',
    category: 'Castas Painting Series I',
    description: 'Shows musical recreation with a baroque guitar (vihuela) and percussive gourds inside a town dwelling.',
    historicalSignificance: 'Preserves rare visual documentation of Afro-diasporic and criollo musical instruments and shared cultural pastimes.',
    imageUrl: '/castas/castaS1o-o.jpg',
    thumbnailUrl: '/castas/castaS1o-o.jpg'
  },
  {
    id: 'casta-1o-p',
    title: '16. Indios Gentiles e Infieles de las Misiones',
    creator: 'Anonymous Colonial Painter',
    institution: 'Museo de América, Madrid',
    date: 'c. 1788',
    category: 'Castas Painting Series I (Frontier Tribes)',
    description: 'Final plate of Series 1 depicting unconquered northern nomadic indigenous groups (Chichimecas / Apaches) with traditional bows, feather headpieces, and skin quivers.',
    historicalSignificance: 'Reflects the geopolitical anxieties of the Spanish Crown regarding imperial frontiers and unassimilated sovereign indigenous nations.',
    imageUrl: '/castas/castaS1o-p.jpg',
    thumbnailUrl: '/castas/castaS1o-p.jpg'
  },

  // --- SERIES 2 (Plates A through N - 14 Full Plates) ---
  {
    id: 'casta-2o-a',
    title: '17. De Español y India, Mestizo (Serie II)',
    creator: 'Anonymous Master Painter (Second Series)',
    institution: 'Biblioteca Nacional de México / Museo de América',
    date: 'c. 1780 – 1790',
    category: 'Castas Painting Series II',
    description: 'Opening plate of Series II depicting a Spanish hidalgo in embroidered tricorne hat, an indigenous mother in fine cotton textiles, and their mestizo son carrying books.',
    historicalSignificance: 'Emphasizes formal literacy and elite social status attainable by early-generation mestizos within urban viceregal society.',
    imageUrl: '/castas/castaS2o-a.jpg',
    thumbnailUrl: '/castas/castaS2o-a.jpg'
  },
  {
    id: 'casta-2o-b',
    title: '18. De Español y Mestiza, Castizo (Serie II)',
    creator: 'Workshop of Andrés de Islas',
    institution: 'Museo Regional de Guadalajara',
    date: 'c. 1782',
    category: 'Castas Painting Series II',
    description: 'Portrayal of a merchant household with ledgers, imported porcelain teaware, and velvet cloaks.',
    historicalSignificance: 'Illustrates the progression towards "restored" Spanish status (limpieza de sangre) across successive generations.',
    imageUrl: '/castas/castaS2o-b.jpg',
    thumbnailUrl: '/castas/castaS2o-b.jpg'
  },
  {
    id: 'casta-2o-c',
    title: '19. De Castizo y Española, Español Criollo',
    creator: 'Anonymous Academic Master',
    institution: 'Real Academia de Bellas Artes, Seville',
    date: 'c. 1783',
    category: 'Castas Painting Series II',
    description: 'Shows an aristocratic drawing room with gilded mirrors, European musical scores, and silk tapestries.',
    historicalSignificance: 'Demonstrates the legal doctrine of castizo offspring returning legally to full Spanish categorization.',
    imageUrl: '/castas/castaS2o-c.jpg',
    thumbnailUrl: '/castas/castaS2o-c.jpg'
  },
  {
    id: 'casta-2o-d',
    title: '20. De Español y Negra, Mulato (Serie II)',
    creator: 'Workshop of Mexico City',
    institution: 'Museo Franz Mayer, Mexico City',
    date: 'c. 1784',
    category: 'Castas Painting Series II',
    description: 'Portrays a prosperous urban mercantile courtyard with tobacco bundles, scale weights, and lace mantillas.',
    historicalSignificance: 'Highlights the commercial vitality and civic role of Afro-descendant entrepreneurs in capital markets.',
    imageUrl: '/castas/castaS2o-d.jpg',
    thumbnailUrl: '/castas/castaS2o-d.jpg'
  },
  {
    id: 'casta-2o-e',
    title: '21. De Español y Mulata, Morisco (Serie II)',
    creator: 'Attributed to Juan Patricio Morlete Ruiz',
    institution: 'Museo Nacional del Prado, Madrid (Deposit)',
    date: 'c. 1785',
    category: 'Castas Painting Series II',
    description: 'Detailed study of an artisan silver workshop, displaying delicate repoussé plates and engraving tools.',
    historicalSignificance: 'Affirms the prominent role of mixed-descent master craftsmen in the renowned silversmith guilds of New Spain.',
    imageUrl: '/castas/castaS2o-e.jpg',
    thumbnailUrl: '/castas/castaS2o-e.jpg'
  },
  {
    id: 'casta-2o-f',
    title: '22. De Español y Morisca, Albino (Serie II)',
    creator: 'Colonial Guild Workshop',
    institution: 'Hispanic Society of America, New York',
    date: 'c. 1786',
    category: 'Castas Painting Series II',
    description: 'Interior depicting an apothecary and botanist residence with glass alembics, herbal specimens, and leatherbound codices.',
    historicalSignificance: 'Reflects Enlightenment natural science and botanical interest during royal scientific expeditions in the Americas.',
    imageUrl: '/castas/castaS2o-f.jpg',
    thumbnailUrl: '/castas/castaS2o-f.jpg'
  },
  {
    id: 'casta-2o-g',
    title: '23. De Español y Albina, Tornaatrás (Serie II)',
    creator: 'Anonymous Viceroyalty Master',
    institution: 'Museo de Santa Cruz, Toledo',
    date: 'c. 1787',
    category: 'Castas Painting Series II',
    description: 'Shows a family on an elevated balcony overlooking colonial aqueducts and bell towers.',
    historicalSignificance: 'Provides architectural panoramas of 18th-century Mexican civic infrastructure alongside demographic taxonomy.',
    imageUrl: '/castas/castaS2o-g.jpg',
    thumbnailUrl: '/castas/castaS2o-g.jpg'
  },
  {
    id: 'casta-2o-h',
    title: '24. De Indio y Negra, Lobo / Zambo',
    creator: 'Workshop of Oaxaca',
    institution: 'Museo de las Culturas de Oaxaca',
    date: 'c. 1787',
    category: 'Castas Painting Series II',
    description: 'Shows a weaver working a pedal loom alongside woven serapes and dyed wool coils.',
    historicalSignificance: 'Exemplifies the foundational labor of Afro-Indigenous weavers in the textile industries of southern Mexico.',
    imageUrl: '/castas/castaS2o-h.jpg',
    thumbnailUrl: '/castas/castaS2o-h.jpg'
  },
  {
    id: 'casta-2o-i',
    title: '25. De Lobo e India, Grifo',
    creator: 'Colonial Archival Master',
    institution: 'Museo Bello y González, Puebla',
    date: 'c. 1788',
    category: 'Castas Painting Series II',
    description: 'Depicts an artisanal ceramics pottery kiln with polychrome talavera tiles and glazed earthenware.',
    historicalSignificance: 'Documents the renowned Puebla ceramic tradition and the multicultural artisan guilds producing iconic colonial wares.',
    imageUrl: '/castas/castaS2o-i.jpg',
    thumbnailUrl: '/castas/castaS2o-i.jpg'
  },
  {
    id: 'casta-2o-j',
    title: '26. De Grifo y Negra, Zambo',
    creator: 'Anonymous Workshop',
    institution: 'Museo de Historia, Veracruz',
    date: 'c. 1788',
    category: 'Castas Painting Series II',
    description: 'Set in a tropical maritime wharf with fishing nets, drying salt cod, and mangrove scenery.',
    historicalSignificance: 'Visualizes coastal Afro-Mexican seafaring traditions, dockside labor, and fishing economies along the Gulf coast.',
    imageUrl: '/castas/castaS2o-j.jpg',
    thumbnailUrl: '/castas/castaS2o-j.jpg'
  },
  {
    id: 'casta-2o-k',
    title: '27. De Zambo e India, Albarazado (Serie II)',
    creator: 'Workshop of Michoacán',
    institution: 'Museo Regional Michoacano, Morelia',
    date: 'c. 1789',
    category: 'Castas Painting Series II',
    description: 'Illustrates lacquered wooden batea trays, gourd craftsmanship, and copper cauldrons from Santa Clara del Cobre.',
    historicalSignificance: 'Celebrates indigenous Purépecha and Afro-descendant lacquerware and metallurgical traditions.',
    imageUrl: '/castas/castaS2o-k.jpg',
    thumbnailUrl: '/castas/castaS2o-k.jpg'
  },
  {
    id: 'casta-2o-l',
    title: '28. De Albarazado y Mulata, Barcino (Serie II)',
    creator: 'Anonymous Master of New Spain',
    institution: 'Colección Banco Nacional de México (Banamex)',
    date: 'c. 1789',
    category: 'Castas Painting Series II',
    description: 'Shows family preparing hot drinking chocolate with carved wooden molinillo whisks and copper chocolateras.',
    historicalSignificance: 'Captures the widespread ritual and social centrality of cacao consumption across all strata of New Spain.',
    imageUrl: '/castas/castaS2o-l.jpg',
    thumbnailUrl: '/castas/castaS2o-l.jpg'
  },
  {
    id: 'casta-2o-m',
    title: '29. De Barcino y Zamba, Coyote (Serie II)',
    creator: 'Workshop of Bajío',
    institution: 'Museo de la Ciudad de Querétaro',
    date: 'c. 1790',
    category: 'Castas Painting Series II',
    description: 'Portrayal of a saddlery shop with leather chaps, spurs, and vaquero horse tack.',
    historicalSignificance: 'Traces the origins of Mexican equestrian (charrería) traditions rooted in multi-ethnic rural labor.',
    imageUrl: '/castas/castaS2o-m.jpg',
    thumbnailUrl: '/castas/castaS2o-m.jpg'
  },
  {
    id: 'casta-2o-n',
    title: '30. De Coyote y Morisca, Ahí te estás',
    creator: 'Anonymous Master Painter',
    institution: 'Museo Nacional de Historia, Mexico City',
    date: 'c. 1790',
    category: 'Castas Painting Series II',
    description: 'Depicts the colloquial "Ahí te estás" ("there you stay") casta designation in an open-air marketplace with tropical birds (macaws, parakeets).',
    historicalSignificance: 'Marks the outer linguistic bounds of casta taxonomy, where painters recorded colloquial phrases describing intricate ancestral mixtures.',
    imageUrl: '/castas/castaS2o-n.jpg',
    thumbnailUrl: '/castas/castaS2o-n.jpg'
  },

  // --- SPECIAL HISTORICAL & INQUISITION ARCHIVES ---
  {
    id: 'mulata-short',
    title: '31. Mulata de Córdoba — Archival Legend & Inquisition Dossier',
    creator: 'Tribunal del Santo Oficio de la Inquisición (Veracruz / Mexico City)',
    institution: 'Archivo General de la Nación (AGN), Mexico',
    date: 'c. 1795',
    category: 'Inquisition Trials & Folklore',
    description: 'Judicial dossier and witness illustration regarding the legendary healer and artist known as the Mulata de Córdoba, accused of witchcraft and miraculous drawing upon prison cell walls.',
    historicalSignificance: 'Opens a window into gender dynamics, autonomy, and the persecution of traditional healers of African and mixed descent by the colonial Inquisition.',
    imageUrl: '/castas/Mulata_o-short.JPG',
    thumbnailUrl: '/castas/Mulata_o-short.JPG'
  },
  {
    id: 'test-plate-4',
    title: '32. Cartographic & Demographic Survey Plate IV (Viceroyalty of New Spain)',
    creator: 'Dirección de Hidrografía de la Real Armada',
    institution: 'Museo Naval de Madrid / Archivo de Simancas',
    date: 'c. 1792',
    category: 'Hydrographic & Demographic Survey',
    description: 'Comprehensive coastal and demographic survey plate charting port fortifications, mining centers (Guanajuato, Zacatecas), and indigenous tribute populations.',
    historicalSignificance: 'Represents late 18th-century Bourbon reforms in colonial administration, combining military engineering with rigorous statistical census-taking.',
    imageUrl: '/castas/test4.jpg',
    thumbnailUrl: '/castas/test4.jpg'
  }
];
