import React, { useState } from 'react';
import { AfricaMap, MapDisplayMode } from '../components/AfricaMap';
import { AfricanRegion } from '../data/types';
import { Landmark, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { INITIAL_UNESCO_HERITAGE_SITES } from '../data/unescoHeritageRegistry';

interface MapViewProps {
  onSelectCountry: (entityId: string) => void;
  selectedEntityId?: string;
  onNavigateToHeritage?: (siteId: number) => void;
  showUnescoSites?: boolean;
  onToggleUnescoSites?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  onSelectCountry,
  selectedEntityId = 'NGA',
  onNavigateToHeritage,
  showUnescoSites: externalShowUnescoSites,
  onToggleUnescoSites: externalOnToggleUnescoSites
}) => {
  const [regionFilter, setRegionFilter] = useState<AfricanRegion | 'All'>('All');
  const [mapMode, setMapMode] = useState<MapDisplayMode>('authentic_palette');
  const [activeMetric, setActiveMetric] = useState<string>('NY.GDP.MKTP.CD');
  const [internalShowUnescoSites, setInternalShowUnescoSites] = useState<boolean>(true);

  const showUnesco = externalShowUnescoSites !== undefined ? externalShowUnescoSites : internalShowUnescoSites;
  const handleToggleUnesco = externalOnToggleUnescoSites || (() => setInternalShowUnescoSites(prev => !prev));

  return (
    <div className="w-full min-h-screen flex-1 flex flex-col select-none relative bg-zinc-50 dark:bg-zinc-950">
      {/* Main Full-Screen Map Viewport */}
      <div id="map-viewport-container" className="relative w-full flex-1 flex flex-col">
        {/* Floating Quick-Access Layer Toggle Badge for UNESCO World Heritage Sites */}
        <div className="absolute top-20 right-4 z-30 hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/92 dark:bg-stone-900/92 backdrop-blur-md border border-stone-200/90 dark:border-stone-800/90 shadow-lg text-xs">
          <button
            type="button"
            onClick={handleToggleUnesco}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
              showUnesco
                ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/30 shadow-2xs font-bold'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/80 dark:border-stone-700/80'
            }`}
            title="Toggle UNESCO World Heritage Layer (cultural & natural site markers)"
          >
            <Landmark className={`w-3.5 h-3.5 ${showUnesco ? 'text-amber-700 dark:text-amber-400' : 'text-stone-500'}`} />
            <span className="font-serif">UNESCO Heritage</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold">
              {INITIAL_UNESCO_HERITAGE_SITES.length}
            </span>
            {showUnesco ? (
              <Eye className="w-3 h-3 text-emerald-600 dark:text-emerald-400 ml-0.5" />
            ) : (
              <EyeOff className="w-3 h-3 text-stone-400 ml-0.5" />
            )}
          </button>

          {onNavigateToHeritage && (
            <button
              type="button"
              onClick={() => onNavigateToHeritage(18)} // Lalibela default highlight
              className="p-1.5 rounded-xl text-stone-500 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Open full UNESCO World Heritage Archive viewer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <AfricaMap
          isFullBleed={true}
          initialCartographySource="authentic_final"
          selectedEntityId={selectedEntityId}
          onSelectEntity={onSelectCountry}
          onSelectCountry={onSelectCountry}
          regionFilter={regionFilter}
          onSelectRegionFilter={setRegionFilter}
          mapMode={mapMode}
          onMapModeChange={setMapMode}
          activeMetric={activeMetric}
          onActiveMetricChange={setActiveMetric}
          showUnescoSites={showUnesco}
          onToggleUnescoSites={handleToggleUnesco}
          onNavigateToHeritage={onNavigateToHeritage}
        />
      </div>
    </div>
  );
};


