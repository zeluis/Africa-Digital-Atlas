---
icon: shield-check
---

# Universal Audit & Engineering Specification

A rigorous five-pillar specification governing all views, interactive maps, modals, master reports, and drawer components within the **Africalia (Africa Data Atlas)** platform.

## Pillar I: Semantic HTML & Accessibility Architecture (WCAG 2.2 AAA/AA)

* **Structural Landmarks**: Every top-level view must declare `<section aria-label="...">` or `<article aria-label="...">`. Toolbars must use `<header>` and `<div role="toolbar">`. Inspection panels must use `<aside aria-label="...">`.
* **ARIA Tab Semantics**: Every multi-tab system must declare `role="tablist"` on the container, `role="tab"` with `aria-selected` and `aria-controls` on triggers, and `role="tabpanel"` on content views.
* **Universal Keyboard Cartographic Controls**:
  * `ArrowLeft` / `ArrowRight` / `ArrowUp` / `ArrowDown`: Pan canvas by 12% increments.
  * `+` / `=`: Step zoom in (+20%).
  * `-` / `_`: Step zoom out (-25%).
  * `0`: Reset to calibrated overview coordinates.
  * `F` / `f`: Toggle fullscreen.
  * `Alt + ← / →`: Step through chronological/geographic sequence.
  * `Escape`: Dismiss open drawer or close inspection mode.
* **High-Contrast Focus Rings**: All interactive controls must render a visible 2px offset focus ring (`#d97706` light / `#fbbf24` dark).
* **Motion Sensitivity**: Strictly honor `@media (prefers-reduced-motion: reduce)`.

## Pillar II: Spatial Layout & Proportional Mathematics

* **Split-Viewport Proportional Invariant**: Dual-pane viewers (`ArchivalImageViewer`, `AfricanPortsMap`) must strictly enforce:
  * Left Canvas: `w-full lg:w-7/12 xl:w-2/3`
  * Right Drawer: `w-full lg:w-5/12 xl:w-1/3`
  * Combined total equals exactly 100%, flush with the right edge and zero empty gaps.
* **Nested Radius Concentricity**: $r_{\text{inner}} = r_{\text{outer}} - \text{padding}$.
* **Collision-Free Offsetting**: Radar minimaps and floating widgets must shift offsets dynamically based on tray states (`bottom-[102px]` vs. `bottom-4`).
* **Viewport Real-Estate**: Full-height cartographic workspaces must mount `hide-app-footer` to remove the global footer.

## Pillar III: Web Vitals & Runtime Performance

* **Cumulative Layout Shift (CLS < 0.02)**: Explicit `aspect-ratio` or `min-height` on all charts and canvases.
* **Largest Contentful Paint (LCP < 1.2s)**: `decoding="async"` on images, `loading="lazy"` on thumbnails, and precomputed vector coordinates.
* **Interaction to Next Paint (INP < 100ms)**: Canvas containers enforce `touch-none` and non-passive `{ passive: false }` wheel listeners, with animations running on `requestAnimationFrame` with ease-out cubic interpolation.

## Pillar IV: Typographic Pairings & Anti-Slop Discipline

* **Three-Tier Font Pairing**: `Noto Serif Display` (editorial serif), `Plus Jakarta Sans` (interface sans), and `JetBrains Mono` (tabular figures).
* **Zero-Pill Rule**: Informational metadata (dates, counts, authors) must be rendered as clean unboxed text with interpuncts (`·`). Pill capsules are reserved strictly for interactive clickable buttons.
* **Human Editorial Numbering**: Clean editorial numbering (`01. Overview`, `02. African Forts & Enclaves Map`) instead of mechanical code comments (`// 01`).

## Pillar V: Color Fidelity & Contrast Ratios (WCAG AAA)

* **Strict Contrast Thresholds**: Primary ink achieves >14:1 AAA on parchment/slate. Secondary text achieves >4.5:1 AA.
* **Curated Hex Preservation**: Exact hex values preserved from `africa-final.svg` and UN Geoscheme regional standards, using alpha bloom (8% to 14%) for derived fills.
