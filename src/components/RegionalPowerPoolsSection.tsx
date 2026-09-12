import React from 'react';
import { AfricanRegion } from '../data/types';
import { REGIONAL_POWER_POOLS, RegionalPowerPool } from '../data/regionalSpecializedAtlas';
import { getRegionTonalPalette, getRegionCalmColor } from '../data/unGeoschemeColors';
import { 
  Zap, 
  Activity, 
  MapPin, 
  Layers, 
  ShieldCheck, 
  Sun, 
  Wind, 
  Flame, 
  Waves,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface RegionalPowerPoolsSectionProps {
  region: AfricanRegion;
}

export const RegionalPowerPoolsSection: React.FC<RegionalPowerPoolsSectionProps> = ({
  region
}) => {
  const pool: RegionalPowerPool | undefined = REGIONAL_POWER_POOLS[region];
  const tonal = getRegionTonalPalette(region);
  const calmBg = getRegionCalmColor(region);

  if (!pool) return null;

  const totalCap = pool.totalInstalledCapacityMW;
  const peakDem = pool.peakDemandMW;
  const reserveMargin = Math.round(((totalCap - peakDem) / peakDem) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Header Hero Plaque */}
      <div 
        className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-6 shadow-sm transition-colors"
        style={{ backgroundColor: calmBg }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                POWER POOL & REGIONAL ENERGY GRID
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                Est. {pool.establishedYear}
              </span>
            </div>
            <h3 className="font-extrabold text-xl md:text-2xl text-zinc-900 dark:text-zinc-100 font-display mt-1.5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              {pool.name} ({pool.acronym})
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>Secretariat: {pool.headquarters} • Coordinating {pool.participatingNations} Member States</span>
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-black/20 text-center shadow-xs">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400 block">
                Installed Capacity
              </span>
              <span className="text-lg font-black font-mono text-amber-600 dark:text-amber-400">
                {(pool.totalInstalledCapacityMW / 1000).toFixed(1)} GW
              </span>
            </div>

            <div className="px-4 py-2 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-black/20 text-center shadow-xs">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400 block">
                Peak Demand
              </span>
              <span className="text-lg font-black font-mono text-zinc-800 dark:text-zinc-200">
                {(pool.peakDemandMW / 1000).toFixed(1)} GW
              </span>
            </div>

            <div className="px-4 py-2 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-black/20 text-center shadow-xs">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400 block">
                Reserve Margin
              </span>
              <span className={`text-lg font-black font-mono ${reserveMargin >= 15 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {reserveMargin > 0 ? `+${reserveMargin}%` : `${reserveMargin}%`}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Generation Energy Mix Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-500" />
              Regional Generation Mix Architecture
            </span>
            <span className="text-zinc-500 font-mono text-[11px]">Primary Fuel Source Proportions</span>
          </div>

          {/* Unified Energy Mix Progress Bar */}
          <div className="h-3.5 w-full bg-zinc-200/60 dark:bg-zinc-800/60 rounded-full overflow-hidden flex shadow-inner">
            <div 
              className="h-full bg-cyan-500 transition-all" 
              style={{ width: `${pool.energyMix.hydroPct}%` }}
              title={`Hydro: ${pool.energyMix.hydroPct}%`}
            />
            <div 
              className="h-full bg-emerald-500 transition-all" 
              style={{ width: `${pool.energyMix.solarWindPct}%` }}
              title={`Solar & Wind: ${pool.energyMix.solarWindPct}%`}
            />
            {pool.energyMix.geothermalPct > 0 && (
              <div 
                className="h-full bg-amber-500 transition-all" 
                style={{ width: `${pool.energyMix.geothermalPct}%` }}
                title={`Geothermal: ${pool.energyMix.geothermalPct}%`}
              />
            )}
            <div 
              className="h-full bg-rose-500 transition-all" 
              style={{ width: `${pool.energyMix.thermalGasCoalPct}%` }}
              title={`Thermal / Gas / Coal: ${pool.energyMix.thermalGasCoalPct}%`}
            />
          </div>

          {/* Generation Mix Legend MD3 Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              <Waves className="w-3.5 h-3.5 text-cyan-500" />
              <span>Hydroelectric:</span>
              <span className="font-mono font-bold">{pool.energyMix.hydroPct}%</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              <Sun className="w-3.5 h-3.5 text-emerald-500" />
              <span>Solar & Wind:</span>
              <span className="font-mono font-bold">{pool.energyMix.solarWindPct}%</span>
            </div>

            {pool.energyMix.geothermalPct > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Geothermal:</span>
                <span className="font-mono font-bold">{pool.energyMix.geothermalPct}%</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Thermal / Gas / Coal:</span>
              <span className="font-mono font-bold">{pool.energyMix.thermalGasCoalPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Flagship Cross-Border Transmission Projects */}
      <div 
        className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-6 shadow-sm transition-colors"
        style={{ backgroundColor: calmBg }}
      >
        <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
          <h4 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            Flagship Cross-Border Interconnection Highways
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            High-Voltage Direct Current (HVDC) corridors and supranational synchronization lines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pool.flagshipTransmissionProjects.map((proj, idx) => {
            const isOp = proj.status === 'Operational';
            const isUc = proj.status === 'Under Construction';
            return (
              <div 
                key={idx}
                className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-black/20 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      ⚡ {proj.voltageKV}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                      isOp 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : isUc
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
                    {proj.name}
                  </div>

                  <div className="flex flex-wrap gap-1 text-[11px] text-zinc-500 font-mono">
                    {proj.countries.map((c, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/60">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Wheeling Capacity:</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {proj.capacityMW.toLocaleString()} MW
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strategic Continental Grid Vision */}
        <div className="p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-black/20 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <strong className="text-zinc-900 dark:text-zinc-100 font-bold block mb-1">
            Continental Master Plan (CMP) Strategic Vision:
          </strong>
          {pool.strategicVision}
        </div>
      </div>
    </div>
  );
};
