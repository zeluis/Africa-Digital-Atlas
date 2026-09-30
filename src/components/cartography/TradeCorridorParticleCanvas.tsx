import React, { useMemo } from 'react';
import { ALL_TRADE_CORRIDORS, TradeCorridorPath } from '../../data/preColonialKingdomsDetailed';

export interface TradeCorridorVectorLayerProps {
  selectedCorridorId?: string | null;
  selectedKingdomId?: string | null;
  hoveredCorridorId?: string | null;
  onSelectCorridor?: (corridor: TradeCorridorPath) => void;
  onHoverCorridor?: (corridor: TradeCorridorPath | null) => void;
  activeCentury?: number | null;
  activeCommodityFilter?: string;
  showLabels?: boolean;
}

/**
 * Generates a smooth bezier or polyline path through an array of coordinates
 */
function generatePathString(points: [number, number][]): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0][0]} ${points[0][1]}`;
  
  if (points.length === 2) {
    return `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]}`;
  }

  // Multi-point smooth quadratic/cubic interpolation
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0[0] + p1[0]) / 2;
    const midY = (p0[1] + p1[1]) / 2;

    if (i === 0) {
      d += ` Q ${p0[0]} ${p0[1]}, ${midX} ${midY}`;
    } else {
      d += ` Q ${p0[0]} ${p0[1]}, ${midX} ${midY}`;
    }
  }
  const last = points[points.length - 1];
  d += ` L ${last[0]} ${last[1]}`;
  return d;
}

/**
 * SVG-Native precision trade corridor layer designed to live directly inside the
 * authoritative 5796x5867 SVG coordinate space with transform translate(-216.0198 -66.614).
 * Guarantees zero distortion, perfect coordinate locks across all aspect ratios, and snappy interactivity.
 */
export const TradeCorridorVectorLayer: React.FC<TradeCorridorVectorLayerProps> = ({
  selectedCorridorId = null,
  selectedKingdomId = null,
  hoveredCorridorId = null,
  onSelectCorridor,
  onHoverCorridor,
  activeCentury = null,
  activeCommodityFilter = 'all',
  showLabels = true
}) => {
  const visibleCorridors = useMemo(() => {
    return ALL_TRADE_CORRIDORS.filter(c => {
      if (activeCommodityFilter !== 'all' && c.commodity !== activeCommodityFilter) {
        return false;
      }
      if (activeCentury !== null && !c.activeCenturies.includes(activeCentury)) {
        return false;
      }
      return true;
    });
  }, [activeCentury, activeCommodityFilter]);

  // Sort corridors so selected or hovered corridors render on top
  const sortedCorridors = useMemo(() => {
    return [...visibleCorridors].sort((a, b) => {
      if (a.id === selectedCorridorId) return 1;
      if (b.id === selectedCorridorId) return -1;
      if (a.id === hoveredCorridorId) return 1;
      if (b.id === hoveredCorridorId) return -1;
      return 0;
    });
  }, [visibleCorridors, selectedCorridorId, hoveredCorridorId]);

  return (
    <g id="preColonialTradeCorridorVectorLayer" className="select-none pointer-events-auto">
      <defs>
        <filter id="corridor-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="20" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="corridor-active-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="36" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {sortedCorridors.map((corridor, cIdx) => {
        const pathD = generatePathString(corridor.points);
        if (!pathD) return null;

        const isSelected = selectedCorridorId === corridor.id;
        const isHovered = hoveredCorridorId === corridor.id;
        const [startX, startY] = corridor.points[0];
        const [endX, endY] = corridor.points[corridor.points.length - 1];

        // Opacity and fading logic
        let corridorOpacity = 1.0;
        if (selectedCorridorId) {
          corridorOpacity = isSelected ? 1.0 : 0.04;
        } else if (selectedKingdomId) {
          const isBelongingToKingdom = corridor.kingdomId === selectedKingdomId || 
            corridor.id.startsWith(selectedKingdomId.replace('-kingdom', '').replace('-empire', ''));
          corridorOpacity = isBelongingToKingdom ? 0.95 : 0.04;
        } else if (hoveredCorridorId) {
          corridorOpacity = isHovered ? 1.0 : 0.4;
        }

        const durationSec = 3.6 + (cIdx % 4) * 0.8;

        return (
          <g 
            key={`corridor-group-${corridor.id}`}
            className="cursor-pointer group transition-opacity duration-300 ease-out"
            opacity={corridorOpacity}
            pointerEvents={corridorOpacity < 0.1 ? 'none' : 'auto'}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectCorridor) onSelectCorridor(corridor);
            }}
            onMouseEnter={() => {
              if (onHoverCorridor) onHoverCorridor(corridor);
            }}
            onMouseLeave={() => {
              if (onHoverCorridor) onHoverCorridor(null);
            }}
          >
            {/* 1. Broad Ambient Glow Halo */}
            <path
              d={pathD}
              fill="none"
              stroke={isSelected ? '#fbbf24' : corridor.color}
              strokeWidth={isSelected ? 54 : isHovered ? 40 : 26}
              strokeOpacity={isSelected ? 0.55 : isHovered ? 0.4 : 0.22}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={isSelected ? "url(#corridor-active-glow)" : "url(#corridor-glow-filter)"}
              className="transition-all duration-300"
            />

            {/* 2. Core Solid Track Base */}
            <path
              d={pathD}
              fill="none"
              stroke={corridor.color}
              strokeWidth={isSelected ? 18 : isHovered ? 14 : 9}
              strokeOpacity={isSelected ? 1.0 : 0.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />

            {/* 3. High-Velocity Animated Dash Streamlines */}
            <path
              d={pathD}
              fill="none"
              stroke="#ffffff"
              strokeWidth={isSelected ? 12 : 7}
              strokeDasharray={isSelected ? "56 36" : "36 24"}
              strokeLinecap="round"
              strokeOpacity={isSelected ? 0.95 : 0.7}
            >
              <animate
                attributeName="stroke-dashoffset"
                values="180;0"
                dur={`${durationSec}s`}
                repeatCount="indefinite"
              />
            </path>

            {/* 4. Animated Traveling Jewel Particles */}
            <circle r={isSelected ? 26 : 18} fill="#ffffff" filter="url(#corridor-glow-filter)">
              <animateMotion
                path={pathD}
                dur={`${durationSec}s`}
                repeatCount="indefinite"
                rotate="auto"
              />
            </circle>

            <circle r={isSelected ? 18 : 12} fill={corridor.color}>
              <animateMotion
                path={pathD}
                dur={`${durationSec}s`}
                begin={`${durationSec / 2}s`}
                repeatCount="indefinite"
                rotate="auto"
              />
            </circle>

            {/* 5. Terminal Nodes (Origin & Terminus) */}
            {/* Origin Node */}
            <g 
              transform={`translate(${startX}, ${startY})`} 
              className="cursor-pointer"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectCorridor) onSelectCorridor(corridor);
              }}
            >
              <circle
                cx="0"
                cy="0"
                r={isSelected ? 60 : 40}
                fill={corridor.color}
                fillOpacity={0.3}
              >
                <animate
                  attributeName="r"
                  values={isSelected ? "45;90;45" : "30;60;30"}
                  dur="2.4s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.85;0.2;0.85"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx="0"
                cy="0"
                r={isSelected ? 36 : 26}
                fill={corridor.color}
                stroke="#ffffff"
                strokeWidth={isSelected ? 10 : 7}
              />
              <circle cx="0" cy="0" r={isSelected ? 14 : 9} fill="#ffffff" />
            </g>

            {/* Terminus Node */}
            <g 
              transform={`translate(${endX}, ${endY})`} 
              className="cursor-pointer"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectCorridor) onSelectCorridor(corridor);
              }}
            >
              <circle
                cx="0"
                cy="0"
                r={isSelected ? 60 : 40}
                fill={corridor.color}
                fillOpacity={0.3}
              >
                <animate
                  attributeName="r"
                  values={isSelected ? "45;90;45" : "30;60;30"}
                  dur="2.4s"
                  begin="1.2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.85;0.2;0.85"
                  dur="2.4s"
                  begin="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
              <rect
                x={isSelected ? -32 : -22}
                y={isSelected ? -32 : -22}
                width={isSelected ? 64 : 44}
                height={isSelected ? 64 : 44}
                rx={isSelected ? 14 : 9}
                transform="rotate(45)"
                fill={isSelected ? '#fbbf24' : corridor.color}
                stroke="#ffffff"
                strokeWidth={isSelected ? 10 : 7}
              />
              <circle cx="0" cy="0" r={isSelected ? 12 : 8} fill="#ffffff" />
            </g>

            {/* 6. High-Contrast Terminal Labels */}
            {(showLabels || isSelected || isHovered) && (
              <g 
                className="cursor-pointer pointer-events-auto"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectCorridor) onSelectCorridor(corridor);
                }}
              >
                {/* Start Label */}
                <g transform={`translate(${startX + 40}, ${startY - 35})`}>
                  <rect
                    x="-10"
                    y="-45"
                    width={Math.max(240, corridor.startName.length * 30 + 40)}
                    height="66"
                    rx="33"
                    fill="#09090b"
                    fillOpacity="0.94"
                    stroke={corridor.color}
                    strokeWidth={isSelected ? "8" : "5"}
                    className="drop-shadow-xl"
                  />
                  <text
                    x="12"
                    y="-6"
                    fill="#fef08a"
                    fontFamily="'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif"
                    fontSize="33"
                    fontWeight="800"
                    className="select-none pointer-events-none"
                  >
                    ● {corridor.startName}
                  </text>
                </g>

                {/* End Label */}
                <g transform={`translate(${endX + 40}, ${endY - 35})`}>
                  <rect
                    x="-10"
                    y="-45"
                    width={Math.max(240, corridor.endName.length * 30 + 40)}
                    height="66"
                    rx="33"
                    fill="#09090b"
                    fillOpacity="0.94"
                    stroke={isSelected ? '#fbbf24' : corridor.color}
                    strokeWidth={isSelected ? "8" : "5"}
                    className="drop-shadow-xl"
                  />
                  <text
                    x="12"
                    y="-6"
                    fill="#67e8f9"
                    fontFamily="'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif"
                    fontSize="33"
                    fontWeight="800"
                    className="select-none pointer-events-none"
                  >
                    ◆ {corridor.endName}
                  </text>
                </g>
              </g>
            )}

            {/* 7. Generous Invisible Pointer Hitbox for Easy Reliable Clicking */}
            <path
              d={pathD}
              fill="none"
              stroke="transparent"
              strokeWidth="120"
              strokeLinecap="round"
              className="cursor-pointer pointer-events-auto"
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectCorridor) onSelectCorridor(corridor);
              }}
            />
          </g>
        );
      })}
    </g>
  );
};

export const TradeCorridorParticleCanvas: React.FC<{
  activeCentury?: number | null;
  activeCommodityFilter?: string;
  showLabels?: boolean;
  className?: string;
  selectedCorridorId?: string | null;
  onSelectCorridor?: (corridor: TradeCorridorPath) => void;
}> = () => {
  return null;
};
