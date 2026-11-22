import MiniSearch from 'minisearch';
import { tokenizeSearchText } from './textNormalize';

/**
 * Client-side IndexedDB + MiniSearch Full-Text Search Engine for Africa Data Atlas
 * Indexes records, Wikipedia dossiers, working papers, toponyms, and country metadata
 * with Unicode diacritic folding, prefix matching, and fuzzy tolerance for offline search.
 */

export interface SearchableDocument {
  id: string;
  title: string;
  category: 'Country' | 'Historical Record' | 'Wikipedia Dossier' | 'Working Paper' | 'Toponym' | 'Slave Voyage';
  snippet: string;
  urlPath?: string;
  metadata?: Record<string, any>;
}

const DB_NAME = 'AfricaDataAtlasSearchDB';
const STORE_NAME = 'search_index';
const DB_VERSION = 1;

export class AtlasSearchEngine {
  private static db: IDBDatabase | null = null;
  private static isInitialized = false;
  private static cachedDocs: SearchableDocument[] | null = null;
  private static hydrationPromise: Promise<SearchableDocument[]> | null = null;
  private static searchIndex: MiniSearch<SearchableDocument> | null = null;
  private static docsById: Map<string, SearchableDocument> = new Map();

  static async init(): Promise<void> {
    if (this.isInitialized && this.db) return;

    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        resolve();
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => resolve();
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.isInitialized = true;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('title', 'title', { unique: false });
        }
      };
    });
  }

  private static buildMiniSearch(docs: SearchableDocument[]): MiniSearch<SearchableDocument> {
    this.docsById = new Map(docs.map((doc) => [doc.id, doc]));
    const index = new MiniSearch<SearchableDocument>({
      fields: ['title', 'category', 'snippet'],
      storeFields: ['id'],
      tokenize: (text) => tokenizeSearchText(text),
      processTerm: (term) => (term.length >= 1 ? term : null),
    });
    if (docs.length > 0) {
      index.addAll(docs);
    }
    this.searchIndex = index;
    return index;
  }

  private static async loadAllDocuments(): Promise<SearchableDocument[]> {
    if (this.cachedDocs !== null) {
      return this.cachedDocs;
    }
    if (this.hydrationPromise) {
      return this.hydrationPromise;
    }

    const db = this.db;
    if (!db) return [];

    const promise = new Promise<SearchableDocument[]>((resolve) => {
      try {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const allDocs = (request.result || []) as SearchableDocument[];
          if (this.hydrationPromise === promise) {
            this.cachedDocs = allDocs;
            this.buildMiniSearch(allDocs);
            this.hydrationPromise = null;
          }
          resolve(allDocs);
        };

        request.onerror = () => {
          if (this.hydrationPromise === promise) {
            this.hydrationPromise = null;
          }
          resolve([]);
        };
      } catch {
        if (this.hydrationPromise === promise) {
          this.hydrationPromise = null;
        }
        resolve([]);
      }
    });

    this.hydrationPromise = promise;
    return promise;
  }

  static async indexDocuments(docs: SearchableDocument[]): Promise<void> {
    this.cachedDocs = null;
    this.hydrationPromise = null;
    this.searchIndex = null;
    await this.init();
    if (!this.db) return;

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        docs.forEach(doc => store.put(doc));
        transaction.oncomplete = () => {
          this.cachedDocs = null;
          this.hydrationPromise = null;
          this.searchIndex = null;
          resolve();
        };
        transaction.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  static async search(query: string, limit = 20): Promise<SearchableDocument[]> {
    if (!query.trim()) return [];
    await this.init();
    if (!this.db) return [];

    const allDocs = await this.loadAllDocuments();
    const index = this.searchIndex ?? this.buildMiniSearch(allDocs);
    const results = index.search(query, {
      prefix: true,
      fuzzy: 0.2,
      boost: { title: 4, category: 1.5, snippet: 1 },
      combineWith: 'OR',
    });

    return results
      .slice(0, limit)
      .map((hit) => this.docsById.get(String(hit.id)))
      .filter((doc): doc is SearchableDocument => Boolean(doc));
  }
}
