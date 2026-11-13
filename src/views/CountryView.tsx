import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SPRING_TACTILE, AnimatedTabPanel } from '../utils/motion';
import { atlas } from '../data/atlas-store';
import { CountryFlag } from '../components/CountryFlag';
import { CountrySilhouette } from '../components/CountrySilhouette';
import { CountryHeaderInfo } from '../components/CountryHeaderInfo';
import { ClimateEcologySection } from '../components/ClimateEcologySection';
import { MicroSparkline } from '../components/common/MicroSparkline';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { getRegionCalmColor, getCountryRegionTonalPalette } from '../data/unGeoschemeColors';
import { useTranslation } from '../i18n/LanguageContext';
import { useSavedEntities } from '../contexts/SavedEntitiesContext';
import { SAFE_EXTERNAL_LINK_PROPS } from '../data/externalLinksRegistry';
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
  Layers, 
  Award, 
  AlertTriangle,
  Sparkles,
  BookOpen,
  Trees,
  Star,
  FileText,
  FileDown,
  Pickaxe,
  BatteryCharging,
  ArrowUpRight,
  Volume2,
  ArrowLeft
} from 'lucide-react';
import { CountryFactsheetModal } from '../components/CountryFactsheetModal';
import { getCountryMineralsProfile, getCountryTradeFlows } from '../data/criticalMineralsData';
import { 
  exportCountryIntelligenceBriefingPDF,
  exportCountryDossierBibTeX,
  exportCountryDossierRIS
} from '../utils/academicExport';
import { speakAcademicNarration, stopAfriataSpeech } from '../utils/afriataVoiceEngine';
import { getCountryHeaderData } from '../data/countryHeaderData';

interface CountryViewProps {
  entityId: string;
  onSelectCountry: (entityId: string) => void;
  onSelectIndicator?: (indicatorId: string) => void;
}

type TabType = 'overview' | 'climate' | 'economy' | 'demographics' | 'health_edu' | 'infrastructure' | 'governance' | 'heritage' | 'subnational' | 'provenance';
type PrimaryGroup = 'overview' | 'economy-infra' | 'people-society' | 'territory-heritage' | 'provenance';

const TAB_TO_GROUP: Record<TabType, PrimaryGroup> = {
  overview: 'overview',
  economy: 'economy-infra',
  infrastructure: 'economy-infra',
  demographics: 'people-society',
  health_edu: 'people-society',
  governance: 'people-society',
  climate: 'territory-heritage',
  subnational: 'territory-heritage',
  heritage: 'territory-heritage',
  provenance: 'provenance',
};

const GROUP_SUBTABS: Record<PrimaryGroup, TabType[]> = {
  overview: ['overview'],
  'economy-infra': ['economy', 'infrastructure'],
  'people-society': ['demographics', 'health_edu', 'governance'],
  'territory-heritage': ['climate', 'subnational', 'heritage'],
  provenance: ['provenance'],
};

const handleTabListKeyDown = (
  e: React.KeyboardEvent<HTMLButtonElement>,
  ids: string[],
  currentIndex: number,
  onSelect: (id: string) => void
) => {
  if (ids.length === 0) return;
  let nextIndex = -1;
  if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % ids.length;
  else if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + ids.length) % ids.length;
  else if (e.key === 'Home') nextIndex = 0;
  else if (e.key === 'End') nextIndex = ids.length - 1;

  if (nextIndex !== -1) {
    e.preventDefault();
    const nextId = ids[nextIndex];
    onSelect(nextId);
    const nextEl = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex];
    nextEl?.focus();
  }
};

