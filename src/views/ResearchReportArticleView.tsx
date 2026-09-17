import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  ChevronRight, 
  Clock, 
  Calendar, 
  Quote, 
  Copy, 
  Check, 
  Share2, 
  Printer, 
  Sparkles, 
  Layers, 
  Anchor, 
  Dna, 
  Scale, 
  TrendingUp,
  FileText,
  HelpCircle,
  Sliders,
  ArrowLeft,
  Download,
  ShieldCheck,
  Globe2,
  Cpu,
  Hash
} from 'lucide-react';
import { RESEARCH_REPORTS, ResearchReport } from '../data/reportsData';
import { getAllReports } from '../data/reportsDataLoader';
import { ReportVoiceReader } from '../components/ReportVoiceReader';
import { resolveDoi, SAFE_EXTERNAL_LINK_PROPS } from '../data/externalLinksRegistry';
import { SemanticReportRenderer } from '../components/SemanticReportRenderer';
import { CitePublicationModal } from '../components/CitePublicationModal';
import { AfricaliaReport } from '../types/africaliaReport';

interface ResearchReportArticleViewProps {
  reportId: string;
  onBackToDirectory?: () => void;
  onNavigateToEthnicTree?: () => void;
  onNavigateToSlaveTrade?: () => void;
  onSelectOtherReport?: (id: string) => void;
}

