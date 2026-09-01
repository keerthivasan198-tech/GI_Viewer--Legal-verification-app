import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  currentTool: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentTool }) => {
  return (
    <nav className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full text-[11px] font-semibold text-slate-500 shadow-xs hover:border-slate-300 transition-all duration-200">
      <Link to="/" className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1">
        <Home className="w-3 h-3 text-slate-400" />
        <span>Home</span>
      </Link>
      
      <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />

      <Link to="/tools" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
        Tools
      </Link>

      <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />

      <span className="text-slate-800 font-bold truncate max-w-[180px] sm:max-w-none">
        {currentTool}
      </span>
    </nav>
  );
};
