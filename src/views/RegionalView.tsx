import React, { useState, useEffect } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { SPRING_TACTILE } from '../utils/motion';
import { atlas } from '../data/atlas-store';
import { getRegionalSummaries, getBlocSummaries } from '../data/atlas-selectors';
import { AfricanRegion, RegionalBloc, UNRegionName } from '../data/types';
import { CountryFlag } from '../components/CountryFlag';
import { AfricaVectorMap } from '../components/AfricaVectorMap';
import { RegionalSilhouette } from '../components/RegionalSilhouette';
import { RegionalLivingCanvas } from '../components/regional/RegionalLivingCanvas';
import { OrganizationLogo } from '../components/OrganizationLogo';
import { ChartAccessibleTable } from '../components/common/ChartAccessibleTable';
import { UN_M49_REGIONS, UN_M49_NUMERIC_CODES } from '../data/svgGeographySystem';
import { getRegionTonalPalette } from '../data/unGeoschemeColors';
import { formatPopulation, formatGDP, formatHDI } from '../data/atlas-formatters';
import { WIKIPEDIA_REGIONAL_ATLAS, RegionalWikiDossier } from '../data/wikipediaRegionalAtlas';
import { 
  PieChart, 
  ResponsiveContainer, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { 
  Globe2, 
  Layers, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Award, 
  Building2, 
  ChevronRight,
  Compass,
  Crosshair,
  MapPin,
  BookOpen,
  ExternalLink,
  Trees,
  CloudSun,
  Anchor,
  Languages,
  ShieldCheck,
  Sparkles,
  Maximize2,
  Activity,
  FileText,
  CheckCircle2,
  TableProperties,
  Zap
} from 'lucide-react';
import { RegionalAfcftaTradeSection } from '../components/RegionalAfcftaTradeSection';
import { RegionalHistoricCorridorsSection } from '../components/RegionalHistoricCorridorsSection';
import { RegionalEcologySection } from '../components/RegionalEcologySection';
import { RegionalPowerPoolsSection } from '../components/RegionalPowerPoolsSection';
import { getRegionCalmColor } from '../data/unGeoschemeColors';

interface RegionalViewProps {
  onSelectCountry: (entityId: string) => void;
  initialRegion?: AfricanRegion;
  onSelectRegion?: (region: AfricanRegion) => void;
}

type RegionalTabMode = 'region-dossier' | 'matrix';
type RegionSectionId = 
  | 'overview' 
  | 'economy' 
  | 'afcfta'
  | 'historic-routes'
  | 'ecology'
  | 'power-pools'
  | 'demographics' 
  | 'politics' 
  | 'languages' 
  | 'tast' 
  | 'climate';

type RegionalPrimaryGroup =
  | 'overview'
  | 'economy-infra'
  | 'people-politics'
  | 'ecology-climate'
  | 'historical';

const GROUP_FOR_SECTION: Record<RegionSectionId, RegionalPrimaryGroup> = {
  overview: 'overview',
  economy: 'economy-infra',
  afcfta: 'economy-infra',
  'power-pools': 'economy-infra',
  demographics: 'people-politics',
  politics: 'people-politics',
  languages: 'people-politics',
  ecology: 'ecology-climate',
  climate: 'ecology-climate',
  'historic-routes': 'historical',
  tast: 'historical'
};

const PRIMARY_REGION_GROUPS: Array<{
  id: RegionalPrimaryGroup;
  label: string;
  shortLabel: string;
  defaultSection: RegionSectionId;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'overview', label: '01. Overview & Nations', shortLabel: 'Overview', defaultSection: 'overview', icon: Globe2 },
  { id: 'economy-infra', label: '02. Economy & Grids', shortLabel: 'Economy', defaultSection: 'economy', icon: DollarSign },
  { id: 'people-politics', label: '03. People & RECs', shortLabel: 'Society', defaultSection: 'demographics', icon: Users },
  { id: 'ecology-climate', label: '04. Ecology & Climate', shortLabel: 'Ecology', defaultSection: 'ecology', icon: Trees },
  { id: 'historical', label: '05. Trade & History', shortLabel: 'History', defaultSection: 'historic-routes', icon: Compass }
];

