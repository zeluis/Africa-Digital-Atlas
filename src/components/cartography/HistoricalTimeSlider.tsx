import React from 'react';
import { Clock, History, Calendar } from 'lucide-react';

export interface HistoricalEpoch {
  year: number;
  label: string;
  description: string;
}

export const HISTORICAL_EPOCHS: HistoricalEpoch[] = [
  { year: 1650, label: '1650 CE: Pre-Colonial Kingdoms', description: 'Era of flourishing African sovereign states, trans-Saharan trade networks, and early coastal maritime exchanges.' },
  { year: 1750, label: '1750 CE: Atlantic & Saharan Apex', description: 'Height of interconnected commercial states, gold-ivory-slave trade corridors, and Islamic scholarship centers.' },
  { year: 1850, label: '1850 CE: Exploration & Spheres', description: 'European coastal penetration, interior African kingdom realignments, and expanding trade routes.' },
  { year: 1885, label: '1885 CE: Berlin Conference Partition', description: 'Formal colonial partition of the continent following the Berlin Conference of 1884–1885.' },
  { year: 1960, label: '1960 CE: Independence Wave', description: 'Year of Africa: 17 nations gain independence, sparking the modern sovereign map.' },
  { year: 2026, label: '2026 CE: Modern AfCFTA Era', description: 'Continental Free Trade Area, digital transformation, and sovereign economic resurgence.' }
];

interface HistoricalTimeSliderProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
  isEnabled: boolean;
  onToggleEnabled: () => void;
}

export const HistoricalTimeSlider: React.FC<HistoricalTimeSliderProps> = ({
  selectedYear,
  onSelectYear,
  isEnabled,
  onToggleEnabled
}) => {
  const currentEpoch = HISTORICAL_EPOCHS.find(e => e.year === selectedYear) || HISTORICAL_EPOCHS[HISTORICAL_EPOCHS.length - 1];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-4 select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleEnabled}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              isEnabled
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Historical Boundary Mode {isEnabled ? 'ON' : 'OFF'}</span>
          </button>
          <span className="text-xs font-serif italic text-stone-500 dark:text-stone-400">
            {currentEpoch.label}
          </span>
        </div>
        <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
          {selectedYear} CE
        </div>
      </div>

      {isEnabled && (
        <div className="space-y-2 mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="flex justify-between gap-1">
            {HISTORICAL_EPOCHS.map(epoch => {
              const active = epoch.year === selectedYear;
              return (
                <button
                  key={epoch.year}
                  type="button"
                  onClick={() => onSelectYear(epoch.year)}
                  className={`flex-1 py-1 px-1 rounded-lg text-center transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-900 text-amber-100 font-bold shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 text-[11px]'
                  }`}
                >
                  <div className="font-mono text-xs">{epoch.year}</div>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-stone-600 dark:text-stone-400 font-sans leading-relaxed px-1">
            {currentEpoch.description}
          </p>
        </div>
      )}
    </div>
  );
};
