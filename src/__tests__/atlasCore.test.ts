import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { atlas } from '../data/atlas-store';
import { generateFullObservations } from '../data/atlas-observations-seed';
import {
  getReportById,
  getUnifiedWorkingPaperEntries,
  getAllReports
} from '../data/reportsDataLoader';
import {
  resolveReportDoi,
  buildPlatformCitations,
  buildReportCitation,
  AFRIATA_DOI
} from '../utils/citationFormatter';
import {
  filterVoyages,
  DEFAULT_FILTERS
} from '../services/slaveVoyagesApi';
import type { Observation, ObservationStatus } from '../data/types';
import type { ResearchReport } from '../data/reportsData';

import {
  resolveAppBasePath,
  resolveAssetPath,
  resolveDocsPath,
  getDeploymentCacheScope,
  inferMountBaseFromLocation
} from '../utils/assetPath';
import {
  resolveApiUrl,
  isStaticHost,
  resetApiAvailabilityCache
} from '../utils/apiClient';

// Shim browser globals for Node test environment if absent
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, val: string) => { store.set(key, String(val)); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => { store.clear(); },
    key: (idx: number) => Array.from(store.keys())[idx] ?? null,
    get length() { return store.size; }
  } as Storage;
}

if (typeof globalThis.window === 'undefined') {
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: globalThis.localStorage,
    location: { href: 'https://afriata.org', hostname: 'afriata.org', pathname: '/' }
  };
}

