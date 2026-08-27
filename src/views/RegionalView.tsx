import React, { useState } from 'react';
import { atlas } from '../data/atlas-store';
import { getRegionalSummaries, getBlocSummaries } from '../data/atlas-selectors';
import { AfricanRegion, RegionalBloc, UNRegionName } from '../data/types';
import { CountryFlag } from '../components/CountryFlag';
import { AfricaVectorMap } from '../components/AfricaVectorMap';
import { RegionalSilhouette } from '../components/RegionalSilhouette';
import { UN_M49_REGIONS, UN_M49_NUMERIC_CODES } from '../data/svgGeographySystem';
import { getRegionTonalPalette, UN_GEOSCHEME_TONAL_PALETTES } from '../data/unGeoschemeColors';
import { formatPopulation, formatGDP, formatHDI } from '../data/atlas-formatters';
import { 
  PieChart, 
  ResponsiveContainer, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { 
  Globe2, 
  Layers, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Award, 
  Building2, 
  ChevronRight,
  Compass,
  Crosshair,
  MapPin
} from 'lucide-react';

interface RegionalViewProps {
  onSelectCountry: (entityId: string) => void;
  initialRegion?: AfricanRegion;
}

export const RegionalView: React.FC<RegionalViewProps> = ({
  onSelectCountry,
  initialRegion = 'Western Africa'
}) => {
  const [activeTab, setActiveTab] = useState<'regions' | 'blocs'>('regions');
  const [selectedRegion, setSelectedRegion] = useState<AfricanRegion>(initialRegion);
  const [hoveredMapRegion, setHoveredMapRegion] = useState<UNRegionName | null>(null);
  const [selectedBloc, setSelectedBloc] = useState<RegionalBloc>('ECOWAS');
  const [mapMode, setMapMode] = useState<'continental' | 'isolated'>('isolated');

  React.useEffect(() => {
    if (initialRegion) {
      setSelectedRegion(initialRegion);
      setActiveTab('regions');
    }
  }, [initialRegion]);

  const regionalSummaries = getRegionalSummaries();
  const blocSummaries = getBlocSummaries();

  const currentRegionSummary = regionalSummaries.find(r => r.region === selectedRegion) || regionalSummaries[0];
  const currentBlocSummary = blocSummaries.find(b => b.bloc === selectedBloc) || blocSummaries[0];
  const m49RegionMeta = UN_M49_REGIONS[selectedRegion];
  const selectedRegionTonal = getRegionTonalPalette(selectedRegion);

  // Pie chart data for GDP by region with matching UN Geoscheme warm tonal colors
  const gdpPieData = regionalSummaries.map(r => ({
    name: r.region.replace(' Africa', ''),
    fullName: r.region,
    value: r.totalGdp,
    color: getRegionTonalPalette(r.region).warmAccent
  }));

  // Pie chart data for Population by region with matching UN Geoscheme warm tonal colors
  const popPieData = regionalSummaries.map(r => ({
    name: r.region.replace(' Africa', ''),
    fullName: r.region,
    value: r.totalPopulation,
    color: getRegionTonalPalette(r.region).warmAccent
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-2xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Active Page Pill Indicator */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-semibold mb-3 shadow-2xs ${selectedRegionTonal.badge.bg} ${selectedRegionTonal.badge.border} ${selectedRegionTonal.badge.text}`}>
              <Globe2 className="w-3.5 h-3.5" />
              <span>AFRICA ATLAS • {selectedRegion.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              Regional & Economic Blocs Explorer
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Comparative analysis across the 5 AU Geographic Regions and 8 Regional Economic Communities (RECs) using deterministic UN Geoscheme palettes.
            </p>
          </div>

          <div className="flex bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('regions')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'regions'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              5 Geographic Regions
            </button>
            <button
              onClick={() => setActiveTab('blocs')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'blocs'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Regional Blocs (RECs)
            </button>
          </div>
        </div>
      </div>

      {/* Continental Macro Comparison Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GDP Distribution Pie Chart */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Continental GDP Distribution ($B)
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">2024 IMF WEO</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gdpPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {gdpPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', color: '#f4f4f5' }}
                  formatter={(val: any) => [`$${Number(val).toFixed(1)} Billion`, 'GDP']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {gdpPieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 font-mono">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-zinc-500 dark:text-zinc-400">{d.name}:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">${d.value.toFixed(0)}B</span>
              </div>
            ))}
          </div>
        </div>

        {/* Population Distribution Pie Chart */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" /> Continental Population Share (Millions)
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">2024 UN DESA</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={popPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {popPieData.map((entry, index) => (
                    <Cell key={`cell-pop-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', color: '#f4f4f5' }}
                  formatter={(val: any) => [`${Number(val).toFixed(1)} Million`, 'Population']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {popPieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 font-mono">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-zinc-500 dark:text-zinc-400">{d.name}:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{d.value.toFixed(0)}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Detail Selector */}
      {activeTab === 'regions' ? (
        <div className="space-y-6">
          {/* View switcher: Regional Silhouette Vector vs Continental Geoscheme Map */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-100 dark:bg-zinc-900/80 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Select Region:</span>
              <div className="flex flex-wrap gap-1.5">
                {regionalSummaries.map(r => {
                  const isSelected = selectedRegion === r.region;
                  const tonal = getRegionTonalPalette(r.region);
                  return (
                    <button
                      key={r.region}
                      onClick={() => setSelectedRegion(r.region)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? `${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text} font-bold shadow-md ring-1 ring-offset-1 ring-zinc-400 dark:ring-zinc-600 scale-105`
                          : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{
                          backgroundColor: tonal.warmAccent,
                          boxShadow: `0 0 6px ${tonal.glowRgba}`
                        }}
                      />
                      <span>{r.region}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setMapMode('isolated')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  mapMode === 'isolated'
                    ? 'bg-emerald-500 text-zinc-950 font-bold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Regional Silhouette
              </button>
              <button
                onClick={() => setMapMode('continental')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  mapMode === 'continental'
                    ? 'bg-emerald-500 text-zinc-950 font-bold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Continental Context
              </button>
            </div>
          </div>

          {/* Interactive Geographic Vector View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6">
              {mapMode === 'isolated' ? (
                <RegionalSilhouette
                  region={selectedRegion}
                  onSelectCountry={onSelectCountry}
                  showMemberList={true}
                />
              ) : (
                <AfricaVectorMap
                  onSelectRegion={(reg) => setSelectedRegion(reg as AfricanRegion)}
                  hoveredRegion={hoveredMapRegion}
                  onHoverRegion={setHoveredMapRegion}
                />
              )}
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 md:p-7 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400">
                        UN M49: {m49RegionMeta?.code || '002'}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">Geoscheme</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display mt-1.5">{currentRegionSummary.region}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-400 font-mono">Nations</span>
                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{currentRegionSummary.countryCount}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                  <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">Total GDP</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">{formatGDP(currentRegionSummary.totalGdp)}</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">Population</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formatPopulation(currentRegionSummary.totalPopulation)}</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">Avg HDI</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{formatHDI(currentRegionSummary.averageHdi)}</span>
                  </div>
                </div>

                {/* Geography Pipeline Verification Badge */}
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200">SVG Geography System Asset</div>
                      <div className="text-[11px] text-zinc-500">Deterministic W3C Path • Zero Runtime Projection</div>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800/50">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Region Dossier */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
              <div>
                <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">{currentRegionSummary.region}</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Consisting of {currentRegionSummary.countryCount} sovereign nations and territorial jurisdictions
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl">
                  <span className="text-zinc-500">GDP: </span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{formatGDP(currentRegionSummary.totalGdp)}</span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl">
                  <span className="text-zinc-500">Pop: </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPopulation(currentRegionSummary.totalPopulation)}</span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl">
                  <span className="text-zinc-500">Avg HDI: </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{formatHDI(currentRegionSummary.averageHdi)}</span>
                </div>
              </div>
            </div>

            {/* Member Countries Matrix */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Member Nations & Territories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentRegionSummary.countries.map(country => {
                  const countryGdp = atlas.getIndicatorValue(country.id, 'NY.GDP.MKTP.CD') || 0;
                  const countryPop = atlas.getIndicatorValue(country.id, 'SP.POP.TOTL') || 0;
                  const countryM49 = UN_M49_NUMERIC_CODES[country.id] || '—';

                  return (
                    <div
                      key={country.id}
                      onClick={() => onSelectCountry(country.id)}
                      className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all cursor-pointer group flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <CountryFlag entityId={country.id} size="md" />
                        <div>
                          <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-500 transition-colors">
                            {country.name}
                          </div>
                          <div className="text-xs text-zinc-500">
                            Cap: {country.capital} • <span className="font-mono">M49: {countryM49}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <div className="font-bold text-zinc-800 dark:text-zinc-300">${countryGdp.toFixed(1)}B</div>
                        <div className="text-[10px] text-zinc-500">{countryPop.toFixed(1)}M pop</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Blocs Selector Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
            {blocSummaries.map(b => (
              <button
                key={b.bloc}
                onClick={() => setSelectedBloc(b.bloc)}
                className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedBloc === b.bloc
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {b.bloc} ({b.countriesCount})
              </button>
            ))}
          </div>

          {/* Bloc Dossier */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">{currentBlocSummary.bloc}</h2>
                  <span className="font-mono text-xs bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    {currentBlocSummary.countriesCount} Member States
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{currentBlocSummary.name}</p>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl">
                  <span className="text-zinc-500">Combined GDP: </span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{formatGDP(currentBlocSummary.totalGdp)}</span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl">
                  <span className="text-zinc-500">Market Size: </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPopulation(currentBlocSummary.totalPopulation)}</span>
                </div>
              </div>
            </div>

            {/* Bloc Members */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Treaty Member States</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentBlocSummary.countries.map(country => (
                  <div
                    key={country.id}
                    onClick={() => onSelectCountry(country.id)}
                    className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all cursor-pointer group flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <CountryFlag entityId={country.id} size="sm" />
                      <div className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-500 transition-colors truncate">
                        {country.name}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500">{country.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
