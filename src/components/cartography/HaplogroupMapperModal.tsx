import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dna, X, Globe, ShieldCheck, Activity, Users, Info } from 'lucide-react';

export interface HaplogroupRecord {
  lineage: string;
  type: 'mtDNA (Maternal)' | 'Y-DNA (Paternal)';
  rootOrigin: string;
  timeframe: string;
  distribution: string;
  significance: string;
  prevalenceByGroup: { group: string; percentage: number }[];
}

export const AFRICAN_HAPLOGROUPS: HaplogroupRecord[] = [
  {
    lineage: 'L0a / L0d (mtDNA)',
    type: 'mtDNA (Maternal)',
    rootOrigin: 'Eastern & Southern Africa (Khoisan & Early Hunter-Gatherers)',
    timeframe: '~150,000 years ago',
    distribution: 'Highest frequency among Khoisan populations, southern Bantu speakers, and widespread across African diaspora lineages.',
    significance: 'Represents one of the deepest ancient human maternal branch separations.',
    prevalenceByGroup: [
      { group: 'Khoisan (San / Nama)', percentage: 78 },
      { group: 'Southern Bantu', percentage: 34 },
      { group: 'East African Nilotes', percentage: 22 },
      { group: 'Afro-Descendant Diaspora', percentage: 28 }
    ]
  },
  {
    lineage: 'L1 / L2 / L3 (mtDNA)',
    type: 'mtDNA (Maternal)',
    rootOrigin: 'Central & West Africa (Rainforest & Niger-Congo expansion)',
    timeframe: '~70,000–85,000 years ago',
    distribution: 'Core maternal lineages of Western and Central African agriculturalists and the root of Out-of-Africa migration (L3).',
    significance: 'Dominant maternal lineage across the transatlantic slave trade diaspora to the Americas.',
    prevalenceByGroup: [
      { group: 'Yoruba / Igbo (West Africa)', percentage: 82 },
      { group: 'Akan / Ashanti', percentage: 79 },
      { group: 'Congo Basin Bantu', percentage: 85 },
      { group: 'African Diaspora (Americas)', percentage: 72 }
    ]
  },
  {
    lineage: 'E1b1a (V38) (Y-DNA)',
    type: 'Y-DNA (Paternal)',
    rootOrigin: 'West/Central Africa (Bantu Expansion catalyst)',
    timeframe: '~20,000 years ago',
    distribution: 'Found in over 80% of males across West, Central, Eastern, and Southern Africa, and the primary lineage spread during the Bantu migration.',
    significance: 'The definitive genetic hallmark of the Bantu demographic and linguistic expansion across the continent.',
    prevalenceByGroup: [
      { group: 'Niger-Congo / Bantu', percentage: 88 },
      { group: 'West African Forest States', percentage: 84 },
      { group: 'East African Bantu', percentage: 76 },
      { group: 'African Diaspora (Americas)', percentage: 75 }
    ]
  },
  {
    lineage: 'A-M91 & B-M60 (Y-DNA)',
    type: 'Y-DNA (Paternal)',
    rootOrigin: 'Central & Southern Africa (Ancient Indigenous Lineages)',
    timeframe: '~100,000 years ago',
    distribution: 'Ancient paternal lineages preserved among African hunter-gatherer and pastoralist communities.',
    significance: 'Represents the earliest diverging branches of the human Y-chromosome phylogenetic tree.',
    prevalenceByGroup: [
      { group: 'Mbuti / Pygmy Forest Groups', percentage: 65 },
      { group: 'San / Khoisan', percentage: 62 },
      { group: 'Hadza (Tanzania)', percentage: 54 },
      { group: 'General Continental Average', percentage: 4 }
    ]
  }
];

interface HaplogroupMapperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HaplogroupMapperModal: React.FC<HaplogroupMapperModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedLineage, setSelectedLineage] = useState<HaplogroupRecord>(AFRICAN_HAPLOGROUPS[0]);
  const [filterType, setFilterType] = useState<'All' | 'mtDNA (Maternal)' | 'Y-DNA (Paternal)'>('All');

  const filteredList = AFRICAN_HAPLOGROUPS.filter(h => filterType === 'All' || h.type === filterType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
              <Dna className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">
                Deep Kinship & DNA Haplogroup Mapper
              </h2>
              <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
                Phylogenetic maternal (mtDNA) & paternal (Y-DNA) lineages across African ethnolinguistic groups
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Lineage List */}
          <div className="space-y-3">
            <div className="flex gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-mono">
              {(['All', 'mtDNA (Maternal)', 'Y-DNA (Paternal)'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer truncate ${
                    filterType === t
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-bold shadow-xs'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  {t.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredList.map(item => {
                const isSelected = item.lineage === selectedLineage.lineage;
                return (
                  <button
                    key={item.lineage}
                    type="button"
                    onClick={() => setSelectedLineage(item)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-sm">{item.lineage}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                        {item.timeframe}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans line-clamp-1">
                      {item.rootOrigin}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Detailed Phylogeny & Prevalence */}
          <div className="md:col-span-2 space-y-4 bg-stone-50/50 dark:bg-stone-900/50 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  {selectedLineage.type}
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white">
                  {selectedLineage.lineage}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-stone-500 dark:text-stone-400 block">Root Origin</span>
                <span className="text-xs font-serif font-bold text-stone-700 dark:text-stone-300">{selectedLineage.rootOrigin}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-mono font-bold text-stone-500 uppercase tracking-wider block mb-1">Geographic Distribution & Migration</span>
                <p className="text-stone-700 dark:text-stone-300 font-sans leading-relaxed">
                  {selectedLineage.distribution}
                </p>
              </div>

              <div>
                <span className="font-mono font-bold text-stone-500 uppercase tracking-wider block mb-1">Historical & Population Significance</span>
                <p className="text-stone-700 dark:text-stone-300 font-sans leading-relaxed">
                  {selectedLineage.significance}
                </p>
              </div>

              <div>
                <span className="font-mono font-bold text-stone-500 uppercase tracking-wider block mb-2">Ethnolinguistic Prevalence Distribution</span>
                <div className="space-y-2">
                  {selectedLineage.prevalenceByGroup.map((gp, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-stone-700 dark:text-stone-300">{gp.group}</span>
                        <span className="font-bold text-amber-800 dark:text-amber-400">{gp.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-600 dark:bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${gp.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/80 flex items-center justify-between text-xs font-mono text-stone-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Genomic Phylogeny & Population Genetics Dataset</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close Mapper
          </button>
        </div>
      </motion.div>
    </div>
  );
};
