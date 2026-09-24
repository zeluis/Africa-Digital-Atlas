import React from 'react';
import { motion } from 'motion/react';
import { Grid, Sparkles, Layers, ArrowRight, ArrowUp, Info } from 'lucide-react';

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

interface BivariateMapTrayProps {
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  hoveredCell: { x: number; y: number } | null;
  onHoverCell: (cell: { x: number; y: number } | null) => void;
  cellCounts: number[][];
}

export const BivariateMapTray: React.FC<BivariateMapTrayProps> = ({
  activePresetId,
  onSelectPreset,
  hoveredCell,
  onHoverCell,
  cellCounts
}) => {
  const activePreset = BIVARIATE_PRESETS.find(p => p.id === activePresetId) || BIVARIATE_PRESETS[0];

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
          <p className="text-[11px] text-purple-900/80 dark:text-purple-300/80 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>{activePreset.desc}</span>
            <span className="text-[10px] text-zinc-400 font-mono ml-1 hidden sm:inline">
              (X: {activePreset.labelX} • Y: {activePreset.labelY})
            </span>
          </p>
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
                        <span className={`text-[8px] font-mono font-bold ${y >= 1 && x >= 1 ? 'text-white' : 'text-zinc-800'}`}>
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
    </motion.div>
  );
};
