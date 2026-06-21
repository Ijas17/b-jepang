/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AMBIENT_TRACKS } from '../data';

export interface MusicTrack {
  id: string;
  type: 'preset' | 'uploaded' | 'youtube';
  title: string;
  sourceUrl: string;
  youtubeId?: string;
  mood?: string;
  isFetchingTitle?: boolean;
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
  addYoutubeLink: (url: string) => Promise<{ success: boolean; error?: string; warning?: string }>;
  removeYoutubeLink: (index: number) => void;
  visualizerBars: number[];
  playTrack: (type: 'ambient' | 'youtube', target: number | string) => void;
  togglePlay: () => void;

  // UNIFIED FEATURES
  tracks: MusicTrack[];
  activeTrackId: string;
  playTrackById: (id: string) => void;
  uploadedTracks: { id: string; title: string; sourceUrl: string; mood: string }[];
  addUploadedTrack: (file: File) => void;
  removeUploadedTrack: (id: string) => void;
  youtubeTracks: { url: string; title: string; youtubeId: string; isFetchingTitle?: boolean }[];
  isAddingYt: boolean;
  playNext: () => void;
  playPrev: () => void;
  ytApiReady: boolean;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  // Support watches, embeds, shorts, youtu.be, mobile headers, etc.
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5); // Default to comfortable mid range
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(20).fill(6));
  const [ytApiReady, setYtApiReady] = useState<boolean>(false);

  // Legacy compatibility states
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [currentTrackType, setCurrentTrackType] = useState<'ambient' | 'youtube'>('ambient');
  const [youtubeId, setYoutubeId] = useState<string | null>(null);

  // New states
  const [uploadedTracks, setUploadedTracks] = useState<{ id: string; title: string; sourceUrl: string; mood: string }[]>([]);
  const [youtubeTracks, setYoutubeTracks] = useState<{ url: string; title: string; youtubeId: string; isFetchingTitle?: boolean }[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string>('preset-0');
  const [isAddingYt, setIsAddingYt] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytPidRef = useRef<string | null>(null);

  // Flattened tracks selector
  const tracks: MusicTrack[] = [
    ...AMBIENT_TRACKS.map((t, idx) => ({
      id: `preset-${idx}`,
      type: 'preset' as const,
      title: t.title,
      sourceUrl: t.sourceUrl,
      mood: t.mood
    })),
    ...uploadedTracks.map(t => ({
      id: t.id,
      type: 'uploaded' as const,
      title: t.title,
      sourceUrl: t.sourceUrl,
      mood: t.mood
    })),
    ...youtubeTracks.map(t => ({
      id: `youtube-${t.youtubeId}`,
      type: 'youtube' as const,
      title: t.title,
      sourceUrl: t.url,
      youtubeId: t.youtubeId,
      mood: t.isFetchingTitle ? 'Memproses oEmbed Video...' : 'YouTube Custom Stream'
    }))
  ];

  const youtubeLinks = youtubeTracks.map(t => t.url);

  // Auto-init and load custom tracks from local storage
  useEffect(() => {
    try {
      const savedYt = localStorage.getItem('ruka_custom_yt_tracks_v3');
      if (savedYt) {
        setYoutubeTracks(JSON.parse(savedYt));
      } else {
        const defaults = [
          {
            url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
            title: "Lofi Girl Radio 🌸 beats to study/relax to",
            youtubeId: "jfKfPfyJRdk"
          },
          {
            url: "https://www.youtube.com/watch?v=5qap5aO4i9A",
            title: "Traditional Japanese Lofi Hip Hop Beats 🎋",
            youtubeId: "5qap5aO4i9A"
          }
        ];
        setYoutubeTracks(defaults);
        localStorage.setItem('ruka_custom_yt_tracks_v3', JSON.stringify(defaults));
      }
    } catch (e) {}

    // Init standard Audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
    }

    // Set fallback ready callback before injecting
    window.onYouTubeIframeAPIReady = () => {
      setYtApiReady(true);
    };

    // Inject YouTube IFrame API Script
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    } else if (window.YT.Player) {
      setYtApiReady(true);
    }

    // Fast check interval
    const interval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        setYtApiReady(true);
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Playback sequential looping
  const playNext = () => {
    const currentIndex = tracks.findIndex(t => t.id === activeTrackId);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    if (nextTrack) {
      playTrackById(nextTrack.id);
    }
  };

  const playPrev = () => {
    const currentIndex = tracks.findIndex(t => t.id === activeTrackId);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    const prevTrack = tracks[prevIndex];
    if (prevTrack) {
      playTrackById(prevTrack.id);
    }
  };

  const playNextRef = useRef(playNext);
  useEffect(() => {
    playNextRef.current = playNext;
  });

  // End event listener for HTML5 standard audio
  useEffect(() => {
    if (!audioRef.current) return;
    const handleEnded = () => {
      playNextRef.current();
    };
    audioRef.current.addEventListener('ended', handleEnded);
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [tracks, activeTrackId]);

  // Unified track selection
  const playTrackById = (id: string) => {
    const track = tracks.find(t => t.id === id);
    if (!track) return;

    setActiveTrackId(id);
    setIsPlaying(true);

    if (track.type === 'preset') {
      const idx = AMBIENT_TRACKS.findIndex(t => t.sourceUrl === track.sourceUrl);
      if (idx !== -1) {
        setCurrentTrackIndex(idx);
      }
      setCurrentTrackType('ambient');
      setYoutubeId(null);
    } else if (track.type === 'uploaded') {
      setCurrentTrackType('ambient');
      setYoutubeId(null);
    } else if (track.type === 'youtube') {
      setCurrentTrackType('youtube');
      setYoutubeId(track.youtubeId || null);
    }
  };

  // Backwards compatible bridging
  const playTrack = (type: 'ambient' | 'youtube', target: number | string) => {
    if (type === 'ambient') {
      playTrackById(`preset-${target}`);
    } else {
      playTrackById(`youtube-${target}`);
    }
  };

  const activeTrack = tracks.find(t => t.id === activeTrackId) || tracks[0];

  // Sync state between engines
  useEffect(() => {
    if (!audioRef.current || !activeTrack) return;

    if (activeTrack.type === 'preset' || activeTrack.type === 'uploaded') {
      // Safely silent and pause YouTube
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch (e) {}
      }

      if (audioRef.current.src !== activeTrack.sourceUrl) {
        audioRef.current.pause();
        audioRef.current.src = activeTrack.sourceUrl;
        audioRef.current.preload = 'auto';
        audioRef.current.load();
      }

      if (isPlaying) {
        audioRef.current.muted = isMuted;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    } else if (activeTrack.type === 'youtube') {
      // Pause HTML5 audio completely to prevent overlapping audio
      audioRef.current.pause();

      if (ytPlayerRef.current && ytPidRef.current === activeTrack.youtubeId) {
        try {
          if (isPlaying) {
            if (typeof ytPlayerRef.current.setVolume === 'function') {
              ytPlayerRef.current.setVolume(isMuted ? 0 : Math.round(volume * 100));
            }
            if (typeof ytPlayerRef.current.playVideo === 'function') {
              ytPlayerRef.current.playVideo();
            }
          } else {
            if (typeof ytPlayerRef.current.pauseVideo === 'function') {
              ytPlayerRef.current.pauseVideo();
            }
          }
        } catch (e) {}
      }
    }
  }, [activeTrackId, isPlaying, isMuted, volume]);

  // YouTube dynamic player constructor & loader
  useEffect(() => {
    if (!ytApiReady || activeTrack.type !== 'youtube' || !activeTrack.youtubeId) return;

    const targetYtId = activeTrack.youtubeId;
    if (ytPidRef.current === targetYtId && ytPlayerRef.current) return;

    ytPidRef.current = targetYtId;

    if (!ytPlayerRef.current) {
      try {
        ytPlayerRef.current = new window.YT.Player('hidden-yt-player-container', {
          height: '240',
          width: '320',
          host: 'https://www.youtube.com',
          videoId: targetYtId,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            loop: 0,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              try {
                event.target.setVolume(isMuted ? 0 : Math.round(volume * 100));
                if (isPlaying) {
                  event.target.playVideo();
                }
              } catch (e) {}
            },
            onStateChange: (event: any) => {
              if (event.data === 0) { // YT.PlayerState.ENDED (0)
                playNextRef.current();
              }
            }
          }
        });
      } catch (err) {
        console.error("YT Player initialization error:", err);
      }
    } else {
      try {
        if (typeof ytPlayerRef.current.loadVideoById === 'function') {
          if (isPlaying) {
            ytPlayerRef.current.loadVideoById({ videoId: targetYtId, startSeconds: 0 });
          } else {
            ytPlayerRef.current.cueVideoById({ videoId: targetYtId, startSeconds: 0 });
          }
          if (typeof ytPlayerRef.current.setVolume === 'function') {
            ytPlayerRef.current.setVolume(isMuted ? 0 : Math.round(volume * 100));
          }
        }
      } catch (e) {
        console.error("YT player loading error:", e);
      }
    }
  }, [activeTrack, ytApiReady]);

  // Add Local file support
  const addUploadedTrack = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const newTrack = {
      id: `uploaded-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      sourceUrl: objectUrl,
      mood: `Audio File Lokal • ${Math.round(file.size / 1024 / 1024 * 10) / 10} MB`
    };

    setUploadedTracks(prev => [...prev, newTrack]);
    playTrackById(newTrack.id);
  };

  const removeUploadedTrack = (id: string) => {
    const match = uploadedTracks.find(t => t.id === id);
    if (match) {
      URL.revokeObjectURL(match.sourceUrl);
    }
    setUploadedTracks(prev => prev.filter(t => t.id !== id));
    if (activeTrackId === id) {
      playNext();
    }
  };

  // Add YouTube Link with Non-blocking Async load
  const addYoutubeLink = async (url: string) => {
    const id = getYouTubeId(url);
    if (!id) {
      return { success: false, error: 'Format link YouTube tidak valid.' };
    }

    if (youtubeTracks.length >= 5) {
      return { success: false, error: 'Maksimum adalah 5 video untuk playlist YouTube kustom.' };
    }

    if (youtubeTracks.some(t => t.youtubeId === id)) {
      return { success: false, error: 'Video YouTube ini sudah ada di daftar.' };
    }

    setIsAddingYt(true);

    // 1. Create a placeholder to play INSTANTLY without waiting for oEmbed latency
    const placeholderTrack = {
      url,
      title: 'Memutar video YouTube...',
      youtubeId: id,
      isFetchingTitle: true
    };

    const updated = [...youtubeTracks, placeholderTrack];
    setYoutubeTracks(updated);
    localStorage.setItem('ruka_custom_yt_tracks_v3', JSON.stringify(updated));

    // 2. Play it immediately!
    playTrackById(`youtube-${id}`);

    // 3. Fetch full oEmbed metadata asynchronously in the background
    fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => {
        setYoutubeTracks(prev => {
          const next = prev.map(t => {
            if (t.youtubeId === id) {
              return { 
                ...t, 
                title: data.title || `YouTube Video (ID: ${id})`,
                isFetchingTitle: false 
              };
            }
            return t;
          });
          localStorage.setItem('ruka_custom_yt_tracks_v3', JSON.stringify(next));
          return next;
        });
      })
      .catch(() => {
        // Fallback default
        setYoutubeTracks(prev => {
          const next = prev.map(t => {
            if (t.youtubeId === id) {
              return { 
                ...t, 
                title: `YouTube Video (ID: ${id})`,
                isFetchingTitle: false 
              };
            }
            return t;
          });
          localStorage.setItem('ruka_custom_yt_tracks_v3', JSON.stringify(next));
          return next;
        });
      })
      .finally(() => {
        setIsAddingYt(false);
      });

    return { success: true };
  };

  const removeYoutubeLink = (index: number) => {
    const target = youtubeTracks[index];
    if (target) {
      const updated = youtubeTracks.filter((_, i) => i !== index);
      setYoutubeTracks(updated);
      localStorage.setItem('ruka_custom_yt_tracks_v3', JSON.stringify(updated));

      const targetId = `youtube-${target.youtubeId}`;
      if (activeTrackId === targetId) {
        playNext();
      }
    }
  };

  // Micro-bars visualizer loop
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

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
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
      togglePlay,

      // UNIFIED FEATS
      tracks,
      activeTrackId,
      playTrackById,
      uploadedTracks,
      addUploadedTrack,
      removeUploadedTrack,
      youtubeTracks,
      isAddingYt,
      playNext,
      playPrev,
      ytApiReady
    }}>
      {children}
      {/* 
        This is an off-screen fixed container wrapper with visible style properties and size.
        Modern browser context blocks standard autoplay or audio output for hidden elements 
        or elements sized at 1px / 1px. Keeping standard ratios and placement guarantees 
        unthrottled active audio decoding!
      */}
      <div 
        id="hidden-yt-player-container-wrapper" 
        style={{ 
          position: 'fixed', 
          bottom: '-600px', 
          right: '-600px', 
          width: '320px', 
          height: '240px', 
          zIndex: -9999,
          opacity: 0.01,
          pointerEvents: 'none' 
        }} 
      >
        <div id="hidden-yt-player-container" />
      </div>
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
