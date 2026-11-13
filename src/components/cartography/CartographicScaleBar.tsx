import React from 'react';
import { Compass } from 'lucide-react';

export interface CartographicScaleBarProps {
  zoomLevel: number;
  centerLat?: number;
  centerLon?: number;
  variant?: 'floating' | 'inline';
  showZoom?: boolean;
  className?: string;
}

/**
 * CartographicScaleBar & Geodesic HUD
 * Dynamically computes ground distance in kilometers and nautical miles
 * calibrated to the authentic 5,796 × 5,867 spatial coordinate grid.
 * Supports both compact inline header docking and floating canvas mode.
 */
export const CartographicScaleBar: React.FC<CartographicScaleBarProps> = ({
  zoomLevel,
  centerLat = 0,
  centerLon = 20,
  variant = 'floating',
  showZoom = true,
  className = ''
}) => {
  // WGS 84 equatorial circumference ~ 40,075 km
  // At latitude phi, 1 degree of longitude ~ 111.32 * cos(phi) km
  // Across the 5,796 px width spanning approximately 72 degrees of longitude:
  const effectiveZoom = Math.max(0.4, zoomLevel || 1.0);
  const latRad = (centerLat * Math.PI) / 180;
  const kmPerPx = (40075 * Math.cos(latRad)) / (5796 * 5.0 * effectiveZoom);

  // Target bar width calibrated to inline vs floating layout
  const targetBarWidthPx = variant === 'inline' ? 68 : 110;
  const rawKm = kmPerPx * targetBarWidthPx;

  // Round to friendly human cartographic intervals (50, 100, 250, 500, 1000, 2000 km)
  let roundedKm = 500;
  if (rawKm < 75) roundedKm = 50;
  else if (rawKm < 175) roundedKm = 100;
  else if (rawKm < 350) roundedKm = 250;
  else if (rawKm < 750) roundedKm = 500;
  else if (rawKm < 1500) roundedKm = 1000;
  else if (rawKm < 3000) roundedKm = 2000;
  else roundedKm = Math.round(rawKm / 1000) * 1000;

  const minWidth = variant === 'inline' ? 44 : 50;
  const maxWidth = variant === 'inline' ? 92 : 180;
  const actualBarWidthPx = Math.max(minWidth, Math.min(maxWidth, Math.round(roundedKm / kmPerPx)));
  const roundedMiles = Math.round(roundedKm * 0.621371);

  const formatCoord = (val: number, isLat: boolean) => {
    const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'W');
    return `${Math.abs(val).toFixed(2)}°${dir}`;
  };

  if (variant === 'inline') {
    return (
      <div
        aria-label="Cartographic Scale Bar & Geodesic Coordinate HUD"
        title="Real-time WGS 84 Geodesic coordinates & dynamic ground scale calibrated to 5,796 × 5,867 spatial grid"
        className={`inline-flex items-center gap-2.5 px-2.5 py-1 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-2xs select-none transition-all ${className}`}
      >
        {/* Coordinates Readout */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono leading-none">
          <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="hidden xl:inline font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[9px]">
            WGS 84
          </span>
          <span className="hidden xl:inline text-zinc-300 dark:text-zinc-700">·</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {formatCoord(centerLat, true)}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {formatCoord(centerLon, false)}
          </span>
          {showZoom && (
            <>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                {Math.round(effectiveZoom * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Hairline Scale Bar */}
        <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-zinc-200/90 dark:border-zinc-800">
          <div className="flex flex-col gap-0.5">
            <div
              className="flex items-center justify-between text-[9px] font-mono text-zinc-500 dark:text-zinc-400 leading-none tabular-nums"
              style={{ width: `${actualBarWidthPx}px` }}
            >
              <span>0</span>
              <span>{roundedKm >= 1000 ? `${(roundedKm / 1000).toFixed(0)}k` : roundedKm} km</span>
            </div>
            <div
              style={{ width: `${actualBarWidthPx}px` }}
              className="h-[3px] border-b-[1.5px] border-l-[1.5px] border-r-[1.5px] border-zinc-800 dark:border-zinc-200 relative transition-[width] duration-200 ease-out"
            >
              <div className="absolute left-1/2 -bottom-[1.5px] w-[1px] h-[2.5px] bg-zinc-800 dark:bg-zinc-200 -translate-x-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label="Cartographic Scale Bar & Coordinate HUD"
      className={`absolute bottom-20 lg:bottom-4 left-3 sm:left-4 z-20 pointer-events-auto flex flex-col gap-1 p-2 rounded-xl bg-white/92 dark:bg-zinc-950/92 border border-zinc-200/90 dark:border-zinc-800/90 backdrop-blur-md shadow-md text-zinc-700 dark:text-zinc-300 transition-all select-none ${className}`}
    >
      {/* Geodesic WGS 84 Coordinates Header */}
      <div className="flex items-center gap-1.5 text-[10px] font-mono leading-none">
        <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[9px]">WGS 84</span>
        <span className="text-zinc-300 dark:text-zinc-700">·</span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
          {formatCoord(centerLat, true)}
        </span>
        <span className="text-zinc-300 dark:text-zinc-700">·</span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
          {formatCoord(centerLon, false)}
        </span>
        {showZoom && (
          <>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
              {Math.round(effectiveZoom * 100)}%
            </span>
          </>
        )}
      </div>

      {/* Hairline Scale Bar */}
      <div className="flex flex-col gap-0.5 pt-0.5">
        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 dark:text-zinc-400 leading-none tabular-nums" style={{ width: `${actualBarWidthPx}px` }}>
          <span>0</span>
          <span>{roundedKm >= 1000 ? `${(roundedKm / 1000).toFixed(0)}k` : roundedKm} km ({roundedMiles} mi)</span>
        </div>
        <div
          style={{ width: `${actualBarWidthPx}px` }}
          className="h-[3px] border-b-2 border-l-2 border-r-2 border-zinc-800 dark:border-zinc-200 relative transition-[width] duration-200 ease-out"
        >
          {/* Midpoint tick */}
          <div className="absolute left-1/2 -bottom-[2px] w-[1px] h-[3px] bg-zinc-800 dark:bg-zinc-200 -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
};

export default CartographicScaleBar;
