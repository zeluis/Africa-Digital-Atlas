/**
 * Academic Citation & High-DPI PDF Export Utility
 * Generates standardized bibliographic files (.bib, .ris, .json) and printable High-DPI PDFs with full image embedding.
 */

import type { SlaveTradeIllustration } from '../data/slaveTradeIllustrations';
import type { HistoricalMapPlate } from '../data/archivalCartographyData';
import { resolveAssetPath, getAssetCandidateUrls } from './assetPath';
import { COUNTRY_SILHOUETTES } from '../data/countrySilhouettes';
import { getCountryRegionTonalPalette } from '../data/unGeoschemeColors';
import { UN_M49_NUMERIC_CODES } from '../data/svgGeographySystem';

/**
 * Downloads a string as a formatted academic reference file
 */
export const downloadAcademicFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Generates and downloads a .bib (BibTeX) file
 */
export const exportBibTeXFile = (illustration: SlaveTradeIllustration) => {
  const year = illustration.date ? illustration.date.replace(/[^0-9]/g, '').slice(0, 4) || 'n.d.' : 'n.d.';
  const authors = illustration.researchers && illustration.researchers.length > 0
    ? illustration.researchers.join(' and ')
    : 'Handler, Jerome and Tuite, Michael';
  const cleanId = `plate_${illustration.objectId || illustration.regId.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const url = illustration.slaveryImagesPage || `http://www.slaveryimages.org/s/slaveryimages/item/${illustration.objectId}`;

  const bibtex = `@misc{${cleanId},
  author = {${authors}},
  title = {{${illustration.title}}},
  year = {${year}},
  howpublished = {Slavery Images: A Visual Record of the African Slave Trade},
  note = {Plate ID: ${illustration.regId}, Source: ${illustration.source}},
  url = {${url}}
}`;

  downloadAcademicFile(bibtex, `${cleanId}.bib`, 'application/x-bibtex');
};

/**
 * Generates and downloads a .ris (EndNote / Zotero / Mendeley) file
 */
export const exportRISFile = (illustration: SlaveTradeIllustration) => {
  const year = illustration.date ? illustration.date.replace(/[^0-9]/g, '').slice(0, 4) || '' : '';
  const authors = illustration.researchers && illustration.researchers.length > 0
    ? illustration.researchers.map(a => `AU  - ${a}`).join('\n')
    : 'AU  - Handler, Jerome\nAU  - Tuite, Michael';
  const url = illustration.slaveryImagesPage || `http://www.slaveryimages.org/s/slaveryimages/item/${illustration.objectId}`;

  const ris = `TY  - ART
TI  - ${illustration.title}
${authors}
PY  - ${year}
PB  - ${illustration.source}
M3  - Plate ${illustration.regId}
UR  - ${url}
N2  - ${illustration.description.replace(/\n+/g, ' ')}
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
  author = {${author}},
  title = {{${plate.title}}},
  year = {${year}},
  howpublished = {Afriata: Africa Data Atlas \\& Cartographic Observatory},
  organization = {${plate.institution}},
  note = {Source: ${plate.source}. Historical Region: ${plate.region}. Documented toponyms: ${toponyms}},
  url = {${url}}
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
TI  - ${plate.title}
AU  - ${author}
PY  - ${year}
PB  - ${plate.institution}
M3  - Archival Cartographic Plate ${plate.id}
UR  - ${url}
N1  - Source: ${plate.source}
N2  - ${plate.description.replace(/\n+/g, ' ')} Historical significance: ${plate.historicalSignificance.replace(/\n+/g, ' ')}
KW  - Cartography
KW  - Africa
KW  - Historical Geography
KW  - ${plate.region}
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
  title = {{${country.name} (${country.id}): Comprehensive Sovereign Macroeconomic and Development Dossier}},
  year = {${currentYear}},
  publisher = {Afriata: Africa Data Atlas \\& Cartographic Observatory},
  note = {Multilateral Harmonization: World Bank, IMF, African Development Bank, and UNESCO archives. DOI: 10.6084/m9.figshare.34065711},
  url = {${url}}
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
TI  - ${country.name} (${country.id}): Comprehensive Sovereign Macroeconomic and Development Dossier
AU  - Afriata Sovereign Data Consortium
PY  - ${currentYear}
PB  - Afriata: Africa Data Atlas & Cartographic Observatory
DO  - 10.6084/m9.figshare.34065711
UR  - ${url}
N1  - Harmonized with World Bank WDI, IMF WEO, and UNESCO World Heritage Centre
KW  - Africa
KW  - Macroeconomics
KW  - ${country.name}
KW  - ${country.unRegion || 'African Union'}
ER  - `;

  downloadAcademicFile(ris, `${cleanId}.ris`, 'application/x-research-info-systems');
};

export interface LoadedImageData {
  dataUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  format: 'JPEG' | 'PNG';
}

/**
 * Loads an image from a URL or array of candidate URLs,
 * draws it to an offscreen canvas to avoid taint/format issues in jsPDF,
 * and returns an untainted Data URL with dimension metadata.
 */
export async function loadImageAsDataUrl(
  urlOrCandidates: string | string[],
  preferredFormat: 'JPEG' | 'PNG' = 'JPEG'
): Promise<LoadedImageData | null> {
  if (typeof window === 'undefined') return null;

  const rawList = Array.isArray(urlOrCandidates) ? urlOrCandidates : [urlOrCandidates];
  const candidates: string[] = [];

  for (const item of rawList) {
    if (!item || typeof item !== 'string') continue;
    // Get candidate fallbacks (maps external si.regeneratedidentities.org -> local /assets/archives/ etc.)
    const subCandidates = getAssetCandidateUrls(item);
    for (const c of subCandidates) {
      if (!candidates.includes(c)) candidates.push(c);
    }
    const resolved = resolveAssetPath(item);
    if (resolved && !candidates.includes(resolved)) {
      candidates.push(resolved);
    }
  }

  for (const url of candidates) {
    try {
      let objectUrl = '';
      try {
        const res = await fetch(url);
        if (res.ok) {
          const blob = await res.blob();
          objectUrl = URL.createObjectURL(blob);
        }
      } catch {
        // Fetch failed (likely CORS on remote URL), fallback to direct img.src
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Image load timeout')), 8000);
        img.onload = () => {
          clearTimeout(timer);
          resolve();
        };
        img.onerror = (e) => {
          clearTimeout(timer);
          reject(e);
        };
        img.src = objectUrl || url;
      });

      const naturalW = img.naturalWidth || img.width || 600;
      const naturalH = img.naturalHeight || img.height || 450;

      const canvas = document.createElement('canvas');
      canvas.width = naturalW;
      canvas.height = naturalH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        continue;
      }

      if (preferredFormat === 'JPEG') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, naturalW, naturalH);
      }
      ctx.drawImage(img, 0, 0, naturalW, naturalH);

      const mime = preferredFormat === 'PNG' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mime, 0.95);

      if (objectUrl) URL.revokeObjectURL(objectUrl);

      return {
        dataUrl,
        width: naturalW,
        height: naturalH,
        aspectRatio: naturalW / naturalH,
        format: preferredFormat
      };
    } catch {
      // Try next candidate
      continue;
    }
  }

  return null;
}

