import React, { useState, useEffect, useRef, useMemo } from 'react';
import { atlas } from '../data/atlas-store';
import { AtlasEntity, IndicatorDefinition, HeritageSite } from '../data/types';
import { SLAVE_TRADE_ILLUSTRATIONS, SlaveTradeIllustration } from '../data/slaveTradeIllustrations';
import { CASTAS_ARCHIVE_ITEMS, CastasArchivalItem } from '../data/castasArchive';
import { ResearchReport } from '../data/reportsData';
import { getAllReports } from '../data/reportsDataLoader';
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
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  FileText,
  Sliders,
  Palette
} from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCountry: (entityId: string) => void;
  onSelectIndicator: (indicatorId: string) => void;
  onSelectTab?: (tab: string) => void;
}

export interface AppCommandItem {
  id: string;
  title: string;
  subtitle: string;
  tab: string;
  iconName: string;
  category: string;
  shortcut?: string;
  keywords: string[];
}

export const APP_COMMAND_REGISTRY: AppCommandItem[] = [
  { id: 'cmd-overview', title: 'Executive Overview', subtitle: 'Continental dashboard, macro indicators & UN M49 geoscheme', tab: 'overview', iconName: 'Globe', category: 'Views', shortcut: 'G O', keywords: ['overview', 'dashboard', 'home', 'africa', 'un', 'geoscheme'] },
  { id: 'cmd-explore', title: '54 Sovereign Nations Directory', subtitle: 'Card directory, sorting by GDP, population, land area & HDI', tab: 'explore', iconName: 'Layers', category: 'Views', shortcut: 'G E', keywords: ['explore', 'countries', 'nations', 'sovereign', 'states', 'directory'] },
  { id: 'cmd-map', title: 'Vector Cartography Map', subtitle: '5,796 × 5,867 authentic canvas, 1,017 Admin-1 boundaries & graticules', tab: 'map', iconName: 'Compass', category: 'Views', shortcut: 'G M', keywords: ['map', 'cartography', 'admin1', 'provinces', 'gis', 'boundaries', 'graticule'] },
  { id: 'cmd-compare', title: 'Bilateral Nation Benchmark', subtitle: 'Side-by-side KPI comparison & convergence trajectories', tab: 'compare', iconName: 'Sliders', category: 'Analytics', shortcut: 'G C', keywords: ['compare', 'benchmark', 'bilateral', 'side-by-side', 'convergence'] },
  { id: 'cmd-analytics', title: 'Research Analytics & Regression', subtitle: 'Bivariate scatter matrix, Pearson r, R² variance & time-series', tab: 'analytics', iconName: 'TrendingUp', category: 'Analytics', shortcut: 'G A', keywords: ['analytics', 'regression', 'scatter', 'correlation', 'pearson', 'chart', 'trend'] },
  { id: 'cmd-pillars', title: '8 Thematic Pillars Radar', subtitle: 'Strategic development pillars, radar index & macro drivers', tab: 'pillars', iconName: 'Sparkles', category: 'Analytics', shortcut: 'G P', keywords: ['pillars', 'radar', 'economy', 'infrastructure', 'governance', 'climate'] },
  { id: 'cmd-languages', title: 'Living Languages & Mother Tongues', subtitle: '2,000+ living languages across 4 phyla & audio player', tab: 'languages', iconName: 'BookOpen', category: 'Culture', shortcut: 'G L', keywords: ['languages', 'tongues', 'swahili', 'hausa', 'bantu', 'audio', 'phonemes'] },
  { id: 'cmd-heritage', title: 'UNESCO World Heritage Sites', subtitle: '145+ cultural, natural, mixed and in-danger monuments', tab: 'heritage', iconName: 'Landmark', category: 'Culture', shortcut: 'G H', keywords: ['heritage', 'unesco', 'monuments', 'cultural', 'natural', 'danger'] },
  { id: 'cmd-ethnic-tree', title: 'Ancestral Tree of Life', subtitle: 'Phylogenetic cladogram, haplogroups L0–L3 and 310+ ethnic lineages', tab: 'ethnic-tree', iconName: 'Sparkles', category: 'Genomics', shortcut: 'G T', keywords: ['tree', 'ethnic', 'cladogram', 'haplogroups', 'ancestry', 'phylogeny'] },
  { id: 'cmd-slave-trade', title: 'Middle Passage & 47 Embarkation Ports', subtitle: 'Geodesic flows, 36,108 voyage records & coastal enclaves', tab: 'slave-trade', iconName: 'Clock', category: 'History', shortcut: 'G S', keywords: ['slave-trade', 'voyages', 'middle passage', 'ports', 'routes', 'enslaved'] },
  { id: 'cmd-iconography', title: 'Digital Iconography & Castas Archive', subtitle: '1,252 archival plates, Brookes 1788 plan & colonial paintings', tab: 'iconography', iconName: 'Palette', category: 'History', shortcut: 'G I', keywords: ['iconography', 'castas', 'plates', 'archives', 'brookes', 'prints'] },
  { id: 'cmd-archival-cartography', title: 'Archival Cartography & Currents', subtitle: 'Antique plate curtain viewer (1688–1851) & 60fps ocean drift', tab: 'archival-cartography', iconName: 'Compass', category: 'History', shortcut: 'G K', keywords: ['archival', 'antique', 'maps', 'curtain', 'ocean', 'currents', 'winds'] },
  { id: 'cmd-dev-foundations', title: 'African Development Foundations Monograph', subtitle: 'Synthesis of macro-geonomics, Nathan Nunn mistrust & UN resolutions', tab: 'african-development-foundations', iconName: 'FileText', category: 'Research', keywords: ['master report', 'foundations', 'development', 'nunn', 'institutions'] },
  { id: 'cmd-molecular-legacies', title: 'Paleogenomic Molecular Legacies', subtitle: '50,000+ genomes, IBD deconvolution & African diaspora genetics', tab: 'molecular-legacies', iconName: 'FileText', category: 'Research', keywords: ['molecular', 'genetics', 'paleogenomics', 'ibd', 'dna', 'legacies'] },
  { id: 'cmd-research-directory', title: 'Working Papers & Policy Briefs', subtitle: 'Peer-reviewed research series, DOIs & executive abstracts', tab: 'research-directory', iconName: 'FileText', category: 'Research', keywords: ['working papers', 'directory', 'doi', 'citations', 'policy'] },
  { id: 'cmd-provenance', title: 'Epistemic Provenance & SHA-256 Verifier', subtitle: 'Cryptographic dataset hashes & 16 multilateral API connectors', tab: 'provenance', iconName: 'ShieldCheck', category: 'System', keywords: ['provenance', 'sha256', 'hash', 'integrity', 'audit', 'connectors'] },
  { id: 'cmd-privacy', title: 'Zero-Telemetry & GDPR Article 17 Wipe', subtitle: 'Transparent privacy notice & local cache reset', tab: 'privacy', iconName: 'ShieldCheck', category: 'System', keywords: ['privacy', 'telemetry', 'gdpr', 'wipe', 'storage'] },
  { id: 'cmd-style-guide', title: 'Universal Living Style Guide', subtitle: 'Japandi-Sahel design tokens, typography & accessibility tokens', tab: 'style-guide', iconName: 'Palette', category: 'System', keywords: ['style guide', 'design', 'tokens', 'japandi', 'theme'] },
];

