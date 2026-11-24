import type { ResearchReport } from '../data/reportsData';
import type { AfriataReport } from '../types/afriataReport';
import { writeTextWithFallback } from '../hooks/useCopyToClipboard';

export const AFRIATA_DOI = '10.6084/m9.figshare.34065711';
export const AFRIATA_ORCID = '0000-0001-9421-6555';
export const AFRIATA_ORCID_URL = `https://orcid.org/${AFRIATA_ORCID}`;
export const AFRIATA_REPO_URL = 'https://github.com/zeluis/Africa-Digital-Atlas';
export const AFRIATA_SITE_URL = 'https://zeluis.github.io/Africa-Digital-Atlas/';
export const AFRIATA_PLATFORM_NAME = 'Afriata: Africa Data Atlas & Cartographic Observatory';

export type PlatformCitationFormat =
  | 'apa'
  | 'chicago'
  | 'harvard'
  | 'mla'
  | 'bibtex'
  | 'ris'
  | 'cff'
  | 'enw';

export type ReportCitationFormat =
  | 'chicago'
  | 'apa'
  | 'mla'
  | 'bibtex'
  | 'harvard'
  | 'ris'
  | 'jsonld';

export interface PlatformCitationOptions {
  doi?: string;
  pageUrl?: string;
  accessDate?: string;
  releaseDate?: string;
  version?: string;
}

