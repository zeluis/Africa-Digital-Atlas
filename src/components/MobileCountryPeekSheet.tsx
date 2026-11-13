import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CountryFlag } from './CountryFlag';
import { 
  X, 
  ChevronRight, 
  ChevronUp,
  MapPin, 
  Users, 
  DollarSign, 
  Award, 
  Globe2, 
  Compass, 
  Layers,
  ExternalLink,
  Share2
} from 'lucide-react';
import { formatPopulation, formatGDP, formatHDI } from '../data/atlas-formatters';
import { AFRICA_FINAL_MAP } from '../data/africaFinalGeometry';
import { triggerHaptic } from '../utils/mobileHaptics';
import { usePrefersReducedMotion } from '../utils/motion';
import { atlas } from '../data/atlas-store';

export type SheetSnapTier = 'peek' | 'half' | 'full';

export interface MobileCountryPeekSheetProps {
  countryId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDossier: (countryId: string) => void;
  onOpenCompare?: (countryId: string) => void;
}

export const MobileCountryPeekSheet: React.FC<MobileCountryPeekSheetProps> = ({
  countryId,
  isOpen,
  onClose,
  onOpenDossier,
  onOpenCompare
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const dragStartY = useRef<number | null>(null);
  const dragStartTime = useRef<number>(0);
  const lastTouchY = useRef<number | null>(null);

  // Standardized 3-tier snap levels: 'peek' (25%) | 'half' (55%) | 'full' (92%)
  const [snapTier, setSnapTier] = useState<SheetSnapTier>('half');

  // Reset to 'half' whenever a new country is opened
  useEffect(() => {
    if (isOpen && countryId) {
      setSnapTier('half');
    }
  }, [countryId, isOpen]);

  const country = countryId ? AFRICA_FINAL_MAP[countryId] : null;
  const entityData = countryId ? atlas.getEntity(countryId) : null;

  // Touch gesture handling with velocity detection for smooth inertia snapping & dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    lastTouchY.current = e.touches[0].clientY;
    dragStartTime.current = performance.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    lastTouchY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (dragStartY.current === null || lastTouchY.current === null) {
      dragStartY.current = null;
      lastTouchY.current = null;
      return;
    }

    const dy = lastTouchY.current - dragStartY.current;
    const dt = Math.max(performance.now() - dragStartTime.current, 10);
    const velocity = dy / dt; // px per ms

    // High downward velocity or large distance: dismiss or snap down
    if (velocity > 0.65 || dy > 110) {
      if (snapTier === 'full') {
        triggerHaptic('light');
        setSnapTier('half');
      } else if (snapTier === 'half') {
        triggerHaptic('light');
        setSnapTier('peek');
      } else {
        triggerHaptic('medium');
        onClose();
      }
    } 
    // High upward velocity or upward swipe: snap up
    else if (velocity < -0.5 || dy < -80) {
      if (snapTier === 'peek') {
        triggerHaptic('light');
        setSnapTier('half');
      } else if (snapTier === 'half') {
        triggerHaptic('light');
        setSnapTier('full');
      }
    }

    dragStartY.current = null;
    lastTouchY.current = null;
  };

  if (!isOpen || !country || !countryId) return null;

  const population = atlas.getIndicatorValue(countryId, 'SP.POP.TOTL');
  const gdp = atlas.getIndicatorValue(countryId, 'NY.GDP.MKTP.CD');
  const hdi = atlas.getIndicatorValue(countryId, 'UNDP.HDI.INDEX');
  const lifeExp = atlas.getIndicatorValue(countryId, 'SP.DYN.LE00.IN');
  const capital = entityData?.capital;
  const blocs = entityData?.blocs || [];
  const areaKm2 = entityData?.landAreaKm2;
  const geoType = entityData?.geographicType;

  // Exact standardized viewport snap points:
  // peek = 25% height (compact glance)
  // half = 55% height (macro indicators)
  // full = 92% height (full-bleed dossier reader)
  const snapHeights = {
    peek: 'h-[max(168px,26dvh)] max-h-[36dvh]',
    half: 'h-[56dvh] max-h-[56dvh]',
    full: 'h-[92dvh] max-h-[92dvh]'
  };

  const cycleSnapTier = () => {
    triggerHaptic('selection');
    setSnapTier((prev) => (prev === 'peek' ? 'half' : prev === 'half' ? 'full' : 'half'));
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-x-0 bottom-0 z-50 lg:hidden pointer-events-auto touch-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Quick overview for ${country.name}`}
      >
        {/* Backdrop for outside tap dismiss (only active in half or full tier) */}
        {snapTier !== 'peek' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/35 backdrop-blur-[2px] transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Sliding 3-Snap Bottom Sheet Container */}
        <motion.div
          ref={sheetRef}
          initial={reducedMotion ? { opacity: 0 } : { y: '100%' }}
          animate={reducedMotion ? { opacity: 1 } : { y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { y: '100%' }}
          transition={reducedMotion ? { duration: 0.1 } : { type: 'spring', damping: 28, stiffness: 320 }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`relative bg-white dark:bg-zinc-900 rounded-t-3xl border-t border-zinc-200/90 dark:border-zinc-800 shadow-2xl safe-pb px-4 flex flex-col select-none transition-all duration-300 ${snapHeights[snapTier]}`}
        >
          {/* Tactile Ergonomic Grab Handle Bar */}
          <button
            type="button"
            onClick={cycleSnapTier}
            className="w-full pt-2.5 pb-2 shrink-0 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center gap-1"
            title="Drag or tap to change view height"
            aria-label={`Change sheet height (currently ${snapTier})`}
          >
            <span className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors" aria-hidden="true" />
            <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              <span>{snapTier === 'peek' ? 'Peek 25%' : snapTier === 'half' ? 'Indicators 55%' : 'Full Dossier 92%'}</span>
              <ChevronUp className={`w-3 h-3 transition-transform ${snapTier === 'full' ? 'rotate-180' : ''}`} />
            </span>
          </button>

          {/* Sheet Header: Flag, Name, Code, Region & Close Button */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-8 rounded-md overflow-hidden shrink-0 shadow-xs border border-zinc-200 dark:border-zinc-800">
                <CountryFlag entityId={countryId} size="md" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 text-start">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate leading-tight">
                  {country.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
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
              className="min-touch-target p-2 -mr-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
              aria-label="Close country preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tier Content: Peek Mode (25%) Summary */}
          {snapTier === 'peek' && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setSnapTier('half');
              }}
              className="w-full flex-1 flex items-center justify-between py-2 text-start cursor-pointer active:opacity-80"
            >
              <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-300 font-mono">
                <span>Pop: <strong className="text-zinc-900 dark:text-zinc-100">{population ? formatPopulation(population) : '—'}</strong></span>
                <span aria-hidden="true">·</span>
                <span>GDP: <strong className="text-zinc-900 dark:text-zinc-100">{gdp ? formatGDP(gdp) : '—'}</strong></span>
              </div>
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span>Expand</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          )}

          {/* Tier Content: Half Mode (55%) & Full Mode (92%) */}
          {snapTier !== 'peek' && (
            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 sleek-scrollbar-amber py-3 space-y-3 text-start">
              {/* Macro Indicators Row */}
              <div className="grid grid-cols-3 gap-2">
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

              {/* Extended Details available in Full Tier (92%) */}
              {snapTier === 'full' && (
                <div className="space-y-3 pt-1">
                  {/* Geographic & Regional Metadata (Zero-Pill formatting) */}
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400 font-medium">Official Name</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-right truncate max-w-[200px]">
                        {entityData?.officialName || country.name}
                      </span>
                    </div>
                    {areaKm2 && (
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500 dark:text-zinc-400 font-medium">Territorial Area</span>
                        <span className="font-mono text-zinc-800 dark:text-zinc-200">
                          {areaKm2.toLocaleString()} km²
                        </span>
                      </div>
                    )}
                    {lifeExp && (
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500 dark:text-zinc-400 font-medium">Life Expectancy</span>
                        <span className="font-mono text-zinc-800 dark:text-zinc-200">
                          {lifeExp.toFixed(1)} years
                        </span>
                      </div>
                    )}
                    {geoType && (
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500 dark:text-zinc-400 font-medium">Topography</span>
                        <span className="text-zinc-800 dark:text-zinc-200">{geoType}</span>
                      </div>
                    )}
                  </div>

                  {/* Regional Economic Blocs membership */}
                  {blocs.length > 0 && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium text-zinc-500 uppercase tracking-wider text-[10px] block mb-1">
                        Regional Economic Blocs
                      </span>
                      <p className="font-mono text-zinc-800 dark:text-zinc-200">
                        {blocs.join(' · ')}
                      </p>
                    </div>
                  )}

                  {/* Curated Editorial Summary */}
                  {entityData?.summary && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1">
                      <span className="font-medium text-zinc-500 uppercase tracking-wider text-[10px] block mb-1">
                        Context &amp; Geography
                      </span>
                      <p className="line-clamp-4">{entityData.summary}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('medium');
                    onOpenDossier(countryId);
                    onClose();
                  }}
                  className="flex-1 h-12 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm active-tactile cursor-pointer"
                >
                  <span>Open Full Country Dossier</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {onOpenCompare && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      onOpenCompare(countryId);
                      onClose();
                    }}
                    className="h-12 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 active-tactile cursor-pointer"
                    title="Compare this nation against other African states"
                  >
                    <Layers className="w-4 h-4 text-zinc-500" />
                    <span>Compare</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MobileCountryPeekSheet;
