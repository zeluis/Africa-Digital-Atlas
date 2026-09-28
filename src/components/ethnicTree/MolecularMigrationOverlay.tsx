import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dna, Compass, Activity, MapPin, Calendar, Layers, X, Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { VBW, VBH } from '../../data/africaliaMasterTreeData';

export interface MolecularDivergenceNode {
  id: string;
  haplogroup: string;
  name: string;
  timeframe: string;
  region: string;
  coords: { x: number; y: number };
  description: string;
  significance: string;
  downstreamBranches: string[];
}

export const MOLECULAR_DIVERGENCE_NODES: MolecularDivergenceNode[] = [
  {
    id: 'h1-l0-l1',
    haplogroup: 'Haplogroup L0 & L1 (Mitochondrial Eve)',
    name: 'East-Central African Ancestral Roots',
    timeframe: '~150,000–200,000 Years BP',
    region: 'Eastern & Central Africa (Great Rift Valley & Congo Basin)',
    coords: { x: 2214, y: 2227 },
    description: 'The deepest rooting branches of human mitochondrial DNA (mtDNA), representing the earliest maternal divergences among Homo sapiens populations.',
    significance: 'Establishes the genetic baseline for all modern human lineages worldwide, with deepest diversity concentrated in Khoisan and Pygmy populations.',
    downstreamBranches: ['L0a (Southern/Eastern Africa)', 'L1c (Central African Rainforest)', 'L2 (West Africa expansion)', 'L3 (Out-of-Africa & Macro-haplogroups M & N)']
  },
  {
    id: 'h2-l2-west',
    haplogroup: 'Haplogroup L2 & E1b1a (Y-DNA)',
    name: 'West African Niger-Congo Expansion Node',
    timeframe: '~15,000–5,000 Years BP',
    region: 'West African Forest & Savannah Borderlands',
    coords: { x: 2110, y: 2085 },
    description: 'Major genetic divergence associated with the agricultural intensification and demographic expansion of Niger-Congo speaking populations.',
    significance: 'Correlates directly with the Bantu Expansion vector and the domestication of West African yam and pearl millet.',
    downstreamBranches: ['E-M2 (E1b1a1 - predominant Y-DNA lineage across Sub-Saharan & Afro-descendant populations)', 'L2a1 (Western & Central African maternal lines)']
  },
  {
    id: 'h3-bantu-stream',
    haplogroup: 'Bantu Expansion Genetic Wave',
    name: 'Central-to-Southern Rainforest & Savannah Corridor',
    timeframe: '~4,000–1,500 Years BP',
    region: 'Congo Basin to Southern Africa & East African Coast',
    coords: { x: 2011, y: 2397 },
    description: 'The sweeping demographic and linguistic dispersal originating from the Nigeria-Cameroon borderlands into the Congo Basin, East African coast, and South Africa.',
    significance: 'Unified the linguistic, iron-working, and agricultural profile of southern and central Africa.',
    downstreamBranches: ['Bantu-speaking agriculturalist lineages', 'Admixture pulses with indigenous hunter-gatherer populations (Batwa, San)']
  },
  {
    id: 'h4-trans-saharan',
    haplogroup: 'Trans-Saharan & Afroasiatic Node',
    name: 'Sahelian & Horn of Africa Gene Flow',
    timeframe: '~10,000–3,000 Years BP',
    region: 'Sahara, Sahel & Horn of Africa',
    coords: { x: 2420, y: 1860 },
    description: 'Ancient bi-directional gene flow connecting North Africa, the Nile Valley, the Horn, and West African Sahelian trade networks.',
    significance: 'Reflected in Afroasiatic and Nilo-Saharan linguistic distributions and pastoralist genetic adaptations.',
    downstreamBranches: ['E-M78 (East African & North African lineages)', 'E-V38 (Pan-African savannah lineage)']
  },
  {
    id: 'h5-atlantic-diaspora',
    haplogroup: 'Transatlantic Genetic Legacy (TAST)',
    name: 'Macaronesian & Afro-Atlantic Diaspora Node',
    timeframe: '16th–19th Century CE',
    region: 'West/Central Africa to Cabo Verde, Brazil, Caribbean & Americas',
    coords: { x: 1850, y: 1750 },
    description: 'Molecular legacies preserved in American and Macaronesian populations, tracking the involuntary maritime dispersion of millions of African captives.',
    significance: 'Demonstrates deep genealogical connections between specific African ethnolinguistic groups and modern African diaspora communities.',
    downstreamBranches: ['Africalia-Cabo Verde transatlantic maritime crucible', 'Afro-descendant genomic lineages across the Americas']
  }
];

interface MolecularOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
  selectedNode: MolecularDivergenceNode | null;
  onSelectNode: (node: MolecularDivergenceNode | null) => void;
  zoomToCoords: (x: number, y: number) => void;
}

