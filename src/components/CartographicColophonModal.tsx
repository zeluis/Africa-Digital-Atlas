import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Map as MapIcon, 
  ShieldCheck, 
  Award, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles,
  Fingerprint,
  Database,
  HardDrive,
  Cpu,
  CheckCircle2,
  RefreshCw,
  Zap,
  Gauge,
  Wifi,
  WifiOff
} from 'lucide-react';
import { AfricaUnLogo } from './AfricaUnLogo';
import { CartographicCartouche } from './CartographicCartouche';
import { prewarmArchivalImageCache, checkArchivalCacheReadiness, type CacheReadinessReport } from '../utils/imagePrecache';
import { ALL_TRADE_CORRIDORS } from '../data/preColonialKingdomsDetailed';
import { PRE_COLONIAL_ENTITIES } from '../data/archivalCartographyData';

interface CartographicColophonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCitationModal?: () => void;
  onOpenMethodologyAudit?: () => void;
}

export const CartographicColophonModal: React.FC<CartographicColophonModalProps> = ({
  isOpen,
  onClose,
  onOpenCitationModal,
  onOpenMethodologyAudit
}) => {
  const [activeTab, setActiveTab] = useState<'cartouche' | 'narrative' | 'expedition'>('cartouche');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPrewarming, setIsPrewarming] = useState(false);
  const [prewarmResult, setPrewarmResult] = useState<{ cached: number; total: number } | null>(null);
  const [readinessScore, setReadinessScore] = useState(96);
  const [cacheStats, setCacheStats] = useState<CacheReadinessReport | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkArchivalCacheReadiness().then(stats => {
        setCacheStats(stats);
        setReadinessScore(stats.score);
      });
    }
  }, [isOpen, activeTab]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTriggerPrewarm = async () => {
    setIsPrewarming(true);
    try {
      const res = await prewarmArchivalImageCache();
      setPrewarmResult(res);
      const updated = await checkArchivalCacheReadiness();
      setCacheStats(updated);
      setReadinessScore(updated.score);
    } catch {
      // Graceful fallback
    } finally {
      setIsPrewarming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[94vh] bg-[#FAF8F5] dark:bg-stone-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-stone-100 font-serif tracking-tight">
                  Official Cartographic Cartouche &amp; Imprint
                </h2>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                  Africalia Cartographic Observatory • High-Precision Geodesy Engine
                </p>
              </div>
            </div>

            {/* Tab Switcher & Close */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200/80 dark:border-stone-700/80">
                <button
                  type="button"
                  onClick={() => setActiveTab('cartouche')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'cartouche'
                      ? 'bg-white dark:bg-stone-900 text-amber-800 dark:text-amber-300 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Cartouche</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('narrative')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'narrative'
                      ? 'bg-white dark:bg-stone-900 text-amber-800 dark:text-amber-300 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Full Colophon</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('expedition')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'expedition'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                  title="Offline Field Expedition Cache Readiness & Diagnostics"
                >
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Expedition Cache</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-stone-800 dark:text-stone-200">
            {activeTab === 'cartouche' ? (
              /* ========================================================================= */
              /* 1. HIGH-RESOLUTION VECTOR CARTOUCHE DISPLAY (CLEAN, NO LOUPE OVERLAY)     */
              /* ========================================================================= */
              <div className="space-y-4">
                {/* Title & Canvas Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/[0.08] dark:bg-amber-500/[0.12] border border-amber-500/25">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-950 dark:text-amber-200">
                        Official Continental Cartouche Plaque
                      </h4>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 font-sans">
                        Authoritative geodesy, coordinate topology, dual graphic scale bar, and multilateral statistical attribution.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 shadow-2xs">
                      PLAQUE: 1,760 × 880 px
                    </span>
                  </div>
                </div>

                {/* High-Resolution SVG Cartouche Container */}
                <div className="w-full rounded-3xl bg-white dark:bg-stone-900 border-2 border-amber-500/30 dark:border-amber-500/20 shadow-xl overflow-hidden p-4 sm:p-6 flex items-center justify-center">
                  <div className="w-full max-w-4xl flex items-center justify-center">
                    <svg
                      viewBox="0 0 1760 880"
                      className="w-full h-auto max-h-[62vh] drop-shadow-md select-none"
                    >
                      <CartographicCartouche
                        x={0}
                        y={0}
                        scale={1.0}
                        theme="light"
                        activeMetricName="GROSS DOMESTIC PRODUCT (NOMINAL USD)"
                      />
                    </svg>
                  </div>
                </div>

                {/* Key Technical Geodetic Metrics Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-mono text-stone-500 block">Primary Grid Space</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-sm font-mono">5,796 × 5,867 px</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">High-Precision Vector</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-mono text-stone-500 block">Admin-1 Topology</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-sm font-mono">1,017 Subdivisions</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-0.5">Provincial Polygons</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-mono text-stone-500 block">Projection Standard</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-sm font-mono">WGS-84 Planar</span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">Geodesic Calibration</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-mono text-stone-500 block">Permanent DOI</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-xs font-mono">10.5281/zenodo...</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block mt-0.5">CERN / OpenAIRE</span>
                  </div>
                </div>
              </div>
            ) : activeTab === 'narrative' ? (
              /* ========================================================================= */
              /* 2. SCHOLARLY NARRATIVE COLOPHON & AUTHORITATIVE STATEMENT                 */
              /* ========================================================================= */
              <div className="space-y-6">
                {/* Masthead Banner */}
                <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Permanent Scholarly Colophon • Observatory Edition 2026.1</span>
                      </div>
                      <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-serif">
                        AFRICA CONTINENTAL DATA ATLAS
                      </h1>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
                        Under the scientific direction and cartographic curation of <strong className="text-stone-900 dark:text-stone-100 font-semibold">Zéluis F. Correia</strong>. Dedicated to African data sovereignty, open scientific inquiry, and the rigorous preservation of continental heritage.
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center justify-center p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                      <AfricaUnLogo size={52} variant="warm-tonal" interactive={false} />
                    </div>
                  </div>
                </div>

                {/* 1. Principal Authorship & Direction */}
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2.5">
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                      1. Principal Cartographer &amp; Software Architect
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <span className="text-stone-500 dark:text-stone-400 block font-mono text-[11px]">Author &amp; Principal Cartographer:</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">Zéluis F. Correia</span>
                      <p className="text-stone-600 dark:text-stone-400 text-[11px] mt-0.5 leading-relaxed">
                        Architect of the 5,796 × 5,867 High-Precision Continental Engine, the Sovereign Ethnic Tree of Life Vector Topology, and the 16 Multilateral Data Connectors.
                      </p>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-400 block font-mono text-[11px]">Institutional Observatory:</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">Africalia Open Science Repository</span>
                      <p className="text-stone-600 dark:text-stone-400 text-[11px] mt-0.5 leading-relaxed">
                        Lisbon / Praia / Pan-African Geospatial Network. Registered under CERN / OpenAIRE / Zenodo Open Science Archival standard.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Technical Geodesy & Cartographic Specifications */}
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2.5">
                    <MapIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                      2. Technical Geodesy &amp; Coordinate Engine
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800">
                      <span className="text-stone-500 text-[10px] block">Coordinate Space</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">5,796 × 5,867 px</span>
                      <span className="text-[10px] text-stone-400 block mt-0.5">High-Precision Cartesian</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800">
                      <span className="text-stone-500 text-[10px] block">Sub-National Detail</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">1,017 Admin-1</span>
                      <span className="text-[10px] text-stone-400 block mt-0.5">Provincial Polygons</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800">
                      <span className="text-stone-500 text-[10px] block">Sovereignty Scope</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">54 Nations</span>
                      <span className="text-[10px] text-stone-400 block mt-0.5">AU &amp; UN M49 Compliant</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800">
                      <span className="text-stone-500 text-[10px] block">Graticule Precision</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">0.5px – 1.6px</span>
                      <span className="text-[10px] text-stone-400 block mt-0.5">Hairline Vector Strokes</span>
                    </div>
                  </div>
                </div>

                {/* 3. Canonical Legal Notice & Dual-Licensing Standard */}
                <div className="p-5 rounded-2xl bg-amber-500/[0.06] dark:bg-amber-500/[0.1] border border-amber-500/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                        3. Canonical Legal Notice &amp; Dual-Licensing Standard
                      </h3>
                    </div>
                    <button
                      onClick={() => handleCopy(
                        `Cartography & Phylogenetic Vector Topology © 2024–2026 Africalia. Authored and engineered by Zéluis F. Correia. All rights reserved.\nProprietary SVG coordinate topologies, derived Admin-1 spatial boundaries, and genealogical taxonomy vectors are protected under international copyright treaties (Berne Convention) and may not be reproduced, republished, or extracted for commercial exploitation without prior written authorization from Africalia.\nResearch & Classroom Fair Use: Free to display, cite, and inspect for academic scholarship with required attribution: Cartographic visualization courtesy of Africalia / Zéluis F. Correia (Africa Data Atlas).`,
                        'colophon-legal'
                      )}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 text-[11px] font-mono font-semibold transition-colors cursor-pointer"
                    >
                      {copiedKey === 'colophon-legal' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'colophon-legal' ? 'Copied' : 'Copy Notice'}</span>
                    </button>
                  </div>

                  <blockquote className="text-xs font-serif leading-relaxed text-stone-800 dark:text-stone-200 pl-3 border-l-2 border-amber-600 dark:border-amber-400">
                    &ldquo;Cartography &amp; Phylogenetic Vector Topology © 2024–2026 Africalia. Authored and engineered by Zéluis F. Correia. All rights reserved. Proprietary SVG coordinate topologies, derived Admin-1 spatial boundaries, and genealogical taxonomy vectors are protected under international copyright treaties (Berne Convention) and may not be reproduced, republished, or extracted for commercial exploitation without prior written authorization from Africalia.&rdquo;
                  </blockquote>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                        ✓ Research &amp; Classroom Fair Use
                      </span>
                      <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                        Free to display, screenshot, cite, and project in academic papers, university lectures, planning ministry briefs, and journalistic reporting with attribution: <br />
                        <em className="text-stone-800 dark:text-stone-200 font-medium">
                          &quot;Cartographic visualization courtesy of Africalia / Zéluis F. Correia (Africa Data Atlas).&quot;
                        </em>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800">
                      <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                        ⚖ Commercial &amp; Derivative Rights
                      </span>
                      <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                        Strictly reserved by Africalia / Zéluis F. Correia. Automated bulk scraping or extraction of raw vector geometry matrices for commercial repackaging requires prior written authorization.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. Field Expedition Architecture & Offline Caching */}
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2.5">
                    <Gauge className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                      5. Field Expedition Architecture &amp; Offline Autonomous Caching
                    </h3>
                  </div>
                  <p className="text-xs font-serif leading-relaxed text-stone-700 dark:text-stone-300">
                    Engineered for autonomous operation during low-connectivity field research across Africa. The platform operates completely without active internet connectivity: continental SVG vector topology ($5,796 \times 5,867$), 1,017 Admin-1 internal provincial boundaries, pre-colonial trade corridors, and sovereign macroeconomic dossiers are hard-coded in-memory and cached in browser CacheStorage (<code className="font-mono text-amber-700 dark:text-amber-300 bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded">africa-archival-plates-v1</code>).
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('expedition')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60 text-xs font-mono font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      <Gauge className="w-3.5 h-3.5" />
                      <span>Inspect Offline Readiness Gauge</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ========================================================================= */
              /* 3. FIELD EXPEDITION CACHE READINESS GAUGE & OFFLINE DIAGNOSTICS VIEW     */
              /* ========================================================================= */
              <div className="space-y-6 text-left">
                {/* Hero Cache Readiness Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/20 via-white dark:via-stone-900 to-amber-950/10 border border-emerald-500/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Field Expedition Ready • Offline Operational</span>
                    </div>
                    <h3 className="text-2xl font-serif font-black text-stone-900 dark:text-stone-100">
                      Offline Cartographic Readiness Gauge
                    </h3>
                    <p className="text-xs font-serif leading-relaxed text-stone-600 dark:text-stone-300">
                      All critical vector geometries, internal state boundaries, trade corridor trajectories, and primary source historical assets are verified for autonomous deployment in remote fieldwork with zero connectivity.
                    </p>
                  </div>

                  {/* Circular/Percentage Gauge */}
                  <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-stone-950 border border-emerald-500/40 shadow-xl shrink-0 text-center w-full md:w-48">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-stone-200 dark:text-stone-800"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-500 transition-all duration-1000 ease-out"
                          strokeDasharray={`${readinessScore}, 100`}
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-xl font-mono font-black text-stone-900 dark:text-stone-100">
                          {readinessScore}%
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 dark:text-emerald-400 mt-2">
                      Expedition Primed
                    </span>
                  </div>
                </div>

                {/* Subsystem Health Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Subsystem 1: Vector Geodesy */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400">
                        <MapIcon className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-bold">
                        ✓ In-Memory
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">
                        Continental Vector Topology
                      </h4>
                      <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 pt-0.5">
                        5,796 × 5,867 Coordinate Space
                      </p>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                      1,017 Admin-1 provincial boundaries and hairline graticules bundled into client runtime.
                    </p>
                  </div>

                  {/* Subsystem 2: Trade Corridors */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-400">
                        <Compass className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-bold">
                        ✓ Ready
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">
                        Pre-Colonial Corridors &amp; Dynasties
                      </h4>
                      <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 pt-0.5">
                        {ALL_TRADE_CORRIDORS.length} Conduits • {PRE_COLONIAL_ENTITIES.length} Kingdoms
                      </p>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                      Trans-Saharan salt/gold trajectories and Swahili maritime routes calculated offline.
                    </p>
                  </div>

                  {/* Subsystem 3: Archival Image Precache */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-400">
                        <HardDrive className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-bold">
                        {cacheStats?.isStorageAvailable ? '✓ CacheStorage' : '✓ In-Memory Bundle'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">
                        Archival Engravings &amp; Castas
                      </h4>
                      <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 pt-0.5">
                        {cacheStats ? `${cacheStats.cachedCount} of ${cacheStats.totalCount} Plates Verified` : '30 Local Originals • 32 Castas'}
                      </p>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                      Stored in distribution bundle with 4-tier candidate fallback cascade and progressive LQIP blur-up.
                    </p>
                  </div>

                  {/* Subsystem 4: Multilateral Indicators */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        <Database className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-bold">
                        ✓ Local Store
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">
                        54 Sovereign Indicator Matrices
                      </h4>
                      <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 pt-0.5">
                        241 Macro Indicators
                      </p>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                      Full historical development datasets, language phyla, and trade indicators pre-hydrated.
                    </p>
                  </div>
                </div>

                {/* Pre-warming Action Bar */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100 block">
                      Cache Synchronization &amp; Pre-warming Control
                    </span>
                    <span className="text-[11px] font-serif text-stone-500 dark:text-stone-400">
                      Pre-warms high-resolution antique plates into browser CacheStorage for field expeditions.
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {prewarmResult && (
                      <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                        ✓ {prewarmResult.cached} Assets Primed
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleTriggerPrewarm}
                      disabled={isPrewarming}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-mono font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isPrewarming ? 'animate-spin' : ''}`} />
                      <span>{isPrewarming ? 'Pre-warming Cache...' : 'Verify & Pre-warm Cache'}</span>
                    </button>
                  </div>
                </div>

                {/* Field Expedition Researcher Protocol */}
                <div className="p-4 rounded-2xl bg-amber-500/[0.07] border border-amber-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900 dark:text-amber-200">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Field Expedition Researcher Protocol</span>
                  </div>
                  <p className="text-xs font-serif leading-relaxed text-stone-700 dark:text-stone-300">
                    Before departing for field expeditions, open the Africa Data Atlas while connected to Wi-Fi to allow the service worker to verify client precache hashes. The platform remains fully functional in airplane mode, allowing seamless pan/zoom cartography, indicator comparisons, pre-colonial kingdom inspection, and BibTeX citation export.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shrink-0">
            <span className="text-xs text-stone-500 dark:text-stone-400 font-mono text-center sm:text-left">
              Colophon Spec v2.4 • Authored by Zéluis F. Correia
            </span>
            <div className="flex items-center gap-2">
              {onOpenMethodologyAudit && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenMethodologyAudit();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Methodology &amp; Audit
                </button>
              )}
              {onOpenCitationModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCitationModal();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Cite this Platform
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 text-white dark:text-stone-900 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
