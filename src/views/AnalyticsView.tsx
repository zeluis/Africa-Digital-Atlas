import React, { useState, useMemo } from 'react';
import { atlas } from '../data/atlas-store';
import { 
  getIndicatorRankings, 
  getCorrelationDataset, 
  getMultiCountryTimeSeries 
} from '../data/atlas-selectors';
import { IndicatorDefinition } from '../data/types';
import { CountryFlag } from '../components/CountryFlag';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { IndicatorQuickSearch, getDomainColorClasses } from '../components/IndicatorQuickSearch';
import { exportBivariateCorrelationToCsv } from '../utils/exportUtils';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  ScatterChart as ScatterIcon, 
  ListFilter, 
  Download, 
  ArrowUpDown,
  Sparkles,
  Layers,
  BarChart2,
  Info,
  SlidersHorizontal,
  Globe2,
  Check
} from 'lucide-react';

interface AnalyticsViewProps {
  onSelectCountry: (entityId: string) => void;
  initialIndicatorId?: string;
}

interface DomainConfig {
  id: string;
  label: string;
  aliases: string[];
  defaultIndicator: string;
  corrPreset?: { x: string; y: string };
}

const DOMAIN_CONFIGS: DomainConfig[] = [
  { id: 'All', label: 'All Domains', aliases: ['All'], defaultIndicator: 'NY.GDP.MKTP.CD' },
  { id: 'Demographic', label: 'Demographic', aliases: ['Demographic', 'Demographics'], defaultIndicator: 'SP.POP.TOTL', corrPreset: { x: 'SP.POP.TOTL', y: 'SP.URB.TOTL.IN.ZS' } },
  { id: 'Macroeconomic', label: 'Macroeconomic', aliases: ['Macroeconomic', 'Economy', 'Economic'], defaultIndicator: 'NY.GDP.MKTP.CD', corrPreset: { x: 'NY.GDP.PCAP.CD', y: 'NY.GDP.MKTP.KD.ZG' } },
  { id: 'Social', label: 'Social', aliases: ['Social'], defaultIndicator: 'SI.POV.DDAY', corrPreset: { x: 'NY.GDP.PCAP.CD', y: 'SI.POV.DDAY' } },
  { id: 'Governance', label: 'Governance', aliases: ['Governance'], defaultIndicator: 'MO.IIAG.SCORE', corrPreset: { x: 'TI.CPI.SCORE', y: 'MO.IIAG.SCORE' } },
  { id: 'Environmental', label: 'Environmental', aliases: ['Environmental', 'Climate', 'Environment'], defaultIndicator: 'EN.ATM.CO2E.PC', corrPreset: { x: 'EG.FEC.RNEW.ZS', y: 'EN.ATM.CO2E.PC' } },
  { id: 'Health', label: 'Health', aliases: ['Health'], defaultIndicator: 'SH.DYN.MORT', corrPreset: { x: 'SH.XPD.GHED.GD.ZS', y: 'SH.DYN.MORT' } },
  { id: 'Education', label: 'Education', aliases: ['Education'], defaultIndicator: 'SE.ADT.LITR.ZS', corrPreset: { x: 'SE.PRM.ENRR', y: 'SE.ADT.LITR.ZS' } },
  { id: 'Infrastructure', label: 'Infrastructure', aliases: ['Infrastructure'], defaultIndicator: 'EG.ELC.ACCS.ZS', corrPreset: { x: 'EG.ELC.ACCS.ZS', y: 'IT.NET.USER.ZS' } },
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onSelectCountry,
  initialIndicatorId = 'NY.GDP.MKTP.CD'
}) => {
  const [activeTab, setActiveTab] = useState<'rankings' | 'timeseries' | 'correlation'>('rankings');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(initialIndicatorId);
  const [sortAscending, setSortAscending] = useState<boolean>(false);

  // Correlation state
  const [corrIndicatorX, setCorrIndicatorX] = useState<string>('NY.GDP.PCAP.CD');
  const [corrIndicatorY, setCorrIndicatorY] = useState<string>('SP.DYN.LE00.IN');

  // Time Series state
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['NGA', 'ZAF', 'EGY', 'KEN', 'GHA']);

  const allIndicators = useMemo(() => atlas.getAllIndicators(), []);
  const allEntities = useMemo(() => atlas.getAllEntities(), []);

  // Helper to check if an indicator matches a domain
  const indicatorMatchesDomain = (ind: IndicatorDefinition, domainId: string): boolean => {
    if (domainId === 'All') return true;
    const config = DOMAIN_CONFIGS.find(c => c.id === domainId);
    if (!config) return ind.domain.toLowerCase().includes(domainId.toLowerCase());
    return config.aliases.some(alias => ind.domain.toLowerCase().includes(alias.toLowerCase()));
  };

  // Helper to change domain and immediately update selected indicator to that domain's primary indicator
  const handleDomainChange = (domainId: string) => {
    setSelectedDomain(domainId);
    if (domainId !== 'All') {
      const config = DOMAIN_CONFIGS.find(c => c.id === domainId);
      const domainIndicators = allIndicators.filter(i => indicatorMatchesDomain(i, domainId));
      if (domainIndicators.length > 0) {
        const preferred = domainIndicators.find(i => i.id === config?.defaultIndicator) || domainIndicators[0];
        setSelectedIndicatorId(preferred.id);

        // If in correlation tab, also set Y-axis indicator to this domain's indicator
        if (activeTab === 'correlation') {
          if (config?.corrPreset) {
            setCorrIndicatorX(config.corrPreset.x);
            setCorrIndicatorY(config.corrPreset.y);
          } else {
            setCorrIndicatorY(preferred.id);
          }
        }
      }
    }
  };

  const currentIndicator = useMemo(
    () => atlas.getIndicator(selectedIndicatorId) || allIndicators[0],
    [selectedIndicatorId, allIndicators]
  );

  const rankings = useMemo(() => {
    return getIndicatorRankings(selectedIndicatorId, 54, sortAscending);
  }, [selectedIndicatorId, sortAscending]);

  // Correlation Dataset
  const correlationData = useMemo(() => {
    return getCorrelationDataset(corrIndicatorX, corrIndicatorY);
  }, [corrIndicatorX, corrIndicatorY]);

  // Statistical Regression & Correlation Calculations
  const correlationStats = useMemo(() => {
    const n = correlationData.length;
    if (n < 2) {
      return { r: 0, r2: 0, slope: 0, intercept: 0, meanX: 0, meanY: 0, strength: 'Insufficient Data' };
    }

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    for (const pt of correlationData) {
      sumX += pt.x;
      sumY += pt.y;
      sumXY += pt.x * pt.y;
      sumX2 += pt.x * pt.x;
      sumY2 += pt.y * pt.y;
    }

    const meanX = sumX / n;
    const meanY = sumY / n;
    const numerator = n * sumXY - sumX * sumY;
    const denomX = n * sumX2 - sumX * sumX;
    const denomY = n * sumY2 - sumY * sumY;

    const slope = denomX !== 0 ? numerator / denomX : 0;
    const intercept = meanY - slope * meanX;
    const denomR = Math.sqrt(Math.max(0, denomX * denomY));
    const r = denomR !== 0 ? numerator / denomR : 0;
    const r2 = r * r;

    let strength = 'Negligible Linear Correlation';
    const absR = Math.abs(r);
    if (absR >= 0.7) {
      strength = r > 0 ? 'Strong Positive Linear Relationship' : 'Strong Inverse Linear Relationship';
    } else if (absR >= 0.4) {
      strength = r > 0 ? 'Moderate Positive Association' : 'Moderate Inverse Association';
    } else if (absR >= 0.2) {
      strength = r > 0 ? 'Weak Positive Tendency' : 'Weak Inverse Tendency';
    }

    return { r, r2, slope, intercept, meanX, meanY, strength };
  }, [correlationData]);

  // Time Series Dataset
  const timeSeriesData = useMemo(() => {
    return getMultiCountryTimeSeries(selectedCountries, selectedIndicatorId);
  }, [selectedCountries, selectedIndicatorId]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Rank', 'Country ID', 'Country Name', 'Region', 'Indicator ID', 'Value', 'Unit', 'Source', 'Period'];
    const rows = rankings.map(r => [
      r.rank,
      r.entity.id,
      `"${r.entity.name}"`,
      `"${r.entity.region}"`,
      selectedIndicatorId,
      r.value,
      `"${r.unit}"`,
      r.source,
      r.year
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `africa_atlas_${selectedIndicatorId}_rankings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    const exportPayload = {
      indicator: currentIndicator,
      generatedAt: new Date().toISOString(),
      license: 'CC-BY-4.0 Open Access',
      rankings: rankings.map(r => ({
        rank: r.rank,
        id: r.entity.id,
        name: r.entity.name,
        region: r.entity.region,
        value: r.value,
        unit: r.unit,
        source: r.source,
        year: r.year
      }))
    };

    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `africa_atlas_${selectedIndicatorId}_rankings.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COUNTRY_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#f43f5e', '#3b82f6', '#ec4899', '#14b8a6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner - Matches Global Japandi Standard */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-2xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 mb-3 shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>AFRICA ATLAS • INDICATOR ANALYTICS</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              Indicator Analytics &amp; Comparative Engine
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Explore 50+ normalized socio-economic indicators across 54 African nations with real-time domain filtering and live search.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveTab('rankings')}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'rankings' 
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Rankings
            </button>
            <button
              onClick={() => setActiveTab('timeseries')}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'timeseries' 
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Layers className="w-4 h-4" /> Time Series
            </button>
            <button
              onClick={() => setActiveTab('correlation')}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'correlation' 
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <ScatterIcon className="w-4 h-4" /> Correlations
            </button>
          </div>
        </div>
      </div>

      {/* Universal Domain Selector & Quick Search Card - Matches Header Card Style */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-7 shadow-xl transition-colors space-y-5">
        {/* Domain Filter Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <ListFilter className="w-3.5 h-3.5 text-emerald-500" />
              SELECT DOMAIN (CLICK TO UPDATE TABLE &amp; INDICATORS INSTANTLY):
            </span>
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
              Active Domain: <strong className="text-zinc-900 dark:text-zinc-200">{selectedDomain}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            {DOMAIN_CONFIGS.map(d => {
              const isSelected = selectedDomain === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleDomainChange(d.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 font-bold shadow-md'
                      : 'bg-zinc-50 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-emerald-400 dark:text-emerald-600" />}
                  <span>{d.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Search Autocomplete & Actions */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1">
            <IndicatorQuickSearch
              selectedIndicatorId={selectedIndicatorId}
              onSelectIndicator={id => {
                setSelectedIndicatorId(id);
                const ind = atlas.getIndicator(id);
                if (ind) {
                  // Optionally sync domain
                  const matchingDomain = DOMAIN_CONFIGS.find(d => indicatorMatchesDomain(ind, d.id));
                  if (matchingDomain && selectedDomain !== 'All') {
                    setSelectedDomain(matchingDomain.id);
                  }
                }
              }}
              selectedDomain={selectedDomain}
              placeholder="Quick search 50+ indicators as you type (e.g. GDP, Life Expectancy, Population, Health)..."
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
              title="Download full indicator rankings as CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" /> Export CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
              title="Download full indicator dataset as JSON"
            >
              <Download className="w-3.5 h-3.5 text-cyan-500" /> Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: RANKINGS TABLE */}
      {activeTab === 'rankings' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Indicator Info Banner - Styled as elevated sub-card */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${getDomainColorClasses(currentIndicator.domain)}`}>
                  {currentIndicator.domain}
                </span>
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{currentIndicator.name}</span>
                <span className="font-mono text-zinc-400 dark:text-zinc-500">[{currentIndicator.id}]</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">{currentIndicator.definition}</p>
            </div>

            <div className="flex items-center gap-3 font-mono text-zinc-600 dark:text-zinc-400 shrink-0">
              <span>Unit: <strong className="text-zinc-900 dark:text-zinc-200">{currentIndicator.unit}</strong></span>
              <span>•</span>
              <button
                onClick={() => setSortAscending(!sortAscending)}
                className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer font-semibold shadow-2xs"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-emerald-500" /> 
                <span>{sortAscending ? 'Lowest First (Ascending)' : 'Highest First (Descending)'}</span>
              </button>
            </div>
          </div>

          {/* Rankings Table Card - Header Style Match */}
          <div className="overflow-x-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 font-mono text-zinc-600 dark:text-zinc-400">
                <tr>
                  <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                  <th className="py-3.5 px-4">Country / Sovereign State</th>
                  <th className="py-3.5 px-4">UN Region</th>
                  <th className="py-3.5 px-4 text-right">Observation Value ({currentIndicator.unit})</th>
                  <th className="py-3.5 px-4 text-right">Reference Year</th>
                  <th className="py-3.5 px-4 text-center">Data Source &amp; Provenance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {rankings.map(item => (
                  <tr
                    key={item.entity.id}
                    onClick={() => onSelectCountry(item.entity.id)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-center text-zinc-400 group-hover:text-emerald-500">
                      #{item.rank}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <CountryFlag entityId={item.entity.id} size="sm" />
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {item.entity.name}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">[{item.entity.id}]</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400">{item.entity.region}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      {item.value != null && !isNaN(item.value) ? item.value.toLocaleString() : '—'}{' '}
                      <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">{item.unit}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-500 dark:text-zinc-400">{item.year}</td>
                    <td className="py-3.5 px-4 text-center">
                      <DataSourceBadge entityId={item.entity.id} indicatorId={selectedIndicatorId} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: TIME SERIES */}
      {activeTab === 'timeseries' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Country Selection Card - Header Style Match */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-emerald-500" />
                Select Nations to Compare (Historical Trajectory 2015–2024):
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCountries(['NGA', 'ZAF', 'EGY', 'KEN', 'GHA'])}
                  className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Reset Top 5
                </button>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-[11px] font-mono text-zinc-400">{selectedCountries.length} countries selected</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {allEntities.slice(0, 24).map(e => {
                const isSelected = selectedCountries.includes(e.id);
                return (
                  <button
                    key={e.id}
                    onClick={() => {
                      if (isSelected) {
                        if (selectedCountries.length > 1) {
                          setSelectedCountries(selectedCountries.filter(id => id !== e.id));
                        }
                      } else {
                        setSelectedCountries([...selectedCountries, e.id]);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300 shadow-xs'
                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <CountryFlag entityId={e.id} size="xs" />
                    <span>{e.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Series Multi-Line Chart Card - Header Style Match */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${getDomainColorClasses(currentIndicator.domain)}`}>
                    {currentIndicator.domain}
                  </span>
                  <h3 className="font-bold text-base md:text-lg text-zinc-900 dark:text-zinc-100">
                    {currentIndicator.name} Trajectory (2015–2024)
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Unit: <strong>{currentIndicator.unit}</strong> • Source: {currentIndicator.preferredSource || 'World Bank / Multilateral'}
                </p>
              </div>
            </div>

            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:stroke-zinc-800" />
                  <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(24, 24, 27, 0.95)', 
                      borderColor: '#3f3f46', 
                      borderRadius: '1rem', 
                      color: '#f4f4f5',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                    }}
                  />
                  <Legend />
                  {selectedCountries.map((countryId, idx) => (
                    <Line
                      key={countryId}
                      type="monotone"
                      dataKey={countryId}
                      name={atlas.getEntity(countryId)?.name || countryId}
                      stroke={COUNTRY_COLORS[idx % COUNTRY_COLORS.length]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 7 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: BIVARIATE CORRELATION EXPLORER & REGRESSION WORKBENCH */}
      {activeTab === 'correlation' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Preset Indicator Exploration Pills Card - Header Style Match */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                EMPIRICAL HYPOTHESIS &amp; CORRELATION PRESETS:
              </span>
              <button
                onClick={() => {
                  const indX = atlas.getIndicator(corrIndicatorX) || allIndicators[0];
                  const indY = atlas.getIndicator(corrIndicatorY) || allIndicators[1];
                  exportBivariateCorrelationToCsv(
                    indX,
                    indY,
                    correlationData.map(d => ({
                      entityId: d.entityId,
                      entityName: d.name,
                      region: d.region,
                      x: d.x,
                      y: d.y,
                      size: d.size
                    })),
                    correlationStats
                  );
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" /> Export Correlation Matrix (.csv)
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: 'GDP vs. Life Expectancy', x: 'NY.GDP.PCAP.CD', y: 'SP.DYN.LE00.IN' },
                { label: 'Electricity Access vs. Urbanization', x: 'EG.ELC.ACCS.ZS', y: 'SP.URB.TOTL.IN.ZS' },
                { label: 'Renewable Energy % vs. CO2 Emissions', x: 'EG.FEC.RNEW.ZS', y: 'EN.ATM.CO2E.PC' },
                { label: 'Trade Openness vs. GDP Growth', x: 'NE.TRD.GNFS.ZS', y: 'NY.GDP.MKTP.KD.ZG' },
                { label: 'Health Spend % vs. Maternal Health', x: 'SH.XPD.GHED.GD.ZS', y: 'SH.STA.MMRT' },
                { label: 'Primary Enrollment vs. Adult Literacy', x: 'SE.PRM.ENRR', y: 'SE.ADT.LITR.ZS' },
                { label: 'Corruption Perception vs. Governance Score', x: 'TI.CPI.SCORE', y: 'MO.IIAG.SCORE' }
              ].map(preset => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setCorrIndicatorX(preset.x);
                    setCorrIndicatorY(preset.y);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                    corrIndicatorX === preset.x && corrIndicatorY === preset.y
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 font-bold shadow-sm'
                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search Axis Selectors Card - Header Style Match */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* X-Axis Quick Search */}
              <div className="space-y-2">
                <IndicatorQuickSearch
                  selectedIndicatorId={corrIndicatorX}
                  onSelectIndicator={id => setCorrIndicatorX(id)}
                  label="X-Axis Independent Variable (Quick Search):"
                  placeholder="Type to search X-Axis indicator..."
                  compact
                />
              </div>

              {/* Y-Axis Quick Search */}
              <div className="space-y-2">
                <IndicatorQuickSearch
                  selectedIndicatorId={corrIndicatorY}
                  onSelectIndicator={id => setCorrIndicatorY(id)}
                  label="Y-Axis Dependent Variable (Quick Search):"
                  placeholder="Type to search Y-Axis indicator..."
                  compact
                />
              </div>
            </div>
          </div>

          {/* Statistical Regression Readout Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-md">
              <p className="text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Pearson Correlation (r)</p>
              <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {correlationStats.r >= 0 ? `+${correlationStats.r.toFixed(3)}` : correlationStats.r.toFixed(3)}
              </p>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">{correlationStats.strength}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-md">
              <p className="text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Determination (R²)</p>
              <p className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                {(correlationStats.r2 * 100).toFixed(1)}%
              </p>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">Variance explained</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-md">
              <p className="text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Linear Slope (m)</p>
              <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                {correlationStats.slope.toFixed(4)}
              </p>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">ΔY per 1.0 unit of X</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-md">
              <p className="text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Sample Size</p>
              <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
                N = {correlationData.length}
              </p>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">African Sovereign Nations</p>
            </div>
          </div>

          {/* Scatter Plot Card - Header Style Match */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="font-bold text-base md:text-lg text-zinc-900 dark:text-zinc-100">
                  Cross-Sectional African Scatter Matrix &amp; Regression
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Click any country bubble to inspect its national dossier • Bubble size proportional to population
                </p>
              </div>
            </div>

            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:stroke-zinc-800" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name={atlas.getIndicator(corrIndicatorX)?.name || 'X'} 
                    stroke="#71717a" 
                    fontSize={11} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name={atlas.getIndicator(corrIndicatorY)?.name || 'Y'} 
                    stroke="#71717a" 
                    fontSize={11} 
                  />
                  <ZAxis type="number" dataKey="size" range={[60, 450]} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(24, 24, 27, 0.95)', 
                      borderColor: '#3f3f46', 
                      borderRadius: '1rem', 
                      color: '#f4f4f5',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                    }}
                    formatter={(val: any, name: any) => [val != null && !isNaN(Number(val)) ? Number(val).toLocaleString() : '—', name]}
                  />
                  <Scatter 
                    name="African Nations" 
                    data={correlationData} 
                    fill="#10b981" 
                    onClick={(node: any) => node?.entityId && onSelectCountry(node.entityId)}
                    cursor="pointer"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
