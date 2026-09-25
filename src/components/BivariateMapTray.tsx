import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Grid, Sparkles, ArrowRight, ArrowUp, Sliders, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

export interface BivariatePreset {
  id: string;
  name: string;
  varX: string;
  varY: string;
  labelX: string;
  labelY: string;
  unitX: string;
  unitY: string;
  desc: string;
}

export const BIVARIATE_PRESETS: BivariatePreset[] = [
  {
    id: 'gdp_vs_renewables',
    name: 'Wealth vs. Renewable Energy',
    varX: 'NY.GDP.MKTP.CD',
    varY: 'EG.FEC.RNEW.ZS',
    labelX: 'Nominal GDP',
    labelY: 'Renewable Share',
    unitX: 'Billion USD',
    unitY: '%',
    desc: 'Examines economic volume against clean energy adoption'
  },
  {
    id: 'urban_vs_electricity',
    name: 'Urbanization vs. Grid Power',
    varX: 'SP.URB.TOTL.IN.ZS',
    varY: 'EG.ELC.ACCS.ZS',
    labelX: 'Urban Share',
    labelY: 'Electricity Access',
    unitX: '%',
    unitY: '%',
    desc: 'Metropolitan concentration vs. grid connectivity reach'
  },
  {
    id: 'hdi_vs_gdp_growth',
    name: 'Human Dev vs. Real Growth',
    varX: 'UNDP.HDI.INDEX',
    varY: 'NY.GDP.MKTP.KD.ZG',
    labelX: 'HDI Index',
    labelY: 'Real GDP Growth',
    unitX: '0–1',
    unitY: '%',
    desc: 'Established human welfare vs. macroeconomic momentum'
  },
  {
    id: 'literacy_vs_electricity',
    name: 'Literacy vs. Power Access',
    varX: 'SE.ADT.LITR.ZS',
    varY: 'EG.ELC.ACCS.ZS',
    labelX: 'Adult Literacy',
    labelY: 'Power Access',
    unitX: '%',
    unitY: '%',
    desc: 'Foundational education capital vs. basic utility services'
  }
];

// Academic Pink-Teal bivariate matrix
// row 0: Low Y (bottom); row 1: Mid Y; row 2: High Y (top)
// col 0: Low X (left);   col 1: Mid X; col 2: High X (right)
export const BIVARIATE_MATRIX_COLORS: string[][] = [
  ['#e8e8e8', '#dfb0d6', '#be64ac'],
  ['#ace4e4', '#a5add3', '#8c62aa'],
  ['#5ac8c8', '#5698b9', '#3b4994'],
];

export interface BivariateThresholds {
  pX1: number;
  pX2: number;
  pY1: number;
  pY2: number;
}

