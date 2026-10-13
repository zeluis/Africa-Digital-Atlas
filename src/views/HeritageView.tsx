import React, { useState, useMemo, useEffect } from 'react';
import { atlas } from '../data/atlas-store';
import { CountryFlag } from '../components/CountryFlag';
import { getCountryRegionTonalPalette } from '../data/unGeoschemeColors';
import { ArchivalImageViewer } from '../components/common/ArchivalImageViewer';
import { ArchivalLoupeModal } from '../components/slaveVoyages/ArchivalLoupeModal';
import { DynamicIcon } from '../components/DynamicIcon';
import {
  INITIAL_UNESCO_HERITAGE_SITES,
  unescoSiteToIllustration,
  parseUnescoXmlRows
} from '../data/unescoHeritageRegistry';
import { SlaveTradeIllustration, UnescoSiteMetadata } from '../data/slaveTradeIllustrations';
import {
  Landmark,
  Search,
  MapPin,
  Calendar,
  ExternalLink,
  Upload,
  X,
  Check,
  AlertTriangle,
  Globe2,
  Eye,
  Camera
} from 'lucide-react';

interface HeritageViewProps {
  onSelectCountry: (entityId: string) => void;
  initialSiteId?: number;
}

type RegionFilter = 'All' | 'Africa' | 'Arab States';
type CategoryFilter = 'All' | 'Cultural' | 'Natural' | 'Mixed' | 'Danger';
type ViewMode = 'viewer' | 'directory';

const UNESCO_CUSTOM_XML_STORAGE_KEY = 'africalia_unesco_xml_sites_v1';

