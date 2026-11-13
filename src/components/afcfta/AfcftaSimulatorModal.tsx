import React from 'react';
import { SPRING_SNAPPY, usePrefersReducedMotion } from '../../utils/motion';
import { AfcftaTradeCorridorSimulator } from './AfcftaTradeCorridorSimulator';
import { AfricanRegion } from '../../data/types';
import { AtlasDialog } from '../common/AtlasDialog';

interface AfcftaSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRegion?: AfricanRegion;
  initialCorridorId?: string;
  onSelectCountry?: (countryId: string) => void;
}

export const AfcftaSimulatorModal: React.FC<AfcftaSimulatorModalProps> = ({
  isOpen,
  onClose,
  initialRegion,
  initialCorridorId,
  onSelectCountry
}) => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <AtlasDialog
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="afcfta-simulator-modal-title"
      overlayClassName="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 md:p-8 bg-black/60 backdrop-blur-md overflow-hidden"
      motionProps={{
        initial: reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 16 },
        animate: reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 },
        transition: reducedMotion ? { duration: 0.01 } : SPRING_SNAPPY
      }}
      className="w-full max-w-6xl max-h-[94dvh] sm:max-h-[92dvh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200/90 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 safe-pb"
    >
      <AfcftaTradeCorridorSimulator
        initialRegion={initialRegion}
        initialCorridorId={initialCorridorId}
        onSelectCountry={onSelectCountry}
        onClose={onClose}
        isModal={true}
      />
    </AtlasDialog>
  );
};

export default AfcftaSimulatorModal;
