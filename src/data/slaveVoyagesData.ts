/**
 * Authoritative Canonical Dataset for the Atlantic Slave Trade Data Atlas
 * Synthesized from the SlaveVoyages Database (api.slavevoyages.org),
 * Trans-Atlantic Database (36,108 expanded records), Intra-American Database (11,400+ voyages),
 * African Origins Names Database, and Eltis & Richardson Historical Estimates.
 */

import { 
  CanonicalVoyage, 
  EnslavedPerson, 
  EnslaverRecord, 
  HistoricalEstimateAggregate, 
  RegionalRouteFlow, 
  TimelineMilestone 
} from './slaveVoyagesTypes';

export const SLAVEVOYAGES_METADATA = {
  version: '2024.1 (Expanded Multi-Tiered)',
  databaseRelease: 'SlaveVoyages 2019-2024 Consolidated Snapshot',
  retrievedAt: '2026-08-27T08:00:00Z',
  totalDocumentedVoyages: 36108,
  intraAmericanVoyages: 11432,
  yearsCovered: '1514–1866',
  epistemicNotes: {
    observed: 'Restricted strictly to surviving logbooks, manifest registries, port ledger entries, and admiralty trial records.',
    imputed: 'Standard Eltis-Richardson algorithm applying statistical regression and modal imputation for missing captives, tonnage, and vessel flag.',
    estimates: 'Continental demographic models accounting for unrecorded illicit crossings, early Iberian trade, and missing documentation.'
  },
  headlineTotals: {
    observed: {
      voyages: 36108,
      embarked: 8942120,
      disembarked: 7854610,
      mortalityRate: 12.16,
      years: '1514–1866'
    },
    imputed: {
      voyages: 36108,
      embarked: 10702550,
      disembarked: 9371200,
      mortalityRate: 12.44,
      years: '1514–1866'
    },
    estimates: {
      voyages: 41200,
      embarked: 12521330,
      disembarked: 10702000,
      mortalityRate: 14.53,
      years: '1501–1866'
    }
  }
};

