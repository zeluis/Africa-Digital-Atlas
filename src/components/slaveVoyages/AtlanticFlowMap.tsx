import React, { useState, useEffect, useRef } from 'react';
import { REGIONAL_ROUTE_FLOWS } from '../../data/slaveVoyagesData';
import { RegionalRouteFlow, EpistemicMode } from '../../data/slaveVoyagesTypes';
import { AfricaVectorContinent } from '../common/AfricaVectorContinent';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Compass, 
  Wind, 
  Eye, 
  EyeOff, 
  MapPin, 
  Sparkles, 
  Navigation, 
  Waves, 
  Activity,
  Sliders,
  Maximize2,
  X,
  Info,
  ChevronRight,
  Anchor,
  Calendar,
  Filter
} from 'lucide-react';
import {
  mapCalendarSeasonToHydro,
  SEASONAL_HYDRO_METRICS,
  evaluateHydrodynamicVector,
  easeInOutCubic,
  HydrodynamicSeasonId
} from '../../services/oceanHydrodynamicsService';
import {
  projectCoord,
  SOUTH_AMERICA_PATH,
  NORTH_AMERICA_PATH,
  CUBA_PATH,
  HISPANIOLA_PATH,
  JAMAICA_PATH,
  PUERTO_RICO_PATH,
  BAHAMAS_PATH,
  LESSER_ANTILLES_PATH,
  EUROPE_MAINLAND_PATH,
  GREAT_BRITAIN_PATH,
  IRELAND_PATH,
  BALEARIC_PATH,
  SARDINIA_CORSICA_PATH,
  SICILY_PATH,
  AFRICA_PATH,
  MADAGASCAR_PATH,
  EMBARKATION_ZONES,
  TRADE_WINDS,
  TradeWindVector,
  HISTORIC_RIVERS,
  HISTORIC_INTERNAL_BOUNDARIES,
  INTERNATIONAL_BORDERS_PATH
} from './atlanticMapGeometry';

interface AtlanticFlowMapProps {
  epistemicMode: EpistemicMode;
  selectedRouteId?: string;
  onSelectRoute?: (route: RegionalRouteFlow) => void;
  yearRange?: [number, number];
  onYearChange?: (year: number) => void;
  onNavigateToCartography?: () => void;
}

// Major coastal nodes for visual geographic grounding
const COASTAL_ANCHORS = [
  // African Embarkation Ports
  { name: 'Senegambia (Gorée / St. Louis)', lat: 14.6708, lng: -17.4381, type: 'african-port', region: 'Senegambia', volume: '755k captives' },
  { name: 'Sierra Leone (Bunce Island)', lat: 8.4844, lng: -13.2344, type: 'african-port', region: 'Sierra Leone', volume: '389k captives' },
  { name: 'Gold Coast (Cape Coast / Elmina)', lat: 5.1054, lng: -1.2466, type: 'african-port', region: 'Gold Coast', volume: '1.21M captives' },
  { name: 'Bight of Benin (Ouidah / Lagos)', lat: 6.3631, lng: 2.0851, type: 'african-port', region: 'Bight of Benin', volume: '2.00M captives' },
  { name: 'Bight of Biafra (Bonny / Calabar)', lat: 4.4539, lng: 7.1639, type: 'african-port', region: 'Bight of Biafra', volume: '1.59M captives' },
  { name: 'West Central Africa (Luanda / Cabinda)', lat: -8.8390, lng: 13.2894, type: 'african-port', region: 'West Central Africa', volume: '5.69M captives' },
  { name: 'Benguela (São Filipe)', lat: -12.5763, lng: 13.4055, type: 'african-port', region: 'West Central Africa', volume: '1.80M captives' },
  { name: 'Mozambique Channel (Quelimane)', lat: -15.0342, lng: 40.7358, type: 'african-port', region: 'Southeast Africa', volume: '543k captives' },

  // American Disembarkation Ports
  { name: 'Salvador da Bahia (Todos os Santos)', lat: -12.9777, lng: -38.5016, type: 'american-port', region: 'Brazil', volume: '1.50M arrivals' },
  { name: 'Rio de Janeiro (Valongo Wharf)', lat: -22.9068, lng: -43.1729, type: 'american-port', region: 'Brazil', volume: '2.10M arrivals' },
  { name: 'Recife (Pernambuco / Olinda)', lat: -8.0476, lng: -34.8770, type: 'american-port', region: 'Brazil', volume: '850k arrivals' },
  { name: 'Kingston & Port Royal', lat: 17.9712, lng: -76.7936, type: 'american-port', region: 'British Caribbean', volume: '1.10M arrivals' },
  { name: 'Bridgetown (Barbados)', lat: 13.0969, lng: -59.6145, type: 'american-port', region: 'British Caribbean', volume: '500k arrivals' },
  { name: 'Cap-Français (Saint-Domingue)', lat: 19.7595, lng: -72.2008, type: 'american-port', region: 'French Caribbean', volume: '800k arrivals' },
  { name: 'Havana (Cuba)', lat: 23.1136, lng: -82.3666, type: 'american-port', region: 'Spanish Americas', volume: '1.10M arrivals' },
  { name: 'Charleston (South Carolina)', lat: 32.7765, lng: -79.9311, type: 'american-port', region: 'North America', volume: '250k arrivals' },
  { name: 'Paramaribo (Suriname)', lat: 5.8520, lng: -55.2038, type: 'american-port', region: 'Dutch Caribbean', volume: '300k arrivals' },

  // European Metropoles (Triangular departure)
  { name: 'Liverpool', lat: 53.4084, lng: -2.9916, type: 'european-port', region: 'Great Britain', volume: 'Primary British Slave Port' },
  { name: 'Lisbon', lat: 38.7223, lng: -9.1393, type: 'european-port', region: 'Portugal', volume: 'Casa dos Escravos' },
  { name: 'Nantes', lat: 47.2184, lng: -1.5536, type: 'european-port', region: 'France', volume: 'Primary French Slave Port' }
];

