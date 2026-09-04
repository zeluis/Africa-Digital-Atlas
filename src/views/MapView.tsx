import React, { useState } from 'react';
import { AfricaMap, MapDisplayMode, CHOROPLETH_METRICS } from '../components/AfricaMap';
import { AfricanRegion } from '../data/types';
import { atlas } from '../data/atlas-store';
import { CountryFlag } from '../components/CountryFlag';
import { formatPopulation, formatGDP, formatHDI } from '../data/atlas-formatters';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Map as MapIcon, 
  Layers, 
  ChevronRight, 
  Compass,
  X,
  Maximize2,
  Minimize2,
  Info
} from 'lucide-react';

interface MapViewProps {
  onSelectCountry: (entityId: string) => void;
  selectedEntityId?: string;
}

interface SubregionFilterConfig {
  id: AfricanRegion | 'All';
  label: string;
  count: number;
  dotColor: string;
  activeClasses: string;
}

const SUBREGION_FILTERS: SubregionFilterConfig[] = [
  {
    id: 'All',
    label: 'All',
    count: 54,
    dotColor: '#10b981',
    activeClasses: 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md ring-2 ring-emerald-500/50 font-bold'
  },
  {
    id: 'Northern Africa',
    label: 'Northern',
    count: 7,
    dotColor: '#F59E0B',
    activeClasses: 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/25 ring-2 ring-amber-400'
  },
  {
    id: 'Western Africa',
    label: 'Western',
    count: 16,
    dotColor: '#10B981',
    activeClasses: 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400'
  },
  {
    id: 'Central Africa',
    label: 'Central',
    count: 9,
    dotColor: '#6366F1',
    activeClasses: 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400'
  },
  {
    id: 'Eastern Africa',
    label: 'Eastern',
    count: 18,
    dotColor: '#F97316',
    activeClasses: 'bg-orange-500 text-zinc-950 font-bold shadow-md shadow-orange-500/25 ring-2 ring-orange-400'
  },
  {
    id: 'Southern Africa',
    label: 'Southern',
    count: 5,
    dotColor: '#F43F5E',
    activeClasses: 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/25 ring-2 ring-rose-400'
  }
];

