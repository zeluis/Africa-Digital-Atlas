import React, { useState, useMemo } from 'react';
import { 
  CANONICAL_VOYAGES, 
  SLAVEVOYAGES_METADATA, 
  REGIONAL_ROUTE_FLOWS, 
  AFRICAN_ORIGINS_PEOPLE,
  ENSLAVERS_REGISTRY,
  TIMELINE_MILESTONES,
  CENTURY_TIME_SERIES,
  CARRIER_BREAKDOWN,
  EMBARKATION_REGION_TOTALS,
  DISEMBARKATION_REGION_TOTALS
} from '../data/slaveVoyagesData';
import { 
  CanonicalVoyage, 
  VoyageFilterState, 
  EpistemicMode, 
  DatabaseType,
  AfricanEmbarkationRegion,
  AmericanDisembarkationRegion,
  CarrierNationality,
  RegionalRouteFlow,
  EnslavedPerson,
  EnslaverRecord
} from '../data/slaveVoyagesTypes';
import { filterVoyages, DEFAULT_FILTERS } from '../services/slaveVoyagesApi';
import { EpistemicStatusBadge } from '../components/slaveVoyages/EpistemicStatusBadge';
import { AtlanticFlowMap } from '../components/slaveVoyages/AtlanticFlowMap';
import { VoyageDossierModal } from '../components/slaveVoyages/VoyageDossierModal';
import { QueryBuilderPanel } from '../components/slaveVoyages/QueryBuilderPanel';
import { MolecularLegaciesView } from '../components/slaveVoyages/MolecularLegaciesView';
import { AfricanDevelopmentMasterReportView } from './AfricanDevelopmentMasterReportView';
import { 
  Anchor, 
  Compass, 
  Users, 
  Layers, 
  TrendingUp, 
  BarChart3, 
  Search, 
  Filter, 
  ExternalLink, 
  HelpCircle, 
  Calendar, 
  MapPin, 
  ShieldAlert, 
  BookOpen, 
  SlidersHorizontal,
  ChevronRight,
  Database,
  Building2,
  Skull,
  Award,
  Globe,
  Dna,
  ArrowRight,
  Sparkles,
  Scale
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export type SlaveTradeSubTab = 
  | 'overview'
  | 'voyages'
  | 'routes'
  | 'people'
  | 'enslavers'
  | 'analytics'
  | 'query'
  | 'methodology'
  | 'molecular'
  | 'foundations';

export interface SlaveTradeViewProps {
  onNavigateToMolecular?: () => void;
  onNavigateToFoundations?: () => void;
}

export const SlaveTradeView: React.FC<SlaveTradeViewProps> = ({
  onNavigateToMolecular,
  onNavigateToFoundations
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SlaveTradeSubTab>('overview');
  const [filters, setFilters] = useState<VoyageFilterState>(DEFAULT_FILTERS);
  const [selectedVoyage, setSelectedVoyage] = useState<CanonicalVoyage | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RegionalRouteFlow | null>(null);
  const [peopleSearch, setPeopleSearch] = useState('');
  const [enslaverSearch, setEnslaverSearch] = useState('');

  // Filtered dataset
  const filterResult = useMemo(() => {
    return filterVoyages(filters);
  }, [filters]);

  const updateFilters = (newPartial: Partial<VoyageFilterState>) => {
    setFilters(prev => ({ ...prev, ...newPartial }));
  };

  // Switch Epistemic Mode
  const handleSelectMode = (mode: EpistemicMode) => {
    updateFilters({ epistemicMode: mode });
  };

  // Switch Database Type
  const handleSelectDatabase = (db: DatabaseType) => {
    updateFilters({ database: db });
  };

  // Filtered African Origins People
  const filteredPeople = useMemo(() => {
    if (!peopleSearch.trim()) return AFRICAN_ORIGINS_PEOPLE;
    const q = peopleSearch.toLowerCase();
    return AFRICAN_ORIGINS_PEOPLE.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.modernSpelling?.toLowerCase().includes(q) ||
      p.linguisticGroup?.toLowerCase().includes(q) ||
      p.countryOfOrigin?.toLowerCase().includes(q) ||
      p.vesselName.toLowerCase().includes(q)
    );
  }, [peopleSearch]);

  // Filtered Enslavers
  const filteredEnslavers = useMemo(() => {
    if (!enslaverSearch.trim()) return ENSLAVERS_REGISTRY;
    const q = enslaverSearch.toLowerCase();
    return ENSLAVERS_REGISTRY.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.principalPorts.some(port => port.toLowerCase().includes(q)) ||
      e.primaryNationality.toLowerCase().includes(q)
    );
  }, [enslaverSearch]);

  // Dynamic Headline Numbers based on mode
  const headline = useMemo(() => {
    const stats = filterResult.aggregateStats;
    const mode = filters.epistemicMode;
    const meta = SLAVEVOYAGES_METADATA.headlineTotals[mode];

    return {
      voyagesCount: meta.voyages,
      embarked: meta.embarked,
      disembarked: meta.disembarked,
      mortalityRate: meta.mortalityRate,
      livesLost: meta.embarked - meta.disembarked,
      yearsCovered: meta.years
    };
  }, [filterResult, filters.epistemicMode]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-left">
      {/* 1. Header Banner & Epistemic Control Strip */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-emerald-950/80 border border-zinc-800 text-white shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Anchor className="w-5 h-5" />
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-xs font-mono font-bold text-emerald-300">
                SlaveVoyages Consortium (api.slavevoyages.org)
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-[11px] font-mono text-zinc-400">
                Snapshot {SLAVEVOYAGES_METADATA.version}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100">
              Atlantic Slave Trade Data Atlas
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              An authoritative research repository and geospatial analytics engine documenting four centuries of forced trans-Atlantic and intra-American maritime migrations (1514–1866), grounded in surviving archival records and rigorous statistical imputation.
            </p>
          </div>

          {/* Epistemic Certainty Mode Switcher */}
          <div className="shrink-0 space-y-2 bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 backdrop-blur-xs">
            <p className="text-[11px] font-mono uppercase font-bold text-zinc-400">
              Epistemic Certainty Mode
            </p>
            <EpistemicStatusBadge
              currentMode={filters.epistemicMode}
              onSelectMode={handleSelectMode}
            />
          </div>
        </div>

        {/* Database Switcher: Trans-Atlantic vs Intra-American vs Consolidated */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 font-bold uppercase">Database:</span>
            <div className="inline-flex p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium">
              <button
                onClick={() => handleSelectDatabase('consolidated')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filters.database === 'consolidated'
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Consolidated (All Trades)
              </button>
              <button
                onClick={() => handleSelectDatabase('transatlantic')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filters.database === 'transatlantic'
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Trans-Atlantic (36,108 Voyages)
              </button>
              <button
                onClick={() => handleSelectDatabase('intra_american')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filters.database === 'intra_american'
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Intra-American (11,400+ Voyages)
              </button>
            </div>
          </div>

          <div className="text-xs font-mono text-zinc-400">
            Current Filter View: <strong className="text-emerald-400">{filterResult.totalMatches}</strong> matching voyages
          </div>
        </div>

        {/* Headline Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-mono uppercase text-[10px]">Documented Voyages</span>
              <Compass className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-zinc-100">
              {headline.voyagesCount.toLocaleString()}
            </p>
            <span className="text-[10px] text-zinc-400 block font-mono">
              1514–1866 Registry
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-mono uppercase text-[10px]">Captives Embarked</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-400">
              {(headline.embarked / 1000000).toFixed(2)}M
            </p>
            <span className="text-[10px] text-zinc-400 block font-mono">
              {filters.epistemicMode === 'observed' ? 'Observed in logs' : 'Observed + Imputed'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-mono uppercase text-[10px]">Captives Disembarked</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-400">
              {(headline.disembarked / 1000000).toFixed(2)}M
            </p>
            <span className="text-[10px] text-zinc-400 block font-mono">
              Arrived in Americas
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-mono uppercase text-[10px]">Shipboard Mortality</span>
              <Skull className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-rose-400">
              {headline.mortalityRate}%
            </p>
            <span className="text-[10px] text-rose-300/80 block font-mono">
              {(headline.livesLost / 1000000).toFixed(2)}M lost at sea
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-mono uppercase text-[10px]">Temporal Scope</span>
              <Calendar className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-zinc-100">
              352 Years
            </p>
            <span className="text-[10px] text-zinc-400 block font-mono">
              1514 to 1866
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-zinc-800 no-scrollbar">
        {[
          { id: 'overview', label: '01 — Overview & Flow Map', icon: Globe },
          { id: 'voyages', label: '02 — Explore Voyages', icon: Compass },
          { id: 'routes', label: '03 — Geographic Routes', icon: Layers },
          { id: 'people', label: '04 — African Origins & Names', icon: Users },
          { id: 'enslavers', label: '05 — Enslavers & Networks', icon: Building2 },
          { id: 'analytics', label: '06 — Comparative Analytics', icon: BarChart3 },
          { id: 'query', label: '07 — Query Builder & Citations', icon: SlidersHorizontal },
          { id: 'methodology', label: '08 — Provenance & Methodology', icon: BookOpen },
          { id: 'molecular', label: '09 — Molecular & Material Legacies', icon: Dna },
          { id: 'foundations', label: '10 — Foundations of African Development (Master Report)', icon: Scale }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as SlaveTradeSubTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md scale-102'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Sub-Tab Views */}

      {/* TAB 1: OVERVIEW & FLOW MAP */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8">
          {/* Editorial Research Publications Callout Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] uppercase font-bold border border-indigo-500/30 flex items-center gap-1.5">
                  <Dna className="w-3 h-3" />
                  <span>Research Dossier</span>
                </span>
                <span className="text-[11px] font-mono text-indigo-400">Nature & Cell Genomics</span>
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">Molecular & Material Legacies</h4>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                  Ancient genomics, sex-biased admixture asymmetry, bioarchaeology at the New York African Burial Ground, and material culture diaspora.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onNavigateToMolecular) {
                      onNavigateToMolecular();
                    } else {
                      setActiveSubTab('molecular');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <span>Read Dedicated Editorial Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase font-bold border border-amber-500/30 flex items-center gap-1.5">
                  <Scale className="w-3 h-3" />
                  <span>Master Report</span>
                </span>
                <span className="text-[11px] font-mono text-amber-400">Nunn, Tadei & UN 2026</span>
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">Foundations of African Development</h4>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                  Macro-geonomics, Nathan Nunn mistrust scars, Tadei trade monopsonies, and UN 2026 reparations frameworks.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onNavigateToFoundations) {
                      onNavigateToFoundations();
                    } else {
                      setActiveSubTab('foundations');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-600/20"
                >
                  <span>Read Dedicated Master Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Atlantic Geodesic Flow Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                  Interactive Atlantic Geodesic Network
                </h3>
                <p className="text-xs text-zinc-500">
                  Visualizing African embarkation regions, American landing ports, and shipboard mortality rates across four centuries.
                </p>
              </div>
            </div>

            <AtlanticFlowMap
              epistemicMode={filters.epistemicMode}
              selectedRouteId={selectedRoute?.id}
              onSelectRoute={(r) => setSelectedRoute(r)}
            />
          </div>

          {/* Temporal Volume Chart over Centuries */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                  Century-by-Century Captives Transported (1501–1866)
                </h3>
                <p className="text-xs text-zinc-500">
                  Comparing Observed vs Imputed vs Historical Estimate bounds
                </p>
              </div>
              <EpistemicStatusBadge currentMode={filters.epistemicMode} interactive={false} />
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CENTURY_TIME_SERIES}>
                  <defs>
                    <linearGradient id="colorImputed" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEstimates" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" opacity={0.4} />
                  <XAxis dataKey="century" stroke="#71717a" fontSize={11} />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={11} 
                    tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`} 
                  />
                  <Tooltip 
                    formatter={(val: any) => [val.toLocaleString(), 'Captives']}
                    contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', color: '#fff' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="estimates" name="Macro Estimates" stroke="#6366f1" fillOpacity={1} fill="url(#colorEstimates)" />
                  <Area type="monotone" dataKey="imputed" name="Observed + Imputed" stroke="#10b981" fillOpacity={1} fill="url(#colorImputed)" />
                  <Area type="monotone" dataKey="observed" name="Observed Logbooks" stroke="#f59e0b" fillOpacity={0.3} fill="#f59e0b" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Historical Milestones */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Major Historical Milestones & Legislation (1518–1866)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TIMELINE_MILESTONES.map((m, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {m.year}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
                      {m.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {m.title}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {m.description}
                  </p>
                  <div className="pt-1 text-[11px] text-zinc-500 font-medium border-t border-zinc-200 dark:border-zinc-800/80">
                    <strong>Impact on Trade:</strong> {m.impactOnTrade}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Interdisciplinary Deep-Dive Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950 border border-indigo-800/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Dna className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider">
                  Featured Sub-Section (09)
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-zinc-100">
                The Molecular and Material Legacies of Slavery
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Explore an interdisciplinary synthesis uniting <strong>50,000+ population genomes</strong> (IBD haplotype deconvolution), <strong>ancient DNA (Zoutsteeg c. 1660s)</strong>, <strong>98% Maroon retention</strong>, <strong>sex-biased gene flow ledgers</strong>, and <strong>bioarchaeology from the New York African Burial Ground</strong>.
              </p>
            </div>

            <button
              onClick={() => setActiveSubTab('molecular')}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 shrink-0 cursor-pointer"
            >
              <span>Explore Molecular Atlas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Master Report Deep-Dive Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-zinc-950 border border-amber-800/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Scale className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                  Master Report (Sub-Section 10)
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-amber-100">
                The Structural and Evolutionary Foundations of African Development
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Comprehensive synthesis uniting <strong>Macro-Geonomics (Recent African Origin & Ashraf-Galor curve)</strong>, <strong>Nathan Nunn's 18M+ slave trade mistrust scar</strong>, <strong>Henn-Robinson pre-colonial governance (98% decentralized)</strong>, <strong>Tadei's colonial monopsony price-gap model</strong>, and the <strong>landmark March 25, 2026 UN General Assembly Slavery Resolution (123-3)</strong>.
              </p>
            </div>

            <button
              onClick={() => setActiveSubTab('foundations')}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/30 shrink-0 cursor-pointer"
            >
              <span>Open Master Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: EXPLORE VOYAGES */}
      {activeSubTab === 'voyages' && (
        <div className="space-y-6">
          {/* Multi-Parameter Filters Toolbar */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                  Voyage Filter & Search Query Engine
                </h3>
              </div>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-xs text-zinc-500 hover:text-emerald-500 font-mono font-bold transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Vessel Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-500 uppercase font-bold">Vessel / Captain / Port</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search Brooks, Amistad, Luanda..."
                    value={filters.vesselSearch}
                    onChange={(e) => updateFilters({ vesselSearch: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Embarkation Region */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-500 uppercase font-bold">African Embarkation Region</label>
                <select
                  value={filters.embarkationRegions[0] || ''}
                  onChange={(e) => updateFilters({ embarkationRegions: e.target.value ? [e.target.value as AfricanEmbarkationRegion] : [] })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All African Coasts</option>
                  <option value="West Central Africa">West Central Africa (Luanda / Cabinda / Benguela)</option>
                  <option value="Bight of Benin">Bight of Benin (Ouidah / Lagos)</option>
                  <option value="Bight of Biafra">Bight of Biafra (Bonny / Calabar)</option>
                  <option value="Gold Coast">Gold Coast (Cape Coast / Elmina)</option>
                  <option value="Senegambia">Senegambia (Gorée / St. Louis)</option>
                  <option value="Sierra Leone">Sierra Leone (Bunce Island / Gallinas)</option>
                  <option value="Southeast Africa & Indian Ocean">Southeast Africa (Mozambique / Quelimane)</option>
                </select>
              </div>

              {/* Disembarkation Region */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-500 uppercase font-bold">American Disembarkation Region</label>
                <select
                  value={filters.disembarkationRegions[0] || ''}
                  onChange={(e) => updateFilters({ disembarkationRegions: e.target.value ? [e.target.value as AmericanDisembarkationRegion] : [] })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All American Landing Zones</option>
                  <option value="Brazil">Brazil (Bahia / Rio de Janeiro / Recife)</option>
                  <option value="British Caribbean">British Caribbean (Jamaica / Barbados)</option>
                  <option value="French Caribbean">French Caribbean (Saint-Domingue / Martinique)</option>
                  <option value="Spanish Americas">Spanish Americas (Cuba / Puerto Rico / Cartagena)</option>
                  <option value="Mainland North America (USA)">Mainland North America (Charleston / Virginia)</option>
                  <option value="Dutch Caribbean & Guianas">Dutch Caribbean & Guianas (Suriname / Curaçao)</option>
                  <option value="Danish West Indies">Danish West Indies (St. Croix)</option>
                </select>
              </div>

              {/* Carrier Nationality */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-500 uppercase font-bold">Carrier Nationality</label>
                <select
                  value={filters.carriers[0] || ''}
                  onChange={(e) => updateFilters({ carriers: e.target.value ? [e.target.value as CarrierNationality] : [] })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Imperial Carriers</option>
                  <option value="Portugal / Brazil">Portugal / Brazil (🇵🇹/🇧🇷)</option>
                  <option value="Great Britain">Great Britain (🇬🇧)</option>
                  <option value="France">France (🇫🇷)</option>
                  <option value="Spain / Uruguay">Spain / Uruguay (🇪🇸)</option>
                  <option value="Netherlands">Netherlands (🇳🇱)</option>
                  <option value="United States">United States (🇺🇸)</option>
                  <option value="Denmark / Baltic">Denmark / Baltic (🇩🇰)</option>
                </select>
              </div>
            </div>

            {/* Checkbox Toggles & Year Range */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-700 dark:text-zinc-300">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.onlyResistanceRebellions}
                    onChange={(e) => updateFilters({ onlyResistanceRebellions: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Rebellions / Insurrections Only</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.post1808IllicitOnly}
                    onChange={(e) => updateFilters({ post1808IllicitOnly: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Post-1808 Illicit Trade Only</span>
                </label>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <span>Years: {filters.yearRange[0]}–{filters.yearRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Voyages Data Table */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50">
              <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                Matching Voyages ({filterResult.totalMatches} records)
              </span>
              <span className="text-xs text-zinc-500">
                Click any row to open the complete academic voyage dossier
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100/70 dark:bg-zinc-950 font-mono uppercase text-[10px] text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4">Vessel & Rig</th>
                    <th className="py-3 px-4">Carrier</th>
                    <th className="py-3 px-4">Purchase Place (Africa)</th>
                    <th className="py-3 px-4">Landing Place (Americas)</th>
                    <th className="py-3 px-4 text-right">Embarked</th>
                    <th className="py-3 px-4 text-right">Disembarked</th>
                    <th className="py-3 px-4 text-right">Mortality</th>
                    <th className="py-3 px-4 text-center">Resistance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {filterResult.voyages.map((v) => (
                    <tr
                      key={v.id}
                      onClick={() => setSelectedVoyage(v)}
                      className="hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {v.dates.departureYear}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {v.vessel.name}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {v.vessel.rig || 'Sailing Ship'} • {v.vessel.tonnage ? `${v.vessel.tonnage} tons` : 'Imputed tonnage'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span>{v.carrier.flag}</span>
                          <span className="font-medium">{v.carrier.nationality}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {v.itinerary.principalPlaceOfSlavePurchase.name}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {v.itinerary.principalPlaceOfSlavePurchase.region}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {v.itinerary.principalPlaceOfSlaveLanding.name}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {v.itinerary.principalPlaceOfSlaveLanding.region}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {v.enslaved.embarkedImputed.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {v.enslaved.disembarkedImputed.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded-md ${
                          v.enslaved.mortalityRateImputed > 15 
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {v.enslaved.mortalityRateImputed}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {v.resistance.hasRebellion ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            <span>Revolt</span>
                          </span>
                        ) : (
                          <span className="text-zinc-400 font-mono text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GEOGRAPHIC ROUTES & NETWORKS */}
      {activeSubTab === 'routes' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
              Primary Atlantic Oceanic Corridors & Transport Volumes
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Synthesized from regional embarkation and disembarkation matrices. West Central Africa to Brazil represents the single largest demographic corridor of the transatlantic trade.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {REGIONAL_ROUTE_FLOWS.map((route) => (
                <div
                  key={route.id}
                  className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3 hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {route.peakCentury}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      {route.voyagesCount.toLocaleString()} voyages
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-base font-black text-zinc-900 dark:text-zinc-100">
                    <span>{route.sourceRegion}</span>
                    <span className="text-emerald-500">➔</span>
                    <span>{route.targetRegion}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <p className="text-[10px] text-zinc-400 uppercase font-mono">Captives Embarked</p>
                      <p className="text-base font-black text-zinc-900 dark:text-zinc-100">
                        {route.embarkedCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <p className="text-[10px] text-zinc-400 uppercase font-mono">Middle Passage Mortality</p>
                      <p className={`text-base font-black ${route.avgMortalityRate > 15 ? 'text-rose-500' : 'text-amber-500'}`}>
                        {route.avgMortalityRate}%
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    <strong className="text-zinc-800 dark:text-zinc-200">Dominant Carriers:</strong>{' '}
                    {route.primaryCarriers.map(c => `${c.carrier} (${c.percentage}%)`).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AFRICAN ORIGINS & NAMES */}
      {activeSubTab === 'people' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                  African Origins / Liberated Africans Names Database
                </h3>
                <p className="text-xs text-zinc-500">
                  Recovered personal biographies recorded at Vice-Admiralty and Mixed Commission courts (Freetown, Havana, Rio de Janeiro).
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search by African name, language, vessel..."
                  value={peopleSearch}
                  onChange={(e) => setPeopleSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPeople.map((person) => (
                <div
                  key={person.id}
                  className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                        {person.name}
                      </span>
                      {person.modernSpelling && (
                        <span className="text-xs text-zinc-500 font-medium">
                          ({person.modernSpelling})
                        </span>
                      )}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      {person.arrivalYear}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase">Linguistic / Ethnolinguistic Group</p>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">{person.linguisticGroup} ({person.languageFamily})</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase">Age / Stature</p>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">{person.age} yrs • {person.statureInches} in ({person.statureCm} cm)</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase">Vessel of Interception</p>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">{person.vesselName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase">Probable Origin</p>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">{person.countryOfOrigin}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 text-[11px] text-zinc-500 font-serif italic">
                    <strong>Court Record:</strong> {person.registerName} ({person.courtLocation})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ENSLAVERS & NETWORKS */}
      {activeSubTab === 'enslavers' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                  Enslavers, Voyage Financiers & Captains Registry
                </h3>
                <p className="text-xs text-zinc-500">
                  Documenting merchants, syndicates, and investors who financed and commanded slave trading vessels.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search enslaver, port, nation..."
                  value={enslaverSearch}
                  onChange={(e) => setEnslaverSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEnslavers.map((ens) => (
                <div
                  key={ens.id}
                  className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                      {ens.name}
                    </h4>
                    <span className="text-xs font-mono font-bold text-zinc-500">
                      {ens.activeYears[0]}–{ens.activeYears[1]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {ens.roles.map((role, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-[10px] font-mono text-zinc-700 dark:text-zinc-300 font-bold">
                        {role}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-bold">
                      {ens.primaryNationality}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase">Voyages Financed</p>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">{ens.voyagesCount} transatlantic voyages</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase">Captives Trafficked</p>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">{ens.totalCaptivesHandled.toLocaleString()} souls</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {ens.historicalNotes}
                  </p>

                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 text-[11px] text-zinc-500 font-serif italic">
                    <strong>Source:</strong> {ens.biographicalSource}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: COMPARATIVE ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Carrier Nationality Breakdown */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Captives Embarked by National Carrier (1501–1866)
              </h3>
              <p className="text-xs text-zinc-500">
                Portugal & Brazil carried over 46% of all transatlantic captives, followed by Great Britain (26%).
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CARRIER_BREAKDOWN} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`} />
                    <YAxis dataKey="carrier" type="category" width={110} fontSize={11} />
                    <Tooltip formatter={(val: any) => [val.toLocaleString(), 'Captives']} />
                    <Bar dataKey="embarkedImputed" fill="#10b981" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* African Embarkation Coasts Distribution */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Embarkation Distribution by African Coast
              </h3>
              <p className="text-xs text-zinc-500">
                West Central Africa (Angola/Kongo) was the primary embarkation zone (5.69M captives).
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={EMBARKATION_REGION_TOTALS} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`} />
                    <YAxis dataKey="region" type="category" width={110} fontSize={10} />
                    <Tooltip formatter={(val: any) => [val.toLocaleString(), 'Captives']} />
                    <Bar dataKey="embarkedImputed" fill="#6366f1" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: QUERY BUILDER & CITATIONS */}
      {activeSubTab === 'query' && (
        <QueryBuilderPanel
          filters={filters}
          onUpdateFilters={updateFilters}
          filteredVoyages={filterResult.voyages}
          aggregateStats={filterResult.aggregateStats}
        />
      )}

      {/* TAB 8: METHODOLOGY & PROVENANCE */}
      {activeSubTab === 'methodology' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <BookOpen className="w-6 h-6 text-emerald-500" />
            <div>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                Methodological Architecture & SlaveVoyages API Standard
              </h3>
              <p className="text-xs text-zinc-500">
                Epistemic grounding, canonical data model, and live sync protocol
              </p>
            </div>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none text-xs leading-relaxed space-y-4">
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
              1. The Seven Imputed Variables (Eltis & Richardson Standard)
            </h4>
            <p>
              Historical records from the 16th through 19th centuries vary greatly in preservation. The SlaveVoyages consortium uses an advanced regression and modal imputation algorithm for seven major variables:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-600 dark:text-zinc-300">
              <li><strong>Year of Departure:</strong> Imputed from date of arrival or purchase records where departure date is unrecorded.</li>
              <li><strong>National Carrier / Flag:</strong> Inferred from captain nationality, home port, and vessel rig when flag is absent.</li>
              <li><strong>Vessel Tonnage:</strong> Statistically estimated from rig type and recorded captive capacities.</li>
              <li><strong>Voyage Beginning Port:</strong> Imputed from captain home registry and imperial trading charters.</li>
              <li><strong>Captives Embarked:</strong> Imputed from disembarked numbers using regional mortality curves when embarkation manifests are missing.</li>
              <li><strong>Captives Disembarked:</strong> Imputed from embarkation numbers minus regional shipboard mortality rates.</li>
              <li><strong>Shipboard Mortality Rate:</strong> Modeled from middle passage duration and embarkation/disembarkation discrepancy.</li>
            </ul>

            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 pt-3">
              2. Open API Architecture (api.slavevoyages.org)
            </h4>
            <p>
              This atlas integrates the canonical data model matching the current Swagger specification for SlaveVoyages, including the <code>/voyages</code>, <code>/enslaved</code>, <code>/enslavers</code>, <code>/estimates</code>, and <code>/routes</code> endpoints.
            </p>
          </div>
        </div>
      )}

      {/* TAB 9: MOLECULAR AND MATERIAL LEGACIES */}
      {activeSubTab === 'molecular' && (
        <MolecularLegaciesView />
      )}

      {/* TAB 10: FOUNDATIONS OF AFRICAN DEVELOPMENT (MASTER REPORT) */}
      {activeSubTab === 'foundations' && (
        <AfricanDevelopmentMasterReportView />
      )}

      {/* Voyage Dossier Modal */}
      <VoyageDossierModal
        voyage={selectedVoyage}
        onClose={() => setSelectedVoyage(null)}
      />
    </div>
  );
};
