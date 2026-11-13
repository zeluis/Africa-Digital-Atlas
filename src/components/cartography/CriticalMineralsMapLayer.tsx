import React, { useState, useMemo } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { 
  CRITICAL_MINERALS_REGISTRY, 
  CriticalMineralDeposit, 
  CountryMineralsProfile 
} from '../../data/criticalMineralsData';
import { 
  Zap, 
  Layers, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  Info, 
  Cpu, 
  BatteryCharging, 
  Factory, 
  Compass, 
  SlidersHorizontal 
} from 'lucide-react';

export interface SpatialMineralNode {
  id: string;
  countryCode: string;
  countryName: string;
  depositName: string;
  mineral: string;
  symbol: string;
  category: 'Battery Mineral' | 'Magnet & REE' | 'Industrial Metallurgy' | 'Clean Tech Catalyst';
  globalSharePct?: number;
  africanRank?: string;
  refiningStatus: 'Raw Ore Export' | 'Local Primary Smelting' | 'Downstream Processing Planned' | 'Domestic Value Addition';
  strategicApplication: string;
  // Normalized coordinates in native 5796 x 5867 SVG coordinate space
  svgX: number;
  svgY: number;
}

// Curated spatial coordinates for African critical mineral deposits within the native 5796 x 5867 map coordinate space
export const SPATIAL_MINERAL_NODES: SpatialMineralNode[] = [
  // DRC - Cobalt, Copper, Lithium
  {
    id: 'min-cod-co-1',
    countryCode: 'COD',
    countryName: 'Democratic Republic of the Congo',
    depositName: 'Kolwezi & Tenke Fungurume',
    mineral: 'Cobalt',
    symbol: 'Co',
    category: 'Battery Mineral',
    globalSharePct: 70,
    africanRank: '#1 in Africa & Global',
    refiningStatus: 'Local Primary Smelting',
    strategicApplication: 'NMC lithium-ion battery cathodes, aerospace superalloys',
    svgX: 3050,
    svgY: 3450
  },
  {
    id: 'min-cod-cu-1',
    countryCode: 'COD',
    countryName: 'Democratic Republic of the Congo',
    depositName: 'Kamoa-Kakula Copper Complex',
    mineral: 'Copper',
    symbol: 'Cu',
    category: 'Industrial Metallurgy',
    globalSharePct: 11,
    africanRank: '#1 in Africa',
    refiningStatus: 'Local Primary Smelting',
    strategicApplication: 'High-voltage electric grids, EV wiring harnesses, wind generators',
    svgX: 3120,
    svgY: 3500
  },
  {
    id: 'min-cod-li-1',
    countryCode: 'COD',
    countryName: 'Democratic Republic of the Congo',
    depositName: 'Manono Lithium Deposit',
    mineral: 'Lithium',
    symbol: 'Li',
    category: 'Battery Mineral',
    africanRank: '#1 Potential Hard-Rock Deposit in Africa',
    refiningStatus: 'Downstream Processing Planned',
    strategicApplication: 'Lithium iron phosphate (LFP) and high-nickel EV battery cells',
    svgX: 3250,
    svgY: 3380
  },
  // South Africa - Platinum Group Metals, Manganese
  {
    id: 'min-zaf-pt-1',
    countryCode: 'ZAF',
    countryName: 'South Africa',
    depositName: 'Bushveld Igneous Complex',
    mineral: 'Platinum Group Metals',
    symbol: 'Pt',
    category: 'Clean Tech Catalyst',
    globalSharePct: 72,
    africanRank: '#1 in Africa & Global',
    refiningStatus: 'Domestic Value Addition',
    strategicApplication: 'Proton-exchange membrane (PEM) hydrogen electrolyzers & fuel cells',
    svgX: 3260,
    svgY: 4850
  },
  {
    id: 'min-zaf-mn-1',
    countryCode: 'ZAF',
    countryName: 'South Africa',
    depositName: 'Kalahari Manganese Basin',
    mineral: 'Manganese',
    symbol: 'Mn',
    category: 'Battery Mineral',
    globalSharePct: 37,
    africanRank: '#1 in Africa & Global',
    refiningStatus: 'Domestic Value Addition',
    strategicApplication: 'LMFP battery chemistries, high-strength structural steel',
    svgX: 3080,
    svgY: 4920
  },
  // Guinea - Bauxite / Aluminum
  {
    id: 'min-gin-al-1',
    countryCode: 'GIN',
    countryName: 'Guinea',
    depositName: 'Boké & Kindia Bauxite Belt',
    mineral: 'Bauxite / Aluminum',
    symbol: 'Al',
    category: 'Industrial Metallurgy',
    globalSharePct: 24,
    africanRank: '#1 in Africa (#2 Global Reserves)',
    refiningStatus: 'Local Primary Smelting',
    strategicApplication: 'EV lightweighting chassis, solar panel frames, transmission cables',
    svgX: 1350,
    svgY: 2600
  },
  // Zimbabwe - Lithium
  {
    id: 'min-zwe-li-1',
    countryCode: 'ZWE',
    countryName: 'Zimbabwe',
    depositName: 'Bikita & Arcadia Lithium Mines',
    mineral: 'Lithium',
    symbol: 'Li',
    category: 'Battery Mineral',
    africanRank: '#1 Producing Lithium Nation in Africa',
    refiningStatus: 'Local Primary Smelting',
    strategicApplication: 'Spodumene concentrate for global battery precursor converters',
    svgX: 3480,
    svgY: 4320
  },
  // Mozambique - Graphite
  {
    id: 'min-moz-c-1',
    countryCode: 'MOZ',
    countryName: 'Mozambique',
    depositName: 'Balama Graphite District (Cabo Delgado)',
    mineral: 'Natural Graphite',
    symbol: 'C',
    category: 'Battery Mineral',
    globalSharePct: 10,
    africanRank: '#1 in Africa',
    refiningStatus: 'Raw Ore Export',
    strategicApplication: 'Synthetic and natural spherical graphite for EV battery anodes',
    svgX: 3820,
    svgY: 4100
  },
  // Zambia - Copper
  {
    id: 'min-zmb-cu-1',
    countryCode: 'ZMB',
    countryName: 'Zambia',
    depositName: 'Zambian Copperbelt (Kitwe & Ndola)',
    mineral: 'Copper',
    symbol: 'Cu',
    category: 'Industrial Metallurgy',
    africanRank: '#2 in Africa',
    refiningStatus: 'Local Primary Smelting',
    strategicApplication: 'Continental renewable power interconnection, transformer windings',
    svgX: 3260,
    svgY: 3850
  },
  // Morocco - Cobalt & Phosphate Catalysts
  {
    id: 'min-mar-co-1',
    countryCode: 'MAR',
    countryName: 'Morocco',
    depositName: 'Bou Azzer High-Purity Cobalt Mine',
    mineral: 'Cobalt',
    symbol: 'Co',
    category: 'Battery Mineral',
    africanRank: '#2 Cobalt Producer in Africa',
    refiningStatus: 'Domestic Value Addition',
    strategicApplication: 'Direct cathode precursor manufacturing for European EV corridor',
    svgX: 1720,
    svgY: 1320
  },
  // Madagascar - Nickel & Graphite
  {
    id: 'min-mdg-ni-1',
    countryCode: 'MDG',
    countryName: 'Madagascar',
    depositName: 'Ambatovy Nickel-Cobalt Mine',
    mineral: 'Nickel',
    symbol: 'Ni',
    category: 'Battery Mineral',
    africanRank: 'Top 5 in Africa',
    refiningStatus: 'Local Primary Smelting',
    strategicApplication: 'Class-1 battery-grade nickel briquettes for high-energy EV batteries',
    svgX: 4380,
    svgY: 4180
  },
  // Namibia - Uranium & Rare Earths
  {
    id: 'min-nam-u-1',
    countryCode: 'NAM',
    countryName: 'Namibia',
    depositName: 'Rössing & Husab Uranium District',
    mineral: 'Uranium',
    symbol: 'U',
    category: 'Clean Tech Catalyst',
    globalSharePct: 11,
    africanRank: '#1 in Africa (#3 Global)',
    refiningStatus: 'Local Primary Smelting',
    strategicApplication: 'Zero-carbon baseload nuclear energy fuel cycles',
    svgX: 2750,
    svgY: 4620
  }
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; ring: string; fill: string }> = {
  'Battery Mineral': {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-700 dark:text-emerald-300',
    ring: 'border-emerald-500/40',
    fill: '#10b981'
  },
  'Clean Tech Catalyst': {
    bg: 'bg-blue-500/15',
    text: 'text-blue-700 dark:text-blue-300',
    ring: 'border-blue-500/40',
    fill: '#3b82f6'
  },
  'Industrial Metallurgy': {
    bg: 'bg-amber-500/15',
    text: 'text-amber-700 dark:text-amber-300',
    ring: 'border-amber-500/40',
    fill: '#f59e0b'
  },
  'Magnet & REE': {
    bg: 'bg-purple-500/15',
    text: 'text-purple-700 dark:text-purple-300',
    ring: 'border-purple-500/40',
    fill: '#8b5cf6'
  }
};

