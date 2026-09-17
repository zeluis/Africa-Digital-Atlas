import React, { useState } from 'react';
import { ResearchReport } from '../data/reportsData';
import { AfricaliaReport } from '../types/africaliaReport';
import { Copy, Check, Download, BookOpen, X, Code2, Share2 } from 'lucide-react';

interface CitePublicationModalProps {
  report: ResearchReport | AfricaliaReport;
  isOpen: boolean;
  onClose: () => void;
}

export const CitePublicationModal: React.FC<CitePublicationModalProps> = ({
  report,
  isOpen,
  onClose
}) => {
  const [style, setStyle] = useState<'chicago' | 'apa' | 'bibtex' | 'harvard' | 'ris' | 'jsonld'>('chicago');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const authorsList = Array.isArray(report.authors) 
    ? report.authors 
    : [String(report.authors)];
  const authorsStr = authorsList.join(', ');
  const year = report.publicationDate?.split(' ').pop() || new Date().getFullYear().toString();
  const doi = report.doi || '10.5281/zenodo.africalia.001';
  const doiUrl = doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
  const title = report.title;
  const subtitle = report.subtitle ? `: ${report.subtitle}` : '';

  const generateCitationText = () => {
    switch (style) {
      case 'chicago':
        return `${authorsStr}. ${year}. "${title}${subtitle}." Africalia: Pan-African Research Repository. ${doiUrl}.`;
      case 'apa':
        return `${authorsStr} (${year}). ${title}${subtitle}. Africalia: Pan-African Research Repository. ${doiUrl}`;
      case 'harvard':
        return `${authorsStr}, ${year}. ${title}${subtitle}. Africalia Research Repository. Available at: <${doiUrl}> [Accessed ${new Date().toLocaleDateString('en-GB')}].`;
      case 'bibtex': {
        const citeKey = report.id.replace(/[^a-zA-Z0-9]/g, '_') + '_' + year;
        return `@article{${citeKey},
  title={${title}},
  subtitle={${report.subtitle || ''}},
  author={${authorsList.join(' and ')}},
  journal={Africalia: Pan-African Research Repository},
  year={${year}},
  doi={${doi}},
  url={${doiUrl}}
}`;
      }
      case 'ris':
        return `TY  - JOUR
TI  - ${title}${subtitle}
${authorsList.map(a => `AU  - ${a}`).join('\n')}
JO  - Africalia: Pan-African Research Repository
PY  - ${year}
DO  - ${doi}
UR  - ${doiUrl}
ER  - `;
      case 'jsonld': {
        const schema = {
          "@context": "https://schema.org",
          "@type": "ScholarlyArticle",
          "headline": title,
          "name": `${title}${subtitle}`,
          "description": report.executiveSummary,
          "author": authorsList.map(a => ({
            "@type": "Person",
            "name": a
          })),
          "datePublished": report.publicationDate,
          "identifier": doiUrl,
          "publisher": {
            "@type": "Organization",
            "name": "Africalia: African Data Atlas & Research Repository",
            "url": "https://africalia.atlas"
          }
        };
        return JSON.stringify(schema, null, 2);
      }
      default:
        return '';
    }
  };

  const citationText = generateCitationText();

  const handleCopy = () => {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const ext = style === 'bibtex' ? 'bib' : style === 'ris' ? 'ris' : style === 'jsonld' ? 'json' : 'txt';
    const mime = style === 'jsonld' ? 'application/json' : 'text/plain';
    const blob = new Blob([citationText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}_citation.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <BookOpen className="w-4 h-4" />
              <span>Cite Publication</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100 font-serif">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 text-xs">
          {(
            [
              { id: 'chicago', label: 'Chicago' },
              { id: 'apa', label: 'APA 7th' },
              { id: 'harvard', label: 'Harvard' },
              { id: 'bibtex', label: 'BibTeX' },
              { id: 'ris', label: 'RIS / EndNote' },
              { id: 'jsonld', label: 'Schema.org JSON-LD' },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setStyle(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                style === tab.id
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Citation Output Box */}
        <div className="relative rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto whitespace-pre-wrap max-h-56 leading-relaxed select-all">
          {citationText}
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <span>DOI:</span>
            <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">{doi}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition cursor-pointer"
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
          </div>
        </div>
      </div>
    </div>
  );
};
export default CitePublicationModal;
