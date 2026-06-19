/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Globe, Sparkles } from 'lucide-react';

interface NavbarProps {
  onNavClick: (sectionId: string) => void;
  activeSection: string;
}

export default function Navbar({ onNavClick, activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', id: 'home' },
    { label: 'Keunggulan', id: 'keunggulan' },
    { label: 'Roadmap', id: 'roadmap' },
    { label: 'Materi', id: 'materi' },
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
            onClick={() => handleLinkClick('roadmap')}
            className="liquid-glass rounded-full px-6 py-2.5 text-xs font-semibold tracking-wider text-white hover:scale-[1.03] active:scale-[98%] transition-all cursor-pointer flex items-center gap-2 uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            Mulai Belajar
          </button>
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
                onClick={() => handleLinkClick('roadmap')}
                className="liquid-glass rounded-full w-full py-3 text-center text-sm font-medium tracking-wide text-white transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                Mulai dari Nol
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
