import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HistoricalMapPlate, 
  PreColonialEntity, 
  PRE_COLONIAL_ENTITIES,
  HISTORICAL_MAP_PLATES 
} from '../../data/archivalCartographyData';
import { 
  SlidersHorizontal, 
  Columns2, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
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
  X,
  PanelRightClose,
  PanelRightOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Move,
  Wind,
  Globe2,
  Calendar,
  ArrowRight,
  Link2,
  Unlink2,
  Share2,
  Clock,
  History,
  Maximize2
} from 'lucide-react';
import { AfricaMapFinalLayer } from '../AfricaMapFinalLayer';
import { AfricanRegion } from '../../data/types';
import { useAfricaFinalMap } from '../../utils/svgMapLoader';
import { getRegionTonalPalette } from '../../data/unGeoschemeColors';
import { AFRICA_FINAL_VIEWBOX, AFRICA_FINAL_TRANSFORM } from '../../data/africaFinalGeometry';
import { getCanonicalCountryColor } from '../../data/africaCanonicalColorPalette';
import { AntiquePlateCanvas } from './AntiquePlateCanvas';
import { KingdomRichBottomPanel } from './KingdomRichBottomPanel';
import { KingdomDynasticTreeModal } from './KingdomDynasticTreeModal';
import { KingdomArtifact3DViewerModal } from './KingdomArtifact3DViewerModal';
import { TradeCorridorParticleCanvas } from './TradeCorridorParticleCanvas';
import { ToponymConcordanceModal } from './ToponymConcordanceModal';
import { DETAILED_KINGDOMS_DATA, ToponymConcordanceItem } from '../../data/preColonialKingdomsDetailed';

interface ToponymLocation {
  x: number;
  y: number;
  zoom: number;
  note: string;
}

const TOPONYM_LOCATIONS: Record<string, ToponymLocation> = {
  "Mountains of the Moon": { x: -280, y: -220, zoom: 2.2, note: "Legendary Ptolemaic equatorial lunar range reputed as the source of the White Nile." },
  "Kingdom of Nubia": { x: -480, y: 650, zoom: 2.2, note: "Ancient Nile kingdoms of Kush, Dongola, and Christian Nubia along the Upper Nile." },
  "Barbary": { x: -200, y: 850, zoom: 2.0, note: "North African Mediterranean littoral (Maghreb and Ottoman Regencies)." },
  "Barbarie": { x: -200, y: 850, zoom: 2.0, note: "North African Mediterranean littoral (Maghreb and Ottoman Regencies)." },
  "Barbaria": { x: -200, y: 850, zoom: 2.0, note: "North African Mediterranean littoral (Maghreb and Ottoman Regencies)." },
  "Barbary States": { x: -200, y: 850, zoom: 2.0, note: "North African Mediterranean littoral (Maghreb and Ottoman Regencies)." },
  "Congo": { x: 200, y: -260, zoom: 2.2, note: "Sovereign Kingdom of Kongo and the vast equatorial Congo river basin." },
  "Royaume de Congo": { x: 200, y: -260, zoom: 2.2, note: "Sovereign Kingdom of Kongo (Kongo dya Ntotila) on the Atlantic coast." },
  "Congo Regnum": { x: 200, y: -260, zoom: 2.2, note: "Sovereign Kingdom of Kongo (Kongo dya Ntotila) on the Atlantic coast." },
  "Congo Free State": { x: 200, y: -260, zoom: 2.2, note: "Late 19th-century colonial territory encompassing the Congo River basin." },
  "Monomotapa": { x: -550, y: -750, zoom: 2.3, note: "Mutapa Empire and gold-bearing plateau between the Zambezi and Limpopo." },
  "Monomotapa Regnum": { x: -550, y: -750, zoom: 2.3, note: "Mutapa Empire and gold-bearing plateau between the Zambezi and Limpopo." },
  "Caput Bonae Spei": { x: -200, y: -1100, zoom: 2.2, note: "Cape of Good Hope and Table Bay maritime navigation point." },
  "Cape of Good Hope": { x: -200, y: -1100, zoom: 2.2, note: "Cape of Good Hope and Table Bay maritime navigation point." },
  "Cap de Bonne-Espérance": { x: -200, y: -1100, zoom: 2.2, note: "Cape of Good Hope and Table Bay maritime navigation point." },
  "Cape Colony": { x: -200, y: -1100, zoom: 2.2, note: "Southern tip of the continent and Table Bay anchorage." },
  "The Hottentots": { x: -200, y: -1100, zoom: 2.2, note: "Historical designation for indigenous Khoekhoe pastoralists of Southern Africa." },
  "Guinée": { x: 550, y: 150, zoom: 2.1, note: "West African Upper and Lower Guinea coastlines and river kingdoms." },
  "Guinea": { x: 550, y: 150, zoom: 2.1, note: "West African Upper and Lower Guinea coastlines and river kingdoms." },
  "Guineae Pars": { x: 550, y: 150, zoom: 2.1, note: "West African Upper and Lower Guinea coastlines and river kingdoms." },
  "Guineae Nova Descriptio": { x: 550, y: 150, zoom: 2.1, note: "Detailed 17th-century coastal charting of West African trading forts." },
  "Haute Guinée": { x: 550, y: 150, zoom: 2.1, note: "Upper Guinea coast and forested interior polities." },
  "Guinea-Küste": { x: 550, y: 150, zoom: 2.1, note: "West African maritime Guinea coast." },
  "Côte de l'Or": { x: 550, y: 120, zoom: 2.3, note: "Gold Coast (modern Ghana) and coastal Akan trading forts." },
  "Côte des Esclaves": { x: 420, y: 100, zoom: 2.3, note: "Bight of Benin coastal trade embouchures." },
  "Royaume de Juda": { x: 420, y: 100, zoom: 2.4, note: "Kingdom of Whydah (Ouidah) along the Bight of Benin." },
  "Abyssinie": { x: -750, y: 280, zoom: 2.2, note: "Ethiopian Highlands and historic Solomonic Empire / Kingdom of Aksum." },
  "Abissinia": { x: -750, y: 280, zoom: 2.2, note: "Ethiopian Highlands and historic Solomonic Empire / Kingdom of Aksum." },
  "Habeşistan (Abyssinia)": { x: -750, y: 280, zoom: 2.2, note: "Ottoman designation for the historic Abyssinian Empire in the Horn of Africa." },
  "Trablusgarp (Tripoli)": { x: -250, y: 750, zoom: 2.2, note: "Ottoman Eyalet and Vilayet of Tripoli along the Libyan Mediterranean coast." },
  "Mısır (Egypt)": { x: -650, y: 780, zoom: 2.2, note: "Khedivate of Egypt and Lower Nile river delta." },
  "Egypt": { x: -650, y: 780, zoom: 2.2, note: "Lower Nile Valley, Cairo, and Red Sea trading ports." },
  "Aegyptus": { x: -650, y: 780, zoom: 2.2, note: "Lower Nile Valley and Delta recorded in classical Latin." },
  "Sahara": { x: 0, y: 550, zoom: 2.0, note: "Great Sahara Desert and trans-Saharan camel caravan trade routes." },
  "Sahara Desert": { x: 0, y: 550, zoom: 2.0, note: "Great Sahara Desert and trans-Saharan camel caravan trade routes." },
  "Zaara or Desert": { x: 0, y: 550, zoom: 2.0, note: "Emanuel Bowen's 18th-century recording of the Sahara Desert expanse." },
  "Soudan": { x: 150, y: 250, zoom: 2.0, note: "Bilad al-Sudan / Sahelian grassland belt spanning from Senegal to Chad." },
  "Sudan": { x: 150, y: 250, zoom: 2.0, note: "Sahelian savanna belt connecting West Africa to the Nile basin." },
  "Nigritia": { x: 200, y: 300, zoom: 2.0, note: "17th-century European cartographic designation for the Niger River basin and Sahel." },
  "Negroland": { x: 200, y: 300, zoom: 2.0, note: "18th-century British map term for the interior Sahel and savanna nations." },
  "Timbuktu": { x: 450, y: 380, zoom: 2.4, note: "Historic trans-Saharan scholastic and gold/salt entrepôt on the Niger River bend." },
  "Biafara Regnum": { x: 100, y: 80, zoom: 2.3, note: "Legendary Biafara kingdom inland from the Bight of Biafra." },
  "Zanguebar": { x: -800, y: -300, zoom: 2.2, note: "Swahili Coast maritime trade corridor from Mogadishu to Sofala." },
  "Zanzibar": { x: -800, y: -300, zoom: 2.3, note: "Sultanate of Zanzibar and Indian Ocean spice & clove trade hub." },
  "Nil Nehri": { x: -600, y: 500, zoom: 2.2, note: "The Nile River system flowing north from Lake Victoria and the Ethiopian Highlands." },
  "Afrika Kıtası": { x: 0, y: 0, zoom: 1.0, note: "Pan-African continental overview in Ottoman Turkish cartography." },
  "大沙漠 (Great Desert)": { x: 0, y: 550, zoom: 2.0, note: "The Sahara Desert designated in historical Japanese kanji." },
  "泥児利亜 (Nigeria)": { x: 300, y: 150, zoom: 2.2, note: "Early phonetic kanji representation for Nigeria / Niger basin." },
  "喜望峰 (Cape of Good Hope)": { x: -200, y: -1100, zoom: 2.2, note: "Cape of Good Hope rendered in traditional Japanese characters." },
  "エギプト (Egypt)": { x: -650, y: 780, zoom: 2.2, note: "Egypt and Nile valley documented in early katakana." },
  "未詳地 (Unexplored Region)": { x: -50, y: -150, zoom: 2.2, note: "Central African deep interior marked as uncharted terra incognita." }
};

