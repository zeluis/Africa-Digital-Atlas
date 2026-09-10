import React, { useState } from 'react';
import { AfricaliaExplorer } from '../components/ethnicTree/AfricaliaExplorer';
import { ActualSvgOverlayViewer } from '../components/ethnicTree/ActualSvgOverlayViewer';
import { EthnicTreeCanvas } from '../components/ethnicTree/EthnicTreeCanvas';
import { 
  TreeDeciduous, 
  Layers, 
  FileCode,
  Sparkles,
  HelpCircle,
  Anchor
} from 'lucide-react';

interface EthnicTreeOfLifeViewProps {
  onSelectReport?: (reportId: string) => void;
  onNavigateToSlaveTrade?: () => void;
}

export const EthnicTreeOfLifeView: React.FC<EthnicTreeOfLifeViewProps> = ({
  onSelectReport,
  onNavigateToSlaveTrade
}) => {
  const [viewMode, setViewMode] = useState<'africalia-master' | 'actual-svg' | 'algorithmic-tree'>('africalia-master');

  return (
    <div 
      id="ethnic-tree-viewport-container" 
      className="relative flex-1 w-full h-[calc(100vh-64px)] min-h-[640px] overflow-hidden flex flex-col bg-[#f4f1ea] dark:bg-[#121510]"
    >
      {/* Full-Screen Sovereign Cartography Engine */}
      {viewMode === 'africalia-master' ? (
        <AfricaliaExplorer
          onSelectReport={onSelectReport}
          onNavigateToSlaveTrade={onNavigateToSlaveTrade}
        />
      ) : viewMode === 'actual-svg' ? (
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

      {/* Subtle Bottom Mode Switcher Pill */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center p-1 bg-[#fbfaf7]/90 dark:bg-[#181c16]/90 border border-black/10 dark:border-white/15 backdrop-blur-md rounded-full shadow-lg">
        <button
          type="button"
          onClick={() => setViewMode('africalia-master')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'africalia-master'
              ? 'bg-[#486834] text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <TreeDeciduous className="w-3 h-3" />
          <span>Africalia Master</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('actual-svg')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'actual-svg'
              ? 'bg-amber-500 text-black shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <FileCode className="w-3 h-3" />
          <span>Raw SVG Mode</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('algorithmic-tree')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'algorithmic-tree'
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>Algorithmic Canvas</span>
        </button>
      </div>
    </div>
  );
};
