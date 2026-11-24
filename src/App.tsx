import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { LazyMotion, MotionConfig, domAnimation, m } from 'motion/react';
import { Navbar } from './components/Navbar';
import type { CanonicalNavTab } from './components/NavigationDrawer';
import type { SlaveTradeSubTab } from './views/SlaveTradeView';
import { MainContentSkeleton } from './components/MainContentSkeleton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DensityProvider } from './contexts/DensityContext';
import { SavedEntitiesProvider } from './contexts/SavedEntitiesContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { AfricanRegion } from './data/types';
import { lazyWithRetry, ViewErrorBoundary } from './utils/lazyWithRetry';
import { runViewTransition } from './utils/motion';
import { PanelLeftOpen } from 'lucide-react';
import { getPageInfo, isReportOrPaperTab } from './utils/navigationTitles';
import { MobileBottomNav } from './components/MobileBottomNav';
import { resolveAppBasePath } from './utils/assetPath';
import { readStorageString, writeStorageString } from './utils/storageCache';

const NavigationDrawer = lazyWithRetry(() => import('./components/NavigationDrawer').then(m => ({ default: m.NavigationDrawer })), 'NavigationDrawer');
const Footer = lazyWithRetry(() => import('./components/Footer').then(m => ({ default: m.Footer })), 'Footer');
const OverviewView = lazyWithRetry(() => import('./views/OverviewView').then(m => ({ default: m.OverviewView })), 'OverviewView');

// Centralized Modal Orchestration
import { AtlasModalContainer } from './components/AtlasModalContainer';
import { atlasModalStore } from './stores/useAtlasModalStore';

// Dynamic chunk descriptors orchestrated via AtlasModalContainer
// (Preserved for feature inventory and build chunk trace)
const _lazyModalCatalog = () => [
  import('./components/SearchModal'),
  import('./components/MultiSourceApiHubModal'),
  import('./components/OnboardingModal'),
  import('./components/KeyboardShortcutsModal'),
  import('./components/UniversalMonographModal'),
  import('./components/CartographicColophonModal'),
  import('./components/WorkingPapersModal'),
  import('./components/AcademicExportModal'),
  import('./components/MethodologyAuditModal'),
  import('./components/afcfta/AfcftaSimulatorModal'),
  import('./components/CitePublicationModal'),
  import('./components/DoiVerificationModal'),
];
void _lazyModalCatalog;

// Lazy-load heavier views with automatic chunk recovery and cache resilience for GitHub Pages
const CountryView = lazyWithRetry(() => import('./views/CountryView').then(m => ({ default: m.CountryView || (m as any).default })), 'CountryView');
const RegionalView = lazyWithRetry(() => import('./views/RegionalView').then(m => ({ default: m.RegionalView || (m as any).default })), 'RegionalView');
const AnalyticsView = lazyWithRetry(() => import('./views/AnalyticsView').then(m => ({ default: m.AnalyticsView || (m as any).default })), 'AnalyticsView');
const HeritageView = lazyWithRetry(() => import('./views/HeritageView').then(m => ({ default: m.HeritageView || (m as any).default })), 'HeritageView');
const CompareView = lazyWithRetry(() => import('./views/CompareView').then(m => ({ default: m.CompareView || (m as any).default })), 'CompareView');
const ProvenanceQualityView = lazyWithRetry(() => import('./views/ProvenanceQualityView').then(m => ({ default: m.ProvenanceQualityView || (m as any).default })), 'ProvenanceQualityView');
const MapView = lazyWithRetry(() => import('./views/MapView').then(m => ({ default: m.MapView || (m as any).default })), 'MapView');
const LanguagesView = lazyWithRetry(() => import('./views/LanguagesView').then(m => ({ default: m.LanguagesView || (m as any).default })), 'LanguagesView');
const ExploreView = lazyWithRetry(() => import('./views/ExploreView').then(m => ({ default: m.ExploreView || (m as any).default })), 'ExploreView');
const SlaveTradeView = lazyWithRetry(() => import('./views/SlaveTradeView').then(m => ({ default: m.SlaveTradeView || (m as any).default })), 'SlaveTradeView');
const IconographyView = lazyWithRetry(() => import('./views/IconographyView').then(m => ({ default: m.IconographyView || (m as any).default })), 'IconographyView');
const ArchivalCartographyView = lazyWithRetry(() => import('./views/ArchivalCartographyView').then(m => ({ default: m.ArchivalCartographyView || (m as any).default })), 'ArchivalCartographyView');
const MolecularLegaciesArticleView = lazyWithRetry(() => import('./views/MolecularLegaciesArticleView').then(m => ({ default: m.MolecularLegaciesArticleView || (m as any).default })), 'MolecularLegaciesArticleView');
const AfricanDevelopmentMasterReportView = lazyWithRetry(() => import('./views/AfricanDevelopmentMasterReportView').then(m => ({ default: m.AfricanDevelopmentMasterReportView || (m as any).default })), 'AfricanDevelopmentMasterReportView');
const ThematicPillarsView = lazyWithRetry(() => import('./views/ThematicPillarsView').then(m => ({ default: m.ThematicPillarsView || (m as any).default })), 'ThematicPillarsView');
const EntityBlocsBrowser = lazyWithRetry(() => import('./components/EntityBlocsBrowser').then(m => ({ default: m.EntityBlocsBrowser || (m as any).default })), 'EntityBlocsBrowser');
const EthnicTreeOfLifeView = lazyWithRetry(() => import('./views/EthnicTreeOfLifeView').then(m => ({ default: m.EthnicTreeOfLifeView || (m as any).default })), 'EthnicTreeOfLifeView');
const UniversalStyleGuideView = lazyWithRetry(() => import('./views/UniversalStyleGuideView').then(m => ({ default: m.UniversalStyleGuideView || (m as any).default })), 'UniversalStyleGuideView');
const ResearchReportsDirectoryView = lazyWithRetry(() => import('./views/ResearchReportsDirectoryView').then(m => ({ default: m.ResearchReportsDirectoryView || (m as any).default })), 'ResearchReportsDirectoryView');
const ResearchReportArticleView = lazyWithRetry(() => import('./views/ResearchReportArticleView').then(m => ({ default: m.ResearchReportArticleView || (m as any).default })), 'ResearchReportArticleView');
const PrivacySectionView = lazyWithRetry(() => import('./views/PrivacySectionView').then(m => ({ default: m.PrivacySectionView || (m as any).default })), 'PrivacySectionView');

