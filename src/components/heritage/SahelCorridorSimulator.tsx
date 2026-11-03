import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Trees, 
  Droplets, 
  Sun, 
  Wind, 
  Compass, 
  ShieldCheck, 
  Info, 
  Layers, 
  Activity, 
  MapPin, 
  RotateCcw, 
  SlidersHorizontal 
} from 'lucide-react';

export interface SahelStation {
  id: string;
  name: string;
  country: string;
  iso3: string;
  kmPosition: number; // 0 to 8000 km
  annualRainfallMm: number;
  rainySeasonMonths: string;
  ndviBaseline: number;
  restorationTargetHa: number;
  restoredHaProgress: number;
  aquiferSystem: string;
  keystoneSpecies: string[];
  vulnerabilityFactor: 'Severe Aridity & Sand Encroachment' | 'Rainfall Variability & Agricultural Stress' | 'High Transhumance Pressure' | 'Erosion & Soil Crust Degradation';
  notes: string;
}

export const SAHEL_CORRIDOR_STATIONS: SahelStation[] = [
  {
    id: 'st-senegal',
    name: 'Ferlo Silvopastoral Zone',
    country: 'Senegal',
    iso3: 'SEN',
    kmPosition: 350,
    annualRainfallMm: 380,
    rainySeasonMonths: 'July – September',
    ndviBaseline: 0.28,
    restorationTargetHa: 800000,
    restoredHaProgress: 520000,
    aquiferSystem: 'Senegalo-Mauritanian Deep Basin',
    keystoneSpecies: ['Acacia senegal (Gum Arabic)', 'Balanites aegyptiaca (Desert Date)', 'Acacia tortilis'],
    vulnerabilityFactor: 'Rainfall Variability & Agricultural Stress',
    notes: 'Western anchor of the Great Green Wall with mature community gum arabic plantations and livestock silvopastoral corridors.'
  },
  {
    id: 'st-mauritania',
    name: 'Trarza & Brakna Dunes',
    country: 'Mauritania',
    iso3: 'MRT',
    kmPosition: 950,
    annualRainfallMm: 180,
    rainySeasonMonths: 'August – September',
    ndviBaseline: 0.16,
    restorationTargetHa: 1200000,
    restoredHaProgress: 390000,
    aquiferSystem: 'Trarza Coastal Sandstone Aquifer',
    keystoneSpecies: ['Prosopis cineraria', 'Acacia raddiana', 'Aristida pungens'],
    vulnerabilityFactor: 'Severe Aridity & Sand Encroachment',
    notes: 'Intense active dune stabilization belt protecting trans-national paved trade corridors from sand encroachment.'
  },
  {
    id: 'st-mali',
    name: 'Mopti & Inland Niger Delta Border',
    country: 'Mali',
    iso3: 'MLI',
    kmPosition: 1950,
    annualRainfallMm: 450,
    rainySeasonMonths: 'June – October',
    ndviBaseline: 0.35,
    restorationTargetHa: 1500000,
    restoredHaProgress: 680000,
    aquiferSystem: 'Taoudeni Sedimentary Basin',
    keystoneSpecies: ['Faidherbia albida (Gao Tree)', 'Adansonia digitata (Baobab)', 'Acacia seyal'],
    vulnerabilityFactor: 'High Transhumance Pressure',
    notes: 'Critical intersection of pastoral migration routes with the seasonal flooding of the Inland Niger Delta.'
  },
  {
    id: 'st-burkina',
    name: 'Yatenga & Dori Plateau',
    country: 'Burkina Faso',
    iso3: 'BFA',
    kmPosition: 2600,
    annualRainfallMm: 510,
    rainySeasonMonths: 'May – September',
    ndviBaseline: 0.34,
    restorationTargetHa: 1000000,
    restoredHaProgress: 740000,
    aquiferSystem: 'Liptako Crystalline Basement Aquifer',
    keystoneSpecies: ['Piliostigma reticulatum', 'Faidherbia albida', 'Ziziphus mauritiana'],
    vulnerabilityFactor: 'Erosion & Soil Crust Degradation',
    notes: 'Global birthplace of the indigenous Zaï planting pit technique and stone bunds pioneered by Yacouba Sawadogo.'
  },
  {
    id: 'st-niger',
    name: 'Tahoua & Maradi Agroforests',
    country: 'Niger',
    iso3: 'NER',
    kmPosition: 3500,
    annualRainfallMm: 360,
    rainySeasonMonths: 'July – September',
    ndviBaseline: 0.26,
    restorationTargetHa: 2000000,
    restoredHaProgress: 1400000,
    aquiferSystem: 'Iullemeden Continental Intercalaire',
    keystoneSpecies: ['Faidherbia albida', 'Acacia nilotica', 'Combretum glutinosum'],
    vulnerabilityFactor: 'Severe Aridity & Sand Encroachment',
    notes: 'World-renowned Farmer Managed Natural Regeneration (FMNR) scaling over 5 million hectares of restored parklands.'
  },
  {
    id: 'st-nigeria',
    name: 'Kano & Jigawa Shelterbelt',
    country: 'Nigeria',
    iso3: 'NGA',
    kmPosition: 4100,
    annualRainfallMm: 580,
    rainySeasonMonths: 'June – September',
    ndviBaseline: 0.42,
    restorationTargetHa: 1800000,
    restoredHaProgress: 980000,
    aquiferSystem: 'Chad Basin Upper Aquifer',
    keystoneSpecies: ['Eucalyptus camaldulensis', 'Azadirachta indica (Neem)', 'Acacia senegal'],
    vulnerabilityFactor: 'Rainfall Variability & Agricultural Stress',
    notes: 'Dense network of multi-row windbreaks protecting rainfed sorghum and groundnut agricultural heartlands.'
  },
  {
    id: 'st-chad',
    name: 'Kanem & Batha Lake Basin',
    country: 'Chad',
    iso3: 'TCD',
    kmPosition: 5050,
    annualRainfallMm: 290,
    rainySeasonMonths: 'July – September',
    ndviBaseline: 0.22,
    restorationTargetHa: 1400000,
    restoredHaProgress: 460000,
    aquiferSystem: 'Lake Chad Regional Aquifer System',
    keystoneSpecies: ['Acacia senegal', 'Commiphora africana', 'Leptadenia pyrotechnica'],
    vulnerabilityFactor: 'High Transhumance Pressure',
    notes: 'Transitional pastoral zone buffering the retreating shores of Lake Chad and arid Sahel rangelands.'
  },
  {
    id: 'st-sudan',
    name: 'North Kordofan & Blue Nile Belt',
    country: 'Sudan',
    iso3: 'SDN',
    kmPosition: 6200,
    annualRainfallMm: 340,
    rainySeasonMonths: 'June – October',
    ndviBaseline: 0.25,
    restorationTargetHa: 2200000,
    restoredHaProgress: 810000,
    aquiferSystem: 'Nubian Sandstone Aquifer System',
    keystoneSpecies: ['Acacia senegal (Hashab)', 'Acacia seyal (Talh)', 'Boscia senegalensis'],
    vulnerabilityFactor: 'Rainfall Variability & Agricultural Stress',
    notes: 'The historic "Gum Arabic Belt" responsible for over 60% of the international supply of pharmaceutical-grade gum arabic.'
  },
  {
    id: 'st-ethiopia',
    name: 'Tigray Highlands & Afar Escarpment',
    country: 'Ethiopia',
    iso3: 'ETH',
    kmPosition: 7400,
    annualRainfallMm: 460,
    rainySeasonMonths: 'June – September (Kiremt)',
    ndviBaseline: 0.38,
    restorationTargetHa: 1600000,
    restoredHaProgress: 1100000,
    aquiferSystem: 'East African Rift Volcanic Complex',
    keystoneSpecies: ['Olea europaea subsp. cuspidata', 'Juniperus procera', 'Acacia etbaica'],
    vulnerabilityFactor: 'Erosion & Soil Crust Degradation',
    notes: 'Massive terracing and watershed enclosures transforming eroded basaltic ravines into recharged groundwater springs.'
  },
  {
    id: 'st-djibouti',
    name: 'Gulf of Tadjoura Eastern Terminus',
    country: 'Djibouti',
    iso3: 'DJI',
    kmPosition: 7950,
    annualRainfallMm: 150,
    rainySeasonMonths: 'October – February (Sporadic)',
    ndviBaseline: 0.14,
    restorationTargetHa: 400000,
    restoredHaProgress: 150000,
    aquiferSystem: 'Coastal Alluvial Aquifers',
    keystoneSpecies: ['Conocarpus lancifolius', 'Avicennia marina (Mangrove)', 'Hyphaene thebaica'],
    vulnerabilityFactor: 'Severe Aridity & Sand Encroachment',
    notes: 'Eastern terminus connecting the Sahelian green corridor to the Red Sea coastal mangrove ecosystems.'
  }
];

