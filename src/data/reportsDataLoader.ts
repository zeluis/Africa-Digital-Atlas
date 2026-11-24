/**
 * Automated Drop-in Reports & Working Papers Loader
 *
 * Keeps startup bundles lean by separating lightweight bibliographic metadata
 * (in `reportsData.ts` and `markdownReportsManifest.ts`) from full article bodies
 * (`reportsDataBodies.json` and lazy-loaded `/src/content/{reports,working-papers}/*.md`).
 */

import { useState, useEffect } from 'react';
import {
  ResearchReport,
  ReportCategory,
  RESEARCH_REPORTS as BASELINE_REPORTS,
  ensureReportsBodiesLoaded,
  isReportsBodiesLoaded,
  subscribeReportsBodies
} from './reportsData';
import { MARKDOWN_REPORTS_MANIFEST } from './markdownReportsManifest';
import { AfriataReport } from '../types/afriataReport';
import { WorkingPaperEntry, WORKING_PAPERS_SERIES as BASELINE_WORKING_PAPERS } from './methodologyDossierData';
import { readStorageJson } from '../utils/storageCache';
import { LucideIcon, Dna, Scale, TrendingUp } from 'lucide-react';

/**
 * Lazy Vite globs for markdown monographs & working papers (not eager-bundled at startup)
 */
const dynamicReportFiles = import.meta.glob('../content/reports/*.md', {
  query: '?raw',
  import: 'default'
}) as Record<string, () => Promise<string>>;

const dynamicWorkingPaperFiles = import.meta.glob('../content/working-papers/*.md', {
  query: '?raw',
  import: 'default'
}) as Record<string, () => Promise<string>>;

const hydratedMarkdownReports: Record<string, ResearchReport> = {};
const markdownLoadPromises = new Map<string, Promise<ResearchReport | undefined>>();
const reportListeners = new Set<() => void>();

function notifyReportListeners() {
  reportListeners.forEach((fn) => fn());
}

export function subscribeReportContent(listener: () => void): () => void {
  reportListeners.add(listener);
  return () => {
    reportListeners.delete(listener);
  };
}

function buildMarkdownCatalog(filterWorkingPapers: boolean): Record<string, ResearchReport> {
  const catalog: Record<string, ResearchReport> = {};
  for (const entry of MARKDOWN_REPORTS_MANIFEST) {
    const isWp = Boolean(entry.report.isWorkingPaper);
    if (isWp !== filterWorkingPapers) continue;
    const hydrated = hydratedMarkdownReports[entry.report.id];
    catalog[entry.report.id] = hydrated || entry.report;
  }
  // Include any extra runtime-ingested markdown reports
  for (const [id, rep] of Object.entries(hydratedMarkdownReports)) {
    if (!catalog[id] && Boolean(rep.isWorkingPaper) === filterWorkingPapers) {
      catalog[id] = rep;
    }
  }
  return catalog;
}

/**
 * Returns metadata/hydrated dictionary of markdown monographs from /src/content/reports/
 */
export function loadDropInReports(): Record<string, ResearchReport> {
  return buildMarkdownCatalog(false);
}

/**
 * Returns metadata/hydrated dictionary of markdown working papers from /src/content/working-papers/
 */
export function loadDropInWorkingPapers(): Record<string, ResearchReport> {
  return buildMarkdownCatalog(true);
}

function resolveCandidateIds(id: string): string[] {
  return [
    id,
    id.replace(/^report-/, 'rep-'),
    id.replace(/^rep-/, 'report-'),
    id.replace(/^rep-/, 'wkp-'),
    id.replace(/^wp-/, 'wkp-'),
    id.replace(/^wkp-/, 'wp-')
  ];
}

/**
 * Lazily loads full sections & citations for a baseline report or markdown publication.
 */
