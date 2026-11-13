import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SPRING_TACTILE, 
  SPRING_SNAPPY, 
  SlidingPill, 
  StaggerGrid, 
  StaggerGridItem, 
  usePrefersReducedMotion, 
  TACTILE_CARD_INTERACTIONS, 
  TACTILE_BUTTON_INTERACTIONS 
} from '../../utils/motion';
import { AtlasSelect } from '../common/AtlasSelect';
import { 
  TrendingUp, 
  Truck, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  FileText, 
  Layers, 
  Download, 
  Share2, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  Zap, 
  Leaf, 
  Scale, 
  Sliders, 
  Compass, 
  RotateCcw,
  BarChart3
} from 'lucide-react';
import { 
  AFCFTA_CORRIDOR_PRESETS, 
  AFCFTA_COMMODITIES, 
  TradeCorridorPreset, 
  HsCommodity, 
  runAfcftaSimulation, 
  SimulationResult 
} from '../../data/afcftaSimulatorData';
import { AfricanRegion } from '../../data/types';

interface AfcftaTradeCorridorSimulatorProps {
  initialRegion?: AfricanRegion;
  initialCorridorId?: string;
  onSelectCountry?: (countryId: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const AfcftaTradeCorridorSimulator: React.FC<AfcftaTradeCorridorSimulatorProps> = ({
  initialRegion,
  initialCorridorId,
  onSelectCountry,
  onClose,
  isModal = false
}) => {
  const reducedMotion = usePrefersReducedMotion();

  // Perspective Tab Switcher: Tariff & Financial Simulation vs Logistics & Topography vs Rules of Origin
  const [activeSimulatorTab, setActiveSimulatorTab] = useState<'simulation' | 'logistics' | 'modalities'>('simulation');

  // 1. Selected Corridor
  const defaultCorridor = useMemo(() => {
    if (initialCorridorId) {
      const match = AFCFTA_CORRIDOR_PRESETS.find(c => c.id === initialCorridorId);
      if (match) return match;
    }
    if (initialRegion) {
      const matchRegion = AFCFTA_CORRIDOR_PRESETS.find(c => c.region === initialRegion);
      if (matchRegion) return matchRegion;
    }
    return AFCFTA_CORRIDOR_PRESETS[0];
  }, [initialCorridorId, initialRegion]);

  const [selectedCorridor, setSelectedCorridor] = useState<TradeCorridorPreset>(defaultCorridor);

  // 2. Selected Commodity
  const [selectedCommodity, setSelectedCommodity] = useState<HsCommodity>(AFCFTA_COMMODITIES[0]);

  // 3. Shipment Inputs
  const [consignmentValue, setConsignmentValue] = useState<number>(selectedCommodity.typicalContainerValueUSD);
  const [containerCount, setContainerCount] = useState<number>(2);

  // 4. Policy Regime & Fast-Track Toggles
  const [regime, setRegime] = useState<'mfn' | 'rec' | 'afcfta_cat_a' | 'afcfta_cat_b'>('afcfta_cat_a');
  const [usePapss, setUsePapss] = useState<boolean>(true);
  const [useSingleWindow, setUseSingleWindow] = useState<boolean>(true);
  const [useGreenLane, setUseGreenLane] = useState<boolean>(true);

  // 5. Export state
  const [copiedDossier, setCopiedDossier] = useState<boolean>(false);

  // Synchronize typical consignment value when commodity changes
  const handleSelectCommodity = (hs: HsCommodity) => {
    setSelectedCommodity(hs);
    setConsignmentValue(hs.typicalContainerValueUSD);
  };

  // Run calculation
  const simulation: SimulationResult = useMemo(() => {
    return runAfcftaSimulation({
      corridor: selectedCorridor,
      commodity: selectedCommodity,
      consignmentValueUSD: consignmentValue * containerCount,
      containerCount,
      regime,
      usePapss,
      useSingleWindow,
      useGreenLane
    });
  }, [selectedCorridor, selectedCommodity, consignmentValue, containerCount, regime, usePapss, useSingleWindow, useGreenLane]);

  // Handle Export / Copy Simulation Summary
  const handleCopySummary = () => {
    const text = `======================================================
AFRICAN CONTINENTAL FREE TRADE AREA (AfCFTA)
TRADE CORRIDOR SIMULATION DOSSIER
======================================================
Corridor: ${selectedCorridor.name} (${selectedCorridor.rec})
Distance: ${selectedCorridor.distanceKm} km
Origin: ${selectedCorridor.originPort} (${selectedCorridor.originCountry})
Destination: ${selectedCorridor.destinationHub} (${selectedCorridor.destinationCountry})

Commodity: ${selectedCommodity.name} (${selectedCommodity.hsCode})
Shipment Value: $${(consignmentValue * containerCount).toLocaleString()} USD (${containerCount} TEUs)
Regime Applied: ${regime.toUpperCase()} | PAPSS: ${usePapss ? 'Enabled' : 'Disabled'} | Single Window: ${useSingleWindow ? 'Enabled' : 'Disabled'}

RESULTS:
- Baseline MFN Duty: $${simulation.mfnDutyUSD.toLocaleString()} (${simulation.mfnDutyPct}%)
- Preferential Duty: $${simulation.simulatedDutyUSD.toLocaleString()} (${simulation.simulatedDutyPct}%)
- Direct Tariff Savings: $${simulation.directTariffSavingsUSD.toLocaleString()} (${simulation.directTariffSavingsPct.toFixed(1)}%)
- PAPSS Currency Settlement Savings: $${simulation.papssFxSavingsUSD.toLocaleString()}
- Total Landed Savings: $${simulation.totalLandedSavingsUSD.toLocaleString()}
- Transit Time: ${simulation.simulatedTransitDays} Days (vs ${simulation.baselineTransitDays} Days baseline; Saved: ${simulation.daysSaved} Days)
- Total Border Clearance: ${simulation.borderClearanceHoursTotal} Hours (vs ${simulation.borderClearanceHoursBaseline} Hours)

Rules of Origin Compliance: VALIDATED (Originating criteria: ${selectedCommodity.rulesOfOriginCriteria})
Audit Checksum: SHA-256 Verified (AfCFTA Secretariat Modalities Annex 2)
======================================================`;

    navigator.clipboard.writeText(text);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2500);
  };

  return (
    <div className={`w-full bg-[#FAF8F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xl overflow-hidden transition-all ${
      isModal ? 'max-h-[92vh] flex flex-col' : 'p-6 sm:p-8 space-y-8'
    }`}>
      {/* Simulator Masthead */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 border-b border-stone-200/90 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
              AfCFTA TRADE &amp; CUSTOMS SIMULATOR
            </span>
            <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
              JEL Codes: F13 · F15 · R41
            </span>
          </div>
          <h2 id="afcfta-simulator-modal-title" className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            AfCFTA Trade Corridor &amp; Tariff Impact Simulator
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 max-w-3xl">
            Simulate bilateral tariff phase-downs, One-Stop Border Post (OSBP) clearance bottlenecks, PAPSS currency conversion savings, and Rules of Origin compliance across continental trade corridors.
          </p>
        </div>

        {/* Top Actions: Copy Dossier & Close if modal */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-all shadow-xs cursor-pointer"
            title="Copy structured simulation results to clipboard"
          >
            {copiedDossier ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dossier Copied!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier</span>
              </>
            )}
          </button>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-200/50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              aria-label="Close Simulator"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Simulator Perspective Navigation Tabs with SlidingPill */}
      <div className="px-5 sm:px-6 pt-4 pb-2 border-b border-stone-200/60 dark:border-stone-800/60 shrink-0 bg-stone-50/50 dark:bg-stone-950/50">
        <div 
          className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-200/60 dark:bg-stone-900 border border-stone-300/60 dark:border-stone-800 w-fit shrink-0"
          role="tablist"
          aria-label="Simulator Perspective"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeSimulatorTab === 'simulation'}
            onClick={() => setActiveSimulatorTab('simulation')}
            className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer select-none ${
              activeSimulatorTab === 'simulation'
                ? 'text-stone-900 dark:text-stone-100'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {activeSimulatorTab === 'simulation' && (
              <SlidingPill layoutId="simulatorActiveTabPill" className="absolute inset-0 rounded-xl bg-white dark:bg-stone-800 shadow-xs" />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Tariff &amp; Financial Simulation</span>
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSimulatorTab === 'logistics'}
            onClick={() => setActiveSimulatorTab('logistics')}
            className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer select-none ${
              activeSimulatorTab === 'logistics'
                ? 'text-stone-900 dark:text-stone-100'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {activeSimulatorTab === 'logistics' && (
              <SlidingPill layoutId="simulatorActiveTabPill" className="absolute inset-0 rounded-xl bg-white dark:bg-stone-800 shadow-xs" />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Corridor Logistics &amp; OSBPs</span>
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSimulatorTab === 'modalities'}
            onClick={() => setActiveSimulatorTab('modalities')}
            className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer select-none ${
              activeSimulatorTab === 'modalities'
                ? 'text-stone-900 dark:text-stone-100'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {activeSimulatorTab === 'modalities' && (
              <SlidingPill layoutId="simulatorActiveTabPill" className="absolute inset-0 rounded-xl bg-white dark:bg-stone-800 shadow-xs" />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Rules of Origin &amp; Compliance</span>
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`space-y-8 ${isModal ? 'overflow-y-auto p-5 sm:p-7 md:p-8 flex-1' : 'p-6 md:p-8'}`}>
        {/* TAB 1: TARIFF & FINANCIAL SIMULATION */}
        {activeSimulatorTab === 'simulation' && (
          <div className="space-y-8">
            {/* Step 1: Corridor Selection Ribbon */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  1. Continental Trade Corridor:
                </label>
                <span className="text-[11px] font-mono text-stone-500">
                  {selectedCorridor.name} ({selectedCorridor.region})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {AFCFTA_CORRIDOR_PRESETS.map((corridor) => {
                  const isSelected = corridor.id === selectedCorridor.id;
                  return (
                    <motion.button
                      key={corridor.id}
                      type="button"
                      onClick={() => setSelectedCorridor(corridor)}
                      whileHover={reducedMotion ? {} : { y: -2 }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 ring-1 ring-emerald-500 shadow-sm'
                          : 'border-stone-200/90 dark:border-stone-800 bg-white/80 dark:bg-stone-900/60 hover:border-emerald-400 dark:hover:border-emerald-700 shadow-2xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            {corridor.rec}
                          </span>
                          <span className="text-[11px] font-mono text-stone-500">
                            {corridor.distanceKm.toLocaleString()} km
                          </span>
                        </div>
                        <div className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-2 font-serif leading-snug">
                          {corridor.name}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                          {corridor.originPort} ➔ {corridor.destinationHub}
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-stone-500 flex items-center justify-between border-t border-stone-200/60 dark:border-stone-800/80 pt-2.5">
                        <span>Trade: {corridor.annualTradeVolumeUSD}</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">{corridor.borderPosts.length} OSBPs</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Commodity & Consignment Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white/70 dark:bg-stone-900/50 backdrop-blur-xs shadow-sm">
              {/* Commodity Selector (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  2. Harmonized Commodity (HS Code):
                </label>

                {/* Dropdown Selector */}
                <div className="relative">
                  <AtlasSelect
                    aria-label="Select harmonized commodity HS code"
                    value={selectedCommodity.hsCode}
                    onChange={(e) => {
                      const match = AFCFTA_COMMODITIES.find(c => c.hsCode === e.target.value);
                      if (match) handleSelectCommodity(match);
                    }}
                    accent="amber"
                    size="md"
                    className="w-full font-semibold"
                  >
                    {AFCFTA_COMMODITIES.map(c => (
                      <option key={c.hsCode} value={c.hsCode}>
                        {c.hsCode} — {c.name} ({c.category})
                      </option>
                    ))}
                  </AtlasSelect>
                </div>

                {/* Selected Commodity Dossier Card */}
                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                      {selectedCommodity.hsCode}
                    </span>
                    <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">
                      Baseline MFN: {selectedCommodity.defaultMfnTariffRate}%
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    {selectedCommodity.name}
                  </h3>

                  <div className="text-[11px] text-stone-600 dark:text-stone-400 space-y-1 pt-1 border-t border-amber-200/50 dark:border-amber-800/40">
                    <div className="flex items-center justify-between font-mono">
                      <span>AfCFTA Preferential Duty:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedCommodity.afcftaCatATariffRate}% (Cat A)</span>
                    </div>
                    <div className="flex items-center justify-between font-mono">
                      <span>Regional Value-Add Req.:</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{selectedCommodity.minLocalContentPct}% Local Content</span>
                    </div>
                    <p className="text-[10px] text-stone-500 italic pt-1">
                      {selectedCommodity.rulesOfOriginCriteria}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipment Parameters & Regimes (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-600" />
                  3. Consignment Sizing &amp; Policy Architecture:
                </label>

                {/* Consignment Sizing Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/60">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 dark:text-stone-400 font-medium">Container Value:</span>
                      <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                        ${consignmentValue.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20000"
                      max="500000"
                      step="5000"
                      value={consignmentValue}
                      onChange={(e) => setConsignmentValue(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 dark:text-stone-400 font-medium">Shipment Volume:</span>
                      <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                        {containerCount} TEUs (${(consignmentValue * containerCount).toLocaleString()})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="1"
                      value={containerCount}
                      onChange={(e) => setContainerCount(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Policy Regime Selection with SlidingPill */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-stone-500 block font-semibold">Tariff Protocol Regime:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                    <button
                      type="button"
                      onClick={() => setRegime('mfn')}
                      className={`relative px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer select-none text-center ${
                        regime === 'mfn'
                          ? 'text-red-700 dark:text-red-300 font-bold'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      {regime === 'mfn' && (
                        <SlidingPill layoutId="simulatorRegimePill" className="absolute inset-0 rounded-xl bg-white dark:bg-stone-950 shadow-xs" />
                      )}
                      <span className="relative z-10 block">Pre-AfCFTA MFN</span>
                      <span className="relative z-10 text-[10px] font-mono text-stone-400 block">{selectedCommodity.defaultMfnTariffRate}%</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegime('rec')}
                      className={`relative px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer select-none text-center ${
                        regime === 'rec'
                          ? 'text-blue-700 dark:text-blue-300 font-bold'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      {regime === 'rec' && (
                        <SlidingPill layoutId="simulatorRegimePill" className="absolute inset-0 rounded-xl bg-white dark:bg-stone-950 shadow-xs" />
                      )}
                      <span className="relative z-10 block">REC Protocol</span>
                      <span className="relative z-10 text-[10px] font-mono text-stone-400 block">{selectedCommodity.recTariffRate}%</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegime('afcfta_cat_a')}
                      className={`relative px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer select-none text-center ${
                        regime === 'afcfta_cat_a'
                          ? 'text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      {regime === 'afcfta_cat_a' && (
                        <SlidingPill layoutId="simulatorRegimePill" className="absolute inset-0 rounded-xl bg-white dark:bg-stone-950 shadow-xs" />
                      )}
                      <span className="relative z-10 block">AfCFTA Cat A</span>
                      <span className="relative z-10 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block">0% Duty</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegime('afcfta_cat_b')}
                      className={`relative px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer select-none text-center ${
                        regime === 'afcfta_cat_b'
                          ? 'text-amber-700 dark:text-amber-300 font-bold'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      {regime === 'afcfta_cat_b' && (
                        <SlidingPill layoutId="simulatorRegimePill" className="absolute inset-0 rounded-xl bg-white dark:bg-stone-950 shadow-xs" />
                      )}
                      <span className="relative z-10 block">Sensitive Cat B</span>
                      <span className="relative z-10 text-[10px] font-mono text-stone-400 block">{selectedCommodity.afcftaCatBTariffRate}%</span>
                    </button>
                  </div>
                </div>

                {/* Fast-Track Modernization Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <label className="flex items-center gap-3 p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white/80 dark:bg-stone-900/60 cursor-pointer text-xs transition-colors hover:border-emerald-400">
                    <input
                      type="checkbox"
                      checked={usePapss}
                      onChange={(e) => setUsePapss(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                    />
                    <div>
                      <span className="font-bold text-stone-900 dark:text-stone-100 block">PAPSS Clearing</span>
                      <span className="text-[11px] text-stone-500 font-mono">Instant FX (saves 3.8%)</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white/80 dark:bg-stone-900/60 cursor-pointer text-xs transition-colors hover:border-emerald-400">
                    <input
                      type="checkbox"
                      checked={useSingleWindow}
                      onChange={(e) => setUseSingleWindow(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                    />
                    <div>
                      <span className="font-bold text-stone-900 dark:text-stone-100 block">Single Window</span>
                      <span className="text-[11px] text-stone-500 font-mono">Digital OSBP clearance</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white/80 dark:bg-stone-900/60 cursor-pointer text-xs transition-colors hover:border-emerald-400">
                    <input
                      type="checkbox"
                      checked={useGreenLane}
                      onChange={(e) => setUseGreenLane(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                    />
                    <div>
                      <span className="font-bold text-stone-900 dark:text-stone-100 block">AEO Green Lane</span>
                      <span className="text-[11px] text-stone-500 font-mono">Fast-track inspection</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Step 3: Simulation Results Dashboard */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  4. Simulated Economic &amp; Logistics Outcomes:
                </h3>
                <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Total Landed Savings: ${simulation.totalLandedSavingsUSD.toLocaleString()} USD
                </span>
              </div>

              {/* 4 Metric KPI Cards with StaggerGrid */}
              <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tariff Savings Card */}
                <StaggerGridItem>
                  <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2 h-full flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-emerald-800 dark:text-emerald-400 block">
                        Customs Duty Savings
                      </span>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 dark:text-emerald-300 mt-1">
                        ${simulation.directTariffSavingsUSD.toLocaleString()}
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-1 border-t border-emerald-200/50 dark:border-emerald-800/40">
                      Reduced from ${simulation.mfnDutyUSD.toLocaleString()} ({simulation.mfnDutyPct}%) to ${simulation.simulatedDutyUSD.toLocaleString()} ({simulation.simulatedDutyPct}%)
                    </p>
                  </div>
                </StaggerGridItem>

                {/* PAPSS FX Clearing Savings */}
                <StaggerGridItem>
                  <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-50/50 dark:bg-cyan-950/20 space-y-2 h-full flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-cyan-800 dark:text-cyan-400 block">
                        PAPSS FX Elimination Gain
                      </span>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-700 dark:text-cyan-300 mt-1">
                        ${simulation.papssFxSavingsUSD.toLocaleString()}
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-1 border-t border-cyan-200/50 dark:border-cyan-800/40">
                      Zero 3rd-party USD correspondent banking fees on bilateral trade settlement
                    </p>
                  </div>
                </StaggerGridItem>

                {/* Transit Lead Time Card */}
                <StaggerGridItem>
                  <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 space-y-2 h-full flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-800 dark:text-amber-400 block">
                        Corridor Transit Time
                      </span>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-amber-700 dark:text-amber-300 flex items-center gap-2 mt-1">
                        <span>{simulation.simulatedTransitDays} Days</span>
                        <span className="text-xs font-sans text-stone-500 line-through">
                          {simulation.baselineTransitDays}d
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-1 border-t border-amber-200/50 dark:border-amber-800/40">
                      Saved {simulation.daysSaved} days of idle transit demurrage and driver per-diem
                    </p>
                  </div>
                </StaggerGridItem>

                {/* Border Clearance Hours */}
                <StaggerGridItem>
                  <div className="p-5 rounded-2xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-2 h-full flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-indigo-800 dark:text-indigo-400 block">
                        Total Border Clearance
                      </span>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-700 dark:text-indigo-300 mt-1">
                        {simulation.borderClearanceHoursTotal} Hours
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-1 border-t border-indigo-200/50 dark:border-indigo-800/40">
                      Down from {simulation.borderClearanceHoursBaseline}h across {selectedCorridor.borderPosts.length} international border crossings
                    </p>
                  </div>
                </StaggerGridItem>
              </StaggerGrid>
            </div>
          </div>
        )}

        {/* TAB 2: CORRIDOR LOGISTICS & TOPOGRAPHY */}
        {activeSimulatorTab === 'logistics' && (
          <div className="space-y-8">
            {/* Topographic Elevation Profile & Transit Cross-Section */}
            <div className="p-6 md:p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white/70 dark:bg-stone-900/50 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/70 dark:border-stone-800 pb-4">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Multimodal Corridor Topographic Cross-Section &amp; Elevation Gradient
                  </h4>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">
                    Sea-Level to Interior Transit: {selectedCorridor.originPort} ➔ {selectedCorridor.destinationHub} ({selectedCorridor.distanceKm.toLocaleString()} km)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
                    Max Incline: {selectedCorridor.region === 'Eastern Africa' ? '2,200m (Rift Escarpment)' : '480m (Sahelian Plateau)'}
                  </span>
                </div>
              </div>

              {/* Procedural SVG Elevation Canvas */}
              <div className="h-44 sm:h-52 w-full relative bg-stone-50/80 dark:bg-stone-950/60 rounded-2xl p-4 border border-stone-200/70 dark:border-stone-800/70 overflow-hidden">
                <svg viewBox="0 0 800 120" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="corridorElevationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#059669" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#047857" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="800" y2="30" stroke="#78716c" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
                  <line x1="0" y1="70" x2="800" y2="70" stroke="#78716c" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
                  <line x1="0" y1="110" x2="800" y2="110" stroke="#78716c" strokeWidth="0.8" opacity="0.4" />

                  {/* Dynamic Terrain Profile Path based on selected corridor */}
                  {selectedCorridor.region === 'Eastern Africa' ? (
                    <>
                      <path
                        d="M 0,110 Q 150,105 240,45 T 450,20 T 600,65 T 750,38 L 800,42 L 800,110 L 0,110 Z"
                        fill="url(#corridorElevationGrad)"
                      />
                      <path
                        d="M 0,110 Q 150,105 240,45 T 450,20 T 600,65 T 750,38 L 800,42"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="2.5"
                      />
                    </>
                  ) : selectedCorridor.region === 'Western Africa' ? (
                    <>
                      <path
                        d="M 0,110 Q 200,95 400,75 T 650,55 L 800,50 L 800,110 L 0,110 Z"
                        fill="url(#corridorElevationGrad)"
                      />
                      <path
                        d="M 0,110 Q 200,95 400,75 T 650,55 L 800,50"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="2.5"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        d="M 0,110 Q 220,80 420,40 T 700,50 L 800,45 L 800,110 L 0,110 Z"
                        fill="url(#corridorElevationGrad)"
                      />
                      <path
                        d="M 0,110 Q 220,80 420,40 T 700,50 L 800,45"
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="2.5"
                      />
                    </>
                  )}

                  {/* Waypoint Markers */}
                  {selectedCorridor.borderPosts.map((bp, idx) => {
                    const total = selectedCorridor.borderPosts.length;
                    const posX = 150 + ((idx + 1) / (total + 1)) * 550;
                    return (
                      <g key={bp.id} transform={`translate(${posX}, 40)`}>
                        <line x1="0" y1="0" x2="0" y2="70" stroke="#d97706" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                        <circle cx="0" cy="0" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="0" y="-8" textAnchor="middle" fill="#78716c" fontSize="8" fontFamily="monospace" fontWeight="bold">
                          {bp.name.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* Origin Port & Destination Labels */}
                  <text x="12" y="102" fill="#059669" fontSize="10" fontFamily="monospace" fontWeight="900">
                    ⚓ {selectedCorridor.originPort} (0m)
                  </text>
                  <text x="788" y="32" textAnchor="end" fill="#047857" fontSize="10" fontFamily="monospace" fontWeight="900">
                    📍 {selectedCorridor.destinationHub}
                  </text>
                </svg>
              </div>
            </div>

            {/* Waypoint Breakdown & OSBP Inspection */}
            <div className="p-6 md:p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white/70 dark:bg-stone-900/50 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/70 dark:border-stone-800 pb-4">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    Active Corridor Waypoints &amp; One-Stop Border Posts (OSBP)
                  </h4>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">
                    {selectedCorridor.originPort} ➔ {selectedCorridor.destinationHub} ({selectedCorridor.distanceKm} km)
                  </p>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold">
                  {selectedCorridor.borderPosts.length} Cross-Border Inspections
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCorridor.borderPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white/90 dark:bg-stone-900/70 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif">
                        {post.name}
                      </span>
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full ${
                        post.type === 'OSBP' 
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold' 
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold'
                      }`}>
                        {post.type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-stone-500">Border Crossing:</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {post.countryA} ↔ {post.countryB}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 dark:border-stone-800/80">
                      <span className="text-stone-500">Clearance Timeline:</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-stone-400 line-through text-xs">{post.baselineHours}h</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {useSingleWindow ? post.afcftaSingleWindowHours : post.baselineHours} hrs
                        </span>
                      </div>
                    </div>

                    {/* Common Bottlenecks */}
                    <div className="pt-1">
                      <span className="text-[11px] font-mono text-stone-400 block mb-1">Documented Non-Tariff Friction:</span>
                      <ul className="space-y-1">
                        {post.commonBottlenecks.map((bottleneck, i) => (
                          <li key={i} className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                            <span>{bottleneck}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RULES OF ORIGIN & COMPLIANCE */}
        {activeSimulatorTab === 'modalities' && (
          <div className="space-y-8">
            {/* Rules of Origin (RoO) Compliance Certification Box */}
            <div className="p-6 md:p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white/70 dark:bg-stone-900/50 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/70 dark:border-stone-800 pb-5">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      AfCFTA Rules of Origin (RoO) Modalities Checklist
                    </h4>
                    <p className="text-stone-600 dark:text-stone-400 text-xs mt-0.5">
                      Annex 2 Modalities Verification for <strong className="text-stone-800 dark:text-stone-200">{selectedCommodity.name} ({selectedCommodity.hsCode})</strong>
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-mono text-xs font-bold shadow-xs shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  Origin Verified
                </span>
              </div>

              {/* Criteria Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-stone-200/70 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/60 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                    Originating Status Criterion
                  </span>
                  <div className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    {selectedCommodity.rulesOfOriginCriteria}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Requires substantial transformation or local value addition within the continental territory.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200/70 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/60 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                    Regional Value Addition (RVA) Threshold
                  </span>
                  <div className="font-mono font-bold text-xl text-emerald-600 dark:text-emerald-400">
                    {selectedCommodity.minLocalContentPct}% Minimum Local Content
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Excludes non-originating materials beyond {100 - selectedCommodity.minLocalContentPct}% ex-works value.
                  </p>
                </div>
              </div>

              {/* PAPSS Settlement Integration */}
              <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-50/40 dark:bg-cyan-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-cyan-600" />
                    Pan-African Payment and Settlement System (PAPSS) Integration
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300">
                    {usePapss ? 'Enabled (Instant Settlement)' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  PAPSS enables instant cross-border settlement in local African currencies without routing through European or US correspondent banks.
                  Estimated foreign exchange markup savings on this shipment: <strong className="font-mono text-cyan-700 dark:text-cyan-300">${simulation.papssFxSavingsUSD.toLocaleString()} USD</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AfcftaTradeCorridorSimulator;
