# AFRICALIA (AFRICA DATA ATLAS) — MASTER ARCHITECTURE & COMPONENT CATALOG
**Comprehensive Technical Specification, View Registry, Component Directory, Services, Data Pipelines & API Reference**

*Scientific Direction & Cartographic Curation: **Zéluis F. Correia***  
*Observatory Edition: 2026.1 • Permanent Scholarly & Technical Reference*  
*DOI: [10.6084/m9.figshare.34065711](https://doi.org/10.6084/m9.figshare.34065711) • Dual-Licensed: MIT (Code) & CC BY 4.0 (Cartography & SVG Assets)*

---

## 🏛️ SECTION 1: SYSTEM OVERVIEW & CURRENT APPLICATION HEALTH

Africalia (the Africa Data Atlas) is a full-stack, client-first cartographic observatory, econometric analytics suite, and historical research repository covering all 54 sovereign African states. The application unites multilateral socioeconomic indicators (2015–2024), 36,108 documented historical trans-Atlantic and intra-American slave voyages (1514–1866), paleogenomics, pre-colonial territorial history, and high-precision $5,796 \times 5,867$ vector cartography.

### Current System Health Matrix
| Verification Domain | Standard / Tool | Status | Metrics / Details |
| :--- | :--- | :---: | :--- |
| **TypeScript Compilation** | `tsc --noEmit` (TypeScript 5.8.2) | **PASSED** | 0 type errors, 100% strict type safety across 274 codebase files. |
| **Research Provenance Check** | `scripts/research-check.mjs` | **PASSED** | 0 errors, 0 warnings across 274 scanned files; strict ratchet baseline locked. |
| **Cryptographic Integrity** | `scripts/research-integrity.mjs` | **PASSED** | 8 tracked datasets verified with SHA-256 Web Crypto checksums. |
| **Dual-Licensing Compliance** | `LICENSE-CODE` & `LICENSE-ASSETS` | **PASSED** | MIT License for application code; CC BY 4.0 for cartographic SVG assets. |
| **Production Bundler** | Vite 6.2.3 & VitePress 1.6.4 | **PASSED** | Client bundles, service worker precache (129 entries), and SSR docs generated. |
| **Server Runtime** | Express 4.21.2 + Node.js 22 | **PASSED** | Server proxy, multilateral connector probes, and Gemini speech API operational. |
| **Accessibility Audit** | WCAG 2.2 AAA / AA | **PASSED** | High-contrast focus rings, keyboard cartography, `@media (prefers-reduced-motion)`. |

---

## 🖥️ SECTION 2: VIEW REGISTRY (`src/views/`)

The application features 21 modular views dynamically routed via URL hash fragments (`#overview`, `#slave-trade`, `#map`, etc.) with code-splitting via `lazyWithRetry`:

### 1. `OverviewView.tsx` — Continental Synthesis & Macro Overview
- **Core Function**: Primary executive dashboard integrating the high-precision vector continental map with macro indicators.
- **Key Modules**:
  - Pan-African key indicator summary cards (GDP, Population, HDI, Renewable Energy, Intra-African Trade).
  - Schematic UN Geoscheme regional layer adhering to the 5 official macro-regions (Northern, Western, Central, Eastern, Southern Africa).
  - Quick-search country selector, regional focus jump links, and interactive SVG country hover inspection.
- **Data Hook**: `africaData.ts`, `africaFinalGeometry.ts`, `unGeoschemeColors.ts`.

### 2. `ExploreView.tsx` — 54-Country Grid & Multidimensional Filtering
- **Core Function**: Visual directory and card grid of all 54 sovereign African states.
- **Key Modules**:
  - Live search by country name, capital, ISO3 code, regional economic bloc (REC), and official languages.
  - Multi-tier sorting: Alphabetical, Population, GDP nominal, Land Area, HDI rank.
  - Interactive country cards displaying national flags, UN geoscheme regional badges, capital cities, and primary economic metrics.
- **Data Hook**: `africaData.ts`, `countryHeaderData.ts`.

### 3. `CountryView.tsx` — Comprehensive Sovereign State Dossier
- **Core Function**: In-depth dossier for any individual African country (default: `NGA` Nigeria).
- **Key Modules**:
  - Sovereign identity header with national flag, coat of arms, official languages, and currency.
  - 8 Thematic Pillars breakdown with historical time-series charts (2015–2024).
  - Bilateral trade matrix (exports/imports), top trading partners, and AfCFTA readiness indices.
  - Sub-national Admin-1 provincial map view with regional economic indicators.
  - Export utilities: PDF factsheet generation, CSV indicator download, and formatted academic citations.
- **Data Hook**: `countryHistoricalDevelopmentData.ts`, `worldBankComprehensiveData.ts`.

### 4. `RegionalView.tsx` — UN Geoscheme Macro-Region Deep Dives
- **Core Function**: Regional synthesis across the 5 African regions defined by the UN M49 standard.
- **Key Modules**:
  - Living regional canvas displaying geographic silhouettes with curated regional color palettes.
  - Comparative regional macroeconomic tables (aggregate GDP, growth rates, debt-to-GDP).
  - Cross-border infrastructure corridors, regional power pools (WAPP, EAPP, SAPP, CAPP), and river basin authorities.
  - Regional ecological indicators (rainfall anomalies, desertification fronts, forest cover).
- **Data Hook**: `regionalSpecializedAtlas.ts`, `unGeoschemeColors.ts`.

### 5. `ThematicPillarsView.tsx` — The 8 Pan-African Strategic Pillars
- **Core Function**: Cross-country comparative analysis structured around 8 core developmental pillars:
  1. *Economic Vitality & Industrialization* (GDP, manufacturing, debt service)
  2. *Governance, Rule of Law & Transparency* (WGI, Freedom House, Mo Ibrahim)
  3. *Infrastructure, Energy & Connectivity* (Electrification, internet penetration)
  4. *Human Capital, Education & Health* (Life expectancy, literacy, infant mortality)
  5. *Agricultural Systems & Food Sovereignty* (Cereal yields, arable land)
  6. *Ecological Resilience & Climate Action* (Carbon footprint, renewable share)
  7. *Trade, AfCFTA & Regional Integration* (Intra-African trade, tariffs)
  8. *Digital Innovation & Knowledge Economy* (Fintech, mobile money, patents)
- **Data Hook**: `expandedIndicators.ts`, `atlas-raw-data.ts`.

### 6. `AnalyticsView.tsx` — Bivariate & Multivariate Econometric Laboratory
- **Core Function**: Interactive statistical workshop for researchers and policy analysts.
- **Key Modules**:
  - Bivariate scatter plot with dynamic X/Y indicator axes and linear regression trendlines.
  - Time-series comparative multi-country line charts with epistemic certainty bounds.
  - Radar matrix comparing up to 6 countries across standardized 8-pillar normalized scores.
  - Correlation coefficient calculation ($r$ and $R^2$) with automated outlier detection.
- **Data Hook**: `atlas-store.ts`, `worldBankComprehensiveData.ts`.

### 7. `MapView.tsx` — High-Precision Interactive GIS & Thematic Cartography
- **Core Function**: Full-screen cartographic workspace powered by the native $5,796 \times 5,867$ coordinate engine.
- **Key Modules**:
  - Choropleth metric visualization with custom quantile and equal-interval color ramps.
  - 1,017 Admin-1 internal provincial/state boundary layer with toggleable visibility.
  - Hairline graticule lines (Prime Meridian, Equator, Tropics) and vintage nautical compass rose.
  - SIDS reticle callouts guaranteeing accessible clicks for island nations.
  - High-resolution 300 DPI PNG and SVG cartographic export.
- **Data Hook**: `africaFinalGeometry.ts`, `AfricaMapFinalLayer.tsx`.

### 8. `LanguagesView.tsx` — Linguistic Phylogeny & African Language Families
- **Core Function**: Cartography and taxonomy of Africa's 2,000+ living languages.
- **Key Modules**:
  - 4 Major Phyla classification: Niger-Congo, Afroasiatic, Nilo-Saharan, and Khoisan.
  - Mother Tongues interactive waveform scrubber with indigenous language audio samples.
  - Language & Phonemic Typology Lab: Reader-optimized, high-contrast typological cards analyzing phoneme inventories, click consonants (Khoisan / Bantu borrowings), tonal registers (level vs contour), noun class systems, and grammatical alignment.
  - Cross-border vehicular languages (Swahili, Hausa, Fulfulde, Manding, Lingala).
  - Multilingual localized interface switching (Arabic, Amharic, Swahili, Hausa, French, Portuguese, English).
- **Data Hook**: `motherTonguesAudioData.ts`, `africanLinguisticTypology.ts`, `africaliaGeographyData.ts`.

### 9. `HeritageView.tsx` — UNESCO World Heritage & Sacred Cultural Sites
- **Core Function**: Spatial directory of all 145+ UNESCO World Heritage Sites across Africa.
- **Key Modules**:
  - Interactive map markers categorized by Cultural, Natural, and Mixed heritage criteria.
  - Ecological Biome Classification: Comprehensive mapping across 7 distinct African biomes (*Hyper-Arid Erg*, *Congo Basin Rainforest*, *Coastal Atolls*, *Savanna Delta*, *Afroalpine Montane*, *Cape Floral Mediterranean*, *Equatorial Biosphere*).
  - Rich Ecological Slide Panel: High-performance animated slide-over panel powered by `framer-motion` (`AnimatePresence`) for exploring biomes with real-time site counters, ecological descriptions, and responsive filter selection.
  - Danger status indicators for sites threatened by armed conflict or climate change, with historical danger inscription alerts.
  - Detailed site dossiers with historical significance, year of inscription, and photo galleries.
- **Data Hook**: `unescoHeritageRegistry.ts`, `unescoHeritageSites.json`.

### 10. `CompareView.tsx` — Side-by-Side Bilateral Country Benchmarking
- **Core Function**: Comparative benchmarking tool allowing direct side-by-side analysis between any two African nations.
- **Key Modules**:
  - Comparative KPI delta cards calculating percentage differentials.
  - Overlay radar polygons illustrating comparative strengths and developmental deficits.
  - Synchronized historical timeline comparison across 2015–2024 indicator metrics.
- **Data Hook**: `worldBankComprehensiveData.ts`, `africaData.ts`.

### 11. `EthnicTreeOfLifeView.tsx` — Ancestral Phylogenetic & Ethno-Linguistic Tree
- **Core Function**: Curated genealogical and ethno-linguistic tree visualization mapping 310+ African ethnic groups.
- **Key Modules**:
  - Interactive radial cladogram rooted in anatomical modern human origins in East/Southern Africa.
  - Deep ancestry lineages (L0, L1, L2, L3 mitochondrial haplogroups and E1b1a/E1b1b Y-DNA lineages).
  - Wikipedia ethnic dossier overlay with curated cultural, migratory, and linguistic histories.
- **Data Hook**: `authenticEthnicTreeSvg.ts`, `africaliaMasterTreeData.ts`.

### 12. `SlaveTradeView.tsx` — Transatlantic & Intra-American Slave Voyages Atlas
- **Core Function**: Dedicated research environment documenting four centuries of forced maritime extractions (1514–1866).
- **Key Modules (The 15-Subtab Architecture)**:
  - `01 — overview`: Executive research foundations featuring high-contrast headline statistics, top-header integrated paleogenomics (*Molecular Legacies*) and development history (*Foundations of African Development*) monograph cards, an interactive Flow Map launchpad gateway, 8-coast embarkation demographic distribution matrix (12.5M captives), gateways to the Historical Iconography Archive and Archival Cartography & Currents GIS, century-by-century time series charts, and historical milestones timeline.
  - `02 — flow-map`: Dedicated standalone GIS workstation for the Interactive Atlantic Geodesic Network (`AtlanticFlowMap.tsx`), rendered edge-to-edge with hidden application footer, header-integrated Route Seasonality Simulator sliding panel with spring physics, and full-screen controls.
  - `03 — ports`: African Forts & Coastal Enclaves Map with 47 calibrated embarkation ports, 8 historical coastal corridors, and collision-free dynamic radar minimap.
  - `04 — essays`: Scholarly historiographical introductions (Eltis, Richardson, Behrendt).
  - `05 — voyages`: 36,108 voyage records searchable database with multi-parameter filtering.
  - `06 — routes`: Middle Passage routes and historical shipboard mortality rates across oceanic tracks.
  - `07 — people`: 91,491 liberated Africans names registry documented from Vice-Admiralty court records.
  - `08 — enslavers`: Commercial syndicates, trading companies, and investor directories.
  - `09 — analytics`: Demographic ratios (men, women, children) and voyage durations.
  - `10 — query`: Academic query builder with BibTeX, Chicago, APA, and Harvard citation generator.
  - `11 — methodology`: Epistemic status framework (Observed vs. Imputed vs. Historical Estimates).
  - `12 — molecular`: Interdisciplinary paleogenomics synthesis (50,000+ genomes, IBD deconvolution, Maroon retention).
  - `13 — foundations`: Macro-historical development monograph (Nunn mistrust scar, Henn-Robinson governance, 2026 UN Resolution).
  - `14 — iconography`: Digital museum repository of 1,252 archival plates, Middle Passage plans, and Castas paintings.
  - `15 — cartography`: Archival antique cartography curtain viewer (1688–1851) and 60fps ocean current particle field.
- **Data Hook**: `slaveVoyagesData.ts`, `slaveVoyagesPorts.ts`.

### 13. `IconographyView.tsx` — Archival Visual Iconography Archive
- **Core Function**: Digital museum archive of 1,252 historical plates, prints, and maps.
- **Key Modules**:
  - 1,220 Middle Passage naval architectural diagrams, court evidence, and plantation sketches.
  - 32 Colonial *Pintura de Castas* paintings (Miguel Cabrera, Andrés de Islas, José de Páez).
  - High-precision archival image viewer (`ArchivalImageViewer.tsx`) with smooth pan, zoom, and orientation rotation.
  - Plate metadata dossier with archival provenance, repository source, and scholarly citation export.
- **Data Hook**: `slaveTradeIllustrationsExtended.ts`, `castasArchive.ts`.

### 14. `ArchivalCartographyView.tsx` — Antique Cartography & Currents GIS
- **Core Function**: Historical cartography GIS viewer with split-screen comparative curtain slider.
- **Key Modules**:
  - Antique map georeferenced overlays (Coronelli 1688, Delisle 1707, Bonne 1780, Tallis 1851).
  - Real-time 60fps HTML5 canvas particle flow simulation of 8 Atlantic and Indian Ocean currents.
  - Seasonal monsoon wind toggles (Q1–Q4) illustrating the historical Swahili dhow trade regimes.
  - Toponym concordance engine comparing colonial and historical place names with modern sovereign entities.
- **Data Hook**: `archivalCartographyData.ts`, `oceanHydrodynamicsService.ts`.

### 15. `MolecularLegaciesArticleView.tsx` — Paleogenomics & Population Genetics
- **Core Function**: Peer-reviewed scientific synthesis on the biological and genomic legacies of the transatlantic slave trade.
- **Key Modules**:
  - Multi-cohort analysis of 50,000+ population genomes utilizing Identity-By-Descent (IBD) haplotype deconvolution.
  - Ancient DNA sequencing benchmarks (Zoutsteeg c. 1660s, St. Helena Liberated African depot c. 1840s).
  - Sex-biased gene flow ledgers demonstrating systemic maternal African retention and paternal European asymmetry.
  - Maroon isolate genomic retention (>98% West African continuity in Suriname Saramaka and Colombian Palenque).
- **Data Hook**: `molecularLegaciesData.ts`.

### 16. `AfricanDevelopmentMasterReportView.tsx` — Foundations of African Development
- **Core Function**: Comprehensive macro-historical report evaluating the deep historical roots of modern African development.
- **Key Modules**:
  - Macro-Geonomics & Recent African Origin (Ashraf-Galor migratory distance curve).
  - Econometric models of the slave trade mistrust legacy (Nathan Nunn's 18M+ captive extraction dataset).
  - Pre-colonial state centralization and decentralized governance (Henn-Robinson institutional persistence).
  - Colonial trade distortions and monopsony price-gap models (Federico Tadei's extractive terms of trade).
  - Landmark March 25, 2026 UN General Assembly Slavery Resolution (123-3).
- **Data Hook**: `africanDevelopmentMasterData.ts`.

### 17. `ResearchReportsDirectoryView.tsx` — Institutional Working Papers Library
- **Core Function**: Academic working papers catalog and research monograph repository.
- **Key Modules**:
  - Filterable by research thematic cluster (Genetics & Linguistics, Colonial Law, Economic History, Reparations).
  - Individual paper cards with formal DOI links, word counts, executive abstracts, and PDF downloads.
  - Integrated CrossRef metadata verification.
- **Data Hook**: `reportsDataLoader.ts`, `reportsData.ts`.

### 18. `ResearchReportArticleView.tsx` — Scholarly Article Longform Reader
- **Core Function**: Academic typography longform reading interface for working papers.
- **Key Modules**:
  - Semantic typography with Noto Serif Display, side marginalia notes, and figure callouts.
  - Text-to-speech audio narration powered by the native voice engine and Gemini speech API.
  - Citation export modal with DOI verification.
- **Data Hook**: `reportsDataLoader.ts`, `africaliaVoiceEngine.ts`.

### 19. `ProvenanceQualityView.tsx` — Data Transparency & Methodology Audit
- **Core Function**: Complete disclosure of multilateral data ingestion methods, status flags, and SHA-256 checksums.
- **Key Modules**:
  - Live Web Crypto SHA-256 verification of all 8 core datasets against published registry hashes.
  - Full audit of observation status flags (`observed`, `imputed`, `estimated`, `derived`).
  - Catalog of 16 multilateral API connectors with protocol specifications and rate limits.
- **Data Hook**: `methodologyDossierData.ts`, `externalApisIngestion.ts`.

### 20. `PrivacySectionView.tsx` — Sovereign Privacy & Zero-Surveillance Charter
- **Core Function**: Transparency portal and client-side storage management.
- **Key Modules**:
  - Zero third-party telemetry, advertising cookies, or cross-site fingerprinting policy disclosure.
  - Client-side storage audit inspecting all keys in browser `localStorage`.
  - Single-click GDPR Article 17 "Right to Erasure" memory wipe utility.
- **Data Hook**: Client-side storage APIs.

### 21. `UniversalStyleGuideView.tsx` — Living Design Constitution & Brand Book
- **Core Function**: Interactive living style guide rendering the Japandi-Sahel design tokens, typography scales, and UI components.
- **Key Modules**:
  - Color swatches for canvas, ink, surfaces, and UN Geoscheme regional palettes.
  - Interactive fluid typography scale inspector (Utopia clamp math from 375px to 1440px).
  - Component showcase (badges, buttons, segmented controls, cards, tooltips).
- **Data Hook**: `docs/UNIVERSAL_STYLE_GUIDE.md`, `src/index.css`.

---

## 🧩 SECTION 3: REUSABLE COMPONENT DIRECTORY (`src/components/`)

### 1. Cartographic & Spatial Engines
- **`AfricaMapFinalLayer.tsx`**: Renders the authentic $5,796 \times 5,867$ SVG continental baseline with 1,017 Admin-1 boundary paths, dynamic country label scaling, and graticule coordinates.
- **`AfricanPortsMap.tsx`**: Museum-grade interactive cartography tool displaying 47 coastal embarkation ports with seaward leader lines, interactive 8-corridor legend deck, dynamic radar minimap, and keyboard panning. Operates as a full-bleed workstation with automatic application footer suppression.
- **`AtlanticFlowMap.tsx`**: Standalone D3/SVG geodesic bezier flow map tracing transatlantic Middle Passage embarkation-to-landing vectors. Runs in a dedicated full-bleed workspace with edge-to-edge canvas geometry, hidden application footer, high-performance interactive flight paths, and a sleek, spring-animated Route Seasonality Simulator sliding panel toggled directly from the internal map canvas toolbar adjacent to the Back to Overview navigation control.
- **`AfricaVectorContinent.tsx`**: Lightweight standalone vector continent supporting `silhouette`, `regions`, and `countries` rendering modes with custom country color mapping callbacks.
- **`ActualSvgOverlayViewer.tsx`**: High-resolution zoomable viewer for the master Ethnic Tree of Life vector cladogram.
- **`HistoricalMapCurtainViewer.tsx`**: Interactive split-screen curtain slider comparing georeferenced antique historical maps against modern borders.
- **`OceanCurrentParticleCanvas.tsx`**: 60fps HTML5 canvas particle vector field modeling the 8 primary Atlantic and Indian Ocean currents.

### 2. Layout, Navigation & Chrome
- **`Navbar.tsx`**: Accessible header containing brand typography, global search trigger, multilateral API hub button, theme switcher, language selector, and mobile drawer hamburger.
- **`NavigationDrawer.tsx`**: Desktop collapsible rail navigation (`w-72` to `w-[68px]`) with auto-collapse rules on intensive workspaces and accessible mobile bottom sheet modal. Features a restructured navigation hierarchy: Section 5 **Culture** (`Landmark` icon) grouping UNESCO World Heritage Sites and Living Language Phyla; and Section 6 **Analytics** housing Comparative Benchmarks, the UN Geoscheme Macro-Region Matrix, and Continental GIS Cartography.
- **`Footer.tsx`**: High-contrast, clean footer containing scholarly copyright, Figshare DOI link, dual-licensing badges, and quick links. Auto-concealed when intensive full-bleed GIS workspaces (`flow-map`, `ports`) are active.
- **`MainContentSkeleton.tsx`**: Layout-shift-free loading skeleton customized for dashboard, map, and article layouts.
- **`ProgressiveDisclosure.tsx`**: Accessible accordion component for complex analytical dossiers.

### 3. Modals & Specialized Drawers
- **`CountryFactsheetModal.tsx`**: Modal generating a high-density, printable sovereign country factsheet with macroeconomic indicators and radar charts.
- **`VoyageDossierModal.tsx`**: Deep-dive archival modal for individual historical slave voyages with crew logs, resistance events, and shipboard mortality.
- **`ArchivalLoupeModal.tsx`**: Magnifying inspection loupe for high-resolution iconography plates and colonial cartography.
- **`MultiSourceApiHubModal.tsx`**: Multilateral API integration hub with live connector test triggers, status telemetry, and latency monitors.
- **`AfcftaSimulatorModal.tsx` & `AfcftaTradeCorridorSimulator.tsx`**: Trade simulator evaluating bilateral tariff elimination scenarios, transit corridor logistics, and strategic critical mineral supply chains.
- **`DoiVerificationModal.tsx`**: Cryptographic DOI and persistent identifier verification dialogue.
- **`KeyboardShortcutsModal.tsx`**: Accessible cheat sheet detailing all keyboard shortcuts across the application.
- **`SearchModal.tsx`**: Universal fuzzy search modal indexing 54 countries, 90+ indicators, ethnic groups, and historical voyages.

---

## ⚙️ SECTION 4: SERVICES & UTILITIES (`src/services/` & `src/utils/`)

### Services
1. **`crossrefService.ts`**: Queries the CrossRef REST API (`https://api.crossref.org/works/`) to fetch real-time scholarly citation counts, bibliographic metadata, and peer-reviewed publication records.
2. **`oceanHydrodynamicsService.ts`**: Physics calculation engine computing velocity vectors and directional drift matrices for the 8 primary African maritime currents and seasonal monsoon cycles.
3. **`slaveVoyagesApi.ts`**: Client-side query and filtering engine for the 36,108 voyage records, managing epistemic certainty modes (`observed` vs. `imputed`).
4. **`weatherService.ts`**: Fetches contemporary meteorological observations and precipitation anomalies for African capital cities.
5. **`wikipediaService.ts`**: Integration service providing cached summaries and cultural histories for African ethnic groups, linguistic phyla, and regional economic communities.

### Utilities
1. **`academicExport.ts`**: Generates standardized academic citations formatted in APA 7th, Chicago 17th (Author-Date), Harvard, and BibTeX.
2. **`africaliaVoiceEngine.ts`**: High-quality speech synthesis engine coordinating browser Web Speech API and Gemini audio streams for article narration.
3. **`assetPath.ts`**: Resolves base paths across development preview, production subdirectories, and GitHub Pages deployments.
4. **`indexedDbSearch.ts`**: Fast, client-side IndexedDB full-text indexing engine for offline voyage searches.
5. **`lazyWithRetry.tsx`**: Resilient dynamic import wrapper that handles network interruptions during chunk fetching with automatic retry logic.
6. **`nativeTranslationBridge.ts`**: Bi-directional translation helper interfacing with localized dictionaries for Swahili, Hausa, Arabic, and Amharic.

---

## 🌐 SECTION 5: EXTERNAL MULTILATERAL API CONNECTORS

The application integrates 16 multilateral and institutional open-data connectors documented in `src/data/externalApisIngestion.ts`:

| Connector Name | Acronym | Organization | Protocol / Format | Sample Endpoint |
| :--- | :--- | :--- | :--- | :--- |
| **Freedom in the World** | `FH_FIW` | Freedom House | REST / JSON | `https://freedomhouse.org/api/v1/fiw/country/{iso3}/latest` |
| **Worldwide Governance Indicators** | `WGI` | World Bank / Brookings | REST / JSON | `https://api.worldbank.org/v2/country/{iso3}/indicator/VA.PER.RNK?format=json` |
| **World Bank WDI** | `WB_WDI` | World Bank Group | REST / JSON | `https://api.worldbank.org/v2/country/{iso3}/indicator/{indicator}?format=json` |
| **Poverty & Inequality Platform** | `WB_PIP` | World Bank Group | REST / JSON | `https://api.worldbank.org/pip/v1/pip?country={iso3}&year=2022&format=json` |
| **Africa Integrity Indicators** | `AII` | Global Integrity / Mo Ibrahim | REST / JSON | `https://integrity.globalintegrity.org/api/v2/africa` |
| **World Bank Gender Data** | `WB_GENDER` | World Bank Group | REST / JSON | `https://api.worldbank.org/v2/sources/14/country/{iso3}/data?format=json` |
| **Global Health Observatory** | `WHO_GHO` | World Health Organization | OData / REST | `https://ghoapi.azureedge.net/api/{dimension}` |
| **UNESCO Institute for Statistics** | `UNESCO_UIS` | UNESCO | SDMX 2.1 / JSON | `https://api.uis.unesco.org/sdmx/v2/data/UNESCO,EDU_NON_FINANCE` |
| **International Monetary Fund** | `IMF_WEO` | IMF | SDMX / JSON | `https://dataservices.imf.org/REST/SDMX_JSON.svc/CompactData/WEO/` |
| **UN Comtrade** | `UN_COMTRADE` | United Nations Statistics Div. | REST / JSON | `https://comtradeapi.un.org/public/v1/preview/C/A/HS` |
| **SlaveVoyages Consortium** | `TAST_DB` | SlaveVoyages Consortium | REST / JSON | `https://api.slavevoyages.org/voyage/database` |
| **UNCTADstat Maritime** | `UNCTAD_MAR`| UNCTAD | SDMX / JSON | `https://unctadstat-api.unctad.org/api/v1/` |
| **Climate Change Portal** | `WB_CCKP` | World Bank Group | REST / JSON | `https://cckpapi.worldbank.org/cckp/v1/` |
| **AfDB Data Portal** | `AFDB_AIH` | African Development Bank | REST / JSON | `https://dataportal.opendataforafrica.org/api/` |
| **FAOSTAT Agriculture** | `FAOSTAT` | FAO | REST / JSON | `https://fenixservices.fao.org/faostat/api/v1/` |
| **Mo Ibrahim Governance** | `IIAG` | Mo Ibrahim Foundation | REST / CSV | `https://mo.ibrahim.foundation/iiag/data/` |

---

## 🔒 SECTION 6: BACKEND SERVER ARCHITECTURE (`server.ts`)

The application includes an Express 4 backend running on Node.js 22 (`server.ts`):
- **`/api/health`**: Healthcheck and dependency status telemetry.
- **`/api/ingest/status`**: Ingestion engine diagnostics reporting connector health, canonical entity counts, and active cache layers.
- **`/api/research/dataset-raw`**: Serves raw binary buffers of the 8 tracked foundational datasets, enabling the browser Web Crypto API to calculate independent SHA-256 hashes on the client.
- **`/api/ingest/test-connector`**: Server-side proxy handling cross-origin requests (CORS bypass) and latency timing when probing multilateral API feeds.
- **`/api/tts/synthesize` & `/api/tts/status`**: Gemini Speech API proxy converting academic article text into speech audio streams with in-memory caching.
- **Vite Integration**: Mounts Vite development middlewares in local execution (`vite.middlewares`) and serves production assets from `dist/` in deployment.

---

## 🎨 SECTION 7: DESIGN TOKENS, TYPOGRAPHY & ACCESSIBILITY SPECIFICATION

### 1. The Japandi-Sahel & TAST Color Constellations
- **Parchment Surface (Light)**: `--surface-canvas: #FAF8F5`, `--bg-primary: #FAF6EE`.
- **Obsidian Surface (Dark)**: `--surface-canvas: #0F1218`, `--surface-card: #181D26` (+5.5% lightness elevation step).
- **Ink Primary (Light)**: `--text-primary: #191816` (Sumi Ink, >16:1 contrast over canvas, WCAG AAA).
- **Ink Primary (Dark)**: `--text-primary: #F8FAFC` (>17:1 contrast over slate, WCAG AAA).

### 2. Three-Family Typographic Hierarchy
- **Editorial Display**: `Noto Serif Display` (600, 700, 800) for titles, historic enclaves, and monograph headers.
- **Interface & Prose**: `Plus Jakarta Sans` (400, 500, 600, 700) for all functional UI and body paragraphs.
- **Tabular Data**: `JetBrains Mono` (500, 700, 800) for captive metrics (`+12M`), coordinates, and years.

### 3. Binding Quality Standard (`docs/UNIVERSAL_AUDIT_SPECIFICATION.md`)
- Strict split-viewer proportional invariants (`w-7/12 xl:w-2/3` canvas vs. `w-5/12 xl:w-1/3` drawer).
- Zero-Pill discipline: Plain text with typographical interpuncts (`·`) for passive metadata.
- Universal keyboard cartography controls (Arrow keys for panning, `+`/`-` zoom, `0` reset, `F` fullscreen).
- High-contrast `:focus-visible` rings with a 2px offset.
- System motion compliance (`@media (prefers-reduced-motion: reduce)`).

---

*Catalog compiled for the Africalia Observatory • Permanent Engineering Documentation Reference*