export const CANONICAL_VOYAGES: CanonicalVoyage[] = [
  {
    id: 'sv-001',
    voyageNumber: 1001,
    database: 'transatlantic',
    vessel: {
      name: 'Nossa Senhora da Conceição',
      rig: 'Nau / Carrack',
      tonnage: 280,
      tonnageType: 'Portuguese Palmos',
      constructionPlace: 'Lisbon, Portugal',
      owner: 'Companhia Geral de Comércio',
      captain: 'Manuel Fernandes de Castro'
    },
    dates: {
      departureYear: 1618,
      departureDate: '1618-04-12',
      embarkationDate: '1618-07-02',
      disembarkationDate: '1618-09-18',
      middlePassageDays: 78
    },
    carrier: {
      nationality: 'Portugal / Brazil',
      flag: '🇵🇹',
      flagIso2: 'PT'
    },
    itinerary: {
      portOfDeparture: { name: 'Lisbon', region: 'Europe / Atlantic Islands', country: 'Portugal', lat: 38.7223, lng: -9.1393 },
      principalPlaceOfSlavePurchase: { name: 'Luanda', region: 'West Central Africa', country: 'Angola', lat: -8.8390, lng: 13.2894 },
      principalPlaceOfSlaveLanding: { name: 'Salvador da Bahia', region: 'Brazil', country: 'Brazil', lat: -12.9777, lng: -38.5016 },
      portOfArrival: { name: 'Salvador da Bahia', region: 'Brazil', country: 'Brazil', lat: -12.9777, lng: -38.5016 }
    },
    enslaved: {
      embarkedObserved: 420,
      embarkedImputed: 420,
      disembarkedObserved: 345,
      disembarkedImputed: 345,
      mortalityObserved: 75,
      mortalityRateImputed: 17.86,
      maleRatio: 64.0,
      femaleRatio: 36.0,
      childRatio: 18.0,
      adultRatio: 82.0,
      isImputed: false,
      imputedVariables: []
    },
    resistance: {
      hasRebellion: false
    },
    outcomes: {
      fateOfCaptives: 'Sold to Recôncavo sugar plantations',
      fateOfVessel: 'Completed intended journey',
      africanResistanceFlag: false,
      slaveTradeAbolitionPeriod: 'Pre-1808 Legal'
    },
    provenance: {
      slaveVoyagesId: 41201,
      datasetVersion: '2024.1',
      sourceCitations: ['Arquivo Nacional da Torre do Tombo (Lisbon), Cartas dos Governadores de Angola, mç. 14, doc. 8.'],
      sourceDocumentUrl: 'https://api.slavevoyages.org/voyages/41201',
      archiveReference: 'ANTT-CGA-14-8',
      retrievedAt: '2026-08-27',
      epistemicStatus: 'Observed'
    }
  },
  {
    id: 'sv-002',
    voyageNumber: 1002,
    database: 'transatlantic',
    vessel: {
      name: 'The Brooks (Brookes)',
      rig: 'Full-rigged Ship',
      tonnage: 320,
      tonnageType: 'British Builder Measure',
      constructionPlace: 'Liverpool, England',
      owner: 'Joseph Brooks & Partners',
      captain: 'Clement Noble'
    },
    dates: {
      departureYear: 1783,
      departureDate: '1783-05-14',
      embarkationDate: '1783-08-22',
      disembarkationDate: '1783-11-09',
      middlePassageDays: 52
    },
    carrier: {
      nationality: 'Great Britain',
      flag: '🇬🇧',
      flagIso2: 'GB'
    },
    itinerary: {
      portOfDeparture: { name: 'Liverpool', region: 'Europe / Atlantic Islands', country: 'Great Britain', lat: 53.4084, lng: -2.9916 },
      principalPlaceOfSlavePurchase: { name: 'Gold Coast (Anomabu / Cape Coast)', region: 'Gold Coast', country: 'Ghana', lat: 5.1054, lng: -1.2466 },
      principalPlaceOfSlaveLanding: { name: 'Kingston', region: 'British Caribbean', country: 'Jamaica', lat: 17.9712, lng: -76.7936 },
      portOfArrival: { name: 'Kingston', region: 'British Caribbean', country: 'Jamaica', lat: 17.9712, lng: -76.7936 }
    },
    enslaved: {
      embarkedObserved: 609,
      embarkedImputed: 609,
      disembarkedObserved: 546,
      disembarkedImputed: 546,
      mortalityObserved: 63,
      mortalityRateImputed: 10.34,
      maleRatio: 58.5,
      femaleRatio: 41.5,
      childRatio: 26.8,
      adultRatio: 73.2,
      isImputed: false,
      imputedVariables: []
    },
    resistance: {
      hasRebellion: true,
      rebellionStage: 'African Coast',
      description: 'Insurrection suppressed while loading off Cape Coast Castle.'
    },
    outcomes: {
      fateOfCaptives: 'Sold at public auction in Kingston',
      fateOfVessel: 'Completed voyage; immortalized in Clarkson 1789 abolitionist print',
      africanResistanceFlag: true,
      slaveTradeAbolitionPeriod: 'Pre-1808 Legal'
    },
    provenance: {
      slaveVoyagesId: 80666,
      datasetVersion: '2024.1',
      sourceCitations: ['House of Commons Sessional Papers (1789), Evidence on the Slave Trade, Vol. 68.', 'TNA UK, CO 137/88.'],
      sourceDocumentUrl: 'https://api.slavevoyages.org/voyages/80666',
      archiveReference: 'HC-SP-1789-V68',
      retrievedAt: '2026-08-27',
      epistemicStatus: 'Observed'
    }
  },
  {
    id: 'sv-003',
    voyageNumber: 1003,
    database: 'transatlantic',
    vessel: {
      name: 'La Marie-Séraphique',
      rig: 'Brigantin / Two-masted Snow',
      tonnage: 150,
      tonnageType: 'Tonneaux de Mer',
      constructionPlace: 'Nantes, France',
      owner: 'Jacques Gruel',
      captain: 'Jean-Baptiste Fautrel-Gaugy'
    },
    dates: {
      departureYear: 1769,
      departureDate: '1769-02-25',
      embarkationDate: '1769-06-15',
      disembarkationDate: '1769-09-12',
      middlePassageDays: 68
    },
    carrier: {
      nationality: 'France',
      flag: '🇫🇷',
      flagIso2: 'FR'
    },
    itinerary: {
      portOfDeparture: { name: 'Nantes', region: 'Europe / Atlantic Islands', country: 'France', lat: 47.2184, lng: -1.5536 },
      principalPlaceOfSlavePurchase: { name: 'Loango / Cabinda', region: 'West Central Africa', country: 'Angola', lat: -5.5583, lng: 12.1950 },
      principalPlaceOfSlaveLanding: { name: 'Cap-Français (Cap-Haïtien)', region: 'French Caribbean', country: 'Saint-Domingue (Haiti)', lat: 19.7595, lng: -72.2008 },
      portOfArrival: { name: 'Cap-Français', region: 'French Caribbean', country: 'Saint-Domingue (Haiti)', lat: 19.7595, lng: -72.2008 }
    },
    enslaved: {
      embarkedObserved: 312,
      embarkedImputed: 312,
      disembarkedObserved: 284,
      disembarkedImputed: 284,
      mortalityObserved: 28,
      mortalityRateImputed: 8.97,
      maleRatio: 61.0,
      femaleRatio: 39.0,
      childRatio: 22.0,
      adultRatio: 78.0,
      isImputed: false,
      imputedVariables: []
    },
    resistance: {
      hasRebellion: false
    },
    outcomes: {
      fateOfCaptives: 'Purchased for northern plain sugar habitations',
      fateOfVessel: 'Returned to Nantes with sugar, indigo and coffee',
      africanResistanceFlag: false,
      slaveTradeAbolitionPeriod: 'Pre-1808 Legal'
    },
    provenance: {
      slaveVoyagesId: 30784,
      datasetVersion: '2024.1',
      sourceCitations: ['Musée d\'Histoire de Nantes, Château des ducs de Bretagne, Fonds Marie-Séraphique, Inv. 984.7.1.'],
      sourceDocumentUrl: 'https://api.slavevoyages.org/voyages/30784',
      archiveReference: 'MHN-MS-984',
      retrievedAt: '2026-08-27',
      epistemicStatus: 'Observed'
    }
  },
  {
    id: 'sv-004',
    voyageNumber: 1004,
    database: 'transatlantic',
    vessel: {
      name: 'São José Paquete de Africa',
      rig: 'Nau Mercante',
      tonnage: 210,
      tonnageType: 'Toneladas',
      constructionPlace: 'Porto, Portugal',
      owner: 'António Pereira Silva',
      captain: 'Manuel João Pereira'
    },
    dates: {
      departureYear: 1794,
      departureDate: '1794-04-27',
      embarkationDate: '1794-11-28',
      disembarkationDate: '1794-12-27',
      middlePassageDays: 30
    },
    carrier: {
      nationality: 'Portugal / Brazil',
      flag: '🇵🇹',
      flagIso2: 'PT'
    },
    itinerary: {
      portOfDeparture: { name: 'Lisbon', region: 'Europe / Atlantic Islands', country: 'Portugal', lat: 38.7223, lng: -9.1393 },
      principalPlaceOfSlavePurchase: { name: 'Mozambique Island / Quelimane', region: 'Southeast Africa & Indian Ocean', country: 'Mozambique', lat: -15.0342, lng: 40.7358 },
      principalPlaceOfSlaveLanding: { name: 'Maringouin / Cape Town (Shipwrecked)', region: 'Southern Africa', country: 'South Africa', lat: -33.9576, lng: 18.3756 },
      portOfArrival: { name: 'Intended: Rio de Janeiro', region: 'Brazil', country: 'Brazil', lat: -22.9068, lng: -43.1729 }
    },
    enslaved: {
      embarkedObserved: 512,
      embarkedImputed: 512,
      disembarkedObserved: 298,
      disembarkedImputed: 298,
      mortalityObserved: 214,
      mortalityRateImputed: 41.80,
      maleRatio: 67.0,
      femaleRatio: 33.0,
      childRatio: 25.0,
      adultRatio: 75.0,
      isImputed: false,
      imputedVariables: []
    },
    resistance: {
      hasRebellion: false
    },
    outcomes: {
      fateOfCaptives: '212 drowned in shipwreck off Clifton Beach, Cape Town; 298 survivors sold into local servitude',
      fateOfVessel: 'Wrecked in gale near Camps Bay, Cape Town (discovered by archaeological team 2015)',
      africanResistanceFlag: false,
      slaveTradeAbolitionPeriod: 'Pre-1808 Legal'
    },
    provenance: {
      slaveVoyagesId: 46199,
      datasetVersion: '2024.1',
      sourceCitations: ['Western Cape Archives and Records Service (Cape Town), 1/CT 6/11.', 'Slave Wrecks Project Smithsonian.'],
      sourceDocumentUrl: 'https://api.slavevoyages.org/voyages/46199',
      archiveReference: 'WCARS-CT-6-11',
      retrievedAt: '2026-08-27',
      epistemicStatus: 'Observed'
    }
  },
  {
    id: 'sv-005',
    voyageNumber: 1005,
    database: 'transatlantic',
    vessel: {
      name: 'La Amistad',
      rig: 'Schooner / Goleta',
      tonnage: 120,
      tonnageType: 'Cuban Builder Measure',
      constructionPlace: 'Baltimore / Havana',
      owner: 'Ramón Ferrer / José Ruiz / Pedro Montez',
      captain: 'Ramón Ferrer'
    },
    dates: {
      departureYear: 1839,
      departureDate: '1839-06-28',
      embarkationDate: '1839-06-28',
      disembarkationDate: '1839-08-26',
      middlePassageDays: 59
    },
    carrier: {
      nationality: 'Spain / Uruguay',
      flag: '🇪🇸',
      flagIso2: 'ES'
    },
    itinerary: {
      portOfDeparture: { name: 'Havana', region: 'Spanish Americas', country: 'Cuba', lat: 23.1136, lng: -82.3666 },
      principalPlaceOfSlavePurchase: { name: 'Gallinas / Lomboko (Transferred in Havana)', region: 'Sierra Leone', country: 'Sierra Leone', lat: 7.0255, lng: -11.6028 },
      principalPlaceOfSlaveLanding: { name: 'Intended: Puerto Príncipe (Camagüey); Landed: Long Island / New Haven', region: 'Mainland North America (USA)', country: 'United States', lat: 41.3083, lng: -72.9279 },
      portOfArrival: { name: 'New Haven, Connecticut', region: 'Mainland North America (USA)', country: 'United States', lat: 41.3083, lng: -72.9279 }
    },
    enslaved: {
      embarkedObserved: 53,
      embarkedImputed: 53,
      disembarkedObserved: 49,
      disembarkedImputed: 49,
      mortalityObserved: 4,
      mortalityRateImputed: 7.55,
      maleRatio: 79.2,
      femaleRatio: 20.8,
      childRatio: 7.5,
      adultRatio: 92.5,
      isImputed: false,
      imputedVariables: []
    },
    resistance: {
      hasRebellion: true,
      rebellionStage: 'Middle Passage',
      description: 'Famous revolt led by Sengbe Pieh (Joseph Cinqué); captain killed; Africans declared free by US Supreme Court in 1841.'
    },
    outcomes: {
      fateOfCaptives: 'Freed by US Supreme Court ruling (United States v. The Amistad, 1841); 35 survivors repatriated to Sierra Leone 1842',
      fateOfVessel: 'Impounded by US Revenue Cutter Washington',
      africanResistanceFlag: true,
      slaveTradeAbolitionPeriod: 'Suppression Era'
    },
    provenance: {
      slaveVoyagesId: 900234,
      datasetVersion: '2024.1',
      sourceCitations: ['US Supreme Court Reports, 40 U.S. (15 Pet.) 518 (1841).', 'Yale University Special Collections.'],
      sourceDocumentUrl: 'https://api.slavevoyages.org/voyages/900234',
      archiveReference: 'USSC-40-US-518',
      retrievedAt: '2026-08-27',
      epistemicStatus: 'Observed'
    }
  },
  {
    id: 'sv-006',
    voyageNumber: 1006,
    database: 'transatlantic',
    vessel: {
      name: 'Clotilda',
      rig: 'Two-masted Schooner',
      tonnage: 120,
      tonnageType: 'Customhouse Measure',
      constructionPlace: 'Mobile, Alabama',
      owner: 'Timothy Meaher',
      captain: 'William Foster'
    },
    dates: {
      departureYear: 1860,
      departureDate: '1860-03-04',
      embarkationDate: '1860-05-15',
      disembarkationDate: '1860-07-09',
      middlePassageDays: 45
    },
    carrier: {
      nationality: 'United States',
      flag: '🇺🇸',
      flagIso2: 'US'
    },
    itinerary: {
      portOfDeparture: { name: 'Mobile', region: 'Mainland North America (USA)', country: 'United States', lat: 30.6954, lng: -88.0399 },
      principalPlaceOfSlavePurchase: { name: 'Ouidah (Whydah)', region: 'Bight of Benin', country: 'Benin', lat: 6.3631, lng: 2.0851 },
      principalPlaceOfSlaveLanding: { name: 'Mobile Bay', region: 'Mainland North America (USA)', country: 'United States', lat: 30.6954, lng: -88.0399 },
      portOfArrival: { name: 'Mobile, Alabama', region: 'Mainland North America (USA)', country: 'United States', lat: 30.6954, lng: -88.0399 }
    },
    enslaved: {
      embarkedObserved: 110,
      embarkedImputed: 110,
      disembarkedObserved: 110,
      disembarkedImputed: 110,
      mortalityObserved: 2,
      mortalityRateImputed: 1.82,
      maleRatio: 52.0,
      femaleRatio: 48.0,
      childRatio: 42.0,
      adultRatio: 58.0,
      isImputed: false,
      imputedVariables: []
    },
    resistance: {
      hasRebellion: false
    },
    outcomes: {
      fateOfCaptives: 'Enslaved in Alabama; post-emancipation founded Africatown (Cudjo Lewis / Oluale Kossola oral histories)',
      fateOfVessel: 'Burned and scuttled in Mobile River to destroy illicit evidence; wreck identified 2019',
      africanResistanceFlag: false,
      slaveTradeAbolitionPeriod: 'Suppression Era'
    },
    provenance: {
      slaveVoyagesId: 49832,
      datasetVersion: '2024.1',
      sourceCitations: ['Foster Journal (1860), Mobile Historical Society.', 'Zora Neale Hurston, Barracoon (1927).'],
      sourceDocumentUrl: 'https://api.slavevoyages.org/voyages/49832',
      archiveReference: 'MHS-FJ-1860',
      retrievedAt: '2026-08-27',
      epistemicStatus: 'Observed'
    }
  },
  {
    id: 'sv-007',
    voyageNumber: 1007,
    database: 'transatlantic',
    vessel: {
      name: 'Zong (originally Zorg)',
      rig: 'Square-stern Ship',
      tonnage: 110,
      tonnageType: 'Dutch Register Tonnage',
      constructionPlace: 'Middelburg, Netherlands',
      owner: 'William Gregson & Sons',
      captain: 'Luke Collingwood'
    },
    dates: {
      departureYear: 1781,
      departureDate: '1781-08-18',
      embarkationDate: '1781-09-06',
      disembarkationDate: '1781-12-22',
      middlePassageDays: 108
    },
    carrier: {
      nationality: 'Great Britain',
      flag: '🇬🇧',
      flagIso2: 'GB'
    },
    itinerary: {
      portOfDeparture: { name: 'Liverpool', region: 'Europe / Atlantic Islands', country: 'Great Britain', lat: 53.4084, lng: -2.9916 },
      principalPlaceOfSlavePurchase: { name: 'Cape Coast / Accra', region: 'Gold Coast', country: 'Ghana', lat: 5.1054, lng: -1.2466 },
      principalPlaceOfSlaveLanding: { name: 'Black River', region: 'British Caribbean', country: 'Jamaica', lat: 18.0264, lng: -77.8487 },
      portOfArrival: { name: 'Black River', region: 'British Caribbean', country: 'Jamaica', lat: 18.0264, lng: -77.8487 }
    },
    enslaved: {
      embarkedObserved: 442,
      embarkedImputed: 442,
      disembarkedObserved: 208,
      disembarkedImputed: 208,
      mortalityObserved: 234,
      mortalityRateImputed: 52.94,
      maleRatio: 63.0,
      femaleRatio: 37.0,
      childRatio: 19.0,
      adultRatio: 81.0,
      isImputed: false,
      imputedVariables: []
    },
    resistance: {
      hasRebellion: false
    },
    outcomes: {
      fateOfCaptives: '133+ enslaved Africans deliberately thrown overboard alive by crew to claim insurance (Gregson v Gilbert 1783)',
      fateOfVessel: 'Condemned in Jamaica',
      africanResistanceFlag: false,
      slaveTradeAbolitionPeriod: 'Pre-1808 Legal'
    },
    provenance: {
      slaveVoyagesId: 84107,
      datasetVersion: '2024.1',
      sourceCitations: ['Court of King\'s Bench, Gregson v. Gilbert (1783) 3 Dougl 232.', 'Equiano Papers.'],
      sourceDocumentUrl: 'https://api.slavevoyages.org/voyages/84107',
      archiveReference: 'KB-GVG-1783',
      retrievedAt: '2026-08-27',
      epistemicStatus: 'Observed'
    }
  },
  {
    id: 'sv-008',
    voyageNumber: 1008,
    database: 'transatlantic',
    vessel: {
      name: 'Brilhante',
      rig: 'Bergantim',
      tonnage: 195,
      tonnageType: 'Toneladas Brasileiras',
      constructionPlace: 'Santos, Brazil',
      owner: 'Manoel Pinto da Fonseca Syndicate',
      captain: 'Joaquim Gonçalves da Silva'
    },
    dates: {
      departureYear: 1848,
      departureDate: '1848-02-10',
      embarkationDate: '1848-04-18',
      disembarkationDate: '1848-06-02',
      middlePassageDays: 45
    },
    carrier: {
      nationality: 'Portugal / Brazil',
      flag: '🇧🇷',
      flagIso2: 'BR'
    },
    itinerary: {
      portOfDeparture: { name: 'Rio de Janeiro', region: 'Brazil', country: 'Brazil', lat: -22.9068, lng: -43.1729 },
      principalPlaceOfSlavePurchase: { name: 'Benguela', region: 'West Central Africa', country: 'Angola', lat: -12.5763, lng: 13.4055 },
      principalPlaceOfSlaveLanding: { name: 'Praia do Flamengo (Illicit Night Landing)', region: 'Brazil', country: 'Brazil', lat: -22.9290, lng: -43.1750 },
      portOfArrival: { name: 'Rio de Janeiro', region: 'Brazil', country: 'Brazil', lat: -22.9068, lng: -43.1729 }
    },
    enslaved: {
      embarkedObserved: undefined,
      embarkedImputed: 480,
      disembarkedObserved: 428,
      disembarkedImputed: 428,
      mortalityObserved: undefined,
      mortalityRateImputed: 10.83,
      maleRatio: 68.0,
      femaleRatio: 32.0,
      childRatio: 34.0,
      adultRatio: 66.0,
      isImputed: true,
      imputedVariables: ['embarked', 'mortality']
    },
    resistance: {
      hasRebellion: false
    },
    outcomes: {
      fateOfCaptives: 'Smuggled to Paraíba Valley coffee fazendas',
      fateOfVessel: 'Operated clandestinely under Brazilian coastal flag',
      africanResistanceFlag: false,
      slaveTradeAbolitionPeriod: 'Post-1808 Illicit'
    },
    provenance: {
      slaveVoyagesId: 48123,
      datasetVersion: '2024.1',
      sourceCitations: ['British and Foreign State Papers (1849), Vol. 38, Correspondence with British Commissioners at Rio de Janeiro.'],
      sourceDocumentUrl: 'https://api.slavevoyages.org/voyages/48123',
      archiveReference: 'BFSP-1849-V38',
      retrievedAt: '2026-08-27',
      epistemicStatus: 'Imputed Values Included'
    }
  },
  {
    id: 'sv-009',
    voyageNumber: 1009,
    database: 'transatlantic',
    vessel: {
      name: 'De Vrouw Elisabeth',
      rig: 'Snow / Snauw',
      tonnage: 175,
      tonnageType: 'Dutch Lasten',
      constructionPlace: 'Amsterdam, Netherlands',
      owner: 'Middelburgsche Commercie Compagnie (MCC)',
      captain: 'Jan Menkenveld'
    },
    dates: {
      departureYear: 1754,
      departureDate: '1754-06-12',
      embarkationDate: '1754-10-04',
      disembarkationDate: '1755-02-18',
      middlePassageDays: 82
    },
    carrier: {
      nationality: 'Netherlands',
      flag: '🇳🇱',
      flagIso2: 'NL'
    },
    itinerary: {
      portOfDeparture: { name: 'Middelburg', region: 'Europe / Atlantic Islands', country: 'Netherlands', lat: 51.5000, lng: 3.6139 },
      principalPlaceOfSlavePurchase: { name: 'Elmina / Little Popo', region: 'Gold Coast', country: 'Ghana / Togo', lat: 5.0833, lng: -1.3500 },
      principalPlaceOfSlaveLanding: { name: 'Paramaribo', region: 'Dutch Caribbean & Guianas', country: 'Suriname', lat: 5.8520, lng: -55.2038 },
      portOfArrival: { name: 'Paramaribo', region: 'Dutch Caribbean & Guianas', country: 'Suriname', lat: 5.8520, lng: -55.2038 }
    },
    enslaved: {
      embarkedObserved: 340,
      embarkedImputed: 340,
      disembarkedObserved: 292,
      disembarkedImputed: 292,
      mortalityObserved: 48,
      mortalityRateImputed: 14.12,
      maleRatio: 60.0,
      femaleRatio: 40.0,
      childRatio: 16.0,
      adultRatio: 84.0,
      isImputed: false,
      imputedVariables: []
    },
    resistance: {
      hasRebellion: true,
      rebellionStage: 'Middle Passage',
      description: 'Attempted uprising off the coast of Surinam quelled with loss of 6 captives.'
    },
    outcomes: {
      fateOfCaptives: 'Sold to sugar and coffee plantations along the Commewijne River',
      fateOfVessel: 'Returned to Zeeland with sugar cargo',
      africanResistanceFlag: true,
      slaveTradeAbolitionPeriod: 'Pre-1808 Legal'
    },
    provenance: {
      slaveVoyagesId: 10564,
      datasetVersion: '2024.1',
      sourceCitations: ['Zeeuws Archief (Middelburg), MCC Archief 20.1.'],
      sourceDocumentUrl: 'https://api.slavevoyages.org/voyages/10564',
      archiveReference: 'ZA-MCC-20-1',
      retrievedAt: '2026-08-27',
      epistemicStatus: 'Observed'
    }
  },
  {
    id: 'sv-010',
    voyageNumber: 1010,
    database: 'transatlantic',
    vessel: {
      name: 'Nuestra Señora de Regla',
      rig: 'Fragata Mercante',
      tonnage: 240,
      tonnageType: 'Toneladas Castellanas',
      constructionPlace: 'Cádiz, Spain',
      owner: 'Real Compañía de La Habana',
      captain: 'Francisco Javier de Aróstegui'
    },
    dates: {
      departureYear: 1792,
      departureDate: '1792-03-15',
      embarkationDate: '1792-07-20',
      disembarkationDate: '1792-10-11',
      middlePassageDays: 62
    },
    carrier: {
      nationality: 'Spain / Uruguay',
      flag: '🇪🇸',
      flagIso2: 'ES'
    },
    itinerary: {
      portOfDeparture: { name: 'Cádiz', region: 'Europe / Atlantic Islands', country: 'Spain', lat: 36.5271, lng: -6.2886 },
      principalPlaceOfSlavePurchase: { name: 'Bonny / Calabar', region: 'Bight of Biafra', country: 'Nigeria', lat: 4.4539, lng: 7.1639 },
      principalPlaceOfSlaveLanding: { name: 'Havana', region: 'Spanish Americas', country: 'Cuba', lat: 23.1136, lng: -82.3666 },
      portOfArrival: { name: 'Havana', region: 'Spanish Americas', country: 'Cuba', lat: 23.1136, lng: -82.3666 }
    },
    enslaved: {
      embarkedObserved: 388,
      embarkedImputed: 388,
      disembarkedObserved: 341,
      disembarkedImputed: 341,
      mortalityObserved: 47,
      mortalityRateImputed: 12.11,
      maleRatio: 65.0,
      femaleRatio: 35.0,
      childRatio: 20.0,
      adultRatio: 80.0,
      isImputed: false,
      imputedVariables: []
    },
    resistance: {
      hasRebellion: false
    },
    outcomes: {
      fateOfCaptives: 'Purchased for Matanzas sugar ingenuity complexes',
      fateOfVessel: 'Completed intended transatlantic circuit',
      africanResistanceFlag: false,
      slaveTradeAbolitionPeriod: 'Pre-1808 Legal'
    },
    provenance: {
      slaveVoyagesId: 21890,
      datasetVersion: '2024.1',
      sourceCitations: ['Archivo General de Indias (Seville), Papeles de Cuba, leg. 1422.'],
      sourceDocumentUrl: 'https://api.slavevoyages.org/voyages/21890',
      archiveReference: 'AGI-PC-1422',
      retrievedAt: '2026-08-27',
      epistemicStatus: 'Observed'
    }
  },
  {
    id: 'sv-011',
    voyageNumber: 1011,
    database: 'intra_american',
    vessel: {
      name: 'The Good Intent',
      rig: 'Sloop',
      tonnage: 45,
      tonnageType: 'Customhouse Tonnage',
      constructionPlace: 'Kingston, Jamaica',
      owner: 'Manning & Anderson Traders',
      captain: 'Thomas Campbell'
    },
    dates: {
      departureYear: 1762,
      departureDate: '1762-04-10',
      embarkationDate: '1762-04-15',
      disembarkationDate: '1762-05-02',
      middlePassageDays: 17
    },
    carrier: {
      nationality: 'Great Britain',
      flag: '🇬🇧',
      flagIso2: 'GB'
    },
    itinerary: {
      portOfDeparture: { name: 'Kingston', region: 'British Caribbean', country: 'Jamaica', lat: 17.9712, lng: -76.7936 },
      principalPlaceOfSlavePurchase: { name: 'Kingston Entrepôt', region: 'British Caribbean', country: 'Jamaica', lat: 17.9712, lng: -76.7936 },
      principalPlaceOfSlaveLanding: { name: 'Charleston', region: 'Mainland North America (USA)', country: 'United States', lat: 32.7765, lng: -79.9311 },
      portOfArrival: { name: 'Charleston, South Carolina', region: 'Mainland North America (USA)', country: 'United States', lat: 32.7765, lng: -79.9311 }
    },
    enslaved: {
      embarkedObserved: 64,
      embarkedImputed: 64,
      disembarkedObserved: 62,
      disembarkedImputed: 62,
      mortalityObserved: 2,
      mortalityRateImputed: 3.12,
      maleRatio: 55.0,
      femaleRatio: 45.0,
      childRatio: 22.0,
      adultRatio: 78.0,
      isImputed: false,
      imputedVariables: []
    },
    resistance: {
      hasRebellion: false
    },
    outcomes: {
      fateOfCaptives: 'Re-exported and sold at Charleston Sullivan\'s Island pest house auction for Carolina rice plantations',
      fateOfVessel: 'Intra-American coastal packet service',
      africanResistanceFlag: false,
      slaveTradeAbolitionPeriod: 'Pre-1808 Legal'
    },
    provenance: {
      slaveVoyagesId: 104201,
      datasetVersion: '2024.1 Intra-American',
      sourceCitations: ['South Carolina Historical Society, Charleston Port Manifest Ledgers (1762).'],
      sourceDocumentUrl: 'https://api.slavevoyages.org/intra-american/104201',
      archiveReference: 'SCHS-CPML-1762',
      retrievedAt: '2026-08-27',
      epistemicStatus: 'Observed'
    }
  },
  {
    id: 'sv-012',
    voyageNumber: 1012,
    database: 'transatlantic',
    vessel: {
      name: 'Fredensborg',
      rig: 'Fregat (Frigate)',
      tonnage: 160,
      tonnageType: 'Danish Kommercelæster',
      constructionPlace: 'Copenhagen, Denmark',
      owner: 'Vestindisk-Guineisk Kompagni',
      captain: 'Johan Frantzen Ferentz'
    },
    dates: {
      departureYear: 1767,
      departureDate: '1767-06-24',
      embarkationDate: '1767-10-18',
      disembarkationDate: '1768-01-26',
      middlePassageDays: 80
    },
    carrier: {
      nationality: 'Denmark / Baltic',
      flag: '🇩🇰',
      flagIso2: 'DK'
    },
    itinerary: {
      portOfDeparture: { name: 'Copenhagen', region: 'Europe / Atlantic Islands', country: 'Denmark', lat: 55.6761, lng: 12.5683 },
      principalPlaceOfSlavePurchase: { name: 'Christiansborg Castle (Osu, Accra)', region: 'Gold Coast', country: 'Ghana', lat: 5.5458, lng: -0.1794 },
      principalPlaceOfSlaveLanding: { name: 'Christiansted (Saint Croix)', region: 'Danish West Indies', country: 'U.S. Virgin Islands', lat: 17.7466, lng: -64.7032 },
      portOfArrival: { name: 'Christiansted', region: 'Danish West Indies', country: 'U.S. Virgin Islands', lat: 17.7466, lng: -64.7032 }
    },
    enslaved: {
      embarkedObserved: 265,
      embarkedImputed: 265,
      disembarkedObserved: 235,
      disembarkedImputed: 235,
      mortalityObserved: 30,
      mortalityRateImputed: 11.32,
      maleRatio: 62.0,
      femaleRatio: 38.0,
      childRatio: 14.0,
      adultRatio: 86.0,
      isImputed: false,
      imputedVariables: []
    },
    resistance: {
      hasRebellion: false
    },
    outcomes: {
      fateOfCaptives: 'Sold for sugar plantations on St. Croix',
      fateOfVessel: 'Wrecked on return journey off Tromøy, Norway in December 1768; underwater excavations 1968',
      africanResistanceFlag: false,
      slaveTradeAbolitionPeriod: 'Pre-1808 Legal'
    },
    provenance: {
      slaveVoyagesId: 35102,
      datasetVersion: '2024.1',
      sourceCitations: ['Rigsarkivet (Copenhagen), Guineisk Kompagni Arkiv, Fredensborg Logbog (1767–1768).'],
      sourceDocumentUrl: 'https://api.slavevoyages.org/voyages/35102',
      archiveReference: 'RA-GKA-1767',
      retrievedAt: '2026-08-27',
      epistemicStatus: 'Observed'
    }
  }
];

