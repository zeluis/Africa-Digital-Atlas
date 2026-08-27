import React from 'react';

interface MainContentSkeletonProps {
  viewType?: string;
}

export const MainContentSkeleton: React.FC<MainContentSkeletonProps> = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-150 w-full" aria-busy="true" aria-label="Loading content">
      {/* Indeterminate Shimmer Progress Bar at Top of Content */}
      <div className="relative w-full h-1 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-full overflow-hidden mb-2">
        <div className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-full animate-indeterminate" />
        <div className="absolute top-0 bottom-0 bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 rounded-full animate-indeterminate-short" />
      </div>

      {/* Hero / Header Capsule Skeleton */}
      <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 p-6 md:p-8 shadow-sm animate-shimmer">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3 w-full max-w-xl">
            {/* Category tag pill skeleton */}
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800/80 rounded-lg animate-pulse" />
            {/* Main Heading skeleton */}
            <div className="h-8 w-3/4 max-w-md bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
            {/* Subtext lines */}
            <div className="space-y-1.5 pt-1">
              <div className="h-3.5 w-full bg-zinc-200/70 dark:bg-zinc-800/60 rounded-md animate-pulse" />
              <div className="h-3.5 w-2/3 bg-zinc-200/70 dark:bg-zinc-800/60 rounded-md animate-pulse" />
            </div>
          </div>
          {/* Action / Mode button skeleton */}
          <div className="flex gap-2 shrink-0">
            <div className="h-9 w-24 bg-zinc-200 dark:bg-zinc-800/80 rounded-2xl animate-pulse" />
            <div className="h-9 w-24 bg-zinc-200 dark:bg-zinc-800/80 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* 4 Metric / KPI Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(idx => (
          <div
            key={idx}
            className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 p-4 shadow-sm animate-shimmer flex flex-col justify-between h-28"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800/70 rounded-md animate-pulse" />
              <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800/80 animate-pulse" />
            </div>
            <div className="space-y-1.5 mt-2">
              <div className="h-7 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
              <div className="h-3 w-16 bg-zinc-200/60 dark:bg-zinc-800/50 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid Cards / Chart Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart / Visualizer Skeleton */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 p-6 shadow-sm animate-shimmer space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
            <div className="h-5 w-44 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-7 w-28 bg-zinc-200/80 dark:bg-zinc-800/60 rounded-xl animate-pulse" />
          </div>
          <div className="h-64 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/60 flex items-end justify-between p-6 gap-3">
            {[45, 60, 30, 80, 50, 75, 40, 90, 65, 55].map((h, i) => (
              <div
                key={i}
                className="w-full bg-zinc-200/70 dark:bg-zinc-800/70 rounded-t-lg animate-pulse"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Side Panel / Breakdown Skeleton */}
        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 p-6 shadow-sm animate-shimmer space-y-4">
          <div className="h-5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse pb-3 border-b border-zinc-100 dark:border-zinc-800/60" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-100/60 dark:border-zinc-900/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800/70 rounded-md animate-pulse" />
                </div>
                <div className="h-4 w-14 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
