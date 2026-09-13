export interface CountryHistoricalDevelopmentDossier {
  id: string;
  countryName: string;
  countryCode: string;
  region: string;
  historicalTastRegion: string;
  portsOfEmbarkation: string[];
  tastVolumeEstimate: string;
  colonialPower: string;
  editorialLead: string;
  foundationsSummary: {
    preColonialEpoch: string;
    colonialExtractionMethod: string;
    modernInstitutionalLegacy: string;
  };
  wikiArticles: {
    title: string;
    url: string;
    description: string;
  }[];
  molecularReportTopic: string;
  foundationsReportTopic: string;
}

export const COUNTRY_HISTORICAL_DOSSIERS: Record<string, CountryHistoricalDevelopmentDossier> = {
  // NIGERIA
  nigeria: {
    id: 'nigeria',
    countryName: 'Nigeria',
    countryCode: 'NGA',
    region: 'Western Africa',
    historicalTastRegion: 'Bight of Benin & Bight of Biafra',
    portsOfEmbarkation: ['Bonny', 'Old Calabar', 'Lagos', 'Badagry', 'Brass', 'Nembe', 'New Calabar (Elem Kalabari)'],
    tastVolumeEstimate: '3,500,000+ captives embarked (over 28% of entire transatlantic forced migration)',
    colonialPower: 'British Empire (Royal Niger Company charter 1886; Northern & Southern Protectorates merged in 1914)',
    editorialLead: 'As the geographic core of both the Bight of Biafra and eastern Bight of Benin embarkation zones, the Nigerian coastal littoral and inland river corridors served as the single largest human extraction funnel of the Trans-Atlantic Slave Trade. Fortified coastal city-states like Bonny, Calabar, and Lagos transformed into intensive commercial entrepôts where firearms and imported brass manillas catalyzed militarized captive raids through the Aro Confederacy and the collapsing Oyo Empire. This severe demographic extraction permanently distorted indigenous governance structures, paving the path for British chartered monopolization under the Royal Niger Company and the 1914 colonial amalgamation. Today, Nigeria’s developmental trajectory reflects these compounding structural epochs: the persistent friction between pre-colonial ethno-regional political settlements, single-commodity extractive export corridors (from palm oil to petroleum), and the urgent imperative for sovereign institutional reintegration.',
    foundationsSummary: {
      preColonialEpoch: 'Flourishing forest kingdoms and savannas (Oyo, Benin, Sokoto Caliphate, Igbo decentralized federations, Kanem-Bornu) with complex trade networks and metallurgy.',
      colonialExtractionMethod: 'Lord Lugard’s indirect rule doctrine, Royal Niger Company monopoly concessions, railway corridors engineered exclusively from interior mines and groundnut basins to oceanic ports.',
      modernInstitutionalLegacy: 'Structural dualism between extractive resource centers and agrarian peripheries, ethno-regional federal tension, and ongoing industrial diversification.'
    },
    wikiArticles: [
      { title: 'Atlantic slave trade in Nigeria', url: 'https://en.wikipedia.org/wiki/Slavery_in_Nigeria', description: 'Historical extraction networks, coastal ports, and abolition transitions.' },
      { title: 'Colonial Nigeria & 1914 Amalgamation', url: 'https://en.wikipedia.org/wiki/Colonial_Nigeria', description: 'British indirect rule, charter concessions, and institutional state creation.' },
      { title: 'Kingdom of Benin & Oyo Empire', url: 'https://en.wikipedia.org/wiki/Kingdom_of_Benin', description: 'Pre-colonial metallurgical mastery, political institutions, and trade dynasties.' }
    ],
    molecularReportTopic: 'Bight of Biafra & Benin Genomic Admixture in the African Diaspora',
    foundationsReportTopic: 'Monopsonistic Palm Oil Transition & Royal Niger Company Institutional Lock-in'
  },

  // CABO VERDE
  'cape-verde': {
    id: 'cape-verde',
    countryName: 'Cabo Verde',
    countryCode: 'CPV',
    region: 'Western Africa',
    historicalTastRegion: 'Upper Guinea Maritime Archipelago & Transatlantic Staging Nexus',
    portsOfEmbarkation: ['Ribeira Grande (Cidade Velha)', 'Praia', 'Mindelo (Porto Grande)', 'Sal', 'Boa Vista'],
    tastVolumeEstimate: 'Over 450,000 captives staged and seasoned in the 16th–18th centuries (first creole crucible)',
    colonialPower: 'Portuguese Empire (discovered uninhabited in 1460; colonized via feudal captaincies and royal slave charters)',
    editorialLead: 'Settled by Portuguese navigators in the mid-fifteenth century, the previously uninhabited archipelago of Cabo Verde was transformed into the world’s inaugural transatlantic maritime crucible—an oceanic sorting, seasoning, and transshipment hub connecting the Upper Guinea coast (Senegal, Gambia, Guinea-Bissau) to Brazil and the Caribbean. At Ribeira Grande (Cidade Velha), enslaved West African artisans, rice cultivators, and pastoralists fused Wolof, Mandinka, Balanta, and Portuguese idioms to forge the first modern Atlantic Creole language (Kriolu) and social fabric. Stripped of ecological buffers through devastating colonial drought cycles and extractive plantation tenures, Cabo Verde endured centuries of metropolitan neglect before mounting one of Africa’s most celebrated anti-colonial liberation struggles alongside Guinea-Bissau under Amílcar Cabral. In the contemporary era, Cabo Verde stands as a sovereign democratic lighthouse, leveraging diaspora remittances, renewable oceanic blue economies, and high governance standards to transcend historical geographic vulnerabilities.',
    foundationsSummary: {
      preColonialEpoch: 'Uninhabited volcanic archipelago before 1460, subsequently populated by Upper Guinea captives and Iberian settlers.',
      colonialExtractionMethod: 'Crown plantation feudal captaincies, slave re-export monopolies, cloth-currency (panos) production, and systematic neglect during recurrent Sahelo-Atlantic famines.',
      modernInstitutionalLegacy: 'A vibrant oceanic democracy, high Human Development Index (HDI), robust institutional rule of law, and strong diaspora-driven transnational capital flows.'
    },
    wikiArticles: [
      { title: 'History of Cape Verde', url: 'https://en.wikipedia.org/wiki/History_of_Cape_Verde', description: 'Establishment of Cidade Velha, transshipment economy, and Kriolu ethnogenesis.' },
      { title: 'Amílcar Cabral & PAIGC Liberation', url: 'https://en.wikipedia.org/wiki/Am%C3%ADlcar_Cabral', description: 'The intellectual and armed struggle uniting Guinea-Bissau and Cabo Verde.' },
      { title: 'Cidade Velha (Ribeira Grande)', url: 'https://en.wikipedia.org/wiki/Cidade_Velha', description: 'UNESCO World Heritage transatlantic port of embarkation and pelvic fort.' }
    ],
    molecularReportTopic: 'Senegambian & Upper Guinea Genetic Substrates in Cabo Verdean Kriolu Lineages',
    foundationsReportTopic: 'Archipelagic Crucible Dynamics & Early Modern Atlantic Capital Formation'
  },

  // GHANA
  ghana: {
    id: 'ghana',
    countryName: 'Ghana',
    countryCode: 'GHA',
    region: 'Western Africa',
    historicalTastRegion: 'Gold Coast Littoral',
    portsOfEmbarkation: ['Cape Coast Castle', 'Elmina Castle (São Jorge da Mina)', 'Fort Christiansborg (Osu)', 'Anomabu', 'Fort Prinzenstein (Keta)'],
    tastVolumeEstimate: '1,500,000+ captives embarked (12.1% of Atlantic total)',
    colonialPower: 'British Empire (Gold Coast Colony established 1874 following Anglo-Ashanti Wars; prior Dutch/Danish/Portuguese fortresses)',
    editorialLead: 'For four centuries, the 500-kilometer coastline of present-day Ghana possessed the highest density of European military fortifications anywhere in the world, with over forty castles, forts, and lodges erected by Portuguese, Dutch, British, and Danish chartered monopolies. What originated as a commercial trade in alluvial Gold Coast bullion rapidly transformed into an industrialized human embarkation funnel as coastal forts like Elmina, Cape Coast Castle, and Anomabu channeled Akan, Fante, Ga-Adangbe, and northern Savanna captives across the Atlantic. The ensuing militarization reorganized interior statehood, fostering the martial expansion of the Ashanti Empire and its protracted defense against British imperial subjugation. Under colonial rule, the British Gold Coast was structured around cocoa monopsonies and gold concessions. Under Kwame Nkrumah’s visionary leadership in 1957, Ghana became the vanguard of sub-Saharan African independence, laying the philosophical and diplomatic foundations for continental Pan-Africanism and institutional renaissance.',
    foundationsSummary: {
      preColonialEpoch: 'Highly sophisticated forest and savanna polities (Ashanti Empire, Fante Confederacy, Dagbon Kingdom) featuring complex gold weight systems and court diplomacy.',
      colonialExtractionMethod: 'Direct annexation of coastal forts, Ashanti subjugation, cocoa marketing board price depressions, and enclave mining concessions.',
      modernInstitutionalLegacy: 'Stable democratic institutionalism, leading sovereign cocoa and gold value-chain integration, and global beacon for the African Diaspora “Year of Return.”'
    },
    wikiArticles: [
      { title: 'Forts and Castles, Volta, Greater Accra, Central and Western Regions', url: 'https://en.wikipedia.org/wiki/Forts_and_Castles,_Volta,_Greater_Accra,_Central_and_Western_Regions', description: 'UNESCO fortified slave dungeons along the Gold Coast.' },
      { title: 'Ashanti Empire & Anglo-Ashanti Wars', url: 'https://en.wikipedia.org/wiki/Ashanti_Empire', description: 'Pre-colonial state centralization, Golden Stool sovereignty, and anti-colonial resistance.' },
      { title: 'Kwame Nkrumah & Independence', url: 'https://en.wikipedia.org/wiki/Kwame_Nkrumah', description: 'The pioneer of African decolonization and non-aligned Pan-Africanism.' }
    ],
    molecularReportTopic: 'Akan & Gbe Genetic Signatures in Caribbean Maroon & Plantation Populations',
    foundationsReportTopic: 'From Slave Dungeons to Cocoa Monopsonies: Colonial Marketing Board Dynamics'
  },

  // ANGOLA
  angola: {
    id: 'angola',
    countryName: 'Angola',
    countryCode: 'AGO',
    region: 'Central Africa',
    historicalTastRegion: 'West Central Africa (Congo-Angola Littoral)',
    portsOfEmbarkation: ['Luanda (São Paulo da Assunção)', 'Benguela', 'Cabinda', 'Novo Redondo (Sumbe)', 'Ambriz'],
    tastVolumeEstimate: '3,600,000+ captives embarked (over 28.5% of total transatlantic volume, the largest single regional extraction in human history)',
    colonialPower: 'Portuguese Empire (direct crown administration, sertanejo inland raiding alliances, and chartered concession companies)',
    editorialLead: 'Angola represents the epicenter of human demographic extraction in world history. Over nearly four centuries, Portuguese colonial armadas and mixed-race *pombeiros* (inland slave traders) extracted upwards of 3.6 million enslaved Africans through the deep-water ports of Luanda, Benguela, and Cabinda—primarily to fuel the sugar, gold, and coffee plantation engines of colonial Brazil. The demographic hemorrhage shattered the venerable Kingdom of Kongo and Queen Nzinga’s Kingdom of Ndongo-Matamba, re-engineering the demographic balance of the entire Central African interior. Following the 19th-century transition to forced agrarian labor (*chibalo*), the Portuguese dictatorship pursued brutal counter-insurgency campaigns until independence in 1975, which immediately plunged into a twenty-seven-year Cold War proxy conflict. Today, Angola is leveraging its immense petroleum, diamond, and agricultural potential to dismantle the institutional scars of concessionary extraction and build an integrated, diversified sovereign economy.',
    foundationsSummary: {
      preColonialEpoch: 'Powerful centralized realms including the Kingdom of Kongo, Ndongo, Matamba, and Ovimbundu highland kingdoms with advanced iron metallurgy and civic order.',
      colonialExtractionMethod: 'Sertão slave-raiding wars, crown-mandated forced labor (indigenato regime / chibalo), and Portuguese state concession monopolies (Diamang).',
      modernInstitutionalLegacy: 'Capital-intensive oil and mineral dominance, rapid post-war urban reconstruction, and strategic diversification into the Lobito Atlantic Corridor.'
    },
    wikiArticles: [
      { title: 'Slavery in Angola & Luanda Embarkations', url: 'https://en.wikipedia.org/wiki/Slavery_in_Angola', description: 'The transatlantic conduit linking Luanda and Benguela to Bahia and Rio de Janeiro.' },
      { title: 'Kingdom of Ndongo & Queen Nzinga', url: 'https://en.wikipedia.org/wiki/Kingdom_of_Ndongo', description: 'Military resistance and diplomacy against Portuguese expansion.' },
      { title: 'Angolan War of Independence & Civil Conflict', url: 'https://en.wikipedia.org/wiki/Angolan_War_of_Independence', description: 'Anti-colonial liberation struggles and post-colonial geopolitical proxy wars.' }
    ],
    molecularReportTopic: 'Bantu-Kimbundu & Ovimbundu Genomic Roots in Brazil and the Americas',
    foundationsReportTopic: 'Long-Run Economic Impacts of West Central African Captive Depopulation'
  },

  // SENEGAL
  senegal: {
    id: 'senegal',
    countryName: 'Senegal',
    countryCode: 'SEN',
    region: 'Western Africa',
    historicalTastRegion: 'Senegambia & River Senegal Basin',
    portsOfEmbarkation: ['Gorée Island (Maison des Esclaves)', 'Saint-Louis (Ndar)', 'Rufisque', 'Carabane (Casamance)', 'Bakel'],
    tastVolumeEstimate: '850,000+ captives embarked (6.9% of total Atlantic volume; vital early staging area)',
    colonialPower: 'French Empire (capital of French West Africa / AOF; early assimilation doctrine via the Four Communes)',
    editorialLead: 'Flanked by the Senegal and Gambia rivers, Senegambia was one of the earliest regions engulfed by Atlantic commerce. From the fortified bastions of Gorée Island and Saint-Louis, Wolof, Sereer, Pulaar (Toucouleur), and Mandinka captives were embarked for plantations in Saint-Domingue (Haiti), Louisiana, and South Carolina. The trade stimulated deep structural shocks across pre-colonial Wolof kingdoms (Jolof, Cayor, Baol) and the Futa Tooro theocratic state, precipitating intense Islamic revivalist reform movements. France later designated Saint-Louis and Dakar as the administrative heart of its vast *Afrique Occidentale Française* (AOF) empire, experimenting with the “Four Communes” citizenship model while enforcing peanut monocropping across the interior. Since peaceful independence under poet-philosopher Léopold Sédar Senghor in 1960, Senegal has sustained an unbroken tradition of democratic stability, legal institutionalism, and pioneering cultural diplomacy.',
    foundationsSummary: {
      preColonialEpoch: 'The Jolof Empire federation, Futa Tooro Torodbe Islamic state, and Sine-Saloum maritime kingdoms with rich oral epics and trans-Saharan trading ties.',
      colonialExtractionMethod: 'AOF administrative centralization in Dakar, railway construction for groundnut monoculture extraction, and dual legal code (citizens vs. subjects).',
      modernInstitutionalLegacy: 'Exemplary peaceful democratic transfers of power, vibrant Sufi civic brotherhoods (Mouride, Tijaniyya), and expanding offshore natural gas industrial horizons.'
    },
    wikiArticles: [
      { title: 'Gorée Island & Maison des Esclaves', url: 'https://en.wikipedia.org/wiki/Gor%C3%A9e', description: 'UNESCO transatlantic memorial island and slave trade processing center.' },
      { title: 'French West Africa (AOF)', url: 'https://en.wikipedia.org/wiki/French_West_Africa', description: 'Federal colonial governance centered in Dakar and Saint-Louis.' },
      { title: 'Léopold Sédar Senghor & Négritude', url: 'https://en.wikipedia.org/wiki/L%C3%A9opold_S%C3%A9dar_Senghor', description: 'Founding father of modern Senegal, statesman, and philosopher of cultural synthesis.' }
    ],
    molecularReportTopic: 'Senegambian & Mande Genomic Fingerprints in Louisiana and Chesapeake Bay',
    foundationsReportTopic: 'Groundnut Monoculture, Colonial Taxation & Peasant Resistance in Senegambia'
  },

  // DEMOCRATIC REPUBLIC OF THE CONGO
  drc: {
    id: 'drc',
    countryName: 'Democratic Republic of the Congo',
    countryCode: 'COD',
    region: 'Central Africa',
    historicalTastRegion: 'Congo Basin & Pool Malebo Conduit',
    portsOfEmbarkation: ['Boma', 'Banana', 'Matadi', 'Loango Coast estuaries'],
    tastVolumeEstimate: '2,000,000+ captives funneled down the Congo River system (16.4% of total Atlantic volume)',
    colonialPower: 'King Leopold II (Congo Free State 1885–1908; private concession regime); Belgian State (1908–1960)',
    editorialLead: 'The vast drainage basin of the Congo River formed a continental highway of human extraction, funneling captives from deep in the equatorial rainforest (Mongo, Luba, Kuba, Bangala) down to coastal embarkation points at Boma, Matadi, and Banana. Following the 1884–85 Berlin Conference, Belgian King Leopold II claimed the territory as his private estate—the Congo Free State—inaugurating one of history’s most catastrophic eras of rubber and ivory forced labor, which halved the local population through mass atrocities. In 1908, the Belgian state assumed control, creating an ultra-extractive tripartite institutional alliance of state bureaucracy, the Catholic Church, and massive mining cartels (notably *Union Minière du Haut-Katanga*). The sudden assassination of Prime Minister Patrice Lumumba in 1961 cemented decades of foreign intervention and kleptocracy. Today, the DRC holds 70% of the world’s cobalt and colossal reserves of coltan, copper, and lithium, making its sovereign resource governance the vital hinge of the 21st-century global green transition.',
    foundationsSummary: {
      preColonialEpoch: 'Renowned forest and savanna civilizations including the Kingdom of Kongo, Luba Empire, and Kuba artistic kingdom with unmatched sculpture and governance.',
      colonialExtractionMethod: 'Leopoldian rubber rubber quotas enforced by the Force Publique; subsequent corporate mining monopolies (Union Minière) with near-zero African higher education.',
      modernInstitutionalLegacy: 'Extreme resource-curse vulnerabilities, critical mineral geopolitics (cobalt, lithium), and ongoing initiatives for domestic beneficiation and regional peace.'
    },
    wikiArticles: [
      { title: 'Congo Free State & Rubber Extraction', url: 'https://en.wikipedia.org/wiki/Congo_Free_State', description: 'Leopold II’s private concessionary regime and international human rights outcry.' },
      { title: 'Patrice Lumumba & Decolonization', url: 'https://en.wikipedia.org/wiki/Patrice_Lumumba', description: 'Pan-African liberation leader, first Prime Minister, and martyr of Congolese sovereignty.' },
      { title: 'Mining industry of the Democratic Republic of the Congo', url: 'https://en.wikipedia.org/wiki/Mining_industry_of_the_Democratic_Republic_of_the_Congo', description: 'Colbalt, coltan, copper, and modern strategic mineral geopolitics.' }
    ],
    molecularReportTopic: 'Central Bantu Genetic Distributions Across the Transatlantic Caribbean Basin',
    foundationsReportTopic: 'From King Leopold’s Concessions to Union Minière: The Architecture of Monopsony'
  },

  // BENIN
  benin: {
    id: 'benin',
    countryName: 'Benin',
    countryCode: 'BEN',
    region: 'Western Africa',
    historicalTastRegion: 'Slave Coast (Bight of Benin)',
    portsOfEmbarkation: ['Ouidah (Glidji / Savi)', 'Porto-Novo (Hogbonu)', 'Grand-Popo', 'Cotonou'],
    tastVolumeEstimate: '1,900,000+ captives embarked (15.5% of total Atlantic volume)',
    colonialPower: 'French Empire (French Dahomey annexed 1894 after the Franco-Dahomean Wars led by King Béhanzin)',
    editorialLead: 'Known historically to European cartographers as the “Slave Coast,” the coastal lagoons and hinterlands of modern Benin were the site of the Kingdom of Dahomey’s highly centralized military state. Centered on the royal capital of Abomey and the coastal trading terminus of Ouidah (the Route des Esclaves), Dahomey developed formidable military institutions—including the legendary Agojie (Dahomey Amazons)—to conduct seasonal captive raids and manage trade with Portuguese, French, and British merchants. In 1894, following fierce resistance led by King Béhanzin, France conquered the realm, incorporating Dahomey into French West Africa and redirecting its economy toward palm kernel exports. In 1990, Benin pioneered sub-Saharan Africa’s peaceful democratic transition via its National Conference model. Today, through cultural restitution, port modernization at Cotonou, and the memorialization of Ouidah, Benin is forging a dynamic sovereign synthesis of history, culture, and trade.',
    foundationsSummary: {
      preColonialEpoch: 'Kingdom of Dahomey, Allada, and Porto-Novo kingdoms featuring complex Vodun sacred philosophy, royal court tapestries, and elite women warrior regiments (Agojie).',
      colonialExtractionMethod: 'Franco-Dahomean military conquest, royal palace looting, palm oil marketing monopolies, and forced port infrastructure corvée labor.',
      modernInstitutionalLegacy: 'Pioneering constitutional democracy (1990 Sovereign National Conference), global spiritual capital of Vodun, and active pioneer of looted royal artifact restitution.'
    },
    wikiArticles: [
      { title: 'Kingdom of Dahomey & Agojie Regiments', url: 'https://en.wikipedia.org/wiki/Dahomey', description: 'Military centralization, royal palaces of Abomey, and Atlantic commerce.' },
      { title: 'Ouidah & The Route des Esclaves', url: 'https://en.wikipedia.org/wiki/Ouidah', description: 'Major transatlantic embarkation port and the Point of No Return memorial.' },
      { title: 'Restitution of Dahomey Treasures', url: 'https://en.wikipedia.org/wiki/Dahomey_royal_treasures', description: 'Pioneering return of royal artifacts from French museums to Benin.' }
    ],
    molecularReportTopic: 'Fon, Yoruba & Ewe Genetic Ancestry in Haitian Vodou & Afro-Brazilian Candomblé',
    foundationsReportTopic: 'Dahomean Militarization, Palm Oil Transition & French Concessionary Rule'
  },

  // MOZAMBIQUE
  mozambique: {
    id: 'mozambique',
    countryName: 'Mozambique',
    countryCode: 'MOZ',
    region: 'Eastern Africa',
    historicalTastRegion: 'Southeast Africa & Mozambique Channel',
    portsOfEmbarkation: ['Quelimane', 'Mozambique Island (Ilha de Moçambique)', 'Ibo Island (Cabo Delgado)', 'Inhambane', 'Lourenço Marques (Maputo)'],
    tastVolumeEstimate: '550,000+ captives embarked (predominantly 1800–1860 during the late transatlantic clandestine boom)',
    colonialPower: 'Portuguese Empire (chartered concession companies: Companhia de Moçambique, Companhia do Niassa, Zambezia Company)',
    editorialLead: 'While the transatlantic trade began in West Africa, the intense naval blockades of the 19th century drove slave ships south around the Cape of Good Hope to the Mozambique Channel. From ports such as Quelimane, Ilha de Moçambique, and Ibo Island, over half a million Makua, Sena, Yao, and Tsonga captives were embarked across the Indian Ocean to French Mascarene sugar plantations (Réunion, Mauritius) and across the South Atlantic to Brazil and Cuba. Portugal outsourced sovereignty across over half of Mozambique’s landmass to private British, French, and South African concessionary charter companies (*Companhia de Moçambique* and *Companhia do Niassa*), which imposed brutal head taxes (*palhota*) and forced labor (*chibalo*). After a decade-long armed liberation struggle led by FRELIMO under Samora Machel, independence in 1975 was followed by a devastating sixteen-year civil war fueled by apartheid destabilization. Today, Mozambique is transforming its economy through massive offshore natural gas deposits in the Rovuma Basin and strategic Indian Ocean trade corridors.',
    foundationsSummary: {
      preColonialEpoch: 'Swahili-Arab trading city-states, the Mutapa Empire, and Maravi kingdoms linked to centuries of Indian Ocean gold, ivory, and maritime commerce.',
      colonialExtractionMethod: 'Concessionary charter companies, violent cotton and sisal forced cultivation, and massive labor export treaties to South African Witwatersrand gold mines.',
      modernInstitutionalLegacy: 'Post-conflict institutional rebuilding, strategic transit corridors for landlocked Southern African states, and liquefied natural gas (LNG) mega-projects.'
    },
    wikiArticles: [
      { title: 'Slavery in Mozambique & The Indian Ocean Trade', url: 'https://en.wikipedia.org/wiki/Slavery_in_Mozambique', description: 'Transatlantic and Indian Ocean embarkations from Quelimane and Ilha de Moçambique.' },
      { title: 'Chartered Companies in Portuguese Mozambique', url: 'https://en.wikipedia.org/wiki/Companhia_de_Mo%C3%A7ambique', description: 'Private concessionary rule and forced labor extraction regimes.' },
      { title: 'Samora Machel & Mozambican War of Independence', url: 'https://en.wikipedia.org/wiki/Samora_Machel', description: 'FRELIMO leader, revolutionary anti-apartheid statesman, and first President.' }
    ],
    molecularReportTopic: 'Makua, Sena & Tsonga Genetic Signatures in Brazil, Cuba, and Mauritius',
    foundationsReportTopic: 'Prazos da Coroa & Concessionary Charter Company Extractive Governance'
  },

  // SIERRA LEONE
  'sierra-leone': {
    id: 'sierra-leone',
    countryName: 'Sierra Leone',
    countryCode: 'SLE',
    region: 'Western Africa',
    historicalTastRegion: 'Windward Coast & Upper Guinea Rivers',
    portsOfEmbarkation: ['Bunce Island', 'Sherbro Island', 'Sierra Leone River estuary', 'Port Loko', 'Sulima'],
    tastVolumeEstimate: '700,000+ captives embarked (5.8% of Atlantic volume; critical source of North American rice-growing captives)',
    colonialPower: 'British Empire (Freetown established 1787 for liberated slaves; Crown Colony 1808; Protectorate 1896)',
    editorialLead: 'Sierra Leone holds a uniquely poignant dual role in Atlantic history. During the height of the 18th-century slave trade, British chartered companies operated Bunce Island—a fortified castle in the Sierra Leone River estuary specifically designed to procure Mende, Temne, and Limba captives renowned for their ancestral rice cultivation expertise to populate the sea-island plantations of South Carolina and Georgia (the Gullah Geechee diaspora). Simultaneously, beginning in 1787, British abolitionists founded Freetown as a haven for the “Black Poor” of London, Nova Scotian Black Loyalists, and recaptives intercepted by the Royal Navy’s West Africa Squadron. The synthesis of these diverse African lineages generated the vibrant Krio culture and Fourah Bay College (the “Athens of West Africa”). After overcoming the devastating 1991–2002 civil war fueled by illicit diamond trade, Sierra Leone has stabilized its democratic institutions and is driving investments in universal education, sustainable agriculture, and critical mineral value-addition.',
    foundationsSummary: {
      preColonialEpoch: 'Mende and Temne chiefdoms, Sape confederacies, and inland Mande trading routes with renowned Poro and Sande educational and judicial societies.',
      colonialExtractionMethod: 'Bunce Island slave fort, hut-tax enforcement (Hut Tax War of 1898 led by Bai Bureh), and extractive British diamond and rutile mining concessions.',
      modernInstitutionalLegacy: 'Rich Krio linguistic and educational heritage, democratic reconciliation post-civil war, and strategic industrialization of mineral wealth.'
    },
    wikiArticles: [
      { title: 'Bunce Island & Gullah Geechee Connection', url: 'https://en.wikipedia.org/wiki/Bunce_Island', description: 'Fortified slave castle and direct genetic-cultural link to American Sea Islands.' },
      { title: 'Freetown & The Recaptive Settlement', url: 'https://en.wikipedia.org/wiki/Freetown', description: 'Establishment of the colony of liberated Africans and Krio culture.' },
      { title: 'Bai Bureh & The 1898 Hut Tax War', url: 'https://en.wikipedia.org/wiki/Bai_Bureh', description: 'Anti-colonial military resistance against British direct taxation.' }
    ],
    molecularReportTopic: 'Mende & Temne Rice-Cultivator DNA Markers in Gullah Geechee Populations',
    foundationsReportTopic: 'Freetown Dual Governance, Hut Tax Rebellions & Diamond Concession Traps'
  },

  // GUINEA-BISSAU
  'guinea-bissau': {
    id: 'guinea-bissau',
    countryName: 'Guinea-Bissau',
    countryCode: 'GNB',
    region: 'Western Africa',
    historicalTastRegion: 'Upper Guinea Rivers (Cacheu & Geba Estuaries)',
    portsOfEmbarkation: ['Cacheu', 'Bissau (São José de Bissau)', 'Geba', 'Bijagós Archipelago (Orango)'],
    tastVolumeEstimate: '380,000+ captives embarked (3.1% of Atlantic total; pivotal Portuguese 16th–17th c. feeder)',
    colonialPower: 'Portuguese Empire (administered from Cabo Verde until 1879; harsh indigenato and groundnut requisitioning)',
    editorialLead: 'The mangrove-fringed river estuaries of Guinea-Bissau formed Portugal’s earliest mainland slaving beachheads in Africa. Centered on the 16th-century fortress of Cacheu and later Bissau Island, Portuguese *lançados* (outcast settlers) traded European textiles and firearms for Balanta, Papel, Bijagos, and Manjaco captives who were transported to the Cabo Verde archipelago for processing and transatlantic re-embarkation. The decentralized, acephalous political structures of coastal groups like the Balanta fiercely resisted Portuguese conquest into the early 20th century. In 1956, Amílcar Cabral founded the African Party for the Independence of Guinea and Cape Verde (PAIGC), organizing a brilliant armed liberation struggle that liberated two-thirds of the country and catalyzed the 1974 Carnation Revolution in Lisbon, toppling the Portuguese fascist dictatorship. In the post-colonial era, Guinea-Bissau is striving to consolidate democratic institutions, expand cashew agro-processing, and unlock its offshore fisheries and petroleum assets.',
    foundationsSummary: {
      preColonialEpoch: 'Decentralized coastal societies with peerless mangrove rice cultivation engineering alongside centralized Mandinka kingdoms (Kaabu Empire).',
      colonialExtractionMethod: 'Cacheu trade monopoly, brutal “pacification campaigns” through 1915, forced groundnut cultivation, and disenfranchisement under the Estatuto dos Indígenas.',
      modernInstitutionalLegacy: 'Historic anti-colonial vanguard legacy, agricultural dominance in cashew nut cultivation, and institutional peacebuilding.'
    },
    wikiArticles: [
      { title: 'History of Guinea-Bissau & Cacheu Fortress', url: 'https://en.wikipedia.org/wiki/History_of_Guinea-Bissau', description: 'Portuguese fortress, riverine slave trade, and Kaabu empire relations.' },
      { title: 'Amílcar Cabral & Guinean Liberation War', url: 'https://en.wikipedia.org/wiki/Guinea-Bissau_War_of_Independence', description: 'The guerrilla struggle that toppled the Portuguese colonial empire.' },
      { title: 'Balanta Mangrove Rice Cultivation', url: 'https://en.wikipedia.org/wiki/Balanta_people', description: 'Ingenious coastal hydraulic engineering and pre-colonial resistance.' }
    ],
    molecularReportTopic: 'Balanta, Papel & Bijagos Ancestry in Cabo Verde and Northeast Brazil',
    foundationsReportTopic: 'Kaabu Empire Fragmentation, Lançado Intermediaries & Portuguese Colonial Defeat'
  }
};

