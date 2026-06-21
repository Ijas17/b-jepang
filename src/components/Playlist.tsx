/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMusic, getYouTubeId } from '../contexts/MusicContext';
import { 
  Play, 
  Pause, 
  Music, 
  Volume2, 
  VolumeX, 
  Disc, 
  ChevronRight,
  Sparkles,
  Link as LinkIcon,
  Plus,
  Trash2,
  Loader2,
  AlertCircle
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
    playPrev,
    youtubeTracks,
    addYoutubeLink,
    removeYoutubeLink,
    isAddingYt,
    showVideoMonitor,
    setShowVideoMonitor
  } = useMusic();

  const [inputUrl, setInputUrl] = useState('');
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const activeTrack = youtubeTracks[currentTrackIndex] || youtubeTracks[0];

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');
    if (!inputUrl.trim()) return;

    const yId = getYouTubeId(inputUrl.trim());
    if (!yId) {
      setErrorText('Format link YouTube tidak valid. Silakan bagi link video penuh maupun singkat.');
      setTimeout(() => setErrorText(''), 4000);
      return;
    }

    if (youtubeTracks.length >= 5) {
      setErrorText('Batas maksimal adalah 5 lagu. Silakan hapus lagu lain terlebih dahulu jika ingin menambah.');
      setTimeout(() => setErrorText(''), 4000);
      return;
    }

    const res = await addYoutubeLink(inputUrl.trim());
    if (res.success) {
      setInputUrl('');
      setSuccessText('Video YouTube berhasil dimuat dan otomatis diputar!');
      setTimeout(() => setSuccessText(''), 4000);
    } else {
      setErrorText(res.error || 'Terjadi kesalahan saat menambahkan video.');
      setTimeout(() => setErrorText(''), 4000);
    }
  };

  return (
    <section id="playlist-section" className="relative z-10 py-16 px-6 sm:px-8 max-w-7xl mx-auto border-b border-white/5 bg-slate-950/20 rounded-3xl mt-12">
      
      {/* Informative Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div id="playlist-title-badge" className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-3 bg-white/5 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-white/5">
          <Disc className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          RUKAAIJASS CUSTOM YOUTUBE JUKEBOX
        </div>
        <h2 className="text-3xl sm:text-4xl font-display text-white font-normal leading-tight mb-4">
          Frekuensi Musik <span className="italic text-zinc-400">Pilihan Anda</span>
        </h2>
        <p className="text-zinc-300 font-light text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          User bebas menyetel lagu apa pun langsung dari link YouTube! Tempel tautan kustom di bawah ini. Loop sekuensial berjalan otomatis: jika ada lebih dari 1 lagu, lagu teratas akan diputar dulu hingga habis sebelum berpindah ke yang berikutnya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Playlist Manager Workspace */}
        <div id="playlist-left-workspace" className="lg:col-span-7 space-y-6 text-left flex flex-col justify-between">
          
          {/* Action Zone: Paste Link form */}
          <div className="border border-white/10 bg-slate-950/40 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#ca8a04] font-mono font-bold block">
                  YouTube Link Input
                </span>
                <p className="text-[11px] text-zinc-450 mt-0.5 font-light">Masukkan link lagu kesukaan Anda di sini (Maksimal 5 lagu)</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-zinc-400 select-none">
                {youtubeTracks.length} / 5 Slot Terisi
              </span>
            </div>

            <form onSubmit={handleAddLink} className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Tempel link video YouTube Anda di sini..."
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    setErrorText('');
                  }}
                  className="w-full bg-slate-950 border border-white/10 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500/40 text-zinc-200 placeholder-zinc-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isAddingYt || youtubeTracks.length >= 5}
                className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-650 text-slate-950 font-black px-5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 justify-center transition-all cursor-pointer hover:scale-[1.02] shrink-0"
              >
                {isAddingYt ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Sematkan</span>
                  </>
                )}
              </button>
            </form>

            {/* Notifications and Alerts Feed */}
            {errorText && (
              <div className="flex items-center gap-2 text-xs text-red-400 font-light bg-red-500/5 px-3 py-2 rounded-lg border border-red-500/10">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorText}</span>
              </div>
            )}

            {successText && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/5 px-3 py-2 rounded-lg border border-emerald-500/10">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successText}</span>
              </div>
            )}
          </div>

          {/* Preset Track List Selector */}
          <div className="space-y-3.5 flex-1 flex flex-col justify-center py-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-mono font-bold block">
                Daftar Putar Aktif (Diputar Paling Atas Dahulu)
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">Status: Terkoneksi API Keamanan YouTube</span>
            </div>

            <div className="space-y-3">
              {youtubeTracks.map((track, idx) => {
                const isSelected = currentTrackIndex === idx;
                
                return (
                  <div
                    key={track.id}
                    className={`w-full p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30 shadow-md' 
                        : 'bg-white/1 border-white/5 hover:border-white/10 hover:bg-white/2'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => playTrack(idx)}
                      className="flex-1 text-left flex items-center gap-4 cursor-pointer max-w-[85%] overflow-hidden"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                        isSelected 
                          ? 'bg-amber-500 text-slate-950 shadow-md' 
                          : 'bg-slate-900 border border-white/5 text-zinc-400'
                      }`}>
                        {isSelected && isPlaying ? (
                          <span className="w-2 h-2 bg-slate-950 rounded-full animate-ping" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs sm:text-sm font-semibold truncate ${isSelected ? 'text-white font-bold' : 'text-zinc-300'}`}>
                            {track.title}
                          </h4>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono font-light truncate mt-0.5">
                          {track.isFetchingTitle ? 'Mengambil judul video...' : 'YouTube Custom Stream Channel'}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected ? (
                        <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                          Aktif
                        </span>
                      ) : null}
                      
                      <button
                        type="button"
                        onClick={() => removeYoutubeLink(idx)}
                        className="p-2 opacity-60 hover:opacity-100 text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                        title="Hapus video ini"
                      >
                        <Trash2 className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {youtubeTracks.length === 0 && (
                <div className="py-12 text-center text-xs text-zinc-500 font-light border border-dashed border-white/5 rounded-2xl">
                  Belum ada lagu YouTube yang disematkan. Silakan tempel link video YouTube dan tekan Sematkan!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Stereo Media Player Aesthetic Box */}
        <div id="playlist-right-player" className="lg:col-span-5 flex flex-col">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 text-center flex flex-col justify-between min-h-[400px] relative overflow-hidden bg-slate-950/60 shadow-lg h-full">
            
            {/* Context tag header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-zinc-650'}`} />
                YOUTUBE STEREO RECEIVER
              </span>
              <button
                type="button"
                onClick={() => setShowVideoMonitor(!showVideoMonitor)}
                className="text-[9px] text-[#fbbf24] hover:text-white uppercase tracking-widest font-mono cursor-pointer flex items-center gap-1 hover:underline"
              >
                🎥 {showVideoMonitor ? 'Monitor: ON' : 'Monitor: OFF'}
              </button>
            </div>

            {/* Premium Simulated CD/Vinyl Spine Spinner */}
            <div className="my-4 flex justify-center relative z-10">
              <div className="relative w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-950 flex items-center justify-center shadow-xl shadow-black/40 overflow-hidden">
                <div className="absolute inset-2 border border-white/2 rounded-full" />
                <div className="absolute inset-4 border border-white/2 rounded-full" />
                <div className="absolute inset-8 border border-white/2 rounded-full" />
                <div className="absolute inset-12 border border-white/2 rounded-full" />
                
                <div className={`w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}>
                  <Music className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </div>

            {/* Current title and mood */}
            <div className="my-4 space-y-1 relative z-10">
              <h3 className="text-lg sm:text-xl text-zinc-100 font-display font-semibold leading-tight tracking-tight truncate px-2">
                {activeTrack ? activeTrack.title : 'Pemutar Kosong'}
              </h3>
              <p className="text-zinc-500 font-light italic text-[11px] truncate px-3">
                {activeTrack ? 'Video YouTube Kustom Anda' : 'Ketikkan link YouTube di sebelah kiri'}
              </p>
            </div>

            {/* Custom Interactive Waveform Visualizer */}
            <div className="h-16 flex items-end justify-center gap-1.5 px-4 my-2 relative z-10 font-sans">
              {visualizerBars.map((height, i) => {
                return (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className="w-1.5 rounded-full transition-all duration-300 md:w-2 bg-gradient-to-t from-amber-500/20 via-amber-400 to-amber-250 animate-pulse"
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
                  disabled={youtubeTracks.length === 0}
                  className="p-2.5 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Sebelumnya"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>

                {/* Central Play/Pause button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  disabled={youtubeTracks.length === 0}
                  className="w-12 h-12 rounded-full bg-white text-slate-950 font-black flex items-center justify-center hover:scale-105 active:scale-95 disabled:bg-zinc-700 disabled:text-zinc-500 transition-all shadow-md cursor-pointer shrink-0"
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
                  disabled={youtubeTracks.length === 0}
                  className="p-2.5 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
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
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
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
