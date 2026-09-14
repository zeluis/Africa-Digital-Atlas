import React, { useState } from 'react';
import { AFRICA_SVG_MAP, AFRICA_UN_REGIONS_STRUCTURED } from '../data/svgMaps';
import { UN_REGIONS, REGION_META } from '../data/africaData';
import { AfricanRegion } from '../data/types';

export interface AfricaUnLogoProps {
  className?: string;
  size?: number | string;
  viewBox?: string;
  activeRegion?: AfricanRegion | string | null;
  highlightedRegions?: string[];
  highlightedCountries?: string[];
  onSelectRegion?: (regionName: AfricanRegion) => void;
  interactive?: boolean;
  variant?: 'geoscheme' | 'monochrome' | 'themed' | 'glow' | 'outline';
  customColorMap?: Record<string, string>;
  singleColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  glow?: boolean;
  showIslands?: boolean;
  children?: React.ReactNode; // For embedding SVG overlays (routes, beacons, trade lines)
}

/**
 * Universal Africa Continental Silhouette & UN Geoscheme Vector Component
 * 
 * Accurately renders the 54 sovereign African states + Western Sahara + islands
 * with official UN Geoscheme M49 regional boundaries & colors:
 * - Northern Africa: Blue (#2563EB)
 * - Western Africa: Green (#16A34A)
 * - Central Africa: Magenta (#C026D3)
 * - Eastern Africa: Yellow/Gold (#EAB308)
 * - Southern Africa: Red (#DC2626)
 *
 * Highly performant, infinitely scalable, and reusable everywhere from tiny 16px icons
 * to massive 800px display posters and interactive dashboards with SVG overlays.
 */
export const AfricaUnLogo: React.FC<AfricaUnLogoProps> = ({ 
  className = "w-10 h-10",
  size,
  viewBox = "60 60 890 990",
  activeRegion,
  highlightedRegions,
  highlightedCountries,
  onSelectRegion,
  interactive = true,
  variant = 'geoscheme',
  customColorMap,
  singleColor,
  strokeColor = '#FFFFFF',
  strokeWidth,
  glow = false,
  showIslands = true,
  children
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Normalize activeRegion (e.g. 'region-western' -> 'Western Africa')
  const resolvedActive = React.useMemo(() => {
    if (!activeRegion) return null;
    const str = String(activeRegion);
    if (str.includes('northern') || str.includes('Northern')) return 'Northern Africa';
    if (str.includes('western') || str.includes('Western')) return 'Western Africa';
    if (str.includes('central') || str.includes('Central')) return 'Central Africa';
    if (str.includes('eastern') || str.includes('Eastern')) return 'Eastern Africa';
    if (str.includes('southern') || str.includes('Southern')) return 'Southern Africa';
    return null;
  }, [activeRegion]);

  const defaultStrokeWidth = strokeWidth !== undefined ? strokeWidth : (variant === 'outline' ? 1.5 : 0.8);

  return (
    <div className={`relative inline-flex items-center justify-center ${interactive ? 'group/un-logo cursor-pointer' : ''}`}>
      <svg
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={size ? { width: size, height: size } : undefined}
        className={`shrink-0 overflow-visible transition-transform duration-200 ease-out ${
          interactive ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''
        } ${className}`}
        aria-label="African Continent UN Geoscheme Silhouette"
        role="img"
      >
        <defs>
          {glow && (
            <filter id="africaContinentalGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          )}
        </defs>

        <g filter={glow ? 'url(#africaContinentalGlow)' : undefined}>
          {UN_REGIONS.map((regionName) => {
            const region = AFRICA_UN_REGIONS_STRUCTURED[regionName];
            const meta = REGION_META[regionName];
            
            // Resolve fill color based on variant
            let color = meta.color;
            if (singleColor) {
              color = singleColor;
            } else if (customColorMap && customColorMap[regionName]) {
              color = customColorMap[regionName];
            } else if (variant === 'outline') {
              color = 'transparent';
            }
            
            const isHovered = hoveredRegion === regionName;
            const isScopeActive = resolvedActive === regionName;
            const isHighlightedRegion = highlightedRegions?.includes(regionName);
            const hasFocusState = Boolean(hoveredRegion || resolvedActive || (highlightedRegions && highlightedRegions.length > 0));
            
            // Opacity logic: if there is focus state, illuminate target and soften others
            const isFocal = isHovered || isScopeActive || isHighlightedRegion;
            const opacity = hasFocusState ? (isFocal ? 1 : 0.35) : 1;

            return (
              <g 
                key={regionName}
                opacity={opacity}
                className="transition-opacity duration-300 ease-in-out"
                onMouseEnter={() => interactive && setHoveredRegion(regionName)}
                onMouseLeave={() => interactive && setHoveredRegion(null)}
                onClick={(e) => {
                  if (interactive && onSelectRegion) {
                    e.stopPropagation();
                    onSelectRegion(regionName as AfricanRegion);
                  }
                }}
              >
                {region.countryIds.map((iso3) => {
                  const country = AFRICA_SVG_MAP[iso3];
                  if (!country) return null;

                  const isCountryHighlighted = highlightedCountries?.includes(iso3);
                  const countryFill = isCountryHighlighted 
                    ? '#FBBF24' 
                    : (customColorMap?.[iso3] || color);

                  return (
                    <path
                      key={iso3}
                      d={country.path}
                      fill={countryFill}
                      stroke={strokeColor}
                      strokeWidth={isCountryHighlighted || isFocal ? defaultStrokeWidth * 1.5 : defaultStrokeWidth}
                      strokeLinejoin="round"
                    />
                  );
                })}

                {/* Island representations for sovereign island nations */}
                {showIslands && region.islandCircles?.map((isl, idx) => (
                  <circle
                    key={`logo-circle-${regionName}-${idx}`}
                    cx={isl.cx}
                    cy={isl.cy}
                    r={Math.max(isl.r * 1.3, 7.5)}
                    fill={color}
                    stroke={strokeColor}
                    strokeWidth={isFocal ? defaultStrokeWidth * 1.5 : defaultStrokeWidth}
                  />
                ))}
              </g>
            );
          })}

          {/* Child SVG Overlays (Routes, City Hub Beacons, Trade Arrows) rendered in same coordinate matrix */}
          {children}
        </g>
      </svg>

      {/* Mini Floating Tooltip on Logo Hover */}
      {interactive && hoveredRegion && (
        <div 
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-zinc-950/95 text-white text-[11px] font-mono whitespace-nowrap pointer-events-none shadow-xl border border-emerald-500/50 z-50 animate-in fade-in zoom-in duration-100"
        >
          {hoveredRegion}
        </div>
      )}
    </div>
  );
};
