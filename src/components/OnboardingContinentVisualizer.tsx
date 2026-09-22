import React from 'react';
import { AfricaUnLogo } from './AfricaUnLogo';
import { 
  Anchor, 
  Globe2, 
  Dna, 
  TrendingUp, 
  Cpu, 
  Zap, 
  Compass, 
  Sparkles, 
  Layers, 
  Rocket
} from 'lucide-react';

interface OnboardingContinentVisualizerProps {
  theme: 'history' | 'economy' | 'future';
  className?: string;
}

// Muted & faded official UN Geoscheme M49 colors per theme
const THEME_UN_GEOSCHEME_COLORS = {
  history: {
    'Northern Africa': '#e2e8f0', // deeply faded/muted inactive region
    'Western Africa': '#7ab38e',  // active TAST archival region (soft emerald/mineral green)
    'Central Africa': '#b082b0',  // active TAST archival region (soft amethyst)
    'Eastern Africa': '#c9a85c',  // active TAST archival region (soft ochre gold)
    'Southern Africa': '#b87575'  // active transit region (soft terracotta)
  },
  economy: {
    'Northern Africa': '#93c5fd', // Cairo Hub (UN Northern Africa Blue)
    'Western Africa': '#6ee7b7',  // Lagos Hub (UN Western Africa Green)
    'Central Africa': '#e2e8f0',  // deeply faded inactive interior
    'Eastern Africa': '#fde68a',  // Nairobi Hub (UN Eastern Africa Amber)
    'Southern Africa': '#fca5a5'  // Johannesburg Hub (UN Southern Africa Red)
  },
  future: {
    'Northern Africa': '#bfdbfe', // Cairo AI / North Africa
    'Western Africa': '#a7f3d0',  // Yaba FinTech Hub
    'Central Africa': '#e9d5ff',  // Kigali / Central-East Innovation Corridor
    'Eastern Africa': '#fef08a',  // Silicon Savannah / Nairobi
    'Southern Africa': '#fecdd3'  // Cape Tech Hub
  }
};

