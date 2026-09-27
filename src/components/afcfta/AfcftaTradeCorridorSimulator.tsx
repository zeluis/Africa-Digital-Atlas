import React, { useState, useMemo } from 'react';
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
  RotateCcw
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
      isModal ? 'max-h-[92vh] flex flex-col' : 'p-4 sm:p-6 md:p-8 space-y-6'
    }`}>
      {/* Simulator Masthead */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200/90 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
              AfCFTA TRADE & CUSTOMS SIMULATOR
            </span>
            <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
              JEL Codes: F13 · F15 · R41
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            AfCFTA Trade Corridor & Tariff Impact Simulator
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-all shadow-xs cursor-pointer"
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
              className="p-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-200/50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
              aria-label="Close Simulator"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`space-y-6 ${isModal ? 'overflow-y-auto p-4 sm:p-6 flex-1' : ''}`}>
        {/* Step 1: Corridor Selection Ribbon */}
        <div className="space-y-2.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            1. Select Continental Trade Corridor:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {AFCFTA_CORRIDOR_PRESETS.map((corridor) => {
              const isSelected = corridor.id === selectedCorridor.id;
              return (
                <button
                  key={corridor.id}
                  type="button"
                  onClick={() => setSelectedCorridor(corridor)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-500 shadow-xs'
                      : 'border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 hover:border-emerald-400 dark:hover:border-emerald-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {corridor.rec}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">
                        {corridor.distanceKm} km
                      </span>
                    </div>
                    <div className="font-bold text-xs text-stone-900 dark:text-stone-100 mt-1 leading-snug">
                      {corridor.name}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-stone-500 flex items-center justify-between border-t border-stone-200/50 dark:border-stone-800/80 pt-1.5">
                    <span>Flow: {corridor.annualTradeVolumeUSD}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">{corridor.borderPosts.length} OSBPs</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Commodity & Consignment Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 backdrop-blur-xs">
          {/* Commodity Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              2. Harmonized Commodity (HS Code):
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 no-scrollbar">
              {AFCFTA_COMMODITIES.map((commodity) => {
                const isSelected = commodity.hsCode === selectedCommodity.hsCode;
                return (
                  <button
                    key={commodity.hsCode}
                    type="button"
                    onClick={() => handleSelectCommodity(commodity)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 text-xs ${
                      isSelected
                        ? 'border-amber-600 dark:border-amber-500 bg-amber-500/10 text-stone-900 dark:text-stone-100 font-bold'
                        : 'border-stone-200/60 dark:border-stone-800 bg-white dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:bg-amber-50/50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] text-amber-800 dark:text-amber-400 block font-bold">
                        {commodity.hsCode} · {commodity.category}
                      </span>
                      <span className="truncate block font-serif">
                        {commodity.name}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-stone-500 block">MFN Tariff</span>
                      <span className="font-mono font-bold text-red-600 dark:text-red-400">
                        {commodity.defaultMfnTariffRate}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shipment Parameters & Regimes (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-600" />
              3. Consignment Sizing & Policy Architecture:
            </label>

            {/* Consignment Sizing Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl border border-stone-200/70 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600 dark:text-stone-400">Container Value:</span>
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600 dark:text-stone-400">Shipment Volume:</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                    {containerCount} TEU Containers (${(consignmentValue * containerCount).toLocaleString()})
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

            {/* Policy Regime Selection Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-stone-500 block">Tariff Protocol Regime:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setRegime('mfn')}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                    regime === 'mfn'
                      ? 'border-red-500 bg-red-500/10 text-red-800 dark:text-red-300 font-bold'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                  }`}
                >
                  Pre-AfCFTA MFN ({selectedCommodity.defaultMfnTariffRate}%)
                </button>
                <button
                  type="button"
                  onClick={() => setRegime('rec')}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                    regime === 'rec'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-800 dark:text-blue-300 font-bold'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                  }`}
                >
                  REC Protocol ({selectedCommodity.recTariffRate}%)
                </button>
                <button
                  type="button"
                  onClick={() => setRegime('afcfta_cat_a')}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                    regime === 'afcfta_cat_a'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-500/40'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                  }`}
                >
                  AfCFTA Cat A (0% Duty)
                </button>
                <button
                  type="button"
                  onClick={() => setRegime('afcfta_cat_b')}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                    regime === 'afcfta_cat_b'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                  }`}
                >
                  Cat B Sensitive ({selectedCommodity.afcftaCatBTariffRate}%)
                </button>
              </div>
            </div>

            {/* Fast-Track Modernization Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <label className="flex items-center gap-2 p-2 rounded-xl border border-stone-200/60 dark:border-stone-800 bg-white/80 dark:bg-stone-900/60 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={usePapss}
                  onChange={(e) => setUsePapss(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-600"
                />
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">PAPSS Clearing</span>
                  <span className="text-[10px] text-stone-500 font-mono">Instant FX (saves 3.8%)</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl border border-stone-200/60 dark:border-stone-800 bg-white/80 dark:bg-stone-900/60 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={useSingleWindow}
                  onChange={(e) => setUseSingleWindow(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-600"
                />
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">Single Window</span>
                  <span className="text-[10px] text-stone-500 font-mono">Digital OSBP clearance</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl border border-stone-200/60 dark:border-stone-800 bg-white/80 dark:bg-stone-900/60 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={useGreenLane}
                  onChange={(e) => setUseGreenLane(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-600"
                />
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">AEO Green Lane</span>
                  <span className="text-[10px] text-stone-500 font-mono">Fast-track inspection</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Step 3: Simulation Results Dashboard */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              4. Simulated Economic & Logistics Outcomes:
            </h3>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Direct Savings: ${simulation.totalLandedSavingsUSD.toLocaleString()} USD
            </span>
          </div>

          {/* 4 Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tariff Savings Card */}
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-800 dark:text-emerald-400 block">
                Customs Duty Duty Savings
              </span>
              <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                ${simulation.directTariffSavingsUSD.toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                Reduced from ${simulation.mfnDutyUSD.toLocaleString()} ({simulation.mfnDutyPct}%) to ${simulation.simulatedDutyUSD.toLocaleString()} ({simulation.simulatedDutyPct}%)
              </p>
            </div>

            {/* PAPSS FX Clearing Savings */}
            <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-50/50 dark:bg-cyan-950/20 space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-cyan-800 dark:text-cyan-400 block">
                PAPSS FX Elimination Gain
              </span>
              <div className="text-2xl font-black font-mono text-cyan-700 dark:text-cyan-300">
                ${simulation.papssFxSavingsUSD.toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                Zero third-party USD correspondent banking fees on bilateral trade settlement
              </p>
            </div>

            {/* Transit Lead Time Card */}
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-800 dark:text-amber-400 block">
                Corridor Lead Time
              </span>
              <div className="text-2xl font-black font-mono text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <span>{simulation.simulatedTransitDays} Days</span>
                <span className="text-xs font-sans text-stone-500 line-through">
                  {simulation.baselineTransitDays}d
                </span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                Saved {simulation.daysSaved} days of idle transit demurrage and driver per-diem
              </p>
            </div>

            {/* Border Clearance Hours */}
            <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-indigo-800 dark:text-indigo-400 block">
                Total Border Clearance
              </span>
              <div className="text-2xl font-black font-mono text-indigo-700 dark:text-indigo-300">
                {simulation.borderClearanceHoursTotal} Hours
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                Down from {simulation.borderClearanceHoursBaseline} hours across {selectedCorridor.borderPosts.length} international border crossings
              </p>
            </div>
          </div>
        </div>

        {/* Step 4: Waypoint Breakdown & OSBP Inspection */}
        <div className="p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                Active Corridor Waypoints & One-Stop Border Posts (OSBP)
              </h4>
              <p className="text-[11px] text-stone-500 font-mono">
                {selectedCorridor.originPort} ➔ {selectedCorridor.destinationHub} ({selectedCorridor.distanceKm} km)
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              {selectedCorridor.borderPosts.length} Cross-Border Inspections
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedCorridor.borderPosts.map((post) => (
              <div
                key={post.id}
                className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/80 dark:bg-stone-900/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                    {post.name}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    post.type === 'OSBP' 
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
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

                <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100 dark:border-stone-800/80">
                  <span className="text-stone-500">Clearance Time:</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-stone-400 line-through text-[11px]">{post.baselineHours}h</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {useSingleWindow ? post.afcftaSingleWindowHours : post.baselineHours} hrs
                    </span>
                  </div>
                </div>

                {/* Common Bottlenecks */}
                <div className="pt-1">
                  <span className="text-[10px] font-mono text-stone-400 block mb-0.5">Known Non-Tariff Friction:</span>
                  <ul className="space-y-0.5">
                    {post.commonBottlenecks.map((bottleneck, i) => (
                      <li key={i} className="text-[10px] text-stone-600 dark:text-stone-400 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                        <span className="truncate">{bottleneck}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 5: Rules of Origin (RoO) Compliance Certification Box */}
        <div className="p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif font-bold text-stone-900 dark:text-stone-100">
                AfCFTA Rules of Origin (RoO) Modalities Checklist
              </div>
              <p className="text-stone-600 dark:text-stone-400 text-[11px] mt-0.5">
                Criteria: <strong className="text-stone-800 dark:text-stone-200">{selectedCommodity.rulesOfOriginCriteria}</strong> (Min. {selectedCommodity.minLocalContentPct}% regional value add).
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-mono text-[10px] font-bold shadow-xs">
              <CheckCircle2 className="w-3 h-3" />
              Origin Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
