import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Maximize2
} from 'lucide-react';
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

export const AfricaliaExplorer: React.FC<AfricaliaExplorerProps> = ({
  onSelectReport,
  onNavigateToSlaveTrade
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera State
  const [zoom, setZoom] = useState<number>(1);
  const [fitScale, setFitScale] = useState<number>(0.65);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Custom SVG upload state
  const [customSvgMarkup, setCustomSvgMarkup] = useState<string | null>(null);

  // Active raw SVG markup displayed in DOM
  const rawSvgToDisplay = useMemo(() => {
    return customSvgMarkup || AUTHENTIC_ETHNIC_TREE_RAW_SVG;
  }, [customSvgMarkup]);

  // Selection & Inspector state
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntityData | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [activeTastLayer, setActiveTastLayer] = useState<'all' | 'first' | 'second' | 'third'>('all');
  
  // Single Left Dock Collapse State (never stacks with other panels)
  const [isLeftDockOpen, setIsLeftDockOpen] = useState<boolean>(true);
  const [methodologyModalOpen, setMethodologyModalOpen] = useState<boolean>(false);

  // Drag pan tracking
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number; startX: number; startY: number; moved: boolean }>({
    x: 0, y: 0, startX: 0, startY: 0, moved: false
  });

  // Fit View: Full screen initial scale centered on Africa Motherland (CX, CY)
  // Respecting: "display it directly on the view and full screen, even if part of it is clipped by the screen view. The user can easily pan and zoom to the desired location."
  const fitView = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    
    // Scale generously so the vector tree fills the screen instead of being shrunken into a small letterbox
    const optimalScale = Math.max(clientWidth, clientHeight) / 2800;
    const clampedScale = Math.min(Math.max(optimalScale, 0.45), 1.25);
    
    setFitScale(clampedScale);
    setZoom(1);
    setPos({
      x: clientWidth / 2 - CX * clampedScale,
      y: clientHeight / 2 - CY * clampedScale
    });
  }, []);

  // Initialize camera on mount and on window resize
  useEffect(() => {
    fitView();
    const handleResize = () => fitView();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitView]);

  // Camera Zoom delta
  const handleZoomDelta = (factor: number) => {
    setZoom(prev => {
      const next = Math.min(Math.max(prev * factor, 0.25), 6.0);
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

  // Mouse wheel zoom centered on cursor
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const currentScale = fitScale * zoom;
    const nextZoom = Math.min(Math.max(zoom * zoomFactor, 0.25), 6.0);
    const nextScale = fitScale * nextZoom;

    setPos(prev => ({
      x: mouseX - (mouseX - prev.x) * (nextScale / currentScale),
      y: mouseY - (mouseY - prev.y) * (nextScale / currentScale)
    }));
    setZoom(nextZoom);
  };

  // Pan camera to specific SVG coordinates
  const panToCoordinates = useCallback((targetX: number, targetY: number, targetZoom = 1.8) => {
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
    const list: { id: string; name: string; type: 'country' | 'ethnic' | 'region'; region: string; country?: string; x?: number; y?: number }[] = [];
    
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
        list.push({
          id: `${c.id}-${eg.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: eg.name,
          type: 'ethnic',
          region: c.region,
          country: c.name,
          x: eg.nodeX,
          y: eg.nodeY
        });
      });
    });

    return list;
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return searchIndex.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.region.toLowerCase().includes(q) ||
      (item.country && item.country.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [searchQuery, searchIndex]);

  // Available countries filtered by selected region
  const availableCountries = useMemo(() => {
    if (selectedRegion === 'All') return AFRICALIA_COUNTRY_CONDUITS;
    return AFRICALIA_COUNTRY_CONDUITS.filter(c => c.region === selectedRegion);
  }, [selectedRegion]);

  // Lookup entity by raw SVG element id or name
  const resolveEntityFromSvgElement = useCallback((id: string, element?: SVGElement): SelectedEntityData | null => {
    // 1. Direct match in raw SVG map
    if (RAW_SVG_ENTITY_MAP[id]) {
      const match = RAW_SVG_ENTITY_MAP[id];
      return {
        id,
        name: match.name || id,
        type: match.type || 'central',
        region: match.region,
        count: match.count,
        tastVolumeShare: match.tastVolumeShare,
        description: match.description,
        coords: match.coords
      };
    }

    // 2. Country match: e.g. branch--country--niger or node--country--mali
    const countryMatch = id.match(/(?:branch|node)--country--([a-z-]+)/);
    if (countryMatch) {
      const countrySlug = countryMatch[1];
      const conduit = AFRICALIA_COUNTRY_CONDUITS.find(c => 
        c.id.toLowerCase() === countrySlug || 
        c.name.toLowerCase().replace(/\s+/g, '-') === countrySlug
      );
      if (conduit) {
        return {
          id,
          name: conduit.name,
          type: 'country',
          region: conduit.region,
          tastVolumeShare: conduit.tastVolumeShare,
          color: conduit.color,
          description: `Sovereign conduit for ${conduit.name} carrying documented ethnic lineages and embarkation flows.`,
          coords: { x: conduit.labelX, y: conduit.labelY, r: 16 }
        };
      }
    }

    // 3. Ethnic match: e.g. branch--ethnic--tuareg--country--niger
    const ethnicMatch = id.match(/branch--ethnic--([a-z-]+)--country--([a-z-]+)/);
    if (ethnicMatch) {
      const ethnicSlug = ethnicMatch[1];
      const countrySlug = ethnicMatch[2];
      const conduit = AFRICALIA_COUNTRY_CONDUITS.find(c => 
        c.id.toLowerCase() === countrySlug || 
        c.name.toLowerCase().replace(/\s+/g, '-') === countrySlug
      );
      const cleanName = ethnicSlug.charAt(0).toUpperCase() + ethnicSlug.slice(1).replace(/-/g, ' ');
      return {
        id,
        name: cleanName,
        type: 'ethnic',
        country: conduit ? conduit.name : countrySlug,
        region: conduit ? conduit.region : 'Western Africa',
        description: `Documented ethnic branch for ${cleanName} within historical genealogical records.`,
        coords: conduit ? { x: conduit.labelX, y: conduit.labelY, r: 12 } : undefined
      };
    }

    // 4. Cabo Verde transatlantic association
    if (id.includes('cabo-verde')) {
      return {
        id,
        name: 'Cabo Verde Island Crucible',
        type: 'cabo-verde',
        region: 'Western Africa',
        description: 'First maritime creole crucible linking Senegambian and Upper Guinea lineages with the transatlantic diaspora.',
        coords: { x: 924.38, y: 1842.10, r: 22 }
      };
    }

    // 5. Fallback if element has text content or data attributes
    if (element) {
      const textContent = element.textContent?.trim();
      if (textContent && textContent.length < 50) {
        return {
          id,
          name: textContent,
          type: 'central',
          description: `Historical entity identified in sovereign vector cartography.`
        };
      }
    }

    return null;
  }, []);

  // Handle click on raw SVG elements directly with 100% fidelity
  const handleSvgClick = (e: React.MouseEvent) => {
    if (dragStart.current.moved) return;

    const target = e.target as SVGElement;
    if (!target) return;

    // Find the nearest identified parent with an id
    const identified = target.closest('[id]') as SVGElement | null;
    if (identified && identified.id) {
      const entity = resolveEntityFromSvgElement(identified.id, identified);
      if (entity) {
        setSelectedEntity(entity);
        if (entity.coords) {
          panToCoordinates(entity.coords.x, entity.coords.y, 2.2);
        }
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

  // Reset all filters and camera to default
  const handleResetAll = () => {
    setSelectedRegion('All');
    setSelectedCountry('All');
    setSearchQuery('');
    setActiveTastLayer('all');
    setSelectedEntity(null);
    fitView();
  };

  // Reset focus filters only
  const handleClearFocus = () => {
    setSelectedRegion('All');
    setSelectedCountry('All');
    setSearchQuery('');
    setActiveTastLayer('all');
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-[#161412] text-[#F5EFE6] select-none cursor-grab active:cursor-grabbing font-sans"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      id="africalia-explorer-root"
    >
      {/* =========================================================================
          1. TOP CENTER TITLE PILL (Clean & Non-colliding)
          ========================================================================= */}
      <div 
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF7F2]/95 dark:bg-[#1E1B18]/95 border border-[#E5DDD0] dark:border-[#38322B] shadow-md text-xs font-semibold text-[#52463B] dark:text-[#C4B7A6] backdrop-blur-md"
      >
        <div className="w-2 h-2 rounded-full bg-[#E67E48] animate-pulse" />
        <span>Sovereign Africalia Vector Tree • Raw Authentic SVG (100% Fidelity)</span>
      </div>

      {/* =========================================================================
          2. UNIFIED LEFT DOCK: FOCUS GEOGRAPHY & SEARCH (Never Stacks!)
          ========================================================================= */}
      {isLeftDockOpen ? (
        <div 
          className="absolute top-4 left-4 z-30 w-76 sm:w-84 max-h-[calc(100vh-32px)] flex flex-col rounded-3xl bg-[#FAF7F2]/95 dark:bg-[#1E1B18]/95 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_12px_40px_rgba(75,55,35,0.1)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] overflow-hidden no-drag transition-all duration-200"
          id="unified-geography-search-dock"
        >
          {/* Dock Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5DDD0] dark:border-[#38322B]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#E67E48]/15 border border-[#E67E48]/40 text-[#B8571A] dark:text-[#FFA573] grid place-items-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#2B241E] dark:text-[#F5EFE6] leading-tight">Focus & Tree Search</h2>
                <p className="text-[10px] text-[#7D6B5A] dark:text-[#B5A492]">Sovereign Genealogical Navigator</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
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

              {/* Minimize Dock Button */}
              <button
                type="button"
                onClick={() => setIsLeftDockOpen(false)}
                className="p-1.5 rounded-lg text-[#7D6B5A] dark:text-[#B5A492] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                title="Minimize panel"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dock Scrollable Body with Cozy Scrollbar */}
          <div className="p-3.5 space-y-3 overflow-y-auto drawer-cozy-scrollbar flex-1">
            {/* Search Input Bar */}
            <div className="relative">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B] text-xs">
                <Search className="w-3.5 h-3.5 text-[#8C7C70] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search nation, ethnic node, region..."
                  className="w-full bg-transparent outline-none text-[#2B241E] dark:text-[#F5EFE6] placeholder-[#8C7C70] text-xs"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#8C7C70] cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Integrated Search Results List */}
              {searchResults.length > 0 && (
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
                            panToCoordinates(conduit.labelX, conduit.labelY, 2.2);
                            setSelectedEntity({
                              id: conduit.id,
                              name: conduit.name,
                              type: 'country',
                              region: conduit.region,
                              tastVolumeShare: conduit.tastVolumeShare,
                              color: conduit.color,
                              coords: { x: conduit.labelX, y: conduit.labelY, r: 16 }
                            });
                          }
                        } else if (item.type === 'ethnic') {
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
                        } else {
                          setSelectedRegion(item.name);
                        }
                        setSearchQuery('');
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
                    const firstConduit = AFRICALIA_COUNTRY_CONDUITS.find(c => c.region === reg);
                    if (firstConduit) {
                      panToCoordinates(firstConduit.labelX, firstConduit.labelY, 1.6);
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
                      panToCoordinates(conduit.labelX, conduit.labelY, 2.2);
                      setSelectedEntity({
                        id: conduit.id,
                        name: conduit.name,
                        type: 'country',
                        region: conduit.region,
                        tastVolumeShare: conduit.tastVolumeShare,
                        color: conduit.color,
                        coords: { x: conduit.labelX, y: conduit.labelY, r: 16 }
                      });
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

            {/* Fruit-Inspired Pills for Clear & Reset Buttons */}
            <div className="pt-2 border-t border-[#E5DDD0] dark:border-[#38322B] flex items-center gap-2">
              {/* Reset View Pill (Warm Apricot / Persimmon) */}
              <button
                type="button"
                onClick={fitView}
                className="flex-1 px-3 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-[#FA8C58]/15 hover:bg-[#FA8C58]/25 text-[#B8571A] dark:text-[#FFA573] border border-[#FA8C58]/40 shadow-sm active:scale-95"
                title="Reset zoom and center on origin"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#E67E48]" />
                <span>Reset View</span>
              </button>

              {/* Clear Filters Pill (Warm Pomegranate / Ripe Fig) */}
              <button
                type="button"
                onClick={handleClearFocus}
                className="flex-1 px-3 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-[#C44536]/15 hover:bg-[#C44536]/25 text-[#9C2F22] dark:text-[#F89D93] border border-[#C44536]/40 shadow-sm active:scale-95"
                title="Clear all region and search filters"
              >
                <X className="w-3.5 h-3.5 text-[#BF4342]" />
                <span>Clear Filters</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Minimized Left Floating Pill */
        <button
          type="button"
          onClick={() => setIsLeftDockOpen(true)}
          className="absolute top-4 left-4 z-30 px-4 py-2.5 rounded-full bg-[#FAF7F2]/95 dark:bg-[#1E1B18]/95 border border-[#E5DDD0] dark:border-[#38322B] shadow-md flex items-center gap-2 text-xs font-semibold text-[#52463B] dark:text-[#C4B7A6] hover:bg-[#F2ECE2] dark:hover:bg-[#27231F] transition-all cursor-pointer active:scale-95"
        >
          <Compass className="w-3.5 h-3.5 text-[#E67E48]" />
          <span>Focus & Search</span>
          {(selectedRegion !== 'All' || selectedCountry !== 'All' || searchQuery) && (
            <span className="w-2 h-2 rounded-full bg-[#E67E48]" />
          )}
        </button>
      )}

      {/* =========================================================================
          3. RAW AUTHENTIC SVG CANVAS WITH FULL 100% FIDELITY & ZOOM/PAN
          ========================================================================= */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        <div
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${fitScale * zoom})`,
            transformOrigin: '0 0',
            transition: isDragging.current ? 'none' : 'transform 0.08s ease-out'
          }}
          className="relative inline-block"
        >
          {/* Raw Authentic SVG rendered directly with 100% fidelity */}
          <div 
            className="w-[4427.0043px] h-[4427.0043px] select-none pointer-events-auto"
            dangerouslySetInnerHTML={{ __html: rawSvgToDisplay }}
            onClick={handleSvgClick}
          />

          {/* Interactivity Overlay Layer (Reticle & Highlight Rings) */}
          {selectedEntity?.coords && (
            <svg 
              className="absolute inset-0 w-[4427.0043px] h-[4427.0043px] pointer-events-none"
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
      </div>

      {/* =========================================================================
          4. UNIFIED BOTTOM CONTROL DOCK (Camera + TAST Fruit Pills)
          ========================================================================= */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-full bg-[#FAF7F2]/95 dark:bg-[#1E1B18]/95 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_8px_30px_rgba(75,55,35,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-xs max-w-[95vw] overflow-x-auto no-scrollbar no-drag"
        id="unified-bottom-control-dock"
      >
        {/* Camera Navigation Group */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handleZoomDelta(0.82)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#52463B] dark:text-[#C4B7A6] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono font-bold text-[#7D6B5A] dark:text-[#B5A492] px-1 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={() => handleZoomDelta(1.22)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#52463B] dark:text-[#C4B7A6] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Reset View Pill (Warm Apricot) */}
          <button
            type="button"
            onClick={fitView}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-[#FA8C58]/15 hover:bg-[#FA8C58]/25 text-[#B8571A] dark:text-[#FFA573] border border-[#FA8C58]/40 shadow-sm active:scale-95"
            title="Reset view to center"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#E67E48]" />
            <span>Reset View</span>
          </button>
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] h-5 bg-[#E5DDD0] dark:border-[#38322B] shrink-0" />

        {/* TAST Layer Cohort Fruit Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#7D6B5A] dark:text-[#B5A492] px-1 hidden lg:inline">
            TAST COHORTS
          </span>

          {/* All Cohorts (Tamarind / Plum) */}
          <button
            type="button"
            onClick={() => setActiveTastLayer('all')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              activeTastLayer === 'all'
                ? 'bg-[#724E5B] text-white shadow-sm'
                : 'bg-[#724E5B]/15 hover:bg-[#724E5B]/25 text-[#5F3B4A] dark:text-[#E2B2C6] border border-[#724E5B]/30'
            }`}
          >
            All Cohorts
          </button>

          {/* 1st Cohort (Avocado / Green Fig) */}
          <button
            type="button"
            onClick={() => {
              setActiveTastLayer('first');
              panToCoordinates(2011.6, 2397.0, 2.0);
            }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              activeTastLayer === 'first'
                ? 'bg-[#4F7942] text-white shadow-sm'
                : 'bg-[#4F7942]/15 hover:bg-[#4F7942]/25 text-[#3D6132] dark:text-[#B0DB9C] border border-[#4F7942]/30'
            }`}
            title="Cohort 1: 5.69M Captives (West Central Africa)"
          >
            1st: 5.69M
          </button>

          {/* 2nd Cohort (Papaya / Persimmon) */}
          <button
            type="button"
            onClick={() => {
              setActiveTastLayer('second');
              panToCoordinates(2110.1, 2085.3, 2.0);
            }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              activeTastLayer === 'second'
                ? 'bg-[#D87040] text-white shadow-sm'
                : 'bg-[#D87040]/15 hover:bg-[#D87040]/25 text-[#B05325] dark:text-[#FFB594] border border-[#D87040]/30'
            }`}
            title="Cohort 2: 4.80M Captives (Bights of Benin & Biafra)"
          >
            2nd: 4.80M
          </button>

          {/* 3rd Cohort (Golden Mango / Quince) */}
          <button
            type="button"
            onClick={() => {
              setActiveTastLayer('third');
              panToCoordinates(2045.5, 1950.1, 2.0);
            }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              activeTastLayer === 'third'
                ? 'bg-[#C68B29] text-white shadow-sm'
                : 'bg-[#C68B29]/15 hover:bg-[#C68B29]/25 text-[#9C6918] dark:text-[#FCE19B] border border-[#C68B29]/30'
            }`}
            title="Cohort 3: 2.02M Captives (Gold Coast & Senegambia)"
          >
            3rd: 2.02M
          </button>

          {/* Clear TAST Layer Pill if filtered */}
          {activeTastLayer !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveTastLayer('all')}
              className="px-2.5 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1 bg-[#C44536]/15 hover:bg-[#C44536]/25 text-[#9C2F22] dark:text-[#F89D93] border border-[#C44536]/40 transition-all cursor-pointer active:scale-95"
              title="Clear cohort filter"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          5. SCHOLARLY DOSSIER INSPECTOR DRAWER (Slim Smooth Cozy Scrollbar)
          ========================================================================= */}
      {selectedEntity && (
        <div 
          className="absolute top-4 right-4 bottom-4 z-40 w-80 sm:w-96 max-w-[calc(100vw-32px)] rounded-3xl bg-[#FAF7F2]/95 dark:bg-[#1E1B18]/95 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_15px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.6)] p-5 flex flex-col space-y-4 no-drag animate-in fade-in slide-in-from-right-4 duration-200"
          id="scholarly-dossier-inspector"
        >
          {/* Drawer Header */}
          <div className="flex items-start justify-between pb-3 border-b border-[#E5DDD0] dark:border-[#38322B]">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#B8571A] dark:text-[#FFA573] bg-[#E67E48]/15 px-2.5 py-0.5 rounded-full border border-[#E67E48]/30">
                {selectedEntity.type.toUpperCase()} DOSSIER
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
            <button
              type="button"
              onClick={() => setSelectedEntity(null)}
              className="p-1.5 rounded-full text-[#7D6B5A] hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500 transition-colors cursor-pointer"
              title="Close dossier"
            >
              <X className="w-5 h-5" />
            </button>
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
              className="w-full py-2 px-3 rounded-full text-xs font-semibold border border-[#E5DDD0] dark:border-[#38322B] text-[#7D6B5A] dark:text-[#B5A492] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
