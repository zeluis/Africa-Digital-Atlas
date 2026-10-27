---
icon: globe
---

# Transatlantic Slave Trade Research Suite & Cartography

A dedicated historical research subsystem and cartographic analytics suite visualizing four centuries of forced trans-Atlantic and intra-American maritime migrations (1514–1866). Grounded in 36,108 documented voyage logs from the *SlaveVoyages* trans-Atlantic database and enhanced by 1,252 archival iconography plates, paleogenomic data, and econometric models.

## The 14 Integrated Research Subsystems

The research suite is organized into 14 specialized analytical modules accessible through an ARIA-compliant tabbed navigation system:

* **01 — Overview & Geodesic Flow Map**: Interactive bezier arcs tracing embarkation regions in Africa to destination ports across Brazil, the Caribbean, and North America, with century-by-century volume curves.
* **02 — African Forts & Coastal Enclaves Map (`AfricanPortsMap`)**:
  * Direct projection onto the canonical $5,796 \times 5,867$ Cartesian geometry of `africa-final.svg`.
  * **47 Calibrated Coastal Ports** across 8 historic corridors (Senegambia, Sierra Leone, Windward Coast, Gold Coast, Bight of Benin, Bight of Biafra, West Central Africa, Southeast Africa).
  * **Proportional Dual-Drawer Architecture**: Mirrors `ArchivalImageViewer` with a `w-7/12 xl:w-2/3` canvas and a flush `w-5/12 xl:w-1/3` 3-tab dossier drawer (`Dossier`, `Cite`, `Nearby`).
  * **Interactive Legend Deck**: Integrates an expandable 8-corridor deck with the **`+12M Captives`** headline badge, flag and century filter dropdowns, and instant hover-to-glow corridor highlights.
  * **Collision-Free Dynamic Radar**: Corner mini-map dynamically shifts upward (`bottom-[102px]`) when the port filmstrip is open and rests at `bottom-4` when collapsed.
  * **Universal Keyboard Navigation**: Arrow keys pan the canvas, `+`/`-` zoom, `0` resets to tight overview framing (`{ x: 300, y: 1480, w: 4550, h: 3000 }`), and `F` toggles fullscreen.
* **03 — Introduction Essays & Historiography**: Peer-reviewed essays by David Eltis, David Richardson, Stephen D. Behrendt, and Manolo Florentino.
* **04 — Explore Voyages Search Engine**: Multi-parameter search filtering 36,108 voyages by ship, captain, flag nationality, port, and year span.
* **05 — Geographic Routes & Mortality Analysis**: Breakdown of Middle Passage routes with comparative shipboard mortality rates.
* **06 — African Origins & Names Database**: Documentation of 91,491 liberated Africans registered in Havana and Freetown Vice-Admiralty courts.
* **07 — Enslavers & Commercial Networks**: Directory documenting major trading companies (Royal African Company, Dutch West India Company) and private syndicates.
* **08 — Comparative Analytics & Demographics**: Cross-tabulated demographic distributions (men, women, children ratios, voyage duration distributions).
* **09 — Query Builder & Academic Citations**: Boolean query builder generating formatted scholarly citations in Chicago (17th), APA (7th), Harvard, and BibTeX.
* **10 — Provenance & Epistemic Methodology**: Epistemic transparency explaining the boundary between Observed, Imputed, and Estimated figures.
* **11 — Molecular & Material Legacies of Slavery**: Synthesis uniting 50,000+ population genomes (IBD haplotype deconvolution), ancient DNA (Zoutsteeg c. 1660s), 98% Maroon retention, and bioarchaeology from the New York African Burial Ground.
* **12 — Structural and Evolutionary Foundations of African Development**: Master Report synthesizing Macro-Geonomics, Nathan Nunn's 18M+ slave trade mistrust scar, Henn-Robinson pre-colonial governance, and the landmark March 25, 2026 UN General Assembly Slavery Resolution (123-3).
* **13 — Historical Iconography Archive**: Curated repository of 1,220 Middle Passage naval architectural plans (e.g. *Brookes* 1788) and 32 colonial *Pintura de Castas* masterworks.
* **14 — Archival Cartography & Currents GIS**: Interactive split-screen curtain slider comparing historical antique maps (Coronelli 1688, Delisle 1707, Bonne 1780, Tallis 1851) against modern borders, coupled with a 60fps particle simulation of ocean currents.

---

## Data Provenance & Attribution

Voyage data is harmonized from the *SlaveVoyages Consortium* ([api.slavevoyages.org](https://www.slavevoyages.org/)). High-precision vector geometries and cartographic visualizations are authored by **ZéLuis F. Correia** (licensed under CC BY 4.0).
