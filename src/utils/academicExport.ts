/**
 * Academic Citation & High-DPI PDF Export Utility
 * Generates standardized bibliographic files (.bib, .ris, .json) immediately and
 * dynamically loads heavy PDF/canvas/ZIP builders on demand.
 */

import type { SlaveTradeIllustration } from '../data/slaveTradeIllustrations';
import type { HistoricalMapPlate } from '../data/archivalCartographyData';
import { downloadFile } from './exportUtils';
import { escapeBibtexValue, sanitizeRisValue } from './citationFormatter';
import type { LoadedImageData, PublicationPdfInput } from './academicPdfExport';

export type { LoadedImageData, PublicationPdfInput };

/**
 * Downloads a string as a formatted academic reference file
 */
export const downloadAcademicFile = (content: string, filename: string, mimeType: string) => {
  downloadFile(filename, content, mimeType);
};

/**
 * Generates and downloads a .bib (BibTeX) file
 */
export const exportBibTeXFile = (illustration: SlaveTradeIllustration) => {
  const year = illustration.date ? illustration.date.replace(/[^0-9]/g, '').slice(0, 4) || 'n.d.' : 'n.d.';
  const authors = illustration.researchers && illustration.researchers.length > 0
    ? illustration.researchers.map(escapeBibtexValue).join(' and ')
    : 'Handler, Jerome and Tuite, Michael';
  const cleanId = `plate_${illustration.objectId || illustration.regId.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const url = illustration.slaveryImagesPage || `http://www.slaveryimages.org/s/slaveryimages/item/${illustration.objectId}`;

  const bibtex = `@misc{${cleanId},
  author = {${authors}},
  title = {{${escapeBibtexValue(illustration.title)}}},
  year = {${escapeBibtexValue(year)}},
  howpublished = {Slavery Images: A Visual Record of the African Slave Trade},
  note = {Plate ID: ${escapeBibtexValue(illustration.regId)}, Source: ${escapeBibtexValue(illustration.source)}},
  url = {${escapeBibtexValue(url)}}
}`;

  downloadAcademicFile(bibtex, `${cleanId}.bib`, 'application/x-bibtex');
};

/**
 * Generates and downloads a .ris (EndNote / Zotero / Mendeley) file
 */
export const exportRISFile = (illustration: SlaveTradeIllustration) => {
  const year = illustration.date ? illustration.date.replace(/[^0-9]/g, '').slice(0, 4) || '' : '';
  const authors = illustration.researchers && illustration.researchers.length > 0
    ? illustration.researchers.map(a => `AU  - ${sanitizeRisValue(a)}`).join('\n')
    : 'AU  - Handler, Jerome\nAU  - Tuite, Michael';
  const url = illustration.slaveryImagesPage || `http://www.slaveryimages.org/s/slaveryimages/item/${illustration.objectId}`;

  const ris = `TY  - ART
TI  - ${sanitizeRisValue(illustration.title)}
${authors}
PY  - ${sanitizeRisValue(year)}
PB  - ${sanitizeRisValue(illustration.source)}
M3  - Plate ${sanitizeRisValue(illustration.regId)}
UR  - ${sanitizeRisValue(url)}
N2  - ${sanitizeRisValue(illustration.description || '')}
ER  - `;

  downloadAcademicFile(ris, `plate_${illustration.regId.replace(/[^a-zA-Z0-9]/g, '_')}.ris`, 'application/x-research-info-systems');
};

/**
 * Generates and downloads a CSL-JSON (Citation Style Language) file
 */
export const exportCSLJSONFile = (illustration: SlaveTradeIllustration) => {
  const year = illustration.date ? parseInt(illustration.date.replace(/[^0-9]/g, '').slice(0, 4), 10) || null : null;
  const authors = (illustration.researchers || ['Handler, Jerome', 'Tuite, Michael']).map(name => {
    const parts = name.split(',').map(p => p.trim());
    return { family: parts[0] || name, given: parts[1] || '' };
  });

  const csl = [{
    id: `plate-${illustration.objectId || illustration.regId}`,
    type: 'graphic',
    title: illustration.title,
    author: authors,
    issued: year ? { 'date-parts': [[year]] } : undefined,
    publisher: illustration.source,
    call_number: illustration.regId,
    URL: illustration.slaveryImagesPage || `http://www.slaveryimages.org/s/slaveryimages/item/${illustration.objectId}`,
    abstract: illustration.description
  }];

  downloadAcademicFile(JSON.stringify(csl, null, 2), `plate_${illustration.regId.replace(/[^a-zA-Z0-9]/g, '_')}.json`, 'application/json');
};

