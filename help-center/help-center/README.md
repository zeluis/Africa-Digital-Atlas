---
description: Answers to common questions about the Africa Digital Atlas
icon: circle-question
layout:
  width: wide
  title:
    visible: false
  description:
    visible: false
  tableOfContents:
    visible: false
  outline:
    visible: false
  pagination:
    visible: false
  metadata:
    visible: false
  tags:
    visible: true
  actions:
    visible: true
---

# Frequently Asked Questions

### Does the Atlas work offline?

Yes. Africa Digital Atlas is a Progressive Web App (PWA). Once you've loaded it once, the app shell, the vector map geometry, and previously viewed indicator data are cached by a service worker, so you can keep browsing without a network connection. You can also install it to your device like a native app.

### How often is the data updated?

It depends on the source. Most institutional connectors (World Bank, IMF, WHO, UNESCO, and similar) publish updates annually; a few (trade and health-surveillance data) update quarterly. Each country dossier and indicator shows data-quality flags where a figure is modeled, imputed, or based on a lagged census.

### Can I trust the numbers for academic work?

The Atlas is a visualization and aggregation layer over primary data from 16 multilateral institutions — it doesn't invent its own statistics. Use the built-in **Provenance & Data Quality** console to check a given figure's source, and the citation generator to produce a properly formatted reference (APA, Harvard, Chicago, or BibTeX). See [Data & Methodology](https://fpizeluis.gitbook.io/fpizeluis-docs/api-reference/) for the full source catalog.

### What's the Transatlantic Slave Voyages globe based on?

It's derived from the Slave Voyages research consortium's database of over 36,000 documented voyages (1501–1867). See [Citations & Licensing](https://fpizeluis.gitbook.io/fpizeluis-docs/api-reference/citations-licensing) for the attribution required if you use this data in research.

### What languages is the Atlas available in?

English, French, Arabic (with right-to-left layout), Portuguese, Swahili, Spanish, and German. See [Languages](https://fpizeluis.gitbook.io/fpizeluis-docs/documentation/languages) in the User Guide for details.

### How do I report a bug or request a feature?

Open an issue on the [GitHub repository](https://github.com/zeluis/Africa-Digital-Atlas). See the [Contributing](https://fpizeluis.gitbook.io/fpizeluis-docs/changelog/contributing) page in the Developer Guide if you'd like to submit a fix yourself.

### Is the project open source?

Yes, the code is MIT licensed. The underlying statistical and geospatial data remain subject to the licenses of their originating institutions.
