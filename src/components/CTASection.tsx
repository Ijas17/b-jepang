/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Calendar, BookOpen, Clock, Heart, ArrowRight } from 'lucide-react';

export default function CTASection() {
  const [goal, setGoal] = useState<'percakapan' | 'anime' | 'wisata' | 'kerja'>('percakapan');
  const [commitment, setCommitment] = useState<'santai' | 'rutin' | 'intensif'>('rutin');
  const [userName, setUserName] = useState('');
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Sound feedback tick
  const triggerTick = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Ignore
    }
  };

  const currentPlan = {
    percakapan: {
      desc: "Fokus berbicara luwes untuk bersosialisasi.",
      time: "12 Minggu penyelesaian Fase 0 s/d Fase 8.",
      materials: "Penekanan pada Pola Tanya Jawab (Latihan C) & Dialog Bercabang.",
      streakGoal: "Rekomendasi streak harian: 5 Hari/Minggu."
    },
    anime: {
      desc: "Menghayati logat natural & ungkapan tanpa harfiah.",
      time: "8 Minggu penyelesaian Fase 0 s/d Fase 4 sebagai fondasi.",
      materials: "Penekanan pada Listening Bingo, Vokal Panjang, & Gaya Potong Kasual.",
      streakGoal: "Rekomendasi streak harian: 3 Hari/Minggu."
    },
    wisata: {
      desc: "Praktis menyewa tiket, bertanya arah, & memesan kuliner.",
      time: "6 Minggu penyelesaian Kilat (Pelajaran 1 - 12).",
      materials: "Penekanan pada Kata Tunjuk Arah (Pelajaran 3) & Simulasi Belanja.",
      streakGoal: "Rekomendasi streak harian: 4 Hari/Minggu."
    },
    kerja: {
      desc: "Formalitas kerja, etos komunikasi, & permohonan santun.",
      time: "24 Minggu komprehensif (Fase 1 s/d Fase 8 penuh).",
      materials: "Penekanan khusus pada Tatabahasa formal & 600 Kanji Utama.",
      streakGoal: "Rekomendasi streak harian: 7 Hari/Minggu (Intensif)."
    }
  }[goal];

  const durationText = commitment === 'santai' 
    ? '10-15 Menit / Hari' 
    : commitment === 'rutin' 
      ? '20-30 Menit / Hari' 
      : '45-60 Menit / Hari';

  return (
    <section id="onboarding" className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto text-center">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Title */}
        <div className="mb-12">
          <div id="cta-badge" className="text-xs text-zinc-400 font-medium tracking-widest uppercase mb-3 bg-white/5 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            MULAI PERJALANAN ANDA
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display text-white font-normal leading-tight mb-4">
            Rangkai Rencana <span className="italic text-zinc-400">Belajar Pribadi</span>
          </h2>
          <p className="text-zinc-300 font-light text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Tidak perlu tergesa-gesa. Onboarding kami menghitung kurikulum adaptif berdasarkan target, 
            minat minat, serta waktu kesenggangan harian Anda.
          </p>
        </div>

        {/* Input parameters card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left">
          
          <div className="liquid-glass rounded-3xl p-8 border border-white/10 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-2xl font-display text-white mb-2">Formulir Onboarding</h3>
              
              {/* Name */}
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block mb-2">Nama atau Panggilan:</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Contoh: Ruka"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-all font-sans"
                />
              </div>

              {/* Goal Category selector */}
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block mb-2">Tujuan Utama Belajar:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'percakapan', label: 'Percakapan Harian' },
                    { id: 'anime', label: 'Memahami Anime' },
                    { id: 'wisata', label: 'Wisata Ke Jepang' },
                    { id: 'kerja', label: 'Kerja / Studi' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        triggerTick();
                        setGoal(opt.id as any);
                      }}
                      className={`px-3 py-2.5 rounded-xl border text-[11px] font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                        goal === opt.id 
                          ? 'bg-white text-slate-950 border-white' 
                          : 'bg-white/3 text-zinc-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Habit commitment */}
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block mb-2">Komitmen Waktu Harian:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'santai', label: 'Santai' },
                    { id: 'rutin', label: 'Rutin' },
                    { id: 'intensif', label: 'Intensif' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        triggerTick();
                        setCommitment(opt.id as any);
                      }}
                      className={`px-2 py-2.5 rounded-xl border text-[11px] font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                        commitment === opt.id 
                          ? 'bg-white text-slate-950 border-white font-bold' 
                          : 'bg-white/3 text-zinc-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                triggerTick();
                setShowRecommendation(true);
              }}
              className="liquid-glass text-white border border-white/20 w-full py-4 mt-8 rounded-full text-xs font-semibold tracking-widest uppercase hover:scale-[1.03] active:scale-[98%] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Rancang Rencana Belajar
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right side: Tailored recommendations card based on active parameters */}
          <div className="liquid-glass rounded-3xl p-8 border border-white/10 flex flex-col justify-between">
            {showRecommendation ? (
              <div className="space-y-6 animate-fade-rise flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider bg-emerald-500/10 px-2 py-1 rounded inline-block mb-3">Rencana Terhitung Berhasil</span>
                  <h3 className="text-2xl font-display text-white mb-2">
                    {userName ? `Rencana ${userName}` : 'Rencana Personal Anda'}
                  </h3>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed">
                    Berdasarkan target <span className="text-white font-medium">{goal}</span> dengan ritme pembiasaan <span className="text-white font-medium">{commitment}</span>.
                  </p>
                </div>

                <div className="divide-y divide-white/5 space-y-4 pt-4 flex-1">
                  
                  <div className="flex gap-4 items-start pt-4">
                    <Clock className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Durasi Belajar Nyaman</h4>
                      <p className="text-sm text-zinc-200 font-light mt-0.5">{durationText}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start pt-4">
                    <BookOpen className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Estimasi Penyelesaian</h4>
                      <p className="text-sm text-zinc-200 font-light mt-0.5">{currentPlan.time}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start pt-4">
                    <Calendar className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Peta Fokus Utama Latihan</h4>
                      <p className="text-sm text-zinc-200 font-light mt-0.5">{currentPlan.materials}</p>
                    </div>
                  </div>

                </div>

                <div className="text-xs text-zinc-500 italic font-light pt-6 border-t border-white/5">
                  {currentPlan.streakGoal}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center my-auto space-y-4 py-12">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-display text-white font-normal">Hasil Peta Rencana Menanti</h4>
                <p className="text-xs text-zinc-500 font-light max-w-xs leading-relaxed">
                  Isi formulir dan ketuk tombol di samping untuk menghasilkan rekomendasi dan 
                  metodologi belajar personal dari RukaaIjass.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Brand foot text */}
        <div className="mt-20 border-t border-white/5 pt-8 text-xs text-zinc-650 font-normal">
          <p>© 2026 — RukaaIjass. Menyambut Masa Depan Belajar Bahasa Jepang Tanpa Rasa Takut.</p>
        </div>

      </div>
    </section>
  );
}