describe('Afriata Core Test Suite', () => {

  // =========================================================================
  // 1. atlas-store Observation Statuses & Retrieval
  // =========================================================================
  describe('Atlas Store & Observation Status Integrity', () => {
    it('retrieves indicator values and handles sovereign entity lookup', () => {
      const ngaGdp = atlas.getIndicatorValue('NGA', 'NY.GDP.MKTP.CD');
      expect(ngaGdp).toBeTypeOf('number');
      expect(ngaGdp).toBeGreaterThan(0);

      const ngaPop = atlas.getIndicatorValue('NGA', 'SP.POP.TOTL');
      expect(ngaPop).toBeTypeOf('number');
      expect(ngaPop).toBeGreaterThan(0);

      // Virtual aliases & direct entity properties
      const landArea = atlas.getIndicatorValue('NGA', 'LAND_AREA');
      expect(landArea).toBeTypeOf('number');
      expect(landArea).toBeGreaterThan(100000);

      const indepYear = atlas.getIndicatorValue('NGA', 'INDEPENDENCE_YEAR');
      expect(indepYear).toBe(1960);
    });

    it('returns null for non-existent indicators or entities', () => {
      const invalid = atlas.getIndicatorValue('XYZ_INVALID', 'NON_EXISTENT');
      expect(invalid).toBeNull();
    });

    it('verifies all observations have valid epistemic observation status flags', () => {
      const allObservations: Observation[] = generateFullObservations();
      expect(allObservations.length).toBeGreaterThan(100);

      const validStatuses: Set<ObservationStatus> = new Set([
        'observed',
        'estimated',
        'forecast',
        'derived',
        'imputed',
        'not_available',
        'not_covered'
      ]);

      const derivedObservations: Observation[] = [];

      for (const obs of allObservations) {
        expect(validStatuses.has(obs.status)).toBe(true);
        if (obs.status === 'derived') {
          derivedObservations.push(obs);
        }
      }

      // Derived observations must carry explicit derivation notes
      expect(derivedObservations.length).toBeGreaterThan(0);
      for (const derived of derivedObservations) {
        expect(derived.notes).toBeDefined();
        expect(typeof derived.notes).toBe('string');
        expect(derived.notes!.trim().length).toBeGreaterThan(5);
      }
    });

    it('filters observations by entity and indicator chronologically', () => {
      const ngaGdpObservations = atlas.getObservations('NGA', 'NY.GDP.MKTP.CD');
      expect(ngaGdpObservations.length).toBeGreaterThanOrEqual(3);

      // Chronological ascending order
      for (let i = 1; i < ngaGdpObservations.length; i++) {
        expect(ngaGdpObservations[i].period).toBeGreaterThanOrEqual(ngaGdpObservations[i - 1].period);
      }

      const latest = atlas.getLatestObservation('NGA', 'NY.GDP.MKTP.CD');
      expect(latest).toBeDefined();
      expect(latest?.period).toBe(ngaGdpObservations[ngaGdpObservations.length - 1].period);
    });
  });

  // =========================================================================
  // 2. reportsDataLoader Deduplication & Aliases
  // =========================================================================
  describe('Reports Data Loader & Alias Resolution', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('resolves canonical ID and legacy prefix aliases for reports', () => {
      // report-genetic-linguistic-blueprints vs rep-genetic-linguistic-blueprints
      const canonical = getReportById('report-genetic-linguistic-blueprints');
      expect(canonical).toBeDefined();
      expect(canonical?.title).toContain('Genetic and Linguistic Blueprints');

      const aliased = getReportById('rep-genetic-linguistic-blueprints');
      expect(aliased).toBeDefined();
      expect(aliased?.id).toBe(canonical?.id);
      expect(aliased?.title).toBe(canonical?.title);
    });

    it('resolves working paper aliases between wp- and wkp- prefixes', () => {
      // Test dynamic candidate resolution with a mock working paper stored in custom working papers
      const testWpId = 'wp-development-atlantic-fiscal-counterfactuals';
      const mockWp: ResearchReport = {
        id: testWpId,
        title: 'Counterfactual Capital Accumulation and Maritime Insurance in the Atlantic System',
        subtitle: 'Afriata Working Paper on Shapley Value Decompositions',
        category: 'development-sociology',
        categoryLabel: 'Development & Historical Economics',
        categoryColor: '#10B981',
        classification: 'Development & Historical Economics',
        publicationDate: '2026-10-04',
        readingTimeMinutes: 22,
        doi: '10.6084/m9.figshare.34063314',
        institutions: ['Afriata Research Platform'],
        authors: ['Afriata'],
        executiveSummary: 'Executive summary on Atlantic trade counterfactuals.',
        sections: [],
        citations: [],
        isWorkingPaper: true,
        seriesNumber: 'Afriata Working Paper No. 09',
        jelCodes: ['N17', 'O10', 'F54']
      };

      localStorage.setItem('afriata_custom_working_papers', JSON.stringify({
        [testWpId]: mockWp
      }));

      // Both wp- and wkp- prefixes must resolve to the same report
      const fromWp = getReportById('wp-development-atlantic-fiscal-counterfactuals');
      expect(fromWp).toBeDefined();
      expect(fromWp?.id).toBe(testWpId);

      const fromWkp = getReportById('wkp-development-atlantic-fiscal-counterfactuals');
      expect(fromWkp).toBeDefined();
      expect(fromWkp?.id).toBe(testWpId);
      expect(fromWkp?.title).toBe(mockWp.title);
    });

    it('guarantees getUnifiedWorkingPaperEntries deduplication across baseline and ingested reports', () => {
      // Base entries
      const initialEntries = getUnifiedWorkingPaperEntries();
      expect(initialEntries.length).toBeGreaterThan(0);

      // Verify no duplicate IDs exist initially
      const idSet = new Set(initialEntries.map(e => e.id));
      expect(idSet.size).toBe(initialEntries.length);

      // Ingest a report that shares an ID with a baseline working paper (e.g., 'afriata-working-paper-07')
      const duplicateId = 'afriata-working-paper-07';
      const mockIngested: ResearchReport = {
        id: duplicateId,
        title: 'Overridden Working Paper Title',
        subtitle: null,
        category: 'development-sociology',
        categoryLabel: 'Development',
        categoryColor: '#10B981',
        classification: 'Development & Historical Economics',
        publicationDate: '2026-10-04',
        readingTimeMinutes: 15,
        doi: '10.6084/m9.figshare.34063314',
        institutions: ['Afriata'],
        authors: ['Afriata Research Team'],
        executiveSummary: 'Updated abstract for deduplication test.',
        sections: [],
        citations: [],
        isWorkingPaper: true
      };

      localStorage.setItem('afriata_custom_working_papers', JSON.stringify({
        [duplicateId]: mockIngested
      }));

      const unified = getUnifiedWorkingPaperEntries();
      const occurrences = unified.filter(e => e.id === duplicateId);
      expect(occurrences.length).toBe(1);
      // Ingested entry overrides or deduplicates baseline
      expect(occurrences[0].title).toBe('Overridden Working Paper Title');

      // Total list still has 100% unique IDs
      const unifiedIdSet = new Set(unified.map(e => e.id));
      expect(unifiedIdSet.size).toBe(unified.length);
    });
  });

  // =========================================================================
  // 3. citationFormatter Formats & Resolvers
  // =========================================================================
  describe('Citation Formatter & DOI Resolution', () => {
    it('resolves report DOIs correctly with fallback for empty or default', () => {
      // Empty input -> fallback
      const emptyRes = resolveReportDoi('');
      expect(emptyRes.doi).toBe(AFRIATA_DOI);
      expect(emptyRes.doiUrl).toBe(`https://doi.org/${AFRIATA_DOI}`);

      // Undefined input -> fallback
      const undefRes = resolveReportDoi(undefined);
      expect(undefRes.doi).toBe(AFRIATA_DOI);

      // Default afriata placeholder string -> fallback
      const afriataPlaceholderRes = resolveReportDoi('https://afriata.org/doi');
      expect(afriataPlaceholderRes.doi).toBe(AFRIATA_DOI);

      // Custom valid external DOI
      const customRes = resolveReportDoi('10.1371/journal.pone.0051103');
      expect(customRes.doi).toBe('10.1371/journal.pone.0051103');
      expect(customRes.doiUrl).toBe('https://doi.org/10.1371/journal.pone.0051103');

      // Custom valid external DOI with https://
      const fullUrlRes = resolveReportDoi('https://doi.org/10.1038/s41586-023-06770-6');
      expect(fullUrlRes.doi).toBe('https://doi.org/10.1038/s41586-023-06770-6');
      expect(fullUrlRes.doiUrl).toBe('https://doi.org/10.1038/s41586-023-06770-6');
    });

    it('builds platform citations across all 8 required formats', () => {
      const citations = buildPlatformCitations({
        doi: AFRIATA_DOI,
        pageUrl: 'https://afriata.org',
        accessDate: '2026-11-15',
        version: '2026.1'
      });

      const requiredFormats = ['apa', 'chicago', 'harvard', 'mla', 'bibtex', 'ris', 'cff', 'enw'] as const;
      for (const fmt of requiredFormats) {
        expect(citations[fmt]).toBeDefined();
        expect(typeof citations[fmt]).toBe('string');
        expect(citations[fmt].length).toBeGreaterThan(20);
      }

      // Check specific bibliographic indicators
      expect(citations.apa).toContain('Correia, Z. F.');
      expect(citations.apa).toContain(AFRIATA_DOI);
      expect(citations.chicago).toContain('Correia, Zéluis F.');
      expect(citations.bibtex).toContain('@dataset{correia_africa_data_atlas_2026');
      expect(citations.bibtex).toContain('@software{correia_afriata_vector_engine_2026');
      expect(citations.ris).toContain('TY  - DATA');
      expect(citations.ris).toContain('ER  -');
      expect(citations.cff).toContain('cff-version: 1.2.0');
      expect(citations.enw).toContain('%0 Dataset');
    });

    it('builds valid report citations for chicago, apa, bibtex, ris, and jsonld', () => {
      const report = getReportById('report-genetic-linguistic-blueprints');
      expect(report).toBeDefined();

      if (!report) return;

      const chicago = buildReportCitation(report, 'chicago');
      expect(chicago).toContain(report.title);
      expect(chicago).toContain('Afriata: Africa Data Atlas');

      const apa = buildReportCitation(report, 'apa');
      expect(apa).toContain(report.title);
      expect(apa).toMatch(/\(\d{4}\)/); // year in parentheses

      const bibtex = buildReportCitation(report, 'bibtex');
      expect(bibtex).toContain('@article{');
      expect(bibtex).toContain(`title={${report.title}}`);

      const ris = buildReportCitation(report, 'ris');
      expect(ris).toContain('TY  - JOUR');
      expect(ris).toContain(`TI  - ${report.title}`);
      expect(ris).toContain('ER  -');

      const jsonldStr = buildReportCitation(report, 'jsonld');
      expect(() => JSON.parse(jsonldStr)).not.toThrow();
      const jsonld = JSON.parse(jsonldStr);
      expect(jsonld['@context']).toBe('https://schema.org');
      expect(jsonld['@type']).toBe('ScholarlyArticle');
      expect(jsonld.headline).toBe(report.title);
      expect(Array.isArray(jsonld.author)).toBe(true);
    });
  });

  // =========================================================================
  // 4. slaveVoyagesApi Filters & Epistemic Modes
  // =========================================================================
  describe('SlaveVoyages API Filters & Epistemic Modes', () => {
    it('applies default filters and produces non-empty consolidated stats', () => {
      const result = filterVoyages(DEFAULT_FILTERS);
      expect(result.totalMatches).toBeGreaterThan(0);
      expect(result.voyages.length).toBe(result.totalMatches);
      expect(result.aggregateStats.totalVoyages).toBe(result.totalMatches);
      expect(result.aggregateStats.totalEmbarked).toBeGreaterThan(0);
      expect(result.aggregateStats.totalDisembarked).toBeGreaterThan(0);
      expect(result.aggregateStats.uniqueVessels).toBeGreaterThan(0);
      expect(result.provenance.epistemicMode).toBe('imputed');
    });

    it('filters strictly by yearRange', () => {
      const range: [number, number] = [1700, 1750];
      const result = filterVoyages({
        ...DEFAULT_FILTERS,
        yearRange: range
      });

      expect(result.totalMatches).toBeGreaterThan(0);
      for (const v of result.voyages) {
        expect(v.dates.departureYear).toBeGreaterThanOrEqual(1700);
        expect(v.dates.departureYear).toBeLessThanOrEqual(1750);
      }
      expect(result.aggregateStats.earliestYear).toBeGreaterThanOrEqual(1700);
      expect(result.aggregateStats.latestYear).toBeLessThanOrEqual(1750);
    });

    it('filters by embarkationRegions', () => {
      const result = filterVoyages({
        ...DEFAULT_FILTERS,
        embarkationRegions: ['Bight of Benin']
      });

      expect(result.totalMatches).toBeGreaterThan(0);
      for (const v of result.voyages) {
        expect(v.itinerary.principalPlaceOfSlavePurchase.region).toBe('Bight of Benin');
      }
    });

    it('filters by carrier nationality', () => {
      const result = filterVoyages({
        ...DEFAULT_FILTERS,
        carriers: ['Portugal / Brazil']
      });

      expect(result.totalMatches).toBeGreaterThan(0);
      for (const v of result.voyages) {
        expect(v.carrier.nationality).toBe('Portugal / Brazil');
      }
    });

    it('filters by vesselSearch text query across vessel name, captain, and owner', () => {
      const result = filterVoyages({
        ...DEFAULT_FILTERS,
        vesselSearch: 'Amistad'
      });

      expect(result.totalMatches).toBeGreaterThan(0);
      for (const v of result.voyages) {
        const matches =
          v.vessel.name.toLowerCase().includes('amistad') ||
          (v.vessel.captain && v.vessel.captain.toLowerCase().includes('amistad')) ||
          (v.vessel.owner && v.vessel.owner.toLowerCase().includes('amistad'));
        expect(matches).toBe(true);
      }
    });

    it('filters by minimum mortality rate threshold', () => {
      const minRate = 15;
      const result = filterVoyages({
        ...DEFAULT_FILTERS,
        minMortalityRate: minRate
      });

      expect(result.totalMatches).toBeGreaterThan(0);
      for (const v of result.voyages) {
        expect(v.enslaved.mortalityRateImputed).toBeGreaterThanOrEqual(minRate);
      }
    });

    it('filters by resistance/rebellion flag', () => {
      const result = filterVoyages({
        ...DEFAULT_FILTERS,
        onlyResistanceRebellions: true
      });

      expect(result.totalMatches).toBeGreaterThan(0);
      for (const v of result.voyages) {
        expect(v.resistance.hasRebellion).toBe(true);
      }
      expect(result.aggregateStats.rebellionsCount).toBe(result.totalMatches);
    });

    it('filters by post-1808 illicit trade period', () => {
      const result = filterVoyages({
        ...DEFAULT_FILTERS,
        post1808IllicitOnly: true
      });

      expect(result.totalMatches).toBeGreaterThan(0);
      for (const v of result.voyages) {
        expect(v.outcomes.slaveTradeAbolitionPeriod).not.toBe('Pre-1808 Legal');
      }
    });

    it('computes epistemicMode scaling arithmetic correctly', () => {
      const baseFilters = {
        ...DEFAULT_FILTERS,
        yearRange: [1700, 1800] as [number, number]
      };

      const observedRes = filterVoyages({ ...baseFilters, epistemicMode: 'observed' });
      const imputedRes = filterVoyages({ ...baseFilters, epistemicMode: 'imputed' });
      const demographicRes = filterVoyages({ ...baseFilters, epistemicMode: 'estimates' });

      expect(observedRes.totalMatches).toBe(imputedRes.totalMatches);
      expect(demographicRes.totalMatches).toBe(imputedRes.totalMatches);

      // Imputed total embarked must be >= observed
      expect(imputedRes.aggregateStats.totalEmbarked).toBeGreaterThanOrEqual(
        observedRes.aggregateStats.totalEmbarked
      );

      // Demographic estimates apply 1.17x continental demographic scaling factor
      expect(demographicRes.aggregateStats.totalEmbarked).toBeGreaterThan(
        imputedRes.aggregateStats.totalEmbarked
      );

      // Disembarked in demographic mode also applies 1.14x scaling
      expect(demographicRes.aggregateStats.totalDisembarked).toBeGreaterThan(
        imputedRes.aggregateStats.totalDisembarked
      );
    });
  });

  // =========================================================================
  // 5. Hosting, Subdirectory & API Capability Resilience
  // =========================================================================
  describe('Hosting, Subdirectory & API Capability Resilience', () => {
    const originalLocation = window.location;

    afterEach(() => {
      vi.unstubAllEnvs();
      resetApiAvailabilityCache();
      Object.defineProperty(window, 'location', {
        configurable: true,
        writable: true,
        value: originalLocation
      });
    });

    it('preserves absolute URLs and avoids duplicate prefixes in resolveAssetPath', () => {
      expect(resolveAssetPath('https://cdn.example.org/img.webp')).toBe('https://cdn.example.org/img.webp');
      expect(resolveAssetPath('data:image/png;base64,abc')).toBe('data:image/png;base64,abc');
      const once = resolveAssetPath('/africa-final.svg');
      const twice = resolveAssetPath(once);
      expect(twice).toBe(once);
    });

    it('resolves root vs subdirectory mounts accurately with and without trailing slash', () => {
      expect(inferMountBaseFromLocation('example.org', '/team/atlas')).toBe('/team/atlas/');
      expect(inferMountBaseFromLocation('example.org', '/team/atlas/')).toBe('/team/atlas/');
      expect(inferMountBaseFromLocation('example.org', '/team/atlas/countries/NGA')).toBe('/team/atlas/');

      vi.stubEnv('BASE_URL', '/team/atlas');
      expect(resolveAppBasePath()).toBe('/team/atlas/');
      expect(resolveAssetPath('./africa-final.svg')).toBe('/team/atlas/africa-final.svg');
      expect(resolveDocsPath('')).toBe('/team/atlas/docs/');
      expect(resolveDocsPath('UNIVERSAL_STYLE_GUIDE.md')).toBe('/team/atlas/docs/UNIVERSAL_STYLE_GUIDE.html');
      expect(resolveApiUrl('/api/tts')).toBe('/team/atlas/api/tts');
      expect(getDeploymentCacheScope()).toBe('team-atlas');
    });

    it('handles GitHub Pages user sites cleanly when pathname is an app route', () => {
      expect(inferMountBaseFromLocation('zeluis.github.io', '/countries/NGA')).toBe('/');
      expect(isStaticHost('zeluis.github.io')).toBe(true);
      expect(isStaticHost('atlas.example.org')).toBe(false);
    });

    it('detects GitHub Pages project subpath and enables static-only API guard', () => {
      expect(inferMountBaseFromLocation('zeluis.github.io', '/Africa-Digital-Atlas/')).toBe('/Africa-Digital-Atlas/');
      expect(inferMountBaseFromLocation('zeluis.github.io', '/Africa-Digital-Atlas')).toBe('/Africa-Digital-Atlas/');

      vi.stubEnv('BASE_URL', '/Africa-Digital-Atlas/');
      expect(resolveAppBasePath()).toBe('/Africa-Digital-Atlas/');
      expect(resolveAssetPath('sw.js')).toBe('/Africa-Digital-Atlas/sw.js');
      expect(resolveDocsPath('')).toBe('/Africa-Digital-Atlas/docs/');
      expect(getDeploymentCacheScope()).toBe('africa-digital-atlas');
    });
  });
});