/**
 * Renders the authentic SVG boundary contour for an African nation onto an offscreen canvas
 * and returns a crisp, high-DPI PNG data URL.
 */
export async function renderCountrySilhouetteToCanvas(
  countryId: string,
  width: number = 320,
  height: number = 320
): Promise<LoadedImageData | null> {
  if (typeof window === 'undefined') return null;

  const silhouette = COUNTRY_SILHOUETTES[countryId.toUpperCase()];
  if (!silhouette || !silhouette.path) return null;

  const palette = getCountryRegionTonalPalette(countryId);
  const m49 = UN_M49_NUMERIC_CODES[countryId.toUpperCase()] || '000';
  const gradId = `pdf-sil-grad-${countryId}`;

  const svgXml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${silhouette.viewBox}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.warmAccent}" stop-opacity="0.55" />
          <stop offset="100%" stop-color="${palette.deepTone}" stop-opacity="0.2" />
        </linearGradient>
      </defs>

      <!-- Background Radar Grid -->
      <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#E7E5E4" stroke-width="0.8" stroke-dasharray="4,4" rx="16" />
      <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#E7E5E4" stroke-width="0.6" stroke-dasharray="3,3" />

      <!-- Authentic Country Boundary Contour -->
      <path d="${silhouette.path}" fill="url(#${gradId})" stroke="${palette.warmAccent}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" />

      <!-- Capital City Beacon Pin Point -->
      ${silhouette.capital ? `
        <g transform="translate(${silhouette.capital.x}, ${silhouette.capital.y})">
          <circle r="10" fill="${palette.warmAccent}" opacity="0.3" />
          <circle r="5" fill="${palette.warmAccent}" opacity="0.85" />
          <circle r="2" fill="#FFFFFF" />
        </g>
      ` : ''}

      <!-- Watermark Identifiers -->
      <text x="12" y="24" font-family="monospace" font-size="11" font-weight="bold" fill="#78716C">M49: ${m49}</text>
      <text x="${width - 45}" y="${height - 12}" font-family="monospace" font-size="16" font-weight="900" fill="#D6D3D1" opacity="0.6">${countryId}</text>
    </svg>
  `.trim();

  const svgBlob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
  const blobUrl = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = blobUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = width * 2; // 2x Retina
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.scale(2, 2);
    ctx.drawImage(img, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/png');

    return {
      dataUrl,
      width: width * 2,
      height: height * 2,
      aspectRatio: width / height,
      format: 'PNG'
    };
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

/**
 * Synthesizes a publication-grade sovereign header plaque on a 2x Retina canvas
 * complete with regional gradient, flag, official metadata, 4 core indicator tiles,
 * and the authentic SVG country silhouette.
 */
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
  if (typeof window === 'undefined') return null;

  const { atlas } = await import('../data/atlas-store');
  const { formatGDP, formatPopulation, formatCurrency } = await import('../data/atlas-formatters');

  const width = 1400;
  const height = 440;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const palette = getCountryRegionTonalPalette(country.id);
  const nominalGdp = atlas.getIndicatorValue(country.id, 'NY.GDP.MKTP.CD') || country.gdpNominalUsd || 0;
  const population = atlas.getIndicatorValue(country.id, 'SP.POP.TOTL') || country.population || 0;
  const hdi = atlas.getIndicatorValue(country.id, 'UNDP.HDI.INDEX') || country.hdi || 0;
  const gdpPerCapita = population > 0 && nominalGdp > 0 ? Math.round((nominalGdp * 1e9) / (population * 1e6)) : 0;
  const entity = atlas.getEntity(country.id);
  const iso2 = (entity?.iso2 || country.id.slice(0, 2)).toLowerCase();

  // 1. Directional Gradient Background
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, palette.gradientStart || '#F5F5F4');
  grad.addColorStop(0.5, palette.gradientMid || '#E7E5E4');
  grad.addColorStop(1, palette.gradientEnd || '#D6D3D1');

  // Draw rounded card container
  ctx.fillStyle = grad;
  ctx.strokeStyle = palette.atlasBorder || '#D6D3D1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(10, 10, width - 20, height - 20, 24);
  ctx.fill();
  ctx.stroke();

  // 2. Load Flag
  try {
    const flagImg = new Image();
    flagImg.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      flagImg.onload = () => resolve();
      flagImg.onerror = reject;
      flagImg.src = `https://flagcdn.com/${iso2}.svg`;
    });
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(40, 42, 84, 56, 8);
    ctx.clip();
    ctx.drawImage(flagImg, 40, 42, 84, 56);
    ctx.restore();
    ctx.strokeStyle = '#D6D3D1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 42, 84, 56);
  } catch {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(40, 42, 84, 56, 8);
    ctx.fill();
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(country.id, 56, 78);
  }

  // 3. Country Titles & Identity
  const textLeft = 145;
  ctx.fillStyle = '#18181B';
  ctx.font = 'bold 44px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(country.name, textLeft, 74);

  // Region Badge
  ctx.font = 'bold 16px "Plus Jakarta Sans", monospace';
  ctx.fillStyle = '#047857';
  ctx.fillText(`• ${country.region}`, textLeft + ctx.measureText(country.name).width + 18, 70);

  ctx.fillStyle = '#52525B';
  ctx.font = 'normal 20px "Plus Jakarta Sans", system-ui, sans-serif';
  const official = country.officialName || country.name;
  ctx.fillText(official.slice(0, 55), textLeft, 108);

  // Metadata ribbon: Capital, Land Area, ISO
  ctx.font = '16px monospace';
  ctx.fillStyle = '#71717A';
  const metaLine = `Capital: ${country.capital}   |   Land Area: ${(country.landAreaKm2 || 0).toLocaleString()} km²   |   ISO-3: ${country.id} / ${iso2.toUpperCase()}`;
  ctx.fillText(metaLine, textLeft, 140);

  // 4. Draw 4 Elevated Core Metrics Cards
  const statBoxY = 175;
  const statBoxW = 205;
  const statBoxH = 95;
  const stats = [
    { label: 'POPULATION', val: formatPopulation(population), color: '#047857' },
    { label: 'NOMINAL GDP', val: formatGDP(nominalGdp), color: '#0284C7' },
    { label: 'GDP PER CAPITA', val: gdpPerCapita > 0 ? formatCurrency(gdpPerCapita) : '—', color: '#059669' },
    { label: 'HUMAN DEV. (HDI)', val: hdi > 0 ? hdi.toFixed(3) : '—', color: '#B45309' },
  ];

  stats.forEach((stat, idx) => {
    const bx = 40 + (idx * (statBoxW + 16));
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E4E4E7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx, statBoxY, statBoxW, statBoxH, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#71717A';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(stat.label, bx + 14, statBoxY + 30);

    ctx.fillStyle = stat.color;
    ctx.font = 'bold 24px monospace';
    ctx.fillText(stat.val, bx + 14, statBoxY + 68);
  });

  // Subtitle / Regional Blocs line
  ctx.font = '15px monospace';
  ctx.fillStyle = '#52525B';
  const blocsStr = entity?.blocs?.join('  •  ') || 'African Continental Free Trade Area (AfCFTA)';
  ctx.fillText(`Regional Economic Blocs: ${blocsStr}`, 40, 310);

  // 5. Render Authentic Country Silhouette on the right side
  try {
    const silData = await renderCountrySilhouetteToCanvas(country.id, 320, 320);
    if (silData) {
      const silImg = new Image();
      await new Promise<void>((resolve, reject) => {
        silImg.onload = () => resolve();
        silImg.onerror = reject;
        silImg.src = silData.dataUrl;
      });

      const silX = width - 400;
      const silY = 35;
      const silW = 360;
      const silH = 370;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = '#E4E4E7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(silX, silY, silW, silH, 20);
      ctx.fill();
      ctx.stroke();

      ctx.drawImage(silImg, silX + 20, silY + 25, 320, 320);
    }
  } catch (err) {
    console.warn('Failed to draw silhouette on header canvas:', err);
  }

  const dataUrl = canvas.toDataURL('image/png');
  return {
    dataUrl,
    width,
    height,
    aspectRatio: width / height,
    format: 'PNG'
  };
}