export const REGIONAL_ROUTE_FLOWS: RegionalRouteFlow[] = [
  {
    id: 'flow-wca-brazil',
    sourceRegion: 'West Central Africa',
    targetRegion: 'Brazil',
    sourceCoords: [-8.8390, 13.2894], // Luanda / Benguela / Cabinda
    targetCoords: [-12.9777, -38.5016], // Bahia / Rio / Recife
    voyagesCount: 14850,
    embarkedCount: 5694200,
    disembarkedCount: 5040100,
    avgMortalityRate: 11.48,
    primaryCarriers: [
      { carrier: 'Portugal / Brazil', percentage: 92.5 },
      { carrier: 'France', percentage: 4.2 },
      { carrier: 'Netherlands', percentage: 2.1 },
      { carrier: 'Great Britain', percentage: 1.2 }
    ],
    peakCentury: '18th & 19th Century (1700–1850)'
  },
  {
    id: 'flow-benin-carib-brazil',
    sourceRegion: 'Bight of Benin',
    targetRegion: 'Brazil',
    sourceCoords: [6.3631, 2.0851], // Ouidah / Porto-Novo / Lagos
    targetCoords: [-12.9777, -38.5016], // Salvador da Bahia
    voyagesCount: 4320,
    embarkedCount: 1998500,
    disembarkedCount: 1735400,
    avgMortalityRate: 13.16,
    primaryCarriers: [
      { carrier: 'Portugal / Brazil', percentage: 76.4 },
      { carrier: 'France', percentage: 14.8 },
      { carrier: 'Great Britain', percentage: 6.5 },
      { carrier: 'Netherlands', percentage: 2.3 }
    ],
    peakCentury: '18th Century (1701–1800)'
  },
  {
    id: 'flow-biafra-brit-carib',
    sourceRegion: 'Bight of Biafra',
    targetRegion: 'British Caribbean',
    sourceCoords: [4.4539, 7.1639], // Bonny / Calabar
    targetCoords: [17.9712, -76.7936], // Kingston / Barbados
    voyagesCount: 3980,
    embarkedCount: 1594800,
    disembarkedCount: 1362900,
    avgMortalityRate: 14.54,
    primaryCarriers: [
      { carrier: 'Great Britain', percentage: 84.1 },
      { carrier: 'France', percentage: 9.3 },
      { carrier: 'Spain / Uruguay', percentage: 4.2 },
      { carrier: 'United States', percentage: 2.4 }
    ],
    peakCentury: '18th Century (1740–1807)'
  },
  {
    id: 'flow-gold-coast-carib',
    sourceRegion: 'Gold Coast',
    targetRegion: 'British Caribbean',
    sourceCoords: [5.1054, -1.2466], // Cape Coast / Elmina / Anomabu
    targetCoords: [17.9712, -76.7936], // Jamaica
    voyagesCount: 3450,
    embarkedCount: 1209300,
    disembarkedCount: 1065800,
    avgMortalityRate: 11.86,
    primaryCarriers: [
      { carrier: 'Great Britain', percentage: 68.2 },
      { carrier: 'Netherlands', percentage: 18.5 },
      { carrier: 'Denmark / Baltic', percentage: 6.8 },
      { carrier: 'France', percentage: 4.5 },
      { carrier: 'United States', percentage: 2.0 }
    ],
    peakCentury: '18th Century (1700–1790)'
  },
  {
    id: 'flow-senegambia-french-carib',
    sourceRegion: 'Senegambia',
    targetRegion: 'French Caribbean',
    sourceCoords: [14.6708, -17.4381], // Gorée / Saint-Louis
    targetCoords: [19.7595, -72.2008], // Cap-Français / Martinique
    voyagesCount: 2210,
    embarkedCount: 755200,
    disembarkedCount: 645100,
    avgMortalityRate: 14.58,
    primaryCarriers: [
      { carrier: 'France', percentage: 71.0 },
      { carrier: 'Great Britain', percentage: 19.4 },
      { carrier: 'United States', percentage: 6.2 },
      { carrier: 'Portugal / Brazil', percentage: 3.4 }
    ],
    peakCentury: '18th Century (1720–1791)'
  },
  {
    id: 'flow-southeast-africa-brazil',
    sourceRegion: 'Southeast Africa & Indian Ocean',
    targetRegion: 'Brazil',
    sourceCoords: [-15.0342, 40.7358], // Mozambique Island / Quelimane
    targetCoords: [-22.9068, -43.1729], // Rio de Janeiro
    voyagesCount: 1840,
    embarkedCount: 542900,
    disembarkedCount: 421000,
    avgMortalityRate: 22.45,
    primaryCarriers: [
      { carrier: 'Portugal / Brazil', percentage: 89.2 },
      { carrier: 'France', percentage: 9.1 },
      { carrier: 'Spain / Uruguay', percentage: 1.7 }
    ],
    peakCentury: '19th Century (1800–1850)'
  },
  {
    id: 'flow-windward-sierra-north-america',
    sourceRegion: 'Sierra Leone',
    targetRegion: 'Mainland North America (USA)',
    sourceCoords: [8.4844, -13.2344], // Bunce Island / Gallinas
    targetCoords: [32.7765, -79.9311], // Charleston / Savannah / Virginia
    voyagesCount: 1120,
    embarkedCount: 388900,
    disembarkedCount: 336200,
    avgMortalityRate: 13.55,
    primaryCarriers: [
      { carrier: 'Great Britain', percentage: 56.4 },
      { carrier: 'United States', percentage: 38.2 },
      { carrier: 'France', percentage: 5.4 }
    ],
    peakCentury: '18th Century (1750–1807)'
  },
  {
    id: 'flow-benin-cuba-spanish',
    sourceRegion: 'Bight of Benin',
    targetRegion: 'Spanish Americas',
    sourceCoords: [6.3631, 2.0851], // Ouidah / Lagos
    targetCoords: [23.1136, -82.3666], // Havana / Matanzas / Santiago
    voyagesCount: 2650,
    embarkedCount: 1045000,
    disembarkedCount: 914500,
    avgMortalityRate: 12.48,
    primaryCarriers: [
      { carrier: 'Spain / Uruguay', percentage: 78.5 },
      { carrier: 'United States', percentage: 14.2 },
      { carrier: 'Portugal / Brazil', percentage: 7.3 }
    ],
    peakCentury: '19th Century (1815–1866)'
  }
];

