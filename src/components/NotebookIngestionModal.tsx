import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Layers, 
  ChevronRight,
  Code
} from 'lucide-react';
import { ingestNotebookMarkdown, IngestionResult } from '../data/notebookIngestionPipeline';
import { ResearchReport } from '../data/reportsData';
import { SAFE_EXTERNAL_LINK_PROPS } from '../data/externalLinksRegistry';

interface NotebookIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportIngested: (newReport: ResearchReport, result: IngestionResult) => void;
}

const SAMPLE_NOTEBOOK_MARKDOWN = `---
id: "report-bantu-expansion-genomics"
title: "Molecular Genetics of the Bantu Expansion & Sub-Saharan Admixture"
subtitle: "High-density autosomal SNP analysis reconstructing demographic expansion from the Benue-Cross River Basin"
category: "genetics"
authors:
  - "Dr. Amara Okafor"
  - "Prof. K. A. Diallo"
  - "Dr. Marcus Thorne"
institutions:
  - "African Institute for Molecular Genetics, Ibadan"
  - "Institut Pasteur Dakar"
  - "Center for Afro-Atlantic Studies"
publicationDate: "March 2026"
readingTimeMinutes: 18
doi: "10.1016/j.ajhg.2026.03.011"
classification: "Population Genetics & Archaeogenomics"
section: "reports"
pillar: "genetics"
regions:
  - "Western Africa"
  - "Central Africa"
countries:
  - "NGA"
  - "CMR"
  - "COD"
---

# Executive Summary
The expansion of Bantu-speaking agriculturalists across Sub-Saharan Africa constitutes one of the most profound demographic events in human evolutionary history. Integrating ancient DNA specimens with modern high-coverage genomes from 14 contemporary populations, this monograph details the continuous genetic continuity spanning 4,000 years, tracing back to ancestral agriculturalist groups in the Grassfields region of Cameroon and the Benue-Cross River Basin of modern Nigeria.

## 1. Demographic Radiations Along the Congo River Basin
Archaeogenomic modeling indicates that ancestral Bantu-speaking groups traversed the equatorial rainforest along fluvial networks rather than arid savannas. Dense rainforest canopy adaptation required significant metabolic adaptations that remain detectable in contemporary Central and Southern African populations.

**Key Takeaway:** Ancient DNA confirms two distinct westward and southward migratory pulses occurring around 2500 BCE and 1000 BCE respectively.

> "Genomic data acts as an indelible historical parchment, revealing the exact demographic velocity of ancient African farming communities."

## 2. Admixture Dynamics with Indigenous Forager Populations
Prior to agricultural expansion, diverse hunter-gatherer populations occupied the central and southern African biomes. Genetic analysis demonstrates asymmetrical sex-biased admixture, characterized predominantly by Bantu-speaking male lineages and indigenous maternal lineages (Micheletti, 2020). Similar institutional and material extraction dynamics mirror post-expansion demographic reorganizations (Nunn, 2011).

## References
- Micheletti, S. J. (2020). Genetic Consequences of the Transatlantic Slave Trade in the Americas. The American Journal of Human Genetics. https://doi.org/10.1016/j.ajhg.2020.06.012
- Nunn, N. (2011). The Slave Trade and the Origins of Mistrust in Africa. American Economic Review. https://doi.org/10.1257/aer.101.7.3221
`;

