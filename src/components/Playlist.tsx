/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMusic } from '../contexts/MusicContext';
import { AMBIENT_TRACKS } from '../data';
import { 
  Play, 
  Pause, 
  Music, 
  Volume2, 
  VolumeX, 
  Disc, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Playlist() {
  const {
    isPlaying,
    currentTrackIndex,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    visualizerBars,
    togglePlay,
    playTrack,
    playNext,
    playPrev
  } = useMusic();

  const activeTrack = AMBIENT_TRACKS[currentTrackIndex] || AMBIENT_TRACKS[0];

  return (
    <section id="playlist-section" className="relative z-10 py-16 px-6 sm:px-8 max-w-7xl mx-auto border-b border-white/5 bg-slate-950/20 rounded-3xl mt-12">
      
      {/* Informative Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div id="playlist-title-badge" className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-3 bg-white/5 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-white/5">
          <Disc className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          RUKAAIJASS AUDIO STUDIO
        </div>
        <h2 className="text-3xl sm:text-4xl font-display text-white font-normal leading-tight mb-4">
          Frekuensi Belajar <span className="italic text-zinc-400">RukaaIjass</span>
        </h2>
        <p className="text-zinc-300 font-light text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          Musik latar ini mendampingi Anda di seluruh petualangan belajar bahasa Jepang. Pilih frekuensi lo-fi favorit Anda, sesuaikan volume, dan nikmati ketukan santai yang tiada henti!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Preset Track List Selector */}
        <div id="playlist-left-workspace" className="lg:col-span-7 space-y-6 text-left flex flex-col justify-center">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#818cf8] font-mono font-bold block">
                Pilih Arus Musik Lofi ({AMBIENT_TRACKS.length})
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">Loop otomatis berjalan secara sekuensial</span>
            </div>

            <div className="space-y-3">
              {AMBIENT_TRACKS.map((track, idx) => {
                const isSelected = currentTrackIndex === idx;
                
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => playTrack(idx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer ${
                      isSelected 
                        ? 'bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent border-indigo-500/30 shadow-md' 
                        : 'bg-white/1 border-white/5 hover:border-white/10 hover:bg-white/2'
                    }`}
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? 'bg-indigo-500 text-white shadow-md' 
                          : 'bg-slate-900 border border-white/5 text-zinc-400'
                      }`}>
                        {isSelected && isPlaying ? (
                          <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                        ) : (
                          <Music className="w-4 h-4" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-white font-bold' : 'text-zinc-300'}`}>
                            {track.title}
                          </h4>
                          <span className="text-[8px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/10 p-0.5 px-1.5 rounded uppercase shrink-0">
                            LO-FI
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 font-mono font-light truncate mt-0.5">{track.mood}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isSelected ? (
                        <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                          Aktif
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-zinc-650" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Stereo Media Player Aesthetic Box */}
        <div id="playlist-right-player" className="lg:col-span-5 flex flex-col">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 text-center flex flex-col justify-between min-h-[400px] relative overflow-hidden bg-slate-950/60 shadow-lg h-full">
            
            {/* Context tag header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-indigo-400 animate-pulse' : 'bg-zinc-600'}`} />
                RUKAAIJASS AMBIENT PRESENTS
              </span>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                NON-STOP BGM
              </span>
            </div>

            {/* Premium Simulated CD/Vinyl Spine Spinner */}
            <div className="my-4 flex justify-center relative z-10">
              <div className="relative w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-950 flex items-center justify-center shadow-xl shadow-black/40 overflow-hidden">
                <div className="absolute inset-2 border border-white/2 rounded-full" />
                <div className="absolute inset-4 border border-white/2 rounded-full" />
                <div className="absolute inset-8 border border-white/2 rounded-full" />
                <div className="absolute inset-12 border border-white/2 rounded-full" />
                
                <div className={`w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}>
                  <Music className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
            </div>

            {/* Current title and mood */}
            <div className="my-4 space-y-1 relative z-10">
              <h3 className="text-xl sm:text-2xl text-zinc-100 font-display font-semibold leading-tight tracking-tight truncate px-2">
                {activeTrack.title}
              </h3>
              <p className="text-zinc-400 font-light italic text-[11px] truncate px-3">
                {activeTrack.mood}
              </p>
            </div>

            {/* Custom Interactive Waveform Visualizer */}
            <div className="h-16 flex items-end justify-center gap-1.5 px-4 my-2 relative z-10">
              {visualizerBars.map((height, i) => {
                return (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className="w-1.5 rounded-full transition-all duration-300 md:w-2 bg-gradient-to-t from-indigo-500/20 via-[#818cf8] to-[#c7d2fe]"
                  />
                );
              })}
            </div>

            {/* Control buttons & volume adjust panel */}
            <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5 bg-slate-950/40 p-4 rounded-2xl mt-4 relative z-10">
              
              <div className="flex items-center justify-center gap-4 w-full">
                {/* Prev Button */}
                <button
                  type="button"
                  onClick={playPrev}
                  className="p-2.5 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  title="Sebelumnya"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>

                {/* Central Play/Pause button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-white text-slate-950 font-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current text-zinc-900" />
                  ) : (
                    <Play className="w-5 h-5 fill-current text-zinc-900 translate-x-0.5" />
                  )}
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={playNext}
                  className="p-2.5 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  title="Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Volume scale */}
              <div id="volume-control-wrapper" className="flex items-center justify-between gap-2.5 w-full">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors shrink-0"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-zinc-300" />}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />

                <span className="text-[9px] font-mono text-zinc-400 w-8 text-right shrink-0">
                  {isMuted ? 'MUTE' : `${Math.round(volume * 100)}%`}
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
