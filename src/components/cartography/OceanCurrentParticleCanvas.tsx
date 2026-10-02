import React, { useEffect, useRef, useState } from 'react';
import { 
  OceanCurrentDef, 
  SeasonalWindRegime 
} from '../../data/archivalCartographyData';
import { 
  Anchor,
  X,
  Waves,
  Wind,
  Play,
  Pause,
  Compass,
  MapPin,
  Gauge,
  Info,
  SlidersHorizontal
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
import { AFRICA_FINAL_TRANSFORM } from '../../data/africaFinalGeometry';
import {
  HydrodynamicSeasonId,
  SEASONAL_HYDRO_METRICS,
  evaluateHydrodynamicVector,
  evaluateTradeWindVector,
  evaluateOceanCurrentVector,
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
  labelAnchor?: 'start' | 'end' | 'middle';
  dx?: number;
  dy?: number;
  middlePassageDuration?: string;
  primaryDestination?: string;
  historicalEmbarkations?: string;
}

// Major coastal nodes for visual geographic grounding (Accurately calibrated to African and Atlantic coastlines)
export const NAUTICAL_PORTS: NauticalPortItem[] = [
  // West & Southern African Coastline Anchor Nodes (Calibrated to African continental vector aligned at Gibraltar Strait)
  { 
    name: 'Senegambia (Gorée)', 
    lat: 14.6708, 
    lng: -17.4381, 
    type: 'african-port', 
    note: 'Canary Current Departure (28 days to Caribbean)',
    svgCoord: [565, 270],
    labelAnchor: 'end',
    dx: -9,
    dy: 3.5,
    middlePassageDuration: '28 days to Caribbean',
    primaryDestination: 'Saint-Domingue, Jamaica, Barbados',
    historicalEmbarkations: '340,000+ documented captives'
  },
  { 
    name: 'Sierra Leone (Bunce Island)', 
    lat: 8.4844, 
    lng: -13.2344, 
    type: 'african-port', 
    note: 'Windward Coast departure node & fortified estuary',
    svgCoord: [585, 305],
    labelAnchor: 'end',
    dx: -9,
    dy: 3.5,
    middlePassageDuration: '31 days to North America',
    primaryDestination: 'Charleston, Savannah',
    historicalEmbarkations: '390,000+ documented captives'
  },
  { 
    name: 'Gold Coast (Elmina)', 
    lat: 5.1054, 
    lng: -1.2466, 
    type: 'african-port', 
    note: 'Guinea Current Hub & São Jorge da Mina fort complex',
    svgCoord: [646, 326],
    labelAnchor: 'end',
    dx: -9,
    dy: 3.5,
    middlePassageDuration: '33 days to Bahia & Guianas',
    primaryDestination: 'Salvador da Bahia, Suriname, Jamaica',
    historicalEmbarkations: '1,210,000+ documented captives'
  },
  { 
    name: 'Bight of Benin (Ouidah)', 
    lat: 6.3631, 
    lng: 2.0851, 
    type: 'african-port', 
    note: 'Equatorial Flow directly toward Bahia (34 days)',
    svgCoord: [662, 317],
    labelAnchor: 'start',
    dx: 8,
    dy: -7,
    middlePassageDuration: '34 days direct equatorial run',
    primaryDestination: 'Salvador da Bahia (Direct)',
    historicalEmbarkations: '2,000,000+ documented captives'
  },
  { 
    name: 'Biafra (Bonny)', 
    lat: 4.4539, 
    lng: 7.1639, 
    type: 'african-port', 
    note: 'Niger Delta Estuary & embarkation hub',
    svgCoord: [691, 328],
    labelAnchor: 'start',
    dx: 9,
    dy: 4,
    middlePassageDuration: '36 days to Caribbean & Virginia',
    primaryDestination: 'Jamaica, Saint-Domingue, Virginia',
    historicalEmbarkations: '1,600,000+ documented captives'
  },
  { 
    name: 'Luanda (Angola)', 
    lat: -8.8390, 
    lng: 13.2894, 
    type: 'african-port', 
    note: 'Benguela Highway (Record fast: 39 days to Rio)',
    svgCoord: [714, 397],
    labelAnchor: 'start',
    dx: 9,
    dy: 3.5,
    middlePassageDuration: '39 days (Benguela Conveyor)',
    primaryDestination: 'Rio de Janeiro (Valongo Complex)',
    historicalEmbarkations: '2,800,000+ documented captives'
  },
  { 
    name: 'Benguela (São Filipe)', 
    lat: -12.5763, 
    lng: 13.4055, 
    type: 'african-port', 
    note: 'South Atlantic Gyre southern embarkation port',
    svgCoord: [716, 418],
    labelAnchor: 'start',
    dx: 9,
    dy: 3.5,
    middlePassageDuration: '41 days to Rio & Santos',
    primaryDestination: 'Rio de Janeiro, Santos, Pernambuco',
    historicalEmbarkations: '760,000+ documented captives'
  },
  { 
    name: 'Cape of Good Hope', 
    lat: -34.3568, 
    lng: 18.4740, 
    type: 'african-port', 
    note: 'Agulhas Confluence & southern rounding passage',
    svgCoord: [753, 545],
    labelAnchor: 'middle',
    dx: 0,
    dy: 14,
    middlePassageDuration: '52 days (Agulhas junction passage)',
    primaryDestination: 'St. Helena, Brazil, Batavia',
    historicalEmbarkations: 'Strategic maritime staging node'
  },
  { 
    name: 'Mozambique Channel', 
    lat: -15.0342, 
    lng: 40.7358, 
    type: 'african-port', 
    note: 'Indian Ocean Route to Brazil (62–68 days)',
    svgCoord: [848, 442],
    labelAnchor: 'start',
    dx: 9,
    dy: 3.5,
    middlePassageDuration: '62–68 days via Cape of Good Hope',
    primaryDestination: 'Rio de Janeiro, Maranhão',
    historicalEmbarkations: '540,000+ documented captives'
  },

  // American Disembarkation & Terminal Ports
  { 
    name: 'Salvador da Bahia', 
    lat: -12.9777, 
    lng: -38.5016, 
    type: 'american-port', 
    note: 'Primary Brazil Terminal (32–36 days transit)',
    svgCoord: [437, 412],
    labelAnchor: 'end',
    dx: -9,
    dy: 3.5,
    middlePassageDuration: '32–36 days from Benin & Angola',
    primaryDestination: 'Recôncavo Sugar Basin & Gold Mines',
    historicalEmbarkations: '1,500,000+ disembarkations'
  },
  { 
    name: 'Rio de Janeiro', 
    lat: -22.9068, 
    lng: -43.1729, 
    type: 'american-port', 
    note: 'Valongo Complex & South Atlantic terminal (38–42 days)',
    svgCoord: [423, 444],
    labelAnchor: 'end',
    dx: -9,
    dy: 3.5,
    middlePassageDuration: '38–42 days from Luanda/Benguela',
    primaryDestination: 'Valongo Wharf & Minas Gerais',
    historicalEmbarkations: '2,000,000+ disembarkations'
  },
  { 
    name: 'Recife (Pernambuco)', 
    lat: -8.0476, 
    lng: -34.8770, 
    type: 'american-port', 
    note: 'Nearest American Port (24–28 days transit)',
    svgCoord: [448, 384],
    labelAnchor: 'start',
    dx: 9,
    dy: 3.5,
    middlePassageDuration: '24–28 days (Closest American Port)',
    primaryDestination: 'Pernambuco Sugar Captaincy',
    historicalEmbarkations: '850,000+ disembarkations'
  },
  { 
    name: 'Kingston (Jamaica)', 
    lat: 17.9712, 
    lng: -76.7936, 
    type: 'american-port', 
    note: 'British Caribbean Hub & sugar transshipment',
    svgCoord: [196, 246],
    labelAnchor: 'start',
    dx: 8,
    dy: 3.5,
    middlePassageDuration: '35–40 days from Gold Coast/Biafra',
    primaryDestination: 'Jamaican Sugar Plantations & Spanish Main',
    historicalEmbarkations: '1,000,000+ disembarkations'
  },
  { 
    name: 'Bridgetown (Barbados)', 
    lat: 13.0969, 
    lng: -59.6145, 
    type: 'american-port', 
    note: 'Windward Port of Call for North Atlantic fleets',
    svgCoord: [289, 271],
    labelAnchor: 'start',
    dx: 8,
    dy: 3.5,
    middlePassageDuration: '28–32 days from Senegambia',
    primaryDestination: 'Windward Islands & North America',
    historicalEmbarkations: '600,000+ disembarkations'
  },
  { 
    name: 'Cap-Français (Saint-Domingue)', 
    lat: 19.7595, 
    lng: -72.2008, 
    type: 'american-port', 
    note: 'French Caribbean Center (Haiti)',
    svgCoord: [224, 236],
    labelAnchor: 'end',
    dx: -8,
    dy: -5,
    middlePassageDuration: '30–35 days from Senegambia/Benin',
    primaryDestination: 'Northern Plain Sugar Estates',
    historicalEmbarkations: '800,000+ disembarkations'
  },
  { 
    name: 'Havana (Cuba)', 
    lat: 23.1136, 
    lng: -82.3666, 
    type: 'american-port', 
    note: 'Gulf Stream Gateway & convoy center',
    svgCoord: [175, 210],
    labelAnchor: 'end',
    dx: -8,
    dy: -5,
    middlePassageDuration: '38–45 days via Windward Passage',
    primaryDestination: 'Cuban Sugar Estates & New Spain',
    historicalEmbarkations: '700,000+ disembarkations'
  },
  { 
    name: 'Charleston (South Carolina)', 
    lat: 32.7765, 
    lng: -79.9311, 
    type: 'american-port', 
    note: 'North American Seaboard disembarkation',
    svgCoord: [194, 152],
    labelAnchor: 'end',
    dx: -9,
    dy: 3.5,
    middlePassageDuration: '35–42 days from Sierra Leone/Senegambia',
    primaryDestination: 'Lowcountry Rice & Indigo Plantations',
    historicalEmbarkations: '150,000+ disembarkations'
  },

  // European Metropoles (Calibrated to Natural Earth European landmass)
  { 
    name: 'Lisbon (Tagus)', 
    lat: 38.7223, 
    lng: -9.1393, 
    type: 'european-port', 
    note: 'Canary Current Launchpoint & Casa da Índia',
    svgCoord: [611, 116],
    labelAnchor: 'end',
    dx: -9,
    dy: 3.5,
    middlePassageDuration: 'Outward Voyage to Luanda: 30 days',
    primaryDestination: 'Canaries, Cape Verde & Luanda',
    historicalEmbarkations: 'Metropolitan Portuguese Admiralty Hub'
  },
  { 
    name: 'Liverpool', 
    lat: 53.4084, 
    lng: -2.9916, 
    type: 'european-port', 
    note: 'North Atlantic Departure & triangular trade hub',
    svgCoord: [650, 28],
    labelAnchor: 'end',
    dx: -9,
    dy: 3.5,
    middlePassageDuration: 'Outward Voyage to West Africa: 25 days',
    primaryDestination: 'Sierra Leone, Gold Coast, Biafra',
    historicalEmbarkations: 'Chief British Triangular Fleet Hub'
  },
  { 
    name: 'Nantes', 
    lat: 47.2184, 
    lng: -1.5536, 
    type: 'european-port', 
    note: 'Loire Estuary Fleet & French triangular trade center',
    svgCoord: [659, 65],
    labelAnchor: 'start',
    dx: 9,
    dy: 3.5,
    middlePassageDuration: 'Outward Voyage to West Africa: 28 days',
    primaryDestination: 'Senegambia, Ouidah, Saint-Domingue',
    historicalEmbarkations: 'Principal French Slaver Fleet Port'
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
  
  // Interactive port selection & pinned dossier state
  const [hoveredPort, setHoveredPort] = useState<NauticalPortItem | null>(null);
  const [pinnedPort, setPinnedPort] = useState<NauticalPortItem | null>(null);

  // Real-time cursor coordinates and local flow telemetry
  const [cursorTelemetry, setCursorTelemetry] = useState<{
    lat: number;
    lng: number;
    windName?: string;
    currentName?: string;
    flowSpeed?: string;
  } | null>(null);

  // Local interactive controls for instant on-canvas feedback
  const [localSpeed, setLocalSpeed] = useState<number>(speedMultiplier);
  const [localDensity, setLocalDensity] = useState<'low' | 'medium' | 'high'>(particleDensity);
  const [localShowCurrents, setLocalShowCurrents] = useState<boolean>(showCurrents);
  const [localShowWinds, setLocalShowWinds] = useState<boolean>(showWinds);
  const [localIsPlaying, setLocalIsPlaying] = useState<boolean>(isPlaying);

  // Synchronize local states with external props when they change
  useEffect(() => {
    setLocalSpeed(speedMultiplier);
  }, [speedMultiplier]);

  useEffect(() => {
    setLocalDensity(particleDensity);
  }, [particleDensity]);

  useEffect(() => {
    setLocalShowCurrents(showCurrents);
  }, [showCurrents]);

  useEffect(() => {
    setLocalShowWinds(showWinds);
  }, [showWinds]);

  useEffect(() => {
    setLocalIsPlaying(isPlaying);
  }, [isPlaying]);

  // Dynamic references for canvas render loop
  const activeSeasonRef = useRef<HydrodynamicSeasonId>(activeSeasonId);
  const prevSeasonRef = useRef<HydrodynamicSeasonId>(activeSeasonId);
  const transitionTimeRef = useRef<number>(1.0);

  const showCurrentsRef = useRef(localShowCurrents);
  const showWindsRef = useRef(localShowWinds);
  const speedMultRef = useRef(localSpeed);
  const densityRef = useRef(localDensity);
  const isPlayingRef = useRef(localIsPlaying);
  const themeRef = useRef(theme);

  useEffect(() => {
    if (activeSeasonRef.current !== activeSeasonId) {
      prevSeasonRef.current = activeSeasonRef.current;
      activeSeasonRef.current = activeSeasonId;
      transitionTimeRef.current = 0.0;
    }
  }, [activeSeasonId]);

  useEffect(() => {
    showCurrentsRef.current = localShowCurrents;
  }, [localShowCurrents]);

  useEffect(() => {
    showWindsRef.current = localShowWinds;
  }, [localShowWinds]);

  useEffect(() => {
    speedMultRef.current = localSpeed;
  }, [localSpeed]);

  useEffect(() => {
    densityRef.current = localDensity;
  }, [localDensity]);

  useEffect(() => {
    isPlayingRef.current = localIsPlaying;
  }, [localIsPlaying]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Helper to find initial or respawn coordinates over open ocean water
  const getRandomOceanCoord = (): [number, number] => {
    for (let attempt = 0; attempt < 24; attempt++) {
      const rx = 10 + Math.random() * 980;
      const ry = -80 + Math.random() * 650;
      const lng = -105 + (rx / 1000) * 157;
      const lat = 58 - (ry / 580) * 96;
      if (!isLandLocation(lat, lng)) {
        return [rx, ry];
      }
    }
    return [440, 290]; // Mid-Atlantic safe coordinate fallback
  };

  // Helper for wind particles (winds blow across both open ocean and continental landmasses)
  const getRandomWindCoord = (): [number, number] => {
    const r = Math.random();
    if (r < 0.28) {
      // Upstream Westerlies entry (North Atlantic western corridor)
      return [5 + Math.random() * 80, -100 + Math.random() * 260];
    } else if (r < 0.55) {
      // Upstream Trade Winds entry (Eastern Atlantic / Sahara / Africa)
      return [880 + Math.random() * 110, 160 + Math.random() * 340];
    }
    // Continuous distribution across entire visible canvas including Europe
    return [10 + Math.random() * 980, -110 + Math.random() * 680];
  };

  // Track cursor position for live coordinate telemetry & vector evaluation
  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    const virtX = relX * VIRTUAL_WIDTH;
    const virtY = VIRTUAL_MIN_Y + relY * VIRTUAL_HEIGHT;

    const lng = -105 + (virtX / 1000) * 157;
    const lat = 58 - (virtY / 580) * 96;

    if (lat >= -45 && lat <= 65 && lng >= -105 && lng <= 50) {
      const wVec = evaluateTradeWindVector(lat, lng, activeSeasonRef.current);
      const cVec = evaluateOceanCurrentVector(lat, lng, activeSeasonRef.current);
      setCursorTelemetry({
        lat,
        lng,
        windName: wVec.name,
        currentName: cVec.name,
        flowSpeed: `${(wVec.force * 9.5).toFixed(1)} kn`
      });
    } else {
      setCursorTelemetry(null);
    }
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
        ? getRandomWindCoord()
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

        // Clean out-of-bounds respawn across the complete virtual canvas
        if (age >= maxAge || nextX < -15 || nextX > 1015 || nextY < -115 || nextY > 585) {
          const [spawnX, spawnY] = isWind 
            ? getRandomWindCoord() 
            : getRandomOceanCoord();
          particles[idx] = spawnX;
          particles[idx + 1] = spawnY;
          particles[idx + 2] = 0;
          particles[idx + 3] = 0;
          particles[idx + 4] = 0;
          particles[idx + 5] = 55 + Math.random() * 70;
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

          // Smooth directional arrowhead drawn only when particles have clear forward velocity
          const speed = Math.hypot(effectiveVx, effectiveVy);
          if (speed > 0.08) {
            const ux = effectiveVx / speed;
            const uy = effectiveVy / speed;
            const perpX = -uy;
            const perpY = ux;

            const aLen = 3.6 + force * 0.8;
            const aWid = 2.2 + force * 0.4;

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
              ? `rgba(15, 23, 42, ${Math.min(1.0, windAlpha * 1.15)})` 
              : `rgba(255, 255, 255, ${Math.min(1.0, windAlpha * 1.1)})`;
            ctx.fill();
          }
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
  const activePort = pinnedPort || hoveredPort;

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handlePointerMove}
      onMouseLeave={() => setCursorTelemetry(null)}
      className={`relative w-full h-full min-h-[550px] overflow-hidden select-none transition-colors duration-300 ${
        isLight ? 'bg-[#FAF7F2]' : 'bg-[#040914]'
      } ${className}`}
    >
      {/* 1. Base SVG Cartographic Vector Landmasses & Navigation Grid */}
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
        </g>

        {/* CONTINENTAL VECTORS: EUROPE & BRITISH ISLES */}
        <g id="hydroEurope">
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

        {/* Historic Navigational Rivers */}
        <g stroke={isLight ? "#2563EB" : "#0284C7"} strokeWidth="1.1" fill="none" opacity={isLight ? "0.65" : "0.75"} strokeLinecap="round">
          {HISTORIC_RIVERS.map(river => (
            <path key={river.id} d={river.path} />
          ))}
        </g>

        {/* Authoritative African Continent Vector — Calibrated flawlessly to Europe at the Strait of Gibraltar (Tangier x=625.7, y=150.1) */}
        <AfricaVectorContinent
          x="513.4"
          y="142.1"
          width="421"
          height="406"
          mode="countries"
          theme={isLight ? "parchment" : "dark"}
          strokeWidth={1.2}
          strokeColor={isLight ? "#8C7E64" : "#38bdf8"}
          opacity={0.95}
        />

        {/* Topographic Typography Labels */}
        <g className="pointer-events-none select-none font-serif" style={{ paintOrder: 'stroke fill' }}>
          <text 
            x="706" 
            y="356" 
            fill={isLight ? "#1C1917" : "#ECFDF5"} 
            stroke={isLight ? "#FAF7F2" : "#020617"} 
            strokeWidth="3.5px" 
            strokeLinejoin="round"
            fontSize="19" 
            fontWeight="900" 
            letterSpacing="4" 
            textAnchor="middle"
          >
            AFRICA
          </text>

          <text 
            x="660" 
            y="65" 
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

        {/* Coastal Anchors & Nautical Ports (Calibrated with intelligent text-anchoring to avoid overlapping) */}
        <g id="nauticalPortsLayer" className="pointer-events-auto">
          {NAUTICAL_PORTS.map((port) => {
            const [cx, cy] = port.svgCoord || projectCoord(port.lat, port.lng);
            const isHovered = hoveredPort?.name === port.name;
            const isPinned = pinnedPort?.name === port.name;
            const isAfrican = port.type === 'african-port';
            const isAmerican = port.type === 'american-port';
            const isEuropean = port.type === 'european-port';

            const dotColor = isAfrican ? "#059669" : isAmerican ? "#D97706" : "#2563EB";
            const pulseColor = isAfrican ? "#10B981" : isAmerican ? "#F59E0B" : "#38BDF8";

            const textAnchor = port.labelAnchor || 'start';
            const textX = cx + (port.dx ?? (textAnchor === 'end' ? -8 : textAnchor === 'middle' ? 0 : 8));
            const textY = cy + (port.dy ?? 3.5);

            return (
              <g
                key={port.name}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredPort(port)}
                onMouseLeave={() => setHoveredPort(null)}
                onClick={() => setPinnedPort(p => p?.name === port.name ? null : port)}
              >
                {/* Active or Pinned Radar Beacon Rings */}
                {(isHovered || isPinned) && (
                  <>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={14}
                      fill="none"
                      stroke={pulseColor}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="animate-spin-slow opacity-80"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={20}
                      fill={pulseColor}
                      opacity={0.15}
                      className="animate-pulse"
                    />
                  </>
                )}

                {/* Base Anchor Dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isPinned ? 7.5 : isHovered ? 6.5 : 4}
                  fill={dotColor}
                  stroke={isLight ? "#FAF7F2" : "#020617"}
                  strokeWidth={isPinned ? 2.5 : 1.5}
                  className="transition-all duration-150"
                />

                {/* Port Label with high-contrast halo */}
                <text
                  x={textX}
                  y={textY}
                  textAnchor={textAnchor}
                  fill={
                    isPinned 
                      ? (isLight ? "#B45309" : "#FDE047")
                      : isHovered 
                        ? (isLight ? "#0F172A" : "#FFFFFF") 
                        : isAfrican 
                          ? (isLight ? "#065F46" : "#A7F3D0") 
                          : isAmerican 
                            ? (isLight ? "#92400E" : "#FDE68A")
                            : (isLight ? "#1E40AF" : "#BAE6FD")
                  }
                  fontSize={isPinned ? "10" : isHovered ? "9.5" : "8"}
                  fontFamily="monospace"
                  fontWeight={isPinned || isHovered ? "bold" : "600"}
                  stroke={isLight ? "#FFFFFF" : "#020617"}
                  strokeWidth="3.2px"
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

      {/* 3. Floating HUD Bar — Telemetry, Controls & Streamlines Controls */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto flex items-center flex-wrap gap-2 text-xs font-mono">
        {/* Layer Quick Toggles */}
        <div className={`flex items-center gap-1 p-1 rounded-xl backdrop-blur-md border shadow-lg ${
          isLight ? 'bg-white/90 border-stone-300 text-stone-800' : 'bg-slate-950/80 border-slate-800 text-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => setLocalShowCurrents(v => !v)}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              localShowCurrents
                ? isLight ? 'bg-blue-100 text-blue-900 border border-blue-400/60 shadow-2xs' : 'bg-blue-900/60 text-blue-200 border border-blue-400/50 shadow-xs'
                : 'opacity-40 hover:opacity-75'
            }`}
            title="Toggle Ocean Currents Particles"
          >
            <Waves className="w-3.5 h-3.5 text-blue-500" />
            <span>Currents</span>
          </button>

          <button
            type="button"
            onClick={() => setLocalShowWinds(v => !v)}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              localShowWinds
                ? isLight ? 'bg-cyan-100 text-cyan-900 border border-cyan-400/60 shadow-2xs' : 'bg-cyan-900/60 text-cyan-200 border border-cyan-400/50 shadow-xs'
                : 'opacity-40 hover:opacity-75'
            }`}
            title="Toggle Atmospheric Trade Winds Particles"
          >
            <Wind className="w-3.5 h-3.5 text-cyan-500" />
            <span>Winds</span>
          </button>

          <button
            type="button"
            onClick={() => setLocalIsPlaying(v => !v)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              isLight ? 'hover:bg-stone-200 text-stone-700' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title={localIsPlaying ? 'Pause Simulation' : 'Play Simulation'}
          >
            {localIsPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
          </button>
        </div>

        {/* Speed Multiplier Pills */}
        <div className={`hidden sm:flex items-center gap-0.5 p-1 rounded-xl backdrop-blur-md border shadow-lg ${
          isLight ? 'bg-white/90 border-stone-300 text-stone-800' : 'bg-slate-950/80 border-slate-800 text-slate-200'
        }`}>
          <span className="text-[9.5px] px-1.5 opacity-60 uppercase font-bold">Speed:</span>
          {[0.5, 1.0, 1.5, 2.0].map(s => (
            <button
              key={`speed-${s}`}
              type="button"
              onClick={() => setLocalSpeed(s)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                localSpeed === s
                  ? isLight ? 'bg-amber-600 text-white shadow-2xs' : 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-70'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Particle Density Pills */}
        <div className={`hidden md:flex items-center gap-0.5 p-1 rounded-xl backdrop-blur-md border shadow-lg ${
          isLight ? 'bg-white/90 border-stone-300 text-stone-800' : 'bg-slate-950/80 border-slate-800 text-slate-200'
        }`}>
          <span className="text-[9.5px] px-1.5 opacity-60 uppercase font-bold">Density:</span>
          {(['low', 'medium', 'high'] as const).map(d => (
            <button
              key={`density-${d}`}
              type="button"
              onClick={() => setLocalDensity(d)}
              className={`px-2 py-0.5 rounded-md text-[10px] capitalize font-bold transition-all cursor-pointer ${
                localDensity === d
                  ? isLight ? 'bg-stone-900 text-amber-200 shadow-2xs' : 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                  : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-70'
              }`}
            >
              {d === 'medium' ? 'Med' : d}
            </button>
          ))}
        </div>

        {/* Live Cursor Telemetry Badge */}
        {cursorTelemetry && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md border shadow-lg text-[10.5px] font-mono animate-in fade-in duration-100 ${
            isLight ? 'bg-white/95 border-amber-600/30 text-stone-800' : 'bg-slate-950/90 border-cyan-500/30 text-slate-200'
          }`}>
            <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400">
              <Compass className="w-3.5 h-3.5" />
              <span>{Math.abs(cursorTelemetry.lat).toFixed(1)}°{cursorTelemetry.lat >= 0 ? 'N' : 'S'}, {Math.abs(cursorTelemetry.lng).toFixed(1)}°{cursorTelemetry.lng >= 0 ? 'E' : 'W'}</span>
            </span>
            {cursorTelemetry.currentName && (
              <>
                <span className="opacity-40">•</span>
                <span className="truncate max-w-[140px] text-blue-600 dark:text-blue-300">{cursorTelemetry.currentName}</span>
              </>
            )}
            {cursorTelemetry.windName && (
              <>
                <span className="opacity-40">•</span>
                <span className="truncate max-w-[140px] text-emerald-600 dark:text-emerald-300">{cursorTelemetry.windName}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* 4. Interactive Nautical Port Dossier & Inspection Pill (Pinned or Hovered) */}
      {activePort && (
        <div className={`absolute top-4 sm:top-6 right-4 z-30 pointer-events-auto p-4 rounded-2xl backdrop-blur-xl border shadow-2xl text-left w-80 sm:w-96 font-sans text-xs animate-in fade-in slide-in-from-top-2 duration-150 ${
          isLight
            ? 'bg-[#FAF7F2]/95 border-amber-600/40 text-stone-900'
            : 'bg-slate-950/95 border-amber-500/40 text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.8)]'
        }`}>
          {/* Card Header with Type Badge and Close / Unpin Controls */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-1.5 min-w-0">
              <Anchor className={`w-4 h-4 shrink-0 ${
                activePort.type === 'african-port' 
                  ? 'text-emerald-500' 
                  : activePort.type === 'american-port' 
                    ? 'text-amber-500' 
                    : 'text-blue-500'
              }`} />
              <span className="font-serif font-black text-sm sm:text-base tracking-tight truncate">
                {activePort.name}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {pinnedPort && (
                <button
                  type="button"
                  onClick={() => setPinnedPort(null)}
                  className={`p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-stone-500 dark:text-stone-400`}
                  title="Unpin Port Dossier"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Classification & Role Badge */}
          <div className="mt-2.5 flex items-center justify-between gap-2 text-[10.5px] font-mono">
            <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
              activePort.type === 'african-port'
                ? isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-emerald-900/60 text-emerald-200 border-emerald-500/40'
                : activePort.type === 'american-port'
                  ? isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-900/60 text-amber-200 border-amber-500/40'
                  : isLight ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-blue-900/60 text-blue-200 border-blue-500/40'
            }`}>
              {activePort.type === 'african-port' ? 'African Embarkation Hub' : activePort.type === 'american-port' ? 'American Terminal Port' : 'European Metropole'}
            </span>

            <span className="opacity-75 font-mono text-[10px]">
              {pinnedPort ? '📌 PINNED' : 'HOVER (CLICK TO PIN)'}
            </span>
          </div>

          {/* Historical Description & Navigational Role */}
          <p className="text-xs mt-2 leading-relaxed opacity-90 font-sans">
            {activePort.note}
          </p>

          {/* Middle Passage Key Statistics */}
          <div className="mt-3 pt-2.5 border-t border-black/10 dark:border-white/10 space-y-1.5 font-mono text-[11px]">
            {activePort.middlePassageDuration && (
              <div className="flex items-center justify-between gap-2">
                <span className="opacity-60 text-[10px] uppercase font-bold">Transit Window:</span>
                <span className="font-bold text-amber-600 dark:text-amber-300 text-right">{activePort.middlePassageDuration}</span>
              </div>
            )}

            {activePort.primaryDestination && (
              <div className="flex items-baseline justify-between gap-2">
                <span className="opacity-60 text-[10px] uppercase font-bold shrink-0">Corridor / Target:</span>
                <span className="font-semibold text-right truncate text-cyan-700 dark:text-cyan-300">{activePort.primaryDestination}</span>
              </div>
            )}

            {activePort.historicalEmbarkations && (
              <div className="flex items-center justify-between gap-2">
                <span className="opacity-60 text-[10px] uppercase font-bold">Historical Volume:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 text-right">{activePort.historicalEmbarkations}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-black/5 dark:border-white/5 opacity-70 text-[10px]">
              <span>Latitude: {activePort.lat.toFixed(2)}°</span>
              <span>Longitude: {activePort.lng.toFixed(2)}°</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
