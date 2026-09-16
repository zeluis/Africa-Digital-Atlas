import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SlidersHorizontal, 
  Sun, 
  Moon, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Check, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  ChevronRight,
  Monitor
} from 'lucide-react';
import { useDensity, DensityMode } from '../contexts/DensityContext';
import { useTranslation } from '../i18n/LanguageContext';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { CanonicalNavTab } from './NavigationDrawer';

interface PreferencesDropdownProps {
  theme: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenOnboarding?: () => void;
  onSelectTab: (tab: CanonicalNavTab) => void;
}

export const PreferencesDropdown: React.FC<PreferencesDropdownProps> = ({
  theme,
  onToggleTheme,
  onOpenOnboarding,
  onSelectTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { density, setDensity } = useDensity();
  const { t } = useTranslation();
  const isOnline = useNetworkStatus();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const densityOptions: { id: DensityMode; label: string; desc: string }[] = [
    { id: 'standard', label: 'Standard', desc: 'Balanced spacing and font scaling' },
    { id: 'analytical', label: 'Analytical', desc: 'Compact data grids and high information density' },
    { id: 'editorial', label: 'Editorial', desc: 'Spacious scholarly reading and relaxed margins' }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
          isOpen
            ? 'bg-amber-100/80 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 shadow-xs'
            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/90 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
        }`}
        aria-label="Application Preferences & Display Settings"
        aria-expanded={isOpen}
        title="Application Preferences & Display Settings"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-3 z-50 space-y-3.5 select-none"
          >
            {/* Header */}
            <div className="px-2 pt-1 pb-1.5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 block">
                  Atlas Preferences
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-sans block">
                  Layout density, appearance & cache
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                <span>PWA Ready</span>
              </div>
            </div>

            {/* Section 1: Color Scheme */}
            <div className="space-y-1.5 px-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold block">
                Visual Theme
              </span>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-zinc-100/90 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60">
                <button
                  type="button"
                  onClick={() => {
                    if (theme === 'dark' && onToggleTheme) onToggleTheme();
                  }}
                  className={`flex items-center justify-center gap-2 py-1.5 px-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white text-zinc-900 shadow-xs font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Day Light</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (theme === 'light' && onToggleTheme) onToggleTheme();
                  }}
                  className={`flex items-center justify-center gap-2 py-1.5 px-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-zinc-900 text-white shadow-xs font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Night Dark</span>
                </button>
              </div>
            </div>

            {/* Section 2: Information Density */}
            <div className="space-y-1.5 px-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold block">
                Information Density
              </span>
              <div className="space-y-1">
                {densityOptions.map(opt => {
                  const isSelected = density === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDensity(opt.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-mono font-semibold block">
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans block leading-tight">
                          {opt.desc}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Navigation Quick Links (Onboarding & Privacy) */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1 px-1">
              {onOpenOnboarding && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenOnboarding();
                  }}
                  className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Curated Orientation Tour</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onSelectTab('privacy');
                }}
                className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Privacy, Legal & Storage Inspector</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>

            {/* Footer: PWA Offline Status */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 px-2 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                {isOnline ? (
                  <Wifi className="w-3 h-3 text-emerald-500" />
                ) : (
                  <WifiOff className="w-3 h-3 text-amber-500" />
                )}
                <span>{isOnline ? 'Online (Live Queries Enabled)' : 'Offline PWA Mode'}</span>
              </span>
              <span className="text-zinc-400">Zero-Tracker</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
