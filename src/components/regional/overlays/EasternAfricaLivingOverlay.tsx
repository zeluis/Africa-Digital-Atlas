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
            d="M 716 495 L 644 502 L 671 478 L 736 387 Z"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeDasharray="8 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <path
            d="M 716 495 L 644 502 L 671 478 L 736 387 Z"
            fill="none"
            stroke="#c084fc"
            strokeWidth="1.5"
            strokeDasharray="4 8"
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
            <circle cx="716" cy="495" r="18" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.85" className="animate-radar-pulse" />
            <circle cx="716" cy="495" r="6" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
            <rect x="710" y="470" width="134" height="23" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#ea580c" strokeWidth="1" />
            <text x="777" y="481" textAnchor="middle" fill="#9a3412" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">Nairobi Silicon Savannah</text>
            <text x="777" y="490" textAnchor="middle" fill="#c2410c" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">M-Pesa • $1.5B+ Tech Hub</text>
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
            <circle cx="644" cy="502" r="15" fill="none" stroke="#10b981" strokeWidth="1.8" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="644" cy="502" r="5.5" fill="#059669" stroke="#ffffff" strokeWidth="1.8" />
            <rect x="568" y="512" width="105" height="17" rx="3.5" fill="#ffffff" fillOpacity="0.92" stroke="#059669" strokeWidth="1" />
            <text x="620" y="524" textAnchor="middle" fill="#065f46" fontSize="8.5" fontWeight="900" fontFamily="sans-serif">Kigali 4IR Hub</text>
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
            <circle cx="736" cy="387" r="16" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="736" cy="387" r="5.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.8" />
            <rect x="745" y="375" width="134" height="23" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#2563eb" strokeWidth="1" />
            <text x="812" y="386" textAnchor="middle" fill="#1e40af" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">Addis Ababa AU Gateway</text>
            <text x="812" y="395" textAnchor="middle" fill="#1d4ed8" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">African Union HQ • Aviation</text>
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
            d="M 710 495 L 720 440"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray="7 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Olkaria Geothermal Megaplex */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Olkaria Geothermal Megaplex",
              category: "Subterranean Clean Energy",
              description: "Harnessing the volcanic heat of the Great Rift Valley, generating 800+ MW of zero-carbon base-load power for the East African Power Pool.",
              metric: "860 MW Geothermal • 90% Renewable Grid",
              countryCode: "KEN"
            })}
          >
            <circle cx="710" cy="495" r="15" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.85" className="animate-radar-pulse" />
            <circle cx="710" cy="495" r="5.5" fill="#d97706" stroke="#ffffff" strokeWidth="1.8" />
            <rect x="635" y="475" width="115" height="17" rx="3.5" fill="#ffffff" fillOpacity="0.92" stroke="#d97706" strokeWidth="1" />
            <text x="692" y="487" textAnchor="middle" fill="#b45309" fontSize="8.5" fontWeight="800" fontFamily="sans-serif">Olkaria Geothermal</text>
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
            <circle cx="720" cy="440" r="5.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.8" />
            <rect x="730" y="432" width="112" height="17" rx="3.5" fill="#ffffff" fillOpacity="0.92" stroke="#06b6d4" strokeWidth="1" />
            <text x="786" y="444" textAnchor="middle" fill="#0e7490" fontSize="8.5" fontWeight="800" fontFamily="sans-serif">Lake Turkana Wind</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 3. INDIAN OCEAN BLUE ECONOMY & SEYCHELLES HUB                             */}
      {/* ========================================================================= */}
      {(showClimate || showTech) && (
        <g className="blue-economy-layer">
          {/* Swahili Coast Maritime Fiber & Trade Spine */}
          <path
            d="M 776 358 L 805 460 L 735 520 L 738 545 L 750 660"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2.8"
            strokeDasharray="7 4"
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
            <circle cx="911" cy="531" r="14" fill="none" stroke="#0ea5e9" strokeWidth="1.8" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="911" cy="531" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.8" />
            <rect x="830" y="542" width="130" height="23" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#0284c7" strokeWidth="1" />
            <text x="895" y="553" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="800" fontFamily="sans-serif">Seychelles Blue Economy</text>
            <text x="895" y="562" textAnchor="middle" fill="#0284c7" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">First Sovereign Blue Bond</text>
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
            d="M 750 660 C 800 680 870 700 930 710"
            fill="none"
            stroke="#b85c38"
            strokeWidth="3.2"
            strokeDasharray="8 4"
            strokeLinecap="round"
            className="animate-dash-slow"
          />
          <text x="830" y="680" textAnchor="middle" fill="#9a3412" fontSize="9" fontWeight="800" fontFamily="sans-serif">
            Historic Mozambique & Indian Ocean Route
          </text>
        </g>
      )}
    </g>
  );
};
