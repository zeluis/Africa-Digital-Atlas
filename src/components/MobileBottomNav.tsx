import React from 'react';
import { Globe, GitBranch, TrendingUp, Menu, Search } from 'lucide-react';
import type { CanonicalNavTab } from './NavigationDrawer';
import { triggerHaptic } from '../utils/mobileHaptics';

export interface MobileBottomNavProps {
  currentTab: CanonicalNavTab;
  onSelectTab: (tab: CanonicalNavTab) => void;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenMenu,
  onOpenSearch
}) => {
  const isMapActive = currentTab === 'overview' || currentTab === 'map';
  const isExploreActive = currentTab === 'ethnic-tree' || currentTab === 'explore' || currentTab === 'heritage';
  const isAnalyticsActive = currentTab === 'analytics' || currentTab === 'compare';

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200/90 dark:border-zinc-800/90 shadow-lg safe-pb select-none"
    >
      <div className="grid grid-cols-4 items-center h-14 max-w-md mx-auto px-1">
        {/* Destination 1: Atlas Map */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            onSelectTab('overview');
          }}
          className={`flex flex-col items-center justify-center min-touch-target py-1 transition-colors active-tactile cursor-pointer ${
            isMapActive 
              ? 'text-amber-600 dark:text-amber-400 font-bold' 
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
          aria-label="Continent Map"
          aria-current={isMapActive ? 'page' : undefined}
        >
          <Globe className={`w-5 h-5 transition-transform ${isMapActive ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight mt-0.5 truncate">Map</span>
        </button>

        {/* Destination 2: Ethnolinguistic Explorer */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            onSelectTab('ethnic-tree');
          }}
          className={`flex flex-col items-center justify-center min-touch-target py-1 transition-colors active-tactile cursor-pointer ${
            isExploreActive 
              ? 'text-amber-600 dark:text-amber-400 font-bold' 
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
          aria-label="Ethnolinguistic Explorer"
          aria-current={isExploreActive ? 'page' : undefined}
        >
          <GitBranch className={`w-5 h-5 transition-transform ${isExploreActive ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight mt-0.5 truncate">Explore</span>
        </button>

        {/* Destination 3: Comparative Analytics */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            onSelectTab('analytics');
          }}
          className={`flex flex-col items-center justify-center min-touch-target py-1 transition-colors active-tactile cursor-pointer ${
            isAnalyticsActive 
              ? 'text-amber-600 dark:text-amber-400 font-bold' 
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
          aria-label="Analytics & Indicators"
          aria-current={isAnalyticsActive ? 'page' : undefined}
        >
          <TrendingUp className={`w-5 h-5 transition-transform ${isAnalyticsActive ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight mt-0.5 truncate">Analytics</span>
        </button>

        {/* Destination 4: Search & Menu Drawer */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('medium');
            onOpenMenu();
          }}
          className="flex flex-col items-center justify-center min-touch-target py-1 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors active-tactile cursor-pointer"
          aria-label="Open Full Navigation Menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 truncate">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
