import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { UNRegionName, LiveCountryData } from '../data/types';
import {
  AFRICA_SVG_MAP,
  AFRICA_REGIONS_VIEWBOX,
  AFRICA_UN_REGIONS_STRUCTURED
} from '../data/svgMaps';
import {
  UN_REGIONS,
  REGION_META,
  REGIONS_DATA,
  COUNTRIES_DATA,
  formatCompactNumber,
  formatCurrency,
  parseNumberString
} from '../data/africaData';
import { useAfricaFinalMap } from '../utils/svgMapLoader';

interface AfricaVectorMapProps {
  onSelectRegion: (region: UNRegionName) => void;
  hoveredRegion: UNRegionName | null;
  onHoverRegion: (region: UNRegionName | null) => void;
  liveData?: Record<string, LiveCountryData>;
}

export const AfricaVectorMap: React.FC<AfricaVectorMapProps> = ({
  onSelectRegion,
  hoveredRegion,
  onHoverRegion,
  liveData = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const { mapData } = useAfricaFinalMap();

  const isInteractingWithTooltipRef = useRef<boolean>(false);
  const [pinnedRegion, setPinnedRegion] = useState<UNRegionName | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleRegionHover = (reg: UNRegionName, e?: React.MouseEvent) => {
    if (pinnedRegion || isInteractingWithTooltipRef.current) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    onHoverRegion(reg);
    if (e && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleRegionLeave = () => {
    if (pinnedRegion || isInteractingWithTooltipRef.current) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isInteractingWithTooltipRef.current && !pinnedRegion) {
        onHoverRegion(null);
        setTooltipPos(null);
      }
    }, 600);
  };

  const handleTooltipMouseEnter = () => {
    isInteractingWithTooltipRef.current = true;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    isInteractingWithTooltipRef.current = false;
    if (pinnedRegion) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isInteractingWithTooltipRef.current && !pinnedRegion) {
        onHoverRegion(null);
        setTooltipPos(null);
      }
    }, 400);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isInteractingWithTooltipRef.current || pinnedRegion) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltipPos({ x, y });
  };

  // Get aggregated stats for hovered region
  const getRegionStats = (reg: UNRegionName) => {
    const regData = REGIONS_DATA[reg];
    const memberCountries = regData.members;

    const totalPop = memberCountries.reduce((sum, name) => {
      const live = liveData[name]?.wb?.pop;
      return sum + (live || parseNumberString(COUNTRIES_DATA[name]?.pop) || 0);
    }, 0);

    const totalGdp = memberCountries.reduce((sum, name) => {
      const live = liveData[name]?.wb?.gdp;
      return sum + (live || parseNumberString(COUNTRIES_DATA[name]?.gdp) || 0);
    }, 0);

    return {
      nations: memberCountries.length,
      pop: totalPop,
      gdp: totalGdp,
      largest: regData.largestEconomy,
      climate: regData.climateProfile
    };
  };

  // Smart bounds calculation for tooltip
  const getTooltipCoords = () => {
    if (!tooltipPos || !containerRef.current) return { left: 16, top: 16 };
    const rect = containerRef.current.getBoundingClientRect();
    const cWidth = rect.width;
    const cHeight = rect.height;
    const tooltipWidth = 270;
    const tooltipHeight = 230;

    let left = tooltipPos.x + 14;
    if (left + tooltipWidth > cWidth - 12) {
      left = tooltipPos.x - tooltipWidth - 14;
    }
    left = Math.max(12, Math.min(left, cWidth - tooltipWidth - 12));

    let top = tooltipPos.y - 20;
    if (top + tooltipHeight > cHeight - 12) {
      top = cHeight - tooltipHeight - 12;
    }
    top = Math.max(12, top);

    return { left, top };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 p-6 shadow-xl backdrop-blur-sm select-none"
    >
      {/* Visual Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Official UN M49 Classification</span>
        </div>
        <span className="text-emerald-600 dark:text-emerald-400 transition-colors duration-200">
          {hoveredRegion ? `${hoveredRegion} (${REGION_META[hoveredRegion].shortName})` : 'Hover / Tap Region'}
        </span>
      </div>

      {/* Official Vector Map with W3C Compliant Pure JSX SVG */}
      <div className="relative aspect-[1000/1000] w-full max-w-2xl mx-auto flex items-center justify-center">
        <svg
          viewBox={AFRICA_REGIONS_VIEWBOX}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full select-none transition-all duration-300 focus:outline-none overflow-visible"
          role="region"
          aria-label="Official UN M49 Geographic Classification Vector Map of Africa"
        >
          {/* 5 UN M49 African Subregions */}
          {UN_REGIONS.map(regName => {
            const regStructure = AFRICA_UN_REGIONS_STRUCTURED[regName];
            const meta = REGION_META[regName];
            const isHovered = hoveredRegion === regName;
            const activeColor = meta.color;
            const opacity = hoveredRegion ? (isHovered ? 1 : 0.42) : 0.88;
            const strokeWidth = isHovered ? 10 : 4;
            const strokeColor = '#FFFFFF';

            return (
              <g
                key={regName}
                id={`map-region-vector-${meta.shortName.toLowerCase()}`}
                tabIndex={0}
                role="button"
                aria-label={`Explore ${regName}, ${REGIONS_DATA[regName].countries} nations`}
                className="cursor-pointer transition-all duration-300 focus:outline-none group/region"
                onMouseEnter={(e) => handleRegionHover(regName, e)}
                onMouseLeave={handleRegionLeave}
                onFocus={() => {
                  if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setTooltipPos({
                      x: (regStructure.labelX / 6036) * rect.width,
                      y: (regStructure.labelY / 5867) * rect.height
                    });
                  }
                  handleRegionHover(regName);
                }}
                onBlur={handleRegionLeave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectRegion(regName);
                  }
                }}
                onClick={() => onSelectRegion(regName)}
              >
                {/* Member Country SVG Paths */}
                {regStructure.countryIds.map(iso3 => {
                  const item = mapData[iso3] || AFRICA_SVG_MAP[iso3];
                  if (!item) return null;

                  const adminPaths = (item as any).admin1;
                  if (adminPaths && adminPaths.length > 0) {
                    return (
                      <g key={iso3}>
                        {adminPaths.map((adm: any) => (
                          <path
                            key={adm.id}
                            d={adm.d}
                            fill={activeColor}
                            fillOpacity={opacity}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeLinejoin="round"
                            className="transition-all duration-200"
                          />
                        ))}
                      </g>
                    );
                  }

                  const pathStr = (item as any).path;
                  if (!pathStr) return null;

                  return (
                    <path
                      key={iso3}
                      d={pathStr}
                      fill={activeColor}
                      fillOpacity={opacity}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      className="transition-all duration-200"
                    />
                  );
                })}

                {/* Island Circles for Microstates/Islands */}
                {regStructure.islandCircles && regStructure.islandCircles.map((island, islIdx) => (
                  <circle
                    key={`${regName}-circle-${islIdx}`}
                    cx={island.cx}
                    cy={island.cy}
                    r={island.r}
                    fill={activeColor}
                    fillOpacity={opacity}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    className="transition-all duration-200"
                  />
                ))}

                {/* Region Label Pill */}
                <g
                  transform={`translate(${regStructure.labelX}, ${regStructure.labelY})`}
                  className="pointer-events-none"
                >
                  <rect
                    x={-((meta.shortName.length * 55) + 120) / 2}
                    y={-80}
                    width={(meta.shortName.length * 55) + 120}
                    height={160}
                    rx={80}
                    fill="#18181b"
                    fillOpacity={isHovered ? 0.95 : 0.8}
                    stroke="#FFFFFF"
                    strokeWidth={10}
                    className="transition-all duration-200"
                  />
                  <text
                    y={25}
                    fill="#FFFFFF"
                    fontSize="75"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                    className="select-none tracking-wider"
                  >
                    {meta.shortName}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Custom Floating Japandi-Styled Interactive Tooltip */}
        <AnimatePresence>
          {hoveredRegion && tooltipPos && (() => {
            const coords = getTooltipCoords();
            const stats = getRegionStats(hoveredRegion);
            return (
              <div
                id="map-floating-japandi-tooltip"
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
                className="pointer-events-auto absolute z-30 transition-all duration-75"
                style={{
                  left: `${coords.left}px`,
                  top: `${coords.top}px`
                }}
              >
                <div 
                  onClick={() => onSelectRegion(hoveredRegion)}
                  className="rounded-2xl border border-zinc-700 bg-zinc-900/95 backdrop-blur-md shadow-2xl p-3.5 text-left w-68 space-y-2 text-zinc-100 cursor-pointer hover:border-emerald-500/60 transition-colors"
                >
                  {/* Header with region color dot */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: REGION_META[hoveredRegion].color }}
                      />
                      <span className="font-sans font-bold text-sm text-zinc-100 truncate">
                        {hoveredRegion}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {REGIONS_DATA[hoveredRegion].countries} Nations
                    </span>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-1">
                    <div className="bg-zinc-800/60 p-2 rounded-xl border border-zinc-700/50">
                      <div className="text-[10px] text-zinc-400 font-mono">Total Population</div>
                      <div className="font-mono font-bold text-zinc-100 text-sm mt-0.5">
                        {formatCompactNumber(stats.pop)}
                      </div>
                    </div>

                    <div className="bg-zinc-800/60 p-2 rounded-xl border border-zinc-700/50">
                      <div className="text-[10px] text-zinc-400 font-mono">Combined GDP</div>
                      <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                        {formatCurrency(stats.gdp)}
                      </div>
                    </div>
                  </div>

                  {/* Detail footer */}
                  <div className="text-[11px] text-zinc-400 space-y-1 border-t border-zinc-800 pt-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Anchor Economy:</span>
                      <span className="font-bold text-zinc-200">{stats.largest}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Climate Zone:</span>
                      <span className="text-zinc-300 truncate max-w-[130px]">{stats.climate}</span>
                    </div>
                  </div>

                  {/* Tap CTA */}
                  <div className="pt-1 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Explore Region Dossier →
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
};
