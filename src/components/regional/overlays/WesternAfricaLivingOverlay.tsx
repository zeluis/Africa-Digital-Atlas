import React from 'react';

export interface RegionalOverlayProps {
  themeFilter: 'all' | 'tech' | 'energy' | 'climate' | 'history';
  onSelectHub?: (hub: { title: string; category: string; description: string; metric: string; countryCode?: string }) => void;
}

export const WesternAfricaLivingOverlay: React.FC<RegionalOverlayProps> = ({
  themeFilter,
  onSelectHub,
}) => {
  const showHistory = themeFilter === 'all' || themeFilter === 'history';
  const showTech = themeFilter === 'all' || themeFilter === 'tech';
  const showEnergy = themeFilter === 'all' || themeFilter === 'energy';
  const showClimate = themeFilter === 'all' || themeFilter === 'climate';

  return (
    <g className="western-africa-overlay pointer-events-auto">
      {/* ========================================================================= */}
      {/* 1. TAST HISTORICAL EMBARKATION CONDUITS & ATLANTIC CONFLUENCE             */}
      {/* ========================================================================= */}
      {showHistory && (
        <g className="tast-history-layer">
          {/* Western Africa Coastal Base Translucent Underglow */}
          <path
            d="M 1000,2420 C 1400,2900 1700,3200 1350,3350 L 750,3550 C 1500,3800 2200,3500 2520,2720 Z"
            fill="#b85c38"
            opacity="0.14"
          />

          {/* Senegambia to Cabo Verde & Outward Stream */}
          <path
            d="M 720,1920 C 580,1880 440,1850 315,1820"
            fill="none"
            stroke="#d48b50"
            strokeWidth="24"
            strokeDasharray="45,25"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <path
            d="M 315,1820 C 100,1800 -200,1750 -600,1650"
            fill="none"
            stroke="#c4895c"
            strokeWidth="22"
            strokeDasharray="45,30"
            opacity="0.85"
            className="animate-dash-med"
          />

          {/* Sierra Leone -> Gulf of Guinea Confluence */}
          <path
            d="M 1000,2420 C 1100,2700 1250,3000 1350,3350"
            fill="none"
            stroke="#b85c38"
            strokeWidth="28"
            strokeDasharray="50,28"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Elmina & Cape Coast (Ghana) -> Confluence */}
          <path
            d="M 1850,2690 C 1700,2900 1500,3150 1350,3350"
            fill="none"
            stroke="#9e4c56"
            strokeWidth="34"
            strokeDasharray="55,28"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Ouidah (Benin) -> Confluence */}
          <path
            d="M 2110,2580 C 1900,2850 1600,3150 1350,3350"
            fill="none"
            stroke="#b85c38"
            strokeWidth="32"
            strokeDasharray="55,28"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Bight of Biafra (Bonny & Calabar) -> Confluence */}
          <path
            d="M 2520,2720 C 2150,2950 1750,3200 1350,3350"
            fill="none"
            stroke="#b87446"
            strokeWidth="36"
            strokeDasharray="52,28"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Transatlantic Outward Trunk */}
          <path
            d="M 1350,3350 L 750,3550 C 350,3800 -150,4100 -700,4400"
            fill="none"
            stroke="#c45d3e"
            strokeWidth="46"
            strokeDasharray="65,35"
            strokeLinecap="round"
            className="animate-dash-slow"
          />

          {/* Historic Embarkation Nodes */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Gorée Island & Senegambia",
              category: "Historical Embarkation Point",
              description: "Major archival Atlantic embarkation point and UNESCO memorial sanctuary on Dakar coast.",
              metric: "Maison des Esclaves • 18th Century Portal",
              countryCode: "SEN"
            })}
          >
            <circle cx="720" cy="1920" r="100" fill="none" stroke="#b87446" strokeWidth="12" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="720" cy="1920" r="46" fill="#b87446" stroke="#ffffff" strokeWidth="12" />
            <text x="790" y="1900" fill="#1c1917" fontSize="82" fontWeight="800" fontFamily="sans-serif">Gorée (Dakar)</text>
          </g>

          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Cabo Verde Atlantic Outpost",
              category: "Historical Maritime Hub",
              description: "Archipelago waypoint in early transatlantic navigation and transatlantic diaspora convergence.",
              metric: "Praia / Cidade Velha • Historic Maritime Confluence",
              countryCode: "CPV"
            })}
          >
            <circle cx="315" cy="1820" r="90" fill="none" stroke="#c4895c" strokeWidth="11" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="315" cy="1820" r="42" fill="#c4895c" stroke="#ffffff" strokeWidth="11" />
            <text x="380" y="1800" fill="#1c1917" fontSize="80" fontWeight="800" fontFamily="sans-serif">Cabo Verde</text>
          </g>

          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Elmina & Cape Coast Castles",
              category: "Gold Coast Historic Fortresses",
              description: "Centuries-old coastal stone strongholds situated along the Ghanaian Gulf of Guinea.",
              metric: "Elmina Castle (1482) • UNESCO World Heritage",
              countryCode: "GHA"
            })}
          >
            <circle cx="1850" cy="2690" r="46" fill="#9e4c56" stroke="#ffffff" strokeWidth="11" />
            <text x="1460" y="2800" fill="#1c1917" fontSize="76" fontWeight="800" fontFamily="sans-serif">Elmina (Gold Coast)</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 2. CREATIVE TECH, FINTECH & DIASPORA COUNTER-STREAM                        */}
      {/* ========================================================================= */}
      {showTech && (
        <g className="tech-innovation-layer">
          {/* Radiant Diaspora Return Stream (Reversing the Atlantic Flow with Vibrant Emerald & Gold) */}
          <path
            d="M -500,3200 C 500,3300 1500,3000 2250,2600"
            fill="none"
            stroke="#10b981"
            strokeWidth="30"
            strokeDasharray="60,30"
            strokeLinecap="round"
            className="animate-dash-reverse"
          />

          {/* West African Tech Triangle: Lagos <-> Accra <-> Dakar */}
          <path
            d="M 2250,2600 L 1850,2690 L 720,1920 Z"
            fill="none"
            stroke="#059669"
            strokeWidth="38"
            strokeDasharray="65,30"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          {/* Inner Glowing Core */}
          <path
            d="M 2250,2600 L 1850,2690 L 720,1920 Z"
            fill="none"
            stroke="#fef08a"
            strokeWidth="16"
            strokeDasharray="30,65"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Yaba FinTech Megahub (Lagos) */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Yaba FinTech Capital (Lagos)",
              category: "Technology & Venture Ecosystem",
              description: "Africa's highest-valued fintech ecosystem home to Flutterwave, Paystack, and hundreds of high-growth tech ventures.",
              metric: "$2.5B+ Venture Funding • 400+ Active Startups",
              countryCode: "NGA"
            })}
          >
            <circle cx="2250" cy="2600" r="120" fill="none" stroke="#10b981" strokeWidth="14" opacity="0.85" className="animate-radar-pulse" />
            <circle cx="2250" cy="2600" r="54" fill="#059669" stroke="#ffffff" strokeWidth="15" />
            <text x="2330" y="2610" fill="#065f46" fontSize="96" fontWeight="900" fontFamily="sans-serif">Lagos FinTech Capital</text>
            <text x="2330" y="2710" fill="#047857" fontSize="64" fontWeight="700" fontFamily="sans-serif">Yaba • $2.5B Ecosystem</text>
          </g>

          {/* Accra Tech Cluster */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Accra Digital Innovation Cluster",
              category: "Creative Tech & AI",
              description: "Host of Google Africa AI Research Center, MEST incubator, and thriving creative technology hub.",
              metric: "Google AI Center • MEST Africa Tech Hub",
              countryCode: "GHA"
            })}
          >
            <circle cx="1850" cy="2690" r="95" fill="none" stroke="#3b82f6" strokeWidth="11" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="1850" cy="2690" r="44" fill="#2563eb" stroke="#ffffff" strokeWidth="12" />
            <text x="1870" y="2640" fill="#1e40af" fontSize="76" fontWeight="800" fontFamily="sans-serif">Accra Tech & AI</text>
          </g>

          {/* Dakar Digital City */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Dakar Digital City (Diamniadio)",
              category: "Francophone Tech Pioneer",
              description: "Senegal's high-tech digital park, national data center, and Wave mobile money epicenter.",
              metric: "Diamniadio Tech Park • 10,000+ Engineers",
              countryCode: "SEN"
            })}
          >
            <circle cx="720" cy="1920" r="95" fill="none" stroke="#10b981" strokeWidth="11" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="720" cy="1920" r="44" fill="#10b981" stroke="#ffffff" strokeWidth="12" />
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 3. WAPP REGIONAL POWER POOL & RENEWABLE GRID                               */}
      {/* ========================================================================= */}
      {showEnergy && (
        <g className="energy-infrastructure-layer">
          {/* West African Power Pool (WAPP) Interconnector Artery: Dakar -> Bamako -> Ouaga -> Niamey -> Abuja -> Lagos -> Abidjan */}
          <path
            d="M 720,1920 L 1450,1950 L 1700,2050 L 2050,2050 L 2500,2300 L 2250,2600 L 1600,2620 Z"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="32"
            strokeDasharray="55,30"
            strokeLinecap="round"
            className="animate-dash-med"
          />

          {/* Subsea 2Africa / Equiano Optical Cable along the Coast */}
          <path
            d="M 315,1820 C 500,2200 900,2650 1600,2750 C 1850,2780 2250,2750 2550,2850"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="24"
            strokeDasharray="40,25"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Abidjan Energy & Infrastructure Node */}
          <g 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectHub?.({
              title: "Abidjan Energy & Port Gateway",
              category: "Energy & Infrastructure Hub",
              description: "Major hydroelectric and offshore gas power producer supplying electricity across the WAPP network.",
              metric: "2,200 MW Installed Capacity • WAPP Backbone",
              countryCode: "CIV"
            })}
          >
            <circle cx="1600" cy="2620" r="44" fill="#f59e0b" stroke="#ffffff" strokeWidth="11" />
            <text x="1350" y="2600" fill="#b45309" fontSize="76" fontWeight="800" fontFamily="sans-serif">Abidjan WAPP Grid</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 4. GREAT GREEN WALL & SAHELIAN BIOSPHERE RESTORATION                      */}
      {/* ========================================================================= */}
      {showClimate && (
        <g className="climate-biosphere-layer">
          {/* Great Green Wall Trans-Sahelian Belt: Senegal through Mali, Burkina, Niger, Nigeria */}
          <path
            d="M 720,1800 C 1200,1850 1700,1950 2500,1950"
            fill="none"
            stroke="#22c55e"
            strokeWidth="48"
            strokeDasharray="70,40"
            strokeLinecap="round"
            opacity="0.85"
            className="animate-dash-slow"
          />
          <text x="1200" y="1800" fill="#15803d" fontSize="88" fontWeight="800" fontFamily="sans-serif" letterSpacing="4">
            GREAT GREEN WALL BIOSPHERE
          </text>
        </g>
      )}
    </g>
  );
};
