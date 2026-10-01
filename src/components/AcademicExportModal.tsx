import React, { useState } from 'react';
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  FileText, 
  Image as ImageIcon, 
  Quote, 
  X, 
  ExternalLink, 
  ShieldCheck,
  Sparkles,
  Fingerprint,
  Award
} from 'lucide-react';
import { downloadFile } from '../utils/exportUtils';

export interface AcademicExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  sourceContext?: string;
  citationMetadata?: {
    authors?: string[];
    year?: number;
    datasetName?: string;
    url?: string;
    doi?: string;
    version?: string;
  };
  svgContainerId?: string; // DOM ID to snapshot
}

export const AcademicExportModal: React.FC<AcademicExportModalProps> = ({
  isOpen,
  onClose,
  title = 'Africa Data Atlas & Cartographic Observatory',
  sourceContext = 'Multilateral Macroeconomic, Ethnographic & Cartographic Corpus',
  citationMetadata = {
    authors: ['Zéluis F. Correia', 'Africalia Cartographic & Econometric Observatory'],
    year: 2026,
    datasetName: 'Africa Data Atlas & Cartographic Observatory',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://africalia.org',
    doi: '10.5281/zenodo.10842918',
    version: '2026.1 (Observatory Canonical Edition)'
  },
  svgContainerId
}) => {
  const [citationTab, setCitationTab] = useState<'apa' | 'chicago' | 'harvard' | 'mla' | 'bibtex' | 'ris'>('apa');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [isExportingImage, setIsExportingImage] = useState<boolean>(false);

  if (!isOpen) return null;

  const accessDate = new Date().toISOString().split('T')[0];
  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://africalia.org';
  const doi = citationMetadata.doi || '10.5281/zenodo.10842918';

  // Standardized Academic Citations adhering to authoritative specifications
  const apaCitation = `Correia, Z. F. (2026). Africa Data Atlas & Cartographic Observatory: Sovereign Geospatial Intelligence, Macroeconomic Indicators, and Historical Trade Flow Platform. Africalia Open Science Repository. https://doi.org/${doi}`;

  const chicagoCitation = `Correia, Zéluis F. 2026. Africa Data Atlas & Cartographic Observatory. Lisbon/Praia: Africalia Open Science. https://doi.org/${doi}.`;

  const mlaCitation = `Correia, Zéluis F. "Africa Data Atlas & Cartographic Observatory: Sovereign Geospatial Intelligence, Macroeconomic Indicators, and Historical Trade Flow Platform." Africalia Open Science Repository, 2026, https://doi.org/${doi}. Accessed ${accessDate}.`;

  const harvardCitation = `Correia, Z.F. (2026) Africa Data Atlas & Cartographic Observatory. Africalia Open Science Repository. Available at: ${pageUrl} (Accessed: ${accessDate}). https://doi.org/${doi}.`;

  const bibtexCitation = `@dataset{correia_africa_data_atlas_2026,
  author    = {Correia, Z{\\'e}luis F.},
  title     = {{Africa Data Atlas \\& Cartographic Observatory: Sovereign Geospatial Intelligence, Macroeconomic Indicators, and Historical Trade Flow Platform}},
  year      = {2026},
  publisher = {Africalia Open Science Repository},
  doi       = {${doi}},
  url       = {${pageUrl}},
  version   = {${citationMetadata.version || '2026.1'}},
  note      = {Accessed: ${accessDate}}
}

@software{correia_africalia_vector_engine_2026,
  author    = {Correia, Z{\\'e}luis F.},
  title     = {{Africalia Continental Vector Topology \\& High-Precision Geodetic Engine (5,796 x 5,867)}},
  year      = {2026},
  publisher = {Africalia Cartographic Observatory},
  doi       = {${doi}},
  url       = {${pageUrl}}
}`;

  const risCitation = `TY  - DATA
TI  - Africa Data Atlas & Cartographic Observatory: Sovereign Geospatial Intelligence, Macroeconomic Indicators, and Historical Trade Flow Platform
AU  - Correia, Zéluis F.
PY  - 2026
PB  - Africalia Open Science Repository
DO  - ${doi}
UR  - ${pageUrl}
Y2  - ${accessDate}
ER  -`;

  const getActiveCitation = (tab = citationTab) => {
    switch (tab) {
      case 'apa': return apaCitation;
      case 'chicago': return chicagoCitation;
      case 'mla': return mlaCitation;
      case 'harvard': return harvardCitation;
      case 'bibtex': return bibtexCitation;
      case 'ris': return risCitation;
    }
  };

  const handleCopySpecific = async (tab: typeof citationTab) => {
    await navigator.clipboard.writeText(getActiveCitation(tab));
    setCopiedFormat(tab);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setCopiedFormat(null);
    }, 2000);
  };

  const handleCopy = () => {
    handleCopySpecific(citationTab);
  };

  const handleDownloadRis = () => {
    downloadFile('africalia_atlas_citation.ris', risCitation, 'application/x-research-info-systems;charset=utf-8');
  };

  const handleDownloadBibtex = () => {
    downloadFile('africalia_atlas_citation.bib', bibtexCitation, 'text/plain;charset=utf-8');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] dark:bg-stone-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
              <Quote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 font-serif">
                Cite this Research Platform & Cartography
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                Standardized Academic Citations & Bibliographic Exports
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permanent DOI Banner */}
        <div className="px-6 py-3 bg-amber-500/[0.06] dark:bg-amber-500/[0.1] border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span className="text-xs font-mono font-bold text-amber-900 dark:text-amber-200">
              DOI: {doi}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
              Zenodo / CERN Open Science
            </span>
          </div>

          <a
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-800 dark:text-amber-300 hover:underline"
          >
            <span>Verify on Zenodo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Tab Selectors & Quick Copy Bar */}
        <div className="px-6 pt-4 pb-2 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="p-1 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center gap-1">
            <button
              onClick={() => setCitationTab('apa')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                citationTab === 'apa'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              APA 7th
            </button>
            <button
              onClick={() => setCitationTab('chicago')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                citationTab === 'chicago'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Chicago
            </button>
            <button
              onClick={() => setCitationTab('mla')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                citationTab === 'mla'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              MLA 9th
            </button>
            <button
              onClick={() => setCitationTab('harvard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                citationTab === 'harvard'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Harvard
            </button>
            <button
              onClick={() => setCitationTab('bibtex')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                citationTab === 'bibtex'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              BibTeX
            </button>
            <button
              onClick={() => setCitationTab('ris')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                citationTab === 'ris'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              RIS
            </button>
          </div>

          {/* Quick Copy Pills */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono shrink-0">
            <span className="text-stone-400 text-[10px]">1-click:</span>
            <button
              type="button"
              onClick={() => handleCopySpecific('bibtex')}
              className={`px-2 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                copiedFormat === 'bibtex'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500'
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
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500'
              }`}
            >
              {copiedFormat === 'ris' ? '✓ RIS' : '+ RIS'}
            </button>
          </div>
        </div>

        {/* Citation Display */}
        <div className="p-6 space-y-4">
          <div className="relative p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
            <pre className="font-mono text-xs text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-64 select-all">
              {getActiveCitation()}
            </pre>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 px-1">
            <span>Africalia Open Science Repository • Lisbon / Praia</span>
            <span>CC-BY 4.0 Open Access License</span>
          </div>
        </div>

        {/* Footer Button Row: [Download / Export] [Copy Citation] [Close] */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shrink-0">
          {/* Download Formats */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadBibtex}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Download .bib</span>
            </button>
            <button
              onClick={handleDownloadRis}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Download .ris</span>
            </button>
          </div>

          {/* Action Row: [Copy Citation] [Close] */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Citation'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition-colors cursor-pointer active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
