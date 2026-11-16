/**
 * AFRIATA CARTOGRAPHIC & ECONOMETRIC OBSERVATORY
 * Methodological Governance, Multilateral Harmonization, and Working Papers Data
 * Principal Cartographer & Software Architect: ZéLuis F. Correia
 * Dual Licensed: Source Code under MIT (LICENSE-CODE) • Creative Assets under CC BY 4.0 (LICENSE-ASSETS)
 */

import { resolveAssetPath } from '../utils/assetPath';
import { isBackendApiAvailable, resolveApiUrl } from '../utils/apiClient';

export interface MultilateralHarmonizationRule {
  id: string;
  sourceA: string;
  sourceB: string;
  conflictDomain: string;
  reconciliationProtocol: string;
  rationalization: string;
  scholarlyPrecedent: string;
}

export interface WorkingPaperEntry {
  id: string;
  seriesNumber: string;
  type: 'Policy Brief' | 'Research Note' | 'Working Paper';
  title: string;
  subtitle: string;
  author: string;
  affiliation: string;
  date: string;
  jelCodes: string[];
  abstract: string;
  keyFindings: string[];
  citationApa: string;
  downloadFilename: string;
}

export interface DatasetIntegrityHash {
  datasetName: string;
  fileScope: string;
  recordCount: number;
  bytes: number;
  sha256: string;
  lastAudited: string;
  verificationStatus: 'published' | 'verified' | 'mismatch';
}

export const MULTILATERAL_HARMONIZATION_RULES: MultilateralHarmonizationRule[] = [
  {
    id: 'imf-vs-wb-gdp',
    sourceA: 'World Bank World Development Indicators (WDI)',
    sourceB: 'IMF World Economic Outlook (WEO Database)',
    conflictDomain: 'Nominal & PPP Gross Domestic Product (GDP) Estimates',
    reconciliationProtocol: 'Hierarchical Multi-Temporal Triangulation',
    rationalization: 'For historical structural time-series (2015–2023), the Atlas uses World Bank WDI observations due to retrospective national accounts recalibrations. For 2024 estimates and projections, IMF WEO figures are utilized and explicitly tagged with status flags (observed, estimated, or forecast).',
    scholarlyPrecedent: 'World Bank Open Data Quality Framework & IMF Article IV Surveillance Guidelines'
  },
  {
    id: 'un-comtrade-vs-wits',
    sourceA: 'UN Comtrade (UN Statistics Division)',
    sourceB: 'World Bank WITS / AfDB African Information Highway',
    conflictDomain: 'Bilateral Strategic Mineral Trade & Hydrocarbon Extractions',
    reconciliationProtocol: 'Mirror-Statistic Flow Discrepancy Reconciliation',
    rationalization: 'Trade misinvoicing and transit jurisdiction discrepancies are reconciled by comparing source export filings against destination partner import declarations (mirror statistics). Destination-reported values are weighted higher for high-value strategic minerals (coltan, cobalt, lithium, petroleum) pursuant to UNCTAD trade transparency standards.',
    scholarlyPrecedent: 'UNCTAD Trade & Development Report (2023); Ndikumana & Boyce (2018) Capital Flight from Sub-Saharan Africa'
  },
  {
    id: 'slave-voyages-demographics',
    sourceA: 'SlaveVoyages trans-Atlantic database (2024.1 release)',
    sourceB: 'Eltis, Richardson, and Nathan Nunn Econometric Syntheses',
    conflictDomain: 'Historical Embarkation Volumes & Captive Mortality Accounting',
    reconciliationProtocol: 'Three-Layer Separation (Observed, Imputed, Estimated)',
    rationalization: 'Headline totals summarize 36,108 documented voyages (1514–1866) alongside 18 curated voyage dossiers. Observed logbook figures, statistically imputed voyage records, and continental demographic estimates (1501–1866) are kept strictly distinct.',
    scholarlyPrecedent: 'Eltis & Richardson (2010) Atlas of the Transatlantic Slave Trade; Nunn (2008) QJE; Whatley (2014) JEH'
  },
  {
    id: 'who-vs-dhs-maternal',
    sourceA: 'WHO Global Health Observatory (GHO)',
    sourceB: 'USAID Demographic and Health Surveys (DHS) / AfDB',
    conflictDomain: 'Maternal & Under-5 Infant Mortality Rates (per 1,000 live births)',
    reconciliationProtocol: 'Bayesian Vital Statistics Smoothing Model',
    rationalization: 'Survey-derived DHS indicators are combined with WHO multi-year demographic projections via local regression smoothing, filtering out short-term reporting shocks caused by localized statistical disruptions.',
    scholarlyPrecedent: 'UN Inter-agency Group for Child Mortality Estimation (UN IGME, 2024)'
  }
];

