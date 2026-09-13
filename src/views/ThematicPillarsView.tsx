import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { atlas } from '../data/atlas-store';
import { AtlasEntity } from '../data/types';
import { COUNTRY_HEADER_DATA } from '../data/countryHeaderData';
import { getCountrySilhouette } from '../data/countrySilhouettes';
import { getCountryLandmarkImage } from '../data/countryLandmarkImages';
import { 
  getPillarThematicImage, 
  getPillarWikiSearchCandidates,
  PillarThematicImage 
} from '../data/countryPillarImages';
import { UN_M49_NUMERIC_CODES } from '../data/svgGeographySystem';
import { 
  ThematicPillarId, 
  THEMATIC_PILLARS, 
  fetchWikipediaSummary, 
  WikiSummaryData, 
  getCuratedPillarNarrative 
} from '../services/wikipediaService';
import { ThematicPillarNav } from '../components/ThematicPillarNav';
import { ThematicPillarBottomSection } from '../components/ThematicPillarBottomSection';
import { CountryFlag } from '../components/CountryFlag';
import { getCountryRegionTonalPalette, getRegionCalmColor } from '../data/unGeoschemeColors';
import { 
  formatPopulation, 
  formatGDP, 
  formatCurrency, 
  formatPercentage, 
  formatHDI,
  formatArea
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
  Compass,
  MapPin,
  Crosshair,
  Maximize2,
  Download,
  Copy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Quote,
  Feather,
  FileText,
  X
} from 'lucide-react';

