/**
 * akpRegistry241.ts - European Commission Africa Knowledge Platform (JRC AKP)
 * Curated 241 Datasets Master Registry
 * Sourced from EC JRC, BIOPAMA, Copernicus, Eurostat, World Bank, WHO, UNESCO, FAO, UNEP, ACLED, ITU & AfDB.
 */
import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface AkpDatasetRecord {
  id: string;
  code: string;
  title: string;
  pillar: 'demographics' | 'energy_infra' | 'environment' | 'agriculture' | 'economic';
  subDomain: string;
  leadAgency: string;
  updateFrequency: 'Annual' | 'Quarterly' | 'Monthly' | 'Near Real-Time' | 'Decennial';
  unit: string;
  spatialResolution: 'Country' | 'Admin-1' | 'Grid (1km)' | 'Grid (10km)' | 'Point / Facility';
  coverage: string;
  description: string;
  tags: string[];
  choroplethMetricId?: string;
  downloadFormats: string[];
}

export interface AkpPillarMeta {
  id: string;
  label: string;
  shortLabel: string;
  subtext: string;
  count: number;
  color: string;
  icon: string;
}

const akpRegistry241Url = new URL('./akpRegistry241.json', import.meta.url).href;

export const AKP_PILLARS_META: AkpPillarMeta[] = [];
export const AKP_REGISTRY_241_DATASETS: AkpDatasetRecord[] = [];

const akpRegistry241Store = createLazyAssetStore<{
  pillarsMeta: AkpPillarMeta[];
  datasets: AkpDatasetRecord[];
}>(
  [akpRegistry241Url],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      if (Array.isArray(payload.pillarsMeta) && AKP_PILLARS_META.length === 0) {
        AKP_PILLARS_META.push(...payload.pillarsMeta);
      }
      if (Array.isArray(payload.datasets) && AKP_REGISTRY_241_DATASETS.length === 0) {
        AKP_REGISTRY_241_DATASETS.push(...payload.datasets);
      }
    }
    return {
      pillarsMeta: AKP_PILLARS_META,
      datasets: AKP_REGISTRY_241_DATASETS,
    };
  },
  () => ({
    pillarsMeta: AKP_PILLARS_META,
    datasets: AKP_REGISTRY_241_DATASETS,
  })
);

export const ensureAkpRegistry241Loaded = akpRegistry241Store.ensureLoaded;
export const isAkpRegistry241Loaded = akpRegistry241Store.isLoaded;
export const subscribeAkpRegistry241 = akpRegistry241Store.subscribe;
export const useAkpRegistry241Loaded = akpRegistry241Store.useLoaded;
