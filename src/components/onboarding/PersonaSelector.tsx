import React, { useState } from 'react';
import { 
  TreeDeciduous, 
  TrendingUp, 
  Compass, 
  Zap, 
  ArrowRight, 
  Sparkles,
  BarChart3,
  Globe2,
  Anchor,
  BookOpen
} from 'lucide-react';
import { CanonicalNavTab } from '../NavigationDrawer';

export interface PersonaTrack {
  id: string;
  stage: 'history' | 'economy';
  title: string;
  role: string;
  badge: string;
  targetTab: CanonicalNavTab;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  primaryTone: string; // calming hex
  accentBorder: string;
  accentBg: string;
  pillBg: string;
  pillText: string;
  recommendedFeatures: string[];
}

export const PERSONA_TRACKS: PersonaTrack[] = [
  {
    id: 'researcher',
    stage: 'history',
    title: 'Academic & Historical Researcher',
    role: 'Scholarly Archival Deep Dive',
    badge: 'TAST & Genetics',
    targetTab: 'ethnic-tree',
    icon: TreeDeciduous,
    description: 'Direct entry into the 36,000+ Transatlantic Slave Trade voyage archives, genealogical ethnolinguistic trees, and reparatory jurisprudence treatises.',
    primaryTone: '#9a5c36', // muted terracotta / earth
    accentBorder: 'border-stone-200 hover:border-amber-400',
    accentBg: 'bg-white hover:bg-amber-50/40',
    pillBg: 'bg-amber-50 border border-amber-200',
    pillText: 'text-amber-800',
    recommendedFeatures: ['Ethnic Atlas Map (Wikipedia Linked)', 'Voyage Transits & Ports', '42 Peer-Reviewed Treatises']
  },
  {
    id: 'economist',
    stage: 'economy',
    title: 'Policy, Macro & Trade Analyst',
    role: 'Sovereign Econometric Intelligence',
    badge: 'AfCFTA & Indicators',
    targetTab: 'overview',
    icon: TrendingUp,
    description: 'Multilateral indicator visualizers across 54 nations: GDP trajectories, AfCFTA trade flow dynamics, demographic projections, and energy corridors.',
    primaryTone: '#457a62', // calming sage/forest
    accentBorder: 'border-stone-200 hover:border-emerald-400',
    accentBg: 'bg-white hover:bg-emerald-50/40',
    pillBg: 'bg-emerald-50 border border-emerald-200',
    pillText: 'text-emerald-800',
    recommendedFeatures: ['54 Sovereign Dossiers', 'World Bank & IMF Feeds', 'Macroeconomic Correlator']
  },
  {
    id: 'diaspora',
    stage: 'history',
    title: 'Cultural & Diaspora Explorer',
    role: 'Living Heritage & Cartography',
    badge: 'Ancestry & Tongues',
    targetTab: 'regions',
    icon: Compass,
    description: 'Navigate the 5 UN GeoScheme macro-regions, 2,000+ living mother tongues, and deep ancestral connections linking the continent and global Diaspora.',
    primaryTone: '#6b668f', // soft lavender/slate
    accentBorder: 'border-stone-200 hover:border-indigo-400',
    accentBg: 'bg-white hover:bg-indigo-50/40',
    pillBg: 'bg-indigo-50 border border-indigo-200',
    pillText: 'text-indigo-800',
    recommendedFeatures: ['5 UN Geoscheme Zones', 'Linguistic Family Trees', 'Regional Cultural Profiles']
  },
  {
    id: 'fast-track',
    stage: 'economy',
    title: 'Data Journalist & Explorer',
    role: 'High-Velocity Interactive Tour',
    badge: 'Instant Map & GIS',
    targetTab: 'overview',
    icon: Zap,
    description: 'Get right into the live choropleth maps, compare nations side-by-side, and explore real-time weather and capital city coordinates.',
    primaryTone: '#3d7a64', // calming forest mineral
    accentBorder: 'border-stone-200 hover:border-emerald-400',
    accentBg: 'bg-white hover:bg-emerald-50/40',
    pillBg: 'bg-emerald-50 border border-emerald-200',
    pillText: 'text-emerald-800',
    recommendedFeatures: ['Live Weather & Coordinates', 'Bilateral Country Comparison', 'Full Vector Africa Canvas']
  }
];

interface PersonaSelectorProps {
  stage?: 'history' | 'economy' | 'all';
  onSelectTrack: (track: PersonaTrack) => void;
  selectedTrackId?: string;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  stage = 'all',
  onSelectTrack,
  selectedTrackId
}) => {
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const displayedTracks = stage === 'all' 
    ? PERSONA_TRACKS 
    : PERSONA_TRACKS.filter(t => t.stage === stage);

  const isEconomyStage = stage === 'economy';

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-3.5 h-3.5 ${isEconomyStage ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span className="text-xs font-mono font-medium tracking-wider uppercase text-stone-700">
            {stage === 'history' && 'Historical & Cultural Inquiry Tracks'}
            {stage === 'economy' && 'Socioeconomic & Data Intelligence Tracks'}
            {stage === 'all' && 'Tailor Your Experience • Choose Your Interest Track'}
          </span>
        </div>
        <span className="text-[11px] text-stone-500 hidden sm:inline">
          Tap a track to enter directly, or continue the full tour
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {displayedTracks.map((track) => {
          const Icon = track.icon;
          const isSelected = selectedTrackId === track.id;

          return (
            <button
              key={track.id}
              type="button"
              onClick={() => onSelectTrack(track)}
              onMouseEnter={() => setHoveredTrack(track.id)}
              onMouseLeave={() => setHoveredTrack(null)}
              className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 group relative backdrop-blur-md shadow-xs ${
                isSelected
                  ? isEconomyStage 
                    ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-400/30 shadow-md'
                    : 'bg-amber-50/60 border-amber-500 ring-2 ring-amber-400/30 shadow-md'
                  : `${track.accentBg} ${track.accentBorder}`
              }`}
            >
              <div className="flex items-start justify-between gap-2 w-full">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="p-2 rounded-xl text-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs"
                    style={{ backgroundColor: track.primaryTone }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-serif font-bold text-sm text-stone-900 transition-colors ${
                      isEconomyStage ? 'group-hover:text-emerald-900' : 'group-hover:text-amber-900'
                    }`}>
                      {track.title}
                    </h4>
                    <span className="text-[10px] text-stone-500 block font-mono">
                      {track.role}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap ${track.pillBg} ${track.pillText}`}>
                  {track.badge}
                </span>
              </div>

              <p className="text-xs text-stone-600 font-normal leading-relaxed">
                {track.description}
              </p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between w-full text-[11px]">
                <div className="flex items-center gap-1.5 text-stone-500">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: track.primaryTone }} />
                  <span className="truncate max-w-[200px]">{track.recommendedFeatures[0]}</span>
                </div>
                <div className={`flex items-center gap-1 font-medium group-hover:translate-x-0.5 transition-transform shrink-0 ${
                  isEconomyStage ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  <span>Enter Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
