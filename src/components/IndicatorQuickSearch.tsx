import React, { useState, useRef, useEffect, useMemo } from 'react';
import { atlas } from '../data/atlas-store';
import { IndicatorDefinition } from '../data/types';
import { Search, ChevronDown, Check, X, Sparkles } from 'lucide-react';

export interface IndicatorQuickSearchProps {
  selectedIndicatorId: string;
  onSelectIndicator: (indicatorId: string) => void;
  selectedDomain?: string;
  label?: string;
  placeholder?: string;
  compact?: boolean;
  className?: string;
}

export const getDomainColorClasses = (domain: string) => {
  const d = domain.toLowerCase();
  if (d.includes('macro') || d.includes('economy')) {
    return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
  }
  if (d.includes('demograph')) {
    return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
  }
  if (d.includes('health')) {
    return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
  }
  if (d.includes('education')) {
    return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60';
  }
  if (d.includes('govern')) {
    return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
  }
  if (d.includes('environ') || d.includes('climate')) {
    return 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60';
  }
  if (d.includes('infra')) {
    return 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/60';
  }
  if (d.includes('social')) {
    return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60';
  }
  return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
};

export const IndicatorQuickSearch: React.FC<IndicatorQuickSearchProps> = ({
  selectedIndicatorId,
  onSelectIndicator,
  selectedDomain = 'All',
  label,
  placeholder = 'Type to search 50+ indicators by name, domain, or ID...',
  compact = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allIndicators = useMemo(() => atlas.getAllIndicators(), []);
  const currentIndicator = useMemo(
    () => atlas.getIndicator(selectedIndicatorId) || allIndicators[0],
    [selectedIndicatorId, allIndicators]
  );

  // Filter indicators matching domain & search query
  const filteredIndicators = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allIndicators.filter(ind => {
      // Domain check
      let matchesDomain = true;
      if (selectedDomain && selectedDomain !== 'All') {
        const dom = ind.domain.toLowerCase();
        const sel = selectedDomain.toLowerCase();
        if (sel === 'demographic') {
          matchesDomain = dom.includes('demograph');
        } else if (sel === 'macroeconomic') {
          matchesDomain = dom.includes('macro') || dom.includes('economy');
        } else if (sel === 'environmental') {
          matchesDomain = dom.includes('environ') || dom.includes('climate');
        } else {
          matchesDomain = dom.includes(sel);
        }
      }

      if (!matchesDomain && q.length === 0) return false;

      // Query check (if query is typed, search across all domains or within domain)
      if (!q) return matchesDomain;

      const inName = ind.name.toLowerCase().includes(q);
      const inId = ind.id.toLowerCase().includes(q);
      const inDomain = ind.domain.toLowerCase().includes(q);
      const inSubdomain = (ind.subdomain || '').toLowerCase().includes(q);
      const inDef = (ind.definition || '').toLowerCase().includes(q);

      return inName || inId || inDomain || inSubdomain || inDef;
    });
  }, [allIndicators, selectedDomain, searchQuery]);

  // Reset highlight index when filtered list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredIndicators.length]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < filteredIndicators.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredIndicators.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredIndicators[highlightedIndex]) {
        handleSelect(filteredIndicators[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (indicator: IndicatorDefinition) => {
    onSelectIndicator(indicator.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const domainBadgeClasses = currentIndicator ? getDomainColorClasses(currentIndicator.domain) : '';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono">
          {label}
        </label>
      )}

      {/* Input / Trigger Control */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchQuery : currentIndicator?.name ? `${currentIndicator.name}` : ''}
          onChange={e => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={isOpen ? placeholder : currentIndicator?.name || placeholder}
          className={`w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs md:text-sm font-semibold rounded-2xl pl-10 pr-24 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${
            compact ? 'py-2.5' : 'py-3'
          }`}
        />

        {/* Right badges & trigger buttons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isOpen && searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {!isOpen && currentIndicator && (
            <span className={`hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${domainBadgeClasses}`}>
              {currentIndicator.domain}
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              setIsOpen(prev => !prev);
              if (!isOpen) {
                setTimeout(() => inputRef.current?.focus(), 50);
              }
            }}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md transition-transform"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Floating Dropdown List of Indicators */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 max-h-80 flex flex-col">
          {/* Header readout */}
          <div className="px-3.5 py-2 bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              {filteredIndicators.length} matching indicator{filteredIndicators.length === 1 ? '' : 's'}
            </span>
            <span>Use ↑↓ to navigate, Enter to select</span>
          </div>

          {/* Scrollable list */}
          <div ref={listRef} className="overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/50 flex-1">
            {filteredIndicators.length > 0 ? (
              filteredIndicators.map((ind, idx) => {
                const isSelected = ind.id === selectedIndicatorId;
                const isHighlighted = idx === highlightedIndex;
                const badgeStyle = getDomainColorClasses(ind.domain);

                return (
                  <div
                    key={ind.id}
                    onClick={() => handleSelect(ind)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-4 py-3 cursor-pointer flex items-start justify-between gap-3 transition-colors ${
                      isHighlighted
                        ? 'bg-zinc-100/90 dark:bg-zinc-900'
                        : isSelected
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${badgeStyle}`}>
                          {ind.domain}
                        </span>
                        <span className="font-semibold text-xs md:text-sm text-zinc-900 dark:text-zinc-100 truncate">
                          {ind.name}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                        <span className="text-zinc-400 dark:text-zinc-500">ID: {ind.id}</span>
                        <span>•</span>
                        <span>Unit: <strong>{ind.unit}</strong></span>
                        {ind.preferredSource && (
                          <>
                            <span>•</span>
                            <span>Source: {ind.preferredSource}</span>
                          </>
                        )}
                      </div>

                      {ind.definition && (
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-1">
                          {ind.definition}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 pt-1">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700" />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center space-y-2">
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  No indicators found matching &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-[11px] text-zinc-400">
                  Try searching for keywords like &ldquo;GDP&rdquo;, &ldquo;Population&rdquo;, &ldquo;Mortality&rdquo;, &ldquo;Electricity&rdquo;, or &ldquo;Education&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 px-3 py-1 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition-colors"
                >
                  Clear search filter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
