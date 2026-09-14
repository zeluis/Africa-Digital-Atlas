import { 
  findWikipediaEntry, 
  WikipediaEthnicEntry, 
  WIKIPEDIA_TABLE_ENTRIES,
  normalizeEthnicKey 
} from '../data/wikipediaEthnicAtlas';

export type ThematicPillarId = 
  | 'geography' 
  | 'history' 
  | 'people' 
  | 'languages' 
  | 'culture' 
  | 'climate' 
  | 'economy' 
  | 'future';

export interface ThematicPillarDef {
  id: ThematicPillarId;
  number: number;
  label: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  description: string;
  primaryIndicatorIds: string[];
}

export const THEMATIC_PILLARS: ThematicPillarDef[] = [
  {
    id: 'geography',
    number: 1,
    label: 'Physical Geography & Territoriality',
    shortLabel: 'Geography',
    title: 'Physical Geography & Territoriality',
    subtitle: 'Topography, waterways, borders and maritime zones',
    description: 'Sovereign spatial morphology, natural basins, littoral reaches, and territorial demarcations.',
    primaryIndicatorIds: ['LAND_AREA', 'FOREST_COVER', 'ARABLE_LAND']
  },
  {
    id: 'history',
    number: 2,
    label: 'Historiography & Liberation Chronologies',
    shortLabel: 'History',
    title: 'Historiography & Liberation Chronologies',
    subtitle: 'Pre-colonial kingdoms, colonial ruptures, and independence movements',
    description: 'Epochs of civilizational governance, anti-colonial resistance, and sovereign state consolidation.',
    primaryIndicatorIds: ['INDEPENDENCE_YEAR', 'UN_MEMBER_DATE', 'PEACE_INDEX', 'CONFLICT_EVENTS']
  },
  {
    id: 'people',
    number: 3,
    label: 'Demography & Human Development',
    shortLabel: 'People',
    title: 'Demography & Human Development',
    subtitle: 'Population dynamics, urbanization, and societal vitality',
    description: 'Generational demographics, life expectations, human development indexes, and civic health.',
    primaryIndicatorIds: ['POPULATION', 'MEDIAN_AGE', 'LIFE_EXPECTANCY', 'HDI']
  },
  {
    id: 'languages',
    number: 4,
    label: 'Linguistic Geography & Phyla',
    shortLabel: 'Languages',
    title: 'Linguistic Geography & Phyla',
    subtitle: 'Mother tongues, polyglot lineages, and orthographies',
    description: 'Niger-Congo, Afroasiatic, Nilo-Saharan, and Khoisan language families and vehicular state tongues.',
    primaryIndicatorIds: ['OFFICIAL_LANGUAGES', 'LITERACY_RATE']
  },
  {
    id: 'culture',
    number: 5,
    label: 'Material Culture, Heritage & Arts',
    shortLabel: 'Culture',
    title: 'Material Culture, Heritage & Arts',
    subtitle: 'UNESCO sites, cosmological heritage, architectures, and traditions',
    description: 'Intangible practices, ancestral shrines, architectural monuments, and contemporary creative industries.',
    primaryIndicatorIds: ['HERITAGE_SITES', 'CREATIVE_EXPORTS']
  },
  {
    id: 'climate',
    number: 6,
    label: 'Biomes, Climate & Ecological Resilience',
    shortLabel: 'Climate',
    title: 'Biomes, Climate & Ecological Resilience',
    subtitle: 'Sahel, rainforest, savannah, and green energy horizons',
    description: 'Ecological zones, biodiversity reserves, rainfall cycles, and climate adaptation investments.',
    primaryIndicatorIds: ['RENEWABLE_ENERGY_SHARE', 'CO2_EMISSIONS', 'CLIMATE_VULNERABILITY']
  },
  {
    id: 'economy',
    number: 7,
    label: 'Macroeconomics, Sovereignty & Trade',
    shortLabel: 'Economy',
    title: 'Macroeconomics, Sovereignty & Trade',
    subtitle: 'GDP, mineral reserves, regional trade, and fiscal balance',
    description: 'Productive sectors, currency regimes, AfCFTA trade integration, and national budget allocations.',
    primaryIndicatorIds: ['GDP_NOMINAL', 'GDP_GROWTH', 'INFLATION_RATE', 'EXTERNAL_DEBT']
  },
  {
    id: 'future',
    number: 8,
    label: 'Agenda 2063 & Future Horizons',
    shortLabel: 'Future',
    title: 'Agenda 2063 & Future Horizons',
    subtitle: 'Digital transformation, continental corridors, and technological innovation',
    description: 'Fiber-optic penetration, space agencies, research output, and youth-led entrepreneurial ecosystems.',
    primaryIndicatorIds: ['INTERNET_PENETRATION', 'MOBILE_SUBSCRIPTIONS', 'INNOVATION_INDEX']
  }
];