export const NotebookIngestionModal: React.FC<NotebookIngestionModalProps> = ({
  isOpen,
  onClose,
  onReportIngested
}) => {
  const [markdownInput, setMarkdownInput] = useState<string>(SAMPLE_NOTEBOOK_MARKDOWN);
  const [ingestionResult, setIngestionResult] = useState<IngestionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'json'>('editor');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParse = () => {
    try {
      setErrorMsg(null);
      if (!markdownInput.trim()) {
        setErrorMsg('Please paste or upload Markdown content from Google Notebook.');
        return;
      }
      const result = ingestNotebookMarkdown(markdownInput);
      setIngestionResult(result);
      setActiveTab('preview');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error parsing markdown content.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setMarkdownInput(content);
      try {
        const result = ingestNotebookMarkdown(content);
        setIngestionResult(result);
        setActiveTab('preview');
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to parse uploaded file.');
      }
    };
    reader.readAsText(file);
  };

  const handleCommit = () => {
    if (!ingestionResult) return;
    onReportIngested(ingestionResult.report, ingestionResult);
    onClose();
  };

  const handleCopyJson = () => {
    if (!ingestionResult) return;
    navigator.clipboard.writeText(ingestionResult.summaryJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        
        {/* Modal Masthead */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white font-serif flex items-center gap-2">
                <span>Google NotebookLM Ingestion Pipeline</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Auto-Routing Active
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Preserves verbatim scholarly citations as semantic [REF] tags with canonical DOI resolution.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/40 dark:bg-zinc-950/40 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'editor' 
                  ? 'bg-amber-500 text-zinc-950 font-bold' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              1. Markdown Input
            </button>
            <button
              type="button"
              onClick={handleParse}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'preview' 
                  ? 'bg-amber-500 text-zinc-950 font-bold' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              2. Semantic Preview {ingestionResult && `(${ingestionResult.extractedSectionsCount} secs)`}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!ingestionResult) handleParse();
                setActiveTab('json');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'json' 
                  ? 'bg-amber-500 text-zinc-950 font-bold' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              3. Structured JSON Schema
            </button>
          </div>

          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-amber-500" />
            <span>Upload .md File</span>
            <input 
              type="file" 
              accept=".md,.txt,.markdown" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Paste Google NotebookLM notes or edit YAML frontmatter:</span>
                <span className="font-mono text-[11px]">{markdownInput.split('\n').length} lines</span>
              </div>
              <textarea
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                rows={16}
                className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 font-mono text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                placeholder="Paste Markdown exported from Google Notebook..."
              />
            </div>
          )}

          {activeTab === 'preview' && ingestionResult && (
            <div className="space-y-6">
              {/* Ingestion Diagnostics Pill Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                    Auto Category
                  </div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white mt-1">
                    {ingestionResult.report.categoryLabel}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                    Extracted Sections
                  </div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white mt-1">
                    {ingestionResult.extractedSectionsCount} H2 Blocks
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                    Semantic [REF] Tags
                  </div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white mt-1">
                    {ingestionResult.semanticRefTagsCount} In-text Chips
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-mono">
                    Bibliography Items
                  </div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white mt-1">
                    {ingestionResult.extractedCitationsCount} Citations
                  </div>
                </div>
              </div>

              {/* Title & Metadata Card */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white inline-block"
                  style={{ backgroundColor: ingestionResult.report.categoryColor }}
                >
                  {ingestionResult.report.categoryLabel}
                </span>
                <h3 className="text-lg font-bold font-serif text-zinc-900 dark:text-white">
                  {ingestionResult.report.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {ingestionResult.report.subtitle}
                </p>
                <div className="text-[11px] font-mono text-zinc-500 pt-1 flex flex-wrap gap-x-4">
                  <span>Authors: {ingestionResult.report.authors.join(', ')}</span>
                  <span>DOI: {ingestionResult.report.doi}</span>
                </div>
              </div>

              {/* Parsed Sections */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-500">
                  Partitioned Monograph Body
                </h4>
                {ingestionResult.report.sections.map((sec, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <div className="font-bold text-sm font-serif text-zinc-900 dark:text-white">
                      {sec.title}
                    </div>
                    <div className="text-xs text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed line-clamp-3">
                      {sec.content}
                    </div>
                    {sec.keyTakeaway && (
                      <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2 rounded-xl">
                        💡 Key Takeaway: {sec.keyTakeaway}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Citations List */}
              {ingestionResult.report.citations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-500">
                    Extracted Bibliographic Citations
                  </h4>
                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
                    {ingestionResult.report.citations.map((c) => (
                      <div key={c.id} className="py-2 flex items-center justify-between gap-4">
                        <div>
                          <span className="font-semibold text-zinc-900 dark:text-white">{c.authors} ({c.year}): </span>
                          <span className="text-zinc-600 dark:text-zinc-400 italic">{c.title}</span>
                        </div>
                        {c.doiOrUrl && (
                          <a 
                            href={c.doiOrUrl} 
                            {...SAFE_EXTERNAL_LINK_PROPS}
                            className="font-mono text-[10px] text-amber-500 hover:underline shrink-0 flex items-center gap-1"
                          >
                            <span>DOI Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'json' && ingestionResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Standard Structured JSON Summary ready for reports catalog:</span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-xs font-mono transition-colors cursor-pointer"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto max-h-96 leading-relaxed">
                {ingestionResult.summaryJson}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60">
          <div className="text-xs text-zinc-500">
            {ingestionResult ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Ready to publish and route automatically
              </span>
            ) : (
              <span>Click "Parse & Validate" to extract citations and structure</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'editor' ? (
              <button
                type="button"
                onClick={handleParse}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Parse & Validate</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  Edit Markdown
                </button>
                <button
                  type="button"
                  onClick={handleCommit}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish to Atlas Directory</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
