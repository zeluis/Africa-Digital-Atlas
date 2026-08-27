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
import { GitCompare, Plus, X, ArrowRight, ShieldCheck, Check, Layers, Crosshair } from 'lucide-react';

interface CompareViewProps {
  onSelectCountry: (entityId: string) => void;
  initialCountries?: string[];
}

export const CompareView: React.FC<CompareViewProps> = ({
  onSelectCountry,
  initialCountries = ['NGA', 'ZAF', 'EGY', 'KEN']
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialCountries);
  const [showSilhouettes, setShowSilhouettes] = useState(true);
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
      group: 'Macroeconomic & Financial',
      items: [
        { label: 'Nominal GDP (2024)', format: (id: string) => formatGDP(atlas.getIndicatorValue(id, 'NY.GDP.MKTP.CD')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'NY.GDP.MKTP.CD') || 0 },
        { label: 'GDP per Capita', format: (id: string) => {
          const gdp = atlas.getIndicatorValue(id, 'NY.GDP.MKTP.CD');
          const pop = atlas.getIndicatorValue(id, 'SP.POP.TOTL');
          return gdp && pop ? formatCurrency(Math.round((gdp * 1e9) / (pop * 1e6))) : '—';
        }, isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => {
          const gdp = atlas.getIndicatorValue(id, 'NY.GDP.MKTP.CD');
          const pop = atlas.getIndicatorValue(id, 'SP.POP.TOTL');
          return gdp && pop ? (gdp * 1e9) / (pop * 1e6) : 0;
        }},
        { label: 'Real GDP Growth Rate', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'NY.GDP.MKTP.KD.ZG')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'NY.GDP.MKTP.KD.ZG') || 0 },
        { label: 'Inflation Rate (CPI)', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'FP.CPI.TOTL.ZG')), isLeader: (values: number[]) => Math.min(...values.filter(v => v > 0)), getValue: (id: string) => atlas.getIndicatorValue(id, 'FP.CPI.TOTL.ZG') || 0 },
        { label: 'Govt Debt to GDP %', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'GC.DOD.TOTL.GD.ZS')), isLeader: (values: number[]) => Math.min(...values.filter(v => v > 0)), getValue: (id: string) => atlas.getIndicatorValue(id, 'GC.DOD.TOTL.GD.ZS') || 0 },
      ]
    },
    {
      group: 'Demographics & Social Development',
      items: [
        { label: 'Total Population', format: (id: string) => formatPopulation(atlas.getIndicatorValue(id, 'SP.POP.TOTL')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'SP.POP.TOTL') || 0 },
        { label: 'Human Development (HDI)', format: (id: string) => formatHDI(atlas.getIndicatorValue(id, 'UNDP.HDI.INDEX')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'UNDP.HDI.INDEX') || 0 },
        { label: 'Life Expectancy', format: (id: string) => `${(atlas.getIndicatorValue(id, 'SP.DYN.LE00.IN') || 0).toFixed(1)} yrs`, isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'SP.DYN.LE00.IN') || 0 },
        { label: 'Adult Literacy Rate', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'SE.ADT.LITR.ZS')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'SE.ADT.LITR.ZS') || 0 },
        { label: 'Urban Population %', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'SP.URB.TOTL.IN.ZS')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'SP.URB.TOTL.IN.ZS') || 0 },
      ]
    },
    {
      group: 'Geography & Vector Morphology',
      items: [
        { label: 'Land Area (km²)', format: (id: string) => formatArea(atlas.getEntity(id)?.landAreaKm2), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getEntity(id)?.landAreaKm2 || 0 },
        { label: 'UN M49 Numeric ID', format: (id: string) => UN_M49_NUMERIC_CODES[id] || '—', isLeader: () => 0, getValue: (id: string) => Number(UN_M49_NUMERIC_CODES[id]) || 0 },
        { label: 'Shape Topology', format: (id: string) => getEntityGeographyMetadata(id)?.shapeType.toUpperCase() || 'CONTINENTAL', isLeader: () => 0, getValue: () => 0 },
        { label: 'UNESCO Heritage Sites', format: (id: string) => `${atlas.getHeritageSites(id).length} Sites`, isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getHeritageSites(id).length },
        { label: 'Electricity Access %', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'EG.ELC.ACCS.ZS')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'EG.ELC.ACCS.ZS') || 0 },
        { label: 'Renewable Energy Share %', format: (id: string) => formatPercentage(atlas.getIndicatorValue(id, 'EG.FEC.RNEW.ZS')), isLeader: (values: number[]) => Math.max(...values), getValue: (id: string) => atlas.getIndicatorValue(id, 'EG.FEC.RNEW.ZS') || 0 },
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

      {/* Comparison Grid Matrix Table */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xl overflow-hidden">
        {/* Table Header with Country Dossiers */}
        <div className="grid border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950" style={{ gridTemplateColumns: `240px repeat(${countries.length}, 1fr)` }}>
          <div className="p-4 md:p-6 flex items-end font-bold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Indicators & Metrics
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

              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectCountry(country.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Full Dossier <ArrowRight className="w-3 h-3" />
                </button>
                <span className="text-[10px] font-mono text-zinc-500">M49: {UN_M49_NUMERIC_CODES[country.id] || '—'}</span>
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
                            className={`p-3.5 md:px-6 md:py-4 border-l border-zinc-200 dark:border-zinc-800 font-mono text-xs md:text-sm flex items-center justify-between ${
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
    </div>
  );
};
