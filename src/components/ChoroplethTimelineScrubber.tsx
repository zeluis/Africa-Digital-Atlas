import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Calendar, Sparkles, Clock } from 'lucide-react';

interface ChoroplethTimelineScrubberProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  metricName: string;
  metricUnit?: string;
  continentalMean?: number;
}

const HISTORICAL_EPOCHS: Record<number, string> = {
  1990: 'Post-Cold War Realignments & Democratic Waves',
  1994: 'Post-Apartheid South Africa & Continental Reconstruction',
  2000: 'UN Millennium Declaration (MDGs Era Begins)',
  2002: 'Inaugural African Union (AU) Assembly in Durban',
  2008: 'Global Commodity Supercycle & Infrastructure Expansion',
  2010: 'Mobile Money Revolution & Broadband Fiber Landings',
  2015: 'UN Sustainable Development Goals (SDGs) & AU Agenda 2063',
  2019: 'AfCFTA Operational Phase Launched in Niamey',
  2020: 'Pandemic Resilience & Digital Acceleration',
  2024: 'Harmonized Pan-African Multilateral Baseline'
};

const KEY_DECADE_MARKERS = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024];

export const ChoroplethTimelineScrubber: React.FC<ChoroplethTimelineScrubberProps> = ({
  currentYear,
  onYearChange,
  isPlaying,
  onTogglePlay,
  metricName,
  metricUnit = '',
  continentalMean
}) => {
  const [playSpeed, setPlaySpeed] = useState<number>(1.0); // 0.5, 1.0, 2.0
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Autoplay loop timer with variable speed
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(650 / playSpeed);
      timerRef.current = setInterval(() => {
        onYearChange(currentYear >= 2024 ? 1990 : currentYear + 1);
      }, intervalMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentYear, playSpeed, onYearChange]);

  const nearestEpoch = Object.entries(HISTORICAL_EPOCHS)
    .map(([yr, desc]) => ({ year: Number(yr), desc }))
    .filter(e => e.year <= currentYear)
    .sort((a, b) => b.year - a.year)[0]?.desc || 'Pan-African Development Horizon';

  const formatMean = (val?: number) => {
    if (val === undefined || isNaN(val)) return null;
    if (val >= 1000) return val.toLocaleString(undefined, { maximumFractionDigits: 1 });
    return val.toFixed(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="border-b border-emerald-500/20 bg-emerald-50/80 dark:bg-emerald-950/40 backdrop-blur-md px-3 sm:px-6 py-2.5"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Playback Controls & Year Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onTogglePlay}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
            }`}
            title={isPlaying ? 'Pause time-series animation' : 'Play time-series 1990–2024'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onYearChange(Math.max(1990, currentYear - 1))}
              disabled={currentYear <= 1990}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 disabled:opacity-40 cursor-pointer"
              title="Step backward 1 year"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onYearChange(Math.min(2024, currentYear + 1))}
              disabled={currentYear >= 2024}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 disabled:opacity-40 cursor-pointer"
              title="Step forward 1 year"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onYearChange(2024)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-600 transition-colors cursor-pointer"
              title="Reset to latest 2024 observation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Speed Toggle */}
            <div className="flex items-center ml-1 bg-white/70 dark:bg-zinc-900/70 p-0.5 rounded-lg border border-emerald-200/80 dark:border-emerald-800/80">
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPlaySpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                    playSpeed === s
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-emerald-700'
                  }`}
                  title={`Play at ${s}x speed`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col pl-1 border-l border-emerald-300 dark:border-emerald-800">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black font-mono font-tabular tabular-nums text-emerald-950 dark:text-emerald-100 tracking-tight">
                {currentYear}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400">
                {currentYear === 2024 ? 'Latest' : `${2024 - currentYear}y ago`}
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 truncate max-w-[200px] sm:max-w-none">
              {nearestEpoch}
            </span>
          </div>
        </div>

        {/* Interactive Scrub Range Slider & Decade Jump Buttons */}
        <div className="flex-1 max-w-2xl flex flex-col gap-1.5 min-w-0">
          <div className="relative flex items-center">
            <input
              type="range"
              min="1990"
              max="2024"
              step="1"
              value={currentYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-emerald-200 dark:bg-emerald-900/60 rounded-lg"
            />
          </div>

          {/* Quick Decade Jump Pill Badges */}
          <div className="flex items-center justify-between text-[10px] font-mono">
            {KEY_DECADE_MARKERS.map(yr => {
              const isActive = currentYear === yr;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => onYearChange(yr)}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-300'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>

        {/* Continental Metric Status Capsule */}
        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-emerald-200 dark:border-emerald-800 shrink-0 text-xs">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate max-w-[150px]">
              {metricName}
            </span>
            {continentalMean !== undefined && (
              <span className="font-mono font-bold font-tabular tabular-nums text-emerald-900 dark:text-emerald-200 text-xs">
                Avg: {formatMean(continentalMean)} {metricUnit}
              </span>
            )}
          </div>
          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
