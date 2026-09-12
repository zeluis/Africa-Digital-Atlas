import React, { useState } from 'react';
import { AfricanRegion } from '../data/types';
import { REGIONAL_ECOLOGICAL_SYSTEMS, TransboundaryEcology } from '../data/regionalSpecializedAtlas';
import { getRegionTonalPalette, getRegionCalmColor } from '../data/unGeoschemeColors';
import { 
  Trees, 
  Droplets, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Globe2, 
  Compass, 
  Leaf,
  FileCheck2
} from 'lucide-react';

interface RegionalEcologySectionProps {
  region: AfricanRegion;
}

export const RegionalEcologySection: React.FC<RegionalEcologySectionProps> = ({
  region
}) => {
  const ecoSystems = REGIONAL_ECOLOGICAL_SYSTEMS[region] || [];
  const tonal = getRegionTonalPalette(region);
  const calmBg = getRegionCalmColor(region);
  const [selectedEcoId, setSelectedEcoId] = useState<string>(ecoSystems[0]?.id || '');

  const activeEco: TransboundaryEcology | undefined = 
    ecoSystems.find(e => e.id === selectedEcoId) || ecoSystems[0];

  if (!ecoSystems || ecoSystems.length === 0) {
    return (
      <div 
        className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 text-center space-y-2 shadow-sm"
        style={{ backgroundColor: calmBg }}
      >
        <Trees className="w-8 h-8 mx-auto text-emerald-500" />
        <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Ecological Systems</h4>
        <p className="text-xs text-zinc-500">Transboundary environmental systems for this region are being indexed.</p>
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
              TRANSBOUNDARY BIOSPHERE & CLIMATE RESILIENCE
            </span>
          </div>
          <h3 className="font-extrabold text-xl md:text-2xl text-zinc-900 dark:text-zinc-100 font-display mt-1.5 flex items-center gap-2">
            <Trees className="w-5 h-5 text-emerald-500" />
            {region} Cross-Border Ecological Infrastructure
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            Transfrontier conservation areas (TFCAs), shared river basin commissions, and macro carbon sink sanctuaries
          </p>
        </div>

        {/* System Selector MD3 Chips Ribbon */}
        <div className="flex flex-wrap items-center gap-2">
          {ecoSystems.map(eco => {
            const isSelected = eco.id === activeEco?.id;
            return (
              <button
                key={eco.id}
                onClick={() => setSelectedEcoId(eco.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? `${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text} font-bold shadow-xs scale-[1.02]`
                    : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                <span>{eco.name}</span>
                <span className="text-[10px] font-mono opacity-70 font-normal">
                  ({eco.type})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active System Detailed Exploration Card */}
      {activeEco && (
        <div 
          className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-6 shadow-sm transition-colors"
          style={{ backgroundColor: calmBg }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                  {activeEco.type.toUpperCase()}
                </span>
              </div>
              <h4 className="font-extrabold text-xl text-zinc-900 dark:text-zinc-100 font-display mt-1">
                {activeEco.name}
              </h4>
            </div>

            <div className="text-right">
              <span className="text-zinc-500 block text-[10px] font-mono uppercase">Geographic Footprint</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">
                {activeEco.areaKm2}
              </span>
            </div>
          </div>

          {/* Participating Sovereign Nations */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-emerald-500" />
              Participating Sovereign States ({activeEco.participatingCountries.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {activeEco.participatingCountries.map((country, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100 text-xs font-medium shadow-2xs"
                >
                  🌿 {country}
                </span>
              ))}
            </div>
          </div>

          {/* Keystone Flora & Fauna */}
          <div className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-black/20 space-y-2.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5" />
              Keystone Biodiversity & Endangered Species
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeEco.keystoneFloraFauna.map((sp, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800"
                >
                  🐾 {sp}
                </span>
              ))}
            </div>
          </div>

          {/* Climate Mitigation Value & Treaty Protocol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-black/20 space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Carbon Sequestration & Climate Mitigation Value
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {activeEco.climateMitigationValue}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-black/20 space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5" />
                Governing Treaty & Multilateral Accord
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {activeEco.governingTreaty}
              </p>
            </div>
          </div>

          {/* Strategic Significance */}
          <div className="p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <strong className="text-emerald-800 dark:text-emerald-300 font-bold block mb-1">
              Continental Significance:
            </strong>
            {activeEco.strategicSignificance}
          </div>
        </div>
      )}
    </div>
  );
};