interface PreColonialEraSpan {
  id: string;
  start: number;
  end: number;
}

const KINGDOM_CHRONOLOGY: Record<string, PreColonialEraSpan> = {
  'axum-empire': { id: 'axum-empire', start: 100, end: 940 },
  'kanem-bornu': { id: 'kanem-bornu', start: 700, end: 1900 },
  'benin-kingdom': { id: 'benin-kingdom', start: 1180, end: 1897 },
  'great-zimbabwe': { id: 'great-zimbabwe', start: 1220, end: 1450 },
  'mali-empire': { id: 'mali-empire', start: 1235, end: 1670 },
  'oyo-empire': { id: 'oyo-empire', start: 1300, end: 1896 },
  'kongo-kingdom': { id: 'kongo-kingdom', start: 1390, end: 1914 },
  'songhai-empire': { id: 'songhai-empire', start: 1464, end: 1591 },
  'dahomey-kingdom': { id: 'dahomey-kingdom', start: 1600, end: 1904 },
  'ashanti-empire': { id: 'ashanti-empire', start: 1701, end: 1957 },
};

const CHRONOLOGY_MILESTONES: { year: number; title: string; desc: string }[] = [
  { year: 350, title: "Aksumite Golden Age", desc: "King Ezana expands trade across the Red Sea and adopts coinage." },
  { year: 800, title: "Rise of Kanem-Bornu", desc: "Duguwa dynasty consolidates trans-Saharan Lake Chad trade." },
  { year: 1250, title: "Sundiata Keita & Mali", desc: "Kouroukan Fouga charter and unification of the Manden empire." },
  { year: 1324, title: "Mansa Musa & Great Zimbabwe", desc: "Legendary Hajj pilgrimage and dry-stone Great Enclosure masonry." },
  { year: 1490, title: "Songhai & Kingdom of Kongo", desc: "Askia Muhammad's scholastic empire and early Kongo-Lisbon diplomacy." },
  { year: 1650, title: "Oyo & Benin Flowering", desc: "Yoruba cavalry supremacy and zenith of royal lost-wax bronze casting." },
  { year: 1701, title: "Golden Stool of Ashanti", desc: "Osei Tutu I unifies the Ashanti Kingdom; Dahomey palace militarization." },
  { year: 1850, title: "Late Pre-Colonial Era", desc: "Vibrant coastal kingdoms prior to the 1884–1885 Berlin Conference." }
];

const KINGDOM_SPATIAL_COORDINATES: Record<string, { zoom: number; panOffset: { x: number; y: number } }> = {
  'axum-empire': { zoom: 2.2, panOffset: { x: -750, y: 280 } },
  'kanem-bornu': { zoom: 2.2, panOffset: { x: -100, y: 300 } },
  'benin-kingdom': { zoom: 2.3, panOffset: { x: 380, y: 80 } },
  'great-zimbabwe': { zoom: 2.3, panOffset: { x: -550, y: -750 } },
  'mali-empire': { zoom: 2.2, panOffset: { x: 750, y: 250 } },
  'oyo-empire': { zoom: 2.3, panOffset: { x: 420, y: 120 } },
  'kongo-kingdom': { zoom: 2.2, panOffset: { x: 100, y: -280 } },
  'songhai-empire': { zoom: 2.2, panOffset: { x: 500, y: 400 } },
  'dahomey-kingdom': { zoom: 2.4, panOffset: { x: 480, y: 120 } },
  'ashanti-empire': { zoom: 2.3, panOffset: { x: 580, y: 100 } }
};

interface HistoricalMapCurtainViewerProps {
  selectedPlate: HistoricalMapPlate;
  onSelectPlate?: (plate: HistoricalMapPlate) => void;
  onSelectPreColonialEntity?: (entity: PreColonialEntity) => void;
  activeWorkbenchTab?: 'curtain' | 'streamlines' | 'kingdoms';
  onSelectWorkbenchTab?: (tab: 'curtain' | 'streamlines' | 'kingdoms') => void;
  focusedEntity?: PreColonialEntity | null;
  onClearFocusedEntity?: () => void;
  onNavigateToCountry?: (iso3: string) => void;
}

type ComparisonMode = 'curtain' | 'opacity' | 'sideBySide';
type BorderVibrancy = 'vibrant' | 'balanced' | 'subdued' | 'contrast';

