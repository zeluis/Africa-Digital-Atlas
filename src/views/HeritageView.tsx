import React, { useState, useMemo } from 'react';
import { atlas } from '../data/atlas-store';
import { HeritageCategory, HeritageSite } from '../data/types';
import { CountryFlag } from '../components/CountryFlag';
import { getCountryRegionTonalPalette } from '../data/unGeoschemeColors';
import { 
  Landmark, 
  Search, 
  TreePine, 
  Sparkles, 
  MapPin, 
  Calendar, 
  ExternalLink,
  ShieldAlert,
  ArrowUpDown,
  History
} from 'lucide-react';

interface HeritageViewProps {
  onSelectCountry: (entityId: string) => void;
}

export const HeritageView: React.FC<HeritageViewProps> = ({
  onSelectCountry
}) => {
  const [selectedCategory, setSelectedCategory] = useState<HeritageCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'chronological' | 'reverse' | 'alpha'>('chronological');

  const allSites = atlas.getHeritageSites();

  const filteredSites = useMemo(() => {
    let list = allSites.filter(site => {
      const matchesCategory = selectedCategory === 'All' || site.category === selectedCategory;
      const country = atlas.getEntity(site.entityId);
      const matchesQuery = 
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (country && country.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });

    if (sortOrder === 'chronological') {
      list.sort((a, b) => a.inscribedYear - b.inscribedYear);
    } else if (sortOrder === 'reverse') {
      list.sort((a, b) => b.inscribedYear - a.inscribedYear);
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [allSites, selectedCategory, searchQuery, sortOrder]);

  const categories: (HeritageCategory | 'All')[] = ['All', 'Cultural', 'Natural', 'Mixed'];

  const culturalCount = allSites.filter(s => s.category === 'Cultural').length;
  const naturalCount = allSites.filter(s => s.category === 'Natural').length;
  const mixedCount = allSites.filter(s => s.category === 'Mixed').length;

  return (
    <div className="space-y-8 animate-enter-japandi">
      {/* Header Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-2xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Active Page Pill Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60 text-xs font-mono font-semibold text-amber-700 dark:text-amber-300 mb-3 shadow-2xs">
              <Landmark className="w-3.5 h-3.5" />
              <span>AFRICA ATLAS • UNESCO WORLD HERITAGE</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              African Heritage & Monuments
            </h1>
            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              104 inscribed cultural landscapes, ancient architectural monuments, and ecological sanctuaries verified across 42 African state parties.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-2xl text-center">
              <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">{allSites.length}</div>
              <div className="text-[10px] uppercase font-semibold text-zinc-500">Inscribed Properties</div>
            </div>
            <a
              href="https://whc.unesco.org/en/list/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <span>UNESCO Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter, Search & Timeline Sort Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {cat} {cat === 'Cultural' ? `(${culturalCount})` : cat === 'Natural' ? `(${naturalCount})` : cat === 'Mixed' ? `(${mixedCount})` : `(${allSites.length})`}
            </button>
          ))}
        </div>

        {/* Search & Timeline Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search sites or nations..."
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 text-xs py-2 pl-9 pr-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setSortOrder('chronological')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                sortOrder === 'chronological' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
              title="Sort by Inscription Year (Earliest First)"
            >
              Timeline (1978→)
            </button>
            <button
              onClick={() => setSortOrder('reverse')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                sortOrder === 'reverse' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
              title="Sort by Inscription Year (Latest First)"
            >
              Recent First
            </button>
          </div>
        </div>
      </div>

      {/* Heritage Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSites.map(site => {
          const country = atlas.getEntity(site.entityId);
          const tonal = getCountryRegionTonalPalette(site.entityId);

          return (
            <div
              key={site.id}
              className={`rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-4 shadow-lg transition-all flex flex-col justify-between ${tonal.card.borderHover} hover:shadow-xl`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    site.category === 'Cultural' ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300' :
                    site.category === 'Natural' ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300' :
                    'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-200 dark:border-cyan-700 text-cyan-800 dark:text-cyan-300'
                  }`}>
                    {site.category} Property
                  </span>
                  <div className="flex items-center gap-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Inscribed {site.inscribedYear}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 leading-snug">
                  {site.name}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {site.description}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <button
                  onClick={() => onSelectCountry(site.entityId)}
                  className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}
                >
                  <CountryFlag entityId={site.entityId} size="xs" />
                  <span>{country?.name || site.entityId}</span>
                </button>

                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  <span>{site.location}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
