import React, { useState } from 'react';
import { 
  TreeDeciduous, 
  TrendingUp, 
  Globe2, 
  Layers, 
  MousePointerClick,
  Sparkles,
  Search,
  Maximize2
} from 'lucide-react';
import { AfricaUnLogo } from '../AfricaUnLogo';

interface InteractiveFeatureSpotlightProps {
  stage: 'history' | 'economy' | 'future';
  onQuickAction?: (actionId: string) => void;
}

export const InteractiveFeatureSpotlight: React.FC<InteractiveFeatureSpotlightProps> = ({
  stage,
  onQuickAction
}) => {
  // Stage 1 interactive state: Ethnic group preview
  const [selectedEthnicGroup, setSelectedEthnicGroup] = useState<string>('yoruba');
  // Stage 2 interactive state: Indicator preview
  const [activeIndicator, setActiveIndicator] = useState<'gdp' | 'energy' | 'youth'>('gdp');
  // Stage 3 interactive state: Regional preview
  const [highlightedZone, setHighlightedZone] = useState<string>('Eastern Africa');

  const ethnicDetails: Record<string, { name: string; region: string; family: string; diaspora: string }> = {
    yoruba: {
      name: 'Yorùbá',
      region: 'Western Africa (Oyo, Benin, Nigeria)',
      family: 'Niger-Congo (Defoid)',
      diaspora: 'Bahia (Candomblé), Cuba (Santería / Lucumí), Trinidad'
    },
    akan: {
      name: 'Akan / Ashanti',
      region: 'Gold Coast (Ghana, Ivory Coast)',
      family: 'Niger-Congo (Kwa)',
      diaspora: 'Jamaica (Coromantee), Suriname (Maroon nations)'
    },
    kongo: {
      name: 'Bakongo',
      region: 'Central Africa (Kongo Kingdom, Angola, DRC)',
      family: 'Bantu (Kikongo)',
      diaspora: 'Haiti (Petwo rites), Brazil (Capoeira Angola), Cuba (Palo)'
    },
    igbo: {
      name: 'Igbo',
      region: 'Bight of Biafra (Southeastern Nigeria)',
      family: 'Niger-Congo (Igboid)',
      diaspora: 'Virginia, Maryland, Barbados, Jamaica'
    }
  };

  const indicatorStats = {
    gdp: {
      label: 'Combined Continental GDP',
      value: '$3.1 Trillion',
      change: '+4.2% YoY Projected (AfDB)',
      highlight: 'Driven by internal regional integration via AfCFTA ($3.4T collective market).'
    },
    energy: {
      label: 'Solar & Renewable Potential',
      value: '10 Terawatts',
      change: '60% of World’s Top Solar Irradiance',
      highlight: 'Morocco Noor complex, Kenya geothermal, and Inga Dam mega-hydropower.'
    },
    youth: {
      label: 'Youth Median Age',
      value: '19.7 Years',
      change: 'World’s Youngest Demographic',
      highlight: 'Projected to supply 1 in every 3 global workforce entrants by 2050.'
    }
  };

  const regionDetails: Record<string, { color: string; nations: number; pop: string; capitalNodes: string }> = {
    'Northern Africa': { color: '#2563EB', nations: 7, pop: '255 Million', capitalNodes: 'Cairo, Algiers, Casablanca' },
    'Western Africa': { color: '#16A34A', nations: 16, pop: '430 Million', capitalNodes: 'Lagos, Accra, Dakar, Abidjan' },
    'Central Africa': { color: '#C026D3', nations: 9, pop: '190 Million', capitalNodes: 'Kinshasa, Luanda, Yaoundé' },
    'Eastern Africa': { color: '#EAB308', nations: 18, pop: '475 Million', capitalNodes: 'Nairobi, Addis Ababa, Kigali' },
    'Southern Africa': { color: '#DC2626', nations: 5, pop: '70 Million', capitalNodes: 'Johannesburg, Gaborone, Windhoek' }
  };

  return (
    <div className="w-full rounded-2xl bg-stone-50/80 border border-stone-200 p-3.5 sm:p-4 backdrop-blur-md space-y-3 shadow-xs">
      {/* Header with gentle interactive badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span className="text-xs font-mono font-medium tracking-wide uppercase text-stone-700">
            {stage === 'history' && 'Interactive Sample • Ethnolinguistic Lineage'}
            {stage === 'economy' && 'Interactive Sample • Multilateral Indicator Switch'}
            {stage === 'future' && 'Interactive Sample • UN GeoScheme Regional Nodes'}
          </span>
        </div>
        <span className="text-[11px] text-stone-500 flex items-center gap-1 font-mono">
          <MousePointerClick className="w-3 h-3 text-stone-400" />
          <span>Click to explore</span>
        </span>
      </div>

      {/* STAGE 1: ETHNIC EXPLORER MINI-PREVIEW */}
      {stage === 'history' && (
        <div className="space-y-3">
          {/* Ethnic Group Selection Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {Object.keys(ethnicDetails).map((key) => {
              const item = ethnicDetails[key];
              const isSelected = selectedEthnicGroup === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedEthnicGroup(key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Active Ethnic Node Details Card */}
          {ethnicDetails[selectedEthnicGroup] && (
            <div className="p-3 rounded-xl bg-white border border-amber-200 text-xs space-y-1.5 animate-in fade-in duration-150 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-stone-900">
                  {ethnicDetails[selectedEthnicGroup].name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                  {ethnicDetails[selectedEthnicGroup].family}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600 pt-1 text-[11px]">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-mono">Homeland:</span>
                  <span className="font-medium text-stone-800">{ethnicDetails[selectedEthnicGroup].region}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-mono">Transatlantic Presence:</span>
                  <span className="text-amber-800 font-medium">{ethnicDetails[selectedEthnicGroup].diaspora}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 2: ECONOMY / INDICATOR MINI-PREVIEW */}
      {stage === 'economy' && (
        <div className="space-y-3">
          {/* Indicator Pills */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveIndicator('gdp')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                activeIndicator === 'gdp'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              GDP ($3.1T)
            </button>
            <button
              type="button"
              onClick={() => setActiveIndicator('energy')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                activeIndicator === 'energy'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              Renewables (10 TW)
            </button>
            <button
              type="button"
              onClick={() => setActiveIndicator('youth')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                activeIndicator === 'youth'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              Youth Demographic (19.7y)
            </button>
          </div>

          {/* Active Indicator Card */}
          <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs space-y-1 animate-in fade-in duration-150 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-500 font-mono text-[11px]">
                {indicatorStats[activeIndicator].label}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                {indicatorStats[activeIndicator].change}
              </span>
            </div>
            <div className="font-serif font-black text-lg text-stone-900">
              {indicatorStats[activeIndicator].value}
            </div>
            <p className="text-[11px] text-stone-600 font-normal pt-0.5">
              {indicatorStats[activeIndicator].highlight}
            </p>
          </div>
        </div>
      )}

      {/* STAGE 3: UN GEOSCHEME REGIONS MINI-PREVIEW */}
      {stage === 'future' && (
        <div className="space-y-3">
          {/* 5 Macro-Region Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {Object.keys(regionDetails).map((reg) => {
              const isSelected = highlightedZone === reg;
              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setHighlightedZone(reg)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-100 text-indigo-900 border-indigo-300 shadow-xs'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: regionDetails[reg].color }} />
                  <span>{reg.replace(' Africa', '')}</span>
                </button>
              );
            })}
          </div>

          {/* Active Region Highlights */}
          <div className="p-3 rounded-xl bg-white border border-indigo-200 text-xs space-y-1.5 animate-in fade-in duration-150 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: regionDetails[highlightedZone].color }} />
                <span className="font-serif font-bold text-sm text-stone-900">
                  {highlightedZone}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">
                {regionDetails[highlightedZone].nations} Sovereign States
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-600 pt-0.5">
              <span>Population: <strong className="text-stone-900 font-semibold">{regionDetails[highlightedZone].pop}</strong></span>
              <span className="text-stone-500">Key Nodes: {regionDetails[highlightedZone].capitalNodes}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
