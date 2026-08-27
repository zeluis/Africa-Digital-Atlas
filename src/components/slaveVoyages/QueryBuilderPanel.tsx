import React, { useState } from 'react';
import { 
  VoyageFilterState, 
  EpistemicMode, 
  AfricanEmbarkationRegion, 
  AmericanDisembarkationRegion, 
  CarrierNationality 
} from '../../data/slaveVoyagesTypes';
import { 
  generateAcademicCitations, 
  encodeFiltersToQueryString, 
  exportVoyagesToCSV 
} from '../../services/slaveVoyagesApi';
import { CanonicalVoyage } from '../../data/slaveVoyagesTypes';
import { 
  SlidersHorizontal, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Quote, 
  BookOpen, 
  Code, 
  RefreshCw 
} from 'lucide-react';

interface QueryBuilderPanelProps {
  filters: VoyageFilterState;
  onUpdateFilters: (newFilters: Partial<VoyageFilterState>) => void;
  filteredVoyages: CanonicalVoyage[];
  aggregateStats: any;
}

export const QueryBuilderPanel: React.FC<QueryBuilderPanelProps> = ({
  filters,
  onUpdateFilters,
  filteredVoyages,
  aggregateStats
}) => {
  const [citationFormat, setCitationFormat] = useState<'apa' | 'chicago' | 'mla' | 'bibtex'>('apa');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const querySummary = `Voyages from ${filters.embarkationRegions.length > 0 ? filters.embarkationRegions.join(', ') : 'All African Regions'} to ${filters.disembarkationRegions.length > 0 ? filters.disembarkationRegions.join(', ') : 'All American Regions'}, ${filters.yearRange[0]}–${filters.yearRange[1]}${filters.carriers.length > 0 ? ` (${filters.carriers.join(', ')})` : ''}`;

  const citations = generateAcademicCitations({
    title: 'Atlantic Slave Trade Query Result',
    querySummary,
    dateRetrieved: '2026-08-27',
    dataSource: 'SlaveVoyages Trans-Atlantic & Intra-American Database',
    apiVersion: 'v1.0 / 2024.1',
    datasetSnapshot: '2024.1 (Expanded 36,108 Voyages)',
    filters,
    aggregateStats: {
      totalVoyages: aggregateStats.totalVoyages,
      embarked: aggregateStats.totalEmbarked,
      disembarked: aggregateStats.totalDisembarked,
      mortalityPct: aggregateStats.avgMortalityRate,
      epistemicMode: filters.epistemicMode
    }
  });

  const queryString = encodeFiltersToQueryString(filters);
  const shareableUrl = `${window.location.origin}${window.location.pathname}?tab=slave-trade&${queryString}`;

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadCSV = () => {
    const csvContent = exportVoyagesToCSV(filteredVoyages);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `slavevoyages_export_${filters.yearRange[0]}_${filters.yearRange[1]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const jsonContent = JSON.stringify({
      metadata: {
        source: 'SlaveVoyages Atlas (api.slavevoyages.org canonical model)',
        retrievedAt: new Date().toISOString(),
        querySummary,
        epistemicMode: filters.epistemicMode,
        totalRecords: filteredVoyages.length
      },
      data: filteredVoyages
    }, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `slavevoyages_export_${filters.yearRange[0]}_${filters.yearRange[1]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. Natural Language Query Composer Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-500" />
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
              Interactive Research Query Builder
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-500">
            {filteredVoyages.length} Matches in View
          </span>
        </div>

        {/* Natural Language Query Flow */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800/80 leading-relaxed text-sm text-zinc-700 dark:text-zinc-300 flex flex-wrap items-center gap-2">
          <span>Show</span>
          <strong className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-500/10 px-2 py-1 rounded-md">
            Trans-Atlantic Voyages & Captives
          </strong>
          <span>between</span>
          <strong className="text-zinc-900 dark:text-zinc-100 font-mono bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-md">
            {filters.yearRange[0]}
          </strong>
          <span>and</span>
          <strong className="text-zinc-900 dark:text-zinc-100 font-mono bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-md">
            {filters.yearRange[1]}
          </strong>
          <span>embarked from</span>
          <strong className="text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-md">
            {filters.embarkationRegions.length > 0 ? filters.embarkationRegions.join(', ') : 'All African Coasts'}
          </strong>
          <span>arrived in</span>
          <strong className="text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-md">
            {filters.disembarkationRegions.length > 0 ? filters.disembarkationRegions.join(', ') : 'All American Ports'}
          </strong>
          <span>under carrier nationality</span>
          <strong className="text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-md">
            {filters.carriers.length > 0 ? filters.carriers.join(', ') : 'All Imperial Flags'}
          </strong>
          <span>using epistemic mode</span>
          <strong className="text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2 py-1 rounded-md uppercase font-mono text-xs">
            {filters.epistemicMode}
          </strong>
        </div>

        {/* Shareable Link & Quick Copy */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
          <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden font-mono text-xs text-zinc-600 dark:text-zinc-400">
            <Share2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">{shareableUrl}</span>
          </div>
          <button
            onClick={() => handleCopy(shareableUrl, 'url')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
          >
            {copiedField === 'url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedField === 'url' ? 'Link Copied!' : 'Copy Query Link'}</span>
          </button>
        </div>
      </div>

      {/* 2. Academic Citation Generator */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-indigo-500" />
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
              Academic Citation Generator
            </h3>
          </div>
          
          {/* Format Tabs */}
          <div className="flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold">
            {(['apa', 'chicago', 'mla', 'bibtex'] as const).map(fmt => (
              <button
                key={fmt}
                onClick={() => setCitationFormat(fmt)}
                className={`px-3 py-1 rounded-lg uppercase transition-all cursor-pointer ${
                  citationFormat === fmt
                    ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Citation Box */}
        <div className="relative p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
            {citations[citationFormat]}
          </pre>

          <button
            onClick={() => handleCopy(citations[citationFormat], 'citation')}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-medium transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            title="Copy formatted citation"
          >
            {copiedField === 'citation' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedField === 'citation' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* 3. Export Data Tools */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-500" />
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
              Download Filtered Research Dataset
            </h3>
          </div>
          <span className="text-xs text-zinc-500">
            Open-access academic export
          </span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Export the matching canonical records with all normalized fields (vessel specifications, embarkation/disembarkation coordinates, captives embarked and disembarked, middle passage duration, shipboard mortality, rebellion logs, and primary source references).
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Spreadsheet ({filteredVoyages.length} records)</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Code className="w-4 h-4" />
            <span>Export Canonical JSON Format</span>
          </button>
        </div>
      </div>
    </div>
  );
};
