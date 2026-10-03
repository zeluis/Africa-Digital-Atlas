import React, { useState, useRef, useEffect } from 'react';
import { ingestNotebookMarkdown, IngestionResult } from '../data/notebookIngestionPipeline';
import { ResearchReport } from '../data/reportsData';
import { SAFE_EXTERNAL_LINK_PROPS } from '../data/externalLinksRegistry';
import { 
  X, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Code, 
  BookOpen, 
  Copy, 
  Check,
  ExternalLink,
  Layers,
  ScrollText
} from 'lucide-react';

interface NotebookIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestComplete: (newReport: ResearchReport) => void;
  defaultTargetPipeline?: 'reports' | 'working-papers';
}

const SAMPLE_REPORT_MARKDOWN = `---
id: "report-genetics-sahelian-pastoral-corridors"
title: "Genomic Continuity and Iron Age Metallurgy Across Sahelian Pastoral Corridors"
subtitle: "Whole-Genome Admixture Reconstruction and Archaeometallurgical Stratigraphy (800 BCE – 1400 CE)"
date: "2026-10-04"
version: "1.0"

author:
  name: "Africalia"
  type: "Interdisciplinary Research & Knowledge Initiative"
  role: "Institutional / Project Author"
  platform: "Africalia Research Platform"

publication:
  series: "Africalia Scholarly Research Reports"
  type: "research_report"
  status: "Research Edition"
  language: "en"
  citationStyle: "Chicago Author-Date"
  category: "Africalia Scholarly Research Reports"

research:
  disciplines:
    - "Paleogenomics"
    - "Archaeometallurgy"
    - "Sahelian History"
  methodology: "High-coverage ancient DNA sequencing and slag isotope ratio synthesis"

ai_assistance:
  enabled: true
  system: "Anthropic"
  role:
    - "Research discovery"
    - "Source synthesis"
    - "Information organization"
  status: "AI-assisted"
  accountability: "Africalia"

section: "reports"
pillar: "genetics"

regions:
  - "Western Africa"
  - "Northern Africa"

countries:
  - "MLI"
  - "SEN"
  - "MRT"
  - "NER"

tags:
  - "Ancient DNA"
  - "Sahelian Metallurgy"
  - "Trans-Saharan Trade"

icon: "ph:dna-bold"
readTimeMinutes: 18
featured: true
---

## Executive Summary
Recent high-coverage paleogenomic sequencing across the Middle Niger and Senegal river valleys reveals deep demographic continuity linking Iron Age bloomery furnace complexes to contemporary Mande and Fulani populations (MacEachern, 2018). By integrating isotopic slag signatures with identity-by-descent (IBD) haplotype sharing, we demonstrate that early urban clusters functioned as autonomous technological hubs centuries prior to trans-Saharan caravan consolidation (McIntosh, 2005).

## 1. Paleogenomic Stratigraphy of the Middle Niger
 Genome-wide single nucleotide polymorphism (SNP) arrays extracted from 42 osteological remains across Jenne-Jeno and Méma exhibit pronounced affinity with modern Western African linguistic phyla (Fortes-Lima et al., 2024).

**Key Takeaway:** Early Sahelian urbanization was driven by endogenous agropastoral and metallurgical specialization rather than external demographic replacement.

> "The genomic record of the Inland Niger Delta preserves an unbroken 2,500-year signature of non-hierarchical urban craft networks."

## References
- Fortes-Lima, C. et al. (2024). The genetic history of the Sahel and West African populations. Nature, 625, 412-425. https://doi.org/10.1038/s41586-023-06770-6
- MacEachern, S. (2018). Searching for Boko Haram: A History of Violence in Central Africa. Oxford University Press. https://doi.org/10.1093/oso/9780190492526.001.0001
- McIntosh, R. J. (2005). Ancient Middle Niger: Urbanism and the Self-Organizing Landscape. Cambridge University Press. https://doi.org/10.1017/CBO9780511614262
`;

