import React, { useEffect, useRef, useState } from 'react';
import { 
  OceanCurrentDef, 
  SeasonalWindRegime 
} from '../../data/archivalCartographyData';
import { 
  Anchor 
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
  HISTORIC_RIVERS
} from '../slaveVoyages/atlanticMapGeometry';
import { AfricaVectorContinent } from '../common/AfricaVectorContinent';
import {
  HydrodynamicSeasonId,
  SEASONAL_HYDRO_METRICS,
  evaluateHydrodynamicVector,
  isLandLocation
} from '../../services/oceanHydrodynamicsService';

export interface OceanCurrentParticleCanvasProps {
  activeSeasonId: HydrodynamicSeasonId;
  showCurrents?: boolean;
  showWinds?: boolean;
  isPlaying?: boolean;
  speedMultiplier?: number;
  particleDensity?: 'low' | 'medium' | 'high';
  theme?: 'dark' | 'light';
  className?: string;
  onSelectCurrent?: (current: OceanCurrentDef) => void;
}

export interface NauticalPortItem {
  name: string;
  lat: number;
  lng: number;
  type: 'african-port' | 'american-port' | 'european-port';
  note: string;
  svgCoord?: [number, number];
}

// Major coastal nodes for visual geographic grounding (Accurately calibrated to African and Atlantic coastlines)
export const NAUTICAL_PORTS: NauticalPortItem[] = [
  // West & Southern African Coastline Anchor Nodes (Corrected & precisely aligned to African coastal geometry)
  { 
    name: 'Senegambia (Gorée)', 
    lat: 14.6708, 
    lng: -17.4381, 
    type: 'african-port', 
    note: 'Canary Current Departure (28 days to Caribbean)',
    svgCoord: [572, 250] 
  },
  { 
    name: 'Sierra Leone (Bunce Island)', 
    lat: 8.4844, 
    lng: -13.2344, 
    type: 'african-port', 
    note: 'Windward Coast departure node & fortified estuary',
    svgCoord: [592, 282] 
  },
  { 
    name: 'Gold Coast (Elmina)', 
    lat: 5.1054, 
    lng: -1.2466, 
    type: 'african-port', 
    note: 'Guinea Current Hub & São Jorge da Mina fort complex',
    svgCoord: [624, 290] 
  },
  { 
    name: 'Bight of Benin (Ouidah)', 
    lat: 6.3631, 
    lng: 2.0851, 
    type: 'african-port', 
    note: 'Equatorial Flow directly toward Bahia (34 days)',
    svgCoord: [644, 286] 
  },
  { 
    name: 'Biafra (Bonny)', 
    lat: 4.4539, 
    lng: 7.1639, 
    type: 'african-port', 
    note: 'Niger Delta Estuary & embarkation hub',
    svgCoord: [662, 292] 
  },
  { 
    name: 'Luanda (Angola)', 
    lat: -8.8390, 
    lng: 13.2894, 
    type: 'african-port', 
    note: 'Benguela Highway (Record fast: 39 days to Rio)',
    svgCoord: [682, 368] 
  },
  { 
    name: 'Benguela (São Filipe)', 
    lat: -12.5763, 
    lng: 13.4055, 
    type: 'african-port', 
    note: 'South Atlantic Gyre southern embarkation port',
    svgCoord: [685, 395] 
  },
  { 
    name: 'Cape of Good Hope', 
    lat: -34.3568, 
    lng: 18.4740, 
    type: 'african-port', 
    note: 'Agulhas Confluence & southern rounding passage',
    svgCoord: [738, 485] 
  },
  { 
    name: 'Mozambique Channel', 
    lat: -15.0342, 
    lng: 40.7358, 
    type: 'african-port', 
    note: 'Indian Ocean Route to Brazil (62–68 days)',
    svgCoord: [790, 410] 
  },

  // American Disembarkation & Terminal Ports
  { 
    name: 'Salvador da Bahia', 
    lat: -12.9777, 
    lng: -38.5016, 
    type: 'american-port', 
    note: 'Primary Brazil Terminal (32–36 days transit)',
    svgCoord: [437, 412] 
  },
  { 
    name: 'Rio de Janeiro', 
    lat: -22.9068, 
    lng: -43.1729, 
    type: 'american-port', 
    note: 'Valongo Complex & South Atlantic terminal (38–42 days)',
    svgCoord: [423, 444] 
  },
  { 
    name: 'Recife (Pernambuco)', 
    lat: -8.0476, 
    lng: -34.8770, 
    type: 'american-port', 
    note: 'Nearest American Port (24–28 days transit)',
    svgCoord: [448, 384] 
  },
  { 
    name: 'Kingston (Jamaica)', 
    lat: 17.9712, 
    lng: -76.7936, 
    type: 'american-port', 
    note: 'British Caribbean Hub & sugar transshipment',
    svgCoord: [196, 246] 
  },
  { 
    name: 'Bridgetown (Barbados)', 
    lat: 13.0969, 
    lng: -59.6145, 
    type: 'american-port', 
    note: 'Windward Port of Call for North Atlantic fleets',
    svgCoord: [289, 271] 
  },
  { 
    name: 'Cap-Français (Saint-Domingue)', 
    lat: 19.7595, 
    lng: -72.2008, 
    type: 'american-port', 
    note: 'French Caribbean Center (Haiti)',
    svgCoord: [224, 236] 
  },
  { 
    name: 'Havana (Cuba)', 
    lat: 23.1136, 
    lng: -82.3666, 
    type: 'american-port', 
    note: 'Gulf Stream Gateway & convoy center',
    svgCoord: [175, 210] 
  },
  { 
    name: 'Charleston (South Carolina)', 
    lat: 32.7765, 
    lng: -79.9311, 
    type: 'american-port', 
    note: 'North American Seaboard disembarkation',
    svgCoord: [194, 152] 
  },

  // European Metropoles
  { 
    name: 'Lisbon (Tagus)', 
    lat: 38.7223, 
    lng: -9.1393, 
    type: 'european-port', 
    note: 'Canary Current Launchpoint & Casa da Índia',
    svgCoord: [606, 116] 
  },
  { 
    name: 'Liverpool', 
    lat: 53.4084, 
    lng: -2.9916, 
    type: 'european-port', 
    note: 'North Atlantic Departure & triangular trade hub',
    svgCoord: [648, 28] 
  },
  { 
    name: 'Nantes', 
    lat: 47.2184, 
    lng: -1.5536, 
    type: 'european-port', 
    note: 'Loire Estuary Fleet & French triangular trade center',
    svgCoord: [658, 65] 
  }
];

