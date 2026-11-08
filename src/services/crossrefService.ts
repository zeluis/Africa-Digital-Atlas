/**
 * Crossref API Runtime Dynamic Validation & DOI Resolver Service
 *
 * Provides real-time verification against the official Crossref REST API:
 * 1. Checks if a DOI exists (HTTP 200 vs 404/400).
 * 2. Compares the Crossref publication metadata against the report/citation title.
 * 3. Detects "title mismatch" (when a DOI points to an unrelated paper).
 * 4. Discovers the true DOI via bibliographic title/author search when missing or broken.
 * 5. Generates high-confidence academic fallbacks (Google Scholar, Crossref Search, Semantic Scholar).
 * 6. Implements client-side in-memory and localStorage caching to minimize network overhead.
 */

export interface CrossrefAuthor {
  given?: string;
  family?: string;
  name?: string;
}

export interface CrossrefWork {
  doi: string;
  title: string;
  subtitle?: string;
  containerTitle?: string;
  authors: string[];
  publishedYear?: number;
  url: string;
  type?: string;
  publisher?: string;
  isReferencedByCount?: number;
}

export type DoiStatus = 'verified' | 'mismatch' | 'not_found' | 'error' | 'pending';

export interface DoiVerificationResult {
  doi: string;
  status: DoiStatus;
  statusCode?: number;
  expectedTitle?: string;
  actualTitle?: string;
  journal?: string;
  authors?: string[];
  publishedYear?: number;
  similarityScore?: number;
  work?: CrossrefWork;
  resolvedUrl: string;
  fallbackUrls: {
    googleScholar: string;
    crossrefSearch: string;
    semanticScholar: string;
  };
  verifiedAt: string;
  source: 'crossref_api' | 'user_concordance' | 'cached';
  errorMessage?: string;
}

const CACHE_PREFIX = 'afriata_crossref_v1_';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const memoryCache = new Map<string, { result: DoiVerificationResult; timestamp: number }>();

/**
 * Standardizes a DOI string (removes URL prefixes, https://doi.org/, dx.doi.org, doi:)
 */
export function sanitizeDoi(rawDoi: string): string {
  if (!rawDoi) return '';
  return rawDoi
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '')
    .replace(/[#?].*$/, '')
    .trim();
}

/**
 * Generates scholarly search fallback links when a direct DOI is not yet minted, broken, or mismatched.
 */
export function generateAcademicFallbacks(title: string, author?: string, doi?: string) {
  const query = author ? `${title} ${author}` : title;
  const encodedQuery = encodeURIComponent(query.trim());
  const encodedTitle = encodeURIComponent(title.trim());

  return {
    googleScholar: `https://scholar.google.com/scholar?q=${encodedQuery}`,
    crossrefSearch: `https://search.crossref.org/?q=${encodedTitle}`,
    semanticScholar: `https://www.semanticscholar.org/search?q=${encodedTitle}`
  };
}

/**
 * Calculates token-based text similarity (Jaccard + substring containment)
 * between the publication's expected title and Crossref's recorded title.
 */
export function calculateTitleSimilarity(str1?: string, str2?: string): number {
  if (!str1 || !str2) return 0;

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/<[^>]*>/g, '') // remove HTML tags like <i>, <b>
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const n1 = normalize(str1);
  const n2 = normalize(str2);

  if (n1 === n2) return 1.0;
  if (n1.includes(n2) || n2.includes(n1)) return 0.88;

  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'in', 'of', 'for', 'with', 'on', 'at', 'to', 'from', 'by', 'its', 'across', 'towards']);

  const tokens1 = new Set(n1.split(' ').filter(t => t.length > 2 && !stopWords.has(t)));
  const tokens2 = new Set(n2.split(' ').filter(t => t.length > 2 && !stopWords.has(t)));

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  let intersection = 0;
  tokens1.forEach(t => {
    if (tokens2.has(t)) intersection++;
  });

  const union = new Set([...tokens1, ...tokens2]).size;
  const jaccard = intersection / union;

  // Containment ratio relative to the shorter token set
  const containment = intersection / Math.min(tokens1.size, tokens2.size);

  return Math.max(jaccard, containment * 0.85);
}

