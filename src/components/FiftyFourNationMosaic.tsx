/**
 * FiftyFourNationMosaic.tsx
 * High-density, interactive 54-nation mosaic matrix for the Africa Data Atlas Overview.
 * Replaces the central map with an executive-grade sovereign nation matrix:
 * - Displays all 54 sovereign African states in a compact responsive mosaic.
 * - Interactive filtering by the 5 UN M49 Geoscheme regions with official regional colors.
 * - Dynamic metric switching (Nominal GDP, Population, Real Growth, HDI Score).
 * - Multi-criteria sorting (High → Low, Low → High, A → Z) with sliding tactile pill.
 * - Dynamic regional tonal background tints, borders, and tactile hover physics.
 * - Direct deep-linking to each nation's full Country Dossier.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { atlas } from '../data/atlas-store';
import { AfricanRegion, AtlasEntity } from '../data/types';
import { CountryFlag } from './CountryFlag';
import { getRegionTonalPalette } from '../data/unGeoschemeColors';
import { 
  SPRING_TACTILE, 
  getRegionCardTonalStyle,
  usePrefersReducedMotion 
} from '../utils/motion';
import { triggerHaptic } from '../utils/mobileHaptics';
import { 
  Search, 
  ArrowUpDown, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Filter, 
  ExternalLink,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  ArrowDownAZ
} from 'lucide-react';

export type MosaicMetric = 'gdp' | 'population' | 'growth' | 'hdi';
export type MosaicSort = 'desc' | 'asc' | 'alpha';

interface FiftyFourNationMosaicProps {
  onSelectCountry: (entityId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

interface CountryMosaicItem {
  entity: AtlasEntity;
  region: AfricanRegion;
  gdpBillion: number;
  populationMillion: number;
  growthPct: number;
  hdiScore: number;
  perCapitaUsd: number;
}

interface RegionTabItem {
  id: AfricanRegion | 'All';
  label: string;
  count: number;
  color: string;
}

const REGION_TABS: RegionTabItem[] = [
  { id: 'All', label: 'All Africa', count: 54, color: '#10B981' },
  { id: 'Northern Africa', label: 'Northern', count: 7, color: '#2563EB' },
  { id: 'Western Africa', label: 'Western', count: 16, color: '#16A34A' },
  { id: 'Central Africa', label: 'Central', count: 9, color: '#C026D3' },
  { id: 'Eastern Africa', label: 'Eastern', count: 18, color: '#EAB308' },
  { id: 'Southern Africa', label: 'Southern', count: 5, color: '#DC2626' },
];

const METRIC_CONFIG: Array<{ id: MosaicMetric; label: string; title: string }> = [
  { id: 'gdp', label: 'GDP', title: 'Display Nominal GDP in Billions USD' },
  { id: 'population', label: 'Pop', title: 'Display Population in Millions' },
  { id: 'growth', label: 'Growth', title: 'Display Real GDP Annual Growth Rate' },
  { id: 'hdi', label: 'HDI', title: 'Display Human Development Index (HDI)' },
];

const SORT_OPTIONS: Array<{ id: MosaicSort; label: string; icon: React.FC<{ className?: string }> }> = [
  { id: 'desc', label: 'High → Low', icon: ArrowDownNarrowWide },
  { id: 'asc', label: 'Low → High', icon: ArrowUpNarrowWide },
  { id: 'alpha', label: 'A → Z', icon: ArrowDownAZ },
];

export const FiftyFourNationMosaic: React.FC<FiftyFourNationMosaicProps> = ({
  onSelectCountry,
  onNavigateTab
}) => {
  const [selectedRegion, setSelectedRegion] = useState<AfricanRegion | 'All'>('All');
  const [activeMetric, setActiveMetric] = useState<MosaicMetric>('gdp');
  const [sortOrder, setSortOrder] = useState<MosaicSort>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const reducedMotion = usePrefersReducedMotion();

  // Pre-compute normalized data for all 54 sovereign nations from the atlas store
  const allCountriesData = useMemo<CountryMosaicItem[]>(() => {
    const sovereign = atlas.getSovereignCountries();
    return sovereign.map(entity => {
      const gdpBillion = atlas.getIndicatorValue(entity.id, 'NY.GDP.MKTP.CD') || 0;
      const populationMillion = atlas.getIndicatorValue(entity.id, 'SP.POP.TOTL') || 0;
      const growthPct = atlas.getIndicatorValue(entity.id, 'NY.GDP.MKTP.KD.ZG') ?? 0;
      const hdiScore = atlas.getIndicatorValue(entity.id, 'UNDP.HDI.INDEX') ?? 0;
      const perCapitaUsd = populationMillion > 0 && gdpBillion > 0
        ? Math.round((gdpBillion * 1e9) / (populationMillion * 1e6))
        : 0;

      return {
        entity,
        region: entity.region,
        gdpBillion,
        populationMillion,
        growthPct,
        hdiScore,
        perCapitaUsd
      };
    });
  }, []);

  // Filter and sort
  const filteredCountries = useMemo(() => {
    let list = allCountriesData;

    // Region filter
    if (selectedRegion !== 'All') {
      list = list.filter(item => item.region === selectedRegion);
    }

    // Search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(item => 
        item.entity.name.toLowerCase().includes(q) ||
        item.entity.id.toLowerCase().includes(q) ||
        item.entity.iso2?.toLowerCase().includes(q) ||
        item.entity.capital?.toLowerCase().includes(q)
      );
    }

    // Sort order
    return [...list].sort((a, b) => {
      if (sortOrder === 'alpha') {
        return a.entity.name.localeCompare(b.entity.name);
      }

      let valA = 0;
      let valB = 0;

      if (activeMetric === 'gdp') {
        valA = a.gdpBillion;
        valB = b.gdpBillion;
      } else if (activeMetric === 'population') {
        valA = a.populationMillion;
        valB = b.populationMillion;
      } else if (activeMetric === 'growth') {
        valA = a.growthPct;
        valB = b.growthPct;
      } else if (activeMetric === 'hdi') {
        valA = a.hdiScore;
        valB = b.hdiScore;
      }

      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [allCountriesData, selectedRegion, searchQuery, activeMetric, sortOrder]);

  // Aggregate stats for currently filtered items
  const summary = useMemo(() => {
    const totalGdp = filteredCountries.reduce((acc, c) => acc + c.gdpBillion, 0);
    const totalPop = filteredCountries.reduce((acc, c) => acc + c.populationMillion, 0);
    const avgGrowth = filteredCountries.length > 0
      ? filteredCountries.reduce((acc, c) => acc + c.growthPct, 0) / filteredCountries.length
      : 0;
    const avgHdi = filteredCountries.length > 0
      ? filteredCountries.reduce((acc, c) => acc + c.hdiScore, 0) / filteredCountries.length
      : 0;

    return { totalGdp, totalPop, avgGrowth, avgHdi };
  }, [filteredCountries]);

  const renderMetricValue = (item: CountryMosaicItem) => {
    switch (activeMetric) {
      case 'gdp':
        return item.gdpBillion >= 100 
          ? `$${item.gdpBillion.toFixed(1)}B`
          : item.gdpBillion >= 1 
            ? `$${item.gdpBillion.toFixed(1)}B` 
            : `$${(item.gdpBillion * 1000).toFixed(0)}M`;
      case 'population':
        return `${item.populationMillion.toFixed(1)}M`;
      case 'growth':
        return `${item.growthPct > 0 ? '+' : ''}${item.growthPct.toFixed(1)}%`;
      case 'hdi':
        return item.hdiScore > 0 ? item.hdiScore.toFixed(3) : 'N/A';
    }
  };

  const getMetricBadgeStyle = (item: CountryMosaicItem) => {
    switch (activeMetric) {
      case 'gdp':
        return 'text-cyan-700 dark:text-cyan-300 font-mono';
      case 'population':
        return 'text-emerald-700 dark:text-emerald-300 font-mono';
      case 'growth':
        return item.growthPct >= 4
          ? 'text-emerald-700 dark:text-emerald-300 font-mono'
          : item.growthPct >= 0 
            ? 'text-amber-700 dark:text-amber-300 font-mono'
            : 'text-rose-700 dark:text-rose-300 font-mono';
      case 'hdi':
        return item.hdiScore >= 0.7 
          ? 'text-emerald-700 dark:text-emerald-300 font-mono'
          : item.hdiScore >= 0.55 
            ? 'text-amber-700 dark:text-amber-300 font-mono'
            : 'text-zinc-600 dark:text-zinc-400 font-mono';
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Strip: Region Tabs + Metric Toggle + Sort + Search */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs backdrop-blur-sm">
        {/* 1. Interactive UN Geoscheme Filters with Snappy Sliding Pill */}
        <div 
          className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 scrollbar-none" 
          role="tablist" 
          aria-label="Filter mosaic by region"
        >
          {REGION_TABS.map(tab => {
            const isSelected = selectedRegion === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedRegion(tab.id);
                }}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isSelected
                    ? 'text-white font-bold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                {/* Snappy sliding animated background pill with regional color */}
                {isSelected && (
                  <motion.div
                    layoutId="mosaicRegionPill"
                    className="absolute inset-0 rounded-xl shadow-xs"
                    style={{ backgroundColor: tab.color }}
                    transition={SPRING_TACTILE}
                  />
                )}

                {/* Content placed above the sliding pill */}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span 
                    className={`w-2 h-2 rounded-full shrink-0 transition-opacity ${
                      isSelected ? 'bg-white opacity-90' : ''
                    }`}
                    style={!isSelected ? { backgroundColor: tab.color } : undefined} 
                  />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-white/90' : 'text-zinc-400 dark:text-zinc-500'}`}>
                    {tab.count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Right side controls: Metric Switcher + Sort + Quick Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 2. Dynamic Metric Selector with Snappy Sliding Pill */}
          <div 
            className="flex items-center rounded-xl bg-zinc-100 dark:bg-zinc-800/80 p-0.5 border border-zinc-200/60 dark:border-zinc-700/60 text-xs"
            role="group"
            aria-label="Select metric display"
          >
            {METRIC_CONFIG.map(metric => {
              const isActive = activeMetric === metric.id;
              return (
                <button
                  key={metric.id}
                  onClick={() => setActiveMetric(metric.id)}
                  className={`relative px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors duration-150 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 ${
                    isActive
                      ? 'text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                  title={metric.title}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mosaicMetricPill"
                      className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-900 shadow-xs border border-zinc-200/50 dark:border-zinc-700/50"
                      transition={SPRING_TACTILE}
                    />
                  )}
                  <span className="relative z-10">{metric.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3. Multi-Criteria Sorting with Snappy Sliding Pill */}
          <div 
            className="flex items-center rounded-xl bg-zinc-100 dark:bg-zinc-800/80 p-0.5 border border-zinc-200/60 dark:border-zinc-700/60 text-xs"
            role="group"
            aria-label="Select sort ordering"
          >
            {SORT_OPTIONS.map(opt => {
              const isSelected = sortOrder === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSortOrder(opt.id)}
                  className={`relative px-2.5 py-1 rounded-lg font-mono flex items-center gap-1 cursor-pointer transition-colors duration-150 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 ${
                    isSelected
                      ? 'text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                  title={`Sort by ${opt.label}`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="mosaicSortPill"
                      className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-900 shadow-xs border border-zinc-200/50 dark:border-zinc-700/50"
                      transition={SPRING_TACTILE}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1">
                    <Icon className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="hidden sm:inline text-[11px]">{opt.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* 4. Instant Live Search Filter */}
          <div className="relative min-w-[130px] sm:min-w-[170px]">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter 54 nations..."
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-[10px] font-bold p-0.5 rounded cursor-pointer"
                title="Clear filter"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. 54-Nation Compact Matrix: Region Tonal Backgrounds + Tactile Hover */}
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-2.5"
        role="region"
        aria-label="54 Sovereign Nations Mosaic Grid"
      >
        {filteredCountries.map(item => {
          const tonal = getRegionCardTonalStyle(item.region);

          return (
            <motion.button
              key={item.entity.id}
              layout={!reducedMotion}
              onClick={() => {
                triggerHaptic('selection');
                onSelectCountry(item.entity.id);
              }}
              style={{
                backgroundColor: tonal.lightBackground,
                borderColor: tonal.lightBorder,
              }}
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      y: -3,
                      scale: 1.02,
                      backgroundColor: tonal.hoverBackground,
                      borderColor: tonal.hoverBorder,
                      boxShadow: tonal.hoverGlow,
                      transition: SPRING_TACTILE
                    }
              }
              whileTap={
                reducedMotion
                  ? undefined
                  : {
                      scale: 0.97,
                      transition: { type: 'spring', stiffness: 600, damping: 35 }
                    }
              }
              className="group relative p-2.5 rounded-xl border backdrop-blur-xs shadow-xs text-left grid grid-rows-3 items-center h-[88px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
              title={`${item.entity.name} (${item.region})\nCapital: ${item.entity.capital || 'N/A'}\nGDP: $${item.gdpBillion.toFixed(1)}B • Pop: ${item.populationMillion.toFixed(1)}M • Growth: ${item.growthPct}% • HDI: ${item.hdiScore}`}
            >
              {/* Top Row: Flag + ISO3 + Region Dot */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <CountryFlag entityId={item.entity.id} size="xs" />
                  <span className="font-mono text-[10px] font-bold text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100 transition-colors">
                    {item.entity.id}
                  </span>
                </div>
                <span 
                  className="w-2 h-2 rounded-full shrink-0 shadow-xs" 
                  style={{ backgroundColor: tonal.unBaseColor }}
                  title={item.region}
                />
              </div>

              {/* Middle Row: Country Name */}
              <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate w-full group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {item.entity.name}
              </div>

              {/* Bottom Row: Active Metric Badge */}
              <div className="flex items-center justify-between w-full pt-1 border-t border-zinc-200/50 dark:border-zinc-700/50">
                <span className="text-[10px] text-zinc-400 font-mono uppercase">
                  {activeMetric}
                </span>
                <span className={`text-xs font-bold ${getMetricBadgeStyle(item)}`}>
                  {renderMetricValue(item)}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCountries.length === 0 && (
        <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
            No sovereign nations match &ldquo;{searchQuery}&rdquo; in {selectedRegion}.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('All');
            }}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Mosaic Aggregate Summary Footbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-400">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono">
          <span>
            <strong className="text-zinc-900 dark:text-zinc-100">{filteredCountries.length}</strong> of 54 Sovereign States
          </span>
          <span>·</span>
          <span>
            Combined GDP: <strong className="text-cyan-700 dark:text-cyan-300">${summary.totalGdp.toFixed(1)}B</strong>
          </span>
          <span>·</span>
          <span>
            Population: <strong className="text-emerald-700 dark:text-emerald-300">{summary.totalPop.toFixed(1)}M</strong>
          </span>
          <span>·</span>
          <span>
            Avg Real Growth: <strong className="text-amber-700 dark:text-amber-300">+{summary.avgGrowth.toFixed(1)}%</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab?.('explore')}
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Explore 54 Country Dossiers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiftyFourNationMosaic;
