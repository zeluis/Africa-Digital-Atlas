import React, { useState, useEffect } from 'react';
import { REGIONAL_ROUTE_FLOWS } from '../../data/slaveVoyagesData';
import { RegionalRouteFlow, EpistemicMode } from '../../data/slaveVoyagesTypes';
import { 
  Play, Pause, RotateCcw, Layers, Compass, Wind, Eye, EyeOff, MapPin, Sparkles, Navigation
} from 'lucide-react';
import {
  projectCoord,
  AFRICA_PATH,
  MADAGASCAR_PATH,
  SOUTH_AMERICA_PATH,
  NORTH_AMERICA_PATH,
  CUBA_PATH,
  HISPANIOLA_PATH,
  JAMAICA_PATH,
  PUERTO_RICO_PATH,
  BAHAMAS_PATH,
  EUROPE_MAINLAND_PATH,
  GREAT_BRITAIN_PATH,
  IRELAND_PATH,
  EMBARKATION_ZONES,
  TRADE_WINDS,
  TradeWindVector
} from './atlanticMapGeometry';

interface AtlanticFlowMapProps {
  epistemicMode: EpistemicMode;
  selectedRouteId?: string;
  onSelectRoute?: (route: RegionalRouteFlow) => void;
  yearRange?: [number, number];
  onYearChange?: (year: number) => void;
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
  onYearChange
}) => {
  const [hoveredRoute, setHoveredRoute] = useState<RegionalRouteFlow | null>(null);
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);
  const [hoveredWind, setHoveredWind] = useState<TradeWindVector | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackYear, setPlaybackYear] = useState(1750);
  
  // Layer toggles
  const [showContinents, setShowContinents] = useState(true);
  const [showGraticule, setShowGraticule] = useState(true);
  const [showTradeWinds, setShowTradeWinds] = useState(true);
  const [showMortalityColors, setShowMortalityColors] = useState(true);
  const [showPorts, setShowPorts] = useState(true);
  const [destinationFilter, setDestinationFilter] = useState<'all' | 'Brazil' | 'British Caribbean' | 'French Caribbean' | 'Spanish Americas' | 'North America'>('all');

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
    if (!showMortalityColors) return '#10b981'; // Emerald default
    if (mortality < 12.0) return '#10b981'; // Low mortality (<12%)
    if (mortality < 15.0) return '#f59e0b'; // Medium mortality (12-15%)
    return '#f43f5e'; // High mortality (>15%)
  };

  const getMortalityGlow = (mortality: number) => {
    if (!showMortalityColors) return 'rgba(16, 185, 129, 0.4)';
    if (mortality < 12.0) return 'rgba(16, 185, 129, 0.5)';
    if (mortality < 15.0) return 'rgba(245, 158, 11, 0.5)';
    return 'rgba(244, 63, 94, 0.6)';
  };

  // Filter routes based on selected corridor preset
  const filteredRoutes = REGIONAL_ROUTE_FLOWS.filter(r => {
    if (destinationFilter === 'all') return true;
    return r.targetRegion.toLowerCase().includes(destinationFilter.toLowerCase());
  });

  return (
    <div className="relative w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white overflow-hidden shadow-2xl select-none">
      {/* Map Header & Controls */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-zinc-900/95 border-b border-zinc-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-inner">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-zinc-100 tracking-tight flex items-center gap-2">
                <span>Interactive Atlantic Geodesic Flow Network</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600/60 text-[10px] font-mono text-emerald-400 font-bold">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  1514–1866 Canonical System
                </span>
              </h3>
            </div>
            <p className="text-xs text-zinc-400">
              Middle Passage Geodesic Arcs • Volume-scaled bandwidth • Middle Passage mortality heatmap
            </p>
          </div>
        </div>

        {/* Interactive Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowContinents(!showContinents)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
              showContinents
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
            }`}
            title="Toggle Continental Silhouettes"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Continents: {showContinents ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowGraticule(!showGraticule)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
              showGraticule
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
            }`}
            title="Toggle Latitude / Longitude & Tropics Axis Grid"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Axis & Tropics: {showGraticule ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowTradeWinds(!showTradeWinds)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
              showTradeWinds
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
            }`}
            title="Toggle Northeast & Southeast Trade Wind vectors"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Trade Winds: {showTradeWinds ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowMortalityColors(!showMortalityColors)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
              showMortalityColors
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
            }`}
          >
            <span>Mortality Colors: {showMortalityColors ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowPorts(!showPorts)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
              showPorts
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Ports: {showPorts ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Destination Quick Filters Bar */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 py-2 bg-zinc-950 border-b border-zinc-800/80 text-xs font-mono">
        <span className="text-zinc-400 mr-1 text-[11px] font-bold uppercase tracking-wider">Major Corridors:</span>
        {(['all', 'Brazil', 'British Caribbean', 'French Caribbean', 'Spanish Americas', 'North America'] as const).map(corridor => (
          <button
            key={corridor}
            onClick={() => setDestinationFilter(corridor)}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px] font-bold ${
              destinationFilter === corridor
                ? 'bg-emerald-500 text-zinc-950 shadow-md font-extrabold'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
            }`}
          >
            {corridor === 'all' ? 'All Corridors (12.5M Captives)' : corridor}
          </button>
        ))}
      </div>

      {/* Main SVG Vector Canvas */}
      <div className="relative w-full aspect-[16/9] min-h-[420px] max-h-[620px] bg-[#020617] flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 1000 580"
          className="w-full h-full object-contain"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Rich Bathymetric Ocean Gradient */}
            <radialGradient id="oceanDeep" cx="48%" cy="46%" r="58%">
              <stop offset="0%" stopColor="#082f49" stopOpacity="0.7" />
              <stop offset="45%" stopColor="#041f2d" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#020617" stopOpacity="1" />
            </radialGradient>

            {/* High-Contrast Continental Landmass Gradients */}
            <linearGradient id="africaLand" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="50%" stopColor="#043828" />
              <stop offset="100%" stopColor="#022116" />
            </linearGradient>

            <linearGradient id="americasLand" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="50%" stopColor="#15293d" />
              <stop offset="100%" stopColor="#0b1724" />
            </linearGradient>

            <linearGradient id="europeLand" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="50%" stopColor="#2e1405" />
              <stop offset="100%" stopColor="#1c0b02" />
            </linearGradient>

            {/* Coastal Shelf Bathymetric Glow */}
            <filter id="coastGlow" x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Flow Path Glow Filter */}
            <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Port Pulse Glow Filter */}
            <filter id="portGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Pattern for Graticule minor subdivisions */}
            <pattern id="graticuleDots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.75" fill="#38bdf8" opacity="0.25" />
            </pattern>
          </defs>

          {/* 1. Canvas Deep Ocean Background */}
          <rect width="1000" height="580" fill="url(#oceanDeep)" />
          <rect width="1000" height="580" fill="url(#graticuleDots)" opacity="0.5" />

          {/* 2. Nautical Portolan Rhumb Lines (Radiating from Mid-Atlantic Compass Center) */}
          <g opacity="0.16" stroke="#38bdf8" strokeWidth="0.6">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
              const rad = (deg * Math.PI) / 180;
              const cx = 490;
              const cy = 190;
              const x2 = cx + 850 * Math.cos(rad);
              const y2 = cy + 850 * Math.sin(rad);
              return <line key={`rhumb-${deg}`} x1={cx} y1={cy} x2={x2} y2={y2} strokeDasharray="3 6" />;
            })}
          </g>

          {/* 3. Coordinate Graticule Grid & Major Astronomical Indicators */}
          {showGraticule && (
            <g className="graticule-layer">
              {/* Longitude Grid Lines */}
              {[-100, -80, -60, -40, -20, 0, 20, 40].map(lng => {
                const [x] = projectCoord(0, lng);
                const isPrime = lng === 0;
                return (
                  <g key={`lng-${lng}`}>
                    <line
                      x1={x}
                      y1="18"
                      x2={x}
                      y2="562"
                      stroke={isPrime ? '#38bdf8' : '#475569'}
                      strokeWidth={isPrime ? '2' : '0.9'}
                      strokeDasharray={isPrime ? 'none' : '4 4'}
                      opacity={isPrime ? '0.9' : '0.6'}
                    />
                    {/* Top & Bottom Longitude Labels */}
                    <g transform={`translate(${x}, 12)`}>
                      <rect x="-24" y="-10" width="48" height="13" rx="2" fill="#020617" stroke={isPrime ? '#38bdf8' : '#334155'} strokeWidth="0.8" opacity="0.9" />
                      <text
                        x="0"
                        y="-1"
                        textAnchor="middle"
                        fill={isPrime ? '#38bdf8' : '#cbd5e1'}
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {lng > 0 ? `${lng}°E` : lng < 0 ? `${Math.abs(lng)}°W` : '0° PRIME'}
                      </text>
                    </g>
                    <g transform={`translate(${x}, 572)`}>
                      <rect x="-24" y="-7" width="48" height="13" rx="2" fill="#020617" stroke={isPrime ? '#38bdf8' : '#334155'} strokeWidth="0.8" opacity="0.9" />
                      <text
                        x="0"
                        y="2.5"
                        textAnchor="middle"
                        fill={isPrime ? '#38bdf8' : '#cbd5e1'}
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {lng > 0 ? `${lng}°E` : lng < 0 ? `${Math.abs(lng)}°W` : '0° PRIME'}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Latitude Grid Lines */}
              {[50, 40, 30, 20, 10, 0, -10, -20, -30].map(lat => {
                const [, y] = projectCoord(lat, 0);
                const isEquator = lat === 0;
                return (
                  <g key={`lat-${lat}`}>
                    <line
                      x1="22"
                      y1={y}
                      x2="978"
                      y2={y}
                      stroke={isEquator ? '#10b981' : '#475569'}
                      strokeWidth={isEquator ? '2.2' : '0.9'}
                      strokeDasharray={isEquator ? 'none' : '4 4'}
                      opacity={isEquator ? '0.95' : '0.6'}
                    />
                    {/* Left & Right Latitude Axis Labels */}
                    <g transform={`translate(16, ${y})`}>
                      <rect x="-14" y="-7" width="18" height="14" rx="2" fill="#020617" stroke={isEquator ? '#10b981' : '#334155'} strokeWidth="0.8" opacity="0.9" />
                      <text
                        x="-5"
                        y="3"
                        textAnchor="middle"
                        fill={isEquator ? '#10b981' : '#cbd5e1'}
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {lat > 0 ? `${lat}°N` : lat < 0 ? `${Math.abs(lat)}°S` : '0°'}
                      </text>
                    </g>
                    <g transform={`translate(984, ${y})`}>
                      <rect x="-4" y="-7" width="18" height="14" rx="2" fill="#020617" stroke={isEquator ? '#10b981' : '#334155'} strokeWidth="0.8" opacity="0.9" />
                      <text
                        x="5"
                        y="3"
                        textAnchor="middle"
                        fill={isEquator ? '#10b981' : '#cbd5e1'}
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {lat > 0 ? `${lat}°N` : lat < 0 ? `${Math.abs(lat)}°S` : '0°'}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* EQUATOR (0°) Prominent Badge */}
              {(() => {
                const [, eqY] = projectCoord(0, 0);
                return (
                  <g transform={`translate(430, ${eqY - 10})`}>
                    <rect width="138" height="20" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" opacity="0.95" />
                    <text x="69" y="14" textAnchor="middle" fill="#ecfdf5" fontSize="9" fontFamily="monospace" fontWeight="900" letterSpacing="1">
                      ☀️ EQUATOR 0° • EQUINOX
                    </text>
                  </g>
                );
              })()}

              {/* TROPIC OF CANCER (23.43°N) Line & Badge */}
              {(() => {
                const [, canY] = projectCoord(23.43, 0);
                return (
                  <g>
                    <line x1="22" y1={canY} x2="978" y2={canY} stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="6 4" opacity="0.85" />
                    <g transform={`translate(28, ${canY - 9})`}>
                      <rect width="185" height="17" rx="4" fill="#451a03" stroke="#f59e0b" strokeWidth="1" opacity="0.95" />
                      <text x="92.5" y="12" textAnchor="middle" fill="#fef3c7" fontSize="8" fontFamily="monospace" fontWeight="800">
                        ☀️ TROPIC OF CANCER 23.4°N (SOLSTICE)
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* TROPIC OF CAPRICORN (23.43°S) Line & Badge */}
              {(() => {
                const [, capY] = projectCoord(-23.43, 0);
                return (
                  <g>
                    <line x1="22" y1={capY} x2="978" y2={capY} stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="6 4" opacity="0.85" />
                    <g transform={`translate(28, ${capY - 9})`}>
                      <rect width="195" height="17" rx="4" fill="#451a03" stroke="#f59e0b" strokeWidth="1" opacity="0.95" />
                      <text x="97.5" y="12" textAnchor="middle" fill="#fef3c7" fontSize="8" fontFamily="monospace" fontWeight="800">
                        ☀️ TROPIC OF CAPRICORN 23.4°S (SOLSTICE)
                      </text>
                    </g>
                  </g>
                );
              })()}
            </g>
          )}

          {/* 4. CLEAR CONTINENT LANDMASSES (High-Contrast Cartographic Vectors) */}
          {showContinents && (
            <g className="continental-landmass-layer">
              {/* SOUTH AMERICA */}
              <path
                d={SOUTH_AMERICA_PATH}
                fill="url(#americasLand)"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinejoin="round"
                className="transition-colors hover:brightness-125"
                filter="url(#coastGlow)"
              />

              {/* NORTH AMERICA & CENTRAL AMERICA */}
              <path
                d={NORTH_AMERICA_PATH}
                fill="url(#americasLand)"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeLinejoin="round"
                className="transition-colors hover:brightness-125"
                filter="url(#coastGlow)"
              />

              {/* CARIBBEAN ARCHIPELAGO (Cuba, Hispaniola, Jamaica, Puerto Rico, Bahamas) */}
              <path d={CUBA_PATH} fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
              <path d={HISPANIOLA_PATH} fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
              <path d={JAMAICA_PATH} fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
              <path d={PUERTO_RICO_PATH} fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
              <path d={BAHAMAS_PATH} fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />

              {/* MAINLAND WESTERN EUROPE (Iberia, France, Low Countries) */}
              <path
                d={EUROPE_MAINLAND_PATH}
                fill="url(#europeLand)"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinejoin="round"
                filter="url(#coastGlow)"
              />

              {/* BRITISH ISLES & IRELAND */}
              <path d={GREAT_BRITAIN_PATH} fill="url(#europeLand)" stroke="#fbbf24" strokeWidth="1.6" />
              <path d={IRELAND_PATH} fill="url(#europeLand)" stroke="#fbbf24" strokeWidth="1.6" />

              {/* AFRICAN CONTINENT (Detailed High-Fidelity Silhouette with Emerald Coastline) */}
              <path
                d={AFRICA_PATH}
                fill="url(#africaLand)"
                stroke="#10b981"
                strokeWidth="2.4"
                strokeLinejoin="round"
                filter="url(#coastGlow)"
                className="transition-all"
              />

              {/* MADAGASCAR */}
              <path
                d={MADAGASCAR_PATH}
                fill="url(#africaLand)"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinejoin="round"
                filter="url(#coastGlow)"
              />

              {/* Major Continental Topographic Typography Labels */}
              <text x="730" y="240" fill="#ecfdf5" fontSize="20" fontFamily="serif" fontWeight="900" letterSpacing="4" opacity="0.95" className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                AFRICA
              </text>
              <text x="735" y="260" fill="#34d399" fontSize="9.5" fontFamily="monospace" fontWeight="bold" letterSpacing="2" opacity="0.95" className="pointer-events-none drop-shadow">
                12.5M CAPTIVES EMBARKED
              </text>

              <text x="260" y="420" fill="#e0f2fe" fontSize="16" fontFamily="serif" fontWeight="900" letterSpacing="3" opacity="0.9" className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                SOUTH AMERICA
              </text>
              <text x="270" y="438" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="1.5" opacity="0.95" className="pointer-events-none drop-shadow">
                BRAZIL (5.1M ARRIVALS)
              </text>

              <text x="70" y="90" fill="#e0f2fe" fontSize="15" fontFamily="serif" fontWeight="900" letterSpacing="3" opacity="0.9" className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                NORTH AMERICA
              </text>

              <text x="690" y="80" fill="#fef3c7" fontSize="13" fontFamily="serif" fontWeight="900" letterSpacing="3" opacity="0.9" className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                EUROPE
              </text>

              {/* Oceanic Body Labels */}
              <text x="410" y="140" fill="#38bdf8" fontSize="11" fontFamily="serif" fontStyle="italic" fontWeight="600" letterSpacing="4" opacity="0.55" className="pointer-events-none">
                NORTH ATLANTIC OCEAN
              </text>
              <text x="480" y="440" fill="#38bdf8" fontSize="11" fontFamily="serif" fontStyle="italic" fontWeight="600" letterSpacing="4" opacity="0.55" className="pointer-events-none">
                SOUTH ATLANTIC OCEAN
              </text>
              <text x="595" y="340" fill="#10b981" fontSize="9.5" fontFamily="serif" fontStyle="italic" fontWeight="600" letterSpacing="2" opacity="0.75" className="pointer-events-none">
                GULF OF GUINEA
              </text>
              <text x="175" y="270" fill="#38bdf8" fontSize="9.5" fontFamily="serif" fontStyle="italic" fontWeight="600" letterSpacing="2" opacity="0.75" className="pointer-events-none">
                CARIBBEAN SEA
              </text>
            </g>
          )}

          {/* 5. HISTORICAL AFRICAN EMBARKATION COASTAL ZONES (Interactive Coastline Highlights) */}
          <g className="embarkation-zones-layer">
            {EMBARKATION_ZONES.map(zone => {
              const [cx, cy] = projectCoord(zone.center[0], zone.center[1]);
              return (
                <g key={zone.id} className="group cursor-pointer">
                  {/* Subtle glowing halo along the coast */}
                  <circle cx={cx} cy={cy} r="18" fill={zone.color} fillOpacity="0.12" stroke={zone.color} strokeWidth="1" strokeDasharray="2 3" />
                  <circle cx={cx} cy={cy} r="4" fill={zone.color} stroke="#020617" strokeWidth="1.5" />
                  
                  {/* Zone text pill */}
                  <text
                    x={cx + 8}
                    y={cy - 4}
                    fill="#ffffff"
                    fontSize="8.5"
                    fontFamily="sans-serif"
                    fontWeight="800"
                    className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                  >
                    {zone.name.split(' (')[0]}
                  </text>
                  <text
                    x={cx + 8}
                    y={cy + 6}
                    fill={zone.color}
                    fontSize="7.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                  >
                    {zone.captiveShare}
                  </text>
                </g>
              );
            })}
          </g>

          {/* 6. HISTORICAL TRADE WINDS & OCEAN CURRENTS */}
          {showTradeWinds && (
            <g className="trade-winds-layer">
              {TRADE_WINDS.map(wind => {
                const [x1, y1] = projectCoord(wind.startLat, wind.startLng);
                const [cx, cy] = projectCoord(wind.ctrlLat, wind.ctrlLng);
                const [x2, y2] = projectCoord(wind.endLat, wind.endLng);
                const pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

                return (
                  <g
                    key={wind.id}
                    className="cursor-pointer transition-opacity"
                    onMouseEnter={() => setHoveredWind(wind)}
                    onMouseLeave={() => setHoveredWind(null)}
                  >
                    {/* Broad background breeze swath */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={wind.color}
                      strokeWidth="12"
                      strokeOpacity="0.08"
                      strokeLinecap="round"
                    />
                    {/* Primary Wind Stream */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={wind.color}
                      strokeWidth="2"
                      strokeDasharray="6 8"
                      strokeOpacity="0.65"
                      strokeLinecap="round"
                    />
                    {/* Animated moving particles */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeDasharray="3 20"
                      strokeOpacity="0.85"
                      className="animate-pulse"
                    />
                    {/* Wind Vector Label along midpoint */}
                    <text
                      x={cx}
                      y={cy - 6}
                      textAnchor="middle"
                      fill={wind.color}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="drop-shadow pointer-events-none"
                    >
                      {wind.name.split(' (')[0]}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 7. GEODESIC FLOW ARCS (Trans-Atlantic Captive Corridors) */}
          <g className="geodesic-flows-layer">
            {filteredRoutes.map((route) => {
              const [x1, y1] = projectCoord(route.sourceCoords[0], route.sourceCoords[1]);
              const [x2, y2] = projectCoord(route.targetCoords[0], route.targetCoords[1]);

              // Arc midpoint bezier curvature (higher curvature towards the equator)
              const midX = (x1 + x2) / 2 + (y1 - y2) * 0.16;
              const midY = (y1 + y2) / 2 - Math.abs(x1 - x2) * 0.14;

              const isHovered = hoveredRoute?.id === route.id;
              const isSelected = selectedRouteId === route.id;

              // Volume scaling (2.5px to 16px bandwidth)
              const volumeWidth = Math.max(2.5, Math.min(16, (route.embarkedCount / 5694200) * 16));
              const strokeColor = getMortalityStroke(route.avgMortalityRate);
              const glowColor = getMortalityGlow(route.avgMortalityRate);

              return (
                <g 
                  key={route.id}
                  className="cursor-pointer transition-all duration-300 group"
                  onClick={() => onSelectRoute && onSelectRoute(route)}
                  onMouseEnter={() => setHoveredRoute(route)}
                  onMouseLeave={() => setHoveredRoute(null)}
                >
                  {/* Radiant Glow halo for active / hovered route */}
                  {(isHovered || isSelected) && (
                    <path
                      d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={volumeWidth + 12}
                      strokeOpacity="0.45"
                      filter="url(#routeGlow)"
                    />
                  )}

                  {/* Primary Luminous Flow Band */}
                  <path
                    d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isHovered ? volumeWidth + 3 : volumeWidth}
                    strokeOpacity={isHovered || isSelected ? 0.95 : 0.72}
                    strokeLinecap="round"
                    className="transition-all duration-200"
                  />

                  {/* High-speed Directional Flow Particles (Westward movement towards Americas) */}
                  <path
                    d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={Math.max(1.8, volumeWidth * 0.45)}
                    strokeDasharray="5 18"
                    strokeOpacity={isHovered ? 1 : 0.8}
                    className="animate-pulse"
                  />

                  {/* Flow Volume Marker at Midpoint */}
                  {(isHovered || isSelected || route.embarkedCount > 1500000) && (
                    <g transform={`translate(${midX}, ${midY})`} className="pointer-events-none">
                      <rect x="-30" y="-9" width="60" height="18" rx="4" fill="#020617" stroke={strokeColor} strokeWidth="1.2" opacity="0.92" />
                      <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="900">
                        {(route.embarkedCount / 1000000).toFixed(2)}M
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* 8. COASTAL ANCHOR PORT PINS (Origins & Destinations) */}
          {showPorts && (
            <g className="coastal-ports-layer">
              {COASTAL_ANCHORS.map((port, idx) => {
                const [x, y] = projectCoord(port.lat, port.lng);
                const isAfrican = port.type === 'african-port';
                const isAmerican = port.type === 'american-port';
                const isEuropean = port.type === 'european-port';

                const fillColor = isAfrican 
                  ? '#10b981' 
                  : isAmerican 
                    ? '#38bdf8' 
                    : '#f59e0b';

                return (
                  <g 
                    key={`port-${idx}`}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onMouseEnter={() => setHoveredNode(port)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Radiating Beacon Ring */}
                    <circle
                      cx={x}
                      cy={y}
                      r="10"
                      fill="none"
                      stroke={fillColor}
                      strokeWidth="1.2"
                      strokeOpacity="0.5"
                      className="animate-ping"
                      style={{ animationDuration: `${2.2 + (idx % 3) * 0.6}s` }}
                    />

                    {/* Solid Port Node Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r="5.5"
                      fill={fillColor}
                      fillOpacity="0.95"
                      stroke="#020617"
                      strokeWidth="2"
                      filter="url(#portGlow)"
                    />

                    {/* Readable Coastal Port Label */}
                    <text
                      x={x + (isAmerican ? -9 : 9)}
                      y={y + 3.5}
                      textAnchor={isAmerican ? 'end' : 'start'}
                      fill="#f8fafc"
                      fontSize="9.5"
                      fontFamily="sans-serif"
                      fontWeight="700"
                      className="pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,1)]"
                    >
                      {port.name.split(' (')[0]}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 9. ORNATE NAUTICAL COMPASS ROSE / ASTRONOMICAL POLARIS INDICATOR */}
          <g transform="translate(485, 90)" className="compass-rose-layer pointer-events-none">
            {/* Outer Degree Dial */}
            <circle cx="0" cy="0" r="38" fill="#020617" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="32" fill="none" stroke="#f59e0b" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="26" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.6" />
            
            {/* Cardinal Points (N, S, E, W) */}
            <polygon points="0,-32 5,-7 0,0 -5,-7" fill="#10b981" stroke="#052e16" strokeWidth="0.5" />
            <polygon points="0,32 5,7 0,0 -5,7" fill="#065f46" stroke="#052e16" strokeWidth="0.5" />
            <polygon points="32,0 7,5 0,0 7,-5" fill="#0284c7" stroke="#082f49" strokeWidth="0.5" />
            <polygon points="-32,0 -7,5 0,0 -7,-5" fill="#075985" stroke="#082f49" strokeWidth="0.5" />
            
            {/* Intercardinal Points (NE, NW, SE, SW) */}
            <polygon points="22,-22 6,-3 0,0 3,-6" fill="#f59e0b" />
            <polygon points="-22,-22 -3,-6 0,0 -6,-3" fill="#b45309" />
            <polygon points="22,22 3,6 0,0 6,3" fill="#b45309" />
            <polygon points="-22,22 -6,3 0,0 -3,6" fill="#78350f" />

            {/* Center Star Hub */}
            <circle cx="0" cy="0" r="4.5" fill="#f8fafc" stroke="#020617" strokeWidth="1.5" />

            {/* Polaris / North Star Indicator above North point */}
            <g transform="translate(0, -42)">
              <circle cx="0" cy="0" r="8" fill="#fef08a" fillOpacity="0.25" className="animate-ping" style={{ animationDuration: '3s' }} />
              {/* 8-point gold Polaris Star */}
              <polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
            </g>

            {/* Cardinal Labels */}
            <text x="0" y="-48" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="serif" fontWeight="900" className="drop-shadow">
              N • POLARIS
            </text>
            <text x="0" y="48" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="serif" fontWeight="800">
              S
            </text>
            <text x="44" y="3" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="serif" fontWeight="800">
              E
            </text>
            <text x="-44" y="3" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="serif" fontWeight="800">
              W
            </text>
          </g>

          {/* 10. GRAPHICAL NAUTICAL SCALE BAR & CARTOGRAPHIC FRAME */}
          <g transform="translate(32, 532)" className="scale-bar-layer pointer-events-none">
            <rect width="186" height="24" rx="4" fill="#020617" stroke="#334155" strokeWidth="1.2" opacity="0.95" />
            <line x1="15" y1="15" x2="171" y2="15" stroke="#e2e8f0" strokeWidth="2.5" />
            <line x1="15" y1="9" x2="15" y2="18" stroke="#e2e8f0" strokeWidth="2.5" />
            <line x1="93" y1="10" x2="93" y2="18" stroke="#e2e8f0" strokeWidth="1.8" />
            <line x1="171" y1="9" x2="171" y2="18" stroke="#e2e8f0" strokeWidth="2.5" />
            <text x="15" y="8" textAnchor="middle" fill="#cbd5e1" fontSize="7.5" fontFamily="monospace" fontWeight="bold">0</text>
            <text x="93" y="8" textAnchor="middle" fill="#cbd5e1" fontSize="7.5" fontFamily="monospace" fontWeight="bold">500 NM</text>
            <text x="171" y="8" textAnchor="middle" fill="#cbd5e1" fontSize="7.5" fontFamily="monospace" fontWeight="bold">1000 NM (1852 km)</text>
          </g>

          {/* Outer Map Framing Border with Corner Marks */}
          <rect x="18" y="16" width="964" height="548" fill="none" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="22" y="20" width="956" height="540" fill="none" stroke="#0ea5e9" strokeWidth="0.6" opacity="0.4" />
        </svg>

        {/* Floating Route Inspection Tooltip Dossier */}
        {hoveredRoute && (
          <div className="absolute bottom-4 left-4 max-w-sm p-4 rounded-xl bg-zinc-900/95 border border-zinc-700 backdrop-blur-md shadow-2xl space-y-2 pointer-events-none text-left z-20 animate-in fade-in zoom-in duration-100">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-mono text-[10px] uppercase font-bold text-emerald-400">
                Peak Century: {hoveredRoute.peakCentury}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono text-zinc-300">
                {hoveredRoute.voyagesCount.toLocaleString()} documented voyages
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-extrabold text-white">
              <span>{hoveredRoute.sourceRegion}</span>
              <span className="text-emerald-400">➔</span>
              <span>{hoveredRoute.targetRegion}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800">
                <p className="text-[10px] text-zinc-400">Captives Embarked</p>
                <p className="font-bold text-zinc-100">{hoveredRoute.embarkedCount.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800">
                <p className="text-[10px] text-zinc-400">Middle Passage Mortality</p>
                <p className={`font-bold ${hoveredRoute.avgMortalityRate > 15 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {hoveredRoute.avgMortalityRate}%
                </p>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400">
              <strong>Dominant National Carriers:</strong>{' '}
              {hoveredRoute.primaryCarriers.map(c => `${c.carrier} (${c.percentage}%)`).join(', ')}
            </div>
          </div>
        )}

        {/* Floating Port Inspection Tooltip */}
        {hoveredNode && !hoveredRoute && (
          <div className="absolute top-4 right-4 p-3 rounded-xl bg-zinc-900/95 border border-zinc-700 backdrop-blur-md shadow-2xl space-y-1 pointer-events-none text-left z-20">
            <p className="text-[10px] font-mono uppercase text-emerald-400 font-bold">{hoveredNode.region}</p>
            <p className="font-extrabold text-sm text-white">{hoveredNode.name}</p>
            <p className="text-xs text-zinc-300">Documented Volume: <strong className="text-emerald-300">{hoveredNode.volume}</strong></p>
          </div>
        )}

        {/* Floating Trade Wind Inspection Tooltip */}
        {hoveredWind && !hoveredRoute && !hoveredNode && (
          <div className="absolute top-4 right-4 max-w-xs p-3 rounded-xl bg-zinc-900/95 border border-sky-600/40 backdrop-blur-md shadow-2xl space-y-1 pointer-events-none text-left z-20">
            <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold font-mono">
              <Wind className="w-4 h-4" />
              <span>{hoveredWind.name}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{hoveredWind.description}</p>
          </div>
        )}
      </div>

      {/* Temporal Timeline Controller / Scrubber */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 text-xs shrink-0"
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
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all cursor-pointer text-xs shrink-0"
            title="Reset to 1520"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="font-mono text-sm font-black text-emerald-400 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 shrink-0">
            Year: {playbackYear}
          </div>
        </div>

        {/* Interactive Scrub Slider */}
        <div className="flex-1 w-full flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-500">1514</span>
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
            className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono text-zinc-500">1866</span>
        </div>

        {/* Mortality Rate Visual Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>&lt;12% Mortality</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>12–15%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>&gt;15% Severe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
