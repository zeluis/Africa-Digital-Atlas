/**
 * Centralized External Links & DOI Resolver Registry
 * 
 * Single Source of Truth for all outbound URLs across Africalia Atlas.
 * Provides:
 * 1. Normalized DOI resolution through the official International DOI Foundation resolver (https://doi.org/).
 * 2. Institutional portal catalogs (World Bank, IMF, UNESCO, WHO, AfDB, etc.).
 * 3. Fallback Wayback Machine archival resolution to protect against link-rot.
 * 4. Safe external link props (rel="noopener noreferrer", target="_blank").
 */

export interface ExternalLinkEntry {
  id: string;
  name: string;
  url: string;
  category: 'multilateral' | 'academic-journal' | 'un-agency' | 'regional-bloc' | 'archive';
  organization: string;
  archiveUrl?: string;
  description?: string;
}

/**
 * Normalizes any DOI string (raw identifier, with or without prefix) into a canonical https://doi.org/ resolver URL.
 * Handles forms like:
 * - "10.1016/j.ajhg.2020.06.012"
 * - "doi:10.1016/j.ajhg.2020.06.012"
 * - "https://doi.org/10.1016/j.ajhg.2020.06.012"
 * - "http://dx.doi.org/10.1016/j.ajhg.2020.06.012"
 */
export function resolveDoi(doiOrUrl: string): string {
  if (!doiOrUrl) return '';
  const trimmed = doiOrUrl.trim();

  // Strip common legacy prefixes
  const cleanDoi = trimmed
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '');

  // If it's a valid DOI format (starts with 10.XXXX/)
  if (/^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/i.test(cleanDoi)) {
    return `https://doi.org/${cleanDoi}`;
  }

  // If already a valid HTTPS URL (non-DOI reference link), return directly
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Fallback if prefixed with doi pattern
  return `https://doi.org/${cleanDoi}`;
}

/**
 * Generates an Internet Archive Wayback Machine snapshot fallback URL
 * for high-priority documents vulnerable to future web drift.
 */
export function getWaybackArchiveUrl(targetUrl: string): string {
  if (!targetUrl) return '';
  const clean = targetUrl.trim();
  return `https://web.archive.org/web/*/${clean}`;
}

/**
 * Standard safe props for all external anchor tags across Africalia Atlas
 */
export const SAFE_EXTERNAL_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer'
} as const;

/**
 * Canonical Institutional Portals Registry
 */
export const INSTITUTIONAL_EXTERNAL_REGISTRY: Record<string, ExternalLinkEntry> = {
  'world-bank': {
    id: 'world-bank',
    name: 'World Development Indicators (WDI)',
    organization: 'World Bank Group',
    url: 'https://databank.worldbank.org/source/world-development-indicators',
    archiveUrl: 'https://web.archive.org/web/https://databank.worldbank.org/source/world-development-indicators',
    category: 'multilateral',
    description: 'Tier 1 authoritative multilateral dataset covering all 54 African sovereign economies.'
  },
  'imf-weo': {
    id: 'imf-weo',
    name: 'World Economic Outlook (WEO)',
    organization: 'International Monetary Fund',
    url: 'https://www.imf.org/en/Publications/WEO',
    archiveUrl: 'https://web.archive.org/web/https://www.imf.org/en/Publications/WEO',
    category: 'multilateral',
    description: 'Fiscal balances, inflation series, GDP growth rates, and external debt statistics.'
  },
  'undp-hdr': {
    id: 'undp-hdr',
    name: 'Human Development Reports Data Center',
    organization: 'United Nations Development Programme (UNDP)',
    url: 'https://hdr.undp.org/data-center',
    category: 'un-agency',
    description: 'Composite Human Development Index (HDI), Inequality-adjusted HDI, and Gender Development indices.'
  },
  'unesco-whc': {
    id: 'unesco-whc',
    name: 'World Heritage Convention (WHC)',
    organization: 'UNESCO',
    url: 'https://whc.unesco.org/en/list/',
    category: 'un-agency',
    description: 'Authoritative registry of Cultural, Natural, and Mixed World Heritage Sites across Africa.'
  },
  'who-gho': {
    id: 'who-gho',
    name: 'Global Health Observatory (GHO)',
    organization: 'World Health Organization',
    url: 'https://www.who.int/data/gho',
    category: 'un-agency',
    description: 'Maternal mortality ratios, universal health coverage index, and epidemiological surveillance.'
  },
  'afdb-data': {
    id: 'afdb-data',
    name: 'African Development Bank Open Data Portal',
    organization: 'African Development Bank (AfDB)',
    url: 'https://dataportal.opendataforafrica.org/',
    category: 'regional-bloc',
    description: 'Infrastructure development indices, intra-African trade flow matrices, and regional integration data.'
  },
  'mo-ibrahim-iiag': {
    id: 'mo-ibrahim-iiag',
    name: 'Ibrahim Index of African Governance (IIAG)',
    organization: 'Mo Ibrahim Foundation',
    url: 'https://mo.ibrahim.foundation/iiag',
    category: 'multilateral',
    description: 'Rule of Law, Security, Participation, Rights, Inclusion, and Foundations for Economic Opportunity.'
  },
  'transparency-cpi': {
    id: 'transparency-cpi',
    name: 'Corruption Perceptions Index (CPI)',
    organization: 'Transparency International',
    url: 'https://www.transparency.org/en/cpi',
    category: 'multilateral',
    description: 'Perceived public sector corruption metrics and governance integrity indicators.'
  },
  'african-union': {
    id: 'african-union',
    name: 'African Union Commission',
    organization: 'African Union (AU)',
    url: 'https://au.int/',
    category: 'regional-bloc',
    description: 'Agenda 2063 strategic framework, treaties, and continental governance instruments.'
  },
  'afcfta-secretariat': {
    id: 'afcfta-secretariat',
    name: 'AfCFTA Secretariat',
    organization: 'African Continental Free Trade Area',
    url: 'https://au-afcfta.org/',
    category: 'regional-bloc',
    description: 'Single continental market for goods and services across 54 signatories.'
  },
  'slave-voyages': {
    id: 'slave-voyages',
    name: 'Slave Voyages Transatlantic Database',
    organization: 'Emory University / Hutchins Center / Rice University',
    url: 'https://www.slavevoyages.org/',
    archiveUrl: 'https://web.archive.org/web/https://www.slavevoyages.org/',
    category: 'archive',
    description: 'Historical records of over 36,000 transatlantic and intra-American slave voyages between 1514 and 1866.'
  }
};
