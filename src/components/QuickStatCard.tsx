import React from 'react';
import { DataSourceBadge } from './DataSourceBadge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface QuickStatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  changePercent?: number;
  entityId?: string;
  indicatorId?: string;
  icon?: React.ReactNode;
  accentColor?: 'emerald' | 'cyan' | 'amber' | 'indigo' | 'rose';
  className?: string;
}

export const QuickStatCard: React.FC<QuickStatCardProps> = ({
  label,
  value,
  unit,
  subtext,
  changePercent,
  entityId,
  indicatorId,
  icon,
  accentColor = 'emerald',
  className = ''
}) => {
  const colorMap = {
    emerald: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200/80 dark:border-emerald-500/30',
    cyan: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-500/15 border-cyan-200/80 dark:border-cyan-500/30',
    amber: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 border-amber-200/80 dark:border-amber-500/30',
    indigo: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/15 border-indigo-200/80 dark:border-indigo-500/30',
    rose: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/15 border-rose-200/80 dark:border-rose-500/30'
  };

  return (
    <div className={`rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-xs relative overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all ${className}`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
          {label}
        </span>
        {icon && (
          <div className={`p-2 rounded-xl border ${colorMap[accentColor]} flex-shrink-0`}>
            {icon}
          </div>
        )}
      </div>

      {/* Main value */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
          {typeof value === 'number' ? (isNaN(value) ? '—' : value.toLocaleString()) : (value ?? '—')}
        </span>
        {unit && (
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 font-sans">
            {unit}
          </span>
        )}
      </div>

      {/* Footer information & change indicator */}
      <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs">
        {changePercent !== undefined ? (
          <div className={`flex items-center gap-1 font-mono font-semibold ${
            changePercent > 0 ? 'text-emerald-600 dark:text-emerald-300' : changePercent < 0 ? 'text-rose-600 dark:text-rose-300' : 'text-zinc-500 dark:text-zinc-400'
          }`}>
            {changePercent > 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : changePercent < 0 ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            <span>{changePercent > 0 ? `+${changePercent.toFixed(1)}%` : `${changePercent.toFixed(1)}%`}</span>
            {subtext && <span className="text-zinc-500 dark:text-zinc-400 font-sans font-normal ml-1">vs prior year</span>}
          </div>
        ) : subtext ? (
          <span className="text-zinc-600 dark:text-zinc-300 truncate font-mono">{subtext}</span>
        ) : (
          <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[11px]">Atlas 2024 Reference</span>
        )}

        {entityId && indicatorId && (
          <DataSourceBadge entityId={entityId} indicatorId={indicatorId} />
        )}
      </div>
    </div>
  );
};
