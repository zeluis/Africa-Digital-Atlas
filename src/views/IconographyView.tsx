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

interface HistMapRecord {
  id: string;
  name: string;
  cartographer: string;
  year: string;
  url: string;
  description: string;
  region: string;
}

const HISTORICAL_MAPS: HistMapRecord[] = [
  {
    id: 'danville_1749',
    name: "Carte de l'Afrique",
    cartographer: "Jean-Baptiste d'Anville",
    year: "1749",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ee/1749_D%27Anville_Map_of_Africa_-_Geographicus_-_Africa-anville-1749.jpg",
    description: "Jean-Baptiste d'Anville swept away centuries of mythical geography, leaving blank spaces where knowledge was absent, but capturing coastal trading forts, river systems, and pre-colonial empires like Monomotapa and Bornou.",
    region: "Pan-African Continent"
  },
  {
    id: 'blaeu_1644',
    name: "Guinea / Congo Coastal Plate",
    cartographer: "Willem Blaeu",
    year: "1644",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/43/Blaeu_1662_-_Guinea.jpg",
    description: "Willem Blaeu's highly decorative Dutch Golden Age map of Guinea, the Gold Coast, and Benin, capturing the early maritime trading posts and kingdoms with ornate nautical charts and illustrations.",
    region: "West & Central Africa"
  },
  {
    id: 'bowen_1747',
    name: "Map of Negroland & Guinea",
    cartographer: "Emmanuel Bowen",
    year: "1747",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6f/1747_Bowen_Map_of_West_Africa_%28Negroland%2C_Guinea%29_-_Geographicus_-_Negroland-bowen-1747.jpg",
    description: "Emmanuel Bowen's detailed English plate of West Africa ('Negroland' and 'Guinea'). It explicitly depicts the Slave Coast, Gold Coast, Windward Coast, and internal political kingdoms like Whydah and Dahomey.",
    region: "West Africa Coastal Strip"
  }
];

interface GeorefLandmark {
  name: string;
  historicalName: string;
  description: string;
  coords: { x: number; y: number }; // Percentage in container
}

const HISTORICAL_LANDMARKS: Record<string, GeorefLandmark[]> = {
  danville_1749: [
    { name: "Dakar", historicalName: "Gorée Island", description: "Major French naval base and slave embarkation depot off the Senegal peninsula.", coords: { x: 21, y: 32 } },
    { name: "Elmina", historicalName: "St. George of the Mine", description: "Portuguese (later Dutch) castle built in 1482, the earliest European gold and slave fort.", coords: { x: 38, y: 44 } },
    { name: "Ouidah", historicalName: "Whydah Port", description: "Highly active kingdom on the Slave Coast supplying English, French, and Portuguese traders.", coords: { x: 44, y: 43 } },
    { name: "Luanda", historicalName: "São Paulo de Loanda", description: "Authoritative Portuguese capital of Angola, shipping millions of captives directly to Brazil.", coords: { x: 54, y: 64 } },
    { name: "Mozambique Island", historicalName: "Ilha de Moçambique", description: "Portuguese East African naval station trading captives to French Mascarenes and Brazil.", coords: { x: 86, y: 76 } }
  ],
  blaeu_1644: [
    { name: "Cape Coast", historicalName: "Cabo Corso (Castle)", description: "Headquarters of the Royal African Company in West Africa, featuring deep dungeons.", coords: { x: 42, y: 55 } },
    { name: "Benin City", historicalName: "Kingdom of Great Benin", description: "Highly sophisticated militarized kingdom famous for its bronze artwork and strict trade royal monopolies.", coords: { x: 62, y: 48 } },
    { name: "James Island", historicalName: "Fort James (Gambia)", description: "British trading post on the Gambia River, heavily fortified to secure ivory, wax, and captives.", coords: { x: 14, y: 28 } }
  ],
  bowen_1747: [
    { name: "Sherbro", historicalName: "Sherbro River", description: "Important source of timber, camwood, and captives on the Sierra Leone Windward Coast.", coords: { x: 18, y: 64 } },
    { name: "Kumasi", historicalName: "Ashantee Empire", description: "Powerful gold-rich inland empire that expanded rapidly in the 18th century, dominating coastal ports.", coords: { x: 46, y: 52 } },
    { name: "Dahomey", historicalName: "Kingdom of Dahomy", description: "Militarized inland state that captured Ouidah in 1727 to establish direct contact with European traders.", coords: { x: 58, y: 42 } }
  ]
};

