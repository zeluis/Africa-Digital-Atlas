import { useState, useEffect } from 'react';

export interface LazyAssetStore<T> {
  isLoaded: () => boolean;
  ensureLoaded: () => Promise<T>;
  subscribe: (listener: () => void) => () => void;
  useLoaded: () => boolean;
}

/**
 * Creates an idempotent, React-subscribable lazy JSON loader backed by
 * Workbox-precached Vite asset URLs (`new URL('./foo.json', import.meta.url).href`).
 */
export function createLazyAssetStore<T>(
  urls: string[],
  hydrate: (payloads: any[]) => T,
  getCurrent: () => T
): LazyAssetStore<T> {
  let loaded = false;
  let loadPromise: Promise<T> | null = null;
  const listeners = new Set<() => void>();

  const isLoaded = () => loaded;

  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const ensureLoaded = (): Promise<T> => {
    if (loaded) return Promise.resolve(getCurrent());
    if (loadPromise) return loadPromise;
    if (typeof fetch === 'undefined') {
      return Promise.resolve(getCurrent());
    }

    loadPromise = Promise.all(
      urls.map((u) => fetch(u).then((r) => (r.ok ? r.json() : null)))
    )
      .then((payloads) => {
        const result = hydrate(payloads);
        loaded = true;
        listeners.forEach((fn) => fn());
        return result;
      })
      .catch(() => {
        loadPromise = null;
        return getCurrent();
      });

    return loadPromise;
  };

  const useLoaded = (): boolean => {
    const [ready, setReady] = useState<boolean>(loaded);

    useEffect(() => {
      if (loaded) {
        if (!ready) setReady(true);
        return;
      }
      const unsub = subscribe(() => setReady(true));
      void ensureLoaded();
      return unsub;
    }, [ready]);

    return ready;
  };

  return { isLoaded, ensureLoaded, subscribe, useLoaded };
}
