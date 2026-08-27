import React, { useState } from 'react';
import { AfricanRegion } from '../data/types';
import { REGIONAL_SILHOUETTES, RegionalSilhouetteData } from '../data/svgGeographySystem';
import { AFRICA_SVG_MAP } from '../data/svgMaps';
import { CountryFlag } from './CountryFlag';
import { 
  Globe2, 
  Download, 
  MapPin, 
  Maximize2, 
  Crosshair, 
  CheckCircle2, 
  Compass,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface RegionalSilhouetteProps {
  region: AfricanRegion;
  onSelectCountry?: (iso3: string) => void;
  className?: string;
  showMemberList?: boolean;
}

export const RegionalSilhouette: React.FC<RegionalSilhouetteProps> = ({
  region,
  onSelectCountry,
  className = '',
  showMemberList = true
}) => {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [showCapitals, setShowCapitals] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const data: RegionalSilhouetteData = REGIONAL_SILHOUETTES[region];
  if (!data) return null;

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById(`regional-svg-${data.m49Code}`);
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgEl);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UN_M49_${data.m49Code}_${data.name.replace(/\s+/g, '_')}_silhouette.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className={`rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 p-5 shadow-xl backdrop-blur-md space-y-4 overflow-hidden transition-colors ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md text-zinc-950 font-black font-mono text-xs"
            style={{ background: data.palette.primary }}
          >
            {data.m49Code}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                {data.name} Silhouette
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
                UN M49: {data.m49Code}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Deterministic build-phase geometry • {data.memberIso3.length} Member Nations
            </p>
          </div>
        </div>

        {/* Vector actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              showGrid 
                ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-emerald-600 dark:text-emerald-400' 
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'
            }`}
            title="Toggle Coordinates Radar Grid"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCapitals(!showCapitals)}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              showCapitals 
                ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-emerald-600 dark:text-emerald-400' 
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'
            }`}
            title="Toggle Major Anchors"
          >
            <MapPin className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadSVG}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Download Standalone Regional Vector SVG"
          >
            {downloadSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Download className="w-3.5 h-3.5 text-emerald-500" />
            )}
            <span className="hidden sm:inline">{downloadSuccess ? 'Downloaded!' : 'Export SVG'}</span>
          </button>
        </div>
      </div>

      {/* Standalone Regional Vector Canvas */}
      <div className="relative w-full h-[300px] sm:h-[340px] flex items-center justify-center rounded-2xl bg-gradient-to-b from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-inner">
        {/* Subtle grid background */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
            <div className="w-full h-full border border-dashed border-zinc-500" />
            <div className="absolute w-full h-[1px] bg-zinc-500/30" />
            <div className="absolute h-full w-[1px] bg-zinc-500/30" />
            <div className="absolute w-48 h-48 rounded-full border border-zinc-500/20" />
            <div className="absolute w-80 h-80 rounded-full border border-zinc-500/10" />
          </div>
        )}

        <svg
          id={`regional-svg-${data.m49Code}`}
          viewBox={data.viewBox}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain select-none p-4"
        >
          <defs>
            <radialGradient id={`regGrad-${data.m49Code}`} cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor={data.palette.light} stopOpacity="0.85" />
              <stop offset="100%" stopColor={data.palette.dark} stopOpacity="0.95" />
            </radialGradient>
          </defs>

          {/* Regional Silhouette Path */}
          <path
            d={data.primaryPath}
            fill={`url(#regGrad-${data.m49Code})`}
            stroke={data.palette.primary}
            strokeWidth="3"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Regional Center Coordinates Indicator */}
          <g transform={`translate(${data.centroid.x}, ${data.centroid.y})`} className="pointer-events-none opacity-80">
            <circle r="4" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
            <text
              y="18"
              textAnchor="middle"
              className="text-[12px] font-mono font-bold fill-zinc-900 dark:fill-zinc-100 select-none drop-shadow-md"
            >
              {data.name.toUpperCase()}
            </text>
          </g>

          {/* Key Capital Pins */}
          {showCapitals && data.keyCapitals.map(cap => (
            <g key={cap.name} transform={`translate(${cap.x}, ${cap.y})`} className="cursor-pointer group">
              <circle r="6" fill="#ffffff" stroke={data.palette.dark} strokeWidth="2" className="shadow-md" />
              <circle r="2.5" fill={data.palette.primary} />
              <text
                x="8"
                y="3"
                className="text-[10px] font-mono font-bold fill-zinc-900 dark:fill-zinc-100 select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              >
                ★ {cap.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Geo Specs Pill */}
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded-xl text-[11px] font-mono text-zinc-600 dark:text-zinc-300 shadow-md backdrop-blur-sm flex items-center gap-2">
          <Layers className="w-3 h-3 text-emerald-500" />
          <span>ViewBox: {data.viewBox}</span>
          <span>•</span>
          <span>Standard: UN M49-{data.m49Code}</span>
        </div>
      </div>

      {/* Member Nations Grid */}
      {showMemberList && (
        <div className="space-y-2 pt-1 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span>MEMBER NATIONS ({data.memberIso3.length})</span>
            <span>Click to explore sovereign country vector</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {data.memberIso3.map(iso => {
              const country = AFRICA_SVG_MAP[iso];
              if (!country) return null;

              return (
                <button
                  key={iso}
                  onClick={() => onSelectCountry && onSelectCountry(iso)}
                  onMouseEnter={() => setHoveredMember(iso)}
                  onMouseLeave={() => setHoveredMember(null)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-emerald-500 hover:text-zinc-950 dark:hover:bg-emerald-500 dark:hover:text-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer shadow-xs"
                >
                  <CountryFlag entityId={iso} size="xs" />
                  <span>{country.name}</span>
                  <span className="text-[10px] font-mono opacity-70">({iso})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
