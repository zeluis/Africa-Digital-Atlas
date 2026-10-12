import React from 'react';
import { UnescoSiteMetadata } from '../../data/slaveTradeIllustrations';

export interface UnescoHeritageMapLayerProps {
  sites: UnescoSiteMetadata[];
  selectedSite: UnescoSiteMetadata | null;
  hoveredSite: UnescoSiteMetadata | null;
  onHoverSite: (site: UnescoSiteMetadata | null, event?: React.MouseEvent) => void;
  onSelectSite: (site: UnescoSiteMetadata, event?: React.MouseEvent) => void;
}

// Category color palettes
export const UNESCO_CATEGORY_PALETTES = {
  Cultural: {
    base: '#d97706', // Amber-600
    fill: '#fef3c7', // Amber-100
    stroke: '#b45309', // Amber-700
    glow: 'rgba(217, 119, 6, 0.45)',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-800 dark:text-amber-300',
    badgeBorder: 'border-amber-500/30'
  },
  Natural: {
    base: '#059669', // Emerald-600
    fill: '#d1fae5', // Emerald-100
    stroke: '#047857', // Emerald-700
    glow: 'rgba(5, 150, 105, 0.45)',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    badgeBorder: 'border-emerald-500/30'
  },
  Mixed: {
    base: '#0891b2', // Cyan-600
    fill: '#cffafe', // Cyan-100
    stroke: '#0e7490', // Cyan-700
    glow: 'rgba(8, 145, 178, 0.45)',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-800 dark:text-cyan-300',
    badgeBorder: 'border-cyan-500/30'
  }
};

export const UnescoHeritageMapLayer: React.FC<UnescoHeritageMapLayerProps> = ({
  sites,
  selectedSite,
  hoveredSite,
  onHoverSite,
  onSelectSite
}) => {
  return (
    <g id="unesco-heritage-sites-layer" className="select-none pointer-events-auto">
      {sites.map(site => {
        // Fallback calculation if x/y are missing
        const x = site.x ?? (site.longitude !== undefined ? Math.round(61.8 * site.longitude + 1804) : 2500);
        const y = site.y ?? (site.latitude !== undefined ? Math.round(-71.8 * site.latitude + 3081) : 2500);

        const isHovered = hoveredSite?.idNumber === site.idNumber;
        const isSelected = selectedSite?.idNumber === site.idNumber;
        const palette = UNESCO_CATEGORY_PALETTES[site.category] || UNESCO_CATEGORY_PALETTES.Cultural;

        const pinRadius = isSelected ? 48 : isHovered ? 44 : 34;

        // Label offset to avoid crowding
        const labelText = site.site.length > 28 ? `${site.site.slice(0, 26)}…` : site.site;
        const pillWidth = Math.max(260, labelText.length * 15 + 60);

        return (
          <g
            key={`unesco-site-${site.idNumber}`}
            transform={`translate(${x}, ${y})`}
            className="cursor-pointer group"
            onMouseEnter={e => {
              e.stopPropagation();
              onHoverSite(site, e);
            }}
            onMouseLeave={() => {
              onHoverSite(null);
            }}
            onClick={e => {
              e.stopPropagation();
              onSelectSite(site, e);
            }}
          >
            {/* Extended Hit Area */}
            <circle cx="0" cy="0" r="110" fill="transparent" />

            {/* Pulsing Aura */}
            <circle
              cx="0"
              cy="0"
              r={pinRadius}
              fill="none"
              stroke={site.danger ? '#e11d48' : palette.base}
              strokeWidth={isSelected ? '8' : isHovered ? '6' : '3.5'}
              opacity="0.85"
            >
              <animate
                attributeName="r"
                values={`${pinRadius};${pinRadius * 2.2}`}
                dur={site.danger ? '1.8s' : '3.2s'}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.85;0"
                dur={site.danger ? '1.8s' : '3.2s'}
                repeatCount="indefinite"
              />
            </circle>

            {/* Danger Warning Halo if Endangered */}
            {site.danger && (
              <circle
                cx="0"
                cy="0"
                r={pinRadius + 14}
                fill="none"
                stroke="#e11d48"
                strokeWidth="4"
                strokeDasharray="10 6"
                opacity="0.75"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 0"
                  to="360 0 0"
                  dur="16s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Base Drop Shadow / Ground Glow */}
            <ellipse
              cx="0"
              cy="16"
              rx={pinRadius * 0.9}
              ry={pinRadius * 0.45}
              fill="#000000"
              opacity="0.3"
            />

            {/* Outer Hexagon / Shield Badge */}
            <polygon
              points={`0,-${pinRadius} ${pinRadius * 0.86},-${pinRadius * 0.5} ${pinRadius * 0.86},${pinRadius * 0.5} 0,${pinRadius} -${pinRadius * 0.86},${pinRadius * 0.5} -${pinRadius * 0.86},-${pinRadius * 0.5}`}
              fill={site.danger ? '#e11d48' : palette.base}
              stroke="#ffffff"
              strokeWidth={isSelected ? '6' : '4'}
              className="transition-all duration-200"
            />

            {/* Inner Core Fill */}
            <polygon
              points={`0,-${pinRadius * 0.75} ${pinRadius * 0.65},-${pinRadius * 0.38} ${pinRadius * 0.65},${pinRadius * 0.38} 0,${pinRadius * 0.75} -${pinRadius * 0.65},${pinRadius * 0.38} -${pinRadius * 0.65},-${pinRadius * 0.38}`}
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth="2.5"
            />

            {/* UNESCO Classical Temple Glyph */}
            <g transform={`translate(-${pinRadius * 0.38}, -${pinRadius * 0.38}) scale(${pinRadius / 42})`}>
              {/* Pediment (Triangle Roof) */}
              <polygon points="16,4 2,12 30,12" fill={palette.stroke} />
              {/* Architrave */}
              <rect x="2" y="13" width="28" height="2.5" fill={palette.stroke} rx="0.5" />
              {/* Columns */}
              <rect x="4.5" y="16.5" width="2.5" height="11" fill={palette.stroke} rx="0.5" />
              <rect x="11" y="16.5" width="2.5" height="11" fill={palette.stroke} rx="0.5" />
              <rect x="18.5" y="16.5" width="2.5" height="11" fill={palette.stroke} rx="0.5" />
              <rect x="25" y="16.5" width="2.5" height="11" fill={palette.stroke} rx="0.5" />
              {/* Stepped Base */}
              <rect x="1" y="28" width="30" height="2" fill={palette.stroke} rx="0.5" />
              <rect x="0" y="30.5" width="32" height="2.5" fill={palette.stroke} rx="0.5" />
            </g>

            {/* Danger Warning Dot Marker */}
            {site.danger && (
              <circle
                cx={pinRadius * 0.7}
                cy={-pinRadius * 0.7}
                r="10"
                fill="#e11d48"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
            )}

            {/* Hovered or Selected Label Banner */}
            {(isHovered || isSelected) && (
              <g transform="translate(0, -68)" className="pointer-events-none">
                <rect
                  x={-pillWidth / 2}
                  y="-22"
                  width={pillWidth}
                  height="44"
                  rx="22"
                  fill="#ffffff"
                  fillOpacity="0.98"
                  stroke={isSelected ? '#0f172a' : palette.base}
                  strokeWidth={isSelected ? '4' : '2.5'}
                  filter="drop-shadow(0 6px 14px rgba(0,0,0,0.22))"
                />
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="17"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontWeight="bold"
                >
                  🏛️ {labelText}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
