import React, { useState, useCallback } from 'react';
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
import { OceanCurrentParticleCanvas, TelemetryData } from '../components/cartography/OceanCurrentParticleCanvas';
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
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [particleDensity, setParticleDensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [streamlineDrawer, setStreamlineDrawer] = useState<'none' | 'diagnostics' | 'corridors' | 'commentary' | 'legend'>('none');
  const [streamlinesTheme, setStreamlinesTheme] = useState<'dark' | 'light'>('dark');
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);

  const handleTelemetryChange = useCallback((data: TelemetryData | null) => {
    setTelemetry(data);
  }, []);

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
          <div className="fixed top-[72px] sm:top-[76px] left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center gap-1.5 w-[96%] max-w-[1440px]">
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

            {/* 2. Directly Attached 3-Row Unified HUD (Seamlessly positioned right below the main bar) */}
            <motion.div 
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={`pointer-events-auto w-full rounded-2xl backdrop-blur-2xl p-3 sm:p-3.5 flex flex-col gap-2.5 no-drag select-none transition-colors duration-300 ${
                streamlinesTheme === 'light'
                  ? 'bg-white/98 border-2 border-stone-400 shadow-[0_16px_45px_rgba(0,0,0,0.18)] text-stone-950'
                  : 'bg-[#060D1A]/98 border-2 border-cyan-500/60 shadow-[0_16px_45px_rgba(0,0,0,0.85)] text-slate-100'
              }`}
            >
              {/* ROW 1: Quarter Selectors + Drawer Toggles (Left) & Speed, Density & Vector Controls (Right) */}
              <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2.5">
                {/* Left Group: Quarterly Selectors + Info Panel Drawer Toggles */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Quarter Selector Tabs: Q1, Q2, Q3, Q4 */}
                  <div className={`flex items-center gap-1 p-1 rounded-xl text-[11px] font-mono shrink-0 border-2 ${
                    streamlinesTheme === 'light' ? 'bg-stone-100 border-stone-400' : 'bg-slate-900 border-slate-700'
                  }`}>
                    {SEASONAL_WIND_REGIMES.map(regime => (
                      <button
                        key={regime.id}
                        type="button"
                        onClick={() => setActiveSeasonId(regime.id as 'q1' | 'q2' | 'q3' | 'q4')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          activeSeasonId === regime.id
                            ? streamlinesTheme === 'light'
                              ? 'bg-stone-950 text-amber-200 font-black shadow-xs'
                              : 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_14px_rgba(6,182,212,0.65)]'
                            : streamlinesTheme === 'light'
                              ? 'text-stone-900 hover:text-black hover:bg-stone-300/80 font-black'
                              : 'text-slate-100 hover:text-white hover:bg-white/20 font-black'
                        }`}
                        title={regime.seasonName}
                      >
                        <span className="font-black text-xs tracking-wide">{regime.id.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>

                  <div className={`w-[1px] h-5 mx-0.5 hidden sm:block ${streamlinesTheme === 'light' ? 'bg-stone-400' : 'bg-slate-700'}`} />

                  {/* Sliding Info Panel Drawer Toggles right beside quarterly selectors */}
                  <div className={`flex items-center gap-1 p-1 rounded-xl text-[10.5px] font-mono shrink-0 border-2 ${
                    streamlinesTheme === 'light' ? 'bg-stone-100 border-stone-400' : 'bg-slate-900 border-slate-700'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setStreamlineDrawer(curr => curr === 'diagnostics' ? 'none' : 'diagnostics')}
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        streamlineDrawer === 'diagnostics'
                          ? streamlinesTheme === 'light'
                            ? 'bg-stone-950 text-amber-200 border-stone-950 shadow-2xs font-black'
                            : 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-xs'
                          : streamlinesTheme === 'light'
                            ? 'bg-white text-stone-950 hover:bg-stone-200 border-stone-400 font-black shadow-2xs'
                            : 'bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border-slate-600 font-black shadow-xs'
                      }`}
                      title="Toggle TAST Hydrodynamic Indices & Mortality Correlates"
                    >
                      <Activity className={`w-3.5 h-3.5 shrink-0 ${
                        streamlineDrawer === 'diagnostics'
                          ? (streamlinesTheme === 'light' ? 'text-amber-200' : 'text-slate-950')
                          : (streamlinesTheme === 'light' ? 'text-cyan-700' : 'text-cyan-300')
                      }`} />
                      <span>TAST Indices</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStreamlineDrawer(curr => curr === 'corridors' ? 'none' : 'corridors')}
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        streamlineDrawer === 'corridors'
                          ? streamlinesTheme === 'light'
                            ? 'bg-stone-950 text-amber-200 border-stone-950 shadow-2xs font-black'
                            : 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-xs'
                          : streamlinesTheme === 'light'
                            ? 'bg-white text-stone-950 hover:bg-stone-200 border-stone-400 font-black shadow-2xs'
                            : 'bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border-slate-600 font-black shadow-xs'
                      }`}
                      title="Toggle Transatlantic Sailing Corridors & Durations"
                    >
                      <Compass className={`w-3.5 h-3.5 shrink-0 ${
                        streamlineDrawer === 'corridors'
                          ? (streamlinesTheme === 'light' ? 'text-amber-200' : 'text-slate-950')
                          : (streamlinesTheme === 'light' ? 'text-emerald-700' : 'text-emerald-300')
                      }`} />
                      <span>Corridors</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStreamlineDrawer(curr => curr === 'commentary' ? 'none' : 'commentary')}
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        streamlineDrawer === 'commentary'
                          ? streamlinesTheme === 'light'
                            ? 'bg-stone-950 text-amber-200 border-stone-950 shadow-2xs font-black'
                            : 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-xs'
                          : streamlinesTheme === 'light'
                            ? 'bg-white text-stone-950 hover:bg-stone-200 border-stone-400 font-black shadow-2xs'
                            : 'bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border-slate-600 font-black shadow-xs'
                      }`}
                      title="Toggle Prevailing Oceanic Circulation Dynamics"
                    >
                      <Wind className={`w-3.5 h-3.5 shrink-0 ${
                        streamlineDrawer === 'commentary'
                          ? (streamlinesTheme === 'light' ? 'text-amber-200' : 'text-slate-950')
                          : (streamlinesTheme === 'light' ? 'text-indigo-700' : 'text-cyan-300')
                      }`} />
                      <span>Circulation</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStreamlineDrawer(curr => curr === 'legend' ? 'none' : 'legend')}
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        streamlineDrawer === 'legend'
                          ? streamlinesTheme === 'light'
                            ? 'bg-stone-950 text-amber-200 border-stone-950 shadow-2xs font-black'
                            : 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-xs'
                          : streamlinesTheme === 'light'
                            ? 'bg-white text-stone-950 hover:bg-stone-200 border-stone-400 font-black shadow-2xs'
                            : 'bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border-slate-600 font-black shadow-xs'
                      }`}
                      title="Toggle Hydrodynamic & Cartographic Legend"
                    >
                      <Layers className={`w-3.5 h-3.5 shrink-0 ${
                        streamlineDrawer === 'legend'
                          ? (streamlinesTheme === 'light' ? 'text-amber-200' : 'text-slate-950')
                          : (streamlinesTheme === 'light' ? 'text-amber-700' : 'text-amber-300')
                      }`} />
                      <span>Legend</span>
                    </button>
                  </div>
                </div>

                {/* Right Group: Simulation Controls (Speed, Density, Currents, Winds, Play/Pause) */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Speed Multiplier Pills */}
                  <div className={`flex items-center gap-0.5 p-0.5 rounded-xl text-[10.5px] font-mono border-2 ${
                    streamlinesTheme === 'light' ? 'bg-stone-100 border-stone-400' : 'bg-slate-900 border-slate-700'
                  }`}>
                    <span className={`text-[9.5px] px-1.5 font-black uppercase tracking-wider ${
                      streamlinesTheme === 'light' ? 'text-stone-950' : 'text-slate-200'
                    }`}>Speed:</span>
                    {[0.5, 1.0, 1.5, 2.0].map(s => (
                      <button
                        key={`top-speed-${s}`}
                        type="button"
                        onClick={() => setSpeedMultiplier(s)}
                        className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          speedMultiplier === s
                            ? streamlinesTheme === 'light'
                              ? 'bg-amber-700 text-white shadow-2xs font-black'
                              : 'bg-amber-500 text-slate-950 font-black shadow-xs'
                            : streamlinesTheme === 'light'
                              ? 'text-stone-900 hover:text-black hover:bg-stone-300/80 font-black'
                              : 'text-slate-200 hover:text-white hover:bg-white/20 font-black'
                        }`}
                        title={`Set particle velocity to ${s}x`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  {/* Particle Density Pills */}
                  <div className={`flex items-center gap-0.5 p-0.5 rounded-xl text-[10.5px] font-mono border-2 ${
                    streamlinesTheme === 'light' ? 'bg-stone-100 border-stone-400' : 'bg-slate-900 border-slate-700'
                  }`}>
                    <span className={`text-[9.5px] px-1.5 font-black uppercase tracking-wider ${
                      streamlinesTheme === 'light' ? 'text-stone-950' : 'text-slate-200'
                    }`}>Density:</span>
                    {(['low', 'medium', 'high'] as const).map(d => (
                      <button
                        key={`top-density-${d}`}
                        type="button"
                        onClick={() => setParticleDensity(d)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer capitalize ${
                          particleDensity === d
                            ? streamlinesTheme === 'light'
                              ? 'bg-stone-950 text-amber-200 shadow-2xs font-black'
                              : 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                            : streamlinesTheme === 'light'
                              ? 'text-stone-900 hover:text-black hover:bg-stone-300/80 font-black'
                              : 'text-slate-200 hover:text-white hover:bg-white/20 font-black'
                        }`}
                        title={`Set particle density to ${d}`}
                      >
                        {d === 'medium' ? 'Med' : d}
                      </button>
                    ))}
                  </div>

                  <div className={`w-[1px] h-5 mx-0.5 hidden sm:block ${streamlinesTheme === 'light' ? 'bg-stone-400' : 'bg-slate-700'}`} />

                  {/* Vector Layer Toggles: Currents / Trade Winds / Play-Pause */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowCurrents(v => !v)}
                      className={`px-2.5 py-1.5 rounded-xl text-[10.5px] font-mono font-black flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                        showCurrents
                          ? streamlinesTheme === 'light'
                            ? 'bg-cyan-100 text-cyan-950 border-cyan-600 shadow-xs'
                            : 'bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-xs'
                          : streamlinesTheme === 'light'
                            ? 'bg-stone-100 text-stone-500 border-stone-300 line-through opacity-70'
                            : 'bg-slate-900 text-slate-400 border-slate-700 line-through opacity-70'
                      }`}
                      title="Toggle Ocean Currents Vectors"
                    >
                      <Waves className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400 shrink-0" />
                      <span>Currents</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowWinds(v => !v)}
                      className={`px-2.5 py-1.5 rounded-xl text-[10.5px] font-mono font-black flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                        showWinds
                          ? streamlinesTheme === 'light'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-600 shadow-xs'
                            : 'bg-emerald-500/30 text-emerald-200 border-emerald-400 shadow-xs'
                          : streamlinesTheme === 'light'
                            ? 'bg-stone-100 text-stone-500 border-stone-300 line-through opacity-70'
                            : 'bg-slate-900 text-slate-400 border-slate-700 line-through opacity-70'
                      }`}
                      title="Toggle Atmospheric Trade Winds Vectors"
                    >
                      <Wind className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span>Winds</span>
                    </button>

                    {/* Play/Pause Button */}
                    <button
                      type="button"
                      onClick={() => setIsStreamlinesPlaying(v => !v)}
                      className={`p-1.5 rounded-xl transition-all cursor-pointer border-2 ${
                        streamlinesTheme === 'light'
                          ? 'bg-white hover:bg-stone-100 text-stone-950 border-stone-400 shadow-2xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-600 shadow-xs'
                      }`}
                      title={isStreamlinesPlaying ? 'Pause Hydrodynamic Simulation' : 'Resume Hydrodynamic Simulation'}
                    >
                      {isStreamlinesPlaying ? (
                        <Pause className={`w-3.5 h-3.5 ${streamlinesTheme === 'light' ? 'text-stone-950' : 'text-slate-100'}`} />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-cyan-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* ROW 2: Seasonal Title & High-Contrast Live Coordinates / Winds Telemetry */}
              <div className={`pt-2.5 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 text-xs ${
                streamlinesTheme === 'light' ? 'border-stone-300' : 'border-slate-800'
              }`}>
                {/* Left: Seasonal Title & Months */}
                <div className="flex items-center gap-2.5 min-w-0 shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-black border-2 shrink-0 ${
                    streamlinesTheme === 'light' 
                      ? 'bg-cyan-100 text-cyan-950 border-cyan-500' 
                      : 'bg-cyan-500/30 text-cyan-200 border-cyan-400'
                  }`}>
                    <Sparkles className={`w-3.5 h-3.5 ${streamlinesTheme === 'light' ? 'text-cyan-700' : 'text-cyan-300'}`} />
                    {activeSeason.id.toUpperCase()} • {activeSeason.months}
                  </span>
                  <h2 className={`font-serif font-black text-sm sm:text-base tracking-tight truncate ${
                    streamlinesTheme === 'light' ? 'text-stone-950' : 'text-white'
                  }`}>
                    {activeSeason.seasonName}
                  </h2>
                </div>

                {/* Right: High-Contrast Live Cursor Coordinates & Current/Wind Flow Telemetry Badge */}
                <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                  <div className={`px-3.5 py-1.5 rounded-xl border-2 flex items-center gap-2.5 transition-colors ${
                    streamlinesTheme === 'light' 
                      ? 'bg-white border-stone-400 text-stone-950 shadow-sm font-black' 
                      : 'bg-slate-900 border-cyan-400 text-white shadow-sm font-black'
                  }`}>
                    <span className={`flex items-center gap-1.5 font-black shrink-0 ${
                      streamlinesTheme === 'light' ? 'text-stone-950' : 'text-cyan-300'
                    }`}>
                      <Compass className={`w-3.5 h-3.5 ${streamlinesTheme === 'light' ? 'text-cyan-700' : 'text-cyan-300'}`} />
                      <span>
                        {telemetry 
                          ? `${Math.abs(telemetry.lat).toFixed(1)}°${telemetry.lat >= 0 ? 'N' : 'S'}, ${Math.abs(telemetry.lng).toFixed(1)}°${telemetry.lng >= 0 ? 'E' : 'W'}` 
                          : 'Coordinates: Hover Canvas'}
                      </span>
                    </span>

                    {telemetry?.currentName && (
                      <>
                        <span className="opacity-40">•</span>
                        <span className={`truncate max-w-[170px] font-black ${
                          streamlinesTheme === 'light' ? 'text-blue-950' : 'text-sky-300'
                        }`}>{telemetry.currentName}</span>
                      </>
                    )}

                    {telemetry?.windName && (
                      <>
                        <span className="opacity-40">•</span>
                        <span className={`truncate max-w-[170px] font-black ${
                          streamlinesTheme === 'light' ? 'text-emerald-950' : 'text-emerald-300'
                        }`}>{telemetry.windName}</span>
                      </>
                    )}

                    {telemetry?.flowSpeed && (
                      <>
                        <span className="opacity-40">•</span>
                        <span className={`font-black ${
                          streamlinesTheme === 'light' ? 'text-amber-950' : 'text-amber-300'
                        }`}>{telemetry.flowSpeed}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* ROW 3: Dedicated Row for ITCZ, Harmattan, and Trade Winds Meteorological Indicators */}
              <div className={`pt-2.5 border-t flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono ${
                streamlinesTheme === 'light' ? 'border-stone-300' : 'border-slate-800'
              }`}>
                {/* Left: ITCZ & Harmattan Indicators */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <span className={`px-3 py-1.5 rounded-xl border-2 flex items-center gap-2 font-bold ${
                    streamlinesTheme === 'light' ? 'bg-white border-cyan-500 text-stone-950 shadow-sm' : 'bg-slate-900 border-cyan-400 text-white shadow-sm'
                  }`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0 animate-pulse" />
                    <span className={`font-bold ${streamlinesTheme === 'light' ? 'text-stone-950' : 'text-slate-200'}`}>ITCZ Position:</span>
                    <strong className={streamlinesTheme === 'light' ? "text-cyan-950 font-black" : "text-cyan-300 font-black"}>{activeSeason.itczPosition}</strong>
                  </span>

                  <span className={`px-3 py-1.5 rounded-xl border-2 flex items-center gap-2 font-bold ${
                    streamlinesTheme === 'light' ? 'bg-white border-amber-500 text-stone-950 shadow-sm' : 'bg-slate-900 border-amber-400 text-white shadow-sm'
                  }`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className={`font-bold ${streamlinesTheme === 'light' ? 'text-stone-950' : 'text-slate-200'}`}>Harmattan Outflow:</span>
                    <strong className={streamlinesTheme === 'light' ? "text-amber-950 font-black" : "text-amber-300 font-black"}>{activeSeason.harmattanIntensity}</strong>
                  </span>
                </div>

                {/* Right: Prevailing Trade Winds Regime */}
                <div className={`px-3 py-1.5 rounded-xl border-2 flex items-center gap-2 max-w-xl truncate font-bold ${
                  streamlinesTheme === 'light' ? 'bg-white border-emerald-600 text-stone-950 shadow-sm' : 'bg-slate-900 border-emerald-400 text-white shadow-sm'
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className={`font-bold shrink-0 ${streamlinesTheme === 'light' ? 'text-stone-950' : 'text-slate-200'}`}>Prevailing Winds:</span>
                  <strong className={`truncate ${streamlinesTheme === 'light' ? "text-emerald-950 font-black" : "text-emerald-300 font-black"}`}>{activeSeason.tradeWindsBehavior}</strong>
                </div>
              </div>

              {/* Expandable Info Drawers (High-Contrast, Explicit theme text, Editorial Corridors typography) */}
              <AnimatePresence mode="wait">
                {streamlineDrawer === 'diagnostics' && (
                  <motion.div
                    key="panel-diagnostics"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`overflow-hidden pt-2.5 border-t text-xs font-sans ${streamlinesTheme === 'light' ? 'border-stone-300' : 'border-slate-800'}`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 font-sans">
                      {/* 1. Wind Field */}
                      <div className={`p-3.5 rounded-xl border-2 flex flex-col justify-between ${
                        streamlinesTheme === 'light' ? 'bg-white border-cyan-500 text-stone-950 shadow-sm' : 'bg-slate-900 border-cyan-400 text-white shadow-sm'
                      }`}>
                        <div>
                          <div className={`text-xs uppercase tracking-wider font-black flex items-center gap-1.5 font-sans ${
                            streamlinesTheme === 'light' ? 'text-stone-950' : 'text-cyan-300'
                          }`}>
                            <Wind className={`w-4 h-4 ${streamlinesTheme === 'light' ? 'text-cyan-700' : 'text-cyan-400'}`} />
                            Wind Field &amp; Regime
                          </div>
                          <div className={`font-serif font-black text-xl sm:text-2xl mt-1 tracking-tight ${
                            streamlinesTheme === 'light' ? 'text-stone-950' : 'text-white'
                          }`}>{activeHydroMetrics.tastCorrelations.windSpeedDisplay}</div>
                        </div>
                        <div className={`text-xs font-bold mt-1.5 font-sans leading-relaxed ${
                          streamlinesTheme === 'light' ? 'text-stone-900' : 'text-slate-200'
                        }`}>{activeHydroMetrics.tastCorrelations.windName}</div>
                      </div>

                      {/* 2. Hold Microclimate */}
                      <div className={`p-3.5 rounded-xl border-2 flex flex-col justify-between ${
                        streamlinesTheme === 'light' ? 'bg-white border-amber-500 text-stone-950 shadow-sm' : 'bg-slate-900 border-amber-400 text-white shadow-sm'
                      }`}>
                        <div>
                          <div className={`text-xs uppercase tracking-wider font-black flex items-center gap-1.5 font-sans ${
                            streamlinesTheme === 'light' ? 'text-stone-950' : 'text-amber-300'
                          }`}>
                            <Thermometer className={`w-4 h-4 ${streamlinesTheme === 'light' ? 'text-amber-700' : 'text-amber-400'}`} />
                            Hold Microclimate &amp; Temp
                          </div>
                          <div className={`font-serif font-black text-xl sm:text-2xl mt-1 tracking-tight ${
                            streamlinesTheme === 'light' ? 'text-stone-950' : 'text-white'
                          }`}>{activeHydroMetrics.tastCorrelations.holdTemperature}</div>
                        </div>
                        <div className={`text-xs font-bold mt-1.5 font-sans leading-relaxed ${
                          streamlinesTheme === 'light' ? 'text-stone-900' : 'text-slate-200'
                        }`}>Severe below-deck thermal stress</div>
                      </div>

                      {/* 3. Middle Passage Mortality Rate (Full Text Visible, No Truncation) */}
                      <div className={`p-3.5 rounded-xl border-2 flex flex-col justify-between ${
                        streamlinesTheme === 'light' ? 'bg-white border-rose-500 text-stone-950 shadow-sm' : 'bg-slate-900 border-rose-400 text-white shadow-sm'
                      }`}>
                        <div>
                          <div className={`text-xs uppercase tracking-wider font-black flex items-center gap-1.5 font-sans ${
                            streamlinesTheme === 'light' ? 'text-stone-950' : 'text-rose-300'
                          }`}>
                            <Skull className={`w-4 h-4 ${streamlinesTheme === 'light' ? 'text-rose-700' : 'text-rose-400'}`} />
                            Middle Passage Mortality Rate
                          </div>
                          <div className={`font-serif font-black text-xl sm:text-2xl mt-1 tracking-tight ${
                            streamlinesTheme === 'light' ? 'text-stone-950' : 'text-white'
                          }`}>{activeHydroMetrics.tastCorrelations.mortalityRate}</div>
                        </div>
                        <div className={`text-xs font-bold mt-1.5 font-sans leading-relaxed ${
                          streamlinesTheme === 'light' ? 'text-stone-900' : 'text-slate-200'
                        }`}>Share of departures: {activeHydroMetrics.tastCorrelations.departureShare}</div>
                      </div>

                      {/* 4. Epidemiological Determinism (Full Text Visible, No Clipping) */}
                      <div className={`p-3.5 rounded-xl border-2 flex flex-col justify-between ${
                        streamlinesTheme === 'light' ? 'bg-white border-stone-400 text-stone-950 shadow-sm' : 'bg-slate-900 border-slate-600 text-white shadow-sm'
                      }`}>
                        <div>
                          <div className={`text-xs uppercase tracking-wider font-black flex items-center gap-1.5 font-sans ${
                            streamlinesTheme === 'light' ? 'text-stone-950' : 'text-cyan-300'
                          }`}>
                            <Info className={`w-4 h-4 ${streamlinesTheme === 'light' ? 'text-cyan-700' : 'text-cyan-400'}`} />
                            Epidemiological Determinism
                          </div>
                        </div>
                        <p className={`text-xs leading-relaxed mt-1.5 font-sans font-semibold ${
                          streamlinesTheme === 'light' ? 'text-stone-950' : 'text-slate-100'
                        }`}>
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
                    className={`overflow-hidden pt-2.5 border-t text-xs font-sans ${streamlinesTheme === 'light' ? 'border-stone-300' : 'border-slate-800'}`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
                      {/* Corridor 1 */}
                      <div className={`p-4 rounded-xl border-2 flex flex-col justify-between ${
                        streamlinesTheme === 'light' ? 'bg-white border-cyan-500 text-stone-950 shadow-sm' : 'bg-slate-900 border-cyan-400 text-white shadow-sm'
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-xs font-sans uppercase font-black tracking-wide ${
                            streamlinesTheme === 'light' ? 'text-stone-950' : 'text-cyan-300'
                          }`}>Senegambia ➔ Caribbean</span>
                          <span className={`text-2xl sm:text-3xl font-serif font-black leading-none shrink-0 ${
                            streamlinesTheme === 'light' ? 'text-stone-400' : 'text-slate-500'
                          }`}>01</span>
                        </div>
                        <div className={`text-3xl sm:text-4xl font-serif font-black my-2 tracking-tight ${
                          streamlinesTheme === 'light' ? 'text-cyan-950' : 'text-cyan-200'
                        }`}>
                          {activeSeason.transatlanticPassageDurationDays.senegambiaToCaribbean} <span className={`text-xs font-sans font-black uppercase tracking-wider ${
                            streamlinesTheme === 'light' ? 'text-stone-700' : 'text-cyan-400'
                          }`}>days transit</span>
                        </div>
                        <div className={`text-xs font-sans font-bold pt-1.5 border-t ${
                          streamlinesTheme === 'light' ? 'border-stone-200 text-stone-900' : 'border-slate-800 text-slate-200'
                        }`}>Canary Current + NE Trades</div>
                      </div>

                      {/* Corridor 2 */}
                      <div className={`p-4 rounded-xl border-2 flex flex-col justify-between ${
                        streamlinesTheme === 'light' ? 'bg-white border-amber-500 text-stone-950 shadow-sm' : 'bg-slate-900 border-amber-400 text-white shadow-sm'
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-xs font-sans uppercase font-black tracking-wide ${
                            streamlinesTheme === 'light' ? 'text-stone-950' : 'text-amber-300'
                          }`}>Benin ➔ Bahia</span>
                          <span className={`text-2xl sm:text-3xl font-serif font-black leading-none shrink-0 ${
                            streamlinesTheme === 'light' ? 'text-stone-400' : 'text-slate-500'
                          }`}>02</span>
                        </div>
                        <div className={`text-3xl sm:text-4xl font-serif font-black my-2 tracking-tight ${
                          streamlinesTheme === 'light' ? 'text-amber-950' : 'text-amber-200'
                        }`}>
                          {activeSeason.transatlanticPassageDurationDays.bightOfBeninToBahia} <span className={`text-xs font-sans font-black uppercase tracking-wider ${
                            streamlinesTheme === 'light' ? 'text-stone-700' : 'text-amber-400'
                          }`}>days transit</span>
                        </div>
                        <div className={`text-xs font-sans font-bold pt-1.5 border-t ${
                          streamlinesTheme === 'light' ? 'border-stone-200 text-stone-900' : 'border-slate-800 text-slate-200'
                        }`}>Equatorial Flow Vector</div>
                      </div>

                      {/* Corridor 3 */}
                      <div className={`p-4 rounded-xl border-2 flex flex-col justify-between ${
                        streamlinesTheme === 'light' ? 'bg-white border-emerald-600 text-stone-950 shadow-sm' : 'bg-slate-900 border-emerald-400 text-white shadow-sm'
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-xs font-sans uppercase font-black tracking-wide ${
                            streamlinesTheme === 'light' ? 'text-stone-950' : 'text-emerald-300'
                          }`}>Angola ➔ Rio (Fastest)</span>
                          <span className={`text-2xl sm:text-3xl font-serif font-black leading-none shrink-0 ${
                            streamlinesTheme === 'light' ? 'text-stone-400' : 'text-slate-500'
                          }`}>03</span>
                        </div>
                        <div className={`text-3xl sm:text-4xl font-serif font-black my-2 tracking-tight ${
                          streamlinesTheme === 'light' ? 'text-emerald-950' : 'text-emerald-200'
                        }`}>
                          {activeSeason.transatlanticPassageDurationDays.angolaToRioDeJaneiro} <span className={`text-xs font-sans font-black uppercase tracking-wider ${
                            streamlinesTheme === 'light' ? 'text-stone-700' : 'text-emerald-400'
                          }`}>days transit</span>
                        </div>
                        <div className={`text-xs font-sans font-bold pt-1.5 border-t ${
                          streamlinesTheme === 'light' ? 'border-stone-200 text-stone-900' : 'border-slate-800 text-slate-200'
                        }`}>South Atlantic Gyre Conveyor</div>
                      </div>

                      {/* Corridor 4 */}
                      <div className={`p-4 rounded-xl border-2 flex flex-col justify-between ${
                        streamlinesTheme === 'light' ? 'bg-white border-rose-500 text-stone-950 shadow-sm' : 'bg-slate-900 border-rose-400 text-white shadow-sm'
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-xs font-sans uppercase font-black tracking-wide ${
                            streamlinesTheme === 'light' ? 'text-stone-950' : 'text-rose-300'
                          }`}>Mozambique ➔ Brazil</span>
                          <span className={`text-2xl sm:text-3xl font-serif font-black leading-none shrink-0 ${
                            streamlinesTheme === 'light' ? 'text-stone-400' : 'text-slate-500'
                          }`}>04</span>
                        </div>
                        <div className={`text-3xl sm:text-4xl font-serif font-black my-2 tracking-tight ${
                          streamlinesTheme === 'light' ? 'text-rose-950' : 'text-rose-200'
                        }`}>
                          {activeSeason.transatlanticPassageDurationDays.mozambiqueToBrazil} <span className={`text-xs font-sans font-black uppercase tracking-wider ${
                            streamlinesTheme === 'light' ? 'text-stone-700' : 'text-rose-400'
                          }`}>days transit</span>
                        </div>
                        <div className={`text-xs font-sans font-bold pt-1.5 border-t ${
                          streamlinesTheme === 'light' ? 'border-stone-200 text-stone-900' : 'border-slate-800 text-slate-200'
                        }`}>Indian Ocean Cape Rounding</div>
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
                    className={`overflow-hidden pt-2.5 border-t text-xs font-sans ${streamlinesTheme === 'light' ? 'border-stone-300' : 'border-slate-800'}`}
                  >
                    <div className={`p-4 rounded-xl border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 ${
                      streamlinesTheme === 'light' ? 'bg-white border-stone-400 text-stone-950 shadow-sm' : 'bg-slate-900 border-cyan-400 text-white shadow-sm'
                    }`}>
                      <div className="space-y-1">
                        <div className={`text-xs sm:text-sm uppercase font-black flex items-center gap-2 font-sans ${
                          streamlinesTheme === 'light' ? 'text-stone-950' : 'text-cyan-300'
                        }`}>
                          <Activity className={`w-4 h-4 ${streamlinesTheme === 'light' ? 'text-cyan-700' : 'text-cyan-400'}`} />
                          Prevailing Circulation Dynamics &amp; Hydrodynamic Determinism
                        </div>
                        <p className={`text-xs sm:text-sm leading-relaxed max-w-4xl font-semibold font-sans ${
                          streamlinesTheme === 'light' ? 'text-stone-950' : 'text-slate-100'
                        }`}>
                          {activeHydroMetrics.dominantVectorNote}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-black border-2 font-sans ${
                          streamlinesTheme === 'light' ? 'bg-stone-100 text-stone-950 border-stone-400 shadow-2xs' : 'bg-slate-800 text-cyan-200 border-cyan-500 shadow-xs'
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
                    className={`overflow-hidden pt-2.5 border-t text-xs font-sans ${streamlinesTheme === 'light' ? 'border-stone-300' : 'border-slate-800'}`}
                  >
                    <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3.5 rounded-xl border-2 ${
                      streamlinesTheme === 'light' ? 'bg-white border-stone-400 text-stone-950 shadow-sm' : 'bg-slate-900 border-slate-600 text-white shadow-sm'
                    }`}>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full border-2 ${streamlinesTheme === 'light' ? 'bg-white border-stone-900 shadow-sm' : 'bg-white border-slate-400 shadow-[0_0_8px_rgba(255,255,255,0.9)]'}`} />
                          <strong className={streamlinesTheme === 'light' ? "text-stone-950 font-black" : "text-white font-black"}>Trade Winds (White Arrows):</strong> 
                          <span className={streamlinesTheme === 'light' ? "text-stone-900 font-bold" : "text-slate-200 font-bold"}>Atmospheric Vectors</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full ${streamlinesTheme === 'light' ? 'bg-cyan-600' : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]'}`} />
                          <strong className={streamlinesTheme === 'light' ? "text-stone-950 font-black" : "text-white font-black"}>Cold Upwelling Swell:</strong> 
                          <span className={streamlinesTheme === 'light' ? "text-stone-900 font-bold" : "text-slate-200 font-bold"}>Canary &amp; Benguela (Swimming)</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full ${streamlinesTheme === 'light' ? 'bg-amber-600' : 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]'}`} />
                          <strong className={streamlinesTheme === 'light' ? "text-stone-950 font-black" : "text-white font-black"}>Warm Equatorial Currents:</strong> 
                          <span className={streamlinesTheme === 'light' ? "text-stone-900 font-bold" : "text-slate-200 font-bold"}>Guinea &amp; South Eq.</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-bold font-sans">
                        <span className={streamlinesTheme === 'light' ? "text-stone-900" : "text-slate-200"}>ITCZ: <strong className={streamlinesTheme === 'light' ? "text-cyan-950 font-black" : "text-cyan-300 font-black"}>{activeSeason.itczPosition}</strong></span>
                        <span>•</span>
                        <span className={streamlinesTheme === 'light' ? "text-stone-900" : "text-slate-200"}>Harmattan: <strong className={streamlinesTheme === 'light' ? "text-amber-950 font-black" : "text-amber-300 font-black"}>{activeSeason.harmattanIntensity}</strong></span>
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
            speedMultiplier={speedMultiplier}
            particleDensity={particleDensity}
            theme={streamlinesTheme}
            className="w-full h-full flex-1"
            onTelemetryChange={handleTelemetryChange}
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
