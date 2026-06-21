/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AMBIENT_TRACKS } from '../data';

interface MusicContextType {
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (val: number) => void;
  volume: number;
  setVolume: (val: number) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  visualizerBars: number[];
  togglePlay: () => void;
  playTrack: (index: number) => void;
  playNext: () => void;
  playPrev: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(20).fill(6));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize Audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Sync index and audio URL source
  useEffect(() => {
    if (!audioRef.current) return;
    
    const track = AMBIENT_TRACKS[currentTrackIndex];
    if (track) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current.src = track.sourceUrl;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  // Sync playback state, volume adjustments, and mutes
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.muted = isMuted;
    audioRef.current.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isMuted, volume]);

  // Handle automatic continuous play progression when a track ends
  useEffect(() => {
    if (!audioRef.current) return;

    const handleEnded = () => {
      playNext();
    };

    audioRef.current.addEventListener('ended', handleEnded);
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentTrackIndex]);

  // Track control actions
  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % AMBIENT_TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + AMBIENT_TRACKS.length) % AMBIENT_TRACKS.length);
    setIsPlaying(true);
  };

  const playTrack = (index: number) => {
    if (index >= 0 && index < AMBIENT_TRACKS.length) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Sound bar visualization movement effect
  useEffect(() => {
    if (isPlaying) {
      const updateVisualizer = () => {
        setVisualizerBars(
          Array(20)
            .fill(0)
            .map(() => Math.floor(Math.random() * 55) + 12)
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
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        currentTrackIndex,
        setCurrentTrackIndex,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        visualizerBars,
        togglePlay,
        playTrack,
        playNext,
        playPrev,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
