import type { ResearchReport } from '../data/reportsData';
import type { AfriataReport } from '../types/afriataReport';

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
  version?: string;
}

export function buildPlatformCitations(
  options: PlatformCitationOptions = {}
): Record<PlatformCitationFormat, string> {
  const accessDate = options.accessDate || new Date().toISOString().split('T')[0];
  const pageUrl =
    options.pageUrl ||
    (typeof window !== 'undefined' ? window.location.href : 'https://afriata.org');
  const doi = options.doi || AFRIATA_DOI;
  const version = options.version || '2026.1';

  const apa = `Correia, Z. F. (2026). Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows. Afriata. ${AFRIATA_REPO_URL} · https://doi.org/${doi}`;
  const chicago = `Correia, Zéluis F. 2026. Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows. Lisbon/Praia: Afriata. https://doi.org/${doi}.`;
  const mla = `Correia, Zéluis F. "Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows." Afriata, 2026, https://doi.org/${doi}. Accessed ${accessDate}.`;
  const harvard = `Correia, Z.F. (2026) Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows. Afriata. Available at: ${pageUrl} (Accessed: ${accessDate}). https://doi.org/${doi}.`;

  const bibtex = `@dataset{correia_africa_data_atlas_2026,
  author    = {Correia, Z{\\'e}luis F.},
  orcid     = {${AFRIATA_ORCID}},
  title     = {{Africa Data Atlas \\& Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows}},
  year      = {2026},
  publisher = {Afriata},
  doi       = {${doi}},
  url       = {${pageUrl}},
  version   = {${version}},
  note      = {Accessed: ${accessDate}}
}

@software{correia_afriata_vector_engine_2026,
  author    = {Correia, Z{\\'e}luis F.},
  orcid     = {${AFRIATA_ORCID}},
  title     = {{Afriata Continental Vector Topology \\& High-Precision Geodetic Engine (5,796 x 5,867)}},
  year      = {2026},
  publisher = {Afriata Cartographic Observatory},
  doi       = {${doi}},
  url       = {${pageUrl}}
}`;

  const ris = `TY  - DATA
TI  - Africa Data Atlas & Cartographic Observatory: An interactive atlas of geography, indicators and historical trade flows
AU  - Correia, Zéluis F.
PY  - 2026
PB  - Afriata
DO  - ${doi}
UR  - ${pageUrl}
Y2  - ${accessDate}
ER  -`;

  const cff = `cff-version: 1.2.0
message: "If you use this atlas or software in your research, please cite it as below."
title: "Africa Data Atlas & Cartographic Observatory"
authors:
  - family-names: "Correia"
    given-names: "Zéluis F."
    orcid: "${AFRIATA_ORCID_URL}"
version: "${version}"
doi: "${doi}"
date-released: "2026-01-15"
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
%A Correia, Zéluis F.
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

  switch (targetStyle) {
    case 'chicago':
      return `${authorsStr}. ${year}. "${title}${subtitle}." ${AFRIATA_PLATFORM_NAME}. ${doiUrl} (ORCID: ${AFRIATA_ORCID_URL}).`;
    case 'apa':
      return `${authorsStr} (${year}). ${title}${subtitle}. ${AFRIATA_PLATFORM_NAME}. ${doiUrl} (ORCID: ${AFRIATA_ORCID_URL})`;
    case 'mla':
      return `${authorsStr}. "${title}${subtitle}." ${AFRIATA_PLATFORM_NAME}, ${year}, ${doiUrl}. ORCID: ${AFRIATA_ORCID_URL}.`;
    case 'harvard':
      return `${authorsStr}, ${year}. ${title}${subtitle}. ${AFRIATA_PLATFORM_NAME}. Available at: <${doiUrl}> (ORCID: ${AFRIATA_ORCID_URL}).`;
    case 'bibtex': {
      const citeKey = report.id.replace(/[^a-zA-Z0-9]/g, '_') + '_' + year;
      return `@article{${citeKey},
  title={${title}},
  subtitle={${report.subtitle || ''}},
  author={${authorsList.join(' and ')}},
  journal={Afriata: Africa Data Atlas \\& Cartographic Observatory},
  year={${year}},
  doi={${doi}},
  url={${doiUrl}},
  note={Repository: ${AFRIATA_REPO_URL}; ORCID: ${AFRIATA_ORCID}}
}`;
    }
    case 'ris':
      return `TY  - JOUR
TI  - ${title}${subtitle}
${authorsList.map((a) => `AU  - ${a}`).join('\n')}
JO  - ${AFRIATA_PLATFORM_NAME}
PY  - ${year}
DO  - ${doi}
UR  - ${doiUrl}
N1  - ORCID: ${AFRIATA_ORCID_URL}
ER  - `;
    case 'jsonld': {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'ScholarlyArticle',
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
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }
  return false;
}