export interface BivariateCutoffs {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

interface BivariateMapTrayProps {
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  hoveredCell: { x: number; y: number } | null;
  onHoverCell: (cell: { x: number; y: number } | null) => void;
  cellCounts: number[][];
  thresholds?: BivariateThresholds;
  onThresholdsChange?: (thresholds: BivariateThresholds) => void;
  cutoffs?: BivariateCutoffs;
}

export const BivariateMapTray: React.FC<BivariateMapTrayProps> = ({
  activePresetId,
  onSelectPreset,
  hoveredCell,
  onHoverCell,
  cellCounts,
  thresholds = { pX1: 33, pX2: 66, pY1: 33, pY2: 66 },
  onThresholdsChange,
  cutoffs
}) => {
  const [showBracketControls, setShowBracketControls] = useState(true);
  const activePreset = BIVARIATE_PRESETS.find(p => p.id === activePresetId) || BIVARIATE_PRESETS[0];

  const handleUpdateThreshold = (key: keyof BivariateThresholds, value: number) => {
    if (!onThresholdsChange) return;
    const next = { ...thresholds, [key]: value };
    // Maintain minimum 5% gap between brackets
    if (key === 'pX1' && next.pX1 >= next.pX2) {
      next.pX2 = Math.min(95, next.pX1 + 5);
    } else if (key === 'pX2' && next.pX2 <= next.pX1) {
      next.pX1 = Math.max(5, next.pX2 - 5);
    } else if (key === 'pY1' && next.pY1 >= next.pY2) {
      next.pY2 = Math.min(95, next.pY1 + 5);
    } else if (key === 'pY2' && next.pY2 <= next.pY1) {
      next.pY1 = Math.max(5, next.pY2 - 5);
    }
    onThresholdsChange(next);
  };

  const applyPresetBracket = (p1: number, p2: number) => {
    if (!onThresholdsChange) return;
    onThresholdsChange({
      pX1: p1,
      pX2: p2,
      pY1: p1,
      pY2: p2
    });
  };

  const formatCutoff = (val: number | undefined, unit: string) => {
    if (val === undefined || isNaN(val)) return '—';
    if (unit.toLowerCase().includes('billion')) return `$${val.toFixed(1)}B`;
    if (unit === '%') return `${val.toFixed(1)}%`;
    if (unit === '0–1') return val.toFixed(3);
    if (val >= 1000) return val.toLocaleString(undefined, { maximumFractionDigits: 1 });
    return val.toFixed(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="border-b border-purple-500/20 bg-purple-50/70 dark:bg-purple-950/30 backdrop-blur-md px-3 sm:px-4 py-2.5"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Preset Selection & Description */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 shrink-0 mr-1 flex items-center gap-1">
              <Grid className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              Bivariate Pair:
            </span>
            {BIVARIATE_PRESETS.map(preset => {
              const isSelected = preset.id === activePreset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectPreset(preset.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-xs font-bold ring-2 ring-purple-500/30'
                      : 'bg-white dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 hover:bg-purple-50 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800'
                  }`}
                >
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] text-purple-900/80 dark:text-purple-300/80 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>{activePreset.desc}</span>
              <span className="text-[10px] text-zinc-400 font-mono ml-1 hidden sm:inline">
                (X: {activePreset.labelX} • Y: {activePreset.labelY})
              </span>
            </p>

            {onThresholdsChange && (
              <button
                type="button"
                onClick={() => setShowBracketControls(!showBracketControls)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  showBracketControls || thresholds.pX1 !== 33 || thresholds.pX2 !== 66 || thresholds.pY1 !== 33 || thresholds.pY2 !== 66
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-200'
                }`}
              >
                <Sliders className="w-2.5 h-2.5" />
                <span>Range Brackets ({thresholds.pX1}%/{thresholds.pX2}%)</span>
                {showBracketControls ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
              </button>
            )}
          </div>
        </div>

        {/* 2D 3x3 Bivariate Matrix Visual Legend */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto bg-white/90 dark:bg-zinc-900/90 p-2 rounded-2xl border border-purple-200 dark:border-purple-900/60 shadow-xs">
          {/* Y Axis Label */}
          <div className="flex flex-col items-center justify-between h-16 text-[9px] font-bold text-zinc-500 font-mono">
            <span className="flex items-center text-purple-700 dark:text-purple-300">
              <ArrowUp className="w-2.5 h-2.5" /> High
            </span>
            <span className="text-[8px] transform -rotate-90 origin-center whitespace-nowrap uppercase tracking-wider text-zinc-400">
              {activePreset.labelY}
            </span>
            <span className="text-zinc-400">Low</span>
          </div>

          {/* 3x3 Grid of Tiles */}
          <div className="flex flex-col">
            <div className="grid grid-cols-3 gap-1">
              {[2, 1, 0].map(y => (
                <React.Fragment key={y}>
                  {[0, 1, 2].map(x => {
                    const color = BIVARIATE_MATRIX_COLORS[y][x];
                    const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
                    const count = cellCounts?.[y]?.[x] ?? 0;
                    const xLabel = x === 0 ? 'Low' : x === 1 ? 'Mid' : 'High';
                    const yLabel = y === 0 ? 'Low' : y === 1 ? 'Mid' : 'High';

                    return (
                      <button
                        key={`${y}-${x}`}
                        type="button"
                        onMouseEnter={() => onHoverCell({ x, y })}
                        onMouseLeave={() => onHoverCell(null)}
                        title={`${yLabel} ${activePreset.labelY} & ${xLabel} ${activePreset.labelX} (${count} nations) — Click or hover to spotlight`}
                        className={`w-5 h-5 rounded-md transition-all cursor-pointer relative flex items-center justify-center ${
                          isHovered
                            ? 'ring-2 ring-purple-600 scale-110 z-10 shadow-md'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        <span className={`text-[8px] font-mono font-bold font-tabular tabular-nums ${y >= 1 && x >= 1 ? 'text-white' : 'text-zinc-800'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* X Axis Label */}
            <div className="flex items-center justify-between text-[9px] font-bold text-zinc-500 font-mono pt-1">
              <span className="text-zinc-400">Low</span>
              <span className="text-[8px] uppercase tracking-wider text-zinc-400 flex items-center gap-0.5">
                {activePreset.labelX} <ArrowRight className="w-2.5 h-2.5 text-purple-700 dark:text-purple-300" />
              </span>
              <span className="text-purple-700 dark:text-purple-300">High</span>
            </div>
          </div>

          {/* Quick info note */}
          <div className="hidden lg:flex flex-col text-[10px] text-zinc-500 pl-2 border-l border-zinc-200 dark:border-zinc-800 max-w-[140px] leading-tight">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">Interactive 3×3</span>
            <span className="text-[9px]">Hover tiles to spotlight countries in that quadrant</span>
          </div>
        </div>
      </div>

      {/* Interactive Custom Range Brackets Tuning Panel */}
      <AnimatePresence>
        {showBracketControls && onThresholdsChange && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-900/60 max-w-7xl mx-auto"
          >
            <div className="bg-white/95 dark:bg-zinc-900/95 p-3 rounded-2xl border border-purple-200/80 dark:border-purple-800/60 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100 dark:border-purple-900/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    Custom Legend Range Brackets
                  </span>
                  <span className="text-[10px] text-zinc-500 font-sans hidden sm:inline">
                    Tune percentile thresholds to highlight subtle variations or extreme leaders
                  </span>
                </div>

                {/* Preset Bracket Selectors */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-zinc-500 mr-1">Presets:</span>
                  <button
                    type="button"
                    onClick={() => applyPresetBracket(33, 66)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                      thresholds.pX1 === 33 && thresholds.pX2 === 66 && thresholds.pY1 === 33 && thresholds.pY2 === 66
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-100 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    Terciles (33/66)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetBracket(25, 75)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                      thresholds.pX1 === 25 && thresholds.pX2 === 75 && thresholds.pY1 === 25 && thresholds.pY2 === 75
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-100 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    Quartiles (25/75)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetBracket(20, 80)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                      thresholds.pX1 === 20 && thresholds.pX2 === 80 && thresholds.pY1 === 20 && thresholds.pY2 === 80
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-100 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    Pareto (20/80)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetBracket(10, 90)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                      thresholds.pX1 === 10 && thresholds.pX2 === 90 && thresholds.pY1 === 10 && thresholds.pY2 === 90
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-100 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    Extreme Outliers (10/90)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetBracket(33, 66)}
                    title="Reset to default terciles"
                    className="p-1 rounded text-zinc-400 hover:text-purple-600 transition-colors cursor-pointer ml-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* X-Axis Threshold Sliders & Visual Dual-Bracket Track */}
                <div className="space-y-2.5 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
                  <div className="flex items-center justify-between text-[11px] font-bold text-purple-950 dark:text-purple-200">
                    <span className="flex items-center gap-1">
                      <span>X-Axis: {activePreset.labelX}</span>
                      <span className="text-[10px] text-zinc-400 font-normal">({activePreset.unitX})</span>
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50">
                      T1: {thresholds.pX1}% • T2: {thresholds.pX2}%
                    </span>
                  </div>

                  {/* Continuous Visual Range Track Bar with Color Zones */}
                  <div className="space-y-1">
                    <div className="relative h-4 w-full rounded-md overflow-hidden flex border border-purple-200/80 dark:border-purple-800/80 shadow-2xs">
                      {/* Low Zone */}
                      <div 
                        style={{ width: `${thresholds.pX1}%` }} 
                        className="h-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-[9px] text-zinc-700 dark:text-zinc-200 font-bold overflow-hidden"
                      >
                        Low ({thresholds.pX1}%)
                      </div>
                      {/* Mid Zone */}
                      <div 
                        style={{ width: `${thresholds.pX2 - thresholds.pX1}%` }} 
                        className="h-full bg-purple-200 dark:bg-purple-800/60 flex items-center justify-center text-[9px] text-purple-900 dark:text-purple-200 font-bold overflow-hidden border-x border-purple-400/50"
                      >
                        Mid
                      </div>
                      {/* High Zone */}
                      <div 
                        style={{ width: `${100 - thresholds.pX2}%` }} 
                        className="h-full bg-purple-500 dark:bg-purple-600 flex items-center justify-center text-[9px] text-white font-bold overflow-hidden"
                      >
                        High ({100 - thresholds.pX2}%)
                      </div>
                    </div>
                  </div>

                  {/* Dual Precision Range Inputs */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 w-28 shrink-0 font-medium">Bracket 1 (Low/Mid):</span>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="1"
                        value={thresholds.pX1}
                        onChange={(e) => handleUpdateThreshold('pX1', Number(e.target.value))}
                        className="w-full accent-purple-600 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                      />
                      <span className="text-[10px] font-bold w-12 text-right font-tabular tabular-nums">{thresholds.pX1}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 w-28 shrink-0 font-medium">Bracket 2 (Mid/High):</span>
                      <input
                        type="range"
                        min="40"
                        max="95"
                        step="1"
                        value={thresholds.pX2}
                        onChange={(e) => handleUpdateThreshold('pX2', Number(e.target.value))}
                        className="w-full accent-purple-600 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                      />
                      <span className="text-[10px] font-bold w-12 text-right font-tabular tabular-nums">{thresholds.pX2}%</span>
                    </div>
                  </div>

                  {cutoffs && (
                    <div className="pt-2 border-t border-purple-200/50 dark:border-purple-900/30 flex items-center justify-between text-[10px] text-zinc-600 dark:text-zinc-400 font-tabular tabular-nums">
                      <span>Low: &lt; {formatCutoff(cutoffs.x1, activePreset.unitX)}</span>
                      <span>Mid: {formatCutoff(cutoffs.x1, activePreset.unitX)}–{formatCutoff(cutoffs.x2, activePreset.unitX)}</span>
                      <span>High: &gt; {formatCutoff(cutoffs.x2, activePreset.unitX)}</span>
                    </div>
                  )}
                </div>

                {/* Y-Axis Threshold Sliders & Visual Dual-Bracket Track */}
                <div className="space-y-2.5 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
                  <div className="flex items-center justify-between text-[11px] font-bold text-purple-950 dark:text-purple-200">
                    <span className="flex items-center gap-1">
                      <span>Y-Axis: {activePreset.labelY}</span>
                      <span className="text-[10px] text-zinc-400 font-normal">({activePreset.unitY})</span>
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50">
                      T1: {thresholds.pY1}% • T2: {thresholds.pY2}%
                    </span>
                  </div>

                  {/* Continuous Visual Range Track Bar with Color Zones */}
                  <div className="space-y-1">
                    <div className="relative h-4 w-full rounded-md overflow-hidden flex border border-purple-200/80 dark:border-purple-800/80 shadow-2xs">
                      {/* Low Zone */}
                      <div 
                        style={{ width: `${thresholds.pY1}%` }} 
                        className="h-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-[9px] text-zinc-700 dark:text-zinc-200 font-bold overflow-hidden"
                      >
                        Low ({thresholds.pY1}%)
                      </div>
                      {/* Mid Zone */}
                      <div 
                        style={{ width: `${thresholds.pY2 - thresholds.pY1}%` }} 
                        className="h-full bg-teal-200 dark:bg-teal-800/60 flex items-center justify-center text-[9px] text-teal-900 dark:text-teal-200 font-bold overflow-hidden border-x border-teal-400/50"
                      >
                        Mid
                      </div>
                      {/* High Zone */}
                      <div 
                        style={{ width: `${100 - thresholds.pY2}%` }} 
                        className="h-full bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-[9px] text-white font-bold overflow-hidden"
                      >
                        High ({100 - thresholds.pY2}%)
                      </div>
                    </div>
                  </div>

                  {/* Dual Precision Range Inputs */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 w-28 shrink-0 font-medium">Bracket 1 (Low/Mid):</span>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="1"
                        value={thresholds.pY1}
                        onChange={(e) => handleUpdateThreshold('pY1', Number(e.target.value))}
                        className="w-full accent-teal-600 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                      />
                      <span className="text-[10px] font-bold w-12 text-right font-tabular tabular-nums">{thresholds.pY1}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 w-28 shrink-0 font-medium">Bracket 2 (Mid/High):</span>
                      <input
                        type="range"
                        min="40"
                        max="95"
                        step="1"
                        value={thresholds.pY2}
                        onChange={(e) => handleUpdateThreshold('pY2', Number(e.target.value))}
                        className="w-full accent-teal-600 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                      />
                      <span className="text-[10px] font-bold w-12 text-right font-tabular tabular-nums">{thresholds.pY2}%</span>
                    </div>
                  </div>

                  {cutoffs && (
                    <div className="pt-2 border-t border-purple-200/50 dark:border-purple-900/30 flex items-center justify-between text-[10px] text-zinc-600 dark:text-zinc-400 font-tabular tabular-nums">
                      <span>Low: &lt; {formatCutoff(cutoffs.y1, activePreset.unitY)}</span>
                      <span>Mid: {formatCutoff(cutoffs.y1, activePreset.unitY)}–{formatCutoff(cutoffs.y2, activePreset.unitY)}</span>
                      <span>High: &gt; {formatCutoff(cutoffs.y2, activePreset.unitY)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
