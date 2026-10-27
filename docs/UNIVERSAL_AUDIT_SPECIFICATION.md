# AFRICALIA UNIVERSAL AUDIT & ENGINEERING SPECIFICATION
**A Rigorous Standard for Semantic HTML, Responsive CSS, Web Vitals, Typography & WCAG 2.2 Accessibility**

*Author & Scientific Curator: **Zéluis F. Correia***  
*Standard Version: 2026.1 • Permanent Engineering Constitution*

---

## 🏛️ OVERVIEW & SCOPE

This specification governs all views, interactive maps, modals, master reports, and drawer components within the **Africalia (Africa Data Atlas)** platform. Every engineering implementation must satisfy the invariants defined across these five pillars prior to deployment.

```
┌────────────────────────────────────────────────────────────────────────┐
│               AFRICALIA UNIVERSAL AUDIT SPECIFICATION                  │
├─────────────────┬─────────────────┬──────────────────┬─────────────────┤
│    PILLAR I     │    PILLAR II    │    PILLAR III    │    PILLAR IV    │
│  Semantic HTML  │   Modern CSS    │   Web Vitals &   │   Typography &  │
│  & Accessibility│  & Proportions  │   Performance    │  Editorial Math │
└─────────────────┴─────────────────┴──────────────────┴─────────────────┘
```

---

## 🧭 PILLAR I: SEMANTIC HTML & ARIA ARCHITECTURE (WCAG 2.2 AAA/AA)

### 1.1 Structural Landmarks
Every top-level view and composite container must declare semantic HTML5 landmarks:
- **Root Container**: Render as `<section aria-label="...">` or `<article aria-label="...">`. Never use generic, unlabelled `<div>` tags for primary content domains.
- **Top Bar / Header**: Encapsulate within `<header>` elements. Control strips must declare `role="toolbar" aria-label="..."`.
- **Slide-out Panels & Drawers**: Render collapsible inspection panels, citation drawers, and historical dossiers as `<aside aria-label="...">`.
- **Primary Content Workspace**: Render within `<main id="main-content-workspace">` and maintain an accessible skip-link (`<a href="#main-content-workspace" className="skip-link">Skip to main content</a>`).

### 1.2 Multi-Tab Navigation Architecture (ARIA Tablist Standard)
Any segmented sub-view, tabbed drawer, or report carousel must implement the complete WAI-ARIA tab pattern:
```tsx
// ✅ REQUIRED TABLIST PATTERN
<nav role="tablist" aria-label="Research Modules">
  {tabs.map((tab) => {
    const isActive = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        role="tab"
        id={`tab-${tab.id}`}
        aria-selected={isActive}
        aria-controls={`panel-${tab.id}`}
        tabIndex={isActive ? 0 : -1}
        onClick={() => setActiveTab(tab.id)}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        {tab.label}
      </button>
    );
  })}
</nav>

// MATCHING TABPANEL
<div
  role="tabpanel"
  id={`panel-${activeTab}`}
  aria-labelledby={`tab-${activeTab}`}
  className="w-full flex-1"
>
  {/* Content */}
</div>
```

### 1.3 Universal Keyboard Cartographic Navigation
All high-precision cartography tools, GIS canvases, and archival image viewers must support keyboard operation without requiring a pointing device:
| Key | Operation | Formula / Behavior |
| :--- | :--- | :--- |
| **`ArrowLeft`** | Pan West / Left | Decrement viewport X by $12\%$ of current viewBox width |
| **`ArrowRight`** | Pan East / Right | Increment viewport X by $12\%$ of current viewBox width |
| **`ArrowUp`** | Pan North / Up | Decrement viewport Y by $12\%$ of current viewBox height |
| **`ArrowDown`** | Pan South / Down | Increment viewport Y by $12\%$ of current viewBox height |
| **`+` or `=`** | Step Zoom In | Scale viewBox width and height by $0.80\times$ (centered on viewBox origin) |
| **`-` or `_`** | Step Zoom Out | Scale viewBox width and height by $1.25\times$ |
| **`0`** | Reset Frame | Animate viewBox back to the calibrated overview coordinates |
| **`F` / `f`** | Toggle Fullscreen | Trigger HTML5 Fullscreen API on root element |
| **`Alt + ← / →`** | Step Sequence | Move to previous or next chronological/geographic item |
| **`Escape`** | Dismiss / Reset | Close open drawers or exit active modal inspect mode |

