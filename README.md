# 🌍 Africa Data Atlas & Geopolitical Intelligence Platform

An authoritative, real-time socioeconomic data platform, interactive vector cartography suite, historical trade flow visualizer, and comparative analytics engine covering all 54 African sovereign nations and associated territories.

[![React 19](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite 6](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_Enabled-success?style=flat-square&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

[![Deploy to GitHub Pages](https://github.com/zeluis/Africa-Digital-Atlas/actions/workflows/deploy.yml/badge.svg)](https://github.com/zeluis/Africa-Digital-Atlas/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-064e3b?style=flat&logo=github)](https://zeluis.github.io/Africa-Digital-Atlas/)

<div align="center">
  <img src="public/hero-preview.jpg" alt="Africa Data Atlas & Intelligence Platform Interface" width="100%" style="border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);" />
  <p><em>Interactive vector cartography, macroeconomic indicators, 3D historical voyage flows, and multi-source multilateral data ingestion.</em></p>
</div>

---

## Live Application

The production application is deployed on GitHub Pages:
**[Launch Africa Digital Atlas Live](https://zeluis.github.io/Africa-Digital-Atlas/)**

---

## 📑 Table of Contents

1. [Executive Overview](#-executive-overview)
2. [Key Capabilities & Feature Modules](#-key-capabilities--feature-modules)
   - [Interactive Vector Cartography Stage](#1-interactive-vector-cartography-stage)
   - [Transatlantic Slave Voyages 3D Globe & Spatiotemporal Engine](#2-transatlantic-slave-voyages-3d-globe--spatiotemporal-engine)
   - [Country Dossiers & Comprehensive National Profiles](#3-country-dossiers--comprehensive-national-profiles)
   - [Comparative Analytics & Correlation Engine](#4-comparative-analytics--correlation-engine)
   - [Regional Geopolitical & Economic Blocs (RECs)](#5-regional-geopolitical--economic-blocs-recs)
   - [Multilateral Data APIs & Ingestion Hub (16 Active Connectors)](#6-multilateral-data-apis--ingestion-hub-16-active-connectors)
   - [Data Provenance, Quality Audits & Cryptographic Verification](#7-data-provenance-quality-audits--cryptographic-verification)
   - [Visual Identity & Japandi Design System](#8-visual-identity--japandi-design-system)
3. [Indicators & Multilateral Data Sources Catalog](#-indicators--multilateral-data-sources-catalog)
4. [SVG Geography Engine & Projection Geometry](#-svg-geography-engine--projection-geometry)
5. [Multilingual Translation Engine (i18n)](#-multilingual-translation-engine-i18n)
6. [Offline PWA Architecture & Caching Strategy](#-offline-pwa-architecture--caching-strategy)
7. [Technology Stack & Architecture](#-technology-stack--architecture)
8. [Installation & Local Development](#-installation--local-development)
9. [Deployment & Production Builds](#-deployment--production-builds)
10. [Official Scalable SVG Vectors & Institutional Logos Catalog](#️-official-scalable-svg-vectors--institutional-logos-catalog)
11. [Academic Citations & Data Governance](#-academic-citations--data-governance)
12. [Roadmap & Enhancement Suggestions](#-roadmap--enhancement-suggestions)

---

## 🌟 Executive Overview

### What is the Africa Data Atlas?
The **Africa Data Atlas** is a pan-African geospatial intelligence platform and research workspace. It consolidates complex macroeconomic indicators, demographic shifts, health metrics, educational outcomes, energy development trajectories, climate vulnerability indices, and historical maritime records across the African continent into an accessible web interface.

### Why does it matter?
Understanding Africa's demographic and economic trajectory is critical for policymakers, academic researchers, international development organizations, investors, and educators. Too often, pan-African data is fragmented across disparate international agencies, published behind paywalls, or presented through rigid reporting tools that obscure cross-regional correlations. The Africa Data Atlas bridges this gap by unifying **16 multilateral and international open data APIs** into a single harmonized schema, paired with zero-latency vector cartography, interactive 3D WebGL visualizations, and multi-country benchmarking tooling.

### Scope at a Glance:
- **54 Sovereign Nations & Island States**: Complete geospatial and statistical coverage across Northern, Western, Central, Eastern, and Southern Africa.
- **Over 90 Harmonized Indicators**: Spanning macroeconomic accounts, poverty lines, external debt stocks, governance ratings, gender equity, climate projections, and trade balances.
- **36,000+ Documented Historical Voyages**: 3D globe and spatiotemporal flow visualizer charting the transatlantic slave trade from 1501 to 1867.
- **100% Offline-Capable PWA**: Service Worker caching of vector geometries, baseline observations, and styling for low-bandwidth field environments.

---

## 🚀 Key Capabilities & Feature Modules

### 1. Interactive Vector Cartography Stage
The core cartographic viewport renders pure SVG path geometries calibrated specifically for the African continental landmass and surrounding island archipelagos:

- **Mathematical Quantile & Diverging Choropleths**: Dynamically scales colors across selected indicators (e.g., GDP per Capita, Human Development Index, Renewable Energy Share, Fragility Index) using quantile and linear interpolation palettes.
- **Micro-State & SIDS Precision Locators**: Small Island Developing States (Cabo Verde, São Tomé and Príncipe, Comoros, Mauritius, and Seychelles) feature dedicated high-contrast visual callout rings with enlarged click targets (minimum 44px) to ensure effortless interaction on touchscreens.
- **Geodesic Viewport Controls**: Smooth zoom, drag-to-pan, and one-click subregional focus presets (**All Africa**, **North Africa**, **West Africa**, **Central Africa**, **East Africa**, and **Southern Africa**).
- **Interactive Tooltips**: High-contrast, floating inspection cards rendering localized country names, capital cities, primary indicator values, regional rankings, and quality verification badges on hover.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        VECTOR CARTOGRAPHY STAGE                        │
│                                                                        │
│   [Subregion Filters]   [Indicator Dropdown]   [Density: Standard]     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │      * NORTH AFRICA (DZA, EGY, LBY, MAR, TUN, SDN)               │  │
│  │                                                                  │  │
│  │  * WEST AFRICA            * CENTRAL AFRICA      * EAST AFRICA    │  │
│  │   (CPV, SEN, GHA, NGA...)   (CMR, COD, GAB...)    (ETH, KEN...)  │  │
│  │                                                                  │  │
│  │                     * SOUTHERN AFRICA                            │  │
│  │                      (ZAF, BWA, NAM, MOZ...)                     │  │
│  │                                                                  │  │
│  │   [O Cabo Verde]              [O Seychelles]  [O Mauritius]      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  Choropleth Scale: [Min: $620] ─── (Quantile) ─── [Max: $19,800]       │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Transatlantic Slave Voyages 3D Globe & Spatiotemporal Engine
A dedicated historical research subsystem visualizing the historical transatlantic slave trade using data derived from the *Slave Voyages* research consortium:

- **Interactive 3D Orthographic Globe**: Built with canvas-based orthographic geodesic projections allowing researchers to rotate, pitch, and inspect intercontinental maritime trajectories connecting African coastal embarkation zones (e.g., Bight of Benin, Gold Coast, Senegambia, West Central Africa) to destination ports in Brazil, the Caribbean, and North America.
- **Animated Great-Circle Flow Arcs**: Dynamic, particle-animated bezier flow vectors whose stroke width and velocity represent total documented captive volumes over selected historical epochs.
- **Spatiotemporal Timeline Scrubber**: Interactive historical filter covering four centuries (**1501–1600**, **1601–1700**, **1701–1800**, **1801–1867**), allowing users to observe the geopolitical rise and decline of various imperial flag carriers (Portugal/Brazil, Great Britain, France, Netherlands, Spain, USA).
- **Academic Export Workbench**: Instant generation and download of raw voyage data in **CSV** format and complete academic literature citations in **BibTeX** format.

```
                     TRANSATLANTIC MARITIME FLOW ENGINE
                     
         [NORTH AMERICA]                         [EUROPE]
                ^                                   │
                 \   (British / French Fleets)      │
                  \                                 v
         [CARIBBEAN] <══════════════════════ [BIGHT OF BENIN]
                ^                                   │
                │    (Portuguese / Luso-Brazilian)  │
                v                                   v
         [BRAZIL] <═════════════════════════ [WEST CENTRAL AFRICA]
                     (36,000+ Recorded Voyages)
```

---

### 3. Country Dossiers & Comprehensive National Profiles
Selecting any country opens an in-depth dossier presenting verified structural data:

- **Geographic & Political Metadata**: ISO-3166-1 alpha-3 code, capital city coordinates, official and national languages, currency denomination and ISO-4217 currency codes, total land area in square kilometers, sovereign status, and United Nations Geoscheme classification.
- **Longitudinal Socioeconomic Trajectories**: Multi-decade sparklines and interactive time-series charts showing GDP growth rates, fertility trends, electrification progress, and life expectancy.
- **Linguistic Architecture**: Hierarchical categorization mapping national languages to primary African language phyla (*Niger-Congo*, *Afroasiatic*, *Nilo-Saharan*, *Khoisan*, and *Austronesian*).
- **UNESCO World Heritage Repositories**: Integrated inventory of cultural, natural, and mixed World Heritage Sites for each country.

---

### 4. Comparative Analytics & Correlation Engine
The Analytics module provides policy analysts and economists with quantitative comparison tools:

- **Bi-Variable Correlation Scatter Plots**: Plot any two indicators against each other (e.g., *GDP per Capita* vs. *Female Secondary Education Enrollment*, or *Renewable Energy Capacity* vs. *CO₂ Emissions per Capita*). The engine calculates the **Pearson correlation coefficient ($r$)**, trendline slope, and automatically identifies regional clusters and outlier nations.
- **Multi-Country Radar Pillar Comparison**: Select up to 4 countries simultaneously to render a normalized multi-axis radar chart contrasting them across core development pillars: **Economic Output**, **Governance & Rule of Law**, **Healthcare Access**, **Digital Infrastructure**, **Education Equity**, and **Climate Resilience**.
- **Rankings & Quantile Leaderboards**: Sortable leaderboards with ascending/descending ordering, subregional filtering, and distribution histograms.

---

### 5. Regional Geopolitical & Economic Blocs (RECs)
The atlas models pan-African regional integration by organizing countries into recognized regional economic communities and geopolitical groupings:

- **African Union (AU)**: Continental membership baseline.
- **The 8 Recognized Regional Economic Communities (RECs)**:
  - **ECOWAS** (Economic Community of West African States)
  - **EAC** (East African Community)
  - **SADC** (Southern African Development Community)
  - **COMESA** (Common Market for Eastern and Southern Africa)
  - **AMU** (Arab Maghreb Union)
  - **ECCAS** (Economic Community of Central African States)
  - **IGAD** (Intergovernmental Authority on Development)
  - **CEN-SAD** (Community of Sahel-Saharan States)
- **Monetary & Trade Blocs**: **AfCFTA** (African Continental Free Trade Area), **CEMAC** (Central African Economic and Monetary Community), **UEMOA** (West African Economic and Monetary Union), and African member states of **BRICS+**.
- **Bloc Aggregations**: Calculated weighted averages for population, aggregate GDP, average tariff rates, and internal trade penetration.

---

### 6. Multilateral Data APIs & Ingestion Hub (16 Active Connectors)
A dedicated API ingestion subsystem standardizes data feeds from 16 international institutions. Accessible directly via the **"16 DATA APIs"** button in the navigation bar:

- **Live Handshake & Latency Testing**: Users and administrators can trigger real-time ping requests against external API endpoints (or validated fallback caches) to inspect response status codes, payload sizes (in bytes), and millisecond latency.
- **Dynamic Category Filtering**: Browse connectors across *Governance & Rights*, *Macro & Debt*, *Social & Health*, *Education & Science*, *Climate & Environment*, and *Trade & Competitiveness*.
- **Direct Indicator Routing**: Click any indicator badge within the API Hub to load that metric directly into the Cartography Stage and Analytics views.
- **JSON API Manifest Export**: Download a full diagnostic specification of all registered API connectors and active indicator keys.

---

### 7. Data Provenance, Quality Audits & Cryptographic Verification
To ensure academic credibility and transparency, the platform includes a **Provenance & Data Quality Console**:

- **Real-Time Automated Integrity Audits**: Verifies all 54 sovereign entities against the indicator store, detecting potential statistical anomalies, missing values, or outlier bounds.
- **Cryptographic Hash Verification**: Calculates deterministic SHA-256 integrity hashes for indicator subsets, guaranteeing that data records have not been tampered with or corrupted during runtime execution.
- **Quality Flags & Footnotes**: Flags observations that rely on modeled statistical estimates, imputation, or lagged census reporting.
- **Academic Citation Generator**: Generates formatted citations for APA, Harvard, Chicago, and BibTeX standards for any dataset or national profile.

---

### 8. Visual Identity & Japandi Design System
The UI adheres to a refined **Japandi aesthetic**—blending Japanese minimalism with Scandinavian functionalism:

- **Organic Warm Palette**: Rooted in warm, natural neutrals (`#FAF8F5` light canvas, `#121310` dark canvas, with terracotta `#D97706`, sage `#059669`, and deep slate accents).
- **Strict WCAG AA Accessibility**: All text-to-background contrast ratios strictly meet or exceed 4.5:1 for body copy and 3:1 for large headers.
- **Typographic Hierarchy**: Paired display typography (*Syne* / *Plus Jakarta Sans*) with high-legibility regional fonts (*Noto Sans Arabic*, *Noto Sans Ethiopic*).
- **Dynamic Density Switching**: A persistent density toggle allows users to switch between three spatial display modes:
  - **Compact**: Maximizes data density for multi-monitor workstations and intensive analytical audits.
  - **Standard**: The default balanced configuration with generous optical padding.
  - **Spacious**: Relaxed touch-friendly layout optimized for presentations, tablets, and kiosks.

---

## 📊 Indicators & Multilateral Data Sources Catalog

The Africa Data Atlas harmonizes data across **16 international connectors** and **over 90 indicators**. Below is the complete catalog of integrated sources:

| Connector / Source | Sponsoring Organization | Category | Coverage / Indicators Provided | Primary Documentation Link |
| :--- | :--- | :--- | :--- | :--- |
| **FH_FIW** | Freedom House | Governance & Rights | Civil Liberties Score (0–60), Political Rights (0–40), Global Freedom Status (F/PF/NF) | [Freedom House API](https://freedomhouse.org/report/freedom-world) |
| **WGI** | World Bank & Brookings | Governance & Rights | Rule of Law, Control of Corruption, Government Effectiveness, Voice & Accountability, Regulatory Quality, Political Stability | [World Bank WGI](https://info.worldbank.org/governance/wgi/) |
| **AII** | Global Integrity | Governance & Rights | Judicial Independence Index, Anti-Corruption Agency Autonomy, Public Asset Disclosure Frameworks | [Africa Integrity Indicators](https://www.globalintegrity.org/) |
| **WB Gender** | World Bank Group | Social & Labor | Female Labor Force Participation (%), Maternal Mortality Ratio (per 100k), Gender Wage Gap Index | [WB Gender Data Portal](https://genderdata.worldbank.org/) |
| **Scorecard** | World Bank Group | Macro & Operations | Multi-Sector Development Outcome Index, IDA Operational Delivery Efficiency Score | [WB Corporate Scorecard](https://scorecard.worldbank.org/) |
| **GSAP** | World Bank & UNSD | Governance & Stats | Statistical Capacity Index (0–100), Open Data Openness Score, Civil Registration Completeness | [Global Statistical Action Plan](https://www.worldbank.org/en/programs/statistical-capacity) |
| **SPID** | World Bank & ILO | Social & Labor | Social Safety Net Coverage (% of poorest quintile), Social Insurance Penetration, Active Labor Market Programs | [Social Protection & Labor](https://datacatalog.worldbank.org/) |
| **WHO GHO** | World Health Organization | Health & Nutrition | Universal Health Coverage (UHC) Index, Under-5 Mortality Rate (per 1k), Primary Healthcare Physicians (per 10k) | [WHO GHO OData API](https://www.who.int/data/gho) |
| **UNESCO UIS** | UNESCO | Education & Science | Primary School Completion Rate (%), Adult Literacy Rate (%), Gross Domestic R&D Expenditure (% of GDP) | [UNESCO Institute for Statistics](https://uis.unesco.org/) |
| **WB PIP** | World Bank | Poverty & Equity | International Poverty Headcount ($2.15/day PPP), National Poverty Headcount (%), Gini Inequality Coefficient | [WB Poverty & Inequality Platform](https://pip.worldbank.org/) |
| **ASPIRE** | World Bank Group | Social & Equity | Social Assistance Transfer Adequacy (% of beneficiary income), Poverty Reduction Impact of Social Transfers (%) | [World Bank ASPIRE](https://www.worldbank.org/en/topic/socialprotection/brief/aspire) |
| **WB IDS** | World Bank | Macro & Debt | Total External Debt Stock (Current US$), External Debt-to-GNI Ratio (%), Public External Debt Service (% of exports) | [International Debt Statistics](https://databank.worldbank.org/source/international-debt-statistics) |
| **UN Comtrade** | United Nations Statistics Division | Trade & Commerce | Total Merchandise Exports (US$), Non-Resource Export Share (%), Intra-African Trade Volume (AfCFTA Flow) | [UN Comtrade API v1](https://comtradeapi.un.org/) |
| **IMF WEO** | International Monetary Fund | Macroeconomics | Real GDP Annual Growth Forecast (%), General Government Gross Debt (% of GDP), Consumer Price Inflation Rate (%) | [IMF Data Portal / SDMX](https://www.imf.org/en/Data) |
| **WB CPIA** | World Bank Group | Policy & Institutions | Economic Management Cluster (1–6), Structural Policies Cluster (1–6), Social Inclusion/Equity (1–6), Public Sector Management (1–6) | [World Bank CPIA](https://datacatalog.worldbank.org/dataset/country-policy-and-institutional-assessment) |
| **WB Climate** | World Bank (CCKP) | Climate & Energy | Mean Annual Temperature Projections (°C change), Drought Risk Vulnerability Index, Renewable Energy Capacity (% of grid) | [Climate Change Knowledge Portal](https://climateknowledgeportal.worldbank.org/) |

---

## 🗺️ SVG Geography Engine & Projection Geometry

The cartographic engine avoids heavyweight raster map tiles (e.g., Mapbox or Google Maps) in favor of **pure mathematical SVG vector topology**:

### 1. Coordinate Space & Boundary Normalization
- **Viewport Dimensions**: Calibrated SVG coordinate space (`viewBox="45 50 900 1000"`), tailored to capture Africa's exact geographic envelope from Cape Blanc (Tunisia) in the north to Cape Agulhas (South Africa) in the south, and from Santo Antão (Cabo Verde) in the west to Rodrigues (Mauritius) in the east.
- **Topological Precision**: Built from verified TopoJSON boundaries with simplified polygon vertices to deliver sub-millisecond DOM render times while maintaining recognizable coastal, riverine, and border contours.

### 2. Micro-State Island Callout Projection
Small island states in the Atlantic and Indian Oceans are difficult to target on standard continental projections. The SVG engine incorporates dedicated **Geodesic Micro-State Anchors**:
- **Cabo Verde**: Positioned at western anchor coordinates `[140, 360]`
- **São Tomé and Príncipe**: Positioned in the Gulf of Guinea at `[340, 560]`
- **Comoros**: Positioned in the Mozambique Channel at `[780, 680]`
- **Mauritius**: Positioned in the Southwest Indian Ocean at `[910, 770]`
- **Seychelles**: Positioned in the Western Indian Ocean at `[890, 580]`

Each island anchor renders an interactive pulse target with full state synchronization (hover, selection, choropleth coloring, and tooltip binding).

---

## 🌐 Multilingual Translation Engine (i18n)

The platform features an embedded, zero-dependency multilingual internationalization engine (`src/i18n.ts`):

- **Supported Languages**:
  - 🇬🇧 **English (EN)** — Default international lingua franca
  - 🇫🇷 **French (FR)** — Official administrative tongue across West & Central Africa
  - 🇸🇦 **Arabic (AR)** — Official language across North Africa & the Horn of Africa, with dynamic **Right-to-Left (RTL)** layout switching
  - 🇵🇹 **Portuguese (PT)** — Official language for PALOP nations (Angola, Mozambique, Guinea-Bissau, Cabo Verde, São Tomé)
  - 🇹🇿 **Swahili (SW)** — Major regional trade language of the East African Community (EAC)
  - 🇪🇸 **Spanish (ES)** — Official language of Equatorial Guinea
  - 🇩🇪 **German (DE)** — Standard international research locale

- **Dynamic Number & Currency Localization**: Formatting of GDP numbers, population counts, percentages, and currencies automatically adapts to the chosen language (e.g., `,` vs. `.` decimal separators, Latin vs. Arabic numerals).

---

## 📱 Offline PWA Architecture & Caching Strategy

The Africa Data Atlas is configured as a fully compliant **Progressive Web App (PWA)**, engineered for resilience in low-bandwidth or offline environments:

```
                               PWA SERVICE WORKER ARCHITECTURE
                               
   Browser Request
         │
         ▼
   ┌───────────────┐        Cache Match?
   │ Service Worker│ ────────────────────────► Return Cached Geometry / Asset
   │    (sw.js)    │                                (Zero Latency)
   └───────────────┘
         │ (Cache Miss)
         ▼
   ┌───────────────┐
   │ Fetch Network │ ───► [Live World Bank / IMF API]
   └───────────────┘             │
         │ (Network Success)     │ (Network Failure / Offline)
         ▼                       ▼
    Update Cache         Serve Embedded Static Baseline
```

### Multi-Tiered Caching Strategy:
1. **Cache-First (Immutable Assets)**: Pre-caches the core SVG geographic geometries, web fonts (Plus Jakarta Sans, Noto Sans), and static icon bundles.
2. **Stale-While-Revalidate (Application Shell)**: Ensures instant application startup while asynchronously checking for newer bundle releases in the background.
3. **Network-First with Deterministic Fallback (API Calls)**: Attempts live queries against multilateral APIs; if the user is offline or the remote server times out, the engine seamlessly serves verified historical baseline observations without displaying broken UI states.
4. **App Manifest (`manifest.json`)**: Configures standalone display mode, maskable home screen icons (192px and 512px), theme colors (`#121310`), and deep-link shortcuts.

---

## 💻 Technology Stack & Architecture

```
+------------------------------------------------------------------------------------+
|                                    USER INTERFACE                                  |
|  React 19  •  TypeScript 5.8  •  Tailwind CSS v4  •  Motion (Framer)  •  Lucide    |
+------------------------------------------------------------------------------------+
       │                                     │                                │
       ▼                                     ▼                                ▼
+──────────────────────────+   +──────────────────────────+   +──────────────────────+
|    CARTOGRAPHY ENGINE    |   |    ANALYTICS & CHARTS    |   |   3D VOYAGES GLOBE   |
| Pure SVG Path Topology   |   | Recharts Data Visualizer |   | Canvas Orthographic  |
| Geodesic Island Anchors  |   | Bi-Variable Scatter & $r$|   | Great-Circle Vectors |
| Quantile Color Scalers   |   | Radar Pillar Comparisons |   | Time Scrubber Engine |
+──────────────────────────+   +──────────────────────────+   +──────────────────────+
       │                                     │                                │
       └─────────────────────────────────────┼────────────────────────────────┘
                                             │
                                             ▼
+------------------------------------------------------------------------------------+
|                              CANONICAL ATLAS DATA STORE                            |
|    AtlasDataStore Singleton  •  54 Sovereign Entities  •  90+ Harmonized Series   |
|    Integrity Audit Engine    •  SHA-256 Checksums       •  Provenance Metadata     |
+------------------------------------------------------------------------------------+
       │                                     │
       ▼                                     ▼
+──────────────────────────+   +─────────────────────────────────────────────────────+
|   LOCAL OFFLINE CACHE    |   |          16 MULTILATERAL API CONNECTORS             |
| Service Worker (sw.js)   |   | World Bank • IMF WEO • UN Comtrade • WHO GHO        |
| localStorage Data Cache  |   | UNESCO UIS • Freedom House • WGI • WB Climate CCKP  |
+──────────────────────────+   +─────────────────────────────────────────────────────+
```

### Core Frontend Stack:
- **UI Framework**: [React 19](https://react.dev/) + [TypeScript 5.8](https://www.typescriptlang.org/) (Strict Mode)
- **Build System**: [Vite 6](https://vitejs.dev/) with ESModule bundling and chunk splitting
- **Styling Engine**: [Tailwind CSS v4](https://tailwindcss.com/) with native CSS variable color theming
- **Vector Animation**: [Motion (motion/react)](https://motion.dev/) for layout transitions and sheet drawers
- **Chart Visualization**: [Recharts](https://recharts.org/) for multi-series line charts, radars, and scatter plots
- **Icons**: [Lucide React](https://lucide.dev/) for vector UI iconography

---

## 🛠️ Installation & Local Development

### Prerequisites:
- **Node.js**: `v18.0.0` or higher (Node 20+ LTS recommended)
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`

### Step-by-Step Setup:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/zeluis/Africa-Digital-Atlas.git
   cd Africa-Digital-Atlas
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Launch the Local Development Server**:
   ```bash
   npm run dev
   ```
   The local development server will start at `http://localhost:3000`.

4. **Verify TypeScript & Syntax Integrity**:
   ```bash
   npm run lint
   ```

---

## 🚢 Deployment & Production Builds

### Compile for Production:
```bash
npm run build
```
This produces an optimized, tree-shaken static bundle in the `dist/` directory.

### Preview Production Build Locally:
```bash
npm run preview
```

### Deploying to GitHub Pages:
The repository includes a GitHub Actions CI/CD workflow (`.github/workflows/deploy.yml`). Pushing changes to the `main` branch will automatically compile the Vite application and deploy it to GitHub Pages.

### Deploying to Container Platforms (Docker / Google Cloud Run):
The application includes a self-contained Express server configuration (`server.ts`) for containerized deployment:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📚 Academic Citations & Data Governance

### Open Data Licensing & Attribution
The Africa Data Atlas is released under the **MIT License**. Statistical indicators and geospatial data aggregated by the platform remain subject to the respective open data licenses and attribution policies of their sponsoring institutions:

- **World Bank Open Data**: [Creative Commons Attribution 4.0 (CC-BY 4.0)](https://datacatalog.worldbank.org/)
- **United Nations Statistics Division (UNSD)**: [UN Open Data Terms of Use](https://unstats.un.org/)
- **Freedom House**: [Freedom in the World Research Terms](https://freedomhouse.org/)
- **Transatlantic Slave Voyages Database**: [Emory University & Hutchins Center Attribution Terms](https://www.slavevoyages.org/)
- **WHO Global Health Observatory**: [WHO Data Sharing Policy](https://www.who.int/data/gho)
- **UNESCO Institute for Statistics**: [UIS Data Licensing](https://uis.unesco.org/)

---

## 🏛️ Official Scalable SVG Vectors & Institutional Logos Catalog

The Africa Data Atlas incorporates **pure mathematical, scalable vector SVG components** for all prominent international organizations, development banks, and regional economic communities. Each vector emblem is rendered inline for **zero external HTTP latency, 100% offline PWA compatibility, and infinite sharp scaling** on high-DPI Retina displays, with provenance traced back to official institutional branding packages and **Wikimedia Commons** public domain vector repositories:

| Organization | Acronym | Emblem / Symbolism | Official Vector Source & Wikimedia Commons | Trademark & Legal Classification |
| :--- | :--- | :--- | :--- | :--- |
| **World Bank Group** | **WBG / WB** | Dual Meridian Global Hemispheres | [Wikimedia Commons: World Bank Group Logo](https://commons.wikimedia.org/wiki/File:World_Bank_Group_logo.svg) | IBRD/IDA Institutional Mark (Fair Use / Attribution) |
| **United Nations** | **UN** | Polar Azimuthal Projection with Olive Laurel Branches | [Wikimedia Commons: Emblem of the United Nations](https://commons.wikimedia.org/wiki/File:Emblem_of_the_United_Nations.svg) | Public Domain (UN Visual Guidelines / Paris Conv. 6ter) |
| **UNESCO** | **UNESCO** | Classical Hexastyle Temple Portico & Wordmark | [Wikimedia Commons: UNESCO Logo](https://commons.wikimedia.org/wiki/File:UNESCO_logo.svg) | Official UN Specialized Agency Emblem |
| **International Monetary Fund** | **IMF** | Twin Latitude Hemispheres in Blue Shield | [Wikimedia Commons: IMF Logo](https://commons.wikimedia.org/wiki/File:International_Monetary_Fund_logo.svg) | Multilateral Financial Institution Trademark |
| **Food & Agriculture Organization** | **FAO** | Wheat Stalk over Global Meridian Net | [Wikimedia Commons: FAO Logo](https://commons.wikimedia.org/wiki/File:FAO_logo.svg) | Official UN Specialized Agency Emblem |
| **African Union** | **AU** | Gold Continental Silhouette, Palm Wreath & 54 Rays | [Wikimedia Commons: Emblem of the African Union](https://commons.wikimedia.org/wiki/File:Emblem_of_the_African_Union.svg) | Official Pan-African Treaty Organization Seal |
| **African Development Bank** | **AfDB** | Continental Silhouette within Triangular Vault | [Wikimedia Commons: African Development Bank Logo](https://commons.wikimedia.org/wiki/File:African_Development_Bank_logo.svg) | Regional Multilateral Development Bank Logo |
| **AfCFTA Secretariat** | **AfCFTA** | Interlocking Pan-African Flow Rings (Red, Gold, Green) | [AfCFTA Secretariat Portal](https://au-afcfta.org/) | African Union Special Secretariat Emblem |
| **ASEAN** | **ASEAN** | 10 Bound Golden Paddy Stalks in Red/Blue Disc | [Wikimedia Commons: Emblem of ASEAN](https://commons.wikimedia.org/wiki/File:Emblem_of_ASEAN.svg) | Official Regional Treaty Emblem |
| **World Health Organization** | **WHO** | Rod of Asclepius with Coiled Serpent in UN Laurel | [Wikimedia Commons: Flag of the WHO](https://commons.wikimedia.org/wiki/File:Flag_of_the_World_Health_Organization.svg) | Official UN Health Agency Emblem |
| **International Labour Organization** | **ILO** | Industrial Cog / Tripartite Wheel in Laurel | [Wikimedia Commons: ILO Logo](https://commons.wikimedia.org/wiki/File:International_Labour_Organization_Logo.svg) | Official UN Labor Agency Emblem |
| **Freedom House** | **FH** | Torch of Liberty & Typographic Base | [Wikimedia Commons: Freedom House Logo](https://commons.wikimedia.org/wiki/File:Freedom_House_logo.svg) | Non-profit Research Trademark |
| **ECOWAS** | **ECOWAS** | West African Green Map in Golden Circle | [Wikimedia Commons: Flag of ECOWAS](https://commons.wikimedia.org/wiki/File:Flag_of_ECOWAS.svg) | Regional Economic Community Seal |
| **East African Community** | **EAC** | Concentric Lake Victoria Map & Industrial Shield | [Wikimedia Commons: Flag of the EAC](https://commons.wikimedia.org/wiki/File:Flag_of_the_East_African_Community.svg) | Regional Economic Community Seal |
| **SADC** | **SADC** | Southern African Gold Circle with Bold Acronym | [Wikimedia Commons: Flag of SADC](https://commons.wikimedia.org/wiki/File:Flag_of_SADC.svg) | Regional Economic Community Seal |
| **COMESA** | **COMESA** | Eastern & Southern African Shield on Green Field | [Wikimedia Commons: Flag of COMESA](https://commons.wikimedia.org/wiki/File:Flag_of_COMESA.svg) | Regional Economic Community Seal |

### 🔍 Technical Integration Patterns:
1. **Direct SVG Embedding (Recommended & Implemented)**:
   - Eliminates CORS and remote rate-limiting issues when users browse offline or behind institutional firewalls.
   - Supports dynamic CSS color cascading (`currentColor`), allowing seamless adaptation between Japandi light mode and dark mode.
2. **Direct Wikimedia Commons External Vector Linkage**:
   - Every logo component provides semantic tooltips with direct canonical source citations to the original Wikimedia Commons file repository for attribution and provenance.

---

### Academic BibTeX Citation:
If you utilize the Africa Data Atlas or its harmonized datasets in academic publications, policy papers, or educational curricula, please cite:

```bibtex
@misc{africa_data_atlas_2026,
  author       = {Africa Digital Atlas Development Consortium},
  title        = {Africa Data Atlas: Multilateral Geospatial Intelligence, Macroeconomic Indicators, and Historical Trade Flow Platform},
  year         = {2026},
  publisher    = {GitHub},
  howpublished = {\url{https://zeluis.github.io/Africa-Digital-Atlas/}},
  note         = {Covering 54 Sovereign African States across 16 Multilateral APIs and Historical Maritime Voyages}
}
```

---

## 🔮 Roadmap & Enhancement Suggestions

We welcome contributions and research partnerships. Future initiatives include:

1. **Sub-National GADM Level-1 Administrative Mapping**: Adding provincial/state-level cartographic layers for Nigeria, South Africa, Egypt, Kenya, Ethiopia, and the DRC.
2. **High-Resolution Satellite Night-Lights Ingestion**: Incorporating NOAA VIIRS night-time light radiance datasets to model economic informalities and rural electrification real-time.
3. **AfCFTA Tariff Scenario Simulator**: Interactive simulation model allowing users to adjust bilateral tariff schedules between RECs and forecast trade volume shifts.
4. **Predictive Climate Vulnerability Modeling**: Integrating CMIP6 multi-model climate ensemble projections downscaled to African agricultural river basins (Niger, Nile, Congo, Zambezi).
5. **Decentralized Offline Data Bundles**: IPFS/Content-Addressed archival snapshots allowing complete offline academic distribution on USB drives for rural schools and research stations.

---

<div align="center">
  <p><strong>Africa Data Atlas</strong> • <em>An open-access digital public good for pan-African research and data sovereignty.</em></p>
  <p>Built with ❤️ for researchers, educators, and leaders across Africa and the global diaspora.</p>
</div>
