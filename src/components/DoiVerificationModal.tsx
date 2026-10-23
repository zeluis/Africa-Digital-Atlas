import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Upload, 
  Download, 
  ExternalLink, 
  Search, 
  FileText, 
  ShieldCheck,
  Globe2,
  Trash2,
  Database
} from 'lucide-react';
import { 
  verifyDoiWithCrossref, 
  searchCrossrefByTitle, 
  DoiVerificationResult, 
  CrossrefWork,
  generateAcademicFallbacks 
} from '../services/crossrefService';
import { 
  BASELINE_DOI_CONCORDANCE, 
  getConcordanceEntry, 
  importUserConcordanceJson, 
  exportCurrentConcordanceJson, 
  clearUserConcordanceOverrides,
  getUserConcordanceOverrides,
  DoiConcordanceEntry 
} from '../data/reportDoiConcordance';
import { getAllReports } from '../data/reportsDataLoader';
import { SAFE_EXTERNAL_LINK_PROPS } from '../data/externalLinksRegistry';

interface DoiVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReportId?: string;
}

export const DoiVerificationModal: React.FC<DoiVerificationModalProps> = ({
  isOpen,
  onClose,
  initialReportId
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'upload' | 'template'>('audit');
  const [selectedReportId, setSelectedReportId] = useState<string>(initialReportId || '');
  const [verificationResults, setVerificationResults] = useState<Record<string, DoiVerificationResult>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadText, setUploadText] = useState('');
  const [uploadFeedback, setUploadFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [searchCandidates, setSearchCandidates] = useState<Record<string, CrossrefWork[]>>({});
  const [searchingId, setSearchingId] = useState<string | null>(null);
  const [userOverrides, setUserOverrides] = useState<Record<string, Partial<DoiConcordanceEntry>>>({});

  const allReports = React.useMemo(() => Object.values(getAllReports()), []);

  useEffect(() => {
    if (isOpen) {
      setUserOverrides(getUserConcordanceOverrides());
      if (initialReportId) {
        setSelectedReportId(initialReportId);
      } else if (allReports[0]) {
        setSelectedReportId(allReports[0].id);
      }
    }
  }, [isOpen, initialReportId, allReports]);

  if (!isOpen) return null;

  /**
   * Run real-time Crossref API verification for a single report
   */
  const handleVerifySingle = async (reportId: string) => {
    const report = allReports.find(r => r.id === reportId);
    if (!report) return;

    const concordance = getConcordanceEntry(report.id);
    const targetDoi = concordance?.doi || report.doi;

    const result = await verifyDoiWithCrossref(targetDoi, report.title, true);
    setVerificationResults(prev => ({ ...prev, [report.id]: result }));
  };

  /**
   * Run real-time Crossref API batch audit across all reports
   */
  const handleVerifyAll = async () => {
    setIsVerifying(true);
    const results: Record<string, DoiVerificationResult> = {};

    for (const report of allReports) {
      const concordance = getConcordanceEntry(report.id);
      const targetDoi = concordance?.doi || report.doi;
      try {
        const res = await verifyDoiWithCrossref(targetDoi, report.title, true);
        results[report.id] = res;
      } catch (e: any) {
        results[report.id] = {
          doi: targetDoi,
          status: 'error',
          resolvedUrl: `https://scholar.google.com/scholar?q=${encodeURIComponent(report.title)}`,
          fallbackUrls: generateAcademicFallbacks(report.title),
          verifiedAt: new Date().toISOString(),
          source: 'crossref_api',
          errorMessage: e.message
        };
      }
    }

    setVerificationResults(results);
    setIsVerifying(false);
  };

  /**
   * Search Crossref directly to find genuine candidates for a mismatched or broken DOI
   */
  const handleSearchCrossrefCandidates = async (reportId: string, title: string, author?: string) => {
    setSearchingId(reportId);
    const works = await searchCrossrefByTitle(title, author);
    setSearchCandidates(prev => ({ ...prev, [reportId]: works }));
    setSearchingId(null);
  };

  /**
   * Handle user uploading / pasting JSON file
   */
  const handleProcessUpload = () => {
    if (!uploadText.trim()) {
      setUploadFeedback({ success: false, message: 'Please paste JSON or drop a file first.' });
      return;
    }

    const res = importUserConcordanceJson(uploadText);
    if (res.success) {
      setUploadFeedback({ 
        success: true, 
        message: `Successfully registered ${res.count} publication DOIs into local concordance! Changes are live.` 
      });
      setUserOverrides(getUserConcordanceOverrides());
      // Re-audit the updated reports
      setTimeout(() => {
        handleVerifyAll();
      }, 300);
    } else {
      setUploadFeedback({ success: false, message: res.error || 'Failed to parse JSON concordance file.' });
    }
  };

  /**
   * File drop / input handler
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setUploadText(text);
      setUploadFeedback(null);
    };
    reader.readAsText(file);
  };

  /**
   * Export the current concordance JSON
   */
  const handleExportJson = () => {
    const jsonStr = exportCurrentConcordanceJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'africalia_doi_concordance.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Generate downloadable pre-populated template JSON for all current reports
   */
  const handleDownloadTemplate = () => {
    const template: Record<string, any> = {};
    allReports.forEach(r => {
      const existing = getConcordanceEntry(r.id);
      template[r.id] = {
        title: r.title,
        doi: existing?.doi || (r.doi.startsWith('10.') ? r.doi : ''),
        url: existing?.canonicalUrl || (r.doi.startsWith('10.') ? `https://doi.org/${r.doi}` : ''),
        journal: existing?.journal || '',
        authors: existing?.authors || r.authors,
        year: existing?.year || 2024,
        notes: existing?.notes || 'Fill in the verified paper DOI or publisher URL'
      };
    });

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'africalia_reports_doi_template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Reset local overrides back to baseline
   */
  const handleResetOverrides = () => {
    if (window.confirm('Reset all user DOI concordance overrides back to system baseline?')) {
      clearUserConcordanceOverrides();
      setUserOverrides({});
      setUploadFeedback({ success: true, message: 'Reset concordance to system baseline.' });
      handleVerifyAll();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span>Crossref DOI Runtime Verification & Concordance</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Live API
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Validate DOIs against the Crossref registry, prevent 404 dead ends, or upload custom publication mappings.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-6 bg-white dark:bg-zinc-900 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 border-b-2 font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Live Crossref Audit ({allReports.length} Reports)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 border-b-2 font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Concordance JSON {Object.keys(userOverrides).length > 0 && `(${Object.keys(userOverrides).length} Active)`}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('template')}
            className={`py-3 px-4 border-b-2 font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'template'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>JSON Template & Schema</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: LIVE AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs">
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white block">
                    Verify all report DOIs with Crossref
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Pings <code className="font-mono text-zinc-600 dark:text-zinc-300">api.crossref.org/works/{'{doi}'}</code> to verify title match and eliminate 404s.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleVerifyAll}
                    disabled={isVerifying}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold transition-all cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                    <span>{isVerifying ? 'Validating via Crossref...' : 'Run Full Crossref Audit'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-medium transition-all cursor-pointer"
                    title="Export verified concordance mapping as JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {/* Publication Audit Cards List */}
              <div className="space-y-3">
                {allReports.map((report) => {
                  const concordance = getConcordanceEntry(report.id);
                  const result = verificationResults[report.id];
                  const candidates = searchCandidates[report.id];
                  const activeDoi = concordance?.doi || report.doi;
                  const isUserOverridden = Boolean(userOverrides[report.id]);

                  return (
                    <div 
                      key={report.id}
                      className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1 max-w-2xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span 
                              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${report.categoryColor}18`, color: report.categoryColor }}
                            >
                              {report.categoryLabel}
                            </span>

                            {isUserOverridden && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                User Concordance Override
                              </span>
                            )}

                            {concordance && !isUserOverridden && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                {concordance.status.replace(/_/g, ' ').toUpperCase()}
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                            {report.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500">
                            <span>DOI:</span>
                            <span className="text-amber-600 dark:text-amber-400 font-bold">{activeDoi}</span>
                            {concordance?.journal && (
                              <>
                                <span>•</span>
                                <span className="text-zinc-600 dark:text-zinc-400 font-sans italic">{concordance.journal}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Status Badge & Actions */}
                        <div className="flex items-center gap-2">
                          {result ? (
                            result.status === 'verified' ? (
                              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Crossref 200 OK</span>
                              </span>
                            ) : result.status === 'mismatch' ? (
                              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                <span>Title Mismatch</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800">
                                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                                <span>Crossref 404</span>
                              </span>
                            )
                          ) : (
                            <span className="text-xs text-zinc-400 italic">Not audited yet</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleVerifySingle(report.id)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Verify this single DOI with Crossref"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Result Details / Warnings */}
                      {result && (
                        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-xs space-y-2">
                          {result.status === 'verified' && (
                            <div className="flex items-start gap-2 text-emerald-700 dark:text-emerald-300">
                              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold">Verified against Crossref registry:</p>
                                <p className="text-zinc-700 dark:text-zinc-300 italic">"{result.actualTitle}"</p>
                                <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
                                  {result.journal} • {result.authors?.slice(0, 3).join(', ')} ({result.publishedYear})
                                </p>
                              </div>
                            </div>
                          )}

                          {result.status === 'mismatch' && (
                            <div className="space-y-2">
                              <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                                <div>
                                  <p className="font-bold">DOI resolves, but Crossref title differs from report:</p>
                                  <p className="text-zinc-700 dark:text-zinc-300 italic">Crossref registered title: "{result.actualTitle}"</p>
                                  <p className="text-zinc-500 dark:text-zinc-400">Similarity index: {Math.round((result.similarityScore || 0) * 100)}%</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-200/60 dark:border-zinc-800">
                                <button
                                  type="button"
                                  onClick={() => handleSearchCrossrefCandidates(report.id, report.title, report.authors?.[0])}
                                  disabled={searchingId === report.id}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 text-[11px] font-semibold cursor-pointer"
                                >
                                  <Search className="w-3 h-3" />
                                  <span>{searchingId === report.id ? 'Searching Crossref...' : 'Auto-Find Matching DOI on Crossref'}</span>
                                </button>

                                <a
                                  href={result.fallbackUrls.googleScholar}
                                  {...SAFE_EXTERNAL_LINK_PROPS}
                                  className="flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-400 hover:underline"
                                >
                                  <span>Search Google Scholar</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          )}

                          {result.status === 'not_found' && (
                            <div className="space-y-2">
                              <div className="flex items-start gap-2 text-rose-700 dark:text-rose-300">
                                <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                                <div>
                                  <p className="font-bold">DOI Not Found (404) in Crossref:</p>
                                  <p className="text-zinc-600 dark:text-zinc-400">
                                    This DOI is not minted in Crossref. Navigating directly to <code className="font-mono">doi.org/{result.doi}</code> will return a 404 page.
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-200/60 dark:border-zinc-800">
                                <button
                                  type="button"
                                  onClick={() => handleSearchCrossrefCandidates(report.id, report.title, report.authors?.[0])}
                                  disabled={searchingId === report.id}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[11px] font-semibold cursor-pointer"
                                >
                                  <Search className="w-3 h-3" />
                                  <span>Search Crossref for Real Paper</span>
                                </button>

                                <a
                                  href={result.fallbackUrls.googleScholar}
                                  {...SAFE_EXTERNAL_LINK_PROPS}
                                  className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  <span>Safe Fallback: Google Scholar</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Render search candidates if found */}
                          {candidates && candidates.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                              <span className="font-bold text-zinc-900 dark:text-white block">
                                Top Crossref Candidates found for this paper:
                              </span>
                              <div className="space-y-1.5">
                                {candidates.slice(0, 3).map((cand, idx) => (
                                  <div 
                                    key={idx}
                                    className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 text-[11px]"
                                  >
                                    <div className="truncate">
                                      <span className="font-bold text-zinc-800 dark:text-zinc-200 block truncate">{cand.title}</span>
                                      <span className="text-zinc-500 font-mono text-[10px]">
                                        DOI: {cand.doi} • {cand.containerTitle} ({cand.publishedYear || 'N/A'})
                                      </span>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const update = {
                                          [report.id]: {
                                            id: report.id,
                                            title: report.title,
                                            doi: cand.doi,
                                            canonicalUrl: `https://doi.org/${cand.doi}`,
                                            verifiedTitle: cand.title,
                                            journal: cand.containerTitle,
                                            year: cand.publishedYear,
                                            status: 'verified_journal' as const
                                          }
                                        };
                                        importUserConcordanceJson(JSON.stringify(update));
                                        setUserOverrides(getUserConcordanceOverrides());
                                        handleVerifySingle(report.id);
                                      }}
                                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] whitespace-nowrap cursor-pointer shadow-2xs"
                                    >
                                      Use This DOI
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD CUSTOM JSON */}
          {activeTab === 'upload' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>How to upload your custom Report DOIs JSON</span>
                </p>
                <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                  You can upload a JSON file containing report titles or IDs and their verified DOIs / URLs. The app will immediately link to these publications across the reader, citation chips, and export drawers, bypassing any dead or unverified default links.
                </p>
              </div>

              {/* Upload Input & File Drop Area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-zinc-900 dark:text-white">
                    Paste JSON or Select File:
                  </label>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-medium transition-all cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose JSON File</span>
                    <input 
                      type="file" 
                      accept=".json,application/json" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>

                <textarea
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  placeholder={`[\n  {\n    "id": "report-genetic-linguistic-blueprints",\n    "title": "Genetic and Linguistic Blueprints...",\n    "doi": "10.1371/journal.pone.0051103",\n    "url": "https://doi.org/10.1371/journal.pone.0051103",\n    "journal": "PLOS ONE"\n  }\n]`}
                  className="w-full h-56 p-4 rounded-2xl font-mono text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />

                {uploadFeedback && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    uploadFeedback.success 
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}>
                    {uploadFeedback.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{uploadFeedback.message}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleProcessUpload}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply Concordance Mapping</span>
                  </button>

                  {Object.keys(userOverrides).length > 0 && (
                    <button
                      type="button"
                      onClick={handleResetOverrides}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Overrides ({Object.keys(userOverrides).length} Active)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOWNLOAD TEMPLATE & SCHEMA */}
          {activeTab === 'template' && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="font-bold text-zinc-900 dark:text-white block">
                  Download Pre-Populated Concordance Template
                </span>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  We generate a ready-to-fill JSON file with all the titles, report IDs, authors, and existing DOIs from your atlas. You can open it in any text editor, replace or verify the DOIs, and upload it in Tab 2.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs transition-all cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Pre-Populated Template (JSON)</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-zinc-800 dark:text-zinc-200 block">
                  Accepted JSON Structure:
                </span>
                <pre className="p-4 rounded-2xl bg-zinc-950 text-zinc-200 font-mono text-[11px] overflow-x-auto border border-zinc-800">
{`[
  {
    "id": "report-ancestry-ideology-underdevelopment",
    "title": "Ancestry, Ideology, and Underdevelopment",
    "doi": "10.1257/aer.101.7.3221",
    "url": "https://doi.org/10.1257/aer.101.7.3221",
    "verifiedTitle": "The Slave Trade and the Origins of Mistrust in Africa",
    "journal": "American Economic Review",
    "authors": ["Nathan Nunn", "Leonard Wantchekon"],
    "year": 2011,
    "notes": "Verified against Crossref on Oct 2026"
  }
]`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 text-zinc-500">
            <Globe2 className="w-4 h-4 text-emerald-500" />
            <span>Connected to Crossref Open REST API (<code className="font-mono">api.crossref.org</code>)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
