import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { lazyWithRetry } from '../utils/lazyWithRetry';
import {
  SLAVEVOYAGES_METADATA,
  REGIONAL_ROUTE_FLOWS,
  AFRICAN_ORIGINS_PEOPLE,
  ENSLAVERS_REGISTRY,
  TIMELINE_MILESTONES,
  CENTURY_TIME_SERIES,
  CARRIER_BREAKDOWN,
  EMBARKATION_REGION_TOTALS
} from '../data/slaveVoyagesData';
import {
  CanonicalVoyage,
  VoyageFilterState,
  EpistemicMode,
  DatabaseType,
  AfricanEmbarkationRegion,
  AmericanDisembarkationRegion,
  CarrierNationality,
  RegionalRouteFlow
} from '../data/slaveVoyagesTypes';
import { filterVoyages, DEFAULT_FILTERS } from '../services/slaveVoyagesApi';
import { EpistemicStatusBadge } from '../components/slaveVoyages/EpistemicStatusBadge';
import {
  Anchor,
  Compass,
  Users,
  Layers,
  BarChart3,
  Search,
  Filter,
  Calendar,
  ShieldAlert,
  BookOpen,
  SlidersHorizontal,
  Building2,
  Skull,
  Globe,
  Dna,
  ArrowRight,
  Scale,
  Download,
  Castle,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { motion, useReducedMotion } from 'motion/react';
import { SPRING_TACTILE } from '../utils/motion';
import { AtlasSelect } from '../components/common/AtlasSelect';

// Lazy-load heavier GIS mapping engines, archival iconography, and scholarly monographs on demand
const AtlanticFlowMap = lazyWithRetry(
  () => import('../components/slaveVoyages/AtlanticFlowMap').then(m => ({ default: m.AtlanticFlowMap || (m as any).default })),
  'AtlanticFlowMap'
);
const AfricanPortsMap = lazyWithRetry(
  () => import('../components/slaveVoyages/AfricanPortsMap').then(m => ({ default: m.AfricanPortsMap || (m as any).default })),
  'AfricanPortsMap'
);
const VoyageDossierModal = lazyWithRetry(
  () => import('../components/slaveVoyages/VoyageDossierModal').then(m => ({ default: m.VoyageDossierModal || (m as any).default })),
  'VoyageDossierModal'
);
const QueryBuilderPanel = lazyWithRetry(
  () => import('../components/slaveVoyages/QueryBuilderPanel').then(m => ({ default: m.QueryBuilderPanel || (m as any).default })),
  'QueryBuilderPanel'
);
const MolecularLegaciesView = lazyWithRetry(
  () => import('../components/slaveVoyages/MolecularLegaciesView').then(m => ({ default: m.MolecularLegaciesView || (m as any).default })),
  'MolecularLegaciesView'
);
const AfricanDevelopmentMasterReportView = lazyWithRetry(
  () => import('./AfricanDevelopmentMasterReportView').then(m => ({ default: m.AfricanDevelopmentMasterReportView || (m as any).default })),
  'AfricanDevelopmentMasterReportView'
);
const AcademicExportModal = lazyWithRetry(
  () => import('../components/AcademicExportModal').then(m => ({ default: m.AcademicExportModal || (m as any).default })),
  'AcademicExportModal'
);
const SlaveVoyagesEssaysViewer = lazyWithRetry(
  () => import('../components/slaveVoyages/SlaveVoyagesEssaysViewer').then(m => ({ default: m.SlaveVoyagesEssaysViewer || (m as any).default })),
  'SlaveVoyagesEssaysViewer'
);
const StorytellingGallery = lazyWithRetry(
  () => import('../components/slaveVoyages/StorytellingGallery').then(m => ({ default: m.StorytellingGallery || (m as any).default })),
  'StorytellingGallery'
);
const SlaveTradeIconography = lazyWithRetry(
  () => import('../components/slaveVoyages/SlaveTradeIconography').then(m => ({ default: m.SlaveTradeIconography || (m as any).default })),
  'SlaveTradeIconography'
);

export type SlaveTradeSubTab =
  | 'overview'
  | 'flow-map'
  | 'ports'
  | 'essays'
  | 'voyages'
  | 'routes'
  | 'people'
  | 'enslavers'
  | 'analytics'
  | 'query'
  | 'methodology'
  | 'molecular'
  | 'foundations'
  | 'iconography'
  | 'cartography';

export type SlaveTradePrimarySection =
  | 'overview'
  | 'maps'
  | 'registries'
  | 'analytics-query'
  | 'scholarship';

export interface SlaveTradeViewProps {
  onNavigateToMolecular?: () => void;
  onNavigateToFoundations?: () => void;
  onNavigateToIconography?: () => void;
  onNavigateToCartography?: () => void;
  onSubTabChange?: (subTab: SlaveTradeSubTab) => void;
  initialSubTab?: SlaveTradeSubTab;
}

const SECTION_FOR_SUBTAB: Record<SlaveTradeSubTab, SlaveTradePrimarySection> = {
  overview: 'overview',
  'flow-map': 'maps',
  ports: 'maps',
  voyages: 'registries',
  routes: 'registries',
  people: 'registries',
  enslavers: 'registries',
  analytics: 'analytics-query',
  query: 'analytics-query',
  essays: 'scholarship',
  methodology: 'scholarship',
  molecular: 'scholarship',
  foundations: 'scholarship',
  iconography: 'scholarship',
  cartography: 'scholarship'
};

const PRIMARY_SECTIONS: Array<{
  id: SlaveTradePrimarySection;
  label: string;
  shortLabel: string;
  defaultSubTab: SlaveTradeSubTab;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'overview', label: '01. Overview', shortLabel: 'Overview', defaultSubTab: 'overview', icon: Globe },
  { id: 'maps', label: '02. GIS Maps', shortLabel: 'GIS Maps', defaultSubTab: 'flow-map', icon: Compass },
  { id: 'registries', label: '03. Registries', shortLabel: 'Registries', defaultSubTab: 'voyages', icon: Layers },
  { id: 'analytics-query', label: '04. Analytics & Query', shortLabel: 'Analytics', defaultSubTab: 'analytics', icon: BarChart3 },
  { id: 'scholarship', label: '05. Scholarship & Provenance', shortLabel: 'Scholarship', defaultSubTab: 'essays', icon: BookOpen }
];

