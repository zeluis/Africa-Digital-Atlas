import React from 'react';
import { atlas } from '../data/atlas-store';
import { LanguageSelector } from './LanguageSelector';
import { VoiceWelcomeFab } from './VoiceWelcomeFab';
import { TOP_BAR_UI_GREETINGS } from '../utils/africaliaVoiceEngine';
import { useTranslation } from '../i18n/LanguageContext';
import { JapandiTooltip } from './JapandiTooltip';
import { CanonicalNavTab } from './NavigationDrawer';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { AfricaUnLogo } from './AfricaUnLogo';
import { PreferencesDropdown } from './PreferencesDropdown';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Search, 
  WifiOff,
  Database
} from 'lucide-react';

interface NavbarProps {
  currentTab: CanonicalNavTab;
  onSelectTab: (tab: CanonicalNavTab) => void;
  selectedEntityId: string;
  onSelectCountry: (entityId: string) => void;
  onOpenSearch: () => void;
  onToggleMenu?: () => void;
  isDrawerOpen?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenApiHub?: () => void;
  onOpenOnboarding?: () => void;
  activeRegion?: string;
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
  onOpenApiHub,
  onOpenOnboarding,
  activeRegion
}) => {
  const { t, language, currentLanguageOption } = useTranslation();
  const isOnline = useNetworkStatus();
  const manifest = atlas.getManifest();

  const currentGreeting = TOP_BAR_UI_GREETINGS[language] || TOP_BAR_UI_GREETINGS['en'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* ========================================================= */}
          {/* ZONE 1: PRIMARY NAVIGATION & BRAND (LEFT)                */}
          {/* Prominent Hero SVG Logo with Stacked Editorial Title     */}
          {/* ========================================================= */}
          <div className="flex items-center shrink-0">
            {/* Logo & Brand Identity (Standalone Masthead) */}
            <div className="flex items-center gap-2.5 sm:gap-3 select-none">
              <div 
                className="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 shrink-0"
                onClick={() => onSelectTab('overview')}
                title="Africalia Continental Atlas - Return to Primary Overview"
              >
                <AfricaUnLogo 
                  className="shrink-0 drop-shadow-[0_1px_4px_rgba(217,119,6,0.2)] dark:drop-shadow-[0_1px_6px_rgba(251,191,36,0.2)]" 
                  size={36}
                  activeRegion={activeRegion}
                  onSelectRegion={(reg) => {
                    const regTabMap: Record<string, CanonicalNavTab> = {
                      'Northern Africa': 'region-northern',
                      'Western Africa': 'region-western',
                      'Central Africa': 'region-central',
                      'Eastern Africa': 'region-eastern',
                      'Southern Africa': 'region-southern'
                    };
                    if (regTabMap[reg]) {
                      onSelectTab(regTabMap[reg]);
                    }
                  }}
                />
              </div>
              
              {/* Stacked Vertical Title Hierarchy: Title is second most prominent */}
              <div className="flex flex-col justify-center leading-none">
                {/* Africalia Title - Explicit Serif font, bold terracotta, dominant over pill */}
                <button
                  type="button"
                  onClick={() => onSelectTab('overview')}
                  style={{ fontFamily: '"Noto Serif Display", Georgia, Cambria, "Times New Roman", serif' }}
                  className="font-extrabold text-[1.15rem] sm:text-xl tracking-tight text-amber-900 dark:text-amber-400 hover:opacity-85 transition-opacity cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded py-0.5 leading-tight"
                  aria-label="Africalia - Return to Primary Overview"
                  title="Return to Primary Overview"
                >
                  Africalia
                </button>

                {/* Quiet [ ATLAS v{manifest.atlasVersion} ] Pill - delicate, understated micro-typography */}
                <div className="flex items-center mt-0.5">
                  <button
                    type="button"
                    onClick={() => onSelectTab('overview')}
                    style={{ fontSize: '9px', lineHeight: '1.2' }}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-100/60 dark:bg-amber-950/60 hover:bg-amber-200/80 dark:hover:bg-amber-900/80 border border-amber-300/60 dark:border-amber-700/50 px-1.5 py-[1px] font-mono text-amber-800/80 dark:text-amber-300/80 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 max-w-fit"
                    title={`Africalia Atlas v${manifest.atlasVersion} - Return to Primary Overview`}
                    aria-label={`Atlas v${manifest.atlasVersion} - Return to Overview`}
                  >
                    <span className="font-semibold uppercase tracking-widest text-[8px] text-amber-900/75 dark:text-amber-300/75">Atlas</span>
                    <span className="font-medium text-[8px] text-amber-800/70 dark:text-amber-300/70">v{manifest.atlasVersion}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* ZONE 2: EXPLORATION & DISCOVERY COMMAND TRIGGER (CENTER)  */}
          {/* ========================================================= */}
          <div className="flex-1 max-w-sm md:max-w-md lg:max-w-lg mx-1 sm:mx-4">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-100/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-800/90 hover:border-amber-400/60 dark:hover:border-amber-600/60 text-zinc-600 dark:text-zinc-300 text-xs transition-all shadow-2xs group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Quick command search and country jumper"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-sans text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 truncate">
                  <span className="hidden sm:inline">Search 54 countries, indicators, or jump...</span>
                  <span className="sm:hidden">Search countries...</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 pl-2">
                <kbd className="hidden sm:inline-flex items-center gap-0.5 bg-white dark:bg-zinc-950 border border-zinc-300/80 dark:border-zinc-700/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-semibold shadow-2xs">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>

          {/* ========================================================= */}
          {/* ZONE 3: CONTROL DECK & UTILITIES CLUSTER (RIGHT)          */}
          {/* ========================================================= */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Offline PWA indicator (shown only when disconnected) */}
            {!isOnline && (
              <JapandiTooltip
                title="PWA Offline Mode Active"
                content="Operating from cached sovereign cartography, pre-loaded Wikipedia archives, and local indicators. Live API queries will resume upon reconnection."
                regionalAccent="#f59e0b"
              >
                <div 
                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-amber-300/80 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-mono font-bold select-none"
                  role="status"
                  aria-live="polite"
                >
                  <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="hidden md:inline tracking-wider uppercase text-[10px]">Offline</span>
                </div>
              </JapandiTooltip>
            )}

            {/* Live Data Hub Indicator Pill (16 APIs) */}
            {onOpenApiHub && (
              <JapandiTooltip
                title="Multilateral Data APIs (16 Active)"
                content="Explore 16 institutional API connectors: World Bank, IMF, WHO, UNESCO, UN Comtrade, and historical archives."
                regionalAccent="#10b981"
              >
                <button 
                  onClick={onOpenApiHub}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-300/80 dark:border-emerald-800/80 bg-emerald-50/90 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 shadow-xs cursor-pointer select-none transition-colors"
                  title="Open Multilateral Data APIs & Ingestion Hub"
                  aria-label="Open 16 Multilateral Data APIs hub"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="tracking-tight hidden md:inline">16 APIs</span>
                  <Database className="w-3.5 h-3.5 md:hidden text-emerald-600 dark:text-emerald-400" />
                </button>
              </JapandiTooltip>
            )}

            {/* PWA In-App Install Button */}
            <PWAInstallButton className="hidden sm:flex" />

            {/* Semantic Language Group: Language Selector Pill + Voice Welcome Button */}
            <div className="flex items-center rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-100/80 dark:bg-zinc-900/80 p-0.5">
              <LanguageSelector />
              <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700/80 mx-0.5" />
              <VoiceWelcomeFab
                variant="navbar"
                text={currentGreeting.phrase}
                langTag={currentGreeting.langTag}
                languageName={currentLanguageOption.name}
                tooltip={`Listen to Africalia Welcome in ${currentLanguageOption.name}`}
                ariaLabel={`Play Africalia Welcome greeting in ${currentLanguageOption.name}`}
              />
            </div>

            {/* Unified Preferences & Settings Dropdown */}
            <PreferencesDropdown
              theme={theme}
              onToggleTheme={onToggleTheme}
              onOpenOnboarding={onOpenOnboarding}
              onSelectTab={onSelectTab}
            />

          </div>

        </div>
      </div>
    </header>
  );
};
