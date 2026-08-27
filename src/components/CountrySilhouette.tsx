import React, { useState } from 'react';
import { getCountrySilhouette, CountrySilhouetteData } from '../data/countrySilhouettes';
import { getEntityGeographyMetadata, UN_M49_NUMERIC_CODES } from '../data/svgGeographySystem';
import { atlas } from '../data/atlas-store';
import { formatArea } from '../data/atlas-formatters';
import { getCountryRegionTonalPalette } from '../data/unGeoschemeColors';
import { 
  MapPin, 
  Maximize2, 
  Navigation, 
  Download, 
  X,
  Crosshair, 
  Copy,
  CheckCircle2,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface CountrySilhouetteProps {
  entityId: string;
  size?: 'sm' | 'md' | 'lg' | 'header';
  interactive?: boolean;
  className?: string;
}

export const CountrySilhouette: React.FC<CountrySilhouetteProps> = ({
  entityId,
  size = 'header',
  interactive = true,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showCapital, setShowCapital] = useState(true);
  const [theme, setTheme] = useState<'emerald' | 'cyan' | 'amber'>('emerald');
  const [copiedPath, setCopiedPath] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const silhouette = getCountrySilhouette(entityId);
  const entity = atlas.getEntity(entityId);
  const geoMetadata = getEntityGeographyMetadata(entityId);
  const m49Code = UN_M49_NUMERIC_CODES[entityId.toUpperCase()] || '000';
  const regionalTonal = getCountryRegionTonalPalette(entityId);

  if (!silhouette) return null;

  // Scoped unique gradient ID
  const gradId = `silhouette-grad-${entityId}`;

  // Theme styling definitions - default to the country's official UN Geoscheme region tonal variation
  const themeStyles = {
    stroke: regionalTonal.warmAccent,
    stopStart: regionalTonal.warmAccent,
    stopEnd: regionalTonal.deepTone,
    pinBg: 'bg-white',
    accentText: regionalTonal.badge.text,
    badgeBorder: regionalTonal.badge.border,
    badgeBg: regionalTonal.badge.bg,
    glow: regionalTonal.glowRgba
  };

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById(`silhouette-svg-${entityId}`);
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const commentedSource = `<!-- SVG Geography System: ${entity?.name || silhouette.name} (ISO3: ${entityId}, M49: ${m49Code}) -->\n${source}`;
    const blob = new Blob([commentedSource], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UN_M49_${m49Code}_${entityId}_silhouette.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleCopySvgPath = () => {
    if (silhouette?.path) {
      navigator.clipboard.writeText(silhouette.path);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    }
  };

  return (
    <>
      {/* Prominent Header Capsule */}
      <div 
        className={`relative group rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 p-4 lg:p-5 shadow-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/50 flex flex-col justify-between ${className}`}
        style={{ minWidth: '260px', maxWidth: '340px' }}
      >
        {/* Ambient Top Glow */}
        <div 
          className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-30 group-hover:opacity-50 transition-opacity"
          style={{ background: themeStyles.stroke }}
        />

        {/* Header Ribbon of the Silhouette Card */}
        <div className="relative z-10 flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800/80 pb-2.5">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
            <Crosshair className={`w-3.5 h-3.5 ${themeStyles.accentText}`} />
            <span>SVG GEOGRAPHY</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              M49: {m49Code}
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${themeStyles.badgeBg} ${themeStyles.badgeBorder} ${themeStyles.accentText}`}>
              {silhouette.shapeType.toUpperCase()}
            </span>
            {interactive && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Expand Fullscreen Vector"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* SVG Drawing Canvas Container */}
        <div className="relative my-3 flex items-center justify-center h-44 w-full">
          {/* Subtle Radar Background Grid & Crosshairs */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
              <div className="w-full h-full border border-dashed border-zinc-400 dark:border-zinc-700 rounded-2xl" />
              <div className="absolute w-full h-[1px] bg-zinc-400/60 dark:bg-zinc-700/60" />
              <div className="absolute h-full w-[1px] bg-zinc-400/60 dark:bg-zinc-700/60" />
              <div className="absolute w-24 h-24 border border-zinc-400/40 dark:border-zinc-600/40 rounded-full" />
            </div>
          )}

          {/* Scalable Silhouette SVG */}
          <svg
            id={`silhouette-svg-${entityId}`}
            viewBox={silhouette.viewBox}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full max-h-40 transition-transform duration-300 group-hover:scale-105 select-none"
          >
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={themeStyles.stopStart} stopOpacity="0.45" />
                <stop offset="100%" stopColor={themeStyles.stopEnd} stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Main Landmass Path */}
            <path
              d={silhouette.path}
              fill={`url(#${gradId})`}
              stroke={themeStyles.stroke}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="transition-all duration-300"
            />

            {/* Additional Islands / Cutouts */}
            {silhouette.islandPaths && silhouette.islandPaths.map((islandD, idx) => (
              <path
                key={idx}
                d={islandD}
                fill={`url(#${gradId})`}
                stroke={themeStyles.stroke}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}

            {/* Capital City Beacon Pin Point */}
            {showCapital && silhouette.capital && (
              <g transform={`translate(${silhouette.capital.x}, ${silhouette.capital.y})`} className="pointer-events-none">
                {/* Outer Pulsing Ping */}
                <circle r="9" fill={themeStyles.stroke} opacity="0.3" className="animate-ping" />
                <circle r="4.5" fill={themeStyles.stroke} opacity="0.8" />
                <circle r="2" fill="#ffffff" />
              </g>
            )}
          </svg>

          {/* Floating Watermark ISO ID */}
          <div className="absolute right-2 bottom-1 font-mono text-[22px] font-black text-zinc-300 dark:text-zinc-800/40 pointer-events-none select-none tracking-widest">
            {entityId}
          </div>

          {/* Compass Rose Marker */}
          <div className="absolute top-1 left-2 flex items-center gap-1 font-mono text-[9px] text-zinc-400 dark:text-zinc-500 pointer-events-none">
            <Navigation className="w-2.5 h-2.5 text-zinc-400 rotate-45" />
            <span>N</span>
          </div>
        </div>

        {/* Footer Geographical Coordinate & Facts Capsule */}
        <div className="relative z-10 pt-2 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <MapPin className={`w-3 h-3 ${themeStyles.accentText}`} />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{silhouette.capital?.name || entity?.capital}</span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">({entity?.capital || 'Capital'})</span>
          </div>

          <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
            {silhouette.geoCenter.lat >= 0 ? `${silhouette.geoCenter.lat.toFixed(1)}°N` : `${Math.abs(silhouette.geoCenter.lat).toFixed(1)}°S`}, {' '}
            {silhouette.geoCenter.lng >= 0 ? `${silhouette.geoCenter.lng.toFixed(1)}°E` : `${Math.abs(silhouette.geoCenter.lng).toFixed(1)}°W`}
          </div>
        </div>
      </div>

      {/* Expanded High-Resolution Vector Inspection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Crosshair className={`w-5 h-5 ${themeStyles.accentText}`} />
                    <span>{entity?.name || silhouette.name} — Vector Silhouette</span>
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
                    UN M49: {m49Code}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Build-phase deterministic geometry • Visvalingam-Whyatt Simplification • ISO {entityId} / {entity?.iso2}
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Drawing Display */}
            <div className="relative bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-8 flex items-center justify-center h-80 overflow-hidden shadow-inner">
              {/* Radar Coordinate Grid */}
              <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
                <div className="w-full h-full border border-dashed border-zinc-400 dark:border-zinc-700" />
                <div className="absolute w-full h-[1px] bg-zinc-400/60 dark:bg-zinc-700/60" />
                <div className="absolute h-full w-[1px] bg-zinc-400/60 dark:bg-zinc-700/60" />
                <div className="absolute w-48 h-48 border border-zinc-400/40 dark:border-zinc-600/40 rounded-full" />
                <div className="absolute w-72 h-72 border border-zinc-400/30 dark:border-zinc-600/30 rounded-full" />
              </div>

              <svg
                viewBox={silhouette.viewBox}
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full max-h-72"
              >
                <defs>
                  <linearGradient id={`${gradId}-modal`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={themeStyles.stopStart} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={themeStyles.stopEnd} stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                <path
                  d={silhouette.path}
                  fill={`url(#${gradId}-modal)`}
                  stroke={themeStyles.stroke}
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {silhouette.islandPaths && silhouette.islandPaths.map((islandD, idx) => (
                  <path
                    key={idx}
                    d={islandD}
                    fill={`url(#${gradId}-modal)`}
                    stroke={themeStyles.stroke}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                ))}

                {showCapital && silhouette.capital && (
                  <g transform={`translate(${silhouette.capital.x}, ${silhouette.capital.y})`}>
                    <circle r="12" fill={themeStyles.stroke} opacity="0.3" className="animate-ping" />
                    <circle r="6" fill={themeStyles.stroke} />
                    <circle r="3" fill="#ffffff" />
                    <text
                      x="10"
                      y="4"
                      className="fill-zinc-900 dark:fill-zinc-100 text-xs font-mono font-bold drop-shadow-md"
                    >
                      ★ {silhouette.capital.name} (Capital)
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Geographical Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-3">
                <span className="text-zinc-500 font-medium">Land Area</span>
                <div className="font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">{formatArea(entity?.landAreaKm2)}</div>
              </div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-3">
                <span className="text-zinc-500 font-medium">Geographic Center</span>
                <div className="font-bold font-mono text-zinc-900 dark:text-zinc-200 mt-0.5">
                  {silhouette.geoCenter.lat.toFixed(2)}°, {silhouette.geoCenter.lng.toFixed(2)}°
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-3">
                <span className="text-zinc-500 font-medium">Coastline Length</span>
                <div className="font-bold font-mono text-zinc-900 dark:text-zinc-200 mt-0.5">
                  {silhouette.coastlineKm ? `${silhouette.coastlineKm.toLocaleString()} km` : 'Landlocked'}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-3">
                <span className="text-zinc-500 font-medium">Pipeline Geometry</span>
                <div className="font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">W3C SVG • {geoMetadata?.vertexCount || 48} Nodes</div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Accent:</span>
                {(['emerald', 'cyan', 'amber'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`w-5 h-5 rounded-full border cursor-pointer ${theme === t ? 'ring-2 ring-zinc-900 dark:ring-zinc-100' : 'opacity-70'} ${
                      t === 'emerald' ? 'bg-emerald-500 border-emerald-400' :
                      t === 'cyan' ? 'bg-cyan-500 border-cyan-400' :
                      'bg-amber-500 border-amber-400'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySvgPath}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
                  title="Copy SVG path 'd' string"
                >
                  {copiedPath ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPath ? 'Path Copied!' : 'Copy Path'}</span>
                </button>

                <button
                  onClick={handleDownloadSVG}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
                >
                  {downloadSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Download className="w-3.5 h-3.5 text-emerald-500" />}
                  <span>{downloadSuccess ? 'Downloaded!' : 'Download SVG'}</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
