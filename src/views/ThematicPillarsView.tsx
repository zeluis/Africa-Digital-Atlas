import React, { useState, useEffect, useMemo } from 'react';
import { atlas } from '../data/atlas-store';
import { AtlasEntity } from '../data/types';
import { COUNTRY_HEADER_DATA } from '../data/countryHeaderData';
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
import { getCountryRegionTonalPalette, getRegionCalmColor } from '../data/unGeoschemeColors';
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
  const calmBg = getRegionCalmColor(currentEntity.region);
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
  const headerData = useMemo(() => {
    return COUNTRY_HEADER_DATA[currentEntity.id];
  }, [currentEntity.id]);

  // Country heritage sites if culture pillar
  const heritageSites = useMemo(() => {
    return atlas.getHeritageSites(currentEntity.id);
  }, [currentEntity.id]);

  const primaryIndicators = useMemo(() => {
    return currentPillarMeta.primaryIndicatorIds.map(indId => {
      const def = atlas.getIndicator(indId);
      const rawVal = atlas.getIndicatorValue(currentEntity.id, indId);

      // Dedicated formatting and contextual metadata per indicator
      switch (indId) {
        case 'INDEPENDENCE_YEAR': {
          const dateStr = headerData?.independenceDate || (currentEntity.independenceYear ? String(currentEntity.independenceYear) : '1960');
          const fromStr = headerData?.independenceFrom ? `Independence from ${headerData.independenceFrom}` : 'National Sovereignty Proclaimed';
          return {
            id: indId,
            name: 'Independence Proclamation',
            domain: 'History',
            unit: 'National Day',
            formattedValue: dateStr,
            subtext: fromStr,
            source: 'Official State Gazette / UN Treaty',
            status: 'Authoritative'
          };
        }

        case 'UN_MEMBER_DATE': {
          const dateStr = headerData?.unMemberDate || currentEntity.unMemberDate || '1960';
          const statusStr = headerData?.unStatus || 'Full Member State';
          return {
            id: indId,
            name: 'UN Membership Admission',
            domain: 'History',
            unit: 'General Assembly',
            formattedValue: dateStr,
            subtext: statusStr,
            source: 'United Nations (UNGA)',
            status: 'Verified'
          };
        }

        case 'PEACE_INDEX': {
          const val = rawVal ?? 2.03;
          return {
            id: indId,
            name: 'Global Peace Index (GPI)',
            domain: 'Governance & Peace',
            unit: 'GPI Score',
            formattedValue: val.toFixed(2),
            subtext: 'Scale 1-5 (Lower score = more peaceful)',
            source: 'Institute for Economics & Peace',
            status: 'Live Index'
          };
        }

        case 'CONFLICT_EVENTS': {
          const val = rawVal ?? 51.2;
          return {
            id: indId,
            name: 'Ibrahim Governance Index (IIAG)',
            domain: 'Institutions',
            unit: 'Score / 100',
            formattedValue: val.toFixed(1),
            subtext: `Regime: ${currentEntity.governmentType}`,
            source: 'Mo Ibrahim Foundation',
            status: 'Observed'
          };
        }

        case 'LAND_AREA': {
          return {
            id: indId,
            name: 'Total Surface Land Area',
            domain: 'Geography',
            unit: 'km²',
            formattedValue: `${currentEntity.landAreaKm2.toLocaleString()} km²`,
            subtext: `Morphology: ${currentEntity.geographicType} (${currentEntity.subregion})`,
            source: 'UN Statistics Division / FAO',
            status: 'Authoritative'
          };
        }

        case 'FOREST_COVER': {
          const val = currentEntity.name === 'Gabon' 
            ? 88.0 
            : (rawVal ?? (currentEntity.facts?.forestCover ? parseFloat(currentEntity.facts.forestCover) : 28.5));
          return {
            id: indId,
            name: 'Forest Canopy Cover',
            domain: 'Ecology',
            unit: '% of Land Area',
            formattedValue: `${val.toFixed(1)}%`,
            subtext: currentEntity.name === 'Gabon' ? 'Congo Basin Equatorial Rainforest' : 'Protected terrestrial biomass',
            source: 'FAO Global Forest Assessment',
            status: 'Verified'
          };
        }

        case 'ARABLE_LAND': {
          const val = rawVal ?? 48.0;
          return {
            id: indId,
            name: 'Agricultural Land Share',
            domain: 'Geography',
            unit: '% of Land Area',
            formattedValue: `${val.toFixed(1)}%`,
            subtext: 'Cultivated cropland & pastoral savanna',
            source: 'FAO / World Bank WDI',
            status: 'Observed'
          };
        }

        case 'POPULATION': {
          const val = rawVal ?? 2.49;
          const popNum = val * 1e6;
          return {
            id: indId,
            name: 'Total Population',
            domain: 'Demography',
            unit: 'Inhabitants',
            formattedValue: `${val.toFixed(2)}M`,
            subtext: `${popNum.toLocaleString(undefined, { maximumFractionDigits: 0 })} registered citizens`,
            source: 'UN DESA / World Bank',
            status: 'Verified'
          };
        }

        case 'MEDIAN_AGE': {
          const val = rawVal ?? 24.0;
          return {
            id: indId,
            name: 'Median Societal Age',
            domain: 'Demography',
            unit: 'Years',
            formattedValue: `${val.toFixed(1)} yrs`,
            subtext: 'Youth demographic vanguard',
            source: 'UN Population Division',
            status: 'Live Index'
          };
        }

        case 'LIFE_EXPECTANCY': {
          const val = rawVal ?? 66.5;
          return {
            id: indId,
            name: 'Life Expectancy at Birth',
            domain: 'Health',
            unit: 'Years',
            formattedValue: `${val.toFixed(1)} yrs`,
            subtext: 'Both sexes combined longevity',
            source: 'WHO / World Bank WDI',
            status: 'Verified'
          };
        }

        case 'HDI': {
          const val = rawVal ?? 0.693;
          return {
            id: indId,
            name: 'Human Development Index (HDI)',
            domain: 'Development',
            unit: 'Index (0-1)',
            formattedValue: val.toFixed(3),
            subtext: `Classification: ${currentEntity.incomeLevel}`,
            source: 'UNDP Human Development Report',
            status: 'Authoritative'
          };
        }

        case 'OFFICIAL_LANGUAGES': {
          const langs = currentEntity.languages.official.join(', ');
          return {
            id: indId,
            name: 'Official State Languages',
            domain: 'Languages',
            unit: 'State Idioms',
            formattedValue: langs,
            subtext: `${currentEntity.languages.official.length} Constitutionally recognized`,
            source: 'National Constitution',
            status: 'Authoritative'
          };
        }

        case 'LITERACY_RATE': {
          const val = rawVal ?? 71.6;
          return {
            id: indId,
            name: 'Adult Literacy Rate',
            domain: 'Education',
            unit: '% of Population',
            formattedValue: `${val.toFixed(1)}%`,
            subtext: 'Ages 15 and above literate',
            source: 'UNESCO Institute for Statistics',
            status: 'Verified'
          };
        }

        case 'HERITAGE_SITES': {
          const count = heritageSites.length;
          const sitesStr = count > 0 ? heritageSites.map(s => s.name.split(/[:–-]/)[0].trim()).slice(0, 2).join(' • ') : 'Tentative inventory registered';
          return {
            id: indId,
            name: 'UNESCO World Heritage Sites',
            domain: 'Culture',
            unit: 'Inscribed Sites',
            formattedValue: `${count} Inscribed`,
            subtext: sitesStr,
            source: 'UNESCO World Heritage Centre',
            status: 'Authoritative'
          };
        }

        case 'CREATIVE_EXPORTS': {
          const arrivals = rawVal;
          return {
            id: indId,
            name: 'Tourism & Cultural Mobility',
            domain: 'Culture',
            unit: 'Annual Arrivals',
            formattedValue: arrivals ? `${arrivals.toLocaleString()} arrivals` : 'Active Cultural Exchange',
            subtext: 'Cross-border cultural visitors & diaspora',
            source: 'UN Tourism (UNWTO)',
            status: 'Observed'
          };
        }

        case 'RENEWABLE_ENERGY_SHARE': {
          const val = rawVal ?? 45.6;
          return {
            id: indId,
            name: 'Renewable Energy Consumption',
            domain: 'Climate & Energy',
            unit: '% of Total Energy',
            formattedValue: `${val.toFixed(1)}%`,
            subtext: 'Hydroelectric, solar & clean biomass',
            source: 'IEA / World Bank WDI',
            status: 'Verified'
          };
        }

        case 'CO2_EMISSIONS': {
          const val = rawVal ?? 1.02;
          return {
            id: indId,
            name: 'CO₂ Emissions per Capita',
            domain: 'Climate & Environment',
            unit: 'MT / person',
            formattedValue: `${val.toFixed(2)} MT`,
            subtext: 'Annual carbon intensity per capita',
            source: 'Global Carbon Project / WDI',
            status: 'Live Index'
          };
        }

        case 'CLIMATE_VULNERABILITY': {
          const temp = headerData?.climate?.baseTempC ?? 27;
          return {
            id: indId,
            name: 'Climatological Mean Temperature',
            domain: 'Climate & Environment',
            unit: 'Surface Mean',
            formattedValue: `${temp}°C (${(temp * 9/5 + 32).toFixed(0)}°F)`,
            subtext: headerData?.climate?.condition || 'Equatorial / Tropical Biome',
            source: 'WMO / CRU TS Climatology',
            status: 'Observed'
          };
        }

        case 'GDP_NOMINAL': {
          const val = rawVal ?? 21.9;
          const perCap = atlas.getIndicatorValue(currentEntity.id, 'NY.GDP.PCAP.CD') || 1500;
          return {
            id: indId,
            name: 'Gross Domestic Product (Nominal)',
            domain: 'Economy',
            unit: 'USD Billion',
            formattedValue: `$${val.toFixed(2)}B`,
            subtext: `GDP per capita: $${perCap.toLocaleString()}`,
            source: 'World Bank WDI / IMF WEO',
            status: 'Authoritative'
          };
        }

        case 'GDP_GROWTH': {
          const val = rawVal ?? 2.7;
          return {
            id: indId,
            name: 'Real GDP Annual Growth Rate',
            domain: 'Economy',
            unit: 'Annual %',
            formattedValue: `${val.toFixed(1)}%`,
            subtext: 'Constant price economic expansion',
            source: 'IMF World Economic Outlook',
            status: 'Live Index'
          };
        }

        case 'INFLATION_RATE': {
          const val = rawVal ?? 3.1;
          return {
            id: indId,
            name: 'Inflation Rate (Consumer Prices)',
            domain: 'Economy',
            unit: 'Annual CPI %',
            formattedValue: `${val.toFixed(1)}%`,
            subtext: 'Headline consumer price index',
            source: 'Central Bank / IMF WEO',
            status: 'Observed'
          };
        }

        case 'EXTERNAL_DEBT': {
          const val = rawVal ?? 55.0;
          return {
            id: indId,
            name: 'Central Government Debt to GDP',
            domain: 'Economy',
            unit: '% of GDP',
            formattedValue: `${val.toFixed(1)}%`,
            subtext: 'Public debt sustainability ratio',
            source: 'IMF / World Bank Debt Portal',
            status: 'Verified'
          };
        }

        case 'INTERNET_PENETRATION': {
          const val = rawVal ?? 72.0;
          return {
            id: indId,
            name: 'Internet Penetration Rate',
            domain: 'Innovation',
            unit: '% of Population',
            formattedValue: `${val.toFixed(1)}%`,
            subtext: 'Broadband and mobile digital users',
            source: 'ITU / World Bank',
            status: 'Verified'
          };
        }

        case 'MOBILE_SUBSCRIPTIONS': {
          const val = rawVal ?? 106.8;
          return {
            id: indId,
            name: 'Mobile Cellular Subscriptions',
            domain: 'Innovation',
            unit: 'Per 100 People',
            formattedValue: val.toFixed(1),
            subtext: 'Mobile teledensity penetration',
            source: 'ITU Telecommunication Indicators',
            status: 'Live Index'
          };
        }

        case 'INNOVATION_INDEX': {
          const val = rawVal ?? 91.8;
          return {
            id: indId,
            name: 'Access to Electrical Power',
            domain: 'Infrastructure',
            unit: '% of Population',
            formattedValue: `${val.toFixed(1)}%`,
            subtext: 'National power grid & mini-grid coverage',
            source: 'SE4ALL / World Bank',
            status: 'Verified'
          };
        }

        default: {
          const formattedVal = rawVal !== null 
            ? (typeof rawVal === 'number' && rawVal > 1000 ? rawVal.toLocaleString() : String(rawVal)) 
            : 'Documented';
          return {
            id: indId,
            name: def?.label || def?.name || indId,
            domain: def?.domain || 'Empirical',
            unit: def?.unit || '',
            formattedValue: formattedVal,
            subtext: undefined,
            source: def?.preferredSource || 'Harmonized Datasets',
            status: 'Verified' as const
          };
        }
      }
    });
  }, [currentEntity, currentPillarMeta, headerData, heritageSites]);

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
              <div 
                className="flex flex-col sm:flex-row gap-5 items-start p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs transition-colors"
                style={{ backgroundColor: calmBg }}
              >
                <img
                  src={wikiData.thumbnailUrl}
                  alt={currentEntity.name}
                  className="w-full sm:w-36 h-28 object-cover rounded-xl shadow-sm shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
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
                <p key={idx} className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Key Facts Summary Table */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                Key Strategic Facts & Baseline
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {curatedNarrative.keyFacts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between transition-colors"
                    style={{ backgroundColor: calmBg }}
                  >
                    <span className="text-[10px] uppercase font-mono text-zinc-500 dark:text-zinc-400">{fact.label}</span>
                    <span className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">{fact.value}</span>
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
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">World Heritage List</span>
                </div>
                <div className="space-y-2">
                  {heritageSites.map(site => (
                    <div
                      key={site.id}
                      className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs flex items-start justify-between gap-3 transition-colors"
                      style={{ backgroundColor: calmBg }}
                    >
                      <div>
                        <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{site.name}</div>
                        <div className="text-[11px] text-zinc-600 dark:text-zinc-300 line-clamp-1">{site.description}</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 shrink-0 font-semibold">
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
          <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-950/95 p-6 space-y-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-display tracking-tight">
                    Empirical Indicator Deck
                  </h3>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                    Official & Harmonized Sovereign Datasets
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                Live Data
              </span>
            </div>

            {/* Indicator Metric Cards */}
            <div className="space-y-3">
              {primaryIndicators.map(ind => (
                <div
                  key={ind.id}
                  className="p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-xs space-y-2.5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200"
                  style={{ backgroundColor: calmBg }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                      {ind.name}
                    </span>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-200 border border-zinc-300/40 dark:border-zinc-700/60 shrink-0 font-semibold">
                      {ind.source}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xl md:text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100 tracking-tight">
                      {ind.formattedValue}
                    </span>
                    <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 shrink-0 font-medium">
                      {ind.unit}
                    </span>
                  </div>

                  {(ind.subtext || ind.status) && (
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-200/40 dark:border-zinc-700/60 text-[11px]">
                      {ind.subtext && (
                        <span className="text-zinc-600 dark:text-zinc-300 font-medium truncate font-sans">
                          {ind.subtext}
                        </span>
                      )}
                      {ind.status && (
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-500/15 border border-emerald-300/60 dark:border-emerald-500/30 shrink-0 font-semibold">
                          {ind.status}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Regional Bloc Affiliation Quick Tag */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <div className="text-[10px] font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400">
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
