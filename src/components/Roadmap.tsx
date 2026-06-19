/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ROADMAP_DATA } from '../data';
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';

export default function Roadmap() {
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(0);

  const selectedPhase = ROADMAP_DATA.find(p => p.id === selectedPhaseId) || ROADMAP_DATA[0];

  return (
    <section id="roadmap" className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div id="roadmap-badge" className="text-xs text-zinc-400 font-medium tracking-widest uppercase mb-3">
          JALUR BELAJAR ELEGAN
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display text-white font-normal leading-tight mb-6">
          8 Fase Menuju <span className="italic text-zinc-400">Kelancaran Harian</span>
        </h2>
        <p className="text-zinc-300 font-light font-sans text-sm sm:text-base leading-relaxed">
          Kami memecah kurikulum intensif 150 jam belajar menjadi langkah-langkah mikro yang ramah dipahami. 
          Pilih fase Anda untuk menyibak detail materi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left column: Phase Selectors (8 steps vertical stack or simple bento style) */}
        <div id="phase-list-column" className="lg:col-span-5 space-y-4">
          <div className="text-xs uppercase tracking-widest text-zinc-500 font-medium px-2 mb-2">
            Daftar Langkah Belajar
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {ROADMAP_DATA.map((phase) => {
              const isActive = phase.id === selectedPhaseId;
              return (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhaseId(phase.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                    isActive 
                      ? 'bg-white/10 border-white/20 text-white font-medium shadow-md' 
                      : 'bg-white/2 hover:bg-white/5 border-white/5 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex gap-4 items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border font-medium ${
                      isActive 
                        ? 'bg-white text-slate-900 border-white' 
                        : 'bg-white/5 border-white/10 text-zinc-300 group-hover:bg-white/10'
                    }`}>
                      {phase.id}
                    </span>
                    <div>
                      <h4 className="text-base font-sans font-medium line-clamp-1">{phase.title}</h4>
                      <p className="text-xs text-zinc-500 font-light mt-0.5 line-clamp-1">{phase.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 text-white' : 'text-zinc-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Dynamic Display of chosen Phase */}
        <div id="phase-details-column" className="lg:col-span-7">
          <div className="liquid-glass rounded-3xl p-8 sm:p-10 border border-white/10 divide-y divide-white/5 flex flex-col justify-between min-h-[500px]">
            
            {/* Header phase */}
            <div className="pb-6">
              <div id="active-phase-badge" className="text-xs bg-white/10 border border-white/10 rounded-full px-3 py-1 inline-flex items-center gap-1.5 text-zinc-200 uppercase tracking-widest font-semibold mb-4">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                Fase {selectedPhase.id} Detail
              </div>
              <h3 className="text-3xl sm:text-4xl font-display text-white font-normal mb-2">
                {selectedPhase.title}
              </h3>
              <p className="text-base font-light font-display italic text-zinc-300 mb-4">
                "{selectedPhase.subtitle}"
              </p>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                {selectedPhase.description}
              </p>
            </div>

            {/* Target & Themes */}
            <div className="py-6 space-y-5">
              <div id="phase-target" className="flex items-start gap-3 bg-white/3 p-4 rounded-2xl border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Hasil Akhir yang Ditargetkan</h5>
                  <p className="text-sm text-zinc-200 font-light mt-0.5">{selectedPhase.target}</p>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Topik Utama Pembelajaran</h5>
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedPhase.themes.map((theme, i) => (
                    <span 
                      key={i}
                      className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-zinc-300 font-light"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Grammar Points & Text Book Reference */}
            <div className="pt-6 space-y-4">
              <div>
                <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Pola Tata Bahasa & Teori Inti</h5>
                <ul className="space-y-2 text-sm text-zinc-300 font-light pl-1">
                  {selectedPhase.grammarPoints.map((point, i) => (
                    <li key={i} className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div id="textbook-pairing" className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Rujukan Buku Ajar:</span>
                  <span className="text-zinc-300 font-medium">{selectedPhase.lessonReferences.join(', ')}</span>
                </div>
                <span className="text-stone-400 uppercase tracking-widest text-[10px]">
                  Rukaaijass Verified
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
