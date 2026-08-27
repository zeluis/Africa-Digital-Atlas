import React, { useEffect } from 'react';
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
  className = ''
}) => {
  // Global keyboard shortcut: Press 1-8 to switch pillars
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      
      const key = e.key;
      const num = parseInt(key, 10);
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

  return (
    <div className={`sticky top-0 z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 py-2.5 px-4 transition-colors ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Pillar Ribbon Container */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
          {THEMATIC_PILLARS.map(pillar => {
            const isActive = activePillar === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => onSelectPillar(pillar.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md scale-[1.02]'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200/60 dark:border-zinc-800/60'
                }`}
                title={`Switch to Pillar ${pillar.number}: ${pillar.label} (Press ${pillar.number})`}
              >
                <span className={isActive ? 'text-amber-400 dark:text-amber-600' : 'text-zinc-400'}>
                  {PILLAR_ICONS[pillar.id]}
                </span>
                <span>{pillar.shortLabel}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-300 dark:bg-zinc-200 dark:text-zinc-800'
                    : 'bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400'
                }`}>
                  {pillar.number}
                </span>
              </button>
            );
          })}
        </div>

        {entityName && (
          <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="truncate max-w-[140px]">{entityName}</span>
          </div>
        )}
      </div>
    </div>
  );
};
