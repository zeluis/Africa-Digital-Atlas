import React, { useEffect } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { SPRING_TACTILE } from '../utils/motion';
import { THEMATIC_PILLARS, ThematicPillarId } from '../services/wikipediaService';
import { 
  Globe, 
  History, 
  Users, 
  MessageSquare, 
  Landmark, 
  CloudSun, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';

interface ThematicPillarNavProps {
  activePillar: ThematicPillarId;
  onSelectPillar: (pillarId: ThematicPillarId) => void;
  entityName?: string;
  className?: string;
  isEmbedded?: boolean;
}

const PILLAR_ICONS: Record<ThematicPillarId, React.ReactNode> = {
  geography: <Globe className="w-3.5 h-3.5" />,
  history: <History className="w-3.5 h-3.5" />,
  people: <Users className="w-3.5 h-3.5" />,
  languages: <MessageSquare className="w-3.5 h-3.5" />,
  culture: <Landmark className="w-3.5 h-3.5" />,
  climate: <CloudSun className="w-3.5 h-3.5" />,
  economy: <TrendingUp className="w-3.5 h-3.5" />,
  future: <Sparkles className="w-3.5 h-3.5" />
};

export const ThematicPillarNav: React.FC<ThematicPillarNavProps> = ({
  activePillar,
  onSelectPillar,
  entityName,
  className = '',
  isEmbedded = false
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Global keyboard shortcut: Press 1-8 to switch pillars
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 8) {
        const pillar = THEMATIC_PILLARS.find(p => p.number === num);
        if (pillar) {
          e.preventDefault();
          onSelectPillar(pillar.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectPillar]);

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    const total = THEMATIC_PILLARS.length;
    let nextIndex = -1;
    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % total;
    else if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + total) % total;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = total - 1;

    if (nextIndex !== -1) {
      e.preventDefault();
      const target = THEMATIC_PILLARS[nextIndex];
      onSelectPillar(target.id);
      const nextBtn = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex];
      nextBtn?.focus();
    }
  };

  const pillsContent = (
    <div
      role="tablist"
      aria-label="Eight thematic analysis pillars"
      className="flex flex-nowrap lg:flex-wrap items-center gap-1.5 py-0.5 w-full overflow-x-auto no-scrollbar"
    >
      {THEMATIC_PILLARS.map((pillar, idx) => {
        const isActive = activePillar === pillar.id;
        return (
          <button
            key={pillar.id}
            type="button"
            id={`pillar-tab-${pillar.id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls="thematic-pillar-panel"
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelectPillar(pillar.id)}
            onKeyDown={(e) => handleTabKeyDown(e, idx)}
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              isActive
                ? 'text-white dark:text-zinc-950 font-bold shadow-xs'
                : 'bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200/70 dark:border-zinc-800/70'
            }`}
            title={`Switch to Pillar ${pillar.number}: ${pillar.label} (Press ${pillar.number})`}
          >
            {isActive && (
              <m.div
                layoutId="thematicPillarActivePill"
                className="absolute inset-0 rounded-xl bg-zinc-900 dark:bg-white shadow-xs"
                transition={prefersReducedMotion ? { duration: 0 } : SPRING_TACTILE}
              />
            )}
            <span className={`relative z-10 ${isActive ? 'text-amber-400 dark:text-amber-600' : 'text-zinc-400'}`}>
              {PILLAR_ICONS[pillar.id]}
            </span>
            <span className="relative z-10">{pillar.shortLabel}</span>
            <span className={`relative z-10 text-[10px] font-mono tabular-nums ${
              isActive
                ? 'text-zinc-300 dark:text-zinc-700'
                : 'text-zinc-400 dark:text-zinc-500'
            }`}>
              {pillar.number}
            </span>
          </button>
        );
      })}
    </div>
  );

  if (isEmbedded) {
    return (
      <div className={`w-full ${className}`}>
        {pillsContent}
      </div>
    );
  }

  return (
    <div className={`sticky top-0 z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 py-2.5 px-4 transition-colors ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {pillsContent}

        {entityName && (
          <div className="hidden lg:flex items-center shrink-0 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <span className="truncate max-w-[140px]">{entityName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