const SAMPLE_WORKING_PAPER_MARKDOWN = `---
id: "wp-development-atlantic-fiscal-counterfactuals"
title: "Counterfactual Capital Accumulation and Maritime Insurance in the Atlantic System"
subtitle: "Africalia Working Paper on Shapley Value Decompositions and Port-City Industrialization"
date: "2026-10-04"
version: "1.0"

author:
  name: "Africalia"
  type: "Interdisciplinary Research & Knowledge Initiative"
  role: "Institutional / Project Author"
  platform: "Africalia Research Platform"

publication:
  series: "Africalia Working Paper & Policy Brief Series"
  seriesNumber: "Africalia Working Paper No. 09"
  type: "working_paper"
  status: "Working Paper Pre-Print"
  language: "en"
  citationStyle: "Chicago Author-Date"
  category: "Africalia Working Paper & Policy Brief Series"
  issn: "ISSN 2983-4921 (Online Archive)"
  jelCodes:
    - "N17"
    - "O10"
    - "F54"

research:
  disciplines:
    - "Historical Economics"
    - "Atlantic Economy"
    - "Quantitative Economic History"
  methodology: "Spatial general-equilibrium calibration and Shapley decomposition"

ai_assistance:
  enabled: true
  system: "Anthropic"
  role:
    - "Research discovery"
    - "Source synthesis"
    - "Information organization"
  status: "AI-assisted"
  accountability: "Africalia"

section: "working-papers"
pillar: "development"

regions:
  - "Western Africa"
  - "Caribbean"
  - "Europe"

countries:
  - "GHA"
  - "GBR"
  - "JAM"

tags:
  - "Economic Development"
  - "Shapley Decomposition"
  - "Working Paper"

icon: "ph:scales-bold"
readTimeMinutes: 20
featured: true
---

## Abstract
This working paper develops a multi-region spatial general-equilibrium framework isolating the net coercion rent of plantation commodity chains from general Atlantic trade integration (Heblich et al., 2023). Using British emancipation compensation records alongside port-level marine underwriting ledgers, we bound the domestic capital reallocation parameter φ ∈ [0, 1] across competing counterfactual regimes (Derenoncourt, 2025).

## 1. Estimands: Gross Value Added vs. Net Surplus
Subtracting gross plantation output from metropolitan GDP conflates scale with causal contribution (Rönnbäck, 2018). We define net surplus relative to the next-best feasible deployment of shipping, credit, and manufacturing labor.

| Scenario | Removed Mechanism | Counterfactual Reallocation Rule |
|----|----|----|
| C0 | Transatlantic Slave Trade | Alternative labor supply at market-clearing wage |
| C1 | Plantation Coercion Rent | Factor redeployment with endogenous savings φ |
| C2 | Full Atlantic Slave System | Joint general-equilibrium price adjustment |

**Key Takeaway:** Dynamic learning-by-doing in textiles and marine finance amplifies first-round net surplus under partial factor reallocation.

## References
- Derenoncourt, E. (2025). Atlantic Slavery's Impact on European and British Economic Development. Journal of Historical Political Economy, 5(1), 1-19.
- Heblich, S., Redding, S. J., & Voth, H.-J. (2023). Slavery and the British Industrial Revolution. NBER Working Paper 30451. https://doi.org/10.3386/w30451
- Rönnbäck, K. (2018). On the economic importance of the slave plantation complex to the British economy. Journal of Global History, 13(3), 309-327.
`;

