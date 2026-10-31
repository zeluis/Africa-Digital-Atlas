/**
 * AfricanPortsMap.tsx
 * Interactive Cartographic Visualizer of African Embarkation Ports, Forts, and Coastal Enclaves
 * Architected in the vein of ArchivalImageViewer.tsx:
 * - Full-height & full-width museum matte viewport with smooth pan (drag) & wheel/touch zoom
 * - Tightly calibrated initial framing ({ x: 300, y: 1480, w: 4550, h: 3000 }) cropping empty north/south regions
 * - Integrated header toolbar with zoom controls, fullscreen, high-contrast, reset, and previous/next stepper
 * - Bottom toggleable port filmstrip / carousel tray with smooth auto-scroll to active port and dedicated toggle handle
 * - Collapsible 3-tab rich metadata dossier drawer perfectly aligned (w-5/12 xl:w-1/3) matching ArchivalImageViewer
 * - Integrated 47 Ports & +12M Captives interactive deck with 8-corridor hover highlights
 * - Corner Archival Radar Mini-Map positioned dynamically to prevent overlay collisions
 * - 47 coastal embarkation ports bound to exact coastal vector geometry with seaward leader lines & badges
 */

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Castle,
  Shield,
  Anchor,
  Compass,
  Filter,
  Info,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Users,
  Layers,
  MapPin,
  Sparkles,
  Contrast,
  Grid,
  Copy,
  Check,
  BookOpen,
  Calendar,
  Search,
  X,
  PanelRightClose,
  PanelRightOpen,
  Wind,
  Waves,
  Play,
  Pause
} from 'lucide-react';
import { AFRICAN_EMBARKATION_PORTS, AfricanEmbarkationPort, projectPortToSvg } from '../../data/slaveVoyagesPorts';
import { AfricaVectorContinent, COUNTRY_TO_EMBARKATION_ZONE } from '../common/AfricaVectorContinent';
import { DynamicIcon } from '../DynamicIcon';

interface AfricanPortsMapProps {
  onSelectPort?: (port: AfricanEmbarkationPort) => void;
  onClose?: () => void;
  mode?: 'embedded' | 'fullscreen' | 'modal';
}

type TabType = 'dossier' | 'citation' | 'network';
type CitationStyle = 'chicago' | 'apa' | 'harvard' | 'bibtex';

/**
 * Tightly Calibrated Ports Overview ViewBox:
 * Cropping out empty Saharan/Mediterranean regions in the north (Y: 0..1480)
 * and Kalahari/South African regions in the south (Y: 4480..5867).
 * Places all 47 embarkation ports (X: 504..4579, Y: 1681..4253) front-and-center at maximum scale!
 */
const TIGHT_PORTS_OVERVIEW_VIEWBOX = { x: 300, y: 1480, w: 4550, h: 3000 };
const ZOOMED_PORT_SPAN = { w: 1350, h: 1200 };

const COASTAL_REGIONS_META = [
  { name: 'Senegambia', color: '#0284c7', count: '6 ports' },
  { name: 'Sierra Leone', color: '#059669', count: '4 ports' },
  { name: 'Windward Coast', color: '#10b981', count: '4 ports' },
  { name: 'Gold Coast', color: '#d97706', count: '9 forts' },
  { name: 'Bight of Benin', color: '#ea580c', count: '7 ports' },
  { name: 'Bight of Biafra', color: '#dc2626', count: '6 ports' },
  { name: 'West Central Africa', color: '#7c3aed', count: '6 ports' },
  { name: 'Southeast Africa', color: '#4338ca', count: '5 ports' }
];

