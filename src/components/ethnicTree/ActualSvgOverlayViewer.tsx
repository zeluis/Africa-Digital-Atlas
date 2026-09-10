import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Upload, 
  Info, 
  X, 
  ExternalLink, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Crosshair, 
  Maximize2,
  Anchor,
  FileCode,
  Sliders,
  Sparkles
} from 'lucide-react';
import { ETHNIC_NODES, CORE_CLUSTERS, EthnicNode } from '../../data/ethnicTreeData';

interface ActualSvgOverlayViewerProps {
  onSelectReport?: (reportId: string) => void;
  onNavigateToSlaveTrade?: () => void;
}

// Built-in pristine Authentic SVG representation of the Transatlantic Ethnic Tree of Life
// All paths, arcs, clusters, and typography are defined as pure vector geometry.
const DEFAULT_AUTHENTIC_SVG = `
<svg id="authentic-ethnic-tree-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" width="100%" height="100%">
  <defs>
    <radialGradient id="auth-grad-bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="60%" stop-color="#09090b" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>
    <linearGradient id="auth-flow-bight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="auth-flow-westcentral" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="auth-flow-capeverde" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#6D28D9" />
    </linearGradient>
  </defs>

  <!-- Base Grid Rings -->
  <g id="grid-rings" stroke="#27272a" stroke-width="1.2" stroke-dasharray="4 8" fill="none">
    <circle cx="1000" cy="1000" r="280" opacity="0.3" />
    <circle cx="1000" cy="1000" r="460" opacity="0.35" />
    <circle cx="1000" cy="1000" r="650" opacity="0.4" />
    <circle cx="1000" cy="1000" r="880" opacity="0.5" />
  </g>

  <!-- Historical Embarkation Flow Trunks -->
  <g id="flow-trunks" stroke-linecap="round" fill="none" opacity="0.65">
    <path id="path-west-central" d="M1000,1000 Q1250,950 1480,1180" stroke="url(#auth-flow-westcentral)" stroke-width="6" />
    <path id="path-bight-biafra" d="M1000,1000 Q1180,1200 1340,1420" stroke="url(#auth-flow-bight)" stroke-width="8" />
    <path id="path-bight-benin" d="M1000,1000 Q920,1250 820,1520" stroke="url(#auth-flow-bight)" stroke-width="7" />
    <path id="path-gold-coast" d="M1000,1000 Q780,1180 580,1320" stroke="#EAB308" stroke-width="6" />
    <path id="path-windward-coast" d="M1000,1000 Q700,980 440,1080" stroke="#F97316" stroke-width="5" />
    <path id="path-sierra-leone" d="M1000,1000 Q680,820 420,840" stroke="#EF4444" stroke-width="5" />
    <path id="path-senegambia" d="M1000,1000 Q740,680 520,560" stroke="#EC4899" stroke-width="6" />
    <path id="path-cape-verde" d="M1000,1000 Q880,580 820,410" stroke="url(#auth-flow-capeverde)" stroke-width="6" />
    <path id="path-sudanic-chadic" d="M1000,1000 Q1120,620 1280,480" stroke="#06B6D4" stroke-width="4.5" />
    <path id="path-southeast-africa" d="M1000,1000 Q1350,780 1560,780" stroke="#3B82F6" stroke-width="5" />
  </g>

  <!-- Core Embarkation Regional Clusters -->
  <g id="core-clusters">
    <!-- West Central Africa -->
    <g id="cluster-west-central" data-cluster="west-central" transform="translate(1180, 920)">
      <circle r="72" fill="#065F46" fill-opacity="0.4" stroke="#10B981" stroke-width="3" />
      <text y="-6" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="14">WEST CENTRAL</text>
      <text y="14" text-anchor="middle" fill="#A7F3D0" font-family="monospace" font-size="11">45.0% Volume</text>
    </g>

    <!-- Bight of Benin & Biafra -->
    <g id="cluster-bights" data-cluster="bight-coastal" transform="translate(1080, 1160)">
      <circle r="84" fill="#78350F" fill-opacity="0.4" stroke="#F59E0B" stroke-width="3" />
      <text y="-8" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="14">BIGHTS OF BENIN &amp; BIAFRA</text>
      <text y="12" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="11">32.6% Volume</text>
    </g>

    <!-- Senegambia & Cabo Verde Crucible -->
    <g id="cluster-senegambia" data-cluster="creole-sudanic" transform="translate(820, 780)">
      <circle r="65" fill="#4C1D95" fill-opacity="0.4" stroke="#8B5CF6" stroke-width="3" />
      <text y="-6" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="13">SENEGAMBIA &amp; CREOLE</text>
      <text y="14" text-anchor="middle" fill="#DDD6FE" font-family="monospace" font-size="11">12.4% Volume</text>
    </g>
  </g>

  <!-- Central Transatlantic Hub -->
  <circle id="center-hub" cx="1000" cy="1000" r="32" fill="#18181B" stroke="#F59E0B" stroke-width="3" />
  <circle cx="1000" cy="1000" r="10" fill="#F59E0B" />

  <!-- Peripheral Country Nodes -->
  <g id="country-perimeter-nodes" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="12" font-weight="600">
    <text x="1560" y="1190" fill="#34D399">ANGOLA / CONGO</text>
    <text x="1420" y="1460" fill="#FBBF24">NIGERIA (BIAFRA / BONNY)</text>
    <text x="760" y="1580" fill="#F59E0B">BENIN / DAHOMEY (OUIDAH)</text>
    <text x="460" y="1360" fill="#FACC15">GHANA (ELMINA / CAPE COAST)</text>
    <text x="320" y="1100" fill="#FB923C">LIBERIA &amp; CÔTE D'IVOIRE</text>
    <text x="310" y="850" fill="#F87171">SIERRA LEONE (BUNCE ISLAND)</text>
    <text x="410" y="550" fill="#F472B6">SENEGAMBIA &amp; GUINEA</text>
    <text x="760" y="380" fill="#A78BFA">CABO VERDE ARCHIPELAGO</text>
    <text x="1310" y="460" fill="#38BDF8">CHAD &amp; CENTRAL SAHEL</text>
    <text x="1620" y="790" fill="#60A5FA">MOZAMBIQUE &amp; MADAGASCAR</text>
  </g>
</svg>
`;

