/**
 * Portable Offline Research Archive (.zip) Builder (Lazy-loaded on demand)
 */

import { downloadBlob, escapeCsvCell } from './exportUtils';
import {
  AFRIATA_DOI,
  AFRIATA_ORCID_URL,
  AFRIATA_SITE_URL,
  buildPlatformCitations,
} from './citationFormatter';

/**
 * Compiles a portable, offline Research Archive (.zip) via lazy-loaded fflate
 * bundling bibliographic citations (.bib, .ris, CITATION.cff, .enw),
 * provenance manifest JSON, and formula-escaped macro country summary CSV.
 */
export async function exportReproducibilityBundleZip(options?: {
  savedCountryIds?: string[];
  savedPlateIds?: string[];
  doi?: string;
  pageUrl?: string;
  version?: string;
}): Promise<void> {
  const [{ zipSync, strToU8 }, { atlas }] = await Promise.all([
    import('fflate'),
    import('../data/atlas-store'),
  ]);

  const citations = buildPlatformCitations({
    doi: options?.doi || AFRIATA_DOI,
    pageUrl: options?.pageUrl || (typeof window !== 'undefined' ? window.location.href : AFRIATA_SITE_URL),
    version: options?.version || '2026.1',
  });

  const savedCountries = options?.savedCountryIds || [];
  const savedPlates = options?.savedPlateIds || [];
  const entities = savedCountries.length > 0
    ? savedCountries
        .map((id) => atlas.getEntity(id))
        .filter((e): e is NonNullable<typeof e> => Boolean(e))
    : atlas.getAllEntities();

  const csvHeader = [
    'ISO3',
    'ISO2',
    'Country',
    'Region',
    'Capital',
    'Population',
    'Nominal_GDP_USD_Bn',
    'HDI',
  ].join(',');

  const csvRows = entities.map((entity) => {
    const pop = atlas.getIndicatorValue(entity.id, 'SP.POP.TOTL');
    const gdp = atlas.getIndicatorValue(entity.id, 'NY.GDP.MKTP.CD');
    const hdi = atlas.getIndicatorValue(entity.id, 'UNDP.HDI.INDEX');
    return [
      escapeCsvCell(entity.id),
      escapeCsvCell(entity.iso2),
      escapeCsvCell(entity.name, { quoteAllStrings: true }),
      escapeCsvCell(entity.region, { quoteAllStrings: true }),
      escapeCsvCell(entity.capital, { quoteAllStrings: true }),
      escapeCsvCell(pop ?? ''),
      escapeCsvCell(gdp ?? ''),
      escapeCsvCell(hdi ?? ''),
    ].join(',');
  });

  const manifest = {
    platform: 'Afriata: Africa Data Atlas & Cartographic Observatory',
    doi: options?.doi || AFRIATA_DOI,
    orcid: AFRIATA_ORCID_URL,
    version: options?.version || '2026.1',
    exportedAt: new Date().toISOString(),
    licenses: {
      code: 'MIT',
      data: 'ODC-By-1.0',
      assets: 'CC-BY-4.0',
    },
    scope: savedCountries.length > 0 ? 'bookmarked_selection' : 'full_continent_54_states',
    countryCount: entities.length,
    bookmarkedPlatesCount: savedPlates.length,
    files: [
      'afriata_citation.bib',
      'afriata_citation.ris',
      'CITATION.cff',
      'afriata_citation.enw',
      'countries_macro_summary.csv',
      'provenance_manifest.json',
    ],
  };

  const zipped = zipSync({
    'afriata_citation.bib': strToU8(citations.bibtex),
    'afriata_citation.ris': strToU8(citations.ris),
    'CITATION.cff': strToU8(citations.cff),
    'afriata_citation.enw': strToU8(citations.enw),
    'countries_macro_summary.csv': strToU8('\uFEFF' + [csvHeader, ...csvRows].join('\r\n')),
    'provenance_manifest.json': strToU8(JSON.stringify(manifest, null, 2)),
  });

  const dateTag = new Date().toISOString().slice(0, 10);
  downloadBlob(
    `afriata_research_bundle_${dateTag}.zip`,
    new Blob([Uint8Array.from(zipped)], { type: 'application/zip' })
  );
}

