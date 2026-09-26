import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  Image as ImageIcon, 
  RefreshCw, 
  Calendar, 
  Tag, 
  Upload, 
  Eye, 
  Database,
  SlidersHorizontal,
  Maximize2
} from 'lucide-react';
import { SLAVE_TRADE_ILLUSTRATIONS, SlaveTradeIllustration } from '../data/slaveTradeIllustrations';
import { CASTAS_ARCHIVE_ITEMS } from '../data/castasArchive';
import { SlaveTradeIconography } from '../components/slaveVoyages/SlaveTradeIconography';
import { ArchivalLoupeModal } from '../components/slaveVoyages/ArchivalLoupeModal';
import { ArchivalImageViewer } from '../components/common/ArchivalImageViewer';
import { DynamicIcon } from '../components/DynamicIcon';

// Curated selection of visually striking, high-detail plates
const HERO_IMAGE_CANDIDATES = [17, 18, 19, 20, 731, 732, 735, 788, 789, 790, 831, 835, 1021, 1028, 1032, 1042];

// Converted Castas archive items (32 plates from the public/castas repository)
const castasIllustrations: SlaveTradeIllustration[] = CASTAS_ARCHIVE_ITEMS.map((item, idx) => ({
  objectId: 9000 + idx,
  sourceFile: `castas-${item.id}.html`,
  sourceSha256: `castas-sha256-${idx}`,
  regId: `C-${idx + 1}`,
  identifier: item.id,
  title: item.title,
  date: item.date,
  source: `${item.creator} • Preserved at ${item.institution}`,
  imageUrls: [item.imageUrl],
  collectionNames: [item.category],
  collectionIds: [999],
  itemSets: ['Castas & Colonial Visual Archive'],
  researchers: [item.creator, item.institution],
  description: `${item.description}\n\nHistorical Significance: ${item.historicalSignificance}`,
  slaveryImagesPage: ''
}));

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
  
  // Navigation tabs state ('registry' vs 'ingestion' / 'castas')
  const [activeTab, setActiveTab] = useState<'registry' | 'ingestion'>('registry');

  // Active Castas Item in embedded viewer
  const [activeCastasItem, setActiveCastasItem] = useState<SlaveTradeIllustration>(castasIllustrations[0]);

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
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 0.52, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0 bg-cover bg-right md:bg-[center_right_12%] sepia-[0.20] contrast-[1.18] brightness-[1.02] dark:brightness-[0.92] dark:contrast-125 dark:opacity-40 mix-blend-multiply dark:mix-blend-luminosity"
                style={{ backgroundImage: `url(${heroState.url})` }}
              />
            )}
          </AnimatePresence>
          
          {/* Subtle Archival Texture Grid */}
          <div 
            className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#78716c 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          {/* Balanced Scrim: Preserves typography contrast while letting artwork shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/98 via-[#FAF8F5]/80 via-45% to-transparent dark:from-stone-950/98 dark:via-stone-950/80 dark:via-45% dark:to-transparent w-full md:w-4/5 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-[#FAF8F5]/30 dark:from-stone-950 dark:via-transparent dark:to-stone-950/30 pointer-events-none" />
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
                    <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                    {heroState.date || 'Historical'}
                  </span>
                  <span className="flex items-center gap-1 max-w-[120px] truncate" title={heroState.category}>
                    <Tag className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                    <span className="truncate">{heroState.category}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Editorial Section Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Iconography Archive
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold">
              {SLAVE_TRADE_ILLUSTRATIONS.length + castasIllustrations.length} Total Visual Records
            </span>
          </div>
          <p className="text-xs sm:text-sm font-serif text-stone-600 dark:text-stone-400">
            Curated historical plates, naval schematics, and colonial castas painting series with academic citations.
          </p>
        </div>
      </div>

      {/* Tab Switchboard Content Area */}
      {activeTab === 'registry' ? (
        <div className="px-1">
          <SlaveTradeIconography 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            castasCount={castasIllustrations.length}
          />
        </div>
      ) : (
        /* Castas Archive Tab: ArchivalImageViewer rendered standalone with all 32 images */
        <div className="space-y-4 animate-in fade-in duration-300 text-left">
          {/* Sticky Toolbar for Castas Archive with Integrated Segmented Control */}
          <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 dark:bg-stone-950/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-900/10 dark:bg-amber-400/10 border border-amber-900/20 dark:border-amber-400/20 flex items-center justify-center text-amber-900 dark:text-amber-400 shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-black text-stone-900 dark:text-stone-100 text-sm tracking-tight leading-none">
                      Castas &amp; Colonial Painting Series
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold">
                      {castasIllustrations.length} Plates Loaded
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-stone-500 dark:text-stone-400 mt-1">
                    Direct visual scrutiny workspace with high-resolution zooming, rotation, and academic citations.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setInspectedIllustration(activeCastasItem)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs shrink-0"
                  title="Open Current Plate in Fullscreen Modal"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Fullscreen Modal</span>
                </button>
              </div>
            </div>

            {/* Row 2: Right-Aligned Integrated Segmented Control */}
            <div className="flex items-center justify-end pt-1 border-t border-stone-200/80 dark:border-stone-800/80">
              <div className="inline-flex p-1 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shrink-0 shadow-inner">
                <button
                  onClick={() => setActiveTab('registry')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                >
                  <DynamicIcon 
                    icon="fluent-mdl2:picture-tile" 
                    className="w-3.5 h-3.5 shrink-0 transition-colors text-stone-500 dark:text-stone-400" 
                  />
                  <span>Archival Plates Grid</span>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {SLAVE_TRADE_ILLUSTRATIONS.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('ingestion')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm"
                >
                  <DynamicIcon 
                    icon="lucide:gallery-thumbnails" 
                    className="w-3.5 h-3.5 shrink-0 transition-colors text-amber-400 dark:text-amber-600" 
                  />
                  <span>Castas &amp; Colonial Archive</span>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-stone-800 text-amber-300 dark:bg-stone-200 dark:text-stone-900">
                    {castasIllustrations.length} Plates
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Standalone Archival Image Viewer Workspace */}
          <div className="h-[700px] sm:h-[780px] rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-xl bg-[#FAF8F5] dark:bg-stone-950">
            <ArchivalImageViewer
              illustration={activeCastasItem}
              illustrationsList={castasIllustrations}
              onSelectIllustration={item => setActiveCastasItem(item)}
              mode="embedded"
              showThumbnails={true}
            />
          </div>
        </div>
      )}

      {/* Fullscreen Loupe / Modal Viewer */}
      <ArchivalLoupeModal
        illustration={inspectedIllustration}
        illustrationsList={activeTab === 'ingestion' ? castasIllustrations : SLAVE_TRADE_ILLUSTRATIONS}
        onSelectIllustration={item => {
          setInspectedIllustration(item);
          if (activeTab === 'ingestion') {
            setActiveCastasItem(item);
          }
        }}
        onClose={() => setInspectedIllustration(null)}
      />
    </div>
  );
};