const preloadTabView = (rawTab: CanonicalNavTab | string): void => {
  const baseTab = String(rawTab).split('?')[0];
  if (!baseTab) return;
  if (baseTab === 'regions' || baseTab.startsWith('region-')) {
    RegionalView.preload();
    return;
  }
  if (isReportOrPaperTab(baseTab)) {
    ResearchReportArticleView.preload();
    return;
  }
  switch (baseTab) {
    case 'overview': OverviewView.preload(); break;
    case 'explore': ExploreView.preload(); break;
    case 'countries': CountryView.preload(); break;
    case 'analytics': AnalyticsView.preload(); break;
    case 'heritage': HeritageView.preload(); break;
    case 'compare': CompareView.preload(); break;
    case 'provenance': ProvenanceQualityView.preload(); break;
    case 'map': MapView.preload(); break;
    case 'languages': LanguagesView.preload(); break;
    case 'slave-trade': SlaveTradeView.preload(); break;
    case 'iconography': IconographyView.preload(); break;
    case 'archival-cartography': ArchivalCartographyView.preload(); break;
    case 'molecular-legacies': MolecularLegaciesArticleView.preload(); break;
    case 'african-development-foundations': AfricanDevelopmentMasterReportView.preload(); break;
    case 'pillars': ThematicPillarsView.preload(); break;
    case 'blocs': EntityBlocsBrowser.preload(); break;
    case 'ethnic-tree': EthnicTreeOfLifeView.preload(); break;
    case 'style-guide': UniversalStyleGuideView.preload(); break;
    case 'research-directory': ResearchReportsDirectoryView.preload(); break;
    case 'privacy': PrivacySectionView.preload(); break;
  }
};

const REGION_ID_TO_NAME: Record<string, AfricanRegion> = {
  'region-northern': 'Northern Africa',
  'region-western': 'Western Africa',
  'region-central': 'Central Africa',
  'region-eastern': 'Eastern Africa',
  'region-southern': 'Southern Africa'
};

