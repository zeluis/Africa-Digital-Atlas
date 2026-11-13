import React, { useState, useMemo, useEffect } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { 
  SPRING_TACTILE, 
  SPRING_SNAPPY, 
  SlidingPill, 
  StaggerGrid, 
  StaggerGridItem, 
  usePrefersReducedMotion, 
  getRegionCardTonalStyle, 
  TACTILE_CARD_INTERACTIONS, 
  TACTILE_BUTTON_INTERACTIONS 
} from '../utils/motion';
import { AtlasDialog } from '../components/common/AtlasDialog';
import { ChartAccessibleTable } from '../components/common/ChartAccessibleTable';
import { atlas } from '../data/atlas-store';
import { CountryFlag } from '../components/CountryFlag';
import { CountrySilhouette } from '../components/CountrySilhouette';
import { getEntityGeographyMetadata, UN_M49_NUMERIC_CODES } from '../data/svgGeographySystem';
import { 
  formatPopulation, 
  formatGDP, 
  formatCurrency, 
  formatPercentage, 
  formatHDI, 
  formatArea 
} from '../data/atlas-formatters';
import { 
  GitCompare, 
  Plus, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Layers, 
  Crosshair, 
  Ship, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Activity, 
  ArrowRightLeft,
  Search,
  RefreshCw,
  Sparkles,
  Filter,
  Globe
} from 'lucide-react';
import { getCountryHistoricalDevelopmentDossier } from '../data/countryHistoricalDevelopmentData';
import { MultiCountryRadarMatrix } from '../components/MultiCountryRadarMatrix';
import { CountryFactsheetModal } from '../components/CountryFactsheetModal';
import { BilateralTradeComplementaritySection } from '../components/afcfta/BilateralTradeComplementaritySection';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { getMultiCountryTimeSeries } from '../data/atlas-selectors';

interface CompareViewProps {
  onSelectCountry: (entityId: string) => void;
  initialCountries?: string[];
  onCountriesChange?: (countries: string[]) => void;
}

const PPP_PRICE_LEVEL_FACTORS: Record<string, number> = {
  EGY: 4.55, NGA: 5.40, ZAF: 2.38, DZA: 2.63, ETH: 2.48, MAR: 2.58,
  KEN: 2.95, AGO: 2.72, GHA: 3.08, TZA: 2.70, CIV: 2.45, COD: 2.20,
  UGA: 3.10, CMR: 2.35, TUN: 2.85, SEN: 2.60, ZWE: 2.15, ZMB: 2.80,
  MOZ: 2.65, MDG: 3.25, SDN: 3.80, MLI: 2.90, BFA: 3.05, BEN: 2.80,
  GIN: 2.95, TCD: 2.75, NER: 3.10, RWA: 3.00, MWI: 3.40, SOM: 2.90,
  BWA: 2.30, GAB: 1.85, MUS: 1.95, NAM: 2.10, GNQ: 1.75, MRT: 2.85,
  SWZ: 2.40, LSO: 2.60, TGO: 2.90, SLE: 3.35, LBR: 2.80, CPV: 2.10,
  BDI: 3.15, DJI: 1.90, ERI: 2.90, GMB: 3.20, GNB: 2.95, COM: 2.60,
  STP: 2.30, SYC: 1.65, SSD: 2.40, CAF: 2.70, COG: 2.10, LBY: 2.30
};

