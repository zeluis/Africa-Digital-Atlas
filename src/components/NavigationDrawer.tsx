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
  Cpu
} from 'lucide-react';
import { UN_REGIONAL_SILHOUETTES } from '../data/svgGeographySystem';
import { AfricanRegion } from '../data/types';
import { getRegionTonalPalette } from '../data/unGeoschemeColors';

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
  | 'report-sociological-origins-racism';

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
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItemDef {
  id: CanonicalNavTab;
  labelKey: string;
  defaultLabel: string;
  renderIcon: (isActive: boolean) => React.ReactNode;
}

const EXPLORE_SUBMENU_STORAGE_KEY = 'african_geography_explore_submenu_expanded';
const HISTORICAL_LEGACIES_SUBMENU_STORAGE_KEY = 'african_geography_historical_legacies_submenu_expanded';
const REPORTS_SUBMENU_STORAGE_KEY = 'african_geography_reports_submenu_expanded';
const REGIONS_SUBMENU_STORAGE_KEY = 'african_geography_regions_submenu_expanded';
const ANALYTICS_SUBMENU_STORAGE_KEY = 'african_geography_analytics_submenu_expanded';

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

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  currentTab,
  onSelectTab,
  isDesktopOpen,
  isMobileOpen,
  onCloseMobile
}) => {
  const { t } = useTranslation();

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

  // Submenu expansion states
  const [isExploreExpanded, setIsExploreExpanded] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(EXPLORE_SUBMENU_STORAGE_KEY);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return isExploreGroupActive;
  });

  const [isHistoricalLegaciesExpanded, setIsHistoricalLegaciesExpanded] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(HISTORICAL_LEGACIES_SUBMENU_STORAGE_KEY);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return isHistoricalLegaciesGroupActive || true; // Prominently expanded by default
  });

  const [isReportsExpanded, setIsReportsExpanded] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(REPORTS_SUBMENU_STORAGE_KEY);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return isReportsGroupActive || true; // Default expanded so research is discoverable
  });

  const [isRegionsExpanded, setIsRegionsExpanded] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(REGIONS_SUBMENU_STORAGE_KEY);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return isRegionsGroupActive;
  });

  const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(ANALYTICS_SUBMENU_STORAGE_KEY);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return isAnalyticsGroupActive || true;
  });

  // Auto-expand parent accordion if child is selected
  useEffect(() => {
    if (isExploreGroupActive) setIsExploreExpanded(true);
  }, [isExploreGroupActive]);

  useEffect(() => {
    if (isHistoricalLegaciesGroupActive) setIsHistoricalLegaciesExpanded(true);
  }, [isHistoricalLegaciesGroupActive]);

  useEffect(() => {
    if (isReportsGroupActive) setIsReportsExpanded(true);
  }, [isReportsGroupActive]);

  useEffect(() => {
    if (isRegionsGroupActive) setIsRegionsExpanded(true);
  }, [isRegionsGroupActive]);

  useEffect(() => {
    if (isAnalyticsGroupActive) setIsAnalyticsExpanded(true);
  }, [isAnalyticsGroupActive]);

  const toggleExploreExpanded = () => {
    setIsExploreExpanded(prev => {
      const next = !prev;
      try { localStorage.setItem(EXPLORE_SUBMENU_STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toggleHistoricalLegaciesExpanded = () => {
    setIsHistoricalLegaciesExpanded(prev => {
      const next = !prev;
      try { localStorage.setItem(HISTORICAL_LEGACIES_SUBMENU_STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toggleReportsExpanded = () => {
    setIsReportsExpanded(prev => {
      const next = !prev;
      try { localStorage.setItem(REPORTS_SUBMENU_STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toggleRegionsExpanded = () => {
    setIsRegionsExpanded(prev => {
      const next = !prev;
      try { localStorage.setItem(REGIONS_SUBMENU_STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toggleAnalyticsExpanded = () => {
    setIsAnalyticsExpanded(prev => {
      const next = !prev;
      try { localStorage.setItem(ANALYTICS_SUBMENU_STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Helper to render Region SVG Silhouettes with UN Geoscheme warm tonal colors
  const renderRegionSilhouetteIcon = (regionId: RegionNavId, isActive: boolean) => {
    const regionName = REGION_ID_TO_NAME[regionId];
    const sil = UN_REGIONAL_SILHOUETTES[regionName];
    const tonal = getRegionTonalPalette(regionName);
    if (!sil) return null;

    return (
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
          isActive
            ? 'shadow-md scale-105'
            : 'group-hover:scale-105 group-hover:shadow-xs'
        }`}
        style={{
          backgroundColor: isActive 
            ? `${tonal.warmAccent}30` 
            : `${tonal.warmAccent}18`,
          border: `1.5px solid ${isActive ? tonal.warmAccent : `${tonal.warmAccent}50`}`,
          boxShadow: isActive ? `0 2px 10px ${tonal.glowRgba}` : `0 1px 4px ${tonal.warmAccent}20`
        }}
      >
        <svg
          viewBox={sil.viewBox}
          className={`w-4.5 h-4.5 shrink-0 transition-all duration-300 ease-out select-none ${
            isActive 
              ? 'scale-110 drop-shadow-sm' 
              : 'group-hover:scale-110'
          }`}
          style={{ color: tonal.warmAccent }}
          fill={tonal.warmAccent}
          fillOpacity={isActive ? 0.8 : 0.45}
          stroke={tonal.warmAccent}
          strokeWidth={isActive ? 2.6 : 2.2}
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
    { id: 'african-development-foundations', label: 'Foundations', icon: TrendingDown, badge: 'Treatise' },
    { id: 'ethnic-tree', label: 'Ethnic Tree', icon: Layers, badge: 'Transatlantic' }
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

  // Submenu categorized items for Reports (Ultra-Minimal style)
  const reportsSubGroups = [
    {
      title: 'Overview',
      items: [
        { id: 'research-directory', label: 'Directory', icon: BookOpen, badge: 'Directory' }
      ]
    },
    {
      title: 'Genetics',
      items: [
        { id: 'report-genetic-linguistic-blueprints', label: 'Genetic & Linguistic Blueprints', icon: Dna, badge: 'Creole DNA' },
        { id: 'report-genetic-social-structure-cape-verde', label: 'Genetic & Social Structure: Cabo Verde', icon: Dna, badge: 'Genealogies' },
        { id: 'report-creole-admixture-cabo-verde', label: 'Creole Admixture: Cabo Verde & São Tomé', icon: Dna, badge: 'Crucibles' },
        { id: 'report-latest-developments-genetic-legacy', label: 'Latest Developments: Genetic Legacy', icon: Dna, badge: 'Ancient DNA' }
      ]
    },
    {
      title: 'Law & Reparations',
      items: [
        { id: 'report-slavery-international-law-reparatory', label: 'Slavery, Law & Reparatory Justice', icon: Scale, badge: 'CARICOM / ICJ' },
        { id: 'report-sovereign-responsibility-reparations', label: 'Sovereign Responsibility & Reparations', icon: Scale, badge: 'Balance Sheets' },
        { id: 'report-reparations-debt-anthropocene', label: 'Reparations, Debt & Anthropocene', icon: Scale, badge: 'Climate Debt' }
      ]
    },
    {
      title: 'Development',
      items: [
        { id: 'report-ancestry-ideology-underdevelopment', label: 'Ancestry, Ideology & Underdevelopment', icon: TrendingUp, badge: 'Econometric' },
        { id: 'report-rao-model-socioeconomic', label: 'RAO Model & Socioeconomic Legacies', icon: Cpu, badge: 'Capital Policy' },
        { id: 'report-sociological-origins-racism', label: 'Sociological Origins of Racism', icon: FileText, badge: 'Historical' }
      ]
    }
  ];

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

  const navContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full justify-between pb-6">
      <div className="space-y-6">
        {/* Section 1: AFRICA */}
        <div>
          <div className="px-4 mb-2">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {t('nav.africa', 'AFRICA')}
            </h3>
          </div>

          <div className="space-y-1">
            {/* 1. Overview (Single Link, untouched) */}
            <button
              onClick={() => {
                onSelectTab('overview');
                if (isMobile) onCloseMobile();
              }}
              className={`relative w-full flex items-center justify-between text-left rounded-2xl transition-all cursor-pointer py-2.5 px-3.5 text-sm group ${
                currentTab === 'overview'
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/25 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe2 className={`w-5 h-5 ${currentTab === 'overview' ? 'text-emerald-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span>Overview</span>
              </div>
              {currentTab === 'overview' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>

            {/* 2. Explore (Collapsible Accordion: Directory Overview, 8 Pillars, 21 Blocs) */}
            <div className="pt-0.5">
              <button
                onClick={() => {
                  toggleExploreExpanded();
                }}
                className={`relative w-full flex items-center justify-between text-left rounded-2xl transition-all cursor-pointer py-2.5 px-3.5 text-sm group ${
                  isExploreGroupActive
                    ? 'bg-blue-500/10 dark:bg-blue-500/15 text-blue-800 dark:text-blue-300 font-bold border border-blue-500/25'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Compass className={`w-5 h-5 ${isExploreGroupActive ? 'text-blue-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span>Explore</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-zinc-400 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                    {exploreSubItems.length}
                  </span>
                  {isExploreExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                </div>
              </button>

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
            </div>

            {/* 3. Historical Legacies (TAST) (Dedicated Main Menu Accordion with Submenu) */}
            <div className="pt-0.5">
              <button
                onClick={() => {
                  toggleHistoricalLegaciesExpanded();
                }}
                className={`relative w-full flex items-center justify-between text-left rounded-2xl transition-all cursor-pointer py-2.5 px-3.5 text-sm group ${
                  isHistoricalLegaciesGroupActive
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/25'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Anchor className={`w-5 h-5 ${isHistoricalLegaciesGroupActive ? 'text-amber-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span className="truncate">History</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                    {historicalLegaciesSubItems.length}
                  </span>
                  {isHistoricalLegaciesExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                </div>
              </button>

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
                                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-1">
                              <SubIcon className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                              <div className="flex flex-col min-w-0">
                                <span className="truncate">{sub.label}</span>
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
            </div>

            {/* 4. Research & Reports (Collapsible Accordion with Topics: Genetics, International Law, Development) */}
            <div className="pt-0.5">
              <button
                onClick={() => {
                  toggleReportsExpanded();
                }}
                className={`relative w-full flex items-center justify-between text-left rounded-2xl transition-all cursor-pointer py-2.5 px-3.5 text-sm group ${
                  isReportsGroupActive
                    ? 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 font-bold border border-indigo-500/25'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className={`w-5 h-5 ${isReportsGroupActive ? 'text-indigo-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span>Reports</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded-md border border-indigo-500/20">
                    11
                  </span>
                  {isReportsExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                </div>
              </button>

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
                          const SubIcon = sub.icon;
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
                                  <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                                  <div className="flex flex-col min-w-0">
                                    <span className="truncate leading-tight">{sub.label}</span>
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
            </div>

            {/* 4. Regions (Collapsible Accordion: Regional Matrix, Languages) */}
            <div className="pt-0.5">
              <button
                onClick={() => {
                  toggleRegionsExpanded();
                }}
                className={`relative w-full flex items-center justify-between text-left rounded-2xl transition-all cursor-pointer py-2.5 px-3.5 text-sm group ${
                  isRegionsGroupActive
                    ? 'bg-purple-500/10 dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 font-bold border border-purple-500/25'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe2 className={`w-5 h-5 ${isRegionsGroupActive ? 'text-purple-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span>Regions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-zinc-400 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                    {regionsSubItems.length}
                  </span>
                  {isRegionsExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                </div>
              </button>

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
            </div>

            {/* 5. Analytics (Collapsible Accordion: Benchmarks, Continental Map, Ethnic Tree) - AT THE BOTTOM OF MAIN LINKS */}
            <div className="pt-0.5">
              <button
                onClick={() => {
                  toggleAnalyticsExpanded();
                }}
                className={`relative w-full flex items-center justify-between text-left rounded-2xl transition-all cursor-pointer py-2.5 px-3.5 text-sm group ${
                  isAnalyticsGroupActive
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/25'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className={`w-5 h-5 ${isAnalyticsGroupActive ? 'text-emerald-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span>Analytics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-zinc-400 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                    {analyticsSubItems.length}
                  </span>
                  {isAnalyticsExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                </div>
              </button>

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
            </div>
          </div>
        </div>

        {/* Section 2: REGIONS (UN Geoscheme) - Untouched */}
        <div>
          <div className="px-4 mb-2">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {t('nav.regions_section', 'REGIONS (UN GEOSCHEME)')}
            </h3>
          </div>
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
                  className={`relative w-full flex items-center justify-between text-left rounded-2xl transition-all cursor-pointer py-2 px-3 text-sm group ${
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
                  <div className="flex items-center gap-3">
                    {item.renderIcon(isActive)}
                    <span className="truncate">{item.defaultLabel}</span>
                  </div>
                  {isActive && (
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
      <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800/80 space-y-1 px-1">
        <button
          onClick={() => {
            onSelectTab('compare');
            if (isMobile) onCloseMobile();
          }}
          className={`relative w-full flex items-center justify-between text-left rounded-xl transition-all cursor-pointer py-2 px-3 text-xs ${
            currentTab === 'compare'
              ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 font-bold'
              : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <GitCompare className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t('nav.compare', 'Compare')}</span>
          </div>
          {currentTab === 'compare' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          onClick={() => {
            onSelectTab('provenance');
            if (isMobile) onCloseMobile();
          }}
          className={`relative w-full flex items-center justify-between text-left rounded-xl transition-all cursor-pointer py-2 px-3 text-xs ${
            currentTab === 'provenance'
              ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 font-bold'
              : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t('nav.provenance', 'Pipeline')}</span>
          </div>
          {currentTab === 'provenance' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          )}
        </button>

        {/* Documentation External Link */}
        <a
          href="./docs/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between text-left rounded-xl transition-all cursor-pointer py-2 px-3 text-xs text-zinc-500 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-800 dark:hover:text-zinc-200 mt-1"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
            <span>{t('nav.docs', 'Docs')}</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-400 opacity-60" />
        </a>

        <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800/50 px-2 select-none">
          <div className="text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-500">
            <span className="font-semibold text-zinc-600 dark:text-zinc-400 block mb-0.5">
              Africa Data Atlas • CC-BY 4.0
            </span>
            <span>Open Cartography & Research Archive</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. DESKTOP DRAWER */}
      <aside
        id="desktop-navigation-drawer"
        className={`hidden lg:flex flex-col shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl z-20 transition-all duration-300 ease-out overflow-y-auto ${
          isDesktopOpen ? 'w-72 p-4' : 'w-0 p-0 border-r-0 overflow-hidden'
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
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-50 p-5 overflow-y-auto lg:hidden flex flex-col justify-between shadow-2xl"
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
