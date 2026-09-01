import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  FileCheck,
  Building2,
  Scale,
  TrendingUp,
  Layers,
  Landmark,
  ShieldAlert,
  Calculator,
  MapPin,
  FileText,
  Home,
  Search,
  ChevronDown,
  FileSpreadsheet,
  Settings,
  X,
  Sparkles
} from 'lucide-react';
import { TOOLS_LIST } from '../../data/tools';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  FileCheck: <FileCheck className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  Scale: <Scale className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Landmark: <Landmark className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  Calculator: <Calculator className="w-4 h-4" />,
  MapPin: <MapPin className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Search: <Search className="w-4 h-4" />
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const location = useLocation();
  const [toolsOpen, setToolsOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;
  const isToolsActive = location.pathname.startsWith('/tools');

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F172A] text-slate-300 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800/80 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-700/60 p-1 flex items-center justify-center shadow-sm">
              <img src="/logo.png" alt="PLOTCHECK Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight">PLOTCHECK</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block -mt-1">
                Verification Suite
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-6">
          {/* Main Group */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Platform
            </div>
            <nav className="space-y-1">
              {/* Dashboard / Tools Overview */}
              <Link
                to="/tools"
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  location.pathname === '/' || location.pathname === '/tools'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </Link>
            </nav>
          </div>

          {/* Property Tools Group */}
          <div>
            <button
              type="button"
              onClick={() => setToolsOpen(!toolsOpen)}
              className="w-full px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between hover:text-slate-200"
            >
              <span>Property Tools (12)</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? '' : '-rotate-90'}`} />
            </button>

            {toolsOpen && (
              <nav className="space-y-0.5 pl-1">
                {TOOLS_LIST.map((tool) => {
                  const active = isActive(tool.path);
                  return (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      onClick={onCloseMobile}
                      className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                        active
                          ? 'bg-indigo-600/90 text-white font-semibold shadow-sm'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={active ? 'text-teal-300' : 'text-slate-400'}>
                          {iconMap[tool.iconName] || <FileCheck className="w-4 h-4" />}
                        </span>
                        <span className="truncate">{tool.title}</span>
                      </div>
                      {active && <div className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Utilities & Management */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Management
            </div>
            <nav className="space-y-1">
              <Link
                to="/tools/forms"
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  isActive('/tools/forms')
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Documents & Formats</span>
              </Link>

              <button
                type="button"
                onClick={() => alert('Reports section demo feature.')}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-800/70 hover:text-white rounded-xl transition-all text-left"
              >
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Verification Reports</span>
              </button>

              <button
                type="button"
                onClick={() => alert('Settings section demo feature.')}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-800/70 hover:text-white rounded-xl transition-all text-left"
              >
                <Settings className="w-4 h-4" />
                <span>System Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Footer User Info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center border border-indigo-400">
              PV
            </div>
            <div className="flex-1 truncate">
              <div className="text-xs font-bold text-white truncate">Property Verifier</div>
              <div className="text-[10px] text-slate-400 truncate">Pro SaaS License</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
