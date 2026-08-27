import React, { useState, useMemo } from 'react';
import { atlas } from '../data/atlas-store';
import { AtlasEntity, HeritageSite, SubnationalUnit } from '../data/types';
import { CountryFlag } from '../components/CountryFlag';
import { CountrySilhouette } from '../components/CountrySilhouette';
import { CountryHeaderInfo } from '../components/CountryHeaderInfo';
import { ClimateEcologySection } from '../components/ClimateEcologySection';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { useTranslation } from '../i18n/LanguageContext';
import { useSavedEntities } from '../contexts/SavedEntitiesContext';
import { 
  formatPopulation, 
  formatGDP, 
  formatCurrency, 
  formatPercentage, 
  formatHDI, 
  formatHDICategory, 
  formatArea 
} from '../data/atlas-formatters';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  Globe, 
  DollarSign, 
  Users, 
  HeartHandshake, 
  Zap, 
  ShieldCheck, 
  Landmark, 
  ExternalLink, 
  TrendingUp, 
  MapPin, 
  Building2, 
  Layers, 
  Award, 
  AlertTriangle,
  ChevronRight,
  Sparkles,
  BookOpen,
  Trees,
  Star
} from 'lucide-react';

interface CountryViewProps {
  entityId: string;
  onSelectCountry: (entityId: string) => void;
  onSelectIndicator?: (indicatorId: string) => void;
}

type TabType = 'overview' | 'climate' | 'economy' | 'demographics' | 'health_edu' | 'infrastructure' | 'governance' | 'heritage' | 'subnational' | 'provenance';

