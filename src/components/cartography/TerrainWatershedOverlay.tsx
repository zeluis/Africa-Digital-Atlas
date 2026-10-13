import React from 'react';
import { Waves, Mountain, Compass } from 'lucide-react';

export interface WatershedBasin {
  id: string;
  name: string;
  lengthKm: number;
  discharge: string;
  countries: string[];
  description: string;
}

export const MAJOR_WATERSHEDS: WatershedBasin[] = [
  { id: 'nile', name: 'Nile Basin (White & Blue Nile)', lengthKm: 6650, discharge: '2,830 m³/s', countries: ['Egypt', 'Sudan', 'South Sudan', 'Ethiopia', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'DRC', 'Kenya'], description: 'The longest river in Africa, draining north into the Mediterranean through the world’s most historically rich delta.' },
  { id: 'congo', name: 'Congo Basin (Zaire River)', lengthKm: 4700, discharge: '41,200 m³/s', countries: ['Democratic Republic of the Congo', 'Republic of the Congo', 'Angola', 'Cameroon', 'Central African Republic', 'Tanzania', 'Zambia'], description: 'The second-largest river in the world by discharge, holding the planet’s largest contiguous tropical rainforest carbon sink.' },
  { id: 'niger', name: 'Niger Basin', lengthKm: 4200, discharge: '6,000 m³/s', countries: ['Nigeria', 'Mali', 'Niger', 'Guinea', 'Cameroon', 'Benin', 'Burkina Faso', 'Chad', 'Ivory Coast'], description: 'A crescent-shaped river defining West Africa’s agricultural breadbasket and inland delta.' },
  { id: 'zambezi', name: 'Zambezi Basin', lengthKm: 2574, discharge: '3,400 m³/s', countries: ['Zambia', 'Angola', 'Zimbabwe', 'Mozambique', 'Malawi', 'Tanzania', 'Botswana', 'Namibia'], description: 'Flowing east to the Indian Ocean, home to Victoria Falls and massive hydroelectric power reserves.' }
];

interface TerrainWatershedOverlayProps {
  isEnabled: boolean;
  onToggleEnabled: () => void;
  selectedBasinId: string;
  onSelectBasin: (basinId: string) => void;
}

export const TerrainWatershedOverlay: React.FC<TerrainWatershedOverlayProps> = ({
  isEnabled,
  onToggleEnabled,
  selectedBasinId,
  onSelectBasin
}) => {
  const activeBasin = MAJOR_WATERSHEDS.find(b => b.id === selectedBasinId) || MAJOR_WATERSHEDS[0];

  return (
    <div className="absolute top-20 left-4 z-30 max-w-sm bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl p-3 select-none">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onToggleEnabled}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            isEnabled
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          <span>3D Terrain & Watersheds {isEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {isEnabled && (
        <div className="space-y-2 mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider">
            Major River Basins & Elevation
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {MAJOR_WATERSHEDS.map(basin => {
              const isSelected = basin.id === selectedBasinId;
              return (
                <button
                  key={basin.id}
                  type="button"
                  onClick={() => onSelectBasin(basin.id)}
                  className={`p-2 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 font-bold'
                      : 'bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="text-xs font-serif font-bold">{basin.name.split(' ')[0]} Basin</div>
                  <div className="text-[10px] font-mono text-stone-500">{basin.lengthKm.toLocaleString()} km</div>
                </button>
              );
            })}
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs space-y-1">
            <div className="font-mono font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{activeBasin.name}</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-snug">
              {activeBasin.description}
            </p>
            <div className="flex justify-between font-mono text-[10px] text-blue-700 dark:text-blue-300 pt-1 border-t border-blue-200/60 dark:border-blue-800/60">
              <span>Discharge: {activeBasin.discharge}</span>
              <span>Riparian States: {activeBasin.countries.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
