import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Sparkles, 
  Compass, 
  Info, 
  Layers, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

/* =========================================================================
   1. FIRST VIEWPORT CLARITY BANNER
   Answers: What is this? Why does it matter? What can I explore?
   ========================================================================= */
interface FirstViewportClarityProps {
  onExploreClick?: (tabKey: string) => void;
  className?: string;
}

export const FirstViewportClarity: React.FC<FirstViewportClarityProps> = ({
  onExploreClick,
  className = ''
}) => {
  const [activeQuestion, setActiveQuestion] = useState<'what' | 'why' | 'explore'>('what');

  return (
    <section 
      aria-label="Platform Orientation & Purpose"
      className={`rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-6 md:p-8 shadow-xl transition-all ${className}`}
    >
      {/* 3 Pillars Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
        <button
          onClick={() => setActiveQuestion('what')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            activeQuestion === 'what'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
          aria-selected={activeQuestion === 'what'}
          role="tab"
        >
          <Info className="w-4 h-4 text-emerald-500" />
          <span>1. What is this?</span>
        </button>

        <button
          onClick={() => setActiveQuestion('why')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            activeQuestion === 'why'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
          aria-selected={activeQuestion === 'why'}
          role="tab"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>2. Why does it matter?</span>
        </button>

        <button
          onClick={() => setActiveQuestion('explore')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            activeQuestion === 'explore'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
          aria-selected={activeQuestion === 'explore'}
          role="tab"
        >
          <Compass className="w-4 h-4 text-cyan-500" />
          <span>3. What can I explore?</span>
        </button>
      </div>

      {/* Question Content Panels with Japandi entrance */}
      <div className="animate-enter-japandi">
        {activeQuestion === 'what' && (
          <div className="space-y-3">
            <h3 className="text-xl md:text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100">
              The Definitive Open Statistical Platform for the African Continent
            </h3>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-4xl">
              The Africa Data Atlas harmonizes multidimensional demographic, macroeconomic, environmental, linguistic, and cultural heritage data across all 54 sovereign African states and affiliated island territories into a single, high-fidelity spatial engine.
            </p>
            <div className="flex flex-wrap gap-3 pt-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 54 Sovereign Nations
              </span>
              <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <Layers className="w-3.5 h-3.5 text-cyan-500" /> 5 UN Geoscheme Blocs
              </span>
              <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 50+ Harmonized Indicators
              </span>
            </div>
          </div>
        )}

        {activeQuestion === 'why' && (
          <div className="space-y-3">
            <h3 className="text-xl md:text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100">
              Bridging Data Fragmentation with Transparent Provenance
            </h3>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-4xl">
              African data has historically been siloed across disparate agency repositories, missing temporal continuity or geospatial context. This atlas eliminates ambiguity by cross-verifying World Bank, IMF, UN DESA, and UNESCO records with transparent ingestion pipelines and open-access licensing (CC-BY 4.0).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs">
                <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Verifiable Provenance</div>
                <div className="text-zinc-500 dark:text-zinc-400">Direct indicator tracing down to source agency series codes.</div>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs">
                <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Comparative Integrity</div>
                <div className="text-zinc-500 dark:text-zinc-400">Normalized currency values (USD) and population-weighted regional aggregates.</div>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs">
                <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Cultural Depth</div>
                <div className="text-zinc-500 dark:text-zinc-400">104 UNESCO World Heritage properties and 4 major language super-families.</div>
              </div>
            </div>
          </div>
        )}

        {activeQuestion === 'explore' && (
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100">
              Interactive Tools & Analytical Workspaces
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onExploreClick?.('explore')}
                className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 bg-zinc-50 dark:bg-zinc-900/60 text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 flex items-center justify-between">
                  <span>Country Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">Explore all 54 sovereign states.</p>
              </button>

              <button
                onClick={() => onExploreClick?.('analytics')}
                className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 bg-zinc-50 dark:bg-zinc-900/60 text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 flex items-center justify-between">
                  <span>Time-Series</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">2015-2024 indicator trends.</p>
              </button>

              <button
                onClick={() => onExploreClick?.('languages')}
                className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 bg-zinc-50 dark:bg-zinc-900/60 text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 flex items-center justify-between">
                  <span>Linguistics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">2,000+ African languages.</p>
              </button>

              <button
                onClick={() => onExploreClick?.('heritage')}
                className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 bg-zinc-50 dark:bg-zinc-900/60 text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 flex items-center justify-between">
                  <span>World Heritage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">UNESCO inscribed properties.</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* =========================================================================
   2. ACCORDION COMPONENT
   ========================================================================= */
interface AccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  content: React.ReactNode;
}

interface ProgressiveAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpandedIds?: string[];
  className?: string;
}

export const ProgressiveAccordion: React.FC<ProgressiveAccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpandedIds = [],
  className = ''
}) => {
  const [expanded, setExpanded] = useState<string[]>(defaultExpandedIds);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else {
      setExpanded(prev => prev.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map(item => {
        const isOpen = expanded.includes(item.id);
        return (
          <div
            key={item.id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden transition-colors shadow-xs"
          >
            <button
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <div className="space-y-0.5 pr-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </h4>
                  {item.badge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {item.subtitle}
                  </p>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
            </button>

            {isOpen && (
              <div className="px-4 pb-5 md:px-5 border-t border-zinc-100 dark:border-zinc-800/80 pt-3 text-xs md:text-sm text-zinc-600 dark:text-zinc-300 animate-enter-japandi">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* =========================================================================
   3. READ MORE PROGRESSIVE DISCLOSURE
   ========================================================================= */
interface ReadMoreProps {
  children: React.ReactNode;
  maxHeight?: number;
  moreText?: string;
  lessText?: string;
  className?: string;
}

export const ReadMore: React.FC<ReadMoreProps> = ({
  children,
  moreText = 'Read More',
  lessText = 'Show Less',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={className}>
      <div className={`transition-all duration-300 relative ${!isExpanded ? 'line-clamp-3' : ''}`}>
        {children}
      </div>
      <button
        onClick={() => setIsExpanded(prev => !prev)}
        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md py-0.5"
        aria-expanded={isExpanded}
      >
        <span>{isExpanded ? lessText : moreText}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