// Virtual coordinate space with top headroom and edge-to-edge span
const VIRTUAL_WIDTH = 1000;
const VIRTUAL_HEIGHT = 700;
const VIRTUAL_MIN_Y = -120;

export const OceanCurrentParticleCanvas: React.FC<OceanCurrentParticleCanvasProps> = ({
  activeSeasonId,
  showCurrents = true,
  showWinds = true,
  isPlaying = true,
  speedMultiplier = 1.0,
  particleDensity = 'medium',
  theme = 'dark',
  className = '',
  onSelectCurrent
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef<boolean>(true);
  const [hoveredPort, setHoveredPort] = useState<NauticalPortItem | null>(null);

  // Dynamic references for canvas render loop
  const activeSeasonRef = useRef<HydrodynamicSeasonId>(activeSeasonId);
  const prevSeasonRef = useRef<HydrodynamicSeasonId>(activeSeasonId);
  const transitionTimeRef = useRef<number>(1.0);

  const showCurrentsRef = useRef(showCurrents);
  const showWindsRef = useRef(showWinds);
  const speedMultRef = useRef(speedMultiplier);
  const densityRef = useRef(particleDensity);
  const isPlayingRef = useRef(isPlaying);
  const themeRef = useRef(theme);

  useEffect(() => {
    if (activeSeasonRef.current !== activeSeasonId) {
      prevSeasonRef.current = activeSeasonRef.current;
      activeSeasonRef.current = activeSeasonId;
      transitionTimeRef.current = 0.0;
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

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Helper to find initial or respawn coordinates over open ocean water
  const getRandomOceanCoord = (): [number, number] => {
    for (let attempt = 0; attempt < 16; attempt++) {
      const rx = 10 + Math.random() * 980;
      const ry = Math.random() * 580;
      const lng = -105 + (rx / 1000) * 157;
      const lat = 58 - (ry / 580) * 96;
      if (!isLandLocation(lat, lng)) {
        return [rx, ry];
      }
    }
    return [440, 290]; // Mid-Atlantic safe coordinate fallback
  };

  // High-Performance GPU-Accelerated Particle Animation Loop (Mounted ONCE)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const maxParticles = 640;
    const particles = new Float32Array(maxParticles * 8);

    for (let i = 0; i < maxParticles; i++) {
      const idx = i * 8;
      const isWind = i >= maxParticles / 2;
      const [initX, initY] = isWind 
        ? [Math.random() * 1000, Math.random() * 580] 
        : getRandomOceanCoord();

      particles[idx] = initX;
      particles[idx + 1] = initY;
      const vec = evaluateHydrodynamicVector(
        particles[idx], 
        particles[idx + 1], 
        activeSeasonRef.current,
        showCurrentsRef.current,
        showWindsRef.current,
        isWind ? 'wind' : 'current'
      );
      particles[idx + 2] = vec.vx;
      particles[idx + 3] = vec.vy;
      particles[idx + 4] = Math.random() * 80;
      particles[idx + 5] = 55 + Math.random() * 65;
      particles[idx + 6] = vec.vx;
      particles[idx + 7] = vec.vy;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Edge-to-edge stretch scaling without letterboxing gaps
    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      const containerW = canvas.parentElement.clientWidth;
      const containerH = canvas.parentElement.clientHeight;
      if (containerW === 0 || containerH === 0) return;
      
      const scaleX = containerW / VIRTUAL_WIDTH;
      const scaleY = containerH / VIRTUAL_HEIGHT;

      canvas.width = containerW * dpr;
      canvas.height = containerH * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.translate(0, 120 * scaleY);
      ctx.scale(scaleX, scaleY);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let animationFrameId: number;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      if (!isVisibleRef.current || !isPlayingRef.current) {
        return;
      }

      if (transitionTimeRef.current < 1.0) {
        transitionTimeRef.current = Math.min(1.0, transitionTimeRef.current + 0.03);
      }

      ctx.clearRect(0, VIRTUAL_MIN_Y, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      const densityCount = densityRef.current === 'low' ? 360 : densityRef.current === 'high' ? 640 : 520;
      const halfCount = Math.floor(densityCount / 2);
      const curSeason = activeSeasonRef.current;
      const prevSeason = prevSeasonRef.current;
      const t = transitionTimeRef.current;
      const globalSpeedFactor = SEASONAL_HYDRO_METRICS[curSeason].speedFactor * speedMultRef.current;
      const isLightTheme = themeRef.current === 'light';

      for (let i = 0; i < densityCount; i++) {
        const idx = i * 8;
        const isWind = i >= halfCount;

        if (isWind && !showWindsRef.current) continue;
        if (!isWind && !showCurrentsRef.current) continue;

        let x = particles[idx];
        let y = particles[idx + 1];
        let vx = particles[idx + 2];
        let vy = particles[idx + 3];
        let age = particles[idx + 4];
        const maxAge = particles[idx + 5];

        const curVec = evaluateHydrodynamicVector(x, y, curSeason, showCurrentsRef.current, showWindsRef.current, isWind ? 'wind' : 'current');
        
        let targetVx = curVec.vx;
        let targetVy = curVec.vy;
        let force = curVec.force;

        if (t < 1.0) {
          const prevVec = evaluateHydrodynamicVector(x, y, prevSeason, showCurrentsRef.current, showWindsRef.current, isWind ? 'wind' : 'current');
          targetVx = prevVec.vx * (1 - t) + curVec.vx * t;
          targetVy = prevVec.vy * (1 - t) + curVec.vy * t;
          force = prevVec.force * (1 - t) + curVec.force * t;
        }

        vx += (targetVx - vx) * 0.14;
        vy += (targetVy - vy) * 0.14;

        const effectiveVx = vx * globalSpeedFactor;
        const effectiveVy = vy * globalSpeedFactor;

        const nextX = x + effectiveVx;
        const nextY = y + effectiveVy;

        age += 1;

        if (age >= maxAge || nextX < 5 || nextX > 995 || nextY < 5 || nextY > 575) {
          const [spawnX, spawnY] = getRandomOceanCoord();
          particles[idx] = spawnX;
          particles[idx + 1] = spawnY;
          particles[idx + 2] = 0;
          particles[idx + 3] = 0;
          particles[idx + 4] = 0;
          particles[idx + 5] = 50 + Math.random() * 70;
          continue;
        }

        particles[idx] = nextX;
        particles[idx + 1] = nextY;
        particles[idx + 2] = vx;
        particles[idx + 3] = vy;
        particles[idx + 4] = age;

        const lifeRatio = age / maxAge;
        const baseAlpha = Math.sin(lifeRatio * Math.PI);
        const particleAlpha = baseAlpha * (0.55 + (i % 5) * 0.1);

        if (isWind) {
          const windAlpha = Math.max(0.18, particleAlpha * 0.94);
          const streakLen = 2.0 + force * 2.8;
          const prevX = nextX - effectiveVx * streakLen;
          const prevY = nextY - effectiveVy * streakLen;

          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(nextX, nextY);
          ctx.strokeStyle = isLightTheme 
            ? `rgba(2, 132, 199, ${windAlpha * 0.85})` 
            : `rgba(103, 232, 249, ${windAlpha * 0.75})`;
          ctx.lineWidth = 0.85 + force * 0.35;
          ctx.stroke();

          const speed = Math.hypot(effectiveVx, effectiveVy) || 0.001;
          const ux = effectiveVx / speed;
          const uy = effectiveVy / speed;
          const perpX = -uy;
          const perpY = ux;

          const aLen = 3.6 + force * 0.9;
          const aWid = 2.4 + force * 0.5;

          const tipX = nextX + ux * 1.5;
          const tipY = nextY + uy * 1.5;
          const leftX = nextX - ux * aLen + perpX * aWid;
          const leftY = nextY - uy * aLen + perpY * aWid;
          const notchX = nextX - ux * (aLen * 0.4);
          const notchY = nextY - uy * (aLen * 0.4);
          const rightX = nextX - ux * aLen - perpX * aWid;
          const rightY = nextY - uy * aLen - perpY * aWid;

          ctx.beginPath();
          ctx.moveTo(tipX, tipY);
          ctx.lineTo(leftX, leftY);
          ctx.lineTo(notchX, notchY);
          ctx.lineTo(rightX, rightY);
          ctx.closePath();
          ctx.fillStyle = isLightTheme 
            ? `rgba(15, 23, 42, ${Math.min(1.0, windAlpha * 1.3)})` 
            : `rgba(255, 255, 255, ${Math.min(1.0, windAlpha * 1.25)})`;
          ctx.fill();
        } else {
          const nextLat = 58 - (nextY / 580) * 96;
          const isEquatorial = nextLat > -5 && nextLat < 12;
          const currentAlpha = Math.max(0.2, particleAlpha * 0.9);
          const streakLen = 1.8 + force * 2.4;
          const prevX = nextX - effectiveVx * streakLen;
          const prevY = nextY - effectiveVy * streakLen;

          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(nextX, nextY);
          
          if (isLightTheme) {
            ctx.strokeStyle = isEquatorial
              ? `rgba(217, 119, 6, ${currentAlpha * 0.85})` 
              : `rgba(37, 99, 235, ${currentAlpha * 0.85})`;
          } else {
            ctx.strokeStyle = isEquatorial
              ? `rgba(245, 158, 11, ${currentAlpha * 0.8})` 
              : `rgba(14, 165, 233, ${currentAlpha * 0.8})`;
          }
          ctx.lineWidth = 0.9 + force * 0.4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(nextX, nextY, 1.1 + (i % 3) * 0.3, 0, Math.PI * 2);
          if (isLightTheme) {
            ctx.fillStyle = isEquatorial
              ? `rgba(245, 158, 11, ${Math.min(1.0, currentAlpha * 1.2)})`
              : `rgba(30, 64, 175, ${Math.min(1.0, currentAlpha * 1.2)})`;
          } else {
            ctx.fillStyle = isEquatorial
              ? `rgba(253, 224, 71, ${Math.min(1.0, currentAlpha * 1.2)})`
              : `rgba(186, 230, 253, ${Math.min(1.0, currentAlpha * 1.2)})`;
          }
          ctx.fill();
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  const isLight = theme === 'light';

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full min-h-[550px] overflow-hidden select-none transition-colors duration-300 ${
        isLight ? 'bg-[#FAF7F2]' : 'bg-[#040914]'
      } ${className}`}
    >
      {/* 1. Base SVG Cartographic Vector Landmasses & Navigation Grid (Edge-to-edge stretch with preserveAspectRatio="none") */}
      <svg
        viewBox="0 -120 1000 700"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="hydroOceanGlowDark" cx="45%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#0B162C" />
            <stop offset="60%" stopColor="#060E1C" />
            <stop offset="100%" stopColor="#030710" />
          </radialGradient>

          <radialGradient id="hydroOceanGlowLight" cx="45%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#FBF9F4" />
            <stop offset="60%" stopColor="#F5EFE6" />
            <stop offset="100%" stopColor="#EFE5D5" />
          </radialGradient>

          <pattern id="hydroGraticuleGridDark" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.55" />
          </pattern>

          <pattern id="hydroGraticuleGridLight" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#D8CEBD" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.6" />
          </pattern>

          <linearGradient id="hydroAmericasLandDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#152238" />
            <stop offset="100%" stopColor="#0B1322" />
          </linearGradient>

          <linearGradient id="hydroEuropeLandDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1C273C" />
            <stop offset="100%" stopColor="#0F1728" />
          </linearGradient>
        </defs>

        {/* Ocean Background extending edge-to-edge */}
        <rect 
          x="0" 
          y="-120" 
          width="1000" 
          height="700" 
          fill={isLight ? "url(#hydroOceanGlowLight)" : "url(#hydroOceanGlowDark)"} 
        />
        <rect 
          x="0" 
          y="-120" 
          width="1000" 
          height="700" 
          fill={isLight ? "url(#hydroGraticuleGridLight)" : "url(#hydroGraticuleGridDark)"} 
          opacity={0.65} 
        />

        {/* Portolan Rhumb Lines */}
        <g opacity={isLight ? "0.14" : "0.18"} stroke={isLight ? "#0284C7" : "#38BDF8"} strokeWidth="0.6">
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
        <g stroke={isLight ? "#A8A29E" : "#334155"} strokeWidth="0.8" strokeDasharray="4,4" opacity="0.75">
          <line x1="0" y1="346" x2="1000" y2="346" stroke="#0284c7" strokeWidth="1" opacity={isLight ? "0.7" : "0.6"} />
          <text x="24" y="341" fill={isLight ? "#0369A1" : "#38BDF8"} fontSize="9" fontFamily="monospace" opacity="0.9">EQUATOR (0°)</text>
          
          <line x1="0" y1="214" x2="1000" y2="214" />
          <text x="24" y="209" fill={isLight ? "#78716C" : "#64748B"} fontSize="9" fontFamily="monospace">TROPIC OF CANCER (23.5°N)</text>
          
          <line x1="0" y1="479" x2="1000" y2="479" />
          <text x="24" y="474" fill={isLight ? "#78716C" : "#64748B"} fontSize="9" fontFamily="monospace">TROPIC OF CAPRICORN (23.5°S)</text>

          <line x1="661" y1="-120" x2="661" y2="580" stroke={isLight ? "#A8A29E" : "#475569"} opacity="0.5" />
          <text x="666" y="24" fill={isLight ? "#78716C" : "#64748B"} fontSize="9" fontFamily="monospace">PRIME MERIDIAN (0°)</text>
        </g>

        {/* CONTINENTAL VECTORS: THE AMERICAS & CARIBBEAN */}
        <g id="hydroAmericas" className="pointer-events-auto">
          <path
            d={SOUTH_AMERICA_PATH}
            fill={isLight ? "#EFE7DA" : "url(#hydroAmericasLandDark)"}
            stroke={isLight ? "#8C7E64" : "#F59E0B"}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d={NORTH_AMERICA_PATH}
            fill={isLight ? "#EFE7DA" : "url(#hydroAmericasLandDark)"}
            stroke={isLight ? "#8C7E64" : "#F59E0B"}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d={CUBA_PATH} fill="#D97706" stroke={isLight ? "#92400E" : "#F59E0B"} strokeWidth="1.2" />
          <path d={HISPANIOLA_PATH} fill="#D97706" stroke={isLight ? "#92400E" : "#F59E0B"} strokeWidth="1.2" />
          <path d={JAMAICA_PATH} fill="#D97706" stroke={isLight ? "#92400E" : "#F59E0B"} strokeWidth="1.2" />
          <path d={PUERTO_RICO_PATH} fill="#D97706" stroke={isLight ? "#92400E" : "#F59E0B"} strokeWidth="1.2" />
          <path d={BAHAMAS_PATH} fill="#D97706" stroke={isLight ? "#92400E" : "#F59E0B"} strokeWidth="1.2" />
          <path d={LESSER_ANTILLES_PATH} fill="#D97706" stroke={isLight ? "#92400E" : "#F59E0B"} strokeWidth="1.0" />
          {/* Suriname Path / Territory Marker */}
          <g id="surinamePath" transform="translate(312.1, 326.2)">
            <path
              d="M-5,-3 C-2,-4 3,-3 5,0 C3,3 -2,4 -5,2 Z"
              fill={isLight ? "#E5D9C5" : "#1E293B"}
              stroke={isLight ? "#8C7E64" : "#F59E0B"}
              strokeWidth="1.1"
            />
            <text x="7" y="2" fill={isLight ? "#78716C" : "#F59E0B"} fontSize="8" fontFamily="monospace" opacity="0.9">SURINAME</text>
          </g>
        </g>

        {/* CONTINENTAL VECTORS: EUROPE & BRITISH ISLES (Correctly positioned in Mediterranean basin north of Africa) */}
        <g id="hydroEurope" transform="translate(50, -12) scale(1)">
          <path
            d={EUROPE_MAINLAND_PATH}
            fill={isLight ? "#EDE6D8" : "url(#hydroEuropeLandDark)"}
            stroke={isLight ? "#8C7E64" : "#F59E0B"}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d={GREAT_BRITAIN_PATH} fill={isLight ? "#EDE6D8" : "url(#hydroEuropeLandDark)"} stroke={isLight ? "#8C7E64" : "#F59E0B"} strokeWidth="1.2" />
          <path d={IRELAND_PATH} fill={isLight ? "#EDE6D8" : "url(#hydroEuropeLandDark)"} stroke={isLight ? "#8C7E64" : "#F59E0B"} strokeWidth="1.2" />
          <path d={BALEARIC_PATH} fill={isLight ? "#EDE6D8" : "url(#hydroEuropeLandDark)"} stroke={isLight ? "#8C7E64" : "#F59E0B"} strokeWidth="1.0" />
          <path d={SARDINIA_CORSICA_PATH} fill={isLight ? "#EDE6D8" : "url(#hydroEuropeLandDark)"} stroke={isLight ? "#8C7E64" : "#F59E0B"} strokeWidth="1.0" />
          <path d={SICILY_PATH} fill={isLight ? "#EDE6D8" : "url(#hydroEuropeLandDark)"} stroke={isLight ? "#8C7E64" : "#F59E0B"} strokeWidth="1.0" />

          {/* European Rivers, Ports & Labels (Translated by 0, 12) */}
          <g transform="translate(0, 12)">
            {/* European Rivers */}
            <g stroke={isLight ? "#2563EB" : "#0284C7"} strokeWidth="1.1" fill="none" opacity={isLight ? "0.65" : "0.75"} strokeLinecap="round">
              {HISTORIC_RIVERS.filter(r => ['tagus_river', 'loire_river', 'seine_river', 'thames_river', 'rhine_river'].includes(r.id)).map(river => (
                <path key={river.id} d={river.path} />
              ))}
            </g>

            {/* European Ports */}
            {NAUTICAL_PORTS.filter(p => p.type === 'european-port').map((port) => {
              const [cx, cy] = port.svgCoord || projectCoord(port.lat, port.lng);
              const isHovered = hoveredPort?.name === port.name;
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
                    r={isHovered ? 7.5 : 4}
                    fill="#D97706"
                    stroke={isLight ? "#FAF7F2" : "#020617"}
                    strokeWidth="1.5"
                    className="transition-all duration-150"
                  />
                  {isHovered && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={13}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="animate-spin-slow"
                    />
                  )}
                  <text
                    x={cx + 7}
                    y={cy + 3.5}
                    fill={isHovered ? (isLight ? "#0F172A" : "#FFFFFF") : (isLight ? "#92400E" : "#FDE68A")}
                    fontSize={isHovered ? "9.5" : "8"}
                    fontFamily="monospace"
                    fontWeight="bold"
                    stroke={isLight ? "#FFFFFF" : "#020617"}
                    strokeWidth="2px"
                    style={{ paintOrder: 'stroke fill' }}
                  >
                    {port.name}
                  </text>
                </g>
              );
            })}

            {/* EUROPE label inside group */}
            <text 
              x="610" 
              y="45" 
              fill={isLight ? "#1C1917" : "#FEF3C7"} 
              stroke={isLight ? "#FAF7F2" : "#020617"} 
              strokeWidth="3.5px" 
              strokeLinejoin="round"
              fontSize="14" 
              fontWeight="900" 
              letterSpacing="3" 
              textAnchor="middle"
            >
              EUROPE
            </text>
          </g>
        </g>

        {/* International Boundaries */}
        <path
          d={INTERNATIONAL_BORDERS_PATH}
          fill="none"
          stroke={isLight ? "#B5A995" : "#475569"}
          strokeWidth="0.75"
          strokeDasharray="2 3"
          opacity="0.6"
        />

        {/* Historic Navigational Rivers (Americas) */}
        <g stroke={isLight ? "#2563EB" : "#0284C7"} strokeWidth="1.1" fill="none" opacity={isLight ? "0.65" : "0.75"} strokeLinecap="round">
          {HISTORIC_RIVERS.filter(r => !['tagus_river', 'loire_river', 'seine_river', 'thames_river', 'rhine_river', 'niger_river', 'congo_river', 'senegal_river', 'gambia_river', 'zambezi_river'].includes(r.id)).map(river => (
            <path key={river.id} d={river.path} />
          ))}
        </g>

        {/* CONTINENTAL VECTORS: AFRICA (Encapsulated Vector Paths, Rivers, Ports, and Labels) */}
        <g id="hydroAfrica" className="pointer-events-auto">
          {/* Authoritative African Continent Vector */}
          <AfricaVectorContinent
            x="555"
            y="136"
            width="421"
            height="406"
            mode="countries"
            theme={isLight ? "parchment" : "dark"}
            strokeWidth={1.2}
            strokeColor={isLight ? "#8C7E64" : "#38bdf8"}
            opacity={0.95}
          />

          {/* African Navigational Rivers */}
          <g stroke={isLight ? "#2563EB" : "#0284C7"} strokeWidth="1.1" fill="none" opacity={isLight ? "0.65" : "0.75"} strokeLinecap="round">
            {HISTORIC_RIVERS.filter(r => ['niger_river', 'congo_river', 'senegal_river', 'gambia_river', 'zambezi_river'].includes(r.id)).map(river => (
              <path key={river.id} d={river.path} />
            ))}
          </g>

          {/* African Ports */}
          {NAUTICAL_PORTS.filter(p => p.type === 'african-port').map((port) => {
            const [cx, cy] = port.svgCoord || projectCoord(port.lat, port.lng);
            const isHovered = hoveredPort?.name === port.name;

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
                  r={isHovered ? 7.5 : 4}
                  fill="#059669"
                  stroke={isLight ? "#FAF7F2" : "#020617"}
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                />
                {isHovered && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={13}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="animate-spin-slow"
                  />
                )}
                <text
                  x={cx + 7}
                  y={cy + 3.5}
                  fill={isHovered ? (isLight ? "#0F172A" : "#FFFFFF") : (isLight ? "#065F46" : "#A7F3D0")}
                  fontSize={isHovered ? "9.5" : "8"}
                  fontFamily="monospace"
                  fontWeight="bold"
                  stroke={isLight ? "#FFFFFF" : "#020617"}
                  strokeWidth="2px"
                  style={{ paintOrder: 'stroke fill' }}
                >
                  {port.name}
                </text>
              </g>
            );
          })}

          {/* AFRICA Typographic Continent Label */}
          <text 
            x="765" 
            y="340" 
            fill={isLight ? "#1C1917" : "#ECFDF5"} 
            stroke={isLight ? "#FAF7F2" : "#020617"} 
            strokeWidth="3.5px" 
            strokeLinejoin="round"
            fontSize="19" 
            fontWeight="900" 
            letterSpacing="4" 
            textAnchor="middle"
            className="pointer-events-none select-none font-serif"
            style={{ paintOrder: 'stroke fill' }}
          >
            AFRICA
          </text>
        </g>

        {/* Topographic Typography Labels (Americas & Oceans) */}
        <g className="pointer-events-none select-none font-serif" style={{ paintOrder: 'stroke fill' }}>
          <text 
            x="355" 
            y="410" 
            fill={isLight ? "#1C1917" : "#BAE6FD"} 
            stroke={isLight ? "#FAF7F2" : "#020617"} 
            strokeWidth="3.5px" 
            strokeLinejoin="round"
            fontSize="16" 
            fontWeight="900" 
            letterSpacing="3" 
            textAnchor="middle"
          >
            SOUTH AMERICA
          </text>

          <text 
            x="230" 
            y="140" 
            fill={isLight ? "#1C1917" : "#CFFAFE"} 
            stroke={isLight ? "#FAF7F2" : "#020617"} 
            strokeWidth="3.5px" 
            strokeLinejoin="round"
            fontSize="15" 
            fontWeight="900" 
            letterSpacing="3" 
            textAnchor="middle"
          >
            NORTH AMERICA
          </text>

          {/* Oceanic Basins */}
          <text 
            x="450" 
            y="235" 
            fill={isLight ? "#0369A1" : "#38BDF8"} 
            stroke={isLight ? "#FAF7F2" : "#020617"} 
            strokeWidth="3px" 
            strokeLinejoin="round"
            fontSize="11.5" 
            fontStyle="italic" 
            fontWeight="700" 
            letterSpacing="3" 
            opacity="0.85" 
            textAnchor="middle"
          >
            NORTH ATLANTIC OCEAN
          </text>

          <text 
            x="485" 
            y="445" 
            fill={isLight ? "#0369A1" : "#38BDF8"} 
            stroke={isLight ? "#FAF7F2" : "#020617"} 
            strokeWidth="3px" 
            strokeLinejoin="round"
            fontSize="11.5" 
            fontStyle="italic" 
            fontWeight="700" 
            letterSpacing="3" 
            opacity="0.85" 
            textAnchor="middle"
          >
            SOUTH ATLANTIC OCEAN
          </text>
        </g>

        {/* Coastal Anchors & Nautical Ports (American Coastlines) */}
        <g id="nauticalPortsLayer" className="pointer-events-auto">
          {NAUTICAL_PORTS.filter(port => port.type === 'american-port').map((port) => {
            const [cx, cy] = port.svgCoord || projectCoord(port.lat, port.lng);
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
                  r={isHovered ? 7.5 : 4}
                  fill={isAfrican ? "#059669" : "#D97706"}
                  stroke={isLight ? "#FAF7F2" : "#020617"}
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                />
                {isHovered && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={13}
                    fill="none"
                    stroke={isAfrican ? "#10B981" : "#F59E0B"}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="animate-spin-slow"
                  />
                )}
                <text
                  x={cx + 7}
                  y={cy + 3.5}
                  fill={isHovered ? (isLight ? "#0F172A" : "#FFFFFF") : isAfrican ? (isLight ? "#065F46" : "#A7F3D0") : (isLight ? "#92400E" : "#FDE68A")}
                  fontSize={isHovered ? "9.5" : "8"}
                  fontFamily="monospace"
                  fontWeight="bold"
                  stroke={isLight ? "#FFFFFF" : "#020617"}
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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-crosshair z-10 pointer-events-none" />

      {/* 3. Hovered Nautical Port Tooltip Pill */}
      {hoveredPort && (
        <div className={`absolute top-48 right-4 z-20 pointer-events-none p-3.5 rounded-2xl backdrop-blur-md border shadow-2xl text-left max-w-xs font-mono text-xs animate-in fade-in duration-100 ${
          isLight
            ? 'bg-[#FAF7F2]/95 border-amber-600/50 text-stone-900'
            : 'bg-slate-950/95 border-amber-500/50 text-slate-100'
        }`}>
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300 font-bold text-sm">
            <Anchor className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{hoveredPort.name}</span>
          </div>
          <p className="text-[11px] mt-1 leading-snug opacity-90">{hoveredPort.note}</p>
          <div className={`text-[10px] mt-1.5 pt-1 border-t flex items-center justify-between opacity-75 ${
            isLight ? 'border-stone-300' : 'border-slate-800'
          }`}>
            <span>Lat: {hoveredPort.lat.toFixed(2)}°</span>
            <span>Lng: {hoveredPort.lng.toFixed(2)}°</span>
          </div>
        </div>
      )}
    </div>
  );
};
