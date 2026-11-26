import { AfricanRegion } from './types';
import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface EthnicNode {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: AfricanRegion;
  percentage: number; // Calibrated representation / demographic share %
  branchAngle: number; // Polar angle in degrees (0 - 360)
  radialDistance: number; // Distance from center (0 to 1 normalized)
  cluster: 'west-central' | 'bight-coastal' | 'creole-sudanic' | 'perimeter';
  color: string;
  tastContext: string;
  historicalEmbarkation: string;
  wikipediaSlug: string;
  reportReferenceId?: string;
  linguisticFamily: string;
  estimatedDemographicPopulation?: string;
}

export interface CountryBranch {
  name: string;
  countryCode: string;
  region: AfricanRegion;
  color: string;
  startAngle: number;
  endAngle: number;
  meanAngle: number;
  tastVolumeShare: number; // Estimated % share in slave trade database
  totalNodes: number;
  keyPorts: string[];
}

export interface CoreClusterNode {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  percentage: number;
  color: string;
  clusterGroup: 1 | 2 | 3;
  description: string;
}

const ethnicTreeDataUrl = new URL('./ethnicTreeData.json', import.meta.url).href;

export const COUNTRY_BRANCHES: Record<string, CountryBranch> = {};
export const CORE_CLUSTERS: CoreClusterNode[] = [];
export const ETHNIC_NODES: EthnicNode[] = [];

export let TOTAL_AFRICAN_ETHNICITIES_INDEXED = 0;
export let TOTAL_COUNTRIES_INDEXED = 0;

const ethnicTreeDataStore = createLazyAssetStore<{
  countryBranches: Record<string, CountryBranch>;
  coreClusters: CoreClusterNode[];
  ethnicNodes: EthnicNode[];
}>(
  [ethnicTreeDataUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      if (payload.countryBranches && typeof payload.countryBranches === 'object') {
        Object.assign(COUNTRY_BRANCHES, payload.countryBranches);
        TOTAL_COUNTRIES_INDEXED = Object.keys(COUNTRY_BRANCHES).length;
      }
      if (Array.isArray(payload.coreClusters) && CORE_CLUSTERS.length === 0) {
        CORE_CLUSTERS.push(...payload.coreClusters);
      }
      if (Array.isArray(payload.ethnicNodes) && ETHNIC_NODES.length === 0) {
        ETHNIC_NODES.push(...payload.ethnicNodes);
        TOTAL_AFRICAN_ETHNICITIES_INDEXED = ETHNIC_NODES.length;
      }
    }
    return {
      countryBranches: COUNTRY_BRANCHES,
      coreClusters: CORE_CLUSTERS,
      ethnicNodes: ETHNIC_NODES,
    };
  },
  () => ({
    countryBranches: COUNTRY_BRANCHES,
    coreClusters: CORE_CLUSTERS,
    ethnicNodes: ETHNIC_NODES,
  })
);

export const ensureEthnicTreeDataLoaded = ethnicTreeDataStore.ensureLoaded;
export const isEthnicTreeDataLoaded = ethnicTreeDataStore.isLoaded;
export const subscribeEthnicTreeData = ethnicTreeDataStore.subscribe;
export const useEthnicTreeDataLoaded = ethnicTreeDataStore.useLoaded;
