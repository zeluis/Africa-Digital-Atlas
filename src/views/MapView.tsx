import React, { useState } from 'react';
import { AfricaMap, MapDisplayMode } from '../components/AfricaMap';
import { AfricanRegion } from '../data/types';
import { MobileCountryPeekSheet } from '../components/MobileCountryPeekSheet';

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
  const [showCriticalMinerals, setShowCriticalMinerals] = useState<boolean>(false);
  const [peekCountryId, setPeekCountryId] = useState<string | null>(null);
  const [isPeekOpen, setIsPeekOpen] = useState<boolean>(false);

  const showUnesco = externalShowUnescoSites !== undefined ? externalShowUnescoSites : internalShowUnescoSites;
  const handleToggleUnesco = externalOnToggleUnescoSites || (() => setInternalShowUnescoSites(prev => !prev));

  const handleCountrySelect = (entityId: string) => {
    setPeekCountryId(entityId);
    setIsPeekOpen(true);
  };

  return (
    <section aria-label="Interactive Cartographic Map Observatory" className="w-full min-h-[100dvh] flex-1 flex flex-col select-none relative bg-zinc-50 dark:bg-zinc-950">
      {/* Main Full-Screen Map Viewport */}
      <div id="map-viewport-container" className="relative w-full flex-1 flex flex-col">
        <AfricaMap
          isFullBleed={true}
          initialCartographySource="authentic_final"
          selectedEntityId={selectedEntityId}
          onSelectEntity={handleCountrySelect}
          onSelectCountry={handleCountrySelect}
          regionFilter={regionFilter}
          onSelectRegionFilter={setRegionFilter}
          mapMode={mapMode}
          onMapModeChange={setMapMode}
          activeMetric={activeMetric}
          onActiveMetricChange={setActiveMetric}
          showUnescoSites={showUnesco}
          onToggleUnescoSites={handleToggleUnesco}
          onNavigateToHeritage={onNavigateToHeritage}
          showCriticalMinerals={showCriticalMinerals}
          onToggleCriticalMinerals={() => setShowCriticalMinerals(prev => !prev)}
        />

        {/* Standardized 3-Snap Mobile Country Peek Sheet */}
        <MobileCountryPeekSheet
          countryId={peekCountryId}
          isOpen={isPeekOpen}
          onClose={() => setIsPeekOpen(false)}
          onOpenDossier={(cid) => {
            onSelectCountry(cid);
          }}
          onOpenCompare={(cid) => {
            window.location.hash = `#compare?countries=${cid}`;
          }}
        />
      </div>
    </section>
  );
};

export default MapView;
