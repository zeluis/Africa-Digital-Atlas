import React, { useState, useEffect, useMemo } from 'react';
import { AtlasDialog } from './common/AtlasDialog';
import { 
  FileText, 
  Copy, 
  Check, 
  BookOpen, 
  X, 
  Sparkles, 
  Award,
  Printer,
  Upload,
  ArrowRight,
  Download
} from 'lucide-react';
import { WorkingPaperEntry } from '../data/methodologyDossierData';
import { getUnifiedWorkingPaperEntries, getAllReports } from '../data/reportsDataLoader';
import { NotebookIngestionModal } from './NotebookIngestionModal';
import { AfricaUnLogo } from './AfricaUnLogo';
import { exportPublicationPDF } from '../utils/academicExport';
import { usePrefersReducedMotion } from '../utils/motion';

interface WorkingPapersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCitationModal?: () => void;
  onSelectReport?: (reportId: string) => void;
}

export const WorkingPapersModal: React.FC<WorkingPapersModalProps> = ({
  isOpen,
  onClose,
  onSelectReport
}) => {
  const [refreshTick, setRefreshTick] = useState(0);
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const handleUpdate = () => setRefreshTick(t => t + 1);
    window.addEventListener('afriata-publications-updated', handleUpdate);
    return () => window.removeEventListener('afriata-publications-updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const allPapers = useMemo(() => getUnifiedWorkingPaperEntries(), [refreshTick]);
  const [selectedPaperId, setSelectedPaperId] = useState<string>(() => allPapers[0]?.id || '');

  const selectedPaper = useMemo(
    () => allPapers.find(p => p.id === selectedPaperId) || allPapers[0],
    [allPapers, selectedPaperId]
  );

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!selectedPaper) return;
    try {
      setIsGeneratingPdf(true);
      const allReports = getAllReports();
      const linkedReport = selectedPaper.reportId ? allReports[selectedPaper.reportId] : undefined;

      if (linkedReport) {
        await exportPublicationPDF(linkedReport);
      } else {
        await exportPublicationPDF({
          id: selectedPaper.id,
          title: selectedPaper.title,
          subtitle: selectedPaper.subtitle,
          authors: [selectedPaper.author],
          institutions: [selectedPaper.affiliation],
          publicationDate: selectedPaper.date,
          seriesNumber: selectedPaper.seriesNumber,
          isWorkingPaper: true,
          jelCodes: selectedPaper.jelCodes,
          executiveSummary: selectedPaper.abstract,
          sections: [
            {
              id: 'sec-findings',
              title: 'Key Econometric Findings & Empirical Evidence',
              content: selectedPaper.keyFindings.join('\n\n')
            }
          ],
          citations: [selectedPaper.citationApa]
        });
      }
    } catch (err) {
      console.error('Failed to export publication PDF from modal:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen || !selectedPaper) return null;

  return (
    <>
      <AtlasDialog
        isOpen={isOpen && Boolean(selectedPaper)}
        onClose={onClose}
        labelledBy="working-paper-modal-title"
        overlayClassName="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-stone-950/80 backdrop-blur-md"
        motionProps={{
          initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          transition: { duration: prefersReducedMotion ? 0.01 : 0.25, ease: [0.16, 1, 0.3, 1] }
        }}
        className="relative w-full max-w-5xl max-h-[92dvh] bg-[#FAF8F5] dark:bg-stone-950 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col z-10"
      >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 sm:px-6 py-3.5 sm:py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 id="working-paper-modal-title" className="text-sm font-extrabold text-stone-900 dark:text-stone-100 font-serif tracking-tight truncate">
                  Afriata Working Paper &amp; Policy Brief Series
                </h2>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono truncate">
                  Academic Monographs &amp; Applied Econometric Research Notes ({allPapers.length} Papers)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
              <button
                onClick={() => setIsIngestionOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
                title="Upload or Ingest a Markdown (.md) Working Paper"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Ingest Working Paper (.md)</span>
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0 whitespace-nowrap"
                title="Download High-Resolution Publication PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                title="Print directly from browser"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close working papers series modal"
                className="min-touch-target p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Paper Selector Strip */}
          <div className="bg-white/95 dark:bg-stone-900/95 border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 py-2.5 sm:py-3 shrink-0 shadow-xs">
            <div
              role="tablist"
              aria-label="Working papers series selector"
              className="p-1 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 flex flex-nowrap items-center gap-1 overflow-x-auto no-scrollbar scroll-shadow-x"
            >
              {allPapers.map((paper) => {
                const isSelected = selectedPaper.id === paper.id;
                const shortSeries = paper.seriesNumber.split('No.')[1]
                  ? `No.${paper.seriesNumber.split('No.')[1]}`
                  : paper.seriesNumber;
                return (
                  <button
                    key={paper.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedPaperId(paper.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span className="font-mono">{shortSeries}</span>
                    <span className="opacity-90 truncate max-w-[160px] sm:max-w-[220px]">{paper.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Academic Monograph Document Reader */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain sleek-scrollbar p-5 sm:p-10 space-y-8 bg-white dark:bg-stone-950 font-serif text-stone-900 dark:text-stone-100 print:p-0">
            {/* Academic Cover & Imprint Header */}
            <div className="border-b-2 border-stone-900 dark:border-stone-100 pb-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <AfricaUnLogo size={36} variant="warm-tonal" interactive={false} />
                  <div className="min-w-0">
                    <span className="font-mono text-xs uppercase tracking-widest font-extrabold text-amber-800 dark:text-amber-400 block truncate">
                      Afriata Open Science Repository
                    </span>
                    <span className="font-mono text-[10px] text-stone-500 block truncate">
                      DOI: 10.6084/m9.figshare.34065711 · Lisbon / Praia / Pan-African Network
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-stone-500 shrink-0">
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">{selectedPaper.seriesNumber}</span>
                  <span>{selectedPaper.date}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    {selectedPaper.type}
                  </div>
                  {selectedPaper.isIngestedMarkdown && selectedPaper.reportId && onSelectReport && (
                    <button
                      onClick={() => onSelectReport(selectedPaper.reportId!)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-sans font-bold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Full Interactive Working Paper</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 dark:text-stone-50 font-serif leading-tight">
                  {selectedPaper.title}
                </h1>
                <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-sans italic">
                  {selectedPaper.subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs font-sans border-t border-stone-200 dark:border-stone-800">
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{selectedPaper.author}</span>
                  <span className="text-stone-500 dark:text-stone-400"> — {selectedPaper.affiliation}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-stone-500">
                  <span>JEL Codes:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{selectedPaper.jelCodes.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Formal Abstract Box */}
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3 font-sans">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                Executive Abstract
              </span>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                {selectedPaper.abstract}
              </p>
            </div>

            {/* Key Empirical Findings */}
            <div className="space-y-4 font-sans">
              <h3 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Key Empirical Sections & Methodological Architecture</span>
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed list-disc pl-5">
                {selectedPaper.keyFindings.map((finding, idx) => (
                  <li key={idx} className="pl-1">
                    {finding}
                  </li>
                ))}
              </ul>
            </div>

            {/* Scholarly Citation Callout */}
            <div className="p-5 rounded-2xl bg-amber-500/[0.05] dark:bg-amber-500/[0.08] border border-amber-500/25 space-y-2 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                  Standardized Academic Citation
                </span>
                <button
                  onClick={() => handleCopy(selectedPaper.citationApa, selectedPaper.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-mono font-semibold transition-colors cursor-pointer"
                >
                  {copiedKey === selectedPaper.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === selectedPaper.id ? 'Copied APA' : 'Copy APA Citation'}</span>
                </button>
              </div>
              <p className="text-xs font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed">
                {selectedPaper.citationApa}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 safe-pb bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shrink-0">
            <span className="text-xs text-stone-500 font-mono text-center sm:text-left">
              Published by Afriata Cartographic & Econometric Observatory • Drop-in dir: <code className="text-amber-600 dark:text-amber-400">/src/content/working-papers/*.md</code>
            </span>
            <div className="flex items-center gap-2">
              {selectedPaper.isIngestedMarkdown && selectedPaper.reportId && onSelectReport && (
                <button
                  onClick={() => onSelectReport(selectedPaper.reportId!)}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Open Full Monograph View
                </button>
              )}
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 inline mr-1" />
                {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
              </button>
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 inline mr-1" />
                Print
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 text-white dark:text-stone-900 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Series
              </button>
            </div>
          </div>
      </AtlasDialog>

      {/* Working Paper Markdown Ingestion Modal */}
      <NotebookIngestionModal
        isOpen={isIngestionOpen}
        onClose={() => setIsIngestionOpen(false)}
        defaultTargetPipeline="working-papers"
        onIngestComplete={(newWp) => {
          setRefreshTick(t => t + 1);
          setSelectedPaperId(newWp.id);
        }}
      />
    </>
  );
};

export default WorkingPapersModal;
