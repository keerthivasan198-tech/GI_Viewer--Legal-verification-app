import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ShieldCheck } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Section 22-A of the Registration Act, and why is it critical in Tamil Nadu?',
      a: 'Section 22-A of the Registration Act, 1908 prohibits the registration of documents relating to properties belonging to religious institutions (HR&CE Temples, Waqf Boards), government Bhoodan lands, or unapproved layouts. If you purchase such land, Sub-Registrars will reject registration or declare the deed null and void. PLOTCHECK automatically screens all survey numbers against official Section 22-A datasets.'
    },
    {
      q: 'How many years of Encumbrance Certificate (EC) history should I verify before buying?',
      a: 'A minimum of 30 years (or back to the parent title deed of 1980/1990) must be checked to establish an unbroken chain of title and ensure there are no uncancelled mortgages, court attachments, or partition disputes recorded in the Sub-Registrar Office ledger.'
    },
    {
      q: 'Why must I check CERSAI in addition to the Sub-Registrar Office EC?',
      a: 'In India, equitable mortgages (loans against deposit of title deeds) are often recorded on the Central Banking CERSAI registry before being filed at local Sub-Registrars. Checking CERSAI uncovers undisclosed housing loans or double-mortgages that may not immediately appear on local SRO certificates.'
    },
    {
      q: 'How is Stamp Duty and Registration Fee calculated in Tamil Nadu for 2024–2025?',
      a: 'For property conveyance/sale deeds, the Government of Tamil Nadu levies 7% Stamp Duty and 2% Registration Fee on either the official Guideline Value or Market Consideration (whichever is higher). PLOTCHECK calculates this outlay down to the exact rupee based on the latest 2024 revision.'
    },
    {
      q: 'What is the difference between Nanjai, Punjai, and Natham land classifications?',
      a: 'Nanjai refers to wet/irrigated agricultural land, Punjai to dry land, and Natham (Grama Natham) to residential settlement land historically designated for housing. PLOTCHECK extracts the exact revenue classification from digital Patta and FMB records.'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border-2 border-sky-200/90 p-6 sm:p-8 md:p-10 shadow-lg shadow-sky-100/50 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-black uppercase tracking-wider border border-sky-300">
          <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
          <span>REAL ESTATE LEGAL KNOWLEDGE BASE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Frequently Asked Legal & Verification Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Key statutory legalities every property buyer and investor must know before transacting in Tamil Nadu.
        </p>
      </div>

      <div className="space-y-3 max-w-3xl mx-auto pt-2">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen ? 'bg-sky-50/70 border-sky-300 shadow-sm' : 'bg-white border-sky-200 hover:border-sky-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
              >
                <span className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                  {faq.q}
                </span>
                <span className="p-1 rounded-lg bg-sky-100/80 text-sky-800 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-sky-200/50 pt-3 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
