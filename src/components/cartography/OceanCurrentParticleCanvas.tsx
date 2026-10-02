import React, { useEffect, useRef, useState } from 'react';
import { 
  OceanCurrentDef, 
  SeasonalWindRegime 
} from '../../data/archivalCartographyData';
import { 
  Anchor,
  X,
  Compass
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

export interface TelemetryData {
  lat: number;
  lng: number;
  windName?: string;
  currentName?: string;
  flowSpeed?: string;
}

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
  onTelemetryChange?: (telemetry: TelemetryData | null) => void;
}

export interface NauticalPortItem {
  name: string;
  lat: number;
  lng: number;
  type: 'african-port' | 'american-port' | 'european-port';
  regionLabel: string;
  dotColor: string;
  pulseColor: string;
  labelColorLight: string;
  labelColorDark: string;
  note: string;
  svgCoord?: [number, number];
  labelAnchor?: 'start' | 'end' | 'middle';
  dx?: number;
  dy?: number;
  middlePassageDuration?: string;
  primaryDestination?: string;
  historicalEmbarkations?: string;
}

// Major coastal nodes for visual geographic grounding (Accurately calibrated with UN geoscheme & transatlantic corridor colors)
export const NAUTICAL_PORTS: NauticalPortItem[] = [
  // West African Coastline Anchor Nodes — UN Western Africa Color (#16A34A Green)
  { 
    name: 'Senegambia (Gorée)', 
    lat: 14.6708, 
    lng: -17.4381, 
    type: 'african-port', 
    regionLabel: 'Western Africa (UN Green)',
    dotColor: '#16A34A',
    pulseColor: '#22C55E',
    labelColorLight: '#064E3B',
    labelColorDark: '#86EFAC',
    note: 'Canary Current Departure (28 days to Caribbean)',
    svgCoord: [565, 270],
    labelAnchor: 'end',
    dx: -10,
    dy: -2,
    middlePassageDuration: '28 days to Caribbean',
    primaryDestination: 'Saint-Domingue, Jamaica, Barbados',
    historicalEmbarkations: '340,000+ documented captives'
  },
  { 
    name: 'Sierra Leone (Bunce Island)', 
    lat: 8.4844, 
    lng: -13.2344, 
    type: 'african-port', 
    regionLabel: 'Western Africa (UN Green)',
    dotColor: '#16A34A',
    pulseColor: '#22C55E',
    labelColorLight: '#064E3B',
    labelColorDark: '#86EFAC',
    note: 'Windward Coast departure node & fortified estuary',
    svgCoord: [585, 305],
    labelAnchor: 'end',
    dx: -10,
    dy: 4,
    middlePassageDuration: '31 days to North America',
    primaryDestination: 'Charleston, Savannah',
    historicalEmbarkations: '390,000+ documented captives'
  },
  { 
    name: 'Gold Coast (Elmina)', 
    lat: 5.1054, 
    lng: -1.2466, 
    type: 'african-port', 
    regionLabel: 'Western Africa (UN Green)',
    dotColor: '#16A34A',
    pulseColor: '#22C55E',
    labelColorLight: '#064E3B',
    labelColorDark: '#86EFAC',
    note: 'Guinea Current Hub & São Jorge da Mina fort complex',
    svgCoord: [646, 326],
    labelAnchor: 'end',
    dx: -10,
    dy: 4,
    middlePassageDuration: '33 days to Bahia & Guianas',
    primaryDestination: 'Salvador da Bahia, Suriname, Jamaica',
    historicalEmbarkations: '1,210,000+ documented captives'
  },
  { 
    name: 'Bight of Benin (Ouidah)', 
    lat: 6.3631, 
    lng: 2.0851, 
    type: 'african-port', 
    regionLabel: 'Western Africa (UN Green)',
    dotColor: '#16A34A',
    pulseColor: '#22C55E',
    labelColorLight: '#064E3B',
    labelColorDark: '#86EFAC',
    note: 'Equatorial Flow directly toward Bahia (34 days)',
    svgCoord: [662, 317],
    labelAnchor: 'start',
    dx: 8,
    dy: -8,
    middlePassageDuration: '34 days direct equatorial run',
    primaryDestination: 'Salvador da Bahia (Direct)',
    historicalEmbarkations: '2,000,000+ documented captives'
  },
  { 
    name: 'Biafra (Bonny)', 
    lat: 4.4539, 
    lng: 7.1639, 
    type: 'african-port', 
    regionLabel: 'Western Africa (UN Green)',
    dotColor: '#16A34A',
    pulseColor: '#22C55E',
    labelColorLight: '#064E3B',
    labelColorDark: '#86EFAC',
    note: 'Niger Delta Estuary & embarkation hub',
    svgCoord: [691, 328],
    labelAnchor: 'start',
    dx: 9,
    dy: 4.5,
    middlePassageDuration: '36 days to Caribbean & Virginia',
    primaryDestination: 'Jamaica, Saint-Domingue, Virginia',
    historicalEmbarkations: '1,600,000+ documented captives'
  },

  // Central African Coastline Anchor Nodes — UN Central Africa Color (#D900D8 Fuchsia/Magenta)
  { 
    name: 'Luanda (Angola)', 
    lat: -8.8390, 
    lng: 13.2894, 
    type: 'african-port', 
    regionLabel: 'Central Africa (UN Fuchsia)',
    dotColor: '#D900D8',
    pulseColor: '#FF00FE',
    labelColorLight: '#701A75',
    labelColorDark: '#F5D0FE',
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
    regionLabel: 'Central Africa (UN Fuchsia)',
    dotColor: '#D900D8',
    pulseColor: '#FF00FE',
    labelColorLight: '#701A75',
    labelColorDark: '#F5D0FE',
    note: 'South Atlantic Gyre southern embarkation port',
    svgCoord: [716, 418],
    labelAnchor: 'start',
    dx: 9,
    dy: 3.5,
    middlePassageDuration: '41 days to Rio & Santos',
    primaryDestination: 'Rio de Janeiro, Santos, Pernambuco',
    historicalEmbarkations: '760,000+ documented captives'
  },

  // Southern African Anchor Node — UN Southern Africa Color (#DC2626 Red)
  { 
    name: 'Cape of Good Hope', 
    lat: -34.3568, 
    lng: 18.4740, 
    type: 'african-port', 
    regionLabel: 'Southern Africa (UN Red)',
    dotColor: '#DC2626',
    pulseColor: '#FF0A0A',
    labelColorLight: '#7F1D1D',
    labelColorDark: '#FECACA',
    note: 'Agulhas Confluence & southern rounding passage',
    svgCoord: [753, 545],
    labelAnchor: 'middle',
    dx: 0,
    dy: 14,
    middlePassageDuration: '52 days (Agulhas junction passage)',
    primaryDestination: 'St. Helena, Brazil, Batavia',
    historicalEmbarkations: 'Strategic maritime staging node'
  },

  // Eastern African Anchor Node — UN Eastern Africa Color (#EA580C Orange)
  { 
    name: 'Mozambique Channel', 
    lat: -15.0342, 
    lng: 40.7358, 
    type: 'african-port', 
    regionLabel: 'Eastern Africa (UN Orange)',
    dotColor: '#EA580C',
    pulseColor: '#FFA500',
    labelColorLight: '#7C2D12',
    labelColorDark: '#FED7AA',
    note: 'Indian Ocean Route to Brazil (62–68 days)',
    svgCoord: [848, 442],
    labelAnchor: 'start',
    dx: 9,
    dy: 3.5,
    middlePassageDuration: '62–68 days via Cape of Good Hope',
    primaryDestination: 'Rio de Janeiro, Maranhão',
    historicalEmbarkations: '540,000+ documented captives'
  },

  // European Metropoles — Red Color (#EF4444) (Y shifted down by 8px, X shifted left by 4px)
  { 
    name: 'Lisbon (Tagus)', 
    lat: 38.7223, 
    lng: -9.1393, 
    type: 'european-port', 
    regionLabel: 'Europe (Metropole)',
    dotColor: '#EF4444',
    pulseColor: '#F87171',
    labelColorLight: '#991B1B',
    labelColorDark: '#FCA5A5',
    note: 'Canary Current Launchpoint & Casa da Índia',
    svgCoord: [607, 126],
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
    regionLabel: 'Europe (Metropole)',
    dotColor: '#EF4444',
    pulseColor: '#F87171',
    labelColorLight: '#991B1B',
    labelColorDark: '#FCA5A5',
    note: 'North Atlantic Departure & triangular trade hub',
    svgCoord: [646, 38],
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
    regionLabel: 'Europe (Metropole)',
    dotColor: '#EF4444',
    pulseColor: '#F87171',
    labelColorLight: '#991B1B',
    labelColorDark: '#FCA5A5',
    note: 'Loire Estuary Fleet & French triangular trade center',
    svgCoord: [655, 75],
    labelAnchor: 'start',
    dx: 9,
    dy: 3.5,
    middlePassageDuration: 'Outward Voyage to West Africa: 28 days',
    primaryDestination: 'Senegambia, Ouidah, Saint-Domingue',
    historicalEmbarkations: 'Principal French Slaver Fleet Port'
  },

  // American Disembarkation Ports — Tint variations correlated with African origins:
  // 1. South American Ports (Central Africa Corridor -> Fuchsia/Magenta/Purple Tint Variations)
  { 
    name: 'Salvador da Bahia', 
    lat: -12.9777, 
    lng: -38.5016, 
    type: 'american-port', 
    regionLabel: 'South America (Central Africa Corridor)',
    dotColor: '#C026D3',
    pulseColor: '#E879F9',
    labelColorLight: '#701A75',
    labelColorDark: '#F5D0FE',
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
    regionLabel: 'South America (Central Africa Corridor)',
    dotColor: '#9333EA',
    pulseColor: '#C084FC',
    labelColorLight: '#581C87',
    labelColorDark: '#E9D5FF',
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
    regionLabel: 'South America (Central Africa Corridor)',
    dotColor: '#DB2777',
    pulseColor: '#F472B6',
    labelColorLight: '#831843',
    labelColorDark: '#FBCFE8',
    note: 'Nearest American Port (24–28 days transit)',
    svgCoord: [448, 384],
    labelAnchor: 'start',
    dx: 9,
    dy: 3.5,
    middlePassageDuration: '24–28 days (Closest American Port)',
    primaryDestination: 'Pernambuco Sugar Captaincy',
    historicalEmbarkations: '850,000+ disembarkations'
  },

  // 2. Caribbean & North American Ports (West Africa Corridor -> Green/Teal Tint Variations)
  { 
    name: 'Charleston (South Carolina)', 
    lat: 32.7765, 
    lng: -79.9311, 
    type: 'american-port', 
    regionLabel: 'North America (West Africa Corridor)',
    dotColor: '#059669',
    pulseColor: '#34D399',
    labelColorLight: '#064E3B',
    labelColorDark: '#A7F3D0',
    note: 'North American Seaboard disembarkation',
    svgCoord: [194, 152],
    labelAnchor: 'end',
    dx: -9,
    dy: 3.5,
    middlePassageDuration: '35–42 days from Sierra Leone/Senegambia',
    primaryDestination: 'Lowcountry Rice & Indigo Plantations',
    historicalEmbarkations: '150,000+ disembarkations'
  },
  { 
    name: 'Kingston (Jamaica)', 
    lat: 17.9712, 
    lng: -76.7936, 
    type: 'american-port', 
    regionLabel: 'Caribbean (West Africa Corridor)',
    dotColor: '#0D9488',
    pulseColor: '#2DD4BF',
    labelColorLight: '#134E4A',
    labelColorDark: '#99F6E4',
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
    regionLabel: 'Caribbean (West Africa Corridor)',
    dotColor: '#10B981',
    pulseColor: '#6EE7B7',
    labelColorLight: '#064E3B',
    labelColorDark: '#A7F3D0',
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
    regionLabel: 'Caribbean (West Africa Corridor)',
    dotColor: '#15803D',
    pulseColor: '#4ADE80',
    labelColorLight: '#14532D',
    labelColorDark: '#BBF7D0',
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
    regionLabel: 'Caribbean (West Africa Corridor)',
    dotColor: '#0F766E',
    pulseColor: '#14B8A6',
    labelColorLight: '#134E4A',
    labelColorDark: '#99F6E4',
    note: 'Gulf Stream Gateway & convoy center',
    svgCoord: [175, 210],
    labelAnchor: 'end',
    dx: -8,
    dy: -5,
    middlePassageDuration: '38–45 days via Windward Passage',
    primaryDestination: 'Cuban Sugar Estates & New Spain',
    historicalEmbarkations: '700,000+ disembarkations'
  }
];

