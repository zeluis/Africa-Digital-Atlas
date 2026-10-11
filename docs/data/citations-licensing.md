# Citations & Licensing

## Citing the Atlas

If you use the Africa Data Atlas in academic or research work, please cite both the platform (also available in machine-readable form in [`CITATION.cff`](https://github.com/zeluis/Africa-Digital-Atlas/blob/main/CITATION.cff)) and the specific underlying data sources you relied on.

**APA 7th edition**

> Correia, Z. F. (2026). *Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows*. Africalia. https://doi.org/10.6084/m9.figshare.34065711 (ORCID: https://orcid.org/0000-0001-9421-6555)

**Chicago 17th edition (Author-Date)**

> Correia, ZéLuis F. 2026. *Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows*. Africalia. https://doi.org/10.6084/m9.figshare.34065711 (ORCID: https://orcid.org/0000-0001-9421-6555).

**BibTeX**

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

The in-app **Provenance & Data Quality** console (see the [User Guide](../guide/provenance-quality.md)) includes a citation generator that produces APA, Harvard, Chicago, and BibTeX formats for any dataset or country profile.

---

## Citing the underlying data

### 1. SlaveVoyages (Trans-Atlantic Slave Trade Database)

Headline voyage totals (36,108 documented voyages, 1514–1866; continental demographic estimates, 1501–1866) and the 18 curated voyage dossiers are derived from the SlaveVoyages consortium:

> SlaveVoyages Consortium. (2024). *Trans-Atlantic Slave Trade Database* (2024.1 release). https://www.slavevoyages.org/

### 2. Ethnic groups and the clustering framework

The list of 310 contemporary ethnic groups is drawn from Wikipedia, and the phylogenetic/geographic clustering framework is inspired by Bird et al. (2023) and Tishkoff et al. (2009):

- Wikipedia contributors. (2026). *List of contemporary ethnic groups of Africa* (310 entries, retrieved 2026-01). In *Wikipedia, The Free Encyclopedia*. https://en.wikipedia.org/wiki/List_of_contemporary_ethnic_groups_of_Africa
- Bird, N., Ormond, L., Awah, P., Caldwell, E. F., Connell, B., Elamin, M., ... & Hellenthal, G. (2023). Dense sampling of ethnic groups within African countries reveals fine-scale genetic structure and extensive historical admixture. *Science Advances*, 9(13), eabq2616. https://doi.org/10.1126/sciadv.abq2616
- Tishkoff, S. A., Reed, F. A., Friedlaender, F. R., Ehret, C., Ranciaro, A., Froment, A., ... & Williams, S. M. (2009). The genetic structure and history of Africans and African Americans. *Science*, 324(5930), 1035–1044. https://doi.org/10.1126/science.1172257

*(Note: Bird et al. (2023) and Tishkoff et al. (2009) are cited for their clustering framework — how genetic clusters relate to ethnicity, language, and geography. The Atlas does not reproduce their samples or genetic data.)*

### 3. Socioeconomic indicators (2015–2024 curated snapshot)

- World Bank (WDI, WGI, PIP, IDS, CPIA, Gender, Scorecard, CCKP), IMF (WEO), UN DESA, WHO (GHO), UNESCO (UIS & World Heritage Centre), UN Comtrade, UNDP, UNHCR, ILO, FAO, ITU, and Freedom House data are published under their respective open-data terms (most are CC BY 4.0 or equivalent).

---

## Licensing

The repository uses a two-file dual-licensing model at its root:

- **Source code (`LICENSE-CODE`):** The Africa Data Atlas source code is released under the **MIT License** (`Copyright (c) 2026 ZéLuis F. Correia`).
- **Creative assets (`LICENSE-ASSETS`):** **ZéLuis F. Correia** is the author of all SVG maps (`public/africa-final.svg`, `src/data/africaFinalGeometry.ts`) and the Ethnic Tree Visualization and SVG (`src/data/authenticEthnicTreeSvg.ts`, `src/data/africaliaMasterTreeData.ts`). Unless stated otherwise, all graphics and visualizations have the same author and are licensed under the **Creative Commons Attribution 4.0 International Public License (CC BY 4.0)**. Please attribute: *"Cartographic visualization by ZéLuis F. Correia (Africalia: Africa Data Atlas, CC BY 4.0, https://doi.org/10.6084/m9.figshare.34065711)."*
- **Data licensing:** Underlying statistical, archival, and historical datasets remain subject to the licenses of their originating institutions.

---

## What the Atlas is, and is not

The Atlas is a visualization and aggregation layer. Indicator values are a curated snapshot (2015–2024) with per-value status flags (`observed`, `estimated`, `forecast`, `derived`) rather than a live feed, and the slave-trade figures are summaries of an external database (36,108 documented voyages, 1514–1866, plus 18 curated voyage dossiers) rather than a full copy of it. Use the **Provenance & Data Quality** console to check any figure's source and status before relying on it.
