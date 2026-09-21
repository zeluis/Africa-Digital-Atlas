import React, { useState } from 'react';
import { AFRICA_SVG_MAP, AFRICA_UN_REGIONS_STRUCTURED, AFRICA_REGIONS_VIEWBOX } from '../data/svgMaps';
import { UN_REGIONS, REGION_META } from '../data/africaData';
import { AfricanRegion } from '../data/types';
import { useAfricaFinalMap } from '../utils/svgMapLoader';

export interface AfricaUnLogoProps {
  className?: string;
  size?: number | string;
  viewBox?: string;
  activeRegion?: AfricanRegion | string | null;
  highlightedRegions?: string[];
  highlightedCountries?: string[];
  onSelectRegion?: (regionName: AfricanRegion) => void;
  interactive?: boolean;
  variant?: 'geoscheme' | 'monochrome' | 'themed' | 'glow' | 'outline' | 'warm-tonal';
  customColorMap?: Record<string, string>;
  singleColor?: string;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  glow?: boolean;
  showIslands?: boolean;
  children?: React.ReactNode;
}

/**
 * Universal Africa Continental Silhouette & UN Geoscheme Vector Logo
 * 
 * Renders the clean, unified African continent with official UN Geoscheme regional colors.
 * Subdivisions are omitted to keep the logo clean, crisp, and contained across all viewports.
 */
export const AfricaUnLogo: React.FC<AfricaUnLogoProps> = ({ 
  className = "w-9 h-9",
  size,
  viewBox,
  activeRegion,
  highlightedRegions,
  highlightedCountries,
  onSelectRegion,
  interactive = true,
  variant = 'geoscheme',
  customColorMap,
  singleColor,
  fillColor,
  fillOpacity,
  strokeColor,
  strokeWidth = 0,
  glow = false,
  showIslands = true,
  children
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const { mapData } = useAfricaFinalMap();

  // Normalize activeRegion
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

  // Ensure viewBox always uses the unified coordinate space
  const resolvedViewBox = React.useMemo(() => {
    if (!viewBox || viewBox.includes('970') || viewBox.includes('1040') || viewBox.includes('400')) {
      return AFRICA_REGIONS_VIEWBOX;
    }
    return viewBox;
  }, [viewBox]);

  const effectiveStrokeWidth = strokeWidth !== undefined ? strokeWidth : (variant === 'outline' ? 8 : 0);

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden ${className} ${interactive ? 'group/un-logo cursor-pointer' : ''}`}
      style={size ? { width: size, height: size, maxWidth: size, maxHeight: size } : undefined}
    >
      <svg
        viewBox={resolvedViewBox}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className={`w-full h-full max-w-full max-h-full block transition-transform duration-200 ease-out ${
          interactive ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''
        }`}
        aria-label="African Continent UN Geoscheme Silhouette"
        role="img"
      >
        <defs>
          {glow && (
            <filter id="africaContinentalGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="30" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          )}
        </defs>

        <g filter={glow ? 'url(#africaContinentalGlow)' : undefined}>
          {UN_REGIONS.map((regionName) => {
            const region = AFRICA_UN_REGIONS_STRUCTURED[regionName];
            const meta = REGION_META[regionName];
            
            // Resolve fill color and opacity based on variant
            let color = meta.color;
            let effectiveFillOpacity = fillOpacity !== undefined ? fillOpacity : (variant === 'warm-tonal' ? 0.75 : 1);

            if (fillColor) {
              color = fillColor;
            } else if (singleColor) {
              color = singleColor;
            } else if (customColorMap && customColorMap[regionName]) {
              color = customColorMap[regionName];
            } else if (variant === 'outline') {
              color = 'transparent';
            } else if (variant === 'warm-tonal') {
              color = '#D97706';
            }
            
            const isHovered = hoveredRegion === regionName;
            const isScopeActive = resolvedActive === regionName;
            const isHighlightedRegion = highlightedRegions?.includes(regionName);
            const hasFocusState = Boolean(hoveredRegion || resolvedActive || (highlightedRegions && highlightedRegions.length > 0));
            
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
                  const item = mapData[iso3] || AFRICA_SVG_MAP[iso3];
                  if (!item) return null;

                  const isCountryHighlighted = highlightedCountries?.includes(iso3);
                  const countryFill = isCountryHighlighted 
                    ? '#FBBF24' 
                    : (customColorMap?.[iso3] || color);

                  const resolvedFill = variant === 'outline' ? 'transparent' : countryFill;
                  const adminPaths = (item as any).admin1;

                  // Merge all internal paths for a clean country shape without subdivision strokes in logo
                  const combinedPath = adminPaths && adminPaths.length > 0
                    ? adminPaths.map((adm: any) => adm.d).join(' ')
                    : (item as any).path;

                  if (!combinedPath) return null;

                  return (
                    <path
                      key={iso3}
                      d={combinedPath}
                      fill={resolvedFill}
                      fillOpacity={resolvedFill !== 'transparent' ? effectiveFillOpacity : undefined}
                      stroke={strokeColor || (effectiveStrokeWidth > 0 ? '#FFFFFF' : 'none')}
                      strokeWidth={effectiveStrokeWidth}
                      strokeLinejoin="round"
                    />
                  );
                })}

                {/* Sovereign island indicators */}
                {showIslands && region.islandCircles?.map((isl, idx) => {
                  const circleFill = variant === 'outline' ? 'transparent' : color;
                  return (
                    <circle
                      key={`logo-circle-${regionName}-${idx}`}
                      cx={isl.cx}
                      cy={isl.cy}
                      r={Math.max(isl.r * 1.5, 30)}
                      fill={circleFill}
                      fillOpacity={circleFill !== 'transparent' ? effectiveFillOpacity : undefined}
                      stroke={strokeColor || (effectiveStrokeWidth > 0 ? '#FFFFFF' : 'none')}
                      strokeWidth={effectiveStrokeWidth}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Child SVG Overlays */}
          {children}
        </g>
      </svg>
    </div>
  );
};
