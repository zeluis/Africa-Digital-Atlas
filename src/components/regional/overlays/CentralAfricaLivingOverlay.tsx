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
            cx="3400"
            cy="2950"
            rx="520"
            ry="400"
            fill="#10b981"
            opacity="0.18"
            className="animate-pulse-slow"
          />
          <ellipse
            cx="3400"
            cy="2950"
            rx="320"
            ry="250"
            fill="#059669"
            opacity="0.25"
          />

          {/* Congo River Hydrographic Loop */}
          <path
            d="M 3850,3800 C 3700,3200 3750,2600 3400,2650 C 3050,2700 3100,3200 2900,3450"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="32"
            strokeDasharray="60,30"
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
            <circle cx="3400" cy="2950" r="140" fill="none" stroke="#10b981" strokeWidth="15" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="3400" cy="2950" r="50" fill="#059669" stroke="#ffffff" strokeWidth="14" />
            <text x="3100" y="3250" fill="#065f46" fontSize="96" fontWeight="900" fontFamily="sans-serif">Congo Basin Biosphere</text>
            <text x="3100" y="3350" fill="#047857" fontSize="64" fontWeight="700" fontFamily="sans-serif">30 Billion Tonnes Carbon Sunk</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 2. GRAND INGA CLEAN HYDROPOWER & PEAC REGIONAL POWER POOL                 */}
      {/* ========================================================================= */}
      {showEnergy && (
        <g className="grand-inga-energy-layer">
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
            <circle cx="2900" cy="3450" r="130" fill="none" stroke="#0284c7" strokeWidth="14" opacity="0.85" className="animate-radar-pulse" />
            <circle cx="2900" cy="3450" r="50" fill="#0369a1" stroke="#ffffff" strokeWidth="14" />
            <text x="2200" y="3580" fill="#075985" fontSize="90" fontWeight="900" fontFamily="sans-serif">Grand Inga Hydropower</text>
            <text x="2200" y="3670" fill="#0369a1" fontSize="60" fontWeight="700" fontFamily="sans-serif">40,000 MW Potential Capacity</text>
          </g>

          {/* PEAC High-Voltage Clean Transmission Lines radiating North to Douala and Southeast to Katanga */}
          <path
            d="M 2900,3450 L 2700,2650"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="32"
            strokeDasharray="50,25"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <path
            d="M 2900,3450 L 3850,4200"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="36"
            strokeDasharray="55,25"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
        </g>
      )}

      {/* ========================================================================= */}
      {/* 3. CRITICAL MINERALS (LITHIUM, COBALT) & LOBITO STRATEGIC CORRIDOR       */}
      {/* ========================================================================= */}
      {showTech && (
        <g className="minerals-tech-layer">
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
            <circle cx="3850" cy="4200" r="120" fill="none" stroke="#8b5cf6" strokeWidth="14" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="3850" cy="4200" r="48" fill="#7c3aed" stroke="#ffffff" strokeWidth="13" />
            <text x="3950" y="4200" fill="#5b21b6" fontSize="90" fontWeight="900" fontFamily="sans-serif">Katanga Battery Basin</text>
            <text x="3950" y="4290" fill="#6d28d9" fontSize="60" fontWeight="700" fontFamily="sans-serif">70% Global Cobalt • EV Transition",</text>
          </g>

          {/* Lobito Atlantic Rail Corridor: Kolwezi/Katanga -> Lobito Port */}
          <path
            d="M 3850,4200 L 2860,4040 L 2500,4100"
            fill="none"
            stroke="#10b981"
            strokeWidth="34"
            strokeDasharray="55,25"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <text x="2900" y="4150" fill="#047857" fontSize="76" fontWeight="800" fontFamily="sans-serif">
            LOBITO ATLANTIC RAIL CORRIDOR
          </text>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 4. HISTORIC WEST-CENTRAL EMBARKATION ARTERIES                             */}
      {/* ========================================================================= */}
      {showHistory && (
        <g className="history-central-layer">
          {/* Loango & Luanda Historical Atlantic Conduits */}
          <path
            d="M 2850,3700 C 2300,3900 1700,4300 800,4600"
            fill="none"
            stroke="#b85c38"
            strokeWidth="36"
            strokeDasharray="60,30"
            strokeLinecap="round"
            className="animate-dash-slow"
          />
          <text x="1800" y="4150" fill="#9a3412" fontSize="80" fontWeight="800" fontFamily="sans-serif">
            Historic South Atlantic Route (Luanda & Benguela)
          </text>
        </g>
      )}
    </g>
  );
};
