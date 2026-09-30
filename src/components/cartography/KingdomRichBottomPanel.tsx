import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PreColonialEntity } from '../../data/archivalCartographyData';
import { DETAILED_KINGDOMS_DATA, KingdomDetailedRecord } from '../../data/preColonialKingdomsDetailed';
import { 
  Crown, 
  Landmark, 
  Coins, 
  ShieldCheck, 
  BookOpen, 
  ExternalLink, 
  X, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Quote, 
  Check, 
  Copy, 
  Crosshair, 
  Award, 
  Scale, 
  Box, 
  Volume2, 
  VolumeX, 
  Layers, 
  TrendingUp, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface KingdomRichBottomPanelProps {
  entity: PreColonialEntity;
  isFilmstripOpen: boolean;
  onClose: () => void;
  onRecenterMap: (entity: PreColonialEntity) => void;
  onOpenDynasticTree?: () => void;
  onOpenArtifact3D?: (artifactId?: string) => void;
  onNavigateToCountry?: (iso3: string) => void;
  onPrevKingdom?: () => void;
  onNextKingdom?: () => void;
  currentIndex?: number;
  totalCount?: number;
}

type KingdomTabKey = 'overview' | 'governance' | 'economy' | 'culture' | 'sources';

export const KingdomRichBottomPanel: React.FC<KingdomRichBottomPanelProps> = ({
  entity,
  isFilmstripOpen,
  onClose,
  onRecenterMap,
  onOpenDynasticTree,
  onOpenArtifact3D,
  onNavigateToCountry,
  onPrevKingdom,
  onNextKingdom,
  currentIndex = 0,
  totalCount = 10
}) => {
  const [activeTab, setActiveTab] = useState<KingdomTabKey>('overview');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const detailedRecord: KingdomDetailedRecord | undefined = DETAILED_KINGDOMS_DATA[entity.id];

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const text = `${entity.name}. Royal Title: ${detailedRecord?.royalTitle || ''}. ${detailedRecord?.indigenousScript?.phoneticSpelling || ''}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const handleCopyCitation = async () => {
    if (!detailedRecord) return;
    const pub = detailedRecord.scholarlyPublications[0];
    const text = `${pub.author} (${pub.year}). ${pub.title}. ${pub.publisher}. Archival monograph entry for ${detailedRecord.name}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    } catch {}
  };

  // Filmstrip responsive offset
  const filmstripOffsetClass = isFilmstripOpen
    ? 'lg:left-[246px]'
    : 'lg:left-6';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 35, scale: 0.96 }}
      transition={{ 
        layout: { type: 'spring', damping: 28, stiffness: 300, mass: 0.8 },
        opacity: { duration: 0.2 },
        y: { type: 'spring', damping: 26, stiffness: 320 }
      }}
      className={`fixed bottom-4 left-3 sm:left-4 ${filmstripOffsetClass} z-30 ${
        isMinimized
          ? 'w-auto max-w-[340px] sm:max-w-[400px] rounded-2xl'
          : 'w-[360px] sm:w-[440px] md:w-[480px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-140px)] rounded-3xl'
      } flex flex-col bg-[#FAF7F2]/96 dark:bg-[#181614]/96 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_16px_40px_rgba(75,55,35,0.22)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl overflow-hidden transition-[width,max-width,border-radius] duration-300 ease-out select-none`}
      id="rich-kingdom-bottom-panel"
    >
      {/* 1. Header Bar with Kingdom Pagination */}
      <motion.div 
        layout="position"
        className={`p-3 sm:p-3.5 border-b border-[#E5DDD0] dark:border-[#38322B] flex items-center justify-between gap-2.5 shrink-0 ${
          isMinimized ? 'cursor-pointer hover:bg-stone-500/5' : ''
        }`}
        onClick={isMinimized ? () => setIsMinimized(false) : undefined}
        style={{
          background: `linear-gradient(135deg, ${entity.color}18 0%, transparent 65%)`
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Pulsating Jewel indicator */}
          <span
            className="w-3 h-3 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: entity.color }}
          />

          <div className="space-y-0.5 min-w-0 text-left">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 leading-tight truncate">
                {entity.name}
              </span>

              {detailedRecord?.royalTitle && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 font-mono text-[9px] font-bold border border-amber-500/30 truncate max-w-[140px]">
                  {detailedRecord.royalTitle}
                </span>
              )}
            </div>

            {!isMinimized && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-[10px] font-mono text-stone-500 dark:text-stone-400"
              >
                <span>{entity.regionBadge}</span>
                <span>•</span>
                <span>{entity.period}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Action & Pagination Buttons */}
        <div 
          className="flex items-center gap-1 shrink-0 text-stone-400"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Kingdom Pagination Navigator */}
          {!isMinimized && onPrevKingdom && onNextKingdom && (
            <div className="flex items-center gap-0.5 mr-1 p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B] text-xs font-mono">
              <button
                type="button"
                onClick={onPrevKingdom}
                className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                title="Previous Pre-Colonial Kingdom"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[9.5px] font-bold px-1 text-stone-600 dark:text-stone-400 font-tabular">
                {currentIndex + 1}/{totalCount}
              </span>
              <button
                type="button"
                onClick={onNextKingdom}
                className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                title="Next Pre-Colonial Kingdom"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {!isMinimized && (
            <>
              {/* Audio Pronunciation */}
              <button
                type="button"
                onClick={handleSpeak}
                className="p-1.5 rounded-xl hover:bg-stone-200/70 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                title="Pronounce Kingdom & Title Audio"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-600" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600" />}
              </button>

              <button
                type="button"
                onClick={() => onRecenterMap(entity)}
                className="p-1.5 rounded-xl hover:bg-stone-200/70 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                title="Recenter Map on this Kingdom"
              >
                <Crosshair className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </button>

              {detailedRecord?.wikipediaUrl && (
                <a
                  href={detailedRecord.wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-xl hover:bg-stone-200/70 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
                  title="Open full scholarly monograph on Wikipedia.org"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                </a>
              )}
            </>
          )}

          <button
            type="button"
            onClick={() => setIsMinimized(v => !v)}
            className="p-1.5 rounded-xl hover:bg-stone-200/70 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
            title={isMinimized ? "Expand Kingdom Dossier" : "Minimize panel to compact pill"}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/50 text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title="Close panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* 2. Expanded Content Sections */}
      <AnimatePresence initial={false}>
        {!isMinimized && (
          <motion.div
            key="expanded-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col overflow-hidden"
          >
            {/* Quick Action Interactive Tool Launchers Bar */}
            <div className="grid grid-cols-2 gap-1.5 p-2 bg-stone-100/70 dark:bg-stone-900/70 border-b border-[#E5DDD0] dark:border-[#38322B] shrink-0 text-xs font-mono font-bold">
              <button
                type="button"
                onClick={onOpenDynasticTree}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 border border-amber-500/30 transition-all cursor-pointer shadow-2xs"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>Dynastic Lineage</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenArtifact3D && onOpenArtifact3D()}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-900 dark:text-purple-200 border border-purple-500/30 transition-all cursor-pointer shadow-2xs"
              >
                <Box className="w-3.5 h-3.5 text-purple-600" />
                <span>3D Artifacts ({detailedRecord?.artifacts3D.length || 0})</span>
              </button>
            </div>

            {/* Sleek Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 border-b border-[#E5DDD0] dark:border-[#38322B] overflow-x-auto no-scrollbar shrink-0 text-[10px] font-mono font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Crown className="w-3 h-3" />
                <span>Overview</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('governance')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'governance'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Scale className="w-3 h-3" />
                <span>Governance</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('economy')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'economy'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Coins className="w-3 h-3" />
                <span>Economy</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('culture')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'culture'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Landmark className="w-3 h-3" />
                <span>Culture</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('sources')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'sources'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Sources</span>
              </button>
            </div>

            {/* Scrollable Tab Content Body with Sleek Scrollbar & Click-Through Bottom Fade */}
            <div className="relative overflow-hidden">
              <div className="p-3.5 sm:p-4 overflow-y-auto stable-gutter sleek-scrollbar-amber space-y-3.5 text-left text-xs font-sans max-h-[340px] pb-10">
                {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-3">
                  <p className="text-xs sm:text-[13px] font-serif leading-relaxed text-stone-800 dark:text-stone-200">
                    {detailedRecord?.summaryNarrative || entity.significance}
                  </p>

                  {/* Founding Narrative Card */}
                  {detailedRecord?.foundingNarrative && (
                    <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                      <span className="text-[9.5px] font-mono uppercase font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Founding Epoch &amp; Origin</span>
                      </span>
                      <p className="text-[11.5px] leading-relaxed text-stone-700 dark:text-stone-300">
                        {detailedRecord.foundingNarrative}
                      </p>
                    </div>
                  )}

                  {/* Quick Territorial Specs */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800">
                      <span className="text-[9px] uppercase font-mono font-bold text-stone-400 block">Historic Capital</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-100 truncate block">{entity.capital}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800">
                      <span className="text-[9px] uppercase font-mono font-bold text-stone-400 block">Peak Epoch</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-100 truncate block">{detailedRecord?.peakCentury || entity.period}</span>
                    </div>
                    <div className="col-span-2 p-2 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800">
                      <span className="text-[9px] uppercase font-mono font-bold text-stone-400 block">Modern Sovereign Footprint</span>
                      <span className="font-semibold text-purple-700 dark:text-purple-300 block">{entity.modernCountries.join(', ')}</span>
                    </div>
                  </div>

                  {/* Famous Monarchs List */}
                  {detailedRecord?.famousRulers && detailedRecord.famousRulers.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400 block">
                        Celebrated Rulers &amp; Architects of State
                      </span>
                      <div className="space-y-1.5">
                        {detailedRecord.famousRulers.map(r => (
                          <div key={r.name} className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-stone-200/70 dark:border-stone-800/70 flex items-start gap-2">
                            <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <strong className="font-serif font-bold text-stone-900 dark:text-stone-100">{r.name}</strong>
                                <span className="text-[9.5px] font-mono text-stone-500 dark:text-stone-400">({r.reign})</span>
                              </div>
                              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug mt-0.5">{r.feat}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Primary Historical Quotation */}
                  {detailedRecord?.historicalQuote && (
                    <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-900/80 border border-stone-200/90 dark:border-stone-800 space-y-1.5 font-serif italic text-stone-700 dark:text-stone-300">
                      <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase font-bold text-stone-400 not-italic">
                        <Quote className="w-3 h-3 text-amber-600" />
                        <span>Primary Archival Chronicle ({detailedRecord.historicalQuote.year})</span>
                      </div>
                      <p className="text-[11.5px] leading-relaxed">
                        "{detailedRecord.historicalQuote.text}"
                      </p>
                      <div className="text-[10px] font-sans not-italic font-medium text-stone-500 dark:text-stone-400 text-right">
                        — {detailedRecord.historicalQuote.author}, <em>{detailedRecord.historicalQuote.source}</em>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: GOVERNANCE & MILITARY */}
              {activeTab === 'governance' && (
                <div className="space-y-3">
                  <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-1">
                    <span className="text-[9.5px] font-mono uppercase font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1">
                      <Scale className="w-3 h-3 text-purple-600" />
                      <span>Constitutional System of State</span>
                    </span>
                    <p className="text-[11.5px] leading-relaxed text-stone-700 dark:text-stone-300">
                      {detailedRecord?.governanceSystem || "Centralized imperial sovereign state with provincial governorships."}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="text-[9.5px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400 block">
                      Council of State &amp; Executive Checks
                    </span>
                    <p className="text-[11.5px] leading-relaxed text-stone-700 dark:text-stone-300">
                      {detailedRecord?.stateCouncil || "High Council of Paramount Elders and Kingmakers."}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="text-[9.5px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Military Structure &amp; Tactical Organization</span>
                    </span>
                    <p className="text-[11.5px] leading-relaxed text-stone-700 dark:text-stone-300">
                      {detailedRecord?.militaryStructure || "Specialized standing cavalry and infantry units."}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: ECONOMY & MODERN BRIDGE */}
              {activeTab === 'economy' && (
                <div className="space-y-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                    <span className="text-[9.5px] font-mono uppercase font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Coins className="w-3 h-3 text-emerald-600" />
                      <span>Currency &amp; Monetary Standard</span>
                    </span>
                    <p className="text-[11.5px] leading-relaxed text-stone-700 dark:text-stone-300">
                      {detailedRecord?.currencySystem || entity.tradeSpecialty}
                    </p>
                  </div>

                  {/* Modern Macro-Economic Bridge Card */}
                  {detailedRecord?.economicBridge && (
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Historical-to-Modern Economic Bridge</span>
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="font-semibold text-stone-900 dark:text-stone-100">
                          {detailedRecord.economicBridge.modernEquivalentSector}
                        </div>
                        <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                          {detailedRecord.economicBridge.modernValueMetric}
                        </p>
                      </div>

                      {detailedRecord.economicBridge.modernKeyCountries && (
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {detailedRecord.economicBridge.modernKeyCountries.map(kc => (
                            <button
                              key={kc.iso3}
                              type="button"
                              onClick={() => onNavigateToCountry && onNavigateToCountry(kc.iso3)}
                              className="px-2 py-1 rounded-lg bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-bold text-emerald-900 dark:text-emerald-200 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                              title={`Inspect ${kc.name} in Country Dossier`}
                            >
                              <span>{kc.name}</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400 block">
                      Key Export Commodities &amp; Specialties
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(detailedRecord?.majorCommodities || [entity.tradeSpecialty]).map(c => (
                        <span key={c} className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-[10.5px] font-sans font-medium text-emerald-900 dark:text-emerald-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ARCHITECTURE & CULTURE */}
              {activeTab === 'culture' && (
                <div className="space-y-3">
                  {detailedRecord?.unescoHeritageSites && detailedRecord.unescoHeritageSites.length > 0 && (
                    <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-1">
                      <span className="text-[9.5px] font-mono uppercase font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1">
                        <Award className="w-3 h-3 text-rose-600" />
                        <span>UNESCO World Heritage Status</span>
                      </span>
                      <p className="text-[11.5px] font-semibold text-rose-900 dark:text-rose-200">
                        {detailedRecord.unescoHeritageSites.join(' • ')}
                      </p>
                    </div>
                  )}

                  {detailedRecord?.architecturalMonuments && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                        <Landmark className="w-3 h-3 text-amber-600" />
                        <span>Monumental Architecture &amp; Urban Design</span>
                      </span>
                      <div className="space-y-1">
                        {detailedRecord.architecturalMonuments.map(m => (
                          <div key={m} className="p-2 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-800 dark:text-stone-200">
                            {m}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SCHOLARLY SOURCES & WIKIPEDIA */}
              {activeTab === 'sources' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400">
                      Authoritative Academic Publications
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCitation}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-bold transition-all cursor-pointer"
                    >
                      {copiedCitation ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Citation</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(detailedRecord?.scholarlyPublications || [
                      { title: "UNESCO General History of Africa", author: "UNESCO International Scientific Committee", year: 1981, publisher: "Heinemann / UNESCO" }
                    ]).map((pub, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-[11px] space-y-0.5">
                        <div className="font-serif font-bold text-stone-900 dark:text-stone-100">{pub.title}</div>
                        <div className="text-[10px] font-mono text-stone-500 dark:text-stone-400">{pub.author} ({pub.year}) • {pub.publisher}</div>
                      </div>
                    ))}
                  </div>

                  {detailedRecord?.wikipediaUrl && (
                    <a
                      href={detailedRecord.wikipediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-2 p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800 flex items-center justify-between text-xs font-mono font-bold transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Read Full Wikipedia Article</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              )}
              </div>

              {/* Click-Through Bottom Fade Overlay */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#FAF7F2] dark:from-[#181614] to-transparent pointer-events-none z-10" 
                aria-hidden="true" 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
