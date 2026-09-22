import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  X, 
  ExternalLink, 
  Sliders,
  Layers, 
  Compass, 
  BookOpen,
  Sparkles,
  Upload,
  Info,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Users,
  Activity,
  Maximize2,
  Minimize2,
  GripHorizontal,
  Languages,
  Settings2,
  Dna,
  Landmark,
  ArrowRight,
  Globe,
  Download
} from 'lucide-react';
import { AcademicExportModal } from '../AcademicExportModal';
import { 
  VBW, 
  VBH, 
  CX, 
  CY, 
  AFRICALIA_COUNTRY_CONDUITS, 
  AfricaliaCountryConduit
} from '../../data/africaliaMasterTreeData';
import { AFRICALIA_REGIONS } from '../../data/africaliaSourceData';
import { AUTHENTIC_ETHNIC_TREE_RAW_SVG } from '../../data/authenticEthnicTreeSvg';
import { WikipediaEthnicDossier } from './WikipediaEthnicDossier';
import { RichEditorialCountryDevelopmentPanel } from './RichEditorialCountryDevelopmentPanel';
import { getMajorLinguisticFamilies } from '../../services/wikipediaService';
import { findWikipediaEntry, WIKIPEDIA_TABLE_ENTRIES } from '../../data/wikipediaEthnicAtlas';
import { ALL_ADMIN1_SUBDIVISIONS } from '../../data/africaliaGeographyData';
import { RadialTreeSkeleton } from './RadialTreeSkeleton';
import { useCanvasViewport } from '../../hooks/useCanvasViewport';
import { getAuthoritativeCountryForEthnic } from '../../data/ethnicToCountryMap';
import type { WorkerSearchRequest, WorkerSearchResponse } from '../../workers/ethnicAtlasWorker';

interface AfricaliaExplorerProps {
  onSelectReport?: (reportId: string) => void;
  onNavigateToSlaveTrade?: () => void;
  onNavigateToMolecular?: () => void;
  onNavigateToFoundations?: () => void;
  onNavigateToLanguages?: () => void;
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
  coords?: { x: number; y: number; r: number };
}

// Known entity map from raw SVG ids to detailed historical / demographic metadata
const RAW_SVG_ENTITY_MAP: Record<string, Partial<SelectedEntityData>> = {
  'node--origin-africa': {
    name: 'Africa Motherland (Continental Origin)',
    type: 'central',
    region: 'Continental Hub',
    description: 'The deep ancestral epicenter and continental root of all African ethnic lineages and sovereign branches.',
    coords: { x: 2214.2903, y: 2227.8188, r: 42 }
  },
  'node--origin--region--central-midle-africa': {
    name: 'West Central Africa (Congo, Angola, Cabinda)',
    type: 'central',
    region: 'Central Africa',
    tastVolumeShare: 45.2,
    count: '5,691,458 Captives (Cohort 1)',
    description: 'Largest single regional embarkation origin in the transatlantic trade (Kingdom of Kongo, Loango, Ndongo).',
    coords: { x: 2011.6033, y: 2397.0272, r: 24 }
  },
  'node--origin--region--east-guinea': {
    name: 'East Guinea (Bights of Benin & Biafra)',
    type: 'central',
    region: 'Western Africa',
    tastVolumeShare: 38.1,
    count: '4,804,369 Captives (Cohort 2)',
    description: 'Historical corridor encompassing Dahomey, Yoruba kingdoms, Igbo confederations, and the Niger Delta estuaries.',
    coords: { x: 2110.12, y: 2085.34, r: 22 }
  },
  'node--origin--region--west-guinea': {
    name: 'West Guinea (Upper Guinea & Senegambia)',
    type: 'central',
    region: 'Western Africa',
    tastVolumeShare: 16.1,
    count: '2,025,527 Captives (Cohort 3)',
    description: 'Senegambia, Sierra Leone, and Windward Coast maritime corridors; vital source of artisanal and rice-cultivation expertise.',
    coords: { x: 2045.54, y: 1950.12, r: 20 }
  },
  'node--origin--region--west-sahel': {
    name: 'Western Sahel (Mali, Niger, Mauritania)',
    type: 'central',
    region: 'Western Africa',
    tastVolumeShare: 2.8,
    description: 'Trans-Saharan caravan crossroads connecting riverine Mali, desert Mauritania, and the Hausa kingdoms of Niger.',
    coords: { x: 2085.28, y: 950.27, r: 18 }
  },
  'node--origin--region--east-sahel': {
    name: 'Eastern Sahel & Lake Chad Basin',
    type: 'central',
    region: 'Central Africa',
    description: 'Ancient Kanem-Bornu empire domain and cultural crossroads linking Central Africa with the Nile Valley.',
    coords: { x: 2420.15, y: 1860.45, r: 18 }
  },
  'node--origin--region--southern-africa': {
    name: 'Southern Africa & Southeast Coast',
    type: 'central',
    region: 'Southern Africa',
    tastVolumeShare: 4.3,
    description: 'Mozambique Channel and South East African embarkations directed towards Brazil and the Mascarene Islands.',
    coords: { x: 2480.60, y: 2540.30, r: 20 }
  },
  'node--origin--region--northeast-africa': {
    name: 'Northeast Africa & Nile Corridor',
    type: 'central',
    region: 'Eastern Africa',
    description: 'Nubian, Ethiopian highland, and Red Sea trading networks with ancient linguistic continuity.',
    coords: { x: 2550.80, y: 1980.20, r: 18 }
  },
  'node--origin--region--northwest-africa': {
    name: 'Northwest Africa & Maghreb',
    type: 'central',
    region: 'Northern Africa',
    description: 'Berber and trans-Saharan trading frontiers along the Atlas and Atlantic coasts.',
    coords: { x: 1920.40, y: 1750.10, r: 18 }
  },
  'node--country--niger': {
    name: 'Niger',
    type: 'country',
    region: 'Western Africa',
    tastVolumeShare: 1.4,
    description: 'Sovereign Sahelian territory with deep Tuareg, Kanuri, and Hausa cultural genealogies.',
    coords: { x: 2085.2883, y: 950.2763, r: 14 }
  },
  'node--country--mali': {
    name: 'Mali',
    type: 'country',
    region: 'Western Africa',
    tastVolumeShare: 2.1,
    description: 'Heartland of the Mali and Songhai empires, characterized by rich Bambara, Malinke, and Peul traditions.',
    coords: { x: 1840.6133, y: 993.8377, r: 14 }
  },
  'node--country--mauritania': {
    name: 'Mauritania',
    type: 'country',
    region: 'Western Africa',
    tastVolumeShare: 0.9,
    description: 'Atlantic Saharan gateway with mixed Berber-Arab Moorish and Pulaar cultural communities.',
    coords: { x: 1693.6092, y: 1043.5318, r: 14 }
  },
  'node--geo--cabo-verde': {
    name: 'Cabo Verde Crucible Hub',
    type: 'cabo-verde',
    region: 'Western Africa (Macaronesia)',
    description: 'Historical pivot and first Afro-Atlantic Creole crucible, serving as the foundational nexus of transatlantic trade and linguistic diffusion.',
    coords: { x: 924.3822, y: 1842.1054, r: 24 }
  },
  'quant--first--circle--totals--5691458': {
    name: '1st Cohort Volume: 5,691,458 Captives',
    type: 'quant',
    count: '5,691,458 Captives',
    description: 'Documented volume across West-Central Africa (Congo, Angola, Cabinda) embarked to the Americas.',
    coords: { x: 2214.2903, y: 2227.8188, r: 380 }
  },
  'quant--second--circle--totals--4804369': {
    name: '2nd Cohort Volume: 4,804,369 Captives',
    type: 'quant',
    count: '4,804,369 Captives',
    description: 'Documented volume across the Bights of Benin and Biafra embarked to the Americas.',
    coords: { x: 2214.2903, y: 2227.8188, r: 520 }
  },
  'quant--third--circle--totals--2025527': {
    name: '3rd Cohort Volume: 2,025,527 Captives',
    type: 'quant',
    count: '2,025,527 Captives',
    description: 'Documented volume across Gold Coast, Senegambia, and Windward Coast embarked to the Americas.',
    coords: { x: 2214.2903, y: 2227.8188, r: 660 }
  }
};

// UN GeoScheme Africa Sovereign Country ID Map for SVG #geo--Africa--un-geoscheme
export const COUNTRY_TO_GEO_ID_MAP: Record<string, string> = {
  'botswana': 'geo--country--Botswana--bw',
  'namibia': 'geo--country--Namibia--na',
  'south africa': 'geo--country--South-Africa--za',
  'lesotho': 'geo--country--Lesotho--ls',
  'eswatini': 'geo--country--Eswatini--sz',
  'swaziland': 'geo--country--Eswatini--sz',
  'madagascar': 'geo--country--Madagascar--mg',
  'kenya': 'geo--country--Kenya--ke',
  'somalia': 'geo--country--Somalia--so',
  'uganda': 'geo--country--Uganda--ug',
  'mozambique': 'geo--country--Mozambique--mz',
  'zambia': 'geo--country--Zambia--zm',
  'ethiopia': 'geo--country--Ethiopia--et',
  'tanzania': 'geo--country--Tanzania--tz',
  'burundi': 'geo--country--Burundi--bi',
  'djibouti': 'geo--country--Djibouti--dj',
  'rwanda': 'geo--country--Rwanda--rw',
  'malawi': 'geo--country--Malawi--mw',
  'zimbabwe': 'geo--country--Zimbabwe--zw',
  'eritrea': 'geo--country--Eritrea--er',
  'comoros': 'geo--country--Comoros--km',
  'mauritius': 'geo--country--Mauritius--mu',
  'mayotte': 'geo--country--Mayotte--yt',
  'reunion': 'geo--country--Reunion--re',
  'south sudan': 'geo--country--South-Sudan--ss',
  'cameroon': 'geo--country--Cameroon--cm',
  'democratic republic of the congo': 'geo--country--Democratic-Republic-of-the-Congo--cd',
  'drc': 'geo--country--Democratic-Republic-of-the-Congo--cd',
  'angola': 'geo--country--Angola--ao',
  'chad': 'geo--country--Chad--td',
  'equatorial guinea': 'geo--country--Equatorial-Guinea--gq',
  'congo': 'geo--country--Congo--cg',
  'republic of the congo': 'geo--country--Congo--cg',
  'gabon': 'geo--country--Gabon--ga',
  'central african republic': 'geo--country--Central-African-Republic--cf',
  'sao tome and principe': 'geo--country--Sao-Tome-and-Principe--st',
  'burkina faso': 'geo--country--Burkina-Faso--bf',
  'cote d\'ivoire': 'geo--country--Cote-Divoire--ci',
  'cote divoire': 'geo--country--Cote-Divoire--ci',
  'ivory coast': 'geo--country--Cote-Divoire--ci',
  'côte d’ivoire': 'geo--country--Cote-Divoire--ci',
  'sierra leone': 'geo--country--Sierra-Leone--sl',
  'mali': 'geo--country--Mali--ml',
  'guinea-bissau': 'geo--country--Guine-Bissau--gw',
  'guine-bissau': 'geo--country--Guine-Bissau--gw',
  'ghana': 'geo--country--Ghana--gh',
  'mauritania': 'geo--country--Mauritania--mr',
  'niger': 'geo--country--Niger--ne',
  'guinea': 'geo--country--Guinea--gn',
  'nigeria': 'geo--country--Nigeria--ng',
  'senegal': 'geo--country--Senegal--sn',
  'togo': 'geo--country--Togo--tg',
  'liberia': 'geo--country--Liberia--lr',
  'benin': 'geo--country--Benin--bj',
  'the gambia': 'geo--country--The-Gambia--gm',
  'gambia': 'geo--country--The-Gambia--gm',
  'cabo verde': 'geo--country--Cabo-Verde--cv',
  'cape verde': 'geo--country--Cabo-Verde--cv',
  'libya': 'geo--country--Libya--ly',
  'algeria': 'geo--country--Algeria--dz',
  'sudan': 'geo--country--Sudan--sd',
  'western sahara': 'geo--country--Western-Sahara--eh',
  'tunisia': 'geo--country--Tunisia--tn',
  'egypt': 'geo--country--Egypt--eg',
  'morocco': 'geo--country--Morocco--ma'
};