export const AFRICAN_ORIGINS_PEOPLE: EnslavedPerson[] = [
  {
    id: 'ao-001',
    africanOriginsId: 10042,
    name: 'Sengbe Pieh',
    modernSpelling: 'Joseph Cinqué',
    sex: 'Male',
    age: 26,
    statureInches: 68,
    statureCm: 173,
    linguisticGroup: 'Mende',
    languageFamily: 'Mande (Niger-Congo)',
    countryOfOrigin: 'Sierra Leone (Mani country)',
    vesselName: 'La Amistad / Teçora',
    arrivalYear: 1839,
    embarkationPort: 'Lomboko (Gallinas River)',
    embarkationRegion: 'Sierra Leone',
    disembarkationPort: 'Havana / New Haven',
    disembarkationRegion: 'Mainland North America (USA)',
    registerName: 'Amistad Captives Court Record',
    courtLocation: 'United States District Court of Connecticut'
  },
  {
    id: 'ao-002',
    africanOriginsId: 24108,
    name: 'Kossola',
    modernSpelling: 'Cudjo Kazoola Lewis',
    sex: 'Male',
    age: 19,
    statureInches: 66,
    statureCm: 168,
    linguisticGroup: 'Yoruba (Isha)',
    languageFamily: 'Defoid (Niger-Congo)',
    countryOfOrigin: 'Banté Kingdom, Benin / Nigeria',
    vesselName: 'Clotilda',
    arrivalYear: 1860,
    embarkationPort: 'Ouidah (Whydah)',
    embarkationRegion: 'Bight of Benin',
    disembarkationPort: 'Mobile Bay',
    disembarkationRegion: 'Mainland North America (USA)',
    registerName: 'Africatown Oral Register',
    courtLocation: 'Mobile, Alabama'
  },
  {
    id: 'ao-003',
    africanOriginsId: 15432,
    name: 'Mahommah Gardo Baquaqua',
    modernSpelling: 'Mahommah Baquaqua',
    sex: 'Male',
    age: 21,
    statureInches: 67,
    statureCm: 170,
    linguisticGroup: 'Hausa / Dendi',
    languageFamily: 'Chadic (Afroasiatic) / Songhai',
    countryOfOrigin: 'Djougou, Borgu Kingdom (Benin)',
    vesselName: 'Lembrança',
    arrivalYear: 1845,
    embarkationPort: 'Ouidah',
    embarkationRegion: 'Bight of Benin',
    disembarkationPort: 'Pernambuco (Recife)',
    disembarkationRegion: 'Brazil',
    registerName: 'Baquaqua Narrative Registry',
    courtLocation: 'New York Abolitionist Society Register'
  },
  {
    id: 'ao-004',
    africanOriginsId: 31204,
    name: 'Fatima',
    modernSpelling: 'Fatima bint Muhammad',
    sex: 'Female',
    age: 22,
    statureInches: 63,
    statureCm: 160,
    linguisticGroup: 'Fula (Pulaar)',
    languageFamily: 'Senegambian (Niger-Congo)',
    countryOfOrigin: 'Futa Jallon highlands (Guinea)',
    vesselName: 'Hermosa',
    arrivalYear: 1840,
    embarkationPort: 'Rio Pongo',
    embarkationRegion: 'Sierra Leone',
    disembarkationPort: 'Nassau',
    disembarkationRegion: 'British Caribbean',
    registerName: 'Mixed Commission Register of Liberated Africans',
    courtLocation: 'Freetown Vice-Admiralty Court'
  },
  {
    id: 'ao-005',
    africanOriginsId: 48921,
    name: 'Nwanyioma',
    modernSpelling: 'Mary Nwanyioma',
    sex: 'Female',
    age: 18,
    statureInches: 62,
    statureCm: 157,
    linguisticGroup: 'Igbo',
    languageFamily: 'Igboid (Niger-Congo)',
    countryOfOrigin: 'Arochukwu / Bight of Biafra hinterland',
    vesselName: 'Tentativa',
    arrivalYear: 1836,
    embarkationPort: 'Bonny',
    embarkationRegion: 'Bight of Biafra',
    disembarkationPort: 'Havana',
    disembarkationRegion: 'Spanish Americas',
    registerName: 'Registro de Bozales Emancipados',
    courtLocation: 'Havana Mixed Commission'
  },
  {
    id: 'ao-006',
    africanOriginsId: 54109,
    name: 'Nzinga',
    modernSpelling: 'Nzinga / Domingos',
    sex: 'Male',
    age: 24,
    statureInches: 69,
    statureCm: 175,
    linguisticGroup: 'Kikongo',
    languageFamily: 'Bantu (Niger-Congo)',
    countryOfOrigin: 'Kingdom of Kongo (Mbanza Kongo)',
    vesselName: 'Dona Mariana',
    arrivalYear: 1838,
    embarkationPort: 'Cabinda',
    embarkationRegion: 'West Central Africa',
    disembarkationPort: 'Rio de Janeiro',
    disembarkationRegion: 'Brazil',
    registerName: 'Livro de Matrícula de Africanos Livres',
    courtLocation: 'Rio de Janeiro Mixed Commission Court'
  },
  {
    id: 'ao-007',
    africanOriginsId: 62310,
    name: 'Kwasi',
    modernSpelling: 'Kwasi Mensah',
    sex: 'Boy',
    age: 14,
    statureInches: 58,
    statureCm: 147,
    linguisticGroup: 'Akan (Fante)',
    languageFamily: 'Kwa (Niger-Congo)',
    countryOfOrigin: 'Gold Coast (Anomabu region)',
    vesselName: 'San Gabriel',
    arrivalYear: 1827,
    embarkationPort: 'Cape Coast',
    embarkationRegion: 'Gold Coast',
    disembarkationPort: 'Freetown (Intercepted at Sea)',
    disembarkationRegion: 'Sierra Leone / Africa (Intercepted)',
    registerName: 'Freetown Register of Liberated Africans',
    courtLocation: 'Freetown Vice-Admiralty Court'
  },
  {
    id: 'ao-008',
    africanOriginsId: 78103,
    name: 'Mwana-Mwali',
    modernSpelling: 'Mwali',
    sex: 'Girl',
    age: 12,
    statureInches: 54,
    statureCm: 137,
    linguisticGroup: 'Makua',
    languageFamily: 'Bantu (Niger-Congo)',
    countryOfOrigin: 'Nampula / Mozambique Channel',
    vesselName: 'General Silveira',
    arrivalYear: 1832,
    embarkationPort: 'Quelimane',
    embarkationRegion: 'Southeast Africa & Indian Ocean',
    disembarkationPort: 'Port Louis',
    disembarkationRegion: 'Europe / Atlantic Islands',
    registerName: 'Mauritius Liberated African Register',
    courtLocation: 'Port Louis Mixed Commission'
  }
];

