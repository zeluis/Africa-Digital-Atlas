# AFRICALIA UNIVERSAL STYLE GUIDE & LIVING ARCHITECTURAL MONOGRAPH
**The Sovereign Design System, Cartographic Geodesy, and Technical Architecture of the Africa Data Atlas**

*Under the scientific direction and cartographic curation of **Zéluis F. Correia***  
*Observatory Edition: 2026.1 • Permanent Scholarly Reference*

---

## 🏛️ SECTION I: INSTITUTIONAL MISSION & INTELLECTUAL PROPERTY CHARTER

### 1.1 Institutional Identity & Purpose
**Africalia** is an independent, non-partisan cartographic and econometric research observatory founded by **Zéluis F. Correia**. The **Africa Data Atlas** serves as a digital public good and scientific synthesis platform bridging the gap between fragmented multilateral statistics, deep ancestral phylogenetic lineages, historical trade extractions, and contemporary geopolitical transformations across all 54 sovereign African nations.

### 1.2 Dual Licensing & Creative Assets Authorship
The Africa Data Atlas applies explicit dual licensing at its repository root (`LICENSE-CODE` and `LICENSE-ASSETS`):

> **AUTHORSHIP & DUAL-LICENSING DECLARATION**  
> **ZéLuis F. Correia is the author of all SVG maps and the Ethnic Tree Visualization and SVG. Unless stated otherwise, all graphics and visualizations have the same author.**  
> 
> *The $5796 \times 5867$ High-Precision Vector Continental Map (`africa-final.svg` / `AfricaMapFinalLayer.tsx`), the 1,017 Admin-1 provincial subdivision boundaries, the Geodesic SIDS Coordinate Callout Arrays, and the Ethnic Tree Visualization and SVG (`AfricaliaExplorer.tsx` / `authenticEthnicTreeSvg.ts`) are licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)** (`LICENSE-ASSETS`). Application source code is licensed under the **MIT License** (`LICENSE-CODE`).*

#### License Terms & Attribution:
- **Creative Assets (`LICENSE-ASSETS` — CC BY 4.0)**: You are free to share and adapt the SVG maps, Ethnic Tree Visualization and SVG, and graphics for any purpose, provided you give appropriate credit to **ZéLuis F. Correia**, link to the CC BY 4.0 license, and indicate if changes were made.
- **Required Attribution**:  
  `"Cartographic visualization by ZéLuis F. Correia (Africalia: Africa Data Atlas, CC BY 4.0, https://doi.org/10.6084/m9.figshare.34065711)."`
- **Source Code (`LICENSE-CODE` — MIT License)**: The software codebase is released under the standard MIT License (`Copyright (c) 2026 ZéLuis F. Correia`).

---

## 🎨 SECTION II: VISUAL CONSTITUTION & JAPANDI-SAHEL DESIGN SYSTEM

### 2.1 Aesthetic Philosophy
The visual architecture of Africalia departs from generic tech-startup conventions ("AI slop", neon purple gradients, floating glassmorphism). Instead, it adopts a **Japandi-Sahel Synthesis**—blending Japanese minimalism (*wabi-sabi*, optical breathing room, respect for negative space) with Scandinavian functionalism (*lagom*, ergonomic typography) and warm, dignified African earthen pigmentations.

### 2.2 Color Constellation & Curated Palettes

#### Canvas Foundations:
- **Museum Light Canvas (Primary Default)**: `#FAF8F5` (Soft warm parchment with 0% eye-fatigue)
- **Obsidian Dark Canvas**: `#121310` (Warm obsidian charcoal; strictly avoids harsh `#000000`)
- **Card & Surface Background (Light)**: `#FFFFFF` with hairline border `rgba(230, 225, 218, 0.85)`
- **Card & Surface Background (Dark)**: `#1A1916` with hairline border `rgba(255, 255, 255, 0.08)`