const EMBARKATION_MATRIX = [
  { name: 'West Central Africa', embarked: 5694574, pct: 45.5, dest: 'Brazil (90%) · Spanish Caribbean', mortality: '10.8%' },
  { name: 'Bight of Benin', embarked: 1999060, pct: 16.0, dest: 'Bahia · Saint-Domingue · Cuba', mortality: '14.2%' },
  { name: 'Bight of Biafra', embarked: 1595960, pct: 12.8, dest: 'British Caribbean · Virginia', mortality: '15.6%' },
  { name: 'Gold Coast', embarked: 1209321, pct: 9.7, dest: 'Jamaica · Barbados · Guianas', mortality: '12.4%' },
  { name: 'Senegambia', embarked: 755713, pct: 6.0, dest: 'French Caribbean · Chesapeake', mortality: '13.1%' },
  { name: 'SE Africa & Indian Ocean', embarked: 542748, pct: 4.3, dest: 'Rio de Janeiro · Mascarenes', mortality: '18.9%' },
  { name: 'Sierra Leone', embarked: 388771, pct: 3.1, dest: 'Carolinas · British Caribbean', mortality: '11.9%' },
  { name: 'Windward Coast', embarked: 336868, pct: 2.7, dest: 'Caribbean · North America', mortality: '13.7%' }
];
const MAX_EMBARKATION_VOLUME = Math.max(...EMBARKATION_MATRIX.map(r => r.embarked));

