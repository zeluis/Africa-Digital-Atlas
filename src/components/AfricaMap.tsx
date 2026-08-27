import React, { useState, useMemo, useRef, useEffect } from 'react';
import { atlas } from '../data/atlas-store';
import { AfricanRegion, AtlasEntity } from '../data/types';
import { 
  AFRICA_SVG_MAP, 
  CountrySvgPath, 
  BACKGROUND_SURROUNDING_PATHS, 
  BACKGROUND_SURROUNDING_CIRCLES 
} from '../data/svgMaps';
import { UN_GEOSCHEME_REGIONS, getUnRegionColor, UnGeoschemeRegionData } from '../data/africaData';
import { InteractiveMapLegend } from './InteractiveMapLegend';
import { CountryFlag } from './CountryFlag';
import { formatValueByUnit, formatPopulation, formatGDP, formatHDI } from '../data/atlas-formatters';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Globe, 
  Compass, 
  MapPin, 
  Download, 
  Maximize2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Info,
  Check,
  Eye,
  Loader2,
  X
} from 'lucide-react';

interface AfricaMapProps {
  onSelectCountry?: (entityId: string) => void;
  onSelectEntity?: (entityId: string) => void;
  selectedEntityId?: string;
  selectedRegionFilter?: AfricanRegion | 'All';
  regionFilter?: AfricanRegion | 'All';
}

export type MapDisplayMode = 'un_geoscheme' | 'choropleth';

export const CHOROPLETH_METRICS = [
  { id: 'SP.POP.TOTL', label: 'Population', unit: 'People (Million)', color: 'emerald' },
  { id: 'NY.GDP.MKTP.CD', label: 'Nominal GDP', unit: 'USD Billion', color: 'cyan' },
  { id: 'NY.GDP.PCAP.CD', label: 'GDP per Capita', unit: 'USD', color: 'indigo' },
  { id: 'UNDP.HDI.INDEX', label: 'Human Development (HDI)', unit: 'Index (0-1)', color: 'teal' },
  { id: 'SP.DYN.LE00.IN', label: 'Life Expectancy', unit: 'Years', color: 'amber' },
  { id: 'EG.ELC.ACCS.ZS', label: 'Electricity Access %', unit: '%', color: 'yellow' },
  { id: 'MO.IIAG.SCORE', label: 'Ibrahim Governance Score', unit: 'Score (0-100)', color: 'purple' },
  { id: 'IEP.GPI.SCORE', label: 'Global Peace Index', unit: 'Score (1-5)', color: 'rose' }
];

const DEFAULT_MAP_ZOOM = 1.0;
const DEFAULT_PAN_OFFSET = { x: 0, y: 0 };

// Focus coordinates & zoom transforms for African subregions
const REGIONAL_ZOOM_PRESETS: Record<AfricanRegion, { zoom: number; x: number; y: number }> = {
  'Northern Africa': { zoom: 1.85, x: 0, y: 170 },
  'Western Africa': { zoom: 2.2, x: 240, y: 60 },
  'Central Africa': { zoom: 2.1, x: 20, y: -70 },
  'Eastern Africa': { zoom: 1.9, x: -200, y: -40 },
  'Southern Africa': { zoom: 2.05, x: -10, y: -290 }
};