#### Curated African Tonal Accents:
- **Terracotta & Sahel Ochre**: `#D97706` / `#E67E48` (Primary brand accent, energetic lineages)
- **Nile Silt & Botanical Sage**: `#059669` / `#10B981` (Macroeconomic growth, ecological resilience)
- **Saharan Indigo & Maritime Azure**: `#0284C7` / `#2563EB` (Hydrography, ocean winds, trade flows)
- **Kigali Amethyst**: `#7C3AED` / `#9333EA` (Governance, rule of law, institutional integrity)
- **Bight Coral**: `#E11D48` / `#F43F5E` (Historical extraction, demographic stress, vulnerability)

#### United Nations M49 Geoscheme Cartographic Scale:
To eliminate geopolitical distortion, the 5 African macro-regions are strictly color-anchored:
- **Northern Africa**: Imperial Sand `#C99436`
- **Western Africa**: Guinea Rainforest Emerald `#1B8A5A`
- **Central Africa**: Congo Basin Viridian `#157347`
- **Eastern Africa**: Rift Valley Ochre `#C25E2E`
- **Southern Africa**: Kalahari Terracotta `#9B3E2B`

### 2.3 Typographic Hierarchy
The platform employs a multi-script typographic pairing designed for legibility across Roman, Ge'ez, and Arabic alphabets:
- **Display Typography (Dossiers & Titles)**: *Plus Jakarta Sans* / *Syne* (`font-extrabold tracking-tight`)
- **Body Text & Analytical Prose**: *Inter* / *Plus Jakarta Sans* (`font-normal leading-relaxed text-zinc-700 dark:text-zinc-300`)
- **Technical Metrics & Econometric Tables**: *JetBrains Mono* / *Fira Code* (`font-mono tabular-nums tracking-wider`)
- **Non-Latin Script Extensions**:
  - Arabic (Maghreb, Egypt, Sudan): *Noto Sans Arabic*
  - Ge'ez (Amharic, Tigrinya): *Noto Sans Ethiopic*

### 2.4 Ergonomic Density Switching (3 Viewport Modes)
A persistent UI toggle allows users to adapt spatial density to their hardware context:
- **Compact**: 6px gutters, 11px micro-typography for multi-monitor financial and econometric audits.
- **Standard (Default)**: 16px gutters, balanced optical padding for desktop and laptop reading.
- **Spacious**: 24px gutters, enlarged touch targets (minimum 48px) for tablets, presentations, and touchscreen kiosks.

---

## 🗺️ SECTION III: CARTOGRAPHIC ENGINES & GEODETIC SPECIFICATIONS

### 3.1 The $5796 \times 5867$ High-Precision Vector Engine
- **Source Baseline**: `africa-final.svg` streaming into `AfricaMapFinalLayer.tsx`.
- **Coordinate Space**: Exact Cartesian bounding box of `0 0 5796 5867`.
- **Sub-National Granularity**: 1,017 Admin-1 provincial, state, and regional internal boundary paths.
- **Hairline Precision Standards**:
  - Coastlines and national boundaries: `2.8px` to `4.5px` active stroke weight.
  - Admin-1 provincial subdivisions: `0.4px` (inactive) to `1.2px` (active) hairline stroke width.
  - Prime Meridian ($0^\circ$), Equator ($0^\circ$), Tropic of Cancer ($23.4^\circ\text{ N}$), and Tropic of Capricorn ($23.4^\circ\text{S}$): `0.8px` to `1.6px` dashed hairline stroke width.
- **SIDS Geodesic Anchors**: Small Island Developing States (Cabo Verde, São Tomé and Príncipe, Comoros, Mauritius, Seychelles) feature enlarged, high-contrast target reticles guaranteeing accessibility on all screen sizes.

