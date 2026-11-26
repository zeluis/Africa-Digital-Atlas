import { AfricanRegion } from './types';
import { createLazyAssetStore } from '../utils/lazyDataLoader';

// ==========================================
// 1. AfCFTA INTRA-REGIONAL TRADE FLOWS
// ==========================================

export interface RegionalTradeCorridor {
  id: string;
  name: string;
  connectingNations: string[];
  distanceKm: number;
  tradeVolumeAnnualUSD: string;
  intraTradeShare: string;
  primaryGoods: string[];
  keyBorderPosts: {
    name: string;
    countries: [string, string];
    type: 'OSBP' | 'Standard' | 'Digital Multi-Agency';
    avgCrossingHours: number;
  }[];
  afcftaTariffStatus: string;
  strategicNote: string;
}

export interface RegionalTradeProfile {
  region: AfricanRegion;
  intraRegionalTradePct: number;
  leadingTradePartners: { partner: string; sharePct: number }[];
  corridors: RegionalTradeCorridor[];
  gtiStatus: string; // Guided Trade Initiative
  keyManufacturedGoods: string[];
  challenges: string[];
}

export const REGIONAL_TRADE_PROFILES: Record<AfricanRegion, RegionalTradeProfile> = {} as Record<AfricanRegion, RegionalTradeProfile>;

// ==========================================
// 2. HISTORICAL TRADE CORRIDORS & MARITIME ROUTES
// ==========================================

export interface HistoricalTradeRoute {
  id: string;
  name: string;
  era: string;
  regions: AfricanRegion[];
  nodalHubs: string[];
  exchangeCommodities: {
    exports: string[];
    imports: string[];
  };
  navigationTechnology: string;
  historicalSignificance: string;
}

export const HISTORICAL_REGIONAL_ROUTES: Record<AfricanRegion, HistoricalTradeRoute[]> = {} as Record<AfricanRegion, HistoricalTradeRoute[]>;

// ==========================================
// 3. CROSS-BORDER ECOLOGICAL INFRASTRUCTURE
// ==========================================

export interface TransboundaryEcology {
  id: string;
  name: string;
  type: 'Biosphere Reserve' | 'River Basin' | 'Transfrontier Conservation Area' | 'Continental Corridor';
  participatingCountries: string[];
  areaKm2: string;
  keystoneFloraFauna: string[];
  climateMitigationValue: string;
  governingTreaty: string;
  strategicSignificance: string;
}

export const REGIONAL_ECOLOGICAL_SYSTEMS: Record<AfricanRegion, TransboundaryEcology[]> = {} as Record<AfricanRegion, TransboundaryEcology[]>;

// ==========================================
// 4. REGIONAL POWER POOLS & RENEWABLE GRIDS
// ==========================================

export interface RegionalPowerPool {
  id: string;
  acronym: string;
  name: string;
  headquarters: string;
  establishedYear: number;
  participatingNations: number;
  totalInstalledCapacityMW: number;
  peakDemandMW: number;
  energyMix: {
    hydroPct: number;
    solarWindPct: number;
    thermalGasCoalPct: number;
    geothermalPct: number;
  };
  flagshipTransmissionProjects: {
    name: string;
    voltageKV: string;
    countries: string[];
    capacityMW: number;
    status: 'Operational' | 'Under Construction' | 'Financing';
  }[];
  strategicVision: string;
}

export const REGIONAL_POWER_POOLS: Record<AfricanRegion, RegionalPowerPool> = {} as Record<AfricanRegion, RegionalPowerPool>;

const regionalSpecializedAtlasUrl = new URL('./regionalSpecializedAtlas.json', import.meta.url).href;

const regionalSpecializedAtlasStore = createLazyAssetStore<{
  tradeProfiles: Record<AfricanRegion, RegionalTradeProfile>;
  historicRoutes: Record<AfricanRegion, HistoricalTradeRoute[]>;
  ecologicalSystems: Record<AfricanRegion, TransboundaryEcology[]>;
  powerPools: Record<AfricanRegion, RegionalPowerPool>;
}>(
  [regionalSpecializedAtlasUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      if (payload.tradeProfiles) Object.assign(REGIONAL_TRADE_PROFILES, payload.tradeProfiles);
      if (payload.historicRoutes) Object.assign(HISTORICAL_REGIONAL_ROUTES, payload.historicRoutes);
      if (payload.ecologicalSystems) Object.assign(REGIONAL_ECOLOGICAL_SYSTEMS, payload.ecologicalSystems);
      if (payload.powerPools) Object.assign(REGIONAL_POWER_POOLS, payload.powerPools);
    }
    return {
      tradeProfiles: REGIONAL_TRADE_PROFILES,
      historicRoutes: HISTORICAL_REGIONAL_ROUTES,
      ecologicalSystems: REGIONAL_ECOLOGICAL_SYSTEMS,
      powerPools: REGIONAL_POWER_POOLS,
    };
  },
  () => ({
    tradeProfiles: REGIONAL_TRADE_PROFILES,
    historicRoutes: HISTORICAL_REGIONAL_ROUTES,
    ecologicalSystems: REGIONAL_ECOLOGICAL_SYSTEMS,
    powerPools: REGIONAL_POWER_POOLS,
  })
);

export const ensureRegionalSpecializedAtlasLoaded = regionalSpecializedAtlasStore.ensureLoaded;
export const isRegionalSpecializedAtlasLoaded = regionalSpecializedAtlasStore.isLoaded;
export const subscribeRegionalSpecializedAtlas = regionalSpecializedAtlasStore.subscribe;
export const useRegionalSpecializedAtlasLoaded = regionalSpecializedAtlasStore.useLoaded;
