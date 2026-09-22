import React from 'react';
import {
  THEMATIC_CORRIDORS,
  THEMATIC_PULSE_NODES,
  THEMATIC_AURAS,
  ThematicPath,
  ThematicPulseNode,
  ThematicAreaAura
} from '../data/akpThematicOverlays';
import { AkpCategory } from '../data/akpDatasets';

export interface ThematicOverlaysLayerProps {
  activeThematicTheme: AkpCategory;
  showAllThematicLayers?: boolean;
  hoveredThematicItem?: ThematicPulseNode | ThematicPath | ThematicAreaAura | null;
  onHoverThematicItem?: (item: ThematicPulseNode | ThematicPath | ThematicAreaAura | null, event?: React.MouseEvent) => void;
  onClickThematicItem?: (item: ThematicPulseNode | ThematicPath | ThematicAreaAura, event?: React.MouseEvent) => void;
}

export const ThematicOverlaysLayer: React.FC<ThematicOverlaysLayerProps> = ({
  activeThematicTheme,
  showAllThematicLayers = false,
  hoveredThematicItem,
  onHoverThematicItem,
  onClickThematicItem
}) => {
  // Filter assets based on active theme
  const filteredCorridors = THEMATIC_CORRIDORS.filter(
    c => showAllThematicLayers || activeThematicTheme === 'all' || c.category === activeThematicTheme
  );

  const filteredNodes = THEMATIC_PULSE_NODES.filter(
    n => showAllThematicLayers || activeThematicTheme === 'all' || n.category === activeThematicTheme
  );

  const filteredAuras = THEMATIC_AURAS.filter(
    a => showAllThematicLayers || activeThematicTheme === 'all' || a.category === activeThematicTheme
  );

  return (
    <g id="akp-thematic-overlays-container" className="select-none pointer-events-auto">
      {/* 1. Large Thematic Area Auras (e.g. Great Green Wall, Congo Basin) */}
      <g id="thematic-auras-group">
        {filteredAuras.map((aura) => {
          const isHovered = hoveredThematicItem?.id === aura.id;
          return (
            <g
              key={`aura-${aura.id}`}
              className="cursor-pointer group"
              onMouseEnter={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(aura, e);
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClickThematicItem?.(aura, e);
              }}
            >
              {/* Outer Bio-Glow */}
              <path
                d={aura.d}
                fill={aura.fillColor}
                fillOpacity={isHovered ? 0.38 : 0.20}
                stroke={aura.strokeColor}
                strokeWidth={isHovered ? aura.strokeWidth * 1.8 : aura.strokeWidth}
                strokeDasharray="32 18"
                strokeLinejoin="round"
                className="transition-all duration-300"
              >
                <animate attributeName="stroke-dashoffset" values="0;420" dur="14s" repeatCount="indefinite" />
              </path>
            </g>
          );
        })}
      </g>

      {/* 2. Arteries & Infrastructure Corridors with Photon Pulses */}
      <g id="thematic-corridors-group">
        {filteredCorridors.map((corridor) => {
          const isHovered = hoveredThematicItem?.id === corridor.id;
          return (
            <g
              key={`corridor-${corridor.id}`}
              className="cursor-pointer group"
              onMouseEnter={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(corridor, e);
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClickThematicItem?.(corridor, e);
              }}
            >
              {/* Broad Invisible Hitbox for Ultra-Easy Selection & Hover */}
              <path
                d={corridor.d}
                fill="none"
                stroke="transparent"
                strokeWidth={160}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Glowing Underlay */}
              <path
                d={corridor.d}
                fill="none"
                stroke={corridor.color}
                strokeWidth={isHovered ? corridor.strokeWidth + 28 : corridor.strokeWidth + 14}
                strokeOpacity={isHovered ? 0.55 : 0.28}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-200"
              />

              {/* Core Transmission Highway Line */}
              <path
                d={corridor.d}
                fill="none"
                stroke={corridor.color}
                strokeWidth={isHovered ? corridor.strokeWidth + 8 : corridor.strokeWidth}
                strokeDasharray={corridor.dashArray || '32 16'}
                strokeOpacity={0.98}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <animate attributeName="stroke-dashoffset" values="0;360" dur={`${corridor.speedSec * 3}s`} repeatCount="indefinite" />
              </path>

              {/* Traveling Photon Pulse 1 */}
              <circle r={32} fill={corridor.color} opacity={0.6}>
                <animateMotion dur={`${corridor.speedSec}s`} repeatCount="indefinite" path={corridor.d} />
              </circle>
              {/* Traveling Photon Core */}
              <circle r={18} fill="#ffffff">
                <animateMotion dur={`${corridor.speedSec}s`} repeatCount="indefinite" path={corridor.d} />
              </circle>

              {/* Staggered Secondary Photon Pulse */}
              <circle r={26} fill={corridor.color} opacity={0.45}>
                <animateMotion dur={`${corridor.speedSec}s`} begin={`${corridor.speedSec / 2}s`} repeatCount="indefinite" path={corridor.d} />
              </circle>
              <circle r={14} fill="#ffffff">
                <animateMotion dur={`${corridor.speedSec}s`} begin={`${corridor.speedSec / 2}s`} repeatCount="indefinite" path={corridor.d} />
              </circle>
            </g>
          );
        })}
      </g>

      {/* 3. Thematic Pulse Nodes & Megacities */}
      <g id="thematic-nodes-group">
        {filteredNodes.map((node) => {
          const isHovered = hoveredThematicItem?.id === node.id;
          const offsetX = node.labelOffset?.x ?? 0;
          const offsetY = node.labelOffset?.y ?? (node.radius + 140);
          const hasSignificantOffset = Math.abs(offsetX) > 40 || Math.abs(offsetY) > 80;
          const pillWidth = Math.max(280, node.label.length * 25 + 70);

          return (
            <g
              key={`node-${node.id}`}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer group"
              onMouseEnter={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(node, e);
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClickThematicItem?.(node, e);
              }}
            >
              {/* Large Invisible Hitbox (Radius 160) for effortless hover and clicking */}
              <circle cx="0" cy="0" r="160" fill="transparent" />

              {/* Radiating Ripple Wave 1 */}
              <circle cx="0" cy="0" r="28" fill="none" stroke={node.pulseColor} strokeWidth="8" opacity="0.85">
                <animate attributeName="r" values="28;130" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.85;0" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="8;0.8" dur="2.8s" repeatCount="indefinite" />
              </circle>

              {/* Radiating Ripple Wave 2 (Phase-Shifted) */}
              <circle cx="0" cy="0" r="28" fill="none" stroke={node.pulseColor} strokeWidth="8" opacity="0.85">
                <animate attributeName="r" values="28;130" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.85;0" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="8;0.8" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
              </circle>

              {/* Outer Core Glow */}
              <circle
                cx="0"
                cy="0"
                r={isHovered ? node.radius + 22 : node.radius + 10}
                fill={node.pulseColor}
                fillOpacity={isHovered ? 0.55 : 0.30}
                stroke={node.color}
                strokeWidth="5"
                className="transition-all duration-200"
              />

              {/* Solid Core Anchor */}
              <circle
                cx="0"
                cy="0"
                r={isHovered ? node.radius + 8 : node.radius}
                fill={node.color}
                stroke="#ffffff"
                strokeWidth="6"
                className="transition-all duration-200 shadow-2xl"
              />

              {/* Center Specular Jewel */}
              <circle
                cx="0"
                cy="0"
                r={isHovered ? 14 : 9}
                fill="#ffffff"
                className="transition-all duration-200"
              />

              {/* High-Legibility Scaled Pill Label (Free of Beacon Occlusion) */}
              <g transform={`translate(${offsetX}, ${offsetY})`} className="pointer-events-none">
                {/* Dashed Leader Line for offset anchors */}
                {hasSignificantOffset && (
                  <line
                    x1={-offsetX * 0.75}
                    y1={-offsetY * 0.75}
                    x2={0}
                    y2={0}
                    stroke={node.pulseColor}
                    strokeWidth="4"
                    strokeDasharray="8 6"
                    opacity="0.8"
                  />
                )}

                {/* Solid Glass Background Pill */}
                <rect
                  x={-pillWidth / 2}
                  y="-32"
                  width={pillWidth}
                  height="64"
                  rx="32"
                  fill="#080c18"
                  fillOpacity="0.96"
                  stroke={isHovered ? '#ffffff' : node.pulseColor}
                  strokeWidth={isHovered ? '4.5' : '3'}
                />

                {/* Crisp Bold Typography */}
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="40"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight="800"
                  letterSpacing="0.02em"
                >
                  {node.label}
                </text>
              </g>
            </g>
          );
        })}
      </g>
    </g>
  );
};
