/**
 * Centralized formatting utilities for Africa Data Atlas metrics.
 * Ensures consistent numbers, currencies, percentages, and dates across all UI components.
 */

export function formatPopulation(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  const num = Number(val);
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}B`;
  }
  if (num >= 1) {
    return `${num.toFixed(1)}M`;
  }
  return `${(num * 1000).toFixed(0)}k`;
}

export function formatCurrency(val: number | null | undefined, unit: string = 'USD'): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  const num = Number(val);
  if (unit === 'USD Billion') {
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}T`;
    return `$${num.toFixed(1)}B`;
  }
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}k`;
  return `$${num.toLocaleString()}`;
}

export function formatGDP(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  const num = Number(val);
  if (num >= 1000) return `$${(num / 1000).toFixed(2)} Trillion`;
  return `$${num.toFixed(1)} Billion`;
}

export function formatPercentage(val: number | null | undefined, decimals: number = 1): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return `${Number(val).toFixed(decimals)}%`;
}

export function formatNumber(val: number | null | undefined, decimals: number = 2): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return Number(Number(val).toFixed(decimals)).toLocaleString();
}

export function formatHDI(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return Number(val).toFixed(3);
}

export function formatHDICategory(val: number | null | undefined): { label: string; color: string } {
  if (!val || isNaN(val)) return { label: 'Data Unavailable', color: 'text-zinc-400 bg-zinc-800/40 border-zinc-700' };
  const num = Number(val);
  if (num >= 0.800) return { label: 'Very High Development', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50' };
  if (num >= 0.700) return { label: 'High Development', color: 'text-teal-400 bg-teal-950/40 border-teal-800/50' };
  if (num >= 0.550) return { label: 'Medium Development', color: 'text-amber-400 bg-amber-950/40 border-amber-800/50' };
  return { label: 'Low Development', color: 'text-rose-400 bg-rose-950/40 border-rose-800/50' };
}

export function formatArea(km2: number | null | undefined): string {
  if (km2 === null || km2 === undefined || isNaN(km2) || km2 === 0) return '—';
  return `${Number(km2).toLocaleString()} km²`;
}

export function formatValueByUnit(value: number | null | undefined, unit: string): string {
  if (value === null || value === undefined || isNaN(value)) return 'Data Unavailable';
  const num = Number(value);
  if (unit === 'USD Billion') return formatGDP(num);
  if (unit === 'USD') return `$${Math.round(num).toLocaleString()}`;
  if (unit === '%') return `${num.toFixed(1)}%`;
  if (unit === '% of GDP') return `${num.toFixed(1)}% of GDP`;
  if (unit === 'People (Million)') return formatPopulation(num);
  if (unit === 'Years') return `${num.toFixed(1)} years`;
  if (unit === 'Index (0-1)') return num.toFixed(3);
  if (unit === 'Score (0-100)') return `${num.toFixed(1)} / 100`;
  if (unit === 'Score (1-5)') return `${num.toFixed(2)} (1-5)`;
  if (unit === 'per 1,000 births') return `${num.toFixed(1)} / 1k births`;
  if (unit === 'Births/Woman') return `${num.toFixed(2)} births/woman`;
  return `${num.toLocaleString()} ${unit}`;
}
