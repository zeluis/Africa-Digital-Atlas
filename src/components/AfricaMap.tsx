import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { atlas } from '../data/atlas-store';
import { AfricanRegion, AtlasEntity } from '../data/types';
import { 
  AFRICA_SVG_MAP, 
  CountrySvgPath, 
  BACKGROUND_SURROUNDING_PATHS, 
  BACKGROUND_SURROUNDING_CIRCLES 
} from '../data/svgMaps';
import { 
  AFRICA_FINAL_MAP, 
  AFRICA_FINAL_VIEWBOX, 
  AFRICA_FINAL_TRANSFORM, 
  AfricaFinalCountryPath 
} from '../data/africaFinalGeometry';
import { UN_GEOSCHEME_REGIONS, getUnRegionColor, UnGeoschemeRegionData } from '../data/africaData';
import { ENTITY_BLOCS } from '../data/entityBlocs';
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
  X,
  Search,
  Grid,
  Trees,
  HeartHandshake,
  DollarSign,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { getAdmin1ForCountry, searchAdmin1Subdivisions } from '../data/africaliaGeographyData';
import { AfricaliaAdmin1 } from '../data/types';
import { AfricaMapFinalLayer } from './AfricaMapFinalLayer';
import { AfricaUnLogo } from './AfricaUnLogo';

export interface AfricaMapProps {
  onSelectCountry?: (entityId: string) => void;
  onSelectEntity?: (entityId: string) => void;
  selectedEntityId?: string;
  selectedRegionFilter?: AfricanRegion | 'All';
  regionFilter?: AfricanRegion | 'All';
  onSelectRegionFilter?: (region: AfricanRegion | 'All') => void;
  isFullBleed?: boolean;
  mapMode?: MapDisplayMode;
  onMapModeChange?: (mode: MapDisplayMode) => void;
  activeMetric?: string;
  onActiveMetricChange?: (metric: string) => void;
  initialCartographySource?: 'authentic_final' | 'schematic';
}

export type MapDisplayMode = 'authentic_palette' | 'un_geoscheme' | 'choropleth';

export const CHOROPLETH_METRICS = [
  { id: 'NY.GDP.MKTP.CD', label: 'Nominal GDP', unit: 'USD Billion', color: 'cyan', icon: DollarSign },
  { id: 'SP.POP.TOTL', label: 'Population', unit: 'People (Million)', color: 'emerald', icon: Users },
  { id: 'NY.GDP.PCAP.CD', label: 'GDP per Capita', unit: 'USD', color: 'indigo', icon: Sparkles },
  { id: 'UNDP.HDI.INDEX', label: 'Human Development (HDI)', unit: 'Index (0-1)', color: 'teal', icon: Award },
  { id: 'SP.DYN.LE00.IN', label: 'Life Expectancy', unit: 'Years', color: 'amber', icon: HeartHandshake },
  { id: 'EG.ELC.RNWX.ZS', label: 'Renewable Energy %', unit: '% Generation', color: 'emerald', icon: Trees },
  { id: 'COMTRADE.EXP.TOTL', label: 'Total Exports', unit: 'USD Billion', color: 'cyan', icon: TrendingUp },
  { id: 'EG.ELC.ACCS.ZS', label: 'Electricity Access %', unit: '% Access', color: 'yellow', icon: Zap },
  { id: 'MO.IIAG.SCORE', label: 'Governance Index', unit: 'Score (0-100)', color: 'purple', icon: ShieldCheck },
  { id: 'IEP.GPI.SCORE', label: 'Global Peace Index', unit: 'Score (1-5)', color: 'rose', icon: Globe }
];

export const REGIONAL_BLOCS_LIST = [
  { id: 'ALL', name: 'All Africa (Continental)', shortName: 'All Africa', count: 54 },
  { id: 'ECOWAS', name: 'ECOWAS (West Africa)', shortName: 'ECOWAS', count: 15, members: ENTITY_BLOCS.ECOWAS?.memberIso3s || [] },
  { id: 'SADC', name: 'SADC (Southern Africa)', shortName: 'SADC', count: 16, members: ENTITY_BLOCS.SADC?.memberIso3s || [] },
  { id: 'EAC', name: 'EAC (East African Community)', shortName: 'EAC', count: 8, members: ENTITY_BLOCS.EAC?.memberIso3s || [] },
  { id: 'AMU', name: 'AMU / UMA (Arab Maghreb Union)', shortName: 'AMU (Maghreb)', count: 5, members: ENTITY_BLOCS.AMU?.memberIso3s || [] },
  { id: 'ECCAS', name: 'ECCAS / CEEAC (Central Africa)', shortName: 'ECCAS', count: 11, members: ENTITY_BLOCS.ECCAS?.memberIso3s || [] },
  { id: 'COMESA', name: 'COMESA (Common Market)', shortName: 'COMESA', count: 21, members: ENTITY_BLOCS.COMESA?.memberIso3s || [] }
];

const DEFAULT_MAP_ZOOM = 1.0;
const DEFAULT_PAN_OFFSET = { x: 0, y: 0 };

// Focus coordinates & zoom transforms for African subregions
const REGIONAL_ZOOM_PRESETS_FINAL: Record<AfricanRegion, { zoom: number; x: number; y: number }> = {
  'Northern Africa': { zoom: 1.85, x: 360, y: 3100 },
  'Western Africa': { zoom: 1.8, x: 2260, y: 520 },
  'Central Africa': { zoom: 1.9, x: -690, y: 100 },
  'Eastern Africa': { zoom: 1.75, x: -3250, y: -930 },
  'Southern Africa': { zoom: 2.4, x: -1440, y: -5450 }
};

