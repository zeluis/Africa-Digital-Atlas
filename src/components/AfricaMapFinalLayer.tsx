import React from 'react';
import { AFRICA_FINAL_MAP, AFRICA_FINAL_TRANSFORM } from '../data/africaFinalGeometry';
import { AfricanRegion } from '../data/types';

interface AfricaMapFinalLayerProps {
  selectedEntityId: string | null;
  activeTooltipEntityId: string | null;
  hoveredEntityId: string | null;
  hoveredAdmin1: { id: string; name: string; countryId: string } | null;
  selectedAdmin1?: { id: string; name: string; countryId?: string } | null;
  showAdmin1Borders: boolean;
  showGraticuleAndCompass?: boolean;
  visibleRegions: Set<AfricanRegion>;
  activeRegionFilter: string;
  activeBlocFilter?: string | null;
  blocMemberSet?: Set<string> | null;
  getCountryFill: (country: { id: string; unRegion: AfricanRegion; originalColor?: string }, isSelected: boolean, isHovered: boolean) => string;
  handleCountryHover: (countryId: string, event: React.MouseEvent) => void;
  handleCountryLeave: () => void;
  handleCountryClick: (countryId: string, event: React.MouseEvent) => void;
  handleAdmin1Click?: (admin1: { id: string; name: string; countryId: string }, event: React.MouseEvent) => void;
  setHoveredAdmin1: React.Dispatch<React.SetStateAction<{ id: string; name: string; countryId: string } | null>>;
}

