import React, { useState } from 'react';
import { AFRICA_SVG_MAP, AFRICA_UN_REGIONS_STRUCTURED } from '../data/svgMaps';
import { UN_REGIONS, REGION_META } from '../data/africaData';
import { AfricanRegion } from '../data/types';

interface AfricaUnLogoProps {
  className?: string;
  size?: number | string;
  activeRegion?: AfricanRegion | string | null;
  onSelectRegion?: (regionName: AfricanRegion) => void;
  interactive?: boolean;
}

/**
 * Africa UN Geoscheme Silhouette Logo
 * Displays the entire African continent with authentic UN Geoscheme regional colors:
 * - Northern Africa: Blue (#2563EB)
 * - Western Africa: Green (#16A34A)
 * - Central Africa: Magenta (#C026D3)
 * - Eastern Africa: Yellow/Gold (#EAB308)
 * - Southern Africa: Red (#DC2626)
 *
 * Supports active regional illumination, hover feedback, and optional regional switching.
 */
export const AfricaUnLogo: React.FC<AfricaUnLogoProps> = ({ 
  className = "w-10 h-10",
  size,
  activeRegion,
  onSelectRegion,
  interactive = true
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Normalize activeRegion (handles 'region-western' -> 'Western Africa')
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

  return (
    <div className="relative inline-flex items-center justify-center group/un-logo">
      <svg
        viewBox="60 65 890 985"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={size ? { width: size, height: size } : undefined}
        className={`shrink-0 overflow-visible transition-transform duration-200 ease-out hover:scale-110 active:scale-95 cursor-pointer ${className}`}
        aria-label="Africalia African Continent UN Geoscheme Logo"
        role="img"
      >
        <g>
          {UN_REGIONS.map((regionName) => {
            const region = AFRICA_UN_REGIONS_STRUCTURED[regionName];
            const meta = REGION_META[regionName];
            const color = meta.color;
            
            const isHovered = hoveredRegion === regionName;
            const isScopeActive = resolvedActive === regionName;
            const hasFocusState = Boolean(hoveredRegion || resolvedActive);
            
            // Opacity logic: if there is focus state, illuminate target and soften others
            const isFocal = isHovered || isScopeActive;
            const opacity = hasFocusState ? (isFocal ? 1 : 0.42) : 1;

            return (
              <g 
                key={regionName}
                opacity={opacity}
                className="transition-opacity duration-200 ease-in-out cursor-pointer"
                onMouseEnter={() => interactive && setHoveredRegion(regionName)}
                onMouseLeave={() => interactive && setHoveredRegion(null)}
                onClick={(e) => {
                  if (onSelectRegion) {
                    e.stopPropagation();
                    onSelectRegion(regionName as AfricanRegion);
                  }
                }}
              >
                {region.countryIds.map((iso3) => {
                  const country = AFRICA_SVG_MAP[iso3];
                  if (!country) return null;

                  return (
                    <path
                      key={iso3}
                      d={country.path}
                      fill={color}
                      stroke={isFocal ? "#FFFFFF" : "#FFFFFF"}
                      strokeWidth={isFocal ? 1.4 : 0.7}
                      strokeLinejoin="round"
                    />
                  );
                })}

                {/* Island representations for island nations */}
                {region.islandCircles?.map((isl, idx) => (
                  <circle
                    key={`logo-circle-${regionName}-${idx}`}
                    cx={isl.cx}
                    cy={isl.cy}
                    r={Math.max(isl.r * 1.3, 7.5)}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth={isFocal ? 1.4 : 0.7}
                  />
                ))}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Mini Floating Tooltip on Logo Hover */}
      {hoveredRegion && (
        <div 
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-zinc-900/95 text-white text-[10px] font-mono whitespace-nowrap pointer-events-none shadow-lg border border-zinc-800 z-50 animate-in fade-in zoom-in duration-100"
        >
          {hoveredRegion}
        </div>
      )}
    </div>
  );
};
