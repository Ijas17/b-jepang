/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Volume2, BookOpen, Award, Smile, Gamepad2, Check, ChevronRight, 
  Sparkles, RotateCcw, ArrowLeft, Clock, Brain, AlertTriangle, ShieldCheck, Trophy, Globe, Flame, Lock, HelpCircle,
  Search, Languages, LayoutDashboard, Plus, Minus, Layers, Moon
} from 'lucide-react';
import { UNGKAPAN_KELAS_SALAM, VOCABULARY_DATA, PARTICLE_QUESTIONS, SENTENCE_PUZZLES } from '../data';
import { ALL_LESSONS } from '../data/lessonsData';
import { VOCABULARY_DATABASE } from '../data/vocabulary';
import { KANA_DATA } from '../data/kana';
import { lessons } from '../data/curriculum';
import KanaTrainer from './KanaTrainer';
import KanjiLibrary from './KanjiLibrary';
import DailyPlanner from './DailyPlanner';
import Leaderboard from './Leaderboard';
import DigitalFlashcards from './DigitalFlashcards';
import { recordSrsMistake, recordSrsSuccess, getDueSrsItems, SrsItem } from '../utils/srs';

interface ClassroomProps {
  onBackToLanding: () => void;
  isFocusModeActive: boolean;
  onToggleFocusMode: (val: boolean) => void;
}

