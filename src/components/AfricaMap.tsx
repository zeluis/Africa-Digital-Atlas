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
import { InteractiveMapLegend, SUBREGION_PILL_DEFS } from './InteractiveMapLegend';
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
  EyeOff,
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
  Clock,
  Quote,
  Database,
  Globe2,
  ShieldAlert,
  Hospital,
  GraduationCap,
  Landmark,
  Columns
} from 'lucide-react';
import { CartographicColophonModal } from './CartographicColophonModal';
import { AcademicExportModal } from './AcademicExportModal';
import { getAdmin1ForCountry, searchAdmin1Subdivisions, ALL_ADMIN1_SUBDIVISIONS } from '../data/africaliaGeographyData';
import { AfricaliaAdmin1 } from '../data/types';
import { getCanonicalCountryColor } from '../data/africaCanonicalColorPalette';
import { AfricaMapFinalLayer } from './AfricaMapFinalLayer';
import { UnifiedInspectorDrawer } from './UnifiedInspectorDrawer';
import { AfricaUnLogo } from './AfricaUnLogo';
import { useAfricaFinalMap } from '../utils/svgMapLoader';
import { ThematicLayerDeck } from './ThematicLayerDeck';
import { AkpCatalogueModal } from './AkpCatalogueModal';
import { BivariateMapTray, BIVARIATE_PRESETS, BIVARIATE_MATRIX_COLORS, BivariateThresholds } from './BivariateMapTray';
import { ChoroplethTimelineScrubber } from './ChoroplethTimelineScrubber';
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

