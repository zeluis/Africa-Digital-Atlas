# Frequently Asked Questions

### Does the Atlas work offline?

Yes. Africa Digital Atlas is a Progressive Web App (PWA). Once you've loaded it once, the app shell, the vector map geometry, and previously viewed indicator data are cached by a service worker, so you can keep browsing without a network connection. You can also install it to your device like a native app.

### How often is the data updated?

Socioeconomic indicators in the Atlas form a curated 2015–2024 snapshot drawn from institutional sources (World Bank, IMF, UN DESA, WHO, UNESCO, and others). Every observation carries an explicit status flag (`observed`, `estimated`, `forecast`, or `derived`) and records its originating source and dataset.

### Can I trust the numbers for academic work?

The Atlas is a visualization and aggregation layer over primary data from 16 multilateral institutions; indicators are a curated snapshot (2015–2024) with per-value status flags rather than a live feed. Use the built-in **Provenance & Data Quality** console to check any figure's source and status before relying on it, and use the citation generator to produce a formatted reference (APA, Harvard, Chicago, or BibTeX). Always cite the original source for any figure you rely on. See [Data & Methodology](/data/data-sources-catalog) for the full source catalog.

### What's the Transatlantic Slave Voyages globe based on?

Headline totals come from the SlaveVoyages trans-Atlantic database (2024.1 release): **36,108 documented voyages** between **1514–1866** (with continental demographic estimates covering **1501–1866**), alongside **18 individually curated voyage dossiers** linked to their source records. See [Citations & Licensing](/data/citations-licensing) for the attribution required if you use this data in research.

### What languages is the Atlas available in?

English, French, Arabic (with right-to-left layout), Portuguese, Swahili, Spanish, and German. See [Languages](/guide/languages) in the User Guide for details.

### How do I report a bug or request a feature?

Open an issue on the [GitHub repository](https://github.com/zeluis/Africa-Digital-Atlas). See [Contributing](/developer/contributing) in the Developer Guide if you'd like to submit a fix yourself.

### Is the project open source?

Yes. The project uses dual licensing at the repository root: the source code is released under the **MIT License** (`LICENSE-CODE`), and creative assets (all SVG maps, the Ethnic Tree Visualization and SVG, and unless stated otherwise, all graphics and visualizations, authored by **ZéLuis F. Correia**) are licensed under **CC BY 4.0** (`LICENSE-ASSETS`). The underlying statistical and historical datasets remain subject to the licenses of their originating institutions.