export const HistoricalMapCurtainViewer: React.FC<HistoricalMapCurtainViewerProps> = ({
  selectedPlate,
  onSelectPlate,
  onSelectPreColonialEntity,
  activeWorkbenchTab = 'curtain',
  onSelectWorkbenchTab,
  focusedEntity,
  onClearFocusedEntity,
  onNavigateToCountry
}) => {
  const { mapData } = useAfricaFinalMap();

  // Mode & Controls state
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('curtain');
  const [curtainPosition, setCurtainPosition] = useState<number>(50); // percentage (0 - 100)
  const [opacityLevel, setOpacityLevel] = useState<number>(65); // percentage (0 - 100)
  const [borderVibrancy, setBorderVibrancy] = useState<BorderVibrancy>('vibrant');
  
  // High-precision Zoom & Pan state (supporting synchronized dual-pane in sideBySide as well as curtain/opacity)
  const [zoomLevel, setZoomLevel] = useState<number>(1.0); // 100% uncropped full continent view
  const [plateZoom, setPlateZoom] = useState<number>(1.0);
  const [vectorZoom, setVectorZoom] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [platePanOffset, setPlatePanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [vectorPanOffset, setVectorPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingPan, setIsDraggingPan] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSyncedPanZoom, setIsSyncedPanZoom] = useState<boolean>(true);
  const [activePanTarget, setActivePanTarget] = useState<'both' | 'plate' | 'vector'>('both');

  // Overlays & Panels state
  const [showPreColonialKingdoms, setShowPreColonialKingdoms] = useState<boolean>(true);
  const [showKingdomTerritoryPolygons, setShowKingdomTerritoryPolygons] = useState<boolean>(true);
  const [showTradeCorridors, setShowTradeCorridors] = useState<boolean>(true);
  const [activeCommodityFilter, setActiveCommodityFilter] = useState<string>('all');
  const [showModernBorders, setShowModernBorders] = useState<boolean>(true);
  const [showGraticules, setShowGraticules] = useState<boolean>(true);
  const [selectedEntity, setSelectedEntity] = useState<PreColonialEntity | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<PreColonialEntity | null>(null);

  // Modal dialog states
  const [isDynasticTreeOpen, setIsDynasticTreeOpen] = useState<boolean>(false);
  const [isArtifact3DOpen, setIsArtifact3DOpen] = useState<boolean>(false);
  const [isToponymConcordanceOpen, setIsToponymConcordanceOpen] = useState<boolean>(false);
  const [activeArtifactId, setActiveArtifactId] = useState<string | undefined>(undefined);

  // Chronology Scrubber state for Pre-Colonial Kingdoms
  const [selectedChronologyYear, setSelectedChronologyYear] = useState<number | null>(null);
  const [isChronologyOpen, setIsChronologyOpen] = useState<boolean>(false);
  const [dimInactiveKingdoms, setDimInactiveKingdoms] = useState<boolean>(true);

  // Toponym Spatial Callout state
  const [activeToponymFocus, setActiveToponymFocus] = useState<{ name: string; note: string } | null>(null);

  // Deep link sharing state
  const [copiedDeepLink, setCopiedDeepLink] = useState<boolean>(false);

  // Vector map country hover in side-by-side
  const [hoveredCountryInfo, setHoveredCountryInfo] = useState<{ name: string; region: string } | null>(null);

  // Immersive layout state
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(true);
  const [isFilmstripOpen, setIsFilmstripOpen] = useState<boolean>(true);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const filmstripScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingCurtainRef = useRef<boolean>(false);

  // Reset viewport upon new plate selection to 100% full uncropped view
  useEffect(() => {
    setZoomLevel(1.0);
    setPlateZoom(1.0);
    setVectorZoom(1.0);
    setPanOffset({ x: 0, y: 0 });
    setPlatePanOffset({ x: 0, y: 0 });
    setVectorPanOffset({ x: 0, y: 0 });
    setActiveToponymFocus(null);
  }, [selectedPlate.id]);

  // Deep-linking hash parsing on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash.startsWith('cartography') || hash.startsWith('archival-cartography')) {
      const params = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
      const modeParam = params.get('mode');
      if (modeParam === 'curtain' || modeParam === 'opacity' || modeParam === 'sideBySide') {
        setComparisonMode(modeParam);
      }
      const kingdomParam = params.get('kingdom');
      if (kingdomParam) {
        const found = PRE_COLONIAL_ENTITIES.find(e => e.id === kingdomParam);
        if (found) {
          setSelectedEntity(found);
          setIsDossierOpen(true);
        }
      }
      const yearParam = params.get('year');
      if (yearParam && !isNaN(Number(yearParam))) {
        setSelectedChronologyYear(Number(yearParam));
        setIsChronologyOpen(true);
      }
    }
  }, []);

  // Sync state to URL hash query parameters
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (selectedPlate.id !== HISTORICAL_MAP_PLATES[0].id) {
      params.set('plate', selectedPlate.id);
    }
    if (comparisonMode !== 'curtain') {
      params.set('mode', comparisonMode);
    }
    if (selectedEntity) {
      params.set('kingdom', selectedEntity.id);
    }
    if (selectedChronologyYear !== null) {
      params.set('year', String(selectedChronologyYear));
    }
    const query = params.toString();
    const targetHash = query ? `archival-cartography?${query}` : 'archival-cartography';
    const currentHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (currentHash !== targetHash) {
      window.history.replaceState(null, '', `#${targetHash}`);
    }
  }, [selectedPlate.id, comparisonMode, selectedEntity, selectedChronologyYear]);

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

  // Zoom Pane function (supports both synchronized and independent zoom)
  const zoomPane = useCallback((target: 'both' | 'plate' | 'vector', delta: number) => {
    if (target === 'both' || isSyncedPanZoom) {
      setZoomLevel(prev => {
        const next = Math.max(0.6, Math.min(4.0, Number((prev + delta).toFixed(2))));
        setPlateZoom(next);
        setVectorZoom(next);
        if (next === 1.0) {
          setPanOffset({ x: 0, y: 0 });
          setPlatePanOffset({ x: 0, y: 0 });
          setVectorPanOffset({ x: 0, y: 0 });
        }
        return next;
      });
    } else if (target === 'plate') {
      setPlateZoom(prev => {
        const next = Math.max(0.6, Math.min(4.0, Number((prev + delta).toFixed(2))));
        if (next === 1.0) setPlatePanOffset({ x: 0, y: 0 });
        return next;
      });
    } else if (target === 'vector') {
      setVectorZoom(prev => {
        const next = Math.max(0.6, Math.min(4.0, Number((prev + delta).toFixed(2))));
        if (next === 1.0) setVectorPanOffset({ x: 0, y: 0 });
        return next;
      });
    }
  }, [isSyncedPanZoom]);

  const resetPane = useCallback((target: 'both' | 'plate' | 'vector') => {
    if (target === 'both' || isSyncedPanZoom) {
      setZoomLevel(1.0);
      setPlateZoom(1.0);
      setVectorZoom(1.0);
      setPanOffset({ x: 0, y: 0 });
      setPlatePanOffset({ x: 0, y: 0 });
      setVectorPanOffset({ x: 0, y: 0 });
      setActiveToponymFocus(null);
    } else if (target === 'plate') {
      setPlateZoom(1.0);
      setPlatePanOffset({ x: 0, y: 0 });
    } else if (target === 'vector') {
      setVectorZoom(1.0);
      setVectorPanOffset({ x: 0, y: 0 });
    }
  }, [isSyncedPanZoom]);

  const nudgePan = useCallback((dx: number, dy: number, target: 'both' | 'plate' | 'vector' = 'both') => {
    if (target === 'both' || isSyncedPanZoom) {
      setPanOffset(p => ({ x: p.x + dx, y: p.y + dy }));
      setPlatePanOffset(p => ({ x: p.x + dx, y: p.y + dy }));
      setVectorPanOffset(p => ({ x: p.x + dx, y: p.y + dy }));
    } else if (target === 'plate') {
      setPlatePanOffset(p => ({ x: p.x + dx, y: p.y + dy }));
    } else if (target === 'vector') {
      setVectorPanOffset(p => ({ x: p.x + dx, y: p.y + dy }));
    }
  }, [isSyncedPanZoom]);

  // Wheel zoom handler across all viewport modes
  const handleWheelZoom = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    zoomPane('both', delta);
  }, [zoomPane]);

  // Wheel zoom handler per individual pane in side-by-side mode
  const handlePaneWheel = useCallback((e: React.WheelEvent, target: 'both' | 'plate' | 'vector') => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    zoomPane(target, delta);
  }, [zoomPane]);

  // Pointer drag pan handlers using PointerCapture for seamless dragging across all browsers and devices
  const handlePointerDownPan = (
    e: React.PointerEvent<HTMLDivElement>,
    target: 'both' | 'plate' | 'vector' = 'both'
  ) => {
    if (e.button !== 0) return; // Only primary mouse button or touch
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    setIsDraggingPan(true);
    setActivePanTarget(target);

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (target === 'plate' && !isSyncedPanZoom) {
      setDragStart({ x: clientX - platePanOffset.x, y: clientY - platePanOffset.y });
    } else if (target === 'vector' && !isSyncedPanZoom) {
      setDragStart({ x: clientX - vectorPanOffset.x, y: clientY - vectorPanOffset.y });
    } else {
      setDragStart({ x: clientX - panOffset.x, y: clientY - panOffset.y });
    }
  };

  const handlePointerMovePan = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingPan) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;

    if (activePanTarget === 'plate' && !isSyncedPanZoom) {
      setPlatePanOffset({ x: newX, y: newY });
    } else if (activePanTarget === 'vector' && !isSyncedPanZoom) {
      setVectorPanOffset({ x: newX, y: newY });
    } else {
      setPanOffset({ x: newX, y: newY });
      if (isSyncedPanZoom) {
        setPlatePanOffset({ x: newX, y: newY });
        setVectorPanOffset({ x: newX, y: newY });
      }
    }
  };

  const handlePointerUpPan = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingPan) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      setIsDraggingPan(false);
    }
  };

  // Toponym spatial focus handler
  const handleFocusToponym = (toponymName: string) => {
    const cleanName = toponymName.replace(/["'()]/g, '').trim();
    const match = TOPONYM_LOCATIONS[toponymName] || 
      Object.entries(TOPONYM_LOCATIONS).find(([k]) => cleanName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(cleanName.toLowerCase()))?.[1];

    if (match) {
      setZoomLevel(match.zoom);
      setPlateZoom(match.zoom);
      setVectorZoom(match.zoom);
      setPanOffset({ x: match.x, y: match.y });
      setPlatePanOffset({ x: match.x, y: match.y });
      setVectorPanOffset({ x: match.x, y: match.y });
      setActiveToponymFocus({ name: toponymName, note: match.note });
    } else {
      setZoomLevel(1.85);
      setPlateZoom(1.85);
      setVectorZoom(1.85);
      setActiveToponymFocus({ name: toponymName, note: `Historic territory or maritime landmark observed on ${selectedPlate.title}.` });
    }
  };

  // Pre-colonial kingdom spatial focus and centering handler
  const focusOnEntity = useCallback((entity: PreColonialEntity) => {
    const custom = KINGDOM_SPATIAL_COORDINATES[entity.id];
    const zoom = custom?.zoom || 2.25;
    const pan = custom?.panOffset || {
      x: (2898 - entity.svgCoordinates[0]) * 0.55,
      y: (2933 - entity.svgCoordinates[1]) * 0.55
    };

    setShowPreColonialKingdoms(true);
    setSelectedEntity(entity);
    setIsDossierOpen(false); // Hide Cartographic Dossier when an Old Kingdom is selected
    setZoomLevel(zoom);
    setPlateZoom(zoom);
    setVectorZoom(zoom);
    setPanOffset(pan);
    setPlatePanOffset(pan);
    setVectorPanOffset(pan);
    setActiveToponymFocus(null);
  }, []);

  // Selection of an antique plate: opens Provenance dossier, collapses kingdom panel, and resets zoom
  const handleSelectPlateItem = useCallback((plate: HistoricalMapPlate) => {
    if (onSelectPlate) onSelectPlate(plate);
    setIsDossierOpen(true);
    setSelectedEntity(null);
    setZoomLevel(1.0);
    setPlateZoom(1.0);
    setVectorZoom(1.0);
    setPanOffset({ x: 0, y: 0 });
    setPlatePanOffset({ x: 0, y: 0 });
    setVectorPanOffset({ x: 0, y: 0 });
    setActiveToponymFocus(null);
  }, [onSelectPlate]);

  // Plate pagination handlers
  const currentPlateIndex = HISTORICAL_MAP_PLATES.findIndex(p => p.id === selectedPlate.id);
  const handlePrevPlate = useCallback(() => {
    const prevIdx = (currentPlateIndex - 1 + HISTORICAL_MAP_PLATES.length) % HISTORICAL_MAP_PLATES.length;
    handleSelectPlateItem(HISTORICAL_MAP_PLATES[prevIdx]);
  }, [currentPlateIndex, handleSelectPlateItem]);

  const handleNextPlate = useCallback(() => {
    const nextIdx = (currentPlateIndex + 1) % HISTORICAL_MAP_PLATES.length;
    handleSelectPlateItem(HISTORICAL_MAP_PLATES[nextIdx]);
  }, [currentPlateIndex, handleSelectPlateItem]);

  // Center and zoom when focusedEntity prop is supplied (e.g. from Kingdoms matrix view)
  useEffect(() => {
    if (focusedEntity) {
      focusOnEntity(focusedEntity);
    }
  }, [focusedEntity, focusOnEntity]);

  // Pre-colonial kingdom active checker based on chronology
  const isEntityActiveInChronology = useCallback((entityId: string): boolean => {
    if (selectedChronologyYear === null) return true;
    const span = KINGDOM_CHRONOLOGY[entityId];
    if (!span) return true;
    return selectedChronologyYear >= span.start && selectedChronologyYear <= span.end;
  }, [selectedChronologyYear]);

  // Deep-link copy handler
  const handleCopyDeepLink = async () => {
    try {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const params = new URLSearchParams();
      params.set('plate', selectedPlate.id);
      if (comparisonMode !== 'curtain') params.set('mode', comparisonMode);
      if (selectedEntity) params.set('kingdom', selectedEntity.id);
      if (selectedChronologyYear !== null) params.set('year', String(selectedChronologyYear));
      const url = `${origin}${pathname}#archival-cartography?${params.toString()}`;
      await navigator.clipboard.writeText(url);
      setCopiedDeepLink(true);
      setTimeout(() => setCopiedDeepLink(false), 2500);
    } catch {}
  };

  // Copy citation handler
  const handleCopyCitation = async () => {
    try {
      const text = `${selectedPlate.cartographer} (${selectedPlate.year}). "${selectedPlate.title}." ${selectedPlate.source}. Preserved at ${selectedPlate.institution}.`;
      await navigator.clipboard.writeText(text);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    } catch {}
  };

  // Dynamic Country fill function
  const getCountryFill = useCallback((country: { id: string; unRegion: AfricanRegion; originalColor?: string; name?: string }) => {
    const canonicalColor = getCanonicalCountryColor(country.id);
    const baseColor = canonicalColor || country.originalColor || getRegionTonalPalette(country.unRegion).unBaseColor || '#0a9bc3';

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
      return hex;
    } else if (borderVibrancy === 'balanced') {
      return `${hex}cc`;
    } else if (borderVibrancy === 'subdued') {
      return `${hex}80`;
    } else if (borderVibrancy === 'contrast') {
      return hex;
    }
    return hex;
  }, [borderVibrancy, hoveredEntity, selectedEntity]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[600px] flex flex-col overflow-hidden bg-[#FAF8F5] dark:bg-stone-950 select-none">
      
      {/* =========================================================================
          1. INTEGRATED FULL-BLEED FIXED VIEWER HEADER CONTROLS BAR
          (2 neatly tightened control rows with dedicated left spacing for nav drawer)
          ========================================================================= */}
      <header className="w-full shrink-0 border-b border-stone-200/90 dark:border-stone-800/90 bg-[#FAF8F5]/98 dark:bg-stone-950/98 backdrop-blur-md pl-14 sm:pl-16 lg:pl-18 pr-3 sm:pr-4 lg:pr-5 py-2 flex flex-col gap-1.5 z-20 overflow-x-auto no-scrollbar shadow-xs">
        
        {/* ROW 1: Title, Plate Badge, Layer Toggles, and Zoom Controls */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          
          {/* Left: View Title & Active Plate Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="font-serif font-bold text-xs sm:text-sm md:text-base text-stone-900 dark:text-stone-100 whitespace-nowrap">
              Georeferenced Map Curtain
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 font-mono text-[9.5px] font-bold border border-amber-500/30 whitespace-nowrap">
              {selectedPlate.year} • {selectedPlate.shortTitle || selectedPlate.cartographer}
            </span>
            <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 hidden xl:inline truncate">
              17th–18th Century Cartography vs. 2026 Borders
            </span>
          </div>

          {/* Right: Layer Toggles & Zoom Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 text-xs">
            {/* Layer Toggles (Kingdoms & Borders) + Chronology Scrubber Trigger */}
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B]">
              <button
                type="button"
                onClick={() => setShowPreColonialKingdoms(v => !v)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                  showPreColonialKingdoms
                    ? 'bg-purple-500/20 text-purple-900 dark:text-purple-200 border-purple-500/50 shadow-2xs'
                    : 'bg-transparent text-stone-500 border-transparent opacity-60 line-through'
                }`}
                title="Toggle Pre-Colonial Kingdoms overlay"
              >
                <MapPin className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span className="hidden sm:inline">Kingdoms</span>
              </button>

              {showPreColonialKingdoms && (
                <button
                  type="button"
                  onClick={() => setIsChronologyOpen(o => !o)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                    isChronologyOpen || selectedChronologyYear !== null
                      ? 'bg-purple-700 text-white border-purple-700 shadow-2xs'
                      : 'bg-transparent text-purple-700 dark:text-purple-300 border-purple-400/40 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                  }`}
                  title="Toggle Chronological Era Scrubber (100–1900 CE)"
                >
                  <Clock className="w-3 h-3" />
                  <span className="hidden md:inline">
                    {selectedChronologyYear ? `${selectedChronologyYear} CE` : 'Timeline'}
                  </span>
                </button>
              )}

              {showPreColonialKingdoms && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowKingdomTerritoryPolygons(p => !p)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                      showKingdomTerritoryPolygons
                        ? 'bg-purple-500/20 text-purple-900 dark:text-purple-200 border-purple-500/50 shadow-2xs'
                        : 'bg-transparent text-stone-500 border-transparent opacity-60 line-through'
                    }`}
                    title="Toggle Pre-Colonial Imperial Extent Polygons"
                  >
                    <Compass className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    <span className="hidden md:inline">Extents</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTradeCorridors(tc => !tc)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                      showTradeCorridors
                        ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/50 shadow-2xs'
                        : 'bg-transparent text-stone-500 border-transparent opacity-60 line-through'
                    }`}
                    title="Toggle Historical Trade Corridor Particle Streams (Gold, Salt, Cowries, Copper)"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span className="hidden md:inline">Trade Flows</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsToponymConcordanceOpen(true)}
                    className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border bg-blue-500/15 text-blue-900 dark:text-blue-200 border-blue-500/40 hover:bg-blue-500/25"
                    title="Open Toponymic Concordance Index (Antique Names ⇄ Indigenous ⇄ 2026 Nations)"
                  >
                    <BookOpen className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <span className="hidden lg:inline">Concordance</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setShowModernBorders(v => !v)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                  showModernBorders
                    ? 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border-emerald-500/50 shadow-2xs'
                    : 'bg-transparent text-stone-500 border-transparent opacity-60 line-through'
                }`}
                title="Toggle Modern 2026 Sovereign Borders"
              >
                <Layers className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Borders</span>
              </button>
            </div>

            {/* Side-by-Side Pan/Zoom Synchronization Toggle */}
            {comparisonMode === 'sideBySide' && (
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <button
                  type="button"
                  onClick={() => setIsSyncedPanZoom(s => !s)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSyncedPanZoom
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                  title={isSyncedPanZoom ? "Pan & Zoom is Synchronized between panes (Click to unlock independent pan)" : "Pan & Zoom is Independent (Click to synchronize)"}
                >
                  {isSyncedPanZoom ? <Link2 className="w-3 h-3" /> : <Unlink2 className="w-3 h-3 text-stone-400" />}
                  <span className="hidden md:inline">{isSyncedPanZoom ? "Synced" : "Independent"}</span>
                </button>
              </div>
            )}

            <div className="w-[1px] h-4 bg-[#E5DDD0] dark:bg-[#38322B] shrink-0 hidden sm:block" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B]">
              <button
                type="button"
                onClick={() => zoomPane('both', -0.15)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Zoom Out (or Mouse Wheel down)"
              >
                <ZoomOut className="w-3 h-3" />
              </button>

              <span className="text-[10px] font-mono font-bold text-stone-800 dark:text-stone-200 min-w-[2.2rem] text-center font-tabular">
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                type="button"
                onClick={() => zoomPane('both', 0.15)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Zoom In (or Mouse Wheel up)"
              >
                <ZoomIn className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => resetPane('both')}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-500 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Reset to 100% Uncropped Full Africa View"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: Workbench Switcher, Comparison Modes, Slider, and Border Vibrancy */}
        <div className="flex items-center justify-between gap-2 min-w-0 pt-0.5 border-t border-stone-200/60 dark:border-stone-800/60">
          
          {/* Left: Workbench Switcher */}
          <div className="flex items-center gap-1 shrink-0">
            {onSelectWorkbenchTab && (
              <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B]">
                <button
                  type="button"
                  onClick={() => onSelectWorkbenchTab('curtain')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeWorkbenchTab === 'curtain'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                  title="Georeferenced Map Curtain Workbench"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Curtain</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectWorkbenchTab('streamlines')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeWorkbenchTab === 'streamlines'
                      ? 'bg-cyan-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                  title="Seasonal Oceanic Streamlines Workbench"
                >
                  <Wind className="w-3 h-3 text-cyan-400" />
                  <span>Streamlines</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectWorkbenchTab('kingdoms')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeWorkbenchTab === 'kingdoms'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                  title="Pre-Colonial Kingdoms Matrix Workbench"
                >
                  <Compass className="w-3 h-3 text-purple-400" />
                  <span>Kingdoms</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Comparison Mode Tabs, Dynamic Slider & Vibrancy */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 text-xs">
            {/* Comparison Mode Switcher */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B]">
              <button
                type="button"
                onClick={() => setComparisonMode('curtain')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  comparisonMode === 'curtain'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
                title="Interactive Split Curtain Comparison"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Split Curtain</span>
              </button>

              <button
                type="button"
                onClick={() => setComparisonMode('opacity')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  comparisonMode === 'opacity'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
                title="Alpha Opacity Blend Mode"
              >
                <Layers className="w-3 h-3" />
                <span>Opacity</span>
              </button>

              <button
                type="button"
                onClick={() => setComparisonMode('sideBySide')}
                className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  comparisonMode === 'sideBySide'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
                title="Dual Side-by-Side Viewport"
              >
                <Columns2 className="w-3 h-3" />
                <span>Side-by-Side</span>
              </button>
            </div>

            {/* Dynamic Slider */}
            {comparisonMode === 'curtain' && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B] text-[10px] font-mono">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={curtainPosition}
                  onChange={e => setCurtainPosition(Number(e.target.value))}
                  className="w-14 sm:w-20 accent-amber-600 cursor-pointer"
                  title="Curtain Position"
                />
                <span className="w-7 text-right font-bold text-amber-700 dark:text-amber-400 font-tabular">{Math.round(curtainPosition)}%</span>
              </div>
            )}

            {comparisonMode === 'opacity' && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B] text-[10px] font-mono">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacityLevel}
                  onChange={e => setOpacityLevel(Number(e.target.value))}
                  className="w-14 sm:w-20 accent-amber-600 cursor-pointer"
                  title="Plate Opacity"
                />
                <span className="w-7 text-right font-bold text-amber-700 dark:text-amber-400 font-tabular">{Math.round(opacityLevel)}%</span>
              </div>
            )}

            {/* 2026 Borders Vibrancy */}
            <div className="hidden xl:flex items-center gap-0.5 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B]">
              {(['vibrant', 'balanced', 'subdued', 'contrast'] as BorderVibrancy[]).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setBorderVibrancy(mode)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold capitalize transition-all cursor-pointer ${
                    borderVibrancy === mode
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                  title={`2026 Sovereign Boundaries: ${mode}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chronology Scrubber Drawer (Expandable when user toggles Chronology) */}
        <AnimatePresence>
          {showPreColonialKingdoms && isChronologyOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full pt-1.5 pb-1 border-t border-purple-500/25 bg-purple-500/10 dark:bg-purple-950/30 px-3 rounded-xl flex flex-col gap-1.5 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300" />
                  <span className="text-[10.5px] font-mono font-bold text-purple-950 dark:text-purple-200">
                    Dynastic Chronology Scrubber:
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-700 text-white font-mono text-[10px] font-bold shadow-2xs">
                    {selectedChronologyYear ? `${selectedChronologyYear} CE` : 'All Eras (100–1900 CE)'}
                  </span>
                </div>

                {/* Quick Era Presets */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectedChronologyYear(null)}
                    className={`px-2 py-0.5 rounded-lg text-[9.5px] font-mono font-bold transition-all cursor-pointer ${
                      selectedChronologyYear === null
                        ? 'bg-purple-700 text-white shadow-2xs'
                        : 'bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                    }`}
                  >
                    All Eras
                  </button>
                  {[
                    { year: 350, label: '350 CE (Aksum)' },
                    { year: 800, label: '800 CE (Kanem)' },
                    { year: 1250, label: '1250 CE (Mali)' },
                    { year: 1350, label: '1350 CE (Zimbabwe)' },
                    { year: 1500, label: '1500 CE (Songhai/Kongo)' },
                    { year: 1650, label: '1650 CE (Oyo/Benin)' },
                    { year: 1750, label: '1750 CE (Ashanti/Dahomey)' }
                  ].map(p => (
                    <button
                      key={p.year}
                      type="button"
                      onClick={() => setSelectedChronologyYear(p.year)}
                      className={`px-2 py-0.5 rounded-lg text-[9.5px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedChronologyYear === p.year
                          ? 'bg-purple-700 text-white shadow-2xs'
                          : 'bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setDimInactiveKingdoms(d => !d)}
                  className="text-[9.5px] font-mono text-purple-700 dark:text-purple-300 hover:underline cursor-pointer hidden lg:inline"
                >
                  {dimInactiveKingdoms ? 'Mode: Dim Inactive' : 'Mode: Hide Inactive'}
                </button>
              </div>

              {/* Slider Bar */}
              <div className="flex items-center gap-3 w-full">
                <span className="text-[9px] font-mono font-bold text-stone-500">100 CE</span>
                <input
                  type="range"
                  min="100"
                  max="1900"
                  step="25"
                  value={selectedChronologyYear ?? 1350}
                  onChange={e => setSelectedChronologyYear(Number(e.target.value))}
                  className="flex-1 accent-purple-600 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
                />
                <span className="text-[9px] font-mono font-bold text-stone-500">1900 CE</span>
              </div>

              {/* Contextual Milestone Banner */}
              {selectedChronologyYear && (
                <div className="text-[10.5px] font-serif text-purple-950 dark:text-purple-100 bg-white/80 dark:bg-stone-900/80 px-2.5 py-1 rounded-lg border border-purple-200/60 dark:border-purple-800/50 flex items-center justify-between">
                  <span>
                    {(() => {
                      const activeCount = PRE_COLONIAL_ENTITIES.filter(e => isEntityActiveInChronology(e.id)).length;
                      const closestMilestone = CHRONOLOGY_MILESTONES.reduce((prev, curr) => 
                        Math.abs(curr.year - selectedChronologyYear) < Math.abs(prev.year - selectedChronologyYear) ? curr : prev
                      );
                      return `${activeCount} kingdoms active in ${selectedChronologyYear} CE • ${closestMilestone.title}: ${closestMilestone.desc}`;
                    })()}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedChronologyYear(null)}
                    className="text-[9.5px] font-mono text-purple-700 dark:text-purple-300 hover:underline ml-2 cursor-pointer"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =========================================================================
          2. MIDDLE VIEWPORT: VERTICAL FILMSTRIP (LEFT) + MAP CANVAS + DOSSIER (RIGHT)
          (Dossier extends full-height to the bottom; Filmstrip is docked on the left)
          ========================================================================= */}
      <div className="flex-1 w-full flex flex-row overflow-hidden relative min-h-0">
        
        {/* Floating Toponym Callout Indicator */}
        <AnimatePresence>
          {activeToponymFocus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-amber-950/95 text-amber-200 backdrop-blur-md border border-amber-500/50 shadow-xl text-xs font-serif flex items-center gap-3 max-w-[90vw]"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-left truncate">
                <strong className="text-amber-100 font-bold">{activeToponymFocus.name}:</strong>{' '}
                <span className="text-[11px] text-amber-200/90 font-sans">{activeToponymFocus.note}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveToponymFocus(null);
                  setZoomLevel(1.0);
                  setPanOffset({ x: 0, y: 0 });
                  setPlatePanOffset({ x: 0, y: 0 });
                  setVectorPanOffset({ x: 0, y: 0 });
                }}
                className="px-2 py-0.5 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 text-amber-100 font-mono text-[9px] font-bold transition-colors cursor-pointer shrink-0"
              >
                Reset View
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Left Button when Filmstrip is collapsed */}
        <AnimatePresence>
          {!isFilmstripOpen && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onClick={() => setIsFilmstripOpen(true)}
              className="absolute top-3.5 left-3.5 z-30 flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-stone-700 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-95"
              title="Expand Antique Plates Filmstrip"
            >
              <PanelLeftOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Plates ({HISTORICAL_MAP_PLATES.length})</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Vertical Left-Aligned Thumbnail Filmstrip */}
        <AnimatePresence>
          {isFilmstripOpen && (
            <motion.aside
              initial={{ opacity: 0, x: -60, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 230 }}
              exit={{ opacity: 0, x: -60, width: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="w-52 sm:w-56 lg:w-[230px] shrink-0 h-full border-r border-stone-200 dark:border-stone-800 bg-[#FAF8F5]/98 dark:bg-stone-950/98 backdrop-blur-xl flex flex-col z-20 shadow-xs overflow-hidden"
              id="vertical-thumbnail-filmstrip"
            >
              {/* Vertical Filmstrip Header */}
              <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 bg-[#FAF8F5]/80 dark:bg-stone-950/80 shrink-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400 truncate">
                    Plates ({HISTORICAL_MAP_PLATES.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilmstripOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
                  title="Collapse filmstrip"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scrollable Vertical Card List */}
              <div 
                ref={filmstripScrollRef}
                className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2"
              >
                {HISTORICAL_MAP_PLATES.map(plate => {
                  const isSelected = selectedPlate.id === plate.id;
                  return (
                    <button
                      key={plate.id}
                      type="button"
                      onClick={() => handleSelectPlateItem(plate)}
                      className={`w-full p-1.5 rounded-xl border text-left transition-all cursor-pointer group flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/70 shadow-xs ring-2 ring-amber-500/40'
                          : 'bg-white/80 dark:bg-stone-900/80 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600'
                      }`}
                      title={`${plate.title} (${plate.year}) by ${plate.cartographer}`}
                    >
                      <div className="relative aspect-16/10 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                        <AntiquePlateCanvas
                          plate={plate}
                          isThumbnail={true}
                          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1 right-1 z-10 px-1 py-0.2 rounded bg-stone-900/90 text-amber-300 font-mono text-[8.5px] font-bold border border-amber-500/30">
                          {plate.year}
                        </div>
                      </div>

                      <div className="min-w-0 px-0.5">
                        <h5 className="font-serif font-bold text-[11px] text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-800 dark:group-hover:text-amber-400 leading-tight">
                          {plate.shortTitle || `${plate.cartographer.split(' ')[1] || plate.cartographer} (${plate.year})`}
                        </h5>
                        <p className="text-[9.5px] font-mono text-stone-500 dark:text-stone-400 truncate">
                          {plate.cartographer}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Map Viewport */}
        <div 
          ref={containerRef}
          onWheel={handleWheelZoom}
          className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center select-none"
        >
          {comparisonMode === 'sideBySide' ? (
            /* Side-by-Side Dual Viewport Mode with Full Synchronized Zoom & Pan */
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-3 p-2 sm:p-3 relative overflow-hidden">
              
              {/* Historical Plate Pane */}
              <div 
                className="relative rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-800 bg-[#F4EFE6] dark:bg-stone-900 flex flex-col shadow-xs select-none touch-none cursor-grab active:cursor-grabbing group"
                onPointerDown={(e) => handlePointerDownPan(e, 'plate')}
                onPointerMove={handlePointerMovePan}
                onPointerUp={handlePointerUpPan}
                onPointerCancel={handlePointerUpPan}
                onWheel={(e) => handlePaneWheel(e, 'plate')}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  zoomPane('plate', 0.25);
                }}
              >
                {/* Pane Header Info */}
                <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-2 max-w-[calc(100%-170px)] pointer-events-none">
                  <div className="px-2.5 py-0.5 rounded-full bg-stone-900/85 text-amber-300 font-mono text-[10px] font-bold backdrop-blur-md border border-amber-500/30 truncate shadow-xs">
                    {selectedPlate.year} • {selectedPlate.shortTitle || selectedPlate.cartographer}
                  </div>
                </div>

                {/* Pane Floating Zoom HUD */}
                <div 
                  className="absolute top-2.5 right-2.5 z-20 flex items-center gap-0.5 bg-stone-900/90 text-white rounded-xl p-0.5 border border-white/20 backdrop-blur-md shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => zoomPane('plate', -0.2)}
                    className="p-1 rounded-lg hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
                    title={isSyncedPanZoom ? "Zoom Out Both Viewports" : "Zoom Out Historical Plate"}
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[9px] font-bold px-1.5 min-w-[2.6rem] text-center font-tabular text-amber-300">
                    {Math.round((isSyncedPanZoom ? zoomLevel : plateZoom) * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => zoomPane('plate', 0.2)}
                    className="p-1 rounded-lg hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
                    title={isSyncedPanZoom ? "Zoom In Both Viewports" : "Zoom In Historical Plate"}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => resetPane('plate')}
                    className="p-1 rounded-lg hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title={isSyncedPanZoom ? "Reset Both to 100%" : "Reset Historical Plate to 100%"}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Pane Canvas with Zoom & Pan Transform */}
                <div className="w-full h-full flex items-center justify-center p-2 overflow-hidden pointer-events-none">
                  <div 
                    className="w-full h-full flex items-center justify-center transition-transform duration-75 origin-center pointer-events-none"
                    style={{
                      transform: `scale(${isSyncedPanZoom ? zoomLevel : plateZoom}) translate(${((isSyncedPanZoom ? panOffset.x : platePanOffset.x) / (isSyncedPanZoom ? zoomLevel : plateZoom))}px, ${((isSyncedPanZoom ? panOffset.y : platePanOffset.y) / (isSyncedPanZoom ? zoomLevel : plateZoom))}px)`
                    }}
                  >
                    <AntiquePlateCanvas plate={selectedPlate} className="w-full h-full max-h-[78vh] rounded-xl object-contain pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Contemporary Sovereign Vector Pane */}
              <div 
                className="relative rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 flex flex-col items-center justify-center p-2 shadow-xs select-none touch-none cursor-grab active:cursor-grabbing group"
                onPointerDown={(e) => handlePointerDownPan(e, 'vector')}
                onPointerMove={handlePointerMovePan}
                onPointerUp={handlePointerUpPan}
                onPointerCancel={handlePointerUpPan}
                onWheel={(e) => handlePaneWheel(e, 'vector')}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  zoomPane('vector', 0.25);
                }}
              >
                {/* Pane Header Info */}
                <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-2 max-w-[calc(100%-170px)] pointer-events-none">
                  <div className="px-2.5 py-0.5 rounded-full bg-emerald-950/85 text-emerald-300 font-mono text-[10px] font-bold backdrop-blur-md border border-emerald-500/30 truncate shadow-xs">
                    2026 Sovereign Map (54 Nations)
                  </div>
                </div>

                {/* Pane Floating Zoom HUD */}
                <div 
                  className="absolute top-2.5 right-2.5 z-20 flex items-center gap-0.5 bg-stone-900/90 text-white rounded-xl p-0.5 border border-white/20 backdrop-blur-md shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => zoomPane('vector', -0.2)}
                    className="p-1 rounded-lg hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
                    title={isSyncedPanZoom ? "Zoom Out Both Viewports" : "Zoom Out Contemporary Map"}
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[9px] font-bold px-1.5 min-w-[2.6rem] text-center font-tabular text-emerald-300">
                    {Math.round((isSyncedPanZoom ? zoomLevel : vectorZoom) * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => zoomPane('vector', 0.2)}
                    className="p-1 rounded-lg hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
                    title={isSyncedPanZoom ? "Zoom In Both Viewports" : "Zoom In Contemporary Map"}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => resetPane('vector')}
                    className="p-1 rounded-lg hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title={isSyncedPanZoom ? "Reset Both to 100%" : "Reset Contemporary Map to 100%"}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Pane Canvas with Zoom & Pan Transform */}
                <div className="w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
                  <div 
                    className="w-full h-full flex items-center justify-center transition-transform duration-75 origin-center pointer-events-none"
                    style={{
                      transform: `scale(${isSyncedPanZoom ? zoomLevel : vectorZoom}) translate(${((isSyncedPanZoom ? panOffset.x : vectorPanOffset.x) / (isSyncedPanZoom ? zoomLevel : vectorZoom))}px, ${((isSyncedPanZoom ? panOffset.y : vectorPanOffset.y) / (isSyncedPanZoom ? zoomLevel : vectorZoom))}px)`
                    }}
                  >
                    <svg
                      viewBox={AFRICA_FINAL_VIEWBOX}
                      className="w-full h-full max-w-[92vw] max-h-[78vh] select-none"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g key={`side-by-side-vibrancy-${borderVibrancy}`} opacity={0.92}>
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

                      {/* Optional Pre-Colonial Kingdoms Beacons in Side-by-Side */}
                      {showPreColonialKingdoms && (
                        <g id="preColonialKingdomBeaconsSideBySide" transform={AFRICA_FINAL_TRANSFORM} className="pointer-events-auto">
                          {PRE_COLONIAL_ENTITIES.map(entity => {
                            const [x, y] = entity.svgCoordinates;
                            const isSelected = selectedEntity?.id === entity.id;
                            const isHovered = hoveredEntity?.id === entity.id;
                            const isChronologyActive = isEntityActiveInChronology(entity.id);
                            if (!isChronologyActive && !dimInactiveKingdoms) return null;
                            const cleanName = entity.name.split('(')[0].trim();
                            const textWidth = Math.max(460, cleanName.length * 52 + 180);
                            
                            let labelOffsetX = 0;
                            let labelOffsetY = -190;
                            if (entity.id === 'dahomey-kingdom') {
                              labelOffsetX = 20;
                              labelOffsetY = -200;
                            } else if (entity.id === 'benin-kingdom') {
                              labelOffsetX = 220;
                              labelOffsetY = 190;
                            } else if (entity.id === 'ashanti-empire') {
                              labelOffsetX = -560;
                              labelOffsetY = 0;
                            } else if (entity.id === 'oyo-empire') {
                              labelOffsetX = 460;
                              labelOffsetY = 2;
                            } else if (entity.id === 'mali-empire') {
                              labelOffsetX = -120;
                              labelOffsetY = -190;
                            } else if (entity.id === 'kongo-kingdom') {
                              labelOffsetX = -100;
                              labelOffsetY = 200;
                            } else if (entity.id === 'great-zimbabwe') {
                              labelOffsetX = -240;
                              labelOffsetY = -190;
                            }

                            return (
                              <g
                                key={`svg-beacon-sbs-${entity.id}`}
                                transform={`translate(${x}, ${y})`}
                                className="cursor-pointer group"
                                opacity={isChronologyActive ? 1.0 : 0.22}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  focusOnEntity(entity);
                                  if (onSelectPreColonialEntity) onSelectPreColonialEntity(entity);
                                }}
                                onMouseEnter={() => setHoveredEntity(entity)}
                                onMouseLeave={() => setHoveredEntity(null)}
                              >
                                {isChronologyActive && (isSelected || isHovered) && (
                                  <circle cx="0" cy="0" r="100" fill={entity.color}>
                                    <animate attributeName="r" values="90;480" dur="2.6s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.85;0;0" dur="2.6s" repeatCount="indefinite" />
                                  </circle>
                                )}
                                <circle cx="0" cy="0" r="75" fill={entity.color} stroke="#ffffff" strokeWidth="18" className="drop-shadow-2xl" />
                                <circle cx="0" cy="0" r="26" fill="#ffffff" />
                                <g 
                                  transform={`translate(${labelOffsetX}, ${labelOffsetY})`}
                                  className="cursor-pointer pointer-events-auto"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    focusOnEntity(entity);
                                    if (onSelectPreColonialEntity) onSelectPreColonialEntity(entity);
                                  }}
                                >
                                  <rect 
                                    x={-textWidth / 2} 
                                    y="-90" 
                                    width={textWidth} 
                                    height="170" 
                                    rx="85" 
                                    fill={isSelected ? '#3b0764' : '#09090b'} 
                                    stroke={isSelected || isHovered ? '#fbbf24' : entity.color} 
                                    strokeWidth={isSelected || isHovered ? '16' : '10'} 
                                    className="drop-shadow-2xl pointer-events-auto cursor-pointer" 
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
                                    className="select-none pointer-events-none"
                                  >
                                    {cleanName}
                                  </text>
                                </g>
                              </g>
                            );
                          })}
                        </g>
                      )}
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating Synchronized Navigation & Directional Pan Toolbar */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-stone-900/90 text-white border border-white/20 backdrop-blur-md shadow-xl text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setIsSyncedPanZoom(s => !s)}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                    isSyncedPanZoom
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white/10 text-stone-300 hover:text-white'
                  }`}
                  title={isSyncedPanZoom ? "Pan & Zoom is Synchronized between panes (Click to unlock independent pan)" : "Pan & Zoom is Independent (Click to synchronize)"}
                >
                  {isSyncedPanZoom ? <Link2 className="w-3.5 h-3.5" /> : <Unlink2 className="w-3.5 h-3.5 text-stone-400" />}
                  <span>{isSyncedPanZoom ? "Pan & Zoom Synced" : "Independent"}</span>
                </button>

                <div className="w-[1px] h-4 bg-white/20 shrink-0" />

                {/* Directional Nudge D-pad */}
                <div className="flex items-center gap-0.5" title="Directional Pan Nudge">
                  <button
                    type="button"
                    onClick={() => nudgePan(60, 0)}
                    className="p-1 rounded-md hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title="Pan Left"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgePan(0, 60)}
                    className="p-1 rounded-md hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title="Pan Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgePan(0, -60)}
                    className="p-1 rounded-md hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title="Pan Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgePan(-60, 0)}
                    className="p-1 rounded-md hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title="Pan Right"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-[1px] h-4 bg-white/20 shrink-0" />

                <button
                  type="button"
                  onClick={() => resetPane('both')}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Reset Both Viewports to 100%"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset Both</span>
                </button>
              </div>
            </div>
          ) : (
            /* Full-Bleed Split-Curtain & Alpha Opacity Layered Viewport */
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-75 origin-center select-none touch-none cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => handlePointerDownPan(e, 'both')}
              onPointerMove={handlePointerMovePan}
              onPointerUp={handlePointerUpPan}
              onPointerCancel={handlePointerUpPan}
              onDoubleClick={(e) => {
                e.stopPropagation();
                zoomPane('both', 0.25);
              }}
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`
              }}
            >
              {/* 1. Underlying Modern 2026 Sovereign Vector Map (Base Layer) */}
              {showModernBorders && (
                <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
                  <svg
                    viewBox={AFRICA_FINAL_VIEWBOX}
                    className="w-full h-full max-w-[92vw] max-h-[calc(100vh-140px)] select-none pointer-events-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      key={`curtain-vibrancy-${borderVibrancy}`}
                      opacity={0.92}
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
              )}

              {/* 2. Historical Antique Map Overlay (Controlled by Curtain or Opacity) */}
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center"
                style={{
                  clipPath:
                    comparisonMode === 'curtain'
                      ? `polygon(0% 0%, ${curtainPosition}% 0%, ${curtainPosition}% 100%, 0% 100%)`
                      : undefined,
                  opacity: comparisonMode === 'opacity' ? opacityLevel / 100 : 1
                }}
              >
                <div className="w-full h-full max-w-[92vw] max-h-[calc(100vh-140px)] flex items-center justify-center p-2">
                  <AntiquePlateCanvas plate={selectedPlate} className="w-full h-full object-contain" />
                </div>
              </div>

              {/* 3. Pre-Colonial Empires & Kingdoms Vector Beacons & Extents (Top Layer) */}
              {showPreColonialKingdoms && (
                <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 pointer-events-auto z-20">
                  <svg
                    viewBox={AFRICA_FINAL_VIEWBOX}
                    className="w-full h-full max-w-[92vw] max-h-[calc(100vh-140px)] select-none pointer-events-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Pre-Colonial Peak Territorial Extents Polygons */}
                    {showKingdomTerritoryPolygons && (
                      <g id="preColonialTerritoryPolygons" transform={AFRICA_FINAL_TRANSFORM} className="pointer-events-none">
                        {PRE_COLONIAL_ENTITIES.map(entity => {
                          const detailed = DETAILED_KINGDOMS_DATA[entity.id];
                          if (!detailed || !detailed.territoryPolygonPath) return null;
                          const isChronologyActive = isEntityActiveInChronology(entity.id);
                          if (!isChronologyActive && !dimInactiveKingdoms) return null;
                          const isSelected = selectedEntity?.id === entity.id;

                          return (
                            <path
                              key={`polygon-${entity.id}`}
                              d={detailed.territoryPolygonPath}
                              fill={entity.color}
                              fillOpacity={isSelected ? 0.28 : 0.12}
                              stroke={entity.color}
                              strokeWidth={isSelected ? 26 : 14}
                              strokeDasharray={isSelected ? "none" : "32 16"}
                              className="transition-all duration-300"
                              opacity={isChronologyActive ? 1.0 : 0.2}
                            />
                          );
                        })}
                      </g>
                    )}

                    <g id="preColonialKingdomBeaconsTop" transform={AFRICA_FINAL_TRANSFORM} className="pointer-events-auto">
                      {PRE_COLONIAL_ENTITIES.map(entity => {
                        const [x, y] = entity.svgCoordinates;
                        const isSelected = selectedEntity?.id === entity.id;
                        const isHovered = hoveredEntity?.id === entity.id;
                        const isChronologyActive = isEntityActiveInChronology(entity.id);
                        if (!isChronologyActive && !dimInactiveKingdoms) return null;
                        const cleanName = entity.name.split('(')[0].trim();
                        const textWidth = Math.max(460, cleanName.length * 52 + 180);
                        
                        let labelOffsetX = 0;
                        let labelOffsetY = -190;
                        if (entity.id === 'dahomey-kingdom') {
                          labelOffsetX = 20;
                          labelOffsetY = -200;
                        } else if (entity.id === 'benin-kingdom') {
                          labelOffsetX = 220;
                          labelOffsetY = 190;
                        } else if (entity.id === 'ashanti-empire') {
                          labelOffsetX = -560;
                          labelOffsetY = 0;
                        } else if (entity.id === 'oyo-empire') {
                          labelOffsetX = 460;
                          labelOffsetY = 2;
                        } else if (entity.id === 'mali-empire') {
                          labelOffsetX = -120;
                          labelOffsetY = -190;
                        } else if (entity.id === 'kongo-kingdom') {
                          labelOffsetX = -100;
                          labelOffsetY = 200;
                        } else if (entity.id === 'great-zimbabwe') {
                          labelOffsetX = -240;
                          labelOffsetY = -190;
                        }

                        return (
                          <g
                            key={`svg-beacon-top-${entity.id}`}
                            transform={`translate(${x}, ${y})`}
                            className="cursor-pointer group"
                            opacity={isChronologyActive ? 1.0 : 0.22}
                            onClick={(e) => {
                              e.stopPropagation();
                              focusOnEntity(entity);
                              if (onSelectPreColonialEntity) onSelectPreColonialEntity(entity);
                            }}
                            onMouseEnter={() => setHoveredEntity(entity)}
                            onMouseLeave={() => setHoveredEntity(null)}
                          >
                            {/* Radiating Pulsating Radar Wave & Rings */}
                            {isChronologyActive && (isSelected || isHovered) && (
                              <>
                                <circle cx="0" cy="0" r="100" fill={entity.color}>
                                  <animate
                                    attributeName="r"
                                    values="90;480"
                                    dur="2.6s"
                                    repeatCount="indefinite"
                                  />
                                  <animate
                                    attributeName="opacity"
                                    values="0.85;0;0"
                                    dur="2.6s"
                                    repeatCount="indefinite"
                                  />
                                </circle>

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
                                    values="0.85;0;0"
                                    dur="2.6s"
                                    begin="1.3s"
                                    repeatCount="indefinite"
                                  />
                                </circle>

                                <circle
                                  cx="0"
                                  cy="0"
                                  r="170"
                                  fill="none"
                                  stroke={entity.color}
                                  strokeWidth="20"
                                  strokeDasharray="28,14"
                                  opacity="1"
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
                              </>
                            )}

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

                            {/* High-Contrast Floating Pill Label (Clickable) */}
                            <g 
                              transform={`translate(${labelOffsetX}, ${labelOffsetY})`}
                              className="cursor-pointer pointer-events-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                focusOnEntity(entity);
                                if (onSelectPreColonialEntity) onSelectPreColonialEntity(entity);
                              }}
                            >
                              <rect
                                x={-textWidth / 2 - 16}
                                y="-105"
                                width={textWidth + 32}
                                height="200"
                                rx="100"
                                fill={entity.color}
                                opacity={isSelected || isHovered ? '0.65' : '0.3'}
                                className="pointer-events-auto cursor-pointer"
                              />

                              <rect
                                x={-textWidth / 2}
                                y="-90"
                                width={textWidth}
                                height="170"
                                rx="85"
                                fill={isSelected ? '#3b0764' : '#09090b'}
                                stroke={isSelected || isHovered ? '#fbbf24' : entity.color}
                                strokeWidth={isSelected || isHovered ? '16' : '10'}
                                className="drop-shadow-2xl pointer-events-auto cursor-pointer"
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
                                className="select-none pointer-events-none"
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
              )}

              {/* 4. Pre-Colonial Animated Trade Corridor Particle Flows Canvas */}
              {showTradeCorridors && (
                <TradeCorridorParticleCanvas
                  activeCentury={selectedChronologyYear ? Math.ceil(selectedChronologyYear / 100) : null}
                  activeCommodityFilter={activeCommodityFilter}
                  showLabels={zoomLevel >= 1.4}
                />
              )}

              {/* 5. Split-Curtain Draggable Divider Line */}
              {comparisonMode === 'curtain' && (
                <div
                  style={{ left: `${curtainPosition}%` }}
                  onMouseDown={handleMouseDownCurtain}
                  onTouchMove={handleTouchMoveCurtain}
                  className="absolute top-0 bottom-0 -translate-x-1/2 w-9 flex items-center justify-center cursor-ew-resize z-30 group"
                >
                  <div className="w-0.5 h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.7)]" />
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-900 text-amber-400 border-2 border-amber-500 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </div>
                  <div className="absolute top-4 -translate-x-1/2 px-2 py-0.5 rounded-full bg-stone-900/95 text-amber-300 text-[9.5px] font-mono font-bold font-tabular border border-amber-500/50 shadow-xs pointer-events-none">
                    {Math.round(curtainPosition)}%
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================================================================
            RIGHT DOCKED CARTOGRAPHIC DOSSIER & PROVENANCE PANEL
            (Docked strictly inside the middle container: below the header, above the filmstrip)
            ========================================================================= */}
        {/* Right-aligned Floating Pill when dossier is collapsed */}
        <AnimatePresence>
          {!isDossierOpen && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onClick={() => setIsDossierOpen(true)}
              className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-stone-700 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-95"
              title="Expand Cartographic Dossier & Provenance"
            >
              <PanelRightOpen className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Dossier</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Docked Dossier Panel */}
        <AnimatePresence>
          {isDossierOpen && (
            <motion.aside
              initial={{ opacity: 0, x: 100, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 380 }}
              exit={{ opacity: 0, x: 100, width: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="w-80 sm:w-96 lg:w-[380px] shrink-0 h-full border-l border-stone-200 dark:border-stone-800 bg-white/98 dark:bg-stone-900/98 backdrop-blur-xl flex flex-col z-20 shadow-md overflow-hidden"
              id="cartographic-dossier-panel"
            >
              {/* Dossier Header (Unobscured & below main header) */}
              <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3 bg-[#FAF8F5]/80 dark:bg-stone-950/80 shrink-0">
                <div className="space-y-0.5 min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400">
                      Cartographic Dossier &amp; Provenance
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug line-clamp-2">
                    {selectedPlate.title} ({selectedPlate.year})
                  </h2>
                  <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
                    {selectedPlate.cartographer} • {selectedPlate.century}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Plate Pagination Controls */}
                  <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-stone-200 dark:border-stone-800 text-xs font-mono">
                    <button
                      type="button"
                      onClick={handlePrevPlate}
                      className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                      title="Previous Antique Plate"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[9.5px] font-bold px-1 text-stone-600 dark:text-stone-400 font-tabular">
                      {currentPlateIndex + 1}/{HISTORICAL_MAP_PLATES.length}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextPlate}
                      className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                      title="Next Antique Plate"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Close / Collapse Button in Dossier Header */}
                  <button
                    type="button"
                    onClick={() => setIsDossierOpen(false)}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
                    title="Collapse dossier panel"
                  >
                    <PanelRightClose className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Dossier Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4 text-left">
                {/* Quick Actions (Citation & High-Res Scan) */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCitation}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    {copiedCitation ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Citation</span>
                      </>
                    )}
                  </button>

                  <a
                    href={selectedPlate.fallbackUrls?.[0] || selectedPlate.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
                    title="Open Full-Resolution Plate Scan"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Historical & Epistemological Significance */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400">
                    Historical &amp; Epistemological Significance
                  </h4>
                  <p className="text-xs font-serif leading-relaxed text-stone-800 dark:text-stone-200">
                    {selectedPlate.description}
                  </p>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs font-serif text-stone-800 dark:text-stone-200">
                    <strong className="text-amber-900 dark:text-amber-300 font-bold block mb-1">Scholarly Takeaway:</strong>
                    {selectedPlate.historicalSignificance}
                  </div>
                </div>

                {/* Toponyms & Historic Regions to Observe */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-[10px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400">
                    Toponyms &amp; Historic Regions to Observe
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPlate.toponymsToObserve.map((toponym, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[10.5px] font-mono font-medium text-stone-800 dark:text-stone-200"
                      >
                        {toponym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bibliographical Reference */}
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs font-serif text-stone-700 dark:text-stone-300 space-y-1">
                  <span className="text-[9.5px] font-mono uppercase font-bold text-stone-400 block">
                    Bibliographical Source
                  </span>
                  <p className="italic">{selectedPlate.source}</p>
                  <p className="text-[10px] font-mono text-stone-500 pt-0.5">
                    Preserved at: <strong>{selectedPlate.institution}</strong>
                  </p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Sleek Floating Rich Bottom-Left Kingdom Panel */}
        <AnimatePresence>
          {selectedEntity && (
            <KingdomRichBottomPanel
              entity={selectedEntity}
              isFilmstripOpen={isFilmstripOpen}
              onClose={() => {
                setSelectedEntity(null);
                if (onClearFocusedEntity) onClearFocusedEntity();
              }}
              onRecenterMap={(ent) => focusOnEntity(ent)}
              onOpenDynasticTree={() => setIsDynasticTreeOpen(true)}
              onOpenArtifact3D={(artId) => {
                setActiveArtifactId(artId);
                setIsArtifact3DOpen(true);
              }}
              onNavigateToCountry={onNavigateToCountry}
              currentIndex={PRE_COLONIAL_ENTITIES.findIndex(e => e.id === selectedEntity.id)}
              totalCount={PRE_COLONIAL_ENTITIES.length}
              onPrevKingdom={() => {
                const currIdx = PRE_COLONIAL_ENTITIES.findIndex(e => e.id === selectedEntity.id);
                const prevIdx = (currIdx - 1 + PRE_COLONIAL_ENTITIES.length) % PRE_COLONIAL_ENTITIES.length;
                focusOnEntity(PRE_COLONIAL_ENTITIES[prevIdx]);
              }}
              onNextKingdom={() => {
                const currIdx = PRE_COLONIAL_ENTITIES.findIndex(e => e.id === selectedEntity.id);
                const nextIdx = (currIdx + 1) % PRE_COLONIAL_ENTITIES.length;
                focusOnEntity(PRE_COLONIAL_ENTITIES[nextIdx]);
              }}
            />
          )}
        </AnimatePresence>

        {/* 1. Interactive Dynastic Succession & Queen Mothers Tree Modal */}
        <AnimatePresence>
          {isDynasticTreeOpen && (
            <KingdomDynasticTreeModal
              kingdom={DETAILED_KINGDOMS_DATA[selectedEntity?.id || 'kongo-kingdom'] || DETAILED_KINGDOMS_DATA['kongo-kingdom']}
              onClose={() => setIsDynasticTreeOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* 2. Interactive 3D & 360° Material Culture Artifact Inspector Modal */}
        <AnimatePresence>
          {isArtifact3DOpen && (
            <KingdomArtifact3DViewerModal
              kingdom={DETAILED_KINGDOMS_DATA[selectedEntity?.id || 'benin-kingdom'] || DETAILED_KINGDOMS_DATA['benin-kingdom']}
              initialArtifactId={activeArtifactId}
              onClose={() => setIsArtifact3DOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* 3. Toponymic Concordance Table Modal */}
        <AnimatePresence>
          {isToponymConcordanceOpen && (
            <ToponymConcordanceModal
              onClose={() => setIsToponymConcordanceOpen(false)}
              onLocateToponym={(item: ToponymConcordanceItem) => {
                setIsToponymConcordanceOpen(false);
                handleFocusToponym(item.antiqueName);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
