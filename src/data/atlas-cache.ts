import { ATLAS_VERSION } from './platformMetadata';
import { readStorageString, writeStorageString, removeStorageKey } from '../utils/storageCache';

/**
 * Cache and Offline Storage manager for Africa Data Atlas.
 */

const CACHE_VERSION_KEY = 'AFRICA_DATA_ATLAS_VERSION';
const CACHE_TIMESTAMP_KEY = 'AFRICA_DATA_ATLAS_LAST_SYNC';
const CURRENT_VERSION = ATLAS_VERSION;

export interface CacheStatus {
  isCached: boolean;
  version: string;
  lastSync: string;
  isStale: boolean;
  storageType: 'Memory' | 'IndexedDB/LocalStorage' | 'ServiceWorker Cache';
}

export function getCacheStatus(): CacheStatus {
  const cachedVersion = readStorageString(CACHE_VERSION_KEY);
  const lastSync = readStorageString(CACHE_TIMESTAMP_KEY) || new Date().toISOString();
  const isCached = cachedVersion === CURRENT_VERSION;

  return {
    isCached,
    version: cachedVersion || CURRENT_VERSION,
    lastSync,
    isStale: !isCached,
    storageType: typeof window !== 'undefined' ? 'IndexedDB/LocalStorage' : 'Memory'
  };
}

export function refreshLocalCache(): boolean {
  const wroteVer = writeStorageString(CACHE_VERSION_KEY, CURRENT_VERSION);
  const wroteTs = writeStorageString(CACHE_TIMESTAMP_KEY, new Date().toISOString());
  return wroteVer && wroteTs;
}

export function clearAtlasCache(): void {
  removeStorageKey(CACHE_VERSION_KEY);
  removeStorageKey(CACHE_TIMESTAMP_KEY);
}
