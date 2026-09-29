import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KingdomDetailedRecord, DynasticNode } from '../../data/preColonialKingdomsDetailed';
import { 
  Crown, 
  Sparkles, 
  Scale, 
  X, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  Info, 
  Calendar, 
  ShieldAlert, 
  Award,
  Layers
} from 'lucide-react';

interface KingdomDynasticTreeModalProps {
  kingdom: KingdomDetailedRecord;
  onClose: () => void;
  onSelectNode?: (node: DynasticNode) => void;
}

export const KingdomDynasticTreeModal: React.FC<KingdomDynasticTreeModalProps> = ({
  kingdom,
  onClose,
  onSelectNode
}) => {
  const [selectedNode, setSelectedNode] = useState<DynasticNode>(kingdom.dynasticTree[0] || null);
  const [filterType, setFilterType] = useState<'all' | 'monarch' | 'queen_mother' | 'constitutional_milestone'>('all');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const filteredNodes = kingdom.dynasticTree.filter(node => {
    if (filterType === 'all') return true;
    return node.type === filterType;
  });

  const getNodeBadge = (type: DynasticNode['type']) => {
    switch (type) {
      case 'queen_mother':
        return {
          label: 'Queen Mother / Co-Ruler',
          bg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
          icon: <Crown className="w-3.5 h-3.5 text-rose-600" />
        };
      case 'constitutional_milestone':
        return {
          label: 'Constitutional Milestone',
          bg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
          icon: <Scale className="w-3.5 h-3.5 text-purple-600" />
        };
      default:
        return {
          label: 'Sovereign Monarch',
          bg: 'bg-amber-500/15 text-amber-900 dark:text-amber-300 border-amber-500/30',
          icon: <Crown className="w-3.5 h-3.5 text-amber-600" />
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#FAF7F2] dark:bg-[#181614] border border-[#E5DDD0] dark:border-[#38322B] shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div 
          className="p-4 sm:p-5 border-b border-[#E5DDD0] dark:border-[#38322B] flex items-center justify-between gap-4 shrink-0"
          style={{
            background: `linear-gradient(135deg, ${kingdom.color}20 0%, transparent 60%)`
          }}
        >
          <div className="space-y-1 min-w-0 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold border flex items-center gap-1.5"
                style={{
                  backgroundColor: `${kingdom.color}25`,
                  borderColor: `${kingdom.color}60`,
                  color: kingdom.color
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: kingdom.color }} />
                <span>{kingdom.regionBadge}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-stone-800 text-[10px] font-mono font-bold text-stone-700 dark:text-stone-300">
                {kingdom.period}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
                {kingdom.name} — Dynastic Succession &amp; Constitutional Lineage
              </h2>
              <button
                type="button"
                onClick={() => handleSpeak(`${kingdom.name}. Royal title: ${kingdom.royalTitle}. Dynasty: ${kingdom.dynasty}.`)}
                className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                title="Pronounce Kingdom & Title"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
              </button>
            </div>
            
            <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
              {kingdom.dynasty} • Royal Title: <strong className="text-stone-800 dark:text-stone-200">{kingdom.royalTitle}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-950/50 text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="px-4 py-2 bg-black/[0.02] dark:bg-white/[0.02] border-b border-[#E5DDD0] dark:border-[#38322B] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs font-mono font-bold">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 text-[11px] uppercase mr-1">Filter Lineage:</span>
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              All Records ({kingdom.dynasticTree.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('monarch')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                filterType === 'monarch'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              Monarchs
            </button>
            <button
              type="button"
              onClick={() => setFilterType('queen_mother')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                filterType === 'queen_mother'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              Queen Mothers (Iyoba / Asantehemaa / Magira)
            </button>
            <button
              type="button"
              onClick={() => setFilterType('constitutional_milestone')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                filterType === 'constitutional_milestone'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              Constitutional Charters
            </button>
          </div>
        </div>

        {/* Modal Body: Two-Column Tree & Detailed Inspector */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">
          {/* Left Column: Interactive Visual Tree Timeline */}
          <div className="md:col-span-7 p-4 sm:p-5 overflow-y-auto custom-scrollbar border-r border-[#E5DDD0] dark:border-[#38322B] space-y-3 text-left">
            <span className="text-[10px] font-mono uppercase font-bold text-stone-400 block tracking-wider">
              Chronological Dynastic Sequence
            </span>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-purple-500 before:to-emerald-500">
              {filteredNodes.map((node, idx) => {
                const isSelected = selectedNode?.id === node.id;
                const badge = getNodeBadge(node.type);

                return (
                  <motion.div
                    key={node.id}
                    layout
                    onClick={() => {
                      setSelectedNode(node);
                      if (onSelectNode) onSelectNode(node);
                    }}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-white dark:bg-stone-900 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                        : 'bg-white/60 dark:bg-stone-900/60 border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600'
                    }`}
                  >
                    {/* Node Dot on Timeline */}
                    <span 
                      className={`absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                        isSelected 
                          ? 'bg-amber-500 border-white dark:border-stone-900 scale-125 ring-2 ring-amber-500/50' 
                          : 'bg-stone-300 dark:bg-stone-700 border-white dark:border-stone-900'
                      }`} 
                    />

                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold border flex items-center gap-1 ${badge.bg}`}>
                            {badge.icon}
                            <span>{badge.label}</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400">
                            {node.reign}
                          </span>
                        </div>

                        <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                          {node.name}
                        </h4>

                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-snug">
                          {node.feat}
                        </p>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-amber-600 translate-x-0.5' : 'text-stone-400'}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Node Inspector & Historical Context */}
          <div className="md:col-span-5 p-4 sm:p-5 overflow-y-auto custom-scrollbar bg-black/[0.01] dark:bg-white/[0.01] space-y-4 text-left">
            {selectedNode ? (
              <div className="space-y-3.5">
                <div className="space-y-1 border-b border-[#E5DDD0] dark:border-[#38322B] pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-stone-400">
                      Historical Profile
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(`${selectedNode.name}. ${selectedNode.title}. Reigned ${selectedNode.reign}. Historical achievement: ${selectedNode.feat}`)}
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500"
                      title="Audio Speech"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                  </div>
                  <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                    {selectedNode.name}
                  </h3>
                  <p className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400">
                    {selectedNode.title} ({selectedNode.reign})
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="text-[9.5px] font-mono uppercase font-bold text-amber-800 dark:text-amber-300 block">
                    Historical Feat &amp; State Impact
                  </span>
                  <p className="text-xs font-serif leading-relaxed text-stone-800 dark:text-stone-200">
                    {selectedNode.feat}
                  </p>
                </div>

                {/* Indigenous Script & Phonetics Card */}
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5 text-xs">
                  <span className="text-[9.5px] font-mono uppercase font-bold text-stone-400 block">
                    Indigenous Script &amp; Phonetics
                  </span>
                  <div className="text-base font-serif font-bold text-purple-700 dark:text-purple-300">
                    {kingdom.indigenousScript.nativeCharacters}
                  </div>
                  <div className="text-[11px] font-mono text-stone-600 dark:text-stone-400">
                    Phonetics: <strong>{kingdom.indigenousScript.phoneticSpelling}</strong>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
                    {kingdom.indigenousScript.historicalUsage}
                  </p>
                </div>

                {/* Governance Context */}
                <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1 text-xs">
                  <span className="text-[9.5px] font-mono uppercase font-bold text-stone-400 block">
                    Institutional Framework
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 text-[11.5px] leading-relaxed">
                    {kingdom.stateCouncil}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6 text-stone-400 text-xs font-mono">
                Select a monarch or milestone node on the timeline to inspect details.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