export const AfricanPortsMap: React.FC<AfricanPortsMapProps> = ({
  onSelectPort,
  onClose,
  mode = 'embedded'
}) => {
  // Hide global app footer while AfricanPortsMap is mounted
  useEffect(() => {
    document.body.classList.add('hide-app-footer');
    return () => {
      document.body.classList.remove('hide-app-footer');
    };
  }, []);

  // Filtering & Active Port
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedPower, setSelectedPower] = useState<string>('All');
  const [selectedCentury, setSelectedCentury] = useState<string>('All');
  const [yearRange, setYearRange] = useState<[number, number]>([1514, 1866]);
  const [showOceanVectors, setShowOceanVectors] = useState<boolean>(true);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePort, setActivePort] = useState<AfricanEmbarkationPort | null>(AFRICAN_EMBARKATION_PORTS[0]);
  const [hoveredPortId, setHoveredPortId] = useState<string | null>(null);

  // Region & Country Hover Highlighting
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(true);

  // Viewport & Pan/Zoom Engine (in SVG coordinate space)
  const [currentViewBox, setCurrentViewBox] = useState(TIGHT_PORTS_OVERVIEW_VIEWBOX);
  const [isZoomedIn, setIsZoomedIn] = useState<boolean>(false);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Layout Drawers (identical to ArchivalImageViewer.tsx)
  const [isMetadataOpen, setIsMetadataOpen] = useState<boolean>(true);
  const [isFilmstripOpen, setIsFilmstripOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('dossier');

  // Citation generator state
  const [activeCitationStyle, setActiveCitationStyle] = useState<CitationStyle>('chicago');
  const [hasCopiedCitation, setHasCopiedCitation] = useState<boolean>(false);

  // Mouse drag panning state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; startViewBox: typeof TIGHT_PORTS_OVERVIEW_VIEWBOX }>({
    clientX: 0,
    clientY: 0,
    startViewBox: TIGHT_PORTS_OVERVIEW_VIEWBOX
  });

  // Touch gesture state refs
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartBoxRef = useRef<typeof TIGHT_PORTS_OVERVIEW_VIEWBOX>(TIGHT_PORTS_OVERVIEW_VIEWBOX);
  const touchStartPointRef = useRef<{ x: number; y: number } | null>(null);

  // DOM Refs
  const rootRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const targetViewBoxRef = useRef(TIGHT_PORTS_OVERVIEW_VIEWBOX);

  // Keep live reference to currentViewBox for native non-passive listeners
  const currentViewBoxRef = useRef(currentViewBox);
  currentViewBoxRef.current = currentViewBox;

  // Auto-play timeline animation effect
  useEffect(() => {
    if (!isTimelinePlaying) return;
    const interval = setInterval(() => {
      setYearRange(prev => {
        const step = 25;
        const nextEnd = prev[1] + step;
        if (nextEnd > 1866) {
          setIsTimelinePlaying(false);
          return [1514, 1866];
        }
        return [Math.max(1514, nextEnd - 75), nextEnd];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimelinePlaying]);

  // Filtered port list
  const filteredPorts = useMemo(() => {
    return AFRICAN_EMBARKATION_PORTS.filter(port => {
      const matchRegion = selectedRegion === 'All' || port.region === selectedRegion;
      const matchPower = selectedPower === 'All' || port.europeanPowers.includes(selectedPower as any);
      const matchCentury = selectedCentury === 'All' || port.activeCentury.includes(selectedCentury as any);

      // Historical year range filter (1514–1866)
      const portCenturyStarts: number[] = [];
      const portCenturyEnds: number[] = [];
      if (port.activeCentury.includes('16th')) { portCenturyStarts.push(1514); portCenturyEnds.push(1600); }
      if (port.activeCentury.includes('17th')) { portCenturyStarts.push(1601); portCenturyEnds.push(1700); }
      if (port.activeCentury.includes('18th')) { portCenturyStarts.push(1701); portCenturyEnds.push(1800); }
      if (port.activeCentury.includes('19th')) { portCenturyStarts.push(1801); portCenturyEnds.push(1866); }
      const minYear = portCenturyStarts.length ? Math.min(...portCenturyStarts) : 1514;
      const maxYear = portCenturyEnds.length ? Math.max(...portCenturyEnds) : 1866;
      const matchYear = maxYear >= yearRange[0] && minYear <= yearRange[1];

      const matchSearch = !searchQuery.trim() || 
        port.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        port.countryModern.toLowerCase().includes(searchQuery.toLowerCase()) ||
        port.historicalAliases.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        port.primaryEthnicGroups.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRegion && matchPower && matchCentury && matchYear && matchSearch;
    });
  }, [selectedRegion, selectedPower, selectedCentury, yearRange, searchQuery]);

  // Active port index in filtered list
  const currentIndex = useMemo(() => {
    return filteredPorts.findIndex(p => p.id === activePort?.id);
  }, [filteredPorts, activePort]);

  // Regional thematic colors
  const getRegionColor = (region: string) => {
    switch (region) {
      case 'Senegambia': return '#0284c7'; // sky-600
      case 'Sierra Leone': return '#059669'; // emerald-600
      case 'Windward Coast': return '#10b981'; // emerald-500
      case 'Gold Coast': return '#d97706'; // amber-600
      case 'Bight of Benin': return '#ea580c'; // orange-600
      case 'Bight of Biafra': return '#dc2626'; // red-600
      case 'West Central Africa': return '#7c3aed'; // violet-600
      case 'Southeast Africa': return '#4338ca'; // indigo-700
      default: return '#78716c';
    }
  };

  // Determine active highlighted corridor (from hovered port, hovered region badge, or hovered country)
  const activeHoverRegion = useMemo(() => {
    if (hoveredRegion) return hoveredRegion;
    if (hoveredPortId) {
      const port = AFRICAN_EMBARKATION_PORTS.find(p => p.id === hoveredPortId);
      return port ? port.region : null;
    }
    return null;
  }, [hoveredRegion, hoveredPortId]);

  // Dynamic Country Palette mapper: applies vibrant hover and active glowing color effects to regions
  const getCustomCountryColor = useCallback((iso3: string): string => {
    const zone = COUNTRY_TO_EMBARKATION_ZONE[iso3];
    const isSelectedPortCountry = activePort?.countryModern && (
      (iso3 === 'SEN' && activePort.countryModern.includes('Senegal')) ||
      (iso3 === 'GMB' && activePort.countryModern.includes('Gambia')) ||
      (iso3 === 'GNB' && activePort.countryModern.includes('Guinea-Bissau')) ||
      (iso3 === 'GIN' && activePort.countryModern === 'Guinea') ||
      (iso3 === 'SLE' && activePort.countryModern.includes('Sierra Leone')) ||
      (iso3 === 'LBR' && activePort.countryModern.includes('Liberia')) ||
      (iso3 === 'CIV' && (activePort.countryModern.includes('Ivory Coast') || activePort.countryModern.includes('Côte d\'Ivoire'))) ||
      (iso3 === 'GHA' && activePort.countryModern.includes('Ghana')) ||
      (iso3 === 'TGO' && activePort.countryModern.includes('Togo')) ||
      (iso3 === 'BEN' && activePort.countryModern.includes('Benin')) ||
      (iso3 === 'NGA' && activePort.countryModern.includes('Nigeria')) ||
      (iso3 === 'CMR' && activePort.countryModern.includes('Cameroon')) ||
      (iso3 === 'GNQ' && activePort.countryModern.includes('Equatorial Guinea')) ||
      (iso3 === 'GAB' && activePort.countryModern.includes('Gabon')) ||
      (iso3 === 'COG' && activePort.countryModern.includes('Congo')) ||
      (iso3 === 'AGO' && activePort.countryModern.includes('Angola')) ||
      (iso3 === 'MOZ' && activePort.countryModern.includes('Mozambique')) ||
      (iso3 === 'TZA' && activePort.countryModern.includes('Tanzania')) ||
      (iso3 === 'STP' && activePort.countryModern.includes('São Tomé'))
    );

    if (!zone) {
      return isHighContrast ? '#e0d7c7' : '#ece4d5';
    }

    const zoneColor = getRegionColor(zone);
    const isHovered = activeHoverRegion === zone || hoveredCountry === iso3;
    const isZoneActive = selectedRegion !== 'All' ? selectedRegion === zone : activePort?.region === zone;

    if (isHovered) {
      return `${zoneColor}60`; // Luminous vibrant highlight on region hover!
    }
    if (isSelectedPortCountry) {
      return `${zoneColor}42`; // Rich focus on active port's country!
    }
    if (isZoneActive) {
      return `${zoneColor}2c`; // Active region tint
    }
    return `${zoneColor}14`; // Subtle coastal tint showing embarkation presence
  }, [activeHoverRegion, hoveredCountry, selectedRegion, activePort, isHighContrast]);

  // Smooth animation interpolation for viewBox
  const animateViewBoxTo = useCallback((target: { x: number; y: number; w: number; h: number }, durationMs = 450) => {
    targetViewBoxRef.current = target;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const start = { ...currentViewBoxRef.current };
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const ease = 1 - Math.pow(1 - t, 3); // Ease out cubic

      const next = {
        x: Math.round(start.x + (target.x - start.x) * ease),
        y: Math.round(start.y + (target.y - start.y) * ease),
        w: Math.round(start.w + (target.w - start.w) * ease),
        h: Math.round(start.h + (target.h - start.h) * ease)
      };

      setCurrentViewBox(next);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Zoom & Center on Port on Click
  const handlePortClick = useCallback((port: AfricanEmbarkationPort) => {
    setActivePort(port);
    onSelectPort?.(port);

    const { x, y } = projectPortToSvg(port.coordinates.lat, port.coordinates.lng, port.id);
    const targetW = ZOOMED_PORT_SPAN.w;
    const targetH = ZOOMED_PORT_SPAN.h;
    const target = {
      x: Math.round(x - targetW / 2),
      y: Math.round(y - targetH / 2),
      w: targetW,
      h: targetH
    };

    setIsZoomedIn(true);
    animateViewBoxTo(target);
  }, [onSelectPort, animateViewBoxTo]);

  // Stepper to Previous / Next Port
  const handlePrevPort = useCallback(() => {
    if (filteredPorts.length === 0) return;
    const prevIdx = (currentIndex - 1 + filteredPorts.length) % filteredPorts.length;
    handlePortClick(filteredPorts[prevIdx]);
  }, [currentIndex, filteredPorts, handlePortClick]);

  const handleNextPort = useCallback(() => {
    if (filteredPorts.length === 0) return;
    const nextIdx = (currentIndex + 1) % filteredPorts.length;
    handlePortClick(filteredPorts[nextIdx]);
  }, [currentIndex, filteredPorts, handlePortClick]);

  // Reset to tight initial overview
  const handleResetZoom = useCallback(() => {
    setIsZoomedIn(false);
    animateViewBoxTo(TIGHT_PORTS_OVERVIEW_VIEWBOX);
  }, [animateViewBoxTo]);

  // Manual step zoom in / out centered on current viewBox
  const handleStepZoom = useCallback((deltaFactor: number) => {
    const cur = currentViewBoxRef.current;
    const newW = Math.max(600, Math.min(5200, Math.round(cur.w * deltaFactor)));
    const newH = Math.max(500, Math.min(4200, Math.round(cur.h * deltaFactor)));
    const centerX = cur.x + cur.w / 2;
    const centerY = cur.y + cur.h / 2;

    const target = {
      x: Math.round(centerX - newW / 2),
      y: Math.round(centerY - newH / 2),
      w: newW,
      h: newH
    };

    setIsZoomedIn(newW < TIGHT_PORTS_OVERVIEW_VIEWBOX.w * 0.85);
    animateViewBoxTo(target, 300);
  }, [animateViewBoxTo]);

  // Calculate nearby ports when activePort is selected
  const nearbyPorts = useMemo(() => {
    if (!activePort) return [];
    const activeCoords = projectPortToSvg(activePort.coordinates.lat, activePort.coordinates.lng, activePort.id);

    return filteredPorts
      .filter(p => p.id !== activePort.id)
      .map(p => {
        const coords = projectPortToSvg(p.coordinates.lat, p.coordinates.lng, p.id);
        const dist = Math.hypot(coords.x - activeCoords.x, coords.y - activeCoords.y);
        return { port: p, coords, dist };
      })
      .filter(item => item.dist <= 950)
      .sort((a, b) => a.dist - b.dist);
  }, [activePort, filteredPorts]);

  // Compute collision-free label positions for ports visible in zoomed view
  const visiblePortPositions = useMemo(() => {
    if (!isZoomedIn || !activePort) return new Map<string, { offsetX: number; offsetY: number }>();

    const activeCoords = projectPortToSvg(activePort.coordinates.lat, activePort.coordinates.lng, activePort.id);
    const posMap = new Map<string, { offsetX: number; offsetY: number }>();

    // For East Africa (x > 3500), seaward is EAST (+X).
    // For West Africa & Angola (x <= 3500), seaward is WEST (-X).
    const isEastCoast = activeCoords.x > 3500;
    posMap.set(activePort.id, {
      offsetX: isEastCoast ? 140 : -140,
      offsetY: -55
    });

    // Sort nearby ports by Y coordinate to assign collision-free alternating offsets
    const sortedNearby = [...nearbyPorts].sort((a, b) => a.coords.y - b.coords.y);
    sortedNearby.forEach((item, idx) => {
      const isItemEastCoast = item.coords.x > 3500;
      const yTiers = [-80, 55, -45, 85, -115, 115, -140, 140];
      const yTier = yTiers[idx % yTiers.length];
      const xDir = isItemEastCoast ? 1 : -1;
      const xDistance = 125 + (idx % 3) * 35;

      posMap.set(item.port.id, {
        offsetX: xDir * xDistance,
        offsetY: yTier
      });
    });

    return posMap;
  }, [isZoomedIn, activePort, nearbyPorts]);

  // Auto-scroll active card in filmstrip tray into view
  useEffect(() => {
    if (!activePort || !filmstripRef.current) return;
    const cardEl = filmstripRef.current.querySelector(`[data-port-id="${activePort.id}"]`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activePort]);

  // Fullscreen toggle handler
  const toggleFullscreen = useCallback(() => {
    const el = rootRef.current || document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => setIsFullscreen(prev => !prev));
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Keyboard Navigation: Esc, +, -, 0, f, Alt+Left, Alt+Right
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (e.key === 'Escape' && onClose) {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        handleStepZoom(0.8);
      } else if (e.key === '-' || e.key === '_') {
        handleStepZoom(1.25);
      } else if (e.key === '0') {
        handleResetZoom();
      } else if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        toggleFullscreen();
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        handlePrevPort();
      } else if (e.key === 'ArrowRight' && e.altKey) {
        handleNextPort();
      } else if (e.key === 'ArrowLeft' && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const cur = currentViewBoxRef.current;
        const delta = Math.round(cur.w * 0.12);
        setCurrentViewBox({ ...cur, x: Math.max(-500, cur.x - delta) });
      } else if (e.key === 'ArrowRight' && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const cur = currentViewBoxRef.current;
        const delta = Math.round(cur.w * 0.12);
        setCurrentViewBox({ ...cur, x: Math.min(5500, cur.x + delta) });
      } else if (e.key === 'ArrowUp' && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const cur = currentViewBoxRef.current;
        const delta = Math.round(cur.h * 0.12);
        setCurrentViewBox({ ...cur, y: Math.max(0, cur.y - delta) });
      } else if (e.key === 'ArrowDown' && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const cur = currentViewBoxRef.current;
        const delta = Math.round(cur.h * 0.12);
        setCurrentViewBox({ ...cur, y: Math.min(4800, cur.y + delta) });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleStepZoom, handleResetZoom, toggleFullscreen, handlePrevPort, handleNextPort]);

  // Native non-passive Wheel Zoom centered on mouse pointer (prevents page scrolling!)
  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = container.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;

      const cur = currentViewBoxRef.current;
      const svgPointX = cur.x + (pointerX / rect.width) * cur.w;
      const svgPointY = cur.y + (pointerY / rect.height) * cur.h;

      const zoomFactor = e.deltaY < 0 ? 0.85 : 1.18;
      const newW = Math.max(500, Math.min(5200, Math.round(cur.w * zoomFactor)));
      const newH = Math.max(400, Math.min(4200, Math.round(cur.h * zoomFactor)));

      const newX = Math.round(svgPointX - (pointerX / rect.width) * newW);
      const newY = Math.round(svgPointY - (pointerY / rect.height) * newH);

      setIsZoomedIn(newW < TIGHT_PORTS_OVERVIEW_VIEWBOX.w * 0.85);
      setCurrentViewBox({ x: newX, y: newY, w: newW, h: newH });
    };

    // Mobile touch gestures: pinch zoom and touch pan
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        touchStartDistRef.current = dist;
        touchStartBoxRef.current = { ...currentViewBoxRef.current };
      } else if (e.touches.length === 1) {
        touchStartPointRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        touchStartBoxRef.current = { ...currentViewBoxRef.current };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const containerRect = container.getBoundingClientRect();
      if (e.touches.length === 2 && touchStartDistRef.current !== null) {
        e.preventDefault();
        e.stopPropagation();
        const curDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = touchStartDistRef.current / curDist;
        const startBox = touchStartBoxRef.current;
        const newW = Math.max(500, Math.min(5200, Math.round(startBox.w * scale)));
        const newH = Math.max(400, Math.min(4200, Math.round(startBox.h * scale)));
        const centerX = startBox.x + startBox.w / 2;
        const centerY = startBox.y + startBox.h / 2;

        setCurrentViewBox({
          x: Math.round(centerX - newW / 2),
          y: Math.round(centerY - newH / 2),
          w: newW,
          h: newH
        });
      } else if (e.touches.length === 1 && touchStartPointRef.current) {
        e.preventDefault();
        e.stopPropagation();
        const dx = e.touches[0].clientX - touchStartPointRef.current.x;
        const dy = e.touches[0].clientY - touchStartPointRef.current.y;
        const startBox = touchStartBoxRef.current;
        const svgDx = -dx * (startBox.w / containerRect.width);
        const svgDy = -dy * (startBox.h / containerRect.height);

        setCurrentViewBox({
          ...startBox,
          x: Math.round(startBox.x + svgDx),
          y: Math.round(startBox.y + svgDy)
        });
      }
    };

    const handleTouchEnd = () => {
      touchStartDistRef.current = null;
      touchStartPointRef.current = null;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  // Mouse drag panning handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startViewBox: { ...currentViewBoxRef.current }
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !svgContainerRef.current) return;
    const containerRect = svgContainerRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;

    const { startViewBox } = dragStartRef.current;
    const svgDx = -dx * (startViewBox.w / containerRect.width);
    const svgDy = -dy * (startViewBox.h / containerRect.height);

    setCurrentViewBox({
      ...startViewBox,
      x: Math.round(startViewBox.x + svgDx),
      y: Math.round(startViewBox.y + svgDy)
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Academic Citation Generator for active port
  const generateCitation = useCallback((style: CitationStyle): string => {
    if (!activePort) return '';
    const name = activePort.name;
    const country = activePort.countryModern;
    const region = activePort.region;
    const embarkations = activePort.estimatedEmbarkations.toLocaleString();
    const accessDate = 'October 2026';
    const url = 'https://www.slavevoyages.org/voyage/database';

    switch (style) {
      case 'chicago':
        return `SlaveVoyages Consortium. "${name} (${country})." African Embarkation Enclaves Corpus, ${region}. Estimated Transatlantic Embarkations: ${embarkations}. Accessed ${accessDate}. ${url}.`;
      case 'apa':
        return `SlaveVoyages Consortium (2026). ${name} [Historical Embarkation Enclave, ${region}, modern ${country}]. Trans-Atlantic Slave Trade Database. Retrieved ${accessDate}, from ${url}`;
      case 'harvard':
        return `SlaveVoyages Consortium (2026) '${name} (${country})', African Coastal Embarkation Registry, ${region}. Available at: ${url} (Accessed: ${accessDate}).`;
      case 'bibtex':
        return `@misc{SlaveVoyages_${activePort.id.replace(/-/g, '_')},
  author = {{SlaveVoyages Consortium}},
  title = {${name} (${country})},
  year = {2026},
  howpublished = {African Embarkation Enclaves Corpus, ${region}},
  note = {Typology: ${activePort.fortOrType}, Embarkations: ${embarkations}},
  url = {${url}}
}`;
      default:
        return '';
    }
  }, [activePort]);

  const copyCitation = async () => {
    const text = generateCitation(activeCitationStyle);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setHasCopiedCitation(true);
      setTimeout(() => setHasCopiedCitation(false), 2000);
    } catch {
      setHasCopiedCitation(true);
      setTimeout(() => setHasCopiedCitation(false), 2000);
    }
  };

  // Zoom percentage relative to tight overview
  const zoomPercent = Math.round((TIGHT_PORTS_OVERVIEW_VIEWBOX.w / currentViewBox.w) * 100);

  // Radar Mini-Map Viewport Box calculation (mapping 5796x5867 to 160x162)
  const miniMapRect = useMemo(() => {
    const scaleX = 160 / 5796;
    const scaleY = 162 / 5867;
    return {
      x: Math.max(0, Math.min(160, currentViewBox.x * scaleX)),
      y: Math.max(0, Math.min(162, currentViewBox.y * scaleY)),
      w: Math.max(8, Math.min(160, currentViewBox.w * scaleX)),
      h: Math.max(8, Math.min(162, currentViewBox.h * scaleY))
    };
  }, [currentViewBox]);

  return (
    <section
      ref={rootRef}
      aria-label="African Embarkation Ports & Coastal Enclaves Atlas"
      className={`archival-viewer-root bg-[#FAF8F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 border border-stone-200/90 dark:border-stone-800 rounded-3xl w-full shadow-2xl relative text-left overflow-hidden flex flex-col transition-all duration-300 select-none ${
        mode === 'fullscreen' || isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen' : 'h-[calc(100vh-140px)] min-h-[760px]'
      }`}
    >
      {/* 1. TOP HEADER BAR — In the vein of ArchivalImageViewer.tsx */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-stone-200/90 dark:border-stone-800 bg-[#F4EFE6]/95 dark:bg-stone-900/95 backdrop-blur-md shrink-0 z-20 gap-3">
        {/* Left: Port Identifier, Title & Stepper Index */}
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {activePort && (
            <div className="px-2.5 py-1 rounded-full bg-amber-900/10 dark:bg-amber-400/10 border border-amber-900/15 dark:border-amber-400/20 text-amber-900 dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <Castle className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              <span>{activePort.id.replace('port-', '').toUpperCase()}</span>
            </div>
          )}
          <h2 className="text-xs sm:text-sm md:text-base font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
            {activePort ? activePort.name : 'African Embarkation Ports & Coastal Enclaves'}
          </h2>
          {activePort && (
            <span className="hidden md:inline-flex text-[11px] font-mono text-stone-500 dark:text-stone-400 shrink-0">
              ({currentIndex + 1} of {filteredPorts.length})
            </span>
          )}
        </div>

        {/* Right Toolbar Controls: Stepper, Zoom Pill, Filmstrip, Details Toggle */}
        <div role="toolbar" aria-label="Cartographic viewer controls" className="flex items-center gap-2 shrink-0">
          {/* Previous / Next Port Quick Stepper */}
          {filteredPorts.length > 1 && (
            <div className="flex items-center gap-0.5 bg-stone-200/70 dark:bg-stone-800 border border-stone-300/80 dark:border-stone-700/80 rounded-xl p-0.5 mr-1">
              <button
                onClick={handlePrevPort}
                className="p-1.5 rounded-lg hover:bg-stone-300/80 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                title="Previous Port (Alt + ←)"
                aria-label="Previous Port"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNextPort}
                className="p-1.5 rounded-lg hover:bg-stone-300/80 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                title="Next Port (Alt + →)"
                aria-label="Next Port"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Integrated Zoom, Reset, Contrast, Fullscreen Pill */}
          <div className="hidden sm:flex items-center bg-stone-200/70 dark:bg-stone-800 border border-stone-300/80 dark:border-stone-700/80 rounded-xl p-0.5 gap-0.5">
            <button
              onClick={() => handleStepZoom(0.8)}
              className="p-1.5 rounded-lg hover:bg-stone-300/80 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
              title="Zoom In (+)"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-stone-700 dark:text-stone-300 select-none font-semibold tabular-nums min-w-[42px] text-center">
              {zoomPercent}%
            </span>
            <button
              onClick={() => handleStepZoom(1.25)}
              className="p-1.5 rounded-lg hover:bg-stone-300/80 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
              title="Zoom Out (-)"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-3.5 bg-stone-300 dark:bg-stone-700 mx-0.5" />

            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg hover:bg-stone-300/80 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
              title="Reset View to All Ports (0)"
              aria-label="Reset View"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isHighContrast
                  ? 'bg-amber-900 text-amber-50 font-bold dark:bg-amber-500 dark:text-stone-950'
                  : 'hover:bg-stone-300/80 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
              title="High Contrast Cartography Filter"
              aria-label="High Contrast Filter"
            >
              <Contrast className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleFullscreen}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isFullscreen
                  ? 'bg-amber-900 text-amber-50 font-bold dark:bg-amber-500 dark:text-stone-950'
                  : 'hover:bg-stone-300/80 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
              title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Toggle Bottom Filmstrip Button in Header */}
          <button
            onClick={() => setIsFilmstripOpen(!isFilmstripOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              isFilmstripOpen
                ? 'bg-amber-900 text-amber-50 dark:bg-amber-500/20 dark:text-amber-300 shadow-2xs'
                : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/80 border border-stone-300/70 dark:border-stone-700'
            }`}
            title={isFilmstripOpen ? "Collapse Ports Tray" : "Open Ports Tray"}
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ports ({filteredPorts.length})</span>
          </button>

          {/* Collapsible Details Drawer Toggle in Header */}
          <AnimatePresence mode="wait">
            {isMetadataOpen ? (
              <motion.button
                key="hide-details-btn"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => setIsMetadataOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer bg-stone-200/70 hover:bg-stone-300 text-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-200 border border-stone-300/70 dark:border-stone-700 shadow-2xs"
                title="Hide Details Drawer"
              >
                <PanelRightClose className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                <span className="hidden sm:inline">Hide Dossier</span>
              </motion.button>
            ) : (
              <motion.button
                key="show-details-btn"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => setIsMetadataOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer bg-amber-900/10 hover:bg-amber-900/20 text-amber-900 border border-amber-900/25 dark:bg-amber-500/20 dark:text-amber-300 shadow-2xs"
                title="Show Details Drawer"
              >
                <PanelRightOpen className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                <span className="hidden sm:inline">Show Dossier</span>
              </motion.button>
            )}
          </AnimatePresence>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-stone-200/70 hover:bg-red-100 hover:text-red-900 dark:bg-stone-800 dark:hover:bg-red-950/60 dark:hover:text-red-300 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer border border-stone-300/70 dark:border-stone-700"
              title="Close Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* 2. MAIN SPLIT BODY: Canvas Viewport (7/12 or 2/3) & Metadata Drawer (5/12 or 1/3) */}
      <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col lg:flex-row w-full">
        {/* CENTER / LEFT CANVAS: Museum Matte Viewport */}
        <div
          className={`relative flex flex-col justify-between select-none overflow-hidden group bg-[#EFEAE1] dark:bg-[#121110] transition-all duration-300 h-full ${
            isMetadataOpen ? 'w-full lg:w-7/12 xl:w-2/3 border-b lg:border-b-0 lg:border-r border-stone-200/90 dark:border-stone-800' : 'w-full'
          }`}
        >
          {/* Archival Matting Background Pattern */}
          <div
            className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#78716c 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          {/* Integrated Floating Legend & 47 Ports / +12M Captives Deck */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-none max-w-[calc(100%-2rem)] sm:max-w-md">
            {/* Primary Headline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300/80 dark:border-stone-700 shadow-md pointer-events-auto text-xs">
              <div className="flex items-center gap-1.5">
                <Castle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span className="font-serif font-bold text-stone-900 dark:text-stone-100">47 Historical Ports & Forts</span>
              </div>
              <span className="text-stone-300 dark:text-stone-700">·</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[11px] border border-emerald-600/25">
                +12M Captives
              </span>
              <button
                onClick={() => setIsLegendOpen(!isLegendOpen)}
                className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors ml-0.5 cursor-pointer"
                title={isLegendOpen ? "Collapse Legend" : "Expand Legend"}
              >
                {isLegendOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Expandable 8-Corridor Regional Palette Legend with Hover Highlights */}
            <AnimatePresence>
              {isLegendOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="p-3 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300/80 dark:border-stone-700 shadow-lg pointer-events-auto overflow-hidden text-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
                    <span>8 Coastal Embarkation Corridors</span>
                    <span className="text-amber-700 dark:text-amber-400">Hover to highlight</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {COASTAL_REGIONS_META.map(reg => (
                      <button
                        key={reg.name}
                        onMouseEnter={() => setHoveredRegion(reg.name)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        onClick={() => {
                          setSelectedRegion(selectedRegion === reg.name ? 'All' : reg.name);
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left border transition-all cursor-pointer ${
                          hoveredRegion === reg.name || selectedRegion === reg.name
                            ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/40 shadow-xs'
                            : 'bg-stone-50/70 dark:bg-stone-950/70 border-stone-200/80 dark:border-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: reg.color }} />
                          <span className="truncate text-[11px] font-medium text-stone-800 dark:text-stone-200">{reg.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 ml-1 shrink-0">{reg.count}</span>
                      </button>
                    ))}
                  </div>

                  {/* Filter Selectors Deck inside Legend */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <select
                      value={selectedPower}
                      onChange={(e) => setSelectedPower(e.target.value)}
                      className="text-[11px] bg-stone-100 dark:bg-stone-800 border-none rounded-lg px-2 py-1 text-stone-800 dark:text-stone-200 font-medium focus:ring-1 focus:ring-amber-600 outline-none cursor-pointer"
                    >
                      <option value="All">All Flags</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Great Britain">Great Britain</option>
                      <option value="France">France</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Denmark">Denmark</option>
                      <option value="Brandenburg/Prussia">Brandenburg/Prussia</option>
                    </select>

                    <select
                      value={selectedCentury}
                      onChange={(e) => setSelectedCentury(e.target.value)}
                      className="text-[11px] bg-stone-100 dark:bg-stone-800 border-none rounded-lg px-2 py-1 text-stone-800 dark:text-stone-200 font-medium focus:ring-1 focus:ring-amber-600 outline-none cursor-pointer"
                    >
                      <option value="All">All Centuries</option>
                      <option value="16th">16th C.</option>
                      <option value="17th">17th C.</option>
                      <option value="18th">18th C.</option>
                      <option value="19th">19th C.</option>
                    </select>

                    <div className="relative flex items-center ml-auto">
                      <Search className="w-3 h-3 text-stone-400 absolute left-2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search port..."
                        className="pl-6 pr-2 py-1 text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-lg outline-none w-28 focus:w-36 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Floating Trigger to Re-Open Dossier Drawer when collapsed */}
          {!isMetadataOpen && activePort && (
            <button
              onClick={() => setIsMetadataOpen(true)}
              className="absolute top-3 right-3 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-amber-500/30 shadow-md text-xs font-mono font-bold text-amber-900 dark:text-amber-300 hover:scale-102 transition-all cursor-pointer"
              title="Open Port Dossier Drawer"
            >
              <Castle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Dossier: {activePort.name.split(' (')[0]}</span>
              <PanelRightOpen className="w-4 h-4 ml-0.5 text-amber-700 dark:text-amber-400" />
            </button>
          )}

          {/* Interactive Zoomable & Grabbable SVG Canvas */}
          <div
            ref={svgContainerRef}
            className={`w-full flex-1 min-h-0 flex items-center justify-center relative overflow-hidden touch-none overscroll-contain select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            } ${isHighContrast ? 'contrast-125 saturate-150' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              viewBox={`${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`}
              className="w-full h-full block object-contain select-none transition-[filter] duration-200 drop-shadow-sm pointer-events-auto"
              style={{ shapeRendering: 'geometricPrecision' }}
            >
              <defs>
                <pattern id="parchment-grid-5k" width="200" height="200" patternUnits="userSpaceOnUse">
                  <path d="M 200 0 L 0 0 0 200" fill="none" stroke="rgba(168, 162, 158, 0.14)" strokeWidth="0.8" />
                </pattern>
                <radialGradient id="ocean-radial-5k" cx="50%" cy="50%" r="65%">
                  <stop offset="0%" stopColor="#f7f3ea" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#e8dfd2" stopOpacity="0.6" />
                </radialGradient>
              </defs>

              {/* Ocean & Graticule Canvas */}
              <rect x="-2000" y="-2000" width="10000" height="10000" fill="url(#ocean-radial-5k)" />
              <rect x="-2000" y="-2000" width="10000" height="10000" fill="url(#parchment-grid-5k)" />

              {/* Scaled Hairline Graticule Lines (Equator, Prime Meridian, Tropics) */}
              <line x1="-2000" y1="3081" x2="8000" y2="3081" stroke="#059669" strokeWidth="1.8" strokeDasharray="20 14" opacity="0.6" />
              <g transform="translate(4800, 3055)">
                <rect x="0" y="-20" width="280" height="40" rx="6" fill="#ecfdf5" stroke="#059669" strokeWidth="1.2" opacity="0.95" />
                <text x="140" y="6" textAnchor="middle" fill="#047857" fontSize="18" fontFamily="monospace" fontWeight="900">
                  ☀️ EQUATOR 0°
                </text>
              </g>

              <line x1="1804" y1="-2000" x2="1804" y2="8000" stroke="#0284c7" strokeWidth="1.6" strokeDasharray="18 12" opacity="0.5" />
              <g transform="translate(1804, 520)">
                <rect x="-130" y="-20" width="260" height="40" rx="6" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2" opacity="0.95" />
                <text x="0" y="6" textAnchor="middle" fill="#0369a1" fontSize="18" fontFamily="monospace" fontWeight="900">
                  0° PRIME MERIDIAN
                </text>
              </g>

              {/* Authentic Vector Continental Africa Base Map with Region Hover Highlights */}
              <AfricaVectorContinent
                mode="countries"
                theme="parchment"
                getCountryColor={getCustomCountryColor}
                onCountryHover={(iso3) => {
                  setHoveredCountry(iso3);
                  if (iso3 && COUNTRY_TO_EMBARKATION_ZONE[iso3]) {
                    setHoveredRegion(COUNTRY_TO_EMBARKATION_ZONE[iso3]);
                  } else {
                    setHoveredRegion(null);
                  }
                }}
                onRegionHover={(reg) => setHoveredRegion(reg)}
              />

              {/* Nautical Compass Rose */}
              <g transform="translate(950, 4250) scale(4.0)" className="pointer-events-none select-none">
                <circle cx="0" cy="0" r="48" fill="#ffffff" fillOpacity="0.94" stroke="#0284c7" strokeWidth="0.8" strokeOpacity="0.6" />
                <circle cx="0" cy="0" r="44" fill="none" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="1 2" opacity="0.8" />
                <circle cx="0" cy="0" r="38" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
                <polygon points="0,-42 5,-8 0,0" fill="#0284c7" />
                <polygon points="0,-42 -5,-8 0,0" fill="#0369a1" />
                <polygon points="0,42 5,8 0,0" fill="#0284c7" />
                <polygon points="0,42 -5,8 0,0" fill="#0369a1" />
                <polygon points="42,0 8,5 0,0" fill="#0284c7" />
                <polygon points="42,0 8,-5 0,0" fill="#0369a1" />
                <polygon points="-42,0 -8,5 0,0" fill="#0284c7" />
                <polygon points="-42,0 -8,-5 0,0" fill="#0369a1" />
                <circle cx="0" cy="0" r="3.5" fill="#f59e0b" />
                <text x="0" y="-48" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="900" fontFamily="sans-serif">N</text>
              </g>

              {/* Historical Ocean Currents & Seasonal Trade Wind Vectors Layer */}
              {showOceanVectors && (
                <g id="ocean-currents-and-winds" className="pointer-events-none select-none">
                  {/* Canary Current (SW along West Sahara & Senegambia) */}
                  <path
                    d="M 680,1100 Q 520,1650 480,2250"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3.5"
                    strokeDasharray="18 12"
                    strokeOpacity="0.45"
                  />
                  <polygon points="480,2270 472,2240 492,2244" fill="#0284c7" opacity="0.6" />
                  <text x="560" y="1700" fill="#0369a1" fontSize="22" fontFamily="monospace" fontWeight="bold" opacity="0.6" transform="rotate(-70 560,1700)">
                    Canary Current ➔
                  </text>

                  {/* Guinea Current (Eastward along Gulf of Guinea) */}
                  <path
                    d="M 850,2950 Q 1800,2980 2550,2980"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="3.5"
                    strokeDasharray="18 12"
                    strokeOpacity="0.5"
                  />
                  <polygon points="2570,2980 2540,2970 2540,2990" fill="#0d9488" opacity="0.7" />
                  <text x="1700" y="3030" fill="#0f766e" fontSize="22" fontFamily="monospace" fontWeight="bold" opacity="0.65">
                    Guinea Current ➔ (Eastward Gulf Flow)
                  </text>

                  {/* Benguela Current (Northward along Angola & Namibia) */}
                  <path
                    d="M 2350,5100 Q 2150,4400 2050,3450"
                    fill="none"
                    stroke="#4338ca"
                    strokeWidth="3.5"
                    strokeDasharray="18 12"
                    strokeOpacity="0.45"
                  />
                  <polygon points="2050,3430 2060,3460 2040,3458" fill="#4338ca" opacity="0.6" />
                  <text x="2120" y="4300" fill="#3730a3" fontSize="22" fontFamily="monospace" fontWeight="bold" opacity="0.6" transform="rotate(-82 2120,4300)">
                    Benguela Current ➔ (Northward Drift)
                  </text>

                  {/* Agulhas Current (Southward along Mozambique & South Africa) */}
                  <path
                    d="M 4600,3600 Q 4250,4500 3750,5350"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="3.5"
                    strokeDasharray="18 12"
                    strokeOpacity="0.45"
                  />
                  <polygon points="3740,5370 3762,5345 3748,5335" fill="#dc2626" opacity="0.6" />
                  <text x="4200" y="4500" fill="#b91c1c" fontSize="22" fontFamily="monospace" fontWeight="bold" opacity="0.6" transform="rotate(65 4200,4500)">
                    Agulhas Current ➔
                  </text>

                  {/* Transatlantic Trade Wind Corridor (NE Trades) */}
                  <g opacity="0.4" stroke="#d97706" strokeWidth="2.5" strokeDasharray="12 8">
                    <line x1="1200" y1="2100" x2="300" y2="2450" />
                    <line x1="1400" y1="2300" x2="400" y2="2650" />
                    <line x1="1600" y1="2500" x2="500" y2="2850" />
                  </g>
                  <text x="750" y="2400" fill="#b45309" fontSize="20" fontFamily="monospace" fontWeight="bold" opacity="0.55" transform="rotate(18 750,2400)">
                    ⇦ Northeast Trade Winds (Middle Passage Vector)
                  </text>
                </g>
              )}

              {/* Coastal Port Beacons and Seaward Collision-Free Labels Layer */}
              <g id="african-coastal-ports-layer">
                {filteredPorts.map((port) => {
                  const { x, y } = projectPortToSvg(port.coordinates.lat, port.coordinates.lng, port.id);
                  const isSelected = activePort?.id === port.id;
                  const isItemHovered = hoveredPortId === port.id;
                  const regionColor = getRegionColor(port.region);

                  // Base beacon radius scaled for 5k space: ~20px to ~42px
                  const baseRadius = Math.max(20, Math.min(42, Math.sqrt(port.estimatedEmbarkations / 1600)));
                  const beaconRadius = isSelected ? baseRadius * 1.3 : isItemHovered ? baseRadius * 1.15 : baseRadius;

                  const hasLabelSlot = visiblePortPositions.has(port.id);
                  const shouldShowLabel = isZoomedIn ? hasLabelSlot : (isSelected || isItemHovered);

                  const isPortEast = x > 3500;
                  const labelConfig = visiblePortPositions.get(port.id) || {
                    offsetX: isPortEast ? 140 : -140,
                    offsetY: isSelected ? -45 : 0
                  };

                  const portDisplayName = port.name.split(' (')[0];
                  const volumeText = `${(port.estimatedEmbarkations / 1_000_000).toFixed(2)}M`;
                  const labelText = `${portDisplayName} · ${volumeText}`;
                  const pillWidth = Math.max(140, labelText.length * 12 + 40);

                  return (
                    <g
                      key={port.id}
                      transform={`translate(${x}, ${y})`}
                      className="cursor-pointer group pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePortClick(port);
                      }}
                      onMouseEnter={() => {
                        setHoveredPortId(port.id);
                        setHoveredRegion(port.region);
                      }}
                      onMouseLeave={() => {
                        setHoveredPortId(null);
                        setHoveredRegion(null);
                      }}
                    >
                      {/* Generous Hitbox */}
                      <circle cx="0" cy="0" r={beaconRadius + 35} fill="transparent" />

                      {/* Kinetic Pulsing Radar Aura */}
                      <circle
                        cx="0"
                        cy="0"
                        r={beaconRadius}
                        fill="none"
                        stroke={isSelected ? '#d97706' : regionColor}
                        strokeWidth={isSelected ? '5' : '3'}
                        opacity="0.85"
                      >
                        <animate
                          attributeName="r"
                          values={`${beaconRadius};${beaconRadius * (isSelected ? 2.5 : 2.0)}`}
                          dur={isSelected ? '1.8s' : '3.2s'}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.85;0"
                          dur={isSelected ? '1.8s' : '3.2s'}
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Rotating Gold Accent Ring on Selected Port */}
                      {isSelected && (
                        <circle
                          cx="0"
                          cy="0"
                          r={beaconRadius + 12}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3"
                          strokeDasharray="8 5"
                          opacity="0.85"
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 0 0"
                            to="360 0 0"
                            dur="14s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Ground Soft Drop Shadow */}
                      <ellipse
                        cx="0"
                        cy={beaconRadius * 0.4}
                        rx={beaconRadius * 0.85}
                        ry={beaconRadius * 0.4}
                        fill="#000000"
                        fillOpacity="0.25"
                      />

                      {/* Core Solid Beacon Circle */}
                      <circle
                        cx="0"
                        cy="0"
                        r={beaconRadius}
                        fill={isSelected ? '#d97706' : regionColor}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? '5' : '3.2'}
                        className="transition-all duration-200"
                      />

                      {/* Glyph Vector Icon inside Beacon */}
                      {port.fortOrType === 'Masonry Castle / Fort' ? (
                        <path
                          d="M -6 -7 L -6 -3 L -3 -3 L -3 -7 L -1 -7 L -1 -3 L 1 -3 L 1 -7 L 3 -7 L 3 -3 L 6 -3 L 6 -7 L 8 -7 L 8 7 L -8 7 L -8 -7 Z M -2 7 L -2 2 L 2 2 L 2 7 Z"
                          fill="#ffffff"
                          transform={`scale(${beaconRadius >= 30 ? 1.2 : 0.85})`}
                        />
                      ) : port.fortOrType === 'Island Entrepôt' ? (
                        <circle cx="0" cy="0" r={beaconRadius * 0.3} fill="#ffffff" />
                      ) : (
                        <path
                          d="M 0 -7 L 0 5 M -4 1 L 4 1 M -5 3 C -2 7, 2 7, 5 3"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          transform={`scale(${beaconRadius >= 30 ? 1.1 : 0.8})`}
                        />
                      )}

                      {/* Seaward Collision-Free Leader Line & Badge */}
                      {shouldShowLabel && (() => {
                        const dist = Math.hypot(labelConfig.offsetX, labelConfig.offsetY);
                        const trimDist = beaconRadius + 4;
                        const ratio = dist > trimDist ? (dist - trimDist) / dist : 0.75;
                        const startX = -labelConfig.offsetX * ratio;
                        const startY = -labelConfig.offsetY * ratio;

                        return (
                          <g transform={`translate(${labelConfig.offsetX}, ${labelConfig.offsetY})`} className="pointer-events-none">
                            {/* Hairline Nautical Leader Connecting Line */}
                            <line
                              x1={startX}
                              y1={startY}
                              x2={0}
                              y2={0}
                              stroke={isSelected ? '#d97706' : regionColor}
                              strokeWidth="2.2"
                              strokeDasharray="4 3"
                              opacity="0.85"
                            />
                            <circle cx="0" cy="0" r="3" fill={isSelected ? '#d97706' : regionColor} />

                            {/* High-Contrast Floating Pill Badge */}
                            <rect
                              x={-pillWidth / 2}
                              y="-18"
                              width={pillWidth}
                              height="36"
                              rx="18"
                              fill="#0f172a"
                              fillOpacity={isSelected ? 0.98 : 0.92}
                              stroke={isSelected ? '#fbbf24' : regionColor}
                              strokeWidth={isSelected ? 3.0 : 1.8}
                            />

                            {/* Text: Name & Embarkation Figures */}
                            <text
                              x="0"
                              y="5"
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize="17"
                              fontFamily="sans-serif"
                              fontWeight={isSelected ? '800' : '700'}
                            >
                              {isSelected && <tspan fill="#fbbf24">★ </tspan>}
                              {portDisplayName}{' '}
                              <tspan fill={isSelected ? '#fde047' : '#94a3b8'} fontWeight="800" fontFamily="monospace">
                                · {volumeText}
                              </tspan>
                            </text>
                          </g>
                        );
                      })()}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Radar Mini-Map in Corner (Shifted dynamically when filmstrip is open so NOTHING is obscured) */}
          <div
            className={`absolute left-4 z-20 pointer-events-none hidden sm:block transition-all duration-300 ${
              isFilmstripOpen ? 'bottom-[102px]' : 'bottom-4'
            }`}
          >
            <div className="w-40 h-[105px] rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-stone-700 p-1.5 shadow-lg relative overflow-hidden">
              <div className="w-full h-full relative overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-950 flex items-center justify-center">
                {/* SVG Silhouette of Africa inside Mini-Map */}
                <svg viewBox="0 0 5796 5867" className="w-full h-full object-contain opacity-40">
                  <AfricaVectorContinent mode="silhouette" theme="monochrome" strokeWidth={2} />
                </svg>

                {/* Live Viewport Indicator Rectangle */}
                <div
                  className="absolute border-2 border-amber-600 bg-amber-500/25 rounded-xs transition-all duration-150 pointer-events-none"
                  style={{
                    left: `${(currentViewBox.x / 5796) * 100}%`,
                    top: `${(currentViewBox.y / 5867) * 100}%`,
                    width: `${Math.min(100, (currentViewBox.w / 5796) * 100)}%`,
                    height: `${Math.min(100, (currentViewBox.h / 5867) * 100)}%`
                  }}
                />
              </div>
              <span className="absolute bottom-1 right-2 text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wider">
                RADAR
              </span>
            </div>
          </div>

          {/* Historical Horizon Scrubber HUD (1514–1866) */}
          <div
            className={`absolute right-4 z-20 pointer-events-auto transition-all duration-300 max-w-sm sm:max-w-md ${
              isFilmstripOpen ? 'bottom-[102px]' : 'bottom-4'
            }`}
          >
            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300/80 dark:border-stone-700 shadow-xl text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTimelinePlaying(!isTimelinePlaying)}
                    className="w-7 h-7 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                    title={isTimelinePlaying ? 'Pause Century Playback' : 'Play Historical Horizon Animation (1514–1866)'}
                  >
                    {isTimelinePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <span className="font-serif font-bold text-stone-900 dark:text-stone-100">
                    Era: {yearRange[0]}–{yearRange[1]}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowOceanVectors(v => !v)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                      showOceanVectors
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 dark:border-sky-600 text-sky-800 dark:text-sky-300'
                        : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500'
                    }`}
                    title="Toggle Marine Current & Trade Wind Flow Vectors"
                  >
                    <Wind className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                    <span>Currents {showOceanVectors ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>

              {/* Range slider for End Year */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 dark:text-stone-400">
                  <span>1514</span>
                  <span className="font-bold text-amber-800 dark:text-amber-400">{filteredPorts.length} Ports Active</span>
                  <span>1866</span>
                </div>
                <input
                  type="range"
                  min="1514"
                  max="1866"
                  value={yearRange[1]}
                  onChange={(e) => {
                    const end = Number(e.target.value);
                    setYearRange([yearRange[0], end]);
                  }}
                  className="w-full accent-amber-700 dark:accent-amber-400 cursor-pointer h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg"
                />
              </div>

              {/* Century Fast Jump Buttons */}
              <div className="flex items-center gap-1 pt-1 border-t border-stone-100 dark:border-stone-800">
                {[
                  { label: 'All', range: [1514, 1866] as [number, number] },
                  { label: '16th C.', range: [1514, 1600] as [number, number] },
                  { label: '17th C.', range: [1601, 1700] as [number, number] },
                  { label: '18th C.', range: [1701, 1800] as [number, number] },
                  { label: '19th C.', range: [1801, 1866] as [number, number] },
                ].map(b => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => {
                      setIsTimelinePlaying(false);
                      setYearRange(b.range);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                      yearRange[0] === b.range[0] && yearRange[1] === b.range[1]
                        ? 'bg-amber-800 text-white font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Pill to Open Port Tray when collapsed (Nothing obscured!) */}
          {!isFilmstripOpen && (
            <button
              onClick={() => setIsFilmstripOpen(true)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-stone-900/95 shadow-md border border-stone-300 dark:border-stone-700 text-xs font-mono font-bold text-amber-900 dark:text-amber-300 hover:scale-105 transition-all cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Show Port Tray ({filteredPorts.length})</span>
              <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
            </button>
          )}

          {/* 3. BOTTOM FILMSTRIP TRAY (In the vein of ArchivalImageViewer.tsx) with Toggle Icon */}
          <AnimatePresence>
            {isFilmstripOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full border-t border-stone-200/90 dark:border-stone-800 bg-[#F4EFE6]/95 dark:bg-stone-900/95 backdrop-blur-md shrink-0 z-20 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-1.5 border-b border-stone-200/60 dark:border-stone-800/60 text-xs">
                  <span className="font-mono text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5" />
                    Historic Port Enclaves Tray ({filteredPorts.length})
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (filmstripRef.current) filmstripRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                      }}
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                      title="Scroll Left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (filmstripRef.current) filmstripRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                      }}
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                      title="Scroll Right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-3 bg-stone-300 dark:bg-stone-700 mx-1" />
                    {/* Toggle Icon to Collapse Port Tray */}
                    <button
                      onClick={() => setIsFilmstripOpen(false)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-[10px] font-mono cursor-pointer"
                      title="Collapse Port Tray"
                    >
                      <span>Hide</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div
                  ref={filmstripRef}
                  className="flex items-center gap-2 overflow-x-auto p-2.5 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700"
                >
                  {filteredPorts.map((port) => {
                    const isSelected = activePort?.id === port.id;
                    const regionColor = getRegionColor(port.region);
                    return (
                      <button
                        key={port.id}
                        data-port-id={port.id}
                        onClick={() => handlePortClick(port)}
                        onMouseEnter={() => setHoveredRegion(port.region)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        className={`group shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-2xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white dark:bg-stone-800 border-amber-600 shadow-md ring-2 ring-amber-500/20'
                            : 'bg-white/80 dark:bg-stone-900/80 border-stone-200 dark:border-stone-800 hover:border-amber-400 hover:bg-white'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs"
                          style={{ backgroundColor: regionColor }}
                        >
                          <Castle className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 pr-1">
                          <div className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100 truncate max-w-[130px]">
                            {port.name.split(' (')[0]}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                            <span>{port.countryModern}</span>
                            <span>·</span>
                            <span className="font-bold text-amber-700 dark:text-amber-400">
                              {(port.estimatedEmbarkations / 1_000_000).toFixed(2)}M
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLLAPSIBLE METADATA DOSSIER DRAWER (Exactly w-full lg:w-5/12 xl:w-1/3 matching ArchivalImageViewer.tsx) */}
        {isMetadataOpen && (
          <aside 
            aria-label="Port Dossier and Archival Metadata"
            className="w-full lg:w-5/12 xl:w-1/3 bg-[#FAF8F5] dark:bg-[#161413] flex flex-col justify-between shrink-0 h-full border-t lg:border-t-0 border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100 overflow-hidden relative"
          >
            {/* Drawer Tab Headers with Dedicated Collapse Toggle */}
            <div 
              role="tablist" 
              aria-label="Port dossier sections"
              className="flex items-center justify-between border-b border-stone-200/90 dark:border-stone-800 bg-[#F4EFE6]/90 dark:bg-stone-950/80 px-3 pt-2 gap-1 shrink-0"
            >
                <div className="flex items-center gap-1 flex-1">
                  <button
                    role="tab"
                    id="tab-port-dossier"
                    aria-selected={activeTab === 'dossier'}
                    aria-controls="panel-port-dossier"
                    tabIndex={activeTab === 'dossier' ? 0 : -1}
                    onClick={() => setActiveTab('dossier')}
                    className={`flex-1 py-2 text-xs font-mono font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      activeTab === 'dossier'
                        ? 'border-amber-700 text-amber-900 dark:text-amber-300 dark:border-amber-400 bg-white dark:bg-stone-900 rounded-t-xl'
                        : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                    }`}
                  >
                    <Castle className="w-3.5 h-3.5" />
                    <span>Dossier</span>
                  </button>
                  <button
                    role="tab"
                    id="tab-port-citation"
                    aria-selected={activeTab === 'citation'}
                    aria-controls="panel-port-citation"
                    tabIndex={activeTab === 'citation' ? 0 : -1}
                    onClick={() => setActiveTab('citation')}
                    className={`flex-1 py-2 text-xs font-mono font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      activeTab === 'citation'
                        ? 'border-amber-700 text-amber-900 dark:text-amber-300 dark:border-amber-400 bg-white dark:bg-stone-900 rounded-t-xl'
                        : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Cite</span>
                  </button>
                  <button
                    role="tab"
                    id="tab-port-network"
                    aria-selected={activeTab === 'network'}
                    aria-controls="panel-port-network"
                    tabIndex={activeTab === 'network' ? 0 : -1}
                    onClick={() => setActiveTab('network')}
                    className={`flex-1 py-2 text-xs font-mono font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      activeTab === 'network'
                        ? 'border-amber-700 text-amber-900 dark:text-amber-300 dark:border-amber-400 bg-white dark:bg-stone-900 rounded-t-xl'
                        : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Nearby</span>
                  </button>
                </div>

                {/* Dedicated Close/Collapse Toggle on Dossier Drawer */}
                <button
                  onClick={() => setIsMetadataOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors ml-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  title="Collapse Dossier Drawer"
                  aria-label="Collapse Dossier Drawer"
                >
                  <PanelRightClose className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div 
                role="tabpanel" 
                id={`panel-port-${activeTab}`} 
                aria-labelledby={`tab-port-${activeTab}`} 
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700"
              >
                {activePort ? (
                  <>
                    {/* TAB 1: PORT DOSSIER & HISTORICAL CONTEXT */}
                    {activeTab === 'dossier' && (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                            <span className="font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-widest text-[10px]">
                              {activePort.region}
                            </span>
                            <span>{activePort.countryModern}</span>
                          </div>
                          <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug">
                            {activePort.name}
                          </h3>
                          {activePort.historicalAliases.length > 0 && (
                            <p className="text-xs font-serif italic text-stone-500 mt-0.5">
                              Aliases: {activePort.historicalAliases.join(', ')}
                            </p>
                          )}
                        </div>

                        {/* UNESCO World Heritage Tag */}
                        {activePort.unescoWorldHeritage && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-medium border border-amber-300 dark:border-amber-800/60 shadow-xs">
                            <Shield className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                            <span>UNESCO World Heritage Site</span>
                          </div>
                        )}

                        {/* Metric Highlights Grid */}
                        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                          <div>
                            <div className="text-[10px] uppercase tracking-wider font-sans text-stone-500">Documented Captives</div>
                            <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                              {activePort.estimatedEmbarkations.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider font-sans text-stone-500">Typology</div>
                            <div className="text-xs font-serif font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
                              {activePort.fortOrType}
                            </div>
                          </div>
                        </div>

                        {/* Historical Narrative */}
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                            Historical Record & Architecture
                          </h4>
                          <p className="text-xs font-serif text-stone-600 dark:text-stone-300 leading-relaxed bg-[#FAF8F5] dark:bg-stone-950 p-3 rounded-xl border border-stone-200/80 dark:border-stone-800">
                            {activePort.historicalDescription}
                          </p>
                        </div>

                        {/* Indigenous Polity & Active Centuries */}
                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 space-y-1">
                            <span className="text-[10px] font-sans uppercase tracking-wider text-stone-500 block">Sovereign Indigenous Polity</span>
                            <span className="font-semibold text-stone-900 dark:text-stone-100">{activePort.indigenousPolity}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 space-y-1">
                            <span className="text-[10px] font-sans uppercase tracking-wider text-stone-500 block">European Powers / Flags</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {activePort.europeanPowers.map((pow) => (
                                <span key={pow} className="px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-800 text-[10px] font-medium text-stone-700 dark:text-stone-300">
                                  {pow}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 space-y-1">
                            <span className="text-[10px] font-sans uppercase tracking-wider text-stone-500 block">Primary Ethnic Groups Embarked</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {activePort.primaryEthnicGroups.map((eth) => (
                                <span key={eth} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-900 dark:text-amber-300 text-[10px] font-medium border border-amber-500/20">
                                  {eth}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 space-y-1">
                            <span className="text-[10px] font-sans uppercase tracking-wider text-stone-500 block">Transatlantic Destinations</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {activePort.primaryDestinations.map((dest) => (
                                <span key={dest} className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-900 dark:text-blue-300 text-[10px] font-medium border border-blue-500/20">
                                  {dest}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: SCHOLARLY CITATION & PROVENANCE */}
                    {activeTab === 'citation' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                          <span className="text-xs font-mono font-bold uppercase text-stone-700 dark:text-stone-300">
                            Academic Citation
                          </span>
                          <div className="flex items-center gap-1">
                            {(['chicago', 'apa', 'harvard', 'bibtex'] as CitationStyle[]).map((style) => (
                              <button
                                key={style}
                                onClick={() => setActiveCitationStyle(style)}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold cursor-pointer transition-colors ${
                                  activeCitationStyle === style
                                    ? 'bg-amber-900 text-amber-50 dark:bg-amber-500 dark:text-stone-950'
                                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                                }`}
                              >
                                {style}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Formatted Citation Block */}
                        <div className="relative p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-serif leading-relaxed text-stone-800 dark:text-stone-200">
                          <p className="select-all whitespace-pre-wrap">{generateCitation(activeCitationStyle)}</p>
                        </div>

                        <button
                          onClick={copyCitation}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
                        >
                          {hasCopiedCitation ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-950" />
                              <span>Citation Copied to Clipboard</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy {activeCitationStyle.toUpperCase()} Citation</span>
                            </>
                          )}
                        </button>

                        <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs space-y-2">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500 block font-bold">
                            Data Provenance & Consortium Standards
                          </span>
                          <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                            Harmonized against SlaveVoyages API specifications (Eltis et al.), cross-referenced with UNESCO World Heritage inscription dossiers, and corroborated by regional shipping ledgers.
                          </p>
                          <a
                            href="https://www.slavevoyages.org/voyage/database"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-amber-800 dark:text-amber-400 text-xs font-bold hover:underline"
                          >
                            <span>Open SlaveVoyages Consortium Database</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: COASTAL LITTORAL NETWORK (NEARBY PORTS) */}
                    {activeTab === 'network' && (
                      <div className="space-y-3">
                        <div className="pb-2 border-b border-stone-200 dark:border-stone-800">
                          <h4 className="text-xs font-mono font-bold uppercase text-stone-700 dark:text-stone-300">
                            Nearby Littoral Enclaves ({nearbyPorts.length})
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Coastal anchorages and forts within {activePort.region} maritime corridor.
                          </p>
                        </div>

                        {nearbyPorts.length === 0 ? (
                          <div className="p-6 text-center text-xs text-stone-400">
                            No adjacent ports documented within this immediate coastal quadrant.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {nearbyPorts.map(({ port: np, dist }) => {
                              const regionColor = getRegionColor(np.region);
                              return (
                                <div
                                  key={`net-${np.id}`}
                                  onClick={() => handlePortClick(np)}
                                  onMouseEnter={() => setHoveredRegion(np.region)}
                                  onMouseLeave={() => setHoveredRegion(null)}
                                  className="p-3 rounded-2xl bg-stone-50 hover:bg-amber-50 dark:bg-stone-950 dark:hover:bg-amber-950/30 border border-stone-200 dark:border-stone-800 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                      className="w-2.5 h-2.5 rounded-full shrink-0"
                                      style={{ backgroundColor: regionColor }}
                                    />
                                    <div className="min-w-0">
                                      <div className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 truncate">
                                        {np.name.split(' (')[0]}
                                      </div>
                                      <div className="text-[10px] text-stone-500 font-mono">
                                        {np.countryModern} · {np.fortOrType}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right shrink-0">
                                    <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400">
                                      {(np.estimatedEmbarkations / 1_000_000).toFixed(2)}M
                                    </div>
                                    <div className="text-[9px] text-stone-400 font-mono">
                                      ~{Math.round(dist * 0.8)} km
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-8 text-center text-stone-400 text-xs">
                    Select a port beacon on the map or in the tray below to inspect its historical dossier.
                  </div>
                )}
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-3.5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-mono text-stone-500">
                  Coordinates: {activePort ? `${activePort.coordinates.lat.toFixed(2)}°, ${activePort.coordinates.lng.toFixed(2)}°` : 'N/A'}
                </span>
                <a
                  href="https://www.slavevoyages.org/voyage/database"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Voyages Registry</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </aside>
          )}
      </div>
    </section>
  );
};
