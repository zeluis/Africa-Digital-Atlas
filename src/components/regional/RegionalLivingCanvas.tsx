import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AfricanRegion } from '../../data/types';
import { AfricaUnLogo } from '../AfricaUnLogo';
import { getRegionTonalPalette } from '../../data/unGeoschemeColors';
import { WesternAfricaLivingOverlay } from './overlays/WesternAfricaLivingOverlay';
import { NorthernAfricaLivingOverlay } from './overlays/NorthernAfricaLivingOverlay';
import { CentralAfricaLivingOverlay } from './overlays/CentralAfricaLivingOverlay';
import { EasternAfricaLivingOverlay } from './overlays/EasternAfricaLivingOverlay';
import { SouthernAfricaLivingOverlay } from './overlays/SouthernAfricaLivingOverlay';
import { 
  Sparkles, 
  Cpu, 
  Zap, 
  Trees, 
  Anchor, 
  Pause, 
  Play, 
  Leaf, 
  X, 
  ExternalLink,
  ShieldCheck,
  Compass,
  Crosshair,
  Maximize2
} from 'lucide-react';

export interface RegionalLivingCanvasProps {
  region: AfricanRegion;
  onSelectCountry?: (iso3: string) => void;
  className?: string;
}

export interface ActiveHubDossier {
  title: string;
  category: string;
  description: string;
  metric: string;
  countryCode?: string;
}

const REGION_MEMBERS: Record<AfricanRegion, string[]> = {
  'Northern Africa': ['DZA', 'EGY', 'LBY', 'MAR', 'SDN', 'TUN', 'ESH'],
  'Western Africa': ['BEN', 'BFA', 'CPV', 'CIV', 'GMB', 'GHA', 'GIN', 'GNB', 'LBR', 'MLI', 'MRT', 'NER', 'NGA', 'SEN', 'SLE', 'TGO'],
  'Central Africa': ['AGO', 'CMR', 'CAF', 'TCD', 'COG', 'COD', 'GNQ', 'GAB', 'STP'],
  'Eastern Africa': ['BDI', 'COM', 'DJI', 'ERI', 'ETH', 'KEN', 'MDG', 'MWI', 'MUS', 'MOZ', 'RWA', 'SYC', 'SOM', 'SSD', 'TZA', 'UGA', 'ZMB', 'ZWE', 'XSL'],
  'Southern Africa': ['BWA', 'SWZ', 'LSO', 'NAM', 'ZAF']
};

/**
 * Centered bounding viewboxes calculated to contain all member nations and overlay animations
 * without any cropping across all screen sizes.
 */
export const REGIONAL_VIEWBOXES: Record<AfricanRegion, string> = {
  'Northern Africa': '450 0 5000 2650',
  'Western Africa': '-250 700 3700 3150',
  'Central Africa': '1500 950 3500 3800',
  'Eastern Africa': '3100 1350 3300 4100',
  'Southern Africa': '2250 4250 2800 2000'
};

