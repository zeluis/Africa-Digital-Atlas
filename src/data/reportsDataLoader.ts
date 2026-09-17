/**
 * Automated Drop-in Reports Loader
 * 
 * Uses Vite's `import.meta.glob` to automatically discover, parse, and register
 * all Markdown (.md) monographs dropped into `/src/content/reports/*.md`.
 * 
 * Pipeline flow:
 * 1. Discovers every .md file in `/src/content/reports/` at compile time.
 * 2. Ingests and normalizes metadata, sections, and semantic [REF] tags via `notebookIngestionPipeline`.
 * 3. Merges them with baseline statically compiled monographs in `reportsData.ts`.
 * 4. Provides dynamic grouping utilities for NavigationDrawer and ResearchReportsDirectoryView.
 */

import { ingestNotebookMarkdown } from './notebookIngestionPipeline';
import { ResearchReport, ReportCategory, RESEARCH_REPORTS as BASELINE_REPORTS } from './reportsData';
import { AfricaliaReport } from '../types/africaliaReport';
import { LucideIcon, BookOpen, Dna, Scale, TrendingUp, Cpu, FileText } from 'lucide-react';
import rawBantu from '../content/reports/bantu-expansion-genomics.md?raw';
import rawTransSaharan from '../content/reports/trans-saharan-jurisprudence.md?raw';

/**
 * Direct seed raw markdown imports to guarantee availability in all environments
 */
const SEED_MARKDOWN_FILES: Record<string, string> = {
  '../content/reports/bantu-expansion-genomics.md': rawBantu,
  '../content/reports/trans-saharan-jurisprudence.md': rawTransSaharan
};

/**
 * Vite eagerly loads any additional markdown files in /src/content/reports/ as raw strings
 */
const dynamicMarkdownFiles = import.meta.glob('../content/reports/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

const markdownFiles: Record<string, string> = {
  ...SEED_MARKDOWN_FILES,
  ...dynamicMarkdownFiles
};

/**
 * Ingests all discovered markdown monographs from /src/content/reports/
 */
export function loadDropInReports(): Record<string, ResearchReport> {
  const dropInCatalog: Record<string, ResearchReport> = {};

  for (const [path, rawContent] of Object.entries(markdownFiles)) {
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
 * Returns unified dictionary of all reports (typed as AfricaliaReport | ResearchReport)
 */
export function getAllAfricaliaReports(): Record<string, AfricaliaReport> {
  return getAllReports() as unknown as Record<string, AfricaliaReport>;
}

/**
 * Returns unified dictionary of all reports:
 * 1. Base hardcoded reports
 * 2. Drop-in markdown files from /src/content/reports/
 * 3. Any client-side dynamically imported NotebookLM reports (from localStorage)
 */
export function getAllReports(): Record<string, ResearchReport> {
  const dropInReports = loadDropInReports();
  
  // Merge baseline + drop-in
  const unified: Record<string, ResearchReport> = {
    ...BASELINE_REPORTS,
    ...dropInReports
  };

  // Merge client-side dynamically imported localStorage reports if in browser
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem('africalia_custom_reports');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(unified, parsed);
      }
    } catch {
      // Ignore parse errors on stored items
    }
  }

  return unified;
}

export interface NavReportItem {
  id: string;
  label: string;
  icon: LucideIcon | string;
  badge: string;
  category: ReportCategory | 'overview';
}

export interface NavReportGroup {
  title: string;
  categoryKey: ReportCategory | 'overview';
  items: NavReportItem[];
}

/**
 * Helper to determine an appropriate badge for a report item
 */
function getReportBadge(report: ResearchReport): string {
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
 * Dynamic categorized report subgroups for the navigation drawer
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
    'report-trans-saharan-jurisprudence': 'Timbuktu Charters'
  };

  for (const rep of reportsList) {
    const item: NavReportItem = {
      id: rep.id,
      label: rep.title.replace(/^Research:\s*/i, ''),
      icon: rep.icon || getReportIcon(rep.category),
      badge: knownBadges[rep.id] || getReportBadge(rep),
      category: rep.category
    };

    if (rep.category === 'genetics') {
      groups[1].items.push(item);
    } else if (rep.category === 'international-law') {
      groups[2].items.push(item);
    } else {
      groups[3].items.push(item);
    }
  }

  return groups;
}
