import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { SPRING_TACTILE, usePrefersReducedMotion } from '../utils/motion';
import { atlas } from '../data/atlas-store';
import { AfricanRegion, AtlasEntity } from '../data/types';
import { CountryFlag } from '../components/CountryFlag';
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
  Sparkles
} from 'lucide-react';

interface ExploreViewProps {
  onSelectCountry: (entityId: string) => void;
}

type SortField = 'name' | 'population' | 'gdp' | 'hdi' | 'area';
type SortOrder = 'asc' | 'desc';
type TopologyFilter = 'all' | 'coastal' | 'landlocked' | 'sids';

const SIDS_SET = new Set(['CPV', 'STP', 'MUS', 'SYC', 'COM']);
const LANDLOCKED_SET = new Set(['BFA', 'BDI', 'CAF', 'TCD', 'SWZ', 'ETH', 'LSO', 'MWI', 'MLI', 'NER', 'RWA', 'SSD', 'UGA', 'ZMB', 'ZWE']);

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectCountry
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<AfricanRegion | 'All'>('All');
  const [topologyFilter, setTopologyFilter] = useState<TopologyFilter>('all');
  const [sortField, setSortField] = useState<SortField>('population');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table' | 'matrix'>('grid');

  const allEntities = atlas.getAllEntities();

  const regions: (AfricanRegion | 'All')[] = [
    'All',
    'Northern Africa',
    'Western Africa',
    'Central Africa',
    'Eastern Africa',
    'Southern Africa'
  ];

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
        return matchesRegion && matchesTopology && matchesQuery;
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
  }, [allEntities, regionFilter, searchQuery, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
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
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors duration-150 cursor-pointer select-none ${
                    isActive
                      ? 'text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="exploreLayoutToggle"
                      className="absolute inset-0 rounded-xl bg-white dark:bg-zinc-800 shadow-xs"
                      transition={SPRING_TACTILE}
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
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Region Tabs Filter - Fully Wrapping */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-zinc-400 font-medium mr-1 hidden lg:inline flex items-center gap-1">
              <Filter className="w-3 h-3" /> Region:
            </span>
            {regions.map(r => {
              const isSelected = regionFilter === r;
              return (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors duration-150 cursor-pointer select-none ${
                    isSelected
                      ? 'text-zinc-950 font-bold shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="exploreRegionPill"
                      className="absolute inset-0 rounded-xl bg-emerald-500 shadow-xs"
                      transition={SPRING_TACTILE}
                    />
                  )}
                  <span className="relative z-10">{r}</span>
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
                  className={`relative px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-colors duration-150 cursor-pointer select-none border border-zinc-200 dark:border-zinc-800 ${
                    isSelected
                      ? 'text-cyan-900 dark:text-cyan-200 font-bold shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="exploreTopologyPill"
                      className="absolute inset-0 rounded-xl bg-cyan-100/90 dark:bg-cyan-950/80 border border-cyan-400 dark:border-cyan-600 shadow-xs"
                      transition={SPRING_TACTILE}
                    />
                  )}
                  <span className="relative z-10">{tf.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-xs font-mono text-zinc-400">
            Showing {filteredAndSortedEntities.length} of 54 sovereign nations
          </span>
        </div>
      </div>

      {/* Results Count & Sort Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
        <div>
          Showing <strong className="text-zinc-900 dark:text-zinc-100 font-bold">{filteredAndSortedEntities.length}</strong> nations
          {regionFilter !== 'All' && ` in ${regionFilter}`}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span>Sort by:</span>
          {(['population', 'gdp', 'hdi', 'area', 'name'] as SortField[]).map(field => (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                sortField === field
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <span className="capitalize">{field}</span>
              {sortField === field && (
                <span className="text-[10px] font-mono">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* GRID VIEW */}
      {viewLayout === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedEntities.map(entity => {
            const pop = atlas.getIndicatorValue(entity.id, 'SP.POP.TOTL');
            const gdp = atlas.getIndicatorValue(entity.id, 'NY.GDP.MKTP.CD');
            const hdi = atlas.getIndicatorValue(entity.id, 'UNDP.HDI.INDEX');
            const silhouette = getCountrySilhouette(entity.id);
            const tonal = getCountryRegionTonalPalette(entity.id);

            return (
              <div
                key={entity.id}
                onClick={() => onSelectCountry(entity.id)}
                className={`group rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer flex flex-col justify-between`}
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
                  <div className="flex items-center gap-2 mb-4 mt-1">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {entity.capital}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
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

                <div className={`mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold ${tonal.card.accentText} group-hover:translate-x-1 transition-transform`}>
                  <span>View Full Dossier</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewLayout === 'table' && (
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
      {viewLayout === 'matrix' && (
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
              <div
                key={entity.id}
                onClick={() => onSelectCountry(entity.id)}
                className="p-3.5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all cursor-pointer shadow-xs hover:shadow-md space-y-2.5"
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExploreView;
