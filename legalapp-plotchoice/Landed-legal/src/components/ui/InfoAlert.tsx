import React from 'react';
import { Info } from 'lucide-react';

interface InfoAlertProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const InfoAlert: React.FC<InfoAlertProps> = ({
  children,
  title,
  className = ''
}) => {
  return (
    <div className={`flex items-start gap-3.5 p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-950 text-xs sm:text-sm leading-relaxed shadow-subtle ${className}`}>
      <Info className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && (
          <h4 className="font-bold text-amber-900 mb-1 text-sm">{title}</h4>
        )}
        <div className="text-slate-700 font-normal">{children}</div>
      </div>
    </div>
  );
};
