/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Volume2, BookOpen, Award, Smile, Gamepad2, Check, ChevronRight, 
  Sparkles, RotateCcw, ArrowLeft, Clock, Brain, AlertTriangle, ShieldCheck, Trophy, Globe, Flame, Lock, HelpCircle,
  Search, Languages, LayoutDashboard, Plus, Minus
} from 'lucide-react';
import { UNGKAPAN_KELAS_SALAM, VOCABULARY_DATA, PARTICLE_QUESTIONS, SENTENCE_PUZZLES } from '../data';
import { ALL_LESSONS } from '../data/lessonsData';
import { VOCABULARY_DATABASE } from '../data/vocabulary';
import { KANA_DATA } from '../data/kana';
import { lessons } from '../data/curriculum';
import KanaTrainer from './KanaTrainer';
import KanjiLibrary from './KanjiLibrary';
import DailyPlanner from './DailyPlanner';

interface ClassroomProps {
  onBackToLanding: () => void;
  isFocusModeActive: boolean;
}

export default function Classroom({ onBackToLanding, isFocusModeActive }: ClassroomProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kanatrainer' | 'kana' | 'kanji' | 'materi' | 'vocab' | 'quiz' | 'game' | 'tips'>('dashboard');
  const [kanaType, setKanaType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [kanaSubTab, setKanaSubTab] = useState<'dasar' | 'varian' | 'kombinasi'>('dasar');

  // Vocabulary Tab State
  const [vocabSearchQuery, setVocabSearchQuery] = useState('');
  const [vocabJlptFilter, setVocabJlptFilter] = useState<'All' | 'N5' | 'N4'>('All');
  const [vocabBabFilter, setVocabBabFilter] = useState<number | 'All'>('All');
  const [vocabTypeFilter, setVocabTypeFilter] = useState<string>('All');

  // Interactive Game Leveling State
  const [gameDifficulty, setGameDifficulty] = useState<number>(1); // Level 1 to 4
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [showResult, setShowResult] = useState<boolean>(false);

  // Lesson states
  const [selectedLesson, setSelectedLesson] = useState<number>(1);
  const [activeSectionUnderLesson, setActiveSectionUnderLesson] = useState<'kosakata' | 'tata' | 'dialog' | 'latihan' | 'kuis' | 'review'>('kosakata');
  const [streakCount, setStreakCount] = useState<number>(12);

  // State for User Progress Store
  const [userXP, setUserXP] = useState<number>(() => {
    const saved = localStorage.getItem('n4_user_xp');
    return saved ? parseInt(saved, 10) : 180; // starts with 180 XP
  });
  const [userLevel, setUserLevel] = useState<number>(() => {
    const saved = localStorage.getItem('n4_user_level');
    return saved ? parseInt(saved, 10) : 1; // starts with level 1
  });
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('n4_user_badges');
    return saved ? JSON.parse(saved) : ["Selamat Datang 🌸"]; // first starter badge
  });

  const addXP = (amount: number) => {
    setUserXP(prevXP => {
      const newXP = prevXP + amount;
      localStorage.setItem('n4_user_xp', newXP.toString());
      
      const newLevel = Math.floor(newXP / 200) + 1;
      if (newLevel > userLevel) {
        setUserLevel(newLevel);
        localStorage.setItem('n4_user_level', newLevel.toString());
        triggerTick(1200);
        setTimeout(() => triggerTick(1500), 150);
      }
      return newXP;
    });
  };

  const unlockBadge = (badgeName: string) => {
    setUnlockedBadges(prev => {
      if (prev.includes(badgeName)) return prev;
      const updated = [...prev, badgeName];
      localStorage.setItem('n4_user_badges', JSON.stringify(updated));
      triggerTick(1600);
      return updated;
    });
  };

  useEffect(() => {
    if (streakCount >= 13) {
      unlockBadge('Streak Pemula 🔥');
    }
  }, [streakCount]);

  // Dashboard / Lesson Completion States
  const [lessonCompletion, setLessonCompletion] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    for (let i = 1; i <= 25; i++) {
      if (i === 1) initial[i] = 100;
      else if (i === 2) initial[i] = 100;
      else if (i === 3) initial[i] = 80;
      else if (i === 4) initial[i] = 40;
      else if (i === 5) initial[i] = 20;
      else initial[i] = 0;
    }
    return initial;
  });

  const [weeklyAttendance, setWeeklyAttendance] = useState<Record<string, boolean>>({
    'Senin': true,
    'Selasa': true,
    'Rabu': true,
    'Kamis': true,
    'Jumat': false,
    'Sabtu': false,
    'Minggu': false,
  });

  // Lesson sub-interactive states
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<string>('');
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string>>({});
  const [drillChecked, setDrillChecked] = useState<Record<string, boolean>>({});
  const [activeLatihanAnswers, setActiveLatihanAnswers] = useState<Record<string, string>>({});
  const [activeLatihanSubmitted, setActiveLatihanSubmitted] = useState<Record<string, boolean>>({});

  // ==========================================
  // QUIZ ENGINE PRO STATE (LEVEL SYSTEM & DIFFICULTY PROGRESSION)
  // ==========================================
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [quizMode, setQuizMode] = useState<'standard' | 'survival'>('standard');
  const [quizJlptFilter, setQuizJlptFilter] = useState<'All' | 'N5' | 'N4'>('All');
  const [quizBabFilterRange, setQuizBabFilterRange] = useState<string>('All'); // 'All', '1-5', '6-10', '11-15', '16-20', '21-25'
  
  const [quizQuestionsList, setQuizQuestionsList] = useState<Array<{
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    lessonId: number;
    judulBab: string;
    jlpt: string;
  }>>([]);
  const [quizCurrentIndex, setQuizCurrentIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);
  const [quizHearts, setQuizHearts] = useState<number>(3);
  const [quizDifficultyLevel, setQuizDifficultyLevel] = useState<number>(1); // Mastery Level 1 to 5
  
  const [quizTimeLeft, setQuizTimeLeft] = useState<number>(25);
  const [quizMaxTime, setQuizMaxTime] = useState<number>(25);
  const [quizSubmittedState, setQuizSubmittedState] = useState<boolean>(false);
  const [quizUserAnswer, setQuizUserAnswer] = useState<string>('');
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | 'timeout' | null>(null);
  const [showQuizSummary, setShowQuizSummary] = useState<boolean>(false);
  const [quizRoundHistory, setQuizRoundHistory] = useState<Array<{
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    selectedOption: string;
    isCorrect: boolean;
    judulBab: string;
    lessonId: number;
  }>>([]);

  const startQuizEngine = (overrideJlpt?: 'All' | 'N5' | 'N4', overrideBabRange?: string) => {
    triggerTick(880);
    const allAvailable = lessons.flatMap(lesson => {
      const isN4 = lesson.id > 12;
      const jlpt = isN4 ? 'N4' : 'N5';
      return (lesson.quiz || []).map(q => ({
        ...q,
        lessonId: lesson.id,
        judulBab: lesson.judul,
        jlpt
      }));
    });

    const jlptFilterToUse = overrideJlpt !== undefined ? overrideJlpt : quizJlptFilter;
    const babRangeToUse = overrideBabRange !== undefined ? overrideBabRange : quizBabFilterRange;

    let filtered = allAvailable;
    if (jlptFilterToUse !== 'All') {
      filtered = filtered.filter(q => q.jlpt === jlptFilterToUse);
    }
    if (babRangeToUse !== 'All') {
      const [start, end] = babRangeToUse.split('-').map(Number);
      filtered = filtered.filter(q => q.lessonId >= start && q.lessonId <= end);
    }

    if (filtered.length === 0) {
      filtered = allAvailable;
    }

    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const sessionQuestions = quizMode === 'standard' ? shuffled.slice(0, 10) : shuffled;

    setQuizQuestionsList(sessionQuestions);
    setQuizCurrentIndex(0);
    setQuizScore(0);
    setQuizStreak(0);
    setQuizHearts(3);
    setQuizDifficultyLevel(1);
    
    setQuizMaxTime(25);
    setQuizTimeLeft(25);
    
    setQuizSubmittedState(false);
    setQuizUserAnswer('');
    setQuizFeedback(null);
    setShowQuizSummary(false);
    setQuizRoundHistory([]);
    setQuizActive(true);
  };

  const handleQuizAnswer = (option: string) => {
    if (quizSubmittedState) return;

    setQuizSubmittedState(true);
    setQuizUserAnswer(option);

    const currentQuestion = quizQuestionsList[quizCurrentIndex];
    const isCorrect = option === currentQuestion.answer;

    setQuizRoundHistory(prev => [
      ...prev,
      {
        question: currentQuestion.question,
        options: currentQuestion.options,
        answer: currentQuestion.answer,
        explanation: currentQuestion.explanation,
        selectedOption: option,
        isCorrect,
        judulBab: currentQuestion.judulBab,
        lessonId: currentQuestion.lessonId
      }
    ]);

    if (isCorrect) {
      triggerTick(880);
      setQuizFeedback('correct');

      const basePoints = quizDifficultyLevel * 10;
      const speedBonus = Math.floor(quizTimeLeft * 1.5) * quizDifficultyLevel;
      const earnedPoints = basePoints + speedBonus;
      setQuizScore(prev => prev + earnedPoints);

      const newStreak = quizStreak + 1;
      setQuizStreak(newStreak);

      if (newStreak > 0 && newStreak % 3 === 0) {
        const nextLevel = Math.min(quizDifficultyLevel + 1, 5);
        if (nextLevel > quizDifficultyLevel) {
          setQuizDifficultyLevel(nextLevel);
        }
      }
    } else {
      triggerTick(150);
      setQuizFeedback('incorrect');
      setQuizStreak(0);

      if (quizMode === 'survival') {
        const nextHearts = quizHearts - 1;
        setQuizHearts(nextHearts);
        if (nextHearts <= 0) {
          setTimeout(() => {
            setQuizActive(false);
            setShowQuizSummary(true);
          }, 1500);
        }
      }
    }
  };

  const handleQuizTimeout = () => {
    if (quizSubmittedState) return;

    setQuizSubmittedState(true);
    setQuizUserAnswer('');
    setQuizFeedback('timeout');
    setQuizStreak(0);

    const currentQuestion = quizQuestionsList[quizCurrentIndex];

    setQuizRoundHistory(prev => [
      ...prev,
      {
        question: currentQuestion.question,
        options: currentQuestion.options,
        answer: currentQuestion.answer,
        explanation: currentQuestion.explanation,
        selectedOption: 'WAKTU HABIS (TIMEOUT)',
        isCorrect: false,
        judulBab: currentQuestion.judulBab,
        lessonId: currentQuestion.lessonId
      }
    ]);

    triggerTick(150);

    if (quizMode === 'survival') {
      const nextHearts = quizHearts - 1;
      setQuizHearts(nextHearts);
      if (nextHearts <= 0) {
        setTimeout(() => {
          setQuizActive(false);
          setShowQuizSummary(true);
        }, 1500);
      }
    }
  };

  const handleNextQuizQuestion = () => {
    triggerTick(440);
    const isSessionEnded = quizCurrentIndex + 1 >= quizQuestionsList.length;

    if (isSessionEnded) {
      setQuizActive(false);
      setShowQuizSummary(true);
    } else {
      const nextIndex = quizCurrentIndex + 1;
      setQuizCurrentIndex(nextIndex);
      setQuizSubmittedState(false);
      setQuizUserAnswer('');
      setQuizFeedback(null);

      let newMaxTime = 25;
      if (quizDifficultyLevel === 2) newMaxTime = 18;
      else if (quizDifficultyLevel === 3) newMaxTime = 12;
      else if (quizDifficultyLevel === 4) newMaxTime = 8;
      else if (quizDifficultyLevel === 5) newMaxTime = 5;

      setQuizMaxTime(newMaxTime);
      setQuizTimeLeft(newMaxTime);
    }
  };

  useEffect(() => {
    if (!quizActive || quizSubmittedState || showQuizSummary) return;

    const interval = setInterval(() => {
      setQuizTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleQuizTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizActive, quizSubmittedState, showQuizSummary, quizCurrentIndex, quizDifficultyLevel]);

  // Word category filtering helper for vocabulary explorer
  const filteredVocabList = VOCABULARY_DATABASE.filter(word => {
    const lowerQuery = vocabSearchQuery.toLowerCase().trim();
    const queryMatch = !lowerQuery || 
      word.jp.toLowerCase().includes(lowerQuery) ||
      word.rom.toLowerCase().includes(lowerQuery) ||
      word.translation.toLowerCase().includes(lowerQuery) ||
      word.type.toLowerCase().includes(lowerQuery) ||
      word.desc.toLowerCase().includes(lowerQuery);

    const jlptMatch = vocabJlptFilter === 'All' || word.jlpt === vocabJlptFilter;
    const babMatch = vocabBabFilter === 'All' || word.bab === vocabBabFilter;
    
    let typeMatch = true;
    if (vocabTypeFilter !== 'All') {
      const f = vocabTypeFilter;
      if (f === 'Benda') typeMatch = word.type.includes('Benda');
      else if (f === 'Kerja') typeMatch = word.type.includes('Kerja');
      else if (f === 'Sifat') typeMatch = word.type.includes('Sifat');
      else if (f === 'Keterangan') typeMatch = word.type.includes('Keterangan') || word.type.includes('Akhiran');
      else if (f === 'Ganti') typeMatch = word.type.includes('Ganti');
      else if (f === 'Ungkapan') typeMatch = word.type.includes('Ungkapan') || word.type.includes('Partikel') || word.type.includes('Konjungsi');
    }

    return queryMatch && jlptMatch && babMatch && typeMatch;
  });

  // Custom audio synthesizer tick for realistic spoken sounds of Kana
  const playKanaSound = (character: string, romaji: string) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      // Determine frequency based on character romaji to simulate different pitches/vowels
      let baseFreq = 220; // default A3
      if (romaji.includes('a')) baseFreq = 261.63; // C4
      else if (romaji.includes('i')) baseFreq = 329.63; // E4
      else if (romaji.includes('u')) baseFreq = 392.00; // G4
      else if (romaji.includes('e')) baseFreq = 440.00; // A4
      else if (romaji.includes('o')) baseFreq = 523.25; // C5
      
      if (romaji.startsWith('k')) baseFreq *= 1.1;
      else if (romaji.startsWith('s')) baseFreq *= 1.25;
      else if (romaji.startsWith('t')) baseFreq *= 1.35;
      else if (romaji.startsWith('n')) baseFreq *= 0.95;
      else if (romaji.startsWith('h')) baseFreq *= 1.15;
      else if (romaji.startsWith('m')) baseFreq *= 0.85;
      else if (romaji.startsWith('g')) baseFreq *= 0.75;
      else if (romaji.startsWith('p')) baseFreq *= 1.5;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // ignore
    }
  };

  // Sound feedback tick
  const triggerTick = (freq = 440) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // Ignore
    }
  };

  // Handle Speech synthesis of Japanese characters / words / sentences
  const speakText = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ja-JP';
        utter.rate = 0.8;
        window.speechSynthesis.speak(utter);
        unlockBadge('Master Pelafalan 🗣️');
      }
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
    triggerTick(600);
  };

  // ==========================================
  // PROGRESSIVE TIMED GAME STATE (LEVELING!)
  // ==========================================
  const [currentQuestion, setCurrentQuestion] = useState<{ char: string, correct: string, options: string[] }>({ char: 'あ', correct: 'a', options: [] });
  
  const generateLevelQuestion = () => {
    // Select question pool based on difficulty level
    let pool = KANA_DATA.hiragana.dasar;
    if (gameDifficulty === 2) {
      pool = [...KANA_DATA.hiragana.dasar, ...KANA_DATA.hiragana.varian];
    } else if (gameDifficulty === 3) {
      pool = [...KANA_DATA.hiragana.varian, ...KANA_DATA.hiragana.kombinasi];
    } else if (gameDifficulty === 4) {
      pool = [...KANA_DATA.katakana.dasar, ...KANA_DATA.katakana.kombinasi];
    }

    // Filter valid chars
    const cleanPool = pool.filter(k => k.char !== '—' && k.rom !== '');
    if (cleanPool.length === 0) return;

    const target = cleanPool[Math.floor(Math.random() * cleanPool.length)];
    
    // Get 3 random unique incorrect alternatives
    const wrongPool = cleanPool.filter(k => k.rom !== target.rom);
    const wrongSelected = [...wrongPool].sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [...wrongSelected.map(w => w.rom), target.rom].sort(() => 0.5 - Math.random());

    setCurrentQuestion({
      char: target.char,
      correct: target.rom,
      options: combined
    });
  };

  // Timer loop for progressive speed
  useEffect(() => {
    let interval: any;
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000 / speedMultiplier); // Faster countdown if multiplier is high!
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setShowResult(true);
      triggerTick(220);
    }
    return () => clearInterval(interval);
  }, [gameActive, timeLeft, speedMultiplier]);

  const startGameWithLevel = (level: number) => {
    triggerTick(523.25);
    setGameDifficulty(level);
    
    // Difficulty configuration
    // Level 1: easy, multiplier 1.0, 45 seconds
    // Level 2: medium, multiplier 1.4, 30 seconds
    // Level 3: hard, multiplier 2.0, 20 seconds
    // Level 4: autis/insane speed blitz, multiplier 3.0, 12 seconds
    const speed = level === 1 ? 1.0 : level === 2 ? 1.4 : level === 3 ? 2.0 : 3.0;
    const initialTime = level === 1 ? 45 : level === 2 ? 30 : level === 3 ? 20 : 12;

    setSpeedMultiplier(speed);
    setTimeLeft(initialTime);
    setGameScore(0);
    setGameActive(true);
    setShowResult(false);
    
    // generate first question
    setTimeout(() => {
      generateLevelQuestion();
    }, 50);
  };

  const handleLevelAnswer = (answeredRom: string) => {
    if (answeredRom === currentQuestion.correct) {
      triggerTick(880); // cheerful ping
      // Multiply score based on level
      setGameScore(prev => prev + (10 * gameDifficulty));
      generateLevelQuestion();
    } else {
      triggerTick(150); // buzz
      // subtract time on harder difficulties
      if (gameDifficulty > 1) {
        setTimeLeft(prev => Math.max(0, prev - 2));
      }
      generateLevelQuestion();
    }
  };

  // Clean elements helper
  const renderSubTabButton = (tabId: 'dasar' | 'varian' | 'kombinasi', label: string) => (
    <button
      onClick={() => { triggerTick(330); setKanaSubTab(tabId); }}
      className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all uppercase cursor-pointer ${
        kanaSubTab === tabId 
          ? 'bg-white text-slate-950 font-bold' 
          : 'bg-white/5 text-zinc-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div id="classroom-main-view" className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      
      {/* Top Header Controls with User Info and App Back Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => { triggerTick(220); onBackToLanding(); }}
            className="p-3.5 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer bg-white/5 border border-white/5 active:scale-95 flex items-center justify-center"
            title="Kembali ke Landing Page"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              RUANG BELAJAR AKTIF
            </span>
            <h1 className="text-2xl sm:text-3xl font-display text-white select-none leading-none">
              Aplikasi Kelas RukaaIjass
            </h1>
          </div>
        </div>

        {/* User stats widget (streak reward motivation) */}
        <div className="flex items-center gap-3 bg-white/3 p-3 rounded-2xl border border-white/5 self-start sm:self-center">
          <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
          <div className="text-left">
            <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Streak Harian</span>
            <span className="text-xs text-white font-mono font-bold">{streakCount} Hari Berturut</span>
          </div>
        </div>

      </div>

      {/* Classroom Segmentation Navigation Panels */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-3 mb-8">
        {[
          { id: 'dashboard', label: 'Dashboard Kelas Pro', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'kanatrainer', label: 'Kana Trainer Pro', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
          { id: 'kana', label: 'Tabel Kana Lengkap', icon: <Globe className="w-4 h-4" /> },
          { id: 'kanji', label: 'Perpustakaan Kanji', icon: <Brain className="w-4 h-4 text-sky-450 animate-pulse" /> },
          { id: 'materi', label: 'Materi Komplit & Detail', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'vocab', label: 'Kamus Kosakata N5-N4', icon: <Languages className="w-4 h-4" /> },
          { id: 'quiz', label: 'Quiz Engine Pro', icon: <Award className="w-4 h-4" /> },
          { id: 'game', label: 'Tantangan Game Pro', icon: <Gamepad2 className="w-4 h-4" /> },
          { id: 'tips', label: 'Panduan Guru Profesional', icon: <Smile className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { triggerTick(440); setActiveTab(tab.id as any); }}
            className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-white text-slate-950 font-extrabold border-white scale-[1.01] shadow-lg ring-2 ring-white/10' 
                : 'bg-white/2 hover:bg-white/5 border-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* MODULE 0: DASHBOARD KELAS PRO & COMPLETION PERCENTAGE */}
      {/* ======================================================== */}
      {activeTab === 'dashboard' && (() => {
        // Calculate average completion rate dynamically across all 25 lessons
        let totalCompletionVal = 0;
        for (let i = 1; i <= 25; i++) {
          totalCompletionVal += (lessonCompletion[i] || 0);
        }
        const averageCompletion = Math.round(totalCompletionVal / 25);
        
        // Define standard circular calculations
        const radius = 60;
        const circumference = 2 * Math.PI * radius; // ~376.99
        let strokeDashoffset = circumference - (circumference * averageCompletion) / 100;
        if (isNaN(strokeDashoffset)) strokeDashoffset = circumference;

        // Dynamic study status classification
        let studyLevelBadge = "N5 Shoshinsha (Pemula Dasar)";
        let levelColor = "text-rose-450 bg-rose-500/10 border-rose-500/15";
        
        if (averageCompletion >= 90) {
          studyLevelBadge = "Industrial Nihongo Master! 💎";
          levelColor = "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
        } else if (averageCompletion >= 70) {
          studyLevelBadge = "N4 Jōkyū (Pemula Ahli N4)";
          levelColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/15";
        } else if (averageCompletion >= 45) {
          studyLevelBadge = "N4 Chuu-kyuu (Pemula Menengah)";
          levelColor = "text-indigo-400 bg-indigo-500/10 border-indigo-500/15";
        } else if (averageCompletion >= 20) {
          studyLevelBadge = "N5 Chuu-kyuu (Pemula Dasar Tahap 2)";
          levelColor = "text-amber-400 bg-amber-400/10 border-amber-400/15";
        }

        const handleToggleAttendance = (day: string) => {
          const isAttended = weeklyAttendance[day];
          triggerTick(isAttended ? 220 : 880);
          setWeeklyAttendance(prev => ({ ...prev, [day]: !isAttended }));
          setStreakCount(prev => isAttended ? Math.max(0, prev - 1) : prev + 1);
        };

        const handleAdjustCompletion = (lessonId: number, val: number) => {
          triggerTick(580);
          setLessonCompletion(prev => ({
            ...prev,
            [lessonId]: Math.max(0, Math.min(100, val))
          }));
        };

        const handlePresetCompletion = (lessonId: number, preset: 'zero' | 'half' | 'full') => {
          triggerTick(880);
          const percent = preset === 'zero' ? 0 : preset === 'half' ? 50 : 100;
          setLessonCompletion(prev => ({
            ...prev,
            [lessonId]: percent
          }));
        };

        return (
          <div id="classroom-dashboard-module" className="animate-fade-rise space-y-8">
            {/* Top overview statistics bento grid banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              
              {/* Box 1: Beautiful Glowing Circle Progress Indicator */}
              <div className="liquid-glass rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center text-center">
                
                {/* SVG Progress Circle SVG */}
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="64" 
                      cy="64" 
                      r="50" 
                      className="stroke-white/5 fill-none" 
                      strokeWidth="8" 
                    />
                    <circle 
                      cx="64" 
                      cy="64" 
                      r="50" 
                      className="stroke-indigo-500 transition-all duration-1000 ease-out fill-none" 
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={(2 * Math.PI * 50) - ((2 * Math.PI * 50) * averageCompletion) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Absolute Center percentage display text */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-mono font-black text-white">{averageCompletion}%</span>
                    <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold">Rerata Bab</span>
                  </div>
                </div>

                {/* Meta details adjacent */}
                <div className="space-y-2 text-center w-full">
                  <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-zinc-500 block">Status Akademik</span>
                  <h3 className="text-base font-display text-white font-normal">Pemantau Kurikulum 25 Bab</h3>
                  
                  {/* Dynamic Class level label status */}
                  <div className={`px-2.5 py-1 rounded-xl border text-[10px] font-sans font-medium ${levelColor} inline-block leading-tight`}>
                    🛡️ {studyLevelBadge}
                  </div>
                </div>

              </div>

              {/* Box 2: User Progress Store (XP Status & Badges Collection) */}
              <div className="liquid-glass rounded-3xl p-6 border border-white/5 space-y-4 flex flex-col justify-between text-left">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-zinc-500 block">Level Kompetensi & XP</span>
                  <h3 className="text-base font-display text-white font-normal flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-yellow-400 animate-pulse" /> Level {userLevel} Gakusei
                  </h3>
                </div>

                {/* XP Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                    <span>Pengalaman (XP)</span>
                    <span>{userXP % 200} / 200 XP</span>
                  </div>
                  <div className="w-full bg-slate-950/80 h-2 rounded-full overflow-hidden border border-white/5 relative">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-indigo-500 transition-all duration-500" 
                      style={{ width: `${((userXP % 200) / 200) * 100}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-zinc-500 font-light block leading-relaxed">
                    Total <strong>{userXP} XP</strong> terakumulasi. Selesaikan kuiz, canvas kanji & target Planner untuk menaikkan level!
                  </span>
                </div>

                {/* Badges list */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-zinc-500 block">Lencana Tercapai ({unlockedBadges.length})</span>
                  <div className="flex flex-wrap gap-1 max-h-[75px] overflow-y-auto pr-1">
                    {unlockedBadges.map((badge, idx) => (
                      <span 
                        key={idx}
                        className="text-[9px] px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-400/15 text-indigo-300 font-bold flex items-center gap-0.5"
                      >
                        ⭐ {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Box 3: Gorgeous Streak & Weekly Attendance Calendar */}
              <div className="liquid-glass rounded-3xl p-6 border border-white/5 space-y-4 flex flex-col justify-between">
                
                <div className="flex justify-between items-start gap-2">
                  <div className="text-left space-y-1">
                    <h3 className="text-base font-display text-white font-normal flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-500 animate-bounce" /> Streak Kehadiran
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-light font-sans leading-normal">
                      Konsistensi belajar harian. Centang kotak kehadiran sebagai komitmen belajar.
                    </p>
                  </div>

                  {/* Gigantic Fire Counter */}
                  <div className="bg-amber-550/10 border border-amber-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0">
                    <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                    <div className="text-left font-mono">
                      <span className="text-[8px] text-zinc-500 uppercase block">Streak</span>
                      <span className="text-sm font-black text-amber-450 leading-none">{streakCount} H</span>
                    </div>
                  </div>
                </div>

                {/* Calendar grid for attendance */}
                <div className="grid grid-cols-7 gap-1">
                  {Object.entries(weeklyAttendance).map(([day, checked]) => (
                    <button
                      key={day}
                      onClick={() => handleToggleAttendance(day)}
                      className={`p-2.5 rounded-xl border transition-all duration-300 relative overflow-hidden group cursor-pointer flex flex-col items-center justify-between gap-1.5 ${
                        checked 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                          : 'bg-white/2 hover:bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="text-[8px] font-semibold tracking-wider uppercase font-sans">{day.slice(0, 3)}</span>
                      
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        checked 
                          ? 'bg-amber-500 border-amber-400 text-slate-950 scale-105' 
                          : 'bg-slate-950/45 border-white/10 text-transparent group-hover:border-white/20'
                      }`}>
                        <Check className="w-3 stroke-[3]" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Motivational Footnote */}
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-light leading-snug">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Tips Belajar: Konsistensi 15 menit sehari jauh lebih efektif!</span>
                </div>

              </div>

            </div>

            {/* PERSONALIZED DAILY PLANNER SECTION */}
            <div className="liquid-glass rounded-3xl p-6 border border-white/5">
              <DailyPlanner 
                lessonCompletion={lessonCompletion}
                onAddXP={addXP}
                onUnlockBadge={unlockBadge}
                onTriggerSound={triggerTick}
              />
            </div>

            {/* SECTION 2: THE 25 LESSONS DETAILED COMPLETION TRACKER GRID */}
            <div className="space-y-4">
              
              {/* Section titles */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-left">
                  <h3 className="text-xl font-display text-white font-normal flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-indigo-400" /> Pengawasan Bab Kurikulum (25 Bab Lengkap)
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans font-light">
                    Selesaikan materi tata bahasa, kosakata, kuis evaluasi, dan praktik dialog terjemahan industri Jepang di tiap bab.
                  </p>
                </div>
                
                {/* Global mass controls helper */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      triggerTick(880);
                      const full: Record<number, number> = {};
                      for(let i=1; i<=25; i++) full[i] = 100;
                      setLessonCompletion(full);
                    }}
                    className="p-2 sm:px-4 sm:py-2 bg-white/3 border border-white/5 rounded-xl hover:bg-white/8 hover:text-white text-zinc-400 text-[11px] transition-all cursor-pointer flex-1 text-center"
                  >
                    Set Selesai Semua Bab
                  </button>
                  <button
                    onClick={() => {
                      triggerTick(220);
                      const empty: Record<number, number> = {};
                      for(let i=1; i<=25; i++) empty[i] = 0;
                      setLessonCompletion(empty);
                    }}
                    className="p-2 sm:px-4 sm:py-2 bg-white/3 border border-white/5 rounded-xl hover:bg-white/8 hover:text-white text-zinc-400 text-[11px] transition-all cursor-pointer flex-1 text-center"
                  >
                    Reset Semua Bab
                  </button>
                </div>
              </div>

              {/* Grid block container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {lessons.map((les) => {
                  const percent = lessonCompletion[les.id] || 0;
                  const isFinished = percent === 100;
                  const miniRadius = 18;
                  const miniCircumference = 2 * Math.PI * miniRadius; // ~113.1
                  const strokeDashoffsetMini = miniCircumference - (miniCircumference * percent) / 100;
                  
                  // JLPT categorization
                  const isN4 = les.id > 12;
                  const levelTag = isN4 ? "JLPT N4" : "JLPT N5";
                  const levelColor = isN4 ? "bg-rose-500/10 text-rose-350" : "bg-teal-500/10 text-teal-300";

                  return (
                    <div 
                      key={les.id} 
                      className={`liquid-glass rounded-2xl border p-5 transition-all text-left flex flex-col justify-between gap-4 group ${
                        isFinished 
                          ? 'border-emerald-500/20 bg-emerald-500/1' 
                          : 'border-white/5 bg-white/2 hover:border-white/10'
                      }`}
                    >
                      
                      {/* Top row: Bab details + custom mini ring */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-mono font-extrabold text-indigo-400 uppercase">Bab {les.id}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${levelColor}`}>
                              {levelTag}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-white leading-snug font-sans group-hover:text-amber-300 transition-colors">
                            {les.judul}
                          </h4>
                          <span className="text-[10px] text-zinc-500 font-light block font-sans italic">
                            ⏱️ {les.estimatedMinutes} menit estimasi
                          </span>
                        </div>

                        {/* Mini progress ring SVG */}
                        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r={miniRadius} className="stroke-white/5 fill-none" strokeWidth="3" />
                            <circle 
                              cx="24" 
                              cy="24" 
                              r={miniRadius} 
                              className={`transition-all duration-500 ease-out fill-none ${
                                isFinished ? 'stroke-emerald-400' : 'stroke-indigo-400'
                              }`} 
                              strokeWidth="3.5"
                              strokeDasharray={miniCircumference}
                              strokeDashoffset={strokeDashoffsetMini}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-[9px] font-mono font-bold text-white">
                            {percent}%
                          </span>
                        </div>
                      </div>

                      {/* Middle row: Interactive slider and status markers */}
                      <div className="space-y-2 bg-slate-950/20 p-2.5 rounded-xl border border-white/2">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-500">Tingkat Penyerapan</span>
                          <span className={isFinished ? 'text-emerald-400 font-bold' : 'text-zinc-350'}>
                            {percent === 100 ? 'Terserap Sempurna 🎉' : `${percent}% Tuntas`}
                          </span>
                        </div>
                        
                        {/* Interactive Range Slider */}
                        <div className="flex items-center gap-2">
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={percent}
                            onChange={(e) => handleAdjustCompletion(les.id, Number(e.target.value))}
                            className="w-full accent-indigo-400 h-1 bg-white/10 rounded-lg cursor-pointer transition-all hover:bg-white/20"
                          />
                        </div>

                        {/* Quick toggle presets */}
                        <div className="flex justify-between items-center bg-slate-950/40 px-1 py-1 rounded-lg">
                          <button
                            onClick={() => handlePresetCompletion(les.id, 'zero')}
                            className="text-[9px] text-zinc-500 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/5 transition-all cursor-pointer font-sans"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => handlePresetCompletion(les.id, 'half')}
                            className="text-[9px] text-zinc-500 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/5 transition-all cursor-pointer font-sans"
                          >
                            50%
                          </button>
                          <button
                            onClick={() => handlePresetCompletion(les.id, 'full')}
                            className="text-[9px] text-emerald-400/80 hover:text-emerald-300 font-bold px-1.5 py-0.5 rounded bg-emerald-500/5 hover:bg-emerald-500/15 border border-emerald-500/10 transition-all cursor-pointer font-sans"
                          >
                            Selesai!
                          </button>
                        </div>
                      </div>

                      {/* Bottom row: Dynamic Navigation launchers */}
                      <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                        <button
                          onClick={() => {
                            triggerTick(600);
                            setSelectedLesson(les.id);
                            setActiveSectionUnderLesson('kosakata');
                            setActiveTab('materi');
                          }}
                          className="px-2 py-2 bg-indigo-500/5 hover:bg-indigo-500/15 border border-indigo-500/10 hover:border-indigo-500/25 rounded-xl font-bold cursor-pointer text-indigo-300 transition-all flex items-center justify-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Pelajari Bab
                        </button>

                        <button
                          onClick={() => {
                            startQuizEngine('All', `${les.id}-${les.id}`);
                            setActiveTab('quiz');
                          }}
                          className="px-2 py-2 bg-emerald-500/5 hover:bg-emerald-500/15 border border-emerald-500/10 hover:border-emerald-500/25 rounded-xl font-bold cursor-pointer text-emerald-300 transition-all flex items-center justify-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5" /> Evaluasi Quiz
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* MODULE KANA TRAINER: FLASHCARD, INTERACTIVE QUIZ, CANVAS */}
      {/* ======================================================== */}
      {activeTab === 'kanatrainer' && (
        <div id="classroom-kana-trainer-module" className="animate-fade-rise space-y-6">
          <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/5">
            <KanaTrainer 
              onTriggerSound={(freq) => { triggerTick(freq); }}
              onIncrementStreak={() => { setStreakCount(prev => prev + 1); }}
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE KANJI LIBRARY: BROWSE, STROKE, & INTERACTIVE QUIZ */}
      {/* ======================================================== */}
      {activeTab === 'kanji' && (
        <div id="classroom-kanji-library-module" className="animate-fade-rise space-y-6">
          <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/5">
            <KanjiLibrary 
              onTriggerSound={(freq) => { triggerTick(freq); }}
              onIncrementStreak={() => { setStreakCount(prev => prev + 1); }}
              onAddXP={addXP}
              onUnlockBadge={unlockBadge}
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 1: TABEL KANA LENGKAP + VARIAN + KOMBINASI */}
      {/* ======================================================== */}
      {activeTab === 'kana' && (
        <div id="classroom-kana-module" className="animate-fade-rise space-y-6">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/5">
            
            {/* Subsection header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/5 pb-6">
              <div>
                <h2 className="text-3xl font-display text-white font-normal mb-1">
                  Papan Interaktif Aksara Kana
                </h2>
                <p className="text-xs text-zinc-400 font-light font-sans leading-relaxed max-w-xl">
                  Sentuh sel apa pun untuk memicu audio lafal aslinya. Pelajari cara penulisan dasar 
                  dilengkapi kombinasi bunyi modern.
                </p>
              </div>

              {/* Selector Hiragana / Katakana */}
              <div className="flex gap-2">
                <button
                  onClick={() => { triggerTick(523); setKanaType('hiragana'); }}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer border ${
                    kanaType === 'hiragana' 
                      ? 'bg-white text-slate-950 border-white font-extrabold shadow-md' 
                      : 'bg-white/3 text-zinc-400 border-white/5 hover:text-white'
                  }`}
                >
                  Hiragana
                </button>
                <button
                  onClick={() => { triggerTick(659); setKanaType('katakana'); }}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer border ${
                    kanaType === 'katakana' 
                      ? 'bg-white text-slate-950 border-white font-extrabold shadow-md' 
                      : 'bg-white/3 text-zinc-400 border-white/5 hover:text-white'
                  }`}
                >
                  Katakana
                </button>
              </div>
            </div>

            {/* Sub-tabs for Basic, Variants, Combinations */}
            <div className="flex flex-wrap gap-2 mb-6 bg-white/2 p-2 rounded-2xl border border-white/5 justify-start max-w-md">
              {renderSubTabButton('dasar', 'Dasas (Basic)')}
              {renderSubTabButton('varian', 'Varian (Dakuon)')}
              {renderSubTabButton('kombinasi', 'Kombinasi (Yoo-on)')}
            </div>

            {/* Render Selected Dynamic Character Grid */}
            <div className="bg-slate-950/20 p-4 sm:p-6 rounded-2xl border border-white/5 text-center">
              
              {/* Conditional columns count depending on subtab */}
              <div className={`grid gap-3 grid-cols-5 ${kanaSubTab === 'kombinasi' ? 'sm:grid-cols-6' : 'sm:grid-cols-10'} max-w-5xl mx-auto w-full`}>
                {KANA_DATA[kanaType][kanaSubTab].map((item, index) => {
                  if (item.char === '—' || item.rom === '') {
                    return (
                      <div 
                        key={index} 
                        className="h-16 flex items-center justify-center text-zinc-800 font-mono text-xs select-none bg-slate-950/40 rounded-xl"
                      >
                        —
                      </div>
                    );
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => playKanaSound(item.char, item.rom)}
                      className="h-20 sm:h-22 bg-white/3 hover:bg-white/10 active:bg-white/20 hover:scale-[1.04] rounded-2xl border border-white/10 flex flex-col items-center justify-center p-2 cursor-pointer transition-all active:scale-95 group font-display select-none"
                    >
                      <span className="text-3xl sm:text-4xl text-white font-normal leading-none mb-1 group-hover:text-yellow-350 transition-colors">
                        {item.char}
                      </span>
                      <span className="text-[10px] font-sans font-mono tracking-widest text-zinc-500 uppercase group-hover:text-zinc-200 transition-colors">
                        {item.rom}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Extra Pronunciation Tip based on Chosen Subtab */}
              <div className="mt-8 pt-6 border-t border-white/5 text-left text-xs text-zinc-400 font-light space-y-2 max-w-2xl mx-auto">
                <p className="font-semibold text-zinc-300">💡 Arahan Guru Profesional:</p>
                {kanaSubTab === 'dasar' && (
                  <p>Aksara Dasar (Gojuon) adalah pondasi dari semua sistem tulisan bahasa Jepang. Selalu latih mengucapkan vokal pendek (a-i-u-e-o) terlebih dahulu dengan intonasi datar.</p>
                )}
                {kanaSubTab === 'varian' && (
                  <p>Aksara Varian (Dakuon) menggunakan tanda kutip kecil (tenten) di kanan atas karakter dasar untuk mendengungkan suara. Seperti suara K menjadi G (Ka → Ga), S menjadi Z, T menjadi D, dan H menjadi B (baik) atau P (bundar).</p>
                )}
                {kanaSubTab === 'kombinasi' && (
                  <p>Aksara Kombinasi (Yoo-on) menggabungkan satu baris karakter berakhiran vokal "i" dengan karakter Ya, Yu, atau Yo kecil di bawahnya. Suku kata ini melambangkan pengucapan terikat satu mora sela.</p>
                )}
              </div>

            </div>

          </div>
        </div>
      )}
      {/* MODULE 2: MATERI KOMPLIT & DETAIL (MINNA NO NIHONGO CH) */}
      {/* ======================================================== */}
      {activeTab === 'materi' && (() => {
        const currentLessonData = ALL_LESSONS.find(l => l.id === selectedLesson) || ALL_LESSONS[0];
        
        return (
          <div id="classroom-materi-module" className="animate-fade-rise space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Sidebar list of complete lessons based on user's PRD requirements */}
              <div className="lg:col-span-4 space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Tingkatan Kelas Kurikulum</span>
                  <span className="text-[10px] bg-emerald-550/10 border border-emerald-500/10 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full">Kelas 1-10</span>
                </div>
                
                {/* Collapsible/Grouped Level Folder of LPK Classes */}
                {Array.from(new Set(ALL_LESSONS.map(l => l.classLevel))).map((classLvl) => {
                  const classLessons = ALL_LESSONS.filter(l => l.classLevel === classLvl);
                  return (
                    <div key={classLvl} className="space-y-1.5 bg-white/2 p-3 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-mono tracking-wider font-extrabold text-yellow-500 px-2 uppercase block mb-1">
                        {classLvl}
                      </span>
                      <div className="space-y-1">
                        {classLessons.map((les) => (
                          <button
                            key={les.id}
                            onClick={() => { 
                              triggerTick(220); 
                              setSelectedLesson(les.id); 
                              // Reset state variables when changing Bab
                              setQuizSelectedAnswer('');
                              setQuizSubmitted(false);
                              setDrillAnswers({});
                              setDrillChecked({});
                              setActiveLatihanAnswers({});
                              setActiveLatihanSubmitted({});
                              setActiveSectionUnderLesson('kosakata');
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer text-xs ${
                              selectedLesson === les.id 
                                ? 'bg-white text-slate-950 font-bold border-white shadow-md scale-[1.01]' 
                                : 'bg-white/3 hover:bg-white/8 border-white/5 text-zinc-300 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate pr-1">
                                Bab {les.id}: {les.title.split(': ')[1] || les.title}
                              </span>
                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${selectedLesson === les.id ? 'rotate-90 text-slate-950' : 'text-zinc-500'}`} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lesson detail viewer holding detailed professional lessons */}
              <div className="lg:col-span-8">
                <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between min-h-[500px]">
                  
                  {/* Lesson inner subsegments (Vocab, Gram, Dialog, Drill, Quiz, Review) */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-white/5 pb-5 mb-6">
                    <div className="text-left">
                      <span className="text-[9px] sm:text-[10px] bg-yellow-500/15 border border-yellow-500/20 rounded-full px-2.5 py-1 text-yellow-300 uppercase tracking-widest font-extrabold flex items-center gap-1 inline-flex">
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                        KURIKULUM MINNA NO NIHONGO • {currentLessonData.classLevel}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-display text-white mt-1 leading-tight font-normal">
                        Pelajaran {currentLessonData.id}: {currentLessonData.title.split(': ')[1] || currentLessonData.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-0.5 italic">Situasi: {currentLessonData.theme} • Estimasi: {currentLessonData.estimatedMinutes} Menit</p>
                    </div>

                    <div className="flex flex-wrap gap-1 text-[10px] sm:text-xs">
                      {[
                        { id: 'kosakata', label: 'Kosakata' },
                        { id: 'tata', label: 'Pola & Tata Bahasa' },
                        { id: 'dialog', label: 'Dialog' },
                        { id: 'latihan', label: 'Latihan A,B,C' },
                        { id: 'kuis', label: 'Kuis Akhir' },
                        { id: 'review', label: 'Kultur & Review' }
                      ].map((sec) => (
                        <button
                          key={sec.id}
                          onClick={() => { triggerTick(330); setActiveSectionUnderLesson(sec.id as any); }}
                          className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                            activeSectionUnderLesson === sec.id 
                              ? 'bg-white text-slate-950 font-bold' 
                              : 'text-zinc-400 hover:text-white bg-white/3 hover:bg-white/8 border border-white/5'
                          }`}
                        >
                          {sec.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Objective Checklist Widget */}
                  <div className="mb-6 bg-white/2 border border-white/5 rounded-2xl p-4 text-left">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 block mb-2">Target Kemampuan Bab Ini:</span>
                    <ul className="space-y-1 text-xs text-zinc-300 font-light font-sans">
                      {currentLessonData.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* DYNAMIC LESSON SECTION CONTENTS */}
                  {activeSectionUnderLesson === 'kosakata' && (
                    <div className="space-y-4 animate-fade-rise text-left">
                      <p className="text-xs text-zinc-400 font-light">Daftar kosakata wajib dikuasai sebelum praktik kalimat. Sentuh lafal suara untuk mendengarkan lafal aslinya:</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                        {currentLessonData.vocabulary.map((v, i) => (
                          <div key={i} className="bg-white/2 border border-white/5 rounded-2xl p-4 flex justify-between items-center group">
                            <div>
                              <h5 className="text-sm font-semibold text-white group-hover:text-yellow-300 transition-colors">{v.jp}</h5>
                              <p className="text-xs text-zinc-305 font-medium">{v.rom} • <span className="text-[10px] text-zinc-500">{v.type}</span></p>
                              <p className="text-xs text-zinc-400 mt-1">{v.translation}</p>
                              <p className="text-[10px] text-zinc-500 italic mt-0.5">{v.desc}</p>
                            </div>
                            <button 
                              onClick={() => speakText(v.jp)}
                              title="Lafalkan Suara Asli (TTS)"
                              className="p-2 h-8 w-8 rounded-full border border-indigo-500/25 bg-indigo-550/10 hover:bg-indigo-500 hover:text-white text-indigo-300 active:scale-95 transition-all flex items-center justify-center cursor-pointer shrink-0 animate-pulse"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSectionUnderLesson === 'tata' && (
                    <div className="space-y-6 animate-fade-rise text-left max-h-[60vh] overflow-y-auto pr-1">
                      
                      {/* Subsegment: Pola Kalimat */}
                      <div className="space-y-3">
                        <span className="text-xs uppercase tracking-widest text-[10px] font-bold text-zinc-400 block">1. Contoh Pola Kalimat Acuan (例文)</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentLessonData.sentencePatterns.map((pat, idx) => (
                            <div key={idx} className="bg-white/2 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                              <span className="text-base text-white font-mono font-medium block">{pat.pattern}</span>
                              <span className="text-xs text-zinc-400 block mt-1 italic font-light">"{pat.meaning}"</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Subsegment: Penjelasan Tatabahasa Utama */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <span className="text-xs uppercase tracking-widest text-[10px] font-bold text-zinc-400 block">2. Analisis & Penjelasan Tatabahasa</span>
                        
                        {currentLessonData.grammarPoints.map((gp, idx) => (
                          <div key={idx} className="bg-white/3 p-5 rounded-2xl border border-white/5 space-y-3">
                            <h5 className="text-sm font-semibold text-white flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                              {gp.title}
                            </h5>
                            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                              {gp.explanation}
                            </p>
                            
                             {/* Standard Usage Examples */}
                             <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-1 text-left relative group">
                               <div className="flex justify-between items-start">
                                 <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Kalimat Contoh:</span>
                                 <button
                                   type="button"
                                   onClick={() => speakText(gp.exJp)}
                                   className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-600 border border-indigo-500/20 rounded-lg text-indigo-300 hover:text-white text-[10px] uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                 >
                                   <Volume2 className="w-3 h-3 animate-pulse" /> Lafalkan (TTS)
                                 </button>
                               </div>
                               <span className="text-base text-white font-mono block select-all mt-1">{gp.exJp}</span>
                               <p className="text-xs text-zinc-400 font-mono italic">({gp.exRom})</p>
                               <span className="text-xs text-zinc-300 block mt-1">Artinya: "{gp.exId}"</span>
                             </div>

                            {/* Common mistake block */}
                            {gp.commonMistakeJp && (
                              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 space-y-1 text-left">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-450" />
                                  Kekeliruan Pemula — Jangan Ditiru!
                                </span>
                                <p className="text-xs text-amber-200/90 font-mono line-through font-light mt-1">❌ {gp.commonMistakeJp}</p>
                                <p className="text-[11px] text-zinc-400 font-light leading-relaxed mt-0.5">Analisis: {gp.commonMistakeId}</p>
                              </div>
                            )}

                            {/* Live Interactive Drill Box */}
                            {gp.drillText && (
                              <div className="bg-white/2 border border-white/5 rounded-xl p-4 space-y-2 text-left">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-1.5">
                                  <Brain className="w-3.5 h-3.5 text-cyan-300" />
                                  Micro-Drill di Tempat
                                </span>
                                <p className="text-xs text-zinc-200">{gp.drillText}</p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    type="text"
                                    value={drillAnswers[`gp_${selectedLesson}_${idx}`] || ''}
                                    onChange={(e) => setDrillAnswers({ 
                                      ...drillAnswers, 
                                      [`gp_${selectedLesson}_${idx}`]: e.target.value 
                                    })}
                                    placeholder="Ketik jawaban bahasa Jepang di sini..."
                                    className="bg-slate-950/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-white/20 flex-1 font-mono"
                                  />
                                  <button
                                    onClick={() => {
                                      const userStr = (drillAnswers[`gp_${selectedLesson}_${idx}`] || '').trim().replace(/\s+/g, '');
                                      const solStr = (gp.drillSolution || '').trim().replace(/\s+/g, '');
                                      const match = userStr === solStr;
                                      
                                      if (match) {
                                        triggerTick(880);
                                      } else {
                                        triggerTick(150);
                                      }
                                      
                                      setDrillChecked({ 
                                        ...drillChecked, 
                                        [`gp_${selectedLesson}_${idx}`]: true 
                                      });
                                    }}
                                    className="bg-white text-slate-950 font-extrabold text-xs uppercase px-4 py-2 rounded-xl active:scale-95 transition-all cursor-pointer"
                                  >
                                    Periksa
                                  </button>
                                </div>
                                {drillChecked[`gp_${selectedLesson}_${idx}`] && (
                                  <div className="text-xs font-semibold mt-1">
                                    {(drillAnswers[`gp_${selectedLesson}_${idx}`] || '').trim().replace(/\s+/g, '') === (gp.drillSolution || '').trim().replace(/\s+/g, '') ? (
                                      <span className="text-emerald-400 flex items-center gap-1">✓ Jawaban Anda Benar! Kerja bagus.</span>
                                    ) : (
                                      <div className="text-rose-450 block space-y-0.5">
                                        <span>✗ Kurang pas, perhatikan susunan partikelnya.</span>
                                        <span className="text-zinc-500 font-light block">Jawaban benar: <strong className="text-zinc-250 font-mono select-all font-bold">{gp.drillSolution}</strong></span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {activeSectionUnderLesson === 'dialog' && (
                    <div className="space-y-6 animate-fade-rise text-left max-h-[55vh] overflow-y-auto pr-1">
                      <p className="text-xs text-zinc-400 font-light">Latih interaksi lisan natural dari skenario kehidupan nyata di asrama atau pabrik Jepang:</p>
                      
                      <div className="space-y-4">
                        {currentLessonData.dialogue.map((dlg, idx) => (
                          <div 
                            key={idx} 
                            className={`p-4 rounded-2xl border flex flex-col ${
                              dlg.speaker === 'ルカ' || dlg.speaker === '実üş生' || dlg.speaker === '実習生'
                                ? 'bg-white/5 border-white/10 ml-6 border-l-4 border-l-yellow-405'
                                : 'bg-slate-950/20 border-white/5 mr-6 border-l-4 border-l-zinc-500'
                            }`}
                          >
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                              {dlg.speaker}
                            </span>
                            <span className="text-base text-white font-display select-all leading-relaxed block">
                              {dlg.textJp}
                            </span>
                            <span className="text-xs text-zinc-400 italic block mt-0.5">
                              {dlg.textRom}
                            </span>
                            <p className="text-xs text-zinc-300 font-sans mt-2 border-t border-white/3 pt-1">
                              "{dlg.textId}"
                            </p>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => {
                          const firstLine = currentLessonData.dialogue[0];
                          if (firstLine) {
                            playKanaSound(firstLine.textJp, firstLine.textRom);
                          }
                        }}
                        className="liquid-glass text-xs font-bold uppercase px-6 py-3.5 rounded-full text-white hover:scale-105 active:scale-95 transition-all text-center mx-auto flex items-center justify-center gap-2 cursor-pointer mt-6"
                      >
                        <Volume2 className="w-4 h-4 text-white" />
                        Mainkan Simulasi Suara Native
                      </button>
                    </div>
                  )}

                  {activeSectionUnderLesson === 'latihan' && (
                    <div className="space-y-6 animate-fade-rise text-left max-h-[60vh] overflow-y-auto pr-1">
                      <p className="text-xs text-zinc-400 font-light">Selesaikan rangkaian tes Latihan A, B, dan C berdasarkan materi penunjang pembelajaran:</p>
                      
                      <div className="space-y-5">
                        {currentLessonData.exercises.map((exe, i) => {
                          const questionId = `ex_${selectedLesson}_${i}`;
                          const answered = activeLatihanAnswers[questionId];
                          const submitted = activeLatihanSubmitted[questionId];
                          
                          return (
                            <div key={i} className="bg-white/3 p-5 rounded-2xl border border-white/5 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold">
                                  LATIHAN {exe.type} — {exe.title}
                                </span>
                                {submitted && (
                                  <span className={`text-[10px] uppercase font-bold font-mono ${answered === exe.correct ? 'text-emerald-400' : 'text-rose-450'}`}>
                                    {answered === exe.correct ? 'BENAR' : 'SALAH'}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-semibold text-white">{exe.sentence}</p>
                              
                              {/* Option choices */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {exe.options.map((opt, oIdx) => (
                                  <button
                                    key={oIdx}
                                    onClick={() => {
                                      if (!submitted) {
                                        triggerTick(440);
                                        setActiveLatihanAnswers({
                                          ...activeLatihanAnswers,
                                          [questionId]: opt
                                        });
                                      }
                                    }}
                                    disabled={submitted}
                                    className={`p-3 rounded-xl border text-xs text-left transition-all ${
                                      answered === opt
                                        ? submitted
                                          ? opt === exe.correct
                                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                          : 'bg-white text-slate-950 font-bold border-white'
                                        : 'bg-white/3 hover:bg-white/7 border-white/5 text-zinc-350'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>

                              {/* Submission panel */}
                              {!submitted ? (
                                <button
                                  onClick={() => {
                                    if (answered) {
                                      const isCorrect = answered === exe.correct;
                                      triggerTick(isCorrect ? 880 : 150);
                                      setActiveLatihanSubmitted({
                                        ...activeLatihanSubmitted,
                                        [questionId]: true
                                      });
                                    } else {
                                      triggerTick(220);
                                    }
                                  }}
                                  disabled={!answered}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                                    answered 
                                      ? 'bg-white/10 text-white border border-white/10 hover:bg-white/15 cursor-pointer' 
                                      : 'bg-white/2 border border-white/5 text-zinc-550 cursor-not-allowed'
                                  }`}
                                >
                                  Verifikasi Jawaban
                                </button>
                              ) : (
                                <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs">
                                  <span className="text-zinc-550 block uppercase text-[9px] font-bold">Ulasan Guru Pendamping:</span>
                                  <p className="text-zinc-300 font-light">{exe.explanation}</p>
                                  <span className="text-zinc-500 block">Kunci Jawaban: <strong className="text-white font-mono">{exe.correct}</strong></span>
                                  <button
                                    onClick={() => {
                                      triggerTick(330);
                                      const updatedAnswers = { ...activeLatihanAnswers };
                                      delete updatedAnswers[questionId];
                                      const updatedSubmitted = { ...activeLatihanSubmitted };
                                      delete updatedSubmitted[questionId];
                                      
                                      setActiveLatihanAnswers(updatedAnswers);
                                      setActiveLatihanSubmitted(updatedSubmitted);
                                    }}
                                    className="text-[10px] text-zinc-400 hover:text-white uppercase transition-colors shrink-0 underline block pt-1 cursor-pointer"
                                  >
                                    Ulangi Menjawab
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}

                  {activeSectionUnderLesson === 'kuis' && (() => {
                    const lessonQuiz = currentLessonData.quiz[0];
                    if (!lessonQuiz) return (
                      <div className="py-8 text-center text-zinc-500 font-light">Tidak ada kuis untuk bab ini.</div>
                    );

                    const isQuizCorrect = quizSelectedAnswer === lessonQuiz.answer;

                    return (
                      <div className="space-y-6 animate-fade-rise text-left max-h-[55vh] overflow-y-auto pr-1">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                          <HelpCircle className="w-5 h-5 text-yellow-350" />
                          <span className="text-sm font-semibold text-white">Evaluasi Mandiri Ujian Kelas</span>
                        </div>

                        <div className="bg-white/3 border border-white/5 rounded-3xl p-6 space-y-4">
                          <p className="text-sm sm:text-base font-semibold text-white">
                            {lessonQuiz.question}
                          </p>

                          <div className="flex flex-col gap-2">
                            {lessonQuiz.options.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (!quizSubmitted) {
                                    triggerTick(440);
                                    setQuizSelectedAnswer(option);
                                  }
                                }}
                                disabled={quizSubmitted}
                                className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all ${
                                  quizSelectedAnswer === option
                                    ? quizSubmitted
                                      ? isQuizCorrect
                                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 font-semibold'
                                        : 'bg-rose-500/10 text-rose-450 border-rose-500/20 font-semibold'
                                      : 'bg-white text-slate-950 font-bold border-white scale-[1.01]'
                                    : 'bg-white/3 hover:bg-white/6 border-white/5 text-zinc-300'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>

                          {!quizSubmitted ? (
                            <button
                              onClick={() => {
                                if (quizSelectedAnswer) {
                                  const isCorrect = quizSelectedAnswer === lessonQuiz.answer;
                                  triggerTick(isCorrect ? 880 : 150);
                                  setQuizSubmitted(true);
                                  if (isCorrect) {
                                    addXP(15);
                                  }
                                } else {
                                  triggerTick(220);
                                }
                              }}
                              disabled={!quizSelectedAnswer}
                              className={`w-full py-4 rounded-2xl text-xs font-bold uppercase transition-all tracking-wider ${
                                quizSelectedAnswer 
                                  ? 'bg-white text-slate-950 hover:bg-zinc-200 cursor-pointer shadow-lg font-extrabold' 
                                  : 'bg-white/5 text-zinc-550 border border-white/5 cursor-not-allowed'
                              }`}
                            >
                              Kirim Jawaban Kuis
                            </button>
                          ) : (
                            <div className={`p-6 rounded-2xl border transition-all mt-3 ${
                              isQuizCorrect 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 animate-pulse' 
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                            }`}>
                              <div className="flex items-center gap-2 mb-3">
                                {isQuizCorrect ? (
                                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                    <span>✓ EVALUASI PAPAN JAWABAN BENAR! (+15 XP)</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
                                    <AlertTriangle className="w-6 h-6 text-rose-450 animate-[bounce_0.8s_infinite]" />
                                    <span>✗ REKOMENDASI ANALISIS REVIEW & KOREKSI EVALUASI</span>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-4">
                                <p className="text-xs text-zinc-300 leading-relaxed font-sans bg-slate-950/40 p-4 rounded-xl border border-white/5">
                                  <strong className="text-white block mb-1">Analisis Penggunaan:</strong> 
                                  {lessonQuiz.explanation}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-sans">
                                  <div className="p-3 bg-white/2 rounded-xl border border-white/5">
                                    <span className="text-zinc-500 block">Jawaban Anda</span>
                                    <span className={`font-semibold ${isQuizCorrect ? 'text-emerald-400' : 'text-rose-405'}`}>{quizSelectedAnswer}</span>
                                  </div>
                                  <div className="p-3 bg-white/2 rounded-xl border border-white/5">
                                    <span className="text-zinc-500 block">Kunci Jawaban Tepat</span>
                                    <span className="text-emerald-400 font-semibold">{lessonQuiz.answer}</span>
                                  </div>
                                </div>

                                {/* Custom Remedial action list based on wrong answer */}
                                {!isQuizCorrect && (
                                  <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 text-xs text-amber-300/90 leading-relaxed space-y-1.5">
                                    <strong className="text-amber-200 block text-[11px] uppercase tracking-wider text-left">Langkah Remedial:</strong>
                                    <p className="text-left">• Tinjau ulang pola tata bahasa bab ini: <strong>{currentLessonData.grammarPoints[0]?.title || 'Pola Utama'}</strong>.</p>
                                    <p className="text-left">• Gunakan fitur Text-to-Speech (audio pronunciation) untuk melafalkan kata-kata kunci di tab Kosakata.</p>
                                    <p className="text-left">• Bacalah dialog terjemahan dengan lantang agar intonasi kalimat nempal sempurna.</p>
                                  </div>
                                )}
                              </div>
                              
                              <button
                                onClick={() => {
                                  triggerTick(220);
                                  setQuizSelectedAnswer('');
                                  setQuizSubmitted(false);
                                }}
                                className="mt-4 text-xs text-zinc-300 underline hover:text-white transition-colors uppercase cursor-pointer block text-left"
                              >
                                Coba Jawab Ulang Kuis
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {activeSectionUnderLesson === 'review' && (
                    <div className="space-y-6 animate-fade-rise text-left max-h-[55vh] overflow-y-auto pr-1">
                      
                      {/* Culture note card */}
                      <div className="bg-gradient-to-br from-cyan-950/20 to-blue-950/10 border border-cyan-500/10 rounded-2xl p-5 sm:p-6 space-y-3">
                        <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/10 rounded-full px-2.5 py-1 text-cyan-300 uppercase tracking-widest font-extrabold flex items-center gap-1.5 inline-flex">
                          <Globe className="w-3.5 h-3.5 text-cyan-400" />
                          FAKTOR KOMPETENSI INDIVIDU LINGKUNGAN JEPANG
                        </span>
                        <h4 className="text-sm font-semibold text-white">Catatan Budaya (Kultur Kerja & Etiket)</h4>
                        <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed font-light font-sans">
                          {currentLessonData.cultureNote}
                        </p>
                      </div>

                      {/* Review checklist summary folders */}
                      <div className="space-y-3">
                        <span className="text-xs uppercase tracking-widest text-[10px] font-bold text-zinc-400 block">Kualifikasi Yang Dipenuhi Bab Ini:</span>
                        <div className="space-y-2">
                          {currentLessonData.reviewSummary.map((sm, id) => (
                            <div key={id} className="bg-white/2 border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
                              <div className="p-1 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/15 shrink-0">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              </div>
                              <span className="text-xs sm:text-sm text-zinc-300 font-light font-sans">{sm}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Navigational lesson footer */}
                  <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-8 text-xs">
                    <button
                      onClick={() => {
                        if (selectedLesson > 1) {
                          triggerTick(330);
                          setSelectedLesson(selectedLesson - 1);
                          setQuizSelectedAnswer('');
                          setQuizSubmitted(false);
                          setDrillAnswers({});
                          setDrillChecked({});
                          setActiveLatihanAnswers({});
                          setActiveLatihanSubmitted({});
                          setActiveSectionUnderLesson('kosakata');
                        }
                      }}
                      disabled={selectedLesson === 1}
                      className={`px-4 py-2 rounded-xl transition-all ${
                        selectedLesson === 1 
                          ? 'text-zinc-600 border border-white/3 bg-transparent cursor-not-allowed' 
                          : 'text-zinc-300 hover:text-white border border-white/5 bg-white/3 hover:bg-white/8 cursor-pointer'
                      }`}
                    >
                      ← Pelajaran Sebelumnya
                    </button>

                    <button
                      onClick={() => {
                        if (selectedLesson < ALL_LESSONS.length) {
                          triggerTick(330);
                          setSelectedLesson(selectedLesson + 1);
                          setQuizSelectedAnswer('');
                          setQuizSubmitted(false);
                          setDrillAnswers({});
                          setDrillChecked({});
                          setActiveLatihanAnswers({});
                          setActiveLatihanSubmitted({});
                          setActiveSectionUnderLesson('kosakata');
                        }
                      }}
                      disabled={selectedLesson === ALL_LESSONS.length}
                      className={`px-4 py-2 rounded-xl transition-all ${
                        selectedLesson === ALL_LESSONS.length 
                          ? 'text-zinc-600 border border-white/3 bg-transparent cursor-not-allowed' 
                          : 'text-zinc-300 hover:text-white border border-white/5 bg-white/3 hover:bg-white/8 cursor-pointer'
                      }`}
                    >
                      Pelajaran Berikutnya →
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* MODULE 3: INTERACTIVE TIMED GAME WITH DIFFICULTY */}
      {/* ======================================================== */}
      {activeTab === 'game' && (
        <div id="classroom-game-module" className="animate-fade-rise space-y-6">
          <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/5">
            
            {/* Header game section */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-display text-white">Mode Blitz Speedrun</h3>
                <p className="text-xs text-zinc-400 font-light font-sans mt-0.5">
                  Tingkatkan level kesulitan untuk mempercepat hitungan mundur lari.
                </p>
              </div>

              {gameActive && (
                <div className="flex items-center gap-3">
                  <div className="text-xs bg-white/5 px-3 py-1 rounded-full text-zinc-200">
                    Sisa Waktu: <span className="font-mono font-bold text-rose-450">{timeLeft}s</span>
                  </div>
                  <div className="text-xs bg-emerald-500/10 border border-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full font-bold">
                    Multiplier: x{gameDifficulty}
                  </div>
                </div>
              )}
            </div>

            {/* If game is idle, show card selection for level difficulty */}
            {!gameActive && !showResult && (
              <div id="difficulty-grid-selection" className="space-y-6">
                <span className="text-xs uppercase tracking-widest text-zinc-500 block font-semibold text-center">Pilih Tingkat Kesulitan</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { lvl: 1, label: 'Level 1: Dasar Santai', desc: 'Hiragana dasar, tanpa dakuon. Pas waktu 45s.', multiplier: 'x1' },
                    { lvl: 2, label: 'Level 2: Sedang Gesit', desc: 'Hiragana dasar + varian dakuon. Waktu 30s.', multiplier: 'x2' },
                    { lvl: 3, label: 'Level 3: Pro JLPT N5', desc: 'Hiragana + Katakana + Kombinasi. Waktu 20s.', multiplier: 'x3' },
                    { lvl: 4, label: 'Level 4: Insane SSW Champion', desc: 'Kondisi gila, multiplier cepat. Pas waktu 12s.', multiplier: 'x4' }
                  ].map((diff) => (
                    <button
                      key={diff.lvl}
                      onClick={() => startGameWithLevel(diff.lvl)}
                      className="liquid-glass rounded-2xl p-6 hover:scale-[1.03] transition-all duration-300 group hover:border-white/20 hover:bg-white/5 cursor-pointer text-left flex flex-col justify-between min-h-[160px]"
                    >
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">TINGKATAN {diff.lvl}</span>
                        <h4 className="text-base font-semibold text-white group-hover:text-yellow-300 transition-colors">{diff.label}</h4>
                        <p className="text-xs text-zinc-400 font-light mt-1.5 leading-relaxed">{diff.desc}</p>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-4 text-xs">
                        <span className="text-zinc-500">Skor Multiplier:</span>
                        <span className="font-bold text-white uppercase">{diff.multiplier}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* active Blitz game board */}
            {gameActive && (
              <div id="game-active-blitz-board" className="py-8 max-w-lg mx-auto text-center space-y-6 animate-fade-rise">
                <p className="text-xs text-zinc-400 font-light">Tebak lafal romaji dari huruf di bawah ini:</p>
                <div className="text-6xl sm:text-7xl font-display text-white select-none py-6 bg-white/5 rounded-3xl border border-white/5 animate-pulse">
                  {currentQuestion.char}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-6">
                  {currentQuestion.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleLevelAnswer(opt)}
                      className="liquid-glass py-4 rounded-xl text-sm font-semibold tracking-wide border border-white/10 hover:border-white/20 text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer uppercase font-mono"
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="pt-4 text-center">
                  <span className="text-xs text-zinc-500 font-light">Papan Skor: <strong className="text-white font-mono">{gameScore}</strong></span>
                </div>
              </div>
            )}

            {/* Game over result page with feedback metrics matching the PRD */}
            {showResult && (
              <div id="game-ended-result" className="text-center py-10 max-w-md mx-auto space-y-6 animate-fade-rise">
                <Trophy className="w-16 h-16 text-yellow-300 mx-auto animate-bounce" />
                <div>
                  <h3 className="text-3xl font-display text-white">Sesi Blitz Berakhir!</h3>
                  <p className="text-xs text-zinc-400 font-light font-sans mt-1">
                    Anda berlatih pada tingkat kesulitan Level {gameDifficulty}.
                  </p>
                </div>

                <div className="bg-white/3 border border-white/5 rounded-2xl p-6 divide-y divide-white/5 text-left">
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-zinc-400">Total Skor Diperoleh:</span>
                    <span className="font-bold text-emerald-400 font-mono">{gameScore} Pts</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-zinc-400">Streak BONUS multiplier:</span>
                    <span className="font-bold text-white uppercase font-mono">x{gameDifficulty}</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => startGameWithLevel(gameDifficulty)}
                    className="liquid-glass text-xs font-semibold uppercase px-6 py-3 rounded-full text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    Main Lagi
                  </button>
                  <button
                    onClick={() => { triggerTick(220); setShowResult(false); }}
                    className="bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-350 hover:text-white text-xs font-semibold uppercase px-6 py-3 rounded-full cursor-pointer transition-all"
                  >
                    Ganti Level
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE: KAMUS KOSAKATA INTERAKTIF N5 & N4 */}
      {/* ======================================================== */}
      {activeTab === 'vocab' && (
        <div id="classroom-vocab-module" className="animate-fade-rise space-y-6">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/5 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
              <div>
                <h2 className="text-3xl font-display text-white font-normal mb-1">
                  Kamus Kosakata Interaktif
                </h2>
                <p className="text-xs text-zinc-400 font-light font-sans leading-relaxed max-w-xl">
                  Telusuri dan latih pengucapan database kosakata lengkap Minna no Nihongo (Tingkat JLPT N5 - N4). Gunakan filter interaktif untuk memilah Bab atau jenis kata.
                </p>
              </div>

              {/* Status statistics */}
              <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                <Brain className="w-5 h-5 text-indigo-400" />
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 block">Total Database</span>
                  <span className="text-xs font-mono font-bold text-white">{filteredVocabList.length} dari {VOCABULARY_DATABASE.length} Kosakata</span>
                </div>
              </div>
            </div>

            {/* Interactive Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white/2 border border-white/5 p-4 rounded-2xl">
              
              {/* Search input with search icon */}
              <div className="flex flex-col gap-1.5 animate-fade-rise">
                <label className="text-[10px] uppercase font-semibold text-zinc-400 flex items-center gap-1">
                  <Search className="w-3 h-3 text-zinc-500" /> Pencarian Kosakata
                </label>
                <input
                  type="text"
                  placeholder="Ketik Kanji, Romaji, Arti..."
                  value={vocabSearchQuery}
                  onChange={(e) => setVocabSearchQuery(e.target.value)}
                  className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400 transition-colors w-full"
                />
              </div>

              {/* Level Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-semibold text-zinc-400">Tingkat JLPT</label>
                <div className="flex gap-1">
                  {['All', 'N5', 'N4'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => { triggerTick(500); setVocabJlptFilter(lvl as any); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        vocabJlptFilter === lvl
                          ? 'bg-white text-slate-950 border-white font-extrabold'
                          : 'bg-slate-900/50 hover:bg-slate-900/80 border-white/5 text-zinc-400'
                      }`}
                    >
                      {lvl === 'All' ? 'Semua' : lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bab Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-semibold text-zinc-400 font-sans">Pilih Bab Pelajaran</label>
                <select
                  value={vocabBabFilter}
                  onChange={(e) => { triggerTick(480); setVocabBabFilter(e.target.value === 'All' ? 'All' : Number(e.target.value)); }}
                  className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400 transition-colors cursor-pointer"
                >
                  <option value="All">Semua Bab (1 - 25)</option>
                  {Array.from({ length: 25 }, (_, idx) => (
                    <option key={idx + 1} value={idx + 1}>Bab {idx + 1}</option>
                  ))}
                </select>
              </div>

              {/* Word Type Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-semibold text-zinc-400 font-sans">Klasifikasi Jenis Kata</label>
                <select
                  value={vocabTypeFilter}
                  onChange={(e) => { triggerTick(480); setVocabTypeFilter(e.target.value); }}
                  className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400 transition-colors cursor-pointer"
                >
                  <option value="All">Semua Jenis Kata</option>
                  <option value="Benda">Kata Benda</option>
                  <option value="Kerja">Kata Kerja (I, II, III)</option>
                  <option value="Sifat">Kata Sifat (-i / -na)</option>
                  <option value="Keterangan">Kata Keterangan / Akhiran</option>
                  <option value="Ganti">Kata Ganti</option>
                  <option value="Ungkapan">Ungkapan & Partikel</option>
                </select>
              </div>

            </div>

            {/* Vocabulary Grid Board */}
            {filteredVocabList.length === 0 ? (
              <div className="bg-white/2 border border-white/5 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
                <AlertTriangle className="w-10 h-10 text-yellow-500/80 mx-auto" />
                <h4 className="text-base text-white">Kosakata Tidak Ditemukan</h4>
                <p className="text-xs text-zinc-400 font-light font-sans max-w-sm mx-auto leading-relaxed">
                  Tidak ada kecocokan kosakata dalam database untuk pencarian kata kunci yang dimasukkan atau kombinasi filter terpilih.
                </p>
                <button
                  onClick={() => {
                    triggerTick(600);
                    setVocabSearchQuery('');
                    setVocabJlptFilter('All');
                    setVocabBabFilter('All');
                    setVocabTypeFilter('All');
                  }}
                  className="text-xs bg-white/10 border border-white/5 font-semibold hover:bg-white/15 px-4 py-2 rounded-full cursor-pointer transition-all"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
                {filteredVocabList.map((word) => (
                  <div key={word.id} className="bg-white/3 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/15 hover:bg-white/5 transition-all group relative overflow-hidden">
                    {/* Background faint color for JLPT types */}
                    <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none" />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        {/* Tags */}
                        <div className="flex gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                            word.jlpt === 'N5' 
                              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/10'
                              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/10'
                          }`}>
                            {word.jlpt}
                          </span>
                          <span className="text-[9px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/10 px-2 py-0.5 rounded-md">
                            Bab {word.bab}
                          </span>
                          <span className="text-[9px] font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/10 px-2 py-0.5 rounded-md">
                            {word.type}
                          </span>
                        </div>
                        
                        {/* Audio speaker trigger */}
                        <button
                          onClick={() => speakText(word.jp)}
                          className="p-1 px-1.5 h-7 w-7 rounded-lg border border-indigo-500/25 bg-indigo-550/10 hover:bg-indigo-500 hover:text-white text-indigo-300 active:scale-90 transition-all flex items-center justify-center cursor-pointer shrink-0 animate-pulse"
                          title="Lafalkan Suara Asli (TTS)"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-xl font-display text-white group-hover:text-yellow-300 transition-colors font-semibold tracking-wide">
                          {word.jp}
                        </h4>
                        <p className="text-xs font-mono text-zinc-300 font-semibold tracking-wide">
                          {word.rom}
                        </p>
                      </div>

                      <div className="border-t border-white/5 pt-2">
                        <p className="text-sm font-sans text-zinc-200">
                          {word.translation}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-sans italic font-light mt-1 leading-relaxed">
                          {word.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 5: INTERACTIVE ADAPTIVE QUIZ ENGINE PRO */}
      {/* ======================================================== */}
      {activeTab === 'quiz' && (
        <div id="classroom-quiz-engine-module" className="animate-fade-rise space-y-6">
          <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/5 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
              <div>
                <h2 className="text-3xl font-display text-white font-normal mb-1">
                  Quiz Engine Pro
                </h2>
                <p className="text-xs text-zinc-400 font-light font-sans leading-relaxed max-w-xl">
                  Uji kemampuan bahasa Jepang N5 - N4 dengan sistem kuis interaktif adaptif. Makin tinggi akurasi Anda, level kesulitan akan otomatis meningkat: waktu makin cepat, tantangan makin menantang!
                </p>
              </div>

              {/* Stats Badge */}
              <div className="flex gap-2 text-left">
                <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 block">Metode Belajar</span>
                    <span className="text-xs font-mono font-bold text-white">Kurikulum Minna No Nihongo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* idle state: configuring quiz */}
            {!quizActive && !showQuizSummary && (
              <div id="quiz-config-panel" className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center py-4">
                  <Sparkles className="w-12 h-12 text-yellow-350 mx-auto animate-pulse mb-3" />
                  <h3 className="text-xl font-display text-white">Konstruksi Sesi Kuis Anda</h3>
                  <p className="text-xs text-zinc-400 font-light font-sans max-w-md mx-auto mt-1">
                    Pilih target tingkat kelulusan, jangkauan bab pelajaran, dan mode tantangan yang sesuai dengan kebutuhan belajar Anda saat ini.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/2 border border-white/5 p-6 rounded-3xl">
                  
                  {/* Mode Selector */}
                  <div className="space-y-3 text-left">
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold block">1. Mode Kuis</span>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => { triggerTick(440); setQuizMode('standard'); }}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                          quizMode === 'standard'
                            ? 'bg-white border-white text-slate-950 font-bold shadow-md'
                            : 'bg-white/3 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold">Paket Standard 10 Soal</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold uppercase ${
                            quizMode === 'standard' ? 'bg-slate-950 text-white' : 'bg-white/10 text-zinc-350'
                          }`}>Relaxed</span>
                        </div>
                        <p className="text-[11px] font-light leading-relaxed opacity-80">
                          Selesaikan 10 butir pertanyaan acak. Membantu menguji pemahaman bab terpilih secara teratur.
                        </p>
                      </button>

                      <button
                        onClick={() => { triggerTick(440); setQuizMode('survival'); }}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                          quizMode === 'survival'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 font-bold'
                            : 'bg-white/3 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold">Survival Mode (Endless)</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold uppercase ${
                            quizMode === 'survival' ? 'bg-rose-500 text-white animate-pulse' : 'bg-rose-500/20 text-rose-400'
                          }`}>High Stakes</span>
                        </div>
                        <p className="text-[11px] font-light leading-relaxed opacity-80">
                          Ujian tak berujung dengan 3 Nyawa (Hearts). Level permainan akan naik dan waktu countdown menyusut setiap 3 jawaban benar berturut-turut!
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Level JLPT filter */}
                  <div className="space-y-3 text-left">
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold block">2. Standard JLPT</span>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'All', title: 'Gabungan N5 & N4', desc: 'Seluruh materi 25 bab kurikulum industri secara terintegrasi.', levelColor: 'bg-indigo-500/10 text-indigo-350' },
                        { id: 'N5', title: 'Tingkat Pemula (JLPT N5)', desc: 'Materi Bab 1 s.d 12. Fokus pada kalimat esensial, partikel dasar, kata tunjuk.', levelColor: 'bg-rose-500/10 text-rose-450' },
                        { id: 'N4', title: 'Tingkat Mahir (JLPT N4)', desc: 'Materi Bab 13 s.d 25. Pola pengandaian, kalimat pasif, kausatif, konjungsi rumit.', levelColor: 'bg-emerald-500/10 text-emerald-300' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => { triggerTick(440); setQuizJlptFilter(item.id as any); }}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                            quizJlptFilter === item.id
                              ? 'bg-white border-white text-slate-950 font-bold shadow-md'
                              : 'bg-white/3 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-semibold">{item.title}</span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-semibold ${item.levelColor}`}>
                              {item.id === 'All' ? 'Campur' : item.id}
                            </span>
                          </div>
                          <p className="text-[10px] font-light leading-relaxed text-zinc-400">
                            {item.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chapter range filter */}
                  <div className="space-y-3 text-left">
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold block">3. Jangkauan Bab</span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        { id: 'All', title: 'Semua Bab (1 - 25)' },
                        { id: '1-5', title: 'Bab Klasik Pemula (1 - 5)' },
                        { id: '6-10', title: 'Bab Menengah Sesi 1 (6 - 10)' },
                        { id: '11-15', title: 'Peralihan JLPT N5 ke N4 (11 - 15)' },
                        { id: '16-20', title: 'Pola Kompleks N4 (16 - 20)' },
                        { id: '21-25', title: 'Ujian Akhir Spesialis (21 - 25)' }
                      ].map((range) => (
                        <button
                          key={range.id}
                          onClick={() => { triggerTick(440); setQuizBabFilterRange(range.id); }}
                          className={`p-3 rounded-2xl border text-left text-xs cursor-pointer transition-all flex items-center justify-between ${
                            quizBabFilterRange === range.id
                              ? 'bg-white border-white text-slate-950 font-bold shadow-md'
                              : 'bg-white/3 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span>{range.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Big Action CTA */}
                <div className="text-center pt-4">
                  <button
                    onClick={startQuizEngine}
                    className="bg-indigo-600 border border-indigo-500/50 hover:bg-indigo-500 text-white px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-wider shadow-xl hover:scale-[1.03] active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Award className="w-5 h-5 animate-spin-slow" /> Mulai Sesi Kuis Interaktif
                  </button>
                </div>
              </div>
            )}

            {/* active quiz gameplay board */}
            {quizActive && quizQuestionsList.length > 0 && (() => {
              const currentItem = quizQuestionsList[quizCurrentIndex];
              if (!currentItem) return null;
              
              const timerPercentage = (quizTimeLeft / quizMaxTime) * 100;
              
              // Get timer color dynamically based on ratio of time left
              let timerBg = 'bg-emerald-400';
              if (timerPercentage <= 30) timerBg = 'bg-rose-500 animate-pulse';
              else if (timerPercentage <= 60) timerBg = 'bg-amber-400';

              return (
                <div id="quiz-active-running-board" className="max-w-2xl mx-auto space-y-6 animate-fade-rise">
                  
                  {/* Status panel */}
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-white/2 border border-white/5 rounded-3xl p-4 gap-3">
                    <div className="text-left px-1">
                      <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider block">Pertanyaan</span>
                      <span className="text-sm font-bold text-white font-mono">
                        {quizMode === 'standard' ? `${quizCurrentIndex + 1} / ${quizQuestionsList.length}` : `Ke-${quizCurrentIndex + 1} (Endless)`}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      {/* Interactive Heart Lives (Survival mode only) */}
                      {quizMode === 'survival' && (
                        <div className="flex gap-1 bg-rose-500/10 border border-rose-500/10 px-3 py-1.5 rounded-xl">
                          {Array.from({ length: 3 }).map((_, idx) => (
                            <span 
                              key={idx} 
                              className={`text-sm transition-all duration-300 ${
                                idx < quizHearts ? 'text-rose-500 scale-100' : 'text-zinc-650 scale-90 grayscale opacity-40'
                              }`}
                            >
                              ♥
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Mastery Difficulty Level */}
                      <div className="bg-indigo-500/10 border border-indigo-500/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-left">
                        <Brain className="w-3.5 h-3.5 text-indigo-400" />
                        <div>
                          <span className="text-[8px] text-zinc-500 uppercase font-mono block">Mastery Lvl</span>
                          <span className="text-xs text-white font-bold font-mono">Lvl {quizDifficultyLevel}</span>
                        </div>
                      </div>

                      {/* Score tracker */}
                      <div className="bg-emerald-500/10 border border-emerald-500/10 px-3 py-1.5 rounded-xl text-left">
                        <span className="text-[8px] text-zinc-500 uppercase font-mono block">Skor</span>
                        <span className="text-xs text-emerald-400 font-bold font-mono">{quizScore} Pt</span>
                      </div>

                      {/* Streak streak fire */}
                      {quizStreak > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/10 px-3 py-1.5 rounded-xl flex items-center gap-1">
                          <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
                          <span className="text-xs text-amber-450 font-bold font-mono">x{quizStreak}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timer Bar container */}
                  <div className="w-full bg-slate-950/80 border border-white/5 h-2.5 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full transition-all duration-1000 ease-linear ${timerBg}`}
                      style={{ width: `${timerPercentage}%` }}
                    />
                  </div>

                  {/* Question Card */}
                  <div className="bg-white/4 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 bg-white/5 border-b border-l border-white/5 rounded-bl-xl text-[9px] font-mono text-zinc-400 hidden sm:block">
                      Bab {currentItem.lessonId} : {currentItem.judulBab} ({currentItem.jlpt})
                    </div>
                    
                    <div className="space-y-2 text-center pt-2 md:pt-4">
                      <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold block sm:hidden">Bab {currentItem.lessonId} : {currentItem.judulBab}</span>
                      <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold hidden sm:block">SOAL KUIS EVALUASI</span>
                      <h3 className="text-lg sm:text-xl font-medium text-white leading-relaxed max-w-lg mx-auto">
                        {currentItem.question}
                      </h3>
                    </div>

                    {/* Multiple choices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      {currentItem.options.map((option, idx) => {
                        const isChosen = quizUserAnswer === option;
                        const isCorrectAnswer = option === currentItem.answer;
                        
                        let optionStyle = 'bg-slate-900/50 hover:bg-slate-900/80 border-white/5 text-zinc-350 hover:text-white';
                        if (quizSubmittedState) {
                          if (isCorrectAnswer) {
                            optionStyle = 'bg-emerald-500/15 border-emerald-500/45 text-emerald-300 font-bold scale-[1.01]';
                          } else if (isChosen) {
                            optionStyle = 'bg-rose-500/15 border-rose-500/45 text-rose-300 font-bold line-through';
                          } else {
                            optionStyle = 'bg-slate-900/30 border-white/5 opacity-50 text-zinc-500';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-white border-white text-slate-950 font-bold scale-[1.01]';
                        }

                        return (
                          <button
                            key={idx}
                            disabled={quizSubmittedState}
                            onClick={() => handleQuizAnswer(option)}
                            className={`p-4 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all ${optionStyle}`}
                          >
                            <div className="flex gap-2.5 items-start">
                              <span className="bg-white/10 shrink-0 font-mono text-[10px] text-zinc-400 px-2 py-0.5 rounded-md">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="leading-snug">{option}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Immediate Evaluation Feedback description */}
                    {quizSubmittedState && (
                      <div className="border-t border-white/5 pt-4 space-y-3 animate-fade-rise text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          {quizFeedback === 'correct' && (
                            <div className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-full font-bold inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Benar (+{10 * quizDifficultyLevel} Pts)
                            </div>
                          )}
                          {quizFeedback === 'incorrect' && (
                            <div className="text-xs bg-rose-500/10 text-rose-350 border border-rose-500/20 px-3 py-1 rounded-full font-bold inline-flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Jawaban Salah
                            </div>
                          )}
                          {quizFeedback === 'timeout' && (
                            <div className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-3 py-1 rounded-full font-bold inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Kehabisan Waktu
                            </div>
                          )}
                          <span className="text-[10px] text-zinc-500 font-sans">Kesulitan: Mastery Level {quizDifficultyLevel}</span>
                        </div>

                        <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl">
                          <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block mb-1">Penjelasan Guru:</span>
                          <p className="text-xs text-zinc-300 leading-relaxed font-sans font-light">
                            {currentItem.explanation}
                          </p>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={handleNextQuizQuestion}
                            className="bg-white text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs hover:bg-zinc-200 transition-all cursor-pointer flex items-center gap-1 shadow-lg"
                          >
                            Pertanyaan Berikutnya <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              );
            })()}

            {/* kuis report summary view */}
            {showQuizSummary && (
              <div id="quiz-session-report-summary" className="space-y-8 animate-fade-rise max-w-4xl mx-auto">
                
                {/* Result header banner */}
                <div className="text-center py-6 space-y-4">
                  <Trophy className="w-16 h-16 text-yellow-300 mx-auto animate-bounce mb-2" />
                  <div className="space-y-1">
                    <h3 className="text-3xl font-display text-white">Sesi Ujian Selesai!</h3>
                    <p className="text-xs text-zinc-400 font-light font-sans max-w-sm mx-auto">
                      Laporan kecakapan hasil pengerjaan kuis adaptif. Terus latih untuk mendongkrak intuisi bekerja di Jepang!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4 text-left">
                    <div className="bg-white/3 border border-white/5 rounded-2xl p-4">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-0.5">Total Skor Masuk</span>
                      <span className="text-2xl font-mono font-bold text-emerald-400 block">{quizScore} Pt</span>
                    </div>

                    <div className="bg-white/3 border border-white/5 rounded-2xl p-4">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-0.5">Mode Ujian</span>
                      <span className="text-sm font-semibold text-white uppercase block mt-1.5">
                        {quizMode === 'standard' ? 'Standard 10' : 'Survival'}
                      </span>
                    </div>

                    <div className="bg-white/3 border border-white/5 rounded-2xl p-4">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-0.5">Skor Akurasi</span>
                      <span className="text-2xl font-mono font-bold text-indigo-300 block">
                        {Math.round((quizRoundHistory.filter(h => h.isCorrect).length / Math.max(1, quizRoundHistory.length)) * 100)}%
                      </span>
                    </div>

                    <div className="bg-white/3 border border-white/5 rounded-2xl p-4">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-0.5">Mastery Tertinggi</span>
                      <span className="text-lg font-bold text-yellow-300 mt-1 block">Lvl {quizDifficultyLevel} / 5</span>
                    </div>
                  </div>
                </div>

                {/* History list for reviews */}
                <div className="space-y-4 text-left border-t border-white/5 pt-6">
                  <h4 className="text-base font-semibold text-white">Review Lembar Jawaban Kuis</h4>
                  
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                    {quizRoundHistory.map((historyItem, idx) => (
                      <div 
                        key={idx} 
                        className={`border rounded-2xl p-5 space-y-3 relative overflow-hidden transition-all ${
                          historyItem.isCorrect 
                            ? 'bg-emerald-500/2 border-emerald-500/10' 
                            : 'bg-rose-500/2 border-rose-500/10'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <span className="text-[8px] bg-white/5 border border-white/5 text-zinc-400 px-2 py-0.5 rounded-md font-mono">
                              Soal {idx + 1} • Bab {historyItem.lessonId} : {historyItem.judulBab}
                            </span>
                            <h5 className="text-sm font-semibold text-white mt-1 leading-relaxed">
                              {historyItem.question}
                            </h5>
                          </div>

                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            historyItem.isCorrect 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'bg-rose-500/10 text-rose-350'
                          }`}>
                            {historyItem.isCorrect ? 'BENAR' : 'SALAH'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-950/40 p-2.5 rounded-xl">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase block mb-0.5">Jawaban Anda:</span>
                            <span className={historyItem.isCorrect ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                              {historyItem.selectedOption || '(Tidak Ada / Waktu Habis)'}
                            </span>
                          </div>

                          <div className="bg-slate-950/40 p-2.5 rounded-xl">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase block mb-0.5">Kunci Jawaban Benar:</span>
                            <span className="text-emerald-400 font-medium">{historyItem.answer}</span>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-400 font-light leading-relaxed pt-2.5 border-t border-white/5 font-sans">
                          <strong className="text-zinc-300 font-semibold uppercase text-[9px] tracking-wider font-mono block mb-1">Review Kelas:</strong>
                          {historyItem.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={() => {
                      triggerTick(440);
                      setShowQuizSummary(false);
                      setQuizActive(false);
                    }}
                    className="bg-white hover:bg-zinc-200 text-slate-950 font-semibold uppercase px-8 py-3.5 rounded-full text-xs shadow-lg transition-all cursor-pointer inline-flex items-center gap-1.5 font-sans"
                  >
                    <RotateCcw className="w-4 h-4" /> Kembali Ke Konfigurasi Kuis
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 4: AUTIS-SUPPORTIVE LEARNING GUIDELINE TABLE */}
      {/* ======================================================== */}
      {activeTab === 'tips' && (
        <div id="classroom-tips-module" className="animate-fade-rise space-y-6">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/5 space-y-6">
            
            <div className="border-b border-white/5 pb-5">
              <h3 className="text-2xl font-display text-white">Panduan Pembelajaran Spesial</h3>
              <p className="text-xs text-zinc-400 font-sans font-light mt-1">
                Kiat asuh & penyampaian materi bahasa Jepang khusus untuk anak asuh autisme, 
                neurodivergen, maupun kesiapan memperoleh visa SSW (Tokutei Ginou) / JLPT N4.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              <div className="bg-white/3 p-6 rounded-2xl border border-white/5 space-y-3">
                <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/10 rounded-full px-2.5 py-1 text-cyan-300 uppercase tracking-widest font-extrabold inline-block">
                  Aids Pendamping Autisme
                </span>
                <p className="text-sm text-zinc-200 font-medium">1. Instruksi Satuan & Mini Langkah (Micro-stepping)</p>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Bagi anak-anak dengan spektrum autisme, hindari memberikan instruksi majemuk. Pecah satu bab menjadi unit kecil (misal: hafal 3 huruf hiragana saja per sesi).
                </p>
                <p className="text-sm text-zinc-200 font-medium pt-2">2. Gunakan Tik Suara Sensorik</p>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Web-app RukaaIjass memancarkan nada gelombang sinus setiap kali intervensi klik ditekan, memperkuat respon stimulasi positif otot memori.
                </p>
              </div>

              <div className="bg-white/3 p-6 rounded-2xl border border-white/5 space-y-3">
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/10 rounded-full px-2.5 py-1 text-emerald-300 uppercase tracking-widest font-extrabold inline-block">
                  Target Karir SSW & JLPT N4
                </span>
                <p className="text-sm text-zinc-200 font-medium">1. Pengenalan Pola Kasual & Sopan Seimbang</p>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Visa SSW (Tokutei Ginou) mewajibkan kelancaran harian di tempat kerja. Melatih respons cepat lewat game "Particle Runner" merangsang intuisi penempatan tatabahasa tanpa berpikir lama.
                </p>
                <p className="text-sm text-zinc-200 font-medium pt-2">2. Target 300 Kanji Utama</p>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Kanji bertahap disarankan dipelajari dengan asimilasi cerita visual radikal (suku pembentuk), bukan menggambar hafalan buta 1000 kali.
                </p>
              </div>

            </div>

            <div className="bg-white/2 border border-white/10 p-6 rounded-2xl text-center max-w-2xl mx-auto space-y-3">
              <Smile className="w-10 h-10 text-white/90 mx-auto" />
              <h4 className="text-lg font-display text-white font-normal">"Guru yang sabar adalah guru yang bersedia mengulang seribu kali dengan senyum yang sama."</h4>
              <p className="text-xs text-zinc-400 font-light font-sans tracking-wide">
                RukaaIjass didesain dengan kejernihan maksimal demi mewujudkan impian kelancaran harian Anda.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
