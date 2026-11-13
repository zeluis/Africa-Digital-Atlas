import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { atlas } from '../../data/atlas-store';
import { getCountryTradeFlows } from '../../data/criticalMineralsData';
import { AFCFTA_CORRIDOR_PRESETS, TradeCorridorPreset } from '../../data/afcftaSimulatorData';
import { ENTITY_BLOCS } from '../../data/entityBlocs';
import { CountryFlag } from '../CountryFlag';
import { AtlasSelect } from '../common/AtlasSelect';
import { 
  formatCurrency, 
  formatGDP, 
  formatPercentage 
} from '../../data/atlas-formatters';
import { 
  ArrowRightLeft, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  Percent, 
  Boxes, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

interface BilateralTradeComplementaritySectionProps {
  countryIds: string[];
  onSelectCountry?: (id: string) => void;
}

export const BilateralTradeComplementaritySection: React.FC<BilateralTradeComplementaritySectionProps> = ({
  countryIds,
  onSelectCountry
}) => {
  // If user selected multiple, let them choose a focus bilateral pair (Country A and Country B)
  const [pairA, setPairA] = useState<string>(countryIds[0] || 'NGA');
  const [pairB, setPairB] = useState<string>(countryIds[1] || 'KEN');

  // Keep pair synchronized if countryIds change
  const validPairA = countryIds.includes(pairA) ? pairA : countryIds[0] || 'NGA';
  const validPairB = countryIds.includes(pairB) && pairB !== validPairA 
    ? pairB 
    : countryIds.find(id => id !== validPairA) || (validPairA === 'NGA' ? 'KEN' : 'NGA');

  const countryA = atlas.getEntity(validPairA);
  const countryB = atlas.getEntity(validPairB);

  const tradeProfileA = useMemo(() => getCountryTradeFlows(validPairA, countryA?.name || validPairA), [validPairA, countryA?.name]);
  const tradeProfileB = useMemo(() => getCountryTradeFlows(validPairB, countryB?.name || validPairB), [validPairB, countryB?.name]);

  // Find shared Regional Economic Communities
  const sharedBlocs = useMemo(() => {
    const blocs: string[] = [];
    for (const [key, bloc] of Object.entries(ENTITY_BLOCS)) {
      if (bloc.memberIso3s.includes(validPairA) && bloc.memberIso3s.includes(validPairB)) {
        blocs.push(bloc.name);
      }
    }
    return blocs;
  }, [validPairA, validPairB]);

  // Find connecting corridors
  const connectingCorridors = useMemo(() => {
    const nameA = countryA?.name?.toLowerCase() || '';
    const nameB = countryB?.name?.toLowerCase() || '';
    return AFCFTA_CORRIDOR_PRESETS.filter(corridor => {
      const allCountries = [corridor.originCountry, corridor.destinationCountry, ...corridor.transitCountries].map(c => c.toLowerCase());
      const touchesA = allCountries.some(c => c.includes(nameA) || nameA.includes(c));
      const touchesB = allCountries.some(c => c.includes(nameB) || nameB.includes(c));
      return touchesA && touchesB;
    });
  }, [countryA?.name, countryB?.name]);

  // Regional corridors fallback if no direct bilateral corridor touches both
  const regionalCorridors = useMemo(() => {
    if (connectingCorridors.length > 0) return connectingCorridors;
    const nameA = countryA?.name?.toLowerCase() || '';
    const nameB = countryB?.name?.toLowerCase() || '';
    const filtered = AFCFTA_CORRIDOR_PRESETS.filter(corridor => {
      const allCountries = [corridor.originCountry, corridor.destinationCountry, ...corridor.transitCountries].map(c => c.toLowerCase());
      return allCountries.some(c => c.includes(nameA) || nameA.includes(c) || c.includes(nameB) || nameB.includes(c));
    });
    return filtered.length > 0 ? filtered : AFCFTA_CORRIDOR_PRESETS.slice(0, 3);
  }, [connectingCorridors, countryA?.name, countryB?.name]);

  // Calculate Trade Complementarity Index (TCI proxy based on export diversity & intra-African intensity)
  const complementarityScore = useMemo(() => {
    const shareA = tradeProfileA.intraAfricanSharePct;
    const shareB = tradeProfileB.intraAfricanSharePct;
    const base = Math.min(85, Math.round((shareA + shareB) * 1.6 + 28));
    return base;
  }, [tradeProfileA, tradeProfileB]);

  // Macro metrics
  const gdpA = atlas.getIndicatorValue(validPairA, 'NY.GDP.MKTP.CD') || 0;
  const gdpB = atlas.getIndicatorValue(validPairB, 'NY.GDP.MKTP.CD') || 0;

  return (
    <div className="space-y-6">
      {/* 1. Header & Bilateral Pair Switcher */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>AfCFTA Protocol on Trade in Goods &amp; Services</span>
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              Bilateral Trade Complementarity &amp; Tariff Phase-Down
            </h3>
            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
              Simulating reciprocal market access, supply chain overlap, and transit efficiency under the African Continental Free Trade Area.
            </p>
          </div>

          {/* Interactive Bilateral Pair Selector (when > 2 countries in CompareView) */}
          {countryIds.length > 2 && (
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 p-2 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80">
              <AtlasSelect
                aria-label="Select first bilateral trade partner"
                value={validPairA}
                onChange={(e) => setPairA(e.target.value)}
                accent="emerald"
                size="xs"
                className="font-bold py-1.5"
              >
                {countryIds.map(id => (
                  <option key={`a-${id}`} value={id} disabled={id === validPairB}>
                    {atlas.getEntity(id)?.name || id}
                  </option>
                ))}
              </AtlasSelect>
              <ArrowRightLeft className="w-4 h-4 text-zinc-400 shrink-0" />
              <AtlasSelect
                aria-label="Select second bilateral trade partner"
                value={validPairB}
                onChange={(e) => setPairB(e.target.value)}
                accent="emerald"
                size="xs"
                className="font-bold py-1.5"
              >
                {countryIds.map(id => (
                  <option key={`b-${id}`} value={id} disabled={id === validPairA}>
                    {atlas.getEntity(id)?.name || id}
                  </option>
                ))}
              </AtlasSelect>
            </div>
          )}
        </div>

        {/* 2. Top Summary KPI Ribbons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {/* Complementarity Score */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
            <div className="text-[11px] font-mono uppercase text-zinc-500">Trade Complementarity Index</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {complementarityScore}%
              </span>
              <span className="text-[11px] text-zinc-500">structural fit</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${complementarityScore}%` }}
              />
            </div>
          </div>

          {/* AfCFTA Phase-1 Liberalization Target */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
            <div className="text-[11px] font-mono uppercase text-zinc-500">Phase 1 Duty-Free Lines</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono">
                90.0%
              </span>
              <span className="text-[11px] text-zinc-500">within 5–10 yrs</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-2">
              7% sensitive goods, 3% excluded lines
            </div>
          </div>

          {/* Shared RECs */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
            <div className="text-[11px] font-mono uppercase text-zinc-500">Shared Regional Blocs</div>
            <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {sharedBlocs.length > 0 ? sharedBlocs.join(', ') : 'Cross-Regional (Tripartite)'}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              {sharedBlocs.length > 0 ? 'Harmonized customs union' : 'AfCFTA bridges separate regional regimes'}
            </div>
          </div>

          {/* Joint Market Size */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
            <div className="text-[11px] font-mono uppercase text-zinc-500">Combined Bilateral GDP</div>
            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono mt-1">
              {formatGDP(gdpA + gdpB)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              Nominal economic output
            </div>
          </div>
        </div>
      </div>

      {/* 3. Side-by-Side Trade Structures & Partners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country A Profile */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-3">
              <CountryFlag entityId={validPairA} size="md" />
              <div>
                <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 font-display">
                  {countryA?.name || validPairA}
                </h4>
                <div className="text-xs text-zinc-500 font-mono">
                  Intra-African Trade: <strong className="text-emerald-600 dark:text-emerald-400">{tradeProfileA.intraAfricanSharePct}%</strong>
                </div>
              </div>
            </div>
            {onSelectCountry && (
              <button
                type="button"
                onClick={() => onSelectCountry(validPairA)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                View Dossier
              </button>
            )}
          </div>

          <div>
            <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
              Primary Trade Flows &amp; Export Specializations
            </div>
            <div className="space-y-2">
              {tradeProfileA.flows.slice(0, 3).map(flow => (
                <div key={flow.destination} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{flow.destination}</span>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{flow.primaryGoods}</div>
                  </div>
                  <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{flow.sharePct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs">
            <div className="font-semibold text-emerald-900 dark:text-emerald-200">AfCFTA Corridor Integration</div>
            <p className="text-emerald-800/90 dark:text-emerald-300/90 text-[11px] mt-0.5">
              {tradeProfileA.afcftaCorridorNote}
            </p>
          </div>
        </div>

        {/* Country B Profile */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-3">
              <CountryFlag entityId={validPairB} size="md" />
              <div>
                <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 font-display">
                  {countryB?.name || validPairB}
                </h4>
                <div className="text-xs text-zinc-500 font-mono">
                  Intra-African Trade: <strong className="text-emerald-600 dark:text-emerald-400">{tradeProfileB.intraAfricanSharePct}%</strong>
                </div>
              </div>
            </div>
            {onSelectCountry && (
              <button
                type="button"
                onClick={() => onSelectCountry(validPairB)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                View Dossier
              </button>
            )}
          </div>

          <div>
            <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
              Primary Trade Flows &amp; Export Specializations
            </div>
            <div className="space-y-2">
              {tradeProfileB.flows.slice(0, 3).map(flow => (
                <div key={flow.destination} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{flow.destination}</span>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{flow.primaryGoods}</div>
                  </div>
                  <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{flow.sharePct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs">
            <div className="font-semibold text-emerald-900 dark:text-emerald-200">AfCFTA Corridor Integration</div>
            <p className="text-emerald-800/90 dark:text-emerald-300/90 text-[11px] mt-0.5">
              {tradeProfileB.afcftaCorridorNote}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Strategic Trans-African Corridors */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-500 uppercase">
          <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Strategic Transit Corridors &amp; Border Dwell Times</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regionalCorridors.slice(0, 3).map(corridor => (
            <div 
              key={corridor.id}
              className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display">
                  {corridor.name}
                </h5>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold shrink-0">
                  {corridor.distanceKm.toLocaleString()} km
                </span>
              </div>

              <div className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">
                Route: {corridor.originPort} → {corridor.destinationHub}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-200/60 dark:border-zinc-700/60 text-[11px]">
                <div>
                  <span className="text-zinc-500">Baseline Transit:</span>
                  <div className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                    {(corridor.baselineRoadDays + corridor.baselineBorderDays).toFixed(1)} days
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">AfCFTA Target:</span>
                  <div className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {corridor.afcftaOptimizedDays} days
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium truncate">
                Volume: {corridor.annualTradeVolumeUSD} · REC: {corridor.rec}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BilateralTradeComplementaritySection;
