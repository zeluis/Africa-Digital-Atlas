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
  Sparkles
} from 'lucide-react';

interface AcademicExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sourceContext: string;
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
  title,
  sourceContext,
  citationMetadata = {
    authors: ['Africalia Consortium', 'SlaveVoyages Trans-Atlantic Dataset', 'UNESCO General History of Africa'],
    year: 2026,
    datasetName: 'Africalia Sovereign African Atlas & Ethnographic Tree of Life',
    url: window?.location?.href || 'https://africalia.org',
    doi: '10.5281/zenodo.africalia.2026.01',
    version: '2026.1 (Canonical Edition)'
  },
  svgContainerId
}) => {
  const [citationTab, setCitationTab] = useState<'apa' | 'bibtex' | 'chicago' | 'ris'>('apa');
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingImage, setIsExportingImage] = useState<boolean>(false);

  if (!isOpen) return null;

  const accessDate = new Date().toISOString().split('T')[0];
  const pageUrl = window?.location?.href || 'https://africalia.org';

  // Citations
  const apaCitation = `Africalia Research Consortium. (${citationMetadata.year || 2026}). ${title} [Data visualization & cartographic dataset]. ${citationMetadata.datasetName} (Version ${citationMetadata.version || '2026.1'}). Retrieved ${accessDate}, from ${pageUrl}`;

  const chicagoCitation = `Africalia Research Consortium. "${title}." ${citationMetadata.datasetName}, version ${citationMetadata.version || '2026.1'} (${citationMetadata.year || 2026}). Accessed ${accessDate}. ${pageUrl}.`;

  const bibtexCitation = `@misc{africalia_${(citationMetadata.year || 2026)},
  author = {Africalia Research Consortium},
  title = {{${title}}},
  howpublished = {\\url{${pageUrl}}},
  year = {${citationMetadata.year || 2026}},
  note = {Accessed: ${accessDate}},
  publisher = {${citationMetadata.datasetName}},
  version = {${citationMetadata.version || '2026.1'}}
}`;

  const risCitation = `TY  - DATA
TI  - ${title}
AU  - Africalia Research Consortium
PY  - ${citationMetadata.year || 2026}
DP  - ${citationMetadata.datasetName}
UR  - ${pageUrl}
Y2  - ${accessDate}
ER  -`;

  const getActiveCitation = () => {
    switch (citationTab) {
      case 'apa': return apaCitation;
      case 'chicago': return chicagoCitation;
      case 'bibtex': return bibtexCitation;
      case 'ris': return risCitation;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCitation());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG / Image snapshot export
  const handleExportSvg = () => {
    if (!svgContainerId) return;
    const container = document.getElementById(svgContainerId);
    if (!container) return;

    const svgElement = container.querySelector('svg');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    // Add XML namespaces if not present
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `africalia-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${accessDate}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 grid place-items-center">
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Academic Citation & Vector Export
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {sourceContext}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Quick Snapshot Action */}
          {svgContainerId && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  Export Vector Visual (.SVG)
                </span>
                <span className="block text-[11px] text-emerald-800 dark:text-emerald-400">
                  Lossless scalable graphics with native embedded coordinates and styling.
                </span>
              </div>
              <button
                type="button"
                onClick={handleExportSvg}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save SVG</span>
              </button>
            </div>
          )}

          {/* Citation Format Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 font-mono uppercase tracking-wider">
                Bibliographic Citation Formats
              </span>
              <div className="flex items-center gap-1">
                {(['apa', 'bibtex', 'chicago', 'ris'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setCitationTab(fmt)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      citationTab === fmt
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Citation Box */}
            <div className="relative p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <pre className="text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-all select-all leading-relaxed max-h-48 overflow-y-auto">
                {getActiveCitation()}
              </pre>

              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-1 shadow-xs cursor-pointer transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Permanent Identifiers Info */}
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Permanent Digital Object Identifier (DOI):</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{citationMetadata.doi}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Canonical Repository Version:</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200">{citationMetadata.version}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Open Access Academic Research License</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
