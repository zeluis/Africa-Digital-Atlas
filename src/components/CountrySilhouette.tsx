import React, { useState } from 'react';
import { getCountrySilhouette } from '../data/countrySilhouettes';
import { getEntityGeographyMetadata, UN_M49_NUMERIC_CODES } from '../data/svgGeographySystem';
import { atlas } from '../data/atlas-store';
import { getCountryRegionTonalPalette, getRegionCalmColor } from '../data/unGeoschemeColors';
import { useAfricaFinalMap } from '../utils/svgMapLoader';
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
  const [showSubdivisions, setShowSubdivisions] = useState(true);
  const [copiedPath, setCopiedPath] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const { mapData, isLoaded } = useAfricaFinalMap();
  const countryMapItem = mapData[entityId];
  const silhouette = getCountrySilhouette(entityId);
  const entity = atlas.getEntity(entityId);
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

  const admin1Paths = countryMapItem?.admin1 || [];
  const hasAdmin1 = admin1Paths.length > 0;

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById(`silhouette-svg-${entityId}`);
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const commentedSource = `<!-- African Continental Atlas: ${entity?.name || silhouette.name} (ISO3: ${entityId}, M49: ${m49Code}) -->\n${source}`;
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
    const combinedPath = hasAdmin1 
      ? admin1Paths.map(a => a.d).join(' ')
      : silhouette?.path;

    if (combinedPath) {
      navigator.clipboard.writeText(combinedPath);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    }
  };

  // Simplified compact rendering for grid cards (ExploreView, LanguagesView)
  if (size === 'sm' || size === 'md') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg
          id={`silhouette-svg-${entityId}`}
          viewBox={silhouette.viewBox}
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={themeStyles.stopStart} stopOpacity="0.45" />
              <stop offset="100%" stopColor={themeStyles.stopEnd} stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {hasAdmin1 ? (
            admin1Paths.map((sub) => (
              <path
                key={sub.id}
                d={sub.d}
                fill={`url(#${gradId})`}
                stroke={themeStyles.stroke}
                strokeWidth="1.2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))
          ) : silhouette.path ? (
            <path
              d={silhouette.path}
              fill={`url(#${gradId})`}
              stroke={themeStyles.stroke}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : (
            <rect
              x={silhouette.capital.x - 20}
              y={silhouette.capital.y - 20}
              width="40"
              height="40"
              rx="8"
              fill={themeStyles.stopStart}
              opacity="0.2"
              className="animate-pulse"
            />
          )}
        </svg>
      </div>
    );
  }

  return (
    <>
      {/* Prominent Header Capsule */}
      <div 
        className={`relative group rounded-3xl border border-zinc-200/90 bg-white/95 p-4 lg:p-5 shadow-xs overflow-hidden transition-all duration-300 hover:border-zinc-300 flex flex-col justify-between ${className}`}
        style={{ minWidth: '260px', maxWidth: '340px' }}
      >
        {/* Ambient Top Glow */}
        <div 
          className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity"
          style={{ background: themeStyles.stroke }}
        />

        {/* Header Ribbon of the Silhouette Card */}
        <div className="relative z-10 flex items-center justify-between gap-2 border-b border-zinc-200/80 pb-2.5">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-zinc-600">
            <Crosshair className={`w-3.5 h-3.5 ${themeStyles.accentText}`} />
            <span>AUTHENTIC SVG</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200">
              M49: {m49Code}
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${themeStyles.badgeBg} ${themeStyles.badgeBorder} ${themeStyles.accentText}`}>
              {hasAdmin1 ? `${admin1Paths.length} ADMIN-1` : silhouette.shapeType.toUpperCase()}
            </span>
            {interactive && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-1 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors cursor-pointer"
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

            {/* Render authentic Admin-1 Subdivisions or boundary contour */}
            {hasAdmin1 ? (
              admin1Paths.map((sub) => (
                <path
                  key={sub.id}
                  d={sub.d}
                  fill={`url(#${gradId})`}
                  stroke={themeStyles.stroke}
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="transition-all duration-300 hover:opacity-80"
                >
                  <title>{sub.name || sub.id}</title>
                </path>
              ))
            ) : silhouette.path ? (
              <path
                d={silhouette.path}
                fill={`url(#${gradId})`}
                stroke={themeStyles.stroke}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            ) : (
              <g className="animate-pulse opacity-40">
                <circle cx={silhouette.capital.x} cy={silhouette.capital.y} r="35" fill={themeStyles.stroke} opacity="0.3" />
              </g>
            )}

            {/* Capital City Beacon Pin Point */}
            {showCapital && silhouette.capital && (
              <g transform={`translate(${silhouette.capital.x}, ${silhouette.capital.y})`} className="pointer-events-none">
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
        <div className="relative z-10 pt-2 border-t border-zinc-200/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-1">
            <MapPin className={`w-3 h-3 ${themeStyles.accentText}`} />
            <span className="font-semibold text-zinc-800">{silhouette.capital?.name || entity?.capital}</span>
            <span className="text-[10px] text-zinc-500">({entity?.capital || 'Capital'})</span>
          </div>

          <div className="text-[10px] text-zinc-500 font-mono">
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
                  Authoritative SVG geometry mapped with 1,017 Admin-1 provincial subdivisions
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Vector Display */}
            <div className="relative h-72 w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden">
              <svg
                viewBox={silhouette.viewBox}
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full max-h-64 select-none"
              >
                <defs>
                  <linearGradient id={`${gradId}-modal`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={themeStyles.stopStart} stopOpacity="0.55" />
                    <stop offset="100%" stopColor={themeStyles.stopEnd} stopOpacity="0.25" />
                  </linearGradient>
                </defs>

                {hasAdmin1 ? (
                  admin1Paths.map((sub) => (
                    <path
                      key={sub.id}
                      d={sub.d}
                      fill={`url(#${gradId}-modal)`}
                      stroke={themeStyles.stroke}
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  ))
                ) : (
                  <path
                    d={silhouette.path}
                    fill={`url(#${gradId}-modal)`}
                    stroke={themeStyles.stroke}
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )}

                {showCapital && silhouette.capital && (
                  <g transform={`translate(${silhouette.capital.x}, ${silhouette.capital.y})`}>
                    <circle r="12" fill={themeStyles.stroke} opacity="0.3" className="animate-ping" />
                    <circle r="6" fill={themeStyles.stroke} opacity="0.9" />
                    <circle r="2.5" fill="#ffffff" />
                  </g>
                )}
              </svg>
            </div>

            {/* Modal Controls and Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCapital(prev => !prev)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    showCapital 
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-transparent' 
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  Capital Beacon: {showCapital ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySvgPath}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold transition-all cursor-pointer"
                >
                  {copiedPath ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPath ? 'Copied Vector' : 'Copy SVG'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSVG}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadSuccess ? 'Downloaded!' : 'Download SVG'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