export async function ensureReportLoaded(id: string): Promise<ResearchReport | undefined> {
  if (!id) return undefined;
  const candidateIds = resolveCandidateIds(id);

  // 1. Check baseline static reports (sections/citations live in reportsDataBodies.json)
  for (const cid of candidateIds) {
    if (BASELINE_REPORTS[cid]) {
      await ensureReportsBodiesLoaded();
      notifyReportListeners();
      return BASELINE_REPORTS[cid];
    }
  }

  // 2. Check already-hydrated markdown cache
  for (const cid of candidateIds) {
    if (hydratedMarkdownReports[cid]?.sections.length > 0) {
      return hydratedMarkdownReports[cid];
    }
  }

  // 3. Match against markdown manifest entry
  const manifestEntry = MARKDOWN_REPORTS_MANIFEST.find((e) => candidateIds.includes(e.report.id));
  const loaderKey = manifestEntry?.sourceKey;
  const loaderFn =
    (loaderKey && (dynamicReportFiles[loaderKey] || dynamicWorkingPaperFiles[loaderKey])) ||
    null;

  if (loaderFn && manifestEntry) {
    const cacheKey = manifestEntry.report.id;
    const existingPromise = markdownLoadPromises.get(cacheKey);
    if (existingPromise) return existingPromise;

    const promise = (async () => {
      try {
        const [rawContent, { ingestNotebookMarkdown }] = await Promise.all([
          loaderFn(),
          import('./notebookIngestionPipeline')
        ]);
        const folderPath = manifestEntry.sourceKey.replace('../content/', '');
        const { report } = ingestNotebookMarkdown(rawContent, folderPath);
        if (manifestEntry.report.isWorkingPaper) {
          report.isWorkingPaper = true;
        }
        hydratedMarkdownReports[report.id] = report;
        notifyReportListeners();
        return report;
      } catch (err) {
        console.warn(`[DropInReportsLoader] Failed to lazily load "${manifestEntry.sourceKey}":`, err);
        return manifestEntry.report;
      } finally {
        markdownLoadPromises.delete(cacheKey);
      }
    })();

    markdownLoadPromises.set(cacheKey, promise);
    return promise;
  }

  return getReportById(id);
}

/**
 * React hook that ensures a report's full sections/citations are loaded and triggers re-render on arrival.
 */
export function useReportContentLoaded(reportId: string): boolean {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    const bump = () => {
      if (active) setTick((t) => t + 1);
    };
    const unsub1 = subscribeReportContent(bump);
    const unsub2 = subscribeReportsBodies(bump);
    void ensureReportLoaded(reportId);
    return () => {
      active = false;
      unsub1();
      unsub2();
    };
  }, [reportId]);

  const current = getReportById(reportId);
  return Boolean(current && current.sections && current.sections.length > 0) || isReportsBodiesLoaded() || tick > 0;
}

/**
 * Returns unified dictionary of all Working Papers (from /src/content/working-papers/,
 * reports tagged as working papers, and client-side uploaded working papers)
 */
export function getAllWorkingPapers(): Record<string, ResearchReport> {
  const dropInWp = loadDropInWorkingPapers();
  const dropInReports = loadDropInReports();
  const unifiedWp: Record<string, ResearchReport> = { ...dropInWp };

  // Include any report in /src/content/reports/ whose frontmatter marks it as a working paper
  for (const [id, rep] of Object.entries(dropInReports)) {
    if (rep.isWorkingPaper) {
      unifiedWp[id] = rep;
    }
  }

  // Merge client-side dynamically uploaded working papers from localStorage
  const savedWp = readStorageJson<Record<string, ResearchReport>>(
    'afriata_custom_working_papers',
    {},
    { legacyKey: 'africalia_custom_working_papers' }
  );
  if (savedWp && typeof savedWp === 'object') {
    Object.assign(unifiedWp, savedWp);
  }
  const savedReports = readStorageJson<Record<string, ResearchReport>>(
    'afriata_custom_reports',
    {},
    { legacyKey: 'africalia_custom_reports' }
  );
  if (savedReports && typeof savedReports === 'object') {
    for (const [id, rep] of Object.entries(savedReports)) {
      if (rep?.isWorkingPaper) {
        unifiedWp[id] = rep;
      }
    }
  }

  return unifiedWp;
}

/**
 * Converts ingested markdown working papers into WorkingPaperEntry objects
 * and merges them with the baseline WORKING_PAPERS_SERIES for WorkingPapersModal.
 */
