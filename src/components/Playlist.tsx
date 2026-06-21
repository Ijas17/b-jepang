/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMusic, getYouTubeId, MusicTrack } from '../contexts/MusicContext';
import { 
  Play, 
  Pause, 
  Music, 
  Volume2, 
  VolumeX, 
  Plus, 
  Trash2, 
  Link, 
  Check, 
  AlertCircle, 
  Upload, 
  Disc, 
  FileAudio,
  ChevronRight,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function Playlist() {
  const {
    isPlaying,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    visualizerBars,
    togglePlay,

    // UNIFIED FEATURES
    tracks,
    activeTrackId,
    playTrackById,
    uploadedTracks,
    addUploadedTrack,
    removeUploadedTrack,
    youtubeTracks,
    isAddingYt,
    addYoutubeLink,
    removeYoutubeLink,
    playNext,
    playPrev
  } = useMusic();

  const [inputUrl, setInputUrl] = useState('');
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [activeSegment, setActiveSegment] = useState<'all' | 'presets' | 'local' | 'youtube'>('all');

  // Safely find currently active track or fallback to first
  const activeTrack = tracks.find(t => t.id === activeTrackId) || tracks[0];

  // Drag-and-drop handlers for Local audio uploads
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/') || file.name.endsWith('.mp3')) {
        addUploadedTrack(file);
        setSuccessText(`Berhasil mengunggah file lokal: ${file.name}`);
        setTimeout(() => setSuccessText(''), 3000);
      } else {
        setErrorText('Harap unggah file berformat audio / MP3 saja.');
        setTimeout(() => setErrorText(''), 4000);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addUploadedTrack(file);
      setSuccessText(`Berhasil memuat berkas lokal: ${file.name}`);
      setTimeout(() => setSuccessText(''), 3000);
    }
  };

  // YouTube Playlist handlers
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');
    if (!inputUrl.trim()) return;

    const yId = getYouTubeId(inputUrl.trim());
    if (!yId) {
      setErrorText('Format link YouTube tidak valid. Gunakan format url penuh atau singkat yang sah.');
      return;
    }

    const res = await addYoutubeLink(inputUrl.trim());
    if (res.success) {
      setInputUrl('');
      if (res.warning) {
        setSuccessText(`Berhasil ditambahkan! Catatan: ${res.warning}`);
      } else {
        setSuccessText('Musik YouTube berhasil diverifikasi oEmbed dan ditambahkan!');
      }
      setTimeout(() => setSuccessText(''), 4000);
    } else {
      setErrorText(res.error || 'Gagal menyematkan video YouTube.');
    }
  };

  // Filter tracks list for clean user segmentation
  const filteredTracks = tracks.filter(t => {
    if (activeSegment === 'presets') return t.type === 'preset';
    if (activeSegment === 'local') return t.type === 'uploaded';
    if (activeSegment === 'youtube') return t.type === 'youtube';
    return true; // 'all'
  });

  return (
    <section id="playlist-section" className="relative z-10 py-16 px-6 sm:px-8 max-w-7xl mx-auto border-b border-white/5 bg-slate-950/20 rounded-3xl mt-12">
      
      {/* Dynamic Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div id="playlist-title-badge" className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-3 bg-white/5 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-white/5">
          <Disc className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          UNIVERSAL MULTIMEDIA AUDIO PLAYER
        </div>
        <h2 className="text-3xl sm:text-4xl font-display text-white font-normal leading-tight mb-4">
          Frekuensi Belajar <span className="italic text-zinc-400">RukaaIjass</span>
        </h2>
        <p className="text-zinc-300 font-light text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          Musik latar ini terintegrasi penuh secara global dan tidak akan terputus saat Anda masuk atau keluar kelas! Gabungkan frekuensi lo-fi bawaan kelas, file rekaman MP3 lokal unggahan Anda sendiri, dan daftar video YouTube musik favorit Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Playlist Manager Workspace */}
        <div id="playlist-left-workspace" className="lg:col-span-7 space-y-6 text-left">
          
          {/* Segments Navigation Controls */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-white/5">
            {[
              { id: 'all', label: 'Semua Trek' },
              { id: 'presets', label: 'Lo-Fi Bawaan' },
              { id: 'local', label: `Lagu Lokal (${uploadedTracks.length})` },
              { id: 'youtube', label: `YouTube BGM (${youtubeTracks.length}/5)` }
            ].map(seg => (
              <button
                key={seg.id}
                onClick={() => setActiveSegment(seg.id as any)}
                className={`flex-1 text-center py-2 text-[10px] min-w-[70px] uppercase tracking-wider font-extrabold rounded-lg transition-all cursor-pointer ${
                  activeSegment === seg.id 
                    ? 'bg-gradient-to-r from-indigo-500/15 to-indigo-500/25 text-white border border-indigo-500/20' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>

          {/* Action Zone: Multi-Method Loader Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Audio Upload Box */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border border-dashed rounded-2xl p-4 text-center transition-all duration-300 relative group flex flex-col justify-center min-h-[140px] ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-500/10' 
                  : 'border-white/10 bg-slate-950/40 hover:bg-white/2 hover:border-white/20'
              }`}
            >
              <input 
                type="file" 
                accept="audio/mp3,audio/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-105 transition-transform duration-300">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-300">Unggah File MP3 Lokal</p>
                  <p className="text-[9px] text-zinc-500 font-light mt-1">
                    Seret & jatuhkan berkas audio di sini atau ketuk untuk telusuri
                  </p>
                </div>
              </div>
            </div>

            {/* YouTube Search Link add box */}
            <div className="border border-white/10 bg-slate-950/40 rounded-2xl p-4 flex flex-col justify-between min-h-[140px]">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-amber-500 font-mono font-bold block">YouTube Custom Stream</span>
                <p className="text-[10px] text-zinc-500 leading-snug">Tambahkan tautan video YouTube untuk diputar secara sekuensial.</p>
              </div>

              <form onSubmit={handleAddLink} className="flex gap-1.5 mt-2.5">
                <div className="relative flex-1">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Tempel URL YouTube..."
                    value={inputUrl}
                    onChange={(e) => {
                      setInputUrl(e.target.value);
                      setErrorText('');
                    }}
                    className="w-full bg-slate-950 border border-white/10 text-xs rounded-xl pl-8.5 pr-3 py-2.5 focus:outline-none focus:border-amber-500/40 text-zinc-200 placeholder-zinc-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAddingYt || youtubeTracks.length >= 5}
                  className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-slate-950 font-black px-4 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer hover:scale-[1.03] shrink-0"
                >
                  {isAddingYt ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>

          </div>

          {/* Feedback messages block */}
          {errorText && (
            <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-light bg-red-500/5 px-3 py-2 rounded-lg border border-red-500/10">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {successText && (
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-500/5 px-3 py-2 rounded-lg border border-emerald-500/10">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>{successText}</span>
            </div>
          )}

          {/* Render Active Track List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#818cf8] font-mono font-bold block">
                Daftar Lagu Terdaftar ({filteredTracks.length})
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">Loop sekuensial berjalan otomatis</span>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {filteredTracks.map((track, idx) => {
                const isSelected = activeTrackId === track.id;
                
                // Color formatting depending on track type
                let typeBadge = '';
                let borderClass = 'border-white/5 hover:border-white/10 hover:bg-white/2';
                let activeBackground = 'bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent border-indigo-500/30';
                
                if (track.type === 'preset') {
                  typeBadge = 'LO-FI';
                } else if (track.type === 'uploaded') {
                  typeBadge = 'LOKAL';
                  activeBackground = 'bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-transparent border-teal-500/30';
                } else if (track.type === 'youtube') {
                  typeBadge = 'YOUTUBE';
                  activeBackground = 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30';
                }

                return (
                  <div
                    key={track.id}
                    className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                      isSelected ? activeBackground : `bg-white/1 ${borderClass}`
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => playTrackById(track.id)}
                      className="flex-1 text-left flex items-center gap-3.5 cursor-pointer max-w-[85%] overflow-hidden"
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? track.type === 'youtube'
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-indigo-500 text-white shadow-md' 
                          : 'bg-slate-900 border border-white/5 text-zinc-400'
                      }`}>
                        {isSelected && isPlaying ? (
                          <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                        ) : (
                          <Music className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-semibold truncate ${isSelected ? 'text-white font-bold' : 'text-zinc-300'}`}>
                            {track.title}
                          </h4>
                          <span className={`text-[8px] font-mono p-0.5 px-1.5 rounded uppercase shrink-0 ${
                            track.type === 'youtube'
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/10'
                              : track.type === 'uploaded'
                                ? 'bg-teal-500/10 text-teal-300 border border-teal-500/10'
                                : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/10'
                          }`}>
                            {typeBadge}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono font-light truncate mt-0.5">{track.mood}</p>
                      </div>
                    </button>

                    {/* Delete Custom Tracks Button */}
                    {track.type !== 'preset' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (track.type === 'uploaded') {
                            removeUploadedTrack(track.id);
                          } else {
                            // Find index of this youtube item inside the actual youtubeTracks array
                            const ytIdx = youtubeTracks.findIndex(y => y.youtubeId === track.youtubeId);
                            if (ytIdx !== -1) {
                              removeYoutubeLink(ytIdx);
                            }
                          }
                        }}
                        className="p-2 opacity-60 hover:opacity-100 text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer shrink-0"
                        title="Hapus lagu ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}

              {filteredTracks.length === 0 && (
                <div className="py-12 text-center text-[10px] text-zinc-500 font-light border border-dashed border-white/5 rounded-2xl">
                  {activeSegment === 'local' 
                    ? 'Belum ada lagu lokal yang diunggah. Unggah file MP3 di atas!'
                    : activeSegment === 'youtube'
                      ? 'Belum ada playlist kustom YouTube. Tempel link di atas!'
                      : 'Kategori trek kosong.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Audio Player Aesthetic UI */}
        <div id="playlist-right-player" className="lg:col-span-5">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 text-center flex flex-col justify-between min-h-[440px] relative overflow-hidden bg-slate-950/60 shadow-lg">
            
            {/* Header info */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#ca8a04] flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-amber-500 animate-pulse' : 'bg-zinc-650'}`} />
                {activeTrack.type === 'youtube' ? 'YOUTUBE BGM ACTIVE' : activeTrack.type === 'uploaded' ? 'LOCAL MP3 STREAM' : 'RUKAAIJASS AMBIENT PRESENTS'}
              </span>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                NON-STOP BACKGROUND PLAYER
              </span>
            </div>

            {/* Simulated CD Spinner */}
            <div className="my-4 flex justify-center relative z-10">
              <div className="relative w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-950 flex items-center justify-center shadow-xl shadow-black/40 overflow-hidden">
                {/* Vinyl grooving */}
                <div className="absolute inset-2 border border-white/2 rounded-full" />
                <div className="absolute inset-4 border border-white/2 rounded-full" />
                <div className="absolute inset-8 border border-white/2 rounded-full" />
                <div className="absolute inset-12 border border-white/2 rounded-full" />
                
                {/* Spinning center logo */}
                <div className={`w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}>
                  <Music className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
            </div>

            {/* Current title showcase */}
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
                const bgClass = activeTrack.type === 'youtube'
                  ? 'bg-gradient-to-t from-amber-500/20 via-amber-400 to-amber-200' 
                  : activeTrack.type === 'uploaded'
                    ? 'bg-gradient-to-t from-teal-500/20 via-teal-400 to-teal-200'
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

                {/* Central Play/Pause */}
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

              {/* Volume Slider Section */}
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
