import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Map as MapIcon, 
  Database, 
  ShieldCheck, 
  BookOpen, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Download, 
  Layers, 
  Compass, 
  Sliders, 
  Volume2, 
  Globe2, 
  Maximize2,
  Lock,
  Code2,
  Award
} from 'lucide-react';
import { CanonicalNavTab } from '../components/NavigationDrawer';
import { AfricaUnLogo } from '../components/AfricaUnLogo';
import { OrganizationLogo } from '../components/OrganizationLogo';
import { UN_M49_REGIONAL_PALETTES } from '../data/unGeoschemeColors';

interface UniversalStyleGuideViewProps {
  onNavigateTab: (tab: CanonicalNavTab) => void;
}

type GuideTab = 'identity' | 'design-system' | 'cartography' | 'assets' | 'multilateral-apis' | 'ethics-governance';

export const UniversalStyleGuideView: React.FC<UniversalStyleGuideViewProps> = ({ onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState<GuideTab>('identity');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const navTabs: { id: GuideTab; label: string; icon: React.ReactNode }[] = [
    { id: 'identity', label: '1. Identity & Charter', icon: <Award className="w-4 h-4" /> },
    { id: 'design-system', label: '2. Japandi Design System', icon: <Palette className="w-4 h-4" /> },
    { id: 'cartography', label: '3. Cartography & Geodesy', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'assets', label: '4. Asset & Seal Registry', icon: <Layers className="w-4 h-4" /> },
    { id: 'multilateral-apis', label: '5. 16 Multilateral APIs', icon: <Database className="w-4 h-4" /> },
    { id: 'ethics-governance', label: '6. Governance & Citations', icon: <ShieldCheck className="w-4 h-4" /> }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header Masthead */}
      <div className="rounded-3xl p-6 sm:p-10 border border-stone-200/90 dark:border-stone-800/90 bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5EFE6] dark:from-stone-950 dark:via-stone-900 dark:to-[#1A1816] shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Africalia Architectural Monograph & Design Constitution</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 font-serif">
              Universal Style Guide & Living Systems Matrix
            </h1>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
              An authoritative architectural manual unifying cartographic coordinate standards, the Japandi-Sahel visual design system, the 16 multilateral API ingestion pipeline, and scholarly attribution frameworks curated by <strong className="text-stone-900 dark:text-stone-100 font-semibold">Zéluis F. Correia</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <a
              href="./docs/UNIVERSAL_STYLE_GUIDE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Read Markdown Monograph</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </div>

      {/* Segmented Top Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200 dark:border-stone-800">
        {navTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Showcase Panel */}
      <div className="space-y-8">
        {/* TAB 1: IDENTITY & LEGAL CHARTER */}
        {activeTab === 'identity' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mission Statement */}
              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">Institutional Mandate</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Pan-African Sovereign Data Good</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  The Africa Data Atlas exists to dismantle pan-African data asymmetries. By harmonizing 16 multilateral reporting bodies into an open, offline-resilient Progressive Web Application, Africalia provides planning ministries, university lecture halls, and global scholars with an unassailable evidentiary baseline.
                </p>
                <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400">
                  <strong className="text-stone-900 dark:text-stone-200">Editorial Voice:</strong> Rigorous, measured, and dignified. We reject techno-solutionist buzzwords in favor of empirical historiography and econometric precision.
                </div>
              </div>

              {/* Legal Copyright Declaration */}
              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">Vector Topology Copyright</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400">Berne Convention & International Treaties</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                    PROTECTED
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-700 dark:text-stone-300 space-y-2">
                  <p className="font-bold text-rose-800 dark:text-rose-300">
                    Cartography & Phylogenetic Vector Topology © 2024–2026 Africalia. Authored and engineered by Zéluis F. Correia.
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
                    All original SVG geometries, Admin-1 boundary topologies (1,017 subdivisions), and the Ethnic Tree of Life are protected. Non-commercial scholarly citation and classroom use is permitted with explicit attribution.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-stone-500">Required Citation Form:</span>
                  <button
                    onClick={() => handleCopy('Cartographic visualization courtesy of Africalia / Zéluis F. Correia (Africa Data Atlas, 2026).', 'legal-cite')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {copiedKey === 'legal-cite' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'legal-cite' ? 'Copied' : 'Copy Attribution'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JAPANDI DESIGN SYSTEM */}
        {activeTab === 'design-system' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-500" />
                <span>UN M49 Macro-Geoscheme Authoritative Regional Palette</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                To preserve geopolitical neutrality and eliminate projection bias, the five UN M49 macro-regions are strictly mapped to distinct, calm regional hues:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {Object.entries(UN_M49_REGIONAL_PALETTES).map(([region, palette]) => (
                  <div key={region} className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2.5 bg-stone-50/50 dark:bg-stone-950/50">
                    <div className="w-full h-12 rounded-xl shadow-inner flex items-center justify-center" style={{ backgroundColor: palette.warmAccent }}>
                      <span className="text-[11px] font-mono font-bold text-white drop-shadow-sm">{palette.warmAccent}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{region}</h4>
                      <p className="text-[10px] text-stone-500 font-mono truncate">{palette.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography & Density Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">Typographic Polyphony</h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Display & Headings</span>
                    <p className="text-base font-extrabold tracking-tight text-stone-900 dark:text-stone-100 font-serif">
                      Plus Jakarta Sans & Syne
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Body Text & Historical Narratives</span>
                    <p className="text-xs font-normal text-stone-700 dark:text-stone-300 leading-relaxed">
                      Inter / Plus Jakarta Sans — Optimized for sustained reading on low-contrast screens.
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Econometric Series & Coordinates</span>
                    <p className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      JetBrains Mono / Fira Code • 5796 x 5867 px • $6,842 GDP
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">Density Adaptation Standards</h3>
                <div className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <div>
                      <strong className="block text-stone-900 dark:text-stone-100">Compact Density</strong>
                      <span className="text-[11px] text-stone-500">6px padding, 11px text for multi-monitor audits.</span>
                    </div>
                    <span className="font-mono text-[10px] bg-stone-200 dark:bg-stone-800 px-2 py-0.5 rounded">Workstation</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <div>
                      <strong className="block text-stone-900 dark:text-stone-100">Standard Density (Default)</strong>
                      <span className="text-[11px] text-stone-500">16px padding, balanced optical reading flow.</span>
                    </div>
                    <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">Default</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <div>
                      <strong className="block text-stone-900 dark:text-stone-100">Spacious Density</strong>
                      <span className="text-[11px] text-stone-500">24px padding, 48px min touch-targets for kiosks.</span>
                    </div>
                    <span className="font-mono text-[10px] bg-stone-200 dark:bg-stone-800 px-2 py-0.5 rounded">Touch/Tablet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CARTOGRAPHY & GEODESY */}
        {activeTab === 'cartography' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">ENGINE SPECIFICATION</span>
                <h4 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">5796 × 5867 Grid</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Cartesian bounding box calibrated directly from `public/africa-final.svg` preserving true spatial integrity and sub-pixel coastline curvatures across the Atlantic and Indian Oceans.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">SUB-NATIONAL TOPOLOGY</span>
                <h4 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">1,017 Admin-1 Borders</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Provincial, state, and county boundary paths dynamically rendered with hairline non-scaling strokes (0.4px to 1.2px) supporting sub-national data inspection.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">SCRUTINY ENGINE</span>
                <h4 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">Gesture Isolation</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Non-passive wheel interceptor (`passive: false`) and two-finger mobile Euclidean touch distance calculations eliminate page bouncing during deep plate inspection.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">Direct Navigation & Visualizers</h4>
                  <p className="text-xs text-stone-500">Explore live cartographic engines implemented across the platform</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => onNavigateTab('map')}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-amber-500 text-left transition-all cursor-pointer group"
                >
                  <MapIcon className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                  <strong className="block text-xs font-bold text-stone-900 dark:text-stone-100">Continental Vector Map</strong>
                  <span className="text-[11px] text-stone-500">Authentic SVG with 1,017 Admin-1 boundaries</span>
                </button>

                <button
                  onClick={() => onNavigateTab('archival-cartography')}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-cyan-500 text-left transition-all cursor-pointer group"
                >
                  <Compass className="w-5 h-5 text-cyan-500 mb-2 group-hover:scale-110 transition-transform" />
                  <strong className="block text-xs font-bold text-stone-900 dark:text-stone-100">Curtain & Ocean Winds</strong>
                  <span className="text-[11px] text-stone-500">Antique plate slider & 8 ocean currents</span>
                </button>

                <button
                  onClick={() => onNavigateTab('ethnic-tree')}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 text-left transition-all cursor-pointer group"
                >
                  <Sparkles className="w-5 h-5 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                  <strong className="block text-xs font-bold text-stone-900 dark:text-stone-100">Ethnic Tree of Life</strong>
                  <span className="text-[11px] text-stone-500">Phylogenetic deep-time lineages vector canvas</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ASSETS & SEALS REGISTRY */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Mathematical Pure Vector Emblems Catalog
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                All institutional marks are pure inline SVG elements rendered locally with zero network latency:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { code: 'WB', name: 'World Bank Group' },
                  { code: 'UN', name: 'United Nations' },
                  { code: 'UNESCO', name: 'UNESCO' },
                  { code: 'IMF', name: 'IMF' },
                  { code: 'AU', name: 'African Union' },
                  { code: 'AfDB', name: 'African Dev. Bank' },
                  { code: 'WHO', name: 'World Health Org' },
                  { code: 'FAO', name: 'FAO' },
                  { code: 'ECOWAS', name: 'ECOWAS' },
                  { code: 'EAC', name: 'East African Comm.' },
                  { code: 'SADC', name: 'SADC' },
                  { code: 'COMESA', name: 'COMESA' }
                ].map(item => (
                  <div key={item.code} className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 flex flex-col items-center text-center space-y-2">
                    <OrganizationLogo org={item.code} size={36} />
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{item.code}</span>
                    <span className="text-[10px] text-stone-500 truncate w-full">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">Archival Visual Collections</h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                The platform indexes <strong className="text-stone-900 dark:text-stone-100">1,252 high-resolution historical plates</strong>, including 1,220 documented visual records from the Middle Passage and 32 colonial <em>Pintura de Castas</em> series preserved at the <em>Museo Nacional del Virreinato</em>.
              </p>
              <button
                onClick={() => onNavigateTab('iconography')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Launch Archival Loupe Studio</span>
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: MULTILATERAL APIS */}
        {activeTab === 'multilateral-apis' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">16 Harmonized Multilateral Data Connectors</h3>
                  <p className="text-xs text-stone-500">Live API ingestion, fallback caches, and deterministic SHA-256 integrity audits</p>
                </div>
                <button
                  onClick={() => onNavigateTab('provenance')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Open Integrity Console
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {[
                  { name: 'World Bank WDI', category: 'Macro & Debt', records: '48 Indicators' },
                  { name: 'IMF WEO', category: 'Fiscal Outlook', records: '14 Series' },
                  { name: 'UN Comtrade', category: 'Bilateral Trade', records: '54 Trade Flows' },
                  { name: 'WHO Global Observatory', category: 'Health & Vital', records: '12 Metrics' },
                  { name: 'UNESCO UIS', category: 'Education Equity', records: '9 Metrics' },
                  { name: 'Freedom House FIW', category: 'Civil Liberties', records: 'Global Status' },
                  { name: 'World Bank WGI', category: 'Governance Index', records: '6 Dimensions' },
                  { name: 'Mo Ibrahim IIAG', category: 'Security & Rule', records: 'Continental Index' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-1">
                    <strong className="block text-stone-900 dark:text-stone-100 text-xs">{item.name}</strong>
                    <div className="flex justify-between text-[11px] text-stone-500">
                      <span>{item.category}</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{item.records}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: GOVERNANCE & CITATIONS */}
        {activeTab === 'ethics-governance' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Zero-Surveillance Standard & Academic Independence</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                Africalia adheres strictly to the EU General Data Protection Regulation (GDPR) and the African Union Malabo Convention on Personal Data Protection. We operate zero commercial advertising cookies, zero third-party tracking scripts, and zero speech-recording storage.
              </p>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">APA 7th Edition Citation</span>
                  <button
                    onClick={() => handleCopy('Correia, Z. F. (2026). Africa Data Atlas & Cartographic Observatory: Sovereign Geospatial Intelligence, Macroeconomic Indicators, and Historical Trade Flow Platform. Africalia Open Science Repository. https://zeluis.github.io/Africa-Digital-Atlas/', 'apa-cite')}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    {copiedKey === 'apa-cite' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'apa-cite' ? 'Copied' : 'Copy APA'}</span>
                  </button>
                </div>
                <p className="text-xs font-serif text-stone-600 dark:text-stone-400 italic">
                  Correia, Z. F. (2026). Africa Data Atlas & Cartographic Observatory: Sovereign Geospatial Intelligence, Macroeconomic Indicators, and Historical Trade Flow Platform. Africalia Open Science Repository.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">BibTeX Citation Entry</span>
                  <button
                    onClick={() => handleCopy(`@misc{correia_africa_atlas_2026,
  author = {Correia, Z{\\'e}luis F.},
  title = {Africa Data Atlas \\& Cartographic Observatory},
  year = {2026},
  publisher = {Africalia Open Science},
  howpublished = {\\url{https://zeluis.github.io/Africa-Digital-Atlas/}}
}`, 'bibtex-cite')}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    {copiedKey === 'bibtex-cite' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'bibtex-cite' ? 'Copied' : 'Copy BibTeX'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-stone-600 dark:text-stone-400 overflow-x-auto p-2 bg-stone-100 dark:bg-stone-900 rounded-xl">
{`@misc{correia_africa_atlas_2026,
  author = {Correia, Z{\\'e}luis F.},
  title = {Africa Data Atlas & Cartographic Observatory},
  year = {2026},
  publisher = {Africalia Open Science},
  howpublished = {\\url{https://zeluis.github.io/Africa-Digital-Atlas/}}
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