export const IconographyView: React.FC = () => {
  const [heroState, setHeroState] = useState<HeroState>(() => getCandidateState());
  const [inspectedIllustration, setInspectedIllustration] = useState<SlaveTradeIllustration | null>(null);
  
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'registry' | 'cartography'>('registry');

  // Split view states
  const [splitPercentage, setSplitPercentage] = useState<number>(50);
  const [opacityLevel, setOpacityLevel] = useState<number>(100);
  const [selectedMapId, setSelectedMapId] = useState<string>('danville_1749');
  const [blendMode, setBlendMode] = useState<'split' | 'opacity'>('split');
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [activeLandmark, setActiveLandmark] = useState<GeorefLandmark | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  const rotateHeroImage = useCallback(() => {
    setHeroState(prev => getCandidateState(prev.id));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      rotateHeroImage();
    }, 14000);
    return () => clearInterval(interval);
  }, [rotateHeroImage]);

  // Handle curtain dragging
  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplitPercentage(percentage);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const activeMap = HISTORICAL_MAPS.find(m => m.id === selectedMapId) || HISTORICAL_MAPS[0];
  const landmarks = HISTORICAL_LANDMARKS[selectedMapId] || [];

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
            <span className="absolute -top-1 -right-4 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          </span>
        </button>
      </div>

      {/* Tab Switchboard Content Area */}
      {activeTab === 'registry' ? (
        <div className="px-1">
          <SlaveTradeIconography />
        </div>
      ) : (
        /* Georeferenced Historical Cartography Opacity Curtain & Split View Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-in fade-in duration-300">
          
          {/* Controls Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-600" />
                  Cartographic Console
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Analyze pre-colonial boundaries, maritime shipping corridors, and colonial map overlays directly against modern sovereign nations.
                </p>
              </div>

              {/* 1. Historical Map Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">Select Historic Plate</label>
                <div className="space-y-2">
                  {HISTORICAL_MAPS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMapId(m.id);
                        setActiveLandmark(null);
                      }}
                      className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        selectedMapId === m.id
                          ? 'border-amber-500/50 bg-amber-500/5 text-stone-900 dark:text-stone-100 font-bold'
                          : 'border-stone-200 dark:border-stone-800 bg-transparent text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{m.name}</span>
                        <span className="font-mono text-[9px] px-1.5 py-0.5 bg-stone-200 dark:bg-stone-800 rounded-md">
                          {m.year}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 font-mono">
                        By {m.cartographer} · {m.region}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Blend Mode Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">Archival Comparison Mode</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 dark:bg-stone-900 rounded-xl">
                  <button
                    onClick={() => setBlendMode('split')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      blendMode === 'split'
                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
                    <span>Split Curtain</span>
                  </button>
                  <button
                    onClick={() => setBlendMode('opacity')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      blendMode === 'opacity'
                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-600" />
                    <span>Opacity Fader</span>
                  </button>
                </div>
              </div>

              {/* 3. Slider Controls based on selected Blend Mode */}
              <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-stone-800">
                {blendMode === 'split' ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-stone-700 dark:text-stone-300">Curtain Divider:</span>
                      <span className="font-mono text-amber-700 dark:text-amber-400">{splitPercentage.toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={splitPercentage}
                      onChange={(e) => setSplitPercentage(parseInt(e.target.value))}
                      className="w-full accent-amber-600 h-1.5 bg-stone-200 rounded-lg cursor-ew-resize"
                    />
                    <div className="flex items-center justify-between text-[9px] font-mono text-stone-400">
                      <span>👈 Modern Sovereignty</span>
                      <span>18th Century Cartography 👉</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-stone-700 dark:text-stone-300">Historic Plate Opacity:</span>
                      <span className="font-mono text-amber-700 dark:text-amber-400">{opacityLevel}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={opacityLevel}
                      onChange={(e) => setOpacityLevel(parseInt(e.target.value))}
                      className="w-full accent-amber-600 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[9px] font-mono text-stone-400">
                      <span>Modern Borders Only</span>
                      <span>Full Vintage Plate</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Display Layer Toggles */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  Show Georeferenced Trade Ports
                </span>
                <input
                  type="checkbox"
                  checked={showLandmarks}
                  onChange={(e) => setShowLandmarks(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded-md cursor-pointer"
                />
              </div>

            </div>

            {/* In-depth Map Detail Panel */}
            <div className="p-5 rounded-3xl bg-[#FAF8F5] dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                <Info className="w-4 h-4" />
                <span>Plate Historical Dossier</span>
              </div>
              <p className="text-xs font-serif leading-relaxed text-stone-800 dark:text-stone-300">
                {activeMap.description}
              </p>
              <div className="pt-2">
                <a
                  href={activeMap.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 text-xs font-sans font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Inspect High-Resolution Plate Source</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Map Canvas (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {/* Split Screen interactive display box */}
            <div 
              ref={containerRef}
              onMouseDown={handleMouseDown}
              className="relative w-full aspect-[4/3] max-h-[580px] bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden select-none cursor-crosshair group shadow-lg"
            >
              {/* Background / Base layer: Under-map showing styled modern borders */}
              <div className="absolute inset-0 bg-[#FDFBF7] dark:bg-[#020617] flex items-center justify-center p-8 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-stone-300 dark:stroke-stone-800 fill-stone-50 dark:fill-stone-950 transition-all duration-300">
                  {/* African continent simplified contemporary sovereign SVG representation */}
                  <g strokeWidth="0.8">
                    {/* West Africa */}
                    <path d="M 15 35 Q 20 20 40 22 Q 43 25 45 35 Q 40 45 35 48 L 25 46 Q 16 42 15 35 Z" fill="#E8DFCE" opacity="0.3" className="dark:[fill:#0f172a]" />
                    {/* East/North Africa */}
                    <path d="M 40 22 Q 55 12 70 18 L 74 24 Q 78 30 76 38 L 70 45 Q 64 48 55 42 Z" fill="#CFC2A8" opacity="0.3" className="dark:[fill:#1e293b]" />
                    {/* Central Africa */}
                    <path d="M 45 35 Q 55 42 56 48 L 52 56 L 46 54 L 43 45 Z" fill="#D9CEB8" opacity="0.3" className="dark:[fill:#0f172a]" />
                    {/* Southern Africa */}
                    <path d="M 46 54 L 52 56 Q 58 75 52 88 Q 44 86 40 78 L 41 68 Z" fill="#DDD4BF" opacity="0.3" className="dark:[fill:#334155]" />
                  </g>
                  {/* Contemporary Political Gridlines */}
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#EF4444" strokeWidth="0.4" strokeDasharray="2 3" opacity="0.4" /> {/* Equator */}
                  <text x="2" y="49" fontSize="2.5" fill="#EF4444" opacity="0.6" className="font-mono">EQUATOR</text>
                </svg>
                {/* Modern labels */}
                <div className="absolute inset-0 flex items-center justify-center font-serif text-[26px] font-black opacity-10 dark:opacity-[0.06] tracking-[0.25em] text-stone-900 dark:text-stone-100">
                  CONTEMPORARY AFRICA
                </div>
              </div>

              {/* Historical Map Overlay layer */}
              <div 
                className="absolute inset-y-0 left-0 h-full overflow-hidden transition-all duration-75 pointer-events-none"
                style={{ 
                  width: blendMode === 'split' ? `${splitPercentage}%` : '100%',
                  opacity: blendMode === 'opacity' ? opacityLevel / 100 : 1
                }}
              >
                {/* Image is absolutely positioned to matching container width */}
                <div className="absolute inset-y-0 left-0 w-[800px] h-full">
                  <img
                    src={activeMap.url}
                    alt={activeMap.name}
                    className="w-full h-full object-cover select-none filter saturate-105 contrast-110 sepia-[0.1]"
                  />
                </div>
              </div>

              {/* Curtain vertical separator bar (only visible in split view) */}
              {blendMode === 'split' && (
                <div 
                  className="absolute inset-y-0 w-1 bg-amber-600 cursor-ew-resize flex items-center justify-center group"
                  style={{ left: `${splitPercentage}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg border border-amber-500 group-hover:scale-110 transition-transform select-none">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* Georeferenced trade landmarks interactive markers */}
              {showLandmarks && landmarks.map((l, idx) => {
                const isActive = activeLandmark?.name === l.name;
                return (
                  <button
                    key={`landmark-${idx}`}
                    onClick={() => setActiveLandmark(isActive ? null : l)}
                    className="absolute p-1 rounded-full bg-stone-900/80 border border-amber-500/80 text-amber-400 hover:scale-125 hover:bg-amber-600 hover:text-white transition-all cursor-pointer z-10 shadow-md"
                    style={{ left: `${l.coords.x}%`, top: `${l.coords.y}%` }}
                    title={`Click to georeference ${l.historicalName}`}
                  >
                    <MapPin className="w-4 h-4 fill-current" />
                  </button>
                );
              })}

              {/* Landmark Dossier Floating Card */}
              {activeLandmark && (
                <div className="absolute bottom-4 right-4 max-w-sm p-4 rounded-2xl bg-white/95 dark:bg-stone-900/95 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-2 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-1.5">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-600">Georeferenced Point</span>
                    <button onClick={() => setActiveLandmark(null)} className="text-stone-400 hover:text-stone-600 text-sm">×</button>
                  </div>
                  <div>
                    <h4 className="font-serif font-black text-stone-900 dark:text-stone-100 text-sm">
                      {activeLandmark.historicalName}
                    </h4>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                      Modern City Name: <strong className="text-stone-700 dark:text-stone-200">{activeLandmark.name}</strong>
                    </p>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                    {activeLandmark.description}
                  </p>
                </div>
              )}

              {/* Help overlay */}
              <div className="absolute top-4 left-4 p-2 rounded-xl bg-black/60 text-white font-mono text-[9px] pointer-events-none backdrop-blur-xs">
                {blendMode === 'split' ? "🖱️ Drag divider horizontally to compare" : "⚙️ Use slider below to crossfade"}
              </div>

            </div>

            {/* Footer labels */}
            <div className="flex items-center justify-between text-xs font-mono text-stone-400">
              <span>Projection: Mercator Cylindrical Aligned</span>
              <span>Coordinates Anchored to Atlantic Coast</span>
            </div>

          </div>

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
