/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, BookOpen, Clock, ArrowRight, AlertCircle } from 'lucide-react';

interface CTASectionProps {
  onOnboardingComplete?: () => void;
}

export default function CTASection({ onOnboardingComplete }: CTASectionProps) {
  const [highlightError, setHighlightError] = useState('');
  const [highlightFlash, setHighlightFlash] = useState(false);
  const [isRancanging, setIsRancanging] = useState(false);
  const [isEnteringClass, setIsEnteringClass] = useState(false);

  // Field validation errors state
  const [errors, setErrors] = useState<{
    userName?: boolean;
    targetNLevel?: boolean;
    studyHours?: boolean;
  }>({});

  // Initialize state from local storage with legacy support and migration mapping
  const [userName, setUserName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ruka_onboarding');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.userName || parsed.name || '';
      }
    } catch (e) {}
    return '';
  });

  const [targetNLevel, setTargetNLevel] = useState<'N1' | 'N2' | 'N3' | 'N4' | 'N5' | ''>(() => {
    try {
      const saved = localStorage.getItem('ruka_onboarding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.targetNLevel) return parsed.targetNLevel;
        // Legacy goal fallback mapping
        if (parsed.goal === 'kerja') return 'N2';
        if (parsed.goal === 'percakapan') return 'N4';
        if (parsed.goal === 'anime') return 'N3';
        if (parsed.goal === 'wisata') return 'N5';
      }
    } catch (e) {}
    return '';
  });

  const [studyHours, setStudyHours] = useState<'1' | '2' | '3' | '5' | ''>(() => {
    try {
      const saved = localStorage.getItem('ruka_onboarding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studyHours) return parsed.studyHours;
        // Legacy commitment fallback mapping
        if (parsed.commitment === 'santai') return '1';
        if (parsed.commitment === 'rutin') return '2';
        if (parsed.commitment === 'intensif') return '3';
      }
    } catch (e) {}
    return '';
  });

  const [showRecommendation, setShowRecommendation] = useState(() => {
    try {
      const saved = localStorage.getItem('ruka_onboarding');
      if (saved) {
        return JSON.parse(saved).completed || false;
      }
    } catch (e) {}
    return false;
  });

  // Track modifications in inputs to save to localStorage immediately upon each change
  useEffect(() => {
    try {
      let isCompleted = false;
      const saved = localStorage.getItem('ruka_onboarding');
      if (saved) {
        isCompleted = JSON.parse(saved).completed || false;
      }
      const data = {
        userName,
        targetNLevel,
        studyHours,
        completed: isCompleted,
        // Keep backward compatible options
        name: userName,
        goal: targetNLevel === 'N5' ? 'wisata' : targetNLevel === 'N4' ? 'percakapan' : targetNLevel === 'N3' ? 'anime' : 'kerja',
        commitment: studyHours === '1' ? 'santai' : studyHours === '2' ? 'rutin' : 'intensif'
      };
      localStorage.setItem('ruka_onboarding', JSON.stringify(data));
    } catch (e) {}
  }, [userName, targetNLevel, studyHours]);

  // Sync state with other parts of the app
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('ruka_onboarding');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.userName !== undefined) setUserName(parsed.userName);
          if (parsed.targetNLevel !== undefined) {
            setTargetNLevel(parsed.targetNLevel);
          } else if (parsed.goal !== undefined) {
            // map legacy goal to NLevel
            if (parsed.goal === 'kerja') setTargetNLevel('N2');
            else if (parsed.goal === 'percakapan') setTargetNLevel('N4');
            else if (parsed.goal === 'anime') setTargetNLevel('N3');
            else if (parsed.goal === 'wisata') setTargetNLevel('N5');
          }

          if (parsed.studyHours !== undefined) {
            setStudyHours(parsed.studyHours);
          } else if (parsed.commitment !== undefined) {
            // map legacy commitment to studyHours
            if (parsed.commitment === 'santai') setStudyHours('1');
            else if (parsed.commitment === 'rutin') setStudyHours('2');
            else if (parsed.commitment === 'intensif') setStudyHours('3');
          }

          if (parsed.completed !== undefined) setShowRecommendation(parsed.completed);
        }
      } catch (e) {}
    };

    window.addEventListener('ruka_onboarding_changed', handleSync);
    return () => {
      window.removeEventListener('ruka_onboarding_changed', handleSync);
    };
  }, []);

  // Highlight scroll request listener (triggered from other starting actions)
  useEffect(() => {
    const handleHighlight = () => {
      setHighlightFlash(true);
      setHighlightError('Silakan isi nama Anda dan rancang rencana untuk masuk kelas belajar! 🌸');
      setTimeout(() => setHighlightFlash(false), 2000);
    };
    window.addEventListener('ruka_onboarding_scroll_highlight', handleHighlight);
    return () => {
      window.removeEventListener('ruka_onboarding_scroll_highlight', handleHighlight);
    };
  }, []);

  // Sound feedback ticks
  const triggerTick = (freq = 587.33) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  };

  // Form input validation logic
  const validateForm = () => {
    const newErrors: { userName?: boolean; targetNLevel?: boolean; studyHours?: boolean } = {};
    let isHeadingError = '';

    if (!userName.trim()) {
      newErrors.userName = true;
      isHeadingError = 'Mohon lengkapi formulir pendaftaran Anda.';
    }
    if (!targetNLevel) {
      newErrors.targetNLevel = true;
      if (!isHeadingError) isHeadingError = 'Mohon tentukan Target Tingkat JLPT N-Level.';
    }
    if (!studyHours) {
      newErrors.studyHours = true;
      if (!isHeadingError) isHeadingError = 'Mohon pilih komitmen jam belajar harian Anda.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setHighlightError(isHeadingError || 'Mohon lengkapi seluruh isian bertanda bintang atau berwarna merah. 🌸');
      setHighlightFlash(true);
      triggerTick(220); // Alert low pitch sound
      setTimeout(() => setHighlightFlash(false), 2000);
      return false;
    }

    setHighlightError('');
    return true;
  };

  // Active form changes handler that clears individual field error immediately
  const handleNameChange = (val: string) => {
    setUserName(val);
    if (errors.userName) {
      setErrors(prev => ({ ...prev, userName: false }));
    }
    if (highlightError) setHighlightError('');
  };

  const handleNLevelChange = (val: 'N1' | 'N2' | 'N3' | 'N4' | 'N5') => {
    triggerTick(440);
    setTargetNLevel(val);
    if (errors.targetNLevel) {
      setErrors(prev => ({ ...prev, targetNLevel: false }));
    }
    if (highlightError) setHighlightError('');
  };

  const handleHoursChange = (val: '1' | '2' | '3' | '5') => {
    triggerTick(493.88);
    setStudyHours(val);
    if (errors.studyHours) {
      setErrors(prev => ({ ...prev, studyHours: false }));
    }
    if (highlightError) setHighlightError('');
  };

  // Dynamic tailored curriculum values based on states
  const getPlanDetails = (nLevel: string, hours: string) => {
    let desc = "Fokus pola kalimat dasar & kosakata harian.";
    let time = "10 Minggu penyelesaian.";
    let materials = "Penekanan pada Tata Bahasa dasar & Kosakata.";
    let streakGoal = "Rekomendasi belajar: 5 Hari / Minggu.";

    if (nLevel === 'N5') {
      desc = "Memahami tatabahasa dasar pemula & aksara Hiragana/Katakana.";
      materials = "Partikel Dasar (wa, ga, o, ni), pola kalimat desu/masu, & angka dasar.";
      const weeks = hours === '1' ? 12 : hours === '2' ? 8 : hours === '3' ? 6 : 4;
      time = `${weeks} Minggu Rencana Belajar Terpandu.`;
    } else if (nLevel === 'N4') {
      desc = "Bercakap-cakap santai sehari-hari & mendengarkan percakapan tempo lambat.";
      materials = "Ungkapan sopan & kasual formal, 300 kosakata Kanji, & konjugasi kata kerja.";
      const weeks = hours === '1' ? 16 : hours === '2' ? 12 : hours === '3' ? 8 : 6;
      time = `${weeks} Minggu Rencana Belajar Kelas N4.`;
    } else if (nLevel === 'N3') {
      desc = "Menjembatani ke kefasihan menengah, memahami artikel berita sederhana.";
      materials = "Idiom kasual natural, visualisasi tata bahasa kompleks, & 650 Kanji utama.";
      const weeks = hours === '1' ? 24 : hours === '2' ? 18 : hours === '3' ? 12 : 9;
      time = `${weeks} Minggu Kurikulum N3 Menengah.`;
    } else if (nLevel === 'N2') {
      desc = "Tingkat komunikasi bisnis, mampu bekerja profesional dalam lingkungan Jepang.";
      materials = "Keigo format bisnis (Henshin), 1,000 Kanji kompleks, opini koran sosial.";
      const weeks = hours === '1' ? 36 : hours === '2' ? 24 : hours === '3' ? 18 : 12;
      time = `${weeks} Minggu Program Semi-Profesional.`;
    } else if (nLevel === 'N1') {
      desc = "Kefasihan total setara penutur asli, mendebat topik abstrak.";
      materials = "Literatur klasik fiksi, koran editorial, visualisasi Kanji tingkat lanjut (2000+).";
      const weeks = hours === '1' ? 48 : hours === '2' ? 36 : hours === '3' ? 24 : 18;
      time = `${weeks} Minggu Program Master Khusus N1.`;
    }

    if (hours === '1') {
      streakGoal = "Rekomendasi: Minimal 4 Hari / Minggu (Komitmen Santai).";
    } else if (hours === '2') {
      streakGoal = "Rekomendasi: Minimal 5 Hari / Minggu (Konsistensi Kuat).";
    } else if (hours === '3') {
      streakGoal = "Rekomendasi: Minimal 6 Hari / Minggu (Komitmen Tinggi).";
    } else if (hours === '5') {
      streakGoal = "Rekomendasi: 7 Hari / Minggu Tangguh (Ritme Kilat Tanpa Jeda).";
    }

    return { desc, time, materials, streakGoal };
  };

  const planInfo = getPlanDetails(targetNLevel || 'N5', studyHours || '2');

  const durationText = studyHours === '1'
    ? '1 Jam / Hari (Santai)'
    : studyHours === '2'
      ? '2 Jam / Hari (Standar)'
      : studyHours === '3'
        ? '3-4 Jam / Hari (Intensif)'
        : studyHours === '5'
          ? '>=5 Jam / Hari (Sangat Berdedikasi)'
          : 'Belum Ditentukan';

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
            Tidak perlu tergesa-gesa. Onboarding kami menghitung kurikulum adaptif berdasarkan target 
            tingkat kelulusan JLPT serta ketersediaan waktu belajar harian Anda.
          </p>
        </div>

        {/* Input parameters card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left">
          
          <div className={`liquid-glass rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between ${
            highlightFlash 
              ? 'border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.25)]' 
              : Object.keys(errors).length > 0
                ? 'border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)] bg-slate-950/20'
                : 'border-white/10'
          }`}>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-display text-white">Formulir Onboarding</h3>
                <span className="text-[10px] text-zinc-500 font-mono">* Wajib diisi</span>
              </div>

              {highlightError && (
                <div role="alert" className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl flex items-start gap-2 leading-relaxed animate-pulse">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{highlightError}</span>
                </div>
              )}
              
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block">
                  Nama atau Panggilan <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Ruka atau Ijas"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-650 focus:outline-none transition-all font-sans ${
                    errors.userName 
                      ? 'border-red-500 ring-2 ring-red-500/25 bg-red-500/5' 
                      : highlightFlash
                        ? 'border-amber-500 ring-2 ring-amber-500/30'
                        : 'border-white/10 focus:border-white/20'
                  }`}
                />
                {errors.userName && (
                  <span className="text-red-400 text-[10px] block font-medium">Silakan masukkan nama atau panggilan Anda.</span>
                )}
              </div>

              {/* Target JLPT N-Level selector */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block">
                  Target JLPT N-Level <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'N5', label: 'N5', desc: 'Pemula Dasar' },
                    { id: 'N4', label: 'N4', desc: 'Pemula Lanjut' },
                    { id: 'N3', label: 'N3', desc: 'Menengah' },
                    { id: 'N2', label: 'N2', desc: 'Lanjut' },
                    { id: 'N1', label: 'N1', desc: 'Ahli' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleNLevelChange(opt.id as any)}
                      className={`px-2 py-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center ${
                        targetNLevel === opt.id 
                          ? 'bg-white text-slate-950 border-white font-bold scale-[1.03]' 
                          : `bg-white/3 text-zinc-400 ${
                              errors.targetNLevel 
                                ? 'border-red-500/50 hover:bg-red-500/5 hover:text-red-300' 
                                : 'border-white/5 hover:text-white hover:bg-white/5'
                            }`
                      }`}
                    >
                      <span className="font-extrabold text-xs">{opt.id}</span>
                      <span className="text-[7px] opacity-60 font-medium tracking-tight whitespace-nowrap mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>
                {errors.targetNLevel && (
                  <span className="text-red-400 text-[10px] block font-medium">Silakan pilih target JLPT tingkat kelulusan N-Level Anda.</span>
                )}
              </div>

              {/* Study commitment hours */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block">
                  Waktu Belajar Harian <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '1', label: '1 Jam' },
                    { id: '2', label: '2 Jam' },
                    { id: '3', label: '3-4 Jam' },
                    { id: '5', label: '5+ Jam' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleHoursChange(opt.id as any)}
                      className={`px-2 py-2.5 rounded-xl border text-[11px] font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                        studyHours === opt.id 
                          ? 'bg-white text-slate-950 border-white font-bold scale-[1.03]' 
                          : `bg-white/3 text-zinc-400 ${
                              errors.studyHours 
                                ? 'border-red-500/50 hover:bg-red-500/5 hover:text-red-300' 
                                : 'border-white/5 hover:text-white hover:bg-white/5'
                            }`
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {errors.studyHours && (
                  <span className="text-red-400 text-[10px] block font-medium">Silakan pilih komitmen jam belajar harian Anda.</span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                triggerTick(783.99);
                if (!validateForm()) return;
                
                setIsRancanging(true);
                setTimeout(() => {
                  try {
                    const data = {
                      userName: userName.trim(),
                      targetNLevel,
                      studyHours,
                      completed: true,
                      // For backward compatibility keep legacy properties
                      name: userName.trim(),
                      goal: targetNLevel === 'N5' ? 'wisata' : targetNLevel === 'N4' ? 'percakapan' : targetNLevel === 'N3' ? 'anime' : 'kerja',
                      commitment: studyHours === '1' ? 'santai' : studyHours === '2' ? 'rutin' : 'intensif'
                    };
                    localStorage.setItem('ruka_onboarding', JSON.stringify(data));
                  } catch (e) {}
                  
                  setShowRecommendation(true);
                  setIsRancanging(false);
                  window.dispatchEvent(new Event('ruka_onboarding_changed'));
                  
                  // Instantly guide them elegantly into class after calculation
                  if (onOnboardingComplete) {
                    setIsEnteringClass(true);
                    setTimeout(() => {
                      setIsEnteringClass(false);
                      onOnboardingComplete();
                    }, 1200);
                  }
                }, 1200);
              }}
              disabled={isRancanging || isEnteringClass}
              className={`liquid-glass text-white border w-full py-4 mt-8 rounded-full text-xs font-semibold tracking-widest uppercase hover:scale-[1.03] active:scale-[98%] transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isRancanging || isEnteringClass
                  ? 'border-indigo-500 bg-indigo-500/10 cursor-not-allowed text-indigo-300 line-pulse' 
                  : 'border-white/20 hover:border-white/30'
              }`}
            >
              {isRancanging ? (
                <>
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  Menganalisis Algoritma Kurikulum...
                </>
              ) : isEnteringClass ? (
                <>
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  Menghubungkan Kelas...
                </>
              ) : (
                <>
                  Rancang Rencana & Masuk Kelas
                  <ArrowRight className="w-3.5 h-3.5 border-white/5 bg-white/5 p-0.5 rounded-full" />
                </>
              )}
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
                    Sistem telah meracik rencana belajar terbaik untuk mencapai target kelulusan ujian <span className="text-white font-medium">{targetNLevel || 'JLPT N-Level'}</span>.
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
                      <p className="text-sm text-zinc-200 font-light mt-0.5">{planInfo.time}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start pt-4">
                    <Calendar className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Peta Fokus Utama Latihan</h4>
                      <p className="text-sm text-zinc-200 font-light mt-0.5 leading-normal">{planInfo.materials}</p>
                    </div>
                  </div>

                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <button
                    onClick={() => {
                      triggerTick(880);
                      setIsEnteringClass(true);
                      setTimeout(() => {
                        setIsEnteringClass(false);
                        onOnboardingComplete?.();
                      }, 1000);
                    }}
                    disabled={isEnteringClass}
                    className={`w-full py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:scale-[1.02] active:scale-[98%] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                      isEnteringClass
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/20 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-455 text-slate-950 shadow-emerald-500/10'
                    }`}
                  >
                    {isEnteringClass ? (
                      <>
                        <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                        Menghubungkan Kelas...
                      </>
                    ) : (
                      <>
                        Masuk Kelas Belajar Sekarang 🚀
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs text-zinc-500 italic font-light pt-4 border-t border-white/5">
                  {planInfo.streakGoal}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center my-auto space-y-4 py-12">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-lg font-display text-white font-normal">Hasil Peta Rencana Menanti</h4>
                <p className="text-xs text-zinc-500 font-light max-w-xs leading-relaxed">
                  Isi formulir dan ketuk tombol di samping untuk menghasilkan rekomendasi dan 
                  metodologi belajar personal dari RukaaClass.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Brand foot text */}
        <div className="mt-20 border-t border-white/5 pt-8 text-xs text-zinc-650 font-normal">
          <p>© 2026 — RukaaClass. Menyambut Masa Depan Belajar Bahasa Jepang Tanpa Rasa Takut.</p>
        </div>

      </div>
    </section>
  );
}
