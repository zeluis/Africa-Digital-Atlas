import React, { useState } from 'react';
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
import { GitCompare, Plus, X, ArrowRight, ShieldCheck, Check, Layers, Crosshair, Ship, DollarSign, FileText } from 'lucide-react';
import { getCountryHistoricalDevelopmentDossier } from '../data/countryHistoricalDevelopmentData';
import { MultiCountryRadarMatrix } from '../components/MultiCountryRadarMatrix';
import { CountryFactsheetModal } from '../components/CountryFactsheetModal';

interface CompareViewProps {
  onSelectCountry: (entityId: string) => void;
  initialCountries?: string[];
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
  initialCountries = ['NGA', 'ZAF', 'EGY', 'KEN']
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialCountries);
  const [showSilhouettes, setShowSilhouettes] = useState(true);
  const [valuationMode, setValuationMode] = useState<'nominal' | 'ppp'>('nominal');
  const [normalizationScale, setNormalizationScale] = useState<'aggregate' | 'perCapita'>('aggregate');
  const [factsheetCountryId, setFactsheetCountryId] = useState<string | null>(null);

  const allEntities = atlas.getAllEntities();

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
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-2xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSilhouettes(!showSilhouettes)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                showSilhouettes
                  ? 'bg-emerald-500 text-zinc-950 font-bold border-emerald-400'
                  : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{showSilhouettes ? 'Hide Silhouettes' : 'Show Silhouettes'}</span>
            </button>

            {/* Add Country Picker */}
            {selectedIds.length < 4 && (
              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddCountry(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer hover:border-emerald-500 focus:outline-hidden"
                  defaultValue=""
                >
                  <option value="" disabled>+ Add Country to Compare</option>
                  {allEntities
                    .filter(e => !selectedIds.includes(e.id))
                    .map(e => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.id})
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side-by-Side SVG Geographic Silhouettes */}
      {showSilhouettes && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" /> Comparative SVG Geography & Vector Silhouettes
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">Build-phase deterministic coordinates</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {countries.map(country => (
              <div key={country.id} className="relative">
                <CountrySilhouette entityId={country.id} size="md" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Country 8-Pillar Radar Matrix */}
      <MultiCountryRadarMatrix
        countries={countries}
        onSelectCountry={onSelectCountry}
      />

      {/* Interactive Switchers Row: Valuation (Nominal vs PPP) and Scale (Aggregate vs Per-Capita) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {/* Valuation Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-zinc-500 uppercase flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            Currency &amp; Valuation:
          </span>
          <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setValuationMode('nominal')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                valuationMode === 'nominal'
                  ? 'bg-white dark:bg-zinc-950 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              Nominal USD ($)
            </button>
            <button
              type="button"
              onClick={() => setValuationMode('ppp')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                valuationMode === 'ppp'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-purple-600'
              }`}
            >
              PPP Int'l $ (World Bank ICP)
            </button>
          </div>
        </div>

        {/* Normalization Scale Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-zinc-500 uppercase">Aggregation Scale:</span>
          <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setNormalizationScale('aggregate')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                normalizationScale === 'aggregate'
                  ? 'bg-white dark:bg-zinc-950 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              National Aggregate
            </button>
            <button
              type="button"
              onClick={() => setNormalizationScale('perCapita')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                normalizationScale === 'perCapita'
                  ? 'bg-white dark:bg-zinc-950 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              Per-Capita Normalized
            </button>
          </div>
        </div>

        {/* Dynamic Context Explanation Banner */}
        <div className="w-full pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono flex items-center justify-between text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>
              {valuationMode === 'ppp' 
                ? 'PPP Mode: Macro values adjusted via World Bank ICP 2021/2024 price level parity multipliers (reflects real domestic consumer & capital purchasing volume).'
                : 'Nominal USD Mode: Values converted using official market exchange rates.'}
            </span>
          </div>
          <span className="hidden md:inline text-[10px] text-zinc-400">
            {normalizationScale === 'perCapita' ? 'Normalized per capita / per 1k residents' : 'Absolute national totals'}
          </span>
        </div>
      </div>

      {/* Comparison Grid Matrix Table */}
      <div 
        className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-md overflow-hidden transition-colors"
        style={{ backgroundColor: 'var(--region-pan-african-calm)' }}
      >
        {/* Table Header with Country Dossiers */}
        <div className="grid border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950" style={{ gridTemplateColumns: `240px repeat(${countries.length}, 1fr)` }}>
          <div className="p-4 md:p-6 flex items-end font-bold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Indicators &amp; Metrics
          </div>

          {countries.map(country => (
            <div key={country.id} className="p-4 md:p-6 border-l border-zinc-200 dark:border-zinc-800 flex flex-col justify-between relative group">
              {selectedIds.length > 2 && (
                <button
                  onClick={() => handleRemoveCountry(country.id)}
                  className="absolute top-3 right-3 p-1 rounded-full bg-zinc-200 dark:bg-zinc-900 text-zinc-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                  title="Remove country"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="space-y-2">
                <CountryFlag entityId={country.id} size="lg" />
                <div>
                  <h3 className="font-extrabold text-base md:text-lg text-zinc-900 dark:text-zinc-100 font-display">
                    {country.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono mt-0.5">
                    <span>{country.region}</span>
                    <span>•</span>
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
                      style={{ gridTemplateColumns: `240px repeat(${countries.length}, 1fr)` }}
                    >
                      <div className="p-3.5 md:px-6 md:py-4 text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center">
                        {item.label}
                      </div>

                      {countries.map(country => {
                        const val = item.getValue(country.id);
                        const isLeading = leaderVal !== 0 && val === leaderVal;

                        return (
                          <div
                            key={country.id}
                            className={`p-3.5 md:px-6 md:py-4 border-l border-zinc-200 dark:border-zinc-800 font-mono font-tabular tabular-nums text-xs md:text-sm flex items-center justify-between ${
                              isLeading ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20' : 'text-zinc-800 dark:text-zinc-200'
                            }`}
                          >
                            <span>{item.format(country.id)}</span>
                            {isLeading && (
                              <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> High
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

      {/* 1-Page Printable Country Factsheet Modal */}
      {factsheetCountryId && (
        <CountryFactsheetModal
          entityId={factsheetCountryId}
          isOpen={true}
          onClose={() => setFactsheetCountryId(null)}
        />
      )}
    </div>
  );
};
