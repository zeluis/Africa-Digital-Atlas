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

