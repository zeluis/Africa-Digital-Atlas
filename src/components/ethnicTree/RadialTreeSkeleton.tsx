import React from 'react';
import { motion } from 'motion/react';
import { Dna, Sparkles, Compass } from 'lucide-react';

interface RadialTreeSkeletonProps {
  title?: string;
  subtitle?: string;
  className?: string;
  phaseText?: string;
}

export const RadialTreeSkeleton: React.FC<RadialTreeSkeletonProps> = ({
  title = "Synthesizing Sovereign Ethnic Tree of Life",
  subtitle = "Projecting 36,000+ transatlantic lineages, linguistic phyla & ancestral roots...",
  className = "",
  phaseText = "Calibrating Sovereign Coordinate Mesh"
}) => {
  // Generate multi-tiered concentric orbits scaling outwards to fill container boundaries
  const rings = [90, 160, 230, 305, 380, 455, 530, 605];
  const rays = Array.from({ length: 36 }).map((_, i) => (i * 360) / 36);
  
  // High-density orbital nodes spanning across 3 outer perimeter tiers
  const outerDotsTier1 = Array.from({ length: 48 }).map((_, i) => {
    const angle = ((i * 360) / 48) * (Math.PI / 180);
    const r = 380;
    return {
      x: 650 + r * Math.cos(angle),
      y: 650 + r * Math.sin(angle),
      key: `t1-${i}`
    };
  });

  const outerDotsTier2 = Array.from({ length: 72 }).map((_, i) => {
    const angle = ((i * 360) / 72 + 2.5) * (Math.PI / 180);
    const r = 530;
    return {
      x: 650 + r * Math.cos(angle),
      y: 650 + r * Math.sin(angle),
      key: `t2-${i}`
    };
  });

  const outerDotsTier3 = Array.from({ length: 96 }).map((_, i) => {
    const angle = ((i * 360) / 96 + 1.25) * (Math.PI / 180);
    const r = 605;
    return {
      x: 650 + r * Math.cos(angle),
      y: 650 + r * Math.sin(angle),
      key: `t3-${i}`
    };
  });

  return (
    <div 
      className={`relative w-full h-full min-h-full flex-1 flex flex-col items-center justify-center overflow-hidden bg-[#161412] select-none ${className}`}
      aria-busy="true"
      aria-label="Loading Radial Ethnic Tree of Life"
    >
      {/* Dynamic Background Chromatic Grid & Ambient Sovereign Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#ea580c_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-20 pointer-events-none" />
      
      {/* Deep Continental Multi-Hued Ambient Bloom filling all edges */}
      <div className="absolute w-[90vw] max-w-[1200px] h-[90vh] max-h-[1200px] rounded-full bg-gradient-to-tr from-amber-600/15 via-orange-600/18 to-emerald-600/15 blur-[160px] pointer-events-none animate-pulse" />
      <div className="absolute w-[65vw] max-w-[750px] h-[65vh] max-h-[750px] rounded-full bg-radial from-[#e67e48]/25 to-transparent blur-[110px] pointer-events-none" />

      {/* SVG Geometric Radial Tree Shimmer Vector - Fully extends to fill maximum width and height */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none overflow-hidden p-2 sm:p-6 md:p-10">
        <svg
          viewBox="0 0 1300 1300"
          className="w-full h-full max-w-full max-h-full object-contain drop-shadow-[0_0_45px_rgba(234,88,12,0.35)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="radialSkeletonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#ea580c" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#e67e48" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#e67e48" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="beamCounterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#059669" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </linearGradient>

            <filter id="skeletonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric Cohort Orbit Rings extending all the way out */}
          {rings.map((r, index) => (
            <circle
              key={r}
              cx="650"
              cy="650"
              r={r}
              fill="none"
              stroke="#fb923c"
              strokeWidth={index === 0 ? "3" : index > 4 ? "1.6" : "1.2"}
              strokeDasharray={index % 2 === 0 ? "8 6" : "4 4"}
              opacity={0.25 + (index * 0.08)}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={index % 2 === 0 ? "0 650 650" : "360 650 650"}
                to={index % 2 === 0 ? "360 650 650" : "0 650 650"}
                dur={`${48 - index * 4}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Radial Branching Sovereign Rays (36 Full Rays) */}
          {rays.map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 650 + 90 * Math.cos(rad);
            const y1 = 650 + 90 * Math.sin(rad);
            const x2 = 650 + 605 * Math.cos(rad);
            const y2 = 650 + 605 * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#radialSkeletonGrad)"
                strokeWidth={i % 6 === 0 ? "2.5" : i % 3 === 0 ? "1.6" : "1"}
                opacity={i % 3 === 0 ? "0.65" : "0.32"}
              />
            );
          })}

          {/* Outer Leaf Nodes Shimmer Tier 1 (Inner Leaf Layer) */}
          {outerDotsTier1.map((d) => (
            <circle
              key={d.key}
              cx={d.x}
              cy={d.y}
              r={Number(d.key.slice(3)) % 3 === 0 ? 5.5 : 3.8}
              fill={Number(d.key.slice(3)) % 2 === 0 ? "#fcd34d" : "#fb923c"}
              opacity="0.85"
              filter="url(#skeletonGlow)"
            >
              <animate
                attributeName="r"
                values="3;6;3"
                dur={`${2.2 + (Number(d.key.slice(3)) % 4) * 0.4}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.35;0.95;0.35"
                dur={`${2.2 + (Number(d.key.slice(3)) % 3) * 0.6}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Outer Leaf Nodes Shimmer Tier 2 (Intermediate Canopy Layer) */}
          {outerDotsTier2.map((d) => (
            <circle
              key={d.key}
              cx={d.x}
              cy={d.y}
              r={Number(d.key.slice(3)) % 4 === 0 ? 5 : 3.2}
              fill={Number(d.key.slice(3)) % 3 === 0 ? "#10b981" : "#f59e0b"}
              opacity="0.75"
              filter="url(#skeletonGlow)"
            >
              <animate
                attributeName="r"
                values="2.5;5;2.5"
                dur={`${2.6 + (Number(d.key.slice(3)) % 5) * 0.3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.25;0.85;0.25"
                dur={`${2.4 + (Number(d.key.slice(3)) % 4) * 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Outer Leaf Nodes Shimmer Tier 3 (Farthest Continental Orbit Layer) */}
          {outerDotsTier3.map((d) => (
            <circle
              key={d.key}
              cx={d.x}
              cy={d.y}
              r={Number(d.key.slice(3)) % 5 === 0 ? 5 : 2.8}
              fill={Number(d.key.slice(3)) % 2 === 0 ? "#e67e48" : "#fbbf24"}
              opacity="0.7"
              filter="url(#skeletonGlow)"
            >
              <animate
                attributeName="r"
                values="2;4.5;2"
                dur={`${3 + (Number(d.key.slice(3)) % 4) * 0.3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.2;0.8;0.2"
                dur={`${2.8 + (Number(d.key.slice(3)) % 3) * 0.4}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Dual Sweeping Radar Scanner Lines */}
          <g transform="translate(650, 650)">
            {/* Primary Golden-Amber Clockwise Sweeper */}
            <line
              x1="0"
              y1="0"
              x2="605"
              y2="0"
              stroke="url(#beamGrad)"
              strokeWidth="4"
              filter="url(#skeletonGlow)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0"
                to="360"
                dur="4.5s"
                repeatCount="indefinite"
              />
            </line>

            {/* Counter Emerald Clockwise Sweeper for Depth */}
            <line
              x1="0"
              y1="0"
              x2="530"
              y2="0"
              stroke="url(#beamCounterGrad)"
              strokeWidth="2.5"
              filter="url(#skeletonGlow)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="180"
                to="540"
                dur="7s"
                repeatCount="indefinite"
              />
            </line>
          </g>

          {/* Central Continental Epicenter Core */}
          <circle
            cx="650"
            cy="650"
            r="60"
            fill="#ea580c"
            fillOpacity="0.25"
            stroke="#f59e0b"
            strokeWidth="3.5"
            filter="url(#skeletonGlow)"
          >
            <animate
              attributeName="r"
              values="54;66;54"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="650" cy="650" r="28" fill="#fbbf24" opacity="0.9" />
          <circle cx="650" cy="650" r="12" fill="#ffffff" />
        </svg>
      </div>

      {/* Central Floating Overlay Badge */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="px-5 py-3 rounded-2xl bg-[#1f0b03]/90 border border-[#ea580c]/60 shadow-[0_12px_40px_rgba(234,88,12,0.35)] backdrop-blur-md max-w-sm space-y-1.5"
        >
          <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Radial Cartography Engine</span>
            <Dna className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-[11px] font-mono text-amber-100/90 font-medium">
            {phaseText}
          </div>
        </motion.div>
      </div>

      {/* Bottom Status Card - Positioned Elegantly over the extended Geometry */}
      <div className="relative z-20 mt-6 sm:mt-8 flex flex-col items-center gap-2 px-4 text-center max-w-lg">
        <h3 className="text-sm sm:text-base font-serif font-black text-amber-100 flex items-center gap-2 drop-shadow-md">
          <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{title}</span>
        </h3>
        <p className="text-xs text-amber-200/85 leading-relaxed font-light drop-shadow-xs">
          {subtitle}
        </p>

        {/* Shimmer Bar */}
        <div className="w-52 sm:w-72 h-1.5 rounded-full bg-stone-800/90 overflow-hidden mt-1.5 border border-amber-500/25 shadow-inner">
          <div className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-400 rounded-full animate-indeterminate" />
        </div>
      </div>
    </div>
  );
};
