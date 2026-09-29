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
  Globe2
} from 'lucide-react';

type CartographyWorkbenchTab = 'curtain' | 'streamlines' | 'kingdoms';

export const ArchivalCartographyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CartographyWorkbenchTab>('curtain');
  const [selectedPlate, setSelectedPlate] = useState<HistoricalMapPlate>(HISTORICAL_MAP_PLATES[0]);
  const [activeSeasonId, setActiveSeasonId] = useState<'q1' | 'q2' | 'q3' | 'q4'>('q1');
  const [showCurrents, setShowCurrents] = useState<boolean>(true);
  const [showWinds, setShowWinds] = useState<boolean>(true);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);

  const activeSeason = SEASONAL_WIND_REGIMES.find(s => s.id === activeSeasonId) || SEASONAL_WIND_REGIMES[0];

  const handleCopyCitation = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCitation(id);
      setTimeout(() => setCopiedCitation(null), 2500);
    } catch {}
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] min-h-[640px] flex flex-col relative overflow-hidden bg-[#FAF8F5] dark:bg-stone-950 select-none">
      
      {/* =========================================================================
          TAB 1: IMMERSIVE FULL-BLEED GEOREREFERENCED MAP CURTAIN VIEWER
          ========================================================================= */}
      {activeTab === 'curtain' && (
        <HistoricalMapCurtainViewer
          selectedPlate={selectedPlate}
          onSelectPlate={setSelectedPlate}
          activeWorkbenchTab={activeTab}
          onSelectWorkbenchTab={setActiveTab}
        />
      )}

      {/* =========================================================================
          TAB 2: SEASONAL OCEANIC STREAMLINES & TRADE WIND BELTS WORKBENCH
          ========================================================================= */}
      {activeTab === 'streamlines' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Top Fixed Header Control Bar (Unified across all views) */}
          <div className="fixed top-[72px] sm:top-[76px] left-1/2 -translate-x-1/2 z-30 pointer-events-none flex justify-center w-max max-w-[calc(100vw-24px)] sm:max-w-[calc(100vw-48px)]">
            <motion.div 
              layout
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto flex items-center flex-wrap gap-1 sm:gap-1.5 p-1.5 rounded-2xl bg-[#FAF7F2]/95 dark:bg-[#1E1B18]/95 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_8px_30px_rgba(75,55,35,0.14)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl text-xs no-drag select-none"
            >
              {/* Workbench Tab Switcher */}
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
                  <span>Kingdoms</span>
                </button>
              </div>

              <div className="w-[1px] h-4 bg-[#E5DDD0] dark:bg-[#38322B] shrink-0 mx-0.5" />

              {/* Quarter Selector Pills */}
              <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B] text-[10px] font-mono">
                {SEASONAL_WIND_REGIMES.map(regime => (
                  <button
                    key={regime.id}
                    onClick={() => setActiveSeasonId(regime.id)}
                    className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                      activeSeasonId === regime.id
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                    }`}
                  >
                    {regime.months.split(' ')[0]}
                  </button>
                ))}
              </div>

              <div className="w-[1px] h-4 bg-[#E5DDD0] dark:bg-[#38322B] shrink-0 mx-0.5" />

              {/* Vector Layer Toggles */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowCurrents(v => !v)}
                  className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                    showCurrents
                      ? 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/40 shadow-xs'
                      : 'bg-black/5 dark:bg-white/5 text-stone-500 border-transparent opacity-60 line-through'
                  }`}
                  title="Toggle Ocean Currents Particles"
                >
                  <Waves className="w-3 h-3 text-cyan-600" />
                  <span>Currents</span>
                </button>

                <button
                  onClick={() => setShowWinds(v => !v)}
                  className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                    showWinds
                      ? 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/40 shadow-xs'
                      : 'bg-black/5 dark:bg-white/5 text-stone-500 border-transparent opacity-60 line-through'
                  }`}
                  title="Toggle Trade Wind Belts"
                >
                  <Wind className="w-3 h-3 text-cyan-600" />
                  <span>Trade Winds</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Seasonal Switcher Header Card */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm text-left">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-700 dark:text-cyan-400 tracking-wider">
                Seasonal Maritime Hydrodynamics &amp; Navigation GIS
              </span>
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                {activeSeason.seasonName}
              </h2>
            </div>

            <div className="text-xs font-mono text-stone-500 dark:text-stone-400">
              Active Months: <strong className="text-cyan-800 dark:text-cyan-300">{activeSeason.months}</strong>
            </div>
          </div>

          {/* Interactive Hydrodynamic Particle Canvas */}
          <div className="relative rounded-3xl overflow-hidden border border-stone-300 dark:border-stone-800 shadow-md">
            <OceanCurrentParticleCanvas
              activeSeasonId={activeSeasonId}
              showCurrents={showCurrents}
              showWinds={showWinds}
              particleDensity="medium"
            />
          </div>

          {/* Seasonal Transit Duration & Mortality Analysis Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">Senegambia → Caribbean</span>
              <p className="text-2xl font-serif font-black text-stone-900 dark:text-stone-100">
                {activeSeason.transatlanticPassageDurationDays.senegambiaToCaribbean} <span className="text-xs font-mono font-normal">days</span>
              </p>
              <p className="text-[11px] font-serif text-stone-500">Canary Current + NE Trade Winds</p>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">Bight of Benin → Bahia</span>
              <p className="text-2xl font-serif font-black text-stone-900 dark:text-stone-100">
                {activeSeason.transatlanticPassageDurationDays.bightOfBeninToBahia} <span className="text-xs font-mono font-normal">days</span>
              </p>
              <p className="text-[11px] font-serif text-stone-500">Guinea Current + Equatorial conveyor</p>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">Angola (Luanda) → Rio de Janeiro</span>
              <p className="text-2xl font-serif font-black text-emerald-700 dark:text-emerald-400">
                {activeSeason.transatlanticPassageDurationDays.angolaToRioDeJaneiro} <span className="text-xs font-mono font-normal">days</span>
              </p>
              <p className="text-[11px] font-serif text-stone-500">Benguela Current + SE Trade Winds (Fastest)</p>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">Mozambique → Brazil</span>
              <p className="text-2xl font-serif font-black text-amber-700 dark:text-amber-400">
                {activeSeason.transatlanticPassageDurationDays.mozambiqueToBrazil} <span className="text-xs font-mono font-normal">days</span>
              </p>
              <p className="text-[11px] font-serif text-stone-500">Cape Agulhas rounded into South Atlantic</p>
            </div>
          </div>

          {/* Deep Oceanographic Commentary */}
          <div className="p-6 rounded-3xl bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3 text-left shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-cyan-800 dark:text-cyan-400">
              <Anchor className="w-4 h-4" />
              <span>Hydrodynamic Determinism &amp; Captive Mortality Gradients</span>
            </div>
            <p className="text-sm font-serif leading-relaxed text-stone-800 dark:text-stone-200">
              {activeSeason.mortalityImpactNote}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-500 dark:text-stone-400 pt-1">
              <span>ITCZ Position: <strong>{activeSeason.itczPosition}</strong></span>
              <span>•</span>
              <span>Harmattan Dust Intensity: <strong>{activeSeason.harmattanIntensity}</strong></span>
              <span>•</span>
              <span>Trade Wind Behavior: <strong>{activeSeason.tradeWindsBehavior}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PRE-COLONIAL KINGDOMS & POLITIES MATRIX WORKBENCH
          ========================================================================= */}
      {activeTab === 'kingdoms' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 space-y-6 max-w-7xl mx-auto w-full">
          
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

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('curtain');
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-[11px] font-sans font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Locate on Georeferenced Curtain</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
