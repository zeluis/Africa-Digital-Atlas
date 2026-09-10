import React, { useState, useMemo } from 'react';
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
  Layers
} from 'lucide-react';
import { RESEARCH_REPORTS, ResearchReport, ReportCategory } from '../data/reportsData';

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

  // Master historical reports included in the directory
  const masterLegacyReports = [
    {
      id: 'molecular-legacies',
      title: 'The Molecular and Material Legacies of Slavery',
      subtitle: 'Ancient DNA, Bioarchaeology, and the Biocultural Toll of the Transatlantic Trade',
      category: 'tast',
      categoryLabel: 'Historical Legacies (TAST)',
      categoryColor: '#F43F5E',
      authors: ['African Bioarchaeological Consortium', 'Dr. Rachel E. Watkins'],
      date: 'March 2025',
      readingTime: 35,
      type: 'Special Research Monograph',
      onSelect: onNavigateToMolecular
    },
    {
      id: 'african-development-foundations',
      title: 'Foundations of African Development',
      subtitle: 'Path Dependency, Institutional Extraction, and the Economic Legacies of the Slave Trade',
      category: 'tast',
      categoryLabel: 'Historical Legacies (TAST)',
      categoryColor: '#F43F5E',
      authors: ['African Economic History Project', 'Prof. Nathan Nunn'],
      date: 'April 2025',
      readingTime: 40,
      type: 'Master Economic Treatise',
      onSelect: onNavigateToFoundations
    }
  ];

  const allReportsList = useMemo(() => {
    return Object.values(RESEARCH_REPORTS);
  }, []);

  const filteredReports = useMemo(() => {
    return allReportsList.filter(rep => {
      const matchesCategory = selectedCategory === 'all' || rep.category === selectedCategory;
      const matchesSearch = !searchQuery.trim() || 
        rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        rep.executiveSummary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allReportsList, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300" id="research-reports-directory-view">
      {/* Directory Banner Card */}
      <div className="p-6 md:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Peer-Reviewed Academic & Policy Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white font-serif tracking-tight">
              African Research & Analytical Reports
            </h1>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Explore accredited treatises spanning evolutionary genomics, international reparatory jurisprudence, macroeconomic development, and the enduring material legacies of the Transatlantic Slave Trade.
            </p>
          </div>

          {onNavigateToEthnicTree && (
            <button
              type="button"
              onClick={onNavigateToEthnicTree}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-zinc-950 transition-all cursor-pointer shadow-md shrink-0 self-start md:self-auto"
            >
              <Layers className="w-4 h-4" />
              <span>Explore Ethnic Tree of Life</span>
            </button>
          )}
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
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Disciplines' },
              { id: 'genetics', label: 'Genetics & Admixture' },
              { id: 'international-law', label: 'International Law' },
              { id: 'development-sociology', label: 'Development & Economics' }
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
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono">
            <Anchor className="w-4 h-4" />
            <span>Foundational Master Monographs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {masterLegacyReports.map(mono => (
              <div
                key={mono.id}
                onClick={mono.onSelect}
                className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-rose-500/50 dark:hover:border-rose-500/50 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20">
                      {mono.type}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{mono.readingTime} min</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-serif text-zinc-900 dark:text-white group-hover:text-rose-500 transition-colors">
                    {mono.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {mono.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{mono.authors[0]}</span>
                  <span className="font-semibold text-rose-500 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Treatise</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Filtered Research Reports Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
          <span>Peer-Reviewed Reports ({filteredReports.length})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map(rep => (
            <div
              key={rep.id}
              onClick={() => onSelectReport(rep.id)}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span 
                    className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md"
                    style={{ 
                      backgroundColor: `${rep.categoryColor}15`, 
                      color: rep.categoryColor,
                      border: `1px solid ${rep.categoryColor}30`
                    }}
                  >
                    {rep.categoryLabel}
                  </span>
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{rep.readingTimeMinutes} min</span>
                  </span>
                </div>

                <h3 className="text-base font-bold font-serif text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                  {rep.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {rep.executiveSummary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-mono text-[11px] truncate max-w-[150px]">
                  {rep.authors[0]}
                </span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>Read Report</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