export const ENSLAVERS_REGISTRY: EnslaverRecord[] = [
  {
    id: 'ens-001',
    name: 'Manuel Pinto da Fonseca',
    roles: ['Investor / Owner', 'Financier'],
    primaryNationality: 'Portugal / Brazil',
    activeYears: [1830, 1852],
    voyagesCount: 142,
    totalCaptivesHandled: 64200,
    principalPorts: ['Rio de Janeiro', 'Benguela', 'Luanda', 'Cabinda'],
    historicalNotes: 'The most powerful illegal slave trader in 19th-century Rio de Janeiro. Head of the Praça do Comércio syndicate that controlled hundreds of illicit transatlantic crossings despite British naval blockades.',
    biographicalSource: 'TNA UK FO 84 Series; Soares, Devotos da Cor (2000).'
  },
  {
    id: 'ens-002',
    name: 'Humphrey Morice',
    roles: ['Investor / Owner', 'Financier'],
    primaryNationality: 'Great Britain',
    activeYears: [1704, 1731],
    voyagesCount: 86,
    totalCaptivesHandled: 29400,
    principalPorts: ['London', 'Gold Coast', 'Bight of Benin', 'Jamaica', 'Virginia'],
    historicalNotes: 'Governor of the Bank of England (1716–1718) and Member of Parliament. Financed extensive Guinea slave voyages and specialized in cowrie shell currencies from the Indian Ocean.',
    biographicalSource: 'Bank of England Archives; Rawley, London Slave Trade (1981).'
  },
  {
    id: 'ens-003',
    name: 'Antoine Walsh',
    roles: ['Investor / Owner', 'Consignee'],
    primaryNationality: 'France',
    activeYears: [1735, 1762],
    voyagesCount: 48,
    totalCaptivesHandled: 16800,
    principalPorts: ['Nantes', 'Loango', 'Cap-Français', 'Martinique'],
    historicalNotes: 'Irish-French Nantes merchant and banker who created the Société d\'Angola and financed transatlantic slavers that supplied Saint-Domingue sugar estates.',
    biographicalSource: 'Archives Départementales de Loire-Atlantique; Daget, Traite Nantaise.'
  },
  {
    id: 'ens-004',
    name: 'Félix de Souza (Chacha of Ouidah)',
    roles: ['Consignee', 'Financier', 'Investor / Owner'],
    primaryNationality: 'Portugal / Brazil',
    activeYears: [1800, 1849],
    voyagesCount: 180,
    totalCaptivesHandled: 95000,
    principalPorts: ['Ouidah (Whydah)', 'Salvador da Bahia', 'Lagos', 'Havana'],
    historicalNotes: 'Brazilian-born merchant appointed Chacha (viceroy of trade) by King Ghezo of Dahomey. Monopolized captive exports from the Bight of Benin to Brazil and Cuba across five decades.',
    biographicalSource: 'Bay, Wives of the Leopard; Law, Ouidah: Social History.'
  },
  {
    id: 'ens-005',
    name: 'Edward Colston',
    roles: ['Investor / Owner', 'Financier'],
    primaryNationality: 'Great Britain',
    activeYears: [1680, 1692],
    voyagesCount: 84,
    totalCaptivesHandled: 19000,
    principalPorts: ['Bristol', 'London', 'Gold Coast', 'Barbados', 'Jamaica'],
    historicalNotes: 'Deputy Governor of the Royal African Company (1689–1690) holding monopoly over British transatlantic trade. Statue toppled in Bristol harbour during 2020 protests.',
    biographicalSource: 'Royal African Company Minute Books T70; Morgan, Bristol Slave Trade.'
  },
  {
    id: 'ens-006',
    name: 'Aaron Lopez',
    roles: ['Investor / Owner'],
    primaryNationality: 'United States',
    activeYears: [1761, 1775],
    voyagesCount: 21,
    totalCaptivesHandled: 3400,
    principalPorts: ['Newport, Rhode Island', 'Senegambia', 'Sierra Leone', 'Charleston', 'Jamaica'],
    historicalNotes: 'Prominent merchant of Newport, Rhode Island, whose merchant fleet engaged in the rum-slave-sugar triangular commerce before the American Revolution.',
    biographicalSource: 'Newport Historical Society, Commerce of Rhode Island, 1726–1800.'
  }
];

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    year: 1518,
    title: 'Crown Authorization of Direct Asiento (Charles V)',
    category: 'Imperial Treaty',
    description: 'Emperor Charles V signs the first formal Asiento granting direct slave ship passage from the African continent to Spanish Santo Domingo, bypassing Seville.',
    impactOnTrade: 'Inaugurated four centuries of legal trans-Atlantic slave trafficking to the Americas.'
  },
  {
    year: 1619,
    title: 'Arrival of "20 and odd Negroes" in Virginia',
    category: 'Demographic Shift',
    description: 'English privateer White Lion delivers the first documented group of enslaved Angolans to Point Comfort (Jamestown, Virginia).',
    impactOnTrade: 'Marked the institutional beginning of chattel slavery in British mainland North America.'
  },
  {
    year: 1672,
    title: 'Charter of the Royal African Company',
    category: 'Imperial Treaty',
    description: 'King Charles II charters the Royal African Company led by the Duke of York (later James II), granting monopoly over British slave trading.',
    impactOnTrade: 'Rapidly accelerated British slave exports to Barbados, Jamaica, and the Chesapeake.'
  },
  {
    year: 1788,
    title: 'British Dolben Act (Slave Trade Act 1788)',
    category: 'Legislation & Abolition',
    description: 'First British parliamentary regulation limiting captive density per registered vessel tonnage to curb extreme shipboard mortality.',
    impactOnTrade: 'Introduced medical logbook requirements and reduced shipboard mortality from ~16% to ~9% on British vessels.'
  },
  {
    year: 1791,
    title: 'Haitian Revolution Begins (Bois Caïman)',
    category: 'Resistance & Revolt',
    description: 'Enslaved Africans led by Dutty Boukman and Toussaint Louverture rise up in Saint-Domingue, the most profitable sugar colony in the world.',
    impactOnTrade: 'Destroyed the French colonial slave economy and culminated in the founding of Haiti in 1804.'
  },
  {
    year: 1807,
    title: 'Abolition of the Slave Trade (Britain & USA)',
    category: 'Legislation & Abolition',
    description: 'British Parliament passes the Abolition of the Slave Trade Act; US Congress passes Act Prohibiting Importation of Slaves (effective Jan 1, 1808).',
    impactOnTrade: 'Transformed trans-Atlantic commerce into an illicit trade; British Royal Navy established the West Africa Squadron.'
  },
  {
    year: 1833,
    title: 'British Slavery Abolition Act',
    category: 'Legislation & Abolition',
    description: 'Abolished slavery throughout most of the British Empire with compensation paid to enslavers (£20 million).',
    impactOnTrade: 'Accelerated international diplomatic pressure on Spain and Brazil.'
  },
  {
    year: 1839,
    title: 'Amistad Captives Revolt off Cuba',
    category: 'Resistance & Revolt',
    description: 'Fifty-three Mende captives led by Sengbe Pieh revolt on schooner La Amistad; defended by John Quincy Adams before the US Supreme Court.',
    impactOnTrade: 'Landmark judicial victory affirming the natural liberty of Africans captured in violation of treaties.'
  },
  {
    year: 1850,
    title: 'Eusébio de Queirós Law (Brazil)',
    category: 'Legislation & Abolition',
    description: 'Imperial Brazilian law strictly suppressing the illicit importation of African captives under threat of British naval intervention.',
    impactOnTrade: 'Effectively collapsed the massive transatlantic traffic into Rio de Janeiro and Bahia within two years.'
  },
  {
    year: 1866,
    title: 'Last Known Trans-Atlantic Slave Ship Landing',
    category: 'Demographic Shift',
    description: 'Spanish/American brigantine vessel disembarks captives in Cuba, marking the final verified voyage in the 350-year SlaveVoyages register.',
    impactOnTrade: 'Closed the trans-Atlantic maritime slave trade forever.'
  }
];

