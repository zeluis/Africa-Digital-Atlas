import React, { useState } from 'react';
import { AfricaMap, MapDisplayMode } from '../components/AfricaMap';
import { AfricanRegion } from '../data/types';

interface MapViewProps {
  onSelectCountry: (entityId: string) => void;
  selectedEntityId?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  onSelectCountry,
  selectedEntityId = 'NGA'
}) => {
  const [regionFilter, setRegionFilter] = useState<AfricanRegion | 'All'>('All');
  const [mapMode, setMapMode] = useState<MapDisplayMode>('un_geoscheme');
  const [activeMetric, setActiveMetric] = useState<string>('NY.GDP.MKTP.CD');

  return (
    <div className="w-full h-full flex-1 flex flex-col min-h-screen select-none relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Main Full-Screen Map Viewport */}
      <div id="map-viewport-container" className="relative w-full h-full flex-1 flex flex-col overflow-hidden">
        <AfricaMap
          isFullBleed={true}
          selectedEntityId={selectedEntityId}
          onSelectEntity={onSelectCountry}
          onSelectCountry={onSelectCountry}
          regionFilter={regionFilter}
          onSelectRegionFilter={setRegionFilter}
          mapMode={mapMode}
          onMapModeChange={setMapMode}
          activeMetric={activeMetric}
          onActiveMetricChange={setActiveMetric}
        />
      </div>
    </div>
  );
};

