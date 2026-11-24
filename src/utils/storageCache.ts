/**
 * Safe localStorage JSON helpers and bounded LRU storage cache.
 * Handles restricted iframe SecurityError, quota exhaustion, and malformed JSON gracefully.
 */

function getSafeLocalStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof globalThis !== 'undefined') {
      const storage = (globalThis as { localStorage?: Storage }).localStorage;
      if (storage) return storage;
    }
  } catch {
    // Access to localStorage can throw SecurityError in sandboxed iframes
  }
  return null;
}

export interface StorageReadOptions {
  legacyKey?: string;
  migrateLegacy?: boolean;
}

export function readStorageString(
  key: string,
  fallback?: string,
  options?: StorageReadOptions
): string | undefined {
  const storage = getSafeLocalStorage();
  if (!storage) return fallback;
  try {
    let raw = storage.getItem(key);
    let fromLegacy = false;
    if (raw === null && options?.legacyKey) {
      raw = storage.getItem(options.legacyKey);
      fromLegacy = raw !== null;
    }
    if (raw === null) return fallback;
    if (fromLegacy && options?.legacyKey && options.migrateLegacy !== false) {
      try {
        storage.setItem(key, raw);
        storage.removeItem(options.legacyKey);
      } catch {
        // Ignore migration write failure
      }
    }
    return raw;
  } catch {
    return fallback;
  }
}

export function writeStorageString(key: string, value: string): boolean {
  const storage = getSafeLocalStorage();
  if (!storage) return false;
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorageKey(key: string, legacyKey?: string): void {
  const storage = getSafeLocalStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
    if (legacyKey) {
      storage.removeItem(legacyKey);
    }
  } catch {
    // Ignore restricted iframe storage errors
  }
}

export function readStorageJson<T>(
  key: string,
  fallback: T,
  options?: StorageReadOptions
): T {
  const raw = readStorageString(key, undefined, options);
  if (raw === undefined) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorageJson(key: string, value: unknown): boolean {
  try {
    return writeStorageString(key, JSON.stringify(value));
  } catch {
    return false;
  }
}

export interface BoundedStorageLruOptions {
  prefix: string;
  indexKey: string;
  maxEntries: number;
  legacyPrefix?: string;
}

export interface BoundedStorageLru<T> {
  get: (entryKey: string) => T | null;
  set: (entryKey: string, value: T) => boolean;
  remove: (entryKey: string) => void;
}

export function createBoundedStorageLru<T>({
  prefix,
  indexKey,
  maxEntries,
  legacyPrefix,
}: BoundedStorageLruOptions): BoundedStorageLru<T> {
  const limit = Math.max(1, Math.floor(maxEntries));

  const readIndex = (storage: Storage): string[] => {
    try {
      const raw = storage.getItem(indexKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string')
        : [];
    } catch {
      return [];
    }
  };

  const bumpIndex = (storage: Storage, entryKey: string) => {
    try {
      const indexList = readIndex(storage);
      const existingIdx = indexList.indexOf(entryKey);
      if (existingIdx !== -1) {
        indexList.splice(existingIdx, 1);
      }
      indexList.push(entryKey);
      while (indexList.length > limit) {
        const oldestKey = indexList.shift();
        if (oldestKey) {
          storage.removeItem(`${prefix}${oldestKey}`);
        }
      }
      storage.setItem(indexKey, JSON.stringify(indexList));
    } catch {
      // Ignore quota or index update failures
    }
  };

  return {
    get(entryKey: string): T | null {
      const storage = getSafeLocalStorage();
      if (!storage) return null;

      const fullKey = `${prefix}${entryKey}`;
      const legacyKey = legacyPrefix ? `${legacyPrefix}${entryKey}` : null;
      let raw: string | null = null;
      let fromLegacy = false;

      try {
        raw = storage.getItem(fullKey);
        if (raw === null && legacyKey) {
          raw = storage.getItem(legacyKey);
          fromLegacy = raw !== null;
        }
      } catch {
        return null;
      }

      if (raw === null) return null;

      let parsed: T;
      try {
        parsed = JSON.parse(raw) as T;
      } catch {
        try {
          storage.removeItem(fullKey);
          if (legacyKey) storage.removeItem(legacyKey);
        } catch {
          // ignore
        }
        return null;
      }

      if (fromLegacy && legacyKey) {
        try {
          storage.setItem(fullKey, raw);
          storage.removeItem(legacyKey);
        } catch {
          // ignore migration write failure
        }
      }

      bumpIndex(storage, entryKey);
      return parsed;
    },

    set(entryKey: string, value: T): boolean {
      const storage = getSafeLocalStorage();
      if (!storage) return false;
      try {
        storage.setItem(`${prefix}${entryKey}`, JSON.stringify(value));
        bumpIndex(storage, entryKey);
        return true;
      } catch {
        return false;
      }
    },

    remove(entryKey: string): void {
      const storage = getSafeLocalStorage();
      if (!storage) return;
      try {
        storage.removeItem(`${prefix}${entryKey}`);
        if (legacyPrefix) {
          storage.removeItem(`${legacyPrefix}${entryKey}`);
        }
        const indexList = readIndex(storage).filter((k) => k !== entryKey);
        storage.setItem(indexKey, JSON.stringify(indexList));
      } catch {
        // ignore
      }
    },
  };
}
