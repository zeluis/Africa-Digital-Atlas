import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  Image as ImageIcon, 
  RefreshCw, 
  Calendar, 
  Tag, 
  Sliders, 
  MapPin, 
  Layers, 
  Download, 
  Compass, 
  HelpCircle, 
  Eye,
  Info,
  ArrowLeftRight
} from 'lucide-react';
import { SLAVE_TRADE_ILLUSTRATIONS, SlaveTradeIllustration } from '../data/slaveTradeIllustrations';
import { SlaveTradeIconography } from '../components/slaveVoyages/SlaveTradeIconography';
import { ArchivalLoupeModal } from '../components/slaveVoyages/ArchivalLoupeModal';
import { HISTORICAL_MAP_PLATES, HistoricalMapPlate } from '../data/archivalCartographyData';
import { HistoricalMapCurtainViewer } from '../components/cartography/HistoricalMapCurtainViewer';
import { AntiquePlateCanvas } from '../components/cartography/AntiquePlateCanvas';

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
  
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'registry' | 'cartography'>('registry');

  // Selected plate for HistoricalMapCurtainViewer
  const [selectedPlate, setSelectedPlate] = useState<HistoricalMapPlate>(HISTORICAL_MAP_PLATES[0]);

  const rotateHeroImage = useCallback(() => {
    setHeroState(prev => getCandidateState(prev.id));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      rotateHeroImage();
    }, 14000);
    return () => clearInterval(interval);
  }, [rotateHeroImage]);



  return (
    <div className="space-y-8 pb-16">
      {/* Edge-to-Edge Editorial Hero Banner */}
      <div className="relative -mx-4 sm:-mx-6 md:-mx-8 border-y border-stone-200/90 dark:border-stone-800/90 bg-[#FAF8F5] dark:bg-stone-950 overflow-hidden min-h-[380px] sm:min-h-[420px] flex items-center transition-colors duration-500">
        
        {/* Controlled Background */}
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
          
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent dark:from-stone-950 dark:via-stone-950/85 dark:to-transparent w-full md:w-3/4 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-[#FAF8F5]/40 dark:from-stone-950 dark:via-transparent dark:to-stone-950/40 pointer-events-none" />
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 text-left">
          <div className="max-w-3xl space-y-4 md:space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/10 dark:bg-amber-400/10 border border-amber-900/15 dark:border-amber-400/20 text-amber-900 dark:text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-700 dark:text-amber-400" />
                <span>Exhibition Plate No. SI-OB-{heroState.id}</span>
              </div>

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

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3 text-left">
        <button
          onClick={() => setActiveTab('registry')}
          className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'registry'
              ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Archival Plates Grid ({SLAVE_TRADE_ILLUSTRATIONS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cartography')}
          className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'cartography'
              ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-600" />
          <span className="relative">
            Georeferenced Historical Maps
          </span>
        </button>
      </div>

      {/* Tab Switchboard Content Area */}
      {activeTab === 'registry' ? (
        <div className="px-1">
          <SlaveTradeIconography />
        </div>
      ) : (
        /* Georeferenced Historical Cartography Opacity Curtain & Split View Workspace using HistoricalMapCurtainViewer */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Plate Selector Carousel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {HISTORICAL_MAP_PLATES.map(plate => {
              const isSelected = selectedPlate.id === plate.id;
              return (
                <button
                  key={plate.id}
                  onClick={() => setSelectedPlate(plate)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                      <AntiquePlateCanvas
                        plate={plate}
                        isThumbnail={true}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1.5 right-1.5 z-10 px-2 py-0.5 rounded-md bg-stone-900/90 text-amber-300 font-mono text-[9px] font-bold border border-amber-500/30">
                        {plate.year}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                        {plate.title}
                      </h4>
                      <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
                        {plate.cartographer}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 mt-2 flex items-center gap-1 font-semibold">
                    <span>{isSelected ? 'Loaded in Viewport' : 'Inspect Plate'}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Historical Map Curtain Viewer Component */}
          <HistoricalMapCurtainViewer selectedPlate={selectedPlate} />
        </div>
      )}

      {/* Loupe Modal for Hero Card Click */}
      <ArchivalLoupeModal
        illustration={inspectedIllustration}
        onClose={() => setInspectedIllustration(null)}
      />
    </div>
  );
};
