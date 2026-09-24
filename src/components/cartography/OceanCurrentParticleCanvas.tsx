import React, { useEffect, useRef, useState } from 'react';
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
  Maximize2
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

interface OceanCurrentParticleCanvasProps {
  activeSeasonId: 'q1' | 'q2' | 'q3' | 'q4';
  showCurrents?: boolean;
  showWinds?: boolean;
  speedMultiplier?: number;
  particleDensity?: 'low' | 'medium' | 'high';
  className?: string;
  onSelectCurrent?: (current: OceanCurrentDef) => void;
}

interface ParticleFieldConfig {
  numParticles: number;
  trailAlpha: number;
  baseSpeed: number;
}

// Major coastal nodes for visual geographic grounding
const NAUTICAL_PORTS = [
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
  const [hoveredCurrent, setHoveredCurrent] = useState<OceanCurrentDef | null>(null);

  const activeSeason = SEASONAL_WIND_REGIMES.find(s => s.id === activeSeasonId) || SEASONAL_WIND_REGIMES[0];

  // Configuration based on density
  const config: ParticleFieldConfig = {
    numParticles: particleDensity === 'low' ? 320 : particleDensity === 'high' ? 850 : 540,
    trailAlpha: 0.15,
    baseSpeed: 0.95
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Viewport resolution standard is 1000 x 580 (matches SVG viewBox)
    const VIRTUAL_WIDTH = 1000;
    const VIRTUAL_HEIGHT = 580;

    let displayWidth = canvas.parentElement?.clientWidth || 1000;
    let displayHeight = canvas.parentElement?.clientHeight || 580;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale((displayWidth / VIRTUAL_WIDTH) * dpr, (displayHeight / VIRTUAL_HEIGHT) * dpr);

    const num = config.numParticles;
    // Flat buffer: 6 floats per particle -> [x, y, vx, vy, age, maxAge]
    const particles = new Float32Array(num * 6);

    // Vector field evaluator in standard 1000x580 coordinate system
    const evaluateFlowField = (x: number, y: number, season: string): [number, number, number] => {
      // Map x (0 to 1000) and y (0 to 580) back to geographic coords (lng: -105 to 52, lat: -38 to 58)
      const normX = (x - 20) / 960;
      const normY = (y - 20) / 540;
      const lng = -105 + normX * 157;
      const lat = 58 - normY * 96;

      let vx = 0;
      let vy = 0;
      let type = 0; // 0=ambient, 1=current, 2=wind

      // 1. Canary Current (Cold North-to-South along NW Africa)
      if (showCurrents && lat > 12 && lat < 36 && lng > -24 && lng < -9) {
        vx = -0.55;
        vy = 1.65;
        type = 1;
      }
      // 2. Benguela Current (Cold South-to-North along SW Africa)
      else if (showCurrents && lat > -35 && lat < -2 && lng > 7 && lng < 16) {
        vx = -0.95;
        vy = -1.85;
        type = 1;
      }
      // 3. Guinea Current (Warm West-to-East in Gulf of Guinea)
      else if (showCurrents && lat > 1.5 && lat < 6.8 && lng > -14 && lng < 10) {
        vx = 2.25;
        vy = 0.12;
        type = 1;
      }
      // 4. South Equatorial Current (Transatlantic East-to-West: Angola/Guinea to Brazil & Caribbean)
      else if (showCurrents && lat > -16 && lat < 4 && lng > -45 && lng < 6) {
        vx = -2.65;
        vy = -0.28;
        type = 1;
      }
      // 5. North Equatorial Current (East-to-West: Cap Verde to Caribbean)
      else if (showCurrents && lat > 9 && lat < 22 && lng > -65 && lng < -22) {
        vx = -2.45;
        vy = -0.18;
        type = 1;
      }
      // 6. Gulf Stream & North Atlantic Drift (Florida to UK/Western Europe)
      else if (showCurrents && lat > 26 && lat < 54 && lng > -80 && lng < -12) {
        vx = 2.5;
        vy = -1.45;
        type = 1;
      }
      // 7. Agulhas Current (Southward around Cape of Good Hope)
      else if (showCurrents && lat > -38 && lat < -24 && lng > 24 && lng < 42) {
        vx = -1.35;
        vy = 1.55;
        type = 1;
      }
      // 8. Northeast Trade Winds (Tropical North Atlantic)
      else if (showWinds && lat > 8 && lat < 30 && lng > -60 && lng < -16) {
        const seasonBoost = season === 'q1' ? 1.4 : season === 'q3' ? 0.75 : 1.0;
        vx = -1.95 * seasonBoost;
        vy = 0.95 * seasonBoost;
        type = 2;
      }
      // 9. Southeast Trade Winds (Tropical South Atlantic)
      else if (showWinds && lat > -30 && lat < -2 && lng > -40 && lng < 12) {
        const seasonBoost = season === 'q3' ? 1.45 : 1.0;
        vx = -1.85 * seasonBoost;
        vy = -0.92 * seasonBoost;
        type = 2;
      }
      // 10. Southwest Monsoon Surge (Summer Q3 Gulf of Guinea)
      else if (showWinds && season === 'q3' && lat > 3 && lat < 12 && lng > -18 && lng < 8) {
        vx = 1.75;
        vy = -1.15;
        type = 2;
      }
      else {
        vx = -0.4;
        vy = 0.08;
        type = 0;
      }

      return [vx, vy, type];
    };

    // Initialize all particles
    for (let i = 0; i < num; i++) {
      const idx = i * 6;
      particles[idx] = Math.random() * VIRTUAL_WIDTH;
      particles[idx + 1] = Math.random() * VIRTUAL_HEIGHT;
      const [vx, vy] = evaluateFlowField(particles[idx], particles[idx + 1], activeSeasonId);
      particles[idx + 2] = vx;
      particles[idx + 3] = vy;
      particles[idx + 4] = Math.random() * 120;
      particles[idx + 5] = 90 + Math.random() * 100;
    }

    let lastTime = performance.now();

    const render = (now: number) => {
      if (!isPlaying || !isVisibleRef.current) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Clear virtual canvas
      ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      const speed = config.baseSpeed * speedMultiplier;

      for (let i = 0; i < num; i++) {
        const idx = i * 6;
        const px = particles[idx];
        const py = particles[idx + 1];
        const age = particles[idx + 4];
        const maxAge = particles[idx + 5];

        const [vx, vy, type] = evaluateFlowField(px, py, activeSeasonId);

        // Smooth velocity blending
        particles[idx + 2] = particles[idx + 2] * 0.88 + vx * 0.12;
        particles[idx + 3] = particles[idx + 3] * 0.88 + vy * 0.12;

        const nextX = px + particles[idx + 2] * speed * (dt * 60);
        const nextY = py + particles[idx + 3] * speed * (dt * 60);

        // Draw particle trail
        const lifeRatio = age / maxAge;
        const alpha = Math.sin(lifeRatio * Math.PI) * 0.92;

        if (type === 1) {
          // Ocean Current: Sky blue for cold, Amber for warm equatorial
          const isWarm = py < VIRTUAL_HEIGHT * 0.62 && py > VIRTUAL_HEIGHT * 0.40;
          ctx.strokeStyle = isWarm
            ? `rgba(251, 191, 36, ${alpha * 0.95})`
            : `rgba(56, 189, 248, ${alpha * 0.95})`;
          ctx.lineWidth = 2.2;
        } else if (type === 2) {
          // Trade Wind: White / Cyan streak
          ctx.strokeStyle = `rgba(224, 242, 254, ${alpha * 0.88})`;
          ctx.lineWidth = 1.4;
        } else {
          // Ambient Drift
          ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 0.35})`;
          ctx.lineWidth = 0.9;
        }

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(nextX, nextY);
        ctx.stroke();

        // Update particle
        particles[idx] = nextX;
        particles[idx + 1] = nextY;
        particles[idx + 4] = age + 1;

        if (age >= maxAge || nextX < 0 || nextX > VIRTUAL_WIDTH || nextY < 0 || nextY > VIRTUAL_HEIGHT) {
          particles[idx] = Math.random() * VIRTUAL_WIDTH;
          particles[idx + 1] = Math.random() * VIRTUAL_HEIGHT;
          particles[idx + 4] = 0;
          particles[idx + 5] = 90 + Math.random() * 110;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      displayWidth = canvas.parentElement.clientWidth;
      displayHeight = canvas.parentElement.clientHeight;
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.scale((displayWidth / VIRTUAL_WIDTH) * dpr, (displayHeight / VIRTUAL_HEIGHT) * dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [activeSeasonId, showCurrents, showWinds, speedMultiplier, particleDensity, isPlaying]);

  // Viewport visibility observer
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

        {/* ============================================================ */}
        {/* CONTINENTAL VECTORS: THE AMERICAS & CARIBBEAN */}
        {/* ============================================================ */}
        <g id="hydroAmericas" className="pointer-events-auto">
          {/* SOUTH AMERICA */}
          <path
            d={SOUTH_AMERICA_PATH}
            fill="url(#hydroAmericasLand)"
            stroke="#38BDF8"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* NORTH AMERICA & CENTRAL AMERICA */}
          <path
            d={NORTH_AMERICA_PATH}
            fill="url(#hydroAmericasLand)"
            stroke="#22D3EE"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* CARIBBEAN ARCHIPELAGO & ISLAND CHAINS */}
          <path d={CUBA_PATH} fill="#D97706" stroke="#F59E0B" strokeWidth="1.2" />
          <path d={HISPANIOLA_PATH} fill="#D97706" stroke="#F59E0B" strokeWidth="1.2" />
          <path d={JAMAICA_PATH} fill="#D97706" stroke="#F59E0B" strokeWidth="1.2" />
          <path d={PUERTO_RICO_PATH} fill="#D97706" stroke="#F59E0B" strokeWidth="1.2" />
          <path d={BAHAMAS_PATH} fill="#D97706" stroke="#F59E0B" strokeWidth="1.2" />
          <path d={LESSER_ANTILLES_PATH} fill="#D97706" stroke="#F59E0B" strokeWidth="1.0" />
        </g>

        {/* ============================================================ */}
        {/* CONTINENTAL VECTORS: EUROPE & BRITISH ISLES */}
        {/* ============================================================ */}
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

        {/* International & Historical Internal Boundaries */}
        <path
          d={INTERNATIONAL_BORDERS_PATH}
          fill="none"
          stroke="#475569"
          strokeWidth="0.75"
          strokeDasharray="2 3"
          opacity="0.6"
        />

        {/* Historic Navigational Rivers (Amazon, Mississippi, Tagus, Loire, Congo, Niger, Nile) */}
        <g stroke="#0284C7" strokeWidth="1.1" fill="none" opacity="0.75" strokeLinecap="round">
          {HISTORIC_RIVERS.map(river => (
            <path key={river.id} d={river.path} />
          ))}
        </g>

        {/* ============================================================ */}
        {/* THE AUTHORITATIVE UNIFIED AFRICAN CONTINENT (africa-final.svg) */}
        {/* ============================================================ */}
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

        {/* Major Topographic Typography Labels */}
        <g className="pointer-events-none select-none font-serif" style={{ paintOrder: 'stroke fill' }}>
          {/* AFRICA */}
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

          {/* SOUTH AMERICA */}
          <text 
            x="320" 
            y="420" 
            fill="#BAE6FD" 
            stroke="#020617" 
            strokeWidth="3.5px" 
            strokeLinejoin="round"
            fontSize="17" 
            fontWeight="900" 
            letterSpacing="3" 
          >
            SOUTH AMERICA
          </text>
          <text x="320" y="438" fill="#38BDF8" fontSize="9" fontFamily="monospace">Recife / Bahia / Rio</text>

          {/* NORTH AMERICA */}
          <text 
            x="190" 
            y="110" 
            fill="#BAE6FD" 
            stroke="#020617" 
            strokeWidth="3.5px" 
            strokeLinejoin="round"
            fontSize="16" 
            fontWeight="900" 
            letterSpacing="3" 
          >
            NORTH AMERICA
          </text>

          {/* EUROPE */}
          <text 
            x="590" 
            y="70" 
            fill="#FDE68A" 
            stroke="#020617" 
            strokeWidth="3px" 
            strokeLinejoin="round"
            fontSize="14" 
            fontWeight="900" 
            letterSpacing="2" 
          >
            EUROPE
          </text>
        </g>

        {/* ============================================================ */}
        {/* HISTORICAL NAUTICAL PORTS & EMBARKATION BEACONS */}
        {/* ============================================================ */}
        <g id="hydroPorts" className="pointer-events-auto">
          {NAUTICAL_PORTS.map(port => {
            const [x, y] = projectCoord(port.lat, port.lng);
            const isHovered = hoveredPort?.name === port.name;
            const isAfrican = port.type === 'african-port';

            return (
              <g
                key={`nautical-port-${port.name}`}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredPort(port)}
                onMouseLeave={() => setHoveredPort(null)}
              >
                {/* Concentric radar pulse */}
                <circle
                  cx="0"
                  cy="0"
                  r={isHovered ? "14" : "7"}
                  fill={isAfrican ? "#10B981" : "#F59E0B"}
                  opacity={isHovered ? "0.45" : "0.25"}
                  className="transition-all duration-200"
                />
                <circle
                  cx="0"
                  cy="0"
                  r={isHovered ? "6" : "3.5"}
                  fill={isAfrican ? "#10B981" : "#F59E0B"}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                />

                {/* Port Label */}
                <text
                  x={x > 500 ? "-8" : "8"}
                  y={y > 400 ? "-6" : "4"}
                  textAnchor={x > 500 ? "end" : "start"}
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

      {/* 2. Real-Time HTML5 Canvas Vector Particle Streamlines Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-crosshair z-10" />

      {/* 3. Atmospheric & Oceanic Diagnostics HUD Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 text-xs font-mono font-bold text-slate-100 shadow-xl">
          <Wind className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>Atlantic Basin Hydrodynamic Engine: <strong className="text-amber-300">{activeSeason.seasonName}</strong></span>
        </div>

        <button
          onClick={() => setIsPlaying(p => !p)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors shadow-md cursor-pointer"
          title={isPlaying ? "Pause particle simulation" : "Play particle simulation"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isPlaying ? 'Pause Flows' : 'Resume Flows'}</span>
        </button>
      </div>

      {/* 4. Hovered Nautical Port Tooltip Pill */}
      {hoveredPort && (
        <div className="absolute top-4 right-4 z-20 pointer-events-none p-3 rounded-2xl bg-slate-950/95 backdrop-blur-md border border-amber-500/50 shadow-2xl text-left max-w-xs font-mono text-xs">
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
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-300 shadow-xl pointer-events-auto">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
            <span className="text-slate-200 font-semibold">Cold Upwelling (Canary &amp; Benguela)</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
            <span className="text-slate-200 font-semibold">Warm Equatorial (Guinea &amp; South Equatorial)</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-100 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            <span className="text-slate-200 font-semibold">NE &amp; SE Trade Winds</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-amber-300 shrink-0">
          <Anchor className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Angola → Bahia Highway: <strong className="font-bold text-white text-sm">{activeSeason.transatlanticPassageDurationDays.angolaToRioDeJaneiro} days</strong></span>
        </div>
      </div>
    </div>
  );
};
