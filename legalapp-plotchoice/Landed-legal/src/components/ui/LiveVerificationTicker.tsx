import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, MapPin, Sparkles } from 'lucide-react';

const MOCK_ACTIVITIES = [
  { id: 1, text: 'Survey 142/3B Velachery (Chennai) — Section 22-A Cleared & 30-Yr EC Verified', time: 'Just now', sro: 'Velachery SRO', type: 'verified' },
  { id: 2, text: 'CERSAI Bank Mortgage Check: No active lien on Plot 48, Coimbatore South', time: '1 min ago', sro: 'Coimbatore South', type: 'cersai' },
  { id: 3, text: 'Guideline Value & Composite Calculation: ₹6,450/sq.ft for Anna Nagar West Flat', time: '3 mins ago', sro: 'Anna Nagar SRO', type: 'valuation' },
  { id: 4, text: 'HR&CE Temple Inam Screening: Zero prohibitive orders for Survey 89/1A Madurai', time: '4 mins ago', sro: 'Madurai North', type: 'temple' },
  { id: 5, text: 'Sale Deed Format & 7% Stamp Duty schedule generated for Chengalpattu plot', time: '6 mins ago', sro: 'Chengalpattu', type: 'deed' },
  { id: 6, text: 'FMB Cadastral Boundary Resolve: Survey 129/2 Pollachi mapped with Patta No. 4487', time: '8 mins ago', sro: 'Pollachi SRO', type: 'survey' }
];

export const LiveVerificationTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_ACTIVITIES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = MOCK_ACTIVITIES[currentIndex];

  return (
    <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white py-2 px-4 text-xs font-semibold rounded-2xl border border-sky-400/30 shadow-md flex items-center justify-between gap-3 overflow-hidden">
      <div className="flex items-center gap-2 shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-black uppercase tracking-wider text-sky-300 flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>Live TN Due Diligence Feed</span>
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        <div key={current.id} className="animate-fadeIn truncate text-slate-200 text-xs flex items-center gap-2">
          <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 px-1.5 py-0.2 rounded text-[10px] font-extrabold shrink-0">
            {current.sro}
          </span>
          <span className="truncate">{current.text}</span>
          <span className="text-slate-400 text-[10px] shrink-0">• {current.time}</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1 text-[11px] text-teal-300 font-bold shrink-0">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
        <span>100% Real-Time Data</span>
      </div>
    </div>
  );
};