export const OnboardingContinentVisualizer: React.FC<OnboardingContinentVisualizerProps> = ({
  theme,
  className = ''
}) => {
  const containerBg = 
    theme === 'history' 
      ? 'bg-[#faf5ee]/97 border-amber-200/90' 
      : theme === 'economy' 
      ? 'bg-[#f2f8f4]/97 border-emerald-200/90' 
      : 'bg-[#f6f5fc]/97 border-indigo-200/90';

  const currentColorMap = THEME_UN_GEOSCHEME_COLORS[theme];

  return (
    <div className={`relative w-full rounded-3xl ${containerBg} border shadow-sm px-4 sm:px-5 py-[5px] my-0 overflow-hidden flex flex-col items-center justify-between gap-3 sm:gap-4 backdrop-blur-md transition-colors duration-500 ${className}`}>
      {/* 1. Atmospheric Grid & Tonal Underglow Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#78716c_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {theme === 'history' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#9a5c36]/10 via-transparent to-[#b47b4d]/8 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-[#9a5c36]/12 blur-[100px] pointer-events-none" />
        </>
      )}
      {theme === 'economy' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3f6c58]/10 via-transparent to-[#5c8d76]/8 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-[#3f6c58]/12 blur-[100px] pointer-events-none" />
        </>
      )}
      {theme === 'future' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#545279]/10 via-transparent to-[#7775a2]/8 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-[#545279]/12 blur-[100px] pointer-events-none" />
        </>
      )}

      {/* 2. Top Header Status & Active Projection Indicator */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/70 pb-2 pt-1">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-700">
            {theme === 'history' && 'TAST Archival Vector Stream • 54 Nations'}
            {theme === 'economy' && 'AfCFTA Multilateral Corridor Network'}
            {theme === 'future' && 'Pan-African Innovation & Demographic Grid'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-600 bg-white/80 px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs">
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span>UN M49 Geoscheme • Animated Vectors</span>
        </div>
      </div>

      {/* 3. Main Stage: Spacious Side Panels + Full-Height Continent SVG Container */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch py-[5px] my-0">
        
        {/* Left Side: Rich Info Panels */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-2.5 sm:gap-3 order-2 lg:order-1">
          {theme === 'history' && (
            <>
              <div className="p-3 rounded-2xl bg-white/90 border border-stone-200/90 shadow-2xs backdrop-blur-md transition-all hover:border-amber-400">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
                    <Anchor className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>Archival Voyage Logs</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                    36,000+ Expeditions
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  Transatlantic Slave Trade database indexed from Harvard Du Bois Institute & Emory University primary maritime manifests.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-stone-200/90 shadow-2xs backdrop-blur-md transition-all hover:border-amber-400">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
                    <Dna className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>Lineages & Ethnolinguistics</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                    DNA Markers
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  Mitochondrial lineages and ethno-linguistic connections spanning Senegambia, Bight of Biafra, Gold Coast, Mozambique, and Angola.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-stone-200/90 shadow-2xs backdrop-blur-md transition-all hover:border-amber-400">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
                    <Globe2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>Diaspora Cultural Arc</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                    Global Bridges
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  Continuous cultural, musical, and economic bridges connecting Africa with the Caribbean, South America, and North America.
                </p>
              </div>
            </>
          )}

          {theme === 'economy' && (
            <>
              <div className="p-3 rounded-2xl bg-white/90 border border-stone-200/90 shadow-2xs backdrop-blur-md transition-all hover:border-emerald-400">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
                    <TrendingUp className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>AfCFTA Single Market</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                    $3.4T GDP
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  World's largest free trade zone unifying 54 nations, removing 90% of tariffs for 1.4 billion people.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-stone-200/90 shadow-2xs backdrop-blur-md transition-all hover:border-emerald-400">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
                    <Zap className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>Power Interconnectors</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                    WAPP • EAPP • SAPP
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  Synchronized clean cross-border power grids harmonizing hydroelectric and solar transmission across regions.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-stone-200/90 shadow-2xs backdrop-blur-md transition-all hover:border-emerald-400">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
                    <Layers className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>PAPSS Settlement Rails</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                    Instant Clearing
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  Real-time local currency payment system eliminating foreign exchange friction across Trans-Sahelian trade corridors.
                </p>
              </div>
            </>
          )}

          {theme === 'future' && (
            <>
              <div className="p-3 rounded-2xl bg-white/90 border border-stone-200/90 shadow-2xs backdrop-blur-md transition-all hover:border-indigo-400">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
                    <Rocket className="w-4 h-4 text-indigo-700 flex-shrink-0" />
                    <span>Demographic Dividend</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">
                    Median Age 19.7
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  World's youngest digital-first population, projected to comprise 1 in every 4 people on Earth by 2050.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-stone-200/90 shadow-2xs backdrop-blur-md transition-all hover:border-indigo-400">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
                    <Cpu className="w-4 h-4 text-indigo-700 flex-shrink-0" />
                    <span>Silicon Savannah & 4IR</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">
                    5 Tech Megahubs
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  High-growth innovation nodes in Lagos, Nairobi, Kigali, Cairo, and Cape Town driving global FinTech and AI.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-stone-200/90 shadow-2xs backdrop-blur-md transition-all hover:border-indigo-400">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>Green Minerals & Energy</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">
                    AU Agenda 2063
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  World leadership in cobalt, lithium, and solar potential anchoring global green industrial transitions.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right Side: Prominent Continent Stage (Fills all available height) */}
        <div className="lg:col-span-7 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px] h-full w-full order-1 lg:order-2 overflow-visible py-[5px] my-0">
          <AfricaUnLogo
            className="w-full h-full max-h-[540px] drop-shadow-[0_8px_24px_rgba(0,0,0,0.08)] select-none transition-all duration-700"
            interactive={false}
            glow={false}
            viewBox="-240 0 6036 5867"
            strokeColor="#ffffff"
            strokeWidth={1}
            customColorMap={currentColorMap}
          >
            <defs>
              <linearGradient id="overlayTradeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3f6c58" />
                <stop offset="50%" stopColor="#4e856c" />
                <stop offset="100%" stopColor="#d4a373" />
              </linearGradient>

              <linearGradient id="overlayDiasporaGrad" x1="100%" y1="50%" x2="0%" y2="50%">
                <stop offset="0%" stopColor="#427896" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#b87446" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#9e4c56" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="prominentStreamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e07a5f" />
                <stop offset="50%" stopColor="#d48b50" />
                <stop offset="100%" stopColor="#b85c38" />
              </linearGradient>

              <linearGradient id="mozambiqueStreamGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#b85c38" />
                <stop offset="60%" stopColor="#9e4c56" />
                <stop offset="100%" stopColor="#427896" />
              </linearGradient>
            </defs>

            {/* ========================================================================= */}
            {/* THEME 1: TAST ARCHIVAL VECTOR STREAM                                      */}
            {/* ========================================================================= */}
            {theme === 'history' && (
              <g className="animate-in fade-in duration-500">
                {/* 1. SENEGAL TO CABO VERDE AND EXTENDED TRANSATLANTIC STREAM */}
                {/* Senegal (720, 1920) to Cabo Verde (315, 1820) */}
                <path
                  d="M 720,1920 C 580,1880 440,1850 315,1820"
                  fill="none"
                  stroke="#d48b50"
                  strokeWidth="24"
                  strokeDasharray="45,25"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="280;0" dur="2.2s" repeatCount="indefinite" />
                </path>
                {/* Cabo Verde (315, 1820) Outward past SVG bounds into the Atlantic (-600, 1650) */}
                <path
                  d="M 315,1820 C 100,1800 -200,1750 -600,1650"
                  fill="none"
                  stroke="#c4895c"
                  strokeWidth="22"
                  strokeDasharray="45,30"
                  opacity="0.9"
                >
                  <animate attributeName="stroke-dashoffset" values="300;0" dur="2.6s" repeatCount="indefinite" />
                </path>
                {/* Senegal -> Cabo Verde -> Atlantic Traveling Photons */}
                <circle r="26" fill="#fef08a" stroke="#b85c38" strokeWidth="8">
                  <animateMotion path="M 720,1920 C 580,1880 440,1850 315,1820" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle r="24" fill="#fef08a" stroke="#c4895c" strokeWidth="8">
                  <animateMotion path="M 315,1820 C 100,1800 -200,1750 -600,1650" dur="2.8s" repeatCount="indefinite" />
                </circle>

                {/* 2. PROMINENT VECTOR STREAMS ANCHORED ON TAST HISTORICAL PROVENANCE REGIONS */}
                {/* 2A. WIDE BASE TRANSLUCENT UNDERGLOW AURA */}
                <path
                  d="M 1000,2420 C 1400,2900 1700,3200 1350,3350 L 750,3550 C 1500,3800 2200,3500 2520,2720 Z"
                  fill="url(#prominentStreamGrad)"
                  opacity="0.18"
                />
                <path
                  d="M 2650,3200 C 2200,3400 1800,3550 1350,3700 L 750,3550 C 1800,4200 2400,4300 2860,4040 Z"
                  fill="url(#prominentStreamGrad)"
                  opacity="0.18"
                />

                {/* 2B. WESTERN AFRICA TRIBUTARIES */}
                {/* Tributary 1: Windward Coast / Sierra Leone (1000, 2420) -> Confluence (1350, 3350) */}
                <path
                  d="M 1000,2420 C 1100,2700 1250,3000 1350,3350"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="28"
                  strokeDasharray="50,28"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="312;0" dur="2.2s" repeatCount="indefinite" />
                </path>
                {/* Tributary 2: Ghana / Gold Coast / Elmina (1850, 2690) -> Confluence (1350, 3350) */}
                <path
                  d="M 1850,2690 C 1700,2900 1500,3150 1350,3350"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="34"
                  strokeDasharray="55,28"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="332;0" dur="1.9s" repeatCount="indefinite" />
                </path>
                {/* Tributary 3: Benin / Bight of Benin / Ouidah (2110, 2580) -> Confluence (1350, 3350) */}
                <path
                  d="M 2110,2580 C 1900,2850 1600,3150 1350,3350"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="36"
                  strokeDasharray="55,28"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="332;0" dur="2s" repeatCount="indefinite" />
                </path>
                {/* Tributary 4: Nigeria / Bight of Biafra / Bonny & Calabar (2520, 2720) -> Confluence (1350, 3350) */}
                <path
                  d="M 2520,2720 C 2150,2950 1750,3200 1350,3350"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="36"
                  strokeDasharray="52,28"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="320;0" dur="2.2s" repeatCount="indefinite" />
                </path>

                {/* 2C. CENTRAL AFRICA TRIBUTARIES */}
                {/* Tributary 5: Cameroon / Bimbia (2650, 2800) -> Confluence (1350, 3350) */}
                <path
                  d="M 2650,2800 C 2250,3050 1800,3250 1350,3350"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="30"
                  strokeDasharray="50,28"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="312;0" dur="2.1s" repeatCount="indefinite" />
                </path>
                {/* Tributary 6: Gabon & Congo / Loango Coast (2650, 3200) -> Confluence (1350, 3700) */}
                <path
                  d="M 2650,3200 C 2200,3350 1700,3500 1350,3700"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="36"
                  strokeDasharray="55,28"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="332;0" dur="1.9s" repeatCount="indefinite" />
                </path>
                {/* Tributary 7: Angola / Luanda (2850, 3700) -> Confluence (1350, 3700) */}
                <path
                  d="M 2850,3700 C 2350,3700 1800,3700 1350,3700"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="38"
                  strokeDasharray="55,28"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="332;0" dur="2s" repeatCount="indefinite" />
                </path>
                {/* Tributary 8: Angola / Benguela (2860, 4040) -> Confluence (1350, 3700) */}
                <path
                  d="M 2860,4040 C 2350,3950 1800,3850 1350,3700"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="32"
                  strokeDasharray="50,28"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="312;0" dur="2.3s" repeatCount="indefinite" />
                </path>

                {/* 2D. CONFLUENCE TO MAIN ATLANTIC ARTERY */}
                <path
                  d="M 1350,3350 L 750,3550"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="58"
                  strokeLinecap="round"
                />
                <path
                  d="M 1350,3700 L 750,3550"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="58"
                  strokeLinecap="round"
                />
                <path
                  d="M 1350,3350 L 750,3550"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="20"
                  strokeDasharray="50,25"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="300;0" dur="1.1s" repeatCount="indefinite" />
                </path>
                <path
                  d="M 1350,3700 L 750,3550"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="20"
                  strokeDasharray="50,25"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="300;0" dur="1.1s" repeatCount="indefinite" />
                </path>

                {/* Confluence Junction Nodes */}
                <circle cx="1350" cy="3350" r="48" fill="#b85c38" stroke="#fef08a" strokeWidth="12" />
                <circle cx="1350" cy="3700" r="48" fill="#b85c38" stroke="#fef08a" strokeWidth="12" />
                <circle cx="750" cy="3550" r="54" fill="#b85c38" stroke="#fef08a" strokeWidth="14" />

                {/* 2E. TRANSATLANTIC CORRIDOR 1: TOWARDS BRAZIL / SOUTH AMERICA */}
                <path
                  d="M 750,3550 C 350,3800 -150,4100 -700,4400"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="52"
                  strokeDasharray="65,35"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="400;0" dur="2s" repeatCount="indefinite" />
                </path>
                <path
                  d="M 750,3550 C 350,3800 -150,4100 -700,4400"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="18"
                  strokeDasharray="35,65"
                >
                  <animate attributeName="stroke-dashoffset" values="300;0" dur="1.5s" repeatCount="indefinite" />
                </path>
                <circle r="30" fill="#fef08a" stroke="#b85c38" strokeWidth="10">
                  <animateMotion path="M 1350,3700 L 750,3550 C 350,3800 -150,4100 -700,4400" dur="3.2s" repeatCount="indefinite" />
                </circle>

                {/* 2F. TRANSATLANTIC CORRIDOR 2: TOWARDS CARIBBEAN & NORTH AMERICA */}
                <path
                  d="M 750,3550 C 300,3050 -100,2600 -650,2300"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="36"
                  strokeDasharray="50,28"
                  strokeLinecap="round"
                  opacity="0.95"
                >
                  <animate attributeName="stroke-dashoffset" values="312;0" dur="2.2s" repeatCount="indefinite" />
                </path>
                <circle r="26" fill="#fed7aa" stroke="#b85c38" strokeWidth="9">
                  <animateMotion path="M 1350,3350 L 750,3550 C 300,3050 -100,2600 -650,2300" dur="3.4s" repeatCount="indefinite" />
                </circle>

                {/* 3. COASTAL CONDUIT: BETWEEN SENEGAMBIA AND GULF OF GUINEA */}
                <path
                  d="M 720,1920 C 850,2150 950,2300 1000,2420 C 1400,2550 1700,2650 1850,2690"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="28"
                  strokeDasharray="55,30"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="340;0" dur="2.5s" repeatCount="indefinite" />
                </path>
                <circle r="24" fill="#fef08a" stroke="#b85c38" strokeWidth="8">
                  <animateMotion path="M 720,1920 C 850,2150 950,2300 1000,2420 C 1400,2550 1700,2650 1850,2690" dur="3.8s" repeatCount="indefinite" />
                </circle>

                {/* 4. COASTAL CONDUIT: BETWEEN ANGOLA AND CAMEROON */}
                <path
                  d="M 2850,3700 C 2750,3400 2700,3100 2650,2800"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="28"
                  strokeDasharray="50,25"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="300;0" dur="1.9s" repeatCount="indefinite" />
                </path>
                <circle r="24" fill="#fef08a" stroke="#b85c38" strokeWidth="8">
                  <animateMotion path="M 2850,3700 C 2750,3400 2700,3100 2650,2800" dur="2.4s" repeatCount="indefinite" />
                </circle>

                {/* 5. MOZAMBIQUE AND MADAGASCAR STREAM (Around Cape of Good Hope into Atlantic) */}
                <path
                  d="M 5255,4622 C 4950,4400 4850,4300 4760,4250 C 4550,4450 4480,4550 4440,4590 C 4300,5200 3800,5750 3300,5800 C 2200,5850 800,5500 -400,5000"
                  fill="none"
                  stroke="url(#mozambiqueStreamGrad)"
                  strokeWidth="32"
                  strokeDasharray="60,30"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="400;0" dur="4.2s" repeatCount="indefinite" />
                </path>
                <circle r="28" fill="#fef08a" stroke="#c45d3e" strokeWidth="9">
                  <animateMotion path="M 5255,4622 C 4950,4400 4850,4300 4760,4250 C 4550,4450 4480,4550 4440,4590 C 4300,5200 3800,5750 3300,5800 C 2200,5850 800,5500 -400,5000" dur="6s" repeatCount="indefinite" />
                </circle>

                {/* 6. RADAR PULSES, ANCHOR NODES & LABELS ON CONTINENTAL EMBARKATION BASINS */}
                {/* Cabo Verde (315, 1820) */}
                <circle cx="315" cy="1820" r="100" fill="none" stroke="#c4895c" strokeWidth="12" opacity="0.85">
                  <animate attributeName="r" values="35;130" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="315" cy="1820" r="44" fill="#c4895c" stroke="#ffffff" strokeWidth="12" />
                <text x="380" y="1800" fill="#1c1917" fontSize="88" fontWeight="800" fontFamily="sans-serif">
                  Cabo Verde
                </text>

                {/* Gorée / Senegal (720, 1920) */}
                <circle cx="720" cy="1920" r="110" fill="none" stroke="#b87446" strokeWidth="12" opacity="0.85">
                  <animate attributeName="r" values="40;140" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="720" cy="1920" r="48" fill="#b87446" stroke="#ffffff" strokeWidth="12" />
                <text x="790" y="1900" fill="#1c1917" fontSize="90" fontWeight="800" fontFamily="sans-serif">
                  Gorée (Senegambia)
                </text>

                {/* Sierra Leone (1000, 2420) */}
                <circle cx="1000" cy="2420" r="95" fill="none" stroke="#b85c38" strokeWidth="11" opacity="0.85">
                  <animate attributeName="r" values="35;125" dur="2.3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.3s" repeatCount="indefinite" />
                </circle>
                <circle cx="1000" cy="2420" r="42" fill="#b85c38" stroke="#ffffff" strokeWidth="11" />
                <text x="1070" y="2430" fill="#1c1917" fontSize="82" fontWeight="800" fontFamily="sans-serif">
                  Sierra Leone
                </text>

                {/* Elmina & Cape Coast / Ghana (1850, 2690) */}
                <circle cx="1850" cy="2690" r="110" fill="none" stroke="#9e4c56" strokeWidth="12" opacity="0.85">
                  <animate attributeName="r" values="40;140" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="1850" cy="2690" r="48" fill="#9e4c56" stroke="#ffffff" strokeWidth="12" />
                <text x="1480" y="2820" fill="#1c1917" fontSize="85" fontWeight="800" fontFamily="sans-serif">
                  Gold Coast (Elmina)
                </text>

                {/* Ouidah / Benin (2110, 2580) */}
                <circle cx="2110" cy="2580" r="44" fill="#b85c38" stroke="#ffffff" strokeWidth="11" />
                <text x="2170" y="2550" fill="#1c1917" fontSize="82" fontWeight="800" fontFamily="sans-serif">
                  Bight of Benin (Ouidah)
                </text>

                {/* Bonny & Calabar / Nigeria (2520, 2720) */}
                <circle cx="2520" cy="2720" r="110" fill="none" stroke="#b87446" strokeWidth="12" opacity="0.85">
                  <animate attributeName="r" values="40;140" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="2520" cy="2720" r="48" fill="#b87446" stroke="#ffffff" strokeWidth="12" />
                <text x="2590" y="2680" fill="#1c1917" fontSize="88" fontWeight="800" fontFamily="sans-serif">
                  Biafra (Bonny & Calabar)
                </text>

                {/* Cameroon / Bimbia (2650, 2800) */}
                <circle cx="2650" cy="2800" r="42" fill="#e07a5f" stroke="#ffffff" strokeWidth="11" />

                {/* Luanda & Benguela / Angola (2850, 3700) & (2860, 4040) */}
                <circle cx="2850" cy="3700" r="110" fill="none" stroke="#c4895c" strokeWidth="12" opacity="0.85">
                  <animate attributeName="r" values="40;140" dur="2.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.6s" repeatCount="indefinite" />
                </circle>
                <circle cx="2850" cy="3700" r="50" fill="#c4895c" stroke="#ffffff" strokeWidth="13" />
                <circle cx="2860" cy="4040" r="44" fill="#c4895c" stroke="#ffffff" strokeWidth="11" />
                <text x="2940" y="3740" fill="#1c1917" fontSize="92" fontWeight="800" fontFamily="sans-serif">
                  Angola (Luanda & Benguela)
                </text>

                {/* Mozambique (4760, 4250) */}
                <circle cx="4760" cy="4250" r="105" fill="none" stroke="#c45d3e" strokeWidth="12" opacity="0.85">
                  <animate attributeName="r" values="35;135" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="4760" cy="4250" r="46" fill="#c45d3e" stroke="#ffffff" strokeWidth="12" />
                <text x="3950" y="4230" fill="#1c1917" fontSize="88" fontWeight="800" fontFamily="sans-serif">
                  Mozambique
                </text>

                {/* Madagascar (5255, 4622) */}
                <circle cx="5255" cy="4622" r="105" fill="none" stroke="#c45d3e" strokeWidth="12" opacity="0.85">
                  <animate attributeName="r" values="35;135" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="5255" cy="4622" r="46" fill="#c45d3e" stroke="#ffffff" strokeWidth="12" />
                <text x="4950" y="4820" fill="#1c1917" fontSize="88" fontWeight="800" fontFamily="sans-serif">
                  Madagascar
                </text>
              </g>
            )}

            {/* ========================================================================= */}
            {/* THEME 2: AFCFTA MULTILATERAL CORRIDORS                                     */}
            {/* ========================================================================= */}
            {theme === 'economy' && (
              <g className="animate-in fade-in duration-500">
                {/* Multilateral High-Contrast UN Geoscheme Trade Arteries */}
                {/* Lagos (2250, 2600) <-> Nairobi (4540, 3250) <-> Cairo (4130, 720) */}
                <path
                  d="M 2250,2600 L 4540,3250 L 4130,720 Z"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="42"
                  strokeDasharray="70,38"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="432;0" dur="2.8s" repeatCount="indefinite" />
                </path>
                {/* Glowing Inner Core */}
                <path
                  d="M 2250,2600 L 4540,3250 L 4130,720 Z"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="18"
                  strokeDasharray="40,70"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="440;0" dur="2.2s" repeatCount="indefinite" />
                </path>

                {/* Nairobi (4540, 3250) <-> Johannesburg (3770, 5200) <-> Lagos (2250, 2600) */}
                <path
                  d="M 4540,3250 L 3770,5200 L 2250,2600"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="42"
                  strokeDasharray="70,38"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="432;0" dur="2.8s" repeatCount="indefinite" />
                </path>
                {/* Glowing Inner Core */}
                <path
                  d="M 4540,3250 L 3770,5200 L 2250,2600"
                  fill="none"
                  stroke="#6ee7b7"
                  strokeWidth="18"
                  strokeDasharray="40,70"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="440;0" dur="2.2s" repeatCount="indefinite" />
                </path>

                {/* Traveling Energy Photons along Trade Corridors */}
                <circle r="32" fill="#fef08a" stroke="#047857" strokeWidth="12">
                  <animateMotion path="M 2250,2600 L 4540,3250 L 4130,720 Z" dur="4.2s" repeatCount="indefinite" />
                </circle>
                <circle r="32" fill="#fde68a" stroke="#b45309" strokeWidth="12">
                  <animateMotion path="M 4540,3250 L 3770,5200 L 2250,2600" dur="4.2s" repeatCount="indefinite" />
                </circle>

                {/* Economic Hub Beacons & Radar Pulses */}
                {/* Lagos Hub (2250, 2600) */}
                <circle cx="2250" cy="2600" r="110" fill="none" stroke="#059669" strokeWidth="13" opacity="0.85">
                  <animate attributeName="r" values="40;150" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="2250" cy="2600" r="52" fill="#059669" stroke="#ffffff" strokeWidth="15" />
                <text x="1450" y="2630" fill="#0f172a" fontSize="96" fontWeight="800" fontFamily="sans-serif">
                  Lagos Hub
                </text>

                {/* Nairobi Hub (4540, 3250) */}
                <circle cx="4540" cy="3250" r="110" fill="none" stroke="#d97706" strokeWidth="13" opacity="0.85">
                  <animate attributeName="r" values="40;150" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="4540" cy="3250" r="52" fill="#d97706" stroke="#ffffff" strokeWidth="15" />
                <text x="4640" y="3280" fill="#0f172a" fontSize="96" fontWeight="800" fontFamily="sans-serif">
                  Nairobi Hub
                </text>

                {/* Cairo Hub (4130, 720) */}
                <circle cx="4130" cy="720" r="110" fill="none" stroke="#2563eb" strokeWidth="13" opacity="0.85">
                  <animate attributeName="r" values="40;150" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="4130" cy="720" r="52" fill="#2563eb" stroke="#ffffff" strokeWidth="15" />
                <text x="4240" y="750" fill="#0f172a" fontSize="96" fontWeight="800" fontFamily="sans-serif">
                  Cairo Hub
                </text>

                {/* Johannesburg (3770, 5200) */}
                <circle cx="3770" cy="5200" r="110" fill="none" stroke="#dc2626" strokeWidth="13" opacity="0.85">
                  <animate attributeName="r" values="40;150" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="3770" cy="5200" r="52" fill="#dc2626" stroke="#ffffff" strokeWidth="15" />
                <text x="3880" y="5230" fill="#0f172a" fontSize="96" fontWeight="800" fontFamily="sans-serif">
                  Johannesburg
                </text>
              </g>
            )}

            {/* ========================================================================= */}
            {/* THEME 3: PAN-AFRICAN INNOVATION & DEMOGRAPHIC GRID                        */}
            {/* ========================================================================= */}
            {theme === 'future' && (
              <g className="animate-in fade-in duration-500">
                {/* 4IR Innovation Network Arches across UN Geoschemes */}
                {/* Yaba/Lagos (2250, 2600) -> Kigali Tech (4080, 3260) */}
                <path
                  d="M 2250,2600 Q 3150,2850 4080,3260"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="40"
                  strokeDasharray="70,38"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="432;0" dur="2.2s" repeatCount="indefinite" />
                </path>
                {/* Glowing Core */}
                <path
                  d="M 2250,2600 Q 3150,2850 4080,3260"
                  fill="none"
                  stroke="#c4b5fd"
                  strokeWidth="18"
                  strokeDasharray="40,70"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="440;0" dur="1.8s" repeatCount="indefinite" />
                </path>

                {/* Kigali Tech (4080, 3260) -> Cape Tech Hub (3200, 5750) */}
                <path
                  d="M 4080,3260 Q 3950,4500 3200,5750"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="40"
                  strokeDasharray="70,38"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="432;0" dur="2.4s" repeatCount="indefinite" />
                </path>
                {/* Glowing Core */}
                <path
                  d="M 4080,3260 Q 3950,4500 3200,5750"
                  fill="none"
                  stroke="#fecdd3"
                  strokeWidth="18"
                  strokeDasharray="40,70"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="440;0" dur="2s" repeatCount="indefinite" />
                </path>

                {/* Yaba/Lagos (2250, 2600) -> Cairo AI (4130, 720) */}
                <path
                  d="M 2250,2600 Q 3100,1500 4130,720"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="40"
                  strokeDasharray="70,38"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="432;0" dur="2.2s" repeatCount="indefinite" />
                </path>
                {/* Glowing Core */}
                <path
                  d="M 2250,2600 Q 3100,1500 4130,720"
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="18"
                  strokeDasharray="40,70"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="440;0" dur="1.8s" repeatCount="indefinite" />
                </path>

                {/* Traveling High-Speed Data Packets */}
                <circle r="30" fill="#fef08a" stroke="#7c3aed" strokeWidth="12">
                  <animateMotion path="M 2250,2600 Q 3150,2850 4080,3260" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r="30" fill="#fef08a" stroke="#e11d48" strokeWidth="12">
                  <animateMotion path="M 4080,3260 Q 3950,4500 3200,5750" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle r="30" fill="#fef08a" stroke="#2563eb" strokeWidth="12">
                  <animateMotion path="M 2250,2600 Q 3100,1500 4130,720" dur="2.2s" repeatCount="indefinite" />
                </circle>

                {/* Innovation Nodes & Pulsing Waves */}
                {/* Kigali Tech (4080, 3260) */}
                <circle cx="4080" cy="3260" r="110" fill="none" stroke="#7c3aed" strokeWidth="13" opacity="0.85">
                  <animate attributeName="r" values="40;150" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="4080" cy="3260" r="52" fill="#7c3aed" stroke="#ffffff" strokeWidth="15" />
                <text x="4190" y="3250" fill="#0f172a" fontSize="96" fontWeight="800" fontFamily="sans-serif">
                  Kigali Tech
                </text>

                {/* Yaba FinTech (2250, 2600) */}
                <circle cx="2250" cy="2600" r="110" fill="none" stroke="#059669" strokeWidth="13" opacity="0.85">
                  <animate attributeName="r" values="40;150" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="2250" cy="2600" r="52" fill="#059669" stroke="#ffffff" strokeWidth="15" />
                <text x="1450" y="2580" fill="#0f172a" fontSize="96" fontWeight="800" fontFamily="sans-serif">
                  Yaba FinTech
                </text>

                {/* Cape Tech Hub (3200, 5750) */}
                <circle cx="3200" cy="5750" r="110" fill="none" stroke="#e11d48" strokeWidth="13" opacity="0.85">
                  <animate attributeName="r" values="40;150" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="3200" cy="5750" r="52" fill="#e11d48" stroke="#ffffff" strokeWidth="15" />
                <text x="2380" y="5830" fill="#0f172a" fontSize="96" fontWeight="800" fontFamily="sans-serif">
                  Cape Tech Hub
                </text>

                {/* Cairo AI Hub (4130, 720) */}
                <circle cx="4130" cy="720" r="110" fill="none" stroke="#2563eb" strokeWidth="13" opacity="0.85">
                  <animate attributeName="r" values="40;150" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="4130" cy="720" r="52" fill="#2563eb" stroke="#ffffff" strokeWidth="15" />
                <text x="4240" y="750" fill="#0f172a" fontSize="96" fontWeight="800" fontFamily="sans-serif">
                  Cairo AI Hub
                </text>
              </g>
            )}
          </AfricaUnLogo>
        </div>
      </div>
    </div>
  );
};

