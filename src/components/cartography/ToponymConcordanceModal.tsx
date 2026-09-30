import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { TOPONYM_CONCORDANCE_INDEX, ToponymConcordanceItem } from '../../data/preColonialKingdomsDetailed';
import { 
  Search, 
  MapPin, 
  Globe, 
  BookOpen, 
  X, 
  Crosshair, 
  ArrowRight, 
  Sparkles, 
  Filter 
} from 'lucide-react';

interface ToponymConcordanceModalProps {
  onClose: () => void;
  onLocateToponym: (item: ToponymConcordanceItem) => void;
}

export const ToponymConcordanceModal: React.FC<ToponymConcordanceModalProps> = ({
  onClose,
  onLocateToponym
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'polity' | 'metropolis' | 'coast' | 'mountain'>('all');

  const filteredItems = useMemo(() => {
    return TOPONYM_CONCORDANCE_INDEX.filter(item => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.antiqueName.toLowerCase().includes(q) ||
        item.indigenousName.toLowerCase().includes(q) ||
        item.modernName.toLowerCase().includes(q) ||
        item.modernCountry.toLowerCase().includes(q) ||
        item.plateSource.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, categoryFilter]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl bg-[#FAF7F2] dark:bg-[#181614] border border-[#E5DDD0] dark:border-[#38322B] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5DDD0] dark:border-[#38322B] flex items-center justify-between gap-4 shrink-0 bg-stone-100/60 dark:bg-stone-900/60">
          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Epistemological Cartography Index</span>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
              Toponymic Concordance Table (Archival Plates ⇄ Indigenous Names ⇄ 2026 Nations)
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-950/50 text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-3 sm:p-4 border-b border-[#E5DDD0] dark:border-[#38322B] flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/[0.01] dark:bg-white/[0.01] shrink-0">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search antique toponym or modern city..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs font-sans text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto text-xs font-mono font-bold">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              All ({TOPONYM_CONCORDANCE_INDEX.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('polity')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                categoryFilter === 'polity'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              Kingdoms / Polities
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('metropolis')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                categoryFilter === 'metropolis'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              Cities
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('coast')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                categoryFilter === 'coast'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              Coasts
            </button>
          </div>
        </div>

        {/* Concordance List Body with Sleek Scrollbar & Click-Through Bottom Fade */}
        <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto stable-gutter sleek-scrollbar-amber p-3 sm:p-5 space-y-2.5 text-left pb-10">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    "{item.antiqueName}"
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-mono text-stone-500 dark:text-stone-400">
                    {item.plateSource}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className="text-purple-700 dark:text-purple-300 font-semibold">
                    Indigenous: {item.indigenousName}
                  </span>
                  <ArrowRight className="w-3 h-3 text-stone-400" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                    2026: {item.modernName} ({item.modernCountry})
                  </span>
                </div>

                <p className="text-[11.5px] font-serif text-stone-600 dark:text-stone-400 leading-snug">
                  {item.note}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onLocateToponym(item)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-600 text-amber-900 dark:text-amber-200 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Locate on Curtain</span>
              </button>
            </div>
          ))}
          </div>

          {/* Click-Through Bottom Fade Overlay */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#FAF7F2] dark:from-[#181614] to-transparent pointer-events-none z-10" 
            aria-hidden="true" 
          />
        </div>
      </motion.div>
    </div>
  );
};