export default function Classroom({ onBackToLanding, isFocusModeActive, onToggleFocusMode }: ClassroomProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kanatrainer' | 'kana' | 'kanji' | 'materi' | 'vocab' | 'quiz' | 'game' | 'tips' | 'flashcards'>('dashboard');
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
  
  // Automated Study Streak System (TikTok-style daily check-in)
  const [userName, setUserName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ruka_onboarding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nama) return parsed.nama;
      }
    } catch (e) {}
    return 'Gakusei (Anda)';
  });

  const [studiedToday, setStudiedToday] = useState<boolean>(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return localStorage.getItem('n4_studied_today_date') === todayStr;
  });

  const [showCelebrationToast, setShowCelebrationToast] = useState<boolean>(false);
  const [celebrationMessage, setCelebrationMessage] = useState<string>('');

  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem('n4_streak_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // System-audited completed lesson sub-modules
  const [completedSections, setCompletedSections] = useState<Record<number, string[]>>(() => {
    const saved = localStorage.getItem('n4_completed_sections');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    // Clean starting state for new students (0% progress on all lessons):
    const initial: Record<number, string[]> = {};
    for (let i = 1; i <= 25; i++) {
      initial[i] = [];
    }
    return initial;
  });

  const lessonCompletion = React.useMemo(() => {
    const completion: Record<number, number> = {};
    for (let i = 1; i <= 25; i++) {
      const completed = completedSections[i] || [];
      completion[i] = Math.round((completed.length / 6) * 100);
    }
    return completion;
  }, [completedSections]);

  const markSectionCompleted = (lessonId: number, sectionId: string) => {
    setCompletedSections(prev => {
      const current = prev[lessonId] || [];
      if (current.includes(sectionId)) return prev;
      const updated = {
        ...prev,
        [lessonId]: [...current, sectionId]
      };
      localStorage.setItem('n4_completed_sections', JSON.stringify(updated));
      addXP(5); // +5 XP reward for system study progress!
      
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      const previouslyStudied = localStorage.getItem('n4_studied_today_date') === todayStr;
      if (!previouslyStudied) {
        localStorage.setItem('n4_studied_today_date', todayStr);
        setStudiedToday(true);
        setCelebrationMessage(`Selamat! Aktivitas belajar Anda tercatat untuk hari ini. Streak ${streakCount} Hari Anda aman dan aman dari reset! +5 XP Bonus.`);
        setShowCelebrationToast(true);
      }
      
      return updated;
    });
  };

  const [weeklyAttendance, setWeeklyAttendance] = useState<Record<string, boolean>>({
    'Senin': false,
    'Selasa': false,
    'Rabu': false,
    'Kamis': false,
    'Jumat': false,
    'Sabtu': false,
    'Minggu': false,
  });

  // State for User Progress Store
  const [userXP, setUserXP] = useState<number>(() => {
    const saved = localStorage.getItem('n4_user_xp');
    return saved ? parseInt(saved, 10) : 0; // starts with 0 XP for cleaner progression
  });
  const [userLevel, setUserLevel] = useState<number>(() => {
    const saved = localStorage.getItem('n4_user_level');
    return saved ? parseInt(saved, 10) : 1; // starts with level 1
  });
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('n4_user_badges');
    return saved ? JSON.parse(saved) : []; // brand new student starts with zero badges
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

  // Automated study attendance checking on load
  useEffect(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const lastActiveDate = localStorage.getItem('n4_streak_last_active_date');
    const savedStreak = localStorage.getItem('n4_streak_count');
    const currentStreak = savedStreak ? parseInt(savedStreak, 10) : 3;

    let newStreak = currentStreak;

    if (!lastActiveDate) {
      newStreak = 1;
      localStorage.setItem('n4_streak_count', '1');
      localStorage.setItem('n4_streak_last_active_date', todayStr);
      setStreakCount(1);
      setCelebrationMessage("Konnichiwa! 🌸 Selamat datang di Kelas Jepang Ruka. Kehadiran perdana Anda hari ini telah dicatat otomatis. Selesaikan materi untuk mengunci streak Anda!");
      setShowCelebrationToast(true);
    } else if (lastActiveDate === todayStr) {
      newStreak = currentStreak;
      setStreakCount(currentStreak);
      setCelebrationMessage(`Okaeri! Konnichiwa kembali, ${userName}! 🌸 Streak belajar ${currentStreak} Hari Anda saat ini sukses dipertahankan, terkunci aman oleh sistem. Mari lanjutkan perjuangan!`);
      setShowCelebrationToast(true);
    } else if (lastActiveDate === yesterdayStr) {
      newStreak = currentStreak + 1;
      localStorage.setItem('n4_streak_count', newStreak.toString());
      localStorage.setItem('n4_streak_last_active_date', todayStr);
      setStreakCount(newStreak);
      addXP(10); // Reward active user!
      setCelebrationMessage(`Konnichiwa! 🎉 Streak kehadiran berhasil dipertahankan setelah melewati jam 00:00! Streak Anda naik menjadi ${newStreak} Hari berturut-turut! Tetap semangat belajar. (+10 XP)`);
      setShowCelebrationToast(true);
    } else {
      newStreak = 1;
      localStorage.setItem('n4_streak_count', '1');
      localStorage.setItem('n4_streak_last_active_date', todayStr);
      setStreakCount(1);
      setCelebrationMessage("Yah, streak belajar Anda padam karena tidak berkunjung kemarin 😢. Tapi tidak apa-apa, mari bangun streak baru yang lebih kuat mulai hari ini!");
      setShowCelebrationToast(true);
    }

    // Badge triggers
    if (newStreak >= 13) {
      unlockBadge('Streak Pemula 🔥');
    }

    // Refresh weekly check-in list
    const dayNamesIndonesian = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const todayDayName = dayNamesIndonesian[today.getDay()];

    const savedWeekly = localStorage.getItem('n4_weekly_attendance');
    let weekly: Record<string, boolean> = savedWeekly ? JSON.parse(savedWeekly) : {
      'Senin': false,
      'Selasa': false,
      'Rabu': false,
      'Kamis': false,
      'Jumat': false,
      'Sabtu': false,
      'Minggu': false,
    };

    if (todayDayName === 'Senin' && lastActiveDate !== todayStr) {
      weekly = {
        'Senin': true,
        'Selasa': false,
        'Rabu': false,
        'Kamis': false,
        'Jumat': false,
        'Sabtu': false,
        'Minggu': false,
      };
    } else {
      weekly[todayDayName] = true;
    }

    localStorage.setItem('n4_weekly_attendance', JSON.stringify(weekly));
    setWeeklyAttendance(weekly);
  }, []);

  // Automatically mark section as completed as the user studies the modular sections
  useEffect(() => {
    if (activeTab === 'materi') {
      markSectionCompleted(selectedLesson, activeSectionUnderLesson);
    }
  }, [activeTab, selectedLesson, activeSectionUnderLesson]);

  useEffect(() => {
    if (streakCount >= 13) {
      unlockBadge('Streak Pemula 🔥');
    }
  }, [streakCount]);

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
  const [quizMode, setQuizMode] = useState<'standard' | 'survival' | 'srs'>('standard');
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
    srsItem?: SrsItem;
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

    if (quizMode === 'srs') {
      const dueItems = getDueSrsItems();
      if (dueItems.length === 0) {
        triggerTick(150);
        return;
      }
      
      const srsQuestions = dueItems.map(item => {
        let opts = item.options || [];
        if (opts.length === 0) {
          const correct = item.correct;
          const fallbacks = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'shi', 'su', 'se', 'so', 'ta', 'chi', 'to', 'na', 'ni', 'nu', 'ne', 'no'];
          const filtered = fallbacks.filter(f => f !== correct);
          const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 3);
          opts = [...shuffled, correct].sort(() => 0.5 - Math.random());
        }

        return {
          question: `${item.question}${item.translation ? ` (${item.translation})` : ''}`,
          options: opts,
          answer: item.correct,
          explanation: item.explanation || `Pecahan kuis Spaced Repetition untuk memperkuat hafalan kata "${item.question}".`,
          lessonId: item.box, // map Box to lessonId
          judulBab: `Leitner Box ${item.box}`,
          jlpt: item.type === 'kana' ? 'Kana' : 'N5',
          srsItem: item
        };
      });

      setQuizQuestionsList(srsQuestions);
      setQuizCurrentIndex(0);
      setQuizScore(0);
      setQuizStreak(0);
      setQuizHearts(3);
      setQuizDifficultyLevel(2);
      
      setQuizMaxTime(25);
      setQuizTimeLeft(25);
      
      setQuizSubmittedState(false);
      setQuizUserAnswer('');
      setQuizFeedback(null);
      setShowQuizSummary(false);
      setQuizRoundHistory([]);
      setQuizActive(true);
      return;
    }

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
      speakText(currentQuestion.answer);

      if (currentQuestion.srsItem) {
        recordSrsSuccess(currentQuestion.srsItem.id);
      }

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
      speakText(currentQuestion.answer);

      if (currentQuestion.srsItem) {
        const s = currentQuestion.srsItem;
        recordSrsMistake({
          id: s.id,
          type: s.type,
          question: s.question,
          correct: s.correct,
          translation: s.translation,
          explanation: s.explanation,
          options: s.options,
          scrambledWords: s.scrambledWords,
          correctOrder: s.correctOrder
        });
      }

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

    if (currentQuestion.srsItem) {
      const s = currentQuestion.srsItem;
      recordSrsMistake({
        id: s.id,
        type: s.type,
        question: s.question,
        correct: s.correct,
        translation: s.translation,
        explanation: s.explanation,
        options: s.options,
        scrambledWords: s.scrambledWords,
        correctOrder: s.correctOrder
      });
    }

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
    speakText(character);
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
      recordSrsMistake({
        id: `speedrun_${currentQuestion.char}`,
        type: 'kana',
        question: currentQuestion.char,
        correct: currentQuestion.correct,
        explanation: `Pembacaan romaji yang benar untuk karakter "${currentQuestion.char}" adalah "${currentQuestion.correct}".`
      });
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
      
      {/* Dynamic Celebration Toast Modal */}
      {showCelebrationToast && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950 border-2 border-amber-500/50 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(245,158,11,0.3)] text-center space-y-6 transform animate-bounce-short relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Glowing Icon Header */}
            <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl scale-125 animate-pulse" />
              <div className="w-18 h-18 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-4xl shadow-lg relative">
                🔥
              </div>
            </div>

            {/* Celebration title */}
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-450/15 px-3 py-1 rounded-full border border-amber-400/20">
                SINKRONISASI STREAK SELESAI
              </span>
              <h2 className="text-xl font-display font-medium text-white pt-2">
                STREAK KEHADIRAN AKTIF!
              </h2>
            </div>

            <p className="text-sm text-zinc-350 font-light leading-relaxed relative z-10 font-sans">
              {celebrationMessage}
            </p>

            {/* Extra Motivation Line */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between text-left relative z-10 font-mono">
              <div>
                <span className="text-[9px] text-zinc-500 block uppercase font-bold">Kategori Status</span>
                <span className="text-xs text-white font-bold">🔥 {streakCount} Hari Nyala</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-zinc-500 block uppercase font-bold">XP Diperoleh</span>
                <span className="text-xs text-amber-400 font-bold font-mono">+10 XP</span>
              </div>
            </div>

            <button
              onClick={() => {
                triggerTick(880);
                setShowCelebrationToast(false);
              }}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-550 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer hover:scale-102 active:scale-98"
            >
              Lanjutkan Belajar 🌸
            </button>
          </div>
        </div>
      )}
      
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

        {/* User stats widget & Mode Fokus button (streak reward motivation and focus control) */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
          <button
            onClick={() => {
              triggerTick(523);
              onToggleFocusMode(!isFocusModeActive);
            }}
            className={`p-3 px-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider ${
              isFocusModeActive
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-black'
                : 'bg-white/5 border-white/5 text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
            title={isFocusModeActive ? 'Matikan Mode Fokus' : 'Aktifkan Mode Fokus'}
          >
            <Moon className={`w-4 h-4 ${isFocusModeActive ? 'text-amber-400 animate-pulse' : ''}`} />
            <span>{isFocusModeActive ? 'Fokus Aktif' : 'Mode Fokus'}</span>
          </button>

          <div className="flex items-center gap-3 bg-white/3 p-3 rounded-2xl border border-white/5">
            <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Streak Harian</span>
              <span className="text-xs text-white font-mono font-bold">{streakCount} Hari Berturut</span>
            </div>
          </div>
        </div>

      </div>

      {/* Classroom Segmentation Navigation Panels */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-3 mb-8">
        {[
          { id: 'dashboard', label: 'Dashboard Kelas Pro', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'kanatrainer', label: 'Kana Trainer Pro', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
          { id: 'kana', label: 'Tabel Kana Lengkap', icon: <Globe className="w-4 h-4" /> },
          { id: 'kanji', label: 'Perpustakaan Kanji', icon: <Brain className="w-4 h-4 text-sky-450 animate-pulse" /> },
          { id: 'materi', label: 'Materi Komplit & Detail', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'vocab', label: 'Kamus Kosakata N5-N4', icon: <Languages className="w-4 h-4" /> },
          { id: 'flashcards', label: 'Flashcards Cerdas', icon: <Layers className="w-4 h-4 text-amber-400" /> },
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
        
        // Dynamic Chapter/Vocabulary Completion helpers
        const getChapterCompletion = (start: number, end: number) => {
          let sectionCount = 0;
          for (let i = start; i <= end; i++) {
            const completed = completedSections[i] || [];
            if (completed.includes('kosakata')) {
              sectionCount += 1;
            }
          }
          const maxSec = (end - start + 1);
          return Math.round((sectionCount / maxSec) * 100);
        };

        const chartData = [
          { name: "Bab 1-5", value: getChapterCompletion(1, 5) },
          { name: "Bab 6-10", value: getChapterCompletion(6, 10) },
          { name: "Bab 11-15", value: getChapterCompletion(11, 15) },
          { name: "Bab 16-20", value: getChapterCompletion(16, 20) },
          { name: "Bab 21-25", value: getChapterCompletion(21, 25) }
        ];

        const getY = (val: number) => 150 - (val / 100) * 110;

        const p1_y = getY(chartData[0].value);
        const p2_y = getY(chartData[1].value);
        const p3_y = getY(chartData[2].value);
        const p4_y = getY(chartData[3].value);
        const p5_y = getY(chartData[4].value);

        const linePath = `M 40 ${p1_y} L 140 ${p2_y} L 240 ${p3_y} L 340 ${p4_y} L 440 ${p5_y}`;
        const areaPath = `M 40 ${p1_y} L 140 ${p2_y} L 240 ${p3_y} L 340 ${p4_y} L 440 ${p5_y} L 440 150 L 40 150 Z`;

        // Calculate lesson stats
        let fullCount = 0;
        let partialCount = 0;
        let unstartedCount = 0;

        for (let i = 1; i <= 25; i++) {
          const percent = lessonCompletion[i] || 0;
          if (percent === 100) fullCount++;
          else if (percent > 0) partialCount++;
          else unstartedCount++;
        }

        // Leaderboard competitors lists
        const competitors = [
          { name: "Tanaka-sensei 🇯🇵", location: "Tokyo", xp: 2450, streak: 42, icon: "🥇" },
          { name: "Yuki Sato 🌸", location: "Kyoto", xp: 1980, streak: 29, icon: "🥈" },
          { name: `${userName} (Anda)`, location: "ID", xp: userXP, streak: streakCount, icon: "⚡", isUser: true },
          { name: "Kenji-kun 🚄", location: "Osaka", xp: 850, streak: 14, icon: "🥉" },
          { name: "Sakura-chan ❄️", location: "Hokkaido", xp: 420, streak: 9, icon: "🎯" }
        ];

        const sortedLeaderboard = [...competitors].sort((a, b) => b.xp - a.xp);
        const userRankIndex = sortedLeaderboard.findIndex(item => item.isUser);
        
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

        return (
          <div id="classroom-dashboard-module" className="animate-fade-rise space-y-8">
            {/* STREAK SAFEGUARD REMINDER BANNER */}
            {!studiedToday ? (
              <div className="bg-gradient-to-r from-amber-500/15 via-red-500/10 to-transparent border border-amber-500/30 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-amber-500/5 animate-pulse-slow">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400 shrink-0">
                    <Flame className="w-6 h-6 text-amber-500 animate-bounce" />
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-450/15 px-2 py-0.5 rounded-full">Belum Belajar Hari Ini</span>
                      <h4 className="text-sm font-bold text-white">⚠️ Amankan Streak Harian Anda Sekarang!</h4>
                    </div>
                    <p className="text-xs text-zinc-300 font-light max-w-2xl leading-relaxed">
                      Sistem belum mendeteksi aktivitas belajar Anda hari ini. Buka tab <strong>Materi Belajar</strong> dan selesaikan minimal 1 sub-materi hari ini sebelum jam <strong>00:00</strong> tengah malam untuk menjaga streak <strong>{streakCount} Hari</strong> Anda tetap aktif!
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    triggerTick(580);
                    setActiveTab('materi');
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer hover:scale-103 shrink-0 text-center"
                >
                  Belajar Materi Baru ✨
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-emerald-500/15 via-indigo-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-emerald-500/5">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded-full">Aman & Terverifikasi</span>
                      <h4 className="text-sm font-bold text-white">🎉 Hebat, {userName}! Streak Belajar Anda Aman Hari Ini</h4>
                    </div>
                    <p className="text-xs text-zinc-300 font-light max-w-2xl leading-relaxed">
                      Luar biasa! Progres Anda sudah terverifikasi sistem hari ini. Streak <strong>{streakCount} Hari</strong> Anda telah dikunci oleh sistem dan aman dari reset pergantian hari nanti.
                    </p>
                  </div>
                </div>
                <div className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/15 shrink-0 select-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>TERVERIFIKASI SISTEM 00:00 SAFE</span>
                </div>
              </div>
            )}

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

                {/* Reset Progress Action */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[9px] text-zinc-500 leading-tight">Mulai belajar dari nol?</span>
                  <button
                    onClick={() => {
                      const confirmReset = window.confirm("Apakah Anda yakin ingin meriset semua progres belajar dan kembali menjadi murid baru? Langkah ini tidak dapat dibatalkan.");
                      if (confirmReset) {
                        try {
                          const keysToClear = [
                            'ruka_onboarding',
                            'n4_studied_today_date',
                            'n4_streak_count',
                            'n4_completed_sections',
                            'n4_user_xp',
                            'n4_user_level',
                            'n4_user_badges',
                            'n4_streak_last_active_date',
                            'n4_weekly_attendance',
                            'n4_planner_goals',
                            'ruka_flashcard_progress',
                            'ruka_srs_mistakes'
                          ];
                          keysToClear.forEach(key => localStorage.removeItem(key));
                          window.location.reload();
                        } catch (e) {
                          alert("Gagal meriset data progres.");
                        }
                      }
                    }}
                    className="text-[9px] text-red-400/80 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 px-2.5 py-1 rounded-lg transition-all font-mono font-bold uppercase tracking-wider cursor-pointer active:scale-95 shrink-0"
                  >
                    ⚠️ Riset Progres
                  </button>
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
                      Konsistensi belajar harian. Kehadiran dicatat otomatis oleh sistem setiap hari saat Anda belajar.
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
                    <div
                      key={day}
                      className={`p-2.5 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-between gap-1.5 select-none ${
                        checked 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                          : 'bg-white/2 border-white/5 text-zinc-500'
                      }`}
                    >
                      <span className="text-[8px] font-semibold tracking-wider uppercase font-sans">{day.slice(0, 3)}</span>
                      
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        checked 
                          ? 'bg-amber-500 border-amber-400 text-slate-950 scale-105' 
                          : 'bg-slate-950/45 border-white/10 text-transparent'
                      }`}>
                      {checked && <Check className="w-3 stroke-[3]" />}
                      </div>
                    </div>
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

            {/* NEW SECTION: DATA VISUALIZATION AND LEADERBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              
              {/* ANALYTICS VISUALIZER PANEL */}
              <div className="liquid-glass rounded-3xl p-6 border border-white/5 space-y-6 text-left">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-indigo-400 block">PROGRES OTOMATIS TERVERIFIKASI</span>
                  <h3 className="text-lg font-display text-white font-normal flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" /> Grafik Analitik Penguasaan Kosakata
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-light leading-snug">
                    Berdasarkan porsi sub-bab kosakata yang dicatat otomatis oleh kecerdasan sistem saat Anda aktif belajar.
                  </p>
                </div>

                {/* Responsive SVG Step Progress Area Chart */}
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                  <svg viewBox="0 0 480 180" className="w-full h-auto text-indigo-400 select-none">
                    {/* Definitions for beautiful glow gradients */}
                    <defs>
                      <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
                      </linearGradient>
                      <filter id="neonShadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.4" />
                      </filter>
                    </defs>

                    {/* Horizontal grid guide lines */}
                    <line x1="40" y1="40" x2="440" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    <text x="35" y="44" className="text-[8px] fill-zinc-650 outline-none text-right font-mono" textAnchor="end">100%</text>

                    <line x1="40" y1="95" x2="440" y2="95" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    <text x="35" y="99" className="text-[8px] fill-zinc-650 outline-none text-right font-mono" textAnchor="end">50%</text>

                    <line x1="40" y1="150" x2="440" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <text x="35" y="154" className="text-[8px] fill-zinc-650 outline-none text-right font-mono" textAnchor="end">0%</text>

                    {/* Shaded Area and Line */}
                    <path d={areaPath} fill="url(#areaGlow)" />
                    <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2.5" filter="url(#neonShadow)" />

                    {/* Circular points with custom tooltip triggers */}
                    {[
                      { x: 40, y: p1_y, label: "Bab 1-5", val: chartData[0].value },
                      { x: 140, y: p2_y, label: "Bab 6-10", val: chartData[1].value },
                      { x: 240, y: p3_y, label: "Bab 11-15", val: chartData[2].value },
                      { x: 340, y: p4_y, label: "Bab 16-20", val: chartData[3].value },
                      { x: 440, y: p5_y, label: "Bab 21-25", val: chartData[4].value },
                    ].map((pt, index) => (
                      <g key={index} className="group cursor-help">
                        <circle cx={pt.x} cy={pt.y} r="5" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2.5" className="transition-all duration-300 hover:r-7" />
                        <text x={pt.x} y={pt.y - 10} className="text-[9px] fill-white font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 duration-200" textAnchor="middle">
                          {pt.val}%
                        </text>
                        <text x={pt.x} y="166" className="text-[9px] fill-zinc-500 font-sans" textAnchor="middle">
                          {pt.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Lesson breakdown ratios */}
                <div className="space-y-3.5 bg-slate-950/25 border border-white/5 p-4 rounded-2xl">
                  <div className="flex justify-between items-center text-[10px] uppercase font-mono font-bold text-zinc-500">
                    <span>Sebaran Target Kelulusan Bab N4-N5</span>
                    <span>Progres Kumulatif</span>
                  </div>

                  {/* Horizontal visual breakdown stacks */}
                  <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden flex border border-white/5 p-0.5">
                    {fullCount > 0 && <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(fullCount / 25) * 100}%` }} title={`Selesai: ${fullCount}`} />}
                    {partialCount > 0 && <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(partialCount / 25) * 100}%` }} title={`Sedang Belajar: ${partialCount}`} />}
                    {unstartedCount > 0 && <div className="h-full bg-zinc-800 transition-all duration-500" style={{ width: `${(unstartedCount / 25) * 100}%` }} title={`Belum Dimulai: ${unstartedCount}`} />}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
                      <span className="text-[9px] text-zinc-500 block uppercase font-mono">Tuntas (100%)</span>
                      <span className="text-sm font-mono font-bold text-emerald-400">{fullCount} Bab</span>
                    </div>
                    <div className="bg-indigo-500/5 p-2 rounded-xl border border-indigo-500/10">
                      <span className="text-[9px] text-zinc-500 block uppercase font-mono">Dalam Progres</span>
                      <span className="text-sm font-mono font-bold text-indigo-400">{partialCount} Bab</span>
                    </div>
                    <div className="bg-zinc-850 p-2 rounded-xl border border-white/2">
                      <span className="text-[9px] text-zinc-500 block uppercase font-mono">Belum Dibuka</span>
                      <span className="text-sm font-mono font-bold text-zinc-400">{unstartedCount} Bab</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* GLOBAL LEADERBOARD WIDGET */}
              <Leaderboard userXP={userXP} streakCount={streakCount} />

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
                
                {/* Auto qualification explanation */}
                <div className="bg-indigo-550/10 border border-indigo-500/15 p-3 px-4 rounded-2xl text-left hidden sm:flex items-center gap-2 max-w-sm shrink-0">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-[10px] text-zinc-350 leading-normal font-sans">
                    <strong>Evaluasi Sistem Aktif:</strong> Pelajari tiap tab materi (kosakata, pola, dialog, latihan, kuis) untuk mengisinya secara otomatis. Bebas manipulasi!
                  </span>
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

                      {/* Middle row: System evaluated completed sections */}
                      <div className="space-y-2.5 bg-slate-950/40 p-3 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-500">Evaluasi Sistem</span>
                          <span className={isFinished ? 'text-emerald-400 font-bold' : 'text-zinc-350'}>
                            {percent === 100 ? 'Lulus Sempurna ✨' : `${percent}% Tuntas`}
                          </span>
                        </div>
                        
                        {/* Micro Progress Blocks for 6 segments */}
                        <div className="grid grid-cols-6 gap-1">
                          {[
                            { id: 'kosakata', label: 'Kosakata', symbol: '📖' },
                            { id: 'tata', label: 'Tata', symbol: '✍️' },
                            { id: 'dialog', label: 'Dialog', symbol: '💬' },
                            { id: 'latihan', label: 'Latih', symbol: '🧱' },
                            { id: 'kuis', label: 'Kuis', symbol: '❓' },
                            { id: 'review', label: 'Kultur', symbol: '⛩️' }
                          ].map(seg => {
                            const isSegDone = (completedSections[les.id] || []).includes(seg.id);
                            return (
                              <div 
                                key={seg.id}
                                title={`${seg.label}: ${isSegDone ? 'Sudah Dipelajari' : 'Belum Dipelajari'}`}
                                className={`text-[9px] py-1 rounded text-center transition-all flex flex-col items-center justify-center font-mono ${
                                  isSegDone 
                                    ? 'bg-emerald-500/15 text-emerald-355 border border-emerald-500/20 font-bold' 
                                    : 'bg-white/2 text-zinc-600 border border-transparent'
                                }`}
                              >
                                <span className={isSegDone ? 'opacity-100 scale-110' : 'opacity-40 grayscale'}>{seg.symbol}</span>
                              </div>
                            );
                          })}
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
        <div id="classroom-kanji-library-module" className="animate-fade-rise space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-2xl p-3.5 px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
              <div className="text-left">
                <span className="text-xs font-bold block">💡 Mode Belajar Cepat (Flashcards)</span>
                <span className="text-[10px] text-zinc-400 font-light block">Sekarang kamu bisa berlatih menghafal ⛩️ Kanji & 📖 Kosakata dengan animasi flip 3D berjadwal!</span>
              </div>
            </div>
            <button
              onClick={() => { triggerTick(523); setActiveTab('flashcards'); }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer hover:scale-102 shrink-0 shadow-lg"
            >
              Buka Flashcards
            </button>
          </div>
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
              
              {kanaSubTab === 'kombinasi' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto w-full text-left">
                  {(() => {
                    const items = KANA_DATA[kanaType].kombinasi;
                    const labels = kanaType === 'hiragana' ? [
                      { base: 'き (ki)', family: 'Kya • Kyu • Kyo' },
                      { base: 'し (shi)', family: 'Sha • Shu • Sho' },
                      { base: 'ち (chi)', family: 'Cha • Chu • Cho' },
                      { base: 'に (ni)', family: 'Nya • Nyu • Nyo' },
                      { base: 'ひ (hi)', family: 'Hya • Hyu • Hyo' },
                      { base: 'み (mi)', family: 'Mya • Myu • Myo' },
                      { base: 'り (ri)', family: 'Rya • Ryu • Ryo' },
                      { base: 'ぎ (gi)', family: 'Gya • Gyu • Gyo' },
                      { base: 'じ (ji)', family: 'Ja • Ju • Jo' },
                      { base: 'び (bi)', family: 'Bya • Byu • Byo' },
                      { base: 'ぴ (pi)', family: 'Pya • Pyu • Pyo' }
                    ] : [
                      { base: 'キ (ki)', family: 'Kya • Kyu • Kyo' },
                      { base: 'シ (shi)', family: 'Sha • Shu • Sho' },
                      { base: 'チ (chi)', family: 'Cha • Chu • Cho' },
                      { base: 'ニ (ni)', family: 'Nya • Nyu • Nyo' },
                      { base: 'ヒ (hi)', family: 'Hya • Hyu • Hyo' },
                      { base: 'ミ (mi)', family: 'Mya • Myu • Myo' },
                      { base: 'リ (ri)', family: 'Rya • Ryu • Ryo' },
                      { base: 'ギ (gi)', family: 'Gya • Gyu • Gyo' },
                      { base: 'ジ (ji)', family: 'Ja • Ju • Jo' },
                      { base: 'ビ (bi)', family: 'Bya • Byu • Byo' },
                      { base: 'ピ (pi)', family: 'Pya • Pyu • Pyo' }
                    ];

                    const chunks = [];
                    for (let i = 0; i < items.length; i += 3) {
                      chunks.push({
                        label: labels[Math.floor(i / 3)],
                        cards: items.slice(i, i + 3)
                      });
                    }

                    return chunks.map((chunk, chunkIdx) => (
                      <div key={chunkIdx} className="bg-white/2 border border-white/5 rounded-2xl p-4 flex flex-col gap-2.5 hover:border-indigo-500/25 hover:bg-white/4 transition-all">
                        <div className="flex justify-between items-center px-1 border-b border-white/5 pb-2">
                          <span className="text-xs font-bold text-indigo-400 font-mono">
                            Asal: {chunk.label?.base}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                            {chunk.label?.family}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {chunk.cards.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => playKanaSound(item.char, item.rom)}
                              className="h-18 bg-white/3 hover:bg-white/10 active:bg-white/20 hover:scale-[1.03] rounded-xl border border-white/10 flex flex-col items-center justify-center p-1.5 cursor-pointer transition-all active:scale-95 group font-display select-none"
                            >
                              <span className="text-2xl text-white font-normal leading-none mb-1 group-hover:text-yellow-300 transition-colors">
                                {item.char}
                              </span>
                              <span className="text-[9px] font-sans font-mono tracking-wider text-zinc-500 uppercase group-hover:text-zinc-200 transition-colors">
                                {item.rom}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-5 sm:grid-cols-10 max-w-5xl mx-auto w-full">
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
              )}

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
                          <div 
                            key={i} 
                            onClick={() => speakText(v.jp)} 
                            className="bg-white/2 hover:bg-white/5 hover:border-indigo-500/30 border border-white/5 rounded-2xl p-4 flex justify-between items-center group cursor-pointer transition-all active:scale-[0.99]"
                          >
                            <div>
                              <h5 className="text-sm font-semibold text-white group-hover:text-yellow-350 transition-colors">{v.jp}</h5>
                              <p className="text-xs text-zinc-305 font-medium">{v.rom} • <span className="text-[10px] text-zinc-500">{v.type}</span></p>
                              <p className="text-xs text-zinc-400 mt-1">{v.translation}</p>
                              <p className="text-[10px] text-zinc-500 italic mt-0.5">{v.desc}</p>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                speakText(v.jp);
                              }}
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
                             <div 
                               onClick={() => speakText(gp.exJp)}
                               className="bg-slate-950/40 p-4 rounded-xl border border-white/5 hover:border-indigo-500/35 hover:bg-slate-950/60 active:scale-[0.99] transition-all text-left relative group cursor-pointer"
                             >
                               <div className="flex justify-between items-start">
                                 <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Kalimat Contoh: (Klik untuk Suara)</span>
                                 <button
                                   type="button"
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     speakText(gp.exJp);
                                   }}
                                   className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-600 border border-indigo-500/20 rounded-lg text-indigo-300 hover:text-white text-[10px] uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                 >
                                   <Volume2 className="w-3 h-3 animate-pulse" /> Lafalkan (TTS)
                                 </button>
                               </div>
                               <span className="text-base text-white font-mono block select-all mt-1 group-hover:text-yellow-350 transition-colors">{gp.exJp}</span>
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
                            onClick={() => speakText(dlg.textJp)}
                            className={`p-4 rounded-2xl border flex flex-col cursor-pointer transition-all hover:bg-white/10 active:scale-[0.995] ${
                              dlg.speaker === 'ルカ' || dlg.speaker === '実üş生' || dlg.speaker === '実習生'
                                ? 'bg-white/5 border-white/10 hover:border-yellow-400/40 ml-6 border-l-4 border-l-yellow-405'
                                : 'bg-slate-950/20 border-white/5 hover:border-indigo-400/30 mr-6 border-l-4 border-l-zinc-500'
                            }`}
                            title="Klik untuk melafalkan percakapan"
                          >
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                              {dlg.speaker} {dlg.speaker === 'ルカ' ? '🗣️' : '👤'} (Klik untuk Suara)
                            </span>
                            <span className="text-base text-white font-display select-all leading-relaxed block hover:text-yellow-350 transition-colors">
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
                            speakText(firstLine.textJp);
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
                          <p 
                            onClick={() => speakText(lessonQuiz.question)}
                            className="text-sm sm:text-base font-semibold text-white hover:text-indigo-300 transition-all cursor-pointer flex items-center gap-1.5"
                            title="Klik untuk melafalkan soal"
                          >
                            <span>{lessonQuiz.question}</span>
                            <Volume2 className="w-4 h-4 text-zinc-500 hover:text-white shrink-0 inline animate-pulse" />
                          </p>

                          <div className="flex flex-col gap-2">
                            {lessonQuiz.options.map((option, idx) => (
                              <div key={idx} className="relative flex items-center group w-full">
                                <button
                                  onClick={() => {
                                    if (!quizSubmitted) {
                                      triggerTick(440);
                                      setQuizSelectedAnswer(option);
                                    }
                                  }}
                                  disabled={quizSubmitted}
                                  className={`w-full text-left p-4 pr-12 rounded-2xl border text-xs sm:text-sm transition-all ${
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
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    speakText(option);
                                  }}
                                  className="absolute right-3.5 p-1.5 rounded-full hover:bg-white/10 text-zinc-500 hover:text-white transition-all shrink-0 cursor-pointer"
                                  title="Melafalkan Pilihan (TTS)"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
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
                                  } else {
                                    recordSrsMistake({
                                      id: `lesson_${selectedLesson}_vocab_quiz`,
                                      type: 'vocab',
                                      question: lessonQuiz.question,
                                      correct: lessonQuiz.answer,
                                      explanation: lessonQuiz.explanation,
                                      options: lessonQuiz.options
                                    });
                                  }
                                  speakText(lessonQuiz.answer);
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

              {/* Status statistics & Flashcards CTA */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => { triggerTick(523.25); setActiveTab('flashcards'); }}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all hover:scale-103 active:scale-95 shadow-md"
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  Latih Buku Flashcard
                </button>

                <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 block">Total Database</span>
                    <span className="text-xs font-mono font-bold text-white">{filteredVocabList.length} dari {VOCABULARY_DATABASE.length} Kosakata</span>
                  </div>
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
                  <div 
                    key={word.id} 
                    onClick={() => speakText(word.jp)}
                    className="bg-white/3 hover:bg-white/5 hover:border-indigo-500/30 cursor-pointer active:scale-[0.99] border border-white/5 rounded-2xl p-4 flex flex-col justify-between transition-all group relative overflow-hidden"
                  >
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
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(word.jp);
                          }}
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

                      <button
                        onClick={() => { triggerTick(440); setQuizMode('srs'); }}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                          quizMode === 'srs'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                            : 'bg-white/3 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-1.5">
                            <Brain className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="text-sm font-semibold">Review Cerdas SRS</span>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold uppercase ${
                            quizMode === 'srs' ? 'bg-amber-500 text-slate-950 font-bold animate-pulse' : 'bg-amber-500/20 text-amber-400'
                          }`}>Targeted</span>
                        </div>
                        <p className="text-[11px] font-light leading-relaxed opacity-80">
                          Review cerdas berjadwal (Leitner System) otomatis menarik semua sisa kesalahan-kesalahan Anda di mini games sebelumnya untuk pengulangan adaptif.
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
                    onClick={() => {
                      if (quizMode === 'srs' && getDueSrsItems().length === 0) {
                        triggerTick(150);
                        return;
                      }
                      startQuizEngine();
                    }}
                    disabled={quizMode === 'srs' && getDueSrsItems().length === 0}
                    className={`px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-wider shadow-xl hover:scale-[1.03] active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2 ${
                      quizMode === 'srs' && getDueSrsItems().length === 0
                        ? 'bg-zinc-850 border border-zinc-750 text-zinc-500 opacity-50 cursor-not-allowed'
                        : quizMode === 'srs'
                        ? 'bg-amber-600 border border-amber-500/50 hover:bg-amber-500 text-slate-950 font-black'
                        : 'bg-indigo-600 border border-indigo-500/50 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    <Award className="w-5 h-5 animate-spin-slow" />
                    {quizMode === 'srs'
                      ? getDueSrsItems().length === 0
                        ? 'Belum Ada Kata Salah (Review Bersih!)'
                        : `Mulai Review Kilat (${getDueSrsItems().length} Kata Salah)`
                      : 'Mulai Sesi Kuis Interaktif'
                    }
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
                        {quizMode === 'standard' 
                          ? `${quizCurrentIndex + 1} / ${quizQuestionsList.length}` 
                          : quizMode === 'srs'
                          ? `Review: ${quizCurrentIndex + 1} / ${quizQuestionsList.length}`
                          : `Ke-${quizCurrentIndex + 1} (Endless)`}
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
                      <div className="flex flex-col items-center gap-2">
                        <h3 
                          onClick={() => speakText(currentItem.question)}
                          className="text-lg sm:text-xl font-medium text-white hover:text-indigo-300 transition-colors leading-relaxed max-w-lg mx-auto cursor-pointer flex items-center justify-center gap-1.5"
                          title="Klik untuk melafalkan soal"
                        >
                          <span>{currentItem.question}</span>
                          <Volume2 className="w-4 h-4 text-zinc-500 hover:text-white shrink-0 animate-pulse" />
                        </h3>
                      </div>
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
                          <div key={idx} className="relative flex items-center group w-full">
                            <button
                              disabled={quizSubmittedState}
                              onClick={() => handleQuizAnswer(option)}
                              className={`w-full p-4 pr-12 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all ${optionStyle}`}
                            >
                              <div className="flex gap-2.5 items-start">
                                <span className="bg-white/10 shrink-0 font-mono text-[10px] text-zinc-400 px-2 py-0.5 rounded-md">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="leading-snug">{option}</span>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                speakText(option);
                              }}
                              className="absolute right-3.5 p-1.5 rounded-full hover:bg-white/10 text-zinc-500 hover:text-white transition-all shrink-0 cursor-pointer"
                              title="Melafalkan Pilihan (TTS)"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
      {/* MODULE: DIGITAL FLASHCARDS WITH FLIP ANIMATIONS */}
      {/* ======================================================== */}
      {activeTab === 'flashcards' && (
        <DigitalFlashcards 
          onTriggerSound={triggerTick} 
          onAddXP={addXP} 
          isFocusModeActive={isFocusModeActive}
          onToggleFocusMode={onToggleFocusMode}
        />
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
