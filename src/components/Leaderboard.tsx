/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trophy, Flame, User, Award, ShieldCheck, Globe, Star, Sparkles } from 'lucide-react';

interface LeaderboardProps {
  userXP: number;
  streakCount: number;
}

export default function Leaderboard({ userXP, streakCount }: LeaderboardProps) {
  const [userName, setUserName] = useState<string>('Gakusei (Anda)');
  const [competitors, setCompetitors] = useState<any[]>([]);

  useEffect(() => {
    // Read actual user name from onboarding
    try {
      const saved = localStorage.getItem('ruka_onboarding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nama) {
          setUserName(parsed.nama);
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    // Show only the actual active student.
    if (userXP > 0) {
      setCompetitors([
        { name: `${userName} (Anda)`, location: "ID", xp: userXP, streak: streakCount, icon: "⚡", isUser: true }
      ]);
    } else {
      setCompetitors([]);
    }
  }, [userName, userXP, streakCount]);

  const userRankIndex = competitors.findIndex(item => item.isUser);

  return (
    <div id="leaderboard-interactive-module" className="liquid-glass rounded-3xl p-6 border border-white/5 space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-amber-500 block">PIRAMIDA KOMPETENSI GLOBAL</span>
          <h3 className="text-xl font-display text-white font-normal flex items-center gap-2">
            <Trophy className="w-5.5 h-5.5 text-amber-500 animate-pulse" /> Papan Peringkat Gakusei
          </h3>
          <p className="text-[11px] text-zinc-400 font-light leading-snug">
            Tabel peringkat waktu nyata berdasarkan akumulasi XP & hari aktif belajar Anda.
          </p>
        </div>
        
        {/* Quick status badge */}
        <div className="bg-amber-500/10 border border-amber-500/15 p-2 px-3 rounded-2xl flex items-center gap-2 shrink-0">
          <Star className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400" />
          <div className="text-left font-mono">
            <span className="text-[8px] text-zinc-500 block uppercase font-bold leading-none">Peringkat Anda</span>
            <span className="text-xs text-amber-300 font-bold"># {userRankIndex !== -1 ? userRankIndex + 1 : '-'} Gakusei</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Competitors Loop */}
      <div className="space-y-2.5 my-2">
        {competitors.map((player, idx) => {
          const isCurrentUser = player.isUser;
          return (
            <div 
              key={idx}
              id={`leaderboard-player-${idx}`}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-all duration-300 ${
                isCurrentUser 
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.15)] font-black scale-[1.02]' 
                  : 'bg-white/2 border-white/5 text-zinc-300 hover:bg-white/4'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank numbering indicator */}
                <div className="w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-extrabold shadow-md">
                  🥇
                </div>
                
                <div className="text-left leading-tight">
                  <span className={`text-xs block ${isCurrentUser ? 'font-extrabold text-white text-sm' : 'font-semibold text-zinc-100'}`}>
                    {player.name}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono flex items-center gap-1">
                    <span>{player.location}</span>
                    <span>•</span>
                    <Flame className="w-3 h-3 text-amber-500 inline fill-amber-500/30" />
                    <span>{player.streak} Hari Streak</span>
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-xs font-mono font-bold px-2.5 py-1.5 rounded-xl border border-white/5 ${
                  isCurrentUser ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-950/45 text-zinc-350'
                }`}>
                  {player.xp} XP
                </span>
              </div>
            </div>
          );
        })}
        
        {competitors.length === 0 && (
          <div className="text-center py-10 bg-white/2 rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center p-6 text-zinc-400 font-light text-xs gap-1">
            <Trophy className="w-8 h-8 text-zinc-600 mb-1" />
            <p className="font-semibold text-zinc-300">Papan Peringkat Kosong</p>
            <p className="text-[10px] text-zinc-500 max-w-xs leading-relaxed">Belum ada progres belajar waktu-nyata Anda saat ini. Kumpulkan XP pertama Anda untuk tercatat di papan peringkat! ⚡</p>
          </div>
        )}
      </div>

      {/* Bottom info banner */}
      <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-white/5 text-[10px] text-zinc-400 font-light flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Mari tingkatkan akumulasi XP Anda untuk mempertahankan posisi puncak!</span>
        </div>
        <span className="text-emerald-450 font-mono font-bold text-[9px] bg-emerald-500/10 px-2 py-0.5 rounded-full">LIVE SYNC</span>
      </div>
    </div>
  );
}
