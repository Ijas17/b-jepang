/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AMBIENT_TRACKS } from '../data';

export interface YoutubeTrack {
  url: string;
  id: string;
}

interface MusicContextType {
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (val: number) => void;
  currentTrackType: 'ambient' | 'youtube';
  setCurrentTrackType: (val: 'ambient' | 'youtube') => void;
  youtubeId: string | null;
  setYoutubeId: (val: string | null) => void;
  volume: number;
  setVolume: (val: number) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  youtubeLinks: string[];
  addYoutubeLink: (url: string) => { success: boolean; error?: string };
  removeYoutubeLink: (index: number) => void;
  visualizerBars: number[];
  playTrack: (type: 'ambient' | 'youtube', target: number | string) => void;
  togglePlay: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [currentTrackType, setCurrentTrackType] = useState<'ambient' | 'youtube'>('ambient');
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.4);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>([]);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(20).fill(6));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Load saved YouTube links from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ruka_custom_yt_links');
      if (saved) {
        setYoutubeLinks(JSON.parse(saved));
      } else {
        // Seed default lofi YouTube links if empty
        const defaults = [
          "https://www.youtube.com/watch?v=jfKfPfyJRdk", // Lofi Girl Study Beats
          "https://www.youtube.com/watch?v=5qap5aO4i9A"  // Japanese Lofi Hip Hop
        ];
        setYoutubeLinks(defaults);
        localStorage.setItem('ruka_custom_yt_links', JSON.stringify(defaults));
      }
    } catch (e) {}
  }, []);

  // Initialize and keep Ambient HTML5 Audio updated
  useEffect(() => {
    const activeTrack = AMBIENT_TRACKS[currentTrackIndex];
    if (!audioRef.current) {
      audioRef.current = new Audio(activeTrack.sourceUrl);
      audioRef.current.loop = true;
      audioRef.current.preload = "auto";
    } else {
      const wasPlaying = isPlaying && currentTrackType === 'ambient';
      audioRef.current.pause();
      audioRef.current.src = activeTrack.sourceUrl;
      audioRef.current.preload = "auto";
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  // Synchronize audio state when toggle play/pause or changing track type
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentTrackType === 'ambient') {
        audioRef.current.muted = isMuted;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackType, isMuted, volume]);

  // Visualizer bar animation loop
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

  // Helper to add custom Youtube links
  const addYoutubeLink = (url: string) => {
    const id = getYouTubeId(url);
    if (!id) {
      return { success: false, error: 'Format link YouTube tidak valid.' };
    }
    if (youtubeLinks.includes(url)) {
      return { success: false, error: 'Link YouTube ini sudah ada di daftar.' };
    }
    if (youtubeLinks.length >= 5) {
      return { success: false, error: 'Maksimum adalah 5 link untuk playlist kustom.' };
    }
    const updated = [...youtubeLinks, url];
    setYoutubeLinks(updated);
    localStorage.setItem('ruka_custom_yt_links', JSON.stringify(updated));
    return { success: true };
  };

  // Helper to remove YouTube links
  const removeYoutubeLink = (index: number) => {
    const updated = youtubeLinks.filter((_, i) => i !== index);
    setYoutubeLinks(updated);
    localStorage.setItem('ruka_custom_yt_links', JSON.stringify(updated));
    if (currentTrackType === 'youtube' && youtubeId === getYouTubeId(youtubeLinks[index])) {
      setIsPlaying(false);
      setYoutubeId(null);
    }
  };

  // Switch and Play Track
  const playTrack = (type: 'ambient' | 'youtube', target: number | string) => {
    setCurrentTrackType(type);
    if (type === 'ambient') {
      setYoutubeId(null);
      setCurrentTrackIndex(target as number);
      setIsPlaying(true);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setYoutubeId(target as string);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <MusicContext.Provider value={{
      isPlaying,
      setIsPlaying,
      currentTrackIndex,
      setCurrentTrackIndex,
      currentTrackType,
      setCurrentTrackType,
      youtubeId,
      setYoutubeId,
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
    }}>
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
