import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, GitBranch } from 'lucide-react';

interface BranchGeometry {
  name: string;
  main: string;
  sub1: string;
  sub2: string;
  nodes: { x: number; y: number; r: number; colorType: 'primary' | 'secondary' | 'tertiary' }[];
}

const TAST_BRANCHES: BranchGeometry[] = [
  {
    name: "Senegambia",
    main: "M 500 500 C 550.8 372.3, 603.6 237.1, 600.9 123.3",
    sub1: "M 562.6 266.4 Q 597.2 223.7, 647.5 161.5",
    sub2: "M 562.6 266.4 Q 554.8 217.1, 543.0 143.0",
    nodes: [
      { x: 600.9, y: 123.3, r: 4.5, colorType: "primary" },
      { x: 647.5, y: 161.5, r: 3.5, colorType: "secondary" },
      { x: 543.0, y: 143.0, r: 3.2, colorType: "tertiary" }
    ]
  },
  {
    name: "Sierra Leone",
    main: "M 500 500 C 438.3 377.2, 373.9 247.1, 366.6 133.5",
    sub1: "M 417.3 272.8 Q 421.1 217.9, 426.7 138.1",
    sub2: "M 417.3 272.8 Q 382.6 236.8, 330.5 182.9",
    nodes: [
      { x: 366.6, y: 133.5, r: 4.5, colorType: "primary" },
      { x: 426.7, y: 138.1, r: 3.5, colorType: "secondary" },
      { x: 330.5, y: 182.9, r: 3.2, colorType: "tertiary" }
    ]
  },
  {
    name: "Windward Coast",
    main: "M 500 500 C 397.4 408.6, 288.3 312.7, 180.5 276.3",
    sub1: "M 301.9 361.3 Q 273.6 314.2, 232.4 245.6",
    sub2: "M 301.9 361.3 Q 252.8 351.8, 179.2 337.5",
    nodes: [
      { x: 180.5, y: 276.3, r: 4.5, colorType: "primary" },
      { x: 232.4, y: 245.6, r: 3.5, colorType: "secondary" },
      { x: 179.2, y: 337.5, r: 3.2, colorType: "tertiary" }
    ]
  },
  {
    name: "Gold Coast",
    main: "M 500 500 C 365.4 527.8, 223.1 556.4, 111.5 534.0",
    sub1: "M 259.1 521.1 Q 207.1 503.2, 131.5 477.1",
    sub2: "M 259.1 521.1 Q 215.4 545.3, 149.8 581.7",
    nodes: [
      { x: 111.5, y: 534.0, r: 4.5, colorType: "primary" },
      { x: 131.5, y: 477.1, r: 3.5, colorType: "secondary" },
      { x: 149.8, y: 581.7, r: 3.2, colorType: "tertiary" }
    ]
  },
  {
    name: "Bight of Benin",
    main: "M 500 500 C 392.2 585.2, 278.8 675.9, 224.2 775.8",
    sub1: "M 329.0 671.0 Q 277.7 690.7, 203.0 719.4",
    sub2: "M 329.0 671.0 Q 311.1 717.7, 284.2 787.7",
    nodes: [
      { x: 224.2, y: 775.8, r: 4.5, colorType: "primary" },
      { x: 203.0, y: 719.4, r: 3.5, colorType: "secondary" },
      { x: 284.2, y: 787.7, r: 3.2, colorType: "tertiary" }
    ]
  },
  {
    name: "Bight of Biafra",
    main: "M 500 500 C 516.0 636.5, 532.0 780.8, 500.0 890.0",
    sub1: "M 500.0 741.8 Q 477.6 792.0, 445.1 865.1",
    sub2: "M 500.0 741.8 Q 520.3 787.5, 550.8 856.0",
    nodes: [
      { x: 500.0, y: 890.0, r: 4.5, colorType: "primary" },
      { x: 445.1, y: 865.1, r: 3.5, colorType: "secondary" },
      { x: 550.8, y: 856.0, r: 3.2, colorType: "tertiary" }
    ]
  },
  {
    name: "West-Central Africa",
    main: "M 500 500 C 585.2 607.8, 675.9 721.2, 775.8 775.8",
    sub1: "M 671.0 671.0 Q 690.7 722.3, 719.4 797.0",
    sub2: "M 671.0 671.0 Q 717.7 688.9, 787.7 715.8",
    nodes: [
      { x: 775.8, y: 775.8, r: 4.5, colorType: "primary" },
      { x: 719.4, y: 797.0, r: 3.5, colorType: "secondary" },
      { x: 787.7, y: 715.8, r: 3.2, colorType: "tertiary" }
    ]
  },
  {
    name: "Southeast Africa",
    main: "M 500 500 C 622.8 438.3, 752.9 373.9, 866.5 366.6",
    sub1: "M 727.2 417.3 Q 782.1 421.1, 861.9 426.7",
    sub2: "M 727.2 417.3 Q 763.2 382.6, 817.1 330.5",
    nodes: [
      { x: 866.5, y: 366.6, r: 4.5, colorType: "primary" },
      { x: 861.9, y: 426.7, r: 3.5, colorType: "secondary" },
      { x: 817.1, y: 330.5, r: 3.2, colorType: "tertiary" }
    ]
  }
];

