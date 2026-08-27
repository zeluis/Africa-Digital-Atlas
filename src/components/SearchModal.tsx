import React, { useState, useEffect, useRef, useMemo } from 'react';
import { atlas } from '../data/atlas-store';
import { AtlasEntity, IndicatorDefinition, HeritageSite } from '../data/types';
import { CountryFlag } from './CountryFlag';
import { useSavedEntities } from '../contexts/SavedEntitiesContext';
import { 
  Search, 
  Globe, 
  Landmark, 
  TrendingUp, 
  X, 
  ArrowRight, 
  CornerDownLeft,
  Clock,
  Star,
  Layers,
  Sparkles
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCountry: (entityId: string) => void;
  onSelectIndicator: (indicatorId: string) => void;
}

type SearchItemType = 
  | { type: 'entity'; data: AtlasEntity }
  | { type: 'indicator'; data: IndicatorDefinition }
  | { type: 'heritage'; data: HeritageSite };

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCountry,
  onSelectIndicator
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { recentSearches, addRecentSearch, clearRecentSearches, isCountrySaved, toggleSaveCountry } = useSavedEntities();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const q = query.trim().toLowerCase();

  // Simple fuzzy scoring function
  const scoreMatch = (text: string, search: string): number => {
    const t = text.toLowerCase();
    if (t === search) return 100;
    if (t.startsWith(search)) return 80;
    if (t.includes(search)) return 50;
    return 0;
  };

  // Matched Entities with scoring
  const matchedEntities = useMemo<AtlasEntity[]>(() => {
    if (q === '') return atlas.getAllEntities().slice(0, 6);
    return atlas.getAllEntities()
      .map(e => {
        let score = 0;
        score = Math.max(
          scoreMatch(e.name, q) * 1.5,
          scoreMatch(e.id, q) * 2,
          scoreMatch(e.officialName, q),
          scoreMatch(e.capital, q) * 1.2,
          scoreMatch(e.region, q)
        );
        return { entity: e, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 7)
      .map(item => item.entity);
  }, [q]);

  // Matched Indicators with scoring
  const matchedIndicators = useMemo<IndicatorDefinition[]>(() => {
    if (q === '') return atlas.getAllIndicators().slice(0, 4);
    return atlas.getAllIndicators()
      .map(ind => {
        let score = 0;
        score = Math.max(
          scoreMatch(ind.name, q) * 1.5,
          scoreMatch(ind.id, q) * 2,
          scoreMatch(ind.domain, q),
          scoreMatch(ind.definition, q) * 0.8
        );
        return { indicator: ind, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.indicator);
  }, [q]);

  // Matched Heritage Sites
  const matchedHeritage = useMemo<HeritageSite[]>(() => {
    if (q === '') return [];
    return atlas.getHeritageSites()
      .map(site => {
        let score = 0;
        score = Math.max(
          scoreMatch(site.name, q) * 1.5,
          scoreMatch(site.location, q),
          scoreMatch(site.category, q)
        );
        return { site, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.site);
  }, [q]);

  // Flatten items for keyboard navigation
  const flattenedItems = useMemo<SearchItemType[]>(() => {
    const list: SearchItemType[] = [];
    matchedEntities.forEach(data => list.push({ type: 'entity', data }));
    matchedIndicators.forEach(data => list.push({ type: 'indicator', data }));
    matchedHeritage.forEach(data => list.push({ type: 'heritage', data }));
    return list;
  }, [matchedEntities, matchedIndicators, matchedHeritage]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [q]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (flattenedItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (flattenedItems.length || 1)) % (flattenedItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = flattenedItems[selectedIndex];
        if (selected) {
          handleExecuteSelection(selected);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flattenedItems]);

  const handleExecuteSelection = (item: SearchItemType) => {
    if (item.type === 'entity') {
      addRecentSearch(item.data.name);
      onSelectCountry(item.data.id);
      onClose();
    } else if (item.type === 'indicator') {
      addRecentSearch(item.data.name);
      onSelectIndicator(item.data.id);
      onClose();
    } else if (item.type === 'heritage') {
      addRecentSearch(item.data.name);
      onSelectCountry(item.data.entityId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 md:pt-24 bg-black/75 backdrop-blur-md animate-enter-japandi"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl text-zinc-900 dark:text-zinc-100 transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 px-5 py-4 bg-zinc-50/70 dark:bg-zinc-900/50">
          <Search className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search African countries, ISO codes, indicators, UNESCO heritage..."
            className="w-full bg-transparent text-sm md:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-zinc-500 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-lg">
            ESC
          </span>
        </div>

        {/* Recent Searches Header Chips */}
        {recentSearches.length > 0 && q === '' && (
          <div className="px-5 py-2.5 bg-zinc-100/60 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3 text-emerald-500" /> Recent:
              </span>
              {recentSearches.map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500 shrink-0 cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
            <button
              onClick={clearRecentSearches}
              className="text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 ml-2 shrink-0 cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

        {/* Categorized Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Countries / Entities Section */}
          {matchedEntities.length > 0 && (
            <div>
              <div className="text-[11px] font-mono font-bold tracking-wider uppercase text-zinc-500 px-2 mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-500" /> Sovereign Nations & Territories ({matchedEntities.length})
              </div>
              <div className="space-y-1">
                {matchedEntities.map(entity => {
                  const globalIdx = flattenedItems.findIndex(x => x.type === 'entity' && x.data.id === entity.id);
                  const isSelected = globalIdx === selectedIndex;
                  const isSaved = isCountrySaved(entity.id);

                  return (
                    <div
                      key={entity.id}
                      onClick={() => handleExecuteSelection({ type: 'entity', data: entity })}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all text-left cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/80 shadow-xs' 
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CountryFlag entityId={entity.id} size="md" />
                        <div>
                          <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            {entity.name}
                            <span className="text-[10px] font-mono text-zinc-500 font-normal">[{entity.id}]</span>
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                            <span>Cap: <strong>{entity.capital}</strong></span>
                            <span>•</span>
                            <span>{entity.region}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            toggleSaveCountry(entity.id);
                          }}
                          className="p-1 text-zinc-400 hover:text-amber-500 transition-colors"
                          title={isSaved ? 'Remove from Saved' : 'Save Country'}
                        >
                          <Star className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                        <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Indicators Section */}
          {matchedIndicators.length > 0 && (
            <div>
              <div className="text-[11px] font-mono font-bold tracking-wider uppercase text-zinc-500 px-2 mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-500" /> Statistical Indicators ({matchedIndicators.length})
              </div>
              <div className="space-y-1">
                {matchedIndicators.map(ind => {
                  const globalIdx = flattenedItems.findIndex(x => x.type === 'indicator' && x.data.id === ind.id);
                  const isSelected = globalIdx === selectedIndex;

                  return (
                    <div
                      key={ind.id}
                      onClick={() => handleExecuteSelection({ type: 'indicator', data: ind })}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all text-left cursor-pointer ${
                        isSelected 
                          ? 'bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-700/80 shadow-xs' 
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent'
                      }`}
                    >
                      <div className="pr-4">
                        <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          {ind.name}
                          <span className="rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono px-2 py-0.5">
                            {ind.domain}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                          {ind.definition}
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 shrink-0">
                        {ind.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Heritage Sites Section */}
          {matchedHeritage.length > 0 && (
            <div>
              <div className="text-[11px] font-mono font-bold tracking-wider uppercase text-zinc-500 px-2 mb-2 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-amber-500" /> UNESCO Heritage Properties ({matchedHeritage.length})
              </div>
              <div className="space-y-1">
                {matchedHeritage.map(site => {
                  const country = atlas.getEntity(site.entityId);
                  const globalIdx = flattenedItems.findIndex(x => x.type === 'heritage' && x.data.id === site.id);
                  const isSelected = globalIdx === selectedIndex;

                  return (
                    <div
                      key={site.id}
                      onClick={() => handleExecuteSelection({ type: 'heritage', data: site })}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all text-left cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/80 shadow-xs' 
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                            {site.name}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {country?.name} • Inscribed {site.inscribedYear} ({site.category})
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                        {site.location}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {matchedEntities.length === 0 && matchedIndicators.length === 0 && matchedHeritage.length === 0 && (
            <div className="py-12 text-center text-zinc-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
              <p className="text-sm font-semibold">No records found matching "{query}"</p>
              <p className="text-xs text-zinc-400 mt-1">Try searching by country name, ISO code (e.g. NGA, DZA, ZAF), capital, or indicator (e.g. GDP, Population).</p>
            </div>
          )}
        </div>

        {/* Keyboard Navigation Footer */}
        <div className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/60 px-5 py-3 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-700 dark:text-zinc-300">↑</kbd>
              <kbd className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-700 dark:text-zinc-300">↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-700 dark:text-zinc-300 flex items-center"><CornerDownLeft className="w-3 h-3" /></kbd> Select
            </span>
          </div>
          <span>CC-BY 4.0 Open Data</span>
        </div>
      </div>
    </div>
  );
};
