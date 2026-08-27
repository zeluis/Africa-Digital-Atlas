/**
 * Africa Data Atlas v1.2 - Core TypeScript Definitions
 * Authoritative schema for entities, indicators, observations, facts,
 * classifications, heritage sites, provenance, media, and pipeline records.
 */

export type EntityType = 
  | 'country'
  | 'territory'
  | 'dependency'
  | 'disputed_territory'
  | 'special_territory'
  | 'administrative_region'
  | 'city'
  | 'site';

export type AfricanRegion = 
  | 'Northern Africa'
  | 'Western Africa'
  | 'Central Africa'
  | 'Eastern Africa'
  | 'Southern Africa';

export type UNRegionName = AfricanRegion;

export interface LiveCountryData {
  wb?: {
    pop?: number;
    gdp?: number;
    gdpPerCapita?: number;
    lifeExp?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

export type RegionalBloc = 
  | 'AU'        // African Union
  | 'ECOWAS'    // Economic Community of West African States
  | 'EAC'       // East African Community
  | 'SADC'      // Southern African Development Community
  | 'ECCAS'     // Economic Community of Central African States
  | 'AMU'       // Arab Maghreb Union
  | 'COMESA'    // Common Market for Eastern and Southern Africa
  | 'AfCFTA';   // African Continental Free Trade Area

export type IncomeLevel = 
  | 'High income'
  | 'Upper middle income'
  | 'Lower middle income'
  | 'Low income';

export type GeographicType = 
  | 'Coastal'
  | 'Landlocked'
  | 'Island';

export type ObservationStatus = 
  | 'observed'
  | 'estimated'
  | 'forecast'
  | 'derived'
  | 'imputed'
  | 'not_available'
  | 'not_covered'
  | 'suppressed'
  | 'disputed'
  | 'conflicting';

export type HeritageCategory = 'Cultural' | 'Natural' | 'Mixed';

export type IndicatorDomain = 
  | 'Economy' 
  | 'Demographics' 
  | 'Health' 
  | 'Education' 
  | 'Infrastructure' 
  | 'Climate' 
  | 'Governance' 
  | 'Culture'
  | 'Social'
  | 'Environmental'
  | 'Macroeconomic';

export type QualityFlagSeverity = 'info' | 'warning' | 'provisional' | 'conflict' | 'verified';

export interface QualityFlag {
  id: string;
  entityId: string;
  indicatorId?: string;
  severity: QualityFlagSeverity;
  category: string;
  description: string;
  sourceId?: string;
  resolution?: string;
}

export interface AtlasEntity {
  id: string; // ISO3 e.g., 'DZA', 'NGA', 'ZAF'
  iso2: string; // e.g., 'DZ', 'NG', 'ZA'
  name: string; // Short canonical e.g., 'Algeria'
  officialName: string; // Full official e.g., "People's Democratic Republic of Algeria"
  type: EntityType;
  sovereign: boolean;
  region: AfricanRegion;
  subregion?: string;
  capital: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  landAreaKm2: number;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  languages: {
    official: string[];
    national?: string[];
    mostSpoken?: string[];
  };
  governmentType: string;
  headOfState?: string;
  independenceDate?: string;
  independenceYear?: number;
  unMemberDate?: string;
  religions?: string[];
  landlocked: boolean;
  geographicType: GeographicType;
  incomeLevel: IncomeLevel;
  blocs: RegionalBloc[];
  facts: Record<string, any>;
  summary: string;
  borders?: string[];
  callingCode?: string;
  tld?: string;
  timeZone?: string;
}

export interface IndicatorDefinition {
  id: string; // e.g., 'NY.GDP.MKTP.CD', 'SP.POP.TOTL'
  name: string;
  label: string;
  domain: string;
  subdomain: string;
  definition: string;
  unit: string;
  unitType: string;
  frequency: string;
  preferredSource: string;
  sourceDataset: string;
  sourceCode: string;
  isDerived: boolean;
  derivedFormula?: string;
  dependencies?: string[];
  aggregationMethod: 'sum' | 'weighted_average' | 'unweighted_average' | 'median' | 'latest';
  higherIsBetter?: boolean;
}

export interface Observation {
  entityId: string;
  indicatorId: string;
  period: number; // Year e.g. 2024
  value: number | null;
  unit: string;
  sourceId: string;
  datasetId: string;
  status: ObservationStatus;
  notes?: string;
  retrievedDate?: string;
}

export interface SubnationalUnit {
  id: string;
  entityId: string;
  name: string;
  type: string; // Province, State, Region, Governorate, County
  capital?: string;
  population?: number;
  areaKm2?: number;
}

export interface HeritageSite {
  id: string;
  entityId: string;
  name: string;
  category: HeritageCategory;
  inscribedYear: number;
  criteria: string;
  endangered: boolean;
  description: string;
  location: string;
  unescoId: number;
  imageUrl?: string;
}

export interface DataSource {
  id: string;
  name: string;
  organization: string;
  url: string;
  reliabilityTier: 'Tier 1 (Authoritative/Multilateral)' | 'Tier 2 (Specialized Index)' | 'Tier 3 (Derived/Aggregated)';
  coverageSummary: string;
  lastSyncDate: string;
  datasets: string[];
  frequency?: string;
}

export interface MediaLinks {
  entityId: string;
  flagSvg: string;
  flagPng: string;
  flagEmoji: string;
  wikipediaUrl: string;
  wikidataId: string;
  wikidataUrl: string;
  wikimediaCommonsUrl?: string;
  openStreetMapUrl?: string;
  worldBankProfileUrl?: string;
  imfProfileUrl?: string;
  unProfileUrl?: string;
  africanUnionUrl?: string;
}

export interface AtlasManifest {
  atlasVersion: string;
  releaseDate: string;
  schemaVersion: string;
  totalEntities: number;
  sovereignEntities: number;
  totalIndicators: number;
  totalObservations: number;
  totalHeritageSites: number;
  supportedRegions: AfricanRegion[];
  lastIntegrityCheck: string;
  lastUpdated?: string;
}
