import React from 'react';
import { X, ShieldCheck, Download, Printer, CheckCircle2, FileText, QrCode, Lock, Building, Scale } from 'lucide-react';

interface SampleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SampleReportModal: React.FC<SampleReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative max-w-4xl w-full bg-white rounded-3xl border-2 border-sky-300 shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-sky-400/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-400 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-teal-500/30 text-teal-300 border border-teal-400/40 px-2 py-0.5 rounded">
                  CERTIFIED DUE DILIGENCE AUDIT
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline">• Audit Ref: TN-AUDIT-2026-94827</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                Official Property Due Diligence Certificate
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Styled like a high-end official legal report) */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar bg-slate-50/50">
          {/* Certificate Header Banner */}
          <div className="bg-white p-6 rounded-2xl border-2 border-sky-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100/40 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xl font-black text-slate-900 tracking-tight block">
                  PLOTCHECK LEGAL DUE DILIGENCE REPORT
                </span>
                <span className="text-xs font-bold text-sky-700 block">
                  Tamil Nadu Real Estate Regulatory & Statutory Audit Standard
                </span>
              </div>

              {/* Status Seal */}
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border-2 border-emerald-300 px-3 py-1.5 rounded-xl font-black text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% CLEAR TITLE (GRADE A+)</span>
              </div>
            </div>

            {/* Target Property Summary Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">District & Taluk</span>
                <span className="font-extrabold text-slate-900 text-sm">Coimbatore / Pollachi</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Revenue Village / SRO</span>
                <span className="font-extrabold text-slate-900 text-sm">Vellakovil / Udumalpet</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Survey & Sub-Div No</span>
                <span className="font-extrabold text-slate-900 text-sm">Survey 129/2 (Patta 4487)</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Extent & Classification</span>
                <span className="font-extrabold text-slate-900 text-sm">1.42.0 Hectares (Ryotwari)</span>
              </div>
            </div>
          </div>

          {/* 4 Statutory Audit Verification Checkpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-sky-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  1. Section 22-A Prohibited Check
                </span>
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  CLEAR
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Zero entries in HR&CE Hindu Religious Temple Inam registers or Tamil Nadu Waqf Board Act 1995 holdings. Free for conveyance.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-sky-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  2. CERSAI Banking Mortgage Scan
                </span>
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  UNENCUMBERED
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                No registered equitable mortgages or banking charges found on this survey number across Central Registry data.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-sky-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  3. 30-Year Chain of Title (EC)
                </span>
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Unbroken ownership chain verified from Doc No. 412/1994 (Partition Deed) $\rightarrow$ Doc No. 1829/2012 (Sale Deed) $\rightarrow$ Doc No. 2045/2021.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-sky-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-sky-600" />
                  4. Valuation & Stamp Duty
                </span>
                <span className="text-[10px] font-black uppercase bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                  2024 PWD RATES
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Official Guideline: ₹3,200/sq.ft. Statutory Stamp Duty: 7% (₹8,96,000) + Registration Fee: 2% (₹2,56,000). Total Outlay: ₹11,52,000.
              </p>
            </div>
          </div>

          {/* Certificate Legal Signoff Footer */}
          <div className="bg-white p-5 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-xs">
                QR CODE
              </div>
              <div>
                <span className="font-extrabold text-slate-900 block">Tamper-Proof Verification Token</span>
                <span className="text-slate-400 font-mono text-[10px]">HASH: 8f4a9b2c3d1e7048a62f8372091c5e4a</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-black text-slate-900 block uppercase">
                PLOTCHECK LEGAL TECH BOARD
              </span>
              <span className="text-[10px] text-slate-500 font-bold">
                Advocate Verification Registry • Bar Council TN
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-sky-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            This is a sample reference report generated by PLOTCHECK automated due-diligence pipeline.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-sky-600 text-white text-xs font-black rounded-xl transition-colors shadow-sm"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
