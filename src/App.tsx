import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { NavigationDrawer, CanonicalNavTab } from './components/NavigationDrawer';
import { SearchModal } from './components/SearchModal';
import { MultiSourceApiHubModal } from './components/MultiSourceApiHubModal';
import { OnboardingModal } from './components/OnboardingModal';
import { MainContentSkeleton } from './components/MainContentSkeleton';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DensityProvider } from './contexts/DensityContext';
import { SavedEntitiesProvider } from './contexts/SavedEntitiesContext';
import { OverviewView } from './views/OverviewView';
import { AfricanRegion } from './data/types';
import { atlas } from './data/atlas-store';
import { lazyWithRetry, ViewErrorBoundary } from './utils/lazyWithRetry';
import { Globe, Database } from 'lucide-react';
import { DynamicIcon } from './components/DynamicIcon';
import { getPageInfo } from './utils/navigationTitles';

// Lazy-load heavier views with automatic chunk recovery and cache resilience for GitHub Pages
const CountryView = lazyWithRetry(() => import('./views/CountryView').then(m => ({ default: m.CountryView })), 'CountryView');
const RegionalView = lazyWithRetry(() => import('./views/RegionalView').then(m => ({ default: m.RegionalView })), 'RegionalView');
const AnalyticsView = lazyWithRetry(() => import('./views/AnalyticsView').then(m => ({ default: m.AnalyticsView })), 'AnalyticsView');
const HeritageView = lazyWithRetry(() => import('./views/HeritageView').then(m => ({ default: m.HeritageView })), 'HeritageView');
const CompareView = lazyWithRetry(() => import('./views/CompareView').then(m => ({ default: m.CompareView })), 'CompareView');
const ProvenanceQualityView = lazyWithRetry(() => import('./views/ProvenanceQualityView').then(m => ({ default: m.ProvenanceQualityView })), 'ProvenanceQualityView');
const MapView = lazyWithRetry(() => import('./views/MapView').then(m => ({ default: m.MapView })), 'MapView');
const LanguagesView = lazyWithRetry(() => import('./views/LanguagesView').then(m => ({ default: m.LanguagesView })), 'LanguagesView');
const ExploreView = lazyWithRetry(() => import('./views/ExploreView').then(m => ({ default: m.ExploreView })), 'ExploreView');
const SlaveTradeView = lazyWithRetry(() => import('./views/SlaveTradeView').then(m => ({ default: m.SlaveTradeView })), 'SlaveTradeView');
const MolecularLegaciesArticleView = lazyWithRetry(() => import('./views/MolecularLegaciesArticleView').then(m => ({ default: m.MolecularLegaciesArticleView })), 'MolecularLegaciesArticleView');
const AfricanDevelopmentMasterReportView = lazyWithRetry(() => import('./views/AfricanDevelopmentMasterReportView').then(m => ({ default: m.AfricanDevelopmentMasterReportView })), 'AfricanDevelopmentMasterReportView');
const ThematicPillarsView = lazyWithRetry(() => import('./views/ThematicPillarsView').then(m => ({ default: m.ThematicPillarsView })), 'ThematicPillarsView');
const EntityBlocsBrowser = lazyWithRetry(() => import('./components/EntityBlocsBrowser').then(m => ({ default: m.EntityBlocsBrowser })), 'EntityBlocsBrowser');
const EthnicTreeOfLifeView = lazyWithRetry(() => import('./views/EthnicTreeOfLifeView').then(m => ({ default: m.EthnicTreeOfLifeView })), 'EthnicTreeOfLifeView');
const ResearchReportsDirectoryView = lazyWithRetry(() => import('./views/ResearchReportsDirectoryView').then(m => ({ default: m.ResearchReportsDirectoryView })), 'ResearchReportsDirectoryView');
const ResearchReportArticleView = lazyWithRetry(() => import('./views/ResearchReportArticleView').then(m => ({ default: m.ResearchReportArticleView })), 'ResearchReportArticleView');
const PrivacySectionView = lazyWithRetry(() => import('./views/PrivacySectionView').then(m => ({ default: m.PrivacySectionView })), 'PrivacySectionView');

const REGION_ID_TO_NAME: Record<string, AfricanRegion> = {
  'region-northern': 'Northern Africa',
  'region-western': 'Western Africa',
  'region-central': 'Central Africa',
  'region-eastern': 'Eastern Africa',
  'region-southern': 'Southern Africa'
};

