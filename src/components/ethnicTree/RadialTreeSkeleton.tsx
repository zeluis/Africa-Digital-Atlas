import React from 'react';
import { motion } from 'motion/react';
import { Dna, Sparkles, Compass } from 'lucide-react';

interface RadialTreeSkeletonProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const RadialTreeSkeleton: React.FC<RadialTreeSkeletonProps> = ({
  title = "Synthesizing Sovereign Ethnic Tree of Life",
  subtitle = "Projecting 36,000+ transatlantic lineages, linguistic phyla & ancestral roots...",
  className = ""
}) => {
  // Generate geometric radial branch rings & node coordinates
  const rings = [100, 170, 240, 310, 380];
  const rays = Array.from({ length: 24 }).map((_, i) => (i * 360) / 24);
  const outerDots = Array.from({ length: 48 }).map((_, i) => {
    const angle = (i * 360) / 48 * (Math.PI / 180);
    const r = 380;
    return {
      x: 450 + r * Math.cos(angle),
      y: 450 + r * Math.sin(angle),
      key: i
    };
  });

  return (
    <div 
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#161412] select-none ${className}`}
      aria-busy="true"
      aria-label="Loading Radial Ethnic Tree of Life"
    >
      {/* Background Chromatic Radial Pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-600/10 via-orange-600/15 to-emerald-600/10 blur-[120px] pointer-events-none animate-pulse" />

      {/* SVG Geometric Radial Tree Shimmer Vector */}
      <div className="relative w-[340px] sm:w-[460px] md:w-[580px] lg:w-[680px] aspect-square flex items-center justify-center">
        <svg
          viewBox="0 0 900 900"
          className="w-full h-full drop-shadow-[0_0_35px_rgba(234,88,12,0.25)]"
        >
          <defs>
            <linearGradient id="radialSkeletonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.7" />
            </linearGradient>

            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </linearGradient>

            <filter id="skeletonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric Cohort Orbit Rings */}
          {rings.map((r, index) => (
            <circle
              key={r}
              cx="450"
              cy="450"
              r={r}
              fill="none"
              stroke="#fb923c"
              strokeWidth={index === 0 ? "2.5" : "1.2"}
              strokeDasharray={index % 2 === 0 ? "8 6" : "4 4"}
              opacity={0.35 + index * 0.1}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={index % 2 === 0 ? "0 450 450" : "360 450 450"}
                to={index % 2 === 0 ? "360 450 450" : "0 450 450"}
                dur={`${40 - index * 6}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Radial Branching Rays (24 Rays) */}
          {rays.map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 450 + 100 * Math.cos(rad);
            const y1 = 450 + 100 * Math.sin(rad);
            const x2 = 450 + 380 * Math.cos(rad);
            const y2 = 450 + 380 * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#radialSkeletonGrad)"
                strokeWidth={i % 4 === 0 ? "2" : "1"}
                opacity={i % 3 === 0 ? "0.6" : "0.3"}
              />
            );
          })}

          {/* Outer Leaf Nodes Shimmer */}
          {outerDots.map((d) => (
            <circle
              key={d.key}
              cx={d.x}
              cy={d.y}
              r={d.key % 3 === 0 ? 5 : 3.5}
              fill={d.key % 2 === 0 ? "#fcd34d" : "#fb923c"}
              opacity="0.8"
              filter="url(#skeletonGlow)"
            >
              <animate
                attributeName="r"
                values={`${d.key % 3 === 0 ? 4 : 3};${d.key % 3 === 0 ? 7 : 5};${d.key % 3 === 0 ? 4 : 3}`}
                dur={`${2 + (d.key % 4) * 0.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur={`${2 + (d.key % 3) * 0.7}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Sweeping Radar Scanner Line */}
          <g transform="translate(450, 450)">
            <line
              x1="0"
              y1="0"
              x2="380"
              y2="0"
              stroke="url(#beamGrad)"
              strokeWidth="3.5"
              filter="url(#skeletonGlow)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0"
                to="360"
                dur="4s"
                repeatCount="indefinite"
              />
            </line>
          </g>

          {/* Central Continental Epicenter Core */}
          <circle
            cx="450"
            cy="450"
            r="44"
            fill="#ea580c"
            fillOpacity="0.25"
            stroke="#f59e0b"
            strokeWidth="3"
            filter="url(#skeletonGlow)"
          >
            <animate
              attributeName="r"
              values="40;48;40"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="450" cy="450" r="18" fill="#fbbf24" opacity="0.9" />
          <circle cx="450" cy="450" r="8" fill="#ffffff" />
        </svg>

        {/* Central Floating Overlay Badge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="px-4 py-3 rounded-2xl bg-[#1f0b03]/90 border border-[#ea580c]/60 shadow-2xl backdrop-blur-md max-w-xs space-y-1.5"
          >
            <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Radial Cartography</span>
              <Dna className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="text-[11px] font-mono text-amber-100/90 font-medium">
              Calibrating SVG Coordinate Mesh
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="relative z-10 -mt-4 sm:-mt-6 flex flex-col items-center gap-2 px-4 text-center max-w-lg">
        <h3 className="text-sm sm:text-base font-serif font-black text-amber-100 flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{title}</span>
        </h3>
        <p className="text-xs text-amber-200/80 leading-relaxed font-light">
          {subtitle}
        </p>

        {/* Shimmer Bar */}
        <div className="w-48 sm:w-64 h-1.5 rounded-full bg-stone-800/80 overflow-hidden mt-1 border border-amber-500/20">
          <div className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-400 rounded-full animate-indeterminate" />
        </div>
      </div>
    </div>
  );
};
