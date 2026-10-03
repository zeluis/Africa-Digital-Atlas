/**
 * Automated Drop-in Reports & Working Papers Loader
 * 
 * Uses Vite's `import.meta.glob` to automatically discover, parse, and register:
 * 1. All Markdown (.md) monographs dropped into `/src/content/reports/*.md`
 * 2. All Markdown (.md) working papers dropped into `/src/content/working-papers/*.md`
 * 
 * Pipeline flow:
 * 1. Discovers every .md file in `/src/content/reports/` and `/src/content/working-papers/` at compile time.
 * 2. Ingests and normalizes metadata, sections, and semantic [REF] tags via `notebookIngestionPipeline`.
 * 3. Merges them with baseline statically compiled monographs in `reportsData.ts` and `methodologyDossierData.ts`.
 * 4. Provides dynamic grouping utilities for NavigationDrawer, ResearchReportsDirectoryView, and WorkingPapersModal.
 */

import { ingestNotebookMarkdown } from './notebookIngestionPipeline';
import { ResearchReport, ReportCategory, RESEARCH_REPORTS as BASELINE_REPORTS } from './reportsData';
import { AfricaliaReport } from '../types/africaliaReport';
import { WorkingPaperEntry, WORKING_PAPERS_SERIES as BASELINE_WORKING_PAPERS } from './methodologyDossierData';
import { LucideIcon, BookOpen, Dna, Scale, TrendingUp, Cpu, FileText } from 'lucide-react';
import rawBantu from '../content/reports/bantu-expansion-genomics.md?raw';
import rawTransSaharan from '../content/reports/trans-saharan-jurisprudence.md?raw';
import rawEuropeAtlanticReport from '../content/reports/economics-europe-atlantic.md?raw';
import rawEuropeAtlanticWorkingPaper from '../content/working-papers/economics-europe-atlantic.md?raw';

/**
 * Direct seed raw markdown imports to guarantee availability in all environments
 */
const SEED_REPORT_FILES: Record<string, string> = {
  '../content/reports/bantu-expansion-genomics.md': rawBantu,
  '../content/reports/trans-saharan-jurisprudence.md': rawTransSaharan,
  '../content/reports/economics-europe-atlantic.md': rawEuropeAtlanticReport
};

const SEED_WORKING_PAPER_FILES: Record<string, string> = {
  '../content/working-papers/economics-europe-atlantic.md': rawEuropeAtlanticWorkingPaper
};

/**
 * Vite eagerly loads any additional markdown files in /src/content/reports/ as raw strings
 */
const dynamicReportFiles = import.meta.glob('../content/reports/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

/**
 * Vite eagerly loads any markdown files in /src/content/working-papers/ as raw strings
 */
const dynamicWorkingPaperFiles = import.meta.glob('../content/working-papers/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

const reportMarkdownFiles: Record<string, string> = {
  ...SEED_REPORT_FILES,
  ...dynamicReportFiles
};

const workingPaperMarkdownFiles: Record<string, string> = {
  ...SEED_WORKING_PAPER_FILES,
  ...dynamicWorkingPaperFiles
};

/**
 * Ingests all discovered markdown monographs from /src/content/reports/
 */
export function loadDropInReports(): Record<string, ResearchReport> {
  const dropInCatalog: Record<string, ResearchReport> = {};

  for (const [path, rawContent] of Object.entries(reportMarkdownFiles)) {
    try {
      if (typeof rawContent === 'string' && rawContent.trim()) {
        const { report } = ingestNotebookMarkdown(rawContent, path.replace('../content/reports/', 'reports/'));
        dropInCatalog[report.id] = report;
      }
    } catch (err) {
      console.warn(`[DropInReportsLoader] Failed to ingest report at "${path}":`, err);
    }
  }

  return dropInCatalog;
}

/**
 * Ingests all discovered markdown working papers from /src/content/working-papers/
 */
export function loadDropInWorkingPapers(): Record<string, ResearchReport> {
  const wpCatalog: Record<string, ResearchReport> = {};

  for (const [path, rawContent] of Object.entries(workingPaperMarkdownFiles)) {
    try {
      if (typeof rawContent === 'string' && rawContent.trim()) {
        const { report } = ingestNotebookMarkdown(rawContent, path.replace('../content/working-papers/', 'working-papers/'));
        report.isWorkingPaper = true;
        wpCatalog[report.id] = report;
      }
    } catch (err) {
      console.warn(`[DropInWorkingPapersLoader] Failed to ingest working paper at "${path}":`, err);
    }
  }

  return wpCatalog;
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
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const savedWp = localStorage.getItem('africalia_custom_working_papers');
      if (savedWp) {
        const parsed = JSON.parse(savedWp);
        Object.assign(unifiedWp, parsed);
      }
      const savedReports = localStorage.getItem('africalia_custom_reports');
      if (savedReports) {
        const parsedReports = JSON.parse(savedReports) as Record<string, ResearchReport>;
        for (const [id, rep] of Object.entries(parsedReports)) {
          if (rep.isWorkingPaper) {
            unifiedWp[id] = rep;
          }
        }
      }
    } catch {
      // Ignore parse errors
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
  const convertedEntries: Array<WorkingPaperEntry & { reportId?: string; isIngestedMarkdown?: boolean }> = markdownWps.map((wp, idx) => {
    const keyFindings = wp.sections.slice(0, 6).map(sec => {
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
    });

    const seriesNum = wp.seriesNumber || `Africalia Working Paper No. 0${8 + idx}`;
    const authorStr = wp.authors.join(', ') || 'Africalia';
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
      affiliation: wp.institutions?.[0] || 'Africalia Interdisciplinary Research & Knowledge Initiative',
      date: wp.publicationDate,
      jelCodes: wp.jelCodes || ['N17', 'O10', 'N37', 'F54'],
      issnPlaceholder: wp.issn || 'ISSN 2983-4921 (Online Archive)',
      abstract: wp.executiveSummary.replace(/\[REF:[^|\]]+(?:\|([^\]]+))?\]/g, '($1)'),
      keyFindings: keyFindings.length > 0 ? keyFindings : [wp.executiveSummary],
      citationApa: `${authorStr} (${yearStr}). ${wp.title}: ${wp.subtitle || wp.categoryLabel}. ${seriesNum}. Africalia Research Platform. https://doi.org/${wp.doi.replace('https://doi.org/', '')}`,
      downloadFilename: `${wp.id}.pdf`
    };
  });

  // Deduplicate by ID against BASELINE_WORKING_PAPERS
  const seenIds = new Set(convertedEntries.map(e => e.id));
  const baselineFiltered = BASELINE_WORKING_PAPERS.filter(b => !seenIds.has(b.id));

  return [...convertedEntries, ...baselineFiltered];
}

