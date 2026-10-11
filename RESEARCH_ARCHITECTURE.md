# Research Architecture & Provenance Governance

This document defines the research integrity, provenance, and verification architecture of the **Africa Data Atlas & Cartographic Observatory** (`Africalia`).

---

## 1. Core Architectural Principles

1. **Single Source of Truth (`research/facts.json` & `research/sources.json`)**
   Headline figures, temporal scopes, persistent identifiers, and institutional source definitions live in machine-readable JSON manifests (`research/facts.json` and `research/sources.json`). UI components, modals, and documentation import or mirror these canonical values so numbers never drift across views.

2. **Four-Status Observation Model (`observed`, `estimated`, `forecast`, `derived`)**
   Every socioeconomic indicator observation (`2015–2024` curated snapshot across 54 sovereign African states and 8 thematic pillars) carries an explicit status flag:
   - `observed` — Reported directly by the originating institution for that period.
   - `estimated` — Modelled, imputed, or revised by the originating source or the Atlas.
   - `forecast` — Projected beyond the latest empirical observation.
   - `derived` — Calculated or back-filled from a baseline observation by a documented mathematical rule, with the exact formula recorded in `notes`. Values back-filled by scaling a baseline figure must never be tagged `observed`.

3. **Three-Layer SlaveVoyages Separation**
   Historical transatlantic slave-trade figures from the *SlaveVoyages* trans-Atlantic database (`2024.1` release) keep three methodological layers strictly separate:
   - **Observed (`1514–1866`)**: `36,108` documented voyages drawn from surviving archival logbooks, port ledgers, manifests, and court records, alongside `18` individually curated voyage dossiers.
   - **Imputed (`1514–1866`)**: Documented voyages where missing variables (embarked captives, tonnage, vessel rig) are statistically imputed.
   - **Continental Demographic Estimates (`1501–1866`)**: Macro-demographic models accounting for unrecorded voyages across the broader `1501–1866` period.

4. **Ethnic Groups & Population-Genetics Clustering Attribution**
   - The catalog of **310 contemporary ethnic groups** is sourced from Wikipedia's *List of contemporary ethnic groups of Africa* (retrieved `2026-01`).
   - **Bird et al. (2023)** (*Science Advances*, `10.1126/sciadv.abq2616`) and **Tishkoff et al. (2009)** (*Science*, `10.1126/science.1172257`) are cited strictly for their **clustering framework** (how genetic clusters relate to ethnicity, language, and geography). The Atlas does not reproduce their biological samples or genotype data.

5. **Build-Time & Browser SHA-256 Dataset Checksums (`research/checksums.json` & `research/hashes.json`)**
   Each of the 8 foundational datasets listed in `research/datasets.json` has a deterministic SHA-256 digest computed at build time. Users can recompute and verify the SHA-256 digest of any dataset in the browser via the Web Crypto API (`crypto.subtle.digest`) inside the **Methodology & Data Provenance Dossier**.

6. **Explicit Dual Licensing (`LICENSE-CODE` & `LICENSE-ASSETS`)**
   - **Source Code (`LICENSE-CODE`)**: Released under the **MIT License** (`Copyright (c) 2026 ZéLuis F. Correia`).
   - **Creative Assets (`LICENSE-ASSETS`)**: **ZéLuis F. Correia** is the author of all SVG maps and the Ethnic Tree Visualization and SVG. Unless stated otherwise, all graphics and visualizations have the same author and are licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.
   - **Persistent Identifiers**: Universal Figshare DOI `https://doi.org/10.6084/m9.figshare.34065711` and author ORCID `https://orcid.org/0000-0001-9421-6555` (`CITATION.cff`).

---

## 2. Repository Layout & Governance Files

| File / Path | Purpose |
| :--- | :--- |
| `research/facts.json` | Canonical headline numbers (54 states, 8 pillars, 36,108 voyages, 18 dossiers, 1514–1866 observed years, 1501–1866 estimate years, 310 ethnic groups, 2015–2024 indicator snapshot, DOI, ORCID). |
| `research/sources.json` | Structured registry of primary institutional sources, clustering references, licenses, and URLs. |
| `research/datasets.json` | Array of the 8 foundational dataset files tracked by SHA-256 checksums. |
| `research/checksums.json` / `research/hashes.json` | Published SHA-256 digests and byte lengths for all 8 tracked datasets. |
| `research/rules.json` | Automated lint rules (`errors`, `warnings`, `codePatterns`) enforced across UI and docs. |
| `research/lint-baseline.json` | Warning ratchet baseline ensuring warning counts never increase across commits. |
| `research/methodology-copy.md` | Canonical 6-section plain-spoken methodology text. |
| `VOICE_AND_TONE.md` | Editorial style guide enforcing verifiable, non-promotional scholarly prose. |
| `CORRECTIONS.md` | Public errata and methodological corrections log. |
| `.github/ISSUE_TEMPLATE/data-correction.md` | Structured GitHub Issue template for reporting data, citation, or cartographic corrections. |
| `scripts/research-check.mjs` | Fast text, code-pattern, and SHA-256 lint check (`npm run research:check`). |
| `scripts/research-integrity.mjs` | Deep structural integrity verifier checking observation status flags, derivation notes, cross-file metadata sync, checksums, and warning ratchet (`npm run research:integrity`). |
| `.github/workflows/research-integrity.yml` | GitHub Actions CI gate running `research:check`, `research:integrity`, and TypeScript typechecking on every push and pull request. |

---

## 3. Developer Workflows

### Running the Integrity Suite Locally
```bash
npm run research:check
npm run research:integrity
```

### Updating a Tracked Dataset
When one of the 8 foundational datasets in `research/datasets.json` is intentionally updated:
1. Run `node scripts/research-integrity.mjs --update-checksums` to recompute SHA-256 digests and byte counts in `research/checksums.json`, `research/hashes.json`, and `src/data/methodologyDossierData.ts`.
2. Verify with `npm run research:integrity`.
3. Log any substantive data correction in `CORRECTIONS.md`.

### Adding an Editorial or Code Guardrail
Whenever a factual or editorial correction is made:
1. Add a matching entry to `research/rules.json` (`errors`, `warnings`, or `codePatterns`) so the issue cannot recur.
2. Record the correction in `CORRECTIONS.md`.
3. Run `npm run research:check` and `npm run research:integrity`.
