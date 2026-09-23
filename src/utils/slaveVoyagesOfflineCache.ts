/**
 * SlaveVoyages 2-Tier Offline Storage & Cache Engine
 * Tier 1: Authoritative Bundled In-Memory Core (zero network dependency)
 * Tier 2: IndexedDB Local Database (persistent cache for queried voyages & custom filters)
 */

import { CanonicalVoyage } from '../data/slaveVoyagesTypes';
import { CANONICAL_VOYAGES } from '../data/slaveVoyagesData';

const DB_NAME = 'africa_atlas_slavevoyages';
const DB_VERSION = 1;
const STORE_NAME = 'voyages_cache';
const META_STORE = 'metadata_cache';

export interface CacheTelemetry {
  tier1BundledCount: number;
  tier2CachedCount: number;
  totalAvailable: number;
  storageBackend: 'IndexedDB' | 'LocalStorage Fallback' | 'Memory Only';
  isOfflineReady: boolean;
  lastSynchronized: string | null;
}

// Helper to open IndexedDB with graceful error handling
function openDatabase(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('SlaveVoyages: IndexedDB open failed, using Tier 1 memory storage');
        resolve(null);
      };
    } catch (e) {
      console.warn('SlaveVoyages: IndexedDB not accessible', e);
      resolve(null);
    }
  });
}

/**
 * Initialize Tier 2 storage by priming with Tier 1 bundled records if not yet populated.
 */
export async function initializeOfflineVoyagesStore(): Promise<void> {
  const db = await openDatabase();
  if (!db) return;

  try {
    const tx = db.transaction([STORE_NAME, META_STORE], 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const meta = tx.objectStore(META_STORE);

    // Save initial metadata
    meta.put({
      key: 'sync_info',
      lastSynchronized: new Date().toISOString(),
      bundledVersion: '2024.1-canonical'
    });

    // Seed bundled voyages into IndexedDB
    for (const v of CANONICAL_VOYAGES) {
      store.put(v);
    }
  } catch (err) {
    console.warn('SlaveVoyages: Could not prime IndexedDB', err);
  }
}

/**
 * Retrieve all voyages across Tier 1 and Tier 2.
 */
export async function getAllOfflineVoyages(): Promise<CanonicalVoyage[]> {
  const db = await openDatabase();
  if (!db) {
    return CANONICAL_VOYAGES;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const records = req.result as CanonicalVoyage[];
        if (records && records.length >= CANONICAL_VOYAGES.length) {
          resolve(records);
        } else {
          // Merge bundled with any cached records
          const map = new Map<string, CanonicalVoyage>();
          for (const v of CANONICAL_VOYAGES) map.set(v.id, v);
          for (const v of records || []) map.set(v.id, v);
          resolve(Array.from(map.values()));
        }
      };

      req.onerror = () => resolve(CANONICAL_VOYAGES);
    } catch {
      resolve(CANONICAL_VOYAGES);
    }
  });
}

/**
 * Cache new voyages retrieved from network or proxy.
 */
export async function cacheVoyages(voyages: CanonicalVoyage[]): Promise<void> {
  const db = await openDatabase();
  if (!db) return;

  try {
    const tx = db.transaction([STORE_NAME, META_STORE], 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const meta = tx.objectStore(META_STORE);

    for (const v of voyages) {
      store.put(v);
    }

    meta.put({
      key: 'sync_info',
      lastSynchronized: new Date().toISOString()
    });
  } catch (err) {
    console.warn('SlaveVoyages: Failed to cache voyages in IndexedDB', err);
  }
}

/**
 * Get offline cache telemetry and health status.
 */
export async function getCacheTelemetry(): Promise<CacheTelemetry> {
  const db = await openDatabase();
  if (!db) {
    return {
      tier1BundledCount: CANONICAL_VOYAGES.length,
      tier2CachedCount: 0,
      totalAvailable: CANONICAL_VOYAGES.length,
      storageBackend: 'Memory Only',
      isOfflineReady: true,
      lastSynchronized: null
    };
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction([STORE_NAME, META_STORE], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const meta = tx.objectStore(META_STORE);

      const countReq = store.count();
      const metaReq = meta.get('sync_info');

      tx.oncomplete = () => {
        const count = countReq.result || 0;
        const syncData = metaReq.result;

        resolve({
          tier1BundledCount: CANONICAL_VOYAGES.length,
          tier2CachedCount: count,
          totalAvailable: Math.max(CANONICAL_VOYAGES.length, count),
          storageBackend: 'IndexedDB',
          isOfflineReady: true,
          lastSynchronized: syncData?.lastSynchronized || null
        });
      };

      tx.onerror = () => {
        resolve({
          tier1BundledCount: CANONICAL_VOYAGES.length,
          tier2CachedCount: 0,
          totalAvailable: CANONICAL_VOYAGES.length,
          storageBackend: 'IndexedDB',
          isOfflineReady: true,
          lastSynchronized: null
        });
      };
    } catch {
      resolve({
        tier1BundledCount: CANONICAL_VOYAGES.length,
        tier2CachedCount: 0,
        totalAvailable: CANONICAL_VOYAGES.length,
        storageBackend: 'Memory Only',
        isOfflineReady: true,
        lastSynchronized: null
      });
    }
  });
}

/**
 * Clear cached records and reset to bundled core.
 */
export async function resetCacheToBundledCore(): Promise<void> {
  const db = await openDatabase();
  if (!db) return;

  try {
    const tx = db.transaction([STORE_NAME, META_STORE], 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    tx.objectStore(META_STORE).clear();
    await initializeOfflineVoyagesStore();
  } catch (err) {
    console.warn('SlaveVoyages: Failed to reset cache', err);
  }
}