export const RegionalLivingCanvas: React.FC<RegionalLivingCanvasProps> = ({
  region,
  onSelectCountry,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [ecoMode, setEcoMode] = useState(false);
  const [zoomMode, setZoomMode] = useState<'focused' | 'continental'>('focused');
  const [themeFilter, setThemeFilter] = useState<'all' | 'tech' | 'energy' | 'climate' | 'history'>('all');
  const [selectedHub, setSelectedHub] = useState<ActiveHubDossier | null>(null);

  const tonal = getRegionTonalPalette(region);
  const memberIso3s = useMemo(() => new Set(REGION_MEMBERS[region] || []), [region]);

  // Current active SVG viewBox: dynamically centered upon region selection
  const currentViewBox = useMemo(() => {
    if (zoomMode === 'continental') {
      return '-240 0 6036 5867';
    }
    return REGIONAL_VIEWBOXES[region] || '-240 0 6036 5867';
  }, [region, zoomMode]);

  // Viewport Auto-Sleep IntersectionObserver: Pauses all animations when out of view (0% CPU)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Build custom color map: illuminate current region members in warm accent, dim non-members
  const customColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    Object.values(REGION_MEMBERS).flat().forEach(iso3 => {
      if (memberIso3s.has(iso3)) {
        map[iso3] = tonal.warmAccent;
      } else {
        map[iso3] = '#e2e8f0'; // Subtle dimmed warm slate
      }
    });
    return map;
  }, [memberIso3s, tonal.warmAccent]);

  const filterOptions = [
    { id: 'all' as const, label: 'All Synergy', icon: Sparkles },
    { id: 'tech' as const, label: 'Tech & Science', icon: Cpu },
    { id: 'energy' as const, label: 'Clean Energy', icon: Zap },
    { id: 'climate' as const, label: 'Biosphere', icon: Trees },
    { id: 'history' as const, label: 'TAST & Heritage', icon: Anchor },
  ];

  return (
    <div 
      ref={containerRef}
      id="regional-living-canvas"
      className={`rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white via-zinc-50/50 to-zinc-100/50 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950 p-4 md:p-6 shadow-2xl relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Hardware-Accelerated CSS Keyframes embedded inside the component */}
      <style>{`
        @keyframes regionalDashMove {
          to { stroke-dashoffset: -1000; }
        }
        @keyframes regionalDashReverse {
          to { stroke-dashoffset: 1000; }
        }
        @keyframes regionalRadarPulse {
          0% { r: 40px; opacity: 0.85; }
          50% { opacity: 0.45; }
          100% { r: 150px; opacity: 0; }
        }
        @keyframes regionalPulseSlow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        .animate-dash-fast {
          animation: regionalDashMove 14s linear infinite;
        }
        .animate-dash-med {
          animation: regionalDashMove 24s linear infinite;
        }
        .animate-dash-slow {
          animation: regionalDashMove 36s linear infinite;
        }
        .animate-dash-reverse {
          animation: regionalDashReverse 16s linear infinite;
        }
        .animate-radar-pulse {
          animation: regionalRadarPulse 2.8s cubic-bezier(0.2, 0.6, 0.4, 1) infinite;
        }
        .animate-pulse-slow {
          animation: regionalPulseSlow 4s ease-in-out infinite;
        }
        /* ZERO-COST AUTO SLEEP & ECO MODE: freezes all GPU & CPU animation ticks */
        .canvas-paused * {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Atmospheric Ambient Glow */}
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-25 transition-opacity"
        style={{ background: tonal.warmAccent }}
      />

      {/* Top Controls Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-10 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4">
        {/* Title & Metadata */}
        <div>
          <div className="flex items-center gap-2">
            <span 
              className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: `${tonal.warmAccent}15`,
                borderColor: `${tonal.warmAccent}40`,
                color: tonal.warmAccent
              }}
            >
              LIVING CONTINENTAL ATLAS • 60 FPS
            </span>
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              UN M49: {tonal.m49Code}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 font-display mt-1">
            {region} Vector Dynamics
          </h2>
        </div>

        {/* Theme Filters & Battery Saver Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Filter Pills */}
          <div className="flex items-center bg-zinc-100/90 dark:bg-zinc-900/90 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 gap-1">
            {filterOptions.map(opt => {
              const Icon = opt.icon;
              const isCurrent = themeFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setThemeFilter(opt.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs scale-[1.02]'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                  style={isCurrent ? { color: tonal.warmAccent } : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Focus Zoom vs Continental Perspective Toggle */}
          <button
            onClick={() => setZoomMode(prev => prev === 'focused' ? 'continental' : 'focused')}
            title={zoomMode === 'focused' ? "Show full continental map" : `Center and focus on ${region}`}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer border ${
              zoomMode === 'focused'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300'
                : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px]">{zoomMode === 'focused' ? 'Centered Focus' : 'Continental'}</span>
          </button>

          {/* Eco Mode / Battery Saver Toggle */}
          <button
            onClick={() => setEcoMode(!ecoMode)}
            title={ecoMode ? "Resume live dynamic vector animations" : "Activate Eco Mode (Freeze animations to save GPU/battery)"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer border ${
              ecoMode
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            {ecoMode ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{ecoMode ? 'Eco Active (0% GPU)' : 'Live Motion'}</span>
          </button>
        </div>
      </div>

      {/* Main Vector Map Stage */}
      <div className={`relative my-4 flex items-center justify-center min-h-[480px] md:min-h-[580px] h-[520px] md:h-[620px] w-full ${(!isVisible || ecoMode) ? 'canvas-paused' : ''}`}>
        {/* Background Graticule Grid & Nautical Accents */}
        <div className="absolute inset-0 pointer-events-none opacity-25 flex items-center justify-center">
          <div className="w-full h-full border border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl" />
          <div className="absolute w-full h-[1px] bg-zinc-300/60 dark:bg-zinc-700/60" />
          <div className="absolute h-full w-[1px] bg-zinc-300/60 dark:bg-zinc-700/60" />
          <div className="absolute w-72 h-72 border border-zinc-300/40 dark:border-zinc-700/40 rounded-full" />
        </div>

        {/* Full Continental Authentic SVG Map Layer (Hardware-isolated, Centered & Dynamic) */}
        <AfricaUnLogo
          className="w-full h-full max-h-[600px] drop-shadow-[0_12px_28px_rgba(0,0,0,0.08)] select-none transition-all duration-700 ease-in-out"
          interactive={false}
          glow={false}
          viewBox={currentViewBox}
          strokeColor="#ffffff"
          strokeWidth={1}
          customColorMap={customColorMap}
          showIslands={true}
        >
          {/* Dynamic Regional Overlay Driven by Selected UN Geoscheme Region */}
          {region === 'Western Africa' && (
            <WesternAfricaLivingOverlay
              themeFilter={themeFilter}
              onSelectHub={setSelectedHub}
            />
          )}

          {region === 'Northern Africa' && (
            <NorthernAfricaLivingOverlay
              themeFilter={themeFilter}
              onSelectHub={setSelectedHub}
            />
          )}

          {region === 'Central Africa' && (
            <CentralAfricaLivingOverlay
              themeFilter={themeFilter}
              onSelectHub={setSelectedHub}
            />
          )}

          {region === 'Eastern Africa' && (
            <EasternAfricaLivingOverlay
              themeFilter={themeFilter}
              onSelectHub={setSelectedHub}
            />
          )}

          {region === 'Southern Africa' && (
            <SouthernAfricaLivingOverlay
              themeFilter={themeFilter}
              onSelectHub={setSelectedHub}
            />
          )}
        </AfricaUnLogo>

        {/* Floating Selected Hub Dossier Modal */}
        {selectedHub && (
          <div 
            className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 p-4 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-start justify-between gap-2">
              <span 
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                style={{
                  backgroundColor: `${tonal.warmAccent}15`,
                  borderColor: `${tonal.warmAccent}40`,
                  color: tonal.warmAccent
                }}
              >
                {selectedHub.category}
              </span>
              <button
                onClick={() => setSelectedHub(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mt-2 font-display">
              {selectedHub.title}
            </h4>

            <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {selectedHub.metric}
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">
              {selectedHub.description}
            </p>

            {selectedHub.countryCode && onSelectCountry && (
              <button
                onClick={() => {
                  if (selectedHub.countryCode) {
                    onSelectCountry(selectedHub.countryCode);
                  }
                }}
                className="w-full mt-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-xs"
              >
                <span>Inspect National Profile ({selectedHub.countryCode})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Informational Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-zinc-200/80 dark:border-zinc-800/80 pt-3 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Interactive Cartography: Click any pulsing beacon to inspect megaprojects & innovation hubs</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: tonal.warmAccent }} />
          <span>{region} ({memberIso3s.size} Member States)</span>
        </div>
      </div>
    </div>
  );
};
