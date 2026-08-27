import React, { useState, useMemo } from 'react';
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
  Compass
} from 'lucide-react';

interface ExploreViewProps {
  onSelectCountry: (entityId: string) => void;
}

type SortField = 'name' | 'population' | 'gdp' | 'hdi' | 'area';
type SortOrder = 'asc' | 'desc';

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectCountry
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<AfricanRegion | 'All'>('All');
  const [sortField, setSortField] = useState<SortField>('population');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');

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
        const matchesQuery = !searchQuery || 
          entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entity.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entity.capital.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRegion && matchesQuery;
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

          {/* Grid / Table Toggle */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewLayout('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewLayout === 'grid'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewLayout('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewLayout === 'table'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Table</span>
            </button>
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

          {/* Region Tabs Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <span className="text-xs text-zinc-400 font-medium mr-1 hidden lg:inline flex items-center gap-1">
              <Filter className="w-3 h-3" /> Region:
            </span>
            {regions.map(r => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  regionFilter === r
                    ? 'bg-emerald-500 text-zinc-950 shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
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
                className={`group rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-lg hover:shadow-2xl ${tonal.card.borderHover} transition-all cursor-pointer flex flex-col justify-between`}
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
                        className={`w-14 h-14 flex items-center justify-center p-1.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800/80 ${tonal.card.borderHover} ${tonal.card.bgHover} transition-all shrink-0`}
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

                  <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 dark:text-zinc-500">Population</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                        {formatPopulation(pop)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 dark:text-zinc-500">Nominal GDP</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                        {formatGDP(gdp)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 dark:text-zinc-500">HDI Score</span>
                      <span className={`font-bold font-mono ${tonal.badge.text}`}>
                        {formatHDI(hdi)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold ${tonal.card.accentText} group-hover:translate-x-1 transition-transform`}>
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
    </div>
  );
};