const parseUrlHash = (): { 
  tab: CanonicalNavTab; 
  entityId?: string; 
  region?: AfricanRegion; 
  indicator?: string;
  plateId?: string;
  searchQuery?: string;
  siteId?: number;
  compareCountries?: string[];
  kingdomId?: string;
  langId?: string;
} => {
  if (typeof window === 'undefined') return { tab: 'overview' };
  const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
  const windowParams = new URLSearchParams(window.location.search);

  let hash = rawHash;
  if (!hash || hash.startsWith('?')) {
    const hashParams = hash.startsWith('?') ? new URLSearchParams(hash.slice(1)) : null;
    const tabFromQuery = (hashParams?.get('tab') || windowParams.get('tab') || '').replace(/^#\/?/, '').trim();
    const queryStr = hash.startsWith('?') ? hash.slice(1) : window.location.search.replace(/^\?/, '');
    if (tabFromQuery) {
      hash = queryStr ? `${tabFromQuery}?${queryStr}` : tabFromQuery;
    } else if (!hash) {
      const basePath = resolveAppBasePath();
      const pathname = window.location.pathname || '/';
      const baseNoTrailing = basePath === '/' ? '' : basePath.slice(0, -1);
      let pathRoute = '';
      if (pathname.startsWith(basePath)) {
        pathRoute = pathname.slice(basePath.length);
      } else if (baseNoTrailing && pathname === baseNoTrailing) {
        pathRoute = '';
      }
      pathRoute = pathRoute.replace(/^\/+|\/+$/g, '');
      if (pathRoute === 'index.html') {
        pathRoute = '';
      }
      if (pathRoute) {
        hash = queryStr ? `${pathRoute}?${queryStr}` : pathRoute;
      } else {
        return { tab: 'overview' };
      }
    }
  }

  const [hashRouteRaw, hashQuery = ''] = hash.split('?');
  const hashRoute = hashRouteRaw.replace(/\/+$/, '');
  const getCombinedParams = () => new URLSearchParams(hashQuery || window.location.search.replace(/^\?/, ''));

  if (hashRoute.startsWith('heritage')) {
    const params = getCombinedParams();
    const idParam = params.get('id');
    const siteId = idParam ? parseInt(idParam, 10) : undefined;
    return { tab: 'heritage' as CanonicalNavTab, siteId: siteId && !isNaN(siteId) ? siteId : undefined };
  }

  if (hashRoute.startsWith('countries/') || hashRoute.startsWith('country/')) {
    const parts = hashRoute.split('/');
    const code = (parts[1] || 'NGA').toUpperCase();
    return { tab: 'countries', entityId: code };
  }

  if (hashRoute.startsWith('regions/') || hashRoute.startsWith('region/')) {
    const rawRegion = decodeURIComponent(hashRoute.replace(/^(regions|region)\//, ''));
    if (['Northern Africa', 'Western Africa', 'Central Africa', 'Eastern Africa', 'Southern Africa'].includes(rawRegion)) {
      return { tab: 'regions', region: rawRegion as AfricanRegion };
    }
    return { tab: 'regions' };
  }

  if (hashRoute.startsWith('region-')) {
    const mapped = REGION_ID_TO_NAME[hashRoute];
    return { tab: hashRoute as CanonicalNavTab, region: mapped };
  }

  if (hashRoute.startsWith('analytics')) {
    const params = getCombinedParams();
    const ind = params.get('ind') || 'NY.GDP.MKTP.CD';
    return { tab: 'analytics', indicator: ind };
  }

  if (hashRoute.startsWith('iconography')) {
    const params = getCombinedParams();
    const plate = params.get('plate') || params.get('castas') || undefined;
    const q = params.get('q') || undefined;
    return { tab: 'iconography', plateId: plate, searchQuery: q };
  }

  if (hashRoute.startsWith('cartography') || hashRoute.startsWith('archival-cartography')) {
    const params = getCombinedParams();
    const plate = params.get('plate') || undefined;
    const kingdom = params.get('kingdom') || undefined;
    return { tab: 'archival-cartography', plateId: plate, kingdomId: kingdom };
  }

  if (hashRoute.startsWith('languages')) {
    const params = getCombinedParams();
    const lang = params.get('lang') || undefined;
    return { tab: 'languages', langId: lang };
  }

  if (hashRoute.startsWith('compare')) {
    const params = getCombinedParams();
    const countriesParam = params.get('countries') || params.get('c');
    const left = params.get('left');
    const right = params.get('right');
    let compareCountries: string[] | undefined = undefined;
    if (countriesParam) {
      const parsed = countriesParam.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
      if (parsed.length > 0) compareCountries = parsed;
    } else if (left || right) {
      const parsed = [left, right].filter(Boolean).map(s => s!.trim().toUpperCase());
      if (parsed.length > 0) compareCountries = parsed;
    }
    return { tab: 'compare', compareCountries };
  }

  if (hashRoute.startsWith('map')) {
    const params = getCombinedParams();
    const country = params.get('country') || params.get('c');
    const metric = params.get('metric') || params.get('ind');
    return { 
      tab: 'map', 
      entityId: country ? country.toUpperCase() : undefined,
      indicator: metric || undefined
    };
  }

  return { tab: (hashRoute || 'overview') as CanonicalNavTab };
};

if (typeof window !== 'undefined') {
  preloadTabView(parseUrlHash().tab);
  NavigationDrawer.preload();
}

function AppContent() {
  const initialRoute = useMemo(() => parseUrlHash(), []);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return readStorageString('atlas_theme') === 'dark' ? 'dark' : 'light';
  });

  // Canonical Navigation Tab State (starts at URL route or 'overview')
  const [currentTab, setCurrentTab] = useState<CanonicalNavTab>(initialRoute.tab || 'overview');
  
  // Active selected country
  const [selectedEntityId, setSelectedEntityId] = useState<string>(initialRoute.entityId || 'NGA');
  
  // Deep-linked region for RegionalView
  const [activeRegion, setActiveRegion] = useState<AfricanRegion | undefined>(initialRoute.region);
  

  
  // Analytics selected indicator
  const [selectedIndicatorForAnalytics, setSelectedIndicatorForAnalytics] = useState<string>(initialRoute.indicator || 'NY.GDP.MKTP.CD');

  // Universal Search & Deep link target for Iconography and Archival Cartography
  const [activeIconographyPlateId, setActiveIconographyPlateId] = useState<string | undefined>(initialRoute.plateId);
  const [activeArchivalPlateId, setActiveArchivalPlateId] = useState<string | undefined>(initialRoute.plateId);
  const [activeArchivalKingdomId, setActiveArchivalKingdomId] = useState<string | undefined>(initialRoute.kingdomId);
  const [activeLanguageId, setActiveLanguageId] = useState<string | undefined>(initialRoute.langId);
  const [activeIconographySearchQuery, setActiveIconographySearchQuery] = useState<string | undefined>(initialRoute.searchQuery);
  const [isIconographyIngestion, setIsIconographyIngestion] = useState(false);

  // Compare Initial Countries deep link target
  const [compareInitialCountries, setCompareInitialCountries] = useState<string[] | undefined>(initialRoute.compareCountries);

  // UNESCO Heritage Archive deep link target
  const [selectedHeritageSiteId, setSelectedHeritageSiteId] = useState<number | undefined>(initialRoute.siteId);

  // Slave Trade Active Sub-tab (to hide footer when standalone flow map or ports map is active)
  const [slaveTradeSubTab, setSlaveTradeSubTab] = useState<string>('overview');

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
  const shouldPushHistoryRef = useRef<boolean>(false);

  // Active Typographic & Conceptual Core: Economics, Archival, or Academic
  const activeCore = useMemo<'economics' | 'archival' | 'academic'>(() => {
    if (['slave-trade', 'iconography', 'archival-cartography', 'heritage'].includes(currentTab)) {
      return 'archival';
    }
    if (
      ['molecular-legacies', 'african-development-foundations', 'ethnic-tree', 'languages', 'research-directory'].includes(currentTab) ||
      (typeof currentTab === 'string' && isReportOrPaperTab(currentTab))
    ) {
      return 'academic';
    }
    return 'economics';
  }, [currentTab]);

  // Keep startup lean: views and archival assets load on demand when navigated to

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
    writeStorageString('atlas_theme', theme);
  }, [theme]);

  // Synchronize active app state with URL hash & browser history for native Back/Forward & deep linking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let targetHash = currentTab as string;
    if (currentTab === 'countries' && selectedEntityId) {
      targetHash = `countries/${selectedEntityId}`;
    } else if (currentTab === 'regions' && activeRegion) {
      targetHash = `regions/${encodeURIComponent(activeRegion)}`;
    } else if (currentTab === 'analytics' && selectedIndicatorForAnalytics) {
      targetHash = `analytics?ind=${encodeURIComponent(selectedIndicatorForAnalytics)}`;
    } else if (currentTab === 'compare') {
      targetHash = compareInitialCountries && compareInitialCountries.length > 0
        ? `compare?countries=${compareInitialCountries.join(',')}`
        : 'compare';
    } else if (currentTab === 'map') {
      targetHash = selectedEntityId ? `map?country=${selectedEntityId}` : 'map';
    } else if (currentTab === 'archival-cartography') {
      const currentHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (currentHash.startsWith('cartography') || currentHash.startsWith('archival-cartography')) {
        shouldPushHistoryRef.current = false;
        return;
      }
    } else if (currentTab === 'slave-trade') {
      const currentHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (currentHash.startsWith('slave-trade?')) {
        shouldPushHistoryRef.current = false;
        return;
      }
    } else if (currentTab === 'heritage') {
      targetHash = selectedHeritageSiteId ? `heritage?id=${selectedHeritageSiteId}` : 'heritage';
    } else if (currentTab === 'archival-cartography') {
      if (activeArchivalKingdomId) {
        targetHash = `archival-cartography?tab=kingdoms&kingdom=${activeArchivalKingdomId}`;
      } else if (activeArchivalPlateId) {
        targetHash = `archival-cartography?plate=${activeArchivalPlateId}`;
      }
    } else if (currentTab === 'languages') {
      targetHash = activeLanguageId ? `languages?lang=${activeLanguageId}` : 'languages';
    }

    const currentHash = window.location.hash.replace(/^#\/?/, '').trim();
    const basePath = resolveAppBasePath();
    const pathname = window.location.pathname || '/';
    const needsPathReset = pathname !== basePath && pathname !== `${basePath}index.html`;
    if (currentHash !== targetHash || needsPathReset) {
      const nextUrl = needsPathReset ? `${basePath}#${targetHash}` : `#${targetHash}`;
      try {
        if (shouldPushHistoryRef.current && !needsPathReset) {
          window.history.pushState(null, '', nextUrl);
        } else {
          window.history.replaceState(null, '', nextUrl);
        }
      } catch {
        // Ignore history restrictions in sandboxed/opaque-origin iframes
      }
    }
    shouldPushHistoryRef.current = false;
  }, [currentTab, selectedEntityId, activeRegion, selectedIndicatorForAnalytics, selectedHeritageSiteId, compareInitialCountries, activeArchivalKingdomId, activeArchivalPlateId, activeLanguageId]);

  // Listen to browser hash & popstate navigation (Back/Forward buttons & external hash links)
  useEffect(() => {
    const handleUrlNavigation = () => {
      shouldPushHistoryRef.current = false;
      const parsed = parseUrlHash();
      React.startTransition(() => {
        setCurrentTab(parsed.tab);
        if (parsed.entityId) setSelectedEntityId(parsed.entityId);
        if (parsed.region) setActiveRegion(parsed.region);
        else if (parsed.tab === 'regions') setActiveRegion(undefined);
        if (parsed.indicator) setSelectedIndicatorForAnalytics(parsed.indicator);
        if (parsed.plateId !== undefined) {
          setActiveIconographyPlateId(parsed.plateId);
          setActiveArchivalPlateId(parsed.plateId);
        }
        if (parsed.kingdomId !== undefined) setActiveArchivalKingdomId(parsed.kingdomId);
        if (parsed.langId !== undefined) setActiveLanguageId(parsed.langId);
        if (parsed.searchQuery !== undefined) setActiveIconographySearchQuery(parsed.searchQuery);
        if (parsed.siteId !== undefined) setSelectedHeritageSiteId(parsed.siteId);
        if (parsed.compareCountries) setCompareInitialCountries(parsed.compareCountries);
      });
    };
    window.addEventListener('hashchange', handleUrlNavigation);
    window.addEventListener('popstate', handleUrlNavigation);
    return () => {
      window.removeEventListener('hashchange', handleUrlNavigation);
      window.removeEventListener('popstate', handleUrlNavigation);
    };
  }, []);

  const toggleTheme = () => {
    runViewTransition(() => {
      setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    });
  };

  // Stable action refs for single-mount global keyboard listener
  const keyActionsRef = useRef({
    onSelectTab: (_tab: CanonicalNavTab | string) => {},
    onGoBack: () => {},
    onToggleTheme: () => {},
  });

  // Keyboard shortcuts: Cmd+K / Ctrl+K search, Cmd+B / Ctrl+B drawer, Alt+Left back, '?' shortcuts modal, 1-5 regions, 0 overview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing || e.keyCode === 229) return;
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable || target.tagName === 'SELECT');
      const hasOpenDialog = Boolean(document.querySelector('[data-dialog-open="true"]'));

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        atlasModalStore.openSearch();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (window.innerWidth >= 768) {
          setIsDesktopDrawerOpen(prev => !prev);
        } else {
          setIsMobileNavOpen(prev => !prev);
        }
        return;
      }
      if (hasOpenDialog) return;

      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        keyActionsRef.current.onGoBack();
        return;
      }

      if (!isInput) {
        // Toggle Shortcuts Modal on '?'
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
          e.preventDefault();
          atlasModalStore.openShortcuts();
          return;
        }

        // Quick UN Region jumps: 1 - 5, 0 for Continental Overview
        if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
          if (e.key === '1') {
            e.preventDefault();
            keyActionsRef.current.onSelectTab('region-northern');
          } else if (e.key === '2') {
            e.preventDefault();
            keyActionsRef.current.onSelectTab('region-western');
          } else if (e.key === '3') {
            e.preventDefault();
            keyActionsRef.current.onSelectTab('region-central');
          } else if (e.key === '4') {
            e.preventDefault();
            keyActionsRef.current.onSelectTab('region-eastern');
          } else if (e.key === '5') {
            e.preventDefault();
            keyActionsRef.current.onSelectTab('region-southern');
          } else if (e.key === '0') {
            e.preventDefault();
            keyActionsRef.current.onSelectTab('overview');
          } else if (e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            keyActionsRef.current.onToggleTheme();
          }
        }

        // Analytical Views: Shift + Key
        if (e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
          const upper = e.key.toUpperCase();
          if (upper === 'O') {
            e.preventDefault();
            keyActionsRef.current.onSelectTab('overview');
          } else if (upper === 'M') {
            e.preventDefault();
            keyActionsRef.current.onSelectTab('map');
          } else if (upper === 'C') {
            e.preventDefault();
            keyActionsRef.current.onSelectTab('compare');
          } else if (upper === 'A') {
            e.preventDefault();
            keyActionsRef.current.onSelectTab('analytics');
          } else if (upper === 'V') {
            e.preventDefault();
            keyActionsRef.current.onSelectTab('iconography');
          }
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

  const pushNavSnapshot = () => {
    shouldPushHistoryRef.current = true;
    setNavHistory(prev => [
      ...prev.slice(-30),
      {
        tab: currentTab,
        entityId: selectedEntityId,
        region: activeRegion,
        indicator: selectedIndicatorForAnalytics
      }
    ]);
  };

  const resetViewportScroll = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // High-performance canonical tab navigation handler
  const handleSelectTab = (tab: CanonicalNavTab | string) => {
    const rawTabStr = tab as string;
    const [baseTab, queryString] = rawTabStr.split('?');
    const targetTab = baseTab as CanonicalNavTab;

    if (queryString) {
      const params = new URLSearchParams(queryString);
      const plate = params.get('plate') || params.get('castas');
      const q = params.get('q');
      if (plate) {
        if (targetTab === 'archival-cartography') {
          setActiveArchivalPlateId(plate);
        } else {
          setActiveIconographyPlateId(plate);
        }
      }
      if (q) setActiveIconographySearchQuery(q);
      const heritageId = params.get('id');
      if (heritageId) {
        const parsedHeritageId = parseInt(heritageId, 10);
        if (!isNaN(parsedHeritageId)) setSelectedHeritageSiteId(parsedHeritageId);
      }
      const countriesParam = params.get('countries');
      if (countriesParam && targetTab === 'compare') {
        const parsedCountries = countriesParam
          .split(',')
          .map(c => c.trim().toUpperCase())
          .filter(Boolean);
        if (parsedCountries.length > 0) {
          setCompareInitialCountries(parsedCountries);
        }
      }
      const kingdomParam = params.get('kingdom');
      if (kingdomParam && targetTab === 'archival-cartography') {
        setActiveArchivalKingdomId(kingdomParam);
      } else if (targetTab === 'archival-cartography' && !kingdomParam) {
        setActiveArchivalKingdomId(undefined);
      }
      const langParam = params.get('lang');
      if (langParam && targetTab === 'languages') {
        setActiveLanguageId(langParam);
      }
    } else {
      if (targetTab !== 'iconography') {
        setActiveIconographyPlateId(undefined);
        setActiveIconographySearchQuery(undefined);
      }
      if (targetTab !== 'archival-cartography') {
        setActiveArchivalPlateId(undefined);
        setActiveArchivalKingdomId(undefined);
      }
      if (targetTab !== 'languages') {
        setActiveLanguageId(undefined);
      }
    }

    if (targetTab === currentTab && !queryString) return;
    pushNavSnapshot();
    React.startTransition(() => {
      setCurrentTab(targetTab);
      
      // If selecting a specific region, set the activeRegion for RegionalView
      if (targetTab.startsWith('region-') && REGION_ID_TO_NAME[targetTab]) {
        setActiveRegion(REGION_ID_TO_NAME[targetTab]);
      } else if (targetTab === 'regions') {
        setActiveRegion(undefined);
      }
    });
    resetViewportScroll();
  };

  const handleSelectCountry = (id: string) => {
    const formattedId = id.toUpperCase();
    if (formattedId === selectedEntityId && currentTab === 'countries') return;
    pushNavSnapshot();
    React.startTransition(() => {
      setSelectedEntityId(formattedId);
      setCurrentTab('countries');
    });
    resetViewportScroll();
  };

  const handleSelectIndicator = (indId: string) => {
    if (indId === selectedIndicatorForAnalytics && currentTab === 'analytics') return;
    pushNavSnapshot();
    React.startTransition(() => {
      setSelectedIndicatorForAnalytics(indId);
      setCurrentTab('analytics');
    });
    resetViewportScroll();
  };

  const handleGoBack = () => {
    if (navHistory.length > 0) {
      shouldPushHistoryRef.current = false;
      const lastItem = navHistory[navHistory.length - 1];
      setNavHistory(prev => prev.slice(0, -1));
      React.startTransition(() => {
        setCurrentTab(lastItem.tab);
        if (lastItem.entityId) setSelectedEntityId(lastItem.entityId);
        if (lastItem.region) setActiveRegion(lastItem.region);
        else if (lastItem.tab === 'regions') setActiveRegion(undefined);
        if (lastItem.indicator) setSelectedIndicatorForAnalytics(lastItem.indicator);
      });
      resetViewportScroll();
    } else if (currentTab !== 'overview') {
      shouldPushHistoryRef.current = false;
      React.startTransition(() => {
        setCurrentTab('overview');
      });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  keyActionsRef.current = {
    onSelectTab: handleSelectTab,
    onGoBack: handleGoBack,
    onToggleTheme: toggleTheme,
  };

  const canGoBack = navHistory.length > 0 || currentTab !== 'overview';
  const previousHistoryItem = navHistory.length > 0 ? navHistory[navHistory.length - 1] : null;
  const previousPageTitle = previousHistoryItem
    ? getPageInfo(previousHistoryItem.tab, previousHistoryItem.entityId, previousHistoryItem.region).shortTitle
    : (currentTab !== 'overview' ? 'Overview' : undefined);

  // Check if current tab is a regional tab
  const isRegionalTab = currentTab === 'regions' || currentTab.startsWith('region-');
  const pageInfo = getPageInfo(currentTab, selectedEntityId, activeRegion);

  useEffect(() => {
    const baseTitle = 'Afriata: Africa Data Atlas';
    document.title = currentTab === 'overview'
      ? baseTitle
      : `${pageInfo.fullTitle || pageInfo.title} — Afriata`;
  }, [currentTab, pageInfo.title, pageInfo.fullTitle]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-zinc-950 transition-colors duration-200">
      {/* Accessible Skip Navigation Link */}
      <a href="#main-content-workspace" className="skip-link">
        Skip to main content
      </a>

      {/* Accessible Screen Reader Announcer for Dynamic View State Changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {pageInfo.title ? `Viewing ${pageInfo.title}` : 'Viewing Africa Data Atlas'}
      </div>

      {/* Top Application Navbar (Always visible Menu button with no visible label) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        selectedEntityId={selectedEntityId}
        onSelectCountry={handleSelectCountry}
        onOpenSearch={() => atlasModalStore.openSearch()}
        onToggleMenu={handleToggleMenu}
        isDrawerOpen={isDesktopDrawerOpen}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenApiHub={() => atlasModalStore.openApiHub()}
        onOpenOnboarding={() => atlasModalStore.openOnboarding()}
        onOpenShortcuts={() => atlasModalStore.openShortcuts()}
        activeRegion={activeRegion}
        onGoBack={handleGoBack}
        canGoBack={canGoBack}
        previousPageTitle={previousPageTitle}
        onPreloadTab={preloadTabView}
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
            <PanelLeftOpen className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>
        )}

        {/* Mobile Bottom Navigation Dock (Thumb-Zone Optimized with Safe Area Insets) */}
        <MobileBottomNav
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          onOpenMenu={() => setIsMobileNavOpen(true)}
          onOpenSearch={() => atlasModalStore.openSearch()}
          onPreloadTab={preloadTabView}
        />

        {/* Desktop Navigation Drawer (Starts open, 272px width, doesn't close on tab clicks) + Mobile Bottom Sheet */}
        <ViewErrorBoundary compact fallbackTitle="Navigation Drawer Unavailable">
          <Suspense fallback={<div className="hidden lg:block w-[272px] shrink-0" />}>
            <NavigationDrawer
              currentTab={currentTab}
              activeRegion={activeRegion}
              onSelectTab={handleSelectTab}
              isDesktopOpen={isDesktopDrawerOpen}
              onToggleDesktop={handleToggleMenu}
              isMobileOpen={isMobileNavOpen}
              onCloseMobile={() => setIsMobileNavOpen(false)}
              onOpenOnboarding={() => atlasModalStore.openOnboarding()}
              onOpenColophon={() => atlasModalStore.openColophon()}
              onOpenCitationModal={() => atlasModalStore.openAcademicExport()}
              onOpenWorkingPapers={() => atlasModalStore.openWorkingPapers()}
              onOpenMethodologyAudit={() => atlasModalStore.openMethodologyAudit()}
              onOpenAfcftaSimulator={() => atlasModalStore.openAfcftaSimulator()}
              isIconographyIngestion={isIconographyIngestion}
              onPreloadTab={preloadTabView}
            />
          </Suspense>
        </ViewErrorBoundary>

        {/* Main Content Area */}
        <main
          tabIndex={-1}
          data-core={activeCore}
          className={`core-${activeCore} flex-1 min-w-0 w-full min-h-[70vh] focus:outline-none ${
            currentTab === 'map' || 
            currentTab === 'ethnic-tree' || 
            currentTab === 'archival-cartography' || 
            currentTab === 'heritage' || 
            (currentTab === 'iconography' && isIconographyIngestion) ||
            (currentTab === 'slave-trade' && (slaveTradeSubTab === 'flow-map' || slaveTradeSubTab === 'ports'))
              ? 'p-0 max-w-none flex flex-col safe-pb-dock lg:pb-0'
              : currentTab === 'slave-trade' || currentTab === 'molecular-legacies' || currentTab === 'african-development-foundations'
                ? 'px-3 sm:px-5 lg:px-6 py-4 md:py-6 pb-24 lg:pb-6 max-w-none flex flex-col'
                : 'px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 lg:pb-8 max-w-[1440px] mx-auto'
          }`}
          id="main-content-workspace"
        >
          <m.div
            key={`view-${currentTab}`}
            data-core={activeCore}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`core-${activeCore} w-full min-w-0 flex-1 flex flex-col`}
          >
              <ViewErrorBoundary fallbackTitle="Module Unavailable" resetKey={currentTab}>
                <Suspense fallback={<MainContentSkeleton viewType={currentTab} />}>
                  {currentTab === 'overview' && (
                    <OverviewView
                      onSelectCountry={handleSelectCountry}
                      onNavigateTab={(tab: string) => handleSelectTab(tab as CanonicalNavTab)}
                    />
                  )}

                  {currentTab === 'explore' && (
                    <ExploreView
                      onSelectCountry={handleSelectCountry}
                      onNavigateTab={(tab: string) => handleSelectTab(tab as CanonicalNavTab)}
                    />
                  )}

                  {currentTab === 'slave-trade' && (
                    <SlaveTradeView 
                      onNavigateToMolecular={() => handleSelectTab('molecular-legacies')}
                      onNavigateToFoundations={() => handleSelectTab('african-development-foundations')}
                      onNavigateToIconography={() => handleSelectTab('iconography')}
                      onNavigateToCartography={() => handleSelectTab('archival-cartography')}
                      onSubTabChange={(sub: SlaveTradeSubTab) => setSlaveTradeSubTab(sub)}
                    />
                  )}

                  {currentTab === 'iconography' && (
                    <IconographyView 
                      initialPlateId={activeIconographyPlateId}
                      initialSearchQuery={activeIconographySearchQuery}
                      onClearInitialPlate={() => setActiveIconographyPlateId(undefined)}
                      onIngestionModeChange={setIsIconographyIngestion}
                    />
                  )}

                  {currentTab === 'archival-cartography' && (
                    <ArchivalCartographyView 
                      initialPlateId={activeArchivalPlateId}
                      initialKingdomId={activeArchivalKingdomId}
                      onNavigateTab={handleSelectTab}
                      onSelectCountry={handleSelectCountry}
                      onOpenColophon={() => atlasModalStore.openColophon()}
                      onOpenCitationModal={() => atlasModalStore.openAcademicExport()}
                      onOpenWorkingPapers={() => atlasModalStore.openWorkingPapers()}
                      onOpenMethodologyAudit={() => atlasModalStore.openMethodologyAudit()}
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
                      onNavigateTab={(tab: string) => handleSelectTab(tab as CanonicalNavTab)}
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
                      onNavigateToHeritage={(siteId: number) => {
                        setSelectedHeritageSiteId(siteId);
                        handleSelectTab(`heritage?id=${siteId}`);
                      }}
                    />
                  )}

                  {currentTab === 'languages' && (
                    <LanguagesView
                      onSelectCountry={handleSelectCountry}
                      initialLanguageId={activeLanguageId}
                    />
                  )}

                  {currentTab === 'heritage' && (
                    <HeritageView
                      onSelectCountry={handleSelectCountry}
                      initialSiteId={selectedHeritageSiteId}
                    />
                  )}

                  {currentTab === 'countries' && (
                    <CountryView
                      entityId={selectedEntityId}
                      onSelectCountry={handleSelectCountry}
                      onSelectIndicator={handleSelectIndicator}
                      onNavigateTab={handleSelectTab}
                    />
                  )}

                  {currentTab === 'compare' && (
                    <CompareView
                      onSelectCountry={handleSelectCountry}
                      initialCountries={compareInitialCountries}
                      onCountriesChange={setCompareInitialCountries}
                    />
                  )}

                  {currentTab === 'provenance' && (
                    <ProvenanceQualityView />
                  )}

                  {currentTab === 'privacy' && (
                    <PrivacySectionView 
                      onBackToOverview={() => handleSelectTab('overview')}
                      onNavigateTab={(tab: CanonicalNavTab) => handleSelectTab(tab)}
                    />
                  )}

                  {currentTab === 'style-guide' && (
                    <UniversalStyleGuideView
                      onNavigateTab={(tab: CanonicalNavTab) => handleSelectTab(tab)}
                      onOpenMonographModal={() => atlasModalStore.openMonograph()}
                    />
                  )}

                  {currentTab === 'ethnic-tree' && (
                    <EthnicTreeOfLifeView
                      onSelectReport={(reportId: string) => handleSelectTab(reportId as CanonicalNavTab)}
                      onNavigateToSlaveTrade={() => handleSelectTab('slave-trade')}
                      onNavigateToMolecular={() => handleSelectTab('molecular-legacies')}
                      onNavigateToFoundations={() => handleSelectTab('african-development-foundations')}
                      onNavigateToLanguages={() => handleSelectTab('languages')}
                    />
                  )}

                  {currentTab === 'research-directory' && (
                    <ResearchReportsDirectoryView
                      onSelectReport={(reportId: string) => handleSelectTab(reportId as CanonicalNavTab)}
                      onNavigateToEthnicTree={() => handleSelectTab('ethnic-tree')}
                      onNavigateToSlaveTrade={() => handleSelectTab('slave-trade')}
                      onNavigateToMolecular={() => handleSelectTab('molecular-legacies')}
                      onNavigateToFoundations={() => handleSelectTab('african-development-foundations')}
                    />
                  )}

                  {typeof currentTab === 'string' && isReportOrPaperTab(currentTab) && (
                    <ResearchReportArticleView
                      reportId={currentTab}
                      onBackToDirectory={() => handleSelectTab('research-directory')}
                      onNavigateToEthnicTree={() => handleSelectTab('ethnic-tree')}
                      onNavigateToSlaveTrade={() => handleSelectTab('slave-trade')}
                      onSelectOtherReport={(otherId: string) => handleSelectTab(otherId as CanonicalNavTab)}
                    />
                  )}
                </Suspense>
              </ViewErrorBoundary>
            </m.div>
        </main>
      </div>

      {/* Centralized Modal Orchestrator Container */}
      <AtlasModalContainer
        onSelectCountry={handleSelectCountry}
        onSelectIndicator={handleSelectIndicator}
        onSelectTab={handleSelectTab}
        onToggleTheme={toggleTheme}
      />

      {/* Structured Credibility Footer (Hidden on map, ethnic tree, archival cartography, heritage, standalone flow map & ports, and iconography ingestion workbench) */}
      {currentTab !== 'map' && 
       currentTab !== 'ethnic-tree' && 
       currentTab !== 'archival-cartography' && 
       currentTab !== 'heritage' && 
       !(currentTab === 'iconography' && isIconographyIngestion) && 
       !(currentTab === 'slave-trade' && (slaveTradeSubTab === 'flow-map' || slaveTradeSubTab === 'ports')) && (
        <ViewErrorBoundary compact fallbackTitle="Footer Unavailable">
          <Suspense fallback={null}>
            <div id="app-footer-container">
              <Footer 
                onNavigateTab={handleSelectTab}
                onOpenColophon={() => atlasModalStore.openColophon()}
                onOpenCitationModal={() => atlasModalStore.openAcademicExport()}
                onOpenWorkingPapers={() => atlasModalStore.openWorkingPapers()}
                onOpenMethodologyAudit={() => atlasModalStore.openMethodologyAudit()}
              />
            </div>
          </Suspense>
        </ViewErrorBoundary>
      )}

      {/* Offline Status Toast / Banner */}
      <OfflineIndicator onOpenColophon={() => atlasModalStore.openColophon()} />
    </div>
  );
}

export default function App() {
  return (
    <ViewErrorBoundary fallbackTitle="Unable to Initialize Atlas">
      <LanguageProvider>
        <MotionConfig reducedMotion="user">
          <LazyMotion features={domAnimation} strict>
            <DensityProvider>
              <SavedEntitiesProvider>
                <AppContent />
              </SavedEntitiesProvider>
            </DensityProvider>
          </LazyMotion>
        </MotionConfig>
      </LanguageProvider>
    </ViewErrorBoundary>
  );
}
