/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Globe, Sparkles, Moon, Music } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';

interface NavbarProps {
  onNavClick: (sectionId: string) => void;
  activeSection: string;
  isInsideApp?: boolean;
  onEnterApp?: () => void;
  onExitApp?: () => void;
  isFocusModeActive?: boolean;
  onToggleFocusMode?: (val: boolean) => void;
}

export default function Navbar({ 
  onNavClick, 
  activeSection, 
  isInsideApp, 
  onEnterApp, 
  onExitApp,
  isFocusModeActive,
  onToggleFocusMode
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isPlaying, togglePlay } = useMusic();

  const navLinks = isInsideApp ? [] : [
    { label: 'Beranda', id: 'home' },
    { label: 'Keunggulan', id: 'keunggulan' },
    { label: 'Roadmap', id: 'roadmap' },
    { label: 'Game Interaktif', id: 'game' },
    { label: 'Playlist Fokus', id: 'playlist' },
    { label: 'Mode Tenang', id: 'fokus' }
  ];

  const handleLinkClick = (id: string) => {
    onNavClick(id);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/20 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div id="nav-container" className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
        
        {/* Wordmark Branding Text Only */}
        <div 
          id="brand-wordmark"
          onClick={() => handleLinkClick('home')}
          className="text-3xl tracking-tight font-display text-white cursor-pointer select-none font-normal hover:opacity-90 active:scale-95 transition-all"
        >
          RukaaIjass
        </div>

        {/* Desktop Links */}
        <div id="desktop-links" className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`text-sm tracking-wide font-medium transition-colors cursor-pointer relative py-1 ${
                activeSection === link.id 
                  ? 'text-white font-semibold' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Desktop CTA using liquid-glass */}
        <div id="desktop-cta" className="hidden lg:flex items-center space-x-4">
          <button
            onClick={() => togglePlay()}
            title={isPlaying ? 'Jeda Musik Latar' : 'Nyalakan Musik Latar'}
            className={`p-2.5 rounded-full border transition-all cursor-pointer flex items-center justify-center gap-1.5 px-4 text-xs font-semibold ${
              isPlaying
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-emerald-400' : ''}`} />
            <span>{isPlaying ? 'Musik Hidup 🎵' : 'Putar Musik'}</span>
          </button>

          {onToggleFocusMode && (
            <button
              onClick={() => onToggleFocusMode(!isFocusModeActive)}
              title={isFocusModeActive ? 'Matikan Mode Fokus' : 'Aktifkan Mode Fokus'}
              className={`p-2.5 rounded-full border transition-all cursor-pointer flex items-center justify-center gap-1.5 px-4 text-xs font-semibold ${
                isFocusModeActive
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Moon className={`w-4 h-4 ${isFocusModeActive ? 'animate-pulse text-amber-400' : ''}`} />
              <span>{isFocusModeActive ? 'Fokus Aktif' : 'Mode Fokus'}</span>
            </button>
          )}

          {isInsideApp ? (
            <button
              onClick={onExitApp}
              className="bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-300 rounded-full px-6 py-2.5 text-xs font-semibold tracking-wider hover:text-white transition-all cursor-pointer flex items-center gap-2 uppercase"
            >
              Keluar Kelas
            </button>
          ) : (
            <button
              onClick={onEnterApp}
              className="liquid-glass rounded-full px-6 py-2.5 text-xs font-semibold tracking-wider text-white hover:scale-[1.03] active:scale-[98%] transition-all cursor-pointer flex items-center gap-2 uppercase font-extrabold ring-1 ring-white/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              Masuk Kelas Belajar
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div id="mobile-menu-trigger" className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-zinc-300 hover:text-white p-2 focus:outline-none transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile drawer drop-down */}
      {isOpen && (
        <div id="mobile-drawer" className="md:hidden bg-slate-950/95 border-b border-white/10 px-6 py-6 space-y-4 animate-fade-rise duration-300">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left text-base py-2 transition-colors ${
                  activeSection === link.id ? 'text-white font-semibold border-l-2 border-white pl-3' : 'text-zinc-400 pl-3'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-white/5 flex flex-col space-y-3">
              <button
                onClick={() => {
                  togglePlay();
                  setIsOpen(false);
                }}
                className={`border rounded-full w-full py-3 text-center text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  isPlaying
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 shadow-md shadow-emerald-500/5'
                    : 'bg-white/5 border-white/10 text-zinc-300'
                }`}
              >
                <Music className={`w-4 h-4 ${isPlaying ? 'text-emerald-400 animate-bounce' : ''}`} />
                {isPlaying ? 'Musik Latar: Hidup 🎵' : 'Nyalakan Musik Latar'}
              </button>

              {onToggleFocusMode && (
                <button
                  onClick={() => {
                    onToggleFocusMode(!isFocusModeActive);
                    setIsOpen(false);
                  }}
                  className={`border rounded-full w-full py-3 text-center text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    isFocusModeActive
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-white/5 border-white/10 text-zinc-300'
                  }`}
                >
                  <Moon className={`w-4 h-4 ${isFocusModeActive ? 'text-amber-400 animate-pulse' : ''}`} />
                  {isFocusModeActive ? 'Mode Fokus: Aktif' : 'Aktifkan Mode Fokus'}
                </button>
              )}

              {isInsideApp ? (
                <button
                  onClick={() => { onExitApp?.(); setIsOpen(false); }}
                  className="bg-white/5 border border-white/10 rounded-full w-full py-3 text-center text-sm font-medium tracking-wide text-zinc-300"
                >
                  Keluar Kelas
                </button>
              ) : (
                <button
                  onClick={() => { onEnterApp?.(); setIsOpen(false); }}
                  className="liquid-glass rounded-full w-full py-3 text-center text-sm font-bold tracking-wide text-white transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  Masuk Kelas Belajar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
