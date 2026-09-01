import React from 'react';
import { Star, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';

export const CustomerTestimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Adv. S. Raghavan',
      role: 'Senior Property Advocate, Madras High Court',
      location: 'Chennai',
      rating: 5,
      comment:
        'PLOTCHECK has revolutionized our title vetting process. The automated Section 22-A prohibited land check and CERSAI mortgage linkage saved our client from a ₹2.4 Cr fraudulent transaction on an unapproved Inam parcel.',
      verified: 'Verified Legal Counsel'
    },
    {
      name: 'Dr. K. Senthil Nathan',
      role: 'NRI Property Investor',
      location: 'Singapore / Coimbatore',
      rating: 5,
      comment:
        'Purchasing land in Coimbatore while residing abroad was daunting. PLOTCHECK delivered an instant 30-year EC breakdown and verified the FMB cadastral boundaries in under 2 minutes. Transparent and highly reliable.',
      verified: 'Verified Property Buyer'
    },
    {
      name: 'R. Anantharaman',
      role: 'Managing Director, Apex Infra Developers',
      location: 'Madurai',
      rating: 5,
      comment:
        'We use the Building Value Calculator and Composite Guideline Tool for all our multi-story residential layouts across Tamil Nadu. The PWD rate depreciation formulas match registration requirements exactly.',
      verified: 'Verified Builder'
    }
  ];

  return (
    <div className="bg-sky-50/50 rounded-3xl border-2 border-sky-200/90 p-6 sm:p-8 md:p-10 shadow-md space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-amber-500 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-black text-slate-800 ml-1.5">4.9 / 5.0 (1,450+ Reviews)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Trusted by Buyers, NRI Investors & Advocates
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-sky-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700">100% Verified Due Diligence Clients</span>
        </div>
      </div>

      {/* 3 Testimonials Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-sky-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md hover:border-sky-400 transition-all duration-200">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-sm font-extrabold text-slate-900 block">{rev.name}</span>
              <span className="text-[11px] text-slate-500 font-bold block">{rev.role} • {rev.location}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-2">
                <ShieldCheck className="w-3 h-3" />
                <span>{rev.verified}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
