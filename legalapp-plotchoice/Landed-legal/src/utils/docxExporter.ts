import { Document, Packer, Paragraph, TextRun } from 'docx';

/**
 * Generates and triggers browser download of a native Microsoft Word (.docx) file.
 */
export const downloadAsDocx = async (title: string, content: string, language?: 'English' | 'Tamil') => {
  const lines = content.split('\n');
  const paragraphs = lines.map((line) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: line,
          font: 'Calibri',
          size: 22, // 11pt font
        }),
      ],
      spacing: {
        after: 120, // 6pt spacing after paragraphs
      },
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeTitle = title.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const fileName = language ? `${safeTitle}-${language}.docx` : `${safeTitle}.docx`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1500);
};
