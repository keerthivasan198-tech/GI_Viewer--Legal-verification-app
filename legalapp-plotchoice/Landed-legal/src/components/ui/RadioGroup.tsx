import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  selectedValue,
  onChange,
  layout = 'horizontal',
  className = ''
}) => {
  return (
    <div
      className={`flex ${
        layout === 'vertical' ? 'flex-col gap-2.5' : 'flex-wrap gap-4'
      } ${className}`}
    >
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;
        return (
          <label
            key={opt.value}
            className={`inline-flex items-center gap-2.5 cursor-pointer select-none py-1.5 px-3 rounded-lg border transition-all ${
              isSelected
                ? 'bg-brand-50/50 border-brand-500 text-slate-900 font-medium'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isSelected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                isSelected ? 'border-brand-600 bg-white' : 'border-slate-300'
              }`}
            >
              {isSelected && <div className="w-2 h-2 rounded-full bg-brand-600" />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{opt.label}</span>
              {opt.description && (
                <span className="text-xs text-slate-500">{opt.description}</span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
};
