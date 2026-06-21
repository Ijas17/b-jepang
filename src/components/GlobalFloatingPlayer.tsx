/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMusic, getYouTubeId } from '../contexts/MusicContext';
import { 
  Music, 
  Play, 
  Pause, 
  X, 
  Plus, 
  Trash2, 
  Volume2, 
  ListMusic, 
  Link as LinkIcon, 
  HelpCircle,
  Loader2
} from 'lucide-react';
import { AMBIENT_TRACKS } from '../data';

export default function GlobalFloatingPlayer() {
  const {
    isPlaying,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    playTrackById,
    togglePlay,

    // UNIFIED FEATURES
    tracks,
    activeTrackId,
    youtubeTracks,
    isAddingYt,
    addYoutubeLink,
    removeYoutubeLink,
    youtubeLinks
  } = useMusic();

  const [isOpen, setIsOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [errorText, setErrorText] = useState('');
  const [activeTab, setActiveTab] = useState<'preset' | 'youtube'>('preset');

  const activeTrack = tracks.find(t => t.id === activeTrackId) || tracks[0];

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    if (!inputUrl.trim()) return;

    const res = await addYoutubeLink(inputUrl.trim());
    if (res.success) {
      setInputUrl('');
    } else {
      setErrorText(res.error || 'Gagal menambahkan link.');
    }
  };

  return (
    <div id="global-floating-player-widget" className="fixed bottom-6 right-6 z-[80] font-sans">
      {/* Tiny Minimized Floating Bubble when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 rounded-full flex flex-col items-center justify-center border text-white transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 group relative ${
            isPlaying 
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 border-emerald-400 shadow-emerald-500/20' 
              : 'bg-slate-900/90 border-white/10 hover:border-white/20'
          }`}
        >
          {isPlaying ? (
            <>
              {/* Pulsing rings */}
              <span className="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping" />
              <Music className="w-5 h-5 animate-bounce text-white relative z-10" />
              <span className="text-[7px] font-black tracking-widest uppercase text-white mt-0.5 relative z-10 antialiased">PLAY</span>
            </>
          ) : (
            <>
              <Music className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="text-[7px] font-bold tracking-widest uppercase text-zinc-500 mt-0.5">BGM</span>
            </>
          )}

          {/* Quick interactive tooltip */}
          <span className="absolute right-16 bg-slate-950 text-white text-[9px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/5 pointer-events-none uppercase tracking-wider">
            {isPlaying ? `Playing: ${activeTrack.title}` : 'Nyalakan Musik Latar 🌸'}
          </span>
        </button>
      )}

      {/* Expanded Glassmorphic Player Card */}
      {isOpen && (
        <div className="w-80 bg-slate-950/95 backdrop-blur-xl border border-white/15 rounded-3xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] animate-fade-rise space-y-4 text-left">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Studio Audio Latar</h4>
                <p className="text-[9px] text-zinc-500 font-mono">NON-STOP BACKING PLAYER</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Track Detail banner */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-black uppercase tracking-widest text-[#ca8a04] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/10">
                {activeTrack.type.toUpperCase()}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
            </div>
            
            <div className="overflow-hidden">
              <span className="text-xs font-semibold text-white block truncate leading-snug">
                {activeTrack.title}
              </span>
              <span className="text-[10px] text-zinc-400 block truncate font-light leading-none">
                {activeTrack.mood}
              </span>
            </div>

            {/* Quick mini-controls */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <button
                onClick={togglePlay}
                className="p-1 px-3 bg-white text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-zinc-100 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current translate-x-0.2" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-white/10 rounded appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setActiveTab('preset')}
              className={`flex-1 text-center py-2 text-[10px] uppercase tracking-wider font-extrabold pb-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'preset' ? 'border-emerald-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Lofi Built-in
            </button>
            <button
              onClick={() => setActiveTab('youtube')}
              className={`flex-1 text-center py-2 text-[10px] uppercase tracking-wider font-extrabold pb-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'youtube' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              YouTube Custom
            </button>
          </div>

          {/* Presets List */}
          {activeTab === 'preset' && (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {tracks.filter(t => t.type !== 'youtube').map((track) => {
                const isSelected = activeTrackId === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => playTrackById(track.id)}
                    className={`w-full text-left p-2 px-2.5 rounded-xl border text-[11px] flex justify-between items-center transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white font-bold' 
                        : 'bg-white/1 border-white/5 text-zinc-400 hover:bg-white/3'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <ListMusic className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{track.title}</span>
                    </div>
                    {isSelected && isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* YouTube Links Tab */}
          {activeTab === 'youtube' && (
            <div className="space-y-3">
              <form onSubmit={handleAddLink} className="flex gap-1.5">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-550" />
                  <input
                    type="text"
                    placeholder="Input link YouTube..."
                    value={inputUrl}
                    onChange={(e) => {
                      setInputUrl(e.target.value);
                      setErrorText('');
                    }}
                    className="w-full bg-slate-900 border border-white/10 text-[10px] rounded-lg pl-8 pr-2 py-2 focus:outline-none focus:border-amber-500 text-zinc-100 placeholder-zinc-650"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAddingYt || youtubeTracks.length >= 5}
                  className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-slate-950 font-black px-2.5 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  {isAddingYt ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </button>
              </form>

              {errorText && (
                <p className="text-[9px] text-red-400 bg-red-400/5 p-1.5 px-2.5 border border-red-500/10 rounded-lg">{errorText}</p>
              )}

              <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                {youtubeTracks.map((track, idx) => {
                  const isSelected = activeTrackId === `youtube-${track.youtubeId}`;
                  return (
                    <div
                      key={idx}
                      className={`p-1.5 rounded-xl border flex items-center justify-between gap-2 text-[10px] ${
                        isSelected ? 'bg-amber-500/10 border-amber-500/30 font-semibold' : 'bg-white/1 border-white/5'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => playTrackById(`youtube-${track.youtubeId}`)}
                        className="flex-1 text-left truncate cursor-pointer text-zinc-300 hover:text-white"
                      >
                        {idx + 1}. {track.title}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeYoutubeLink(idx)}
                        className="text-red-400 p-1 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
                {youtubeTracks.length === 0 && (
                  <p className="text-[10px] text-center text-zinc-600 py-3 font-light">Belum ada link kustom youtube.</p>
                )}
              </div>
            </div>
          )}

          {/* Quick note */}
          <div className="text-[9px] text-zinc-500 pt-2 border-t border-white/5 flex items-center gap-1 leading-relaxed">
            <HelpCircle className="w-3 h-3 text-zinc-400 shrink-0" />
            <span>Mendukung lofi audio non-stop di seluruh perjalanan belajar Anda.</span>
          </div>

        </div>
      )}
    </div>
  );
}
