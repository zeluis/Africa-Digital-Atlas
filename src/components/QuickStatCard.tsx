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
    emerald: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
    cyan: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50',
    amber: 'text-amber-400 bg-amber-950/40 border-amber-800/50',
    indigo: 'text-indigo-400 bg-indigo-950/40 border-indigo-800/50',
    rose: 'text-rose-400 bg-rose-950/40 border-rose-800/50'
  };

  return (
    <div className={`rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-zinc-700 transition-all ${className}`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
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
        <span className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-zinc-50">
          {typeof value === 'number' ? (isNaN(value) ? '—' : value.toLocaleString()) : (value ?? '—')}
        </span>
        {unit && (
          <span className="text-xs font-medium text-zinc-400 font-sans">
            {unit}
          </span>
        )}
      </div>

      {/* Footer information & change indicator */}
      <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-2 text-xs">
        {changePercent !== undefined ? (
          <div className={`flex items-center gap-1 font-mono font-semibold ${
            changePercent > 0 ? 'text-emerald-400' : changePercent < 0 ? 'text-rose-400' : 'text-zinc-400'
          }`}>
            {changePercent > 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : changePercent < 0 ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            <span>{changePercent > 0 ? `+${changePercent.toFixed(1)}%` : `${changePercent.toFixed(1)}%`}</span>
            {subtext && <span className="text-zinc-500 font-sans font-normal ml-1">vs prior year</span>}
          </div>
        ) : subtext ? (
          <span className="text-zinc-400 truncate">{subtext}</span>
        ) : (
          <span className="text-zinc-500">Atlas 2024 Reference</span>
        )}

        {entityId && indicatorId && (
          <DataSourceBadge entityId={entityId} indicatorId={indicatorId} />
        )}
      </div>
    </div>
  );
};
