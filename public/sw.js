// Africa Data Atlas - Progressive Web App Service Worker
// Multi-Tier Caching Strategies for complete Offline Availability

const VERSION = 'v1.1';
const CACHE_STATIC = `africa-atlas-static-${VERSION}`;
const CACHE_IMMUTABLE = `africa-atlas-immutable-${VERSION}`;
const CACHE_FONTS = `africa-atlas-fonts-${VERSION}`;
const CACHE_DATA = `africa-atlas-data-${VERSION}`;

const CURRENT_CACHES = [CACHE_STATIC, CACHE_IMMUTABLE, CACHE_FONTS, CACHE_DATA];

// Essential core precache assets (App Shell & Metadata)
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './favicon-32x32.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './icon.svg'
];

// Install Event: Precache App Shell & core metadata
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      // Force the waiting service worker to become active immediately
      return self.skipWaiting();
    })
  );
});

// Activate Event: Purge old cache versions and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!CURRENT_CACHES.includes(key)) {
            console.log('[SW] Deleting deprecated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Helper: Determine if request is for Google Fonts
function isFontRequest(url) {
  return (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf')
  );
}

// Helper: Determine if request is an immutable hashed asset (JS chunks, CSS, SVG map vector bundles)
function isHashedAsset(url) {
  return (
    url.pathname.includes('/assets/') ||
    /\.(js|css|svg|png|jpg|jpeg|webp|ico|json)$/i.test(url.pathname)
  );
}

// Strategy 1: Cache-First (with background population) for Immutable Assets, Maps & Fonts
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Cache-First fetch failed for:', request.url, error);
    // If completely offline and missing, return null so caller can handle fallback if needed
    return cachedResponse || null;
  }
}

// Strategy 2: Stale-While-Revalidate for HTML, App Shell, and Metadata
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Background fetch to update cache for next load
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((err) => {
      console.log('[SW] Network fetch failed, serving from cache:', request.url);
      return cachedResponse;
    });

  // Serve from cache immediately if present, otherwise await the network response
  return cachedResponse || fetchPromise;
}

// Strategy 3: Network-First with Cache Fallback for dynamic/live API requests
async function networkFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Main Fetch Event Listener
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only intercept GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Google Fonts (Cache-First)
  if (isFontRequest(url)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_FONTS));
    return;
  }

  // 2. Same-Origin Requests
  if (url.origin === self.location.origin) {
    // 2a. HTML navigation requests (SPA Mode: Stale-While-Revalidate with index.html offline fallback)
    if (request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
      event.respondWith(
        staleWhileRevalidateStrategy(request, CACHE_STATIC).catch(async () => {
          // If navigation completely fails offline, serve the precached index.html
          const staticCache = await caches.open(CACHE_STATIC);
          return (
            (await staticCache.match('./index.html')) ||
            (await staticCache.match('./'))
          );
        })
      );
      return;
    }

    // 2b. Vite-built Assets, Map Data, and Images (Cache-First for ultra-fast performance)
    if (isHashedAsset(url)) {
      event.respondWith(cacheFirstStrategy(request, CACHE_IMMUTABLE));
      return;
    }

    // 2c. Metadata & Manifest (Stale-While-Revalidate)
    event.respondWith(staleWhileRevalidateStrategy(request, CACHE_STATIC));
    return;
  }

  // 3. External API queries (e.g. live data sources: Network-First with Cache Fallback)
  if (url.protocol.startsWith('http')) {
    event.respondWith(
      networkFirstStrategy(request, CACHE_DATA).catch(() => {
        return new Response(JSON.stringify({ offline: true, error: 'Network unavailable' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 503
        });
      })
    );
  }
});