export function getUnifiedWorkingPaperEntries(): Array<WorkingPaperEntry & { reportId?: string; isIngestedMarkdown?: boolean }> {
  const markdownWps = Object.values(getAllWorkingPapers());
  const manifestKeyFindingsById = new Map(
    MARKDOWN_REPORTS_MANIFEST.map((m) => [m.report.id, m.keyFindings])
  );

  const convertedEntries: Array<WorkingPaperEntry & { reportId?: string; isIngestedMarkdown?: boolean }> = markdownWps.map((wp, idx) => {
    const computedFindings = wp.sections.length > 0
      ? wp.sections.slice(0, 6).map(sec => {
          if (sec.keyTakeaway) {
            return `${sec.title}: ${sec.keyTakeaway}`;
          }
          const cleanParagraph = sec.content
            .replace(/\[REF:[^|\]]+(?:\|([^\]]+))?\]/g, '($1)')
            .replace(/[#*`|]/g, '')
            .split('\n\n')[0]
            .trim()
            .slice(0, 260);
          return `${sec.title} — ${cleanParagraph}${cleanParagraph.length >= 260 ? '...' : ''}`;
        })
      : (manifestKeyFindingsById.get(wp.id) || []);

    const seriesNum = wp.seriesNumber || `Afriata Working Paper No. 0${8 + idx}`;
    const authorStr = wp.authors.join(', ') || 'Afriata';
    const yearMatch = wp.publicationDate.match(/\d{4}/);
    const yearStr = yearMatch ? yearMatch[0] : '2026';

    return {
      id: wp.id,
      reportId: wp.id,
      isIngestedMarkdown: true,
      seriesNumber: seriesNum,
      type: 'Working Paper',
      title: wp.title,
      subtitle: wp.subtitle || wp.categoryLabel,
      author: authorStr,
      affiliation: wp.institutions?.[0] || 'Afriata Interdisciplinary Research & Knowledge Initiative',
      date: wp.publicationDate,
      jelCodes: wp.jelCodes || ['N17', 'O10', 'N37', 'F54'],
      abstract: wp.executiveSummary.replace(/\[REF:[^|\]]+(?:\|([^\]]+))?\]/g, '($1)'),
      keyFindings: computedFindings.length > 0 ? computedFindings : [wp.executiveSummary],
      citationApa: `${authorStr} (${yearStr}). ${wp.title}: ${wp.subtitle || wp.categoryLabel}. ${seriesNum}. Afriata Research Platform. https://doi.org/${wp.doi.replace('https://doi.org/', '')}`,
      downloadFilename: `${wp.id}.pdf`
    };
  });

  // Deduplicate by ID against BASELINE_WORKING_PAPERS
  const seenIds = new Set(convertedEntries.map(e => e.id));
  const baselineFiltered = BASELINE_WORKING_PAPERS.filter(b => !seenIds.has(b.id));

  return [...convertedEntries, ...baselineFiltered];
}

/**
 * Returns unified dictionary of all reports (typed as AfriataReport | ResearchReport)
 */
export function getAllAfriataReports(): Record<string, AfriataReport> {
  return getAllReports() as unknown as Record<string, AfriataReport>;
}

/**
 * Returns unified dictionary of all reports AND working papers:
 * 1. Base reports (metadata synchronous, bodies hydrated lazily)
 * 2. Drop-in markdown reports & working papers (metadata from manifest / hydrated bodies)
 * 3. Client-side dynamically imported reports & working papers (from localStorage)
 */
export function getAllReports(): Record<string, ResearchReport> {
  const dropInReports = loadDropInReports();
  const dropInWorkingPapers = loadDropInWorkingPapers();

  const unified: Record<string, ResearchReport> = {
    ...BASELINE_REPORTS,
    ...dropInReports,
    ...dropInWorkingPapers
  };

  const savedReports = readStorageJson<Record<string, ResearchReport>>(
    'afriata_custom_reports',
    {},
    { legacyKey: 'africalia_custom_reports' }
  );
  if (savedReports && typeof savedReports === 'object') {
    Object.assign(unified, savedReports);
  }
  const savedWp = readStorageJson<Record<string, ResearchReport>>(
    'afriata_custom_working_papers',
    {},
    { legacyKey: 'africalia_custom_working_papers' }
  );
  if (savedWp && typeof savedWp === 'object') {
    Object.assign(unified, savedWp);
  }

  return unified;
}

export function getReportById(id: string): ResearchReport | undefined {
  if (!id) return undefined;
  const unified = getAllReports();
  if (unified[id]) return unified[id];

  // Resolve legacy prefix aliases cleanly without polluting Object.values(getAllReports())
  const candidates = resolveCandidateIds(id);
  for (const candidate of candidates) {
    if (unified[candidate]) return unified[candidate];
  }
  return undefined;
}

/**
 * Checks whether a given navigation tab ID corresponds to a Research Report or Working Paper
 */
