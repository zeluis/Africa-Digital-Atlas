---
icon: draw-polygon
---

# SVG Geography Engine

The map is rendered as hand-calibrated pure SVG path geometry — not raster tiles — which keeps the platform fully functional offline and lightweight to cache in the PWA service worker.

## Key design points

* **Custom projection tuned for Africa** — the coordinate space is fitted to the continental landmass and its island territories, rather than reusing a generic world-map projection, to maximize on-screen resolution for the region that matters.
* **Micro-state anchor callouts** — island and micro-states (Cabo Verde, São Tomé and Príncipe, Comoros, Mauritius, Seychelles) are too small to reliably tap at continental zoom, so each carries a fixed-position anchor ring with a minimum 44px hit target, satisfying WCAG touch-target guidance.
* **Layered path groups** — borders, fills, and label anchors are separated into distinct SVG groups so choropleth recoloring never needs to touch border stroke paths.