/**
 * Dynamically queries the Crossref REST API at runtime to validate a DOI and check title integrity.
 */
export async function verifyDoiWithCrossref(
  rawDoi: string,
  expectedTitle?: string,
  skipCache = false
): Promise<DoiVerificationResult> {
  const cleanDoi = sanitizeDoi(rawDoi);
  const fallbacks = generateAcademicFallbacks(expectedTitle || cleanDoi);
  const canonicalUrl = cleanDoi ? `https://doi.org/${cleanDoi}` : '';

  if (!cleanDoi || !/^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/i.test(cleanDoi)) {
    return {
      doi: cleanDoi || rawDoi,
      status: 'error',
      expectedTitle,
      resolvedUrl: canonicalUrl || fallbacks.googleScholar,
      fallbackUrls: fallbacks,
      verifiedAt: new Date().toISOString(),
      source: 'crossref_api',
      errorMessage: 'Invalid DOI syntax'
    };
  }

  // 1. Check in-memory cache
  const cacheKey = `${cleanDoi}_${expectedTitle || ''}`;
  const now = Date.now();
  if (!skipCache) {
    const memHit = memoryCache.get(cacheKey);
    if (memHit && now - memHit.timestamp < CACHE_TTL_MS) {
      return { ...memHit.result, source: 'cached' };
    }

    // Check localStorage cache
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(CACHE_PREFIX + cleanDoi) || localStorage.getItem('africalia_crossref_v1_' + cleanDoi);
        if (stored) {
          const parsed = JSON.parse(stored) as DoiVerificationResult;
          memoryCache.set(cacheKey, { result: parsed, timestamp: now });
          return { ...parsed, source: 'cached' };
        }
      } catch {
        // Continue to network request
      }
    }
  }

  // 2. Fetch directly from Crossref REST API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const endpoint = `https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`;
    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        // Crossref polite pool etiquette
        'User-Agent': 'AfricaDataAtlas/1.0 (https://afriata.org; mailto:atlas-curator@afriata.org)',
        Accept: 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      const result: DoiVerificationResult = {
        doi: cleanDoi,
        status: 'not_found',
        statusCode: 404,
        expectedTitle,
        resolvedUrl: fallbacks.googleScholar, // Safe routing instead of dead 404
        fallbackUrls: fallbacks,
        verifiedAt: new Date().toISOString(),
        source: 'crossref_api',
        errorMessage: 'DOI not registered in Crossref index'
      };
      saveToCache(cleanDoi, result);
      return result;
    }

    if (!response.ok) {
      const result: DoiVerificationResult = {
        doi: cleanDoi,
        status: 'error',
        statusCode: response.status,
        expectedTitle,
        resolvedUrl: canonicalUrl,
        fallbackUrls: fallbacks,
        verifiedAt: new Date().toISOString(),
        source: 'crossref_api',
        errorMessage: `Crossref responded with HTTP status ${response.status}`
      };
      return result;
    }

    const data = await response.json();
    const msg = data.message || {};

    const rawTitle = Array.isArray(msg.title) ? msg.title[0] : (msg.title || '');
    const cleanActualTitle = (rawTitle || '').replace(/<[^>]*>/g, '').trim();
    const containerTitle = Array.isArray(msg['container-title']) ? msg['container-title'][0] : (msg['container-title'] || '');
    
    const authors: string[] = [];
    if (Array.isArray(msg.author)) {
      msg.author.forEach((a: CrossrefAuthor) => {
        if (a.name) authors.push(a.name);
        else if (a.family && a.given) authors.push(`${a.given} ${a.family}`);
        else if (a.family) authors.push(a.family);
      });
    }

    let publishedYear: number | undefined;
    const pubParts = msg['published-print']?.['date-parts']?.[0] || msg['published-online']?.['date-parts']?.[0] || msg.issued?.['date-parts']?.[0];
    if (pubParts && pubParts[0]) {
      publishedYear = Number(pubParts[0]);
    }

    const similarity = expectedTitle ? calculateTitleSimilarity(expectedTitle, cleanActualTitle) : 1.0;
    // Considered a match if similarity >= 0.50 or if no expected title was passed
    const isMatch = !expectedTitle || similarity >= 0.50;

    const crossrefWork: CrossrefWork = {
      doi: cleanDoi,
      title: cleanActualTitle,
      subtitle: Array.isArray(msg.subtitle) ? msg.subtitle[0] : undefined,
      containerTitle,
      authors,
      publishedYear,
      url: msg.URL || canonicalUrl,
      type: msg.type,
      publisher: msg.publisher,
      isReferencedByCount: msg['is-referenced-by-count']
    };

    const status: DoiStatus = isMatch ? 'verified' : 'mismatch';

    const result: DoiVerificationResult = {
      doi: cleanDoi,
      status,
      statusCode: 200,
      expectedTitle,
      actualTitle: cleanActualTitle,
      journal: containerTitle,
      authors,
      publishedYear,
      similarityScore: Math.round(similarity * 100) / 100,
      work: crossrefWork,
      // If mismatch, offer user the verified work URL with a clear note or fallbacks
      resolvedUrl: canonicalUrl,
      fallbackUrls: fallbacks,
      verifiedAt: new Date().toISOString(),
      source: 'crossref_api',
      errorMessage: !isMatch 
        ? `DOI exists, but belongs to a different paper: "${cleanActualTitle}" (${containerTitle || 'Journal'})`
        : undefined
    };

    saveToCache(cleanDoi, result);
    return result;
  } catch (err: any) {
    const isAbort = err.name === 'AbortError';
    return {
      doi: cleanDoi,
      status: 'error',
      expectedTitle,
      resolvedUrl: canonicalUrl,
      fallbackUrls: fallbacks,
      verifiedAt: new Date().toISOString(),
      source: 'crossref_api',
      errorMessage: isAbort ? 'Crossref request timed out' : (err.message || 'Network error querying Crossref')
    };
  }
}

