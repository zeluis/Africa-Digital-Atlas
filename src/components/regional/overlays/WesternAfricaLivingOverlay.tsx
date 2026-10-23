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
            d="M 147 326 C 200 400 280 435 386 416 L 430 435 C 320 465 200 440 100 360 Z"
            fill="#b85c38"
            opacity="0.12"
          />

          {/* Senegambia to Cabo Verde & Outward Stream */}
          <path
            d="M 147 326 C 115 320 95 315 79 313"
            fill="none"
            stroke="#d48b50"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Elmina & Cape Coast (Ghana) -> Atlantic Stream */}
          <path
            d="M 322 424 C 300 450 250 480 180 500"
            fill="none"
            stroke="#9e4c56"
            strokeWidth="3"
            strokeDasharray="7 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />

          {/* Ouidah & Lagos -> Atlantic Confluence */}
          <path
            d="M 386 416 C 360 455 300 485 220 515"
            fill="none"
            stroke="#b85c38"
            strokeWidth="3"
            strokeDasharray="7 4"
            strokeLinecap="round"
            className="animate-dash-fast"
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
            <circle cx="147" cy="326" r="15" fill="none" stroke="#b87446" strokeWidth="2" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="147" cy="326" r="5.5" fill="#b87446" stroke="#ffffff" strokeWidth="1.8" />
            <rect x="75" y="338" width="105" height="18" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#b87446" strokeWidth="1" />
            <text x="127" y="350" textAnchor="middle" fill="#1c1917" fontSize="9" fontWeight="800" fontFamily="sans-serif">Gorée (Dakar)</text>
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
            <circle cx="79" cy="313" r="14" fill="none" stroke="#c4895c" strokeWidth="1.8" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="79" cy="313" r="5" fill="#c4895c" stroke="#ffffff" strokeWidth="1.8" />
            <rect x="25" y="292" width="85" height="17" rx="3.5" fill="#ffffff" fillOpacity="0.92" stroke="#c4895c" strokeWidth="1" />
            <text x="67" y="304" textAnchor="middle" fill="#1c1917" fontSize="8.5" fontWeight="800" fontFamily="sans-serif">Cabo Verde</text>
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
            <circle cx="322" cy="424" r="5.5" fill="#9e4c56" stroke="#ffffff" strokeWidth="1.8" />
            <rect x="250" y="438" width="125" height="18" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#9e4c56" strokeWidth="1" />
            <text x="312" y="450" textAnchor="middle" fill="#1c1917" fontSize="8.5" fontWeight="800" fontFamily="sans-serif">Elmina (Gold Coast)</text>
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 2. CREATIVE TECH, FINTECH & DIASPORA COUNTER-STREAM                        */}
      {/* ========================================================================= */}
      {showTech && (
        <g className="tech-innovation-layer">
          {/* West African Tech Triangle: Lagos <-> Accra <-> Dakar */}
          <path
            d="M 386 416 L 328 423 L 147 326 Z"
            fill="none"
            stroke="#059669"
            strokeWidth="3.2"
            strokeDasharray="8 4"
            strokeLinecap="round"
            className="animate-dash-fast"
          />
          <path
            d="M 386 416 L 328 423 L 147 326 Z"
            fill="none"
            stroke="#fef08a"
            strokeWidth="1.5"
            strokeDasharray="4 8"
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
            <circle cx="386" cy="416" r="18" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.85" className="animate-radar-pulse" />
            <circle cx="386" cy="416" r="6" fill="#059669" stroke="#ffffff" strokeWidth="2" />
            <rect x="382" y="388" width="128" height="23" rx="4" fill="#ffffff" fillOpacity="0.92" stroke="#059669" strokeWidth="1" />
            <text x="446" y="399" textAnchor="middle" fill="#065f46" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">Lagos FinTech Capital</text>
            <text x="446" y="408" textAnchor="middle" fill="#047857" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Yaba • $2.5B Ecosystem</text>
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
            <circle cx="328" cy="423" r="14" fill="none" stroke="#3b82f6" strokeWidth="1.8" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="328" cy="423" r="5.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.8" />
            <rect x="260" y="405" width="98" height="16" rx="3.5" fill="#ffffff" fillOpacity="0.92" stroke="#2563eb" strokeWidth="1" />
            <text x="309" y="416" textAnchor="middle" fill="#1e40af" fontSize="8.5" fontWeight="800" fontFamily="sans-serif">Accra Tech & AI</text>
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
            <circle cx="147" cy="326" r="14" fill="none" stroke="#10b981" strokeWidth="1.8" opacity="0.8" className="animate-radar-pulse" />
            <circle cx="147" cy="326" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.8" />
          </g>
        </g>
      )}

      {/* ========================================================================= */}
      {/* 3. WAPP REGIONAL POWER POOL & RENEWABLE GRID                               */}
      {/* ========================================================================= */}
      {showEnergy && (
        <g className="energy-infrastructure-layer">
          {/* West African Power Pool (WAPP) Interconnector Artery */}
          <path
            d="M 147 326 L 246 348 L 314 351 L 352 339 L 408 386 L 386 416 L 328 423 L 280 425 Z"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.8"
            strokeDasharray="7 4"
            strokeLinecap="round"
            className="animate-dash-med"
          />

          {/* Subsea 2Africa / Equiano Optical Cable along the Coast */}
          <path
            d="M 79 313 C 110 370 170 420 280 435 C 330 440 390 435 435 450"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.2"
            strokeDasharray="6 3"
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
            <circle cx="280" cy="425" r="5.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.8" />
            <rect x="225" y="442" width="105" height="17" rx="3.5" fill="#ffffff" fillOpacity="0.92" stroke="#d97706" strokeWidth="1" />
            <text x="277" y="454" textAnchor="middle" fill="#b45309" fontSize="8.5" fontWeight="800" fontFamily="sans-serif">Abidjan WAPP Grid</text>
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
            d="M 155 310 C 240 315 330 325 440 315"
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
            strokeDasharray="9 5"
            strokeLinecap="round"
            opacity="0.85"
            className="animate-dash-slow"
          />
          <text x="290" y="305" textAnchor="middle" fill="#15803d" fontSize="9" fontWeight="800" fontFamily="sans-serif" letterSpacing="2">
            GREAT GREEN WALL BIOSPHERE
          </text>
        </g>
      )}
    </g>
  );
};
