/**
 * Academic Citation & High-DPI PDF Export Utility
 * Generates standardized bibliographic files (.bib, .ris, .json) and printable High-DPI PDFs.
 */

import { jsPDF } from 'jspdf';
import { SlaveTradeIllustration } from '../data/slaveTradeIllustrations';

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

  // Try to render image into PDF
  const imageUrl = illustration.imageUrls?.[0];
  if (imageUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = imageUrl;
      });

      // Calculate aspect ratio
      const imgAspect = img.width / img.height;
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
    } catch {
      // Fallback if CORS prevents canvas export
      doc.setDrawColor(200, 180, 160);
      doc.setFillColor(245, 240, 230);
      doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'FD');
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(120, 100, 80);
      doc.text(`[Archival Plate: ${illustration.title} - High-Res Image preserved at external repository]`, margin + 4, currentY + 11);
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
