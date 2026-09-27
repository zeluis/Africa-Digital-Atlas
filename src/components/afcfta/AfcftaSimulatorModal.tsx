import React from 'react';
import { AfcftaTradeCorridorSimulator } from './AfcftaTradeCorridorSimulator';
import { AfricanRegion } from '../../data/types';

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
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <AfcftaTradeCorridorSimulator
          initialRegion={initialRegion}
          initialCorridorId={initialCorridorId}
          onSelectCountry={onSelectCountry}
          onClose={onClose}
          isModal={true}
        />
      </div>
    </div>
  );
};
