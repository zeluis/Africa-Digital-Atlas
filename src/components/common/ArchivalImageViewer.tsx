import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Sun, 
  Contrast, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Languages, 
  MapPin, 
  User, 
  Calendar, 
  Info, 
  BookOpen, 
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  FileText,
  Compass,
  Grid,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';
import { SlaveTradeIllustration } from '../../data/slaveTradeIllustrations';

interface ArchivalImageViewerProps {
  illustration: SlaveTradeIllustration | null;
  illustrationsList?: SlaveTradeIllustration[];
  onSelectIllustration?: (item: SlaveTradeIllustration) => void;
  onClose?: () => void;
  mode?: 'modal' | 'embedded' | 'fullscreen';
  showThumbnails?: boolean;
}

type CitationStyle = 'chicago' | 'apa' | 'harvard' | 'bibtex';

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
  
  // Archival Scrutiny Filters & Controls
  const [rotation, setRotation] = useState<number>(0);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(mode === 'fullscreen');
  const [isThumbnailsOpen, setIsThumbnailsOpen] = useState<boolean>(showThumbnails);
  const [activeTab, setActiveTab] = useState<'metadata' | 'citation'>('metadata');

  // Citation Generator state
  const [activeCitationStyle, setActiveCitationStyle] = useState<CitationStyle>('chicago');
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset viewport upon new illustration
  useEffect(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setRotation(0);
    setIsHighContrast(false);
    setIsInverted(false);
  }, [illustration?.objectId]);

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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [illustration, onClose]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.25 : -0.25;
    setZoomLevel(prev => {
      const next = Math.max(1, Math.min(5, prev + zoomFactor));
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return Number(next.toFixed(2));
    });
  };

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

  if (!illustration) return null;

  const imageUrl = illustration.imageUrls?.[0] || 'https://si.regeneratedidentities.org/project/DataFiles/SI-OB-17/17-4.jpg';

  const contentUI = (
    <div 
      className={`bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-3xl w-full shadow-2xl relative text-left overflow-hidden flex flex-col transition-all duration-300 ${
        mode === 'embedded' ? 'h-full border-none rounded-none shadow-none' : isFullscreen ? 'h-full max-h-[98vh] max-w-[98vw]' : 'max-w-7xl max-h-[94vh]'
      }`}
      onClick={e => e.stopPropagation()}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F5]/90 dark:bg-stone-900/80 backdrop-blur-md shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0 pr-4">
          <div className="px-2.5 py-1 rounded-full bg-amber-900/10 dark:bg-amber-400/10 border border-amber-900/15 dark:border-amber-400/20 text-amber-900 dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
            Plate {illustration.regId}
          </div>
          <h2 className="text-sm md:text-base font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
            {illustration.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {illustrationsList.length > 0 && (
            <button
              onClick={() => setIsThumbnailsOpen(!isThumbnailsOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isThumbnailsOpen 
                  ? 'bg-amber-900 text-amber-100 dark:bg-amber-500/20 dark:text-amber-300' 
                  : 'bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/80'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Archive Tray</span>
            </button>
          )}

          {mode === 'modal' && (
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800/80 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {mode === 'modal' && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800/80 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              aria-label="Close Archival Inspection"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Split Body: Interactive Viewport & Academic Dossier / Tray */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden relative">
        
        {/* Left / Center: Edge-to-Edge Archival Deep Zoom & Pan Canvas */}
        <div className={`relative flex flex-col items-center justify-between select-none overflow-hidden group border-b lg:border-b-0 lg:border-r border-stone-800 bg-[#131110] ${
          isThumbnailsOpen ? 'lg:col-span-7' : 'lg:col-span-8'
        }`}>
          
          {/* Floating Top Control Toolbar */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-white shadow-lg">
            <button
              onClick={() => setZoomLevel(z => Math.min(z + 0.5, 5))}
              className="p-2 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
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
              className="p-2 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono px-2 text-stone-300">
              {Math.round(zoomLevel * 100)}%
            </span>

            <div className="w-px h-4 bg-white/20 mx-0.5" />

            <button
              onClick={() => setRotation(r => (r + 90) % 360)}
              className="p-2 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
              title="Rotate 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${isHighContrast ? 'bg-amber-500 text-stone-950 font-bold' : 'hover:bg-white/20'}`}
              title="High Contrast Scrutiny Filter"
            >
              <Contrast className="w-4 h-4" />
            </button>

            <button
              onClick={resetViewport}
              className="p-2 rounded-xl hover:bg-white/20 transition-colors cursor-pointer text-xs font-mono"
              title="Reset Viewport"
            >
              Reset
            </button>
          </div>

          {/* Interactive Zoomable Viewport */}
          <div 
            ref={containerRef}
            className="w-full h-full flex items-center justify-center relative overflow-hidden cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              className="transition-transform duration-75 ease-out flex items-center justify-center w-full h-full p-4"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`
              }}
            >
              <img
                src={imageUrl}
                alt={illustration.title}
                draggable={false}
                className={`max-w-full max-h-full object-contain shadow-2xl transition-all duration-300 ${
                  isHighContrast ? 'contrast-150 brightness-110 grayscale' : 'contrast-105'
                }`}
              />
            </div>
          </div>

          {/* Bottom Thumbnail Strip Drawer (if enabled) */}
          {isThumbnailsOpen && illustrationsList.length > 0 && (
            <div className="absolute bottom-0 inset-x-0 bg-black/85 backdrop-blur-md border-t border-white/10 p-3 z-20 overflow-x-auto flex items-center gap-2 max-h-24">
              <span className="text-[10px] font-mono uppercase text-stone-400 shrink-0 px-2">
                Archive Tray ({illustrationsList.length}):
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {illustrationsList.map(item => {
                  const isCurrent = item.objectId === illustration.objectId;
                  const thumb = item.imageUrls?.[0] || '';
                  return (
                    <button
                      key={item.objectId}
                      onClick={() => onSelectIllustration?.(item)}
                      className={`relative w-14 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        isCurrent ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105' : 'border-white/20 opacity-70 hover:opacity-100 hover:border-white/50'
                      }`}
                    >
                      <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Overlay Hint */}
          <div className="absolute bottom-3 right-4 z-10 pointer-events-none px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-stone-300 text-[10px] font-mono border border-white/10">
            Scroll to zoom • Drag to pan when zoomed
          </div>
        </div>

        {/* Right Panel: Academic Dossier & Citation Generator */}
        <div className={`bg-[#FAF8F5] dark:bg-stone-900 flex flex-col h-full overflow-y-auto ${
          isThumbnailsOpen ? 'lg:col-span-5' : 'lg:col-span-4'
        }`}>
          {/* Panel Header Tabs */}
          <div className="flex items-center border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 shrink-0">
            <button
              onClick={() => setActiveTab('metadata')}
              className={`flex-1 py-3 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'metadata'
                  ? 'bg-[#FAF8F5] dark:bg-stone-900 text-amber-900 dark:text-amber-400 border-b-2 border-amber-600'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Archival Metadata</span>
            </button>

            <button
              onClick={() => setActiveTab('citation')}
              className={`flex-1 py-3 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'citation'
                  ? 'bg-[#FAF8F5] dark:bg-stone-900 text-amber-900 dark:text-amber-400 border-b-2 border-amber-600'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Academic Citation</span>
            </button>
          </div>

          <div className="p-6 space-y-6 flex-1">
            {activeTab === 'metadata' ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug">
                    {illustration.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      {illustration.date || 'c. 18th Century'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      {illustration.source}
                    </span>
                  </div>
                </div>

                {illustration.description && (
                  <div className="space-y-1.5 p-4 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400">
                      Archival Note &amp; Description
                    </span>
                    <p className="text-xs font-serif text-stone-700 dark:text-stone-300 leading-relaxed">
                      {illustration.description}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-500">
                    Indexing &amp; Collections
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {illustration.collectionNames.map((col, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-stone-200/70 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-mono">
                        {col}
                      </span>
                    ))}
                    {illustration.itemSets.map((set, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-100/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 text-xs font-mono border border-amber-300/30">
                        {set}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-500">
                    Research Attributions
                  </span>
                  <div className="space-y-2 text-xs font-mono text-stone-600 dark:text-stone-400">
                    <p><strong>Researchers:</strong> {illustration.researchers.join(', ')}</p>
                    <p><strong>Database ID:</strong> SI-OB-{illustration.objectId} (Plate {illustration.regId})</p>
                  </div>
                </div>

                {illustration.slaveryImagesPage && (
                  <div className="pt-2">
                    <a
                      href={illustration.slaveryImagesPage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-mono font-bold hover:opacity-90 transition-opacity w-full justify-center"
                    >
                      <span>View on Slavery Images Database</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400">
                    Academic Formatting Generator
                  </span>
                  <p className="text-xs font-serif text-stone-600 dark:text-stone-400 leading-relaxed">
                    Select a citation style to copy formatted bibliographic references for academic publication.
                  </p>
                </div>

                {/* Style Selector Tabs */}
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-stone-200/70 dark:bg-stone-950">
                  {(['chicago', 'apa', 'harvard', 'bibtex'] as CitationStyle[]).map(style => (
                    <button
                      key={style}
                      onClick={() => setActiveCitationStyle(style)}
                      className={`py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase transition-all cursor-pointer ${
                        activeCitationStyle === style
                          ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm'
                          : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>

                {/* Citation Output Box */}
                <div className="space-y-2">
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 font-mono text-xs text-stone-800 dark:text-stone-200 select-all whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {generateCitation(activeCitationStyle)}
                  </div>

                  <button
                    onClick={copyCitation}
                    className="w-full py-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:text-amber-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {hasCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Citation Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Formatted Citation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );

  if (mode === 'embedded') {
    return contentUI;
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {contentUI}
    </div>
  );
};
