import React, { useState } from 'react';
import {
  Layers,
  Zap,
  Globe2,
  ShieldAlert,
  Hospital,
  GraduationCap,
  Landmark,
  Trees,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Check,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { LayerVisibilityState } from './ThematicOverlaysLayer';

export interface ThematicLayerDeckProps {
  layerVisibility: LayerVisibilityState;
  onToggleLayer: (key: keyof LayerVisibilityState) => void;
  onSetAllLayers: (enabled: boolean) => void;
  onOpenCatalogueModal: () => void;
  showPowerPlants: boolean;
  onTogglePowerPlants: () => void;
  showProtectedAreas: boolean;
  onToggleProtectedAreas: () => void;
  className?: string;
}

interface LayerItemDef {
  key: keyof LayerVisibilityState | 'powerPlants' | 'protectedAreas';
  label: string;
  badge: string;
  count: number;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  category: 'connectivity' | 'security' | 'social' | 'heritage' | 'energy';
}

export const ThematicLayerDeck: React.FC<ThematicLayerDeckProps> = ({
  layerVisibility,
  onToggleLayer,
  onSetAllLayers,
  onOpenCatalogueModal,
  showPowerPlants,
  onTogglePowerPlants,
  showProtectedAreas,
  onToggleProtectedAreas,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const layerItems: LayerItemDef[] = [
    {
      key: 'subseaCables',
      label: 'Oceanic Subsea Fiber Cables',
      badge: '2Africa, Equiano, ACE, SEACOM',
      count: 5,
      color: '#0284c7',
      icon: Globe2,
      category: 'connectivity'
    },
    {
      key: 'landingStations',
      label: 'Coastal Cable Landing Hubs',
      badge: 'Alexandria, Lagos, Cape Town...',
      count: 10,
      color: '#0284c7',
      icon: Globe2,
      category: 'connectivity'
    },
    {
      key: 'conflictBeacons',
      label: 'Conflict & Security Beacons',
      badge: 'ACLED Battles, Air Strikes, Disputes',
      count: 8,
      color: '#ef4444',
      icon: ShieldAlert,
      category: 'security'
    },
    {
      key: 'hospitals',
      label: 'Tertiary Referral Hospitals',
      badge: 'Bed Capacity & Level-1 Trauma Hubs',
      count: 7,
      color: '#0891b2',
      icon: Hospital,
      category: 'social'
    },
    {
      key: 'schools',
      label: 'Universities & Education Hubs',
      badge: 'Mega Campuses & Research Output',
      count: 6,
      color: '#d97706',
      icon: GraduationCap,
      category: 'social'
    },
    {
      key: 'culturalHeritage',
      label: 'UNESCO Cultural Monuments',
      badge: 'Lalibela, Giza, Djenné, Axum...',
      count: 7,
      color: '#ca8a04',
      icon: Landmark,
      category: 'heritage'
    },
    {
      key: 'naturalSanctuaries',
      label: 'Natural Biospheres & Wonders',
      badge: 'Kruger, Kilimanjaro, Victoria Falls',
      count: 6,
      color: '#059669',
      icon: Trees,
      category: 'heritage'
    },
    {
      key: 'powerCorridors',
      label: 'Power Pools & Trade Corridors',
      badge: 'SAPP, WAPP, EAPP 500kV HVDC',
      count: 5,
      color: '#0284c7',
      icon: Zap,
      category: 'energy'
    },
    {
      key: 'growthNodes',
      label: 'Megacity & Energy Nodes',
      badge: 'GERD, Benban, Johannesburg, Cairo',
      count: 10,
      color: '#7c3aed',
      icon: Sparkles,
      category: 'energy'
    }
  ];

  const activeCount =
    Object.values(layerVisibility).filter(Boolean).length +
    (showPowerPlants ? 1 : 0) +
    (showProtectedAreas ? 1 : 0);

  const totalCount = layerItems.length;

  const isLayerActive = (key: LayerItemDef['key']): boolean => {
    if (key === 'powerPlants') return showPowerPlants;
    if (key === 'protectedAreas') return showProtectedAreas;
    return !!layerVisibility[key as keyof LayerVisibilityState];
  };

  const handleToggle = (key: LayerItemDef['key']) => {
    if (key === 'powerPlants') {
      onTogglePowerPlants();
    } else if (key === 'protectedAreas') {
      onToggleProtectedAreas();
    } else {
      onToggleLayer(key as keyof LayerVisibilityState);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Collapsed Pill Button in Editorial Theme */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/95 dark:bg-zinc-900/95 hover:bg-zinc-50 dark:hover:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-800/90 shadow-md backdrop-blur-md transition-all text-xs font-semibold cursor-pointer group"
          title="Toggle Thematic Overlays Deck"
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:rotate-45 transition-transform" />
          <span className="font-medium">Thematic Layer Deck</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-300 dark:border-emerald-700/60">
            {activeCount}/{totalCount}
          </span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
        </button>

        {/* Browse 241 AKP Datasets Button */}
        <button
          onClick={onOpenCatalogueModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 hover:bg-amber-100/90 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300/80 dark:border-amber-700/60 shadow-md backdrop-blur-md transition-all text-xs font-semibold cursor-pointer group"
          title="Browse All 241 European Commission AKP Datasets"
        >
          <Layers className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          <span className="hidden sm:inline">AKP Data Registry</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-600 text-white font-mono text-[10px] font-black">
            241
          </span>
        </button>
      </div>

      {/* Expanded Interactive Layer Selector Panel (Editorial Paper Aesthetic) */}
      {isExpanded && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 p-4 rounded-2xl bg-white/98 dark:bg-zinc-950/98 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 text-zinc-900 dark:text-zinc-100">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Cartographic Overlays</h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSetAllLayers(true)}
                className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 underline cursor-pointer"
              >
                All On
              </button>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <button
                onClick={() => onSetAllLayers(false)}
                className="text-[10px] font-mono font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 underline cursor-pointer"
              >
                All Off
              </button>
            </div>
          </div>

          {/* Layer Items List */}
          <div className="mt-3 space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {layerItems.map((item) => {
              const active = isLayerActive(item.key);
              const Icon = item.icon;

              return (
                <div
                  key={item.key}
                  onClick={() => handleToggle(item.key)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                    active
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/40 text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'bg-zinc-50/80 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 opacity-70 hover:opacity-100 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}40` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1.5">
                        {item.label}
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {item.count}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{item.badge}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {active ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center justify-center">
                        <EyeOff className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>Click any beacon to open top-docked inspector</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-[10px] font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
