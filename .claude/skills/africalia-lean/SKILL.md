---
name: africalia-lean
description: Optimize the Africalia / Africa-Digital-Atlas app for speed and size without removing any feature or weakening research integrity. Use when asked to improve performance, reduce bundle or asset size, speed up loading, fix jank, or "make it leaner". Measures first, works in small verified steps, and reports before/after numbers.
---

# Africalia lean-and-fast

**Goal:** a faster, smaller app that still does everything it does today, on slow phones and metered data, and still tells the truth about its data.

## Non-negotiables
1. **No feature loss.** Run `node scripts/feature-inventory.mjs --check` before and after every change. A failed check means something was removed or orphaned. Restore it.
2. **Research integrity stays intact.** Never strip or hide status labels, source links, provenance, checksums or limits boxes to save bytes. Run `node scripts/research-integrity.mjs --check` and `node scripts/research-check.mjs` if the research kit is installed.
3. **No language or script left behind.** The UI ships 15 languages including Arabic and Amharic. Do not subset fonts or drop glyph ranges that any shipped language needs.
4. **Measure, don't guess.** Every change gets a before and after from `node scripts/perf-budget.mjs`. If a change does not move a number, revert it.
5. **Offline stays.** After a first visit every view, its code and its bundled data must work with no network. Run `node scripts/offline-audit.mjs --check` after every change. Never remove code or data chunks from the service-worker precache to hit a size number.
6. **Small steps.** One optimization per commit. `npx tsc --noEmit` must stay at 0 errors.

## Loop
```
1. npx tsc --noEmit && npx vite build && node scripts/perf-budget.mjs   # baseline
2. node scripts/feature-inventory.mjs --write                           # first time only
3. Take the next item from the ladder below. Make the change.
4. Rebuild, rerun perf-budget and feature-inventory --check.
5. Commit with the numbers in the message. Repeat.
6. Lower the ceilings in perf/budget.json to the new numbers.
```

## Baseline (measured 4 Oct 2026, commit 6be194d)
Build 22 s, `tsc` 0 errors. Startup loads 11 chunks, **578 KB gzip** of JavaScript (entry 891 KB raw). CSS 422 KB raw. Total JS 8.5 MB raw. The service worker precaches 100+ files: **13.9 MB on disk but about 4.6 MB to download**, and that is what makes every view work offline. Largest assets: `africa-final.svg` 2.4 MB; eight photos in `public/assets/images` 6.9 MB total (about 1 MB each). Targets are in `perf/budget.json`.

## Ladder (highest payoff first)

### A. Trim the precache without breaking offline
The precache is the app's offline guarantee (all code, bundled data, fonts and SVG maps, about 4.6 MB to download). Do **not** shrink it by dropping `data-*.js` or view chunks: that saves only about 1.4 MB and makes every unvisited view fail offline. Shrink it by making the same content smaller:
1. **Fonts, 1.3 MB:** subset the four font families to the scripts the 15 languages need (Latin, Arabic, Ethiopic) and ship only the weights in use (see F).
2. **SVG maps, about 1 MB transferred:** run svgo (E). They stay precached.
3. **Bundled data:** if you move data to JSON (D), add `json` to `globPatterns` so it stays precached.
4. **Images:** keep photos out of the precache and give them a runtime rule so they work offline once viewed:
```ts
runtimeCaching: [
  { urlPattern: ({ request, url }) => request.destination === 'image' && url.origin === self.location.origin,
    handler: 'CacheFirst',
    options: { cacheName: 'local-media', expiration: { maxEntries: 120, maxAgeSeconds: 60*60*24*60 }, cacheableResponse: { statuses: [200] } } },
  { urlPattern: /^https:\/\/thumb\.wikimedia\.org\/.*/i, handler: 'StaleWhileRevalidate',
    options: { cacheName: 'wikimedia-thumbs', expiration: { maxEntries: 60, maxAgeSeconds: 60*60*24*30 }, cacheableResponse: { statuses: [0, 200] } } },
  // keep the existing fonts, flagcdn, upload.wikimedia and archival rules
]
```
5. **Heavy optional packs are opt-in.** Anything over a few MB that a reader may want offline (the 14 MB archive set, historical map plates) goes behind an explicit "Save for offline reading" action, with its size shown first. See I.
Target: about 3 MB download, same offline coverage. `offline-audit.mjs` must still report 100% of app code precached.

### B. Compress images
`node scripts/optimize-images.mjs public/assets/images public/cartography public/castas` writes WebP copies (max 1600 px). A test on `public/assets/images` took 6.9 MB to 1.1 MB. Then update references to `.webp`, add `width`/`height`, `loading="lazy"` and `decoding="async"` to every `<img>` (only 1 of 13 has lazy loading today), and delete originals after checking. For historic maps where detail matters, serve the 1600 px WebP by default and offer "open full resolution" as a link to the original. Nothing is lost.

