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
  ShieldCheck,
  Activity,
  Rocket
} from 'lucide-react';

interface OnboardingContinentVisualizerProps {
  theme: 'history' | 'economy' | 'future';
  className?: string;
}

export const OnboardingContinentVisualizer: React.FC<OnboardingContinentVisualizerProps> = ({
  theme,
  className = ''
}) => {
  return (
    <div className={`relative w-full rounded-3xl bg-[#021f16]/95 border-2 border-[#059669]/60 shadow-2xl p-4 sm:p-6 overflow-hidden flex flex-col items-center justify-between gap-4 sm:gap-5 ${className}`}>
      {/* 1. Atmospheric Grid & Tonal Underglow Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#34d399_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {theme === 'history' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ea580c]/25 via-[#451a03]/20 to-[#d97706]/20 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-[#ea580c]/25 blur-[100px] pointer-events-none" />
        </>
      )}
      {theme === 'economy' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#059669]/25 via-[#022c22]/20 to-[#10b981]/20 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-[#059669]/25 blur-[100px] pointer-events-none" />
        </>
      )}
      {theme === 'future' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#6366f1]/25 via-[#1e1b4b]/20 to-[#059669]/20 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-[#6366f1]/25 blur-[100px] pointer-events-none" />
        </>
      )}

      {/* 2. Top Header Status & Active Projection Indicator */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34d399]" />
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#a7f3d0]">
            {theme === 'history' && 'TAST Archival Vector Stream'}
            {theme === 'economy' && 'AfCFTA Multilateral Corridor Network'}
            {theme === 'future' && 'Pan-African Innovation & Demographic Grid'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#fde68a] bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
          <Layers className="w-3.5 h-3.5 text-[#fbbf24]" />
          <span>Vector Projection • 54 Sovereign Nations</span>
        </div>
      </div>

      {/* 3. Main Stage: Spacious Side Panels (lg:col-span-5) + Prominent Tall Map (lg:col-span-7) */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
        
        {/* Left Side: Generous, Spacious Rich Info Panels (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-3.5 order-2 lg:order-1">
          {theme === 'history' && (
            <>
              {/* Card 1 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#431407]/85 border border-[#ea580c]/50 shadow-lg backdrop-blur-md transition-all hover:border-[#ea580c]/80">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 text-[#fcd34d] font-bold text-xs sm:text-sm">
                    <Anchor className="w-4 h-4 text-[#fb923c] flex-shrink-0" />
                    <span>Archival Voyage Logs</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ea580c]/30 text-[#fed7aa] border border-[#ea580c]/40 font-semibold">
                    36,000+ Expeditions
                  </span>
                </div>
                <p className="text-xs text-[#ffedd5] leading-relaxed font-light">
                  Transatlantic Slave Trade database indexed from Harvard Du Bois Institute & Emory University primary maritime manifests.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#431407]/85 border border-[#ea580c]/50 shadow-lg backdrop-blur-md transition-all hover:border-[#ea580c]/80">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 text-[#fcd34d] font-bold text-xs sm:text-sm">
                    <Dna className="w-4 h-4 text-[#fcd34d] flex-shrink-0" />
                    <span>Lineages & Ethnolinguistics</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ea580c]/30 text-[#fed7aa] border border-[#ea580c]/40 font-semibold">
                    DNA Markers
                  </span>
                </div>
                <p className="text-xs text-[#ffedd5] leading-relaxed font-light">
                  Mitochondrial lineages and ethno-linguistic connections spanning Senegambia, Bight of Biafra, Gold Coast, and Angola.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#431407]/85 border border-[#ea580c]/50 shadow-lg backdrop-blur-md transition-all hover:border-[#ea580c]/80">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 text-[#fcd34d] font-bold text-xs sm:text-sm">
                    <Globe2 className="w-4 h-4 text-[#fcd34d] flex-shrink-0" />
                    <span>Diaspora Cultural Arc</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ea580c]/30 text-[#fed7aa] border border-[#ea580c]/40 font-semibold">
                    Global Bridges
                  </span>
                </div>
                <p className="text-xs text-[#ffedd5] leading-relaxed font-light">
                  Continuous cultural, musical, and economic bridges connecting Africa with the Caribbean, South America, and North America.
                </p>
              </div>
            </>
          )}

          {theme === 'economy' && (
            <>
              {/* Card 1 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#022c22]/85 border border-[#059669]/50 shadow-lg backdrop-blur-md transition-all hover:border-[#059669]/80">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 text-[#34d399] font-bold text-xs sm:text-sm">
                    <TrendingUp className="w-4 h-4 text-[#34d399] flex-shrink-0" />
                    <span>AfCFTA Single Market</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#059669]/30 text-[#a7f3d0] border border-[#059669]/40 font-semibold">
                    $3.4T GDP
                  </span>
                </div>
                <p className="text-xs text-[#d1fae5] leading-relaxed font-light">
                  World's largest free trade zone unifying 54 nations, removing 90% of tariffs for 1.4 billion people.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#022c22]/85 border border-[#059669]/50 shadow-lg backdrop-blur-md transition-all hover:border-[#059669]/80">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 text-[#34d399] font-bold text-xs sm:text-sm">
                    <Zap className="w-4 h-4 text-[#5eead4] flex-shrink-0" />
                    <span>Power Interconnectors</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#059669]/30 text-[#a7f3d0] border border-[#059669]/40 font-semibold">
                    WAPP • EAPP • SAPP
                  </span>
                </div>
                <p className="text-xs text-[#d1fae5] leading-relaxed font-light">
                  Synchronized clean cross-border power grids harmonizing hydroelectric and solar transmission across regions.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#022c22]/85 border border-[#059669]/50 shadow-lg backdrop-blur-md transition-all hover:border-[#059669]/80">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 text-[#34d399] font-bold text-xs sm:text-sm">
                    <Layers className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                    <span>PAPSS Settlement Rails</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#059669]/30 text-[#a7f3d0] border border-[#059669]/40 font-semibold">
                    Instant Clearing
                  </span>
                </div>
                <p className="text-xs text-[#d1fae5] leading-relaxed font-light">
                  Real-time local currency payment system eliminating foreign exchange friction across Trans-Sahelian trade corridors.
                </p>
              </div>
            </>
          )}

          {theme === 'future' && (
            <>
              {/* Card 1 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1e1b4b]/85 border border-[#6366f1]/50 shadow-lg backdrop-blur-md transition-all hover:border-[#6366f1]/80">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 text-[#c7d2fe] font-bold text-xs sm:text-sm">
                    <Rocket className="w-4 h-4 text-[#818cf8] flex-shrink-0" />
                    <span>Demographic Dividend</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#6366f1]/30 text-[#c7d2fe] border border-[#6366f1]/40 font-semibold">
                    Median Age 19.7
                  </span>
                </div>
                <p className="text-xs text-[#e0e7ff] leading-relaxed font-light">
                  World's youngest digital-first population, projected to comprise 1 in every 4 people on Earth by 2050.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1e1b4b]/85 border border-[#6366f1]/50 shadow-lg backdrop-blur-md transition-all hover:border-[#6366f1]/80">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 text-[#c7d2fe] font-bold text-xs sm:text-sm">
                    <Cpu className="w-4 h-4 text-[#34d399] flex-shrink-0" />
                    <span>Silicon Savannah & 4IR</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#6366f1]/30 text-[#c7d2fe] border border-[#6366f1]/40 font-semibold">
                    5 Tech Megahubs
                  </span>
                </div>
                <p className="text-xs text-[#e0e7ff] leading-relaxed font-light">
                  High-growth innovation nodes in Lagos, Nairobi, Kigali, Cairo, and Cape Town driving global FinTech and AI.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1e1b4b]/85 border border-[#6366f1]/50 shadow-lg backdrop-blur-md transition-all hover:border-[#6366f1]/80">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 text-[#c7d2fe] font-bold text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                    <span>Green Minerals & Energy</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#6366f1]/30 text-[#c7d2fe] border border-[#6366f1]/40 font-semibold">
                    AU Agenda 2063
                  </span>
                </div>
                <p className="text-xs text-[#e0e7ff] leading-relaxed font-light">
                  World leadership in cobalt, lithium, and solar potential anchoring global green industrial transitions.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right Side: Prominent, Uncropped, Tall Animated Continent Stage (7 Columns) */}
        <div className="lg:col-span-7 relative flex items-center justify-center h-[340px] sm:h-[400px] md:h-[450px] lg:h-[480px] xl:h-[500px] w-full order-1 lg:order-2">
          <AfricaUnLogo
            className="w-full h-full max-h-full drop-shadow-[0_16px_40px_rgba(0,0,0,0.85)] select-none transition-all duration-700"
            interactive={false}
            glow={true}
            viewBox="0 0 1000 1040"
            strokeColor={theme === 'history' ? '#fde68a' : theme === 'economy' ? '#a7f3d0' : '#c7d2fe'}
            strokeWidth={1.1}
            highlightedRegions={
              theme === 'history' 
                ? ['Western Africa', 'Central Africa'] 
                : ['Western Africa', 'Eastern Africa', 'Northern Africa', 'Southern Africa', 'Central Africa']
            }
            customColorMap={
              theme === 'history'
                ? {
                    'Western Africa': '#ea580c',
                    'Central Africa': '#d97706',
                    'Northern Africa': '#9a3412',
                    'Eastern Africa': '#78350f',
                    'Southern Africa': '#451a03'
                  }
                : theme === 'economy'
                ? {
                    'Northern Africa': '#0284c7',
                    'Western Africa': '#059669',
                    'Central Africa': '#0d9488',
                    'Eastern Africa': '#d97706',
                    'Southern Africa': '#e11d48'
                  }
                : {
                    'Northern Africa': '#4f46e5',
                    'Western Africa': '#059669',
                    'Central Africa': '#6366f1',
                    'Eastern Africa': '#10b981',
                    'Southern Africa': '#7c3aed'
                  }
            }
          >
            {/* Overlay Gradients & Filters */}
            <defs>
              <linearGradient id="overlayTradeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>

              <linearGradient id="overlayDiasporaGrad" x1="100%" y1="50%" x2="0%" y2="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.95" />
              </linearGradient>

              <filter id="vectorGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* ========================================================= */}
            {/* THEME 1: HISTORY & DIASPORA ARCHIVE OVERLAYS              */}
            {/* ========================================================= */}
            {theme === 'history' && (
              <g>
                {/* Gorée (Senegal) */}
                <circle cx="110" cy="385" r="9" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
                <text x="125" y="380" fill="#fde68a" fontSize="19" fontWeight="bold" fontFamily="sans-serif">
                  Gorée
                </text>

                {/* Elmina & Cape Coast (Ghana) */}
                <circle cx="285" cy="530" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
                <text x="210" y="560" fill="#fde68a" fontSize="19" fontWeight="bold" fontFamily="sans-serif">
                  Elmina & Ouidah
                </text>

                {/* Bonny & Calabar (Bight of Biafra, Nigeria) */}
                <circle cx="420" cy="530" r="9" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
                <text x="435" y="535" fill="#fde68a" fontSize="19" fontWeight="bold" fontFamily="sans-serif">
                  Bonny / Calabar
                </text>

                {/* Luanda (Angola) */}
                <circle cx="475" cy="650" r="9" fill="#f97316" stroke="#ffffff" strokeWidth="2.5" />
                <text x="495" y="660" fill="#fde68a" fontSize="19" fontWeight="bold" fontFamily="sans-serif">
                  Luanda
                </text>

                {/* Animated Transatlantic Trajectories radiating westward */}
                {/* Path from Luanda to South America (Brazil) */}
                <path
                  d="M 475,650 Q 220,740 40,690"
                  fill="none"
                  stroke="url(#overlayDiasporaGrad)"
                  strokeWidth="5"
                  strokeDasharray="10,6"
                >
                  <animate attributeName="stroke-dashoffset" values="64;0" dur="2.2s" repeatCount="indefinite" />
                </path>

                {/* Path from Elmina to Caribbean Basin */}
                <path
                  d="M 285,530 Q 120,460 30,470"
                  fill="none"
                  stroke="url(#overlayDiasporaGrad)"
                  strokeWidth="5"
                  strokeDasharray="10,6"
                >
                  <animate attributeName="stroke-dashoffset" values="64;0" dur="2.6s" repeatCount="indefinite" />
                </path>

                {/* Path from Gorée to North America */}
                <path
                  d="M 110,385 Q 45,290 25,250"
                  fill="none"
                  stroke="url(#overlayDiasporaGrad)"
                  strokeWidth="5"
                  strokeDasharray="10,6"
                >
                  <animate attributeName="stroke-dashoffset" values="64;0" dur="3s" repeatCount="indefinite" />
                </path>

                {/* Moving Photons on Trajectories */}
                <circle r="7" fill="#fde68a" filter="url(#vectorGlow)">
                  <animateMotion
                    path="M 475,650 Q 220,740 40,690"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="7" fill="#38bdf8" filter="url(#vectorGlow)">
                  <animateMotion
                    path="M 285,530 Q 120,460 30,470"
                    dur="2.8s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="7" fill="#fb7185" filter="url(#vectorGlow)">
                  <animateMotion
                    path="M 110,385 Q 45,290 25,250"
                    dur="3.1s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            )}

            {/* ========================================================= */}
            {/* THEME 2: SOCIOECONOMIC INTEGRATION & AfCFTA CORRIDORS     */}
            {/* ========================================================= */}
            {theme === 'economy' && (
              <g>
                {/* Cairo */}
                <circle cx="650" cy="190" r="10" fill="#34d399" stroke="#ffffff" strokeWidth="2.5" />
                <text x="670" y="195" fill="#f0fdf4" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Cairo</text>

                {/* Dakar */}
                <circle cx="110" cy="385" r="10" fill="#34d399" stroke="#ffffff" strokeWidth="2.5" />
                <text x="125" y="380" fill="#f0fdf4" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Dakar</text>

                {/* Lagos */}
                <circle cx="370" cy="490" r="11" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" />
                <text x="385" y="480" fill="#fde68a" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Lagos</text>

                {/* Addis Ababa */}
                <circle cx="790" cy="495" r="10" fill="#34d399" stroke="#ffffff" strokeWidth="2.5" />
                <text x="810" y="500" fill="#f0fdf4" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Addis</text>

                {/* Nairobi */}
                <circle cx="760" cy="590" r="10" fill="#34d399" stroke="#ffffff" strokeWidth="2.5" />
                <text x="780" y="595" fill="#f0fdf4" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Nairobi</text>

                {/* Johannesburg */}
                <circle cx="630" cy="890" r="11" fill="#34d399" stroke="#ffffff" strokeWidth="3" />
                <text x="650" y="895" fill="#f0fdf4" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Joburg</text>

                {/* Trans-African Corridors */}
                {/* Dakar - Lagos - Addis (Trans-Sahelian Corridor) */}
                <path
                  d="M 110,385 L 370,490 L 790,495"
                  fill="none"
                  stroke="url(#overlayTradeGrad)"
                  strokeWidth="5"
                  strokeDasharray="12,6"
                >
                  <animate attributeName="stroke-dashoffset" values="72;0" dur="2s" repeatCount="indefinite" />
                </path>

                {/* Cairo - Nairobi - Joburg (North-South Corridor) */}
                <path
                  d="M 650,190 L 760,590 L 630,890"
                  fill="none"
                  stroke="#5eead4"
                  strokeWidth="4.5"
                  strokeDasharray="12,6"
                >
                  <animate attributeName="stroke-dashoffset" values="72;0" dur="2.4s" repeatCount="indefinite" />
                </path>

                {/* Active Moving Trade Pulse Photons */}
                <circle r="8" fill="#fde68a" filter="url(#vectorGlow)">
                  <animateMotion
                    path="M 110,385 L 370,490 L 790,495"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="8" fill="#34d399" filter="url(#vectorGlow)">
                  <animateMotion
                    path="M 650,190 L 760,590 L 630,890"
                    dur="3.2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            )}

            {/* ========================================================= */}
            {/* THEME 3: THE HORIZON - TECH HUBS & DEMOGRAPHIC HORIZON    */}
            {/* ========================================================= */}
            {theme === 'future' && (
              <g>
                {/* Lagos - Fintech & Creative */}
                <circle cx="370" cy="490" r="28" fill="none" stroke="#6366f1" strokeWidth="2.5" opacity="0.8">
                  <animate attributeName="r" values="10;42" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="370" cy="490" r="11" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" />
                <text x="390" y="485" fill="#fde68a" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Lagos Hub</text>

                {/* Nairobi - Silicon Savannah */}
                <circle cx="760" cy="590" r="28" fill="none" stroke="#10b981" strokeWidth="2.5" opacity="0.8">
                  <animate attributeName="r" values="10;40" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="760" cy="590" r="11" fill="#10b981" stroke="#ffffff" strokeWidth="3" />
                <text x="780" y="595" fill="#6ee7b7" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Silicon Savannah</text>

                {/* Kigali - Center for 4IR */}
                <circle cx="675" cy="615" r="9" fill="#a5b4fc" stroke="#ffffff" strokeWidth="2.5" />
                <text x="610" y="635" fill="#c7d2fe" fontSize="18" fontWeight="bold" fontFamily="sans-serif">Kigali</text>

                {/* Cairo - AI & Cloud */}
                <circle cx="650" cy="190" r="10" fill="#818cf8" stroke="#ffffff" strokeWidth="2.5" />
                <text x="670" y="195" fill="#e0e7ff" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Cairo</text>

                {/* Cape Town - DeepTech */}
                <circle cx="480" cy="980" r="10" fill="#ec4899" stroke="#ffffff" strokeWidth="2.5" />
                <text x="500" y="985" fill="#fbcfe8" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Cape Town</text>

                {/* Casablanca - Renewable Logistics */}
                <circle cx="240" cy="140" r="9" fill="#38bdf8" stroke="#ffffff" strokeWidth="2.5" />
                <text x="255" y="145" fill="#bae6fd" fontSize="18" fontWeight="bold" fontFamily="sans-serif">Casablanca</text>

                {/* Innovation Mesh Constellation */}
                <path
                  d="M 370,490 L 675,615 L 760,590 L 650,190 L 240,140 L 370,490 L 480,980 L 760,590"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="3.5"
                  strokeDasharray="8,8"
                  opacity="0.8"
                >
                  <animate attributeName="stroke-dashoffset" values="64;0" dur="2.5s" repeatCount="indefinite" />
                </path>
              </g>
            )}
          </AfricaUnLogo>
        </div>
      </div>

      {/* 4. Bottom Rich Intelligence Verification Banner */}
      <div className="relative z-10 w-full pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-[#d1fae5]">
          <ShieldCheck className="w-4 h-4 text-[#34d399] flex-shrink-0" />
          <span className="font-medium text-[11px] sm:text-xs">
            {theme === 'history' && 'Primary Source Verification: Emory TAST Database & Du Bois Institute'}
            {theme === 'economy' && 'Multilateral Data Harmonization: World Bank WDI, IMF & AfCFTA Secretariat'}
            {theme === 'future' && 'Demographic & Growth Projections: UN DESA, African Union & AfDB Outlook'}
          </span>
        </div>

        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/40 border border-white/15 text-[#a7f3d0]">
          Cartographic Projection: UN M49 Geoscheme
        </span>
      </div>
    </div>
  );
};
