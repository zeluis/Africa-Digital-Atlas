import React, { useState, useEffect, useMemo } from 'react';
import { atlas } from '../data/atlas-store';
import { AtlasEntity } from '../data/types';
import { 
  ThematicPillarId, 
  THEMATIC_PILLARS, 
  fetchWikipediaSummary, 
  WikiSummaryData, 
  getCuratedPillarNarrative 
} from '../services/wikipediaService';
import { ThematicPillarNav } from '../components/ThematicPillarNav';
import { EntityBlocsBrowser } from '../components/EntityBlocsBrowser';
import { CountryFlag } from '../components/CountryFlag';
import { getCountryRegionTonalPalette } from '../data/unGeoschemeColors';
import { 
  formatPopulation, 
  formatGDP, 
  formatCurrency, 
  formatPercentage, 
  formatHDI 
} from '../data/atlas-formatters';
import {
  ExternalLink,
  BookOpen,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Globe2,
  Calendar,
  Building,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Compass
} from 'lucide-react';

interface ThematicPillarsViewProps {
  initialEntityId?: string;
  initialPillar?: ThematicPillarId;
  onSelectCountry: (entityId: string) => void;
}

export const ThematicPillarsView: React.FC<ThematicPillarsViewProps> = ({
  initialEntityId = 'NGA',
  initialPillar = 'geography',
  onSelectCountry
}) => {
  const [selectedEntityId, setSelectedEntityId] = useState<string>(initialEntityId);
  const [activePillar, setActivePillar] = useState<ThematicPillarId>(initialPillar);
  const [wikiData, setWikiData] = useState<WikiSummaryData | null>(null);
  const [isLoadingWiki, setIsLoadingWiki] = useState<boolean>(false);
  const [showFullWiki, setShowFullWiki] = useState<boolean>(false);

  const countries = useMemo(() => atlas.getSovereignCountries(), []);
  const currentEntity = atlas.getEntity(selectedEntityId) || countries[0];
  const tonal = getCountryRegionTonalPalette(currentEntity.id);
  const currentPillarMeta = THEMATIC_PILLARS.find(p => p.id === activePillar) || THEMATIC_PILLARS[0];

  // Fetch Wikipedia summary on country change
  useEffect(() => {
    let isMounted = true;
    setIsLoadingWiki(true);
    setShowFullWiki(false);

    fetchWikipediaSummary(currentEntity.name)
      .then(data => {
        if (isMounted) {
          setWikiData(data);
          setIsLoadingWiki(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingWiki(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentEntity.name]);

  // Curated narrative fallback / enhancement
  const curatedNarrative = useMemo(() => {
    return getCuratedPillarNarrative(currentEntity.name, currentEntity.id, activePillar, currentEntity);
  }, [currentEntity, activePillar]);

  // Specific Pillar Data calculations
  const primaryIndicators = useMemo(() => {
    return currentPillarMeta.primaryIndicatorIds.map(indId => {
      const def = atlas.getIndicator(indId);
      const val = atlas.getIndicatorValue(currentEntity.id, indId);
      return {
        id: indId,
        name: def?.label || def?.name || indId,
        domain: def?.domain || 'Empirical',
        unit: def?.unit || '',
        value: val,
        source: def?.preferredSource || 'Harmonized'
      };
    });
  }, [currentEntity.id, currentPillarMeta]);

  // Country heritage sites if culture pillar
  const heritageSites = useMemo(() => {
    return atlas.getHeritageSites(currentEntity.id);
  }, [currentEntity.id]);

  const handleCountrySwitch = (id: string) => {
    setSelectedEntityId(id);
    onSelectCountry(id);
  };

  return (
    <div className="space-y-6 animate-enter-japandi">
      {/* Sticky 8-Pillar Navigation Ribbon */}
      <ThematicPillarNav
        activePillar={activePillar}
        onSelectPillar={setActivePillar}
        entityName={currentEntity.name}
      />

      {/* Top Country Selector & Pillar Hero Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-xl transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                PILLAR {currentPillarMeta.number} OF 8 • {currentPillarMeta.label.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {currentEntity.region}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-3">
              <CountryFlag entityId={currentEntity.id} size="md" />
              <span>{currentEntity.name}</span>
            </h1>

            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
              {currentPillarMeta.description}
            </p>
          </div>

          {/* Quick Country Switcher Select */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <select
              value={selectedEntityId}
              onChange={e => handleCountrySwitch(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold text-xs py-2.5 px-3.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {countries.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id}) — {c.region}
                </option>
              ))}
            </select>

            <a
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(currentEntity.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <span>Wikipedia</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main 2-Column Hybrid Layout: Editorial on Left, Empirical on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Wikipedia & Curated Narrative */}
        <div className="lg:col-span-7 space-y-6">
          {/* Wikipedia Narrative Card */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 space-y-6 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 font-display">
                  Encyclopedic Context & Analysis
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                Wikimedia REST API • Verified
              </span>
            </div>

            {/* Wikipedia Image & Lead Paragraph */}
            {wikiData?.thumbnailUrl && (
              <div className="flex flex-col sm:flex-row gap-5 items-start bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80">
                <img
                  src={wikiData.thumbnailUrl}
                  alt={currentEntity.name}
                  className="w-full sm:w-36 h-28 object-cover rounded-xl shadow-sm shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                    {wikiData.description || 'Sovereign African State'}
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-4">
                    {wikiData.extract}
                  </p>
                </div>
              </div>
            )}

            {/* Curated Pillar Narrative Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-display">
                {curatedNarrative.headline}
              </h4>
              {curatedNarrative.narrative.map((paragraph, idx) => (
                <p key={idx} className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Key Facts Summary Table */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                Key Strategic Facts & Baseline
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {curatedNarrative.keyFacts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between"
                  >
                    <span className="text-[10px] uppercase font-mono text-zinc-400">{fact.label}</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Pillar Sub-Section: Culture & Heritage Sites */}
            {activePillar === 'culture' && heritageSites.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                    UNESCO Inscribed Properties ({heritageSites.length})
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-400">World Heritage List</span>
                </div>
                <div className="space-y-2">
                  {heritageSites.map(site => (
                    <div
                      key={site.id}
                      className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{site.name}</div>
                        <div className="text-[11px] text-zinc-500 line-clamp-1">{site.description}</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 shrink-0">
                        {site.inscribedYear}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Empirical Indicator Deck */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display">
                  Empirical Indicator Deck
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                Live Data
              </span>
            </div>

            {/* Indicator Metric Cards */}
            <div className="space-y-3">
              {primaryIndicators.map(ind => {
                const formattedVal = ind.value !== null 
                  ? (typeof ind.value === 'number' && ind.value > 1000 ? ind.value.toLocaleString() : ind.value) 
                  : 'N/A';

                return (
                  <div
                    key={ind.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                        {ind.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        {ind.source}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                        {formattedVal}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">
                        {ind.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Regional Bloc Affiliation Quick Tag */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <div className="text-[10px] font-mono uppercase font-bold text-zinc-400">
                Sovereign Blocs & Communities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentEntity.blocs.map(bloc => (
                  <span
                    key={bloc}
                    className="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 font-mono"
                  >
                    {bloc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: 21 Entity Blocs Comparator & Browser */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <EntityBlocsBrowser
          onSelectCountry={handleCountrySwitch}
          initialBlocId="ECOWAS"
        />
      </div>
    </div>
  );
};
