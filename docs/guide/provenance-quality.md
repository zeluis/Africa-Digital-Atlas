# Provenance, Quality Audits & Verification

The Atlas includes a **Provenance & Data Quality** console and **Methodology & Data Provenance Dossier** so you can inspect where every figure comes from and verify dataset checksums.

## 1. Data provenance

The Atlas covers 54 sovereign African states across 8 thematic pillars. Socioeconomic indicators form a curated 2015–2024 snapshot drawn from institutional sources (World Bank, IMF, UN DESA and others). Every value records its source, dataset and status, so you can see where a number comes from before using it.

## 2. Status flags

Every observation carries one of four flags, which carry through to charts, tables and exports:

- **Observed (`observed`)** — reported directly by the originating source for that period.
- **Estimated (`estimated`)** — modelled, imputed or revised by the source or by the Atlas.
- **Forecast (`forecast`)** — projected beyond the latest observation.
- **Derived (`derived`)** — calculated or back-filled from a baseline figure by a documented rule, with the rule recorded in `notes`.

## 3. Slave-trade figures

Headline totals come from the SlaveVoyages trans-Atlantic database (2024.1 release): **36,108 documented voyages** between **1514 and 1866**. The Atlas shows summary statistics for the full database and **18 individually curated voyage dossiers**, each linked to its source record.

Three layers are kept apart:

- **Observed (1514–1866)** — drawn directly from surviving logbooks, manifests, port ledgers and court records.
- **Imputed (1514–1866)** — observed records with missing values (captives embarked, tonnage, flag) filled in by statistical methods.
- **Estimated (1501–1866)** — continental-level models that account for unrecorded voyages, so these totals cover a wider period (1501–1866).

## 4. Ethnic groups and the clustering framework

The ethnic groups come from Wikipedia's *List of contemporary ethnic groups of Africa* (310 entries, retrieved 2026-01). The cartography is inspired by two population-genetic studies, **Bird et al. (2023)** and **Tishkoff et al. (2009)**. It uses them only for their clustering framework, meaning how genetic clusters relate to ethnicity, language and geography. It does not reproduce their samples or genetic data.

Genetic ancestry, language, cultural identity and political classification are treated as related but separate categories, and the map does not equate them.

## 5. Dataset integrity

Each foundational dataset has a published SHA-256 checksum computed from the file at build time so you can confirm your copy matches the release. "Verify" re-computes the hash in your browser using the Web Crypto API and compares it with the published value. A mismatch means the file differs from the release.

## 6. Limitations

- Indicator values are a snapshot (2015–2024) and may lag the latest releases from their sources.
- Wikipedia-derived group names, languages and homelands reflect that source and its editorial conventions, not a single scholarly classification.
- Historical slave-trade records are incomplete; imputed and estimated figures depend on modelling assumptions.
- Present-day borders do not map neatly onto historical territories or identities.
- Cite the original source for any figure you rely on.
