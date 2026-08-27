import React, { useState } from 'react';
import { EpistemicMode } from '../../data/slaveVoyagesTypes';
import { Info, HelpCircle, CheckCircle2, Sliders, AlertTriangle } from 'lucide-react';

interface EpistemicStatusBadgeProps {
  currentMode: EpistemicMode;
  onSelectMode?: (mode: EpistemicMode) => void;
  interactive?: boolean;
  showExplanation?: boolean;
  imputedCount?: number;
  observedCount?: number;
}

export const EpistemicStatusBadge: React.FC<EpistemicStatusBadgeProps> = ({
  currentMode,
  onSelectMode,
  interactive = true,
  showExplanation = false,
  imputedCount,
  observedCount
}) => {
  const [showModal, setShowModal] = useState(false);

  const getBadgeStyle = () => {
    switch (currentMode) {
      case 'observed':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300',
          dot: 'bg-emerald-500',
          label: 'Observed Archival Data',
          sub: 'Primary logbook & manifest records only'
        };
      case 'imputed':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300',
          dot: 'bg-amber-500',
          label: 'Observed + Imputed (IMP)',
          sub: 'Eltis-Richardson standard methodology'
        };
      case 'estimates':
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-800 dark:text-indigo-300',
          dot: 'bg-indigo-500',
          label: 'Historical Estimates Model',
          sub: 'Demographic macro-projections'
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      {/* Mode Selector Buttons */}
      {interactive && onSelectMode ? (
        <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs text-xs font-medium">
          <button
            onClick={() => onSelectMode('observed')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentMode === 'observed'
                ? 'bg-white dark:bg-zinc-800 text-emerald-800 dark:text-emerald-300 shadow-xs font-bold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
            title="Show only records explicitly documented in surviving logbooks and manifests"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Observed Data</span>
          </button>

          <button
            onClick={() => onSelectMode('imputed')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentMode === 'imputed'
                ? 'bg-white dark:bg-zinc-800 text-amber-800 dark:text-amber-300 shadow-xs font-bold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
            title="Recommended standard: Combines observed data with statistical imputation for missing variables"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Observed + Imputed</span>
          </button>

          <button
            onClick={() => onSelectMode('estimates')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentMode === 'estimates'
                ? 'bg-white dark:bg-zinc-800 text-indigo-800 dark:text-indigo-300 shadow-xs font-bold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
            title="Macro demographic estimates accounting for missing/clandestine voyages"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Historical Estimates</span>
          </button>
        </div>
      ) : (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-semibold ${style.bg}`}>
          <span className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`} />
          <span>{style.label}</span>
        </div>
      )}

      {/* Methodology Info Trigger */}
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-mono transition-colors px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
        aria-label="Epistemic status and methodology explanation"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Epistemic Note</span>
      </button>

      {/* Epistemic Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150 text-left">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                    Epistemic Certainty in SlaveVoyages
                  </h3>
                  <p className="text-xs text-zinc-500">Methodological distinction of quantitative data</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
              <p>
                A core principle of the <strong className="text-zinc-900 dark:text-zinc-100">SlaveVoyages</strong> project (David Eltis, David Richardson et al.) is that <em>not all historical numbers carry equal epistemic certainty</em>.
              </p>

              <div className="space-y-2 pt-1">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>1. Observed Archival Data</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                    Values recorded verbatim in surviving historical sources (customs ledgers, captain logbooks, port clearance registers). Many voyages only recorded either embarked or disembarked totals, resulting in partial totals.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>2. Observed + Imputed (IMP - Standard Model)</span>
                  </div>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                    Calculated using peer-reviewed statistical regression algorithms for the <strong>seven major imputed variables</strong>: Year, National Carrier, Tonnage, Port of Departure, Captives Embarked, Captives Disembarked, and Middle Passage Mortality.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-300 mb-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>3. Historical Estimates (Macro Demographic Bound)</span>
                  </div>
                  <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80">
                    Continental estimates estimating ~12.52 million embarked and ~10.70 million disembarked captives between 1501 and 1866, accounting for unrecorded early Portuguese voyages and clandestine post-1808 traffic.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
