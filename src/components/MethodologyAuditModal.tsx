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
  BookOpen,
  RefreshCw,
  Sliders,
  Layers,
  FileCheck,
  Anchor,
  GitBranch
} from 'lucide-react';
import { 
  MULTILATERAL_HARMONIZATION_RULES, 
  DATASET_INTEGRITY_HASHES, 
  DatasetIntegrityHash,
  computeDatasetSha256InBrowser
} from '../data/methodologyDossierData';
import facts from '../../research/facts.json';

interface MethodologyAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCitationModal?: () => void;
}

type MethodologyTab = 'provenance' | 'flags' | 'voyages_ethnic' | 'hashes' | 'limitations';

interface HashVerificationState {
  status: 'idle' | 'verifying' | 'matched' | 'mismatch' | 'error';
  computedHash?: string;
  errorMessage?: string;
}

export const MethodologyAuditModal: React.FC<MethodologyAuditModalProps> = ({
  isOpen,
  onClose,
  onOpenCitationModal
}) => {
  const [activeTab, setActiveTab] = useState<MethodologyTab>('provenance');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [verificationStates, setVerificationStates] = useState<Record<string, HashVerificationState>>({});
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerifyHash = async (hashEntry: DatasetIntegrityHash) => {
    const key = hashEntry.fileScope;
    setVerificationStates(prev => ({
      ...prev,
      [key]: { status: 'verifying' }
    }));

    try {
      const computed = await computeDatasetSha256InBrowser(hashEntry.fileScope);
      const isMatch = computed.toLowerCase() === hashEntry.sha256.toLowerCase();
      setVerificationStates(prev => ({
        ...prev,
        [key]: {
          status: isMatch ? 'matched' : 'mismatch',
          computedHash: computed
        }
      }));
    } catch (err) {
      setVerificationStates(prev => ({
        ...prev,
        [key]: {
          status: 'error',
          errorMessage: err instanceof Error ? err.message : 'Unable to compute digest'
        }
      }));
    }
  };

  const handleVerifyAllHashes = async () => {
    setIsVerifyingAll(true);
    try {
      for (const entry of DATASET_INTEGRITY_HASHES) {
        await handleVerifyHash(entry);
      }
    } finally {
      setIsVerifyingAll(false);
    }
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
                  Methodological &amp; Data Provenance Dossier
                </h2>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                  Data Provenance, Status Flags, SlaveVoyages &amp; Ethnic Frameworks, and Build-Time SHA-256 Checksums
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

          {/* Navigation Bar */}
          <div className="bg-white/95 dark:bg-stone-900/95 border-b border-stone-200 dark:border-stone-800 px-6 py-3 shrink-0 shadow-xs">
            <div className="p-1 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center gap-1">
              <button
                onClick={() => setActiveTab('provenance')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'provenance'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>1. Data Provenance</span>
              </button>
              <button
                onClick={() => setActiveTab('flags')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'flags'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>2. Status Flags</span>
              </button>
              <button
                onClick={() => setActiveTab('voyages_ethnic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'voyages_ethnic'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                <Anchor className="w-3.5 h-3.5" />
                <span>3–4. Voyages &amp; Ethnic Framework</span>
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
                <span>5. Dataset Integrity (SHA-256)</span>
              </button>
              <button
                onClick={() => setActiveTab('limitations')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'limitations'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>6. Limitations &amp; FAIR</span>
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-stone-800 dark:text-stone-200 font-sans">
            {/* TAB 1: Data Provenance & Harmonization */}
            {activeTab === 'provenance' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif">
                    1. Data Provenance
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    The Atlas covers {facts.states} sovereign African states across {facts.pillars} thematic pillars. Socioeconomic indicators form a curated {facts.indicators.period} snapshot drawn from institutional sources (World Bank, IMF, UN DESA and others). Every value records its source, dataset and status, so you can see where a number comes from before using it.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold">
                    Cross-Source Reconciliation Rules
                  </h4>
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
                          Documented Rule
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800">
                          <span className="text-[10px] font-mono text-stone-400 block">Primary Source A:</span>
                          <span className="font-semibold text-stone-800 dark:text-stone-200">{rule.sourceA}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800">
                          <span className="text-[10px] font-mono text-stone-400 block">Primary Source B:</span>
                          <span className="font-semibold text-stone-800 dark:text-stone-200">{rule.sourceB}</span>
                        </div>
                      </div>

                      <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-amber-500/[0.04] p-3 rounded-xl border border-amber-500/20">
                        <strong className="text-stone-900 dark:text-stone-100 block mb-1">Reconciliation Rationale:</strong>
                        {rule.rationalization}
                      </div>

                      <div className="text-[11px] text-stone-500 font-mono">
                        <span className="font-bold">Reference Literature:</span> {rule.scholarlyPrecedent}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Status Flags */}
            {activeTab === 'flags' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif">
                    2. Status Flags
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    Every indicator observation in the {facts.indicators.period} snapshot carries an explicit status flag. Flags carry through to charts, tables and exports:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                      • Observed (status: &apos;observed&apos;)
                    </span>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      Reported directly by the originating source for that period (for example, national census counts or published World Bank WDI historical series).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 block">
                      • Estimated (status: &apos;estimated&apos;)
                    </span>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      Modelled, imputed or revised by the reporting source or by the Atlas (such as IMF WEO current-year estimates or inter-censal demographic models).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                      • Forecast (status: &apos;forecast&apos;)
                    </span>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      Projected beyond the latest empirical observation (such as UN DESA medium-variant population projections).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 block">
                      • Derived (status: &apos;derived&apos;)
                    </span>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      Calculated or back-filled from a baseline figure using a documented rule, with the specific rule recorded in the observation&apos;s <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-[10px]">notes</code> field.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Slave-Trade Figures & Ethnic Groups Framework */}
            {activeTab === 'voyages_ethnic' && (
              <div className="space-y-6">
                {/* Section 3: Slave-trade figures */}
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Anchor className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif">
                      3. Slave-Trade Figures
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    Headline totals come from the {facts.voyages.database}: <strong>{facts.voyages.documented.toLocaleString()} documented voyages</strong> between <strong>{facts.voyages.yearsObserved}</strong>. The Atlas shows summary statistics for the full database and <strong>{facts.voyages.curatedDossiers} individually curated voyage dossiers</strong>, each linked to its source record.
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block">
                      Three layers are kept apart:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 space-y-1">
                        <strong className="text-emerald-700 dark:text-emerald-400 font-mono block">Observed ({facts.voyages.yearsObserved})</strong>
                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                          Drawn directly from surviving logbooks, manifests, port ledgers and court records.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 space-y-1">
                        <strong className="text-amber-700 dark:text-amber-400 font-mono block">Imputed ({facts.voyages.yearsObserved})</strong>
                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                          Observed records with missing values (captives embarked, tonnage, flag) filled in by statistical methods.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 space-y-1">
                        <strong className="text-indigo-700 dark:text-indigo-400 font-mono block">Estimated ({facts.voyages.yearsEstimates})</strong>
                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                          Continental-level models that account for unrecorded voyages, so these totals cover a wider period ({facts.voyages.yearsEstimates}).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Ethnic groups and the clustering framework */}
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif">
                      4. Ethnic Groups and the Clustering Framework
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    The ethnic groups come from Wikipedia&apos;s <em>List of contemporary ethnic groups of Africa</em> ({facts.ethnicGroupList.entries} entries). The cartography is inspired by two population-genetic studies, <strong>Bird et al. (2023)</strong> and <strong>Tishkoff et al. (2009)</strong>. It uses them only for their clustering framework, meaning how genetic clusters relate to ethnicity, language and geography. It does not reproduce their samples or genetic data.
                  </p>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-medium bg-stone-50 dark:bg-stone-950 p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800">
                    Genetic ancestry, language, cultural identity and political classification are treated as related but separate categories, and the map does not equate them.
                  </p>
                  <div className="text-[11px] font-mono text-stone-500 space-y-1 pt-1">
                    <div>• Bird, N., et al. (2023). Dense sampling of ethnic groups within African countries reveals fine-scale genetic structure and extensive historical admixture. <em>Science Advances</em>, 9(13), eabq2616. https://doi.org/10.1126/sciadv.abq2616</div>
                    <div>• Tishkoff, S. A., et al. (2009). The genetic structure and history of Africans and African Americans. <em>Science</em>, 324(5930), 1035–1044. https://doi.org/10.1126/science.1172257</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Dataset Integrity (SHA-256 Checksums) */}
            {activeTab === 'hashes' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif">
                      5. Dataset Integrity
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">
                      Each foundational dataset has a published checksum so you can confirm your copy matches the release. Each SHA-256 checksum is computed from the file at build time. &ldquo;Verify&rdquo; re-computes the hash in your browser using the Web Crypto API and compares it with the published value. A mismatch means the file differs from the release.
                    </p>
                  </div>

                  <button
                    onClick={handleVerifyAllHashes}
                    disabled={isVerifyingAll}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-mono font-bold transition-colors shrink-0 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingAll ? 'animate-spin' : ''}`} />
                    <span>{isVerifyingAll ? 'Re-computing All...' : 'Verify All 8 Files'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {DATASET_INTEGRITY_HASHES.map((hash) => {
                    const state = verificationStates[hash.fileScope] || { status: 'idle' };
                    const isVerifying = state.status === 'verifying';
                    const isMatched = state.status === 'matched';
                    const isMismatch = state.status === 'mismatch' || state.status === 'error';

                    return (
                      <div 
                        key={hash.fileScope}
                        className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-xs text-stone-900 dark:text-stone-100 font-mono">
                              {hash.datasetName}
                            </span>
                            <span className="text-[10px] text-stone-500 block font-mono">
                              File: {hash.fileScope} • {hash.bytes.toLocaleString()} bytes • {hash.recordCount.toLocaleString()} records/nodes
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleVerifyHash(hash)}
                              disabled={isVerifying}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                                isMatched
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                  : isMismatch
                                  ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
                              }`}
                            >
                              {isVerifying ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : isMatched ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              ) : isMismatch ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                              ) : (
                                <Fingerprint className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {isVerifying
                                  ? 'Computing SHA-256...'
                                  : isMatched
                                  ? 'Checksum Matched'
                                  : isMismatch
                                  ? 'Mismatch / Error'
                                  : 'Verify'}
                              </span>
                            </button>

                            <button
                              onClick={() => handleCopy(hash.sha256, hash.fileScope)}
                              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 text-xs cursor-pointer"
                              title="Copy Published SHA-256 Checksum"
                            >
                              {copiedKey === hash.fileScope ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 font-mono text-[11px] text-stone-700 dark:text-stone-300 break-all border border-stone-200/80 dark:border-stone-800 space-y-1">
                          <div>Published SHA-256: {hash.sha256}</div>
                          {state.computedHash && (
                            <div className={isMatched ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                              Browser Computed : {state.computedHash}
                            </div>
                          )}
                          {state.errorMessage && (
                            <div className="text-rose-600 dark:text-rose-400">
                              Error: {state.errorMessage}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: Limitations & FAIR Open Science */}
            {activeTab === 'limitations' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif">
                    6. Limitations
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    <li>Indicator values are a snapshot ({facts.indicators.period}) and may lag the latest releases from their sources.</li>
                    <li>Wikipedia-derived group names, languages and homelands reflect that source and its editorial conventions, not a single scholarly classification.</li>
                    <li>Historical slave-trade records are incomplete; imputed and estimated figures depend on modelling assumptions.</li>
                    <li>Present-day borders do not map neatly onto historical territories or identities.</li>
                    <li>Cite the original source for any figure you rely on.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif">
                    What the Atlas Is, and Is Not
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    The Atlas is a visualization and aggregation layer. Indicator values are a curated snapshot rather than a live feed, and the slave-trade figures are summaries of an external database rather than a copy of it. Use the Provenance &amp; Data Quality console to check any figure&apos;s source and status before relying on it.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <strong className="text-amber-800 dark:text-amber-300 font-mono text-xs uppercase block">
                      1. Findable (F)
                    </strong>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      Machine-readable <code className="font-mono text-[10px]">CITATION.cff</code> metadata, author ORCID ({facts.orcid}){facts.doi ? `, universal Figshare DOI (${facts.doi})` : ''}, and indexed dataset manifests with build-time SHA-256 checksums.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <strong className="text-emerald-800 dark:text-emerald-300 font-mono text-xs uppercase block">
                      2. Accessible (A)
                    </strong>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      Zero paywalls, registration gates, or surveillance tracking. Open-access web delivery with offline PWA caching for field researchers.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <strong className="text-blue-800 dark:text-blue-300 font-mono text-xs uppercase block">
                      3. Interoperable (I)
                    </strong>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      Standard ISO-3166 alpha-3 entity keys, UN M49 geoscheme hierarchies, W3C SVG 1.1 geometry, and structured CSV / JSON / BibTeX exports.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <strong className="text-purple-800 dark:text-purple-300 font-mono text-xs uppercase block">
                      4. Reusable (R)
                    </strong>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      Dual-licensed: MIT License (<code className="font-mono text-[10px]">LICENSE-CODE</code>) for source code and CC BY 4.0 (<code className="font-mono text-[10px]">LICENSE-ASSETS</code>) for all SVG maps, the Ethnic Tree Visualization and SVG, and visualizations authored by ZéLuis F. Correia.
                    </p>
                  </div>
                </div>

                {/* Public Errata & Corrections Log (CORRECTIONS.md) */}
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-stone-800 dark:text-stone-200">
                        Public Errata &amp; Corrections Log (CORRECTIONS.md)
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        All data, status-flag, and attribution adjustments are logged in <code className="font-mono">CORRECTIONS.md</code> and guarded by <code className="font-mono">research/rules.json</code>.
                      </p>
                    </div>
                    <a
                      href="https://github.com/zeluis/Africa-Digital-Atlas/issues/new?template=data-correction.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold transition-colors shrink-0"
                    >
                      <span>Report a Data or Citation Correction</span>
                      <span>→</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-stone-600 dark:text-stone-400">
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800">
                      <span className="font-mono font-bold text-stone-800 dark:text-stone-200 block">CORR-2026-01 • Derived Status Flags</span>
                      Back-filled historical indicator points (2015, 2020, 2022) are tagged <code className="font-mono">status: &apos;derived&apos;</code> with scaling rules in <code className="font-mono">notes</code>.
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800">
                      <span className="font-mono font-bold text-stone-800 dark:text-stone-200 block">CORR-2026-02 • SlaveVoyages Scope</span>
                      Documented voyages span 1514–1866 (36,108 voyages; 18 dossiers), separated from 1501–1866 continental demographic estimates.
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800">
                      <span className="font-mono font-bold text-stone-800 dark:text-stone-200 block">CORR-2026-03 • Ethnic Groups &amp; Clustering</span>
                      310 contemporary ethnic groups from Wikipedia (2026-01); Bird et al. (2023) &amp; Tishkoff et al. (2009) cited for clustering framework only.
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800">
                      <span className="font-mono font-bold text-stone-800 dark:text-stone-200 block">CORR-2026-05/06 • SHA-256 &amp; Dual License</span>
                      Live Web Crypto API SHA-256 verifier, universal DOI (<code className="font-mono">10.6084/m9.figshare.34065711</code>), <code className="font-mono">LICENSE-CODE</code> (MIT) &amp; <code className="font-mono">LICENSE-ASSETS</code> (CC BY 4.0).
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shrink-0">
            <span className="text-xs text-stone-500 font-mono">
              Methodology &amp; Provenance Dossier • Browser SHA-256 Checksum Verifier
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
