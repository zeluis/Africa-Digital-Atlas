// Curated Wikipedia Cultural Atlas for Sovereign Afriata Ethnic Tree
// Sources:
// - Wikipedia: List of contemporary ethnic groups of Africa (https://en.wikipedia.org/wiki/List_of_contemporary_ethnic_groups_of_Africa)
// - Wikipedia REST API v1 (https://en.wikipedia.org/api/rest_v1/)

import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface WikipediaEthnicEntry {
  name: string;
  article: string;
  canonicalTitle?: string;
  languages: string;
  homeland: string;
  subgroups: string;
  religion: string;
  extract?: string;
  thumbnail?: string | null;
  description?: string;
  url?: string;
}

const tableEntriesUrl = new URL('./wikipediaTableEntries.json', import.meta.url).href;
const preCacheUrl = new URL('./wikipediaPreCache.json', import.meta.url).href;

export const WIKIPEDIA_TABLE_ENTRIES: WikipediaEthnicEntry[] = [];
export const WIKIPEDIA_PRE_CACHE: Record<string, Partial<WikipediaEthnicEntry>> = {};

// Normalize string for fuzzy key lookup
export function normalizeEthnicKey(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Curated high-priority aliases for foundational African lineages
const SPECIAL_ETHNIC_ALIASES: Record<string, Partial<WikipediaEthnicEntry>> = {
  san: {
    name: 'San',
    article: 'San peoples',
    canonicalTitle: 'San peoples',
    languages: 'Khoe–Kwadi, Tuu, Kxʼa (Khoisan Phyla)',
    homeland: 'Southern Africa (Botswana, Namibia, South Africa, Angola)',
    subgroups: 'ǃKung, ǀXam, Khomani, Naro, Haiǁom, Juǀʼhoansi',
    religion: 'Traditional San cosmological shamanism & Kaggen trickster mythology'
  },
  bushmen: {
    name: 'San',
    article: 'San peoples',
    canonicalTitle: 'San peoples',
    languages: 'Khoisan Phyla',
    homeland: 'Southern Africa (Kalahari Basin)',
    subgroups: 'ǃKung, ǀXam, Juǀʼhoansi',
    religion: 'Traditional San cosmology'
  },
  khoisan: {
    name: 'Khoisan / San',
    article: 'San peoples',
    canonicalTitle: 'San peoples',
    languages: 'Khoisan Phyla',
    homeland: 'Southern Africa',
    subgroups: 'San, Khoikhoi, Nama',
    religion: 'Traditional cosmological systems'
  },
  khoikhoi: {
    name: 'Khoikhoi',
    article: 'Khoikhoi',
    canonicalTitle: 'Khoikhoi',
    languages: 'Khoe languages',
    homeland: 'Southern Africa (South Africa, Namibia)',
    subgroups: 'Nama, Korana, Griqua',
    religion: 'Traditional cosmology, Christianity'
  },
  yoruba: {
    name: 'Yoruba',
    article: 'Yoruba people',
    canonicalTitle: 'Yoruba people',
    languages: 'Niger–Congo → Atlantic–Congo → Volta–Niger → Yoruboid → Yoruba',
    homeland: 'Nigeria (Southwest), Benin, Togo',
    subgroups: 'Oyo, Ijebu, Egba, Ekiti, Ijesha, Ondo, Akoko, Owo, Yewa, Ketu',
    religion: 'Christianity, Islam, Traditional Yoruba religion (Ifá, Òrìṣà)'
  },
  igbo: {
    name: 'Igbo',
    article: 'Igbo people',
    canonicalTitle: 'Igbo people',
    languages: 'Niger–Congo → Atlantic–Congo → Volta–Niger → Igboid → Igbo',
    homeland: 'Nigeria (Southeast: Abia, Anambra, Ebonyi, Enugu, Imo, Delta, Rivers)',
    subgroups: 'Aniocha, Owerri, Ngwa, Aro, Edda, Waawa, Ikwerre',
    religion: 'Christianity, Odinani (traditional Igbo religion)'
  },
  akan: {
    name: 'Akan',
    article: 'Akan people',
    canonicalTitle: 'Akan people',
    languages: 'Niger–Congo → Atlantic–Congo → Kwa → Potou–Tano → Twi / Fante',
    homeland: 'Ghana, Ivory Coast',
    subgroups: 'Asante, Fante, Akuapem, Akyem, Baoulé, Bono, Kwahu, Denkyira',
    religion: 'Christianity, Traditional Akan religion (Onyame, Abosom)'
  },
  hausa: {
    name: 'Hausa',
    article: 'Hausa people',
    canonicalTitle: 'Hausa people',
    languages: 'Afroasiatic → Chadic → West Chadic → Hausa',
    homeland: 'Nigeria (North), Niger',
    subgroups: 'Kano, Daura, Gobir, Katsina, Rano, Zaria (Zazzau)',
    religion: 'Islam, Bori traditional religion'
  }
};

// Built-in lookup map populated on hydration
const ENTRIES_BY_KEY = new Map<string, WikipediaEthnicEntry>();

function rebuildIndex() {
  ENTRIES_BY_KEY.clear();
  for (const entry of WIKIPEDIA_TABLE_ENTRIES) {
    ENTRIES_BY_KEY.set(normalizeEthnicKey(entry.name), entry);
    const altKey = normalizeEthnicKey(entry.article.replace(/\s+people.*$/i, ''));
    if (!ENTRIES_BY_KEY.has(altKey)) {
      ENTRIES_BY_KEY.set(altKey, entry);
    }
  }
}

const wikipediaAtlasStore = createLazyAssetStore<WikipediaEthnicEntry[]>(
  [tableEntriesUrl, preCacheUrl],
  ([tableRaw, preCacheRaw]) => {
    if (Array.isArray(tableRaw)) {
      WIKIPEDIA_TABLE_ENTRIES.splice(0, WIKIPEDIA_TABLE_ENTRIES.length, ...tableRaw);
    }
    if (preCacheRaw && typeof preCacheRaw === 'object') {
      Object.assign(WIKIPEDIA_PRE_CACHE, preCacheRaw);
    }
    rebuildIndex();
    return WIKIPEDIA_TABLE_ENTRIES;
  },
  () => WIKIPEDIA_TABLE_ENTRIES
);

export const ensureWikipediaAtlasLoaded = wikipediaAtlasStore.ensureLoaded;
export const isWikipediaAtlasLoaded = wikipediaAtlasStore.isLoaded;
export const subscribeWikipediaAtlas = wikipediaAtlasStore.subscribe;
export const useWikipediaAtlasLoaded = wikipediaAtlasStore.useLoaded;

function enrichEntry(entry: WikipediaEthnicEntry): WikipediaEthnicEntry {
  const cached = WIKIPEDIA_PRE_CACHE[entry.article] ||
                 WIKIPEDIA_PRE_CACHE[`${entry.name} people`] ||
                 WIKIPEDIA_PRE_CACHE[`${entry.name} peoples`] ||
                 WIKIPEDIA_PRE_CACHE[entry.name];
  return {
    ...entry,
    canonicalTitle: entry.canonicalTitle || cached?.canonicalTitle || entry.article,
    extract: cached?.extract || entry.extract,
    thumbnail: cached?.thumbnail !== undefined ? cached.thumbnail : entry.thumbnail,
    description: cached?.description || entry.description,
    url: cached?.url || entry.url || `https://en.wikipedia.org/wiki/${encodeURIComponent(entry.article.replace(/\s+/g, '_'))}`
  };
}

/**
 * Resolve Wikipedia metadata for an ethnic group name
 */
export function findWikipediaEntry(rawName: string): WikipediaEthnicEntry | null {
  if (!rawName) return null;
  const key = normalizeEthnicKey(rawName);

  // 1. Direct special alias match (e.g. San, Bushmen, Yoruba, Igbo, Akan, Hausa)
  if (SPECIAL_ETHNIC_ALIASES[key]) {
    const alias = SPECIAL_ETHNIC_ALIASES[key];
    const fullEntry: WikipediaEthnicEntry = {
      name: alias.name || rawName,
      article: alias.article || `${rawName} people`,
      canonicalTitle: alias.canonicalTitle || alias.article,
      languages: alias.languages || 'African Linguistic Family',
      homeland: alias.homeland || 'Historical African Homeland',
      subgroups: alias.subgroups || '',
      religion: alias.religion || 'Traditional African Traditions & Contemporary Faiths'
    };
    return enrichEntry(fullEntry);
  }

  // 2. Direct key match
  if (ENTRIES_BY_KEY.has(key)) {
    return enrichEntry(ENTRIES_BY_KEY.get(key)!);
  }

  // 3. Check compound parts (e.g. "Edo / Bini" -> "Edo", "Bini")
  const parts = rawName.split(/[\/\-()]/).map(s => s.trim()).filter(Boolean);
  for (const part of parts) {
    const partKey = normalizeEthnicKey(part);
    if (SPECIAL_ETHNIC_ALIASES[partKey]) {
      const alias = SPECIAL_ETHNIC_ALIASES[partKey];
      return enrichEntry({
        name: alias.name || part,
        article: alias.article || `${part} people`,
        canonicalTitle: alias.canonicalTitle || alias.article,
        languages: alias.languages || 'African Linguistic Family',
        homeland: alias.homeland || 'Historical African Homeland',
        subgroups: alias.subgroups || '',
        religion: alias.religion || 'Traditional African Traditions & Contemporary Faiths'
      });
    }
    if (ENTRIES_BY_KEY.has(partKey)) {
      return enrichEntry(ENTRIES_BY_KEY.get(partKey)!);
    }
  }

  // 4. Exact word matching across known table entries (avoid matching 'esan' when searching 'san')
  if (key.length >= 2) {
    for (const entry of WIKIPEDIA_TABLE_ENTRIES) {
      const entryKey = normalizeEthnicKey(entry.name);
      if (entryKey === key) {
        return enrichEntry(entry);
      }
    }
  }

  // 5. Fallback synthetic entry pointing to canonical Wikipedia article
  const cleanName = parts[0] || rawName;
  const canonicalArticle = cleanName.toLowerCase().endsWith('people') || cleanName.toLowerCase().endsWith('peoples')
    ? cleanName
    : `${cleanName} people`;
  const cached = WIKIPEDIA_PRE_CACHE[canonicalArticle] || WIKIPEDIA_PRE_CACHE[cleanName];

  return {
    name: cleanName,
    article: canonicalArticle,
    canonicalTitle: cached?.canonicalTitle || canonicalArticle,
    languages: 'African Linguistic Family',
    homeland: 'Historical African Homeland',
    subgroups: '',
    religion: 'Traditional African Traditions & Contemporary Faiths',
    extract: cached?.extract,
    thumbnail: cached?.thumbnail,
    description: cached?.description,
    url: cached?.url || `https://en.wikipedia.org/wiki/${encodeURIComponent(canonicalArticle.replace(/\s+/g, '_'))}`
  };
}