export const CompareView: React.FC<CompareViewProps> = ({
  onSelectCountry,
  initialCountries = ['NGA', 'ZAF', 'EGY', 'KEN'],
  onCountriesChange
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialCountries);

  // Sync external initialCountries (e.g., from deep link or browser navigation)
  useEffect(() => {
    if (initialCountries && initialCountries.length > 0) {
      setSelectedIds(prev => {
        const isSame = prev.length === initialCountries.length && prev.every((id, idx) => id === initialCountries[idx]);
        return isSame ? prev : initialCountries;
      });
    }
  }, [initialCountries]);

  // Notify parent container of country selection updates for URL hash permalinks
  useEffect(() => {
    onCountriesChange?.(selectedIds);
  }, [selectedIds, onCountriesChange]);
  const [activeCompareTab, setActiveCompareTab] = useState<'matrix' | 'afcfta'>('matrix');
  const [showSilhouettes, setShowSilhouettes] = useState(true);
  const [valuationMode, setValuationMode] = useState<'nominal' | 'ppp'>('nominal');
  const [normalizationScale, setNormalizationScale] = useState<'aggregate' | 'perCapita'>('aggregate');
  const [factsheetCountryId, setFactsheetCountryId] = useState<string | null>(null);
  const [convergenceMetricId, setConvergenceMetricId] = useState<string>('NY.GDP.MKTP.CD');

  // Sleek Country Selector Modal State
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [swapTargetIndex, setSwapTargetIndex] = useState<number | null>(null);
  const [selectorSearch, setSelectorSearch] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('ALL');

  const reducedMotion = usePrefersReducedMotion();

  const REGION_OPTIONS = [
    { id: 'ALL', label: 'All Regions' },
    { id: 'Northern Africa', label: 'Northern Africa' },
    { id: 'Western Africa', label: 'Western Africa' },
    { id: 'Central Africa', label: 'Central Africa' },
    { id: 'Eastern Africa', label: 'Eastern Africa' },
    { id: 'Southern Africa', label: 'Southern Africa' },
  ];

  const handleOpenAdd = () => {
    setSwapTargetIndex(null);
    setSelectorSearch('');
    setSelectedRegionFilter('ALL');
    setIsSelectorOpen(true);
  };

  const handleOpenSwap = (index: number) => {
    setSwapTargetIndex(index);
    setSelectorSearch('');
    setSelectedRegionFilter('ALL');
    setIsSelectorOpen(true);
  };

  const handleSelectCountry = (id: string) => {
    if (swapTargetIndex !== null) {
      const updated = [...selectedIds];
      updated[swapTargetIndex] = id;
      setSelectedIds(updated);
    } else {
      if (selectedIds.length < 4 && !selectedIds.includes(id)) {
        setSelectedIds([...selectedIds, id]);
      }
    }
    setIsSelectorOpen(false);
  };

  const allEntities = atlas.getAllEntities();

  const candidateCountries = useMemo(() => {
    const q = selectorSearch.trim().toLowerCase();
    return allEntities.filter(entity => {
      if (selectedRegionFilter !== 'ALL' && entity.region !== selectedRegionFilter) {
        return false;
      }
      if (!q) return true;
      const matchName = entity.name.toLowerCase().includes(q);
      const matchId = entity.id.toLowerCase().includes(q);
      const matchRegion = entity.region.toLowerCase().includes(q);
      const matchCapital = entity.capital?.toLowerCase().includes(q) || false;
      return matchName || matchId || matchRegion || matchCapital;
    });
  }, [allEntities, selectorSearch, selectedRegionFilter]);

  const handleAddCountry = (id: string) => {
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemoveCountry = (id: string) => {
    if (selectedIds.length > 2) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }
  };

  const countries = selectedIds.map(id => atlas.getEntity(id) || atlas.getEntity('NGA')!);

  const convergenceMetrics = [
    { id: 'NY.GDP.MKTP.CD', label: 'Nominal GDP ($B)', unit: '$B' },
    { id: 'NY.GDP.MKTP.KD.ZG', label: 'Real GDP Growth (%)', unit: '%' },
    { id: 'SP.DYN.LE00.IN', label: 'Life Expectancy (Years)', unit: 'yrs' },
    { id: 'EG.ELC.ACCS.ZS', label: 'Electricity Access (%)', unit: '%' },
    { id: 'SE.PRM.ENRR', label: 'Primary School Enrollment (%)', unit: '%' },
  ];

  const convergenceData = useMemo(() => {
    return getMultiCountryTimeSeries(selectedIds, convergenceMetricId);
  }, [selectedIds, convergenceMetricId]);

  const COUNTRY_CHART_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'];

  // Metrics definitions for the comparison table
  const metricGroups = [
    {
      group: 'Macroeconomic & Monetary Architecture',
      items: [
        { 
          label: valuationMode === 'ppp' ? 'GDP (PPP Int\'l $, 2024)' : 'Nominal GDP (USD, 2024)', 
          format: (id: string) => {
            const nominal = atlas.getIndicatorValue(id, 'NY.GDP.MKTP.CD') || 0;
            if (valuationMode === 'ppp') {
              const factor = PPP_PRICE_LEVEL_FACTORS[id] || 2.6;
              return `${formatGDP(nominal * factor)} (PPP)`;
            }
            return formatGDP(nominal);
          }, 
          isLeader: (values: number[]) => Math.max(...values), 
          getValue: (id: string) => {
            const nominal = atlas.getIndicatorValue(id, 'NY.GDP.MKTP.CD') || 0;
            return valuationMode === 'ppp' ? nominal * (PPP_PRICE_LEVEL_FACTORS[id] || 2.6) : nominal;
          } 
        },
        { 
          label: valuationMode === 'ppp' ? 'GDP per Capita (PPP Int\'l $)' : 'GDP per Capita (Nominal USD)', 
          format: (id: string) => {
            const gdp = atlas.getIndicatorValue(id, 'NY.GDP.MKTP.CD') || 0;
            const pop = atlas.getIndicatorValue(id, 'SP.POP.TOTL') || 0;
            if (pop === 0 || gdp === 0) return '—';
            const multiplier = valuationMode === 'ppp' ? (PPP_PRICE_LEVEL_FACTORS[id] || 2.6) : 1;
            const perCap = Math.round((gdp * multiplier * 1e9) / (pop * 1e6));
            return `${formatCurrency(perCap)}${valuationMode === 'ppp' ? ' (PPP)' : ''}`;
          }, 
          isLeader: (values: number[]) => Math.max(...values), 
          getValue: (id: string) => {
            const gdp = atlas.getIndicatorValue(id, 'NY.GDP.MKTP.CD') || 0;
            const pop = atlas.getIndicatorValue(id, 'SP.POP.TOTL') || 0;
            if (pop === 0 || gdp === 0) return 0;
            const multiplier = valuationMode === 'ppp' ? (PPP_PRICE_LEVEL_FACTORS[id] || 2.6) : 1;
            return (gdp * multiplier * 1e9) / (pop * 1e6);
          }
        },
        {
          label: 'Purchasing Power Multiplier (ICP)',
          format: (id: string) => `${(PPP_PRICE_LEVEL_FACTORS[id] || 2.6).toFixed(2)}× local purchasing power`,
          isLeader: (values: number[]) => Math.max(...values),
          getValue: (id: string) => PPP_PRICE_LEVEL_FACTORS[id] || 2.6
        },
        { label: 'Real GDP Growth Rate', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'NY.GDP.MKTP.KD.ZG')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'NY.GDP.MKTP.KD.ZG') || 0 },
        { label: 'Inflation Rate (CPI)', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'FP.CPI.TOTL.ZG')), isLeader: (values: number[]) => Math.min(...values.filter(v => v > 0)), getValue: (id: string) => atlas.getIndicatorValue(id, 'FP.CPI.TOTL.ZG') || 0 },
        { label: 'Govt Debt to GDP %', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'GC.DOD.TOTL.GD.ZS')), isLeader: (values: number[]) => Math.min(...values.filter(v => v > 0)), getValue: (id: string) => atlas.getIndicatorValue(id, 'GC.DOD.TOTL.GD.ZS') || 0 },
      ]
    },
    {
      group: 'Demographics, Human Capital & Quality of Life',
      items: [
        { 
          label: normalizationScale === 'perCapita' ? 'Population Share of Africa %' : 'Total National Population', 
          format: (id: string) => {
            const p = atlas.getIndicatorValue(id, 'SP.POP.TOTL') || 0;
            if (normalizationScale === 'perCapita') {
              return `${((p / 1450) * 100).toFixed(2)}% of Africa`;
            }
            return formatPopulation(p);
          }, 
          isLeader: (values: number[]) => Math.max(...values), 
          getValue: (id: string) => atlas.getIndicatorValue(id, 'SP.POP.TOTL') || 0 
        },
        { label: 'Human Development (HDI)', format: (id: string) => formatHDI(atlas.getIndicatorValue(id, 'UNDP.HDI.INDEX')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'UNDP.HDI.INDEX') || 0 },
        { label: 'Life Expectancy at Birth', format: (id: string) => `${(atlas.getIndicatorValue(id, 'SP.DYN.LE00.IN') || 0).toFixed(1)} yrs`, isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'SP.DYN.LE00.IN') || 0 },
        { label: 'Adult Literacy Rate', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'SE.ADT.LITR.ZS')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'SE.ADT.LITR.ZS') || 0 },
        { label: 'Urban Population Share', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'SP.URB.TOTL.IN.ZS')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'SP.URB.TOTL.IN.ZS') || 0 },
        { 
          label: 'CO2 Emissions (Metric Tons / Person)', 
          format: (id: string) => `${(atlas.getIndicatorValue(id, 'EN.ATM.CO2E.PC') || 0.6).toFixed(2)} MT/capita`, 
          isLeader: (values: number[]) => Math.min(...values.filter(v => v > 0)), 
          getValue: (id: string) => atlas.getIndicatorValue(id, 'EN.ATM.CO2E.PC') || 0.6 
        },
      ]
    },
    {
      group: 'Geography & Vector Morphology',
      items: [
        { 
          label: normalizationScale === 'perCapita' ? 'Land Area per Inhabitant' : 'Total Land Area (km²)', 
          format: (id: string) => {
            const area = atlas.getEntity(id)?.landAreaKm2 || 0;
            const p = atlas.getIndicatorValue(id, 'SP.POP.TOTL') || 1;
            if (normalizationScale === 'perCapita') {
              return `${((area / (p * 1e6)) * 1000).toFixed(2)} km² / 1k people`;
            }
            return formatArea(area);
          }, 
          isLeader: (values: number[]) => Math.max(...values), 
          getValue: (id: string) => atlas.getEntity(id)?.landAreaKm2 || 0 
        },
        { label: 'UN M49 Numeric ID', format: (id: string) => UN_M49_NUMERIC_CODES[id] || '—', isLeader: () => 0, getValue: (id: string) => Number(UN_M49_NUMERIC_CODES[id]) || 0 },
        { label: 'Shape Topology', format: (id: string) => getEntityGeographyMetadata(id)?.shapeType.toUpperCase() || 'CONTINENTAL', isLeader: () => 0, getValue: () => 0 },
        { label: 'UNESCO Heritage Sites', format: (id: string) => `${atlas.getHeritageSites(id).length} Sites`, isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getHeritageSites(id).length },
        { label: 'Electricity Access %', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'EG.ELC.ACCS.ZS')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'EG.ELC.ACCS.ZS') || 0 },
        { label: 'Renewable Energy Share %', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'EG.FEC.RNEW.ZS')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'EG.FEC.RNEW.ZS') || 0 },
      ]
    },
    {
      group: 'Transatlantic & Historical Development Heritage',
      items: [
        { 
          label: 'Historical TAST Zone', 
          format: (id: string) => {
            const country = atlas.getEntity(id);
            const dossier = getCountryHistoricalDevelopmentDossier(country?.name || id);
            return dossier.historicalTastRegion;
          }, 
          isLeader: () => 0, 
          getValue: () => 0 
        },
        { 
          label: 'Archival Embarkation Ports', 
          format: (id: string) => {
            const country = atlas.getEntity(id);
            const dossier = getCountryHistoricalDevelopmentDossier(country?.name || id);
            return dossier.portsOfEmbarkation.length > 0 ? `${dossier.portsOfEmbarkation.length} documented ports` : 'None (Interior/Inland)';
          }, 
          isLeader: (values: number[]) => Math.max(...values), 
          getValue: (id: string) => {
            const country = atlas.getEntity(id);
            return getCountryHistoricalDevelopmentDossier(country?.name || id).portsOfEmbarkation.length;
          } 
        },
        { 
          label: 'Historical Extraction Scope', 
          format: (id: string) => {
            const country = atlas.getEntity(id);
            const dossier = getCountryHistoricalDevelopmentDossier(country?.name || id);
            return dossier.tastVolumeEstimate.length > 45 ? `${dossier.tastVolumeEstimate.slice(0, 42)}...` : dossier.tastVolumeEstimate;
          }, 
          isLeader: () => 0, 
          getValue: () => 0 
        },
        { 
          label: 'Colonial Power & Mandate', 
          format: (id: string) => {
            const country = atlas.getEntity(id);
            const dossier = getCountryHistoricalDevelopmentDossier(country?.name || id);
            return dossier.colonialPower.split('(')[0].trim();
          }, 
          isLeader: () => 0, 
          getValue: () => 0 
        }
      ]
    }
  ];

  return (
    <section aria-label="Multi-Nation Comparative Matrix and Head-to-Head Observatory" className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-6 md:p-8 shadow-2xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
              <GitCompare className="w-3.5 h-3.5" /> Head-to-Head Comparative Matrix
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              Multi-Nation Comparative Matrix
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Select 2 to 4 African nations to analyze deterministic SVG vector geometries, macroeconomic indicators, and demographic profiles side-by-side.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowSilhouettes(!showSilhouettes)}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                showSilhouettes
                  ? 'bg-emerald-500 text-zinc-950 font-bold border-emerald-400 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{showSilhouettes ? 'Hide Silhouettes' : 'Show Silhouettes'}</span>
            </button>

            {/* Sleek Add Country Button */}
            {selectedIds.length < 4 && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500 transition-all cursor-pointer shadow-xs tabular-nums"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Country ({selectedIds.length}/4)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Comparison Lineup Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {countries.map((country, idx) => {
          const tonal = getRegionCardTonalStyle(country.region);
          const pop = atlas.getIndicatorValue(country.id, 'SP.POP.TOTL') || 0;
          const gdp = atlas.getIndicatorValue(country.id, 'NY.GDP.MKTP.CD') || 0;

          return (
            <m.div
              key={country.id}
              layout="position"
              whileHover={reducedMotion ? {} : { y: -2 }}
              className="p-4 rounded-2xl border transition-all relative group flex flex-col justify-between"
              style={{
                backgroundColor: tonal.lightBackground,
                borderColor: tonal.lightBorder,
                boxShadow: `0 4px 16px -4px ${tonal.unBaseColor}20`
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="shrink-0 drop-shadow-xs">
                    <CountryFlag entityId={country.id} size="md" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {country.name}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                      <span>{country.id}</span>
                      <span className="mx-1">·</span>
                      <span className="truncate">{country.region}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Swap & Remove */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenSwap(idx)}
                    className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 transition-colors cursor-pointer shadow-2xs"
                    title={`Swap ${country.name} with another nation`}
                    aria-label={`Swap ${country.name}`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  {selectedIds.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCountry(country.id)}
                      className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-zinc-500 hover:text-rose-600 transition-colors cursor-pointer shadow-2xs"
                      title={`Remove ${country.name} from comparison`}
                      aria-label={`Remove ${country.name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Quick Metric Indicator */}
              <div className="mt-3 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-600 dark:text-zinc-400 tabular-nums">
                <span>Pop: {formatPopulation(pop)}</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  GDP: {formatGDP(gdp)}
                </span>
              </div>
            </m.div>
          );
        })}

        {/* Empty Slots */}
        {Array.from({ length: 4 - selectedIds.length }).map((_, emptyIdx) => {
          const slotNum = selectedIds.length + emptyIdx + 1;
          return (
            <m.button
              key={`empty-slot-${slotNum}`}
              type="button"
              layout="position"
              onClick={handleOpenAdd}
              whileHover={reducedMotion ? {} : { scale: 1.01 }}
              whileTap={reducedMotion ? {} : { scale: 0.985 }}
              className="p-4 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-zinc-50/60 dark:bg-zinc-900/30 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all flex flex-col items-center justify-center min-h-[96px] gap-2 text-zinc-500 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-zinc-200/80 dark:bg-zinc-800 group-hover:bg-emerald-500 group-hover:text-zinc-950 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-all">
                <Plus className="w-4 h-4" />
              </div>
              <div className="text-center">
                <span className="text-xs font-bold font-display block">Slot {slotNum} Available</span>
                <span className="text-[10px] font-mono text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  + Add Nation to Compare
                </span>
              </div>
            </m.button>
          );
        })}
      </div>

      {/* Compare View Switcher Tabs with SlidingPill */}
      <div 
        className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-fit max-w-full overflow-x-auto scroll-shadow-x no-scrollbar" 
        role="tablist" 
        aria-label="Comparative analysis perspective"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeCompareTab === 'matrix'}
          onClick={() => setActiveCompareTab('matrix')}
          className={`relative flex items-center gap-2 px-4 py-2 min-h-[40px] whitespace-nowrap shrink-0 rounded-xl text-xs font-bold transition-colors cursor-pointer select-none ${
            activeCompareTab === 'matrix'
              ? 'text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          {activeCompareTab === 'matrix' && (
            <SlidingPill layoutId="compareActivePerspectiveTab" className="absolute inset-0 rounded-xl bg-white dark:bg-zinc-800 shadow-xs" />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <GitCompare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Macroeconomic &amp; Indicator Matrix</span>
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeCompareTab === 'afcfta'}
          onClick={() => setActiveCompareTab('afcfta')}
          className={`relative flex items-center gap-2 px-4 py-2 min-h-[40px] whitespace-nowrap shrink-0 rounded-xl text-xs font-bold transition-colors cursor-pointer select-none ${
            activeCompareTab === 'afcfta'
              ? 'text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          {activeCompareTab === 'afcfta' && (
            <SlidingPill layoutId="compareActivePerspectiveTab" className="absolute inset-0 rounded-xl bg-white dark:bg-zinc-800 shadow-xs" />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>AfCFTA &amp; Bilateral Trade Complementarity</span>
          </span>
        </button>
      </div>

      {activeCompareTab === 'afcfta' ? (
        <BilateralTradeComplementaritySection
          countryIds={selectedIds}
          onSelectCountry={onSelectCountry}
        />
      ) : (
        <>
          {/* Side-by-Side SVG Geographic Silhouettes */}
          {showSilhouettes && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" /> Comparative SVG Geography & Vector Silhouettes
                </h3>
                <span className="text-[11px] font-mono text-zinc-500">Build-phase deterministic coordinates</span>
              </div>

              <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {countries.map(country => (
                  <StaggerGridItem key={country.id} className="relative">
                    <CountrySilhouette entityId={country.id} size="md" />
                  </StaggerGridItem>
                ))}
              </StaggerGrid>
            </div>
          )}

      {/* Multi-Country 8-Pillar Radar Matrix */}
      <MultiCountryRadarMatrix
        countries={countries}
        onSelectCountry={onSelectCountry}
      />

      {/* Historical Convergence Trajectory (2015–2024) */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 font-display">
                Historical Convergence Trajectory (2015–2024)
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Multi-year trajectory comparison tracking structural convergence between selected nations
            </p>
          </div>

          <div className="flex flex-nowrap overflow-x-auto scroll-shadow-x no-scrollbar sm:flex-wrap items-center gap-1.5 pb-1 sm:pb-0 max-w-full" role="tablist" aria-label="Convergence trajectory indicator">
            {convergenceMetrics.map(metric => {
              const isSelected = convergenceMetricId === metric.id;
              return (
                <button
                  key={metric.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setConvergenceMetricId(metric.id)}
                  className={`relative px-3 py-1.5 min-h-[36px] whitespace-nowrap shrink-0 rounded-xl text-xs font-mono font-semibold transition-colors duration-150 cursor-pointer select-none border border-zinc-200 dark:border-zinc-800 ${
                    isSelected
                      ? 'text-white dark:text-zinc-950 font-bold shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                  }`}
                >
                  {isSelected && (
                    <m.div
                      layoutId="compareConvergenceMetric"
                      className="absolute inset-0 rounded-xl bg-zinc-900 dark:bg-zinc-100 shadow-xs"
                      transition={SPRING_TACTILE}
                    />
                  )}
                  <span className="relative z-10">{metric.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={convergenceData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:stroke-zinc-800" />
              <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'rgba(24, 24, 27, 0.95)', 
                  borderColor: '#3f3f46', 
                  borderRadius: '0.75rem', 
                  color: '#f4f4f5',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                }}
              />
              <Legend />
              {selectedIds.map((cId, idx) => {
                const ent = atlas.getEntity(cId);
                return (
                  <Line
                    key={cId}
                    type="monotone"
                    dataKey={cId}
                    name={ent?.name || cId}
                    stroke={COUNTRY_CHART_COLORS[idx % COUNTRY_CHART_COLORS.length]}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={!reducedMotion}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div role="status" aria-live="polite" className="sr-only">
          Comparing {countries.map(c => c.name).join(', ')} on {convergenceMetrics.find(m => m.id === convergenceMetricId)?.label || convergenceMetricId} ({valuationMode.toUpperCase()}, {normalizationScale}).
        </div>
        <ChartAccessibleTable
          caption={`Multi-country convergence trajectory: ${convergenceMetrics.find(m => m.id === convergenceMetricId)?.label || convergenceMetricId}`}
          headers={['Year', ...countries.map(c => c.name)]}
          rows={convergenceData.map((pt: Record<string, string | number | undefined>) => [
            pt.year ?? '—',
            ...selectedIds.map(id => {
              const val = pt[id];
              return typeof val === 'number' ? Number(val.toFixed(2)) : (val ?? '—');
            })
          ])}
          summaryLabel="Inspect multi-country trajectory table"
        />
      </div>

      {/* Interactive Switchers Row: Valuation (Nominal vs PPP) and Scale (Aggregate vs Per-Capita) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {/* Valuation Switcher */}
        <div className="flex flex-wrap items-center gap-2 max-w-full">
          <span className="text-xs font-mono font-bold text-zinc-500 uppercase flex items-center gap-1 shrink-0">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            Currency &amp; Valuation:
          </span>
          <div className="relative flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700 overflow-x-auto scroll-shadow-x no-scrollbar max-w-full">
            <button
              type="button"
              onClick={() => setValuationMode('nominal')}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer select-none ${
                valuationMode === 'nominal'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              {valuationMode === 'nominal' && (
                <m.div
                  layoutId="compareValuationMode"
                  className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-950 shadow-xs"
                  transition={SPRING_TACTILE}
                />
              )}
              <span className="relative z-10">Nominal USD ($)</span>
            </button>
            <button
              type="button"
              onClick={() => setValuationMode('ppp')}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer select-none ${
                valuationMode === 'ppp'
                  ? 'text-purple-700 dark:text-purple-300 font-bold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-purple-600'
              }`}
            >
              {valuationMode === 'ppp' && (
                <m.div
                  layoutId="compareValuationMode"
                  className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-950 shadow-xs"
                  transition={SPRING_TACTILE}
                />
              )}
              <span className="relative z-10">PPP Int'l $ (World Bank ICP)</span>
            </button>
          </div>
        </div>

        {/* Normalization Scale Switcher */}
        <div className="flex flex-wrap items-center gap-2 max-w-full">
          <span className="text-xs font-mono font-bold text-zinc-500 uppercase shrink-0">Aggregation Scale:</span>
          <div className="relative flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700 overflow-x-auto scroll-shadow-x no-scrollbar max-w-full">
            <button
              type="button"
              onClick={() => setNormalizationScale('aggregate')}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer select-none ${
                normalizationScale === 'aggregate'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              {normalizationScale === 'aggregate' && (
                <m.div
                  layoutId="compareNormalizationScale"
                  className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-950 shadow-xs"
                  transition={SPRING_TACTILE}
                />
              )}
              <span className="relative z-10">National Aggregate</span>
            </button>
            <button
              type="button"
              onClick={() => setNormalizationScale('perCapita')}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer select-none ${
                normalizationScale === 'perCapita'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              {normalizationScale === 'perCapita' && (
                <m.div
                  layoutId="compareNormalizationScale"
                  className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-950 shadow-xs"
                  transition={SPRING_TACTILE}
                />
              )}
              <span className="relative z-10">Per-Capita Normalized</span>
            </button>
          </div>
        </div>

        {/* Dynamic Context Explanation Banner */}
        <div className="w-full pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono flex items-center justify-between gap-2 text-zinc-500 dark:text-zinc-400">
          <span>
            {valuationMode === 'ppp' 
              ? 'PPP Mode: Macro values adjusted via World Bank ICP 2021/2024 price level parity multipliers (reflects real domestic consumer & capital purchasing volume).'
              : 'Nominal USD Mode: Values converted using official market exchange rates.'}
          </span>
          <span className="hidden md:inline text-[10px] text-zinc-400 shrink-0">
            {normalizationScale === 'perCapita' ? 'Normalized per capita / per 1k residents' : 'Absolute national totals'}
          </span>
        </div>
      </div>

      {/* Comparison Grid Matrix Table (Horizontal scroll-shadow-x with sticky indicator column on mobile) */}
      <div 
        className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-md overflow-hidden transition-colors"
        style={{ backgroundColor: 'var(--region-pan-african-calm)' }}
      >
        <div className="overflow-x-auto scroll-shadow-x">
          <div className="min-w-[640px]">
            {/* Table Header with Country Dossiers */}
            <div className="grid border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950" style={{ gridTemplateColumns: `minmax(150px, 220px) repeat(${countries.length}, minmax(135px, 1fr))` }}>
              <div className="sticky start-0 z-10 bg-zinc-50 dark:bg-zinc-950 p-3.5 sm:p-4 md:p-6 flex items-end font-bold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-e border-zinc-200/80 dark:border-zinc-800">
                Indicators &amp; Metrics
              </div>

              {countries.map((country, idx) => (
                <div key={country.id} className="p-3.5 sm:p-4 md:p-6 border-s border-zinc-200 dark:border-zinc-800 flex flex-col justify-between relative group">
                  <div className="absolute top-2.5 end-2.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenSwap(idx)}
                      className="min-w-[34px] min-h-[34px] flex items-center justify-center rounded-full bg-zinc-200/80 dark:bg-zinc-900 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                      title={`Swap ${country.name} with another nation`}
                      aria-label={`Swap ${country.name}`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    {selectedIds.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCountry(country.id)}
                        className="min-w-[34px] min-h-[34px] flex items-center justify-center rounded-full bg-zinc-200/80 dark:bg-zinc-900 text-zinc-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                        title={`Remove ${country.name}`}
                        aria-label={`Remove ${country.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 pe-14 sm:pe-0">
                    <CountryFlag entityId={country.id} size="lg" />
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base md:text-lg text-zinc-900 dark:text-zinc-100 font-display">
                        {country.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-500 font-mono mt-0.5">
                        <span className="truncate">{country.region}</span>
                        <span>·</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{country.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setFactsheetCountryId(country.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold font-mono text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                      title="Open printable 1-page executive factsheet brief"
                    >
                      <FileText className="w-3 h-3" /> 1-Page Brief
                    </button>
                    <button
                      onClick={() => onSelectCountry(country.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Full Dossier <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicator Groups */}
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {metricGroups.map(group => (
                <div key={group.group}>
                  <div className="bg-zinc-100 dark:bg-zinc-950/80 px-4 md:px-6 py-2.5 font-bold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
                    <span>{group.group}</span>
                  </div>

                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/40">
                    {group.items.map(item => {
                      const values = countries.map(c => item.getValue(c.id));
                      const leaderVal = item.isLeader(values);

                      return (
                        <div
                          key={item.label}
                          className="grid hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                          style={{ gridTemplateColumns: `minmax(150px, 220px) repeat(${countries.length}, minmax(135px, 1fr))` }}
                        >
                          <div className="sticky start-0 z-10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xs p-3 sm:p-3.5 md:px-6 md:py-4 text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center border-e border-zinc-200/80 dark:border-zinc-800">
                            {item.label}
                          </div>

                          {countries.map(country => {
                            const val = item.getValue(country.id);
                            const isLeading = leaderVal !== 0 && val === leaderVal;

                            return (
                              <div
                                key={country.id}
                                className={`p-3 sm:p-3.5 md:px-6 md:py-4 border-s border-zinc-200 dark:border-zinc-800 font-mono tabular-nums text-xs md:text-sm flex items-center justify-between gap-1.5 ${
                                  isLeading ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20' : 'text-zinc-800 dark:text-zinc-200'
                                }`}
                              >
                                <span>{item.format(country.id)}</span>
                                {isLeading && (
                                  <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-0.5 shrink-0">
                                    <Check className="w-3 h-3" /> High
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Sleek Interactive Country Selector Modal */}
      <AnimatePresence>
        {isSelectorOpen && (
          <AtlasDialog
            isOpen={isSelectorOpen}
            onClose={() => setIsSelectorOpen(false)}
            labelledBy="country-selector-modal-title"
            overlayClassName="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md atlas-modal-backdrop"
            className="atlas-modal-panel w-full max-w-4xl max-h-[92dvh] sm:max-h-[88dvh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
            motionProps={{
              initial: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 20 },
              animate: reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 },
              exit: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 20 },
              transition: SPRING_SNAPPY,
            }}
          >
              {/* Modal Masthead */}
              <div className="p-4 sm:p-5 md:p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 bg-zinc-50/80 dark:bg-zinc-900/60 shrink-0">
                <div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-mono tabular-nums">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      {swapTargetIndex !== null ? `SWAPPING SLOT ${swapTargetIndex + 1}` : 'ADD NATION TO COMPARISON'}
                    </span>
                    <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
                    <span className="text-zinc-500">
                      {selectedIds.length}/4 Active Slots
                    </span>
                  </div>
                  <h2 id="country-selector-modal-title" className="text-lg sm:text-xl md:text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100 mt-1">
                    {swapTargetIndex !== null 
                      ? `Replace ${atlas.getEntity(selectedIds[swapTargetIndex])?.name || 'Selected Nation'}`
                      : 'Choose an African Nation to Compare'}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Select from 54 sovereign African states across all UN M49 macro-geoschemes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSelectorOpen(false)}
                  className="min-touch-target rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer shrink-0"
                  aria-label="Close country selector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search & Region Filter Bar */}
              <div className="p-4 md:px-6 md:py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 space-y-3 shrink-0">
                <div className="relative">
                  <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={selectorSearch}
                    onChange={e => setSelectorSearch(e.target.value)}
                    placeholder="Search by country name, ISO code (e.g. NGA, KEN, MAR), or capital..."
                    className="w-full ps-10 pe-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
                    autoFocus
                  />
                  {selectorSearch && (
                    <button
                      type="button"
                      onClick={() => setSelectorSearch('')}
                      aria-label="Clear search"
                      className="min-touch-target absolute end-1 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Region Filter Chips with SlidingPill */}
                <div className="flex flex-nowrap overflow-x-auto scroll-shadow-x no-scrollbar sm:flex-wrap items-center gap-1.5 pb-1 sm:pb-0" role="tablist" aria-label="Geoscheme region filter">
                  {REGION_OPTIONS.map(opt => {
                    const isSelected = selectedRegionFilter === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setSelectedRegionFilter(opt.id)}
                        className={`relative px-3 py-1.5 min-h-[36px] whitespace-nowrap shrink-0 rounded-xl text-xs font-semibold transition-colors duration-150 cursor-pointer select-none border border-zinc-200 dark:border-zinc-800 ${
                          isSelected
                            ? 'text-white dark:text-zinc-950 font-bold shadow-xs'
                            : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                        }`}
                      >
                        {isSelected && (
                          <SlidingPill layoutId="selectorRegionPill" className="absolute inset-0 rounded-xl bg-zinc-900 dark:bg-zinc-100 shadow-xs" />
                        )}
                        <span className="relative z-10">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nations Grid */}
              <div className="p-4 md:p-6 overflow-y-auto overscroll-contain sleek-scrollbar flex-1">
                {candidateCountries.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500">
                    <Globe className="w-8 h-8 mx-auto text-zinc-400 mb-2 opacity-50" />
                    <p className="text-sm font-semibold">No countries matching &ldquo;{selectorSearch}&rdquo;</p>
                    <p className="text-xs text-zinc-400 mt-1">Try searching for a different name, ISO code, or reset the regional filter.</p>
                  </div>
                ) : (
                  <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {candidateCountries.map(entity => {
                      const isCurrentlyCompared = selectedIds.includes(entity.id);
                      const isTargetSlotCountry = swapTargetIndex !== null && selectedIds[swapTargetIndex] === entity.id;
                      const pop = atlas.getIndicatorValue(entity.id, 'SP.POP.TOTL') || 0;
                      const gdp = atlas.getIndicatorValue(entity.id, 'NY.GDP.MKTP.CD') || 0;

                      return (
                        <StaggerGridItem key={entity.id}>
                          <button
                            type="button"
                            disabled={isCurrentlyCompared && !isTargetSlotCountry}
                            onClick={() => handleSelectCountry(entity.id)}
                            className={`w-full p-3.5 rounded-2xl border text-start transition-all relative flex flex-col justify-between h-full cursor-pointer ${
                              isTargetSlotCountry
                                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-1 ring-amber-500'
                                : isCurrentlyCompared
                                ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/40 opacity-60 cursor-not-allowed'
                                : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-zinc-900/80 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <CountryFlag entityId={entity.id} size="md" />
                                <div className="min-w-0">
                                  <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                                    {entity.name}
                                  </div>
                                  <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                                    <span>{entity.id}</span>
                                    <span>·</span>
                                    <span className="truncate">{entity.region}</span>
                                  </div>
                                </div>
                              </div>

                              {isCurrentlyCompared ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                                  <Check className="w-3 h-3" /> In Matrix
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-zinc-500 dark:text-zinc-400 shrink-0">
                                  Select
                                </span>
                              )}
                            </div>

                            <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500 tabular-nums">
                              <span>Pop: {formatPopulation(pop)}</span>
                              <span className="font-semibold text-zinc-700 dark:text-zinc-300">GDP: {formatGDP(gdp)}</span>
                            </div>
                          </button>
                        </StaggerGridItem>
                      );
                    })}
                  </StaggerGrid>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 sm:px-6 sm:py-3 safe-pb border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between text-xs text-zinc-500 font-mono tabular-nums shrink-0">
                <span>Showing {candidateCountries.length} of 54 African Nations</span>
                <span className="hidden sm:inline">Press Esc to Close</span>
              </div>
          </AtlasDialog>
        )}
      </AnimatePresence>

      {/* 1-Page Printable Country Factsheet Modal */}
      {factsheetCountryId && (
        <CountryFactsheetModal
          entityId={factsheetCountryId}
          isOpen={true}
          onClose={() => setFactsheetCountryId(null)}
        />
      )}
    </section>
  );
};

export default CompareView;
