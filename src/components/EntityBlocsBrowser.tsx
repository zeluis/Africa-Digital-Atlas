import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ENTITY_BLOCS, EntityBlocId, BlocCategory, getAllBlocs } from '../data/entityBlocs';
import { WIKIPEDIA_BLOC_DOSSIERS } from '../data/wikipediaBlocAtlas';
import { COUNTRY_HEADER_DATA } from '../data/countryHeaderData';
import { atlas } from '../data/atlas-store';
import { CountryFlag } from './CountryFlag';
import { formatPopulation, formatGDP, formatCurrency } from '../data/atlas-formatters';
import { 
  Layers, 
  Search, 
  ChevronRight, 
  ChevronDown,
  ArrowRightLeft, 
  Building2,
  Users,
  Coins,
  TrendingUp,
  Award,
  BookOpen,
  ExternalLink,
  Globe,
  Compass,
  Landmark,
  Trees,
  Scale,
  FileText,
  Languages,
  Sparkles,
  MapPin,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface EntityBlocsBrowserProps {
  onSelectCountry: (entityId: string) => void;
  initialBlocId?: EntityBlocId;
}

type WikiTabId = 'overview' | 'indicators' | 'demographics' | 'geography' | 'landmarks' | 'institutions';

export const EntityBlocsBrowser: React.FC<EntityBlocsBrowserProps> = ({
  onSelectCountry,
  initialBlocId = 'ECOWAS'
}) => {
  const [selectedBlocId, setSelectedBlocId] = useState<EntityBlocId>(initialBlocId);
  const [searchFilter, setSearchFilter] = useState('');
  const [compareBlocId, setCompareBlocId] = useState<EntityBlocId>('EAC');
  const [showCompareMode, setShowCompareMode] = useState(false);
  const [activeWikiTab, setActiveWikiTab] = useState<WikiTabId>('overview');

  const allBlocs = getAllBlocs();

  const categories: BlocCategory[] = [
    'Regional Economic Communities',
    'Trade & Customs Unions',
    'Continental Tiers',
    'Income & Vulnerability',
    'Resource Intensity'
  ];

  const currentBloc = ENTITY_BLOCS[selectedBlocId] || ENTITY_BLOCS['ECOWAS'];
  const targetCompareBloc = ENTITY_BLOCS[compareBlocId] || ENTITY_BLOCS['EAC'];
  const wikiDossier = WIKIPEDIA_BLOC_DOSSIERS[selectedBlocId] || WIKIPEDIA_BLOC_DOSSIERS['ECOWAS'];

  // Accordion state: only one accordion open at any time
  const [openCategory, setOpenCategory] = useState<BlocCategory | null>(() => currentBloc.category);

  // Auto-expand the accordion of the selected bloc if it's in a different category
  useEffect(() => {
    if (currentBloc.category) {
      setOpenCategory(currentBloc.category);
    }
  }, [selectedBlocId, currentBloc.category]);

  const handleToggleCategory = (cat: BlocCategory) => {
    setOpenCategory(prev => (prev === cat ? null : cat));
  };

  // Members list
  const currentMembers = useMemo(() => {
    return (currentBloc?.memberIso3s || [])
      .map(iso => atlas.getEntity(iso))
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
      .filter(e => {
        if (!searchFilter) return true;
        const q = searchFilter.toLowerCase();
        const header = COUNTRY_HEADER_DATA[e.id];
        const langs = header?.languages?.official?.join(' ') || e.languages?.official?.join(' ') || '';
        const govt = header?.governmentType || e.governmentType || '';
        return (
          e.name.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.capital.toLowerCase().includes(q) ||
          langs.toLowerCase().includes(q) ||
          govt.toLowerCase().includes(q)
        );
      });
  }, [currentBloc, searchFilter]);

  // Aggregate stats calculator
  const calculateBlocAggregates = (blocId: EntityBlocId) => {
    const bloc = ENTITY_BLOCS[blocId];
    if (!bloc) return { pop: 0, gdp: 0, avgHdi: 0, gdpPerCapita: 0, count: 0 };

    const entities = bloc.memberIso3s
      .map(iso => atlas.getEntity(iso))
      .filter((e): e is NonNullable<typeof e> => Boolean(e));

    const totalPop = entities.reduce((acc, e) => {
      const p = atlas.getIndicatorValue(e.id, 'SP.POP.TOTL') ?? atlas.getIndicatorValue(e.id, 'POPULATION') ?? 0;
      return acc + p;
    }, 0);

    const totalGdp = entities.reduce((acc, e) => {
      const g = atlas.getIndicatorValue(e.id, 'NY.GDP.MKTP.CD') ?? atlas.getIndicatorValue(e.id, 'GDP_NOMINAL') ?? 0;
      return acc + g;
    }, 0);

    const hdiList = entities
      .map(e => ({
        hdi: atlas.getIndicatorValue(e.id, 'UNDP.HDI.INDEX') ?? atlas.getIndicatorValue(e.id, 'HDI'),
        pop: atlas.getIndicatorValue(e.id, 'SP.POP.TOTL') ?? atlas.getIndicatorValue(e.id, 'POPULATION') ?? 1
      }))
      .filter((item): item is { hdi: number; pop: number } => typeof item.hdi === 'number' && item.hdi > 0);

    const totalHdiPop = hdiList.reduce((acc, i) => acc + i.pop, 0);
    const avgHdi = totalHdiPop > 0
      ? hdiList.reduce((acc, i) => acc + i.hdi * i.pop, 0) / totalHdiPop
      : (hdiList.length ? hdiList.reduce((acc, i) => acc + i.hdi, 0) / hdiList.length : 0);

    // GDP per Capita: totalGdp in $Billion, totalPop in Million -> ($B * 1e9) / (M * 1e6) = (totalGdp / totalPop) * 1000
    const gdpPerCapita = totalPop > 0 && totalGdp > 0 ? (totalGdp / totalPop) * 1000 : 0;

    return {
      pop: totalPop,
      gdp: totalGdp,
      avgHdi,
      gdpPerCapita,
      count: entities.length
    };
  };

  const currentAgg = useMemo(() => calculateBlocAggregates(selectedBlocId), [selectedBlocId]);
  const compareAgg = useMemo(() => calculateBlocAggregates(compareBlocId), [compareBlocId]);

  return (
    <div className="space-y-8 md:space-y-9">
      {/* Top Header Card with MD3 surface elevation */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md p-6 sm:p-8 shadow-sm transition-all"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300/80 dark:border-emerald-700/60 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
              <Layers className="w-3.5 h-3.5" />
              <span>21 ANALYTICAL & REGIONAL ECONOMIC BLOCS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 font-display tracking-tight">
              Regional Economic Communities & Geopolitical Tiers
            </h2>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 max-w-3xl leading-relaxed">
              Explore trade integration agreements, customs unions, demographic baselines, geography, and Wikipedia dossiers across Africa's 21 recognized economic groupings.
            </p>
          </div>

          <button
            onClick={() => setShowCompareMode(!showCompareMode)}
            className={`flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0 ${
              showCompareMode
                ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-950 dark:border-zinc-100'
                : 'bg-zinc-100/90 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200/90 dark:border-zinc-700 hover:bg-zinc-200/90 dark:hover:bg-zinc-750'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 text-amber-500" />
            <span>{showCompareMode ? 'Exit Comparison' : 'Side-by-Side Compare'}</span>
          </button>
        </div>
      </motion.div>

      {/* Comparison Mode Deck */}
      <AnimatePresence>
        {showCompareMode && (
          <motion.div 
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="overflow-hidden rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-6 sm:p-8 space-y-6 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Side-by-Side Bloc Comparative Analysis</span>
              </h3>
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Live Aggregate Data</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Bloc Selection */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-4 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">Primary Bloc</label>
                <select
                  value={selectedBlocId}
                  onChange={e => setSelectedBlocId(e.target.value as EntityBlocId)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 p-3 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {allBlocs.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.shortName} ({b.memberCount} nations) — {b.category}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-3.5 pt-2">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                    <div className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400">Total Population</div>
                    <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5 font-mono">{formatPopulation(currentAgg.pop)}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                    <div className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400">Combined GDP</div>
                    <div className="text-lg font-black text-amber-700 dark:text-amber-400 mt-0.5 font-mono">{formatGDP(currentAgg.gdp)}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                    <div className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400">GDP per Capita</div>
                    <div className="text-lg font-black text-indigo-700 dark:text-indigo-400 mt-0.5 font-mono">{formatCurrency(currentAgg.gdpPerCapita)}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                    <div className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400">Average HDI</div>
                    <div className="text-lg font-black text-teal-700 dark:text-teal-400 mt-0.5 font-mono">{currentAgg.avgHdi > 0 ? currentAgg.avgHdi.toFixed(3) : '—'}</div>
                  </div>
                </div>
              </div>

              {/* Right Bloc Selection */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-4 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">Benchmark Bloc</label>
                <select
                  value={compareBlocId}
                  onChange={e => setCompareBlocId(e.target.value as EntityBlocId)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 p-3 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {allBlocs.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.shortName} ({b.memberCount} nations) — {b.category}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-3.5 pt-2">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                    <div className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400">Total Population</div>
                    <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5 font-mono">{formatPopulation(compareAgg.pop)}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                    <div className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400">Combined GDP</div>
                    <div className="text-lg font-black text-amber-700 dark:text-amber-400 mt-0.5 font-mono">{formatGDP(compareAgg.gdp)}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                    <div className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400">GDP per Capita</div>
                    <div className="text-lg font-black text-indigo-700 dark:text-indigo-400 mt-0.5 font-mono">{formatCurrency(compareAgg.gdpPerCapita)}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                    <div className="text-[10px] uppercase font-mono font-bold text-zinc-500 dark:text-zinc-400">Average HDI</div>
                    <div className="text-lg font-black text-teal-700 dark:text-teal-400 mt-0.5 font-mono">{compareAgg.avgHdi > 0 ? compareAgg.avgHdi.toFixed(3) : '—'}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Section: Side-by-Side Cards (21 Groupings Panel on Left, Bloc Identity Card on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 21 Groupings Accordion Panel (4 of 12 cols on desktop) */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col">
          <div className="bg-white/95 dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 font-mono flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>21 Groupings</span>
              </h3>
              <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                5 Accordions
              </span>
            </div>

            {/* Accordion Categories Container */}
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
              {categories.map(cat => {
                const blocsInCat = allBlocs.filter(b => b.category === cat);
                const isOpen = openCategory === cat;
                const containsSelected = blocsInCat.some(b => b.id === selectedBlocId);

                return (
                  <div 
                    key={cat} 
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isOpen
                        ? 'border-emerald-300/80 dark:border-emerald-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 shadow-xs'
                        : containsSelected
                        ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/30 dark:bg-zinc-950/20'
                        : 'border-zinc-200/70 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {/* Accordion Header Button */}
                    <button
                      onClick={() => handleToggleCategory(cat)}
                      className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer transition-colors hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          containsSelected ? 'bg-emerald-500 ring-2 ring-emerald-500/30' : 'bg-zinc-400 dark:bg-zinc-600'
                        }`} />
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-display truncate">
                          {cat}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {blocsInCat.length}
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                        >
                          <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                        </motion.div>
                      </div>
                    </button>

                    {/* Accordion Content Panel */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="p-2 pt-0 space-y-1.5 border-t border-zinc-100 dark:border-zinc-800/60 mt-1">
                            {blocsInCat.map(bloc => {
                              const isSelected = selectedBlocId === bloc.id;
                              return (
                                <motion.button
                                  key={bloc.id}
                                  whileHover={{ x: 2 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setSelectedBlocId(bloc.id)}
                                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-zinc-950 text-white dark:bg-emerald-500/20 dark:text-emerald-300 dark:border dark:border-emerald-500/60 shadow-sm font-bold'
                                      : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-800/70'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0 pr-1">
                                    <span
                                      className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-black/10 dark:ring-white/10"
                                      style={{ backgroundColor: bloc.color }}
                                    />
                                    <span className="truncate">{bloc.shortName}</span>
                                  </div>
                                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${
                                    isSelected
                                      ? 'bg-zinc-800 text-zinc-200 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold'
                                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                  }`}>
                                    {bloc.memberCount} states
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Regional Economic Communities Card with Rich Wikipedia Explorer (8 of 12 cols) */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedBlocId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col"
            >
              {/* Bloc Identity & Wikipedia Card */}
              <div 
                id="bloc-identity-card"
                className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/90 p-6 sm:p-7 space-y-6 shadow-sm flex flex-col justify-between"
              >
                {/* Header Info */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full ring-4 ring-emerald-500/20"
                          style={{ backgroundColor: currentBloc.color }} 
                        />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                          {currentBloc.category}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 font-display tracking-tight flex flex-wrap items-center gap-2">
                        <span>{currentBloc.name}</span>
                        <span className="text-zinc-500 dark:text-zinc-400 font-mono text-base sm:text-lg font-semibold">({currentBloc.id})</span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 self-start flex-wrap">
                      {currentBloc.establishedYear && (
                        <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700 shadow-xs">
                          Est. {currentBloc.establishedYear}
                        </span>
                      )}
                      <a
                        href={wikiDossier.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-xs font-mono font-bold text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Wikipedia</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    </div>
                  </div>

                  {/* Summary Extract */}
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                    {wikiDossier.extract}
                  </p>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80">
                      <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                      <span><strong>Headquarters:</strong> {wikiDossier.headquartersCity}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80">
                      <FileText className="w-3.5 h-3.5 text-zinc-500" />
                      <span><strong>Founding Treaty:</strong> {wikiDossier.foundingTreaty}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80">
                      <Languages className="w-3.5 h-3.5 text-zinc-500" />
                      <span><strong>Working Languages:</strong> {wikiDossier.officialWorkingLanguages.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Metrics Bar - 5 High Contrast MD3 Tonal Indicators */}
                <div 
                  id="bloc-quick-metrics-bar"
                  className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 pt-2"
                >
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 transition-all hover:shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-zinc-800 dark:text-zinc-200">Member States</div>
                      <div className="text-xl font-black text-zinc-950 dark:text-white mt-1 font-mono">{currentBloc.memberCount}</div>
                    </div>
                    <div className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 mt-1.5">Sovereign Nations</div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/70 transition-all hover:shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-emerald-900 dark:text-emerald-300">Combined Pop.</div>
                      <div className="text-xl font-black text-emerald-800 dark:text-emerald-400 mt-1 font-mono">{formatPopulation(currentAgg.pop)}</div>
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mt-1.5">2024 Demographic</div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/70 transition-all hover:shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-amber-900 dark:text-amber-300">Combined GDP</div>
                      <div className="text-xl font-black text-amber-800 dark:text-amber-400 mt-1 font-mono">{formatGDP(currentAgg.gdp)}</div>
                    </div>
                    <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 mt-1.5">Nominal USD (2024)</div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/90 dark:border-indigo-800/70 transition-all hover:shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-indigo-900 dark:text-indigo-300">Avg GDP / Cap</div>
                      <div className="text-xl font-black text-indigo-800 dark:text-indigo-400 mt-1 font-mono">{formatCurrency(currentAgg.gdpPerCapita)}</div>
                    </div>
                    <div className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-400 mt-1.5">Per Capita Average</div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/90 dark:border-teal-800/70 transition-all hover:shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1 xl:col-span-1">
                    <div>
                      <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-teal-900 dark:text-teal-300">Average HDI</div>
                      <div className="text-xl font-black text-teal-800 dark:text-teal-400 mt-1 font-mono">
                        {currentAgg.avgHdi > 0 ? currentAgg.avgHdi.toFixed(3) : '—'}
                      </div>
                    </div>
                    <div className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 mt-1.5">Weighted Human Dev.</div>
                  </div>
                </div>

                {/* Rich Wikipedia Dossier Section Tabs */}
                <div className="border-t border-zinc-200/80 dark:border-zinc-800 pt-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100/90 dark:bg-zinc-800/90 overflow-x-auto custom-scrollbar max-w-full">
                      {[
                        { id: 'overview', label: 'Summary', icon: BookOpen },
                        { id: 'indicators', label: 'Indicators & Trade', icon: TrendingUp },
                        { id: 'demographics', label: 'Demographics', icon: Users },
                        { id: 'geography', label: 'Geography & Biomes', icon: Compass },
                        { id: 'landmarks', label: 'Landmarks & Ecology', icon: Trees },
                        { id: 'institutions', label: 'Treaties & Organs', icon: Scale }
                      ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeWikiTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveWikiTab(tab.id as WikiTabId)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                              isActive
                                ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-xs font-bold'
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}`} />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tab Content Display */}
                  <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800 min-h-[140px]">
                    {activeWikiTab === 'overview' && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          {wikiDossier.summaryNarrative.map((para, idx) => (
                            <p key={idx} className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeWikiTab === 'indicators' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                          <div className="font-mono text-[10px] uppercase font-bold text-zinc-500">Customs Union Status</div>
                          <div className="font-bold text-zinc-900 dark:text-zinc-100">{wikiDossier.indicators.customsUnionStatus}</div>
                        </div>
                        <div className="space-y-1.5 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                          <div className="font-mono text-[10px] uppercase font-bold text-zinc-500">Trade Integration Score</div>
                          <div className="font-bold text-zinc-900 dark:text-zinc-100">{wikiDossier.indicators.tradeIntegrationScore}</div>
                        </div>
                        <div className="space-y-1.5 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                          <div className="font-mono text-[10px] uppercase font-bold text-zinc-500">Intra-Bloc Trade Share</div>
                          <div className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">{wikiDossier.indicators.intraBlocTradeShare}</div>
                        </div>
                        <div className="space-y-1.5 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                          <div className="font-mono text-[10px] uppercase font-bold text-zinc-500">Monetary Framework</div>
                          <div className="font-bold text-zinc-900 dark:text-zinc-100">{wikiDossier.indicators.monetaryFramework}</div>
                        </div>
                        <div className="sm:col-span-2 space-y-1.5 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                          <div className="font-mono text-[10px] uppercase font-bold text-zinc-500">Key Economic Pillars</div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {wikiDossier.indicators.keyEconomicPillars.map((pillar, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold text-xs border border-emerald-200/60 dark:border-emerald-800/50">
                                {pillar}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeWikiTab === 'demographics' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                          <div className="text-[10px] uppercase font-mono font-bold text-zinc-500">Total Population</div>
                          <div className="text-lg font-black text-zinc-950 dark:text-white mt-1 font-mono">{wikiDossier.demographics.estimatedPopulation}</div>
                          <div className="text-[10px] text-zinc-500 mt-1">Regional estimate</div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                          <div className="text-[10px] uppercase font-mono font-bold text-zinc-500">Urbanization Rate</div>
                          <div className="text-lg font-black text-indigo-700 dark:text-indigo-400 mt-1 font-mono">{wikiDossier.demographics.urbanizationRate}</div>
                          <div className="text-[10px] text-zinc-500 mt-1">Living in urban hubs</div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                          <div className="text-[10px] uppercase font-mono font-bold text-zinc-500">Median Age</div>
                          <div className="text-lg font-black text-teal-700 dark:text-teal-400 mt-1 font-mono">{wikiDossier.demographics.medianAge}</div>
                          <div className="text-[10px] text-zinc-500 mt-1">Demographic profile</div>
                        </div>
                        <div className="sm:col-span-3 p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                          <div className="text-[10px] uppercase font-mono font-bold text-zinc-500">Major Ethnolinguistic Phyla & Tongues</div>
                          <div className="flex flex-wrap gap-2">
                            {wikiDossier.demographics.majorEthnolinguisticPhyla.map((phylum, i) => (
                              <span key={i} className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium">
                                {phylum}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeWikiTab === 'geography' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                          <div className="text-[10px] uppercase font-mono font-bold text-zinc-500">Total Land Territory</div>
                          <div className="text-base font-black text-zinc-950 dark:text-white mt-1 font-mono">{wikiDossier.geography.landAreaKm2Formatted}</div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                          <div className="text-[10px] uppercase font-mono font-bold text-zinc-500">Dominant Climate Zones</div>
                          <div className="font-semibold text-zinc-800 dark:text-zinc-200 mt-1">{wikiDossier.geography.climateZones.join(', ')}</div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                          <div className="text-[10px] uppercase font-mono font-bold text-zinc-500">Major Waterways & Basins</div>
                          <ul className="list-disc list-inside space-y-0.5 text-zinc-700 dark:text-zinc-300">
                            {wikiDossier.geography.majorWaterways.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                          <div className="text-[10px] uppercase font-mono font-bold text-zinc-500">Dominant Biomes & Ecosystems</div>
                          <ul className="list-disc list-inside space-y-0.5 text-zinc-700 dark:text-zinc-300">
                            {wikiDossier.geography.dominantBiomes.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeWikiTab === 'landmarks' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                          <div className="text-[10px] uppercase font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <Trees className="w-3.5 h-3.5" />
                            <span>Transboundary Reserves & Corridors</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                            {wikiDossier.landmarksEcology.transboundaryReserves.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                          <div className="text-[10px] uppercase font-mono font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" />
                            <span>UNESCO Biospheres & World Heritage</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                            {wikiDossier.landmarksEcology.unescoBiospheres.map((u, i) => (
                              <li key={i}>{u}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                          <div className="text-[10px] uppercase font-mono font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5" />
                            <span>Notable Geographic Landmarks</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                            {wikiDossier.landmarksEcology.notableLandmarks.map((l, i) => (
                              <li key={i}>{l}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                          <div className="text-[10px] uppercase font-mono font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Ecological Vulnerabilities & Pressures</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                            {wikiDossier.landmarksEcology.ecologicalThreats.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeWikiTab === 'institutions' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                          <div className="text-[10px] uppercase font-mono font-bold text-zinc-500">Executive Organs & Councils</div>
                          <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                            {wikiDossier.institutionsTreaties.executiveOrgans.map((o, i) => (
                              <li key={i}>{o}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                          <div className="text-[10px] uppercase font-mono font-bold text-zinc-500">Parliamentary & Judicial Bodies</div>
                          <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                            {wikiDossier.institutionsTreaties.parliamentaryOrJudicialBodies.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                          <div className="text-[10px] uppercase font-mono font-bold text-zinc-500">Development & Financial Banks</div>
                          <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                            {wikiDossier.institutionsTreaties.financialInstitutions.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                          <div className="text-[10px] uppercase font-mono font-bold text-zinc-500">Key Protocols & Treaties</div>
                          <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                            {wikiDossier.institutionsTreaties.landmarkAgreements.map((a, i) => (
                              <li key={i}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Section: Full-Width Member States Panel with Controlled Top Margin */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`members-${selectedBlocId}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="mt-8 sm:mt-10 bg-white/95 dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm w-full"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 font-mono flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{currentBloc.shortName} Member States ({currentMembers.length})</span>
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Detailed sovereign profiles, total population, nominal GDP, official languages, and government systems
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Filter by country, capital, language, or government..."
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs py-2.5 pl-10 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentMembers.map(entity => {
              const headerMeta = COUNTRY_HEADER_DATA[entity.id];
              const pop = atlas.getIndicatorValue(entity.id, 'SP.POP.TOTL') ?? atlas.getIndicatorValue(entity.id, 'POPULATION') ?? 0;
              const gdp = atlas.getIndicatorValue(entity.id, 'NY.GDP.MKTP.CD') ?? atlas.getIndicatorValue(entity.id, 'GDP_NOMINAL') ?? 0;
              const officialLangs = headerMeta?.languages?.official?.length 
                ? headerMeta.languages.official.join(', ') 
                : (entity.languages?.official?.join(', ') || 'Official Language');
              const govtType = headerMeta?.governmentType || entity.governmentType || 'Constitutional Republic';
              const capitalCity = headerMeta?.capital || entity.capital;

              return (
                <motion.div
                  key={entity.id}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectCountry(entity.id)}
                  className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-zinc-50/90 dark:bg-zinc-950/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all text-left group cursor-pointer shadow-xs space-y-4"
                >
                  {/* Top Bar: Flag, Name, Capital, and ISO Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <CountryFlag entityId={entity.id} size="md" />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-zinc-950 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                          {entity.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span className="truncate">{capitalCity}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
                      {entity.id}
                    </span>
                  </div>

                  {/* Micro Metrics Grid: POP & GDP */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/80">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/80">
                      <div className="flex items-center gap-1 text-[10px] font-mono uppercase font-bold text-zinc-500">
                        <Users className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Total POP</span>
                      </div>
                      <div className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100 mt-0.5">
                        {pop > 0 ? formatPopulation(pop) : '—'}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/80">
                      <div className="flex items-center gap-1 text-[10px] font-mono uppercase font-bold text-zinc-500">
                        <Coins className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>Total GDP</span>
                      </div>
                      <div className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100 mt-0.5">
                        {gdp > 0 ? formatGDP(gdp) : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Governance & Language Profile Details */}
                  <div className="space-y-1.5 pt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-start gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 line-clamp-1">
                        <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">Official:</strong> {officialLangs}
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 line-clamp-1">
                        <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">Government:</strong> {govtType}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:underline">
                    <span>Inspect Sovereign Profile</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

