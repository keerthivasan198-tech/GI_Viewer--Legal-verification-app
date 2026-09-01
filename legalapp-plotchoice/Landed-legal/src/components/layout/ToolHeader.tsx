import React from 'react';
import { ArrowLeft, Sparkles, ShieldCheck, MapPin, Search } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface ToolHeaderProps {
  title?: string;
}

export const ToolHeader: React.FC<ToolHeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/' || location.pathname === '/tools';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Back to Tools */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-700/60 p-1.5 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:shadow-blue-500/20 transition-all duration-200">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                  PLOTCHECK
                </span>
                <span className="text-[9px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block -mt-0.5">
                TN Legal & Cadastral Suite
              </span>
            </div>
          </Link>

          <div className="h-5 w-[1px] bg-slate-200/80 hidden sm:block" />

          {/* Unified Platform Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-white transition-all shadow-2xs"
            >
              <span>🗺️ GIS Map</span>
            </a>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-white px-3 py-1.5 rounded-lg shadow-xs"
            >
              <span>⚡ 12 Tools</span>
            </Link>
          </div>

          {!isHome && (
            <button
              type="button"
              onClick={() => navigate('/tools')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100/80"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All 12 Tools</span>
            </button>
          )}
        </div>

        {/* Center/Right Nav Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/tools/ec"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors hidden md:block px-3 py-1.5 rounded-lg hover:bg-slate-100/70"
          >
            EC Search
          </Link>
          <Link
            to="/tools/survey-number"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors hidden md:block px-3 py-1.5 rounded-lg hover:bg-slate-100/70"
          >
            Survey Finder
          </Link>
          <Link
            to="/tools/building-value"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors hidden sm:block px-3 py-1.5 rounded-lg hover:bg-slate-100/70"
          >
            Building Value
          </Link>
          <Link
            to="/tools/guideline-value"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors hidden sm:block px-3 py-1.5 rounded-lg hover:bg-slate-100/70"
          >
            Guideline Value
          </Link>
          <Link
            to="/tools"
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/25 active:scale-[0.98] inline-flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tools Directory</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
