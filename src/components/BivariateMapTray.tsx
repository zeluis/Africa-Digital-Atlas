import React, { useMemo, useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import {
  Grid,
  Sparkles,
  ArrowRight,
  ArrowUp,
  ArrowLeftRight,
  Sliders,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { AtlasSelect } from './common/AtlasSelect';
import { ChartAccessibleTable } from './common/ChartAccessibleTable';

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

export interface BivariateIndicatorOption {
  id: string;
  label: string;
  shortLabel: string;
  unit: string;
  pillar: string;
}

export const BIVARIATE_INDICATORS: BivariateIndicatorOption[] = [
  { id: 'NY.GDP.MKTP.CD', label: 'Nominal GDP', shortLabel: 'GDP', unit: 'Billion USD', pillar: 'Macroeconomic' },
  { id: 'NY.GDP.PCAP.CD', label: 'GDP per Capita', shortLabel: 'GDP/Cap', unit: 'USD', pillar: 'Macroeconomic' },
  { id: 'NY.GDP.MKTP.KD.ZG', label: 'Real GDP Growth', shortLabel: 'GDP Growth', unit: '%', pillar: 'Macroeconomic' },
  { id: 'COMTRADE.EXP.TOTL', label: 'Total Exports', shortLabel: 'Exports', unit: 'Billion USD', pillar: 'Trade' },
  { id: 'UNDP.HDI.INDEX', label: 'Human Development Index (HDI)', shortLabel: 'HDI Index', unit: '0–1', pillar: 'Human Dev' },
  { id: 'SP.DYN.LE00.IN', label: 'Life Expectancy at Birth', shortLabel: 'Life Exp.', unit: 'Years', pillar: 'Health' },
  { id: 'SP.POP.TOTL', label: 'Total Population', shortLabel: 'Population', unit: 'Million', pillar: 'Demographics' },
  { id: 'SP.URB.TOTL.IN.ZS', label: 'Urban Share', shortLabel: 'Urban %', unit: '%', pillar: 'Demographics' },
  { id: 'SE.ADT.LITR.ZS', label: 'Adult Literacy Rate', shortLabel: 'Literacy %', unit: '%', pillar: 'Education' },
  { id: 'EG.ELC.ACCS.ZS', label: 'Electricity Access', shortLabel: 'Electricity %', unit: '%', pillar: 'Energy' },
  { id: 'EG.FEC.RNEW.ZS', label: 'Renewable Energy Share', shortLabel: 'Renewables %', unit: '%', pillar: 'Energy' },
  { id: 'IT.NET.USER.ZS', label: 'Internet Penetration', shortLabel: 'Internet %', unit: '%', pillar: 'Digital' },
  { id: 'AKP.INFRA.BROADBAND', label: 'Broadband Connectivity', shortLabel: 'Broadband', unit: '0–100', pillar: 'Digital' },
  { id: 'MO.IIAG.SCORE', label: 'Ibrahim Governance (IIAG)', shortLabel: 'IIAG Score', unit: '0–100', pillar: 'Governance' },
  { id: 'AKP.ENV.PROTECTED', label: 'Protected Areas Coverage', shortLabel: 'Protected %', unit: '%', pillar: 'Environment' },
  { id: 'AKP.ENV.FOREST_COV', label: 'Forest Canopy Cover', shortLabel: 'Forest %', unit: '%', pillar: 'Environment' },
  { id: 'AKP.AGRI.FOOD_SECURITY', label: 'Food System Resilience', shortLabel: 'Food Resil.', unit: '0–100', pillar: 'Agriculture' }
];

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

export interface BivariateCountryRow {
  id: string;
  name: string;
  region: string;
  x: number;
  y: number;
  valX: number;
  valY: number;
}

interface BivariateMapTrayProps {
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  customVarX?: string | null;
  customVarY?: string | null;
  onCustomAxesChange?: (varX: string, varY: string) => void;
  hoveredCell: { x: number; y: number } | null;
  onHoverCell: (cell: { x: number; y: number } | null) => void;
  lockedCell?: { x: number; y: number } | null;
  onSelectCell?: (cell: { x: number; y: number } | null) => void;
  cellCounts: number[][];
  thresholds?: BivariateThresholds;
  onThresholdsChange?: (thresholds: BivariateThresholds) => void;
  cutoffs?: BivariateCutoffs;
  pearsonR?: number | null;
  sampleSize?: number;
  countryRows?: BivariateCountryRow[];
}

export function formatBivariateValue(val: number | undefined, unit: string): string {
  if (val === undefined || isNaN(val)) return '—';
  if (unit.toLowerCase().includes('billion')) return `$${val.toFixed(1)}B`;
  if (unit === 'USD') return `$${Math.round(val).toLocaleString()}`;
  if (unit === '%') return `${val.toFixed(1)}%`;
  if (unit === '0–1') return val.toFixed(3);
  if (unit === 'Million') return `${val.toFixed(1)}M`;
  if (val >= 1000) return val.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return val.toFixed(1);
}

export const BivariateMapTray: React.FC<BivariateMapTrayProps> = ({
  activePresetId,
  onSelectPreset,
  customVarX = null,
  customVarY = null,
  onCustomAxesChange,
  hoveredCell,
  onHoverCell,
  lockedCell = null,
  onSelectCell,
  cellCounts,
  thresholds = { pX1: 33, pX2: 66, pY1: 33, pY2: 66 },
  onThresholdsChange,
  cutoffs,
  pearsonR = null,
  sampleSize = 0,
  countryRows = []
}) => {
  const [showBracketControls, setShowBracketControls] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  const activePreset = BIVARIATE_PRESETS.find(p => p.id === activePresetId) || BIVARIATE_PRESETS[0];
  const isCustomPair = Boolean(customVarX && customVarY && (customVarX !== activePreset.varX || customVarY !== activePreset.varY));

  const resolvedX = useMemo(() => {
    const id = customVarX || activePreset.varX;
    const found = BIVARIATE_INDICATORS.find(ind => ind.id === id);
    return found || {
      id,
      label: activePreset.labelX,
      shortLabel: activePreset.labelX,
      unit: activePreset.unitX,
      pillar: 'Cross-Pillar'
    };
  }, [customVarX, activePreset]);

  const resolvedY = useMemo(() => {
    const id = customVarY || activePreset.varY;
    const found = BIVARIATE_INDICATORS.find(ind => ind.id === id);
    return found || {
      id,
      label: activePreset.labelY,
      shortLabel: activePreset.labelY,
      unit: activePreset.unitY,
      pillar: 'Cross-Pillar'
    };
  }, [customVarY, activePreset]);

  const indicatorSelectOptions = useMemo(() => {
    return BIVARIATE_INDICATORS.map(ind => ({
      value: ind.id,
      label: `${ind.label} (${ind.unit})`,
      group: ind.pillar
    }));
  }, []);

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
    setStatusMessage(`Applied ${p1}/${p2} percentile brackets.`);
  };

  const handleSwapAxes = () => {
    if (!onCustomAxesChange) return;
    onCustomAxesChange(resolvedY.id, resolvedX.id);
    setStatusMessage(`Swapped axes: X is now ${resolvedY.label}, Y is now ${resolvedX.label}.`);
  };

  const filteredTableRows = useMemo(() => {
    const activeCell = lockedCell || hoveredCell;
    const base = activeCell
      ? countryRows.filter(r => r.x === activeCell.x && r.y === activeCell.y)
      : countryRows;
    return base.map(r => {
      const xTier = r.x === 0 ? 'Low' : r.x === 1 ? 'Mid' : 'High';
      const yTier = r.y === 0 ? 'Low' : r.y === 1 ? 'Mid' : 'High';
      return [
        r.name,
        r.region,
        formatBivariateValue(r.valX, resolvedX.unit),
        formatBivariateValue(r.valY, resolvedY.unit),
        `${xTier} X / ${yTier} Y`
      ];
    });
  }, [countryRows, lockedCell, hoveredCell, resolvedX.unit, resolvedY.unit]);

  const handleDownloadCsv = () => {
    if (countryRows.length === 0) return;
    const activeCell = lockedCell;
    const rowsToExport = activeCell
      ? countryRows.filter(r => r.x === activeCell.x && r.y === activeCell.y)
      : countryRows;
    const escapeCell = (val: string | number) => {
      const str = String(val);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };
    const header = [
      'ISO3',
      'Nation',
      'UN Region',
      `${resolvedX.label} (${resolvedX.unit})`,
      `${resolvedY.label} (${resolvedY.unit})`,
      'X Tier',
      'Y Tier'
    ];
    const lines = [
      header.map(escapeCell).join(','),
      ...rowsToExport.map(r => {
        const xTier = r.x === 0 ? 'Low' : r.x === 1 ? 'Mid' : 'High';
        const yTier = r.y === 0 ? 'Low' : r.y === 1 ? 'Mid' : 'High';
        return [r.id, r.name, r.region, r.valX, r.valY, xTier, yTier].map(escapeCell).join(',');
      })
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `afriata-bivariate-${resolvedX.id}-vs-${resolvedY.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage(`Exported ${rowsToExport.length} bivariate country records to CSV.`);
  };

  const correlationSummary = useMemo(() => {
    if (pearsonR === null || isNaN(pearsonR)) return null;
    const absR = Math.abs(pearsonR);
    if (absR < 0.2) return 'Weak linear coupling';
    if (pearsonR >= 0.5) return 'Strong positive co-movement';
    if (pearsonR >= 0.2) return 'Moderate positive coupling';
    if (pearsonR <= -0.5) return 'Strong inverse relationship';
    return 'Moderate inverse relationship';
  }, [pearsonR]);

  return (
    <m.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="border-b border-purple-500/20 bg-purple-50/80 dark:bg-purple-950/35 px-3 sm:px-4 py-2.5"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Preset & Custom Pair Selection */}
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 shrink-0 mr-1 flex items-center gap-1">
              <Grid className="w-3 h-3 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              Bivariate Pair:
            </span>
            {BIVARIATE_PRESETS.map(preset => {
              const isSelected = !isCustomPair && preset.id === activePreset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    onSelectPreset(preset.id);
                    setStatusMessage(`Selected bivariate preset: ${preset.name}.`);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
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

          {/* Custom Cross-Pillar Axis Selectors */}
          {onCustomAxesChange && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 shrink-0">
                  X:
                </span>
                <AtlasSelect
                  value={resolvedX.id}
                  onChange={(e) => {
                    onCustomAxesChange(e.target.value, resolvedY.id);
                    setStatusMessage(`Updated X-axis indicator to ${e.target.value}.`);
                  }}
                  options={indicatorSelectOptions}
                  size="xs"
                  accent="indigo"
                  aria-label="Select bivariate X-axis indicator"
                  className="max-w-[205px]"
                />
              </div>

              <button
                type="button"
                onClick={handleSwapAxes}
                title="Swap X and Y indicators"
                aria-label="Swap X and Y indicators"
                className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 shrink-0">
                  Y:
                </span>
                <AtlasSelect
                  value={resolvedY.id}
                  onChange={(e) => {
                    onCustomAxesChange(resolvedX.id, e.target.value);
                    setStatusMessage(`Updated Y-axis indicator to ${e.target.value}.`);
                  }}
                  options={indicatorSelectOptions}
                  size="xs"
                  accent="emerald"
                  aria-label="Select bivariate Y-axis indicator"
                  className="max-w-[205px]"
                />
              </div>
            </div>
          )}

          {/* Description, Live Pearson r, Brackets & CSV Export */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="text-[11px] text-purple-950/80 dark:text-purple-200/85 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" aria-hidden="true" />
              <span>
                {isCustomPair
                  ? `${resolvedX.label} (${resolvedX.pillar}) plotted against ${resolvedY.label} (${resolvedY.pillar})`
                  : activePreset.desc}
              </span>
            </p>

            {pearsonR !== null && !isNaN(pearsonR) && (
              <span className="text-[11px] font-mono tabular-nums text-zinc-700 dark:text-zinc-300">
                r = {pearsonR >= 0 ? '+' : ''}{pearsonR.toFixed(2)} · n = {sampleSize} · {correlationSummary}
              </span>
            )}

            {onThresholdsChange && (
              <button
                type="button"
                aria-expanded={showBracketControls}
                onClick={() => setShowBracketControls(!showBracketControls)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                  showBracketControls || thresholds.pX1 !== 33 || thresholds.pX2 !== 66 || thresholds.pY1 !== 33 || thresholds.pY2 !== 66
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-200'
                }`}
              >
                <Sliders className="w-2.5 h-2.5" aria-hidden="true" />
                <span>Brackets & Data ({thresholds.pX1}%/{thresholds.pX2}%)</span>
                {showBracketControls ? <ChevronUp className="w-2.5 h-2.5" aria-hidden="true" /> : <ChevronDown className="w-2.5 h-2.5" aria-hidden="true" />}
              </button>
            )}

            {countryRows.length > 0 && (
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:border-purple-400 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <Download className="w-2.5 h-2.5" aria-hidden="true" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* 2D 3x3 Bivariate Matrix Visual Legend */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto bg-white/95 dark:bg-zinc-900/95 p-2 rounded-2xl border border-purple-200 dark:border-purple-900/60 shadow-xs">
          {/* Y Axis Label */}
          <div className="flex flex-col items-center justify-between h-16 text-[9px] font-bold text-zinc-500 font-mono">
            <span className="flex items-center text-purple-700 dark:text-purple-300">
              <ArrowUp className="w-2.5 h-2.5" aria-hidden="true" /> High
            </span>
            <span className="text-[8px] transform -rotate-90 origin-center whitespace-nowrap uppercase tracking-wider text-zinc-500 dark:text-zinc-400 max-w-[44px] truncate">
              {resolvedY.shortLabel}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">Low</span>
          </div>

          {/* 3x3 Grid of Tiles */}
          <div className="flex flex-col">
            <div className="grid grid-cols-3 gap-1" role="group" aria-label="3 by 3 bivariate classification matrix">
              {[2, 1, 0].map(y => (
                <React.Fragment key={y}>
                  {[0, 1, 2].map(x => {
                    const color = BIVARIATE_MATRIX_COLORS[y][x];
                    const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
                    const isLocked = lockedCell?.x === x && lockedCell?.y === y;
                    const count = cellCounts?.[y]?.[x] ?? 0;
                    const xLabel = x === 0 ? 'Low' : x === 1 ? 'Mid' : 'High';
                    const yLabel = y === 0 ? 'Low' : y === 1 ? 'Mid' : 'High';

                    return (
                      <button
                        key={`${y}-${x}`}
                        type="button"
                        aria-pressed={isLocked}
                        aria-label={`${yLabel} ${resolvedY.label} and ${xLabel} ${resolvedX.label}: ${count} nations`}
                        onClick={() => {
                          if (onSelectCell) {
                            const nextCell = isLocked ? null : { x, y };
                            onSelectCell(nextCell);
                            setStatusMessage(
                              nextCell
                                ? `Filtered map to ${yLabel} ${resolvedY.label} & ${xLabel} ${resolvedX.label} (${count} nations).`
                                : 'Cleared quadrant filter.'
                            );
                          }
                        }}
                        onMouseEnter={() => onHoverCell({ x, y })}
                        onMouseLeave={() => onHoverCell(null)}
                        title={`${yLabel} ${resolvedY.label} & ${xLabel} ${resolvedX.label} (${count} nations) — ${isLocked ? 'Click to clear filter' : 'Click to lock & filter map'}`}
                        className={`w-6 h-6 rounded-md transition-all cursor-pointer relative flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                          isLocked
                            ? 'ring-2 ring-amber-500 scale-115 z-20 shadow-lg'
                            : isHovered
                            ? 'ring-2 ring-purple-600 scale-110 z-10 shadow-md'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        <span className={`text-[9px] font-mono font-bold tabular-nums ${y >= 1 && x >= 1 ? 'text-white' : 'text-zinc-900'}`}>
                          {count}
                        </span>
                        {isLocked && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 border border-white" />
                        )}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* X Axis Label */}
            <div className="flex items-center justify-between text-[9px] font-bold text-zinc-500 font-mono pt-1">
              <span className="text-zinc-500 dark:text-zinc-400">Low</span>
              <span className="text-[8px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-0.5 max-w-[72px] truncate">
                {resolvedX.shortLabel} <ArrowRight className="w-2.5 h-2.5 text-purple-700 dark:text-purple-300 shrink-0" aria-hidden="true" />
              </span>
              <span className="text-purple-700 dark:text-purple-300">High</span>
            </div>
          </div>

          {/* Quick info note */}
          <div className="hidden lg:flex flex-col text-[10px] text-zinc-600 dark:text-zinc-400 pl-2 border-l border-zinc-200 dark:border-zinc-800 max-w-[140px] leading-tight">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">Interactive 3×3</span>
            <span className="text-[9px]">Hover or click tiles to spotlight nations in that quadrant</span>
          </div>
        </div>
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </div>

      {/* Interactive Custom Range Brackets & Accessible Table */}
      <AnimatePresence>
        {showBracketControls && onThresholdsChange && (
          <m.div
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
                    <Sliders className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                    Custom Legend Range Brackets
                  </span>
                  <span className="text-[10px] text-zinc-500 font-sans hidden sm:inline">
                    Tune percentile thresholds to highlight subtle variations or extreme leaders
                  </span>
                </div>

                {/* Preset Bracket Selectors */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-zinc-500 mr-1">Presets:</span>
                  {[
                    { p1: 33, p2: 66, label: 'Terciles (33/66)' },
                    { p1: 25, p2: 75, label: 'Quartiles (25/75)' },
                    { p1: 20, p2: 80, label: 'Pareto (20/80)' },
                    { p1: 10, p2: 90, label: 'Outliers (10/90)' }
                  ].map(item => {
                    const active = thresholds.pX1 === item.p1 && thresholds.pX2 === item.p2 && thresholds.pY1 === item.p1 && thresholds.pY2 === item.p2;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        aria-pressed={active}
                        onClick={() => applyPresetBracket(item.p1, item.p2)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                          active
                            ? 'bg-purple-600 text-white font-bold'
                            : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-100 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => applyPresetBracket(33, 66)}
                    title="Reset to default terciles"
                    aria-label="Reset percentile brackets to 33 and 66"
                    className="p-1 rounded text-zinc-500 hover:text-purple-600 transition-colors cursor-pointer ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* X-Axis Threshold Sliders & Visual Dual-Bracket Track */}
                <div className="space-y-2.5 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
                  <div className="flex items-center justify-between text-[11px] font-bold text-purple-950 dark:text-purple-200 gap-2">
                    <span className="truncate">
                      X-Axis: {resolvedX.label} <span className="text-[10px] text-zinc-500 font-normal">({resolvedX.unit})</span>
                    </span>
                    <span className="text-[10px] font-bold font-mono tabular-nums text-purple-800 dark:text-purple-300 shrink-0">
                      T1 {thresholds.pX1}% · T2 {thresholds.pX2}%
                    </span>
                  </div>

                  {/* Continuous Visual Range Track Bar with Color Zones */}
                  <div className="space-y-1">
                    <div className="relative h-4 w-full rounded-md overflow-hidden flex border border-purple-200/80 dark:border-purple-800/80 shadow-2xs">
                      <div
                        style={{ width: `${thresholds.pX1}%` }}
                        className="h-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-[9px] text-zinc-800 dark:text-zinc-200 font-bold overflow-hidden"
                      >
                        Low ({thresholds.pX1}%)
                      </div>
                      <div
                        style={{ width: `${thresholds.pX2 - thresholds.pX1}%` }}
                        className="h-full bg-purple-200 dark:bg-purple-800/60 flex items-center justify-center text-[9px] text-purple-950 dark:text-purple-100 font-bold overflow-hidden border-x border-purple-400/50"
                      >
                        Mid
                      </div>
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
                    <label className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 w-28 shrink-0 font-medium">Bracket 1 (Low/Mid):</span>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="1"
                        aria-label={`X-axis Bracket 1 percentile for ${resolvedX.label}`}
                        value={thresholds.pX1}
                        onChange={(e) => handleUpdateThreshold('pX1', Number(e.target.value))}
                        className="w-full accent-purple-600 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                      />
                      <span className="text-[10px] font-bold w-12 text-right tabular-nums">{thresholds.pX1}%</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 w-28 shrink-0 font-medium">Bracket 2 (Mid/High):</span>
                      <input
                        type="range"
                        min="40"
                        max="95"
                        step="1"
                        aria-label={`X-axis Bracket 2 percentile for ${resolvedX.label}`}
                        value={thresholds.pX2}
                        onChange={(e) => handleUpdateThreshold('pX2', Number(e.target.value))}
                        className="w-full accent-purple-600 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                      />
                      <span className="text-[10px] font-bold w-12 text-right tabular-nums">{thresholds.pX2}%</span>
                    </label>
                  </div>

                  {cutoffs && (
                    <div className="pt-2 border-t border-purple-200/50 dark:border-purple-900/30 flex items-center justify-between text-[10px] text-zinc-600 dark:text-zinc-400 tabular-nums">
                      <span>Low: &lt; {formatBivariateValue(cutoffs.x1, resolvedX.unit)}</span>
                      <span>Mid: {formatBivariateValue(cutoffs.x1, resolvedX.unit)}–{formatBivariateValue(cutoffs.x2, resolvedX.unit)}</span>
                      <span>High: &gt; {formatBivariateValue(cutoffs.x2, resolvedX.unit)}</span>
                    </div>
                  )}
                </div>

                {/* Y-Axis Threshold Sliders & Visual Dual-Bracket Track */}
                <div className="space-y-2.5 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
                  <div className="flex items-center justify-between text-[11px] font-bold text-purple-950 dark:text-purple-200 gap-2">
                    <span className="truncate">
                      Y-Axis: {resolvedY.label} <span className="text-[10px] text-zinc-500 font-normal">({resolvedY.unit})</span>
                    </span>
                    <span className="text-[10px] font-bold font-mono tabular-nums text-teal-800 dark:text-teal-300 shrink-0">
                      T1 {thresholds.pY1}% · T2 {thresholds.pY2}%
                    </span>
                  </div>

                  {/* Continuous Visual Range Track Bar with Color Zones */}
                  <div className="space-y-1">
                    <div className="relative h-4 w-full rounded-md overflow-hidden flex border border-purple-200/80 dark:border-purple-800/80 shadow-2xs">
                      <div
                        style={{ width: `${thresholds.pY1}%` }}
                        className="h-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-[9px] text-zinc-800 dark:text-zinc-200 font-bold overflow-hidden"
                      >
                        Low ({thresholds.pY1}%)
                      </div>
                      <div
                        style={{ width: `${thresholds.pY2 - thresholds.pY1}%` }}
                        className="h-full bg-teal-200 dark:bg-teal-800/60 flex items-center justify-center text-[9px] text-teal-950 dark:text-teal-100 font-bold overflow-hidden border-x border-teal-400/50"
                      >
                        Mid
                      </div>
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
                    <label className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 w-28 shrink-0 font-medium">Bracket 1 (Low/Mid):</span>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="1"
                        aria-label={`Y-axis Bracket 1 percentile for ${resolvedY.label}`}
                        value={thresholds.pY1}
                        onChange={(e) => handleUpdateThreshold('pY1', Number(e.target.value))}
                        className="w-full accent-teal-600 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                      />
                      <span className="text-[10px] font-bold w-12 text-right tabular-nums">{thresholds.pY1}%</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 w-28 shrink-0 font-medium">Bracket 2 (Mid/High):</span>
                      <input
                        type="range"
                        min="40"
                        max="95"
                        step="1"
                        aria-label={`Y-axis Bracket 2 percentile for ${resolvedY.label}`}
                        value={thresholds.pY2}
                        onChange={(e) => handleUpdateThreshold('pY2', Number(e.target.value))}
                        className="w-full accent-teal-600 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                      />
                      <span className="text-[10px] font-bold w-12 text-right tabular-nums">{thresholds.pY2}%</span>
                    </label>
                  </div>

                  {cutoffs && (
                    <div className="pt-2 border-t border-purple-200/50 dark:border-purple-900/30 flex items-center justify-between text-[10px] text-zinc-600 dark:text-zinc-400 tabular-nums">
                      <span>Low: &lt; {formatBivariateValue(cutoffs.y1, resolvedY.unit)}</span>
                      <span>Mid: {formatBivariateValue(cutoffs.y1, resolvedY.unit)}–{formatBivariateValue(cutoffs.y2, resolvedY.unit)}</span>
                      <span>High: &gt; {formatBivariateValue(cutoffs.y2, resolvedY.unit)}</span>
                    </div>
                  )}
                </div>
              </div>

              {filteredTableRows.length > 0 && (
                <ChartAccessibleTable
                  caption={`Bivariate classification table comparing ${resolvedX.label} and ${resolvedY.label} across African nations`}
                  summaryLabel={lockedCell || hoveredCell ? 'Inspect selected quadrant nations' : 'Inspect continental bivariate matrix table'}
                  headers={['Nation', 'UN Region', `${resolvedX.shortLabel} (${resolvedX.unit})`, `${resolvedY.shortLabel} (${resolvedY.unit})`, 'Quadrant']}
                  rows={filteredTableRows}
                />
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
};

export default BivariateMapTray;
