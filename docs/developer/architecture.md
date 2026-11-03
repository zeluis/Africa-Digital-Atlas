# Architecture & Tech Stack

## Stack

- **React 19** with **TypeScript** for the UI layer
- **Vite** as the build tool and dev server
- **Tailwind CSS 4** for styling and fluid typographical clamp math
- **motion/react (Framer Motion)** for physics-based tactile transitions and shared layout animations
- Pure **SVG** for all cartographic rendering (no external map-tile dependency)
- A lightweight, dependency-free custom **i18n engine** (`src/i18n/LanguageContext.tsx`) for multilingual support across 7 languages
- **Service worker** based offline caching for complete PWA support

## Structure

The app is organized around a `src/views/` directory containing 21 modular view components dynamically loaded with `lazyWithRetry`:
Overview, Map, Explore, Country, Compare, Analytics, Regional, SlaveTrade, Iconography, ArchivalCartography, MolecularLegacies, AfricanDevelopmentMasterReport, Heritage, Languages, EthnicTreeOfLife, ThematicPillars, ResearchReportsDirectory, ResearchReportArticle, ProvenanceQuality, PrivacySection, and UniversalStyleGuide.

Shared UI primitives, cartographic overlays, and modals live in `src/components/`, while datasets, schemas, and multilateral ingestions reside in `src/data/`.

## Motion & Animation Engine (`src/utils/motion.tsx`)

Tactile interaction throughout the application is powered by the Universal Motion Engine:
- **Spring Curves**: `SPRING_TACTILE` (stiffness: 380, damping: 28), `SPRING_SNAPPY` (stiffness: 420, damping: 24), `SPRING_GENTLE` (stiffness: 260, damping: 32).
- **Primitives**: `SlidingPill` with shared Framer `layoutId`, `AnimatedTabPanel` for exit/enter transitions, `AnimatedSection` for viewport-aware entrances, and `getRegionCardTonalStyle` for UN Geoscheme regional hover colors.
- **Accessibility**: Strict compliance with `@media (prefers-reduced-motion: reduce)`.

## Data flow

At build and runtime, the app pulls from 16 external institutional APIs (World Bank, IMF, WHO, UNESCO, SlaveVoyages Consortium, etc.), normalizes their responses into a common indicator schema, and caches them for offline use with per-value observation status flags (`observed`, `estimated`, `forecast`, `derived`). See the [Data Sources Catalog](../data/data-sources-catalog.md) for the full connector list.
