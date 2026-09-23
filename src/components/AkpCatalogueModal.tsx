import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Layers,
  Database,
  Globe2,
  Calendar,
  Sparkles,
  Users,
  Zap,
  Trees,
  Wheat,
  DollarSign,
  CheckCircle2,
  Check,
  ExternalLink
} from 'lucide-react';
import { AKP_REGISTRY_241_DATASETS, AKP_PILLARS_META, AkpDatasetRecord } from '../data/akpRegistry241';

export interface AkpCatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMetric?: (metricId: string) => void;
  currentChoroplethMetricId?: string;
}

export const AkpCatalogueModal: React.FC<AkpCatalogueModalProps> = ({
  isOpen,
  onClose,
  onSelectMetric,
  currentChoroplethMetricId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const filteredDatasets = useMemo(() => {
    return AKP_REGISTRY_241_DATASETS.filter((item) => {
      const matchesPillar = selectedPillar === 'all' || item.pillar === selectedPillar;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesPillar;

      const matchesQuery =
        item.title.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.leadAgency.toLowerCase().includes(q) ||
        item.subDomain.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchesPillar && matchesQuery;
    });
  }, [searchQuery, selectedPillar]);

  const handleSimulateDownload = (dataset: AkpDatasetRecord, format: string) => {
    setDownloadSuccessToast(`Exporting ${dataset.code} in ${format} format...`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 3000);
  };

  const getPillarIcon = (pillarId: string, className = 'w-4 h-4') => {
    switch (pillarId) {
      case 'demographics':
        return <Users className={className} />;
      case 'energy_infra':
        return <Zap className={className} />;
      case 'environment':
        return <Trees className={className} />;
      case 'agriculture':
        return <Wheat className={className} />;
      case 'economic':
        return <DollarSign className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  const activePillarMeta = AKP_PILLARS_META.find((p) => p.id === selectedPillar);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-5xl h-[92vh] max-h-[880px] rounded-3xl bg-[#faf9f6] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-300/80 dark:border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Editorial Paper Theme) */}
        <div className="flex items-center justify-between p-4 sm:p-6 sm:px-8 border-b border-zinc-200 dark:border-zinc-800 bg-[#f4efe6] dark:bg-zinc-900/90 flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center border border-amber-300/80 dark:border-amber-700/60 shadow-xs flex-shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                  European Commission AKP Data Registry
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] sm:text-[11px] font-mono font-black shadow-xs">
                  241 DATASETS
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1 sm:line-clamp-none">
                Authoritative indicators from JRC, BIOPAMA, Copernicus, World Bank, WHO, UNESCO, and ACLED
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://africa-knowledge-platform.ec.europa.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-zinc-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:text-amber-900 border border-amber-300/80 dark:border-amber-700/60 text-xs font-semibold transition-colors shadow-2xs"
              title="Open Official EC Africa Knowledge Platform Portal"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>EC AKP Portal</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/80 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700 flex-shrink-0"
              title="Close Catalogue"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Thematic Selectors Deck (Never Cropped, Responsive Grid) */}
        <div className="p-4 sm:px-8 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/80 space-y-3.5 flex-shrink-0">
          {/* Search Input and Counter Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search 241 indicators by title, code (e.g. SP.POP.TOTL), agency, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-16 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-amber-600 dark:focus:border-amber-400 transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results Counter / Filter Status */}
            <div className="flex items-center justify-between sm:justify-start gap-2 px-3.5 py-2 rounded-xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 shadow-xs">
              <span>
                Showing <strong className="text-amber-700 dark:text-amber-400">{filteredDatasets.length}</strong> of 241
              </span>
              {selectedPillar !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedPillar('all')}
                  className="text-[10px] font-sans font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors cursor-pointer"
                  title="Reset to all pillars"
                >
                  Reset Filter ✕
                </button>
              )}
            </div>
          </div>

          {/* All 6 Thematic Pillar Selector Cards (Full Width, Fully Visible, Never Cropped) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 w-full">
            {/* 1. All 241 Datasets Card */}
            <button
              type="button"
              onClick={() => setSelectedPillar('all')}
              className={`flex flex-col justify-between min-h-[74px] p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer select-none group relative ${
                selectedPillar === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 shadow-md ring-2 ring-zinc-900/15 dark:ring-zinc-100/20'
                  : 'bg-white dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 border-zinc-200/90 dark:border-zinc-800/90 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 shadow-xs'
              }`}
              title="All 241 European Commission datasets (Master Registry)"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
                    selectedPillar === 'all'
                      ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    selectedPillar === 'all'
                      ? 'bg-white/25 text-white dark:bg-zinc-900/25 dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  241
                </span>
              </div>
              <div>
                <div className="text-[11px] sm:text-xs font-bold leading-tight">All Datasets</div>
                <div
                  className={`text-[10px] leading-tight mt-0.5 ${
                    selectedPillar === 'all' ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  Master Registry
                </div>
              </div>
              {selectedPillar === 'all' && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            {/* 2 to 6. Thematic Pillars */}
            {AKP_PILLARS_META.map((meta) => {
              const active = selectedPillar === meta.id;

              return (
                <button
                  key={meta.id}
                  type="button"
                  onClick={() => setSelectedPillar(meta.id)}
                  className={`flex flex-col justify-between min-h-[74px] p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer select-none group relative ${
                    active
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-600/20'
                      : 'bg-white dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 border-zinc-200/90 dark:border-zinc-800/90 hover:border-amber-400/70 dark:hover:border-amber-600/70 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 shadow-xs'
                  }`}
                  title={`${meta.label} (${meta.count} datasets)`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: active ? 'rgba(255,255,255,0.2)' : `${meta.color}15`,
                        color: active ? '#ffffff' : meta.color
                      }}
                    >
                      {getPillarIcon(meta.id, 'w-3.5 h-3.5')}
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        active
                          ? 'bg-white/25 text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {meta.count}
                    </span>
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-xs font-bold leading-tight">
                      {meta.shortLabel}
                    </div>
                    <div
                      className={`text-[10px] leading-tight mt-0.5 ${
                        active ? 'text-amber-100' : 'text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {meta.subtext}
                    </div>
                  </div>
                  {active && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dataset Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 sm:px-8 space-y-3">
          {filteredDatasets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40">
              <Database className="w-10 h-10 text-zinc-400 mb-2.5" />
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No matching datasets found</h4>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Try searching for broader keywords like "energy", "hospitals", "conflict", "crops", or "water".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPillar('all');
                }}
                className="mt-3.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredDatasets.map((dataset) => {
              const isChoroplethActive = dataset.choroplethMetricId && currentChoroplethMetricId === dataset.choroplethMetricId;

              return (
                <div
                  key={dataset.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isChoroplethActive
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-500 shadow-md'
                      : 'bg-white dark:bg-zinc-900/80 border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-300/80 dark:border-amber-700/60">
                          {dataset.code}
                        </span>
                        <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-lg">
                          {dataset.subDomain}
                        </span>
                        <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Globe2 className="w-3 h-3 text-zinc-500" />
                          {dataset.coverage}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white leading-snug">
                        {dataset.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
                        {dataset.description}
                      </p>
                    </div>

                    {/* Action CTAs */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800">
                      {dataset.choroplethMetricId ? (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectMetric?.(dataset.choroplethMetricId!);
                            onClose();
                          }}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                            isChoroplethActive
                              ? 'bg-emerald-600 text-white ring-2 ring-emerald-600/30'
                              : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900'
                          }`}
                        >
                          {isChoroplethActive ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                          <span>{isChoroplethActive ? 'Active on Map' : 'Load Choropleth'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 italic">
                          Catalog Reference
                        </span>
                      )}

                      <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                        <Calendar className="w-3 h-3" />
                        <span>{dataset.updateFrequency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata & Download Formats */}
                  <div className="mt-3.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-600 dark:text-zinc-400">
                      <span>
                        <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">Source:</strong> {dataset.leadAgency}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">Unit:</strong> {dataset.unit}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">Scale:</strong> {dataset.spatialResolution}
                      </span>
                    </div>

                    {/* Download Format Buttons */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Formats:</span>
                      {dataset.downloadFormats.map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => handleSimulateDownload(dataset, fmt)}
                          className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:text-amber-900 dark:hover:text-amber-200 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono font-bold transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
                          title={`Download ${dataset.code} as ${fmt}`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Download Success Toast Notification */}
        {downloadSuccessToast && (
          <div className="absolute bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-2xl animate-in slide-in-from-bottom-3 duration-200 font-semibold text-xs border border-zinc-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccessToast}</span>
          </div>
        )}
      </div>
    </div>
  );
};
