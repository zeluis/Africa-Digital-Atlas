/**
 * Cache and Offline Storage manager for Africa Data Atlas v1.2.
 */

const CACHE_VERSION_KEY = 'AFRICA_DATA_ATLAS_VERSION';
const CACHE_TIMESTAMP_KEY = 'AFRICA_DATA_ATLAS_LAST_SYNC';
const CURRENT_VERSION = '1.2.0';

export interface CacheStatus {
  isCached: boolean;
  version: string;
  lastSync: string;
  isStale: boolean;
  storageType: 'Memory' | 'IndexedDB/LocalStorage' | 'ServiceWorker Cache';
}

export function getCacheStatus(): CacheStatus {
  try {
    const cachedVersion = localStorage.getItem(CACHE_VERSION_KEY);
    const lastSync = localStorage.getItem(CACHE_TIMESTAMP_KEY) || new Date().toISOString();
    const isCached = cachedVersion === CURRENT_VERSION;

    return {
      isCached,
      version: cachedVersion || CURRENT_VERSION,
      lastSync,
      isStale: !isCached,
      storageType: 'IndexedDB/LocalStorage'
    };
  } catch (e) {
    return {
      isCached: true,
      version: CURRENT_VERSION,
      lastSync: new Date().toISOString(),
      isStale: false,
      storageType: 'Memory'
    };
  }
}

export function refreshLocalCache(): boolean {
  try {
    localStorage.setItem(CACHE_VERSION_KEY, CURRENT_VERSION);
    localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
    return true;
  } catch (e) {
    return false;
  }
}

export function clearAtlasCache(): void {
  try {
    localStorage.removeItem(CACHE_VERSION_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  } catch (e) {}
}
