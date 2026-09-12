import React, { useState } from 'react';
import { AfricanRegion } from '../data/types';
import { HISTORICAL_REGIONAL_ROUTES, HistoricalTradeRoute } from '../data/regionalSpecializedAtlas';
import { getRegionTonalPalette, getRegionCalmColor } from '../data/unGeoschemeColors';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  BookOpen, 
  ArrowRightLeft, 
  Anchor, 
  Ship, 
  Landmark,
  Coins
} from 'lucide-react';

interface RegionalHistoricCorridorsSectionProps {
  region: AfricanRegion;
}

export const RegionalHistoricCorridorsSection: React.FC<RegionalHistoricCorridorsSectionProps> = ({
  region
}) => {
  const routes = HISTORICAL_REGIONAL_ROUTES[region] || [];
  const tonal = getRegionTonalPalette(region);
  const calmBg = getRegionCalmColor(region);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || '');

  const activeRoute: HistoricalTradeRoute | undefined = 
    routes.find(r => r.id === selectedRouteId) || routes[0];

  if (!routes || routes.length === 0) {
    return (
      <div 
        className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 text-center space-y-2 shadow-sm"
        style={{ backgroundColor: calmBg }}
      >
        <Compass className="w-8 h-8 mx-auto text-zinc-400" />
        <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Historical Corridors</h4>
        <p className="text-xs text-zinc-500">Historical trade corridor documentation for this zone is being compiled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Header Hero Plaque */}
      <div 
        className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-6 shadow-sm transition-colors"
        style={{ backgroundColor: calmBg }}
      >
        <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
              CLASSICAL & PRE-COLONIAL MERCANTILE NETWORKS
            </span>
          </div>
          <h3 className="font-extrabold text-xl md:text-2xl text-zinc-900 dark:text-zinc-100 font-display mt-1.5 flex items-center gap-2">
            <Compass className="w-5 h-5" style={{ color: tonal.warmAccent }} />
            {region} Historical Trade Corridors
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            Trans-Saharan caravan highways, Indian Ocean monsoon dhow trails, and indigenous riverine commerce
          </p>
        </div>

        {/* Route Selector MD3 Chips Ribbon */}
        <div className="flex flex-wrap items-center gap-2">
          {routes.map(r => {
            const isSelected = r.id === activeRoute?.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRouteId(r.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? `${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text} font-bold shadow-xs scale-[1.02]`
                    : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Route Detailed Exploration Card */}
      {activeRoute && (
        <div 
          className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-6 shadow-sm transition-colors"
          style={{ backgroundColor: calmBg }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
            <div>
              <div className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                {activeRoute.era}
              </div>
              <h4 className="font-extrabold text-xl text-zinc-900 dark:text-zinc-100 font-display mt-0.5">
                {activeRoute.name}
              </h4>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500 font-mono">Spans Regions:</span>
              {activeRoute.regions.map((reg, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200/60 dark:border-zinc-700/60"
                >
                  {reg}
                </span>
              ))}
            </div>
          </div>

          {/* Nodal Trade Hubs */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color: tonal.warmAccent }} />
              Nodal Caravan Oases & Metropolis Hubs
            </span>
            <div className="flex flex-wrap gap-2">
              {activeRoute.nodalHubs.map((hub, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100 text-xs font-semibold shadow-2xs flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tonal.warmAccent }} />
                  {hub}
                </span>
              ))}
            </div>
          </div>

          {/* Commodity Exchange Grid (Exports vs Imports) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Regional Exports */}
            <div className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-black/20 space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Coins className="w-4 h-4" />
                Regional Exports & Natural Wealth
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeRoute.exchangeCommodities.exports.map((item, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-medium border border-amber-200/80 dark:border-amber-800/60"
                  >
                    ✦ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Imported Transcontinental Goods */}
            <div className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-black/20 space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4" />
                Imported Transcontinental Goods
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeRoute.exchangeCommodities.imports.map((item, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 text-xs font-medium border border-cyan-200/80 dark:border-cyan-800/60"
                  >
                    ✧ {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Technology & Historical Significance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-black/20 space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <Ship className="w-3.5 h-3.5" />
                Transit & Navigation Technology
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {activeRoute.navigationTechnology}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-black/20 space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Historical Significance & Legacy
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {activeRoute.historicalSignificance}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
