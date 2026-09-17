/**
 * Canonical Africalia Universal Research Publication Schema
 * 
 * Defines the formal, machine-readable publication record (`AfricaliaReport`)
 * consumed by the React application, search indexes, country profiles, and regional cartography.
 * 
 * Schema Version: 1.0.0
 */

import { ReportSection, ReportCitation, ReportCategory } from '../data/reportsData';

export type AfricaliaPublicationStatus = 'draft' | 'review' | 'published' | 'archived';

export type AfricaliaPublicationType = 
  | 'research_article'
  | 'research_report'
  | 'research_study'
  | 'research_monograph'
  | 'research_dossier'
  | 'scholarly_essay'
  | 'working_paper';

export type AfricaliaCitationStyle = 
  | 'chicago-author-date'
  | 'chicago-notes'
  | 'apa'
  | 'mla'
  | 'harvard'
  | 'custom';

export type AfricaliaAuthorRole = 
  | 'author'
  | 'editor'
  | 'researcher'
  | 'contributor'
  | 'translator';

export type AfricaliaSection = 
  | 'reports'
  | 'history'
  | 'regions'
  | 'analytics'
  | 'research'
  | 'datasets'
  | 'archives'
  | 'methodology';

export type AfricaliaPillar = 
  | 'genetics'
  | 'law'
  | 'macroeconomics'
  | 'history'
  | 'heritage'
  | 'climate'
  | 'demography'
  | 'migration'
  | 'culture'
  | 'geography';

export type IngestionMode = 'automatic' | 'manual' | 'hybrid';

export interface AfricaliaInstitution {
  name: string;
  type: string;
  role: string;
  platform: string;
}

export interface AfricaliaPublication {
  series: string;
  type: AfricaliaPublicationType;
  edition: string;
  language: string;
  citation_style?: AfricaliaCitationStyle;
  peer_review_status?: string;
  data_availability_url?: string | null;
}

export interface AfricaliaAuthor {
  name: string;
  role: AfricaliaAuthorRole;
  institution?: string | null;
  orcid?: string | null;
}

export interface AfricaliaClassification {
  section: AfricaliaSection;
  pillar: AfricaliaPillar;
  disciplines: string[];
  confidence?: {
    section?: number;
    pillar?: number;
  };
}

export interface AfricaliaGeography {
  regions: string[];
  countries: string[]; // ISO 3166-1 alpha-3 codes
  cities?: string[];
  historical_regions?: string[];
}

export interface AfricaliaIdentifiers {
  doi: string | null;
  isbn?: string | null;
  issn?: string | null;
  external_url?: string | null;
  source_url?: string | null;
}

export interface AfricaliaResearchCharacteristics {
  methodology?: string[];
  disciplines?: string[];
  temporal_scope?: string | null;
  geographic_scope?: string | null;
}

export interface AfricaliaReadingMetadata {
  read_time_minutes: number;
  word_count: number;
  section_count: number;
}

export interface AfricaliaDisplay {
  featured: boolean;
  cover_image?: string | null;
  accent?: string | null;
  layout?: 'article' | 'monograph' | 'dossier' | 'study';
}

export interface AfricaliaAiAssistance {
  enabled: boolean;
  system?: string | null;
  role: string[];
  disclosure: string;
  accountability: string;
}

export interface AfricaliaProvenance {
  source_file: string;
  source_hash: string;
  ingestion: IngestionMode;
  metadata: IngestionMode;
  classification: IngestionMode;
  processed_at: string;
  pipeline_version: string;
}

export interface AfricaliaConfidence {
  title: number;
  classification: number;
  disciplines: number;
  keywords: number;
  geography: number;
  publication_type: number;
}

export interface AfricaliaValidation {
  valid: boolean;
  warnings: string[];
  errors: string[];
  reviewed: boolean;
}

/**
 * Universal Canonical Africalia Report publication record
 */
export interface AfricaliaReport {
  schema: {
    name: 'AfricaliaReport';
    version: '1.0.0';
  };
  id: string;
  title: string;
  subtitle: string | null;
  date: string;
  updated?: string | null;
  version: string;
  status: AfricaliaPublicationStatus;
  institution: AfricaliaInstitution;
  publication: AfricaliaPublication;
  authors: string[];
  author_details?: AfricaliaAuthor[];
  classification: AfricaliaClassification;
  keywords: string[];
  subjects: string[];
  tags: string[];
  geography: AfricaliaGeography;
  identifiers: AfricaliaIdentifiers;
  research: AfricaliaResearchCharacteristics;
  reading: AfricaliaReadingMetadata;
  display: AfricaliaDisplay;
  ai_assistance: AfricaliaAiAssistance;
  provenance: AfricaliaProvenance;
  confidence: AfricaliaConfidence;
  validation: AfricaliaValidation;

  // React & backwards-compatibility runtime properties
  executiveSummary: string;
  sections: ReportSection[];
  citations: ReportCitation[];
  category: ReportCategory;
  categoryLabel: string;
  categoryColor: string;
  publicationDate: string;
  readingTimeMinutes: number;
  doi: string;
  institutions: string[];
  relatedEthnicNodes?: string[];
  icon?: string;
}

/**
 * Controlled Vocabularies
 */
export const CONTROLLED_UN_REGIONS = [
  'Northern Africa',
  'Western Africa',
  'Middle Africa',
  'Eastern Africa',
  'Southern Africa',
  'Americas',
  'Caribbean',
  'Europe',
  'Indian Ocean',
  'Atlantic Ocean',
  'Global'
] as const;

export const CONTROLLED_TAST_HISTORICAL_REGIONS = [
  'Senegambia and off-shore Atlantic',
  'Sierra Leone',
  'Windward Coast',
  'Gold Coast',
  'Bight of Benin',
  'Bight of Biafra',
  'West Central and St. Helena',
  'South-east Africa and Indian ocean islands and St. Helena'
] as const;

export const CONTROLLED_PILLARS: Record<AfricaliaPillar, { label: string; color: string; canonicalCategory: ReportCategory }> = {
  genetics: {
    label: 'Genetics & Admixture',
    color: '#6366F1',
    canonicalCategory: 'genetics'
  },
  law: {
    label: 'International Law & Sovereignty',
    color: '#F59E0B',
    canonicalCategory: 'international-law'
  },
  macroeconomics: {
    label: 'Macroeconomics & Trade',
    color: '#06B6D4',
    canonicalCategory: 'development-sociology'
  },
  history: {
    label: 'Historical Sociology & Archives',
    color: '#8B5CF6',
    canonicalCategory: 'development-sociology'
  },
  heritage: {
    label: 'Bioarchaeology & Cultural Heritage',
    color: '#EC4899',
    canonicalCategory: 'genetics'
  },
  climate: {
    label: 'Climate & Environmental Geography',
    color: '#10B981',
    canonicalCategory: 'development-sociology'
  },
  demography: {
    label: 'Historical Demography & Voyages',
    color: '#F97316',
    canonicalCategory: 'development-sociology'
  },
  migration: {
    label: 'Migration & Diaspora Studies',
    color: '#3B82F6',
    canonicalCategory: 'development-sociology'
  },
  culture: {
    label: 'Linguistics & Intangible Culture',
    color: '#A855F7',
    canonicalCategory: 'genetics'
  },
  geography: {
    label: 'Continental Cartography & Space',
    color: '#14B8A6',
    canonicalCategory: 'development-sociology'
  }
};