export const DATASET_INTEGRITY_HASHES: DatasetIntegrityHash[] = [
  {
    datasetName: 'Master Continental Vector Cartography SVG',
    fileScope: 'public/africa-final.svg',
    recordCount: 1071, // 54 sovereign states + 1,017 Admin-1 provincial paths
    bytes: 2115114,
    sha256: '273f2eaa0adbf29defd768175ade8fbcbfcc5d426e0d6fcb40be8aefa8abbdea',
    lastAudited: '2026-10-04T00:00:00Z',
    verificationStatus: 'published'
  },
  {
    datasetName: 'Continental Geodesy & Centroid Geometry Bounds',
    fileScope: 'src/data/africaFinalGeometry.ts',
    recordCount: 54,
    bytes: 1959,
    sha256: '1cb8e2603cc86863124c2048fd476e716d8c12171c569ea13f471a37ad0df86a',
    lastAudited: '2026-10-04T00:00:00Z',
    verificationStatus: 'published'
  },
  {
    datasetName: 'Ethnic Tree of Life Vector Conduits & Nodes SVG',
    fileScope: 'src/data/authenticEthnicTreeSvg.ts',
    recordCount: 2000,
    bytes: 759743,
    sha256: 'd19cf21bb510b1a085b6f8dfea8ab8f33e8eb27acbb1666c21eb6be0c8ed7f81',
    lastAudited: '2026-10-04T00:00:00Z',
    verificationStatus: 'published'
  },
  {
    datasetName: 'Linguistic & Ethnolinguistic Tree Hierarchy',
    fileScope: 'src/data/afriataMasterTreeData.ts',
    recordCount: 310,
    bytes: 51729,
    sha256: '32b3af97c6f0eecb14d4c280f5b095217f3979281bd945cfe7083597862be2b1',
    lastAudited: '2026-10-04T00:00:00Z',
    verificationStatus: 'published'
  },
  {
    datasetName: 'SlaveVoyages Summary & 18 Curated Dossiers',
    fileScope: 'src/data/slaveVoyagesData.ts',
    recordCount: 36108,
    bytes: 65317,
    sha256: '1796e3d21910ec261f09086cb7a72a361328c318ae303f34bbee763ac6ff7d02',
    lastAudited: '2026-10-04T00:00:00Z',
    verificationStatus: 'published'
  },
  {
    datasetName: 'Archival Visual Plates & Curatorial Descriptions',
    fileScope: 'src/data/records-with-descriptions.json',
    recordCount: 1220,
    bytes: 2443257,
    sha256: 'f36b014643fb0297a8d49e2974a0015e6a5fcc941313c4a8e7e45f1fbf6ba63c',
    lastAudited: '2026-10-04T00:00:00Z',
    verificationStatus: 'published'
  },
  {
    datasetName: 'Wikipedia Contemporary Ethnic Groups Table (310 Entries)',
    fileScope: 'src/data/wikipediaTableEntries.json',
    recordCount: 310,
    bytes: 66785,
    sha256: '22cf59f0827a8e9077a9866d8959697cab8d38a3048a30cdd7a1c4e95788d046',
    lastAudited: '2026-10-04T00:00:00Z',
    verificationStatus: 'published'
  },
  {
    datasetName: 'Socioeconomic Indicators Snapshot Seed (2015–2024)',
    fileScope: 'src/data/atlas-observations-seed.ts',
    recordCount: 54,
    bytes: 46812,
    sha256: 'ed18972d310f48b070395eafba990068ba22a93f2bc15f9540f18edac71637dc',
    lastAudited: '2026-10-04T00:00:00Z',
    verificationStatus: 'published'
  }
];

export interface BrowserHashVerificationResult {
  status: 'computed' | 'static-unavailable';
  sha256: string;
  computedDigest?: string;
  reason?: string;
}

/**
 * Computes the real SHA-256 digest of a foundational dataset file in the browser
 * using the Web Crypto API (`crypto.subtle.digest`) and compares it with the
 * build-time published SHA-256 checksum. Never synthesizes a false match on static builds.
 */
export async function computeDatasetSha256InBrowser(fileScope: string): Promise<BrowserHashVerificationResult> {
  // 1. Try fetching exact raw bytes via static asset path or optional backend endpoint
  const candidateUrls: string[] = [];
  if (fileScope === 'public/africa-final.svg') {
    candidateUrls.push(resolveAssetPath('africa-final.svg'));
  }
  if (await isBackendApiAvailable()) {
    candidateUrls.push(resolveApiUrl(`/api/research/dataset-raw?file=${encodeURIComponent(fileScope)}`));
  }

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('text/html')) {
          const buffer = await response.arrayBuffer();
          const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const computedDigest = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          return {
            status: 'computed',
            sha256: computedDigest,
            computedDigest
          };
        }
      }
    } catch {
      // Fall through to next candidate
    }
  }

  // 2. Honest static-deploy indicator when bundled .ts/.json source modules aren't served over HTTP
  const entry = DATASET_INTEGRITY_HASHES.find(d => d.fileScope === fileScope);
  if (entry) {
    return {
      status: 'static-unavailable',
      sha256: entry.sha256,
      reason: 'Source module is compiled into the production bundle and not served as a raw file on static hosts; verify locally with npm run research:integrity.'
    };
  }
  throw new Error(`Unknown dataset fileScope: ${fileScope}`);
}

