import React, { useState } from 'react';
import { AfricanRegion } from '../data/types';
import { REGIONAL_TRADE_PROFILES, RegionalTradeCorridor } from '../data/regionalSpecializedAtlas';
import { getRegionTonalPalette, getRegionCalmColor } from '../data/unGeoschemeColors';
import { 
  TrendingUp, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  FileText, 
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface RegionalAfcftaTradeSectionProps {
  region: AfricanRegion;
  onSelectCountry?: (countryId: string) => void;
}

export const RegionalAfcftaTradeSection: React.FC<RegionalAfcftaTradeSectionProps> = ({
  region,
  onSelectCountry
}) => {
  const profile = REGIONAL_TRADE_PROFILES[region];
  const tonal = getRegionTonalPalette(region);
  const calmBg = getRegionCalmColor(region);
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>(
    profile?.corridors[0]?.id || ''
  );

  if (!profile) return null;

  const activeCorridor: RegionalTradeCorridor | undefined = 
    profile.corridors.find(c => c.id === selectedCorridorId) || profile.corridors[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. AfCFTA Macro Regional Trade Overview Hero Card */}
      <div 
        className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-6 shadow-sm transition-colors"
        style={{ backgroundColor: calmBg }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                AfCFTA & INTRA-REGIONAL TRADE FLOW VECTORS
              </span>
            </div>
            <h3 className="font-extrabold text-xl md:text-2xl text-zinc-900 dark:text-zinc-100 font-display mt-1.5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{ color: tonal.warmAccent }} />
              {region} Commercial Integration & Corridors
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Tariff liberalization schedules, one-stop border posts (OSBPs), and guided trade initiative value chains
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-black/20 text-center shadow-xs">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400 block">
                Intra-Regional Trade Share
              </span>
              <span className="text-xl font-black font-mono" style={{ color: tonal.warmAccent }}>
                {profile.intraRegionalTradePct}%
              </span>
            </div>
          </div>
        </div>

        {/* Trade Partners & GTI Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Leading Trade Partners */}
          <div className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-black/20 space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" style={{ color: tonal.warmAccent }} />
              Leading Bilateral Flow Corridors
            </span>
            <div className="space-y-2.5 pt-1">
              {profile.leadingTradePartners.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{item.partner}</span>
                    <span className="font-mono font-bold text-zinc-600 dark:text-zinc-400">{item.sharePct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-200/60 dark:bg-zinc-800/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${item.sharePct}%`, backgroundColor: tonal.warmAccent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AfCFTA Guided Trade Initiative Status */}
          <div className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-black/20 space-y-2.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              AfCFTA Guided Trade Status
            </span>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {profile.gtiStatus}
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Priority Value Chains:</span>
              <div className="flex flex-wrap gap-1.5">
                {profile.keyManufacturedGoods.map((good, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60"
                  >
                    {good}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cross-Border Trade Challenges */}
          <div className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-black/20 space-y-2.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Logistics Bottlenecks & NTBs
            </span>
            <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
              {profile.challenges.map((chal, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{chal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Flagship Trade Corridors Selector Ribbon */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-2 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" style={{ color: tonal.warmAccent }} />
            Select Trade Corridor:
          </span>
          {profile.corridors.map(c => {
            const isSelected = c.id === activeCorridor?.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCorridorId(c.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? `${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text} font-bold shadow-xs scale-[1.02]`
                    : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <span>{c.name}</span>
                <span className="text-[10px] font-mono opacity-70 font-normal">
                  ({c.distanceKm} km)
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Corridor Deep-Dive Card */}
        {activeCorridor && (
          <div 
            className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-6 shadow-sm transition-colors"
            style={{ backgroundColor: calmBg }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
              <div>
                <h4 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 font-display">
                  {activeCorridor.name}
                </h4>
                <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="font-mono font-semibold">Connecting Nations:</span>
                  {activeCorridor.connectingNations.map((nat, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 font-medium"
                    >
                      {nat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <span className="text-zinc-500 block text-[10px] uppercase">Annual Flow Value</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {activeCorridor.tradeVolumeAnnualUSD}
                  </span>
                </div>
                <div className="text-right border-l border-zinc-200 dark:border-zinc-800 pl-4">
                  <span className="text-zinc-500 block text-[10px] uppercase">Route Length</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">
                    {activeCorridor.distanceKm} km
                  </span>
                </div>
              </div>
            </div>

            {/* Strategic Notes & Tariff Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-black/20 space-y-1.5 text-xs">
                <strong className="text-zinc-900 dark:text-zinc-100 font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  AfCFTA Tariff Concession Status:
                </strong>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {activeCorridor.afcftaTariffStatus}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-black/20 space-y-1.5 text-xs">
                <strong className="text-zinc-900 dark:text-zinc-100 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: tonal.warmAccent }} />
                  Strategic Logistics Impact:
                </strong>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {activeCorridor.strategicNote}
                </p>
              </div>
            </div>

            {/* Key One-Stop Border Posts (OSBP) */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Key One-Stop Border Posts (OSBP) & Crossing Metrics
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeCorridor.keyBorderPosts.map((post, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-black/20 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                        {post.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {post.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">
                      {post.countries[0]} ↔ {post.countries[1]}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800 text-[11px]">
                      <span className="text-zinc-500">Avg Clearance:</span>
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                        {post.avgCrossingHours} hrs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
