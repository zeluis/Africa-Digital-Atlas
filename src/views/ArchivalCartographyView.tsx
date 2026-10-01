import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HISTORICAL_MAP_PLATES, 
  PRE_COLONIAL_ENTITIES, 
  OCEAN_CURRENTS, 
  SEASONAL_WIND_REGIMES, 
  HistoricalMapPlate, 
  PreColonialEntity, 
  OceanCurrentDef, 
  SeasonalWindRegime 
} from '../data/archivalCartographyData';
import { HistoricalMapCurtainViewer } from '../components/cartography/HistoricalMapCurtainViewer';
import { OceanCurrentParticleCanvas } from '../components/cartography/OceanCurrentParticleCanvas';
import { AntiquePlateCanvas } from '../components/cartography/AntiquePlateCanvas';
import { KingdomDynasticTreeModal } from '../components/cartography/KingdomDynasticTreeModal';
import { KingdomArtifact3DViewerModal } from '../components/cartography/KingdomArtifact3DViewerModal';
import { ToponymConcordanceModal } from '../components/cartography/ToponymConcordanceModal';
import { DETAILED_KINGDOMS_DATA, KingdomDetailedRecord, ToponymConcordanceItem } from '../data/preColonialKingdomsDetailed';
import { SEASONAL_HYDRO_METRICS } from '../services/oceanHydrodynamicsService';
import { Footer } from '../components/Footer';
import { CanonicalNavTab } from '../components/NavigationDrawer';
import { 
  Map as MapIcon, 
  Wind, 
  Waves, 
  Compass, 
  Layers, 
  Sparkles, 
  BookOpen, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  Copy, 
  Check, 
  Info, 
  Clock, 
  ArrowRight, 
  SlidersHorizontal, 
  Anchor, 
  Globe2,
  Crown,
  Play,
  Pause,
  Activity,
  Sun,
  Moon,
  Gauge,
  X,
  Thermometer,
  Skull
} from 'lucide-react';

type CartographyWorkbenchTab = 'curtain' | 'streamlines' | 'kingdoms';

interface ArchivalCartographyViewProps {
  initialPlateId?: string;
  onNavigateTab?: (tab: CanonicalNavTab) => void;
  onSelectCountry?: (countryCode: string) => void;
  onOpenColophon?: () => void;
  onOpenCitationModal?: () => void;
  onOpenWorkingPapers?: () => void;
  onOpenMethodologyAudit?: () => void;
}

