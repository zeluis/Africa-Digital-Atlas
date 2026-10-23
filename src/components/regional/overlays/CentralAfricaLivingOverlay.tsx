import React from 'react';
import { RegionalOverlayProps } from './WesternAfricaLivingOverlay';

export const CentralAfricaLivingOverlay: React.FC<RegionalOverlayProps> = ({
  themeFilter,
  onSelectHub,
}) => {
  const showClimate = themeFilter === 'all' || themeFilter === 'climate';
  const showEnergy = themeFilter === 'all' || themeFilter === 'energy';
  const showTech = themeFilter === 'all' || themeFilter === 'tech';
  const showHistory = themeFilter === 'all' || themeFilter === 'history';

  return (
    <g className="central-africa-overlay pointer-events-auto">
      {/* ========================================================================= */}
      {/* 1. CONGO BASIN RAINFOREST & PEATLANDS ("LUNGS OF THE PLANET")             */}
      {/* ========================================================================= */}
      {showClimate && (
        <g className="congo-basin-biosphere-layer">
          {/* Cuvette Centrale Peatland Carbon Sink & Rainforest Aura */}
          <ellipse
            cx="550"
            cy="480"
            rx="75"
            ry="55"
            fill="#10b981"
            opacity="0.18"
            className="animate-pulse-slow"
          />
          <ellipse
            cx="550"
            cy="480"
            rx="45"
            ry="35"
            fill="#059669"
            opacity="0.25"
          />

          {/* Congo River Hydrographic Loop */}
          <path
            d="M 615 580 C 640 520 620 460 560 460 C 510 460 510 510 490 528"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3.2"
            strokeDasharray="8 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Central Congo Basin Node */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Congo Basin Peatlands & Rainforest",
              category: "Earth Biosphere & Carbon Sink",
              description: "The world's second-largest tropical rainforest and world's largest tropical peatland complex storing 30 billion metric tons of carbon.",
              metric: "30B Tonnes Carbon Sunk • 2M km² Pristine Canopy",
              countryCode: "COD"
            })}
          >
            <circle cx="550" cy="480" r="18" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="550" cy="480" r="6" fill="#059669" stroke="#ffffff" strokeWidth="2" />
            <rect x="480" y="495" width="140" height="23" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#059669" strokeWidth="1" />
            <text x="550" y="506" textAnchor="middle" fill="#065f46" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">Congo Basin Biosphere</text>
            <text x="550" y="515" textAnchor="middle" fill="#047857" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">30B Tonnes Carbon Sunk</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 2. GRAND INGA CLEAN HYDROPOWER & PEAC REGIONAL POWER POOL                 */}
      {/* ========================================================================= */}
      {showEnergy && (
        <g className="grand-inga-energy-layer">
          {/* PEAC High-Voltage Clean Transmission Lines */}
          <path
            d="M 488 536 L 450 442"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.8"
            strokeDasharray="7 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <path
            d="M 488 536 L 615 595"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeDasharray="8 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Grand Inga Hydro Megaproject Node */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Grand Inga Clean Hydropower Megaproject",
              category: "Continental Clean Energy Engine",
              description: "World's largest potential hydropower site on the Congo River rapids, capable of generating 40,000 MW of renewable power for Africa.",
              metric: "40,000 MW Potential • Continental Clean Power Grid",
              countryCode: "COD"
            })}
          >
            <circle cx="488" cy="536" r="16" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.85" className="animate-radar-pulse" />
            <circle cx="488" cy="536" r="6" fill="#0369a1" stroke="#ffffff" strokeWidth="2" />
            <rect x="415" y="548" width="144" height="23" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#0369a1" strokeWidth="1" />
            <text x="487" y="559" textAnchor="middle" fill="#075985" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">Grand Inga Hydropower</text>
            <text x="487" y="568" textAnchor="middle" fill="#0369a1" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">40,000 MW Potential Capacity</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 3. CRITICAL MINERALS (LITHIUM, COBALT) & LOBITO STRATEGIC CORRIDOR       */}
      {/* ========================================================================= */}
      {showTech && (
        <g className="minerals-tech-layer">
          {/* Lobito Atlantic Rail Corridor: Kolwezi/Katanga -> Lobito Port */}
          <path
            d="M 615 595 L 530 605 L 472 608"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.2"
            strokeDasharray="8 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <text x="545" y="622" textAnchor="middle" fill="#047857" fontSize="8.5" fontWeight="800" fontFamily="sans-serif">
            LOBITO ATLANTIC RAIL CORRIDOR
          </text>

          {/* Katanga Copperbelt Mining & Clean-Tech Battery Hub */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Katanga Copper & Cobalt Strategic Basin",
              category: "Global Energy Transition Core",
              description: "Supplying over 70% of the world's cobalt, massive copper reserves, and battery-grade lithium powering the global EV transition.",
              metric: "70% World Cobalt • Critical Battery Minerals",
              countryCode: "COD"
            })}
          >
            <circle cx="615" cy="595" r="16" fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="615" cy="595" r="6" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />
            <rect x="545" y="568" width="140" height="23" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#7c3aed" strokeWidth="1" />
            <text x="615" y="579" textAnchor="middle" fill="#5b21b6" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">Katanga Battery Basin</text>
            <text x="615" y="588" textAnchor="middle" fill="#6d28d9" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">70% Global Cobalt • EV Transition</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 4. HISTORIC WEST-CENTRAL EMBARKATION ARTERIES                             */}
      {/* ========================================================================= */}
      {showHistory && (
        <g className="history-central-layer">
          {/* Loango & Luanda Historical Atlantic Conduits */}
          <path
            d="M 468 575 C 410 610 330 645 220 680"
            fill="none"
            stroke="#b85c38"
            strokeWidth="3.5"
            strokeDasharray="9 4"
            strokeLinecap="round"
            className="animate-dash-slow"
          />
          <text x="360" y="640" textAnchor="middle" fill="#9a3412" fontSize="9" fontWeight="800" fontFamily="sans-serif">
            Historic South Atlantic Route (Luanda & Benguela)
          </text>
        </g>
      )}
    </g>
  );
};
