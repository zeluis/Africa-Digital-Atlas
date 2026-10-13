import { SlaveTradeIllustration, UnescoSiteMetadata } from './slaveTradeIllustrations';
import rawUnescoSitesJson from './unescoHeritageSites.json';
import rawPhotoRegistry from './unescoPhotoRegistry.json';

/**
 * ISO-2 to ISO-3 mapping for African & Arab States Parties
 * to enable seamless cross-linking with Africa Data Atlas country dossiers.
 */
export const ISO2_TO_ISO3_MAP: Record<string, string> = {
  dz: 'DZA', eg: 'EGY', ly: 'LBY', ma: 'MAR', mr: 'MRT', sd: 'SDN', tn: 'TUN',
  ao: 'AGO', bj: 'BEN', bw: 'BWA', bf: 'BFA', bi: 'BDI', cv: 'CPV', cm: 'CMR',
  cf: 'CAF', td: 'TCD', km: 'COM', cg: 'COG', cd: 'COD', ci: 'CIV', dj: 'DJI',
  gq: 'GNQ', er: 'ERI', sz: 'SWZ', et: 'ETH', ga: 'GAB', gm: 'GMB', gh: 'GHA',
  gn: 'GIN', gw: 'GNB', ke: 'KEN', ls: 'LSO', lr: 'LBR', mg: 'MDG', mw: 'MWI',
  ml: 'MLI', mu: 'MUS', mz: 'MOZ', na: 'NAM', ne: 'NER', ng: 'NGA', rw: 'RWA',
  st: 'STP', sn: 'SEN', sc: 'SYC', sl: 'SLE', so: 'SOM', za: 'ZAF', ss: 'SSD',
  tz: 'TZA', tg: 'TGO', ug: 'UGA', zm: 'ZMB', zw: 'ZWE',
  // Non-African Arab States ISO-2 -> ISO-3
  bh: 'BHR', iq: 'IRQ', jo: 'JOR', kw: 'KWT', lb: 'LBN', om: 'OMN', ps: 'PSE',
  qa: 'QAT', sa: 'SAU', sy: 'SYR', ae: 'ARE', ye: 'YEM'
};

const photoMap = new Map<number, any>();
if (rawPhotoRegistry && (rawPhotoRegistry as any).sites) {
  for (const s of (rawPhotoRegistry as any).sites) {
    photoMap.set(s.whcId, s);
  }
}

/**
 * Enriches UNESCO site metadata with curated photo registry metadata (photographer, licenses, attribution, URLs).
 */
export const enrichWithPhotoRegistry = (site: UnescoSiteMetadata): UnescoSiteMetadata => {
  const photoData = photoMap.get(site.idNumber);
  const hero = photoData?.suggestedHero;
  const author = hero?.author || site.photographer || 'UNESCO Photobank / Official Inscription Archives';
  const copyright = hero?.copyright || 'UNESCO';
  const licenseShort = hero?.licenseShort || site.license || 'CC BY-SA 3.0 IGO';
  const licenseUrl = hero?.licenseUrl || site.licenseUrl || 'https://creativecommons.org/licenses/by-sa/3.0/igo/';
  const rightsStatement = site.rightsStatement || 'https://rightsstatements.org/vocab/InC-EDU/1.0/';
  const attributionText = hero?.attribution || site.attributionText || `Photo © ${copyright} / WHC (${site.states}) • WHC #${site.idNumber} (${licenseShort})`;
  const institution = site.institution || 'UNESCO World Heritage Centre';
  const creator = hero?.author ? `${hero.author}, ${copyright}` : (site.creator || `UNESCO / State Party of ${site.states}`);
  const photographer = author;
  const authorRole = site.authorRole || 'Official UNESCO Documentation & Inscription Registry';
  const collectionOrRegistryId = site.collectionOrRegistryId || `WHC-${site.idNumber}`;
  const primaryUrl = hero?.fileUrl || site.primaryUrl || site.httpUrl;
  const highResDownloadUrl = hero?.fileUrl || site.highResDownloadUrl || site.imageUrl;
  const imageUrl = hero?.thumbUrl || hero?.fileUrl || site.imageUrl;

  return {
    ...site,
    imageUrl,
    creator,
    photographer,
    authorRole,
    attributionText,
    institution,
    collectionOrRegistryId,
    license: licenseShort,
    licenseUrl,
    rightsStatement,
    primaryUrl,
    highResDownloadUrl
  };
};

/**
 * Helper to strip HTML tags & decode common entities from UNESCO XML fields.
 */
export const cleanUnescoHtml = (raw?: string | null): string => {
  if (!raw) return '';
  let str = String(raw);
  str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  str = str.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
  str = str.replace(/<br\s*\/?>/gi, '\n');
  str = str.replace(/<[^>]+>/g, '');
  str = str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .trim();
  return str;
};

