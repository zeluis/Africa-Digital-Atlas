<!-- gitbook-agent-instructions:start -->

## GitBook Documentation Editing

This repository contains documentation synced with GitBook via Git Sync.

Before editing GitBook-synced Markdown, YAML, or asset files, make sure the GitBook skill is available and up to date in your local agent environment. Prefer installing or updating it with:

```bash
npx skills add gitbookio/gitbook-skills
```

This command may add or update local agent skill files. Use them only as local agent instructions; do not commit those installed skill files or any tool-generated agent configuration unless the user explicitly asks for it.

If `npx` is unavailable, load the skill from:

https://gitbook.com/docs/skill.md

When making changes, preserve GitBook sync metadata such as frontmatter, `SUMMARY.md`, `gitbook-docs.yaml`, `.gitbook/`, and asset links unless the requested edit explicitly requires changing them.

<!-- gitbook-agent-instructions:end -->

# Africa Data Atlas — Project Guidelines & Cartographic Conventions

## 1. SVG Color Fidelity & Palette Integrity
- **Original Vector Colors**: Always preserve and prioritize the exact original hex colors extracted directly from `public/africa-final.svg` (`originalColor` / `originalClass` in `src/data/africaFinalGeometry.ts` and `src/data/africaFinalMapData.json`). No compromises.
- **Derived Choropleth Scales**: In choropleth metric mode for the authentic map, derive alpha-modulated tonal ramps directly from each country's authoritative SVG base color.
- **Schematic UN Geoscheme Separation**: The schematic map layer on the Overview page strictly adheres to the 5 UN M49 macro-geoscheme regional colors (Northern Africa, Western Africa, Central Africa, Eastern Africa, Southern Africa).

## 2. Cartographic Engine & Coordinate Systems
- **Authentic Engine (`AfricaMapFinalLayer.tsx`)**: Operates in the native $5796 \times 5867$ coordinate space of `africa-final.svg` with 1,017 Admin-1 provincial/state internal boundary paths and calculated centroid-anchored country labels.
- **Hairline Precision**: All graticule lines (Prime Meridian, Equator, Tropics) and the nautical compass rose must maintain hairline stroke widths (`0.5px` - `1.5px`) with high-contrast light theme styling.
- **Country Label Positioning**: Labels must be placed within their respective country bounds using computed centroids and scaled dynamically based on land area classification (`huge`, `large`, `medium`, `small`).

## 3. UI/UX & Interaction Model
- **Theme**: Default to high-contrast, polished light mode across the application (`light` class on `<html>`).
- **Tooltip Panning & Pinning**: Clicking a country pins the interactive tooltip in place to inspect macro indicators and allows navigating to the full "Country Dossier" view via explicit CTA.
- **Responsive Controls**: Provide instant toggle controls for Graticule & Compass Rose, Admin-1 Subdivisions, Regional Economic Blocs (ECOWAS, SADC, EAC, AMU, ECCAS, COMESA), and High-Resolution PNG export.

## 4. Universal Audit & Engineering Standards (Strict Compliance)
All views, modals, master reports, and drawer components must strictly comply with `docs/UNIVERSAL_AUDIT_SPECIFICATION.md`:
- **Semantic HTML & ARIA**: Use `<section aria-label="...">` or `<article>` for roots; implement complete `role="tablist"` / `role="tab"` / `role="tabpanel"` on all tabbed systems; provide keyboard pan/zoom (`Arrow` keys, `+`/`-`, `0`, `F`).
- **Focus & Motion**: Visible high-contrast `:focus-visible` rings (2px offset) and `@media (prefers-reduced-motion: reduce)` compliance.
- **Proportions**: Split viewers (`ArchivalImageViewer`, `AfricanPortsMap`) must strictly follow `w-full lg:w-7/12 xl:w-2/3` vs `w-full lg:w-5/12 xl:w-1/3` (summing to 100% flush with zero margin gap). Minimaps must dynamically offset (`bottom-[102px]` vs `bottom-4`) to prevent collision.
- **Zero-Pill Discipline**: No pill capsules on static text metadata. Use clean unboxed text with `·` interpuncts. Pills are reserved for interactive buttons.
- **Web Vitals**: Prevent CLS with explicit aspect ratios or min-heights; use `decoding="async"` on images; pan/zoom must use `requestAnimationFrame`.

## 5. Epistemic Provenance & Lexicon Enforcement (`research/rules.json`)
Before modifying text or documentation in `src/`, `docs/`, `documentation/`, `help-center/`, `api-reference/`, `home/`, or `README.md`:
- **Banned Words & Ratchet Violations**: Never use prohibited terms from `research/rules.json` ("authoritative", "definitive", "unprecedented", "forensic", "flawless", "scientific reproducibility", "zero manual tampering").
- **Approved Substitutions**: Prefer "curated", "documented", "canonical", "current best", or cite the specific institutional source directly (e.g. World Bank, SlaveVoyages Consortium, IMF).
- **Automated Verification**: Always verify changes by running `npm run research:check` and `npm run research:integrity` to guarantee zero errors and zero warnings against `research/lint-baseline.json`.