/**
 * Searches Crossref for a paper by bibliographic title and optional author,
 * returning candidate matches with their verified DOIs.
 */
export async function searchCrossrefByTitle(title: string, author?: string): Promise<CrossrefWork[]> {
  if (!title || title.trim().length < 4) return [];

  try {
    const query = author ? `${title} ${author}` : title;
    const url = `https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(query)}&rows=5`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AfricaDataAtlas/1.0 (mailto:atlas-curator@afriata.org)',
        Accept: 'application/json'
      }
    });

    if (!response.ok) return [];

    const data = await response.json();
    const items = data.message?.items || [];

    return items.map((msg: any) => {
      const rawTitle = Array.isArray(msg.title) ? msg.title[0] : (msg.title || '');
      const authors: string[] = [];
      if (Array.isArray(msg.author)) {
        msg.author.forEach((a: CrossrefAuthor) => {
          if (a.name) authors.push(a.name);
          else if (a.family && a.given) authors.push(`${a.given} ${a.family}`);
          else if (a.family) authors.push(a.family);
        });
      }
      const pubParts = msg['published-print']?.['date-parts']?.[0] || msg.issued?.['date-parts']?.[0];
      const publishedYear = pubParts ? Number(pubParts[0]) : undefined;

      return {
        doi: sanitizeDoi(msg.DOI || ''),
        title: (rawTitle || '').replace(/<[^>]*>/g, '').trim(),
        containerTitle: Array.isArray(msg['container-title']) ? msg['container-title'][0] : '',
        authors,
        publishedYear,
        url: msg.URL || `https://doi.org/${msg.DOI}`,
        type: msg.type,
        publisher: msg.publisher,
        isReferencedByCount: msg['is-referenced-by-count']
      };
    });
  } catch {
    return [];
  }
}

function saveToCache(doi: string, result: DoiVerificationResult) {
  memoryCache.set(`${doi}_${result.expectedTitle || ''}`, { result, timestamp: Date.now() });
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(CACHE_PREFIX + doi, JSON.stringify(result));
    } catch {
      // Storage quota reached or unavailable
    }
  }
}