export function getGeoCountryId(countryName?: string): string | null {
  if (!countryName) return null;
  const clean = countryName.toLowerCase().trim().replace(/[’']/g, "'");
  if (COUNTRY_TO_GEO_ID_MAP[clean]) return COUNTRY_TO_GEO_ID_MAP[clean];
  for (const [k, v] of Object.entries(COUNTRY_TO_GEO_ID_MAP)) {
    if (clean.includes(k) || k.includes(clean)) return v;
  }
  return null;
}

// Historical & UN GeoScheme Region to Country Mappings for accurate regional filtering
const HISTORICAL_REGION_COUNTRY_MAP: Record<string, string[]> = {
  'West Sahel': ['senegal', 'cape-verde', 'guinea-bissau', 'guinea-conacry', 'burkina-faso'],
  'East Sahel': ['chad', 'sudan', 'nubia-south-sudan', 'eritrea'],
  'East Guinea': ['nigeria', 'cameroon', 'benin', 'ghana', 'ivory-coast', 'sierra-leone'],
  'Western Africa': ['nigeria', 'benin', 'ghana', 'ivory-coast', 'burkina-faso', 'sierra-leone', 'guinea-conacry', 'guinea-bissau', 'senegal', 'cape-verde'],
  'Central Africa': ['angola', 'drc', 'gabon', 'rc', 'cameroon', 'car', 'chad'],
  'Southern Africa': ['south-africa', 'mozambique'],
  'Northern Africa': ['sudan', 'egypt', 'libya', 'morocco'],
  'Eastern Africa': ['tanzania', 'kenya', 'uganda', 'rwanda', 'nubia-south-sudan', 'ethiopia', 'somalia', 'eritrea']
};

export const AfricaliaExplorer: React.FC<AfricaliaExplorerProps> = ({
  onSelectReport,
  onNavigateToSlaveTrade,
  onNavigateToMolecular,
  onNavigateToFoundations,
  onNavigateToLanguages
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Accessible ARIA announcement for screen readers on camera refocus
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('Africalia sovereign ethnic tree loaded');

  // Shared Viewport, Zoom, Pan & Keyboard/Pinch/Inertia state via custom hook
  const {
    zoom,
    setZoom,
    fitScale,
    setFitScale,
    pos,
    setPos,
    isDragging,
    dragStart,
    isPinching,
    handleZoomDelta,
    panToCoordinates,
    fitToBounds,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel
  } = useCanvasViewport(containerRef, {
    initialZoom: 1.0,
    minZoom: 0.64,
    maxZoom: 6.0,
    baseFitScale: 0.65
  });

  // Custom SVG upload and dynamic fetch state
  const [customSvgMarkup, setCustomSvgMarkup] = useState<string | null>(null);
  const [isSvgLoading, setIsSvgLoading] = useState<boolean>(true);
  const [canvasBg, setCanvasBg] = useState<'parchment' | 'white' | 'sepia'>('parchment');

  // Dynamically fetch public master SVG with cache busting, while bundled fallback is immediately available
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) setIsSvgLoading(false);
    }, 450);

    const base = (import.meta.env?.BASE_URL || './').replace(/\/$/, '');
    const assetUrl = `${base}/africalia-ethnic-tree.svg?t=${Date.now()}`;
    fetch(assetUrl, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(svgText => {
        if (isMounted && svgText && svgText.includes('<svg')) {
          setCustomSvgMarkup(svgText);
        }
      })
      .catch(err => {
        console.info('Using bundled authentic master SVG:', err);
      })
      .finally(() => {
        if (isMounted) {
          setTimeout(() => setIsSvgLoading(false), 200);
        }
      });
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Active raw SVG markup displayed in DOM with guaranteed ID for CSS targeting
  const rawSvgToDisplay = useMemo(() => {
    let svg = customSvgMarkup || AUTHENTIC_ETHNIC_TREE_RAW_SVG;
    if (svg && !svg.includes('id="africalia-master-sovereign-svg"')) {
      svg = svg.replace('<svg ', '<svg id="africalia-master-sovereign-svg" ');
    }
    return svg;
  }, [customSvgMarkup]);

  // Selection & Inspector state
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntityData | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedLinguisticFamily, setSelectedLinguisticFamily] = useState<string>('All');
  const [activeTastLayer, setActiveTastLayer] = useState<'all' | 'first' | 'second' | 'third'>('all');
  
  // Expandable bottom control bar state (user requested: only expand by clicking icon)
  const [isControlBarExpanded, setIsControlBarExpanded] = useState<boolean>(false);
  // Top bar expanded/collapsed title state
  const [isTopBarExpanded, setIsTopBarExpanded] = useState<boolean>(false);
  // Africa UN Geo Scheme continent visibility on geography layer
  const [showUnGeoScheme, setShowUnGeoScheme] = useState<boolean>(true);
  // Sovereign silhouette spotlight glow (dims tree and highlights country contour)
  const [silhouetteGlowEnabled, setSilhouetteGlowEnabled] = useState<boolean>(true);
  // Search dropdown open state
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);

  // Cultural Dossier Collapse States
  const [isDossierCollapsed, setIsDossierCollapsed] = useState<boolean>(false);
  const [isCountryDossierCollapsed, setIsCountryDossierCollapsed] = useState<boolean>(false);

  // Independent Country Geography Alignment Engine
  // Transforms the SVG geography polygon directly under the radial country/ethnic label upon zoom
  const [isTerritoryAlignmentEnabled, setIsTerritoryAlignmentEnabled] = useState<boolean>(true);
  const displacedGeoElementsRef = useRef<Array<{ element: SVGGraphicsElement; originalTransform: string; originalFilter: string }>>([]);

  const resetTerritoryDisplacements = useCallback(() => {
    if (displacedGeoElementsRef.current.length > 0) {
      displacedGeoElementsRef.current.forEach(({ element, originalTransform, originalFilter }) => {
        element.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.3s ease';
        if (originalTransform) {
          element.setAttribute('transform', originalTransform);
          element.style.transform = originalTransform;
        } else {
          element.removeAttribute('transform');
          element.style.transform = '';
        }
        element.style.filter = originalFilter || '';
        element.removeAttribute('data-displaced-territory');
      });
      displacedGeoElementsRef.current = [];
    }
  }, []);

  const alignCountryGeometryUnderLabel = useCallback((countryName: string) => {
    if (!containerRef.current || !isTerritoryAlignmentEnabled || !countryName) return;

    resetTerritoryDisplacements();

    const cleanSlug = countryName.toLowerCase()
      .replace(/^the\s+/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+$/, '');

    const conduit = AFRICALIA_COUNTRY_CONDUITS.find(c => 
      c.name.toLowerCase() === countryName.toLowerCase() || 
      c.id.toLowerCase() === cleanSlug ||
      c.countryCode.toLowerCase() === cleanSlug ||
      (cleanSlug === 'cape-verde' && c.name.toLowerCase().includes('verde')) ||
      (cleanSlug === 'cabo-verde' && c.name.toLowerCase().includes('verde')) ||
      (cleanSlug === 'ivory-coast' && c.id === 'ivory-coast') ||
      (cleanSlug === 'cote-d-ivoire' && c.id === 'ivory-coast') ||
      (cleanSlug === 'dr-congo' && c.id === 'dr-congo') ||
      (cleanSlug === 'drc' && c.id === 'dr-congo') ||
      (cleanSlug === 'republic-of-the-congo' && c.id === 'republic-of-the-congo') ||
      (cleanSlug === 'congo' && c.id === 'republic-of-the-congo')
    );

    if (!conduit) return;

    // Direct authoritative lookup of the country polygon group in #geo--Africa--un-geoscheme
    const targetGeoId = getGeoCountryId(countryName) || getGeoCountryId(conduit.name);
    
    let targetEl: SVGGraphicsElement | null = null;
    if (targetGeoId) {
      targetEl = containerRef.current.querySelector<SVGGraphicsElement>(`#${targetGeoId}`);
    }
    if (!targetEl) {
      const slugVariants = [
        cleanSlug,
        cleanSlug === 'cabo-verde' ? 'cape-verde' : '',
        cleanSlug === 'cape-verde' ? 'cabo-verde' : '',
        cleanSlug === 'cote-d-ivoire' ? 'ivory-coast' : '',
        cleanSlug === 'ivory-coast' ? 'cote-d-ivoire' : '',
        cleanSlug === 'dr-congo' ? 'democratic-republic-of-the-congo' : '',
        cleanSlug === 'republic-of-the-congo' ? 'congo' : ''
      ].filter(Boolean);

      for (const v of slugVariants) {
        targetEl = containerRef.current.querySelector<SVGGraphicsElement>(`#geo--Africa--un-geoscheme g[id*="${v}" i]`) ||
                   containerRef.current.querySelector<SVGGraphicsElement>(`g[id*="geo--country--${v}" i]`);
        if (targetEl) break;
      }
    }

    if (!targetEl || typeof targetEl.getBBox !== 'function') return;

    try {
      const bbox = targetEl.getBBox();
      if (bbox && bbox.width > 5 && bbox.height > 5) {
        const geoCenterX = bbox.x + bbox.width / 2;
        const geoCenterY = bbox.y + bbox.height / 2;

        const deltaX = Math.round(conduit.labelX - geoCenterX);
        const deltaY = Math.round(conduit.labelY - geoCenterY);

        displacedGeoElementsRef.current.push({
          element: targetEl,
          originalTransform: targetEl.getAttribute('transform') || targetEl.style.transform || '',
          originalFilter: targetEl.style.filter || ''
        });

        targetEl.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.4s ease';
        targetEl.setAttribute('transform', `translate(${deltaX} ${deltaY})`);
        targetEl.style.filter = 'drop-shadow(0 0 16px rgba(230,126,72,0.65))';
        targetEl.setAttribute('data-displaced-territory', 'true');
      }
    } catch {
      // ignore getBBox calculation errors
    }
  }, [containerRef, isTerritoryAlignmentEnabled, resetTerritoryDisplacements]);

  // Unified Floating Pill & Draggable Panel States (User requested: Unified Collapsed Pill default)
  const [isUnifiedPanelOpen, setIsUnifiedPanelOpen] = useState<boolean>(false);
  const [isUnifiedPanelMinimized, setIsUnifiedPanelMinimized] = useState<boolean>(false);
  
  // Web Worker for asynchronous background ethnic search and indexation
  const [workerSearchResults, setWorkerSearchResults] = useState<{ id: string; name: string; type: 'ethnic' | 'country'; region: string; country?: string; languages?: string; x?: number; y?: number }[] | null>(null);
  const ethnicWorkerRef = useRef<Worker | null>(null);

  // Transient Pinch-to-Zoom feedback badge state
  const [showPinchFeedback, setShowPinchFeedback] = useState<boolean>(false);
  const pinchFeedbackTimeoutRef = useRef<number | null>(null);
  
  const majorLinguisticFamilies = useMemo(() => getMajorLinguisticFamilies(), []);

  // Single Left Dock Collapse State (never stacks with other panels)
  const [isLeftDockOpen, setIsLeftDockOpen] = useState<boolean>(true);
  const [methodologyModalOpen, setMethodologyModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Fit View: Full continental tree overview (hard minimum scale limit 64% enforced, centered)
  const fitView = useCallback(() => {
    resetTerritoryDisplacements();
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    
    const optimalScale = Math.max(clientWidth, clientHeight) / 2800;
    const clampedScale = Math.min(Math.max(optimalScale, 0.45), 1.25);
    const minZoom = 0.64; // Enforced hard minimum scale limit of 64% (0.64)
    
    setFitScale(clampedScale);
    setZoom(minZoom);
    const nextScale = clampedScale * minZoom;
    setPos({
      x: clientWidth / 2 - CX * nextScale,
      y: clientHeight / 2 - CY * nextScale
    });
  }, [containerRef, setFitScale, setZoom, setPos, resetTerritoryDisplacements]);

  // Prominent view: Zoom and center directly on the Cabo Verde Maritime Crucible ellipse node & lineages
  const panToCrucible = useCallback(() => {
    resetTerritoryDisplacements();
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const optimalScale = Math.max(clientWidth, clientHeight) / 2800;
    const clampedScale = Math.min(Math.max(optimalScale, 0.45), 1.25);
    const targetZoom = 2.8;
    setFitScale(clampedScale);
    setZoom(targetZoom);
    // Focus coordinates: Cabo Verde ellipse node (cx="1188.4369" cy="2708.2075")
    const targetX = 1188.4369;
    const targetY = 2708.2075;
    const nextScale = clampedScale * targetZoom;
    setPos({
      x: clientWidth / 2 - targetX * nextScale,
      y: clientHeight / 2 - targetY * nextScale
    });
    setLiveAnnouncement('Framed West Africa conduit: Cabo Verde Maritime Crucible & Atlantic lineages');
    setTimeout(() => alignCountryGeometryUnderLabel('Cabo Verde'), 60);
  }, [containerRef, setFitScale, setZoom, setPos, resetTerritoryDisplacements, alignCountryGeometryUnderLabel]);

  // Upper middle top region start view
  const startUpperTopView = useCallback(() => {
    resetTerritoryDisplacements();
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const optimalScale = Math.max(clientWidth, clientHeight) / 2800;
    const clampedScale = Math.min(Math.max(optimalScale, 0.45), 1.25);
    const startZoom = 1.0;
    setFitScale(clampedScale);
    setZoom(startZoom);
    // Upper middle top region of the tree canopy
    const targetX = CX; // 2166.382
    const targetY = 1150; // Upper middle top region
    const nextScale = clampedScale * startZoom;
    setPos({
      x: clientWidth / 2 - targetX * nextScale,
      y: clientHeight / 2 - targetY * nextScale
    });
  }, [containerRef, setFitScale, setZoom, setPos, resetTerritoryDisplacements]);

  // Handler to clear all selection and reset view and search fields
  const handleClearFocus = useCallback(() => {
    setSelectedEntity(null);
    setSearchQuery('');
    setSelectedRegion('All');
    setSelectedCountry('All');
    setSelectedLinguisticFamily('All');
    setIsSearchDropdownOpen(false);
    resetTerritoryDisplacements();
    fitView();
    setLiveAnnouncement('View reset to full continental overview');
  }, [fitView, resetTerritoryDisplacements]);

  // Initial load: Start at the upper middle top region of the tree
  const initialFramedRef = useRef(false);
  useEffect(() => {
    if (!initialFramedRef.current) {
      startUpperTopView();
      initialFramedRef.current = true;
    }
    const handleResize = () => startUpperTopView();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [startUpperTopView]);

  // Precision aggregate zoom transition to bring all country branches, nodes, labels, and contours clearly in view
  const zoomToCountryRegion = useCallback((countryName: string, entityFallbackCoords?: { x: number, y: number }) => {
    if (!containerRef.current || !countryName) return;
    
    // Resolve canonical country name if an ethnic or regional name was passed
    const authorCountry = getAuthoritativeCountryForEthnic(countryName);
    const canonicalCountry = authorCountry || countryName;

    const cleanSlug = canonicalCountry.toLowerCase()
      .replace(/^the\s+/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+$/, '');

    // 1. Center SVG Country Territory polygon under lineage label on zoom
    alignCountryGeometryUnderLabel(canonicalCountry);

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let foundPoints = 0;

    // 2. Gather all conduit geometric coordinates from AFRICALIA_COUNTRY_CONDUITS
    const conduit = AFRICALIA_COUNTRY_CONDUITS.find(c => 
      c.name.toLowerCase() === canonicalCountry.toLowerCase() || 
      c.id.toLowerCase() === cleanSlug ||
      c.countryCode.toLowerCase() === cleanSlug ||
      (cleanSlug === 'cape-verde' && c.name.toLowerCase().includes('verde')) ||
      (cleanSlug === 'cabo-verde' && c.name.toLowerCase().includes('verde')) ||
      (cleanSlug === 'ivory-coast' && c.id === 'ivory-coast') ||
      (cleanSlug === 'cote-d-ivoire' && c.id === 'ivory-coast') ||
      (cleanSlug === 'dr-congo' && c.id === 'dr-congo') ||
      (cleanSlug === 'drc' && c.id === 'dr-congo') ||
      (cleanSlug === 'republic-of-the-congo' && c.id === 'republic-of-the-congo') ||
      (cleanSlug === 'congo' && c.id === 'republic-of-the-congo')
    );

    if (conduit) {
      // Include country label
      minX = Math.min(minX, conduit.labelX - 100);
      maxX = Math.max(maxX, conduit.labelX + 100);
      minY = Math.min(minY, conduit.labelY - 50);
      maxY = Math.max(maxY, conduit.labelY + 50);

      // Include trunk start and end
      minX = Math.min(minX, conduit.trunkEndX - 40, conduit.trunkStartX - 40);
      maxX = Math.max(maxX, conduit.trunkEndX + 40, conduit.trunkStartX + 40);
      minY = Math.min(minY, conduit.trunkEndY - 40, conduit.trunkStartY - 40);
      maxY = Math.max(maxY, conduit.trunkEndY + 40, conduit.trunkStartY + 40);

      // Include all ethnic group coordinates
      if (conduit.ethnicGroups && conduit.ethnicGroups.length > 0) {
        conduit.ethnicGroups.forEach(eg => {
          minX = Math.min(minX, eg.nodeX - 70);
          maxX = Math.max(maxX, eg.nodeX + 70);
          minY = Math.min(minY, eg.nodeY - 40);
          maxY = Math.max(maxY, eg.nodeY + 40);
        });
      }
      foundPoints += 1;
    }

    // 3. Include entity fallback coordinates if valid in root SVG coordinates
    if (entityFallbackCoords && entityFallbackCoords.x > 100 && entityFallbackCoords.y > 100) {
      minX = Math.min(minX, entityFallbackCoords.x - 70);
      maxX = Math.max(maxX, entityFallbackCoords.x + 70);
      minY = Math.min(minY, entityFallbackCoords.y - 40);
      maxY = Math.max(maxY, entityFallbackCoords.y + 40);
      foundPoints += 1;
    }

    // 4. Include the country's actual geographic silhouette from #geo--Africa--un-geoscheme
    if (containerRef.current) {
      const geoId = getGeoCountryId(canonicalCountry);
      if (geoId) {
        const geoEl = containerRef.current.querySelector<SVGGraphicsElement>(`#${geoId}`);
        if (geoEl && typeof geoEl.getBBox === 'function') {
          try {
            const b = geoEl.getBBox();
            if (b && b.width > 2 && b.height > 2 && b.width < 3800 && b.height < 3800) {
              let dx = 0;
              let dy = 0;
              const transformAttr = geoEl.getAttribute('transform');
              if (transformAttr) {
                const transMatch = transformAttr.match(/translate\(\s*([-\d.]+)[,\s]+([-\d.]+)\s*\)/i);
                if (transMatch) {
                  dx = parseFloat(transMatch[1]) || 0;
                  dy = parseFloat(transMatch[2]) || 0;
                }
              }
              const gX = b.x + dx;
              const gY = b.y + dy;
              minX = Math.min(minX, gX);
              minY = Math.min(minY, gY);
              maxX = Math.max(maxX, gX + b.width);
              maxY = Math.max(maxY, gY + b.height);
              foundPoints += 1;
            }
          } catch {
            // ignore getBBox error
          }
        }
      }

      // 5. Query branch and node elements in the SVG DOM belonging to this country
      const slugVariants = [
        cleanSlug,
        cleanSlug === 'cabo-verde' ? 'cape-verde' : '',
        cleanSlug === 'cape-verde' ? 'cabo-verde' : '',
        cleanSlug === 'cote-d-ivoire' ? 'ivory-coast' : '',
        cleanSlug === 'ivory-coast' ? 'cote-d-ivoire' : '',
        cleanSlug === 'dr-congo' ? 'drc' : '',
        cleanSlug === 'republic-of-the-congo' ? 'rc' : '',
        cleanSlug === 'equatorial-guinea' ? 'guine-eq' : '',
        cleanSlug === 'guinea-bissau' ? 'guine-bissau' : '',
        cleanSlug === 'guinea' ? 'guinea-conacry' : '',
        cleanSlug === 'south-sudan' ? 'nubia--south-sudan' : ''
      ].filter(Boolean);

      const branchSelectors = slugVariants.flatMap(v => [
        `[id*="branch--ethnic--"][id*="${v}"]`,
        `[id*="branch--country--${v}"]`,
        `[id*="--country--${v}"]`,
        `[id="branches--country--${v}"]`,
        `[id="nodes--ethnic--country--${v}"]`
      ]).join(',');

      try {
        const elements = containerRef.current.querySelectorAll(branchSelectors);
        elements.forEach(node => {
          const svgEl = node as SVGGraphicsElement;
          if (typeof svgEl.getBBox === 'function') {
            const b = svgEl.getBBox();
            if (b && b.x > 100 && b.y > 100 && b.width > 2 && b.height > 2 && b.width < 3500 && b.height < 3500) {
              minX = Math.min(minX, b.x);
              minY = Math.min(minY, b.y);
              maxX = Math.max(maxX, b.x + b.width);
              maxY = Math.max(maxY, b.y + b.height);
              foundPoints += 1;
            }
          }
        });
      } catch {
        // querySelector error fallback
      }
    }

    const drawerOffset = isDossierCollapsed ? 0 : 380;
    if (foundPoints > 0 && isFinite(minX) && isFinite(minY) && isFinite(maxX) && isFinite(maxY) && (maxX - minX) > 20) {
      fitToBounds({ minX, minY, maxX, maxY }, { padding: 90, maxZoom: 2.6, minZoom: 0.85, drawerWidth: drawerOffset });
      setLiveAnnouncement(`Framed sovereign country silhouette, lineage branches, and nodes for ${canonicalCountry}`);
      return;
    }

    if (conduit) {
      panToCoordinates(conduit.labelX, conduit.labelY, 1.9, { xOffset: drawerOffset });
      setLiveAnnouncement(`Framed ${canonicalCountry} conduit and branches`);
    } else if (entityFallbackCoords && entityFallbackCoords.x > 100 && entityFallbackCoords.y > 100) {
      panToCoordinates(entityFallbackCoords.x, entityFallbackCoords.y, 1.9, { xOffset: drawerOffset });
      setLiveAnnouncement(`Framed ${canonicalCountry} lineages`);
    }
  }, [fitToBounds, panToCoordinates, isDossierCollapsed]);

  // Combined search dataset enriched with Wikipedia African Atlas
  // Initialize Web Worker for background search off-main-thread
  useEffect(() => {
    try {
      ethnicWorkerRef.current = new Worker(
        new URL('../../workers/ethnicAtlasWorker.ts', import.meta.url),
        { type: 'module' }
      );

      ethnicWorkerRef.current.onmessage = (e: MessageEvent<WorkerSearchResponse>) => {
        if (e.data.type === 'SEARCH_AND_INDEX_RESULT') {
          const mapped = e.data.results.map(entry => {
            // Find coordinate conduit if already in tree or match from homeland string
            const matchedConduit = AFRICALIA_COUNTRY_CONDUITS.find(c => 
              (entry.homeland && entry.homeland.toLowerCase().includes(c.name.toLowerCase())) ||
              c.ethnicGroups.some(g => g.name.toLowerCase() === entry.name.toLowerCase())
            );
            const eg = matchedConduit?.ethnicGroups.find(g => 
              g.name.toLowerCase() === entry.name.toLowerCase()
            );

            return {
              id: `worker-${entry.name.toLowerCase().replace(/\s+/g, '-')}`,
              name: entry.name,
              type: 'ethnic' as const,
              region: matchedConduit?.region || 'African Continent',
              country: matchedConduit?.name || entry.homeland || undefined,
              languages: entry.languages || undefined,
              x: eg?.nodeX,
              y: eg?.nodeY
            };
          });
          setWorkerSearchResults(mapped);
        }
      };
    } catch {
      // Fallback cleanly to main thread if worker environment is unavailable
      ethnicWorkerRef.current = null;
    }

    return () => {
      ethnicWorkerRef.current?.terminate();
      ethnicWorkerRef.current = null;
    };
  }, []);

  // Post search task to Web Worker when user types or filters change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setWorkerSearchResults(null);
      return;
    }

    if (ethnicWorkerRef.current) {
      const req: WorkerSearchRequest = {
        type: 'SEARCH_AND_INDEX',
        query: searchQuery,
        region: selectedRegion,
        country: selectedCountry,
        linguisticFamily: selectedLinguisticFamily
      };
      ethnicWorkerRef.current.postMessage(req);
    }
  }, [searchQuery, selectedRegion, selectedCountry, selectedLinguisticFamily]);

  // Track active pinching to display floating feedback chip
  useEffect(() => {
    if (isPinching) {
      setShowPinchFeedback(true);
      if (pinchFeedbackTimeoutRef.current) {
        window.clearTimeout(pinchFeedbackTimeoutRef.current);
        pinchFeedbackTimeoutRef.current = null;
      }
    } else if (showPinchFeedback) {
      pinchFeedbackTimeoutRef.current = window.setTimeout(() => {
        setShowPinchFeedback(false);
      }, 900);
    }
    return () => {
      if (pinchFeedbackTimeoutRef.current) {
        window.clearTimeout(pinchFeedbackTimeoutRef.current);
      }
    };
  }, [isPinching, showPinchFeedback]);

  // Combined search dataset enriched with Wikipedia African Atlas & Historical Regions
  const searchIndex = useMemo(() => {
    const list: { 
      id: string; 
      name: string; 
      type: 'country' | 'ethnic' | 'region' | 'admin1'; 
      region: string; 
      country?: string; 
      languages?: string;
      x?: number; 
      y?: number 
    }[] = [];
    
    // Regions
    AFRICALIA_REGIONS.forEach(r => {
      list.push({ id: `region-${r.value}`, name: r.label, type: 'region', region: r.label });
    });

    // Countries & Ethnic Groups from Conduits
    AFRICALIA_COUNTRY_CONDUITS.forEach(c => {
      list.push({
        id: c.id,
        name: c.name,
        type: 'country',
        region: c.region,
        x: c.labelX,
        y: c.labelY
      });
      c.ethnicGroups.forEach(eg => {
        const wiki = findWikipediaEntry(eg.name);
        list.push({
          id: `${c.id}-${eg.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: eg.name,
          type: 'ethnic',
          region: c.region,
          country: c.name,
          languages: wiki?.languages,
          x: eg.nodeX,
          y: eg.nodeY
        });
      });
    });

    // Additional entries from Wikipedia Master Table
    WIKIPEDIA_TABLE_ENTRIES.forEach(w => {
      const alreadyExists = list.some(item => item.name.toLowerCase() === w.name.toLowerCase());
      if (!alreadyExists) {
        list.push({
          id: `wiki-${w.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: w.name,
          type: 'ethnic',
          region: 'African Continent',
          country: w.homeland ? w.homeland.split('(')[0].trim() : undefined,
          languages: w.languages
        });
      }
    });

    // UN M49 Level 1 Administrative Subdivisions (Admin-1)
    ALL_ADMIN1_SUBDIVISIONS.forEach(adm => {
      const conduit = AFRICALIA_COUNTRY_CONDUITS.find(c =>
        (adm.iso3 && c.id.toLowerCase() === adm.iso3.toLowerCase()) ||
        (adm.countryName && c.name.toLowerCase() === adm.countryName.toLowerCase())
      );
      list.push({
        id: adm.id,
        name: `${adm.name} (${adm.admin1Code})`,
        type: 'admin1',
        region: adm.regionName || 'UN Geoscheme',
        country: adm.countryName,
        x: conduit?.labelX,
        y: conduit?.labelY
      });
    });

    return list;
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    // If worker results are populated, prioritize enriched worker results
    if (workerSearchResults && workerSearchResults.length > 0) {
      return workerSearchResults.slice(0, 10);
    }

    const q = searchQuery.toLowerCase();
    return searchIndex.filter(item => {
      if (item.name.toLowerCase().includes(q) || item.region.toLowerCase().includes(q)) return true;
      if (item.country && item.country.toLowerCase().includes(q)) return true;
      if (item.languages && item.languages.toLowerCase().includes(q)) return true;
      
      // Match historical region names if applicable
      for (const [histRegion, countryIds] of Object.entries(HISTORICAL_REGION_COUNTRY_MAP)) {
        if (histRegion.toLowerCase().includes(q)) {
          const conduit = AFRICALIA_COUNTRY_CONDUITS.find(c => 
            (item.type === 'country' && c.name.toLowerCase() === item.name.toLowerCase() && countryIds.includes(c.id)) ||
            (item.type === 'ethnic' && c.name.toLowerCase() === item.country?.toLowerCase() && countryIds.includes(c.id))
          );
          if (conduit) return true;
        }
      }
      return false;
    }).slice(0, 10);
  }, [searchQuery, searchIndex, workerSearchResults]);

  // Linguistic Family Filtered Groups
  const linguisticFilteredGroups = useMemo(() => {
    if (selectedLinguisticFamily === 'All') return [];
    const q = selectedLinguisticFamily.toLowerCase();
    return searchIndex.filter(item => 
      item.type === 'ethnic' && item.languages && item.languages.toLowerCase().includes(q)
    );
  }, [selectedLinguisticFamily, searchIndex]);

  // Available countries filtered by selected region (supports UN GeoScheme & Historical regions: West Sahel, East Sahel, East Guinea)
  const availableCountries = useMemo(() => {
    if (selectedRegion === 'All') return AFRICALIA_COUNTRY_CONDUITS;
    const mappedCountrySlugs = HISTORICAL_REGION_COUNTRY_MAP[selectedRegion];
    if (mappedCountrySlugs && mappedCountrySlugs.length > 0) {
      return AFRICALIA_COUNTRY_CONDUITS.filter(c => mappedCountrySlugs.includes(c.id));
    }
    return AFRICALIA_COUNTRY_CONDUITS.filter(c => c.region === selectedRegion);
  }, [selectedRegion]);

  // Lookup entity by raw SVG element id or name with Wikipedia Cultural Atlas resolution
  const resolveEntityFromSvgElement = useCallback((id: string, element?: SVGElement): SelectedEntityData | null => {
    // 0. Geo Country Silhouette match: e.g. geo--country--Nigeria--ng or geo--country--Cameroon--cm
    if (id.startsWith('geo--country--')) {
      const parts = id.replace('geo--country--', '').split('--');
      const countryRaw = parts[0]?.replace(/-/g, ' ');
      const conduit = AFRICALIA_COUNTRY_CONDUITS.find(c => 
        c.name.toLowerCase() === countryRaw?.toLowerCase() ||
        c.id.toLowerCase() === countryRaw?.toLowerCase()
      );
      const name = conduit?.name || countryRaw || 'African Sovereign Territory';
      return {
        id,
        name,
        type: 'country',
        country: name,
        region: conduit?.region || 'UN GeoScheme African Nation',
        tastVolumeShare: conduit?.tastVolumeShare,
        color: conduit?.color,
        description: `Sovereign UN GeoScheme country silhouette for ${name}.`,
        coords: conduit ? { x: conduit.labelX, y: conduit.labelY, r: 18 } : undefined
      };
    }

    // 1. Direct match in raw SVG map
    if (RAW_SVG_ENTITY_MAP[id]) {
      const match = RAW_SVG_ENTITY_MAP[id];
      const wiki = findWikipediaEntry(match.name || id);
      return {
        id,
        name: match.name || id,
        type: match.type || 'central',
        region: match.region,
        count: match.count,
        tastVolumeShare: match.tastVolumeShare,
        linguisticFamily: wiki?.languages,
        description: match.description || wiki?.extract,
        coords: match.coords
      };
    }

    // 2. Country match: e.g. branch--country--niger or node--country--mali or label--country--cameroon
    const countryMatch = id.match(/(?:branch|node|label)--country--([a-z0-9-]+)/);
    if (countryMatch) {
      const countryRawSlug = countryMatch[1];
      const countrySlug = countryRawSlug.replace(/-\d+$/, ''); // strip trailing numeric suffix like -2
      const conduit = AFRICALIA_COUNTRY_CONDUITS.find(c => 
        c.id.toLowerCase() === countrySlug || 
        c.id.toLowerCase() === countryRawSlug ||
        c.name.toLowerCase().replace(/\s+/g, '-') === countrySlug ||
        (countrySlug === 'guinea-conacry' && c.id === 'guinea') ||
        (countrySlug === 'guinea-eq' && c.id === 'equatorial-guinea') ||
        (countrySlug === 'drc' && c.id === 'dr-congo') ||
        (countrySlug === 'rc' && c.id === 'republic-of-the-congo') ||
        (countrySlug === 'south-namibia' && c.id === 'namibia') ||
        (countrySlug === 'cape-verde' && c.name.toLowerCase().includes('verde'))
      );
      if (conduit) {
        return {
          id,
          name: conduit.name,
          type: 'country',
          country: conduit.name,
          region: conduit.region,
          tastVolumeShare: conduit.tastVolumeShare,
          color: conduit.color,
          description: `Sovereign conduit for ${conduit.name} carrying documented ethnic lineages and embarkation flows.`,
          coords: { x: conduit.labelX, y: conduit.labelY, r: 16 }
        };
      }
    }

    // 3. Ethnic match: e.g. branch--ethnic--tuareg--country--niger or label--ethnic--mafa or assoc--ethnic--baga--country--cabo-verde
    const ethnicPattern = /(?:branch|node|label|assoc)--ethnic--([a-z0-9-]+)(?:--country--([a-z0-9-]+))?/;
    const ethnicMatch = id.match(ethnicPattern);
    if (ethnicMatch) {
      const ethnicSlug = ethnicMatch[1];
      let countrySlug = ethnicMatch[2]?.replace(/-\d+$/, '');

      const textContent = element?.textContent?.trim();
      const rawName = textContent || ethnicSlug.charAt(0).toUpperCase() + ethnicSlug.slice(1).replace(/-/g, ' ');
      // Clean name removes raw hyphenation but keeps human display
      const cleanName = rawName.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
      // Base name strips sub-branch directional or numeric suffixes like N, C, E, S, W, 1, 2
      const baseEthnicName = cleanName
        .replace(/\s+[NCESW]$/i, '')
        .replace(/[-_][ncesw]$/i, '')
        .replace(/\s+\d+$/, '')
        .replace(/[-_]\d+$/, '')
        .trim();

      // Infallible Authoritative Country Resolution
      const authorCountry = getAuthoritativeCountryForEthnic(ethnicSlug) ||
                            getAuthoritativeCountryForEthnic(cleanName) ||
                            getAuthoritativeCountryForEthnic(baseEthnicName);
      
      if (authorCountry && !countrySlug) {
        countrySlug = authorCountry.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }

      // If country is not in the node/label ID itself, query the SVG DOM for its authoritative branch with --country--
      if (!countrySlug && containerRef.current) {
        const branchEl = containerRef.current.querySelector<SVGGraphicsElement>(`[id*="branch--ethnic--${ethnicSlug}--country--"]`) ||
                         containerRef.current.querySelector<SVGGraphicsElement>(`[id*="--ethnic--${ethnicSlug}--country--"]`);
        if (branchEl) {
          const m = branchEl.id.match(/--country--([a-z0-9-]+)/i);
          if (m) countrySlug = m[1].replace(/-\d+$/, '');
        } else {
          // Try base slug without trailing direction (e.g. igbo-n -> igbo)
          const baseSlug = ethnicSlug.replace(/-(?:[ncesw]|\d+)$/i, '');
          const baseBranchEl = containerRef.current.querySelector<SVGGraphicsElement>(`[id*="branch--ethnic--${baseSlug}--country--"]`);
          if (baseBranchEl) {
            const m = baseBranchEl.id.match(/--country--([a-z0-9-]+)/i);
            if (m) countrySlug = m[1].replace(/-\d+$/, '');
          }
        }
      }

      let conduit = (authorCountry || countrySlug) ? AFRICALIA_COUNTRY_CONDUITS.find(c => 
        (authorCountry && c.name.toLowerCase() === authorCountry.toLowerCase()) ||
        (countrySlug && (
          c.id.toLowerCase() === countrySlug || 
          c.name.toLowerCase().replace(/\s+/g, '-') === countrySlug ||
          (countrySlug === 'cabo-verde' && (c.id === 'cape-verde' || c.name.toLowerCase().includes('verde'))) ||
          (countrySlug === 'guinea-conacry' && c.id === 'guinea') ||
          (countrySlug === 'guinea-eq' && c.id === 'equatorial-guinea') ||
          (countrySlug === 'drc' && c.id === 'dr-congo') ||
          (countrySlug === 'rc' && c.id === 'republic-of-the-congo')
        ))
      ) : undefined;

      const wiki = findWikipediaEntry(cleanName) || findWikipediaEntry(baseEthnicName);

      // If conduit was not in the ID, search conduits for an ethnic group with this name or base name
      if (!conduit) {
        conduit = AFRICALIA_COUNTRY_CONDUITS.find(c =>
          c.ethnicGroups.some(eg => 
            eg.name.toLowerCase() === cleanName.toLowerCase() || 
            eg.name.toLowerCase() === baseEthnicName.toLowerCase() ||
            baseEthnicName.toLowerCase().includes(eg.name.toLowerCase()) ||
            eg.name.toLowerCase().includes(baseEthnicName.toLowerCase()) ||
            eg.name.toLowerCase().includes(ethnicSlug)
          )
        );
      }

      // Resolve country from authoritative mapping, conduit, or Wikipedia homeland
      let resolvedCountry = authorCountry || conduit?.name || (countrySlug === 'cabo-verde' ? 'Cabo Verde' : undefined);
      if (!resolvedCountry && wiki?.homeland) {
        const homelandCountry = wiki.homeland.split('(')[0].split(',')[0].trim();
        const matchingConduit = AFRICALIA_COUNTRY_CONDUITS.find(c => 
          c.name.toLowerCase() === homelandCountry.toLowerCase()
        );
        resolvedCountry = matchingConduit?.name || homelandCountry;
      }

      // Determine precise node coordinates
      let coords: { x: number; y: number; r: number } | undefined;
      if (conduit) {
        const matchedEg = conduit.ethnicGroups.find(eg => 
          eg.name.toLowerCase() === cleanName.toLowerCase() ||
          eg.name.toLowerCase() === baseEthnicName.toLowerCase() ||
          baseEthnicName.toLowerCase().includes(eg.name.toLowerCase())
        );
        if (matchedEg) {
          coords = { x: matchedEg.nodeX, y: matchedEg.nodeY, r: 14 };
        }
      }

      // If coords not from conduit, compute from element in root SVG coordinate space
      if (!coords && element && containerRef.current) {
        const svgRoot = containerRef.current.querySelector('svg');
        if (svgRoot && typeof (element as SVGGraphicsElement).getScreenCTM === 'function' && typeof (element as SVGGraphicsElement).getBBox === 'function') {
          try {
            const ctm = (element as SVGGraphicsElement).getScreenCTM();
            const rootCtm = svgRoot.getScreenCTM();
            if (ctm && rootCtm) {
              const bbox = (element as SVGGraphicsElement).getBBox();
              const p = svgRoot.createSVGPoint();
              p.x = bbox.x + bbox.width / 2;
              p.y = bbox.y + bbox.height / 2;
              const rootPoint = p.matrixTransform(rootCtm.inverse().multiply(ctm));
              if (rootPoint.x > 100 && rootPoint.y > 100 && rootPoint.x < 4250 && rootPoint.y < 4250) {
                coords = { x: rootPoint.x, y: rootPoint.y, r: 14 };
              }
            }
          } catch {
            // ignore
          }
        }
      }

      if (!coords && conduit) {
        coords = { x: conduit.labelX, y: conduit.labelY, r: 14 };
      }

      return {
        id,
        name: cleanName,
        type: 'ethnic',
        country: resolvedCountry || conduit?.name || 'Nigeria',
        region: conduit ? conduit.region : (countrySlug === 'cabo-verde' ? 'Western Africa' : wiki?.homeland || 'Western Africa'),
        tastVolumeShare: conduit ? conduit.tastVolumeShare : (countrySlug === 'cabo-verde' ? 8.5 : undefined),
        linguisticFamily: wiki?.languages || 'Niger-Congo / Atlantic Substrate',
        description: wiki?.extract || `Documented historical ethnic lineage for ${cleanName} preserved in African sovereign genealogical records.`,
        coords
      };
    }

    // 4. Cabo Verde transatlantic crucible ellipse & country node
    if (id === 'node--geo--country--cabo-verde' || id === 'geo--country--Cabo-Verde' || id === 'label--country--cabo-verde' || id === 'CABO-VERDE' || id.includes('cabo-verde')) {
      const conduit = AFRICALIA_COUNTRY_CONDUITS.find(c => c.id === 'cape-verde' || c.name.toLowerCase().includes('verde'));
      return {
        id: 'node--geo--country--cabo-verde',
        name: conduit?.name || 'Cabo Verde',
        type: 'country',
        country: 'Cabo Verde',
        region: 'Western Africa',
        tastVolumeShare: conduit?.tastVolumeShare || 8.5,
        color: conduit?.color || '#E67E48',
        description: 'First transatlantic maritime creole crucible linking Senegambian and Upper Guinea lineages with the transatlantic diaspora.',
        coords: { x: 1188.4369, y: 2708.2075, r: 125 }
      };
    }

    // 5. Fallback if element has text content or data attributes (captures any outer ethnic or country label)
    if (element) {
      const textContent = element.textContent?.trim();
      if (textContent && textContent.length > 1 && textContent.length < 50 && !textContent.startsWith('100%') && !textContent.startsWith('TAST')) {
        const authorCountry = getAuthoritativeCountryForEthnic(textContent);

        // Check if this text matches a country conduit
        const countryMatch = AFRICALIA_COUNTRY_CONDUITS.find(c => 
          c.name.toLowerCase() === textContent.toLowerCase() ||
          c.id.toLowerCase() === textContent.toLowerCase().replace(/\s+/g, '-') ||
          (authorCountry && c.name.toLowerCase() === authorCountry.toLowerCase())
        );
        if (countryMatch && countryMatch.name.toLowerCase() === textContent.toLowerCase()) {
          return {
            id: id || `country--${countryMatch.id}`,
            name: countryMatch.name,
            type: 'country',
            country: countryMatch.name,
            region: countryMatch.region,
            tastVolumeShare: countryMatch.tastVolumeShare,
            color: countryMatch.color,
            description: `Sovereign conduit for ${countryMatch.name} carrying documented ethnic lineages and embarkation flows.`,
            coords: { x: countryMatch.labelX, y: countryMatch.labelY, r: 16 }
          };
        }

        const wiki = findWikipediaEntry(textContent);
        const conduit = countryMatch || AFRICALIA_COUNTRY_CONDUITS.find(c =>
          (authorCountry && c.name.toLowerCase() === authorCountry.toLowerCase()) ||
          c.ethnicGroups.some(eg => eg.name.toLowerCase() === textContent.toLowerCase())
        );
        let resolvedCountry = authorCountry || conduit?.name;
        if (!resolvedCountry && wiki?.homeland) {
          const homelandCountry = wiki.homeland.split('(')[0].split(',')[0].trim();
          const matchingConduit = AFRICALIA_COUNTRY_CONDUITS.find(c => 
            c.name.toLowerCase() === homelandCountry.toLowerCase()
          );
          resolvedCountry = matchingConduit?.name || homelandCountry;
        }

        // Coordinates from root SVG transformation
        let coords: { x: number; y: number; r: number } | undefined;
        if (conduit) {
          const matchedEg = conduit.ethnicGroups.find(eg => eg.name.toLowerCase() === textContent.toLowerCase());
          if (matchedEg) {
            coords = { x: matchedEg.nodeX, y: matchedEg.nodeY, r: 14 };
          } else {
            coords = { x: conduit.labelX, y: conduit.labelY, r: 14 };
          }
        }

        if (!coords && containerRef.current) {
          const svgRoot = containerRef.current.querySelector('svg');
          if (svgRoot && typeof (element as SVGGraphicsElement).getScreenCTM === 'function' && typeof (element as SVGGraphicsElement).getBBox === 'function') {
            try {
              const ctm = (element as SVGGraphicsElement).getScreenCTM();
              const rootCtm = svgRoot.getScreenCTM();
              if (ctm && rootCtm) {
                const bbox = (element as SVGGraphicsElement).getBBox();
                const p = svgRoot.createSVGPoint();
                p.x = bbox.x + bbox.width / 2;
                p.y = bbox.y + bbox.height / 2;
                const rootPoint = p.matrixTransform(rootCtm.inverse().multiply(ctm));
                if (rootPoint.x > 100 && rootPoint.y > 100 && rootPoint.x < 4250 && rootPoint.y < 4250) {
                  coords = { x: rootPoint.x, y: rootPoint.y, r: 14 };
                }
              }
            } catch {
              // ignore
            }
          }
        }

        return {
          id: id || `ethnic--${textContent.toLowerCase().replace(/\s+/g, '-')}`,
          name: textContent,
          type: 'ethnic',
          country: resolvedCountry || 'Nigeria',
          region: conduit?.region || wiki?.homeland || 'Western Africa',
          linguisticFamily: wiki?.languages || 'Niger-Congo',
          description: wiki?.extract || `Historical ethnic lineage identified in sovereign vector cartography.`,
          coords
        };
      }
    }

    return null;
  }, []);

  // Active sovereign country resolution for SVG contour spotlight & tree dimming
  const activeCountryName = useMemo(() => {
    if (selectedEntity?.country && selectedEntity.country !== 'African Continent') return selectedEntity.country;
    if (selectedEntity?.type === 'country') return selectedEntity.name;
    if (selectedCountry !== 'All') return selectedCountry;
    return null;
  }, [selectedEntity, selectedCountry]);

  const activeGeoCountryId = useMemo(() => {
    return getGeoCountryId(activeCountryName || undefined);
  }, [activeCountryName]);

  const activeCountrySlug = useMemo(() => {
    if (!activeCountryName) return null;
    return activeCountryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }, [activeCountryName]);

  const paperColor = canvasBg === 'white' ? '#FFFFFF' : canvasBg === 'sepia' ? '#F4EDE2' : '#FAF7F2';

  // Handle click on raw SVG elements directly with 100% fidelity & generous hit proximity
  const handleSvgClick = (e: React.MouseEvent) => {
    if (dragStart.current.moved) return;

    const target = e.target as SVGElement;
    if (!target || !containerRef.current) return;

    // 1. Direct SVG element identification
    let identified = target.closest('[id]') as SVGElement | null;
    if (!identified && (target.tagName.toLowerCase() === 'text' || target.tagName.toLowerCase() === 'tspan')) {
      identified = target;
    }

    let entity: SelectedEntityData | null = null;
    if (identified) {
      entity = resolveEntityFromSvgElement(identified.id || '', identified);
    }

    // 2. Generous proximity fallback if direct element was background or missed thin glyph outline
    if (!entity) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickClientX = e.clientX - rect.left;
      const clickClientY = e.clientY - rect.top;
      const currentScale = fitScale * zoom;
      const svgX = (clickClientX - pos.x) / currentScale;
      const svgY = (clickClientY - pos.y) / currentScale;

      // Check proximity to country conduits (label and trunk endpoints)
      let closestConduit: typeof AFRICALIA_COUNTRY_CONDUITS[0] | null = null;
      let minConduitDist = 140; // 140px generous SVG space hit radius
      for (const c of AFRICALIA_COUNTRY_CONDUITS) {
        const distLabel = Math.hypot(svgX - c.labelX, svgY - c.labelY);
        const distTrunkEnd = Math.hypot(svgX - c.trunkEndX, svgY - c.trunkEndY);
        const d = Math.min(distLabel, distTrunkEnd);
        if (d < minConduitDist) {
          minConduitDist = d;
          closestConduit = c;
        }
      }

      // Check proximity to ethnic nodes
      let closestEthnicGroup: { name: string; conduit: typeof AFRICALIA_COUNTRY_CONDUITS[0]; x: number; y: number } | null = null;
      let minEthnicDist = 80; // 80px generous SVG space hit radius
      for (const c of AFRICALIA_COUNTRY_CONDUITS) {
        for (const eg of c.ethnicGroups) {
          const d = Math.hypot(svgX - eg.nodeX, svgY - eg.nodeY);
          if (d < minEthnicDist) {
            minEthnicDist = d;
            closestEthnicGroup = { name: eg.name, conduit: c, x: eg.nodeX, y: eg.nodeY };
          }
        }
      }

      if (closestEthnicGroup) {
        const wiki = findWikipediaEntry(closestEthnicGroup.name);
        entity = {
          id: `node--ethnic--${closestEthnicGroup.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: closestEthnicGroup.name,
          type: 'ethnic',
          country: closestEthnicGroup.conduit.name,
          region: closestEthnicGroup.conduit.region,
          tastVolumeShare: closestEthnicGroup.conduit.tastVolumeShare,
          linguisticFamily: wiki?.languages,
          description: wiki?.extract || `Documented historical ethnic lineage for ${closestEthnicGroup.name}.`,
          coords: { x: closestEthnicGroup.x, y: closestEthnicGroup.y, r: 14 }
        };
      } else if (closestConduit) {
        entity = {
          id: `country--${closestConduit.id}`,
          name: closestConduit.name,
          type: 'country',
          country: closestConduit.name,
          region: closestConduit.region,
          tastVolumeShare: closestConduit.tastVolumeShare,
          color: closestConduit.color,
          description: `Sovereign conduit for ${closestConduit.name} carrying documented ethnic lineages.`,
          coords: { x: closestConduit.labelX, y: closestConduit.labelY, r: 18 }
        };
      }
    }

    if (entity) {
      // If entity doesn't have coordinates, calculate them in true root SVG coordinate space
      if (!entity.coords && identified && containerRef.current) {
        const svgRoot = containerRef.current.querySelector('svg');
        if (svgRoot && typeof (identified as SVGGraphicsElement).getScreenCTM === 'function' && typeof (identified as SVGGraphicsElement).getBBox === 'function') {
          try {
            const ctm = (identified as SVGGraphicsElement).getScreenCTM();
            const rootCtm = svgRoot.getScreenCTM();
            if (ctm && rootCtm) {
              const bbox = (identified as SVGGraphicsElement).getBBox();
              const p = svgRoot.createSVGPoint();
              p.x = bbox.x + bbox.width / 2;
              p.y = bbox.y + bbox.height / 2;
              const rootPoint = p.matrixTransform(rootCtm.inverse().multiply(ctm));
              if (rootPoint.x > 100 && rootPoint.y > 100 && rootPoint.x < 4250 && rootPoint.y < 4250) {
                entity.coords = {
                  x: rootPoint.x,
                  y: rootPoint.y,
                  r: Math.max(bbox.width, bbox.height) / 2 + 10
                };
              }
            }
          } catch {
            // ignore if inside container
          }
        }
      }

      // If coordinates still missing, fallback to conduit label coordinates
      if (!entity.coords && entity.country) {
        const cond = AFRICALIA_COUNTRY_CONDUITS.find(c => c.name.toLowerCase() === entity.country?.toLowerCase());
        if (cond) {
          entity.coords = { x: cond.labelX, y: cond.labelY, r: 16 };
        }
      }

      // Open the rich editorial panel
      setSelectedEntity(entity);

      // Smooth zoom transition framing the entire country group (branches + country label + nodes + silhouette)
      if (entity.country && entity.country !== 'African Continent') {
        setSelectedCountry(entity.country);
        zoomToCountryRegion(entity.country, entity.coords);
      } else if (entity.type === 'country') {
        setSelectedCountry(entity.name);
        zoomToCountryRegion(entity.name, entity.coords);
      } else if (entity.coords && entity.coords.x > 100 && entity.coords.y > 100) {
        panToCoordinates(entity.coords.x, entity.coords.y, 2.0, { xOffset: isDossierCollapsed ? 0 : 380 });
      }
    }
  };

  // Upload custom SVG / HTML file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      let content = event.target?.result as string;
      if (!content) return;
      // If it's an HTML file, extract the <svg>...</svg>
      if (content.includes('<svg')) {
        const match = content.match(/<svg[\s\S]*?<\/svg>/i);
        if (match) {
          setCustomSvgMarkup(match[0]);
        } else {
          setCustomSvgMarkup(content);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div 
      ref={containerRef}
      style={{ backgroundColor: paperColor }}
      className="relative w-full h-full overflow-hidden text-[#2B241E] dark:text-[#F5EFE6] select-none cursor-grab active:cursor-grabbing font-sans transition-colors duration-300"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      id="africalia-explorer-root"
    >
      {/* Screen Reader Live Announcement Region */}
      <div 
        role="status" 
        aria-live="polite" 
        className="sr-only"
      >
        {liveAnnouncement}
      </div>

      {/* =========================================================================
          1. SINGLE UNIFIED COLLAPSED FLOATING PILL (Search Trigger, Camera & Info)
          ========================================================================= */}
      <motion.div 
        layout
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 sm:left-6 z-30 flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-[#FAF7F2]/95 dark:bg-[#1E1B18]/95 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_8px_30px_rgba(75,55,35,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md text-xs no-drag select-none max-w-[calc(100vw-32px)]"
        id="africalia-top-control-bar"
      >
        {/* Search & Explore Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setIsUnifiedPanelOpen(prev => !prev);
            setIsUnifiedPanelMinimized(false);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${
            isUnifiedPanelOpen
              ? 'bg-[#E67E48] text-white'
              : 'bg-[#E67E48]/15 hover:bg-[#E67E48]/25 text-[#B8571A] dark:text-[#FFA573] border border-[#E67E48]/40'
          }`}
          title={isUnifiedPanelOpen ? "Close search panel" : "Expand Unified Search, Filters & Controls Panel"}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="font-bold hidden xs:inline">Search & Focus</span>
          {(selectedRegion !== 'All' || selectedCountry !== 'All' || searchQuery) && (
            <span className="w-2 h-2 rounded-full bg-[#E67E48] animate-pulse" />
          )}
        </button>

        <div className="w-[1px] h-4 bg-[#E5DDD0] dark:bg-[#38322B] shrink-0" />

        {/* Zoom Controls */}
        <button
          type="button"
          onClick={() => handleZoomDelta(0.82)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#52463B] dark:text-[#C4B7A6] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="text-[11px] font-mono font-bold text-[#7D6B5A] dark:text-[#B5A492] px-0.5 min-w-[2.75rem] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={() => handleZoomDelta(1.22)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#52463B] dark:text-[#C4B7A6] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-[#E5DDD0] dark:bg-[#38322B] shrink-0" />

        {/* Crucible View & Full Tree Shortcuts */}
        <button
          type="button"
          onClick={panToCrucible}
          className="hidden sm:flex px-2.5 py-1 rounded-full text-[11px] font-medium items-center gap-1 bg-black/5 dark:bg-white/5 hover:bg-[#E67E48]/15 text-[#52463B] dark:text-[#C4B7A6] hover:text-[#B8571A] dark:hover:text-[#FFA573] border border-[#E5DDD0] dark:border-[#38322B] transition-colors cursor-pointer"
          title="Crucible View: Zoom directly to Cabo Verde crucible nexus"
        >
          <Compass className="w-3 h-3 text-[#E67E48]" />
          <span>Crucible</span>
        </button>

        <button
          type="button"
          onClick={fitView}
          className="hidden sm:flex px-2.5 py-1 rounded-full text-[11px] font-medium items-center gap-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 text-[#52463B] dark:text-[#C4B7A6] border border-[#E5DDD0] dark:border-[#38322B] transition-colors cursor-pointer"
          title="Reset zoom to full tree"
        >
          <RotateCcw className="w-3 h-3 text-[#7D6B5A]" />
          <span>Full Tree</span>
        </button>

        {/* Africalia Title & SVG Info Tag */}
        <div className="w-[1px] h-4 bg-[#E5DDD0] dark:bg-[#38322B] shrink-0" />
        <div className="flex items-center gap-1.5 px-1.5 text-[10px] text-[#7D6B5A] dark:text-[#B5A492] font-medium truncate max-w-[130px] sm:max-w-[200px]">
          <span className="font-serif font-bold text-[#2B241E] dark:text-[#F5EFE6]">Africalia</span>
          <span className="opacity-60 hidden md:inline">· SVG Vector Tree</span>
        </div>
      </motion.div>

      {/* =========================================================================
          2. UNIFIED DRAGGABLE & MINIMIZABLE AFRICALIA SEARCH & CONTROLS PANEL
          ========================================================================= */}
      <AnimatePresence>
        {isUnifiedPanelOpen && (
          <motion.div 
            key="unified-geography-search-dock"
            drag
            dragMomentum={false}
            dragConstraints={containerRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ type: "spring", damping: 27, stiffness: 330 }}
            className={`absolute top-16 left-4 sm:left-6 z-40 rounded-3xl bg-[#FAF7F2]/96 dark:bg-[#1E1B18]/96 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_16px_50px_rgba(75,55,35,0.18)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden transition-all duration-200 ${
              isUnifiedPanelMinimized 
                ? 'w-auto max-w-xs p-3 flex items-center gap-3 cursor-grab active:cursor-grabbing' 
                : 'w-80 sm:w-88 max-h-[calc(100vh-80px)] flex flex-col'
            }`}
            id="unified-geography-search-dock"
          >
            {isUnifiedPanelMinimized ? (
              /* Minimized Floating Pill State (Africalia Title & SVG Info) */
              <div className="flex items-center justify-between w-full gap-3 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#E67E48] animate-pulse shrink-0" />
                  <div className="text-xs font-serif font-bold text-[#2B241E] dark:text-[#F5EFE6]">
                    Africalia
                  </div>
                  <span className="text-[10px] text-[#7D6B5A] dark:text-[#B5A492]">· SVG Info</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsUnifiedPanelMinimized(false)}
                    className="p-1.5 rounded-lg text-[#7D6B5A] dark:text-[#B5A492] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title="Maximize panel"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#E67E48]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUnifiedPanelOpen(false)}
                    className="p-1.5 rounded-lg text-[#7D6B5A] dark:text-[#B5A492] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title="Close panel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Full Expanded Panel */
              <>
                {/* Panel Header with Drag Handle, UN GeoScheme Toggle, Minimize & Close */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5DDD0] dark:border-[#38322B] cursor-grab active:cursor-grabbing select-none">
                  <div className="flex items-center gap-2">
                    <GripHorizontal className="w-4 h-4 text-[#8C7C70] opacity-70" />
                    <div className="w-7 h-7 rounded-xl bg-[#E67E48]/15 border border-[#E67E48]/40 text-[#B8571A] dark:text-[#FFA573] grid place-items-center shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-[#2B241E] dark:text-[#F5EFE6] leading-tight">Focus & Tree Search</h2>
                      <p className="text-[10px] text-[#7D6B5A] dark:text-[#B5A492]">Sovereign Genealogical Navigator</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 no-drag">
                    {/* Raw File Upload Button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".svg,image/svg+xml,.html,text/html"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-lg text-[#7D6B5A] dark:text-[#B5A492] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      title="Upload custom SVG or HTML file"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>

                    {/* Minimize Panel Button */}
                    <button
                      type="button"
                      onClick={() => setIsUnifiedPanelMinimized(true)}
                      className="p-1.5 rounded-lg text-[#7D6B5A] dark:text-[#B5A492] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title="Minimize panel to pill"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Close Panel Button */}
                    <button
                      type="button"
                      onClick={() => setIsUnifiedPanelOpen(false)}
                      className="p-1.5 rounded-lg text-[#7D6B5A] dark:text-[#B5A492] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title="Close panel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-Header: UN Geo Scheme Toggle & Tree Info */}
                <div className="px-4 py-2 bg-black/[0.02] dark:bg-white/[0.02] border-b border-[#E5DDD0]/70 dark:border-[#38322B]/70 flex items-center justify-between gap-2 text-[10px]">
                  <p className="text-[#7D6B5A] dark:text-[#B5A492] font-medium truncate">
                    Africalia Vector Tree · Raw SVG (100% fidelity)
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUnGeoScheme(prev => !prev);
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold transition-all cursor-pointer shrink-0 ${
                      showUnGeoScheme
                        ? 'bg-[#E67E48]/15 text-[#B8571A] dark:text-[#FFA573] border border-[#E67E48]/35 hover:bg-[#E67E48]/25'
                        : 'bg-black/5 dark:bg-white/5 text-[#7D6B5A] dark:text-[#B5A492] border border-[#E5DDD0] dark:border-[#38322B]'
                    }`}
                    title={showUnGeoScheme ? "Hide Africa UN Geo Scheme continent layer" : "Show Africa UN Geo Scheme continent layer"}
                  >
                    <Globe className="w-3 h-3 text-[#E67E48]" />
                    <span>UN Geo: {showUnGeoScheme ? 'On' : 'Off'}</span>
                  </button>
                </div>

                {/* Dock Scrollable Body with Cozy Scrollbar */}
                <div className="p-3.5 space-y-3 overflow-y-auto drawer-cozy-scrollbar flex-1 no-drag">
                  {/* Search Input Bar */}
                  <div className="relative">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B] text-xs">
                      <Search className="w-3.5 h-3.5 text-[#8C7C70] shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onFocus={() => setIsSearchDropdownOpen(true)}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setIsSearchDropdownOpen(true);
                        }}
                        placeholder="Search nation, ethnic node, region..."
                        className="w-full bg-transparent outline-none text-[#2B241E] dark:text-[#F5EFE6] placeholder-[#8C7C70] text-xs"
                      />
                      {searchQuery && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setSearchQuery('');
                            setIsSearchDropdownOpen(false);
                          }}
                          className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#8C7C70] cursor-pointer"
                          title="Clear search"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Integrated Search Results List */}
                    {isSearchDropdownOpen && searchResults.length > 0 && (
                      <div className="mt-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#1E1B18] border border-[#E5DDD0] dark:border-[#38322B] shadow-lg max-h-44 overflow-y-auto drawer-cozy-scrollbar divide-y divide-[#E5DDD0]/50 dark:divide-[#38322B]/50">
                        {searchResults.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              if (item.type === 'country') {
                                setSelectedCountry(item.name);
                                const conduit = AFRICALIA_COUNTRY_CONDUITS.find(c => c.name === item.name);
                                if (conduit) {
                                  setSelectedRegion(conduit.region);
                                  setSelectedEntity({
                                    id: conduit.id,
                                    name: conduit.name,
                                    type: 'country',
                                    country: conduit.name,
                                    region: conduit.region,
                                    tastVolumeShare: conduit.tastVolumeShare,
                                    color: conduit.color,
                                    coords: { x: conduit.labelX, y: conduit.labelY, r: 16 }
                                  });
                                }
                                zoomToCountryRegion(item.name, item.x && item.y ? { x: item.x, y: item.y } : undefined);
                              } else if (item.type === 'ethnic') {
                                if (item.country) {
                                  setSelectedCountry(item.country);
                                  zoomToCountryRegion(item.country, item.x && item.y ? { x: item.x, y: item.y } : undefined);
                                } else if (item.x && item.y) {
                                  panToCoordinates(item.x, item.y, 2.4, { xOffset: 380 });
                                }
                                setSelectedEntity({
                                  id: item.id,
                                  name: item.name,
                                  type: 'ethnic',
                                  country: item.country,
                                  region: item.region,
                                  coords: item.x && item.y ? { x: item.x, y: item.y, r: 12 } : undefined
                                });
                              } else if (item.type === 'admin1') {
                                if (item.country) {
                                  setSelectedCountry(item.country);
                                  zoomToCountryRegion(item.country, item.x && item.y ? { x: item.x, y: item.y } : undefined);
                                } else if (item.x && item.y) {
                                  panToCoordinates(item.x, item.y, 2.4, { xOffset: 380 });
                                }
                                setSelectedEntity({
                                  id: item.id,
                                  name: item.name,
                                  type: 'quant',
                                  country: item.country,
                                  region: item.region,
                                  description: `First-level administrative subdivision (Admin-1) of ${item.country || 'Africa'}.`,
                                  coords: item.x && item.y ? { x: item.x, y: item.y, r: 14 } : undefined
                                });
                              } else {
                                setSelectedRegion(item.name);
                              }
                              // Keep selected value active in the search field
                              setSearchQuery(item.name);
                              setIsSearchDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-[#E67E48]/10 transition-colors flex items-center justify-between cursor-pointer"
                          >
                            <div className="truncate pr-2">
                              <p className="font-semibold text-[#2B241E] dark:text-[#F5EFE6] truncate">{item.name}</p>
                              <p className="text-[10px] text-[#7D6B5A] dark:text-[#B5A492]">
                                {item.type === 'ethnic' ? `${item.country} • ${item.region}` : item.region}
                              </p>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-bold text-[#E67E48] bg-[#E67E48]/10 shrink-0">
                              {item.type}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Region Filter Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#7D6B5A] dark:text-[#B5A492]">
                      UN Geoscheme Region
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => {
                        const reg = e.target.value;
                        setSelectedRegion(reg);
                        setSelectedCountry('All');
                        if (reg !== 'All') {
                          // Check if historical region mapping exists
                          const historicalCountryIds = HISTORICAL_REGION_COUNTRY_MAP[reg];
                          if (historicalCountryIds && historicalCountryIds.length > 0) {
                            const firstHistConduit = AFRICALIA_COUNTRY_CONDUITS.find(c => historicalCountryIds.includes(c.id));
                            if (firstHistConduit) {
                              panToCoordinates(firstHistConduit.labelX, firstHistConduit.labelY, 1.6);
                            }
                          } else {
                            const firstConduit = AFRICALIA_COUNTRY_CONDUITS.find(c => c.region === reg);
                            if (firstConduit) {
                              panToCoordinates(firstConduit.labelX, firstConduit.labelY, 1.6);
                            }
                          }
                        } else {
                          fitView();
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B] text-xs text-[#2B241E] dark:text-[#F5EFE6] outline-none font-medium cursor-pointer"
                    >
                      <option value="All" className="bg-[#FAF7F2] dark:bg-[#1E1B18]">All Sovereign Regions</option>
                      {AFRICALIA_REGIONS.map(r => (
                        <option key={r.value} value={r.label} className="bg-[#FAF7F2] dark:bg-[#1E1B18]">{r.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Country Conduit Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#7D6B5A] dark:text-[#B5A492]">
                      Nation / Conduit ({availableCountries.length})
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => {
                        const countryName = e.target.value;
                        setSelectedCountry(countryName);
                        if (countryName !== 'All') {
                          const conduit = AFRICALIA_COUNTRY_CONDUITS.find(c => c.name === countryName);
                          if (conduit) {
                            setSelectedRegion(conduit.region);
                            setSelectedEntity({
                              id: conduit.id,
                              name: conduit.name,
                              type: 'country',
                              country: conduit.name,
                              region: conduit.region,
                              tastVolumeShare: conduit.tastVolumeShare,
                              color: conduit.color,
                              coords: { x: conduit.labelX, y: conduit.labelY, r: 16 }
                            });
                            zoomToCountryRegion(countryName, { x: conduit.labelX, y: conduit.labelY });
                          }
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B] text-xs text-[#2B241E] dark:text-[#F5EFE6] outline-none font-medium cursor-pointer"
                    >
                      <option value="All" className="bg-[#FAF7F2] dark:bg-[#1E1B18]">All Sovereign Nations</option>
                      {availableCountries.map(c => (
                        <option key={c.id} value={c.name} className="bg-[#FAF7F2] dark:bg-[#1E1B18]">{c.name} ({c.region})</option>
                      ))}
                    </select>
                  </div>

                  {/* Linguistic Phylum Selector from Wikipedia Atlas */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#7D6B5A] dark:text-[#B5A492] flex items-center gap-1">
                        <Languages className="w-3 h-3 text-[#E67E48]" />
                        <span>Linguistic Phylum (Wikipedia)</span>
                      </label>
                      {selectedLinguisticFamily !== 'All' && (
                        <button 
                          type="button" 
                          onClick={() => setSelectedLinguisticFamily('All')}
                          className="text-[10px] text-[#E67E48] hover:underline cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <select
                      value={selectedLinguisticFamily}
                      onChange={(e) => {
                        setSelectedLinguisticFamily(e.target.value);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B] text-xs text-[#2B241E] dark:text-[#F5EFE6] outline-none font-medium cursor-pointer"
                    >
                      {majorLinguisticFamilies.map(fam => (
                        <option key={fam} value={fam} className="bg-[#FAF7F2] dark:bg-[#1E1B18]">{fam}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quick List for Selected Linguistic Phylum */}
                  {selectedLinguisticFamily !== 'All' && linguisticFilteredGroups.length > 0 && (
                    <div className="p-2.5 rounded-2xl bg-[#E67E48]/10 border border-[#E67E48]/25 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8571A] dark:text-[#FFA573]">
                          {selectedLinguisticFamily} Lineages ({linguisticFilteredGroups.length})
                        </span>
                        <span className="text-[9px] text-[#7D6B5A] dark:text-[#B5A492]">Tap to inspect</span>
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto drawer-cozy-scrollbar pr-1">
                        {linguisticFilteredGroups.slice(0, 15).map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              if (item.x && item.y) {
                                panToCoordinates(item.x, item.y, 2.5);
                              }
                              setSelectedEntity({
                                id: item.id,
                                name: item.name,
                                type: 'ethnic',
                                country: item.country,
                                region: item.region,
                                coords: item.x && item.y ? { x: item.x, y: item.y, r: 12 } : undefined
                              });
                            }}
                            className="px-2 py-0.5 rounded-full text-[10px] bg-white dark:bg-[#2B241E] border border-[#E67E48]/30 hover:border-[#E67E48] text-[#2B241E] dark:text-[#F5EFE6] hover:text-[#E67E48] transition-colors cursor-pointer"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions: Clear & Reset Buttons */}
                  <div 
                    id="dock-footer-actions-container"
                    className="pt-2.5 border-t border-[#E5DDD0] dark:border-[#38322B] flex flex-col gap-2.5"
                  >
                    <div className="flex items-center gap-2">
                      {/* Reset View Pill (Warm Apricot / Persimmon) */}
                      <button
                        id="dock-reset-view-btn"
                        type="button"
                        onClick={fitView}
                        className="flex-1 px-3 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-[#FA8C58]/15 hover:bg-[#FA8C58]/25 text-[#B8571A] dark:text-[#FFA573] border border-[#FA8C58]/40 shadow-xs hover:shadow-sm active:scale-95"
                        title="Reset zoom and center on origin"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#E67E48]" />
                        <span>Reset View</span>
                      </button>

                      {/* Clear Filters Pill (Warm Pomegranate / Ripe Fig) */}
                      <button
                        id="dock-clear-filters-btn"
                        type="button"
                        onClick={handleClearFocus}
                        className="flex-1 px-3 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-[#C44536]/15 hover:bg-[#C44536]/25 text-[#9C2F22] dark:text-[#F89D93] border border-[#C44536]/40 shadow-xs hover:shadow-sm active:scale-95"
                        title="Clear all region and search filters"
                      >
                        <X className="w-3.5 h-3.5 text-[#BF4342]" />
                        <span>Clear Filters</span>
                      </button>
                    </div>

                    {/* African Languages Atlas Link */}
                    {onNavigateToLanguages && (
                      <button
                        id="dock-languages-page-link"
                        type="button"
                        onClick={onNavigateToLanguages}
                        className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#E67E48]/10 to-amber-500/10 hover:from-emerald-500/20 hover:via-[#E67E48]/20 hover:to-amber-500/20 border border-emerald-500/30 dark:border-emerald-500/40 text-[#2B241E] dark:text-[#F5EFE6] transition-all duration-200 cursor-pointer flex items-center justify-between group/dockLang shadow-xs hover:shadow-md active:scale-[0.99]"
                        title="Explore 2,000+ living languages across 6 major African linguistic phyla"
                      >
                        <div className="flex items-center gap-2.5 text-left">
                          <div className="w-7 h-7 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover/dockLang:scale-110 transition-transform">
                            <Languages className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                              <span>African Languages Atlas</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                                6 Phyla
                              </span>
                            </div>
                            <div className="text-[10px] text-[#7D6B5A] dark:text-[#B5A492]">
                              Explore 2,000+ living tongues & soundscapes
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover/dockLang:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>

                  {/* =========================================================================
                      INTEGRATED BOTTOM DOCK CONTROLS (Positioned directly below Languages Atlas)
                      ========================================================================= */}
                  <div 
                    id="unified-bottom-control-dock"
                    className="pt-3 border-t border-[#E5DDD0] dark:border-[#38322B] space-y-3"
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider font-mono text-[10px] text-[#7D6B5A] dark:text-[#B5A492]">
                        <Sliders className="w-3.5 h-3.5 text-[#E67E48]" />
                        <span>Display Canvas & TAST Layers</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsExportModalOpen(true)}
                        className="px-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 bg-[#E67E48]/15 hover:bg-[#E67E48]/25 text-[#B8571A] dark:text-[#FFA573] border border-[#E67E48]/40 transition-colors cursor-pointer"
                        title="Export Citation & SVG"
                      >
                        <Download className="w-3 h-3 text-[#E67E48]" />
                        <span>Cite & Export</span>
                      </button>
                    </div>

                    {/* Archival Paper Selection */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#7D6B5A] dark:text-[#B5A492] block">
                        Archival Canvas Paper
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          onClick={() => setCanvasBg('parchment')}
                          className={`px-2 py-1.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer text-center ${
                            canvasBg === 'parchment'
                              ? 'bg-[#E67E48] text-white shadow-xs'
                              : 'bg-black/5 dark:bg-white/10 text-[#52463B] dark:text-[#C4B7A6] hover:bg-black/10'
                          }`}
                          title="Museum Parchment Paper"
                        >
                          Parchment
                        </button>
                        <button
                          type="button"
                          onClick={() => setCanvasBg('white')}
                          className={`px-2 py-1.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer text-center ${
                            canvasBg === 'white'
                              ? 'bg-[#E67E48] text-white shadow-xs'
                              : 'bg-black/5 dark:bg-white/10 text-[#52463B] dark:text-[#C4B7A6] hover:bg-black/10'
                          }`}
                          title="Pure White Paper"
                        >
                          Pure White
                        </button>
                        <button
                          type="button"
                          onClick={() => setCanvasBg('sepia')}
                          className={`px-2 py-1.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer text-center ${
                            canvasBg === 'sepia'
                              ? 'bg-[#E67E48] text-white shadow-xs'
                              : 'bg-black/5 dark:bg-white/10 text-[#52463B] dark:text-[#C4B7A6] hover:bg-black/10'
                          }`}
                          title="Antique Sepia Paper"
                        >
                          Sepia
                        </button>
                      </div>
                    </div>

                    {/* TAST Historical Cohorts */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#7D6B5A] dark:text-[#B5A492] block">
                        TAST Cohorts (Trans-Atlantic Slave Trade)
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveTastLayer('all')}
                          className={`px-2 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer text-center ${
                            activeTastLayer === 'all'
                              ? 'bg-[#724E5B] text-white shadow-xs'
                              : 'bg-[#724E5B]/15 hover:bg-[#724E5B]/25 text-[#5F3B4A] dark:text-[#E2B2C6] border border-[#724E5B]/30'
                          }`}
                        >
                          All Cohorts
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTastLayer('first');
                            panToCoordinates(2011.6, 2397.0, 2.0);
                          }}
                          className={`px-2 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer text-center truncate ${
                            activeTastLayer === 'first'
                              ? 'bg-[#4F7942] text-white shadow-xs'
                              : 'bg-[#4F7942]/15 hover:bg-[#4F7942]/25 text-[#3D6132] dark:text-[#B0DB9C] border border-[#4F7942]/30'
                          }`}
                          title="1st Cohort (1501-1600): 5.69M Captives (West Central Africa)"
                        >
                          1st: 5.69M (WCA)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTastLayer('second');
                            panToCoordinates(2110.1, 2085.3, 2.0);
                          }}
                          className={`px-2 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer text-center truncate ${
                            activeTastLayer === 'second'
                              ? 'bg-[#D87040] text-white shadow-xs'
                              : 'bg-[#D87040]/15 hover:bg-[#D87040]/25 text-[#B05325] dark:text-[#FFB594] border border-[#D87040]/30'
                          }`}
                          title="2nd Cohort (1601-1700): 4.80M Captives (Bights of Benin & Biafra)"
                        >
                          2nd: 4.80M (Bights)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTastLayer('third');
                            panToCoordinates(2045.5, 1950.1, 2.0);
                          }}
                          className={`px-2 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer text-center truncate ${
                            activeTastLayer === 'third'
                              ? 'bg-[#C68B29] text-white shadow-xs'
                              : 'bg-[#C68B29]/15 hover:bg-[#C68B29]/25 text-[#9C6918] dark:text-[#FCE19B] border border-[#C68B29]/30'
                          }`}
                          title="3rd Cohort (1701-1867): 2.02M Captives (Upper Guinea & Senegambia)"
                        >
                          3rd: 2.02M (Upper Guinea)
                        </button>
                      </div>
                    </div>

                    {/* Silhouette Spotlight Toggle */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#E67E48]" />
                        <span className="text-[10px] font-medium text-[#2B241E] dark:text-[#F5EFE6]">
                          Silhouette Spotlight (Dims Tree)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSilhouetteGlowEnabled(prev => !prev)}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          silhouetteGlowEnabled
                            ? 'bg-[#E67E48] text-white shadow-xs'
                            : 'bg-black/10 dark:bg-white/10 text-[#7D6B5A] dark:text-[#B5A492]'
                        }`}
                      >
                        {silhouetteGlowEnabled ? 'Active' : 'Off'}
                      </button>
                    </div>

                    {/* Sovereign Country Territory Alignment Under Lineage Label */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-[#E67E48]" />
                        <div>
                          <span className="block text-[10px] font-medium text-[#2B241E] dark:text-[#F5EFE6]">
                            Align Territory Under Tree
                          </span>
                          <span className="block text-[8px] text-[#7D6B5A] dark:text-[#B5A492]">
                            Centers country polygon under lineage label on zoom
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTerritoryAlignmentEnabled(prev => {
                            const next = !prev;
                            if (!next) {
                              resetTerritoryDisplacements();
                            } else if (selectedEntity?.country || (selectedEntity && selectedEntity.type === 'country')) {
                              const countryToAlign = selectedEntity.country || selectedEntity.name;
                              setTimeout(() => alignCountryGeometryUnderLabel(countryToAlign), 50);
                            }
                            return next;
                          });
                        }}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isTerritoryAlignmentEnabled
                            ? 'bg-[#E67E48] text-white shadow-xs'
                            : 'bg-black/10 dark:bg-white/10 text-[#7D6B5A] dark:text-[#B5A492]'
                        }`}
                      >
                        {isTerritoryAlignmentEnabled ? 'Active' : 'Off'}
                      </button>
                    </div>

                    {/* Research Monographs Links */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (onNavigateToMolecular) onNavigateToMolecular();
                          else if (onSelectReport) onSelectReport('molecular-legacies');
                        }}
                        className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-left transition-all cursor-pointer flex items-center justify-between group/mono active:scale-98"
                        title="Open Molecular & Genetic Ancestry Report"
                      >
                        <div className="min-w-0 pr-1">
                          <span className="block text-[10px] font-bold text-indigo-900 dark:text-indigo-200 group-hover/mono:text-indigo-600 truncate">
                            Molecular Report
                          </span>
                          <span className="block text-[8px] text-[#7D6B5A] dark:text-[#A79888] truncate">
                            Genetics & Diaspora
                          </span>
                        </div>
                        <Dna className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover/mono:translate-x-0.5 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onNavigateToFoundations) onNavigateToFoundations();
                          else if (onSelectReport) onSelectReport('african-development-foundations');
                        }}
                        className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition-all cursor-pointer flex items-center justify-between group/found active:scale-98"
                        title="Open African Development Master Foundations Report"
                      >
                        <div className="min-w-0 pr-1">
                          <span className="block text-[10px] font-bold text-emerald-900 dark:text-emerald-200 group-hover/found:text-emerald-600 truncate">
                            Foundations Report
                          </span>
                          <span className="block text-[8px] text-[#7D6B5A] dark:text-[#A79888] truncate">
                            Colonial Roots
                          </span>
                        </div>
                        <Landmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover/found:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          3. RAW AUTHENTIC SVG CANVAS WITH FULL 100% FIDELITY & ZOOM/PAN
          ========================================================================= */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden transition-colors duration-300"
        style={{ touchAction: 'none', backgroundColor: paperColor, contain: 'layout paint' }}
      >
        <div
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${fitScale * zoom})`,
            transformOrigin: '0 0',
            willChange: 'transform',
            transition: isDragging.current ? 'none' : 'transform 0.08s ease-out'
          }}
          className="relative inline-block"
        >
          {/* SVG Global Interactive Styles */}
          <style>{`
            #africalia-master-sovereign-svg text,
            #africalia-master-sovereign-svg tspan,
            #africalia-master-sovereign-svg [id^="label--"],
            #africalia-master-sovereign-svg [id^="node--"],
            #africalia-master-sovereign-svg [id^="nodes--"],
            #africalia-master-sovereign-svg [id^="branch--"],
            #africalia-master-sovereign-svg [id^="branches--"],
            #africalia-master-sovereign-svg [id^="assoc--"],
            #africalia-master-sovereign-svg [id^="geo--country--"],
            #africalia-master-sovereign-svg ellipse,
            #africalia-master-sovereign-svg circle {
              cursor: pointer !important;
              pointer-events: auto !important;
            }
            #africalia-master-sovereign-svg [id^="label--country--"] path {
              cursor: pointer !important;
              pointer-events: auto !important;
              stroke: transparent !important;
              stroke-width: 16px !important;
              paint-order: stroke fill !important;
            }
            #africalia-master-sovereign-svg text {
              cursor: pointer !important;
              pointer-events: auto !important;
              stroke: transparent !important;
              stroke-width: 12px !important;
              paint-order: stroke fill !important;
            }
            #africalia-master-sovereign-svg ellipse,
            #africalia-master-sovereign-svg circle {
              cursor: pointer !important;
              pointer-events: auto !important;
              stroke: transparent !important;
              stroke-width: 10px !important;
              paint-order: stroke fill !important;
            }
            #africalia-master-sovereign-svg [id^="label--country--"]:hover,
            #africalia-master-sovereign-svg [id^="branch--country--"]:hover,
            #africalia-master-sovereign-svg [id^="node--country--"]:hover {
              filter: drop-shadow(0 0 12px rgba(230,126,72,0.95)) drop-shadow(0 0 24px rgba(230,126,72,0.6));
            }
            #africalia-master-sovereign-svg [id^="label--ethnic--"]:hover text,
            #africalia-master-sovereign-svg [id^="assoc--ethnic--"]:hover text,
            #africalia-master-sovereign-svg text:hover {
              fill: #E67E48 !important;
              filter: drop-shadow(0 0 8px rgba(230,126,72,0.85));
            }
            #africalia-master-sovereign-svg *:focus-visible {
              outline: 2.5px dashed #E67E48 !important;
              outline-offset: 4px !important;
            }
            #node--geo--country--cabo-verde,
            #CABO-VERDE {
              cursor: pointer;
              transition: all 0.3s ease;
            }
            #node--geo--country--cabo-verde:hover,
            #CABO-VERDE:hover {
              filter: drop-shadow(0 0 16px rgba(230,126,72,0.95)) drop-shadow(0 0 28px rgba(230,126,72,0.5));
            }
            #assoc--ethnic--country--cabo-verde text {
              cursor: pointer;
              transition: fill 0.2s ease, font-weight 0.2s ease, filter 0.2s ease;
            }
            #assoc--ethnic--country--cabo-verde text:hover {
              fill: #E67E48 !important;
              font-weight: 700;
              filter: drop-shadow(0 0 6px rgba(230,126,72,0.75));
            }

            /* Dynamic Level of Detail (LOD): At low zoom levels (<0.8x), declutter fine sub-branch text labels */
            ${zoom < 0.8 ? `
              #africalia-master-sovereign-svg [id^="label--ethnic--"],
              #africalia-master-sovereign-svg [id^="assoc--ethnic--"] text {
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
                transition: opacity 0.2s ease-out;
              }
            ` : `
              #africalia-master-sovereign-svg [id^="label--ethnic--"],
              #africalia-master-sovereign-svg [id^="assoc--ethnic--"] text {
                opacity: 1;
                transition: opacity 0.25s ease-in;
              }
            `}
          `}</style>

          {/* Africa UN Geo Scheme Visibility Toggle Rule */}
          {!showUnGeoScheme && (
            <style>{`
              #GEOGRAPHY,
              #geo--Africa--un-geoscheme,
              [id^="geo--region--"],
              [id^="geo--country--"] {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
              }
            `}</style>
          )}

          {/* Dynamic SVG Country Silhouette Spotlight and Continent Deep Dimming */}
          {silhouetteGlowEnabled && activeGeoCountryId && (
            <style>{`
              #geo--Africa--un-geoscheme {
                opacity: 0.12 !important;
                filter: grayscale(90%) contrast(85%) !important;
                transition: opacity 0.4s ease-in-out, filter 0.4s ease-in-out;
              }
              [id="${activeGeoCountryId}"] {
                opacity: 1 !important;
                fill: #E67E48 !important;
                stroke: #FFFFFF !important;
                stroke-width: 4.5px !important;
                stroke-linejoin: round !important;
                stroke-linecap: round !important;
                filter: drop-shadow(0 0 16px #E67E48) drop-shadow(0 0 32px rgba(230,126,72,0.85)) !important;
                transition: all 0.4s ease-in-out;
              }
              ${activeCountrySlug ? `
              [id="TREE"] [id*="${activeCountrySlug}" i],
              [id="LABELS"] [id*="${activeCountrySlug}" i],
              [id*="branch--country--${activeCountrySlug}" i],
              [id*="branches--country--${activeCountrySlug}" i],
              [id*="label--country--${activeCountrySlug}" i] {
                opacity: 1 !important;
                filter: drop-shadow(0 0 8px rgba(230,126,72,0.75)) !important;
                transition: all 0.3s ease-in-out;
              }
              ` : ''}
              ${selectedEntity?.id ? `
              [id="${selectedEntity.id}"] {
                opacity: 1 !important;
                filter: drop-shadow(0 0 14px #E67E48) !important;
                transition: all 0.3s ease-in-out;
              }
              ` : ''}
            `}</style>
          )}

          {/* Raw Authentic SVG rendered directly with 100% fidelity */}
          <div 
            style={{ 
              width: `${VBW}px`, 
              height: `${VBH}px`,
              backgroundColor: paperColor
            }}
            className="relative select-none pointer-events-auto [&>svg]:w-full [&>svg]:h-full [&>svg]:block cursor-pointer transition-colors duration-200"
            dangerouslySetInnerHTML={{ __html: rawSvgToDisplay }}
            onClick={handleSvgClick}
          />

          {/* Interactivity Overlay Layer (Reticle & Highlight Rings) */}
          {selectedEntity?.coords && (
            <svg 
              style={{ width: `${VBW}px`, height: `${VBH}px` }}
              className="absolute inset-0 pointer-events-none"
              viewBox={`0 0 ${VBW} ${VBH}`}
            >
              <g transform={`translate(${selectedEntity.coords.x}, ${selectedEntity.coords.y})`}>
                {/* Pulsating Fruit-Tonal Target Reticle */}
                <circle 
                  cx={0} 
                  cy={0} 
                  r={selectedEntity.coords.r + 10} 
                  fill="none" 
                  stroke="#E67E48" 
                  strokeWidth="3.5" 
                  className="animate-pulse"
                />
                <circle 
                  cx={0} 
                  cy={0} 
                  r={selectedEntity.coords.r + 20} 
                  fill="none" 
                  stroke="#E67E48" 
                  strokeWidth="1.5" 
                  strokeDasharray="6 4"
                />
              </g>
            </svg>
          )}
        </div>

        {/* Radial Tree Geometry Skeleton Indicator Overlay on Initial Master Render */}
        <AnimatePresence mode="wait">
          {isSvgLoading && (
            <motion.div
              key="radial-tree-canvas-skeleton"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ 
                opacity: 0, 
                scale: 1.02,
                transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } 
              }}
              className="absolute inset-0 z-40 w-full h-full pointer-events-none"
            >
              <RadialTreeSkeleton canvasBg={canvasBg} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Pinch-to-Zoom Visual Feedback Chip */}
        <AnimatePresence>
          {(showPinchFeedback || isPinching) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8, transition: { duration: 0.3 } }}
              transition={{ type: 'spring', damping: 20, stiffness: 350 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            >
              <div className="px-4 py-2 rounded-full bg-[#1E1B18]/90 text-amber-200 border border-amber-500/40 shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-mono font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                <span>Zoom Scale:</span>
                <span className="text-white text-sm font-black">{Math.round(zoom * 100)}%</span>
                {zoom < 0.8 && (
                  <span className="text-[10px] text-amber-400/80 uppercase font-sans font-normal ml-1">
                    (Overview LOD)
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================================
          3. SCHOLARLY DOSSIER INSPECTOR DRAWER (Slim Smooth Cozy Scrollbar)
          ========================================================================= */}
      <AnimatePresence mode="wait">
        {selectedEntity && selectedEntity.type === 'ethnic' && (() => {
          const cleanCountry = selectedEntity.country && selectedEntity.country !== 'African Continent' && selectedEntity.country !== 'Historical African Homeland'
            ? selectedEntity.country
            : undefined;

          const baseName = selectedEntity.name
            .replace(/\s+[NCESW]$/i, '')
            .replace(/[-_][ncesw]$/i, '')
            .replace(/\s+\d+$/, '')
            .trim();

          let conduit = AFRICALIA_COUNTRY_CONDUITS.find(c =>
            (cleanCountry && (
              c.name.toLowerCase() === cleanCountry.toLowerCase() ||
              c.id.toLowerCase() === cleanCountry.toLowerCase().replace(/\s+/g, '-')
            )) ||
            c.ethnicGroups.some(eg => 
              eg.name.toLowerCase() === selectedEntity.name.toLowerCase() ||
              eg.name.toLowerCase() === baseName.toLowerCase() ||
              baseName.toLowerCase().includes(eg.name.toLowerCase()) ||
              eg.name.toLowerCase().includes(baseName.toLowerCase())
            )
          );

          if (!conduit && cleanCountry) {
            conduit = AFRICALIA_COUNTRY_CONDUITS.find(c =>
              c.name.toLowerCase().includes(cleanCountry.toLowerCase()) ||
              cleanCountry.toLowerCase().includes(c.name.toLowerCase())
            );
          }

          const siblingEthnicGroups = conduit 
            ? conduit.ethnicGroups 
            : [{ name: selectedEntity.name, nodeX: selectedEntity.coords?.x || 0, nodeY: selectedEntity.coords?.y || 0 }];
          
          let currentEthnicIndex = siblingEthnicGroups.findIndex(
            eg => eg.name.toLowerCase() === selectedEntity.name.toLowerCase() ||
                  eg.name.toLowerCase() === baseName.toLowerCase() ||
                  baseName.toLowerCase().includes(eg.name.toLowerCase()) ||
                  eg.name.toLowerCase().includes(baseName.toLowerCase())
          );
          if (currentEthnicIndex < 0) currentEthnicIndex = 0;

          return (
            <WikipediaEthnicDossier
              key={`ethnic-${selectedEntity.name}`}
              ethnicName={selectedEntity.name}
              countryName={conduit?.name || selectedEntity.country}
              regionName={conduit?.region || selectedEntity.region}
              tastVolumeShare={conduit?.tastVolumeShare || selectedEntity.tastVolumeShare}
              siblingEthnicGroups={siblingEthnicGroups}
              currentEthnicIndex={currentEthnicIndex}
              isCollapsed={isDossierCollapsed}
              onToggleCollapse={() => setIsDossierCollapsed(prev => !prev)}
              onSelectEthnicIndex={(newIndex) => {
                if (conduit && conduit.ethnicGroups[newIndex]) {
                  const eg = conduit.ethnicGroups[newIndex];
                  const wiki = findWikipediaEntry(eg.name);
                  const newEntity: SelectedEntityData = {
                    id: `${conduit.id}-${eg.name.toLowerCase().replace(/\s+/g, '-')}`,
                    name: eg.name,
                    type: 'ethnic',
                    country: conduit.name,
                    region: conduit.region,
                    tastVolumeShare: conduit.tastVolumeShare,
                    linguisticFamily: wiki?.languages,
                    description: wiki?.extract || `Documented historical ethnic lineage for ${eg.name}.`,
                    coords: { x: eg.nodeX, y: eg.nodeY, r: 14 }
                  };
                  setSelectedEntity(newEntity);
                  zoomToCountryRegion(conduit.name, { x: eg.nodeX, y: eg.nodeY });
                }
              }}
              cohortLabel={
                selectedEntity.tastVolumeShare !== undefined
                  ? selectedEntity.tastVolumeShare > 40
                    ? '1st Cohort · West Central Africa'
                    : selectedEntity.tastVolumeShare > 15
                    ? '2nd Cohort · Bights of Benin & Biafra'
                    : '3rd Cohort · Gold Coast & Senegambia'
                  : undefined
              }
              cohortColor={selectedEntity.color}
              onClose={handleClearFocus}
              onFocusCoordinates={
                selectedEntity.coords
                  ? () => panToCoordinates(selectedEntity.coords!.x, selectedEntity.coords!.y, 2.4)
                  : undefined
              }
              onSelectLinguisticFamily={(fam) => {
                setSelectedLinguisticFamily(fam);
                setIsLeftDockOpen(true);
              }}
              onNavigateToMolecular={onNavigateToMolecular}
              onNavigateToFoundations={onNavigateToFoundations}
              onNavigateToSlaveTrade={onNavigateToSlaveTrade}
              onSelectReport={onSelectReport}
              onNavigateToLanguages={onNavigateToLanguages}
            />
          );
        })()}

        {selectedEntity && selectedEntity.type !== 'ethnic' && (
          isCountryDossierCollapsed ? (
            <motion.div
              key="country-dossier-collapsed-pill"
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="absolute top-4 right-4 sm:right-6 z-40"
            >
              <button
                type="button"
                onClick={() => setIsCountryDossierCollapsed(false)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FAF7F2]/95 dark:bg-[#1E1B18]/95 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md text-[#2B241E] dark:text-[#F5EFE6] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                title="Expand Sovereign Country Dossier"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#E67E48] animate-pulse" />
                <span className="text-xs font-serif font-bold text-[#2B241E] dark:text-[#F5EFE6]">
                  {selectedEntity.name}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#B8571A] dark:text-[#FFA573] bg-[#E67E48]/15 px-2 py-0.5 rounded-full border border-[#E67E48]/30">
                  Expand Dossier
                </span>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key={`entity-${selectedEntity.id}`}
              initial={{ opacity: 0, x: 28, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.98 }}
              transition={{ type: "spring", damping: 27, stiffness: 330 }}
              className="absolute top-4 right-4 bottom-4 z-40 w-80 sm:w-96 max-w-[calc(100vw-32px)] rounded-3xl bg-[#FAF7F2]/95 dark:bg-[#1E1B18]/95 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_15px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.6)] p-5 flex flex-col space-y-4 no-drag backdrop-blur-md"
              id="scholarly-dossier-inspector"
            >
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#E5DDD0] dark:border-[#38322B]">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#B8571A] dark:text-[#FFA573] bg-[#E67E48]/15 px-2.5 py-0.5 rounded-full border border-[#E67E48]/30">
                    {selectedEntity.type.toUpperCase()} CONDUIT
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#2B241E] dark:text-[#F5EFE6] mt-1.5 leading-snug">
                    {selectedEntity.name}
                  </h3>
                  {selectedEntity.region && (
                    <p className="text-xs text-[#7D6B5A] dark:text-[#B5A492] mt-0.5">
                      {selectedEntity.country ? `${selectedEntity.country} • ` : ''}{selectedEntity.region}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsCountryDossierCollapsed(true)}
                    className="p-1.5 rounded-full text-[#7D6B5A] hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500 transition-colors cursor-pointer"
                    title="Minimize dossier to floating pill"
                  >
                    <span className="text-xs font-mono font-bold">_</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFocus}
                    className="p-1.5 rounded-full text-[#7D6B5A] hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500 transition-colors cursor-pointer"
                    title="Close dossier"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

          {/* Drawer Body with Custom Slim Smooth Cozy Scrollbar */}
          <div className="overflow-y-auto pr-1.5 drawer-cozy-scrollbar space-y-4 flex-1 text-xs">
            {/* Demographic or Volume Metrics */}
            {(selectedEntity.count || selectedEntity.tastVolumeShare) && (
              <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B] space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#7D6B5A] dark:text-[#B5A492]">
                  Documented TAST Volume
                </p>
                {selectedEntity.count && (
                  <p className="text-base font-bold text-[#2B241E] dark:text-[#F5EFE6]">
                    {selectedEntity.count}
                  </p>
                )}
                {selectedEntity.tastVolumeShare && (
                  <p className="text-[11px] text-[#7D6B5A] dark:text-[#B5A492]">
                    Transatlantic Embarkation Share: <span className="font-bold text-[#E67E48]">{selectedEntity.tastVolumeShare}%</span>
                  </p>
                )}
              </div>
            )}

            {/* Documented Ethnic Groups under this Conduit */}
            {(() => {
              const conduit = AFRICALIA_COUNTRY_CONDUITS.find(c => 
                c.name.toLowerCase() === selectedEntity.name.toLowerCase() || 
                c.id.toLowerCase() === selectedEntity.id.toLowerCase()
              );
              if (!conduit || !conduit.ethnicGroups.length) return null;
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7D6B5A] dark:text-[#B5A492]">
                      Documented Ethnic Lineages ({conduit.ethnicGroups.length})
                    </h4>
                    <span className="text-[9px] text-[#E67E48] font-semibold">Click for Wikipedia</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto drawer-cozy-scrollbar p-1">
                    {conduit.ethnicGroups.map((eg) => (
                      <button
                        key={eg.name}
                        type="button"
                        onClick={() => {
                          setSelectedEntity({
                            id: `${conduit.id}-${eg.name.toLowerCase().replace(/\s+/g, '-')}`,
                            name: eg.name,
                            type: 'ethnic',
                            country: conduit.name,
                            region: conduit.region,
                            tastVolumeShare: conduit.tastVolumeShare,
                            coords: { x: eg.nodeX, y: eg.nodeY, r: 14 }
                          });
                          zoomToCountryRegion(conduit.name, { x: eg.nodeX, y: eg.nodeY });
                        }}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#E67E48]/10 hover:bg-[#E67E48]/25 text-[#B8571A] dark:text-[#FFA573] border border-[#E67E48]/30 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                        title={`Open Wikipedia Dossier for ${eg.name}`}
                      >
                        <span>{eg.name}</span>
                        <ChevronRight className="w-3 h-3 text-[#E67E48]/60" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Historical Narrative */}
            {selectedEntity.description && (
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7D6B5A] dark:text-[#B5A492]">
                  Historical Description & Provenance
                </h4>
                <p className="text-[#52463B] dark:text-[#C4B7A6] leading-relaxed">
                  {selectedEntity.description}
                </p>
              </div>
            )}

            {/* Rich Editorial Country Development & TAST Foundations Panel */}
            <RichEditorialCountryDevelopmentPanel
              countryName={selectedEntity.country || selectedEntity.name}
              countryCode={selectedEntity.name}
              regionName={selectedEntity.region}
              tastVolumeShare={selectedEntity.tastVolumeShare}
              onNavigateToMolecular={onNavigateToMolecular}
              onNavigateToFoundations={onNavigateToFoundations}
              onNavigateToSlaveTrade={onNavigateToSlaveTrade}
              onSelectReport={onSelectReport}
              compact={false}
            />

            {/* Cabo Verde Crucible Linkage */}
            <div className="p-3 rounded-2xl bg-[#E67E48]/10 border border-[#E67E48]/25 space-y-1">
              <p className="text-[10px] font-bold uppercase text-[#B8571A] dark:text-[#FFA573] flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Cabo Verde Transatlantic Crucible Linkage
              </p>
              <p className="text-[11px] text-[#52463B] dark:text-[#C4B7A6] leading-relaxed">
                Lineages were processed through the Macaronesian maritime nexus, establishing foundational African-Atlantic creolization and linguistic transmission.
              </p>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="pt-3 border-t border-[#E5DDD0] dark:border-[#38322B] flex flex-col gap-2">
            {onNavigateToSlaveTrade && (
              <button
                type="button"
                onClick={onNavigateToSlaveTrade}
                className="w-full py-2.5 px-3 rounded-full text-xs font-semibold bg-[#2B241E] dark:bg-[#F5EFE6] text-[#F5EFE6] dark:text-[#2B241E] hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Explore in Slave Trade Database</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            
            {/* Pill to dismiss */}
            <button
              type="button"
              onClick={() => setSelectedEntity(null)}
              className="w-full py-2 px-3 rounded-full text-xs font-semibold border border-[#E5DDD0] dark:border-[#38322B] text-[#7D6B5A] dark:text-[#B5A492] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer active:scale-95"
            >
              Close Dossier
            </button>
          </div>
        </motion.div>
      ))}
      </AnimatePresence>

      {/* Academic Citation & Vector Export Modal */}
      <AcademicExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Africalia Sovereign Ethnic Tree of Life"
        sourceContext="Africalia Sovereign Lineage Vector Atlas & Harvard / Wikipedia Anthropological Corpus"
        citationMetadata={{
          authors: ['Africalia Sovereign Lineage Initiative', 'UNESCO General History of Africa Project', 'Greenberg Linguistic Classification'],
          year: 2026,
          datasetName: 'Pan-African Ethno-Linguistic Continuum and Conduit Lineages',
          url: window?.location?.href || 'https://africalia.org/#ethnic-tree',
          doi: '10.5281/zenodo.africalia.tree.2026',
          version: '2026.2'
        }}
        svgContainerId="africalia-master-sovereign-svg"
      />
    </div>
  );
};
