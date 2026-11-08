import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CountryFlag } from './CountryFlag';
import { X, ChevronRight, MapPin, Users, DollarSign, Award } from 'lucide-react';
import { formatPopulation, formatGDP, formatHDI } from '../data/atlas-formatters';
import { AFRICA_FINAL_MAP } from '../data/africaFinalGeometry';
import { triggerHaptic } from '../utils/mobileHaptics';
import { atlas } from '../data/atlas-store';

export interface MobileCountryPeekSheetProps {
  countryId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDossier: (countryId: string) => void;
}

export const MobileCountryPeekSheet: React.FC<MobileCountryPeekSheetProps> = ({
  countryId,
  isOpen,
  onClose,
  onOpenDossier
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);

  const country = countryId ? AFRICA_FINAL_MAP[countryId] : null;
  const entityData = countryId ? atlas.getEntity(countryId) : null;

  // Handle touch-drag swipe down to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    if (dy > 80) {
      triggerHaptic('light');
      onClose();
      dragStartY.current = null;
    }
  };

  const handleTouchEnd = () => {
    dragStartY.current = null;
  };

  if (!isOpen || !country || !countryId) return null;

  const population = atlas.getIndicatorValue(countryId, 'SP.POP.TOTL');
  const gdp = atlas.getIndicatorValue(countryId, 'NY.GDP.MKTP.CD');
  const hdi = atlas.getIndicatorValue(countryId, 'UNDP.HDI.INDEX');
  const capital = entityData?.capital;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-x-0 bottom-0 z-50 lg:hidden pointer-events-auto touch-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Quick overview for ${country.name}`}
      >
        {/* Backdrop for outside tap dismiss */}
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity"
          aria-hidden="true"
        />

        {/* Sliding Bottom Sheet Container */}
        <motion.div
          ref={sheetRef}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative bg-white dark:bg-zinc-900 rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 shadow-2xl safe-pb pt-2 px-4 select-none max-h-[85dvh] flex flex-col"
        >
          {/* Tactile Grab Handle */}
          <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto my-2 shrink-0 cursor-grab active:cursor-grabbing" />

          {/* Sheet Header */}
          <div className="flex items-start justify-between gap-3 pt-1 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-8 rounded-md overflow-hidden shrink-0 shadow-xs border border-zinc-200 dark:border-zinc-800">
                <CountryFlag entityId={countryId} size="md" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate leading-tight">
                  {country.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">{countryId}</span>
                  <span aria-hidden="true">·</span>
                  <span>{country.unRegion}</span>
                  {capital && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="truncate flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                        {capital}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Close Button with >= 44px hit target */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="min-touch-target p-2 -mr-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close country preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Macro Indicators Row */}
          <div className="grid grid-cols-3 gap-2 py-3 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <Users className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Pop.</span>
              </div>
              <div className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1 tabular-nums">
                {population !== null && population !== undefined ? formatPopulation(population) : '—'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <DollarSign className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>GDP</span>
              </div>
              <div className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1 tabular-nums">
                {gdp !== null && gdp !== undefined ? formatGDP(gdp) : '—'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <Award className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>HDI</span>
              </div>
              <div className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1 tabular-nums">
                {hdi !== null && hdi !== undefined ? formatHDI(hdi) : '—'}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="py-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onOpenDossier(countryId);
                onClose();
              }}
              className="flex-1 h-12 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm active-tactile cursor-pointer"
            >
              <span>Open Country Dossier</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MobileCountryPeekSheet;
