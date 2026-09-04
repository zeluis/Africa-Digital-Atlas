# Architecture & Tech Stack

## Stack

- **React 19** with **TypeScript** for the UI layer
- **Vite** as the build tool and dev server
- Pure **SVG** for all cartographic rendering (no map-tile dependency)
- A lightweight, dependency-free custom **i18n engine** (`src/i18n.ts`) for multilingual support
- **Service worker** based offline caching for full PWA support

## Structure

The app is organized around a `src/views/` directory, with one view per major feature area: Overview, Map, Country, Compare, Analytics, Regional, SlaveTrade, Heritage, Languages, ThematicPillars, and ProvenanceQuality. Shared UI primitives and data-fetching utilities live alongside these views in `src/components/` and `src/data/` (naming may vary slightly — check the repo directly for the current layout).

## Data flow

At build/runtime, the app pulls from 16 external institutional APIs (World Bank, IMF, WHO, UNESCO, etc.), normalizes their responses into a common indicator schema, and caches them for offline use. See the [Data Sources Catalog](../data/data-sources-catalog.md) for the full connector list.
