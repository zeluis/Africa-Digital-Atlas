import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Zap,
  FileCode,
  Settings2,
  ChevronDown,
  SlidersHorizontal,
  FileImage,
  SunMedium,
  Droplet,
  Building2,
  Wheat,
  Activity,
  Footprints,
  Radio,
  Clock
} from 'lucide-react';
import { getAdmin1ForCountry, searchAdmin1Subdivisions, ALL_ADMIN1_SUBDIVISIONS } from '../data/africaliaGeographyData';
import { AfricaliaAdmin1 } from '../data/types';
import { getCanonicalCountryColor } from '../data/africaCanonicalColorPalette';
import { AfricaMapFinalLayer } from './AfricaMapFinalLayer';
import { AfricaUnLogo } from './AfricaUnLogo';
import { useAfricaFinalMap } from '../utils/svgMapLoader';
import { ThematicLayerDeck } from './ThematicLayerDeck';
import { AkpCatalogueModal } from './AkpCatalogueModal';
import {
  ThematicOverlaysLayer,
  AnyThematicItem,
  LayerVisibilityState,
  DEFAULT_LAYER_VISIBILITY
} from './ThematicOverlaysLayer';
import { SubseaCablePath, CableLandingStation } from '../data/akpTelecomCables';
import { ConflictBeacon, CONFLICT_CATEGORY_CONFIG } from '../data/akpConflictSecurity';
import { SocialInfrastructureFacility } from '../data/akpSocialInfrastructure';
import { HeritageSanctuarySite } from '../data/akpCulturalReserves';
import {
  AKP_CHOROPLETH_METRICS,
  AKP_CATEGORIES,
  getAkpCountryValue,
  AkpCategory,
  AkpInfrastructurePoint,
  AkpProtectedArea,
  AkpMetricDef
} from '../data/akpDatasets';
import {
  getMetricChoroplethColor,
  METRIC_COLOR_PALETTES,
  ThematicPath,
  ThematicPulseNode,
  ThematicAreaAura
} from '../data/akpThematicOverlays';

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

