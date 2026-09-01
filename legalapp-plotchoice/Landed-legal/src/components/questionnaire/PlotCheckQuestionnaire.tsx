import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  UserCheck,
  FileText,
  ShieldAlert,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Home,
  Briefcase,
  Trees,
  Layers,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';

interface QuestionStep {
  id: number;
  stepName: string;
  eyebrow: string;
  title: string;
  description: string;
  options: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

const QUESTIONNAIRE_STEPS: QuestionStep[] = [
  {
    id: 1,
    stepName: 'Property Type',
    eyebrow: 'STEP 1 OF 7 • CLASSIFICATION',
    title: 'What type of property are you verifying?',
    description: 'Select the property classification to customize encumbrance, guideline, and verification checks.',
    options: [
      {
        id: 'apartment',
        title: 'Residential Flat / Apartment',
        description: 'Multi-story apartment unit with undivided share of land (UDS) and composite value registration.',
        icon: <Building2 className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'villa',
        title: 'Individual House / Villa',
        description: 'Independent residential house or bungalow constructed on private plot land.',
        icon: <Home className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'plot',
        title: 'Vacant Residential Plot / Land',
        description: 'Vacant plot requiring layout approval (DTCP/CMDA), patta transfer, and survey boundary check.',
        icon: <MapPin className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'commercial',
        title: 'Commercial Shop / Building',
        description: 'Retail shop, office space, commercial building, or showroom unit.',
        icon: <Briefcase className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'agricultural',
        title: 'Agricultural Land',
        description: 'Farm land, wet/dry agricultural plot requiring revenue village survey verification.',
        icon: <Trees className="w-5 h-5 text-blue-600" />
      }
    ]
  },
  {
    id: 2,
    stepName: 'Location',
    eyebrow: 'STEP 2 OF 7 • JURISDICTION',
    title: 'Where is the property located in Tamil Nadu?',
    description: 'Specify the primary zone or district to locate the governing Sub-Registrar Office (SRO).',
    options: [
      {
        id: 'chennai',
        title: 'Chennai Metro & Extended Belt',
        description: 'Chennai Corporation limits and 32km belt area (T. Nagar, Velachery, Anna Nagar, Tambaram, etc.).',
        icon: <MapPin className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'coimbatore',
        title: 'Coimbatore Region',
        description: 'Coimbatore corporation, Peelamedu, Gandhipuram, Pollachi, and Tiruppur belt.',
        icon: <Building2 className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'madurai',
        title: 'Madurai & Southern TN',
        description: 'Madurai Corporation, Trichy, Salem, Tirunelveli, and southern district SROs.',
        icon: <Layers className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'other_tn',
        title: 'Other TN Districts (38 Districts)',
        description: 'Covers all 38 Tamil Nadu districts across 9 registration zones.',
        icon: <Search className="w-5 h-5 text-blue-600" />
      }
    ]
  },
  {
    id: 3,
    stepName: 'Ownership',
    eyebrow: 'STEP 3 OF 7 • TITLE HOLDER',
    title: 'What is the current ownership structure?',
    description: 'Understanding title holder status ensures proper executant verification in EC records.',
    options: [
      {
        id: 'single_owner',
        title: 'Single Individual Owner / Seller',
        description: 'Property registered under one sole individual owner with clear title deed.',
        icon: <UserCheck className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'joint_ownership',
        title: 'Joint Family / Multiple Owners',
        description: 'Multiple co-owners, family members, or joint executants listed on deed.',
        icon: <Building2 className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'gpa',
        title: 'Power of Attorney (GPA) Holder',
        description: 'Sale conducted via General Power of Attorney registered at SRO.',
        icon: <FileText className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'builder_developer',
        title: 'Builder / Developer Entity',
        description: 'Property sold directly by a registered construction firm or promoter.',
        icon: <Briefcase className="w-5 h-5 text-blue-600" />
      }
    ]
  },
  {
    id: 4,
    stepName: 'Documents',
    eyebrow: 'STEP 4 OF 7 • DEED AUDIT',
    title: 'Which key documents are currently available?',
    description: 'Select all documents you possess for automated completeness scoring.',
    options: [
      {
        id: 'sale_deed_orig',
        title: 'Original Registered Sale Deed',
        description: 'Primary title deed registered at the Sub-Registrar Office with stamp duty paid.',
        icon: <FileCheck2 className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'parent_deeds',
        title: 'Parent Title Documents (30 Yrs)',
        description: 'Historical link documents tracing previous transactions for past 30 years.',
        icon: <FileText className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'patta_chitta',
        title: 'Patta / Chitta Revenue Extract',
        description: 'Government revenue record confirming land ownership and survey sub-division.',
        icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'approved_plan',
        title: 'DTCP / CMDA Approved Layout Plan',
        description: 'Planning permission approval copy issued by CMDA, DTCP, or local body.',
        icon: <Layers className="w-5 h-5 text-blue-600" />
      }
    ]
  },
  {
    id: 5,
    stepName: 'Encumbrance',
    eyebrow: 'STEP 5 OF 7 • LIEN & MORTGAGE',
    title: 'Are there any known mortgages or legal disputes?',
    description: 'Check for equitable bank mortgages, CERSAI charges, or pending court litigation.',
    options: [
      {
        id: 'clear_ec',
        title: 'Fresh Clear EC (No Liabilities)',
        description: 'Encumbrance certificate shows zero unreleased mortgages or attachments.',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      },
      {
        id: 'active_bank_loan',
        title: 'Active Bank Home Loan / Mortgage',
        description: 'Property pledged to a bank or financial institution requiring discharge receipt.',
        icon: <ShieldAlert className="w-5 h-5 text-amber-600" />
      },
      {
        id: 'unclear_history',
        title: 'Unsure / Need Complete CERSAI Check',
        description: 'Detect unregistered equitable mortgages created by title deed deposits.',
        icon: <Search className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'litigation_check',
        title: 'Need Court Case & Injunction Check',
        description: 'Verify pending civil suits across eCourts and TN Revenue Courts.',
        icon: <AlertTriangle className="w-5 h-5 text-rose-600" />
      }
    ]
  },
  {
    id: 6,
    stepName: 'Verification',
    eyebrow: 'STEP 6 OF 7 • SCOPE OF CHECK',
    title: 'Select your preferred verification scope',
    description: 'Choose the comprehensive level of title due diligence report needed.',
    options: [
      {
        id: 'full_360',
        title: 'Full 360° Comprehensive Verification',
        description: 'Combines EC search, CERSAI mortgage check, Court Case search, Patta check, and Guideline value.',
        icon: <Sparkles className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'cersai_mortgage',
        title: 'Bank Mortgage & CERSAI Check Only',
        description: 'Instant national CERSAI asset search report delivered directly to WhatsApp.',
        icon: <ShieldAlert className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'litigation_search',
        title: 'Court Case Litigation Search Only',
        description: 'Search eCourts and Revenue Tribunals by party name, survey no, or CNR no.',
        icon: <Search className="w-5 h-5 text-blue-600" />
      },
      {
        id: 'guideline_valuation',
        title: 'Guideline & Stamp Duty Calculation',
        description: 'Calculate official government guideline rates and statutory registration fees.',
        icon: <FileText className="w-5 h-5 text-blue-600" />
      }
    ]
  },
  {
    id: 7,
    stepName: 'Review',
    eyebrow: 'STEP 7 OF 7 • FINAL SUMMARY',
    title: 'Verification Questionnaire Complete!',
    description: 'Your PLOTCHECK Property Verification parameters are ready for instant report generation.',
    options: [
      {
        id: 'generate_report',
        title: 'Generate Instant Verification Report',
        description: 'Proceed to view complete due diligence results across Tamil Nadu land records.',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      }
    ]
  }
];

export const PlotCheckQuestionnaire: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({
    0: 'apartment',
    1: 'chennai',
    2: 'single_owner',
    3: 'sale_deed_orig',
    4: 'clear_ec',
    5: 'full_360',
    6: 'generate_report'
  });

