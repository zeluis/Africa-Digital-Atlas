import React, { useEffect, useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Map as MapIcon, 
  BarChart3, 
  Layers, 
  BookOpen, 
  Anchor, 
  GitCompare, 
  Database, 
  Globe2, 
  Languages as LanguagesIcon, 
  Landmark, 
  Grid3X3, 
  Boxes,
  Dna,
  Scale,
  TrendingDown,
  ChevronDown,
  ChevronRight,
  Sparkles,
  FileText,
  ExternalLink,
  X,
  TrendingUp,
  Cpu,
  PanelLeftClose
} from 'lucide-react';
import { UN_REGIONAL_SILHOUETTES } from '../data/svgGeographySystem';
import { AfricanRegion } from '../data/types';
import { getRegionTonalPalette } from '../data/unGeoschemeColors';
import { getCategorizedReports, NavReportGroup } from '../data/reportsDataLoader';
import { DynamicIcon } from './DynamicIcon';
import { AfricaUnLogo } from './AfricaUnLogo';

export type MainNavId = 
  | 'overview'
  | 'explore'
  | 'slave-trade'
  | 'molecular-legacies'
  | 'african-development-foundations'
  | 'pillars'
  | 'blocs'
  | 'regions'
  | 'analytics'
  | 'map'
  | 'languages'
  | 'heritage'
  | 'ethnic-tree'
  | 'research-directory'
  | 'report-genetic-linguistic-blueprints'
  | 'report-genetic-social-structure-cape-verde'
  | 'report-creole-admixture-cabo-verde'
  | 'report-latest-developments-genetic-legacy'
  | 'report-slavery-international-law-reparatory'
  | 'report-sovereign-responsibility-reparations'
  | 'report-reparations-debt-anthropocene'
  | 'report-ancestry-ideology-underdevelopment'
  | 'report-rao-model-socioeconomic'
  | 'report-sociological-origins-racism'
  | 'privacy'
  | (string & {});

export type RegionNavId = 
  | 'region-northern'
  | 'region-western'
  | 'region-central'
  | 'region-eastern'
  | 'region-southern';

export type SecondaryNavId = 
  | 'countries'
  | 'compare'
  | 'provenance';

export type CanonicalNavTab = MainNavId | RegionNavId | SecondaryNavId;

interface NavigationDrawerProps {
  currentTab: CanonicalNavTab;
  onSelectTab: (tab: CanonicalNavTab) => void;
  isDesktopOpen: boolean;
  onToggleDesktop?: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenOnboarding?: () => void;
}

interface NavItemDef {
  id: CanonicalNavTab;
  labelKey: string;
  defaultLabel: string;
  renderIcon: (isActive: boolean) => React.ReactNode;
}

export type SubmenuKey = 'explore' | 'history' | 'reports' | 'regions' | 'analytics';

const ACTIVE_SUBMENU_STORAGE_KEY = 'african_geography_active_submenu_key';

const MD3_STANDARD_EASE: [number, number, number, number] = [0.2, 0, 0, 1];

const submenuContainerVariants = {
  hidden: { 
    opacity: 0, 
    height: 0,
    transition: {
      duration: 0.2,
      ease: MD3_STANDARD_EASE
    }
  },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: {
      duration: 0.25,
      ease: MD3_STANDARD_EASE,
      staggerChildren: 0.04,
      delayChildren: 0.02
    }
  }
};

const submenuItemVariants = {
  hidden: { 
    opacity: 0, 
    y: -5 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.2,
      ease: MD3_STANDARD_EASE
    }
  }
};

const REGION_ID_TO_NAME: Record<RegionNavId, AfricanRegion> = {
  'region-northern': 'Northern Africa',
  'region-western': 'Western Africa',
  'region-central': 'Central Africa',
  'region-eastern': 'Eastern Africa',
  'region-southern': 'Southern Africa'
};