### 1.4 High-Contrast Focus Rings
Every interactive control (`<button>`, `<a>`, `<input>`, `<select>`, and canvases with `tabIndex={0}`) must display high-contrast focus rings on keyboard navigation:
```css
:focus-visible {
  outline: 2px solid #d97706 !important;
  outline-offset: 2px !important;
}
.dark :focus-visible {
  outline: 2px solid #fbbf24 !important;
  outline-offset: 2px !important;
}
:focus:not(:focus-visible) {
  outline: none;
}
```

### 1.5 Motion Sensitivity Protocol
Adhere strictly to user vestibular motion preferences:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 🎨 PILLAR II: SPATIAL MATHEMATICS, RATIOS & LAYOUT INTEGRITY

### 2.1 The Split-Viewport Proportional Invariant
In composite inspection viewers featuring a primary canvas and a collapsible right dossier drawer (such as `ArchivalImageViewer.tsx` and `AfricanPortsMap.tsx`), widths must strictly sum to $100\%$ on large displays without gap anomalies:
- **Left Canvas**: `w-full lg:w-7/12 xl:w-2/3`
- **Right Dossier Drawer**: `w-full lg:w-5/12 xl:w-1/3`
- **Collapsed Canvas**: `w-full` (expands to $100\%$ when the drawer is closed)
- **Zero-Inline Conflict**: Do not animate `width: 'auto'` via framer-motion inline styles on percentage drawers, as inline styles override CSS breakpoint classes and introduce empty right-edge margins. Use conditional JSX `{isMetadataOpen && (<aside className="w-full lg:w-5/12 xl:w-1/3 ...">)}`.

### 2.2 Nested Radius Mathematics
All container-child component relationships must respect optical corner concentricity:
$$r_{\text{inner}} = r_{\text{outer}} - \text{padding}$$
*(Example: A card with `rounded-3xl` (24px) and 8px padding must use `rounded-2xl` (16px) on its inner well).*

### 2.3 Collision-Free Dynamic Offsetting
Secondary status widgets (e.g. Radar Minimap, floating drawer pills, legend handles) must never collide with or be obscured by collapsible trays. Offsets must compute dynamically:
```tsx
className={`absolute left-4 z-20 transition-all duration-300 ${
  isFilmstripOpen ? 'bottom-[102px]' : 'bottom-4'
}`}
```

### 2.4 Viewport Screen Real-Estate Optimization
Immersive cartographic workspaces that require full viewport height must mount a lifecycle hook appending `hide-app-footer` to `document.body`:
```tsx
useEffect(() => {
  document.body.classList.add('hide-app-footer');
  return () => {
    document.body.classList.remove('hide-app-footer');
  };
}, []);
```

---

## ⚡ PILLAR III: WEB VITALS & RUNTIME PERFORMANCE

### 3.1 Cumulative Layout Shift (CLS < 0.02)
- Explicit Aspect Ratios: Every chart (`ResponsiveContainer`), image plate, and canvas wrapper must declare an explicit aspect ratio (`aspect-[4/3]`, `aspect-[16/9]`) or min-height (`min-h-[640px]`).
- Font Display: All web font links in `index.html` must include `&display=swap` to eliminate Flash of Invisible Text (FOIT).

### 3.2 Largest Contentful Paint (LCP < 1.2s)
- Image Plates: All archival illustrations and raster maps must declare `decoding="async"`. Off-screen thumbnails in filmstrip carousels must specify `loading="lazy"`.
- Precomputed Vector Geometry: Continental boundary coordinates must be imported from pre-indexed TypeScript geometry arrays (`africaFinalGeometry.ts`, `authenticEthnicTreeSvg.ts`) rather than parsed from runtime GeoJSON or network fetch chains.

### 3.3 Interaction to Next Paint (INP < 100ms) & 60 FPS Animation
- **Gesture Isolation**: Canvas containers must enforce `touch-action: none` (`touch-none`) and register non-passive `{ passive: false }` wheel event listeners that call `e.preventDefault()`, eliminating page scroll chaining.
- **`requestAnimationFrame` Interpolation**: Continuous panning and zoom animations must calculate delta transformations through `requestAnimationFrame` using ease-out cubic interpolation:
  $$f(t) = 1 - (1 - t)^3 \quad \text{where } t = \min\left(1, \frac{\Delta t}{\text{duration}}\right)$$

---

## ✒️ PILLAR IV: TYPOGRAPHIC HARMONY & EDITORIAL DISCIPLINE

