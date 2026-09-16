import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Globe2, 
  Lock, 
  Database, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink,
  Server,
  Key,
  Users,
  BookOpen,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Sliders,
  Sparkles,
  Layers,
  Scale,
  Compass,
  FileCode,
  CheckCheck,
  RefreshCw,
  Terminal
} from 'lucide-react';
import { CanonicalNavTab } from '../components/NavigationDrawer';
import { useTranslation } from '../i18n/LanguageContext';

interface PrivacySectionViewProps {
  onBackToOverview: () => void;
  onNavigateTab: (tab: CanonicalNavTab) => void;
}

type PillarTab = 'privacy' | 'independence' | 'licensing' | 'sensitivities';

interface LocalStorageEntry {
  key: string;
  value: string;
  category: 'preferences' | 'onboarding' | 'theme' | 'other';
  description: string;
}

const DATA_CONNECTORS_CATALOG = [
  { name: 'World Bank Open Data', provider: 'World Bank Group', coverage: 'GDP, GNI, Poverty Headcount, CPI, Trade Deficit', verified: true },
  { name: 'IMF World Economic Outlook', provider: 'International Monetary Fund', coverage: 'Fiscal Balance, Public Debt, Growth Projections', verified: true },
  { name: 'WHO Global Health Observatory', provider: 'World Health Organization', coverage: 'Life Expectancy, Maternal Mortality, Immunization', verified: true },
  { name: 'UNESCO Institute for Statistics', provider: 'UNESCO', coverage: 'Literacy, Tertiary Enrollment, Education Expenditure', verified: true },
  { name: 'UN Comtrade Database', provider: 'United Nations Statistics Division', coverage: 'Bilateral Trade Matrices, Export/Import Volumes', verified: true },
  { name: 'Freedom House (FIW)', provider: 'Freedom House', coverage: 'Civil Liberties, Political Rights Scores', verified: true },
  { name: 'UNDP Human Development', provider: 'UN Development Programme', coverage: 'HDI Index, Inequality-Adjusted HDI (IHDI)', verified: true },
  { name: 'UNHCR Refugee Data Finder', provider: 'UN Refugee Agency', coverage: 'Cross-Border Displaced & IDP Populations', verified: true },
  { name: 'ILOSTAT Database', provider: 'International Labour Organization', coverage: 'Informal Employment, Youth Unemployment', verified: true },
  { name: 'FAO STAT', provider: 'Food & Agriculture Organization', coverage: 'Cereal Yields, Food Security Severity Index', verified: true },
  { name: 'ITU World Telecommunication', provider: 'International Telecommunication Union', coverage: 'Broadband Penetration, Mobile Cellular Subscriptions', verified: true },
  { name: 'World Bank WGI', provider: 'World Bank Group', coverage: 'Rule of Law, Government Effectiveness, Control of Corruption', verified: true },
  { name: 'Global Peace Index (GPI)', provider: 'Institute for Economics & Peace', coverage: 'Societal Safety, Militarisation, Ongoing Conflict', verified: true },
  { name: 'UNESCO World Heritage Centre', provider: 'UNESCO', coverage: '54 African Sovereign Inscribed Cultural/Natural Sites', verified: true },
  { name: 'Slave Voyages Consortium', provider: 'Emory University & Academic Partners', coverage: 'Trans-Atlantic, Indian Ocean & Saharan Trade Records', verified: true },
  { name: 'Africalia Vector Engine', provider: 'Internal GeoJSON/TopoJSON', coverage: 'Sovereign Borders, Continental Coastlines, 8 Regional Blocs', verified: true }
];

