/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UNGKAPAN_KELAS_SALAM } from '../data';
import { Moon, EyeOff, BookOpen, Volume2, Sparkles, Check, HelpCircle } from 'lucide-react';

interface FocusSectionProps {
  isFocusModeActive: boolean;
  onToggleFocusMode: (val: boolean) => void;
}

export default function FocusSection({ isFocusModeActive, onToggleFocusMode }: FocusSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Ungkapan Kelas' | 'Salam Sehari-hari'>('all');
  const [selectedExpression, setSelectedExpression] = useState<any>(UNGKAPAN_KELAS_SALAM[0]);

  const filteredExpressions = selectedCategory === 'all' 
    ? UNGKAPAN_KELAS_SALAM 
    : UNGKAPAN_KELAS_SALAM.filter(exp => exp.cat === selectedCategory);

  // Play Beep helper for interactive sound response
  const triggerAudioTick = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // ignore
    }
  };

  return (
    <section id="fokus" className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto border-b border-white/5">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div id="focus-badge" className="text-xs text-zinc-400 font-medium tracking-widest uppercase mb-3 bg-white/5 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 animate-pulse">
          <Moon className="w-4.5 h-4.5 text-zinc-350" />
          Mode Fokus Tenang
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display text-white font-normal leading-tight mb-6">
          Suasana Belajar <span className="italic text-zinc-400">Minim Distraksi</span>
        </h2>
        <p className="text-zinc-300 font-light text-sm sm:text-base leading-relaxed">
          Bila layar terasa terlalu ramai, Anda dapat beralih ke Mode Fokus Tenang yang meredupkan komponen 
          luar demi memfokuskan kelopak mata Anda pada teks materi pelajaran bahasa Jepang.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Column: Interactive Mode Toggle Controller */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="liquid-glass rounded-3xl p-8 border border-white/10 space-y-6 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">Metode Sabar & Rileks</span>
              <h3 className="text-3xl font-display text-white mt-1 mb-4">Uji Coba Mode Fokus</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light mb-6">
                Belajar bahasa asing bagi sebagian pengguna neurodivergen atau pemula total membutuhkan kelonggaran jeda 
                tanpa dipaksa oleh batasan waktu. Aktifkan sakelar di bawah ini dan rasakan kedamaian.
              </p>
            </div>

            <div className="bg-slate-950/20 p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-350">Status Mode Fokus</h4>
                <p className="text-sm text-white font-medium mt-1">
                  {isFocusModeActive ? 'Aktif — Layar sekunder sedang meredup' : 'Tidak Aktif — Layar normal'}
                </p>
                <p className="text-[11px] text-zinc-500 font-light mt-1">
                  Membantu mengurangi kelelahan mata saat belajar bahasa Jepang.
                </p>
              </div>
              
              <button
                onClick={() => {
                  triggerAudioTick();
                  onToggleFocusMode(!isFocusModeActive);
                }}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border hover:scale-102 active:scale-98 ${
                  isFocusModeActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <Moon className={`w-4 h-4 ${isFocusModeActive ? 'animate-pulse' : ''}`} />
                {isFocusModeActive ? 'Matikan Mode Fokus' : 'Aktifkan Mode Fokus'}
              </button>
            </div>

            <div className="mt-6 border-t border-white/5 pt-6 text-[11px] text-zinc-500 font-light space-y-2">
              <p className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1 shrink-0" />
                <span>Tanpa batas hitung mundur yang intimidatif di area kuis.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1 shrink-0" />
                <span>Glosarium istilah tata bahasa dapat dibuka secara bertahap saat dirasa perlu.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Ungkapan Kelas & Salam Interaktif */}
        <div id="ungkapan-vocab-column" className="lg:col-span-7">
          <div className="liquid-glass rounded-3xl p-8 border border-white/10 flex flex-col justify-between h-full min-h-[480px]">
            
            {/* Filter buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-5">
              <div>
                <span className="text-[10px] uppercase font-semibold text-zinc-550">Indeks Salam Terjemahan</span>
                <h4 className="text-xl font-display text-white font-normal">Ungkapan Inti Guru & Kelas</h4>
              </div>

              <div className="flex gap-2 text-[11px]">
                {['all', 'Ungkapan Kelas', 'Salam Sehari-hari'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as any)}
                    className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      selectedCategory === cat 
                        ? 'bg-white/10 text-white font-medium border border-white/10' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {cat === 'all' ? 'Semua' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout grid divided */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 items-start">
              
              {/* List left */}
              <div id="expressions-scroller" className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {filteredExpressions.map((exp, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      triggerAudioTick();
                      setSelectedExpression(exp);
                      playFakeExpressionSound(exp.jp);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex justify-between items-center ${
                      selectedExpression.jp === exp.jp 
                        ? 'bg-white/10 border-white/10 text-white font-semibold' 
                        : 'bg-white/2 hover:bg-white/5 border-white/5 text-zinc-400'
                    }`}
                  >
                    <span className="truncate">{exp.jp}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 bg-white/5 rounded-full text-zinc-500">{exp.cat === 'Ungkapan Kelas' ? 'Kelas' : 'Salam'}</span>
                  </button>
                ))}
              </div>

              {/* Detail view right */}
              <div id="expression-detail" className="bg-slate-950/25 p-5 rounded-2xl border border-white/5 text-center flex flex-col justify-center items-center min-h-[220px]">
                <BookOpen className="w-6 h-6 text-zinc-650 mb-3" />
                <h4 className="text-lg text-white font-medium select-all leading-relaxed">
                  {selectedExpression?.jp}
                </h4>
                
                <p className="text-xs text-zinc-400 italic font-mono mt-1 mb-4">
                  Bahasa di Kelas
                </p>

                <div className="w-full border-t border-white/5 pt-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Makna Indonesia:</span>
                  <p className="text-sm text-zinc-200">
                    {selectedExpression?.id}
                  </p>
                </div>

                <button
                  onClick={() => {
                    triggerAudioTick();
                    playFakeExpressionSound(selectedExpression?.jp);
                  }}
                  className="mt-6 flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-xs px-4 py-2 rounded-full text-zinc-300 hover:text-white transition-all cursor-pointer border border-white/5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Dengar Pelafalan
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

// Native Speech Synthesis with Japanese locale, falls back to sweet synthetic soundscape
function playFakeExpressionSound(jpText: string) {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Silences previous utterances immediately
      const utterance = new SpeechSynthesisUtterance(jpText);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85; // slightly relaxed for learner comfort
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
      return;
    }
  } catch (err) {
    console.warn("Speech synthesis unavailable, employing oscillator synth fallback", err);
  }

  // Backup synthetic oscillator feedback
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const length = jpText.length;
    let timeOffset = audioCtx.currentTime;

    for (let i = 0; i < length; i += 2) {
      const charCode = jpText.charCodeAt(i);
      const freq = 180 + (charCode % 12) * 20;
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, timeOffset);
      
      gainNode.gain.setValueAtTime(0.06, timeOffset);
      gainNode.gain.exponentialRampToValueAtTime(0.001, timeOffset + 0.12);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(timeOffset);
      osc.stop(timeOffset + 0.14);
      
      timeOffset += 0.14;
    }
  } catch (e) {
    // Sandbox blocked
  }
}