export const HeritageView: React.FC<HeritageViewProps> = ({
  onSelectCountry,
  initialSiteId
}) => {
  // Load either custom ingested XML rows from localStorage or the complete 210 Africa + Arab States registry
  const [unescoSites, setUnescoSites] = useState<UnescoSiteMetadata[]>(() => {
    try {
      const saved = localStorage.getItem(UNESCO_CUSTOM_XML_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_UNESCO_HERITAGE_SITES.length && parsed[0]?.license) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_UNESCO_HERITAGE_SITES;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('viewer');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal state for importing / pasting UNESCO XML
  const [isXmlModalOpen, setIsXmlModalOpen] = useState<boolean>(false);
  const [xmlInputText, setXmlInputText] = useState<string>('');
  const [xmlImportStatus, setXmlImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filtered UNESCO sites based on region, category, and search query
  const filteredSites = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return unescoSites.filter(site => {
      const matchesRegion =
        regionFilter === 'All' ||
        site.region.toLowerCase() === regionFilter.toLowerCase();

      const matchesCategory =
        categoryFilter === 'All'
          ? true
          : categoryFilter === 'Danger'
          ? Boolean(site.danger)
          : site.category === categoryFilter;

      const matchesQuery =
        !q ||
        site.site.toLowerCase().includes(q) ||
        site.states.toLowerCase().includes(q) ||
        (site.location && site.location.toLowerCase().includes(q)) ||
        String(site.idNumber).includes(q) ||
        (site.shortDescription && site.shortDescription.toLowerCase().includes(q));

      return matchesRegion && matchesCategory && matchesQuery;
    });
  }, [unescoSites, regionFilter, categoryFilter, searchQuery]);

  // Convert filtered UNESCO sites to SlaveTradeIllustration objects for ArchivalImageViewer
  const illustrationsList = useMemo<SlaveTradeIllustration[]>(() => {
    return filteredSites.map(unescoSiteToIllustration);
  }, [filteredSites]);

  const [activeIllustration, setActiveIllustration] = useState<SlaveTradeIllustration | null>(() => {
    if (initialSiteId) {
      const match = INITIAL_UNESCO_HERITAGE_SITES.find(s => s.idNumber === initialSiteId);
      if (match) return unescoSiteToIllustration(match);
    }
    return null;
  });
  const [inspectedModalIllustration, setInspectedModalIllustration] = useState<SlaveTradeIllustration | null>(null);

  // Deep-linking: Automatically select and open initialSiteId if requested via search / URL / map
  useEffect(() => {
    if (!initialSiteId) return;
    const match = unescoSites.find(s => s.idNumber === initialSiteId);
    if (match) {
      const target = unescoSiteToIllustration(match);
      setActiveIllustration(prev => (prev?.objectId === target.objectId ? prev : target));
      setViewMode(prev => (prev === 'viewer' ? prev : 'viewer'));
    }
  }, [initialSiteId, unescoSites]);

  // Keep activeIllustration valid when filters or dataset change
  useEffect(() => {
    if (illustrationsList.length === 0) {
      setActiveIllustration(null);
      return;
    }
    setActiveIllustration(prev => {
      if (prev && illustrationsList.some(item => item.objectId === prev.objectId)) {
        return prev;
      }
      return illustrationsList[0];
    });
  }, [illustrationsList]);

  // Counts for badges
  const africaCount = useMemo(() => unescoSites.filter(s => s.region === 'Africa').length, [unescoSites]);
  const arabStatesCount = useMemo(() => unescoSites.filter(s => s.region === 'Arab States').length, [unescoSites]);
  const dangerCount = useMemo(() => unescoSites.filter(s => s.danger).length, [unescoSites]);

  // Handle XML file upload or paste
  const handleParseXmlSubmit = () => {
    const extracted = parseUnescoXmlRows(xmlInputText);
    if (extracted.length === 0) {
      setXmlImportStatus({
        type: 'error',
        message: 'No <row> entries with region "Africa" or "Arab States" were found in the provided XML.'
      });
      return;
    }
    setUnescoSites(extracted);
    try {
      localStorage.setItem(UNESCO_CUSTOM_XML_STORAGE_KEY, JSON.stringify(extracted));
    } catch {
      // ignore quota errors
    }
    setXmlImportStatus({
      type: 'success',
      message: `Extracted ${extracted.length} UNESCO World Heritage sites across Africa and the Arab States.`
    });
    setTimeout(() => {
      setIsXmlModalOpen(false);
      setXmlImportStatus(null);
    }, 1200);
  };

  const handleXmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || '');
      setXmlInputText(content);
      const extracted = parseUnescoXmlRows(content);
      if (extracted.length > 0) {
        setUnescoSites(extracted);
        try {
          localStorage.setItem(UNESCO_CUSTOM_XML_STORAGE_KEY, JSON.stringify(extracted));
        } catch {
          // ignore
        }
        setXmlImportStatus({
          type: 'success',
          message: `Extracted ${extracted.length} UNESCO World Heritage sites (${extracted.filter(s => s.region === 'Africa').length} Africa, ${extracted.filter(s => s.region === 'Arab States').length} Arab States).`
        });
      } else {
        setXmlImportStatus({
          type: 'error',
          message: 'Could not find Africa or Arab States <row> entries in this XML file.'
        });
      }
    };
    reader.readAsText(file);
  };

  const activeMeta = activeIllustration?.unescoMeta;

  return (
    <div className="w-full h-[calc(100vh-64px)] min-h-[640px] flex flex-col overflow-hidden bg-[#FAF8F5] dark:bg-stone-950 select-none">
      {/* Top Integrated Workbench Bar (matches Castas & Cartography Full-Bleed Header) */}
      <header className="w-full shrink-0 border-b border-stone-200/90 dark:border-stone-800/90 bg-[#FAF8F5]/98 dark:bg-stone-950/98 backdrop-blur-md px-3 sm:px-6 py-2 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 z-20 shadow-xs">
        
        {/* Left: View Title, Active Property Badge & Country Dossier Jump */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-xl bg-amber-900/10 dark:bg-amber-400/10 border border-amber-900/15 dark:border-amber-400/20 text-amber-900 dark:text-amber-400 shrink-0">
            <Landmark className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif font-bold text-xs sm:text-sm md:text-base text-stone-900 dark:text-stone-100 whitespace-nowrap">
                UNESCO World Heritage Archive
              </h1>
              {activeMeta && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 font-mono text-[9.5px] font-bold border border-amber-500/30 whitespace-nowrap">
                  WHC #{activeMeta.idNumber} • {activeMeta.region}
                </span>
              )}
              {activeMeta?.entityId && atlas.getEntity(activeMeta.entityId) && (
                <button
                  onClick={() => onSelectCountry(activeMeta.entityId!)}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-stone-200/70 hover:bg-stone-300/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-[10px] font-mono font-semibold text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
                  title={`Open ${atlas.getEntity(activeMeta.entityId)?.name} Country Dossier`}
                >
                  <CountryFlag entityId={activeMeta.entityId} size="xs" />
                  <span>{activeMeta.states}</span>
                </button>
              )}
              {activeIllustration && (
                <span className="text-[11px] font-serif italic text-stone-700 dark:text-stone-300 truncate max-w-xs md:max-w-md hidden 2xl:inline">
                  • {activeIllustration.title}
                </span>
              )}
            </div>
            <p className="text-[10px] font-mono text-stone-500 dark:text-stone-400 truncate hidden md:block">
              Africa ({africaCount}) &amp; Arab States ({arabStatesCount}) • 1972 UNESCO World Heritage Convention Registry
            </p>
          </div>
        </div>

        {/* Center / Right Controls: Region Filter, Category Filter, Search, XML Ingest & View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Region Filter Pills */}
          <div className="inline-flex p-0.5 rounded-xl bg-stone-200/70 dark:bg-stone-900 border border-stone-300/60 dark:border-stone-800 text-[11px] font-mono">
            {(['All', 'Africa', 'Arab States'] as RegionFilter[]).map(reg => (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  regionFilter === reg
                    ? 'bg-amber-900 text-white dark:bg-amber-500 dark:text-stone-950 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                }`}
              >
                {reg === 'All'
                  ? `All (${unescoSites.length})`
                  : reg === 'Africa'
                  ? `Africa (${africaCount})`
                  : `Arab States (${arabStatesCount})`}
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="hidden lg:inline-flex p-0.5 rounded-xl bg-stone-200/70 dark:bg-stone-900 border border-stone-300/60 dark:border-stone-800 text-[11px] font-mono">
            {(['All', 'Cultural', 'Natural', 'Mixed', 'Danger'] as CategoryFilter[]).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                }`}
              >
                {cat === 'Danger' ? `In Danger (${dangerCount})` : cat}
              </button>
            ))}
          </div>

          {/* Compact Search Input */}
          <div className="relative w-36 sm:w-48">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search site, state, #ID..."
              className="w-full pl-8 pr-6 py-1 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Import UNESCO XML Button */}
          <button
            onClick={() => {
              setIsXmlModalOpen(true);
              setXmlImportStatus(null);
            }}
            className="px-2.5 py-1 rounded-xl bg-amber-900/10 hover:bg-amber-900/20 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 border border-amber-900/25 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            title="Import Official UNESCO World Heritage XML (<query><row>...)"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">UNESCO XML</span>
          </button>

          {/* Segmented Switchboard: Plate Viewer vs Directory Grid */}
          <div className="inline-flex p-0.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shrink-0 shadow-inner">
            <button
              onClick={() => setViewMode('viewer')}
              className={`px-2.5 py-1 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'viewer'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <DynamicIcon
                icon="lucide:gallery-thumbnails"
                className={`w-3.5 h-3.5 shrink-0 ${
                  viewMode === 'viewer' ? 'text-amber-400 dark:text-amber-600' : 'text-stone-500'
                }`}
              />
              <span>Heritage Viewer</span>
            </button>

            <button
              onClick={() => setViewMode('directory')}
              className={`px-2.5 py-1 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'directory'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <DynamicIcon
                icon="fluent-mdl2:picture-tile"
                className={`w-3.5 h-3.5 shrink-0 ${
                  viewMode === 'directory' ? 'text-amber-400 dark:text-amber-600' : 'text-stone-500'
                }`}
              />
              <span>Grid ({illustrationsList.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area: Embedded ArchivalImageViewer or Directory Cards Grid */}
      {viewMode === 'viewer' ? (
        <div className="flex-1 w-full min-h-0 overflow-hidden relative">
          {activeIllustration ? (
            <ArchivalImageViewer
              illustration={activeIllustration}
              illustrationsList={illustrationsList}
              onSelectIllustration={item => setActiveIllustration(item)}
              onOpenModal={() => setInspectedModalIllustration(activeIllustration)}
              mode="embedded"
              showThumbnails={true}
              academiaVariant="unesco"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
              <Globe2 className="w-10 h-10 text-stone-400" />
              <p className="text-sm font-serif font-bold text-stone-800 dark:text-stone-200">
                No UNESCO World Heritage properties match your current filter.
              </p>
              <button
                onClick={() => {
                  setRegionFilter('All');
                  setCategoryFilter('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-amber-900 text-white text-xs font-mono font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-12">
            {illustrationsList.map(item => {
              const meta = item.unescoMeta!;
              const country = meta.entityId ? atlas.getEntity(meta.entityId) : undefined;
              const tonal = getCountryRegionTonalPalette(meta.entityId || 'EGY');

              return (
                <div
                  key={item.objectId}
                  onClick={() => {
                    setActiveIllustration(item);
                    setViewMode('viewer');
                  }}
                  className={`rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer group ${tonal.card.borderHover}`}
                >
                  {/* Thumbnail Preview */}
                  <div className="aspect-video w-full relative bg-stone-100 dark:bg-stone-950 overflow-hidden">
                    <img
                      src={item.imageUrls[0]}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/75 text-amber-300 font-mono text-[10px] font-bold backdrop-blur-xs">
                      WHC #{meta.idNumber} • {meta.region}
                    </div>
                    {meta.danger && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-rose-600/90 text-white font-mono text-[10px] font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>In Danger</span>
                      </div>
                    )}
                    {/* Photographer & License Pill on Thumbnail */}
                    <div className="absolute bottom-2.5 right-2.5 z-10 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-amber-300 font-mono text-[9px] font-bold flex items-center gap-1.5 border border-white/20 shadow-md">
                      <Camera className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate max-w-[120px] sm:max-w-[160px] text-stone-200">
                        {meta.photographer || 'UNESCO Photobank'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-stone-400" />
                      <span className="px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold text-[8.5px]">
                        {meta.license || 'CC BY-SA 3.0 IGO'}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-xl bg-stone-900/90 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-md">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open in Heritage Viewer</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                            meta.category === 'Cultural'
                              ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300'
                              : meta.category === 'Natural'
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                              : 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-200 dark:border-cyan-700 text-cyan-800 dark:text-cyan-300'
                          }`}
                        >
                          {meta.category} • {meta.criteriaTxt}
                        </span>
                        <div className="flex items-center gap-1 font-mono text-xs text-stone-500 dark:text-stone-400">
                          <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                          <span>{meta.dateInscribed}</span>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 leading-snug group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                        {meta.site}
                      </h3>

                      <p className="text-xs font-serif text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
                        {meta.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
                      {meta.entityId && country ? (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onSelectCountry(meta.entityId!);
                          }}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}
                        >
                          <CountryFlag entityId={meta.entityId} size="xs" />
                          <span className="truncate max-w-[140px]">{meta.states}</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono font-semibold text-stone-700 dark:text-stone-300 truncate max-w-[160px]">
                          {meta.states}
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500 truncate max-w-[170px]">
                        {meta.license && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-900/10 dark:bg-amber-400/10 text-amber-900 dark:text-amber-300 text-[9.5px] font-bold border border-amber-900/15 dark:border-amber-400/20">
                            {meta.license}
                          </span>
                        )}
                        <MapPin className="w-3 h-3 text-amber-700 dark:text-amber-400 shrink-0" />
                        <span className="truncate">{meta.location || meta.region}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fullscreen Loupe Modal when popped out */}
      <ArchivalLoupeModal
        illustration={inspectedModalIllustration}
        illustrationsList={illustrationsList}
        onSelectIllustration={item => {
          setInspectedModalIllustration(item);
          setActiveIllustration(item);
        }}
        onClose={() => setInspectedModalIllustration(null)}
        academiaVariant="unesco"
      />

      {/* UNESCO XML Ingestion Modal */}
      {isXmlModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsXmlModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-[#FAF8F5] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-4 text-left"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-900/10 dark:bg-amber-400/10 text-amber-900 dark:text-amber-400">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    Ingest Official UNESCO World Heritage XML
                  </h2>
                  <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
                    Automatically extracts all &lt;row&gt; entries for Africa &amp; Arab States with full metadata and image URLs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsXmlModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                <span className="text-xs font-mono text-stone-700 dark:text-stone-300">
                  Upload your UNESCO <code className="font-bold">.xml</code> file or paste the XML rows below:
                </span>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-mono font-bold cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose XML File</span>
                  <input
                    type="file"
                    accept=".xml,text/xml"
                    onChange={handleXmlFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <textarea
                value={xmlInputText}
                onChange={e => setXmlInputText(e.target.value)}
                rows={8}
                placeholder={`<query>\n  <row>\n    <id_number>86</id_number>\n    <site>Memphis and its Necropolis...</site>\n    <region>Arab States</region>\n    <image_url>https://whc.unesco.org/uploads/sites/site_86.jpg</image_url>\n  </row>\n</query>`}
                className="w-full p-3 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 font-mono text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />

              {xmlImportStatus && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                    xmlImportStatus.type === 'success'
                      ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {xmlImportStatus.type === 'success' ? (
                    <Check className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{xmlImportStatus.message}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => {
                  localStorage.removeItem(UNESCO_CUSTOM_XML_STORAGE_KEY);
                  setUnescoSites(INITIAL_UNESCO_HERITAGE_SITES);
                  setXmlImportStatus({
                    type: 'success',
                    message: 'Restored default curated Africa & Arab States registry.'
                  });
                }}
                className="text-xs font-mono text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 underline cursor-pointer"
              >
                Reset to Default Registry ({INITIAL_UNESCO_HERITAGE_SITES.length} sites)
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsXmlModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-mono font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleParseXmlSubmit}
                  disabled={!xmlInputText.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 disabled:opacity-40 text-white text-xs font-mono font-bold cursor-pointer"
                >
                  Extract Africa &amp; Arab States Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
