import React, { useState, useEffect } from 'react';
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
  Layers, 
  Award,
  X,
  ScrollText,
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import { CanonicalNavTab } from './NavigationDrawer';
import { UN_GEOSCHEME_TONAL_PALETTES as UN_M49_REGIONAL_PALETTES } from '../data/unGeoschemeColors';

interface UniversalMonographModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: CanonicalNavTab) => void;
}

type GuideSection = 'all' | 'identity' | 'design-system' | 'cartography' | 'assets' | 'multilateral-apis' | 'ethics-governance';

export const UniversalMonographModal: React.FC<UniversalMonographModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [activeSection, setActiveSection] = useState<GuideSection>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const navSections: { id: GuideSection; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Full Monograph', icon: <ScrollText className="w-4 h-4" /> },
    { id: 'identity', label: '1. Charter & IP', icon: <Award className="w-4 h-4" /> },
    { id: 'design-system', label: '2. Japandi-Sahel UI', icon: <Palette className="w-4 h-4" /> },
    { id: 'cartography', label: '3. Cartography & Geodesy', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'assets', label: '4. Assets & Seals', icon: <Layers className="w-4 h-4" /> },
    { id: 'multilateral-apis', label: '5. 16 Multilateral APIs', icon: <Database className="w-4 h-4" /> },
    { id: 'ethics-governance', label: '6. Privacy & Citations', icon: <ShieldCheck className="w-4 h-4" /> }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl max-h-[92vh] bg-[#FAF8F5] dark:bg-stone-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col z-10"
        >
          {/* Modal Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 font-serif">
                  Africalia Universal Monograph & Architectural Constitution
                </h2>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                  Complete Reference Text • Author: Zéluis F. Correia • CC-BY 4.0 Observatory Edition
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="./docs/UNIVERSAL_STYLE_GUIDE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Raw Markdown File</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors cursor-pointer"
                title="Close Monograph"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Section Tabs Selector - Unified Sleek Pill Control */}
          <div className="bg-white/95 dark:bg-stone-900/95 border-b border-stone-200 dark:border-stone-800 px-6 py-3 shrink-0 shadow-xs">
            <div className="p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center gap-1.5">
              {navSections.map(tab => {
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-sm font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Scrollable Content Body - Complete Editorial Typography & Markdown Text */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10 bg-[#FAF8F5] dark:bg-stone-950 font-serif text-stone-800 dark:text-stone-200">
            {/* Masthead Banner */}
            <div className="rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Permanent Scholarly Reference • Observatory Edition 2026.1</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight font-serif">
                AFRICALIA UNIVERSAL STYLE GUIDE & LIVING ARCHITECTURAL MONOGRAPH
              </h1>
              <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base font-sans leading-relaxed">
                The Sovereign Design System, Cartographic Geodesy, and Technical Architecture of the Africa Data Atlas. Under the scientific direction and cartographic curation of <strong className="text-stone-900 dark:text-stone-100 font-semibold">Zéluis F. Correia</strong>.
              </p>
            </div>

            {/* SECTION I */}
            {(activeSection === 'all' || activeSection === 'identity') && (
              <section className="space-y-6 bg-white dark:bg-stone-900/70 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-1">Section I</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                    Institutional Mission & Intellectual Property Charter
                  </h2>
                </div>

                <div className="space-y-4 font-sans text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif pt-2">1.1 Institutional Identity & Purpose</h3>
                  <p>
                    <strong>Africalia</strong> is an independent, non-partisan cartographic and econometric research observatory founded by <strong>Zéluis F. Correia</strong>. The <strong>Africa Data Atlas</strong> serves as a digital public good and scientific synthesis platform bridging the gap between fragmented multilateral statistics, deep ancestral phylogenetic lineages, historical trade extractions, and contemporary geopolitical transformations across all 54 sovereign African nations.
                  </p>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif pt-2">1.2 Cartographic Copyright & Vector Intellectual Property</h3>
                  <p>
                    All proprietary vector topologies, geographic coordinate matrices, and phylogenetic tree geometries published within the Africa Data Atlas are original intellectual creations:
                  </p>

                  <div className="my-4 p-5 rounded-2xl bg-amber-500/[0.06] dark:bg-amber-500/[0.1] border-l-4 border-amber-600 dark:border-amber-500 text-xs sm:text-sm font-sans space-y-2">
                    <strong className="block text-amber-900 dark:text-amber-300 font-bold">CARTOGRAPHIC & VECTOR TOPOLOGY DECLARATION</strong>
                    <p className="text-stone-700 dark:text-stone-300">
                      <strong>Copyright © 2024–2026 Africalia. Authored, calibrated, and engineered by Zéluis F. Correia. All Rights Reserved.</strong>
                    </p>
                    <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
                      The $5796 \times 5867$ High-Precision Vector Continental Engine (<code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded">africa-final.svg</code> / <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded">AfricaMapFinalLayer.tsx</code>), the 1,017 Admin-1 provincial subdivision boundaries, the Geodesic SIDS Coordinate Callout Arrays, and the Sovereign African Ethnic Tree of Life Vector Topology constitute proprietary intellectual property protected under the Berne Convention for the Protection of Literary and Artistic Works, the WIPO Copyright Treaty (WCT), and international copyright statutes.
                    </p>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif pt-2">Permitted Academic & Educational Fair Use:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Scholarly Citation & Classroom Instruction</strong>: Researchers, faculty, students, and journalists are granted non-exclusive permission to inspect, screenshot, cite, and project these maps for non-commercial educational, scientific, and journalistic analysis.</li>
                    <li><strong>Mandatory Attribution</strong>: Any reproduction, visual citation, or academic paper utilizing these geometries must state: <br/>
                    <em className="text-amber-800 dark:text-amber-300 font-medium">"Cartographic visualization courtesy of Africalia / Zéluis F. Correia (Africa Data Atlas, 2026)."</em></li>
                    <li><strong>Commercial Restrictions</strong>: Vector extraction, programmatic cloning, scraping, or commercial resale of the SVG path coordinate topologies without prior formal written consent from Africalia is strictly prohibited.</li>
                  </ul>
                </div>
              </section>
            )}

            {/* SECTION II */}
            {(activeSection === 'all' || activeSection === 'design-system') && (
              <section className="space-y-6 bg-white dark:bg-stone-900/70 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-1">Section II</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                    Visual Constitution & Japandi-Sahel Design System
                  </h2>
                </div>

                <div className="space-y-4 font-sans text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif pt-2">2.1 Aesthetic Philosophy</h3>
                  <p>
                    The visual architecture of Africalia departs from generic tech-startup conventions (&quot;AI slop&quot;, neon purple gradients, floating glassmorphism). Instead, it adopts a <strong>Japandi-Sahel Synthesis</strong>—blending Japanese minimalism (<i>wabi-sabi</i>, optical breathing room, respect for negative space) with Scandinavian functionalism (<i>lagom</i>, ergonomic typography) and warm, dignified African earthen pigmentations.
                  </p>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif pt-2">2.2 Color Constellation & Authoritative Palettes</h3>
                  <p><strong>Canvas Foundations:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Museum Light Canvas (Primary Default)</strong>: <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">#FAF8F5</code> (Soft warm parchment with 0% eye-fatigue)</li>
                    <li><strong>Obsidian Dark Canvas</strong>: <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">#121310</code> (Warm obsidian charcoal; strictly avoids harsh #000000)</li>
                    <li><strong>Card & Surface Background (Light)</strong>: <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">#FFFFFF</code> with hairline border <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">rgba(230, 225, 218, 0.85)</code></li>
                    <li><strong>Card & Surface Background (Dark)</strong>: <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">#1A1916</code> with hairline border <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">rgba(255, 255, 255, 0.08)</code></li>
                  </ul>

                  <p className="pt-2"><strong>United Nations M49 Geoscheme Cartographic Scale:</strong></p>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                    {Object.values(UN_M49_REGIONAL_PALETTES).map(palette => (
                      <div key={palette.id} className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 dark:text-stone-100">{palette.shortName}</span>
                          <span className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-xs" style={{ backgroundColor: palette.unBaseColor }} />
                        </div>
                        <div className="text-[10px] font-mono text-stone-500">
                          <div>M49: {palette.m49Code}</div>
                          <div>{palette.unBaseColor}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif pt-4">2.3 Typographic Hierarchy & Density Switching</h3>
                  <p>
                    The platform employs a multi-script typographic pairing (Plus Jakarta Sans, Inter, JetBrains Mono) with Noto Sans Arabic and Noto Sans Ethiopic extensions. Furthermore, users can toggle between Compact, Standard, and Spacious density modes instantly.
                  </p>
                </div>
              </section>
            )}

            {/* SECTION III */}
            {(activeSection === 'all' || activeSection === 'cartography') && (
              <section className="space-y-6 bg-white dark:bg-stone-900/70 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-1">Section III</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                    Cartographic Engines & Geodetic Specifications
                  </h2>
                </div>

                <div className="space-y-4 font-sans text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif pt-2">3.1 The $5796 \times 5867$ High-Precision Vector Engine</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Source Baseline</strong>: <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">africa-final.svg</code> streaming into <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">AfricaMapFinalLayer.tsx</code>.</li>
                    <li><strong>Coordinate Space</strong>: Exact Cartesian bounding box of <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">0 0 5796 5867</code>.</li>
                    <li><strong>Sub-National Granularity</strong>: 1,017 Admin-1 provincial, state, and regional internal boundary paths.</li>
                    <li><strong>Hairline Precision Standards</strong>: Coastlines and national boundaries (<code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">2.8px</code> - <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">4.5px</code>), Admin-1 subdivisions (<code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">0.4px</code> - <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">1.2px</code>).</li>
                  </ul>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif pt-2">3.2 Gesture & Scroll-Isolation Protocol</h3>
                  <p>
                    Replaces passive defaults with strict native <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">{`{ passive: false }`}</code> listeners on <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">containerRef</code>, intercepting <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-xs">e.preventDefault()</code>. Pinch-to-zoom and touch-action isolation prevent page bounces.
                  </p>
                </div>
              </section>
            )}

            {/* SECTION IV */}
            {(activeSection === 'all' || activeSection === 'assets') && (
              <section className="space-y-6 bg-white dark:bg-stone-900/70 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-1">Section IV</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                    Asset Inventory & Institutional Emblem Catalog
                  </h2>
                </div>

                <div className="space-y-4 font-sans text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif pt-2">4.1 Scalable Pure SVG Institutional Emblems</h3>
                  <p>
                    All multilateral emblems are embedded as mathematical inline vector components requiring zero HTTP requests with infinite retina sharpness:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">1. World Bank Group</div>
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">2. United Nations</div>
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">3. UNESCO</div>
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">4. IMF</div>
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">5. African Union</div>
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">6. AfDB</div>
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">7. AfCFTA Secretariat</div>
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">8. WHO</div>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif pt-4">4.2 Archival Iconography & Castas Series (1,252 Visual Plates)</h3>
                  <p>
                    Includes 1,220 Middle Passage naval architectural illustrations and 32 colonial Castas paintings cataloging 18th-century racial classifications in the Hispanic Atlantic.
                  </p>
                </div>
              </section>
            )}

            {/* SECTION V */}
            {(activeSection === 'all' || activeSection === 'multilateral-apis') && (
              <section className="space-y-6 bg-white dark:bg-stone-900/70 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-1">Section V</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                    Multilateral Data Architecture & API Repository
                  </h2>
                </div>

                <div className="space-y-4 font-sans text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif pt-2">5.1 The 16 Multilateral Connectors</h3>
                  <p>The platform continuously harmonizes statistical indicators across 16 international institutions:</p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm">
                    <li><strong>World Bank WDI</strong>: Macroeconomic accounts, GDP, external debt stocks.</li>
                    <li><strong>IMF WEO</strong>: Fiscal balances, inflation forecasts, balance of payments.</li>
                    <li><strong>UN Comtrade</strong>: Bilateral trade matrices and mineral extractions.</li>
                    <li><strong>WHO Global Health Observatory</strong>: Maternal health and disease burdens.</li>
                    <li><strong>UNESCO UIS</strong>: Literacy rates and school progression.</li>
                    <li><strong>Freedom House FIW</strong>: Civil liberties scores and political rights.</li>
                    <li><strong>World Bank WGI</strong>: Rule of Law and Control of Corruption.</li>
                    <li><strong>Africa Integrity Indicators (AII)</strong>: Judicial autonomy.</li>
                    <li><strong>World Bank Gender Data Portal</strong>: Female labor participation.</li>
                    <li><strong>World Bank Corporate Scorecard</strong>: IDA delivery outcomes.</li>
                    <li><strong>World Bank Climate CCKP</strong>: CMIP6 rainfall anomalies.</li>
                    <li><strong>AfDB Africa Information Highway</strong>: Infrastructure indices.</li>
                    <li><strong>UNCTAD Trade Data Portal</strong>: Port container throughput.</li>
                    <li><strong>Mo Ibrahim Foundation (IIAG)</strong>: Governance index.</li>
                    <li><strong>AfCFTA Secretariat Data</strong>: Intra-African tariff schedules.</li>
                    <li><strong>SlaveVoyages Research Consortium</strong>: 36,000+ voyage records.</li>
                  </ol>
                </div>
              </section>
            )}

            {/* SECTION VI */}
            {(activeSection === 'all' || activeSection === 'ethics-governance') && (
              <section className="space-y-6 bg-white dark:bg-stone-900/70 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-1">Section VI</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                    Zero-Surveillance Privacy & Fair Scholarly Charter
                  </h2>
                </div>

                <div className="space-y-4 font-sans text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif pt-2">6.1 Privacy & Sovereign Data Governance</h3>
                  <p>
                    100% free of advertising cookies, Google Analytics, or third-party tracking pixels. Fully compliant with GDPR and the African Union Malabo Convention.
                  </p>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif pt-4">6.2 Standardized Academic Citations</h3>
                  
                  {/* APA Citation box */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">APA 7th Edition Citation</span>
                      <button
                        onClick={() => handleCopy('Correia, Z. F. (2026). Africa Data Atlas & Cartographic Observatory: Sovereign Geospatial Intelligence, Macroeconomic Indicators, and Historical Trade Flow Platform. Africalia Open Science Repository.', 'apa-cite')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        {copiedKey === 'apa-cite' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'apa-cite' ? 'Copied' : 'Copy APA'}</span>
                      </button>
                    </div>
                    <p className="text-xs font-serif text-stone-600 dark:text-stone-400 italic">
                      Correia, Z. F. (2026). Africa Data Atlas & Cartographic Observatory: Sovereign Geospatial Intelligence, Macroeconomic Indicators, and Historical Trade Flow Platform. Africalia Open Science Repository.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shrink-0">
            <span className="text-xs text-stone-500 font-mono">
              Africa Data Atlas • Portable Monograph Specification v2.4
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 text-white dark:text-stone-900 text-xs font-bold transition-colors cursor-pointer"
            >
              Close Monograph
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
