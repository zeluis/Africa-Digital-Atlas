import React from 'react';
import { UN_GEOSCHEME_REGIONS } from '../data/africaData';
import { AfricanRegion } from '../data/types';
import { Eye, EyeOff, CheckSquare, Square, Filter, RefreshCw } from 'lucide-react';

interface InteractiveMapLegendProps {
  visibleRegions: Set<AfricanRegion>;
  onToggleRegion: (region: AfricanRegion) => void;
  onShowAll: () => void;
  onHideAll: () => void;
  onIsolateRegion: (region: AfricanRegion) => void;
  activeHoverRegion: AfricanRegion | null;
  onHoverRegion: (region: AfricanRegion | null) => void;
  className?: string;
}

export const InteractiveMapLegend: React.FC<InteractiveMapLegendProps> = ({
  visibleRegions,
  onToggleRegion,
  onShowAll,
  onHideAll,
  onIsolateRegion,
  activeHoverRegion,
  onHoverRegion,
  className = ''
}) => {
  const allRegions = Object.values(UN_GEOSCHEME_REGIONS);
  const allVisible = allRegions.every(r => visibleRegions.has(r.id));
  const noneVisible = visibleRegions.size === 0;

  return (
    <div className={`rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 p-3.5 shadow-lg backdrop-blur-md space-y-3 ${className}`}>
      {/* Legend Header with Controls */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono">
            UN Geoscheme Regions
          </span>
          <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded-md">
            {visibleRegions.size}/{allRegions.length} Active
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={allVisible ? onHideAll : onShowAll}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors font-medium cursor-pointer border border-zinc-200 dark:border-zinc-800"
            title={allVisible ? 'Hide all regions' : 'Show all regions'}
          >
            {allVisible ? <EyeOff className="w-3 h-3 text-zinc-400" /> : <Eye className="w-3 h-3 text-emerald-500" />}
            <span>{allVisible ? 'Hide All' : 'Show All'}</span>
          </button>
        </div>
      </div>

      {/* Region Toggle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {allRegions.map(reg => {
          const isVisible = visibleRegions.has(reg.id);
          const isHovered = activeHoverRegion === reg.id;

          return (
            <div
              key={reg.id}
              onMouseEnter={() => onHoverRegion(reg.id)}
              onMouseLeave={() => onHoverRegion(null)}
              className={`group flex items-center justify-between p-2 rounded-xl border transition-all select-none ${
                isVisible
                  ? isHovered
                    ? `${reg.palette.bgBadge} ${reg.palette.borderBadge} ring-1 ring-emerald-500/50 shadow-md`
                    : 'bg-zinc-50/80 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  : 'bg-zinc-100/40 dark:bg-zinc-900/20 border-zinc-200/50 dark:border-zinc-800/40 opacity-50'
              }`}
            >
              <button
                onClick={() => onToggleRegion(reg.id)}
                className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer"
                title={`Toggle visibility for ${reg.name}`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-md flex-shrink-0 shadow-xs transition-transform ${
                    isVisible ? 'scale-100 ring-1 ring-white/20' : 'scale-90 opacity-40'
                  }`}
                  style={{ background: reg.palette.primary }}
                />
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-bold truncate ${isVisible ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-600 line-through'}`}>
                    {reg.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                    {reg.memberCountries.length} Nations
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-1 pl-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onIsolateRegion(reg.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 transition-opacity cursor-pointer"
                  title={`Isolate ${reg.name} (Hide others)`}
                >
                  Isolate
                </button>
                <button
                  onClick={() => onToggleRegion(reg.id)}
                  className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  {isVisible ? (
                    <Eye className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
