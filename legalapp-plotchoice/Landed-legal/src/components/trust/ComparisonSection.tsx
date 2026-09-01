import React from 'react';
import { Check, X, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisonItems = [
    {
      feature: 'Verification Turnaround Time',
      plotcheck: '30 Seconds (Instant Automated Query)',
      traditional: '15 - 25 Days (Physical SRO Visits)',
      winner: true
    },
    {
      feature: 'Section 22-A Temple/Waqf Prohibited Screening',
      plotcheck: '100% Automated State Database Cross-Check',
      traditional: 'Often Missed (High Risk of Registration Rejection)',
      winner: true
    },
    {
      feature: 'CERSAI Bank Mortgage & Lien Check',
      plotcheck: 'Integrated Central Banking Registry Search',
      traditional: 'Not Available in Local Sub-Registrar Records',
      winner: true
    },
    {
      feature: '30-Year Encumbrance Chain (EC)',
      plotcheck: 'Instant Digital PDF Ledger with Doc Nos',
      traditional: 'Manual Inspection & Paper Search Delays',
      winner: true
    },
    {
      feature: 'PWD Plinth Valuation & Depreciation Matrix',
      plotcheck: 'Official PWD Formula Computed in Real-Time',
      traditional: 'Requires Costly Private Engineer Valuation',
      winner: true
    },
    {
      feature: 'Cost & Accessibility',
      plotcheck: 'Free / ₹499 Instant Certified Audit',
      traditional: '₹15,000 to ₹35,000 Legal Retainer Fees',
      winner: true
    }
  ];

  return (
    <div className="bg-white rounded-3xl border-2 border-sky-200/90 p-6 sm:p-8 md:p-10 shadow-lg shadow-sky-100/50 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[11px] font-black uppercase tracking-widest text-sky-700 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
          PROVEN RELIABILITY & EFFICIENCY
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Why Institutional Buyers Choose PLOTCHECK
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Eliminate weeks of bureaucratic delays, hidden legal charges, and Section 22-A registry rejections.
        </p>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b-2 border-sky-200">
              <th className="py-3.5 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Feature / Benchmark</th>
              <th className="py-3.5 px-4 text-xs font-black text-sky-800 uppercase tracking-wider bg-sky-50/80 rounded-t-xl">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>PLOTCHECK Platform</span>
                </div>
              </th>
              <th className="py-3.5 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">Traditional Manual Process</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {comparisonItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-sky-50/40 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900">{item.feature}</td>
                <td className="py-4 px-4 font-extrabold text-sky-900 bg-sky-50/50">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item.plotcheck}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{item.traditional}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
