/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Play, BookOpen, Volume2, Shield } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
  onExplorationClick: () => void;
}

export default function Hero({ onStartClick, onExplorationClick }: HeroProps) {
  return (
    <section 
      id="hero-section" 
      className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 min-h-[90vh]"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
        
        {/* Over-header Tag */}
        <div id="hero-tag" className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 animate-fade-rise backdrop-blur-md select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-medium tracking-widest text-zinc-300 uppercase">
            JALUR BELAJAR BERTAHAP MINNA NO NIHONGO
          </span>
        </div>

        {/* Cinematic Headline */}
        <h1 
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-4xl font-normal text-white font-display mb-8 animate-fade-rise"
        >
          Belajar Bahasa Jepang <br />
          <span className="text-zinc-400 italic">dari nol</span> sampai <span className="text-zinc-100 underline decoration-zinc-500 underline-offset-8">lancar harian</span>.
        </h1>

        {/* Subheadline explaining the PRD core values */}
        <p 
          className="text-lg sm:text-xl text-zinc-300 font-sans font-light max-w-2xl leading-relaxed mb-12 animate-fade-rise-delay"
        >
          Seperti guru pribadi yang sabar dan tenang. Kami memandu Anda memecahkan kesulitan 
          aksara Kana, pola kalimat terstruktur, percakapan sehari-hari, hingga 300 kanji utama 
          tanpa rasa cemas atau kewalahan.
        </p>

        {/* Hero Actions using Liquid Glass styled controls */}
        <div 
          id="hero-actions" 
          className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full max-w-md animate-fade-rise-delay-2"
        >
          <button
            onClick={onStartClick}
            className="liquid-glass text-white px-8 py-4 rounded-full text-base font-semibold tracking-wider hover:scale-[1.03] active:scale-[98%] transition-all cursor-pointer shadow-lg w-full sm:w-auto flex items-center justify-center gap-2 group border border-white/20"
          >
            Mulai Dari Fase 0
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExplorationClick}
            className="px-8 py-4 rounded-full text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5 border border-white/5 backdrop-blur-xs transition-all w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-white/90" />
            Eksplorasi Kurikulum
          </button>
        </div>

        {/* Micro highlights in the footer of the hero */}
        <div 
          id="hero-highlights" 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 max-w-4xl border-t border-white/5 pt-10 text-center animate-fade-rise-delay-2"
        >
          <div className="flex flex-col items-center">
            <span className="text-xs text-zinc-500 uppercase tracking-widest mb-1.5">Metodologi</span>
            <span className="text-sm font-medium text-zinc-300">Minna no Nihongo</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-zinc-500 uppercase tracking-widest mb-1.5">Sistem Latihan</span>
            <span className="text-sm font-medium text-zinc-300">10 Mini-Game Aktif</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-zinc-500 uppercase tracking-widest mb-1.5">Membantu Fokus</span>
            <span className="text-sm font-medium text-zinc-300">Playlist Audio Lofi</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-zinc-500 uppercase tracking-widest mb-1.5">Mode Belajar</span>
            <span className="text-sm font-medium text-zinc-300">Bebas Stres & Tenang</span>
          </div>
        </div>

      </div>
    </section>
  );
}
