import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SPRING_TACTILE, 
  SPRING_SNAPPY,
  SlidingPill,
  StaggerGrid,
  StaggerGridItem,
  getRegionCardTonalStyle,
  usePrefersReducedMotion 
} from '../utils/motion';
import { atlas } from '../data/atlas-store';
import { AfricanRegion, AtlasEntity } from '../data/types';
import { CountryFlag } from '../components/CountryFlag';
import { AtlasSelect } from '../components/common/AtlasSelect';
import { formatPopulation, formatGDP, formatHDI, formatArea } from '../data/atlas-formatters';
import { useTranslation } from '../i18n/LanguageContext';
import { getCountrySilhouette } from '../data/countrySilhouettes';
import { getCountryRegionTonalPalette } from '../data/unGeoschemeColors';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  ChevronRight, 
  Compass,
  TableProperties,
  Anchor,
  Mountain,
  Globe,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  ArrowRightLeft,
  Check
} from 'lucide-react';
import { getCountryTradeFlows } from '../data/criticalMineralsData';
import { ENTITY_BLOCS } from '../data/entityBlocs';

interface ExploreViewProps {
  onSelectCountry: (entityId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

type SortField = 'name' | 'population' | 'gdp' | 'hdi' | 'area';
type SortOrder = 'asc' | 'desc';
type TopologyFilter = 'all' | 'coastal' | 'landlocked' | 'sids';

const SIDS_SET = new Set(['CPV', 'STP', 'MUS', 'SYC', 'COM']);
const LANDLOCKED_SET = new Set(['BFA', 'BDI', 'CAF', 'TCD', 'SWZ', 'ETH', 'LSO', 'MWI', 'MLI', 'NER', 'RWA', 'SSD', 'UGA', 'ZMB', 'ZWE']);

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectCountry,
  onNavigateTab
}) => {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<AfricanRegion | 'All'>('All');
  const [topologyFilter, setTopologyFilter] = useState<TopologyFilter>('all');
  const [sortField, setSortField] = useState<SortField>('population');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table' | 'matrix'>('grid');

  // Multivariate Screener States
  const [isScreenerOpen, setIsScreenerOpen] = useState(false);
  const [minPopulation, setMinPopulation] = useState(0); // in millions
  const [minGdp, setMinGdp] = useState(0); // in billions
  const [minHdi, setMinHdi] = useState(0); // e.g. 0, 0.45, 0.55, 0.65
  const [minIntraTrade, setMinIntraTrade] = useState(0); // %
  const [recFilter, setRecFilter] = useState('ALL');

  const activeScreenerCount = (minPopulation > 0 ? 1 : 0) + 
    (minGdp > 0 ? 1 : 0) + 
    (minHdi > 0 ? 1 : 0) + 
    (minIntraTrade > 0 ? 1 : 0) + 
    (recFilter !== 'ALL' ? 1 : 0);

  const handleResetScreener = () => {
    setMinPopulation(0);
    setMinGdp(0);
    setMinHdi(0);
    setMinIntraTrade(0);
    setRecFilter('ALL');
  };

  const allEntities = atlas.getAllEntities();

  const regions: (AfricanRegion | 'All')[] = [
    'All',
    'Northern Africa',
    'Western Africa',
    'Central Africa',
    'Eastern Africa',
    'Southern Africa'
  ];

  const REGION_ACCENT_COLORS: Record<AfricanRegion | 'All', string> = {
    'All': '#10B981',
    'Northern Africa': '#2563EB',
    'Western Africa': '#16A34A',
    'Central Africa': '#C026D3',
    'Eastern Africa': '#EAB308',
    'Southern Africa': '#DC2626'
  };

  const filteredAndSortedEntities = useMemo(() => {
    return allEntities
      .filter(entity => {
        const matchesRegion = regionFilter === 'All' || entity.region === regionFilter;
        const isSids = SIDS_SET.has(entity.id);
        const isLandlocked = LANDLOCKED_SET.has(entity.id);
        const isCoastal = !isLandlocked;
        const matchesTopology = 
          topologyFilter === 'all' ? true :
          topologyFilter === 'sids' ? isSids :
          topologyFilter === 'landlocked' ? isLandlocked :
          topologyFilter === 'coastal' ? (isCoastal && !isSids) : true;

        const matchesQuery = !searchQuery || 
          entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entity.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entity.capital.toLowerCase().includes(searchQuery.toLowerCase());

        // Screener threshold checks
        const pop = atlas.getIndicatorValue(entity.id, 'SP.POP.TOTL') || 0;
        const gdp = atlas.getIndicatorValue(entity.id, 'NY.GDP.MKTP.CD') || 0;
        const hdiVal = atlas.getIndicatorValue(entity.id, 'UNDP.HDI.INDEX') || 0;
        const tradeFlows = getCountryTradeFlows(entity.id, entity.name);

        const matchesPop = minPopulation === 0 || pop >= minPopulation;
        const matchesGdp = minGdp === 0 || gdp >= minGdp;
        const matchesHdi = minHdi === 0 || hdiVal >= minHdi;
        const matchesTrade = minIntraTrade === 0 || tradeFlows.intraAfricanSharePct >= minIntraTrade;
        const matchesRec = recFilter === 'ALL' || (ENTITY_BLOCS[recFilter]?.memberIso3s.includes(entity.id));

        return matchesRegion && matchesTopology && matchesQuery && matchesPop && matchesGdp && matchesHdi && matchesTrade && matchesRec;
      })
      .sort((a, b) => {
        let valA: number | string = 0;
        let valB: number | string = 0;

        switch (sortField) {
          case 'name':
            valA = a.name;
            valB = b.name;
            break;
          case 'population':
            valA = atlas.getIndicatorValue(a.id, 'SP.POP.TOTL') || 0;
            valB = atlas.getIndicatorValue(b.id, 'SP.POP.TOTL') || 0;
            break;
          case 'gdp':
            valA = atlas.getIndicatorValue(a.id, 'NY.GDP.MKTP.CD') || 0;
            valB = atlas.getIndicatorValue(b.id, 'NY.GDP.MKTP.CD') || 0;
            break;
          case 'hdi':
            valA = atlas.getIndicatorValue(a.id, 'UNDP.HDI.INDEX') || 0;
            valB = atlas.getIndicatorValue(b.id, 'UNDP.HDI.INDEX') || 0;
            break;
          case 'area':
            valA = a.landAreaKm2 || 0;
            valB = b.landAreaKm2 || 0;
            break;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [allEntities, regionFilter, topologyFilter, searchQuery, sortField, sortOrder, minPopulation, minGdp, minHdi, minIntraTrade, recFilter]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <section aria-label="Sovereign African Nations Continental Explorer" className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-2xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Active Page Pill Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 mb-3 shadow-2xs">
              <Compass className="w-3.5 h-3.5" />
              <span>AFRICA ATLAS • CONTINENTAL EXPLORATION</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Explore 54 Sovereign African Nations
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
              Filter by sub-region, sort by macro-economic indicators, search capitals, and access high-resolution sovereign country dossiers.
            </p>
          </div>

          {/* Grid / Table / Matrix Toggle */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 shrink-0 self-start md:self-auto gap-0.5">
            {[
              { id: 'grid', label: 'Grid', icon: Grid },
              { id: 'table', label: 'Table', icon: List },
              { id: 'matrix', label: 'Matrix', icon: TableProperties },
            ].map(item => {
              const Icon = item.icon;
              const isActive = viewLayout === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setViewLayout(item.id as any)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isActive
                      ? 'text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <SlidingPill
                      layoutId="exploreLayoutToggle"
                      className="absolute inset-0 rounded-xl bg-white dark:bg-zinc-800 shadow-xs"
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by country, capital or ISO code..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Region Tabs Filter - Fully Wrapping with UN Geoscheme Colors */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-zinc-400 font-medium mr-1 hidden lg:inline flex items-center gap-1">
              <Filter className="w-3 h-3" /> Region:
            </span>
            {regions.map(r => {
              const isSelected = regionFilter === r;
              const accentColor = REGION_ACCENT_COLORS[r];
              return (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isSelected
                      ? 'text-white font-bold shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                  }`}
                >
                  {isSelected && (
                    <SlidingPill
                      layoutId="exploreRegionPill"
                      className="absolute inset-0 rounded-xl shadow-xs"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span 
                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-opacity ${
                        isSelected ? 'bg-white opacity-90' : ''
                      }`}
                      style={!isSelected ? { backgroundColor: accentColor } : undefined}
                    />
                    <span>{r}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Topology & Special Category Filters */}
        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-900/60 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-zinc-400 font-mono flex items-center gap-1 mr-1">
              <Globe className="w-3.5 h-3.5 text-cyan-500" /> Geographic Topology:
            </span>
            {[
              { id: 'all' as TopologyFilter, label: 'All (54)' },
              { id: 'coastal' as TopologyFilter, label: 'Coastal States (33)' },
              { id: 'landlocked' as TopologyFilter, label: 'Landlocked / LLDCs (15)' },
              { id: 'sids' as TopologyFilter, label: 'Island States / SIDS (6)' },
            ].map(tf => {
              const isSelected = topologyFilter === tf.id;
              return (
                <button
                  key={tf.id}
                  onClick={() => setTopologyFilter(tf.id)}
                  className={`relative px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-colors duration-150 cursor-pointer select-none border border-zinc-200 dark:border-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                    isSelected
                      ? 'text-cyan-900 dark:text-cyan-200 font-bold shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                  }`}
                >
                  {isSelected && (
                    <SlidingPill
                      layoutId="exploreTopologyPill"
                      className="absolute inset-0 rounded-xl bg-cyan-100/90 dark:bg-cyan-950/80 border border-cyan-400 dark:border-cyan-600 shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{tf.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={() => setIsScreenerOpen(prev => !prev)}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                isScreenerOpen || activeScreenerCount > 0
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-purple-300'
              }`}
              title="Toggle Multivariate Econometric Screener (Population, GDP, HDI, Intra-African Trade, RECs)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Multivariate Screener</span>
              {activeScreenerCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-purple-700 text-[10px] flex items-center justify-center font-bold">
                  {activeScreenerCount}
                </span>
              )}
            </motion.button>

            <span className="text-xs font-mono text-zinc-400">
              Showing {filteredAndSortedEntities.length} of 54 sovereign nations
            </span>
          </div>
        </div>
      </div>

      {/* Multivariate Econometric Screener Panel */}
      <AnimatePresence>
        {isScreenerOpen && (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0, scale: 0.98 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, height: 'auto', scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0, scale: 0.98 }}
            transition={SPRING_SNAPPY}
            className="overflow-hidden"
          >
            <div className="rounded-3xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 dark:border-purple-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display">
                    Multivariate Econometric Screener &amp; Threshold Filters
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  {activeScreenerCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetScreener}
                      className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Thresholds
                    </button>
                  )}
                  <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2.5 py-1 rounded-lg">
                    {filteredAndSortedEntities.length} of 54 nations match
                  </span>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
                {/* Min Population */}
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between text-zinc-500 font-mono text-[11px]">
                    <span>Min Population</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{minPopulation === 0 ? 'Any' : `${minPopulation}M+`}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="10"
                    value={minPopulation}
                    onChange={(e) => setMinPopulation(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                {/* Min GDP */}
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between text-zinc-500 font-mono text-[11px]">
                    <span>Min Nominal GDP</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{minGdp === 0 ? 'Any' : `$${minGdp}B+`}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="20"
                    value={minGdp}
                    onChange={(e) => setMinGdp(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                {/* Min HDI */}
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between text-zinc-500 font-mono text-[11px]">
                    <span>Min Human Dev. (HDI)</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{minHdi === 0 ? 'Any' : minHdi.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.75"
                    step="0.05"
                    value={minHdi}
                    onChange={(e) => setMinHdi(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                {/* Intra-African Trade % */}
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between text-zinc-500 font-mono text-[11px]">
                    <span>Min Intra-Africa Trade</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{minIntraTrade === 0 ? 'Any' : `${minIntraTrade}%+`}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="35"
                    step="5"
                    value={minIntraTrade}
                    onChange={(e) => setMinIntraTrade(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                {/* Regional Economic Community (REC) */}
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                  <div className="text-zinc-500 font-mono text-[11px]">Regional Bloc (REC)</div>
                  <AtlasSelect
                    aria-label="Filter nations by Regional Economic Community"
                    value={recFilter}
                    onChange={(e) => setRecFilter(e.target.value)}
                    accent="indigo"
                    size="xs"
                    className="w-full font-bold py-1.5"
                  >
                    <option value="ALL">All RECs (Continental)</option>
                    <option value="ECOWAS">ECOWAS (West Africa)</option>
                    <option value="SADC">SADC (Southern Africa)</option>
                    <option value="EAC">EAC (East Africa)</option>
                    <option value="AMU">AMU (Maghreb)</option>
                    <option value="ECCAS">ECCAS (Central Africa)</option>
                    <option value="COMESA">COMESA (Common Market)</option>
                  </AtlasSelect>
                </div>
              </div>

              {/* Cohort Action Button */}
              {onNavigateTab && filteredAndSortedEntities.length >= 2 && (
                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-zinc-500">
                    Cohort ready for comparative econometric benchmarking:
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('compare')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Benchmark Filtered Cohort in Bilateral Lab</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count & Sort Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
        <div>
          Showing <strong className="text-zinc-900 dark:text-zinc-100 font-bold">{filteredAndSortedEntities.length}</strong> nations
          {regionFilter !== 'All' && ` in ${regionFilter}`}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-zinc-400 font-medium mr-0.5">Sort by:</span>
          <div 
            className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs"
            role="group"
            aria-label="Sort nations criteria"
          >
            {(['population', 'gdp', 'hdi', 'area', 'name'] as SortField[]).map(field => {
              const isSelected = sortField === field;
              return (
                <button
                  key={field}
                  onClick={() => toggleSort(field)}
                  className={`relative px-2.5 py-1 rounded-lg font-semibold cursor-pointer select-none transition-colors duration-150 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 ${
                    isSelected
                      ? 'text-emerald-950 dark:text-emerald-100 font-bold shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                  title={`Sort by ${field}`}
                >
                  {isSelected && (
                    <SlidingPill
                      layoutId="exploreSortCriteriaPill"
                      className="absolute inset-0 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-400/60 dark:border-emerald-600/60 shadow-2xs"
                    />
                  )}
                  <span className="relative z-10 capitalize">{field}</span>
                  {isSelected && (
                    <motion.span
                      animate={{ rotate: sortOrder === 'asc' ? 180 : 0 }}
                      transition={SPRING_TACTILE}
                      className="relative z-10 inline-block text-[11px] font-mono leading-none"
                    >
                      ↓
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredAndSortedEntities.length === 0 && (
        <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/60 shadow-sm space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            No sovereign nations match your current filter and threshold parameters.
          </p>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Try adjusting your search query, selecting another geographic region, or resetting econometric screener thresholds.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setRegionFilter('All');
              setTopologyFilter('all');
              handleResetScreener();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer select-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* GRID VIEW */}
      {viewLayout === 'grid' && filteredAndSortedEntities.length > 0 && (
        <StaggerGrid
          role="region"
          aria-label="54 Sovereign African Nations Grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredAndSortedEntities.map(entity => {
            const pop = atlas.getIndicatorValue(entity.id, 'SP.POP.TOTL');
            const gdp = atlas.getIndicatorValue(entity.id, 'NY.GDP.MKTP.CD');
            const hdi = atlas.getIndicatorValue(entity.id, 'UNDP.HDI.INDEX');
            const silhouette = getCountrySilhouette(entity.id);
            const tonal = getCountryRegionTonalPalette(entity.id);
            const regionTonal = getRegionCardTonalStyle(entity.region);

            return (
              <motion.div
                key={entity.id}
                layout="position"
                onClick={() => onSelectCountry(entity.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCountry(entity.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Inspect ${entity.name} sovereign dossier`}
                whileHover={
                  reducedMotion
                    ? undefined
                    : {
                        y: -4,
                        boxShadow: regionTonal.hoverGlow,
                        borderColor: regionTonal.hoverBorder,
                        transition: SPRING_SNAPPY
                      }
                }
                whileTap={
                  reducedMotion
                    ? undefined
                    : {
                        scale: 0.985,
                        transition: SPRING_TACTILE
                      }
                }
                className="group rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs transition-colors duration-200 cursor-pointer flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 select-none"
              >
                <div>
                  {/* Card Header: Flag + Regional ISO3 code on left, Prominent UN Geoscheme Vector Silhouette on right */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <CountryFlag entityId={entity.id} size="md" />
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                        {entity.id}
                      </span>
                    </div>

                    {silhouette && (
                      <div 
                        className={`w-14 h-14 flex items-center justify-center p-1.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 ${tonal.card.borderHover} ${tonal.card.bgHover} transition-all shrink-0`}
                      >
                        <svg
                          viewBox={silhouette.viewBox}
                          className="w-full h-full max-w-[46px] max-h-[46px] group-hover:scale-105 transition-transform duration-300 select-none"
                          style={{ color: tonal.warmAccent }}
                          xmlns="http://www.w3.org/2000/svg"
                          aria-label={`${entity.name} map silhouette`}
                        >
                          <path
                            d={silhouette.path}
                            fill="currentColor"
                            fillOpacity="0.22"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                          {silhouette.islandPaths?.map((islandPath, idx) => (
                            <path
                              key={idx}
                              d={islandPath}
                              fill="currentColor"
                              fillOpacity="0.22"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                            />
                          ))}
                        </svg>
                      </div>
                    )}
                  </div>

                  <h3 className={`font-extrabold text-lg text-zinc-900 dark:text-zinc-100 ${tonal.card.accentText} transition-colors`}>
                    {entity.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{entity.capital}</span>
                    <span className="text-zinc-300 dark:text-zinc-700">·</span>
                    <span className={`font-semibold ${tonal.badge.text}`}>
                      {entity.region}
                    </span>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 dark:text-zinc-400 font-medium font-mono text-[11px] uppercase tracking-wider">Population</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                        {formatPopulation(pop)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 dark:text-zinc-400 font-medium font-mono text-[11px] uppercase tracking-wider">Nominal GDP</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                        {formatGDP(gdp)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 dark:text-zinc-400 font-medium font-mono text-[11px] uppercase tracking-wider">HDI Score</span>
                      <span className={`font-bold font-mono ${tonal.badge.text}`}>
                        {formatHDI(hdi)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold ${tonal.card.accentText} transition-colors`}>
                  <span>View Full Dossier</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                </div>
              </motion.div>
            );
          })}
        </StaggerGrid>
      )}

      {/* TABLE VIEW */}
      {viewLayout === 'table' && filteredAndSortedEntities.length > 0 && (
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono uppercase text-[10px]">
                  <th className="py-3.5 px-4 font-semibold">Country</th>
                  <th className="py-3.5 px-4 font-semibold">Region</th>
                  <th className="py-3.5 px-4 font-semibold">Capital</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Population</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Nominal GDP</th>
                  <th className="py-3.5 px-4 font-semibold text-right">HDI</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Area</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredAndSortedEntities.map(entity => {
                  const pop = atlas.getIndicatorValue(entity.id, 'SP.POP.TOTL');
                  const gdp = atlas.getIndicatorValue(entity.id, 'NY.GDP.MKTP.CD');
                  const hdi = atlas.getIndicatorValue(entity.id, 'UNDP.HDI.INDEX');

                  return (
                    <tr
                      key={entity.id}
                      onClick={() => onSelectCountry(entity.id)}
                      className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <CountryFlag entityId={entity.id} size="sm" />
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-zinc-100">{entity.name}</div>
                            <div className="text-[10px] font-mono text-zinc-400">{entity.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300 font-medium">
                        {entity.region}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300">
                        {entity.capital}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-zinc-800 dark:text-zinc-200">
                        {formatPopulation(pop)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-zinc-800 dark:text-zinc-200">
                        {formatGDP(gdp)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatHDI(hdi)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-zinc-600 dark:text-zinc-400">
                        {formatArea(entity.landAreaKm2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-700 dark:text-zinc-300 font-semibold transition-all">
                          Dossier →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DENSITY MATRIX VIEW */}
      {viewLayout === 'matrix' && filteredAndSortedEntities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredAndSortedEntities.map(entity => {
            const pop = atlas.getIndicatorValue(entity.id, 'SP.POP.TOTL');
            const gdp = atlas.getIndicatorValue(entity.id, 'NY.GDP.MKTP.CD');
            const hdi = atlas.getIndicatorValue(entity.id, 'UNDP.HDI.INDEX');
            const elec = atlas.getIndicatorValue(entity.id, 'EG.ELC.ACCS.ZS');
            const isSids = SIDS_SET.has(entity.id);
            const isLandlocked = LANDLOCKED_SET.has(entity.id);
            const gdpPerCap = (pop && gdp && pop > 0) ? Math.round((gdp * 1e9) / (pop * 1e6)) : null;

            return (
              <motion.div
                key={entity.id}
                layout="position"
                onClick={() => onSelectCountry(entity.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCountry(entity.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Inspect ${entity.name} sovereign dossier`}
                whileHover={
                  reducedMotion
                    ? undefined
                    : {
                        y: -2,
                        transition: SPRING_TACTILE
                      }
                }
                whileTap={
                  reducedMotion
                    ? undefined
                    : {
                        scale: 0.985
                      }
                }
                className="p-3.5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-colors cursor-pointer shadow-xs hover:shadow-md space-y-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 select-none"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CountryFlag entityId={entity.id} size="sm" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                        {entity.name}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400">
                        {entity.id} · {entity.region}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                    isSids
                      ? 'bg-cyan-50 dark:bg-cyan-950/70 border-cyan-400/40 text-cyan-800 dark:text-cyan-300'
                      : isLandlocked
                      ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-400/40 text-amber-800 dark:text-amber-300'
                      : 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-400/40 text-emerald-800 dark:text-emerald-300'
                  }`}>
                    {isSids ? 'SIDS' : isLandlocked ? 'Landlocked' : 'Coastal'}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] font-mono">
                  <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60">
                    <span className="text-zinc-400 block text-[9px]">POPULATION</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{formatPopulation(pop)}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60">
                    <span className="text-zinc-400 block text-[9px]">NOM. GDP</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{formatGDP(gdp)}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60">
                    <span className="text-zinc-400 block text-[9px]">PER CAPITA</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{gdpPerCap ? `$${gdpPerCap.toLocaleString()}` : '—'}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60">
                    <span className="text-zinc-400 block text-[9px]">HDI / ELEC</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatHDI(hdi)} · {elec ? `${Math.round(elec)}%` : '—'}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ExploreView;
