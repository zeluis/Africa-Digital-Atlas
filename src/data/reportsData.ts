import type { AfriataClassification } from '../types/afriataReport';
import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  keyTakeaway?: string;
  pullQuote?: string;
}

export interface ReportCitation {
  id: string;
  authors: string;
  year: number;
  title: string;
  journalOrPublisher: string;
  doiOrUrl: string;
}

export type ReportCategory = 'genetics' | 'international-law' | 'development-sociology';

export interface ResearchReport {
  id: string;
  title: string;
  subtitle: string | null;
  category: ReportCategory;
  categoryLabel: string;
  categoryColor: string; // e.g. '#6366F1' for genetics, '#F59E0B' for law, '#10B981' for development
  authors: string[];
  institutions: string[];
  publicationDate: string;
  readingTimeMinutes: number;
  doi: string;
  classification: string | AfriataClassification;
  executiveSummary: string;
  sections: ReportSection[];
  citations: ReportCitation[];
  relatedEthnicNodes?: string[];
  icon?: string;
  isWorkingPaper?: boolean;
  seriesNumber?: string;
  jelCodes?: string[];
}

export const RESEARCH_REPORTS: Record<string, ResearchReport> = {
  'report-genetic-linguistic-blueprints': {
    id: 'report-genetic-linguistic-blueprints',
    title: 'Genetic and Linguistic Blueprints of the African Atlantic Creole',
    subtitle: 'Reconstructing Upper Guinea Admixture, Substrate Syntax, and Demographic Reconstitution',
    category: 'genetics',
    categoryLabel: 'Genetics & Admixture',
    categoryColor: '#6366F1',
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'October 2025',
    readingTimeMinutes: 24,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Genomic Anthropology & Historical Linguistics',
    executiveSummary: 'This literature synthesis integrates published whole-genome sequencing findings with comparative philological studies of Afro-Atlantic Creoles (Verdu et al., 2012; Beleza et al., 2013; Quint, 2000). Published evidence indicates that the genetic architecture of Cabo Verde and Gulf of Guinea creole populations preserves molecular signatures of 15th-to-17th century Upper Guinea ethnolinguistic groups (Mandinka, Wolof, Papel, Balanta, and Temne) alongside Romance-lexifier contact grammars.',
    sections: [],
    citations: [],
    relatedEthnicNodes: ['cape-verde-creole', 'wolof', 'mandinka']
  },

  'report-genetic-social-structure-cape-verde': {
    id: 'report-genetic-social-structure-cape-verde',
    title: 'Genetic and Social Structure of Cape Verde',
    subtitle: 'Genealogies, Social Stratification, and Sex-Biased Gene Flow Across the Archipelago',
    category: 'genetics',
    categoryLabel: 'Genetics & Admixture',
    categoryColor: '#6366F1',
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'July 2024',
    readingTimeMinutes: 21,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Population Genomics & Social Demography',
    executiveSummary: 'A curated synthesis of published island-by-island genomic studies across Santiago, Fogo, Santo Antão, São Vicente, and Brava (Beleza et al., 2013; Carreira, 1983). Reviewed findings illustrate how differential 17th-to-19th century plantation economies, drought-driven migrations, and seigneurial land hierarchies shaped divergent genetic admixture profiles across the archipelago.',
    sections: [],
    citations: [],
    relatedEthnicNodes: ['cape-verde-creole']
  },

  'report-creole-admixture-cabo-verde': {
    id: 'report-creole-admixture-cabo-verde',
    title: 'The Trans-Atlantic Slave Trade and Creole Admixture: Cabo Verde & São Tomé',
    subtitle: 'Comparative Bio-History of Two Maritime Slave Trade Crucible Archipelagos',
    category: 'genetics',
    categoryLabel: 'Genetics & Admixture',
    categoryColor: '#6366F1',
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'January 2025',
    readingTimeMinutes: 28,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Comparative Archaeogenomics & Maritime History',
    executiveSummary: 'This comparative synthesis examines published genomic and archival literature on Cabo Verde (Upper Guinea nexus) and São Tomé and Príncipe (Gulf of Guinea / Lower Congo nexus), drawing on Micheletti et al. (2020) and Eltis & Richardson (2010). It contrasts how distinct African embarkation catchment areas shaped different epidemiological selection pressures and Creole cultural formations.',
    sections: [],
    citations: [],
    relatedEthnicNodes: ['cape-verde-creole', 'bakongo', 'mbundu']
  },

  'report-latest-developments-genetic-legacy': {
    id: 'report-latest-developments-genetic-legacy',
    title: 'Latest Developments: Genetic Legacy of Transatlantic Slave Trade',
    subtitle: 'Ancient DNA from Burial Contexts, Mitochondrial Clocks, and Diaspora Haplotypes',
    category: 'genetics',
    categoryLabel: 'Genetics & Admixture',
    categoryColor: '#6366F1',
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'February 2026',
    readingTimeMinutes: 26,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Ancient Biomolecules & Diaspora Genomics',
    executiveSummary: 'A synthesis of published ancient DNA studies (including Schroeder et al., 2015 on 17th-century enslaved individuals in Saint Martin) alongside biobank-scale diaspora analyses (Micheletti et al., 2020) and maritime wreck archaeology (such as the São José-Paquete de Africa and Clotilda). The literature compares genomic origin profiles against embarkation ledgers across West-Central Africa, Biafra, and Senegambia.',
    sections: [],
    citations: [],
    relatedEthnicNodes: ['bakongo', 'igbo', 'yoruba', 'makua']
  },

  'report-slavery-international-law-reparatory': {
    id: 'report-slavery-international-law-reparatory',
    title: 'Scholarly Analysis: Slavery, International Law, and Reparatory Justice',
    subtitle: 'State Responsibility, Inter-Temporal Law, and the Doctrine of Continuing Wrong',
    category: 'international-law',
    categoryLabel: 'International Law & Reparations',
    categoryColor: '#F59E0B',
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'August 2025',
    readingTimeMinutes: 32,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Public International Law & Reparatory Jurisprudence',
    executiveSummary: 'This legal literature synthesis examines arguments addressing the inter-temporal law defense in reparatory justice scholarship (Beckles, 2013; Robinson, 2023 Brattle Report). It outlines scholarly claims regarding natural law norms, the ILC Articles on State Responsibility (Article 14(2) on continuing wrongful acts), and the CARICOM 10-Point Plan for Reparatory Justice.',
    sections: [],
    citations: [],
    relatedEthnicNodes: ['fon', 'akan-ashanti', 'yoruba']
  },

  'report-sovereign-responsibility-reparations': {
    id: 'report-sovereign-responsibility-reparations',
    title: 'Sovereign Responsibility and the Jurisprudence of Global Reparations',
    subtitle: 'Institutional Complicity, Central Bank Balance Sheets, and Metropole Asset Tracing',
    category: 'international-law',
    categoryLabel: 'International Law & Reparations',
    categoryColor: '#F59E0B',
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'November 2025',
    readingTimeMinutes: 29,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · International Economic Law & Sovereign Liability',
    executiveSummary: 'A synthesis of historical economic research (Draper, 2010; Legacies of British Slavery archive) tracing capital flows from Atlantic slavery into European financial institutions and sovereign debt instruments. It examines the £20 million compensation fund authorized under the British Slavery Abolition Act of 1833 and its long-dated government bond repayment.',
    sections: [],
    citations: [],
    relatedEthnicNodes: ['akan-ashanti', 'igbo']
  },

  'report-reparations-debt-anthropocene': {
    id: 'report-reparations-debt-anthropocene',
    title: 'Reparations, Debt & Anthropocene Report',
    subtitle: 'Colonial Ecological Extraction, Climate Vulnerability, and the Financial Architecture',
    category: 'international-law',
    categoryLabel: 'International Law & Reparations',
    categoryColor: '#F59E0B',
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'December 2025',
    readingTimeMinutes: 35,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Ecological Economics & Global Climate Justice',
    executiveSummary: 'A literature synthesis linking historical reparations theory with climate vulnerability and sovereign debt reform debates (Táíwò, 2022). It summarizes scholarship connecting plantation-era land-use change and unequal capital accumulation to contemporary climate adaptation financing gaps across Africa and the Caribbean.',
    sections: [],
    citations: [],
    relatedEthnicNodes: ['dinka', 'oromo', 'duala']
  },

  'report-ancestry-ideology-underdevelopment': {
    id: 'report-ancestry-ideology-underdevelopment',
    title: 'Ancestry, Ideology, and Underdevelopment',
    subtitle: 'The Genetic, Sociological, and Material Legacies of the Transatlantic Slave Trade',
    category: 'development-sociology',
    categoryLabel: 'Development & Sociology',
    categoryColor: '#10B981',
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'September 2025',
    readingTimeMinutes: 38,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Cliometrics & Historical Political Economy',
    executiveSummary: 'A curated synthesis of empirical cliometric literature—centrally Nunn (2008) and Nunn & Wantchekon (2011)—combining slave voyage records, ethnographic baselines, and Afrobarometer survey data. Reviewed econometric studies find that regions experiencing higher per-capita slave exports exhibit persistently lower measured interpersonal trust and weaker economic performance today.',
    sections: [],
    citations: [],
    relatedEthnicNodes: ['igbo', 'yoruba', 'edo-bini', 'akan-ashanti', 'bamileke']
  },

  'report-rao-model-socioeconomic': {
    id: 'report-rao-model-socioeconomic',
    title: 'Research: RAO Model and African Socioeconomic Legacies',
    subtitle: 'Resource Allocation Optimization and Structural Transformation in Post-Colonial States',
    category: 'development-sociology',
    categoryLabel: 'Development & Sociology',
    categoryColor: '#10B981',
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'May 2025',
    readingTimeMinutes: 30,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Development Macroeconomics & Industrial Policy',
    executiveSummary: 'A synthesis of structural transformation literature (Monga & Yifu Lin, 2019; UNECA/AfDB industrial reports) paired with conceptual resource allocation optimization (RAO) framing. It reviews why post-colonial African economies remain concentrated in primary commodity exports and outlines regional value-addition strategies under AfCFTA.',
    sections: [],
    citations: [],
    relatedEthnicNodes: ['tiv', 'duala']
  },

  'report-sociological-origins-racism': {
    id: 'report-sociological-origins-racism',
    title: 'Sociological Origins of Racism and African Underdevelopment',
    subtitle: 'From Religious Justification to Racialized Capitalism and Global Stratification',
    category: 'development-sociology',
    categoryLabel: 'Development & Sociology',
    categoryColor: '#10B981',
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'January 2026',
    readingTimeMinutes: 34,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Historical Sociology & Political Economy',
    executiveSummary: 'A historical-sociological synthesis engaging foundational works by Eric Williams (1944) and Walter Rodney (1972). It traces how early modern legal, theological, and pseudo-scientific racial hierarchies evolved alongside Atlantic plantation labor systems to justify unequal global division of labor.',
    sections: [],
    citations: [],
    relatedEthnicNodes: ['hausa', 'yoruba', 'bakongo']
  }
};

const reportsBodiesUrl = new URL('./reportsDataBodies.json', import.meta.url).href;

const reportsBodiesStore = createLazyAssetStore<Record<string, ResearchReport>>(
  [reportsBodiesUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      for (const [id, body] of Object.entries(payload as Record<string, { sections?: ReportSection[]; citations?: ReportCitation[] }>)) {
        if (RESEARCH_REPORTS[id] && body) {
          RESEARCH_REPORTS[id] = {
            ...RESEARCH_REPORTS[id],
            sections: body.sections || RESEARCH_REPORTS[id].sections,
            citations: body.citations || RESEARCH_REPORTS[id].citations
          };
        }
      }
    }
    return RESEARCH_REPORTS;
  },
  () => RESEARCH_REPORTS
);

export const ensureReportsBodiesLoaded = reportsBodiesStore.ensureLoaded;
export const isReportsBodiesLoaded = reportsBodiesStore.isLoaded;
export const subscribeReportsBodies = reportsBodiesStore.subscribe;
export const useReportsBodiesLoaded = reportsBodiesStore.useLoaded;
