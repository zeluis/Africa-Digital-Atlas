import React, { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { 
  getContinentalSummary, 
  getRegionalSummaries, 
  getIndicatorRankings 
} from '../data/atlas-selectors';
import { AfricanRegion } from '../data/types';
import { FiftyFourNationMosaic } from '../components/FiftyFourNationMosaic';
import { CountryFlag } from '../components/CountryFlag';
import { 
  EditorialCard, 
  ExplorationCard, 
  ReferenceCard 
} from '../components/CardTaxonomy';
import { FirstViewportClarity } from '../components/ProgressiveDisclosure';
import { getRegionCalmColor } from '../data/unGeoschemeColors';
import { 
  formatPopulation, 
  formatGDP, 
  formatPercentage, 
  formatHDI 
} from '../data/atlas-formatters';
import { 
  Users, 
  DollarSign, 
  Sparkles, 
  HeartHandshake, 
  Zap, 
  Landmark, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Globe2,
  Compass,
  Grid3X3,
  Dna,
  BookOpen,
  MapPin,
  ChevronRight
} from 'lucide-react';

export type OverviewPerspective = 'mosaic' | 'pulse' | 'observatories' | 'provenance';

interface PerspectiveConfig {
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  unColor: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  iconColor: string;
  badgeActiveBg: string;
  hoverBg: string;
}

const PERSPECTIVE_CONFIG: Record<OverviewPerspective, PerspectiveConfig> = {
  mosaic: {
    label: '54 Nations Mosaic',
    badge: '54',
    icon: Grid3X3,
    unColor: '#10B981', // Pan-African Emerald (Western/AU)
    activeBg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    activeBorder: 'border-emerald-500/50 dark:border-emerald-400/50',
    activeText: 'text-emerald-950 dark:text-emerald-50 font-bold',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeActiveBg: 'bg-emerald-600/15 dark:bg-emerald-400/20 text-emerald-900 dark:text-emerald-200 font-bold',
    hoverBg: 'hover:bg-emerald-500/[0.08] dark:hover:bg-emerald-500/[0.12]'
  },
  pulse: {
    label: 'Regional Pulse',
    badge: '5 Regions',
    icon: Globe2,
    unColor: '#2563EB', // UN Northern Africa Blue
    activeBg: 'bg-blue-500/15 dark:bg-blue-500/20',
    activeBorder: 'border-blue-500/50 dark:border-blue-400/50',
    activeText: 'text-blue-950 dark:text-blue-50 font-bold',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeActiveBg: 'bg-blue-600/15 dark:bg-blue-400/20 text-blue-900 dark:text-blue-200 font-bold',
    hoverBg: 'hover:bg-blue-500/[0.08] dark:hover:bg-blue-500/[0.12]'
  },
  observatories: {
    label: 'Research Observatories',
    badge: '6 Hubs',
    icon: Compass,
    unColor: '#EAB308', // UN Eastern Africa Gold / Amber
    activeBg: 'bg-amber-500/15 dark:bg-amber-500/20',
    activeBorder: 'border-amber-500/50 dark:border-amber-400/50',
    activeText: 'text-amber-950 dark:text-amber-50 font-bold',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeActiveBg: 'bg-amber-600/15 dark:bg-amber-400/20 text-amber-900 dark:text-amber-200 font-bold',
    hoverBg: 'hover:bg-amber-500/[0.08] dark:hover:bg-amber-500/[0.12]'
  },
  provenance: {
    label: 'Data Provenance',
    badge: 'Audited',
    icon: ShieldCheck,
    unColor: '#06B6D4', // Multilateral / Central UN Cyan
    activeBg: 'bg-cyan-500/15 dark:bg-cyan-500/20',
    activeBorder: 'border-cyan-500/50 dark:border-cyan-400/50',
    activeText: 'text-cyan-950 dark:text-cyan-50 font-bold',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    badgeActiveBg: 'bg-cyan-600/15 dark:bg-cyan-400/20 text-cyan-900 dark:text-cyan-200 font-bold',
    hoverBg: 'hover:bg-cyan-500/[0.08] dark:hover:bg-cyan-500/[0.12]'
  }
};

const PERSPECTIVES: OverviewPerspective[] = ['mosaic', 'pulse', 'observatories', 'provenance'];

interface OverviewViewProps {
  onSelectCountry: (entityId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onSelectCountry,
  onNavigateTab
}) => {
  const [activePerspective, setActivePerspective] = useState<OverviewPerspective>('mosaic');

  const continental = getContinentalSummary();
  const regionalSummaries = getRegionalSummaries();
  const topEconomies = getIndicatorRankings('NY.GDP.MKTP.CD', 6);
  const topHdi = getIndicatorRankings('UNDP.HDI.INDEX', 6);

  return (
    <section aria-label="Pan-African Continental Overview and Sovereign Matrix" className="space-y-6 sm:space-y-8 animate-enter-japandi">
      {/* 1. First Viewport Orientation: Purpose & Scope */}
      <div className="cascade-item cascade-1">
        <FirstViewportClarity onExploreClick={onNavigateTab} />
      </div>

      {/* 2. Continental Primary Macroeconomic Ribbon */}
      <section aria-label="Continental Macroeconomic Benchmarks" className="space-y-2.5 cascade-item cascade-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Pan-African Macroeconomic & Demographic Benchmarks (2024)
          </h2>
          <span className="text-[11px] font-mono text-zinc-400">UN DESA · IMF · UNDP</span>
        </div>

        {/* Unified High-Density 6-Metric Benchmark Ribbon (Symmetrical gap-px hairline dividers across 2/3/6 cols) */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-200/70 dark:bg-zinc-800/70 shadow-xs backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px tabular-nums">
            {/* 1. Population */}
            <div className="bg-white/95 dark:bg-zinc-900/95 p-3.5 sm:p-4 flex flex-col justify-between space-y-1.5 hover:bg-zinc-50/90 dark:hover:bg-zinc-800/70 transition-colors">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <Users className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider truncate">
                  Population
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
                1.48 Billion
              </div>
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                +2.4% YoY
              </div>
            </div>

            {/* 2. Combined GDP */}
            <div className="bg-white/95 dark:bg-zinc-900/95 p-3.5 sm:p-4 flex flex-col justify-between space-y-1.5 hover:bg-zinc-50/90 dark:hover:bg-zinc-800/70 transition-colors">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <DollarSign className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider truncate">
                  Combined GDP
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-cyan-700 dark:text-cyan-300">
                $3.12 Trillion
              </div>
              <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                +3.8% Real
              </div>
            </div>

            {/* 3. GDP Per Capita */}
            <div className="bg-white/95 dark:bg-zinc-900/95 p-3.5 sm:p-4 flex flex-col justify-between space-y-1.5 hover:bg-zinc-50/90 dark:hover:bg-zinc-800/70 transition-colors">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider truncate">
                  GDP Per Capita
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
                $2,094
              </div>
              <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                Weighted
              </div>
            </div>

            {/* 4. Continental HDI */}
            <div className="bg-white/95 dark:bg-zinc-900/95 p-3.5 sm:p-4 flex flex-col justify-between space-y-1.5 hover:bg-zinc-50/90 dark:hover:bg-zinc-800/70 transition-colors">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider truncate">
                  Continental HDI
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-amber-700 dark:text-amber-400">
                0.536
              </div>
              <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                Top: 0.802
              </div>
            </div>

            {/* 5. Electrification */}
            <div className="bg-white/95 dark:bg-zinc-900/95 p-3.5 sm:p-4 flex flex-col justify-between space-y-1.5 hover:bg-zinc-50/90 dark:hover:bg-zinc-800/70 transition-colors">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider truncate">
                  Electrification
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
                56.4%
              </div>
              <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                Access Trajectory
              </div>
            </div>

            {/* 6. Heritage Properties */}
            <div className="bg-white/95 dark:bg-zinc-900/95 p-3.5 sm:p-4 flex flex-col justify-between space-y-1.5 hover:bg-zinc-50/90 dark:hover:bg-zinc-800/70 transition-colors">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <Landmark className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider truncate">
                  Heritage Properties
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-pink-700 dark:text-pink-400">
                104 Sites
              </div>
              <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                across 42 Nations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Executive Tabbed Perspective Switcher */}
      <section aria-label="Overview Analytical Perspectives" className="space-y-6 cascade-item cascade-3">
        <div className="flex flex-col gap-2.5 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-3">
          {/* Perspective Navigation Tabs (Full-width 4-column grid on md+, 2-col on mobile) */}
          <div 
            className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-zinc-100/90 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs" 
            role="tablist" 
            aria-label="Overview Analytical Perspectives"
          >
            {PERSPECTIVES.map(pId => {
              const cfg = PERSPECTIVE_CONFIG[pId];
              const Icon = cfg.icon;
              const isActive = activePerspective === pId;

              return (
                <button
                  key={pId}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActivePerspective(pId)}
                  className={`relative w-full min-h-[44px] px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isActive 
                      ? `${cfg.activeText} shadow-xs font-bold` 
                      : `text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 ${cfg.hoverBg}`
                  }`}
                >
                  {/* Snappy sliding animated background pill */}
                  {isActive && (
                    <m.div
                      layoutId="overviewPerspectivePill"
                      className={`absolute inset-0 rounded-xl ${cfg.activeBg} border ${cfg.activeBorder} shadow-xs`}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}

                  {/* Button Content */}
                  <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 min-w-0">
                    <Icon className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? cfg.iconColor : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200'}`} />
                    <span className="truncate font-semibold tracking-tight">{cfg.label}</span>
                    {cfg.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md transition-colors shrink-0 ${
                        isActive 
                          ? cfg.badgeActiveBg
                          : 'bg-zinc-200/70 dark:bg-zinc-700/60 text-zinc-500 dark:text-zinc-400'
                      }`}>
                        {cfg.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Status & Provenance Metadata Row with ample horizontal space */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 px-1 pt-0.5 min-w-0">
            <span className="font-medium truncate">
              Curated Pan-African Observatory · 54 Sovereign States
            </span>
          </div>
        </div>

        {/* Animated Perspective Content Panels */}
        <AnimatePresence mode="wait">
          <m.div
            key={activePerspective}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Tab 1: 54 Nations Mosaic (Alternative A) */}
            {activePerspective === 'mosaic' && (
              <div role="tabpanel" aria-label="54 Sovereign Nations Mosaic" className="space-y-6">
            <FiftyFourNationMosaic
              onSelectCountry={onSelectCountry}
              onNavigateTab={onNavigateTab}
            />

            {/* Editorial Highlight Strip */}
            <EditorialCard
              category="CONTINENTAL TRAJECTORY"
              title="The Demographic Dividend and Single-Market Convergence"
              subtitle="How demographic expansion and AfCFTA integration are restructuring African economic gravity"
              narrative="With over 1.48 billion people and a median age below 20 years, Africa represents the fastest-growing workforce globally. Macroeconomic structural realignments—accelerated by the African Continental Free Trade Area (AfCFTA)—are unlocking intra-continental manufacturing, digital services, and sustainable energy corridors."
              readMoreContent="Harmonized regional data indicates that regional economic communities (ECOWAS, EAC, SADC) are increasingly converging on standard customs classifications, renewable grid interconnects, and cross-border digital payment systems (PAPSS). This statistical atlas provides continuous verification across trade velocity, human capital investment, and environmental stewardship."
              authorOrSource="African Geospatial Research Initiative"
              regionalAccent="#10b981"
              actionText="Explore 50+ Time-Series Indicators"
              onAction={() => onNavigateTab('analytics')}
            />
          </div>
        )}

        {/* Tab 2: Regional Pulse & Leaders */}
        {activePerspective === 'pulse' && (
          <div role="tabpanel" aria-label="Regional Pulse and Leaders" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: 5 UN Geoscheme Regional Summaries */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2 font-display">
                      <Globe2 className="w-5 h-5 text-emerald-500" /> 5 UN Geoscheme Regions
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Aggregated regional macroeconomic and demographic benchmarks
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('regions')}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Regional Blocs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {regionalSummaries.map(reg => (
                    <div 
                      key={reg.region}
                      className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs"
                      style={{ backgroundColor: getRegionCalmColor(reg.region) }}
                    >
                      <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/80 pb-2">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{reg.region}</h4>
                        <span className="text-[11px] font-mono font-semibold text-zinc-600 dark:text-zinc-400 tabular-nums">
                          {reg.countryCount} States
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs tabular-nums">
                        <div>
                          <span className="text-zinc-500">Population</span>
                          <div className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                            {formatPopulation(reg.totalPopulation)}
                          </div>
                        </div>
                        <div>
                          <span className="text-zinc-500">Regional GDP</span>
                          <div className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            {formatGDP(reg.totalGdp)}
                          </div>
                        </div>
                        <div>
                          <span className="text-zinc-500">Avg Growth</span>
                          <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            +{reg.averageGrowth}%
                          </div>
                        </div>
                        <div>
                          <span className="text-zinc-500">Weighted HDI</span>
                          <div className="font-mono font-bold text-amber-600 dark:text-amber-400">
                            {formatHDI(reg.averageHdi)}
                          </div>
                        </div>
                      </div>

                      {reg.leadingEconomy && (
                        <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/50 flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Anchor Economy:</span>
                          <button
                            onClick={() => onSelectCountry(reg.leadingEconomy!.id)}
                            className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            <CountryFlag entityId={reg.leadingEconomy.id} size="xs" />
                            <span>{reg.leadingEconomy.name}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Top Economic & HDI Leaders */}
              <div className="lg:col-span-5 space-y-6">
                {/* Top Economies Card */}
                <div 
                  className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-4 shadow-xs transition-colors"
                  style={{ backgroundColor: 'var(--region-pan-african-calm)' }}
                >
                  <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/80 pb-3">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-cyan-500" /> Largest African Economies (GDP)
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-500">Nominal 2024</span>
                  </div>

                  <div className="space-y-1.5">
                    {topEconomies.map((item, idx) => (
                      <div
                        key={item.entity.id}
                        onClick={() => onSelectCountry(item.entity.id)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 text-center font-mono text-xs font-bold text-zinc-400 group-hover:text-cyan-500">
                            #{idx + 1}
                          </span>
                          <CountryFlag entityId={item.entity.id} size="sm" />
                          <div>
                            <div className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-100">
                              {item.entity.name}
                            </div>
                            <span className="text-[10px] text-zinc-500">{item.entity.region}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-xs text-cyan-600 dark:text-cyan-300">
                            ${item.value.toFixed(1)}B
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top HDI Leaders Card */}
                <div 
                  className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-4 shadow-xs transition-colors"
                  style={{ backgroundColor: 'var(--region-pan-african-calm)' }}
                >
                  <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/80 pb-3">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-500" /> Highest Human Development (HDI)
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-500">UNDP 2024</span>
                  </div>

                  <div className="space-y-1.5">
                    {topHdi.map((item, idx) => (
                      <div
                        key={item.entity.id}
                        onClick={() => onSelectCountry(item.entity.id)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 text-center font-mono text-xs font-bold text-zinc-400 group-hover:text-emerald-500">
                            #{idx + 1}
                          </span>
                          <CountryFlag entityId={item.entity.id} size="sm" />
                          <div>
                            <div className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-100">
                              {item.entity.name}
                            </div>
                            <span className="text-[10px] text-zinc-500">{item.entity.region}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-300">
                            {formatHDI(item.value)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Research Observatories & Gateways */}
        {activePerspective === 'observatories' && (
          <div role="tabpanel" aria-label="Research Observatories and Gateways" className="cv-auto space-y-6">
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2 font-display">
                <Compass className="w-5 h-5 text-emerald-500" /> Curated Research Observatories & Monographs
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Direct doorways into primary historical datasets, transatlantic genomics, and quantitative econometric studies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 tabular-nums">
              <ExplorationCard
                title="Transatlantic Slave Trade GIS"
                badge="36,108 VOYAGES"
                description="Interactive spatial network tracing 36,108 archival maritime voyages, 47 African embarkation forts, and hydrodynamic trade wind corridors across the Atlantic."
                actionPrompt="Launch Voyages Explorer"
                onClick={() => onNavigateTab('slave-trade')}
                regionalAccent="#f59e0b"
              />

              <ExplorationCard
                title="Sovereign Ethnic Tree of Life"
                badge="310 LINEAGES"
                description="Full-vector phylogenetic radial tree mapping 310 ethnolinguistic lineages across the African continent and the transatlantic diaspora."
                actionPrompt="Launch Ethnic Tree"
                onClick={() => onNavigateTab('ethnic-tree')}
                regionalAccent="#10b981"
              />

              <ExplorationCard
                title="Molecular & Genetic Legacies"
                badge="GENOMIC MONOGRAPH"
                description="Scholarly treatise on continental genetic divergence, chromosomal lineages, sickle cell selection gradients, and mitochondrial diversity."
                actionPrompt="Open Monograph"
                onClick={() => onNavigateTab('molecular-legacies')}
                regionalAccent="#6366f1"
              />

              <ExplorationCard
                title="Pre-Colonial State Institutions"
                badge="ECONOMETRIC STUDY"
                description="Quantitative econometric analysis investigating long-term extraction costs, Nathan Nunn's slave export vulnerability index, and colonial commercial monopsonies."
                actionPrompt="Open Master Report"
                onClick={() => onNavigateTab('african-development-foundations')}
                regionalAccent="#d97706"
              />

              <ExplorationCard
                title="Linguistic Diversity Matrix"
                badge="2,000+ LANGUAGES"
                description="Explore the 4 major African language phyla (Niger-Congo, Afroasiatic, Nilo-Saharan, Khoisan) with national distribution matrices and official language status."
                actionPrompt="Launch Linguistics Workspace"
                onClick={() => onNavigateTab('languages')}
                regionalAccent="#06b6d4"
              />

              <ExplorationCard
                title="UNESCO World Heritage Registry"
                badge="104 PROPERTIES"
                description="Curated cultural and natural landmarks across 42 African nations with inscription criteria, danger status monitoring, and spatial coordinate mapping."
                actionPrompt="Launch Heritage Explorer"
                onClick={() => onNavigateTab('heritage')}
                regionalAccent="#ec4899"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Harmonization & Provenance Standards */}
        {activePerspective === 'provenance' && (
          <div role="tabpanel" aria-label="Harmonization Standards and Provenance" className="cv-auto space-y-6">
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2 font-display">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Methodological Standards & Provenance Registry
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Rigorous data harmonization criteria, license documentation, and multilateral API verification registries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ReferenceCard
                sourceAgency="World Bank Group"
                indicatorCode="WDI.2024.REV3"
                methodologyNote="Macroeconomic and demographic series harmonized via World Development Indicators API. Currency figures standardized in constant 2015 USD and nominal 2024 USD."
                updateCadence="Quarterly Sync"
                license="CC-BY 4.0 Open Access"
                verifiedYear={2024}
                externalUrl="https://data.worldbank.org/"
              />

              <ReferenceCard
                sourceAgency="UN DESA Population Division"
                indicatorCode="WPP.2024.M49"
                methodologyNote="Population estimates, fertility rates, median age, and urban distribution ratios indexed under UN Geoscheme M49 continental standard definitions."
                updateCadence="Biennial Revision"
                license="Public Domain (UN Open Data)"
                verifiedYear={2024}
                externalUrl="https://population.un.org/wpp/"
              />

              <ReferenceCard
                sourceAgency="UNESCO World Heritage Centre"
                indicatorCode="WHC.STAT.104"
                methodologyNote="104 inscribed cultural and natural properties across 42 African state parties, including danger list status tracking and geospatial boundary polygons."
                updateCadence="Annual Committee Session"
                license="Open UNESCO Metadata"
                verifiedYear={2024}
                externalUrl="https://whc.unesco.org/en/list/"
              />
            </div>
          </div>
        )}
          </m.div>
        </AnimatePresence>
      </section>
    </section>
  );
};

export default OverviewView;