/**
 * Returns unified dictionary of all reports (typed as AfricaliaReport | ResearchReport)
 */
export function getAllAfricaliaReports(): Record<string, AfricaliaReport> {
  return getAllReports() as unknown as Record<string, AfricaliaReport>;
}

/**
 * Returns unified dictionary of all reports AND working papers:
 * 1. Base hardcoded reports
 * 2. Drop-in markdown files from /src/content/reports/
 * 3. Drop-in markdown working papers from /src/content/working-papers/
 * 4. Client-side dynamically imported reports & working papers (from localStorage)
 */
export function getAllReports(): Record<string, ResearchReport> {
  const dropInReports = loadDropInReports();
  const dropInWorkingPapers = loadDropInWorkingPapers();
  
  // Merge baseline + drop-in reports + drop-in working papers
  const unified: Record<string, ResearchReport> = {
    ...BASELINE_REPORTS,
    ...dropInReports,
    ...dropInWorkingPapers
  };

  // Merge client-side dynamically imported localStorage reports & working papers if in browser
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const savedReports = localStorage.getItem('africalia_custom_reports');
      if (savedReports) {
        const parsed = JSON.parse(savedReports);
        Object.assign(unified, parsed);
      }
      const savedWp = localStorage.getItem('africalia_custom_working_papers');
      if (savedWp) {
        const parsedWp = JSON.parse(savedWp);
        Object.assign(unified, parsedWp);
      }
    } catch {
      // Ignore parse errors on stored items
    }
  }

  return unified;
}

/**
 * Checks whether a given navigation tab ID corresponds to a Research Report or Working Paper
 */
export function isReportOrPaperTab(tabId: string): boolean {
  if (!tabId) return false;
  if (tabId.startsWith('report-') || tabId.startsWith('rep-') || tabId.startsWith('wp-')) {
    return true;
  }
  const all = getAllReports();
  return Boolean(all[tabId]);
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

/**
 * Helper to determine an appropriate badge for a report item
 */
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

/**
 * Helper to select an appropriate Lucide icon for report category
 */
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

/**
 * Dynamic categorized report subgroups for the navigation drawer.
 * Every uploaded report or working paper displays in its pillar/category
 * AND working papers also display in the dedicated Working Papers subgroup.
 */
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

  // Map known badges for existing reports to retain bespoke curated labels
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
    'report-trans-saharan-jurisprudence': 'Timbuktu Charters',
    'rep-economics-europe-atlantic-2026': 'Working Paper No. 08'
  };

  for (const rep of reportsList) {
    const item: NavReportItem = {
      id: rep.id,
      label: rep.title.replace(/^Research:\s*/i, ''),
      icon: rep.icon || getReportIcon(rep.category),
      badge: knownBadges[rep.id] || getReportBadge(rep),
      category: rep.category
    };

    // 1. Always add to its thematic pillar & category group
    if (rep.category === 'genetics') {
      groups[1].items.push(item);
    } else if (rep.category === 'international-law') {
      groups[2].items.push(item);
    } else {
      groups[3].items.push(item);
    }

    // 2. If it is an Africalia Working Paper, also register it under the Working Papers group
    if (rep.isWorkingPaper) {
      groups[4].items.push({
        ...item,
        badge: rep.seriesNumber ? rep.seriesNumber.replace('Africalia ', '') : 'Working Paper',
        category: 'working-papers'
      });
    }
  }

  return groups;
}