// Virtual coordinate space with top headroom and edge-to-edge span
const VIRTUAL_WIDTH = 1000;
const VIRTUAL_HEIGHT = 700;
const VIRTUAL_MIN_Y = -120;

const OceanCurrentParticleCanvasComponent: React.FC<OceanCurrentParticleCanvasProps> = ({
  activeSeasonId,
  showCurrents = true,
  showWinds = true,
  isPlaying = true,
  speedMultiplier = 1.0,
  particleDensity = 'medium',
  theme = 'dark',
  className = '',
  onSelectCurrent,
  onTelemetryChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef<boolean>(true);
  const lastTelemetryTimeRef = useRef<number>(0);
  
  // Interactive port selection & pinned dossier state
  const [hoveredPort, setHoveredPort] = useState<NauticalPortItem | null>(null);
  const [pinnedPort, setPinnedPort] = useState<NauticalPortItem | null>(null);

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

  // Purely detached pointer move: updates parent telemetry via lightweight RAF/time throttle with ZERO canvas re-renders
  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onTelemetryChange || !containerRef.current) return;
    const now = performance.now();
    if (now - lastTelemetryTimeRef.current < 60) return;
    lastTelemetryTimeRef.current = now;

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
      onTelemetryChange({
        lat,
        lng,
        windName: wVec.name,
        currentName: cVec.name,
        flowSpeed: `${(wVec.force * 9.5).toFixed(1)} kn`
      });
    } else {
      onTelemetryChange(null);
    }
  };

  const handlePointerLeave = () => {
    if (onTelemetryChange) {
      onTelemetryChange(null);
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
      // Calibrated baseline velocity multiplier: decreased overall speed while preserving quarterly differentials
      const globalSpeedFactor = SEASONAL_HYDRO_METRICS[curSeason].speedFactor * speedMultRef.current * 0.62;
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
          const windAlpha = Math.max(0.22, particleAlpha * 0.95);
          const streakLen = 2.0 + force * 2.8;
          const prevX = nextX - effectiveVx * streakLen;
          const prevY = nextY - effectiveVy * streakLen;

          // Geographic coordinate of wind particle
          const partLat = 58 - (nextY / 580) * 96;
          const partLng = -105 + (nextX / 1000) * 157;
          // Northeast Trade winds entering and crossing the Sahara Desert (15°N to 34°N, -18°W to 35°E)
          const isSahara = partLat >= 15 && partLat <= 34 && partLng >= -18 && partLng <= 35;

          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(nextX, nextY);
          
          if (isSahara) {
            // Very pale translucent desert tint for Saharan trade winds
            ctx.strokeStyle = isLightTheme 
              ? `rgba(234, 179, 8, ${windAlpha * 0.35})` 
              : `rgba(254, 240, 138, ${windAlpha * 0.30})`;
          } else {
            // PURE WHITE for all Trade Wind streamlines across the Atlantic (Zero blue color)
            ctx.strokeStyle = isLightTheme 
              ? `rgba(255, 255, 255, ${windAlpha * 0.95})` 
              : `rgba(255, 255, 255, ${windAlpha * 0.92})`;
          }
          ctx.lineWidth = 0.9 + force * 0.4;
          ctx.stroke();

          // Smooth directional white arrowhead drawn only when particles have clear forward velocity
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
            // Crisp Pure White Arrowhead (Zero Blue)
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, windAlpha * 1.3)})`;
            ctx.fill();

            if (isLightTheme) {
              ctx.strokeStyle = `rgba(20, 20, 20, ${Math.min(0.7, windAlpha * 0.95)})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        } else {
          // Cold and warm oceanic current particles (Smooth, continuous fluid streamlines)
          const nextLat = 58 - (nextY / 580) * 96;
          const isEquatorial = nextLat > -5 && nextLat < 12;
          const currentAlpha = Math.max(0.2, particleAlpha * 0.92);
          const streakLen = 2.6 + force * 2.8;

          const speed = Math.hypot(effectiveVx, effectiveVy) || 1;
          const perpX = -effectiveVy / speed;
          const perpY = effectiveVx / speed;

          // Gentle, slow, continuous long undulation (no multi-harmonics, no high-frequency vibration)
          const waveFreq = 0.07;
          const wavePhase = (age * waveFreq) + (i * 0.45);
          const swiggleAmp = isEquatorial ? 0.35 : 0.95;
          const waveOffset = Math.sin(wavePhase) * swiggleAmp;

          const headX = nextX;
          const headY = nextY;
          const tailX = nextX - effectiveVx * streakLen;
          const tailY = nextY - effectiveVy * streakLen;

          // Smooth quadratic midpoint offset for a long, continuous, elegant fluid arc
          const midX = (headX + tailX) * 0.5 + perpX * waveOffset;
          const midY = (headY + tailY) * 0.5 + perpY * waveOffset;

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.quadraticCurveTo(midX, midY, headX, headY);
          
          if (isLightTheme) {
            // Cold swell currents: Vibrant turquoise cyan-blue swimming streams
            ctx.strokeStyle = isEquatorial
              ? `rgba(217, 119, 6, ${currentAlpha * 0.88})` 
              : `rgba(6, 182, 212, ${currentAlpha * 0.95})`;
          } else {
            ctx.strokeStyle = isEquatorial
              ? `rgba(245, 158, 11, ${currentAlpha * 0.85})` 
              : `rgba(34, 211, 238, ${currentAlpha * 0.96})`;
          }
          ctx.lineWidth = 1.05 + force * 0.4;
          ctx.lineCap = 'round';
          ctx.stroke();
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
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
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
          x="514.2"
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

            const dotColor = port.dotColor;
            const pulseColor = port.pulseColor;
            const labelColor = isLight ? (port.labelColorLight || '#064E3B') : (port.labelColorDark || '#A7F3D0');

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
                        : labelColor
                  }
                  fontSize={isPinned ? "10" : isHovered ? "9.5" : "8"}
                  fontFamily="monospace"
                  fontWeight={isPinned || isHovered ? "bold" : "600"}
                  stroke={isLight ? "#FFFFFF" : "#020617"}
                  strokeWidth="3.4px"
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

      {/* 3. Sliding Glassmorphic Nautical Port Dossier Card (Positioned directly near the active port, high contrast) */}
      {activePort && (() => {
        const [cx, cy] = activePort.svgCoord || projectCoord(activePort.lat, activePort.lng);
        const pctX = (cx / 1000) * 100;
        const pctY = ((cy + 120) / 700) * 100;
        const isLeftHalf = cx < 550;

        return (
          <div 
            style={{
              left: isLeftHalf ? `clamp(14px, calc(${pctX}% + 22px), calc(100% - 370px))` : undefined,
              right: !isLeftHalf ? `clamp(14px, calc(${100 - pctX}% + 22px), calc(100% - 370px))` : undefined,
              top: `clamp(84px, calc(${pctY}% - 70px), calc(100% - 320px))`
            }}
            className={`absolute z-30 pointer-events-auto p-4 rounded-2xl backdrop-blur-2xl border-2 shadow-2xl text-left w-80 sm:w-92 font-sans text-xs transition-all duration-300 ease-out animate-in fade-in duration-200 ${
              isLight
                ? 'bg-white/98 border-stone-400 text-stone-950 shadow-[0_16px_45px_rgba(0,0,0,0.22)]'
                : 'bg-[#060D1A]/98 border-cyan-500/60 text-white shadow-[0_16px_45px_rgba(0,0,0,0.9)]'
            }`}
          >
            {/* Card Header with Port Name, Anchor Icon tinted in port color, and Unpin Controls */}
            <div className={`flex items-center justify-between gap-2 pb-2.5 border-b ${
              isLight ? 'border-stone-200' : 'border-slate-800'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: isLight ? `${activePort.dotColor}18` : `${activePort.dotColor}30`,
                    borderColor: isLight ? `${activePort.dotColor}60` : `${activePort.dotColor}80`
                  }}
                >
                  <Anchor 
                    className="w-3.5 h-3.5 shrink-0" 
                    style={{ color: isLight ? (activePort.labelColorLight || activePort.dotColor) : activePort.dotColor }} 
                  />
                </div>
                <span className={`font-serif font-black text-sm sm:text-base tracking-tight truncate ${
                  isLight ? 'text-stone-950' : 'text-slate-50'
                }`}>
                  {activePort.name}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {pinnedPort && (
                  <button
                    type="button"
                    onClick={() => setPinnedPort(null)}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      isLight 
                        ? 'hover:bg-stone-200 text-stone-700 hover:text-stone-950' 
                        : 'hover:bg-white/10 text-slate-400 hover:text-white'
                    }`}
                    title="Unpin Port Dossier"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Classification & Role Badge matching port's color identity */}
            <div className="mt-2.5 flex items-center justify-between gap-2 text-[10.5px] font-mono">
              <span 
                className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] font-mono border"
                style={{
                  backgroundColor: isLight ? `${activePort.dotColor}20` : `${activePort.dotColor}35`,
                  borderColor: isLight ? `${activePort.dotColor}70` : `${activePort.dotColor}90`,
                  color: isLight ? (activePort.labelColorLight || '#0F172A') : (activePort.labelColorDark || '#F8FAFC')
                }}
              >
                {activePort.regionLabel}
              </span>

              <span className={`font-mono font-bold text-[10px] ${
                isLight ? 'text-stone-700' : 'text-slate-400'
              }`}>
                {pinnedPort ? '📌 PINNED' : 'CLICK TO PIN'}
              </span>
            </div>

            {/* Historical Description & Navigational Role */}
            <p className={`text-xs mt-2.5 leading-relaxed font-sans font-medium ${
              isLight ? 'text-stone-900' : 'text-slate-200'
            }`}>
              {activePort.note}
            </p>

            {/* Middle Passage Key Statistics - High Contrast */}
            <div className={`mt-3 pt-2.5 border-t space-y-1.5 font-mono text-[11px] ${
              isLight ? 'border-stone-200' : 'border-slate-800'
            }`}>
              {activePort.middlePassageDuration && (
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10.5px] uppercase font-black ${
                    isLight ? 'text-stone-900' : 'text-slate-300'
                  }`}>Transit Window:</span>
                  <span className={`font-black text-right ${
                    isLight ? 'text-amber-800' : 'text-amber-300'
                  }`}>{activePort.middlePassageDuration}</span>
                </div>
              )}

              {activePort.primaryDestination && (
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`text-[10.5px] uppercase font-black shrink-0 ${
                    isLight ? 'text-stone-900' : 'text-slate-300'
                  }`}>Corridor / Target:</span>
                  <span className={`font-bold text-right truncate ${
                    isLight ? 'text-cyan-900' : 'text-cyan-300'
                  }`}>{activePort.primaryDestination}</span>
                </div>
              )}

              {activePort.historicalEmbarkations && (
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10.5px] uppercase font-black ${
                    isLight ? 'text-stone-900' : 'text-slate-300'
                  }`}>Historical Volume:</span>
                  <span className={`font-black text-right ${
                    isLight ? 'text-rose-800' : 'text-rose-300'
                  }`}>{activePort.historicalEmbarkations}</span>
                </div>
              )}

              <div className={`flex items-center justify-between gap-2 pt-1.5 border-t text-[10px] font-bold ${
                isLight ? 'border-stone-200 text-stone-800' : 'border-slate-800 text-slate-400'
              }`}>
                <span>Latitude: {activePort.lat.toFixed(2)}°</span>
                <span>Longitude: {activePort.lng.toFixed(2)}°</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export const OceanCurrentParticleCanvas = React.memo(OceanCurrentParticleCanvasComponent);