export const SlaveTradeView: React.FC<SlaveTradeViewProps> = ({
  onNavigateToMolecular,
  onNavigateToFoundations,
  onNavigateToIconography,
  onNavigateToCartography,
  onSubTabChange,
  initialSubTab
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeSubTab, setActiveSubTab] = useState<SlaveTradeSubTab>(initialSubTab || 'overview');
  const [lastSubTabBySection, setLastSubTabBySection] = useState<Record<SlaveTradePrimarySection, SlaveTradeSubTab>>({
    overview: 'overview',
    maps: 'flow-map',
    registries: 'voyages',
    'analytics-query': 'analytics',
    scholarship: 'essays'
  });

  useEffect(() => {
    onSubTabChange?.(activeSubTab);
  }, [activeSubTab, onSubTabChange]);

  const activeSection: SlaveTradePrimarySection = SECTION_FOR_SUBTAB[activeSubTab] || 'overview';

  const selectSubTab = (subTab: SlaveTradeSubTab) => {
    const parentSection = SECTION_FOR_SUBTAB[subTab];
    setLastSubTabBySection(prev => ({ ...prev, [parentSection]: subTab }));
    setActiveSubTab(subTab);
  };

  const selectPrimarySection = (sectionId: SlaveTradePrimarySection) => {
    const def = PRIMARY_SECTIONS.find(s => s.id === sectionId);
    const targetSub = lastSubTabBySection[sectionId] || def?.defaultSubTab || 'overview';
    setActiveSubTab(targetSub);
  };

  const [filters, setFilters] = useState<VoyageFilterState>(DEFAULT_FILTERS);
  const [selectedVoyage, setSelectedVoyage] = useState<CanonicalVoyage | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RegionalRouteFlow | null>(null);
  const [peopleSearch, setPeopleSearch] = useState('');
  const [enslaverSearch, setEnslaverSearch] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeEssayId, setActiveEssayId] = useState<string>('essay-global-magnitude');
  const [isSeasonalityOpen, setIsSeasonalityOpen] = useState(false);
  const [showMobileVoyageFilters, setShowMobileVoyageFilters] = useState(false);

  const filterResult = useMemo(() => filterVoyages(filters), [filters]);

  const updateFilters = (newPartial: Partial<VoyageFilterState>) => {
    setFilters(prev => ({ ...prev, ...newPartial }));
  };

  const handleSelectMode = (mode: EpistemicMode) => {
    updateFilters({ epistemicMode: mode });
  };

  const handleSelectDatabase = (db: DatabaseType) => {
    updateFilters({ database: db });
  };

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

  const filteredEnslavers = useMemo(() => {
    if (!enslaverSearch.trim()) return ENSLAVERS_REGISTRY;
    const q = enslaverSearch.toLowerCase();
    return ENSLAVERS_REGISTRY.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.principalPorts.some(port => port.toLowerCase().includes(q)) ||
      e.primaryNationality.toLowerCase().includes(q)
    );
  }, [enslaverSearch]);

  const headline = useMemo(() => {
    const mode = filters.epistemicMode;
    const meta = SLAVEVOYAGES_METADATA.headlineTotals[mode];
    const db = filters.database;
    const voyagesCount =
      db === 'intra_american'
        ? SLAVEVOYAGES_METADATA.intraAmericanVoyages
        : db === 'consolidated'
          ? meta.voyages + SLAVEVOYAGES_METADATA.intraAmericanVoyages
          : meta.voyages;

    return {
      voyagesCount,
      voyagesLabel:
        db === 'intra_american'
          ? 'Intra-American Registry'
          : db === 'consolidated'
            ? 'Trans-Atlantic + Intra-American'
            : `${meta.years} Trans-Atlantic Registry`,
      embarked: meta.embarked,
      disembarked: meta.disembarked,
      mortalityRate: meta.mortalityRate,
      livesLost: meta.embarked - meta.disembarked,
      yearsCovered: meta.years
    };
  }, [filters.epistemicMode, filters.database]);

  const isPortsActive = activeSubTab === 'ports';
  const isFlowMapActive = activeSubTab === 'flow-map';
  const isMapActive = isPortsActive || isFlowMapActive;
  const isOverviewActive = activeSubTab === 'overview';

  const handlePrimaryTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let nextIdx = idx;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % PRIMARY_SECTIONS.length;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + PRIMARY_SECTIONS.length) % PRIMARY_SECTIONS.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = PRIMARY_SECTIONS.length - 1;
    else return;
    e.preventDefault();
    const target = PRIMARY_SECTIONS[nextIdx];
    selectPrimarySection(target.id);
    document.getElementById(`slavetrade-section-tab-${target.id}`)?.focus();
  };

  const renderSubSwitcherKeyDown = <T extends string>(
    e: React.KeyboardEvent,
    items: Array<{ id: T }>,
    idx: number,
    onSelect: (id: T) => void,
    prefix: string
  ) => {
    let nextIdx = idx;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % items.length;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + items.length) % items.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = items.length - 1;
    else return;
    e.preventDefault();
    const target = items[nextIdx];
    onSelect(target.id);
    document.getElementById(`${prefix}-${target.id}`)?.focus();
  };

  const renderPrimaryTablist = () => (
    <nav
      role="tablist"
      aria-label="Slave voyages research sections"
      className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 rounded-2xl bg-[#EFE7D5]/80 dark:bg-zinc-900/90 border border-[#DCD3C1] dark:border-zinc-800"
    >
      {PRIMARY_SECTIONS.map((sec, idx) => {
        const Icon = sec.icon;
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            type="button"
            role="tab"
            id={`slavetrade-section-tab-${sec.id}`}
            aria-selected={isActive}
            aria-controls={`slavetrade-section-panel-${sec.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => selectPrimarySection(sec.id)}
            onKeyDown={(e) => handlePrimaryTabKeyDown(e, idx)}
            className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              isActive
                ? 'text-white dark:text-zinc-950 font-bold'
                : 'text-[#57534E] dark:text-zinc-400 hover:text-[#1C1917] dark:hover:text-zinc-100 hover:bg-white/60 dark:hover:bg-zinc-800/70'
            }`}
          >
            {isActive && (
              prefersReducedMotion ? (
                <span className="absolute inset-0 rounded-xl bg-zinc-900 dark:bg-zinc-100 shadow-sm" aria-hidden="true" />
              ) : (
                <motion.div
                  layoutId="slaveVoyagesPrimaryTabPill"
                  className="absolute inset-0 rounded-xl bg-zinc-900 dark:bg-zinc-100 shadow-sm"
                  transition={SPRING_TACTILE}
                />
              )
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{sec.label}</span>
              <span className="sm:hidden">{sec.shortLabel}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );

  const companionLinks = [
    {
      id: 'molecular' as SlaveTradeSubTab,
      title: 'Molecular & Material Legacies',
      meta: '50K+ Genomes · IBD · Strontium-87',
      icon: Dna,
      onClick: () => (onNavigateToMolecular ? onNavigateToMolecular() : selectSubTab('molecular'))
    },
    {
      id: 'foundations' as SlaveTradeSubTab,
      title: 'Foundations of African Development',
      meta: 'Master Report · Ashraf-Galor · Nunn',
      icon: Scale,
      onClick: () => (onNavigateToFoundations ? onNavigateToFoundations() : selectSubTab('foundations'))
    },
    {
      id: 'iconography' as SlaveTradeSubTab,
      title: 'Historical Iconography Archive',
      meta: '1,252 Digital Plates · Brookes 1788 · Castas',
      icon: ImageIcon,
      onClick: () => (onNavigateToIconography ? onNavigateToIconography() : selectSubTab('iconography'))
    },
    {
      id: 'cartography' as SlaveTradeSubTab,
      title: 'Archival Cartography & Currents GIS',
      meta: '1688–1851 Plates · Ocean Currents',
      icon: Compass,
      onClick: () => (onNavigateToCartography ? onNavigateToCartography() : selectSubTab('overview'))
    }
  ];

  const registryTabs: Array<{ id: 'voyages' | 'routes' | 'people' | 'enslavers'; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'voyages', label: 'Voyage Logs', icon: Compass },
    { id: 'routes', label: 'Oceanic Corridors', icon: Layers },
    { id: 'people', label: 'African Origins & Names', icon: Users },
    { id: 'enslavers', label: 'Enslavers & Financiers', icon: Building2 }
  ];

  const analyticsTabs: Array<{ id: 'analytics' | 'query'; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'analytics', label: 'Comparative Charts', icon: BarChart3 },
    { id: 'query', label: 'Query Builder & Citations', icon: SlidersHorizontal }
  ];

  const scholarshipTabs: Array<{ id: 'essays' | 'methodology'; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'essays', label: 'Essays & Case Studies', icon: BookOpen },
    { id: 'methodology', label: 'Methodology & API', icon: SlidersHorizontal }
  ];

  return (
    <section
      aria-label="Atlantic Slave Trade Data Atlas and Historical Demography Observatory"
      className={isMapActive ? 'w-full flex-1 flex flex-col animate-in fade-in duration-200 text-left' : 'space-y-6 animate-in fade-in duration-200 text-left'}
    >
      {/* 1. HEADER: Full Atmospheric Hero on Overview, Compact Sticky Workspace Bar on Other Tabs */}
      {!isMapActive && (
        isOverviewActive ? (
          <header className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#FAF6EE] via-[#F5EFE1] to-[#EFE7D5] dark:from-[#1C1815] dark:via-[#161311] dark:to-[#221B16] border border-[#DCD3C1] dark:border-[#3D342A] text-[#1C1917] dark:text-[#F6F4EE] shadow-sm relative overflow-hidden space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#78716C] dark:text-[#A8A29E]">
                  <Anchor className="w-4 h-4 text-[#C2410C] dark:text-[#FB923C]" />
                  <span className="font-bold text-[#9A3412] dark:text-[#FDBA74]">
                    SlaveVoyages Consortium (api.slavevoyages.org)
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Snapshot {SLAVEVOYAGES_METADATA.version}</span>
                </div>
                <h1 className="type-headline-lg font-serif-display font-bold tracking-tight text-[#1C1917] dark:text-[#FAFAF9]">
                  Atlantic Slave Trade Data Atlas
                </h1>
                <p className="type-body-archival font-serif-book text-[#57534E] dark:text-[#D6D3D1] leading-relaxed max-w-3xl">
                  A curated research repository and geospatial analytics engine documenting four centuries of forced trans-Atlantic and intra-American maritime migrations (1514–1866), grounded in surviving archival records and statistical imputation.
                </p>
              </div>

              {/* Epistemic Certainty Mode Switcher */}
              <div className="shrink-0 space-y-2 bg-white/80 dark:bg-zinc-900/90 p-4 rounded-2xl border border-[#DCD3C1] dark:border-zinc-800 backdrop-blur-xs shadow-xs">
                <p className="text-[11px] font-mono uppercase font-bold text-[#78716C] dark:text-zinc-400">
                  Epistemic Certainty Mode
                </p>
                <EpistemicStatusBadge
                  currentMode={filters.epistemicMode}
                  onSelectMode={handleSelectMode}
                />
              </div>
            </div>

            {/* Headline Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-white/85 dark:bg-zinc-900/80 border border-[#DCD3C1] dark:border-zinc-800 space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-[#78716C] dark:text-zinc-400 text-xs">
                  <span className="font-mono uppercase text-[10px] font-bold">Documented Voyages</span>
                  <Compass className="w-4 h-4 text-[#C2410C] dark:text-emerald-400" />
                </div>
                <p className="text-xl sm:text-2xl font-black font-mono tabular-nums text-[#1C1917] dark:text-zinc-100">
                  {headline.voyagesCount.toLocaleString()}
                </p>
                <span className="text-[10px] text-[#78716C] dark:text-zinc-400 block font-mono">
                  {headline.voyagesLabel}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/85 dark:bg-zinc-900/80 border border-[#DCD3C1] dark:border-zinc-800 space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-[#78716C] dark:text-zinc-400 text-xs">
                  <span className="font-mono uppercase text-[10px] font-bold">Captives Embarked</span>
                  <Users className="w-4 h-4 text-[#D97706] dark:text-amber-400" />
                </div>
                <p className="text-xl sm:text-2xl font-black font-mono tabular-nums text-[#B45309] dark:text-amber-400">
                  {(headline.embarked / 1000000).toFixed(2)}M
                </p>
                <span className="text-[10px] text-[#78716C] dark:text-zinc-400 block font-mono">
                  {filters.epistemicMode === 'observed' ? 'Observed in logs' : 'Observed + Imputed'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/85 dark:bg-zinc-900/80 border border-[#DCD3C1] dark:border-zinc-800 space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-[#78716C] dark:text-zinc-400 text-xs">
                  <span className="font-mono uppercase text-[10px] font-bold">Captives Disembarked</span>
                  <Building2 className="w-4 h-4 text-[#059669] dark:text-emerald-400" />
                </div>
                <p className="text-xl sm:text-2xl font-black font-mono tabular-nums text-[#047857] dark:text-emerald-400">
                  {(headline.disembarked / 1000000).toFixed(2)}M
                </p>
                <span className="text-[10px] text-[#78716C] dark:text-zinc-400 block font-mono">
                  Arrived in Americas
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/85 dark:bg-zinc-900/80 border border-[#DCD3C1] dark:border-zinc-800 space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-[#78716C] dark:text-zinc-400 text-xs">
                  <span className="font-mono uppercase text-[10px] font-bold">Shipboard Mortality</span>
                  <Skull className="w-4 h-4 text-[#DC2626] dark:text-rose-400" />
                </div>
                <p className="text-xl sm:text-2xl font-black font-mono tabular-nums text-[#B91C1C] dark:text-rose-400">
                  {headline.mortalityRate}%
                </p>
                <span className="text-[10px] text-[#991B1B] dark:text-rose-300/80 block font-mono">
                  {(headline.livesLost / 1000000).toFixed(2)}M lost at sea
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/85 dark:bg-zinc-900/80 border border-[#DCD3C1] dark:border-zinc-800 space-y-1 col-span-2 sm:col-span-1 shadow-xs">
                <div className="flex items-center justify-between text-[#78716C] dark:text-zinc-400 text-xs">
                  <span className="font-mono uppercase text-[10px] font-bold">Temporal Scope</span>
                  <Calendar className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
                </div>
                <p className="text-xl sm:text-2xl font-black font-mono tabular-nums text-[#1C1917] dark:text-zinc-100">
                  352 Years
                </p>
                <span className="text-[10px] text-[#78716C] dark:text-zinc-400 block font-mono">
                  {headline.yearsCovered}
                </span>
              </div>
            </div>

            {/* Unified Navigation + Export Row */}
            <div className="pt-3 border-t border-[#DCD3C1] dark:border-zinc-800/80 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
              {renderPrimaryTablist()}
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 hover:bg-[#FAF6EE] dark:hover:bg-zinc-800 text-[#1C1917] dark:text-zinc-200 border border-[#DCD3C1] dark:border-zinc-700 text-xs font-semibold cursor-pointer transition-colors shadow-xs shrink-0 self-start xl:self-auto"
              >
                <Download className="w-3.5 h-3.5 text-[#C2410C] dark:text-emerald-400" />
                <span>Export &amp; Cite</span>
              </button>
            </div>
          </header>
        ) : (
          <header className="relative md:sticky md:top-16 z-20 p-3 sm:p-4 rounded-2xl bg-[#FAF6EE]/95 dark:bg-zinc-950/95 backdrop-blur-md border border-[#DCD3C1] dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Anchor className="w-4 h-4 text-[#C2410C] dark:text-[#FB923C] shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-base font-serif-display font-bold text-[#1C1917] dark:text-zinc-100 truncate">
                    Atlantic Slave Trade Data Atlas
                  </h1>
                  <p className="text-[11px] font-mono text-[#78716C] dark:text-zinc-400 truncate">
                    {headline.voyagesCount.toLocaleString()} voyages · {(headline.embarked / 1000000).toFixed(2)}M embarked · {headline.mortalityRate}% mortality
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <EpistemicStatusBadge
                  currentMode={filters.epistemicMode}
                  onSelectMode={handleSelectMode}
                />
                <button
                  type="button"
                  onClick={() => setIsExportOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[#1C1917] dark:text-zinc-200 border border-[#DCD3C1] dark:border-zinc-700 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#C2410C] dark:text-emerald-400" />
                  <span className="hidden sm:inline">Export &amp; Cite</span>
                </button>
              </div>
            </div>

            {renderPrimaryTablist()}
          </header>
        )
      )}

      {/* SECTION 01: OVERVIEW */}
      {activeSection === 'overview' && (
        <div
          role="tabpanel"
          id="slavetrade-section-panel-overview"
          aria-labelledby="slavetrade-section-tab-overview"
          className="space-y-8"
        >
          {/* Standalone GIS Map Launchpad */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#FAF5EE] via-[#F3EADB] to-[#E9DEC9] dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 border border-[#D5C6AC] dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-amber-900 dark:text-amber-300">
                  <Compass className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span className="font-bold uppercase tracking-wider">Interactive Geodesic Flow Engine</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#78716C] dark:text-zinc-400">Dedicated Full-Bleed Workspace</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1C1917] dark:text-zinc-100 tracking-tight">
                  Atlantic Geodesic Network: 36,108 Transatlantic Voyage Trajectories
                </h2>
                <p className="text-xs sm:text-sm text-[#57534E] dark:text-zinc-300 leading-relaxed">
                  Inspect embarkation corridors, landing ports, and shipboard mortality across 352 years of maritime logbooks in a full-screen cartographic workstation with timeline scrubbing and 47 mapped African forts.
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-[#78716C] dark:text-zinc-400 font-mono">
                  <span>36,108 Voyages</span>
                  <span aria-hidden="true">·</span>
                  <span>8 African Embarkation Coasts</span>
                  <span aria-hidden="true">·</span>
                  <span>47 Mapped Forts &amp; Enclaves</span>
                  <span aria-hidden="true">·</span>
                  <span>Observed vs Imputed Data</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => selectSubTab('flow-map')}
                  className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Launch Atlantic Flow Map</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => selectSubTab('ports')}
                  className="px-5 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Castle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Inspect Forts &amp; Enclaves GIS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Coastal African Embarkation Demographics (1501–1866) Matrix */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                  African Embarkation Coasts: Cumulative Demographic Volume (1501–1866)
                </h2>
                <p className="text-xs text-zinc-500">
                  Estimated distribution of 12,521,336 embarked captives across 8 macro-coastal zones documented by the SlaveVoyages database
                </p>
              </div>
              <EpistemicStatusBadge currentMode={filters.epistemicMode} interactive={false} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {EMBARKATION_MATRIX.map((region) => {
                const relativePct = Math.round((region.embarked / MAX_EMBARKATION_VOLUME) * 100);
                return (
                  <div
                    key={region.name}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{region.name}</span>
                      <span className="font-mono tabular-nums text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        {region.pct}%
                      </span>
                    </div>
                    <div
                      className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden"
                      role="progressbar"
                      aria-label={`${region.name} embarkation share`}
                      aria-valuenow={region.pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        style={{ width: `${relativePct}%` }}
                      />
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-sm font-black font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
                        {(region.embarked / 1000000).toFixed(2)}M
                      </span>
                      <span className="text-[10px] font-mono tabular-nums text-rose-600 dark:text-rose-400">
                        avg {region.mortality} mort.
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      Destination: <span className="font-medium text-zinc-700 dark:text-zinc-300">{region.dest}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Temporal Volume Chart over Centuries */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                  Century-by-Century Captives Transported (1501–1866)
                </h2>
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
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEstimates" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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

          {/* Consolidated Companion Modules & Monograph Band */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                  Companion Archives &amp; Research Monographs
                </h2>
                <p className="text-xs text-zinc-500">
                  Direct gateways to specialized paleogenomics, economic history, iconography, and antique GIS modules
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {companionLinks.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onClick}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 text-left space-y-2 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                        {item.meta}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Historical Milestones */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Major Historical Milestones &amp; Legislation (1518–1866)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TIMELINE_MILESTONES.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="font-black text-emerald-700 dark:text-emerald-400">{m.year}</span>
                    <span aria-hidden="true" className="text-zinc-400">·</span>
                    <span className="uppercase text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold">
                      {m.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {m.title}
                  </h3>
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
        </div>
      )}

      {/* SECTION 02: GIS MAPS (FULL-BLEED WITH 1-CLICK SWITCHER) */}
      {activeSection === 'maps' && (
        <div
          role="tabpanel"
          id="slavetrade-section-panel-maps"
          aria-labelledby="slavetrade-section-tab-maps"
          className={isPortsActive ? 'w-full flex-1 h-[calc(100vh-68px)] max-h-[calc(100vh-68px)] min-h-[600px] flex flex-col overflow-hidden' : 'w-full flex-1 min-h-[calc(100vh-80px)] flex flex-col'}
        >
          {isFlowMapActive && (
            <div className="w-full flex-1">
              <Suspense
                fallback={
                  <div className="w-full h-[640px] flex items-center justify-center bg-zinc-900/40 rounded-2xl border border-zinc-800">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-mono text-zinc-400">Loading Atlantic Geodesic Flow Map...</p>
                    </div>
                  </div>
                }
              >
                <AtlanticFlowMap
                  epistemicMode={filters.epistemicMode}
                  selectedRouteId={selectedRoute?.id}
                  onSelectRoute={(r) => setSelectedRoute(r)}
                  onNavigateToCartography={onNavigateToCartography}
                  isSeasonalityOpen={isSeasonalityOpen}
                  onToggleSeasonality={() => setIsSeasonalityOpen(prev => !prev)}
                  onBackToOverview={() => selectSubTab('overview')}
                  onSwitchToPorts={() => selectSubTab('ports')}
                />
              </Suspense>
            </div>
          )}

          {isPortsActive && (
            <Suspense
              fallback={
                <div className="w-full h-[640px] flex items-center justify-center bg-zinc-900/40 rounded-2xl border border-zinc-800">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-mono text-zinc-400">Loading African Ports &amp; Forts GIS...</p>
                  </div>
                </div>
              }
            >
              <AfricanPortsMap
                onClose={() => selectSubTab('overview')}
                onSwitchToFlowMap={() => selectSubTab('flow-map')}
              />
            </Suspense>
          )}
        </div>
      )}

      {/* SECTION 03: REGISTRIES (VOYAGES, CORRIDORS, AFRICAN ORIGINS, ENSLAVERS) */}
      {activeSection === 'registries' && (
        <div
          role="tabpanel"
          id="slavetrade-section-panel-registries"
          aria-labelledby="slavetrade-section-tab-registries"
          className="space-y-6"
        >
          {/* Sub-View Segmented Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Archive registry datasets"
              className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              {registryTabs.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`slavetrade-reg-tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`slavetrade-reg-panel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectSubTab(tab.id)}
                    onKeyDown={(e) => renderSubSwitcherKeyDown(e, registryTabs, idx, selectSubTab, 'slavetrade-reg-tab')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      isActive
                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              Epistemic view: {filters.epistemicMode === 'observed' ? 'Observed logbook entries' : 'Observed + Imputed values'}
            </span>
          </div>

          {/* SUB-TAB: VOYAGES */}
          {activeSubTab === 'voyages' && (
            <div
              role="tabpanel"
              id="slavetrade-reg-panel-voyages"
              aria-labelledby="slavetrade-reg-tab-voyages"
              className="space-y-6"
            >
              {/* Multi-Parameter Filters Toolbar */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                      Voyage Filter &amp; Search Engine
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowMobileVoyageFilters(prev => !prev)}
                      className="md:hidden inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    >
                      <span>{showMobileVoyageFilters ? 'Hide Filters' : 'Filters'}</span>
                      {showMobileVoyageFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilters(DEFAULT_FILTERS)}
                      className="text-xs text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-mono font-bold transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>

                {/* Unified Database Selectors */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#F5EFE6] dark:bg-zinc-950 border border-[#DCD3C1] dark:border-zinc-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-[#78716C] dark:text-zinc-400 font-bold uppercase">Database:</span>
                    <div className="inline-flex flex-wrap p-1 rounded-xl bg-[#E8DFCE] dark:bg-zinc-900 border border-[#DCD3C1] dark:border-zinc-800 text-xs font-medium">
                      {[
                        { id: 'consolidated', label: 'Consolidated' },
                        { id: 'transatlantic', label: 'Trans-Atlantic (36,108)' },
                        { id: 'intra_american', label: 'Intra-American (11,432)' }
                      ].map(db => {
                        const isActive = filters.database === db.id;
                        return (
                          <button
                            key={db.id}
                            type="button"
                            onClick={() => handleSelectDatabase(db.id as DatabaseType)}
                            className={`relative px-3 py-1.5 rounded-lg transition-colors cursor-pointer select-none ${
                              isActive
                                ? 'text-white font-bold'
                                : 'text-[#57534E] hover:text-[#1C1917] dark:text-zinc-400 dark:hover:text-zinc-200'
                            }`}
                          >
                            {isActive && (
                              prefersReducedMotion ? (
                                <span className="absolute inset-0 rounded-lg bg-[#C2410C] shadow-xs" aria-hidden="true" />
                              ) : (
                                <motion.div
                                  layoutId="slaveVoyagesDbPill"
                                  className="absolute inset-0 rounded-lg bg-[#C2410C] shadow-xs"
                                  transition={SPRING_TACTILE}
                                />
                              )
                            )}
                            <span className="relative z-10">{db.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-xs font-mono tabular-nums text-[#78716C] dark:text-zinc-400">
                    Matches: <strong className="text-[#C2410C] dark:text-emerald-400">{filterResult.totalMatches.toLocaleString()}</strong> curated voyages
                  </div>
                </div>

                {/* Filter Grid (Collapsible on Mobile, Always Open on Desktop) */}
                <div className={`${showMobileVoyageFilters ? 'block' : 'hidden md:block'} space-y-4`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="sv-vessel-search" className="text-xs font-mono text-zinc-500 uppercase font-bold">
                        Vessel / Captain / Port
                      </label>
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                        <input
                          id="sv-vessel-search"
                          type="text"
                          placeholder="Search Brooks, Amistad, Luanda..."
                          value={filters.vesselSearch}
                          onChange={(e) => updateFilters({ vesselSearch: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="sv-embark-region" className="text-xs font-mono text-zinc-500 uppercase font-bold">
                        African Embarkation
                      </label>
                      <AtlasSelect
                        id="sv-embark-region"
                        aria-label="Filter voyages by African embarkation coast"
                        value={filters.embarkationRegions[0] || ''}
                        onChange={(e) => updateFilters({ embarkationRegions: e.target.value ? [e.target.value as AfricanEmbarkationRegion] : [] })}
                        accent="emerald"
                        size="sm"
                        className="w-full font-medium"
                      >
                        <option value="">All African Coasts</option>
                        <option value="West Central Africa">West Central Africa</option>
                        <option value="Bight of Benin">Bight of Benin</option>
                        <option value="Bight of Biafra">Bight of Biafra</option>
                        <option value="Gold Coast">Gold Coast</option>
                        <option value="Senegambia">Senegambia</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Southeast Africa & Indian Ocean">Southeast Africa &amp; Indian Ocean</option>
                      </AtlasSelect>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="sv-disembark-region" className="text-xs font-mono text-zinc-500 uppercase font-bold">
                        American Landing Zone
                      </label>
                      <AtlasSelect
                        id="sv-disembark-region"
                        aria-label="Filter voyages by American landing zone"
                        value={filters.disembarkationRegions[0] || ''}
                        onChange={(e) => updateFilters({ disembarkationRegions: e.target.value ? [e.target.value as AmericanDisembarkationRegion] : [] })}
                        accent="emerald"
                        size="sm"
                        className="w-full font-medium"
                      >
                        <option value="">All American Landing Zones</option>
                        <option value="Brazil">Brazil</option>
                        <option value="British Caribbean">British Caribbean</option>
                        <option value="French Caribbean">French Caribbean</option>
                        <option value="Spanish Americas">Spanish Americas</option>
                        <option value="Mainland North America (USA)">Mainland North America (USA)</option>
                        <option value="Dutch Caribbean & Guianas">Dutch Caribbean &amp; Guianas</option>
                        <option value="Danish West Indies">Danish West Indies</option>
                      </AtlasSelect>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="sv-carrier" className="text-xs font-mono text-zinc-500 uppercase font-bold">
                        Carrier Nationality
                      </label>
                      <AtlasSelect
                        id="sv-carrier"
                        aria-label="Filter voyages by carrier nationality"
                        value={filters.carriers[0] || ''}
                        onChange={(e) => updateFilters({ carriers: e.target.value ? [e.target.value as CarrierNationality] : [] })}
                        accent="emerald"
                        size="sm"
                        className="w-full font-medium"
                      >
                        <option value="">All Imperial Carriers</option>
                        <option value="Portugal / Brazil">Portugal / Brazil</option>
                        <option value="Great Britain">Great Britain</option>
                        <option value="France">France</option>
                        <option value="Spain / Uruguay">Spain / Uruguay</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="United States">United States</option>
                        <option value="Denmark / Baltic">Denmark / Baltic</option>
                      </AtlasSelect>
                    </div>
                  </div>

                  {/* Interactive Toggles, Year Range & Min Mortality */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
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

                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                      <label className="flex items-center gap-1.5">
                        <span>From</span>
                        <input
                          type="number"
                          min={1514}
                          max={filters.yearRange[1]}
                          value={filters.yearRange[0]}
                          onChange={(e) => {
                            const val = Math.max(1514, Math.min(filters.yearRange[1], Number(e.target.value) || 1514));
                            updateFilters({ yearRange: [val, filters.yearRange[1]] });
                          }}
                          aria-label="Start departure year"
                          className="w-20 px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 tabular-nums"
                        />
                      </label>
                      <label className="flex items-center gap-1.5">
                        <span>To</span>
                        <input
                          type="number"
                          min={filters.yearRange[0]}
                          max={1866}
                          value={filters.yearRange[1]}
                          onChange={(e) => {
                            const val = Math.min(1866, Math.max(filters.yearRange[0], Number(e.target.value) || 1866));
                            updateFilters({ yearRange: [filters.yearRange[0], val] });
                          }}
                          aria-label="End departure year"
                          className="w-20 px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 tabular-nums"
                        />
                      </label>
                      <label className="flex items-center gap-1.5">
                        <span>Min Mort. %</span>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={filters.minMortalityRate}
                          onChange={(e) => updateFilters({ minMortalityRate: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                          aria-label="Minimum mortality percentage"
                          className="w-16 px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 tabular-nums"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voyages Data List (Cards on Mobile, Table on Desktop) */}
              <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 bg-zinc-50/50 dark:bg-zinc-950/50">
                  <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                    Matching Voyages ({filterResult.totalMatches} records)
                  </span>
                  <span className="text-xs text-zinc-500">
                    Select any voyage to inspect the full academic dossier
                  </span>
                </div>

                {/* Mobile Stacked Cards */}
                <div className="md:hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filterResult.voyages.map((v) => {
                    const embarkedVal = filters.epistemicMode === 'observed'
                      ? (v.enslaved.embarkedObserved != null ? v.enslaved.embarkedObserved.toLocaleString() : 'Unrecorded')
                      : v.enslaved.embarkedImputed.toLocaleString();
                    const mortalityVal = filters.epistemicMode === 'observed'
                      ? (v.enslaved.mortalityObserved != null ? `${v.enslaved.mortalityObserved}%` : '—')
                      : `${v.enslaved.mortalityRateImputed}%`;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVoyage(v)}
                        className="w-full p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors space-y-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{v.vessel.name}</span>
                          <span className="font-mono font-bold text-xs text-zinc-700 dark:text-zinc-300 tabular-nums">
                            {v.dates.departureYear} · {v.carrier.nationality}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400">
                          {v.itinerary.principalPlaceOfSlavePurchase.name} → {v.itinerary.principalPlaceOfSlaveLanding.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono tabular-nums text-zinc-500">
                          <span>Embarked: <strong className="text-zinc-900 dark:text-zinc-100">{embarkedVal}</strong></span>
                          <span aria-hidden="true">·</span>
                          <span>Mortality: <strong className={v.enslaved.mortalityRateImputed > 15 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>{mortalityVal}</strong></span>
                          {v.resistance.hasRebellion && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-rose-600 dark:text-rose-400 font-bold">Revolt documented</span>
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-100/70 dark:bg-zinc-950 font-mono uppercase text-[10px] text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                      <tr>
                        <th className="py-3 px-4">Year</th>
                        <th className="py-3 px-4">Vessel &amp; Rig</th>
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
                      {filterResult.voyages.map((v) => {
                        const isObserved = filters.epistemicMode === 'observed';
                        const embarkedStr = isObserved
                          ? (v.enslaved.embarkedObserved != null ? v.enslaved.embarkedObserved.toLocaleString() : '—')
                          : v.enslaved.embarkedImputed.toLocaleString();
                        const disembarkedStr = isObserved
                          ? (v.enslaved.disembarkedObserved != null ? v.enslaved.disembarkedObserved.toLocaleString() : '—')
                          : v.enslaved.disembarkedImputed.toLocaleString();
                        const mortalityNum = isObserved ? v.enslaved.mortalityObserved : v.enslaved.mortalityRateImputed;
                        return (
                          <tr
                            key={v.id}
                            tabIndex={0}
                            onClick={() => setSelectedVoyage(v)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedVoyage(v);
                              }
                            }}
                            className="hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 cursor-pointer transition-colors group focus-visible:outline-none focus-visible:bg-amber-500/10"
                          >
                            <td className="py-3 px-4 font-mono font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                              {v.dates.departureYear}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {v.vessel.name}
                              </div>
                              <div className="text-[10px] text-zinc-500">
                                {v.vessel.rig || 'Sailing Ship'} · {v.vessel.tonnage ? `${v.vessel.tonnage} tons` : 'Imputed tonnage'}
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
                            <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                              {embarkedStr}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                              {disembarkedStr}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                              {mortalityNum != null ? (
                                <span className={mortalityNum > 15 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                                  {mortalityNum}%
                                </span>
                              ) : (
                                <span className="text-zinc-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {v.resistance.hasRebellion ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300">
                                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                  <span>Revolt</span>
                                </span>
                              ) : (
                                <span className="text-zinc-400 font-mono text-[11px]">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB: GEOGRAPHIC ROUTES & NETWORKS */}
          {activeSubTab === 'routes' && (
            <div
              role="tabpanel"
              id="slavetrade-reg-panel-routes"
              aria-labelledby="slavetrade-reg-tab-routes"
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                  Primary Atlantic Oceanic Corridors &amp; Transport Volumes
                </h2>
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
                        <span className="text-xs font-mono tabular-nums text-zinc-500">
                          {route.voyagesCount.toLocaleString()} voyages
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-base font-black text-zinc-900 dark:text-zinc-100">
                        <span>{route.sourceRegion}</span>
                        <span className="text-emerald-500" aria-hidden="true">→</span>
                        <span>{route.targetRegion}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <p className="text-[10px] text-zinc-400 uppercase font-mono">Captives Embarked</p>
                          <p className="text-base font-black font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
                            {route.embarkedCount.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <p className="text-[10px] text-zinc-400 uppercase font-mono">Middle Passage Mortality</p>
                          <p className={`text-base font-black font-mono tabular-nums ${route.avgMortalityRate > 15 ? 'text-rose-500' : 'text-amber-500'}`}>
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

          {/* SUB-TAB: AFRICAN ORIGINS & NAMES */}
          {activeSubTab === 'people' && (
            <div
              role="tabpanel"
              id="slavetrade-reg-panel-people"
              aria-labelledby="slavetrade-reg-tab-people"
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div>
                    <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                      African Origins / Liberated Africans Names Database
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Recovered personal biographies recorded at Vice-Admiralty and Mixed Commission courts (Freetown, Havana, Rio de Janeiro).
                    </p>
                  </div>

                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                    <input
                      type="text"
                      aria-label="Search liberated Africans database"
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
                      <div className="flex items-center justify-between gap-2">
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
                        <span className="text-xs font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                          {person.arrivalYear}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-[10px] font-mono text-zinc-400 uppercase">Linguistic Group</p>
                          <p className="font-bold text-zinc-800 dark:text-zinc-200">{person.linguisticGroup} ({person.languageFamily})</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-mono text-zinc-400 uppercase">Age / Stature</p>
                          <p className="font-bold text-zinc-800 dark:text-zinc-200">{person.age} yrs · {person.statureInches} in ({person.statureCm} cm)</p>
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

          {/* SUB-TAB: ENSLAVERS & NETWORKS */}
          {activeSubTab === 'enslavers' && (
            <div
              role="tabpanel"
              id="slavetrade-reg-panel-enslavers"
              aria-labelledby="slavetrade-reg-tab-enslavers"
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div>
                    <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                      Enslavers, Voyage Financiers &amp; Captains Registry
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Documenting merchants, syndicates, and investors who financed and commanded slave trading vessels.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                    <input
                      type="text"
                      aria-label="Search enslavers registry"
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
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                          {ens.name}
                        </h3>
                        <span className="text-xs font-mono font-bold tabular-nums text-zinc-500">
                          {ens.activeYears[0]}–{ens.activeYears[1]}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">{ens.primaryNationality}</span>
                        <span aria-hidden="true">·</span>
                        <span>{ens.roles.join(' · ')}</span>
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
        </div>
      )}

      {/* SECTION 04: ANALYTICS & QUERY BUILDER */}
      {activeSection === 'analytics-query' && (
        <div
          role="tabpanel"
          id="slavetrade-section-panel-analytics-query"
          aria-labelledby="slavetrade-section-tab-analytics-query"
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Analytics and query modes"
              className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              {analyticsTabs.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`slavetrade-aq-tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`slavetrade-aq-panel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectSubTab(tab.id)}
                    onKeyDown={(e) => renderSubSwitcherKeyDown(e, analyticsTabs, idx, selectSubTab, 'slavetrade-aq-tab')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      isActive
                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {activeSubTab === 'analytics' && (
            <div
              role="tabpanel"
              id="slavetrade-aq-panel-analytics"
              aria-labelledby="slavetrade-aq-tab-analytics"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                  <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                    Captives Embarked by National Carrier (1501–1866)
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Portugal &amp; Brazil carried over 46% of all transatlantic captives, followed by Great Britain (26%).
                  </p>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CARRIER_BREAKDOWN} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis type="number" tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`} />
                        <YAxis dataKey="carrier" type="category" width={110} fontSize={11} />
                        <Tooltip formatter={(val: any) => [val.toLocaleString(), 'Captives']} />
                        <Bar
                          dataKey={filters.epistemicMode === 'observed' ? 'embarkedObserved' : 'embarkedImputed'}
                          fill="#10b981"
                          radius={[0, 8, 8, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                  <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                    Embarkation Distribution by African Coast
                  </h2>
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
                        <Bar
                          dataKey={filters.epistemicMode === 'observed' ? 'embarkedObserved' : 'embarkedImputed'}
                          fill="#6366f1"
                          radius={[0, 8, 8, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'query' && (
            <div
              role="tabpanel"
              id="slavetrade-aq-panel-query"
              aria-labelledby="slavetrade-aq-tab-query"
            >
              <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-zinc-400">Loading Academic Query Builder...</div>}>
                <QueryBuilderPanel
                  filters={filters}
                  onUpdateFilters={updateFilters}
                  filteredVoyages={filterResult.voyages}
                  aggregateStats={filterResult.aggregateStats}
                />
              </Suspense>
            </div>
          )}
        </div>
      )}

      {/* SECTION 05: SCHOLARSHIP, METHODOLOGY & COMPANION ARCHIVES */}
      {activeSection === 'scholarship' && (
        <div
          role="tabpanel"
          id="slavetrade-section-panel-scholarship"
          aria-labelledby="slavetrade-section-tab-scholarship"
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Scholarship and methodology views"
              className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              {scholarshipTabs.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`slavetrade-sch-tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`slavetrade-sch-panel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectSubTab(tab.id)}
                    onKeyDown={(e) => renderSubSwitcherKeyDown(e, scholarshipTabs, idx, selectSubTab, 'slavetrade-sch-tab')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      isActive
                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Companion Module Quick Links */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {companionLinks.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-amber-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold transition-colors cursor-pointer"
                >
                  <span>{item.title}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {activeSubTab === 'essays' && (
            <div
              role="tabpanel"
              id="slavetrade-sch-panel-essays"
              aria-labelledby="slavetrade-sch-tab-essays"
            >
              <Suspense
                fallback={
                  <div className="p-12 text-center text-xs font-mono text-zinc-400">
                    Loading Scholarly Essays &amp; Visual Storytelling...
                  </div>
                }
              >
                <div className="space-y-12">
                  <StorytellingGallery
                    onSelectVoyage={(voyage) => setSelectedVoyage(voyage)}
                    onSelectEssay={(essayId) => {
                      setActiveEssayId(essayId);
                      const element = document.getElementById('academic-essay-reader');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  />
                  <div id="academic-essay-reader" className="pt-4">
                    <SlaveVoyagesEssaysViewer
                      activeEssayId={activeEssayId}
                      onSelectEssay={(id) => setActiveEssayId(id)}
                    />
                  </div>
                </div>
              </Suspense>
            </div>
          )}

          {activeSubTab === 'methodology' && (
            <div
              role="tabpanel"
              id="slavetrade-sch-panel-methodology"
              aria-labelledby="slavetrade-sch-tab-methodology"
              className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <BookOpen className="w-6 h-6 text-emerald-500" />
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                    Methodological Architecture &amp; SlaveVoyages API Standard
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Epistemic grounding, canonical data model, and live sync protocol
                  </p>
                </div>
              </div>

              <div className="prose prose-zinc dark:prose-invert max-w-none text-xs leading-relaxed space-y-4">
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                  1. The Seven Imputed Variables (Eltis &amp; Richardson Standard)
                </h3>
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

                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 pt-3">
                  2. Open API Architecture (api.slavevoyages.org)
                </h3>
                <p>
                  This atlas integrates the canonical data model matching the current Swagger specification for SlaveVoyages, including the <code>/voyages</code>, <code>/enslaved</code>, <code>/enslavers</code>, <code>/estimates</code>, and <code>/routes</code> endpoints.
                </p>
              </div>
            </div>
          )}

          {/* Inline Fallbacks when Standalone Route Callbacks Are Not Provided */}
          {activeSubTab === 'molecular' && (
            <div role="tabpanel" id="slavetrade-sch-panel-molecular">
              <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-zinc-400">Loading Paleogenomics Synthesis...</div>}>
                <MolecularLegaciesView />
              </Suspense>
            </div>
          )}

          {activeSubTab === 'foundations' && (
            <div role="tabpanel" id="slavetrade-sch-panel-foundations">
              <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-zinc-400">Loading Foundations of African Development Monograph...</div>}>
                <AfricanDevelopmentMasterReportView />
              </Suspense>
            </div>
          )}

          {activeSubTab === 'iconography' && (
            <div role="tabpanel" id="slavetrade-sch-panel-iconography">
              <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-zinc-400">Loading Historical Iconography Archive...</div>}>
                <SlaveTradeIconography />
              </Suspense>
            </div>
          )}
        </div>
      )}

      {/* Voyage Dossier Modal */}
      {selectedVoyage && (
        <Suspense fallback={null}>
          <VoyageDossierModal
            voyage={selectedVoyage}
            onClose={() => setSelectedVoyage(null)}
          />
        </Suspense>
      )}

      {/* Academic Citation & Vector Export Modal */}
      {isExportOpen && (
        <Suspense fallback={null}>
          <AcademicExportModal
            isOpen={isExportOpen}
            onClose={() => setIsExportOpen(false)}
            title="Atlantic Slave Trade Data Atlas & Maritime Flow Corridors"
            sourceContext="SlaveVoyages Consortium (api.slavevoyages.org), TAST Database v2026.1"
            citationMetadata={{
              authors: ['SlaveVoyages Consortium', 'Afriata Historical Analytics Group', 'Eltis et al.'],
              year: 2026,
              datasetName: 'Trans-Atlantic and Intra-American Slave Trade Databases',
              url: window?.location?.href || 'https://afriata.org/#slave-trade',
              doi: '10.6084/m9.figshare.34065711',
              version: SLAVEVOYAGES_METADATA.version
            }}
            svgContainerId="atlantic-flow-map-svg"
          />
        </Suspense>
      )}
    </section>
  );
};

export default SlaveTradeView;
