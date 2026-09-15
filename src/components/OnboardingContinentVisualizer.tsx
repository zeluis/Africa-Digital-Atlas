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
            viewBox="0 0 1000 1040"
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
                {/* Senegal (148, 327) to Cabo Verde (83, 318) */}
                <path
                  d="M 148,327 C 122,324 102,320 83,318"
                  fill="none"
                  stroke="#d48b50"
                  strokeWidth="4.5"
                  strokeDasharray="7,4"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="44;0" dur="2s" repeatCount="indefinite" />
                </path>
                {/* Cabo Verde (83, 318) Outward past SVG bounds into the Atlantic */}
                <path
                  d="M 83,318 C 30,314 -40,305 -130,290"
                  fill="none"
                  stroke="#c4895c"
                  strokeWidth="4"
                  strokeDasharray="7,5"
                  opacity="0.9"
                >
                  <animate attributeName="stroke-dashoffset" values="48;0" dur="2.4s" repeatCount="indefinite" />
                </path>
                {/* Senegal -> Cabo Verde -> Atlantic Traveling Photons */}
                <circle r="4.5" fill="#fef08a" stroke="#b85c38" strokeWidth="1.5">
                  <animateMotion path="M 148,327 C 122,324 102,320 83,318" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r="4" fill="#fef08a" stroke="#c4895c" strokeWidth="1.5">
                  <animateMotion path="M 83,318 C 30,314 -40,305 -130,290" dur="2.6s" repeatCount="indefinite" />
                </circle>

                {/* 2. TWO VERY PROMINENT VECTOR STREAMS WITH WIDE BASES ANCHORED ON COUNTRIES */}
                {/* 2A. WIDE BASE TRANSLUCENT UNDERGLOW AURA */}
                {/* Western Africa Coast Base Underglow Aura */}
                <path
                  d="M 170,475 C 240,540 260,570 200,600 L 200,610 C 320,590 390,560 438,538 Z"
                  fill="url(#prominentStreamGrad)"
                  opacity="0.22"
                />
                {/* Central Africa Coast Base Underglow Aura */}
                <path
                  d="M 462,558 C 360,580 280,590 200,600 L 200,610 C 340,650 420,680 496,720 Z"
                  fill="url(#prominentStreamGrad)"
                  opacity="0.22"
                />

                {/* 2B. WESTERN AFRICA TRIBUTARIES (Anchored directly on actual country geometries) */}
                {/* Tributary 1: Windward Coast / Sierra Leone (170, 475) -> Trunk Confluence (200, 600) */}
                <path
                  d="M 170,475 C 180,530 185,570 200,600"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="5.5"
                  strokeDasharray="9,5"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="56;0" dur="2.2s" repeatCount="indefinite" />
                </path>
                {/* Tributary 2: Ghana / Gold Coast / Elmina (304, 528) -> Trunk Confluence (200, 600) */}
                <path
                  d="M 304,528 C 275,560 240,585 200,600"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="7"
                  strokeDasharray="10,5"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="60;0" dur="1.8s" repeatCount="indefinite" />
                </path>
                {/* Tributary 3: Benin / Bight of Benin / Ouidah (353, 519) -> Trunk Confluence (200, 600) */}
                <path
                  d="M 353,519 C 310,560 255,585 200,600"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="7.5"
                  strokeDasharray="10,5"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="60;0" dur="2s" repeatCount="indefinite" />
                </path>
                {/* Tributary 4: Nigeria / Bight of Biafra / Bonny / Calabar (438, 538) -> Trunk Confluence (200, 600) */}
                <path
                  d="M 438,538 C 360,575 275,590 200,600"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="7"
                  strokeDasharray="9,5"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="56;0" dur="2.2s" repeatCount="indefinite" />
                </path>

                {/* 2C. CENTRAL AFRICA TRIBUTARIES (Anchored directly on actual country geometries) */}
                {/* Tributary 1: Cameroon / Bimbia (462, 558) -> Trunk Confluence (200, 600) */}
                <path
                  d="M 462,558 C 375,580 285,590 200,600"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="6"
                  strokeDasharray="9,5"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="56;0" dur="2.1s" repeatCount="indefinite" />
                </path>
                {/* Tributary 2: Gabon / Loango Coast (458, 612) -> Trunk Confluence (200, 600) */}
                <path
                  d="M 458,612 C 370,612 280,605 200,600"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="7"
                  strokeDasharray="10,5"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="60;0" dur="1.9s" repeatCount="indefinite" />
                </path>
                {/* Tributary 3: Angola / Luanda (492, 665) -> Trunk Confluence (200, 600) */}
                <path
                  d="M 492,665 C 390,645 290,618 200,600"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="7.5"
                  strokeDasharray="10,5"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="60;0" dur="2s" repeatCount="indefinite" />
                </path>
                {/* Tributary 4: Angola / Benguela (496, 720) -> Trunk Confluence (200, 600) */}
                <path
                  d="M 496,720 C 395,695 295,642 200,600"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="6"
                  strokeDasharray="9,5"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="56;0" dur="2.3s" repeatCount="indefinite" />
                </path>

                {/* 2D. JOINED TRUNK (Confluence from (200, 600) to Bifurcation (90, 625)) */}
                {/* Base Glow Trunk */}
                <path
                  d="M 200,600 L 90,625"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
                {/* High-energy Core Pulse */}
                <path
                  d="M 200,600 L 90,625"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="5"
                  strokeDasharray="10,5"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="60;0" dur="1.1s" repeatCount="indefinite" />
                </path>
                {/* Confluence & Bifurcation Junction Nodes */}
                <circle cx="200" cy="600" r="9" fill="#b85c38" stroke="#fef08a" strokeWidth="2.5" />
                <circle cx="90" cy="625" r="9.5" fill="#b85c38" stroke="#fef08a" strokeWidth="2.5" />

                {/* 2E. BIFURCATION BRANCH 1: WIDER TOWARDS BRAZIL & SOUTH AMERICA (Extends past SVG bounds) */}
                <path
                  d="M 90,625 C 20,670 -60,715 -160,760"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="10"
                  strokeDasharray="12,6"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="72;0" dur="2s" repeatCount="indefinite" />
                </path>
                {/* Inner Accelerated Energy Flow */}
                <path
                  d="M 90,625 C 20,670 -60,715 -160,760"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="4"
                  strokeDasharray="6,12"
                >
                  <animate attributeName="stroke-dashoffset" values="54;0" dur="1.5s" repeatCount="indefinite" />
                </path>
                {/* Traveling Beacons to South America */}
                <circle r="6" fill="#fef08a" stroke="#b85c38" strokeWidth="2">
                  <animateMotion path="M 200,600 L 90,625 C 20,670 -60,715 -160,760" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* 2F. BIFURCATION BRANCH 2: THINNER TOWARDS CARIBBEAN & NORTH AMERICA (Extends past SVG bounds) */}
                <path
                  d="M 90,625 C 10,540 -50,470 -150,420"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="6"
                  strokeDasharray="9,5"
                  strokeLinecap="round"
                  opacity="0.95"
                >
                  <animate attributeName="stroke-dashoffset" values="56;0" dur="2.2s" repeatCount="indefinite" />
                </path>
                {/* Traveling Beacons to Caribbean/North America */}
                <circle r="5" fill="#fed7aa" stroke="#b85c38" strokeWidth="2">
                  <animateMotion path="M 200,600 L 90,625 C 10,540 -50,470 -150,420" dur="3.4s" repeatCount="indefinite" />
                </circle>

                {/* 3. COASTAL CONNECTION STREAM: BETWEEN NIGERIA AND SENEGAL */}
                <path
                  d="M 438,538 C 350,560 260,535 200,475 C 170,430 150,370 148,327"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="5.5"
                  strokeDasharray="11,6"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="68;0" dur="2.4s" repeatCount="indefinite" />
                </path>
                {/* Traveling Beacon along Nigeria-Senegal Vector */}
                <circle r="5" fill="#fef08a" stroke="#b85c38" strokeWidth="2">
                  <animateMotion path="M 438,538 C 350,560 260,535 200,475 C 170,430 150,370 148,327" dur="3.5s" repeatCount="indefinite" />
                </circle>

                {/* 4. COASTAL CONNECTION STREAM: BETWEEN ANGOLA AND CAMEROON */}
                <path
                  d="M 492,665 C 475,615 465,585 462,558"
                  fill="none"
                  stroke="url(#prominentStreamGrad)"
                  strokeWidth="5.5"
                  strokeDasharray="10,5"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="60;0" dur="1.8s" repeatCount="indefinite" />
                </path>
                {/* Traveling Beacon along Angola-Cameroon Vector */}
                <circle r="5" fill="#fef08a" stroke="#b85c38" strokeWidth="2">
                  <animateMotion path="M 492,665 C 475,615 465,585 462,558" dur="2.2s" repeatCount="indefinite" />
                </circle>

                {/* 5. MOZAMBIQUE AND MADAGASCAR ANCHORED & CONNECTED STREAM (Extends into South Atlantic) */}
                {/* Madagascar (850, 780) -> Mozambique (725, 785) -> Southern Cape (470, 960) -> South Atlantic (-140, 840) */}
                <path
                  d="M 850,780 C 790,800 760,795 725,785 C 640,935 540,965 470,960 C 300,940 120,880 -140,840"
                  fill="none"
                  stroke="url(#mozambiqueStreamGrad)"
                  strokeWidth="6"
                  strokeDasharray="11,6"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="80;0" dur="3.8s" repeatCount="indefinite" />
                </path>
                {/* Madagascar & Mozambique Traveling Photons */}
                <circle r="5.5" fill="#fef08a" stroke="#c45d3e" strokeWidth="2">
                  <animateMotion path="M 850,780 C 790,800 760,795 725,785 C 640,935 540,965 470,960 C 300,940 120,880 -140,840" dur="5.5s" repeatCount="indefinite" />
                </circle>

                {/* 6. EXPANDING BOLD RADAR PULSES, ANCHOR NODES & HIGH-CONTRAST LABELS */}
                {/* Cabo Verde (83, 318) */}
                <circle cx="83" cy="318" r="18" fill="none" stroke="#c4895c" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="7;26" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="83" cy="318" r="8.5" fill="#c4895c" stroke="#ffffff" strokeWidth="2.5" />
                <text x="96" y="314" fill="#1c1917" fontSize="16" fontWeight="800" fontFamily="sans-serif">
                  Cabo Verde
                </text>

                {/* Gorée / Senegal (148, 327) */}
                <circle cx="148" cy="327" r="20" fill="none" stroke="#b87446" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;28" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="148" cy="327" r="9.5" fill="#b87446" stroke="#ffffff" strokeWidth="2.5" />
                <text x="162" y="322" fill="#1c1917" fontSize="17" fontWeight="800" fontFamily="sans-serif">
                  Gorée (Senegal)
                </text>

                {/* Elmina / Ghana (304, 528) & Ouidah / Benin (353, 519) */}
                <circle cx="304" cy="528" r="20" fill="none" stroke="#9e4c56" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;28" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="304" cy="528" r="9.5" fill="#9e4c56" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="353" cy="519" r="8.5" fill="#b85c38" stroke="#ffffff" strokeWidth="2.5" />
                <text x="210" y="560" fill="#1c1917" fontSize="16" fontWeight="800" fontFamily="sans-serif">
                  Elmina & Ouidah
                </text>

                {/* Bonny / Calabar (Nigeria) (438, 538) */}
                <circle cx="438" cy="538" r="20" fill="none" stroke="#b87446" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;28" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="438" cy="538" r="9.5" fill="#b87446" stroke="#ffffff" strokeWidth="2.5" />
                <text x="452" y="534" fill="#1c1917" fontSize="16" fontWeight="800" fontFamily="sans-serif">
                  Nigeria (Biafra)
                </text>

                {/* Cameroon / Bimbia (462, 558) */}
                <circle cx="462" cy="558" r="18" fill="none" stroke="#e07a5f" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="7;24" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="462" cy="558" r="8.5" fill="#e07a5f" stroke="#ffffff" strokeWidth="2.5" />
                <text x="478" y="565" fill="#1c1917" fontSize="16" fontWeight="800" fontFamily="sans-serif">
                  Cameroon
                </text>

                {/* Luanda (Angola) (492, 665) */}
                <circle cx="492" cy="665" r="20" fill="none" stroke="#c4895c" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;28" dur="2.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.6s" repeatCount="indefinite" />
                </circle>
                <circle cx="492" cy="665" r="9.5" fill="#c4895c" stroke="#ffffff" strokeWidth="2.5" />
                <text x="510" y="670" fill="#1c1917" fontSize="17" fontWeight="800" fontFamily="sans-serif">
                  Angola (Luanda)
                </text>

                {/* Mozambique Node (725, 785) */}
                <circle cx="725" cy="785" r="20" fill="none" stroke="#c45d3e" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;28" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="725" cy="785" r="9.5" fill="#c45d3e" stroke="#ffffff" strokeWidth="2.5" />
                <text x="610" y="785" fill="#1c1917" fontSize="17" fontWeight="800" fontFamily="sans-serif">
                  Mozambique
                </text>

                {/* Madagascar Node (850, 780) */}
                <circle cx="850" cy="780" r="20" fill="none" stroke="#c45d3e" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;28" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="850" cy="780" r="9.5" fill="#c45d3e" stroke="#ffffff" strokeWidth="2.5" />
                <text x="868" y="795" fill="#1c1917" fontSize="17" fontWeight="800" fontFamily="sans-serif">
                  Madagascar
                </text>
              </g>
            )}

            {/* ========================================================================= */}
            {/* THEME 2: AFCFTA MULTILATERAL CORRIDORS (2X THICKER ON CONTINENT)          */}
            {/* ========================================================================= */}
            {theme === 'economy' && (
              <g className="animate-in fade-in duration-500">
                {/* 2x Thicker Multilateral High-Contrast UN Geoscheme Trade Arteries */}
                {/* Lagos (Western Africa #059669) <-> Nairobi (Eastern Africa #d97706) <-> Cairo (Northern Africa #2563eb) */}
                <path
                  d="M 369,521 L 730,620 L 600,180 Z"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="8"
                  strokeDasharray="14,8"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="88;0" dur="2.8s" repeatCount="indefinite" />
                </path>
                {/* Glowing Inner Core */}
                <path
                  d="M 369,521 L 730,620 L 600,180 Z"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="3.5"
                  strokeDasharray="8,14"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="88;0" dur="2.2s" repeatCount="indefinite" />
                </path>

                {/* Nairobi (Eastern Africa #d97706) <-> Johannesburg (Southern Africa #dc2626) <-> Lagos (#059669) */}
                <path
                  d="M 730,620 L 580,890 L 369,521"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="8"
                  strokeDasharray="14,8"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="88;0" dur="2.8s" repeatCount="indefinite" />
                </path>
                {/* Glowing Inner Core */}
                <path
                  d="M 730,620 L 580,890 L 369,521"
                  fill="none"
                  stroke="#6ee7b7"
                  strokeWidth="3.5"
                  strokeDasharray="8,14"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="88;0" dur="2.2s" repeatCount="indefinite" />
                </path>

                {/* Traveling Energy Photons along Trade Corridors */}
                <circle r="6" fill="#fef08a" stroke="#047857" strokeWidth="2.5">
                  <animateMotion path="M 369,521 L 730,620 L 600,180 Z" dur="4.2s" repeatCount="indefinite" />
                </circle>
                <circle r="6" fill="#fde68a" stroke="#b45309" strokeWidth="2.5">
                  <animateMotion path="M 730,620 L 580,890 L 369,521" dur="4.2s" repeatCount="indefinite" />
                </circle>

                {/* Economic Hub Beacons & Radar Pulses (Increased size & contrast) */}
                {/* Lagos (Western Africa UN Green) */}
                <circle cx="369" cy="521" r="22" fill="none" stroke="#059669" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;30" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="369" cy="521" r="10" fill="#059669" stroke="#ffffff" strokeWidth="3" />
                <text x="385" y="526" fill="#0f172a" fontSize="18" fontWeight="800" fontFamily="sans-serif">
                  Lagos Hub
                </text>

                {/* Nairobi (Eastern Africa UN Amber) */}
                <circle cx="730" cy="620" r="22" fill="none" stroke="#d97706" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;30" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="730" cy="620" r="10" fill="#d97706" stroke="#ffffff" strokeWidth="3" />
                <text x="748" y="626" fill="#0f172a" fontSize="18" fontWeight="800" fontFamily="sans-serif">
                  Nairobi Hub
                </text>

                {/* Cairo (Northern Africa UN Blue) */}
                <circle cx="600" cy="180" r="22" fill="none" stroke="#2563eb" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;30" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="600" cy="180" r="10" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
                <text x="618" y="186" fill="#0f172a" fontSize="18" fontWeight="800" fontFamily="sans-serif">
                  Cairo Hub
                </text>

                {/* Johannesburg (Southern Africa UN Terracotta Red) */}
                <circle cx="580" cy="890" r="22" fill="none" stroke="#dc2626" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;30" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="580" cy="890" r="10" fill="#dc2626" stroke="#ffffff" strokeWidth="3" />
                <text x="598" y="896" fill="#0f172a" fontSize="18" fontWeight="800" fontFamily="sans-serif">
                  Johannesburg
                </text>
              </g>
            )}

            {/* ========================================================================= */}
            {/* THEME 3: PAN-AFRICAN INNOVATION & DEMOGRAPHIC GRID                        */}
            {/* ========================================================================= */}
            {theme === 'future' && (
              <g className="animate-in fade-in duration-500">
                {/* 2x Thicker 4IR Innovation Network Arches across UN Geoschemes */}
                {/* Yaba/Lagos (#059669) -> Kigali Tech (#7c3aed) */}
                <path
                  d="M 369,521 Q 520,545 680,625"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="8"
                  strokeDasharray="14,8"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="88;0" dur="2.2s" repeatCount="indefinite" />
                </path>
                {/* Glowing Core */}
                <path
                  d="M 369,521 Q 520,545 680,625"
                  fill="none"
                  stroke="#c4b5fd"
                  strokeWidth="3.5"
                  strokeDasharray="8,14"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="88;0" dur="1.8s" repeatCount="indefinite" />
                </path>

                {/* Kigali Tech (#7c3aed) -> Cape Tech Hub (#e11d48) */}
                <path
                  d="M 680,625 Q 635,795 550,940"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="8"
                  strokeDasharray="14,8"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="88;0" dur="2.4s" repeatCount="indefinite" />
                </path>
                {/* Glowing Core */}
                <path
                  d="M 680,625 Q 635,795 550,940"
                  fill="none"
                  stroke="#fecdd3"
                  strokeWidth="3.5"
                  strokeDasharray="8,14"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="88;0" dur="2s" repeatCount="indefinite" />
                </path>

                {/* Yaba/Lagos (#059669) -> Cairo AI (#2563eb) */}
                <path
                  d="M 369,521 Q 480,320 600,180"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="8"
                  strokeDasharray="14,8"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="88;0" dur="2.2s" repeatCount="indefinite" />
                </path>
                {/* Glowing Core */}
                <path
                  d="M 369,521 Q 480,320 600,180"
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="3.5"
                  strokeDasharray="8,14"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" values="88;0" dur="1.8s" repeatCount="indefinite" />
                </path>

                {/* Traveling High-Speed Data Packets */}
                <circle r="5.5" fill="#fef08a" stroke="#7c3aed" strokeWidth="2.5">
                  <animateMotion path="M 369,521 Q 520,545 680,625" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r="5.5" fill="#fef08a" stroke="#e11d48" strokeWidth="2.5">
                  <animateMotion path="M 680,625 Q 635,795 550,940" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle r="5.5" fill="#fef08a" stroke="#2563eb" strokeWidth="2.5">
                  <animateMotion path="M 369,521 Q 480,320 600,180" dur="2.2s" repeatCount="indefinite" />
                </circle>

                {/* Innovation Nodes & Pulsing Waves (Increased size & contrast) */}
                {/* Kigali Tech (Central/Eastern UN Purple/Violet) */}
                <circle cx="680" cy="625" r="22" fill="none" stroke="#7c3aed" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;30" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="680" cy="625" r="10" fill="#7c3aed" stroke="#ffffff" strokeWidth="3" />
                <text x="698" y="622" fill="#0f172a" fontSize="18" fontWeight="800" fontFamily="sans-serif">
                  Kigali Tech
                </text>

                {/* Yaba FinTech (Western UN Green) */}
                <circle cx="369" cy="521" r="22" fill="none" stroke="#059669" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;30" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="369" cy="521" r="10" fill="#059669" stroke="#ffffff" strokeWidth="3" />
                <text x="260" y="515" fill="#0f172a" fontSize="18" fontWeight="800" fontFamily="sans-serif">
                  Yaba FinTech
                </text>

                {/* Cape Tech Hub (Southern UN Crimson) */}
                <circle cx="550" cy="940" r="22" fill="none" stroke="#e11d48" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;30" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="550" cy="940" r="10" fill="#e11d48" stroke="#ffffff" strokeWidth="3" />
                <text x="420" y="965" fill="#0f172a" fontSize="18" fontWeight="800" fontFamily="sans-serif">
                  Cape Tech Hub
                </text>

                {/* Cairo AI Hub (Northern UN Blue) */}
                <circle cx="600" cy="180" r="22" fill="none" stroke="#2563eb" strokeWidth="2.5" opacity="0.85">
                  <animate attributeName="r" values="8;30" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.95;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="600" cy="180" r="10" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
                <text x="618" y="186" fill="#0f172a" fontSize="18" fontWeight="800" fontFamily="sans-serif">
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