export const MapView: React.FC<MapViewProps> = ({
  onSelectCountry,
  selectedEntityId = 'NGA'
}) => {
  const { t } = useTranslation();
  const [regionFilter, setRegionFilter] = useState<AfricanRegion | 'All'>('All');
  const [selectedCountryId, setSelectedCountryId] = useState<string>(selectedEntityId);
  const [mapMode, setMapMode] = useState<MapDisplayMode>('un_geoscheme');
  const [activeMetric, setActiveMetric] = useState<string>('NY.GDP.MKTP.CD');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  const selectedEntity = atlas.getEntity(selectedCountryId) || atlas.getEntity('NGA')!;

  const handleCountryClick = (id: string) => {
    setSelectedCountryId(id);
    setIsInspectorOpen(true);
  };

  const pop = atlas.getIndicatorValue(selectedEntity.id, 'SP.POP.TOTL');
  const gdp = atlas.getIndicatorValue(selectedEntity.id, 'NY.GDP.MKTP.CD');
  const hdi = atlas.getIndicatorValue(selectedEntity.id, 'UNDP.HDI.INDEX');

  return (
    <div className="w-full h-full flex flex-col flex-1 min-h-screen bg-zinc-950 select-none overflow-hidden animate-in fade-in duration-200">
      {/* Consolidated Sticky Top Controls Header */}
      <header
        id="map-consolidated-header"
        className="w-full shrink-0 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-4 sm:px-6 py-3 z-30 transition-colors shadow-xs space-y-2.5"
      >
        {/* Row 1: Map Branding, Mode Toggle & Quick Country Pill */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Left Column: Title Badge & Mode Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Title & Pill */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <MapIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-display">
                    African Continental Map
                  </h1>
                  <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400">
                    54 NATIONS
                  </span>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="hidden sm:block h-5 w-[1px] bg-zinc-200 dark:bg-zinc-800" />

            {/* UN Geoscheme vs Choropleth Layer Selector */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl">
              <button
                id="btn-mode-un-geoscheme"
                type="button"
                onClick={() => setMapMode('un_geoscheme')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mapMode === 'un_geoscheme'
                    ? 'bg-emerald-500 text-zinc-950 shadow-md font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>UN Geoscheme</span>
              </button>
              <button
                id="btn-mode-choropleth"
                type="button"
                onClick={() => setMapMode('choropleth')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mapMode === 'choropleth'
                    ? 'bg-cyan-500 text-zinc-950 shadow-md font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Choropleth</span>
              </button>
            </div>

            {/* Dynamic Metric Selector (if Choropleth mode) */}
            {mapMode === 'choropleth' && (
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl overflow-x-auto max-w-full">
                {CHOROPLETH_METRICS.map(m => (
                  <button
                    key={m.id}
                    id={`btn-metric-${m.id}`}
                    type="button"
                    onClick={() => setActiveMetric(m.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeMetric === m.id
                        ? 'bg-cyan-500 text-zinc-950 font-bold shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Selected Country Pill / Inspector Toggle */}
          <div className="flex items-center gap-2">
            <button
              id="btn-toggle-country-inspector"
              type="button"
              onClick={() => setIsInspectorOpen(prev => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
              title={isInspectorOpen ? "Minimize country card" : "Expand country card"}
            >
              <CountryFlag entityId={selectedEntity.id} size="sm" />
              <span className="truncate max-w-[100px] sm:max-w-[140px] font-bold">
                {selectedEntity.name}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">({selectedEntity.id})</span>
              {isInspectorOpen ? (
                <Minimize2 className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-emerald-500 ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Sub-Regional Filter Pills Bar with generous breathing room and 100% visible labels */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-zinc-200/70 dark:border-zinc-800/70">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5 shrink-0 pr-0.5">
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              Subregions:
            </span>

            {/* The 6 Sub-regional filter pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {SUBREGION_FILTERS.map(pill => {
                const isSelected = regionFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    id={`filter-region-${pill.id.toLowerCase().replace(/\s+/g, '-')}`}
                    type="button"
                    onClick={() => setRegionFilter(pill.id)}
                    className={`group relative flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-normal transition-all cursor-pointer select-none whitespace-nowrap shadow-xs ${
                      isSelected
                        ? pill.activeClasses
                        : 'bg-zinc-100/90 dark:bg-zinc-900/90 hover:bg-zinc-200/90 dark:hover:bg-zinc-800 border border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {/* Visual Color Dot */}
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform group-hover:scale-110 ${
                        isSelected ? 'ring-2 ring-white/60 shadow-xs' : ''
                      }`}
                      style={{ backgroundColor: pill.dotColor }}
                    />

                    {/* Prominent Label (All, Northern, Western, Central, Eastern, Southern) */}
                    <span className="font-bold">{pill.label}</span>

                    {/* Regional Country Count Badge */}
                    <span
                      className={`text-[10px] sm:text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md transition-colors ${
                        isSelected
                          ? 'bg-black/20 text-current'
                          : 'bg-zinc-200/70 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {pill.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Helper State & Clear Filter Button */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            {regionFilter !== 'All' ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-xl font-medium">
                <span>Filtering: <strong>{regionFilter}</strong></span>
                <button
                  onClick={() => setRegionFilter('All')}
                  className="hover:underline text-[11px] font-bold text-emerald-600 dark:text-emerald-300 cursor-pointer ml-1"
                >
                  Show All 54
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-zinc-400 font-mono">
                All 54 sovereign nations active
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Full-Width Map Stage */}
      <div 
        id="map-viewport-container" 
        className="relative flex-1 w-full h-[calc(100vh-125px)] min-h-[640px] overflow-hidden bg-zinc-950 flex flex-col"
      >
        <AfricaMap
          isFullBleed={true}
          selectedEntityId={selectedCountryId}
          onSelectEntity={handleCountryClick}
          onSelectCountry={handleCountryClick}
          regionFilter={regionFilter}
          mapMode={mapMode}
          onMapModeChange={setMapMode}
          activeMetric={activeMetric}
          onActiveMetricChange={setActiveMetric}
        />

        {/* Floating Selected Country Inspector Card */}
        {isInspectorOpen ? (
          <div
            id="floating-country-inspector"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-80 max-w-[calc(100vw-32px)] rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-950/95 p-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200 space-y-4"
          >
            {/* Inspector Header */}
            <div className="flex items-start justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800/80 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <CountryFlag entityId={selectedEntity.id} size="md" className="shadow-md shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                    {selectedEntity.name}
                  </h3>
                  <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    {selectedEntity.region} • {selectedEntity.id}
                  </span>
                </div>
              </div>

              <button
                id="btn-close-inspector"
                type="button"
                onClick={() => setIsInspectorOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                title="Minimize Inspector"
                aria-label="Minimize Inspector"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Core Country Key Figures */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 p-2.5 rounded-2xl">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Capital City</span>
                <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
                  {selectedEntity.capital}
                </div>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 p-2.5 rounded-2xl">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Population</span>
                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate mt-0.5">
                  {formatPopulation(pop)}
                </div>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 p-2.5 rounded-2xl">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Nominal GDP</span>
                <div className="font-mono font-bold text-cyan-600 dark:text-cyan-400 truncate mt-0.5">
                  {formatGDP(gdp)}
                </div>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 p-2.5 rounded-2xl">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">HDI Score</span>
                <div className="font-mono font-bold text-amber-600 dark:text-amber-400 truncate mt-0.5">
                  {formatHDI(hdi)}
                </div>
              </div>
            </div>

            {/* Currency Info */}
            <div className="flex items-center justify-between text-xs px-2 text-zinc-500 dark:text-zinc-400 font-mono">
              <span>Currency:</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
                {selectedEntity.currency ? `${selectedEntity.currency.name} (${selectedEntity.currency.code})` : 'N/A'}
              </span>
            </div>

            {/* Navigate to Country Dossier Action */}
            <button
              id="btn-open-full-country-dossier"
              type="button"
              onClick={() => onSelectCountry(selectedEntity.id)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-extrabold transition-all shadow-md cursor-pointer"
            >
              <span>Open Full Country Dossier</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Minimized pill positioned neatly in top-right */
          <button
            id="btn-reopen-inspector"
            type="button"
            onClick={() => setIsInspectorOpen(true)}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-zinc-950/90 hover:bg-white dark:hover:bg-zinc-900 shadow-2xl backdrop-blur-md text-xs font-bold text-zinc-900 dark:text-zinc-100 transition-all cursor-pointer animate-in fade-in"
          >
            <CountryFlag entityId={selectedEntity.id} size="sm" />
            <span>{selectedEntity.name}</span>
            <span className="text-emerald-500 font-mono text-[11px]">[Inspect]</span>
          </button>
        )}
      </div>
    </div>
  );
};
