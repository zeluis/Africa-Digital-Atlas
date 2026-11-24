import fs from 'node:fs';
import path from 'node:path';
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
      expect(citations.chicago).toContain('Correia, ZéLuis F.');
      expect(citations.cff).toContain('given-names: "ZéLuis F."');
      expect(citations.cff).toContain('date-released: "2026-11-18"');
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
      expect(resolveApiUrl('/api/health')).toBe('/team/atlas/api/health');
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

  // =========================================================================
  // 8. ZERO-KEY AFRICAN VOICE PACK & OS WEB SPEECH UPGRADE
  // =========================================================================
  describe('Zero-Key African Voice Engine & Static Audio Pack', () => {
    it('resolves all 18 African Mother Tongues & 6 Language Families from static audio pack with 48-bucket waveforms', async () => {
      const {
        resolveStaticAudioClip,
        STATIC_AFRICAN_AUDIO_CLIPS,
      } = await import('../utils/afriataVoiceEngine');
      const { LANGUAGE_FAMILY_GREETINGS } = await import('../utils/africanLanguageGreetings');
      const { AFRICAN_MOTHER_TONGUES } = await import('../data/motherTonguesAudioData');

      const expectedMotherKeys = [
        'akan', 'amharic', 'swahili', 'kabuverdianu', 'zulu',
        'yoruba', 'igbo', 'hausa', 'fon', 'arabic_maghrebi',
        'tamazight', 'wolof', 'oromo', 'somali', 'xhosa',
        'lingala', 'fula', 'khoekhoegowab',
      ];
      expect(Object.keys(AFRICAN_MOTHER_TONGUES).length).toBe(18);

      for (const key of expectedMotherKeys) {
        const entry = AFRICAN_MOTHER_TONGUES[key];
        expect(entry).toBeDefined();
        expect(entry.waveformProfile).toHaveLength(48);
        expect(entry.durationSeconds).toBeGreaterThan(0.5);

        const clipById = resolveStaticAudioClip({ audioClipId: entry.audioClipId });
        const clipByPhrase = resolveStaticAudioClip({ text: entry.greetingText, langTag: entry.bcp47Tag });
        expect(clipById).not.toBeNull();
        expect(clipByPhrase?.id).toBe(entry.audioClipId);
        expect(STATIC_AFRICAN_AUDIO_CLIPS[entry.audioClipId].file).toMatch(/^audio\/tongues\/mother-.*\.mp3$/);

        if (entry.proverbAudioClipId) {
          const proverbClip = resolveStaticAudioClip({ audioClipId: entry.proverbAudioClipId });
          expect(proverbClip).not.toBeNull();
          expect(proverbClip?.tier).toBe('extended');
          expect(proverbClip?.file).toMatch(/^audio\/tongues\/extended\/proverb-.*\.mp3$/);
        }
      }

      for (const fam of Object.values(LANGUAGE_FAMILY_GREETINGS)) {
        const clip = resolveStaticAudioClip({ audioClipId: fam.audioClipId, text: fam.nativePhrase });
        expect(clip).not.toBeNull();
        expect(clip?.file).toMatch(/^audio\/tongues\/family-.*\.mp3$/);
      }

      // Extended typology clips
      for (const typId of ['typology-nguni-clicks', 'typology-yoruba-tones']) {
        const clip = resolveStaticAudioClip({ audioClipId: typId });
        expect(clip).not.toBeNull();
        expect(clip?.tier).toBe('extended');
      }

      // Verify every referenced file exists in public/ and aligns with manifest.json
      const manifestPath = path.resolve(process.cwd(), 'public/audio/tongues/manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const manifestMap = new Map<string, any>(manifest.clips.map((c: any) => [c.id, c]));

      for (const clip of Object.values(STATIC_AFRICAN_AUDIO_CLIPS)) {
        const absFile = path.resolve(process.cwd(), 'public', clip.file);
        expect(fs.existsSync(absFile)).toBe(true);
        const manifestClip = manifestMap.get(clip.id);
        expect(manifestClip).toBeDefined();
        expect(manifestClip.file).toBe(clip.file);
      }
    });

    it('ranks native African & Lusophone OS voices accurately without male bias', async () => {
      const { getBestSystemVoice } = await import('../utils/afriataVoiceEngine');
      const mockVoices = [
        { name: 'Microsoft David Desktop', lang: 'en-US' },
        { name: 'Google US English', lang: 'en-US' },
        { name: 'Microsoft Zuri Online (Natural) - Swahili (Kenya)', lang: 'sw-KE' },
        { name: 'Microsoft Thando Online (Natural) - Zulu (South Africa)', lang: 'zu-ZA' },
        { name: 'Microsoft Mekdes Online (Natural) - Amharic (Ethiopia)', lang: 'am-ET' },
        { name: 'Microsoft Ubax Online (Natural) - Somali (Somalia)', lang: 'so-SO' },
        { name: 'Microsoft Denise Online (Natural) - French (France)', lang: 'fr-FR' },
        { name: 'Microsoft Mouna Online (Natural) - Arabic (Morocco)', lang: 'ar-MA' },
        { name: 'Microsoft Raquel Online (Natural) - Portuguese (Portugal)', lang: 'pt-PT' },
        { name: 'Microsoft Francisca Online (Natural) - Portuguese (Brazil)', lang: 'pt-BR' },
        { name: 'Microsoft Ezinne Online (Natural) - English (Nigeria)', lang: 'en-NG' },
        { name: 'Microsoft Leah Online (Natural) - English (South Africa)', lang: 'en-ZA' },
      ] as SpeechSynthesisVoice[];

      const origSpeech = window.speechSynthesis;
      Object.defineProperty(window, 'speechSynthesis', {
        configurable: true,
        value: { getVoices: () => mockVoices, cancel: vi.fn() },
      });

      try {
        expect(getBestSystemVoice('sw-KE').voice?.lang).toBe('sw-KE');
        expect(getBestSystemVoice('zu-ZA').voice?.lang).toBe('zu-ZA');
        expect(getBestSystemVoice('am-ET').voice?.lang).toBe('am-ET');
        expect(getBestSystemVoice('so-SO').voice?.lang).toBe('so-SO');
        // Oromo falls back to Cushitic sister Somali or Ethiopian Amharic when om-ET OS voice is absent
        expect(['so-SO', 'am-ET']).toContain(getBestSystemVoice('om-ET').voice?.lang);
        // Kabyle/Tamazight falls back to Maghrebi/Francophone regional bridge instead of US English
        expect(['ar-MA', 'fr-FR']).toContain(getBestSystemVoice('kab-DZ').voice?.lang);
        // Wolof falls back to Francophone regional voice instead of US English
        expect(getBestSystemVoice('wo-SN').voice?.lang).toBe('fr-FR');
        // Cape Verdean Creole falls back to non-palatalizing pt-PT natural female voice instead of pt-BR
        expect(getBestSystemVoice('pt-CV').voice?.lang).toBe('pt-PT');
        // Akan falls back to West African English when ak-GH OS pack is absent
        expect(getBestSystemVoice('ak-GH').voice?.lang).toBe('en-NG');
        // English prioritizes African English natural voice
        expect(getBestSystemVoice('en').voice?.lang).toBe('en-NG');
      } finally {
        Object.defineProperty(window, 'speechSynthesis', {
          configurable: true,
          value: origSpeech,
        });
      }
    });

    it('pre-renders all 8 TOP_BAR_UI_GREETINGS into static audio pack and makes zero runtime /api/tts calls', async () => {
      const {
        TOP_BAR_UI_GREETINGS,
        resolveStaticAudioClip,
        speakAfriataGreeting,
        stopAfriataSpeech,
        STATIC_AFRICAN_AUDIO_CLIPS,
      } = await import('../utils/afriataVoiceEngine');

      const uiLangs = ['en', 'fr', 'pt', 'es', 'it', 'nl', 'de', 'ar'];
      const manifestPath = path.resolve(process.cwd(), 'public/audio/tongues/manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const manifestMap = new Map<string, any>(manifest.clips.map((c: any) => [c.id, c]));

      for (const code of uiLangs) {
        const greeting = TOP_BAR_UI_GREETINGS[code];
        expect(greeting).toBeDefined();
        expect(greeting.audioClipId).toBe(`ui-greeting-${code}`);

        const clip = resolveStaticAudioClip({ audioClipId: greeting.audioClipId, text: greeting.phrase });
        expect(clip).not.toBeNull();
        expect(clip?.file).toBe(`audio/tongues/ui-greeting-${code}.mp3`);
        expect(STATIC_AFRICAN_AUDIO_CLIPS[clip!.id]).toBeDefined();
        expect(fs.existsSync(path.resolve(process.cwd(), 'public', clip!.file))).toBe(true);
        expect(manifestMap.get(clip!.id)?.file).toBe(clip!.file);
      }

      const origFetch = globalThis.fetch;
      const fetchSpy = vi.fn();
      globalThis.fetch = fetchSpy as unknown as typeof fetch;

      try {
        speakAfriataGreeting({
          text: TOP_BAR_UI_GREETINGS.en.phrase,
          audioClipId: TOP_BAR_UI_GREETINGS.en.audioClipId,
          langTag: TOP_BAR_UI_GREETINGS.en.langTag,
        });
        speakAfriataGreeting({
          text: 'Dynamic screen reader narrative fallback without static clip',
          langTag: 'en-NG',
        });
        expect(fetchSpy).not.toHaveBeenCalled();
      } finally {
        stopAfriataSpeech();
        globalThis.fetch = origFetch;
      }
    });
  });

  // =========================================================================
  // 9. SHARED STORAGE LRU, FETCH TIMEOUT & CSV FORMULA NEUTRALIZATION
  // =========================================================================
  describe('Shared Storage LRU, Fetch Timeout & CSV Formula Neutralization', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
      vi.useRealTimers();
    });

    it('enforces LRU eviction order, legacy migration, and malformed JSON recovery in createBoundedStorageLru', async () => {
      const { createBoundedStorageLru } = await import('../utils/storageCache');
      const lru = createBoundedStorageLru<{ v: number }>({
        prefix: 'test_lru_',
        indexKey: 'test_lru_index',
        maxEntries: 2,
        legacyPrefix: 'legacy_lru_',
      });

      lru.set('a', { v: 1 });
      lru.set('b', { v: 2 });
      // Access 'a' so 'b' becomes the least-recently-used key
      expect(lru.get('a')).toEqual({ v: 1 });

      // Adding 'c' must evict 'b' while retaining 'a' and 'c'
      lru.set('c', { v: 3 });
      expect(lru.get('b')).toBeNull();
      expect(localStorage.getItem('test_lru_b')).toBeNull();
      expect(lru.get('a')).toEqual({ v: 1 });
      expect(lru.get('c')).toEqual({ v: 3 });

      // Malformed JSON value and malformed index recover safely without throwing
      localStorage.setItem('test_lru_corrupt', '{not-valid-json');
      localStorage.setItem('test_lru_index', 'not-json-either');
      expect(lru.get('corrupt')).toBeNull();
      expect(localStorage.getItem('test_lru_corrupt')).toBeNull();

      // Legacy prefix migration
      localStorage.setItem('legacy_lru_mig', JSON.stringify({ v: 99 }));
      expect(lru.get('mig')).toEqual({ v: 99 });
      expect(localStorage.getItem('test_lru_mig')).toBe(JSON.stringify({ v: 99 }));
      expect(localStorage.getItem('legacy_lru_mig')).toBeNull();
    });

    it('clears fetchWithTimeout timer cleanly on resolution, rejection, and abort', async () => {
      const { fetchWithTimeout } = await import('../utils/apiClient');
      const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
      const origFetch = globalThis.fetch;

      try {
        // 1. Resolution clears timer
        globalThis.fetch = vi.fn().mockResolvedValue(new Response('ok', { status: 200 })) as unknown as typeof fetch;
        const okRes = await fetchWithTimeout('https://example.org/ok', { timeoutMs: 5000 });
        expect(okRes.status).toBe(200);
        expect(clearSpy).toHaveBeenCalled();

        clearSpy.mockClear();

        // 2. Rejection clears timer
        globalThis.fetch = vi.fn().mockRejectedValue(new Error('network fail')) as unknown as typeof fetch;
        await expect(fetchWithTimeout('https://example.org/err', { timeoutMs: 5000 })).rejects.toThrow('network fail');
        expect(clearSpy).toHaveBeenCalled();

        clearSpy.mockClear();

        // 3. Timeout triggers AbortController and clears timer
        vi.useFakeTimers();
        const fakeClearSpy = vi.spyOn(globalThis, 'clearTimeout');
        globalThis.fetch = vi.fn((_url, init?: RequestInit) => {
          return new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              const abortErr = new Error('The operation was aborted.');
              abortErr.name = 'AbortError';
              reject(abortErr);
            });
          });
        }) as unknown as typeof fetch;

        const pending = fetchWithTimeout('https://example.org/slow', { timeoutMs: 1200 });
        const expectation = expect(pending).rejects.toMatchObject({ name: 'AbortError' });
        await vi.advanceTimersByTimeAsync(1200);
        await expectation;
        expect(fakeClearSpy).toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
        vi.restoreAllMocks();
        globalThis.fetch = origFetch;
      }
    });

    it('neutralizes CSV formula payloads and quotes delimiters via escapeCsvCell', async () => {
      const { escapeCsvCell } = await import('../utils/exportUtils');

      expect(escapeCsvCell('=CMD|"/C calc"!A0')).toBe(`"'=CMD|""/C calc""!A0"`);
      expect(escapeCsvCell('+1+1')).toBe(`"'+1+1"`);
      expect(escapeCsvCell('-2*3')).toBe(`"'-2*3"`);
      expect(escapeCsvCell('@SUM(A1:A2)')).toBe(`"'@SUM(A1:A2)"`);
      expect(escapeCsvCell('  =HYPERLINK("https://evil.example")')).toBe(`"'  =HYPERLINK(""https://evil.example"")"`);
      expect(escapeCsvCell('ECOWAS, Corridor', { quoteAllStrings: true })).toBe('"ECOWAS, Corridor"');
      expect(escapeCsvCell(1250)).toBe('1250');
    });

    it('migrates legacy storage keys safely via readStorageString/readStorageJson and enforces upload bounds in readUploadedTextFile', async () => {
      const { readStorageString, readStorageJson, removeStorageKey } = await import('../utils/storageCache');
      const { readUploadedTextFile } = await import('../utils/fileUpload');

      localStorage.setItem('legacy_flag_key', 'true');
      expect(readStorageString('modern_flag_key', undefined, { legacyKey: 'legacy_flag_key' })).toBe('true');
      expect(localStorage.getItem('modern_flag_key')).toBe('true');
      expect(localStorage.getItem('legacy_flag_key')).toBeNull();

      localStorage.setItem('legacy_json_key', JSON.stringify({ count: 3 }));
      expect(readStorageJson('modern_json_key', { count: 0 }, { legacyKey: 'legacy_json_key' })).toEqual({ count: 3 });
      removeStorageKey('modern_json_key', 'legacy_json_key');
      expect(localStorage.getItem('modern_json_key')).toBeNull();

      const validFile = new File(['<svg></svg>'], 'map.svg', { type: 'image/svg+xml' });
      await expect(readUploadedTextFile(validFile, { allowedExtensions: ['.svg'] })).resolves.toBe('<svg></svg>');

      const oversized = new File(['x'.repeat(32)], 'big.svg', { type: 'image/svg+xml' });
      await expect(readUploadedTextFile(oversized, { maxBytes: 10 })).rejects.toThrow(/maximum file size/i);

      const wrongType = new File(['{}'], 'bad.txt', { type: 'text/plain' });
      await expect(
        readUploadedTextFile(wrongType, { allowedExtensions: ['.svg'], allowedMimeTypes: ['image/svg+xml'] })
      ).rejects.toThrow(/Unsupported file type/i);
    });
  });

  // =========================================================================
  // 10. ENTRY BUNDLE HYGIENE, DEFERRED ONBOARDING & HOOKS
  // =========================================================================
  describe('Startup Bundle Hygiene & Shared Hooks', () => {
    it('keeps TOP_BAR_UI_GREETINGS decoupled from afriataVoiceEngine in Navbar and VoiceWelcomeFab', () => {
      const topBarGreetings = fs.readFileSync(path.resolve(process.cwd(), 'src/data/topBarGreetings.ts'), 'utf8');
      expect(topBarGreetings).toContain('export const TOP_BAR_UI_GREETINGS');
      expect(topBarGreetings).toContain('export const AFRIATA_SPEECH_STOP_EVENT');

      const navbarSrc = fs.readFileSync(path.resolve(process.cwd(), 'src/components/Navbar.tsx'), 'utf8');
      expect(navbarSrc).toContain('../data/topBarGreetings');
      expect(navbarSrc).not.toMatch(/from\s+['"]\.\.\/utils\/afriataVoiceEngine['"]/);

      const fabSrc = fs.readFileSync(path.resolve(process.cwd(), 'src/components/VoiceWelcomeFab.tsx'), 'utf8');
      expect(fabSrc).not.toMatch(/from\s+['"]\.\.\/utils\/afriataVoiceEngine['"]/);
      expect(fabSrc).toContain("import('../utils/afriataVoiceEngine')");
    });

    it('defers first-visit onboarding auto-open off synchronous mount in useAtlasModalStore', async () => {
      localStorage.removeItem('afriata_onboarding_v1');
      localStorage.removeItem('africalia_onboarding_v1');
      vi.resetModules();
      vi.useFakeTimers();

      try {
        const { atlasModalStore } = await import('../stores/useAtlasModalStore');
        // Immediately after construction, onboarding modal must NOT be active yet
        expect(atlasModalStore.getState().activeModal).toBeNull();

        await vi.advanceTimersByTimeAsync(700);
        expect(atlasModalStore.getState().activeModal).toBe('onboarding');
        atlasModalStore.closeModal('onboarding');
      } finally {
        vi.useRealTimers();
      }
    });
  });
});

