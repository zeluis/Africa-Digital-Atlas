import React, { useState } from 'react';
import { EthnicTreeCanvas } from '../components/ethnicTree/EthnicTreeCanvas';
import { ActualSvgOverlayViewer } from '../components/ethnicTree/ActualSvgOverlayViewer';
import { 
  Sparkles, 
  Layers, 
  BookOpen, 
  Scale, 
  Dna, 
  Anchor, 
  FileText, 
  Share2, 
  HelpCircle,
  Download,
  FileCode,
  Compass
} from 'lucide-react';
import { TOTAL_AFRICAN_ETHNICITIES_INDEXED, TOTAL_COUNTRIES_INDEXED } from '../data/ethnicTreeData';

interface EthnicTreeOfLifeViewProps {
  onSelectReport?: (reportId: string) => void;
  onNavigateToSlaveTrade?: () => void;
}

export const EthnicTreeOfLifeView: React.FC<EthnicTreeOfLifeViewProps> = ({
  onSelectReport,
  onNavigateToSlaveTrade
}) => {
  const [showMethodologyModal, setShowMethodologyModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'actual-svg' | 'algorithmic-tree'>('actual-svg');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300" id="ethnic-tree-of-life-view">
      {/* Top Header Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transatlantic Genealogical &amp; Demographic Atlas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-900 dark:text-white font-serif">
              African Ethnic Lineages &amp; Tree of Life
            </h1>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              An interactive cartographic synthesis tracing African ethnic groups, sovereign territories, and demographic flows across the Transatlantic Slave Trade. Explore concentric embarkation cores, regional branch conduits, and direct scholarly citations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* View Mode Toggle Pill */}
            <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl">
              <button
                type="button"
                onClick={() => setViewMode('actual-svg')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'actual-svg'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Actual SVG + Overlay</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('algorithmic-tree')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'algorithmic-tree'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Algorithmic Graph</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowMethodologyModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-all cursor-pointer shadow-xs"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Methodology</span>
            </button>

            {onNavigateToSlaveTrade && (
              <button
                type="button"
                onClick={onNavigateToSlaveTrade}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-md"
              >
                <Anchor className="w-4 h-4" />
                <span>Voyages Flows</span>
              </button>
            )}
          </div>
        </div>

        {/* Statistical Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Sovereign Conduits</div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-white mt-0.5">
              {TOTAL_COUNTRIES_INDEXED} Countries
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Lineages Indexed</div>
            <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
              150+ Groups
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Primary Core Hubs</div>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              3 Embarkation Zones
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Mode Active</div>
            <div className="text-xs font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">
              {viewMode === 'actual-svg' ? 'Non-Destructive SVG Overlay' : 'Dynamic Graph Matrix'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Fullscreen Canvas Area */}
      <div className="h-[750px] lg:h-[880px] w-full">
        {viewMode === 'actual-svg' ? (
          <ActualSvgOverlayViewer
            onSelectReport={onSelectReport}
            onNavigateToSlaveTrade={onNavigateToSlaveTrade}
          />
        ) : (
          <EthnicTreeCanvas 
            onSelectReport={onSelectReport}
            onNavigateToSlaveTrade={onNavigateToSlaveTrade}
          />
        )}
      </div>

      {/* Methodology & Data Provenance Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Cartographic & Quantitative Methodology
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMethodologyModal(false)}
                className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <p>
                <strong>Radial Geometry:</strong> The visualization models the spatial and demographic dispersal of African ethnic communities impacted by the Transatlantic Slave Trade (1501–1867). Country conduits radiate outward based on historical coastal proximity and trade volume.
              </p>
              <p>
                <strong>Quantitative Calibration:</strong> Circle radius correlates with estimated aggregate representation in the Transatlantic Slave Trade voyages database and regional port embarkation records (ranging from 0.5% to 24.8%).
              </p>
              <p>
                <strong>Cross-Referencing:</strong> Every ethnic node is indexed with its verified Wikipedia slug and linked to the research papers in the <em>Research & Reports</em> repository, allowing researchers to inspect full genetic, material, and legal documentation.
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMethodologyModal(false)}
                className="px-5 py-2.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Close & Return to Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
