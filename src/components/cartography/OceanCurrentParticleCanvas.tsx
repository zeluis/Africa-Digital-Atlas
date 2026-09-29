import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  OCEAN_CURRENTS, 
  SEASONAL_WIND_REGIMES, 
  OceanCurrentDef, 
  SeasonalWindRegime 
} from '../../data/archivalCartographyData';
import { 
  Wind, 
  Waves, 
  Info, 
  Play, 
  Pause, 
  Compass, 
  AlertCircle, 
  Anchor,
  Sparkles,
  MapPin,
  Maximize2,
  Gauge,
  Activity
} from 'lucide-react';
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
  INTERNATIONAL_BORDERS_PATH,
  HISTORIC_INTERNAL_BOUNDARIES,
  HISTORIC_RIVERS
} from '../slaveVoyages/atlanticMapGeometry';
import { AfricaVectorContinent } from '../common/AfricaVectorContinent';
import {
  HydrodynamicSeasonId,
  SEASONAL_HYDRO_METRICS,
  evaluateHydrodynamicVector,
  easeInOutCubic
} from '../../services/oceanHydrodynamicsService';

interface OceanCurrentParticleCanvasProps {
  activeSeasonId: HydrodynamicSeasonId;
  showCurrents?: boolean;
  showWinds?: boolean;
  speedMultiplier?: number;
  particleDensity?: 'low' | 'medium' | 'high';
  className?: string;
  onSelectCurrent?: (current: OceanCurrentDef) => void;
}

// Major coastal nodes for visual geographic grounding
export const NAUTICAL_PORTS = [
  { name: 'Senegambia (Gorée)', lat: 14.6708, lng: -17.4381, type: 'african-port', note: 'Canary Current Departure' },
  { name: 'Sierra Leone (Bunce Island)', lat: 8.4844, lng: -13.2344, type: 'african-port', note: 'Windward Coast' },
  { name: 'Gold Coast (Elmina)', lat: 5.1054, lng: -1.2466, type: 'african-port', note: 'Guinea Current Hub' },
  { name: 'Bight of Benin (Ouidah)', lat: 6.3631, lng: 2.0851, type: 'african-port', note: 'Equatorial Flow' },
  { name: 'Biafra (Bonny)', lat: 4.4539, lng: 7.1639, type: 'african-port', note: 'Niger Delta Estuary' },
  { name: 'Luanda (Angola)', lat: -8.8390, lng: 13.2894, type: 'african-port', note: 'Benguela Highway' },
  { name: 'Benguela (São Filipe)', lat: -12.5763, lng: 13.4055, type: 'african-port', note: 'South Atlantic Gyre' },
  { name: 'Cape of Good Hope', lat: -34.3568, lng: 18.4740, type: 'african-port', note: 'Agulhas Confluence' },
  { name: 'Mozambique Channel', lat: -15.0342, lng: 40.7358, type: 'african-port', note: 'Indian Ocean Route' },

  // Disembarkation & Terminal Ports
  { name: 'Salvador da Bahia', lat: -12.9777, lng: -38.5016, type: 'american-port', note: 'Primary Brazil Terminal (32 days)' },
  { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, type: 'american-port', note: 'Valongo Complex (38 days)' },
  { name: 'Recife (Pernambuco)', lat: -8.0476, lng: -34.8770, type: 'american-port', note: 'Nearest American Port (24 days)' },
  { name: 'Kingston (Jamaica)', lat: 17.9712, lng: -76.7936, type: 'american-port', note: 'British Caribbean Hub' },
  { name: 'Bridgetown (Barbados)', lat: 13.0969, lng: -59.6145, type: 'american-port', note: 'Windward Port of Call' },
  { name: 'Cap-Français (Saint-Domingue)', lat: 19.7595, lng: -72.2008, type: 'american-port', note: 'French Caribbean Center' },
  { name: 'Havana (Cuba)', lat: 23.1136, lng: -82.3666, type: 'american-port', note: 'Gulf Stream Gateway' },
  { name: 'Charleston (South Carolina)', lat: 32.7765, lng: -79.9311, type: 'american-port', note: 'North American Seaboard' },

  // European Metropoles
  { name: 'Lisbon (Tagus)', lat: 38.7223, lng: -9.1393, type: 'european-port', note: 'Canary Current Launchpoint' },
  { name: 'Liverpool', lat: 53.4084, lng: -2.9916, type: 'european-port', note: 'North Atlantic Departure' },
  { name: 'Nantes', lat: 47.2184, lng: -1.5536, type: 'european-port', note: 'Loire Estuary Fleet' }
];

