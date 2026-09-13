import React, { useState, useMemo } from 'react';
import { ThematicPillarId } from '../services/wikipediaService';
import { AtlasEntity, AfricanRegion } from '../data/types';
import { atlas } from '../data/atlas-store';
import { COUNTRY_HEADER_DATA } from '../data/countryHeaderData';
import { getCountrySilhouette } from '../data/countrySilhouettes';
import { getCountryRegionTonalPalette, getRegionCalmColor } from '../data/unGeoschemeColors';
import { EntityBlocsBrowser } from './EntityBlocsBrowser';
import { RegionalAfcftaTradeSection } from './RegionalAfcftaTradeSection';
import { RegionalHistoricCorridorsSection } from './RegionalHistoricCorridorsSection';
import { RegionalEcologySection } from './RegionalEcologySection';
import { RegionalPowerPoolsSection } from './RegionalPowerPoolsSection';
import { ClimateEcologySection } from './ClimateEcologySection';
import { CountrySilhouette } from './CountrySilhouette';
import { CountryFlag } from './CountryFlag';
import { EntityBlocId } from '../data/entityBlocs';
import {
  Globe2,
  Compass,
  MapPin,
  TrendingUp,
  BookOpen,
  Calendar,
  Layers,
  Users,
  Building2,
  Building,
  Landmark,
  Languages,
  Trees,
  Award,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Droplets,
  Sun,
  Flame,
  Radio,
  FileText,
  Scale,
  Satellite,
  Tv,
  Music,
  CheckCircle2,
  Info,
  Anchor
} from 'lucide-react';