export const ActualSvgOverlayViewer: React.FC<ActualSvgOverlayViewerProps> = ({
  onSelectReport,
  onNavigateToSlaveTrade
}) => {
  // SVG Content state (can be default or uploaded by user)
  const [svgMarkup, setSvgMarkup] = useState<string>(DEFAULT_AUTHENTIC_SVG);
  const [isCustomSvgLoaded, setIsCustomSvgLoaded] = useState<boolean>(false);
  const [svgFileName, setSvgFileName] = useState<string>('ethnic_tree_authentic_master.svg');

  // Layer Visibility Controls
  const [showBaseSvg, setShowBaseSvg] = useState<boolean>(true);
  const [showInteractiveOverlay, setShowInteractiveOverlay] = useState<boolean>(true);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [showCrosshairs, setShowCrosshairs] = useState<boolean>(true);
  const [enableElementInspection, setEnableElementInspection] = useState<boolean>(true);

  // Camera Transformation (Hardware Accelerated scale + translate)
  const [scale, setScale] = useState<number>(0.95);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Inspection & Hover State
  const [inspectedElement, setInspectedElement] = useState<{
    id: string;
    tagName: string;
    matchedNode?: EthnicNode;
    attributes: Record<string, string>;
  } | null>(null);

  const [hoverCoordinates, setHoverCoordinates] = useState<{
    screenX: number;
    screenY: number;
    svgX: number;
    svgY: number;
  } | null>(null);

  const [selectedHotspot, setSelectedHotspot] = useState<EthnicNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [pastedSvgText, setPastedSvgText] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);

  // Reset Camera
  const handleResetCamera = useCallback(() => {
    setScale(0.95);
    setPosition({ x: 0, y: 0 });
    setSelectedHotspot(null);
    setInspectedElement(null);
  }, []);

  // Zoom In / Out
  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(prev + delta, 0.4), 5.0));
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.4), 5.0);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const dx = (mouseX - rect.width / 2 - position.x);
      const dy = (mouseY - rect.height / 2 - position.y);

      setPosition({
        x: position.x - dx * (zoomFactor - 1),
        y: position.y - dy * (zoomFactor - 1)
      });
    }

    setScale(newScale);
  };

  // Drag Panning
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    }

    // Update cursor coordinates relative to SVG
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      // Convert screen coords to SVG viewBox 0..2000 coords
      const centerX = rect.width / 2 + position.x;
      const centerY = rect.height / 2 + position.y;
      const svgX = Math.round(1000 + (screenX - centerX) / (scale * (rect.width / 2000)));
      const svgY = Math.round(1000 + (screenY - centerY) / (scale * (rect.height / 2000)));
      setHoverCoordinates({ screenX, screenY, svgX, svgY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Non-destructive SVG Element click inspection
  const handleSvgContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableElementInspection) return;
    const target = e.target as HTMLElement | SVGElement;
    if (!target || target === containerRef.current || target === svgWrapperRef.current) return;

    // Detect closest meaningful SVG element
    const svgEl = target.closest('g, path, circle, rect, text') as SVGElement | null;
    if (svgEl) {
      const id = svgEl.getAttribute('id') || svgEl.getAttribute('data-id') || svgEl.tagName;
      const attributes: Record<string, string> = {};
      for (let i = 0; i < svgEl.attributes.length; i++) {
        const attr = svgEl.attributes[i];
        attributes[attr.name] = attr.value;
      }

      // Check if matches any known ethnic group or cluster
      const textContent = svgEl.textContent || '';
      const matchedNode = ETHNIC_NODES.find(n => 
        (id && id.toLowerCase().includes(n.name.toLowerCase())) || 
        textContent.toLowerCase().includes(n.name.toLowerCase()) ||
        (attributes['data-cluster'] && attributes['data-cluster'] === n.cluster)
      );

      setInspectedElement({
        id: id || 'unnamed-element',
        tagName: svgEl.tagName,
        matchedNode,
        attributes
      });
    }
  };

  // Custom SVG File Upload handler
  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') {
      alert('Please upload a valid .svg vector file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && content.includes('<svg')) {
        setSvgMarkup(content);
        setIsCustomSvgLoaded(true);
        setSvgFileName(file.name);
        setIsUploadModalOpen(false);
        handleResetCamera();
      } else {
        alert('The uploaded file does not contain valid SVG markup.');
      }
    };
    reader.readAsText(file);
  };

  // Filtered search results
  const searchResults = searchQuery.trim()
    ? ETHNIC_NODES.filter(n => 
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.country.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  // Key Hotspots overlaid on the SVG coordinates (Non-destructive overlay layer)
  const representativeHotspots = [
    { id: 'yoruba', node: ETHNIC_NODES.find(n => n.name === 'Yoruba') || ETHNIC_NODES[0], x: 1340, y: 1420 },
    { id: 'akan', node: ETHNIC_NODES.find(n => n.name === 'Akan (Ashanti/Fante)') || ETHNIC_NODES[2], x: 580, y: 1320 },
    { id: 'bakongo', node: ETHNIC_NODES.find(n => n.name === 'Bakongo') || ETHNIC_NODES[1], x: 1480, y: 1180 },
    { id: 'wolof', node: ETHNIC_NODES.find(n => n.name === 'Wolof') || ETHNIC_NODES[4], x: 520, y: 560 },
    { id: 'cape-verde-creole', node: ETHNIC_NODES.find(n => n.country === 'Cabo Verde') || ETHNIC_NODES[3], x: 820, y: 410 },
    { id: 'fon', node: ETHNIC_NODES.find(n => n.name === 'Fon / Dahomey') || ETHNIC_NODES[5], x: 820, y: 1520 }
  ];

  return (
    <div className="relative w-full h-full bg-zinc-950 text-zinc-100 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col select-none">
      
      {/* Top HUD: Status Bar & Layer Switches */}
      <div className="absolute top-4 inset-x-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Badge: Actual SVG Status */}
        <div className="flex items-center gap-2 pointer-events-auto bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-100">
                {isCustomSvgLoaded ? 'Custom SVG Loaded' : 'Actual Vector SVG Asset'}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                Unmodified Geometry
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[200px]">
              {svgFileName}
            </span>
          </div>
        </div>

        {/* Center: Search & Hotspot Jumper */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative">
            <div className="flex items-center gap-2 bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 backdrop-blur-xl px-3 py-1.5 rounded-2xl shadow-xl">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search lineage on SVG..."
                className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder-zinc-500 w-36 sm:w-48"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-500 hover:text-zinc-300 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            {searchQuery && searchResults.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50">
                {searchResults.map(result => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      setSelectedHotspot(result);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-zinc-800 flex items-center justify-between text-zinc-200 hover:text-amber-400"
                  >
                    <span>{result.name}</span>
                    <span className="text-[10px] text-zinc-500">{result.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right HUD: Layer Toggles & Upload Custom SVG */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Layer Controls Dropdown / Pills */}
          <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl px-2 py-1 rounded-2xl shadow-xl">
            <button
              type="button"
              onClick={() => setShowBaseSvg(prev => !prev)}
              title="Toggle Untouched Base SVG Layer"
              className={`px-2.5 py-1 text-[11px] font-medium rounded-xl transition-colors cursor-pointer ${
                showBaseSvg ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              SVG Base
            </button>
            <button
              type="button"
              onClick={() => setShowInteractiveOverlay(prev => !prev)}
              title="Toggle Non-Destructive Interactive Layer"
              className={`px-2.5 py-1 text-[11px] font-medium rounded-xl transition-colors cursor-pointer ${
                showInteractiveOverlay ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Interactive Overlay
            </button>
            <button
              type="button"
              onClick={() => setShowHotspots(prev => !prev)}
              title="Toggle Hotspots & Lineage Pins"
              className={`px-2.5 py-1 text-[11px] font-medium rounded-xl transition-colors cursor-pointer ${
                showHotspots ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Hotspots
            </button>
          </div>

          {/* Upload Custom SVG Button */}
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-2xl bg-amber-500 hover:bg-amber-600 text-black shadow-lg transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Load Custom SVG</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleSvgContainerClick}
        className={`relative flex-1 w-full h-full overflow-hidden ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Hardware-Accelerated Pan/Zoom Camera Wrapper */}
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="pointer-events-auto"
        >
          {/* SVG Frame (2000x2000 viewBox coordinate envelope) */}
          <div 
            ref={svgWrapperRef}
            className="relative w-[1100px] h-[1100px] sm:w-[1300px] sm:h-[1300px] lg:w-[1600px] lg:h-[1600px] shrink-0"
          >
            
            {/* LAYER 1: The Authentic Untouched SVG (Zero Geometry Alteration) */}
            {showBaseSvg && (
              <div 
                className="absolute inset-0 w-full h-full"
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
            )}

            {/* LAYER 2: Non-Destructive Interactive Overlay (Mounted Directly on Top) */}
            {showInteractiveOverlay && (
              <svg 
                viewBox="0 0 2000 2000" 
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
              >
                {/* Hotspot Pins and Demographic Badges */}
                {showHotspots && (
                  <g id="interactive-hotspots-overlay">
                    {representativeHotspots.map(({ id, node, x, y }) => {
                      const isSelected = selectedHotspot?.id === node.id;
                      return (
                        <g
                          key={id}
                          transform={`translate(${x}, ${y})`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHotspot(node);
                          }}
                          className="cursor-pointer pointer-events-auto group"
                        >
                          {/* Pulsing Target Radar */}
                          <circle
                            r="28"
                            fill={node.color}
                            opacity={isSelected ? 0.35 : 0.15}
                            className="animate-ping"
                            style={{ animationDuration: '3s' }}
                          />
                          <circle
                            r="14"
                            fill={node.color}
                            stroke="#FFFFFF"
                            strokeWidth="2.5"
                            className="drop-shadow-lg transition-transform duration-200 group-hover:scale-125"
                          />
                          {/* Pin Label Flag */}
                          <g transform="translate(18, -4)">
                            <rect
                              x="0"
                              y="-12"
                              width={node.name.length * 8 + 36}
                              height="24"
                              rx="8"
                              fill="#18181B"
                              fillOpacity="0.88"
                              stroke={isSelected ? '#F59E0B' : '#3F3F46'}
                              strokeWidth="1.2"
                            />
                            <text
                              x="10"
                              y="3"
                              fill="#F4F4F5"
                              fontSize="11"
                              fontWeight="bold"
                              fontFamily="system-ui, sans-serif"
                            >
                              {node.name}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* Hover Inspector Crosshair Indicator */}
                {showCrosshairs && hoverCoordinates && (
                  <g id="crosshair-indicator" opacity="0.6">
                    <circle 
                      cx={hoverCoordinates.svgX} 
                      cy={hoverCoordinates.svgY} 
                      r="16" 
                      fill="none" 
                      stroke="#F59E0B" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3"
                    />
                  </g>
                )}
              </svg>
            )}

          </div>
        </div>

        {/* Bottom Left: Camera & Coordinate Inspector Floating Pill */}
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 pointer-events-auto bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 backdrop-blur-xl px-3 py-2 rounded-2xl shadow-xl text-[11px] font-mono text-zinc-400">
          <Crosshair className="w-3.5 h-3.5 text-amber-500" />
          <span>Zoom: {Math.round(scale * 100)}%</span>
          {hoverCoordinates && (
            <>
              <span className="text-zinc-600">•</span>
              <span>SVG: ({hoverCoordinates.svgX}, {hoverCoordinates.svgY})</span>
            </>
          )}
        </div>

        {/* Bottom Right: Camera Controls */}
        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 pointer-events-auto bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 backdrop-blur-xl p-1.5 rounded-2xl shadow-xl">
          <button
            type="button"
            onClick={() => handleZoom(0.25)}
            title="Zoom In"
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(-0.25)}
            title="Zoom Out"
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetCamera}
            title="Reset Camera"
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide-over Inspection Drawer for Selected Hotspot or Inspected SVG Element */}
      {(selectedHotspot || inspectedElement) && (
        <div className="absolute top-16 right-4 z-40 w-80 sm:w-96 max-h-[calc(100%-80px)] overflow-y-auto bg-zinc-900/95 border border-zinc-800 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
          
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Crosshair className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                {selectedHotspot ? 'Lineage Hotspot' : 'SVG Element Inspector'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedHotspot(null);
                setInspectedElement(null);
              }}
              className="p-1 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* If a Lineage Node is Selected */}
          {selectedHotspot && (
            <div className="space-y-3">
              <div>
                <h4 className="text-base font-bold text-zinc-100">{selectedHotspot.name}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {selectedHotspot.country} • {selectedHotspot.region}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Demographic Share</span>
                  <span className="font-mono font-bold text-amber-400">{selectedHotspot.percentage}% Volume</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Linguistic Family</span>
                  <span className="font-medium text-zinc-300 truncate block">{selectedHotspot.linguisticFamily}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-800/40 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Historical Context</span>
                {selectedHotspot.tastContext}
              </div>

              <div className="flex items-center gap-2 pt-1">
                {selectedHotspot.wikipediaSlug && (
                  <a
                    href={`https://en.wikipedia.org/wiki/${selectedHotspot.wikipediaSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Wikipedia</span>
                  </a>
                )}
                {onNavigateToSlaveTrade && (
                  <button
                    type="button"
                    onClick={onNavigateToSlaveTrade}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black transition-colors cursor-pointer"
                  >
                    <Anchor className="w-3.5 h-3.5" />
                    <span>Voyages Atlas</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* If an SVG Element was directly clicked */}
          {inspectedElement && !selectedHotspot && (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Element Tag</span>
                <code className="text-xs text-amber-400 font-mono font-bold">&lt;{inspectedElement.tagName}&gt; #{inspectedElement.id}</code>
              </div>

              {inspectedElement.matchedNode ? (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <span className="text-emerald-400 font-bold block mb-1">Matched Demographic Lineage</span>
                  <div className="font-bold text-zinc-100">{inspectedElement.matchedNode.name}</div>
                  <div className="text-zinc-400 text-[11px]">{inspectedElement.matchedNode.tastContext}</div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-zinc-800/50 border border-zinc-800 text-xs text-zinc-400">
                  Direct vector element in the actual SVG. Geometry is rendered untouched; interactions are intercepted via the non-destructive overlay layer.
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">SVG Attributes</span>
                <div className="max-h-32 overflow-y-auto space-y-1 font-mono text-[10px] text-zinc-400 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                  {Object.entries(inspectedElement.attributes).map(([key, val]) => (
                    <div key={key} className="truncate">
                      <span className="text-zinc-500">{key}:</span> <span className="text-zinc-200">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Modal: Upload / Paste Custom SVG */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">Load Your Actual SVG</h3>
                  <p className="text-xs text-zinc-400">Display without changing geometry + overlay interactive layer</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drag & Drop or File Input */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-2 block">
                Option A: Upload .svg File from your device
              </label>
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-zinc-700 hover:border-amber-500/60 rounded-2xl p-6 text-center transition-colors cursor-pointer bg-zinc-950/50"
              >
                <input
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="svg-file-upload-input"
                />
                <label htmlFor="svg-file-upload-input" className="cursor-pointer space-y-2 block">
                  <FileCode className="w-8 h-8 text-amber-500 mx-auto" />
                  <div className="text-xs font-bold text-zinc-200">
                    Click to browse or drag &amp; drop your .svg file here
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    Any vector graphic (.svg) with viewBox support
                  </div>
                </label>
              </div>
            </div>

            {/* Option B: Paste SVG text */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                Option B: Paste Raw SVG Code
              </label>
              <textarea
                value={pastedSvgText}
                onChange={(e) => setPastedSvgText(e.target.value)}
                placeholder="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 2000'>...</svg>"
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 text-xs font-mono text-zinc-300 placeholder-zinc-600 outline-none focus:border-amber-500/60"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setSvgMarkup(DEFAULT_AUTHENTIC_SVG);
                  setIsCustomSvgLoaded(false);
                  setSvgFileName('ethnic_tree_authentic_master.svg');
                  setIsUploadModalOpen(false);
                  handleResetCamera();
                }}
                className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                Reset to Default SVG
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!pastedSvgText.trim().includes('<svg')}
                  onClick={() => {
                    if (pastedSvgText.trim().includes('<svg')) {
                      setSvgMarkup(pastedSvgText.trim());
                      setIsCustomSvgLoaded(true);
                      setSvgFileName('pasted_custom_tree.svg');
                      setIsUploadModalOpen(false);
                      handleResetCamera();
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Apply &amp; Mount Overlay
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
