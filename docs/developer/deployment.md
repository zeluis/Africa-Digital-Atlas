# Deployment

The live app is published via **GitHub Pages** at [zeluis.github.io/Africa-Digital-Atlas](https://zeluis.github.io/Africa-Digital-Atlas/).

## GitHub Actions Automated Deployment

The repository includes an automated GitHub Actions deployment workflow located at `.github/workflows/deploy.yml`. Every commit pushed to `main` or `master` initiates an automated pipeline that:

1. Validates token resilience and environment parameters.
2. Executes TypeScript verification (`tsc --noEmit`).
3. Audits all lazy-loaded view exports and dynamic bundler pre-bundling rules (`node scripts/verify-views-and-chunks.mjs`).
4. Verifies research integrity and dataset SHA-256 checksums (`npm run research:check && npm run research:integrity`).
5. Configures GitHub Pages metadata via `actions/configure-pages@v5`.
6. Compiles the static production bundle with dynamic base path support (`npm run build`).
7. Confirms `.nojekyll` and `404.html` static fallbacks are in place in `./dist`.
8. Uploads and deploys the artifact to GitHub Pages.

## Manual Local Build

To generate the production bundle locally:

```bash
# 1. Run all integrity verifications
npm run lint

# 2. Compile static assets and VitePress documentation
npm run build

# 3. Preview the production bundle locally
npm run preview
```

The compiled output is located in `dist/`.

## GitHub Pages Configuration & SPA Deep-Linking

### Single Page Application (SPA) Routing & 404 Fallback
GitHub Pages is a static file host that does not natively support server-side URL rewrites. To ensure direct links (such as `/country/NGA` or `/region/western-africa`) and browser refreshes resolve correctly without 404 errors:
- A lightweight SPA redirect handler is maintained at `public/404.html`.
- When GitHub Pages receives a request for a non-file route, it serves `404.html`, which immediately preserves query parameters and redirects the browser to the corresponding hash route (`/#country/NGA`).
- The application's URL parser in `src/App.tsx` reads the hash and renders the corresponding view instantly.

### Jekyll Bypass (`.nojekyll`)
GitHub Pages processes hosted files using Jekyll by default, which ignores folders or assets prefixed with underscores (such as `_assets/`). The build includes `public/.nojekyll`, which is copied directly into `dist/.nojekyll` during `npm run build` to ensure all bundled assets are served without obstruction.

### Dynamic Base Path
Vite is configured with:
```ts
base: process.env.BASE_URL || process.env.VITE_BASE_PATH || './'
```
This ensures that the build automatically adapts whether deployed to:
- A GitHub Pages subpath (e.g. `https://<user>.github.io/<repo>/`).
- A custom top-level domain (e.g. `https://example.com/`).
- A local preview environment or static file system.

## Dual Documentation Build

The documentation site is powered by VitePress and is configured to build into `dist/docs` during `npm run build`:

```bash
npm run docs:build
# outputs to dist/docs alongside the main application bundle
```

This ensures both the primary application and the interactive documentation are served cohesively on GitHub Pages under the same domain.
