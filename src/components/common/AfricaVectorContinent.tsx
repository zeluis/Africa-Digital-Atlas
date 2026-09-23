/**
 * AfricaVectorContinent.tsx
 * Canonical Reusable Africa Vector Cartographic Engine
 * 
 * Powered by authoritative geometry from public/africa-final.svg (5,796 × 5,867 native coordinate space).
 * Designed for universal reuse across Atlantic Slave Trade visualizations, historical maps,
 * macroeconomic charts, and thematic data stories.
 */

import React, { useMemo } from 'react';
import { useAfricaFinalMap } from '../../utils/svgMapLoader';
import { AFRICA_FINAL_MAP, AFRICA_FINAL_TRANSFORM, AFRICA_FINAL_VIEWBOX } from '../../data/africaFinalGeometry';

export type ContinentDisplayMode = 'silhouette' | 'countries' | 'embarkation_zones';
export type ContinentTheme = 'parchment' | 'dark' | 'embarkation' | 'monochrome' | 'custom';

// Historical Slave Trade Embarkation Zone definitions
export const HISTORICAL_EMBARKATION_ZONES: Record<string, {
  name: string;
  color: string;
  countries: string[];
}> = {
  'Senegambia': {
    name: 'Senegambia',
    color: '#0284c7', // sky-600
    countries: ['SEN', 'GMB', 'MRT', 'GNB']
  },
  'Sierra Leone': {
    name: 'Sierra Leone',
    color: '#059669', // emerald-600
    countries: ['SLE', 'GIN']
  },
  'Windward Coast': {
    name: 'Windward Coast',
    color: '#10b981', // emerald-500
    countries: ['LBR', 'CIV']
  },
  'Gold Coast': {
    name: 'Gold Coast',
    color: '#d97706', // amber-600
    countries: ['GHA']
  },
  'Bight of Benin': {
    name: 'Bight of Benin',
    color: '#ea580c', // orange-600
    countries: ['TGO', 'BEN', 'NGA']
  },
  'Bight of Biafra': {
    name: 'Bight of Biafra',
    color: '#dc2626', // red-600
    countries: ['CMR', 'GNQ', 'GAB', 'STP']
  },
  'West Central Africa': {
    name: 'West Central Africa',
    color: '#7c3aed', // violet-600
    countries: ['COG', 'COD', 'AGO']
  },
  'Southeast Africa & Indian Ocean': {
    name: 'Southeast Africa & Indian Ocean',
    color: '#4338ca', // indigo-700
    countries: ['MOZ', 'MDG', 'TZA', 'KEN']
  }
};

// Fast ISO3 -> Historic Zone lookup map
export const COUNTRY_TO_EMBARKATION_ZONE: Record<string, string> = {};
for (const [zoneKey, zoneData] of Object.entries(HISTORICAL_EMBARKATION_ZONES)) {
  for (const iso3 of zoneData.countries) {
    COUNTRY_TO_EMBARKATION_ZONE[iso3] = zoneKey;
  }
}

export interface AfricaVectorContinentProps {
  /** Rendering mode: silhouette outline, sovereign countries, or 8 historic embarkation zones */
  mode?: ContinentDisplayMode;
  /** Palette theme */
  theme?: ContinentTheme;
  /** Highlight specific historical regions (e.g. ['Gold Coast', 'Bight of Benin']) */
  highlightRegions?: string[];
  /** Active selected/hovered region */
  activeRegion?: string | null;
  /** Highlight specific country ISO3 codes */
  highlightCountries?: string[];
  /** Active selected/hovered country */
  activeCountry?: string | null;
  /** Custom dynamic country fill callback */
  getCountryColor?: (countryId: string) => string;
  /** Event handlers */
  onCountryHover?: (countryId: string | null, e?: React.MouseEvent) => void;
  onCountryClick?: (countryId: string, e?: React.MouseEvent) => void;
  onRegionHover?: (region: string | null) => void;
  onRegionClick?: (region: string) => void;
  /** Base stroke styling */
  strokeWidth?: number;
  strokeColor?: string;
  /** Opacity override */
  opacity?: number;
  /** Whether to render labels for major regions/countries */
  showLabels?: boolean;
  /** Positioning inside parent SVG (nested <svg>) */
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  /** Optional transformation */
  transform?: string;
  /** CSS class */
  className?: string;
  /** If true, wraps in standalone <svg> tag instead of nested <svg> */
  isStandalone?: boolean;
}

