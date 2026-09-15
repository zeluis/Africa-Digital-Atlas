import { WIKIPEDIA_TABLE_ENTRIES, WikipediaEthnicEntry, normalizeEthnicKey } from '../data/wikipediaEthnicAtlas';

export interface WorkerSearchRequest {
  type: 'SEARCH_AND_INDEX';
  query: string;
  region: string;
  country: string;
  linguisticFamily: string;
}

export interface WorkerSearchResponse {
  type: 'SEARCH_AND_INDEX_RESULT';
  results: WikipediaEthnicEntry[];
  totalMatches: number;
}

// Pre-built index cache in worker thread
let indexedEntries: WikipediaEthnicEntry[] | null = null;

function getOrBuildIndex(): WikipediaEthnicEntry[] {
  if (!indexedEntries) {
    indexedEntries = Object.values(WIKIPEDIA_TABLE_ENTRIES);
  }
  return indexedEntries;
}

self.onmessage = (e: MessageEvent<WorkerSearchRequest>) => {
  const { query, region, country, linguisticFamily } = e.data;
  const entries = getOrBuildIndex();

  const q = (query || '').trim().toLowerCase();
  const normalizedQ = normalizeEthnicKey(q);

  const filtered = entries.filter(entry => {
    // Linguistic family match
    if (linguisticFamily && linguisticFamily !== 'All') {
      const entryLanguages = (entry.languages || '').toLowerCase();
      if (!entryLanguages.includes(linguisticFamily.toLowerCase())) return false;
    }

    // Country match (homeland in Wikipedia table contains country names)
    if (country && country !== 'All') {
      const entryHomeland = (entry.homeland || '').toLowerCase();
      if (!entryHomeland.includes(country.toLowerCase())) return false;
    }

    // Query match
    if (q) {
      const name = (entry.name || '').toLowerCase();
      const article = (entry.article || '').toLowerCase();
      const normName = normalizeEthnicKey(name);
      const desc = (entry.description || entry.extract || '').toLowerCase();
      const lang = (entry.languages || '').toLowerCase();
      const homeland = (entry.homeland || '').toLowerCase();

      const matches = 
        name.includes(q) ||
        article.includes(q) ||
        normName.includes(normalizedQ) ||
        desc.includes(q) ||
        lang.includes(q) ||
        homeland.includes(q);

      if (!matches) return false;
    }

    return true;
  });

  const response: WorkerSearchResponse = {
    type: 'SEARCH_AND_INDEX_RESULT',
    results: filtered.slice(0, 50),
    totalMatches: filtered.length
  };

  self.postMessage(response);
};
