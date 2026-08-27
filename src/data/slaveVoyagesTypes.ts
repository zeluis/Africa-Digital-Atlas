/**
 * Canonical Data Model & Types for the Atlantic Slave Trade Data Atlas
 * Based on SlaveVoyages (api.slavevoyages.org) methodology and schema.
 * 
 * Epistemic Mandate:
 * - Distinguishes between Observed data, Observed + Imputed (IMP), and Historical Estimates.
 * - Supports Trans-Atlantic and Intra-American trade databases.
 */

export type DatabaseType = 'transatlantic' | 'intra_american' | 'consolidated';

export type EpistemicMode = 'observed' | 'imputed' | 'estimates';

export type AfricanEmbarkationRegion = 
  | 'Senegambia'
  | 'Sierra Leone'
  | 'Windward Coast'
  | 'Gold Coast'
  | 'Bight of Benin'
  | 'Bight of Biafra'
  | 'West Central Africa'
  | 'Southeast Africa & Indian Ocean'
  | 'Other / Unknown Africa';

export type AmericanDisembarkationRegion = 
  | 'Brazil'
  | 'British Caribbean'
  | 'French Caribbean'
  | 'Spanish Americas'
  | 'Mainland North America (USA)'
  | 'Dutch Caribbean & Guianas'
  | 'Danish West Indies'
  | 'Europe / Atlantic Islands'
  | 'Sierra Leone / Africa (Intercepted)'
  | 'Other / Unknown Americas';

export type CarrierNationality = 
  | 'Portugal / Brazil'
  | 'Great Britain'
  | 'France'
  | 'Spain / Uruguay'
  | 'Netherlands'
  | 'United States'
  | 'Denmark / Baltic'
  | 'Other / Unspecified';

export interface GeoLocation {
  name: string;
  region: AfricanEmbarkationRegion | AmericanDisembarkationRegion | string;
  country: string;
  lat: number;
  lng: number;
  m49Code?: string;
  isPort?: boolean;
}

export interface VesselInfo {
  name: string;
  rig?: string;
  tonnage?: number;
  tonnageType?: string;
  constructionPlace?: string;
  constructionYear?: number;
  gunsMounted?: number;
  owner?: string;
  captain?: string;
}

export interface VoyageDates {
  departureYear: number;
  departureDate?: string;
  embarkationDate?: string;
  disembarkationDate?: string;
  returnDate?: string;
  durationDays?: number;
  middlePassageDays?: number;
}

export interface EnslavedCounts {
  embarkedObserved?: number;
  embarkedImputed: number;
  disembarkedObserved?: number;
  disembarkedImputed: number;
  mortalityObserved?: number;
  mortalityRateImputed: number; // percentage (e.g. 12.4%)
  maleRatio?: number;           // percentage (e.g. 62%)
  femaleRatio?: number;         // percentage
  childRatio?: number;          // percentage (e.g. 28%)
  adultRatio?: number;
  isImputed: boolean;
  imputedVariables: ('year' | 'carrier' | 'tonnage' | 'departure' | 'embarked' | 'disembarked' | 'mortality')[];
}

export interface VoyageResistance {
  hasRebellion: boolean;
  rebellionStage?: 'African Coast' | 'Middle Passage' | 'American Port';
  description?: string;
}

export interface VoyageOutcomes {
  fateOfCaptives: string;
  fateOfVessel: string;
  africanResistanceFlag: boolean;
  slaveTradeAbolitionPeriod: 'Pre-1808 Legal' | 'Post-1808 Illicit' | 'Suppression Era';
}

export interface VoyageProvenance {
  slaveVoyagesId: number;
  datasetVersion: string;
  sourceCitations: string[];
  sourceDocumentUrl?: string;
  archiveReference?: string;
  retrievedAt: string;
  epistemicStatus: 'Observed' | 'Imputed Values Included' | 'Interpolated';
}