  const currentStep = QUESTIONNAIRE_STEPS[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / QUESTIONNAIRE_STEPS.length) * 100);

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentStepIndex]: optionId });
  };

  const handleNext = () => {
    if (currentStepIndex < QUESTIONNAIRE_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      alert('Verification questionnaire completed! Redirecting to tools directory.');
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="min-h-screen bg-slate-900/95 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* TOP LANDSCAPE HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/tools" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="text-lg font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
              PLOTCHECK
            </span>
          </Link>
          <span className="text-slate-600 font-light">|</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Property Verification Questionnaire
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-full">
            {currentStepIndex + 1} / {QUESTIONNAIRE_STEPS.length}
          </span>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* MAIN LANDSCAPE DESKTOP CONTAINER */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch relative z-10">
        {/* LEFT SIDEBAR PROGRESS PANEL (280px-300px desktop equivalent: 3 cols) */}
        <aside className="lg:col-span-3 bg-slate-800/70 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="border-b border-slate-700/80 pb-4 mb-6">
              <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest block">
                VERIFICATION STEPS
              </span>
              <h2 className="text-base font-black text-white mt-1">
                PROPERTY CHECK
              </h2>
            </div>

            {/* Vertical Steps List */}
            <div className="space-y-4 relative pl-3">
              {/* Thin Vertical Progress Line */}
              <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-slate-700 pointer-events-none" />

              {QUESTIONNAIRE_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={step.id}
                    onClick={() => setCurrentStepIndex(idx)}
                    className="flex items-center gap-3.5 relative z-10 cursor-pointer group"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-sm shadow-emerald-500/30'
                          : isCurrent
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40 ring-4 ring-blue-500/20'
                          : 'bg-slate-800 border border-slate-700 text-slate-500 group-hover:border-slate-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>

                    <span
                      className={`text-xs font-bold transition-colors ${
                        isCurrent
                          ? 'text-blue-400 font-extrabold'
                          : isCompleted
                          ? 'text-slate-200'
                          : 'text-slate-500 group-hover:text-slate-400'
                      }`}
                    >
                      {step.stepName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Sidebar Progress Footer */}
          <div className="pt-6 border-t border-slate-700/80 mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Overall Progress</span>
              <span className="text-blue-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN WORKSPACE PANEL (9 cols desktop) */}
        <section className="lg:col-span-9 bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Question Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-950/80 border border-blue-800/80 rounded-md text-[11px] font-extrabold text-blue-400 uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentStep.eyebrow}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-black text-white tracking-tight leading-snug">
              {currentStep.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 font-medium leading-relaxed max-w-3xl">
              {currentStep.description}
            </p>

            {/* Answer Options Grid (2-Column Desktop Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-8">
              {currentStep.options.map((opt) => {
                const isSelected = selectedAnswers[currentStepIndex] === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    onMouseMove={handleCardMouseMove}
                    style={{
                      backgroundImage: `radial-gradient(180px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(37, 99, 235, 0.08), transparent 70%)`
                    }}
                    className={`group border rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between relative overflow-hidden select-none ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10'
                        : 'bg-slate-900/60 border-slate-700/80 hover:border-blue-500/60 hover:-translate-y-1 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-blue-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                          {opt.icon}
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : 'border-slate-600 group-hover:border-blue-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      <h3 className="text-base font-extrabold text-white group-hover:text-blue-300 transition-colors leading-snug">
                        {opt.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM ACTION AREA */}
          <div className="mt-10 pt-6 border-t border-slate-700/80 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                currentStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
            >
              <span>{currentStepIndex === QUESTIONNAIRE_STEPS.length - 1 ? 'Finish & Generate Report' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