interface ThematicPillarBottomSectionProps {
  activePillar: ThematicPillarId;
  currentEntity: AtlasEntity;
  onSelectCountry: (countryId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const ThematicPillarBottomSection: React.FC<ThematicPillarBottomSectionProps> = ({
  activePillar,
  currentEntity,
  onSelectCountry,
  onNavigateTab
}) => {
  const tonal = getCountryRegionTonalPalette(currentEntity.id);
  const calmBg = getRegionCalmColor(currentEntity.region);
  const headerData = COUNTRY_HEADER_DATA[currentEntity.id];
  const silhouette = getCountrySilhouette(currentEntity.id);
  const heritageSites = useMemo(() => atlas.getHeritageSites(currentEntity.id), [currentEntity.id]);

  // Determine ideal initial bloc ID based on entity and region
  const initialBlocId: EntityBlocId = useMemo(() => {
    const blocs = currentEntity.blocs as string[];
    if (blocs.includes('ECOWAS')) return 'ECOWAS';
    if (blocs.includes('EAC')) return 'EAC';
    if (blocs.includes('SADC')) return 'SADC';
    if (blocs.includes('ECCAS')) return 'ECCAS';
    if (blocs.includes('AMU')) return 'AMU';
    if (blocs.includes('COMESA')) return 'COMESA';
    if (currentEntity.region === 'Western Africa') return 'ECOWAS';
    if (currentEntity.region === 'Eastern Africa') return 'EAC';
    if (currentEntity.region === 'Southern Africa') return 'SADC';
    if (currentEntity.region === 'Central Africa') return 'CEMAC';
    if (currentEntity.region === 'Northern Africa') return 'AMU';
    return 'ECOWAS';
  }, [currentEntity]);

  const populationVal = atlas.getIndicatorValue(currentEntity.id, 'POPULATION') || 
    (currentEntity.facts?.population ? parseFloat(currentEntity.facts.population) : 25.0);
  const hdiVal = atlas.getIndicatorValue(currentEntity.id, 'HDI') || 
    (currentEntity.facts?.hdi ? parseFloat(currentEntity.facts.hdi) : 0.650);

  // =========================================================================
  // PILLAR 1: GEOGRAPHY (Physical Geography & Territoriality)
  // =========================================================================
  if (activePillar === 'geography') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Top 2 Cards: Side-by-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Header Ribbon Card */}
          <div
            className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between"
            style={{ backgroundColor: calmBg }}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                    SPATIAL MORPHOLOGY & GEODETIC ATLAS
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{currentEntity.name} Territorial Morphology</span>
                  </h3>
                </div>
              </div>

              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Geographic contours, terrestrial boundaries, hydrographic drainage systems, and physical topography defining the territorial sovereignty of {currentEntity.name}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                {currentEntity.landAreaKm2.toLocaleString()} km² Surface Area
              </span>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 capitalize">
                {currentEntity.geographicType} State
              </span>
            </div>
          </div>

          {/* Spatial Matrix Companion Card */}
          <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/60 bg-linear-to-br from-emerald-50/70 via-white to-emerald-50/40 dark:from-emerald-950/30 dark:via-zinc-950 dark:to-zinc-900 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 border-b border-emerald-200/60 dark:border-emerald-800/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/80 shrink-0">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 block">
                      GEODETIC & MORPHOLOGICAL MATRIX
                    </span>
                    <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100 font-display">
                      Territorial Coordinates & Eco-Zones
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {currentEntity.subregion}
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Hydrographic drainage networks, forest canopy covers ({currentEntity.facts?.forestCover || '28.5%'}), arable soil reaches, and regional sovereign borders across {currentEntity.region}.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 text-center">
              <div className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-emerald-200/70 dark:border-emerald-900/40">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Capital</div>
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate mt-0.5">{headerData?.capital || currentEntity.capital}</div>
              </div>
              <div className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-emerald-200/70 dark:border-emerald-900/40">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Forest</div>
                <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{currentEntity.facts?.forestCover || '28.5%'}</div>
              </div>
              <div className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-emerald-200/70 dark:border-emerald-900/40">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Coastline</div>
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate mt-0.5">{silhouette?.shapeType === 'landlocked' ? 'Landlocked' : (currentEntity.facts?.coastline || 'Littoral')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Vector Silhouette & Spatial Card + Neighbors & Topography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Silhouette & Geodetic Spec */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display">
                    High-Precision Vector Silhouette
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Natural Earth 50m</span>
              </div>

              <div className="flex justify-center items-center py-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                <CountrySilhouette entityId={currentEntity.id} size="lg" interactive={true} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Geographic Center</div>
                  <div className="font-mono font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {silhouette?.geoCenter ? `${silhouette.geoCenter.lat.toFixed(2)}°N, ${silhouette.geoCenter.lng.toFixed(2)}°E` : 'Documented'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Capital Coordinates</div>
                  <div className="font-mono font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {headerData?.capital || currentEntity.capital}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Subregion</div>
                  <div className="font-mono font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {currentEntity.subregion}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Timezone / UTC</div>
                  <div className="font-mono font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {headerData?.utcOffset || 'UTC+1'} ({headerData?.timeZoneAbbr || 'WAT'})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hydrography, Relief & Neighboring States */}
          <div className="lg:col-span-7 space-y-6">
            {/* Topographical & Hydrographic Systems Card */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-7 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display">
                    Hydrographic Basins & Topographical Relief
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">UN Statistics Division</span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5" style={{ backgroundColor: calmBg }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Primary Watershed & Drainage Basin</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">Transboundary</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Part of the extensive {currentEntity.region} continental aquatic network, anchoring agricultural irrigation, artisanal fisheries, and inland fluvial freight.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between" style={{ backgroundColor: calmBg }}>
                    <span className="text-[10px] uppercase font-mono text-zinc-500">Forest Canopy</span>
                    <span className="text-base font-extrabold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                      {currentEntity.facts?.forestCover || '28.5%'}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-1">Total land surface</span>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between" style={{ backgroundColor: calmBg }}>
                    <span className="text-[10px] uppercase font-mono text-zinc-500">Arable Cropland</span>
                    <span className="text-base font-extrabold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                      {currentEntity.facts?.arableLand || '38.2%'}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-1">Cultivated soils</span>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between" style={{ backgroundColor: calmBg }}>
                    <span className="text-[10px] uppercase font-mono text-zinc-500">Coastline Length</span>
                    <span className="text-base font-extrabold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                      {silhouette?.shapeType === 'landlocked' ? 'Landlocked' : (currentEntity.facts?.coastline || 'Littoral Reach')}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-1">Territorial waters</span>
                  </div>
                </div>
              </div>

              {/* Regional Sovereign Neighbours Quick Switcher */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-display text-zinc-800 dark:text-zinc-200">
                    Regional Sovereign Partners ({currentEntity.region})
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">Click to inspect</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {atlas.getEntitiesByRegion(currentEntity.region).slice(0, 8).map(neighbor => (
                    <button
                      key={neighbor.id}
                      onClick={() => onSelectCountry(neighbor.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        neighbor.id === currentEntity.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <CountryFlag entityId={neighbor.id} size="sm" />
                      <span>{neighbor.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PILLAR 2: HISTORY (Historiography & Liberation Chronologies)
  // =========================================================================
  if (activePillar === 'history') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Top 2 Cards: Side-by-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Header Ribbon Card */}
          <div
            className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between"
            style={{ backgroundColor: calmBg }}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                    HISTORIOGRAPHY & LIBERATION CHRONOLOGY
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{currentEntity.name} Sovereignty Milestones</span>
                  </h3>
                </div>
              </div>

              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                From pre-colonial monarchies and trans-continental trading arteries to anti-colonial liberation struggles, constitutional declarations, and Pan-African solidarity.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
                Proclaimed {headerData?.independenceDate || currentEntity.independenceYear || '1960'}
              </span>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                UN Admission {headerData?.unMemberDate || '1960'}
              </span>
            </div>
          </div>

          {/* Atlantic Master Research Reports & Historical Archive Card */}
          <div className="rounded-3xl border border-amber-200/80 dark:border-amber-900/60 bg-linear-to-br from-amber-50/70 via-white to-amber-50/40 dark:from-amber-950/30 dark:via-zinc-950 dark:to-zinc-900 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 border-b border-amber-200/60 dark:border-amber-800/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800/80 shrink-0">
                    <Anchor className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400 block">
                      TRANSATLANTIC RESEARCH ARCHIVE
                    </span>
                    <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100 font-display">
                      Slave Voyages & Master Reports
                    </h4>
                  </div>
                </div>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('slave-trade')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                36,000+ trans-Atlantic voyages, coastal embarkation corridors, and peer-reviewed research monographs on international law, reparations, and institutions.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/40">
              <button
                onClick={() => onNavigateTab?.('slave-trade')}
                className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 hover:bg-amber-100/50 dark:hover:bg-zinc-800 border border-amber-200/70 dark:border-amber-900/40 text-left transition-all group cursor-pointer"
              >
                <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 font-display truncate">
                  Slave Voyages
                </div>
                <div className="text-[10px] text-zinc-500 truncate">36,000+ records</div>
              </button>

              <button
                onClick={() => onNavigateTab?.('african-development-foundations')}
                className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 hover:bg-amber-100/50 dark:hover:bg-zinc-800 border border-amber-200/70 dark:border-amber-900/40 text-left transition-all group cursor-pointer"
              >
                <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 font-display truncate">
                  Foundations
                </div>
                <div className="text-[10px] text-zinc-500 truncate">Economic history</div>
              </button>

              <button
                onClick={() => onNavigateTab?.('research-directory')}
                className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 hover:bg-amber-100/50 dark:hover:bg-zinc-800 border border-amber-200/70 dark:border-amber-900/40 text-left transition-all group cursor-pointer"
              >
                <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 font-display truncate">
                  Directory
                </div>
                <div className="text-[10px] text-zinc-500 truncate">10 Monographs</div>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column: Sovereignty Dossier on Left + Historical Corridors on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            {/* Decolonization & State Consolidation Card */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display">
                    Constitutional & Sovereign Genesis
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Treaty Registry</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80" style={{ backgroundColor: calmBg }}>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">National Independence Proclamation</div>
                  <div className="text-sm font-extrabold font-display text-zinc-900 dark:text-zinc-100 mt-1">
                    {headerData?.independenceDate || currentEntity.independenceYear || '1960'}
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                    {headerData?.independenceFrom ? `Independence from ${headerData.independenceFrom}` : 'National Sovereignty formally declared'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80" style={{ backgroundColor: calmBg }}>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">United Nations General Assembly</div>
                  <div className="text-sm font-extrabold font-display text-zinc-900 dark:text-zinc-100 mt-1">
                    {headerData?.unMemberDate || '1960'}
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                    {headerData?.unStatus || 'Full Sovereign Member State of the United Nations'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80" style={{ backgroundColor: calmBg }}>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Form of Government</div>
                  <div className="text-sm font-extrabold font-display text-zinc-900 dark:text-zinc-100 mt-1">
                    {headerData?.governmentType || currentEntity.governmentType}
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                    Constitutional authority exercising sovereign jurisdiction
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {/* Integrated Historical Trade Routes & Ancient Corridors */}
            <RegionalHistoricCorridorsSection region={currentEntity.region} />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PILLAR 3: PEOPLE (Demography & Human Development)
  // =========================================================================
  if (activePillar === 'people') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Top 2 Cards: Side-by-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Header Ribbon Card */}
          <div
            className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between"
            style={{ backgroundColor: calmBg }}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                    DEMOGRAPHY, GENERATIONAL VIGOR & HDI
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>{currentEntity.name} Human Capital</span>
                  </h3>
                </div>
              </div>

              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Age cohort distribution, demographic transition rates, urbanization trends, human capital indicators, and social vitality across {currentEntity.name}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800">
                {populationVal.toFixed(2)}M Population
              </span>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                HDI {hdiVal.toFixed(3)}
              </span>
            </div>
          </div>

          {/* Demographic Dividend & Longevity Card */}
          <div className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 bg-linear-to-br from-indigo-50/70 via-white to-indigo-50/40 dark:from-indigo-950/30 dark:via-zinc-950 dark:to-zinc-900 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 border-b border-indigo-200/60 dark:border-indigo-800/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800/80 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-indigo-700 dark:text-indigo-400 block">
                      YOUTH VANGUARD & LONGEVITY
                    </span>
                    <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100 font-display">
                      Generational Capital & Vitality
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  UN DESA
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Demographic median age profile driving entrepreneurial tech adoption, mobile money acceleration, and urban development across {currentEntity.subregion}.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-indigo-200/60 dark:border-indigo-800/40 text-center">
              <div className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-indigo-200/70 dark:border-indigo-900/40">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Under 25</div>
                <div className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">~60%</div>
              </div>
              <div className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-indigo-200/70 dark:border-indigo-900/40">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Urban</div>
                <div className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">{currentEntity.facts?.urbanPopulation || '52.0%'}</div>
              </div>
              <div className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-indigo-200/70 dark:border-indigo-900/40">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Life Exp</div>
                <div className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">{currentEntity.facts?.lifeExpectancy ? `${currentEntity.facts.lifeExpectancy}y` : '65.8y'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Card Demographic Deep Dive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Youth Dividend & Cohorts */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Youth Demographic Vanguard
              </h4>
              <span className="text-[10px] font-mono text-zinc-400">UN DESA</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-600 dark:text-zinc-400">Youth (Under 25 Years)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">~60%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-600 dark:text-zinc-400">Prime Working Age (25–64)</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">~36%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '36%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-600 dark:text-zinc-400">Elders (65+ Years)</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">~4%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '4%' }} />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed pt-2 border-t border-zinc-100 dark:border-zinc-800">
              One of the youngest dynamic demographic age profiles globally, driving continental tech adoption and entrepreneurial acceleration.
            </p>
          </div>

          {/* Card 2: Urbanization & Metropolitan Hubs */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-500" />
                Urbanization & Megacities
              </h4>
              <span className="text-[10px] font-mono text-zinc-400">UN Habitat</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Capital Conurbation</div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {headerData?.capital || currentEntity.capital}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Urban Share</div>
                  <div className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {currentEntity.facts?.urbanPopulation || '52.0%'}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Urban Growth</div>
                  <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    +3.8% / yr
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed pt-2 border-t border-zinc-100 dark:border-zinc-800">
              Rapid infrastructure expansion connecting peri-urban growth corridors with regional trading nodes.
            </p>
          </div>

          {/* Card 3: Human Development & Social Vitality */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-500" />
                Human Capital & Longevity
              </h4>
              <span className="text-[10px] font-mono text-zinc-400">UNDP HDR</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Life Expectancy at Birth</div>
                <div className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {currentEntity.facts?.lifeExpectancy ? `${currentEntity.facts.lifeExpectancy} Years` : '65.8 Years'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Adult Literacy Rate</div>
                <div className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {currentEntity.facts?.literacyRate || '74.2%'}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed pt-2 border-t border-zinc-100 dark:border-zinc-800">
              Sustained investments in higher education, primary schooling, and community healthcare networks.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PILLAR 4: LANGUAGES (Linguistic Geography & Phyla)
  // =========================================================================
  if (activePillar === 'languages') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Top 2 Cards: Side-by-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Header Ribbon Card */}
          <div
            className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between"
            style={{ backgroundColor: calmBg }}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                    LINGUISTIC GEOGRAPHY & SCRIPTS
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                    <Languages className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span>{currentEntity.name} Polyglot Lineages</span>
                  </h3>
                </div>
              </div>

              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                The Niger-Congo, Afroasiatic, Nilo-Saharan, and Khoisan phyla, vehicular lingua francas, national mother tongues, and classical African orthographies.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-violet-800 dark:text-violet-300 border border-violet-300 dark:border-violet-700/60">
                {currentEntity.languages.official.length} Official Tongues
              </span>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('languages')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer ml-auto"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>Languages Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Pan-African Linguistic Atlas Link Card */}
          <div className="rounded-3xl border border-violet-200/80 dark:border-violet-900/60 bg-linear-to-br from-violet-50/70 via-white to-violet-50/40 dark:from-violet-950/30 dark:via-zinc-950 dark:to-zinc-900 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 border-b border-violet-200/60 dark:border-violet-800/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400 flex items-center justify-center border border-violet-200 dark:border-violet-800/80 shrink-0">
                    <Languages className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-violet-700 dark:text-violet-400 block">
                      CONTINENTAL LINGUISTIC ATLAS
                    </span>
                    <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100 font-display">
                      Pan-African Languages Directory
                    </h4>
                  </div>
                </div>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('languages')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <span>Open Atlas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Inspect comprehensive linguistic trees, Afroasiatic, Niger-Congo, Nilo-Saharan, and Khoisan distributions, official constitutional language registers, and dialect metrics across all 54 African countries.
              </p>
            </div>

            <div className="pt-2 border-t border-violet-200/60 dark:border-violet-800/40 flex items-center justify-between text-xs font-mono text-violet-700 dark:text-violet-300 font-semibold">
              <span>Ge'ez • Tifinagh • N'Ko • Vai</span>
              <span className="text-[11px] text-zinc-400 font-normal">54 Nations Covered</span>
            </div>
          </div>
        </div>

        {/* 2-Column: National Idioms on Left + Indigenous African Scripts on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-7 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-violet-500" />
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display">
                    Official & Widely Spoken Languages
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">National Register</span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono uppercase font-bold text-zinc-400">Constitutionally Official</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentEntity.languages.official.map(lang => (
                      <span key={lang} className="px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/80 text-xs font-bold text-violet-900 dark:text-violet-200 font-mono">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase font-bold text-zinc-400">Most Spoken & Regional Tongues</span>
                  <div className="space-y-2 mt-2">
                    {headerData?.languages?.mostSpoken?.map((spoken, idx) => (
                      <div key={idx} className="p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs" style={{ backgroundColor: calmBg }}>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{spoken}</span>
                        <span className="text-[10px] font-mono text-zinc-500 font-semibold">Prevalent</span>
                      </div>
                    )) || (
                      <div className="p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 text-xs text-zinc-600" style={{ backgroundColor: calmBg }}>
                        {currentEntity.languages.official.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-7 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display">
                    African Script Heritage & Phyla
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Orthographic Atlas</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5" style={{ backgroundColor: calmBg }}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Niger-Congo & Bantu Continuum</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">Pan-African</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    The world's largest language family by number of languages (over 1,500 idioms), renowned for noun class systems and tonal inflection.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5" style={{ backgroundColor: calmBg }}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Classical & Indigenous Writing Systems</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">Historical Scripts</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Featuring Ge'ez (Fidel), Tifinagh, N'Ko, Vai syllabary, Osmanya, and centuries of Ajami calligraphic scholarship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PILLAR 5: CULTURE (Material Culture, Heritage & Arts)
  // =========================================================================
  if (activePillar === 'culture') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Top 2 Cards: Side-by-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Header Ribbon Card */}
          <div
            className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between"
            style={{ backgroundColor: calmBg }}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                    WORLD HERITAGE & ARCHITECTURES
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{currentEntity.name} UNESCO Monuments</span>
                  </h3>
                </div>
              </div>

              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                World Heritage monuments, ancient architectural traditions, sacred cosmological sites, and contemporary creative arts across {currentEntity.name}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
                {heritageSites.length} UNESCO Sites Inscribed
              </span>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('heritage')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer ml-auto"
                >
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Heritage Sites Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Pan-African UNESCO World Heritage Database Link Card */}
          <div className="rounded-3xl border border-amber-200/80 dark:border-amber-900/60 bg-linear-to-br from-amber-50/70 via-white to-amber-50/40 dark:from-amber-950/30 dark:via-zinc-950 dark:to-zinc-900 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 border-b border-amber-200/60 dark:border-amber-800/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800/80 shrink-0">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400 block">
                      CONTINENTAL HERITAGE ARCHIVE
                    </span>
                    <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100 font-display">
                      UNESCO World Heritage Database
                    </h4>
                  </div>
                </div>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('heritage')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <span>Open Database</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Access, filter, and inspect all 145+ inscribed UNESCO World Heritage cultural, natural, and mixed sites across 54 African nations, complete with conservation statuses, geological formations, and tentative lists.
              </p>
            </div>

            <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between text-xs font-mono text-amber-700 dark:text-amber-300 font-semibold">
              <span>145+ UNESCO Sites Inscribed</span>
              <span className="text-[11px] text-zinc-400 font-normal">Cultural • Natural • Mixed</span>
            </div>
          </div>
        </div>

        {/* UNESCO Sites & Cultural Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heritageSites.length > 0 ? (
            heritageSites.map(site => (
              <div
                key={site.id}
                className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                      Inscribed {site.inscribedYear}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase capitalize">{site.category}</span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display leading-snug">
                    {site.name}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {site.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  <span>UNESCO World Heritage</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 text-center space-y-2">
              <Landmark className="w-8 h-8 mx-auto text-zinc-400" />
              <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">National Heritage Inventory</h4>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                {currentEntity.name} maintains a rich register of cultural monuments, intangible traditions, and tentative UNESCO properties.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // PILLAR 6: CLIMATE (Biomes, Climate & Ecological Resilience)
  // =========================================================================
  if (activePillar === 'climate') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Top 2 Cards: Side-by-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Header Ribbon Card */}
          <div
            className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between"
            style={{ backgroundColor: calmBg }}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                    ECOLOGICAL RESILIENCE & BIOMES
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                    <Trees className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{currentEntity.name} Bioclimatic Systems</span>
                  </h3>
                </div>
              </div>

              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Live atmospheric metrics, seasonal temperature/precipitation normals, transboundary conservation complexes, and carbon sequestration peatlands.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                {headerData?.climate?.baseTempC || 27}°C Mean Base
              </span>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                {currentEntity.region} Macro-Biome
              </span>
            </div>
          </div>

          {/* Climate & Ecological Infrastructure Card */}
          <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/60 bg-linear-to-br from-emerald-50/70 via-white to-emerald-50/40 dark:from-emerald-950/30 dark:via-zinc-950 dark:to-zinc-900 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 border-b border-emerald-200/60 dark:border-emerald-800/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/80 shrink-0">
                    <Trees className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 block">
                      TRANSBOUNDARY CONSERVATION
                    </span>
                    <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100 font-display">
                      Ecology & Biodiversity Corridors
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  IPCC / UNEP
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Continental biomes spanning Congo Basin carbon sinks, Sahelian Great Green Wall corridors, Guinean montane forests, and coastal mangrove preservation complexes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 text-xs">
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-emerald-200/70 dark:border-emerald-900/40 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">Carbon Sinks</span>
                <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">High-Density</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-emerald-200/70 dark:border-emerald-900/40 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">Live Sensor</span>
                <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Complete Climate & Live Weather Section */}
        <ClimateEcologySection
          entityId={currentEntity.id}
          countryName={currentEntity.name}
        />

        {/* Cross-Border Ecological Infrastructure */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <RegionalEcologySection region={currentEntity.region} />
        </div>
      </div>
    );
  }

  // =========================================================================
  // PILLAR 7: ECONOMY (Macroeconomics, Sovereignty & Trade)
  // ONLY on the "Economy" Thematic Pillar: 21 Entity Blocs Browser & AfCFTA
  // =========================================================================
  if (activePillar === 'economy') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Top 2 Cards: Side-by-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Header Ribbon Card */}
          <div
            className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between"
            style={{ backgroundColor: calmBg }}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                    MACROECONOMICS & 21 SOVEREIGN BLOCS
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{currentEntity.name} Economic Sovereignty</span>
                  </h3>
                </div>
              </div>

              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Multi-tier economic communities, customs unions, AfCFTA tariff liberalization schedules, trade transit corridors, and macro financial indicators.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                Primary Bloc: {initialBlocId}
              </span>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                AfCFTA Signatory
              </span>
            </div>
          </div>

          {/* AfCFTA & Sovereign Blocs Architecture Card */}
          <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/60 bg-linear-to-br from-emerald-50/70 via-white to-emerald-50/40 dark:from-emerald-950/30 dark:via-zinc-950 dark:to-zinc-900 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 border-b border-emerald-200/60 dark:border-emerald-800/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/80 shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 block">
                      AfCFTA FREE TRADE ARCHITECTURE
                    </span>
                    <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100 font-display">
                      Continental Customs & Blocs Matrix
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  AfCFTA / AU
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                90% tariff line phase-downs, Guided Trade Initiative protocols, Pan-African Payment and Settlement System (PAPSS), and One-Stop Border Posts.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 text-xs">
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-emerald-200/70 dark:border-emerald-900/40 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">21 Entity Blocs</span>
                <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">Integrated</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-emerald-200/70 dark:border-emerald-900/40 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">PAPSS Enabled</span>
                <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Regional AfCFTA Trade Corridors & OSBPs */}
        <RegionalAfcftaTradeSection
          region={currentEntity.region}
          onSelectCountry={onSelectCountry}
        />

        {/* 2. Full 21 Entity Blocs Browser & Comparator */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <EntityBlocsBrowser
            onSelectCountry={onSelectCountry}
            initialBlocId={initialBlocId}
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // PILLAR 8: FUTURE (Agenda 2063 & Future Horizons)
  // =========================================================================
  if (activePillar === 'future') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Top 2 Cards: Side-by-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Header Ribbon Card */}
          <div
            className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between"
            style={{ backgroundColor: calmBg }}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                    AGENDA 2063 & CONTINENTAL POWER POOLS
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>{currentEntity.name} Future Horizons</span>
                  </h3>
                </div>
              </div>

              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Cross-border high-voltage transmission interconnectors, subsea fiber-optic telecommunications, African Space Agency satellite deployments, and youth-led innovation hubs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
                AU Agenda 2063 Framework
              </span>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                Continental Flagship
              </span>
            </div>
          </div>

          {/* Continental Power Pools & Tech Infrastructure Card */}
          <div className="rounded-3xl border border-amber-200/80 dark:border-amber-900/60 bg-linear-to-br from-amber-50/70 via-white to-amber-50/40 dark:from-amber-950/30 dark:via-zinc-950 dark:to-zinc-900 p-6 md:p-7 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 border-b border-amber-200/60 dark:border-amber-800/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800/80 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400 block">
                      PAN-AFRICAN GRIDS & SPACE
                    </span>
                    <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100 font-display">
                      Interconnectors & Digital Backbone
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  AUDA-NEPAD
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Regional power pools (WAPP, EAPP, SAPP, CAPP, COMELEC), 2Africa/Equiano subsea fiber conduits, and AfSA satellite remote sensing earth observation networks.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/40 text-xs">
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-amber-200/70 dark:border-amber-900/40 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">Subsea Cable</span>
                <span className="font-bold font-mono text-amber-700 dark:text-amber-400">Multi-Tbps</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-amber-200/70 dark:border-amber-900/40 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">Regional Pool</span>
                <span className="font-bold font-mono text-amber-700 dark:text-amber-400">Intertied</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Innovation & Strategic Vectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500" />
                Digital Economy & Fintech
              </h4>
              <span className="text-[10px] font-mono text-zinc-400">ITU & GSMA</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Global-leading mobile money transaction volume, rapid fintech startup formation, and multi-terabit subsea fiber cable landings (2Africa & Equiano).
            </p>
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              High Broadband Penetration Velocity
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                <Satellite className="w-4 h-4 text-cyan-500" />
                Space & Remote Sensing
              </h4>
              <span className="text-[10px] font-mono text-zinc-400">African Space Agency</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Earth observation satellite constellations monitoring agricultural crop yields, aquifer depths, mineral geology, and climatic drought cycles.
            </p>
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
              AfSA Continental Space Policy
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Agenda 2063 Flagships
              </h4>
              <span className="text-[10px] font-mono text-zinc-400">African Union</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Fast-tracking the Single African Air Transport Market (SAATM), Continental Free Trade Area, and Pan-African High-Speed Rail corridors.
            </p>
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              The Africa We Want
            </div>
          </div>
        </div>

        {/* Regional Power Pools & Interconnected Grids */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <RegionalPowerPoolsSection region={currentEntity.region} />
        </div>
      </div>
    );
  }

  return null;
};
