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
  }
];