export const AfricaVectorContinent: React.FC<AfricaVectorContinentProps> = ({
  mode = 'silhouette',
  theme = 'parchment',
  highlightRegions = [],
  activeRegion = null,
  highlightCountries = [],
  activeCountry = null,
  getCountryColor,
  onCountryHover,
  onCountryClick,
  onRegionHover,
  onRegionClick,
  strokeWidth,
  strokeColor,
  opacity = 1,
  showLabels = false,
  x,
  y,
  width,
  height,
  transform,
  className = '',
  isStandalone = false
}) => {
  const { mapData, isLoaded } = useAfricaFinalMap();
  const countries = useMemo(() => Object.values(mapData || AFRICA_FINAL_MAP), [mapData]);

  // Determine stroke color by theme
  const resolvedStrokeColor = strokeColor || (
    theme === 'dark' ? '#38bdf8' :
    theme === 'monochrome' ? '#52525b' :
    '#8c7e64'
  );

  // Determine base stroke width
  const resolvedStrokeWidth = strokeWidth !== undefined ? strokeWidth : (
    mode === 'silhouette' ? 1.8 : 1.2
  );

  // Palette mapper per country
  const resolveCountryFill = (iso3: string): string => {
    if (getCountryColor) {
      return getCountryColor(iso3);
    }

    const zoneName = COUNTRY_TO_EMBARKATION_ZONE[iso3];
    const isCountryActive = activeCountry === iso3;
    const isCountryHighlighted = highlightCountries.includes(iso3);
    const isRegionActive = activeRegion && (activeRegion === zoneName || (activeRegion === 'All'));
    const isRegionHighlighted = highlightRegions.length === 0 || (zoneName && highlightRegions.includes(zoneName));

    if (mode === 'embarkation_zones') {
      if (!zoneName) {
        // Interior / Hinterland
        return theme === 'dark' ? '#1e293b' : '#ede5d8';
      }

      const zoneInfo = HISTORICAL_EMBARKATION_ZONES[zoneName];
      const baseCol = zoneInfo?.color || '#059669';

      if (isRegionActive || isCountryActive) {
        return baseCol;
      }
      if (isRegionHighlighted || isCountryHighlighted) {
        return theme === 'dark' ? `${baseCol}dd` : `${baseCol}cc`;
      }
      // Dimmed if another region is highlighted
      return theme === 'dark' ? '#1e293b88' : '#e6ddd0';
    }

    if (theme === 'dark') {
      if (isCountryActive) return '#38bdf8';
      if (isCountryHighlighted) return '#0284c7';
      return '#0f172a';
    }

    if (theme === 'monochrome') {
      if (isCountryActive) return '#18181b';
      if (isCountryHighlighted) return '#3f3f46';
      return '#f4f4f5';
    }

    // Default Parchment
    if (isCountryActive) return '#78350f';
    if (isCountryHighlighted) return '#b45309';
    return '#ece3d3';
  };

  const content = (
    <g
      id="africa-authoritative-vector-continent"
      transform={transform || AFRICA_FINAL_TRANSFORM}
      className={`africa-vector-group transition-opacity duration-300 ${className}`}
      opacity={opacity}
    >
      {/* 1. Complete vector boundaries from authoritative map */}
      {countries.map((country) => {
        const fill = resolveCountryFill(country.id);
        const isHovered = activeCountry === country.id;
        const isZoneActive = activeRegion && COUNTRY_TO_EMBARKATION_ZONE[country.id] === activeRegion;
        const hasAdmin1 = country.admin1 && country.admin1.length > 0;

        return (
          <g
            key={`continent-country-${country.id}`}
            id={`vector-country-${country.id}`}
            className="cursor-pointer transition-colors duration-150"
            onMouseEnter={(e) => {
              onCountryHover?.(country.id, e);
              const zone = COUNTRY_TO_EMBARKATION_ZONE[country.id];
              if (zone) onRegionHover?.(zone);
            }}
            onMouseLeave={() => {
              onCountryHover?.(null);
              onRegionHover?.(null);
            }}
            onClick={(e) => {
              onCountryClick?.(country.id, e);
              const zone = COUNTRY_TO_EMBARKATION_ZONE[country.id];
              if (zone) onRegionClick?.(zone);
            }}
          >
            {hasAdmin1 ? (
              country.admin1.map((sub) => (
                <path
                  key={`admin1-${sub.id}-${sub.seq}`}
                  d={sub.d}
                  fill={fill}
                  stroke={isHovered || isZoneActive ? '#000000' : resolvedStrokeColor}
                  strokeWidth={isHovered || isZoneActive ? resolvedStrokeWidth * 1.6 : resolvedStrokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))
            ) : (
              country.centroid && (
                <circle
                  cx={country.centroid.x}
                  cy={country.centroid.y}
                  r={32}
                  fill={fill}
                  stroke={resolvedStrokeColor}
                  strokeWidth={resolvedStrokeWidth}
                  opacity={0.4}
                />
              )
            )}
          </g>
        );
      })}

      {/* 2. Optional Embarkation Region Labels */}
      {showLabels && (
        <g id="historical-region-labels" className="pointer-events-none select-none font-sans font-bold">
          {Object.entries(HISTORICAL_EMBARKATION_ZONES).map(([zoneName, data]) => {
            // Find centroid of first country in zone
            const firstIso = data.countries[0];
            const countryMeta = AFRICA_FINAL_MAP[firstIso];
            if (!countryMeta?.centroid) return null;

            const isHighlighted = highlightRegions.length === 0 || highlightRegions.includes(zoneName);

            return (
              <text
                key={`zone-label-${zoneName}`}
                x={countryMeta.centroid.x}
                y={countryMeta.centroid.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={data.color}
                fontSize="64"
                fontFamily="serif"
                fontWeight="900"
                letterSpacing="2"
                opacity={isHighlighted ? 0.95 : 0.4}
                paintOrder="stroke fill"
                stroke="#ffffff"
                strokeWidth="12px"
                vectorEffect="non-scaling-stroke"
              >
                {zoneName.toUpperCase()}
              </text>
            );
          })}
        </g>
      )}
    </g>
  );

  // If standalone, wrap in top-level SVG tag with exact viewBox
  if (isStandalone) {
    return (
      <svg
        viewBox={AFRICA_FINAL_VIEWBOX}
        className={className}
        style={{ width: width || '100%', height: height || '100%' }}
      >
        {content}
      </svg>
    );
  }

  // If nested inside a parent SVG canvas (like AtlanticFlowMap or AfricanPortsMap)
  if (x !== undefined && y !== undefined && width !== undefined && height !== undefined) {
    return (
      <svg
        x={x}
        y={y}
        width={width}
        height={height}
        viewBox={AFRICA_FINAL_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        overflow="visible"
        className={className}
      >
        {content}
      </svg>
    );
  }

  return content;
};
