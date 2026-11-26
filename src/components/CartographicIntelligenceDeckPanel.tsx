import React from 'react';
import { m } from 'motion/react';
import {
  SlidersHorizontal,
  Globe,
  Landmark,
  Zap,
  MapPin,
  Layers,
  Columns,
  X,
  Eye,
  EyeOff,
  Grid,
  Compass,
  Droplet,
  SunMedium,
  Database,
  Quote,
  ExternalLink,
  Trees,
  Activity,
  Search,
  Maximize2,
  Check,
} from 'lucide-react';
import { AfricanRegion, AfriataAdmin1 } from '../data/types';
import { AFRICA_FINAL_MAP } from '../data/africaFinalGeometry';
import { SUBREGION_PILL_DEFS } from './InteractiveMapLegend';
import { CountryFlag } from './CountryFlag';
import { LayerVisibilityState } from './ThematicOverlaysLayer';
import { triggerHaptic } from '../utils/mobileHaptics';
import { atlasModalStore } from '../stores/useAtlasModalStore';

export type UnifiedDeckTab = 'both' | 'regions' | 'atlas' | 'flows' | 'inspector' | 'deck';

export interface RegionalBlocOption {
  id: string;
  name: string;
  shortName: string;
  count: number;
  members?: string[];
}

export interface ThematicDeckItemOption {
  key: keyof LayerVisibilityState;
  label: string;
  badge: string;
  count: number;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export interface CartographicIntelligenceDeckPanelProps {
  isFinalMode: boolean;
  unifiedDeckTab: UnifiedDeckTab;
  setUnifiedDeckTab: React.Dispatch<React.SetStateAction<UnifiedDeckTab>>;
  setIsUnifiedDeckOpen: (open: boolean) => void;
  setIsAdmin1InspectorOpen: (open: boolean) => void;
  visibleRegions: Set<AfricanRegion>;
  setActiveRegionHover: (region: AfricanRegion | null) => void;
  handleShowAllRegions: () => void;
  handleResetZoom: () => void;
  handleIsolateRegion: (region: AfricanRegion) => void;
  handleFocusRegion: (region: AfricanRegion) => void;
  handleToggleRegion: (region: AfricanRegion) => void;
  selectedBlocId: string;
  setSelectedBlocId: (id: string) => void;
  regionalBlocs: RegionalBlocOption[];
  showUnescoSites: boolean;
  handleToggleUnescoSites: () => void;
  unescoSitesCount: number;
  showAdmin1Borders: boolean;
  setShowAdmin1Borders: React.Dispatch<React.SetStateAction<boolean>>;
  showCriticalMinerals: boolean;
  handleToggleCriticalMinerals: () => void;
  showGraticuleAndCompass: boolean;
  setShowGraticuleAndCompass: React.Dispatch<React.SetStateAction<boolean>>;
  showCartouche: boolean;
  setShowCartouche: React.Dispatch<React.SetStateAction<boolean>>;
  showItcz: boolean;
  setShowItcz: React.Dispatch<React.SetStateAction<boolean>>;
  showSolarTerminator: boolean;
  setShowSolarTerminator: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCatalogueModalOpen: (open: boolean) => void;
  onNavigateToHeritage?: (siteId: number) => void;
  showPowerPlants: boolean;
  setShowPowerPlants: React.Dispatch<React.SetStateAction<boolean>>;
  showProtectedAreas: boolean;
  setShowProtectedAreas: React.Dispatch<React.SetStateAction<boolean>>;
  showThematicOverlays: boolean;
  setShowThematicOverlays: React.Dispatch<React.SetStateAction<boolean>>;
  admin1SearchQuery: string;
  setAdmin1SearchQuery: (query: string) => void;
  selectedEntityId?: string;
  filteredAdmin1List: AfriataAdmin1[];
  selectedAdmin1: AfriataAdmin1 | null;
  hoveredAdmin1: { id: string; name: string; countryId: string } | null;
  setHoveredAdmin1: (adm: { id: string; name: string; countryId: string } | null) => void;
  setHoveredEntityId: (id: string | null) => void;
  handleAdmin1Focus: (adm: AfriataAdmin1) => void;
  handleSetAllLayers: (enabled: boolean) => void;
  thematicDeckItems: ThematicDeckItemOption[];
  layerVisibility: LayerVisibilityState;
  handleToggleLayer: (key: keyof LayerVisibilityState) => void;
}

export const CartographicIntelligenceDeckPanel: React.FC<CartographicIntelligenceDeckPanelProps> = ({
  isFinalMode,
  unifiedDeckTab,
  setUnifiedDeckTab,
  setIsUnifiedDeckOpen,
  setIsAdmin1InspectorOpen,
  visibleRegions,
  setActiveRegionHover,
  handleShowAllRegions,
  handleResetZoom,
  handleIsolateRegion,
  handleFocusRegion,
  handleToggleRegion,
  selectedBlocId,
  setSelectedBlocId,
  regionalBlocs,
  showUnescoSites,
  handleToggleUnescoSites,
  unescoSitesCount,
  showAdmin1Borders,
  setShowAdmin1Borders,
  showCriticalMinerals,
  handleToggleCriticalMinerals,
  showGraticuleAndCompass,
  setShowGraticuleAndCompass,
  showCartouche,
  setShowCartouche,
  showItcz,
  setShowItcz,
  showSolarTerminator,
  setShowSolarTerminator,
  setIsCatalogueModalOpen,
  onNavigateToHeritage,
  showPowerPlants,
  setShowPowerPlants,
  showProtectedAreas,
  setShowProtectedAreas,
  showThematicOverlays,
  setShowThematicOverlays,
  admin1SearchQuery,
  setAdmin1SearchQuery,
  selectedEntityId,
  filteredAdmin1List,
  selectedAdmin1,
  hoveredAdmin1,
  setHoveredAdmin1,
  setHoveredEntityId,
  handleAdmin1Focus,
  handleSetAllLayers,
  thematicDeckItems,
  layerVisibility,
  handleToggleLayer,
}) => {
  return (
    <m.aside
      id="unified-cartographic-deck-panel"
      aria-label="Cartographic Intelligence Deck"
      initial={{ opacity: 0, y: -12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.985, transition: { duration: 0.14, ease: [0.4, 0, 1, 1] } }}
      transition={{ type: 'spring', stiffness: 520, damping: 34, mass: 0.5 }}
      className={`fixed inset-x-2 bottom-20 z-40 max-h-[66dvh] md:inset-x-auto md:bottom-auto md:absolute md:top-3 md:right-3 sm:md:right-4 md:max-h-[82vh] w-auto ${
        unifiedDeckTab === 'both'
          ? 'md:w-[760px] lg:w-[960px]'
          : 'md:w-[560px] lg:w-[680px]'
      } max-w-[calc(100vw-16px)] md:max-w-[calc(100vw-32px)] rounded-3xl bg-white/98 dark:bg-zinc-950/98 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl overflow-hidden flex flex-col`}
    >
      {/* Deck Header with WAI-ARIA Tablist & Close Control */}
      <div className="flex flex-wrap items-center justify-between px-3.5 sm:px-4 py-2.5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/60 gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-serif tracking-tight truncate">
              Cartographic Intelligence Deck
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono truncate">
              Regions, Overlays, Admin-1 Topology &amp; Citations
            </p>
          </div>
        </div>

        {/* Section Tabs & Close */}
        <div className="flex items-center gap-1.5 shrink-0 max-w-full overflow-x-auto scrollbar-none">
          <nav
            role="tablist"
            aria-label="Cartographic Deck Sections"
            onKeyDown={(e) => {
              const tabs: UnifiedDeckTab[] = isFinalMode
                ? ['regions', 'atlas', 'flows', 'inspector', 'deck', 'both']
                : ['regions', 'atlas'];
              const idx = tabs.indexOf(unifiedDeckTab);
              if (idx === -1) return;
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const nextIdx = e.key === 'ArrowRight'
                  ? (idx + 1) % tabs.length
                  : (idx - 1 + tabs.length) % tabs.length;
                const nextTab = tabs[nextIdx];
                setUnifiedDeckTab(nextTab);
                setIsUnifiedDeckOpen(true);
                setIsAdmin1InspectorOpen(nextTab === 'inspector');
                document.getElementById(`deck-tab-${nextTab}`)?.focus();
              }
            }}
            className="flex items-center bg-zinc-200/70 dark:bg-zinc-800/80 p-0.5 rounded-xl border border-zinc-300/60 dark:border-zinc-700/60 gap-0.5"
          >
            <button
              type="button"
              role="tab"
              id="deck-tab-regions"
              aria-selected={unifiedDeckTab === 'regions'}
              aria-controls="deck-panel-regions"
              tabIndex={unifiedDeckTab === 'regions' ? 0 : -1}
              onClick={() => {
                setUnifiedDeckTab('regions');
                setIsUnifiedDeckOpen(true);
                setIsAdmin1InspectorOpen(false);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                unifiedDeckTab === 'regions'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-emerald-300 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Globe className="w-3 h-3 text-emerald-500" />
              <span>Regions</span>
            </button>

            <button
              type="button"
              role="tab"
              id="deck-tab-atlas"
              aria-selected={unifiedDeckTab === 'atlas'}
              aria-controls="deck-panel-atlas"
              tabIndex={unifiedDeckTab === 'atlas' ? 0 : -1}
              onClick={() => {
                setUnifiedDeckTab('atlas');
                setIsUnifiedDeckOpen(true);
                setIsAdmin1InspectorOpen(false);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                unifiedDeckTab === 'atlas'
                  ? 'bg-white dark:bg-zinc-900 text-amber-800 dark:text-amber-300 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Landmark className="w-3 h-3 text-amber-500" />
              <span>Atlas</span>
            </button>

            {isFinalMode && (
              <button
                type="button"
                role="tab"
                id="deck-tab-flows"
                aria-selected={unifiedDeckTab === 'flows'}
                aria-controls="deck-panel-flows"
                tabIndex={unifiedDeckTab === 'flows' ? 0 : -1}
                onClick={() => {
                  setUnifiedDeckTab('flows');
                  setIsUnifiedDeckOpen(true);
                  setIsAdmin1InspectorOpen(false);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  unifiedDeckTab === 'flows'
                    ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Zap className="w-3 h-3 text-teal-500" />
                <span>Power &amp; Flows</span>
              </button>
            )}

            {isFinalMode && (
              <button
                type="button"
                role="tab"
                id="deck-tab-inspector"
                aria-selected={unifiedDeckTab === 'inspector'}
                aria-controls="deck-panel-inspector"
                tabIndex={unifiedDeckTab === 'inspector' ? 0 : -1}
                onClick={() => {
                  setUnifiedDeckTab('inspector');
                  setIsUnifiedDeckOpen(true);
                  setIsAdmin1InspectorOpen(true);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  unifiedDeckTab === 'inspector'
                    ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <MapPin className="w-3 h-3 text-emerald-500" />
                <span>Inspector</span>
              </button>
            )}

            {isFinalMode && (
              <button
                type="button"
                role="tab"
                id="deck-tab-deck"
                aria-selected={unifiedDeckTab === 'deck'}
                aria-controls="deck-panel-deck"
                tabIndex={unifiedDeckTab === 'deck' ? 0 : -1}
                onClick={() => {
                  setUnifiedDeckTab('deck');
                  setIsUnifiedDeckOpen(true);
                  setIsAdmin1InspectorOpen(false);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  unifiedDeckTab === 'deck'
                    ? 'bg-white dark:bg-zinc-900 text-cyan-700 dark:text-cyan-300 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3 h-3 text-cyan-500" />
                <span>Layers</span>
              </button>
            )}

            {isFinalMode && (
              <button
                type="button"
                role="tab"
                id="deck-tab-both"
                aria-selected={unifiedDeckTab === 'both'}
                aria-controls="deck-panel-both"
                tabIndex={unifiedDeckTab === 'both' ? 0 : -1}
                onClick={() => {
                  setUnifiedDeckTab('both');
                  setIsUnifiedDeckOpen(true);
                }}
                className={`hidden md:flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  unifiedDeckTab === 'both'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="2-Column Split View (Inspector &amp; Layers)"
              >
                <Columns className="w-3 h-3 text-amber-500" />
                <span>Split</span>
              </button>
            )}
          </nav>

          <button
            type="button"
            onClick={() => {
              setIsUnifiedDeckOpen(false);
              setIsAdmin1InspectorOpen(false);
            }}
            className="p-1.5 rounded-xl hover:bg-zinc-200/70 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer shrink-0"
            title="Close Deck"
            aria-label="Close Cartographic Intelligence Deck"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div
        className={`overflow-y-auto flex-1 ${
          unifiedDeckTab === 'both'
            ? 'grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200/80 dark:divide-zinc-800/80'
            : 'flex flex-col'
        }`}
      >
        {/* TAB: REGIONS & BLOCS */}
        {unifiedDeckTab === 'regions' && (
          <div
            role="tabpanel"
            id="deck-panel-regions"
            aria-labelledby="deck-tab-regions"
            className="p-4 space-y-5"
          >
            {/* UN M49 Sub-Regions */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    UN M49 Macro-Regions
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Click a region to focus &amp; zoom, or toggle its eye icon to layer visibility.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleShowAllRegions();
                    handleResetZoom();
                  }}
                  className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Show All 54
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUBREGION_PILL_DEFS.map(pill => {
                  const isAll = pill.id === 'All';
                  const regionId = pill.id as AfricanRegion;
                  const isVisible = isAll ? visibleRegions.size === 5 : visibleRegions.has(regionId);
                  const isIsolated = !isAll && visibleRegions.size === 1 && visibleRegions.has(regionId);

                  return (
                    <div
                      key={pill.id}
                      onMouseEnter={() => {
                        if (!isAll) setActiveRegionHover(regionId);
                      }}
                      onMouseLeave={() => {
                        if (!isAll) setActiveRegionHover(null);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all select-none ${
                        (isAll && visibleRegions.size === 5) || isIsolated
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-white shadow-sm'
                          : isVisible
                            ? 'bg-white dark:bg-zinc-900/70 text-zinc-800 dark:text-zinc-200 border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                            : 'bg-zinc-100/50 dark:bg-zinc-900/30 text-zinc-400 dark:text-zinc-500 border-zinc-200/50 dark:border-zinc-800/50 opacity-65'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          if (isAll) {
                            handleShowAllRegions();
                            handleResetZoom();
                          } else if (visibleRegions.size === 1 && visibleRegions.has(regionId)) {
                            handleShowAllRegions();
                            handleResetZoom();
                          } else {
                            handleIsolateRegion(regionId);
                            handleFocusRegion(regionId);
                          }
                        }}
                        className="flex items-center gap-2.5 flex-1 text-left cursor-pointer"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-white/40"
                          style={{ backgroundColor: pill.color }}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{pill.fullName || pill.label}</div>
                          <div className={`text-[10px] font-mono ${
                            (isAll && visibleRegions.size === 5) || isIsolated
                              ? 'text-zinc-300 dark:text-zinc-600'
                              : 'text-zinc-500 dark:text-zinc-400'
                          }`}>
                            {pill.count} sovereign states
                          </div>
                        </div>
                      </button>

                      {!isAll && (
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic('light');
                            handleToggleRegion(regionId);
                          }}
                          className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          title={isVisible ? `Hide ${pill.label}` : `Show ${pill.label}`}
                          aria-label={isVisible ? `Hide ${pill.label}` : `Show ${pill.label}`}
                        >
                          {isVisible ? (
                            <Eye className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regional Economic Blocs */}
            <div className="space-y-2.5 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    Regional Economic Communities (RECs)
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Highlight member states across African Union trade blocs.
                  </p>
                </div>
                {selectedBlocId !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => setSelectedBlocId('ALL')}
                    className="text-[11px] font-mono font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Clear Bloc
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {regionalBlocs.map(bloc => {
                  const isSelected = selectedBlocId === bloc.id;
                  return (
                    <button
                      key={bloc.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedBlocId(bloc.id);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-zinc-50/80 dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold truncate">{bloc.shortName}</div>
                        <div className={`text-[10px] truncate ${isSelected ? 'text-emerald-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
                          {bloc.name}
                        </div>
                      </div>
                      <span className={`text-[11px] font-mono font-bold shrink-0 ${
                        isSelected ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'
                      }`}>
                        {bloc.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: ATLAS, HERITAGE, CARTOGRAPHY & CITATION */}
        {unifiedDeckTab === 'atlas' && (
          <div
            role="tabpanel"
            id="deck-panel-atlas"
            aria-labelledby="deck-tab-atlas"
            className="p-4 space-y-5"
          >
            {/* Boundaries, Heritage & Minerals */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Sovereign Topology, Heritage &amp; Resources
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {isFinalMode && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      handleToggleUnescoSites();
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      showUnescoSites
                        ? 'bg-amber-500/12 border-amber-500/40 text-zinc-900 dark:text-zinc-100'
                        : 'bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <Landmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">UNESCO Heritage Sites</div>
                        <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                          {unescoSitesCount} inscribed properties
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${showUnescoSites ? 'text-amber-700 dark:text-amber-400' : 'text-zinc-400'}`}>
                      {showUnescoSites ? 'ON' : 'OFF'}
                    </span>
                  </button>
                )}

                {isFinalMode && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setShowAdmin1Borders(prev => !prev);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      showAdmin1Borders
                        ? 'bg-emerald-500/12 border-emerald-500/40 text-zinc-900 dark:text-zinc-100'
                        : 'bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">Admin-1 Subdivisions</div>
                        <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                          1,017 internal boundaries
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${showAdmin1Borders ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-400'}`}>
                      {showAdmin1Borders ? 'ON' : 'OFF'}
                    </span>
                  </button>
                )}

                {isFinalMode && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      handleToggleCriticalMinerals();
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      showCriticalMinerals
                        ? 'bg-emerald-500/12 border-emerald-500/40 text-zinc-900 dark:text-zinc-100'
                        : 'bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">Critical Minerals Layer</div>
                        <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                          Strategic beneficiation nodes
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${showCriticalMinerals ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-400'}`}>
                      {showCriticalMinerals ? 'ON' : 'OFF'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Cartographic Framing & Geodesy */}
            <div className="space-y-2.5 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Cartographic Grid &amp; Geodesy Overlays
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowGraticuleAndCompass(prev => !prev)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    showGraticuleAndCompass
                      ? 'bg-sky-500/12 border-sky-500/40 text-zinc-900 dark:text-zinc-100'
                      : 'bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs font-bold">
                    <Grid className="w-3.5 h-3.5 text-sky-500" />
                    Graticule
                  </span>
                  <span className="text-[10px] font-mono font-bold">{showGraticuleAndCompass ? 'ON' : 'OFF'}</span>
                </button>

                {isFinalMode && (
                  <button
                    type="button"
                    onClick={() => setShowCartouche(prev => !prev)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      showCartouche
                        ? 'bg-emerald-500/12 border-emerald-500/40 text-zinc-900 dark:text-zinc-100'
                        : 'bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-xs font-bold">
                      <Compass className="w-3.5 h-3.5 text-emerald-500" />
                      Cartouche Overlay
                    </span>
                    <span className="text-[10px] font-mono font-bold">{showCartouche ? 'ON' : 'OFF'}</span>
                  </button>
                )}

                {isFinalMode && (
                  <button
                    type="button"
                    onClick={() => setShowItcz(prev => !prev)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      showItcz
                        ? 'bg-cyan-500/12 border-cyan-500/40 text-zinc-900 dark:text-zinc-100'
                        : 'bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-xs font-bold">
                      <Droplet className="w-3.5 h-3.5 text-cyan-500" />
                      ITCZ Monsoon
                    </span>
                    <span className="text-[10px] font-mono font-bold">{showItcz ? 'ON' : 'OFF'}</span>
                  </button>
                )}

                {isFinalMode && (
                  <button
                    type="button"
                    onClick={() => setShowSolarTerminator(prev => !prev)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      showSolarTerminator
                        ? 'bg-amber-500/12 border-amber-500/40 text-zinc-900 dark:text-zinc-100'
                        : 'bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-xs font-bold">
                      <SunMedium className="w-3.5 h-3.5 text-amber-500" />
                      Solar Terminator
                    </span>
                    <span className="text-[10px] font-mono font-bold">{showSolarTerminator ? 'ON' : 'OFF'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Catalogues, Colophon & Academic Citation */}
            <div className="space-y-2.5 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Registries, Colophon &amp; Citation
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatalogueModalOpen(true)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-900 dark:text-cyan-200 border border-cyan-500/30 text-left transition-all cursor-pointer"
                >
                  <Database className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">AKP Registry</div>
                    <div className="text-[10px] opacity-75 truncate">241-Dataset Index</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => atlasModalStore.openColophon()}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30 text-left transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">Colophon</div>
                    <div className="text-[10px] opacity-75 truncate">Geodesy &amp; Specs</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    atlasModalStore.openAcademicExport({
                      title: 'Africa Data Atlas & Cartographic Observatory',
                      sourceContext: 'High-Precision Continental Vector Cartography (5,796 × 5,867 Grid)',
                    })
                  }
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30 text-left transition-all cursor-pointer"
                >
                  <Quote className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">Cite (DOI)</div>
                    <div className="text-[10px] opacity-75 truncate">BibTeX · CFF · RIS</div>
                  </div>
                </button>
              </div>

              {onNavigateToHeritage && (
                <button
                  type="button"
                  onClick={() => onNavigateToHeritage(18)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-stone-200/80 dark:border-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                >
                  <span>Open Full UNESCO World Heritage Archive</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB: CLEAN POWER, RESERVES & CONTINENTAL FLOWS */}
        {unifiedDeckTab === 'flows' && isFinalMode && (
          <div
            role="tabpanel"
            id="deck-panel-flows"
            aria-labelledby="deck-tab-flows"
            className="p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  Clean Power, Reserves &amp; Continental Flows
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Toggle EC AKP energy infrastructure, biosphere sanctuaries, and animated trade arteries.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUnifiedDeckTab('deck')}
                className="text-[11px] font-mono font-semibold text-cyan-700 dark:text-cyan-400 hover:underline cursor-pointer shrink-0"
              >
                9-Layer Deck →
              </button>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setShowPowerPlants(prev => !prev);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  showPowerPlants
                    ? 'bg-amber-500/12 border-amber-500/40 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold">Clean Power &amp; Hydroelectric Dams</div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      European Commission AKP renewable stations, solar complexes &amp; major dams
                    </div>
                  </div>
                </div>
                <span className={`text-[11px] font-mono font-bold ml-3 shrink-0 ${
                  showPowerPlants ? 'text-amber-700 dark:text-amber-400' : 'text-zinc-400'
                }`}>
                  {showPowerPlants ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setShowProtectedAreas(prev => !prev);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  showProtectedAreas
                    ? 'bg-emerald-500/12 border-emerald-500/40 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Trees className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold">Protected Biosphere Reserves</div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      BIOPAMA ecological sanctuaries, national parks &amp; conservation corridors
                    </div>
                  </div>
                </div>
                <span className={`text-[11px] font-mono font-bold ml-3 shrink-0 ${
                  showProtectedAreas ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-400'
                }`}>
                  {showProtectedAreas ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setShowThematicOverlays(prev => !prev);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  showThematicOverlays
                    ? 'bg-cyan-500/12 border-cyan-500/40 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold">Animated Continental Flows &amp; Corridors</div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      Subsea fiber optics, power pool interconnects &amp; metropolitan pulse nodes
                    </div>
                  </div>
                </div>
                <span className={`text-[11px] font-mono font-bold ml-3 shrink-0 ${
                  showThematicOverlays ? 'text-cyan-700 dark:text-cyan-400' : 'text-zinc-400'
                }`}>
                  {showThematicOverlays ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Column 1: Admin-1 Subdivisions Inspector */}
        {(unifiedDeckTab === 'both' || unifiedDeckTab === 'inspector') && (
          <div
            role="tabpanel"
            id="deck-panel-inspector"
            aria-labelledby="deck-tab-inspector"
            className="flex flex-col min-w-0"
          >
            <div className="p-2.5 sm:p-3 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/40">
              <div className="relative flex items-center mb-1.5">
                <Search className="absolute left-2.5 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search state, province, or region..."
                  value={admin1SearchQuery}
                  onChange={(e) => setAdmin1SearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 text-xs font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                {admin1SearchQuery && (
                  <button
                    type="button"
                    onClick={() => setAdmin1SearchQuery('')}
                    className="absolute right-2 p-0.5 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 px-1">
                <span className="truncate mr-2">
                  {selectedEntityId ? (AFRICA_FINAL_MAP[selectedEntityId]?.name || selectedEntityId) : 'All African Territories'}
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                  {filteredAdmin1List.length} subdivision{filteredAdmin1List.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <div className="overflow-y-auto p-2 space-y-1.5 max-h-[50vh]">
              {filteredAdmin1List.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  No subdivisions match &ldquo;{admin1SearchQuery}&rdquo;.
                </div>
              ) : (
                filteredAdmin1List.map((adm) => {
                  const isAdmSelected = selectedAdmin1?.id === adm.id;
                  const isAdmHovered = hoveredAdmin1?.id === adm.id;
                  return (
                    <div
                      key={adm.id}
                      onMouseEnter={() => {
                        setHoveredAdmin1({ id: adm.id, name: adm.name, countryId: adm.iso3 || '' });
                        setHoveredEntityId(adm.iso3 || null);
                      }}
                      onMouseLeave={() => {
                        setHoveredAdmin1(null);
                      }}
                      onClick={() => handleAdmin1Focus(adm)}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                        isAdmSelected
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-xs'
                          : isAdmHovered
                          ? 'bg-zinc-100/90 dark:bg-zinc-900/90 border-emerald-500/40 text-zinc-900 dark:text-zinc-100'
                          : 'bg-white/60 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CountryFlag entityId={adm.iso3 || ''} size="xs" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate leading-tight">{adm.name}</p>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                            {adm.countryName} ({adm.iso3})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
                          {adm.admin1Code || adm.id}
                        </span>
                        <div className={`p-1 rounded-lg ${isAdmSelected ? 'bg-emerald-600 text-white' : 'text-zinc-400'}`}>
                          <Maximize2 className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Column 2: Thematic Layer Deck */}
        {(unifiedDeckTab === 'both' || unifiedDeckTab === 'deck') && (
          <div
            role="tabpanel"
            id="deck-panel-deck"
            aria-labelledby="deck-tab-deck"
            className="flex flex-col min-w-0 p-3 sm:p-4 bg-zinc-50/50 dark:bg-zinc-900/30"
          >
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  Cartographic Overlays
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleSetAllLayers(true);
                    setShowPowerPlants(true);
                    setShowProtectedAreas(true);
                  }}
                  className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 underline cursor-pointer"
                >
                  All On
                </button>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <button
                  type="button"
                  onClick={() => {
                    handleSetAllLayers(false);
                    setShowPowerPlants(false);
                    setShowProtectedAreas(false);
                  }}
                  className="text-[10px] font-mono font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 underline cursor-pointer"
                >
                  All Off
                </button>
              </div>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[50vh] pr-0.5">
              {thematicDeckItems.map((item) => {
                const active = Boolean(layerVisibility[item.key]);
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    onClick={() => handleToggleLayer(item.key)}
                    className={`flex items-center justify-between p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                      active
                        ? 'bg-cyan-50/70 dark:bg-cyan-950/30 border-cyan-500/40 text-zinc-900 dark:text-zinc-100 shadow-xs'
                        : 'bg-white/60 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 opacity-70 hover:opacity-100 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}40` }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1.5">
                          {item.label}
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {item.count}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{item.badge}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {active ? (
                        <div className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center justify-center">
                          <EyeOff className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
              <button
                type="button"
                onClick={() => setIsCatalogueModalOpen(true)}
                className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Database className="w-3 h-3" />
                <span>AKP Registry Modal</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsUnifiedDeckOpen(false);
                  setIsAdmin1InspectorOpen(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-[10px] font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </m.aside>
  );
};

export default CartographicIntelligenceDeckPanel;