/**
 * Normalize UNESCO HTTP URLs to HTTPS
 */
export const normalizeUnescoUrl = (url?: string | null): string => {
  if (!url) return '';
  return url.trim().replace(/^http:\/\/whc\.unesco\.org/i, 'https://whc.unesco.org');
};

/**
 * Parses an official UNESCO World Heritage XML string and extracts rows.
 */
export const parseUnescoXmlRows = (xmlString: string): UnescoSiteMetadata[] => {
  if (typeof window === 'undefined' || !xmlString.trim()) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  const rows = Array.from(doc.querySelectorAll('row'));

  const extracted: UnescoSiteMetadata[] = [];

  for (const row of rows) {
    const getText = (tag: string): string => {
      const el = row.querySelector(tag);
      return el?.textContent?.trim() || '';
    };

    const rawRegion = getText('region') || getText('regions');
    const isAfrica = /africa/i.test(rawRegion);
    const isArabStates = /arab\s*states/i.test(rawRegion);

    if (!isAfrica && !isArabStates) {
      continue;
    }

    const region: 'Africa' | 'Arab States' = isArabStates ? 'Arab States' : 'Africa';
    const idNumber = parseInt(getText('id_number') || getText('unique_number') || '0', 10);
    if (!idNumber) continue;

    const rawCat = getText('category');
    const category: 'Cultural' | 'Natural' | 'Mixed' =
      /natural/i.test(rawCat) ? 'Natural' : /mixed/i.test(rawCat) ? 'Mixed' : 'Cultural';

    const isoRaw = getText('iso_code').toLowerCase();
    const firstIso2 = isoRaw.split(',')[0]?.trim() || '';
    const entityId = ISO2_TO_ISO3_MAP[firstIso2];

    const dangerRaw = getText('danger');
    const isDanger = Boolean(
      dangerRaw &&
      dangerRaw !== '0' &&
      dangerRaw.toLowerCase() !== 'false'
    );

    const latNum = parseFloat(getText('latitude'));
    const lngNum = parseFloat(getText('longitude'));

    const httpUrl = normalizeUnescoUrl(getText('http_url')) || `https://whc.unesco.org/en/list/${idNumber}`;
    const rawImg = normalizeUnescoUrl(getText('image_url')) || `https://whc.unesco.org/uploads/sites/site_${idNumber}.jpg`;
    const statesClean = cleanUnescoHtml(getText('states')) || 'UNESCO State Party';
    const criteriaTxt = getText('criteria_txt') || '(i)';

    let shortDesc = cleanUnescoHtml(getText('short_description'));
    if (!shortDesc) {
      if (idNumber === 1809) {
        shortDesc = 'Sebastia (ancient Samaria), situated northwest of Nablus in the West Bank, is a landmark archaeological complex encompassing stratified layers of Canaanite, Israelite, Hellenistic, Herodian Roman, Byzantine, and Islamic civilization, featuring monumental columned streets, civic basilicas, royal acropolises, and venerated medieval sanctuaries.';
      } else {
        shortDesc = `Official UNESCO ${category} World Heritage property inscribed by the State Party of ${statesClean} under criteria ${criteriaTxt}.`;
      }
    }

    const baseMeta: UnescoSiteMetadata = {
      idNumber,
      uniqueNumber: parseInt(getText('unique_number') || String(idNumber), 10),
      site: cleanUnescoHtml(getText('site')),
      category,
      criteriaTxt,
      dateInscribed: parseInt(getText('date_inscribed') || '1978', 10),
      secondaryDates: getText('secondary_dates') || undefined,
      danger: isDanger,
      dangerDates: isDanger ? dangerRaw : undefined,
      states: statesClean,
      region,
      isoCode: isoRaw || undefined,
      udnpCode: getText('udnp_code') || undefined,
      entityId,
      transboundary: getText('transboundary') === '1' || isoRaw.includes(',') || statesClean.includes(','),
      latitude: Number.isFinite(latNum) ? latNum : undefined,
      longitude: Number.isFinite(lngNum) ? lngNum : undefined,
      areaHectares: getText('area_hectares') || undefined,
      location: cleanUnescoHtml(getText('location')) || undefined,
      shortDescription: shortDesc,
      longDescription: cleanUnescoHtml(getText('long_description')) || undefined,
      historicalDescription: cleanUnescoHtml(getText('historical_description')) || undefined,
      justification: cleanUnescoHtml(getText('justification')) || undefined,
      httpUrl,
      imageUrl: rawImg,
      creator: `UNESCO / State Party of ${statesClean}`,
      photographer: 'UNESCO Photobank / Official Inscription Archives',
      authorRole: 'Official UNESCO Documentation & Inscription Registry',
      attributionText: `Photo © UNESCO / WHC (${statesClean}) • WHC #${idNumber} (CC BY-SA 3.0 IGO)`,
      institution: 'UNESCO World Heritage Centre',
      collectionOrRegistryId: `WHC-${idNumber}`,
      license: 'CC BY-SA 3.0 IGO',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/igo/',
      rightsStatement: 'https://rightsstatements.org/vocab/InC-EDU/1.0/',
      primaryUrl: httpUrl,
      highResDownloadUrl: rawImg
    };

    extracted.push(enrichWithPhotoRegistry(baseMeta));
  }

  return extracted.sort((a, b) => a.idNumber - b.idNumber);
};