/**
 * Captures the live country header element from DOM if present,
 * or synthesizes an ultra-crisp high-DPI header image with flag, silhouette, and indicators.
 */
export async function captureCountryHeaderImage(
  headerElementId: string = 'country-dossier-header-card',
  country: any
): Promise<LoadedImageData | null> {
  if (typeof window === 'undefined') return null;

  // 1. Try DOM capture first via html-to-image
  if (typeof document !== 'undefined') {
    const element = document.getElementById(headerElementId);
    if (element) {
      try {
        const { toPng } = await import('html-to-image');
        const dataUrl = await toPng(element, {
          quality: 0.95,
          pixelRatio: 2,
          filter: (node: HTMLElement) => {
            if (node.tagName === 'BUTTON') return false;
            if (node.classList?.contains('print:hidden')) return false;
            return true;
          }
        });

        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = dataUrl;
        });

        const w = img.naturalWidth || 1400;
        const h = img.naturalHeight || 440;
        return {
          dataUrl,
          width: w,
          height: h,
          aspectRatio: w / h,
          format: 'PNG'
        };
      } catch (err) {
        console.warn('Live DOM header capture fallback to synthetic composer:', err);
      }
    }
  }

  // 2. Fallback to synthetic high-DPI canvas composer
  return composeCountryHeaderCanvas(country);
}

/**
 * Generates a high-resolution academic PDF dossier containing the plate image,
 * bibliographic reference, archival provenance, and research commentary.
 */
export const exportHighDpiPlatePDF = async (
  illustration: SlaveTradeIllustration,
  citationText: string,
  options?: { candidateUrls?: string[] }
): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);

  // Background Wash
  doc.setFillColor(250, 248, 245);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Banner & Border
  doc.setDrawColor(180, 160, 140);
  doc.setLineWidth(0.4);
  doc.line(margin, margin + 12, pageWidth - margin, margin + 12);

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(120, 53, 15);
  doc.text(`AFRICA DATA ATLAS • ARCHIVAL ICONOGRAPHY DOSSIER`, margin, margin + 6);

  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`PLATE ID: ${illustration.regId}`, pageWidth - margin - 35, margin + 6);

  // Document Title
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 25, 20);
  const titleLines = doc.splitTextToSize(illustration.title, contentWidth);
  doc.text(titleLines, margin, margin + 20);

  let currentY = margin + 22 + (titleLines.length * 6);

  // Meta Info Bar (Epoch & Source)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 80, 70);
  const metaText = `Epoch: ${illustration.date || 'Historical Epoch'}  |  Provenance: ${illustration.source}`;
  doc.text(metaText, margin, currentY);
  currentY += 6;

  // Render high-DPI image into PDF using multi-candidate loader
  const candidatePool = [
    ...(options?.candidateUrls || []),
    ...(illustration.imageUrls || []),
    ...(illustration.externalAssetLinks?.map(l => l.url) || [])
  ];

  const imgData = await loadImageAsDataUrl(candidatePool, 'JPEG');
  if (imgData) {
    const imgAspect = imgData.aspectRatio || 1.33;
    const maxImgHeight = 88;
    const imgWidth = Math.min(contentWidth, maxImgHeight * imgAspect);
    const imgHeight = imgWidth / imgAspect;
    const imgX = margin + (contentWidth - imgWidth) / 2;

    // Draw subtle border around plate
    doc.setDrawColor(210, 200, 190);
    doc.setLineWidth(0.3);
    doc.rect(imgX - 1, currentY - 1, imgWidth + 2, imgHeight + 2);

    doc.addImage(imgData.dataUrl, imgData.format, imgX, currentY, imgWidth, imgHeight);
    currentY += imgHeight + 8;
  } else {
    // Fallback banner
    doc.setDrawColor(200, 180, 160);
    doc.setFillColor(245, 240, 230);
    doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'FD');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 100, 80);
    doc.text(`[Archival Plate: ${illustration.title} - High-Res Image preserved at archival repository]`, margin + 4, currentY + 11);
    currentY += 26;
  }

  // Bibliographic Citation Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(210, 195, 180);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(140, 70, 20);
  doc.text('STANDARDIZED SCHOLARLY CITATION', margin + 4, currentY + 5);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(40, 40, 40);
  const citationLines = doc.splitTextToSize(citationText || `${illustration.title}. (${illustration.date}). ${illustration.source}.`, contentWidth - 8);
  doc.text(citationLines, margin + 4, currentY + 11);
  currentY += 32;

  // Historical Analysis / Description
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 25, 20);
  doc.text('Archival Context & Significance', margin, currentY);
  currentY += 5;

  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 50, 45);
  const descText = illustration.description || 'Archival plate documenting the iconography and material culture of the transatlantic crossing.';
  const descLines = doc.splitTextToSize(descText, contentWidth);
  doc.text(descLines.slice(0, 12), margin, currentY);
  currentY += Math.min(descLines.length, 12) * 4.2 + 6;

  // Academic Lead Note
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Academic Curation: Dr. Kathryn Burns, UNC Chapel Hill • Curatorial Database: Slavery Images Archive', margin, pageHeight - margin + 2);

  // Save the PDF
  const filename = `Plate_${illustration.regId.replace(/[^a-zA-Z0-9]/g, '_')}_Dossier.pdf`;
  doc.save(filename);
};

/**
 * Generates a high-resolution academic PDF dossier for an antique cartographic plate
 * complete with the plate scan, cartouche framing, citation, toponyms, and georeferenced bounds.
 */