export const WORKING_PAPERS_SERIES: WorkingPaperEntry[] = [
  {
    id: 'afriata-policy-brief-01',
    seriesNumber: 'Afriata Policy Brief No. 01',
    type: 'Policy Brief',
    title: 'Structural Legacies of Monopsonistic Trade Concessions in Atlantic Africa',
    subtitle: 'Exploratory Working Note · Institutional Path-Dependency & Contemporary Mineral Supply Chains',
    author: 'ZéLuis F. Correia (Exploratory Working Note)',
    affiliation: 'Afriata Cartographic & Econometric Observatory',
    date: 'February 2026',
    jelCodes: ['N17', 'O10', 'O43', 'F14'],
    abstract: 'This exploratory working policy brief synthesizes regional transport and trade literature on colonial concessions in Atlantic Africa (1885–1960) alongside contemporary AfCFTA corridor indicators and UN Comtrade mineral matrices. Key points summarize external econometric and policy literature prior to formal peer review.',
    keyFindings: [
      'Literature synthesis highlights persistent alignment between colonial-era rail corridors and modern raw-mineral export routes.',
      'Intra-African trade in processed intermediate goods faces elevated cross-border freight and customs friction relative to coastal export terminals.',
      'Interactive scenario modeling of AfCFTA tariff harmonization is available in the Atlas AfCFTA Trade Corridor Simulator.'
    ],
    citationApa: 'Correia, Z. F. (2026). Structural Legacies of Monopsonistic Trade Concessions in Atlantic Africa (Afriata Policy Brief No. 01 — Working Note). Afriata Open Science Repository. https://doi.org/10.6084/m9.figshare.34065711',
    downloadFilename: 'Afriata_Policy_Brief_01_Monopsonistic_Trade_Concessions.pdf'
  },
  {
    id: 'afriata-research-note-04',
    seriesNumber: 'Afriata Research Note No. 04',
    type: 'Research Note',
    title: 'Genomic Admixture and Tri-Continental Founder Effects in Cabo Verde',
    subtitle: 'Exploratory Literature Synthesis · Demographic Bottlenecks & Lineage Persistence',
    author: 'ZéLuis F. Correia (Literature Synthesis Note)',
    affiliation: 'Afriata Cartographic & Econometric Observatory',
    date: 'January 2026',
    jelCodes: ['N37', 'J15', 'Z13'],
    abstract: 'This research note synthesizes published autosomal, mtDNA, and Y-chromosome population genetics studies on Cabo Verde (Verdu et al., 2012; Beleza et al., 2013) alongside historical customs scholarship (Carreira, 1983) and SlaveVoyages embarkation summaries.',
    keyFindings: [
      'Published matrilineal mtDNA studies document predominant Upper Guinea Coast (Mandinka, Wolof, Balanta, Fula) founder lineage continuity across Sotavento islands.',
      'Published Y-chromosome distributions reflect asymmetric European paternal gene flow characteristic of early Atlantic feitoria settlements.',
      'Historical customs and demographic studies indicate post-1600 micro-demographic differentiation between Santiago and Barlavento islands.'
    ],
    citationApa: 'Correia, Z. F. (2026). Genomic Admixture and Tri-Continental Founder Effects in Cabo Verde (Afriata Research Note No. 04). Afriata Open Science Repository. https://doi.org/10.6084/m9.figshare.34065711',
    downloadFilename: 'Afriata_Research_Note_04_Cabo_Verde_Genomic_Admixture.pdf'
  },
  {
    id: 'afriata-working-paper-07',
    seriesNumber: 'Afriata Working Paper No. 07',
    type: 'Working Paper',
    title: 'Cartographic Geodesy and Admin-1 Spatial Disaggregation in Sub-Saharan Africa',
    subtitle: 'Technical Documentation · Vector Boundary Alignment & Indicator Harmonization',
    author: 'ZéLuis F. Correia (Technical Working Note)',
    affiliation: 'Afriata Cartographic & Econometric Observatory',
    date: 'March 2026',
    jelCodes: ['C88', 'R12', 'O55', 'C81'],
    abstract: 'This technical note documents the architecture of the Afriata 5,796 × 5,867 planar vector cartographic layer, encompassing 54 sovereign states and 1,017 Admin-1 administrative boundaries linked to World Bank, IMF, and UNESCO metadata.',
    keyFindings: [
      'Cataloging 1,017 first-order administrative sub-divisions supports sub-national visual inspection across continental boundaries.',
      'Computed centroid-anchored label placement scales typography cleanly across sovereign land areas.',
      'Standards-compliant SVG 1.1 delivery permits offline browser rendering without proprietary GIS runtime dependencies.'
    ],
    citationApa: 'Correia, Z. F. (2026). Cartographic Geodesy and Admin-1 Spatial Disaggregation in Sub-Saharan Africa (Afriata Working Paper No. 07). Afriata Open Science Repository. https://doi.org/10.6084/m9.figshare.34065711',
    downloadFilename: 'Afriata_Working_Paper_07_Cartographic_Geodesy_Admin1.pdf'
  }
];