export const MolecularMigrationDrawer: React.FC<MolecularOverlayProps> = ({
  isVisible,
  onToggle,
  selectedNode,
  onSelectNode,
  zoomToCoords
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -30, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute left-6 top-20 z-40 w-80 md:w-96 bg-[#FAF6EE] dark:bg-[#1E1916] border border-[#E5DDD0] dark:border-[#38322B] rounded-3xl shadow-2xl p-4 flex flex-col gap-3.5 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E5DDD0] dark:border-[#38322B]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#E67E48]/15 text-[#B8571A] dark:text-[#FFA573]">
                <Dna className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B241E] dark:text-[#F5EFE6]">
                  Molecular Anthropology & Migration
                </h3>
                <p className="text-[10px] text-[#7D6B5A] dark:text-[#B5A492]">
                  Haplogroup divergence & ancestral vector paths
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#7D6B5A] dark:text-[#B5A492] transition-colors cursor-pointer"
              title="Close overlay"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-[#52463B] dark:text-[#C4B7A6] leading-relaxed">
            This overlay maps ancient human migration corridors and genetic divergence nodes derived from mitochondrial DNA (mtDNA), Y-chromosome haplogroups, and archaeogenomic studies across the African continent.
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto drawer-cozy-scrollbar pr-1">
            {MOLECULAR_DIVERGENCE_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => {
                    onSelectNode(node);
                    zoomToCoords(node.coords.x, node.coords.y);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-[#E67E48]/15 border-[#E67E48] shadow-sm'
                      : 'bg-white/60 dark:bg-black/20 border-[#E5DDD0] dark:border-[#38322B] hover:border-[#E67E48]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8571A] dark:text-[#FFA573]">
                      {node.haplogroup}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#2B241E]/10 dark:bg-white/10 text-[#7D6B5A] dark:text-[#B5A492]">
                      {node.timeframe}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#2B241E] dark:text-[#F5EFE6]">
                    {node.name}
                  </h4>
                  <p className="text-[10px] text-[#7D6B5A] dark:text-[#B5A492] line-clamp-1">
                    {node.region}
                  </p>
                </button>
              );
            })}
          </div>

          {selectedNode && (
            <div className="p-3 rounded-2xl bg-[#2B241E]/5 dark:bg-white/5 border border-[#E5DDD0] dark:border-[#38322B] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-[#B8571A] dark:text-[#FFA573]">
                  Selected Divergence Node
                </span>
                <button
                  type="button"
                  onClick={() => onSelectNode(null)}
                  className="text-[10px] text-[#7D6B5A] hover:text-[#2B241E] underline cursor-pointer"
                >
                  Clear selection
                </button>
              </div>
              <h5 className="text-xs font-bold text-[#2B241E] dark:text-[#F5EFE6]">
                {selectedNode.name}
              </h5>
              <p className="text-[11px] text-[#52463B] dark:text-[#C4B7A6] leading-relaxed">
                {selectedNode.description}
              </p>
              <div className="pt-1 border-t border-[#E5DDD0] dark:border-[#38322B] space-y-1">
                <p className="text-[10px] font-bold text-[#7D6B5A]">Downstream Lineages:</p>
                <ul className="list-disc list-inside text-[10px] text-[#52463B] dark:text-[#C4B7A6] space-y-0.5">
                  {selectedNode.downstreamBranches.map((branch, i) => (
                    <li key={i}>{branch}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MolecularMigrationCanvasLayer: React.FC<{
  isVisible: boolean;
  selectedNode: MolecularDivergenceNode | null;
  onSelectNode: (node: MolecularDivergenceNode | null) => void;
  zoomToCoords: (x: number, y: number) => void;
}> = ({ isVisible, selectedNode, onSelectNode, zoomToCoords }) => {
  const [hoveredNode, setHoveredNode] = useState<MolecularDivergenceNode | null>(null);

  if (!isVisible) return null;

  return (
    <svg 
      style={{ width: `${VBW}px`, height: `${VBH}px` }}
      className="absolute inset-0 pointer-events-none z-20 overflow-visible"
      viewBox={`0 0 ${VBW} ${VBH}`}
    >
      <defs>
        <linearGradient id="migration-path-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E67E48" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#D97706" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9" />
        </linearGradient>
        
        {/* Editorial Light Engaging Tonal Backdrop Tint */}
        <radialGradient id="editorial-vignette" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor="#FAF6EE" stopOpacity="0.08" />
          <stop offset="35%" stopColor="#F5ECE0" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#E8DAC7" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#D6C1A6" stopOpacity="0.65" />
        </radialGradient>

        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="tooltip-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#4A3B2C" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Sleek Editorial Light Backdrop Tint to focus attention on migration corridors */}
      <rect 
        x="0" 
        y="0" 
        width={VBW} 
        height={VBH} 
        fill="url(#editorial-vignette)" 
        className="pointer-events-none transition-opacity duration-500"
      />

      {/* Connection arcs between divergence nodes (Proportional universal SVG scaling) */}
      <g className="migration-vectors">
        <path
          d="M 2214 2228 Q 2160 2150 2110 2085"
          fill="none"
          stroke="url(#migration-path-grad)"
          strokeWidth="7"
          strokeDasharray="14 10"
          className="animate-pulse"
          filter="url(#glow)"
        />
        <path
          d="M 2110 2085 Q 2060 2240 2011 2397"
          fill="none"
          stroke="url(#migration-path-grad)"
          strokeWidth="7"
          strokeDasharray="14 10"
          className="animate-pulse"
          filter="url(#glow)"
        />
        <path
          d="M 2214 2228 Q 2320 2040 2420 1860"
          fill="none"
          stroke="url(#migration-path-grad)"
          strokeWidth="6"
          strokeDasharray="12 8"
        />
        <path
          d="M 2110 2085 Q 1980 1900 1850 1750"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="6"
          strokeDasharray="10 8"
        />
        <path
          d="M 2214 2228 Q 2380 2100 2480 1950"
          fill="none"
          stroke="#10B981"
          strokeWidth="5"
          strokeDasharray="8 8"
        />
      </g>

      {/* Interactive Node Markers (Proportional Universal SVG Coordinates & Beacons) */}
      {MOLECULAR_DIVERGENCE_NODES.map((node) => {
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;
        return (
          <g 
            key={node.id} 
            className="cursor-pointer pointer-events-auto group" 
            onClick={() => {
              onSelectNode(node);
              zoomToCoords(node.coords.x, node.coords.y);
            }}
            onMouseEnter={() => setHoveredNode(node)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Outer Pulsing Beacon Aura */}
            <circle
              cx={node.coords.x}
              cy={node.coords.y}
              r={isSelected || isHovered ? 48 : 34}
              fill="none"
              stroke={isSelected ? '#E67E48' : '#3B82F6'}
              strokeWidth={isSelected || isHovered ? "4.5" : "3"}
              className="animate-ping origin-center opacity-70 transition-all"
            />
            {/* Secondary Radiance Halo */}
            <circle
              cx={node.coords.x}
              cy={node.coords.y}
              r={isSelected || isHovered ? 28 : 20}
              fill={isSelected ? 'rgba(230,126,72,0.22)' : 'rgba(59,130,246,0.18)'}
              stroke={isSelected ? '#E67E48' : '#3B82F6'}
              strokeWidth="2"
            />
            {/* Core Node Pearl */}
            <circle
              cx={node.coords.x}
              cy={node.coords.y}
              r={isSelected || isHovered ? 17 : 13}
              fill={isSelected || isHovered ? '#E67E48' : '#1C1815'}
              stroke="#FAF7F2"
              strokeWidth="3.5"
              className="transition-all transform hover:scale-110 drop-shadow-md"
            />
            
            {/* High-Contrast Haplogroup Label Badge */}
            <g transform={`translate(${node.coords.x}, ${node.coords.y + 24})`}>
              <rect
                x="-65"
                y="0"
                width="130"
                height="22"
                rx="6"
                fill="#FAF7F2"
                stroke="#E5DDD0"
                strokeWidth="1"
                className="drop-shadow-sm"
              />
              <text
                x="0"
                y="15"
                textAnchor="middle"
                fill="#8C4A1C"
                className="text-[10px] font-bold uppercase tracking-wider select-none pointer-events-none"
              >
                {node.haplogroup.split(' ')[0]} {node.haplogroup.split(' ')[1]}
              </text>
            </g>

            {/* Snappy Hover / Selected Editorial Tooltip Card (Light engaging theme) */}
            {(isHovered || isSelected) && (
              <g transform={`translate(${node.coords.x}, ${node.coords.y - 88})`} filter="url(#tooltip-shadow)" className="pointer-events-none transition-all animate-fadeIn">
                <rect
                  x="-140"
                  y="-60"
                  width="280"
                  height="72"
                  rx="14"
                  fill="#FAF7F2"
                  stroke="#E67E48"
                  strokeWidth="2"
                  opacity="0.98"
                />
                <text x="0" y="-38" textAnchor="middle" fill="#B8571A" className="text-[10px] font-bold uppercase tracking-wider">
                  {node.haplogroup}
                </text>
                <text x="0" y="-20" textAnchor="middle" fill="#2B241E" className="text-[12px] font-bold">
                  {node.name}
                </text>
                <text x="0" y="-3" textAnchor="middle" fill="#7D6B5A" className="text-[9.5px] font-mono font-medium">
                  {node.timeframe} · Click to explore
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