export const exportHistoricalPlatePDF = async (
  plate: HistoricalMapPlate,
  citationText?: string
): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - (margin * 2);

  // Background Wash
  doc.setFillColor(250, 248, 245);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Banner & Border
  doc.setDrawColor(180, 160, 140);
  doc.setLineWidth(0.4);
  doc.line(margin, margin + 11, pageWidth - margin, margin + 11);

  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(120, 53, 15);
  doc.text('AFRICA DATA ATLAS • ARCHIVAL CARTOGRAPHIC DOSSIER', margin, margin + 6);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text(`PLATE REF: ${plate.id.toUpperCase()}`, pageWidth - margin - 45, margin + 6);

  // Document Title
  let currentY = margin + 18;
  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 25, 20);
  const titleLines = doc.splitTextToSize(plate.title, contentWidth);
  doc.text(titleLines, margin, currentY);
  currentY += (titleLines.length * 5.8) + 2;

  // Metadata Bar
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 80, 70);
  const metaText = `Cartographer: ${plate.cartographer} (${plate.year})   |   Century: ${plate.century}   |   Institution: ${plate.institution}`;
  doc.text(doc.splitTextToSize(metaText, contentWidth), margin, currentY);
  currentY += 8;

  // Render High-DPI Antique Plate Image
  const candidates = [plate.imageUrl, ...(plate.fallbackUrls || []), plate.thumbnailUrl];
  const imgData = await loadImageAsDataUrl(candidates, 'JPEG');
  if (imgData) {
    const imgAspect = imgData.aspectRatio || 1.33;
    const maxH = 94;
    const imgW = Math.min(contentWidth, maxH * imgAspect);
    const imgH = imgW / imgAspect;
    const imgX = margin + (contentWidth - imgW) / 2;

    // Cartouche decorative double border
    doc.setDrawColor(180, 150, 120);
    doc.setLineWidth(0.6);
    doc.rect(imgX - 1.5, currentY - 1.5, imgW + 3, imgH + 3);
    doc.setDrawColor(220, 210, 195);
    doc.setLineWidth(0.2);
    doc.rect(imgX - 2.8, currentY - 2.8, imgW + 5.6, imgH + 5.6);

    doc.addImage(imgData.dataUrl, imgData.format, imgX, currentY, imgW, imgH);
    currentY += imgH + 8;
  } else {
    // Archival placeholder box
    doc.setFillColor(245, 240, 230);
    doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 100, 80);
    doc.text(`[Archival Plate Scan: ${plate.title} — High-resolution scan preserved at ${plate.institution}]`, margin + 4, currentY + 13);
    currentY += 30;
  }

  // Bibliographic Citation Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(210, 195, 180);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 70, 20);
  doc.text('STANDARDIZED SCHOLARLY CITATION', margin + 4, currentY + 5);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(40, 40, 40);
  const defaultCitation = `${plate.cartographer} (${plate.year}). "${plate.title}." ${plate.source}. Preserved at ${plate.institution}.`;
  const citationLines = doc.splitTextToSize(citationText || defaultCitation, contentWidth - 8);
  doc.text(citationLines, margin + 4, currentY + 10);
  currentY += 28;

  // Historical Analysis & Significance
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 25, 20);
  doc.text('Historical & Epistemological Significance', margin, currentY);
  currentY += 4.5;

  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 45, 40);
  const descLines = doc.splitTextToSize(plate.description, contentWidth);
  doc.text(descLines.slice(0, 5), margin, currentY);
  currentY += (Math.min(descLines.length, 5) * 4) + 4;

  // Key Toponyms Observed
  if (plate.toponymsToObserve && plate.toponymsToObserve.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(140, 70, 20);
    doc.text('Documented Historic Toponyms:', margin, currentY);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);
    doc.text(plate.toponymsToObserve.join('   •   '), margin + 50, currentY);
    currentY += 6;
  }

  // Georeferenced Coordinates
  if (plate.homographyBounds) {
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 115, 110);
    const boundsText = `Georeferenced Homography: North ${plate.homographyBounds.north}°  |  South ${plate.homographyBounds.south}°  |  West ${plate.homographyBounds.west}°  |  East ${plate.homographyBounds.east}°`;
    doc.text(boundsText, margin, currentY);
  }

  // Running Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 115, 110);
  doc.text('Afriata Cartographic Observatory • DOI: 10.6084/m9.figshare.34065711 • CC BY 4.0 Open Access', margin, pageHeight - margin + 2);

  const cleanFilename = `Plate_${plate.id}_Archival_Dossier.pdf`;
  doc.save(cleanFilename);
};

/**
 * Generates an Automated Monograph PDF Research Brief complete with title, summary, key metrics, and citations.
 */
export const exportMonographPDF = async (
  title: string,
  subtitle: string,
  bodyContent: string[],
  citations: string[]
): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);

  // Background Wash
  doc.setFillColor(250, 248, 245);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Banner & Border
  doc.setDrawColor(180, 160, 140);
  doc.setLineWidth(0.4);
  doc.line(margin, margin + 12, pageWidth - margin, margin + 12);

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(120, 53, 15);
  doc.text(`AFRICA DATA ATLAS • AUTOMATED RESEARCH MONOGRAPH`, margin, margin + 6);

  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`DOI: 10.6084/m9.figshare.34065711`, pageWidth - margin - 55, margin + 6);

  // Document Title
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 25, 20);
  const titleLines = doc.splitTextToSize(title, contentWidth);
  doc.text(titleLines, margin, margin + 20);

  let currentY = margin + 22 + (titleLines.length * 6);

  if (subtitle) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(90, 80, 70);
    const subLines = doc.splitTextToSize(subtitle, contentWidth);
    doc.text(subLines, margin, currentY);
    currentY += subLines.length * 5 + 4;
  }

  // Body paragraphs
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(50, 45, 40);

  for (const paragraph of bodyContent) {
    if (currentY > pageHeight - 45) {
      doc.addPage();
      doc.setFillColor(250, 248, 245);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      currentY = margin;
    }
    const paraLines = doc.splitTextToSize(paragraph, contentWidth);
    doc.text(paraLines, margin, currentY);
    currentY += (paraLines.length * 4.5) + 5;
  }

  // Citations section
  if (citations && citations.length > 0) {
    if (currentY > pageHeight - 50) {
      doc.addPage();
      doc.setFillColor(250, 248, 245);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      currentY = margin;
    }

    currentY += 4;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(120, 53, 15);
    doc.text('Primary Sources & Scholarly References', margin, currentY);
    currentY += 6;

    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);

    for (const cite of citations) {
      const citeLines = doc.splitTextToSize(`• ${cite}`, contentWidth);
      if (currentY > pageHeight - 25) {
        doc.addPage();
        doc.setFillColor(250, 248, 245);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        currentY = margin;
      }
      doc.text(citeLines, margin, currentY);
      currentY += (citeLines.length * 3.8) + 3;
    }
  }

  // Footer Note
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Africa Data Atlas • Cartographic Observatory & Research Repository • CC-BY 4.0', margin, pageHeight - margin + 2);

  const cleanFilename = `${title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)}_Monograph.pdf`;
  doc.save(cleanFilename);
};

