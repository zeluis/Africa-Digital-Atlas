import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  ExternalLink, 
  BookOpen, 
  Globe2, 
  Info, 
  X, 
  Maximize2,
  Sparkles,
  ChevronRight,
  Layers
} from 'lucide-react';
import { 
  ETHNIC_NODES, 
  COUNTRY_BRANCHES, 
  CORE_CLUSTERS, 
  EthnicNode, 
  CountryBranch,
  CoreClusterNode 
} from '../../data/ethnicTreeData';

interface EthnicTreeCanvasProps {
  onSelectReport?: (reportId: string) => void;
  onNavigateToSlaveTrade?: () => void;
}

export const EthnicTreeCanvas: React.FC<EthnicTreeCanvasProps> = ({
  onSelectReport,
  onNavigateToSlaveTrade
}) => {
  // SVG Canvas dimensions (viewBox 0 0 2000 2000, center at 1000, 1000)
  const SVG_SIZE = 2000;
  const CENTER_X = 1000;
  const CENTER_Y = 1000;
  const RADIUS_OUTER = 880;
  const RADIUS_COUNTRY = 640;

  // Camera State: scale and translation [x, y]
  const [scale, setScale] = useState<number>(0.92);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Selection and Hover states
  const [selectedNode, setSelectedNode] = useState<EthnicNode | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<CoreClusterNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeCountryFilter, setActiveCountryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Touch pinch zoom tracking
  const touchDistanceRef = useRef<number | null>(null);

  // Reset Camera View
  const handleResetCamera = useCallback(() => {
    setScale(0.92);
    setPosition({ x: 0, y: 0 });
    setSelectedNode(null);
    setSelectedCluster(null);
    setActiveCountryFilter(null);
  }, []);

  // Zoom In / Out
  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(prev + delta, 0.45), 4.5));
  };

  // Mouse wheel zoom to cursor position
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.45), 4.5);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const dx = (mouseX - rect.width / 2 - position.x);
      const dy = (mouseY - rect.height / 2 - position.y);

      setPosition({
        x: position.x - dx * (zoomFactor - 1),
        y: position.y - dy * (zoomFactor - 1)
      });
    }

    setScale(newScale);
  };

  // Pointer drag handling
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only primary button
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if capture already lost
    }
  };

  // Touch handlers for mobile pinch
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchDistanceRef.current;
      setScale(prev => Math.min(Math.max(prev * factor, 0.45), 4.5));
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
  };

  // Focus camera on a specific node or country
  const focusOnNode = (node: EthnicNode) => {
    setSelectedNode(node);
    setSelectedCluster(null);
    const angleRad = (node.branchAngle * Math.PI) / 180;
    const targetX = CENTER_X + RADIUS_OUTER * node.radialDistance * Math.cos(angleRad);
    const targetY = CENTER_Y + RADIUS_OUTER * node.radialDistance * Math.sin(angleRad);
    
    // Smooth camera shift towards target
    const targetScale = 1.8;
    setScale(targetScale);
    setPosition({
      x: (CENTER_X - targetX) * (targetScale * 0.4),
      y: (CENTER_Y - targetY) * (targetScale * 0.4)
    });
  };

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ETHNIC_NODES.filter(
      n => n.name.toLowerCase().includes(q) || 
           n.country.toLowerCase().includes(q) ||
           n.region.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery]);

  return (
    <div 
      className="relative w-full h-full min-h-[750px] lg:min-h-[850px] bg-[#0c0d0e] dark:bg-[#070809] select-none overflow-hidden rounded-3xl border border-zinc-800/80 shadow-2xl"
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      id="ethnic-tree-canvas-viewport"
    >
      {/* HUD Top-Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-3 bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl pointer-events-auto">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              AFRICALIA <span className="text-amber-400 font-serif font-normal italic">Ethnic Tree of Life</span>
            </h2>
            <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
              <span>Transatlantic Demographic Lineages</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="text-emerald-400 font-mono">40 Countries • {ETHNIC_NODES.length} Lineages</span>
            </p>
          </div>
        </div>

        {/* Search and Navigation Bar */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative">
            <div className="flex items-center gap-2 bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 backdrop-blur-xl px-3 py-2 rounded-2xl shadow-xl">
              <Search className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search Yoruba, Akan, Bakongo..."
                className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder-zinc-500 w-44 sm:w-60"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-500 hover:text-zinc-300 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-zinc-900/95 dark:bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 px-2.5 py-1">
                  Matching Ethnic Groups
                </div>
                {searchResults.map(result => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      focusOnNode(result);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-zinc-800/80 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-zinc-200 group-hover:text-amber-400">
                        {result.name}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {result.country} • {result.region}
                      </div>
                    </div>
                    <span 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: result.color }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetCamera}
            className="p-2.5 rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all shadow-xl backdrop-blur-xl cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Zoom Controls (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-1.5 bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 backdrop-blur-xl p-1.5 rounded-2xl shadow-2xl">
        <button
          type="button"
          onClick={() => handleZoom(0.25)}
          className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="h-px bg-zinc-800 mx-1" />
        <button
          type="button"
          onClick={() => handleZoom(-0.25)}
          className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-px bg-zinc-800 mx-1" />
        <button
          type="button"
          onClick={handleResetCamera}
          className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer text-[11px] font-mono font-bold"
          title="Fit Extents"
        >
          ⊙
        </button>
      </div>

      {/* SVG Canvas Workspace */}
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out'
        }}
      >
        <defs>
          {/* Gradients for Embarkation Core Clusters */}
          <radialGradient id="grad-bight-biafra" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#59453D" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#795D38" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#2A1B18" stopOpacity="0.4" />
          </radialGradient>

          <radialGradient id="grad-west-central" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#795D38" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#A4723A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3E2723" stopOpacity="0.4" />
          </radialGradient>

          <radialGradient id="grad-cape-verde" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C68C4E" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#A4723A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4E342E" stopOpacity="0.3" />
          </radialGradient>

          {/* Filter for glowing active focus ring */}
          <filter id="focus-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Subtle Radial Concentric Background Grid Rings */}
        <circle cx={CENTER_X} cy={CENTER_Y} r={RADIUS_OUTER} fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray="3 6" opacity="0.4" />
        <circle cx={CENTER_X} cy={CENTER_Y} r={RADIUS_COUNTRY} fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray="4 8" opacity="0.3" />
        <circle cx={CENTER_X} cy={CENTER_Y} r={380} fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray="2 6" opacity="0.25" />

        {/* 2. Core Embarkation Clusters (Center Node Clouds) */}
        <g id="core-clusters-group">
          {CORE_CLUSTERS.map(cluster => {
            const isSelected = selectedCluster?.id === cluster.id;
            return (
              <g 
                key={cluster.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCluster(cluster);
                  setSelectedNode(null);
                }}
                className="cursor-pointer group"
              >
                {/* Outer halo */}
                <circle
                  cx={cluster.x}
                  cy={cluster.y}
                  r={cluster.radius + 14}
                  fill={cluster.color}
                  opacity={isSelected ? 0.35 : 0.12}
                  className="transition-all duration-300 group-hover:opacity-30"
                />
                {/* Main cluster circle */}
                <circle
                  cx={cluster.x}
                  cy={cluster.y}
                  r={cluster.radius}
                  fill={`url(#${cluster.id === 'cluster-cape-verde-anchor' ? 'grad-cape-verde' : cluster.id === 'cluster-west-central-angola' ? 'grad-west-central' : 'grad-bight-biafra'})`}
                  stroke={isSelected ? '#FBBF24' : cluster.color}
                  strokeWidth={isSelected ? 3.5 : 2}
                  className="transition-all duration-300 drop-shadow-lg"
                />
                {/* Cluster label */}
                <text
                  x={cluster.x}
                  y={cluster.y + 4}
                  textAnchor="middle"
                  fill="#F4F4F5"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  pointerEvents="none"
                  className="drop-shadow"
                >
                  {cluster.label.split(' ')[0]}
                </text>
                <text
                  x={cluster.x}
                  y={cluster.y + 20}
                  textAnchor="middle"
                  fill="#A1A1AA"
                  fontSize="10"
                  fontFamily="monospace"
                  pointerEvents="none"
                >
                  {cluster.percentage}% Volume
                </text>
              </g>
            );
          })}
        </g>

        {/* 3. Radial Country Filaments & Branch Trunks */}
        <g id="country-branches-group">
          {Object.values(COUNTRY_BRANCHES).map(branch => {
            const angleRad = (branch.meanAngle * Math.PI) / 180;
            const x2 = CENTER_X + RADIUS_COUNTRY * Math.cos(angleRad);
            const y2 = CENTER_Y + RADIUS_COUNTRY * Math.sin(angleRad);
            
            // Connect to nearest core cluster
            const originX = branch.meanAngle > 180 && branch.meanAngle < 300 
              ? 820 : branch.meanAngle >= 300 || branch.meanAngle <= 30
              ? 1180 : 1010;
            const originY = branch.meanAngle > 180 && branch.meanAngle < 300 
              ? 1100 : branch.meanAngle >= 300 || branch.meanAngle <= 30
              ? 880 : 960;

            const isBranchActive = selectedNode?.country === branch.name || activeCountryFilter === branch.name;

            // Rotate text cleanly along radius
            const isFlipped = branch.meanAngle > 90 && branch.meanAngle < 270;
            const textAngle = isFlipped ? branch.meanAngle + 180 : branch.meanAngle;

            return (
              <g 
                key={branch.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCountryFilter(prev => prev === branch.name ? null : branch.name);
                }}
                className="cursor-pointer group"
                opacity={selectedNode && !isBranchActive ? 0.35 : 1}
              >
                {/* Curved trunk conduit */}
                <path
                  d={`M ${originX} ${originY} Q ${CENTER_X + 220 * Math.cos(angleRad)} ${CENTER_Y + 220 * Math.sin(angleRad)} ${x2} ${y2}`}
                  fill="none"
                  stroke={branch.color}
                  strokeWidth={isBranchActive ? 3.5 : 1.75}
                  strokeOpacity={isBranchActive ? 0.95 : 0.65}
                  className="transition-all duration-300"
                />

                {/* Country Anchor Node Circle */}
                <circle
                  cx={x2}
                  cy={y2}
                  r={isBranchActive ? 6 : 4}
                  fill={branch.color}
                  stroke="#18181b"
                  strokeWidth="2"
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* Country Name Tag Along Branch */}
                <g transform={`translate(${x2}, ${y2}) rotate(${textAngle})`}>
                  <text
                    x={isFlipped ? -12 : 12}
                    y={3}
                    textAnchor={isFlipped ? 'end' : 'start'}
                    fill={isBranchActive ? '#FFFFFF' : branch.color}
                    fontSize="11"
                    fontWeight={isBranchActive ? 'bold' : '600'}
                    fontFamily="system-ui, -apple-system, sans-serif"
                    className="select-none tracking-tight drop-shadow-sm transition-all duration-200 group-hover:fill-white"
                  >
                    {branch.name}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* 4. Terminal Ethnic Lineage Nodes (Perimeter) */}
        <g id="ethnic-nodes-group">
          {ETHNIC_NODES.map(node => {
            const angleRad = (node.branchAngle * Math.PI) / 180;
            const nodeR = RADIUS_OUTER * node.radialDistance;
            const x = CENTER_X + nodeR * Math.cos(angleRad);
            const y = CENTER_Y + nodeR * Math.sin(angleRad);

            // Intermediate branch point
            const branch = COUNTRY_BRANCHES[node.country.replace(/\s+/g, '')] || Object.values(COUNTRY_BRANCHES).find(b => b.name === node.country);
            const countryMeanAngle = branch ? branch.meanAngle : node.branchAngle;
            const countryAngleRad = (countryMeanAngle * Math.PI) / 180;
            const cx = CENTER_X + RADIUS_COUNTRY * Math.cos(countryAngleRad);
            const cy = CENTER_Y + RADIUS_COUNTRY * Math.sin(countryAngleRad);

            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isCountryActive = selectedNode?.country === node.country || activeCountryFilter === node.country;
            const isDimmed = selectedNode && !isSelected && !isCountryActive;

            // Radius scales proportionally with representation percentage
            const circleRadius = isSelected ? 16 : isHovered ? 12 : Math.max(5.5, Math.min(14, node.percentage * 1.15));

            // Rotation for outer label
            const isFlipped = node.branchAngle > 90 && node.branchAngle < 270;
            const labelAngle = isFlipped ? node.branchAngle + 180 : node.branchAngle;

            return (
              <g 
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  focusOnNode(node);
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="cursor-pointer group"
                opacity={isDimmed ? 0.2 : 1}
              >
                {/* Thin tendril linking country to ethnic node */}
                <path
                  d={`M ${cx} ${cy} Q ${(cx + x) / 2} ${(cy + y) / 2} ${x} ${y}`}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={isSelected ? 2.5 : 1}
                  strokeOpacity={isSelected ? 0.95 : 0.4}
                  strokeDasharray={isSelected ? undefined : '2 3'}
                  className="transition-all duration-300"
                />

                {/* Node Focus Halo */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r={circleRadius + 9}
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    className="animate-spin"
                    style={{ animationDuration: '14s' }}
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={circleRadius}
                  fill={isSelected ? '#F59E0B' : node.color}
                  stroke="#18181b"
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="transition-all duration-200 drop-shadow-md group-hover:scale-125"
                />

                {/* Outer Label text */}
                <g transform={`translate(${x}, ${y}) rotate(${labelAngle})`}>
                  <text
                    x={isFlipped ? -(circleRadius + 8) : (circleRadius + 8)}
                    y={3.5}
                    textAnchor={isFlipped ? 'end' : 'start'}
                    fill={isSelected ? '#F59E0B' : isHovered ? '#FFFFFF' : '#D4D4D8'}
                    fontSize={isSelected ? '13' : '10.5'}
                    fontWeight={isSelected ? 'bold' : '500'}
                    fontFamily="system-ui, -apple-system, sans-serif"
                    className="select-none tracking-tight drop-shadow transition-colors"
                  >
                    {node.name}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Desktop Info Surface Card */}
      {selectedNode && (
        <div 
          className="absolute bottom-6 right-6 z-30 w-80 sm:w-96 p-5 rounded-3xl bg-zinc-950/95 border border-zinc-800 shadow-2xl backdrop-blur-2xl text-zinc-100 animate-in fade-in slide-in-from-bottom-4 duration-200"
          id="ethnic-node-info-surface"
        >
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: selectedNode.color }} 
                />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {selectedNode.name}
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {selectedNode.country} • <span className="text-zinc-300 font-medium">{selectedNode.region}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3.5 space-y-3 text-xs">
            {/* Demographic TAST share metric */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80">
              <span className="text-zinc-400 font-medium">Estimated TAST Share:</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {selectedNode.percentage}%
              </span>
            </div>

            {/* Linguistic classification */}
            <div className="flex items-center justify-between px-1">
              <span className="text-zinc-400">Linguistic Phylum:</span>
              <span className="text-zinc-200 font-medium truncate max-w-[200px]">
                {selectedNode.linguisticFamily}
              </span>
            </div>

            {/* Embarkation & diaspora context */}
            <div className="space-y-1 bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800/60">
              <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold">
                Historical Context & Embarkation
              </div>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                {selectedNode.tastContext}
              </p>
              <p className="text-[10px] text-zinc-400 pt-1">
                <strong className="text-zinc-300">Ports:</strong> {selectedNode.historicalEmbarkation}
              </p>
            </div>
          </div>

          {/* Links: Wikipedia and Research Report */}
          <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
            {selectedNode.wikipediaSlug && (
              <a
                href={`https://en.wikipedia.org/wiki/${selectedNode.wikipediaSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 hover:text-white transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Wikipedia Encyclopedia</span>
                </span>
                <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
              </a>
            )}

            {selectedNode.reportReferenceId && onSelectReport && (
              <button
                type="button"
                onClick={() => onSelectReport(selectedNode.reportReferenceId!)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 hover:text-amber-200 transition-all group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Read Cited Master Report</span>
                </span>
                <ChevronRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Cluster Info Surface Card */}
      {selectedCluster && !selectedNode && (
        <div 
          className="absolute bottom-6 right-6 z-30 w-80 sm:w-96 p-5 rounded-3xl bg-zinc-950/95 border border-zinc-800 shadow-2xl backdrop-blur-2xl text-zinc-100 animate-in fade-in slide-in-from-bottom-4 duration-200"
          id="cluster-info-surface"
        >
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: selectedCluster.color }} 
                />
                <h3 className="text-base font-bold text-white tracking-tight">
                  {selectedCluster.label}
                </h3>
              </div>
              <p className="text-xs text-amber-400 font-mono mt-0.5">
                Primary Embarkation Focus ({selectedCluster.percentage}% Volume)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCluster(null)}
              className="p-1 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-xs text-zinc-300 leading-relaxed">
            {selectedCluster.description}
          </div>

          {onNavigateToSlaveTrade && (
            <div className="pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={onNavigateToSlaveTrade}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 hover:text-emerald-200 transition-all group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Explore Voyage Database & Flow Map</span>
                </span>
                <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