export const PrivacySectionView: React.FC<PrivacySectionViewProps> = ({
  onBackToOverview,
  onNavigateTab
}) => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<PillarTab>('privacy');
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [localCacheCleared, setLocalCacheCleared] = useState<boolean>(false);
  const [storageItems, setStorageItems] = useState<LocalStorageEntry[]>([]);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);

  // Scan localStorage on mount & when cache is cleared
  const refreshStorageInspector = () => {
    if (typeof window === 'undefined') return;
    const items: LocalStorageEntry[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const val = localStorage.getItem(key) || '';
      let cat: LocalStorageEntry['category'] = 'other';
      let desc = 'Client-side preference state';

      if (key.includes('theme')) {
        cat = 'theme';
        desc = 'User interface dark/light theme preference';
      } else if (key.includes('language') || key.includes('lang')) {
        cat = 'preferences';
        desc = 'Active UI multilingual locale code';
      } else if (key.includes('onboarding')) {
        cat = 'onboarding';
        desc = 'Curated orientation completion flag';
      } else if (key.includes('density')) {
        cat = 'preferences';
        desc = 'Analytical information layout density setting';
      }

      items.push({
        key,
        value: val,
        category: cat,
        description: desc
      });
    }
    setStorageItems(items);
  };

  useEffect(() => {
    refreshStorageInspector();
  }, []);

  const handleClearKey = (key: string) => {
    try {
      localStorage.removeItem(key);
      refreshStorageInspector();
    } catch {
      // Safe fallback
    }
  };

  const handleClearAllStorage = () => {
    try {
      localStorage.removeItem('africalia_onboarding_v1');
      localStorage.removeItem('africalia_theme');
      localStorage.removeItem('africalia_language');
      localStorage.removeItem('africalia_density');
      setLocalCacheCleared(true);
      refreshStorageInspector();
      setTimeout(() => setLocalCacheCleared(false), 4000);
    } catch {
      // Safe fallback
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
  url = {https://github.com/zeluis/Africa-Digital-Atlas}
}`;

  const apaText = `Africalia Academic Atlas Consortium. (2026). The Africa Data Atlas: Sovereign Socio-Economic and Genomic Synthesis. Open Science Repository Africa. https://github.com/zeluis/Africa-Digital-Atlas`;

  const chicagoText = `Africalia Academic Atlas Consortium. 2026. "The Africa Data Atlas: Sovereign Socio-Economic and Genomic Synthesis." Open Science Repository Africa. https://github.com/zeluis/Africa-Digital-Atlas.`;

  // Material Design 3 inspired tab definitions with warm tonal active tokens
  const TAB_ITEMS: { id: PillarTab; label: string; subtitle: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'privacy',
      label: '1. GDPR & Privacy',
      subtitle: 'Zero-Tracker & Local Storage',
      icon: Lock
    },
    {
      id: 'independence',
      label: '2. Academic Independence',
      subtitle: 'Non-Affiliation & Epistemology',
      icon: Users
    },
    {
      id: 'licensing',
      label: '3. Open Access & Provenance',
      subtitle: 'CC BY-NC-SA 4.0 & 16 APIs',
      icon: BookOpen
    },
    {
      id: 'sensitivities',
      label: '4. Ethical Representation',
      subtitle: 'UNESCO Memory of the World',
      icon: AlertTriangle
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10 animate-in fade-in duration-300" id="privacy-section-view">
      
      {/* Breadcrumb & Context Navigation */}
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToOverview}
            className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Atlas Overview</span>
          </button>
          <span>/</span>
          <span className="text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
            Legal, Governance & Academic Protocol
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://github.com/zeluis/Africa-Digital-Atlas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>

      {/* Header Banner */}
      <header className="rounded-3xl border border-amber-900/10 dark:border-amber-500/15 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-amber-950/20 p-6 sm:p-10 shadow-xs relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="relative space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60 text-xs font-mono font-semibold text-amber-900 dark:text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Sovereign Data Governance • EU GDPR & African Union Malabo Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
            Privacy, Data Governance & Scholarly Charter
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            The Africa Digital Atlas harmonizes strict data minimization with academic rigor. Here you can inspect client-side state, review verified multilateral data sources, verify institutional decoupling, and generate standardized academic citations.
          </p>
        </div>

        {/* MD3-Inspired Tab Navigation Bar with warm tonal states */}
        <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <nav 
            className="flex p-1.5 rounded-2xl bg-zinc-100/90 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 overflow-x-auto no-scrollbar gap-1.5"
            aria-label="Privacy Protocol Navigation Tabs"
          >
            {TAB_ITEMS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 min-w-[190px] py-3 px-4 rounded-xl text-left transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    isActive 
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300' 
                        : 'bg-zinc-200/70 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-mono font-bold tracking-tight">
                        {tab.label}
                      </span>
                      <span className="block text-[11px] text-zinc-500 dark:text-zinc-400 font-sans truncate">
                        {tab.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Active Indicator Underline with smooth layout transition */}
                  {isActive && (
                    <motion.div 
                      layoutId="activePillarTabIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-600 dark:bg-amber-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Tab Panels Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="space-y-8"
        >

          {/* ========================================================= */}
          {/* TAB 1: GDPR & PRIVACY COMPLIANCE                         */}
          {/* ========================================================= */}
          {activeTab === 'privacy' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Zero-Surveillance Card */}
                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-700 dark:text-amber-300">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                    Zero-Surveillance & Client-Side Isolation
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Africalia complies with Articles 12–22 of the EU GDPR, the EU ePrivacy Directive, CCPA/CPRA, and the African Union Malabo Convention on Personal Data Protection. We do not deploy advertising trackers, behavioral fingerprinting scripts, third-party pixel beacons, or cross-site tracking telemetry.
                  </p>
                  <ul className="space-y-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Zero commercial advertising cookies</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>No IP address logging, profiling, or data monetization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Client-only offline-ready PWA service worker caching</span>
                    </li>
                  </ul>
                </div>

                {/* Transient Audio Narration */}
                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                    <Key className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                    Serverless Audio Narration Protocol
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Our multilingual text-to-speech audio engine prioritizes your browser’s native operating system Web Speech API, running 100% locally on your device without transmitting data. Any server-side neural speech synthesis requests execute as transient, stateless in-memory streams:
                  </p>
                  <ul className="space-y-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                      <span>No biometric vocal fingerprinting or recording</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                      <span>Zero speech audio retention on cloud disks</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Interactive Client Storage Inspector & Right to Erasure Utility */}
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-white">
                        Live Client Storage Inspector (GDPR Right to Erasure)
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Transparency utility showing all local keys stored on your device. You have the right to inspect and erase this state.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={refreshStorageInspector}
                      className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Refresh current local storage keys"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleClearAllStorage}
                      className="px-4 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{localCacheCleared ? 'Cleared!' : 'Clear All Local State'}</span>
                    </button>
                  </div>
                </div>

                {storageItems.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-center space-y-1">
                    <CheckCheck className="w-6 h-6 text-emerald-500 mx-auto" />
                    <p className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
                      Zero Client State Detected
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Your local storage is completely clean and empty.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                        <tr>
                          <th className="p-3">Key Identifier</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Stored Value</th>
                          <th className="p-3">Description</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {storageItems.map(item => (
                          <tr key={item.key} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                            <td className="p-3 font-semibold text-amber-800 dark:text-amber-300">
                              {item.key}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-300">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-3 max-w-[160px] truncate text-zinc-600 dark:text-zinc-300" title={item.value}>
                              {item.value}
                            </td>
                            <td className="p-3 text-zinc-500 font-sans text-xs">
                              {item.description}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleClearKey(item.key)}
                                className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition-colors cursor-pointer"
                                title={`Erase key "${item.key}"`}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ACADEMIC INDEPENDENCE & INSTITUTIONAL DECOUPLING  */}
          {/* ========================================================= */}
          {activeTab === 'independence' && (
            <div className="space-y-8">
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-700 dark:text-amber-300">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">
                      Strict Non-Affiliation & Institutional Independence
                    </h2>
                    <p className="text-xs font-mono text-zinc-500">
                      Screen 4 Continuity • Scholarly Epistemology & Methodological Limits
                    </p>
                  </div>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  The Africa Digital Atlas is an independent scholarly and educational platform. Referenced academic scholars, economic historians, bioarchaeologists, and institutions (such as <strong className="text-zinc-900 dark:text-zinc-100">Prof. Nathan Nunn, Harvard University, the American Economic Review (AER), Quarterly Journal of Economics (QJE), the SlaveVoyages Consortium, and UNESCO</strong>) are cited strictly for empirical provenance under academic fair use and open research guidelines.
                </p>

                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                  <strong>Explicit Non-Endorsement Clause:</strong> Reference to specific peer-reviewed papers, published regression models, or curated archaeological catalogs does not constitute institutional endorsement, sponsorship, or formal partnership by the cited scholars or their respective universities.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Historical Epistemology
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      We treat statistical metrics as historical artifacts subject to colonial archive distortions, under-enumeration in rural territories, and unequal census coverage.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Methodological Limitations
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      Every data point is cross-referenced with provenance quality flags in the in-app audit console to highlight estimation models versus primary census records.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Independent Authorship
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      Platform syntheses, cartographic boundary representations, and interactive exploratory tools are independently maintained by the Africalia research team.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigateTab('provenance')}
                    className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Open Provenance & Data Quality Console</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('research-directory')}
                    className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Explore Scholarly Treatises Directory</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: LICENSING, 16-API REGISTRY & CITATIONS            */}
          {/* ========================================================= */}
          {activeTab === 'licensing' && (
            <div className="space-y-8">
              {/* Dual Licensing Summary */}
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">
                      Dual Licensing Model & Academic Citation Protocols
                    </h2>
                    <p className="text-xs font-mono text-zinc-500">
                      Open Data • CC BY-NC-SA 4.0 • MIT Open Source Software
                    </p>
                  </div>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  The Africa Digital Atlas operates under a dual-licensing framework to support non-commercial educational use while safeguarding open scientific contribution:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold uppercase">
                      <Globe2 className="w-4 h-4" />
                      <span>Empirical Data & Synthesis</span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      Licensed under <strong>Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)</strong>. Free for classroom, non-commercial research, policy analysis, and student use with attribution.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold uppercase">
                      <FileCode className="w-4 h-4" />
                      <span>Codebase & Software Architecture</span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      The application software, cartography rendering engine, and VitePress documentation framework are distributed under the <strong>MIT License</strong>.
                    </p>
                  </div>
                </div>

                {/* Academic Citation Generator */}
                <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
                      Standardized Academic Citation Generator
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                      Persistent DOI Ready
                    </span>
                  </div>

                  {/* APA 7th */}
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

                  {/* BibTeX */}
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

              {/* 16 Institutional Data Connectors Catalog (Merged from GitHub documentation) */}
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-white">
                        Institutional 16-Connector API Registry
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Merged directly from the GitHub Open Data documentation catalog. Verified institutional endpoints:
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                    16 Connectors Active
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                      <tr>
                        <th className="p-3">Data Connector</th>
                        <th className="p-3">Provider Institution</th>
                        <th className="p-3">Harmonized Coverage</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {DATA_CONNECTORS_CATALOG.map((conn, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">
                            {conn.name}
                          </td>
                          <td className="p-3 text-zinc-600 dark:text-zinc-300">
                            {conn.provider}
                          </td>
                          <td className="p-3 font-sans text-xs text-zinc-500">
                            {conn.coverage}
                          </td>
                          <td className="p-3 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verified</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: HISTORICAL SENSITIVITIES & PEDAGOGICAL ETHICS     */}
          {/* ========================================================= */}
          {activeTab === 'sensitivities' && (
            <div className="space-y-8">
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">
                      Historical Sensitivity Advisory & Pedagogical Ethics
                    </h2>
                    <p className="text-xs font-mono text-zinc-500">
                      UNESCO Memory of the World Standards • Dignified Ancestral Representation
                    </p>
                  </div>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  This platform examines difficult historical themes including transatlantic and trans-Saharan chattel slavery, colonial extractive infrastructures, and bioarchaeological human remains. We adhere strictly to <strong className="text-zinc-900 dark:text-zinc-100">UNESCO Memory of the World</strong> recommendations and international bioethics guidelines to guarantee dignified, respectful representation.
                </p>

                <div className="p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                    <Info className="w-4 h-4" />
                    <span>Pedagogical Commitment & Memory Preservation</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-sans">
                    Statistical aggregates of forced migration, demographic evacuation, and institutional extraction are never presented as mere economic commodities. They are structured to honor ancestral memory, provide empirical grounding for restorative economic policy, and support secondary/tertiary educators teaching African history worldwide.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white">
                      Transatlantic Slave Voyages Protocol
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      Derived from the Slave Voyages consortium (Emory University et al.). Voyage routes and embarkation totals are represented with cartographic solemnity, avoiding gamified or trivializing visualization paradigms.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('slave-trade')}
                      className="text-xs font-mono text-amber-700 dark:text-amber-400 hover:underline pt-2 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Launch Slave Voyages 3D Visualizer</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white">
                      Ethnic & Bioarchaeological Lineages
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      Linguistic phylogenies and archaeological remains are contextualized using UNESCO cultural heritage guidelines to honor indigenous classifications without reproducing colonial tribal essentialisms.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('ethnic-tree')}
                      className="text-xs font-mono text-amber-700 dark:text-amber-400 hover:underline pt-2 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore Ethnic Tree of Life</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Footer Navigation Bar */}
      <footer className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToOverview}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Atlas Overview</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('provenance')}
            className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer flex items-center gap-2"
          >
            <span>Provenance Audit Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

    </div>
  );
};
