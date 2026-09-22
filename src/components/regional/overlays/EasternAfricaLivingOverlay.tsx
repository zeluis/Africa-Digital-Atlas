import React from 'react';
import { RegionalOverlayProps } from './WesternAfricaLivingOverlay';

export const EasternAfricaLivingOverlay: React.FC<RegionalOverlayProps> = ({
  themeFilter,
  onSelectHub,
}) => {
  const showTech = themeFilter === 'all' || themeFilter === 'tech';
  const showEnergy = themeFilter === 'all' || themeFilter === 'energy';
  const showClimate = themeFilter === 'all' || themeFilter === 'climate';
  const showHistory = themeFilter === 'all' || themeFilter === 'history';

  return (
    <g className="eastern-africa-overlay pointer-events-auto">
      {/* ========================================================================= */}
      {/* 1. SILICON SAVANNAH & KIGALI 4IR INNOVATION MESH                          */}
      {/* ========================================================================= */}
      {showTech && (
        <g className="silicon-savannah-layer">
          {/* High-Speed Optical Mesh: Nairobi <-> Kigali <-> Kampala <-> Addis Ababa */}
          <path
            d="M 4540,3250 L 4080,3260 L 4120,3100 L 4700,2350 Z"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="36"
            strokeDasharray="60,30"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <path
            d="M 4540,3250 L 4080,3260 L 4120,3100 L 4700,2350 Z"
            fill="none"
            stroke="#c084fc"
            strokeWidth="14"
            strokeDasharray="25,60"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Nairobi (Silicon Savannah) Megahub */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Nairobi Silicon Savannah",
              category: "FinTech & Innovation Capital",
              description: "Birthplace of M-Pesa mobile money revolution, hosting Microsoft Africa Development Centre, Google Product Dev Centre, and 500+ tech enterprises.",
              metric: "M-Pesa Pioneer • $1.5B+ Venture Flow",
              countryCode: "KEN"
            })}
          >
            <circle cx="4540" cy="3250" r="130" fill="none" stroke="#f97316" strokeWidth="15" opacity="0.85" className="animate-radar-pulse" />
            <circle cx="4540" cy="3250" r="54" fill="#ea580c" stroke="#ffffff" strokeWidth="15" />
            <text x="4630" y="3230" fill="#9a3412" fontSize="96" fontWeight="900" fontFamily="sans-serif">Nairobi Silicon Savannah</text>
            <text x="4630" y="3330" fill="#c2410c" fontSize="64" fontWeight="700" fontFamily="sans-serif">M-Pesa • Global Tech Hub</text>
          </g>

          {/* Kigali Green City & Norrsken Tech Hub */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Kigali 4IR & Norrsken Hub",
              category: "4IR Robotics & Venture Hub",
              description: "Center for the Fourth Industrial Revolution (WEF), Carnegie Mellon Africa, Zipline drone logistics, and Norrsken East Africa.",
              metric: "Zipline Drone Logistics • Kigali Innovation City",
              countryCode: "RWA"
            })}
          >
            <circle cx="4080" cy="3260" r="95" fill="none" stroke="#10b981" strokeWidth="12" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="4080" cy="3260" r="44" fill="#059669" stroke="#ffffff" strokeWidth="12" />
            <text x="3520" y="3230" fill="#065f46" fontSize="82" fontWeight="900" fontFamily="sans-serif">Kigali 4IR Hub</text>
          </g>

          {/* Addis Ababa Aerospace & Aviation Hub */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Addis Ababa Continental Gateway",
              category: "Aviation & Science Gateway",
              description: "African Union headquarters, Ethiopian Airlines cargo & passenger hub, and national space observatory.",
              metric: "African Union HQ • Entoto Space Observatory",
              countryCode: "ETH"
            })}
          >
            <circle cx="4700" cy="2350" r="105" fill="none" stroke="#3b82f6" strokeWidth="13" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="4700" cy="2350" r="48" fill="#2563eb" stroke="#ffffff" strokeWidth="13" />
            <text x="4790" y="2350" fill="#1e40af" fontSize="90" fontWeight="900" fontFamily="sans-serif">Addis Ababa AU Gateway</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 2. GREAT RIFT VALLEY GEOTHERMAL & CLEAN POWER POOL (EAPP)                 */}
      {/* ========================================================================= */}
      {showEnergy && (
        <g className="geothermal-energy-layer">
          {/* Great Rift Valley Geothermal & Wind Artery: Olkaria -> Lake Turkana */}
          <path
            d="M 4450,3200 L 4500,2800"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="36"
            strokeDasharray="50,25"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Olkaria Geothermal Megaplex */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Olkaria Geothermal Megaplex",
              category: "Subterranean Clean Energy",
              description: "Harnessing the immense volcanic heat of the Great Rift Valley, generating 800+ MW of zero-carbon base-load power for the East African Power Pool.",
              metric: "860 MW Geothermal • 90% Renewable Grid",
              countryCode: "KEN"
            })}
          >
            <circle cx="4450" cy="3200" r="110" fill="none" stroke="#f59e0b" strokeWidth="13" opacity="0.85" className="animate-radar-pulse" />
            <circle cx="4450" cy="3200" r="46" fill="#d97706" stroke="#ffffff" strokeWidth="13" />
            <text x="4150" y="3420" fill="#b45309" fontSize="80" fontWeight="800" fontFamily="sans-serif">Olkaria Geothermal</text>
          </g>

          {/* Lake Turkana Wind Park */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Lake Turkana Wind Power Project",
              category: "Continental Wind Power",
              description: "Africa's largest wind farm with 365 turbines capturing the relentless Turkana corridor winds.",
              metric: "310 MW Wind Power • 365 Turbines",
              countryCode: "KEN"
            })}
          >
            <circle cx="4500" cy="2800" r="46" fill="#06b6d4" stroke="#ffffff" strokeWidth="13" />
            <text x="4580" y="2800" fill="#0e7490" fontSize="76" fontWeight="800" fontFamily="sans-serif">Lake Turkana Wind</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 3. INDIAN OCEAN BLUE ECONOMY & 2AFRICA SUBMARINE RING                     */}
      {/* ========================================================================= */}
      {(showClimate || showTech) && (
        <g className="blue-economy-layer">
          {/* Swahili Coast Maritime Fiber & Trade Spine */}
          <path
            d="M 4700,2350 L 4950,2600 L 4650,3450 L 4680,3750 L 4760,4250"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="30"
            strokeDasharray="50,25"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Victoria (Seychelles) Blue Economy Anchor */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Seychelles Blue Economy Hub",
              category: "Marine Conservation & Blue Finance",
              description: "Global pioneer in sovereign Blue Bonds, marine spatial planning, and oceanic biodiversity conservation.",
              metric: "First Sovereign Blue Bond • 30% Marine Protected",
              countryCode: "SYC"
            })}
          >
            <circle cx="5750" cy="3800" r="80" fill="none" stroke="#0ea5e9" strokeWidth="11" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="5750" cy="3800" r="38" fill="#0284c7" stroke="#ffffff" strokeWidth="10" />
            <text x="5420" y="3740" fill="#0369a1" fontSize="74" fontWeight="800" fontFamily="sans-serif">Seychelles Blue Economy</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 4. HISTORIC SWAHILI COAST & MOZAMBIQUE CHANNEL EMBARKATION                */}
      {/* ========================================================================= */}
      {showHistory && (
        <g className="history-eastern-layer">
          {/* Swahili Coast & Mozambique Outward Conduits */}
          <path
            d="M 4760,4250 C 5100,4500 5400,4700 5900,4800"
            fill="none"
            stroke="#b85c38"
            strokeWidth="32"
            strokeDasharray="55,28"
            strokeLinecap="round"
            className="animate-dash-slow"
          />
          <path
            d="M 5255,4622 C 5500,4750 5800,4850 6200,4900"
            fill="none"
            stroke="#b85c38"
            strokeWidth="30"
            strokeDasharray="50,28"
            strokeLinecap="round"
            className="animate-dash-slow"
          />
          <text x="4900" y="4450" fill="#9a3412" fontSize="76" fontWeight="800" fontFamily="sans-serif">
            Historic Mozambique & Indian Ocean Route
          </text>
        </g>
      )}
    </g>
  );
};
