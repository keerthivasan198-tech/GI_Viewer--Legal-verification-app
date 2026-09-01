import React from 'react';
import { ShieldCheck, Lock, Award, Landmark, Scale, CheckCircle2, ShieldAlert } from 'lucide-react';

export const TrustCertifications: React.FC = () => {
  const trustPoints = [
    {
      icon: <Landmark className="w-6 h-6 text-sky-600" />,
      title: 'TNREGINET Aligned',
      subtitle: 'Official Data Grounding',
      description: 'Synchronized with Tamil Nadu Inspector General of Registration (TNREGINET) rate sheets and SRO boundary records.'
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-emerald-600" />,
      title: 'Section 22-A Clear',
      subtitle: 'Prohibited Land Guard',
      description: 'Rigorous screening against HR&CE Hindu Religious temple inam lands and Tamil Nadu Waqf Board registered holdings.'
    },
    {
      icon: <Scale className="w-6 h-6 text-indigo-600" />,
      title: 'CERSAI Bank Index',
      subtitle: 'Equitable Mortgage Cross-Check',
      description: 'Cross-checks central banking security interest registry to uncover undisclosed loans and duplicate title deeds.'
    },
    {
      icon: <Lock className="w-6 h-6 text-amber-600" />,
      title: 'ISO 27001 & 256-Bit SSL',
      subtitle: 'Banking-Grade Privacy',
      description: 'All property searches, survey numbers, and client identity details are strictly encrypted with zero data selling.'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border-2 border-sky-200/90 p-6 sm:p-8 md:p-10 shadow-lg shadow-sky-100/50 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-sky-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-black uppercase tracking-wider mb-2 border border-sky-300">
            <Award className="w-3.5 h-3.5 text-sky-600" />
            <span>STATUTORY DUE DILIGENCE STANDARD</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Institutional Trust & Statutory Compliance
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Grounded in the Registration Act 1908, Tamil Nadu HR&CE Act, and Central Banking Mortgage registries.
          </p>
        </div>

        {/* 100% Assurance Guarantee Badge */}
        <div className="flex items-center gap-3 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300/80 p-3 sm:p-4 rounded-2xl shrink-0 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black text-emerald-950 block uppercase tracking-tight">
              100% Due Diligence Shield
            </span>
            <span className="text-[11px] font-bold text-emerald-700 block">
              Certified Legal Accuracy or Full Refund
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trustPoints.map((item, idx) => (
          <div key={idx} className="bg-sky-50/50 rounded-2xl p-5 border border-sky-200/80 hover:bg-white hover:border-sky-400 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-white border border-sky-200 shadow-xs flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <h3 className="text-base font-black text-slate-900 leading-snug">{item.title}</h3>
            <span className="text-[11px] font-extrabold text-sky-700 block mt-0.5">{item.subtitle}</span>
            <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Trust Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-sky-100 text-center">
        <div className="p-3 bg-white rounded-xl border border-sky-100">
          <span className="text-2xl sm:text-3xl font-black text-slate-900">125,000+</span>
          <span className="text-xs text-slate-500 block font-bold mt-0.5">Properties Audited</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-sky-100">
          <span className="text-2xl sm:text-3xl font-black text-emerald-600">₹4,200 Cr+</span>
          <span className="text-xs text-slate-500 block font-bold mt-0.5">Assets Secured</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-sky-100">
          <span className="text-2xl sm:text-3xl font-black text-sky-600">99.9%</span>
          <span className="text-xs text-slate-500 block font-bold mt-0.5">Verification Accuracy</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-sky-100">
          <span className="text-2xl sm:text-3xl font-black text-indigo-600">38 Districts</span>
          <span className="text-xs text-slate-500 block font-bold mt-0.5">Tamil Nadu State Coverage</span>
        </div>
      </div>
    </div>
  );
};
