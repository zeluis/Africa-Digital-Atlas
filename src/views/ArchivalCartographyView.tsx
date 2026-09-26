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
    <div className="space-y-8 pb-16">
      {/* Editorial Hero Banner */}
      <div className="relative -mx-4 sm:-mx-6 md:-mx-8 border-y border-stone-200/90 dark:border-stone-800/90 bg-[#FAF8F5] dark:bg-stone-950 overflow-hidden min-h-[320px] flex items-center transition-colors duration-500">
        {/* Archival Decorative Background */}
        <div className="absolute inset-0 z-0 opacity-15 dark:opacity-10 pointer-events-none overflow-hidden">
          <AntiquePlateCanvas plate={selectedPlate} isThumbnail={false} className="w-full h-full object-cover filter blur-[1px]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/92 to-transparent dark:from-stone-950 dark:via-stone-950/92 dark:to-transparent w-full md:w-3/4 pointer-events-none" />

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 py-10 space-y-4 max-w-4xl text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/10 dark:bg-amber-400/10 border border-amber-900/15 dark:border-amber-400/20 text-amber-900 dark:text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Historical Cartography &amp; Hydrodynamics GIS</span>
            </span>
            <span className="text-xs font-mono text-stone-500">17th – 18th Century Plates</span>
          </div>

          <h1 className="type-headline-lg font-serif-display font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Archival Cartography &amp; <span className="text-amber-900 dark:text-amber-400 italic">Oceanic Streamlines</span>
          </h1>

          <p className="type-body-archival font-serif-book text-stone-800 dark:text-stone-200 leading-relaxed max-w-3xl">
            Contrast Enlightenment copperplates with modern 2026 sovereign borders using interactive split-curtain faders and alpha opacity layers. Explore pre-colonial state formations and analyze real-time hydrodynamic vectors governing transatlantic navigation.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-600 dark:text-stone-400 pt-1">
            <span className="flex items-center gap-1.5">
              <MapIcon className="w-4 h-4 text-amber-800 dark:text-amber-400" />
              <span>10 Curated Full-Continent Master Plates</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
              <span>Seasonal Vector Particle Engine</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-700 dark:text-purple-400" />
              <span>{PRE_COLONIAL_ENTITIES.length} Pre-Colonial Empires</span>
            </span>
          </div>
        </div>
      </div>

      {/* Primary Workbench Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('curtain')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'curtain'
                ? 'bg-amber-900 text-amber-100 dark:bg-amber-500/20 dark:text-amber-300 dark:border dark:border-amber-500/40 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Georeferenced Map Curtain</span>
          </button>

          <button
            onClick={() => setActiveTab('streamlines')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'streamlines'
                ? 'bg-cyan-950 text-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border dark:border-cyan-500/40 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
            }`}
          >
            <Wind className="w-4 h-4 text-cyan-500" />
            <span>Seasonal Oceanic Streamlines</span>
          </button>

          <button
            onClick={() => setActiveTab('kingdoms')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'kingdoms'
                ? 'bg-purple-950 text-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border dark:border-purple-500/40 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
            }`}
          >
            <Compass className="w-4 h-4 text-purple-500" />
            <span>Pre-Colonial Kingdoms Matrix</span>
          </button>
        </div>

        {activeTab === 'curtain' && (
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400 hidden md:inline">
            Active: <strong className="text-stone-800 dark:text-stone-200">{selectedPlate.title} ({selectedPlate.year})</strong>
          </span>
        )}
      </div>

      {/* TAB 1: Georeferenced Map Curtain & Opacity Overlay */}
      {activeTab === 'curtain' && (
        <div className="space-y-6">
          {/* Plate Selector Carousel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {HISTORICAL_MAP_PLATES.map(plate => {
              const isSelected = selectedPlate.id === plate.id;
              return (
                <button
                  key={plate.id}
                  onClick={() => setSelectedPlate(plate)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                      <AntiquePlateCanvas
                        plate={plate}
                        isThumbnail={true}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1.5 right-1.5 z-10 px-2 py-0.5 rounded-md bg-stone-900/90 text-amber-300 font-mono text-[9px] font-bold border border-amber-500/30">
                        {plate.year}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                        {plate.title}
                      </h4>
                      <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
                        {plate.cartographer}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 mt-2 flex items-center gap-1 font-semibold">
                    <span>{isSelected ? 'Loaded in Viewport' : 'Inspect Plate'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Curtain Canvas Component */}
          <HistoricalMapCurtainViewer selectedPlate={selectedPlate} />

          {/* Archival Plate Scholarly Dossier */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400">
                  Cartographic Dossier &amp; Provenance
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {selectedPlate.title} ({selectedPlate.year})
                </h3>
                <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
                  Cartographer: {selectedPlate.cartographer} • {selectedPlate.century} • {selectedPlate.institution}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    handleCopyCitation(
                      `${selectedPlate.cartographer} (${selectedPlate.year}). "${selectedPlate.title}." ${selectedPlate.source}. Preserved at ${selectedPlate.institution}.`,
                      selectedPlate.id
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
                >
                  {copiedCitation === selectedPlate.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Citation Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Citation</span>
                    </>
                  )}
                </button>

                <a
                  href={selectedPlate.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
                  title="Open High-Resolution Plate Scan"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase font-bold text-stone-500 dark:text-stone-400">
                  Historical &amp; Epistemological Significance
                </h4>
                <p className="text-xs sm:text-sm font-serif leading-relaxed text-stone-800 dark:text-stone-200">
                  {selectedPlate.description}
                </p>
                <p className="text-xs sm:text-sm font-serif leading-relaxed text-stone-800 dark:text-stone-200 pt-1">
                  <strong>Scholarly Takeaway:</strong> {selectedPlate.historicalSignificance}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase font-bold text-stone-500 dark:text-stone-400">
                  Toponyms &amp; Historic Regions to Observe
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPlate.toponymsToObserve.map((toponym, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono font-medium text-stone-800 dark:text-stone-200"
                    >
                      {toponym}
                    </span>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-xs font-serif text-stone-700 dark:text-stone-300">
                  <strong>Bibliographical Citation:</strong> <em>{selectedPlate.source}</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Seasonal Oceanic Streamlines & Trade Wind Belts */}
      {activeTab === 'streamlines' && (
        <div className="space-y-6">
          {/* Seasonal Switcher Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-700 dark:text-cyan-400">
                Seasonal Maritime Regime Selector
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                {activeSeason.seasonName}
              </h3>
            </div>

            {/* Quarter Selector Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-mono">
              {SEASONAL_WIND_REGIMES.map(regime => (
                <button
                  key={regime.id}
                  onClick={() => setActiveSeasonId(regime.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeSeasonId === regime.id
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  {regime.months}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Hydrodynamic Particle Canvas */}
          <div className="relative">
            <OceanCurrentParticleCanvas
              activeSeasonId={activeSeasonId}
              showCurrents={showCurrents}
              showWinds={showWinds}
              particleDensity="medium"
            />
          </div>

          {/* Seasonal Transit Duration & Mortality Analysis Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">Senegambia → Caribbean</span>
              <p className="text-2xl font-serif font-black text-stone-900 dark:text-stone-100">
                {activeSeason.transatlanticPassageDurationDays.senegambiaToCaribbean} <span className="text-xs font-mono font-normal">days</span>
              </p>
              <p className="text-[11px] font-serif text-stone-500">Canary Current + NE Trade Winds</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">Bight of Benin → Bahia</span>
              <p className="text-2xl font-serif font-black text-stone-900 dark:text-stone-100">
                {activeSeason.transatlanticPassageDurationDays.bightOfBeninToBahia} <span className="text-xs font-mono font-normal">days</span>
              </p>
              <p className="text-[11px] font-serif text-stone-500">Guinea Current + Equatorial conveyor</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">Angola (Luanda) → Rio de Janeiro</span>
              <p className="text-2xl font-serif font-black text-emerald-700 dark:text-emerald-400">
                {activeSeason.transatlanticPassageDurationDays.angolaToRioDeJaneiro} <span className="text-xs font-mono font-normal">days</span>
              </p>
              <p className="text-[11px] font-serif text-stone-500">Benguela Current + SE Trade Winds (Fastest)</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">Mozambique → Brazil</span>
              <p className="text-2xl font-serif font-black text-amber-700 dark:text-amber-400">
                {activeSeason.transatlanticPassageDurationDays.mozambiqueToBrazil} <span className="text-xs font-mono font-normal">days</span>
              </p>
              <p className="text-[11px] font-serif text-stone-500">Cape Agulhas rounded into South Atlantic</p>
            </div>
          </div>

          {/* Deep Oceanographic Commentary */}
          <div className="p-6 rounded-3xl bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3 text-left">
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

      {/* TAB 3: Pre-Colonial Kingdoms Matrix */}
      {activeTab === 'kingdoms' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-purple-700 dark:text-purple-400">
                Pre-Colonial State Formations &amp; Polities Matrix
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                Authoritative Civilizations ({PRE_COLONIAL_ENTITIES.length} Historical Kingdoms)
              </h3>
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
                  {/* Rich Background Colored Pill Badges & Date */}
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