export const CountryView: React.FC<CountryViewProps> = ({
  entityId,
  onSelectCountry
}) => {
  const { t } = useTranslation();
  const { isCountrySaved, toggleSaveCountry } = useSavedEntities();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const entity = atlas.getEntity(entityId) || atlas.getEntity('NGA')!;
  const isSaved = isCountrySaved(entity.id);
  const media = atlas.getMedia(entity.id);
  const heritageSites = atlas.getHeritageSites(entity.id);
  const subnationalUnits = atlas.getSubnationalUnits(entity.id);
  const qualityFlags = atlas.getQualityFlags(entity.id);

  // Key Indicators
  const pop = atlas.getIndicatorValue(entity.id, 'SP.POP.TOTL');
  const gdp = atlas.getIndicatorValue(entity.id, 'NY.GDP.MKTP.CD');
  const gdpGrowth = atlas.getIndicatorValue(entity.id, 'NY.GDP.MKTP.KD.ZG');
  const hdi = atlas.getIndicatorValue(entity.id, 'UNDP.HDI.INDEX');
  const life = atlas.getIndicatorValue(entity.id, 'SP.DYN.LE00.IN');
  const electricity = atlas.getIndicatorValue(entity.id, 'EG.ELC.ACCS.ZS');
  const inflation = atlas.getIndicatorValue(entity.id, 'FP.CPI.TOTL.ZG');
  const debtGdp = atlas.getIndicatorValue(entity.id, 'GC.DOD.TOTL.GD.ZS');
  const literacy = atlas.getIndicatorValue(entity.id, 'SE.ADT.LITR.ZS');
  const peaceIndex = atlas.getIndicatorValue(entity.id, 'IEP.GPI.SCORE');
  const ibrahimScore = atlas.getIndicatorValue(entity.id, 'MO.IIAG.SCORE');

  const gdpPerCapita = pop && gdp ? Math.round((gdp * 1e9) / (pop * 1e6)) : null;
  const hdiCat = formatHDICategory(hdi);

  // Historical GDP Trend Data
  const gdpSeries = useMemo(() => {
    const obs = atlas.getObservations(entity.id, 'NY.GDP.MKTP.CD');
    return obs.map(o => ({
      year: o.period.toString(),
      gdp: o.value,
      growth: atlas.getObservations(entity.id, 'NY.GDP.MKTP.KD.ZG').find(g => g.period === o.period)?.value || 0
    }));
  }, [entity.id]);

  // Historical Population Trend Data
  const popSeries = useMemo(() => {
    const obs = atlas.getObservations(entity.id, 'SP.POP.TOTL');
    return obs.map(o => ({
      year: o.period.toString(),
      population: o.value
    }));
  }, [entity.id]);

  const tabs = [
    { id: 'overview' as TabType, label: t('tab.overview', 'Overview & Facts'), icon: <Globe className="w-4 h-4" /> },
    { id: 'climate' as TabType, label: t('tab.climate', 'Climate & Ecology'), icon: <Trees className="w-4 h-4 text-emerald-400" /> },
    { id: 'economy' as TabType, label: t('tab.economy', 'Economy & Trade'), icon: <DollarSign className="w-4 h-4" /> },
    { id: 'demographics' as TabType, label: t('tab.demographics', 'Demographics'), icon: <Users className="w-4 h-4" /> },
    { id: 'health_edu' as TabType, label: t('tab.health_edu', 'Health & Education'), icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'infrastructure' as TabType, label: t('tab.infrastructure', 'Infrastructure & Tech'), icon: <Zap className="w-4 h-4" /> },
    { id: 'governance' as TabType, label: t('tab.governance', 'Governance & Peace'), icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'heritage' as TabType, label: `${t('tab.heritage', 'UNESCO Heritage')} (${heritageSites.length})`, icon: <Landmark className="w-4 h-4" /> },
    { id: 'subnational' as TabType, label: `${t('tab.subnational', 'Regions')} (${subnationalUnits.length})`, icon: <Layers className="w-4 h-4" /> },
    { id: 'provenance' as TabType, label: t('tab.provenance', 'Provenance & Sources'), icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Country Dossier Header Card */}
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-950 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          {/* Left Side: Country Identity & Key Metrics Capsule */}
          <div className="flex-1 space-y-5">
            {/* Country Identity Block */}
            <div className="flex items-start gap-5">
              <CountryFlag entityId={entity.id} size="xl" className="shadow-lg mt-1" />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-100 font-display">
                    {entity.name}
                  </h1>
                  <button
                    onClick={() => toggleSaveCountry(entity.id)}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-amber-950/60 border-amber-600/80 text-amber-400 shadow-sm'
                        : 'bg-zinc-800/80 border-zinc-700/80 text-zinc-400 hover:text-amber-400'
                    }`}
                    title={isSaved ? 'Remove from Saved Countries' : 'Save Country to Quick Access'}
                  >
                    <Star className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
                    {entity.id} / {entity.iso2}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                    entity.sovereign 
                      ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400' 
                      : 'bg-indigo-950/60 border-indigo-800/60 text-indigo-400'
                  }`}>
                    {entity.sovereign ? 'Sovereign AU Member' : 'Autonomous Territory'}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-zinc-400 font-medium">
                  {entity.officialName}
                </p>
                
                {/* Badges / Regional Blocs */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                    {entity.region}
                  </span>
                  {entity.blocs.map(bloc => (
                    <span key={bloc} className="text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">
                      {bloc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Core Metrics Capsule */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/80 border border-zinc-800/80 p-3.5 rounded-2xl">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-zinc-500">Population</span>
                <div className="font-mono font-bold text-sm text-zinc-100">{formatPopulation(pop)}</div>
                <DataSourceBadge entityId={entity.id} indicatorId="SP.POP.TOTL" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-zinc-500">Nominal GDP</span>
                <div className="font-mono font-bold text-sm text-cyan-400">{formatGDP(gdp)}</div>
                <DataSourceBadge entityId={entity.id} indicatorId="NY.GDP.MKTP.CD" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-zinc-500">GDP Per Capita</span>
                <div className="font-mono font-bold text-sm text-emerald-400">{formatCurrency(gdpPerCapita)}</div>
                <span className="text-[10px] text-zinc-500">Calculated</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-zinc-500">Human Dev. (HDI)</span>
                <div className="font-mono font-bold text-sm text-amber-400">{formatHDI(hdi)}</div>
                <span className={`text-[10px] font-sans font-medium px-1.5 py-0.2 rounded border ${hdiCat.color}`}>
                  {hdiCat.label.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Prominent Country SVG Silhouette Plaque */}
          <div className="flex-shrink-0 flex items-center justify-center lg:justify-end">
            <CountrySilhouette entityId={entity.id} size="header" />
          </div>
        </div>

        {/* Detailed Country Header Metadata: Capital, Government, Independence, UN Member, Languages, Religion, Live Time & Temperature */}
        <div className="pt-2 border-t border-zinc-800/80">
          <CountryHeaderInfo entityId={entity.id} />
        </div>

        {/* Quality Alerts Banner if applicable */}
        {qualityFlags.length > 0 && (
          <div className="mt-6 rounded-2xl border border-amber-800/40 bg-amber-950/20 p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>Data Reconciliation Note:</strong> {qualityFlags[0].description}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('provenance')}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex-shrink-0"
            >
              View Provenance Audit →
            </button>
          </div>
        )}
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex space-x-1.5 overflow-x-auto no-scrollbar border-b border-zinc-800 pb-2">
        {tabs.map(t => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-zinc-100 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Container */}
      <div className="space-y-6">
        {/* TAB 1: OVERVIEW & KEY FACTS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: General Facts Card */}
            <div className="lg:col-span-6 space-y-6">
              {/* Why This Nation Matters: Executive Strategic Insight */}
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Macroeconomic & Regional Role
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">Harmonized 2024</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-display">
                  Why {entity.name} Matters in Pan-African Growth
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  As a leading constituent of {entity.region}, {entity.name} accounts for an estimated {formatPopulation(pop)} population and {formatGDP(gdp)} in economic output. With membership in {entity.blocs.join(', ')}, the nation plays a central role in regional trade corridors, infrastructure harmonization, and continental workforce dynamics.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                    Capita: <strong>{formatCurrency(gdpPerCapita)}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                    HDI: <strong>{formatHDI(hdi)} ({hdiCat.label.split(' ')[0]})</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                    Grid: <strong>{formatPercentage(electricity)}</strong>
                  </span>
                </div>
              </div>

              {/* Climate Teaser Banner in Overview */}
              <div 
                onClick={() => setActiveTab('climate')}
                className="rounded-2xl border border-emerald-900/50 bg-gradient-to-r from-emerald-950/40 via-zinc-900/80 to-zinc-900/80 p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      {t('tab.climate', 'Climate & Ecology Profile')}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      12-Month Cycles, Live Weather, Vulnerability Matrix & Resilience
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Explore →
                </span>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
                <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <Globe className="w-4 h-4 text-emerald-400" /> Geographic & National Profile
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 font-medium">Capital City</span>
                    <div className="font-semibold text-zinc-200 text-sm mt-0.5">{entity.capital}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Land Area</span>
                    <div className="font-semibold text-zinc-200 text-sm mt-0.5">{formatArea(entity.landAreaKm2)}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Currency</span>
                    <div className="font-semibold text-zinc-200 text-sm mt-0.5">
                      {entity.currency.name} ({entity.currency.code}, {entity.currency.symbol})
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Income Classification</span>
                    <div className="font-semibold text-zinc-200 text-sm mt-0.5">
                      {entity.incomeLevel} • {entity.geographicType}
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Official Languages</span>
                    <div className="font-semibold text-zinc-200 text-sm mt-0.5">
                      {entity.languages.official.join(', ')}
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Government Form</span>
                    <div className="font-semibold text-zinc-200 text-sm mt-0.5">{entity.governmentType}</div>
                  </div>
                </div>

                {/* Bordering Nations */}
                <div className="pt-3 border-t border-zinc-800">
                  <span className="text-xs text-zinc-500 font-medium">Land Borders ({(entity.borders || []).length}):</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {entity.borders && entity.borders.length > 0 ? (
                      entity.borders.map(borderId => {
                        const borderEntity = atlas.getEntity(borderId);
                        return (
                          <button
                            key={borderId}
                            onClick={() => onSelectCountry(borderId)}
                            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-2.5 py-1 rounded-lg border border-zinc-700 transition-colors cursor-pointer"
                          >
                            <CountryFlag entityId={borderId} size="xs" />
                            <span>{borderEntity?.name || borderId}</span>
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-xs text-zinc-400 italic">No land borders or regional insular state</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Economic Drivers & Facts */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
                <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <Award className="w-4 h-4 text-amber-400" /> Strategic Commodities & Exports
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-zinc-500">Key Export Commodities:</span>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {Array.isArray(entity.facts.majorExports) ? (
                        entity.facts.majorExports.map((exp: string, idx: number) => (
                          <span key={idx} className="rounded-lg bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 text-xs font-semibold text-emerald-300">
                            {exp}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-400">Petroleum, mineral ores, agricultural produce</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500">Major Trading Partners:</span>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {Array.isArray(entity.facts.majorTradingPartners) ? (
                        entity.facts.majorTradingPartners.map((tp: string, idx: number) => (
                          <span key={idx} className="rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
                            {tp}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-400">African Union / EU / Global Partners</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: GDP Trajectory Preview Chart */}
            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" /> Gross Domestic Product Trajectory
                    </h3>
                    <p className="text-xs text-zinc-400">Nominal GDP in USD Billions (2015-2024)</p>
                  </div>
                  <DataSourceBadge entityId={entity.id} indicatorId="NY.GDP.MKTP.CD" />
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={gdpSeries}>
                      <defs>
                        <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="year" stroke="#71717a" textAnchor="middle" fontSize={11} />
                      <YAxis stroke="#71717a" fontSize={11} tickFormatter={v => `$${v}B`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', color: '#f4f4f5' }}
                        formatter={(val: any) => [`$${Number(val).toFixed(2)} Billion`, 'Nominal GDP']}
                      />
                      <Area type="monotone" dataKey="gdp" stroke="#06b6d4" strokeWidth={2.5} fill="url(#gdpGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Population Trajectory Chart */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" /> Population Expansion
                    </h3>
                    <p className="text-xs text-zinc-400">Total Population in Millions (2015-2024)</p>
                  </div>
                  <DataSourceBadge entityId={entity.id} indicatorId="SP.POP.TOTL" />
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={popSeries}>
                      <defs>
                        <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
                      <YAxis stroke="#71717a" fontSize={11} tickFormatter={v => `${v}M`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', color: '#f4f4f5' }}
                        formatter={(val: any) => [`${Number(val).toFixed(2)} Million`, 'Population']}
                      />
                      <Area type="monotone" dataKey="population" stroke="#10b981" strokeWidth={2.5} fill="url(#popGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLIMATE & ECOLOGY */}
        {activeTab === 'climate' && (
          <ClimateEcologySection entityId={entity.id} countryName={entity.name} />
        )}

        {/* TAB 3: ECONOMY & TRADE */}
        {activeTab === 'economy' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
                <span className="text-xs text-zinc-500 font-medium">Real GDP Growth</span>
                <div className="text-xl font-bold font-mono text-emerald-400">+{gdpGrowth || 0}%</div>
                <DataSourceBadge entityId={entity.id} indicatorId="NY.GDP.MKTP.KD.ZG" />
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
                <span className="text-xs text-zinc-500 font-medium">Annual Inflation (CPI)</span>
                <div className="text-xl font-bold font-mono text-amber-400">{formatPercentage(inflation)}</div>
                <DataSourceBadge entityId={entity.id} indicatorId="FP.CPI.TOTL.ZG" />
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
                <span className="text-xs text-zinc-500 font-medium">General Govt Debt / GDP</span>
                <div className="text-xl font-bold font-mono text-rose-400">{formatPercentage(debtGdp)}</div>
                <DataSourceBadge entityId={entity.id} indicatorId="GC.DOD.TOTL.GD.ZS" />
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
                <span className="text-xs text-zinc-500 font-medium">Trade Openness (% GDP)</span>
                <div className="text-xl font-bold font-mono text-cyan-400">
                  {formatPercentage(atlas.getIndicatorValue(entity.id, 'NE.TRD.GNFS.ZS'))}
                </div>
                <DataSourceBadge entityId={entity.id} indicatorId="NE.TRD.GNFS.ZS" />
              </div>
            </div>

            {/* Macroeconomic Detail Chart */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-cyan-400" /> Multi-Year Real GDP Growth Rate (%)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gdpSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
                    <YAxis stroke="#71717a" fontSize={11} tickFormatter={v => `${v}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', color: '#f4f4f5' }}
                      formatter={(val: any) => [`${Number(val).toFixed(2)}%`, 'Real GDP Growth']}
                    />
                    <Bar dataKey="growth" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEMOGRAPHICS */}
        {activeTab === 'demographics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
              <span className="text-xs text-zinc-500 font-medium">Fertility Rate</span>
              <div className="text-2xl font-bold font-mono text-indigo-400">
                {(atlas.getIndicatorValue(entity.id, 'SP.DYN.TFRT.IN') || 4.2).toFixed(2)}
              </div>
              <p className="text-xs text-zinc-400">Births per woman (UN Population Division)</p>
              <DataSourceBadge entityId={entity.id} indicatorId="SP.DYN.TFRT.IN" />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
              <span className="text-xs text-zinc-500 font-medium">Urban Population Share</span>
              <div className="text-2xl font-bold font-mono text-cyan-400">
                {formatPercentage(atlas.getIndicatorValue(entity.id, 'SP.URB.TOTL.IN.ZS'))}
              </div>
              <p className="text-xs text-zinc-400">Metropolitan and urban agglomerations</p>
              <DataSourceBadge entityId={entity.id} indicatorId="SP.URB.TOTL.IN.ZS" />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
              <span className="text-xs text-zinc-500 font-medium">Net Migration Rate</span>
              <div className="text-2xl font-bold font-mono text-zinc-200">
                {(atlas.getIndicatorValue(entity.id, 'SM.POP.NETM') || -0.8).toFixed(1)} / 1k
              </div>
              <p className="text-xs text-zinc-400">Annual net migrants per 1,000 population</p>
            </div>
          </div>
        )}

        {/* TAB 4: HEALTH & EDUCATION */}
        {activeTab === 'health_edu' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
              <span className="text-xs text-zinc-500 font-medium">Life Expectancy at Birth</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {(life || 63).toFixed(1)} Years
              </div>
              <p className="text-xs text-zinc-400">WHO & UN DESA 2024 Estimates</p>
              <DataSourceBadge entityId={entity.id} indicatorId="SP.DYN.LE00.IN" />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
              <span className="text-xs text-zinc-500 font-medium">Adult Literacy Rate</span>
              <div className="text-2xl font-bold font-mono text-cyan-400">
                {formatPercentage(literacy)}
              </div>
              <p className="text-xs text-zinc-400">Population aged 15 and above (UNESCO UIS)</p>
              <DataSourceBadge entityId={entity.id} indicatorId="SE.ADT.LITR.ZS" />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
              <span className="text-xs text-zinc-500 font-medium">Infant Mortality Rate</span>
              <div className="text-2xl font-bold font-mono text-rose-400">
                {(atlas.getIndicatorValue(entity.id, 'SP.DYN.IMRT.IN') || 38.5).toFixed(1)}
              </div>
              <p className="text-xs text-zinc-400">Deaths per 1,000 live births</p>
              <DataSourceBadge entityId={entity.id} indicatorId="SP.DYN.IMRT.IN" />
            </div>
          </div>
        )}

        {/* TAB 5: INFRASTRUCTURE & TECH */}
        {activeTab === 'infrastructure' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
              <span className="text-xs text-zinc-500 font-medium">Electricity Access Rate</span>
              <div className="text-2xl font-bold font-mono text-yellow-400">
                {formatPercentage(electricity)}
              </div>
              <p className="text-xs text-zinc-400">Electrification across grid and mini-grid</p>
              <DataSourceBadge entityId={entity.id} indicatorId="EG.ELC.ACCS.ZS" />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
              <span className="text-xs text-zinc-500 font-medium">Renewable Energy Share</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {formatPercentage(atlas.getIndicatorValue(entity.id, 'EG.FEC.RNEW.ZS'))}
              </div>
              <p className="text-xs text-zinc-400">Hydro, solar, wind, and geothermal share</p>
              <DataSourceBadge entityId={entity.id} indicatorId="EG.FEC.RNEW.ZS" />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
              <span className="text-xs text-zinc-500 font-medium">Mobile Subscriptions</span>
              <div className="text-2xl font-bold font-mono text-cyan-400">
                {(atlas.getIndicatorValue(entity.id, 'IT.CEL.SETS.P2') || 98.4).toFixed(1)} / 100
              </div>
              <p className="text-xs text-zinc-400">Active cellular subscriptions per 100 people</p>
              <DataSourceBadge entityId={entity.id} indicatorId="IT.CEL.SETS.P2" />
            </div>
          </div>
        )}

        {/* TAB 6: GOVERNANCE & PEACE */}
        {activeTab === 'governance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 uppercase font-semibold">Ibrahim Index of African Governance (IIAG)</span>
                <DataSourceBadge entityId={entity.id} indicatorId="MO.IIAG.SCORE" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-purple-400">
                {ibrahimScore ? `${ibrahimScore.toFixed(1)} / 100` : 'Data Pending'}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Evaluates Security & Rule of Law, Participation, Rights & Inclusion, Economic Opportunity, and Human Development.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 uppercase font-semibold">Global Peace Index (GPI)</span>
                <DataSourceBadge entityId={entity.id} indicatorId="IEP.GPI.SCORE" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-rose-400">
                {peaceIndex ? `${peaceIndex.toFixed(2)} (1-5)` : 'Data Pending'}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Measures societal safety and security, ongoing domestic and international conflict, and militarization levels.
              </p>
            </div>
          </div>
        )}

        {/* TAB 7: UNESCO HERITAGE */}
        {activeTab === 'heritage' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-amber-400" /> UNESCO World Heritage Sites in {entity.name}
                </h3>
                <p className="text-xs text-zinc-400">Properties of outstanding universal cultural and natural value</p>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2.5 py-1 rounded-lg">
                {heritageSites.length} Inscribed Sites
              </span>
            </div>

            {heritageSites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heritageSites.map(site => (
                  <div key={site.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3 hover:border-amber-800/40 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-zinc-100">{site.name}</h4>
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${
                        site.category === 'Cultural' ? 'bg-amber-950 text-amber-300 border-amber-800/50' :
                        site.category === 'Natural' ? 'bg-emerald-950 text-emerald-300 border-emerald-800/50' :
                        'bg-cyan-950 text-cyan-300 border-cyan-800/50'
                      }`}>
                        {site.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{site.description}</p>
                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono">
                      <span>Inscribed: <strong>{site.inscribedYear}</strong></span>
                      <span>Location: {site.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/40 text-zinc-500">
                <Landmark className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-400" />
                <p className="text-sm">No UNESCO World Heritage sites formally inscribed for this territory.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: SUBNATIONAL UNITS */}
        {activeTab === 'subnational' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" /> First-Level Administrative Units
                </h3>
                <p className="text-xs text-zinc-400">Provinces, regions, and federal states in {entity.name}</p>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-lg">
                {subnationalUnits.length} Primary Divisions
              </span>
            </div>

            {subnationalUnits.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 bg-zinc-950/80 font-mono text-zinc-400">
                    <tr>
                      <th className="py-3 px-4">Division Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Capital / Center</th>
                      <th className="py-3 px-4">Population</th>
                      <th className="py-3 px-4">Area</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {subnationalUnits.map(unit => (
                      <tr key={unit.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-zinc-200">{unit.name}</td>
                        <td className="py-3 px-4 text-zinc-400">{unit.type}</td>
                        <td className="py-3 px-4 text-zinc-300">{unit.capital}</td>
                        <td className="py-3 px-4 font-mono text-emerald-400">{formatPopulation(unit.population)}</td>
                        <td className="py-3 px-4 font-mono text-zinc-400">{formatArea(unit.areaKm2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/40 text-zinc-500">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                <p className="text-sm">Administrative division tables are cataloged under national statistical office indices.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: PROVENANCE & OFFICIAL LINKS */}
        {activeTab === 'provenance' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
                <ExternalLink className="w-4 h-4 text-emerald-400" /> Official Institutional Portals
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <a
                  href={media.worldBankProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 transition-colors group"
                >
                  <span>World Bank Country Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
                </a>
                <a
                  href={media.imfProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 transition-colors group"
                >
                  <span>IMF Article IV & WEO</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
                </a>
                <a
                  href={media.unProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 transition-colors group"
                >
                  <span>UN Data Country Table</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
                </a>
                <a
                  href={media.africanUnionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 transition-colors group"
                >
                  <span>African Union Member State</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
                </a>
                <a
                  href={media.wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 transition-colors group"
                >
                  <span>Wikipedia Encyclopedia</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
                </a>
                <a
                  href={media.wikidataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 transition-colors group"
                >
                  <span>Wikidata Semantic Entity</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
