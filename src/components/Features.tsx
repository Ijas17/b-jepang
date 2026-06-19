/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Gamepad2, Volume2, Sliders, Moon, GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export default function Features() {
  const listKeunggulan = [
    {
      icon: <GraduationCap className="w-6 h-6 text-zinc-300" />,
      title: "Jalur Belajar Berstruktur",
      desc: "Kurikulum komprehensif 8 fase dari nol mutlak (Fase 0) hingga kelancaran harian menyamai standar buku ajar prestisius Minna no Nihongo Dasar I."
    },
    {
      icon: <Gamepad2 className="w-6 h-6 text-zinc-300" />,
      desc: "Tidak sekadar menghafal pasif. Anda dilatih aktif lewat permainan interaktif seperti Karuta, Memory Match, dan Particle Runner.",
      title: "10 Mini-Game Pembelajar"
    },
    {
      icon: <Volume2 className="w-6 h-6 text-zinc-300" />,
      title: "Audio Native & Shadowing",
      desc: "Setiap ungkapan dan contoh tanya-jawab dibekali audio berkecepatan ganda (Kecepatan lambat untuk belajar & Kecepatan natural untuk terbiasa mendengar)."
    },
    {
      icon: <Sliders className="w-6 h-6 text-zinc-300" />,
      title: "Personalisasi Suasana",
      desc: "Integrasikan musik latar tenang (Japanese Lofi, Hujan di Kyoto) dengan kendali suara independen yang tidak meredam vokal pelajaran."
    },
    {
      icon: <Moon className="w-6 h-6 text-zinc-300" />,
      title: "Mode Fokus & Layar Tenang",
      desc: "Dirancang ramah untuk neurodivergen dan pengguna yang mudah lelah. Tanpa waktu agresif, warna lembut, dan kebebasan mengulang penjelasan."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-zinc-300" />,
      title: "Aturan Notasi Akurat",
      desc: "Mempelajari detail partikel, ungkapan kelas, penanda pilihan (variasi), dan unsur kultural Jepang yang relevan di kehidupan nyata."
    }
  ];

  return (
    <section id="keunggulan" className="relative z-10 py-24 border-t border-b border-white/5 bg-slate-950/40 backdrop-blur-md">
      <div id="features-container" className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="text-xs text-zinc-400 font-medium tracking-widest uppercase mb-3">
            BEDA DENGAN APLIKASI BIASA
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display text-white font-normal leading-tight mb-6">
            Pendekatan Lembut, <span className="italic text-zinc-400">Hasil Nyata</span>
          </h2>
          <p className="text-zinc-300 font-light leading-relaxed">
            Menyatukan kebahagiaan simulasi bermain dengan ketajaman ilmu sekolah bahasa Jepang digital. 
            Tanpa intimidasi, tanpa rasa pusing.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listKeunggulan.map((feat, index) => (
            <div 
              key={index}
              className="liquid-glass rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group hover:border-white/10"
            >
              <div id={`feat-icon-${index}`} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:bg-white/10 transition-colors">
                {feat.icon}
              </div>
              <h3 className="text-2xl font-display text-white font-normal mb-3">
                {feat.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Highlight quote box */}
        <div id="quote-card" className="mt-20 liquid-glass rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto border border-white/5">
          <h4 className="text-xl sm:text-2xl font-display italic text-zinc-300 font-light leading-relaxed mb-4">
            "Bahasa Jepang bukan sekadar hafalan kosakata acak. Itu adalah jalinan ritme bunyi, 
            karakter indah, dan tata krama bertutur harian yang bisa dikuasai siapapun secara sabar."
          </h4>
          <span className="text-xs font-semibold tracking-widest uppercase text-white">
            — Kurikulum Utama RukaaIjass
          </span>
        </div>

      </div>
    </section>
  );
}
