import React from 'react';

interface CartographicCartoucheProps {
  x?: number;
  y?: number;
  scale?: number;
  theme?: 'light' | 'dark' | 'parchment';
  activeMetricName?: string;
  onOpenModal?: () => void;
}

export const CartographicCartouche: React.FC<CartographicCartoucheProps> = ({
  x = 120,
  y = 4680,
  scale = 1.12,
  theme = 'light',
  activeMetricName,
  onOpenModal
}) => {
  const isDark = theme === 'dark';
  const isParchment = theme === 'parchment';

  const bgColor = isDark ? '#090d16' : isParchment ? '#faf6ee' : '#ffffff';
  const outerBorderColor = isDark ? '#334155' : isParchment ? '#d6c8b2' : '#0f172a';
  const innerBorderColor = '#d97706'; // Warm Cartographic Amber
  const headerColor = isDark ? '#f8fafc' : '#0f172a';
  const subtextColor = isDark ? '#cbd5e1' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#475569';
  const accentColor = '#b45309'; // Rich Amber / Gold
  const accentBadgeBg = isDark ? 'rgba(217, 119, 6, 0.24)' : 'rgba(217, 119, 6, 0.14)';

  const cardWidth = 1760;
  const cardHeight = 980;

  return (
    <g 
      id="africalia-cartographic-cartouche"
      transform={`translate(${x}, ${y}) scale(${scale})`}
      className="cursor-pointer select-none group"
      onClick={(e) => {
        e.stopPropagation();
        onOpenModal?.();
      }}
    >
      {/* Invisible Expanded Hitbox */}
      <rect
        x="-10"
        y="-10"
        width={cardWidth + 20}
        height={cardHeight + 20}
        fill="transparent"
      />

      {/* Soft Ambient Cartographic Drop Shadow */}
      <rect
        x="0"
        y="0"
        width={cardWidth}
        height={cardHeight}
        rx="36"
        fill={bgColor}
        fillOpacity="0.99"
        stroke={outerBorderColor}
        strokeWidth="5"
        filter="drop-shadow(0 24px 60px rgba(15, 23, 42, 0.35))"
        className="transition-all duration-300 group-hover:stroke-amber-600"
      />

      {/* Ornate Gold Inset Border */}
      <rect
        x="20"
        y="20"
        width={cardWidth - 40}
        height={cardHeight - 40}
        rx="28"
        fill="none"
        stroke={innerBorderColor}
        strokeWidth="2.5"
        strokeOpacity="0.85"
      />

      {/* Ornate Corner Brackets (Florentine Cartographic Brackets) */}
      <g stroke={innerBorderColor} strokeWidth="3.5" fill="none">
        {/* Top-Left */}
        <path d="M 36 72 L 36 36 L 72 36" />
        <circle cx="36" cy="36" r="5" fill={innerBorderColor} />
        {/* Top-Right */}
        <path d={`M ${cardWidth - 72} 36 L ${cardWidth - 36} 36 L ${cardWidth - 36} 72`} />
        <circle cx={cardWidth - 36} cy="36" r="5" fill={innerBorderColor} />
        {/* Bottom-Left */}
        <path d={`M 36 ${cardHeight - 72} L 36 ${cardHeight - 36} L 72 ${cardHeight - 36}`} />
        <circle cx="36" cy={cardHeight - 36} r="5" fill={innerBorderColor} />
        {/* Bottom-Right */}
        <path d={`M ${cardWidth - 72} ${cardHeight - 36} L ${cardWidth - 36} ${cardHeight - 36} L ${cardWidth - 36} ${cardHeight - 72}`} />
        <circle cx={cardWidth - 36} cy={cardHeight - 36} r="5" fill={innerBorderColor} />
      </g>

      {/* Header Monogram & Institutional Banner */}
      <g transform="translate(70, 72)">
        {/* Heraldic Shield Crest */}
        <rect
          x="0"
          y="0"
          width="96"
          height="96"
          rx="22"
          fill={accentBadgeBg}
          stroke={accentColor}
          strokeWidth="3"
        />
        <text
          x="48"
          y="64"
          textAnchor="middle"
          fill={accentColor}
          fontSize="50"
          fontWeight="bold"
          fontFamily="serif"
        >
          🌍
        </text>

        {/* Institutional Overline */}
        <text
          x="124"
          y="32"
          fill={accentColor}
          fontSize="22"
          fontWeight="900"
          fontFamily="monospace"
          letterSpacing="4"
        >
          AFRICALIA OBSERVATORY • AUTONOMOUS CARTOGRAPHIC IMPRINT
        </text>

        {/* Major Title */}
        <text
          x="124"
          y="78"
          fill={headerColor}
          fontSize="48"
          fontWeight="900"
          fontFamily="serif"
          letterSpacing="0.8"
        >
          AFRICA CONTINENTAL DATA ATLAS
        </text>
      </g>

      {/* Subtitle / Descriptive Baseline */}
      <text
        x="70"
        y="212"
        fill={subtextColor}
        fontSize="26"
        fontFamily="sans-serif"
        fontWeight="700"
      >
        Sovereign Geodesy &amp; Multilateral Statistical Synthesis across all 54 African Nations.
      </text>

      {/* Active Thematic Metric Banner */}
      {activeMetricName && (
        <g transform="translate(70, 240)">
          <rect
            x="0"
            y="0"
            width={cardWidth - 140}
            height="56"
            rx="16"
            fill={accentBadgeBg}
            stroke={innerBorderColor}
            strokeWidth="2"
          />
          <text
            x="28"
            y="36"
            fill={headerColor}
            fontSize="24"
            fontWeight="900"
            fontFamily="monospace"
            letterSpacing="1"
          >
            📊 ACTIVE CHOROPLETH THEME: <tspan fill={accentColor}>{activeMetricName.toUpperCase()}</tspan>
          </text>
        </g>
      )}

      {/* Geodetic Specification Cards Grid */}
      <g transform={`translate(70, ${activeMetricName ? 320 : 258})`}>
        {/* Specification Box 1: Canvas Coordinate Grid */}
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="385" height="82" rx="16" fill={isDark ? '#1e293b' : '#f8fafc'} stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="2" />
          <text x="24" y="30" fill={mutedColor} fontSize="16" fontWeight="800" fontFamily="monospace" letterSpacing="1.2">CANVAS GRID</text>
          <text x="24" y="62" fill={headerColor} fontSize="24" fontWeight="900" fontFamily="monospace">5,796 × 5,867 px</text>
        </g>

        {/* Specification Box 2: Admin Subdivisions */}
        <g transform="translate(410, 0)">
          <rect x="0" y="0" width="385" height="82" rx="16" fill={isDark ? '#1e293b' : '#f8fafc'} stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="2" />
          <text x="24" y="30" fill={mutedColor} fontSize="16" fontWeight="800" fontFamily="monospace" letterSpacing="1.2">SUBDIVISIONS</text>
          <text x="24" y="62" fill={headerColor} fontSize="24" fontWeight="900" fontFamily="monospace">1,017 Admin-1 Units</text>
        </g>

        {/* Specification Box 3: Projection */}
        <g transform="translate(820, 0)">
          <rect x="0" y="0" width="385" height="82" rx="16" fill={isDark ? '#1e293b' : '#f8fafc'} stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="2" />
          <text x="24" y="30" fill={mutedColor} fontSize="16" fontWeight="800" fontFamily="monospace" letterSpacing="1.2">PROJECTION</text>
          <text x="24" y="62" fill={headerColor} fontSize="24" fontWeight="900" fontFamily="monospace">WGS-84 Planar</text>
        </g>

        {/* Specification Box 4: Research DOI */}
        <g transform="translate(1230, 0)">
          <rect x="0" y="0" width="390" height="82" rx="16" fill={accentBadgeBg} stroke={accentColor} strokeWidth="2" />
          <text x="24" y="30" fill={accentColor} fontSize="16" fontWeight="800" fontFamily="monospace" letterSpacing="1.2">RESEARCH DOI</text>
          <text x="24" y="62" fill={headerColor} fontSize="22" fontWeight="900" fontFamily="monospace">10.5281/zenodo.10842918</text>
        </g>
      </g>

      {/* Dual Geodesic Graphic Scale Bar */}
      <g transform={`translate(70, ${activeMetricName ? 434 : 372})`}>
        <text
          x="0"
          y="0"
          fill={headerColor}
          fontSize="22"
          fontWeight="900"
          fontFamily="monospace"
          letterSpacing="1.5"
        >
          GRAPHIC SCALE BAR • HAIRLINE GEODESIC CALIBRATION
        </text>

        {/* Metric Kilometers Scale Bar (High Contrast Alternating Solid / Outline Blocks) */}
        <g transform="translate(0, 26)">
          {/* Segments (0 - 250 - 500 - 750 - 1000 km) */}
          <rect x="0" y="0" width="190" height="18" fill={headerColor} />
          <rect x="190" y="0" width="190" height="18" fill={bgColor} stroke={headerColor} strokeWidth="2.5" />
          <rect x="380" y="0" width="190" height="18" fill={headerColor} />
          <rect x="570" y="0" width="190" height="18" fill={bgColor} stroke={headerColor} strokeWidth="2.5" />

          {/* Sub-divisions hairline notches (50km ticks) */}
          <line x1="0" y1="-8" x2="0" y2="26" stroke={headerColor} strokeWidth="3" />
          <line x1="190" y1="-8" x2="190" y2="26" stroke={headerColor} strokeWidth="3" />
          <line x1="380" y1="-8" x2="380" y2="26" stroke={headerColor} strokeWidth="3" />
          <line x1="570" y1="-8" x2="570" y2="26" stroke={headerColor} strokeWidth="3" />
          <line x1="760" y1="-8" x2="760" y2="26" stroke={headerColor} strokeWidth="3" />

          {/* Kilometer Labels */}
          <text x="0" y="52" textAnchor="middle" fill={headerColor} fontSize="20" fontWeight="900" fontFamily="monospace">0</text>
          <text x="190" y="52" textAnchor="middle" fill={headerColor} fontSize="20" fontWeight="900" fontFamily="monospace">250 km</text>
          <text x="380" y="52" textAnchor="middle" fill={headerColor} fontSize="20" fontWeight="900" fontFamily="monospace">500 km</text>
          <text x="570" y="52" textAnchor="middle" fill={headerColor} fontSize="20" fontWeight="900" fontFamily="monospace">750 km</text>
          <text x="760" y="52" textAnchor="middle" fill={headerColor} fontSize="20" fontWeight="900" fontFamily="monospace">1,000 km</text>
        </g>

        {/* Auxiliary Nautical Miles Scale Bar */}
        <g transform="translate(880, 26)">
          <rect x="0" y="0" width="180" height="18" fill={accentColor} />
          <rect x="180" y="0" width="180" height="18" fill={bgColor} stroke={accentColor} strokeWidth="2.5" />
          <rect x="360" y="0" width="180" height="18" fill={accentColor} />
          <rect x="540" y="0" width="180" height="18" fill={bgColor} stroke={accentColor} strokeWidth="2.5" />

          <line x1="0" y1="-8" x2="0" y2="26" stroke={accentColor} strokeWidth="3" />
          <line x1="180" y1="-8" x2="180" y2="26" stroke={accentColor} strokeWidth="3" />
          <line x1="360" y1="-8" x2="360" y2="26" stroke={accentColor} strokeWidth="3" />
          <line x1="540" y1="-8" x2="540" y2="26" stroke={accentColor} strokeWidth="3" />
          <line x1="720" y1="-8" x2="720" y2="26" stroke={accentColor} strokeWidth="3" />

          <text x="0" y="52" textAnchor="middle" fill={accentColor} fontSize="20" fontWeight="900" fontFamily="monospace">0</text>
          <text x="180" y="52" textAnchor="middle" fill={accentColor} fontSize="20" fontWeight="900" fontFamily="monospace">150 nm</text>
          <text x="360" y="52" textAnchor="middle" fill={accentColor} fontSize="20" fontWeight="900" fontFamily="monospace">300 nm</text>
          <text x="540" y="52" textAnchor="middle" fill={accentColor} fontSize="20" fontWeight="900" fontFamily="monospace">450 nm</text>
          <text x="720" y="52" textAnchor="middle" fill={accentColor} fontSize="20" fontWeight="900" fontFamily="monospace">600 Nautical Miles</text>
        </g>
      </g>

      {/* Multilateral Statistical Sources Baseline */}
      <g transform={`translate(70, ${activeMetricName ? 558 : 496})`}>
        <rect
          x="0"
          y="0"
          width={cardWidth - 140}
          height="60"
          rx="14"
          fill={isDark ? '#1e293b' : '#f1f5f9'}
          stroke={isDark ? '#334155' : '#cbd5e1'}
          strokeWidth="1.8"
        />
        <text
          x="24"
          y="38"
          fill={subtextColor}
          fontSize="20"
          fontFamily="sans-serif"
          fontWeight="700"
        >
          <tspan fontWeight="900" fill={headerColor}>Multilateral Statistical Sources:</tspan> World Bank (WDI), IMF (WEO), UN Comtrade, UNESCO, WHO GHO, African Union / AfCFTA, SlaveVoyages TADT.
        </text>
      </g>

      {/* Authorship & Cartographic Colophon Box */}
      <g transform={`translate(70, ${activeMetricName ? 640 : 578})`}>
        <rect
          x="0"
          y="0"
          width={cardWidth - 140}
          height="180"
          rx="20"
          fill={accentBadgeBg}
          stroke={accentColor}
          strokeWidth="2.5"
        />
        {/* Principal Cartographer Line */}
        <text
          x="32"
          y="46"
          fill={accentColor}
          fontSize="24"
          fontWeight="900"
          fontFamily="monospace"
          letterSpacing="1.2"
        >
          ★ PRINCIPAL CARTOGRAPHER &amp; ARCHITECT: ZÉLUIS F. CORREIA
        </text>
        {/* Authorship & Copyright Statement */}
        <text
          x="32"
          y="92"
          fill={headerColor}
          fontSize="22"
          fontWeight="800"
          fontFamily="serif"
        >
          Cartography &amp; Spatial Vector Topology © 2024–2026 Africalia. Authored and engineered by Zéluis F. Correia. All Rights Reserved.
        </text>
        {/* Intellectual Property & Licensing Guidance */}
        <text
          x="32"
          y="136"
          fill={subtextColor}
          fontSize="20"
          fontFamily="sans-serif"
          fontWeight="600"
        >
          Academic Fair Use: Authorized to cite &amp; project with attribution. Automated vector scraping and uncredited extraction prohibited under the Berne Convention.
        </text>
      </g>

      {/* Interactive Loupe CTA Footer Ribbon */}
      <g transform={`translate(70, ${activeMetricName ? 840 : 778})`}>
        <rect
          x="0"
          y="0"
          width={cardWidth - 140}
          height="54"
          rx="14"
          fill={headerColor}
          className="transition-all duration-200 group-hover:fill-amber-600"
        />
        <text
          x={(cardWidth - 140) / 2}
          y="35"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="20"
          fontWeight="900"
          fontFamily="monospace"
          letterSpacing="2"
        >
          🔍 CLICK TO OPEN HIGH-RESOLUTION CARTOUCHE &amp; GEODESIC LOUPE INSPECTOR
        </text>
      </g>
    </g>
  );
};
