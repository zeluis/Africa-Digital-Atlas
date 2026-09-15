import React from 'react';
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
  Users
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-in fade-in duration-300" id="privacy-section-view">
      
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
          Privacy Policy & Data Governance
        </span>
      </div>

      {/* Header Banner */}
      <header className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-10 shadow-sm relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="relative space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-xs font-mono font-semibold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Sovereign Data Governance & Privacy Framework</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
            Privacy Policy & Data Security Architecture
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            The Africa Data Atlas is committed to absolute data minimization, transparent open-source harmonization, and uncompromising user privacy. We protect your browsing confidentiality while providing authoritative socio-economic indicators across 54 sovereign African nations.
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Zero Third-Party Tracking Pixels</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Local Storage Only for User Preferences</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Open Data License (CC-BY-4.0)</span>
          </div>
        </div>
      </header>

      {/* Privacy Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Information Collection & Zero Tracking */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
            1. Zero Tracking & Data Minimization
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            We do not collect, store, or sell any personally identifiable information (PII). The Africa Data Atlas does not utilize intrusive advertising cookies, behavioral fingerprinting scripts, or cross-site tracking pixels. Your exploratory queries, comparative indicators, and reading history remain entirely private on your device.
          </p>
        </div>

        {/* Section 2: Client-Side Local Storage */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/80 flex items-center justify-center text-teal-700 dark:text-teal-300">
            <Server className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
            2. Local Storage & Preferences
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            To enhance your experience, we store lightweight preferences directly in your browser's local storage (such as your preferred light/dark theme, selected language, onboarding completion status, and bookmarked country entities). This information never leaves your browser and can be cleared instantly by wiping browser data.
          </p>
        </div>

        {/* Section 3: Harmonized Public Data Sources */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-700 dark:text-amber-300">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
            3. Harmonized Public Data Sources
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            All macroeconomic, demographic, climate, and heritage datasets presented in this platform are aggregated from verified public international bodies (World Bank Data API, IMF World Economic Outlook, UN DESA Population Division, UNESCO World Heritage Centre, and Open-Meteo). These institutions maintain their own independent privacy and data governance policies.
          </p>
        </div>

        {/* Section 4: Security & Audio Narration Privacy */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
            <Key className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
            4. Audio Narration & Synthesis Security
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Our multi-lingual text-to-speech audio engine utilizes either your browser's secure native operating system speech synthesis API or encrypted server-side neural speech synthesis proxies. No voice recordings or biometric speech samples are ever recorded, saved, or shared with third parties.
          </p>
        </div>

      </div>

      {/* Licensing and Open Access Callout */}
      <div className="p-8 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 space-y-4">
        <div className="flex items-center gap-3">
          <Globe2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-serif font-bold text-emerald-950 dark:text-emerald-200">
            Open Access & Creative Commons Licensing (CC-BY-4.0)
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
          The software architecture, visual cartography designs, and harmonized statistical metadata models of the Africa Data Atlas are distributed under the Creative Commons Attribution 4.0 International License (CC-BY-4.0). You are free to share, adapt, and build upon this platform provided appropriate scholarly attribution is given.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigateTab('provenance')}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-2"
          >
            <span>View Data Pipeline & Provenance Audit</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onBackToOverview}
            className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 font-medium text-xs transition-colors cursor-pointer"
          >
            Return to Overview
          </button>
        </div>
      </div>

    </div>
  );
};
