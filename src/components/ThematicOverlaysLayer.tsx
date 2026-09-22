import React from 'react';
import {
  THEMATIC_CORRIDORS,
  THEMATIC_PULSE_NODES,
  THEMATIC_AURAS,
  ThematicPath,
  ThematicPulseNode,
  ThematicAreaAura
} from '../data/akpThematicOverlays';
import { SUBSEA_CABLES_DATA, SUBSEA_LANDING_STATIONS, SubseaCablePath, CableLandingStation } from '../data/akpTelecomCables';
import { CONFLICT_BEACONS_DATA, ConflictBeacon, CONFLICT_CATEGORY_CONFIG } from '../data/akpConflictSecurity';
import { SOCIAL_INFRASTRUCTURE_DATA, SocialInfrastructureFacility, SOCIAL_FACILITY_TYPES } from '../data/akpSocialInfrastructure';
import { HERITAGE_SITES_DATA, HeritageSanctuarySite } from '../data/akpCulturalReserves';
import { AkpCategory } from '../data/akpDatasets';

export type AnyThematicItem =
  | ThematicPulseNode
  | ThematicPath
  | ThematicAreaAura
  | SubseaCablePath
  | CableLandingStation
  | ConflictBeacon
  | SocialInfrastructureFacility
  | HeritageSanctuarySite;

export interface LayerVisibilityState {
  subseaCables: boolean;
  landingStations: boolean;
  conflictBeacons: boolean;
  hospitals: boolean;
  schools: boolean;
  culturalHeritage: boolean;
  naturalSanctuaries: boolean;
  powerCorridors: boolean;
  growthNodes: boolean;
  areaAuras: boolean;
}

export const DEFAULT_LAYER_VISIBILITY: LayerVisibilityState = {
  subseaCables: true,
  landingStations: true,
  conflictBeacons: true,
  hospitals: true,
  schools: true,
  culturalHeritage: true,
  naturalSanctuaries: true,
  powerCorridors: true,
  growthNodes: true,
  areaAuras: true
};

export interface ThematicOverlaysLayerProps {
  activeThematicTheme: AkpCategory;
  showAllThematicLayers?: boolean;
  layerVisibility?: Partial<LayerVisibilityState>;
  hoveredThematicItem?: AnyThematicItem | null;
  onHoverThematicItem?: (item: AnyThematicItem | null, event?: React.MouseEvent) => void;
  onClickThematicItem?: (item: AnyThematicItem, event?: React.MouseEvent) => void;
}

