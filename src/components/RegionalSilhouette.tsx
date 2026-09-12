import React, { useState } from 'react';
import { AfricanRegion } from '../data/types';
import { REGIONAL_SILHOUETTES, RegionalSilhouetteData } from '../data/svgGeographySystem';
import { AFRICA_SVG_MAP } from '../data/svgMaps';
import { CountryFlag } from './CountryFlag';
import { getRegionTonalPalette, getRegionCalmColor } from '../data/unGeoschemeColors';
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
  Info,
  X,
  Navigation,
  Copy,
  Check
} from 'lucide-react';

export interface RegionalSilhouetteProps {
  region: AfricanRegion;
  size?: 'header' | 'full' | 'compact';
  onSelectCountry?: (iso3: string) => void;
  className?: string;
  showMemberList?: boolean;
  interactive?: boolean;
}

export const RegionalSilhouette: React.FC<RegionalSilhouetteProps> = ({
  region,
  size = 'full',
  onSelectCountry,
  className = '',
  showMemberList = true,
  interactive = true
}) => {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [showCapitals, setShowCapitals] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [copiedPath, setCopiedPath] = useState<boolean>(false);

  const data: RegionalSilhouetteData = REGIONAL_SILHOUETTES[region];
  const tonal = getRegionTonalPalette(region);
  const calmBg = getRegionCalmColor(region);
  if (!data) return null;

  const handleDownloadSVG = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const svgId = size === 'header' ? `regional-svg-header-${data.m49Code}` : `regional-svg-${data.m49Code}`;
    const svgEl = document.getElementById(svgId);
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

  const handleCopyPath = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!data.primaryPath) return;
    navigator.clipboard.writeText(data.primaryPath);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  // 1. PROMINENT HEADER CAPSULE (Matches CountrySilhouette size="header" treatment)
  if (size === 'header') {
    return (
      <>
        <div 
          className={`relative group rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 p-4 lg:p-5 shadow-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/50 flex flex-col justify-between ${className}`}
          style={{ minWidth: '280px', maxWidth: '360px', width: '100%' }}
        >
          {/* Ambient Top Glow using UN Geoscheme Regional Tonal Color */}
          <div 
            className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-25 dark:opacity-35 group-hover:opacity-55 transition-opacity"
            style={{ background: tonal.warmAccent }}
          />

          {/* Header Ribbon of the Regional Silhouette Card */}
          <div className="relative z-10 flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800/80 pb-2.5">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              <Crosshair className="w-3.5 h-3.5" style={{ color: tonal.warmAccent }} />
              <span>REGIONAL SVG</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                M49: {data.m49Code}
              </span>
              <span 
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border"
                style={{
                  backgroundColor: `${tonal.warmAccent}15`,
                  borderColor: `${tonal.warmAccent}40`,
                  color: tonal.warmAccent
                }}
              >
                UN REGION
              </span>
              {interactive && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Expand Fullscreen Vector"
                  aria-label="Expand Fullscreen Regional Vector"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* SVG Drawing Canvas Container */}
          <div className="relative my-3 flex items-center justify-center h-48 w-full">
            {/* Subtle Radar Background Grid & Crosshairs */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
                <div className="w-full h-full border border-dashed border-zinc-400 dark:border-zinc-700 rounded-2xl" />
                <div className="absolute w-full h-[1px] bg-zinc-400/60 dark:bg-zinc-700/60" />
                <div className="absolute h-full w-[1px] bg-zinc-400/60 dark:bg-zinc-700/60" />
                <div className="absolute w-28 h-28 border border-zinc-400/40 dark:border-zinc-600/40 rounded-full" />
              </div>
            )}

            {/* Scalable Regional Silhouette SVG */}
            <svg
              id={`regional-svg-header-${data.m49Code}`}
              viewBox={data.viewBox}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full max-h-44 transition-transform duration-300 group-hover:scale-105 select-none"
            >
              <defs>
                <radialGradient id={`regHdrGrad-${data.m49Code}`} cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor={data.palette.light} stopOpacity="0.85" />
                  <stop offset="100%" stopColor={data.palette.dark} stopOpacity="0.95" />
                </radialGradient>
              </defs>

              {/* Regional Silhouette Path */}
              <path
                d={data.primaryPath}
                fill={`url(#regHdrGrad-${data.m49Code})`}
                stroke={data.palette.primary}
                strokeWidth="2.8"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />

              {/* Regional Center Coordinates Indicator */}
              <g transform={`translate(${data.centroid.x}, ${data.centroid.y})`} className="pointer-events-none opacity-85">
                <circle r="4" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                <text
                  y="16"
                  textAnchor="middle"
                  className="text-[11px] font-mono font-bold fill-zinc-900 dark:fill-zinc-100 select-none drop-shadow-md"
                >
                  {data.name.toUpperCase()}
                </text>
              </g>

              {/* Key Capital Pins */}
              {showCapitals && data.keyCapitals.map(cap => (
                <g key={cap.name} transform={`translate(${cap.x}, ${cap.y})`} className="cursor-pointer group/pin">
                  <circle r="5" fill="#ffffff" stroke={data.palette.dark} strokeWidth="1.8" className="shadow-md" />
                  <circle r="2" fill={data.palette.primary} />
                  <text
                    x="7"
                    y="3"
                    className="text-[9px] font-mono font-bold fill-zinc-900 dark:fill-zinc-100 select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    ★ {cap.name}
                  </text>
                </g>
              ))}
            </svg>

            {/* Floating Watermark M49 ID */}
            <div className="absolute right-2 bottom-1 font-mono text-[22px] font-black text-zinc-300 dark:text-zinc-800/40 pointer-events-none select-none tracking-widest">
              0{data.m49Code}
            </div>

            {/* Compass Rose Marker */}
            <div className="absolute top-1 left-2 flex items-center gap-1 font-mono text-[9px] text-zinc-400 dark:text-zinc-500 pointer-events-none">
              <Navigation className="w-2.5 h-2.5 text-zinc-400 rotate-45" />
              <span>N</span>
            </div>
          </div>

          {/* Footer Geographical Coordinate & Facts Capsule */}
          <div className="relative z-10 pt-2 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" style={{ color: tonal.warmAccent }} />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{data.keyCapitals[0]?.name || 'Regional Center'}</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">({data.memberIso3.length} States)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-1 rounded-md text-[10px] font-mono border transition-colors cursor-pointer ${
                  showGrid ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-emerald-500' : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'
                }`}
                title="Toggle Radar Grid"
              >
                Grid
              </button>
              <button
                onClick={handleDownloadSVG}
                className="p-1 rounded-md text-[10px] font-mono border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer flex items-center gap-1"
                title="Download SVG Vector"
              >
                {downloadSuccess ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Download className="w-3 h-3" />}
                <span>SVG</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal for Fullscreen Vector Inspection */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-3xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-zinc-950" style={{ background: tonal.warmAccent }}>
                    {data.m49Code}
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {data.name} — UN M49 Regional Silhouette
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div 
                className="h-80 w-full flex items-center justify-center rounded-2xl border border-zinc-800/80 relative overflow-hidden transition-colors"
                style={{ backgroundColor: calmBg }}
              >
                <svg
                  viewBox={data.viewBox}
                  width="100%"
                  height="100%"
                  className="w-full h-full p-6 object-contain"
                >
                  <path
                    d={data.primaryPath}
                    fill={data.palette.primary}
                    fillOpacity="0.85"
                    stroke={data.palette.dark}
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  {data.keyCapitals.map(cap => (
                    <g key={cap.name} transform={`translate(${cap.x}, ${cap.y})`}>
                      <circle r="6" fill="#ffffff" stroke={data.palette.dark} strokeWidth="2" />
                      <circle r="3" fill={data.palette.primary} />
                      <text x="9" y="4" className="text-[10px] font-mono font-bold fill-white drop-shadow-md">
                        ★ {cap.name}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-zinc-400">
                  Standard: UN M49-{data.m49Code} • ViewBox: {data.viewBox}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPath}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
                  >
                    {copiedPath ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPath ? 'Copied Path!' : 'Copy Path'}</span>
                  </button>
                  <button
                    onClick={handleDownloadSVG}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download SVG</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // 2. FULL REGIONAL SILHOUETTE CARD (With Member Nations Grid)
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
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs transition-colors cursor-pointer"
            title="Expand Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
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

      {/* Modal for Fullscreen Vector Inspection */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-zinc-950" style={{ background: tonal.warmAccent }}>
                  {data.m49Code}
                </div>
                <h3 className="text-base font-bold text-white">
                  {data.name} — UN M49 Regional Silhouette
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div 
              className="h-80 w-full flex items-center justify-center rounded-2xl border border-zinc-200/60 dark:border-zinc-800 relative overflow-hidden transition-colors"
              style={{ backgroundColor: calmBg }}
            >
              <svg
                viewBox={data.viewBox}
                width="100%"
                height="100%"
                className="w-full h-full p-6 object-contain"
              >
                <path
                  d={data.primaryPath}
                  fill={data.palette.primary}
                  fillOpacity="0.85"
                  stroke={data.palette.dark}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {data.keyCapitals.map(cap => (
                  <g key={cap.name} transform={`translate(${cap.x}, ${cap.y})`}>
                    <circle r="6" fill="#ffffff" stroke={data.palette.dark} strokeWidth="2" />
                    <circle r="3" fill={data.palette.primary} />
                    <text x="9" y="4" className="text-[10px] font-mono font-bold fill-white drop-shadow-md">
                      ★ {cap.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-zinc-400">
                Standard: UN M49-{data.m49Code} • ViewBox: {data.viewBox}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPath}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
                >
                  {copiedPath ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPath ? 'Copied Path!' : 'Copy Path'}</span>
                </button>
                <button
                  onClick={handleDownloadSVG}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
