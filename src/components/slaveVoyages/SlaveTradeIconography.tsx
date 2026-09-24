import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  BookOpen, 
  ExternalLink, 
  Languages, 
  User, 
  Calendar, 
  MapPin, 
  Grid, 
  List, 
  HelpCircle,
  Eye,
  Info
} from 'lucide-react';
import { SLAVE_TRADE_ILLUSTRATIONS, SlaveTradeIllustration } from '../../data/slaveTradeIllustrations';
import { ArchivalLoupeModal } from './ArchivalLoupeModal';

export const SlaveTradeIconography: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeIllustration, setActiveIllustration] = useState<SlaveTradeIllustration | null>(null);
  
  // High-performance visible pagination state
  const [visibleCount, setVisibleCount] = useState(24);

  // Reset pagination on filter or search changes to maintain maximum performance
  useEffect(() => {
    setVisibleCount(24);
  }, [searchTerm, selectedCollection, selectedLanguage]);

  // Extract unique filter categories
  const collections = useMemo(() => {
    const list = new Set<string>();
    SLAVE_TRADE_ILLUSTRATIONS.forEach(item => {
      item.collectionNames.forEach(name => list.add(name));
    });
    return Array.from(list);
  }, []);

  const languages = useMemo(() => {
    const list = new Set<string>();
    SLAVE_TRADE_ILLUSTRATIONS.forEach(item => {
      if (item.language) list.add(item.language);
    });
    return Array.from(list);
  }, []);

  // Calculate illustration counts per historical category/collection dynamically
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SLAVE_TRADE_ILLUSTRATIONS.forEach(item => {
      item.collectionNames.forEach(name => {
        counts[name] = (counts[name] || 0) + 1;
      });
    });
    return counts;
  }, []);

  // Filtered dataset
  const filteredIllustrations = useMemo(() => {
    return SLAVE_TRADE_ILLUSTRATIONS.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.regId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.researchers.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCollection = 
        selectedCollection === 'all' || 
        item.collectionNames.includes(selectedCollection);

      const matchesLanguage = 
        selectedLanguage === 'all' || 
        item.language === selectedLanguage;

      return matchesSearch && matchesCollection && matchesLanguage;
    });
  }, [searchTerm, selectedCollection, selectedLanguage]);

  // Sliced items for performant lazy rendering
  const visibleIllustrations = useMemo(() => {
    return filteredIllustrations.slice(0, visibleCount);
  }, [filteredIllustrations, visibleCount]);

  return (
    <div className="space-y-8 text-left">
      {/* Editorial Intro Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-amber-100/30 dark:bg-amber-950/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-amber-800 dark:text-amber-500 font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Scholarly Archival Iconography</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-black text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
            The Atlantic Slave Trade & Iconography Registry
          </h2>
          <p className="text-xs sm:text-sm font-serif text-stone-600 dark:text-stone-400 leading-relaxed">
            Exploring the visual archives of the Middle Passage. This curated repository preserves engravings, watercolors, and architectural schematics from the 16th to 19th centuries, documented by historians to recover individual and material narratives of confinement, labor, and liberation.
          </p>
        </div>
      </div>

      {/* Sticky, Unified Header & Custom Themes selector panel */}
      <div className="sticky top-[64px] z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 py-4 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800/80 space-y-4 shadow-sm transition-all">
        {/* Row 1: Registry Branding & Unified Toolbar Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Branding Left */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-amber-800 dark:text-amber-500 shrink-0">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-serif font-black text-stone-900 dark:text-stone-100 text-sm tracking-tight leading-none">
                Iconography Archive
              </h3>
              <p className="text-[10px] font-mono text-stone-500 dark:text-stone-400 mt-1.5">
                Showing {filteredIllustrations.length} of {SLAVE_TRADE_ILLUSTRATIONS.length} cataloged artifacts
              </p>
            </div>
          </div>

          {/* Controls Right */}
          <div className="flex flex-wrap items-center gap-3 lg:flex-1 lg:justify-end max-w-5xl">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
              <input
                type="text"
                placeholder="Search catalog titles, identifiers, citations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-600 transition-all placeholder:text-stone-400"
              />
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-3 py-2 text-xs font-sans text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="all">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded-xl p-0.5 bg-white dark:bg-stone-900 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100' 
                    : 'text-stone-400 hover:text-stone-600'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' 
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100' 
                    : 'text-stone-400 hover:text-stone-600'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: SLEEK HISTORICAL CATEGORIES SELECTOR PANEL */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <span>Historical Theme Categories</span>
            </span>
            {selectedCollection !== 'all' && (
              <button
                onClick={() => setSelectedCollection('all')}
                className="text-[10px] font-mono font-bold text-amber-700 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                Reset Theme [All]
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-800 snap-x">
            {/* All Categories Button */}
            <button
              onClick={() => setSelectedCollection('all')}
              className={`snap-center px-4 py-2 rounded-xl text-xs font-sans font-bold flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap group shrink-0 border ${
                selectedCollection === 'all'
                  ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-850 border-stone-200 dark:border-stone-800'
              }`}
            >
              <span>All Historical Categories</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-black ${
                selectedCollection === 'all'
                  ? 'bg-amber-900 text-amber-100'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 group-hover:bg-stone-200/85 dark:group-hover:bg-stone-700/85'
              }`}>
                {SLAVE_TRADE_ILLUSTRATIONS.length}
              </span>
            </button>

            {/* Custom Category Pills */}
            {collections.map(name => {
              const count = categoryCounts[name] || 0;
              const isSelected = selectedCollection === name;
              return (
                <button
                  key={name}
                  onClick={() => setSelectedCollection(name)}
                  className={`snap-center px-4 py-2 rounded-xl text-xs font-sans font-medium flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap group shrink-0 border ${
                    isSelected
                      ? 'bg-amber-800 text-white font-bold border-amber-800 shadow-xs'
                      : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-850 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <span>{name}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-black ${
                    isSelected
                      ? 'bg-amber-900 text-amber-100'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 group-hover:bg-stone-200/85 dark:group-hover:bg-stone-700/85'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid or List View Container */}
      {filteredIllustrations.length === 0 ? (
        <div className="p-16 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-sm font-sans font-bold text-stone-800 dark:text-stone-200">
            No archival illustrations match your query
          </h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Try resetting your active category or adjusting keywords to search the 1,200+ documented historical files.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCollection('all');
              setSelectedLanguage('all');
            }}
            className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/40 text-xs font-sans font-bold transition-all cursor-pointer"
          >
            Clear Search Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visibleIllustrations.map((item) => (
            <div
              key={item.objectId}
              onClick={() => setActiveIllustration(item)}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden hover:shadow-md hover:border-stone-300 dark:hover:border-stone-700 transition-all flex flex-col justify-between cursor-pointer group"
            >
              {/* Graphic container with high contrast scrim */}
              <div className="aspect-video w-full relative bg-stone-100 dark:bg-stone-950 overflow-hidden">
                {item.imageUrls && item.imageUrls[0] ? (
                  <img
                    src={item.imageUrls[0]}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 filter saturate-90 dark:brightness-90"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-200 dark:bg-stone-950">
                    <BookOpen className="w-8 h-8 text-stone-400" />
                  </div>
                )}
                {/* ID badge overlay */}
                <div className="absolute top-3 left-3 bg-black/70 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {item.regId}
                </div>
                {/* View Action overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Text Meta Fields */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.collectionNames.slice(0, 1).map((name) => (
                      <span
                        key={name}
                        className="text-[9px] font-sans font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-md border border-amber-200/40 dark:border-amber-900/40"
                      >
                        {name}
                      </span>
                    ))}
                    {item.date && (
                      <span className="text-[10px] font-mono font-bold text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>{item.date}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 leading-snug line-clamp-2">
                    {item.title}
                  </h4>

                  <p className="text-[11px] font-sans text-stone-500 dark:text-stone-400 line-clamp-3 leading-relaxed">
                    Source: {item.source}
                  </p>
                </div>

                {/* Bottom Footer Controls */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span>Ref: {item.identifier || 'N/A'}</span>
                  <span className="text-amber-800 dark:text-amber-500 font-sans font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect Details</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View Mode */
        <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-950/20 shadow-xs divide-y divide-stone-200 dark:divide-stone-800">
          {visibleIllustrations.map((item) => (
            <div
              key={item.objectId}
              onClick={() => setActiveIllustration(item)}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Tiny Image Thumbnail */}
                <div className="w-16 h-12 bg-stone-100 dark:bg-stone-950 rounded-lg overflow-hidden shrink-0 border border-stone-200/60 dark:border-stone-800">
                  {item.imageUrls && item.imageUrls[0] ? (
                    <img
                      src={item.imageUrls[0]}
                      alt={item.title}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-stone-400" />
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-stone-500 dark:text-stone-400">
                      {item.regId}
                    </span>
                    <span className="text-stone-300 dark:text-stone-700">·</span>
                    <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold">
                      {item.collectionNames[0]}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-stone-400 line-clamp-1">
                    {item.source}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-xs font-sans text-stone-400">
                {item.date && <span className="font-mono">{item.date}</span>}
                <span className="text-amber-800 dark:text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  <span>Inspect</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Performance-friendly "Load More" controls */}
      {visibleCount < filteredIllustrations.length && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => setVisibleCount(prev => prev + 36)}
            className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 text-white font-sans font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            <BookOpen className="w-3.5 h-3.5 animate-pulse" />
            <span>Load More Historical Records (+36 of {filteredIllustrations.length - visibleCount} remaining)</span>
          </button>
        </div>
      )}

      {/* Archival Deep Zoom & Citation Loupe Modal */}
      <ArchivalLoupeModal
        illustration={activeIllustration}
        onClose={() => setActiveIllustration(null)}
      />
    </div>
  );
};
