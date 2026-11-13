import React from 'react';
import { Table } from 'lucide-react';

export interface ChartAccessibleTableProps {
  caption: string;
  headers: string[];
  rows: (string | number | null | undefined)[][];
  summaryLabel?: string;
  className?: string;
}

export const ChartAccessibleTable: React.FC<ChartAccessibleTableProps> = ({
  caption,
  headers,
  rows,
  summaryLabel = 'Inspect tabular data',
  className = '',
}) => {
  if (!rows || rows.length === 0) return null;

  return (
    <details className={`mt-2 text-left group ${className}`}>
      <summary className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer select-none py-1 px-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
        <Table className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span>
          {summaryLabel} ({rows.length} rows)
        </span>
      </summary>
      <div className="mt-2 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/90 max-h-64 overflow-y-auto sleek-scrollbar">
        <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 sticky top-0">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} scope="col" className="px-3 py-2 font-semibold whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-zinc-800 dark:text-zinc-200">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50">
                {row.map((cell, cIdx) => {
                  const content = cell === null || cell === undefined || cell === '' ? '—' : String(cell);
                  return cIdx === 0 ? (
                    <th key={cIdx} scope="row" className="px-3 py-1.5 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      {content}
                    </th>
                  ) : (
                    <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap">
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
};

export default ChartAccessibleTable;
