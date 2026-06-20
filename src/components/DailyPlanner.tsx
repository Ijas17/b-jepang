import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, ChevronRight, Award, Compass, Sparkles, BookOpen, Volume2, Plus, Trash2 } from 'lucide-react';

interface DailyPlannerProps {
  lessonCompletion: Record<number, number>;
  onAddXP: (amount: number) => void;
  onUnlockBadge: (badgeName: string) => void;
  onTriggerSound?: (freq: number) => void;
}

interface CustomGoal {
  id: string;
  text: string;
  completed: boolean;
  xpValue: number;
}

export default function DailyPlanner({ lessonCompletion, onAddXP, onUnlockBadge, onTriggerSound }: DailyPlannerProps) {
  // Target completion date (default to 60 days from now)
  const [targetDateStr, setTargetDateStr] = useState<string>(() => {
    const defaultDate = new Date('2026-08-30');
    return defaultDate.toISOString().split('T')[0];
  });

  const [inputGoalText, setInputGoalText] = useState('');
  
  // Daily goals state persisted in localStorage
  const [dailyGoals, setDailyGoals] = useState<CustomGoal[]>(() => {
    const saved = localStorage.getItem('n4_planner_goals');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { /* ignore */ }
    }
    return [
      { id: 'goal-1', text: 'Melafalkan 5 kosakata menggunakan fitur Text-to-Speech (TTS)', completed: false, xpValue: 20 },
      { id: 'goal-2', text: 'Mengerjakan 1 Sesi Kuis di modul Quiz Engine Pro', completed: false, xpValue: 20 },
      { id: 'goal-3', text: 'Berlatih goresan gubahan kanji di Latihan Menulis Kanji', completed: false, xpValue: 20 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('n4_planner_goals', JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  const playBeep = (freq = 440) => {
    if (onTriggerSound) onTriggerSound(freq);
  };

  // Remaining lessons calculation
  const totalLessons = 25;
  const completedLessonsCount = Object.keys(lessonCompletion).filter(
    (key) => lessonCompletion[Number(key)] >= 100
  ).length;
  const remainingLessonsCount = totalLessons - completedLessonsCount;

  // Days left calculation
  const currentDate = new Date('2026-06-20'); // aligned with metadata context
  const targetDateInput = new Date(targetDateStr);
  const diffTime = targetDateInput.getTime() - currentDate.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Study pace parameters
  const velocity = remainingLessonsCount > 0 && daysLeft > 0 
    ? (daysLeft / remainingLessonsCount).toFixed(1) 
    : '0';

  let paceMessage = '';
  let paceStyle = '';
  
  if (daysLeft <= 0) {
    paceMessage = 'Target tanggal harus lebih dari hari ini.';
    paceStyle = 'text-rose-450';
  } else if (remainingLessonsCount === 0) {
    paceMessage = 'Hebat! Anda telah menguasai seluruh 25 Bab Kurikulum N4!';
    paceStyle = 'text-green-400 font-bold';
  } else {
    const val = parseFloat(velocity);
    if (val < 1.5) {
      paceMessage = 'Super Intensif! Anda harus menyelesaikan 1 Bab kurang dari setiap 1.5 hari. Siapkan waktu belajar ekstra setiap hari.';
      paceStyle = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    } else if (val < 3) {
      paceMessage = 'Intensif Hebat! Disarankan menyelesaikan 1 Bab setiap 2-3 hari untuk kelulusan tepat waktu.';
      paceStyle = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    } else if (val < 6) {
      paceMessage = 'Normal & Produktif. Cukup selesaikan 1 Bab setiap 4-5 hari secara berkelanjutan.';
      paceStyle = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    } else {
      paceMessage = 'Santai & Rileks. Anda memiliki banyak waktu, selesaikan 1 Bab setiap minggu.';
      paceStyle = 'text-teal-400 bg-teal-500/10 border-teal-500/20';
    }
  }

  // Handle goal toggle
  const handleToggleGoal = (id: string) => {
    let earnedXP = 0;
    setDailyGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        const nextState = !goal.completed;
        if (nextState) {
          earnedXP = goal.xpValue;
          playBeep(880);
        } else {
          playBeep(220);
        }
        return { ...goal, completed: nextState };
      }
      return goal;
    }));

    if (earnedXP > 0) {
      onAddXP(earnedXP);
      // If all goals are complete now, unlock a badge!
      setTimeout(() => {
        setDailyGoals(current => {
          if (current.every(g => g.completed)) {
            onUnlockBadge('Ambisius N4 🎯');
            playBeep(980);
          }
          return current;
        });
      }, 100);
    }
  };

  // Add custom goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputGoalText.trim()) return;
    playBeep(580);
    const newGoal: CustomGoal = {
      id: `custom-${Date.now()}`,
      text: inputGoalText.trim(),
      completed: false,
      xpValue: 15
    };
    setDailyGoals(prev => [...prev, newGoal]);
    setInputGoalText('');
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    playBeep(180);
    setDailyGoals(prev => prev.filter(g => g.id !== id));
  };

  // Reset daily goals
  const handleResetGoals = () => {
    playBeep(440);
    setDailyGoals(prev => prev.map(g => ({ ...g, completed: false })));
  };

  // Trigger Planner Setup Badge
  useEffect(() => {
    if (daysLeft > 0) {
      onUnlockBadge('Visioner N4 📅');
    }
  }, [targetDateStr]);

  return (
    <div id="learning-daily-planner" className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      
      {/* Left Column: Personalized Learning Path Suggestor */}
      <div className="lg:col-span-7 bg-white/2 border border-white/5 rounded-3xl p-6 space-y-6">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase font-sans font-bold tracking-wider block mb-1">
            N4 Target Scheduler
          </span>
          <h3 className="text-xl font-display text-white font-normal flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" /> Rute Belajar N4 Anda
          </h3>
          <p className="text-xs text-zinc-400 font-light mt-1">
            Dapatkan kalkulasi kecepatan belajar otomatis berdasarkan jumlah sisa bab pelajaran yang belum Anda kuasai (100% tuntas) dan target tanggal ujian.
          </p>
        </div>

        {/* Inputs & Simple Metrics Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl space-y-2">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
              📅 Target Tanggal Kelulusan N4:
            </label>
            <input
              type="date"
              value={targetDateStr}
              onChange={(e) => { playBeep(330); setTargetDateStr(e.target.value); }}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-400 font-mono"
            />
          </div>

          <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
            <div className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
              Sisa Waktu Belajar
            </div>
            <div className="text-xl font-mono font-bold text-white mt-1">
              {daysLeft > 0 ? `${daysLeft} Hari` : 'Tanggal Lewat'}
            </div>
            <span className="text-[10px] text-zinc-400 font-light mt-0.5 font-sans">
              Terhitung dari tanggal hari ini (20 Juni 2026)
            </span>
          </div>
        </div>

        {/* Progress Summary and Metric Rates */}
        <div className="grid grid-cols-3 gap-3 bg-white/2 border border-white/5 p-4 rounded-2xl text-center">
          <div className="space-y-0.5">
            <span className="text-[9px] text-zinc-500 uppercase block">Total Bab</span>
            <span className="text-lg font-mono font-bold text-white">25 Bab</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-zinc-500 uppercase block">Tuntas N4</span>
            <span className="text-lg font-mono font-bold text-emerald-400">{completedLessonsCount} Bab</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-zinc-500 uppercase block">Sisa Belajar</span>
            <span className="text-lg font-mono font-bold text-rose-400">{remainingLessonsCount} Bab</span>
          </div>
        </div>

        {/* Recommended Pace Statement */}
        {daysLeft > 0 && remainingLessonsCount > 0 && (
          <div className={`p-4 border rounded-2xl ${paceStyle} space-y-2`}>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Analisis Kecepatan Belajar yang Disarankan:</span>
            </div>
            <p className="text-xs font-light leading-relaxed font-sans text-zinc-200">
              {paceMessage} Anda perlu menyelesaikan 1 Bab rata-rata setiap <strong className="font-mono text-white underline decoration-wavy decoration-indigo-400">{velocity} hari</strong> untuk tuntas sepenuhnya dalam sisa waktu {daysLeft} hari.
            </p>
          </div>
        )}

        {/* Suggested Path Phases */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
            Fase Jalur Belajar yang Direkomendasikan
          </span>
          <div className="space-y-2.5">
            <div className="bg-slate-950/30 border border-white/5 hover:border-white/10 rounded-xl p-3.5 flex gap-3">
              <span className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-teal-500/10">
                1
              </span>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white block">Aksara Hiragana & Katakana Dasar</span>
                <span className="text-[11px] text-zinc-400 font-light block leading-relaxed">
                  Latih seluruh goresan huruf Kana di modul Kana Trainer Pro. Kuasai modifikasi Varian Dakuon & Kombinasi Yoon terlebih dahulu.
                </span>
              </div>
            </div>

            <div className="bg-slate-950/30 border border-white/5 hover:border-white/10 rounded-xl p-3.5 flex gap-3">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-indigo-500/10">
                2
              </span>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white block">Tingkat Pemula Dasar (Bab 1 - 12)</span>
                <span className="text-[11px] text-zinc-400 font-light block leading-relaxed">
                  Fokus pada pembentukan kalimat dasar, partikel korelatif (wa, ga, ni, de), penunjuk arah, dan bentuk lampau. Evaluasikan tiap bab dengan Quiz.
                </span>
              </div>
            </div>

            <div className="bg-slate-950/30 border border-white/5 hover:border-white/10 rounded-xl p-3.5 flex gap-3">
              <span className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-rose-500/10">
                3
              </span>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white block">Tingkat Menengah N4 (Bab 13 - 25)</span>
                <span className="text-[11px] text-zinc-400 font-light block leading-relaxed">
                  Pelajaran krusial mengenai kalimat pasif, potensi, pemberian hadiah (benda), bentuk pengandaian (~tara, ~ba), dan sopan santun (Keigo).
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Interactive Daily Study Goals Tracker */}
      <div className="lg:col-span-5 bg-white/2 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
        <div className="space-y-5">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-sans font-bold tracking-wider block mb-1">
              Checklist Komitmen Belajar
            </span>
            <h3 className="text-xl font-display text-white font-normal flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Target Harian Belajar
            </h3>
            <p className="text-xs text-zinc-400 font-light mt-1">
              Selesaikan target harian Anda untuk mengklaim poin pengalaman ekstra (+XP) dan melatih konsistensi kedisiplinan!
            </p>
          </div>

          {/* Goal List */}
          <div className="space-y-3">
            {dailyGoals.map((goal) => (
              <div 
                key={goal.id}
                className={`p-4 border rounded-2xl flex items-start gap-3 transition-all ${
                  goal.completed 
                    ? 'bg-emerald-500/10 border-emerald-500/30 opacity-75' 
                    : 'bg-slate-1000/20 border-white/5 hover:border-white/10'
                }`}
              >
                <input
                  type="checkbox"
                  id={goal.id}
                  checked={goal.completed}
                  onChange={() => handleToggleGoal(goal.id)}
                  className="w-4 h-4 rounded mt-0.5 cursor-pointer accent-emerald-500"
                />
                
                <div className="flex-1 space-y-1">
                  <label 
                    htmlFor={goal.id}
                    className={`text-xs font-sans block leading-relaxed cursor-pointer select-none ${
                      goal.completed ? 'text-zinc-400 line-through' : 'text-zinc-200 hover:text-white'
                    }`}
                  >
                    {goal.text}
                  </label>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    +{goal.xpValue} XP
                  </span>
                </div>

                <button 
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="p-1 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 rounded-lg transition-all"
                  title="Hapus Target"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {dailyGoals.length === 0 && (
              <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl text-zinc-500 text-xs font-sans">
                Belum ada target belajar harian saat ini ikuti rute di atas atau buat target baru di bawah!
              </div>
            )}
          </div>

          {/* Form to add custom goals */}
          <form onSubmit={handleAddGoal} className="flex gap-2 border-t border-white/5 pt-4">
            <input
              type="text"
              placeholder="Tambah target belajar kustom Anda..."
              value={inputGoalText}
              onChange={(e) => setInputGoalText(e.target.value)}
              className="flex-1 bg-slate-950/40 hover:bg-slate-950/60 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-400 font-sans"
            />
            <button
              type="submit"
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all font-bold text-xs text-white flex items-center justify-center shrink-0"
              title="Tambah Target"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center gap-4">
          <span className="text-[10px] text-zinc-500 font-light">
            Target harian akan tereset otomatis setiap kali Anda menekan tombol Reset Target di kanan sebagai latihan baru.
          </span>
          <button
            onClick={handleResetGoals}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 font-semibold text-xs rounded-xl cursor-pointer transition-all shrink-0"
          >
            Reset Target
          </button>
        </div>

      </div>

    </div>
  );
}