export const ArchivalCartographyView: React.FC<ArchivalCartographyViewProps> = ({ 
  initialPlateId,
  onNavigateTab,
  onSelectCountry,
  onOpenColophon,
  onOpenCitationModal,
  onOpenWorkingPapers,
  onOpenMethodologyAudit
}) => {
  const initialData = React.useMemo(() => {
    if (typeof window === 'undefined') return { plate: HISTORICAL_MAP_PLATES[0], tab: 'curtain' as CartographyWorkbenchTab };
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    const params = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
    const pId = params.get('plate') || initialPlateId;
    const foundPlate = pId ? HISTORICAL_MAP_PLATES.find(p => p.id === pId) : undefined;
    const tabParam = params.get('tab');
    const validTab: CartographyWorkbenchTab = (tabParam === 'streamlines' || tabParam === 'kingdoms' || tabParam === 'curtain') ? (tabParam as CartographyWorkbenchTab) : 'curtain';
    return {
      plate: foundPlate || HISTORICAL_MAP_PLATES[0],
      tab: validTab
    };
  }, [initialPlateId]);

  const [activeTab, setActiveTab] = useState<CartographyWorkbenchTab>(initialData.tab);
  const [selectedPlate, setSelectedPlate] = useState<HistoricalMapPlate>(initialData.plate);
  const [focusedEntity, setFocusedEntity] = useState<PreColonialEntity | null>(null);
  const [selectedDynastyKingdom, setSelectedDynastyKingdom] = useState<KingdomDetailedRecord | null>(null);
  const [selectedArtifactKingdom, setSelectedArtifactKingdom] = useState<KingdomDetailedRecord | null>(null);
  const [isToponymConcordanceOpen, setIsToponymConcordanceOpen] = useState<boolean>(false);
  const [activeSeasonId, setActiveSeasonId] = useState<'q1' | 'q2' | 'q3' | 'q4'>('q1');
  const [showCurrents, setShowCurrents] = useState<boolean>(true);
  const [showWinds, setShowWinds] = useState<boolean>(true);
  const [isStreamlinesPlaying, setIsStreamlinesPlaying] = useState<boolean>(true);
  const [streamlineDrawer, setStreamlineDrawer] = useState<'none' | 'diagnostics' | 'corridors' | 'commentary' | 'legend'>('none');
  const [streamlinesTheme, setStreamlinesTheme] = useState<'dark' | 'light'>('dark');
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);

  const activeSeason = SEASONAL_WIND_REGIMES.find(s => s.id === activeSeasonId) || SEASONAL_WIND_REGIMES[0];
  const activeHydroMetrics = SEASONAL_HYDRO_METRICS[activeSeasonId];

  const handleCopyCitation = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCitation(id);
      setTimeout(() => setCopiedCitation(null), 2500);
    } catch {}
  };

  const handleFooterNavigate = (tab: CanonicalNavTab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      window.location.hash = tab;
    }
  };

  return (
    <div className={`w-full ${activeTab === 'curtain' || activeTab === 'streamlines' ? 'h-[calc(100vh-64px)] min-h-[600px] overflow-hidden' : 'min-h-[calc(100vh-64px)]'} flex flex-col relative bg-[#FAF8F5] dark:bg-stone-950 select-none`}>
      
      {/* =========================================================================
          TAB 1: IMMERSIVE FULL-BLEED GEOREFERENCED MAP CURTAIN VIEWER
          (No window scrollbar, no footer, edge-to-edge GIS workbench)
          ========================================================================= */}
      {activeTab === 'curtain' && (
        <HistoricalMapCurtainViewer
          selectedPlate={selectedPlate}
          onSelectPlate={setSelectedPlate}
          activeWorkbenchTab={activeTab}
          onSelectWorkbenchTab={setActiveTab}
          focusedEntity={focusedEntity}
          onClearFocusedEntity={() => setFocusedEntity(null)}
          onNavigateToCountry={onSelectCountry}
        />
      )}

      {/* =========================================================================
          TAB 2: SEASONAL OCEANIC STREAMLINES & HYDRODYNAMIC ENGINE WORKBENCH
          (Self-contained 100% full-bleed GIS canvas with sleek floating control bar)
          ========================================================================= */}
      {activeTab === 'streamlines' && (
        <div className={`w-full h-[calc(100vh-64px)] min-h-[600px] overflow-hidden relative flex flex-col ${
          streamlinesTheme === 'dark' ? 'bg-[#040914]' : 'bg-[#FAF7F2]'
        }`}>
          {/* Main Top Floating Workbench & Attached Multi-Row HUD Unit */}
          <div className="fixed top-[72px] sm:top-[76px] left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center gap-1.5 w-[96%] max-w-[1240px]">
            {/* 1. Main Floating Switcher Bar */}
            <motion.div 
              layout
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-2xl bg-[#FAF7F2]/95 dark:bg-[#1E1B18]/95 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_8px_30px_rgba(75,55,35,0.14)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl text-xs no-drag select-none"
            >
              <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B]">
                <button
                  type="button"
                  onClick={() => setActiveTab('curtain')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                  title="Georeferenced Map Curtain Workbench"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Map Curtain</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('streamlines')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer bg-cyan-700 text-white shadow-xs"
                  title="Seasonal Oceanic Streamlines Workbench"
                >
                  <Wind className="w-3 h-3 text-cyan-400" />
                  <span>Streamlines</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('kingdoms')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                  title="Pre-Colonial Kingdoms Matrix Workbench"
                >
                  <Compass className="w-3 h-3 text-purple-400" />
                  <span>Kingdoms ({PRE_COLONIAL_ENTITIES.length})</span>
                </button>

                {/* Streamlines Theme Toggle Button - ONLY on this workbench view */}
                <div className="w-[1px] h-3.5 bg-stone-300 dark:bg-stone-700 mx-0.5" />
                <button
                  type="button"
                  onClick={() => setStreamlinesTheme(t => (t === 'dark' ? 'light' : 'dark'))}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                    streamlinesTheme === 'dark'
                      ? 'bg-slate-900 text-cyan-300 border-cyan-500/40 hover:bg-slate-800 shadow-2xs'
                      : 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200 shadow-2xs'
                  }`}
                  title={streamlinesTheme === 'dark' ? 'Switch to Universal Editorial Light Theme' : 'Switch to Dark Ocean Theme'}
                >
                  {streamlinesTheme === 'dark' ? (
                    <>
                      <Moon className="w-3 h-3 text-cyan-400" />
                      <span>Dark Theme</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3 h-3 text-amber-600" />
                      <span>Editorial Light</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* 2. Directly Attached Multi-Row Unified HUD (Seamlessly positioned right below the main bar) */}
            <motion.div 
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={`pointer-events-auto w-full rounded-2xl backdrop-blur-2xl p-3 sm:p-3.5 flex flex-col gap-2.5 no-drag select-none transition-colors duration-300 ${
                streamlinesTheme === 'light'
                  ? 'bg-[#FAF7F2]/96 border border-[#DED6C9] shadow-[0_16px_45px_rgba(75,55,35,0.18)] text-stone-900'
                  : 'bg-[#060D1A]/95 dark:bg-[#060D1A]/98 border border-cyan-500/35 shadow-[0_16px_45px_rgba(0,0,0,0.75)] text-slate-100'
              }`}
            >
              {/* ROW 1: Quarter Selectors (Left) + Sliding Panel Toggles & Vector Controls (Right) */}
              <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2.5">
                {/* Left: Quarter Selector Tabs Q1 - Q4 */}
                <div className={`flex items-center gap-1 p-0.5 rounded-xl text-[11px] font-mono shrink-0 border ${
                  streamlinesTheme === 'light' ? 'bg-stone-200/80 border-stone-300' : 'bg-black/60 border-slate-800'
                }`}>
                  {SEASONAL_WIND_REGIMES.map(regime => (
                    <button
                      key={regime.id}
                      type="button"
                      onClick={() => setActiveSeasonId(regime.id as 'q1' | 'q2' | 'q3' | 'q4')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeSeasonId === regime.id
                          ? streamlinesTheme === 'light'
                            ? 'bg-stone-900 text-amber-100 font-black shadow-xs'
                            : 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_14px_rgba(6,182,212,0.65)]'
                          : streamlinesTheme === 'light'
                            ? 'text-stone-700 hover:text-stone-950 hover:bg-white/60'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                      }`}
                      title={regime.seasonName}
                    >
                      <span className="font-extrabold">{regime.id.toUpperCase()}</span>
                      <span className="text-[10px] opacity-85 font-normal">
                        ({regime.months.split(' ')[0]})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Right: Info Drawer Trigger Pills + Layer Controls */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Sliding Info Panel Pills */}
                  <div className={`flex items-center gap-0.5 p-0.5 rounded-xl text-[10.5px] font-mono border ${
                    streamlinesTheme === 'light' ? 'bg-stone-200/80 border-stone-300' : 'bg-black/50 border-slate-800'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setStreamlineDrawer(p => p === 'diagnostics' ? 'none' : 'diagnostics')}
                      className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        streamlineDrawer === 'diagnostics'
                          ? streamlinesTheme === 'light'
                            ? 'bg-cyan-100 text-cyan-950 border border-cyan-400 shadow-2xs'
                            : 'bg-cyan-900/80 text-cyan-200 border border-cyan-400/50 shadow-xs'
                          : streamlinesTheme === 'light'
                            ? 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      title="Dynamic TAST Meteorological & Mortality Badges"
                    >
                      <Gauge className="w-3.5 h-3.5 text-cyan-500" />
                      <span>TAST Indices</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStreamlineDrawer(p => p === 'corridors' ? 'none' : 'corridors')}
                      className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        streamlineDrawer === 'corridors'
                          ? streamlinesTheme === 'light'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 shadow-2xs'
                            : 'bg-emerald-900/80 text-emerald-200 border border-emerald-400/50 shadow-xs'
                          : streamlinesTheme === 'light'
                            ? 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      title="Passage Duration Matrix (4 Unified Corridors)"
                    >
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Corridors</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStreamlineDrawer(p => p === 'commentary' ? 'none' : 'commentary')}
                      className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        streamlineDrawer === 'commentary'
                          ? streamlinesTheme === 'light'
                            ? 'bg-indigo-100 text-indigo-950 border border-indigo-400 shadow-2xs'
                            : 'bg-indigo-900/80 text-indigo-200 border border-indigo-400/50 shadow-xs'
                          : streamlinesTheme === 'light'
                            ? 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      title="Prevailing Circulation & Hydrodynamic Determinism"
                    >
                      <Activity className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Circulation</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStreamlineDrawer(p => p === 'legend' ? 'none' : 'legend')}
                      className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        streamlineDrawer === 'legend'
                          ? streamlinesTheme === 'light'
                            ? 'bg-amber-100 text-amber-950 border border-amber-400 shadow-2xs'
                            : 'bg-amber-900/80 text-amber-200 border border-amber-400/50 shadow-xs'
                          : streamlinesTheme === 'light'
                            ? 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      title="Streamlines Taxonomy & Meteorological Legend"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-500" />
                      <span>Legend</span>
                    </button>
                  </div>

                  <div className={`w-[1px] h-5 mx-0.5 hidden sm:block ${streamlinesTheme === 'light' ? 'bg-stone-300' : 'bg-slate-800'}`} />

                  {/* Vector Layer Toggles: Currents / Trade Winds / Play-Pause */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowCurrents(v => !v)}
                      className={`px-2.5 py-1.5 rounded-xl text-[10.5px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        showCurrents
                          ? streamlinesTheme === 'light'
                            ? 'bg-cyan-50 text-cyan-900 border-cyan-400 shadow-2xs'
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-xs'
                          : streamlinesTheme === 'light'
                            ? 'bg-stone-100 text-stone-400 border-transparent line-through opacity-60'
                            : 'bg-black/30 text-slate-500 border-transparent line-through opacity-60'
                      }`}
                      title="Toggle Ocean Currents Vectors"
                    >
                      <Waves className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Currents</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowWinds(v => !v)}
                      className={`px-2.5 py-1.5 rounded-xl text-[10.5px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        showWinds
                          ? streamlinesTheme === 'light'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-400 shadow-2xs'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-xs'
                          : streamlinesTheme === 'light'
                            ? 'bg-stone-100 text-stone-400 border-transparent line-through opacity-60'
                            : 'bg-black/30 text-slate-500 border-transparent line-through opacity-60'
                      }`}
                      title="Toggle Atmospheric Trade Winds Vectors"
                    >
                      <Wind className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Winds</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsStreamlinesPlaying(v => !v)}
                      className={`p-1.5 rounded-xl transition-all cursor-pointer border ${
                        streamlinesTheme === 'light'
                          ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                      title={isStreamlinesPlaying ? 'Pause Hydrodynamic Simulation' : 'Resume Hydrodynamic Simulation'}
                    >
                      {isStreamlinesPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyan-500" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* ROW 2: FULL DEDICATED ROW - Seasonal Period Title & ITCZ / Climate Indices */}
              <div className={`pt-2.5 border-t flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-xs ${
                streamlinesTheme === 'light' ? 'border-stone-200' : 'border-slate-800/80'
              }`}>
                {/* Left: Seasonal Title & Months */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[10.5px] font-bold border shrink-0 ${
                    streamlinesTheme === 'light' 
                      ? 'bg-cyan-100 text-cyan-900 border-cyan-300' 
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}>
                    <Sparkles className="w-3 h-3 text-cyan-500" />
                    {activeSeason.id.toUpperCase()} • {activeSeason.months}
                  </span>
                  <h2 className={`font-serif font-bold text-sm sm:text-base tracking-tight truncate ${
                    streamlinesTheme === 'light' ? 'text-stone-900' : 'text-slate-100'
                  }`}>
                    {activeSeason.seasonName}
                  </h2>
                </div>

                {/* Right: Meteorological Indices Chips */}
                <div className={`flex flex-wrap items-center gap-2 text-[10.5px] font-mono shrink-0 ${
                  streamlinesTheme === 'light' ? 'text-stone-700' : 'text-slate-300'
                }`}>
                  <span className={`px-2 py-0.5 rounded-lg border flex items-center gap-1.5 ${
                    streamlinesTheme === 'light' ? 'bg-stone-100 border-stone-300' : 'bg-black/40 border-slate-800'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
                    <span>ITCZ: <strong className={streamlinesTheme === 'light' ? "text-cyan-800 font-bold" : "text-cyan-300 font-bold"}>{activeSeason.itczPosition}</strong></span>
                  </span>

                  <span className={`px-2 py-0.5 rounded-lg border flex items-center gap-1.5 ${
                    streamlinesTheme === 'light' ? 'bg-stone-100 border-stone-300' : 'bg-black/40 border-slate-800'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>Harmattan: <strong className={streamlinesTheme === 'light' ? "text-amber-800 font-bold" : "text-amber-300 font-bold"}>{activeSeason.harmattanIntensity}</strong></span>
                  </span>

                  <span className={`px-2 py-0.5 rounded-lg border flex items-center gap-1.5 max-w-sm sm:max-w-md truncate ${
                    streamlinesTheme === 'light' ? 'bg-stone-100 border-stone-300' : 'bg-black/40 border-slate-800'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">Trades: <strong className={streamlinesTheme === 'light' ? "text-emerald-800 font-bold" : "text-emerald-300 font-bold"}>{activeSeason.tradeWindsBehavior.split(';')[0]}</strong></span>
                  </span>
                </div>
              </div>

              {/* ROW 3: Expandable Info Drawers */}
              <AnimatePresence mode="wait">
                {streamlineDrawer === 'diagnostics' && (
                  <motion.div
                    key="panel-diagnostics"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`overflow-hidden pt-2.5 border-t text-xs ${streamlinesTheme === 'light' ? 'border-stone-200' : 'border-slate-800/80'}`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono">
                      <div className={`p-3 rounded-xl border ${
                        streamlinesTheme === 'light' ? 'bg-cyan-50/80 border-cyan-200 text-cyan-950' : 'bg-cyan-950/60 border-cyan-800/60 text-cyan-200'
                      }`}>
                        <div className="text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1.5">
                          <Wind className="w-3.5 h-3.5" />
                          Wind Field &amp; Regime
                        </div>
                        <div className="font-bold text-sm mt-1">{activeHydroMetrics.tastCorrelations.windSpeedDisplay}</div>
                        <div className="text-[10px] opacity-80 mt-0.5 truncate">{activeHydroMetrics.tastCorrelations.windName}</div>
                      </div>

                      <div className={`p-3 rounded-xl border ${
                        streamlinesTheme === 'light' ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-amber-950/60 border-amber-800/60 text-amber-200'
                      }`}>
                        <div className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
                          <Thermometer className="w-3.5 h-3.5" />
                          Hold Microclimate &amp; Temp
                        </div>
                        <div className="font-bold text-sm mt-1">{activeHydroMetrics.tastCorrelations.holdTemperature}</div>
                        <div className="text-[10px] opacity-80 mt-0.5 truncate">Severe below-deck thermal stress</div>
                      </div>

                      <div className={`p-3 rounded-xl border ${
                        streamlinesTheme === 'light' ? 'bg-rose-50/80 border-rose-200 text-rose-950' : 'bg-rose-950/60 border-rose-800/60 text-rose-200'
                      }`}>
                        <div className="text-[10px] uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                          <Skull className="w-3.5 h-3.5" />
                          Middle Passage Mortality Rate
                        </div>
                        <div className="font-bold text-sm mt-1">{activeHydroMetrics.tastCorrelations.mortalityRate}</div>
                        <div className="text-[10px] opacity-80 mt-0.5 truncate">Share of departures: {activeHydroMetrics.tastCorrelations.departureShare}</div>
                      </div>

                      <div className={`p-3 rounded-xl border ${
                        streamlinesTheme === 'light' ? 'bg-stone-100/90 border-stone-300 text-stone-800' : 'bg-slate-900/80 border-slate-800 text-slate-300'
                      }`}>
                        <div className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-cyan-500" />
                          Epidemiological Determinism
                        </div>
                        <p className="text-[10px] leading-snug mt-1 opacity-90 line-clamp-2">
                          {activeHydroMetrics.tastCorrelations.climateImpactNote}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {streamlineDrawer === 'corridors' && (
                  <motion.div
                    key="panel-corridors"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`overflow-hidden pt-2.5 border-t text-xs ${streamlinesTheme === 'light' ? 'border-stone-200' : 'border-slate-800/80'}`}
                  >
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono">
                      <div className={`p-3 rounded-xl border ${streamlinesTheme === 'light' ? 'bg-stone-100/90 border-stone-300' : 'bg-slate-900/80 border-slate-800'}`}>
                        <div className="text-[10px] uppercase opacity-60 truncate">1. Senegambia ➔ Caribbean</div>
                        <div className={`text-base font-serif font-black mt-1 ${streamlinesTheme === 'light' ? 'text-cyan-800' : 'text-cyan-300'}`}>
                          {activeSeason.transatlanticPassageDurationDays.senegambiaToCaribbean} <span className="text-[10px] font-mono font-normal opacity-70">days</span>
                        </div>
                        <div className="text-[9.5px] opacity-60 mt-0.5">Canary Current + NE Trades</div>
                      </div>

                      <div className={`p-3 rounded-xl border ${streamlinesTheme === 'light' ? 'bg-stone-100/90 border-stone-300' : 'bg-slate-900/80 border-slate-800'}`}>
                        <div className="text-[10px] uppercase opacity-60 truncate">2. Benin ➔ Bahia</div>
                        <div className={`text-base font-serif font-black mt-1 ${streamlinesTheme === 'light' ? 'text-amber-800' : 'text-amber-300'}`}>
                          {activeSeason.transatlanticPassageDurationDays.bightOfBeninToBahia} <span className="text-[10px] font-mono font-normal opacity-70">days</span>
                        </div>
                        <div className="text-[9.5px] opacity-60 mt-0.5">Equatorial Flow Vector</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${streamlinesTheme === 'light' ? 'bg-emerald-50/90 border-emerald-300' : 'bg-emerald-950/60 border-emerald-700/60'}`}>
                        <div className="text-[10px] uppercase text-emerald-700 dark:text-emerald-400 font-bold truncate">3. Angola ➔ Rio (Fastest)</div>
                        <div className={`text-base font-serif font-black mt-1 ${streamlinesTheme === 'light' ? 'text-emerald-800' : 'text-emerald-300'}`}>
                          {activeSeason.transatlanticPassageDurationDays.angolaToRioDeJaneiro} <span className="text-[10px] font-mono font-normal opacity-70">days</span>
                        </div>
                        <div className="text-[9.5px] text-emerald-600 dark:text-emerald-400/80 mt-0.5">South Atlantic Gyre Conveyor</div>
                      </div>

                      <div className={`p-3 rounded-xl border ${streamlinesTheme === 'light' ? 'bg-stone-100/90 border-stone-300' : 'bg-slate-900/80 border-slate-800'}`}>
                        <div className="text-[10px] uppercase opacity-60 truncate">4. Mozambique ➔ Brazil</div>
                        <div className={`text-base font-serif font-black mt-1 ${streamlinesTheme === 'light' ? 'text-rose-800' : 'text-rose-300'}`}>
                          {activeSeason.transatlanticPassageDurationDays.mozambiqueToBrazil} <span className="text-[10px] font-mono font-normal opacity-70">days</span>
                        </div>
                        <div className="text-[9.5px] opacity-60 mt-0.5">Indian Ocean Cape Rounding</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {streamlineDrawer === 'commentary' && (
                  <motion.div
                    key="panel-commentary"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`overflow-hidden pt-2.5 border-t text-xs font-mono ${streamlinesTheme === 'light' ? 'border-stone-200' : 'border-slate-800/80'}`}
                  >
                    <div className={`p-3.5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                      streamlinesTheme === 'light' ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950' : 'bg-indigo-950/40 border-indigo-800/50 text-indigo-100'
                    }`}>
                      <div className="space-y-1">
                        <div className="text-[10.5px] uppercase font-bold text-indigo-600 dark:text-indigo-300 flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-indigo-500" />
                          Prevailing Circulation Dynamics &amp; Hydrodynamic Determinism
                        </div>
                        <p className="text-[11px] leading-relaxed max-w-4xl opacity-90">
                          {activeHydroMetrics.dominantVectorNote}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border ${
                          streamlinesTheme === 'light' ? 'bg-indigo-100 text-indigo-900 border-indigo-300' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        }`}>
                          Harmattan: {activeSeason.harmattanIntensity}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {streamlineDrawer === 'legend' && (
                  <motion.div
                    key="panel-legend"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`overflow-hidden pt-2.5 border-t text-xs font-mono ${streamlinesTheme === 'light' ? 'border-stone-200' : 'border-slate-800/80'}`}
                  >
                    <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3 rounded-xl border ${
                      streamlinesTheme === 'light' ? 'bg-stone-100/90 border-stone-300 text-stone-800' : 'bg-slate-900/80 border-slate-800 text-slate-300'
                    }`}>
                      <div className="flex flex-wrap items-center gap-4 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${streamlinesTheme === 'light' ? 'bg-cyan-600' : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]'}`} />
                          <strong className={streamlinesTheme === 'light' ? "text-stone-900" : "text-slate-100"}>Trade Winds (Arrows):</strong> Atmospheric Vectors
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${streamlinesTheme === 'light' ? 'bg-blue-600' : 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.9)]'}`} />
                          <strong className={streamlinesTheme === 'light' ? "text-stone-900" : "text-slate-100"}>Cold Upwelling Currents:</strong> Canary &amp; Benguela
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${streamlinesTheme === 'light' ? 'bg-amber-600' : 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]'}`} />
                          <strong className={streamlinesTheme === 'light' ? "text-stone-900" : "text-slate-100"}>Warm Equatorial Currents:</strong> Guinea &amp; South Eq.
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[10.5px] opacity-75">
                        <span>ITCZ: <strong className={streamlinesTheme === 'light' ? "text-cyan-800" : "text-cyan-300"}>{activeSeason.itczPosition}</strong></span>
                        <span>•</span>
                        <span>Harmattan: <strong className={streamlinesTheme === 'light' ? "text-amber-800" : "text-amber-300"}>{activeSeason.harmattanIntensity}</strong></span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <OceanCurrentParticleCanvas
            activeSeasonId={activeSeasonId}
            showCurrents={showCurrents}
            showWinds={showWinds}
            isPlaying={isStreamlinesPlaying}
            theme={streamlinesTheme}
            className="w-full h-full flex-1"
          />
        </div>
      )}

      {/* =========================================================================
          TAB 3: PRE-COLONIAL KINGDOMS & POLITIES MATRIX WORKBENCH
          (Standard window scroll, no double scrollbars, visible footer)
          ========================================================================= */}
      {activeTab === 'kingdoms' && (
        <div className="w-full flex-1 flex flex-col">
          <div className="px-3 sm:px-6 lg:px-8 py-4 pt-20 sm:pt-24 space-y-6 w-full flex-1">
            
            {/* Top Fixed Header Control Bar */}
            <div className="fixed top-[72px] sm:top-[76px] left-1/2 -translate-x-1/2 z-30 pointer-events-none flex justify-center w-max max-w-[calc(100vw-24px)] sm:max-w-[calc(100vw-48px)]">
              <motion.div 
                layout
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-auto flex items-center flex-wrap gap-1 sm:gap-1.5 p-1.5 rounded-2xl bg-[#FAF7F2]/95 dark:bg-[#1E1B18]/95 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_8px_30px_rgba(75,55,35,0.14)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl text-xs no-drag select-none"
              >
                <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('curtain')}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                    title="Georeferenced Map Curtain Workbench"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>Map Curtain</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('streamlines')}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                    title="Seasonal Oceanic Streamlines Workbench"
                  >
                    <Wind className="w-3 h-3 text-cyan-400" />
                    <span>Streamlines</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('kingdoms')}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer bg-purple-700 text-white shadow-xs"
                    title="Pre-Colonial Kingdoms Matrix Workbench"
                  >
                    <Compass className="w-3 h-3 text-purple-400" />
                    <span>Kingdoms ({PRE_COLONIAL_ENTITIES.length})</span>
                  </button>
                </div>

                {/* Toponymic Concordance Button */}
                <button
                  type="button"
                  onClick={() => setIsToponymConcordanceOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 border border-amber-500/40 text-[10px] font-mono font-bold transition-all cursor-pointer shadow-2xs"
                  title="Open Toponymic Concordance Index Table"
                >
                  <BookOpen className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Concordance</span>
                </button>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-purple-700 dark:text-purple-400">
                  Pre-Colonial State Formations &amp; Polities Matrix
                </span>
                <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  Authoritative Civilizations ({PRE_COLONIAL_ENTITIES.length} Historical Kingdoms)
                </h2>
              </div>
              <p className="text-xs font-sans text-stone-600 dark:text-stone-400 max-w-md text-left sm:text-right leading-relaxed">
                Explore dynastic capitals, commercial trade routes, and spatial footprints overlaid directly on 2026 sovereign borders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-left">
              {PRE_COLONIAL_ENTITIES.map(entity => (
                <div
                  key={entity.id}
                  className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-purple-500/60 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans font-bold border shadow-2xs"
                        style={{
                          backgroundColor: `${entity.color}18`,
                          borderColor: `${entity.color}45`,
                          color: entity.color
                        }}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entity.color }} />
                        <span className="truncate max-w-[125px]">{entity.regionBadge}</span>
                      </span>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 border border-stone-200/90 dark:border-stone-700 shrink-0 text-right">
                        {entity.period}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors leading-snug">
                        {entity.name}
                      </h3>
                    </div>

                    <p className="font-sans text-xs sm:text-[13px] leading-relaxed text-stone-700 dark:text-stone-300 font-normal">
                      {entity.significance}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-3.5 border-t border-stone-100 dark:border-stone-800 font-sans text-xs">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-stone-500 dark:text-stone-400 shrink-0 font-medium">Historical Capital:</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-100 text-right truncate">{entity.capital}</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-stone-500 dark:text-stone-400 shrink-0 font-medium">Trade Specialties:</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-100 text-right truncate">{entity.tradeSpecialty}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-stone-500 dark:text-stone-400 block text-[10px] uppercase font-mono font-bold">Modern Territorial Footprint:</span>
                      <span className="text-purple-700 dark:text-purple-300 font-semibold leading-tight block mt-0.5">{entity.modernCountries.join(', ')}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedArtifactKingdom(DETAILED_KINGDOMS_DATA[entity.id] || DETAILED_KINGDOMS_DATA['benin-kingdom'])}
                        className="py-2 px-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-900 dark:text-purple-200 border border-purple-500/30 text-[10.5px] font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        title={`Inspect ${entity.name} 3D Material Culture Artifacts`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span>3D Artifact</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedDynastyKingdom(DETAILED_KINGDOMS_DATA[entity.id] || DETAILED_KINGDOMS_DATA['kongo-kingdom'])}
                        className="py-2 px-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 border border-amber-500/30 text-[10.5px] font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        title={`Inspect ${entity.name} Dynastic Succession & Queen Mothers`}
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Dynasty</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFocusedEntity(entity);
                          setActiveTab('curtain');
                        }}
                        className="py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300/80 dark:border-stone-700 text-[10.5px] font-sans font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        title={`View ${entity.name} on Map Curtain`}
                      >
                        <span>Curtain</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Dynastic Lineage Modal in Kingdoms Workbench */}
          <AnimatePresence>
            {selectedDynastyKingdom && (
              <KingdomDynasticTreeModal
                kingdom={selectedDynastyKingdom}
                onClose={() => setSelectedDynastyKingdom(null)}
              />
            )}
          </AnimatePresence>

          {/* Interactive 3D Artifact Inspector Modal in Kingdoms Workbench */}
          <AnimatePresence>
            {selectedArtifactKingdom && (
              <KingdomArtifact3DViewerModal
                kingdom={selectedArtifactKingdom}
                onClose={() => setSelectedArtifactKingdom(null)}
              />
            )}
          </AnimatePresence>

          {/* Toponymic Concordance Table Modal */}
          <AnimatePresence>
            {isToponymConcordanceOpen && (
              <ToponymConcordanceModal
                onClose={() => setIsToponymConcordanceOpen(false)}
                onLocateToponym={(item: ToponymConcordanceItem) => {
                  setIsToponymConcordanceOpen(false);
                  setActiveTab('curtain');
                }}
              />
            )}
          </AnimatePresence>

          {/* Structured Credibility Footer */}
          <Footer
            onNavigateTab={handleFooterNavigate}
            onOpenColophon={onOpenColophon}
            onOpenCitationModal={onOpenCitationModal}
            onOpenWorkingPapers={onOpenWorkingPapers}
            onOpenMethodologyAudit={onOpenMethodologyAudit}
          />
        </div>
      )}
    </div>
  );
};
