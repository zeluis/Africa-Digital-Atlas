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
  RotateCcw
} from 'lucide-react';
import { SlaveTradeIllustration } from '../../data/slaveTradeIllustrations';

interface ArchivalLoupeModalProps {
  illustration: SlaveTradeIllustration | null;
  onClose: () => void;
}

type CitationStyle = 'chicago' | 'apa' | 'harvard' | 'bibtex';

export const ArchivalLoupeModal: React.FC<ArchivalLoupeModalProps> = ({
  illustration,
  onClose
}) => {
  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Archival Scrutiny Filters
  const [rotation, setRotation] = useState<number>(0);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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
      if (e.key === 'Escape') {
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
      : 'Transatlantic Slave Trade Visual Archive';
    const title = illustration.title;
    const source = illustration.source;
    const regId = illustration.regId;
    const accessDate = 'September 2026';
    const url = `https://si.regeneratedidentities.org/project/DataFiles/SI-OB-${illustration.objectId}`;

    switch (style) {
      case 'chicago':
        return `${authors}. "${title}." ${source} (${illustration.date || 'c. 18th century'}). Historical engraving, Plate ID: ${regId}. Africa Data Atlas & Transatlantic Iconography Database, accessed ${accessDate}, ${url}.`;
      case 'apa':
        return `${authors} (${year}). ${title} [Historical engraving/plate ${regId}]. In ${source}. Retrieved ${accessDate}, from ${url}`;
      case 'harvard':
        return `${authors} (${year}) '${title}', Plate ${regId}. In ${source}. Available at: ${url} (Accessed: ${accessDate}).`;
      case 'bibtex':
        return `@misc{iconography_${illustration.objectId},
  author = {${authors}},
  title = {${title}},
  year = {${year}},
  howpublished = {Africa Data Atlas Archival Registry},
  note = {Plate ID: ${regId}, Source: ${source}},
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
      // Fallback
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    }
  };

  if (!illustration) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-3xl w-full shadow-2xl relative text-left overflow-hidden flex flex-col transition-all duration-300 ${
          isFullscreen ? 'h-full max-h-[98vh] max-w-[98vw]' : 'max-w-6xl max-h-[92vh]'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F5]/80 dark:bg-stone-900/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="px-2.5 py-1 rounded-full bg-amber-900/10 dark:bg-amber-400/10 border border-amber-900/15 dark:border-amber-400/20 text-amber-900 dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
              Plate {illustration.regId}
            </div>
            <h2 className="text-sm md:text-base font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
              {illustration.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800/80 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Loupe Mode"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800/80 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              aria-label="Close Archival Inspection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Split Body: Interactive Viewport & Academic Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          
          {/* Left / Center: Archival Deep Zoom & Pan Canvas */}
          <div className="lg:col-span-7 bg-[#131110] relative flex flex-col items-center justify-between select-none overflow-hidden group border-b lg:border-b-0 lg:border-r border-stone-800">
            
            {/* Floating Top Control Toolbar */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-white shadow-lg">
              {/* Zoom In */}
              <button
                onClick={() => setZoomLevel(z => Math.min(z + 0.5, 5))}
                className="p-2 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Zoom Out */}
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

              {/* Zoom Level Readout */}
              <span className="px-2 text-[11px] font-mono font-bold text-amber-400">
                {Math.round(zoomLevel * 100)}%
              </span>

              <div className="w-px h-4 bg-white/20 mx-0.5" />

              {/* Rotate */}
              <button
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="p-2 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* High Contrast Filter */}
              <button
                onClick={() => setIsHighContrast(!isHighContrast)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isHighContrast ? 'bg-amber-500 text-stone-950 font-bold' : 'hover:bg-white/20'
                }`}
                title="Toggle High-Contrast Archival Clarity"
              >
                <Contrast className="w-4 h-4" />
              </button>

              {/* Inverted Darkroom Filter */}
              <button
                onClick={() => setIsInverted(!isInverted)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isInverted ? 'bg-amber-500 text-stone-950 font-bold' : 'hover:bg-white/20'
                }`}
                title="Toggle Inverted Etching Scrutiny Filter"
              >
                <Sun className="w-4 h-4" />
              </button>

              {/* Reset Viewport */}
              {(zoomLevel > 1 || rotation !== 0 || isHighContrast || isInverted) && (
                <button
                  onClick={resetViewport}
                  className="p-2 rounded-xl hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Reset Viewport (0)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Viewport Interactive Image Surface */}
            <div 
              ref={containerRef}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`w-full h-full min-h-[380px] lg:min-h-[500px] flex items-center justify-center relative overflow-hidden ${
                zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
              }`}
            >
              <div 
                className="transition-transform duration-75 ease-out flex items-center justify-center p-4 max-w-full max-h-full"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
                }}
              >
                <img
                  src={illustration.imageUrls[0]}
                  alt={illustration.title}
                  className={`max-h-[60vh] lg:max-h-[70vh] w-auto max-w-full object-contain pointer-events-none transition-all duration-300 shadow-2xl rounded-sm ${
                    isHighContrast ? 'contrast-175 brightness-110' : 'contrast-105'
                  } ${
                    isInverted ? 'invert hue-rotate-180 brightness-90' : ''
                  }`}
                  referrerPolicy="no-referrer"
                  draggable={false}
                />
              </div>
            </div>

            {/* Bottom Status Hint */}
            <div className="w-full py-2.5 px-4 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Scroll wheel to zoom · Click &amp; drag to inspect details</span>
              </span>
              <span className="hidden sm:inline text-stone-500">
                Resolution: Full Archival Scan
              </span>
            </div>
          </div>

          {/* Right Column: In-Depth Scholarly Metadata & Academic Citation Hub */}
          <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-6 drawer-cozy-scrollbar bg-white dark:bg-stone-950">
            <div className="space-y-6">
              
              {/* Category Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {illustration.collectionNames.map((name) => (
                  <span
                    key={name}
                    className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20"
                  >
                    {name}
                  </span>
                ))}
              </div>

              {/* Title & Archival Context */}
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-serif font-black text-stone-900 dark:text-stone-100 leading-tight">
                  {illustration.title}
                </h3>
                {illustration.itemSets && illustration.itemSets.length > 0 && (
                  <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
                    Series: {illustration.itemSets.join(' · ')}
                  </p>
                )}
              </div>

              {/* Verified Metadata Matrix */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs">
                {illustration.date && (
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-stone-400 uppercase font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                      Historical Date
                    </span>
                    <p className="font-serif font-semibold text-stone-900 dark:text-stone-100">{illustration.date}</p>
                  </div>
                )}
                {illustration.language && (
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-stone-400 uppercase font-bold flex items-center gap-1">
                      <Languages className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                      Language
                    </span>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">{illustration.language}</p>
                  </div>
                )}
                {illustration.spatialCoverage && illustration.spatialCoverage.length > 0 && (
                  <div className="col-span-2 space-y-0.5 pt-1 border-t border-stone-200/60 dark:border-stone-800/60">
                    <span className="text-[10px] font-mono text-stone-400 uppercase font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                      Spatial Coverage
                    </span>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">{illustration.spatialCoverage.join(', ')}</p>
                  </div>
                )}
                {illustration.researchers && illustration.researchers.length > 0 && (
                  <div className="col-span-2 space-y-0.5 pt-1 border-t border-stone-200/60 dark:border-stone-800/60">
                    <span className="text-[10px] font-mono text-stone-400 uppercase font-bold flex items-center gap-1">
                      <User className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                      Principal Researchers &amp; Curators
                    </span>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">{illustration.researchers.join(', ')}</p>
                  </div>
                )}
              </div>

              {/* Bibliographical Source Card */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold text-amber-900 dark:text-amber-400">
                  <Info className="w-3.5 h-3.5" />
                  <span>Primary Bibliographical Record</span>
                </div>
                <p className="text-xs font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed">
                  {illustration.source}
                </p>
              </div>

              {/* Scholarly Citation Generator Hub */}
              <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Cite This Archive Plate
                  </span>

                  {/* Format Selector Pills */}
                  <div className="flex items-center gap-1 bg-stone-200/70 dark:bg-stone-800 p-0.5 rounded-lg text-[10px] font-mono">
                    {(['chicago', 'apa', 'harvard', 'bibtex'] as CitationStyle[]).map(style => (
                      <button
                        key={style}
                        onClick={() => setActiveCitationStyle(style)}
                        className={`px-2 py-0.5 rounded-md uppercase font-bold transition-all cursor-pointer ${
                          activeCitationStyle === style
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Formatted Citation Block */}
                <div className="p-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-[11px] font-mono leading-relaxed text-stone-800 dark:text-stone-300 break-words select-all">
                  {generateCitation(activeCitationStyle)}
                </div>

                {/* Copy Button */}
                <button
                  onClick={copyCitation}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono transition-all shadow-xs cursor-pointer"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied {activeCitationStyle.toUpperCase()} to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy {activeCitationStyle.toUpperCase()} Citation</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* External High-Resolution Download & Repository Links */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row gap-2.5 shrink-0">
              {illustration.externalAssetLinks && illustration.externalAssetLinks[0] && (
                <a
                  href={illustration.externalAssetLinks[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 text-xs font-bold font-sans transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Full-Res TIFF Archive (~40MB)</span>
                </a>
              )}

              {illustration.externalAssetLinks && illustration.externalAssetLinks[1] && (
                <a
                  href={illustration.externalAssetLinks[1].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 text-xs font-bold font-sans transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                  <span>Direct Link</span>
                </a>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
