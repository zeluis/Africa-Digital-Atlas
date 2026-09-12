import React, { useState, useEffect } from 'react';
import { atlas } from '../data/atlas-store';
import { getRegionalSummaries, getBlocSummaries } from '../data/atlas-selectors';
import { AfricanRegion, RegionalBloc, UNRegionName } from '../data/types';
import { CountryFlag } from '../components/CountryFlag';
import { AfricaVectorMap } from '../components/AfricaVectorMap';
import { RegionalSilhouette } from '../components/RegionalSilhouette';
import { OrganizationLogo } from '../components/OrganizationLogo';
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

export const RegionalView: React.FC<RegionalViewProps> = ({
  onSelectCountry,
  initialRegion = 'Western Africa'
}) => {
  const [viewMode, setViewMode] = useState<RegionalTabMode>('region-dossier');
  const [selectedRegion, setSelectedRegion] = useState<AfricanRegion>(initialRegion);
  const [activeSection, setActiveSection] = useState<RegionSectionId>('overview');
  const [hoveredMapRegion, setHoveredMapRegion] = useState<UNRegionName | null>(null);
  const [selectedBloc, setSelectedBloc] = useState<RegionalBloc>('ECOWAS');
  const [matrixSubTab, setMatrixSubTab] = useState<'regions' | 'blocs'>('regions');

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

  const regionSubSections = [
    { id: 'overview', label: 'Overview & Nations', icon: Globe2 },
    { id: 'economy', label: 'Economy & GDP', icon: DollarSign },
    { id: 'afcfta', label: 'AfCFTA & Trade Corridors', icon: TrendingUp },
    { id: 'historic-routes', label: 'Historic Trade Corridors', icon: Compass },
    { id: 'ecology', label: 'Cross-Border Ecology', icon: Trees },
    { id: 'power-pools', label: 'Power Pools & Grids', icon: Zap },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'politics', label: 'Politics & RECs', icon: Building2 },
    { id: 'languages', label: 'Languages & Scripts', icon: Languages },
    { id: 'tast', label: 'TAST & History', icon: Anchor },
    { id: 'climate', label: 'Climate & Biomes', icon: CloudSun }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. MASTER REGIONAL SELECTOR PANEL - NO CLIPPING, ALL BUTTONS FULLY VISIBLE */}
      <div 
        id="regional-selector-panel"
        className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-5 shadow-xl transition-all"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              AFRICAN REGIONAL PORTAL • UN GEOSCHEME M49
            </span>
            <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Select an African Region or View the Continental Comparative Matrix:
            </div>
          </div>

          {/* Region Buttons Panel - Fully Wrapping with No Hidden Elements */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {allFiveRegions.map(reg => {
              const isSelected = viewMode === 'region-dossier' && selectedRegion === reg;
              const tonal = getRegionTonalPalette(reg);
              const summary = regionalSummaries.find(r => r.region === reg);
              return (
                <button
                  key={reg}
                  id={`btn-region-${reg.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    setSelectedRegion(reg);
                    setViewMode('region-dossier');
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? `${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text} font-bold shadow-md ring-2 ring-offset-2 ring-zinc-400 dark:ring-zinc-600 scale-[1.02]`
                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{
                      backgroundColor: tonal.warmAccent,
                      boxShadow: `0 0 6px ${tonal.glowRgba}`
                    }}
                  />
                  <span>{reg}</span>
                  <span className="text-[10px] font-mono opacity-70 font-normal">
                    ({summary?.countryCount || 0})
                  </span>
                </button>
              );
            })}

            {/* Matrix Button */}
            <button
              id="btn-regional-matrix-all"
              onClick={() => setViewMode('matrix')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer border ${
                viewMode === 'matrix'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 font-bold shadow-md scale-[1.02]'
                  : 'bg-zinc-100 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5 text-emerald-500" />
              <span>Comparative Matrix (All Regions & Blocs)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REGION VIEW MODE (Dedicated Polished Intro Hero with Prominent SVG Silhouette) */}
      {viewMode === 'region-dossier' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* POLISHED INTRO HERO (Matches CountryView Hero Pattern with SVG Silhouette Plaque) */}
          <div 
            id="region-intro-hero"
            className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-6 md:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div 
              className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-25"
              style={{ background: selectedRegionTonal.warmAccent }}
            />

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8 relative z-10">
              {/* Left Side: Region Identity & Rich Wikipedia Encyclopedic Dossier */}
              <div className="flex-1 space-y-4 max-w-3xl">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold shadow-2xs ${selectedRegionTonal.badge.bg} ${selectedRegionTonal.badge.border} ${selectedRegionTonal.badge.text}`}>
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>UN M49: {wikiDossier.m49Code}</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    {wikiDossier.auRegion}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    {currentRegionSummary.countryCount} Member States & Territories
                  </span>
                </div>

                {/* Region Title */}
                <div>
                  <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 font-display tracking-tight">
                    {selectedRegion}
                  </h1>
                  <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                    Geographic, Economic, and Demographic Division of the African Continent
                  </p>
                </div>

                {/* Wikipedia Extract */}
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 font-mono text-xs">
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

              {/* Right Side: Prominent Region SVG Silhouette Plaque (Country Header Treatment) */}
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

          {/* 3. REGIONAL DEEP-DIVE SUB-TABS RIBBON - FULLY VISIBLE, NO TRUNCATION */}
          <div 
            id="region-subtabs-ribbon"
            className="flex flex-wrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3"
          >
            {regionSubSections.map(tab => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`subtab-${tab.id}`}
                  onClick={() => setActiveSection(tab.id as RegionSectionId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md scale-[1.02]'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 4. ACTIVE SECTION CONTENT */}

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
                      <div
                        key={country.id}
                        id={`member-card-${country.id.toLowerCase()}`}
                        onClick={() => onSelectCountry(country.id)}
                        className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-black/20 hover:bg-white dark:hover:bg-zinc-800/80 transition-all cursor-pointer group flex items-center justify-between shadow-xs hover:border-emerald-500/50"
                      >
                        <div className="flex items-center gap-3">
                          <CountryFlag entityId={country.id} size="md" />
                          <div>
                            <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-500 transition-colors">
                              {country.name}
                            </div>
                            <div className="text-xs text-zinc-500">
                              Cap: {country.capital} • <span className="font-mono">M49: {countryM49}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-mono text-xs">
                          <div className="font-bold text-zinc-800 dark:text-zinc-300">
                            ${country.gdp.toFixed(1)}B
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            {country.pop.toFixed(1)}M pop
                          </div>
                        </div>
                      </div>
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
                      <Bar dataKey="gdp" fill={selectedRegionTonal.warmAccent} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
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
                  <div className="flex flex-wrap gap-1.5">
                    {wikiDossier.economy.topCommodities.map((comm, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-white/70 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200/60 dark:border-zinc-700/60"
                      >
                        {comm}
                      </span>
                    ))}
                  </div>
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
                      <Bar dataKey="pop" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
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
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
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
                    <div className="flex flex-wrap gap-2">
                      {wikiDossier.politics.institutionalHubs.map((hub, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                          🏛️ {hub}
                        </span>
                      ))}
                    </div>
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
                    <div className="flex flex-wrap gap-1.5">
                      {wikiDossier.languages.vehicularLanguages.map((lang, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                          {lang}
                        </span>
                      ))}
                    </div>
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
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400">
                      HISTORICAL LEGACIES & VOYAGES ARCHIVE
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xl text-zinc-900 dark:text-zinc-100 font-display mt-1.5 flex items-center gap-2">
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
                    <div className="flex flex-wrap gap-1.5">
                      {wikiDossier.tastAssociation.primaryHistoricPorts.map((port, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-[11px] font-mono text-zinc-800 dark:text-zinc-200">
                          {port}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <strong className="text-zinc-900 dark:text-zinc-100 font-bold block">Historical Analysis & Archival Context:</strong>
                  <p>{wikiDossier.tastAssociation.voyagesHistoricalNotes}</p>
                </div>

                <div>
                  <span className="text-xs font-mono font-bold uppercase text-zinc-500 block mb-2">Major Diasporic Destinations</span>
                  <div className="flex flex-wrap gap-2">
                    {wikiDossier.tastAssociation.diasporicDestinations.map((dest, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                        📍 {dest}
                      </span>
                    ))}
                  </div>
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
      )}

      {/* 3. CONTINENTAL COMPARATIVE MATRIX MODE (Across All 5 Regions & 8 RECs) */}
      {viewMode === 'matrix' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-2xl transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-semibold mb-3 shadow-2xs bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>AFRICA CONTINENTAL COMPARATIVE MATRIX</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
                  Regional & Economic Blocs Matrix
                </h1>
                <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Macro comparative analysis across the 5 AU Geographic Regions and 8 Regional Economic Communities (RECs).
                </p>
              </div>

              {/* Sub-mode switcher - Wrapped, No Clipping */}
              <div className="flex flex-wrap gap-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-2xl">
                <button
                  onClick={() => setMatrixSubTab('regions')}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                    matrixSubTab === 'regions'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  5 Geographic Regions
                </button>
                <button
                  onClick={() => setMatrixSubTab('blocs')}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
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
                                setSelectedRegion(r.region);
                                setViewMode('region-dossier');
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
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">{currentBlocSummary.bloc}</h2>
                        <span className="font-mono text-xs bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                          {currentBlocSummary.countriesCount} Member States
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{currentBlocSummary.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
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
                      <div
                        key={country.id}
                        onClick={() => onSelectCountry(country.id)}
                        className="p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-black/20 hover:bg-white dark:hover:bg-zinc-800/80 transition-all cursor-pointer group flex items-center justify-between shadow-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <CountryFlag entityId={country.id} size="sm" />
                          <div className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-500 transition-colors truncate">
                            {country.name}
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500">{country.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
