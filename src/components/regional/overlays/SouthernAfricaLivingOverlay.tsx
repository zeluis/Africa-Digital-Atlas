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
            {/* Deep Space Cosmic Telemetry Waves */}
            <path
              d="M 3200,5200 A 300,300 0 0,1 3700,5200"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="16"
              strokeDasharray="30,20"
              className="animate-dash-fast"
            />
            <path
              d="M 3100,5100 A 450,450 0 0,1 3800,5100"
              fill="none"
              stroke="#a855f7"
              strokeWidth="14"
              strokeDasharray="35,25"
              className="animate-dash-fast"
            />
            <path
              d="M 3000,5000 A 600,600 0 0,1 3900,5000"
              fill="none"
              stroke="#c084fc"
              strokeWidth="12"
              strokeDasharray="40,30"
              className="animate-dash-fast"
            />
            <circle cx="3450" cy="5300" r="120" fill="none" stroke="#7c3aed" strokeWidth="15" opacity="0.85" className="animate-radar-pulse" />
            <circle cx="3450" cy="5300" r="54" fill="#6d28d9" stroke="#ffffff" strokeWidth="15" />
            <text x="2850" y="5420" fill="#4c1d95" fontSize="94" fontWeight="900" fontFamily="sans-serif">SKA Karoo Astronomy</text>
            <text x="2850" y="5510" fill="#5b21b6" fontSize="62" fontWeight="700" fontFamily="sans-serif">World's Largest Radio Telescope</text>
          </g>

          {/* Supercomputing Backbone: SKA Karoo <-> Cape Town <-> Johannesburg */}
          <path
            d="M 3450,5300 L 3200,5750 L 3920,5080 Z"
            fill="none"
            stroke="#6366f1"
            strokeWidth="32"
            strokeDasharray="55,25"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

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
            <circle cx="3200" cy="5750" r="95" fill="none" stroke="#2563eb" strokeWidth="12" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="3200" cy="5750" r="46" fill="#1d4ed8" stroke="#ffffff" strokeWidth="12" />
            <text x="3300" y="5750" fill="#1e40af" fontSize="84" fontWeight="800" fontFamily="sans-serif">Silicon Cape & UCT</text>
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
            <circle cx="3920" cy="5080" r="95" fill="none" stroke="#f59e0b" strokeWidth="12" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="3920" cy="5080" r="46" fill="#d97706" stroke="#ffffff" strokeWidth="12" />
            <text x="4010" y="5080" fill="#b45309" fontSize="84" fontWeight="800" fontFamily="sans-serif">Johannesburg FinTech</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 2. GREEN HYDROGEN & SOUTHERN AFRICAN POWER POOL (SAPP)                    */}
      {/* ========================================================================= */}
      {showEnergy && (
        <g className="energy-sapp-layer">
          {/* SAPP Transmission Backbone: Kariba Hydro -> Cahora Bassa -> Johannesburg */}
          <path
            d="M 3950,4450 L 4300,4400 L 3920,5080"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="34"
            strokeDasharray="50,25"
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
            <circle cx="3000" cy="4900" r="110" fill="none" stroke="#10b981" strokeWidth="14" opacity="0.85" className="animate-radar-pulse" />
            <circle cx="3000" cy="4900" r="48" fill="#059669" stroke="#ffffff" strokeWidth="13" />
            <text x="2450" y="4820" fill="#065f46" fontSize="86" fontWeight="900" fontFamily="sans-serif">Namibia Green Hydrogen</text>
            <text x="2450" y="4900" fill="#047857" fontSize="58" fontWeight="700" fontFamily="sans-serif">Lüderitz • $10B Clean Energy</text>
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
            d="M 2700,5600 C 2900,5900 3300,5950 3700,5700 C 4100,5450 4400,5200 4600,4900"
            fill="none"
            stroke="#b85c38"
            strokeWidth="36"
            strokeDasharray="65,30"
            strokeLinecap="round"
            className="animate-dash-slow"
          />
          <text x="2900" y="6050" fill="#9a3412" fontSize="80" fontWeight="900" fontFamily="sans-serif">
            Historic Cape of Good Hope Maritime Highway
          </text>
        </g>
      )}
    </g>
  );
};