### 3.2 Gesture & Scroll-Isolation Protocol (Deep Scrutiny Engine)
To prevent accidental outer window scrolling during cartographic or archival examination:
- **Non-Passive Wheel Interception**: Replaces passive defaults with strict native `{ passive: false }` listeners on `containerRef`, intercepting `e.preventDefault()` and `e.stopPropagation()`. When the mouse/pointer is over an image or map canvas, wheel motion **only** adjusts zoom ($1.00\times$ to $5.00\times$) and pan coordinates.
- **Touch-Action Isolation**: Viewport canvases enforce `touch-action: none` (`touch-none`). Continuous two-finger Euclidean distance calculates pinch-to-zoom ratios, eliminating mobile page bounces and pull-to-refresh conflicts.
- **Boundary Clamping on Drawers**: Academic citation drawers and notarial panels enforce `overscroll-behavior: contain` (`overscroll-contain`), preventing scroll chaining to the parent document when reaching boundary edges.

### 3.3 Historical Cartography, Ocean Currents & Monsoon Winds
- **Interactive Split-Screen Curtain Slider**: Compares historical antique maps (Vincenzo Coronelli 1688, Guillaume Delisle 1707, Rigobert Bonne 1780, John Tallis 1851) against modern sovereign borders.
- **Real-Time Ocean Vector Fields**: 60 FPS HTML5 canvas particle simulation illustrating the 8 primary maritime currents (*Canary*, *Guinea*, *Benguela*, *Agulhas*, *Mozambique*, *Somali*, *South Equatorial*, *North Equatorial*).
- **Quarterly Monsoon Regimes**: Seasonal toggles (**Q1**, **Q2**, **Q3**, **Q4**) illustrating the historical Indian Ocean dhow trade between the Swahili Coast, the Arabian Peninsula, and Gujarat.

---

## 🏛️ SECTION IV: ASSET INVENTORY & INSTITUTIONAL EMBLEM CATALOG

### 4.1 Scalable Pure SVG Institutional Emblems
All multilateral emblems are embedded as mathematical inline vector components. They require **zero external HTTP network requests**, feature **infinite sharpness on Retina displays**, and support CSS dynamic color cascading (`currentColor`):

1. **World Bank Group (WBG)**: Dual meridian hemispheres ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:World_Bank_Group_logo.svg))
2. **United Nations (UN)**: Polar azimuthal projection with olive laurel wreath ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Emblem_of_the_United_Nations.svg))
3. **UNESCO**: Classical hexastyle temple portico ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:UNESCO_logo.svg))
4. **International Monetary Fund (IMF)**: Twin latitude hemispheres in blue crest ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:International_Monetary_Fund_logo.svg))
5. **African Union (AU)**: Gold continental silhouette with 54 green rays and palm wreath ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Emblem_of_the_African_Union.svg))
6. **African Development Bank (AfDB)**: Continental silhouette within triangular vault ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:African_Development_Bank_logo.svg))
7. **AfCFTA Secretariat**: Interlocking pan-African flow rings (Red, Gold, Green) ([Official Portal](https://au-afcfta.org/))
8. **World Health Organization (WHO)**: Rod of Asclepius with coiled serpent in UN laurel ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Flag_of_the_World_Health_Organization.svg))
9. **Food & Agriculture Organization (FAO)**: Wheat stalk over global meridian net ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:FAO_logo.svg))
10. **Freedom House (FH)**: Torch of Liberty & typographic plinth ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Freedom_House_logo.svg))
11. **ECOWAS, EAC, SADC, COMESA**: Curated seals of the 8 African Union Recognized RECs.

### 4.2 Archival Iconography & Castas Series (1,252 Visual Plates)
- **1,220 Middle Passage Illustrations**: Naval architectural plans of slave ships (e.g., *Brookes* 1788), plantation manifests, court documents, and insurrection portraits.
- **32 Colonial Castas Paintings**: Masterworks by Miguel Cabrera, Andrés de Islas, and José de Páez from the *Museo Nacional del Virreinato*, cataloging the 18th-century *Pintura de Castas* genre conventions depicting racial classifications in colonial New Spain and the Hispanic Atlantic.

---

## 📊 SECTION V: MULTILATERAL DATA ARCHITECTURE & API REPOSITORY