type SearchCategory = 'all' | 'commands' | 'countries' | 'indicators' | 'iconography' | 'reports' | 'heritage';

type SearchItemType = 
  | { type: 'command'; data: AppCommandItem }
  | { type: 'entity'; data: AtlasEntity }
  | { type: 'indicator'; data: IndicatorDefinition }
  | { type: 'heritage'; data: HeritageSite }
  | { type: 'iconography'; data: SlaveTradeIllustration }
  | { type: 'castas'; data: CastasArchivalItem }
  | { type: 'report'; data: ResearchReport };

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCountry,
  onSelectIndicator,
  onSelectTab
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { recentSearches, addRecentSearch, clearRecentSearches, isCountrySaved, toggleSaveCountry } = useSavedEntities();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  const q = query.trim().toLowerCase();

  // Simple fuzzy scoring function
  const scoreMatch = (text: string, search: string): number => {
    if (!text) return 0;
    const t = text.toLowerCase();
    if (t === search) return 100;
    if (t.startsWith(search)) return 80;
    if (t.includes(search)) return 50;
    return 0;
  };

  // Matched View/Tool Commands
  const matchedCommands = useMemo<AppCommandItem[]>(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'commands') return [];
    const searchClean = q.startsWith('>') ? q.slice(1).trim() : q;
    if (searchClean === '') return APP_COMMAND_REGISTRY.slice(0, 4);

    return APP_COMMAND_REGISTRY
      .map(cmd => {
        let score = 0;
        const kwMatch = cmd.keywords.some(k => k.toLowerCase().includes(searchClean)) ? 45 : 0;
        score = Math.max(
          scoreMatch(cmd.title, searchClean) * 1.8,
          scoreMatch(cmd.tab, searchClean) * 1.5,
          scoreMatch(cmd.subtitle, searchClean),
          kwMatch
        );
        if (q.startsWith('>')) score += 50;
        return { cmd, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.cmd);
  }, [q, selectedCategory]);

  // Matched Entities with scoring
  const matchedEntities = useMemo<AtlasEntity[]>(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'countries') return [];
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
      .slice(0, 6)
      .map(item => item.entity);
  }, [q, selectedCategory]);

  // Matched Indicators with scoring
  const matchedIndicators = useMemo<IndicatorDefinition[]>(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'indicators') return [];
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
  }, [q, selectedCategory]);

  // Matched Research Monographs & Working Papers
  const matchedReports = useMemo<ResearchReport[]>(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'reports') return [];
    const reportList = Object.values(getAllReports());
    if (q === '') return reportList.slice(0, 3);
    return reportList
      .map(rep => {
        let score = 0;
        const authorMatch = rep.authors.some(a => a.toLowerCase().includes(q)) ? 40 : 0;
        score = Math.max(
          scoreMatch(rep.title, q) * 1.6,
          scoreMatch(rep.subtitle || '', q) * 1.2,
          scoreMatch(rep.categoryLabel, q),
          authorMatch
        );
        return { report: rep, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.report);
  }, [q, selectedCategory]);

  // Matched Archival Iconography Plates
  const matchedIconography = useMemo<SlaveTradeIllustration[]>(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'iconography') return [];
    if (q === '') return SLAVE_TRADE_ILLUSTRATIONS.slice(0, 3);
    return SLAVE_TRADE_ILLUSTRATIONS
      .map(ill => {
        let score = 0;
        const researchersMatch = ill.researchers.some(r => r.toLowerCase().includes(q)) ? 40 : 0;
        const collectionMatch = ill.collectionNames.some(c => c.toLowerCase().includes(q)) ? 50 : 0;
        score = Math.max(
          scoreMatch(ill.title, q) * 1.4,
          scoreMatch(ill.regId, q) * 2,
          scoreMatch(ill.source, q) * 0.9,
          researchersMatch,
          collectionMatch
        );
        return { ill, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.ill);
  }, [q, selectedCategory]);

  // Matched Castas Archive
  const matchedCastas = useMemo<CastasArchivalItem[]>(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'iconography') return [];
    if (q === '') return CASTAS_ARCHIVE_ITEMS.slice(0, 2);
    return CASTAS_ARCHIVE_ITEMS
      .map(item => {
        let score = 0;
        score = Math.max(
          scoreMatch(item.title, q) * 1.5,
          scoreMatch(item.creator, q) * 1.2,
          scoreMatch(item.category, q),
          scoreMatch(item.description, q) * 0.7
        );
        return { item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.item);
  }, [q, selectedCategory]);

  // Matched Heritage Sites
  const matchedHeritage = useMemo<HeritageSite[]>(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'heritage') return [];
    if (q === '') return atlas.getHeritageSites().slice(0, 2);
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
      .slice(0, 3)
      .map(item => item.site);
  }, [q, selectedCategory]);

  // Flatten items for keyboard navigation (Commands first if searching or if > typed)
  const flattenedItems = useMemo<SearchItemType[]>(() => {
    const list: SearchItemType[] = [];
    matchedCommands.forEach(data => list.push({ type: 'command', data }));
    matchedEntities.forEach(data => list.push({ type: 'entity', data }));
    matchedReports.forEach(data => list.push({ type: 'report', data }));
    matchedIconography.forEach(data => list.push({ type: 'iconography', data }));
    matchedCastas.forEach(data => list.push({ type: 'castas', data }));
    matchedIndicators.forEach(data => list.push({ type: 'indicator', data }));
    matchedHeritage.forEach(data => list.push({ type: 'heritage', data }));
    return list;
  }, [matchedCommands, matchedEntities, matchedReports, matchedIconography, matchedCastas, matchedIndicators, matchedHeritage]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [q, selectedCategory]);

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
        } else if (q) {
          addRecentSearch(query);
          if (onSelectTab) {
            if (selectedCategory === 'iconography') {
              onSelectTab(`iconography?q=${encodeURIComponent(query)}`);
            } else {
              onSelectTab(`explore`);
            }
          }
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flattenedItems]);

  const handleExecuteSelection = (item: SearchItemType) => {
    if (item.type === 'command') {
      addRecentSearch(item.data.title);
      if (onSelectTab) {
        onSelectTab(item.data.tab);
      } else {
        window.location.hash = item.data.tab;
      }
      onClose();
    } else if (item.type === 'entity') {
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
    } else if (item.type === 'iconography') {
      addRecentSearch(item.data.title);
      if (onSelectTab) {
        onSelectTab(`iconography?plate=${item.data.objectId}`);
      }
      onClose();
    } else if (item.type === 'castas') {
      addRecentSearch(item.data.title);
      if (onSelectTab) {
        onSelectTab(`iconography?castas=${item.data.id}`);
      }
      onClose();
    } else if (item.type === 'report') {
      addRecentSearch(item.data.title);
      if (onSelectTab) {
        onSelectTab(item.data.id);
      }
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
            placeholder="Search African countries, historical plates, castas archive, monographs, indicators..."
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

        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-800/80 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('commands')}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'commands'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Commands</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('countries')}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'countries'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>Nations</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('reports')}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'reports'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Monographs</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('iconography')}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'iconography'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Iconography</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('indicators')}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'indicators'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>Indicators</span>
          </button>
        </div>

        {/* Results Container with Sleek Scrollbar & Click-Through Bottom Fade */}
        <div className="relative overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto stable-gutter sleek-scrollbar p-4 space-y-2 pb-8">
          {flattenedItems.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Search className="w-8 h-8 text-zinc-400 mx-auto opacity-50" />
              <p className="text-sm font-sans text-zinc-600 dark:text-zinc-400">
                No matching records found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs font-mono text-zinc-500">
                Try searching for &ldquo;Nigeria&rdquo;, &ldquo;Castas&rdquo;, &ldquo;Genetics&rdquo;, or &ldquo;GDP&rdquo;
              </p>
            </div>
          ) : (
            flattenedItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleExecuteSelection(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-sm'
                      : 'border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    {/* Icon Column */}
                    {item.type === 'command' && (
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'entity' && (
                      <CountryFlag entityId={item.data.id} size="sm" />
                    )}
                    {item.type === 'report' && (
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'iconography' && (
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'castas' && (
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                        <Palette className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'indicator' && (
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'heritage' && (
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
                        <Landmark className="w-4 h-4" />
                      </div>
                    )}

                    {/* Text Column */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-sans font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {item.type === 'command' && item.data.title}
                          {item.type === 'entity' && item.data.name}
                          {item.type === 'report' && item.data.title}
                          {item.type === 'iconography' && item.data.title}
                          {item.type === 'castas' && item.data.title}
                          {item.type === 'indicator' && item.data.name}
                          {item.type === 'heritage' && item.data.name}
                        </span>
                        {item.type === 'command' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                            {item.data.category}
                          </span>
                        )}
                        {item.type === 'entity' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {item.data.id}
                          </span>
                        )}
                        {item.type === 'iconography' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            Plate {item.data.regId}
                          </span>
                        )}
                        {item.type === 'castas' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            Castas Archive
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-serif text-zinc-500 dark:text-zinc-400 truncate">
                        {item.type === 'command' && `${item.data.subtitle} (Route: #${item.data.tab})`}
                        {item.type === 'entity' && `${item.data.region} • Capital: ${item.data.capital}`}
                        {item.type === 'report' && `${item.data.categoryLabel} • ${item.data.authors[0]}`}
                        {item.type === 'iconography' && `${item.data.date || 'Historical'} • ${item.data.source}`}
                        {item.type === 'castas' && `${item.data.date} • ${item.data.creator}`}
                        {item.type === 'indicator' && `${item.data.domain} • ${item.data.unit}`}
                        {item.type === 'heritage' && `${item.data.location} • ${item.data.category}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-zinc-400 shrink-0">
                    {item.type === 'command' && item.data.shortcut && (
                      <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold">
                        {item.data.shortcut}
                      </span>
                    )}
                    {isSelected && (
                      <span className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        Jump ↵
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })
          )}
          </div>

          {/* Click-Through Bottom Fade Overlay */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent pointer-events-none z-10" 
            aria-hidden="true" 
          />
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
          <span>Africa Data Atlas Universal Index</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