const CRUCIBLE_ELLIPSES = [
  { rx: 420, ry: 240, strokeWidth: 1.0, dash: "6 4", opacity: 0.35, delay: 0.05 },
  { rx: 310, ry: 175, strokeWidth: 1.1, dash: "4 3", opacity: 0.45, delay: 0.15 },
  { rx: 200, ry: 110, strokeWidth: 1.2, dash: "5 3", opacity: 0.55, delay: 0.25 },
  { rx: 100, ry: 55,  strokeWidth: 1.3, dash: "3 2", opacity: 0.65, delay: 0.35 }
];

const TELEMETRY_PHASES = [
  "Mapping 8 Transatlantic Provenance Basins…",
  "Tracing Ancestral Lineage Conduits…",
  "Projecting Sovereign Ethnic Canopy…"
];

interface RadialTreeSkeletonProps {
  title?: string;
  subtitle?: string;
  className?: string;
  phaseText?: string;
  canvasBg?: 'parchment' | 'white' | 'sepia';
}

export const RadialTreeSkeleton: React.FC<RadialTreeSkeletonProps> = ({
  title = "Tracing Ancestral Lineages & Crucible Conduits",
  subtitle = "Connecting 8 Transatlantic Provenance Basins & Sovereign Ethnic Roots",
  className = "",
  canvasBg = 'parchment'
}) => {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex(prev => (prev + 1) % TELEMETRY_PHASES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const bgToneClass =
    canvasBg === 'white'
      ? 'bg-[#FFFFFF] dark:bg-[#12100E]'
      : canvasBg === 'sepia'
      ? 'bg-[#F4EDE2] dark:bg-[#181512]'
      : 'bg-[#FAF7F2] dark:bg-[#161412]';

  return (
    <div
      className={`relative w-full h-full min-h-full flex-1 flex flex-col items-center justify-center overflow-hidden select-none transition-colors duration-300 ${bgToneClass} ${className}`}
      aria-busy="true"
      aria-label="Loading Sovereign Ethnic Tree"
    >
      {/* Delicate Archival Grid Texture (Hairline dots, 0 GPU reflow) */}
      <div className="absolute inset-0 bg-[radial-gradient(#C86D3B_1px,transparent_1px)] dark:bg-[radial-gradient(#EA580C_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.08] dark:opacity-[0.12] pointer-events-none" />

      {/* Warm Ambient Continental Glow */}
      <div className="absolute w-[80vw] max-w-[850px] h-[80vw] max-h-[850px] rounded-full bg-gradient-to-tr from-[#C86D3B]/10 via-[#D97706]/10 to-[#059669]/08 dark:from-[#EA580C]/16 dark:via-[#F59E0B]/14 dark:to-[#10B981]/10 blur-[130px] pointer-events-none" />

      {/* SVG Canvas for Crucible Ellipses and Dendritic Canopy Branches */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none overflow-hidden p-4 sm:p-8">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full max-w-full max-h-full object-contain"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Subtle Outer Boundary Ring */}
          <circle
            cx="500"
            cy="500"
            r="440"
            fill="none"
            className="stroke-[#C86D3B]/20 dark:stroke-[#F59E0B]/25"
            strokeWidth="0.8"
            strokeDasharray="2 6"
          />

          {/* 1. RECURSIVE CRUCIBLE RESONANCE: Tilted nested ellipses */}
          <g transform="rotate(-24 500 500)">
            {CRUCIBLE_ELLIPSES.map((e, idx) => (
              <motion.ellipse
                key={`crucible-${idx}`}
                cx="500"
                cy="500"
                rx={e.rx}
                ry={e.ry}
                fill="none"
                className="stroke-[#C86D3B] dark:stroke-[#F59E0B]"
                strokeWidth={e.strokeWidth}
                strokeDasharray={e.dash}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{
                  opacity: [e.opacity * 0.4, e.opacity, e.opacity * 0.4],
                  scale: [0.96, 1.02, 0.96]
                }}
                transition={{
                  duration: 3.2,
                  delay: e.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </g>

          {/* 2. DENDRITIC LINEAGE TREE: 8 TAST Provenance Bezier branches */}
          {TAST_BRANCHES.map((b, i) => (
            <g key={`branch-${b.name}`}>
              {/* Primary Trunk Path */}
              <motion.path
                d={b.main}
                fill="none"
                className="stroke-[#8C532B] dark:stroke-[#F97316]"
                strokeWidth="1.8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.75 }}
                transition={{
                  duration: 1.1,
                  delay: 0.08 + i * 0.07,
                  ease: [0.16, 1, 0.3, 1]
                }}
              />

              {/* Sub-Branch 1 */}
              <motion.path
                d={b.sub1}
                fill="none"
                className="stroke-[#C86D3B]/70 dark:stroke-[#FBBF24]/75"
                strokeWidth="1.1"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.65 }}
                transition={{
                  duration: 0.9,
                  delay: 0.25 + i * 0.07,
                  ease: [0.16, 1, 0.3, 1]
                }}
              />

              {/* Sub-Branch 2 */}
              <motion.path
                d={b.sub2}
                fill="none"
                className="stroke-[#C86D3B]/70 dark:stroke-[#FBBF24]/75"
                strokeWidth="1.0"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.65 }}
                transition={{
                  duration: 0.9,
                  delay: 0.32 + i * 0.07,
                  ease: [0.16, 1, 0.3, 1]
                }}
              />

              {/* Canopy Leaf Nodes (Ethnic Lineage Pearls) */}
              {b.nodes.map((node, nodeIdx) => {
                const fillClass =
                  node.colorType === 'primary'
                    ? 'fill-[#C86D3B] dark:fill-[#F59E0B]'
                    : node.colorType === 'secondary'
                    ? 'fill-[#D97706] dark:fill-[#FBBF24]'
                    : 'fill-[#059669] dark:fill-[#10B981]';

                return (
                  <motion.circle
                    key={`node-${b.name}-${nodeIdx}`}
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    className={`${fillClass} drop-shadow-xs`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1.25, 1],
                      opacity: [0, 0.95, 0.8]
                    }}
                    transition={{
                      duration: 0.7,
                      delay: 0.45 + i * 0.07 + nodeIdx * 0.1,
                      ease: "easeOut"
                    }}
                  />
                );
              })}
            </g>
          ))}

          {/* 3. CONTINENTAL ROOT (Central Ancestral Nexus) */}
          <g>
            {/* Pulsing Core Aura */}
            <motion.circle
              cx="500"
              cy="500"
              r="34"
              className="fill-[#C86D3B]/15 dark:fill-[#F59E0B]/20"
              animate={{
                scale: [0.9, 1.2, 0.9],
                opacity: [0.4, 0.85, 0.4]
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Outer Anchor Ring */}
            <circle
              cx="500"
              cy="500"
              r="18"
              fill="none"
              className="stroke-[#8C532B] dark:stroke-[#F59E0B]"
              strokeWidth="2"
            />
            {/* Inner Continental Pearl */}
            <circle
              cx="500"
              cy="500"
              r="8"
              className="fill-[#C86D3B] dark:fill-[#FCD34D]"
            />
            <circle
              cx="500"
              cy="500"
              r="3"
              fill="#FFFFFF"
            />
          </g>
        </svg>
      </div>

      {/* Floating Status Pill (Sovereign Crucible & Canopy Metadata) */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none p-4 text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="px-4 py-2 rounded-full bg-[#FAF7F2]/90 dark:bg-[#1E1B18]/90 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_8px_30px_rgba(75,55,35,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md flex items-center gap-2.5"
        >
          <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#2B241E] dark:text-[#F5EFE6] tracking-wide">
            <GitBranch className="w-3.5 h-3.5 text-[#C86D3B] dark:text-[#F59E0B]" />
            <span>Africalia</span>
            <span className="text-[#7D6B5A] dark:text-[#B5A492] font-normal font-sans text-[11px]">
              · Sovereign Lineage Tree
            </span>
          </div>
          <div className="w-[1px] h-3 bg-[#E5DDD0] dark:bg-[#38322B]" />
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#C86D3B] dark:text-[#F59E0B]">
            <Sparkles className="w-3 h-3 animate-spin text-[#D97706]" style={{ animationDuration: '4s' }} />
            <span className="tabular-nums">8 Basins</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Editorial Narrative & Staggered Micro-Telemetry */}
      <div className="relative z-20 mt-4 sm:mt-6 flex flex-col items-center gap-2 px-4 text-center max-w-lg">
        <h3 className="text-sm sm:text-base font-serif font-bold text-[#2B241E] dark:text-[#F5EFE6] flex items-center gap-2 tracking-tight">
          <Compass className="w-4 h-4 text-[#C86D3B] dark:text-[#F59E0B]" />
          <span>{title}</span>
        </h3>
        <p className="text-xs text-[#7D6B5A] dark:text-[#B5A492] leading-relaxed font-normal">
          {subtitle}
        </p>

        {/* Dynamic Micro-Telemetry Phase Text */}
        <div className="h-5 flex items-center justify-center overflow-hidden mt-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={phaseIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-[11px] font-mono text-[#C86D3B] dark:text-[#FBBF24] font-medium tracking-wide"
            >
              {TELEMETRY_PHASES[phaseIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Hairline Terracotta Progress Track */}
        <div className="w-48 sm:w-64 h-[2px] rounded-full bg-[#E5DDD0] dark:bg-[#38322B] overflow-hidden mt-1 shadow-inner relative">
          <motion.div
            className="absolute top-0 bottom-0 w-24 rounded-full bg-gradient-to-r from-[#C86D3B] via-[#D97706] to-[#059669]"
            animate={{
              x: [-100, 260]
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    </div>
  );
};
