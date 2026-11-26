import { AfricanRegion } from './types';
import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface RegionalWikiDossier {
  region: AfricanRegion;
  m49Code: string;
  auRegion: string;
  wikipediaArticle: string;
  canonicalTitle: string;
  url: string;
  thumbnail: string;
  extract: string;
  summaryNarrative: string[];
  geography: {
    landAreaKm2: number;
    landAreaFormatted: string;
    majorRivers: string[];
    majorBiomes: string[];
    climateTypes: string[];
    ecologicalHighlights: string;
  };
  demographics: {
    estimatedPopulation: number;
    populationFormatted: string;
    urbanizationRate: string;
    medianAgeYears: number;
    lifeExpectancyAvg: number;
    demographicTrajectory: string;
  };
  economy: {
    combinedGdpBillions: number;
    gdpFormatted: string;
    gdpPerCapitaAvg: number;
    topCommodities: string[];
    keyEconomicSectors: string[];
    growthOutlook: string;
  };
  politics: {
    primaryRecs: {
      acronym: string;
      fullName: string;
      headquarters: string;
      treatyYear: number;
    }[];
    institutionalHubs: string[];
    governanceProfile: string;
  };
  languages: {
    majorPhyla: string[];
    vehicularLanguages: string[];
    indigenousScripts: string[];
    polyglotDescription: string;
  };
  tastAssociation: {
    embarkationZones: string[];
    estimatedCaptivesEmbarked: string;
    primaryHistoricPorts: string[];
    voyagesHistoricalNotes: string;
    diasporicDestinations: string[];
  };
}

const wikipediaRegionalAtlasUrl = new URL('./wikipediaRegionalAtlas.json', import.meta.url).href;

export const WIKIPEDIA_REGIONAL_ATLAS: Record<AfricanRegion, RegionalWikiDossier> = {} as Record<AfricanRegion, RegionalWikiDossier>;

const wikipediaRegionalAtlasStore = createLazyAssetStore<Record<AfricanRegion, RegionalWikiDossier>>(
  [wikipediaRegionalAtlasUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      Object.assign(WIKIPEDIA_REGIONAL_ATLAS, payload);
    }
    return WIKIPEDIA_REGIONAL_ATLAS;
  },
  () => WIKIPEDIA_REGIONAL_ATLAS
);

export const ensureWikipediaRegionalAtlasLoaded = wikipediaRegionalAtlasStore.ensureLoaded;
export const isWikipediaRegionalAtlasLoaded = wikipediaRegionalAtlasStore.isLoaded;
export const subscribeWikipediaRegionalAtlas = wikipediaRegionalAtlasStore.subscribe;
export const useWikipediaRegionalAtlasLoaded = wikipediaRegionalAtlasStore.useLoaded;