export const CHOROPLETH_METRICS = AKP_CHOROPLETH_METRICS;

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
    externalMapMode || (initialCartographySource === 'authentic_final' ? 'authentic_palette' : 'un_geoscheme')
  );
  const mapMode = externalMapMode !== undefined ? externalMapMode : internalMapMode;
  const setMapMode = (newMode: MapDisplayMode) => {
    setInternalMapMode(newMode);
    onMapModeChange?.(newMode);
  };

  const [internalMetric, setInternalMetric] = useState<string>('NY.GDP.MKTP.CD');
  const activeMetric = externalMetric !== undefined ? externalMetric : internalMetric;
  const setActiveMetric = (newMetric: string) => {
    setInternalMetric(newMetric);
    onActiveMetricChange?.(newMetric);
  };

  // Regional Blocs filter
  const [selectedBlocId, setSelectedBlocId] = useState<string>('ALL');
  const blocMemberSet = useMemo(() => {
    if (selectedBlocId === 'ALL') return null;
    const blocDef = REGIONAL_BLOCS_LIST.find(b => b.id === selectedBlocId);
    return blocDef && blocDef.members ? new Set(blocDef.members) : null;
  }, [selectedBlocId]);

  // Overlays toggle state (Graticule lines & Compass Rose, AKP Infrastructure & Biospheres)
  const [showGraticuleAndCompass, setShowGraticuleAndCompass] = useState<boolean>(true);
  const [showAdmin1Borders, setShowAdmin1Borders] = useState<boolean>(true);
  const [showPowerPlants, setShowPowerPlants] = useState<boolean>(false);
  const [showProtectedAreas, setShowProtectedAreas] = useState<boolean>(false);
  const [showThematicOverlays, setShowThematicOverlays] = useState<boolean>(true);
  const [activeAkpCategory, setActiveAkpCategory] = useState<AkpCategory>('all');
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibilityState>(DEFAULT_LAYER_VISIBILITY);
  const [isCatalogueModalOpen, setIsCatalogueModalOpen] = useState<boolean>(false);
  const [hoveredThematicItem, setHoveredThematicItem] = useState<AnyThematicItem | null>(null);
  const [selectedThematicItem, setSelectedThematicItem] = useState<AnyThematicItem | null>(null);
  const [hoveredAkpNode, setHoveredAkpNode] = useState<AkpInfrastructurePoint | AkpProtectedArea | null>(null);

  const handleToggleLayer = (key: keyof LayerVisibilityState) => {
    setLayerVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSetAllLayers = (enabled: boolean) => {
    setLayerVisibility({
      subseaCables: enabled,
      landingStations: enabled,
      conflictBeacons: enabled,
      hospitals: enabled,
      schools: enabled,
      culturalHeritage: enabled,
      naturalSanctuaries: enabled,
      powerCorridors: enabled,
      growthNodes: enabled,
      areaAuras: enabled
    });
  };

  // Unified inspector helper for all rich thematic layers
  const getThematicItemDisplay = (item: AnyThematicItem) => {
    if ('fatalities12M' in item) {
      const conf = item as ConflictBeacon;
      return {
        badge: `${CONFLICT_CATEGORY_CONFIG[conf.category]?.badge || '⚔️ Security'} [${conf.intensity.toUpperCase()}]`,
        category: 'Peace & Security (ACLED)',
        name: conf.name,
        subtitle: `${conf.countryName} • ${conf.categoryLabel}`,
        description: conf.description,
        stats: [
          { label: 'Conflict Intensity', value: conf.intensity.toUpperCase() },
          { label: 'Fatalities (12M)', value: `${conf.fatalities12M.toLocaleString()} Reported` },
          { label: 'Event Count (12M)', value: `${conf.eventCount12M} Armed Events` },
          { label: 'Key Actors', value: conf.actorsInvolved.join(', ') },
          { label: 'Humanitarian Impact', value: conf.humanitarianImpact },
          ...(conf.peaceMission ? [{ label: 'Peacekeeping Mission', value: conf.peaceMission }] : [])
        ],
        source: conf.source,
        accentColor: conf.color
      };
    }

    if ('designCapacityTbps' in item) {
      const cable = item as SubseaCablePath;
      return {
        badge: `🌐 Subsea Cable (${cable.designCapacityTbps} Tbps)`,
        category: 'Telecommunications & Cloud Optics',
        name: cable.name,
        subtitle: `${cable.lengthKm.toLocaleString()} km System • Live Operational Route`,
        description: cable.description,
        stats: cable.stats,
        source: cable.source,
        accentColor: cable.color
      };
    }

    if ('cablesConnected' in item) {
      const station = item as CableLandingStation;
      return {
        badge: '🌐 Oceanic Landing Hub',
        category: 'Telecommunications Gateway',
        name: `${station.city} Cable Landing Station`,
        subtitle: `${station.countryIso3} • ${station.totalBandwidthTbps} Tbps Bandwidth Capacity`,
        description: station.description,
        stats: [
          { label: 'Bandwidth', value: `${station.totalBandwidthTbps} Tbps` },
          { label: 'Subsea Systems', value: station.cablesConnected.join(', ') },
          { label: 'Status', value: station.status },
          { label: 'Key Operator', value: station.operator }
        ],
        source: 'TeleGeography Submarine Cable Map / ITU',
        accentColor: '#00f0ff'
      };
    }

    if ('capacityValue' in item) {
      const fac = item as SocialInfrastructureFacility;
      const isHosp = fac.type === 'hospital';
      return {
        badge: isHosp ? '🏥 Quaternary Referral Center' : '🎓 Academic Mega-Campus',
        category: isHosp ? 'Healthcare & Clinical Tertiary' : 'Higher Education & Research Hub',
        name: fac.name,
        subtitle: `${fac.city}, ${fac.countryName} • ${fac.specialization}`,
        description: fac.description,
        stats: fac.stats,
        source: fac.source,
        accentColor: fac.color
      };
    }

    if ('unescoCriteria' in item) {
      const site = item as HeritageSanctuarySite;
      return {
        badge: site.badge,
        category: site.type === 'cultural' ? 'UNESCO Cultural Monument' : 'Biosphere Reserve & Sanctuary',
        name: site.name,
        subtitle: `${site.countryName} • Inscribed ${site.inscriptionYear}`,
        description: site.description,
        stats: [
          ...(site.areaKm2 ? [{ label: 'Protected Area', value: site.areaKm2 }] : []),
          { label: 'UNESCO Criteria', value: site.unescoCriteria },
          ...site.stats
        ],
        source: site.source,
        accentColor: site.color
      };
    }

    if ('badge' in item && 'subtitle' in item) {
      const node = item as ThematicPulseNode;
      return {
        badge: node.badge,
        category: node.category.replace('_', ' ').toUpperCase(),
        name: node.name,
        subtitle: node.subtitle,
        description: node.description,
        stats: node.stats,
        source: node.source,
        accentColor: node.color
      };
    }

    const path = item as (ThematicPath | ThematicAreaAura);
    return {
      badge: '🛣️ Continental Infrastructure Artery',
      category: path.category.replace('_', ' ').toUpperCase(),
      name: path.name,
      subtitle: undefined,
      description: path.description,
      stats: path.stats,
      source: path.source,
      accentColor: 'color' in path ? path.color : path.strokeColor
    };
  };
  const [isAdmin1InspectorOpen, setIsAdmin1InspectorOpen] = useState<boolean>(false);
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);
  const [hoveredAdmin1, setHoveredAdmin1] = useState<{ id: string; name: string; countryId: string } | null>(null);
  const [activeRegionHover, setActiveRegionHover] = useState<AfricanRegion | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [isExportingSvg, setIsExportingSvg] = useState<boolean>(false);
  const [exportSvgSuccess, setExportSvgSuccess] = useState<boolean>(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);
  const [exportBg, setExportBg] = useState<'white' | 'dark' | 'transparent'>('white');
  const [exportIncludeWatermark, setExportIncludeWatermark] = useState<boolean>(true);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    }
    if (isExportMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExportMenuOpen]);

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
      setCartographySource('authentic_final');
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
      // First check authoritative AKP ingested data
      let val: number | null = getAkpCountryValue(id, activeMetric);

      // If not in AKP dedicated table, check atlas indicators or derived values
      if (val === null) {
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

    // 1. Choropleth Metric Mode
    if (mapMode === 'choropleth') {
      const val = metricValues[country.id];
      if (val === undefined || isNaN(val)) {
        return '#cbd5e1';
      }

      const norm = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal || 1)));

      if (isHovered) {
        return '#0284c7';
      }

      // High-contrast, high-opacity indicator-specific chromatic progression
      const metricColorResult = getMetricChoroplethColor(
        activeMetric,
        norm,
        Boolean((currentMetricDef as any).reverseScale)
      );
      return metricColorResult.color;
    }

    // 2. Schematic Mode / UN Geoscheme Regional Grouping
    if (mapMode === 'un_geoscheme' || (cartographySource === 'schematic' && mapMode !== 'authentic_palette')) {
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

  // Touch pan & pinch zoom handlers for mobile devices
  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y };
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchStartRef.current = {
        x: (t1.clientX + t2.clientX) / 2 - panOffset.x,
        y: (t1.clientY + t2.clientY) / 2 - panOffset.y,
        dist
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPanOffset({
        x: touch.clientX - touchStartRef.current.x,
        y: touch.clientY - touchStartRef.current.y
      });
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = dist / touchStartRef.current.dist;
      setZoomLevel(prev => Math.max(0.7, Math.min(4.2, prev * (1 + (ratio - 1) * 0.1))));
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // High-Resolution PNG Export Handler
  const handleDownloadPng = async (customBg?: 'white' | 'dark' | 'transparent') => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const bgChoice = customBg || exportBg;

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
          if (bgChoice === 'dark') {
            ctx.fillStyle = '#09090b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (bgChoice === 'white') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          if (exportIncludeWatermark) {
            ctx.fillStyle = bgChoice === 'dark' ? '#10b981' : '#047857';
            ctx.font = 'bold 24px monospace';
            ctx.fillText('AFRICA DATA ATLAS • AUTHENTIC CARTOGRAPHY', 40, canvas.height - 40);

            ctx.fillStyle = bgChoice === 'dark' ? '#a1a1aa' : '#64748b';
            ctx.font = '16px monospace';
            ctx.fillText(`Exported ${new Date().toISOString().split('T')[0]} • 54 Sovereign African Nations & Territories`, 40, canvas.height - 18);
          }

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

  // High-Precision Scalable SVG Export Handler
  const handleDownloadSvg = async (customOptions?: {
    bg?: 'white' | 'dark' | 'transparent';
    includeWatermark?: boolean;
  }) => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const bgChoice = customOptions?.bg || exportBg;
    const withWatermark = customOptions?.includeWatermark !== undefined ? customOptions.includeWatermark : exportIncludeWatermark;

    setIsExportingSvg(true);
    try {
      // Deep clone SVG element so we can manipulate attributes safely
      const clonedSvg = svgEl.cloneNode(true) as SVGSVGElement;

      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      clonedSvg.setAttribute('version', '1.1');

      // Add background rect if solid
      if (bgChoice !== 'transparent') {
        const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bgRect.setAttribute('x', '-10000');
        bgRect.setAttribute('y', '-10000');
        bgRect.setAttribute('width', '40000');
        bgRect.setAttribute('height', '40000');
        bgRect.setAttribute('fill', bgChoice === 'dark' ? '#09090b' : '#ffffff');
        clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);
      }

      // Add watermark if requested
      if (withWatermark) {
        const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        textGroup.setAttribute('id', 'atlas-export-metadata');

        const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        titleText.setAttribute('x', '160');
        titleText.setAttribute('y', '5680');
        titleText.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
        titleText.setAttribute('font-size', '72');
        titleText.setAttribute('font-weight', 'bold');
        titleText.setAttribute('fill', bgChoice === 'dark' ? '#10b981' : '#047857');
        titleText.textContent = 'AFRICA DATA ATLAS • AUTHENTIC VECTOR CARTOGRAPHY';

        const subtitleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        subtitleText.setAttribute('x', '160');
        subtitleText.setAttribute('y', '5760');
        subtitleText.setAttribute('font-family', 'monospace');
        subtitleText.setAttribute('font-size', '44');
        subtitleText.setAttribute('fill', bgChoice === 'dark' ? '#a1a1aa' : '#64748b');
        subtitleText.textContent = `Exported ${new Date().toISOString().split('T')[0]} • Mode: ${mapMode.toUpperCase()} • 54 Sovereign African Nations & Territories`;

        textGroup.appendChild(titleText);
        textGroup.appendChild(subtitleText);
        clonedSvg.appendChild(textGroup);
      }

      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(clonedSvg);

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.download = `africa_data_atlas_${mapMode}_${new Date().toISOString().split('T')[0]}.svg`;
      link.href = blobURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobURL);

      setExportSvgSuccess(true);
      setTimeout(() => setExportSvgSuccess(false), 3000);
      setIsExportingSvg(false);
    } catch (err) {
      console.error('Failed to export map SVG', err);
      setIsExportingSvg(false);
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
      <div id="unified-africa-map-control-card" className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-950/95 p-3 sm:p-4 shadow-sm backdrop-blur-md space-y-2.5">
        {/* Top Header Row: Branding, Stable Tool Groups, Mode Switcher, and Export */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
          {/* Left: Branding & Map Metadata */}
          <div className="flex items-center gap-3 shrink-0">
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

          {/* Right: Stable Toolbar Group (Zero Layout Shift) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Unified Mode Switcher Segmented Pill */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-0.5 rounded-xl relative">
              <button
                type="button"
                onClick={() => handleSelectMode('authentic')}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 z-10 ${
                  mapMode === 'authentic_palette'
                    ? 'text-white font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Authoritative original colors extracted from vector atlas"
              >
                {mapMode === 'authentic_palette' && (
                  <motion.div
                    layoutId="activeMapModeHighlight"
                    className="absolute inset-0 bg-emerald-600 rounded-lg shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Sparkles className="w-3 h-3" />
                <span>Authentic</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMode('choropleth')}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 z-10 ${
                  mapMode === 'choropleth'
                    ? 'text-white font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Socio-economic indicator choropleth"
              >
                {mapMode === 'choropleth' && (
                  <motion.div
                    layoutId="activeMapModeHighlight"
                    className="absolute inset-0 bg-cyan-600 rounded-lg shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Layers className="w-3 h-3" />
                <span>Choropleth</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMode('schematic')}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 z-10 ${
                  mapMode === 'un_geoscheme'
                    ? 'text-white font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="UN Geoscheme regional macro grouping"
              >
                {mapMode === 'un_geoscheme' && (
                  <motion.div
                    layoutId="activeMapModeHighlight"
                    className="absolute inset-0 bg-amber-600 rounded-lg shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
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

            {/* AKP Clean Energy & Dams Overlay Toggle */}
            {isFinalMode && (
              <button
                type="button"
                onClick={() => setShowPowerPlants(prev => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all shadow-xs cursor-pointer ${
                  showPowerPlants
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30'
                    : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Toggle European Commission AKP Clean Energy Infrastructure & Major Dams Overlay"
              >
                <Zap className="w-3 h-3 text-amber-500" />
                <span>Clean Power ({showPowerPlants ? 'ON' : 'OFF'})</span>
              </button>
            )}

            {/* AKP Protected Biospheres Overlay Toggle */}
            {isFinalMode && (
              <button
                type="button"
                onClick={() => setShowProtectedAreas(prev => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all shadow-xs cursor-pointer ${
                  showProtectedAreas
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Toggle UNESCO World Heritage & BIOPAMA African Biosphere Reserves Overlay"
              >
                <Trees className="w-3 h-3 text-emerald-500" />
                <span>Reserves ({showProtectedAreas ? 'ON' : 'OFF'})</span>
              </button>
            )}

            {/* AKP Animated Thematic Overlays (Power Pools, Corridors, Megacities) */}
            {isFinalMode && (
              <button
                type="button"
                onClick={() => setShowThematicOverlays(prev => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all shadow-xs cursor-pointer ${
                  showThematicOverlays
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-500/30'
                    : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Toggle Animated Continental Corridors, Flow Pulses & Metropolitan Hubs"
              >
                <Activity className="w-3 h-3 text-cyan-500" />
                <span>Thematic Flows ({showThematicOverlays ? 'ON' : 'OFF'})</span>
              </button>
            )}

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
                  onClick={() => setIsAdmin1InspectorOpen(prev => !prev)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all shadow-xs cursor-pointer ${
                    isAdmin1InspectorOpen
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                  title="Toggle Admin-1 Subdivisions Inspector"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Inspector ({isAdmin1InspectorOpen ? 'OPEN' : 'CLOSED'})</span>
                  <span className={`text-[10px] font-mono px-1 py-0.2 rounded font-bold ${
                    isAdmin1InspectorOpen ? 'bg-emerald-700/80 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                  }`}>
                    {currentCountryAdmin1.length > 0 ? `${currentCountryAdmin1.length}` : '1,017'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dedicated Sliding Context Tray: Choropleth Indicator Selector & Dynamic Scale */}
        <AnimatePresence initial={false}>
          {mapMode === 'choropleth' && (
            <motion.div
              key="choropleth-sliding-tray"
              initial={{ height: 0, opacity: 0, y: -8 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -8, transition: { duration: 0.12, ease: [0.4, 0, 0.2, 1] } }}
              transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.55 }}
              className="overflow-hidden transform-gpu"
            >
              <div className="pt-1.5 pb-1">
                <div className="flex flex-col gap-2 bg-gradient-to-r from-cyan-500/10 via-emerald-500/5 to-blue-500/10 dark:from-cyan-950/40 dark:via-emerald-950/20 dark:to-blue-950/40 p-2.5 rounded-2xl border border-cyan-500/30 dark:border-cyan-800/40 shadow-xs">
                  {/* Category Filter Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-cyan-500/15 dark:border-cyan-800/25">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 shrink-0 mr-1 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                      AKP Theme:
                    </span>
                    {AKP_CATEGORIES.map(cat => {
                      const CatIcon = cat.icon;
                      const isCatActive = activeAkpCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveAkpCategory(cat.id)}
                          className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                            isCatActive
                              ? 'bg-cyan-700 text-white shadow-xs font-bold'
                              : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300 hover:bg-cyan-50 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800'
                          }`}
                        >
                          <CatIcon className="w-2.5 h-2.5" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Indicators & Live Ramp Row */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                    {/* Metric Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                      {AKP_CHOROPLETH_METRICS.filter(m => activeAkpCategory === 'all' || m.category === activeAkpCategory).map(m => {
                        const IconComp = m.icon;
                        const isSelected = activeMetric === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setActiveMetric(m.id)}
                            title={`${m.label} — Source: ${m.source}`}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-cyan-600 text-white shadow-xs font-bold ring-2 ring-cyan-500/30'
                                : 'bg-white dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 hover:bg-cyan-50 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800'
                            }`}
                          >
                            <IconComp className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-cyan-600 dark:text-cyan-400'}`} />
                            <span>{m.shortLabel || m.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Live Dynamic Legend Ramp & AKP Source */}
                    {(() => {
                      const activePal = METRIC_COLOR_PALETTES[activeMetric] || METRIC_COLOR_PALETTES['NY.GDP.MKTP.CD'];
                      const isRev = Boolean((currentMetricDef as any).reverseScale);
                      const s0 = isRev ? activePal.stops[3] : activePal.stops[0];
                      const s1 = isRev ? activePal.stops[2] : activePal.stops[1];
                      const s2 = isRev ? activePal.stops[1] : activePal.stops[2];
                      const s3 = isRev ? activePal.stops[0] : activePal.stops[3];
                      return (
                        <div className="flex items-center gap-2.5 shrink-0 text-[11px] text-zinc-600 dark:text-zinc-400 pl-1">
                          <span className="text-[10px] font-medium text-zinc-400">{isRev ? 'High (Worst)' : 'Low'}</span>
                          <div
                            className="h-2.5 w-24 sm:w-28 rounded-full border border-zinc-400/40 dark:border-zinc-600/50 shadow-inner"
                            style={{
                              background: `linear-gradient(to right, ${s0}, ${s1}, ${s2}, ${s3})`
                            }}
                          />
                          <span className="text-[10px] font-medium text-zinc-400">{isRev ? 'Low (Best)' : 'High'}</span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-200 border border-cyan-300/60 dark:border-cyan-700/60">
                            {currentMetricDef.unit}
                          </span>
                          <span className="hidden sm:inline-block text-[10px] font-semibold text-cyan-800/80 dark:text-cyan-300/80 bg-white/70 dark:bg-zinc-900/80 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-900">
                            {currentMetricDef.source || 'EC JRC AKP'}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            exportControls={
              <div className="relative" ref={exportMenuRef}>
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-0.5 rounded-xl shadow-xs">
                  {/* PNG Export Button */}
                  <button
                    type="button"
                    onClick={() => handleDownloadPng()}
                    disabled={isExporting}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50"
                    title="Quick download as High-Res PNG (2x Raster)"
                  >
                    {isExporting ? (
                      <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />
                    ) : exportSuccess ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <FileImage className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <span>{isExporting ? 'Saving...' : exportSuccess ? 'Saved' : 'PNG'}</span>
                  </button>

                  {/* SVG Export Button */}
                  <button
                    type="button"
                    onClick={() => handleDownloadSvg()}
                    disabled={isExportingSvg}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50 border-l border-zinc-200/80 dark:border-zinc-800 pl-2"
                    title="Quick download as Scalable Vector Graphic (SVG)"
                  >
                    {isExportingSvg ? (
                      <Loader2 className="w-3 h-3 animate-spin text-cyan-500" />
                    ) : exportSvgSuccess ? (
                      <Check className="w-3 h-3 text-cyan-500" />
                    ) : (
                      <FileCode className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    )}
                    <span>{isExportingSvg ? 'Saving...' : exportSvgSuccess ? 'Saved' : 'SVG'}</span>
                  </button>

                  {/* Export Options Dropdown Button */}
                  <button
                    type="button"
                    onClick={() => setIsExportMenuOpen(prev => !prev)}
                    className={`px-1.5 py-1 rounded-lg text-xs transition-all cursor-pointer ml-0.5 ${
                      isExportMenuOpen
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                    title="Configure Export Options (Background, Watermark, Quality)"
                    aria-label="Export options"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExportMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Export Options Popover Menu */}
                <AnimatePresence>
                  {isExportMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-72 p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 z-50 text-xs space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Export Options</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsExportMenuOpen(false)}
                          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Background Selector */}
                      <div>
                        <span className="block text-[11px] font-semibold text-zinc-500 mb-1.5">Canvas Background:</span>
                        <div className="grid grid-cols-3 gap-1">
                          {(['white', 'dark', 'transparent'] as const).map(bg => (
                            <button
                              key={bg}
                              type="button"
                              onClick={() => setExportBg(bg)}
                              className={`py-1 px-2 rounded-lg text-[11px] font-medium border text-center capitalize transition-all cursor-pointer ${
                                exportBg === bg
                                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                              }`}
                            >
                              {bg}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Watermark Toggle */}
                      <label className="flex items-center justify-between gap-2 py-1 cursor-pointer select-none">
                        <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                          Include Title & Watermark
                        </span>
                        <input
                          type="checkbox"
                          checked={exportIncludeWatermark}
                          onChange={(e) => setExportIncludeWatermark(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-600 border-zinc-300 focus:ring-emerald-500 cursor-pointer"
                        />
                      </label>

                      {/* Actions */}
                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleDownloadPng();
                            setIsExportMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs cursor-pointer"
                        >
                          <FileImage className="w-3.5 h-3.5" />
                          <span>PNG (2x)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleDownloadSvg();
                            setIsExportMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-xs cursor-pointer"
                        >
                          <FileCode className="w-3.5 h-3.5" />
                          <span>SVG Vector</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            }
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
        {/* Top-Right Floating Overlays & Layer Deck Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <ThematicLayerDeck
            layerVisibility={layerVisibility}
            onToggleLayer={handleToggleLayer}
            onSetAllLayers={handleSetAllLayers}
            onOpenCatalogueModal={() => setIsCatalogueModalOpen(true)}
            showPowerPlants={showPowerPlants}
            onTogglePowerPlants={() => setShowPowerPlants(prev => !prev)}
            showProtectedAreas={showProtectedAreas}
            onToggleProtectedAreas={() => setShowProtectedAreas(prev => !prev)}
          />
        </div>

        {/* Floating Admin-1 Subdivisions Inspector */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-[calc(100vw-32px)]">
          {/* Collapsed Floating Pill in top-left */}
          <div
            id="floating-admin1-inspector-pill"
            className="self-start inline-flex items-center rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800/90 shadow-xl backdrop-blur-md p-1 transition-all duration-200 hover:shadow-2xl"
          >
            <button
              id="btn-toggle-admin1-inspector"
              type="button"
              onClick={() => setIsAdmin1InspectorOpen(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isAdmin1InspectorOpen
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title="Toggle Admin-1 Subdivisions Inspector"
            >
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-bold">Admin-1 Inspector</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {currentCountryAdmin1.length > 0 ? `${currentCountryAdmin1.length}` : '1,017'}
              </span>
            </button>
          </div>

          {/* Expanded Admin-1 Subdivisions Panel */}
          {isAdmin1InspectorOpen && (
            <div
              id="floating-admin1-inspector-panel"
              className="w-auto min-w-[320px] sm:min-w-[420px] max-w-[calc(100vw-32px)] sm:max-w-lg rounded-2xl bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
            >
              {/* Header with Title, Count & Close Control */}
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/60 gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Admin-1 Subdivisions</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
                    {currentCountryAdmin1.length > 0 ? `${currentCountryAdmin1.length}` : '1,017'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAdmin1InspectorOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Close Inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Admin-1 Subdivisions Inspector */}
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
          role="region"
          aria-label="Interactive Map of the African Continent"
          className="w-full h-full cursor-grab active:cursor-grabbing select-none block touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
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

          {/* Zoomable & Pannable Layer with GPU optimization */}
          <g
            id="africa-map-viewport"
            transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
            style={{
              transformOrigin: '2898px 2933px',
              contain: 'paint',
              willChange: isDragging ? 'transform' : 'auto',
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
                showPowerPlants={showPowerPlants}
                showProtectedAreas={showProtectedAreas}
                showThematicOverlays={showThematicOverlays}
                activeThematicTheme={activeAkpCategory}
                layerVisibility={layerVisibility}
                hoveredThematicItem={hoveredThematicItem}
                onHoverThematicItem={(item) => setHoveredThematicItem(item)}
                onClickThematicItem={(item) => setSelectedThematicItem(item)}
                hoveredAkpNode={hoveredAkpNode}
                onHoverAkpNode={(node) => setHoveredAkpNode(node)}
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

        {/* Rich Interactive Floating Hover Card for All Thematic Overlays & Beacons (Editorial Theme) */}
        {hoveredThematicItem && !selectedThematicItem && (() => {
          const info = getThematicItemDisplay(hoveredThematicItem);
          return (
            <div
              style={{
                left: `${Math.min(window.innerWidth - 380, Math.max(20, cursorPos.x + 18))}px`,
                top: `${Math.max(20, Math.min(window.innerHeight - 360, cursorPos.y - 140))}px`,
              }}
              className="absolute z-40 pointer-events-none w-84 p-4 rounded-2xl bg-white/98 dark:bg-zinc-950/98 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${info.accentColor}18`,
                    color: info.accentColor,
                    borderColor: `${info.accentColor}40`
                  }}
                >
                  {info.badge}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-bold uppercase truncate max-w-[120px]">
                  {info.category}
                </span>
              </div>

              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug mb-1">
                {info.name}
              </h4>

              {info.subtitle && (
                <p className="text-[11px] font-semibold mb-2" style={{ color: info.accentColor }}>
                  {info.subtitle}
                </p>
              )}

              <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 my-2">
                {info.stats.slice(0, 4).map((st, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500 dark:text-zinc-400">{st.label}:</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{st.value}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 my-2 leading-relaxed">
                {info.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                <span className="truncate mr-2">{info.source}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">Click to Inspect</span>
              </div>
            </div>
          );
        })()}

        {/* Unified Top-Docked Inspector Drawer (Slide-Over Card with Full Tactical Telemetry) */}
        <AnimatePresence>
          {selectedThematicItem && (() => {
            const info = getThematicItemDisplay(selectedThematicItem);
            return (
              <motion.div
                initial={{ opacity: 0, y: -24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[420px] max-w-[calc(100vw-32px)] z-50 p-5 rounded-2xl bg-white/98 dark:bg-zinc-950/98 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `${info.accentColor}18`,
                      color: info.accentColor,
                      borderColor: `${info.accentColor}40`
                    }}
                  >
                    {info.badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedThematicItem(null)}
                    className="p-1 rounded-full text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Close Inspector"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 leading-snug mb-1">
                  {info.name}
                </h3>

                {info.subtitle && (
                  <p className="text-xs font-semibold mb-2.5" style={{ color: info.accentColor }}>
                    {info.subtitle}
                  </p>
                )}

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3.5">
                  {info.description}
                </p>

                {/* Tactical Telemetry & Quantitative Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-zinc-50 dark:bg-zinc-900/80 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 mb-3.5">
                  {info.stats.map((st, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">{st.label}</span>
                      <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">{st.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">Authoritative Source</span>
                    <span className="text-[10px] font-medium text-zinc-700 dark:text-zinc-300 truncate">{info.source}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedThematicItem(null)}
                    className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Interactive Hover Card for AKP Infrastructure & Protected Reserves */}
        {hoveredAkpNode && !hoveredThematicItem && !selectedThematicItem && (
          <div
            style={{
              left: `${Math.min(window.innerWidth - 320, Math.max(20, cursorPos.x + 18))}px`,
              top: `${Math.max(20, Math.min(window.innerHeight - 280, cursorPos.y - 120))}px`,
            }}
            className="absolute z-40 pointer-events-none w-72 p-3.5 rounded-2xl bg-white/98 dark:bg-zinc-950/98 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                {'capacity' in hoveredAkpNode ? '⚡ Clean Energy Asset' : '🌿 Protected Biosphere'}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-bold">
                {hoveredAkpNode.countryIso3}
              </span>
            </div>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug mb-1">
              {hoveredAkpNode.name}
            </h4>
            <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
              {'capacity' in hoveredAkpNode ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">Type / Tech:</span>
                    <span className="font-semibold capitalize text-amber-700 dark:text-amber-300">{(hoveredAkpNode as AkpInfrastructurePoint).type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">Total Capacity:</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{(hoveredAkpNode as AkpInfrastructurePoint).capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">Commissioned:</span>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{(hoveredAkpNode as AkpInfrastructurePoint).commissioned}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">Designation:</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">{(hoveredAkpNode as AkpProtectedArea).designation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">Protected Area:</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{(hoveredAkpNode as AkpProtectedArea).areaKm2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">Classification:</span>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{(hoveredAkpNode as AkpProtectedArea).category}</span>
                  </div>
                </>
              )}
            </div>
            <div className="mt-2 pt-1.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
              <span>European Commission JRC / BIOPAMA</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">AKP Source</span>
            </div>
          </div>
        )}

        {/* Pinned / Hovered Country Tooltip */}
        {displayEntityId && hoveredCountryData && hoveredEntity && !hoveredAkpNode && !hoveredThematicItem && !selectedThematicItem && (
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

      {/* European Commission AKP 241-Dataset Catalogue Browser Modal */}
      <AkpCatalogueModal
        isOpen={isCatalogueModalOpen}
        onClose={() => setIsCatalogueModalOpen(false)}
        onSelectMetric={(metricId) => {
          if (onActiveMetricChange) {
            onActiveMetricChange(metricId);
          } else {
            setInternalMetric(metricId);
          }
          handleSelectMode('choropleth');
        }}
        currentChoroplethMetricId={activeMetric}
      />
    </div>
  );
};
