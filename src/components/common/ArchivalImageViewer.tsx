import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Contrast, 
  Copy, 
  Check, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Info, 
  X,
  Maximize2,
  Minimize2,
  FileText,
  Grid,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  GraduationCap,
  BookOpen,
  Award,
  Scroll,
  PanelRightClose,
  PanelRightOpen,
  FileDown,
  Download,
  Loader2,
  Compass
} from 'lucide-react';
import { DynamicIcon } from '../DynamicIcon';
import { SlaveTradeIllustration } from '../../data/slaveTradeIllustrations';
import { 
  exportHighDpiPlatePDF, 
  exportBibTeXFile, 
  exportRISFile, 
  exportCSLJSONFile 
} from '../../utils/academicExport';

interface ArchivalImageViewerProps {
  illustration: SlaveTradeIllustration | null;
  illustrationsList?: SlaveTradeIllustration[];
  onSelectIllustration?: (item: SlaveTradeIllustration) => void;
  onClose?: () => void;
  mode?: 'modal' | 'embedded' | 'fullscreen';
  showThumbnails?: boolean;
}

type CitationStyle = 'chicago' | 'apa' | 'harvard' | 'bibtex';
type TabType = 'metadata' | 'citation' | 'academia';

export const ArchivalImageViewer: React.FC<ArchivalImageViewerProps> = ({
  illustration,
  illustrationsList = [],
  onSelectIllustration,
  onClose,
  mode = 'modal',
  showThumbnails = true
}) => {
  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Archival Scrutiny Filters & Layout Controls
  const [rotation, setRotation] = useState<number>(0);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(mode === 'fullscreen');
  const [isThumbnailsOpen, setIsThumbnailsOpen] = useState<boolean>(showThumbnails);
  
  // Collapsible Right Metadata Drawer state
  const [isMetadataOpen, setIsMetadataOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('metadata');

  // Citation Generator state
  const [activeCitationStyle, setActiveCitationStyle] = useState<CitationStyle>('chicago');
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const metadataScrollRef = useRef<HTMLDivElement>(null);

  // Keep references to mutable zoom and pan states for native non-passive event listeners
  const zoomLevelRef = useRef<number>(zoomLevel);
  zoomLevelRef.current = zoomLevel;

  const panOffsetRef = useRef<{ x: number; y: number }>(panOffset);
  panOffsetRef.current = panOffset;

  // Touch gesture state refs for mobile pinch-to-zoom and touch panning
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(1);
  const touchStartPointRef = useRef<{ x: number; y: number } | null>(null);
  const touchStartPanRef = useRef<{ x: number; y: number } | null>(null);

  // Prevent background page scrolling when viewer is in modal mode
  useEffect(() => {
    if (mode === 'modal') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mode]);

  // Sync fullscreen state with document fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (mode === 'embedded') {
      const targetElement = rootRef.current || containerRef.current?.closest('.archival-viewer-root') || document.documentElement;
      if (!document.fullscreenElement) {
        targetElement.requestFullscreen?.().catch(() => {
          setIsFullscreen(prev => !prev);
        });
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    } else {
      setIsFullscreen(prev => !prev);
    }
  }, [mode]);

  // Reset viewport upon new illustration
  useEffect(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setRotation(0);
    setIsHighContrast(false);
    setIsInverted(false);
  }, [illustration?.objectId]);

  // Scroll current thumbnail into view when illustration changes
  useEffect(() => {
    if (!illustration || !filmstripRef.current) return;
    const activeThumb = filmstripRef.current.querySelector(`[data-thumb-id="${illustration.objectId}"]`);
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [illustration?.objectId]);

  // Step to Next/Prev in illustrationsList
  const currentIndex = illustrationsList.findIndex(item => item.objectId === illustration?.objectId);
  
  const handlePrevIllustration = useCallback(() => {
    if (illustrationsList.length === 0 || currentIndex === -1) return;
    const prevIdx = (currentIndex - 1 + illustrationsList.length) % illustrationsList.length;
    onSelectIllustration?.(illustrationsList[prevIdx]);
  }, [currentIndex, illustrationsList, onSelectIllustration]);

  const handleNextIllustration = useCallback(() => {
    if (illustrationsList.length === 0 || currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % illustrationsList.length;
    onSelectIllustration?.(illustrationsList[nextIdx]);
  }, [currentIndex, illustrationsList, onSelectIllustration]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!illustration) return;
      if (e.key === 'Escape' && onClose) {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel(z => Math.min(z + 0.5, 5));
      } else if (e.key === '-' || e.key === '_') {
        setZoomLevel(z => {
          const next = Math.max(z - 0.5, 1);
          if (next === 1) setPanOffset({ x: 0, y: 0 });
          return next;
        });
      } else if (e.key === '0') {
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
      } else if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        toggleFullscreen();
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        handlePrevIllustration();
      } else if (e.key === 'ArrowRight' && e.altKey) {
        handleNextIllustration();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [illustration, onClose, handlePrevIllustration, handleNextIllustration, toggleFullscreen]);

  // Isolate wheel zoom on containerRef so pointer over image ONLY zooms and never scrolls the window
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeWheel = (e: WheelEvent) => {
      // Unconditionally stop the event from bubbling or scrolling the page
      e.preventDefault();
      e.stopPropagation();

      const zoomFactor = e.deltaY < 0 ? 0.25 : -0.25;
      setZoomLevel(prev => {
        const next = Math.max(1, Math.min(5, prev + zoomFactor));
        if (next === 1) {
          setPanOffset({ x: 0, y: 0 });
        }
        return Number(next.toFixed(2));
      });
    };

    // Mobile touch gestures: 2-finger pinch-to-zoom and 1-finger panning without scrolling the page
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        touchStartDistRef.current = dist;
        touchStartZoomRef.current = zoomLevelRef.current;
      } else if (e.touches.length === 1) {
        touchStartPointRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        touchStartPanRef.current = { ...panOffsetRef.current };
        if (zoomLevelRef.current > 1) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStartDistRef.current !== null) {
        e.preventDefault();
        e.stopPropagation();
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = currentDist / touchStartDistRef.current;
        const nextZoom = Math.max(1, Math.min(5, touchStartZoomRef.current * scale));
        setZoomLevel(Number(nextZoom.toFixed(2)));
      } else if (e.touches.length === 1 && touchStartPointRef.current && touchStartPanRef.current) {
        if (zoomLevelRef.current > 1) {
          e.preventDefault();
          e.stopPropagation();
          const dx = e.touches[0].clientX - touchStartPointRef.current.x;
          const dy = e.touches[0].clientY - touchStartPointRef.current.y;
          setPanOffset({
            x: touchStartPanRef.current.x + dx,
            y: touchStartPanRef.current.y + dy
          });
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        touchStartDistRef.current = null;
      }
      if (e.touches.length === 0) {
        touchStartPointRef.current = null;
        touchStartPanRef.current = null;
        setZoomLevel(z => {
          if (z <= 1) {
            setPanOffset({ x: 0, y: 0 });
          }
          return z;
        });
      }
    };

    container.addEventListener('wheel', handleNativeWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleNativeWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  // Isolate wheel scrolling inside the academic citation metadata drawer so reaching edges never scrolls the main page
  useEffect(() => {
    const metaEl = metadataScrollRef.current;
    if (!metaEl) return;

    const handleMetaWheel = (e: WheelEvent) => {
      e.stopPropagation();
      const { scrollTop, scrollHeight, clientHeight } = metaEl;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // Prevent scroll chaining to parent window when hitting the top or bottom of citation content
      if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
        e.preventDefault();
      }
    };

    metaEl.addEventListener('wheel', handleMetaWheel, { passive: false });
    return () => {
      metaEl.removeEventListener('wheel', handleMetaWheel);
    };
  }, [isMetadataOpen, activeTab]);

  // Convert vertical wheel on the filmstrip carousel to horizontal scrolling and prevent page scrolling
  useEffect(() => {
    const filmstrip = filmstripRef.current;
    if (!filmstrip) return;

    const handleFilmstripWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 || e.deltaX !== 0) {
        e.preventDefault();
        e.stopPropagation();
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        filmstrip.scrollBy({ left: delta, behavior: 'auto' });
      }
    };

    filmstrip.addEventListener('wheel', handleFilmstripWheel, { passive: false });
    return () => {
      filmstrip.removeEventListener('wheel', handleFilmstripWheel);
    };
  }, [isThumbnailsOpen, illustrationsList.length]);

  // Pan event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetViewport = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setRotation(0);
    setIsHighContrast(false);
    setIsInverted(false);
  };

  const scrollFilmstrip = (direction: 'left' | 'right') => {
    if (!filmstripRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    filmstripRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Academic Citation Formatting Engine
  const generateCitation = useCallback((style: CitationStyle): string => {
    if (!illustration) return '';
    
    const year = illustration.date ? illustration.date.replace(/[^0-9]/g, '').slice(0, 4) || 'n.d.' : 'n.d.';
    const authors = illustration.researchers && illustration.researchers.length > 0
      ? illustration.researchers.join(', ')
      : 'Handler, Jerome & Tuite, Michael';
    const title = illustration.title;
    const source = illustration.source;
    const regId = illustration.regId;
    const accessDate = 'September 2026';
    const url = illustration.slaveryImagesPage || `http://www.slaveryimages.org/s/slaveryimages/item/${illustration.objectId}`;

    switch (style) {
      case 'chicago':
        return `${authors}. "${title}." ${source} (${illustration.date || 'n.d.'}). Historical engraving, Plate ID: ${regId}. Slavery Images: A Visual Record of the African Slave Trade, accessed ${accessDate}, ${url}.`;
      case 'apa':
        return `${authors} (${year}). ${title} [Historical plate ${regId}]. In ${source}. Retrieved ${accessDate}, from Slavery Images Database: ${url}`;
      case 'harvard':
        return `${authors} (${year}) '${title}', Plate ${regId}. In ${source}. Available at: ${url} (Accessed: ${accessDate}).`;
      case 'bibtex':
        return `@misc{slaveryimages_${illustration.objectId},
  author = {${authors}},
  title = {${title}},
  year = {${year}},
  howpublished = {Slavery Images: A Visual Record of the African Slave Trade},
  note = {Plate ID: ${regId}, Identifier: ${illustration.identifier || regId}},
  url = {${url}}
}`;
      default:
        return '';
    }
  }, [illustration]);

  const copyCitation = async () => {
    const text = generateCitation(activeCitationStyle);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    }
  };

  const handleExportPDF = async () => {
    if (!illustration || isExportingPDF) return;
    setIsExportingPDF(true);
    try {
      const citation = generateCitation(activeCitationStyle);
      await exportHighDpiPlatePDF(illustration, citation);
    } catch {
      // PDF export fallback
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportBibTeX = () => {
    if (illustration) exportBibTeXFile(illustration);
  };

  const handleExportRIS = () => {
    if (illustration) exportRISFile(illustration);
  };

  const handleExportCSL = () => {
    if (illustration) exportCSLJSONFile(illustration);
  };

  if (!illustration) return null;

  const imageUrl = illustration.imageUrls?.[0] || 'https://si.regeneratedidentities.org/project/DataFiles/SI-OB-17/17-4.jpg';

  const contentUI = (
    <div 
      ref={rootRef}
      className={`archival-viewer-root bg-[#FAF8F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 border border-stone-200/90 dark:border-stone-800 rounded-3xl w-full shadow-2xl relative text-left overflow-hidden flex flex-col transition-all duration-300 ${
        mode === 'embedded' ? 'h-full border-none rounded-none shadow-none' : isFullscreen ? 'h-full max-h-[98vh] max-w-[98vw]' : 'w-full max-w-7xl h-[92vh] max-h-[95vh]'
      }`}
      onClick={e => e.stopPropagation()}
    >
      {/* Top Header Bar — Polished Light Editorial Palette */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-stone-200/90 dark:border-stone-800 bg-[#F4EFE6]/90 dark:bg-stone-900/90 backdrop-blur-md shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0 pr-4">
          <div className="px-2.5 py-1 rounded-full bg-amber-900/10 dark:bg-amber-400/10 border border-amber-900/15 dark:border-amber-400/20 text-amber-900 dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
            Plate {illustration.regId}
          </div>
          <h2 className="text-xs sm:text-sm md:text-base font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
            {illustration.title}
          </h2>
          {currentIndex !== -1 && illustrationsList.length > 0 && (
            <span className="hidden md:inline-flex text-[11px] font-mono text-stone-500 dark:text-stone-400">
              ({currentIndex + 1} of {illustrationsList.length})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Previous / Next Quick Stepper */}
          {illustrationsList.length > 1 && (
            <div className="flex items-center gap-0.5 bg-stone-200/70 dark:bg-stone-900 border border-stone-300/80 dark:border-stone-700/80 rounded-xl p-0.5 mr-1">
              <button
                onClick={handlePrevIllustration}
                className="p-1.5 rounded-lg hover:bg-stone-300/80 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                title="Previous Plate (Alt + ←)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNextIllustration}
                className="p-1.5 rounded-lg hover:bg-stone-300/80 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                title="Next Plate (Alt + →)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Full-Screen Modal Button — Placed right beside pagination buttons, before Filmstrip button */}
          <button
            onClick={toggleFullscreen}
            className={`flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
              isFullscreen
                ? 'bg-amber-900 text-amber-50 border-amber-900 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/40 shadow-2xs'
                : 'bg-stone-200/70 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-300/70 dark:border-stone-700'
            }`}
            title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen Mode (F)"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          {/* Toggle Thumbnails Strip */}
          {illustrationsList.length > 0 && (
            <button
              onClick={() => setIsThumbnailsOpen(!isThumbnailsOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isThumbnailsOpen 
                  ? 'bg-amber-900 text-amber-50 dark:bg-amber-500/20 dark:text-amber-300 shadow-2xs' 
                  : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/80 border border-stone-300/70 dark:border-stone-700'
              }`}
              title="Toggle Filmstrip Tray"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filmstrip ({illustrationsList.length})</span>
            </button>
          )}

          {/* Collapsible Metadata Drawer Toggle with Navigation Drawer Style Icon */}
          <button
            onClick={() => setIsMetadataOpen(!isMetadataOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              isMetadataOpen
                ? 'bg-stone-200/70 hover:bg-stone-300 text-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-200 border border-stone-300/70 dark:border-stone-700'
                : 'bg-amber-900/10 hover:bg-amber-900/20 text-amber-900 border border-amber-900/25 dark:bg-amber-500/20 dark:text-amber-300'
            }`}
            title={isMetadataOpen ? "Hide Details Drawer" : "Show Details Drawer"}
          >
            {isMetadataOpen ? (
              <>
                <DynamicIcon icon="codicon:layout-sidebar-right-off" className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                <span className="hidden sm:inline">Hide Details</span>
              </>
            ) : (
              <>
                <DynamicIcon icon="codicon:layout-sidebar-right" className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                <span className="hidden sm:inline">Show Details</span>
              </>
            )}
          </button>

          {mode === 'modal' && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-200/70 hover:bg-red-100 hover:text-red-900 dark:bg-stone-800 dark:hover:bg-red-950/60 dark:hover:text-red-300 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer border border-stone-300/70 dark:border-stone-700"
              aria-label="Close Archival Inspection"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Split Body: Interactive Viewport & Academic Dossier / Tray */}
      <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col lg:flex-row">
        
        {/* Center Canvas: Archival Museum Matte Viewport */}
        <div className={`relative flex flex-col justify-between select-none overflow-hidden group bg-[#EFEAE1] dark:bg-[#121110] transition-all duration-300 h-full ${
          isMetadataOpen ? 'w-full lg:w-7/12 xl:w-2/3 border-b lg:border-b-0 lg:border-r border-stone-200/90 dark:border-stone-800' : 'w-full'
        }`}>
          
          {/* Subtle Archival Matting Background Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#78716c 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          {/* Floating Top Control Toolbar — Light Editorial Glass Style */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#FAF8F5]/95 dark:bg-stone-900/90 backdrop-blur-md border border-stone-300/90 dark:border-white/15 text-stone-800 dark:text-stone-100 shadow-md">
            <button
              onClick={() => setZoomLevel(z => Math.min(z + 0.5, 5))}
              className="p-2 rounded-xl hover:bg-stone-200/80 dark:hover:bg-white/20 transition-colors cursor-pointer text-stone-800 dark:text-stone-200"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setZoomLevel(z => {
                  const next = Math.max(z - 0.5, 1);
                  if (next === 1) setPanOffset({ x: 0, y: 0 });
                  return next;
                });
              }}
              className="p-2 rounded-xl hover:bg-stone-200/80 dark:hover:bg-white/20 transition-colors cursor-pointer text-stone-800 dark:text-stone-200"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono px-2 text-stone-700 dark:text-stone-300 select-none font-semibold">
              {Math.round(zoomLevel * 100)}%
            </span>

            <div className="w-px h-4 bg-stone-300 dark:bg-white/20 mx-0.5" />

            {/* Fullscreen Icon (Replaces Rotation Icon) */}
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isFullscreen 
                  ? 'bg-amber-900 text-amber-50 font-bold dark:bg-amber-500 dark:text-stone-950' 
                  : 'hover:bg-stone-200/80 dark:hover:bg-white/20 text-stone-800 dark:text-stone-200'
              }`}
              title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isHighContrast 
                  ? 'bg-amber-900 text-amber-50 font-bold dark:bg-amber-500 dark:text-stone-950' 
                  : 'hover:bg-stone-200/80 dark:hover:bg-white/20 text-stone-800 dark:text-stone-200'
              }`}
              title="High Contrast Filter"
            >
              <Contrast className="w-4 h-4" />
            </button>

            <button
              onClick={resetViewport}
              className="p-2 rounded-xl hover:bg-stone-200/80 dark:hover:bg-white/20 transition-colors cursor-pointer text-xs font-mono font-bold text-stone-700 dark:text-stone-300"
              title="Reset Viewport"
            >
              Reset
            </button>
          </div>

          {/* Interactive Zoomable Viewport — Occupies Full Available Area Above Caption Bar & Filmstrip */}
          <div 
            ref={containerRef}
            className="w-full flex-1 min-h-0 flex items-center justify-center relative overflow-hidden cursor-grab active:cursor-grabbing p-2 sm:p-4 touch-none overscroll-contain select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              className="transition-transform duration-75 ease-out flex items-center justify-center w-full h-full"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`
              }}
            >
              <img
                src={imageUrl}
                alt={illustration.title}
                draggable={false}
                className={`max-w-full max-h-full object-contain shadow-2xl rounded-md ring-1 ring-stone-900/10 dark:ring-white/10 transition-all duration-300 ${
                  isHighContrast ? 'contrast-150 brightness-110 grayscale' : 'contrast-105'
                }`}
              />
            </div>
          </div>

          {/* Caption & Navigation Guidance Bar — Positioned OUTSIDE the image/zoom container */}
          <div className="w-full shrink-0 px-4 py-2.5 bg-[#F4EFE6]/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200/90 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
            {/* Archival Plate Caption */}
            <div className="flex items-center gap-2 min-w-0 max-w-xl truncate text-stone-700 dark:text-stone-300">
              <span className="font-serif font-semibold text-stone-900 dark:text-stone-100 truncate">
                {illustration.title}
              </span>
              {illustration.date && (
                <span className="text-stone-500 dark:text-stone-400 font-mono text-[11px] shrink-0">
                  ({illustration.date})
                </span>
              )}
            </div>

            {/* Navigation Information Label / Pill (Positioned outside the zoom window) */}
            <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono text-stone-600 dark:text-stone-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/80 dark:bg-stone-800 border border-stone-300/80 dark:border-stone-700/80 text-stone-700 dark:text-stone-300 shadow-2xs">
                <Compass className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                <span>Scroll wheel: Zoom · Drag: Pan · Alt + ← / →: Step plates</span>
              </span>
            </div>
          </div>

          {/* Bottom Complete Filmstrip Drawer — Positioned in flex flow so it never obscures image bottom/legend */}
          {isThumbnailsOpen && illustrationsList.length > 0 && (
            <div className="w-full shrink-0 bg-[#FAF8F5]/95 dark:bg-stone-950/95 backdrop-blur-xl border-t border-stone-200/90 dark:border-stone-800 p-2.5 z-20 flex items-center gap-2 shadow-md">
              <div className="flex items-center gap-1 shrink-0 px-2 text-[11px] font-mono text-stone-600 dark:text-stone-400">
                <span className="font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider">All Plates ({illustrationsList.length}):</span>
              </div>

              {/* Left Scroll Trigger */}
              <button
                onClick={() => scrollFilmstrip('left')}
                className="p-1.5 rounded-lg bg-stone-200/80 hover:bg-stone-300 text-stone-700 dark:bg-stone-900 dark:hover:bg-stone-800 dark:text-stone-300 border border-stone-300 dark:border-stone-700/60 transition-colors cursor-pointer shrink-0"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Scrollable Container with all images */}
              <div 
                ref={filmstripRef}
                className="flex items-center gap-2.5 overflow-x-auto py-1 scroll-smooth no-scrollbar flex-1 min-w-0 overscroll-contain"
                style={{ scrollbarWidth: 'thin' }}
              >
                {illustrationsList.map((item, idx) => {
                  const isCurrent = item.objectId === illustration.objectId;
                  const thumb = item.imageUrls?.[0] || '';
                  return (
                    <button
                      key={item.objectId}
                      data-thumb-id={item.objectId}
                      onClick={() => onSelectIllustration?.(item)}
                      className={`group relative w-16 sm:w-20 h-14 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer flex flex-col justify-end bg-stone-100 dark:bg-stone-900 ${
                        isCurrent 
                          ? 'border-amber-900 dark:border-amber-400 ring-2 ring-amber-900/30 dark:ring-amber-400/50 scale-105 shadow-md' 
                          : 'border-stone-300/80 dark:border-stone-800 opacity-75 hover:opacity-100 hover:border-amber-800/60 dark:hover:border-amber-500/50'
                      }`}
                      title={`${item.regId}: ${item.title}`}
                    >
                      <img src={thumb} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
                      <div className="relative z-10 px-1 py-0.5 text-[9px] font-mono font-bold text-amber-200 dark:text-amber-300 truncate w-full bg-black/60 backdrop-blur-xs text-center">
                        {item.regId || `#${idx + 1}`}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Scroll Trigger */}
              <button
                onClick={() => scrollFilmstrip('right')}
                className="p-1.5 rounded-lg bg-stone-200/80 hover:bg-stone-300 text-stone-700 dark:bg-stone-900 dark:hover:bg-stone-800 dark:text-stone-300 border border-stone-300 dark:border-stone-700/60 transition-colors cursor-pointer shrink-0"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Collapsible Panel: Polished Editorial Dossier & Citation Generator */}
        {isMetadataOpen && (
          <div className="w-full lg:w-5/12 xl:w-1/3 bg-[#FAF8F5] dark:bg-[#161413] flex flex-col h-full min-h-0 border-t lg:border-t-0 border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100 overflow-hidden">
            
            {/* Panel Header & Tabs: Metadata, Citation & Academia */}
            <div className="flex items-center justify-between border-b border-stone-200/90 dark:border-stone-800 bg-[#F4EFE6]/90 dark:bg-stone-950/80 shrink-0">
              <div className="flex items-center flex-1">
                <button
                  onClick={() => setActiveTab('metadata')}
                  className={`flex-1 py-3 text-[clamp(0.72rem,0.95vw,0.85rem)] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'metadata'
                      ? 'bg-[#FAF8F5] dark:bg-[#161413] text-amber-900 dark:text-amber-400 border-b-2 border-amber-800 dark:border-amber-500 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                  title="Archival Metadata"
                >
                  <Info className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400 shrink-0" />
                  <span className="truncate">Metadata</span>
                </button>

                <button
                  onClick={() => setActiveTab('citation')}
                  className={`flex-1 py-3 text-[clamp(0.72rem,0.95vw,0.85rem)] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'citation'
                      ? 'bg-[#FAF8F5] dark:bg-[#161413] text-amber-900 dark:text-amber-400 border-b-2 border-amber-800 dark:border-amber-500 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                  title="Academic Citation Generator"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400 shrink-0" />
                  <span className="truncate">Citation</span>
                </button>

                <button
                  onClick={() => setActiveTab('academia')}
                  className={`flex-1 py-3 text-[clamp(0.72rem,0.95vw,0.85rem)] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'academia'
                      ? 'bg-[#FAF8F5] dark:bg-[#161413] text-amber-900 dark:text-amber-400 border-b-2 border-amber-800 dark:border-amber-500 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                  title="Academic Curatorial Dossier & Research Foundations"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400 shrink-0" />
                  <span className="truncate">Academia</span>
                </button>
              </div>

              {/* Close / Collapse Button in Header with Navigation Drawer Icon */}
              <button
                onClick={() => setIsMetadataOpen(false)}
                className="p-3 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-900 transition-colors cursor-pointer border-l border-stone-200/90 dark:border-stone-800 shrink-0"
                title="Collapse Details Drawer"
              >
                <DynamicIcon icon="codicon:layout-sidebar-right-off" className="w-4 h-4 text-amber-800 dark:text-amber-400" />
              </button>
            </div>

            <div 
              ref={metadataScrollRef}
              className="p-5 sm:p-6 space-y-6 flex-1 min-h-0 overflow-y-auto drawer-cozy-scrollbar overscroll-contain"
              style={{ scrollbarGutter: 'stable', scrollbarWidth: 'thin' }}
            >
              
              {/* TAB 1: ARCHIVAL METADATA */}
              {activeTab === 'metadata' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-900 dark:text-amber-400">
                      Catalog Entry {illustration.regId}
                    </span>
                    <h3 className="text-[clamp(1.05rem,1.4vw,1.35rem)] font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug">
                      {illustration.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-[clamp(0.78rem,1vw,0.875rem)] font-mono text-stone-600 dark:text-stone-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                        {illustration.date || 'Historical Epoch'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                        {illustration.source}
                      </span>
                    </div>
                  </div>

                  {illustration.description && (
                    <div className="space-y-2 p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-2xs">
                      <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-900 dark:text-amber-400">
                        Historical Note &amp; Significance
                      </span>
                      <p className="text-[clamp(0.85rem,1.15vw,0.975rem)] font-serif text-stone-800 dark:text-stone-200 leading-[1.7] whitespace-pre-line">
                        {illustration.description}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-stone-600 dark:text-stone-400">
                      Classification &amp; Categorization
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {illustration.collectionNames.map((col, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-stone-200/70 dark:bg-stone-800 text-stone-800 dark:text-stone-300 text-xs font-mono border border-stone-300/60 dark:border-stone-700">
                          {col}
                        </span>
                      ))}
                      {illustration.itemSets.map((set, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-amber-900/10 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-mono border border-amber-900/20 dark:border-amber-500/30 font-semibold">
                          {set}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-stone-200 dark:border-stone-800">
                    <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-stone-600 dark:text-stone-400">
                      Research Provenance
                    </span>
                    <div className="space-y-1.5 text-[clamp(0.8rem,1.05vw,0.9rem)] font-mono text-stone-600 dark:text-stone-400">
                      <p><strong className="text-stone-900 dark:text-stone-300">Curators / Artists:</strong> {illustration.researchers.join(', ')}</p>
                      <p><strong className="text-stone-900 dark:text-stone-300">Identifier:</strong> {illustration.identifier || `SI-OB-${illustration.objectId}`}</p>
                    </div>
                  </div>

                  {illustration.slaveryImagesPage && (
                    <div className="pt-2">
                      <a
                        href={illustration.slaveryImagesPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 text-xs font-mono font-bold transition-all w-full justify-center shadow-sm"
                      >
                        <span>View in External Repository</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CITATION GENERATOR */}
              {activeTab === 'citation' && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-900 dark:text-amber-400">
                      Academic Citation Generator
                    </span>
                    <p className="text-[clamp(0.85rem,1.15vw,0.975rem)] font-serif text-stone-600 dark:text-stone-400 leading-[1.65]">
                      Copy standardized bibliographic references formatted for research publications and academic monographs.
                    </p>
                  </div>

                  {/* Style Selector Tabs */}
                  <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-stone-200/70 dark:bg-stone-900 border border-stone-300/70 dark:border-stone-800">
                    {(['chicago', 'apa', 'harvard', 'bibtex'] as CitationStyle[]).map(style => (
                      <button
                        key={style}
                        onClick={() => setActiveCitationStyle(style)}
                        className={`py-1.5 rounded-lg text-[clamp(0.7rem,0.9vw,0.8rem)] font-mono font-bold uppercase transition-all cursor-pointer ${
                          activeCitationStyle === style
                            ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm border border-stone-300/80 dark:border-stone-700'
                            : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>

                  {/* Citation Output Box */}
                  <div className="space-y-3">
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 font-mono text-[clamp(0.8rem,1.05vw,0.9rem)] text-stone-800 dark:text-stone-200 select-all whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto shadow-2xs">
                      {generateCitation(activeCitationStyle)}
                    </div>

                    {/* Copy and Download Action Buttons */}
                    <div className="space-y-2.5 pt-1">
                      <button
                        onClick={copyCitation}
                        className="w-full py-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-stone-950 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        {hasCopied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-300" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Formatted Citation</span>
                          </>
                        )}
                      </button>

                      {/* Reference Manager File Downloads */}
                      <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-500 dark:text-stone-400 block">
                          Export Reference Files
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={handleExportBibTeX}
                            className="px-2 py-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-[11px] font-mono font-bold transition-colors border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-1 cursor-pointer"
                            title="Download BibTeX (.bib) for LaTeX/Overleaf"
                          >
                            <Download className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                            <span>.BIB</span>
                          </button>
                          <button
                            onClick={handleExportRIS}
                            className="px-2 py-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-[11px] font-mono font-bold transition-colors border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-1 cursor-pointer"
                            title="Download RIS (.ris) for Zotero/EndNote/Mendeley"
                          >
                            <Download className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                            <span>.RIS</span>
                          </button>
                          <button
                            onClick={handleExportCSL}
                            className="px-2 py-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-[11px] font-mono font-bold transition-colors border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-1 cursor-pointer"
                            title="Download CSL-JSON (.json)"
                          >
                            <Download className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                            <span>.JSON</span>
                          </button>
                        </div>
                      </div>

                      {/* High-DPI PDF Export Button */}
                      <button
                        onClick={handleExportPDF}
                        disabled={isExportingPDF}
                        className="w-full py-2.5 rounded-xl bg-stone-200/80 hover:bg-stone-300/80 text-stone-900 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-100 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-stone-300 dark:border-stone-700 disabled:opacity-50"
                      >
                        {isExportingPDF ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-amber-700 dark:text-amber-400" />
                            <span>Rendering High-DPI PDF...</span>
                          </>
                        ) : (
                          <>
                            <FileDown className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                            <span>Export High-DPI Archival PDF</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ACADEMIA & CURATORIAL DOSSIER — FLUID & INVITING READABILITY */}
              {activeTab === 'academia' && (
                <div className="space-y-7 text-left">
                  
                  {/* Lead Summary Section with Prominent Lead Paragraph */}
                  <div className="space-y-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-xs relative overflow-hidden">
                    
                    {/* Top Accent Pill */}
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-amber-900/10 dark:bg-amber-400/10 border border-amber-900/20 dark:border-amber-400/20">
                        <Scroll className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                      </div>
                      <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-900 dark:text-amber-400">
                        Lead Summary &amp; Historical Proposition
                      </span>
                    </div>

                    {/* PROMINENT MAIN LEAD PARAGRAPH */}
                    <div className="border-l-3 border-amber-800/80 dark:border-amber-400/80 pl-4 py-1">
                      <p className="text-[clamp(0.98rem,1.35vw,1.15rem)] font-serif font-medium leading-[1.75] text-stone-900 dark:text-stone-100 tracking-tight">
                        This Iconographic Historical Archive starts with the proposition that race has a history and that the historical experience of the peoples of Latin America is crucial to understanding the ways we use &ldquo;race&rdquo; today.
                      </p>
                    </div>

                    {/* Contextual Elaboration Paragraphs */}
                    <p className="text-[clamp(0.875rem,1.15vw,0.985rem)] font-serif leading-[1.75] text-stone-700 dark:text-stone-300">
                      This collection of paintings examines how and why ideologies of difference involving purity and blood (and &ldquo;purity of blood,&rdquo; <em>pureza de sangre</em>) took hold and changed, from the Caribbean cultural collisions of 1492 to the nineteenth-century breakup of Iberian colonialism. What kinds of categories and power relations took shape around such notions, and what effects did they have in people&rsquo;s lives? What did it mean to be &ldquo;mestiza,&rdquo; &ldquo;criollo,&rdquo; etc.?
                    </p>

                    <p className="text-[clamp(0.875rem,1.15vw,0.985rem)] font-serif leading-[1.75] text-stone-700 dark:text-stone-300">
                      They serve as a launchpad to examine the late nineteenth-century rise of <em>cient&iacute;ficos</em> (scientists: read &ldquo;Positivists&rdquo;) and intertwining ideologies of race and nation, paying special attention to Guatemala and Brazil. They serve as a comparative lens on other criteria of difference&mdash;by gender, class or social &ldquo;estate,&rdquo; or ethnicity&mdash;also used to draw distinctions and create hierarchy.
                    </p>
                  </div>

                  {/* Academic Summary & Key Themes */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-amber-900/10 dark:bg-amber-400/10 border border-amber-900/20 dark:border-amber-400/20">
                        <BookOpen className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                      </div>
                      <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-900 dark:text-amber-400">
                        Academic Summary &amp; Core Themes
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-900/5 dark:bg-amber-950/25 border border-amber-900/15 dark:border-amber-500/25 space-y-2.5">
                      <h4 className="text-[clamp(0.95rem,1.25vw,1.1rem)] font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug">
                        The History of Race in Latin America
                      </h4>
                      <p className="text-[clamp(0.85rem,1.15vw,0.95rem)] font-serif text-stone-800 dark:text-stone-200 leading-[1.7]">
                        A foundational historical framework and university course curriculum—such as those developed and taught by historian <strong>Dr. Kathryn Burns</strong> at the University of North Carolina at Chapel Hill—examining how racial categories, social stratification, and cultural mixing evolved from the colonial era to the modern day.
                      </p>
                    </div>

                    {/* Key Themes Cards */}
                    <div className="space-y-3">
                      <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-stone-500 dark:text-stone-400">
                        Key Historical Pillars
                      </span>

                      <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 space-y-1.5 shadow-2xs">
                          <strong className="text-[clamp(0.9rem,1.2vw,1.025rem)] font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-700 dark:bg-amber-400 shrink-0" />
                            Colonial Hierarchies (Casta System)
                          </strong>
                          <p className="text-[clamp(0.85rem,1.15vw,0.95rem)] font-serif text-stone-700 dark:text-stone-300 leading-[1.7] pl-4">
                            Spanish and Portuguese colonizers established complex legal classifications based on ancestry, blood purity (<em>limpieza de sangre</em>), and religious conversion during the 16th and 17th centuries.
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 space-y-1.5 shadow-2xs">
                          <strong className="text-[clamp(0.9rem,1.2vw,1.025rem)] font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-700 dark:bg-amber-400 shrink-0" />
                            Mestizaje (Racial Mixing)
                          </strong>
                          <p className="text-[clamp(0.85rem,1.15vw,0.95rem)] font-serif text-stone-700 dark:text-stone-300 leading-[1.7] pl-4">
                            Unlike rigid binary or segregation models seen elsewhere, Latin American societies heavily integrated intermarriage and cultural blending as foundational elements of national identity.
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 space-y-1.5 shadow-2xs">
                          <strong className="text-[clamp(0.9rem,1.2vw,1.025rem)] font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-700 dark:bg-amber-400 shrink-0" />
                            Sociocultural Status &amp; Literacy
                          </strong>
                          <p className="text-[clamp(0.85rem,1.15vw,0.95rem)] font-serif text-stone-700 dark:text-stone-300 leading-[1.7] pl-4">
                            Racial identity in Latin America was historically tied not just to skin color or phenotype but also to language skills, dress, wealth, and formal education.
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 space-y-1.5 shadow-2xs">
                          <strong className="text-[clamp(0.9rem,1.2vw,1.025rem)] font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-700 dark:bg-amber-400 shrink-0" />
                            Policies of Whitening (Blanqueamiento)
                          </strong>
                          <p className="text-[clamp(0.85rem,1.15vw,0.95rem)] font-serif text-stone-700 dark:text-stone-300 leading-[1.7] pl-4">
                            During the 19th and 20th centuries, many Latin American nations promoted European immigration to socially and physically whiten their populations while marginalizing Indigenous and Afro-descendant heritages.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scholarly Profile: Dr. Kathryn Burns */}
                  <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-amber-900/10 dark:bg-amber-400/10 border border-amber-900/20 dark:border-amber-400/20">
                        <Award className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                      </div>
                      <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-900 dark:text-amber-400">
                        Lead Scholar &amp; Academic Authority
                      </span>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h4 className="text-[clamp(1.05rem,1.4vw,1.25rem)] font-serif font-bold text-stone-900 dark:text-stone-100">
                            Kathryn Burns, Ph.D.
                          </h4>
                          <p className="text-[clamp(0.85rem,1.1vw,0.95rem)] font-serif text-amber-900 dark:text-amber-400 font-semibold pt-0.5">
                            Professor Emerita of History, UNC Chapel Hill
                          </p>
                        </div>

                        {/* External Faculty Profile Link */}
                        <a
                          href="https://history.unc.edu/person/kathryn-j-burns/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-mono font-semibold transition-all border border-stone-200 dark:border-stone-700 shrink-0 self-start sm:self-auto"
                        >
                          <span>UNC Faculty Profile</span>
                          <ExternalLink className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                        </a>
                      </div>

                      {/* Education Background */}
                      <div className="space-y-1.5 pt-2 border-t border-stone-200/80 dark:border-stone-800">
                        <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-stone-500 dark:text-stone-400">
                          Education &amp; Academic Degrees
                        </span>
                        <ul className="text-[clamp(0.825rem,1.1vw,0.925rem)] font-mono text-stone-700 dark:text-stone-300 space-y-1 pl-1">
                          <li>• <strong>B.A.</strong>, Princeton University (1981)</li>
                          <li>• <strong>M.A.</strong>, University of Texas at Austin (1984)</li>
                          <li>• <strong>M.A.</strong>, Harvard University (1988)</li>
                          <li>• <strong>Ph.D.</strong>, Harvard University (1993)</li>
                        </ul>
                      </div>

                      {/* Research Interests */}
                      <div className="space-y-2 pt-2 border-t border-stone-200/80 dark:border-stone-800">
                        <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-stone-500 dark:text-stone-400">
                          Research Interests &amp; Notarial Archives
                        </span>
                        <p className="text-[clamp(0.85rem,1.15vw,0.965rem)] font-serif text-stone-700 dark:text-stone-300 leading-[1.75]">
                          Kathryn Burns works on colonial Latin America, especially the history of mestizaje, property, and literacy in the colonial Andes. Her first book examined nuns, production, and reproduction in Cuzco. Her second traces the practices of the Spanish American <em>escribanos</em> who shaped notarial truth and generated vast colonial archives.
                        </p>
                      </div>

                      {/* Major Publications */}
                      <div className="space-y-2 pt-2 border-t border-stone-200/80 dark:border-stone-800">
                        <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-stone-500 dark:text-stone-400">
                          Major Publications by Kathryn Burns
                        </span>
                        <ul className="text-[clamp(0.85rem,1.15vw,0.965rem)] font-serif text-stone-800 dark:text-stone-200 space-y-2.5 list-disc pl-5 leading-[1.65]">
                          <li>
                            <em>Into the Archive: Writing and Power in Colonial Peru</em> (Duke University Press, 2010)
                          </li>
                          <li>
                            &ldquo;Unfixing Race,&rdquo; in <em>Rereading the Black Legend: The Discourses of Religious and Racial Difference in the Renaissance Empires</em>, eds. Margaret R. Greer, Walter D. Mignolo, and Maureen Quilligan (University of Chicago, 2007), 188–202
                          </li>
                          <li>
                            <em>Colonial Habits: Convents and the Spiritual Economy of Cuzco, Peru</em> (Duke University Press, 1999)
                          </li>
                          <li>
                            &ldquo;Dentro de la ciudad letrada: La producción de la escritura pública en el Perú colonial,&rdquo; <em>Histórica</em> [Lima, Peru] 29:1 (July 2005), 43–68
                          </li>
                          <li>
                            &ldquo;Notaries, Truth, and Consequences,&rdquo; <em>American Historical Review</em> 110:2 (April 2005), 350–379
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );

  if (mode === 'embedded') {
    return contentUI;
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {contentUI}
    </div>
  );
};
