import React, { useState, useEffect } from 'react';
import { ResearchReport } from '../data/reportsData';
import { AfriataReport } from '../types/afriataReport';
import { Copy, Check, Download, BookOpen, X, Code2, Share2 } from 'lucide-react';
import { AtlasDialog } from './common/AtlasDialog';
import { getConcordanceEntry } from '../data/reportDoiConcordance';
import { downloadFile } from '../utils/exportUtils';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import {
  AFRIATA_ORCID,
  ReportCitationFormat,
  buildReportCitation,
  resolveReportDoi,
} from '../utils/citationFormatter';

interface CitePublicationModalProps {
  report: ResearchReport | AfriataReport;
  isOpen: boolean;
  onClose: () => void;
}

export const CitePublicationModal: React.FC<CitePublicationModalProps> = ({
  report,
  isOpen,
  onClose
}) => {
  const [style, setStyle] = useState<ReportCitationFormat>('chicago');
  const { copied, copiedKey: copiedFormat, liveAnnouncement, copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasDoi = true;
  const { doi } = resolveReportDoi(report.doi);
  const title = report.title;
  const concordance = getConcordanceEntry(report.id);
  const isWorkingPaper = Boolean((report as Partial<ResearchReport>).isWorkingPaper);

  const generateCitationText = (targetStyle = style) =>
    buildReportCitation(report, targetStyle);

  const citationText = generateCitationText();

  const handleCopySpecific = async (format: typeof style, text?: string) => {
    const toCopy = text || generateCitationText(format);
    await copyToClipboard(toCopy, format, `Copied ${format.toUpperCase()} citation to clipboard`);
  };

  const handleCopy = () => {
    handleCopySpecific(style, citationText);
  };

  const handleDownloadFile = (targetStyle = style) => {
    const text = generateCitationText(targetStyle);
    const ext = targetStyle === 'bibtex' ? 'bib' : targetStyle === 'ris' ? 'ris' : targetStyle === 'jsonld' ? 'json' : 'txt';
    const mime = targetStyle === 'jsonld' ? 'application/json' : 'text/plain';
    downloadFile(`${report.id}_citation.${ext}`, text, mime);
  };

  return (
    <AtlasDialog
      isOpen={isOpen}
      onClose={onClose}
      label={`Cite publication: ${title}`}
      overlayClassName="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 atlas-modal-backdrop"
      className="w-full max-w-2xl max-h-[92dvh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 md:p-8 shadow-2xl space-y-4 sm:space-y-6 atlas-modal-panel safe-pb"
    >
        {/* Header */}
        <span className="sr-only" role="status" aria-live="polite">{liveAnnouncement}</span>
        <div className="flex items-start justify-between gap-3 sm:gap-4 shrink-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>{isWorkingPaper ? 'Cite Working Paper Note' : 'Cite Literature Synthesis'}</span>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100 font-serif line-clamp-2">
              {title}
            </h3>
            {concordance && !isWorkingPaper && (
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                For primary empirical claims, cite {concordance.authors?.slice(0, 2).join(' & ')}{concordance.year ? ` (${concordance.year})` : ''} · {concordance.doi ? `DOI: ${concordance.doi}` : concordance.journal}.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-touch-target p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer shrink-0"
            aria-label="Close citation modal"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain sleek-scrollbar space-y-4 sm:space-y-5 pr-1">
        {/* Style Selector Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div
            role="tablist"
            aria-label="Citation styles"
            className="flex flex-nowrap items-center gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 text-xs overflow-x-auto no-scrollbar scroll-shadow-x"
          >
            {(
              [
                { id: 'chicago', label: 'Chicago' },
                { id: 'apa', label: 'APA 7th' },
                { id: 'mla', label: 'MLA 9th' },
                { id: 'bibtex', label: 'BibTeX' },
                { id: 'ris', label: 'RIS / EndNote' },
                { id: 'harvard', label: 'Harvard' },
                { id: 'jsonld', label: 'JSON-LD' },
              ] as const
            ).map(tab => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={style === tab.id}
                onClick={() => setStyle(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shrink-0 whitespace-nowrap ${
                  style === tab.id
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Instant 1-Click Researcher Quick Export Pills */}
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <span className="text-zinc-400 text-[10px] mr-1">Quick copy:</span>
            <button
              type="button"
              onClick={() => handleCopySpecific('bibtex')}
              className={`px-2 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                copiedFormat === 'bibtex'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500'
              }`}
            >
              {copiedFormat === 'bibtex' ? '✓ BibTeX' : '+ BibTeX'}
            </button>
            <button
              type="button"
              onClick={() => handleCopySpecific('ris')}
              className={`px-2 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                copiedFormat === 'ris'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500'
              }`}
            >
              {copiedFormat === 'ris' ? '✓ RIS' : '+ RIS'}
            </button>
            <button
              type="button"
              onClick={() => handleCopySpecific('apa')}
              className={`px-2 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                copiedFormat === 'apa'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500'
              }`}
            >
              {copiedFormat === 'apa' ? '✓ APA' : '+ APA'}
            </button>
          </div>
        </div>

        {/* Citation Output Box */}
        <div className="relative rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto whitespace-pre-wrap max-h-56 leading-relaxed select-all">
          {citationText}
        </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <span>{hasDoi ? 'DOI:' : 'ORCID:'}</span>
            <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">{hasDoi ? doi : AFRIATA_ORCID}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadFile()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Download File</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Citation</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
    </AtlasDialog>
  );
};
export default CitePublicationModal;
