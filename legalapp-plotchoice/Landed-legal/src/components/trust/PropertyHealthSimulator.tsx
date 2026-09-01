import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight, Calculator, CheckCircle2, Sparkles, AlertCircle, Building2, MapPin } from 'lucide-react';

export const PropertyHealthSimulator: React.FC = () => {
  const navigate = useNavigate();
  const [propertyType, setPropertyType] = useState('plot');
  const [district, setDistrict] = useState('chennai');
  const [areaSqFt, setAreaSqFt] = useState<number>(1500);
  const [marketValue, setMarketValue] = useState<number>(4500000);
  const [hasEncumbranceQuery, setHasEncumbranceQuery] = useState(false);

  // Dynamic Calculations
  const guidelineRate = district === 'chennai' ? 3200 : district === 'coimbatore' ? 2400 : 1800;
  const guidelineTotal = areaSqFt * guidelineRate;
  const taxableValue = Math.max(marketValue, guidelineTotal);
  const stampDuty = taxableValue * 0.07;
  const registrationFee = taxableValue * 0.02;
  const totalGovtOutlay = stampDuty + registrationFee;

  const score = hasEncumbranceQuery ? 72 : 98;
  const grade = hasEncumbranceQuery ? 'B+ (Verification Needed)' : 'A+ (Clear Title Standard)';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-sky-400/40 shadow-2xl relative overflow-hidden space-y-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-black uppercase tracking-wider mb-2 border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>INTERACTIVE DUE DILIGENCE SIMULATOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Instant Property Health Score & Duty Estimator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            Simulate statutory legal risks, government guideline valuations, and stamp duty outlays before making purchase commitments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/tools/ec')}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Full 30-Year Audit</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Controls & Score Display */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Property Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Property Category</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'plot', label: 'Plot / Land' },
                  { id: 'flat', label: 'Apartment' },
                  { id: 'house', label: 'House / Villa' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setPropertyType(type.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      propertyType === type.id
                        ? 'bg-sky-500 text-slate-950 border-sky-400 font-black shadow-md'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full py-2 px-3 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
              >
                <option value="chennai" className="bg-slate-900 text-white">Chennai (Metro Rate)</option>
                <option value="coimbatore" className="bg-slate-900 text-white">Coimbatore (Tier 1 Rate)</option>
                <option value="madurai" className="bg-slate-900 text-white">Madurai</option>
                <option value="salem" className="bg-slate-900 text-white">Salem</option>
                <option value="chengalpattu" className="bg-slate-900 text-white">Chengalpattu</option>
              </select>
            </div>
          </div>

          {/* Area & Price Sliders */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-300">Plot / Built-up Area: <strong className="text-sky-300 font-black">{areaSqFt.toLocaleString()} Sq.Ft</strong></span>
                <span className="text-slate-400">({(areaSqFt / 435.6).toFixed(2)} Cents)</span>
              </div>
              <input
                type="range"
                min="400"
                max="10000"
                step="100"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-300">Market Consideration: <strong className="text-emerald-300 font-black">₹{marketValue.toLocaleString('en-IN')}</strong></span>
                <span className="text-slate-400">Guideline: ₹{guidelineTotal.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="30000000"
                step="500000"
                value={marketValue}
                onChange={(e) => setMarketValue(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Output Score Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-5">
          {/* Health Gauge */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-300 block">
                STATUTORY HEALTH RATING
              </span>
              <span className="text-3xl font-black text-white">{score}/100</span>
              <span className="text-xs font-bold text-emerald-400 block mt-0.5">{grade}</span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-medium">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Stamp Duty (7%):</span>
              <span className="font-extrabold text-white">₹{Math.round(stampDuty).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Registration Fee (2%):</span>
              <span className="font-extrabold text-white">₹{Math.round(registrationFee).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="font-bold text-sky-300">Total Statutory Outlay:</span>
              <span className="font-black text-emerald-400 text-sm">₹{Math.round(totalGovtOutlay).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/tools/stamp-duty`)}
            className="w-full py-2.5 bg-white text-slate-900 hover:bg-sky-400 hover:text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Generate Official Duty Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
