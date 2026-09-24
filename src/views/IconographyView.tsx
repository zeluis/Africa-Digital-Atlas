import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, Image as ImageIcon, RefreshCw, Calendar, Tag } from 'lucide-react';
import { SLAVE_TRADE_ILLUSTRATIONS, SlaveTradeIllustration } from '../data/slaveTradeIllustrations';
import { SlaveTradeIconography } from '../components/slaveVoyages/SlaveTradeIconography';
import { ArchivalLoupeModal } from '../components/slaveVoyages/ArchivalLoupeModal';

// Curated selection of visually striking, high-detail plates
const HERO_IMAGE_CANDIDATES = [17, 18, 19, 20, 731, 732, 735, 788, 789, 790, 831, 835, 1021, 1028, 1032, 1042];

interface HeroState {
  illustration: SlaveTradeIllustration | undefined;
  id: number;
  url: string;
  title: string;
  date?: string;
  category?: string;
}

const getCandidateState = (excludeId?: number): HeroState => {
  const available = HERO_IMAGE_CANDIDATES.filter(id => id !== excludeId);
  const selectedId = available[Math.floor(Math.random() * available.length)] || HERO_IMAGE_CANDIDATES[0];
  const match = SLAVE_TRADE_ILLUSTRATIONS.find(item => item.objectId === selectedId);
  return {
    illustration: match,
    id: selectedId,
    url: match?.imageUrls?.[0] || 'https://si.regeneratedidentities.org/project/DataFiles/SI-OB-17/17-4.jpg',
    title: match?.title || 'Slave Ship Stowage Plan',
    date: match?.date || 'c. 1789',
    category: match?.itemSets?.[0] || match?.collectionNames?.[0] || 'Historical Engraving'
  };
};

export const IconographyView: React.FC = () => {
  const [heroState, setHeroState] = useState<HeroState>(() => getCandidateState());
  const [inspectedIllustration, setInspectedIllustration] = useState<SlaveTradeIllustration | null>(null);

  const rotateHeroImage = useCallback(() => {
    setHeroState(prev => getCandidateState(prev.id));
  }, []);

  useEffect(() => {
    // Auto-cycle every 14 seconds with a smooth, controlled cross-fade effect
    const interval = setInterval(() => {
      rotateHeroImage();
    }, 14000);

    return () => clearInterval(interval);
  }, [rotateHeroImage]);

  return (
    <div className="space-y-8 pb-16">
      {/* Edge-to-Edge Editorial Hero Banner (Drawer Edge to Window Edge) */}
      <div className="relative -mx-4 sm:-mx-6 md:-mx-8 border-y border-stone-200/90 dark:border-stone-800/90 bg-[#FAF8F5] dark:bg-stone-950 overflow-hidden min-h-[380px] sm:min-h-[420px] flex items-center transition-colors duration-500">
        
        {/* Controlled Archival Background Plate with Seamless Cross-Fade */}
        <div className="absolute inset-0 z-0 select-none overflow-hidden">
          <AnimatePresence mode="popLayout">
            {heroState.url && (
              <motion.div
                key={heroState.url}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 0.28, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0 bg-cover bg-right md:bg-center sepia-[0.18] contrast-125 brightness-95 dark:brightness-85 dark:contrast-120 dark:opacity-20 mix-blend-multiply dark:mix-blend-luminosity"
                style={{ backgroundImage: `url(${heroState.url})` }}
              />
            )}
          </AnimatePresence>
          
          {/* Editorial Asymmetric Scrim: High Clarity for Text while allowing rich artwork presence */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent dark:from-stone-950 dark:via-stone-950/85 dark:to-transparent w-full md:w-3/4 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-[#FAF8F5]/40 dark:from-stone-950 dark:via-transparent dark:to-stone-950/40 pointer-events-none" />
        </div>

        {/* Hero Content Grid with Editorial Typography & Archival Plate Citation */}
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 text-left">
          <div className="max-w-3xl space-y-4 md:space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/10 dark:bg-amber-400/10 border border-amber-900/15 dark:border-amber-400/20 text-amber-900 dark:text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-700 dark:text-amber-400" />
                <span>Exhibition Plate No. SI-OB-{heroState.id}</span>
              </div>

              {/* Tactile Manual Swap Button */}
              <button 
                onClick={rotateHeroImage}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200/60 hover:bg-stone-300/80 dark:bg-stone-800/60 dark:hover:bg-stone-700/80 transition-all text-[11px] font-mono text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 cursor-pointer shadow-2xs"
                title="Cross-fade to another archival engraving"
              >
                <RefreshCw className="w-3 h-3 text-amber-800 dark:text-amber-400" />
                <span>Next Plate</span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight leading-tight text-stone-900 dark:text-stone-100 max-w-2xl drop-shadow-2xs">
              Visualizing Confinement &amp; Liberation: <span className="text-amber-900 dark:text-amber-400 font-serif italic">The Historical Iconography</span> of the Middle Passage
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-800 dark:text-stone-200 font-serif leading-relaxed max-w-2xl">
              Step into a comprehensive visual registry of the transatlantic crossing. This archival repository recovers over 1,200 engravings, watercolors, and diagrams from the 16th to 19th centuries, documenting the material conditions of slavery and the resilient spirit of pre-colonial African societies.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-600 dark:text-stone-400 pt-1">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                <span className="font-semibold">1,220 Hand-Indexed Plates</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                <span className="font-semibold">Full High-Res Scans</span>
              </span>
            </div>
          </div>

          {/* Archival Showcase Card on Large Screens */}
          <div className="hidden lg:block shrink-0">
            <motion.div 
              key={heroState.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                if (heroState.illustration) {
                  setInspectedIllustration(heroState.illustration);
                }
              }}
              className="w-72 bg-[#FAF8F5]/90 dark:bg-stone-900/90 backdrop-blur-md p-4 rounded-2xl border border-stone-300/80 dark:border-stone-700/80 shadow-md space-y-3 cursor-pointer hover:border-amber-500/50 hover:shadow-lg transition-all group"
            >
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950">
                <img 
                  src={heroState.url} 
                  alt={heroState.title}
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-stone-900/80 text-amber-400 text-[9px] font-mono font-bold">
                  SI-OB-{heroState.id}
                </div>
                <div className="absolute inset-0 bg-amber-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-2.5 py-1 rounded-lg bg-stone-900/90 text-amber-300 font-mono text-[10px] font-bold shadow-md">
                    Inspect in Loupe 🔍
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                  {heroState.title}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200/80 dark:border-stone-800/80">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                    {heroState.date || 'Historical'}
                  </span>
                  <span className="flex items-center gap-1 max-w-[120px] truncate" title={heroState.category}>
                    <Tag className="w-3 h-3 text-amber-700 dark:text-amber-400 shrink-0" />
                    <span className="truncate">{heroState.category}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Embedded Main Iconography Interactive Panel */}
      <div className="px-1">
        <SlaveTradeIconography />
      </div>

      {/* Loupe Modal for Hero Card Click */}
      <ArchivalLoupeModal
        illustration={inspectedIllustration}
        onClose={() => setInspectedIllustration(null)}
      />
    </div>
  );
};
