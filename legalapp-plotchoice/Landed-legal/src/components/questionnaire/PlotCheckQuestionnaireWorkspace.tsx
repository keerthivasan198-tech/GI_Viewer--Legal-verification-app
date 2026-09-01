import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  Landmark,
  Scale,
  Map,
  Building2,
  ShieldCheck,
  Calculator,
  MapPin,
  FileText,
  Building,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  Check,
  X,
  Compass
} from 'lucide-react';
import { MapPlaceholder } from '../ui/MapPlaceholder';
import { MOCK_ZONES, TAMIL_NADU_DISTRICTS } from '../../data/tools';
import { SurveyNumberFinderUtility } from '../survey/SurveyNumberFinderUtility';
import { searchLiveSurveyDetails } from '../../services/surveyService';

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const VERIFICATION_SERVICES: ServiceItem[] = [
  {
    id: 'ec',
    title: 'Online EC',
    subtitle: 'Encumbrance Certificate',
    description: 'Verify property encumbrance records, title ownership history, and registration details online.',
    path: '/tools/ec',
    icon: <FileCheck className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'cersai',
    title: 'CERSAI Check',
    subtitle: 'Bank Mortgage Verification',
    description: 'Check if the property is already mortgaged or pledged to any bank or financial institution.',
    path: '/tools/cersai',
    icon: <Landmark className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'court_case',
    title: 'Court Case Search',
    subtitle: 'Litigation History',
    description: 'Check litigation history and court cases by Party Name, Revenue Court, or CNR Number.',
    path: '/tools/court-case',
    icon: <Scale className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'guideline_value',
    title: 'Guideline Value',
    subtitle: 'Land Market Value',
    description: 'Search official government guideline values for land and properties across Tamil Nadu zones.',
    path: '/tools/guideline-value',
    icon: <Map className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'composite_value',
    title: 'Apartment Composite Value',
    subtitle: 'Flat Registration Rates',
    description: 'Calculate and search combined guideline values for apartments, flats and multi-story units.',
    path: '/tools/composite-value',
    icon: <Building2 className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'temple_property',
    title: 'Temple Property Check',
    subtitle: 'HR&CE Land Audit',
    description: 'Search and verify HR&CE Hindu Religious & Charitable Endowment temple land records.',
    path: '/tools/temple-property',
    icon: <Landmark className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'waqf_property',
    title: 'WAQF Property Check',
    subtitle: 'WAQF Gazette Search',
    description: 'Verify WAQF Board registered property lists and prevent illegal transactions on WAQF lands.',
    path: '/tools/waqf-property',
    icon: <ShieldCheck className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'stamp_duty',
    title: 'Stamp Duty & Fees',
    subtitle: 'Registration Fee Calculator',
    description: 'Instantly calculate government stamp duty and registration fees for property conveyances.',
    path: '/tools/stamp-duty',
    icon: <Calculator className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'find_sro',
    title: 'Find Your SRO',
    subtitle: 'Sub-Registrar Jurisdiction',
    description: 'Locate your designated Sub Registrar Office using an interactive map or village hierarchy.',
    path: '/tools/find-sro',
    icon: <MapPin className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'forms',
    title: 'Forms & Templates',
    subtitle: 'Deed & CMDA Downloads',
    description: 'Download standard legal deed formats, sale agreements, power of attorney and CMDA forms.',
    path: '/tools/forms',
    icon: <FileText className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'building_value',
    title: 'Building Value Calculator',
    subtitle: 'PWD Plinth Valuation',
    description: 'Calculate structural building valuation based on official PWD plinth area rates and depreciation.',
    path: '/tools/building-value',
    icon: <Building className="w-5 h-5 text-blue-400" />
  }
];

import { getPropertyContext } from '../../utils/propertyContext';

export const PlotCheckQuestionnaireWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const ctx = getPropertyContext();

  // Questionnaire form states
  const [currentStep, setCurrentStep] = useState(1);
  const [district, setDistrict] = useState(ctx.district ? ctx.district.toLowerCase() : 'chennai');
  const [taluk, setTaluk] = useState(ctx.taluk || 'Mambalam');
  const [village, setVillage] = useState(ctx.village || 'T. Nagar');
  const [surveyNo, setSurveyNo] = useState(ctx.survey || '142');
  const [subDivisionNo, setSubDivisionNo] = useState(ctx.subdiv || '3B');
  const [propertyType, setPropertyType] = useState('apartment');
  const [selectedServices, setSelectedServices] = useState<string[]>(['ec', 'cersai', 'court_case']);

  // Survey Number Finder states
  const [finderDistrict, setFinderDistrict] = useState(ctx.district ? ctx.district.toLowerCase() : 'chennai');
  const [finderTaluk, setFinderTaluk] = useState(ctx.taluk || 'Mambalam');
  const [finderVillage, setFinderVillage] = useState(ctx.village || 'T. Nagar');
  const [finderQuery, setFinderQuery] = useState(ctx.survey || '142');
  const [searchingFinder, setSearchingFinder] = useState(false);
  const [foundResult, setFoundResult] = useState<any | null>(null);
  const [showMap, setShowMap] = useState(false);

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((s) => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleSearchSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchingFinder(true);
    setFoundResult(null);

    const liveRes = await searchLiveSurveyDetails({
      district: finderDistrict,
      taluk: finderTaluk,
      village: finderVillage,
      surveyNo: finderQuery
    });

    setSearchingFinder(false);
    setFoundResult(liveRes);
  };

  const steps = [
    { num: 1, label: 'Property Details' },
    { num: 2, label: 'Verification Services' },
    { num: 3, label: 'Document Audit' },
    { num: 4, label: 'Final Review' }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans relative overflow-x-hidden selection:bg-blue-600 selection:text-white pb-16">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* FULL-WIDTH HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-10 py-4 shadow-xl">
        <div className="w-full max-w-none flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/tools" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/25 group-hover:scale-105 transition-transform duration-200">
                P
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    PLOTCHECK
                  </span>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded-md">
                    Enterprise Suite
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400 block">
                  Property Verification & Due Diligence Workspace
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 self-end md:self-auto">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-800/60 rounded-full text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Secure Verification</span>
            </div>

            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-xl shadow-inner">
              <div className="text-right">
                <div className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">
                  STEP 0{currentStep} / 04
                </div>
                <div className="text-xs font-bold text-slate-200">
                  {steps[currentStep - 1].label}
                </div>
              </div>
              <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER (FULL-WIDTH 100vw, NO NARROW CONTAINER) */}
      <main className="w-full max-w-none px-4 sm:px-6 lg:px-10 mt-6 space-y-6 relative z-10">
        {/* PAGE TITLE BANNER */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/80 border border-blue-800/60 rounded-md text-[11px] font-extrabold text-blue-400 uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Property Intelligence & Verification Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Verify Your Property
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium leading-relaxed">
              Complete the details below to access property records, ownership information, encumbrance data, litigation checks and government valuation services.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-center flex-shrink-0 w-full md:w-auto">
            <div className="px-2 border-r border-slate-800">
              <div className="text-lg font-black text-blue-400">38</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">TN Districts</div>
            </div>
            <div className="px-2 border-r border-slate-800">
              <div className="text-lg font-black text-indigo-400">578+</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">SRO Offices</div>
            </div>
            <div className="px-2">
              <div className="text-lg font-black text-emerald-400">100%</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Legal Audit</div>
            </div>
          </div>
        </div>

        {/* PROGRESS STEP BAR */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((st) => {
              const isActive = currentStep === st.num;
              const isPast = currentStep > st.num;

              return (
                <div
                  key={st.num}
                  onClick={() => setCurrentStep(st.num)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-blue-950/50 border-blue-500 text-white shadow-md shadow-blue-500/10'
                      : isPast
                      ? 'bg-slate-950/40 border-emerald-500/50 text-slate-300'
                      : 'bg-slate-950/20 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : isPast
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[3]" /> : `0${st.num}`}
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      STEP 0{st.num}
                    </div>
                    <div className={`text-xs font-bold ${isActive ? 'text-blue-300' : 'text-slate-300'}`}>
                      {st.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* QUESTIONNAIRE LANDSCAPE WORKSPACE (2-COLUMN DESKTOP SPLIT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: PROPERTY INFORMATION CARD (5 Cols Desktop) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    Property Information
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    Tell us where the property is located.
                  </p>
                </div>
                <span className="text-[10px] font-extrabold text-blue-400 bg-blue-950 border border-blue-800 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Location Config
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    District <span className="text-blue-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full h-12 bg-slate-950/80 border border-slate-800 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      {TAMIL_NADU_DISTRICTS.map((d) => (
                        <option key={d.value} value={d.value} className="bg-slate-900 text-white">
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-4 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Taluk <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={taluk}
                      onChange={(e) => setTaluk(e.target.value)}
                      placeholder="e.g. Mambalam"
                      className="w-full h-12 bg-slate-950/80 border border-slate-800 rounded-xl px-4 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Village <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="e.g. T. Nagar"
                      className="w-full h-12 bg-slate-950/80 border border-slate-800 rounded-xl px-4 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Survey Number <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={surveyNo}
                      onChange={(e) => setSurveyNo(e.target.value)}
                      placeholder="e.g. 142"
                      className="w-full h-12 bg-slate-950/80 border border-slate-800 rounded-xl px-4 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Sub-Division Number
                    </label>
                    <input
                      type="text"
                      value={subDivisionNo}
                      onChange={(e) => setSubDivisionNo(e.target.value)}
                      placeholder="e.g. 3B"
                      className="w-full h-12 bg-slate-950/80 border border-slate-800 rounded-xl px-4 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Property Type
                  </label>
                  <div className="relative">
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full h-12 bg-slate-950/80 border border-slate-800 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="apartment">Residential Flat / Apartment</option>
                      <option value="villa">Individual House / Villa</option>
                      <option value="plot">Vacant Plot / Layout Land</option>
                      <option value="commercial">Commercial Shop / Building</option>
                      <option value="agricultural">Agricultural Farm Land</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-4 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase">Configured Parcel</span>
                  <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                  </span>
                </div>
                <div className="text-sm font-extrabold text-blue-400">
                  SF. {surveyNo} / {subDivisionNo || '1'} — {village}, {taluk}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  Zone: {district.toUpperCase()} District SRO Jurisdiction
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: VERIFICATION SERVICE GRID (7 Cols Desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    Choose Verification Services
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    Select the records you want to verify for this property.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                  {selectedServices.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-1">
                {VERIFICATION_SERVICES.map((srv) => {
                  const isSelected = selectedServices.includes(srv.id);

                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      onMouseMove={handleCardMouseMove}
                      style={{
                        backgroundImage: `radial-gradient(200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(37, 99, 235, 0.1), transparent 75%)`
                      }}
                      className={`group border rounded-xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between relative overflow-hidden select-none ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-blue-500/60 hover:-translate-y-0.5'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                            {srv.icon}
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'border-slate-700 group-hover:border-blue-400'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <h3 className="text-sm font-extrabold text-white group-hover:text-blue-300 transition-colors leading-snug">
                          {srv.title}
                        </h3>
                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mt-0.5">
                          {srv.subtitle}
                        </div>

                        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-normal">
                          {srv.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold">
                        <span className={isSelected ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}>
                          {isSelected ? 'Service Active' : 'Select Service'}
                        </span>
                        <Link
                          to={srv.path}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION ACTION BAR */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600 bg-slate-950'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">
            Step 0{currentStep} of 04 • {steps[currentStep - 1].label}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => alert('Questionnaire state saved securely.')}
              className="w-full sm:w-auto px-5 h-12 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Save & Continue Later
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentStep < 4) {
                  setCurrentStep(currentStep + 1);
                } else {
                  navigate('/tools/ec');
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>{currentStep === 4 ? 'Complete Verification' : 'Continue to Verification'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BOTTOM HERO UTILITY SECTION: SURVEY NUMBER FINDER */}
        <SurveyNumberFinderUtility />
      </main>
    </div>
  );
};
