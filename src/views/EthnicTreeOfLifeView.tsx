import React from 'react';
import { AfriataExplorer } from '../components/ethnicTree/AfriataExplorer';

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
      aria-label="Afriata Ethnic Tree of Life Cartographic Explorer"
      className="relative flex-1 w-full h-[calc(100dvh-64px)] min-h-[640px] overflow-hidden flex flex-col bg-[#161412]"
    >
      {/* Full-Screen Sovereign Cartography Engine displaying the authentic raw SVG with 100% fidelity */}
      <AfriataExplorer
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
