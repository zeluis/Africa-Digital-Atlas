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
            <circle cx="4300" cy="1150" r="140" fill="none" stroke="#f59e0b" strokeWidth="16" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="4300" cy="1150" r="80" fill="none" stroke="#fbbf24" strokeWidth="12" opacity="0.9" className="animate-radar-pulse" />
            <circle cx="4300" cy="1150" r="48" fill="#f59e0b" stroke="#ffffff" strokeWidth="14" />
            <text x="4390" y="1150" fill="#92400e" fontSize="96" fontWeight="900" fontFamily="sans-serif">Benban Solar Megaplex</text>
            <text x="4390" y="1250" fill="#b45309" fontSize="64" fontWeight="700" fontFamily="sans-serif">1.8 GW • 37 km² Solar Field</text>
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
            <circle cx="1580" cy="780" r="130" fill="none" stroke="#ea580c" strokeWidth="14" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="1580" cy="780" r="50" fill="#ea580c" stroke="#ffffff" strokeWidth="14" />
            <text x="1670" y="780" fill="#9a3412" fontSize="90" fontWeight="900" fontFamily="sans-serif">Noor Ouarzazate Solar</text>
            <text x="1670" y="870" fill="#c2410c" fontSize="60" fontWeight="700" fontFamily="sans-serif">World's Largest CSP • Molten Salt Storage</text>
          </g>

          {/* Cross-Mediterranean Clean Energy Cables (Morocco -> Spain, Egypt -> Greece/Europe) */}
          <path
            d="M 1500,480 L 1500,100"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="32"
            strokeDasharray="45,25"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <text x="1540" y="280" fill="#0e7490" fontSize="72" fontWeight="800" fontFamily="sans-serif">Med HVDC Interconnect</text>

          <path
            d="M 3950,520 L 3950,120"
            fill="none"
            stroke="#0284c7"
            strokeWidth="32"
            strokeDasharray="45,25"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <text x="3990" y="300" fill="#0369a1" fontSize="72" fontWeight="800" fontFamily="sans-serif">GREGY Interconnector</text>
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
              d="M 3900,550 A 300,300 0 0,1 4400,550"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="16"
              strokeDasharray="30,20"
              className="animate-dash-fast"
            />
            <path
              d="M 3800,450 A 450,450 0 0,1 4500,450"
              fill="none"
              stroke="#6366f1"
              strokeWidth="14"
              strokeDasharray="35,25"
              className="animate-dash-fast"
            />
            <circle cx="4130" cy="720" r="54" fill="#2563eb" stroke="#ffffff" strokeWidth="15" />
            <text x="3650" y="900" fill="#1e3a8a" fontSize="88" fontWeight="900" fontFamily="sans-serif">Cairo Space & AI City</text>
          </g>

          {/* Trans-Saharan Fiber Optic Highway: Algiers -> Tamanrasset -> Sahel */}
          <path
            d="M 2000,450 L 2150,1250 L 2200,1650 L 2250,2050"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="30"
            strokeDasharray="50,25"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <text x="2250" y="1400" fill="#6d28d9" fontSize="76" fontWeight="800" fontFamily="sans-serif">
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
            <circle cx="2000" cy="450" r="44" fill="#7c3aed" stroke="#ffffff" strokeWidth="12" />
            <text x="1750" y="420" fill="#5b21b6" fontSize="76" fontWeight="800" fontFamily="sans-serif">Algiers Tech</text>
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
            d="M 4200,580 L 4280,780 L 4450,1350"
            fill="none"
            stroke="#0284c7"
            strokeWidth="38"
            strokeDasharray="60,30"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <text x="4350" y="680" fill="#0369a1" fontSize="80" fontWeight="900" fontFamily="sans-serif">Suez Canal 12% World Trade</text>

          {/* Trans-Saharan Caravan Trail (Sijilmassa to Timbuktu & Fez) */}
          <path
            d="M 1600,650 C 1700,1100 1600,1600 1500,2000"
            fill="none"
            stroke="#d97706"
            strokeWidth="24"
            strokeDasharray="40,30"
            strokeLinecap="round"
            opacity="0.8"
            className="animate-dash-med"
          />
          <text x="1100" y="1300" fill="#b45309" fontSize="72" fontWeight="700" fontFamily="sans-serif">
            Historic Trans-Saharan Salt & Gold Route
          </text>
        </g>
      )}
    </g>
  );
};
