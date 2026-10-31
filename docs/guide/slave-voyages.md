# Transatlantic & Intra-American Slave Voyages Atlas

A dedicated historical research subsystem and cartographic analytics suite visualizing four centuries of forced trans-Atlantic and intra-American maritime migrations (1514–1866). Grounded in 36,108 documented voyage logs from the *SlaveVoyages* trans-Atlantic database and enhanced by 1,252 archival iconography plates, paleogenomic data, and econometric models.

---

## The 15 Integrated Research Subsystems

The research suite is organized into 15 specialized analytical modules accessible through an ARIA-compliant tabbed navigation system:

### 01 — Overview & Research Foundations
- **Research Foundations Gateway**: Executive summary featuring headline indicators (36,108 voyages, 12.5M embarked, 10.7M disembarked), top-header integrated paleogenomics (*Molecular Legacies*) and development economics (*Foundations of African Development*) monograph cards, and an interactive launchpad gateway for the dedicated Flow Map.
- **African Embarkation Coasts Demographic Matrix**: Structured demographic distribution across 8 macro-coastal zones (West Central Africa, Bight of Benin, Bight of Biafra, Gold Coast, Senegambia, SE Africa & Indian Ocean, Sierra Leone, Windward Coast) detailing captive volumes, percentage shares, destination corridors, and mortality rates.
- **Century-by-Century Volume Curves**: Area charts comparing observed logbook records against statistical imputations and historical demographic estimates (1501–1866).
- **Historical Milestones Timeline**: Chronological analysis of key maritime legislation, court rulings, and anti-trafficking treaties (1518–1866).
- **Visual & Cartographic Gateways**: Quick navigation jump links to the Historical Iconography Archive and Archival Cartography & Currents GIS.

### 02 — Atlantic Geodesic Flow Map (`AtlanticFlowMap.tsx`)
- **Standalone GIS Workstation**: Dedicated full-bleed workspace for inspecting transatlantic maritime trajectories across 352 years, operating with automatic application footer suppression and edge-to-edge canvas geometry.
- **Geodesic Network Flows**: Interactive bezier arcs tracing embarkation regions in Africa to 110+ landing ports across Brazil, the Caribbean, and North America.
- **Interactive Scrubber & Epistemic Modes**: Dynamic temporal playback (1514–1866) and epistemic filtering toggling between strictly observed logbook records and statistically imputed voyages.

### 03 — African Forts & Coastal Enclaves Map (`AfricanPortsMap.tsx`)
- **Native $5,796 \times 5,867$ Vector Space**: Direct projection onto the canonical continental geometry of `public/africa-final.svg`.
- **47 Calibrated Embarkation Ports**: Precise coastal coordinate anchoring across 8 historic corridors (Senegambia, Sierra Leone, Windward Coast, Gold Coast, Bight of Benin, Bight of Biafra, West Central Africa, Southeast Africa).
- **Proportional Dual-Drawer Architecture**: Mirrors `ArchivalImageViewer.tsx` with a `w-7/12 xl:w-2/3` canvas and a flush `w-5/12 xl:w-1/3` 3-tab dossier drawer (`Dossier`, `Cite`, `Nearby`).
- **Interactive Legend Deck & Corrected Metric**: Integrates an expandable 8-corridor deck with the **`+12M Captives`** headline badge, flag and century filter dropdowns, and instant hover-to-glow corridor highlights.
- **Collision-Free Dynamic Radar**: Corner mini-map dynamically shifts upward (`bottom-[102px]`) when the port filmstrip is open and rests at `bottom-4` when collapsed, ensuring zero overlay collision.
- **Universal Keyboard Controls**: Arrow keys pan the canvas, `+`/`-` zoom, `0` resets to the tight overview framing (`{ x: 300, y: 1480, w: 4550, h: 3000 }`), and `F` toggles fullscreen.

### 04 — Introduction Essays & Historiography
- Peer-reviewed historiographical essays by David Eltis, David Richardson, Stephen D. Behrendt, and Manolo Florentino contextualizing trans-Atlantic demographic estimates and shipboard conditions.

### 05 — Explore Voyages Search Engine
- Searchable query interface filtering 36,108 voyages by ship name, captain, flag nationality, embarkation port, disembarkation region, and year span.
- Consolidated database toggle reconciling Transatlantic, Intra-American, and African Origins records.

### 06 — Geographic Routes & Mortality Analysis
- Breakdown of Middle Passage routes with comparative shipboard mortality rates (averaging 12.4% across four centuries, peaking in early 17th-century Portuguese runs).

### 07 — African Origins & Names Database
- Documentation of 91,491 liberated Africans registered in Havana and Freetown Vice-Admiralty courts, recording names, estimated ages, gender, and linguistic origins.

### 08 — Enslavers & Commercial Networks
- Biographical and financial directory documenting major trading companies (Royal African Company, Dutch West India Company, Companhia Geral de Pernambuco e Paraíba) and private syndicates.

### 09 — Comparative Analytics & Demographics
- Cross-tabulated bar and area charts displaying captive sex ratios (men, women, children), voyage duration distributions, and seasonal embarkation cycles.

### 10 — Query Builder & Academic Citations
- Multi-parameter boolean query builder generating formatted scholarly citations in **Chicago (17th Author-Date)**, **APA (7th)**, **Harvard**, and **BibTeX**.

### 11 — Provenance & Epistemic Methodology
- Methodological documentation explaining the distinction between **Observed** archival entries, **Imputed** variables, and **Historical Demographic Estimates**.

### 12 — Molecular & Material Legacies of Slavery
- Interdisciplinary synthesis uniting **50,000+ population genomes** (IBD haplotype deconvolution), **ancient DNA (Zoutsteeg c. 1660s)**, **98% Maroon retention**, sex-biased gene flow ledgers, and bioarchaeology from the **New York African Burial Ground**.

### 13 — Structural and Evolutionary Foundations of African Development
- Master Report synthesizing **Macro-Geonomics (Recent African Origin & Ashraf-Galor curve)**, **Nathan Nunn's 18M+ slave trade mistrust scar**, **Henn-Robinson pre-colonial decentralized governance**, **Tadei's colonial monopsony price-gap model**, and the **March 25, 2026 UN General Assembly Slavery Resolution (123-3)**.

### 14 — Historical Iconography Archive
- Curated repository of 1,220 Middle Passage naval architectural plans (e.g. *Brookes* 1788 slave ship stowage diagram) and 32 colonial *Pintura de Castas* masterworks by Miguel Cabrera and José de Páez.

### 15 — Archival Cartography & Currents GIS
- Interactive split-screen curtain slider comparing historical antique maps (Coronelli 1688, Delisle 1707, Bonne 1780, Tallis 1851) against modern borders, coupled with a 60fps particle simulation of the 8 major Atlantic and Indian Ocean currents.

---

## Data Provenance & Attribution

Voyage data is harmonized from the *SlaveVoyages Consortium* ([api.slavevoyages.org](https://www.slavevoyages.org/)). High-precision vector geometries and cartographic visualizations are authored by **ZéLuis F. Correia** (licensed under CC BY 4.0). See [Universal Style Guide](../UNIVERSAL_STYLE_GUIDE.md) and [Universal Audit Specification](../UNIVERSAL_AUDIT_SPECIFICATION.md) for design and architectural standards.