export const REFINING_BADGE_STYLE: Record<string, { label: string; text: string; bg: string }> = {
  'Raw Ore Export': {
    label: 'Raw Ore Export',
    text: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-500/10'
  },
  'Local Primary Smelting': {
    label: 'Primary Smelting',
    text: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-500/10'
  },
  'Downstream Processing Planned': {
    label: 'Downstream Planned',
    text: 'text-purple-700 dark:text-purple-400',
    bg: 'bg-purple-500/10'
  },
  'Domestic Value Addition': {
    label: 'Domestic Beneficiation',
    text: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-500/10'
  }
};

interface CriticalMineralsMapLayerProps {
  onSelectCountry?: (countryCode: string) => void;
  activeMineralId?: string | null;
  onSelectMineral?: (node: SpatialMineralNode | null) => void;
  categoryFilter?: string;
  refiningFilter?: string;
}

export const CriticalMineralsMapLayer: React.FC<CriticalMineralsMapLayerProps> = ({
  onSelectCountry,
  activeMineralId,
  onSelectMineral,
  categoryFilter = 'All',
  refiningFilter = 'All'
}) => {
  const filteredNodes = useMemo(() => {
    return SPATIAL_MINERAL_NODES.filter(node => {
      const matchCat = categoryFilter === 'All' || node.category === categoryFilter;
      const matchRef = refiningFilter === 'All' || node.refiningStatus === refiningFilter;
      return matchCat && matchRef;
    });
  }, [categoryFilter, refiningFilter]);

  const handleNodeClick = (node: SpatialMineralNode, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectMineral) onSelectMineral(node);
  };

  return (
    <g id="critical-minerals-spatial-layer" className="pointer-events-auto">
      {filteredNodes.map(node => {
        const colors = CATEGORY_COLORS[node.category] || CATEGORY_COLORS['Battery Mineral'];
        const isSelected = activeMineralId === node.id;
        const nodeRadius = isSelected ? 46 : 34;

        return (
          <g
            key={node.id}
            transform={`translate(${node.svgX}, ${node.svgY})`}
            className="cursor-pointer transition-transform duration-150 hover:scale-125 focus:outline-none"
            onClick={(e) => handleNodeClick(node, e)}
            role="button"
            tabIndex={0}
            aria-label={`${node.mineral} deposit in ${node.countryName}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNodeClick(node, e as unknown as React.MouseEvent);
              }
            }}
          >
            {/* Halo pulse when selected */}
            {isSelected && (
              <circle
                cx={0}
                cy={0}
                r={nodeRadius + 22}
                fill={colors.fill}
                fillOpacity={0.25}
                className="animate-pulse"
              />
            )}

            {/* Base White Background Circle */}
            <circle
              cx={0}
              cy={0}
              r={nodeRadius}
              fill="#ffffff"
              stroke={colors.fill}
              strokeWidth={isSelected ? 6 : 4}
              filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.35))"
            />

            {/* Chemical Color Fill Circle */}
            <circle
              cx={0}
              cy={0}
              r={nodeRadius - 7}
              fill={colors.fill}
            />

            {/* Chemical Symbol */}
            <text
              x={0}
              y={node.symbol.length > 1 ? 6 : 7}
              textAnchor="middle"
              fill="#ffffff"
              fontSize={node.symbol.length > 1 ? 21 : 25}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="800"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {node.symbol}
            </text>

            {/* Name Kicker */}
            <text
              x={0}
              y={nodeRadius + 20}
              textAnchor="middle"
              fill="#18181b"
              stroke="#ffffff"
              strokeWidth={3}
              paintOrder="stroke fill"
              fontSize={15}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="700"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {node.mineral}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export interface CriticalMineralsInspectorProps {
  activeNode: SpatialMineralNode | null;
  onClose: () => void;
  onSelectCountry?: (countryCode: string) => void;
}

export const CriticalMineralsInspector: React.FC<CriticalMineralsInspectorProps> = ({
  activeNode,
  onClose,
  onSelectCountry
}) => {
  if (!activeNode) return null;

  const colors = CATEGORY_COLORS[activeNode.category] || CATEGORY_COLORS['Battery Mineral'];
  const statusDef = REFINING_BADGE_STYLE[activeNode.refiningStatus] || REFINING_BADGE_STYLE['Raw Ore Export'];
  const fullProfile = CRITICAL_MINERALS_REGISTRY[activeNode.countryCode];

  return (
    <m.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200/90 dark:border-stone-800/90 p-5 shadow-2xl space-y-4"
      aria-label="Critical Mineral Deposit Dossier"
    >
      <div className="flex items-start justify-between gap-3 border-b border-stone-200/80 dark:border-stone-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-sm"
            style={{ backgroundColor: colors.fill }}
          >
            {activeNode.symbol}
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {activeNode.category}
            </div>
            <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-display leading-tight">
              {activeNode.mineral}
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Close deposit dossier"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400">Deposit & Mining District</div>
          <div className="font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
            {activeNode.depositName}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            {activeNode.countryName} ({activeNode.countryCode})
          </div>
        </div>

        {/* Global / African Share */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/80">
            <div className="text-[10px] text-stone-500">Global Supply Share</div>
            <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5 font-mono">
              {activeNode.globalSharePct ? `${activeNode.globalSharePct}%` : 'Strategic Reserve'}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/80">
            <div className="text-[10px] text-stone-500">Continental Rank</div>
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {activeNode.africanRank || 'Top Continental Producer'}
            </div>
          </div>
        </div>

        {/* Value Addition & Beneficiation Status */}
        <div className="pt-1">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mb-1">
            Downstream Beneficiation Status
          </div>
          <div className={`inline-block px-2.5 py-1 rounded-lg font-medium text-[11px] ${statusDef.bg} ${statusDef.text}`}>
            {statusDef.label}
          </div>
        </div>

        {/* Strategic Application */}
        <div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mb-0.5">
            Clean Tech & Energy Transition Application
          </div>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
            {activeNode.strategicApplication}
          </p>
        </div>

        {fullProfile?.refiningAmbition && (
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/70">
            <div className="text-[10px] font-mono text-stone-500 uppercase">National Value Addition Policy</div>
            <p className="text-[11px] text-stone-700 dark:text-stone-300 mt-0.5 leading-snug">
              {fullProfile.refiningAmbition}
            </p>
          </div>
        )}
      </div>

      {onSelectCountry && (
        <button
          type="button"
          onClick={() => onSelectCountry(activeNode.countryCode)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-xs transition-colors cursor-pointer"
        >
          <span>Open {activeNode.countryName} Sovereign Dossier</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      )}
    </m.aside>
  );
};
