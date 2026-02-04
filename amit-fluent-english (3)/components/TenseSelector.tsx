
import React from 'react';
import { TenseCategory } from '../types';

interface Props {
  selected: TenseCategory;
  onSelect: (cat: TenseCategory) => void;
}

const TenseSelector: React.FC<Props> = ({ selected, onSelect }) => {
  const categories = Object.values(TenseCategory);
  
  return (
    <div className="bg-white border-b border-slate-100 overflow-x-auto sticky top-[60px] z-40 no-scrollbar">
      <div className="flex gap-2 px-4 py-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selected === cat 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TenseSelector;