export const CountryView: React.FC<CountryViewProps> = ({
  entityId,
  onSelectCountry
}) => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const { isCountrySaved, toggleSaveCountry } = useSavedEntities();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [lastTabByGroup, setLastTabByGroup] = useState<Record<PrimaryGroup, TabType>>({
    overview: 'overview',
    'economy-infra': 'economy',
    'people-society': 'demographics',
    'territory-heritage': 'climate',
    provenance: 'provenance',
  });
  const [showFactsheet, setShowFactsheet] = useState<boolean>(false);
  const [isSpeakingName, setIsSpeakingName] = useState<boolean>(false);
  
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

  // Critical Energy Transition Minerals Profile
  const mineralsProfile = useMemo(() => {
    return getCountryMineralsProfile(entity.id, entity.name);
  }, [entity.id, entity.name]);

  // Bilateral & Regional Trade Flow Profile
  const tradeProfile = useMemo(() => {
    return getCountryTradeFlows(entity.id, entity.name);
  }, [entity.id, entity.name]);

  const activeGroup = TAB_TO_GROUP[activeTab];

  const selectTab = (tab: TabType) => {
    const group = TAB_TO_GROUP[tab];
    setActiveTab(tab);
    setLastTabByGroup((prev) => ({ ...prev, [group]: tab }));
  };

  const selectGroup = (group: PrimaryGroup) => {
    const preferred = lastTabByGroup[group] || GROUP_SUBTABS[group][0];
    setActiveTab(preferred);
  };

  const primaryGroups: { id: PrimaryGroup; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: t('tab.overview', 'Overview'), icon: <Globe className="w-4 h-4" /> },
    { id: 'economy-infra', label: 'Economy & Infra', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'people-society', label: 'People & Policy', icon: <Users className="w-4 h-4" /> },
    { id: 'territory-heritage', label: 'Climate & Territory', icon: <Trees className="w-4 h-4 text-emerald-500" /> },
    { id: 'provenance', label: t('tab.provenance', 'Provenance'), icon: <BookOpen className="w-4 h-4" /> },
  ];

  const subTabMeta: Record<TabType, { label: string; icon: React.ReactNode }> = {
    overview: { label: t('tab.overview', 'Overview & Facts'), icon: <Globe className="w-3.5 h-3.5" /> },
    economy: { label: t('tab.economy', 'Economy & Trade'), icon: <DollarSign className="w-3.5 h-3.5" /> },
    infrastructure: { label: t('tab.infrastructure', 'Infrastructure & Tech'), icon: <Zap className="w-3.5 h-3.5" /> },
    demographics: { label: t('tab.demographics', 'Demographics'), icon: <Users className="w-3.5 h-3.5" /> },
    health_edu: { label: t('tab.health_edu', 'Health & Education'), icon: <HeartHandshake className="w-3.5 h-3.5" /> },
    governance: { label: t('tab.governance', 'Governance & Peace'), icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    climate: { label: t('tab.climate', 'Climate & Ecology'), icon: <Trees className="w-3.5 h-3.5 text-emerald-500" /> },
    subnational: { label: `${t('tab.subnational', 'Regions')} (${subnationalUnits.length})`, icon: <Layers className="w-3.5 h-3.5" /> },
    heritage: { label: `${t('tab.heritage', 'UNESCO Heritage')} (${heritageSites.length})`, icon: <Landmark className="w-3.5 h-3.5" /> },
    provenance: { label: t('tab.provenance', 'Provenance & Sources'), icon: <BookOpen className="w-3.5 h-3.5" /> },
  };

  const activeGroupSubTabs = GROUP_SUBTABS[activeGroup];
  const regionPalette = getCountryRegionTonalPalette(entity.id);
  const countryCalmBg = getRegionCalmColor(entity.region);

  const handleSpeakCountry = () => {
    if (isSpeakingName) {
      stopAfriataSpeech();
      setIsSpeakingName(false);
    } else {
      const headerMeta = getCountryHeaderData(entity.id);
      const speechText = `${entity.name}. Capital city: ${headerMeta.capital || entity.capital}. Located in ${entity.region}.`;
      speakAcademicNarration({
        text: speechText,
        onStart: () => setIsSpeakingName(true),
        onEnd: () => setIsSpeakingName(false),
        onError: () => setIsSpeakingName(false)
      });
    }
  };

  return (
    <section aria-label={`${entity.name} Sovereign Country Dossier and Demographic Observatory`} className="space-y-6 animate-in fade-in duration-200">
      {/* Compact Sticky Country Bar on Deep-Dive Tabs */}
      {activeGroup !== 'overview' ? (
        <header
          id="country-compact-header-bar"
          className="relative md:sticky md:top-16 z-20 rounded-2xl border px-4 py-3 shadow-xs backdrop-blur-md transition-colors"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            borderColor: regionPalette.atlasBorder,
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <CountryFlag entityId={entity.id} size="sm" className="shadow-xs shrink-0" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base md:text-lg font-extrabold text-zinc-900 font-display truncate">
                    {entity.name}
                  </h1>
                  <button
                    type="button"
                    onClick={handleSpeakCountry}
                    className={`p-1 rounded-lg border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isSpeakingName
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-white border-zinc-200 text-zinc-500 hover:text-emerald-600'
                    }`}
                    title={isSpeakingName ? 'Stop pronunciation' : 'Listen to country name and capital pronunciation'}
                    aria-label={`Pronounce ${entity.name}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSaveCountry(entity.id)}
                    className={`p-1 rounded-lg border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isSaved
                        ? 'bg-amber-50 border-amber-300 text-amber-500'
                        : 'bg-white border-zinc-200 text-zinc-400 hover:text-amber-500'
                    }`}
                    title={isSaved ? 'Remove from Saved Countries' : 'Save Country to Quick Access'}
                    aria-label={isSaved ? `Remove ${entity.name} from saved countries` : `Save ${entity.name} to quick access`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>
                </div>
                <p className="text-[11px] text-zinc-600 font-mono tabular-nums truncate">
                  {entity.id} / {entity.iso2} · {entity.region} · Pop {formatPopulation(pop)} · GDP {formatGDP(gdp)} · HDI {formatHDI(hdi)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {qualityFlags.length > 0 && activeTab !== 'provenance' && (
                <button
                  type="button"
                  onClick={() => selectTab('provenance')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 text-[11px] font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Audit Note</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowFactsheet(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 hover:border-emerald-300 text-zinc-700 hover:text-emerald-700 text-[11px] font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                title="Export 1-Page Executive Factsheet Brief"
              >
                <FileText className="w-3 h-3 text-emerald-600" />
                <span>Factsheet</span>
              </button>
              <button
                type="button"
                onClick={() => exportCountryIntelligenceBriefingPDF(entity)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 text-[11px] font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                title="Download 2-Page Intelligence Dossier (PDF)"
              >
                <FileText className="w-3 h-3 text-purple-600" />
                <span>PDF</span>
              </button>
              <button
                type="button"
                onClick={() => exportCountryDossierBibTeX(entity)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-amber-700 text-[11px] font-mono font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                title="Download BibTeX citation (.bib)"
              >
                .bib
              </button>
              <button
                type="button"
                onClick={() => exportCountryDossierRIS(entity)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-purple-700 text-[11px] font-mono font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                title="Download RIS reference (.ris)"
              >
                .ris
              </button>
              <button
                type="button"
                onClick={() => selectTab('overview')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-[11px] font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Overview</span>
              </button>
            </div>
          </div>
        </header>
      ) : (
        /* Top Country Dossier Header Card with Pure Regional Tonal Directional Gradient */
        <header 
          id="country-dossier-header-card"
          className="relative rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${regionPalette.gradientStart} 0%, ${regionPalette.gradientMid} 48%, ${regionPalette.gradientEnd} 100%)`,
            borderColor: regionPalette.atlasBorder,
            borderWidth: '1px'
          }}
        >
          {/* Subtle Ambient Regional Radial Glow in top-left */}
          <div 
            className="pointer-events-none absolute -top-28 -left-28 w-96 h-96 rounded-full blur-3xl opacity-30"
            style={{ background: regionPalette.ambientAura }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            {/* Left Side: Country Identity & Key Metrics Capsule */}
            <div className="flex-1 space-y-5">
              {/* Country Identity Block */}
              <div className="flex items-start gap-5">
                <CountryFlag entityId={entity.id} size="xl" className="shadow-md mt-1" />
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 font-display">
                      {entity.name}
                    </h1>
                    <button
                      type="button"
                      onClick={handleSpeakCountry}
                      className={`p-1.5 rounded-xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                        isSpeakingName
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                          : 'bg-white/90 border-zinc-200 text-zinc-500 hover:text-emerald-600 hover:border-emerald-300'
                      }`}
                      title={isSpeakingName ? 'Stop pronunciation' : 'Listen to country name and capital pronunciation'}
                      aria-label={`Pronounce ${entity.name}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSaveCountry(entity.id)}
                      className={`p-1.5 rounded-xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                        isSaved
                          ? 'bg-amber-50 border-amber-300 text-amber-500 shadow-xs'
                          : 'bg-white/90 border-zinc-200 text-zinc-400 hover:text-amber-500'
                      }`}
                      title={isSaved ? 'Remove from Saved Countries' : 'Save Country to Quick Access'}
                      aria-label={isSaved ? `Remove ${entity.name} from saved countries` : `Save ${entity.name} to quick access`}
                    >
                      <Star className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowFactsheet(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/95 border border-zinc-200/90 hover:border-emerald-300 text-zinc-700 hover:text-emerald-700 text-xs font-semibold shadow-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      title="Export 1-Page Executive Factsheet Brief (Printable PDF / SVG / HTML)"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>1-Page Factsheet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => exportCountryIntelligenceBriefingPDF(entity, { headerElementId: 'country-dossier-header-card' })}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold shadow-xs transition-all cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      title="Download Publication-Grade 2-Page Intelligence Dossier (PDF)"
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>2-Page Dossier (PDF)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => exportCountryDossierBibTeX(entity)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/95 border border-zinc-200/90 text-zinc-700 hover:text-amber-700 text-xs font-mono font-semibold shadow-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      title="Download BibTeX citation (.bib) for this sovereign country dossier"
                    >
                      <FileDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>.bib</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => exportCountryDossierRIS(entity)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/95 border border-zinc-200/90 text-zinc-700 hover:text-purple-700 text-xs font-mono font-semibold shadow-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      title="Download RIS reference (.ris) for Zotero and EndNote"
                    >
                      <FileDown className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>.ris</span>
                    </button>
                  </div>

                  <p className="text-xs md:text-sm text-zinc-700 font-medium">
                    {entity.officialName}
                  </p>

                  {/* Unboxed Typographic Identity & Bloc Metadata */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5 text-xs text-zinc-600">
                    <span className="font-mono font-semibold text-zinc-800">{entity.id} / {entity.iso2}</span>
                    <span aria-hidden="true">·</span>
                    <span className={`font-semibold ${entity.sovereign ? 'text-emerald-800' : 'text-indigo-800'}`}>
                      {entity.sovereign ? 'Sovereign AU Member' : 'Autonomous Territory'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className={`font-semibold ${regionPalette.badge.text}`}>{entity.region}</span>
                    {entity.blocs.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[11px] text-zinc-700">
                          {entity.blocs.join(' · ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Core Metrics Capsule - Elevated Crisp White Tile */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/95 border border-zinc-200/90 p-3.5 rounded-2xl shadow-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">Population</span>
                    {atlas.getObservations(entity.id, 'SP.POP.TOTL').length > 1 && (
                      <MicroSparkline 
                        data={atlas.getObservations(entity.id, 'SP.POP.TOTL').map(o => o.value)} 
                        width={44} 
                        height={14} 
                        color="#059669" 
                      />
                    )}
                  </div>
                  <div className="font-mono font-bold text-sm text-zinc-900 tabular-nums">{formatPopulation(pop)}</div>
                  <DataSourceBadge entityId={entity.id} indicatorId="SP.POP.TOTL" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">Nominal GDP</span>
                    {atlas.getObservations(entity.id, 'NY.GDP.MKTP.CD').length > 1 && (
                      <MicroSparkline 
                        data={atlas.getObservations(entity.id, 'NY.GDP.MKTP.CD').map(o => o.value)} 
                        width={44} 
                        height={14} 
                        color="#0284c7" 
                      />
                    )}
                  </div>
                  <div className="font-mono font-bold text-sm text-cyan-700 tabular-nums">{formatGDP(gdp)}</div>
                  <DataSourceBadge entityId={entity.id} indicatorId="NY.GDP.MKTP.CD" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">GDP Per Capita</span>
                  <div className="font-mono font-bold text-sm text-emerald-700 tabular-nums">{formatCurrency(gdpPerCapita)}</div>
                  <span className="text-[10px] text-zinc-500 font-mono">Calculated</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">Human Dev. (HDI)</span>
                  <div className="font-mono font-bold text-sm text-amber-700 tabular-nums">{formatHDI(hdi)}</div>
                  <span className="text-[11px] font-sans font-semibold text-zinc-600">
                    {hdiCat.label.split(' ')[0]} Development
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
          <div className="pt-4 border-t border-zinc-200/80">
            <CountryHeaderInfo entityId={entity.id} />
          </div>

          {/* Quality Alerts Banner if applicable */}
          {qualityFlags.length > 0 && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/90 p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Data Reconciliation Note:</strong> {qualityFlags[0].description}
                </span>
              </div>
              <button
                type="button"
                onClick={() => selectTab('provenance')}
                className="text-amber-800 hover:text-amber-900 font-semibold underline underline-offset-2 flex-shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                View Provenance Audit →
              </button>
            </div>
          )}
        </header>
      )}

      {/* Primary Consolidated 5-Section WAI-ARIA Tablist */}
      <div className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div
          className="flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Country dossier primary sections"
        >
          {primaryGroups.map((group, idx) => {
            const isActive = activeGroup === group.id;
            return (
              <button
                key={group.id}
                type="button"
                id={`country-group-tab-${group.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`country-group-panel-${group.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectGroup(group.id)}
                onKeyDown={(e) =>
                  handleTabListKeyDown(
                    e,
                    primaryGroups.map((g) => g.id),
                    idx,
                    (id) => selectGroup(id as PrimaryGroup)
                  )
                }
                style={!isActive ? { backgroundColor: countryCalmBg } : undefined}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap cursor-pointer select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? 'text-white dark:text-zinc-950 font-bold shadow-xs'
                    : 'border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:opacity-90'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="countryDossierTabPill"
                    className="absolute inset-0 rounded-xl bg-emerald-600 dark:bg-zinc-100 shadow-xs"
                    transition={prefersReducedMotion ? { duration: 0 } : SPRING_TACTILE}
                  />
                )}
                <span className="relative z-10">{group.icon}</span>
                <span className="relative z-10">{group.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contextual In-Panel Sub-Switcher for multi-view groups */}
        {activeGroupSubTabs.length > 1 && (
          <div
            role="tablist"
            aria-label="Section sub-views"
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800"
          >
            {activeGroupSubTabs.map((subId, idx) => {
              const isSelected = activeTab === subId;
              const meta = subTabMeta[subId];
              return (
                <button
                  key={subId}
                  type="button"
                  id={`country-subtab-${subId}`}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`country-subpanel-${subId}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => selectTab(subId)}
                  onKeyDown={(e) =>
                    handleTabListKeyDown(
                      e,
                      activeGroupSubTabs,
                      idx,
                      (id) => selectTab(id as TabType)
                    )
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {meta.icon}
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tab Content Container with WAI-ARIA Tabpanel Role */}
      <div
        id={`country-group-panel-${activeGroup}`}
        role="tabpanel"
        aria-labelledby={`country-group-tab-${activeGroup}`}
      >
        <div
          id={`country-subpanel-${activeTab}`}
          role={activeGroupSubTabs.length > 1 ? 'tabpanel' : undefined}
          aria-labelledby={activeGroupSubTabs.length > 1 ? `country-subtab-${activeTab}` : undefined}
        >
      <AnimatedTabPanel tabKey={activeTab} className="space-y-6">
        {/* TAB 1: OVERVIEW & KEY FACTS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: General Facts Card */}
            <div className="lg:col-span-6 space-y-6">
              {/* Why This Nation Matters: Executive Strategic Insight */}
              <div 
                className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 space-y-3 shadow-xs transition-colors"
                style={{ backgroundColor: countryCalmBg }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Macroeconomic & Regional Role
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Harmonized 2024</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-display">
                  Why {entity.name} Matters in Pan-African Growth
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  As a leading constituent of {entity.region}, {entity.name} accounts for an estimated {formatPopulation(pop)} population and {formatGDP(gdp)} in economic output. With membership in {entity.blocs.join(', ')}, the nation plays a central role in regional trade corridors, infrastructure harmonization, and continental workforce dynamics.
                </p>
                <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-700 dark:text-zinc-300 tabular-nums">
                  <span>Capita: <strong className="text-zinc-900 dark:text-zinc-100">{formatCurrency(gdpPerCapita)}</strong></span>
                  <span aria-hidden="true" className="text-zinc-400">·</span>
                  <span>HDI: <strong className="text-zinc-900 dark:text-zinc-100">{formatHDI(hdi)} ({hdiCat.label.split(' ')[0]})</strong></span>
                  <span aria-hidden="true" className="text-zinc-400">·</span>
                  <span>Grid: <strong className="text-zinc-900 dark:text-zinc-100">{formatPercentage(electricity)}</strong></span>
                </div>
              </div>

              {/* Climate Teaser Banner in Overview */}
              <button
                type="button"
                onClick={() => selectTab('climate')}
                className="w-full text-left rounded-2xl border border-emerald-200 bg-white/95 p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-emerald-300 shadow-xs transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 group-hover:scale-105 transition-transform">
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                      {t('tab.climate', 'Climate & Ecology Profile')}
                    </h4>
                    <p className="text-xs text-zinc-600">
                      12-Month Cycles, Live Weather, Vulnerability Matrix &amp; Resilience
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-mono shrink-0">
                  Explore →
                </span>
              </button>

              <div 
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 space-y-4 shadow-xs transition-colors"
                style={{ backgroundColor: countryCalmBg }}
              >
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-200/60 dark:border-zinc-800 pb-3">
                  <Globe className="w-4 h-4 text-emerald-500" /> Geographic & National Profile
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 font-medium">Capital City</span>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">{entity.capital}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Land Area</span>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">{formatArea(entity.landAreaKm2)}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Currency</span>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">
                      {entity.currency.name} ({entity.currency.code}, {entity.currency.symbol})
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Income Classification</span>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">
                      {entity.incomeLevel} • {entity.geographicType}
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Official Languages</span>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">
                      {entity.languages.official.join(', ')}
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Government Form</span>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">{entity.governmentType}</div>
                  </div>
                </div>

                {/* Bordering Nations */}
                <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500 font-medium">Land Borders ({(entity.borders || []).length}):</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {entity.borders && entity.borders.length > 0 ? (
                      entity.borders.map(borderId => {
                        const borderEntity = atlas.getEntity(borderId);
                        return (
                          <button
                            key={borderId}
                            onClick={() => onSelectCountry(borderId)}
                            className="flex items-center gap-1.5 bg-white/80 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs px-2.5 py-1 rounded-lg border border-zinc-200/80 dark:border-zinc-700 transition-colors cursor-pointer shadow-xs"
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
              <div 
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 space-y-4 shadow-xs transition-colors"
                style={{ backgroundColor: countryCalmBg }}
              >
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-200/60 dark:border-zinc-800 pb-3">
                  <Award className="w-4 h-4 text-amber-500" /> Strategic Commodities & Exports
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-zinc-500">Key Export Commodities</span>
                    <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                      {Array.isArray(entity.facts.majorExports)
                        ? entity.facts.majorExports.join(' · ')
                        : 'Petroleum · Mineral ores · Agricultural produce'}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-xs text-zinc-500">Major Trading Partners</span>
                    <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">
                      {Array.isArray(entity.facts.majorTradingPartners)
                        ? entity.facts.majorTradingPartners.join(' · ')
                        : 'African Union · EU · Global Partners'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: GDP Trajectory Preview Chart */}
            <div className="lg:col-span-6 space-y-6">
              <div 
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 space-y-4 shadow-xs transition-colors"
                style={{ backgroundColor: countryCalmBg }}
              >
                <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-500" /> Gross Domestic Product Trajectory
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Nominal GDP in USD Billions (2015-2024)</p>
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
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:stroke-zinc-800" />
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
              <div 
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 space-y-4 shadow-xs transition-colors"
                style={{ backgroundColor: countryCalmBg }}
              >
                <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-500" /> Population Expansion
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Population in Millions (2015-2024)</p>
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
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:stroke-zinc-800" />
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
              <div 
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 space-y-1 shadow-xs transition-colors"
                style={{ backgroundColor: countryCalmBg }}
              >
                <span className="text-xs text-zinc-500 font-medium">Real GDP Growth</span>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">+{gdpGrowth || 0}%</div>
                <DataSourceBadge entityId={entity.id} indicatorId="NY.GDP.MKTP.KD.ZG" />
              </div>
              <div 
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 space-y-1 shadow-xs transition-colors"
                style={{ backgroundColor: countryCalmBg }}
              >
                <span className="text-xs text-zinc-500 font-medium">Annual Inflation (CPI)</span>
                <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">{formatPercentage(inflation)}</div>
                <DataSourceBadge entityId={entity.id} indicatorId="FP.CPI.TOTL.ZG" />
              </div>
              <div 
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 space-y-1 shadow-xs transition-colors"
                style={{ backgroundColor: countryCalmBg }}
              >
                <span className="text-xs text-zinc-500 font-medium">General Govt Debt / GDP</span>
                <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">{formatPercentage(debtGdp)}</div>
                <DataSourceBadge entityId={entity.id} indicatorId="GC.DOD.TOTL.GD.ZS" />
              </div>
              <div 
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 space-y-1 shadow-xs transition-colors"
                style={{ backgroundColor: countryCalmBg }}
              >
                <span className="text-xs text-zinc-500 font-medium">Trade Openness (% GDP)</span>
                <div className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
                  {formatPercentage(atlas.getIndicatorValue(entity.id, 'NE.TRD.GNFS.ZS'))}
                </div>
                <DataSourceBadge entityId={entity.id} indicatorId="NE.TRD.GNFS.ZS" />
              </div>
            </div>

            {/* Macroeconomic Detail Chart */}
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 space-y-4 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-cyan-500" /> Multi-Year Real GDP Growth Rate (%)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gdpSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:stroke-zinc-800" />
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

            {/* Critical Energy Transition Minerals Card */}
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 space-y-5 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400">
                    <Pickaxe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      Critical Energy Transition Minerals &amp; Geological Assets
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Geological reserves, global production rank, and clean technology value addition
                    </p>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  IEA &amp; USGS Mineral Survey
                </div>
              </div>

              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                {mineralsProfile.summary}
              </p>

              {/* Minerals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {mineralsProfile.keyMinerals.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800/80 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-black flex items-center justify-center">
                          {item.chemicalSymbol}
                        </span>
                        <div>
                          <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                            {item.mineral}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-medium">
                            {item.category}
                          </div>
                        </div>
                      </div>

                      {item.globalSharePct && (
                        <div className="text-right">
                          <span className="font-mono font-extrabold text-sm text-emerald-700 dark:text-emerald-400">
                            {item.globalSharePct}%
                          </span>
                          <span className="text-[9.5px] block font-mono text-zinc-400">
                            Global Share
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      <span className="text-zinc-500 font-medium">Application: </span>
                      {item.strategicApplication}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50 text-[10.5px]">
                      <span className="text-zinc-500 font-medium">
                        Mining Basin: <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">{item.primaryLocations.join(', ')}</strong>
                      </span>
                      <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400 font-semibold">
                        {item.refiningStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Strategic Ambition Callout */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                  <BatteryCharging className="w-3.5 h-3.5" />
                  <span>Domestic Beneficiation &amp; Value Addition Strategy</span>
                </div>
                <p className="leading-relaxed text-[11.5px] opacity-90">
                  {mineralsProfile.refiningAmbition}
                </p>
              </div>
            </div>

            {/* Bilateral Trade Flow & Destination Distribution Card */}
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 space-y-5 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      Trade Destination Distribution &amp; AfCFTA Integration
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Export market shares and intra-continental economic exchange
                    </p>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  UN Comtrade &amp; Afreximbank
                </div>
              </div>

              {/* Visual Multi-Segment Distribution Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <span>Export Markets Distribution (%)</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    AfCFTA Intra-African Share: {tradeProfile.intraAfricanSharePct}%
                  </span>
                </div>
                <div className="h-4 w-full rounded-lg overflow-hidden flex shadow-2xs border border-zinc-200/60 dark:border-zinc-800">
                  {tradeProfile.flows.map((flow, idx) => (
                    <div 
                      key={idx}
                      style={{ width: `${flow.sharePct}%`, backgroundColor: flow.color }}
                      title={`${flow.destination}: ${flow.sharePct}%`}
                      className="h-full transition-all hover:opacity-85"
                    />
                  ))}
                </div>
              </div>

              {/* Trade Flow Legend Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {tradeProfile.flows.map((flow, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: flow.color }} />
                        <span className="truncate">{flow.destination}</span>
                      </div>
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                        {flow.sharePct}%
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate">
                      {flow.primaryGoods}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400">
                {tradeProfile.afcftaCorridorNote}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEMOGRAPHICS */}
        {activeTab === 'demographics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-2 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <span className="text-xs text-zinc-500 font-medium">Fertility Rate</span>
              <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {(atlas.getIndicatorValue(entity.id, 'SP.DYN.TFRT.IN') || 4.2).toFixed(2)}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Births per woman (UN Population Division)</p>
              <DataSourceBadge entityId={entity.id} indicatorId="SP.DYN.TFRT.IN" />
            </div>
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-2 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <span className="text-xs text-zinc-500 font-medium">Urban Population Share</span>
              <div className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
                {formatPercentage(atlas.getIndicatorValue(entity.id, 'SP.URB.TOTL.IN.ZS'))}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Metropolitan and urban agglomerations</p>
              <DataSourceBadge entityId={entity.id} indicatorId="SP.URB.TOTL.IN.ZS" />
            </div>
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-2 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <span className="text-xs text-zinc-500 font-medium">Net Migration Rate</span>
              <div className="text-2xl font-bold font-mono text-zinc-800 dark:text-zinc-200">
                {(atlas.getIndicatorValue(entity.id, 'SM.POP.NETM') || -0.8).toFixed(1)} / 1k
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Annual net migrants per 1,000 population</p>
            </div>
          </div>
        )}

        {/* TAB 4: HEALTH & EDUCATION */}
        {activeTab === 'health_edu' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-2 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <span className="text-xs text-zinc-500 font-medium">Life Expectancy at Birth</span>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {(life || 63).toFixed(1)} Years
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">WHO & UN DESA 2024 Estimates</p>
              <DataSourceBadge entityId={entity.id} indicatorId="SP.DYN.LE00.IN" />
            </div>
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-2 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <span className="text-xs text-zinc-500 font-medium">Adult Literacy Rate</span>
              <div className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
                {formatPercentage(literacy)}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Population aged 15 and above (UNESCO UIS)</p>
              <DataSourceBadge entityId={entity.id} indicatorId="SE.ADT.LITR.ZS" />
            </div>
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-2 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <span className="text-xs text-zinc-500 font-medium">Infant Mortality Rate</span>
              <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {(atlas.getIndicatorValue(entity.id, 'SP.DYN.IMRT.IN') || 38.5).toFixed(1)}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Deaths per 1,000 live births</p>
              <DataSourceBadge entityId={entity.id} indicatorId="SP.DYN.IMRT.IN" />
            </div>
          </div>
        )}

        {/* TAB 5: INFRASTRUCTURE & TECH */}
        {activeTab === 'infrastructure' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-2 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <span className="text-xs text-zinc-500 font-medium">Electricity Access Rate</span>
              <div className="text-2xl font-bold font-mono text-yellow-600 dark:text-yellow-400">
                {formatPercentage(electricity)}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Electrification across grid and mini-grid</p>
              <DataSourceBadge entityId={entity.id} indicatorId="EG.ELC.ACCS.ZS" />
            </div>
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-2 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <span className="text-xs text-zinc-500 font-medium">Renewable Energy Share</span>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {formatPercentage(atlas.getIndicatorValue(entity.id, 'EG.FEC.RNEW.ZS'))}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Hydro, solar, wind, and geothermal share</p>
              <DataSourceBadge entityId={entity.id} indicatorId="EG.FEC.RNEW.ZS" />
            </div>
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-2 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <span className="text-xs text-zinc-500 font-medium">Mobile Subscriptions</span>
              <div className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
                {(atlas.getIndicatorValue(entity.id, 'IT.CEL.SETS.P2') || 98.4).toFixed(1)} / 100
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Active cellular subscriptions per 100 people</p>
              <DataSourceBadge entityId={entity.id} indicatorId="IT.CEL.SETS.P2" />
            </div>
          </div>
        )}

        {/* TAB 6: GOVERNANCE & PEACE */}
        {activeTab === 'governance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 space-y-3 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-semibold">Ibrahim Index of African Governance (IIAG)</span>
                <DataSourceBadge entityId={entity.id} indicatorId="MO.IIAG.SCORE" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
                {ibrahimScore ? `${ibrahimScore.toFixed(1)} / 100` : 'Data Pending'}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Evaluates Security & Rule of Law, Participation, Rights & Inclusion, Economic Opportunity, and Human Development.
              </p>
            </div>

            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 space-y-3 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-semibold">Global Peace Index (GPI)</span>
                <DataSourceBadge entityId={entity.id} indicatorId="IEP.GPI.SCORE" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
                {peaceIndex ? `${peaceIndex.toFixed(2)} (1-5)` : 'Data Pending'}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Measures societal safety and security, ongoing domestic and international conflict, and militarization levels.
              </p>
            </div>
          </div>
        )}

        {/* TAB 7: UNESCO HERITAGE */}
        {activeTab === 'heritage' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-amber-500" /> UNESCO World Heritage Sites in {entity.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Properties of outstanding universal cultural and natural value</p>
              </div>
              <span className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400 tabular-nums shrink-0">
                {heritageSites.length} Inscribed Sites
              </span>
            </div>

            {heritageSites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heritageSites.map(site => (
                  <div 
                    key={site.id} 
                    className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-3 hover:border-amber-400/50 dark:hover:border-amber-800/40 transition-colors shadow-xs"
                    style={{ backgroundColor: countryCalmBg }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{site.name}</h4>
                      <span className={`text-[10px] uppercase font-bold tracking-wider shrink-0 ${
                        site.category === 'Cultural' ? 'text-amber-700 dark:text-amber-400' :
                        site.category === 'Natural' ? 'text-emerald-700 dark:text-emerald-400' :
                        'text-cyan-700 dark:text-cyan-400'
                      }`}>
                        {site.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{site.description}</p>
                    <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono">
                      <span>Inscribed: <strong>{site.inscribedYear}</strong></span>
                      <span>Location: {site.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                className="py-12 text-center rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500"
                style={{ backgroundColor: countryCalmBg }}
              >
                <Landmark className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-500" />
                <p className="text-sm">No UNESCO World Heritage sites formally inscribed for this territory.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: SUBNATIONAL UNITS */}
        {activeTab === 'subnational' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-500" /> First-Level Administrative Units
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Provinces, regions, and federal states in {entity.name}</p>
              </div>
              <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300 tabular-nums shrink-0">
                {subnationalUnits.length} Primary Divisions
              </span>
            </div>

            {subnationalUnits.length > 0 ? (
              <div 
                className="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs"
                style={{ backgroundColor: countryCalmBg }}
              >
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-200/80 dark:border-zinc-800 bg-black/5 dark:bg-zinc-950/80 font-mono text-zinc-600 dark:text-zinc-400">
                    <tr>
                      <th className="py-3 px-4">Division Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Capital / Center</th>
                      <th className="py-3 px-4">Population</th>
                      <th className="py-3 px-4">Area</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
                    {subnationalUnits.map(unit => (
                      <tr key={unit.id} className="hover:bg-black/5 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-zinc-800 dark:text-zinc-200">{unit.name}</td>
                        <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{unit.type}</td>
                        <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">{unit.capital}</td>
                        <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400">{formatPopulation(unit.population)}</td>
                        <td className="py-3 px-4 font-mono text-zinc-600 dark:text-zinc-400">{formatArea(unit.areaKm2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div 
                className="py-12 text-center rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500"
                style={{ backgroundColor: countryCalmBg }}
              >
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                <p className="text-sm">Administrative division tables are cataloged under national statistical office indices.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: PROVENANCE & OFFICIAL LINKS */}
        {activeTab === 'provenance' && (
          <div className="space-y-6">
            <div 
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 space-y-4 shadow-xs transition-colors"
              style={{ backgroundColor: countryCalmBg }}
            >
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-200/60 dark:border-zinc-800 pb-3">
                <ExternalLink className="w-4 h-4 text-emerald-500" /> Official Institutional Portals
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <a
                  href={media.worldBankProfileUrl}
                  {...SAFE_EXTERNAL_LINK_PROPS}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors group shadow-xs"
                >
                  <span>World Bank Country Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-500" />
                </a>
                <a
                  href={media.imfProfileUrl}
                  {...SAFE_EXTERNAL_LINK_PROPS}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors group shadow-xs"
                >
                  <span>IMF Article IV & WEO</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-500" />
                </a>
                <a
                  href={media.unProfileUrl}
                  {...SAFE_EXTERNAL_LINK_PROPS}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors group shadow-xs"
                >
                  <span>UN Data Country Table</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-500" />
                </a>
                <a
                  href={media.africanUnionUrl}
                  {...SAFE_EXTERNAL_LINK_PROPS}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors group shadow-xs"
                >
                  <span>African Union Member State</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-500" />
                </a>
                <a
                  href={media.wikipediaUrl}
                  {...SAFE_EXTERNAL_LINK_PROPS}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors group shadow-xs"
                >
                  <span>Wikipedia Encyclopedia</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-500" />
                </a>
                <a
                  href={media.wikidataUrl}
                  {...SAFE_EXTERNAL_LINK_PROPS}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors group shadow-xs"
                >
                  <span>Wikidata Semantic Entity</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-500" />
                </a>
              </div>
            </div>
          </div>
        )}
      </AnimatedTabPanel>
        </div>
      </div>

      {/* 1-Page Printable Executive Country Factsheet Modal */}
      <CountryFactsheetModal
        entityId={entity.id}
        isOpen={showFactsheet}
        onClose={() => setShowFactsheet(false)}
      />
    </section>
  );
};

export default CountryView;
