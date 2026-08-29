import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  LayoutDashboard, 
  Compass, 
  BookOpen,
  Boxes,
  Layers, 
  TrendingUp, 
  Map as MapIcon, 
  Languages as LanguagesIcon, 
  Landmark,
  Database,
  GitCompare,
  Anchor,
  Scale,
  Dna,
  ChevronDown,
  ChevronRight,
  Sparkles,
  FileText,
  X
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
  | 'heritage';

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

const SLAVE_TRADE_SUBMENU_STORAGE_KEY = 'african_geography_slave_trade_submenu_expanded';

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
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  }
};

const submenuItemVariants = {
  hidden: { 
    opacity: 0, 
    y: -6 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.25,
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

  const isSlaveTradeGroupActive = currentTab === 'slave-trade' || currentTab === 'molecular-legacies' || currentTab === 'african-development-foundations';

  const [isSlaveTradeExpanded, setIsSlaveTradeExpanded] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(SLAVE_TRADE_SUBMENU_STORAGE_KEY);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback in case of storage restrictions
    }
    return isSlaveTradeGroupActive;
  });

  const updateSlaveTradeExpanded = (expanded: boolean) => {
    setIsSlaveTradeExpanded(expanded);
    try {
      localStorage.setItem(SLAVE_TRADE_SUBMENU_STORAGE_KEY, JSON.stringify(expanded));
    } catch {
      // Gracefully ignore storage write failures
    }
  };

  useEffect(() => {
    if (isSlaveTradeGroupActive) {
      updateSlaveTradeExpanded(true);
    }
  }, [isSlaveTradeGroupActive]);

  // Helper to render Region SVG Silhouettes with UN Geoscheme warm tonal colors, prominent icon chip & vivid styling
  const renderRegionSilhouetteIcon = (regionId: RegionNavId, isActive: boolean) => {
    const regionName = REGION_ID_TO_NAME[regionId];
    const sil = UN_REGIONAL_SILHOUETTES[regionName];
    const tonal = getRegionTonalPalette(regionName);
    if (!sil) return null;

    return (
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
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
          className={`w-5 h-5 shrink-0 transition-all duration-300 ease-out select-none ${
            isActive 
              ? 'scale-110 drop-shadow-sm' 
              : 'group-hover:scale-110'
          }`}
          style={{
            color: tonal.warmAccent
          }}
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

  // Section 1: Africa / Home
  const mainNavItems: NavItemDef[] = [
    {
      id: 'overview',
      labelKey: 'nav.overview',
      defaultLabel: 'Overview',
      renderIcon: (isActive) => (
        <LayoutDashboard 
          className="w-6 h-6 shrink-0 transition-all" 
          strokeWidth={isActive ? 2.4 : 1.75}
          fill={isActive ? 'currentColor' : 'none'}
          fillOpacity={isActive ? 0.2 : 0}
        />
      )
    },
    {
      id: 'explore',
      labelKey: 'nav.explore',
      defaultLabel: 'Explore',
      renderIcon: (isActive) => (
        <Compass 
          className="w-6 h-6 shrink-0 transition-all" 
          strokeWidth={isActive ? 2.4 : 1.75}
          fill={isActive ? 'currentColor' : 'none'}
          fillOpacity={isActive ? 0.2 : 0}
        />
      )
    },
    {
      id: 'slave-trade',
      labelKey: 'nav.slave_trade',
      defaultLabel: 'Atlantic Slave Trade',
      renderIcon: (isActive) => (
        <Anchor 
          className="w-6 h-6 shrink-0 transition-all" 
          strokeWidth={isActive ? 2.4 : 1.75}
          fill={isActive ? 'currentColor' : 'none'}
          fillOpacity={isActive ? 0.2 : 0}
        />
      )
    },
    {
      id: 'pillars',
      labelKey: 'nav.pillars',
      defaultLabel: '8 Thematic Pillars',
      renderIcon: (isActive) => (
        <BookOpen 
          className="w-6 h-6 shrink-0 transition-all" 
          strokeWidth={isActive ? 2.4 : 1.75}
          fill={isActive ? 'currentColor' : 'none'}
          fillOpacity={isActive ? 0.2 : 0}
        />
      )
    },
    {
      id: 'blocs',
      labelKey: 'nav.blocs',
      defaultLabel: '21 Regional Blocs',
      renderIcon: (isActive) => (
        <Boxes 
          className="w-6 h-6 shrink-0 transition-all" 
          strokeWidth={isActive ? 2.4 : 1.75}
          fill={isActive ? 'currentColor' : 'none'}
          fillOpacity={isActive ? 0.2 : 0}
        />
      )
    },
    {
      id: 'regions',
      labelKey: 'nav.regions',
      defaultLabel: 'Regions',
      renderIcon: (isActive) => (
        <Layers 
          className="w-6 h-6 shrink-0 transition-all" 
          strokeWidth={isActive ? 2.4 : 1.75}
          fill={isActive ? 'currentColor' : 'none'}
          fillOpacity={isActive ? 0.2 : 0}
        />
      )
    },
    {
      id: 'analytics',
      labelKey: 'nav.analytics',
      defaultLabel: 'Analytics',
      renderIcon: (isActive) => (
        <TrendingUp 
          className="w-6 h-6 shrink-0 transition-all" 
          strokeWidth={isActive ? 2.4 : 1.75}
          fill={isActive ? 'currentColor' : 'none'}
          fillOpacity={isActive ? 0.2 : 0}
        />
      )
    },
    {
      id: 'map',
      labelKey: 'nav.map',
      defaultLabel: 'Map',
      renderIcon: (isActive) => (
        <MapIcon 
          className="w-6 h-6 shrink-0 transition-all" 
          strokeWidth={isActive ? 2.4 : 1.75}
          fill={isActive ? 'currentColor' : 'none'}
          fillOpacity={isActive ? 0.2 : 0}
        />
      )
    },
    {
      id: 'languages',
      labelKey: 'nav.languages',
      defaultLabel: 'Languages',
      renderIcon: (isActive) => (
        <LanguagesIcon 
          className="w-6 h-6 shrink-0 transition-all" 
          strokeWidth={isActive ? 2.4 : 1.75}
          fill={isActive ? 'currentColor' : 'none'}
          fillOpacity={isActive ? 0.2 : 0}
        />
      )
    },
    {
      id: 'heritage',
      labelKey: 'nav.heritage',
      defaultLabel: 'World Heritage',
      renderIcon: (isActive) => (
        <Landmark 
          className="w-6 h-6 shrink-0 transition-all" 
          strokeWidth={isActive ? 2.4 : 1.75}
          fill={isActive ? 'currentColor' : 'none'}
          fillOpacity={isActive ? 0.2 : 0}
        />
      )
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

  const renderNavLink = (item: NavItemDef, isMobile: boolean = false) => {
    // If this is the slave-trade item, render the parent with submenu
    if (item.id === 'slave-trade') {
      return renderSlaveTradeGroup(isMobile);
    }

    // When viewing a country dossier, consider 'explore' as parent active if not explicitly on another tab
    const isActive = currentTab === item.id || (item.id === 'explore' && currentTab === 'countries');
    const isRegionTab = item.id.startsWith('region-');
    const regionName = isRegionTab ? REGION_ID_TO_NAME[item.id as RegionNavId] : undefined;
    const regionTonal = regionName ? getRegionTonalPalette(regionName) : undefined;
    
    return (
      <button
        key={item.id}
        onClick={() => {
          // Collapse slave trade submenu when clicking any other navigation link and persist
          updateSlaveTradeExpanded(false);
          onSelectTab(item.id);
          if (isMobile) {
            onCloseMobile();
          }
          // On desktop, the drawer stays open!
        }}
        aria-current={isActive ? 'page' : undefined}
        style={
          isActive && isRegionTab && regionTonal
            ? {
                backgroundColor: `var(--region-${regionTonal.cssVarKey}-fill, ${regionTonal.warmAccent}22)`,
              }
            : undefined
        }
        className={`relative w-full flex items-center justify-between text-left rounded-2xl transition-all cursor-pointer select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 border border-transparent ${
          isMobile 
            ? 'h-14 px-4 text-base' 
            : 'h-[52px] px-4 text-[15px]'
        } ${
          isActive
            ? isRegionTab && regionTonal
              ? `${regionTonal.badge.bg} ${regionTonal.badge.text} font-bold shadow-xs`
              : 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/25 dark:border-emerald-500/35 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
            : 'text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-100 font-medium'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <div
            className={`transition-colors shrink-0 ${
              isActive
                ? regionTonal
                  ? regionTonal.badge.text
                  : 'text-emerald-600 dark:text-emerald-400'
                : isRegionTab
                  ? ''
                  : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200'
            }`}
          >
            {item.renderIcon(isActive)}
          </div>
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="truncate tracking-tight font-sans font-medium">
              {t(item.labelKey, item.defaultLabel)}
            </span>
            {isRegionTab && regionTonal && (
              <span 
                className="hidden sm:inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 opacity-80"
                style={{
                  backgroundColor: `${regionTonal.warmAccent}20`,
                  color: regionTonal.warmAccent,
                  border: `1px solid ${regionTonal.warmAccent}40`
                }}
              >
                {regionTonal.shortName}
              </span>
            )}
          </div>
        </div>

        {/* 3-4px Vertical Accent Strip on the RIGHT side for Active State */}
        {isActive && (
          <span 
            className="absolute right-0 top-1.5 bottom-1.5 w-[3.5px] rounded-r-2xl shadow-xs"
            style={{
              backgroundColor: regionTonal ? regionTonal.warmAccent : undefined
            }}
            aria-hidden="true"
          />
        )}
      </button>
    );
  };

  const renderSlaveTradeGroup = (isMobile: boolean = false) => {
    const isParentActive = isSlaveTradeGroupActive;

    const subItems = [
      {
        id: 'slave-trade' as CanonicalNavTab,
        label: 'Database & Voyage Atlas',
        badge: 'Atlas & Flow Map',
        icon: Anchor,
        colorClass: 'emerald'
      },
      {
        id: 'molecular-legacies' as CanonicalNavTab,
        label: 'Molecular & Material Legacies',
        badge: 'Research Article',
        icon: Dna,
        colorClass: 'indigo'
      },
      {
        id: 'african-development-foundations' as CanonicalNavTab,
        label: 'Foundations of African Development',
        badge: 'Master Report',
        icon: Scale,
        colorClass: 'amber'
      }
    ];

    const handleParentClick = () => {
      // Toggle submenu open/close and persist to localStorage
      const nextExpanded = !isSlaveTradeExpanded;
      updateSlaveTradeExpanded(nextExpanded);

      // If opening or switching to the section, navigate to slave-trade atlas
      if (!isParentActive) {
        onSelectTab('slave-trade');
        if (isMobile) onCloseMobile();
      }
    };

    return (
      <div className="space-y-1" key="slave-trade-group">
        {/* Parent Header Row: Clicking the entire Parent link toggles open/close */}
        <div className="relative flex items-center">
          <button
            onClick={handleParentClick}
            aria-expanded={isSlaveTradeExpanded}
            aria-label={`${t('nav.slave_trade', 'Atlantic Slave Trade')} (${isSlaveTradeExpanded ? 'collapse submenu' : 'expand submenu'})`}
            className={`relative w-full flex items-center justify-between text-left rounded-2xl transition-all cursor-pointer select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isMobile ? 'h-14 px-4 text-base' : 'h-[52px] px-4 text-[15px]'
            } ${
              isParentActive
                ? 'bg-zinc-900/90 dark:bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 font-bold shadow-xs'
                : 'border border-transparent text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-100 font-medium'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className={`transition-colors shrink-0 ${isParentActive ? 'text-amber-400' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200'}`}>
                <Anchor className="w-6 h-6 shrink-0" strokeWidth={isParentActive ? 2.4 : 1.75} />
              </div>
              <div className="flex items-center gap-2 min-w-0 truncate">
                <span className="truncate tracking-tight font-sans font-medium">
                  {t('nav.slave_trade', 'Atlantic Slave Trade')}
                </span>
                <span className="hidden sm:inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  3 Pages
                </span>
              </div>
            </div>

            {/* Chevron Icon indicating open/close state */}
            <div className="flex items-center gap-1.5 shrink-0 pl-1">
              <div 
                className={`p-1.5 rounded-lg transition-transform duration-200 ${
                  isSlaveTradeExpanded 
                    ? 'text-amber-400 bg-amber-400/10' 
                    : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
                title={isSlaveTradeExpanded ? 'Click to collapse' : 'Click to expand'}
              >
                {isSlaveTradeExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </div>

            {isParentActive && (
              <span className="absolute right-0 top-1.5 bottom-1.5 w-[3.5px] rounded-r-2xl bg-amber-500 shadow-xs" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Submenu links with staggered 250ms fade-in and slide-down transition using MD3 standard easing */}
        <AnimatePresence initial={false}>
          {isSlaveTradeExpanded && (
            <motion.div 
              variants={submenuContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="overflow-hidden ml-5 pl-3 border-l-2 border-zinc-200 dark:border-zinc-800/80 space-y-1 my-1.5"
            >
              {subItems.map(sub => {
                const SubIcon = sub.icon;
                const isSubActive = currentTab === sub.id;

                let activeBadgeStyle = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
                let activeIconColor = 'text-emerald-400';
                if (sub.colorClass === 'indigo') {
                  activeBadgeStyle = 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300';
                  activeIconColor = 'text-indigo-400';
                } else if (sub.colorClass === 'amber') {
                  activeBadgeStyle = 'bg-amber-500/15 border-amber-500/30 text-amber-300';
                  activeIconColor = 'text-amber-400';
                }

                return (
                  <motion.div key={sub.id} variants={submenuItemVariants}>
                    <button
                      onClick={() => {
                        onSelectTab(sub.id);
                        if (isMobile) onCloseMobile();
                      }}
                      className={`relative w-full flex items-center justify-between text-left rounded-xl transition-all cursor-pointer select-none group px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                        isSubActive
                          ? `${activeBadgeStyle} border font-bold shadow-xs`
                          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-1">
                        <SubIcon className={`w-4 h-4 shrink-0 transition-colors ${isSubActive ? activeIconColor : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                        <div className="flex flex-col min-w-0">
                          <span className="truncate tracking-tight font-sans">
                            {sub.label}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                            {sub.badge}
                          </span>
                        </div>
                      </div>

                      {isSubActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const navContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full justify-between pb-6">
      <div className="space-y-7">
        {/* Section 1: AFRICA */}
        <div>
          <div className="px-4 mb-2.5">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {t('nav.africa', 'AFRICA')}
            </h3>
          </div>
          <div className="space-y-1">
            {mainNavItems.map(item => renderNavLink(item, isMobile))}
          </div>
        </div>

        {/* Section 2: Regions */}
        <div>
          <div className="px-4 mb-2.5">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {t('nav.regions_section', 'Regions')}
            </h3>
          </div>
          <div className="space-y-1">
            {regionNavItems.map(item => renderNavLink(item, isMobile))}
          </div>
        </div>
      </div>

      {/* Auxiliary Pipeline & Compare Quick Links */}
      <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800/80 space-y-1 px-1">
        <button
          onClick={() => {
            updateSlaveTradeExpanded(false);
            onSelectTab('compare');
            if (isMobile) onCloseMobile();
          }}
          aria-current={currentTab === 'compare' ? 'page' : undefined}
          className={`relative w-full flex items-center justify-between text-left rounded-xl transition-all cursor-pointer py-2 px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            currentTab === 'compare'
              ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 font-bold'
              : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <GitCompare 
              className="w-4 h-4 text-emerald-500 shrink-0 transition-all" 
              strokeWidth={currentTab === 'compare' ? 2.5 : 1.75}
              fill={currentTab === 'compare' ? 'currentColor' : 'none'}
              fillOpacity={currentTab === 'compare' ? 0.2 : 0}
            />
            <span>{t('nav.compare', 'Compare Tool')}</span>
          </div>
          {currentTab === 'compare' && (
            <span className="absolute right-0 top-1 bottom-1 w-[3px] bg-emerald-500 rounded-r-md" />
          )}
        </button>

        <button
          onClick={() => {
            updateSlaveTradeExpanded(false);
            onSelectTab('provenance');
            if (isMobile) onCloseMobile();
          }}
          aria-current={currentTab === 'provenance' ? 'page' : undefined}
          className={`relative w-full flex items-center justify-between text-left rounded-xl transition-all cursor-pointer py-2 px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            currentTab === 'provenance'
              ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 font-bold'
              : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Database 
              className="w-4 h-4 text-emerald-500 shrink-0 transition-all" 
              strokeWidth={currentTab === 'provenance' ? 2.5 : 1.75}
              fill={currentTab === 'provenance' ? 'currentColor' : 'none'}
              fillOpacity={currentTab === 'provenance' ? 0.2 : 0}
            />
            <span>{t('nav.provenance', 'Quality & Pipeline')}</span>
          </div>
          {currentTab === 'provenance' && (
            <span className="absolute right-0 top-1 bottom-1 w-[3px] bg-emerald-500 rounded-r-md" />
          )}
        </button>

        {/* 47. Drawer Credits - Understated Acknowledgement & Author Area */}
        <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800/50 px-2 select-none">
          <div className="text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-500 font-sans">
            <span className="font-semibold text-zinc-600 dark:text-zinc-400 block mb-0.5">
              Africa Data Atlas • CC-BY 4.0
            </span>
            <span>Independent Open Cartography • Verified Datasets</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. DESKTOP DRAWER (Starts open, width: 272px, fixed/sticky, remains open on nav clicks) */}
      <aside
        id="desktop-navigation-drawer"
        aria-label="Main Navigation Drawer"
        className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out select-none ${
          isDesktopOpen
            ? 'w-[272px] opacity-100 translate-x-0'
            : 'w-0 opacity-0 -translate-x-full overflow-hidden pointer-events-none'
        }`}
      >
        <div className="sticky top-20 w-[272px] h-[calc(100vh-5.5rem)] overflow-y-auto no-scrollbar py-4 px-3 border-r border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
          {navContent(false)}
        </div>
      </aside>

      {/* 2. MOBILE BOTTOM NAVIGATION SHEET */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Bottom Sheet Container */}
          <div className="relative z-10 w-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 rounded-t-[28px] shadow-2xl max-h-[85vh] overflow-y-auto flex flex-col px-4 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle Zone (24–32px height) */}
            <div className="w-full h-8 flex items-center justify-center cursor-grab shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>

            {/* Header with Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-4 px-2 shrink-0">
              <span className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                {t('app.title', 'AFRICA DATA ATLAS')}
              </span>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-900"
                aria-label="Close navigation sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sheet Content */}
            <div className="flex-1 overflow-y-auto px-1">
              {navContent(true)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
