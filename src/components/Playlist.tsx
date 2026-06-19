/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AMBIENT_TRACKS } from '../data';
import { Play, Pause, Music, Volume2, VolumeX, Sparkles, ChevronRight, Check } from 'lucide-react';

export default function Playlist() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(16).fill(10));
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const activeTrack = AMBIENT_TRACKS[currentTrackIndex];

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(activeTrack.sourceUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = isMuted ? 0 : volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle source change
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current.src = activeTrack.sourceUrl;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  // Handle Play/Pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume & mute changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Visualizer Animation Loop
  useEffect(() => {
    if (isPlaying) {
      const updateVisualizer = () => {
        setVisualizerBars(
          Array(20)
            .fill(0)
            .map(() => Math.floor(Math.random() * 55) + 10)
        );
        animationRef.current = requestAnimationFrame(updateVisualizer);
      };
      animationRef.current = requestAnimationFrame(updateVisualizer);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setVisualizerBars(Array(20).fill(6));
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTrackChange = (idx: number) => {
    setCurrentTrackIndex(idx);
    setIsPlaying(true);
  };

  return (
    <section id="playlist" className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto border-b border-white/5 bg-slate-950/10">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div id="playlist-badge" className="text-xs text-zinc-400 font-medium tracking-widest uppercase mb-3 bg-white/5 px-2.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-zinc-300" />
          AUDIO BACKING TRACK
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display text-white font-normal leading-tight mb-6">
          Suara Pengiring <span className="italic text-zinc-400">Belajar Tenang</span>
        </h2>
        <p className="text-zinc-300 font-light text-sm sm:text-base leading-relaxed">
          Posisikan fokus Anda pada frekuensi terbaik. Nyalakan musik latar untuk menemani Anda 
          mempelajari kosakata atau merangkai huruf Jepang. Volume otomatis meredup saat audio materi diputar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Playlist selections */}
        <div id="playlist-controls-panel" className="lg:col-span-4 space-y-4">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold px-1">Pilihan Suasana</span>
          
          <div className="space-y-3">
            {AMBIENT_TRACKS.map((track, i) => {
              const isSelected = i === currentTrackIndex;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackChange(i)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? 'bg-white/10 border-white/20 text-white font-semibold' 
                      : 'bg-white/2 hover:bg-white/5 border-white/5 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex gap-4 items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${isSelected ? 'bg-white text-zinc-900 animate-pulse' : 'bg-white/5 text-zinc-400'}`}>
                      {isSelected ? <Check className="w-4 h-4" /> : <Music className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{track.title}</h4>
                      <p className="text-[11px] text-zinc-500 font-light">{track.mood}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Audio player mock UI with volume controls and beautiful visualizer active */}
        <div id="audio-player-panel" className="lg:col-span-8">
          <div className="liquid-glass rounded-3xl p-8 sm:p-10 border border-white/10 text-center flex flex-col justify-between min-h-[300px]">
            
            {/* Playing Status Tag */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'}`} />
                {isPlaying ? 'MEMUTAR AMBIENT' : 'LOBI MUSIK SIAP'}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                RukaaIjass Harmony Room
              </span>
            </div>

            {/* Track metadata */}
            <div className="my-6">
              <h3 className="text-3xl sm:text-4xl text-white font-display font-normal">
                {activeTrack.title}
              </h3>
              <p className="text-zinc-400 font-light italic text-sm mt-1.5">
                {activeTrack.mood}
              </p>
            </div>

            {/* Reacting visualizer bars */}
            <div className="h-20 flex items-end justify-center gap-1 sm:gap-1.5 px-4 mb-8">
              {visualizerBars.map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className="w-1.5 sm:w-2 bg-gradient-to-t from-white/10 to-zinc-200 rounded-full transition-all duration-300"
                />
              ))}
            </div>

            {/* Control buttons & volume adjust card */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5 bg-white/2 p-5 rounded-2xl">
              
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-white text-slate-950 font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current text-zinc-900" />
                  ) : (
                    <Play className="w-6 h-6 fill-current text-zinc-900 translate-x-0.5" />
                  )}
                </button>
                <div className="text-left">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Status Pemutar</span>
                  <p className="text-xs text-zinc-300 font-light">
                    {isPlaying ? 'Ketuk untuk menghentikan musik pengiring' : 'Putar chord damai belajar'}
                  </p>
                </div>
              </div>

              {/* Volume sliders */}
              <div id="volume-wrapper" className="flex items-center gap-3 w-full sm:w-auto max-w-xs">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-24 sm:w-32 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <span className="text-[10px] font-mono text-zinc-500 w-8">
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