const getActiveSubmenuFromTab = (tab: CanonicalNavTab): SubmenuKey | null => {
  if (tab === 'explore' || tab === 'pillars' || tab === 'blocs' || tab === 'heritage') return 'explore';
  if (tab === 'slave-trade' || tab === 'molecular-legacies' || tab === 'african-development-foundations' || tab === 'ethnic-tree') return 'history';
  if (tab === 'research-directory' || (typeof tab === 'string' && tab.startsWith('report-'))) return 'reports';
  if (tab === 'regions' || tab === 'languages') return 'regions';
  if (tab === 'analytics' || tab === 'map') return 'analytics';
  return null;
};

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  currentTab,
  onSelectTab,
  isDesktopOpen,
  onToggleDesktop,
  isMobileOpen,
  onCloseMobile,
  onOpenOnboarding
}) => {
  const { t } = useTranslation();

  // Determine if current page triggers auto-collapse rail mode on desktop
  const isAutoCollapsePage = currentTab === 'ethnic-tree' || currentTab === 'map';
  const [isDrawerHovered, setIsDrawerHovered] = useState(false);

  // Active group detections
  const isExploreGroupActive = currentTab === 'explore' || currentTab === 'pillars' || currentTab === 'blocs' || currentTab === 'heritage';
  const isHistoricalLegaciesGroupActive = 
    currentTab === 'slave-trade' || 
    currentTab === 'molecular-legacies' || 
    currentTab === 'african-development-foundations' || 
    currentTab === 'ethnic-tree';
  const isReportsGroupActive = 
    currentTab === 'research-directory' || 
    (typeof currentTab === 'string' && currentTab.startsWith('report-'));
  const isRegionsGroupActive = currentTab === 'regions' || currentTab === 'languages';
  const isAnalyticsGroupActive = currentTab === 'analytics' || currentTab === 'map';

  // Strictly single open submenu at any time
  const [openSubmenu, setOpenSubmenu] = useState<SubmenuKey | null>(() => {
    const tabSubmenu = getActiveSubmenuFromTab(currentTab);
    if (tabSubmenu) return tabSubmenu;
    try {
      const stored = localStorage.getItem(ACTIVE_SUBMENU_STORAGE_KEY) as SubmenuKey | null;
      if (stored && ['explore', 'history', 'reports', 'regions', 'analytics'].includes(stored)) {
        return stored;
      }
    } catch {}
    return 'history'; // default single open submenu
  });

  // Automatically keep parent accordion in sync with current selected tab
  useEffect(() => {
    const activeSubmenu = getActiveSubmenuFromTab(currentTab);
    if (activeSubmenu) {
      setOpenSubmenu(activeSubmenu);
      try { localStorage.setItem(ACTIVE_SUBMENU_STORAGE_KEY, activeSubmenu); } catch {}
    }
  }, [currentTab]);

  const openSubmenuExclusively = (menuKey: SubmenuKey) => {
    setOpenSubmenu(menuKey);
    try { localStorage.setItem(ACTIVE_SUBMENU_STORAGE_KEY, menuKey); } catch {}
  };

  const toggleSubmenuExclusively = (menuKey: SubmenuKey) => {
    setOpenSubmenu(prev => {
      const next = prev === menuKey ? null : menuKey;
      try {
        if (next) {
          localStorage.setItem(ACTIVE_SUBMENU_STORAGE_KEY, next);
        } else {
          localStorage.removeItem(ACTIVE_SUBMENU_STORAGE_KEY);
        }
      } catch {}
      return next;
    });
  };

  const isExploreExpanded = openSubmenu === 'explore';
  const isHistoricalLegaciesExpanded = openSubmenu === 'history';
  const isReportsExpanded = openSubmenu === 'reports';
  const isRegionsExpanded = openSubmenu === 'regions';
  const isAnalyticsExpanded = openSubmenu === 'analytics';

  // Helper to render Region SVG Silhouettes with UN Geoscheme brand colors (in vein of AfricaUnLogo)
  const renderRegionSilhouetteIcon = (regionId: RegionNavId, isActive: boolean) => {
    const regionName = REGION_ID_TO_NAME[regionId];
    const sil = UN_REGIONAL_SILHOUETTES[regionName];
    const tonal = getRegionTonalPalette(regionName);
    if (!sil) return null;

    // UN Geoscheme official base/brand colors (in vein of AfricaUnLogo)
    const regionColors: Record<AfricanRegion, { fill: string; stroke: string }> = {
      'Northern Africa': { fill: '#2563EB', stroke: '#1D4ED8' },
      'Western Africa': { fill: '#16A34A', stroke: '#15803D' },
      'Central Africa': { fill: '#C026D3', stroke: '#A21CAF' },
      'Eastern Africa': { fill: '#EAB308', stroke: '#CA8A04' },
      'Southern Africa': { fill: '#DC2626', stroke: '#B91C1C' },
    };

    const colorConfig = regionColors[regionName] || { fill: tonal.warmAccent, stroke: tonal.warmAccent };

    if (isActive) {
      return (
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm"
          style={{
            backgroundColor: `${colorConfig.fill}24`,
            border: `1.5px solid ${colorConfig.fill}70`,
            boxShadow: `0 2px 8px ${colorConfig.fill}33`
          }}
        >
          <svg
            viewBox={sil.viewBox}
            className="w-5 h-5 shrink-0 transition-transform duration-300 ease-out select-none scale-105 drop-shadow-xs"
            style={{ color: colorConfig.fill }}
            fill={colorConfig.fill}
            stroke={colorConfig.stroke}
            strokeWidth={1.8}
            strokeLinejoin="round"
            strokeLinecap="round"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d={sil.primaryPath} />
          </svg>
        </div>
      );
    }

    // Inactive state: icon stands completely by itself (no container box or background) with smooth scale on hover
    return (
      <div className="w-8 h-8 flex items-center justify-center shrink-0">
        <svg
          viewBox={sil.viewBox}
          className="w-5.5 h-5.5 shrink-0 transition-transform duration-200 ease-out select-none group-hover:scale-115"
          style={{ color: colorConfig.fill }}
          fill={colorConfig.fill}
          fillOpacity={0.85}
          stroke={colorConfig.stroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d={sil.primaryPath} />
        </svg>
      </div>
    );
  };

  // Submenu items for Explore (Concise style with African Nations)
  const exploreSubItems = [
    { id: 'explore', label: 'African Nations', icon: Compass, badge: '54 Nations' },
    { id: 'pillars', label: 'Thematic Pillars', icon: Grid3X3, badge: 'Framework' },
    { id: 'blocs', label: 'Regional Blocs', icon: Boxes, badge: 'AU, ECOWAS, EAC' },
    { id: 'heritage', label: 'Heritage Sites', icon: Landmark, badge: 'UNESCO' }
  ];

  // Submenu items for History (Ultra-Minimal style)
  const historicalLegaciesSubItems = [
    { id: 'slave-trade', label: 'Voyages', icon: Anchor, badge: 'Voyages Flow' },
    { id: 'molecular-legacies', label: 'Genetics', icon: Dna, badge: 'Monograph' },
    { id: 'african-development-foundations', label: 'Foundations', icon: 'fluent-mdl2:knowledge-article', badge: 'Treatise' },
    { id: 'ethnic-tree', label: 'Ethnic Tree', icon: 'mdi:family-tree', badge: 'Transatlantic' }
  ];

  // Submenu items for Regions (Ultra-Minimal style)
  const regionsSubItems = [
    { id: 'regions', label: 'Matrix', icon: Globe2, badge: 'Comparative' },
    { id: 'languages', label: 'Languages', icon: LanguagesIcon, badge: '2,000+ Phyla' }
  ];

  // Submenu items for Analytics (Ultra-Minimal style)
  const analyticsSubItems = [
    { id: 'analytics', label: 'Benchmarks', icon: BarChart3, badge: 'Time-series' },
    { id: 'map', label: 'Map', icon: MapIcon, badge: 'Spatial GIS' }
  ];

  // Dynamic submenu categorized items for Reports (from static + drop-in markdown + custom)
  const reportsSubGroups = React.useMemo(() => getCategorizedReports(), []);
  const totalReportsCount = React.useMemo(() => {
    return reportsSubGroups.reduce((acc, group) => {
      // Exclude overview/directory item from count to show actual reports count
      const count = group.categoryKey === 'overview' ? 0 : group.items.length;
      return acc + count;
    }, 0);
  }, [reportsSubGroups]);

  // Section 2: Regions - Using Regional SVG Silhouettes
  const regionNavItems: NavItemDef[] = [
    {
      id: 'region-northern',
      labelKey: 'nav.northern_africa',
      defaultLabel: 'Northern Africa',
      renderIcon: (isActive) => renderRegionSilhouetteIcon('region-northern', isActive)
    },
    {
      id: 'region-western',
      labelKey: 'nav.western_africa',
      defaultLabel: 'Western Africa',
      renderIcon: (isActive) => renderRegionSilhouetteIcon('region-western', isActive)
    },
    {
      id: 'region-central',
      labelKey: 'nav.central_africa',
      defaultLabel: 'Central Africa',
      renderIcon: (isActive) => renderRegionSilhouetteIcon('region-central', isActive)
    },
    {
      id: 'region-eastern',
      labelKey: 'nav.eastern_africa',
      defaultLabel: 'Eastern Africa',
      renderIcon: (isActive) => renderRegionSilhouetteIcon('region-eastern', isActive)
    },
    {
      id: 'region-southern',
      labelKey: 'nav.southern_africa',
      defaultLabel: 'Southern Africa',
      renderIcon: (isActive) => renderRegionSilhouetteIcon('region-southern', isActive)
    }
  ];

  // Lock background page scroll on mobile when sheet is open
  useEffect(() => {
    if (isMobileOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isMobileOpen]);

  const navContent = (isMobile: boolean = false) => {
    const isDesktopCollapsed = !isMobile && isAutoCollapsePage && !isDrawerHovered;

    return (
      <div className="flex flex-col h-full justify-between pb-6">
        <div className="space-y-6">
          {/* Optional Desktop Drawer Header with tucked collapse button */}
          {!isMobile && onToggleDesktop && (
            <div className={`flex items-center justify-between pb-2 mb-1 border-b border-zinc-100 dark:border-zinc-800/80 ${
              isDesktopCollapsed ? 'px-1 justify-center' : 'px-3'
            }`}>
              {!isDesktopCollapsed && (
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Navigation
                </span>
              )}
              <button
                onClick={onToggleDesktop}
                className="p-1.5 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                title="Collapse Navigation Drawer (⌘B)"
                aria-label="Collapse Navigation Drawer"
              >
                <DynamicIcon icon="codicon:layout-sidebar-left-dock" className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Section 1: AFRICA */}
          <div>
            {isDesktopCollapsed ? (
              <div className="my-2 mx-auto w-6 h-px bg-zinc-200 dark:bg-zinc-800" />
            ) : (
              <div className="px-4 mb-2">
                <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {t('nav.africa', 'AFRICA')}
                </h3>
              </div>
            )}

            <div className="space-y-1">
              {/* 1. Overview (Single Link, untouched) */}
              <button
                onClick={() => {
                  onSelectTab('overview');
                  if (isMobile) onCloseMobile();
                }}
                title={t('nav.overview', 'Overview')}
                className={`relative w-full flex items-center ${
                  isDesktopCollapsed ? 'justify-center p-2.5' : 'justify-between py-2.5 px-3.5 text-sm'
                } text-left rounded-2xl transition-all cursor-pointer group ${
                  currentTab === 'overview'
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/25 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <AfricaUnLogo
                    variant="warm-tonal"
                    fillOpacity={0.6}
                    interactive={false}
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      currentTab === 'overview'
                        ? 'text-emerald-500 stroke-emerald-500'
                        : 'text-zinc-500 group-hover:text-zinc-300 stroke-zinc-500 group-hover:stroke-zinc-300'
                    }`}
                    strokeColor="currentColor"
                    strokeWidth={1.8}
                  />
                  {!isDesktopCollapsed && <span>{t('nav.overview', 'Overview')}</span>}
                </div>
                {!isDesktopCollapsed && currentTab === 'overview' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>

              {/* 2. Explore (Collapsible Accordion: Directory Overview, 8 Pillars, 21 Blocs) */}
              <div className="pt-0.5">
                <button
                  onClick={() => {
                    openSubmenuExclusively('explore');
                    onSelectTab(exploreSubItems[0].id as CanonicalNavTab);
                    if (isMobile) onCloseMobile();
                  }}
                  title={t('nav.explore', 'Explore')}
                  className={`relative w-full flex items-center ${
                    isDesktopCollapsed ? 'justify-center p-2.5' : 'justify-between py-2.5 px-3.5 text-sm'
                  } text-left rounded-2xl transition-all cursor-pointer group ${
                    isExploreGroupActive
                      ? 'bg-blue-500/10 dark:bg-blue-500/15 text-blue-800 dark:text-blue-300 font-bold border border-blue-500/25'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <Compass className={`w-5 h-5 shrink-0 ${isExploreGroupActive ? 'text-blue-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    {!isDesktopCollapsed && <span>{t('nav.explore', 'Explore')}</span>}
                  </div>
                  {!isDesktopCollapsed && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubmenuExclusively('explore');
                      }}
                      className="flex items-center gap-1.5 p-1 -mr-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      title={isExploreExpanded ? "Collapse Explore submenu" : "Expand Explore submenu"}
                    >
                      <span className="text-[10px] font-mono text-zinc-400 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                        {exploreSubItems.length}
                      </span>
                      {isExploreExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                    </div>
                  )}
                </button>

                {!isDesktopCollapsed && (
                  <AnimatePresence initial={false}>
                    {isExploreExpanded && (
                      <motion.div
                        variants={submenuContainerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="overflow-hidden ml-4 pl-3 border-l-2 border-zinc-200 dark:border-zinc-800/80 space-y-1 my-1.5"
                      >
                        {exploreSubItems.map(sub => {
                          const SubIcon = sub.icon;
                          const isSubActive = currentTab === sub.id;
                          return (
                            <motion.div key={sub.id} variants={submenuItemVariants}>
                              <button
                                onClick={() => {
                                  onSelectTab(sub.id as CanonicalNavTab);
                                  if (isMobile) onCloseMobile();
                                }}
                                className={`relative w-full flex items-center justify-between text-left rounded-xl transition-all cursor-pointer px-3 py-2 text-xs group ${
                                  isSubActive
                                    ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                                  <SubIcon className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                                  <div className="flex flex-col min-w-0">
                                    <span className="truncate">{sub.label}</span>
                                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate">{sub.badge}</span>
                                  </div>
                                </div>
                                {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
                              </button>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* 3. Historical Legacies (TAST) (Dedicated Main Menu Accordion with Submenu) */}
              <div className="pt-0.5">
                <button
                  onClick={() => {
                    openSubmenuExclusively('history');
                    onSelectTab(historicalLegaciesSubItems[0].id as CanonicalNavTab);
                    if (isMobile) onCloseMobile();
                  }}
                  title={t('nav.history', 'History')}
                  className={`relative w-full flex items-center ${
                    isDesktopCollapsed ? 'justify-center p-2.5' : 'justify-between py-2.5 px-3.5 text-sm'
                  } text-left rounded-2xl transition-all cursor-pointer group ${
                    isHistoricalLegaciesGroupActive
                      ? 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/25'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <Anchor className={`w-5 h-5 shrink-0 ${isHistoricalLegaciesGroupActive ? 'text-amber-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    {!isDesktopCollapsed && <span className="truncate">{t('nav.history', 'History')}</span>}
                  </div>
                  {!isDesktopCollapsed && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubmenuExclusively('history');
                      }}
                      className="flex items-center gap-1.5 p-1 -mr-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      title={isHistoricalLegaciesExpanded ? "Collapse History submenu" : "Expand History submenu"}
                    >
                      <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                        {historicalLegaciesSubItems.length}
                      </span>
                      {isHistoricalLegaciesExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                    </div>
                  )}
                </button>

                {!isDesktopCollapsed && (
                  <AnimatePresence initial={false}>
                    {isHistoricalLegaciesExpanded && (
                      <motion.div
                        variants={submenuContainerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="overflow-hidden ml-4 pl-3 border-l-2 border-amber-300/40 dark:border-amber-500/30 space-y-1 my-1.5"
                      >
                        {historicalLegaciesSubItems.map(sub => {
                          const isSubActive = currentTab === sub.id;
                          return (
                            <motion.div key={sub.id} variants={submenuItemVariants}>
                              <button
                                onClick={() => {
                                  onSelectTab(sub.id as CanonicalNavTab);
                                  if (isMobile) onCloseMobile();
                                }}
                                className={`relative w-full flex items-center justify-between text-left rounded-xl transition-all cursor-pointer px-3 py-2 text-xs group ${
                                  isSubActive
                                    ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                                  {typeof sub.icon === 'string' ? (
                                    <DynamicIcon icon={sub.icon} className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                                  ) : (
                                    (() => {
                                      const SubIconComponent = sub.icon as any;
                                      return <SubIconComponent className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />;
                                    })()
                                  )}
                                  <div className="flex flex-col min-w-0">
                                    <span className="truncate">{t(`report.title.${sub.id}`, sub.label)}</span>
                                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate">{sub.badge}</span>
                                  </div>
                                </div>
                                {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                              </button>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* 4. Research & Reports (Collapsible Accordion with Topics: Genetics, International Law, Development) */}
              <div className="pt-0.5">
                <button
                  onClick={() => {
                    openSubmenuExclusively('reports');
                    onSelectTab(reportsSubGroups[0].items[0].id as CanonicalNavTab);
                    if (isMobile) onCloseMobile();
                  }}
                  title={t('nav.reports', 'Reports')}
                  className={`relative w-full flex items-center ${
                    isDesktopCollapsed ? 'justify-center p-2.5' : 'justify-between py-2.5 px-3.5 text-sm'
                  } text-left rounded-2xl transition-all cursor-pointer group ${
                    isReportsGroupActive
                      ? 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 font-bold border border-indigo-500/25'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <DynamicIcon icon="lucide:book-open-text" className={`w-5 h-5 shrink-0 ${isReportsGroupActive ? 'text-indigo-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    {!isDesktopCollapsed && <span>{t('nav.reports', 'Reports')}</span>}
                  </div>
                  {!isDesktopCollapsed && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubmenuExclusively('reports');
                      }}
                      className="flex items-center gap-1.5 p-1 -mr-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      title={isReportsExpanded ? "Collapse Reports submenu" : "Expand Reports submenu"}
                    >
                      <span className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded-md border border-indigo-500/20">
                        {totalReportsCount}
                      </span>
                      {isReportsExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                    </div>
                  )}
                </button>

                {!isDesktopCollapsed && (
                  <AnimatePresence initial={false}>
                    {isReportsExpanded && (
                      <motion.div
                        variants={submenuContainerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="overflow-hidden ml-4 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800/80 space-y-3 my-1.5"
                      >
                        {reportsSubGroups.map(group => (
                          <div key={group.title} className="space-y-1">
                            <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 dark:text-zinc-400 px-2 pt-1 font-semibold">
                              {group.title}
                            </div>
                            {group.items.map(sub => {
                              const isSubActive = currentTab === sub.id;
                              return (
                                <motion.div key={sub.id} variants={submenuItemVariants}>
                                  <button
                                    onClick={() => {
                                      onSelectTab(sub.id as CanonicalNavTab);
                                      if (isMobile) onCloseMobile();
                                    }}
                                    className={`relative w-full flex items-center justify-between text-left rounded-xl transition-all cursor-pointer px-3 py-1.5 text-xs group ${
                                      isSubActive
                                        ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold'
                                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0 pr-1">
                                      <DynamicIcon
                                        icon={sub.icon}
                                        className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}
                                      />
                                      <div className="flex flex-col min-w-0">
                                        <span className="truncate leading-tight">{t(`report.title.${sub.id}`, sub.label)}</span>
                                        <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 truncate">{sub.badge}</span>
                                      </div>
                                    </div>
                                    {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                                  </button>
                                </motion.div>
                              );
                            })}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* 5. Regions (Collapsible Accordion: Regional Matrix, Languages) */}
              <div className="pt-0.5">
                <button
                  onClick={() => {
                    openSubmenuExclusively('regions');
                    onSelectTab(regionsSubItems[0].id as CanonicalNavTab);
                    if (isMobile) onCloseMobile();
                  }}
                  title={t('nav.regions', 'Regions')}
                  className={`relative w-full flex items-center ${
                    isDesktopCollapsed ? 'justify-center p-2.5' : 'justify-between py-2.5 px-3.5 text-sm'
                  } text-left rounded-2xl transition-all cursor-pointer group ${
                    isRegionsGroupActive
                      ? 'bg-purple-500/10 dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 font-bold border border-purple-500/25'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <DynamicIcon icon="streamline-freehand-color:hierarchy-web" className={`w-5 h-5 shrink-0 ${isRegionsGroupActive ? 'text-purple-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    {!isDesktopCollapsed && <span>{t('nav.regions', 'Regions')}</span>}
                  </div>
                  {!isDesktopCollapsed && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubmenuExclusively('regions');
                      }}
                      className="flex items-center gap-1.5 p-1 -mr-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      title={isRegionsExpanded ? "Collapse Regions submenu" : "Expand Regions submenu"}
                    >
                      <span className="text-[10px] font-mono text-zinc-400 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                        {regionsSubItems.length}
                      </span>
                      {isRegionsExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                    </div>
                  )}
                </button>

                {!isDesktopCollapsed && (
                  <AnimatePresence initial={false}>
                    {isRegionsExpanded && (
                      <motion.div
                        variants={submenuContainerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="overflow-hidden ml-4 pl-3 border-l-2 border-zinc-200 dark:border-zinc-800/80 space-y-1 my-1.5"
                      >
                        {regionsSubItems.map(sub => {
                          const SubIcon = sub.icon;
                          const isSubActive = currentTab === sub.id;
                          return (
                            <motion.div key={sub.id} variants={submenuItemVariants}>
                              <button
                                onClick={() => {
                                  onSelectTab(sub.id as CanonicalNavTab);
                                  if (isMobile) onCloseMobile();
                                }}
                                className={`relative w-full flex items-center justify-between text-left rounded-xl transition-all cursor-pointer px-3 py-2 text-xs group ${
                                  isSubActive
                                    ? 'bg-purple-500/15 border border-purple-500/30 text-purple-400 font-bold'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                                  <SubIcon className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-purple-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                                  <div className="flex flex-col min-w-0">
                                    <span className="truncate">{sub.label}</span>
                                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate">{sub.badge}</span>
                                  </div>
                                </div>
                                {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />}
                              </button>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* 6. Analytics (Collapsible Accordion: Benchmarks, Continental Map, Ethnic Tree) */}
              <div className="pt-0.5">
                <button
                  onClick={() => {
                    openSubmenuExclusively('analytics');
                    onSelectTab(analyticsSubItems[0].id as CanonicalNavTab);
                    if (isMobile) onCloseMobile();
                  }}
                  title={t('nav.analytics', 'Analytics')}
                  className={`relative w-full flex items-center ${
                    isDesktopCollapsed ? 'justify-center p-2.5' : 'justify-between py-2.5 px-3.5 text-sm'
                  } text-left rounded-2xl transition-all cursor-pointer group ${
                    isAnalyticsGroupActive
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/25'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <DynamicIcon icon="glyphs-poly:analytics" className={`w-5 h-5 shrink-0 ${isAnalyticsGroupActive ? 'text-emerald-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    {!isDesktopCollapsed && <span>{t('nav.analytics', 'Analytics')}</span>}
                  </div>
                  {!isDesktopCollapsed && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubmenuExclusively('analytics');
                      }}
                      className="flex items-center gap-1.5 p-1 -mr-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      title={isAnalyticsExpanded ? "Collapse Analytics submenu" : "Expand Analytics submenu"}
                    >
                      <span className="text-[10px] font-mono text-zinc-400 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                        {analyticsSubItems.length}
                      </span>
                      {isAnalyticsExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                    </div>
                  )}
                </button>

                {!isDesktopCollapsed && (
                  <AnimatePresence initial={false}>
                    {isAnalyticsExpanded && (
                      <motion.div
                        variants={submenuContainerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="overflow-hidden ml-4 pl-3 border-l-2 border-zinc-200 dark:border-zinc-800/80 space-y-1 my-1.5"
                      >
                        {analyticsSubItems.map(sub => {
                          const SubIcon = sub.icon;
                          const isSubActive = currentTab === sub.id;
                          return (
                            <motion.div key={sub.id} variants={submenuItemVariants}>
                              <button
                                onClick={() => {
                                  onSelectTab(sub.id as CanonicalNavTab);
                                  if (isMobile) onCloseMobile();
                                }}
                                className={`relative w-full flex items-center justify-between text-left rounded-xl transition-all cursor-pointer px-3 py-2 text-xs group ${
                                  isSubActive
                                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                                  <SubIcon className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                                  <div className="flex flex-col min-w-0">
                                    <span className="truncate">{sub.label}</span>
                                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate">{sub.badge}</span>
                                  </div>
                                </div>
                                {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
                              </button>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: REGIONS (UN GEOSCHEME) */}
          <div>
            {isDesktopCollapsed ? (
              <div className="my-2 mx-auto w-6 h-px bg-zinc-200 dark:bg-zinc-800" />
            ) : (
              <div className="px-4 mb-2">
                <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {t('nav.regions_section', 'REGIONS (UN GEOSCHEME)')}
                </h3>
              </div>
            )}
            <div className="space-y-1">
              {regionNavItems.map(item => {
                const isRegionTab = item.id.startsWith('region-');
                const regionName = isRegionTab ? REGION_ID_TO_NAME[item.id as RegionNavId] : undefined;
                const regionTonal = regionName ? getRegionTonalPalette(regionName) : undefined;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      if (isMobile) onCloseMobile();
                    }}
                    title={item.defaultLabel}
                    className={`relative w-full flex items-center ${
                      isDesktopCollapsed ? 'justify-center p-1.5' : 'justify-between py-2 px-3 text-sm'
                    } text-left rounded-2xl transition-all cursor-pointer group ${
                      isActive
                        ? 'font-bold shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                    style={{
                      backgroundColor: isActive ? `${regionTonal?.warmAccent}18` : undefined,
                      color: isActive ? regionTonal?.warmAccent : undefined,
                      borderColor: isActive ? `${regionTonal?.warmAccent}30` : undefined,
                      borderWidth: isActive ? 1 : 0
                    }}
                  >
                    <div className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'gap-3'}`}>
                      {item.renderIcon(isActive)}
                      {!isDesktopCollapsed && <span className="truncate">{item.defaultLabel}</span>}
                    </div>
                    {!isDesktopCollapsed && isActive && (
                      <span 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ backgroundColor: regionTonal?.warmAccent }} 
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Auxiliary Pipeline & Compare Quick Links */}
        <div className={`pt-4 border-t border-zinc-200 dark:border-zinc-800/80 space-y-1 ${isDesktopCollapsed ? 'px-0' : 'px-1'}`}>
          <button
            onClick={() => {
              onSelectTab('compare');
              if (isMobile) onCloseMobile();
            }}
            title={t('nav.compare', 'Compare')}
            className={`relative w-full flex items-center ${
              isDesktopCollapsed ? 'justify-center p-2' : 'justify-between py-2 px-3 text-xs'
            } text-left rounded-xl transition-all cursor-pointer ${
              currentTab === 'compare'
                ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 font-bold'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <div className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'gap-2.5'}`}>
              <GitCompare className="w-4 h-4 text-emerald-500 shrink-0" />
              {!isDesktopCollapsed && <span>{t('nav.compare', 'Compare')}</span>}
            </div>
            {!isDesktopCollapsed && currentTab === 'compare' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            onClick={() => {
              onSelectTab('provenance');
              if (isMobile) onCloseMobile();
            }}
            title={t('nav.provenance', 'Pipeline')}
            className={`relative w-full flex items-center ${
              isDesktopCollapsed ? 'justify-center p-2' : 'justify-between py-2 px-3 text-xs'
            } text-left rounded-xl transition-all cursor-pointer ${
              currentTab === 'provenance'
                ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 font-bold'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <div className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'gap-2.5'}`}>
              <Database className="w-4 h-4 text-emerald-500 shrink-0" />
              {!isDesktopCollapsed && <span>{t('nav.provenance', 'Pipeline')}</span>}
            </div>
            {!isDesktopCollapsed && currentTab === 'provenance' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* Documentation External Link */}
          <a
            href="./docs/"
            target="_blank"
            rel="noopener noreferrer"
            title={t('nav.docs', 'Docs')}
            className={`w-full flex items-center ${
              isDesktopCollapsed ? 'justify-center p-2' : 'justify-between py-2 px-3 text-xs'
            } text-left rounded-xl transition-all cursor-pointer text-zinc-500 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-800 dark:hover:text-zinc-200 mt-1`}
          >
            <div className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'gap-2.5'}`}>
              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
              {!isDesktopCollapsed && <span>{t('nav.docs', 'Docs')}</span>}
            </div>
            {!isDesktopCollapsed && <ExternalLink className="w-3.5 h-3.5 text-zinc-400 opacity-60" />}
          </a>

          {/* Orientation & Onboarding Trigger */}
          {onOpenOnboarding && (
            <button
              onClick={() => {
                if (isMobile) onCloseMobile();
                onOpenOnboarding();
              }}
              title={t('nav.orientation', 'Orientation & Heritage')}
              className={`w-full flex items-center ${
                isDesktopCollapsed ? 'justify-center p-2' : 'justify-between py-2 px-3 text-xs'
              } text-left rounded-xl transition-all cursor-pointer text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 dark:hover:bg-amber-500/15 mt-1 font-medium`}
            >
              <div className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                {!isDesktopCollapsed && <span>{t('nav.orientation', 'Orientation & Heritage')}</span>}
              </div>
              {!isDesktopCollapsed && (
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-700 dark:text-amber-300">
                  3-Step
                </span>
              )}
            </button>
          )}

          {!isDesktopCollapsed && (
            <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800/50 px-2 select-none">
              <div className="text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-500">
                <span className="font-semibold text-zinc-600 dark:text-zinc-400 block mb-0.5">
                  Africa Data Atlas • CC-BY 4.0
                </span>
                <span>Open Cartography & Research Archive</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. DESKTOP DRAWER */}
      <aside
        id="desktop-navigation-drawer"
        onMouseEnter={() => setIsDrawerHovered(true)}
        onMouseLeave={() => setIsDrawerHovered(false)}
        className={`hidden lg:flex flex-col shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl z-30 transition-all duration-300 ease-out overflow-y-auto overflow-x-hidden drawer-cozy-scrollbar ${
          !isDesktopOpen
            ? 'w-0 p-0 border-r-0 overflow-hidden'
            : isAutoCollapsePage
              ? isDrawerHovered
                ? 'w-72 p-4 shadow-2xl'
                : 'w-[68px] p-2 shadow-xs'
              : 'w-72 p-4'
        }`}
      >
        {isDesktopOpen && navContent(false)}
      </aside>

      {/* 2. MOBILE DRAWER MODAL / SHEET */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: MD3_STANDARD_EASE }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-50 p-5 overflow-y-auto drawer-cozy-scrollbar lg:hidden flex flex-col justify-between shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-sm font-bold text-zinc-900 dark:text-white font-serif tracking-wide">
                  Navigation Menu
                </span>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {navContent(true)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
