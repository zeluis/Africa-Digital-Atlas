/**
 * slaveVoyagesPorts.ts
 * Comprehensive Registry of African Embarkation Ports, Forts, and Coastal Enclaves
 * Geographically mapped across the 8 coastal regions of the Atlantic Slave Trade.
 */

export interface AfricanEmbarkationPort {
  id: string;
  name: string;
  historicalAliases: string[];
  region: 'Senegambia' | 'Sierra Leone' | 'Windward Coast' | 'Gold Coast' | 'Bight of Benin' | 'Bight of Biafra' | 'West Central Africa' | 'Southeast Africa';
  countryModern: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  svgCoordinates?: {
    x: number;
    y: number;
  };
  fortOrType: 'Masonry Castle / Fort' | 'Factory / Roadstead' | 'River Estuary / Barracoon' | 'Island Entrepôt';
  europeanPowers: ('Portugal' | 'Great Britain' | 'France' | 'Netherlands' | 'Denmark' | 'Brandenburg/Prussia' | 'Spain' | 'United States' | 'Sweden' | 'Brazil' | 'Germany')[];
  indigenousPolity: string;
  activeCentury: ('16th' | '17th' | '18th' | '19th')[];
  estimatedEmbarkations: number;
  primaryEthnicGroups: string[];
  primaryDestinations: string[];
  historicalDescription: string;
  unescoWorldHeritage: boolean;
}