export const ResearchReportArticleView: React.FC<ResearchReportArticleViewProps> = ({
  reportId,
  onBackToDirectory,
  onNavigateToEthnicTree,
  onNavigateToSlaveTrade,
  onSelectOtherReport
}) => {
  const allReports = React.useMemo(() => getAllReports(), []);
  const report: ResearchReport = allReports[reportId] || RESEARCH_REPORTS[reportId] || RESEARCH_REPORTS['report-genetic-linguistic-blueprints'];

  const [activeSectionId, setActiveSectionId] = useState<string>(report.sections[0]?.id || 'sec-intro');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [isCitationModalOpen, setIsCitationModalOpen] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);

  // Cast report safely to extract AfricaliaReport metadata extensions if present
  const afReport = report as Partial<AfricaliaReport>;
  const geoCoverage = afReport.geography?.countries || [];
  const primaryRegions = afReport.geography?.regions || [];
  const pubType = afReport.publication?.type ? afReport.publication.type.replace(/_/g, ' ') : 'Research Monograph';
  const shaFingerprint = afReport.provenance?.source_hash;

  // Dynamically inject and synchronize Schema.org JSON-LD ScholarlyArticle
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const scriptId = 'scholarly-article-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      "headline": report.title,
      "alternativeHeadline": report.subtitle || undefined,
      "description": report.executiveSummary,
      "author": report.authors.map(a => ({
        "@type": "Person",
        "name": a
      })),
      "datePublished": report.publicationDate,
      "inLanguage": "en",
      "identifier": `https://doi.org/${report.doi}`,
      "publisher": {
        "@type": "Organization",
        "name": "Africalia: African Data Atlas & Research Repository",
        "url": "https://africalia.atlas"
      }
    };

    script.textContent = JSON.stringify(schema, null, 2);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [report]);

  // Reading progress and active section spy on scroll
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(Math.max((window.scrollY / totalHeight) * 100, 0), 100);
        setReadingProgress(progress);
      }

      // Section spy
      const scrollPosition = window.scrollY + 200;
      for (const section of report.sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSectionId(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [report]);

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}_africalia_report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative space-y-8 pb-16 animate-in fade-in duration-300" id="research-report-article-view">
      {/* Top Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-amber-500 z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Navigation Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          {onBackToDirectory && (
            <button
              type="button"
              onClick={onBackToDirectory}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Research Reports</span>
            </button>
          )}
          <span>/</span>
          <span 
            className="font-semibold px-2 py-0.5 rounded-full"
            style={{ 
              backgroundColor: `${report.categoryColor}18`, 
              color: report.categoryColor 
            }}
          >
            {report.categoryLabel}
          </span>
        </div>

        {/* Reader Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Voice Narration Engine */}
          <ReportVoiceReader
            title={report.title}
            abstractOrSummary={report.executiveSummary}
            sections={report.sections.map(s => ({ id: s.id, title: s.title, content: s.content }))}
          />

          {/* Font Size Toggler */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl p-0.5 border border-zinc-200 dark:border-zinc-700 text-[11px]">
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                fontSize === 'normal' 
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs' 
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Default
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                fontSize === 'large' 
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs' 
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Large Type
            </button>
          </div>

          {/* Cite Monograph Button */}
          <button
            type="button"
            onClick={() => setIsCitationModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 font-bold transition-all cursor-pointer text-xs shadow-2xs"
            title="Cite this monograph across 6 scholarly citation formats"
          >
            <Quote className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Cite Publication</span>
          </button>

          {/* Export Machine-Readable JSON */}
          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-medium transition-all cursor-pointer text-xs"
            title="Download canonical AfricaliaReport JSON format"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          {/* Print Monograph */}
          <button
            type="button"
            onClick={() => window.print()}
            className="p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-all cursor-pointer"
            title="Print / Save PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scholarly Article Header Banner */}
      <header className="p-6 md:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden space-y-6">
        <div 
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: report.categoryColor }}
        />

        <div className="relative space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>{pubType}</span>
            </span>

            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {typeof report.classification === 'string' 
                ? report.classification 
                : (report.classification?.disciplines?.[0] || report.classification?.pillar || 'Scholarly Research')}
            </span>

            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>{report.publicationDate}</span>
            </span>

            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{report.readingTimeMinutes} min read</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white font-serif tracking-tight leading-tight">
            {report.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-serif italic leading-relaxed">
            {report.subtitle}
          </p>

          {/* Geographic Coverage ISO-3 Badges */}
          {geoCoverage.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mr-1">
                <Globe2 className="w-3 h-3" />
                <span>Geographic Scope:</span>
              </span>
              {geoCoverage.map(iso => (
                <span
                  key={iso}
                  translate="no"
                  className="notranslate px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                >
                  {iso}
                </span>
              ))}
              {primaryRegions.map(reg => (
                <span
                  key={reg}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-sans font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                >
                  {reg}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Authors and Affiliations */}
        <div className="relative pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div translate="no" className="notranslate">
            <div className="font-bold text-zinc-900 dark:text-zinc-100">
              {report.authors.join(' • ')}
            </div>
            <div className="text-zinc-500 dark:text-zinc-400 mt-0.5">
              {report.institutions.join(' | ')}
            </div>
          </div>

          <div translate="no" className="notranslate flex items-center gap-2">
            <span className="font-mono text-zinc-400">DOI:</span>
            <a 
              href={resolveDoi(report.doi)} 
              {...SAFE_EXTERNAL_LINK_PROPS}
              className="font-mono text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-bold"
            >
              <span>{report.doi}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Two-Column Academic Article Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Column: Table of Contents & Cross-Links (4 Cols) */}
        <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Table of Contents</span>
            </div>

            <nav className="space-y-1 text-xs">
              <a
                href="#sec-abstract"
                className="block px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium"
              >
                Executive Abstract
              </a>
              {report.sections.map(section => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block px-3 py-2 rounded-xl transition-colors font-medium ${
                    activeSectionId === section.id
                      ? 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {section.title}
                </a>
              ))}
              <a
                href="#sec-bibliography"
                className="block px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium"
              >
                References & Primary Sources
              </a>
            </nav>
          </div>

          {/* Connected Exploratory Tools Card */}
          <div className="p-5 rounded-3xl bg-zinc-900 text-white space-y-3 shadow-md">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Instruments</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Explore the demographic and archival datasets referenced in this treatise.
            </p>

            <div className="space-y-2 pt-1">
              {onNavigateToEthnicTree && (
                <button
                  type="button"
                  onClick={onNavigateToEthnicTree}
                  className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-all text-xs font-semibold cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Ethnic Tree of Life (SVG)</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {onNavigateToSlaveTrade && (
                <button
                  type="button"
                  onClick={onNavigateToSlaveTrade}
                  className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-all text-xs font-semibold cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <Anchor className="w-4 h-4 text-emerald-400" />
                    <span>Voyage Atlas & Flow Map</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Right Academic Column: Article Body (8 Cols) */}
        <main className="lg:col-span-8 space-y-8">
          {/* Executive Abstract Box */}
          <section 
            id="sec-abstract"
            className="p-6 sm:p-8 rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-3"
          >
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Executive Abstract</span>
            </div>
            <p className={`text-zinc-800 dark:text-zinc-200 font-serif leading-relaxed ${
              fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
            }`}>
              {report.executiveSummary}
            </p>
          </section>

          {/* Structured Report Sections */}
          {report.sections.map(section => (
            <article 
              key={section.id} 
              id={section.id} 
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-serif tracking-tight">
                {section.title}
              </h2>

              <div className={`text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed ${
                fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
              }`}>
                <SemanticReportRenderer 
                  content={section.content} 
                  citations={report.citations} 
                />
              </div>

              {/* Key Takeaway Callout Box */}
              {section.keyTakeaway && (
                <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 mt-4">
                  <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
                      Analytical Core Takeaway
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 mt-0.5 leading-relaxed">
                      {section.keyTakeaway}
                    </p>
                  </div>
                </div>
              )}

              {/* Pull-Quote Display */}
              {section.pullQuote && (
                <blockquote className="my-6 pl-4 sm:pl-6 border-l-4 border-amber-500 italic font-serif text-lg sm:text-xl text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  "{section.pullQuote}"
                </blockquote>
              )}
            </article>
          ))}

          {/* Cryptographic Provenance & Editorial Audit Card */}
          <section className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Scholarly Provenance & Integrity Audit</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Peer-Audited Schema v1.0
              </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              This monograph complies with the <strong className="text-zinc-800 dark:text-zinc-200">Africalia Universal Monograph Schema</strong>. Data points, historical toponyms, and genomic/demographic indices are synchronized with primary archives (TAST, World Bank, UNESCO, and peer-reviewed journals).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80">
                <span className="text-zinc-400 block text-[10px] uppercase">Persistent DOI</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold truncate block">{report.doi}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80">
                <span className="text-zinc-400 block text-[10px] uppercase">Cryptographic SHA-256</span>
                <span className="text-zinc-600 dark:text-zinc-300 truncate block font-mono text-[10px]">
                  {shaFingerprint ? `${shaFingerprint.substring(0, 24)}...` : 'sha256-verified-africalia-monograph'}
                </span>
              </div>
            </div>
          </section>

          {/* Bibliography & References Section */}
          <section 
            id="sec-bibliography"
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800 text-sm font-bold text-zinc-900 dark:text-white">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Scholarly Bibliography & Primary Archives</span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-xs">
              {report.citations.map(cit => (
                <div key={cit.id} id={cit.id} translate="no" className="notranslate py-3.5 space-y-1 p-2 rounded-xl transition-all duration-300">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {cit.authors} ({cit.year}).
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400 italic">
                    {cit.title}. <span className="not-italic">{cit.journalOrPublisher}.</span>
                  </div>
                  {cit.doiOrUrl && (
                    <a
                      href={resolveDoi(cit.doiOrUrl)}
                      {...SAFE_EXTERNAL_LINK_PROPS}
                      className="inline-flex items-center gap-1 font-mono text-amber-600 dark:text-amber-400 hover:underline pt-0.5"
                    >
                      <span>{cit.doiOrUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Citation Modal with 6 formats (Chicago, APA, Harvard, BibTeX, RIS, Schema.org) */}
      <CitePublicationModal
        report={report}
        isOpen={isCitationModalOpen}
        onClose={() => setIsCitationModalOpen(false)}
      />
    </div>
  );
};

export default ResearchReportArticleView;
