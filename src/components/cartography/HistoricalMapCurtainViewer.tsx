import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HistoricalMapPlate, 
  PreColonialEntity, 
  PRE_COLONIAL_ENTITIES 
} from '../../data/archivalCartographyData';
import { 
  SlidersHorizontal, 
  Columns2, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
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
  X
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
  onSelectPreColonialEntity?: (entity: PreColonialEntity) => void;
}

type ComparisonMode = 'curtain' | 'opacity' | 'sideBySide';
type BorderVibrancy = 'vibrant' | 'balanced' | 'subdued' | 'contrast';

export const HistoricalMapCurtainViewer: React.FC<HistoricalMapCurtainViewerProps> = ({
  selectedPlate,
  onSelectPreColonialEntity
}) => {
  const { mapData } = useAfricaFinalMap();

  // Mode & Controls state
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('curtain');
  const [curtainPosition, setCurtainPosition] = useState<number>(50); // percentage (0 - 100)
  const [opacityLevel, setOpacityLevel] = useState<number>(65); // percentage (0 - 100)
  const [borderVibrancy, setBorderVibrancy] = useState<BorderVibrancy>('vibrant');
  const [zoomLevel, setZoomLevel] = useState<number>(1.6);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingPan, setIsDraggingPan] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Overlays state
  const [showPreColonialKingdoms, setShowPreColonialKingdoms] = useState<boolean>(true);
  const [showModernBorders, setShowModernBorders] = useState<boolean>(true);
  const [showGraticules, setShowGraticules] = useState<boolean>(true);
  const [selectedEntity, setSelectedEntity] = useState<PreColonialEntity | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<PreColonialEntity | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingCurtainRef = useRef<boolean>(false);

  // Reset viewport when plate changes to 160% zoom
  useEffect(() => {
    setZoomLevel(1.6);
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
    if (zoomLevel <= 1.1) return;
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

  // Dynamic Country fill function with authentic color palette and optional vibrancy adjustments
  const getCountryFill = useCallback((country: { id: string; unRegion: AfricanRegion; originalColor?: string; name?: string }) => {
    const canonicalColor = getCanonicalCountryColor(country.id);
    const baseColor = canonicalColor || country.originalColor || getRegionTonalPalette(country.unRegion).unBaseColor || '#0a9bc3';

    // If an entity is selected or hovered, highlight encompassed modern countries
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
      // 100% Full Authentic vector color display matching main MAP View
      return hex;
    } else if (borderVibrancy === 'balanced') {
      // 80% color wash
      return `${hex}cc`;
    } else if (borderVibrancy === 'subdued') {
      // 50% color wash
      return `${hex}80`;
    } else if (borderVibrancy === 'contrast') {
      // 100% full original color with crisp boundaries
      return hex;
    }
    return hex;
  }, [borderVibrancy, hoveredEntity, selectedEntity]);

  // Layer opacity mapping: Vibrant/Authentic defaults to 0.9 (90% opacity)
  const getLayerOpacity = useCallback((vibrancy: BorderVibrancy) => {
    switch (vibrancy) {
      case 'vibrant':
        return 0.9; // Full 90% opacity
      case 'balanced':
        return 0.85; // Soft 85% opacity
      case 'subdued':
        return 0.50; // 50% opacity
      case 'contrast':
        return 0.9; // 90% opacity
      default:
        return 0.9;
    }
  }, []);

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#FAF8F5] dark:bg-stone-950 p-4 sm:p-6 overflow-y-auto' : ''}`}>
      {/* Top Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-mono">
          <button
            onClick={() => setComparisonMode('curtain')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              comparisonMode === 'curtain'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Split Curtain</span>
          </button>

          <button
            onClick={() => setComparisonMode('opacity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              comparisonMode === 'opacity'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Alpha Opacity</span>
          </button>

          <button
            onClick={() => setComparisonMode('sideBySide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              comparisonMode === 'sideBySide'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
        </div>

        {/* Dynamic Parameter Sliders & Vibrancy Control */}
        <div className="flex flex-wrap items-center gap-3">
          {comparisonMode === 'curtain' && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-stone-500 dark:text-stone-400 font-semibold">Curtain Position:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={curtainPosition}
                onChange={e => setCurtainPosition(Number(e.target.value))}
                className="w-24 sm:w-32 accent-amber-600 cursor-pointer"
              />
              <span className="w-9 text-right font-bold text-amber-700 dark:text-amber-400">{Math.round(curtainPosition)}%</span>
            </div>
          )}

          {comparisonMode === 'opacity' && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-stone-500 dark:text-stone-400 font-semibold">Antique Opacity:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={opacityLevel}
                onChange={e => setOpacityLevel(Number(e.target.value))}
                className="w-24 sm:w-32 accent-amber-600 cursor-pointer"
              />
              <span className="w-9 text-right font-bold font-mono font-tabular text-amber-700 dark:text-amber-400">{Math.round(opacityLevel)}%</span>
            </div>
          )}

          {/* 2026 Sovereign Borders Vibrancy Selector */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-mono">
            <Palette className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-stone-500 dark:text-stone-400 font-medium hidden sm:inline">2026 Borders:</span>
            <div className="flex items-center gap-1">
              {(['vibrant', 'balanced', 'subdued', 'contrast'] as BorderVibrancy[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setBorderVibrancy(mode)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-all cursor-pointer ${
                    borderVibrancy === mode
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Layer Toggles & Viewport Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreColonialKingdoms(v => !v)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
              showPreColonialKingdoms
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-800 dark:text-purple-300'
                : 'border-stone-200 dark:border-stone-800 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title="Toggle Pre-Colonial Empires & Capitals overlay"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kingdoms</span>
          </button>

          <button
            onClick={() => setShowModernBorders(v => !v)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
              showModernBorders
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                : 'border-stone-200 dark:border-stone-800 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title="Toggle Modern 54 Sovereign Borders overlay"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2026 Borders</span>
          </button>

          {/* Zoom controls with percentage indicator */}
          <div className="flex items-center gap-1.5 border-l border-stone-200 dark:border-stone-800 pl-2">
            <button
              onClick={() => setZoomLevel(z => Math.min(Number((z + 0.1).toFixed(1)), 3.5))}
              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            {/* Live Zoom Percentage Badge */}
            <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[11px] font-mono font-bold text-stone-800 dark:text-stone-200 min-w-[46px] text-center shadow-2xs">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              onClick={() => {
                setZoomLevel(z => {
                  const next = Math.max(Number((z - 0.1).toFixed(1)), 0.6);
                  if (next === 1.6) setPanOffset({ x: 0, y: 0 });
                  return next;
                });
              }}
              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setZoomLevel(1.6);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 cursor-pointer text-[10px] font-mono font-bold"
              title="Reset to 160% Default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen GIS View"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Cartographic Dual Viewport */}
      {comparisonMode === 'sideBySide' ? (
        /* Side-by-Side Mode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[580px] sm:h-[640px]">
          {/* Historical Plate Pane */}
          <div className="relative rounded-3xl overflow-hidden border border-stone-300 dark:border-stone-800 bg-[#F4EFE6] dark:bg-stone-900 flex flex-col shadow-md">
            <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-stone-900/85 text-amber-300 font-mono text-[11px] font-bold backdrop-blur-md border border-amber-500/30">
              {selectedPlate.year} Antique Plate • {selectedPlate.cartographer}
            </div>
            <div className="w-full h-full p-2">
              <AntiquePlateCanvas plate={selectedPlate} className="rounded-2xl" />
            </div>
          </div>

          {/* Contemporary Sovereign Vector Pane */}
          <div className="relative rounded-3xl overflow-hidden border border-stone-300 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 flex flex-col items-center justify-center p-3 shadow-md">
            <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-emerald-950/85 text-emerald-300 font-mono text-[11px] font-bold backdrop-blur-md border border-emerald-500/30">
              2026 Sovereign Boundaries (54 African Nations)
            </div>
            <div className="w-full h-full max-w-[540px] flex items-center justify-center">
              <svg
                viewBox={AFRICA_FINAL_VIEWBOX}
                className="w-full h-full select-none"
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
        /* Split-Curtain & Alpha Opacity Layered Viewport */
        <div
          ref={containerRef}
          onMouseDown={handleMouseDownCanvas}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          className="relative w-full h-[580px] sm:h-[660px] rounded-3xl overflow-hidden border border-stone-300 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 select-none shadow-lg cursor-grab active:cursor-grabbing"
        >
          {/* Zoom and Pan Container */}
          <div
            className="absolute inset-0 transition-transform duration-75 origin-center"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`
            }}
          >
            {/* 1. Underlying Modern 2026 Sovereign Vector Map (Base Layer - Isolated SVG Map) */}
            {showModernBorders && (
              <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                <div className="w-full h-full max-w-[620px] max-h-[620px] flex items-center justify-center">
                  <svg
                    viewBox={AFRICA_FINAL_VIEWBOX}
                    className="w-full h-full select-none pointer-events-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      key={`curtain-vibrancy-${borderVibrancy}`}
                      opacity={0.9}
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
              </div>
            )}

            {/* 2. Historical Antique Map Overlay (Controlled by Curtain or Opacity) */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{
                clipPath:
                  comparisonMode === 'curtain'
                    ? `polygon(0% 0%, ${curtainPosition}% 0%, ${curtainPosition}% 100%, 0% 100%)`
                    : undefined,
                opacity: comparisonMode === 'opacity' ? opacityLevel / 100 : 1
              }}
            >
              <div className="w-full h-full flex items-center justify-center p-2">
                <AntiquePlateCanvas plate={selectedPlate} className="w-full h-full" />
              </div>
            </div>

            {/* 3. Pre-Colonial Empires & Kingdoms Vector Beacons (TOP-LEVEL OVERLAY - ALWAYS ON TOP OF BOTH PANELS) */}
            {showPreColonialKingdoms && (
              <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none z-20">
                <div className="w-full h-full max-w-[620px] max-h-[620px] flex items-center justify-center">
                  <svg
                    viewBox={AFRICA_FINAL_VIEWBOX}
                    className="w-full h-full select-none pointer-events-none"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g id="preColonialKingdomBeaconsTop" transform={AFRICA_FINAL_TRANSFORM} className="pointer-events-auto">
                      {PRE_COLONIAL_ENTITIES.map(entity => {
                        const [x, y] = entity.svgCoordinates;
                        const isSelected = selectedEntity?.id === entity.id;
                        const isHovered = hoveredEntity?.id === entity.id;
                        const cleanName = entity.name.split('(')[0].trim();
                        const textWidth = Math.max(460, cleanName.length * 52 + 180);
                        const isLabelBelow = entity.id === 'ashanti-empire';
                        const labelOffsetY = isLabelBelow ? 175 : -175;

                        return (
                          <g
                            key={`svg-beacon-top-${entity.id}`}
                            transform={`translate(${x}, ${y})`}
                            className="cursor-pointer group"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEntity(entity);
                              if (onSelectPreColonialEntity) onSelectPreColonialEntity(entity);
                            }}
                            onMouseEnter={() => setHoveredEntity(entity)}
                            onMouseLeave={() => setHoveredEntity(null)}
                          >
                            {/* Continuously Radiating Pulsating Radar Wave 1 */}
                            <circle cx="0" cy="0" r="100" fill={entity.color}>
                              <animate
                                attributeName="r"
                                values="90;480"
                                dur="2.6s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values={isSelected || isHovered ? "0.85;0;0" : "0.55;0;0"}
                                dur="2.6s"
                                repeatCount="indefinite"
                              />
                            </circle>

                            {/* Continuously Radiating Pulsating Radar Wave 2 (Shifted Phase) */}
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
                                values={isSelected || isHovered ? "0.85;0;0" : "0.55;0;0"}
                                dur="2.6s"
                                begin="1.3s"
                                repeatCount="indefinite"
                              />
                            </circle>

                            {/* Concentric Pulsating Ring */}
                            <circle
                              cx="0"
                              cy="0"
                              r={isSelected || isHovered ? 170 : 130}
                              fill="none"
                              stroke={entity.color}
                              strokeWidth={isSelected || isHovered ? "20" : "14"}
                              strokeDasharray="28,14"
                              opacity={isSelected || isHovered ? 1 : 0.85}
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

                            {/* Extra-Large High-Contrast Floating Pill Label ALWAYS on TOP of both panels */}
                            <g transform={`translate(0, ${labelOffsetY})`}>
                              {/* Background Aura Pill Glow */}
                              <rect
                                x={-textWidth / 2 - 16}
                                y="-105"
                                width={textWidth + 32}
                                height="200"
                                rx="100"
                                fill={entity.color}
                                opacity={isSelected || isHovered ? '0.65' : '0.3'}
                              />

                              {/* Main Pill Badge */}
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
              </div>
            )}
          </div>

          {/* 4. Split-Curtain Draggable Divider Line (Curtain Mode Only) */}
          {comparisonMode === 'curtain' && (
            <div
              style={{ left: `${curtainPosition}%` }}
              onMouseDown={handleMouseDownCurtain}
              onTouchMove={handleTouchMoveCurtain}
              className="absolute top-0 bottom-0 -translate-x-1/2 w-9 flex items-center justify-center cursor-ew-resize z-30 group"
            >
              {/* Hairline center line */}
              <div className="w-0.5 h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.7)]" />

              {/* Central Tactile Grip Handle */}
              <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-400 border-2 border-amber-500 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <SlidersHorizontal className="w-4 h-4" />
              </div>

              {/* Position Tag Pill */}
              <div className="absolute top-4 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-stone-900/95 text-amber-300 text-[10px] font-mono font-bold font-tabular border border-amber-500/50 shadow-md pointer-events-none">
                {Math.round(curtainPosition)}%
              </div>
            </div>
          )}

          {/* Dynamic Boundary Badges in Corners */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-stone-900/90 backdrop-blur-md text-amber-300 text-[11px] font-mono font-bold border border-amber-600/50 shadow-md">
              Left: {selectedPlate.year} Antique Cartography
            </span>
          </div>

          <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-[11px] font-mono font-bold border border-emerald-600/50 shadow-md">
              Right: 2026 Sovereign Borders ({borderVibrancy})
            </span>
          </div>

          {/* Sleek Floating Kingdoms Tooltip Panel (Aligned to the bottom-left on the Slider Container) */}
          <AnimatePresence>
            {(selectedEntity || hoveredEntity) && (
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-[420px] z-40 p-4 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-stone-200/90 dark:border-stone-800 shadow-2xl text-left space-y-3"
              >
                {/* Header with Color Dot, Title & Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-bold border"
                        style={{
                          backgroundColor: `${(hoveredEntity || selectedEntity)?.color}18`,
                          borderColor: `${(hoveredEntity || selectedEntity)?.color}45`,
                          color: (hoveredEntity || selectedEntity)?.color
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: (hoveredEntity || selectedEntity)?.color }} />
                        <span>{(hoveredEntity || selectedEntity)?.regionBadge}</span>
                      </span>

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        {(hoveredEntity || selectedEntity)?.period}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
                      {(hoveredEntity || selectedEntity)?.name}
                    </h4>
                  </div>

                  {selectedEntity && (
                    <button
                      onClick={() => setSelectedEntity(null)}
                      className="shrink-0 p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
                      title="Close dossier"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Highly Readable Editorial Sans Description */}
                <p className="font-sans text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
                  {(hoveredEntity || selectedEntity)?.significance}
                </p>

                {/* Tight Editorial Micro-Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80 font-sans text-xs">
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                    <span className="text-stone-400 text-[9px] uppercase font-bold block">Historical Capital</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 text-[11px] truncate block">
                      {(hoveredEntity || selectedEntity)?.capital}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                    <span className="text-stone-400 text-[9px] uppercase font-bold block">Trade Specialties</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 text-[11px] truncate block">
                      {(hoveredEntity || selectedEntity)?.tradeSpecialty}
                    </span>
                  </div>

                  <div className="col-span-2 p-2 rounded-xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40">
                    <span className="text-purple-700 dark:text-purple-400 text-[9px] uppercase font-bold block">Modern Sovereign Footprint</span>
                    <span className="font-semibold text-purple-900 dark:text-purple-200 text-[11px] leading-tight block mt-0.5">
                      {(hoveredEntity || selectedEntity)?.modernCountries.join(', ')}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
