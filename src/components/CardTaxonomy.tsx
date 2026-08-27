import React, { useState } from 'react';
import { 
  ArrowRight, 
  Database, 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  Compass,
  FileText
} from 'lucide-react';

/* =========================================================================
   1. EDITORIAL CARD (Narrative-first, rich typography, story context)
   ========================================================================= */
interface EditorialCardProps {
  category?: string;
  title: string;
  subtitle?: string;
  narrative: string;
  readMoreContent?: string;
  authorOrSource?: string;
  regionalAccent?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  id?: string;
}

export const EditorialCard: React.FC<EditorialCardProps> = ({
  category = 'REGIONAL ESSAY',
  title,
  subtitle,
  narrative,
  readMoreContent,
  authorOrSource,
  regionalAccent = '#10b981',
  actionText,
  onAction,
  className = '',
  id
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article
      id={id}
      className={`rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-white via-slate-50/50 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950 p-6 md:p-8 shadow-xl transition-all duration-300 relative overflow-hidden ${className}`}
      style={{
        borderLeft: `4px solid ${regionalAccent}`
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span 
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
        >
          <BookOpen className="w-3 h-3 text-emerald-500" />
          {category}
        </span>
        {authorOrSource && (
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            {authorOrSource}
          </span>
        )}
      </div>

      <h3 className="text-xl md:text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug mb-2">
        {title}
      </h3>

      {subtitle && (
        <h4 className="text-xs md:text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-3 font-sans">
          {subtitle}
        </h4>
      )}

      <div className="prose prose-zinc dark:prose-invert text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed mb-4">
        <p>{narrative}</p>
        {isExpanded && readMoreContent && (
          <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400 animate-enter-japandi">
            <p>{readMoreContent}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        {readMoreContent && (
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg px-1.5 py-0.5"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Show Less' : 'Read More Narrative'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}

        {actionText && onAction && (
          <button
            onClick={onAction}
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-xs font-bold shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </article>
  );
};

/* =========================================================================
   2. DATA CARD (Metric-first, high numerical contrast, benchmark context)
   ========================================================================= */
interface DataCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: {
    value: string;
    isPositive: boolean;
    period?: string;
  };
  benchmark?: {
    label: string;
    value: string;
  };
  source?: string;
  icon?: React.ReactNode;
  regionalAccent?: string;
  className?: string;
  id?: string;
}

export const DataCard: React.FC<DataCardProps> = ({
  label,
  value,
  unit,
  delta,
  benchmark,
  source,
  icon,
  regionalAccent = '#10b981',
  className = '',
  id
}) => {
  return (
    <div
      id={id}
      className={`rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-5 shadow-lg flex flex-col justify-between transition-all hover:shadow-xl ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate uppercase tracking-wider font-mono">
            {label}
          </span>
          {icon && (
            <div 
              className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              style={{ color: regionalAccent }}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-2xl md:text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100 tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">
              {unit}
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 mt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2 text-[11px]">
        {delta && (
          <div className="flex items-center gap-1 font-mono font-semibold">
            {delta.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            )}
            <span className={delta.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
              {delta.value}
            </span>
            {delta.period && <span className="text-zinc-400">({delta.period})</span>}
          </div>
        )}

        {benchmark && (
          <div className="text-zinc-500 dark:text-zinc-400 font-mono">
            <span>{benchmark.label}: </span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{benchmark.value}</span>
          </div>
        )}

        {source && !benchmark && !delta && (
          <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[10px]">
            {source}
          </span>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   3. EXPLORATION CARD (Interactive destination, action prompt, visual vector)
   ========================================================================= */
interface ExplorationCardProps {
  title: string;
  badge?: string;
  description: string;
  actionPrompt?: string;
  visualGraphic?: React.ReactNode;
  onClick: () => void;
  regionalAccent?: string;
  className?: string;
  id?: string;
}

export const ExplorationCard: React.FC<ExplorationCardProps> = ({
  title,
  badge = 'EXPLORE DESTINATION',
  description,
  actionPrompt = 'Launch Interactive Workspace',
  visualGraphic,
  onClick,
  regionalAccent = '#10b981',
  className = '',
  id
}) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`group w-full text-left rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${className}`}
    >
      {/* Subtle background glow on hover */}
      <div 
        className="absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-2xl pointer-events-none"
        style={{ backgroundColor: regionalAccent }}
      />

      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
          >
            <Compass className="w-3 h-3 text-emerald-500" />
            {badge}
          </span>
          {visualGraphic && (
            <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
              {visualGraphic}
            </div>
          )}
        </div>

        <h3 className="text-lg md:text-xl font-bold font-display text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
          {title}
        </h3>

        <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
        <span>{actionPrompt}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
      </div>
    </button>
  );
};

/* =========================================================================
   4. REFERENCE CARD (Source/methodology, metadata badges, verification)
   ========================================================================= */
interface ReferenceCardProps {
  sourceAgency: string;
  indicatorCode?: string;
  methodologyNote: string;
  updateCadence?: string;
  license?: string;
  verifiedYear?: string | number;
  externalUrl?: string;
  className?: string;
  id?: string;
}

export const ReferenceCard: React.FC<ReferenceCardProps> = ({
  sourceAgency,
  indicatorCode,
  methodologyNote,
  updateCadence = 'Annual Cycle',
  license = 'Open Access (CC-BY 4.0)',
  verifiedYear = 2024,
  externalUrl,
  className = '',
  id
}) => {
  return (
    <div
      id={id}
      className={`rounded-2xl border border-zinc-200 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/40 p-5 space-y-3 text-xs shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800/60 pb-2">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono uppercase">
            {sourceAgency}
          </span>
        </div>
        {indicatorCode && (
          <span className="font-mono text-[10px] bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
            {indicatorCode}
          </span>
        )}
      </div>

      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
        {methodologyNote}
      </p>

      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> Verified {verifiedYear}
          </span>
          <span>•</span>
          <span>{updateCadence}</span>
        </div>

        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 hover:text-emerald-500 transition-colors underline"
          >
            <span>Documentation</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
