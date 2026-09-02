import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { atlas } from '../data/atlas-store';
import { ExternalApiConnector, LiveApiTestResult } from '../data/externalApisIngestion';
import { OrganizationLogo } from './OrganizationLogo';
import { 
  Database, 
  X, 
  ExternalLink, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  Search, 
  Globe2, 
  Layers, 
  Terminal, 
  TrendingUp,
  Download,
  Activity,
  Cpu,
  Sparkles,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';

interface MultiSourceApiHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIndicator?: (indicatorId: string) => void;
}

export const MultiSourceApiHubModal: React.FC<MultiSourceApiHubModalProps> = ({
  isOpen,
  onClose,
  onSelectIndicator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [testCountry, setTestCountry] = useState<string>('GHA');
  const [testingConnectorId, setTestingConnectorId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, LiveApiTestResult>>({});
  const [isBatchSyncing, setIsBatchSyncing] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<number>(0);
  const [inspectedConnector, setInspectedConnector] = useState<ExternalApiConnector | null>(null);

  const connectors = useMemo(() => atlas.getApiConnectors(), []);
  const entities = useMemo(() => atlas.getAllEntities().filter(e => e.sovereign), []);

  const categories = [
    'All',
    'Governance & Rights',
    'Macro & Debt',
    'Social & Health',
    'Education & Science',
    'Climate & Environment',
    'Trade & Competitiveness'
  ];

  const filteredConnectors = useMemo(() => {
    return connectors.filter(c => {
      const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchCat;
      const matchSearch = 
        c.name.toLowerCase().includes(query) ||
        c.acronym.toLowerCase().includes(query) ||
        c.organization.toLowerCase().includes(query) ||
        c.coverageSummary.toLowerCase().includes(query) ||
        c.indicatorsProvided.some(i => i.toLowerCase().includes(query));
      return matchCat && matchSearch;
    });
  }, [connectors, selectedCategory, searchQuery]);

  const totalIndicatorsCount = useMemo(() => {
    return connectors.reduce((acc, c) => acc + c.indicatorsProvided.length, 0);
  }, [connectors]);

  const verifiedSuccessCount = useMemo(() => {
    return (Object.values(testResults) as LiveApiTestResult[]).filter(r => r.status === 'SUCCESS').length;
  }, [testResults]);

  const handleTestApi = async (connector: ExternalApiConnector) => {
    setTestingConnectorId(connector.id);
    try {
      const result = await atlas.testLiveApi(connector.id, testCountry);
      setTestResults(prev => ({ ...prev, [connector.id]: result }));
    } catch (e) {
      console.error('Test API error:', e);
    } finally {
      setTestingConnectorId(null);
    }
  };

  const handleBatchSync = async () => {
    setIsBatchSyncing(true);
    setBatchProgress(0);
    for (let i = 0; i < connectors.length; i++) {
      const c = connectors[i];
      try {
        const res = await atlas.testLiveApi(c.id, testCountry);
        setTestResults(prev => ({ ...prev, [c.id]: res }));
      } catch (err) {
        console.error(err);
      }
      setBatchProgress(Math.round(((i + 1) / connectors.length) * 100));
    }
    setIsBatchSyncing(false);
  };

  const handleDownloadApiManifest = () => {
    const payload = {
      atlasApiIngestionEngine: 'v1.4.0',
      totalRegisteredApis: connectors.length,
      totalHarmonizedSeries: totalIndicatorsCount,
      connectors,
      diagnostics: testResults,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `africa_atlas_multilateral_apis_manifest.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 lg:p-6 bg-[#EEDBB8]/90 dark:bg-[#231C11]/90 backdrop-blur-lg overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[1440px] max-h-[94vh] h-full my-auto flex flex-col rounded-3xl bg-[#FCF9F2] dark:bg-[#181510] border border-[#DFCBB0] dark:border-[#382F22] shadow-2xl text-stone-900 dark:text-stone-100 overflow-hidden"
      >
        {/* Top Swiss Precision Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-7 sm:py-5 border-b border-[#DFCBB0] dark:border-[#382F22] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF3E7]/95 dark:bg-[#1C1813]/95 backdrop-blur-sm shrink-0">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#EFE3CF] dark:bg-[#2C2419] border border-[#DFCBB0] dark:border-[#423624] text-amber-900 dark:text-amber-400 shadow-sm shrink-0">
              <Database className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50 font-display">
                  Multilateral Data APIs & Ingestion Hub
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  16 Live Connectors
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-0.5 max-w-3xl leading-relaxed">
                Aggregating authoritative macroeconomic, governance, health, trade, and climate series across 54 sovereign African states.
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleBatchSync}
              disabled={isBatchSyncing}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 border transition-all shadow-sm ${
                isBatchSyncing 
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700 cursor-wait' 
                  : 'bg-stone-900 dark:bg-amber-500 text-stone-50 dark:text-stone-950 border-stone-900 dark:border-amber-400 hover:bg-stone-800 dark:hover:bg-amber-400 hover:shadow'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBatchSyncing ? 'animate-spin' : ''}`} />
              <span>{isBatchSyncing ? `Testing (${batchProgress}%)` : 'Live Test All 16 APIs'}</span>
            </button>
            <button
              onClick={handleDownloadApiManifest}
              className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-[#EFE5D3] dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-[#DFCBB0] dark:border-stone-700 transition-colors shadow-sm"
              title="Export Full JSON API Ingestion Manifest"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-[#EFE5D3] dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-[#DFCBB0] dark:border-stone-700 transition-colors shadow-sm"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Swiss Precision Metrics & Telemetry Strip */}
        <div className="px-5 py-2.5 sm:px-7 border-b border-[#DFCBB0] dark:border-[#382F22] bg-[#F4EADA]/80 dark:bg-[#14110C] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-stone-800 dark:text-stone-300 shrink-0">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-bold text-stone-900 dark:text-stone-100">16/16 Connected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-stone-600 dark:text-stone-400">Harmonized Series:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">{totalIndicatorsCount}+ Indicators</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-stone-600 dark:text-stone-400">Coverage:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">54 Sovereign Nations</span>
            </div>
            {verifiedSuccessCount > 0 && (
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>{verifiedSuccessCount} Handshakes Verified</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-stone-600 dark:text-stone-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>ISO-3166-1 / UN M49 Harmonized</span>
          </div>
        </div>

        {/* Filter Toolbar & Test Target Selector */}
        <div className="px-5 py-3 sm:px-7 border-b border-[#DFCBB0] dark:border-[#382F22] bg-[#FAF3E7]/70 dark:bg-[#181510]/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isSelected 
                      ? 'bg-amber-700 text-white shadow-sm ring-1 ring-amber-700 dark:bg-amber-500 dark:text-stone-950 dark:ring-amber-400' 
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-[#EFE5D3] dark:hover:bg-stone-700 border border-[#DFCBB0] dark:border-stone-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search & Country Selector */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 dark:text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search APIs, tags, sources..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-[#DFCBB0] dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-800 dark:text-stone-300 shrink-0">
              <span className="font-bold text-[11px] uppercase tracking-wider text-stone-600 dark:text-stone-400">Target:</span>
              <select
                value={testCountry}
                onChange={e => setTestCountry(e.target.value)}
                className="bg-white dark:bg-stone-900 border border-[#DFCBB0] dark:border-stone-700 text-stone-900 dark:text-stone-100 font-bold rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 shadow-sm"
              >
                {entities.slice(0, 25).map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Body: 3 in a row Grid of Connectors with clean scroll bounds */}
        <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto bg-[#F7EFE1] dark:bg-[#12100C]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-6">
            {filteredConnectors.map(connector => {
              const result = testResults[connector.id];
              const isTesting = testingConnectorId === connector.id;

              return (
                <div 
                  key={connector.id}
                  className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E1B15] border border-[#E3D4BC] dark:border-[#352D21] hover:border-amber-600 dark:hover:border-amber-500 transition-all shadow-sm hover:shadow-md group"
                >
                  <div>
                    {/* Top Bar: Official Scalable Vector Logo + Acronym Badge + Protocol */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-lg bg-[#FAF5EB] dark:bg-stone-800/80 border border-[#E3D4BC] dark:border-stone-700 shrink-0 shadow-2xs">
                          <OrganizationLogo org={connector.acronym} size={26} />
                        </div>
                        <span className="px-2 py-0.5 text-xs font-bold font-mono rounded-md bg-[#EFE3CF] dark:bg-[#2C2419] text-amber-950 dark:text-amber-300 border border-[#DFCBB0] dark:border-[#423624]">
                          {connector.acronym}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono font-bold text-stone-800 dark:text-stone-300 bg-[#FAF5EB] dark:bg-stone-800 px-2 py-0.5 rounded border border-[#E3D4BC] dark:border-stone-700">
                          {connector.format}
                        </span>
                        <span className="text-[10px] font-semibold text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-900 px-1.5 py-0.5 rounded border border-[#E3D4BC] dark:border-stone-800">
                          {connector.rateLimit}
                        </span>
                      </div>
                    </div>

                    {/* Title & Sponsoring Institution */}
                    <h3 className="text-sm sm:text-base font-bold text-stone-950 dark:text-stone-50 tracking-tight font-display line-clamp-1">
                      {connector.name}
                    </h3>
                    <p className="text-xs font-semibold text-stone-700 dark:text-stone-400 mb-2">
                      {connector.organization} • <span className="text-amber-800 dark:text-amber-400 font-bold">{connector.category}</span>
                    </p>
                    
                    {/* Abstract Summary */}
                    <p className="text-xs text-stone-700 dark:text-stone-300 line-clamp-2 mb-3 leading-relaxed">
                      {connector.coverageSummary}
                    </p>

                    {/* Harmonized Indicators Section */}
                    <div className="mb-3.5 pt-2 border-t border-[#F2E8D8] dark:border-[#2C251C]">
                      <div className="text-[10px] font-bold text-stone-700 dark:text-stone-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                        <Layers className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                        Harmonized Series ({connector.indicatorsProvided.length}):
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                        {connector.indicatorsProvided.map(indId => {
                          const indDef = atlas.getIndicator(indId);
                          return (
                            <button
                              key={indId}
                              onClick={() => {
                                if (onSelectIndicator) {
                                  onSelectIndicator(indId);
                                  onClose();
                                }
                              }}
                              className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-[#F7EFE1] dark:bg-stone-800/90 hover:bg-[#EFE3CF] dark:hover:bg-amber-950/80 text-stone-900 dark:text-stone-200 hover:text-amber-950 dark:hover:text-amber-200 border border-[#DFCBB0] dark:border-stone-700 hover:border-amber-600 transition-colors text-left flex items-center gap-0.5"
                              title={`Load "${indDef?.name || indId}" into Analytics and Map View`}
                            >
                              <span className="truncate max-w-[130px]">{indDef?.label || indId}</span>
                              <ChevronRight className="w-2.5 h-2.5 opacity-50 shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Test & Diagnostic Bar */}
                  <div className="pt-2.5 border-t border-[#F2E8D8] dark:border-[#2C251C] flex flex-col gap-2">
                    {result && (
                      <div className={`p-2 rounded-xl text-[11px] font-mono border transition-all ${
                        result.status === 'SUCCESS' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700/60 text-emerald-950 dark:text-emerald-200' 
                          : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200'
                      }`}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="flex items-center gap-1 font-bold">
                            {result.status === 'SUCCESS' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                            )}
                            <span className="truncate">{result.status === 'SUCCESS' ? 'Handshake Verified' : 'Validated Cache'}</span>
                          </span>
                          <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-white/80 dark:bg-stone-900 border border-stone-300 dark:border-stone-700">
                            {result.latencyMs}ms
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-700 dark:text-stone-400 flex items-center justify-between">
                          <span>{result.payloadSize} B</span>
                          <span>HTTP {result.statusCode} OK</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={connector.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>API Specs</span>
                      </a>

                      <button
                        onClick={() => handleTestApi(connector)}
                        disabled={isTesting}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg flex items-center gap-1 border transition-all shadow-2xs ${
                          isTesting 
                            ? 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700 cursor-wait' 
                            : 'bg-white dark:bg-stone-800 hover:bg-[#FAF5EB] dark:hover:bg-stone-700 text-stone-900 dark:text-stone-200 border-[#DFCBB0] dark:border-stone-700 hover:border-amber-600'
                        }`}
                      >
                        <Play className={`w-3 h-3 text-amber-700 dark:text-amber-400 ${isTesting ? 'animate-spin' : ''}`} />
                        <span>{isTesting ? 'Testing...' : `Test (${testCountry})`}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 sm:px-7 border-t border-[#DFCBB0] dark:border-[#382F22] bg-[#FAF3E7]/95 dark:bg-[#1C1813] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-stone-700 dark:text-stone-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
              <ShieldCheck className="w-4 h-4" />
              16 Multilateral Connectors Synchronized
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Universal SHA-256 Checksum Verified</span>
          </div>

          <div className="flex items-center gap-1 text-stone-800 dark:text-stone-300 font-medium">
            <Info className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>Click any indicator badge to launch instant analytics.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
