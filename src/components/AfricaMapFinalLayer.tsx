import React, { useState, useEffect } from 'react';
import { AFRICA_FINAL_COUNTRY_LABELS } from '../data/africaLabels';
import { getAdmin1PathColor, getAdmin1RealName } from '../data/africaCanonicalColorPalette';
import { fetchAfricaFinalSvg, parseAfricaFinalSvg, ParsedAfricaMapData } from '../utils/svgMapLoader';

interface AfricaMapFinalLayerProps {
  mode: 'authentic_palette' | 'choropleth' | 'schematic_un';
  selectedCountryId: string | null;
  hoveredCountryId: string | null;
  selectedRegion: string | null;
  selectedBloc: string | null;
  showAdmin1: boolean;
  showLabels: boolean;
  hoveredAdmin1Id: string | null;
  onCountryClick: (countryId: string) => void;
  onCountryHover: (countryId: string | null) => void;
  onAdmin1Hover?: (info: { id: string; name: string; countryId: string; countryName: string; x: number; y: number } | null) => void;
  activeIndicator?: string;
  getChoroplethColor?: (countryId: string) => string;
}

export const AfricaMapFinalLayer: React.FC<AfricaMapFinalLayerProps> = ({
  mode,
  selectedCountryId,
  hoveredCountryId,
  showAdmin1,
  showLabels,
  hoveredAdmin1Id,
  onCountryClick,
  onCountryHover,
  onAdmin1Hover,
  getChoroplethColor,
}) => {
  const [mapData, setMapData] = useState<ParsedAfricaMapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchAfricaFinalSvg()
      .then((svgText) => {
        if (isMounted) {
          const parsed = parseAfricaFinalSvg(svgText);
          setMapData(parsed);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error loading Africa Final SVG asset:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading || !mapData) {
    return <g id="map-loading-placeholder" className="animate-pulse" />;
  }

  return (
    <g id="africa-authentic-final-vector-root" className="transition-all duration-300">
      {/* Non-African Adjacent Landmasses */}
      <g id="adjacent-landmasses" className="pointer-events-none opacity-40 dark:opacity-20">
        {mapData.nonAfricanLands.map((land) => (
          <path key={land.id} d={land.d} fill={land.originalFill || '#cbd5e1'} />
        ))}
      </g>

      {/* Coastline Islands */}
      <g id="coastline-islands" className="pointer-events-none opacity-80">
        {mapData.coastlineIslands.map((island) => (
          <path key={island.id} d={island.d} fill={island.originalFill || '#94a3b8'} />
        ))}
      </g>

      {/* Water Bodies */}
      <g id="internal-water-bodies" className="pointer-events-none">
        {mapData.waterBodies.map((water) => (
          <path key={water.id} d={water.d} fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" className="opacity-90 dark:opacity-75" />
        ))}
      </g>

      {/* Sovereign Countries Layer */}
      <g id="sovereign-countries-layer">
        {mapData.countries.map((country) => {
          const isSelected = selectedCountryId === country.id;
          const isHovered = hoveredCountryId === country.id;
          
          let fillColor = country.originalFill || '#10b981';
          if (mode === 'choropleth' && getChoroplethColor) {
            fillColor = getChoroplethColor(country.id);
          }

          return (
            <path
              key={country.id}
              id={`country-final-${country.id}`}
              d={country.d}
              fill={fillColor}
              stroke={isSelected ? '#059669' : '#ffffff'}
              strokeWidth={isSelected ? '6' : '1.8'}
              strokeLinejoin="round"
              strokeLinecap="round"
              className={`cursor-pointer transition-all duration-150 ${
                isSelected ? 'filter drop-shadow-md' : isHovered ? 'opacity-90 filter brightness-110' : 'opacity-100'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onCountryClick(country.id);
              }}
              onMouseEnter={() => onCountryHover(country.id)}
              onMouseLeave={() => onCountryHover(null)}
            />
          );
        })}
      </g>

      {/* Admin-1 Internal Boundaries */}
      {showAdmin1 && (
        <g id="admin1-subdivision-paths" className="transition-opacity duration-200">
          {mapData.admin1Paths.map((admin1) => {
            const isHovered = hoveredAdmin1Id === admin1.id;
            const admin1Color = getAdmin1PathColor(admin1.id, admin1.originalFill);
            const realName = getAdmin1RealName(admin1.id, admin1.id, '');

            return (
              <path
                key={admin1.id}
                id={`admin1-path-${admin1.id}`}
                d={admin1.d}
                fill={admin1Color}
                stroke={isHovered ? '#10b981' : '#000000'}
                strokeWidth={isHovered ? '3.5' : '0.8'}
                strokeOpacity={isHovered ? '1' : '0.35'}
                strokeDasharray="2,2"
                className="cursor-pointer transition-all duration-100 hover:brightness-125"
                onClick={(e) => {
                  e.stopPropagation();
                  const parts = admin1.id.split('_');
                  if (parts.length > 1) {
                    onCountryClick(parts[parts.length - 1]);
                  }
                }}
                onMouseEnter={(e) => onAdmin1Hover?.({ id: admin1.id, name: realName, countryId: '', countryName: '', x: e.clientX, y: e.clientY })}
                onMouseMove={(e) => onAdmin1Hover?.({ id: admin1.id, name: realName, countryId: '', countryName: '', x: e.clientX, y: e.clientY })}
                onMouseLeave={() => onAdmin1Hover?.(null)}
              />
            );
          })}
        </g>
      )}

      {/* Country Centroid Labels */}
      {showLabels && (
        <g id="country-centroid-labels" className="pointer-events-none select-none">
          {AFRICA_FINAL_COUNTRY_LABELS.map((lbl) => {
            const isSelected = selectedCountryId === lbl.id;
            const isHovered = hoveredCountryId === lbl.id;

            let fontSize = lbl.size === 'huge' ? 38 : lbl.size === 'large' ? 32 : lbl.size === 'medium' ? 26 : 20;
            let fontWeight = lbl.size === 'huge' ? 800 : lbl.size === 'large' ? 700 : 600;

            return (
              <g key={lbl.id} transform={`translate(${lbl.x}, ${lbl.y})`}>
                <text textAnchor="middle" dominantBaseline="central" fontSize={fontSize} fontWeight={fontWeight} fill="#ffffff" stroke="#ffffff" strokeWidth="6" strokeLinejoin="round" className="opacity-90 dark:opacity-80">
                  {lbl.name}
                </text>
                <text textAnchor="middle" dominantBaseline="central" fontSize={fontSize} fontWeight={fontWeight} fill={isSelected || isHovered ? '#047857' : '#0f172a'} className="dark:fill-white transition-colors">
                  {lbl.name}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
};