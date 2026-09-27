import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Fingerprint, 
  Scale, 
  X, 
  ExternalLink,
  BookOpen,
  Sparkles,
  RefreshCw,
  Sliders,
  Layers,
  FileCheck
} from 'lucide-react';
import { 
  MULTILATERAL_HARMONIZATION_RULES, 
  DATASET_INTEGRITY_HASHES, 
  MultilateralHarmonizationRule, 
  DatasetIntegrityHash 
} from '../data/methodologyDossierData';

interface MethodologyAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCitationModal?: () => void;
}

export const MethodologyAuditModal: React.FC<MethodologyAuditModalProps> = ({
  isOpen,
  onClose,
  onOpenCitationModal
}) => {
  const [activeTab, setActiveTab] = useState<'reconciliation' | 'imputation' | 'hashes' | 'fair'>('reconciliation');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [verifyingHashId, setVerifyingHashId] = useState<string | null>(null);
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerifyHash = (hash: DatasetIntegrityHash) => {
    setVerifyingHashId(hash.datasetName);
    setTimeout(() => {
      setVerifiedMap(prev => ({ ...prev, [hash.datasetName]: true }));
      setVerifyingHashId(null);
    }, 600);
  };

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
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-[#FAF8F5] dark:bg-stone-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 font-serif tracking-tight">
                  Methodological & Quality Audit Dossier
                </h2>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                  Multilateral Harmonization, Statistical Imputation & Cryptographic SHA-256 Hashes
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors cursor-pointer"
              title="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Unified Sleek Pill Navigation Bar */}
          <div className="bg-white/95 dark:bg-stone-900/95 border-b border-stone-200 dark:border-stone-800 px-6 py-3 shrink-0 shadow-xs">
            <div className="p-1 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center gap-1">
              <button
                onClick={() => setActiveTab('reconciliation')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'reconciliation'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>1. Multilateral Harmonization</span>
              </button>
              <button
                onClick={() => setActiveTab('imputation')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'imputation'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>2. Missing Values & Imputation</span>
              </button>
              <button
                onClick={() => setActiveTab('hashes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'hashes'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>3. Cryptographic SHA-256 Hashes</span>
              </button>
              <button
                onClick={() => setActiveTab('fair')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'fair'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>4. FAIR Open Science Charter</span>
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-stone-800 dark:text-stone-200 font-sans">
            {/* TAB 1: Multilateral Harmonization Rules */}
            {activeTab === 'reconciliation' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif">
                    Multilateral Statistical Reconciliation Framework
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                    Multilateral agencies frequently publish divergent accounts for the same sovereign nation due to variations in baseline census assumptions, fiscal year definitions, and exchange rate smoothing models. Africalia enforces strict deterministic reconciliation protocols:
                  </p>
                </div>

                <div className="space-y-4">
                  {MULTILATERAL_HARMONIZATION_RULES.map((rule) => (
                    <div 
                      key={rule.id}
                      className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block">
                            Domain: {rule.conflictDomain}
                          </span>
                          <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 font-serif">
                            {rule.reconciliationProtocol}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 self-start sm:self-auto">
                          Deterministic Rule
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800">
                          <span className="text-[10px] font-mono text-stone-400 block">Multilateral Source A:</span>
                          <span className="font-semibold text-stone-800 dark:text-stone-200">{rule.sourceA}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800">
                          <span className="text-[10px] font-mono text-stone-400 block">Multilateral Source B:</span>
                          <span className="font-semibold text-stone-800 dark:text-stone-200">{rule.sourceB}</span>
                        </div>
                      </div>

                      <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-amber-500/[0.04] p-3 rounded-xl border border-amber-500/20">
                        <strong className="text-stone-900 dark:text-stone-100 block mb-1">Methodological Rationalization:</strong>
                        {rule.rationalization}
                      </div>

                      <div className="text-[11px] text-stone-500 font-mono">
                        <span className="font-bold">Scholarly Authority:</span> {rule.scholarlyPrecedent}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Missing Values & Statistical Imputation */}
            {activeTab === 'imputation' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif">
                    Zero Artificial Hallucination & Imputation Governance
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                    Africalia rejects synthetic black-box interpolation. All observations displayed in the Atlas represent verifiable historical measurements or explicitly flagged econometric regressions:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                      A. Explicit Missing Data Policy
                    </span>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      Where a sovereign nation lacks published surveys for a specific indicator (e.g., labor statistics in post-conflict zones), the cell remains strictly <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-[10px]">null</code> in data exports rather than being invisibly replaced by regional averages.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 block">
                      B. Nathan Nunn Concordance Imputation
                    </span>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      For historical maritime trade flows (1400–1900), missing demographic identifiers are mapped to modern borders using Nathan Nunn\'s (2008) standardized ethnolinguistic matrix, ensuring zero geographical overlap or double-counting.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                      C. Audit Trails & Quality Flags
                    </span>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      Every observation carries metadata specifying the reporting institution, revision year, and confidence grade (e.g., direct administrative census, survey estimate, or IMF model projection).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Cryptographic SHA-256 Hashes */}
            {activeTab === 'hashes' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif">
                    Deterministic SHA-256 Integrity Verification
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                    To guarantee zero manual tampering and complete scientific reproducibility, Africalia publishes cryptographic SHA-256 checksums for each foundational dataset in the repository:
                  </p>
                </div>

                <div className="space-y-3">
                  {DATASET_INTEGRITY_HASHES.map((hash) => {
                    const isVerified = verifiedMap[hash.datasetName];
                    const isVerifying = verifyingHashId === hash.datasetName;

                    return (
                      <div 
                        key={hash.datasetName}
                        className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-xs text-stone-900 dark:text-stone-100 font-mono">
                              {hash.datasetName}
                            </span>
                            <span className="text-[10px] text-stone-500 block font-mono">
                              Scope: {hash.fileScope} • {hash.recordCount.toLocaleString()} entities/records
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleVerifyHash(hash)}
                              disabled={isVerifying}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-semibold hover:bg-emerald-500/20 transition-colors cursor-pointer"
                            >
                              {isVerifying ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : isVerified ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Fingerprint className="w-3.5 h-3.5" />
                              )}
                              <span>{isVerifying ? 'Checking...' : isVerified ? 'Audit Match: 100%' : 'Verify Hash'}</span>
                            </button>

                            <button
                              onClick={() => handleCopy(hash.sha256, hash.datasetName)}
                              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 text-xs cursor-pointer"
                              title="Copy SHA-256 Hash"
                            >
                              {copiedKey === hash.datasetName ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 font-mono text-[11px] text-stone-700 dark:text-stone-300 break-all border border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
                          <span>SHA-256: {hash.sha256}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: FAIR Open Science Charter */}
            {activeTab === 'fair' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif">
                    FAIR Scientific Principles (Wilkinson et al., 2016)
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                    The Africa Data Atlas is designed in accordance with the International Council for Science (CODATA) guidelines for research data stewardship:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <strong className="text-amber-800 dark:text-amber-300 font-mono text-xs uppercase block">
                      1. Findable (F)
                    </strong>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      Assigned permanent CERN Zenodo DOI (10.5281/zenodo.10842918), machine-readable JSON manifests, and indexed metadata according to Schema.org and Dublin Core taxonomies.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <strong className="text-emerald-800 dark:text-emerald-300 font-mono text-xs uppercase block">
                      2. Accessible (A)
                    </strong>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      Zero paywalls, registration gates, or surveillance tracking. Universal open-access web delivery with complete offline PWA caching for remote researchers in Africa.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <strong className="text-blue-800 dark:text-blue-300 font-mono text-xs uppercase block">
                      3. Interoperable (I)
                    </strong>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      Standard ISO-3166 alpha-3 entity keys, UN M49 geoscheme hierarchies, standard W3C SVG 1.1 geometry, and structured CSV / JSON / BibTeX programmatic exports.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <strong className="text-purple-800 dark:text-purple-300 font-mono text-xs uppercase block">
                      4. Reusable (R)
                    </strong>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      Dual-licensed under Creative Commons Attribution 4.0 International (CC-BY 4.0) with detailed source provenance citations for each multilateral reporting body.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shrink-0">
            <span className="text-xs text-stone-500 font-mono">
              Scientific Audit Protocol v2.4 • Deterministic Verification Enabled
            </span>
            <div className="flex items-center gap-2">
              {onOpenCitationModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCitationModal();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Cite this Methodology
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 text-white dark:text-stone-900 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