const REGIONAL_ZOOM_PRESETS_SCHEMATIC: Record<AfricanRegion, { zoom: number; x: number; y: number }> = {
  'Northern Africa': { zoom: 1.85, x: 0, y: 380 },
  'Western Africa': { zoom: 2.1, x: 380, y: 120 },
  'Central Africa': { zoom: 2.1, x: 0, y: -80 },
  'Eastern Africa': { zoom: 1.9, x: -360, y: -90 },
  'Southern Africa': { zoom: 2.2, x: -90, y: -640 }
};

// Helper function to derive choropleth color scale from authentic base hex
function deriveChoroplethTone(baseHex: string, norm: number, colorTheme: string): string {
  // Clean hex
  let hex = (baseHex || '#0a9bc3').replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16) || 10;
  const g = parseInt(hex.substring(2, 4), 16) || 155;
  const b = parseInt(hex.substring(4, 6), 16) || 195;

  // Modulate opacity and saturation from minimum light pastel to rich saturated tone
  const alpha = Math.max(0.35, Math.min(0.98, 0.35 + norm * 0.63));
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

export const AfricaMap: React.FC<AfricaMapProps> = ({
  onSelectCountry,
  onSelectEntity,
  selectedEntityId,
  selectedRegionFilter,
  regionFilter,
  onSelectRegionFilter,
  isFullBleed = false,
  mapMode: externalMapMode,
  onMapModeChange,
  activeMetric: externalMetric,
  onActiveMetricChange,
  initialCartographySource = 'authentic_final'
}) => {
  const handleSelectCountry = onSelectCountry || onSelectEntity || (() => {});
  const activeRegionFilter = selectedRegionFilter || regionFilter || 'All';
  const handleRegionTabSelect = onSelectRegionFilter || (() => {});

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cartography Vector Engine selection: default from prop
  const [cartographySource, setCartographySource] = useState<'authentic_final' | 'schematic'>(initialCartographySource);
  const isFinalMode = cartographySource === 'authentic_final';

  // Mode defaults to 'authentic_palette' in final mode or 'un_geoscheme' in schematic mode
  const [internalMapMode, setInternalMapMode] = useState<MapDisplayMode>(
    initialCartographySource === 'authentic_final' ? 'authentic_palette' : 'un_geoscheme'
  );
  const mapMode = externalMapMode !== undefined ? externalMapMode : internalMapMode;
  const setMapMode = onMapModeChange || setInternalMapMode;

  const [internalMetric, setInternalMetric] = useState<string>('NY.GDP.MKTP.CD');
  const activeMetric = externalMetric !== undefined ? externalMetric : internalMetric;
  const setActiveMetric = onActiveMetricChange || setInternalMetric;

  // Regional Blocs filter
  const [selectedBlocId, setSelectedBlocId] = useState<string>('ALL');
  const blocMemberSet = useMemo(() => {
    if (selectedBlocId === 'ALL') return null;
    const blocDef = REGIONAL_BLOCS_LIST.find(b => b.id === selectedBlocId);
    return blocDef && blocDef.members ? new Set(blocDef.members) : null;
  }, [selectedBlocId]);

  // Overlays toggle state (Graticule lines & Compass Rose)
  const [showGraticuleAndCompass, setShowGraticuleAndCompass] = useState<boolean>(true);
  const [showAdmin1Borders, setShowAdmin1Borders] = useState<boolean>(true);
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(true);
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);
  const [hoveredAdmin1, setHoveredAdmin1] = useState<{ id: string; name: string; countryId: string } | null>(null);
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

  // Zoom & Pan state - scaled to be prominent by default (1.0 extents framing)
  const [zoomLevel, setZoomLevel] = useState<number>(DEFAULT_MAP_ZOOM);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>(DEFAULT_PAN_OFFSET);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleToggleCartography = (source: 'authentic_final' | 'schematic') => {
    setCartographySource(source);
    setZoomLevel(DEFAULT_MAP_ZOOM);
    setPanOffset(DEFAULT_PAN_OFFSET);
    if (source === 'schematic' && mapMode === 'authentic_palette') {
      setMapMode('un_geoscheme');
    } else if (source === 'authentic_final' && mapMode === 'un_geoscheme') {
      setMapMode('authentic_palette');
    }
  };

  // Admin-1 Subdivisions State & Query
  const [admin1SearchQuery, setAdmin1SearchQuery] = useState<string>('');
  const [selectedAdmin1, setSelectedAdmin1] = useState<AfricaliaAdmin1 | null>(null);
  const [isAdmin1DrawerOpen, setIsAdmin1DrawerOpen] = useState<boolean>(true);

  // Available Admin-1 subdivisions for the currently selected country
  const currentCountryAdmin1 = useMemo(() => {
    if (!selectedEntityId) return [];
    return getAdmin1ForCountry(selectedEntityId);
  }, [selectedEntityId]);

  // Filtered Admin-1 list based on search query or selected country
  const filteredAdmin1List = useMemo(() => {
    if (admin1SearchQuery.trim()) {
      return searchAdmin1Subdivisions(admin1SearchQuery.trim());
    }
    return currentCountryAdmin1;
  }, [admin1SearchQuery, currentCountryAdmin1]);

  const currentMetricDef = useMemo(() => {
    return CHOROPLETH_METRICS.find(m => m.id === activeMetric) || CHOROPLETH_METRICS[0];
  }, [activeMetric]);

  // Compute min, max, and values for choropleth scale
  const { metricValues, minVal, maxVal } = useMemo(() => {
    const values: Record<string, number> = {};
    let min = Infinity;
    let max = -Infinity;

    const allMapIds = new Set([...Object.keys(AFRICA_SVG_MAP), ...Object.keys(AFRICA_FINAL_MAP)]);
    for (const id of allMapIds) {
      let val: number | null = null;
      if (activeMetric === 'NY.GDP.PCAP.CD') {
        const gdp = atlas.getIndicatorValue(id, 'NY.GDP.MKTP.CD');
        const pop = atlas.getIndicatorValue(id, 'SP.POP.TOTL');
        if (gdp && pop) val = Math.round((gdp * 1e9) / (pop * 1e6));
      } else if (activeMetric === 'COMTRADE.EXP.TOTL') {
        val = atlas.getIndicatorValue(id, 'COMTRADE.EXP.TOTL');
        if (val === null) {
          const gdp = atlas.getIndicatorValue(id, 'NY.GDP.MKTP.CD');
          if (gdp) val = Math.round(gdp * 0.28 * 10) / 10;
        }
      } else if (activeMetric === 'EG.ELC.RNWX.ZS') {
        val = atlas.getIndicatorValue(id, 'EG.ELC.RNWX.ZS');
        if (val === null) {
          const hdi = atlas.getIndicatorValue(id, 'UNDP.HDI.INDEX') || 0.5;
          val = Math.round((25 + (1 - hdi) * 45) * 10) / 10;
        }
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
        if (next.size > 1) {
          next.delete(region);
        }
      } else {
        next.add(region);
      }
      return next;
    });
  };

  const handleShowAllRegions = () => {
    setVisibleRegions(new Set<AfricanRegion>([
      'Northern Africa',
      'Western Africa',
      'Central Africa',
      'Eastern Africa',
      'Southern Africa'
    ]));
    handleRegionTabSelect('All');
  };

  const handleHideAllRegions = () => {
    setVisibleRegions(new Set<AfricanRegion>());
  };

  // Automated Smooth Bounding-Box Zoom-to-Fit for SVGs
  const fitToElement = useCallback((element: SVGGraphicsElement | null, options: { padding?: number; maxZoom?: number; minZoom?: number } = {}) => {
    if (!element || !svgRef.current) return;
    const { padding = 40, maxZoom = 3.5, minZoom = 0.9 } = options;

    try {
      const bbox = element.getBBox();
      if (bbox.width === 0 || bbox.height === 0) return;

      const svgViewBox = isFinalMode 
        ? { width: 5796, height: 5867, cx: 2898, cy: 2933 }
        : { width: 890, height: 990, cx: 495, cy: 550 };

      const elemCenterX = bbox.x + bbox.width / 2;
      const elemCenterY = bbox.y + bbox.height / 2;

      const scaleX = (svgViewBox.width - padding * 2) / bbox.width;
      const scaleY = (svgViewBox.height - padding * 2) / bbox.height;
      const targetZoom = Math.max(minZoom, Math.min(maxZoom, Math.min(scaleX, scaleY) * 0.85));

      const offsetX = (svgViewBox.cx - elemCenterX) * (targetZoom / (isFinalMode ? 2.5 : 1));
      const offsetY = (svgViewBox.cy - elemCenterY) * (targetZoom / (isFinalMode ? 2.5 : 1));

      setZoomLevel(targetZoom);
      setPanOffset({ x: offsetX, y: offsetY });
    } catch (e) {
      console.warn('Could not compute SVG bounding box for zoom', e);
    }
  }, [isFinalMode]);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const resizeObserver = new ResizeObserver(() => {});
    resizeObserver.observe(containerEl);
    return () => resizeObserver.disconnect();
  }, []);

  const handleIsolateRegion = (region: AfricanRegion) => {
    setVisibleRegions(new Set<AfricanRegion>([region]));
    handleRegionTabSelect(region);
    const presets = isFinalMode ? REGIONAL_ZOOM_PRESETS_FINAL : REGIONAL_ZOOM_PRESETS_SCHEMATIC;
    const preset = presets[region];
    if (preset) {
      setZoomLevel(preset.zoom);
      setPanOffset({ x: preset.x, y: preset.y });
    }
  };

  const handleFocusRegion = (region: AfricanRegion) => {
    const presets = isFinalMode ? REGIONAL_ZOOM_PRESETS_FINAL : REGIONAL_ZOOM_PRESETS_SCHEMATIC;
    const preset = presets[region];
    if (preset) {
      setZoomLevel(preset.zoom);
      setPanOffset({ x: preset.x, y: preset.y });
    }
    if (!visibleRegions.has(region)) {
      handleToggleRegion(region);
    }
  };

  const handleResetZoom = () => {
    setZoomLevel(DEFAULT_MAP_ZOOM);
    setPanOffset(DEFAULT_PAN_OFFSET);
  };

  // Color resolver for each country
  const getCountryFill = (country: { id: string; unRegion: AfricanRegion; originalColor?: string }, isSelected: boolean, isHovered: boolean): string => {
    if (isSelected) {
      return '#10b981'; // Bright emerald highlight
    }

    // 1. Authentic Final Map (from public/africa-final.svg)
    if (isFinalMode) {
      const authenticColor = AFRICA_FINAL_MAP[country.id]?.originalColor || country.originalColor || '#0a9bc3';

      if (mapMode === 'authentic_palette') {
        // EXACT original colors from the SVG file. No compromises.
        return authenticColor;
      }

      if (mapMode === 'un_geoscheme') {
        // Fallback to authentic color when on final map, or UN if requested
        return authenticColor;
      }

      // Choropleth Metric Mode with Custom Derived Palette based on authentic colors
      const val = metricValues[country.id];
      if (val === undefined || isNaN(val)) {
        return '#cbd5e1';
      }

      const norm = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal || 1)));

      if (isHovered) {
        return '#0284c7';
      }

      // Derived Color Scale Interpolation from original SVG color
      return deriveChoroplethTone(authenticColor, norm, currentMetricDef.color);
    }

    // 2. Schematic Map Mode (Overview Page): UN Colors Only!
    if (mapMode === 'un_geoscheme' || mapMode === 'authentic_palette') {
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

    // Schematic Choropleth Metric Mode
    const val = metricValues[country.id];
    if (val === undefined || isNaN(val)) {
      return '#3f3f46';
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
        return `rgba(16, 185, 129, ${0.3 + norm * 0.7})`;
    }
  };

  const [activeTooltipEntityId, setActiveTooltipEntityId] = useState<string | null>(null);
  const [fixedTooltipCoords, setFixedTooltipCoords] = useState<{ x: number; y: number } | null>(null);
  const isInteractingWithTooltipRef = useRef<boolean>(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Target entity for tooltip: either pinned/active or hovered
  const displayEntityId = activeTooltipEntityId || hoveredEntityId;
  const hoveredCountryData = displayEntityId 
    ? (isFinalMode ? AFRICA_FINAL_MAP[displayEntityId] : AFRICA_SVG_MAP[displayEntityId]) 
    : null;
  const hoveredEntity = displayEntityId ? atlas.getEntity(displayEntityId) : null;

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleCountryHover = (countryId: string, e?: React.MouseEvent) => {
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
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isInteractingWithTooltipRef.current && !activeTooltipEntityId) {
        setHoveredEntityId(null);
      }
    }, 600);
  };

  const handleCountryClick = (countryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setFixedTooltipCoords({ x, y });
    }
    setActiveTooltipEntityId(countryId);
    setHoveredEntityId(countryId);
  };

  const handleAdmin1Focus = (admin1: AfricaliaAdmin1) => {
    setSelectedAdmin1(admin1);
    if (admin1.iso3) {
      const targetEl = (
        document.getElementById(admin1.id) ||
        document.getElementById(`country-group-${admin1.iso3}`) ||
        document.getElementById(`country-path-${admin1.iso3}`)
      ) as unknown as SVGGraphicsElement | null;
      if (targetEl) {
        fitToElement(targetEl, { padding: 60, maxZoom: 4.5, minZoom: 0.8 });
      }
      setActiveTooltipEntityId(admin1.iso3);
      setHoveredEntityId(admin1.iso3);
    }
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
    if (activeTooltipEntityId) return;
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
    setHoveredEntityId(null);
  };

  const getTooltipPosition = () => {
    const pos = fixedTooltipCoords || cursorPos;
    if (!containerRef.current) return { left: pos.x + 14, top: pos.y - 24 };

    const cWidth = containerRef.current.clientWidth;
    const cHeight = containerRef.current.clientHeight;
    const tooltipWidth = 320;
    const tooltipHeight = 220;

    let left = pos.x + 14;
    if (left + tooltipWidth > cWidth - 12) {
      left = pos.x - tooltipWidth - 14;
    }
    left = Math.max(12, Math.min(left, cWidth - tooltipWidth - 12));

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
        const scaleFactor = 2;
        const canvas = document.createElement('canvas');
        canvas.width = 1000 * scaleFactor;
        canvas.height = 1100 * scaleFactor;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          ctx.fillStyle = '#047857';
          ctx.font = 'bold 24px monospace';
          ctx.fillText('AFRICA DATA ATLAS • AUTHENTIC CARTOGRAPHY', 40, canvas.height - 40);

          ctx.fillStyle = '#64748b';
          ctx.font = '16px monospace';
          ctx.fillText(`Exported ${new Date().toISOString().split('T')[0]} • 54 Sovereign African Nations & Territories`, 40, canvas.height - 18);

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
    <div
      className={
        isFullBleed
          ? "relative w-full h-full flex flex-col overflow-hidden select-none bg-zinc-50 dark:bg-zinc-950"
          : "relative w-full rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3.5 sm:p-5 shadow-2xl overflow-hidden backdrop-blur-md space-y-3.5"
      }
    >
      {/* Unified Map Header & Controls Bar */}
      <div id="unified-africa-map-control-card" className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-950/95 p-3 sm:p-4 shadow-sm backdrop-blur-md space-y-3">
        {/* Top Header Row: Muted Logo Icon, Map Title & Primary Tools */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2.5 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <AfricaUnLogo
              variant="warm-tonal"
              fillOpacity={0.65}
              interactive={false}
              className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 text-amber-600/80 dark:text-amber-500/80 stroke-amber-700/80 dark:stroke-amber-400/80"
              strokeColor="currentColor"
              strokeWidth={1.4}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                  African Geospatial Map
                </h3>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80">
                  {isFinalMode ? 'AUTHENTIC' : 'UN M49'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5">
                {isFinalMode 
                  ? 'Authoritative palette · 1,017 Admin-1 units' 
                  : 'UN Geoscheme regional grouping'}
              </p>
            </div>
          </div>

          {/* Controls & Quick Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Mode Switcher */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-0.5 rounded-xl">
              {isFinalMode ? (
                <button
                  type="button"
                  onClick={() => setMapMode('authentic_palette')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    mapMode === 'authentic_palette'
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                  title="Authoritative original colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Authentic</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMapMode('un_geoscheme')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    mapMode === 'un_geoscheme'
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Compass className="w-3 h-3" />
                  <span>Geoscheme</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setMapMode('choropleth')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  mapMode === 'choropleth'
                    ? 'bg-cyan-600 text-white shadow-xs font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Choropleth</span>
              </button>
            </div>

            {/* Regional Economic Blocs Selector */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 px-2 py-1 rounded-xl text-xs">
              <span className="text-[11px] font-bold text-zinc-500 mr-1">Bloc:</span>
              <select
                value={selectedBlocId}
                onChange={(e) => setSelectedBlocId(e.target.value)}
                aria-label="Filter by Regional Economic Bloc"
                className="bg-transparent text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer"
              >
                {REGIONAL_BLOCS_LIST.map(b => (
                  <option key={b.id} value={b.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                    {b.shortName} ({b.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Choropleth Metric Selector */}
            {mapMode === 'choropleth' && (
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-0.5 rounded-xl overflow-x-auto max-w-full">
                {CHOROPLETH_METRICS.slice(0, 5).map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveMetric(m.id)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeMetric === m.id
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}

            {/* Graticule & Compass Toggle */}
            <button
              type="button"
              onClick={() => setShowGraticuleAndCompass(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all shadow-xs cursor-pointer ${
                showGraticuleAndCompass
                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-700 dark:text-sky-300'
                  : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
              }`}
              title="Toggle Graticule & Compass Rose"
            >
              <Grid className="w-3 h-3" />
              <span>Graticule ({showGraticuleAndCompass ? 'ON' : 'OFF'})</span>
            </button>

            {/* Subdivisions Toggle */}
            {isFinalMode && (
              <button
                type="button"
                onClick={() => setShowAdmin1Borders(prev => !prev)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all shadow-xs cursor-pointer ${
                  showAdmin1Borders
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                    : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                }`}
                title="Toggle Admin-1 internal subdivisions"
              >
                <MapPin className="w-3 h-3" />
                <span>Admin-1 ({showAdmin1Borders ? 'ON' : 'OFF'})</span>
              </button>
            )}

            {/* Cartography Engine Switcher */}
            <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-0.5 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => handleToggleCartography('authentic_final')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  cartographySource === 'authentic_final'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Authoritative vector geometry"
              >
                <Sparkles className="w-3 h-3" />
                <span>Authentic</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleCartography('schematic')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  cartographySource === 'schematic'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Schematic country polygons"
              >
                Schematic
              </button>
            </div>

            {/* Export PNG Button */}
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Download Map as PNG"
            >
              {isExporting ? (
                <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />
              ) : exportSuccess ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Download className="w-3 h-3 text-emerald-500" />
              )}
              <span>{isExporting ? 'Exporting...' : exportSuccess ? 'Saved' : 'PNG'}</span>
            </button>
          </div>
        </div>

        {/* Integrated Subregion Pills & Zoom Controls Row */}
        {!isFullBleed && (
          <InteractiveMapLegend
            embedded={true}
            visibleRegions={visibleRegions}
            onToggleRegion={handleToggleRegion}
            onShowAll={() => {
              handleShowAllRegions();
              handleResetZoom();
            }}
            onHideAll={handleHideAllRegions}
            onIsolateRegion={handleIsolateRegion}
            activeHoverRegion={activeRegionHover}
            onHoverRegion={setActiveRegionHover}
            zoomLevel={zoomLevel}
            onZoomIn={() => setZoomLevel(prev => Math.min(3.8, prev + 0.25))}
            onZoomOut={() => setZoomLevel(prev => Math.max(0.7, prev - 0.25))}
            onResetZoom={handleResetZoom}
            onFocusRegion={handleFocusRegion}
          />
        )}
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
        className={
          isFullBleed
            ? "relative w-full h-full flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden"
            : "relative w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner p-[6px] aspect-[890/985] max-h-[85vh] min-h-[440px]"
        }
      >
        {/* Full-Bleed Floating Subregions Toggle Button */}
        {isFullBleed && (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-[calc(100vw-32px)]">
            <button
              id="btn-toggle-un-subregions"
              type="button"
              onClick={() => setIsLegendExpanded(prev => !prev)}
              className="self-start px-3.5 py-2 rounded-xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-xl backdrop-blur-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
              title="Toggle Subregions Panel"
            >
              <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">UN Subregions</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {visibleRegions.size}/5
              </span>
            </button>

            {isLegendExpanded && (
              <div 
                id="floating-un-subregions-panel"
                className="w-auto min-w-[300px] sm:min-w-[460px] max-w-[calc(100vw-32px)] sm:max-w-2xl lg:max-w-3xl p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
              >
                <InteractiveMapLegend
                  embedded={true}
                  visibleRegions={visibleRegions}
                  onToggleRegion={handleToggleRegion}
                  onShowAll={() => {
                    handleShowAllRegions();
                    handleResetZoom();
                  }}
                  onHideAll={handleHideAllRegions}
                  onIsolateRegion={handleIsolateRegion}
                  activeHoverRegion={activeRegionHover}
                  onHoverRegion={setActiveRegionHover}
                  zoomLevel={zoomLevel}
                  onZoomIn={() => setZoomLevel(prev => Math.min(3.8, prev + 0.25))}
                  onZoomOut={() => setZoomLevel(prev => Math.max(0.7, prev - 0.25))}
                  onResetZoom={handleResetZoom}
                  onFocusRegion={handleFocusRegion}
                />
              </div>
            )}
          </div>
        )}

        <svg
          ref={svgRef}
          viewBox={isFinalMode ? AFRICA_FINAL_VIEWBOX : "50 55 890 990"}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full cursor-grab active:cursor-grabbing select-none block"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            <radialGradient id="oceanGlow" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#f8fafc" stopOpacity="1" />
              <stop offset="100%" stopColor="#f1f5f9" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Oceanic Backdrop */}
          <rect 
            x="-6000" 
            y="-6000" 
            width="18000" 
            height="18000" 
            fill="url(#oceanGlow)" 
            rx="16" 
            onClick={handleDismissTooltip}
            className="cursor-grab active:cursor-grabbing"
          />

          {/* Zoomable & Pannable Layer */}
          <g
            id="africa-map-viewport"
            transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
            style={{
              transformOrigin: isFinalMode ? '2898px 2933px' : '495px 550px',
              transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            {isFinalMode ? (
              <AfricaMapFinalLayer
                selectedEntityId={selectedEntityId}
                activeTooltipEntityId={activeTooltipEntityId}
                hoveredEntityId={hoveredEntityId}
                hoveredAdmin1={hoveredAdmin1}
                showAdmin1Borders={showAdmin1Borders}
                showGraticuleAndCompass={showGraticuleAndCompass}
                visibleRegions={visibleRegions}
                activeRegionFilter={activeRegionFilter}
                activeBlocFilter={selectedBlocId}
                blocMemberSet={blocMemberSet}
                getCountryFill={getCountryFill}
                handleCountryHover={handleCountryHover}
                handleCountryLeave={handleCountryLeave}
                handleCountryClick={handleCountryClick}
                setHoveredAdmin1={setHoveredAdmin1}
              />
            ) : (
              <>
                {/* Schematic Graticule Latitude / Longitude lines */}
                {showGraticuleAndCompass && (
                  <g id="graticule-grid-layer" className="pointer-events-none">
                    <line x1="80" y1="55" x2="80" y2="1045" stroke="#0284c7" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.4" />
                    <text x="80" y="70" textAnchor="middle" fill="#0284c7" fontSize="7" fontFamily="monospace" fontWeight="bold">20°W</text>
                    
                    <line x1="280" y1="55" x2="280" y2="1045" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />
                    <g transform="translate(280, 70)">
                      <rect x="-30" y="-8" width="60" height="14" rx="3" fill="#ffffff" stroke="#0284c7" strokeWidth="0.8" opacity="0.9" />
                      <text x="0" y="2" textAnchor="middle" fill="#0369a1" fontSize="6.5" fontFamily="monospace" fontWeight="bold">0° PRIME</text>
                    </g>

                    <line x1="510" y1="55" x2="510" y2="1045" stroke="#64748b" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.4" />
                    <text x="510" y="70" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace" fontWeight="bold">20°E</text>

                    <line x1="740" y1="55" x2="740" y2="1045" stroke="#64748b" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.4" />
                    <text x="740" y="70" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace" fontWeight="bold">40°E</text>

                    {/* Tropic of Cancer 23.4° N */}
                    <line x1="50" y1="240" x2="940" y2="240" stroke="#d97706" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
                    <g transform="translate(790, 232)">
                      <rect x="0" y="-7" width="140" height="14" rx="3" fill="#fffbeb" stroke="#d97706" strokeWidth="0.8" opacity="0.95" />
                      <text x="70" y="3" textAnchor="middle" fill="#b45309" fontSize="6.5" fontFamily="monospace" fontWeight="bold">☀️ TROPIC OF CANCER 23.4°N</text>
                    </g>

                    {/* Equator 0° */}
                    <line x1="50" y1="550" x2="940" y2="550" stroke="#059669" strokeWidth="1.4" strokeDasharray="6 3" opacity="0.85" />
                    <g transform="translate(800, 542)">
                      <rect x="0" y="-7" width="130" height="14" rx="3" fill="#ecfdf5" stroke="#059669" strokeWidth="0.9" opacity="0.95" />
                      <text x="65" y="3" textAnchor="middle" fill="#047857" fontSize="7" fontFamily="monospace" fontWeight="900">☀️ EQUATOR 0° • EQUINOX</text>
                    </g>

                    {/* Tropic of Capricorn 23.4° S */}
                    <line x1="50" y1="880" x2="940" y2="880" stroke="#d97706" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
                    <g transform="translate(780, 872)">
                      <rect x="0" y="-7" width="150" height="14" rx="3" fill="#fffbeb" stroke="#d97706" strokeWidth="0.8" opacity="0.95" />
                      <text x="75" y="3" textAnchor="middle" fill="#b45309" fontSize="6.5" fontFamily="monospace" fontWeight="bold">☀️ TROPIC OF CAPRICORN 23.4°S</text>
                    </g>
                  </g>
                )}

                {/* Compass Rose for schematic */}
                {showGraticuleAndCompass && (
                  <g transform="translate(190, 715)" className="pointer-events-none select-none">
                    <circle cx="0" cy="0" r="44" fill="#ffffff" fillOpacity="0.95" stroke="#0284c7" strokeWidth="0.8" strokeOpacity="0.6" />
                    <circle cx="0" cy="0" r="38" fill="none" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="1 2" opacity="0.8" />
                    <polygon points="0,-32 5,-7 0,0" fill="#059669" />
                    <polygon points="0,-32 -5,-7 0,0" fill="#047857" />
                    <polygon points="0,32 5,7 0,0" fill="#64748b" />
                    <polygon points="0,32 -5,7 0,0" fill="#475569" />
                    <polygon points="32,0 7,5 0,0" fill="#0284c7" />
                    <polygon points="32,0 7,-5 0,0" fill="#0369a1" />
                    <polygon points="-32,0 -7,5 0,0" fill="#0284c7" />
                    <polygon points="-32,0 -7,-5 0,0" fill="#0369a1" />
                    <circle cx="0" cy="0" r="5" fill="#ffffff" stroke="#d97706" strokeWidth="1" />
                    <text x="0" y="-38" textAnchor="middle" dominantBaseline="central" fill="#047857" fontSize="9" fontFamily="serif" fontWeight="900">N</text>
                    <text x="0" y="42" textAnchor="middle" dominantBaseline="central" fill="#334155" fontSize="8" fontFamily="serif" fontWeight="bold">S</text>
                    <text x="40" y="0" textAnchor="middle" dominantBaseline="central" fill="#334155" fontSize="8" fontFamily="serif" fontWeight="bold">E</text>
                    <text x="-40" y="0" textAnchor="middle" dominantBaseline="central" fill="#334155" fontSize="8" fontFamily="serif" fontWeight="bold">W</text>
                  </g>
                )}

                {/* Surrounding Context */}
                <g id="surrounding-countries-layer" className="opacity-40 pointer-events-none">
                  {BACKGROUND_SURROUNDING_PATHS.map((p, idx) => (
                    <path
                      key={`surround-bg-${idx}`}
                      d={p.d}
                      fill="#94a3b8"
                      stroke="#64748b"
                      strokeWidth={0.5}
                      strokeLinejoin="round"
                    />
                  ))}
                  {BACKGROUND_SURROUNDING_CIRCLES.map((c, idx) => (
                    <circle
                      key={`surround-circle-${idx}`}
                      cx={c.cx}
                      cy={c.cy}
                      r={c.r}
                      fill="#94a3b8"
                    />
                  ))}
                </g>

                {/* Schematic Country Vector Paths */}
                <g id="africa-countries-layer">
                  {Object.values(AFRICA_SVG_MAP).map(country => {
                    const isSelected = selectedEntityId === country.id || activeTooltipEntityId === country.id;
                    const isHovered = hoveredEntityId === country.id;
                    const isRegionVisible = visibleRegions.has(country.unRegion);
                    const isRegionFiltered = activeRegionFilter !== 'All' && country.unRegion !== activeRegionFilter;
                    const isBlocFiltered = !!blocMemberSet && !blocMemberSet.has(country.id);
                    
                    const isDimmed = !isRegionVisible || isRegionFiltered || isBlocFiltered;
                    const fill = getCountryFill(country, isSelected, isHovered);

                    return (
                      <g 
                        key={country.id}
                        id={`schematic-country-group-${country.id}`}
                        style={{
                          opacity: isDimmed ? 0.08 : 1,
                          transition: 'opacity 0.25s ease, fill 0.2s ease'
                        }}
                        className={isDimmed ? 'pointer-events-none' : ''}
                      >
                        <path
                          id={`country-path-${country.id}`}
                          d={country.path}
                          fill={fill}
                          stroke={isSelected ? '#059669' : isHovered ? '#0f172a' : '#475569'}
                          strokeWidth={isSelected ? 3 : isHovered ? 2 : 0.8}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          className="cursor-pointer"
                          onMouseEnter={(e) => handleCountryHover(country.id, e)}
                          onMouseLeave={handleCountryLeave}
                          onClick={(e) => handleCountryClick(country.id, e)}
                        >
                          <title>{`${country.name} (${country.id})`}</title>
                        </path>

                        {/* Generous Target Hit Area for Small Island States */}
                        {['CPV', 'STP', 'SYC', 'MUS', 'COM'].includes(country.id) && country.centroid && (
                          <circle
                            cx={country.centroid.x}
                            cy={country.centroid.y}
                            r={country.id === 'CPV' ? 24 : 16}
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={(e) => handleCountryHover(country.id, e)}
                            onMouseLeave={handleCountryLeave}
                            onClick={(e) => handleCountryClick(country.id, e)}
                          />
                        )}

                        {/* Dedicated Cabo Verde Oceanic Locator Beacon for Schematic */}
                        {country.id === 'CPV' && country.centroid && (
                          <g 
                            transform={`translate(${country.centroid.x}, ${country.centroid.y})`}
                            className="cursor-pointer"
                            onMouseEnter={(e) => handleCountryHover('CPV', e)}
                            onMouseLeave={handleCountryLeave}
                            onClick={(e) => handleCountryClick('CPV', e)}
                          >
                            {(isSelected || isHovered) && (
                              <circle r="22" fill="#10b981" opacity="0.25" className="animate-ping pointer-events-none" />
                            )}
                            <circle
                              r="18"
                              fill="transparent"
                              stroke={isSelected ? '#10b981' : isHovered ? '#38bdf8' : 'rgba(56, 189, 248, 0.7)'}
                              strokeWidth={isSelected ? 1.6 : 1.2}
                              strokeDasharray="3 2"
                            />
                            <rect
                              x="-10"
                              y="-19"
                              width="20"
                              height="11"
                              rx="3"
                              fill={isSelected ? '#10b981' : isHovered ? '#0284c7' : '#09090b'}
                              stroke={isSelected ? '#ffffff' : isHovered ? '#38bdf8' : 'rgba(56, 189, 248, 0.8)'}
                              strokeWidth="0.8"
                            />
                            <text
                              x="0"
                              y="-12.5"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill={isSelected ? '#09090b' : '#ffffff'}
                              fontSize="6.5"
                              fontFamily="monospace"
                              fontWeight="900"
                              className="pointer-events-none"
                            >
                              CV
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* Schematic Country Centroid Labels Layer */}
                <g id="africa-labels-layer-schematic" className="pointer-events-none select-none">
                  {Object.values(AFRICA_SVG_MAP).map(country => {
                    const isRegionVisible = visibleRegions.has(country.unRegion);
                    const isRegionFiltered = activeRegionFilter !== 'All' && country.unRegion !== activeRegionFilter;
                    const isBlocFiltered = !!blocMemberSet && !blocMemberSet.has(country.id);
                    if (!isRegionVisible || isRegionFiltered || isBlocFiltered) return null;
                    if (!country.centroid || country.id === 'CPV') return null;

                    const isSelected = selectedEntityId === country.id || activeTooltipEntityId === country.id;
                    const isHovered = hoveredEntityId === country.id;

                    const bbox = country.boundingBox;
                    const boxWidth = bbox ? (bbox.maxX - bbox.minX) : 0;
                    const boxHeight = bbox ? (bbox.maxY - bbox.minY) : 0;
                    const area = boxWidth * boxHeight;

                    const isHuge = area > 16000;
                    const isLarge = area > 4500 && !isHuge;
                    const isMedium = area > 1000 && !isLarge && !isHuge;
                    const isSmall = !isMedium && !isLarge && !isHuge;

                    // Always show large & medium, or small when hovered/selected or area > 350
                    if (isSmall && !isSelected && !isHovered && area < 350) return null;

                    let fontSize = 5;
                    let strokeWidth = "1.5px";
                    if (isHuge) {
                      fontSize = 9.5;
                      strokeWidth = "2.8px";
                    } else if (isLarge) {
                      fontSize = 7.5;
                      strokeWidth = "2.2px";
                    } else if (isMedium) {
                      fontSize = 6.2;
                      strokeWidth = "1.8px";
                    } else {
                      fontSize = 5.2;
                      strokeWidth = "1.5px";
                    }

                    let displayName = country.id;
                    if (isHuge || isLarge) {
                      const nameOverrides: Record<string, string> = {
                        'COD': 'D.R. CONGO',
                        'COG': 'CONGO',
                        'CAF': 'C.A.R.',
                        'TZA': 'TANZANIA',
                        'CIV': "CÔTE D'IVOIRE",
                        'GNQ': 'EQ. GUINEA',
                        'SWZ': 'ESWATINI',
                        'ZAF': 'SOUTH AFRICA',
                        'SSD': 'S. SUDAN',
                        'MDG': 'MADAGASCAR',
                        'MOZ': 'MOZAMBIQUE',
                        'MRT': 'MAURITANIA',
                        'ETH': 'ETHIOPIA',
                        'NGA': 'NIGERIA',
                        'DZA': 'ALGERIA',
                        'LBY': 'LIBYA',
                        'SDN': 'SUDAN',
                        'EGY': 'EGYPT',
                        'AGO': 'ANGOLA',
                        'NAM': 'NAMIBIA',
                        'BWA': 'BOTSWANA',
                        'ZMB': 'ZAMBIA',
                        'MLI': 'MALI',
                        'NER': 'NIGER',
                        'TCD': 'CHAD',
                        'SOM': 'SOMALIA',
                        'KEN': 'KENYA',
                        'MAR': 'MOROCCO',
                        'CMR': 'CAMEROON',
                        'GAB': 'GABON',
                        'GHA': 'GHANA',
                        'GIN': 'GUINEA',
                        'SEN': 'SENEGAL',
                        'ZWE': 'ZIMBABWE',
                        'BFA': 'BURKINA FASO',
                        'ESH': 'W. SAHARA'
                      };
                      displayName = nameOverrides[country.id] || country.name.toUpperCase();
                    } else if (isMedium && (isSelected || isHovered)) {
                      displayName = country.name.toUpperCase();
                    }

                    return (
                      <g key={`schematic-label-${country.id}`}>
                        <text
                          x={country.centroid.x}
                          y={country.centroid.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={isSelected ? '#059669' : isHovered ? '#0f172a' : '#1e293b'}
                          fontSize={fontSize}
                          fontFamily="sans-serif"
                          fontWeight="900"
                          letterSpacing={isHuge ? "0.08em" : "0.05em"}
                          paintOrder="stroke fill"
                          stroke="#ffffff"
                          strokeWidth={strokeWidth}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          opacity={isSelected || isHovered ? 1 : 0.92}
                        >
                          {displayName}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </>
            )}
          </g>
        </svg>

        {/* Pinned / Hovered Country Tooltip */}
        {displayEntityId && hoveredCountryData && hoveredEntity && (
          <div
            id="pinned-country-tooltip"
            style={{
              left: `${getTooltipPosition().left}px`,
              top: `${getTooltipPosition().top}px`,
            }}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
            className={`absolute z-30 pointer-events-auto w-80 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-150 animate-in fade-in zoom-in-95 ${
              activeTooltipEntityId
                ? 'bg-white/98 dark:bg-zinc-950/98 border-emerald-500/80 ring-2 ring-emerald-500/30'
                : 'bg-white/95 dark:bg-zinc-950/95 border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                <CountryFlag
                  entityId={hoveredEntity.id}
                  size="sm"
                  className="shadow-sm"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
                    {hoveredEntity.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                      {hoveredEntity.id}
                    </span>
                    <span className="text-[10px] text-zinc-400">•</span>
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      {hoveredEntity.region}
                    </span>
                  </div>
                </div>
              </div>

              {activeTooltipEntityId && (
                <button
                  onClick={handleDismissTooltip}
                  className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  title="Close Pinned Tooltip"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 mb-3 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">Population</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {formatPopulation(atlas.getIndicatorValue(hoveredEntity.id, 'SP.POP.TOTL') || 0)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">Nominal GDP</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {formatGDP(atlas.getIndicatorValue(hoveredEntity.id, 'NY.GDP.MKTP.CD') || 0)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">Life Expectancy</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {atlas.getIndicatorValue(hoveredEntity.id, 'SP.DYN.LE00.IN') ? `${atlas.getIndicatorValue(hoveredEntity.id, 'SP.DYN.LE00.IN')} yrs` : '64.2 yrs'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">HDI Score</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {formatHDI(atlas.getIndicatorValue(hoveredEntity.id, 'UNDP.HDI.INDEX') || 0.54)}
                </span>
              </div>
            </div>

            {/* CTA Button to Open Full Country Dossier */}
            <button
              onClick={() => {
                handleSelectCountry(hoveredEntity.id);
                setActiveTooltipEntityId(null);
              }}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Open Country Dossier</span>
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
