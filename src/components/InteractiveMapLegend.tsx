import React from 'react';
import { UN_GEOSCHEME_REGIONS } from '../data/africaData';
import { AfricanRegion } from '../data/types';
import { Eye, EyeOff, Compass, RotateCcw, ZoomIn, ZoomOut, Layers } from 'lucide-react';

export interface InteractiveMapLegendProps {
  visibleRegions: Set<AfricanRegion>;
  onToggleRegion: (region: AfricanRegion) => void;
  onShowAll: () => void;
  onHideAll: () => void;
  onIsolateRegion: (region: AfricanRegion) => void;
  activeHoverRegion: AfricanRegion | null;
  onHoverRegion: (region: AfricanRegion | null) => void;
  zoomLevel?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onFocusRegion?: (region: AfricanRegion) => void;
  className?: string;
  embedded?: boolean;
  showZoomControls?: boolean;
  exportControls?: React.ReactNode;
}

interface SubregionPillDef {
  id: AfricanRegion | 'All';
  label: string;
  fullName: string;
  count: number;
  color: string;
  activeBorderColor: string;
}

const SUBREGION_PILL_DEFS: SubregionPillDef[] = [
  {
    id: 'All',
    label: 'All',
    fullName: 'All 54 African Nations',
    count: 54,
    color: '#10b981',
    activeBorderColor: 'ring-emerald-500/60'
  },
  {
    id: 'Northern Africa',
    label: 'Northern',
    fullName: 'Northern Africa',
    count: 7,
    color: '#F59E0B',
    activeBorderColor: 'ring-amber-400'
  },
  {
    id: 'Western Africa',
    label: 'Western',
    fullName: 'Western Africa',
    count: 16,
    color: '#10B981',
    activeBorderColor: 'ring-emerald-400'
  },
  {
    id: 'Central Africa',
    label: 'Central',
    fullName: 'Central Africa',
    count: 9,
    color: '#6366F1',
    activeBorderColor: 'ring-indigo-400'
  },
  {
    id: 'Eastern Africa',
    label: 'Eastern',
    fullName: 'Eastern Africa',
    count: 18,
    color: '#F97316',
    activeBorderColor: 'ring-orange-400'
  },
  {
    id: 'Southern Africa',
    label: 'Southern',
    fullName: 'Southern Africa',
    count: 5,
    color: '#F43F5E',
    activeBorderColor: 'ring-rose-400'
  }
];

