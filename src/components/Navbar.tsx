import React from 'react';
import { atlas } from '../data/atlas-store';
import { CountryFlag } from './CountryFlag';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../i18n/LanguageContext';
import { useDensity } from '../contexts/DensityContext';
import { JapandiTooltip } from './JapandiTooltip';
import { CanonicalNavTab } from './NavigationDrawer';
import { 
  Globe, 
  Menu,
  Search, 
  CheckCircle2, 
  Sun, 
  Moon,
  SlidersHorizontal,
  Database
} from 'lucide-react';

interface NavbarProps {
  currentTab: CanonicalNavTab;
  onSelectTab: (tab: CanonicalNavTab) => void;
  selectedEntityId: string;
  onSelectCountry: (entityId: string) => void;
  onOpenSearch: () => void;
  onToggleMenu: () => void;
  isDrawerOpen: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenApiHub?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  selectedEntityId,
  onSelectCountry,
  onOpenSearch,
  onToggleMenu,
  isDrawerOpen,
  theme = 'dark',
  onToggleTheme,
  onOpenApiHub
}) => {
  const { t } = useTranslation();
  const { density, cycleDensity } = useDensity();
  const allEntities = atlas.getAllEntities();
  const manifest = atlas.getManifest();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left Section: Menu Toggle Button & Logo */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Menu Button: Always visible, icon-only, no visible text label */}
            <button
              onClick={onToggleMenu}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/90 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 transition-all cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Toggle navigation drawer"
              title={isDrawerOpen ? 'Close Navigation Drawer' : 'Open Navigation Drawer'}
            >
              <Menu className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
            </button>

            {/* Logo & Brand */}
            <div 
              className="flex items-center gap-3 cursor-pointer select-none" 
              onClick={() => onSelectTab('overview')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/20 border border-emerald-400/30 shrink-0">
                <Globe className="w-6 h-6 text-zinc-950 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
                    {t('app.title', 'AFRICA DATA ATLAS')}
                  </span>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700/60 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                    v{manifest.atlasVersion}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
                  {t('app.subtitle', 'Authoritative Pan-African Socio-Economic Platform • 54 Sovereign Nations')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section: Quick Search, Live Indicator, Language Selector, Country Dropdown & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Real-time Live Data Status Indicator with Japandi Tooltip */}
            <JapandiTooltip
              title="Multilateral Data APIs (16 Active)"
              content="Click to explore and live-test 16 international APIs: FH_FIW, WGI, UNESCO, GHO, PIP, IDS, UN Comtrade, IMF WEO, WB CPIA, and WB Climate."
              regionalAccent="#10b981"
            >
              <button 
                onClick={onOpenApiHub}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-emerald-300/80 dark:border-emerald-800/80 bg-emerald-50/90 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 shadow-xs cursor-pointer select-none transition-colors"
                title="Open Multilateral Data APIs & Ingestion Hub"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="tracking-wide">16 DATA APIs</span>
              </button>
            </JapandiTooltip>

            {/* Density Mode Switcher Button */}
            <JapandiTooltip
              title="Information Density"
              content={`Current layout mode: ${density.toUpperCase()}. Click to cycle between Standard, Analytical (compact), and Editorial (spacious).`}
              regionalAccent="#06b6d4"
            >
              <button
                onClick={cycleDensity}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono font-semibold"
                aria-label={`Current density mode: ${density}. Click to switch.`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500" />
                <span className="hidden lg:inline capitalize">{density}</span>
              </button>
            </JapandiTooltip>

            {/* Language Selector Dropdown (12 Languages) */}
            <LanguageSelector />

            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-all shadow-inner hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Search countries, regions, and indicators"
            >
              <Search className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden md:inline">{t('action.search', 'Quick Search...')}</span>
              <kbd className="hidden md:inline-block bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 px-1.5 py-0.2 rounded text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                ⌘K
              </kbd>
            </button>

            {/* Quick Country Dropdown Jumper */}
            <div className="relative flex items-center">
              <select
                value={selectedEntityId}
                onChange={e => {
                  onSelectCountry(e.target.value);
                }}
                aria-label="Jump to sovereign country or territory"
                className="appearance-none bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold py-1.5 pl-8 pr-7 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer max-w-[120px] sm:max-w-[150px]"
              >
                {allEntities.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.id})
                  </option>
                ))}
              </select>
              <div className="absolute left-2.5 pointer-events-none">
                <CountryFlag entityId={selectedEntityId} size="xs" />
              </div>
            </div>

            {/* Day / Night Mode Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                title={theme === 'dark' ? 'Switch to Day Mode (Light)' : 'Switch to Night Mode (Dark)'}
                aria-label="Toggle light or dark theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />
                )}
              </button>
            )}

            {/* Verification Status Pill */}
            <div className="hidden xl:flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1.5 rounded-xl text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('badge.offline_ready', 'Offline Ready')}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