export const RegionalView: React.FC<RegionalViewProps> = ({
  onSelectCountry,
  initialRegion = 'Western Africa',
  onSelectRegion
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<RegionalTabMode>('region-dossier');
  const [selectedRegion, setSelectedRegion] = useState<AfricanRegion>(initialRegion);
  const [activeSection, setActiveSection] = useState<RegionSectionId>('overview');
  const [lastSectionByGroup, setLastSectionByGroup] = useState<Record<RegionalPrimaryGroup, RegionSectionId>>({
    overview: 'overview',
    'economy-infra': 'economy',
    'people-politics': 'demographics',
    'ecology-climate': 'ecology',
    historical: 'historic-routes'
  });
  const [hoveredMapRegion, setHoveredMapRegion] = useState<UNRegionName | null>(null);
  const [selectedBloc, setSelectedBloc] = useState<RegionalBloc>('ECOWAS');
  const [matrixSubTab, setMatrixSubTab] = useState<'regions' | 'blocs'>('regions');

  const activeGroup: RegionalPrimaryGroup = GROUP_FOR_SECTION[activeSection] || 'overview';

  const selectSubSection = (sectionId: RegionSectionId) => {
    const grp = GROUP_FOR_SECTION[sectionId];
    setLastSectionByGroup(prev => ({ ...prev, [grp]: sectionId }));
    setActiveSection(sectionId);
  };

  const selectPrimaryGroup = (groupId: RegionalPrimaryGroup) => {
    const def = PRIMARY_REGION_GROUPS.find(g => g.id === groupId);
    const target = lastSectionByGroup[groupId] || def?.defaultSection || 'overview';
    setActiveSection(target);
  };

  const handleRegionChange = (reg: AfricanRegion) => {
    setSelectedRegion(reg);
    setViewMode('region-dossier');
    onSelectRegion?.(reg);
  };

  useEffect(() => {
    if (initialRegion) {
      setSelectedRegion(initialRegion);
      setViewMode('region-dossier');
    }
  }, [initialRegion]);

  const regionalSummaries = getRegionalSummaries();
  const blocSummaries = getBlocSummaries();

  const currentRegionSummary = regionalSummaries.find(r => r.region === selectedRegion) || regionalSummaries[0];
  const currentBlocSummary = blocSummaries.find(b => b.bloc === selectedBloc) || blocSummaries[0];
  const m49RegionMeta = UN_M49_REGIONS[selectedRegion];
  const selectedRegionTonal = getRegionTonalPalette(selectedRegion);
  const wikiDossier: RegionalWikiDossier = WIKIPEDIA_REGIONAL_ATLAS[selectedRegion];
  const selectedRegionCalmBg = getRegionCalmColor(selectedRegion);
  const panAfricanCalmBg = getRegionCalmColor();

  // Pie chart data for GDP by region with matching UN Geoscheme warm tonal colors
  const gdpPieData = regionalSummaries.map(r => ({
    name: r.region.replace(' Africa', ''),
    fullName: r.region,
    value: r.totalGdp,
    color: getRegionTonalPalette(r.region).warmAccent
  }));

  // Pie chart data for Population by region with matching UN Geoscheme warm tonal colors
  const popPieData = regionalSummaries.map(r => ({
    name: r.region.replace(' Africa', ''),
    fullName: r.region,
    value: r.totalPopulation,
    color: getRegionTonalPalette(r.region).warmAccent
  }));

  // Member nations sorted by GDP for regional charts
  const sortedMemberCountries = [...currentRegionSummary.countries].map(c => {
    const gdp = atlas.getIndicatorValue(c.id, 'NY.GDP.MKTP.CD') || 0;
    const pop = atlas.getIndicatorValue(c.id, 'SP.POP.TOTL') || 0;
    const hdi = atlas.getIndicatorValue(c.id, 'UNDP.HDI') || 0;
    return {
      id: c.id,
      name: c.name,
      capital: c.capital,
      gdp,
      pop,
      hdi,
      gdpPerCapita: pop > 0 ? (gdp * 1000) / pop : 0
    };
  }).sort((a, b) => b.gdp - a.gdp);

  const topEconomiesChartData = sortedMemberCountries.slice(0, 8).map(c => ({
    name: c.name.length > 12 ? `${c.name.slice(0, 10)}...` : c.name,
    fullName: c.name,
    gdp: Number(c.gdp.toFixed(1)),
    pop: Number(c.pop.toFixed(1)),
    gdpPerCapita: Math.round(c.gdpPerCapita)
  }));

  const allFiveRegions: AfricanRegion[] = [
    'Northern Africa',
    'Western Africa',
    'Central Africa',
    'Eastern Africa',
    'Southern Africa'
  ];

  const subGroupTabs: Record<Exclude<RegionalPrimaryGroup, 'overview'>, Array<{ id: RegionSectionId; label: string; icon: React.ComponentType<{ className?: string }> }>> = {
    'economy-infra': [
      { id: 'economy', label: 'Economy & GDP', icon: DollarSign },
      { id: 'afcfta', label: 'AfCFTA & Trade Corridors', icon: TrendingUp },
      { id: 'power-pools', label: 'Power Pools & Grids', icon: Zap }
    ],
    'people-politics': [
      { id: 'demographics', label: 'Demographics', icon: Users },
      { id: 'politics', label: 'Politics & RECs', icon: Building2 },
      { id: 'languages', label: 'Languages & Scripts', icon: Languages }
    ],
    'ecology-climate': [
      { id: 'ecology', label: 'Cross-Border Ecology', icon: Trees },
      { id: 'climate', label: 'Climate & Biomes', icon: CloudSun }
    ],
    historical: [
      { id: 'historic-routes', label: 'Historic Trade Corridors', icon: Compass },
      { id: 'tast', label: 'TAST & History', icon: Anchor }
    ]
  };

  const masterSelectorItems: Array<{ id: string; label: string; region?: AfricanRegion }> = [
    ...allFiveRegions.map(reg => ({
      id: `btn-region-${reg.toLowerCase().replace(/\s+/g, '-')}`,
      label: reg,
      region: reg
    })),
    { id: 'btn-regional-matrix-all', label: 'Comparative Matrix' }
  ];

  const handleMasterTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let nextIdx = idx;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % masterSelectorItems.length;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + masterSelectorItems.length) % masterSelectorItems.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = masterSelectorItems.length - 1;
    else return;
    e.preventDefault();
    const target = masterSelectorItems[nextIdx];
    if (target.region) handleRegionChange(target.region);
    else setViewMode('matrix');
    document.getElementById(target.id)?.focus();
  };

  const handlePrimaryGroupKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let nextIdx = idx;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % PRIMARY_REGION_GROUPS.length;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + PRIMARY_REGION_GROUPS.length) % PRIMARY_REGION_GROUPS.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = PRIMARY_REGION_GROUPS.length - 1;
    else return;
    e.preventDefault();
    const target = PRIMARY_REGION_GROUPS[nextIdx];
    selectPrimaryGroup(target.id);
    document.getElementById(`region-group-tab-${target.id}`)?.focus();
  };

  const handleSubGroupKeyDown = (
    e: React.KeyboardEvent,
    items: Array<{ id: RegionSectionId }>,
    idx: number
  ) => {
    let nextIdx = idx;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % items.length;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + items.length) % items.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = items.length - 1;
    else return;
    e.preventDefault();
    const target = items[nextIdx];
    selectSubSection(target.id);
    document.getElementById(`subtab-${target.id}`)?.focus();
  };

  return (
    <section aria-label="UN M49 African Regional Portals and Macro-Geoscheme Observatory" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. MASTER REGIONAL SELECTOR PANEL */}
      <div 
        id="regional-selector-panel"
        className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-5 shadow-sm transition-all"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              African Regional Portal · UN Geoscheme M49
            </span>
            <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Select an African Region or Continental Matrix:
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto" role="tablist" aria-label="Select regional dossier">
            {allFiveRegions.map((reg, idx) => {
              const isSelected = viewMode === 'region-dossier' && selectedRegion === reg;
              const tonal = getRegionTonalPalette(reg);
              const summary = regionalSummaries.find(r => r.region === reg);
              return (
                <button
                  key={reg}
                  id={`btn-region-${reg.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="regional-main-tabpanel"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleRegionChange(reg)}
                  onKeyDown={(e) => handleMasterTabKeyDown(e, idx)}
                  className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold cursor-pointer select-none transition-colors duration-150 border border-zinc-200 dark:border-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    isSelected
                      ? `${tonal.badge.text} font-bold shadow-xs`
                      : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {isSelected && (
                    prefersReducedMotion ? (
                      <span className={`absolute inset-0 rounded-2xl ${tonal.badge.bg} ${tonal.badge.border} border shadow-xs`} aria-hidden="true" />
                    ) : (
                      <m.div
                        layoutId="regionalActiveSelector"
                        className={`absolute inset-0 rounded-2xl ${tonal.badge.bg} ${tonal.badge.border} border shadow-xs`}
                        transition={SPRING_TACTILE}
                      />
                    )
                  )}
                  <span
                    className="relative z-10 w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{
                      backgroundColor: tonal.warmAccent,
                      boxShadow: `0 0 6px ${tonal.glowRgba}`
                    }}
                  />
                  <span className="relative z-10">{reg}</span>
                  <span className="relative z-10 text-[10px] font-mono tabular-nums opacity-70 font-normal">
                    ({summary?.countryCount || 0})
                  </span>
                </button>
              );
            })}

            {/* Matrix Button */}
            <button
              id="btn-regional-matrix-all"
              type="button"
              role="tab"
              aria-selected={viewMode === 'matrix'}
              aria-controls="regional-main-tabpanel"
              tabIndex={viewMode === 'matrix' ? 0 : -1}
              onClick={() => setViewMode('matrix')}
              onKeyDown={(e) => handleMasterTabKeyDown(e, allFiveRegions.length)}
              className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold cursor-pointer select-none transition-colors duration-150 border border-zinc-200 dark:border-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                viewMode === 'matrix'
                  ? 'text-white dark:text-zinc-950 font-bold shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              {viewMode === 'matrix' && (
                prefersReducedMotion ? (
                  <span className="absolute inset-0 rounded-2xl bg-zinc-900 dark:bg-zinc-100 border border-zinc-900 dark:border-zinc-100 shadow-xs" aria-hidden="true" />
                ) : (
                  <m.div
                    layoutId="regionalActiveSelector"
                    className="absolute inset-0 rounded-2xl bg-zinc-900 dark:bg-zinc-100 border border-zinc-900 dark:border-zinc-100 shadow-xs"
                    transition={SPRING_TACTILE}
                  />
                )
              )}
              <TableProperties className="relative z-10 w-3.5 h-3.5 text-emerald-500" />
              <span className="relative z-10">Comparative Matrix (All Regions &amp; Blocs)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REGION VIEW MODE */}
      {viewMode === 'region-dossier' && (
        <div
          id="regional-main-tabpanel"
          role="tabpanel"
          aria-labelledby={`btn-region-${selectedRegion.toLowerCase().replace(/\s+/g, '-')}`}
          className="space-y-6 animate-in fade-in duration-200"
        >
          {/* Full Hero on Overview; Compact Sticky Regional Header on Deep-Dive Tabs */}
          {activeSection === 'overview' ? (
            <div 
              id="region-intro-hero"
              className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-6 md:p-8 shadow-sm relative overflow-hidden"
            >
              <div 
                className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-25"
                style={{ background: selectedRegionTonal.warmAccent }}
              />

              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8 relative z-10">
                <div className="flex-1 space-y-4 max-w-3xl">
                  {/* Clean Unboxed Metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                    <span className={`font-bold ${selectedRegionTonal.badge.text}`}>
                      UN M49: {wikiDossier.m49Code}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{wikiDossier.auRegion}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentRegionSummary.countryCount} Member States &amp; Territories</span>
                  </div>

                  <div>
                    <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 font-display tracking-tight">
                      {selectedRegion}
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                      Geographic, Economic, and Demographic Division of the African Continent
                    </p>
                  </div>

                  <div 
                    className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-2.5 transition-colors"
                    style={{ backgroundColor: selectedRegionCalmBg }}
                  >
                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                        Wikipedia Encyclopedic Overview
                      </span>
                      <a
                        href={wikiDossier.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        <span>Article: {wikiDossier.canonicalTitle}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {wikiDossier.extract}
                    </p>
                  </div>

                  {/* Quick Indicators Capsule */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 font-mono text-xs tabular-nums">
                    <div className="bg-white/90 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl shadow-xs">
                      <span className="text-zinc-400 block text-[9px] uppercase font-bold">Total GDP</span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">
                        {formatGDP(currentRegionSummary.totalGdp)}
                      </span>
                    </div>
                    <div className="bg-white/90 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl shadow-xs">
                      <span className="text-zinc-400 block text-[9px] uppercase font-bold">Population</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatPopulation(currentRegionSummary.totalPopulation)}
                      </span>
                    </div>
                    <div className="bg-white/90 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl shadow-xs">
                      <span className="text-zinc-400 block text-[9px] uppercase font-bold">GDP Per Capita</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">
                        ${wikiDossier.economy.gdpPerCapitaAvg.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-white/90 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl shadow-xs">
                      <span className="text-zinc-400 block text-[9px] uppercase font-bold">Avg HDI</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                        {formatHDI(currentRegionSummary.averageHdi)}
                      </span>
                    </div>
                    <div className="bg-white/90 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl shadow-xs">
                      <span className="text-zinc-400 block text-[9px] uppercase font-bold">Land Area</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">
                        {wikiDossier.geography.landAreaFormatted}
                      </span>
                    </div>
                    <div className="bg-white/90 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl shadow-xs">
                      <span className="text-zinc-400 block text-[9px] uppercase font-bold">Urbanization</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                        {wikiDossier.demographics.urbanizationRate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center justify-center lg:justify-end">
                  <RegionalSilhouette
                    region={selectedRegion}
                    size="header"
                    onSelectCountry={onSelectCountry}
                    showMemberList={false}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative md:sticky md:top-16 z-20 p-3 sm:p-4 rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: selectedRegionTonal.warmAccent }} />
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100 font-display truncate">
                    {selectedRegion}
                  </h1>
                  <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate tabular-nums">
                    UN M49 {wikiDossier.m49Code} · {currentRegionSummary.countryCount} States · {formatGDP(currentRegionSummary.totalGdp)} · {formatPopulation(currentRegionSummary.totalPopulation)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => selectSubSection('overview')}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer shrink-0"
              >
                ← Full Regional Overview
              </button>
            </div>
          )}

          {/* 3. CONSOLIDATED 5-SECTION PRIMARY TABLIST + IN-PANEL SUB-SWITCHER */}
          <div className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <nav
              id="region-subtabs-ribbon"
              role="tablist"
              aria-label="Regional dossier thematic sections"
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-shadow-x p-1.5 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              {PRIMARY_REGION_GROUPS.map((grp, idx) => {
                const Icon = grp.icon;
                const isActive = activeGroup === grp.id;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    role="tab"
                    id={`region-group-tab-${grp.id}`}
                    aria-selected={isActive}
                    aria-controls={`region-group-panel-${grp.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectPrimaryGroup(grp.id)}
                    onKeyDown={(e) => handlePrimaryGroupKeyDown(e, idx)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      isActive
                        ? 'text-white dark:text-zinc-950 font-bold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white/60 dark:hover:bg-zinc-800/70'
                    }`}
                  >
                    {isActive && (
                      prefersReducedMotion ? (
                        <span className="absolute inset-0 rounded-xl bg-zinc-900 dark:bg-zinc-100 shadow-xs" aria-hidden="true" />
                      ) : (
                        <m.div
                          layoutId="regionalPrimaryGroupPill"
                          className="absolute inset-0 rounded-xl bg-zinc-900 dark:bg-zinc-100 shadow-xs"
                          transition={SPRING_TACTILE}
                        />
                      )
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden sm:inline">{grp.label}</span>
                      <span className="sm:hidden">{grp.shortLabel}</span>
                    </span>
                  </button>
                );
              })}
            </nav>

            {activeGroup !== 'overview' && (
              <div
                role="tablist"
                aria-label="Sub-section views"
                className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 w-fit max-w-full"
              >
                {subGroupTabs[activeGroup].map((tab, idx) => {
                  const Icon = tab.icon;
                  const isActive = activeSection === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`subtab-${tab.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`region-subpanel-${tab.id}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => selectSubSection(tab.id)}
                      onKeyDown={(e) => handleSubGroupKeyDown(e, subGroupTabs[activeGroup], idx)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                        isActive
                          ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. ACTIVE SECTION CONTENT */}
          <div
            role="tabpanel"
            id={`region-group-panel-${activeGroup}`}
            aria-labelledby={`region-group-tab-${activeGroup}`}
          >

          {/* Section: Overview & Member Nations */}
          {activeSection === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Narrative Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {wikiDossier.summaryNarrative.map((para, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-2 transition-colors"
                    style={{ backgroundColor: selectedRegionCalmBg }}
                  >
                    <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      Pillar 0{idx + 1}
                    </div>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {para}
                    </p>
                  </div>
                ))}
              </div>

              {/* Master Regional Living Atlas Stage (Hardware-Accelerated 60 FPS Vector Canvas) */}
              <RegionalLivingCanvas
                region={selectedRegion}
                onSelectCountry={onSelectCountry}
              />

              {/* Member Nations Grid */}
              <div 
                className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-4 shadow-sm transition-colors"
                style={{ backgroundColor: selectedRegionCalmBg }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 font-display">
                      Member Nations & Jurisdictions ({sortedMemberCountries.length})
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Click any sovereign state to inspect its full national profile and economic indicators
                    </p>
                  </div>

                  <span className="text-xs font-mono text-zinc-500">
                    Sorted by GDP (Nominal)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sortedMemberCountries.map(country => {
                    const countryM49 = UN_M49_NUMERIC_CODES[country.id] || '—';
                    return (
                      <button
                        key={country.id}
                        type="button"
                        id={`member-card-${country.id.toLowerCase()}`}
                        onClick={() => onSelectCountry(country.id)}
                        className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer group flex items-center justify-between text-left shadow-xs hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                      >
                        <div className="flex items-center gap-3">
                          <CountryFlag entityId={country.id} size="md" />
                          <div>
                            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                              {country.name}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              Cap: {country.capital} · <span className="font-mono">M49: {countryM49}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-mono tabular-nums text-xs">
                          <div className="font-bold text-zinc-900 dark:text-zinc-100">
                            ${country.gdp.toFixed(1)}B
                          </div>
                          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                            {country.pop.toFixed(1)}M pop
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Section: Economy & GDP */}
          {activeSection === 'economy' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* GDP Bar Chart */}
              <div 
                className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-4 shadow-sm transition-colors"
                style={{ backgroundColor: selectedRegionCalmBg }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
                  <div>
                    <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      Top Regional Economies by Nominal GDP ($ Billions)
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Comparative economic scale across leading member states in {selectedRegion}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">Source: IMF WEO / World Bank</span>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topEconomiesChartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#a1a1aa', fontSize: 11 }} 
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                      />
                      <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', color: '#f4f4f5' }}
                        formatter={(val: any) => [`$${val} Billion`, 'GDP']}
                      />
                      <Bar dataKey="gdp" fill={selectedRegionTonal.warmAccent} radius={[6, 6, 0, 0]} isAnimationActive={!prefersReducedMotion} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <ChartAccessibleTable
                  caption={`${selectedRegion} top regional economies by nominal GDP in USD billions`}
                  headers={['Country', 'Nominal GDP ($B)']}
                  rows={topEconomiesChartData.map((d: any) => [d.name, d.gdp])}
                />
              </div>

              {/* Economic Highlights & Commodities */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-3 transition-colors"
                  style={{ backgroundColor: selectedRegionCalmBg }}
                >
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    Key Commodities & Exports
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {wikiDossier.economy.topCommodities.join(' · ')}
                  </p>
                </div>

                <div 
                  className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-3 transition-colors"
                  style={{ backgroundColor: selectedRegionCalmBg }}
                >
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    Primary Economic Sectors
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                    {wikiDossier.economy.keyEconomicSectors.map((sector, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        <span>{sector}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div 
                  className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-3 transition-colors"
                  style={{ backgroundColor: selectedRegionCalmBg }}
                >
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Growth Outlook
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {wikiDossier.economy.growthOutlook}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section: AfCFTA & Trade Corridors (Suggestion 1) */}
          {activeSection === 'afcfta' && (
            <RegionalAfcftaTradeSection
              region={selectedRegion}
              onSelectCountry={onSelectCountry}
            />
          )}

          {/* Section: Historical Trade Corridors (Suggestion 2) */}
          {activeSection === 'historic-routes' && (
            <RegionalHistoricCorridorsSection
              region={selectedRegion}
            />
          )}

          {/* Section: Cross-Border Ecological Infrastructure & River Basins (Suggestion 3) */}
          {activeSection === 'ecology' && (
            <RegionalEcologySection
              region={selectedRegion}
            />
          )}

          {/* Section: Regional Power Pools & Energy Grids (Suggestion 4) */}
          {activeSection === 'power-pools' && (
            <RegionalPowerPoolsSection
              region={selectedRegion}
            />
          )}

          {/* Section: Demographics */}
          {activeSection === 'demographics' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Population Bar Chart */}
              <div 
                className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-4 shadow-sm transition-colors"
                style={{ backgroundColor: selectedRegionCalmBg }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
                  <div>
                    <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-500" />
                      Population Distribution Across Leading Member States (Millions)
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Demographic weighting across {selectedRegion}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">Source: UN DESA 2024</span>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topEconomiesChartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#a1a1aa', fontSize: 11 }} 
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                      />
                      <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', color: '#f4f4f5' }}
                        formatter={(val: any) => [`${val} Million`, 'Population']}
                      />
                      <Bar dataKey="pop" fill="#10b981" radius={[6, 6, 0, 0]} isAnimationActive={!prefersReducedMotion} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <ChartAccessibleTable
                  caption={`${selectedRegion} population distribution across leading member states`}
                  headers={['Country', 'Population (Millions)']}
                  rows={topEconomiesChartData.map((d: any) => [d.name, d.pop])}
                />
              </div>

              {/* Demographic Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-2 transition-colors"
                  style={{ backgroundColor: selectedRegionCalmBg }}
                >
                  <span className="text-zinc-500 block text-[11px] font-mono uppercase font-bold">Urbanization Rate</span>
                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    {wikiDossier.demographics.urbanizationRate}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Proportion of population residing in municipal agglomerations.
                  </p>
                </div>

                <div 
                  className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-2 transition-colors"
                  style={{ backgroundColor: selectedRegionCalmBg }}
                >
                  <span className="text-zinc-500 block text-[11px] font-mono uppercase font-bold">Median Age</span>
                  <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                    {wikiDossier.demographics.medianAgeYears} Years
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Continental youth demographic dividend indicator.
                  </p>
                </div>

                <div 
                  className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-2 transition-colors"
                  style={{ backgroundColor: selectedRegionCalmBg }}
                >
                  <span className="text-zinc-500 block text-[11px] font-mono uppercase font-bold">Life Expectancy</span>
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {wikiDossier.demographics.lifeExpectancyAvg} Years
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Average life expectancy at birth across member states.
                  </p>
                </div>
              </div>

              {/* Trajectory Note */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <strong className="text-zinc-900 dark:text-zinc-100 font-bold block mb-1">Demographic Trajectory:</strong>
                {wikiDossier.demographics.demographicTrajectory}
              </div>
            </div>
          )}

          {/* Section: Politics & RECs */}
          {activeSection === 'politics' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div 
                className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-5 shadow-sm transition-colors"
                style={{ backgroundColor: selectedRegionCalmBg }}
              >
                <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
                  <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 font-display">
                    Regional Economic Communities (RECs) & Treaty Frameworks
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Official integration bodies and regional security architectures recognized by the African Union
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wikiDossier.politics.primaryRecs.map(rec => (
                    <div 
                      key={rec.acronym}
                      className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-base font-mono text-emerald-600 dark:text-emerald-400">
                          {rec.acronym}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                          Est. {rec.treatyYear}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {rec.fullName}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        <span>HQ: {rec.headquarters}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Institutional Hubs & Governance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold uppercase text-zinc-500">Major Institutional Hubs</span>
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                      {wikiDossier.politics.institutionalHubs.join(' · ')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold uppercase text-zinc-500">Governance Profile</span>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {wikiDossier.politics.governanceProfile}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Languages & Scripts */}
          {activeSection === 'languages' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div 
                className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-6 shadow-sm transition-colors"
                style={{ backgroundColor: selectedRegionCalmBg }}
              >
                <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
                  <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                    <Languages className="w-5 h-5 text-emerald-500" />
                    Linguistic Geography, Major Phyla & Indigenous Scripts
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Polyglot traditions, continental language families, and ancestral orthographies
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Language Phyla */}
                  <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
                    <div className="text-xs font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">
                      Primary Language Phyla
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                      {wikiDossier.languages.majorPhyla.map((phylum, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <span>{phylum}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Vehicular Languages */}
                  <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
                    <div className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                      Major Vehicular & Trade Languages
                    </div>
                    <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
                      {wikiDossier.languages.vehicularLanguages.join(' · ')}
                    </p>
                  </div>

                  {/* Indigenous Scripts */}
                  <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
                    <div className="text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
                      Indigenous Scripts & Orthographies
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                      {wikiDossier.languages.indigenousScripts.map((script, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{script}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Polyglot Description */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <strong className="text-emerald-700 dark:text-emerald-300 font-bold block mb-1">Polyglot Culture:</strong>
                  {wikiDossier.languages.polyglotDescription}
                </div>
              </div>
            </div>
          )}

          {/* Section: TAST & Historical Association */}
          {activeSection === 'tast' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div 
                className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-6 shadow-sm transition-colors"
                style={{ backgroundColor: selectedRegionCalmBg }}
              >
                <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Historical Legacies &amp; Voyages Archive
                  </span>
                  <h3 className="font-extrabold text-xl text-zinc-900 dark:text-zinc-100 font-display mt-1 flex items-center gap-2">
                    <Anchor className="w-5 h-5 text-rose-500" />
                    Transatlantic Slave Trade (TAST) Regional Association
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Historical embarkation zones, documented voyages records, departure ports, and diasporic connections
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
                    <span className="text-zinc-500 block text-[11px] font-mono uppercase font-bold">Historical Embarkation Zones</span>
                    <div className="space-y-1">
                      {wikiDossier.tastAssociation.embarkationZones.map((zone, idx) => (
                        <div key={idx} className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          <span>{zone}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
                    <span className="text-zinc-500 block text-[11px] font-mono uppercase font-bold">Documented Captives Embarked</span>
                    <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                      {wikiDossier.tastAssociation.estimatedCaptivesEmbarked}
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      From the Transatlantic Slave Trade Database (Voyages 1514–1866).
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
                    <span className="text-zinc-500 block text-[11px] font-mono uppercase font-bold">Primary Historic Ports</span>
                    <p className="text-xs font-mono text-zinc-800 dark:text-zinc-200 leading-relaxed">
                      {wikiDossier.tastAssociation.primaryHistoricPorts.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <strong className="text-zinc-900 dark:text-zinc-100 font-bold block">Historical Analysis &amp; Archival Context:</strong>
                  <p>{wikiDossier.tastAssociation.voyagesHistoricalNotes}</p>
                </div>

                <div>
                  <span className="text-xs font-mono font-bold uppercase text-zinc-500 block mb-1.5">Major Diasporic Destinations</span>
                  <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                    {wikiDossier.tastAssociation.diasporicDestinations.join(' · ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Climate & Biomes */}
          {activeSection === 'climate' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div 
                className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-6 shadow-sm transition-colors"
                style={{ backgroundColor: selectedRegionCalmBg }}
              >
                <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
                  <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                    <Trees className="w-5 h-5 text-emerald-500" />
                    Ecological Biomes, River Basins & Climate Systems
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Physical geography, major water courses, and biodiversity corridors
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Major Rivers */}
                  <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
                    <div className="text-xs font-mono font-bold uppercase text-cyan-600 dark:text-cyan-400">
                      Major River Basins & Waterways
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                      {wikiDossier.geography.majorRivers.map((riv, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                          <span>{riv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Major Biomes */}
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <div className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                      Ecological Biomes
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                      {wikiDossier.geography.majorBiomes.map((bio, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{bio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Climate Types */}
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <div className="text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
                      Climate Classifications
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                      {wikiDossier.geography.climateTypes.map((clim, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>{clim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <strong className="text-zinc-900 dark:text-zinc-100 font-bold block mb-1">Ecological Highlights:</strong>
                  {wikiDossier.geography.ecologicalHighlights}
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      )}

      {/* 3. CONTINENTAL COMPARATIVE MATRIX MODE (Across All 5 Regions & 8 RECs) */}
      {viewMode === 'matrix' && (
        <div
          id="regional-main-tabpanel"
          role="tabpanel"
          aria-labelledby="btn-regional-matrix-all"
          className="space-y-8 animate-in fade-in duration-200"
        >
          {/* Header Banner */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-sm transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Africa Continental Comparative Matrix · UN M49 &amp; RECs</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
                  Regional &amp; Economic Blocs Matrix
                </h1>
                <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Macro comparative analysis across the 5 AU Geographic Regions and 8 Regional Economic Communities (RECs).
                </p>
              </div>

              <div role="tablist" aria-label="Matrix perspective" className="flex flex-wrap gap-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-2xl">
                <button
                  type="button"
                  role="tab"
                  aria-selected={matrixSubTab === 'regions'}
                  onClick={() => setMatrixSubTab('regions')}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    matrixSubTab === 'regions'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  5 Geographic Regions
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={matrixSubTab === 'blocs'}
                  onClick={() => setMatrixSubTab('blocs')}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    matrixSubTab === 'blocs'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  Regional Blocs (RECs)
                </button>
              </div>
            </div>
          </div>

          {/* Continental Macro Comparison Visuals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GDP Distribution Pie Chart */}
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-3 shadow-sm transition-colors"
              style={{ backgroundColor: panAfricanCalmBg }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" /> Continental GDP Distribution ($B)
                </h3>
                <span className="text-[11px] font-mono text-zinc-500">2024 IMF WEO</span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gdpPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      isAnimationActive={!prefersReducedMotion}
                    >
                      {gdpPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', color: '#f4f4f5' }}
                      formatter={(val: any) => [`$${Number(val).toFixed(1)} Billion`, 'GDP']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-xs">
                {gdpPieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 font-mono">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-zinc-500 dark:text-zinc-400">{d.name}:</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">${d.value.toFixed(0)}B</span>
                  </div>
                ))}
              </div>
              <ChartAccessibleTable
                caption="Continental nominal GDP distribution by UN subregion"
                headers={['Subregion', 'Nominal GDP ($B)']}
                rows={gdpPieData.map(d => [d.name, d.value.toFixed(1)])}
              />
            </div>

            {/* Population Distribution Pie Chart */}
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-3 shadow-sm transition-colors"
              style={{ backgroundColor: panAfricanCalmBg }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" /> Continental Population Share (Millions)
                </h3>
                <span className="text-[11px] font-mono text-zinc-500">2024 UN DESA</span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={popPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      isAnimationActive={!prefersReducedMotion}
                    >
                      {popPieData.map((entry, index) => (
                        <Cell key={`cell-pop-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', color: '#f4f4f5' }}
                      formatter={(val: any) => [`${Number(val).toFixed(1)} Million`, 'Population']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-xs">
                {popPieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 font-mono">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-zinc-500 dark:text-zinc-400">{d.name}:</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{d.value.toFixed(0)}M</span>
                  </div>
                ))}
              </div>
              <ChartAccessibleTable
                caption="Continental population share by UN subregion in millions"
                headers={['Subregion', 'Population (Millions)']}
                rows={popPieData.map(d => [d.name, d.value.toFixed(1)])}
              />
            </div>
          </div>

          {/* Matrix Body: Regions or Blocs */}
          {matrixSubTab === 'regions' ? (
            <div 
              className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-6 shadow-sm transition-colors"
              style={{ backgroundColor: panAfricanCalmBg }}
            >
              <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 font-display">
                  Comparative Regional Data Matrix
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Macro metrics comparison across all 5 United Nations Geoscheme African regions
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-200/60 dark:border-zinc-800/60 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase">
                    <tr>
                      <th className="py-3 px-4">Region</th>
                      <th className="py-3 px-4">UN M49</th>
                      <th className="py-3 px-4">Sovereign States</th>
                      <th className="py-3 px-4">Nominal GDP</th>
                      <th className="py-3 px-4">Population</th>
                      <th className="py-3 px-4">Avg HDI</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/40 dark:divide-zinc-800/40">
                    {regionalSummaries.map(r => {
                      const tonal = getRegionTonalPalette(r.region);
                      const m49 = UN_M49_REGIONS[r.region]?.code || '—';
                      return (
                        <tr key={r.region} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tonal.warmAccent }} />
                            <span>{r.region}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-zinc-500">{m49}</td>
                          <td className="py-3.5 px-4 font-mono">{r.countryCount} States</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">{formatGDP(r.totalGdp)}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatPopulation(r.totalPopulation)}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">{formatHDI(r.averageHdi)}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                handleRegionChange(r.region);
                              }}
                              className="px-3 py-1 rounded-xl bg-white/80 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 dark:hover:bg-emerald-500 dark:hover:text-zinc-950 text-xs font-semibold transition-all cursor-pointer shadow-xs border border-zinc-200/60 dark:border-zinc-700/60"
                            >
                              Explore Region →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Blocs Selector Tabs - Fully Wrapped with No Hidden Elements */}
              <div className="flex flex-wrap items-center gap-2">
                {blocSummaries.map(b => (
                  <button
                    key={b.bloc}
                    id={`btn-bloc-${b.bloc.toLowerCase()}`}
                    onClick={() => setSelectedBloc(b.bloc)}
                    className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                      selectedBloc === b.bloc
                        ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md scale-[1.02]'
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {b.bloc} ({b.countriesCount})
                  </button>
                ))}
              </div>

              {/* Bloc Dossier */}
              <div 
                className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 space-y-6 shadow-sm transition-colors"
                style={{ backgroundColor: panAfricanCalmBg }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-5">
                  <div className="flex items-center gap-4">
                    <OrganizationLogo org={currentBlocSummary.bloc} size={48} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">{currentBlocSummary.bloc}</h2>
                        <span className="font-mono text-xs text-emerald-700 dark:text-emerald-300">
                          · {currentBlocSummary.countriesCount} Member States
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{currentBlocSummary.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                    <div className="bg-white/80 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 px-3 py-1.5 rounded-xl shadow-xs">
                      <span className="text-zinc-500">Combined GDP: </span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">{formatGDP(currentBlocSummary.totalGdp)}</span>
                    </div>
                    <div className="bg-white/80 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 px-3 py-1.5 rounded-xl shadow-xs">
                      <span className="text-zinc-500">Market Size: </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPopulation(currentBlocSummary.totalPopulation)}</span>
                    </div>
                  </div>
                </div>

                {/* Bloc Members */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Treaty Member States</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {currentBlocSummary.countries.map(country => (
                      <button
                        key={country.id}
                        type="button"
                        onClick={() => onSelectCountry(country.id)}
                        className="p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-black/20 hover:bg-white dark:hover:bg-zinc-800/80 transition-all cursor-pointer group flex items-center justify-between text-left shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CountryFlag entityId={country.id} size="sm" />
                          <div className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-500 transition-colors truncate">
                            {country.name}
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500 shrink-0">{country.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default RegionalView;
