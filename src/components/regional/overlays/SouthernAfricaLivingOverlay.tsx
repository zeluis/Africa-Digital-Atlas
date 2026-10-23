import React from 'react';
import { RegionalOverlayProps } from './WesternAfricaLivingOverlay';

export const SouthernAfricaLivingOverlay: React.FC<RegionalOverlayProps> = ({
  themeFilter,
  onSelectHub,
}) => {
  const showTech = themeFilter === 'all' || themeFilter === 'tech';
  const showEnergy = themeFilter === 'all' || themeFilter === 'energy';
  const showClimate = themeFilter === 'all' || themeFilter === 'climate';
  const showHistory = themeFilter === 'all' || themeFilter === 'history';

  return (
    <g className="southern-africa-overlay pointer-events-auto">
      {/* ========================================================================= */}
      {/* 1. SQUARE KILOMETRE ARRAY (SKA) & DEEP SPACE SCIENCE                      */}
      {/* ========================================================================= */}
      {showTech && (
        <g className="ska-astronomy-layer">
          {/* Deep Space Cosmic Telemetry Waves in the Karoo */}
          <path
            d="M 525 860 A 45 45 0 0 1 605 860"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="animate-dash-fast"
          />
          <path
            d="M 515 848 A 60 60 0 0 1 615 848"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeDasharray="7 5"
            className="animate-dash-fast"
          />

          {/* Supercomputing Backbone: SKA Karoo <-> Cape Town <-> Johannesburg */}
          <path
            d="M 565 880 L 525 955 L 622 768 Z"
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeDasharray="8 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* SKA Karoo Deep Space Observatory Node */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Square Kilometre Array (SKA) Astronomy",
              category: "Global Megascience Project",
              description: "World's largest radio telescope co-hosted in the pristine Karoo desert, processing exabytes of cosmic radio signals.",
              metric: "MeerKAT • World's Largest Radio Telescope Grid",
              countryCode: "ZAF"
            })}
          >
            <circle cx="565" cy="880" r="18" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.85" className="animate-radar-pulse" />
            <circle cx="565" cy="880" r="6.5" fill="#6d28d9" stroke="#ffffff" strokeWidth="2" />
            <rect x="495" y="896" width="140" height="24" rx="5" fill="#ffffff" fillOpacity="0.92" stroke="#6d28d9" strokeWidth="1" />
            <text x="565" y="908" textAnchor="middle" fill="#4c1d95" fontSize="10" fontWeight="900" fontFamily="sans-serif">SKA Karoo Astronomy</text>
            <text x="565" y="917" textAnchor="middle" fill="#6d28d9" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">World's Largest Radio Telescope</text>
          </g>

          {/* Silicon Cape Innovation & University Cluster */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Silicon Cape & Universities Hub",
              category: "Higher Education & Venture Ecosystem",
              description: "South Africa's premier technology startup hub, home to University of Cape Town (UCT), Stellenbosch, and national supercomputing cluster.",
              metric: "UCT #1 Africa • 450+ Tech Startups",
              countryCode: "ZAF"
            })}
          >
            <circle cx="525" cy="955" r="16" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="525" cy="955" r="5.5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.8" />
            <rect x="455" y="968" width="140" height="15" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#1d4ed8" strokeWidth="1" />
            <text x="525" y="979" textAnchor="middle" fill="#1e40af" fontSize="9" fontWeight="800" fontFamily="sans-serif">Silicon Cape & UCT</text>
          </g>

          {/* Johannesburg Financial & Supercomputing Hub */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Johannesburg Financial & Quantum Hub",
              category: "Continental Financial Core",
              description: "JSE (Africa's largest stock exchange), CSIR Centre for High Performance Computing, and IBM Quantum Lab.",
              metric: "$1.1T Market Cap JSE • Quantum Lab",
              countryCode: "ZAF"
            })}
          >
            <circle cx="622" cy="768" r="16" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="622" cy="768" r="5.5" fill="#d97706" stroke="#ffffff" strokeWidth="1.8" />
            <rect x="635" y="756" width="130" height="24" rx="5" fill="#ffffff" fillOpacity="0.92" stroke="#d97706" strokeWidth="1" />
            <text x="700" y="768" textAnchor="middle" fill="#92400e" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">Johannesburg FinTech</text>
            <text x="700" y="777" textAnchor="middle" fill="#b45309" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">JSE • $1.1T Market Cap</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 2. GREEN HYDROGEN & SOUTHERN AFRICAN POWER POOL (SAPP)                    */}
      {/* ========================================================================= */}
      {showEnergy && (
        <g className="energy-sapp-layer">
          {/* SAPP Transmission Backbone: Kariba Hydro -> Gaborone -> Johannesburg */}
          <path
            d="M 620 650 L 601 748 L 622 768"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3"
            strokeDasharray="7 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Namibia Green Hydrogen Valley (Lüderitz) */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Namibia Green Hydrogen Megaproject (Lüderitz)",
              category: "Clean Hydrogen & Ammonia Export",
              description: "Hyphen Hydrogen $10B project tapping world-class coastal wind and solar to export 300,000 tonnes of green hydrogen annually.",
              metric: "$10B Investment • Zero-Carbon Hydrogen",
              countryCode: "NAM"
            })}
          >
            <circle cx="478" cy="755" r="18" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.85" className="animate-radar-pulse" />
            <circle cx="478" cy="755" r="6" fill="#059669" stroke="#ffffff" strokeWidth="2" />
            <rect x="420" y="770" width="130" height="24" rx="5" fill="#ffffff" fillOpacity="0.92" stroke="#059669" strokeWidth="1" />
            <text x="485" y="781" textAnchor="middle" fill="#065f46" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">Namibia Green Hydrogen</text>
            <text x="485" y="791" textAnchor="middle" fill="#047857" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Lüderitz • $10B Clean Energy</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 3. CAPE MARITIME CONVERGENCE & HISTORIC OCEANIC ROUTE                     */}
      {/* ========================================================================= */}
      {showHistory && (
        <g className="history-cape-layer">
          {/* Rounding the Cape of Good Hope Arterial */}
          <path
            d="M 460 930 Q 515 1010 640 960 T 730 890"
            fill="none"
            stroke="#b85c38"
            strokeWidth="3.5"
            strokeDasharray="9 4"
            strokeLinecap="round"
            className="animate-dash-slow"
          />
          <text x="580" y="1030" textAnchor="middle" fill="#9a3412" fontSize="10" fontWeight="900" fontFamily="sans-serif">
            Historic Cape of Good Hope Maritime Highway
          </text>
        </g>
      )}
    </g>
  );
};
