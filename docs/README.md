# Africa Digital Atlas — VitePress Docs

A git-native, self-hosted alternative to the GitBook site, covering the same content: User Guide, Data & Methodology, Developer Guide, and FAQ.

## How to merge this into your repo

This was built outside your repo (no push access from here), so:

1. Copy this folder's contents (`docs/`, `package.json`, `.gitignore`) into the root of `Africa-Digital-Atlas`.
   - If your root `package.json` already exists, merge the `devDependencies` (`vitepress`) and `scripts` (`docs:dev`, `docs:build`, `docs:preview`) into it instead of overwriting.
   - Merge `.gitignore` contents rather than overwriting if you already have one.
2. `npm install`
3. `npm run docs:dev` — opens the docs site locally, usually at `http://localhost:5173`.

## Structure

```
docs/
  .vitepress/config.mts   — nav, sidebar, search, footer config
  index.md                — home page (hero + feature cards)
  guide/                  — User Guide (8 pages)
  data/                   — Data & Methodology (3 pages)
  developer/              — Developer Guide (5 pages)
  faq.md                  — FAQ
  public/hero-preview.jpg — pulled from your repo's public/ folder
```

## Deployment

Two options, both covered in more detail on the [Deployment page](docs/developer/deployment.md) once running:

- **Same Pages site as the app** (default config): built with `base: '/Africa-Digital-Atlas/docs/'`, so `npm run docs:build` output is meant to land at `<pages-root>/docs/`. You'll need to fold this into whatever build/deploy workflow publishes the main app.
- **Separate site** (simpler): change `base` to `/` in `config.mts` and deploy `docs/.vitepress/dist` to its own Netlify/Vercel/Pages project — gets you a clean separate URL with zero coordination with the app's own deploy.

## Content parity note

This mirrors the same real content already published to the GitBook site (fpizeluis.gitbook.io/fpizeluis-docs) — same pages, same facts, just as plain git-tracked markdown instead of a hosted GitBook space. Edit these `.md` files directly and commit — no separate sync step needed.
