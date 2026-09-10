import React from 'react';
import { AfricaliaExplorer } from '../components/ethnicTree/AfricaliaExplorer';

interface EthnicTreeOfLifeViewProps {
  onSelectReport?: (reportId: string) => void;
  onNavigateToSlaveTrade?: () => void;
}

export const EthnicTreeOfLifeView: React.FC<EthnicTreeOfLifeViewProps> = ({
  onSelectReport,
  onNavigateToSlaveTrade
}) => {
  return (
    <div 
      id="ethnic-tree-viewport-container" 
      className="relative flex-1 w-full h-[calc(100vh-64px)] min-h-[640px] overflow-hidden flex flex-col bg-[#161412]"
    >
      {/* Full-Screen Sovereign Cartography Engine displaying the authentic raw SVG with 100% fidelity */}
      <AfricaliaExplorer
        onSelectReport={onSelectReport}
        onNavigateToSlaveTrade={onNavigateToSlaveTrade}
      />
    </div>
  );
};