export const SahelCorridorSimulator: React.FC = () => {
  const [activeStationIndex, setActiveStationIndex] = useState<number>(3); // Default Burkina Faso
  const [activeSeason, setActiveSeason] = useState<'monsoon' | 'harmattan'>('monsoon');

  const currentStation = SAHEL_CORRIDOR_STATIONS[activeStationIndex];

  // Total restored progress across the 11 stations
  const totalRestored = useMemo(() => {
    return SAHEL_CORRIDOR_STATIONS.reduce((acc, s) => acc + s.restoredHaProgress, 0);
  }, []);

  const totalTarget = useMemo(() => {
    return SAHEL_CORRIDOR_STATIONS.reduce((acc, s) => acc + s.restorationTargetHa, 0);
  }, []);

  const totalCarbonSequestrationMt = useMemo(() => {
    // Standard UN / FAO factor: ~2.5 metric tons CO2e sequestered per restored hectare per year
    return Math.round((totalRestored * 2.5) / 1e6);
  }, [totalRestored]);

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-sm space-y-6">
      {/* 1. Header Hero Plaque */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Trees className="w-3.5 h-3.5" />
            <span>African Union Great Green Wall • 8,000 km Ecological Belt</span>
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
            Trans-Sahelian Agroforestry &amp; Carbon Corridor Simulator
          </h3>
          <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Simulating seasonal ITCZ monsoon dynamics, native agroforestry species, and carbon drawdown across 11 AU member nations from the Atlantic to the Red Sea.
          </p>
        </div>

        {/* Season Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setActiveSeason('monsoon')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSeason === 'monsoon'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Monsoon (ITCZ North)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSeason('harmattan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSeason === 'harmattan'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Harmattan (Dry Season)</span>
          </button>
        </div>
      </div>

      {/* 2. Top Continental Corridor Progress Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
          <div className="text-[11px] font-mono uppercase text-zinc-500">Total Belt Restored</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {(totalRestored / 1e6).toFixed(2)}M ha
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            of {(totalTarget / 1e6).toFixed(1)}M ha regional target
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
          <div className="text-[11px] font-mono uppercase text-zinc-500">Carbon Drawdown</div>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono mt-1">
            ~{totalCarbonSequestrationMt} Mt CO₂e/yr
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Sequestration via tree biomass &amp; soil
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
          <div className="text-[11px] font-mono uppercase text-zinc-500">Trans-Continental Span</div>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono mt-1">
            8,000 km
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Atlantic Ocean to Red Sea
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
          <div className="text-[11px] font-mono uppercase text-zinc-500">ITCZ Seasonal Shift</div>
          <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            {activeSeason === 'monsoon' ? '15° N – 20° N (Humid)' : '5° N – 10° N (Harmattan)'}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {activeSeason === 'monsoon' ? 'Seasonal precipitation active' : 'Northeast trade winds dominant'}
          </div>
        </div>
      </div>

      {/* 3. Interactive Trans-Continental Corridor Track */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500">Dakar, Senegal (0 km)</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            Selected Station: {currentStation.name} ({currentStation.country} • {currentStation.kmPosition} km)
          </span>
          <span className="text-zinc-500">Djibouti (8,000 km)</span>
        </div>

        {/* Stations Navigation Bar */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          {SAHEL_CORRIDOR_STATIONS.map((station, idx) => {
            const isSelected = activeStationIndex === idx;
            return (
              <button
                key={station.id}
                type="button"
                onClick={() => setActiveStationIndex(idx)}
                className={`py-2 px-1.5 rounded-xl text-center text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs border border-zinc-200 dark:border-zinc-700'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <div className="font-mono text-[10px] text-zinc-400 font-bold">{station.iso3}</div>
                <div className="truncate text-[11px] mt-0.5">{station.country}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Station Deep-Dive Dossier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/80">
        <div className="space-y-4">
          <div>
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Corridor Ecological Station #{activeStationIndex + 1}
            </div>
            <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-display mt-0.5">
              {currentStation.name}
            </h4>
            <div className="text-xs text-zinc-500 mt-0.5">
              {currentStation.country} ({currentStation.iso3}) • {currentStation.kmPosition.toLocaleString()} km along belt
            </div>
          </div>

          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {currentStation.notes}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-700/80">
              <span className="text-zinc-500 text-[11px]">Mean Annual Isohyet:</span>
              <div className="font-mono font-bold text-base text-zinc-900 dark:text-zinc-100 mt-0.5">
                {currentStation.annualRainfallMm} mm/yr
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">{currentStation.rainySeasonMonths}</div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-700/80">
              <span className="text-zinc-500 text-[11px]">Vegetation Index (NDVI):</span>
              <div className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400 mt-0.5">
                {activeSeason === 'monsoon' 
                  ? (currentStation.ndviBaseline * 1.35).toFixed(2) 
                  : (currentStation.ndviBaseline * 0.85).toFixed(2)}
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                {activeSeason === 'monsoon' ? 'Post-rain flush' : 'Dry season dormancy'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-700/80 text-xs">
            <span className="text-[11px] text-zinc-500 font-mono uppercase">Primary Ground Aquifer</span>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {currentStation.aquiferSystem}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Restoration Progress Meter */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Station Restoration Milestone</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((currentStation.restoredHaProgress / currentStation.restorationTargetHa) * 100)}%
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.round((currentStation.restoredHaProgress / currentStation.restorationTargetHa) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
              <span>{currentStation.restoredHaProgress.toLocaleString()} ha restored</span>
              <span>Target: {currentStation.restorationTargetHa.toLocaleString()} ha</span>
            </div>
          </div>

          {/* Keystone Agroforestry Species */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
            <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Trees className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Native Drought-Resistant Agroforestry Species</span>
            </div>
            <div className="space-y-1.5 pt-1">
              {currentStation.keystoneSpecies.map(sp => (
                <div key={sp} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{sp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vulnerability Factor */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="font-mono text-[10px] uppercase text-amber-700 dark:text-amber-400 font-bold">
              Critical Ecological Stress Factor
            </div>
            <div className="font-semibold text-amber-900 dark:text-amber-200 mt-0.5">
              {currentStation.vulnerabilityFactor}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
