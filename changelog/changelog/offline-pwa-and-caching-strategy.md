---
icon: wifi
---

# Offline PWA & Caching Strategy

The Africa Digital Atlas is designed to work fully offline once loaded.

## How it works

* A **service worker** precaches the app shell (JS/CSS bundles, SVG map geometry, fonts) on first load.
* Indicator data fetched from the 16 institutional connectors is cached client-side so previously viewed countries and indicators remain browsable without a network connection.
* The app is installable as a standalone PWA on desktop and mobile, following standard `manifest.json` + service-worker conventions.

Because the map itself is vector SVG rather than tiled raster imagery, the entire cartographic layer is cheap to cache in full — there's no tile-fetching-on-pan behavior to worry about offline.
