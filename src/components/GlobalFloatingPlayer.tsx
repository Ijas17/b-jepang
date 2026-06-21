/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMusic } from '../contexts/MusicContext';
import { 
  Music, 
  Play, 
  Pause, 
  X, 
  Volume2, 
  VolumeX, 
  ListMusic, 
  HelpCircle
} from 'lucide-react';

export default function GlobalFloatingPlayer() {
  const {
    isPlaying,
    currentTrackIndex,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    togglePlay,
    playTrack,
    youtubeTracks,
    showVideoMonitor,
    setShowVideoMonitor
  } = useMusic();

  const [isOpen, setIsOpen] = useState(false);
  const activeTrack = youtubeTracks[currentTrackIndex] || youtubeTracks[0];

  return (
    <div id="global-floating-player-widget" className="fixed bottom-6 right-6 z-[80] font-sans">
      {/* Tiny Minimized Floating Bubble when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 rounded-full flex flex-col items-center justify-center border text-white transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 group relative ${
            isPlaying 
              ? 'bg-gradient-to-tr from-amber-500 to-amber-600 border-amber-400 shadow-amber-500/20' 
              : 'bg-slate-900/90 border-white/10 hover:border-white/20'
          }`}
        >
          {isPlaying ? (
            <>
              {/* Pulsing rings */}
              <span className="absolute inset-0 rounded-full bg-amber-500/25 animate-ping" />
              <Music className="w-5 h-5 animate-bounce text-slate-950 relative z-10" />
              <span className="text-[7px] font-black tracking-widest uppercase text-slate-950 mt-0.5 relative z-10 antialiased">PLAY</span>
            </>
          ) : (
            <>
              <Music className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="text-[7px] font-bold tracking-widest uppercase text-zinc-500 mt-0.5">BGM</span>
            </>
          )}

          {/* Hover interactive tooltip */}
          <span className="absolute right-16 bg-slate-950 text-white text-[9px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/5 pointer-events-none uppercase tracking-wider">
            {isPlaying ? `Playing: ${activeTrack ? activeTrack.title : 'YouTube'}` : 'Putar Musik Latar Anda 🌸'}
          </span>
        </button>
      )}

      {/* Expanded Glassmorphic Player Card */}
      {isOpen && (
        <div className="w-80 bg-slate-950/95 backdrop-blur-xl border border-white/15 rounded-3xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] animate-fade-rise space-y-4 text-left">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/15 text-amber-400 rounded-lg">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Studio Audio Latar</h4>
                <p className="text-[9px] text-zinc-550 font-mono">NON-STOP YOUTUBE LOOPER</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowVideoMonitor(!showVideoMonitor)}
                className={`p-1 px-1.5 text-[9px] font-mono font-bold rounded-lg transition-colors cursor-pointer border ${
                  showVideoMonitor 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                    : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
                title="Tampilkan / Sembunyikan mini TV player"
              >
                🎥 {showVideoMonitor ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Track Banner block */}
          {activeTrack ? (
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#f59e0b] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-505/10">
                  LO-FI ACTIVE
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-zinc-650'}`} />
              </div>
              
              <div className="overflow-hidden">
                <span className="text-xs font-semibold text-white block truncate leading-snug">
                  {activeTrack.title}
                </span>
                <span className="text-[10px] text-zinc-400 block truncate font-light leading-none">
                  Source: YouTube Stream
                </span>
              </div>

              {/* Micro-controls (Play/Pause + Volume slider) */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 px-3 bg-white text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-zinc-100 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current translate-x-0.2" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-zinc-300" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-16 h-1 bg-white/10 rounded appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center text-[11px] text-zinc-500 font-light">
              Belum ada lagu disematkan. Silakan isi lewat menu utama lofi di bawah.
            </div>
          )}

          {/* Simple Tracks List */}
          {youtubeTracks.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest text-[#f59e0b] font-mono font-bold block mb-1">
                Daftar Putar Kustom Anda ({youtubeTracks.length})
              </span>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {youtubeTracks.map((track, idx) => {
                  const isSelected = currentTrackIndex === idx;
                  return (
                    <button
                      key={track.id}
                      onClick={() => playTrack(idx)}
                      className={`w-full text-left p-2 px-2.5 rounded-xl border text-[11px] flex justify-between items-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-500/10 border-amber-500/30 text-white font-bold' 
                          : 'bg-white/1 border-white/5 text-zinc-400 hover:bg-white/3'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <ListMusic className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{track.title}</span>
                      </div>
                      {isSelected && isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Status footer info */}
          <div className="text-[9px] text-zinc-500 pt-2 border-t border-white/5 flex items-center gap-1.5 leading-relaxed">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>Mendukung auto-next otomatis ke lagu bawahnya secara sekuensial!</span>
          </div>

        </div>
      )}
    </div>
  );
}
