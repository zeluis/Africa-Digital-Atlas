import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePrefersReducedMotion } from '../utils/motion';
import { 
  Keyboard, 
  X, 
  Search, 
  Globe2, 
  Compass, 
  Eye, 
  BookOpen, 
  Sparkles, 
  Command, 
  ArrowLeft, 
  Moon, 
  Sun, 
  Layers 
} from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tabId: string) => void;
  onToggleTheme?: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  badge?: string;
  action?: () => void;
}

interface ShortcutCategory {
  title: string;
  icon: React.ReactNode;
  accent: string;
  items: ShortcutItem[];
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onToggleTheme
}) => {
  const reducedMotion = usePrefersReducedMotion();

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories: ShortcutCategory[] = [
    {
      title: 'Global Navigation & Command',
      icon: <Command className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      accent: 'emerald',
      items: [
        { keys: ['⌘K', '/'], description: 'Quick search 54 nations, indicators & archival plates' },
        { keys: ['?'], description: 'Toggle this keyboard shortcut helper' },
        { keys: ['D'], description: 'Toggle high-contrast Dark / Light theme', action: onToggleTheme },
        { keys: ['Esc'], description: 'Close modals, dismiss drawers & reset selections' },
        { keys: ['Alt', '←'], description: 'Return to previously visited atlas view' }
      ]
    },
    {
      title: 'UN M49 Geoscheme Hotkeys',
      icon: <Globe2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      accent: 'amber',
      items: [
        { keys: ['1'], description: 'Northern Africa (AMU / Maghreb • 7 nations)', badge: '#F59E0B' },
        { keys: ['2'], description: 'Western Africa (ECOWAS • 16 nations)', badge: '#10B981' },
        { keys: ['3'], description: 'Central Africa (ECCAS • 9 nations)', badge: '#6366F1' },
        { keys: ['4'], description: 'Eastern Africa (EAC / IGAD • 18 nations)', badge: '#F97316' },
        { keys: ['5'], description: 'Southern Africa (SADC • 5 nations)', badge: '#F43F5E' },
        { keys: ['0'], description: 'Reset to Continental Panoramic View (All 54)', badge: '#10B981' }
      ]
    },
    {
      title: 'Cartography & Archival Loupe',
      icon: <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
      accent: 'sky',
      items: [
        { keys: ['+'], description: 'Zoom In (up to 5.0x magnification)' },
        { keys: ['-'], description: 'Zoom Out (panoramic overview)' },
        { keys: ['R'], description: 'Reset zoom coordinates & canvas rotation' },
        { keys: ['C'], description: 'Toggle high-contrast etching filter in Loupe' },
        { keys: ['I'], description: 'Toggle inverted darkroom copperplate filter' }
      ]
    },
    {
      title: 'Atlas Research View Jumpers',
      icon: <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      accent: 'purple',
      items: [
        { keys: ['Shift', 'O'], description: 'Jump to Primary Overview Dashboard', action: () => onNavigateTab?.('overview') },
        { keys: ['Shift', 'M'], description: 'Jump to Fullscreen Vector Cartography Map', action: () => onNavigateTab?.('map') },
        { keys: ['Shift', 'C'], description: 'Jump to Multi-Nation Comparative Matrix', action: () => onNavigateTab?.('compare') },
        { keys: ['Shift', 'A'], description: 'Jump to Econometric Analytics & Scatter Plots', action: () => onNavigateTab?.('analytics') },
        { keys: ['Shift', 'V'], description: 'Jump to 1,220-Plate Archival Iconography Loupe', action: () => onNavigateTab?.('iconography') }
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-hidden"
        >
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 12 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 12 }}
            transition={reducedMotion ? { duration: 0.01 } : { type: 'spring', damping: 28, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="keyboard-shortcuts-modal-title"
            className="w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shrink-0">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 id="keyboard-shortcuts-modal-title" className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span>Keyboard Navigation &amp; Hotkeys</span>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                      · Reference Sheet
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    Keyboard controls for desktop research and cartographic exploration.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="min-touch-target flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                title="Close Shortcuts Modal (Esc)"
                aria-label="Close Keyboard Shortcuts modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Categories */}
            <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto overscroll-contain sleek-scrollbar space-y-6">
              {categories.map((category, catIdx) => (
                <div key={catIdx} className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {category.icon}
                    <span>{category.title}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {category.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        onClick={() => {
                          if (item.action) {
                            item.action();
                            onClose();
                          }
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs transition-colors ${
                          item.action ? 'hover:border-amber-400/60 dark:hover:border-amber-600/60 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 cursor-pointer' : ''
                        }`}
                      >
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate pr-2">
                          {item.description}
                        </span>

                        <div className="flex items-center gap-1 shrink-0">
                          {item.badge && (
                            <span 
                              className="w-2 h-2 rounded-full mr-1"
                              style={{ backgroundColor: item.badge }}
                              title="Region Accent"
                            />
                          )}
                          {item.keys.map((k, kIdx) => (
                            <kbd
                              key={kIdx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 border border-zinc-300/80 dark:border-zinc-700 shadow-2xs"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-3 safe-pb border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Tip: Press <kbd className="font-mono font-bold px-1.5 py-0.5 rounded bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-[10px]">?</kbd> anywhere to summon this dialog.</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsModal;
