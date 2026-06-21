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
import { Volume2, Sparkles, BookOpen, Smile, ShieldAlert, Flame } from 'lucide-react';
import { MusicProvider } from './contexts/MusicContext';
import GlobalFloatingPlayer from './components/GlobalFloatingPlayer';
import { motion, AnimatePresence } from 'motion/react';

export function MainApp() {
  const [activeSection, setActiveSection] = useState('home');
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [welcomeTip, setWelcomeTip] = useState(true);
  const [isInsideApp, setIsInsideApp] = useState(false);
  const [showAbsenceWarning, setShowAbsenceWarning] = useState(false);

  useEffect(() => {
    // Force a one-time clean reset of absolute stats to reset state for existing users as a clean "murid baru"
    if (!localStorage.getItem('ruka_force_reset_v3')) {
      localStorage.clear();
      localStorage.setItem('ruka_force_reset_v3', 'true');
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    try {
      const lastActiveDate = localStorage.getItem('n4_streak_last_active_date');
      const savedOnboarding = localStorage.getItem('ruka_onboarding');
      if (lastActiveDate && savedOnboarding) {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        if (lastActiveDate !== todayStr) {
          const lastDateParts = lastActiveDate.split('-');
          const lastDate = new Date(
            parseInt(lastDateParts[0], 10),
            parseInt(lastDateParts[1], 10) - 1,
            parseInt(lastDateParts[2], 10)
          );
          
          today.setHours(0, 0, 0, 0);
          lastDate.setHours(0, 0, 0, 0);
          
          const diffTime = today.getTime() - lastDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays >= 1) {
            setShowAbsenceWarning(true);
          }
        }
      }
    } catch (e) {}
  }, []);

  // Handle validating onboarding completion before entering the app
  const handleEnterApp = () => {
    try {
      const saved = localStorage.getItem('ruka_onboarding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completed) {
          setIsInsideApp(true);
          return;
        }
      }
    } catch (e) {}
    
    // Smooth scroll down to the Onboarding form
    const onboardingEl = document.getElementById('onboarding');
    if (onboardingEl) {
      onboardingEl.scrollIntoView({ behavior: 'smooth' });
      // Dispatch a custom event to highlight or focus on the name field
      window.dispatchEvent(new Event('ruka_onboarding_scroll_highlight'));
    }
  };

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
        
        {/* Absence streak precaution warning banner */}
        {showAbsenceWarning && !isInsideApp && (
          <div id="absence-streak-alert" className="bg-gradient-to-r from-red-500/25 via-amber-500/15 to-transparent backdrop-blur-md border-b border-red-500/30 py-4 px-6 relative z-25 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-rise select-none shadow-lg shadow-red-500/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/20 text-red-500 rounded-xl shrink-0 animate-pulse">
                <Flame className="w-5.5 h-5.5" />
              </div>
              <div className="text-left space-y-0.5">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-red-400">AMANKAN STREAK HARIAN</span>
                <p className="text-xs sm:text-sm text-zinc-100 font-medium">
                  <strong>⚠️ Peringatan Streak Kehadiran:</strong> Anda terdeteksi belum belajar sejak kunjungan terakhir! Segera masuk ke dalam kelas sekarang untuk mengunci streak harian Anda agar tidak padam!
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
              <button 
                onClick={() => {
                  setShowAbsenceWarning(false);
                  handleEnterApp();
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-450 hover:to-amber-450 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer hover:scale-103 shadow-md shadow-red-500/10 shrink-0 text-center"
              >
                Kunci Streak Sekarang ⚡
              </button>
              <button 
                onClick={() => setShowAbsenceWarning(false)}
                className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
              >
                Abaikan
              </button>
            </div>
          </div>
        )}

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
          onEnterApp={handleEnterApp}
          onExitApp={() => setIsInsideApp(false)}
          isFocusModeActive={isFocusModeActive}
          onToggleFocusMode={setIsFocusModeActive}
        />

        <AnimatePresence mode="wait">
          {isInsideApp ? (
            <motion.div
              key="classroom-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full flex-grow flex flex-col"
            >
              <Classroom 
                onBackToLanding={() => setIsInsideApp(false)} 
                isFocusModeActive={isFocusModeActive} 
                onToggleFocusMode={setIsFocusModeActive}
              />
            </motion.div>
          ) : (
            <motion.div
              key="landing-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex-grow flex flex-col"
            >
              {/* Home/Hero Section */}
              <div id="home">
                <Hero 
                  onStartClick={() => handleNavClick('roadmap')} 
                  onExplorationClick={() => handleNavClick('keunggulan')} 
                  onEnterApp={handleEnterApp}
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
                <CTASection onOnboardingComplete={() => setIsInsideApp(true)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global sticky media player hub */}
        <GlobalFloatingPlayer />

      </div>
    </div>
  );
}

export default function App() {
  return (
    <MusicProvider>
      <MainApp />
    </MusicProvider>
  );
}
