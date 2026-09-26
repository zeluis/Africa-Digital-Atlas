/**
 * PWA Image Cache Pre-warming Engine
 * Pre-warms the top 100 historical thumbnails and cartographic assets in CacheStorage
 * using requestIdleCallback to ensure zero main-thread jank.
 */

import { SLAVE_TRADE_ILLUSTRATIONS } from '../data/slaveTradeIllustrations';
import { CASTAS_ARCHIVE_ITEMS } from '../data/castasArchive';

const CACHE_NAME = 'africa-archival-plates-v1';

// Gather the top 100 critical archival thumbnail URLs
export const getTopArchivalImageUrls = (): string[] => {
  const urls: string[] = [];

  // 1. Castas 32 plates
  CASTAS_ARCHIVE_ITEMS.forEach(item => {
    if (item.imageUrl && !urls.includes(item.imageUrl)) {
      urls.push(item.imageUrl);
    }
  });

  // 2. Transatlantic Slave Trade Illustrations top plates
  SLAVE_TRADE_ILLUSTRATIONS.forEach(item => {
    if (item.imageUrls && item.imageUrls[0] && !urls.includes(item.imageUrls[0])) {
      if (urls.length < 100) {
        urls.push(item.imageUrls[0]);
      }
    }
  });

  return urls;
};

/**
 * Pre-warms the archival image cache progressively during browser idle time
 */
export const prewarmArchivalImageCache = async (): Promise<{ cached: number; total: number }> => {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { cached: 0, total: 0 };
  }

  const urlsToCache = getTopArchivalImageUrls();
  let cachedCount = 0;

  try {
    const cache = await caches.open(CACHE_NAME);

    const cacheBatch = async (batch: string[]) => {
      await Promise.allSettled(
        batch.map(async url => {
          try {
            const existing = await cache.match(url);
            if (!existing) {
              const res = await fetch(url, { mode: 'no-cors' });
              if (res.status === 200 || res.type === 'opaque') {
                await cache.put(url, res);
                cachedCount++;
              }
            } else {
              cachedCount++;
            }
          } catch {
            // Silently ignore offline / CORS transient misses
          }
        })
      );
    };

    // Process in batches of 6 with idle scheduling
    const batchSize = 6;
    for (let i = 0; i < urlsToCache.length; i += batchSize) {
      const chunk = urlsToCache.slice(i, i + batchSize);
      if ('requestIdleCallback' in window) {
        await new Promise<void>(resolve => {
          window.requestIdleCallback(async () => {
            await cacheBatch(chunk);
            resolve();
          }, { timeout: 2000 });
        });
      } else {
        await cacheBatch(chunk);
        await new Promise(r => setTimeout(r, 80));
      }
    }
  } catch {
    // CacheStorage unhandled error handling
  }

  return { cached: cachedCount, total: urlsToCache.length };
};

/**
 * Hook or helper to trigger pre-warming when network is idle
 */
export const initArchivalPrecache = () => {
  if (typeof window === 'undefined') return;

  const startPrewarm = () => {
    if (navigator.onLine) {
      setTimeout(() => {
        prewarmArchivalImageCache();
      }, 2500); // 2.5s post-boot delay so initial render is instantaneous
    }
  };

  if (document.readyState === 'complete') {
    startPrewarm();
  } else {
    window.addEventListener('load', startPrewarm, { once: true });
  }
};