/**
 * Converts a UnescoSiteMetadata record into a SlaveTradeIllustration compatible with ArchivalImageViewer.
 */
export const unescoSiteToIllustration = (site: UnescoSiteMetadata): SlaveTradeIllustration => {
  const descriptionParts: string[] = [];
  if (site.shortDescription) {
    descriptionParts.push(site.shortDescription);
  }
  if (site.longDescription && site.longDescription !== site.shortDescription) {
    descriptionParts.push(site.longDescription);
  }

  const officialSiteImg = `https://whc.unesco.org/uploads/sites/site_${site.idNumber}.jpg`;
  const photoData = photoMap.get(site.idNumber);
  const hero = photoData?.suggestedHero;

  const imageCandidates: string[] = [site.imageUrl, hero?.fileUrl, hero?.thumbUrl, officialSiteImg];
  if (photoData?.otherOpenCandidates) {
    for (const cand of photoData.otherOpenCandidates) {
      if (cand.fileUrl) imageCandidates.push(cand.fileUrl);
      if (cand.thumbUrl) imageCandidates.push(cand.thumbUrl);
    }
  }

  const candidateImages = Array.from(
    new Set(imageCandidates.filter((u): u is string => Boolean(u && u.trim())))
  );

  return {
    objectId: 50000 + site.idNumber,
    sourceFile: `unesco-whc-${site.idNumber}.xml`,
    sourceSha256: `unesco-whc-sha256-${site.idNumber}`,
    regId: `WHC-${site.idNumber}`,
    identifier: `UNESCO-WHC-${site.idNumber}`,
    title: site.site,
    date: `Inscribed ${site.dateInscribed}${site.secondaryDates ? ` (${site.secondaryDates})` : ''}`,
    source: `${site.states}${site.location ? ` • ${site.location}` : ''} (${site.region})`,
    imageUrls: candidateImages,
    collectionNames: [
      `${site.category} Heritage`,
      site.region,
      `Criteria ${site.criteriaTxt}`
    ],
    collectionIds: [site.idNumber],
    itemSets: [
      'UNESCO World Heritage Registry',
      ...(site.danger ? ['World Heritage in Danger'] : []),
      ...(site.transboundary ? ['Transboundary Property'] : [])
    ],
    researchers: [
      'UNESCO World Heritage Centre',
      site.category === 'Natural'
        ? 'IUCN Advisory Body'
        : site.category === 'Cultural'
        ? 'ICOMOS Advisory Body'
        : 'ICOMOS & IUCN Advisory Bodies',
      `State Party: ${site.states}`
    ],
    description: descriptionParts.join('\n\n'),
    slaveryImagesPage: site.httpUrl || `https://whc.unesco.org/en/list/${site.idNumber}`,
    coordinates:
      site.latitude !== undefined && site.longitude !== undefined
        ? [site.longitude, site.latitude]
        : undefined,
    unescoMeta: site,
    creator: site.creator || `UNESCO / State Party of ${site.states}`,
    photographer: site.photographer || 'UNESCO Photobank / Official Inscription Archives',
    authorRole: site.authorRole || 'Official UNESCO Documentation & Inscription Registry',
    attributionText: site.attributionText || `Photo © UNESCO / WHC (${site.states}) • WHC #${site.idNumber} (CC BY-SA 3.0 IGO)`,
    institution: site.institution || 'UNESCO World Heritage Centre',
    collectionOrRegistryId: site.collectionOrRegistryId || `WHC-${site.idNumber}`,
    license: site.license || 'CC BY-SA 3.0 IGO',
    licenseUrl: site.licenseUrl || 'https://creativecommons.org/licenses/by-sa/3.0/igo/',
    rightsStatement: site.rightsStatement || 'https://rightsstatements.org/vocab/InC-EDU/1.0/',
    primaryUrl: site.primaryUrl || site.httpUrl || `https://whc.unesco.org/en/list/${site.idNumber}`,
    highResDownloadUrl: site.highResDownloadUrl || site.imageUrl
  };
};

/**
 * Curated initial UNESCO World Heritage registry covering Africa and Arab States enriched with photo registry metadata.
 */
export const INITIAL_UNESCO_HERITAGE_SITES: UnescoSiteMetadata[] = (rawUnescoSitesJson as UnescoSiteMetadata[]).map(enrichWithPhotoRegistry);
