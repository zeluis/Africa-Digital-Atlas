import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TradeCorridorPath } from '../../data/preColonialKingdomsDetailed';
import { speakAcademicNarration, stopAfricaliaSpeech } from '../../utils/africaliaVoiceEngine';
import { 
  Compass, 
  MapPin, 
  Coins, 
  Sparkles, 
  Quote, 
  Check, 
  Copy, 
  Volume2, 
  VolumeX, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  TrendingUp, 
  Ship, 
  Wind, 
  Anchor,
  Milestone,
  Crosshair
} from 'lucide-react';

export interface TradeCorridorDetailPanelProps {
  corridor: TradeCorridorPath;
  allCorridors?: TradeCorridorPath[];
  isFilmstripOpen?: boolean;
  onClose: () => void;
  onSelectCorridor?: (corridor: TradeCorridorPath) => void;
  onRecenterMap?: (corridor: TradeCorridorPath) => void;
  onNavigateToKingdom?: (kingdomId: string) => void;
}

type CorridorTabKey = 'overview' | 'waypoints' | 'archival' | 'modern';

export const TradeCorridorDetailPanel: React.FC<TradeCorridorDetailPanelProps> = ({
  corridor,
  allCorridors = [],
  isFilmstripOpen = false,
  onClose,
  onSelectCorridor,
  onRecenterMap,
  onNavigateToKingdom
}) => {
  const [activeTab, setActiveTab] = useState<CorridorTabKey>('overview');
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentIndex = allCorridors.findIndex(c => c.id === corridor.id);
  const totalCount = allCorridors.length;

  // Stop audio playback on unmount or corridor change
  useEffect(() => {
    return () => {
      stopAfricaliaSpeech();
    };
  }, [corridor.id]);

  const handlePrev = () => {
    if (totalCount === 0 || !onSelectCorridor) return;
    const nextIdx = (currentIndex - 1 + totalCount) % totalCount;
    onSelectCorridor(allCorridors[nextIdx]);
  };

  const handleNext = () => {
    if (totalCount === 0 || !onSelectCorridor) return;
    const nextIdx = (currentIndex + 1) % totalCount;
    onSelectCorridor(allCorridors[nextIdx]);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stopAfricaliaSpeech();
      setIsSpeaking(false);
      return;
    }

    const narration = `${corridor.name}. Major trade corridor of the ${corridor.kingdomName || 'pre-colonial era'}. Primary commodity: ${corridor.commodity}. Active during centuries ${corridor.activeCenturies.join(', ')}. ${corridor.volumeDescription || ''}`;
    speakAcademicNarration({
      text: narration,
      playChime: true,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const handleCopyCitation = async () => {
    const text = `Archival Cartography Record: ${corridor.name} (${corridor.historicalPeriod || corridor.activeCenturies.map(c => `${c}th c.`).join(', ')}). Commodity: ${corridor.commodity}. Trajectory: ${corridor.startName} to ${corridor.endName}. Africa Data Atlas Cartographic Corpus.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2400);
    } catch {}
  };

  const getTransportBadge = (mode?: string) => {
    switch (mode) {
      case 'maritime_dhow':
        return { label: 'Maritime Dhow Flotilla', icon: Ship, color: 'text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/80 border-cyan-300 dark:border-cyan-800/60' };
      case 'camel_caravan':
        return { label: 'Trans-Saharan Camel Caravan', icon: Wind, color: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800/60' };
      case 'riverine_flotilla':
        return { label: 'Riverine Flotilla & Waterways', icon: Anchor, color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800/60' };
      case 'cavalry_corridor':
        return { label: 'Savanna Cavalry Highway', icon: Milestone, color: 'text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/80 border-purple-300 dark:border-purple-800/60' };
      default:
        return { label: 'Highland & Forest Porterage', icon: MapPin, color: 'text-amber-800 dark:text-amber-300 bg-stone-100 dark:bg-stone-900 border-stone-300 dark:border-stone-700' };
    }
  };

  const transportInfo = getTransportBadge(corridor.transportMode);
  const TransportIcon = transportInfo.icon;

  const filmstripOffsetClass = isFilmstripOpen ? 'lg:left-[246px]' : 'lg:left-6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 35, scale: 0.96 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      className={`fixed bottom-4 left-3 sm:left-4 ${filmstripOffsetClass} z-30 w-[360px] sm:w-[440px] md:w-[480px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-140px)] rounded-3xl bg-[#FAF7F2]/96 dark:bg-[#181614]/96 text-stone-900 dark:text-stone-100 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_16px_40px_rgba(75,55,35,0.22)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl overflow-hidden flex flex-col font-sans select-none`}
      style={{
        boxShadow: `0 20px 50px -10px ${corridor.color}33, 0 0 0 1px ${corridor.color}40`
      }}
    >
      {/* Top Ambient Glow Header */}
      <div 
        className="h-1.5 w-full transition-all duration-500" 
        style={{ 
          background: `linear-gradient(90deg, ${corridor.color}, #f59e0b, ${corridor.color})` 
        }} 
      />

      {/* Main Header */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-[#E5DDD0] dark:border-[#38322B] flex items-start justify-between gap-3 bg-white/[0.02]">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span 
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shadow-xs"
              style={{
                backgroundColor: `${corridor.color}25`,
                color: corridor.color,
                borderColor: `${corridor.color}60`
              }}
            >
              <Coins className="w-3 h-3" />
              <span>{corridor.commodity.toUpperCase()} CORRIDOR</span>
            </span>

            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${transportInfo.color}`}>
              <TransportIcon className="w-3 h-3" />
              <span>{transportInfo.label}</span>
            </span>

            {corridor.activeCenturies && (
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                {corridor.activeCenturies.map(c => `${c}th`).join(', ')} Century
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-white tracking-tight leading-snug">
            {corridor.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <span className="text-stone-600 dark:text-stone-300 font-medium">Origin:</span>
            <span className="text-amber-700 dark:text-amber-300 font-semibold">{corridor.startName}</span>
            <ArrowRight className="w-3 h-3 text-stone-400" />
            <span className="text-stone-600 dark:text-stone-300 font-medium">Terminus:</span>
            <span className="text-cyan-700 dark:text-cyan-300 font-semibold">{corridor.endName}</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          {totalCount > 1 && (
            <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Previous trade corridor"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold text-stone-700 dark:text-stone-300 px-1 font-tabular">
                {currentIndex + 1}/{totalCount}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="p-1 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Next trade corridor"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {onRecenterMap && (
            <button
              type="button"
              onClick={() => onRecenterMap(corridor)}
              className="p-1.5 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Recenter map on this trade corridor"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleSpeak}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isSpeaking 
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-600 dark:text-amber-300 animate-pulse' 
                : 'bg-stone-100 dark:bg-white/5 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-white/10'
            }`}
            title={isSpeaking ? "Stop audio narration" : "Listen to trade corridor narration"}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleCopyCitation}
            className="p-1.5 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Copy academic citation"
          >
            {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Close trade corridor dossier and reset map view"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="px-4 pt-2 border-b border-[#E5DDD0] dark:border-[#38322B] flex items-center gap-1 overflow-x-auto custom-scrollbar bg-black/5 dark:bg-black/20">
        {[
          { key: 'overview', label: 'Route Overview', icon: Compass },
          { key: 'waypoints', label: `Waypoints (${corridor.keyStops?.length || corridor.points.length})`, icon: MapPin },
          { key: 'archival', label: 'Archival Account', icon: Quote },
          { key: 'modern', label: 'Modern Legacy', icon: TrendingUp }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as CorridorTabKey)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-amber-600 dark:border-amber-400 text-amber-700 dark:text-amber-300 bg-white/40 dark:bg-white/5'
                  : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-white/20'
              }`}
            >
              <TabIcon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-5 max-h-[46vh] sm:max-h-[50vh] overflow-y-auto custom-scrollbar text-xs leading-relaxed space-y-4">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-3.5">
            <div className="p-3 rounded-2xl bg-stone-100/80 dark:bg-white/[0.03] border border-stone-200 dark:border-stone-800/80 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Economic Dynamics & Volume</span>
              </span>
              <p className="text-stone-800 dark:text-stone-300 font-serif text-[12.5px] leading-relaxed">
                {corridor.volumeDescription}
              </p>
              {corridor.economicSignificance && (
                <p className="text-stone-600 dark:text-stone-400 text-[11.5px] border-t border-stone-200 dark:border-stone-800/60 pt-2">
                  <strong className="text-stone-800 dark:text-stone-300">Imperial Significance:</strong> {corridor.economicSignificance}
                </p>
              )}
            </div>

            {/* Cargo Goods Badges */}
            {corridor.cargoTypes && corridor.cargoTypes.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400">
                  Primary Cargo & Traded Commodities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {corridor.cargoTypes.map((cargo, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-amber-200/90 text-[11px] font-medium shadow-2xs"
                    >
                      ● {cargo}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Empire CTA */}
            {corridor.kingdomName && (
              <div className="p-3 rounded-2xl bg-purple-500/10 dark:bg-gradient-to-r dark:from-purple-950/40 dark:to-stone-900/40 border border-purple-500/30 dark:border-purple-900/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 font-bold uppercase">Associated Realm</span>
                  <div className="text-xs font-serif font-bold text-purple-900 dark:text-purple-100">{corridor.kingdomName}</div>
                </div>
                {onNavigateToKingdom && corridor.kingdomId && (
                  <button
                    type="button"
                    onClick={() => onNavigateToKingdom(corridor.kingdomId!)}
                    className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-mono text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <span>Inspect Realm</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. WAYPOINTS & ROUTE TAB */}
        {activeTab === 'waypoints' && (
          <div className="space-y-3">
            <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
              Key staging posts, maritime anchorages, and caravanserais along the {corridor.name}:
            </div>

            <div className="space-y-2 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
              {corridor.keyStops && corridor.keyStops.length > 0 ? (
                corridor.keyStops.map((stop, idx) => (
                  <div key={idx} className="relative flex items-start gap-3 pl-1 group">
                    <div className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-900 border-2 border-amber-500 text-amber-700 dark:text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 z-10 group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </div>
                    <div className="flex-1 p-2.5 rounded-xl bg-stone-100/70 dark:bg-white/[0.02] border border-stone-200 dark:border-stone-800/70 space-y-0.5 hover:border-amber-500/40 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs">{stop.name}</span>
                        {stop.modernCountry && (
                          <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-900 text-amber-800 dark:text-amber-400 border border-stone-300 dark:border-stone-800">
                            {stop.modernCountry}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">{stop.role}</p>
                    </div>
                  </div>
                ))
              ) : (
                corridor.points.map((pt, idx) => (
                  <div key={idx} className="relative flex items-start gap-3 pl-1">
                    <div className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-900 border-2 border-stone-400 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 z-10">
                      {idx + 1}
                    </div>
                    <div className="flex-1 p-2 rounded-xl bg-stone-100/70 dark:bg-white/[0.02] border border-stone-200 dark:border-stone-800 font-mono text-[11px] text-stone-700 dark:text-stone-300">
                      Waypoint Segment {idx + 1}: Coordinates [{pt[0]}, {pt[1]}]
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 3. ARCHIVAL ACCOUNT TAB */}
        {activeTab === 'archival' && (
          <div className="space-y-3.5">
            {corridor.historicalQuote ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 dark:border-amber-800/40 space-y-2">
                <Quote className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <blockquote className="font-serif italic text-amber-950 dark:text-amber-100 text-[13px] leading-relaxed">
                  "{corridor.historicalQuote.text}"
                </blockquote>
                <div className="text-[11px] font-mono text-amber-800 dark:text-amber-400/90 pt-1 border-t border-amber-500/20 dark:border-amber-800/30 flex items-center justify-between">
                  <span>— {corridor.historicalQuote.author}</span>
                  <span>{corridor.historicalQuote.source} ({corridor.historicalQuote.year})</span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-white/[0.02] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400">
                Primary scholastic records documented across trans-Saharan and Indian Ocean Swahili chronicles.
              </div>
            )}

            <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/[0.02] border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400">Scholastic Grounding</span>
              <p className="text-[11.5px] text-stone-600 dark:text-stone-400 font-serif">
                Reconstructed from medieval Arabic geographical treatises (Ibn Battuta, Al-Umari, Al-Bakri), Portuguese nautical roteiros, and archaeological evidence of cowrie currencies and porcelain fragments.
              </p>
            </div>
          </div>
        )}

        {/* 4. MODERN ECONOMIC LEGACY TAB */}
        {activeTab === 'modern' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30 dark:border-emerald-800/40 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Contemporary Infrastructure &amp; AfCFTA Integration</span>
              </span>
              <p className="text-[12.5px] font-serif text-emerald-950 dark:text-emerald-100 leading-relaxed">
                {corridor.modernLegacy || "Forms the foundational logistical template for current African regional integration and transport corridors."}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/[0.02] border border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400 space-y-1">
              <span className="text-[10px] font-mono text-stone-700 dark:text-stone-300 font-bold uppercase">AfCFTA Trade Corridor Alignment</span>
              <p>
                African Union Agenda 2063 prioritizes modern high-speed rail, deepwater container ports, and trans-continental highways mirroring these exact historic trade alignments.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="px-4 py-2.5 sm:px-5 bg-stone-100 dark:bg-black/40 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[10px] font-mono text-stone-500 dark:text-stone-400">
        <span>Cartographic Space: Native 5796×5867</span>
        <span className="text-amber-600 dark:text-amber-400 font-bold">{corridor.flowDirection.toUpperCase()} FLOW</span>
      </div>
    </motion.div>
  );
};
