import React from 'react';
import { AfricaliaExplorer } from '../components/ethnicTree/AfricaliaExplorer';

interface EthnicTreeOfLifeViewProps {
  onSelectReport?: (reportId: string) => void;
  onNavigateToSlaveTrade?: () => void;
  onNavigateToMolecular?: () => void;
  onNavigateToFoundations?: () => void;
  onNavigateToLanguages?: () => void;
}

export const EthnicTreeOfLifeView: React.FC<EthnicTreeOfLifeViewProps> = ({
  onSelectReport,
  onNavigateToSlaveTrade,
  onNavigateToMolecular,
  onNavigateToFoundations,
  onNavigateToLanguages
}) => {
  return (
    <section 
      id="ethnic-tree-viewport-container" 
      aria-label="Africalia Ethnic Tree of Life Cartographic Explorer"
      className="relative flex-1 w-full h-[calc(100dvh-64px)] min-h-[640px] overflow-hidden flex flex-col bg-[#161412]"
    >
      {/* Full-Screen Sovereign Cartography Engine displaying the authentic raw SVG with 100% fidelity */}
      <AfricaliaExplorer
        onSelectReport={onSelectReport}
        onNavigateToSlaveTrade={onNavigateToSlaveTrade}
        onNavigateToMolecular={onNavigateToMolecular}
        onNavigateToFoundations={onNavigateToFoundations}
        onNavigateToLanguages={onNavigateToLanguages}
      />
    </section>
  );
};

export default EthnicTreeOfLifeView;
