import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { NavigationDrawer, CanonicalNavTab } from './components/NavigationDrawer';
import { SearchModal } from './components/SearchModal';
import { MainContentSkeleton } from './components/MainContentSkeleton';
import { Footer } from './components/Footer';
import { DensityProvider } from './contexts/DensityContext';
import { SavedEntitiesProvider } from './contexts/SavedEntitiesContext';
import { OverviewView } from './views/OverviewView';
import { CountryView } from './views/CountryView';
import { RegionalView } from './views/RegionalView';
import { AfricanRegion } from './data/types';
import { atlas } from './data/atlas-store';
import { Globe, Database } from 'lucide-react';

// Lazy-load heavier views to optimize initial bundle
const AnalyticsView = lazy(() => import('./views/AnalyticsView').then(m => ({ default: m.AnalyticsView })));
const HeritageView = lazy(() => import('./views/HeritageView').then(m => ({ default: m.HeritageView })));
const CompareView = lazy(() => import('./views/CompareView').then(m => ({ default: m.CompareView })));
const ProvenanceQualityView = lazy(() => import('./views/ProvenanceQualityView').then(m => ({ default: m.ProvenanceQualityView })));
const MapView = lazy(() => import('./views/MapView').then(m => ({ default: m.MapView })));
const LanguagesView = lazy(() => import('./views/LanguagesView').then(m => ({ default: m.LanguagesView })));
const ExploreView = lazy(() => import('./views/ExploreView').then(m => ({ default: m.ExploreView })));
const ThematicPillarsView = lazy(() => import('./views/ThematicPillarsView').then(m => ({ default: m.ThematicPillarsView })));
const EntityBlocsBrowser = lazy(() => import('./components/EntityBlocsBrowser').then(m => ({ default: m.EntityBlocsBrowser })));

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
  
  // Analytics selected indicator
  const [selectedIndicatorForAnalytics, setSelectedIndicatorForAnalytics] = useState<string>('NY.GDP.MKTP.CD');

  // Desktop Drawer starts open by default. It remains open on nav clicks; only Menu toggles it.
  const [isDesktopDrawerOpen, setIsDesktopDrawerOpen] = useState<boolean>(true);
  
  // Mobile Bottom Navigation Sheet
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Helper to trigger brief transition skeleton loader for perceived performance
  const startTransition = (callback: () => void) => {
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }
    setIsTransitioning(true);
    callback();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    transitionTimerRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  // Synchronize theme with <html> class and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('atlas_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Keyboard shortcut: Cmd+K / Ctrl+K opens quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
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
      />

      {/* Main Workspace Layout with Desktop Navigation Drawer & Content */}
      <div className="flex-1 w-full flex">
        {/* Desktop Navigation Drawer (Starts open, 272px width, doesn't close on tab clicks) + Mobile Bottom Sheet */}
        <NavigationDrawer
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          isDesktopOpen={isDesktopDrawerOpen}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 md:py-8 max-w-7xl mx-auto w-full" id="main-content-workspace">
          {isTransitioning ? (
            <MainContentSkeleton viewType={currentTab} />
          ) : (
            <>
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

              {isRegionalTab && (
                <RegionalView
                  onSelectCountry={handleSelectCountry}
                  initialRegion={activeRegion}
                />
              )}

              <Suspense fallback={<MainContentSkeleton />}>
                {currentTab === 'pillars' && (
                  <ThematicPillarsView
                    initialEntityId={selectedEntityId}
                    onSelectCountry={handleSelectCountry}
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
              </Suspense>
            </>
          )}
        </main>
      </div>

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCountry={handleSelectCountry}
        onSelectIndicator={handleSelectIndicator}
      />

      {/* Structured Credibility Footer */}
      <Footer onNavigateTab={handleSelectTab} />
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