export type MapDisplayMode = 'authentic_palette' | 'un_geoscheme' | 'choropleth' | 'bivariate' | 'antique_parchment';

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

  // Bivariate 2D Choropleth State & Multi-Indicator Cross-Analysis
  const [selectedBivariatePresetId, setSelectedBivariatePresetId] = useState<string>('gdp_vs_renewables');
  const [hoveredBivariateCell, setHoveredBivariateCell] = useState<{ x: number; y: number } | null>(null);
  const [bivariateThresholds, setBivariateThresholds] = useState<BivariateThresholds>({
    pX1: 33,
    pX2: 66,
    pY1: 33,
    pY2: 66
  });

  // Time-Series Horizon Scrubbing State (1990 - 2024)
  const [choroplethYear, setChoroplethYear] = useState<number>(2024);
  const [isPlayingChoroplethTimeline, setIsPlayingChoroplethTimeline] = useState<boolean>(false);

  const activeBivariatePreset = useMemo(() => {
    return BIVARIATE_PRESETS.find(p => p.id === selectedBivariatePresetId) || BIVARIATE_PRESETS[0];
  }, [selectedBivariatePresetId]);

  const bivariateData = useMemo(() => {
    const entities = atlas.getAllEntities();
    const valuesX: Record<string, number> = {};
    const valuesY: Record<string, number> = {};
    const arrX: number[] = [];
    const arrY: number[] = [];

    for (const e of entities) {
      let vx = atlas.getIndicatorValue(e.id, activeBivariatePreset.varX);
      let vy = atlas.getIndicatorValue(e.id, activeBivariatePreset.varY);
      if (vx !== null && !isNaN(vx)) {
        valuesX[e.id] = vx;
        arrX.push(vx);
      }
      if (vy !== null && !isNaN(vy)) {
        valuesY[e.id] = vy;
        arrY.push(vy);
      }
    }

    arrX.sort((a, b) => a - b);
    arrY.sort((a, b) => a - b);

    const idxX1 = Math.min(arrX.length - 1, Math.max(0, Math.floor((arrX.length * bivariateThresholds.pX1) / 100)));
    const idxX2 = Math.min(arrX.length - 1, Math.max(0, Math.floor((arrX.length * bivariateThresholds.pX2) / 100)));
    const idxY1 = Math.min(arrY.length - 1, Math.max(0, Math.floor((arrY.length * bivariateThresholds.pY1) / 100)));
    const idxY2 = Math.min(arrY.length - 1, Math.max(0, Math.floor((arrY.length * bivariateThresholds.pY2) / 100)));

    const tX1 = arrX[idxX1] ?? 0;
    const tX2 = arrX[idxX2] ?? 0;
    const tY1 = arrY[idxY1] ?? 0;
    const tY2 = arrY[idxY2] ?? 0;

    const countryCoords: Record<string, { x: number; y: number; valX: number; valY: number }> = {};
    const cellCounts: number[][] = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];

    for (const e of entities) {
      const vx = valuesX[e.id] ?? arrX[0] ?? 0;
      const vy = valuesY[e.id] ?? arrY[0] ?? 0;

      let x = 0;
      if (vx > tX2) x = 2;
      else if (vx > tX1) x = 1;

      let y = 0;
      if (vy > tY2) y = 2;
      else if (vy > tY1) y = 1;

      countryCoords[e.id] = { x, y, valX: vx, valY: vy };
      cellCounts[y][x]++;
    }

    const cutoffs = {
      x1: tX1,
      x2: tX2,
      y1: tY1,
      y2: tY2
    };

    return { valuesX, valuesY, tX1, tX2, tY1, tY2, countryCoords, cellCounts, cutoffs };
  }, [activeBivariatePreset, bivariateThresholds]);

  // Overlays toggle state (Graticule lines & Compass Rose, AKP Infrastructure & Biospheres)
  const [showGraticuleAndCompass, setShowGraticuleAndCompass] = useState<boolean>(true);
  const [showCartouche, setShowCartouche] = useState<boolean>(true);
  const [isColophonOpen, setIsColophonOpen] = useState<boolean>(false);
  const [isCitationModalOpen, setIsCitationModalOpen] = useState<boolean>(false);
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
  const [isUnifiedDeckOpen, setIsUnifiedDeckOpen] = useState<boolean>(false);
  const [unifiedDeckTab, setUnifiedDeckTab] = useState<'both' | 'inspector' | 'deck'>('both');

  const thematicActiveCount = useMemo(() => {
    return (
      Object.values(layerVisibility).filter(Boolean).length +
      (showPowerPlants ? 1 : 0) +
      (showProtectedAreas ? 1 : 0)
    );
  }, [layerVisibility, showPowerPlants, showProtectedAreas]);

  const handleToggleUnifiedDeck = (tab: 'inspector' | 'deck') => {
    if (isUnifiedDeckOpen) {
      if (unifiedDeckTab === tab) {
        setIsUnifiedDeckOpen(false);
      } else {
        setUnifiedDeckTab(tab);
      }
    } else {
      setUnifiedDeckTab(tab);
      setIsUnifiedDeckOpen(true);
    }
  };

  const thematicDeckItems = useMemo(() => [
    {
      key: 'subseaCables' as keyof LayerVisibilityState,
      label: 'Oceanic Subsea Fiber Cables',
      badge: '2Africa, Equiano, ACE, SEACOM',
      count: 5,
      color: '#0284c7',
      icon: Globe2,
    },
    {
      key: 'landingStations' as keyof LayerVisibilityState,
      label: 'Coastal Cable Landing Hubs',
      badge: 'Alexandria, Lagos, Cape Town...',
      count: 10,
      color: '#0284c7',
      icon: Globe2,
    },
    {
      key: 'conflictBeacons' as keyof LayerVisibilityState,
      label: 'Conflict & Security Beacons',
      badge: 'ACLED Battles, Air Strikes, Disputes',
      count: 8,
      color: '#ef4444',
      icon: ShieldAlert,
    },
    {
      key: 'hospitals' as keyof LayerVisibilityState,
      label: 'Tertiary Referral Hospitals',
      badge: 'Bed Capacity & Level-1 Trauma Hubs',
      count: 7,
      color: '#0891b2',
      icon: Hospital,
    },
    {
      key: 'schools' as keyof LayerVisibilityState,
      label: 'Universities & Education Hubs',
      badge: 'Mega Campuses & Research Output',
      count: 6,
      color: '#d97706',
      icon: GraduationCap,
    },
    {
      key: 'culturalHeritage' as keyof LayerVisibilityState,
      label: 'UNESCO Cultural Monuments',
      badge: 'Lalibela, Giza, Djenné, Axum...',
      count: 7,
      color: '#ca8a04',
      icon: Landmark,
    },
    {
      key: 'naturalSanctuaries' as keyof LayerVisibilityState,
      label: 'Natural Biospheres & Reserves',
      badge: 'Kruger, Kilimanjaro, Victoria Falls',
      count: 6,
      color: '#059669',
      icon: Trees,
    },
    {
      key: 'powerCorridors' as keyof LayerVisibilityState,
      label: 'Power Pools & Trade Corridors',
      badge: 'SAPP, WAPP, EAPP 500kV HVDC',
      count: 5,
      color: '#0284c7',
      icon: Zap,
    },
    {
      key: 'growthNodes' as keyof LayerVisibilityState,
      label: 'Megacity & Energy Growth Nodes',
      badge: 'GERD, Benban, Johannesburg, Cairo',
      count: 10,
      color: '#7c3aed',
      icon: Sparkles,
    }
  ], []);

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

  const handleSelectMode = (mode: 'authentic' | 'choropleth' | 'schematic' | 'bivariate' | 'antique') => {
    if (mode === 'authentic') {
      setCartographySource('authentic_final');
      setMapMode('authentic_palette');
    } else if (mode === 'antique') {
      setCartographySource('authentic_final');
      setMapMode('antique_parchment');
    } else if (mode === 'choropleth') {
      setCartographySource('authentic_final');
      setMapMode('choropleth');
    } else if (mode === 'schematic') {
      setCartographySource('schematic');
      setMapMode('un_geoscheme');
    } else if (mode === 'bivariate') {
      setCartographySource('authentic_final');
      setMapMode('bivariate');
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

  // Compute min, max, and values for choropleth scale (supporting Time-Series 1990–2024 horizon)
  const { metricValues, minVal, maxVal, continentalMean } = useMemo(() => {
    const values: Record<string, number> = {};
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    let count = 0;

    const allMapIds = new Set([...Object.keys(AFRICA_SVG_MAP), ...Object.keys(AFRICA_FINAL_MAP)]);
    for (const id of allMapIds) {
      let val: number | null = null;

      if (choroplethYear === 2024) {
        // Authoritative AKP or atlas latest value
        val = getAkpCountryValue(id, activeMetric);
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
      } else {
        // Historical scrub year (1990 - 2023)
        const obs = atlas.getObservations(id, activeMetric);
        const match = obs.find(o => o.period === choroplethYear);
        if (match && match.value !== null && !isNaN(match.value)) {
          val = match.value;
        } else {
          // Model historical trajectory from 1990 to 2024
          const val2024 = getAkpCountryValue(id, activeMetric) ?? atlas.getIndicatorValue(id, activeMetric);
          if (val2024 !== null && !isNaN(val2024)) {
            const yearDiff = 2024 - choroplethYear;
            const t = (choroplethYear - 1990) / 34; // 0 at 1990, 1 at 2024

            if (activeMetric === 'SP.POP.TOTL') {
              val = Math.round(val2024 * Math.pow(1 - 0.0245, yearDiff) * 100) / 100;
            } else if (activeMetric === 'NY.GDP.MKTP.CD' || activeMetric === 'NY.GDP.PCAP.CD') {
              const gdpScale = 0.22 + 0.78 * Math.pow(t, 1.4);
              val = Math.round(val2024 * gdpScale * 10) / 10;
            } else if (activeMetric === 'EG.ELC.ACCS.ZS') {
              const elecScale = 0.35 + 0.65 * t;
              val = Math.round(Math.max(2, val2024 * elecScale) * 10) / 10;
            } else if (activeMetric === 'IT.NET.USER.ZS') {
              const netScale = Math.max(0, (choroplethYear - 1995) / 29);
              val = Math.round(val2024 * Math.pow(netScale, 2.8) * 10) / 10;
            } else if (activeMetric === 'SP.DYN.LE00.IN') {
              const leDelta = (1 - t) * 8.5;
              val = Math.round((val2024 - leDelta) * 10) / 10;
            } else if (activeMetric === 'UNDP.HDI.INDEX') {
              val = Math.round(Math.max(0.2, val2024 - (1 - t) * 0.14) * 1000) / 1000;
            } else if (activeMetric === 'AG.LND.FRST.ZS') {
              val = Math.round(Math.min(95, val2024 * (1 + (1 - t) * 0.18)) * 10) / 10;
            } else {
              val = Math.round(val2024 * (0.6 + 0.4 * t) * 10) / 10;
            }
          }
        }
      }

      if (val !== null && !isNaN(val)) {
        values[id] = val;
        if (val < min) min = val;
        if (val > max) max = val;
        sum += val;
        count++;
      }
    }

    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 100;
    const continentalMean = count > 0 ? sum / count : 0;

    return { metricValues: values, minVal: min, maxVal: max, continentalMean };
  }, [activeMetric, choroplethYear]);

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

    // 1b. Bivariate 2D Choropleth Mode
    if (mapMode === 'bivariate') {
      const coord = bivariateData.countryCoords[country.id];
      if (!coord) return '#cbd5e1';

      if (hoveredBivariateCell) {
        if (coord.x === hoveredBivariateCell.x && coord.y === hoveredBivariateCell.y) {
          return '#f59e0b'; // Amber spotlight for matched quadrant
        } else {
          return '#d1d5db'; // Dim out non-matched countries
        }
      }

      if (isHovered) {
        return '#f59e0b';
      }

      return BIVARIATE_MATRIX_COLORS[coord.y]?.[coord.x] || '#a5add3';
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
    if (mapMode === 'antique_parchment') {
      const canonicalColor = getCanonicalCountryColor(country.id);
      if (isHovered || isSelected) return '#b45309';
      return canonicalColor || '#EFE4CD';
    }

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
      clonedSvg.setAttribute('data-author', 'Zéluis F. Correia');
      clonedSvg.setAttribute('data-curator', 'Africalia');
      clonedSvg.setAttribute('data-copyright', '© 2024-2026 Africalia. All Rights Reserved.');
      clonedSvg.setAttribute('data-doi', '10.5281/zenodo.10842918');

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

      const provenanceHeader = `<!--
  ============================================================================
  AFRICALIA CARTOGRAPHIC OBSERVATORY — VECTOR TOPOLOGY ARCHITECTURE
  Author & Cartographer: Zéluis F. Correia
  Copyright (c) 2024-2026 Africalia. All Rights Reserved.
  Coordinate Space: 5796 x 5867 High-Precision Vector Grid
  Derived Admin-1 Subdivisions & Hydrographic Coastline Calibrations
  DOI: 10.5281/zenodo.10842918 • Open Science Archive
  ============================================================================
-->\n`;
      if (!svgString.startsWith('<!--')) {
        svgString = provenanceHeader + svgString;
      }

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
          ? "relative w-full flex-1 flex flex-col select-none bg-zinc-50 dark:bg-zinc-950 p-2 sm:p-4 space-y-3"
          : "relative w-full rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 sm:p-4 shadow-2xl backdrop-blur-md space-y-3"
      }
    >
      {/* Unified Map Header & Controls Bar — Sticky & Fully Responsive with All Controls Visible */}
      <div 
        id="unified-africa-map-control-card" 
        className="sticky top-16 z-30 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-950/95 p-2 sm:p-2.5 shadow-sm backdrop-blur-md space-y-2 transition-all"
      >
        {/* Row 1: Brand, Map Mode Selector, UN Subregion Pills, Graticule/Cartouche, Admin-1/Inspector, Clean Power, Reserves, Flows */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Left: Brand + Mode Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <AfricaUnLogo
              variant="warm-tonal"
              fillOpacity={0.65}
              interactive={false}
              className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 text-amber-600/80 dark:text-amber-500/80 stroke-amber-700/80 dark:stroke-amber-400/80"
              strokeColor="currentColor"
              strokeWidth={1.4}
            />
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight whitespace-nowrap">
                  African Map
                </h3>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80">
                  {isFinalMode ? 'AUTHENTIC' : 'UN M49'}
                </span>
              </div>
            </div>

            {/* Mode Switcher Pill */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-0.5 rounded-xl relative shrink-0">
              <button
                type="button"
                onClick={() => handleSelectMode('authentic')}
                className={`relative px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 z-10 ${
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
                onClick={() => handleSelectMode('antique')}
                className={`relative px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 z-10 ${
                  mapMode === 'antique_parchment'
                    ? 'text-white font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Antique Parchment Cartography Map"
              >
                {mapMode === 'antique_parchment' && (
                  <motion.div
                    layoutId="activeMapModeHighlight"
                    className="absolute inset-0 bg-amber-800 rounded-lg shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Compass className="w-3 h-3 text-amber-500" />
                <span>Antique</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMode('choropleth')}
                className={`relative px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 z-10 ${
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
                onClick={() => handleSelectMode('bivariate')}
                className={`relative px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 z-10 ${
                  mapMode === 'bivariate'
                    ? 'text-white font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Bivariate 2D choropleth"
              >
                {mapMode === 'bivariate' && (
                  <motion.div
                    layoutId="activeMapModeHighlight"
                    className="absolute inset-0 bg-purple-600 rounded-lg shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Grid className="w-3 h-3" />
                <span>Bivariate</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMode('schematic')}
                className={`relative px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 z-10 ${
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
          </div>

          {/* UN Subregions Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            {SUBREGION_PILL_DEFS.map(pill => {
              const isAll = pill.id === 'All';
              const regionId = pill.id as AfricanRegion;
              const isVisible = isAll ? visibleRegions.size === 5 : visibleRegions.has(regionId);
              const isIsolated = !isAll && visibleRegions.size === 1 && visibleRegions.has(regionId);
              const isHovered = !isAll && activeRegionHover === regionId;

              return (
                <div
                  key={pill.id}
                  onMouseEnter={() => {
                    if (!isAll) setActiveRegionHover(regionId);
                  }}
                  onMouseLeave={() => {
                    if (!isAll) setActiveRegionHover(null);
                  }}
                  className={`group inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-semibold tracking-normal transition-all select-none border cursor-pointer shrink-0 ${
                    isAll
                      ? visibleRegions.size === 5
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-xs ring-1 ring-emerald-500/40 font-bold'
                        : 'bg-zinc-100/90 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
                      : isIsolated
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-xs ring-1 ' + pill.activeBorderColor + ' font-bold'
                        : isVisible
                          ? isHovered
                            ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-white border-zinc-300 dark:border-zinc-600 shadow-xs ring-1 ' + pill.activeBorderColor
                            : 'bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 border-zinc-200/90 dark:border-zinc-800 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/80 shadow-xs'
                          : 'bg-zinc-100/40 dark:bg-zinc-900/30 text-zinc-400 dark:text-zinc-500 border-zinc-200/50 dark:border-zinc-800/50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isAll) {
                        handleShowAllRegions();
                        handleResetZoom();
                      } else {
                        if (visibleRegions.size === 1 && visibleRegions.has(regionId)) {
                          handleShowAllRegions();
                          handleResetZoom();
                        } else {
                          handleIsolateRegion(regionId);
                          handleFocusRegion(regionId);
                        }
                      }
                    }}
                    className="flex items-center gap-1.5 cursor-pointer text-left focus:outline-none"
                    title={isAll ? 'Display all 54 African nations' : `Focus ${pill.fullName}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125 ${
                        isVisible ? 'ring-1 ring-white/40 shadow-xs' : 'opacity-40'
                      }`}
                      style={{ backgroundColor: pill.color }}
                    />
                    <span className="whitespace-nowrap font-bold text-[11px] sm:text-xs">
                      {pill.label}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded transition-colors ${
                        (isAll && visibleRegions.size === 5) || isIsolated
                          ? 'bg-white/20 text-current dark:bg-black/20'
                          : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {pill.count}
                    </span>
                  </button>

                  {!isAll && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRegion(regionId);
                      }}
                      className="p-0.5 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                      title={isVisible ? `Hide ${pill.label}` : `Show ${pill.label}`}
                      aria-label={isVisible ? `Hide ${pill.label}` : `Show ${pill.label}`}
                    >
                      {isVisible ? (
                        <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500" />
                      ) : (
                        <EyeOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-400 dark:text-zinc-600" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Unified Graticule & Cartouche Pill */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-0.5 rounded-xl shadow-2xs gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowGraticuleAndCompass(prev => !prev)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                showGraticuleAndCompass
                  ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800'
              }`}
              title="Toggle Graticule & Compass Rose"
            >
              <Grid className="w-3 h-3" />
              <span>Graticule ({showGraticuleAndCompass ? 'ON' : 'OFF'})</span>
            </button>

            {isFinalMode && (
              <button
                type="button"
                onClick={() => setShowCartouche(prev => !prev)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border-l border-zinc-200/70 dark:border-zinc-800 ${
                  showCartouche
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800'
                }`}
                title="Toggle Official Cartographic Cartouche & Scale Bar"
              >
                <Compass className="w-3 h-3 text-amber-500" />
                <span>Cartouche ({showCartouche ? 'ON' : 'OFF'})</span>
              </button>
            )}
          </div>

          {/* Admin-1 Subdivisions Layer Toggle */}
          {isFinalMode && (
            <button
              type="button"
              onClick={() => setShowAdmin1Borders(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all shadow-xs cursor-pointer shrink-0 ${
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

          {/* AKP Clean Energy & Dams Overlay Toggle */}
          {isFinalMode && (
            <button
              type="button"
              onClick={() => setShowPowerPlants(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all shadow-xs cursor-pointer shrink-0 ${
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all shadow-xs cursor-pointer shrink-0 ${
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all shadow-xs cursor-pointer shrink-0 ${
                showThematicOverlays
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-500/30'
                  : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="Toggle Animated Continental Corridors, Flow Pulses & Metropolitan Hubs"
            >
              <Activity className="w-3 h-3 text-cyan-500" />
              <span>Flows ({showThematicOverlays ? 'ON' : 'OFF'})</span>
            </button>
          )}

          {/* Unified Admin-1 Inspector & Thematic Layer Deck Pill (Right beside Flows button) */}
          {isFinalMode && (
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-0.5 rounded-xl shadow-2xs gap-0.5 shrink-0">
              <button
                id="btn-toggle-admin1-inspector-header"
                type="button"
                onClick={() => handleToggleUnifiedDeck('inspector')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  isUnifiedDeckOpen && (unifiedDeckTab === 'inspector' || unifiedDeckTab === 'both')
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800'
                }`}
                title="Toggle Admin-1 Subdivisions Inspector"
              >
                <MapPin className="w-3 h-3 text-emerald-500" />
                <span>Inspector</span>
                <span className={`text-[10px] font-mono px-1 py-0.2 rounded font-bold ${
                  isUnifiedDeckOpen && (unifiedDeckTab === 'inspector' || unifiedDeckTab === 'both')
                    ? 'bg-emerald-700/80 text-white'
                    : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                }`}>
                  {currentCountryAdmin1.length > 0 ? `${currentCountryAdmin1.length}` : '1,017'}
                </span>
              </button>

              <button
                id="btn-toggle-thematic-deck-header"
                type="button"
                onClick={() => handleToggleUnifiedDeck('deck')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border-l border-zinc-200/70 dark:border-zinc-800 ${
                  isUnifiedDeckOpen && (unifiedDeckTab === 'deck' || unifiedDeckTab === 'both')
                    ? 'bg-cyan-600 text-white shadow-xs font-bold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800'
                }`}
                title="Toggle Thematic Layers Deck"
              >
                <SlidersHorizontal className="w-3 h-3 text-cyan-500" />
                <span>Layer Deck</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                  isUnifiedDeckOpen && (unifiedDeckTab === 'deck' || unifiedDeckTab === 'both')
                    ? 'bg-cyan-700/80 text-white'
                    : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                }`}>
                  {thematicActiveCount}/9
                </span>
              </button>
            </div>
          )}

          {/* AKP Registry & Cartouche Buttons (Tonal Color Treatment, right beside unified pill) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsCatalogueModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
              title="Open AKP Data Registry & Geospatial Catalogue"
            >
              <Database className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              <span>AKP Registry</span>
            </button>

            <button
              type="button"
              onClick={() => setIsColophonOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
              title="Open Official Cartographic Cartouche, Geodesy Specs & Imprint"
            >
              <Compass className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Cartouche</span>
            </button>
          </div>
        </div>

        {/* Row 2: Regional Economic Blocs Selector, Citation DOI, Docked Zoom Controls & Export Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pt-1.5 border-t border-zinc-200/70 dark:border-zinc-800/70">
          {/* Left: Bloc selector & Research Citation */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Regional Economic Blocs Selector */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 px-2 py-1 rounded-xl text-xs shrink-0">
              <span className="text-[10px] font-bold text-zinc-500 mr-1">Bloc:</span>
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

            <button
              type="button"
              onClick={() => setIsCitationModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/25 text-[11px] font-semibold transition-all cursor-pointer shrink-0"
              title="Cite this Research Platform (DOI: 10.5281/zenodo.10842918)"
            >
              <Quote className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Cite (DOI)</span>
            </button>
          </div>

          {/* Right: Docked Zoom Controls & Export Pill */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            {/* Zoom Controls Pill */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-0.5 rounded-xl shadow-2xs">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(0.7, Number((prev - 0.25).toFixed(2))))}
                className="p-1 rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all cursor-pointer"
                title="Zoom Out (–)"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 px-1.5 min-w-[2.75rem] text-center select-none">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(4.0, Number((prev + 0.25).toFixed(2))))}
                className="p-1 rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all cursor-pointer"
                title="Zoom In (+)"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1 ml-0.5 rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all cursor-pointer border-l border-zinc-200/70 dark:border-zinc-800"
                title="Reset View (100%)"
                aria-label="Reset View"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Export Dropdown Menu Pill */}
            <div className="relative" ref={exportMenuRef}>
              <button
                type="button"
                onClick={() => setIsExportMenuOpen(prev => !prev)}
                disabled={isExporting || isExportingSvg}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-[11px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                title="Export High-Resolution Vector/Raster Map"
              >
                {isExporting || isExportingSvg ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Download className="w-3 h-3" />
                )}
                <span>{exportSuccess || exportSvgSuccess ? 'Exported!' : 'Export'}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {/* Export Dropdown Menu */}
              {isExportMenuOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      handleDownloadPng();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileImage className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      PNG Image (2x HD)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      handleDownloadSvg();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      Scalable SVG Vector
                    </span>
                  </button>
                </div>
              )}
            </div>
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

          {mapMode === 'choropleth' && (
            <ChoroplethTimelineScrubber
              key="choropleth-timeline-scrubber"
              currentYear={choroplethYear}
              onYearChange={(yr) => setChoroplethYear(yr)}
              isPlaying={isPlayingChoroplethTimeline}
              onTogglePlay={() => setIsPlayingChoroplethTimeline(!isPlayingChoroplethTimeline)}
              metricName={currentMetricDef.label}
              metricUnit={currentMetricDef.unit}
              continentalMean={continentalMean}
            />
          )}

          {mapMode === 'bivariate' && (
            <BivariateMapTray
              key="bivariate-sliding-tray"
              activePresetId={selectedBivariatePresetId}
              onSelectPreset={(id) => setSelectedBivariatePresetId(id)}
              hoveredCell={hoveredBivariateCell}
              onHoverCell={(cell) => setHoveredBivariateCell(cell)}
              cellCounts={bivariateData.cellCounts}
              thresholds={bivariateThresholds}
              onThresholdsChange={(t) => setBivariateThresholds(t)}
              cutoffs={bivariateData.cutoffs}
            />
          )}
        </AnimatePresence>
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
            ? "relative w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs p-2 sm:p-4 min-h-[720px] aspect-[890/985]"
            : "relative w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner p-[6px] aspect-[890/985] max-h-[85vh] min-h-[440px]"
        }
      >
        {/* Sophisticated Combined 2-Column Sliding Panel: Admin-1 Inspector + Thematic Layers Deck */}
        <AnimatePresence>
          {(isUnifiedDeckOpen || isAdmin1InspectorOpen) && (
            <motion.div
              id="unified-cartographic-deck-panel"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.5 }}
              className="absolute top-3 right-3 sm:right-4 z-40 w-auto min-w-[320px] sm:min-w-[540px] md:min-w-[760px] lg:min-w-[960px] max-w-[calc(100vw-24px)] rounded-3xl bg-white/95 dark:bg-zinc-950/95 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[82vh]"
            >
              {/* Header with Title, Section Tabs & Close Control */}
              <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/60 gap-2 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 shrink-0">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-serif tracking-tight truncate">
                        Cartographic Intelligence Deck
                      </h3>
                    </div>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono truncate">
                      Admin-1 Topology &amp; Thematic Multi-Layer Overlays
                    </p>
                  </div>
                </div>

                {/* Section Tabs & Close */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-800/80 p-0.5 rounded-xl border border-zinc-300/60 dark:border-zinc-700/60">
                    <button
                      type="button"
                      onClick={() => {
                        setUnifiedDeckTab('inspector');
                        setIsUnifiedDeckOpen(true);
                        setIsAdmin1InspectorOpen(true);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        unifiedDeckTab === 'inspector'
                          ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                      title="Admin-1 Subdivisions Inspector"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="hidden sm:inline">Admin-1</span>
                      <span>Inspector</span>
                      <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                        {currentCountryAdmin1.length > 0 ? `${currentCountryAdmin1.length}` : '1,017'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUnifiedDeckTab('deck');
                        setIsUnifiedDeckOpen(true);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        unifiedDeckTab === 'deck'
                          ? 'bg-white dark:bg-zinc-900 text-cyan-700 dark:text-cyan-300 shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                      title="Thematic Layers Deck"
                    >
                      <Layers className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="hidden sm:inline">Thematic</span>
                      <span>Layers</span>
                      <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-200 font-bold">
                        {thematicActiveCount}/9
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUnifiedDeckTab('both');
                        setIsUnifiedDeckOpen(true);
                      }}
                      className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        unifiedDeckTab === 'both'
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                      title="2-Column Split View (Both Inspector &amp; Layers)"
                    >
                      <Columns className="w-3.5 h-3.5 text-amber-500" />
                      <span>2-Column</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUnifiedDeckOpen(false);
                      setIsAdmin1InspectorOpen(false);
                    }}
                    className="p-1.5 rounded-xl hover:bg-zinc-200/70 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    title="Close Deck"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Panel Content: 2-Column or Single Tab */}
              <div className={`overflow-y-auto flex-1 ${
                unifiedDeckTab === 'both'
                  ? 'grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200/80 dark:divide-zinc-800/80'
                  : 'flex flex-col'
              }`}>
                {/* Column 1: Admin-1 Subdivisions Inspector */}
                {(unifiedDeckTab === 'both' || unifiedDeckTab === 'inspector') && (
                  <div className="flex flex-col min-w-0">
                    <div className="p-2.5 sm:p-3 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/40">
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
                        <span className="truncate mr-2">
                          {selectedEntityId ? (AFRICA_FINAL_MAP[selectedEntityId]?.name || selectedEntityId) : 'All African Territories'}
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                          {filteredAdmin1List.length} subdivision{filteredAdmin1List.length === 1 ? '' : 's'}
                        </span>
                      </div>
                    </div>

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

                {/* Column 2: Thematic Layer Deck */}
                {(unifiedDeckTab === 'both' || unifiedDeckTab === 'deck') && (
                  <div className="flex flex-col min-w-0 p-3 sm:p-4 bg-zinc-50/50 dark:bg-zinc-900/30">
                    <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                          Cartographic Overlays
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleSetAllLayers(true);
                            setShowPowerPlants(true);
                            setShowProtectedAreas(true);
                          }}
                          className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 underline cursor-pointer"
                        >
                          All On
                        </button>
                        <span className="text-zinc-300 dark:text-zinc-700">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            handleSetAllLayers(false);
                            setShowPowerPlants(false);
                            setShowProtectedAreas(false);
                          }}
                          className="text-[10px] font-mono font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 underline cursor-pointer"
                        >
                          All Off
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 overflow-y-auto max-h-[50vh] pr-0.5">
                      {thematicDeckItems.map((item) => {
                        const active = Boolean(layerVisibility[item.key]);
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.key}
                            onClick={() => handleToggleLayer(item.key)}
                            className={`flex items-center justify-between p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                              active
                                ? 'bg-cyan-50/70 dark:bg-cyan-950/30 border-cyan-500/40 text-zinc-900 dark:text-zinc-100 shadow-xs'
                                : 'bg-white/60 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 opacity-70 hover:opacity-100 text-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}40` }}
                              >
                                <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1.5">
                                  {item.label}
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                    {item.count}
                                  </span>
                                </div>
                                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{item.badge}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              {active ? (
                                <div className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-xs">
                                  <Check className="w-3 h-3" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center justify-center">
                                  <EyeOff className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                      <button
                        type="button"
                        onClick={() => setIsCatalogueModalOpen(true)}
                        className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Database className="w-3 h-3" />
                        <span>AKP Registry Modal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUnifiedDeckOpen(false);
                          setIsAdmin1InspectorOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-[10px] font-bold cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <svg
          ref={svgRef}
          viewBox={AFRICA_FINAL_VIEWBOX}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          data-author="Zéluis F. Correia"
          data-curator="Africalia"
          data-copyright="© 2024-2026 Africalia. All Rights Reserved."
          data-doi="10.5281/zenodo.10842918"
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
              <stop offset="0%" stopColor={mapMode === 'antique_parchment' ? '#F9F5EB' : '#f8fafc'} stopOpacity="1" />
              <stop offset="100%" stopColor={mapMode === 'antique_parchment' ? '#EFE5D3' : '#f1f5f9'} stopOpacity="1" />
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
                showCartouche={showCartouche}
                activeMetricName={currentMetricDef?.label || activeMetric}
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
                onOpenColophonModal={() => setIsColophonOpen(true)}
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

        {/* Top-Docked Unified Tactical Inspector Drawer (Parchment / Editorial Light Theme) */}
        {activeTooltipEntityId && (
          <UnifiedInspectorDrawer
            entityId={activeTooltipEntityId}
            isOpen={true}
            onClose={() => {
              setActiveTooltipEntityId(null);
              setFixedTooltipCoords(null);
            }}
            onOpenDossier={(id) => {
              handleSelectCountry(id);
              setActiveTooltipEntityId(null);
            }}
            selectedAdmin1={selectedAdmin1}
            hoveredAdmin1={hoveredAdmin1}
          />
        )}

        {/* Lightweight Floating Preview Card for Unpinned Hover State */}
        {!activeTooltipEntityId && displayEntityId && hoveredCountryData && hoveredEntity && !hoveredAkpNode && !hoveredThematicItem && !selectedThematicItem && (
          <div
            id="pinned-country-tooltip"
            style={{
              left: `${getTooltipPosition().left}px`,
              top: `${getTooltipPosition().top}px`,
            }}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
            className="absolute z-30 pointer-events-auto w-80 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-150 animate-in fade-in zoom-in-95 bg-white/95 dark:bg-zinc-950/95 border-zinc-200 dark:border-zinc-800"
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

            {/* Choropleth Metric Display for Current Horizon Year */}
            {mapMode === 'choropleth' && metricValues[hoveredEntity.id] !== undefined && (
              <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800/80 mb-2.5">
                <span className="font-semibold text-emerald-900 dark:text-emerald-200 text-[11px] truncate max-w-[150px]">
                  {currentMetricDef.label} ({choroplethYear}):
                </span>
                <span className="font-mono font-bold font-tabular text-emerald-700 dark:text-emerald-300 text-[11px]">
                  {metricValues[hoveredEntity.id].toLocaleString(undefined, { maximumFractionDigits: 1 })} {currentMetricDef.unit}
                </span>
              </div>
            )}

            {/* Bivariate Quadrant Positioning if active */}
            {mapMode === 'bivariate' && bivariateData.countryCoords[hoveredEntity.id] && (() => {
              const coord = bivariateData.countryCoords[hoveredEntity.id];
              const xTier = coord.x === 0 ? 'Low' : coord.x === 1 ? 'Mid' : 'High';
              const yTier = coord.y === 0 ? 'Low' : coord.y === 1 ? 'Mid' : 'High';
              return (
                <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/80 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span className="font-semibold text-purple-900 dark:text-purple-200 text-[11px]">Bivariate:</span>
                  </div>
                  <span className="font-mono font-bold text-purple-700 dark:text-purple-300 text-[11px]">
                    {activeBivariatePreset.labelX} [{xTier}] × {activeBivariatePreset.labelY} [{yTier}]
                  </span>
                </div>
              );
            })()}

            {/* CTA Button to Open Full Country Dossier */}
            <button
              onClick={() => {
                handleSelectCountry(hoveredEntity.id);
                setActiveTooltipEntityId(null);
              }}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Inspect Country Details</span>
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

      {/* Cartographic Colophon, Geodesy & Official Imprint Modal */}
      <CartographicColophonModal
        isOpen={isColophonOpen}
        onClose={() => setIsColophonOpen(false)}
        onOpenCitationModal={() => setIsCitationModalOpen(true)}
      />

      {/* Academic Citation & Platform Reference Modal */}
      <AcademicExportModal
        isOpen={isCitationModalOpen}
        onClose={() => setIsCitationModalOpen(false)}
        title="Africa Data Atlas & Cartographic Observatory"
        sourceContext="High-Precision Continental Vector Cartography (5,796 × 5,867 Grid)"
      />
    </div>
  );
};
