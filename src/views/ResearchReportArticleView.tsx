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
  ArrowLeft
} from 'lucide-react';
import { RESEARCH_REPORTS, ResearchReport } from '../data/reportsData';

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
  const report: ResearchReport = RESEARCH_REPORTS[reportId] || RESEARCH_REPORTS['report-genetic-linguistic-blueprints'];

  const [activeSectionId, setActiveSectionId] = useState<string>(report.sections[0]?.id || 'sec-intro');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [citationFormat, setCitationFormat] = useState<'APA' | 'Chicago' | 'BibTeX'>('APA');
  const [isCitationModalOpen, setIsCitationModalOpen] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);

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

  // Generate citation string
  const generateCitation = () => {
    const authorsStr = report.authors.join(', ');
    const year = report.publicationDate.split(' ').pop() || '2025';

    if (citationFormat === 'APA') {
      return `${authorsStr} (${year}). ${report.title}: ${report.subtitle}. African Data Atlas Research Repository. https://doi.org/${report.doi}`;
    }
    if (citationFormat === 'Chicago') {
      return `${authorsStr}. "${report.title}: ${report.subtitle}." African Data Atlas (accessed ${new Date().toLocaleDateString('en-US')}). https://doi.org/${report.doi}.`;
    }
    // BibTeX
    const citeKey = report.id.replace('report-', '').replace(/-/g, '_') + '_' + year;
    return `@article{${citeKey},
  title={${report.title}},
  subtitle={${report.subtitle}},
  author={${report.authors.join(' and ')}},
  journal={African Data Atlas Academic Repository},
  year={${year}},
  doi={${report.doi}}
}`;
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(generateCitation());
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
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
        <div className="flex items-center gap-2">
          {/* Font Size Toggler */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl p-0.5 border border-zinc-200 dark:border-zinc-700 text-[11px]">
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
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
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                fontSize === 'large' 
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs' 
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Large Type
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCitationModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-medium transition-all cursor-pointer text-xs"
          >
            <Quote className="w-3.5 h-3.5 text-amber-500" />
            <span>Cite Report</span>
          </button>

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

        <div className="relative space-y-3 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {report.classification}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{report.publicationDate}</span>
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{report.readingTimeMinutes} min read</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white font-serif tracking-tight leading-tight">
            {report.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-serif italic leading-relaxed">
            {report.subtitle}
          </p>
        </div>

        {/* Authors and Affiliations */}
        <div className="relative pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">
              {report.authors.join(' • ')}
            </div>
            <div className="text-zinc-500 dark:text-zinc-400 mt-0.5">
              {report.institutions.join(' | ')}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-zinc-400">DOI:</span>
            <a 
              href={`https://doi.org/${report.doi}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-mono text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
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

              <p className={`text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed ${
                fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
              }`}>
                {section.content}
              </p>

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
                <div key={cit.id} className="py-3.5 space-y-1">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {cit.authors} ({cit.year}).
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400 italic">
                    {cit.title}. <span className="not-italic">{cit.journalOrPublisher}.</span>
                  </div>
                  {cit.doiOrUrl && (
                    <a
                      href={cit.doiOrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
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

      {/* Citation Modal */}
      {isCitationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Academic Citation Generator
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCitationModalOpen(false)}
                className="p-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
              >
                ✕
              </button>
            </div>

            {/* Format Selector Pills */}
            <div className="flex items-center gap-2">
              {(['APA', 'Chicago', 'BibTeX'] as const).map(fmt => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setCitationFormat(fmt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    citationFormat === fmt
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* Citation Box */}
            <pre className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 font-mono whitespace-pre-wrap select-all leading-relaxed">
              {generateCitation()}
            </pre>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleCopyCitation}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
              >
                {copiedCitation ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
