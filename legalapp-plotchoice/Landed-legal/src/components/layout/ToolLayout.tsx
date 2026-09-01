import React from 'react';
import { ToolHeader } from './ToolHeader';
import { Breadcrumb } from './Breadcrumb';
import { CustomCursor } from '../ui/CustomCursor';
import { ShieldCheck } from 'lucide-react';

interface ToolLayoutProps {
  title: string;
  subtitle?: string;
  categoryBadge?: string;
  breadcrumbToolName?: string;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  title,
  subtitle,
  categoryBadge,
  breadcrumbToolName,
  children
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/25 to-slate-100/80 text-slate-800 flex flex-col relative overflow-hidden font-sans">
      {/* Custom Cursor Component */}
      <CustomCursor />

      {/* Decorative ambient radial background glow & subtle dot grid pattern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-100/35 via-indigo-50/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-25 -z-10" />

      <ToolHeader />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-6 relative z-10">
        <Breadcrumb currentTool={breadcrumbToolName || title} />

        <div className="w-full">
          {children}
        </div>

        <footer className="pt-12 pb-8 border-t border-slate-200/60 text-center text-xs text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-1.5 font-semibold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>PLOTCHECK Verification Tools Module</span>
          </p>
          <p className="text-slate-400">Verification results and data calculations are provided for reference & due diligence.</p>
        </footer>
      </main>
    </div>
  );
};
