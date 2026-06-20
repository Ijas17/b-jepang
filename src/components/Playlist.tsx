/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AMBIENT_TRACKS } from '../data';
import { useMusic, getYouTubeId } from '../contexts/MusicContext';
import { Play, Pause, Music, Volume2, VolumeX, Plus, Trash2, Globe, Link, Check, AlertCircle } from 'lucide-react';

export default function Playlist() {
  const {
    isPlaying,
    currentTrackIndex,
    currentTrackType,
    youtubeId,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    youtubeLinks,
    addYoutubeLink,
    removeYoutubeLink,
    visualizerBars,
    playTrack,
    togglePlay
  } = useMusic();

  const [inputUrl, setInputUrl] = useState('');
  const [errorText, setErrorText] = useState('');

  const activeTrack = AMBIENT_TRACKS[currentTrackIndex];

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    if (!inputUrl.trim()) return;

    const yId = getYouTubeId(inputUrl.trim());
    if (!yId) {
      setErrorText('Format link YouTube tidak valid.');
      return;
    }

    const res = addYoutubeLink(inputUrl.trim());
    if (res.success) {
      // Auto-play the newly added track right away!
      playTrack('youtube', yId);
      setInputUrl('');
    } else {
      setErrorText(res.error || 'Terjadi kesalahan.');
    }
  };

  return (
    <section id="playlist" className="relative z-10 py-16 px-6 sm:px-8 max-w-7xl mx-auto border-b border-white/5 bg-slate-950/20 rounded-3xl mt-12">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div id="playlist-badge" className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-3 bg-white/5 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-white/5">
          <Music className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          MULTIMEDIA AMBIENT PLAYER
        </div>
        <h2 className="text-3xl sm:text-4xl font-display text-white font-normal leading-tight mb-4">
          Frekuensi Belajar <span className="italic text-zinc-400">RukaaIjass</span>
        </h2>
        <p className="text-zinc-300 font-light text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          Musik latar ini teringrasi penuh secara global dan tidak akan terputus saat Anda masuk atau keluar kelas! Posisikan fokus Anda pada frekuensi lofi terbaik kami, atau tempelkan musik YouTube kesukaan Anda langsung di panel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Ambient selections & YouTube custom input */}
        <div id="playlist-controls-panel" className="lg:col-span-5 space-y-6 text-left">
          
          <div className="space-y-3.5">
            <span className="text-[10px] uppercase tracking-widest text-[#818cf8] font-mono font-bold block">1. Suasana Lofi Premium</span>
            <div className="space-y-2.5">
              {AMBIENT_TRACKS.map((track, i) => {
                const isSelected = currentTrackType === 'ambient' && i === currentTrackIndex;
                return (
                  <button
                    key={track.id}
                    onClick={() => playTrack('ambient', i)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent border-indigo-500/50 text-white font-black scale-[1.011] shadow-md shadow-indigo-500/5' 
                        : 'bg-white/2 hover:bg-white/4 border-white/5 text-zinc-300 hover:text-white'
                    }`}
                  >
                    <div className="flex gap-3.5 items-center">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-colors ${isSelected ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-900 border border-white/10 text-zinc-400'}`}>
                        {isSelected && isPlaying ? (
                          <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                        ) : (
                          <Music className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold">{track.title}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono font-light">{track.mood}</p>
                      </div>
                    </div>
                    {isSelected ? (
                      <span className="text-[9px] uppercase font-mono font-bold text-indigo-400 bg-indigo-500/15 p-1 px-2.5 rounded-full border border-indigo-500/10">AKTIF</span>
                    ) : (
                      <Check className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3.5 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-bold block">2. YouTube Custom BGM (Max 5)</span>
              <span className="text-[9px] font-mono font-bold text-zinc-500">{youtubeLinks.length} / 5 Link</span>
            </div>

            {/* Custom Link Input */}
            <form onSubmit={handleAddLink} className="flex gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Tempel link video YouTube..."
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    setErrorText('');
                  }}
                  className="w-full bg-slate-950/80 border border-white/5 text-xs rounded-xl pl-9.5 pr-4 py-2.5 focus:outline-none focus:border-amber-500/40 text-zinc-200 placeholder-zinc-500"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer hover:scale-103 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {errorText && (
              <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-light bg-red-500/5 px-3 py-2 rounded-lg border border-red-500/10">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorText}</span>
              </div>
            )}

            {/* Render YT links */}
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {youtubeLinks.map((link, idx) => {
                const yId = getYouTubeId(link);
                const isSelected = currentTrackType === 'youtube' && youtubeId === yId;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                      isSelected 
                        ? 'bg-amber-500/10 border-amber-500/30' 
                        : 'bg-white/1 border-white/5 hover:bg-white/2'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => yId && playTrack('youtube', yId)}
                      className="flex-1 text-left flex items-center gap-2.5 cursor-pointer"
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-zinc-500 text-xs font-mono font-bold'}`}>
                        {idx + 1}
                      </div>
                      <div className="overflow-hidden">
                        <span className={`text-[11px] block truncate font-mono ${isSelected ? 'text-amber-300 font-bold' : 'text-zinc-400'}`}>
                          YouTube ID: {yId || 'Invalid'}
                        </span>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => removeYoutubeLink(idx)}
                      className="p-1 px-1.5 opacity-60 hover:opacity-100 text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
              {youtubeLinks.length === 0 && (
                <div className="py-6 text-center text-[10px] text-zinc-500 font-light border border-dashed border-white/5 rounded-2xl">
                  Belum ada playlist kustom YouTube. Tempel link di atas untuk menambahkan!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Audio player aesthetic UI */}
        <div id="audio-player-panel" className="lg:col-span-7">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 text-center flex flex-col justify-between min-h-[340px]">
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ca8a04] flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-amber-500 animate-pulse' : 'bg-zinc-650'}`} />
                {currentTrackType === 'youtube' ? 'YOUTUBE BGM LIVE' : 'RUKAAIJASS AMBIENT CHANNELS'}
              </span>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                NON-STOP BACKGROUND PLAYER
              </span>
            </div>

            {/* Current title showcase */}
            <div className="my-6 space-y-1">
              <h3 className="text-2xl sm:text-3xl text-zinc-100 font-display font-normal tracking-tight">
                {currentTrackType === 'ambient' ? activeTrack.title : 'External YouTube Stream'}
              </h3>
              <p className="text-zinc-500 font-light italic text-xs">
                {currentTrackType === 'ambient' ? activeTrack.mood : `Video ID: ${youtubeId || 'Belum dipilih'}`}
              </p>
            </div>

            {/* Custom Interactive Waveform Visualizer */}
            <div className="h-20 flex items-end justify-center gap-1.5 px-4 my-4">
              {visualizerBars.map((height, i) => {
                // Color shift based on playing standard vs YouTube BGM
                const bgClass = currentTrackType === 'youtube'
                  ? 'bg-gradient-to-t from-amber-500/20 via-amber-400 to-amber-200' 
                  : 'bg-gradient-to-t from-indigo-500/20 via-[#818cf8] to-[#c7d2fe]';
                return (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className={`w-1.5 rounded-full transition-all duration-300 md:w-2 ${bgClass}`}
                  />
                );
              })}
            </div>

            {/* Play/Pause & Volume controls bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5 bg-slate-950/40 p-4 rounded-2xl mt-4">
              
              <div className="flex items-center gap-3.5">
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
                <div className="text-left font-sans">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Kontrol Cepat</span>
                  <p className="text-[11px] text-zinc-400 font-light">
                    {isPlaying ? 'Ketuk untuk menjeda musik pengiring' : 'Putar alunan konsentrasi Anda'}
                  </p>
                </div>
              </div>

              {/* Volume Slider section */}
              <div id="volume-wrapper" className="flex items-center gap-2.5 w-full sm:w-auto max-w-xs justify-end">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4.5 h-4.5 text-zinc-400" /> : <Volume2 className="w-4.5 h-4.5 text-zinc-300" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                  }}
                  className="w-24 sm:w-28 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <span className="text-[9px] font-mono text-zinc-500 w-8 text-right">
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
