/**
 * PWA Image Cache Pre-warming Engine
 * Pre-warms the top 100 historical thumbnails and cartographic assets in CacheStorage
 * using requestIdleCallback to ensure zero main-thread jank.
 */

import { CASTAS_ARCHIVE_ITEMS } from '../data/castasArchive';

const CACHE_NAME = 'africa-archival-plates-v1';

// Gather the top 100 critical archival thumbnail URLs
export const getTopArchivalImageUrls = async (): Promise<string[]> => {
  const urls: string[] = [];

  // 1. Castas 32 plates and thumbnails
  CASTAS_ARCHIVE_ITEMS.forEach(item => {
    if (item.thumbnailUrl && !urls.includes(item.thumbnailUrl)) {
      urls.push(item.thumbnailUrl);
    }
    if (item.imageUrl && !urls.includes(item.imageUrl)) {
      urls.push(item.imageUrl);
    }
  });

  // 2. Pre-packaged local archive fallbacks
  const localArchiveIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 36, 46, 50, 536, 802, 1042];
  localArchiveIds.forEach(id => {
    const localUrl = `/assets/archives/SI-OB-${id}.jpg`;
    if (!urls.includes(localUrl)) {
      urls.push(localUrl);
    }
  });

  // 2. Transatlantic Slave Trade Illustrations top plates (dynamically loaded to prevent startup blocking)
  try {
    const { SLAVE_TRADE_ILLUSTRATIONS } = await import('../data/slaveTradeIllustrations');
    SLAVE_TRADE_ILLUSTRATIONS.forEach(item => {
      if (item.imageUrls && item.imageUrls[0] && !urls.includes(item.imageUrls[0])) {
        if (urls.length < 100) {
          urls.push(item.imageUrls[0]);
        }
      }
    });
  } catch (err) {
    console.warn('[PWA] Archival precache dataset deferral:', err);
  }

  return urls;
};

/**
 * Pre-warms the archival image cache progressively during browser idle time
 */
export const prewarmArchivalImageCache = async (): Promise<{ cached: number; total: number }> => {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { cached: 0, total: 0 };
  }

  const urlsToCache = await getTopArchivalImageUrls();
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
