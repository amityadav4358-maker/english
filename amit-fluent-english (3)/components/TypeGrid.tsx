
import React from 'react';
import { TenseCategory, SubType } from '../types';
import { CATEGORY_TYPES } from '../constants';

interface Props {
  category: TenseCategory;
  selected: SubType;
  onSelect: (type: SubType) => void;
}

const TypeGrid: React.FC<Props> = ({ category, selected, onSelect }) => {
  const types = CATEGORY_TYPES[category] || [];

  const getEmoji = (type: string) => {
    if (type.includes('Simple')) return '⚡';
    if (type.includes('Continuous')) return '🌊';
    if (type.includes('Perfect')) return '✨';
    if (type.includes('Can')) return '🎯';
    if (type.includes('Should')) return '💎';
    if (type.includes('Must')) return '🔥';
    if (type.includes('Could')) return '☁️';
    if (type.includes('Used To')) return '🕰️';
    if (type.includes('Passive')) return '📡';
    if (type.includes('Comparative')) return '⚖️';
    if (type.includes('Superlative')) return '👑';
    if (type.includes('Zero') || type.includes('First') || type.includes('Second')) return '🖇️';
    return '📚';
  };

  return (
    <div className="grid grid-cols-2 gap-3 py-4">
      {types.map((t) => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className={`relative overflow-hidden p-4 rounded-3xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 group active:scale-95 ${
            selected === t
              ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100 ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
          }`}
        >
          {selected === t && (
            <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 rounded-bl-3xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          )}
          <span className={`text-2xl transition-transform duration-500 ${selected === t ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`}>
            {getEmoji(t)}
          </span>
          <span className={`text-[10px] font-black tracking-widest uppercase text-center leading-tight ${selected === t ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
            {t}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TypeGrid;