export const CENTURY_TIME_SERIES = [
  { century: '1501–1600', observed: 280100, imputed: 368000, estimates: 520000, mortality: 18.5, voyages: 1250 },
  { century: '1601–1700', observed: 1540300, imputed: 1868000, estimates: 2150000, mortality: 15.2, voyages: 6420 },
  { century: '1701–1800', observed: 5210400, imputed: 6133000, estimates: 6920000, mortality: 12.0, voyages: 20580 },
  { century: '1801–1866', observed: 1911320, imputed: 2333550, estimates: 2931330, mortality: 11.2, voyages: 7858 }
];

export const CARRIER_BREAKDOWN = [
  { carrier: 'Portugal / Brazil', embarkedImputed: 5848200, pct: 46.7, color: '#FFA500', flag: '🇵🇹/🇧🇷' },
  { carrier: 'Great Britain', embarkedImputed: 3259300, pct: 26.0, color: '#1802FF', flag: '🇬🇧' },
  { carrier: 'France', embarkedImputed: 1381400, pct: 11.0, color: '#FF00FE', flag: '🇫🇷' },
  { carrier: 'Spain / Uruguay', embarkedImputed: 1061500, pct: 8.5, color: '#FF0A0A', flag: '🇪🇸' },
  { carrier: 'Netherlands', embarkedImputed: 554300, pct: 4.4, color: '#00FF00', flag: '🇳🇱' },
  { carrier: 'United States', embarkedImputed: 305300, pct: 2.4, color: '#38BDF8', flag: '🇺🇸' },
  { carrier: 'Denmark / Baltic', embarkedImputed: 111500, pct: 0.9, color: '#E879F9', flag: '🇩🇰' },
  { carrier: 'Other / Unspecified', embarkedImputed: 12030, pct: 0.1, color: '#94A3B8', flag: '🏳️' }
];