export const NotebookIngestionModal: React.FC<NotebookIngestionModalProps> = ({
  isOpen,
  onClose,
  onIngestComplete,
  defaultTargetPipeline = 'reports'
}) => {
  const [targetPipeline, setTargetPipeline] = useState<'reports' | 'working-papers'>(defaultTargetPipeline);
  const [markdownInput, setMarkdownInput] = useState<string>(
    defaultTargetPipeline === 'working-papers' ? SAMPLE_WORKING_PAPER_MARKDOWN : SAMPLE_REPORT_MARKDOWN
  );
  const [ingestionResult, setIngestionResult] = useState<IngestionResult | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'json' | 'schema'>('editor');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTargetPipeline(defaultTargetPipeline);
  }, [defaultTargetPipeline]);

  if (!isOpen) return null;

  const handlePipelineSwitch = (mode: 'reports' | 'working-papers') => {
    setTargetPipeline(mode);
    if (markdownInput === SAMPLE_REPORT_MARKDOWN && mode === 'working-papers') {
      setMarkdownInput(SAMPLE_WORKING_PAPER_MARKDOWN);
    } else if (markdownInput === SAMPLE_WORKING_PAPER_MARKDOWN && mode === 'reports') {
      setMarkdownInput(SAMPLE_REPORT_MARKDOWN);
    }
  };

  const handleParse = () => {
    const sourcePrefix = targetPipeline === 'working-papers' ? 'working-papers/uploaded.md' : 'reports/uploaded.md';
    const res = ingestNotebookMarkdown(markdownInput, sourcePrefix);
    if (targetPipeline === 'working-papers') {
      res.report.isWorkingPaper = true;
      res.report.classification.section = 'working-papers';
    }
    setIngestionResult(res);
    setActiveTab('preview');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setMarkdownInput(content);
        const sourcePrefix = targetPipeline === 'working-papers' ? `working-papers/${file.name}` : `reports/${file.name}`;
        const res = ingestNotebookMarkdown(content, sourcePrefix);
        if (targetPipeline === 'working-papers' || res.report.isWorkingPaper) {
          res.report.isWorkingPaper = true;
          res.report.classification.section = 'working-papers';
          setTargetPipeline('working-papers');
        }
        setIngestionResult(res);
        setActiveTab('preview');
      }
    };
    reader.readAsText(file);
  };

  const handleCopyJson = () => {
    if (!ingestionResult) return;
    navigator.clipboard.writeText(ingestionResult.summaryJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCommit = () => {
    if (!ingestionResult) {
      const sourcePrefix = targetPipeline === 'working-papers' ? 'working-papers/uploaded.md' : 'reports/uploaded.md';
      const res = ingestNotebookMarkdown(markdownInput, sourcePrefix);
      if (targetPipeline === 'working-papers') {
        res.report.isWorkingPaper = true;
      }
      persistPublication(res.report);
      onIngestComplete(res.report);
    } else {
      persistPublication(ingestionResult.report);
      onIngestComplete(ingestionResult.report);
    }
    onClose();
  };

  const persistPublication = (rep: ResearchReport) => {
    try {
      const storageKey = rep.isWorkingPaper || targetPipeline === 'working-papers'
        ? 'africalia_custom_working_papers'
        : 'africalia_custom_reports';
      const saved = localStorage.getItem(storageKey);
      const existing = saved ? JSON.parse(saved) : {};
      existing[rep.id] = rep;
      localStorage.setItem(storageKey, JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent('africalia-publications-updated'));
    } catch {
      // Ignore storage quota errors
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span>Universal Markdown Ingestion Pipeline</span>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-md border border-amber-500/30">
                  {targetPipeline === 'working-papers' ? 'content/working-papers' : 'content/reports'}
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Automatically parses YAML frontmatter, pillar & category routing, tables, and [REF] citations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Target Directory / Pipeline Selector */}
            <div className="inline-flex p-1 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 border border-zinc-300/60 dark:border-zinc-700 text-xs font-mono">
              <button
                type="button"
                onClick={() => handlePipelineSwitch('reports')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  targetPipeline === 'reports'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Report / Notebook</span>
              </button>
              <button
                type="button"
                onClick={() => handlePipelineSwitch('working-papers')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  targetPipeline === 'working-papers'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <ScrollText className="w-3.5 h-3.5 text-amber-500" />
                <span>Working Paper</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-zinc-100/70 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-xs font-mono">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'editor'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Markdown (.md)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!ingestionResult) handleParse();
                else setActiveTab('preview');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 font-bold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>2. Semantic Preview</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!ingestionResult) handleParse();
                setActiveTab('json');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'json'
                  ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>3. Canonical JSON</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'schema'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Universal Frontmatter Spec</span>
            </button>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload .md File</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'editor' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>
                  Paste or upload a Markdown file with Universal YAML Frontmatter. Target directory:{' '}
                  <code className="text-amber-600 dark:text-amber-400 font-mono">
                    {targetPipeline === 'working-papers' ? '/src/content/working-papers/*.md' : '/src/content/reports/*.md'}
                  </code>
                </span>
                <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400">
                  Supports # or ## Sections, Tables, Code Blocks & (Author, Year)
                </span>
              </div>
              <textarea
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                rows={16}
                className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 font-mono text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                placeholder="Paste raw markdown with YAML frontmatter here..."
              />
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Universal Africalia YAML Frontmatter Specification (v1.0)
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Both <strong>Research Reports/Notebooks</strong> (<code className="font-mono">/src/content/reports/*.md</code>) and{' '}
                  <strong>Africalia Working Papers</strong> (<code className="font-mono">/src/content/working-papers/*.md</code>) share the exact same Universal YAML Frontmatter structure. Only <strong>two fields</strong> differ between a Report and a Working Paper:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                      1. Research Report / Notebook (/content/reports/)
                    </div>
                    <pre className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
{`section: "reports"
publication:
  series: "Africalia Scholarly Research Reports"
  type: "research_report" # or research_article`}
                    </pre>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <div className="font-mono font-bold text-amber-600 dark:text-amber-400 mb-1">
                      2. Africalia Working Paper (/content/working-papers/)
                    </div>
                    <pre className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
{`section: "working-papers"
publication:
  series: "Africalia Working Paper & Policy Brief Series"
  seriesNumber: "Africalia Working Paper No. 08"
  type: "working_paper" # or policy_brief`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono font-bold uppercase tracking-wider text-zinc-500">
                  Supported `pillar` Values (Auto-routes to Pillar & Category)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      targetPipeline === 'working-papers' ? SAMPLE_WORKING_PAPER_MARKDOWN : SAMPLE_REPORT_MARKDOWN
                    );
                    setCopiedTemplate(true);
                    setTimeout(() => setCopiedTemplate(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-[11px] cursor-pointer"
                >
                  {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTemplate ? 'Copied Template' : 'Copy Full Template'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">Genetics & Admixture</div>
                  <div className="font-mono text-[11px] text-zinc-500 mt-1">
                    pillar: "genetics" | "heritage" | "culture"
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <div className="font-bold text-amber-600 dark:text-amber-400">Law & Sovereignty</div>
                  <div className="font-mono text-[11px] text-zinc-500 mt-1">
                    pillar: "law"
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">Development & Economics</div>
                  <div className="font-mono text-[11px] text-zinc-500 mt-1">
                    pillar: "development" | "macroeconomics" | "history" | "climate" | "demography"
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && ingestionResult && (
            <div className="space-y-6">
              {/* Ingestion Diagnostics Pill Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                    Pillar & Category
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
                    {ingestionResult.extractedSectionsCount} Sections
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                    Publication Class
                  </div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white mt-1">
                    {ingestionResult.report.isWorkingPaper ? 'Africalia Working Paper' : 'Scholarly Monograph'}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-mono">
                    Bibliography Items
                  </div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white mt-1">
                    {ingestionResult.extractedCitationsCount} Citations ({ingestionResult.semanticRefTagsCount} Chips)
                  </div>
                </div>
              </div>

              {/* Title & Metadata Card */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white inline-block"
                    style={{ backgroundColor: ingestionResult.report.categoryColor }}
                  >
                    {ingestionResult.report.categoryLabel}
                  </span>
                  {ingestionResult.report.isWorkingPaper && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      {ingestionResult.report.seriesNumber || 'Africalia Working Paper Series'}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold font-serif text-zinc-900 dark:text-white">
                  {ingestionResult.report.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {ingestionResult.report.subtitle}
                </p>
                <div className="text-[11px] font-mono text-zinc-500 pt-1 flex flex-wrap gap-x-4">
                  <span>ID: {ingestionResult.report.id}</span>
                  <span>Authors: {ingestionResult.report.authors.join(', ')}</span>
                  <span>DOI: {ingestionResult.report.doi}</span>
                </div>
              </div>

              {/* Parsed Sections */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-500">
                  Partitioned Sections ({ingestionResult.report.sections.length})
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
                        Key Takeaway: {sec.keyTakeaway}
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
                <span>Standard Structured JSON Summary ready for catalog:</span>
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
                <CheckCircle2 className="w-4 h-4" /> Ready to publish to{' '}
                {ingestionResult.report.isWorkingPaper ? 'Working Papers & Pillar Directory' : 'Research Reports Directory'}
              </span>
            ) : (
              <span>Click "Parse & Validate" to extract citations, pillar, and structure</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'editor' || activeTab === 'schema' ? (
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Edit Markdown
                </button>
                <button
                  type="button"
                  onClick={handleCommit}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {targetPipeline === 'working-papers' ? 'Publish Working Paper' : 'Publish to Atlas Directory'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