### 4.1 The Three-Tier Font Pairings
| Family | Font Stack | Weight Range | Usage |
| :--- | :--- | :--- | :--- |
| **Display Serif** | `Noto Serif Display`, Georgia, serif | 600, 700, 800 | Section titles, historic port enclaves, archival headers |
| **Interface Sans** | `Plus Jakarta Sans`, system-ui, sans-serif | 400, 500, 600, 700 | Primary UI, navigation items, prose, button labels |
| **Tabular Mono** | `JetBrains Mono`, Menlo, monospace | 500, 700, 800 | Numerical statistics, coordinates, captive counts (`+12M`) |

### 4.2 Zero-Pill & Metadata Discipline
- **Static Metadata (No Pills)**: Informational labels (publication dates, authors, categories, counts) must be rendered as clean, unboxed typography separated by subtle typographical marks (`·` or `/`). Never enclose passive text in bordered pill capsules.
- **Interactive Controls (Buttons Permitted)**: Segmented filter buttons and tab triggers that invoke client-side filtering are functional `<button>` elements with subtle, flat active states.
- **Human Editorial Numbering**: Use natural editorial numbering (`01. Overview`, `02. African Forts & Enclaves Map`). Never use mechanical code-comment headers (`// 01_OVERVIEW`, `>_ DISCOVER`).

---

## 🌈 PILLAR V: COLOR FIDELITY & CONTRAST RATIOS (WCAG AAA)

### 5.1 Strict WCAG Contrast Thresholds
- **Primary Ink (Light)**: `--text-primary: #191816` on `--surface-canvas: #FAF8F5` achieves **16.2:1** (WCAG AAA).
- **Secondary Ink (Light)**: `--text-secondary: #4E5E51` on `--surface-card: #FFFFFF` achieves **6.8:1** (WCAG AA).
- **Primary Ink (Dark)**: `--text-primary: #F8FAFC` on `--surface-canvas: #0F1218` achieves **17.4:1** (WCAG AAA).
- **Card Backgrounds (Dark)**: Distinct $+5.5\%$ lightness elevation step (`#181D26`) over viewport canvas (`#0F1218`).

### 5.2 UN M49 Geoscheme & Coastal Corridor Hex Preservation
Cartographic fills must never use randomized pastels. Colors must strictly derive from primary multilateral standards and public/africa-final.svg:
- **UN Geoscheme Regions**:
  - Northern Africa: `#1802FF` (Royal Blue)
  - Western Africa: `#00FF00` (Emerald Green)
  - Central Africa: `#FF00FE` (Magenta)
  - Eastern Africa: `#FFA500` (Rift Ochre)
  - Southern Africa: `#FF0A0A` (Crimson)
- **Coastal Embarkation Corridors**:
  - Senegambia: `#0284c7` (Sky 600)
  - Sierra Leone: `#059669` (Emerald 600)
  - Windward Coast: `#10b981` (Emerald 500)
  - Gold Coast: `#d97706` (Sahel Ochre 600)
  - Bight of Benin: `#ea580c` (Orange 600)
  - Bight of Biafra: `#dc2626` (Red 600)
  - West Central Africa: `#7c3aed` (Violet 600)
  - Southeast Africa: `#4338ca` (Indigo 700)
- Tonal fills must be created by applying strict alpha bloom (`rgba(..., 0.08)` to `rgba(..., 0.14)`) directly to the curated hex codes.

---

## 📋 PRE-DEPLOYMENT AUDIT CHECKLIST

Before any module, view, or report PR is finalized, verify every item:
- [ ] **Semantic HTML**: Does the root use `<section>` / `<article>` with an `aria-label`?
- [ ] **ARIA Tabs**: Are tab containers configured with `role="tablist"` and tabs with `role="tab"`, `aria-selected`, `aria-controls`?
- [ ] **Keyboard Panning**: Does the cartographic viewer support arrow keys, `+`/`-`, `0`, and `F`?
- [ ] **Focus Rings**: Does every interactive element render a 2px offset focus ring on keyboard tab navigation?
- [ ] **Motion Preference**: Is `@media (prefers-reduced-motion: reduce)` respected?
- [ ] **Proportions**: Does the split viewer enforce `7/12` vs `5/12` (or `2/3` vs `1/3`) without gaps?
- [ ] **Anti-AI-Slop**: Are static metadata tags rendered as clean text rather than pill capsules?
- [ ] **Contrast**: Do all body text pairs meet at least 4.5:1 (AA) and headline pairs 7:1 (AAA)?
- [ ] **Performance**: Do all images have `decoding="async"` and non-critical assets `loading="lazy"`?
- [ ] **Build Verification**: Does `npm run lint` and `npm run build` pass with zero errors?

---

*Curated by Zéluis F. Correia • Africalia Observatory • Standard Reference 2026*
