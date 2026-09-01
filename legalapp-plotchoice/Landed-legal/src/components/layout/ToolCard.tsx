import React from 'react';

interface ToolCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  children,
  className = '',
  hoverable = false
}) => {
  return (
    <div
      className={`bg-white/95 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-6 sm:p-7 md:p-8 shadow-sm transition-all duration-300 ease-out ${
        hoverable ? 'hover:border-blue-500/80 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
