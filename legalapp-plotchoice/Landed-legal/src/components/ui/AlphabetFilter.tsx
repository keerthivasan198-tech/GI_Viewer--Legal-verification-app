import React from 'react';

interface AlphabetFilterProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
  className?: string;
}

export const AlphabetFilter: React.FC<AlphabetFilterProps> = ({
  selectedLetter,
  onSelectLetter,
  className = ''
}) => {
  const letters = [
    'ALL',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ];

  return (
    <div className={`flex flex-wrap gap-1 p-2 bg-slate-50/80 border border-slate-200/90 rounded-xl overflow-x-auto custom-scrollbar ${className}`}>
      {letters.map((char) => {
        const isActive = selectedLetter === char;
        return (
          <button
            key={char}
            type="button"
            onClick={() => onSelectLetter(char)}
            className={`min-w-[28px] h-7 px-1.5 text-xs font-bold rounded-lg transition-all duration-150 ${
              isActive
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white border border-slate-200/90 text-slate-700 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            {char}
          </button>
        );
      })}
    </div>
  );
};