const parseUrlHash = (): { tab: CanonicalNavTab; entityId?: string; region?: AfricanRegion; indicator?: string } => {
  if (typeof window === 'undefined') return { tab: 'overview' };
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (!hash) return { tab: 'overview' };

  if (hash.startsWith('countries/') || hash.startsWith('country/')) {
    const parts = hash.split('/');
    const code = (parts[1] || 'NGA').toUpperCase();
    return { tab: 'countries', entityId: code };
  }

  if (hash.startsWith('regions/') || hash.startsWith('region/')) {
    const rawRegion = decodeURIComponent(hash.replace(/^(regions|region)\//, ''));
    if (['Northern Africa', 'Western Africa', 'Central Africa', 'Eastern Africa', 'Southern Africa'].includes(rawRegion)) {
      return { tab: 'regions', region: rawRegion as AfricanRegion };
    }
    return { tab: 'regions' };
  }

  if (hash.startsWith('region-')) {
    const mapped = REGION_ID_TO_NAME[hash];
    return { tab: hash as CanonicalNavTab, region: mapped };
  }

  if (hash.startsWith('analytics')) {
    const params = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
    const ind = params.get('ind') || 'NY.GDP.MKTP.CD';
    return { tab: 'analytics', indicator: ind };
  }

  return { tab: hash as CanonicalNavTab };
};

function AppContent() {
  const initialRoute = useMemo(() => parseUrlHash(), []);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('atlas_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Canonical Navigation Tab State (starts at URL route or 'overview')
  const [currentTab, setCurrentTab] = useState<CanonicalNavTab>(initialRoute.tab || 'overview');
  
  // Active selected country
  const [selectedEntityId, setSelectedEntityId] = useState<string>(initialRoute.entityId || 'NGA');
  
  // Deep-linked region for RegionalView
  const [activeRegion, setActiveRegion] = useState<AfricanRegion | undefined>(initialRoute.region);
  
  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  
  // Multilateral Data APIs & Ingestion Hub modal state
  const [isApiHubOpen, setIsApiHubOpen] = useState<boolean>(false);

  // 3-Screen Curated Orientation & Historical Context Consent Modal (Auto-open for new users)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('africalia_onboarding_v1') !== 'true';
    } catch {
      return true;
    }
  });
  
  // Analytics selected indicator
  const [selectedIndicatorForAnalytics, setSelectedIndicatorForAnalytics] = useState<string>(initialRoute.indicator || 'NY.GDP.MKTP.CD');

  // Desktop Drawer starts open by default. It remains open on nav clicks; only Menu toggles it.
  const [isDesktopDrawerOpen, setIsDesktopDrawerOpen] = useState<boolean>(true);
  
  // Mobile Bottom Navigation Sheet
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Navigation History Stack for Top Bar Back Button & Alt+Left Shortcut
  const [navHistory, setNavHistory] = useState<Array<{
    tab: CanonicalNavTab;
    entityId?: string;
    region?: AfricanRegion;
    indicator?: string;
  }>>([]);

  // Background idle preloader for views to make navigation instantaneous
  useEffect(() => {
    const idlePreload = () => {
      const viewsToPreload = [
        ExploreView,
        AnalyticsView,
        MapView,
        SlaveTradeView,
        ThematicPillarsView,
        LanguagesView,
        HeritageView,
        CompareView,
        EthnicTreeOfLifeView,
        ResearchReportsDirectoryView,
      ];
      for (const view of viewsToPreload) {
        try {
          const promise = view.preload?.();
          if (promise && typeof promise.catch === 'function') {
            promise.catch(() => {});
          }
        } catch {
          // Safe catch
        }
      }
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(idlePreload, { timeout: 2500 });
      } else {
        setTimeout(idlePreload, 1200);
      }
    }
  }, []);

  // Synchronize theme with <html> class, data-theme attribute, and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('atlas_theme', theme);
  }, [theme]);

  // Synchronize active app state with URL hash for seamless bookmarking & deep linking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let targetHash = currentTab as string;
    if (currentTab === 'countries' && selectedEntityId) {
      targetHash = `countries/${selectedEntityId}`;
    } else if (currentTab === 'regions' && activeRegion) {
      targetHash = `regions/${encodeURIComponent(activeRegion)}`;
    } else if (currentTab === 'analytics' && selectedIndicatorForAnalytics) {
      targetHash = `analytics?ind=${encodeURIComponent(selectedIndicatorForAnalytics)}`;
    }

    const currentHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (currentHash !== targetHash) {
      window.history.replaceState(null, '', `#${targetHash}`);
    }
  }, [currentTab, selectedEntityId, activeRegion, selectedIndicatorForAnalytics]);

  // Listen to browser hash navigation (Back/Forward buttons & external hash links)
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseUrlHash();
      React.startTransition(() => {
        setCurrentTab(parsed.tab);
        if (parsed.entityId) setSelectedEntityId(parsed.entityId);
        if (parsed.region) setActiveRegion(parsed.region);
        if (parsed.indicator) setSelectedIndicatorForAnalytics(parsed.indicator);
      });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Keyboard shortcut: Cmd+K / Ctrl+K opens quick search; Cmd+B / Ctrl+B toggles navigation drawer; Alt+Left goes back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (window.innerWidth >= 768) {
          setIsDesktopDrawerOpen(prev => !prev);
        } else {
          setIsMobileNavOpen(prev => !prev);
        }
      }
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleGoBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navHistory, currentTab, selectedEntityId, activeRegion, selectedIndicatorForAnalytics]);

  // Menu Toggle handler (always visible in navbar, no visible label)
  const handleToggleMenu = () => {
    if (window.innerWidth >= 768) {
      // Desktop: toggle desktop drawer
      setIsDesktopDrawerOpen(prev => !prev);
    } else {
      // Mobile: open bottom navigation sheet
      setIsMobileNavOpen(prev => !prev);
    }
  };

  // High-performance canonical tab navigation handler
  const handleSelectTab = (tab: CanonicalNavTab) => {
    if (tab === currentTab) return;
    setNavHistory(prev => [
      ...prev.slice(-30),
      {
        tab: currentTab,
        entityId: selectedEntityId,
        region: activeRegion,
        indicator: selectedIndicatorForAnalytics
      }
    ]);
    React.startTransition(() => {
      setCurrentTab(tab);
      
      // If selecting a specific region, set the activeRegion for RegionalView
      if (tab.startsWith('region-') && REGION_ID_TO_NAME[tab]) {
        setActiveRegion(REGION_ID_TO_NAME[tab]);
      } else if (tab === 'regions') {
        setActiveRegion(undefined);
      }
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectCountry = (id: string) => {
    const formattedId = id.toUpperCase();
    if (formattedId === selectedEntityId && currentTab === 'countries') return;
    setNavHistory(prev => [
      ...prev.slice(-30),
      {
        tab: currentTab,
        entityId: selectedEntityId,
        region: activeRegion,
        indicator: selectedIndicatorForAnalytics
      }
    ]);
    React.startTransition(() => {
      setSelectedEntityId(formattedId);
      setCurrentTab('countries');
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectIndicator = (indId: string) => {
    if (indId === selectedIndicatorForAnalytics && currentTab === 'analytics') return;
    setNavHistory(prev => [
      ...prev.slice(-30),
      {
        tab: currentTab,
        entityId: selectedEntityId,
        region: activeRegion,
        indicator: selectedIndicatorForAnalytics
      }
    ]);
    React.startTransition(() => {
      setSelectedIndicatorForAnalytics(indId);
      setCurrentTab('analytics');
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleGoBack = () => {
    if (navHistory.length > 0) {
      const lastItem = navHistory[navHistory.length - 1];
      setNavHistory(prev => prev.slice(0, -1));
      React.startTransition(() => {
        setCurrentTab(lastItem.tab);
        if (lastItem.entityId) setSelectedEntityId(lastItem.entityId);
        if (lastItem.region) setActiveRegion(lastItem.region);
        if (lastItem.indicator) setSelectedIndicatorForAnalytics(lastItem.indicator);
      });
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (currentTab !== 'overview') {
      React.startTransition(() => {
        setCurrentTab('overview');
      });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const canGoBack = navHistory.length > 0 || currentTab !== 'overview';
  const previousHistoryItem = navHistory.length > 0 ? navHistory[navHistory.length - 1] : null;
  const previousPageTitle = previousHistoryItem
    ? getPageInfo(previousHistoryItem.tab, previousHistoryItem.entityId, previousHistoryItem.region).shortTitle
    : (currentTab !== 'overview' ? 'Overview' : undefined);

  // Check if current tab is a regional tab
  const isRegionalTab = currentTab === 'regions' || currentTab.startsWith('region-');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-zinc-950 transition-colors duration-200">
      {/* Top Application Navbar (Always visible Menu button with no visible label) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        selectedEntityId={selectedEntityId}
        onSelectCountry={handleSelectCountry}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleMenu={handleToggleMenu}
        isDrawerOpen={isDesktopDrawerOpen}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenApiHub={() => setIsApiHubOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        activeRegion={activeRegion}
        onGoBack={handleGoBack}
        canGoBack={canGoBack}
        previousPageTitle={previousPageTitle}
      />

      {/* Main Workspace Layout with Desktop Navigation Drawer & Content */}
      <div className="flex-1 w-full flex relative">
        {/* Docked Drawer Toggle Button (Positioned just under top bar, aligned under the logo when collapsed) */}
        {!isDesktopDrawerOpen && (
          <button
            onClick={handleToggleMenu}
            className="hidden lg:flex fixed top-[4.75rem] left-3 sm:left-6 lg:left-8 z-30 p-2 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-900/95 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 shadow-md backdrop-blur-md transition-all duration-200 cursor-pointer items-center justify-center hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            title="Expand Navigation Drawer (⌘B)"
            aria-label="Expand Navigation Drawer"
          >
            <DynamicIcon icon="codicon:layout-sidebar-right-dock" className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>
        )}

        {/* Mobile Floating Drawer Trigger (Aligned under the logo) */}
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="lg:hidden fixed bottom-5 left-4 z-40 p-3 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-900/95 text-zinc-800 dark:text-zinc-200 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-mono font-bold cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Open Navigation Menu"
        >
          <DynamicIcon icon="codicon:layout-sidebar-right-dock" className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Menu</span>
        </button>

        {/* Desktop Navigation Drawer (Starts open, 272px width, doesn't close on tab clicks) + Mobile Bottom Sheet */}
        <NavigationDrawer
          currentTab={currentTab}
          activeRegion={activeRegion}
          onSelectTab={handleSelectTab}
          isDesktopOpen={isDesktopDrawerOpen}
          onToggleDesktop={handleToggleMenu}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 min-w-0 w-full ${
            currentTab === 'map' || currentTab === 'ethnic-tree'
              ? 'p-0 max-w-none flex flex-col'
              : 'px-4 sm:px-6 lg:px-8 py-6 md:py-8 max-w-[1440px] mx-auto'
          }`}
          id="main-content-workspace"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`view-${currentTab}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex-1 flex flex-col"
            >
              <ViewErrorBoundary fallbackTitle="Module Unavailable">
                <Suspense fallback={<MainContentSkeleton viewType={currentTab} />}>
                  {currentTab === 'overview' && (
                    <OverviewView
                      onSelectCountry={handleSelectCountry}
                      onNavigateTab={(tab) => handleSelectTab(tab as CanonicalNavTab)}
                    />
                  )}

                  {currentTab === 'explore' && (
                    <ExploreView
                      onSelectCountry={handleSelectCountry}
                    />
                  )}

                  {currentTab === 'slave-trade' && (
                    <SlaveTradeView 
                      onNavigateToMolecular={() => handleSelectTab('molecular-legacies')}
                      onNavigateToFoundations={() => handleSelectTab('african-development-foundations')}
                    />
                  )}

                  {currentTab === 'molecular-legacies' && (
                    <MolecularLegaciesArticleView 
                      onNavigateToAtlas={() => handleSelectTab('slave-trade')}
                      onNavigateToFoundations={() => handleSelectTab('african-development-foundations')}
                    />
                  )}

                  {currentTab === 'african-development-foundations' && (
                    <AfricanDevelopmentMasterReportView 
                      onNavigateToAtlas={() => handleSelectTab('slave-trade')}
                      onNavigateToMolecular={() => handleSelectTab('molecular-legacies')}
                    />
                  )}

                  {isRegionalTab && (
                    <RegionalView
                      onSelectCountry={handleSelectCountry}
                      initialRegion={activeRegion}
                      onSelectRegion={setActiveRegion}
                    />
                  )}

                  {currentTab === 'pillars' && (
                    <ThematicPillarsView
                      initialEntityId={selectedEntityId}
                      onSelectCountry={handleSelectCountry}
                      onNavigateTab={(tab) => handleSelectTab(tab as CanonicalNavTab)}
                    />
                  )}

                  {currentTab === 'blocs' && (
                    <EntityBlocsBrowser
                      onSelectCountry={handleSelectCountry}
                      initialBlocId="ECOWAS"
                    />
                  )}

                  {currentTab === 'analytics' && (
                    <AnalyticsView
                      onSelectCountry={handleSelectCountry}
                      initialIndicatorId={selectedIndicatorForAnalytics}
                    />
                  )}

                  {currentTab === 'map' && (
                    <MapView
                      onSelectCountry={handleSelectCountry}
                      selectedEntityId={selectedEntityId}
                    />
                  )}

                  {currentTab === 'languages' && (
                    <LanguagesView
                      onSelectCountry={handleSelectCountry}
                    />
                  )}

                  {currentTab === 'heritage' && (
                    <HeritageView
                      onSelectCountry={handleSelectCountry}
                    />
                  )}

                  {currentTab === 'countries' && (
                    <CountryView
                      entityId={selectedEntityId}
                      onSelectCountry={handleSelectCountry}
                      onSelectIndicator={handleSelectIndicator}
                    />
                  )}

                  {currentTab === 'compare' && (
                    <CompareView
                      onSelectCountry={handleSelectCountry}
                    />
                  )}

                  {currentTab === 'provenance' && (
                    <ProvenanceQualityView />
                  )}

                  {currentTab === 'privacy' && (
                    <PrivacySectionView 
                      onBackToOverview={() => handleSelectTab('overview')}
                      onNavigateTab={(tab) => handleSelectTab(tab)}
                    />
                  )}

                  {currentTab === 'ethnic-tree' && (
                    <EthnicTreeOfLifeView
                      onSelectReport={(reportId) => handleSelectTab(reportId as CanonicalNavTab)}
                      onNavigateToSlaveTrade={() => handleSelectTab('slave-trade')}
                      onNavigateToMolecular={() => handleSelectTab('molecular-legacies')}
                      onNavigateToFoundations={() => handleSelectTab('african-development-foundations')}
                      onNavigateToLanguages={() => handleSelectTab('languages')}
                    />
                  )}

                  {currentTab === 'research-directory' && (
                    <ResearchReportsDirectoryView
                      onSelectReport={(reportId) => handleSelectTab(reportId as CanonicalNavTab)}
                      onNavigateToEthnicTree={() => handleSelectTab('ethnic-tree')}
                      onNavigateToSlaveTrade={() => handleSelectTab('slave-trade')}
                      onNavigateToMolecular={() => handleSelectTab('molecular-legacies')}
                      onNavigateToFoundations={() => handleSelectTab('african-development-foundations')}
                    />
                  )}

                  {typeof currentTab === 'string' && currentTab.startsWith('report-') && (
                    <ResearchReportArticleView
                      reportId={currentTab}
                      onBackToDirectory={() => handleSelectTab('research-directory')}
                      onNavigateToEthnicTree={() => handleSelectTab('ethnic-tree')}
                      onNavigateToSlaveTrade={() => handleSelectTab('slave-trade')}
                      onSelectOtherReport={(otherId) => handleSelectTab(otherId as CanonicalNavTab)}
                    />
                  )}
                </Suspense>
              </ViewErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCountry={handleSelectCountry}
        onSelectIndicator={handleSelectIndicator}
      />

      {/* Multilateral Data APIs & Ingestion Hub Modal */}
      <MultiSourceApiHubModal
        isOpen={isApiHubOpen}
        onClose={() => setIsApiHubOpen(false)}
        onSelectIndicator={handleSelectIndicator}
      />

      {/* 3-Screen Curated Orientation & Historical Context Consent Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onNavigate={(targetTab) => {
          setIsOnboardingOpen(false);
          handleSelectTab(targetTab);
        }}
      />

      {/* Structured Credibility Footer (Hidden on map view for edge-to-edge cartographic full-screen) */}
      {currentTab !== 'map' && <Footer onNavigateTab={handleSelectTab} />}

      {/* Offline Status Toast / Banner */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <DensityProvider>
      <SavedEntitiesProvider>
        <AppContent />
      </SavedEntitiesProvider>
    </DensityProvider>
  );
}