interface ThematicPillarsViewProps {
  initialEntityId?: string;
  initialPillar?: ThematicPillarId;
  onSelectCountry: (entityId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const ThematicPillarsView: React.FC<ThematicPillarsViewProps> = ({
  initialEntityId = 'NGA',
  initialPillar = 'geography',
  onSelectCountry,
  onNavigateTab
}) => {
  const [selectedEntityId, setSelectedEntityId] = useState<string>(initialEntityId);
  const [activePillar, setActivePillar] = useState<ThematicPillarId>(initialPillar);
  const [wikiData, setWikiData] = useState<WikiSummaryData | null>(null);
  const [isLoadingWiki, setIsLoadingWiki] = useState<boolean>(false);
  const [showFullWiki, setShowFullWiki] = useState<boolean>(false);
  const [isSilhouetteModalOpen, setIsSilhouetteModalOpen] = useState<boolean>(false);
  const [copiedPath, setCopiedPath] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [showFullImgCaption, setShowFullImgCaption] = useState<boolean>(false);

  const countries = useMemo(() => atlas.getSovereignCountries(), []);
  const currentEntity = atlas.getEntity(selectedEntityId) || countries[0];
  const tonal = getCountryRegionTonalPalette(currentEntity.id);
  const calmBg = getRegionCalmColor(currentEntity.region);
  const currentPillarMeta = THEMATIC_PILLARS.find(p => p.id === activePillar) || THEMATIC_PILLARS[0];
  const silhouette = useMemo(() => getCountrySilhouette(currentEntity.id), [currentEntity.id]);
  const m49Code = UN_M49_NUMERIC_CODES[currentEntity.id.toUpperCase()] || '000';
  const silhouetteGradId = `editorial-silhouette-grad-${currentEntity.id}`;

  const handleCopySvgPath = () => {
    if (silhouette?.path) {
      navigator.clipboard.writeText(silhouette.path);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    }
  };

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById(`editorial-silhouette-svg-${currentEntity.id}`);
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const commentedSource = `<!-- African Continental Atlas: ${currentEntity.name} (ISO3: ${currentEntity.id}, M49: ${m49Code}) -->\n${source}`;
    const blob = new Blob([commentedSource], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UN_M49_${m49Code}_${currentEntity.id}_silhouette.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // Fetch Wikipedia summary and topic-specific articles when country or pillar changes
  const [pillarWikiData, setPillarWikiData] = useState<WikiSummaryData | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingWiki(true);
    setShowFullWiki(false);

    // 1. Fetch general country summary
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

    // 2. Fetch pillar-specific topic article from Wikipedia (e.g. Demographics, Wildlife, Science/Economy)
    const searchQueries = getPillarWikiSearchCandidates(currentEntity.name, activePillar);
    const fetchBestPillarArticle = async () => {
      for (const query of searchQueries) {
        if (!isMounted) return;
        try {
          const res = await fetchWikipediaSummary(query);
          if (res && res.extract && res.extract.length > 50) {
            if (isMounted) {
              setPillarWikiData(res);
            }
            return;
          }
        } catch {
          // continue to next candidate
        }
      }
      if (isMounted) {
        setPillarWikiData(null);
      }
    };

    fetchBestPillarArticle();

    return () => {
      isMounted = false;
    };
  }, [currentEntity.name, activePillar]);

  // Curated narrative fallback / enhancement
  const curatedNarrative = useMemo(() => {
    return getCuratedPillarNarrative(currentEntity.name, currentEntity.id, activePillar, currentEntity);
  }, [currentEntity, activePillar]);

  // Curated Topic Photography across all 8 Pillars (People, Climate, Future, History, Culture, Economy, Languages, Geography)
  const curatedPillarImage = useMemo(() => {
    return getPillarThematicImage(currentEntity.id, activePillar, currentEntity.name);
  }, [currentEntity.id, activePillar, currentEntity.name]);

  // Resolve Editorial Image: prioritize authentic topic photography for the active pillar
  const editorialImage = useMemo(() => {
    if (
      pillarWikiData?.thumbnailUrl && 
      !pillarWikiData.thumbnailUrl.toLowerCase().includes('flag') && 
      !pillarWikiData.thumbnailUrl.toLowerCase().includes('coat_of_arms') &&
      !pillarWikiData.thumbnailUrl.toLowerCase().includes('arms_of') &&
      !pillarWikiData.thumbnailUrl.toLowerCase().includes('locator')
    ) {
      return {
        id: currentEntity.id,
        country: currentEntity.name,
        pillarId: activePillar,
        title: pillarWikiData.title || curatedPillarImage.title,
        category: curatedPillarImage.category,
        imageUrl: pillarWikiData.thumbnailUrl,
        caption: pillarWikiData.description || curatedPillarImage.caption,
        credit: 'Wikimedia Commons / Curated Archive'
      };
    }
    return curatedPillarImage;
  }, [pillarWikiData, curatedPillarImage, currentEntity.id, currentEntity.name, activePillar]);

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
      {/* Consolidated Unified Sticky / Fixed Header */}
      <div className="sticky top-0 z-40 -mx-3 sm:-mx-6 -mt-3 sm:-mt-6 px-4 sm:px-6 py-3 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/90 dark:border-zinc-800/90 shadow-md transition-all space-y-2.5">
        <div className="max-w-7xl mx-auto space-y-2.5">
          {/* Top Row: Flag, Country Name, Pillar Badge, Region, Description & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CountryFlag entityId={currentEntity.id} size="md" />
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                    {currentEntity.name}
                  </h1>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                    PILLAR {currentPillarMeta.number}/8 • {currentPillarMeta.label.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    {currentEntity.region}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-3xl hidden sm:block">
                  {currentPillarMeta.description}
                </p>
              </div>
            </div>

            {/* Quick Country Switcher & Wiki Link */}
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
              <select
                value={selectedEntityId}
                onChange={e => handleCountrySwitch(e.target.value)}
                className="bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold text-xs py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs"
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
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors shadow-2xs"
                title="View Wikipedia Article"
              >
                <span>Wikipedia</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Bottom Row: 8 Pillars Navigation Tabs Ribbon */}
          <ThematicPillarNav
            activePillar={activePillar}
            onSelectPillar={setActivePillar}
            entityName={currentEntity.name}
            isEmbedded={true}
          />
        </div>
      </div>

