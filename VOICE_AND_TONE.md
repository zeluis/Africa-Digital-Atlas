# Voice, Tone & Editorial Standards

This guide governs how the **Africa Data Atlas & Cartographic Observatory** describes its datasets, methods, cartography, and limitations across UI components and documentation.

---

## 1. Guiding Principle: Plain, Specific, and Verifiable

Write for researchers, students, journalists, and policy analysts who want to know **what a figure represents, where it came from, and what its limits are**.

- **Say what is checked, not that it is infallible.**
  - *Avoid*: "Zero manual tampering" or "Universal SHA-256 Checksum Verified".
  - *Prefer*: "Each foundational dataset has a published SHA-256 checksum computed at build time so you can confirm your copy matches the release."
- **Describe the dataset's actual structure.**
  - *Avoid*: "Real-time live feed that never invents statistics."
  - *Prefer*: "Curated 2015–2024 indicator snapshot with per-value status flags (`observed`, `estimated`, `forecast`, `derived`)."
- **Distinguish external databases from local summaries.**
  - *Avoid*: Claiming to host the entire raw SlaveVoyages database or raw human genomic sequences.
  - *Prefer*: "Summarizes 36,108 documented voyages (1514–1866) and 18 curated voyage dossiers from the SlaveVoyages trans-Atlantic database (2024.1 release), keeping observed, imputed, and continental estimate layers (1501–1866) distinct."
  - *Prefer*: "The 310 contemporary ethnic groups come from Wikipedia (retrieved 2026-01). Bird et al. (2023) and Tishkoff et al. (2009) are cited for their clustering framework only."

---

## 2. Prohibited Phrases (CI Errors)

The following strings are blocked in `research/rules.json` and fail `npm run research:check`:

| Blocked Phrase / Pattern | Required Replacement |
| :--- | :--- |
| `zero manual tampering` | State that each dataset has a published SHA-256 checksum so users can confirm their copy matches the release. |
| `Universal SHA-256 Checksum Verified` | Only display a verified state after `crypto.subtle.digest` has actually been computed in the browser. |
| `Sovereign Geospatial Intelligence` | Use a descriptive subtitle: *"An interactive atlas of geography, indicators and historical trade flows"*. |
| `doesn't invent its own statistics` | State that indicators are a curated 2015–2024 snapshot with per-value status flags. |
| `1501–1867` | Use `1514–1866` for documented voyages; use `1501–1866` for continental demographic estimates. |
| `6 Thematic Pillar` | The Atlas has **8 thematic pillars** (`research/facts.json`). |
| `ISSN` | Use the universal Figshare DOI (`https://doi.org/10.6084/m9.figshare.34065711`) and ORCID (`0000-0001-9421-6555`). |

---

## 3. Discouraged Promotional Terms (Tracked by Warning Ratchet)

The following words trigger warnings in `research/rules.json` and are capped by `research/lint-baseline.json` so their usage can only decrease over time:

- `authoritative` → Prefer `curated`, `documented`, `canonical`, or name the specific institution (e.g., *World Bank WDI*, *UN M49*).
- `unprecedented` → Omit, or state the specific historical comparison.
- `definitive` → Prefer `current best`, `comprehensive`, or state the scope.
- `forensic` → Prefer `detailed`, `archival`, or describe the verification method.
- `flawless` → Omit.
- `scientific reproducibility` → State specifically what can be reproduced and how (e.g., build-time SHA-256 checksums, status-flagged JSON/CSV exports).
