import React from 'react';

interface FormFieldProps {
  label?: string;
  required?: boolean;
  helperText?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  helperText,
  children,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs sm:text-[13px] font-semibold text-slate-700 tracking-wide uppercase">
          {label}
          {required && <span className="text-brand-600 ml-1 font-bold">*</span>}
        </label>
      )}
      {children}
      {helperText && (
        <div className="text-xs text-slate-500 italic mt-0.5">
          {helperText}
        </div>
      )}
    </div>
  );
};
