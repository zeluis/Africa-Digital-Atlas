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
import { getAdmin1ForCountry, searchAdmin1Subdivisions, ALL_ADMIN1_SUBDIVISIONS } from '../data/africaliaGeographyData';
import { AfricaliaAdmin1 } from '../data/types';
import { getCanonicalCountryColor } from '../data/africaCanonicalColorPalette';
import { AfricaMapFinalLayer } from './AfricaMapFinalLayer';
import { AfricaUnLogo } from './AfricaUnLogo';
import { useAfricaFinalMap } from '../utils/svgMapLoader';

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

// Focus coordinates & zoom transforms for African subregions (unified 5796x5867 coordinate space)
const REGIONAL_ZOOM_PRESETS: Record<AfricanRegion, { zoom: number; x: number; y: number }> = {
  'Northern Africa': { zoom: 1.85, x: 360, y: 3100 },
  'Western Africa': { zoom: 1.8, x: 2260, y: 520 },
  'Central Africa': { zoom: 1.9, x: -690, y: 100 },
  'Eastern Africa': { zoom: 1.75, x: -3250, y: -930 },
  'Southern Africa': { zoom: 2.4, x: -1440, y: -5450 }
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

  const { mapData: finalMapData } = useAfricaFinalMap();

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
  const [isNavigatorOpen, setIsNavigatorOpen] = useState<boolean>(false);
  const [navigatorTab, setNavigatorTab] = useState<'subregions' | 'admin1'>('subregions');
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

  const handleSelectMode = (mode: 'authentic' | 'choropleth' | 'schematic') => {
    if (mode === 'authentic') {
      setCartographySource('authentic_final');
      setMapMode('authentic_palette');
    } else if (mode === 'choropleth') {
      setMapMode('choropleth');
    } else if (mode === 'schematic') {
      setCartographySource('schematic');
      setMapMode('un_geoscheme');
    }
  };

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
    if (currentCountryAdmin1.length > 0) {
      return currentCountryAdmin1;
    }
    return ALL_ADMIN1_SUBDIVISIONS.slice(0, 80);
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

  // Automated Smooth Bounding-Box Zoom-to-Fit for SVGs (5796x5867 coordinate space)
  const fitToElement = useCallback((element: SVGGraphicsElement | null, options: { padding?: number; maxZoom?: number; minZoom?: number } = {}) => {
    if (!element || !svgRef.current) return;
    const { padding = 200, maxZoom = 3.5, minZoom = 0.9 } = options;

    try {
      const bbox = element.getBBox();
      if (bbox.width === 0 || bbox.height === 0) return;

      const svgViewBox = { width: 5796, height: 5867, cx: 2898, cy: 2933 };

      const elemCenterX = bbox.x + bbox.width / 2;
      const elemCenterY = bbox.y + bbox.height / 2;

      const scaleX = (svgViewBox.width - padding * 2) / bbox.width;
      const scaleY = (svgViewBox.height - padding * 2) / bbox.height;
      const targetZoom = Math.max(minZoom, Math.min(maxZoom, Math.min(scaleX, scaleY) * 0.85));

      const offsetX = (svgViewBox.cx - elemCenterX) * (targetZoom / 2.5);
      const offsetY = (svgViewBox.cy - elemCenterY) * (targetZoom / 2.5);

      setZoomLevel(targetZoom);
      setPanOffset({ x: offsetX, y: offsetY });
    } catch (e) {
      console.warn('Could not compute SVG bounding box for zoom', e);
    }
  }, []);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const resizeObserver = new ResizeObserver(() => {});
    resizeObserver.observe(containerEl);
    return () => resizeObserver.disconnect();
  }, []);

  // Synchronize zoom and regional centering when region selector changes from props or external events
  useEffect(() => {
    if (activeRegionFilter && activeRegionFilter !== 'All') {
      const region = activeRegionFilter as AfricanRegion;
      const preset = REGIONAL_ZOOM_PRESETS[region];
      if (preset) {
        setZoomLevel(preset.zoom);
        setPanOffset({ x: preset.x, y: preset.y });
      }
      setVisibleRegions(new Set<AfricanRegion>([region]));
    } else if (activeRegionFilter === 'All') {
      setVisibleRegions(new Set<AfricanRegion>([
        'Northern Africa',
        'Western Africa',
        'Central Africa',
        'Eastern Africa',
        'Southern Africa'
      ]));
    }
  }, [activeRegionFilter]);

  const handleIsolateRegion = (region: AfricanRegion) => {
    setVisibleRegions(new Set<AfricanRegion>([region]));
    handleRegionTabSelect(region);
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
    }
    if (!visibleRegions.has(region)) {
      handleToggleRegion(region);
    }
  };

  const handleResetZoom = () => {
    setZoomLevel(DEFAULT_MAP_ZOOM);
    setPanOffset(DEFAULT_PAN_OFFSET);
  };

  // Automated Smooth Centering and Zoom-to-Fit for Country & Admin-1 Subdivisions
  const zoomToCountry = useCallback((countryId: string) => {
    const country = AFRICA_FINAL_MAP[countryId] || AFRICA_SVG_MAP[countryId];
    if (!country) return;

    // Use bounding box if available
    const bbox = (country as any).bbox || (country as any).boundingBox;
    if (!bbox) return;

    const svgViewBox = { width: 5796, height: 5867, cx: 2898, cy: 2933 };
    const boxWidth = Math.max(120, bbox.maxX - bbox.minX);
    const boxHeight = Math.max(120, bbox.maxY - bbox.minY);
    const elemCenterX = (bbox.minX + bbox.maxX) / 2;
    const elemCenterY = (bbox.minY + bbox.maxY) / 2;

    const padding = 220;
    const scaleX = (svgViewBox.width - padding * 2) / boxWidth;
    const scaleY = (svgViewBox.height - padding * 2) / boxHeight;
    const targetZoom = Math.max(1.3, Math.min(4.2, Math.min(scaleX, scaleY) * 0.78));

    const offsetX = (svgViewBox.cx - elemCenterX) * targetZoom;
    const offsetY = (svgViewBox.cy - elemCenterY) * targetZoom;

    setZoomLevel(targetZoom);
    setPanOffset({ x: offsetX, y: offsetY });
  }, []);

  // Color resolver for each country across Authentic, Choropleth, and Schematic modes
  const getCountryFill = (country: { id: string; unRegion: AfricanRegion; originalColor?: string }, isSelected: boolean, isHovered: boolean): string => {
    if (isSelected) {
      return '#10b981'; // Bright emerald highlight
    }

    // 1. Schematic Mode or UN Geoscheme Mode: Official UN Geoscheme regional colors
    if (cartographySource === 'schematic' || mapMode === 'un_geoscheme') {
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

    // 2. Choropleth Metric Mode
    if (mapMode === 'choropleth') {
      const canonicalColor = getCanonicalCountryColor(country.id);
      const authenticColor = canonicalColor || AFRICA_FINAL_MAP[country.id]?.originalColor || country.originalColor || '#0a9bc3';

      const val = metricValues[country.id];
      if (val === undefined || isNaN(val)) {
        return '#cbd5e1';
      }

      const norm = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal || 1)));

      if (isHovered) {
        return '#0284c7';
      }

      return deriveChoroplethTone(authenticColor, norm, currentMetricDef.color);
    }

    // 3. Authentic Final Map (Canonical authoritative vector colors)
    const canonicalColor = getCanonicalCountryColor(country.id);
    return canonicalColor || AFRICA_FINAL_MAP[country.id]?.originalColor || country.originalColor || '#0a9bc3';
  };

  const [activeTooltipEntityId, setActiveTooltipEntityId] = useState<string | null>(null);
  const [fixedTooltipCoords, setFixedTooltipCoords] = useState<{ x: number; y: number } | null>(null);
  const isInteractingWithTooltipRef = useRef<boolean>(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Target entity for tooltip: either pinned/active or hovered
  const displayEntityId = activeTooltipEntityId || hoveredEntityId;
  const hoveredCountryData = displayEntityId 
    ? (AFRICA_FINAL_MAP[displayEntityId] || AFRICA_SVG_MAP[displayEntityId]) 
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
    zoomToCountry(countryId);
  };

  const handleAdmin1Focus = (admin1: AfricaliaAdmin1) => {
    setSelectedAdmin1(admin1);
    if (admin1.iso3) {
      zoomToCountry(admin1.iso3);
      setActiveTooltipEntityId(admin1.iso3);
      setHoveredEntityId(admin1.iso3);
      setHoveredAdmin1({ id: admin1.id, name: admin1.name, countryId: admin1.iso3 });
    }
  };

  const handleAdmin1Click = (sub: { id: string; name: string; countryId: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setFixedTooltipCoords({ x, y });
    }
    const matchingAdmin1 = ALL_ADMIN1_SUBDIVISIONS.find(a => a.id === sub.id || (a.name.toLowerCase() === sub.name.toLowerCase() && a.iso3 === sub.countryId)) || {
      id: sub.id,
      name: sub.name,
      level: 'admin1',
      parent: sub.countryId,
      iso3: sub.countryId,
      countryName: AFRICA_FINAL_MAP[sub.countryId]?.name || sub.countryId,
      regionName: AFRICA_FINAL_MAP[sub.countryId]?.unRegion || 'Western Africa',
      admin1Code: sub.id
    };
    setSelectedAdmin1(matchingAdmin1 as AfricaliaAdmin1);
    setHoveredAdmin1({ id: sub.id, name: sub.name, countryId: sub.countryId });
    setActiveTooltipEntityId(sub.countryId);
    setHoveredEntityId(sub.countryId);
    zoomToCountry(sub.countryId);
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
            {/* Unified Mode Switcher: Authentic | Choropleth | Schematic */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-0.5 rounded-xl">
              <button
                type="button"
                onClick={() => handleSelectMode('authentic')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  mapMode === 'authentic_palette' && cartographySource === 'authentic_final'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Authoritative original colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Authentic</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMode('choropleth')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  mapMode === 'choropleth'
                    ? 'bg-cyan-600 text-white shadow-xs font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Socio-economic metric choropleth"
              >
                <Layers className="w-3 h-3" />
                <span>Choropleth</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMode('schematic')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  cartographySource === 'schematic' || mapMode === 'un_geoscheme'
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="UN Geoscheme regional macro grouping"
              >
                <Compass className="w-3 h-3" />
                <span>Schematic</span>
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

            {/* Subdivisions Toggle & Inspector Toggle */}
            {isFinalMode && (
              <div className="flex items-center gap-1.5">
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

                <button
                  id="btn-toggle-admin1-inspector-header"
                  type="button"
                  onClick={() => {
                    if (isNavigatorOpen && navigatorTab === 'admin1') {
                      setIsNavigatorOpen(false);
                    } else {
                      setIsNavigatorOpen(true);
                      setNavigatorTab('admin1');
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all shadow-xs cursor-pointer ${
                    isNavigatorOpen && navigatorTab === 'admin1'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                  title="Toggle Admin-1 Subdivisions Inspector"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Inspector ({isNavigatorOpen && navigatorTab === 'admin1' ? 'OPEN' : 'CLOSED'})</span>
                  <span className={`text-[10px] font-mono px-1 py-0.2 rounded font-bold ${
                    isNavigatorOpen && navigatorTab === 'admin1' ? 'bg-emerald-700/80 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                  }`}>
                    {currentCountryAdmin1.length > 0 ? `${currentCountryAdmin1.length}` : '1,017'}
                  </span>
                </button>
              </div>
            )}



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
        {/* Unified Floating Explorer Pill & Integrated Navigator Panel */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-[calc(100vw-32px)]">
          {/* Unified Collapsed Floating Pill in top-left */}
          <div
            id="floating-navigator-pill"
            className="self-start inline-flex items-center rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800/90 shadow-xl backdrop-blur-md p-1 transition-all duration-200 hover:shadow-2xl"
          >
            {/* UN Subregions segment */}
            <button
              id="btn-toggle-un-subregions"
              type="button"
              onClick={() => {
                if (isNavigatorOpen && navigatorTab === 'subregions') {
                  setIsNavigatorOpen(false);
                } else {
                  setIsNavigatorOpen(true);
                  setNavigatorTab('subregions');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isNavigatorOpen && navigatorTab === 'subregions'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title="Toggle UN Subregions Panel"
            >
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-bold">UN Subregions</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {visibleRegions.size}/5
              </span>
            </button>

            {/* Clean Divider */}
            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />

            {/* Admin-1 Inspector segment */}
            <button
              id="btn-toggle-admin1-inspector"
              type="button"
              onClick={() => {
                if (isNavigatorOpen && navigatorTab === 'admin1') {
                  setIsNavigatorOpen(false);
                } else {
                  setIsNavigatorOpen(true);
                  setNavigatorTab('admin1');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isNavigatorOpen && navigatorTab === 'admin1'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title="Toggle Admin-1 Subdivisions Inspector"
            >
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-bold">Admin-1</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {currentCountryAdmin1.length > 0 ? `${currentCountryAdmin1.length}` : '1,017'}
              </span>
            </button>
          </div>

          {/* Sleek & Sophisticated Expanded Navigator Panel */}
          {isNavigatorOpen && (
            <div
              id="floating-un-subregions-panel"
              className="w-auto min-w-[320px] sm:min-w-[460px] max-w-[calc(100vw-32px)] sm:max-w-2xl lg:max-w-3xl rounded-2xl bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
            >
              {/* Top Header with Tab Switcher, Zoom Controls & Close Control on same row */}
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/60 gap-2 flex-wrap sm:flex-nowrap">
                {/* Left: Tab Switcher (Subregions & Admin-1) */}
                <div className="flex items-center gap-1.5 p-0.5 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/60">
                  <button
                    type="button"
                    onClick={() => setNavigatorTab('subregions')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      navigatorTab === 'subregions'
                        ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Subregions</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold">
                      {visibleRegions.size}/5
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNavigatorTab('admin1')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      navigatorTab === 'admin1'
                        ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Admin-1</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold">
                      {currentCountryAdmin1.length > 0 ? `${currentCountryAdmin1.length}` : '1,017'}
                    </span>
                  </button>
                </div>

                {/* Right: Zoom In/Out Controls, Reset Button & Close Button */}
                <div className="flex items-center gap-1.5 ml-auto">
                  {/* Zoom Controls */}
                  <div className="flex items-center rounded-xl bg-zinc-200/70 dark:bg-zinc-800/80 border border-zinc-300/80 dark:border-zinc-700/80 p-0.5">
                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.25))}
                      className="p-1 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                      title="Zoom Out (-)"
                      aria-label="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>

                    <span className="px-1.5 font-mono font-bold text-[11px] text-emerald-600 dark:text-emerald-400 min-w-[2.4rem] text-center select-none">
                      {Math.round(zoomLevel * 100)}%
                    </span>

                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.min(3.8, prev + 0.25))}
                      className="p-1 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                      title="Zoom In (+)"
                      aria-label="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Reset Button */}
                  <button
                    type="button"
                    onClick={() => {
                      handleShowAllRegions();
                      handleResetZoom();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/80 dark:border-emerald-800/60 transition-all font-semibold cursor-pointer text-xs active:scale-95 shadow-xs"
                    title="Reset to Full Continent view"
                  >
                    <RotateCcw className="w-3 h-3 text-emerald-500" />
                    <span>Reset</span>
                  </button>

                  {/* Close Navigator */}
                  <button
                    type="button"
                    onClick={() => setIsNavigatorOpen(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer ml-1"
                    title="Collapse Navigator"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tab 1: Subregions Legend */}
              {navigatorTab === 'subregions' && (
                <div className="p-3.5 sm:p-4">
                  <InteractiveMapLegend
                    embedded={true}
                    showZoomControls={false}
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

              {/* Tab 2: Admin-1 Subdivisions Inspector */}
              {navigatorTab === 'admin1' && (
                <div id="admin1-subdivision-inspector" className="flex flex-col">
                  {/* Search Bar & Subheader */}
                  <div className="p-2.5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/40">
                    <div className="relative flex items-center mb-1.5">
                      <Search className="absolute left-2.5 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search state, province, or region..."
                        value={admin1SearchQuery}
                        onChange={(e) => setAdmin1SearchQuery(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 text-xs font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      />
                      {admin1SearchQuery && (
                        <button
                          type="button"
                          onClick={() => setAdmin1SearchQuery('')}
                          className="absolute right-2 p-0.5 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 px-1">
                      <span>
                        {selectedEntityId ? (AFRICA_FINAL_MAP[selectedEntityId]?.name || selectedEntityId) : 'All African Territories'}
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {filteredAdmin1List.length} subdivision{filteredAdmin1List.length === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>

                  {/* Subdivisions List */}
                  <div className="overflow-y-auto p-2 space-y-1.5 max-h-[50vh]">
                    {filteredAdmin1List.length === 0 ? (
                      <div className="p-6 text-center text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        No subdivisions match &ldquo;{admin1SearchQuery}&rdquo;.
                      </div>
                    ) : (
                      filteredAdmin1List.map((adm) => {
                        const isAdmSelected = selectedAdmin1?.id === adm.id;
                        const isAdmHovered = hoveredAdmin1?.id === adm.id;
                        return (
                          <div
                            key={adm.id}
                            onMouseEnter={() => {
                              setHoveredAdmin1({ id: adm.id, name: adm.name, countryId: adm.iso3 });
                              setHoveredEntityId(adm.iso3);
                            }}
                            onMouseLeave={() => {
                              setHoveredAdmin1(null);
                            }}
                            onClick={() => handleAdmin1Focus(adm)}
                            className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                              isAdmSelected
                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-xs'
                                : isAdmHovered
                                ? 'bg-zinc-100/90 dark:bg-zinc-900/90 border-emerald-500/40 text-zinc-900 dark:text-zinc-100'
                                : 'bg-white/60 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <CountryFlag entityId={adm.iso3} size="xs" />
                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate leading-tight">{adm.name}</p>
                                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                                  {adm.countryName} ({adm.iso3})
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
                                {adm.admin1Code || adm.id}
                              </span>
                              <div className={`p-1 rounded-lg ${isAdmSelected ? 'bg-emerald-600 text-white' : 'text-zinc-400'}`}>
                                <Maximize2 className="w-3 h-3" />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <svg
          ref={svgRef}
          viewBox={AFRICA_FINAL_VIEWBOX}
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
              transformOrigin: '2898px 2933px',
              transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            <AfricaMapFinalLayer
                mapData={finalMapData}
                selectedEntityId={selectedEntityId}
                activeTooltipEntityId={activeTooltipEntityId}
                hoveredEntityId={hoveredEntityId}
                hoveredAdmin1={hoveredAdmin1}
                selectedAdmin1={selectedAdmin1}
                showAdmin1Borders={cartographySource === 'schematic' ? false : showAdmin1Borders}
                showGraticuleAndCompass={showGraticuleAndCompass}
                visibleRegions={visibleRegions}
                activeRegionFilter={activeRegionFilter}
                activeBlocFilter={selectedBlocId}
                blocMemberSet={blocMemberSet}
                getCountryFill={getCountryFill}
                handleCountryHover={handleCountryHover}
                handleCountryLeave={handleCountryLeave}
                handleCountryClick={handleCountryClick}
                handleAdmin1Click={handleAdmin1Click}
                setHoveredAdmin1={setHoveredAdmin1}
              />
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
            {/* Admin-1 Subdivision Badge when hovered or selected */}
            {(hoveredAdmin1 || (selectedAdmin1 && selectedAdmin1.iso3 === hoveredEntity.id)) && (
              <div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs font-semibold mb-2.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate font-bold text-emerald-800 dark:text-emerald-200">
                    {hoveredAdmin1?.name || selectedAdmin1?.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                  {selectedAdmin1?.admin1Code || 'ADMIN-1'}
                </span>
              </div>
            )}
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