/**
 * Generates and downloads a .bib (BibTeX) file for an antique map plate
 */
export const exportHistoricalMapPlateBibTeX = (plate: HistoricalMapPlate) => {
  const year = plate.year.replace(/[^0-9]/g, '').slice(0, 4) || 'n.d.';
  const author = plate.cartographer.trim() || 'Anonymous Cartographer';
  const cleanId = `map_${plate.id.replace(/[^a-zA-Z0-9]/g, '_')}_${year}`;
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#archival-cartography?plate=${plate.id}`
    : `https://zeluis.github.io/Africa-Digital-Atlas/#archival-cartography?plate=${plate.id}`;

  const toponyms = plate.toponymsToObserve && plate.toponymsToObserve.length > 0
    ? plate.toponymsToObserve.slice(0, 5).join(', ')
    : 'African littoral and continental interior';

  const bibtex = `@misc{${cleanId},
  author = {${escapeBibtexValue(author)}},
  title = {{${escapeBibtexValue(plate.title)}}},
  year = {${escapeBibtexValue(year)}},
  howpublished = {Afriata: Africa Data Atlas \\& Cartographic Observatory},
  organization = {${escapeBibtexValue(plate.institution)}},
  note = {Source: ${escapeBibtexValue(plate.source)}. Historical Region: ${escapeBibtexValue(plate.region)}. Documented toponyms: ${escapeBibtexValue(toponyms)}},
  url = {${escapeBibtexValue(url)}}
}`;

  downloadAcademicFile(bibtex, `${cleanId}.bib`, 'application/x-bibtex');
};

/**
 * Generates and downloads a .ris (EndNote / Zotero / Mendeley) file for an antique map plate
 */
export const exportHistoricalMapPlateRIS = (plate: HistoricalMapPlate) => {
  const year = plate.year.replace(/[^0-9]/g, '').slice(0, 4) || '';
  const author = plate.cartographer.trim() || 'Anonymous Cartographer';
  const cleanId = `plate_${plate.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#archival-cartography?plate=${plate.id}`
    : `https://zeluis.github.io/Africa-Digital-Atlas/#archival-cartography?plate=${plate.id}`;

  const ris = `TY  - MAP
TI  - ${sanitizeRisValue(plate.title)}
AU  - ${sanitizeRisValue(author)}
PY  - ${sanitizeRisValue(year)}
PB  - ${sanitizeRisValue(plate.institution)}
M3  - Archival Cartographic Plate ${sanitizeRisValue(plate.id)}
UR  - ${sanitizeRisValue(url)}
N1  - Source: ${sanitizeRisValue(plate.source)}
N2  - ${sanitizeRisValue(plate.description)} Historical significance: ${sanitizeRisValue(plate.historicalSignificance)}
KW  - Cartography
KW  - Africa
KW  - Historical Geography
KW  - ${sanitizeRisValue(plate.region)}
ER  - `;

  downloadAcademicFile(ris, `${cleanId}.ris`, 'application/x-research-info-systems');
};

/**
 * Generates and downloads a .bib (BibTeX) file for a sovereign country dossier
 */
export const exportCountryDossierBibTeX = (country: { id: string; name: string; unRegion?: string; iso2?: string }) => {
  const currentYear = new Date().getFullYear();
  const cleanId = `afriata_dossier_${country.id.toLowerCase()}_${currentYear}`;
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#countries/${country.id}`
    : `https://zeluis.github.io/Africa-Digital-Atlas/#countries/${country.id}`;

  const bibtex = `@dataset{${cleanId},
  author = {{Afriata Sovereign Data Consortium}},
  title = {{${escapeBibtexValue(country.name)} (${escapeBibtexValue(country.id)}): Sovereign Macroeconomic and Development Dossier}},
  year = {${currentYear}},
  publisher = {Afriata: Africa Data Atlas \\& Cartographic Observatory},
  note = {Multilateral Harmonization: World Bank, IMF, African Development Bank, and UNESCO archives. DOI: 10.6084/m9.figshare.34065711},
  url = {${escapeBibtexValue(url)}}
}`;

  downloadAcademicFile(bibtex, `${cleanId}.bib`, 'application/x-bibtex');
};

/**
 * Generates and downloads a .ris (EndNote / Zotero / Mendeley) file for a sovereign country dossier
 */