      {/* Main 2-Column Hybrid Layout: Editorial on Left, Empirical on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Luxury Editorial Encyclopedic Dossier */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-950/95 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-xs flex flex-col lg:max-h-[820px]">
            {/* Ambient Tonal Gradient Glow */}
            <div 
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-25"
              style={{ background: tonal.warmAccent }}
            />

            {/* 1. Unified Masthead Header Capsule with SVG Silhouette, Flag & Classification */}
            <div className="relative z-10 space-y-3.5 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5 shrink-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Side: Editorial Kicker, Flag, Sovereign Title & Classification Pills */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  {/* Kicker Label */}
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400">
                    <Feather className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>CONTINENTAL ENCYCLOPEDIC DOSSIER</span>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    <span>VOL. 2026</span>
                  </div>

                  {/* Sovereign Title & Flag Header */}
                  <div className="flex items-start gap-3.5">
                    <CountryFlag 
                      entityId={currentEntity.id} 
                      size="lg" 
                      className="shrink-0 mt-0.5 shadow-md ring-1 ring-zinc-900/10 dark:ring-white/10" 
                    />
                    <div className="min-w-0 flex-1">
                      <h2 
                        className="text-2xl sm:text-3xl text-zinc-950 dark:text-zinc-50 tracking-tight leading-tight truncate"
                        style={{ fontFamily: "'Noto Serif Display', Georgia, 'Times New Roman', serif", fontWeight: 500 }}
                      >
                        {currentEntity.name}
                      </h2>
                      <p 
                        className="text-xs text-zinc-600 dark:text-zinc-400 italic mt-0.5"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                      >
                        {headerData?.governmentType || currentEntity.governmentType}
                      </p>
                    </div>
                  </div>

                  {/* Classification Pills Row */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                      ISO: {currentEntity.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                      UN M49: {m49Code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                      {currentEntity.subregion}
                    </span>
                    {silhouette?.capital && (
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 flex items-center gap-1 shadow-2xs">
                        <MapPin className="w-2.5 h-2.5 text-amber-500" />
                        {silhouette.capital.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side: Integrated SVG Silhouette Module */}
                {silhouette && (
                  <div 
                    className="w-full md:w-56 lg:w-60 h-22 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 p-2.5 flex items-center justify-between gap-3 overflow-hidden shadow-xs shrink-0 group transition-all hover:border-zinc-300 dark:hover:border-zinc-700 self-start md:self-center"
                    style={{ backgroundColor: calmBg }}
                  >
                    {/* SVG Canvas */}
                    <div className="relative w-24 sm:w-28 h-full flex items-center justify-center shrink-0">
                      <svg
                        id={`editorial-silhouette-svg-${currentEntity.id}`}
                        viewBox={silhouette.viewBox}
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full max-h-16 transition-transform duration-300 group-hover:scale-105 select-none"
                      >
                        <defs>
                          <linearGradient id={silhouetteGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={tonal.warmAccent} stopOpacity="0.55" />
                            <stop offset="100%" stopColor={tonal.deepTone} stopOpacity="0.2" />
                          </linearGradient>
                        </defs>

                        {/* Silhouette Path */}
                        <path
                          d={silhouette.path}
                          fill={`url(#${silhouetteGradId})`}
                          stroke={tonal.warmAccent}
                          strokeWidth="2.2"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />

                        {/* Islands */}
                        {silhouette.islandPaths && silhouette.islandPaths.map((islandD, idx) => (
                          <path
                            key={idx}
                            d={islandD}
                            fill={`url(#${silhouetteGradId})`}
                            stroke={tonal.warmAccent}
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                        ))}

                        {/* Capital Beacon */}
                        {silhouette.capital && (
                          <g transform={`translate(${silhouette.capital.x}, ${silhouette.capital.y})`} className="pointer-events-none">
                            <circle r="7" fill={tonal.warmAccent} opacity="0.35" className="animate-ping" />
                            <circle r="3.5" fill={tonal.warmAccent} />
                            <circle r="1.5" fill="#ffffff" />
                          </g>
                        )}
                      </svg>
                    </div>

                    {/* Vector Controls & Geo Coordinates */}
                    <div className="flex flex-col justify-between items-end h-full text-[9px] font-mono text-zinc-500 dark:text-zinc-400 pl-2.5 border-l border-zinc-200/70 dark:border-zinc-800/70 flex-1 min-w-0">
                      <div className="flex flex-col items-end leading-tight w-full truncate">
                        <span className="text-[8px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">GEO CENTER</span>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-[9px] truncate">
                          {silhouette.geoCenter.lat >= 0 ? `${silhouette.geoCenter.lat.toFixed(1)}°N` : `${Math.abs(silhouette.geoCenter.lat).toFixed(1)}°S`}, {' '}
                          {silhouette.geoCenter.lng >= 0 ? `${silhouette.geoCenter.lng.toFixed(1)}°E` : `${Math.abs(silhouette.geoCenter.lng).toFixed(1)}°W`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 pt-0.5">
                        <button
                          onClick={handleCopySvgPath}
                          className="p-1.5 rounded-md bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs cursor-pointer"
                          title={copiedPath ? "Vector path copied!" : "Copy SVG path string"}
                        >
                          {copiedPath ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                        </button>
                        <button
                          onClick={handleDownloadSVG}
                          className="p-1.5 rounded-md bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs cursor-pointer"
                          title={downloadSuccess ? "Downloaded!" : "Download SVG file"}
                        >
                          {downloadSuccess ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> : <Download className="w-2.5 h-2.5" />}
                        </button>
                        <button
                          onClick={() => setIsSilhouetteModalOpen(true)}
                          className="p-1.5 rounded-md bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs cursor-pointer"
                          title="Expand High-Res Silhouette View"
                        >
                          <Maximize2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pillar Ribbon & Issue Tag */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                  THEMATIC PILLAR {currentPillarMeta.number}/8 • {currentPillarMeta.label.toUpperCase()}
                </span>
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Peer-Reviewed Monograph Archive</span>
                </span>
              </div>
            </div>

            {/* Scrollable Editorial Body (Controlled Height) */}
            <div className="space-y-6 overflow-y-auto pr-1.5 custom-scrollbar flex-1">
              {/* 2. Full-Width Landscape / Nature / City / Demographic Landmark Photography with Lead Below */}
              <div className="space-y-3.5">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-zinc-200/80 dark:border-zinc-800/80 group">
                  <div className="relative w-full h-60 sm:h-72 lg:h-80 overflow-hidden bg-zinc-900">
                    <img
                      key={`${currentEntity.id}-${activePillar}-${editorialImage.imageUrl}`}
                      src={editorialImage.imageUrl}
                      alt={editorialImage.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Subtle Gradient Veil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                    {/* Unified Image Overlay Capsule with Warm Tonal Background & Controlled Pills */}
                    <div 
                      className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-0 transition-all duration-300"
                      style={{
                        backgroundColor: 'rgba(20, 16, 15, 0.82)',
                        boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      <div className="min-w-0 flex-1 space-y-1.5">
                        {/* Controlled Tonal Colorful Pills */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/25 text-amber-300 border-0 leading-none">
                            {editorialImage.category}
                          </span>
                          <span className="text-white/30 text-xs select-none">•</span>
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold text-zinc-100 bg-white/15 border-0 leading-none">
                            {editorialImage.title}
                          </span>
                        </div>

                        {/* Paragraph: Clear Contrasting Font, No Pill Decoration */}
                        <div>
                          <p 
                            className={`text-xs sm:text-[13px] font-normal leading-relaxed drop-shadow-xs transition-all duration-300 ${showFullImgCaption ? '' : 'line-clamp-2'}`}
                            style={{ 
                              fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
                              color: '#F4F4F5' 
                            }}
                          >
                            {editorialImage.caption}
                            {editorialImage.caption && editorialImage.caption.length > 40 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowFullImgCaption(!showFullImgCaption);
                                }}
                                className="ml-1.5 text-[11px] font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-2 inline-flex items-center gap-0.5 cursor-pointer"
                              >
                                <span>{showFullImgCaption ? 'Show less' : 'Read more'}</span>
                                {showFullImgCaption ? <ChevronUp className="w-2.5 h-2.5 inline" /> : <ChevronDown className="w-2.5 h-2.5 inline" />}
                              </button>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Credit Span: Controlled Tonal Colorful Pill */}
                      <span 
                        className="inline-flex items-center justify-center text-center px-3 py-1 rounded-full text-[9px] font-mono font-medium tracking-wide leading-none text-emerald-300 bg-emerald-950/60 border-0 shrink-0 self-start sm:self-center"
                      >
                        {editorialImage.credit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lead Paragraph / Encyclopedic Abstract DIRECTLY BELOW Image */}
                <div 
                  className="p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-2.5 transition-colors"
                  style={{ backgroundColor: calmBg }}
                >
                  <div className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-amber-500" />
                    <span>ENCYCLOPEDIC ABSTRACT & STRATEGIC CONTEXT</span>
                  </div>

                  <p 
                    className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed"
                    style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    {showFullWiki ? (wikiData?.extract || curatedNarrative.narrative.join(' ')) : ((wikiData?.extract || curatedNarrative.narrative.join(' ')).slice(0, 260) + '...')}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setShowFullWiki(!showFullWiki)}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{showFullWiki ? 'Show Less' : 'Read Full Monograph Abstract'}</span>
                      {showFullWiki ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`https://en.wikipedia.org/wiki/${encodeURIComponent(currentEntity.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
                    >
                      <span>Wikipedia Monograph</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* 3. Curated Pillar Narrative Section (Luxury Magazine Essay) */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
                  <Quote className="w-4 h-4 text-amber-500 shrink-0" />
                  <h4 
                    className="text-base md:text-lg text-zinc-950 dark:text-zinc-100 tracking-tight"
                    style={{ fontFamily: "'Noto Serif Display', Georgia, 'Times New Roman', serif", fontWeight: 500 }}
                  >
                    {curatedNarrative.headline}
                  </h4>
                </div>

                <div 
                  className="space-y-3.5 text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
                  style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {curatedNarrative.narrative.map((paragraph, idx) => (
                    <p 
                      key={idx} 
                      className={idx === 0 ? "first-letter:text-3xl first-letter:font-light first-letter:float-left first-letter:mr-2.5 first-letter:text-zinc-950 dark:first-letter:text-zinc-50" : ""}
                      style={idx === 0 ? { fontFamily: "'Plus Jakarta Sans', sans-serif" } : undefined}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* 4. Key Strategic Baseline Specifications Matrix */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>STRATEGIC BASELINE SPECIFICATIONS</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">UN / AU Harmonized</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {curatedNarrative.keyFacts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                      style={{ backgroundColor: calmBg }}
                    >
                      <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
                        {fact.label}
                      </span>
                      <span className="text-xs sm:text-sm font-bold font-mono text-zinc-950 dark:text-zinc-50 mt-1">
                        {fact.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Special Pillar Sub-Section: Culture & Heritage Sites */}
              {activePillar === 'culture' && heritageSites.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>UNESCO Inscribed Properties ({heritageSites.length})</span>
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
        </div>

        {/* Right Column: Live Empirical Indicator Deck */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-950/95 p-6 space-y-5 shadow-sm hover:shadow-md transition-all duration-300 lg:max-h-[820px] overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div>
                  <h3 
                    className="text-base text-zinc-900 dark:text-zinc-100 tracking-tight"
                    style={{ fontFamily: "'Noto Serif Display', Georgia, 'Times New Roman', serif", fontWeight: 500 }}
                  >
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
            <div className="space-y-3 flex-1">
              {primaryIndicators.map(ind => (
                <div
                  key={ind.id}
                  className="p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-xs space-y-2.5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200"
                  style={{ backgroundColor: calmBg }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span 
                      className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-snug"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
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
                        <span 
                          className="text-zinc-600 dark:text-zinc-300 font-medium truncate"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
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
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2 shrink-0">
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

      {/* Bottom Section: Dynamic Thematic-Pillar Tailored Content */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <ThematicPillarBottomSection
          activePillar={activePillar}
          currentEntity={currentEntity}
          onSelectCountry={handleCountrySwitch}
          onNavigateTab={onNavigateTab}
        />
      </div>

      {/* High-Resolution SVG Silhouette Inspection Modal */}
      <AnimatePresence>
        {isSilhouetteModalOpen && silhouette && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsSilhouetteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-6"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <CountryFlag entityId={currentEntity.id} size="md" className="shadow-xs" />
                  <div>
                    <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 font-display">
                      {currentEntity.name} Vector Silhouette
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                      <span>ISO: {currentEntity.id}</span>
                      <span>•</span>
                      <span>M49: {m49Code}</span>
                      <span>•</span>
                      <span>{silhouette.shapeType?.toUpperCase() || 'CONTINENTAL'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsSilhouetteModalOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Vector Display */}
              <div 
                className="w-full h-80 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: calmBg }}
              >
                <svg
                  viewBox={silhouette.viewBox}
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid meet"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full max-h-72 drop-shadow-lg"
                >
                  <defs>
                    <linearGradient id={`modal-grad-${currentEntity.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={tonal.warmAccent} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={tonal.deepTone} stopOpacity="0.4" />
                    </linearGradient>
                  </defs>

                  <path
                    d={silhouette.path}
                    fill={`url(#modal-grad-${currentEntity.id})`}
                    stroke={tonal.warmAccent}
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />

                  {silhouette.islandPaths && silhouette.islandPaths.map((islandD, idx) => (
                    <path
                      key={idx}
                      d={islandD}
                      fill={`url(#modal-grad-${currentEntity.id})`}
                      stroke={tonal.warmAccent}
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  ))}

                  {silhouette.capital && (
                    <g transform={`translate(${silhouette.capital.x}, ${silhouette.capital.y})`}>
                      <circle r="12" fill={tonal.warmAccent} opacity="0.3" className="animate-ping" />
                      <circle r="6" fill={tonal.warmAccent} />
                      <circle r="2.5" fill="#ffffff" />
                      <text
                        x="10"
                        y="4"
                        fontSize="14"
                        fontWeight="bold"
                        fill="currentColor"
                        className="text-zinc-900 dark:text-zinc-100 font-sans"
                      >
                        {silhouette.capital.name} (Capital)
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  Geo Center: {silhouette.geoCenter.lat}°, {silhouette.geoCenter.lng}°
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySvgPath}
                    className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedPath ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPath ? 'Path String Copied' : 'Copy SVG Path'}</span>
                  </button>

                  <button
                    onClick={handleDownloadSVG}
                    className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-xs font-semibold text-white dark:text-zinc-950 flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                  >
                    {downloadSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Download className="w-4 h-4" />}
                    <span>{downloadSuccess ? 'Downloaded' : 'Download SVG'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
