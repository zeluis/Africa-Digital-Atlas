import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Calendar, 
  Sparkles, 
  Dna, 
  Scale, 
  TrendingUp, 
  Anchor, 
  ExternalLink, 
  ChevronRight,
  Filter,
  Layers,
  Upload,
  Plus,
  ShieldCheck
} from 'lucide-react';
import { RESEARCH_REPORTS, ResearchReport, ReportCategory } from '../data/reportsData';
import { getAllReports } from '../data/reportsDataLoader';
import { NotebookIngestionModal } from '../components/NotebookIngestionModal';
import { IngestionResult } from '../data/notebookIngestionPipeline';
import { DynamicIcon } from '../components/DynamicIcon';
import { atlasModalStore } from '../stores/useAtlasModalStore';

interface ResearchReportsDirectoryViewProps {
  onSelectReport: (reportId: string) => void;
  onNavigateToEthnicTree?: () => void;
  onNavigateToSlaveTrade?: () => void;
  onNavigateToMolecular?: () => void;
  onNavigateToFoundations?: () => void;
}

export const ResearchReportsDirectoryView: React.FC<ResearchReportsDirectoryViewProps> = ({
  onSelectReport,
  onNavigateToEthnicTree,
  onNavigateToSlaveTrade,
  onNavigateToMolecular,
  onNavigateToFoundations
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isIngestionModalOpen, setIsIngestionModalOpen] = useState<boolean>(false);
  const [ingestionTargetMode, setIngestionTargetMode] = useState<'reports' | 'working-papers'>('reports');
  const [refreshTick, setRefreshTick] = useState<number>(0);

  useEffect(() => {
    const handleUpdate = () => setRefreshTick(t => t + 1);
    window.addEventListener('afriata-publications-updated', handleUpdate);
    return () => window.removeEventListener('afriata-publications-updated', handleUpdate);
  }, []);

  const handleReportIngested = (newReport: ResearchReport) => {
    RESEARCH_REPORTS[newReport.id] = newReport;
    setRefreshTick(t => t + 1);
    onSelectReport(newReport.id);
  };

  // Master historical reports included in the directory
  const masterLegacyReports = [
    {
      id: 'molecular-legacies',
      title: 'The Molecular and Material Legacies of Slavery',
      subtitle: 'Ancient DNA, Bioarchaeology, and the Biocultural Toll of the Transatlantic Trade',
      category: 'tast',
      categoryLabel: 'Historical Legacies (TAST)',
      categoryColor: '#F43F5E',
      authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
      date: 'March 2025',
      readingTime: 35,
      type: 'Literature Synthesis Essay',
      onSelect: onNavigateToMolecular
    },
    {
      id: 'african-development-foundations',
      title: 'Foundations of African Development',
      subtitle: 'Path Dependency, Institutional Extraction, and the Economic Legacies of the Slave Trade',
      category: 'tast',
      categoryLabel: 'Historical Legacies (TAST)',
      categoryColor: '#F43F5E',
      authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
      date: 'April 2025',
      readingTime: 40,
      type: 'Literature Synthesis Essay',
      onSelect: onNavigateToFoundations
    }
  ];

  const allReportsList = useMemo(() => {
    return Object.values(getAllReports());
  }, [refreshTick]);

  const filteredReports = useMemo(() => {
    return allReportsList.filter(rep => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'working-papers' ? Boolean(rep.isWorkingPaper) : rep.category === selectedCategory);
      const matchesSearch = !searchQuery.trim() || 
        rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rep.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        rep.executiveSummary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allReportsList, selectedCategory, searchQuery]);

  return (
    <section aria-label="African Research and Analytical Reports Directory" className="space-y-8 pb-16 animate-in fade-in duration-300" id="research-reports-directory-view">
      {/* Directory Banner Card */}
      <div className="p-6 md:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden space-y-6">
        <div aria-hidden="true" className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curated Research &amp; Literature Synthesis Archive</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white font-serif tracking-tight">
              African Research &amp; Analytical Reports
            </h1>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Explore curated literature syntheses spanning evolutionary genomics, international reparatory jurisprudence, macroeconomic development, and the enduring material legacies of the Transatlantic Slave Trade, each linked to primary peer-reviewed DOIs via Crossref concordance.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => atlasModalStore.openDoiVerification()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-zinc-950 transition-all cursor-pointer shadow-md"
              title="Audit all DOIs with live Crossref API or upload custom JSON concordance"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Validate DOIs (Crossref)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIngestionTargetMode('reports');
                setIsIngestionModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer shadow-md"
              title="Import Google Notebook Markdown or .md report into content/reports"
            >
              <Upload className="w-4 h-4" />
              <span>Import Report (.md)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIngestionTargetMode('working-papers');
                setIsIngestionModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all cursor-pointer shadow-md"
              title="Import Afriata Working Paper (.md) into content/working-papers"
            >
              <Sparkles className="w-4 h-4" />
              <span>Import Working Paper (.md)</span>
            </button>

            {onNavigateToEthnicTree && (
              <button
                type="button"
                onClick={onNavigateToEthnicTree}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-zinc-950 transition-all cursor-pointer shadow-md"
              >
                <Layers className="w-4 h-4" />
                <span>Explore Ethnic Tree of Life</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by topic, author, or keyword..."
              aria-label="Search research reports by topic, author, or keyword"
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Disciplines' },
              { id: 'genetics', label: 'Genetics & Admixture' },
              { id: 'international-law', label: 'International Law' },
              { id: 'development-sociology', label: 'Development & Economics' },
              { id: 'working-papers', label: 'Afriata Working Papers' }
            ].map(pill => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedCategory(pill.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  selectedCategory === pill.id
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs font-bold'
                    : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Master Reports Section (when viewing all or TAST) */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 font-mono">
            <Anchor className="w-4 h-4" />
            <span>Foundational Master Monographs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {masterLegacyReports.map(mono => (
              <button
                type="button"
                key={mono.id}
                onClick={mono.onSelect}
                className="w-full text-left p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-rose-500/50 dark:hover:border-rose-500/50 transition-all cursor-pointer group shadow-sm flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/25">
                      {mono.type}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{mono.readingTime} min</span>
                    </span>
                  </div>

                  <h2 className="text-lg font-bold font-serif text-zinc-900 dark:text-white group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors">
                    {mono.title}
                  </h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {mono.subtitle}
                  </p>
                </div>

                <div className="w-full pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{mono.authors[0]}</span>
                  <span className="font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Treatise</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Filtered Research Reports Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
          <span>Literature Synthesis Reports ({filteredReports.length})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map(rep => (
            <button
              type="button"
              key={rep.id}
              onClick={() => onSelectReport(rep.id)}
              className="w-full text-left p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <div className="space-y-3 w-full">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                      <DynamicIcon 
                        icon={rep.icon || (rep.category === 'genetics' ? 'lucide:dna' : rep.category === 'international-law' ? 'lucide:scale' : 'lucide:trending-up')} 
                        className="w-3 h-3 text-indigo-700 dark:text-indigo-300" 
                      />
                      <span>{rep.categoryLabel}</span>
                    </span>
                    {rep.isWorkingPaper && (
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                        {rep.seriesNumber ? rep.seriesNumber.replace('Afriata ', '') : 'Working Paper'}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{rep.readingTimeMinutes} min</span>
                  </span>
                </div>

                <h2 className="text-base font-bold font-serif text-zinc-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                  {rep.title}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {rep.executiveSummary}
                </p>
              </div>

              <div className="w-full pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px] truncate max-w-[150px]">
                  {rep.authors[0]}
                </span>
                <span className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>Read Report</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Universal Markdown Ingestion Modal */}
      <NotebookIngestionModal
        isOpen={isIngestionModalOpen}
        onClose={() => setIsIngestionModalOpen(false)}
        defaultTargetPipeline={ingestionTargetMode}
        onIngestComplete={handleReportIngested}
      />
    </section>
  );
};

export default ResearchReportsDirectoryView;
