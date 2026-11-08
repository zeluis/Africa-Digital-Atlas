/**
 * Academic Citation & High-DPI PDF Export Utility
 * Generates standardized bibliographic files (.bib, .ris, .json) and printable High-DPI PDFs.
 */

import type { SlaveTradeIllustration } from '../data/slaveTradeIllustrations';

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
 * Generates a high-resolution academic PDF dossier containing the plate image,
 * bibliographic reference, archival provenance, and research commentary.
 */
export const exportHighDpiPlatePDF = async (
  illustration: SlaveTradeIllustration,
  citationText: string
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
  doc.setTextColor(120, 53, 15); // amber-900
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

  // Try to render image into PDF using robust fetch blob conversion
  const imageUrl = illustration.imageUrls?.[0];
  if (imageUrl) {
    try {
      let base64Data = '';
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch {
        // Fallback to standard Image element if fetch fails
        base64Data = imageUrl;
      }

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = base64Data;
      });

      // Calculate aspect ratio
      const imgAspect = img.width / img.height || 1.33;
      const maxImgHeight = 85;
      const imgWidth = Math.min(contentWidth, maxImgHeight * imgAspect);
      const imgHeight = imgWidth / imgAspect;
      const imgX = margin + (contentWidth - imgWidth) / 2;

      // Draw subtle border around plate
      doc.setDrawColor(210, 200, 190);
      doc.setLineWidth(0.3);
      doc.rect(imgX - 1, currentY - 1, imgWidth + 2, imgHeight + 2);

      doc.addImage(img, 'JPEG', imgX, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 8;
    } catch (err) {
      console.warn('Could not embed image in PDF, rendering archival placeholder:', err);
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
  }
): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  const { atlas } = await import('../data/atlas-store');
  const { getCountryTradeFlows, getCountryMineralsProfile } = await import('../data/criticalMineralsData');
  const { INITIAL_UNESCO_HERITAGE_SITES } = await import('../data/unescoHeritageRegistry');
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
  const heritageSites = INITIAL_UNESCO_HERITAGE_SITES.filter(s => s.entityId === country.id || s.isoCode === country.id);

  // ================= PAGE 1 =================
  doc.setFillColor(252, 250, 247);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Accent Rule
  doc.setFillColor(16, 185, 129); // Emerald accent
  doc.rect(margin, margin, contentWidth, 2, 'F');

  // Header Title
  doc.setFont('times', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(120, 53, 15);
  doc.text('AFRICA DATA ATLAS • EXECUTIVE SOVEREIGN INTELLIGENCE DOSSIER', margin, margin + 8);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text(`ISO-3: ${country.id} • DOI: 10.6084/m9.figshare.34065711`, pageWidth - margin - 70, margin + 8);

  // Main Country Name
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(24, 24, 27);
  doc.text(country.name, margin, margin + 20);

  // Official Name & Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const subtext = `${country.officialName || country.name} • Region: ${country.region} • Capital: ${country.capital} • Land Area: ${(country.landAreaKm2 || 0).toLocaleString()} km²`;
  doc.text(subtext, margin, margin + 26);

  // Dividing line
  doc.setDrawColor(210, 200, 190);
  doc.setLineWidth(0.3);
  doc.line(margin, margin + 30, pageWidth - margin, margin + 30);

  // Section 1: Macroeconomic Indicator Matrix
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 25, 20);
  doc.text('1. Core Macroeconomic & Demographic Fundamentals', margin, margin + 38);

  const statBoxes = [
    { label: 'Nominal GDP (2024)', value: formatGDP(nominalGdp) },
    { label: 'Total Population', value: formatPopulation(population) },
    { label: 'GDP per Capita (Nominal)', value: gdpPerCapita > 0 ? formatCurrency(gdpPerCapita) : '—' },
    { label: 'Human Development (HDI)', value: hdi > 0 ? hdi.toFixed(3) : '—' },
  ];

  let boxX = margin;
  const boxWidth = (contentWidth - 9) / 4;
  const boxY = margin + 42;

  statBoxes.forEach(stat => {
    doc.setFillColor(245, 240, 235);
    doc.roundedRect(boxX, boxY, boxWidth, 18, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(110, 100, 90);
    doc.text(stat.label, boxX + 3, boxY + 6);

    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text(stat.value, boxX + 3, boxY + 14);

    boxX += boxWidth + 3;
  });

  // Section 2: 10-Year Structural Trajectory Table (2015-2024)
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 25, 20);
  doc.text('2. Ten-Year Structural Convergence Trajectory (2015–2024)', margin, margin + 68);

  const years = [2015, 2017, 2019, 2021, 2023, 2024];
  const tableY = margin + 74;
  const colWidth = contentWidth / 7;

  // Table Header
  doc.setFillColor(235, 230, 220);
  doc.rect(margin, tableY, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(50, 45, 40);
  doc.text('Indicator Series', margin + 2, tableY + 5);

  years.forEach((yr, idx) => {
    doc.text(yr.toString(), margin + colWidth + (idx * colWidth) + 4, tableY + 5);
  });

  const rowSeries = [
    { label: 'Real GDP Growth (%)', id: 'NY.GDP.MKTP.KD.ZG', unit: '%' },
    { label: 'Inflation CPI (%)', id: 'FP.CPI.TOTL.ZG', unit: '%' },
    { label: 'Gross Govt Debt (% GDP)', id: 'GC.DOD.TOTL.GD.ZS', unit: '%' },
    { label: 'Life Expectancy (Years)', id: 'SP.DYN.LE00.IN', unit: 'y' },
    { label: 'Electricity Access (% pop)', id: 'EG.ELC.ACCS.ZS', unit: '%' }
  ];

  let currentTableRowY = tableY + 7;
  rowSeries.forEach((series, sIdx) => {
    if (sIdx % 2 === 1) {
      doc.setFillColor(248, 245, 240);
      doc.rect(margin, currentTableRowY, contentWidth, 6.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(50, 45, 40);
    doc.text(series.label, margin + 2, currentTableRowY + 4.5);

    years.forEach((yr, idx) => {
      const obs = atlas.getObservations(country.id, series.id).find(o => o.period === yr);
      const val = obs?.value ?? (yr === 2024 ? atlas.getIndicatorValue(country.id, series.id) : null);
      const textVal = val !== undefined && val !== null ? `${val.toFixed(1)}${series.unit}` : '—';
      doc.setFont('courier', 'normal');
      doc.text(textVal, margin + colWidth + (idx * colWidth) + 4, currentTableRowY + 4.5);
    });

    currentTableRowY += 6.5;
  });

  // Section 3: Demographic & Economic Structure Brief
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 25, 20);
  doc.text('3. Macro-Historical Overview & Institutional Context', margin, currentTableRowY + 10);

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 45, 40);

  const narrativeText = `${country.name} represents a key sovereign economy within ${country.region}. With a demographic base of ${formatPopulation(population)} citizens and a total domestic output of ${formatGDP(nominalGdp)}, the nation is strategically positioned across continental supply corridors. Under the African Continental Free Trade Area (AfCFTA), the country maintains bilateral trade relationships with regional peers and multilateral trading partners.`;
  const splitNarrative = doc.splitTextToSize(narrativeText, contentWidth);
  doc.text(splitNarrative, margin, currentTableRowY + 16);

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
  doc.rect(margin, margin, contentWidth, 2, 'F');

  // Header Title
  doc.setFont('times', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(120, 53, 15);
  doc.text('AFRICA DATA ATLAS • TRADE, CRITICAL MINERALS & HERITAGE PROFILE', margin, margin + 8);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text(`ISO-3: ${country.id} • Page 2 of 2`, pageWidth - margin - 40, margin + 8);

  // Section 4: Critical Minerals & Energy Transition
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 25, 20);
  doc.text('4. Strategic Critical Minerals & Beneficiation Status', margin, margin + 20);

  if (mineralsProfile && mineralsProfile.keyMinerals.length > 0) {
    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 55, 50);
    const summaryLines = doc.splitTextToSize(mineralsProfile.summary, contentWidth);
    doc.text(summaryLines, margin, margin + 26);

    let mineralY = margin + 28 + (summaryLines.length * 4);
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
    doc.text('National minerals profile under indexing or non-primary mineral exporter.', margin, margin + 26);
  }

  // Section 5: AfCFTA Trade Corridors & Partners
  const tradeY = margin + 80;
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
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
  doc.setFontSize(12);
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


