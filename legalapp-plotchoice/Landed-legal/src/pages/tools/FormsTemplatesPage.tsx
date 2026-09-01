import React, { useState } from 'react';
import { ToolLayout } from '../../components/layout/ToolLayout';
import { ToolCard } from '../../components/layout/ToolCard';
import { TextInput } from '../../components/ui/TextInput';
import { FORM_DOCUMENTS } from '../../data/formsData';
import { ENGLISH_DEED_TEMPLATES, TAMIL_DEED_TEMPLATES } from '../../data/deedTemplates';
import { FormCategory, FormDocument } from '../../types';
import { downloadAsDocx } from '../../utils/docxExporter';
import { FileText, Download, Search, Info, FileCode } from 'lucide-react';
import { ToolInfographicHero } from '../../components/ui/ToolInfographicHero';

export const FormsTemplatesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FormCategory | 'all'>('all');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Filter documents dynamically
  const filteredDocuments = FORM_DOCUMENTS.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'all' ? true : doc.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  /**
   * Generates and downloads native MS Word (.docx) documents.
   */
  const handleDownloadDocx = async (doc: FormDocument, language?: 'English' | 'Tamil') => {
    let textContent = '';
    if (language === 'Tamil' && TAMIL_DEED_TEMPLATES[doc.id]) {
      textContent = TAMIL_DEED_TEMPLATES[doc.id];
    } else if (ENGLISH_DEED_TEMPLATES[doc.id]) {
      textContent = ENGLISH_DEED_TEMPLATES[doc.id];
    } else {
      textContent = `${doc.title.toUpperCase()}\n${'='.repeat(doc.title.length)}\n\nDocument Type: ${doc.documentType}\nCategory: ${doc.category}\n\nDescription:\n${doc.description}\n\n[ Official Format Template ]`;
    }

    const langNotice = language ? ` (${language})` : '';
    setDownloadNotice(`Generating Microsoft Word document${langNotice}...`);

    try {
      await downloadAsDocx(doc.title, textContent, language);
      setDownloadNotice(`Downloaded "${doc.title}" as Microsoft Word (.docx) file!`);
    } catch (err) {
      console.error('Error generating docx:', err);
      setDownloadNotice(`Failed to generate Word document for ${doc.title}.`);
    }

    setTimeout(() => {
      setDownloadNotice(null);
    }, 4000);
  };

  /**
   * Directly downloads the uploaded PDF file to the user's computer.
   * If the PDF file is missing, displays "PDF not available" without generating any replacement.
   */
  const handleDownloadPdf = async (doc: FormDocument) => {
    const targetPdfUrl = doc.pdfUrl || `/pdfs/${doc.id}.pdf`;
    const safeTitle = doc.title.replace(/[^a-zA-Z0-9_\-]/g, '_');

    setDownloadNotice(`Downloading "${doc.title}" PDF...`);

    try {
      const res = await fetch(targetPdfUrl);
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('pdf') || !contentType.includes('html')) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${safeTitle}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => URL.revokeObjectURL(url), 2000);
          setDownloadNotice(`Downloaded "${doc.title}" PDF file!`);
          return;
        }
      }
    } catch (err) {
      console.error('Error downloading PDF:', err);
    }

    // Strictly show "PDF not available" notice without generating replacement
    setDownloadNotice('PDF not available');
    setTimeout(() => {
      setDownloadNotice(null);
    }, 4000);
  };

  const categories = [
    { key: 'all', label: 'All Formats', count: FORM_DOCUMENTS.length },
    { key: 'draft-deed', label: 'Draft Deeds', count: FORM_DOCUMENTS.filter((d) => d.category === 'draft-deed').length },
    { key: 'other-form', label: 'Other Forms', count: FORM_DOCUMENTS.filter((d) => d.category === 'other-form').length },
    { key: 'cmda-form', label: 'CMDA Forms', count: FORM_DOCUMENTS.filter((d) => d.category === 'cmda-form').length }
  ];

  return (
    <ToolLayout
      title="Forms & Document Format Templates"
      subtitle="Access property registration, draft deed, and CMDA forms in one place."
      breadcrumbToolName="Forms & Format Templates"
    >
      <div className="space-y-6">
        {/* Animated Front Infographic Hero */}
        <ToolInfographicHero
          imageSrc="/images/tools/forms_templates_infographic.jpg"
          badgeText="LEGAL DEED AUTOMATION"
          title="Legal Deed & Property Document Generator"
          subtitle="Generate structured legal draft deeds, conveyance agreements, power of attorney, and lease agreements with customized property schedules."
          highlights={[
            "Includes Absolute Sale Deed, Agreement to Sell, Lease Deed & General Power of Attorney (GPA)",
            "Automatic embedding of Party details, consideration amounts, and Schedule of Property",
            "Direct export in editable Microsoft Word (.docx) and high-resolution PDF format"
          ]}
        />

        <ToolCard>
          {/* Search Bar & Category Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Search Input */}
            <div className="w-full md:w-80">
              <TextInput
                icon={<Search className="w-4 h-4 text-slate-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search forms and documents..."
                aria-label="Search forms and documents"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key as FormCategory | 'all')}
                    aria-label={`Filter by ${cat.label}`}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Download Notification / PDF Status Banner */}
          {downloadNotice && (
            <div
              className={`mb-6 p-4 rounded-xl text-xs flex items-center justify-between gap-2 shadow-sm animate-fadeIn ${
                downloadNotice === 'PDF not available'
                  ? 'bg-red-50 border border-red-200 text-red-950 font-bold'
                  : 'bg-blue-50 border border-blue-200 text-blue-950 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2">
                <Info
                  className={`w-4 h-4 flex-shrink-0 ${
                    downloadNotice === 'PDF not available' ? 'text-red-600' : 'text-blue-600'
                  }`}
                />
                <span>{downloadNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setDownloadNotice(null)}
                className={`font-bold text-xs ${
                  downloadNotice === 'PDF not available'
                    ? 'text-red-800 hover:text-red-950'
                    : 'text-blue-800 hover:text-blue-950'
                }`}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Matching Count Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-6 pb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-600">Showing {filteredDocuments.length} matching document templates</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Responsive 3-Column Document Grid */}
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="group bg-white/95 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/80 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Header Badges & Icon */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100/70 border border-blue-200/60 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <FileText className="w-5 h-5" />
                      </div>

                      {doc.category === 'cmda-form' ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-0.5 rounded-md">
                          CMDA Form
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-md">
                          {doc.documentType}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2 line-clamp-2">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                      {doc.description}
                    </p>
                  </div>

                  {/* Actions Area */}
                  <div className="pt-4 border-t border-slate-100 mt-2">
                    {doc.category === 'draft-deed' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadDocx(doc, 'English')}
                          aria-label={`Download ${doc.title} MS Word English document`}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>English (.docx)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadDocx(doc, 'Tamil')}
                          aria-label={`Download ${doc.title} MS Word Tamil document`}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/90 rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-600" />
                          <span>தமிழ் (.docx)</span>
                        </button>
                      </div>
                    ) : doc.category === 'cmda-form' ? (
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(doc)}
                        aria-label={`Download ${doc.title} PDF document`}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/15 transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-100" />
                        <span>Download PDF</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDownloadDocx(doc)}
                        aria-label={`Download ${doc.title} MS Word document`}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Word (.docx)</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center bg-slate-50 border border-slate-200/90 rounded-2xl">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">
                {searchQuery ? 'No documents found' : 'No documents available in this category'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? `No formats matched your search "${searchQuery}". Try searching another keyword.`
                  : 'Select another category tab to view document templates.'}
              </p>
            </div>
          )}

          {/* Bottom Legal Disclaimer */}
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200/70 rounded-xl text-center">
            <p className="text-xs text-slate-500 italic">
              Document formats are available as editable Microsoft Word (.docx) files or official PDF download documents for reference. Verify the latest applicable format with the relevant authority before submission.
            </p>
          </div>
        </ToolCard>
      </div>
    </ToolLayout>
  );
};
