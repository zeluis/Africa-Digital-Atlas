import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dna, Compass, Activity, MapPin, Calendar, Layers, X, Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { VBW, VBH, CX, CY } from '../../data/africaliaMasterTreeData';

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
    coords: { x: 2214, y: 2228 },
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
    coords: { x: 1960, y: 1980 },
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
    coords: { x: 2150, y: 2680 },
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
    coords: { x: 2620, y: 1720 },
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
    coords: { x: 1250, y: 1780 },
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
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute bottom-4 left-4 z-45 w-[360px] sm:w-[420px] max-w-[calc(100vw-32px)] max-h-[72vh] overflow-y-auto drawer-cozy-scrollbar bg-[#FAF6EE] dark:bg-[#1E1916] border border-[#E5DDD0] dark:border-[#38322B] rounded-3xl shadow-2xl p-4 flex flex-col gap-3.5 backdrop-blur-xl"
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

          <div className="space-y-2 max-h-60 overflow-y-auto drawer-cozy-scrollbar pr-1">
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
    <g className="pointer-events-auto">
      <defs>
        <linearGradient id="migration-path-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E67E48" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#D97706" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id="migration-path-atlantic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E67E48" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id="migration-path-bantu" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E67E48" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#10B981" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.95" />
        </linearGradient>
        
        {/* Editorial Light Engaging Tonal Backdrop Tint */}
        <radialGradient id="editorial-vignette" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor="#FAF6EE" stopOpacity="0.12" />
          <stop offset="35%" stopColor="#F5ECE0" stopOpacity="0.30" />
          <stop offset="70%" stopColor="#E8DAC7" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#D6C1A6" stopOpacity="0.75" />
        </radialGradient>

        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="16" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="tooltip-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#2B241E" floodOpacity="0.28" />
        </filter>

        <style>{`
          @keyframes molecularFlow {
            from {
              stroke-dashoffset: 140;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          .migration-flow-anim {
            animation: molecularFlow 2.8s linear infinite;
          }
          .migration-pulse-aura {
            animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
        `}</style>
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

      {/* Connection arcs between divergence nodes (Scaled proportionally to the 4331 x 4426 sovereign canvas) */}
      <g className="migration-vectors pointer-events-none">
        {/* 1. Root Eve to West Africa */}
        <path
          d="M 2214 2228 Q 2120 2080 1960 1980"
          fill="none"
          stroke="#E67E48"
          strokeWidth="48"
          strokeOpacity="0.22"
          filter="url(#glow)"
        />
        <path
          d="M 2214 2228 Q 2120 2080 1960 1980"
          fill="none"
          stroke="url(#migration-path-grad)"
          strokeWidth="20"
          strokeDasharray="40 28"
          strokeLinecap="round"
          className="migration-flow-anim"
        />

        {/* 2. West Africa to Atlantic Crucible (Cabo Verde diaspora corridor) */}
        <path
          d="M 1960 1980 Q 1600 1880 1250 1780"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="48"
          strokeOpacity="0.22"
          filter="url(#glow)"
        />
        <path
          d="M 1960 1980 Q 1600 1880 1250 1780"
          fill="none"
          stroke="url(#migration-path-atlantic)"
          strokeWidth="20"
          strokeDasharray="40 28"
          strokeLinecap="round"
          className="migration-flow-anim"
        />

        {/* 3. Root to Bantu Southern & Central Expansion */}
        <path
          d="M 2214 2228 Q 2060 2450 2150 2680"
          fill="none"
          stroke="#10B981"
          strokeWidth="48"
          strokeOpacity="0.22"
          filter="url(#glow)"
        />
        <path
          d="M 2214 2228 Q 2060 2450 2150 2680"
          fill="none"
          stroke="url(#migration-path-bantu)"
          strokeWidth="20"
          strokeDasharray="40 28"
          strokeLinecap="round"
          className="migration-flow-anim"
        />

        {/* 4. Root to Sahelian & Horn Corridor */}
        <path
          d="M 2214 2228 Q 2480 1960 2620 1720"
          fill="none"
          stroke="#D97706"
          strokeWidth="48"
          strokeOpacity="0.22"
          filter="url(#glow)"
        />
        <path
          d="M 2214 2228 Q 2480 1960 2620 1720"
          fill="none"
          stroke="url(#migration-path-grad)"
          strokeWidth="18"
          strokeDasharray="36 24"
          strokeLinecap="round"
          className="migration-flow-anim"
        />

        {/* 5. West Africa to Bantu expansion nexus */}
        <path
          d="M 1960 1980 Q 1920 2380 2150 2680"
          fill="none"
          stroke="#059669"
          strokeWidth="40"
          strokeOpacity="0.18"
          filter="url(#glow)"
        />
        <path
          d="M 1960 1980 Q 1920 2380 2150 2680"
          fill="none"
          stroke="url(#migration-path-bantu)"
          strokeWidth="16"
          strokeDasharray="32 24"
          strokeLinecap="round"
          className="migration-flow-anim"
        />
      </g>

      {/* Interactive Node Markers (Scaled to Sovereign Coordinates with Generous Click Targets) */}
      {MOLECULAR_DIVERGENCE_NODES.map((node) => {
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;
        return (
          <g 
            key={node.id} 
            className="cursor-pointer pointer-events-auto group" 
            onClick={(e) => {
              e.stopPropagation();
              onSelectNode(node);
              zoomToCoords(node.coords.x, node.coords.y);
            }}
            onMouseEnter={() => setHoveredNode(node)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Generous Invisible Hit Target ensuring 100% effortless selection */}
            <circle
              cx={node.coords.x}
              cy={node.coords.y}
              r={180}
              fill="transparent"
              pointerEvents="all"
              className="cursor-pointer"
            />

            {/* Outer Pulsing Beacon Aura */}
            <circle
              cx={node.coords.x}
              cy={node.coords.y}
              r={isSelected || isHovered ? 140 : 100}
              fill="none"
              stroke={isSelected ? '#E67E48' : '#3B82F6'}
              strokeWidth={isSelected || isHovered ? "14" : "9"}
              className="migration-pulse-aura origin-center opacity-70 transition-all pointer-events-none"
            />

            {/* Secondary Radiance Halo */}
            <circle
              cx={node.coords.x}
              cy={node.coords.y}
              r={isSelected || isHovered ? 90 : 65}
              fill={isSelected ? 'rgba(230,126,72,0.30)' : 'rgba(59,130,246,0.22)'}
              stroke={isSelected ? '#E67E48' : '#3B82F6'}
              strokeWidth="6"
              className="pointer-events-none transition-all duration-300"
            />

            {/* Core Node Pearl */}
            <circle
              cx={node.coords.x}
              cy={node.coords.y}
              r={isSelected || isHovered ? 52 : 38}
              fill={isSelected || isHovered ? '#E67E48' : '#1C1815'}
              stroke="#FAF7F2"
              strokeWidth="9"
              className="transition-all transform hover:scale-110 drop-shadow-xl pointer-events-none"
            />
            
            {/* High-Contrast Haplogroup Label Badge */}
            <g transform={`translate(${node.coords.x}, ${node.coords.y + 65})`} className="pointer-events-none">
              <rect
                x="-160"
                y="0"
                width="320"
                height="56"
                rx="16"
                fill="#FAF7F2"
                stroke="#E5DDD0"
                strokeWidth="2.5"
                className="drop-shadow-lg"
              />
              <text
                x="0"
                y="36"
                textAnchor="middle"
                fill="#8C4A1C"
                fontSize="20"
                fontWeight="800"
                letterSpacing="1px"
                className="select-none font-sans"
              >
                {node.haplogroup.split(' ')[0]} {node.haplogroup.split(' ')[1]}
              </text>
            </g>

            {/* Snappy Hover Editorial Tooltip Card (Shown on hover when not selected) */}
            {isHovered && !isSelected && (
              <foreignObject
                x={node.id === 'h1-l0-l1' ? -100 : (node.id === 'h2-l2-west' ? -380 : -280)}
                y={node.id === 'h1-l0-l1' ? -260 : -230}
                width="480"
                height="190"
                className="overflow-visible pointer-events-none"
              >
                <div 
                  className="w-full h-full p-3.5 rounded-3xl bg-[#FAF7F2] dark:bg-[#1E1916] border-4 border-[#E67E48] shadow-2xl flex flex-col justify-center items-center text-center select-none overflow-hidden box-border"
                  style={{ filter: 'drop-shadow(0 16px 24px rgba(43,36,30,0.35))' }}
                >
                  <div className="w-full text-[13px] font-extrabold uppercase tracking-wider text-[#B8571A] dark:text-[#FFA573] truncate">
                    {node.haplogroup}
                  </div>
                  <div className="w-full text-[16px] font-extrabold text-[#2B241E] dark:text-[#F5EFE6] leading-tight mt-0.5 truncate">
                    {node.name}
                  </div>
                  <div className="w-full text-[11px] font-mono font-semibold text-[#7D6B5A] dark:text-[#B5A492] mt-1 px-2 whitespace-normal break-words line-clamp-2 leading-tight">
                    {node.timeframe} · {node.region}
                  </div>
                  <div className="w-full text-[11px] font-bold text-[#E67E48] mt-1.5 truncate">
                    Click to inspect molecular lineages &amp; downstream branches →
                  </div>
                </div>
              </foreignObject>
            )}

            {/* Sleek Sliding Rich Panel right beside selected node on canvas */}
            {isSelected && (
              <foreignObject
                x={85}
                y={-160}
                width="460"
                height="320"
                className="overflow-visible pointer-events-auto z-50"
              >
                <motion.div
                  initial={{ opacity: 0, x: -24, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -24, scale: 0.95 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full p-4.5 rounded-3xl bg-[#FAF7F2] dark:bg-[#1E1916] border-2 border-[#E67E48] shadow-[0_20px_60px_rgba(43,36,30,0.45)] flex flex-col justify-between select-none box-border backdrop-blur-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E5DDD0] dark:border-[#38322B]">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-[#E67E48]/20 text-[#B8571A] dark:text-[#FFA573]">
                        <Dna className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#B8571A] dark:text-[#FFA573]">
                        Selected Divergence Node
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectNode(null);
                      }}
                      className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#7D6B5A] dark:text-[#B5A492] transition-colors cursor-pointer"
                      title="Clear selection"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 my-1 overflow-y-auto drawer-cozy-scrollbar pr-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E67E48]/15 text-[#B8571A] dark:text-[#FFA573] font-bold">
                        {node.haplogroup}
                      </span>
                      <span className="text-[10px] font-mono text-[#7D6B5A] dark:text-[#B5A492]">
                        {node.timeframe}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-[#2B241E] dark:text-[#F5EFE6] leading-tight">
                      {node.name}
                    </h4>

                    <p className="text-[11px] text-[#52463B] dark:text-[#C4B7A6] leading-relaxed line-clamp-3">
                      {node.description}
                    </p>

                    <div className="pt-2 border-t border-[#E5DDD0] dark:border-[#38322B] space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D6B5A]">Downstream Lineages:</p>
                      <ul className="list-disc list-inside text-[10px] text-[#52463B] dark:text-[#C4B7A6] space-y-0.5">
                        {node.downstreamBranches.slice(0, 3).map((branch, i) => (
                          <li key={i} className="truncate">{branch}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5DDD0] dark:border-[#38322B] flex items-center justify-between text-[10px] font-mono text-[#7D6B5A] dark:text-[#B5A492]">
                    <span className="truncate max-w-[280px]">Region: {node.region}</span>
                    <span className="text-[#E67E48] font-bold shrink-0">Selected &amp; Centered</span>
                  </div>
                </motion.div>
              </foreignObject>
            )}
          </g>
        );
      })}
    </g>
  );
};