export interface PublicationPdfInput {
  id: string;
  title: string;
  subtitle?: string | null;
  authors?: string[];
  institutions?: string[];
  publicationDate?: string;
  seriesNumber?: string;
  isWorkingPaper?: boolean;
  doi?: string;
  jelCodes?: string[];
  classification?: string | { disciplines?: string[]; pillar?: string };
  executiveSummary?: string;
  sections?: Array<{
    id?: string;
    title: string;
    content: string;
    keyTakeaway?: string;
  }>;
  citations?: Array<{
    authors?: string;
    year?: number | string;
    title?: string;
    journalOrPublisher?: string;
    doiOrUrl?: string;
  } | string>;
}

/**
 * Generates and downloads a complete, multi-page publication-grade PDF
 * for any Afriata Research Monograph or Working Paper.
 */
export const exportPublicationPDF = async (pub: PublicationPdfInput): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - (margin * 2);

  const cleanDoi = pub.doi ? pub.doi.replace('https://doi.org/', '').trim() : '10.6084/m9.figshare.34065711';
  const authorsList = pub.authors && pub.authors.length > 0 
    ? pub.authors 
    : (pub.isWorkingPaper ? ['Afriata Interdisciplinary Research & Knowledge Initiative'] : ['Afriata']);
  const institutionsList = pub.institutions && pub.institutions.length > 0 
    ? pub.institutions 
    : ['Afriata Research Platform'];
  const pubDate = pub.publicationDate || '2026';
  const classificationStr = typeof pub.classification === 'string'
    ? pub.classification
    : (pub.classification?.disciplines?.[0] || 'Historical Political Economy');
  const jelStr = pub.jelCodes && pub.jelCodes.length > 0 ? `JEL: ${pub.jelCodes.join(', ')}` : '';

  // 1. First Page Header Banner
  doc.setDrawColor(180, 160, 140);
  doc.setLineWidth(0.4);
  doc.line(margin, margin + 9, pageWidth - margin, margin + 9);

  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 53, 15);
  const seriesText = pub.isWorkingPaper
    ? `AFRIATA WORKING PAPER SERIES • ${pub.seriesNumber || 'WORKING PAPER NO. 08'}`
    : 'AFRIATA SCHOLARLY RESEARCH MONOGRAPH SERIES';
  doc.text(seriesText, margin, margin + 6);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 80, 70);
  doc.text(`DOI: ${cleanDoi}`, pageWidth - margin - 50, margin + 6);

  // 2. Title & Subtitle
  let currentY = margin + 17;
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(28, 25, 23);
  const titleLines = doc.splitTextToSize(pub.title, contentWidth);
  doc.text(titleLines, margin, currentY);
  currentY += (titleLines.length * 6.5) + 2;

  if (pub.subtitle) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(87, 83, 78);
    const subLines = doc.splitTextToSize(pub.subtitle, contentWidth);
    doc.text(subLines, margin, currentY);
    currentY += (subLines.length * 4.5) + 3;
  }

  // 3. Authors & Metadata Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(41, 37, 36);
  doc.text(authorsList.join('  •  '), margin, currentY);
  currentY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 113, 108);
  const metaLine = `${institutionsList.join('  |  ')}  •  ${pubDate}  •  ${classificationStr} ${jelStr ? ' • ' + jelStr : ''}`;
  const metaLines = doc.splitTextToSize(metaLine, contentWidth);
  doc.text(metaLines, margin, currentY);
  currentY += (metaLines.length * 4) + 4;

  // Thin separator line before abstract
  doc.setDrawColor(220, 215, 205);
  doc.setLineWidth(0.2);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  // 4. Executive Summary / Abstract Box
  if (pub.executiveSummary) {
    const cleanAbstract = pub.executiveSummary
      .replace(/\[REF:[^|\]]+(?:\|([^\]]+))?\]/g, '($1)')
      .replace(/[#*`]/g, '')
      .trim();

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    const abstractLines = doc.splitTextToSize(cleanAbstract, contentWidth - 8);
    const boxHeight = (abstractLines.length * 4.2) + 12;

    // Soft warm background box
    doc.setFillColor(250, 248, 245);
    doc.rect(margin, currentY, contentWidth, boxHeight, 'F');

    // Amber left vertical accent bar
    doc.setFillColor(217, 119, 6);
    doc.rect(margin, currentY, 1.8, boxHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text('EXECUTIVE ABSTRACT', margin + 4, currentY + 5);

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(41, 37, 36);
    doc.text(abstractLines, margin + 4, currentY + 10);

    currentY += boxHeight + 7;
  }

  // 5. Sections Rendering
  if (pub.sections && pub.sections.length > 0) {
    for (const sec of pub.sections) {
      if (currentY > pageHeight - 35) {
        doc.addPage();
        currentY = margin + 12;
      }

      // Section Title
      doc.setFont('times', 'bold');
      doc.setFontSize(11.5);
      doc.setTextColor(28, 25, 23);
      const secTitleLines = doc.splitTextToSize(sec.title, contentWidth);
      doc.text(secTitleLines, margin, currentY);
      currentY += (secTitleLines.length * 5) + 3;

      // Clean Paragraphs
      const rawContent = sec.content
        .replace(/\[REF:[^|\]]+(?:\|([^\]]+))?\]/g, '($1)')
        .replace(/<[^>]*>/g, '');
      const paragraphs = rawContent.split(/\n\s*\n/).filter(p => p.trim());

      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(41, 37, 36);

      for (const p of paragraphs) {
        const cleanP = p.replace(/^[#*>-]+\s*/, '').replace(/[*_`]/g, '').trim();
        if (!cleanP) continue;

        const pLines = doc.splitTextToSize(cleanP, contentWidth);
        if (currentY + (pLines.length * 4.2) > pageHeight - 20) {
          doc.addPage();
          currentY = margin + 12;
        }

        doc.text(pLines, margin, currentY);
        currentY += (pLines.length * 4.2) + 3.5;
      }

      // Key Takeaway callout if present
      if (sec.keyTakeaway) {
        if (currentY > pageHeight - 25) {
          doc.addPage();
          currentY = margin + 12;
        }

        const cleanTakeaway = sec.keyTakeaway.replace(/[*_`]/g, '').trim();
        const takeawayLines = doc.splitTextToSize(`Key Takeaway: ${cleanTakeaway}`, contentWidth - 6);
        const takeawayBoxHeight = (takeawayLines.length * 4) + 6;

        doc.setFillColor(245, 243, 239);
        doc.rect(margin, currentY, contentWidth, takeawayBoxHeight, 'F');
        doc.setFillColor(16, 185, 129);
        doc.rect(margin, currentY, 1.5, takeawayBoxHeight, 'F');

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(68, 64, 60);
        doc.text(takeawayLines, margin + 4, currentY + 4.5);

        currentY += takeawayBoxHeight + 5;
      }

      currentY += 2;
    }
  }

  // 6. Citations & References Section
  if (pub.citations && pub.citations.length > 0) {
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = margin + 12;
    }

    doc.setDrawColor(200, 195, 185);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 6;

    doc.setFont('times', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(120, 53, 15);
    doc.text('PRIMARY SOURCES & SCHOLARLY REFERENCES', margin, currentY);
    currentY += 5;

    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(68, 64, 60);

    for (const cite of pub.citations) {
      let citeStr = '';
      if (typeof cite === 'string') {
        citeStr = cite;
      } else {
        citeStr = `${cite.authors || 'Afriata'} (${cite.year || '2026'}). ${cite.title || 'Scholarly Treatise'}. ${cite.journalOrPublisher || 'Afriata Press'}. ${cite.doiOrUrl || ''}`.trim();
      }

      const citeLines = doc.splitTextToSize(`• ${citeStr}`, contentWidth);
      if (currentY + (citeLines.length * 3.6) > pageHeight - 20) {
        doc.addPage();
        currentY = margin + 12;
      }

      doc.text(citeLines, margin, currentY);
      currentY += (citeLines.length * 3.6) + 2.5;
    }
  }

  // 7. Running Page Header & Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Running Header (pages > 1)
    if (p > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(140, 130, 120);
      const headerTitle = pub.title.length > 55 ? `${pub.title.slice(0, 52)}...` : pub.title;
      doc.text(headerTitle, margin, margin - 4);
      doc.text(`DOI: ${cleanDoi}`, pageWidth - margin - 45, margin - 4);

      doc.setDrawColor(220, 215, 205);
      doc.setLineWidth(0.2);
      doc.line(margin, margin - 2, pageWidth - margin, margin - 2);
    }

    // Running Footer (all pages)
    doc.setDrawColor(220, 215, 205);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - margin + 1, pageWidth - margin, pageHeight - margin + 1);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 113, 108);
    doc.text('Africa Data Atlas • Cartographic Observatory & Open Research Repository • CC BY 4.0', margin, pageHeight - margin + 4.5);

    doc.setFont('courier', 'bold');
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin - 20, pageHeight - margin + 4.5);
  }

  const cleanFilename = `${(pub.id || 'Afriata_Monograph').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  doc.save(cleanFilename);
};

/**
 * Generates an executive 2-page Country Intelligence Dossier PDF
 * Prints the complete country header as an image (including flag, badges, and SVG silhouette)
 */
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
  const { jsPDF } = await import('jspdf');
  const { atlas } = await import('../data/atlas-store');
  const { getCountryTradeFlows, getCountryMineralsProfile } = await import('../data/criticalMineralsData');
  const { ensureUnescoHeritageSitesLoaded } = await import('../data/unescoHeritageRegistry');
  const { formatGDP, formatPopulation, formatCurrency } = await import('../data/atlas-formatters');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - (margin * 2);

  const nominalGdp = atlas.getIndicatorValue(country.id, 'NY.GDP.MKTP.CD') || country.gdpNominalUsd || 0;
  const population = atlas.getIndicatorValue(country.id, 'SP.POP.TOTL') || country.population || 0;
  const hdi = atlas.getIndicatorValue(country.id, 'UNDP.HDI.INDEX') || country.hdi || 0;
  const gdpPerCapita = population > 0 && nominalGdp > 0 ? Math.round((nominalGdp * 1e9) / (population * 1e6)) : 0;
  const tradeProfile = getCountryTradeFlows(country.id, country.name);
  const mineralsProfile = getCountryMineralsProfile(country.id, country.name);
  const allHeritageSites = await ensureUnescoHeritageSitesLoaded();
  const heritageSites = allHeritageSites.filter(s => s.entityId === country.id || s.isoCode === country.id);

  // ================= PAGE 1 =================
  doc.setFillColor(252, 250, 247);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Accent Rule
  doc.setFillColor(16, 185, 129); // Emerald accent
  doc.rect(margin, margin - 4, contentWidth, 2, 'F');

  // Header Title
  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 53, 15);
  doc.text('AFRICA DATA ATLAS • EXECUTIVE SOVEREIGN INTELLIGENCE DOSSIER', margin, margin + 2);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);
  doc.text(`ISO-3: ${country.id} • DOI: 10.6084/m9.figshare.34065711`, pageWidth - margin - 70, margin + 2);

  let currentY = margin + 5;

  // Print Full Country Header As Image (including flag, badges, and authentic SVG silhouette)
  try {
    const headerImg = await captureCountryHeaderImage(options?.headerElementId || 'country-dossier-header-card', country);
    if (headerImg) {
      const headerW = contentWidth;
      const headerH = Math.min(52, headerW / headerImg.aspectRatio);
      doc.addImage(headerImg.dataUrl, headerImg.format, margin, currentY, headerW, headerH);
      currentY += headerH + 5;
    } else {
      doc.setFont('times', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(24, 24, 27);
      doc.text(country.name, margin, currentY + 12);
      currentY += 18;
    }
  } catch (err) {
    console.warn('Failed to embed header image in PDF:', err);
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(24, 24, 27);
    doc.text(country.name, margin, currentY + 12);
    currentY += 18;
  }

  // Dividing line
  doc.setDrawColor(210, 200, 190);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  // Section 1: Macroeconomic Indicator Matrix
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 25, 20);
  doc.text('1. Core Macroeconomic & Demographic Fundamentals', margin, currentY + 2);
  currentY += 5;

  const statBoxes = [
    { label: 'Nominal GDP (2024)', value: formatGDP(nominalGdp) },
    { label: 'Total Population', value: formatPopulation(population) },
    { label: 'GDP per Capita (Nominal)', value: gdpPerCapita > 0 ? formatCurrency(gdpPerCapita) : '—' },
    { label: 'Human Development (HDI)', value: hdi > 0 ? hdi.toFixed(3) : '—' },
  ];

  let boxX = margin;
  const boxWidth = (contentWidth - 9) / 4;
  const boxY = currentY;

  statBoxes.forEach(stat => {
    doc.setFillColor(245, 240, 235);
    doc.roundedRect(boxX, boxY, boxWidth, 16, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(110, 100, 90);
    doc.text(stat.label, boxX + 3, boxY + 5);

    doc.setFont('courier', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(20, 20, 20);
    doc.text(stat.value, boxX + 3, boxY + 12.5);

    boxX += boxWidth + 3;
  });

  currentY += 21;

  // Section 2: 10-Year Structural Trajectory Table (2015-2024)
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 25, 20);
  doc.text('2. Ten-Year Structural Convergence Trajectory (2015–2024)', margin, currentY + 2);
  currentY += 5;

  const years = [2015, 2017, 2019, 2021, 2023, 2024];
  const tableY = currentY;
  const colWidth = contentWidth / 7;

  // Table Header
  doc.setFillColor(235, 230, 220);
  doc.rect(margin, tableY, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(50, 45, 40);
  doc.text('Indicator Series', margin + 2, tableY + 4.5);

  years.forEach((yr, idx) => {
    doc.text(yr.toString(), margin + colWidth + (idx * colWidth) + 4, tableY + 4.5);
  });

  const rowSeries = [
    { label: 'Real GDP Growth (%)', id: 'NY.GDP.MKTP.KD.ZG', unit: '%' },
    { label: 'Inflation CPI (%)', id: 'FP.CPI.TOTL.ZG', unit: '%' },
    { label: 'Gross Govt Debt (% GDP)', id: 'GC.DOD.TOTL.GD.ZS', unit: '%' },
    { label: 'Life Expectancy (Years)', id: 'SP.DYN.LE00.IN', unit: 'y' },
    { label: 'Electricity Access (% pop)', id: 'EG.ELC.ACCS.ZS', unit: '%' }
  ];

  let currentTableRowY = tableY + 6.5;
  rowSeries.forEach((series, sIdx) => {
    if (sIdx % 2 === 1) {
      doc.setFillColor(248, 245, 240);
      doc.rect(margin, currentTableRowY, contentWidth, 6, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(50, 45, 40);
    doc.text(series.label, margin + 2, currentTableRowY + 4.2);

    years.forEach((yr, idx) => {
      const obs = atlas.getObservations(country.id, series.id).find(o => o.period === yr);
      const val = obs?.value ?? (yr === 2024 ? atlas.getIndicatorValue(country.id, series.id) : null);
      const textVal = val !== undefined && val !== null ? `${val.toFixed(1)}${series.unit}` : '—';
      doc.setFont('courier', 'normal');
      doc.text(textVal, margin + colWidth + (idx * colWidth) + 4, currentTableRowY + 4.2);
    });

    currentTableRowY += 6;
  });

  currentY = currentTableRowY + 6;

  // Section 3: Demographic & Economic Structure Brief
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 25, 20);
  doc.text('3. Macro-Historical Overview & Institutional Context', margin, currentY);
  currentY += 5;

  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 45, 40);

  const narrativeText = `${country.name} represents a key sovereign economy within ${country.region}. With a demographic base of ${formatPopulation(population)} citizens and a total domestic output of ${formatGDP(nominalGdp)}, the nation is strategically positioned across continental supply corridors. Under the African Continental Free Trade Area (AfCFTA), the country maintains bilateral trade relationships with regional peers and multilateral trading partners.`;
  const splitNarrative = doc.splitTextToSize(narrativeText, contentWidth);
  doc.text(splitNarrative, margin, currentY);

  // Page 1 Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text('Africa Data Atlas • Sovereign Intelligence Dossier • Page 1 of 2', margin, pageHeight - margin);

  // ================= PAGE 2 =================
  doc.addPage();
  doc.setFillColor(252, 250, 247);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Accent Rule
  doc.setFillColor(14, 165, 233); // Cyan accent
  doc.rect(margin, margin - 4, contentWidth, 2, 'F');

  // Header Title
  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 53, 15);
  doc.text('AFRICA DATA ATLAS • TRADE, CRITICAL MINERALS & HERITAGE PROFILE', margin, margin + 2);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);
  doc.text(`ISO-3: ${country.id} • Page 2 of 2`, pageWidth - margin - 40, margin + 2);

  // Section 4: Critical Minerals & Energy Transition
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 25, 20);
  doc.text('4. Strategic Critical Minerals & Beneficiation Status', margin, margin + 14);

  if (mineralsProfile && mineralsProfile.keyMinerals.length > 0) {
    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 55, 50);
    const summaryLines = doc.splitTextToSize(mineralsProfile.summary, contentWidth);
    doc.text(summaryLines, margin, margin + 20);

    let mineralY = margin + 22 + (summaryLines.length * 4);
    mineralsProfile.keyMinerals.slice(0, 3).forEach(mineral => {
      doc.setFillColor(242, 238, 232);
      doc.roundedRect(margin, mineralY, contentWidth, 12, 1, 1, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(20, 20, 20);
      doc.text(`${mineral.mineral} (${mineral.chemicalSymbol}) — ${mineral.category}`, margin + 3, mineralY + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 90, 80);
      const appText = `Application: ${mineral.strategicApplication} • Status: ${mineral.refiningStatus}`;
      doc.text(doc.splitTextToSize(appText, contentWidth - 6)[0], margin + 3, mineralY + 9.5);

      mineralY += 14;
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text('National minerals profile under indexing or non-primary mineral exporter.', margin, margin + 20);
  }

  // Section 5: AfCFTA Trade Corridors & Partners
  const tradeY = margin + 74;
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 25, 20);
  doc.text('5. AfCFTA Continental Trade Profile & Top Partners', margin, tradeY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 55, 50);
  doc.text(`Intra-African Trade Share: ${tradeProfile.intraAfricanSharePct}% • Corridor Integration: ${tradeProfile.afcftaCorridorNote}`, margin, tradeY + 6);

  let partnerY = tradeY + 12;
  tradeProfile.topPartners.slice(0, 3).forEach(p => {
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    doc.text(`• ${p.name} (${p.role}): ${p.sharePct}% of total trade volume`, margin + 3, partnerY);
    partnerY += 5;
  });

  // Section 6: UNESCO Cultural & Natural Heritage
  const unescoY = partnerY + 6;
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 25, 20);
  doc.text('6. Designated UNESCO World Heritage Sites', margin, unescoY);

  if (heritageSites.length > 0) {
    let siteY = unescoY + 6;
    heritageSites.slice(0, 4).forEach(site => {
      doc.setFont('times', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(120, 53, 15);
      doc.text(`• ${site.site} (${site.dateInscribed})`, margin + 2, siteY);

      doc.setFont('times', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(60, 60, 60);
      const siteDesc = site.shortDescription || site.criteriaTxt || '';
      const descLine = doc.splitTextToSize(siteDesc, contentWidth - 10)[0] || '';
      doc.text(descLine, margin + 6, siteY + 4);
      siteY += 9;
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text('No current UNESCO World Heritage Sites inscribed in official catalog.', margin, unescoY + 6);
  }

  // Section 7: Epistemic Provenance & Scholarly Citation
  const provenanceY = pageHeight - margin - 30;
  doc.setDrawColor(210, 200, 190);
  doc.setLineWidth(0.3);
  doc.line(margin, provenanceY, pageWidth - margin, provenanceY);

  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 50, 20);
  doc.text('Methodological Provenance & Citation Standards', margin, provenanceY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(90, 90, 90);
  doc.text('Compiled from World Bank World Development Indicators (WDI), UNESCO World Heritage Centre, USGS Mineral Commodity Summaries, and the UN Comtrade database. Cryptographically anchored under DOI: 10.6084/m9.figshare.34065711.', margin, provenanceY + 9, { maxWidth: contentWidth });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('Dual License: MIT (Code) & Open Data Commons Attribution License (ODC-By v1.0) (Data).', margin, provenanceY + 17);

  // Page 2 Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text('Africa Data Atlas • Sovereign Intelligence Dossier • Page 2 of 2', margin, pageHeight - margin);

  const cleanFilename = `${country.id}_${country.name.replace(/[^a-zA-Z0-9]/g, '_')}_Intelligence_Dossier.pdf`;
  doc.save(cleanFilename);
};

/**
 * Compiles a bespoke Multi-Asset Academic Research Dossier PDF from saved entities & historical plates,
 * embedding authentic SVG country silhouettes and high-resolution antique map plate scans.
 */
export const exportCustomBriefingDossierPDF = async (
  savedCountryIds: string[],
  savedPlateIds: string[]
): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  const { atlas } = await import('../data/atlas-store');
  const { HISTORICAL_MAP_PLATES } = await import('../data/archivalCartographyData');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(30, 27, 24);
  doc.rect(margin, margin, contentWidth, 24, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('AFRIATA: AFRICA DATA ATLAS', margin + 6, margin + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(210, 195, 175);
  doc.text('CUSTOM SCHOLARLY BRIEFING DOSSIER & COMPILATION NOTEBOOK', margin + 6, margin + 17);

  let currentY = margin + 32;

  // Executive Summary of Bookmarked Assets
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(40, 30, 20);
  doc.text('1. Executive Compilation Roster', margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text(
    `This briefing synthesizes ${savedCountryIds.length} sovereign territorial profile(s) and ${savedPlateIds.length} archival cartographic plate(s) into an integrated research notebook.`,
    margin,
    currentY,
    { maxWidth: contentWidth }
  );
  currentY += 10;

  // Bookmarked Sovereign Countries Table (with embedded authentic SVG silhouettes)
  if (savedCountryIds.length > 0) {
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 90, 60);
    doc.text('2. Sovereign Territorial Syntheses', margin, currentY);
    currentY += 6;

    for (let idx = 0; idx < savedCountryIds.length; idx++) {
      const id = savedCountryIds[idx];
      const entity = atlas.getEntity(id);
      if (!entity) continue;

      if (currentY > pageHeight - 35) {
        doc.addPage();
        doc.setFillColor(250, 248, 245);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        currentY = margin + 10;
      }

      const cardH = 24;
      doc.setFillColor(248, 246, 242);
      doc.roundedRect(margin, currentY, contentWidth, cardH, 2, 2, 'F');
      doc.setDrawColor(220, 215, 205);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, currentY, contentWidth, cardH, 2, 2, 'S');

      // Embed authentic SVG Silhouette on the right side of the card
      try {
        const silData = await renderCountrySilhouetteToCanvas(id, 80, 80);
        if (silData) {
          doc.addImage(silData.dataUrl, 'PNG', margin + contentWidth - 25, currentY + 2, 20, 20);
        }
      } catch {
        // Continue if silhouette fails
      }

      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(20, 20, 20);
      doc.text(`${idx + 1}. ${entity.name} (${entity.id}) — ${entity.region}`, margin + 3, currentY + 6);

      const pop = atlas.getIndicatorValue(id, 'SP.POP.TOTL');
      const gdp = atlas.getIndicatorValue(id, 'NY.GDP.MKTP.CD');
      const hdi = atlas.getIndicatorValue(id, 'UNDP.HDI.INDEX');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(80, 80, 80);
      const popTxt = pop ? `${(pop / 1_000_000).toFixed(1)}M` : '—';
      const gdpTxt = gdp ? `$${(gdp / 1_000_000_000).toFixed(1)}B` : '—';
      const hdiTxt = hdi ? hdi.toFixed(3) : '—';
      doc.text(`Capital: ${entity.capital} • Population: ${popTxt} • Nominal GDP: ${gdpTxt} • HDI: ${hdiTxt}`, margin + 3, currentY + 12);

      const official = entity.officialName ? `Official: ${entity.officialName}` : '';
      const blocs = entity.blocs?.length ? ` • Blocs: ${entity.blocs.join(', ')}` : '';
      doc.text(doc.splitTextToSize(`${official}${blocs}`, contentWidth - 30)[0] || '', margin + 3, currentY + 18);

      currentY += cardH + 4;
    }
    currentY += 4;
  }

  // Bookmarked Cartographic Plates (with embedded antique map scans)
  if (savedPlateIds.length > 0) {
    if (currentY > pageHeight - 45) {
      doc.addPage();
      doc.setFillColor(250, 248, 245);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      currentY = margin + 10;
    }

    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(140, 70, 20);
    doc.text('3. Curated Archival Cartographic Plates', margin, currentY);
    currentY += 6;

    for (let pIdx = 0; pIdx < savedPlateIds.length; pIdx++) {
      const pId = savedPlateIds[pIdx];
      const plate = HISTORICAL_MAP_PLATES.find(p => p.id === pId);
      if (!plate) continue;

      const cardH = 34;
      if (currentY + cardH > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(250, 248, 245);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        currentY = margin + 10;
      }

      doc.setFillColor(254, 252, 246);
      doc.roundedRect(margin, currentY, contentWidth, cardH, 2, 2, 'F');
      doc.setDrawColor(230, 215, 195);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, currentY, contentWidth, cardH, 2, 2, 'S');

      // Embed high-DPI antique plate thumbnail on the left
      let textOffsetLeft = margin + 4;
      try {
        const plateCandidates = [plate.thumbnailUrl, plate.imageUrl, ...(plate.fallbackUrls || [])];
        const plateImg = await loadImageAsDataUrl(plateCandidates, 'JPEG');
        if (plateImg) {
          const thumbW = 38;
          const thumbH = Math.min(28, thumbW / plateImg.aspectRatio);
          const thumbX = margin + 3;
          const thumbY = currentY + (cardH - thumbH) / 2;

          doc.setDrawColor(200, 185, 170);
          doc.setLineWidth(0.3);
          doc.rect(thumbX - 0.5, thumbY - 0.5, thumbW + 1, thumbH + 1);
          doc.addImage(plateImg.dataUrl, plateImg.format, thumbX, thumbY, thumbW, thumbH);
          textOffsetLeft = margin + thumbW + 8;
        }
      } catch {
        // Continue if plate image load fails
      }

      const availableTextWidth = contentWidth - (textOffsetLeft - margin) - 4;

      doc.setFont('times', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 20, 10);
      doc.text(`Plate ${pIdx + 1}: ${plate.shortTitle || plate.title} (${plate.year})`, textOffsetLeft, currentY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(80, 70, 60);
      doc.text(`Cartographer: ${plate.cartographer} • Century: ${plate.century} • Institution: ${plate.institution}`, textOffsetLeft, currentY + 12);

      const desc = doc.splitTextToSize(plate.description, availableTextWidth);
      doc.text(desc.slice(0, 2), textOffsetLeft, currentY + 18);

      if (plate.toponymsToObserve && plate.toponymsToObserve.length > 0) {
        doc.setFont('courier', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(120, 80, 40);
        doc.text(`Toponyms: ${plate.toponymsToObserve.slice(0, 4).join(' • ')}`, textOffsetLeft, currentY + 28);
      }

      currentY += cardH + 4;
    }
  }

  // Footer & Provenance Signoff
  doc.setDrawColor(210, 205, 195);
  doc.setLineWidth(0.2);
  doc.line(margin, pageHeight - margin - 10, pageWidth - margin, pageHeight - margin - 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 115, 110);
  doc.text('Afriata Cartographic Observatory & Research Repository • DOI: 10.6084/m9.figshare.34065711 • CC BY 4.0', margin, pageHeight - margin - 5);

  doc.save('Afriata_Briefing_Dossier_Compilation.pdf');
};


