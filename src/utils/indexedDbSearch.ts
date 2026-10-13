/**
 * Client-side IndexedDB Full-Text Search Engine for Africa Data Atlas
 * Indexes records, Wikipedia dossiers, working papers, toponyms, and country metadata for instant offline full-text search.
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

  static async indexDocuments(docs: SearchableDocument[]): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        docs.forEach(doc => store.put(doc));
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  static async search(query: string, limit = 20): Promise<SearchableDocument[]> {
    await this.init();
    if (!this.db || !query.trim()) return [];

    const queryLower = query.toLowerCase().trim();
    const terms = queryLower.split(/\s+/);

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const allDocs = (request.result || []) as SearchableDocument[];
          const scored = allDocs.map(doc => {
            let score = 0;
            const titleLower = doc.title.toLowerCase();
            const snippetLower = doc.snippet.toLowerCase();

            terms.forEach(term => {
              if (titleLower.includes(term)) score += 10;
              if (snippetLower.includes(term)) score += 3;
            });

            return { doc, score };
          });

          const filtered = scored.filter(item => item.score > 0);
          filtered.sort((a, b) => b.score - a.score);
          resolve(filtered.slice(0, limit).map(item => item.doc));
        };

        request.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }
}