export const AfricaMap: React.FC<AfricaMapProps> = ({
  onSelectCountry,
  onSelectEntity,
  selectedEntityId,
  selectedRegionFilter,
  regionFilter
}) => {
  const handleSelectCountry = onSelectCountry || onSelectEntity || (() => {});
  const activeRegionFilter = selectedRegionFilter || regionFilter || 'All';

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [mapMode, setMapMode] = useState<MapDisplayMode>('un_geoscheme');
  const [activeMetric, setActiveMetric] = useState<string>('NY.GDP.MKTP.CD');
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);
  const [activeRegionHover, setActiveRegionHover] = useState<AfricanRegion | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // Region visibility state for interactive legend
  const [visibleRegions, setVisibleRegions] = useState<Set<AfricanRegion>>(
    new Set<AfricanRegion>([
      'Northern Africa',
      'Western Africa',
      'Central Africa',
      'Eastern Africa',
      'Southern Africa'
    ])
  );

  // Zoom & Pan state - scaled to be prominent by default
  const [zoomLevel, setZoomLevel] = useState<number>(DEFAULT_MAP_ZOOM);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>(DEFAULT_PAN_OFFSET);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentMetricDef = useMemo(() => {
    return CHOROPLETH_METRICS.find(m => m.id === activeMetric) || CHOROPLETH_METRICS[0];
  }, [activeMetric]);

  // Compute min, max, and values for choropleth scale
  const { metricValues, minVal, maxVal } = useMemo(() => {
    const values: Record<string, number> = {};
    let min = Infinity;
    let max = -Infinity;

    for (const [id] of Object.entries(AFRICA_SVG_MAP)) {
      let val: number | null = null;
      if (activeMetric === 'NY.GDP.PCAP.CD') {
        const gdp = atlas.getIndicatorValue(id, 'NY.GDP.MKTP.CD');
        const pop = atlas.getIndicatorValue(id, 'SP.POP.TOTL');
        if (gdp && pop) val = Math.round((gdp * 1e9) / (pop * 1e6));
      } else {
        val = atlas.getIndicatorValue(id, activeMetric);
      }

      if (val !== null && !isNaN(val)) {
        values[id] = val;
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }

    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 100;

    return { metricValues: values, minVal: min, maxVal: max };
  }, [activeMetric]);

  // Visibility toggle handlers
  const handleToggleRegion = (region: AfricanRegion) => {
    setVisibleRegions(prev => {
      const next = new Set(prev);
      if (next.has(region)) {
        next.delete(region);
      } else {
        next.add(region);
      }
      return next;
    });
  };

  const handleShowAllRegions = () => {
    setVisibleRegions(
      new Set<AfricanRegion>([
        'Northern Africa',
        'Western Africa',
        'Central Africa',
        'Eastern Africa',
        'Southern Africa'
      ])
    );
  };

  const handleHideAllRegions = () => {
    setVisibleRegions(new Set<AfricanRegion>());
  };

  const handleIsolateRegion = (region: AfricanRegion) => {
    setVisibleRegions(new Set<AfricanRegion>([region]));
    // Also smoothly focus on that region
    const preset = REGIONAL_ZOOM_PRESETS[region];
    if (preset) {
      setZoomLevel(preset.zoom);
      setPanOffset({ x: preset.x, y: preset.y });
    }
  };

  const handleFocusRegion = (region: AfricanRegion) => {
    const preset = REGIONAL_ZOOM_PRESETS[region];
    if (preset) {
      setZoomLevel(preset.zoom);
      setPanOffset({ x: preset.x, y: preset.y });
      if (!visibleRegions.has(region)) {
        handleToggleRegion(region);
      }
    }
  };

  const handleResetZoom = () => {
    setZoomLevel(DEFAULT_MAP_ZOOM);
    setPanOffset(DEFAULT_PAN_OFFSET);
  };

  // Color resolver for each country
  const getCountryFill = (country: CountrySvgPath, isSelected: boolean, isHovered: boolean): string => {
    if (isSelected) {
      return '#10b981'; // Bright neon emerald highlight
    }

    if (mapMode === 'un_geoscheme') {
      const regionData = UN_GEOSCHEME_REGIONS[country.unRegion];
      const baseColor = regionData ? regionData.palette.primary : '#10b981';

      if (activeRegionHover && country.unRegion === activeRegionHover) {
        return regionData?.palette?.light || '#34d399';
      }

      if (isHovered) {
        return regionData ? regionData.palette.light : '#6ee7b7';
      }

      return baseColor;
    }

    // Choropleth Metric Mode
    const val = metricValues[country.id];
    if (val === undefined || isNaN(val)) {
      return '#3f3f46'; // zinc-700
    }

    const norm = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal || 1)));

    if (isHovered) {
      return '#38bdf8';
    }

    switch (currentMetricDef.color) {
      case 'cyan':
        return `rgba(6, 182, 212, ${0.3 + norm * 0.7})`;
      case 'indigo':
        return `rgba(99, 102, 241, ${0.3 + norm * 0.7})`;
      case 'amber':
        return `rgba(245, 158, 11, ${0.3 + norm * 0.7})`;
      case 'yellow':
        return `rgba(234, 179, 8, ${0.3 + norm * 0.7})`;
      case 'purple':
        return `rgba(168, 85, 247, ${0.3 + norm * 0.7})`;
      case 'rose':
        return `rgba(244, 63, 94, ${0.3 + norm * 0.7})`;
      case 'teal':
        return `rgba(20, 184, 166, ${0.3 + norm * 0.7})`;
      default:
        return `rgba(16, 185, 129, ${0.3 + norm * 0.7})`; // emerald
    }
  };

  const [activeTooltipEntityId, setActiveTooltipEntityId] = useState<string | null>(null);
  const [fixedTooltipCoords, setFixedTooltipCoords] = useState<{ x: number; y: number } | null>(null);
  const isInteractingWithTooltipRef = useRef<boolean>(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Target entity for tooltip: either pinned/active or hovered
  const displayEntityId = activeTooltipEntityId || hoveredEntityId;
  const hoveredCountryData = displayEntityId ? AFRICA_SVG_MAP[displayEntityId] : null;
  const hoveredEntity = displayEntityId ? atlas.getEntity(displayEntityId) : null;

  // Clear grace timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Graceful hover handlers allowing pointer interaction with tooltip
  const handleCountryHover = (countryId: string, e?: React.MouseEvent) => {
    // If user is actively inspecting a pinned tooltip, ignore background hover jitter
    if (activeTooltipEntityId || isInteractingWithTooltipRef.current) {
      return;
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredEntityId(countryId);
    if (e && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCursorPos({ x, y });
    }
  };

  const handleCountryLeave = () => {
    if (activeTooltipEntityId || isInteractingWithTooltipRef.current) {
      return;
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // 600ms grace period so user can glide cursor into the tooltip without it dismissing
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isInteractingWithTooltipRef.current && !activeTooltipEntityId) {
        setHoveredEntityId(null);
      }
    }, 600);
  };

  const handleCountryClick = (countryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Clicking a country locks the tooltip at that exact spot so user can inspect / click CTA without losing it
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setFixedTooltipCoords({ x, y });
    }
    setActiveTooltipEntityId(countryId);
    setHoveredEntityId(countryId);
  };

  const handleTooltipMouseEnter = () => {
    isInteractingWithTooltipRef.current = true;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    isInteractingWithTooltipRef.current = false;
    if (activeTooltipEntityId) return; // keep open if pinned
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isInteractingWithTooltipRef.current && !activeTooltipEntityId) {
        setHoveredEntityId(null);
      }
    }, 400);
  };

  const handleDismissTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    isInteractingWithTooltipRef.current = false;
    setActiveTooltipEntityId(null);
    setFixedTooltipCoords(null);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredEntityId(null);
  };

  // Calculate coordinates right adjacent to the pointer with smart screen bounds clamping
  const getTooltipCoords = () => {
    const pos = fixedTooltipCoords || cursorPos;
    if (!containerRef.current) {
      return { left: pos.x + 14, top: pos.y + 14 };
    }
    const rect = containerRef.current.getBoundingClientRect();
    const cWidth = rect.width;
    const cHeight = rect.height;
    const tooltipWidth = 320;
    const tooltipHeight = 310;

    // Horizontal: Place to the right of pointer (+14px). If overflowing right edge, flip to left (-tooltipWidth - 14px)
    let left = pos.x + 14;
    if (left + tooltipWidth > cWidth - 12) {
      left = pos.x - tooltipWidth - 14;
    }
    left = Math.max(12, Math.min(left, cWidth - tooltipWidth - 12));

    // Vertical: Align with pointer with subtle eye-level offset (-24px). Clamp to avoid top/bottom overflow
    let top = pos.y - 24;
    if (top + tooltipHeight > cHeight - 12) {
      top = cHeight - tooltipHeight - 12;
    }
    top = Math.max(12, top);

    return { left, top };
  };

  // Mouse pan handlers for map canvas
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // High-Resolution PNG Export Handler
  const handleDownloadPng = async () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    setIsExporting(true);
    try {
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgEl);

      if (!svgString.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const scaleFactor = 2; // Ultra crisp 2000x2200
        const canvas = document.createElement('canvas');
        canvas.width = 1000 * scaleFactor;
        canvas.height = 1100 * scaleFactor;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Fill dark canvas background
          ctx.fillStyle = '#09090b';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw SVG Image
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          // Watermark / Header Brand
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 24px monospace';
          ctx.fillText('AFRICA DATA ATLAS • UN M49 GEOSCHEME', 40, canvas.height - 40);

          ctx.fillStyle = '#a1a1aa';
          ctx.font = '16px monospace';
          ctx.fillText(`Exported ${new Date().toISOString().split('T')[0]} • 54 Sovereign African Nations`, 40, canvas.height - 18);

          const pngUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `africa_data_atlas_${mapMode}_${new Date().toISOString().split('T')[0]}.png`;
          link.href = pngUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobURL);

          setExportSuccess(true);
          setTimeout(() => setExportSuccess(false), 3000);
        }
        setIsExporting(false);
      };
      image.src = blobURL;
    } catch (err) {
      console.error('Failed to export map PNG', err);
      setIsExporting(false);
    }
  };

  return (
    <div className="relative w-full rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 p-4 md:p-6 shadow-2xl overflow-hidden backdrop-blur-md space-y-4">
      {/* Top Map Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-inner">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base md:text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">
                African Continental Geospatial Map
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400">
                UN M49 GEOSCHEME
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Accurate 54-nation boundary vectors, interactive subregion isolation, and live indicators
            </p>
          </div>
        </div>

        {/* View Mode Toggle, Metrics & PNG Export Action */}
        <div className="flex flex-wrap items-center gap-2">
          {/* UN Geoscheme vs Choropleth Toggle */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setMapMode('un_geoscheme')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                mapMode === 'un_geoscheme'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> UN Geoscheme
            </button>
            <button
              onClick={() => setMapMode('choropleth')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                mapMode === 'choropleth'
                  ? 'bg-cyan-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Choropleth
            </button>
          </div>

          {/* Choropleth Metric Selector */}
          {mapMode === 'choropleth' && (
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl overflow-x-auto max-w-full">
              {CHOROPLETH_METRICS.slice(0, 4).map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveMetric(m.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeMetric === m.id
                      ? 'bg-cyan-500 text-zinc-950 font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}

          {/* Export High-Res PNG Button */}
          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Download Map as High-Resolution PNG Image (2000x2200px)"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
            ) : exportSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Download className="w-3.5 h-3.5 text-emerald-500" />
            )}
            <span className="hidden sm:inline">
              {isExporting ? 'Exporting...' : exportSuccess ? 'Saved PNG!' : 'Download Map Image'}
            </span>
            <span className="sm:hidden">PNG</span>
          </button>
        </div>
      </div>

      {/* Interactive Legend with Visibility Toggles */}
      <InteractiveMapLegend
        visibleRegions={visibleRegions}
        onToggleRegion={handleToggleRegion}
        onShowAll={handleShowAllRegions}
        onHideAll={handleHideAllRegions}
        onIsolateRegion={handleIsolateRegion}
        activeHoverRegion={activeRegionHover}
        onHoverRegion={setActiveRegionHover}
      />

      {/* Regional Quick-Focus Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold flex items-center gap-1 pr-1">
            <Compass className="w-3 h-3 text-emerald-500" /> Zoom Focus:
          </span>
          {(Object.keys(REGIONAL_ZOOM_PRESETS) as AfricanRegion[]).map(r => (
            <button
              key={r}
              onClick={() => handleFocusRegion(r)}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap"
            >
              {r.replace(' Africa', '')}
            </button>
          ))}
          <button
            onClick={handleResetZoom}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold transition-all cursor-pointer"
          >
            Full Continent
          </button>
        </div>

        <div className="text-[11px] font-mono text-zinc-400">
          Zoom: <span className="text-emerald-500 font-bold">{Math.round(zoomLevel * 100)}%</span>
        </div>
      </div>

      {/* SVG Canvas Map Container */}
      <div
        ref={containerRef}
        onMouseMove={(e) => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }
        }}
        className="relative w-full h-[580px] md:h-[720px] lg:h-[780px] flex items-center justify-center bg-gradient-to-b from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800/80 shadow-inner"
      >
        {/* Subtle Map Radar Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-15 dark:opacity-20 flex items-center justify-center">
          <div className="w-full h-full border border-dashed border-emerald-500/40" />
          <div className="absolute w-full h-[1px] bg-emerald-500/30" />
          <div className="absolute h-full w-[1px] bg-emerald-500/30" />
          <div className="absolute w-[600px] h-[600px] border border-emerald-500/20 rounded-full" />
          <div className="absolute w-[900px] h-[900px] border border-emerald-500/10 rounded-full" />
        </div>

        <svg
          ref={svgRef}
          viewBox="45 50 900 1000"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            <radialGradient id="oceanGlow" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#09090b" stopOpacity="0.85" />
            </radialGradient>
          </defs>

          {/* Continental Ocean Backdrop */}
          <rect x="0" y="0" width="1000" height="1100" fill="url(#oceanGlow)" rx="16" />

          {/* Interactive Zoomable / Pannable Map Layer */}
          <g
            id="africa-map-viewport"
            transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
            style={{
              transformOrigin: '495px 550px',
              transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            {/* Graticule Latitude / Longitude lines */}
            <g opacity="0.18" stroke="#10b981" strokeWidth="0.8" strokeDasharray="6 6">
              <line x1="0" y1="240" x2="1000" y2="240" /> {/* Tropic of Cancer ~23.5° N */}
              <text x="20" y="235" fill="#10b981" fontSize="10" fontFamily="monospace">Tropic of Cancer 23.5°N</text>
              <line x1="0" y1="550" x2="1000" y2="550" /> {/* Equator 0° */}
              <text x="20" y="545" fill="#10b981" fontSize="10" fontFamily="monospace">Equator 0°</text>
              <line x1="0" y1="880" x2="1000" y2="880" /> {/* Tropic of Capricorn ~23.5° S */}
              <text x="20" y="875" fill="#10b981" fontSize="10" fontFamily="monospace">Tropic of Capricorn 23.5°S</text>
              <line x1="300" y1="0" x2="300" y2="1100" />
              <line x1="600" y1="0" x2="600" y2="1100" />
            </g>

            {/* Surrounding Geographic Context (Europe & Middle East in gray) */}
            <g id="surrounding-countries-layer" className="opacity-35 dark:opacity-20 pointer-events-none">
              {BACKGROUND_SURROUNDING_PATHS.map((p, idx) => (
                <path
                  key={`surround-bg-${idx}`}
                  d={p.d}
                  fill="#A1A1AA"
                  stroke="#71717A"
                  strokeWidth={0.6}
                  strokeLinejoin="round"
                />
              ))}
              {BACKGROUND_SURROUNDING_CIRCLES.map((c, idx) => (
                <circle
                  key={`surround-circle-${idx}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="#A1A1AA"
                />
              ))}
            </g>

            {/* Accurate Country Vector Paths Layer */}
            <g id="africa-countries-layer">
              {Object.values(AFRICA_SVG_MAP).map(country => {
                const isSelected = selectedEntityId === country.id;
                const isHovered = hoveredEntityId === country.id;
                const isRegionVisible = visibleRegions.has(country.unRegion);
                const isRegionFiltered = activeRegionFilter !== 'All' && country.unRegion !== activeRegionFilter;
                
                const isDimmed = !isRegionVisible || isRegionFiltered;
                const fill = getCountryFill(country, isSelected, isHovered);

                return (
                  <g 
                    key={country.id}
                    style={{
                      opacity: isDimmed ? 0.08 : 1,
                      transition: 'opacity 0.25s ease, fill 0.2s ease'
                    }}
                    className={isDimmed ? 'pointer-events-none' : ''}
                  >
                    {/* Main Continental Landmass */}
                    <path
                      id={`country-path-${country.id}`}
                      d={country.path}
                      fill={fill}
                      stroke={isSelected ? '#10b981' : isHovered ? '#ffffff' : '#27272a'}
                      strokeWidth={isSelected ? 3.5 : isHovered ? 2.2 : 1.2}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="cursor-pointer"
                      onMouseEnter={(e) => handleCountryHover(country.id, e)}
                      onMouseLeave={handleCountryLeave}
                      onClick={(e) => handleCountryClick(country.id, e)}
                    >
                      <title>{`${country.name} (${country.id}) - ${country.unRegion}`}</title>
                    </path>

                    {/* Islands / Archipelagos */}
                    {country.islands && country.islands.map((islandD, idx) => (
                      <path
                        key={`island-${country.id}-${idx}`}
                        d={islandD}
                        fill={fill}
                        stroke={isSelected ? '#10b981' : isHovered ? '#ffffff' : '#27272a'}
                        strokeWidth={isSelected ? 3 : 1.2}
                        strokeLinejoin="round"
                        className="cursor-pointer"
                        onMouseEnter={(e) => handleCountryHover(country.id, e)}
                        onMouseLeave={handleCountryLeave}
                        onClick={(e) => handleCountryClick(country.id, e)}
                      />
                    ))}

                    {/* Generous Target Hit Area for Small Island States & Archipelagos */}
                    {['CPV', 'STP', 'SYC', 'MUS', 'COM'].includes(country.id) && (
                      <circle
                        cx={country.centroid.x}
                        cy={country.centroid.y}
                        r={country.id === 'CPV' ? 38 : 28}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={(e) => handleCountryHover(country.id, e)}
                        onMouseLeave={handleCountryLeave}
                        onClick={(e) => handleCountryClick(country.id, e)}
                      />
                    )}

                    {/* Dedicated Cabo Verde / CV Oceanic Locator Beacon & Target Area Ring */}
                    {country.id === 'CPV' && (
                      <g 
                        transform={`translate(${country.centroid.x}, ${country.centroid.y})`}
                        className="cursor-pointer"
                        onMouseEnter={(e) => handleCountryHover('CPV', e)}
                        onMouseLeave={handleCountryLeave}
                        onClick={(e) => handleCountryClick('CPV', e)}
                      >
                        {/* Animated radar ripple on hover / selection */}
                        {(isSelected || isHovered) && (
                          <circle r="36" fill="#10b981" opacity="0.2" className="animate-ping pointer-events-none" />
                        )}
                        <circle
                          r="32"
                          fill="transparent"
                          stroke={isSelected ? '#10b981' : isHovered ? '#38bdf8' : 'rgba(56, 189, 248, 0.45)'}
                          strokeWidth={isSelected ? 2.2 : 1.2}
                          strokeDasharray="4 3"
                          className="transition-colors"
                        />
                        <rect
                          x="-14"
                          y="-32"
                          width="28"
                          height="15"
                          rx="4"
                          fill={isSelected ? '#10b981' : isHovered ? '#0284c7' : '#09090b'}
                          stroke={isSelected ? '#ffffff' : isHovered ? '#38bdf8' : 'rgba(56, 189, 248, 0.7)'}
                          strokeWidth="1"
                          className="shadow-md"
                        />
                        <text
                          x="0"
                          y="-21.5"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={`text-[9.5px] font-mono font-black tracking-wider pointer-events-none ${
                            isSelected ? 'fill-zinc-950' : isHovered ? 'fill-white' : 'fill-sky-400'
                          }`}
                        >
                          CV
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Capital City Markers & Country Centroid Labels Layer */}
            <g id="africa-labels-layer">
              {Object.values(AFRICA_SVG_MAP).map(country => {
                const isRegionVisible = visibleRegions.has(country.unRegion);
                const isRegionFiltered = activeRegionFilter !== 'All' && country.unRegion !== activeRegionFilter;
                const isDimmed = !isRegionVisible || isRegionFiltered;
                const isSelected = selectedEntityId === country.id;
                const isHovered = hoveredEntityId === country.id;

                if (isDimmed) return null;

                return (
                  <g key={`marker-${country.id}`}>
                    {/* Country ISO2 Centroid Code for major land areas */}
                    {country.id !== 'CPV' && (
                      <text
                        x={country.centroid.x}
                        y={country.centroid.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-[11px] font-mono font-black fill-zinc-950/80 pointer-events-none select-none tracking-wider drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]"
                      >
                        {country.iso2}
                      </text>
                    )}

                    {/* Capital Pin Point Beacon */}
                    {(isSelected || isHovered) && (
                      <g transform={`translate(${country.capital.x}, ${country.capital.y})`} className="pointer-events-none">
                        <circle r="12" fill="#10b981" opacity="0.4" className="animate-ping" />
                        <circle r="4.5" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                        <text
                          x="8"
                          y="3"
                          fill="#ffffff"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                          className="drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                        >
                          ★ {country.capital.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        {/* Floating Zoom & Reset Toolbar */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-2xl shadow-2xl backdrop-blur-md z-10">
          <button
            onClick={() => setZoomLevel(prev => Math.min(3.8, prev + 0.3))}
            className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.3))}
            className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Reset Pan & Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Hover Tooltip Card */}
        {hoveredEntity && hoveredCountryData && (() => {
          const coords = getTooltipCoords();
          return (
            <div
              onMouseEnter={handleTooltipMouseEnter}
              onMouseLeave={handleTooltipMouseLeave}
              className="absolute z-30 w-80 max-w-[calc(100%-24px)] rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white/95 dark:bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-md text-zinc-900 dark:text-zinc-100 animate-in fade-in zoom-in-95 duration-100 space-y-3 pointer-events-auto transition-all"
              style={{
                top: `${coords.top}px`,
                left: `${coords.left}px`
              }}
            >
              <div className="flex items-start gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-2.5">
                <CountryFlag entityId={hoveredEntity.id} size="lg" className="mt-0.5 shadow-md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 truncate">{hoveredEntity.name}</h4>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded">
                        {hoveredEntity.id}
                      </span>
                      <button
                        onClick={handleDismissTooltip}
                        className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Close tooltip"
                        aria-label="Close tooltip"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    <span 
                      className="w-2 h-2 rounded-full inline-block shrink-0"
                      style={{ background: getUnRegionColor(hoveredCountryData.unRegion) }}
                    />
                    <span className="truncate">{hoveredCountryData.unRegion}</span>
                    <span>•</span>
                    <span className="truncate">Cap: {hoveredCountryData.capital.name}</span>
                  </div>
                </div>
              </div>

              {/* Quick Metrics Comparison */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 p-2 rounded-xl">
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Population</span>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatPopulation(atlas.getIndicatorValue(hoveredEntity.id, 'SP.POP.TOTL'))}
                  </div>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 p-2 rounded-xl">
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Nominal GDP</span>
                  <div className="font-mono font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
                    {formatGDP(atlas.getIndicatorValue(hoveredEntity.id, 'NY.GDP.MKTP.CD'))}
                  </div>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 p-2 rounded-xl">
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">GDP per Capita</span>
                  <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    ${Math.round(((atlas.getIndicatorValue(hoveredEntity.id, 'NY.GDP.MKTP.CD') ?? 0) * 1e9) / ((atlas.getIndicatorValue(hoveredEntity.id, 'SP.POP.TOTL') || 1) * 1e6)).toLocaleString()}
                  </div>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 p-2 rounded-xl">
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">HDI Score</span>
                  <div className="font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                    {formatHDI(atlas.getIndicatorValue(hoveredEntity.id, 'UNDP.HDI.INDEX'))}
                  </div>
                </div>
              </div>

              {/* If Choropleth Active, Highlight Specific Indicator */}
              {mapMode === 'choropleth' && (
                <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400 font-medium">{currentMetricDef.label}:</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {metricValues[hoveredEntity.id] !== undefined
                      ? formatValueByUnit(metricValues[hoveredEntity.id], currentMetricDef.unit)
                      : 'Data Pending'}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectCountry(hoveredEntity.id);
                }}
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                Open Full Country Dossier →
              </button>
            </div>
          );
        })()}

        {/* Legend Indicator Gauge (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-1.5">
          {mapMode === 'un_geoscheme' ? (
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>UN M49 5-Region Classification</span>
            </div>
          ) : (
            <div className="space-y-1 font-mono">
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans uppercase font-bold tracking-wider">
                {currentMetricDef.label} Range
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 dark:text-zinc-400">{minVal != null ? minVal.toLocaleString() : '0'}</span>
                <div 
                  className="w-28 h-2 rounded-full border border-zinc-300 dark:border-zinc-700/60"
                  style={{
                    background: currentMetricDef.color === 'cyan'
                      ? 'linear-gradient(to right, rgba(6,182,212,0.3), rgba(6,182,212,1))'
                      : currentMetricDef.color === 'amber'
                      ? 'linear-gradient(to right, rgba(245,158,11,0.3), rgba(245,158,11,1))'
                      : 'linear-gradient(to right, rgba(16,185,129,0.3), rgba(16,185,129,1))'
                  }}
                />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{maxVal != null ? maxVal.toLocaleString() : '100'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