export interface CanonicalVoyage {
  id: string;
  voyageNumber: number;
  database: DatabaseType;
  vessel: VesselInfo;
  dates: VoyageDates;
  carrier: {
    nationality: CarrierNationality;
    flag: string;
    flagIso2: string;
  };
  itinerary: {
    portOfDeparture?: GeoLocation;
    principalPlaceOfSlavePurchase: GeoLocation;
    principalPlaceOfSlaveLanding: GeoLocation;
    portOfArrival?: GeoLocation;
  };
  enslaved: EnslavedCounts;
  resistance: VoyageResistance;
  outcomes: VoyageOutcomes;
  provenance: VoyageProvenance;
}

export interface EnslavedPerson {
  id: string;
  africanOriginsId?: number;
  name: string;
  modernSpelling?: string;
  sex: 'Male' | 'Female' | 'Boy' | 'Girl' | 'Unknown';
  age?: number;
  statureInches?: number;
  statureCm?: number;
  linguisticGroup?: string;
  languageFamily?: string;
  countryOfOrigin?: string;
  vesselName: string;
  arrivalYear: number;
  embarkationPort: string;
  embarkationRegion: AfricanEmbarkationRegion;
  disembarkationPort: string;
  disembarkationRegion: AmericanDisembarkationRegion;
  registerName: string;
  courtLocation: string; // e.g. "Havana Mixed Commission", "Freetown Vice-Admiralty Court"
}

export interface EnslaverRecord {
  id: string;
  name: string;
  roles: ('Investor / Owner' | 'Captain / Master' | 'Consignee' | 'Financier')[];
  primaryNationality: CarrierNationality;
  activeYears: [number, number];
  voyagesCount: number;
  totalCaptivesHandled: number;
  principalPorts: string[];
  historicalNotes?: string;
  biographicalSource?: string;
}

export interface HistoricalEstimateAggregate {
  period: string;
  startYear: number;
  endYear: number;
  embarkationRegion: AfricanEmbarkationRegion;
  disembarkationRegion: AmericanDisembarkationRegion;
  carrier: CarrierNationality;
  observedEmbarked: number;
  imputedEmbarked: number;
  historicalEstimateEmbarkedLow: number;
  historicalEstimateEmbarkedMid: number;
  historicalEstimateEmbarkedHigh: number;
  imputedDisembarked: number;
  historicalEstimateDisembarkedMid: number;
  averageMortalityRate: number;
  certaintyConfidence: 'High' | 'Medium' | 'Low / Demographic Model';
}

export interface RegionalRouteFlow {
  id: string;
  sourceRegion: AfricanEmbarkationRegion;
  targetRegion: AmericanDisembarkationRegion;
  sourceCoords: [number, number]; // [lat, lng]
  targetCoords: [number, number];
  voyagesCount: number;
  embarkedCount: number;
  disembarkedCount: number;
  avgMortalityRate: number;
  primaryCarriers: { carrier: CarrierNationality; percentage: number }[];
  peakCentury: string;
}

export interface TimelineMilestone {
  year: number;
  title: string;
  category: 'Legislation & Abolition' | 'Resistance & Revolt' | 'Imperial Treaty' | 'Demographic Shift';
  description: string;
  impactOnTrade: string;
}

export interface VoyageFilterState {
  database: DatabaseType;
  epistemicMode: EpistemicMode;
  yearRange: [number, number];
  embarkationRegions: AfricanEmbarkationRegion[];
  disembarkationRegions: AmericanDisembarkationRegion[];
  carriers: CarrierNationality[];
  vesselSearch: string;
  minMortalityRate?: number;
  onlyResistanceRebellions: boolean;
  post1808IllicitOnly: boolean;
  sortBy: 'year' | 'embarked' | 'disembarked' | 'mortality' | 'vessel';
  sortOrder: 'asc' | 'desc';
}

export interface QueryCitationMeta {
  title: string;
  querySummary: string;
  dateRetrieved: string;
  dataSource: string;
  apiVersion: string;
  datasetSnapshot: string;
  filters: Partial<VoyageFilterState>;
  aggregateStats: {
    totalVoyages: number;
    embarked: number;
    disembarked: number;
    mortalityPct: number;
    epistemicMode: EpistemicMode;
  };
}
