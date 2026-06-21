/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface YouTubeTrack {
  id: string; // Unique identifier
  url: string;
  title: string;
  youtubeId: string;
  isFetchingTitle?: boolean;
}

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
  youtubeTracks: YouTubeTrack[];
  addYoutubeLink: (url: string) => Promise<{ success: boolean; error?: string; warning?: string }>;
  removeYoutubeLink: (index: number) => void;
  isAddingYt: boolean;
  ytApiReady: boolean;
  showVideoMonitor: boolean;
  setShowVideoMonitor: (val: boolean) => void;
  currentTime: number;
  duration: number;
  seekTo: (seconds: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  // Memvalidasi URL youtube standar, seluler, shorts, embed, maupun youtu.be
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.5); // Default Volume 50%
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(20).fill(6));
  const [isAddingYt, setIsAddingYt] = useState<boolean>(false);
  const [showVideoMonitor, setShowVideoMonitor] = useState<boolean>(true); // Tampilkan streaming monitor sebagai default agar browser tidak memblokir autoplay

  // Menyimpan tracks youtube kustom di LocalStorage agar tidak hilang saat reload halaman
  const [youtubeTracks, setYoutubeTracks] = useState<YouTubeTrack[]>([]);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Reset progress states on track change
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrackIndex]);

  const animationRef = useRef<number | null>(null);

  // Muat atau inisialisasi default track list pembuka di awal
  useEffect(() => {
    try {
      const savedTracks = localStorage.getItem('ruka_custom_youtube_playlist_v4');
      if (savedTracks) {
        setYoutubeTracks(JSON.parse(savedTracks));
      } else {
        const defaults: YouTubeTrack[] = [
          {
            id: 'default-1',
            url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
            title: "Lofi Girl Radio 🌸 beats to study/relax to",
            youtubeId: "jfKfPfyJRdk"
          },
          {
            id: 'default-2',
            url: "https://www.youtube.com/watch?v=5qap5aO4i9A",
            title: "Traditional Japanese Lofi Hip Hop Beats 🎋",
            youtubeId: "5qap5aO4i9A"
          }
        ];
        setYoutubeTracks(defaults);
        localStorage.setItem('ruka_custom_youtube_playlist_v4', JSON.stringify(defaults));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Prosedur pemutaran sekuensial otomatis (Sequential Loop)
  const playNext = () => {
    if (youtubeTracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % youtubeTracks.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (youtubeTracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + youtubeTracks.length) % youtubeTracks.length);
    setIsPlaying(true);
  };

  const playNextRef = useRef(playNext);
  useEffect(() => {
    playNextRef.current = playNext;
  });

  // Kirim perintah aman ke Youtube IFrame menggunakan interaksi postMessage
  const sendPlayerCommand = (func: string, args: any[] = []) => {
    const iframe = document.getElementById('hidden-youtube-iframe-element1') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args
          }),
          '*'
        );
      } catch (e) {
        // Abaikan sandboxing error log
      }
    }
  };

  // Sinkronisasi pemutaran (Play, Pause, Volume, dan Mute) menggunakan postMessage & double-buffering timers
  useEffect(() => {
    const syncPlayer = () => {
      sendPlayerCommand(isPlaying ? 'playVideo' : 'pauseVideo');
      sendPlayerCommand('setVolume', [isMuted ? 0 : Math.round(volume * 100)]);
    };

    syncPlayer();

    // Gunakan cascade timeouts untuk mengonfigurasi IFrame lamban
    const t1 = setTimeout(syncPlayer, 300);
    const t2 = setTimeout(syncPlayer, 800);
    const t3 = setTimeout(syncPlayer, 1800);
    const t4 = setTimeout(syncPlayer, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [currentTrackIndex, isPlaying, isMuted, volume, youtubeTracks]);

  // Daftarkan listener pesan global untuk mendeteksi kapan video berakhir (playerState === 0)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Pastikan pesan berasal dari domain YouTube
      if (event.origin && !event.origin.includes('youtube')) return;

      try {
        let msg = event.data;
        if (typeof msg === 'string') {
          msg = JSON.parse(msg);
        }

        if (msg && msg.event === 'infoDelivery' && msg.info) {
          // Status 0 mewakili ENDED (Video selesai diputar)
          if (msg.info.playerState === 0) {
            playNextRef.current();
          }

          if (typeof msg.info.currentTime === 'number') {
            setCurrentTime(msg.info.currentTime);
          }
          if (typeof msg.info.duration === 'number') {
            setDuration(msg.info.duration);
          }
        }
      } catch (e) {
        // Mengabaikan parse non-JSON biasa
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Sinkronisasi dan interpolasi waktu putar lokal yang sangat halus (smooth ticking)
  useEffect(() => {
    if (!isPlaying) return;

    // Mengakselerasi estimasi waktu kustom setiap 100ms demi progress bar yang mulus (10fps)
    const tickInterval = setInterval(() => {
      setCurrentTime((prev) => {
        if (duration > 0 && prev >= duration) {
          return duration;
        }
        return prev + 0.1;
      });
    }, 100);

    // Meminta update resmi dari Youtube API setiap 1.5 detik agar kinerjanya tetap sinkron & presisi
    const pollInterval = setInterval(() => {
      sendPlayerCommand('getCurrentTime');
      sendPlayerCommand('getDuration');
    }, 1500);

    return () => {
      clearInterval(tickInterval);
      clearInterval(pollInterval);
    };
  }, [isPlaying, duration]);

  // Melakukan lompatan waktu (seek) di pemutar YouTube
  const seekTo = (seconds: number) => {
    sendPlayerCommand('seekTo', [seconds, true]);
    setCurrentTime(seconds);
  };

  // Fungsi menambah tautan YouTube baru (Maksimal 5)
  const addYoutubeLink = async (url: string) => {
    const yId = getYouTubeId(url);
    if (!yId) {
      return { success: false, error: 'Format link YouTube tidak valid.' };
    }

    if (youtubeTracks.length >= 5) {
      return { success: false, error: 'Maksimum adalah 5 video kustom di dalam daftar putar.' };
    }

    if (youtubeTracks.some(t => t.youtubeId === yId)) {
      return { success: false, error: 'Video YouTube ini sudah ada di dalam daftar putar.' };
    }

    setIsAddingYt(true);

    const newTrackId = `yt-${Date.now()}`;
    // 1. Buat track placeholder secara INSTANT agar langsung diputar tanpa delai oEmbed
    const tempTrack: YouTubeTrack = {
      id: newTrackId,
      url,
      title: 'Menyambungkan audio YouTube...',
      youtubeId: yId,
      isFetchingTitle: true
    };

    const updated = [...youtubeTracks, tempTrack];
    setYoutubeTracks(updated);
    localStorage.setItem('ruka_custom_youtube_playlist_v4', JSON.stringify(updated));

    // Putar lagu baru ini detik itu juga!
    const newIndex = updated.length - 1;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true);

    // Ambil judul video asli dari oEmbed gratis secara asinkron di latar belakang
    fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => {
        setYoutubeTracks(prev => {
          const next = prev.map(t => {
            if (t.id === newTrackId) {
              return {
                ...t,
                title: data.title || `Video Musik YouTube (ID: ${yId})`,
                isFetchingTitle: false
              };
            }
            return t;
          });
          localStorage.setItem('ruka_custom_youtube_playlist_v4', JSON.stringify(next));
          return next;
        });
      })
      .catch(() => {
        setYoutubeTracks(prev => {
          const next = prev.map(t => {
            if (t.id === newTrackId) {
              return {
                ...t,
                title: `Video Musik YouTube (ID: ${yId})`,
                isFetchingTitle: false
              };
            }
            return t;
          });
          localStorage.setItem('ruka_custom_youtube_playlist_v4', JSON.stringify(next));
          return next;
        });
      })
      .finally(() => {
        setIsAddingYt(false);
      });

    return { success: true };
  };

  // Menyingkirkan tautan YouTube dari daftar
  const removeYoutubeLink = (index: number) => {
    const targetTrack = youtubeTracks[index];
    if (targetTrack) {
      const updated = youtubeTracks.filter((_, i) => i !== index);
      setYoutubeTracks(updated);
      localStorage.setItem('ruka_custom_youtube_playlist_v4', JSON.stringify(updated));

      // Jika menghapus trek aktif, sesuaikan indeks
      if (currentTrackIndex === index) {
        if (updated.length > 0) {
          const nextIdx = index % updated.length;
          setCurrentTrackIndex(nextIdx);
        } else {
          setIsPlaying(false);
          setCurrentTrackIndex(0);
        }
      } else if (currentTrackIndex > index) {
        setCurrentTrackIndex((prev) => prev - 1);
      }
    }
  };

  const playTrack = (index: number) => {
    if (index >= 0 && index < youtubeTracks.length) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Visualizer pergerakan grafik audio batangan secara dinamis
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

  const activeTrack = youtubeTracks[currentTrackIndex];

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
        youtubeTracks,
        addYoutubeLink,
        removeYoutubeLink,
        isAddingYt,
        ytApiReady: true, // Dipaksa true karena memakai API postMessage bawaan yang selalu siap
        showVideoMonitor,
        setShowVideoMonitor,
        currentTime,
        duration,
        seekTo
      }}
    >
      {children}

      {/* 
        Sleek Glassmorphic Floating TV Monitor:
        Ini menampilkan Live Feed/Video aktif dari YouTube. Menjaga visual render tetap aktif 
        di atas 1px pada layer viewport menghindarkan browser modern (Chrome/Safari) dari menangguhkan (throttling) 
        pemutaran audio tab latar belakang. User juga dapat memantau video klip Lofi Girl mereka secara nyata!
      */}
      {activeTrack && (
        <div 
          id="youtube-floating-monitor-screen"
          className="fixed bottom-24 left-6 z-[78] transition-all duration-300 ease-in-out font-sans"
          style={{
            transform: showVideoMonitor ? 'scale(1)' : 'scale(0.001)',
            opacity: showVideoMonitor ? 1 : 0.01,
            pointerEvents: showVideoMonitor ? 'auto' : 'none',
          }}
        >
          <div className="bg-slate-950/95 border border-white/10 rounded-2xl p-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-md w-52 flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[9px] font-mono font-bold tracking-widest text-amber-500 flex items-center gap-1.5 uppercase">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-zinc-650'}`} />
                Lofi Monitor
              </span>
              <button 
                type="button"
                onClick={() => setShowVideoMonitor(false)}
                className="text-[9px] text-[#fbbf24] hover:text-white px-1 ml-2 font-mono font-bold cursor-pointer hover:underline"
              >
                Sembunyikan
              </button>
            </div>
            
            <div className="w-full h-28 bg-black rounded-xl overflow-hidden relative border border-white/5">
              <iframe
                id="hidden-youtube-iframe-element1"
                src={`https://www.youtube.com/embed/${activeTrack.youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&controls=0&rel=0&modestbranding=1&disablekb=1&fs=0`}
                title="Lofi Stream"
                allow="autoplay; encrypted-media"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
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
