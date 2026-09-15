import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe2, 
  Lock, 
  FileText, 
  Database, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink,
  Server,
  Key,
  Users,
  Scale,
  BookOpen,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Sliders
} from 'lucide-react';
import { CanonicalNavTab } from '../components/NavigationDrawer';
import { useTranslation } from '../i18n/LanguageContext';

interface PrivacySectionViewProps {
  onBackToOverview: () => void;
  onNavigateTab: (tab: CanonicalNavTab) => void;
}

export const PrivacySectionView: React.FC<PrivacySectionViewProps> = ({
  onBackToOverview,
  onNavigateTab
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'privacy' | 'independence' | 'licensing' | 'sensitivities'>('privacy');
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [localCacheCleared, setLocalCacheCleared] = useState<boolean>(false);

  // Inspect local storage items
  const localKeysCount = typeof window !== 'undefined' ? localStorage.length : 0;
  
  const handleClearLocalCache = () => {
    try {
      localStorage.removeItem('africalia_onboarding_v1');
      localStorage.removeItem('africalia_theme');
      localStorage.removeItem('africalia_language');
      setLocalCacheCleared(true);
      setTimeout(() => setLocalCacheCleared(false), 4000);
    } catch {
      // safe fallback
    }
  };

  const handleCopyCitationText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitation(type);
    setTimeout(() => setCopiedCitation(null), 3000);
  };

  const bibtexText = `@misc{africalia2026,
  author = {Africalia Academic Atlas Consortium},
  title = {The Africa Data Atlas: Sovereign Socio-Economic and Genomic Synthesis},
  year = {2026},
  publisher = {Open Science Repository Africa},
  url = {https://ai.studio/build}
}`;

  const apaText = `Africalia Academic Atlas Consortium. (2026). The Africa Data Atlas: Sovereign Socio-Economic and Genomic Synthesis. Open Science Repository Africa.`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-in fade-in duration-300" id="privacy-section-view">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
        <button
          type="button"
          onClick={onBackToOverview}
          className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Atlas Overview</span>
        </button>
        <span>/</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
          Privacy Policy & Academic Protocol
        </span>
      </div>

      {/* Header Banner */}
      <header className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-10 shadow-sm relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="relative space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-xs font-mono font-semibold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>GDPR / CCPA Compliant • Academic & Institutional Integrity Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
            Privacy, Data Governance & Scholarly Charter
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            Africalia combines rigorous EU GDPR compliance, absolute client-side data minimization, open-source FAIR data principles, and strict academic institutional independence.
          </p>
        </div>

        {/* Pillar Navigation Tabs */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'privacy' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>1. GDPR & Privacy Compliance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('independence')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'independence' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Academic Independence</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('licensing')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'licensing' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>3. Open Access & Licensing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sensitivities')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'sensitivities' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>4. Historical Sensitivities</span>
          </button>
        </div>
      </header>

      {/* TAB 1: GDPR & PRIVACY COMPLIANCE */}
      {activeTab === 'privacy' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                Zero-Surveillance & Client-Side Architecture
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Africalia complies strictly with Articles 12–22 of the EU GDPR, the ePrivacy Directive, and CCPA/CPRA standards. We do not deploy advertising trackers, behavioral fingerprinting scripts, third-party pixel beacons, or cross-site tracking telemetry.
              </p>
              <ul className="space-y-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>No cookies used for ad retargeting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>No IP address logging or monetization</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/80 flex items-center justify-center text-teal-700 dark:text-teal-300">
                <Server className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                Client-Side State & Local Storage
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                All active user state (selected language, theme preference, onboarding progress, and reading history) is stored strictly client-side using browser <code className="text-emerald-600 dark:text-emerald-400">localStorage</code>. No profiling data is transmitted to remote servers.
              </p>
              
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span>Local Keys Detected:</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{localKeysCount} items</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearLocalCache}
                  className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{localCacheCleared ? 'Local Cache Wiped Clean!' : 'Reset & Wipe Local State (Right to Erasure)'}</span>
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4 md:col-span-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                <Key className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                Serverless & Transient Audio Speech Protocol
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Audio requests via the native Web Speech API execute 100% locally on your hardware and operating system. Any server-proxied neural TTS requests are processed as transient, stateless in-memory streams without retention, logging, or biometric vocal fingerprinting.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: ACADEMIC INDEPENDENCE */}
      {activeTab === 'independence' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-700 dark:text-amber-300">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">
                Explicit Institutional Decoupling & Scholarly Integrity
              </h2>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Africalia is an independent educational and scholarly digital atlas. Referenced university scholars, economic historians, bioarchaeologists, and institutions (such as Prof. Nathan Nunn, Harvard University, AER, QJE, the SlaveVoyages Consortium, and UNESCO) are cited strictly for empirical provenance under academic fair use. They are not institutional affiliates, sponsors, or commercial partners of the platform unless explicitly stated.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Data Provenance
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  Aggregated from peer-reviewed repositories, World Bank Open Data, UN DESA, and historical trade archives.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Methodological Limits
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  Explicit advisories acknowledge historical record asymmetries, colonial archive gaps, and the evolving nature of paleogenomic samples.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Author Decoupling
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  All platform syntheses are independently authored to serve educators, students, and researchers globally.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LICENSING & CITATION */}
      {activeTab === 'licensing' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                <Globe2 className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">
                Dual Licensing Model & Academic Citations
              </h2>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Empirical data and interactive syntheses are licensed under <strong className="text-zinc-900 dark:text-white">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)</strong> for non-commercial educational and scholarly research use. Source code is provided under the <strong className="text-zinc-900 dark:text-white">MIT License</strong>.
            </p>

            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
                Standardized Academic Citation Generator
              </h3>

              {/* APA Format */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">APA 7th Edition</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCitationText(apaText, 'apa')}
                    className="px-3 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCitation === 'apa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCitation === 'apa' ? 'Copied APA' : 'Copy APA'}</span>
                  </button>
                </div>
                <p className="text-xs font-serif text-zinc-600 dark:text-zinc-400 italic">
                  {apaText}
                </p>
              </div>

              {/* BibTeX Format */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">BibTeX Format</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCitationText(bibtexText, 'bibtex')}
                    className="px-3 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCitation === 'bibtex' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCitation === 'bibtex' ? 'Copied BibTeX' : 'Copy BibTeX'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 overflow-x-auto p-2 rounded bg-zinc-200/50 dark:bg-zinc-900/50">
                  {bibtexText}
                </pre>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HISTORICAL SENSITIVITIES */}
      {activeTab === 'sensitivities' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 flex items-center justify-center text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">
                Historical Sensitivity & Ethical Representation Advisory
              </h2>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              This platform examines difficult historical themes including transatlantic chattel slavery, colonial extraction, and bioarchaeological human remains. We adhere strictly to UNESCO Memory of the World guidelines and international bioethics treaties to ensure dignified, respectful, and pedagogically sound representation.
            </p>

            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Info className="w-4 h-4" />
                <span>Pedagogical Commitment</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
                Statistical metrics concerning forced migration, demographic evacuation, and institutional extraction are presented to honor ancestral memory, foster structural understanding, and advance evidence-based policy dialogue across Africa and the global diaspora.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToOverview}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Atlas Overview</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('provenance')}
          className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer flex items-center gap-2"
        >
          <span>View Data Pipeline Provenance</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