### 5.1 The 16 Multilateral Connectors
The platform continuously harmonizes statistical indicators across 16 international institutions:
1. **World Bank WDI**: Macroeconomic accounts, GDP, GNI, external debt stocks.
2. **IMF WEO**: Fiscal balances, inflation forecasts, balance of payments.
3. **UN Comtrade**: Bilateral trade matrices, mineral extractions, agricultural flows.
4. **WHO Global Health Observatory**: Maternal health, disease burdens, life expectancies.
5. **UNESCO UIS**: Literacy rates, primary-to-tertiary school progression, STEM parity.
6. **Freedom House FIW**: Civil liberties scores (0–60), political rights ratings (0–40).
7. **World Bank WGI**: Governance indicators (Rule of Law, Control of Corruption, Government Effectiveness).
8. **Africa Integrity Indicators (AII)**: Judicial autonomy, anti-corruption agency transparency.
9. **World Bank Gender Data Portal**: Female labor participation, gender wage gaps.
10. **World Bank Corporate Scorecard**: IDA delivery outcomes, public expenditure efficiency.
11. **World Bank Climate CCKP**: CMIP6 rainfall anomalies, agricultural drought indices.
12. **AfDB Africa Information Highway**: Continental infrastructure development indices.
13. **UNCTAD Trade Data Portal**: Port container throughput, value-added trade shares.
14. **Mo Ibrahim Foundation (IIAG)**: Continental security, human development, and rights index.
15. **AfCFTA Secretariat Data**: Intra-African tariff schedules and rule-of-origin implementation.
16. **SlaveVoyages Research Consortium**: 36,000+ documented historical Middle Passage voyage records.

### 5.2 Deterministic Cryptographic Immutability
- **SHA-256 Verification Engine**: Each foundational dataset has a published SHA-256 checksum computed at build time so you can confirm your copy matches the release via the Web Crypto API verifier in the Methodology & Provenance Dossier.
- **Imputation & Status Transparency**: Every observation explicitly flags its status (`observed`, `estimated`, `forecast`, or `derived`), with back-filled or derived rules recorded in `notes`.

---

## 🔒 SECTION VI: ZERO-SURVEILLANCE PRIVACY & FAIR SCHOLARLY CHARTER

### 6.1 Privacy & Sovereign Data Governance
- **Zero Third-Party Telemetry**: 100% free of advertising cookies, Google Analytics, Facebook tracking pixels, or cross-site fingerprinting algorithms.
- **Full GDPR & AU Malabo Convention Compliance**: Users enjoy the absolute **Right to Erasure (Art. 17)** via an interactive client-side `localStorage` inspector that audits and wipes all locally stored preferences in a single click.
- **Stateless Neural Audio Pipeline**: Text-to-speech audio executes through the client's native Web Speech API or transient in-memory buffers; zero voice recordings or acoustic fingerprints are stored on remote disks.

### 6.2 Standardized Academic Citations
When citing the Africa Data Atlas, its cartographic layers, or econometric working papers (also see [`CITATION.cff`](https://github.com/zeluis/Africa-Digital-Atlas/blob/main/CITATION.cff)):

#### APA 7th Edition:
> Correia, Z. F. (2026). *Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows*. Africalia. https://doi.org/10.6084/m9.figshare.34065711 (ORCID: https://orcid.org/0000-0001-9421-6555)

#### Chicago 17th Edition (Author-Date):
> Correia, ZéLuis F. 2026. *Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows*. Africalia. https://doi.org/10.6084/m9.figshare.34065711 (ORCID: https://orcid.org/0000-0001-9421-6555).

#### Academic BibTeX Entry:
```bibtex
@software{correia_africa_atlas_2026,
  author       = {Correia, Z{\'e}Luis F.},
  title        = {Africa Data Atlas \& Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows},
  year         = {2026},
  publisher    = {Africalia},
  doi          = {10.6084/m9.figshare.34065711},
  url          = {https://doi.org/10.6084/m9.figshare.34065711},
  note         = {Repository: https://github.com/zeluis/Africa-Digital-Atlas; ORCID: 0000-0001-9421-6555}
}
```

---

*Authored by Zéluis F. Correia • Africalia Cartographic & Econometric Observatory • 2026*
