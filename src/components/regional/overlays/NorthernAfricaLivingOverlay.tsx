import React from 'react';
import { RegionalOverlayProps } from './WesternAfricaLivingOverlay';

export const NorthernAfricaLivingOverlay: React.FC<RegionalOverlayProps> = ({
  themeFilter,
  onSelectHub,
}) => {
  const showTech = themeFilter === 'all' || themeFilter === 'tech';
  const showEnergy = themeFilter === 'all' || themeFilter === 'energy';
  const showClimate = themeFilter === 'all' || themeFilter === 'climate';
  const showHistory = themeFilter === 'all' || themeFilter === 'history';

  return (
    <g className="northern-africa-overlay pointer-events-auto">
      {/* ========================================================================= */}
      {/* 1. SOLAR MEGAPROJECTS & CLEAN HYDROGEN HVDC CORRIDORS                     */}
      {/* ========================================================================= */}
      {showEnergy && (
        <g className="energy-solar-layer">
          {/* Benban Solar Park (Aswan, Egypt - 1.8 GW) Concentric Radiance */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Benban Solar Megaplex (Aswan)",
              category: "Renewable Energy Megaproject",
              description: "One of the world's largest solar installations spanning 37 km², producing 3.8 TWh of clean energy annually.",
              metric: "1.8 GW Peak Capacity • 41 Solar Power Plants",
              countryCode: "EGY"
            })}
          >
            <circle cx="672" cy="228" r="20" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="672" cy="228" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            <rect x="605" y="238" width="134" height="23" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#d97706" strokeWidth="1" />
            <text x="672" y="249" textAnchor="middle" fill="#92400e" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">Benban Solar Megaplex</text>
            <text x="672" y="258" textAnchor="middle" fill="#b45309" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">1.8 GW • 37 km² Clean Energy</text>
          </g>

          {/* Noor Ouarzazate Solar Complex (Morocco - World's Largest Concentrated Solar Power) */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Noor Ouarzazate Solar Complex",
              category: "Concentrated Solar Power (CSP)",
              description: "World's largest CSP plant with molten salt thermal storage, generating solar electricity day and night.",
              metric: "580 MW Installed Capacity • 3,000 Hectares",
              countryCode: "MAR"
            })}
          >
            <circle cx="248" cy="142" r="18" fill="none" stroke="#ea580c" strokeWidth="2" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="248" cy="142" r="6" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
            <rect x="180" y="152" width="136" height="23" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#ea580c" strokeWidth="1" />
            <text x="248" y="163" textAnchor="middle" fill="#9a3412" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">Noor Ouarzazate Solar</text>
            <text x="248" y="172" textAnchor="middle" fill="#c2410c" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">World's Largest CSP • Molten Salt</text>
          </g>

          {/* Cross-Mediterranean Clean Energy Cables (Morocco -> Spain, Egypt -> Europe) */}
          <path
            d="M 258 95 L 258 40"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <text x="262" y="60" fill="#0e7490" fontSize="8" fontWeight="800" fontFamily="sans-serif">Med HVDC Cable</text>

          <path
            d="M 657 140 L 657 55"
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <text x="662" y="75" fill="#0369a1" fontSize="8" fontWeight="800" fontFamily="sans-serif">GREGY Interconnector</text>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 2. SPACE SCIENCE, AI & TRANS-SAHARAN DIGITAL HIGHWAY                      */}
      {/* ========================================================================= */}
      {showTech && (
        <g className="space-tech-layer">
          {/* Cairo Space Agency & New Capital AI Hub */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "African Space Agency & AI Megacity",
              category: "Space Science & AI",
              description: "Headquarters of the African Space Agency, high-performance computing centers, and satellite integration city.",
              metric: "AfSA HQ • Earth Observation & Space Communications",
              countryCode: "EGY"
            })}
          >
            {/* Orbital Radiating Arcs */}
            <path
              d="M 625 140 A 35 35 0 0 1 685 140"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5 3"
              className="animate-dash-fast"
            />
            <circle cx="657" cy="152" r="16" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="657" cy="152" r="6" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            <rect x="590" y="165" width="134" height="23" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#2563eb" strokeWidth="1" />
            <text x="657" y="176" textAnchor="middle" fill="#1e3a8a" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">Cairo Space & AI City</text>
            <text x="657" y="185" textAnchor="middle" fill="#1d4ed8" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">AfSA HQ • Satellite Complex</text>
          </g>

          {/* Trans-Saharan Fiber Optic Highway: Algiers -> Tamanrasset -> Sahel */}
          <path
            d="M 362 68 L 375 160 L 395 230 L 400 290"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeDasharray="7 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <text x="405" y="210" fill="#6d28d9" fontSize="8.5" fontWeight="800" fontFamily="sans-serif">
            TRANS-SAHARAN FIBER HIGHWAY
          </text>

          {/* Algiers Innovation Hub */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Algiers Digital & Energy Hub",
              category: "Technology & Engineering",
              description: "National incubator network, AI research institutes, and fiber backbone anchor.",
              metric: "Algeria Venture • High-Speed Regional Node",
              countryCode: "DZA"
            })}
          >
            <circle cx="362" cy="68" r="15" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="362" cy="68" r="5.5" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.8" />
            <rect x="315" y="44" width="94" height="18" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#7c3aed" strokeWidth="1" />
            <text x="362" y="56" textAnchor="middle" fill="#5b21b6" fontSize="9" fontWeight="800" fontFamily="sans-serif">Algiers Tech</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 3. HISTORIC CARAVAN TRAILS & SUEZ MARITIME ARTERY                         */}
      {/* ========================================================================= */}
      {showHistory && (
        <g className="history-maritime-layer">
          {/* Suez Canal Global Shipping Arterial */}
          <path
            d="M 686 138 L 688 170 L 696 220"
            fill="none"
            stroke="#0284c7"
            strokeWidth="3.5"
            strokeDasharray="8 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <text x="702" y="165" fill="#0369a1" fontSize="9" fontWeight="900" fontFamily="sans-serif">
            Suez Canal 12% World Trade
          </text>

          {/* Trans-Saharan Caravan Trail (Sijilmassa to Timbuktu) */}
          <path
            d="M 255 125 C 265 180 250 240 240 280"
            fill="none"
            stroke="#d97706"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            opacity="0.8"
            className="animate-dash-med"
          />
          <text x="255" y="215" fill="#b45309" fontSize="8" fontWeight="700" fontFamily="sans-serif">
            Historic Salt & Gold Route
          </text>
        </g>
      )}
    </g>
  );
};
