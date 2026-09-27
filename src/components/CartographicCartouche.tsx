import React from 'react';

interface CartographicCartoucheProps {
  x?: number;
  y?: number;
  scale?: number;
  theme?: 'light' | 'dark' | 'parchment';
  activeMetricName?: string;
}

export const CartographicCartouche: React.FC<CartographicCartoucheProps> = ({
  x = 300,
  y = 4800,
  scale = 1.0,
  theme = 'light',
  activeMetricName
}) => {
  const isDark = theme === 'dark';
  const isParchment = theme === 'parchment';

  const bgColor = isDark ? '#181715' : isParchment ? '#F4EDE0' : '#FFFFFF';
  const borderColor = isDark ? '#3D3833' : isParchment ? '#D6C8B2' : '#E2E8F0';
  const headerColor = isDark ? '#F5EFE6' : '#1C1917';
  const subtextColor = isDark ? '#A8A29E' : '#57534E';
  const accentColor = '#D97706'; // Warm Sahel Amber

  return (
    <g 
      id="africalia-cartographic-cartouche"
      transform={`translate(${x}, ${y}) scale(${scale})`}
      className="pointer-events-none select-none font-sans"
    >
      {/* Decorative Outer Border with Double Inset */}
      <rect
        x="0"
        y="0"
        width="1580"
        height="820"
        rx="28"
        fill={bgColor}
        fillOpacity="0.95"
        stroke={borderColor}
        strokeWidth="3.5"
        filter="drop-shadow(0 12px 36px rgba(0,0,0,0.18))"
      />
      <rect
        x="16"
        y="16"
        width="1548"
        height="788"
        rx="20"
        fill="none"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeOpacity="0.45"
      />

      {/* Header Monogram & Institutional Banner */}
      <g transform="translate(60, 75)">
        {/* Emblem Shield */}
        <rect x="0" y="0" width="70" height="70" rx="16" fill={accentColor} fillOpacity="0.15" stroke={accentColor} strokeWidth="1.5" />
        <text x="35" y="46" textAnchor="middle" fill={accentColor} fontSize="34" fontWeight="bold" fontFamily="serif">🌍</text>

        <text x="95" y="28" fill={accentColor} fontSize="17" fontWeight="bold" fontFamily="monospace" letterSpacing="4">
          AFRICALIA OBSERVATORY • CARTOGRAPHIC IMPRINT
        </text>
        <text x="95" y="62" fill={headerColor} fontSize="36" fontWeight="900" fontFamily="serif" letterSpacing="1">
          AFRICA CONTINENTAL DATA ATLAS
        </text>
      </g>

      {/* Primary Description & Geodetic Baseline */}
      <text x="60" y="200" fill={subtextColor} fontSize="21" fontFamily="sans-serif">
        Sovereign Geodesy & Multilateral Statistical Synthesis across 54 Sovereign African Nations.
      </text>

      {/* Active Metric Badge if present */}
      {activeMetricName && (
        <g transform="translate(60, 230)">
          <rect x="0" y="0" width="1460" height="46" rx="12" fill={accentColor} fillOpacity="0.12" stroke={accentColor} strokeWidth="1" />
          <text x="24" y="30" fill={accentColor} fontSize="19" fontWeight="bold" fontFamily="monospace">
            CHOROPLETH THEME: {activeMetricName.toUpperCase()}
          </text>
        </g>
      )}

      {/* Technical Specifications Grid */}
      <g transform="translate(60, 305)">
        <line x1="0" y1="0" x2="1460" y2="0" stroke={borderColor} strokeWidth="1.5" />

        <text x="0" y="36" fill={subtextColor} fontSize="18" fontFamily="monospace">
          GRID: <tspan fill={headerColor} fontWeight="bold">5,796 × 5,867 px</tspan>
        </text>
        <text x="340" y="36" fill={subtextColor} fontSize="18" fontFamily="monospace">
          SUBDIVISIONS: <tspan fill={headerColor} fontWeight="bold">1,017 Admin-1</tspan>
        </text>
        <text x="740" y="36" fill={subtextColor} fontSize="18" fontFamily="monospace">
          PROJECTION: <tspan fill={headerColor} fontWeight="bold">WGS-84 Planar</tspan>
        </text>
        <text x="1140" y="36" fill={subtextColor} fontSize="18" fontFamily="monospace">
          DOI: <tspan fill={accentColor} fontWeight="bold">10.5281/zenodo.10842918</tspan>
        </text>

        <line x1="0" y1="62" x2="1460" y2="62" stroke={borderColor} strokeWidth="1.5" />
      </g>

      {/* Graphic Scale Bar */}
      <g transform="translate(60, 420)">
        <text x="0" y="0" fill={subtextColor} fontSize="17" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
          GRAPHIC SCALE BAR • HAIRLINE GEODESIC CALIBRATION
        </text>
        {/* Scale Segments */}
        <g transform="translate(0, 20)">
          <rect x="0" y="0" width="160" height="12" fill={headerColor} />
          <rect x="160" y="0" width="160" height="12" fill={bgColor} stroke={headerColor} strokeWidth="1.5" />
          <rect x="320" y="0" width="160" height="12" fill={headerColor} />
          <rect x="480" y="0" width="160" height="12" fill={bgColor} stroke={headerColor} strokeWidth="1.5" />
          
          {/* Scale Labels */}
          <text x="0" y="34" textAnchor="middle" fill={subtextColor} fontSize="16" fontFamily="monospace">0</text>
          <text x="160" y="34" textAnchor="middle" fill={subtextColor} fontSize="16" fontFamily="monospace">250 km</text>
          <text x="320" y="34" textAnchor="middle" fill={subtextColor} fontSize="16" fontFamily="monospace">500 km</text>
          <text x="480" y="34" textAnchor="middle" fill={subtextColor} fontSize="16" fontFamily="monospace">750 km</text>
          <text x="640" y="34" textAnchor="middle" fill={subtextColor} fontSize="16" fontFamily="monospace">1,000 km</text>
        </g>
      </g>

      {/* Multilateral Sources Line */}
      <g transform="translate(60, 520)">
        <text x="0" y="0" fill={subtextColor} fontSize="17" fontFamily="sans-serif">
          <tspan fontWeight="bold" fill={headerColor}>Multilateral Statistical Sources:</tspan> World Bank (WDI), IMF (WEO), UN Comtrade, UNESCO, WHO GHO, African Union / AfCFTA, SlaveVoyages TADT.
        </text>
      </g>

      {/* Authorship & Cartographic Copyright */}
      <g transform="translate(60, 600)">
        <rect x="0" y="0" width="1460" height="150" rx="16" fill={accentColor} fillOpacity="0.06" stroke={accentColor} strokeWidth="1" strokeOpacity="0.3" />
        <text x="30" y="38" fill={accentColor} fontSize="18" fontWeight="bold" fontFamily="monospace">
          PRINCIPAL CARTOGRAPHER &amp; ARCHITECT: ZÉLUIS F. CORREIA
        </text>
        <text x="30" y="74" fill={headerColor} fontSize="18" fontWeight="bold" fontFamily="serif">
          Cartography &amp; Spatial Vector Topology © 2024–2026 Africalia. Authored and engineered by Zéluis F. Correia. All Rights Reserved.
        </text>
        <text x="30" y="112" fill={subtextColor} fontSize="16" fontFamily="sans-serif">
          Academic Fair Use: Free to cite &amp; project with attribution. Commercial vector scraping and extraction strictly prohibited under Berne Convention.
        </text>
      </g>
    </g>
  );
};