export const exportCountryDossierRIS = (country: { id: string; name: string; unRegion?: string; iso2?: string }) => {
  const currentYear = new Date().getFullYear();
  const cleanId = `dossier_${country.id.toLowerCase()}`;
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#countries/${country.id}`
    : `https://zeluis.github.io/Africa-Digital-Atlas/#countries/${country.id}`;

  const ris = `TY  - DATA
TI  - ${sanitizeRisValue(country.name)} (${sanitizeRisValue(country.id)}): Sovereign Macroeconomic and Development Dossier
AU  - Afriata Sovereign Data Consortium
PY  - ${currentYear}
PB  - Afriata: Africa Data Atlas & Cartographic Observatory
DO  - 10.6084/m9.figshare.34065711
UR  - ${sanitizeRisValue(url)}
N1  - Harmonized with World Bank WDI, IMF WEO, and UNESCO World Heritage Centre
KW  - Africa
KW  - Macroeconomics
KW  - ${sanitizeRisValue(country.name)}
KW  - ${sanitizeRisValue(country.unRegion || 'African Union')}
ER  - `;

  downloadAcademicFile(ris, `${cleanId}.ris`, 'application/x-research-info-systems');
};

export async function loadImageAsDataUrl(
  urlOrCandidates: string | string[],
  preferredFormat: 'JPEG' | 'PNG' = 'JPEG'
): Promise<LoadedImageData | null> {
  const mod = await import('./academicPdfExport');
  return mod.loadImageAsDataUrl(urlOrCandidates, preferredFormat);
}

export async function renderCountrySilhouetteToCanvas(
  countryId: string,
  width: number = 320,
  height: number = 320
): Promise<LoadedImageData | null> {
  const mod = await import('./academicPdfExport');
  return mod.renderCountrySilhouetteToCanvas(countryId, width, height);
}

export async function composeCountryHeaderCanvas(country: {
  id: string;
  name: string;
  officialName?: string;
  capital: string;
  region: string;
  subregion?: string;
  landAreaKm2?: number;
  gdpNominalUsd?: number;
  population?: number;
  hdi?: number;
}): Promise<LoadedImageData | null> {
  const mod = await import('./academicPdfExport');
  return mod.composeCountryHeaderCanvas(country);
}

export async function captureCountryHeaderImage(
  headerElementId: string = 'country-dossier-header-card',
  country: any
): Promise<LoadedImageData | null> {
  const mod = await import('./academicPdfExport');
  return mod.captureCountryHeaderImage(headerElementId, country);
}

export const exportHighDpiPlatePDF = async (
  illustration: SlaveTradeIllustration,
  citationText: string,
  options?: { candidateUrls?: string[] }
): Promise<void> => {
  const mod = await import('./academicPdfExport');
  return mod.exportHighDpiPlatePDF(illustration, citationText, options);
};

export const exportHistoricalPlatePDF = async (
  plate: HistoricalMapPlate,
  citationText?: string
): Promise<void> => {
  const mod = await import('./academicPdfExport');
  return mod.exportHistoricalPlatePDF(plate, citationText);
};

export const exportMonographPDF = async (
  title: string,
  subtitle: string,
  bodyContent: string[],
  citations: string[]
): Promise<void> => {
  const mod = await import('./academicPdfExport');
  return mod.exportMonographPDF(title, subtitle, bodyContent, citations);
};

export const exportPublicationPDF = async (pub: PublicationPdfInput): Promise<void> => {
  const mod = await import('./academicPdfExport');
  return mod.exportPublicationPDF(pub);
};

export const exportCountryIntelligenceBriefingPDF = async (
  country: {
    id: string;
    name: string;
    officialName?: string;
    capital: string;
    region: string;
    subregion?: string;
    landAreaKm2?: number;
    gdpNominalUsd?: number;
    population?: number;
    hdi?: number;
  },
  options?: {
    headerElementId?: string;
  }
): Promise<void> => {
  const mod = await import('./academicPdfExport');
  return mod.exportCountryIntelligenceBriefingPDF(country, options);
};

export const exportCustomBriefingDossierPDF = async (
  savedCountryIds: string[],
  savedPlateIds: string[]
): Promise<void> => {
  const mod = await import('./academicPdfExport');
  return mod.exportCustomBriefingDossierPDF(savedCountryIds, savedPlateIds);
};

export async function exportReproducibilityBundleZip(options?: {
  savedCountryIds?: string[];
  savedPlateIds?: string[];
  doi?: string;
  pageUrl?: string;
  version?: string;
}): Promise<void> {
  const mod = await import('./academicArchiveBundle');
  return mod.exportReproducibilityBundleZip(options);
}
