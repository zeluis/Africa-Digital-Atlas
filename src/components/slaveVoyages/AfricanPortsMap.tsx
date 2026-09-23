/**
 * AfricanPortsMap.tsx
 * Interactive Cartographic Visualizer of African Embarkation Ports, Forts, and Coastal Enclaves
 * Built with parchment/editorial museum aesthetics and proportional geographic bubbles.
 */

import React, { useState, useMemo } from 'react';
import {
  Castle,
  Shield,
  Anchor,
  Compass,
  Filter,
  Info,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Users,
  Building,
  MapPin
} from 'lucide-react';
import { AFRICAN_EMBARKATION_PORTS, AfricanEmbarkationPort } from '../../data/slaveVoyagesPorts';
import { AfricaVectorContinent } from '../common/AfricaVectorContinent';

interface AfricanPortsMapProps {
  onSelectPort?: (port: AfricanEmbarkationPort) => void;
}

export const AfricanPortsMap: React.FC<AfricanPortsMapProps> = ({ onSelectPort }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedPower, setSelectedPower] = useState<string>('All');
  const [selectedCentury, setSelectedCentury] = useState<string>('All');
  const [activePort, setActivePort] = useState<AfricanEmbarkationPort | null>(AFRICAN_EMBARKATION_PORTS[0]);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Filtered port list
  const filteredPorts = useMemo(() => {
    return AFRICAN_EMBARKATION_PORTS.filter(port => {
      const matchRegion = selectedRegion === 'All' || port.region === selectedRegion;
      const matchPower = selectedPower === 'All' || port.europeanPowers.includes(selectedPower as any);
      const matchCentury = selectedCentury === 'All' || port.activeCentury.includes(selectedCentury as any);
      return matchRegion && matchPower && matchCentury;
    });
  }, [selectedRegion, selectedPower, selectedCentury]);

  // Aggregate stats for current view
  const currentTotalEmbarkations = useMemo(() => {
    return filteredPorts.reduce((acc, p) => acc + p.estimatedEmbarkations, 0);
  }, [filteredPorts]);

  // Map projection coordinates:
  // Africa spans approximately: Longitude -18 to +52 (70 deg span), Latitude -36 to +38 (74 deg span)
  // SVG Canvas: 960 x 780
  const projectGeo = (lat: number, lng: number) => {
    const minLng = -22;
    const maxLng = 54;
    const minLat = -38;
    const maxLat = 38;

    const x = ((lng - minLng) / (maxLng - minLng)) * 900 + 30;
    // Invert Y for SVG coordinates
    const y = ((maxLat - lat) / (maxLat - minLat)) * 720 + 30;
    return { x, y };
  };

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'Senegambia': return '#0284c7'; // sky-600
      case 'Sierra Leone': return '#059669'; // emerald-600
      case 'Windward Coast': return '#10b981'; // emerald-500
      case 'Gold Coast': return '#d97706'; // amber-600
      case 'Bight of Benin': return '#ea580c'; // orange-600
      case 'Bight of Biafra': return '#dc2626'; // red-600
      case 'West Central Africa': return '#7c3aed'; // violet-600
      case 'Southeast Africa': return '#4338ca'; // indigo-700
      default: return '#78716c';
    }
  };

  return (
    <div className="bg-[#faf8f5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Curatorial Ribbon */}
      <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 bg-[#f5f0e6]/70 dark:bg-stone-900/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-sans font-semibold text-stone-500 dark:text-stone-400">
                Cartographic Corpus · 45+ Coastal Forts & Enclaves
              </span>
              <span className="text-stone-300 dark:text-stone-700">·</span>
              <span className="text-xs font-mono font-medium text-amber-800 dark:text-amber-400">
                1514–1866 CE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
              African Embarkation Ports, Fortresses & River Enclaves
            </h2>
            <p className="text-xs sm:text-sm font-serif text-stone-600 dark:text-stone-400 mt-1 max-w-3xl">
              From the stone slave dungeons of Elmina and Cape Coast to the river barracoons of Bonny and Luanda. Bubble diameters indicate proportional documented captive embarkations.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/80 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-200 dark:border-stone-700 shrink-0">
            <div>
              <div className="text-[10px] font-sans uppercase tracking-wider text-stone-500">Active Ports</div>
              <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {filteredPorts.length} <span className="text-xs text-stone-400 font-normal">/ 45</span>
              </div>
            </div>
            <div className="h-8 w-px bg-stone-200 dark:bg-stone-700" />
            <div>
              <div className="text-[10px] font-sans uppercase tracking-wider text-stone-500">Filtered Embarkations</div>
              <div className="text-lg font-mono font-bold text-amber-800 dark:text-amber-400 tabular-nums">
                {(currentTotalEmbarkations / 1_000_000).toFixed(2)}M
              </div>
            </div>
          </div>
        </div>

        {/* Filters Deck */}
        <div className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter By:</span>
          </div>

          {/* Region Selector */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-800 dark:text-stone-200 font-medium focus:ring-1 focus:ring-amber-600 outline-none"
          >
            <option value="All">All 8 Coastal Regions</option>
            <option value="Senegambia">Senegambia</option>
            <option value="Sierra Leone">Sierra Leone & Upper Guinea</option>
            <option value="Windward Coast">Windward Coast</option>
            <option value="Gold Coast">Gold Coast (42+ Forts)</option>
            <option value="Bight of Benin">Bight of Benin (Slave Coast)</option>
            <option value="Bight of Biafra">Bight of Biafra</option>
            <option value="West Central Africa">West Central Africa (Luanda/Congo)</option>
            <option value="Southeast Africa">Southeast Africa & Mozambique</option>
          </select>

          {/* European Power Selector */}
          <select
            value={selectedPower}
            onChange={(e) => setSelectedPower(e.target.value)}
            className="text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-800 dark:text-stone-200 font-medium focus:ring-1 focus:ring-amber-600 outline-none"
          >
            <option value="All">All European Flags</option>
            <option value="Portugal">Portugal (Luso-African / Brazil)</option>
            <option value="Great Britain">Great Britain (Royal African Co.)</option>
            <option value="France">France (Compagnie des Indes)</option>
            <option value="Netherlands">Netherlands (Dutch WIC)</option>
            <option value="Denmark">Denmark (Danish Gold Coast)</option>
          </select>

          {/* Century Selector */}
          <select
            value={selectedCentury}
            onChange={(e) => setSelectedCentury(e.target.value)}
            className="text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-800 dark:text-stone-200 font-medium focus:ring-1 focus:ring-amber-600 outline-none"
          >
            <option value="All">All Centuries (1500–1867)</option>
            <option value="16th">16th Century (Iberian Pioneer Era)</option>
            <option value="17th">17th Century (Chartered Monopoly Era)</option>
            <option value="18th">18th Century (Peak British/French Traffic)</option>
            <option value="19th">19th Century (Illicit Brazil/Cuba Traffic)</option>
          </select>

          {(selectedRegion !== 'All' || selectedPower !== 'All' || selectedCentury !== 'All') && (
            <button
              onClick={() => {
                setSelectedRegion('All');
                setSelectedPower('All');
                setSelectedCentury('All');
              }}
              className="text-xs text-amber-800 dark:text-amber-400 hover:underline font-medium ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas & Detail Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Interactive SVG Map Column */}
        <div className="lg:col-span-8 p-3 sm:p-6 relative flex flex-col items-center justify-center bg-[#faf7f2] dark:bg-stone-950 select-none">
          <svg
            viewBox="0 0 960 780"
            className="w-full h-auto max-h-[650px] drop-shadow-sm"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            <defs>
              <pattern id="parchment-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 162, 158, 0.15)" strokeWidth="0.5" />
              </pattern>
              <radialGradient id="ocean-radial" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#f3eee3" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#e8dfce" stopOpacity="0.4" />
              </radialGradient>
            </defs>

            {/* Ocean & Graticule Canvas */}
            <rect width="960" height="780" fill="url(#ocean-radial)" rx="12" />
            <rect width="960" height="780" fill="url(#parchment-grid)" rx="12" />

            {/* Stylized Hairline Graticule Lines */}
            {/* Equator */}
            <line x1="30" y1="390" x2="930" y2="390" stroke="#78716c" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
            <text x="40" y="386" fill="#78716c" fontSize="9" fontFamily="serif" opacity="0.7">Equator (0°)</text>

            {/* Prime Meridian */}
            <line x1="285" y1="30" x2="285" y2="750" stroke="#78716c" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
            <text x="290" y="45" fill="#78716c" fontSize="9" fontFamily="serif" opacity="0.7">Prime Meridian (0°)</text>

            {/* Tropic of Cancer (23.5 N) */}
            <line x1="30" y1="168" x2="930" y2="168" stroke="#78716c" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
            <text x="40" y="164" fill="#78716c" fontSize="8" fontFamily="serif" opacity="0.5">Tropic of Cancer (23.5° N)</text>

            {/* Tropic of Capricorn (23.5 S) */}
            <line x1="30" y1="613" x2="930" y2="613" stroke="#78716c" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
            <text x="40" y="609" fill="#78716c" fontSize="8" fontFamily="serif" opacity="0.5">Tropic of Capricorn (23.5° S)</text>

            {/* Authoritative African Continent Vector Map (5,796 × 5,867 Native Precision) */}
            <AfricaVectorContinent
              x="60"
              y="20"
              width="850"
              height="710"
              mode="embarkation_zones"
              theme="embarkation"
              strokeWidth={1.2}
              activeRegion={selectedRegion !== 'All' ? selectedRegion : hoveredRegion}
              highlightRegions={selectedRegion !== 'All' ? [selectedRegion] : []}
              onRegionClick={(reg) => setSelectedRegion(reg === selectedRegion ? 'All' : reg)}
              onRegionHover={(reg) => setHoveredRegion(reg)}
            />

            {/* Interactive Port Markers */}
            {filteredPorts.map((port) => {
              const { x, y } = projectGeo(port.coordinates.lat, port.coordinates.lng);
              const isSelected = activePort?.id === port.id;
              const isItemHovered = isHovered === port.id;
              const regionColor = getRegionColor(port.region);

              // Proportional radius based on embarkations:
              // Min radius 5px (for ~60k), max radius 24px (for Luanda 2.84M)
              const radius = Math.max(5, Math.min(24, Math.sqrt(port.estimatedEmbarkations / 5000)));

              return (
                <g
                  key={port.id}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => {
                    setActivePort(port);
                    onSelectPort?.(port);
                  }}
                  onMouseEnter={() => setIsHovered(port.id)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  {/* Outer pulse wave for selected port */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r={radius + 8}
                      fill="none"
                      stroke={regionColor}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                  )}

                  {/* Proportional Embarkation Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={regionColor}
                    fillOpacity={isSelected || isItemHovered ? 0.9 : 0.65}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2.5 : 1.2}
                    className="transition-transform duration-150"
                  />

                  {/* Castle / Anchor icon indicator inside circle if large enough */}
                  {radius >= 12 && (
                    <circle
                      cx={x}
                      cy={y}
                      r={2.5}
                      fill="#ffffff"
                    />
                  )}

                  {/* Label for notable ports or hovered/selected */}
                  {(isSelected || isItemHovered || radius > 14) && (
                    <g transform={`translate(${x + radius + 4}, ${y + 3})`}>
                      <rect
                        x="-2"
                        y="-10"
                        width={port.name.length * 5.8 + 8}
                        height="14"
                        fill="rgba(255, 255, 255, 0.92)"
                        stroke="#d6cebe"
                        strokeWidth="0.5"
                        rx="3"
                      />
                      <text
                        x="2"
                        y="0"
                        fill="#1c1917"
                        fontSize="9"
                        fontWeight={isSelected ? 'bold' : '600'}
                        fontFamily="serif"
                      >
                        {port.name.split(' (')[0]}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Map Legend (Bottom Left) */}
            <g transform="translate(40, 640)">
              <rect width="210" height="90" fill="rgba(255, 255, 255, 0.88)" stroke="#d6cebe" strokeWidth="0.8" rx="8" />
              <text x="12" y="18" fill="#44403c" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                REGIONAL CLUSTERS
              </text>
              <circle cx="18" cy="34" r="5" fill="#d97706" />
              <text x="30" y="37" fill="#44403c" fontSize="9" fontFamily="sans-serif">Gold Coast (42+ Forts)</text>

              <circle cx="18" cy="50" r="5" fill="#ea580c" />
              <text x="30" y="53" fill="#44403c" fontSize="9" fontFamily="sans-serif">Bight of Benin (Ouidah/Lagos)</text>

              <circle cx="18" cy="66" r="6" fill="#7c3aed" />
              <text x="30" y="69" fill="#44403c" fontSize="9" fontFamily="sans-serif">West Central Africa (Luanda/Soyo)</text>

              <circle cx="120" cy="34" r="4" fill="#dc2626" />
              <text x="132" y="37" fill="#44403c" fontSize="9" fontFamily="sans-serif">Biafra (Bonny)</text>

              <circle cx="120" cy="50" r="4" fill="#0284c7" />
              <text x="132" y="53" fill="#44403c" fontSize="9" fontFamily="sans-serif">Senegambia</text>

              <circle cx="120" cy="66" r="4" fill="#4338ca" />
              <text x="132" y="69" fill="#44403c" fontSize="9" fontFamily="sans-serif">Southeast Africa</text>
            </g>
          </svg>

          {/* Quick Helper Banner */}
          <div className="mt-2 text-center text-xs font-serif text-stone-500 italic">
            Select any fortified enclave or trading roadstead along the coastline to inspect archival provenance.
          </div>
        </div>

        {/* Port Detail Inspector Column (Museum Accession Card) */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-white dark:bg-stone-900 border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-800 flex flex-col justify-between">
          {activePort ? (
            <div className="space-y-4">
              {/* Header Badges */}
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-widest text-[11px]">
                  {activePort.region}
                </span>
                <span>{activePort.countryModern}</span>
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {activePort.name}
                </h3>
                {activePort.historicalAliases.length > 0 && (
                  <p className="text-xs font-serif italic text-stone-500 mt-0.5">
                    Historical aliases: {activePort.historicalAliases.join(', ')}
                  </p>
                )}
              </div>

              {/* UNESCO World Heritage Tag */}
              {activePort.unescoWorldHeritage && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-800/60">
                  <Shield className="w-3.5 h-3.5 text-amber-700" />
                  <span>UNESCO World Heritage Site</span>
                </div>
              )}

              {/* Metric Highlights Grid */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-stone-200 dark:border-stone-800">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-sans text-stone-500">Est. Captives Embarked</div>
                  <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                    {activePort.estimatedEmbarkations.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-sans text-stone-500">Enclave Typology</div>
                  <div className="text-xs font-serif font-semibold text-stone-800 dark:text-stone-200 mt-1">
                    {activePort.fortOrType}
                  </div>
                </div>
              </div>

              {/* Archival Attributes List */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="font-semibold text-stone-700 dark:text-stone-300">European Powers: </span>
                  <span className="text-stone-600 dark:text-stone-400">
                    {activePort.europeanPowers.join(' · ')}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-stone-700 dark:text-stone-300">Indigenous Polity: </span>
                  <span className="text-stone-600 dark:text-stone-400">
                    {activePort.indigenousPolity}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-stone-700 dark:text-stone-300">Primary Peoples: </span>
                  <span className="text-stone-600 dark:text-stone-400">
                    {activePort.primaryEthnicGroups.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-stone-700 dark:text-stone-300">Disembarkation Hubs: </span>
                  <span className="text-stone-600 dark:text-stone-400">
                    {activePort.primaryDestinations.join('; ')}
                  </span>
                </div>
              </div>

              {/* Historical Narrative */}
              <div className="pt-2">
                <div className="text-[11px] font-sans uppercase tracking-wider font-semibold text-stone-500 mb-1">
                  Historical Record & Architecture
                </div>
                <p className="text-xs font-serif leading-relaxed text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg border border-stone-200/80 dark:border-stone-700/80">
                  {activePort.historicalDescription}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6 text-stone-400">
              <p className="text-sm font-serif italic">Select a coastal port from the map to review archival accession details.</p>
            </div>
          )}

          {/* Bottom Coordinates & Link */}
          {activePort && (
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-[11px] font-mono text-stone-500 flex items-center justify-between">
              <span>
                {activePort.coordinates.lat.toFixed(4)}° N, {activePort.coordinates.lng.toFixed(4)}° E
              </span>
              <a
                href={`https://www.slavevoyages.org/voyage/database`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-400 hover:underline font-serif"
              >
                <span>Consortium Ledger</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
