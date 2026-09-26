import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Info,
  ChevronDown,
  ChevronUp,
  Tag,
  Check,
  X,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { SLAVE_TRADE_ILLUSTRATIONS, SlaveTradeIllustration } from '../../data/slaveTradeIllustrations';
import { ArchivalLoupeModal } from './ArchivalLoupeModal';
import { DynamicIcon } from '../DynamicIcon';

interface SlaveTradeIconographyProps {
  activeTab?: 'registry' | 'ingestion';
  onTabChange?: (tab: 'registry' | 'ingestion') => void;
  castasCount?: number;
  initialSearchTerm?: string;
}

export const SlaveTradeIconography: React.FC<SlaveTradeIconographyProps> = ({
  activeTab = 'registry',
  onTabChange,
  castasCount = 32,
  initialSearchTerm = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    if (initialSearchTerm !== undefined) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeIllustration, setActiveIllustration] = useState<SlaveTradeIllustration | null>(null);
  
  // Collapsible unified theme selector state
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);
  const [themeSearchQuery, setThemeSearchQuery] = useState('');
  const themePanelRef = useRef<HTMLDivElement>(null);

  // Close theme panel on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themePanelRef.current && !themePanelRef.current.contains(e.target as Node)) {
        setIsThemePanelOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsThemePanelOpen(false);
    };
    if (isThemePanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isThemePanelOpen]);
  
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

  // Filtered collections for theme search within the selector panel
  const filteredCollections = useMemo(() => {
    if (!themeSearchQuery.trim()) return collections;
    const q = themeSearchQuery.toLowerCase();
    return collections.filter(c => c.toLowerCase().includes(q));
  }, [collections, themeSearchQuery]);

  // Filtered dataset
  const filteredIllustrations = useMemo(() => {
    return SLAVE_TRADE_ILLUSTRATIONS.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.regId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description ? item.description.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
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
    <div className="space-y-6 text-left">
      {/* Sticky, Unified Header & Custom Themes selector panel */}
      <div className="sticky top-[64px] z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 py-4 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800/80 space-y-4 shadow-sm transition-all">
        {/* Row 1: Registry Branding & Unified Toolbar Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Branding Left */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-900/10 dark:bg-amber-400/10 border border-amber-900/15 dark:border-amber-400/20 text-amber-900 dark:text-amber-400 shrink-0">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm tracking-tight leading-none">
                Visual Registry Catalog
              </h3>
              <p className="text-[10px] font-mono text-stone-500 dark:text-stone-400 mt-1">
                Showing {filteredIllustrations.length} of {SLAVE_TRADE_ILLUSTRATIONS.length} cataloged plates
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

        {/* Row 2: THEME CATEGORIES & INTEGRATED SEGMENTED CONTROL */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 relative z-40" ref={themePanelRef}>
          {/* Left: Collapsible Historical Theme Categories */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* All Historical Categories Button */}
            <button
              onClick={() => {
                setSelectedCollection('all');
                setIsThemePanelOpen(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-bold flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap group shrink-0 border ${
                selectedCollection === 'all'
                  ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-850 border-stone-200 dark:border-stone-800'
              }`}
            >
              <DynamicIcon 
                icon="fluent-mdl2:picture-center" 
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  selectedCollection === 'all' ? 'text-amber-200' : 'text-amber-700 dark:text-amber-400'
                }`} 
              />
              <span>All Historical Categories</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-black ${
                selectedCollection === 'all'
                  ? 'bg-amber-900 text-amber-100'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 group-hover:bg-stone-200/85 dark:group-hover:bg-stone-700/85'
              }`}>
                {SLAVE_TRADE_ILLUSTRATIONS.length}
              </span>
            </button>

            {/* Sleek Collapsed Pill (Expands with Smooth & Snappy Motion) */}
            <button
              onClick={() => setIsThemePanelOpen(prev => !prev)}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-bold flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap group shrink-0 border shadow-xs ${
                selectedCollection !== 'all'
                  ? 'bg-amber-900 text-amber-50 border-amber-700 dark:bg-amber-500 dark:text-stone-950 dark:border-amber-400'
                  : isThemePanelOpen
                    ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-700 ring-2 ring-amber-500/20'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-850 border-stone-200 dark:border-stone-800'
              }`}
              title="Browse and select specific historical theme categories"
            >
              <SlidersHorizontal className={`w-3.5 h-3.5 transition-transform duration-300 ${isThemePanelOpen ? 'rotate-90 text-amber-400' : 'text-amber-600 dark:text-amber-400'}`} />
              
              <span className="flex items-center gap-1.5">
                {selectedCollection === 'all' ? (
                  <span>Browse Historical Themes</span>
                ) : (
                  <span className="font-bold flex items-center gap-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-75">Theme:</span>
                    <span className="max-w-[180px] sm:max-w-[240px] truncate">{selectedCollection}</span>
                  </span>
                )}
              </span>

              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-black ${
                selectedCollection !== 'all'
                  ? 'bg-amber-950/80 text-amber-200 dark:bg-stone-900 dark:text-amber-300'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 group-hover:bg-stone-200/85 dark:group-hover:bg-stone-700/85'
              }`}>
                {selectedCollection === 'all' ? `${collections.length} Themes` : `${categoryCounts[selectedCollection] || 0} Plates`}
              </span>

              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isThemePanelOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Quick Clear Theme Pill */}
            {selectedCollection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCollection('all');
                }}
                className="px-2.5 py-2 rounded-xl bg-stone-200/70 hover:bg-stone-300/80 dark:bg-stone-800/70 dark:hover:bg-stone-700 text-[11px] font-mono font-semibold text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-300/70 dark:border-stone-700/70"
                title="Reset to all historical categories"
              >
                <X className="w-3 h-3 text-stone-500" />
                <span>Reset Theme</span>
              </button>
            )}
          </div>

          {/* Right: Integrated Segmented Control */}
          <div className="inline-flex p-1 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shrink-0 shadow-inner self-start lg:self-auto">
            <button
              onClick={() => onTabChange?.('registry')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'registry'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <DynamicIcon 
                icon="fluent-mdl2:picture-tile" 
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  activeTab === 'registry' ? 'text-amber-400 dark:text-amber-600' : 'text-stone-500 dark:text-stone-400'
                }`} 
              />
              <span>Archival Plates Grid</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold ${
                activeTab === 'registry'
                  ? 'bg-stone-800 text-amber-300 dark:bg-stone-200 dark:text-stone-900'
                  : 'bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}>
                {SLAVE_TRADE_ILLUSTRATIONS.length}
              </span>
            </button>

            <button
              onClick={() => onTabChange?.('ingestion')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'ingestion'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <DynamicIcon 
                icon="lucide:gallery-thumbnails" 
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  activeTab === 'ingestion' ? 'text-amber-400 dark:text-amber-600' : 'text-amber-600 dark:text-amber-400'
                }`} 
              />
              <span>Castas &amp; Colonial Archive</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold ${
                activeTab === 'ingestion'
                  ? 'bg-stone-800 text-amber-300 dark:bg-stone-200 dark:text-stone-900'
                  : 'bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}>
                {castasCount} Plates
              </span>
            </button>
          </div>

          {/* Smooth & Snappy Expanding Sophisticated Selector Panel */}
          <AnimatePresence>
            {isThemePanelOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.985 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                className="absolute left-0 right-0 sm:right-auto sm:w-[580px] lg:w-[680px] mt-2.5 z-50 p-4 sm:p-5 rounded-2xl bg-[#FAF8F5]/98 dark:bg-stone-950/98 backdrop-blur-xl border border-stone-300/90 dark:border-stone-700/90 shadow-2xl space-y-3.5"
              >
                {/* Panel Top Header */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800/80">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-stone-900 dark:text-stone-100">
                      Select Historical Archival Theme ({collections.length} Curated Topics)
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsThemePanelOpen(false)}
                    className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter within themes search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                  <input
                    type="text"
                    value={themeSearchQuery}
                    onChange={(e) => setThemeSearchQuery(e.target.value)}
                    placeholder="Search or filter theme categories..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-amber-500/35 transition-all"
                  />
                  {themeSearchQuery && (
                    <button
                      onClick={() => setThemeSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Themes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-800">
                  {filteredCollections.map(name => {
                    const count = categoryCounts[name] || 0;
                    const isSelected = selectedCollection === name;
                    return (
                      <button
                        key={name}
                        onClick={() => {
                          setSelectedCollection(name);
                          setIsThemePanelOpen(false);
                          setThemeSearchQuery('');
                        }}
                        className={`p-2.5 rounded-xl text-left text-xs font-sans transition-all cursor-pointer flex items-center justify-between border ${
                          isSelected
                            ? 'bg-amber-900 text-amber-50 dark:bg-amber-500 dark:text-stone-950 font-bold border-amber-800 dark:border-amber-400 shadow-xs'
                            : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-amber-50/60 dark:hover:bg-amber-950/20 hover:border-amber-400/50 border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        <span className="truncate pr-2">{name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                            isSelected
                              ? 'bg-amber-950 text-amber-200 dark:bg-stone-900 dark:text-amber-300'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                          }`}>
                            {count}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Panel Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800/80 text-[11px] font-mono text-stone-500">
                  <span>Click any theme to filter the gallery</span>
                  <button
                    onClick={() => {
                      setSelectedCollection('all');
                      setIsThemePanelOpen(false);
                      setThemeSearchQuery('');
                    }}
                    className="text-amber-800 hover:text-amber-900 dark:text-amber-400 font-bold cursor-pointer"
                  >
                    Reset to All Categories
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
        illustrationsList={filteredIllustrations}
        onSelectIllustration={(item) => setActiveIllustration(item)}
        onClose={() => setActiveIllustration(null)}
      />
    </div>
  );
};
