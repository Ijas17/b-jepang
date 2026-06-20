/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Roadmap from './components/Roadmap';
import Games from './components/Games';
import Playlist from './components/Playlist';
import FocusSection from './components/FocusSection';
import CTASection from './components/CTASection';
import Classroom from './components/Classroom';
import { Volume2, Sparkles, BookOpen, Smile, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [welcomeTip, setWelcomeTip] = useState(true);
  const [isInsideApp, setIsInsideApp] = useState(false);

  // Smooth scroll handler which aligns perfectly with modern multi-view SPAs
  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Observer to track which section is currently visible to update navbar highlights dynamically
  useEffect(() => {
    const sections = ['home', 'keunggulan', 'roadmap', 'game', 'playlist', 'fokus', 'onboarding'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const offsetTop = el.offsetTop;
          const offsetHeight = el.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen text-white select-none transition-all duration-700">
      
      {/* 1. Fullscreen Looping Background Video from cloudinary specified by the user */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://res.cloudinary.com/dxtoxj9vp/video/upload/v1781888548/shiroko-sunset-city-blue-archive-moewalls-com_nnvxxp.mp4"
        />
        {/* Soft atmospheric dim overlay based on focus-mode state */}
        <div 
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            isFocusModeActive 
              ? 'bg-slate-950/85 backdrop-blur-xs' 
              : 'bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-slate-950/50'
          }`}
        />
      </div>

      {/* 2. Primary layout contents (layered relative on z-10) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Welcome tip / banner overlay */}
        {welcomeTip && (
          <div id="welcome-banner" className="bg-white/10 backdrop-blur-md border-b border-white/5 py-3.5 px-6 text-center relative z-20 flex items-center justify-center gap-3 animate-fade-rise text-zinc-200 text-xs sm:text-sm font-light select-none">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
              Selamat Datang di <strong>RukaaIjass</strong> — Mulai belajar bahasa Jepang dengan kurikulum Minna no Nihongo hari ini!
            </span>
            <button 
              onClick={() => setWelcomeTip(false)}
              className="ml-3 font-semibold uppercase tracking-wider text-[11px] bg-white/15 px-3 py-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Navbar */}
        <Navbar 
          onNavClick={handleNavClick} 
          activeSection={activeSection} 
          isInsideApp={isInsideApp}
          onEnterApp={() => setIsInsideApp(true)}
          onExitApp={() => setIsInsideApp(false)}
        />

        {isInsideApp ? (
          <Classroom 
            onBackToLanding={() => setIsInsideApp(false)} 
            isFocusModeActive={isFocusModeActive} 
          />
        ) : (
          <>
            {/* Home/Hero Section */}
            <div id="home">
              <Hero 
                onStartClick={() => handleNavClick('roadmap')} 
                onExplorationClick={() => handleNavClick('keunggulan')} 
                onEnterApp={() => setIsInsideApp(true)}
              />
            </div>

            {/* Section Features / Keunggulan Utama */}
            <div id="keunggulan">
              <Features />
            </div>

            {/* Section Roadmap 8 Fase */}
            <div id="roadmap">
              <Roadmap />
            </div>

            {/* Section Game Edukasi Interaktif */}
            <div id="game">
              <Games />
            </div>

            {/* Section Playlist Audio Pendukung */}
            <div id="playlist">
              <Playlist />
            </div>

            {/* Section Suasana Belajar / Mode Fokus */}
            <div id="fokus">
              <FocusSection 
                isFocusModeActive={isFocusModeActive} 
                onToggleFocusMode={setIsFocusModeActive} 
              />
            </div>

            {/* Section Onboarding / Peta Rencana Belajar personal */}
            <div id="onboarding">
              <CTASection />
            </div>
          </>
        )}

      </div>
    </div>
  );
}
