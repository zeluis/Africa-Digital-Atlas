import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HistoricalMapPlate, 
  PreColonialEntity, 
  PRE_COLONIAL_ENTITIES,
  HISTORICAL_MAP_PLATES 
} from '../../data/archivalCartographyData';
import { 
  SlidersHorizontal, 
  Columns2, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  Sparkles, 
  MapPin, 
  BookOpen, 
  Check, 
  Copy,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Compass,
  Palette,
  Shield,
  X,
  PanelRightClose,
  PanelRightOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Wind,
  Globe2,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { AfricaMapFinalLayer } from '../AfricaMapFinalLayer';
import { AfricanRegion } from '../../data/types';
import { useAfricaFinalMap } from '../../utils/svgMapLoader';
import { getRegionTonalPalette } from '../../data/unGeoschemeColors';
import { AFRICA_FINAL_VIEWBOX, AFRICA_FINAL_TRANSFORM } from '../../data/africaFinalGeometry';
import { getCanonicalCountryColor } from '../../data/africaCanonicalColorPalette';
import { AntiquePlateCanvas } from './AntiquePlateCanvas';

interface HistoricalMapCurtainViewerProps {
  selectedPlate: HistoricalMapPlate;
  onSelectPlate?: (plate: HistoricalMapPlate) => void;
  onSelectPreColonialEntity?: (entity: PreColonialEntity) => void;
  activeWorkbenchTab?: 'curtain' | 'streamlines' | 'kingdoms';
  onSelectWorkbenchTab?: (tab: 'curtain' | 'streamlines' | 'kingdoms') => void;
}

type ComparisonMode = 'curtain' | 'opacity' | 'sideBySide';
type BorderVibrancy = 'vibrant' | 'balanced' | 'subdued' | 'contrast';

export const HistoricalMapCurtainViewer: React.FC<HistoricalMapCurtainViewerProps> = ({
  selectedPlate,
  onSelectPlate,
  onSelectPreColonialEntity,
  activeWorkbenchTab = 'curtain',
  onSelectWorkbenchTab
}) => {
  const { mapData } = useAfricaFinalMap();

  // Mode & Controls state
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('curtain');
  const [curtainPosition, setCurtainPosition] = useState<number>(50); // percentage (0 - 100)
  const [opacityLevel, setOpacityLevel] = useState<number>(65); // percentage (0 - 100)
  const [borderVibrancy, setBorderVibrancy] = useState<BorderVibrancy>('vibrant');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0); // 100% uncropped full continent view
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingPan, setIsDraggingPan] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Overlays & Panels state
  const [showPreColonialKingdoms, setShowPreColonialKingdoms] = useState<boolean>(true);
  const [showModernBorders, setShowModernBorders] = useState<boolean>(true);
  const [showGraticules, setShowGraticules] = useState<boolean>(true);
  const [selectedEntity, setSelectedEntity] = useState<PreColonialEntity | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<PreColonialEntity | null>(null);

  // Immersive layout state
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(true);
  const [isFilmstripOpen, setIsFilmstripOpen] = useState<boolean>(true);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const filmstripScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingCurtainRef = useRef<boolean>(false);

  // Reset viewport upon new plate selection to 100% full uncropped view
  useEffect(() => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
  }, [selectedPlate.id]);

  // Curtain slider drag handlers
  const handleCurtainMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setCurtainPosition(percentage);
  }, []);

  const handleMouseDownCurtain = (e: React.MouseEvent) => {
    e.stopPropagation();
    isDraggingCurtainRef.current = true;
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (isDraggingCurtainRef.current) {
        handleCurtainMove(moveEvent.clientX);
      }
    };
    const onMouseUp = () => {
      isDraggingCurtainRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchMoveCurtain = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleCurtainMove(e.touches[0].clientX);
    }
  };

  // Pan handlers for canvas
  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (zoomLevel <= 1.05) return;
    setIsDraggingPan(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!isDraggingPan) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUpCanvas = () => {
    setIsDraggingPan(false);
  };

  // Copy citation handler
  const handleCopyCitation = async () => {
    try {
      const text = `${selectedPlate.cartographer} (${selectedPlate.year}). "${selectedPlate.title}." ${selectedPlate.source}. Preserved at ${selectedPlate.institution}.`;
      await navigator.clipboard.writeText(text);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    } catch {}
  };

  // Dynamic Country fill function
  const getCountryFill = useCallback((country: { id: string; unRegion: AfricanRegion; originalColor?: string; name?: string }) => {
    const canonicalColor = getCanonicalCountryColor(country.id);
    const baseColor = canonicalColor || country.originalColor || getRegionTonalPalette(country.unRegion).unBaseColor || '#0a9bc3';

    const activeTarget = hoveredEntity || selectedEntity;
    if (activeTarget) {
      const isEncompassed = activeTarget.modernCountries.some(
        c => c.toLowerCase() === (country.name || '').toLowerCase() || country.id.toLowerCase().includes(c.toLowerCase().slice(0, 3))
      );
      if (isEncompassed) {
        return activeTarget.color;
      }
    }

    const hex = baseColor.startsWith('#') ? baseColor.slice(0, 7) : baseColor;

    if (borderVibrancy === 'vibrant') {
      return hex;
    } else if (borderVibrancy === 'balanced') {
      return `${hex}cc`;
    } else if (borderVibrancy === 'subdued') {
      return `${hex}80`;
    } else if (borderVibrancy === 'contrast') {
      return hex;
    }
    return hex;
  }, [borderVibrancy, hoveredEntity, selectedEntity]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[600px] flex flex-col overflow-hidden bg-[#FAF8F5] dark:bg-stone-950 select-none">
      
      {/* =========================================================================
          1. INTEGRATED FULL-BLEED FIXED VIEWER HEADER CONTROLS BAR
          (2 neatly tightened control rows with dedicated left spacing for nav drawer)
          ========================================================================= */}
      <header className="w-full shrink-0 border-b border-stone-200/90 dark:border-stone-800/90 bg-[#FAF8F5]/98 dark:bg-stone-950/98 backdrop-blur-md pl-14 sm:pl-16 lg:pl-18 pr-3 sm:pr-4 lg:pr-5 py-2 flex flex-col gap-1.5 z-20 overflow-x-auto no-scrollbar shadow-xs">
        
        {/* ROW 1: Title, Plate Badge, Layer Toggles, and Zoom Controls */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          
          {/* Left: View Title & Active Plate Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="font-serif font-bold text-xs sm:text-sm md:text-base text-stone-900 dark:text-stone-100 whitespace-nowrap">
              Georeferenced Map Curtain
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 font-mono text-[9.5px] font-bold border border-amber-500/30 whitespace-nowrap">
              {selectedPlate.year} • {selectedPlate.shortTitle || selectedPlate.cartographer}
            </span>
            <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 hidden xl:inline truncate">
              17th–18th Century Cartography vs. 2026 Borders
            </span>
          </div>

          {/* Right: Layer Toggles & Zoom Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 text-xs">
            {/* Layer Toggles (Kingdoms & Borders) */}
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B]">
              <button
                type="button"
                onClick={() => setShowPreColonialKingdoms(v => !v)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                  showPreColonialKingdoms
                    ? 'bg-purple-500/20 text-purple-900 dark:text-purple-200 border-purple-500/50 shadow-2xs'
                    : 'bg-transparent text-stone-500 border-transparent opacity-60 line-through'
                }`}
                title="Toggle Pre-Colonial Kingdoms overlay"
              >
                <MapPin className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span className="hidden sm:inline">Kingdoms</span>
              </button>

              <button
                type="button"
                onClick={() => setShowModernBorders(v => !v)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                  showModernBorders
                    ? 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border-emerald-500/50 shadow-2xs'
                    : 'bg-transparent text-stone-500 border-transparent opacity-60 line-through'
                }`}
                title="Toggle Modern 2026 Sovereign Borders"
              >
                <Layers className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Borders</span>
              </button>
            </div>

            <div className="w-[1px] h-4 bg-[#E5DDD0] dark:bg-[#38322B] shrink-0 hidden sm:block" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B]">
              <button
                type="button"
                onClick={() => {
                  setZoomLevel(z => {
                    const next = Math.max(Number((z - 0.15).toFixed(2)), 0.6);
                    if (next === 1.0) setPanOffset({ x: 0, y: 0 });
                    return next;
                  });
                }}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>

              <span className="text-[10px] font-mono font-bold text-stone-800 dark:text-stone-200 min-w-[2.2rem] text-center font-tabular">
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                type="button"
                onClick={() => setZoomLevel(z => Math.min(Number((z + 0.15).toFixed(2)), 3.5))}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setZoomLevel(1.0);
                  setPanOffset({ x: 0, y: 0 });
                }}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-500 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Reset to 100% Uncropped Full Africa View"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: Workbench Switcher, Comparison Modes, Slider, and Border Vibrancy */}
        <div className="flex items-center justify-between gap-2 min-w-0 pt-0.5 border-t border-stone-200/60 dark:border-stone-800/60">
          
          {/* Left: Workbench Switcher */}
          <div className="flex items-center gap-1 shrink-0">
            {onSelectWorkbenchTab && (
              <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B]">
                <button
                  type="button"
                  onClick={() => onSelectWorkbenchTab('curtain')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeWorkbenchTab === 'curtain'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                  title="Georeferenced Map Curtain Workbench"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Curtain</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectWorkbenchTab('streamlines')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeWorkbenchTab === 'streamlines'
                      ? 'bg-cyan-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                  title="Seasonal Oceanic Streamlines Workbench"
                >
                  <Wind className="w-3 h-3 text-cyan-400" />
                  <span>Streamlines</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectWorkbenchTab('kingdoms')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeWorkbenchTab === 'kingdoms'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                  title="Pre-Colonial Kingdoms Matrix Workbench"
                >
                  <Compass className="w-3 h-3 text-purple-400" />
                  <span>Kingdoms</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Comparison Mode Tabs, Dynamic Slider & Vibrancy */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 text-xs">
            {/* Comparison Mode Switcher */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B]">
              <button
                type="button"
                onClick={() => setComparisonMode('curtain')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  comparisonMode === 'curtain'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
                title="Interactive Split Curtain Comparison"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Split Curtain</span>
              </button>

              <button
                type="button"
                onClick={() => setComparisonMode('opacity')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  comparisonMode === 'opacity'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
                title="Alpha Opacity Blend Mode"
              >
                <Layers className="w-3 h-3" />
                <span>Opacity</span>
              </button>

              <button
                type="button"
                onClick={() => setComparisonMode('sideBySide')}
                className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  comparisonMode === 'sideBySide'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
                title="Dual Side-by-Side Viewport"
              >
                <Columns2 className="w-3 h-3" />
                <span>Side-by-Side</span>
              </button>
            </div>

            {/* Dynamic Slider */}
            {comparisonMode === 'curtain' && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B] text-[10px] font-mono">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={curtainPosition}
                  onChange={e => setCurtainPosition(Number(e.target.value))}
                  className="w-14 sm:w-20 accent-amber-600 cursor-pointer"
                  title="Curtain Position"
                />
                <span className="w-7 text-right font-bold text-amber-700 dark:text-amber-400 font-tabular">{Math.round(curtainPosition)}%</span>
              </div>
            )}

            {comparisonMode === 'opacity' && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B] text-[10px] font-mono">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacityLevel}
                  onChange={e => setOpacityLevel(Number(e.target.value))}
                  className="w-14 sm:w-20 accent-amber-600 cursor-pointer"
                  title="Plate Opacity"
                />
                <span className="w-7 text-right font-bold text-amber-700 dark:text-amber-400 font-tabular">{Math.round(opacityLevel)}%</span>
              </div>
            )}

            {/* 2026 Borders Vibrancy */}
            <div className="hidden xl:flex items-center gap-0.5 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B]">
              {(['vibrant', 'balanced', 'subdued', 'contrast'] as BorderVibrancy[]).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setBorderVibrancy(mode)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold capitalize transition-all cursor-pointer ${
                    borderVibrancy === mode
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                  title={`2026 Sovereign Boundaries: ${mode}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. MIDDLE VIEWPORT: VERTICAL FILMSTRIP (LEFT) + MAP CANVAS + DOSSIER (RIGHT)
          (Dossier extends full-height to the bottom; Filmstrip is docked on the left)
          ========================================================================= */}
      <div className="flex-1 w-full flex flex-row overflow-hidden relative min-h-0">
        
        {/* Floating Left Button when Filmstrip is collapsed */}
        <AnimatePresence>
          {!isFilmstripOpen && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onClick={() => setIsFilmstripOpen(true)}
              className="absolute top-3.5 left-3.5 z-30 flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-stone-700 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-95"
              title="Expand Antique Plates Filmstrip"
            >
              <PanelLeftOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Plates ({HISTORICAL_MAP_PLATES.length})</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Vertical Left-Aligned Thumbnail Filmstrip */}
        <AnimatePresence>
          {isFilmstripOpen && (
            <motion.aside
              initial={{ opacity: 0, x: -60, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 230 }}
              exit={{ opacity: 0, x: -60, width: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="w-52 sm:w-56 lg:w-[230px] shrink-0 h-full border-r border-stone-200 dark:border-stone-800 bg-[#FAF8F5]/98 dark:bg-stone-950/98 backdrop-blur-xl flex flex-col z-20 shadow-xs overflow-hidden"
              id="vertical-thumbnail-filmstrip"
            >
              {/* Vertical Filmstrip Header */}
              <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 bg-[#FAF8F5]/80 dark:bg-stone-950/80 shrink-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400 truncate">
                    Plates ({HISTORICAL_MAP_PLATES.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilmstripOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
                  title="Collapse filmstrip"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scrollable Vertical Card List */}
              <div 
                ref={filmstripScrollRef}
                className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2"
              >
                {HISTORICAL_MAP_PLATES.map(plate => {
                  const isSelected = selectedPlate.id === plate.id;
                  return (
                    <button
                      key={plate.id}
                      type="button"
                      onClick={() => {
                        if (onSelectPlate) onSelectPlate(plate);
                      }}
                      className={`w-full p-1.5 rounded-xl border text-left transition-all cursor-pointer group flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/70 shadow-xs ring-2 ring-amber-500/40'
                          : 'bg-white/80 dark:bg-stone-900/80 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600'
                      }`}
                      title={`${plate.title} (${plate.year}) by ${plate.cartographer}`}
                    >
                      <div className="relative aspect-16/10 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                        <AntiquePlateCanvas
                          plate={plate}
                          isThumbnail={true}
                          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1 right-1 z-10 px-1 py-0.2 rounded bg-stone-900/90 text-amber-300 font-mono text-[8.5px] font-bold border border-amber-500/30">
                          {plate.year}
                        </div>
                      </div>

                      <div className="min-w-0 px-0.5">
                        <h5 className="font-serif font-bold text-[11px] text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-800 dark:group-hover:text-amber-400 leading-tight">
                          {plate.shortTitle || `${plate.cartographer.split(' ')[1] || plate.cartographer} (${plate.year})`}
                        </h5>
                        <p className="text-[9.5px] font-mono text-stone-500 dark:text-stone-400 truncate">
                          {plate.cartographer}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Map Viewport */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDownCanvas}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          className={`flex-1 relative w-full h-full overflow-hidden flex items-center justify-center select-none ${
            zoomLevel > 1.05 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          }`}
        >
          {comparisonMode === 'sideBySide' ? (
            /* Side-by-Side Dual Viewport Mode */
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 sm:p-4">
              {/* Historical Plate Pane */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-800 bg-[#F4EFE6] dark:bg-stone-900 flex flex-col shadow-xs">
                <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full bg-stone-900/85 text-amber-300 font-mono text-[10px] font-bold backdrop-blur-md border border-amber-500/30">
                  {selectedPlate.year} • {selectedPlate.shortTitle || selectedPlate.cartographer}
                </div>
                <div className="w-full h-full p-2 flex items-center justify-center">
                  <AntiquePlateCanvas plate={selectedPlate} className="w-full h-full max-h-[78vh] rounded-xl object-contain" />
                </div>
              </div>

              {/* Contemporary Sovereign Vector Pane */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 flex flex-col items-center justify-center p-3 shadow-xs">
                <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full bg-emerald-950/85 text-emerald-300 font-mono text-[10px] font-bold backdrop-blur-md border border-emerald-500/30">
                  2026 Sovereign Boundaries (54 Nations)
                </div>
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    viewBox={AFRICA_FINAL_VIEWBOX}
                    className="w-full h-full max-w-[92vw] max-h-[78vh] select-none"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g key={`side-by-side-vibrancy-${borderVibrancy}`} opacity={0.9}>
                      <AfricaMapFinalLayer
                        mapData={mapData}
                        selectedEntityId={null}
                        activeTooltipEntityId={null}
                        hoveredEntityId={null}
                        hoveredAdmin1={null}
                        showAdmin1Borders={borderVibrancy === 'contrast' || borderVibrancy === 'vibrant'}
                        showGraticuleAndCompass={showGraticules}
                        showThematicOverlays={false}
                        showPowerPlants={false}
                        showProtectedAreas={false}
                        visibleRegions={new Set(['Northern Africa', 'Western Africa', 'Central Africa', 'Eastern Africa', 'Southern Africa'])}
                        activeRegionFilter="All"
                        getCountryFill={getCountryFill}
                        handleCountryHover={() => {}}
                        handleCountryLeave={() => {}}
                        handleCountryClick={() => {}}
                        setHoveredAdmin1={() => {}}
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            /* Full-Bleed Split-Curtain & Alpha Opacity Layered Viewport */
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-75 origin-center"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`
              }}
            >
              {/* 1. Underlying Modern 2026 Sovereign Vector Map (Base Layer) */}
              {showModernBorders && (
                <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
                  <svg
                    viewBox={AFRICA_FINAL_VIEWBOX}
                    className="w-full h-full max-w-[92vw] max-h-[calc(100vh-140px)] select-none pointer-events-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      key={`curtain-vibrancy-${borderVibrancy}`}
                      opacity={0.92}
                    >
                      <AfricaMapFinalLayer
                        mapData={mapData}
                        selectedEntityId={null}
                        activeTooltipEntityId={null}
                        hoveredEntityId={null}
                        hoveredAdmin1={null}
                        showAdmin1Borders={borderVibrancy === 'contrast' || borderVibrancy === 'vibrant'}
                        showGraticuleAndCompass={showGraticules}
                        showThematicOverlays={false}
                        showPowerPlants={false}
                        showProtectedAreas={false}
                        visibleRegions={new Set(['Northern Africa', 'Western Africa', 'Central Africa', 'Eastern Africa', 'Southern Africa'])}
                        activeRegionFilter="All"
                        getCountryFill={getCountryFill}
                        handleCountryHover={() => {}}
                        handleCountryLeave={() => {}}
                        handleCountryClick={() => {}}
                        setHoveredAdmin1={() => {}}
                      />
                    </g>
                  </svg>
                </div>
              )}

              {/* 2. Historical Antique Map Overlay (Controlled by Curtain or Opacity) */}
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center"
                style={{
                  clipPath:
                    comparisonMode === 'curtain'
                      ? `polygon(0% 0%, ${curtainPosition}% 0%, ${curtainPosition}% 100%, 0% 100%)`
                      : undefined,
                  opacity: comparisonMode === 'opacity' ? opacityLevel / 100 : 1
                }}
              >
                <div className="w-full h-full max-w-[92vw] max-h-[calc(100vh-140px)] flex items-center justify-center p-2">
                  <AntiquePlateCanvas plate={selectedPlate} className="w-full h-full object-contain" />
                </div>
              </div>

              {/* 3. Pre-Colonial Empires & Kingdoms Vector Beacons (Top Layer) */}
              {showPreColonialKingdoms && (
                <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 pointer-events-none z-20">
                  <svg
                    viewBox={AFRICA_FINAL_VIEWBOX}
                    className="w-full h-full max-w-[92vw] max-h-[calc(100vh-140px)] select-none pointer-events-none"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g id="preColonialKingdomBeaconsTop" transform={AFRICA_FINAL_TRANSFORM} className="pointer-events-auto">
                      {PRE_COLONIAL_ENTITIES.map(entity => {
                        const [x, y] = entity.svgCoordinates;
                        const isSelected = selectedEntity?.id === entity.id;
                        const isHovered = hoveredEntity?.id === entity.id;
                        const cleanName = entity.name.split('(')[0].trim();
                        const textWidth = Math.max(460, cleanName.length * 52 + 180);
                        
                        let labelOffsetX = 0;
                        let labelOffsetY = -190;
                        if (entity.id === 'dahomey-kingdom') {
                          labelOffsetX = 20;
                          labelOffsetY = -200;
                        } else if (entity.id === 'benin-kingdom') {
                          labelOffsetX = 220;
                          labelOffsetY = 190;
                        } else if (entity.id === 'ashanti-empire') {
                          labelOffsetX = -560;
                          labelOffsetY = 0;
                        } else if (entity.id === 'oyo-empire') {
                          labelOffsetX = 460;
                          labelOffsetY = 2;
                        } else if (entity.id === 'mali-empire') {
                          labelOffsetX = -120;
                          labelOffsetY = -190;
                        } else if (entity.id === 'kongo-kingdom') {
                          labelOffsetX = -100;
                          labelOffsetY = 200;
                        }

                        return (
                          <g
                            key={`svg-beacon-top-${entity.id}`}
                            transform={`translate(${x}, ${y})`}
                            className="cursor-pointer group"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEntity(entity);
                              setIsDossierOpen(true);
                              if (onSelectPreColonialEntity) onSelectPreColonialEntity(entity);
                            }}
                            onMouseEnter={() => setHoveredEntity(entity)}
                            onMouseLeave={() => setHoveredEntity(null)}
                          >
                            {/* Radiating Pulsating Radar Wave & Rings */}
                            {(isSelected || isHovered) && (
                              <>
                                <circle cx="0" cy="0" r="100" fill={entity.color}>
                                  <animate
                                    attributeName="r"
                                    values="90;480"
                                    dur="2.6s"
                                    repeatCount="indefinite"
                                  />
                                  <animate
                                    attributeName="opacity"
                                    values="0.85;0;0"
                                    dur="2.6s"
                                    repeatCount="indefinite"
                                  />
                                </circle>

                                <circle cx="0" cy="0" r="100" fill={entity.color}>
                                  <animate
                                    attributeName="r"
                                    values="90;480"
                                    dur="2.6s"
                                    begin="1.3s"
                                    repeatCount="indefinite"
                                  />
                                  <animate
                                    attributeName="opacity"
                                    values="0.85;0;0"
                                    dur="2.6s"
                                    begin="1.3s"
                                    repeatCount="indefinite"
                                  />
                                </circle>

                                <circle
                                  cx="0"
                                  cy="0"
                                  r="170"
                                  fill="none"
                                  stroke={entity.color}
                                  strokeWidth="20"
                                  strokeDasharray="28,14"
                                  opacity="1"
                                >
                                  <animate
                                    attributeName="r"
                                    values="120;175;120"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                  <animate
                                    attributeName="opacity"
                                    values="0.9;0.5;0.9"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                </circle>
                              </>
                            )}

                            {/* Solid Inner Jewel Core with Thick White Rim */}
                            <circle
                              cx="0"
                              cy="0"
                              r="75"
                              fill={entity.color}
                              stroke="#ffffff"
                              strokeWidth="18"
                              className="drop-shadow-2xl"
                            />

                            {/* Core Center White Dot */}
                            <circle cx="0" cy="0" r="26" fill="#ffffff" />

                            {/* High-Contrast Floating Pill Label */}
                            <g transform={`translate(${labelOffsetX}, ${labelOffsetY})`}>
                              <rect
                                x={-textWidth / 2 - 16}
                                y="-105"
                                width={textWidth + 32}
                                height="200"
                                rx="100"
                                fill={entity.color}
                                opacity={isSelected || isHovered ? '0.65' : '0.3'}
                              />

                              <rect
                                x={-textWidth / 2}
                                y="-90"
                                width={textWidth}
                                height="170"
                                rx="85"
                                fill={isSelected ? '#3b0764' : '#09090b'}
                                stroke={isSelected || isHovered ? '#fbbf24' : entity.color}
                                strokeWidth={isSelected || isHovered ? '16' : '10'}
                                className="drop-shadow-2xl"
                              />

                              <text
                                x="0"
                                y="2"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#ffffff"
                                fontFamily="'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif"
                                fontSize="72"
                                fontWeight="900"
                                letterSpacing="1"
                                pointerEvents="none"
                              >
                                {cleanName}
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </div>
              )}

              {/* 4. Split-Curtain Draggable Divider Line */}
              {comparisonMode === 'curtain' && (
                <div
                  style={{ left: `${curtainPosition}%` }}
                  onMouseDown={handleMouseDownCurtain}
                  onTouchMove={handleTouchMoveCurtain}
                  className="absolute top-0 bottom-0 -translate-x-1/2 w-9 flex items-center justify-center cursor-ew-resize z-30 group"
                >
                  <div className="w-0.5 h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.7)]" />
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-900 text-amber-400 border-2 border-amber-500 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </div>
                  <div className="absolute top-4 -translate-x-1/2 px-2 py-0.5 rounded-full bg-stone-900/95 text-amber-300 text-[9.5px] font-mono font-bold font-tabular border border-amber-500/50 shadow-xs pointer-events-none">
                    {Math.round(curtainPosition)}%
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================================================================
            RIGHT DOCKED CARTOGRAPHIC DOSSIER & PROVENANCE PANEL
            (Docked strictly inside the middle container: below the header, above the filmstrip)
            ========================================================================= */}
        {/* Right-aligned Floating Pill when dossier is collapsed */}
        <AnimatePresence>
          {!isDossierOpen && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onClick={() => setIsDossierOpen(true)}
              className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-stone-700 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-95"
              title="Expand Cartographic Dossier & Provenance"
            >
              <PanelRightOpen className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Dossier</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Docked Dossier Panel */}
        <AnimatePresence>
          {isDossierOpen && (
            <motion.aside
              initial={{ opacity: 0, x: 100, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 380 }}
              exit={{ opacity: 0, x: 100, width: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="w-80 sm:w-96 lg:w-[380px] shrink-0 h-full border-l border-stone-200 dark:border-stone-800 bg-white/98 dark:bg-stone-900/98 backdrop-blur-xl flex flex-col z-20 shadow-md overflow-hidden"
              id="cartographic-dossier-panel"
            >
              {/* Dossier Header (Unobscured & below main header) */}
              <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3 bg-[#FAF8F5]/80 dark:bg-stone-950/80 shrink-0">
                <div className="space-y-0.5 min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400">
                      Cartographic Dossier &amp; Provenance
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug line-clamp-2">
                    {selectedPlate.title} ({selectedPlate.year})
                  </h2>
                  <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
                    {selectedPlate.cartographer} • {selectedPlate.century}
                  </p>
                </div>

                {/* Close / Collapse Button in Dossier Header */}
                <button
                  type="button"
                  onClick={() => setIsDossierOpen(false)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
                  title="Collapse dossier panel"
                >
                  <PanelRightClose className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Dossier Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4 text-left">
                
                {/* Active Kingdom Selection Highlight Card (if user clicked a kingdom beacon) */}
                <AnimatePresence>
                  {selectedEntity && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-sans font-bold border"
                              style={{
                                backgroundColor: `${selectedEntity.color}20`,
                                borderColor: `${selectedEntity.color}50`,
                                color: selectedEntity.color
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedEntity.color }} />
                              <span>{selectedEntity.regionBadge}</span>
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[9px] font-mono font-bold text-stone-600 dark:text-stone-300">
                              {selectedEntity.period}
                            </span>
                          </div>
                          <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100">
                            {selectedEntity.name}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedEntity(null)}
                          className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                          title="Deselect kingdom"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs font-sans leading-relaxed text-stone-700 dark:text-stone-300">
                        {selectedEntity.significance}
                      </p>

                      <div className="grid grid-cols-2 gap-1.5 text-[11px] font-sans pt-1">
                        <div className="p-2 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-purple-200/50 dark:border-purple-800/40">
                          <span className="text-[9px] uppercase font-bold text-stone-400 block">Capital</span>
                          <span className="font-semibold text-stone-900 dark:text-stone-100 truncate block">{selectedEntity.capital}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-purple-200/50 dark:border-purple-800/40">
                          <span className="text-[9px] uppercase font-bold text-stone-400 block">Trade</span>
                          <span className="font-semibold text-stone-900 dark:text-stone-100 truncate block">{selectedEntity.tradeSpecialty}</span>
                        </div>
                        <div className="col-span-2 p-2 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-purple-200/50 dark:border-purple-800/40">
                          <span className="text-[9px] uppercase font-bold text-stone-400 block">Modern Footprint</span>
                          <span className="font-semibold text-purple-700 dark:text-purple-300 block">{selectedEntity.modernCountries.join(', ')}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Actions (Citation & High-Res Scan) */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCitation}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    {copiedCitation ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Citation</span>
                      </>
                    )}
                  </button>

                  <a
                    href={selectedPlate.fallbackUrls?.[0] || selectedPlate.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
                    title="Open Full-Resolution Plate Scan"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Historical & Epistemological Significance */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400">
                    Historical &amp; Epistemological Significance
                  </h4>
                  <p className="text-xs font-serif leading-relaxed text-stone-800 dark:text-stone-200">
                    {selectedPlate.description}
                  </p>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs font-serif text-stone-800 dark:text-stone-200">
                    <strong className="text-amber-900 dark:text-amber-300 font-bold block mb-1">Scholarly Takeaway:</strong>
                    {selectedPlate.historicalSignificance}
                  </div>
                </div>

                {/* Toponyms & Historic Regions to Observe */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-[10px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400">
                    Toponyms &amp; Historic Regions to Observe
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPlate.toponymsToObserve.map((toponym, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[10.5px] font-mono font-medium text-stone-800 dark:text-stone-200"
                      >
                        {toponym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bibliographical Reference */}
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs font-serif text-stone-700 dark:text-stone-300 space-y-1">
                  <span className="text-[9.5px] font-mono uppercase font-bold text-stone-400 block">
                    Bibliographical Source
                  </span>
                  <p className="italic">{selectedPlate.source}</p>
                  <p className="text-[10px] font-mono text-stone-500 pt-0.5">
                    Preserved at: <strong>{selectedPlate.institution}</strong>
                  </p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
