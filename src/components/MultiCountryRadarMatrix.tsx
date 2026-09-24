import React, { useState, useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { atlas } from '../data/atlas-store';
import { AtlasEntity } from '../data/types';
import { CountryFlag } from './CountryFlag';
import { THEMATIC_PILLARS, ThematicPillarId } from '../services/wikipediaService';
import { 
  Sparkles, 
  Layers, 
  Award, 
  BarChart3, 
  Info, 
  Compass, 
  TrendingUp, 
  Zap, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Trees 
} from 'lucide-react';

interface MultiCountryRadarMatrixProps {
  countries: AtlasEntity[];
  onSelectCountry?: (entityId: string) => void;
}

// Distinct high-contrast palette for compared nations
export const COUNTRY_RADAR_COLORS = [
  { stroke: '#10B981', fill: '#10B981', name: 'Emerald', hex: '#10B981' },
  { stroke: '#F59E0B', fill: '#F59E0B', name: 'Amber', hex: '#F59E0B' },
  { stroke: '#6366F1', fill: '#6366F1', name: 'Indigo', hex: '#6366F1' },
  { stroke: '#EC4899', fill: '#EC4899', name: 'Rose', hex: '#EC4899' },
];

interface PillarScoreData {
  pillarId: ThematicPillarId;
  pillarName: string;
  shortName: string;
  icon: React.ReactNode;
  description: string;
  scores: Record<string, number>;
  rawMetrics: Record<string, string>;
}

// Normalized indicator helpers (0 - 100 benchmark against continental extremes)
function computePillarScores(countryId: string): { scores: Record<ThematicPillarId, number>; raw: Record<ThematicPillarId, string> } {
  const entity = atlas.getEntity(countryId);
  if (!entity) {
    return {
      scores: {
        geography: 50,
        history: 50,
        people: 50,
        languages: 50,
        culture: 50,
        climate: 50,
        economy: 50,
        future: 50,
      },
      raw: {
        geography: '—',
        history: '—',
        people: '—',
        languages: '—',
        culture: '—',
        climate: '—',
        economy: '—',
        future: '—',
      }
    };
  }

  // 1. Geography: Land Area (log-scaled) & Maritime access
  const area = entity.landAreaKm2 || 100000;
  const geoScore = Math.min(100, Math.max(25, Math.round((Math.log10(area) - 3) * 30)));

  // 2. History: Liberation & Sovereign Consolidation
  const unDate = entity.independenceYear || (entity.unMemberDate ? parseInt(entity.unMemberDate.slice(0, 4), 10) : 1960);
  const yearsIndependence = Math.max(0, 2026 - unDate);
  const histScore = Math.min(100, Math.max(35, Math.round(yearsIndependence * 1.1 + 20)));

  // 3. People: HDI & Life Expectancy
  const hdi = atlas.getIndicatorValue(countryId, 'UNDP.HDI.INDEX') || 0.52;
  const lifeExp = atlas.getIndicatorValue(countryId, 'SP.DYN.LE00.IN') || 63;
  const peopleScore = Math.min(100, Math.max(20, Math.round(hdi * 85 + (lifeExp / 80) * 25)));

  // 4. Languages & Literacy
  const literacy = atlas.getIndicatorValue(countryId, 'SE.ADT.LITR.ZS') || 65;
  const langCount = (entity.languages?.official?.length || 1) + (entity.languages?.national?.length || 0);
  const langScore = Math.min(100, Math.max(25, Math.round(literacy * 0.8 + Math.min(langCount * 5, 20))));

  // 5. Culture & Heritage
  const heritageSites = atlas.getHeritageSites(countryId).length;
  const cultureScore = Math.min(100, Math.max(30, Math.round(35 + heritageSites * 12)));

  // 6. Climate & Ecological Resilience
  const renewables = atlas.getIndicatorValue(countryId, 'EG.FEC.RNEW.ZS') || 40;
  const climateScore = Math.min(100, Math.max(25, Math.round(renewables * 0.9 + 15)));

  // 7. Economy & Sovereignty
  const gdp = atlas.getIndicatorValue(countryId, 'NY.GDP.MKTP.CD') || 10;
  const growth = atlas.getIndicatorValue(countryId, 'NY.GDP.MKTP.KD.ZG') || 3.5;
  const gdpScore = Math.min(100, Math.max(25, Math.round(Math.log10(Math.max(1, gdp)) * 25 + growth * 4)));

  // 8. Future & Innovation
  const electricity = atlas.getIndicatorValue(countryId, 'EG.ELC.ACCS.ZS') || 50;
  const futureScore = Math.min(100, Math.max(20, Math.round(electricity * 0.9 + 12)));

  return {
    scores: {
      geography: geoScore,
      history: histScore,
      people: peopleScore,
      languages: langScore,
      culture: cultureScore,
      climate: climateScore,
      economy: gdpScore,
      future: futureScore,
    },
    raw: {
      geography: `${(area).toLocaleString()} km²`,
      history: `UN Member ${unDate}`,
      people: `HDI: ${(hdi).toFixed(3)} • ${lifeExp.toFixed(1)} yrs`,
      languages: `${literacy.toFixed(0)}% Literacy • ${langCount} Tongues`,
      culture: `${heritageSites} UNESCO Sites`,
      climate: `${renewables.toFixed(0)}% Renewable Energy`,
      economy: `$${gdp.toFixed(1)}B GDP • ${growth.toFixed(1)}% Growth`,
      future: `${electricity.toFixed(0)}% Power Access`,
    }
  };
}

export const MultiCountryRadarMatrix: React.FC<MultiCountryRadarMatrixProps> = ({
  countries,
  onSelectCountry
}) => {
  const [activeView, setActiveView] = useState<'radar' | 'cards' | 'both'>('both');
  const [hoveredPillar, setHoveredPillar] = useState<ThematicPillarId | null>(null);

  // Compute scores for each country
  const countryDossiers = useMemo(() => {
    return countries.map((c, idx) => {
      const { scores, raw } = computePillarScores(c.id);
      const color = COUNTRY_RADAR_COLORS[idx % COUNTRY_RADAR_COLORS.length];
      return {
        country: c,
        scores,
        raw,
        color,
        overallAvg: Math.round(
          Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
        )
      };
    });
  }, [countries]);

  // Transform into Recharts Radar dataset
  const radarChartData = useMemo(() => {
    const pillars: { id: ThematicPillarId; short: string; label: string }[] = [
      { id: 'geography', short: 'Geography', label: 'Physical Geography' },
      { id: 'history', short: 'History', label: 'Historiography' },
      { id: 'people', short: 'People & HDI', label: 'Human Development' },
      { id: 'languages', short: 'Languages', label: 'Linguistic Phyla' },
      { id: 'culture', short: 'Culture', label: 'Heritage & Arts' },
      { id: 'climate', short: 'Climate', label: 'Resilience & Biomes' },
      { id: 'economy', short: 'Economy', label: 'Macroeconomic Growth' },
      { id: 'future', short: 'Future', label: 'Agenda 2063' },
    ];

    return pillars.map(p => {
      const entry: Record<string, any> = {
        pillar: p.short,
        pillarId: p.id,
        fullName: p.label
      };
      countryDossiers.forEach(cd => {
        entry[cd.country.id] = cd.scores[p.id];
      });
      return entry;
    });
  }, [countryDossiers]);

  return (
    <div className="space-y-6">
      {/* Control Bar & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 md:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm md:text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>8-Pillar Comparative Spider Matrix</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                0–100 Scale
              </span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Harmonized econometric, spatial, and sociological benchmarks across all 8 Pan-African Pillars.
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveView('both')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeView === 'both'
                ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white shadow-xs font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Dual View
          </button>
          <button
            type="button"
            onClick={() => setActiveView('radar')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeView === 'radar'
                ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white shadow-xs font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Radar Only
          </button>
          <button
            type="button"
            onClick={() => setActiveView('cards')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeView === 'cards'
                ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white shadow-xs font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Pillars Grid
          </button>
        </div>
      </div>

      {/* Main Radar Layout Grid */}
      <div className={`grid gap-6 ${activeView === 'both' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        
        {/* Radar Spider Chart Canvas */}
        {(activeView === 'radar' || activeView === 'both') && (
          <div className={`${activeView === 'both' ? 'lg:col-span-6' : 'w-full'} p-4 md:p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Multivariate Radial Footprint
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {countryDossiers.length} Nations Overlaid
                </span>
              </div>

              {/* Responsive Radar Chart */}
              <div className="h-[340px] md:h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                    <PolarGrid stroke="#e4e4e7" strokeDasharray="3 3" className="dark:stroke-zinc-800" />
                    <PolarAngleAxis 
                      dataKey="pillar" 
                      tick={{ fill: '#71717a', fontSize: 11, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fill: '#a1a1aa', fontSize: 9 }}
                      stroke="#d4d4d8"
                      className="dark:stroke-zinc-800"
                    />
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-xs space-y-2 min-w-[200px]">
                            <div className="font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-1">
                              {data.fullName}
                            </div>
                            <div className="space-y-1.5">
                              {payload.map((item, idx) => {
                                const cd = countryDossiers.find(c => c.country.id === item.dataKey);
                                if (!cd) return null;
                                return (
                                  <div key={idx} className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{cd.country.name}</span>
                                    </div>
                                    <span className="font-mono font-bold" style={{ color: item.color }}>
                                      {item.value}/100
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }}
                    />
                    {countryDossiers.map(cd => (
                      <Radar
                        key={cd.country.id}
                        name={cd.country.name}
                        dataKey={cd.country.id}
                        stroke={cd.color.stroke}
                        fill={cd.color.fill}
                        fillOpacity={0.25}
                        strokeWidth={2.5}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Country Color Legend Badges */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-center gap-3">
              {countryDossiers.map(cd => (
                <div 
                  key={cd.country.id}
                  onClick={() => onSelectCountry?.(cd.country.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
                >
                  <span className="w-3 h-3 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: cd.color.hex }} />
                  <CountryFlag entityId={cd.country.id} size="sm" />
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{cd.country.name}</span>
                  <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                    {cd.overallAvg} avg
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8 Pillars Breakdown Table & Leaderboard Cards */}
        {(activeView === 'cards' || activeView === 'both') && (
          <div className={`${activeView === 'both' ? 'lg:col-span-6' : 'w-full'} space-y-3`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'geography' as ThematicPillarId, name: 'Physical Geography', icon: Compass, leadMetric: 'Territory & Spatial Morphology' },
                { id: 'history' as ThematicPillarId, name: 'History & Sovereignty', icon: ShieldCheck, leadMetric: 'Liberation & State Longevity' },
                { id: 'people' as ThematicPillarId, name: 'Demography & HDI', icon: Users, leadMetric: 'Human Development & Life Span' },
                { id: 'languages' as ThematicPillarId, name: 'Linguistic Phyla', icon: BookOpen, leadMetric: 'Literacy & Polyglot Lineages' },
                { id: 'culture' as ThematicPillarId, name: 'Heritage & Culture', icon: Award, leadMetric: 'UNESCO Sites & Material Heritage' },
                { id: 'climate' as ThematicPillarId, name: 'Climate Resilience', icon: Trees, leadMetric: 'Clean Energy & Biome Ecology' },
                { id: 'economy' as ThematicPillarId, name: 'Macroeconomic Vitality', icon: TrendingUp, leadMetric: 'GDP Growth & Fiscal Space' },
                { id: 'future' as ThematicPillarId, name: 'Agenda 2063 Horizons', icon: Zap, leadMetric: 'Power Access & Digital Readiness' },
              ].map(p => {
                const IconComponent = p.icon;
                // Determine leader for this pillar
                const leader = [...countryDossiers].sort((a, b) => b.scores[p.id] - a.scores[p.id])[0];

                return (
                  <div
                    key={p.id}
                    onMouseEnter={() => setHoveredPillar(p.id)}
                    onMouseLeave={() => setHoveredPillar(null)}
                    className={`p-3.5 rounded-2xl border transition-all text-left ${
                      hoveredPillar === p.id
                        ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 shadow-md'
                        : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <IconComponent className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                          {p.name}
                        </span>
                      </div>
                      {leader && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold shrink-0">
                          Leader: <strong className="text-emerald-700 dark:text-emerald-400">{leader.country.id}</strong>
                        </span>
                      )}
                    </div>

                    {/* Progress bars for each compared country */}
                    <div className="space-y-1.5 pt-1">
                      {countryDossiers.map(cd => {
                        const score = cd.scores[p.id];
                        return (
                          <div key={cd.country.id} className="space-y-0.5">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1 truncate">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cd.color.hex }} />
                                {cd.country.id}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] text-zinc-400 font-mono truncate max-w-[120px]">{cd.raw[p.id]}</span>
                                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{score}</span>
                              </div>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${score}%`,
                                  backgroundColor: cd.color.hex
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