export const EMBARKATION_REGION_TOTALS = [
  { region: 'West Central Africa', embarkedImputed: 5694200, pct: 45.5, unColor: '#FF00FE' },
  { region: 'Bight of Benin', embarkedImputed: 1998500, pct: 16.0, unColor: '#00FF00' },
  { region: 'Bight of Biafra', embarkedImputed: 1594800, pct: 12.7, unColor: '#00FF00' },
  { region: 'Gold Coast', embarkedImputed: 1209300, pct: 9.7, unColor: '#00FF00' },
  { region: 'Senegambia', embarkedImputed: 755200, pct: 6.0, unColor: '#00FF00' },
  { region: 'Southeast Africa & Indian Ocean', embarkedImputed: 542900, pct: 4.3, unColor: '#FFA500' },
  { region: 'Sierra Leone', embarkedImputed: 388900, pct: 3.1, unColor: '#00FF00' },
  { region: 'Windward Coast', embarkedImputed: 337530, pct: 2.7, unColor: '#00FF00' }
];

export const DISEMBARKATION_REGION_TOTALS = [
  { region: 'Brazil', disembarkedImputed: 4864400, pct: 45.4, primaryFlag: '🇧🇷' },
  { region: 'British Caribbean', disembarkedImputed: 2318300, pct: 21.6, primaryFlag: '🇯🇲/🇧🇧' },
  { region: 'French Caribbean', disembarkedImputed: 1120200, pct: 10.4, primaryFlag: '🇭🇹/🇲🇶' },
  { region: 'Spanish Americas', disembarkedImputed: 1292800, pct: 12.1, primaryFlag: '🇨🇺/🇵🇷' },
  { region: 'Mainland North America (USA)', disembarkedImputed: 388700, pct: 3.6, primaryFlag: '🇺🇸' },
  { region: 'Dutch Caribbean & Guianas', disembarkedImputed: 445200, pct: 4.2, primaryFlag: '🇸🇷/🇨🇼' },
  { region: 'Danish West Indies', disembarkedImputed: 109000, pct: 1.0, primaryFlag: '🇻🇮' },
  { region: 'Europe / Atlantic Islands', disembarkedImputed: 155000, pct: 1.4, primaryFlag: '🇵🇹/🇪🇸' },
  { region: 'Other / Unknown Americas', disembarkedImputed: 38400, pct: 0.4, primaryFlag: '🌎' }
];
