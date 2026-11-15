import { EntityBlocId } from './entityBlocs';
import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface BlocWikiDossier {
  blocId: EntityBlocId;
  canonicalTitle: string;
  url: string;
  extract: string;
  summaryNarrative: string[];
  headquartersCity: string;
  establishedDate: string;
  foundingTreaty: string;
  officialWorkingLanguages: string[];
  indicators: {
    customsUnionStatus: string;
    tradeIntegrationScore: string;
    intraBlocTradeShare: string;
    monetaryFramework: string;
    keyEconomicPillars: string[];
  };
  demographics: {
    estimatedPopulation: string;
    urbanizationRate: string;
    medianAge: string;
    majorEthnolinguisticPhyla: string[];
  };
  geography: {
    landAreaKm2Formatted: string;
    majorWaterways: string[];
    dominantBiomes: string[];
    climateZones: string[];
  };
  landmarksEcology: {
    transboundaryReserves: string[];
    unescoBiospheres: string[];
    notableLandmarks: string[];
    ecologicalThreats: string[];
  };
  institutionsTreaties: {
    executiveOrgans: string[];
    parliamentaryOrJudicialBodies: string[];
    financialInstitutions: string[];
    landmarkAgreements: string[];
  };
}

const wikipediaBlocAtlasUrl = new URL('./wikipediaBlocAtlas.json', import.meta.url).href;

export const WIKIPEDIA_BLOC_DOSSIERS = {} as Record<EntityBlocId, BlocWikiDossier>;

const wikipediaBlocAtlasStore = createLazyAssetStore<Record<EntityBlocId, BlocWikiDossier>>(
  [wikipediaBlocAtlasUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      Object.assign(WIKIPEDIA_BLOC_DOSSIERS, payload);
    }
    return WIKIPEDIA_BLOC_DOSSIERS;
  },
  () => WIKIPEDIA_BLOC_DOSSIERS
);

export const ensureWikipediaBlocAtlasLoaded = wikipediaBlocAtlasStore.ensureLoaded;
export const isWikipediaBlocAtlasLoaded = wikipediaBlocAtlasStore.isLoaded;
export const subscribeWikipediaBlocAtlas = wikipediaBlocAtlasStore.subscribe;
export const useWikipediaBlocAtlasLoaded = wikipediaBlocAtlasStore.useLoaded;