export const AfricaMapFinalLayer: React.FC<AfricaMapFinalLayerProps> = ({
  selectedEntityId,
  activeTooltipEntityId,
  hoveredEntityId,
  hoveredAdmin1,
  selectedAdmin1,
  showAdmin1Borders,
  showGraticuleAndCompass = true,
  visibleRegions,
  activeRegionFilter,
  activeBlocFilter,
  blocMemberSet,
  getCountryFill,
  handleCountryHover,
  handleCountryLeave,
  handleCountryClick,
  handleAdmin1Click,
  setHoveredAdmin1,
}) => {
  return (
    <>
      {/* Scaled Graticule Latitude / Longitude lines extending edge-to-edge across container */}
      {showGraticuleAndCompass && (
        <g id="graticule-grid-final" className="pointer-events-none select-none">
          {/* 20°W Meridian */}
          <line x1="450" y1="-5000" x2="450" y2="12000" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="8 8" opacity="0.35" />
          <text x="450" y="180" textAnchor="middle" fill="#0284c7" fontSize="28" fontFamily="monospace" fontWeight="bold" opacity="0.8">20°W</text>

          {/* 0° Prime Meridian (Greenwich) */}
          <line x1="1500" y1="-5000" x2="1500" y2="12000" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="14 10" opacity="0.65" />
          <g transform="translate(1500, 160)">
            <rect x="-140" y="-30" width="280" height="60" rx="10" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" opacity="0.95" />
            <text x="0" y="8" textAnchor="middle" fill="#0369a1" fontSize="26" fontFamily="monospace" fontWeight="900">0° PRIME MERIDIAN</text>
          </g>

          {/* 20°E Meridian */}
          <line x1="2800" y1="-5000" x2="2800" y2="12000" stroke="#64748b" strokeWidth="0.8" strokeDasharray="8 8" opacity="0.35" />
          <text x="2800" y="180" textAnchor="middle" fill="#475569" fontSize="28" fontFamily="monospace" fontWeight="bold" opacity="0.8">20°E</text>

          {/* 40°E Meridian */}
          <line x1="4100" y1="-5000" x2="4100" y2="12000" stroke="#64748b" strokeWidth="0.8" strokeDasharray="8 8" opacity="0.35" />
          <text x="4100" y="180" textAnchor="middle" fill="#475569" fontSize="28" fontFamily="monospace" fontWeight="bold" opacity="0.8">40°E</text>

          {/* Tropic of Cancer 23.4° N */}
          <line x1="-5000" y1="1650" x2="12000" y2="1650" stroke="#d97706" strokeWidth="1.2" strokeDasharray="14 10" opacity="0.65" />
          <g transform="translate(5176, 1622)">
            <rect x="0" y="-28" width="560" height="56" rx="10" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" opacity="0.95" />
            <text x="280" y="8" textAnchor="middle" fill="#b45309" fontSize="24" fontFamily="monospace" fontWeight="900">☀️ TROPIC OF CANCER 23.4°N</text>
          </g>

          {/* Equator 0° */}
          <line x1="-5000" y1="3280" x2="12000" y2="3280" stroke="#059669" strokeWidth="1.6" strokeDasharray="18 12" opacity="0.85" />
          <g transform="translate(5176, 3252)">
            <rect x="0" y="-30" width="560" height="60" rx="12" fill="#ecfdf5" stroke="#059669" strokeWidth="1.8" opacity="0.98" />
            <text x="280" y="10" textAnchor="middle" fill="#047857" fontSize="26" fontFamily="monospace" fontWeight="900">☀️ EQUATOR 0° • EQUINOX</text>
          </g>

          {/* Tropic of Capricorn 23.4° S */}
          <line x1="-5000" y1="4800" x2="12000" y2="4800" stroke="#d97706" strokeWidth="1.2" strokeDasharray="14 10" opacity="0.65" />
          <g transform="translate(5136, 4772)">
            <rect x="0" y="-28" width="600" height="56" rx="10" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" opacity="0.95" />
            <text x="300" y="8" textAnchor="middle" fill="#b45309" fontSize="24" fontFamily="monospace" fontWeight="900">☀️ TROPIC OF CAPRICORN 23.4°S</text>
          </g>

          {/* Polished Light-Themed Nautical Compass Rose in South Atlantic with Hairline Accents */}
          <g transform="translate(1000, 4200) scale(4.8)" className="pointer-events-none select-none">
            {/* Outer Nautical Rings */}
            <circle cx="0" cy="0" r="48" fill="#ffffff" fillOpacity="0.94" stroke="#0284c7" strokeWidth="0.8" strokeOpacity="0.6" />
            <circle cx="0" cy="0" r="44" fill="none" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="1 2" opacity="0.8" />
            <circle cx="0" cy="0" r="38" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="28" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.7" />

            {/* Corner 8-point Azimuth Points */}
            <g transform="rotate(45)">
              <polygon points="0,-24 3.5,-5 0,0" fill="#0284c7" />
              <polygon points="0,-24 -3.5,-5 0,0" fill="#0369a1" />
              <polygon points="0,24 3.5,5 0,0" fill="#0284c7" />
              <polygon points="0,24 -3.5,5 0,0" fill="#0369a1" />
              <polygon points="24,0 5,3.5 0,0" fill="#0284c7" />
              <polygon points="24,0 5,-3.5 0,0" fill="#0369a1" />
              <polygon points="-24,0 -5,3.5 0,0" fill="#0284c7" />
              <polygon points="-24,0 -5,-3.5 0,0" fill="#0369a1" />
            </g>

            {/* Cardinal 4-point Main Arrows */}
            <polygon points="0,-36 6,-8 0,0" fill="#059669" />
            <polygon points="0,-36 -6,-8 0,0" fill="#047857" />
            <polygon points="0,36 6,8 0,0" fill="#64748b" />
            <polygon points="0,36 -6,8 0,0" fill="#475569" />
            <polygon points="36,0 8,6 0,0" fill="#0284c7" />
            <polygon points="36,0 8,-6 0,0" fill="#0369a1" />
            <polygon points="-36,0 -8,6 0,0" fill="#0284c7" />
            <polygon points="-36,0 -8,-6 0,0" fill="#0369a1" />

            {/* Compass Center Jewel */}
            <circle cx="0" cy="0" r="6" fill="#ffffff" stroke="#d97706" strokeWidth="1" />
            <circle cx="0" cy="0" r="3" fill="#059669" />
            <circle cx="0" cy="0" r="1" fill="#ffffff" />
            <circle cx="0" cy="-42" r="1.5" fill="#059669" />

            {/* Compass Typography */}
            <text x="0" y="-46" textAnchor="middle" dominantBaseline="central" fill="#047857" fontSize="10" fontFamily="serif" fontWeight="900" paintOrder="stroke fill" stroke="#ffffff" strokeWidth="2px">N</text>
            <text x="0" y="50" textAnchor="middle" dominantBaseline="central" fill="#334155" fontSize="8.5" fontFamily="serif" fontWeight="bold" paintOrder="stroke fill" stroke="#ffffff" strokeWidth="2px">S</text>
            <text x="47" y="0" textAnchor="middle" dominantBaseline="central" fill="#334155" fontSize="8.5" fontFamily="serif" fontWeight="bold" paintOrder="stroke fill" stroke="#ffffff" strokeWidth="2px">E</text>
            <text x="-47" y="0" textAnchor="middle" dominantBaseline="central" fill="#334155" fontSize="8.5" fontFamily="serif" fontWeight="bold" paintOrder="stroke fill" stroke="#ffffff" strokeWidth="2px">W</text>
            <text x="0" y="62" textAnchor="middle" fill="#0369a1" fontSize="6.5" fontFamily="monospace" fontWeight="900" letterSpacing="0.1em">SOUTH ATLANTIC</text>
          </g>
        </g>
      )}

      {/* Sovereign Boundaries and 1,017 Admin-1 Subdivisions Layer */}
      <g id="africa-countries-layer-final" transform={AFRICA_FINAL_TRANSFORM}>
        {Object.values(AFRICA_FINAL_MAP).map(country => {
          const isSelected = selectedEntityId === country.id || activeTooltipEntityId === country.id;
          const isHovered = hoveredEntityId === country.id;
          const isRegionVisible = visibleRegions.has(country.unRegion);
          const isRegionFiltered = activeRegionFilter !== 'All' && country.unRegion !== activeRegionFilter;
          const isBlocFiltered = !!blocMemberSet && !blocMemberSet.has(country.id);
          
          const isDimmed = !isRegionVisible || isRegionFiltered || isBlocFiltered;
          const fill = getCountryFill(country, isSelected, isHovered);

          return (
            <g 
              key={country.id}
              id={`country-group-${country.id}`}
              style={{
                opacity: isDimmed ? 0.08 : 1,
                transition: 'opacity 0.25s ease, fill 0.2s ease'
              }}
              className={isDimmed ? 'pointer-events-none' : ''}
            >
              {/* Country Boundary Halo when Hovered or Selected */}
              {(isHovered || isSelected) && country.admin1 && country.admin1.length > 0 && (
                <g className="pointer-events-none">
                  {country.admin1.map(sub => (
                    <path
                      key={`halo-${sub.id}`}
                      d={sub.d}
                      fill="none"
                      stroke={isSelected ? '#10b981' : '#38bdf8'}
                      strokeWidth={isSelected ? 14 : 9}
                      strokeOpacity={isSelected ? 0.6 : 0.45}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  ))}
                </g>
              )}

              {/* Admin-1 subdivision paths from africa-final.svg */}
              {country.admin1.map(sub => {
                const isSubSelected = selectedAdmin1?.id === sub.id || (selectedAdmin1?.name && selectedAdmin1.name.toLowerCase() === sub.name.toLowerCase() && selectedAdmin1.countryId === country.id);
                const isSubHovered = hoveredAdmin1?.id === sub.id;
                return (
                  <path
                    key={sub.id}
                    id={sub.id}
                    d={sub.d}
                    fill={isSubSelected ? '#10b981' : isSubHovered ? '#38bdf8' : fill}
                    stroke={
                      isSubSelected
                        ? '#ffffff'
                        : isSelected 
                        ? '#059669' 
                        : isSubHovered
                        ? '#ffffff'
                        : isHovered 
                        ? '#0f172a' 
                        : showAdmin1Borders 
                        ? 'rgba(30, 41, 59, 0.45)' 
                        : 'rgba(30, 41, 59, 0.15)'
                    }
                    strokeWidth={
                      isSubSelected
                        ? 5
                        : isSelected 
                        ? 4.5 
                        : isSubHovered
                        ? 3.8
                        : isHovered 
                        ? 2.8 
                        : showAdmin1Borders 
                        ? 1.2 
                        : 0.4
                    }
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="cursor-pointer transition-colors duration-150"
                    onMouseEnter={(e) => {
                      setHoveredAdmin1({ id: sub.id, name: sub.name, countryId: country.id });
                      handleCountryHover(country.id, e);
                    }}
                    onMouseLeave={() => {
                      setHoveredAdmin1(null);
                      handleCountryLeave();
                    }}
                    onClick={(e) => {
                      if (handleAdmin1Click) {
                        handleAdmin1Click({ id: sub.id, name: sub.name, countryId: country.id }, e);
                      } else {
                        handleCountryClick(country.id, e);
                      }
                    }}
                  >
                    <title>{`${sub.name}, ${country.name} (${country.id})`}</title>
                  </path>
                );
              })}

              {/* Generous Target Hit Area for Small Island States */}
              {['CPV', 'STP', 'SYC', 'MUS', 'COM'].includes(country.id) && country.centroid && (
                <circle
                  cx={country.centroid.x}
                  cy={country.centroid.y}
                  r={country.id === 'CPV' ? 180 : 130}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={(e) => handleCountryHover(country.id, e)}
                  onMouseLeave={handleCountryLeave}
                  onClick={(e) => handleCountryClick(country.id, e)}
                />
              )}

              {/* Dedicated Cabo Verde Oceanic Locator Beacon */}
              {country.id === 'CPV' && country.centroid && (
                <g 
                  transform={`translate(${country.centroid.x}, ${country.centroid.y})`}
                  className="cursor-pointer"
                  onMouseEnter={(e) => handleCountryHover('CPV', e)}
                  onMouseLeave={handleCountryLeave}
                  onClick={(e) => handleCountryClick('CPV', e)}
                >
                  {(isSelected || isHovered) && (
                    <circle r="170" fill="#81dc05" opacity="0.25" className="animate-ping pointer-events-none" />
                  )}
                  <circle
                    r="150"
                    fill="transparent"
                    stroke={isSelected ? '#059669' : isHovered ? '#10b981' : 'rgba(129, 220, 5, 0.75)'}
                    strokeWidth={isSelected ? 8 : 5}
                    strokeDasharray="16 12"
                  />
                  {/* Positioned between Barlavento (north) and Sotavento (south), aligned left */}
                  <rect
                    x="-205"
                    y="-38"
                    width="115"
                    height="76"
                    rx="16"
                    fill="#81dc05"
                    stroke={isSelected ? '#059669' : isHovered ? '#0f172a' : '#4d8a03'}
                    strokeWidth="4"
                  />
                  <text
                    x="-147.5"
                    y="2"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#111827"
                    fontSize="42"
                    fontFamily="monospace"
                    fontWeight="900"
                    className="pointer-events-none"
                  >
                    CV
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* Country Centroid Labels Layer (Scaled & Positioned Perfectly on Top of Each Territory) */}
      <g id="africa-labels-layer-final" transform={AFRICA_FINAL_TRANSFORM} className="pointer-events-none select-none">
        {Object.values(AFRICA_FINAL_MAP).map(country => {
          const isRegionVisible = visibleRegions.has(country.unRegion);
          const isRegionFiltered = activeRegionFilter !== 'All' && country.unRegion !== activeRegionFilter;
          const isBlocFiltered = !!blocMemberSet && !blocMemberSet.has(country.id);
          if (!isRegionVisible || isRegionFiltered || isBlocFiltered) return null;
          if (!country.centroid || country.id === 'CPV') return null;

          const isSelected = selectedEntityId === country.id || activeTooltipEntityId === country.id;
          const isHovered = hoveredEntityId === country.id;

          const bbox = country.bbox;
          const boxWidth = bbox ? (bbox.maxX - bbox.minX) : 0;
          const boxHeight = bbox ? (bbox.maxY - bbox.minY) : 0;
          const area = country.area || (boxWidth * boxHeight);

          const isHuge = area > 1200000;
          const isLarge = area > 450000 && !isHuge;
          const isMedium = area > 100000 && !isLarge && !isHuge;
          const isSmall = !isMedium && !isLarge && !isHuge;

          // Always show large and medium countries, or small countries when hovered/selected
          if (isSmall && !isSelected && !isHovered) return null;

          let fontSize = 22;
          if (isHuge) fontSize = 42;
          else if (isLarge) fontSize = 32;
          else if (isMedium) fontSize = 26;
          else fontSize = 20;

          let displayName = country.id;
          if (isHuge || isLarge) {
            const nameOverrides: Record<string, string> = {
              'COD': 'D.R. CONGO',
              'COG': 'CONGO',
              'CAF': 'C.A.R.',
              'TZA': 'TANZANIA',
              'CIV': "CÔTE D'IVOIRE",
              'GNQ': 'EQ. GUINEA',
              'SWZ': 'ESWATINI',
              'ZAF': 'SOUTH AFRICA',
              'SSD': 'S. SUDAN',
              'MDG': 'MADAGASCAR',
              'MOZ': 'MOZAMBIQUE',
              'MRT': 'MAURITANIA',
              'ETH': 'ETHIOPIA',
              'NGA': 'NIGERIA',
              'DZA': 'ALGERIA',
              'LBY': 'LIBYA',
              'SDN': 'SUDAN',
              'EGY': 'EGYPT',
              'AGO': 'ANGOLA',
              'NAM': 'NAMIBIA',
              'BWA': 'BOTSWANA',
              'ZMB': 'ZAMBIA',
              'MLI': 'MALI',
              'NER': 'NIGER',
              'TCD': 'CHAD',
              'SOM': 'SOMALIA',
              'KEN': 'KENYA',
              'MAR': 'MOROCCO',
              'CMR': 'CAMEROON',
              'GAB': 'GABON',
              'GHA': 'GHANA',
              'GIN': 'GUINEA',
              'SEN': 'SENEGAL'
            };
            displayName = nameOverrides[country.id] || country.name.toUpperCase();
          }

          return (
            <g key={`final-label-${country.id}`}>
              <text
                x={country.centroid.x}
                y={country.centroid.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isSelected ? '#059669' : isHovered ? '#0f172a' : '#1e293b'}
                fontSize={fontSize}
                fontFamily="sans-serif"
                fontWeight="900"
                letterSpacing="0.07em"
                paintOrder="stroke fill"
                stroke="#ffffff"
                strokeWidth={isHuge ? "10px" : "7px"}
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={isSelected || isHovered ? 1 : 0.9}
              >
                {displayName}
              </text>
            </g>
          );
        })}
      </g>
    </>
  );
};