### C. Slim the start-up path
Startup currently preloads data chunks that only specific views need (`data-slave-voyages`, `data-research-reports`, `data-svg-schematic-maps`, `data-african-development`, `data-country-silhouettes`).
1. Remove static imports of modals that `App.tsx` already lazy-loads. Vite warns about `CartographicColophonModal` and `AcademicExportModal`, which are imported statically in `AfricaMap.tsx`, `AfricaliaExplorer.tsx`, `SlaveTradeView.tsx` and `ProvenanceQualityView.tsx`. Replace with `lazy()` plus `<Suspense>`.
2. Make every view a lazy route (`const SlaveTradeView = lazy(() => import('./views/SlaveTradeView'))`) with a skeleton fallback.
3. Stop data chunks from being preloaded:
```ts
build: { modulePreload: { resolveDependencies: (_, deps) => deps.filter(d => !/\/data-/.test(d)) } }
```
4. Target: startup 4 chunks, under 250 KB gzip. Preloading affects only first-paint order; the service worker still precaches every chunk, so offline is unchanged.

### D. Move bulky data out of the JS bundle
`slave-trade-illustrations` is 2.4 MB raw (1,198 records). `wikipediaEthnicAtlas.ts` is 3,351 lines. Generate `.json` files at build time into `public/data/`, `fetch()` them when a view opens, and show a skeleton. Keep the same shapes so components do not change, and add `json` to the service-worker `globPatterns` so the files remain precached (check with `offline-audit.mjs`). Show the first 50 records and load more on scroll (or virtualize); 1,198 DOM cards at once is a jank source.

### E. Shrink the two large vector files
`africa-final.svg` (2.4 MB) and `africalia-ethnic-tree.svg` (716 KB): run `npx svgo --multipass -p 2` (check the maps visually before and after), serve with gzip/brotli (GitHub Pages does gzip), and load only on the views that use them. Keep the originals in `docs/source-art/`.

### F. CSS and fonts
- 422 KB of CSS is large for Tailwind v4. Inspect with `npx vite-bundle-visualizer` and search for huge `@apply` blocks, safelists and repeated arbitrary values. Target 250 KB.
- Four variable font families are imported in `main.tsx`. Import only the weight/axis ranges and Latin subsets actually used, add `font-display: swap`, and keep Arabic and Ethiopic coverage (rule 3). Prefer `@fontsource-variable/<name>/wght.css` and subset files where available.

### G. Runtime smoothness
- Canvas and animation loops (`OceanCurrentParticleCanvas`, `HistoricalMapCurtainViewer`, the Atlantic flow map): pause when offscreen (IntersectionObserver), pause on `visibilitychange`, cap `devicePixelRatio` at 2, and stop entirely under `prefers-reduced-motion` (0 files check it today).
- Big SVG maps: handle hover with CSS or a single delegated listener, not per-element React state. Wrap heavy children in `memo`, and use `content-visibility: auto` on long off-screen sections.
- `motion` is imported in 34 files. Use `LazyMotion` with `domAnimation` and `m.*` components to cut its size.
- `lucide-react` is imported in 101 files. Tree-shaking works, but keep imports named.

### I. Make the archive pre-warm respectful (and honest offline)
`src/utils/imagePrecache.ts` runs 2.5 s after every page load and downloads up to about 100 archive images into CacheStorage, without checking data-saver or connection type. The remote image sizes are unmeasured, and no-cors responses can count at inflated sizes against browser storage quota.
1. Skip automatic pre-warm when `navigator.connection?.saveData` is true or `effectiveType` is `'2g'`/`'slow-2g'`.
2. Better: run it only when the reader presses "Save for offline reading" (the Colophon modal already has a readiness checker), and show the total size first.
3. Fix local URLs: `/assets/archives/SI-OB-${id}.jpg` is root-absolute while the app uses `base: './'`. On a subpath such as GitHub Pages it likely points outside the app. Build it with `resolveAssetPath()` or `import.meta.env.BASE_URL`. Verify on the deployed URL.
4. Add a runtime cache rule for `images.unsplash.com` (123 references) or replace those with local images.

### H. Dependencies and build
- `express`, `dotenv` and `@google/genai` are used only by `server.ts`, not the browser bundle. Confirm none is imported from `src/`, and consider moving them to a separate server `package.json` or `devDependencies` if the site is deployed statically.
- Commit a fixed lockfile (`npm install`, keep one lockfile) so CI can use `npm ci`.
- Add `.github/workflows/perf-budget.yml` so a regression fails the PR.

## UI/UX rules while optimizing
- **Perceived speed counts as much as bytes.** Every lazy region gets a skeleton that matches its final size (no layout shift). Show cached content first, refresh quietly.
- **Honest loading and empty states.** Copy follows `VOICE_AND_TONE.md`: plain, specific, no hype ("Loading 1,198 archive records" not "Unlocking the archive").
- **Mobile first.** Test at 360 px width, throttled "Fast 3G", with 4x CPU slowdown. Interaction response under 200 ms.
- **Accessibility is part of performance.** Keep focus order, labels and contrast. Do not remove ARIA or alt text to save bytes.
- **Content notes** on archive images of captivity should render before the image, not after.

## Report format (end of every session)
| Metric | Before | After | Target |
|---|---|---|---|
| startupJsGzipKB / startupChunkCount | | | 250 / 4 |
| entryRawKB | | | 500 |
| cssRawKB | | | 250 |
| precacheTransferMB | | | 3 |
| largestImageKB | | | 300 |
Then one line each: what changed, what was verified (`tsc`, feature inventory, offline audit, research checks), and anything you chose not to change and why.

## Do not
- Delete a view, modal, export format, language or data layer to hit a number.
- Replace D3 maps with raster images, or drop historical map detail without keeping a full-resolution link.
- Add a new dependency unless it removes more weight than it adds.
- Raise a budget ceiling without a written reason in the PR.
