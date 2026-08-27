import React, { useState, useMemo } from 'react';
import { atlas } from '../data/atlas-store';
import { 
  getIndicatorRankings, 
  getCorrelationDataset, 
  getMultiCountryTimeSeries 
} from '../data/atlas-selectors';
import { IndicatorDefinition, IndicatorDomain } from '../data/types';
import { CountryFlag } from '../components/CountryFlag';
import { DataSourceBadge } from '../components/DataSourceBadge';
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
  Search, 
  ArrowUpDown,
  Sparkles,
  Layers,
  Database
} from 'lucide-react';

interface AnalyticsViewProps {
  onSelectCountry: (entityId: string) => void;
  initialIndicatorId?: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onSelectCountry,
  initialIndicatorId = 'NY.GDP.MKTP.CD'
}) => {
  const [activeTab, setActiveTab] = useState<'rankings' | 'correlation' | 'timeseries'>('rankings');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(initialIndicatorId);
  const [sortAscending, setSortAscending] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Correlation state
  const [corrIndicatorX, setCorrIndicatorX] = useState<string>('NY.GDP.PCAP.CD');
  const [corrIndicatorY, setCorrIndicatorY] = useState<string>('SP.DYN.LE00.IN');

  // Time Series state
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['NGA', 'ZAF', 'EGY', 'KEN', 'GHA']);

  const allIndicators = atlas.getAllIndicators();
  const allEntities = atlas.getAllEntities();

  const domains: (string)[] = ['All', 'Demographic', 'Macroeconomic', 'Social', 'Governance', 'Environmental', 'Health', 'Education', 'Infrastructure'];

  const filteredIndicators = useMemo(() => {
    return allIndicators.filter(i => {
      const matchesDomain = selectedDomain === 'All' || i.domain === selectedDomain;
      const matchesSearch = i.name.toLowerCase().includes(searchFilter.toLowerCase()) || i.id.toLowerCase().includes(searchFilter.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [allIndicators, selectedDomain, searchFilter]);

  const currentIndicator = atlas.getIndicator(selectedIndicatorId) || allIndicators[0];
  const rankings = useMemo(() => {
    return getIndicatorRankings(selectedIndicatorId, 54, sortAscending);
  }, [selectedIndicatorId, sortAscending]);

  // Correlation Dataset
  const correlationData = useMemo(() => {
    return getCorrelationDataset(corrIndicatorX, corrIndicatorY);
  }, [corrIndicatorX, corrIndicatorY]);

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

  const COUNTRY_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#f43f5e', '#3b82f6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-2xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Active Page Pill Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 mb-3 shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>AFRICA ATLAS • INDICATOR ANALYTICS</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              Indicator Analytics & Comparative Engine
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Explore 50+ normalized socio-economic indicators, correlation scatters, and multi-country time series (2015-2024)
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('rankings')}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'rankings' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Rankings
            </button>
            <button
              onClick={() => setActiveTab('timeseries')}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'timeseries' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Layers className="w-4 h-4" /> Time Series
            </button>
            <button
              onClick={() => setActiveTab('correlation')}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'correlation' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <ScatterIcon className="w-4 h-4" /> Correlations
            </button>
          </div>
        </div>
      </div>

      {/* Indicator Selection Ribbon */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1 pr-2">
            <ListFilter className="w-3.5 h-3.5 text-emerald-400" /> Domain:
          </span>
          {domains.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedDomain === d
                  ? 'bg-zinc-100 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Indicator Dropdown & Search Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <select
              value={selectedIndicatorId}
              onChange={e => setSelectedIndicatorId(e.target.value)}
              className="w-full appearance-none bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs md:text-sm font-semibold py-2.5 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {filteredIndicators.map(i => (
                <option key={i.id} value={i.id}>
                  [{i.domain}] {i.name} ({i.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search 50+ indicators..."
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs py-2 pl-8 pr-3 rounded-xl focus:outline-none"
              />
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
              title="Download full indicator rankings as CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" /> CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
              title="Download full indicator dataset as JSON"
            >
              <Download className="w-3.5 h-3.5 text-cyan-500" /> JSON
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: RANKINGS TABLE */}
      {activeTab === 'rankings' && (
        <div className="space-y-4">
          {/* Indicator Info Banner */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-semibold text-emerald-400">{currentIndicator.name}</span>
              <p className="text-zinc-400 mt-0.5">{currentIndicator.definition}</p>
            </div>
            <div className="flex items-center gap-3 font-mono text-zinc-400">
              <span>Unit: <strong>{currentIndicator.unit}</strong></span>
              <span>•</span>
              <span>Domain: <strong>{currentIndicator.domain}</strong></span>
              <button
                onClick={() => setSortAscending(!sortAscending)}
                className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded-lg border border-zinc-700 transition-colors cursor-pointer"
              >
                <ArrowUpDown className="w-3 h-3" /> {sortAscending ? 'Lowest First' : 'Highest First'}
              </button>
            </div>
          </div>

          {/* Rankings Table */}
          <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-950/80 font-mono text-zinc-400">
                <tr>
                  <th className="py-3 px-4 w-16">Rank</th>
                  <th className="py-3 px-4">Country / Territory</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4 text-right">Observation Value</th>
                  <th className="py-3 px-4 text-right">Reference Period</th>
                  <th className="py-3 px-4 text-center">Data Source & Provenance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {rankings.map(item => (
                  <tr
                    key={item.entity.id}
                    onClick={() => onSelectCountry(item.entity.id)}
                    className="hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-zinc-500 group-hover:text-emerald-400">
                      #{item.rank}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <CountryFlag entityId={item.entity.id} size="sm" />
                        <span className="font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                          {item.entity.name}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">[{item.entity.id}]</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{item.entity.region}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-300 text-sm">
                      {item.value != null && !isNaN(item.value) ? item.value.toLocaleString() : '—'} <span className="text-xs font-normal text-zinc-400">{item.unit}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-zinc-400">{item.year}</td>
                    <td className="py-3 px-4 text-center">
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
        <div className="space-y-6">
          {/* Country Selection Chips */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Select Nations to Compare (Historical Trajectory 2015-2024):
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {allEntities.slice(0, 15).map(e => {
                const isSelected = selectedCountries.includes(e.id);
                return (
                  <button
                    key={e.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCountries(selectedCountries.filter(id => id !== e.id));
                      } else {
                        setSelectedCountries([...selectedCountries, e.id]);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300 shadow-sm'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <CountryFlag entityId={e.id} size="xs" />
                    <span>{e.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Series Multi-Line Chart */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-zinc-100">{currentIndicator.name} Multi-Country Trajectory</h3>
                <p className="text-xs text-zinc-400">Unit: {currentIndicator.unit} (World Bank / IMF Historical Series)</p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', color: '#f4f4f5' }}
                  />
                  <Legend />
                  {selectedCountries.map((countryId, idx) => (
                    <Line
                      key={countryId}
                      type="monotone"
                      dataKey={countryId}
                      name={atlas.getEntity(countryId)?.name || countryId}
                      stroke={COUNTRY_COLORS[idx % COUNTRY_COLORS.length]}
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: BIVARIATE CORRELATION EXPLORER */}
      {activeTab === 'correlation' && (
        <div className="space-y-6">
          {/* Axis Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
              <label className="text-xs font-semibold uppercase text-zinc-400">X-Axis Indicator:</label>
              <select
                value={corrIndicatorX}
                onChange={e => setCorrIndicatorX(e.target.value)}
                className="w-full appearance-none bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs md:text-sm font-semibold py-2 px-3 rounded-xl focus:outline-none"
              >
                {allIndicators.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
              <label className="text-xs font-semibold uppercase text-zinc-400">Y-Axis Indicator:</label>
              <select
                value={corrIndicatorY}
                onChange={e => setCorrIndicatorY(e.target.value)}
                className="w-full appearance-none bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs md:text-sm font-semibold py-2 px-3 rounded-xl focus:outline-none"
              >
                {allIndicators.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.unit})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scatter Plot */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-zinc-100">Bivariate African Cross-Sectional Plot</h3>
                <p className="text-xs text-zinc-400">Bubble size scaled by national population</p>
              </div>
            </div>

            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
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
                  <ZAxis type="number" dataKey="size" range={[50, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', color: '#f4f4f5' }}
                    formatter={(val: any, name: any) => [val != null && !isNaN(Number(val)) ? Number(val).toLocaleString() : '—', name]}
                  />
                  <Scatter 
                    name="African Nations" 
                    data={correlationData} 
                    fill="#10b981" 
                    onClick={(node) => onSelectCountry(node.entityId)}
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
