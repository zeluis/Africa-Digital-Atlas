import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SPRING_SNAPPY, usePrefersReducedMotion } from '../../utils/motion';
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
  const reducedMotion = usePrefersReducedMotion();

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/60 backdrop-blur-md overflow-hidden"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="afcfta-simulator-modal-title"
        >
          <motion.div 
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
            transition={SPRING_SNAPPY}
            className="w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl shadow-2xl border border-stone-200/90 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950"
            onClick={e => e.stopPropagation()}
          >
            <AfcftaTradeCorridorSimulator
              initialRegion={initialRegion}
              initialCorridorId={initialCorridorId}
              onSelectCountry={onSelectCountry}
              onClose={onClose}
              isModal={true}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AfcftaSimulatorModal;