export const AFRICAN_EMBARKATION_PORTS: AfricanEmbarkationPort[] = [
  // ========================================================
  // 1. SENEGAMBIA
  // ========================================================
  {
    id: 'port-goree',
    name: 'Gorée Island (Maison des Esclaves)',
    historicalAliases: ['Goeree', 'Île de Gorée', 'Beer'],
    region: 'Senegambia',
    countryModern: 'Senegal',
    coordinates: { lat: 14.6669, lng: -17.3986 },
    fortOrType: 'Island Entrepôt',
    europeanPowers: ['Portugal', 'Netherlands', 'France', 'Great Britain'],
    indigenousPolity: 'Kingdom of Cayor / Lebou Republic',
    activeCentury: ['16th', '17th', '18th', '19th'],
    estimatedEmbarkations: 312000,
    primaryEthnicGroups: ['Wolof', 'Serer', 'Fula', 'Mandinka'],
    primaryDestinations: ['Saint-Domingue (Haiti)', 'Louisiana', 'French Guiana', 'Guadeloupe'],
    historicalDescription: 'Strategically located roadstead off Dakar. Captured by the Dutch in 1627, taken by France in 1677, and contested with Britain until 1814. Served as the administrative focal point of the French Compagnie des Indes.',
    unescoWorldHeritage: true
  },
  {
    id: 'port-saint-louis',
    name: 'Saint-Louis (Fort Saint-Louis)',
    historicalAliases: ['Ndar', 'Fort Louis'],
    region: 'Senegambia',
    countryModern: 'Senegal',
    coordinates: { lat: 16.0244, lng: -16.5028 },
    fortOrType: 'River Estuary / Barracoon',
    europeanPowers: ['France', 'Great Britain'],
    indigenousPolity: 'Kingdom of Waalo',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 185000,
    primaryEthnicGroups: ['Wolof', 'Fula', 'Moors (Hassani)'],
    primaryDestinations: ['Saint-Domingue', 'Louisiana', 'Martinique'],
    historicalDescription: 'Founded by French merchants in 1659 at the mouth of the Senegal River. Governed by a prominent métis (Signare) merchant class controlling inland gum arabic and captive caravans from the western Sahel.',
    unescoWorldHeritage: true
  },
  {
    id: 'port-james-island',
    name: 'James Island (Kunta Kinteh Island)',
    historicalAliases: ['Fort James', 'Saint Andrew\'s Island', 'Gambia River Post'],
    region: 'Senegambia',
    countryModern: 'The Gambia',
    coordinates: { lat: 13.3175, lng: -16.3619 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Great Britain', 'France', 'Brandenburg/Prussia'],
    indigenousPolity: 'Kingdom of Niumi / Barra',
    activeCentury: ['17th', '18th'],
    estimatedEmbarkations: 198000,
    primaryEthnicGroups: ['Mandinka', 'Jola', 'Fula', 'Wolof'],
    primaryDestinations: ['Maryland', 'Virginia', 'South Carolina (Charleston)', 'Barbados'],
    historicalDescription: 'Fortified island situated 30 km up the Gambia River. Controlled British Royal African Company operations in Senegambia. Immortalized in African-American diaspora historiography through Kunta Kinte.',
    unescoWorldHeritage: true
  },
  {
    id: 'port-albreda',
    name: 'Albreda & Juffure',
    historicalAliases: ['Albadar', 'Jillifree'],
    region: 'Senegambia',
    countryModern: 'The Gambia',
    coordinates: { lat: 13.3347, lng: -16.3831 },
    fortOrType: 'Factory / Roadstead',
    europeanPowers: ['France'],
    indigenousPolity: 'Kingdom of Niumi',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 60000,
    primaryEthnicGroups: ['Mandinka', 'Wolof'],
    primaryDestinations: ['French West Indies', 'Saint-Domingue'],
    historicalDescription: 'French trading enclave on the north bank of the Gambia River, established directly opposite British Fort James to bypass the British river monopoly.',
    unescoWorldHeritage: true
  },

  // ========================================================
  // 2. SIERRA LEONE & UPPER GUINEA
  // ========================================================
  {
    id: 'port-bunce-island',
    name: 'Bunce Island',
    historicalAliases: ['Bence Island', 'Bense Island', 'George Island'],
    region: 'Sierra Leone',
    countryModern: 'Sierra Leone',
    coordinates: { lat: 8.5714, lng: -13.0408 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Great Britain'],
    indigenousPolity: 'Temne & Koya Kingdoms',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 165000,
    primaryEthnicGroups: ['Temne', 'Mende', 'Limba', 'Kissi'],
    primaryDestinations: ['South Carolina (Charleston / Gullah Coast)', 'Georgia (Savannah)', 'Jamaica'],
    historicalDescription: 'British fortified island in the Sierra Leone River estuary, leased to London merchant syndicates Oswald & Grant. Specialized in supplying skilled rice-cultivating captives to South Carolina and Georgia plantations, fostering the Gullah Geechee cultural continuum.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-rio-pongo',
    name: 'Rio Pongo River Enclaves',
    historicalAliases: ['Rio Pongas', 'Boffa Posts'],
    region: 'Sierra Leone',
    countryModern: 'Guinea',
    coordinates: { lat: 10.0542, lng: -14.0722 },
    fortOrType: 'River Estuary / Barracoon',
    europeanPowers: ['Great Britain', 'Spain', 'United States'],
    indigenousPolity: 'Baga & Susu Chiefdoms',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 112000,
    primaryEthnicGroups: ['Susu', 'Baga', 'Fula (Fouta Djallon)'],
    primaryDestinations: ['Cuba (Havana)', 'South Carolina', 'Brazil'],
    historicalDescription: 'Tidal mangrove river in modern Guinea notorious during the illicit nineteenth-century trade. Operated by American and British private traders who intermarried with Susu royal families (the Lightburn, Curtis, and Wilkinson dynasties).',
    unescoWorldHeritage: false
  },
  {
    id: 'port-gallinas',
    name: 'Gallinas River (Sulima)',
    historicalAliases: ['Rio de las Gallinas', 'Pedro Blanco Enclave'],
    region: 'Sierra Leone',
    countryModern: 'Sierra Leone',
    coordinates: { lat: 7.0267, lng: -11.5972 },
    fortOrType: 'River Estuary / Barracoon',
    europeanPowers: ['Spain', 'Great Britain'],
    indigenousPolity: 'Vai Kingdom',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 111000,
    primaryEthnicGroups: ['Mende', 'Vai', 'Gola'],
    primaryDestinations: ['Cuba (Havana, Matanzas)', 'Brazil'],
    historicalDescription: 'Major 19th-century clandestine slave fortress operated by Spanish slaver Pedro Blanco. It was here that Sengbe Pieh (Joseph Cinqué) and his fellow Mende captives were purchased before being shipped on the Tecora to Cuba in 1839 (the Amistad saga).',
    unescoWorldHeritage: false
  },

  // ========================================================
  // 3. WINDWARD COAST
  // ========================================================
  {
    id: 'port-cape-mount',
    name: 'Cape Mount & Monrovia Roadstead',
    historicalAliases: ['Grand Mount', 'Mesurado River'],
    region: 'Windward Coast',
    countryModern: 'Liberia',
    coordinates: { lat: 6.7533, lng: -11.3653 },
    fortOrType: 'Factory / Roadstead',
    europeanPowers: ['Great Britain', 'Netherlands', 'France'],
    indigenousPolity: 'Dei & Bassa Confederacies',
    activeCentury: ['17th', '18th'],
    estimatedEmbarkations: 142000,
    primaryEthnicGroups: ['Kru', 'Bassa', 'Kpelle', 'Vai'],
    primaryDestinations: ['Jamaica', 'Barbados', 'Saint-Domingue'],
    historicalDescription: 'High promontory visible from far out to sea. Ships traded in the open roadstead directly with Kru longboat navigators. Kru sailors famously refused to be enslaved and were hired as freemen navigators along the coast.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-cape-palmas',
    name: 'Cape Palmas & Sassandra',
    historicalAliases: ['Cabo das Palmas', 'Grand Cess'],
    region: 'Windward Coast',
    countryModern: 'Liberia / Ivory Coast',
    coordinates: { lat: 4.3725, lng: -7.7125 },
    fortOrType: 'Factory / Roadstead',
    europeanPowers: ['France', 'Great Britain', 'Portugal'],
    indigenousPolity: 'Grebo & Kru Chiefdoms',
    activeCentury: ['17th', '18th'],
    estimatedEmbarkations: 194000,
    primaryEthnicGroups: ['Grebo', 'Dan', 'Krahn', 'Bété'],
    primaryDestinations: ['Barbados', 'Martinique', 'Guadeloupe'],
    historicalDescription: 'Demarcated the eastern limit of the Grain Coast. Characterized by ship-to-shore bartering across surf-swept beaches with local canoe flotillas.',
    unescoWorldHeritage: false
  },

  // ========================================================
  // 4. GOLD COAST
  // ========================================================
  {
    id: 'port-elmina',
    name: 'Elmina Castle (São Jorge da Mina)',
    historicalAliases: ['St. George of the Mine', 'Omina Castle'],
    region: 'Gold Coast',
    countryModern: 'Ghana',
    coordinates: { lat: 5.0844, lng: -1.3506 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Portugal', 'Netherlands', 'Great Britain'],
    indigenousPolity: 'Fante Confederacy & Kingdom of Komenda',
    activeCentury: ['16th', '17th', '18th', '19th'],
    estimatedEmbarkations: 384000,
    primaryEthnicGroups: ['Akan', 'Fante', 'Asante', 'Ga-Adangbe'],
    primaryDestinations: ['Suriname', 'Curaçao', 'Brazil (Bahia)', 'Jamaica'],
    historicalDescription: 'The oldest European building in sub-Saharan Africa, constructed by the Portuguese in 1482. Captured by the Dutch West India Company in 1637 and transferred to Great Britain in 1872. Features the notorious "Door of No Return."',
    unescoWorldHeritage: true
  },
  {
    id: 'port-cape-coast',
    name: 'Cape Coast Castle',
    historicalAliases: ['Carolusburg', 'Cabo Corso Castle'],
    region: 'Gold Coast',
    countryModern: 'Ghana',
    coordinates: { lat: 5.1053, lng: -1.2417 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Great Britain', 'Netherlands', 'Sweden'],
    indigenousPolity: 'Fante Confederacy & Oguaa State',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 425000,
    primaryEthnicGroups: ['Fante', 'Asante', 'Akyem', 'Twifo'],
    primaryDestinations: ['Jamaica', 'Barbados', 'Virginia', 'South Carolina'],
    historicalDescription: 'The fortified headquarters of the British Royal African Company and Committee of Merchants Trading to Africa on the Gold Coast. Its cavernous underground slave dungeons held up to 1,500 captives awaiting transport.',
    unescoWorldHeritage: true
  },
  {
    id: 'port-christiansborg',
    name: 'Fort Christiansborg (Osu Castle)',
    historicalAliases: ['Osu Castle', 'Christian\'s Fort'],
    region: 'Gold Coast',
    countryModern: 'Ghana',
    coordinates: { lat: 5.5458, lng: -0.1831 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Denmark', 'Portugal', 'Great Britain'],
    indigenousPolity: 'Ga State of Osu',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 172000,
    primaryEthnicGroups: ['Ga-Adangbe', 'Ewe', 'Akan'],
    primaryDestinations: ['Danish West Indies (Saint Thomas, Saint Croix, Saint John)'],
    historicalDescription: 'Constructed by Denmark–Norway in 1661 as the center of the Danish Gold Coast. Funneled thousands of Akan and Ga captives to the sugar plantations of the Danish Virgin Islands.',
    unescoWorldHeritage: true
  },
  {
    id: 'port-anomabu',
    name: 'Fort William (Anomabu)',
    historicalAliases: ['Annamaboe', 'Fort Charles'],
    region: 'Gold Coast',
    countryModern: 'Ghana',
    coordinates: { lat: 5.1742, lng: -1.1214 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Great Britain', 'Netherlands', 'France'],
    indigenousPolity: 'Fante State of Anomabu',
    activeCentury: ['17th', '18th'],
    estimatedEmbarkations: 228000,
    primaryEthnicGroups: ['Fante', 'Asante'],
    primaryDestinations: ['Jamaica', 'Barbados', 'Rhode Island'],
    historicalDescription: 'The single most active British slave trading fort on the Gold Coast during the eighteenth century, closely allied with powerful Fante brokers like Eno Baidoo Amissah.',
    unescoWorldHeritage: true
  },

  // ========================================================
  // 5. BIGHT OF BENIN (SLAVE COAST)
  // ========================================================
  {
    id: 'port-ouidah',
    name: 'Ouidah (Whydah Roadstead & Forts)',
    historicalAliases: ['Whydah', 'Juda', 'Ajudá', 'Glehue'],
    region: 'Bight of Benin',
    countryModern: 'Benin',
    coordinates: { lat: 6.3639, lng: 2.0853 },
    fortOrType: 'Factory / Roadstead',
    europeanPowers: ['Portugal', 'France', 'Great Britain', 'Netherlands'],
    indigenousPolity: 'Kingdom of Dahomey & Kingdom of Whydah',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 1024000,
    primaryEthnicGroups: ['Fon', 'Yoruba (Nago)', 'Ewe', 'Allada'],
    primaryDestinations: ['Brazil (Bahia)', 'Saint-Domingue (Haiti)', 'Cuba', 'Martinique'],
    historicalDescription: 'The single most prolific slaving port in West Africa. European powers maintained competing unfortified compounds under the strict supervision of the Dahomean Yovogan (viceroy). The Route des Esclaves extends 4 km to the Point of No Return.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-porto-novo',
    name: 'Porto-Novo (Hogbonu)',
    historicalAliases: ['Hogbonu', 'Adjache', 'Porto Novo'],
    region: 'Bight of Benin',
    countryModern: 'Benin',
    coordinates: { lat: 6.4969, lng: 2.6289 },
    fortOrType: 'River Estuary / Barracoon',
    europeanPowers: ['Portugal', 'France'],
    indigenousPolity: 'Kingdom of Hogbonu (Porto-Novo)',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 342000,
    primaryEthnicGroups: ['Yoruba', 'Gun', 'Fon'],
    primaryDestinations: ['Brazil (Bahia, Rio de Janeiro)', 'Cuba'],
    historicalDescription: 'Coastal lagoon terminus for trade routes controlled by the Kingdom of Porto-Novo. Deeply interconnected with the Bahia-Lagos Afro-Brazilian repatriate networks in the 19th century.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-lagos',
    name: 'Lagos (Eko)',
    historicalAliases: ['Eko', 'Onim', 'Rio de Laguo'],
    region: 'Bight of Benin',
    countryModern: 'Nigeria',
    coordinates: { lat: 6.4531, lng: 3.3958 },
    fortOrType: 'River Estuary / Barracoon',
    europeanPowers: ['Portugal', 'Great Britain', 'Brazil'],
    indigenousPolity: 'Kingdom of Lagos (Obaship) & Oyo Empire',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 388000,
    primaryEthnicGroups: ['Yoruba (Oyo, Egba, Ijebu)', 'Egun'],
    primaryDestinations: ['Brazil (Bahia, Rio)', 'Cuba (Havana)'],
    historicalDescription: 'Rose to preeminence during the nineteenth century as the Yoruba wars (following the collapse of the Oyo Empire) flooded the coast with war captives. Bombarded by the British Royal Navy in 1851 to enforce abolition.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-badagry',
    name: 'Badagry (Gberefu Island)',
    historicalAliases: ['Aganyin', 'Badagri'],
    region: 'Bight of Benin',
    countryModern: 'Nigeria',
    coordinates: { lat: 6.4158, lng: 2.8814 },
    fortOrType: 'Factory / Roadstead',
    europeanPowers: ['Portugal', 'Great Britain', 'Netherlands'],
    indigenousPolity: 'Badagry Chiefdom',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 236000,
    primaryEthnicGroups: ['Yoruba', 'Ogu (Egun)', 'Fon'],
    primaryDestinations: ['Brazil (Bahia)', 'Cuba', 'Jamaica'],
    historicalDescription: 'Key coastal slaving market situated on the Ologe Lagoon. Slaver Seriki Williams Abass maintained extensive barracoons (Vlekete Slave Market) here.',
    unescoWorldHeritage: false
  },

  // ========================================================
  // 6. BIGHT OF BIAFRA
  // ========================================================
  {
    id: 'port-bonny',
    name: 'Bonny & Opobo (Grand Bonny River)',
    historicalAliases: ['Ibani', 'Grand Bonny', 'Bonnystown'],
    region: 'Bight of Biafra',
    countryModern: 'Nigeria',
    coordinates: { lat: 4.4536, lng: 7.1667 },
    fortOrType: 'River Estuary / Barracoon',
    europeanPowers: ['Great Britain', 'France', 'Netherlands'],
    indigenousPolity: 'Kingdom of Bonny (Pepple Dynasty)',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 825000,
    primaryEthnicGroups: ['Igbo', 'Ijaw', 'Ibibio'],
    primaryDestinations: ['Jamaica', 'Barbados', 'Virginia', 'Saint-Domingue'],
    historicalDescription: 'The foremost slaving port in the Bight of Biafra. Governed by canoe-house merchant oligarchies led by the Pepple royal house. British Liverpool vessels dominated this trade, carrying predominantly Igbo captives.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-old-calabar',
    name: 'Old Calabar (Duke Town & Creek Town)',
    historicalAliases: ['Duke Town', 'Atakpa', 'Creek Town'],
    region: 'Bight of Biafra',
    countryModern: 'Nigeria',
    coordinates: { lat: 4.9589, lng: 8.3269 },
    fortOrType: 'River Estuary / Barracoon',
    europeanPowers: ['Great Britain', 'France'],
    indigenousPolity: 'Efik Kingdoms & Ekpe Secret Society',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 462000,
    primaryEthnicGroups: ['Efik', 'Ibibio', 'Igbo', 'Annang'],
    primaryDestinations: ['Jamaica', 'Virginia', 'Cuba (leading to Abakuá secret societies)'],
    historicalDescription: 'Situated up the Cross River. Commerce was policed by the powerful Ekpe (leopard) society. Efik cultural concepts and sacred Nsibidi writing were transported directly to Cuba, giving birth to the Afro-Cuban Abakuá religion.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-bimbia',
    name: 'Bimbia & Duala River',
    historicalAliases: ['Bimbia Slave Port', 'Ambas Bay', 'Cameroons River'],
    region: 'Bight of Biafra',
    countryModern: 'Cameroon',
    coordinates: { lat: 3.9553, lng: 9.2472 },
    fortOrType: 'Factory / Roadstead',
    europeanPowers: ['Great Britain', 'Portugal', 'Germany'],
    indigenousPolity: 'Isu Subu (Bimbia) Kingdom',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 168000,
    primaryEthnicGroups: ['Duala', 'Bakweri', 'Bassa', 'Bamileke'],
    primaryDestinations: ['Jamaica', 'Saint-Domingue', 'Cuba'],
    historicalDescription: 'Coastal haven near Limbe where King William of Bimbia signed anti-slavery treaties with Britain in 1844. Remnants of heavy iron shackles and brick auction platforms remain visible on the shoreline.',
    unescoWorldHeritage: false
  },

  // ========================================================
  // 7. WEST CENTRAL AFRICA
  // ========================================================
  {
    id: 'port-luanda',
    name: 'Luanda (São Paulo de Luanda & Fortaleza)',
    historicalAliases: ['São Paulo da Assunção de Loanda', 'Loanda'],
    region: 'West Central Africa',
    countryModern: 'Angola',
    coordinates: { lat: -8.8383, lng: 13.2344 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Portugal', 'Netherlands'],
    indigenousPolity: 'Kingdom of Ndongo & Kingdom of Matamba',
    activeCentury: ['16th', '17th', '18th', '19th'],
    estimatedEmbarkations: 2840000,
    primaryEthnicGroups: ['Kimbundu (Mbundu)', 'Bakongo', 'Ovimbundu'],
    primaryDestinations: ['Brazil (Rio de Janeiro, Bahia, Pernambuco)', 'Spanish America (Buenos Aires, Potosí)'],
    historicalDescription: 'The absolute commercial titan of the trans-Atlantic trade. Established by Paulo Dias de Novais in 1576. Directly responsible for sending nearly 3 million human beings across the South Atlantic to Brazil. Overlooked by the imposing Fortaleza de São Miguel.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-benguela',
    name: 'Benguela (São Filipe de Benguela)',
    historicalAliases: ['São Filipe de Benguela', 'Bahia das Vacas'],
    region: 'West Central Africa',
    countryModern: 'Angola',
    coordinates: { lat: -12.5763, lng: 13.4055 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Portugal'],
    indigenousPolity: 'Ovimbundu Kingdoms (Bailundo, Bihe)',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 1410000,
    primaryEthnicGroups: ['Ovimbundu', 'Nganguela', 'Herero'],
    primaryDestinations: ['Brazil (Rio de Janeiro, Minas Gerais)', 'Cuba'],
    historicalDescription: 'Southern Portuguese slaving terminus in Angola. The gateway for trans-continental caravan routes passing through the Planalto Central to the upper Zambezi. Captives from Benguela were disproportionately sent to the gold and diamond mines of Minas Gerais.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-cabinda',
    name: 'Cabinda Bay & Malembo',
    historicalAliases: ['Kabinda', 'Port of Malimba', 'Porto Rico'],
    region: 'West Central Africa',
    countryModern: 'Angola (Cabinda Exclave)',
    coordinates: { lat: -5.5500, lng: 12.2000 },
    fortOrType: 'Factory / Roadstead',
    europeanPowers: ['Portugal', 'France', 'Great Britain'],
    indigenousPolity: 'Kingdom of Ngoyo & Kingdom of Kakongo',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 820000,
    primaryEthnicGroups: ['Bakongo (Fiote)', 'Yombe'],
    primaryDestinations: ['Saint-Domingue (Haiti)', 'Brazil', 'Cuba', 'Jamaica'],
    historicalDescription: 'Free-trade haven north of the Congo River where Portuguese colonial tariffs did not apply. French and British merchants purchased hundreds of thousands of Bakongo captives here in the 18th century, profoundly shaping Haitian Vodou (the Kongo Petwo rites).',
    unescoWorldHeritage: false
  },
  {
    id: 'port-mpinda',
    name: 'Mpinda (Soyo / Congo River Mouth)',
    historicalAliases: ['Pinda', 'Port of Soyo', 'Rio Zaire Post'],
    region: 'West Central Africa',
    countryModern: 'Angola',
    coordinates: { lat: -6.1333, lng: 12.3500 },
    fortOrType: 'River Estuary / Barracoon',
    europeanPowers: ['Portugal', 'Netherlands'],
    indigenousPolity: 'Kingdom of Kongo (Mbanza Kongo / Soyo)',
    activeCentury: ['16th', '17th', '18th'],
    estimatedEmbarkations: 435000,
    primaryEthnicGroups: ['Bakongo', 'Esikongo'],
    primaryDestinations: ['Brazil (Pernambuco, Bahia)', 'Spanish America (Cartagena, Veracruz)'],
    historicalDescription: 'The historic port of the Kingdom of Kongo since Portuguese explorer Diogo Cão arrived in 1482. Kongo King Afonso I famously wrote letters of protest to King John III of Portugal in 1526 decrying the kidnapping of noble youths.',
    unescoWorldHeritage: false
  },

  // ========================================================
  // 8. SOUTHEAST AFRICA & INDIAN OCEAN
  // ========================================================
  {
    id: 'port-mozambique-island',
    name: 'Mozambique Island (Ilha de Moçambique)',
    historicalAliases: ['Ilha de Moçambique', 'Fort San Sebastian'],
    region: 'Southeast Africa',
    countryModern: 'Mozambique',
    coordinates: { lat: -15.0342, lng: 40.7308 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Portugal'],
    indigenousPolity: 'Swahili Coast Sultanates & Marave Confederation',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 295000,
    primaryEthnicGroups: ['Makua', 'Yao', 'Lomwe'],
    primaryDestinations: ['Brazil (Rio de Janeiro)', 'French Mascarene Islands (Mauritius, Réunion)', 'Cuba'],
    historicalDescription: 'Fortified coral island capital of Portuguese East Africa. In the late 18th and 19th centuries, it funneled hundreds of thousands of East African captives across the Cape of Good Hope to Brazil and the Indian Ocean sugar islands.',
    unescoWorldHeritage: true
  },
  {
    id: 'port-quelimane',
    name: 'Quelimane & Zambezi Estuary',
    historicalAliases: ['São Martinho de Quelimane', 'Cuama River Port'],
    region: 'Southeast Africa',
    countryModern: 'Mozambique',
    coordinates: { lat: -17.8786, lng: 36.8883 },
    fortOrType: 'River Estuary / Barracoon',
    europeanPowers: ['Portugal', 'France'],
    indigenousPolity: 'Prazo Landowners & Sena Kingdom',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 165000,
    primaryEthnicGroups: ['Sena', 'Chopi', 'Ndau', 'Makua'],
    primaryDestinations: ['Brazil (Rio de Janeiro)', 'Cuba'],
    historicalDescription: 'Located at the mouth of the Bons Sinais River, connected to the massive Zambezi river basin prazos (private estates). Active during the clandestine 19th-century trade to Brazil.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-zanzibar',
    name: 'Zanzibar (Stone Town Slave Market)',
    historicalAliases: ['Unguja', 'Stone Town'],
    region: 'Southeast Africa',
    countryModern: 'Tanzania',
    coordinates: { lat: -6.1622, lng: 39.1897 },
    fortOrType: 'Island Entrepôt',
    europeanPowers: ['Portugal', 'Great Britain'],
    indigenousPolity: 'Sultanate of Zanzibar & Oman',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 82000,
    primaryEthnicGroups: ['Zaramo', 'Nyamwezi', 'Yao'],
    primaryDestinations: ['Mauritius', 'Réunion', 'Oman / Persian Gulf', 'French Caribbean'],
    historicalDescription: 'The hub of East African caravan routes. While predominantly serving the Indian Ocean and Swahili clove plantation trade, tens of thousands of captives were purchased by French and Portuguese traders for transatlantic transport.',
    unescoWorldHeritage: true
  },

  // ========================================================
  // ADDITIONAL ARCHIVAL FORTS & ESTUARIES (EXPANDED CORPUS)
  // ========================================================
  {
    id: 'port-cacheu',
    name: 'Cacheu (Fortaleza de Nossa Senhora)',
    historicalAliases: ['Cacheo', 'Rio de San Domingos'],
    region: 'Senegambia',
    countryModern: 'Guinea-Bissau',
    coordinates: { lat: 12.2750, lng: -16.1667 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Portugal'],
    indigenousPolity: 'Papel & Manjaco Kingdoms',
    activeCentury: ['16th', '17th', '18th'],
    estimatedEmbarkations: 188000,
    primaryEthnicGroups: ['Papel', 'Manjaco', 'Balanta', 'Bijago'],
    primaryDestinations: ['Brazil (Maranhão, Pará)', 'Cape Verde'],
    historicalDescription: 'One of the earliest Portuguese fortified feitorias in West Africa, established in 1588. Governed by the Companhia de Cacheu e Rios da Guiné.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-bissau',
    name: 'Bissau (Fortaleza de São José da Amura)',
    historicalAliases: ['Porto de Bissau', 'Amura Fort'],
    region: 'Senegambia',
    countryModern: 'Guinea-Bissau',
    coordinates: { lat: 11.8594, lng: -15.5842 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Portugal', 'France'],
    indigenousPolity: 'Kingdom of Bissau (Papel)',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 142000,
    primaryEthnicGroups: ['Balanta', 'Papel', 'Fula', 'Mandinga'],
    primaryDestinations: ['Brazil (Maranhão)', 'Cuba'],
    historicalDescription: 'Key naval stronghold on the Geba River estuary, fortified in 1696 to monopolize the slave trade of the Upper Guinea rivers.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-sherbro',
    name: 'Sherbro Island & York Island',
    historicalAliases: ['York Fort', 'Sherbro River'],
    region: 'Sierra Leone',
    countryModern: 'Sierra Leone',
    coordinates: { lat: 7.5500, lng: -12.5000 },
    fortOrType: 'Island Entrepôt',
    europeanPowers: ['Great Britain'],
    indigenousPolity: 'Sherbro Bullom & Caulker Chieftaincies',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 135000,
    primaryEthnicGroups: ['Sherbro', 'Mende', 'Temne'],
    primaryDestinations: ['Barbados', 'Jamaica', 'South Carolina'],
    historicalDescription: 'Island base in the southern coastal estuaries of Sierra Leone, operated in part by the Anglo-African Caulker family dynasty.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-grand-bassa',
    name: 'Grand Bassa & Bassa Cove',
    historicalAliases: ['Bassa Cove', 'Grand Bassa Point'],
    region: 'Windward Coast',
    countryModern: 'Liberia',
    coordinates: { lat: 5.8811, lng: -10.0458 },
    fortOrType: 'Factory / Roadstead',
    europeanPowers: ['Great Britain', 'France', 'United States'],
    indigenousPolity: 'Bassa Confederacy',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 64000,
    primaryEthnicGroups: ['Bassa', 'Kru'],
    primaryDestinations: ['Saint-Domingue', 'Jamaica', 'Cuba'],
    historicalDescription: 'Coastal trading station south of Monrovia, active in bartering salt, camwood, and captives across open roads.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-grand-bassam',
    name: 'Grand-Bassam & Comoé Estuary',
    historicalAliases: ['Bassam', 'Fort Nemours'],
    region: 'Windward Coast',
    countryModern: 'Ivory Coast',
    coordinates: { lat: 5.2078, lng: -3.7386 },
    fortOrType: 'Factory / Roadstead',
    europeanPowers: ['France', 'Portugal'],
    indigenousPolity: 'Nzema & Agni Kingdoms',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 58000,
    primaryEthnicGroups: ['Agni', 'Baoulé', 'Nzema'],
    primaryDestinations: ['Martinique', 'Guadeloupe', 'Saint-Domingue'],
    historicalDescription: 'Historic maritime lagoon port situated at the mouth of the Comoé River, serving French and Iberian traders.',
    unescoWorldHeritage: true
  },
  {
    id: 'port-fort-san-antonio',
    name: 'Fort San Antonio (Axim)',
    historicalAliases: ['Fort Santo António de Axim', 'Axim Post'],
    region: 'Gold Coast',
    countryModern: 'Ghana',
    coordinates: { lat: 4.8694, lng: -2.2422 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Portugal', 'Netherlands', 'Great Britain'],
    indigenousPolity: 'Nzema & Ahanta States',
    activeCentury: ['16th', '17th', '18th', '19th'],
    estimatedEmbarkations: 175000,
    primaryEthnicGroups: ['Nzema', 'Ahanta', 'Akan'],
    primaryDestinations: ['Suriname', 'Curaçao', 'Jamaica'],
    historicalDescription: 'Built by the Portuguese in 1515, the second oldest European fort on the Gold Coast, captured by the Dutch West India Company in 1642.',
    unescoWorldHeritage: true
  },
  {
    id: 'port-gross-friedrichsburg',
    name: 'Fort Gross Friedrichsburg (Princes Town)',
    historicalAliases: ['Brandenburg Fort', 'Prince\'s Town'],
    region: 'Gold Coast',
    countryModern: 'Ghana',
    coordinates: { lat: 4.7958, lng: -2.1361 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Brandenburg/Prussia', 'Netherlands', 'Great Britain'],
    indigenousPolity: 'Ahanta Kingdom (Chief John Canoe / Jan Conny)',
    activeCentury: ['17th', '18th'],
    estimatedEmbarkations: 92000,
    primaryEthnicGroups: ['Ahanta', 'Akan'],
    primaryDestinations: ['Saint Thomas (Danish West Indies)', 'Suriname'],
    historicalDescription: 'Headquarters of the Prussian Brandenburg African Company from 1683 to 1717. Defended heroically by the African merchant prince John Canoe.',
    unescoWorldHeritage: true
  },
  {
    id: 'port-metal-cross',
    name: 'Fort Metal Cross (Dixcove)',
    historicalAliases: ['Dixcove Fort', 'Metaal Kruis'],
    region: 'Gold Coast',
    countryModern: 'Ghana',
    coordinates: { lat: 4.7950, lng: -1.9442 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Great Britain', 'Netherlands'],
    indigenousPolity: 'Ahanta Chieftaincy',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 125000,
    primaryEthnicGroups: ['Ahanta', 'Fante'],
    primaryDestinations: ['Barbados', 'Jamaica', 'Virginia'],
    historicalDescription: 'British fortified post erected in 1692 overlooking Dixcove Bay. Resisted repeated Dutch and Ahanta sieges during the Gold Coast trade wars.',
    unescoWorldHeritage: true
  },
  {
    id: 'port-fort-amsterdam',
    name: 'Fort Amsterdam (Kormantin / Abandze)',
    historicalAliases: ['Fort Cormantin', 'Kormantin Castle'],
    region: 'Gold Coast',
    countryModern: 'Ghana',
    coordinates: { lat: 5.1989, lng: -1.0853 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Great Britain', 'Netherlands'],
    indigenousPolity: 'Fante State of Kormantin',
    activeCentury: ['17th', '18th'],
    estimatedEmbarkations: 245000,
    primaryEthnicGroups: ['Fante', 'Asante'],
    primaryDestinations: ['Jamaica (giving rise to the "Coromantee" maroon warriors)', 'Barbados'],
    historicalDescription: 'Constructed by the English in 1638 and captured by Dutch Admiral Michiel de Ruyter in 1665. Captives from here were renowned in Jamaica as Coromantees.',
    unescoWorldHeritage: true
  },
  {
    id: 'port-fort-prinzenstein',
    name: 'Fort Prinzenstein (Keta)',
    historicalAliases: ['Prinsensten', 'Keta Fort'],
    region: 'Gold Coast',
    countryModern: 'Ghana',
    coordinates: { lat: 5.9222, lng: 0.9931 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Denmark', 'Great Britain'],
    indigenousPolity: 'Anlo Ewe State',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 118000,
    primaryEthnicGroups: ['Ewe', 'Anlo', 'Ada'],
    primaryDestinations: ['Danish West Indies (Saint Croix)', 'Brazil'],
    historicalDescription: 'Erected by Denmark in 1784 at Keta Lagoon. Served as the eastern bastion of Danish operations prior to Denmark\'s 1792/1803 abolition decree.',
    unescoWorldHeritage: true
  },
  {
    id: 'port-little-popo',
    name: 'Little Popo (Aného)',
    historicalAliases: ['Aného', 'Petit Popo'],
    region: 'Bight of Benin',
    countryModern: 'Togo',
    coordinates: { lat: 6.2294, lng: 1.5969 },
    fortOrType: 'Factory / Roadstead',
    europeanPowers: ['Portugal', 'Great Britain', 'France', 'Germany'],
    indigenousPolity: 'Guin / Mina Kingdom',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 215000,
    primaryEthnicGroups: ['Guin', 'Ewe', 'Mina'],
    primaryDestinations: ['Brazil (Bahia)', 'Cuba', 'Saint-Domingue'],
    historicalDescription: 'Settled by Ga and Fante refugees from the Gold Coast who established the Mina kingdom. Major embarkation point for captives from the Mono river basin.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-grand-popo',
    name: 'Grand-Popo & Mono Estuary',
    historicalAliases: ['Popo Grande', 'Great Popo'],
    region: 'Bight of Benin',
    countryModern: 'Benin',
    coordinates: { lat: 6.2817, lng: 1.8261 },
    fortOrType: 'Factory / Roadstead',
    europeanPowers: ['Portugal', 'France', 'Netherlands'],
    indigenousPolity: 'Hula Kingdom',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 198000,
    primaryEthnicGroups: ['Hula', 'Fon', 'Xwla'],
    primaryDestinations: ['Brazil (Bahia)', 'Saint-Domingue', 'Cuba'],
    historicalDescription: 'Situated at the mouth of the Mono River, serving as an alternative coastal roadstead to bypass Dahomean royal customs at Ouidah.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-gwato',
    name: 'Gwato & Ughoton (Kingdom of Benin Port)',
    historicalAliases: ['Gwatto', 'Ughoton', 'Port of Benin'],
    region: 'Bight of Benin',
    countryModern: 'Nigeria',
    coordinates: { lat: 6.2753, lng: 5.3781 },
    fortOrType: 'River Estuary / Barracoon',
    europeanPowers: ['Portugal', 'Netherlands', 'Great Britain'],
    indigenousPolity: 'Kingdom of Benin (Oba of Benin)',
    activeCentury: ['16th', '17th', '18th'],
    estimatedEmbarkations: 178000,
    primaryEthnicGroups: ['Edo (Bini)', 'Urhobo', 'Itsekiri'],
    primaryDestinations: ['Brazil (Bahia)', 'Spanish Americas', 'Saint-Domingue'],
    historicalDescription: 'Historic river port of Great Benin on the Osse River tributary. Governed by the Uwangue and Eribo chiefs acting on behalf of the Oba of Benin.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-new-calabar',
    name: 'New Calabar (Elem Kalabari)',
    historicalAliases: ['Elem Kalabari', 'Rio Real Post'],
    region: 'Bight of Biafra',
    countryModern: 'Nigeria',
    coordinates: { lat: 4.6542, lng: 7.0208 },
    fortOrType: 'River Estuary / Barracoon',
    europeanPowers: ['Great Britain', 'France', 'Portugal'],
    indigenousPolity: 'Kalabari Kingdom (Amachree Dynasty)',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 395000,
    primaryEthnicGroups: ['Ijaw (Kalabari)', 'Igbo'],
    primaryDestinations: ['Jamaica', 'Barbados', 'Cuba'],
    historicalDescription: 'Major Niger Delta trading state governed by canoe-house merchant federations. Rival of the neighboring Pepple dynasty of Bonny.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-brass',
    name: 'Brass River & Nembe',
    historicalAliases: ['Rio Bento', 'Nembe Brass'],
    region: 'Bight of Biafra',
    countryModern: 'Nigeria',
    coordinates: { lat: 4.3122, lng: 6.2411 },
    fortOrType: 'River Estuary / Barracoon',
    europeanPowers: ['Great Britain', 'Portugal'],
    indigenousPolity: 'Nembe Kingdom (Kula & Brass)',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 265000,
    primaryEthnicGroups: ['Ijaw (Nembe)', 'Igbo'],
    primaryDestinations: ['Cuba', 'Brazil', 'Jamaica'],
    historicalDescription: 'Maritime outlet on the Brass River mouth through which palm oil and captives were transferred to offshore sailing vessels.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-sao-tome',
    name: 'São Tomé Island (Forte de São Sebastião)',
    historicalAliases: ['Ilha de São Tomé', 'Fortress of St. Sebastian'],
    region: 'Bight of Biafra',
    countryModern: 'São Tomé and Príncipe',
    coordinates: { lat: 0.3361, lng: 6.7411 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Portugal', 'Netherlands'],
    indigenousPolity: 'Portuguese Colony & Maroon Enclaves (Rei Amador)',
    activeCentury: ['16th', '17th', '18th', '19th'],
    estimatedEmbarkations: 375000,
    primaryEthnicGroups: ['Forros', 'Angolares', 'Bakongo'],
    primaryDestinations: ['Brazil (Pernambuco, Bahia)', 'Spanish Americas (Santo Domingo)'],
    historicalDescription: 'Volcanic island in the Gulf of Guinea that served as the prototype plantation economy before transmitting its sugarcane and slave system to Brazil.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-loango',
    name: 'Loango Bay (Diosso / Pointe-Noire)',
    historicalAliases: ['Baie de Loango', 'Port of Buali'],
    region: 'West Central Africa',
    countryModern: 'Republic of the Congo',
    coordinates: { lat: -4.6481, lng: 11.8311 },
    fortOrType: 'Factory / Roadstead',
    europeanPowers: ['France', 'Great Britain', 'Netherlands', 'Portugal'],
    indigenousPolity: 'Kingdom of Loango (Ma-Loango)',
    activeCentury: ['17th', '18th', '19th'],
    estimatedEmbarkations: 695000,
    primaryEthnicGroups: ['Bakongo (Vili)', 'Yombe'],
    primaryDestinations: ['Saint-Domingue (Haiti)', 'French Antilles', 'Cuba'],
    historicalDescription: 'Premier French embarkation port north of the Congo River. Thousands of Vili caravan traders brought captives from hundreds of miles inland.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-ambriz',
    name: 'Ambriz & Loge River',
    historicalAliases: ['Porto do Ambriz', 'Loge Estuary'],
    region: 'West Central Africa',
    countryModern: 'Angola',
    coordinates: { lat: -7.8481, lng: 13.1092 },
    fortOrType: 'Factory / Roadstead',
    europeanPowers: ['Portugal', 'Great Britain', 'United States', 'Brazil'],
    indigenousPolity: 'Kingdom of Kongo / Dembos Chieftaincies',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 285000,
    primaryEthnicGroups: ['Bakongo', 'Kimbundu'],
    primaryDestinations: ['Brazil (Rio de Janeiro)', 'Cuba'],
    historicalDescription: 'Active illicit slave shipping port during the 1830s–1850s, used by Brazilian and American clippers to evade British anti-slavery patrols.',
    unescoWorldHeritage: false
  },
  {
    id: 'port-kilwa',
    name: 'Kilwa Kisiwani',
    historicalAliases: ['Quíloa', 'Kilwa Sultanate'],
    region: 'Southeast Africa',
    countryModern: 'Tanzania',
    coordinates: { lat: -8.9581, lng: 39.5128 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Portugal', 'France'],
    indigenousPolity: 'Kilwa Sultanate & Swahili Confederation',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 105000,
    primaryEthnicGroups: ['Makonde', 'Yao', 'Swahili'],
    primaryDestinations: ['French Mascarenes (Mauritius, Réunion)', 'Brazil'],
    historicalDescription: 'Ancient Swahili coral island city with the 11th-century Great Mosque and the Portuguese Gereza fort. Channeled interior caravan captives to French traders.',
    unescoWorldHeritage: true
  },
  {
    id: 'port-ibo-island',
    name: 'Ibo Island (Quirimbas Archipelago)',
    historicalAliases: ['Ilha do Ibo', 'Fortaleza de São João Baptista'],
    region: 'Southeast Africa',
    countryModern: 'Mozambique',
    coordinates: { lat: -12.3481, lng: 40.5892 },
    fortOrType: 'Masonry Castle / Fort',
    europeanPowers: ['Portugal', 'France'],
    indigenousPolity: 'Swahili & Mwani Chieftaincies',
    activeCentury: ['18th', '19th'],
    estimatedEmbarkations: 138000,
    primaryEthnicGroups: ['Makua', 'Mwani', 'Yao'],
    primaryDestinations: ['French Mascarenes', 'Brazil', 'Cuba'],
    historicalDescription: 'Coral island fortification off Cabo Delgado. Functioned as a secluded holding depot for illicit nineteenth-century French and Brazilian slaving vessels.',
    unescoWorldHeritage: false
  }
];

/**
 * Calibrated Coastal Vector Coordinates:
 * Directly extracted from public/africa-final.svg (incorporating transform "translate(-216.0198 -66.614)").
 * Aligns all 47 historic embarkation ports precisely on their authentic ocean coastlines, bays, and offshore islands:
 * - Eastern African ports positioned on the Indian Ocean coast & archipelagoes (Zanzibar, Kilwa, Ibo, Mozambique Island, Quelimane)
 * - Western African ports positioned on the Atlantic shoreline (Senegambia, Sierra Leone, Windward, Gold Coast, Bight of Benin, Bight of Biafra)
 * - Angolan / West Central ports nudged in Y and X directly on coastal anchorages (Luanda bay, Benguela, Ambriz, Mpinda, Cabinda, Loango)
 */
export const CALIBRATED_PORT_SVG_COORDINATES: Record<string, { x: number; y: number }> = {
  // 1. SENEGAMBIA
  'port-goree': { x: 504, y: 1848 }, // Cap-Vert peninsula / Dakar / Gorée Island
  'port-saint-louis': { x: 664, y: 1681 }, // Senegal River mouth / Ndar
  'port-james-island': { x: 615, y: 1975 }, // Kunta Kinteh Island, Gambia River estuary
  'port-albreda': { x: 618, y: 1972 }, // Albreda & Juffure, Gambia north bank
  'port-cacheu': { x: 595, y: 2015 }, // Cacheu River estuary, Guinea-Bissau
  'port-bissau': { x: 610, y: 2045 }, // Geba River estuary / Bissau, Guinea-Bissau

  // 2. SIERRA LEONE & UPPER GUINEA
  'port-rio-pongo': { x: 720, y: 2200 }, // Rio Pongo mangrove river, Guinea
  'port-bunce-island': { x: 780, y: 2355 }, // Sierra Leone River estuary / Bunce Island
  'port-sherbro': { x: 830, y: 2420 }, // Sherbro & York Island, Sierra Leone coast
  'port-gallinas': { x: 885, y: 2470 }, // Gallinas River / Sulima, Sierra Leone

  // 3. WINDWARD COAST
  'port-cape-mount': { x: 940, y: 2515 }, // Cape Mount / Monrovia roadstead, Liberia
  'port-grand-bassa': { x: 1020, y: 2565 }, // Grand Bassa & Bassa Cove, Liberia
  'port-cape-palmas': { x: 1220, y: 2685 }, // Cape Palmas, Liberia / Ivory Coast border
  'port-grand-bassam': { x: 1490, y: 2620 }, // Grand-Bassam & Comoé estuary, Côte d'Ivoire

  // 4. GOLD COAST (GHANA)
  'port-fort-san-antonio': { x: 1568, y: 2533 }, // Fort San Antonio, Axim
  'port-gross-friedrichsburg': { x: 1580, y: 2538 }, // Fort Gross Friedrichsburg, Princes Town
  'port-metal-cross': { x: 1595, y: 2542 }, // Fort Metal Cross, Dixcove
  'port-elmina': { x: 1630, y: 2555 }, // São Jorge da Mina (Elmina Castle)
  'port-cape-coast': { x: 1640, y: 2557 }, // Cape Coast Castle (Carolusburg)
  'port-anomabu': { x: 1652, y: 2560 }, // Fort William, Anomabu
  'port-fort-amsterdam': { x: 1660, y: 2562 }, // Fort Amsterdam, Kormantin / Abandze
  'port-christiansborg': { x: 1771, y: 2568 }, // Fort Christiansborg (Osu Castle, Accra)
  'port-fort-prinzenstein': { x: 1845, y: 2545 }, // Fort Prinzenstein, Keta Lagoon

  // 5. BIGHT OF BENIN (SLAVE COAST)
  'port-little-popo': { x: 1890, y: 2535 }, // Little Popo (Aného), Togo
  'port-grand-popo': { x: 1920, y: 2530 }, // Grand-Popo & Mono estuary, Benin
  'port-ouidah': { x: 1965, y: 2525 }, // Ouidah (Whydah Roadstead & Forts), Benin
  'port-porto-novo': { x: 2005, y: 2520 }, // Porto-Novo (Hogbonu), Benin
  'port-badagry': { x: 2020, y: 2518 }, // Badagry (Gberefu Island), Nigeria
  'port-lagos': { x: 2034, y: 2518 }, // Lagos (Eko / Onim), Nigeria
  'port-gwato': { x: 2150, y: 2535 }, // Gwato & Ughoton, Benin River / Kingdom of Benin

  // 6. BIGHT OF BIAFRA
  'port-brass': { x: 2114, y: 2619 }, // Brass River & Nembe, Niger Delta
  'port-new-calabar': { x: 2235, y: 2665 }, // New Calabar (Elem Kalabari), Niger Delta
  'port-bonny': { x: 2257, y: 2672 }, // Grand Bonny & Opobo, Niger Delta
  'port-old-calabar': { x: 2402, y: 2514 }, // Old Calabar (Duke Town & Creek Town), Cross River
  'port-bimbia': { x: 2540, y: 2680 }, // Bimbia & Duala River, Cameroon coast
  'port-sao-tome': { x: 2223, y: 2965 }, // São Tomé Island (Forte de São Sebastião)

  // 7. WEST CENTRAL AFRICA (CONGO & ANGOLA)
  'port-loango': { x: 2620, y: 3340 }, // Loango Bay (Diosso / Pointe-Noire), Republic of the Congo
  'port-cabinda': { x: 2639, y: 3393 }, // Cabinda Bay & Malembo, Angola exclave
  'port-mpinda': { x: 2780, y: 3514 }, // Mpinda (Soyo / Congo River mouth), Angola
  'port-ambriz': { x: 2712, y: 3655 }, // Ambriz & Loge River, Angola
  'port-luanda': { x: 2660, y: 3792 }, // Luanda (São Paulo de Luanda), Angola (coastal bay)
  'port-benguela': { x: 2794, y: 4028 }, // Benguela (São Filipe de Benguela), Angola (coastal roadstead)

  // 8. SOUTHEAST AFRICA (EASTERN COAST & INDIAN OCEAN)
  'port-zanzibar': { x: 4536, y: 3526 }, // Stone Town, Zanzibar (Unguja) Island, Tanzania coast
  'port-kilwa': { x: 4555, y: 3774 }, // Kilwa Kisiwani, southern Tanzania coast
  'port-ibo-island': { x: 4456, y: 3980 }, // Ibo Island, Quirimbas Archipelago, Cabo Delgado, Mozambique
  'port-mozambique-island': { x: 4579, y: 4129 }, // Mozambique Island (Ilha de Moçambique), Nampula coast
  'port-quelimane': { x: 4333, y: 4253 }  // Quelimane & Zambezi estuary, Mozambique coast
};

// Bind calibrated SVG coordinates directly onto all port objects
for (const port of AFRICAN_EMBARKATION_PORTS) {
  if (CALIBRATED_PORT_SVG_COORDINATES[port.id]) {
    port.svgCoordinates = CALIBRATED_PORT_SVG_COORDINATES[port.id];
  }
}

/**
 * Calibrated Continental Projection:
 * Converts Geographic (lat, lng) to the 5,796 × 5,867 Coordinate Space of public/africa-final.svg.
 * Checks the authoritative calibrated coordinate dictionary by port ID first.
 */
export const projectPortToSvg = (lat: number, lng: number, portId?: string): { x: number; y: number } => {
  if (portId && CALIBRATED_PORT_SVG_COORDINATES[portId]) {
    return CALIBRATED_PORT_SVG_COORDINATES[portId];
  }
  return {
    x: Math.round(61.8 * lng + 1804),
    y: Math.round(-71.8 * lat + 3081)
  };
};