export function isReportOrPaperTab(tabId: string): boolean {
  if (!tabId) return false;
  if (tabId.startsWith('report-') || tabId.startsWith('rep-') || tabId.startsWith('wp-') || tabId.startsWith('wkp-')) {
    return true;
  }
  return Boolean(getReportById(tabId));
}

export interface NavReportItem {
  id: string;
  label: string;
  icon: LucideIcon | string;
  badge: string;
  category: ReportCategory | 'overview' | 'working-papers';
}

export interface NavReportGroup {
  title: string;
  categoryKey: ReportCategory | 'overview' | 'working-papers';
  items: NavReportItem[];
}

function getReportBadge(report: ResearchReport): string {
  if (report.isWorkingPaper) {
    return 'Working Paper';
  }
  if (report.classification) {
    const classStr = typeof report.classification === 'string'
      ? report.classification
      : (report.classification.disciplines?.[0] || report.classification.pillar);
    if (classStr) {
      const parts = classStr.split(/[&,/]/);
      if (parts[0] && parts[0].trim().length <= 16) {
        return parts[0].trim();
      }
    }
  }
  if (report.category === 'genetics') return 'Genomics';
  if (report.category === 'international-law') return 'Jurisprudence';
  return 'Development';
}

function getReportIcon(category: ReportCategory): LucideIcon {
  switch (category) {
    case 'genetics':
      return Dna;
    case 'international-law':
      return Scale;
    case 'development-sociology':
    default:
      return TrendingUp;
  }
}

export function getCategorizedReports(): NavReportGroup[] {
  const allReports = getAllReports();
  const reportsList = Object.values(allReports);

  const groups: NavReportGroup[] = [
    {
      title: 'Overview',
      categoryKey: 'overview',
      items: [
        { id: 'research-directory', label: 'Directory', icon: 'lucide:book-a', badge: 'Directory', category: 'overview' }
      ]
    },
    {
      title: 'Genetics',
      categoryKey: 'genetics',
      items: []
    },
    {
      title: 'Law & Reparations',
      categoryKey: 'international-law',
      items: []
    },
    {
      title: 'Development',
      categoryKey: 'development-sociology',
      items: []
    },
    {
      title: 'Working Papers',
      categoryKey: 'working-papers',
      items: []
    }
  ];

  const knownBadges: Record<string, string> = {
    'report-genetic-linguistic-blueprints': 'Creole DNA',
    'report-genetic-social-structure-cape-verde': 'Genealogies',
    'report-creole-admixture-cabo-verde': 'Crucibles',
    'report-latest-developments-genetic-legacy': 'Ancient DNA',
    'report-slavery-international-law-reparatory': 'CARICOM / ICJ',
    'report-sovereign-responsibility-reparations': 'Balance Sheets',
    'report-reparations-debt-anthropocene': 'Climate Debt',
    'report-ancestry-ideology-underdevelopment': 'Econometric',
    'report-rao-model-socioeconomic': 'Capital Policy',
    'report-sociological-origins-racism': 'Historical',
    'report-bantu-expansion-genomics': 'Archaeogenomics',
    'rep-bantu-expansion-genomics': 'Archaeogenomics',
    'report-trans-saharan-jurisprudence': 'Timbuktu Charters',
    'rep-trans-saharan-jurisprudence': 'Timbuktu Charters',
    'rep-economics-europe-atlantic-2026': 'Working Paper No. 08',
    'wkp-economics-europe-atlantic-2026': 'Working Paper No. 08'
  };

  const seenReportIds = new Set<string>();

  for (const rep of reportsList) {
    if (seenReportIds.has(rep.id)) continue;
    seenReportIds.add(rep.id);

    const item: NavReportItem = {
      id: rep.id,
      label: rep.title.replace(/^Research:\s*/i, ''),
      icon: rep.icon || getReportIcon(rep.category),
      badge: knownBadges[rep.id] || getReportBadge(rep),
      category: rep.category
    };

    if (rep.isWorkingPaper) {
      groups[4].items.push({
        ...item,
        badge: rep.seriesNumber ? rep.seriesNumber.replace('Afriata ', '') : 'Working Paper',
        category: 'working-papers'
      });
    } else {
      if (rep.category === 'genetics') {
        groups[1].items.push(item);
      } else if (rep.category === 'international-law') {
        groups[2].items.push(item);
      } else {
        groups[3].items.push(item);
      }
    }
  }

  return groups;
}