/**
 * Universal fallback builder for any country without an explicit manual override.
 * Generates an academically rigorous, engaging, and professional narrative connecting TAST,
 * colonial extraction, and modern development foundations.
 */
export function getCountryHistoricalDevelopmentDossier(
  countryNameOrCode: string,
  fallbackRegion?: string
): CountryHistoricalDevelopmentDossier {
  const query = countryNameOrCode.toLowerCase().trim();
  const normalizedKey = query.replace(/[^a-z0-9]+/g, '-');

  // Direct exact match in dictionary
  if (COUNTRY_HISTORICAL_DOSSIERS[normalizedKey]) {
    return COUNTRY_HISTORICAL_DOSSIERS[normalizedKey];
  }

  // Search by countryName or countryCode
  const entry = Object.values(COUNTRY_HISTORICAL_DOSSIERS).find(
    d => d.countryName.toLowerCase() === query || d.countryCode.toLowerCase() === query || d.id === normalizedKey
  );
  if (entry) return entry;

  // Synthesize an academically grounded dossier tailored to the region
  const name = countryNameOrCode.charAt(0).toUpperCase() + countryNameOrCode.slice(1);
  const region = fallbackRegion || 'African Continent';

  let tastRegion = 'Trans-Atlantic and Regional African Mercantile Networks';
  let ports = ['Regional Coastal Entrepôts & River Confluences'];
  let volume = 'Documented regional demographic flows and migration corridors';
  let power = 'European Colonial Partition (Post-Berlin Conference 1884–85)';

  if (region.includes('Western')) {
    tastRegion = 'Western African Littoral & Savanna Feeder Corridors';
    ports = ['Gulf of Guinea Coast', 'Bight Littorals', 'Riverine Confluences'];
    volume = 'Direct feeder embarkations and internal captive trade dynamics';
    power = 'British / French West African Colonial Administration (AOF / Direct Concessions)';
  } else if (region.includes('Central')) {
    tastRegion = 'West Central African Congo Basin & Atlantic Coastline';
    ports = ['Loango Coast', 'Congo River Estuary', 'Atlantic Termini'];
    volume = 'Significant human demographic extractions funneled to Atlantic sugar and mining colonies';
    power = 'French Equatorial Africa (AEF) / Belgian / Portuguese Concessionary Charters';
  } else if (region.includes('Eastern')) {
    tastRegion = 'Indian Ocean, Swahili Coast & Red Sea Maritime Networks';
    ports = ['Swahili Coast', 'Zanzibar Corridor', 'Mozambique Channel'];
    volume = 'Indian Ocean and Atlantic clandestine human trade flows';
    power = 'British East Africa / German East Africa / Portuguese East Africa';
  } else if (region.includes('Southern')) {
    tastRegion = 'Southern African Mineral and Agrarian Labor Corridors';
    ports = ['Delagoa Bay', 'Cape Maritime Route', 'Atlantic Ports'];
    volume = 'Regional forced labor migration and settler-colonial land appropriations';
    power = 'British South Africa Company / Afrikaner / German Protectorates';
  } else if (region.includes('Northern')) {
    tastRegion = 'Trans-Saharan Caravan Highways & Mediterranean Basin';
    ports = ['Mediterranean Ports', 'Oasis Caravan Termini', 'Nile Valley'];
    volume = 'Trans-Saharan trade in gold, salt, manuscripts, and human capital';
    power = 'French / British / Italian Colonial Hegemony & Ottoman Sovereignty';
  }

  return {
    id: normalizedKey,
    countryName: name,
    countryCode: name.slice(0, 3).toUpperCase(),
    region,
    historicalTastRegion: tastRegion,
    portsOfEmbarkation: ports,
    tastVolumeEstimate: volume,
    colonialPower: power,
    editorialLead: `Throughout the compounding structural epochs of modern African history, ${name} has occupied a vital position within the broader geopolitical transformations of the continent. From pre-colonial trade confluences and the demographic disruptions of the Atlantic and regional mercantile eras to the institutional disruptions imposed by late 19th-century European partition, the territory’s economic institutions were systematically configured for primary commodity extraction. The legacy of colonial chartered monopolies, dual legal systems, and export-oriented infrastructure corridors continues to shape contemporary developmental dynamics. Today, ${name} is actively advancing sovereign institutional reforms, regional economic integration under the African Continental Free Trade Area (AfCFTA), and strategic value-addition across its natural and human capital endowments.`,
    foundationsSummary: {
      preColonialEpoch: `Diverse indigenous governance systems, customary land tenures, and regional commerce across ${region}.`,
      colonialExtractionMethod: `Extractive administrative centralization, agricultural/mineral concession regimes, and transport links oriented exclusively to export hubs.`,
      modernInstitutionalLegacy: `Institutional modernization, resource value-chain beneficiation, and civic democratization under pan-African development agendas.`
    },
    wikiArticles: [
      { title: `History of ${name}`, url: `https://en.wikipedia.org/wiki/History_of_${encodeURIComponent(name)}`, description: `Historical epochs, pre-colonial kingdoms, and decolonization milestones.` },
      { title: 'Economic history of Africa', url: 'https://en.wikipedia.org/wiki/Economic_history_of_Africa', description: 'Comprehensive survey of pre-colonial, colonial, and post-independence development.' },
      { title: 'Decolonization of Africa', url: 'https://en.wikipedia.org/wiki/Decolonisation_of_Africa', description: 'The sovereign struggle for continental independence and self-determination.' }
    ],
    molecularReportTopic: `${name} Genomic Lineages & Continental Genetic Diversity`,
    foundationsReportTopic: `${name} in the Long-Run Institutional & Economic Development Paradigm`
  };
}
