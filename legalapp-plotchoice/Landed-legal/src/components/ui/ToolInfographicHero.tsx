import React, { useState } from 'react';
import { Sparkles, Maximize2, X, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface ToolInfographicHeroProps {
  imageSrc: string;
  title: string;
  badgeText: string;
  subtitle: string;
  highlights?: string[];
}

export const ToolInfographicHero: React.FC<ToolInfographicHeroProps> = ({
  imageSrc,
  title,
  badgeText,
  subtitle,
  highlights = []
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border-2 border-sky-200/90 bg-gradient-to-br from-sky-50 via-blue-50/40 to-white text-slate-800 shadow-lg shadow-sky-100/60 mb-6 transition-all duration-300">
        {/* Soft Ambient Light Blue Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-sky-200/70 bg-white/70 backdrop-blur-xs relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-300 text-sky-700 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-300 px-2 py-0.5 rounded-md shadow-2xs">
                  {badgeText}
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline font-medium">• Visual Reference Blueprint</span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 tracking-tight">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="p-1.5 px-2.5 rounded-lg bg-sky-100/80 hover:bg-sky-200 text-sky-800 hover:text-sky-900 transition-colors text-xs flex items-center gap-1.5 border border-sky-300 font-semibold shadow-2xs"
              title="Expand Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Fullscreen</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg bg-white/80 hover:bg-sky-100 text-slate-600 hover:text-slate-900 transition-colors text-xs border border-sky-200 shadow-2xs"
              title={isExpanded ? "Minimize Diagram" : "Expand Diagram"}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Animated Diagram Body */}
        {isExpanded && (
          <div className="p-4 sm:p-5 pt-3 relative z-10 transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* Bigger Image Container */}
              <div className="lg:col-span-8 relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
                <div className="rounded-xl overflow-hidden border-2 border-white shadow-xl bg-white relative">
                  <img
                    src={imageSrc}
                    alt={title}
                    className="w-full h-auto object-cover max-h-[380px] sm:max-h-[440px] transform group-hover:scale-102 transition-transform duration-700 ease-out"
                  />
                  {/* Floating Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3.5">
                    <span className="text-xs text-white font-semibold flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xs px-3 py-1 rounded-md border border-white/20">
                      <Maximize2 className="w-3.5 h-3.5 text-sky-400" /> Click to view high-resolution blueprint
                    </span>
                    <span className="text-[10px] text-sky-200 font-bold bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-400/40">
                      Official Reference Format
                    </span>
                  </div>
                </div>
              </div>

              {/* Explanatory Callouts & Highlights */}
              <div className="lg:col-span-4 space-y-3">
                <div className="bg-white/90 backdrop-blur-xs rounded-xl p-4 border border-sky-200/80 shadow-xs">
                  <h4 className="text-xs font-black text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    How to verify
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                    {subtitle}
                  </p>
                </div>

                {highlights.length > 0 && (
                  <div className="space-y-2">
                    {highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white/80 rounded-xl p-2.5 border border-sky-200/60 shadow-2xs font-medium">
                        <span className="w-2 h-2 rounded-full bg-sky-500 mt-1 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* High-Resolution Modal Lightbox */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-white rounded-2xl border-2 border-sky-300 shadow-2xl overflow-hidden">
            <div className="p-3.5 sm:p-4 bg-sky-50 border-b border-sky-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-sky-200 text-sky-900 px-2 py-0.5 rounded">
                  {badgeText}
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">{title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-slate-700 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto p-3 sm:p-6 flex items-center justify-center bg-slate-50">
              <img
                src={imageSrc}
                alt={title}
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-xl border border-slate-200"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