export const AtlanticFlowMap: React.FC<AtlanticFlowMapProps> = ({
  epistemicMode,
  selectedRouteId,
  onSelectRoute,
  yearRange,
  onYearChange,
  onNavigateToCartography
}) => {
  const [hoveredRoute, setHoveredRoute] = useState<RegionalRouteFlow | null>(null);
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);
  const [hoveredWind, setHoveredWind] = useState<TradeWindVector | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackYear, setPlaybackYear] = useState(1750);
  
  // Layer toggles
  const [showContinents, setShowContinents] = useState(true);
  const [showMortalityColors, setShowMortalityColors] = useState(true);
  const [showPorts, setShowPorts] = useState(true);
  const [showOceanCurrents, setShowOceanCurrents] = useState(true);
  const [destinationFilter, setDestinationFilter] = useState<'all' | 'Brazil' | 'British Caribbean' | 'French Caribbean' | 'Spanish Americas' | 'North America'>('all');

  // Seasonal meteorological states
  const [selectedSeason, setSelectedSeason] = useState<'summer' | 'autumn' | 'winter' | 'spring'>('summer');
  const [showTradeWinds, setShowTradeWinds] = useState(true);

  // Hydrodynamic Ocean Currents Particle Streamlines Engine
  const oceanCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const hydroSeasonRef = useRef<HydrodynamicSeasonId>(mapCalendarSeasonToHydro(selectedSeason));
  const prevHydroSeasonRef = useRef<HydrodynamicSeasonId>(mapCalendarSeasonToHydro(selectedSeason));
  const transitionProgressRef = useRef<number>(1.0);

  const showOceanCurrentsRef = useRef<boolean>(showOceanCurrents);
  const showTradeWindsRef = useRef<boolean>(showTradeWinds);

  useEffect(() => {
    const target = mapCalendarSeasonToHydro(selectedSeason);
    if (hydroSeasonRef.current !== target) {
      prevHydroSeasonRef.current = hydroSeasonRef.current;
      hydroSeasonRef.current = target;
      transitionProgressRef.current = 0.0;
    }
  }, [selectedSeason]);

  useEffect(() => {
    showOceanCurrentsRef.current = showOceanCurrents;
  }, [showOceanCurrents]);

  useEffect(() => {
    showTradeWindsRef.current = showTradeWinds;
  }, [showTradeWinds]);

  // Persistent Particle Animation Loop for Atlantic Basin Hydrodynamics
  useEffect(() => {
    const canvas = oceanCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const VIRTUAL_WIDTH = 1000;
    const VIRTUAL_HEIGHT = 580;
    const num = 640;
    const particles = new Float32Array(num * 6);

    for (let i = 0; i < num; i++) {
      const idx = i * 6;
      particles[idx] = Math.random() * VIRTUAL_WIDTH;
      particles[idx + 1] = Math.random() * VIRTUAL_HEIGHT;
      const vec = evaluateHydrodynamicVector(particles[idx], particles[idx + 1], hydroSeasonRef.current, true, showTradeWindsRef.current);
      particles[idx + 2] = vec.vx;
      particles[idx + 3] = vec.vy;
      particles[idx + 4] = Math.random() * 80;
      particles[idx + 5] = 75 + Math.random() * 85;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const displayWidth = canvas.parentElement.clientWidth;
      const displayHeight = canvas.parentElement.clientHeight;
      if (displayWidth === 0 || displayHeight === 0) return;

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;

      const scale = Math.min(displayWidth / VIRTUAL_WIDTH, displayHeight / VIRTUAL_HEIGHT);
      const offsetX = (displayWidth - VIRTUAL_WIDTH * scale) / 2;
      const offsetY = (displayHeight - VIRTUAL_HEIGHT * scale) / 2;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(offsetX * dpr, offsetY * dpr);
      ctx.scale(scale * dpr, scale * dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();

    const render = (now: number) => {
      animFrameIdRef.current = requestAnimationFrame(render);

      if (!showOceanCurrentsRef.current) {
        ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
        lastTime = now;
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.04);
      lastTime = now;

      if (transitionProgressRef.current < 1.0) {
        transitionProgressRef.current = Math.min(1.0, transitionProgressRef.current + dt * 1.85);
      }
      const t = easeInOutCubic(transitionProgressRef.current);

      const prevM = SEASONAL_HYDRO_METRICS[prevHydroSeasonRef.current];
      const targetM = SEASONAL_HYDRO_METRICS[hydroSeasonRef.current];

      const curSpeed = (prevM.speedFactor * (1 - t) + targetM.speedFactor * t) * 0.95;
      const curWidth = prevM.trailScale * (1 - t) + targetM.trailScale * t;
      const curRatio = prevM.activeRatio * (1 - t) + targetM.activeRatio * t;
      const activeLimit = Math.floor(num * curRatio);

      ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      const isDark = document.documentElement.classList.contains('dark');

      for (let i = 0; i < num; i++) {
        const idx = i * 6;
        const px = particles[idx];
        const py = particles[idx + 1];
        const age = particles[idx + 4];
        const maxAge = particles[idx + 5];

        const vec0 = evaluateHydrodynamicVector(px, py, prevHydroSeasonRef.current, true, showTradeWindsRef.current);
        const vec1 = evaluateHydrodynamicVector(px, py, hydroSeasonRef.current, true, showTradeWindsRef.current);

        const tvx = vec0.vx * (1 - t) + vec1.vx * t;
        const tvy = vec0.vy * (1 - t) + vec1.vy * t;
        const force = vec0.force * (1 - t) + vec1.force * t;
        const type = t > 0.5 ? vec1.type : vec0.type;
        const isWarm = t > 0.5 ? vec1.isWarm : vec0.isWarm;

        particles[idx + 2] = particles[idx + 2] * 0.88 + tvx * 0.12;
        particles[idx + 3] = particles[idx + 3] * 0.88 + tvy * 0.12;

        const nextX = px + particles[idx + 2] * curSpeed * (dt * 60);
        const nextY = py + particles[idx + 3] * curSpeed * (dt * 60);

        if (i < activeLimit) {
          const lifeAlpha = Math.sin((age / maxAge) * Math.PI);
          const alpha = Math.max(0, Math.min(1, lifeAlpha * 0.90));

          if (type === 1) {
            // Ocean current
            if (isDark) {
              ctx.strokeStyle = isWarm
                ? `rgba(251, 191, 36, ${alpha * 0.92})`
                : `rgba(56, 189, 248, ${alpha * 0.92})`;
            } else {
              ctx.strokeStyle = isWarm
                ? `rgba(194, 65, 12, ${alpha * 0.85})`
                : `rgba(2, 132, 199, ${alpha * 0.85})`;
            }
            ctx.lineWidth = Math.max(0.9, curWidth * 0.72 * (0.8 + force * 0.3));
          } else if (type === 2) {
            // Wind vector
            ctx.strokeStyle = isDark
              ? `rgba(224, 242, 254, ${alpha * 0.8})`
              : `rgba(71, 85, 105, ${alpha * 0.65})`;
            ctx.lineWidth = Math.max(0.7, curWidth * 0.45 * (0.8 + force * 0.25));
          } else {
            // Ambient
            ctx.strokeStyle = isDark
              ? `rgba(148, 163, 184, ${alpha * 0.22})`
              : `rgba(168, 162, 158, ${alpha * 0.3})`;
            ctx.lineWidth = 0.7;
          }

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }

        particles[idx] = nextX;
        particles[idx + 1] = nextY;
        particles[idx + 4] = age + 1;

        if (age >= maxAge || nextX < -10 || nextX > VIRTUAL_WIDTH + 10 || nextY < -10 || nextY > VIRTUAL_HEIGHT + 10) {
          particles[idx] = Math.random() * VIRTUAL_WIDTH;
          particles[idx + 1] = Math.random() * VIRTUAL_HEIGHT;
          particles[idx + 4] = 0;
          particles[idx + 5] = 70 + Math.random() * 80;
          const newVec = evaluateHydrodynamicVector(particles[idx], particles[idx + 1], hydroSeasonRef.current, true, showTradeWindsRef.current);
          particles[idx + 2] = newVec.vx;
          particles[idx + 3] = newVec.vy;
        }
      }
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  // Playback timer loop
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlaybackYear(prev => {
          if (prev >= 1860) {
            setIsPlaying(false);
            return 1520;
          }
          const next = prev + 5;
          if (onYearChange) onYearChange(next);
          return next;
        });
      }, 350);
    }
    return () => clearInterval(timer);
  }, [isPlaying, onYearChange]);

  const getMortalityStroke = (mortality: number) => {
    if (!showMortalityColors) return '#059669'; // Emerald default
    if (mortality < 12.0) return '#059669'; // Low mortality (<12%)
    if (mortality < 15.0) return '#D97706'; // Medium mortality (12-15%)
    return '#E11D48'; // High mortality (>15%)
  };

  // Filter routes based on selected corridor preset
  const filteredRoutes = REGIONAL_ROUTE_FLOWS.filter(r => {
    if (destinationFilter === 'all') return true;
    return r.targetRegion.toLowerCase().includes(destinationFilter.toLowerCase());
  });

  const selectedRoute = REGIONAL_ROUTE_FLOWS.find(r => r.id === selectedRouteId) || hoveredRoute;

  return (
    <div className="relative w-full rounded-3xl border border-[#DCD3C1] dark:border-zinc-800 bg-[#FDFBF7] dark:bg-zinc-950 text-[#1C1917] dark:text-white overflow-hidden shadow-lg select-none">
      {/* 1. Map Header & Controls */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-[#FAF6EE] dark:bg-zinc-900/95 border-b border-[#DCD3C1] dark:border-zinc-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#C2410C]/10 text-[#C2410C] border border-[#C2410C]/25 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 shadow-xs">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-[#1C1917] dark:text-zinc-100 tracking-tight flex items-center gap-2">
                <span>Interactive Atlantic Geodesic Flow Network</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFE7D5] dark:bg-emerald-950 border border-[#D8CCB5] dark:border-emerald-600/60 text-[10px] font-mono text-[#9A3412] dark:text-emerald-400 font-bold">
                  <Sparkles className="w-3 h-3 text-[#C2410C] dark:text-emerald-400" />
                  1514–1866 Canonical System
                </span>
              </h3>
            </div>
            <p className="text-xs text-[#78716C] dark:text-zinc-400">
              Middle Passage Geodesic Arcs • Volume-scaled bandwidth • Middle Passage mortality heatmap
            </p>
          </div>
        </div>

        {/* Interactive Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Destination Corridor Filter */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800/80 border border-[#DCD3C1] dark:border-zinc-700 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-[#78716C] dark:text-zinc-400" />
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value as any)}
              className="bg-transparent text-[#1C1917] dark:text-zinc-200 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="all">All Destinations</option>
              <option value="Brazil">Brazil Corridors</option>
              <option value="British Caribbean">British Caribbean</option>
              <option value="French Caribbean">French Caribbean</option>
              <option value="Spanish Americas">Spanish Americas</option>
              <option value="North America">North America</option>
            </select>
          </div>

          <button
            onClick={() => setShowContinents(!showContinents)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5 shadow-xs ${
              showContinents
                ? 'bg-[#EFE7D5] dark:bg-emerald-500/20 border-[#C2410C]/50 dark:border-emerald-500/40 text-[#9A3412] dark:text-emerald-300'
                : 'bg-white dark:bg-zinc-800/80 border-[#DCD3C1] dark:border-zinc-700 text-[#78716C] dark:text-zinc-400'
            }`}
            title="Toggle Continental Silhouettes"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Continents: {showContinents ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowMortalityColors(!showMortalityColors)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5 shadow-xs ${
              showMortalityColors
                ? 'bg-[#FEF3C7] dark:bg-amber-500/20 border-[#F59E0B] dark:border-amber-500/40 text-[#92400E] dark:text-amber-300'
                : 'bg-white dark:bg-zinc-800/80 border-[#DCD3C1] dark:border-zinc-700 text-[#78716C] dark:text-zinc-400'
            }`}
          >
            <span>Mortality Colors: {showMortalityColors ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowPorts(!showPorts)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5 shadow-xs ${
              showPorts
                ? 'bg-[#DCFCE7] dark:bg-emerald-500/20 border-[#10B981] dark:border-emerald-500/40 text-[#166534] dark:text-emerald-300'
                : 'bg-white dark:bg-zinc-800/80 border-[#DCD3C1] dark:border-zinc-700 text-[#78716C] dark:text-zinc-400'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Ports: {showPorts ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowOceanCurrents(!showOceanCurrents)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5 shadow-xs ${
              showOceanCurrents
                ? 'bg-[#E0F2FE] dark:bg-sky-500/20 border-[#0284C7] dark:border-sky-500/40 text-[#0369A1] dark:text-sky-300'
                : 'bg-white dark:bg-zinc-800/80 border-[#DCD3C1] dark:border-zinc-700 text-[#78716C] dark:text-zinc-400'
            }`}
            title="Toggle Dynamic Ocean Hydrodynamic Particle Streamlines"
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Currents: {showOceanCurrents ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Major Corridors Segmented Filter Strip */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 py-2.5 bg-[#FAF6EE] dark:bg-zinc-900 border-b border-[#DCD3C1] dark:border-zinc-800 text-xs">
        <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#78716C] dark:text-zinc-400 mr-2">
          MAJOR CORRIDORS:
        </span>
        {[
          { id: 'all', label: 'All Corridors (12.5M Captives)' },
          { id: 'Brazil', label: 'Brazil' },
          { id: 'British Caribbean', label: 'British Caribbean' },
          { id: 'French Caribbean', label: 'French Caribbean' },
          { id: 'Spanish Americas', label: 'Spanish Americas' },
          { id: 'North America', label: 'North America' }
        ].map(corr => (
          <button
            key={corr.id}
            type="button"
            onClick={() => setDestinationFilter(corr.id as any)}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-xs ${
              destinationFilter === corr.id
                ? 'bg-[#C2410C] text-white shadow-xs'
                : 'bg-white dark:bg-zinc-800 text-[#57534E] dark:text-zinc-300 hover:bg-[#F5EFE1] dark:hover:bg-zinc-700 border border-[#DCD3C1] dark:border-zinc-700'
            }`}
          >
            {corr.label}
          </button>
        ))}
      </div>

      {/* 2. Split Main View (Map 9 cols / Sidebar 3 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 overflow-hidden">
        {/* Left Map Viewport (9 cols) */}
        <div className="xl:col-span-9 relative bg-[#FAF6EE] dark:bg-zinc-950 flex items-center justify-center min-h-[540px] select-none">
          <svg
            viewBox="0 0 1000 580"
            className="w-full h-full block"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            <defs>
              <filter id="flowGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <radialGradient id="photonGlowGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Canvas */}
            <rect width="1000" height="580" fill="#FAF6EE" className="dark:[fill:#090d16]" />

            {/* Hairline Oceanic Graticule Lines */}
            <g className="graticule-layer opacity-25" stroke="#0284C7" strokeWidth="0.5" strokeDasharray="4 4">
              <line x1="0" y1="290" x2="1000" y2="290" /> {/* Equator */}
              <line x1="0" y1="165" x2="1000" y2="165" /> {/* Tropic of Cancer */}
              <line x1="0" y1="415" x2="1000" y2="415" /> {/* Tropic of Capricorn */}
              <line x1="680" y1="0" x2="680" y2="580" /> {/* Prime Meridian */}
            </g>

            {/* Continental Landmasses */}
            {showContinents && (
              <g className="continents-layer">
                {/* Americas */}
                <path d={SOUTH_AMERICA_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />
                <path d={NORTH_AMERICA_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />
                <path d={CUBA_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />
                <path d={HISPANIOLA_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />
                <path d={JAMAICA_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />
                <path d={PUERTO_RICO_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />
                <path d={BAHAMAS_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />
                <path d={LESSER_ANTILLES_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />

                {/* Europe */}
                <path d={EUROPE_MAINLAND_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />
                <path d={GREAT_BRITAIN_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />
                <path d={IRELAND_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />
                <path d={BALEARIC_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />
                <path d={SARDINIA_CORSICA_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />
                <path d={SICILY_PATH} fill="#E8DFCE" className="dark:[fill:#18181b]" stroke="#D8CCB5" strokeWidth="1" />

                {/* Africa Landmass & Madagascar via authoritative AfricaVectorContinent */}
                <AfricaVectorContinent
                  x="555"
                  y="125"
                  width="440"
                  height="435"
                  mode="embarkation_zones"
                  theme="embarkation"
                  strokeWidth={1.2}
                />

                {/* International Boundaries & Rivers */}
                <path d={INTERNATIONAL_BORDERS_PATH} fill="none" stroke="#DCD3C1" strokeWidth="0.6" strokeDasharray="2 2" />
                {HISTORIC_INTERNAL_BOUNDARIES.map(b => (
                  <path key={b.id} d={b.path} fill="none" stroke="#DCD3C1" strokeWidth="0.5" strokeDasharray="3 3" />
                ))}
                {HISTORIC_RIVERS.map(r => (
                  <path key={r.id} d={r.path} fill="none" stroke="#38BDF8" strokeWidth="0.9" opacity="0.6" />
                ))}

                {/* Nautical Compass Rose (N • POLARIS) */}
                <g transform="translate(360, 105)" className="select-none pointer-events-none">
                  <circle cx="0" cy="0" r="28" fill="#FAF6EE" stroke="#C2410C" strokeWidth="1.5" opacity="0.9" className="dark:[fill:#18181b]" />
                  <circle cx="0" cy="0" r="22" fill="none" stroke="#C2410C" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.6" />
                  <path d="M 0 -26 L 5 -8 L 26 0 L 5 8 L 0 26 L -5 8 L -26 0 L -5 -8 Z" fill="#C2410C" opacity="0.85" />
                  <path d="M 0 -26 L 0 26 M -26 0 L 26 0" stroke="#FAF6EE" strokeWidth="1" />
                  <text x="0" y="-31" textAnchor="middle" fill="#C2410C" fontSize="8.5" fontFamily="serif" fontWeight="bold">N • POLARIS</text>
                  <text x="-34" y="3" textAnchor="middle" fill="#78716C" fontSize="7" fontFamily="mono">W</text>
                  <text x="34" y="3" textAnchor="middle" fill="#78716C" fontSize="7" fontFamily="mono">E</text>
                  <text x="0" y="36" textAnchor="middle" fill="#78716C" fontSize="7" fontFamily="mono">S</text>
                </g>

                {/* Continental & Ocean Typography Labels */}
                <g className="select-none pointer-events-none font-serif">
                  <text x="140" y="175" fill="#1C1917" className="dark:[fill:#F6F4EE]" fontSize="13" fontWeight="bold" letterSpacing="1.5">NORTH AMERICA</text>
                  <text x="140" y="187" fill="#0284C7" fontSize="8" fontFamily="mono" fontWeight="bold">389K DIRECT ARRIVALS</text>

                  <text x="185" y="318" fill="#0369A1" fontSize="10" fontStyle="italic" letterSpacing="2" opacity="0.7">CARIBBEAN SEA</text>

                  <text x="230" y="400" fill="#1C1917" className="dark:[fill:#F6F4EE]" fontSize="13" fontWeight="bold" letterSpacing="1.5">SOUTH AMERICA</text>
                  <text x="230" y="412" fill="#0284C7" fontSize="8" fontFamily="mono" fontWeight="bold">BRAZIL (5.1M ARRIVALS)</text>

                  <text x="360" y="225" fill="#78716C" className="dark:[fill:#A8A29E]" fontSize="10" fontStyle="italic" letterSpacing="3" opacity="0.6">NORTH ATLANTIC OCEAN</text>
                  <text x="410" y="490" fill="#78716C" className="dark:[fill:#A8A29E]" fontSize="10" fontStyle="italic" letterSpacing="3" opacity="0.6">SOUTH ATLANTIC OCEAN</text>

                  <text x="570" y="260" fill="#1C1917" className="dark:[fill:#F6F4EE]" fontSize="14" fontWeight="bold" letterSpacing="1.5">AFRICA</text>
                  <text x="570" y="272" fill="#C2410C" className="dark:[fill:#FB923C]" fontSize="8.5" fontFamily="mono" fontWeight="bold">12.5M CAPTIVES EMBARKED</text>
                </g>

                {/* Scale Bar at Bottom Left */}
                <g transform="translate(50, 535)" className="select-none pointer-events-none">
                  <rect x="0" y="0" width="130" height="22" fill="#FAF6EE" stroke="#DCD3C1" strokeWidth="0.75" rx="4" opacity="0.85" className="dark:[fill:#18181b] dark:stroke-zinc-800" />
                  <line x1="10" y1="11" x2="120" y2="11" stroke="#57534E" strokeWidth="1.5" />
                  <line x1="10" y1="7" x2="10" y2="15" stroke="#57534E" strokeWidth="1.5" />
                  <line x1="65" y1="8" x2="65" y2="14" stroke="#57534E" strokeWidth="1" />
                  <line x1="120" y1="7" x2="120" y2="15" stroke="#57534E" strokeWidth="1.5" />
                  <text x="10" y="20" fill="#78716C" fontSize="7" fontFamily="mono">0</text>
                  <text x="65" y="20" textAnchor="middle" fill="#78716C" fontSize="7" fontFamily="mono">500 NM</text>
                  <text x="120" y="20" textAnchor="end" fill="#78716C" fontSize="7" fontFamily="mono">1000 NM (1852 km)</text>
                </g>
              </g>
            )}

            {/* Embarkation Zones */}
            <g className="embarkation-zones">
              {EMBARKATION_ZONES.map((zone) => {
                const pathD = zone.polygonCoords.map(([lat, lng], i) => {
                  const [px, py] = projectCoord(lat, lng);
                  return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
                }).join(' ') + ' Z';

                return (
                  <path
                    key={zone.id}
                    d={pathD}
                    fill={zone.color}
                    fillOpacity="0.14"
                    stroke={zone.color}
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                );
              })}
            </g>

            {/* Trade Wind Vector Arcs */}
            {showTradeWinds && (
              <g className="trade-winds-layer pointer-events-auto">
                {TRADE_WINDS.map(wind => {
                  const [x1, y1] = projectCoord(wind.startLat, wind.startLng);
                  const [cx, cy] = projectCoord(wind.ctrlLat, wind.ctrlLng);
                  const [x2, y2] = projectCoord(wind.endLat, wind.endLng);

                  return (
                    <g 
                      key={wind.id}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredWind(wind)}
                      onMouseLeave={() => setHoveredWind(null)}
                    >
                      <path
                        d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                        fill="none"
                        stroke={wind.color}
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                        strokeOpacity="0.75"
                        className="transition-all group-hover:stroke-width-4"
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {/* Transatlantic Geodesic Flow Arcs */}
            <g className="geodesic-flows-layer pointer-events-auto">
              {filteredRoutes.map((route, rIdx) => {
                const [x1, y1] = projectCoord(route.sourceCoords[0], route.sourceCoords[1]);
                const [x2, y2] = projectCoord(route.targetCoords[0], route.targetCoords[1]);

                const midX = (x1 + x2) / 2 + (y1 - y2) * 0.16;
                const midY = (y1 + y2) / 2 - Math.abs(x1 - x2) * 0.14;

                const isHovered = hoveredRoute?.id === route.id;
                const isSelected = selectedRouteId === route.id;

                let epochMultiplier = 1.0;
                if (playbackYear < 1600) {
                  epochMultiplier = (route.targetRegion.includes('Brazil') || route.targetRegion.includes('Spanish')) ? 0.95 : 0.25;
                } else if (playbackYear < 1700) {
                  epochMultiplier = (route.targetRegion.includes('Brazil') || route.targetRegion.includes('Caribbean')) ? 0.9 : 0.45;
                } else if (playbackYear <= 1808) {
                  epochMultiplier = 1.0;
                } else {
                  epochMultiplier = (route.targetRegion.includes('Brazil') || route.targetRegion.includes('Spanish')) ? 0.95 : 0.15;
                }

                const baseWidth = Math.max(2.5, Math.min(16, (route.embarkedCount / 5694200) * 16));
                const volumeWidth = baseWidth * epochMultiplier;
                const strokeColor = getMortalityStroke(route.avgMortalityRate);

                const seasonDurationMultipliers = { summer: 1.0, autumn: 1.3, winter: 0.8, spring: 1.15 };
                const seasonMult = seasonDurationMultipliers[selectedSeason];
                const baseDur = 4.2 + (rIdx % 4) * 0.7;
                const animatedDur = baseDur * seasonMult;

                return (
                  <g 
                    key={route.id}
                    className="cursor-pointer transition-all duration-300 group"
                    onClick={() => onSelectRoute && onSelectRoute(route)}
                    onMouseEnter={() => setHoveredRoute(route)}
                    onMouseLeave={() => setHoveredRoute(null)}
                  >
                    {(isHovered || isSelected) && (
                      <path
                        d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={volumeWidth + 10}
                        strokeOpacity="0.4"
                        filter="url(#flowGlow)"
                      />
                    )}

                    <path
                      d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isHovered ? volumeWidth + 3 : volumeWidth}
                      strokeOpacity={isHovered || isSelected ? 0.95 : Math.max(0.3, 0.8 * epochMultiplier)}
                      strokeLinecap="round"
                    />

                    {/* Photon Particles */}
                    <g className="pointer-events-none">
                      <g>
                        <circle cx="0" cy="0" r={isHovered ? "6.8" : "5.0"} fill="url(#photonGlowGradient)" />
                        <circle cx="0" cy="0" r={isHovered ? "2.4" : "1.8"} fill="#FFFFFF" />
                        <animateMotion
                          path={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                          dur={`${animatedDur}s`}
                          repeatCount="indefinite"
                        />
                      </g>
                      {(route.embarkedCount > 400000 || isHovered) && (
                        <g>
                          <circle cx="0" cy="0" r={isHovered ? "5.4" : "4.0"} fill="url(#photonGlowGradient)" />
                          <circle cx="0" cy="0" r={isHovered ? "2.0" : "1.5"} fill="#FFFFFF" />
                          <animateMotion
                            path={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                            dur={`${animatedDur}s`}
                            begin={`${animatedDur / 2}s`}
                            repeatCount="indefinite"
                          />
                        </g>
                      )}
                    </g>

                    {(isHovered || isSelected || (route.embarkedCount > 1500000 && epochMultiplier > 0.5)) && (
                      <g transform={`translate(${midX}, ${midY})`} className="pointer-events-none">
                        <rect x="-30" y="-9" width="60" height="18" rx="4" fill="#FAF6EE" className="dark:[fill:#020617]" stroke={strokeColor} strokeWidth="1.2" opacity="0.96" />
                        <text x="0" y="3.5" textAnchor="middle" fill="#1C1917" className="dark:[fill:#ffffff]" fontSize="8" fontFamily="monospace" fontWeight="900">
                          {(route.embarkedCount / 1000000).toFixed(2)}M
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Coastal Anchor Port Pins */}
            {showPorts && (
              <g className="coastal-ports-layer pointer-events-auto">
                {COASTAL_ANCHORS.map((port, idx) => {
                  const [x, y] = projectCoord(port.lat, port.lng);
                  const isAfrican = port.type === 'african-port';
                  const isAmerican = port.type === 'american-port';
                  const isPortHovered = hoveredNode?.name === port.name;

                  const fillColor = isAfrican ? '#059669' : isAmerican ? '#0284C7' : '#D97706';
                  const portDisplayName = port.name.split(' (')[0];
                  const pillWidth = Math.max(50, portDisplayName.length * 6.0 + 16);
                  const isWest = isAmerican;
                  const pillX = isWest ? x - pillWidth - 10 : x + 10;
                  const pillY = y - 9;

                  return (
                    <g 
                      key={`port-${idx}`}
                      className="cursor-pointer transition-transform hover:scale-110"
                      onMouseEnter={() => setHoveredNode(port)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isPortHovered ? 6.5 : 4.0}
                        fill={fillColor}
                        stroke="#FAF6EE"
                        strokeWidth="1.5"
                      />

                      {(isPortHovered || isAfrican || isAmerican) && (
                        <g className="pointer-events-none transition-opacity duration-150">
                          <rect
                            x={pillX}
                            y={pillY}
                            width={pillWidth}
                            height={18}
                            rx={5}
                            fill="#FAF6EE"
                            className="dark:[fill:#020617]"
                            stroke={fillColor}
                            strokeWidth={isPortHovered ? 1.5 : 1}
                            opacity={0.92}
                          />
                          <text
                            x={pillX + pillWidth / 2}
                            y={pillY + 12}
                            textAnchor="middle"
                            fill="#1C1917"
                            className="dark:[fill:#ffffff]"
                            fontSize="8"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {portDisplayName}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            )}
          </svg>

          {/* Real-Time HTML5 Ocean Currents & Particle Streamlines */}
          <canvas ref={oceanCanvasRef} className="absolute inset-0 w-full h-full block cursor-crosshair z-10 pointer-events-none" />

          {/* Floating Route Inspection Tooltip */}
          {hoveredRoute && (
            <div className="absolute top-4 left-4 max-w-xs p-3.5 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-[#DCD3C1] dark:border-zinc-700 backdrop-blur-md shadow-2xl space-y-1.5 pointer-events-none text-left z-20">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#C2410C] dark:text-emerald-400">
                <span>{hoveredRoute.sourceRegion}</span>
                <span>➔ {hoveredRoute.targetRegion}</span>
              </div>
              <div className="text-xs space-y-1 text-[#57534E] dark:text-zinc-300 font-mono">
                <div className="flex justify-between">
                  <span>Embarked:</span>
                  <strong className="text-[#1C1917] dark:text-zinc-100">{(hoveredRoute.embarkedCount / 1000).toFixed(0)}k</strong>
                </div>
                <div className="flex justify-between">
                  <span>Disembarked:</span>
                  <strong className="text-[#1C1917] dark:text-zinc-100">{(hoveredRoute.disembarkedCount / 1000).toFixed(0)}k</strong>
                </div>
                <div className="flex justify-between">
                  <span>Mortality:</span>
                  <strong className={hoveredRoute.avgMortalityRate > 15 ? 'text-rose-600 font-black' : 'text-amber-600'}>
                    {hoveredRoute.avgMortalityRate.toFixed(1)}%
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Floating Port Inspection Tooltip */}
          {hoveredNode && !hoveredRoute && (
            <div className="absolute top-4 left-4 max-w-xs p-3.5 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-[#DCD3C1] dark:border-zinc-700 backdrop-blur-md shadow-2xl space-y-1 pointer-events-none text-left z-20">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0284C7] dark:text-sky-400 font-mono">
                <MapPin className="w-3.5 h-3.5" />
                <span>{hoveredNode.name}</span>
              </div>
              <p className="text-[11px] text-[#57534E] dark:text-zinc-300 font-mono">Region: {hoveredNode.region}</p>
              <p className="text-[11px] text-[#C2410C] dark:text-amber-400 font-mono font-bold">Historical Volume: {hoveredNode.volume}</p>
            </div>
          )}

          {/* Floating Trade Wind Tooltip */}
          {hoveredWind && !hoveredRoute && !hoveredNode && (
            <div className="absolute top-4 right-4 max-w-xs p-3 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-[#38BDF8] dark:border-sky-600/40 backdrop-blur-md shadow-2xl space-y-1 pointer-events-none text-left z-20">
              <div className="flex items-center gap-1.5 text-[#0369A1] dark:text-sky-400 text-xs font-bold font-mono">
                <Wind className="w-4 h-4" />
                <span>{hoveredWind.name}</span>
              </div>
              <p className="text-xs text-[#57534E] dark:text-zinc-300 leading-relaxed">{hoveredWind.description}</p>
            </div>
          )}
        </div>

        {/* Seasonal Animator Sidebar (3 of 12 columns on desktop) */}
        <div className="xl:col-span-3 p-4 bg-[#FAF6EE] dark:bg-zinc-900/95 border-t xl:border-t-0 xl:border-l border-[#DCD3C1] dark:border-zinc-800 space-y-4 text-left overflow-y-auto max-h-[620px] scrollbar-thin">
          <div className="flex items-center gap-2 border-b border-[#DCD3C1] dark:border-zinc-800 pb-2">
            <Wind className="w-5 h-5 text-[#C2410C]" />
            <div>
              <h4 className="font-extrabold text-xs text-[#1C1917] dark:text-zinc-100 uppercase tracking-wider">
                Route Seasonality Simulator
              </h4>
              <p className="text-[10px] text-[#78716C] dark:text-zinc-400">
                Simulate meteorological forces on Middle Passage transits
              </p>
            </div>
          </div>

          {/* Interactive Season Picker */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400">
              Select Departure Season:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
              {[
                { id: 'summer', label: 'Summer ☀️', desc: 'Jun–Aug' },
                { id: 'autumn', label: 'Autumn 🍂', desc: 'Sept–Nov' },
                { id: 'winter', label: 'Winter ❄️', desc: 'Dec–Feb' },
                { id: 'spring', label: 'Spring 🌱', desc: 'Mar–May' }
              ].map(season => (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeason(season.id as any)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedSeason === season.id
                      ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200'
                      : 'bg-white dark:bg-zinc-800 border-[#DCD3C1] dark:border-zinc-700 hover:bg-[#FAF6EE] dark:hover:bg-zinc-750 text-[#1C1917] dark:text-white'
                  }`}
                >
                  <p className="font-bold text-[11px]">{season.label}</p>
                  <p className="text-[9px] text-[#78716C] dark:text-zinc-400 font-mono">{season.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Wind Layer Toggle */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-950 border border-[#DCD3C1] dark:border-zinc-800">
            <span className="text-xs font-mono font-semibold text-[#57534E] dark:text-zinc-300">
              Overlay Trade Winds
            </span>
            <button
              onClick={() => setShowTradeWinds(!showTradeWinds)}
              className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                showTradeWinds
                  ? 'bg-[#DCFCE7] dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500'
              }`}
            >
              {showTradeWinds ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Seasonal Simulation Feedback */}
          <div className="p-3 rounded-2xl bg-white dark:bg-zinc-950 border border-[#DCD3C1] dark:border-zinc-800 space-y-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400">
              Active Meteorological State:
            </span>
            
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-[#1C1917] dark:text-zinc-200">
                {selectedSeason === 'summer' && "Steady Northeast Trade Winds"}
                {selectedSeason === 'autumn' && "Doldrums & Hurricane Season"}
                {selectedSeason === 'winter' && "Accelerated Winter Northeast Trades"}
                {selectedSeason === 'spring' && "Moderate Equinoctial Winds"}
              </p>
              <p className="text-[10.5px] text-[#57534E] dark:text-zinc-400 leading-relaxed">
                {selectedSeason === 'summer' && "High-humidity trade winds power stable westward drifts, with warm temperature profiles elevating disease risk in holding spaces."}
                {selectedSeason === 'autumn' && "Frequent windless calms (doldrums) stall ships in the horse latitudes for weeks, while severe tropical hurricanes threaten catastrophic loss."}
                {selectedSeason === 'winter' && "Powerful, cold, persistent trade winds accelerate transit speeds significantly, drastically lowering days spent at sea."}
                {selectedSeason === 'spring' && "Winds are steady but mild; standard current flows present moderate navigation windows across both Hemispheres."}
              </p>
            </div>

            <div className="pt-2 border-t border-[#DCD3C1] dark:border-zinc-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-[9px] text-[#78716C] dark:text-zinc-500 font-mono uppercase">Wind Speed</p>
                <p className="font-extrabold text-amber-600">
                  {selectedSeason === 'summer' && "1.0x (Standard)"}
                  {selectedSeason === 'autumn' && "0.55x (Calms)"}
                  {selectedSeason === 'winter' && "1.55x (Strong)"}
                  {selectedSeason === 'spring' && "0.95x (Moderate)"}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-[#78716C] dark:text-zinc-500 font-mono uppercase">Holding Temp</p>
                <p className="font-extrabold text-rose-600">
                  {selectedSeason === 'summer' && "Very Hot (31°C)"}
                  {selectedSeason === 'autumn' && "Extreme Heat (34°C)"}
                  {selectedSeason === 'winter' && "Cooler (24°C)"}
                  {selectedSeason === 'spring' && "Warm (28°C)"}
                </p>
              </div>
            </div>
          </div>

          {/* Voyage Path Simulation Matrix */}
          <div className="p-3 rounded-2xl bg-[#FAF6EE] dark:bg-zinc-950 border border-[#DCD3C1] dark:border-zinc-800 space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" />
              <span>Simulated Voyage Dossier</span>
            </span>

            {selectedRoute ? (
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#1C1917] dark:text-zinc-200">
                  {selectedRoute.sourceRegion} ➔ {selectedRoute.targetRegion}
                </div>

                {/* Duration comparison */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium text-[#78716C] dark:text-zinc-400">
                    <span>Simulated Transit:</span>
                    <span className="font-bold text-[#1C1917] dark:text-zinc-200">
                      {Math.round(62 * (
                        selectedSeason === 'summer' ? 1.0 :
                        selectedSeason === 'autumn' ? 1.3 :
                        selectedSeason === 'winter' ? 0.8 : 1.15
                      ))} Days
                    </span>
                  </div>
                  <div className="w-full bg-[#E8DFCE] dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedSeason === 'winter' ? 'bg-emerald-500' :
                        selectedSeason === 'autumn' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ 
                        width: `${
                          selectedSeason === 'winter' ? '40%' :
                          selectedSeason === 'autumn' ? '95%' : '65%'
                        }` 
                      }}
                    />
                  </div>
                  <p className="text-[9px] text-right text-[#78716C] dark:text-zinc-500 italic">
                    {selectedSeason === 'winter' && "Fast winter transit reduces risk"}
                    {selectedSeason === 'autumn' && "Trapped in calms; severe rations crisis"}
                    {selectedSeason === 'summer' && "Standard summer middle passage duration"}
                    {selectedSeason === 'spring' && "Typical spring navigation time"}
                  </p>
                </div>

                {/* Mortality Rate Gradient */}
                <div className="p-2 rounded-xl bg-[#FDFBF7] dark:bg-zinc-900 border border-[#DCD3C1] dark:border-zinc-800 text-xs">
                  <p className="text-[9px] text-[#78716C] dark:text-zinc-500 font-mono uppercase">Expected Mortality Gradient</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className={`text-lg font-black ${
                      selectedSeason === 'winter' ? 'text-emerald-600' :
                      selectedSeason === 'autumn' ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      {(selectedRoute.avgMortalityRate + (
                        selectedSeason === 'summer' ? 0.5 :
                        selectedSeason === 'autumn' ? 4.0 :
                        selectedSeason === 'winter' ? -1.8 : 1.0
                      )).toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-[#78716C] dark:text-zinc-500">
                      (Baseline: {selectedRoute.avgMortalityRate}%)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-[#78716C] dark:text-zinc-500 italic">
                Hover or click any transatlantic flow arc to inspect simulated crossing durations and mortality gradients under the active meteorological forces.
              </p>
            )}
          </div>

          {/* Real-Time Hydrodynamic Vector Stream Diagnostic Card */}
          <div className="p-3 rounded-2xl bg-white dark:bg-zinc-950 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                <span>Hydrodynamic Stream Engine</span>
              </span>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold">
                {SEASONAL_HYDRO_METRICS[mapCalendarSeasonToHydro(selectedSeason)].quarterLabel.split(' ')[0]}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono pt-1">
              <div className="p-1.5 rounded-lg bg-[#FAF6EE] dark:bg-zinc-900 border border-[#DCD3C1] dark:border-zinc-800">
                <span className="text-stone-500 dark:text-stone-400 block text-[9px]">Wind Speed</span>
                <strong className="text-cyan-800 dark:text-cyan-300 text-[10.5px] leading-tight block">
                  {SEASONAL_HYDRO_METRICS[mapCalendarSeasonToHydro(selectedSeason)].tastCorrelations.windSpeedDisplay}
                </strong>
              </div>
              <div className="p-1.5 rounded-lg bg-[#FAF6EE] dark:bg-zinc-900 border border-[#DCD3C1] dark:border-zinc-800">
                <span className="text-stone-500 dark:text-stone-400 block text-[9px]">Hold Temp &amp; Sickness</span>
                <strong className="text-rose-700 dark:text-rose-300 text-[10.5px] leading-tight block">
                  {SEASONAL_HYDRO_METRICS[mapCalendarSeasonToHydro(selectedSeason)].tastCorrelations.holdTemperature}
                </strong>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-[#FAF6EE] dark:bg-zinc-900 border border-[#DCD3C1] dark:border-zinc-800 text-[10.5px] font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Mortality Rate:</span>
                <strong className="text-rose-600 dark:text-rose-400 font-bold">
                  {SEASONAL_HYDRO_METRICS[mapCalendarSeasonToHydro(selectedSeason)].tastCorrelations.mortalityRate}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Trade Volume:</span>
                <strong className="text-amber-700 dark:text-amber-300 font-bold">
                  {SEASONAL_HYDRO_METRICS[mapCalendarSeasonToHydro(selectedSeason)].tastCorrelations.departureShare}
                </strong>
              </div>
            </div>

            <p className="text-[10px] text-stone-600 dark:text-stone-400 leading-tight">
              {SEASONAL_HYDRO_METRICS[mapCalendarSeasonToHydro(selectedSeason)].tastCorrelations.climateImpactNote}
            </p>

            {onNavigateToCartography && (
              <button
                onClick={onNavigateToCartography}
                className="w-full mt-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Open Cartography GIS Lab ➔</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Temporal Timeline Controller / Scrubber */}
      <div className="p-4 bg-[#FAF6EE] dark:bg-zinc-900 border-t border-[#DCD3C1] dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 text-xs shrink-0"
            title={isPlaying ? 'Pause timeline animation' : 'Play timeline animation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Flow'}</span>
          </button>

          <button
            onClick={() => {
              setPlaybackYear(1520);
              if (onYearChange) onYearChange(1520);
            }}
            className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-[#F5EFE1] dark:hover:bg-zinc-700 text-[#57534E] dark:text-zinc-300 border border-[#DCD3C1] dark:border-zinc-700 transition-all cursor-pointer text-xs shrink-0 shadow-xs"
            title="Reset to 1520"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="font-mono text-sm font-black text-[#9A3412] dark:text-emerald-400 bg-white dark:bg-zinc-950 px-3 py-1.5 rounded-xl border border-[#DCD3C1] dark:border-zinc-800 shrink-0 shadow-xs">
            Year: {playbackYear}
          </div>
        </div>

        {/* Interactive Scrub Slider */}
        <div className="flex-1 w-full flex items-center gap-3">
          <span className="text-xs font-mono text-[#78716C] dark:text-zinc-500 font-bold">1514</span>
          <input
            type="range"
            min={1514}
            max={1866}
            step={1}
            value={playbackYear}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setPlaybackYear(val);
              if (onYearChange) onYearChange(val);
            }}
            className="w-full accent-[#C2410C] h-2 bg-[#E8DFCE] dark:bg-zinc-800 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono text-[#78716C] dark:text-zinc-500 font-bold">1866</span>
        </div>

        {/* Mortality Rate Visual Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-[#78716C] dark:text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-[#57534E] dark:text-zinc-400 font-semibold">&lt;12% Mortality</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[#57534E] dark:text-zinc-400 font-semibold">12–15%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span className="text-[#57534E] dark:text-zinc-400 font-semibold">&gt;15% Severe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
