import React, { useState, useEffect, useRef, Suspense } from 'react';
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
import { CountryView } from './views/CountryView';
import { RegionalView } from './views/RegionalView';
import { AfricanRegion } from './data/types';
import { atlas } from './data/atlas-store';
import { lazyWithRetry, ViewErrorBoundary } from './utils/lazyWithRetry';
import { Globe, Database } from 'lucide-react';
import { DynamicIcon } from './components/DynamicIcon';

// Lazy-load heavier views with automatic chunk recovery and cache resilience for GitHub Pages
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

function AppContent() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('atlas_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  // Canonical Navigation Tab State (starts at 'overview')
  const [currentTab, setCurrentTab] = useState<CanonicalNavTab>('overview');
  
  // Transition loading state for main content area
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const transitionTimerRef = useRef<number | null>(null);
  
  // Active selected country (Nigeria as default initial)
  const [selectedEntityId, setSelectedEntityId] = useState<string>('NGA');
  
  // Deep-linked region for RegionalView
  const [activeRegion, setActiveRegion] = useState<AfricanRegion | undefined>(undefined);
  
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
  const [selectedIndicatorForAnalytics, setSelectedIndicatorForAnalytics] = useState<string>('NY.GDP.MKTP.CD');

  // Desktop Drawer starts open by default. It remains open on nav clicks; only Menu toggles it.
  const [isDesktopDrawerOpen, setIsDesktopDrawerOpen] = useState<boolean>(true);
  
  // Mobile Bottom Navigation Sheet
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Helper to trigger brief transition skeleton loader and native View Transitions for smooth morphing
  const startTransition = (callback: () => void) => {
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }
    
    // Future-proof CSS View Transitions API (Chrome 111+) with graceful fallback
    const execute = () => {
      setIsTransitioning(true);
      callback();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      transitionTimerRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
      }, 180);
    };

    if (typeof document !== 'undefined' && 'startViewTransition' in document && typeof (document as any).startViewTransition === 'function') {
      try {
        (document as any).startViewTransition(() => {
          execute();
        });
        return;
      } catch {
        execute();
      }
    } else {
      execute();
    }
  };

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
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

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Keyboard shortcut: Cmd+K / Ctrl+K opens quick search; Cmd+B / Ctrl+B toggles navigation drawer
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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // Canonical Tab Selection Handler
  const handleSelectTab = (tab: CanonicalNavTab) => {
    startTransition(() => {
      setCurrentTab(tab);
      
      // If selecting a specific region, set the activeRegion for RegionalView
      if (tab.startsWith('region-') && REGION_ID_TO_NAME[tab]) {
        setActiveRegion(REGION_ID_TO_NAME[tab]);
      } else if (tab === 'regions') {
        setActiveRegion(undefined);
      }
    });
    // Note: Desktop drawer remains open as per requirements!
  };

  const handleSelectCountry = (id: string) => {
    startTransition(() => {
      setSelectedEntityId(id.toUpperCase());
      setCurrentTab('countries');
    });
  };

  const handleSelectIndicator = (indId: string) => {
    startTransition(() => {
      setSelectedIndicatorForAnalytics(indId);
      setCurrentTab('analytics');
    });
  };

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
            <DynamicIcon icon="codicon:layout-sidebar-left-dock" className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>
        )}

        {/* Mobile Floating Drawer Trigger (Aligned under the logo) */}
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="lg:hidden fixed bottom-5 left-4 z-40 p-3 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-900/95 text-zinc-800 dark:text-zinc-200 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-mono font-bold cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Open Navigation Menu"
        >
          <DynamicIcon icon="codicon:layout-sidebar-left-dock" className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Menu</span>
        </button>

        {/* Desktop Navigation Drawer (Starts open, 272px width, doesn't close on tab clicks) + Mobile Bottom Sheet */}
        <NavigationDrawer
          currentTab={currentTab}
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
            {isTransitioning ? (
              <motion.div
                key={`skeleton-${currentTab}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ 
                  opacity: 0, 
                  filter: 'blur(4px)',
                  transition: { duration: 0.22, ease: 'easeOut' } 
                }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="w-full flex-1 flex flex-col"
              >
                <MainContentSkeleton viewType={currentTab} />
              </motion.div>
            ) : (
              <motion.div
                key={`view-${currentTab}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex-1 flex flex-col"
              >
                <ViewErrorBoundary fallbackTitle="Module Unavailable">
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
                    <Suspense fallback={<MainContentSkeleton viewType={currentTab} />}>
                      <SlaveTradeView 
                        onNavigateToMolecular={() => handleSelectTab('molecular-legacies')}
                        onNavigateToFoundations={() => handleSelectTab('african-development-foundations')}
                      />
                    </Suspense>
                  )}

                  {currentTab === 'molecular-legacies' && (
                    <Suspense fallback={<MainContentSkeleton viewType={currentTab} />}>
                      <MolecularLegaciesArticleView 
                        onNavigateToAtlas={() => handleSelectTab('slave-trade')}
                        onNavigateToFoundations={() => handleSelectTab('african-development-foundations')}
                      />
                    </Suspense>
                  )}

                  {currentTab === 'african-development-foundations' && (
                    <Suspense fallback={<MainContentSkeleton viewType={currentTab} />}>
                      <AfricanDevelopmentMasterReportView 
                        onNavigateToAtlas={() => handleSelectTab('slave-trade')}
                        onNavigateToMolecular={() => handleSelectTab('molecular-legacies')}
                      />
                    </Suspense>
                  )}

                  {isRegionalTab && (
                    <RegionalView
                      onSelectCountry={handleSelectCountry}
                      initialRegion={activeRegion}
                    />
                  )}

                  <Suspense fallback={<MainContentSkeleton viewType={currentTab} />}>
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
                      <Suspense fallback={<MainContentSkeleton viewType={currentTab} />}>
                        <PrivacySectionView 
                          onBackToOverview={() => handleSelectTab('overview')}
                          onNavigateTab={(tab) => handleSelectTab(tab)}
                        />
                      </Suspense>
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
            )}
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
