import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  X, 
  ExternalLink, 
  Moon, 
  Sun, 
  Sliders,
  Layers, 
  Compass, 
  Anchor,
  BookOpen,
  HelpCircle,
  Sparkles,
  Upload,
  Info,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { 
  VBW, 
  VBH, 
  CX, 
  CY, 
  TAST_COHORTS, 
  AFRICALIA_COUNTRY_CONDUITS, 
  CENTRAL_LOBE_NODES,
  AfricaliaCountryConduit,
  CentralClusterNode
} from '../../data/africaliaMasterTreeData';
import { AFRICALIA_REGIONS } from '../../data/africaliaSourceData';

interface AfricaliaExplorerProps {
  onSelectReport?: (reportId: string) => void;
  onNavigateToSlaveTrade?: () => void;
}

export interface SelectedEntityData {
  id: string;
  name: string;
  type: 'ethnic' | 'country' | 'central' | 'cabo-verde' | 'quant';
  country?: string;
  region?: string;
  tastVolumeShare?: number;
  historicalEmbarkation?: string;
  linguisticFamily?: string;
  estimatedDemographicPopulation?: string;
  color?: string;
  count?: string;
  description?: string;
}

export const AfricaliaExplorer: React.FC<AfricaliaExplorerProps> = ({
  onSelectReport,
  onNavigateToSlaveTrade
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera State: translation and zoom
  const [zoom, setZoom] = useState<number>(1);
  const [fitScale, setFitScale] = useState<number>(1);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Uploaded SVG state (if user uploads a custom SVG file)
  const [customSvgMarkup, setCustomSvgMarkup] = useState<string | null>(null);

  // Selection & Inspector state
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntityData | null>(null);
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [activeTastLayer, setActiveTastLayer] = useState<'all' | 'first' | 'second' | 'third'>('all');
  const [focusCardOpen, setFocusCardOpen] = useState<boolean>(true);
  const [methodologyModalOpen, setMethodologyModalOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Drag pan tracking
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number; startX: number; startY: number; moved: boolean }>({
    x: 0, y: 0, startX: 0, startY: 0, moved: false
  });

  // Toggle Theme
  const toggleTheme = useCallback(() => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  }, []);

  // Compute scale and centering so the entire 4427x4427 tree fits perfectly
  const fitView = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth: w, clientHeight: h } = containerRef.current;
    if (!w || !h) return;
    const initialScale = Math.min(w / VBW, h / VBH) * 0.94;
    setFitScale(initialScale);
    setZoom(1);
    setPos({
      x: (w - VBW * initialScale) / 2,
      y: (h - VBH * initialScale) / 2
    });
  }, []);

  // Auto-fit on mount and on resize
  useEffect(() => {
    fitView();
    const handleResize = () => fitView();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitView]);

  // Also run fitView after a tiny delay to ensure container dimensions are calculated
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView();
    }, 60);
    return () => clearTimeout(timer);
  }, [fitView]);

  // Camera Zoom In / Out
  const handleZoomDelta = (delta: number) => {
    setZoom(prev => {
      const next = Math.min(Math.max(prev * delta, 0.2), 6.0);
      return next;
    });
  };

  // Pointer drag panning
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, a, .no-drag')) return;
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startX: pos.x,
      startY: pos.y,
      moved: false
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.hypot(dx, dy) > 4) {
      dragStart.current.moved = true;
    }
    setPos({
      x: dragStart.current.startX + dx,
      y: dragStart.current.startY + dy
    });
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const currentScale = fitScale * zoom;
    const nextZoom = Math.min(Math.max(zoom * zoomFactor, 0.2), 6.0);
    const nextScale = fitScale * nextZoom;

    // Zoom centered toward cursor
    setPos(prev => ({
      x: mouseX - (mouseX - prev.x) * (nextScale / currentScale),
      y: mouseY - (mouseY - prev.y) * (nextScale / currentScale)
    }));
    setZoom(nextZoom);
  };

  // Focus and pan camera onto specific target coordinates
  const panToCoordinates = useCallback((targetX: number, targetY: number, targetZoom = 2.0) => {
    if (!containerRef.current) return;
    const { clientWidth: w, clientHeight: h } = containerRef.current;
    const nextScale = fitScale * targetZoom;
    setZoom(targetZoom);
    setPos({
      x: w / 2 - targetX * nextScale,
      y: h / 2 - targetY * nextScale
    });
  }, [fitScale]);

  // Combined search dataset
  const searchIndex = useMemo(() => {
    const items: { id: string; name: string; type: string; category: string; x: number; y: number; data: SelectedEntityData }[] = [];

    // Add Countries
    for (const c of AFRICALIA_COUNTRY_CONDUITS) {
      items.push({
        id: `country-${c.id}`,
        name: c.name,
        type: 'Sovereign Country',
        category: c.region,
        x: c.trunkEndX,
        y: c.trunkEndY,
        data: {
          id: c.id,
          name: c.name,
          type: 'country',
          region: c.region,
          color: c.color,
          tastVolumeShare: c.tastVolumeShare,
          description: `Sovereign trunk conduit representing documented Atlantic embarkations across ${c.ethnicGroups.length} distinct ethnic lineages.`
        }
      });

      // Add Ethnic Groups
      for (const eg of c.ethnicGroups) {
        items.push({
          id: `ethnic-${c.id}-${eg.name}`,
          name: eg.name,
          type: 'Ethnic Lineage',
          category: `${c.name} · ${c.region}`,
          x: eg.nodeX,
          y: eg.nodeY,
          data: {
            id: `${c.id}-${eg.name}`,
            name: eg.name,
            type: 'ethnic',
            country: c.name,
            region: c.region,
            color: c.color,
            historicalEmbarkation: eg.historicalEmbarkation,
            linguisticFamily: eg.linguisticFamily,
            tastVolumeShare: c.tastVolumeShare,
            description: `Documented demographic lineage originating in ${c.name}, connected to the transatlantic embarkation matrix.`
          }
        });
      }
    }

    // Add Central Nodes
    for (const cn of CENTRAL_LOBE_NODES) {
      items.push({
        id: cn.id,
        name: cn.label,
        type: 'Embarkation Node',
        category: cn.subregion,
        x: cn.x,
        y: cn.y,
        data: {
          id: cn.id,
          name: cn.label,
          type: 'central',
          region: cn.subregion,
          color: cn.fill,
          description: `Quantitative embarkation core node documented in the ${cn.cluster.toUpperCase()} transatlantic cohort.`
        }
      });
    }

    // Cabo Verde
    items.push({
      id: 'cabo-verde',
      name: 'Cabo Verde Island',
      type: 'Oceanic Crucible',
      category: 'Western Africa / Atlantic',
      x: 1380,
      y: 1860,
      data: {
        id: 'cabo-verde',
        name: 'Cabo Verde Island',
        type: 'cabo-verde',
        region: 'Western Africa',
        color: '#a4723a',
        tastVolumeShare: 8.5,
        historicalEmbarkation: 'Ribeira Grande (Cidade Velha), Praia, Ilha de Santiago',
        linguisticFamily: 'Crioulo Caboverdiano (Portuguese lexical base + Senegambian substrate)',
        description: 'First Creole society in human history (1462); primary Atlantic transshipment crucible synthesizing 16 Upper Guinea ethnic lineages.'
      }
    });

    return items;
  }, []);

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return searchIndex.filter(item => 
      item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [searchQuery, searchIndex]);

  // Country select options
  const countryOptions = useMemo(() => {
    const list = AFRICALIA_COUNTRY_CONDUITS.map(c => ({ id: c.name, name: c.name, region: c.region }));
    list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, []);

  // Check if a country or ethnic node is active under current geography filters
  const isConduitActive = useCallback((conduit: AfricaliaCountryConduit) => {
    if (selectedRegion !== 'All' && conduit.region !== selectedRegion) {
      return false;
    }
    if (selectedCountry !== 'All' && conduit.name !== selectedCountry) {
      return false;
    }
    return true;
  }, [selectedRegion, selectedCountry]);

  // Check if a central node is active under current TAST layer
  const isCentralNodeActive = useCallback((node: CentralClusterNode) => {
    if (activeTastLayer === 'all') return true;
    return node.cluster === activeTastLayer;
  }, [activeTastLayer]);

  const totalScale = fitScale * zoom;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-[#f4f1ea] dark:bg-[#121510] text-[#1e241d] dark:text-[#f3f5ef] font-sans select-none"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      id="africalia-explorer-root"
    >
      {/* Top Floating Header Bar matching Screenshot 2 */}
      <header 
        className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 rounded-full border border-black/10 dark:border-white/15 bg-[#fbfaf7]/90 dark:bg-[#181c16]/90 backdrop-blur-md shadow-md flex items-center justify-between gap-4 max-w-[92vw]"
      >
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#486834] text-white grid place-items-center shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left leading-none">
            <div className="flex items-center gap-1.5">
              <strong className="text-xs font-bold text-zinc-900 dark:text-white">Africalia</strong>
              <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Source-Locked Explorer
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:block text-center px-2">
          <h1 className="text-xs lg:text-sm font-serif font-bold text-zinc-900 dark:text-white">
            Ethnic Groups &amp; Atlantic Trade
          </h1>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
            Explore branches, relationships and documented quantitative layers
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Custom SVG File Upload Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".svg,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (event) => {
                const content = event.target?.result as string;
                if (content && content.includes('<svg')) {
                  setCustomSvgMarkup(content);
                }
              };
              reader.readAsText(file);
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 rounded-full text-[10px] font-bold border border-zinc-300 dark:border-zinc-700 hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
            title="Upload custom SVG file"
          >
            <Upload className="w-3 h-3" />
            <span className="hidden sm:inline">Upload SVG</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Methodology Info */}
          <button
            type="button"
            onClick={() => setMethodologyModalOpen(true)}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            title="Scholarly Methodology"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Top Left Search Input */}
      <div className="absolute top-4 left-4 z-30 w-72 sm:w-84 bg-[#fbfaf7]/90 dark:bg-[#181c16]/90 border border-black/10 dark:border-white/15 backdrop-blur-md rounded-2xl shadow-md overflow-hidden">
        <div className="flex items-center gap-2 p-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0 ml-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search ethnic group, country or region..."
            className="w-full h-8 text-xs bg-white/50 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl px-2.5 outline-none focus:border-[#486834] transition-colors text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {searchResults.length > 0 && (
          <div className="max-h-60 overflow-y-auto border-t border-black/10 dark:border-white/10 divide-y divide-black/5 dark:divide-white/5">
            {searchResults.map(result => (
              <button
                key={result.id}
                type="button"
                onClick={() => {
                  setSelectedEntity(result.data);
                  panToCoordinates(result.x, result.y, 2.2);
                  setSearchQuery('');
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="min-w-0 pr-2">
                  <strong className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {result.name}
                  </strong>
                  <span className="block text-[10px] text-zinc-500 truncate">{result.category}</span>
                </div>
                <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-mono font-bold uppercase shrink-0 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {result.type}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Focus Geography Card matching Screenshot 2 */}
      {focusCardOpen ? (
        <div className="absolute top-18 left-4 z-30 w-72 sm:w-84 p-4 rounded-3xl bg-[#fbfaf7]/95 dark:bg-[#181c16]/95 border border-black/10 dark:border-white/15 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
            <div>
              <h2 className="text-xs font-bold text-zinc-900 dark:text-white">Focus geography</h2>
              <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
                Dim unrelated branches and nodes
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFocusCardOpen(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              title="Minimize focus card"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Region</label>
              <select
                value={selectedRegion}
                onChange={e => {
                  setSelectedRegion(e.target.value);
                  setSelectedCountry('All');
                }}
                className="w-full h-8 text-xs bg-white/70 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-2.5 outline-none focus:border-[#486834] transition-colors text-zinc-900 dark:text-zinc-100"
              >
                <option value="All">All Regions (54 Nations)</option>
                <option value="Western Africa">Western Africa</option>
                <option value="Central Africa">Central Africa</option>
                <option value="Southern Africa">Southern Africa</option>
                <option value="Eastern Africa">Eastern Africa</option>
                <option value="Northern Africa">Northern Africa</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Country</label>
              <select
                value={selectedCountry}
                onChange={e => {
                  const val = e.target.value;
                  setSelectedCountry(val);
                  if (val !== 'All') {
                    const c = AFRICALIA_COUNTRY_CONDUITS.find(item => item.name === val);
                    if (c) {
                      panToCoordinates(c.trunkEndX, c.trunkEndY, 1.8);
                      setSelectedEntity({
                        id: c.id,
                        name: c.name,
                        type: 'country',
                        region: c.region,
                        color: c.color,
                        tastVolumeShare: c.tastVolumeShare,
                        description: `Sovereign trunk conduit representing documented Atlantic embarkations across ${c.ethnicGroups.length} distinct ethnic lineages.`
                      });
                    }
                  }
                }}
                className="w-full h-8 text-xs bg-white/70 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-2.5 outline-none focus:border-[#486834] transition-colors text-zinc-900 dark:text-zinc-100"
              >
                <option value="All">All Sovereign Conduits</option>
                {countryOptions
                  .filter(c => selectedRegion === 'All' || c.region === selectedRegion)
                  .map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={fitView}
              className="h-8 rounded-xl text-xs font-semibold border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-700 dark:text-zinc-300 cursor-pointer"
            >
              Reset view
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRegion('All');
                setSelectedCountry('All');
                setSelectedEntity(null);
                fitView();
              }}
              className="h-8 rounded-xl text-xs font-semibold bg-[#486834] text-white hover:bg-[#3d592c] transition-colors cursor-pointer"
            >
              Clear focus
            </button>
          </div>

          <p className="text-[9px] text-zinc-400 dark:text-zinc-500 text-center font-mono">
            Semantic selections highlight SVG items
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setFocusCardOpen(true)}
          className="absolute top-18 left-4 z-30 px-3 py-2 rounded-2xl bg-[#fbfaf7]/90 dark:bg-[#181c16]/90 border border-black/10 dark:border-white/15 backdrop-blur-md shadow-md flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-[#486834]" />
          <span>Focus geography</span>
        </button>
      )}

      {/* Main Full-Screen Pan/Zoom SVG Stage */}
      <div 
        className="absolute inset-0 touch-none origin-top-left pointer-events-auto"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${totalScale})`,
          transformOrigin: '0 0',
          willChange: 'transform'
        }}
      >
        {customSvgMarkup ? (
          /* Render User-Uploaded Custom SVG if present */
          <div 
            className="w-[4427.0043px] h-[4427.0043px] select-none"
            dangerouslySetInnerHTML={{ __html: customSvgMarkup }} 
          />
        ) : (
          /* Render Master Native Sovereign Africalia Vector Tree */
          <svg 
            viewBox={`0 0 ${VBW} ${VBH}`} 
            width={VBW} 
            height={VBH} 
            className="select-none"
            id="africalia-master-native-svg"
          >
            {/* Definitions, Gradients, and Global SVG Styles */}
            <defs>
              <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="focus-drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.4" floodColor="#1e241d" />
              </filter>
            </defs>

            {/* Background Canvas */}
            <rect 
              width={VBW} 
              height={VBH} 
              fill={isDarkMode ? '#121510' : '#f4f1ea'} 
              className="transition-colors duration-300"
            />

            {/* TAST Quantitative Concentric Rings Overlay */}
            <g id="svg-quant-rings" className="transition-opacity duration-300">
              {/* First Cohort: 5,694,581 (West Central Africa) */}
              <circle
                cx={CX}
                cy={CY}
                r={418.57}
                fill="none"
                stroke="#049b4d"
                strokeWidth={activeTastLayer === 'first' ? 5 : 3}
                strokeDasharray="12 12"
                opacity={activeTastLayer === 'all' || activeTastLayer === 'first' ? 0.9 : 0.15}
                className="transition-all duration-300"
              />
              <text
                x={CX}
                y={CY - 425}
                fill="#049b4d"
                fontSize="18"
                fontWeight="800"
                fontFamily="sans-serif"
                textAnchor="middle"
                opacity={activeTastLayer === 'all' || activeTastLayer === 'first' ? 1 : 0.2}
              >
                5,694,581
              </text>

              {/* Second Cohort: 4,802,952 (Bight of Benin, Biafra, Gold Coast) */}
              <circle
                cx={CX}
                cy={CY}
                r={627.85}
                fill="none"
                stroke="#e06ba1"
                strokeWidth={activeTastLayer === 'second' ? 5.5 : 3.5}
                strokeDasharray="12 12"
                opacity={activeTastLayer === 'all' || activeTastLayer === 'second' ? 0.9 : 0.15}
                className="transition-all duration-300"
              />
              <text
                x={CX}
                y={CY - 635}
                fill="#e06ba1"
                fontSize="18"
                fontWeight="800"
                fontFamily="sans-serif"
                textAnchor="middle"
                opacity={activeTastLayer === 'all' || activeTastLayer === 'second' ? 1 : 0.2}
              >
                4,802,952
              </text>

              {/* Third Cohort: 2,023,821 (Southeast Africa, Senegambia, Windward) */}
              <circle
                cx={CX}
                cy={CY}
                r={837.14}
                fill="none"
                stroke="#a4723a"
                strokeWidth={activeTastLayer === 'third' ? 5.5 : 3.5}
                strokeDasharray="12 12"
                opacity={activeTastLayer === 'all' || activeTastLayer === 'third' ? 0.9 : 0.15}
                className="transition-all duration-300"
              />
              <text
                x={CX}
                y={CY - 845}
                fill="#a4723a"
                fontSize="18"
                fontWeight="800"
                fontFamily="sans-serif"
                textAnchor="middle"
                opacity={activeTastLayer === 'all' || activeTastLayer === 'third' ? 1 : 0.2}
              >
                2,023,821
              </text>
            </g>

            {/* Sovereign Country Conduits, Trunks, Feeders & Terminal Nodes */}
            <g id="svg-conduits">
              {AFRICALIA_COUNTRY_CONDUITS.map(conduit => {
                const isActive = isConduitActive(conduit);
                const isSelected = selectedEntity?.name === conduit.name;
                const strokeWidth = Math.max(3.5, Math.min(11, conduit.tastVolumeShare * 0.42));

                return (
                  <g 
                    key={conduit.id} 
                    id={`conduit-${conduit.id}`}
                    opacity={isActive ? 1 : 0.12}
                    className="transition-opacity duration-300"
                  >
                    {/* Main Curved Trunk */}
                    <path
                      d={`M${conduit.trunkStartX},${conduit.trunkStartY} C${conduit.controlX1},${conduit.controlY1} ${conduit.controlX2},${conduit.controlY2} ${conduit.trunkEndX},${conduit.trunkEndY}`}
                      fill="none"
                      stroke={conduit.color}
                      strokeWidth={isSelected ? strokeWidth + 4 : strokeWidth}
                      strokeLinecap="round"
                      opacity={0.85}
                      filter={isSelected ? 'url(#node-glow)' : undefined}
                      className="cursor-pointer hover:opacity-100 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEntity({
                          id: conduit.id,
                          name: conduit.name,
                          type: 'country',
                          region: conduit.region,
                          color: conduit.color,
                          tastVolumeShare: conduit.tastVolumeShare,
                          description: `Sovereign trunk conduit representing documented Atlantic embarkations across ${conduit.ethnicGroups.length} distinct ethnic lineages.`
                        });
                      }}
                    />

                    {/* Country Root Node */}
                    <circle
                      cx={conduit.trunkEndX}
                      cy={conduit.trunkEndY}
                      r={isSelected ? 12 : 9}
                      fill={conduit.color}
                      stroke={isDarkMode ? '#121510' : '#ffffff'}
                      strokeWidth="2.5"
                      className="cursor-pointer hover:scale-125 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEntity({
                          id: conduit.id,
                          name: conduit.name,
                          type: 'country',
                          region: conduit.region,
                          color: conduit.color,
                          tastVolumeShare: conduit.tastVolumeShare,
                          description: `Sovereign trunk conduit representing documented Atlantic embarkations across ${conduit.ethnicGroups.length} distinct ethnic lineages.`
                        });
                      }}
                    />

                    {/* Country Label */}
                    <text
                      x={conduit.labelX}
                      y={conduit.labelY}
                      fill={conduit.color}
                      fontSize="18"
                      fontWeight="800"
                      fontFamily="sans-serif"
                      letterSpacing="0.06em"
                      textAnchor="middle"
                      className="cursor-pointer select-none font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEntity({
                          id: conduit.id,
                          name: conduit.name,
                          type: 'country',
                          region: conduit.region,
                          color: conduit.color,
                          tastVolumeShare: conduit.tastVolumeShare,
                          description: `Sovereign trunk conduit representing documented Atlantic embarkations across ${conduit.ethnicGroups.length} distinct ethnic lineages.`
                        });
                      }}
                    >
                      {conduit.name.toUpperCase()}
                    </text>

                    {/* Terminal Ethnic Feeder Lines & Circles */}
                    {conduit.ethnicGroups.map((eg, idx) => {
                      const isEthSelected = selectedEntity?.name === eg.name;
                      const isEthHovered = hoveredEntityId === `${conduit.id}-${eg.name}`;
                      const textAnchor = eg.nodeX > CX ? 'start' : 'end';
                      const textOffsetX = eg.nodeX > CX ? eg.r + 6 : -(eg.r + 6);

                      return (
                        <g 
                          key={idx}
                          id={`node-ethnic-${conduit.id}-${idx}`}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredEntityId(`${conduit.id}-${eg.name}`)}
                          onMouseLeave={() => setHoveredEntityId(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEntity({
                              id: `${conduit.id}-${eg.name}`,
                              name: eg.name,
                              type: 'ethnic',
                              country: conduit.name,
                              region: conduit.region,
                              color: conduit.color,
                              historicalEmbarkation: eg.historicalEmbarkation,
                              linguisticFamily: eg.linguisticFamily,
                              tastVolumeShare: conduit.tastVolumeShare,
                              description: `Documented demographic lineage originating in ${conduit.name}, connected to the transatlantic embarkation matrix.`
                            });
                          }}
                        >
                          {/* Feeder line */}
                          <line
                            x1={conduit.trunkEndX}
                            y1={conduit.trunkEndY}
                            x2={eg.nodeX}
                            y2={eg.nodeY}
                            stroke={conduit.color}
                            strokeWidth="1.2"
                            strokeDasharray="4 4"
                            opacity={0.65}
                          />

                          {/* Ethnic Circle */}
                          <circle
                            cx={eg.nodeX}
                            cy={eg.nodeY}
                            r={isEthSelected ? eg.r * 1.3 : isEthHovered ? eg.r * 1.15 : eg.r}
                            fill={conduit.color}
                            stroke={isEthSelected ? '#ffffff' : (isDarkMode ? '#121510' : '#ffffff')}
                            strokeWidth={isEthSelected ? 3 : 1.5}
                            filter={isEthSelected ? 'url(#node-glow)' : undefined}
                            className="transition-all duration-200"
                          />

                          {/* Ethnic Label */}
                          <text
                            x={eg.nodeX + textOffsetX}
                            y={eg.nodeY + 4}
                            fontSize="11.5"
                            fontWeight={isEthSelected ? '800' : '600'}
                            fontFamily="sans-serif"
                            textAnchor={textAnchor}
                            fill={isEthSelected ? conduit.color : (isDarkMode ? '#d8e2d4' : '#2c3e2d')}
                            className="select-none transition-colors duration-150"
                          >
                            {eg.name}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </g>

            {/* Central Lobe Nodes (Hundreds of Brown Circles matching Screenshot 2) */}
            <g id="svg-central-lobes">
              {CENTRAL_LOBE_NODES.map(node => {
                const isActive = isCentralNodeActive(node);
                const isSelected = selectedEntity?.name === node.label;
                const isHovered = hoveredEntityId === node.id;

                return (
                  <g
                    key={node.id}
                    id={node.id}
                    opacity={isActive ? 1 : 0.15}
                    className="cursor-pointer transition-opacity duration-300"
                    onMouseEnter={() => setHoveredEntityId(node.id)}
                    onMouseLeave={() => setHoveredEntityId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEntity({
                        id: node.id,
                        name: node.label,
                        type: 'central',
                        region: node.subregion,
                        color: node.fill,
                        description: `Quantitative embarkation core node documented in the ${node.cluster.toUpperCase()} transatlantic cohort.`
                      });
                    }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? node.r * 1.25 : isHovered ? node.r * 1.12 : node.r}
                      fill={node.fill}
                      stroke={isSelected ? '#ffffff' : (isDarkMode ? '#1a2016' : '#ffffff')}
                      strokeWidth={isSelected ? 2.5 : 1.2}
                      filter={isSelected ? 'url(#node-glow)' : undefined}
                      className="transition-all duration-200"
                    />
                    {node.r >= 13 && (
                      <text
                        x={node.x}
                        y={node.y}
                        fontSize="10"
                        fontWeight="700"
                        fontFamily="sans-serif"
                        fill="#ffffff"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="pointer-events-none select-none"
                      >
                        {node.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Cabo Verde Oceanic Crucible Callout Hub */}
            <g id="svg-cabo-verde" className="cursor-pointer">
              <line
                x1={CX}
                y1={CY}
                x2={1380}
                y2={1860}
                stroke="#a4723a"
                strokeWidth="3.5"
                strokeDasharray="8 8"
                opacity={0.8}
              />
              <circle
                cx={1380}
                cy={1860}
                r={36}
                fill="#a4723a"
                stroke="#ffffff"
                strokeWidth="3"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEntity({
                    id: 'cabo-verde',
                    name: 'Cabo Verde Island',
                    type: 'cabo-verde',
                    region: 'Western Africa',
                    color: '#a4723a',
                    tastVolumeShare: 8.5,
                    historicalEmbarkation: 'Ribeira Grande (Cidade Velha), Praia, Ilha de Santiago',
                    linguisticFamily: 'Crioulo Caboverdiano (Portuguese lexical base + Senegambian substrate)',
                    description: 'First Creole society in human history (1462); primary Atlantic transshipment crucible synthesizing 16 Upper Guinea ethnic lineages.'
                  });
                }}
              />
              <text
                x={1380}
                y={1865}
                fontSize="14"
                fontWeight="800"
                fontFamily="sans-serif"
                fill="#ffffff"
                textAnchor="middle"
                className="select-none pointer-events-none"
              >
                CABO VERDE
              </text>
              <text
                x={1380}
                y={1910}
                fontSize="15"
                fontWeight="800"
                fontFamily="serif"
                fill="#a4723a"
                textAnchor="middle"
                className="select-none"
              >
                Oceanic Crucible &amp; Hub
              </text>
            </g>

            {/* Central Origin Node (Africa Core) */}
            <g id="svg-origin-center">
              <circle
                cx={CX}
                cy={CY}
                r={34}
                fill="#486834"
                stroke="#ffffff"
                strokeWidth="3"
                filter="url(#focus-drop-shadow)"
              />
              <circle
                cx={CX}
                cy={CY}
                r={44}
                fill="none"
                stroke="#486834"
                strokeWidth="2"
                strokeDasharray="6 6"
                opacity={0.7}
              />
              <text
                x={CX}
                y={CY + 5}
                fontSize="15"
                fontWeight="800"
                fontFamily="serif"
                fill="#ffffff"
                textAnchor="middle"
                className="select-none pointer-events-none"
              >
                AFRICA
              </text>
            </g>
          </svg>
        )}
      </div>

      {/* Bottom Left Camera HUD matching Screenshot 2 */}
      <div className="absolute bottom-5 left-5 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-[#fbfaf7]/90 dark:bg-[#181c16]/90 border border-black/10 dark:border-white/15 backdrop-blur-md shadow-md text-xs">
        <button
          type="button"
          onClick={() => handleZoomDelta(0.85)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-colors font-bold cursor-pointer"
          title="Zoom out"
        >
          -
        </button>
        <span className="text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 px-2 min-w-[48px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => handleZoomDelta(1.18)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-colors font-bold cursor-pointer"
          title="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={fitView}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          title="Reset camera to fit"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Right TAST Layers Panel matching Screenshot 2 */}
      <div className="absolute bottom-5 right-5 z-30 flex items-center gap-2 p-2 rounded-2xl bg-[#fbfaf7]/90 dark:bg-[#181c16]/90 border border-black/10 dark:border-white/15 backdrop-blur-md shadow-md text-xs">
        <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-500 dark:text-zinc-400 px-2">
          TAST LAYERS
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTastLayer('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTastLayer === 'all'
                ? 'bg-[#486834] text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>All</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTastLayer('first')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTastLayer === 'first'
                ? 'bg-[#049b4d] text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#049b4d]" />
            <span>First · 5,694,581</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTastLayer('second')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTastLayer === 'second'
                ? 'bg-[#e06ba1] text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#e06ba1]" />
            <span>Second · 4,802,952</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTastLayer('third')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTastLayer === 'third'
                ? 'bg-[#a4723a] text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#a4723a]" />
            <span>Third · 2,023,821</span>
          </button>
        </div>
      </div>

      {/* Right Slide-over Scholarly Dossier Inspector */}
      {selectedEntity && (
        <div 
          className="absolute top-4 right-4 bottom-18 sm:bottom-4 z-40 w-80 sm:w-96 rounded-3xl bg-[#fbfaf7]/95 dark:bg-[#181c16]/95 border border-black/10 dark:border-white/15 backdrop-blur-xl shadow-2xl p-5 overflow-y-auto space-y-4 animate-in fade-in slide-in-from-right-4 duration-200"
          id="scholarly-dossier-inspector"
        >
          <div className="flex items-start justify-between pb-3 border-b border-black/10 dark:border-white/10">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {selectedEntity.type.toUpperCase()} DOSSIER
              </span>
              <h2 className="text-xl font-serif font-black text-zinc-900 dark:text-white mt-1">
                {selectedEntity.name}
              </h2>
              {selectedEntity.country && (
                <p className="text-xs text-zinc-500 font-medium">
                  {selectedEntity.country} {selectedEntity.region ? `· ${selectedEntity.region}` : ''}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedEntity(null)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Demographic Volume & Quantitative Metrics */}
          {selectedEntity.tastVolumeShare !== undefined && (
            <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">TAST Volume Share</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-[#486834] dark:text-[#84a33a]">
                  {selectedEntity.tastVolumeShare}%
                </span>
                <span className="text-[10px] text-zinc-500">of Atlantic embarkations</span>
              </div>
            </div>
          )}

          {/* Historical Embarkation Ports */}
          {selectedEntity.historicalEmbarkation && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono flex items-center gap-1">
                <Anchor className="w-3 h-3 text-[#a4723a]" />
                Documented Ports &amp; Routes
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed bg-black/5 dark:bg-white/5 p-2.5 rounded-xl border border-black/5">
                {selectedEntity.historicalEmbarkation}
              </p>
            </div>
          )}

          {/* Linguistic Family */}
          {selectedEntity.linguisticFamily && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono flex items-center gap-1">
                <Compass className="w-3 h-3 text-emerald-600" />
                Linguistic Classification
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed bg-black/5 dark:bg-white/5 p-2.5 rounded-xl border border-black/5">
                {selectedEntity.linguisticFamily}
              </p>
            </div>
          )}

          {/* Description */}
          {selectedEntity.description && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Scholarly Context</span>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {selectedEntity.description}
              </p>
            </div>
          )}

          {/* Action Links */}
          <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-2">
            {onNavigateToSlaveTrade && (
              <button
                type="button"
                onClick={onNavigateToSlaveTrade}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-[#486834] text-white hover:bg-[#3d592c] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Anchor className="w-3.5 h-3.5" />
                  <span>View in Transatlantic Trade Matrix</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onSelectReport && (
              <button
                type="button"
                onClick={() => onSelectReport('report-genetic-linguistic-blueprints')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Open Genetic-Linguistic Report</span>
                </div>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Methodology & Source-Locked Provenance Modal */}
      {methodologyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl bg-[#fbfaf7] dark:bg-[#181c16] border border-black/10 dark:border-white/15 p-6 md:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#486834] text-white grid place-items-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-serif font-black text-zinc-900 dark:text-white">
                  Africalia Sovereign Cartography Methodology
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMethodologyModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <p>
                <strong>Mathematical Coordinate Space:</strong> The Africalia Sovereign Tree operates in a calibrated 4427.0043 × 4427.0043 vector coordinate space with central polar origin (2214.2903, 2227.8188).
              </p>
              <p>
                <strong>Three TAST Quantitative Cohorts:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 font-mono text-xs">
                <li><strong>First Cohort (r=418.57):</strong> 5,694,581 embarkations — West Central Africa (Luanda, Benguela, Cabinda, Mpinda) and St. Helena.</li>
                <li><strong>Second Cohort (r=627.85):</strong> 4,802,952 embarkations — Bight of Benin (Ouidah, Lagos), Bight of Biafra (Bonny, Calabar), and Gold Coast (Elmina, Cape Coast).</li>
                <li><strong>Third Cohort (r=837.14):</strong> 2,023,821 embarkations — Senegambia (Gorée), Sierra Leone (Bunce Island), Windward Coast, and Southeast Africa (Mozambique).</li>
              </ul>
              <p>
                <strong>The Cabo Verde Oceanic Crucible:</strong> Positioned at (1380, 1860) with a dashed transatlantic hub connector, synthesizing 16 Upper Guinea lineages documented in Cidade Velha and Santiago plantation manifests.
              </p>
            </div>

            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setMethodologyModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#486834] text-white hover:bg-[#3d592c] transition-colors cursor-pointer"
              >
                Close Methodology
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
