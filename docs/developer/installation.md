# Installation & Local Development

## Prerequisites

- Node.js (LTS recommended)
- npm (or your preferred Node package manager)

## Steps

```bash
git clone https://github.com/zeluis/Africa-Digital-Atlas.git
cd Africa-Digital-Atlas
npm install
npm run dev
```

The dev server starts via Vite, with hot module reload enabled by default.

## Common scripts

Check `package.json` for the authoritative list, but typically:

- `npm run dev` — start the local dev server
- `npm run build` — produce a production build
- `npm run preview` — preview the production build locally

## Running these docs locally

This VitePress docs site lives alongside the app and has its own scripts:

```bash
npm install
npm run docs:dev
```
