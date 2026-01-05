import React, { useState } from 'react';
import { Sigma } from 'lucide-react';
import { MATH_GROUPS } from '../../constants/math';

export default function MathToolbar({ onInsert, katexLoaded }) {
  const [activeGroup, setActiveGroup] = useState('structures');

  return (
    <div className="flex flex-col w-full bg-slate-50 border-b border-slate-200">
      <div className="flex px-2 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2 py-1 px-2 text-xs font-bold text-blue-700 uppercase tracking-wider select-none">
            <Sigma size={14} /> Equation Tools
        </div>
        <div className="h-4 w-px bg-slate-300 mx-2 self-center"></div>
        {Object.entries(MATH_GROUPS).map(([key, group]) => (
          <button
            key={key}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setActiveGroup(key)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors border-b-2 ${activeGroup === key ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className={`flex flex-wrap ${activeGroup === 'multidim' ? 'gap-2' : 'gap-1'} p-2 items-center`}>
        {MATH_GROUPS[activeGroup].symbols.map((sym, idx) => {
            const isStructure = activeGroup === 'structures' || activeGroup === 'multidim';
            const isMatrix = activeGroup === 'multidim';
            return (
               <button
                 key={idx}
                 onMouseDown={(e) => { e.preventDefault(); onInsert(sym.cmd); }}
                 className={`${isMatrix ? 'px-3' : (isStructure ? 'w-10 px-2' : 'w-8')} h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm hover:border hover:border-slate-200 text-slate-700 text-sm transition-all`}
                 title={sym.desc || sym.cmd}
               >
                 {sym.preview && katexLoaded && typeof window !== 'undefined' && window.katex ? (
                   <span className="leading-none" dangerouslySetInnerHTML={{ __html: window.katex.renderToString(sym.preview, { displayMode: false, throwOnError: false }) }} />
                 ) : (
                   sym.char ? sym.char : <span className="font-sans text-xs">{sym.label}</span>
                 )}
               </button>
            )
        })}
      </div>
    </div>
  );
}