export const ThematicOverlaysLayer: React.FC<ThematicOverlaysLayerProps> = ({
  activeThematicTheme,
  showAllThematicLayers = true,
  layerVisibility = DEFAULT_LAYER_VISIBILITY,
  hoveredThematicItem,
  onHoverThematicItem,
  onClickThematicItem
}) => {
  const vis = { ...DEFAULT_LAYER_VISIBILITY, ...layerVisibility };

  // 1. Continental Corridors & HVDC
  const filteredCorridors = THEMATIC_CORRIDORS.filter(
    c => vis.powerCorridors && (showAllThematicLayers || activeThematicTheme === 'all' || c.category === activeThematicTheme)
  );

  // 2. Growth Nodes & Energy Complexes
  const filteredNodes = THEMATIC_PULSE_NODES.filter(
    n => vis.growthNodes && (showAllThematicLayers || activeThematicTheme === 'all' || n.category === activeThematicTheme)
  );

  // 3. Area Auras (Sahel GGW & Congo Basin)
  const filteredAuras = THEMATIC_AURAS.filter(
    a => vis.areaAuras && (showAllThematicLayers || activeThematicTheme === 'all' || a.category === activeThematicTheme)
  );

  // 4. Subsea Oceanic Cables
  const showCables = vis.subseaCables && (showAllThematicLayers || activeThematicTheme === 'all' || activeThematicTheme === 'energy_infra');
  const showStations = vis.landingStations && (showAllThematicLayers || activeThematicTheme === 'all' || activeThematicTheme === 'energy_infra');

  // 5. Conflict Beacons
  const showConflicts = vis.conflictBeacons && (showAllThematicLayers || activeThematicTheme === 'all' || activeThematicTheme === 'economic');

  // 6. Social Facilities (Hospitals & Schools)
  const filteredHospitals = SOCIAL_INFRASTRUCTURE_DATA.filter(
    f => f.type === 'hospital' && vis.hospitals && (showAllThematicLayers || activeThematicTheme === 'all' || activeThematicTheme === 'demographics')
  );
  const filteredSchools = SOCIAL_INFRASTRUCTURE_DATA.filter(
    f => f.type === 'school_university' && vis.schools && (showAllThematicLayers || activeThematicTheme === 'all' || activeThematicTheme === 'demographics')
  );

  // 7. Cultural & Natural Heritage
  const filteredCultural = HERITAGE_SITES_DATA.filter(
    h => h.type === 'cultural' && vis.culturalHeritage && (showAllThematicLayers || activeThematicTheme === 'all' || activeThematicTheme === 'environment')
  );
  const filteredNatural = HERITAGE_SITES_DATA.filter(
    h => h.type === 'natural' && vis.naturalSanctuaries && (showAllThematicLayers || activeThematicTheme === 'all' || activeThematicTheme === 'environment')
  );

  return (
    <g id="akp-thematic-overlays-container" className="select-none pointer-events-auto">
      {/* ---------------------------------------------------- */}
      {/* 1. LARGE THEMATIC AREA AURAS (GGW Sahel & Congo Basin) */}
      {/* ---------------------------------------------------- */}
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

      {/* ---------------------------------------------------- */}
      {/* 2. SUBSEA OCEANIC FIBER-OPTIC CABLES (High-Speed Optics) */}
      {/* ---------------------------------------------------- */}
      {showCables && (
        <g id="thematic-subsea-cables-group">
          {SUBSEA_CABLES_DATA.map((cable) => {
            const isHovered = hoveredThematicItem?.id === cable.id;
            return (
              <g
                key={`subsea-cable-${cable.id}`}
                className="cursor-pointer group"
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  onHoverThematicItem?.(cable, e);
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  onHoverThematicItem?.(null);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClickThematicItem?.(cable, e);
                }}
              >
                {/* Generous Hitbox */}
                <path
                  d={cable.d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={180}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Outer Oceanic Fiber Glow */}
                <path
                  d={cable.d}
                  fill="none"
                  stroke={cable.color}
                  strokeWidth={isHovered ? cable.strokeWidth + 28 : cable.strokeWidth + 12}
                  strokeOpacity={isHovered ? 0.65 : 0.35}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-200"
                />

                {/* Active Cable Core with Photon Dash Pulse */}
                <path
                  d={cable.d}
                  fill="none"
                  stroke={cable.color}
                  strokeWidth={isHovered ? cable.strokeWidth + 8 : cable.strokeWidth}
                  strokeDasharray={cable.dashArray || '36 18'}
                  strokeOpacity={0.98}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <animate attributeName="stroke-dashoffset" values="0;400" dur={`${cable.speedSec * 3}s`} repeatCount="indefinite" />
                </path>

                {/* Traveling Optical Photon Packet */}
                <circle r={32} fill={cable.color} opacity={0.65}>
                  <animateMotion dur={`${cable.speedSec}s`} repeatCount="indefinite" path={cable.d} />
                </circle>
                <circle r={18} fill="#ffffff">
                  <animateMotion dur={`${cable.speedSec}s`} repeatCount="indefinite" path={cable.d} />
                </circle>
              </g>
            );
          })}
        </g>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. SUBSEA CABLE LANDING STATIONS (Coastal Teleport Hubs) */}
      {/* ---------------------------------------------------- */}
      {showStations && (
        <g id="thematic-landing-stations-group">
          {SUBSEA_LANDING_STATIONS.map((station) => {
            const isHovered = hoveredThematicItem?.id === station.id;
            const offsetX = station.labelOffset?.x ?? 0;
            const offsetY = station.labelOffset?.y ?? 130;
            const hasOffset = Math.abs(offsetX) > 40 || Math.abs(offsetY) > 60;
            const labelText = `🌐 ${station.city} Landing Station`;
            const pillWidth = Math.max(340, labelText.length * 24 + 80);

            return (
              <g
                key={`landing-${station.id}`}
                transform={`translate(${station.x}, ${station.y})`}
                className="cursor-pointer group"
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  onHoverThematicItem?.(station, e);
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  onHoverThematicItem?.(null);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClickThematicItem?.(station, e);
                }}
              >
                {/* Hitbox */}
                <circle cx="0" cy="0" r="140" fill="transparent" />

                {/* Concentric Teleport Ring */}
                <circle cx="0" cy="0" r="28" fill="none" stroke="#00f0ff" strokeWidth="6" opacity="0.8">
                  <animate attributeName="r" values="28;110" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="2.4s" repeatCount="indefinite" />
                </circle>

                {/* Hexagonal Core Marker */}
                <polygon
                  points="0,-32 28,-16 28,16 0,32 -28,16 -28,-16"
                  fill="#082f49"
                  stroke={isHovered ? '#ffffff' : '#00f0ff'}
                  strokeWidth="5"
                  className="transition-all duration-200"
                />
                <circle cx="0" cy="0" r="10" fill="#00f0ff" />

                {/* High-Legibility Pill */}
                <g transform={`translate(${offsetX}, ${offsetY})`} className="pointer-events-none">
                  {hasOffset && (
                    <line
                      x1={-offsetX * 0.7}
                      y1={-offsetY * 0.7}
                      x2={0}
                      y2={0}
                      stroke="#0284c7"
                      strokeWidth="3.5"
                      strokeDasharray="6 4"
                      opacity="0.85"
                    />
                  )}
                  <rect
                    x={-pillWidth / 2}
                    y="-30"
                    width={pillWidth}
                    height="60"
                    rx="30"
                    fill="#ffffff"
                    fillOpacity="0.98"
                    stroke={isHovered ? '#0f172a' : '#0284c7'}
                    strokeWidth={isHovered ? '4.5' : '3'}
                  />
                  <text
                    x="0"
                    y="11"
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="36"
                    fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    fontWeight="800"
                    letterSpacing="0.01em"
                  >
                    {labelText}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. POWER POOLS & HIGH-VOLTAGE TRANSMISSION LINES */}
      {/* ---------------------------------------------------- */}
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
              {/* Broad Invisible Hitbox */}
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

              {/* Foreground Animated Dashed Corridor */}
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

              {/* Traveling Photon Pulse */}
              <circle r={32} fill={corridor.color} opacity={0.6}>
                <animateMotion dur={`${corridor.speedSec}s`} repeatCount="indefinite" path={corridor.d} />
              </circle>
              <circle r={18} fill="#ffffff">
                <animateMotion dur={`${corridor.speedSec}s`} repeatCount="indefinite" path={corridor.d} />
              </circle>
            </g>
          );
        })}
      </g>

      {/* ---------------------------------------------------- */}
      {/* 5. CONFLICT & SECURITY BEACONS (ACLED Intensity Classified) */}
      {/* ---------------------------------------------------- */}
      {showConflicts && (
        <g id="thematic-conflict-beacons-group">
          {CONFLICT_BEACONS_DATA.map((beacon) => {
            const isHovered = hoveredThematicItem?.id === beacon.id;
            const offsetX = beacon.labelOffset?.x ?? 0;
            const offsetY = beacon.labelOffset?.y ?? 130;
            const hasOffset = Math.abs(offsetX) > 40 || Math.abs(offsetY) > 50;
            const badgeIcon = CONFLICT_CATEGORY_CONFIG[beacon.category].badge.split(' ')[0];
            const labelText = `${badgeIcon} ${beacon.name}`;
            const pillWidth = Math.max(340, labelText.length * 24 + 80);

            return (
              <g
                key={`conflict-${beacon.id}`}
                transform={`translate(${beacon.x}, ${beacon.y})`}
                className="cursor-pointer group"
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  onHoverThematicItem?.(beacon, e);
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  onHoverThematicItem?.(null);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClickThematicItem?.(beacon, e);
                }}
              >
                {/* Hitbox */}
                <circle cx="0" cy="0" r="140" fill="transparent" />

                {/* Threat Ripple Wave */}
                <circle cx="0" cy="0" r={beacon.radius} fill="none" stroke={beacon.color} strokeWidth="6" opacity="0.8">
                  <animate attributeName="r" values={`${beacon.radius};${beacon.radius * 3.2}`} dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.85;0" dur="2.2s" repeatCount="indefinite" />
                </circle>

                {/* Threat Core */}
                <circle
                  cx="0"
                  cy="0"
                  r={isHovered ? beacon.radius + 8 : beacon.radius}
                  fill={beacon.color}
                  stroke="#ffffff"
                  strokeWidth="5"
                  className="transition-all duration-200"
                />
                <circle cx="0" cy="0" r={isHovered ? 14 : 9} fill="#ffffff" />

                {/* High-Legibility Scaled Pill */}
                <g transform={`translate(${offsetX}, ${offsetY})`} className="pointer-events-none">
                  {hasOffset && (
                    <line
                      x1={-offsetX * 0.7}
                      y1={-offsetY * 0.7}
                      x2={0}
                      y2={0}
                      stroke={beacon.color}
                      strokeWidth="3.5"
                      strokeDasharray="6 4"
                      opacity="0.85"
                    />
                  )}
                  <rect
                    x={-pillWidth / 2}
                    y="-30"
                    width={pillWidth}
                    height="60"
                    rx="30"
                    fill="#ffffff"
                    fillOpacity="0.98"
                    stroke={isHovered ? '#0f172a' : beacon.color}
                    strokeWidth={isHovered ? '4.5' : '3'}
                  />
                  <text
                    x="0"
                    y="11"
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="36"
                    fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    fontWeight="800"
                    letterSpacing="0.01em"
                  >
                    {labelText}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      )}

      {/* ---------------------------------------------------- */}
      {/* 6. SOCIAL INFRASTRUCTURE: HOSPITALS & UNIVERSITIES */}
      {/* ---------------------------------------------------- */}
      <g id="thematic-social-facilities-group">
        {/* Hospitals (Cyan Proportional Bubbles) */}
        {filteredHospitals.map((hosp) => {
          const isHovered = hoveredThematicItem?.id === hosp.id;
          const offsetX = hosp.labelOffset?.x ?? 0;
          const offsetY = hosp.labelOffset?.y ?? 130;
          const hasOffset = Math.abs(offsetX) > 40 || Math.abs(offsetY) > 50;
          const labelText = `🏥 ${hosp.name} (${hosp.capacityValue} Beds)`;
          const pillWidth = Math.max(360, labelText.length * 24 + 80);

          return (
            <g
              key={`hosp-${hosp.id}`}
              transform={`translate(${hosp.x}, ${hosp.y})`}
              className="cursor-pointer group"
              onMouseEnter={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(hosp, e);
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClickThematicItem?.(hosp, e);
              }}
            >
              <circle cx="0" cy="0" r="140" fill="transparent" />

              {/* Hospital Pulse Ring */}
              <circle cx="0" cy="0" r={hosp.radius} fill="none" stroke="#06b6d4" strokeWidth="5" opacity="0.8">
                <animate attributeName="r" values={`${hosp.radius};${hosp.radius * 2.8}`} dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="2.6s" repeatCount="indefinite" />
              </circle>

              {/* Core Hospital Node */}
              <circle
                cx="0"
                cy="0"
                r={isHovered ? hosp.radius + 6 : hosp.radius}
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="5"
                className="transition-all duration-200"
              />
              {/* Cross Glyph */}
              <path
                d="M -5 -15 L 5 -15 L 5 -5 L 15 -5 L 15 5 L 5 5 L 5 15 L -5 15 L -5 5 L -15 5 L -15 -5 L -5 -5 Z"
                fill="#ffffff"
                transform="scale(1.2)"
              />

              <g transform={`translate(${offsetX}, ${offsetY})`} className="pointer-events-none">
                {hasOffset && (
                  <line
                    x1={-offsetX * 0.7}
                    y1={-offsetY * 0.7}
                    x2={0}
                    y2={0}
                    stroke="#0891b2"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    opacity="0.85"
                  />
                )}
                <rect
                  x={-pillWidth / 2}
                  y="-30"
                  width={pillWidth}
                  height="60"
                  rx="30"
                  fill="#ffffff"
                  fillOpacity="0.98"
                  stroke={isHovered ? '#0f172a' : '#0891b2'}
                  strokeWidth={isHovered ? '4.5' : '3'}
                />
                <text
                  x="0"
                  y="11"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="36"
                  fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  fontWeight="800"
                  letterSpacing="0.01em"
                >
                  {labelText}
                </text>
              </g>
            </g>
          );
        })}

        {/* Universities & Mega Schools (Amber / Gold Bubbles) */}
        {filteredSchools.map((univ) => {
          const isHovered = hoveredThematicItem?.id === univ.id;
          const offsetX = univ.labelOffset?.x ?? 0;
          const offsetY = univ.labelOffset?.y ?? 130;
          const hasOffset = Math.abs(offsetX) > 40 || Math.abs(offsetY) > 50;
          const labelText = `🎓 ${univ.name} (${(univ.capacityValue / 1000).toFixed(0)}k Enrolled)`;
          const pillWidth = Math.max(360, labelText.length * 24 + 80);

          return (
            <g
              key={`univ-${univ.id}`}
              transform={`translate(${univ.x}, ${univ.y})`}
              className="cursor-pointer group"
              onMouseEnter={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(univ, e);
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClickThematicItem?.(univ, e);
              }}
            >
              <circle cx="0" cy="0" r="140" fill="transparent" />

              <circle cx="0" cy="0" r={univ.radius} fill="none" stroke="#d97706" strokeWidth="5" opacity="0.8">
                <animate attributeName="r" values={`${univ.radius};${univ.radius * 2.8}`} dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="2.6s" repeatCount="indefinite" />
              </circle>

              <circle
                cx="0"
                cy="0"
                r={isHovered ? univ.radius + 6 : univ.radius}
                fill="#d97706"
                stroke="#ffffff"
                strokeWidth="5"
                className="transition-all duration-200"
              />
              <circle cx="0" cy="0" r={isHovered ? 14 : 9} fill="#ffffff" />

              <g transform={`translate(${offsetX}, ${offsetY})`} className="pointer-events-none">
                {hasOffset && (
                  <line
                    x1={-offsetX * 0.7}
                    y1={-offsetY * 0.7}
                    x2={0}
                    y2={0}
                    stroke="#d97706"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    opacity="0.85"
                  />
                )}
                <rect
                  x={-pillWidth / 2}
                  y="-30"
                  width={pillWidth}
                  height="60"
                  rx="30"
                  fill="#ffffff"
                  fillOpacity="0.98"
                  stroke={isHovered ? '#0f172a' : '#d97706'}
                  strokeWidth={isHovered ? '4.5' : '3'}
                />
                <text
                  x="0"
                  y="11"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="36"
                  fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  fontWeight="800"
                  letterSpacing="0.01em"
                >
                  {labelText}
                </text>
              </g>
            </g>
          );
        })}
      </g>

      {/* ---------------------------------------------------- */}
      {/* 7. UNESCO CULTURAL HERITAGE & EXPANDED SANCTUARIES */}
      {/* ---------------------------------------------------- */}
      <g id="thematic-heritage-reserves-group">
        {/* Cultural Monuments (Lalibela, Giza, Djenné, Great Zimbabwe, Axum) */}
        {filteredCultural.map((monument) => {
          const isHovered = hoveredThematicItem?.id === monument.id;
          const offsetX = monument.labelOffset?.x ?? 0;
          const offsetY = monument.labelOffset?.y ?? 130;
          const hasOffset = Math.abs(offsetX) > 40 || Math.abs(offsetY) > 50;
          const labelText = `🏛️ ${monument.name}`;
          const pillWidth = Math.max(360, labelText.length * 24 + 80);

          return (
            <g
              key={`cultural-${monument.id}`}
              transform={`translate(${monument.x}, ${monument.y})`}
              className="cursor-pointer group"
              onMouseEnter={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(monument, e);
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClickThematicItem?.(monument, e);
              }}
            >
              <circle cx="0" cy="0" r="140" fill="transparent" />

              {/* Cultural Gold Starburst Pulse */}
              <circle cx="0" cy="0" r={monument.radius} fill="none" stroke="#ca8a04" strokeWidth="5.5" opacity="0.85">
                <animate attributeName="r" values={`${monument.radius};${monument.radius * 2.8}`} dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.85;0" dur="2.8s" repeatCount="indefinite" />
              </circle>

              <polygon
                points="0,-36 28,-18 28,18 0,36 -28,18 -28,-18"
                fill="#ca8a04"
                stroke="#ffffff"
                strokeWidth="5"
                className="transition-all duration-200"
              />
              <circle cx="0" cy="0" r="9" fill="#ffffff" />

              <g transform={`translate(${offsetX}, ${offsetY})`} className="pointer-events-none">
                {hasOffset && (
                  <line
                    x1={-offsetX * 0.7}
                    y1={-offsetY * 0.7}
                    x2={0}
                    y2={0}
                    stroke="#ca8a04"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    opacity="0.85"
                  />
                )}
                <rect
                  x={-pillWidth / 2}
                  y="-30"
                  width={pillWidth}
                  height="60"
                  rx="30"
                  fill="#ffffff"
                  fillOpacity="0.98"
                  stroke={isHovered ? '#0f172a' : '#ca8a04'}
                  strokeWidth={isHovered ? '4.5' : '3'}
                />
                <text
                  x="0"
                  y="11"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="36"
                  fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  fontWeight="800"
                  letterSpacing="0.01em"
                >
                  {labelText}
                </text>
              </g>
            </g>
          );
        })}

        {/* Natural Sanctuaries (Kruger, Kilimanjaro, Victoria Falls, Virunga, Okavango) */}
        {filteredNatural.map((reserve) => {
          const isHovered = hoveredThematicItem?.id === reserve.id;
          const offsetX = reserve.labelOffset?.x ?? 0;
          const offsetY = reserve.labelOffset?.y ?? 130;
          const hasOffset = Math.abs(offsetX) > 40 || Math.abs(offsetY) > 50;
          const labelText = `🌿 ${reserve.name}`;
          const pillWidth = Math.max(360, labelText.length * 24 + 80);

          return (
            <g
              key={`natural-${reserve.id}`}
              transform={`translate(${reserve.x}, ${reserve.y})`}
              className="cursor-pointer group"
              onMouseEnter={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(reserve, e);
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                onHoverThematicItem?.(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClickThematicItem?.(reserve, e);
              }}
            >
              <circle cx="0" cy="0" r="140" fill="transparent" />

              <circle cx="0" cy="0" r={reserve.radius} fill="none" stroke="#059669" strokeWidth="5.5" opacity="0.85">
                <animate attributeName="r" values={`${reserve.radius};${reserve.radius * 2.8}`} dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.85;0" dur="2.8s" repeatCount="indefinite" />
              </circle>

              <circle
                cx="0"
                cy="0"
                r={isHovered ? reserve.radius + 6 : reserve.radius}
                fill="#059669"
                stroke="#ffffff"
                strokeWidth="5"
                className="transition-all duration-200"
              />
              {/* Tree / Leaf Icon */}
              <path
                d="M 0 -14 L 10 0 L 4 0 L 11 11 L -11 11 L -4 0 L -10 0 Z M -2 11 L -2 16 L 2 16 L 2 11 Z"
                fill="#ffffff"
                transform="scale(1.2)"
              />

              <g transform={`translate(${offsetX}, ${offsetY})`} className="pointer-events-none">
                {hasOffset && (
                  <line
                    x1={-offsetX * 0.7}
                    y1={-offsetY * 0.7}
                    x2={0}
                    y2={0}
                    stroke="#059669"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    opacity="0.85"
                  />
                )}
                <rect
                  x={-pillWidth / 2}
                  y="-30"
                  width={pillWidth}
                  height="60"
                  rx="30"
                  fill="#ffffff"
                  fillOpacity="0.98"
                  stroke={isHovered ? '#0f172a' : '#059669'}
                  strokeWidth={isHovered ? '4.5' : '3'}
                />
                <text
                  x="0"
                  y="11"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="36"
                  fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  fontWeight="800"
                  letterSpacing="0.01em"
                >
                  {labelText}
                </text>
              </g>
            </g>
          );
        })}
      </g>

      {/* ---------------------------------------------------- */}
      {/* 8. CONTINENTAL GROWTH NODES & MEGA-URBAN POLES */}
      {/* ---------------------------------------------------- */}
      <g id="thematic-nodes-group">
        {filteredNodes.map((node) => {
          const isHovered = hoveredThematicItem?.id === node.id;
          const offsetX = node.labelOffset?.x ?? 0;
          const offsetY = node.labelOffset?.y ?? (node.radius + 140);
          const hasSignificantOffset = Math.abs(offsetX) > 40 || Math.abs(offsetY) > 80;
          const pillWidth = Math.max(300, node.label.length * 26 + 80);

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
              {/* Large Invisible Hitbox (Radius 160) */}
              <circle cx="0" cy="0" r="160" fill="transparent" />

              {/* Radiating Ripple Wave 1 */}
              <circle cx="0" cy="0" r="28" fill="none" stroke={node.pulseColor} strokeWidth="8" opacity="0.85">
                <animate attributeName="r" values="28;130" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.85;0" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="8;0.8" dur="2.8s" repeatCount="indefinite" />
              </circle>

              {/* Radiating Ripple Wave 2 */}
              <circle cx="0" cy="0" r="28" fill="none" stroke={node.pulseColor} strokeWidth="8" opacity="0.85">
                <animate attributeName="r" values="28;130" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.85;0" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="8;0.8" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
              </circle>

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

              <circle
                cx="0"
                cy="0"
                r={isHovered ? node.radius + 8 : node.radius}
                fill={node.color}
                stroke="#ffffff"
                strokeWidth="6"
                className="transition-all duration-200 shadow-2xl"
              />

              <circle
                cx="0"
                cy="0"
                r={isHovered ? 14 : 9}
                fill="#ffffff"
                className="transition-all duration-200"
              />

              {/* High-Legibility Scaled Pill Label */}
              <g transform={`translate(${offsetX}, ${offsetY})`} className="pointer-events-none">
                {hasSignificantOffset && (
                  <line
                    x1={-offsetX * 0.75}
                    y1={-offsetY * 0.75}
                    x2={0}
                    y2={0}
                    stroke={node.color}
                    strokeWidth="4"
                    strokeDasharray="8 6"
                    opacity="0.85"
                  />
                )}

                <rect
                  x={-pillWidth / 2}
                  y="-32"
                  width={pillWidth}
                  height="64"
                  rx="32"
                  fill="#ffffff"
                  fillOpacity="0.98"
                  stroke={isHovered ? '#0f172a' : node.color}
                  strokeWidth={isHovered ? '4.5' : '3'}
                />

                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="38"
                  fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  fontWeight="800"
                  letterSpacing="0.01em"
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