export interface WikiSummaryData {
  title: string;
  displaytitle?: string;
  description?: string;
  extract: string;
  extract_html?: string;
  thumbnailUrl?: string | null;
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string; width: number; height: number };
  content_urls?: {
    desktop: { page: string };
  };
}

export async function fetchWikipediaSummary(articleTitle: string): Promise<WikiSummaryData | null> {
  try {
    const cleanTitle = articleTitle.replace(/\s+/g, '_');
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTitle)}`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) return null;
    const j = await res.json();
    
    // Check if thumbnail is a flag, coat of arms, seal, or locator map
    let rawThumb = j.thumbnail?.source || null;
    if (rawThumb) {
      const lower = rawThumb.toLowerCase();
      if (
        lower.includes('flag') || 
        lower.includes('coat_of_arms') || 
        lower.includes('arms_of') || 
        lower.includes('emblem') || 
        lower.includes('seal_of') || 
        lower.includes('locator') || 
        lower.includes('location_in') || 
        lower.includes('orthographic') ||
        lower.includes('blason') ||
        lower.includes('escudo') ||
        lower.endsWith('.svg') ||
        lower.endsWith('.svg.png')
      ) {
        rawThumb = null;
      }
    }

    return {
      ...j,
      thumbnailUrl: rawThumb
    };
  } catch (err) {
    console.warn(`Error fetching wiki summary for ${articleTitle}:`, err);
    return null;
  }
}

export interface CuratedPillarNarrativeResult {
  headline: string;
  narrative: string[];
  keyFacts: { label: string; value: string }[];
}

export function getCuratedPillarNarrative(
  entityName: string, 
  entityId: string, 
  pillarId: ThematicPillarId, 
  entity?: any
): CuratedPillarNarrativeResult {
  const reg = entity?.unGeoschemeRegion || 'Africa';
  const capital = entity?.capital || 'Capital City';
  const pop = entity?.indicators?.POPULATION?.value ? `${(entity.indicators.POPULATION.value / 1e6).toFixed(1)}M` : 'Documented';

  switch (pillarId) {
    case 'geography':
      return {
        headline: `Spatial Morphology & Environmental Matrix of ${entityName}`,
        narrative: [
          `${entityName} occupies a pivotal geopolitical station in ${reg}, defined by diverse topographic contours and strategic territorial connectivity.`,
          `Riverine systems, watershed basins, and littoral passages anchor national trade routes and cross-border ecological corridors.`
        ],
        keyFacts: [
          { label: 'Geoscheme Region', value: reg },
          { label: 'Administrative Seat', value: capital }
        ]
      };
    case 'history':
      return {
        headline: `Dynastic Antiquity & Anti-Colonial Self-Determination in ${entityName}`,
        narrative: [
          `Civilizational antiquity in ${entityName} traces through pre-colonial dynasties, autonomous city-states, and profound trade networks.`,
          `The struggle for liberation culminated in national sovereignty, establishing modern pan-African diplomatic commitments.`
        ],
        keyFacts: [
          { label: 'Sovereign Status', value: 'AU Member State' },
          { label: 'Historical Nexus', value: `${reg} Antiquity` }
        ]
      };
    case 'people':
      return {
        headline: `Demographic Dynamism & Human Potential of ${entityName}`,
        narrative: [
          `With a rapidly expanding youth generation, ${entityName} manifests vital social energy, creative entrepreneurship, and urbanization.`,
          `Investments in vocational learning, primary education, and health infrastructure drive long-term structural transformation.`
        ],
        keyFacts: [
          { label: 'Total Population', value: pop },
          { label: 'Demographic Horizon', value: 'Youth-Centric Dynamism' }
        ]
      };
    case 'languages':
      return {
        headline: `Polyglot Heritage & Mother Tongues of ${entityName}`,
        narrative: [
          `Linguistic diversity in ${entityName} spans ancient continental language phyla alongside national official languages.`,
          `Indigenous oral traditions, codified orthographies, and cross-border vehicular idioms enrich daily civic discourse.`
        ],
        keyFacts: [
          { label: 'Linguistic Families', value: 'Continental Phyla' },
          { label: 'Communication Hub', value: 'Polyglot Vehicular Networks' }
        ]
      };
    case 'culture':
      return {
        headline: `Living Traditions, Material Heritage & Creative Arts in ${entityName}`,
        narrative: [
          `Ancestral cosmologies, sacred architectural monuments, and tangible artisan guilds remain foundational to cultural identity in ${entityName}.`,
          `Contemporary musical, literary, and cinematographic exports continue to garner international acclaim across the global diaspora.`
        ],
        keyFacts: [
          { label: 'Heritage Matrix', value: 'Tangible & Living Intangible' },
          { label: 'Artistic Vanguard', value: 'Pan-African Cultural Vanguard' }
        ]
      };
    case 'climate':
      return {
        headline: `Ecological Biomes & Climate Transition in ${entityName}`,
        narrative: [
          `Encompassing unique ecological biomes, ${entityName} balances conservation stewardship with vital resource requirements.`,
          `National green initiatives prioritize solar, wind, hydro energy, and reforestation resilience.`
        ],
        keyFacts: [
          { label: 'Ecological Zone', value: `${reg} Biomes` },
          { label: 'Resilience Strategy', value: 'Renewable Expansion & Protection' }
        ]
      };
    case 'economy':
      return {
        headline: `Productive Capacities & AfCFTA Regional Integration in ${entityName}`,
        narrative: [
          `Economic sovereignty in ${entityName} is supported by mineral endowment, agricultural productivity, and expanding tertiary sectors.`,
          `Active integration in the African Continental Free Trade Area (AfCFTA) stimulates intra-African value chains.`
        ],
        keyFacts: [
          { label: 'Trade Architecture', value: 'AfCFTA Signatory' },
          { label: 'Primary Engines', value: 'Resources, Agribusiness & Services' }
        ]
      };
    case 'future':
    default:
      return {
        headline: `Agenda 2063 Aspirations & Next-Century Frontiers for ${entityName}`,
        narrative: [
          `Positioned within the African Union Agenda 2063 master plan, ${entityName} accelerates digital infrastructure and STEM education.`,
          `Youth-driven technological innovation hubs are pioneering local fintech, agritech, and renewable solutions.`
        ],
        keyFacts: [
          { label: 'Long-term Roadmap', value: 'AU Agenda 2063' },
          { label: 'Innovation Focus', value: 'Digital Infrastructure & Tech Hubs' }
        ]
      };
  }
}

// Memory cache for runtime fetched summaries
const RUNTIME_SUMMARY_CACHE = new Map<string, Partial<WikipediaEthnicEntry>>();

/**
 * Clean and parse language lineage string into a navigable chain of badges
 * e.g. "Atlantic–Congo → Bantu → Gusii" -> ["Atlantic–Congo", "Bantu", "Gusii"]
 */
export function parseLanguageChain(languageStr: string): string[] {
  if (!languageStr) return [];
  return languageStr
    .split(/\s*→\s*|\s*,\s*|\s*–\s*/)
    .map(s => s.trim())
    .filter(s => s.length > 1 && !s.startsWith('(') && !s.endsWith(')'));
}

/**
 * Fetch Wikipedia summary dynamically from official Wikipedia REST API (CORS enabled)
 * Supports multilingual subdomains (e.g., es.wikipedia.org, it.wikipedia.org, nl.wikipedia.org, pt.wikipedia.org, fr.wikipedia.org, de.wikipedia.org)
 */
export async function fetchLiveWikipediaSummary(
  articleTitle: string,
  lang: string = 'en'
): Promise<{
  title?: string;
  canonicalTitle?: string;
  extract?: string;
  thumbnail?: string | null;
  description?: string;
  url?: string;
} | null> {
  const cleanTitle = articleTitle.replace(/\s+/g, '_');
  const cacheKey = `${lang}:${cleanTitle}`;
  if (RUNTIME_SUMMARY_CACHE.has(cacheKey)) {
    return RUNTIME_SUMMARY_CACHE.get(cacheKey) || null;
  }

  // Check localStorage for offline persistence
  const localKey = `wiki_summary_${lang}_${cleanTitle}`;
  try {
    const stored = localStorage.getItem(localKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      RUNTIME_SUMMARY_CACHE.set(cacheKey, parsed);
      return parsed;
    }
  } catch {
    // ignore localStorage errors in sandboxed iframes
  }

  // Helper to fetch summary from a specific subdomain and title
  const tryFetchSummary = async (targetLang: string, titleToFetch: string) => {
    try {
      const res = await fetch(
        `https://${targetLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titleToFetch)}`,
        { headers: { Accept: 'application/json' } }
      );
      if (!res.ok) return null;
      const j = await res.json();
      if (j.type === 'disambiguation') return null;
      if (j.extract && (j.extract.includes('may refer to:') || j.extract.length < 35)) return null;

      return {
        title: j.title,
        canonicalTitle: j.title || titleToFetch.replace(/_/g, ' '),
        extract: j.extract,
        thumbnail: j.thumbnail?.source || null,
        description: j.description,
        url: j.content_urls?.desktop?.page
      };
    } catch {
      return null;
    }
  };

  // If language is not English, first attempt direct translation lookup via Wikipedia interwiki langlinks
  if (lang && lang !== 'en') {
    try {
      const langlinkRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(cleanTitle)}&prop=langlinks&lllang=${encodeURIComponent(lang)}&format=json&origin=*`
      );
      if (langlinkRes.ok) {
        const langlinkData = await langlinkRes.json();
        const pages = langlinkData?.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          const foreignTitle = pages[pageId]?.langlinks?.[0]?.['*'];
          if (foreignTitle) {
            const localizedSummary = await tryFetchSummary(lang, foreignTitle.replace(/\s+/g, '_'));
            if (localizedSummary && localizedSummary.extract) {
              RUNTIME_SUMMARY_CACHE.set(cacheKey, localizedSummary);
              try {
                localStorage.setItem(localKey, JSON.stringify(localizedSummary));
              } catch {}
              return localizedSummary;
            }
          }
        }
      }
    } catch {
      // Fall through to standard candidate searching
    }
  }

  // Generate sensible search candidates
  const candidates: string[] = [];
  if (cleanTitle.toLowerCase().endsWith('_people') || cleanTitle.toLowerCase().endsWith('_peoples')) {
    candidates.push(cleanTitle);
    candidates.push(cleanTitle.replace(/_peoples?$/, ''));
  } else {
    candidates.push(`${cleanTitle}_people`);
    candidates.push(`${cleanTitle}_peoples`);
    candidates.push(cleanTitle);
  }

  // First try the requested language
  const searchLangs = lang && lang !== 'en' ? [lang, 'en'] : ['en'];

  for (const targetLang of searchLangs) {
    for (const candidate of candidates) {
      const result = await tryFetchSummary(targetLang, candidate);
      if (result) {
        RUNTIME_SUMMARY_CACHE.set(cacheKey, result);
        try {
          // Safe localStorage with LRU eviction safeguard (cap at 150 summaries to avoid QuotaExceededError)
          localStorage.setItem(localKey, JSON.stringify(result));
          const indexKey = 'wiki_summary_index';
          const rawIndex = localStorage.getItem(indexKey);
          const indexList: string[] = rawIndex ? JSON.parse(rawIndex) : [];
          if (!indexList.includes(cacheKey)) {
            indexList.push(cacheKey);
            if (indexList.length > 150) {
              const oldest = indexList.shift();
              if (oldest) localStorage.removeItem(`wiki_summary_${oldest}`);
            }
            localStorage.setItem(indexKey, JSON.stringify(indexList));
          }
        } catch {
          // Safe fallback for sandboxed iframes or quota exhaustion
        }

        return result;
      }
    }
  }

  return null;
}

/**
 * Get enriched Wikipedia dossier for any ethnic group name in the tree
 */
export async function getEthnicDossier(rawName: string, lang: string = 'en'): Promise<WikipediaEthnicEntry | null> {
  const baseEntry = findWikipediaEntry(rawName);
  if (!baseEntry) {
    // Attempt dynamic fetch for unknown group directly
    const live = await fetchLiveWikipediaSummary(rawName, lang);
    if (live && live.extract) {
      return {
        name: rawName,
        article: live.canonicalTitle || `${rawName} people`,
        canonicalTitle: live.canonicalTitle || `${rawName} people`,
        languages: 'African Linguistic Lineage',
        homeland: 'Historical African Homeland',
        subgroups: '',
        religion: 'Traditional & Contemporary Traditions',
        extract: live.extract,
        thumbnail: live.thumbnail,
        description: live.description,
        url: live.url
      };
    }
    return null;
  }

  // If we are on English and already have extract & thumbnail, return immediately with canonicalTitle
  if (lang === 'en' && baseEntry.extract && baseEntry.thumbnail) {
    return {
      ...baseEntry,
      canonicalTitle: baseEntry.canonicalTitle || baseEntry.article
    };
  }

  // Fetch live from Wikipedia REST API in requested language
  const live = await fetchLiveWikipediaSummary(baseEntry.article || rawName, lang);
  if (live) {
    return {
      ...baseEntry,
      canonicalTitle: live.canonicalTitle || baseEntry.canonicalTitle || baseEntry.article,
      extract: live.extract || baseEntry.extract,
      thumbnail: live.thumbnail !== undefined && live.thumbnail !== null ? live.thumbnail : baseEntry.thumbnail,
      description: live.description || baseEntry.description,
      url: live.url || baseEntry.url
    };
  }

  return {
    ...baseEntry,
    canonicalTitle: baseEntry.canonicalTitle || baseEntry.article
  };
}

/**
 * Get all major linguistic families present in the Wikipedia atlas
 */
export function getMajorLinguisticFamilies(): string[] {
  return [
    'All',
    'Bantu',
    'Kwa',
    'Mande',
    'Atlantic–Congo',
    'Afroasiatic',
    'Nilotic',
    'Cushitic',
    'Chadic',
    'Khoisan',
    'Edoid',
    'Gur',
    'Yoruboid',
    'Igboid'
  ];
}
