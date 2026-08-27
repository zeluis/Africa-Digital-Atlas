import React, { useState } from 'react';
import { AfricaMap } from '../components/AfricaMap';
import { AfricanRegion } from '../data/types';
import { atlas } from '../data/atlas-store';
import { CountryFlag } from '../components/CountryFlag';
import { formatPopulation, formatGDP, formatHDI } from '../data/atlas-formatters';
import { useTranslation } from '../i18n/LanguageContext';
import { getCountryRegionTonalPalette, getRegionTonalPalette } from '../data/unGeoschemeColors';
import { 
  Map as MapIcon, 
  Layers, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface MapViewProps {
  onSelectCountry: (entityId: string) => void;
  selectedEntityId?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  onSelectCountry,
  selectedEntityId = 'NGA'
}) => {
  const { t } = useTranslation();
  const [regionFilter, setRegionFilter] = useState<AfricanRegion | 'All'>('All');
  const [selectedCountryId, setSelectedCountryId] = useState<string>(selectedEntityId);

  const selectedEntity = atlas.getEntity(selectedCountryId) || atlas.getEntity('NGA')!;

  const handleCountryClick = (id: string) => {
    setSelectedCountryId(id);
  };

  const regions: (AfricanRegion | 'All')[] = [
    'All',
    'Northern Africa',
    'Western Africa',
    'Central Africa',
    'Eastern Africa',
    'Southern Africa'
  ];

  const pop = atlas.getIndicatorValue(selectedEntity.id, 'SP.POP.TOTL');
  const gdp = atlas.getIndicatorValue(selectedEntity.id, 'NY.GDP.MKTP.CD');
  const hdi = atlas.getIndicatorValue(selectedEntity.id, 'UNDP.HDI.INDEX');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-2xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Active Page Pill Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 mb-3 shadow-2xs">
              <MapIcon className="w-3.5 h-3.5" />
              <span>AFRICA ATLAS • CARTOGRAPHY & MAPS</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-display">
              Pan-African Geographic & Thematic Map
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
              Explore geopolitical boundaries, sub-regional groupings, and multi-thematic choropleth indicators across all 54 sovereign nations.
            </p>
          </div>

          {/* Quick Region Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <span className="text-xs text-zinc-400 font-medium mr-1 hidden lg:inline flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {regions.map(r => {
              const isSelected = regionFilter === r;
              const tonal = r === 'All' ? null : getRegionTonalPalette(r);
              return (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? tonal 
                        ? `${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text} shadow-xs ring-1 ring-offset-1 ring-zinc-400 dark:ring-zinc-600`
                        : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Map & Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Main Area: Interactive Cartographic Map (8 cols) */}
        <div className="lg:col-span-8 xl:col-span-9">
          <AfricaMap
            selectedEntityId={selectedCountryId}
            onSelectEntity={handleCountryClick}
            regionFilter={regionFilter}
          />
        </div>

        {/* Right Area: Selected Country Inspector (4 cols) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          {/* Selected Country Dossier Card */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CountryFlag entityId={selectedEntity.id} size="md" />
                <div>
                  <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 leading-tight">
                    {selectedEntity.name}
                  </h3>
                  <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    {selectedEntity.region} • {selectedEntity.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 dark:text-zinc-400">Capital City</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedEntity.capital}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 dark:text-zinc-400">Population</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {formatPopulation(pop)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 dark:text-zinc-400">Nominal GDP</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {formatGDP(gdp)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 dark:text-zinc-400">HDI Index</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatHDI(hdi)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 dark:text-zinc-400">Currency</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono">
                  {selectedEntity.currency ? `${selectedEntity.currency.name} (${selectedEntity.currency.code})` : 'N/A'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onSelectCountry(selectedEntity.id)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
            >
              <span>Open Full Country Dossier</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Map Layer Information */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-5 space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-emerald-500" /> Cartographic Layers
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Use the top-left layer toggle on the map to switch between <strong>UN Geoscheme subregions</strong> and <strong>8 Thematic Choropleth indicators</strong>.
            </p>
            <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
              <div>• Projection: Modified Web Mercator (Continental Africa)</div>
              <div>• Resolution: High-Fidelity SVG Vector Boundary Paths</div>
              <div>• Calibration: WGS84 GeoJSON harmonized</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