export const InteractiveMapLegend: React.FC<InteractiveMapLegendProps> = ({
  visibleRegions,
  onToggleRegion,
  onShowAll,
  onHideAll,
  onIsolateRegion,
  activeHoverRegion,
  onHoverRegion,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFocusRegion,
  className = '',
  embedded = false,
  showZoomControls = true,
  exportControls
}) => {
  const allVisible = visibleRegions.size === 5;
  const isSingleIsolated = visibleRegions.size === 1;

  const handlePillClick = (item: SubregionPillDef) => {
    if (item.id === 'All') {
      onShowAll();
      if (onResetZoom) onResetZoom();
    } else {
      // If clicking already isolated region, revert to show all & reset zoom; otherwise isolate and focus on this region
      if (visibleRegions.size === 1 && visibleRegions.has(item.id)) {
        onShowAll();
        if (onResetZoom) onResetZoom();
      } else {
        onIsolateRegion(item.id);
        if (onFocusRegion) {
          onFocusRegion(item.id);
        }
      }
    }
  };

  const containerClasses = embedded
    ? `w-full ${className}`
    : `rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 p-3 sm:p-3.5 shadow-xl backdrop-blur-md ${className}`;

  return (
    <div className={containerClasses} id={embedded ? "embedded-subregions-panel" : "unified-africa-map-control-card"}>
      {/* Sleek Single Row: Subregion Filter Pills + Zoom Controls & Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left / Center: Subregion Filter Pills Bar */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Leading UN Subregions Title and Badge */}
          <div className="flex items-center gap-1.5 mr-1 py-1 px-2 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 select-none">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>UN Subregions</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              {visibleRegions.size}/5
            </span>
          </div>

          {SUBREGION_PILL_DEFS.map(pill => {
            const isAll = pill.id === 'All';
            const regionId = pill.id as AfricanRegion;
            const isVisible = isAll ? allVisible : visibleRegions.has(regionId);
            const isIsolated = !isAll && isSingleIsolated && visibleRegions.has(regionId);
            const isHovered = !isAll && activeHoverRegion === regionId;

            return (
              <div
                key={pill.id}
                onMouseEnter={() => {
                  if (!isAll) onHoverRegion(regionId);
                }}
                onMouseLeave={() => {
                  if (!isAll) onHoverRegion(null);
                }}
                className={`group inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-xl text-xs font-semibold tracking-normal transition-all select-none border cursor-pointer ${
                  isAll
                    ? allVisible
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-xs ring-1 ring-emerald-500/40 font-bold'
                      : 'bg-zinc-100/90 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
                    : isIsolated
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-xs ring-1 ' + pill.activeBorderColor + ' font-bold'
                      : isVisible
                        ? isHovered
                          ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-white border-zinc-300 dark:border-zinc-600 shadow-xs ring-1 ' + pill.activeBorderColor
                          : 'bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 border-zinc-200/90 dark:border-zinc-800 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/80 shadow-xs'
                        : 'bg-zinc-100/40 dark:bg-zinc-900/30 text-zinc-400 dark:text-zinc-500 border-zinc-200/50 dark:border-zinc-800/50 opacity-60 hover:opacity-100'
                }`}
              >
                {/* Main Click Target: Filter / Isolate / Zoom to Region */}
                <button
                  type="button"
                  onClick={() => handlePillClick(pill)}
                  className="flex items-center gap-1.5 cursor-pointer text-left focus:outline-none"
                  title={isAll ? 'Display all 54 African nations' : `Focus ${pill.fullName}`}
                >
                  {/* Visual Color Dot */}
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125 ${
                      isVisible ? 'ring-1 ring-white/40 shadow-xs' : 'opacity-40'
                    }`}
                    style={{ backgroundColor: pill.color }}
                  />

                  {/* Prominent Label (All, Northern, Western, Central, Eastern, Southern) */}
                  <span className="whitespace-nowrap font-bold text-xs">
                    {pill.label}
                  </span>

                  {/* Nation Count Badge */}
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded transition-colors ${
                      (isAll && allVisible) || isIsolated
                        ? 'bg-white/20 text-current dark:bg-black/20'
                        : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {pill.count}
                  </span>
                </button>

                {/* Multi-Select Eye Toggle Button (for individual subregions) */}
                {!isAll && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRegion(pill.id as AfricanRegion);
                    }}
                    className="p-0.5 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    title={isVisible ? `Hide ${pill.label}` : `Show ${pill.label}`}
                    aria-label={isVisible ? `Hide ${pill.label}` : `Show ${pill.label}`}
                  >
                    {isVisible ? (
                      <Eye className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-zinc-400 dark:text-zinc-600" />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Interactive Zoom (+ / -), Zoom % Pill & Reset Actions on same row */}
        {showZoomControls && (
          <div className="flex items-center gap-1.5 text-xs flex-wrap shrink-0 ml-auto">
            {/* Zoom In & Out Control Group */}
            <div className="flex items-center rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-0.5">
              <button
                type="button"
                onClick={onZoomOut}
                className="p-1 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Zoom Out (-)"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              {zoomLevel !== undefined && (
                <span className="px-1.5 font-mono font-bold text-[11px] text-emerald-600 dark:text-emerald-400 min-w-[2.6rem] text-center select-none">
                  {Math.round(zoomLevel * 100)}%
                </span>
              )}

              <button
                type="button"
                onClick={onZoomIn}
                className="p-1 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Zoom In (+)"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onShowAll();
                if (onResetZoom) onResetZoom();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/80 dark:border-emerald-800/60 transition-all font-semibold cursor-pointer text-xs active:scale-95 shadow-xs"
              title="Reset to Full Continent view"
            >
              <RotateCcw className="w-3 h-3 text-emerald-500" />
              <span>Reset</span>
            </button>

            {/* Injected PNG/SVG Export Controls right after Reset button */}
            {exportControls}

            <button
              type="button"
              onClick={allVisible ? onHideAll : onShowAll}
              className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors text-[11px] font-medium cursor-pointer border border-zinc-200 dark:border-zinc-800"
              title={allVisible ? 'Hide all subregions' : 'Show all subregions'}
            >
              {allVisible ? 'Hide All' : 'Show All'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
