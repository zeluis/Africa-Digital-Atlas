import React, { useState, useEffect } from 'react';
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
import { exportCustomBriefingDossierPDF } from '../utils/academicExport';
import { useSavedEntities } from '../contexts/SavedEntitiesContext';

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
    authors: ['Zéluis F. Correia', 'Afriata Cartographic & Econometric Observatory'],
    year: 2026,
    datasetName: 'Africa Data Atlas & Cartographic Observatory',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://afriata.org',
    doi: '10.6084/m9.figshare.34065711',
    version: '2026.1 (Observatory Canonical Edition)'
  },
  svgContainerId
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'citation' | 'dossier_builder'>('citation');
  const [citationTab, setCitationTab] = useState<'apa' | 'chicago' | 'harvard' | 'mla' | 'bibtex' | 'ris' | 'cff' | 'enw'>('apa');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [isExportingImage, setIsExportingImage] = useState<boolean>(false);
  const [isGeneratingDossier, setIsGeneratingDossier] = useState<boolean>(false);
  const { savedCountries, savedPlates, toggleSaveCountry, toggleSavePlate } = useSavedEntities();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const accessDate = new Date().toISOString().split('T')[0];
  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://afriata.org';
  const doi = citationMetadata.doi || '10.6084/m9.figshare.34065711';

  // Standardized Academic Citations
  const apaCitation = `Correia, Z. F. (2026). Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows. Afriata. https://github.com/zeluis/Africa-Digital-Atlas · https://doi.org/${doi}`;

  const chicagoCitation = `Correia, Zéluis F. 2026. Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows. Lisbon/Praia: Afriata. https://doi.org/${doi}.`;

  const mlaCitation = `Correia, Zéluis F. "Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows." Afriata, 2026, https://doi.org/${doi}. Accessed ${accessDate}.`;

  const harvardCitation = `Correia, Z.F. (2026) Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows. Afriata. Available at: ${pageUrl} (Accessed: ${accessDate}). https://doi.org/${doi}.`;

  const bibtexCitation = `@dataset{correia_africa_data_atlas_2026,
  author    = {Correia, Z{\\'e}luis F.},
  orcid     = {0000-0001-9421-6555},
  title     = {{Africa Data Atlas \\& Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows}},
  year      = {2026},
  publisher = {Afriata},
  doi       = {${doi}},
  url       = {${pageUrl}},
  version   = {${citationMetadata.version || '2026.1'}},
  note      = {Accessed: ${accessDate}}
}

@software{correia_afriata_vector_engine_2026,
  author    = {Correia, Z{\\'e}luis F.},
  orcid     = {0000-0001-9421-6555},
  title     = {{Afriata Continental Vector Topology \\& High-Precision Geodetic Engine (5,796 x 5,867)}},
  year      = {2026},
  publisher = {Afriata Cartographic Observatory},
  doi       = {${doi}},
  url       = {${pageUrl}}
}`;

  const risCitation = `TY  - DATA
TI  - Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows
AU  - Correia, Zéluis F.
PY  - 2026
PB  - Afriata
DO  - ${doi}
UR  - ${pageUrl}
Y2  - ${accessDate}
ER  -`;

  const cffCitation = `cff-version: 1.2.0
message: "If you use this atlas or software in your research, please cite it as below."
title: "Africa Data Atlas & Cartographic Observatory"
authors:
  - family-names: "Correia"
    given-names: "Zéluis F."
    orcid: "https://orcid.org/0000-0001-9421-6555"
version: "${citationMetadata.version || '2026.1'}"
doi: "${doi}"
date-released: "2026-01-15"
url: "${pageUrl}"
repository-code: "https://github.com/zeluis/Africa-Digital-Atlas"
keywords:
  - "Africa"
  - "Cartography"
  - "Socioeconomic Indicators"
  - "SlaveVoyages"
  - "AfCFTA"`;

  const enwCitation = `%0 Dataset
%T Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows
%A Correia, Zéluis F.
%D 2026
%I Afriata
%R ${doi}
%U ${pageUrl}`;

  const getActiveCitation = (tab = citationTab) => {
    switch (tab) {
      case 'apa': return apaCitation;
      case 'chicago': return chicagoCitation;
      case 'mla': return mlaCitation;
      case 'harvard': return harvardCitation;
      case 'bibtex': return bibtexCitation;
      case 'ris': return risCitation;
      case 'cff': return cffCitation;
      case 'enw': return enwCitation;
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
    downloadFile('afriata_atlas_citation.ris', risCitation, 'application/x-research-info-systems;charset=utf-8');
  };

  const handleDownloadBibtex = () => {
    downloadFile('afriata_atlas_citation.bib', bibtexCitation, 'text/plain;charset=utf-8');
  };

  const handleDownloadCff = () => {
    downloadFile('CITATION.cff', cffCitation, 'text/yaml;charset=utf-8');
  };

  const handleDownloadEnw = () => {
    downloadFile('afriata_atlas_citation.enw', enwCitation, 'text/plain;charset=utf-8');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-stone-950/75 backdrop-blur-md atlas-modal-backdrop"
      onClick={onClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="academic-export-modal-title"
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92dvh] bg-[#FAF8F5] dark:bg-stone-950 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col atlas-modal-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3.5 sm:py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0">
              <Quote className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 id="academic-export-modal-title" className="text-sm font-extrabold text-stone-900 dark:text-stone-100 font-serif truncate">
                Cite this Research Platform &amp; Cartography
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono truncate">
                Standardized Academic Citations &amp; Bibliographic Exports
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-touch-target p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors cursor-pointer shrink-0"
            aria-label="Close citation and export modal"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permanent DOI Banner */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-amber-500/[0.06] dark:bg-amber-500/[0.1] border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <Fingerprint className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span className="text-xs font-mono font-bold text-amber-900 dark:text-amber-200">
              DOI: {doi}
            </span>
            <span className="text-[11px] font-mono text-amber-800 dark:text-amber-300">
              · Figshare / Open Science
            </span>
          </div>

          <a
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-800 dark:text-amber-300 hover:underline shrink-0"
          >
            <span>Verify on Figshare</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Primary Mode Switcher (Citation vs Custom Dossier Builder) */}
        <div
          role="tablist"
          aria-label="Export workspace modes"
          className="px-4 sm:px-6 pt-3 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-shadow-x shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeMainTab === 'citation'}
            onClick={() => setActiveMainTab('citation')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeMainTab === 'citation'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Citation &amp; Bibliographic Indices</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeMainTab === 'dossier_builder'}
            onClick={() => setActiveMainTab('dossier_builder')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeMainTab === 'dossier_builder'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Briefing Dossier Builder ({savedCountries.length} countries, {savedPlates.length} plates)</span>
          </button>
        </div>

        {activeMainTab === 'citation' ? (
          <>
            {/* Tab Selectors & Quick Copy Bar */}
            <div className="px-4 sm:px-6 pt-3.5 pb-2.5 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
              <div
                role="tablist"
                aria-label="Citation styles"
                className="p-1 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 flex flex-nowrap items-center gap-1 overflow-x-auto no-scrollbar scroll-shadow-x"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={citationTab === 'apa'}
                  onClick={() => setCitationTab('apa')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    citationTab === 'apa'
                      ? 'bg-amber-600 text-white shadow-xs font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  APA 7th
                </button>
            <button
              type="button"
              role="tab"
              aria-selected={citationTab === 'chicago'}
              onClick={() => setCitationTab('chicago')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                citationTab === 'chicago'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Chicago
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={citationTab === 'mla'}
              onClick={() => setCitationTab('mla')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                citationTab === 'mla'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              MLA 9th
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={citationTab === 'harvard'}
              onClick={() => setCitationTab('harvard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                citationTab === 'harvard'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Harvard
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={citationTab === 'bibtex'}
              onClick={() => setCitationTab('bibtex')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                citationTab === 'bibtex'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              BibTeX
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={citationTab === 'ris'}
              onClick={() => setCitationTab('ris')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                citationTab === 'ris'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              RIS
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={citationTab === 'cff'}
              onClick={() => setCitationTab('cff')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                citationTab === 'cff'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              CFF (YAML)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={citationTab === 'enw'}
              onClick={() => setCitationTab('enw')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                citationTab === 'enw'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              EndNote (.enw)
            </button>
          </div>

          {/* Quick Copy Pills */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono shrink-0 overflow-x-auto no-scrollbar">
            <span className="text-stone-400 text-[10px]">1-click:</span>
            <button
              type="button"
              onClick={() => handleCopySpecific('bibtex')}
              className={`px-2 py-1 rounded-lg border font-bold transition-all cursor-pointer shrink-0 ${
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
              className={`px-2 py-1 rounded-lg border font-bold transition-all cursor-pointer shrink-0 ${
                copiedFormat === 'ris'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500'
              }`}
            >
              {copiedFormat === 'ris' ? '✓ RIS' : '+ RIS'}
            </button>
            <button
              type="button"
              onClick={() => handleCopySpecific('cff')}
              className={`px-2 py-1 rounded-lg border font-bold transition-all cursor-pointer shrink-0 ${
                copiedFormat === 'cff'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500'
              }`}
            >
              {copiedFormat === 'cff' ? '✓ CFF' : '+ CFF'}
            </button>
          </div>
        </div>

        {/* Citation Display */}
        <div className="p-4 sm:p-6 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain sleek-scrollbar">
          <div className="relative p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
            <pre className="font-mono text-xs text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-64 select-all">
              {getActiveCitation()}
            </pre>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 px-1">
            <span>Afriata Open Science Repository • Author: ZéLuis F. Correia</span>
            <span>CC BY 4.0 (Assets) • MIT (Code)</span>
          </div>
        </div>

        {/* Footer Button Row: [Download / Export] [Copy Citation] [Close] */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 safe-pb bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shrink-0">
          {/* Download Formats */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadBibtex}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>.bib</span>
            </button>
            <button
              onClick={handleDownloadRis}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>.ris</span>
            </button>
            <button
              onClick={handleDownloadCff}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>.cff</span>
            </button>
            <button
              onClick={handleDownloadEnw}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>.enw</span>
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
          </>
        ) : (
          /* Dossier Builder Notebook Tab */
          <div className="p-4 sm:p-6 space-y-5 flex-1 min-h-0 overflow-y-auto overscroll-contain sleek-scrollbar safe-pb">
            <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 space-y-2">
              <h4 className="text-sm font-bold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Custom Academic Briefing Dossier &amp; Compilation Notebook</span>
              </h4>
              <p className="text-xs text-purple-800/80 dark:text-purple-300/80 leading-relaxed">
                Compile your bookmarked sovereign nations and archival cartographic plates into a formal, multi-asset executive research briefing PDF complete with macroeconomic summaries, institutional citations, and figure numbering.
              </p>
            </div>

            {/* Bookmarked Sovereign Countries Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                1. Bookmarked Sovereign Nations ({savedCountries.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {savedCountries.length === 0 ? (
                  <span className="text-xs text-stone-400 italic">No countries saved yet. Click the star icon on any country dossier.</span>
                ) : (
                  savedCountries.map(id => (
                    <div 
                      key={id} 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 shadow-xs"
                    >
                      <span>{id}</span>
                      <button 
                        type="button" 
                        onClick={() => toggleSaveCountry(id)}
                        className="text-stone-400 hover:text-red-500 cursor-pointer ml-1"
                        title="Remove from dossier"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bookmarked Archival Cartography Plates */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                2. Selected Archival Map Plates ({savedPlates.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {savedPlates.length === 0 ? (
                  <span className="text-xs text-stone-400 italic">No plates saved yet.</span>
                ) : (
                  savedPlates.map(pId => (
                    <div 
                      key={pId} 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 shadow-xs"
                    >
                      <span className="font-mono">{pId}</span>
                      <button 
                        type="button" 
                        onClick={() => toggleSavePlate(pId)}
                        className="text-stone-400 hover:text-red-500 cursor-pointer ml-1"
                        title="Remove plate from dossier"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Compile Action Button */}
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-mono">
                {savedCountries.length + savedPlates.length} total research assets selected
              </span>

              <button
                type="button"
                disabled={isGeneratingDossier || (savedCountries.length === 0 && savedPlates.length === 0)}
                onClick={async () => {
                  setIsGeneratingDossier(true);
                  try {
                    await exportCustomBriefingDossierPDF(savedCountries, savedPlates);
                  } finally {
                    setIsGeneratingDossier(false);
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingDossier ? 'Generating PDF Briefing...' : 'Compile Academic Dossier (PDF)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicExportModal;