export function escapeBibtexValue(value: string | null | undefined): string {
  if (!value) return '';
  return String(value)
    .replace(/\r?\n+/g, ' ')
    .replace(/(^|[^\\])([&%$#_])/g, '$1\\$2')
    .trim();
}

export function sanitizeRisValue(value: string | null | undefined): string {
  if (!value) return '';
  return String(value).replace(/\r?\n+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function buildPlatformCitations(
  options: PlatformCitationOptions = {}
): Record<PlatformCitationFormat, string> {
  const accessDate = options.accessDate || new Date().toISOString().split('T')[0];
  const releaseDate = options.releaseDate || '2026-11-18';
  const pageUrl =
    options.pageUrl ||
    (typeof window !== 'undefined' ? window.location.href : AFRIATA_SITE_URL);
  const doi = options.doi || AFRIATA_DOI;
  const version = options.version || '2026.1';

  const apa = `Correia, Z. F. (2026). Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows. Afriata. ${AFRIATA_REPO_URL} · https://doi.org/${doi}`;
  const chicago = `Correia, ZéLuis F. 2026. Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows. Lisbon/Praia: Afriata. https://doi.org/${doi}.`;
  const mla = `Correia, ZéLuis F. "Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows." Afriata, 2026, https://doi.org/${doi}. Accessed ${accessDate}.`;
  const harvard = `Correia, Z.F. (2026) Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows. Afriata. Available at: ${pageUrl} (Accessed: ${accessDate}). https://doi.org/${doi}.`;

  const bibtex = `@dataset{correia_africa_data_atlas_2026,
  author    = {Correia, Z{\\'e}Luis F.},
  orcid     = {${AFRIATA_ORCID}},
  title     = {{Africa Data Atlas \\& Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows}},
  year      = {2026},
  publisher = {Afriata},
  doi       = {${escapeBibtexValue(doi)}},
  url       = {${escapeBibtexValue(pageUrl)}},
  version   = {${escapeBibtexValue(version)}},
  note      = {Accessed: ${escapeBibtexValue(accessDate)}}
}

@software{correia_afriata_vector_engine_2026,
  author    = {Correia, Z{\\'e}Luis F.},
  orcid     = {${AFRIATA_ORCID}},
  title     = {{Afriata Continental Vector Topology \\& High-Precision Geodetic Engine (5,796 x 5,867)}},
  year      = {2026},
  publisher = {Afriata Cartographic Observatory},
  doi       = {${escapeBibtexValue(doi)}},
  url       = {${escapeBibtexValue(pageUrl)}}
}`;

  const ris = `TY  - DATA
TI  - Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows
AU  - Correia, ZéLuis F.
PY  - 2026
PB  - Afriata
DO  - ${sanitizeRisValue(doi)}
UR  - ${sanitizeRisValue(pageUrl)}
Y2  - ${sanitizeRisValue(accessDate)}
ER  -`;

  const cff = `cff-version: 1.2.0
message: "If you use this atlas or software in your research, please cite it as below."
title: "Africa Data Atlas & Cartographic Observatory"
authors:
  - family-names: "Correia"
    given-names: "ZéLuis F."
    orcid: "${AFRIATA_ORCID_URL}"
version: "${version}"
doi: "${doi}"
date-released: "${releaseDate}"
url: "${pageUrl}"
repository-code: "${AFRIATA_REPO_URL}"
keywords:
  - "Africa"
  - "Cartography"
  - "Socioeconomic Indicators"
  - "SlaveVoyages"
  - "AfCFTA"`;

  const enw = `%0 Dataset
%T Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows
%A Correia, ZéLuis F.
%D 2026
%I Afriata
%R ${doi}
%U ${pageUrl}`;

  return { apa, chicago, harvard, mla, bibtex, ris, cff, enw };
}

export function resolveReportDoi(rawDoi?: string): { doi: string; doiUrl: string } {
  const doi = rawDoi && !rawDoi.includes('afriata') ? rawDoi : AFRIATA_DOI;
  const doiUrl = doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
  return { doi, doiUrl };
}

export function buildReportCitation(
  report: ResearchReport | AfriataReport,
  targetStyle: ReportCitationFormat
): string {
  const authorsList = Array.isArray(report.authors)
    ? report.authors
    : [String(report.authors)];
  const authorsStr = authorsList.join(', ');
  const year = report.publicationDate?.split(' ').pop() || new Date().getFullYear().toString();
  const { doi, doiUrl } = resolveReportDoi(report.doi);
  const title = report.title;
  const subtitle = report.subtitle ? `: ${report.subtitle}` : '';
  const isWorkingPaper = Boolean((report as Partial<ResearchReport>).isWorkingPaper);
  const seriesLabel = isWorkingPaper ? 'Afriata Working Paper & Policy Brief Series' : AFRIATA_PLATFORM_NAME;

  switch (targetStyle) {
    case 'chicago':
      return `${authorsStr}. ${year}. "${title}${subtitle}." ${seriesLabel}. ${doiUrl} (ORCID: ${AFRIATA_ORCID_URL}).`;
    case 'apa':
      return `${authorsStr} (${year}). ${title}${subtitle}. ${seriesLabel}. ${doiUrl} (ORCID: ${AFRIATA_ORCID_URL})`;
    case 'mla':
      return `${authorsStr}. "${title}${subtitle}." ${seriesLabel}, ${year}, ${doiUrl}. ORCID: ${AFRIATA_ORCID_URL}.`;
    case 'harvard':
      return `${authorsStr}, ${year}. ${title}${subtitle}. ${seriesLabel}. Available at: <${doiUrl}> (ORCID: ${AFRIATA_ORCID_URL}).`;
    case 'bibtex': {
      const citeKey = report.id.replace(/[^a-zA-Z0-9]/g, '_') + '_' + year;
      const escapedTitle = escapeBibtexValue(title);
      const escapedSubtitle = escapeBibtexValue(report.subtitle || '');
      const escapedAuthors = authorsList.map(escapeBibtexValue).join(' and ');
      const escapedSeries = escapeBibtexValue(seriesLabel);
      const escapedDoi = escapeBibtexValue(doi);
      const escapedUrl = escapeBibtexValue(doiUrl);
      if (isWorkingPaper) {
        return `@techreport{${citeKey},
  title={${escapedTitle}},
  subtitle={${escapedSubtitle}},
  author={${escapedAuthors}},
  institution={${escapedSeries}},
  type={Working Paper},
  year={${escapeBibtexValue(year)}},
  doi={${escapedDoi}},
  url={${escapedUrl}},
  note={Repository: ${AFRIATA_REPO_URL}; ORCID: ${AFRIATA_ORCID}}
}`;
      }
      return `@article{${citeKey},
  title={${escapedTitle}},
  subtitle={${escapedSubtitle}},
  author={${escapedAuthors}},
  journal={Afriata: Africa Data Atlas \\& Cartographic Observatory},
  year={${escapeBibtexValue(year)}},
  doi={${escapedDoi}},
  url={${escapedUrl}},
  note={Repository: ${AFRIATA_REPO_URL}; ORCID: ${AFRIATA_ORCID}}
}`;
    }
    case 'ris':
      return `TY  - ${isWorkingPaper ? 'RPRT' : 'JOUR'}
TI  - ${sanitizeRisValue(title + subtitle)}
${authorsList.map((a) => `AU  - ${sanitizeRisValue(a)}`).join('\n')}
${isWorkingPaper ? 'PB' : 'JO'}  - ${sanitizeRisValue(seriesLabel)}
PY  - ${sanitizeRisValue(year)}
DO  - ${sanitizeRisValue(doi)}
UR  - ${sanitizeRisValue(doiUrl)}
N1  - ORCID: ${AFRIATA_ORCID_URL}
ER  - `;
    case 'jsonld': {
      const schema = {
        '@context': 'https://schema.org',
        '@type': isWorkingPaper ? 'Report' : 'ScholarlyArticle',
        headline: title,
        name: `${title}${subtitle}`,
        description: report.executiveSummary,
        author: authorsList.map((a) => ({
          '@type': 'Person',
          name: a,
          sameAs: AFRIATA_ORCID_URL,
        })),
        datePublished: report.publicationDate,
        identifier: doiUrl,
        publisher: {
          '@type': 'Organization',
          name: AFRIATA_PLATFORM_NAME,
          url: AFRIATA_SITE_URL,
        },
      };
      return JSON.stringify(schema, null, 2);
    }
    default:
      return '';
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  return writeTextWithFallback(text);
}
