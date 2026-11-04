---
icon: cloud-arrow-up
---

# Deployment

The live app is published via **GitHub Pages** at [zeluis.github.io/Africa-Digital-Atlas](https://zeluis.github.io/Africa-Digital-Atlas/).

## GitHub Actions Automated CI/CD

Deployment is automated via `.github/workflows/deploy.yml`. When code is merged into `main` or `master`:

1. **Pre-Flight Integrity Gate**: Runs TypeScript checks, view/chunk export guardrails (`scripts/verify-views-and-chunks.mjs`), and dataset SHA-256 verification.
2. **Environment & Base Path Setup**: Sets up GitHub Pages context via `actions/configure-pages@v5`.
3. **Compilation**: Builds Vite production assets and VitePress documentation (`npm run build`).
4. **Static Fallback Verification**: Confirms presence of `.nojekyll` (bypasses Jekyll processing) and `404.html` (SPA deep-linking redirector) in `./dist`.
5. **Deployment**: Deploys the static bundle to the GitHub Pages environment.

## Single-Page Application (SPA) Routing & Fallback

Because GitHub Pages does not support native server-side rewrites, deep links and browser refreshes are preserved through `public/404.html`. This script converts deep paths (such as `/country/NGA`) into hash routes (`/#country/NGA`) preserving query strings, which `src/App.tsx` handles seamlessly.

## Alternative Hosting & Containerization

Because the app compiles to a static PWA bundle with an optional Express production runner (`server.ts`), it can also be deployed to:
- Container platforms (Google Cloud Run, AWS ECS, Docker) using `npm start`.
- Static CDNs (Cloudflare Pages, Vercel, Netlify) by serving the `dist/` folder.
