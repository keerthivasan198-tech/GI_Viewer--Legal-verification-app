import { jsPDF } from 'jspdf';

/**
 * Generates and triggers browser download of a clean PDF document.
 */
export const downloadAsPdf = (title: string, content: string, language?: 'English' | 'Tamil') => {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxLineWidth = pageWidth - margin * 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const lines = content.split('\n');
  let cursorY = 20;
  const lineHeight = 6;

  lines.forEach((rawLine) => {
    // If the line is blank, add paragraph spacing
    if (rawLine.trim() === '') {
      cursorY += 3;
      return;
    }

    // Wrap text to fit page width
    const wrappedLines = doc.splitTextToSize(rawLine, maxLineWidth);

    wrappedLines.forEach((lineText: string) => {
      if (cursorY + lineHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(lineText, margin, cursorY);
      cursorY += lineHeight;
    });
  });

  const safeTitle = title.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const fileName = language ? `${safeTitle}-${language}.pdf` : `${safeTitle}.pdf`;
  doc.save(fileName);
};
