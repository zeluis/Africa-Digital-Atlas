import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { UNRegionName, LiveCountryData } from '../data/types';
import {
  AFRICA_SVG_MAP,
  AFRICA_REGIONS_VIEWBOX,
  AFRICA_UN_REGIONS_STRUCTURED,
  BACKGROUND_SURROUNDING_PATHS,
  BACKGROUND_SURROUNDING_CIRCLES
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
      onMouseLeave={handleRegionLeave}
      className="w-full rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 p-5 sm:p-7 shadow-2xl relative overflow-hidden group/map select-none transition-colors"
    >
      {/* Header Info */}
      <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Official UN M49 Classification</span>
        </div>
        <span className="text-emerald-600 dark:text-emerald-400 transition-colors duration-200">
          {hoveredRegion ? `${hoveredRegion} (${REGION_META[hoveredRegion].shortName})` : 'Hover / Tap Region'}
        </span>
      </div>

      {/* Official Vector Map with W3C Compliant Pure JSX SVG */}
      <div className="relative aspect-[1000/1100] w-full max-w-2xl mx-auto flex items-center justify-center">
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
          {/* Surrounding Geographic Context (Europe/Middle East) */}
          <g className="opacity-40 dark:opacity-20 pointer-events-none">
            {BACKGROUND_SURROUNDING_PATHS.map((p, idx) => (
              <path
                key={`surround-path-${idx}`}
                d={p.d}
                fill="#CFC8BA"
                fillOpacity={0.35}
                stroke="#EAE3D7"
                strokeWidth={0.5}
              />
            ))}
            {BACKGROUND_SURROUNDING_CIRCLES.map((c, idx) => (
              <circle
                key={`surround-circle-${idx}`}
                cx={c.cx}
                cy={c.cy}
                r={c.r}
                fill="#CFC8BA"
                fillOpacity={0.35}
              />
            ))}
          </g>

          {/* 5 UN M49 African Subregions */}
          {UN_REGIONS.map(regName => {
            const regStructure = AFRICA_UN_REGIONS_STRUCTURED[regName];
            const meta = REGION_META[regName];
            const isHovered = hoveredRegion === regName;
            const activeColor = meta.color;
            const opacity = hoveredRegion ? (isHovered ? 1 : 0.42) : 0.88;
            const strokeWidth = isHovered ? 1.5 : 0.75;
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
                      x: (regStructure.labelX / 1000) * rect.width,
                      y: (regStructure.labelY / 1100) * rect.height
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
                  const countryPath = AFRICA_SVG_MAP[iso3];
                  if (!countryPath) return null;

                  return (
                    <g key={iso3}>
                      <path
                        d={countryPath.path}
                        fill={activeColor}
                        fillOpacity={opacity}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeLinejoin="round"
                        className="transition-all duration-200"
                      />
                      {countryPath.islands && countryPath.islands.map((isl, islIdx) => (
                        <path
                          key={`${iso3}-island-${islIdx}`}
                          d={isl}
                          fill={activeColor}
                          fillOpacity={opacity}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeLinejoin="round"
                        />
                      ))}
                    </g>
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
                    x={-((meta.shortName.length * 9) + 16) / 2}
                    y={-14}
                    width={(meta.shortName.length * 9) + 16}
                    height={28}
                    rx={14}
                    fill="#18181b"
                    fillOpacity={isHovered ? 0.95 : 0.75}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="transition-all duration-200"
                  />
                  <text
                    y={4}
                    fill="#FFFFFF"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                    className="select-none tracking-wide"
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

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-zinc-400 block">
                        Population
                      </span>
                      <span className="font-semibold text-zinc-200">
                        {formatCompactNumber(stats.pop)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-zinc-400 block">
                        GDP
                      </span>
                      <span className="font-semibold text-zinc-200">
                        {formatCurrency(stats.gdp)}
                      </span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-zinc-800">
                      <span className="text-[10px] text-zinc-400 line-clamp-1">
                        Largest Economy: <strong className="text-zinc-200">{stats.largest}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Micro CTA footer */}
                  <div className="text-[10px] font-medium text-emerald-400 pt-1 flex items-center justify-between">
                    <span>Click to explore region</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </AnimatePresence>
      </div>

      {/* Mini Legend Row */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
        {UN_REGIONS.map(r => (
          <button
            key={r}
            onClick={() => onSelectRegion(r)}
            onMouseEnter={() => onHoverRegion(r)}
            onMouseLeave={() => onHoverRegion(null)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: REGION_META[r].color }}
            />
            <span>{REGION_META[r].shortName}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