export const OceanCurrentParticleCanvas: React.FC<OceanCurrentParticleCanvasProps> = ({
  activeSeasonId,
  showCurrents = true,
  showWinds = true,
  speedMultiplier = 1.0,
  particleDensity = 'medium',
  className = '',
  onSelectCurrent
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hoveredPort, setHoveredPort] = useState<typeof NAUTICAL_PORTS[0] | null>(null);

  // Dynamic references to eliminate full component destruction and context wipes
  const activeSeasonRef = useRef<HydrodynamicSeasonId>(activeSeasonId);
  const prevSeasonRef = useRef<HydrodynamicSeasonId>(activeSeasonId);
  const transitionTimeRef = useRef<number>(1.0); // 0.0 -> 1.0 during transition

  const showCurrentsRef = useRef(showCurrents);
  const showWindsRef = useRef(showWinds);
  const speedMultRef = useRef(speedMultiplier);
  const densityRef = useRef(particleDensity);
  const isPlayingRef = useRef(isPlaying);

  // Synchronize dynamic parameters without tearing down the canvas context
  useEffect(() => {
    if (activeSeasonRef.current !== activeSeasonId) {
      prevSeasonRef.current = activeSeasonRef.current;
      activeSeasonRef.current = activeSeasonId;
      transitionTimeRef.current = 0.0; // Start smooth transition
    }
  }, [activeSeasonId]);

  useEffect(() => {
    showCurrentsRef.current = showCurrents;
  }, [showCurrents]);

  useEffect(() => {
    showWindsRef.current = showWinds;
  }, [showWinds]);

  useEffect(() => {
    speedMultRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    densityRef.current = particleDensity;
  }, [particleDensity]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const activeSeasonMeta = SEASONAL_WIND_REGIMES.find(s => s.id === activeSeasonId) || SEASONAL_WIND_REGIMES[0];
  const activeHydroMetrics = SEASONAL_HYDRO_METRICS[activeSeasonId];

  // Persistent Particle Animation Loop (Mounted ONCE)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const VIRTUAL_WIDTH = 1000;
    const VIRTUAL_HEIGHT = 580;

    // Buffer dimensions
    const maxParticles = 960;
    // Flat buffer: 8 floats per particle -> [x, y, vx, vy, age, maxAge, targetVx, targetVy]
    const particles = new Float32Array(maxParticles * 8);

    // Initial random distribution
    for (let i = 0; i < maxParticles; i++) {
      const idx = i * 8;
      particles[idx] = Math.random() * VIRTUAL_WIDTH;
      particles[idx + 1] = Math.random() * VIRTUAL_HEIGHT;
      const vec = evaluateHydrodynamicVector(
        particles[idx], 
        particles[idx + 1], 
        activeSeasonRef.current,
        showCurrentsRef.current,
        showWindsRef.current
      );
      particles[idx + 2] = vec.vx;
      particles[idx + 3] = vec.vy;
      particles[idx + 4] = Math.random() * 90;
      particles[idx + 5] = 90 + Math.random() * 90;
      particles[idx + 6] = vec.vx;
      particles[idx + 7] = vec.vy;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      const displayWidth = canvas.parentElement.clientWidth;
      const displayHeight = canvas.parentElement.clientHeight;
      if (displayWidth === 0 || displayHeight === 0) return;
      
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale((displayWidth / VIRTUAL_WIDTH) * dpr, (displayHeight / VIRTUAL_HEIGHT) * dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastTime = performance.now();

    const render = (now: number) => {
      animFrameIdRef.current = requestAnimationFrame(render);

      if (!isPlayingRef.current || !isVisibleRef.current) {
        lastTime = now;
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.04);
      lastTime = now;

      // Advance smooth seasonal transition (lasts ~550ms)
      if (transitionTimeRef.current < 1.0) {
        transitionTimeRef.current = Math.min(1.0, transitionTimeRef.current + dt * 1.85);
      }
      const transitionProgress = easeInOutCubic(transitionTimeRef.current);

      // Determine active particle limit based on density setting and seasonal activity ratio
      const density = densityRef.current;
      const baseCount = density === 'low' ? 380 : density === 'high' ? 950 : 620;
      
      const prevMetrics = SEASONAL_HYDRO_METRICS[prevSeasonRef.current];
      const targetMetrics = SEASONAL_HYDRO_METRICS[activeSeasonRef.current];

      // Interpolate seasonal characteristics
      const curSpeedFactor = prevMetrics.speedFactor * (1 - transitionProgress) + targetMetrics.speedFactor * transitionProgress;
      const curTrailScale = prevMetrics.trailScale * (1 - transitionProgress) + targetMetrics.trailScale * transitionProgress;
      const curActiveRatio = prevMetrics.activeRatio * (1 - transitionProgress) + targetMetrics.activeRatio * transitionProgress;

      const activeParticleLimit = Math.floor(baseCount * curActiveRatio);
      const effectiveSpeed = curSpeedFactor * speedMultRef.current;

      // Clear virtual canvas frame
      ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      for (let i = 0; i < maxParticles; i++) {
        const idx = i * 8;
        const px = particles[idx];
        const py = particles[idx + 1];
        const age = particles[idx + 4];
        const maxAge = particles[idx + 5];

        // Evaluate flow vector with smooth interpolation between seasons
        const vecPrev = evaluateHydrodynamicVector(px, py, prevSeasonRef.current, showCurrentsRef.current, showWindsRef.current);
        const vecTarget = evaluateHydrodynamicVector(px, py, activeSeasonRef.current, showCurrentsRef.current, showWindsRef.current);

        const targetVx = vecPrev.vx * (1 - transitionProgress) + vecTarget.vx * transitionProgress;
        const targetVy = vecPrev.vy * (1 - transitionProgress) + vecTarget.vy * transitionProgress;
        const force = vecPrev.force * (1 - transitionProgress) + vecTarget.force * transitionProgress;
        const type = transitionProgress > 0.5 ? vecTarget.type : vecPrev.type;
        const isWarm = transitionProgress > 0.5 ? vecTarget.isWarm : vecPrev.isWarm;

        // Smooth velocity blending (eliminates snapping)
        particles[idx + 2] = particles[idx + 2] * 0.90 + targetVx * 0.10;
        particles[idx + 3] = particles[idx + 3] * 0.90 + targetVy * 0.10;

        const nextX = px + particles[idx + 2] * effectiveSpeed * (dt * 60);
        const nextY = py + particles[idx + 3] * effectiveSpeed * (dt * 60);

        // Only draw particles within the active limit
        if (i < activeParticleLimit) {
          const lifeRatio = age / maxAge;
          const lifeAlpha = Math.sin(lifeRatio * Math.PI);
          const alpha = Math.max(0, Math.min(1, lifeAlpha * 0.92));

          // Distinctive seasonal styling & widths
          if (type === 1) {
            // Ocean Current
            ctx.strokeStyle = isWarm
              ? `rgba(251, 191, 36, ${alpha * 0.95})` // Warm Equatorial Amber/Gold
              : `rgba(56, 189, 248, ${alpha * 0.95})`; // Cold Upwelling Sky Blue
            ctx.lineWidth = Math.max(1.0, curTrailScale * (0.8 + force * 0.35));
          } else if (type === 2) {
            // Trade Wind Streak
            ctx.strokeStyle = `rgba(224, 242, 254, ${alpha * 0.88})`;
            ctx.lineWidth = Math.max(0.8, curTrailScale * 0.55 * (0.8 + force * 0.3));
          } else {
            // Ambient Drift
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 0.35})`;
            ctx.lineWidth = 0.8;
          }

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }

        // Update particle state
        particles[idx] = nextX;
        particles[idx + 1] = nextY;
        particles[idx + 4] = age + 1;

        // Respawn gracefully when expired or out of bounds
        if (age >= maxAge || nextX < -10 || nextX > VIRTUAL_WIDTH + 10 || nextY < -10 || nextY > VIRTUAL_HEIGHT + 10) {
          particles[idx] = Math.random() * VIRTUAL_WIDTH;
          particles[idx + 1] = Math.random() * VIRTUAL_HEIGHT;
          particles[idx + 4] = 0;
          particles[idx + 5] = 75 + Math.random() * 85;
          const newVec = evaluateHydrodynamicVector(particles[idx], particles[idx + 1], activeSeasonRef.current, showCurrentsRef.current, showWindsRef.current);
          particles[idx + 2] = newVec.vx;
          particles[idx + 3] = newVec.vy;
        }
      }
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []); // Run ONCE on mount

  // Viewport visibility observer to avoid GPU cycles when out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-[580px] sm:h-[660px] overflow-hidden bg-[#070D18] rounded-3xl select-none border border-slate-800 shadow-2xl ${className}`}>
      {/* 1. Universal Atlantic Basin Vector Map SVG Layer */}
      <svg
        viewBox="0 0 1000 580"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Deep Ocean Bathymetric Radial Glow */}
          <radialGradient id="hydroOceanGlow" cx="45%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#0F1D36" />
            <stop offset="60%" stopColor="#081020" />
            <stop offset="100%" stopColor="#040812" />
          </radialGradient>

          {/* Graticule pattern */}
          <pattern id="hydroGraticuleGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.6" />
          </pattern>

          {/* Landmass Linear Shading */}
          <linearGradient id="hydroLandShading" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Americas land */}
          <linearGradient id="hydroAmericasLand" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#182438" />
            <stop offset="100%" stopColor="#0D1524" />
          </linearGradient>

          {/* Europe land */}
          <linearGradient id="hydroEuropeLand" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#111A2C" />
          </linearGradient>
        </defs>

        {/* Ocean Background */}
        <rect width="1000" height="580" fill="url(#hydroOceanGlow)" />
        <rect width="1000" height="580" fill="url(#hydroGraticuleGrid)" opacity="0.6" />

        {/* Portolan Rhumb Lines (Radiating from Mid-Atlantic Compass Center) */}
        <g opacity="0.18" stroke="#38BDF8" strokeWidth="0.6">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
            const rad = (deg * Math.PI) / 180;
            const cx = 490;
            const cy = 290;
            const x2 = cx + 850 * Math.cos(rad);
            const y2 = cy + 850 * Math.sin(rad);
            return <line key={`hydro-rhumb-${deg}`} x1={cx} y1={cy} x2={x2} y2={y2} strokeDasharray="3 6" />;
          })}
        </g>

        {/* Equator & Tropics Hairline Guides */}
        <g stroke="#334155" strokeWidth="0.8" strokeDasharray="4,4" opacity="0.75">
          {/* Equator (0° -> y = 346.25) */}
          <line x1="0" y1="346" x2="1000" y2="346" stroke="#0284c7" strokeWidth="1" opacity="0.6" />
          <text x="24" y="341" fill="#38BDF8" fontSize="9" fontFamily="monospace" opacity="0.9">EQUATOR (0°)</text>
          
          {/* Tropic of Cancer (23.5°N -> y = 213.75) */}
          <line x1="0" y1="214" x2="1000" y2="214" />
          <text x="24" y="209" fill="#64748B" fontSize="9" fontFamily="monospace">TROPIC OF CANCER (23.5°N)</text>
          
          {/* Tropic of Capricorn (23.5°S -> y = 478.75) */}
          <line x1="0" y1="479" x2="1000" y2="479" />
          <text x="24" y="474" fill="#64748B" fontSize="9" fontFamily="monospace">TROPIC OF CAPRICORN (23.5°S)</text>

          {/* Prime Meridian (0° -> x = 661.25) */}
          <line x1="661" y1="0" x2="661" y2="580" stroke="#475569" opacity="0.5" />
          <text x="666" y="24" fill="#64748B" fontSize="9" fontFamily="monospace">PRIME MERIDIAN (0°)</text>
        </g>

        {/* CONTINENTAL VECTORS: THE AMERICAS & CARIBBEAN */}
        <g id="hydroAmericas" className="pointer-events-auto">
          <path
            d={SOUTH_AMERICA_PATH}
            fill="url(#hydroAmericasLand)"
            stroke="#38BDF8"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d={NORTH_AMERICA_PATH}
            fill="url(#hydroAmericasLand)"
            stroke="#22D3EE"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d={CUBA_PATH} fill="#D97706" stroke="#F59E0B" strokeWidth="1.2" />
          <path d={HISPANIOLA_PATH} fill="#D97706" stroke="#F59E0B" strokeWidth="1.2" />
          <path d={JAMAICA_PATH} fill="#D97706" stroke="#F59E0B" strokeWidth="1.2" />
          <path d={PUERTO_RICO_PATH} fill="#D97706" stroke="#F59E0B" strokeWidth="1.2" />
          <path d={BAHAMAS_PATH} fill="#D97706" stroke="#F59E0B" strokeWidth="1.2" />
          <path d={LESSER_ANTILLES_PATH} fill="#D97706" stroke="#F59E0B" strokeWidth="1.0" />
        </g>

        {/* CONTINENTAL VECTORS: EUROPE & BRITISH ISLES */}
        <g id="hydroEurope">
          <path
            d={EUROPE_MAINLAND_PATH}
            fill="url(#hydroEuropeLand)"
            stroke="#F59E0B"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d={GREAT_BRITAIN_PATH} fill="url(#hydroEuropeLand)" stroke="#F59E0B" strokeWidth="1.4" />
          <path d={IRELAND_PATH} fill="url(#hydroEuropeLand)" stroke="#F59E0B" strokeWidth="1.4" />
          <path d={BALEARIC_PATH} fill="url(#hydroEuropeLand)" stroke="#F59E0B" strokeWidth="1.0" />
          <path d={SARDINIA_CORSICA_PATH} fill="url(#hydroEuropeLand)" stroke="#F59E0B" strokeWidth="1.0" />
          <path d={SICILY_PATH} fill="url(#hydroEuropeLand)" stroke="#F59E0B" strokeWidth="1.0" />
        </g>

        {/* International Boundaries */}
        <path
          d={INTERNATIONAL_BORDERS_PATH}
          fill="none"
          stroke="#475569"
          strokeWidth="0.75"
          strokeDasharray="2 3"
          opacity="0.6"
        />

        {/* Historic Navigational Rivers */}
        <g stroke="#0284C7" strokeWidth="1.1" fill="none" opacity="0.75" strokeLinecap="round">
          {HISTORIC_RIVERS.map(river => (
            <path key={river.id} d={river.path} />
          ))}
        </g>

        {/* Authoritative African Continent Vector */}
        <AfricaVectorContinent
          x="555"
          y="136"
          width="421"
          height="406"
          mode="countries"
          theme="dark"
          strokeWidth={1.2}
          strokeColor="#38bdf8"
          opacity={0.95}
        />

        {/* Topographic Typography Labels */}
        <g className="pointer-events-none select-none font-serif" style={{ paintOrder: 'stroke fill' }}>
          <text 
            x="745" 
            y="210" 
            fill="#ECFDF5" 
            stroke="#020617" 
            strokeWidth="3.5px" 
            strokeLinejoin="round"
            fontSize="19" 
            fontWeight="900" 
            letterSpacing="4" 
          >
            AFRICA
          </text>

          <text 
            x="320" 
            y="420" 
            fill="#BAE6FD" 
            stroke="#020617" 
            strokeWidth="3.5px" 
            strokeLinejoin="round"
            fontSize="16" 
            fontWeight="900" 
            letterSpacing="3" 
          >
            SOUTH AMERICA
          </text>

          <text 
            x="240" 
            y="110" 
            fill="#CFFAFE" 
            stroke="#020617" 
            strokeWidth="3.5px" 
            strokeLinejoin="round"
            fontSize="15" 
            fontWeight="900" 
            letterSpacing="3" 
          >
            NORTH AMERICA
          </text>

          <text 
            x="575" 
            y="80" 
            fill="#FEF3C7" 
            stroke="#020617" 
            strokeWidth="3.5px" 
            strokeLinejoin="round"
            fontSize="14" 
            fontWeight="900" 
            letterSpacing="3" 
          >
            EUROPE
          </text>

          {/* Oceanic Basins */}
          <text 
            x="450" 
            y="235" 
            fill="#38BDF8" 
            stroke="#020617" 
            strokeWidth="3px" 
            strokeLinejoin="round"
            fontSize="11.5" 
            fontStyle="italic" 
            fontWeight="700" 
            letterSpacing="3" 
            opacity="0.85"
          >
            NORTH ATLANTIC OCEAN
          </text>

          <text 
            x="485" 
            y="445" 
            fill="#38BDF8" 
            stroke="#020617" 
            strokeWidth="3px" 
            strokeLinejoin="round"
            fontSize="11.5" 
            fontStyle="italic" 
            fontWeight="700" 
            letterSpacing="3" 
            opacity="0.85"
          >
            SOUTH ATLANTIC OCEAN
          </text>
        </g>

        {/* Coastal Anchors & Nautical Ports */}
        <g id="nauticalPortsLayer" className="pointer-events-auto">
          {NAUTICAL_PORTS.map((port) => {
            const [cx, cy] = projectCoord(port.lat, port.lng);
            const isHovered = hoveredPort?.name === port.name;
            const isAfrican = port.type === 'african-port';

            return (
              <g
                key={port.name}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredPort(port)}
                onMouseLeave={() => setHoveredPort(null)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 8 : 4.5}
                  fill={isAfrican ? "#10B981" : "#F59E0B"}
                  stroke="#020617"
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                />
                {isHovered && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={14}
                    fill="none"
                    stroke={isAfrican ? "#34D399" : "#FBBF24"}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="animate-spin-slow"
                  />
                )}
                <text
                  x={cx + 7}
                  y={cy + 3.5}
                  fill={isHovered ? "#FFFFFF" : isAfrican ? "#A7F3D0" : "#FDE68A"}
                  fontSize={isHovered ? "10" : "8.5"}
                  fontFamily="monospace"
                  fontWeight="bold"
                  stroke="#020617"
                  strokeWidth="2px"
                  style={{ paintOrder: 'stroke fill' }}
                >
                  {port.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* 2. Real-Time HTML5 Canvas Vector Particle Streamlines Layer (Zero flash, continuous GPU accelerated) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-crosshair z-10 pointer-events-none" />

      {/* 3. Atmospheric & Oceanic Diagnostics HUD Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 text-xs font-mono font-bold text-slate-100 shadow-xl">
          <Wind className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>Hydrodynamic Engine: <strong className="text-amber-300">{activeSeasonMeta.seasonName.split(':')[0]}</strong></span>
        </div>

        {/* Real-time Velocity & Particle Volume Diagnostic Badges */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-[11px] font-mono text-slate-300 shadow-md">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>Velocity: <strong className="text-emerald-300">{activeHydroMetrics.speedFactor.toFixed(2)}x</strong></span>
          <span className="text-slate-500">•</span>
          <span>Trail: <strong className="text-sky-300">{activeHydroMetrics.trailScale}px</strong></span>
          <span className="text-slate-500">•</span>
          <span>Volume: <strong className="text-amber-300">{Math.round(activeHydroMetrics.activeRatio * 100)}%</strong></span>
        </div>

        <button
          onClick={() => setIsPlaying(p => !p)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors shadow-md cursor-pointer"
          title={isPlaying ? "Pause particle simulation" : "Play particle simulation"}
        >
          {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
          <span>{isPlaying ? 'Pause' : 'Resume'}</span>
        </button>
      </div>

      {/* 4. Hovered Nautical Port Tooltip Pill */}
      {hoveredPort && (
        <div className="absolute top-4 right-4 z-20 pointer-events-none p-3 rounded-2xl bg-slate-950/95 backdrop-blur-md border border-amber-500/50 shadow-2xl text-left max-w-xs font-mono text-xs animate-in fade-in duration-100">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold text-sm">
            <Anchor className="w-4 h-4 text-amber-400" />
            <span>{hoveredPort.name}</span>
          </div>
          <p className="text-slate-300 text-[11px] mt-1">{hoveredPort.note}</p>
          <div className="text-[10px] text-slate-400 mt-1">
            Lat: {hoveredPort.lat.toFixed(2)}° • Lng: {hoveredPort.lng.toFixed(2)}°
          </div>
        </div>
      )}

      {/* 5. Dynamic Streamline Legend & Transit Gauge */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-300 shadow-xl pointer-events-auto">
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
            <span className="text-slate-200 font-semibold">Cold Upwelling (Canary &amp; Benguela)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
            <span className="text-slate-200 font-semibold">Warm Equatorial (Guinea &amp; South Equatorial)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-100 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            <span className="text-slate-200 font-semibold">Trade Winds &amp; Monsoon</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-amber-300 shrink-0 text-xs">
          <span className="text-slate-400 hidden lg:inline">Dominant Corridor:</span>
          <span className="flex items-center gap-1.5">
            <Anchor className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Angola → Bahia: <strong className="font-bold text-white">{activeHydroMetrics.avgPassageDaysLuandaBahia} days</strong></span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Senegambia → Caribbean: <strong className="font-bold text-white">{activeHydroMetrics.avgPassageDaysSenegambiaCaribbean} days</strong></span>
          </span>
        </div>
      </div>
    </div>
  );
};
