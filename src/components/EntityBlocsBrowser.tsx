import React, { useState, useMemo } from 'react';
import { ENTITY_BLOCS, EntityBlocId, BlocCategory, getAllBlocs } from '../data/entityBlocs';
import { atlas } from '../data/atlas-store';
import { CountryFlag } from './CountryFlag';
import { formatPopulation, formatGDP, formatCurrency } from '../data/atlas-formatters';
import { 
  Layers, 
  Search, 
  ChevronRight, 
  ArrowRightLeft, 
  ShieldCheck, 
  TrendingUp, 
  Globe2,
  Building2
} from 'lucide-react';

interface EntityBlocsBrowserProps {
  onSelectCountry: (entityId: string) => void;
  initialBlocId?: EntityBlocId;
}

export const EntityBlocsBrowser: React.FC<EntityBlocsBrowserProps> = ({
  onSelectCountry,
  initialBlocId = 'ECOWAS'
}) => {
  const [selectedBlocId, setSelectedBlocId] = useState<EntityBlocId>(initialBlocId);
  const [searchFilter, setSearchFilter] = useState('');
  const [compareBlocId, setCompareBlocId] = useState<EntityBlocId>('EAC');
  const [showCompareMode, setShowCompareMode] = useState(false);

  const allBlocs = getAllBlocs();

  const categories: BlocCategory[] = [
    'Regional Economic Communities',
    'Trade & Customs Unions',
    'Continental Tiers',
    'Income & Vulnerability',
    'Resource Intensity'
  ];

  const currentBloc = ENTITY_BLOCS[selectedBlocId];
  const targetCompareBloc = ENTITY_BLOCS[compareBlocId];

  // Members list
  const currentMembers = useMemo(() => {
    return (currentBloc?.memberIso3s || [])
      .map(iso => atlas.getEntity(iso))
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
      .filter(e => {
        if (!searchFilter) return true;
        return (
          e.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          e.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
          e.capital.toLowerCase().includes(searchFilter.toLowerCase())
        );
      });
  }, [currentBloc, searchFilter]);

  // Aggregate stats calculator
  const calculateBlocAggregates = (blocId: EntityBlocId) => {
    const bloc = ENTITY_BLOCS[blocId];
    if (!bloc) return { pop: 0, gdp: 0, avgHdi: 0, countries: [] };

    const entities = bloc.memberIso3s
      .map(iso => atlas.getEntity(iso))
      .filter((e): e is NonNullable<typeof e> => Boolean(e));

    const totalPop = entities.reduce((acc, e) => acc + (e.facts.population || 0), 0);
    const totalGdp = entities.reduce((acc, e) => acc + (e.facts.gdp || 0), 0);
    const hdiList = entities.map(e => e.facts.hdi).filter((h): h is number => typeof h === 'number');
    const avgHdi = hdiList.length ? (hdiList.reduce((a, b) => a + b, 0) / hdiList.length) : 0;

    return {
      pop: totalPop,
      gdp: totalGdp,
      avgHdi,
      gdpPerCapita: totalPop > 0 ? (totalGdp / totalPop) : 0,
      count: entities.length
    };
  };

  const currentAgg = useMemo(() => calculateBlocAggregates(selectedBlocId), [selectedBlocId]);
  const compareAgg = useMemo(() => calculateBlocAggregates(compareBlocId), [compareBlocId]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>21 ANALYTICAL & REGIONAL ECONOMIC BLOCS</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              Regional Economic Communities & Geopolitical Tiers
            </h2>
            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl">
              Compare trade communities (ECOWAS, SADC, EAC, WAEMU, CEMAC, COMESA) and structural income and resource tiers across all 54 sovereign African states.
            </p>
          </div>

          <button
            onClick={() => setShowCompareMode(!showCompareMode)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
              showCompareMode
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-500" />
            <span>{showCompareMode ? 'Exit Comparison' : 'Side-by-Side Compare'}</span>
          </button>
        </div>
      </div>

      {/* Comparison Mode Deck */}
      {showCompareMode && (
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6 space-y-6 animate-enter-japandi">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Bloc Selection */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Primary Bloc</label>
              <select
                value={selectedBlocId}
                onChange={e => setSelectedBlocId(e.target.value as EntityBlocId)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-2.5 rounded-xl text-xs font-semibold focus:outline-none"
              >
                {allBlocs.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.shortName} ({b.memberCount} nations) — {b.category}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] uppercase font-mono text-zinc-400">Total Population</div>
                  <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">{formatPopulation(currentAgg.pop)}</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] uppercase font-mono text-zinc-400">Combined GDP</div>
                  <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">{formatGDP(currentAgg.gdp)}</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] uppercase font-mono text-zinc-400">GDP per Capita</div>
                  <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(currentAgg.gdpPerCapita)}</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] uppercase font-mono text-zinc-400">Average HDI</div>
                  <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">{currentAgg.avgHdi.toFixed(3)}</div>
                </div>
              </div>
            </div>

            {/* Right Bloc Selection */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Benchmark Bloc</label>
              <select
                value={compareBlocId}
                onChange={e => setCompareBlocId(e.target.value as EntityBlocId)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-2.5 rounded-xl text-xs font-semibold focus:outline-none"
              >
                {allBlocs.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.shortName} ({b.memberCount} nations) — {b.category}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] uppercase font-mono text-zinc-400">Total Population</div>
                  <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">{formatPopulation(compareAgg.pop)}</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] uppercase font-mono text-zinc-400">Combined GDP</div>
                  <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">{formatGDP(compareAgg.gdp)}</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] uppercase font-mono text-zinc-400">GDP per Capita</div>
                  <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(compareAgg.gdpPerCapita)}</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] uppercase font-mono text-zinc-400">Average HDI</div>
                  <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">{compareAgg.avgHdi.toFixed(3)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Bloc Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Bloc Selector Pills grouped by Category */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> 21 Analytical Groupings
            </h3>

            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
              {categories.map(cat => {
                const blocsInCat = allBlocs.filter(b => b.category === cat);
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-1">
                      {cat}
                    </div>
                    <div className="space-y-1">
                      {blocsInCat.map(bloc => {
                        const isSelected = selectedBlocId === bloc.id;
                        return (
                          <button
                            key={bloc.id}
                            onClick={() => setSelectedBlocId(bloc.id)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md font-bold'
                                : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: bloc.color }}
                              />
                              <span>{bloc.shortName}</span>
                            </div>
                            <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-zinc-800 text-zinc-300 dark:bg-zinc-200 dark:text-zinc-800'
                                : 'bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400'
                            }`}>
                              {bloc.memberCount}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Selected Bloc Details & Member Nations */}
        <div className="lg:col-span-8 space-y-6">
          {/* Bloc Identity Card */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {currentBloc.category}
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display mt-0.5">
                  {currentBloc.name} ({currentBloc.id})
                </h3>
              </div>
              {currentBloc.establishedYear && (
                <span className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-xs font-mono text-zinc-600 dark:text-zinc-400 self-start border border-zinc-200 dark:border-zinc-800">
                  Est. {currentBloc.establishedYear}
                </span>
              )}
            </div>

            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {currentBloc.description}
            </p>

            {currentBloc.headquarters && (
              <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                <span className="font-semibold">Headquarters:</span> {currentBloc.headquarters}
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Member States</div>
                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{currentBloc.memberCount}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Combined Pop.</div>
                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{formatPopulation(currentAgg.pop)}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Combined GDP</div>
                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{formatGDP(currentAgg.gdp)}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Avg GDP / Cap</div>
                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{formatCurrency(currentAgg.gdpPerCapita)}</div>
              </div>
            </div>
          </div>

          {/* Member Countries Filter & List */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                Member States ({currentMembers.length})
              </h4>
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder="Filter members..."
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 text-xs py-1.5 pl-8 pr-3 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentMembers.map(entity => (
                <button
                  key={entity.id}
                  onClick={() => onSelectCountry(entity.id)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <CountryFlag entityId={entity.id} size="sm" />
                    <div>
                      <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {entity.name}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {entity.capital}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
