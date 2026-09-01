import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ToolLayout } from '../components/layout/ToolLayout';
import { TOOLS_LIST, TAMIL_NADU_DISTRICTS } from '../data/tools';
import { getPropertyContext } from '../utils/propertyContext';
import {
  ArrowUpRight,
  Search,
  Filter,
  ShieldCheck,
  Building,
  CheckCircle2,
  FileCheck2,
  Scale,
  Sparkles,
  MapPin,
  TrendingUp,
  FileText,
  FileSearch,
  Award
} from 'lucide-react';
import { InteractiveToolCard } from '../components/ui/InteractiveToolCard';
import { LiveVerificationTicker } from '../components/ui/LiveVerificationTicker';
import { TrustCertifications } from '../components/trust/TrustCertifications';
import { SampleReportModal } from '../components/trust/SampleReportModal';
import { PropertyHealthSimulator } from '../components/trust/PropertyHealthSimulator';
import { ComparisonSection } from '../components/trust/ComparisonSection';
import { FAQSection } from '../components/trust/FAQSection';

export const ToolsDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ctx = getPropertyContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  // Quick lookup state synced with incoming URL query parameters or active GIS property
  const initialDistrict = (searchParams.get('district') || ctx.district || 'tiruchirappalli').toLowerCase();
  const initialSurvey = searchParams.get('survey') || (ctx.survey ? `${ctx.survey}${ctx.subdiv ? '/' + ctx.subdiv : ''}${ctx.road ? ' - ' + ctx.road : ''}` : ctx.street_address || '');

  const [quickDistrict, setQuickDistrict] = useState(initialDistrict);
  const [quickSurvey, setQuickSurvey] = useState(initialSurvey);

  useEffect(() => {
    const d = searchParams.get('district') || ctx.district;
    const s = searchParams.get('survey') || (ctx.survey ? `${ctx.survey}${ctx.subdiv ? '/' + ctx.subdiv : ''}` : '');
    if (d) setQuickDistrict(d.toLowerCase());
    if (s) setQuickSurvey(s);
  }, [searchParams]);

  const categories = [
    { id: 'all', label: 'ALL TOOLS (12)' },
    { id: 'verification', label: 'TITLE VERIFICATION' },
    { id: 'valuation', label: 'CONSTRUCTION & VALUATION' },
    { id: 'search', label: 'LAND & SRO SEARCH' },
    { id: 'utilities', label: 'DEEDS & STAMP DUTY' }
  ];

  const filteredTools = TOOLS_LIST.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSurvey.trim()) {
      navigate(`/tools/survey-number?district=${quickDistrict}&survey=${encodeURIComponent(quickSurvey)}`);
    } else {
      navigate(`/tools/ec?district=${quickDistrict}`);
    }
  };

  return (
    <ToolLayout
      title="Tamil Nadu Real Estate & Legal Verification Suite"
      subtitle="Complete 12-tool institutional due-diligence platform for property buyers, builders, legal counsels, and financial institutions."
      breadcrumbToolName="Tools Directory"
    >
      <div className="space-y-12 max-w-7xl mx-auto">
        {/* 1. Real-Time Live Verification Activity Feed Ticker */}
        <LiveVerificationTicker />

        {/* 2. Real Estate Institutional Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100/90 via-blue-50/50 to-white border-2 border-sky-200/90 p-6 sm:p-10 text-slate-900 shadow-xl shadow-sky-100/60">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-300 text-sky-800 text-xs font-black shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                <span>OFFICIAL TAMIL NADU PROPERTY DUE DILIGENCE PORTAL</span>
              </span>

              <button
                type="button"
                onClick={() => setIsSampleModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-black transition-all shadow-xs"
              >
                <FileSearch className="w-3.5 h-3.5" />
                <span>View Sample Legal Audit Report ↗</span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Verify Any Land, Plot, or Apartment in Seconds.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Instantly search 30-year Encumbrance Certificates, CERSAI bank mortgages, pending court suits, Section 22-A prohibited temple/Waqf land registers, and official government guideline values across all 38 districts.
            </p>

            {/* Quick Property Search Bar */}
            <form
              onSubmit={handleQuickSearchSubmit}
              className="mt-6 p-2 bg-white rounded-2xl border border-sky-200 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 flex-1 border-b sm:border-b-0 sm:border-r border-sky-100">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">District</span>
                  <select
                    value={quickDistrict}
                    onChange={(e) => setQuickDistrict(e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                  >
                    {TAMIL_NADU_DISTRICTS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 flex-1">
                <Search className="w-4 h-4 text-sky-600 shrink-0" />
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Survey No / Address</span>
                  <input
                    type="text"
                    value={quickSurvey}
                    onChange={(e) => setQuickSurvey(e.target.value)}
                    placeholder="e.g. 142/3B, Velachery"
                    className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-none placeholder-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-slate-900 hover:bg-sky-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 shrink-0"
              >
                <span>Instant Check</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>

            {/* Live Synchronized GIS Property Banner */}
            {ctx.district && (
              <div className="mt-4 p-3 bg-white/95 border border-sky-300 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-black rounded-lg">
                    🗺️ Active GIS Property
                  </span>
                  <span className="font-bold text-slate-800">
                    {ctx.door_no ? `${ctx.door_no}, ` : ''}{ctx.road ? `${ctx.road}, ` : ''}{ctx.village || ctx.district}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-semibold text-[11px] flex-wrap">
                  <span>Survey: <strong className="text-slate-900">{ctx.survey || '142'}/{ctx.subdiv || '3B'}</strong></span>
                  <span>Patta: <strong className="text-slate-900">{ctx.patta || '4521'}</strong></span>
                  <span>Owner: <strong className="text-slate-900">{ctx.owner || 'Pattadhar'}</strong></span>
                  <span>Area: <strong className="text-slate-900">{ctx.area_display || '165 m²'}</strong></span>
                </div>
              </div>
            )}

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/70 px-3 py-1.5 rounded-lg border border-sky-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>38 TN Districts</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/70 px-3 py-1.5 rounded-lg border border-sky-200/60">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Sec 22-A Screened</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/70 px-3 py-1.5 rounded-lg border border-sky-200/60">
                <Building className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>CERSAI Bank Index</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/70 px-3 py-1.5 rounded-lg border border-sky-200/60">
                <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
                <span>2024 Revised Rates</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Category Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-200/80 pb-5">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-200 rounded-lg border ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-sky-200 text-slate-700 hover:text-slate-900 hover:border-sky-400 bg-white shadow-2xs'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Filter Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-500 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* 4. 2-Column Responsive Card Grid (Clean Pure Images + 3D Perspective Tilt on Mouse Move) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {filteredTools.map((tool) => (
            <InteractiveToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* 5. Interactive Property Health Score & Duty Simulator */}
        <PropertyHealthSimulator />

        {/* 6. Institutional Trust & Statutory Compliance Certifications */}
        <TrustCertifications />

        {/* 7. Why PLOTCHECK vs Traditional Manual Verification */}
        <ComparisonSection />

        {/* 8. 4-Pillar Property Due Diligence Workflow Guide */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
              LEGAL DUE DILIGENCE WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              4 Steps to 100% Safe Property Acquisition
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Follow this statutory audit order before executing any real estate agreement or paying booking advances in Tamil Nadu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-sky-200/90 shadow-sm relative">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 font-black text-sm flex items-center justify-center mb-4 border border-sky-300">
                01
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">Cadastral & Patta</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Verify survey numbers, sub-divisions, revenue Patta passbook ownership, and FMB sketches on the GIS map.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-sky-200/90 shadow-sm relative">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 font-black text-sm flex items-center justify-center mb-4 border border-sky-300">
                02
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">Section 22-A & EC</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Scan HR&CE Temple Inam, Waqf Board registers, and 30-year Encumbrance Certificate history for active charges.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-sky-200/90 shadow-sm relative">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 font-black text-sm flex items-center justify-center mb-4 border border-sky-300">
                03
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">Litigation & CERSAI</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Check eCourts for stay orders or civil injunctions and CERSAI for undisclosed equitable bank mortgages.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-sky-200/90 shadow-sm relative">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 font-black text-sm flex items-center justify-center mb-4 border border-sky-300">
                04
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">Valuation & Deed</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Calculate statutory Stamp Duty (7%) & Registration Fee (2%) and generate legally verified Sale Agreements.
              </p>
            </div>
          </div>
        </div>

        {/* 9. Frequently Asked Questions (FAQ) */}
        <FAQSection />

        {/* No Results Fallback */}
        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-sky-200 p-8 shadow-xs">
            <Filter className="w-8 h-8 text-sky-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No matching tools found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No verification tools match &ldquo;{searchQuery}&rdquo;. Try selecting &ldquo;ALL TOOLS (12)&rdquo; or clearing your search.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-sky-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Sample Report Modal Lightbox */}
        <SampleReportModal
          isOpen={isSampleModalOpen}
          onClose={() => setIsSampleModalOpen(false)}
        />
      </div>
    </ToolLayout>
  );
};
