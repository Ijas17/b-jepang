import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Sparkles, Brain, ArrowLeft, ArrowRight, RotateCcw, 
  Check, X, Shuffle, Play, Pause, AlertCircle, HelpCircle, 
  BookOpen, Layers, Award, Info, Keyboard, ListCollapse, Moon
} from 'lucide-react';
import { VOCABULARY_DATABASE, VocabularyWord } from '../data/vocabulary';
import { KANJI_DATA, KanjiEntry } from '../data/kanji';
import { recordSrsMistake, recordSrsSuccess, getSrsItems } from '../utils/srs';

interface DigitalFlashcardsProps {
  onTriggerSound?: (freq: number) => void;
  onAddXP?: (amount: number) => void;
  isFocusModeActive?: boolean;
  onToggleFocusMode?: (val: boolean) => void;
}

export default function DigitalFlashcards({ 
  onTriggerSound, 
  onAddXP,
  isFocusModeActive,
  onToggleFocusMode
}: DigitalFlashcardsProps) {
  // Main settings
  const [deckType, setDeckType] = useState<'vocab' | 'kanji'>('vocab');
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | 'N5' | 'N4'>('ALL');
  const [selectedBab, setSelectedBab] = useState<number | 'ALL'>('ALL');
  
  // Flashcard list and indexes
  const [deck, setDeck] = useState<Array<{
    id: string;
    front: string;
    backTitle: string;
    backSubtitle: string;
    meaning: string;
    type?: string;
    details?: string;
    examples?: Array<{ word: string; kana: string; meaning: string }>;
    onyomi?: string;
    kunyomi?: string;
    strokes?: number;
    originalItem: VocabularyWord | KanjiEntry;
  }>>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  
  // Auto-play (Slideshow) states
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayTimer, setAutoPlayTimer] = useState<number | null>(null);
  const [autoPlayIntervalSec, setAutoPlayIntervalSec] = useState(4); // seconds
  
  // Study session statistics
  const [vocabMastery, setVocabMastery] = useState<Record<string, 'mastered' | 'review'>>({});
  const [statsView, setStatsView] = useState({ mastered: 0, review: 0 });
  const [showShortcuts, setShowShortcuts] = useState(true);

  // Play synthetic acoustic alert sound
  const playBeep = (freq = 440, duration = 0.1, type: OscillatorType = 'sine') => {
    if (onTriggerSound) {
      onTriggerSound(freq);
      return;
    }
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio feedback fallback:', e);
    }
  };

  // Compile deck based on selection filters
  useEffect(() => {
    let items: Array<any> = [];
    
    if (deckType === 'vocab') {
      items = VOCABULARY_DATABASE.filter(item => {
        const matchLevel = selectedLevel === 'ALL' || item.jlpt === selectedLevel;
        const matchBab = selectedBab === 'ALL' || item.bab === selectedBab;
        return matchLevel && matchBab;
      });
      
      const mapped = items.map(item => ({
        id: `vocab_${item.id}`,
        front: item.jp,
        backTitle: item.rom,
        backSubtitle: item.type,
        meaning: item.translation,
        details: item.desc,
        originalItem: item
      }));
      
      setDeck(isShuffled ? [...mapped].sort(() => 0.5 - Math.random()) : mapped);
    } else {
      items = KANJI_DATA.filter(item => {
        const matchLevel = selectedLevel === 'ALL' || item.level === selectedLevel;
        return matchLevel;
      });
      
      const mapped = items.map(item => ({
        id: `kanji_${item.kanji}`,
        front: item.kanji,
        backTitle: `Onyomi: ${item.onyomi}`,
        backSubtitle: `Kunyomi: ${item.kunyomi}`,
        meaning: item.meaning,
        details: `Coretan: ${item.strokes} stroke(s)`,
        examples: item.examples,
        originalItem: item
      }));
      
      setDeck(isShuffled ? [...mapped].sort(() => 0.5 - Math.random()) : mapped);
    }
    
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [deckType, selectedLevel, selectedBab, isShuffled]);

  // Load and calculate local user progress
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ruka_flashcard_progress');
      if (stored) {
        const parsed = JSON.parse(stored);
        setVocabMastery(parsed);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync mastery counts based on overall loaded data and current deck
  useEffect(() => {
    if (deck.length === 0) {
      setStatsView({ mastered: 0, review: 0 });
      return;
    }
    let masteredCount = 0;
    let reviewCount = 0;
    
    deck.forEach(card => {
      const status = vocabMastery[card.id];
      if (status === 'mastered') masteredCount++;
      else if (status === 'review') reviewCount++;
    });
    
    setStatsView({ mastered: masteredCount, review: reviewCount });
  }, [deck, vocabMastery]);

  const saveProgress = (newMastery: Record<string, 'mastered' | 'review'>) => {
    try {
      localStorage.setItem('ruka_flashcard_progress', JSON.stringify(newMastery));
      setVocabMastery(newMastery);
    } catch (e) {
      console.error(e);
    }
  };

  // Speech TTS handler
  const speakText = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ja-JP';
        utter.rate = 0.75;
        window.speechSynthesis.speak(utter);
      }
    } catch (e) {
      console.warn('Speech engine unavailable:', e);
    }
    playBeep(480, 0.08);
  };

  // Card Controls
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    playBeep(isFlipped ? 380 : 320, 0.12, 'triangle');
  };

  const handleNext = () => {
    if (deck.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % deck.length);
      playBeep(420, 0.05);
    }, 120);
  };

  const handlePrev = () => {
    if (deck.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + deck.length) % deck.length);
      playBeep(380, 0.05);
    }, 120);
  };

  const currentCard = deck[currentIndex];

  // Auto pronunce word on card changes
  useEffect(() => {
    if (currentCard && !isFlipped) {
      // Auto-pronounce if auto-playing
      if (isAutoPlaying) {
        const timer = setTimeout(() => {
          speakText(currentCard.front);
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, deck, isAutoPlaying]);

  // Mastered action (record SRS Success + Local Progress)
  const markMastered = () => {
    if (!currentCard) return;
    const newMastery = { ...vocabMastery, [currentCard.id]: 'mastered' as const };
    saveProgress(newMastery);
    
    // Register SRS success to extend recurrence backoff
    recordSrsSuccess(currentCard.id);
    
    // Add XP rewards
    if (onAddXP) {
      onAddXP(3);
    }

    playBeep(587.33, 0.25, 'sine');
    handleNext();
  };

  // Review later action (record SRS Mistake / Reset + Local Progress)
  const markReview = () => {
    if (!currentCard) return;
    const newMastery = { ...vocabMastery, [currentCard.id]: 'review' as const };
    saveProgress(newMastery);
    
    // Core Leitner System logic: mark mistake to register into the Leitner SRS Queue!
    if (deckType === 'vocab') {
      const vocabItem = currentCard.originalItem as VocabularyWord;
      recordSrsMistake({
        id: currentCard.id,
        type: 'vocab',
        question: vocabItem.jp,
        correct: vocabItem.rom,
        translation: vocabItem.translation,
        explanation: vocabItem.desc || 'Review mandiri lewat dek flashcard.'
      });
    } else {
      const kanjiItem = currentCard.originalItem as KanjiEntry;
      recordSrsMistake({
        id: currentCard.id,
        type: 'kanji',
        question: kanjiItem.kanji,
        correct: kanjiItem.meaning,
        translation: `Onyomi: ${kanjiItem.onyomi} | Kunyomi: ${kanjiItem.kunyomi}`,
        explanation: `Suku kata coretan: ${kanjiItem.strokes}`
      });
    }

    playBeep(195.99, 0.3, 'triangle');
    handleNext();
  };

  // Toggle AutoPlay loop with timer
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setIsFlipped(prev => {
          if (!prev) {
            // If currently showing front side, flip to back side to show details
            playBeep(320, 0.1, 'triangle');
            return true;
          } else {
            // Once details are seen, automatically dispatch next card
            handleNext();
            return false;
          }
        });
      }, autoPlayIntervalSec * 1000);
      
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, currentIndex, deck, autoPlayIntervalSec]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing shortcuts when user is typing in generic inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return;
      }
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handleFlip();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'KeyK': // K for Kuasai
        case 'Enter':
          e.preventDefault();
          markMastered();
          break;
        case 'KeyU': // U for Ulangi
        case 'Backspace':
          e.preventDefault();
          markReview();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck, isFlipped, vocabMastery]);

  // Reset progress statistics
  const resetProgress = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang kemajuan flashcard kamu?')) {
      saveProgress({});
      playBeep(150, 0.4);
    }
  };

  // Master rate percentage
  const masteryPercentage = deck.length > 0 
    ? Math.round((statsView.mastered / deck.length) * 100) 
    : 0;

  return (
    <div id="digital-flashcards-root" className="animate-fade-rise space-y-6">
      
      {/* Upper Panel Config */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/5 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-md text-[10px] uppercase animate-pulse">FLASHCARDS PRO</span>
              <h2 className="text-3xl font-display text-white font-normal">
                Flashcard Cerdas & Animasi Flip
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-light font-sans leading-relaxed max-w-xl">
              Gunakan mode flip visual ini untuk melatih memori bawah sadarmu dengan cepat. Terintegrasi langsung dengan <span className="text-amber-300 font-medium">Sistem Pengulangan Berjadwal (SRS)</span>.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { playBeep(440, 0.05); setDeckType('vocab'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                deckType === 'vocab'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg'
                  : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              📖 Kosakata (Vocab)
            </button>
            <button
              onClick={() => { playBeep(520, 0.05); setDeckType('kanji'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                deckType === 'kanji'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg'
                  : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              ⛩️ Kanji Jepang
            </button>
          </div>
        </div>

        {/* Dynamic Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/2 p-4 rounded-2xl border border-white/5">
          
          {/* Level selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Level JLPT</label>
            <div className="flex gap-1">
              {['ALL', 'N5', 'N4'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => { playBeep(400, 0.05); setSelectedLevel(lvl as any); }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedLevel === lvl
                      ? 'bg-white text-slate-950 border-white'
                      : 'bg-slate-950/20 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {lvl === 'ALL' ? 'Semua' : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Bab Selection (Only for vocabulary) */}
          <div className="flex flex-col gap-1.5 opacity-100 transition-all">
            <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              Bab Terpilih {deckType !== 'vocab' && '(Khusus Kosakata)'}
            </label>
            <select
              disabled={deckType !== 'vocab'}
              value={selectedBab}
              onChange={(e) => { playBeep(440, 0.05); setSelectedBab(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)); }}
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer h-[34px] w-full"
            >
              <option value="ALL">Semua Bab (1 - 25)</option>
              {Array.from({ length: 25 }, (_, idx) => (
                <option key={idx + 1} value={idx + 1}>Bab {idx + 1}</option>
              ))}
            </select>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-col justify-between">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1">
              <span>Kecepatan Auto Slide</span>
              <span className="text-zinc-200 font-mono font-black">{autoPlayIntervalSec} Detik</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="range"
                min="2"
                max="10"
                value={autoPlayIntervalSec}
                onChange={(e) => setAutoPlayIntervalSec(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-900 rounded-lg appearance-auto"
              />
            </div>
          </div>

        </div>

        {/* Playback & Statistics Overview */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/2 p-5 rounded-2xl border border-white/5">
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-amber-400 text-xl font-bold animate-pulse">
              {masteryPercentage}%
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">Kemajuan Master Dek</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-white font-mono font-bold">{statsView.mastered} dikuasai</span>
                <span className="text-zinc-650">•</span>
                <span className="text-xs text-zinc-400 font-mono">{deck.length} total kartu</span>
              </div>
            </div>
          </div>

          {/* Quick Info & Action controllers */}
          <div className="flex flex-wrap gap-2.5 items-center w-full md:w-auto justify-end">
            
            {onToggleFocusMode && (
              <button
                onClick={() => {
                  playBeep(523, 0.05);
                  onToggleFocusMode(!isFocusModeActive);
                }}
                className={`p-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-all ${
                  isFocusModeActive
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-white/3 border-white/5 text-zinc-400 hover:text-white'
                }`}
                title={isFocusModeActive ? "Matikan Mode Fokus" : "Aktifkan Mode Fokus"}
              >
                <Moon className={`w-3.5 h-3.5 ${isFocusModeActive ? 'text-amber-400 animate-pulse' : ''}`} />
                {isFocusModeActive ? 'Fokus Aktif' : 'Mode Fokus'}
              </button>
            )}

            <button
              onClick={() => { playBeep(440, 0.05); setIsShuffled(!isShuffled); }}
              className={`p-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-all ${
                isShuffled
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-extrabold'
                  : 'bg-white/3 border-white/5 text-zinc-400 hover:text-white'
              }`}
              title="Acak Urutan Kartu"
            >
              <Shuffle className="w-3.5 h-3.5" />
              {isShuffled ? 'Diacak' : 'Acak'}
            </button>

            <button
              onClick={() => { playBeep(450, 0.05); setIsAutoPlaying(!isAutoPlaying); }}
              className={`p-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-all ${
                isAutoPlaying
                  ? 'bg-indigo-550 border-indigo-500 text-white font-extrabold'
                  : 'bg-white/3 border-white/5 text-zinc-450 hover:text-white'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5 text-white fill-white" /> : <Play className="w-3.5 h-3.5 text-white/80 fill-white/80" />}
              {isAutoPlaying ? 'Auto: Jeda' : 'Auto Play'}
            </button>

            <button
              onClick={() => {
                playBeep(220, 0.1);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="p-2.5 px-4 bg-white/3 hover:bg-white/5 border border-white/5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Mulai Ulang Dek
            </button>

            <button
              onClick={resetProgress}
              className="p-2.5 px-3 border border-rose-500/10 hover:border-rose-500/30 text-rose-450 hover:text-rose-400 hover:bg-rose-500/5 text-xs rounded-xl cursor-pointer transition-all"
              title="Reset Statistik"
            >
              Reset Progress
            </button>

          </div>

        </div>

        {/* Dynamic Display of Cards */}
        {deck.length === 0 ? (
          <div className="bg-white/2 border border-white/5 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
            <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto animate-bounce" />
            <h4 className="text-base text-white">Dek Flashcards Kosong</h4>
            <p className="text-xs text-zinc-400 font-light font-sans max-w-sm mx-auto leading-relaxed">
              Tidak ada data kosakata atau kanji yang sesuai dengan kombinasi filter level atau Bab yang Anda arahkan saat ini.
            </p>
          </div>
        ) : (
          <div className="space-y-8 flex flex-col items-center">
            
            {/* Cards Stage with custom interactive click perspective */}
            <div 
              className="w-full max-w-lg h-[340px] perspective-1000 cursor-pointer"
              onClick={handleFlip}
            >
              <div className={`w-full h-full duration-500 preserve-3d relative transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* CARD FRONT SIDE */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-slate-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-2xl transition-all overflow-hidden group">
                  
                  {/* Shiny Reflection / Neon border */}
                  <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 h-[100px] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  
                  {/* Card top flags */}
                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 select-none">
                    <span className="flex items-center gap-1 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      <Layers className="w-3 h-3 text-indigo-400" />
                      Kartu {currentIndex + 1} dari {deck.length}
                    </span>
                    <div className="flex gap-1.5">
                      {deckType === 'vocab' ? (
                        <>
                          <span className="bg-rose-500/10 border border-rose-500/10 text-rose-300 px-2 py-0.5 rounded-md">
                            {(currentCard.originalItem as VocabularyWord).jlpt}
                          </span>
                          <span className="bg-indigo-500/10 border border-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-md">
                            Bab {(currentCard.originalItem as VocabularyWord).bab}
                          </span>
                        </>
                      ) : (
                        <span className="bg-emerald-500/10 border border-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-md">
                          {(currentCard.originalItem as KanjiEntry).level}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Character/Pronoun Container */}
                  <div className="text-center space-y-4">
                    <h3 className={`text-6xl text-white tracking-widest leading-none drop-shadow-md select-text ${deckType === 'kanji' ? 'font-display font-medium' : 'font-sans font-semibold'}`}>
                      {currentCard.front}
                    </h3>
                    
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block select-none group-hover:text-amber-400 transition-colors">
                      Sentuh Kartu Untuk Membuka Solusi
                    </span>
                  </div>

                  {/* Speak Trigger & Status Icon flag */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2 select-none">
                      {vocabMastery[currentCard.id] === 'mastered' ? (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Mastered
                        </span>
                      ) : vocabMastery[currentCard.id] === 'review' ? (
                        <span className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-full">
                          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                          Reviewing
                        </span>
                      ) : (
                        <div className="text-zinc-550 border border-white/5 bg-white/2 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
                          Belum Berprogres
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(currentCard.front);
                      }}
                      className="p-2 rounded-full border border-indigo-500/25 bg-indigo-550/10 hover:bg-indigo-500 hover:text-white text-indigo-300 active:scale-90 transition-all cursor-pointer shadow-md shrink-0"
                      title="Pelafalan Suara (TTS)"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* CARD BACK SIDE (Rotated 180 degrees) */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-slate-930 border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden">
                  
                  {/* Subtle color highlight */}
                  <div className="absolute top-0 left-0 h-32 w-32 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
                  
                  {/* Card top labels */}
                  <div className="flex justify-between items-center select-none text-[10px] font-bold text-zinc-400">
                    <span className="flex items-center gap-1 uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Solusi Hafalan
                    </span>
                    <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-full uppercase tracking-wider text-[9px]">
                      {deckType === 'vocab' ? 'Kosakata' : 'Kanji Jepang'}
                    </span>
                  </div>

                  {/* Definition, Romaji & Supplementary stats info */}
                  <div className="text-center space-y-3 py-2 my-auto select-text">
                    <p className="text-md font-mono text-amber-300 font-bold tracking-widest block select-all">
                      {currentCard.backTitle}
                    </p>
                    {currentCard.backSubtitle && (
                      <span className="text-[11px] text-zinc-400 font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/5 inline-block">
                        {currentCard.backSubtitle}
                      </span>
                    )}

                    <h4 className="text-2xl font-semibold text-white tracking-normal font-sans italic mt-1 leading-tight max-w-sm mx-auto">
                      "{currentCard.meaning}"
                    </h4>

                    {currentCard.details && (
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-sm mx-auto font-light">
                        {currentCard.details}
                      </p>
                    )}

                    {/* Show examples if available (like Kanji compound words) */}
                    {currentCard.examples && currentCard.examples.length > 0 && (
                      <div className="mt-3 text-left bg-zinc-950/50 p-2.5 rounded-xl border border-white/5 text-[10px]">
                        <span className="text-zinc-500 block font-bold mb-1 uppercase tracking-wider">Contoh Gabungan Kata:</span>
                        <div className="grid grid-cols-2 gap-1.5 font-sans">
                          {currentCard.examples.slice(0, 4).map((ex, exIdx) => (
                            <div key={exIdx} className="space-y-0.5 border-l border-zinc-700/50 pl-1.5">
                              <span className="text-xs text-white font-semibold">{ex.word}</span>
                              <span className="text-zinc-400 block text-[9px]">{ex.kana}</span>
                              <span className="text-zinc-500 block text-[9px] italic translate-y-[-1px]">{ex.meaning}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* TTS & Action flag footer */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest select-none">
                      Sentuh Untuk Buka Cover
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(currentCard.front);
                      }}
                      className="p-2 rounded-full border border-indigo-500/25 bg-indigo-550/10 hover:bg-indigo-500 hover:text-white text-indigo-300 active:scale-90 transition-all cursor-pointer shadow-md shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            </div>

            {/* Stage Navigations & Mastery grading */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-lg gap-4 bg-white/2 p-4 rounded-2xl border border-white/5">
              
              {/* Back / Next controllers */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-white/5 hover:border-white/10 rounded-2xl cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
                  title="Kartu Sebelumnya"
                >
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold text-white tracking-widest uppercase cursor-pointer transition-all hover:scale-102"
                >
                  {isFlipped ? 'Tutup Cover' : 'Buka Solusi'}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-white/5 hover:border-white/10 rounded-2xl cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
                  title="Kartu Selanjutnya"
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Master / Review Grading buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={(e) => { e.stopPropagation(); markReview(); }}
                  className="flex-1 sm:flex-none px-4 py-3 border border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 rounded-2xl text-xs font-extrabold uppercase select-none transition-all cursor-pointer flex items-center justify-center gap-1 hover:scale-103 shadow-inner shadow-black/40"
                  title="Ulangi kembali (Mendorong ke Bank Memori SRS untuk kuis berikutnya)"
                >
                  <X className="w-4 h-4 shrink-0 text-rose-400" />
                  Ulangi
                </button>
                
                <button
                  onClick={(e) => { e.stopPropagation(); markMastered(); }}
                  className="flex-1 sm:flex-none px-4 py-3 border border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-2xl text-xs font-extrabold uppercase select-none transition-all cursor-pointer flex items-center justify-center gap-1 hover:scale-103 shadow-inner shadow-black/40"
                  title="Saya sudah menghafal kosakata ini"
                >
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  Kuasai
                </button>
              </div>

            </div>

            {/* Keyboard Shortcuts Helper Drawer toggle */}
            <div className="w-full max-w-lg overflow-hidden bg-white/1 px-4 py-3 rounded-2xl border border-white/5 transition-all text-xs font-sans text-zinc-500">
              <button 
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="flex items-center justify-between w-full hover:text-zinc-400 tracking-wide font-semibold uppercase text-[10px]"
              >
                <span className="flex items-center gap-1.5 text-zinc-400 font-bold">
                  <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
                  Pintasan Papan Ketik (Keyboard Shortcuts)
                </span>
                <span>{showShortcuts ? 'Sembunyikan ↑' : 'Tampilkan ↓'}</span>
              </button>

              {showShortcuts && (
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3 pt-2.5 border-t border-white/2 leading-relaxed text-[10px]">
                  <p className="flex items-center gap-1.5"><kbd className="bg-slate-950 font-mono text-zinc-300 border border-white/10 px-1 py-0.5 rounded text-[9px] shadow font-bold">Space</kbd> : Balik Kartu (Flip)</p>
                  <p className="flex items-center gap-1.5"><kbd className="bg-slate-950 font-mono text-zinc-300 border border-white/10 px-1 py-0.5 rounded text-[9px] shadow font-bold">→</kbd> : Kartu Selanjutnya</p>
                  <p className="flex items-center gap-1.5"><kbd className="bg-slate-950 font-mono text-zinc-300 border border-white/10 px-1 py-0.5 rounded text-[9px] shadow font-bold">←</kbd> : Kartu Sebelumnya</p>
                  <p className="flex items-center gap-1.5"><kbd className="bg-slate-950 font-mono text-zinc-300 border border-white/10 px-1.5 py-0.5 rounded text-[9px] shadow font-bold">Enter</kbd> / <kbd className="bg-slate-950 font-mono text-zinc-300 border border-white/10 px-1 py-0.5 rounded text-[9px] shadow font-bold">K</kbd> : Kuasai (Lolos/Hafal)</p>
                  <p className="flex items-center gap-1.5 col-span-2"><kbd className="bg-slate-950 font-mono text-zinc-300 border border-white/10 px-1.5 py-0.5 rounded text-[9px] shadow font-bold">Backspace</kbd> / <kbd className="bg-slate-950 font-mono text-zinc-300 border border-white/10 px-1 py-0.5 rounded text-[9px] shadow font-bold">U</kbd> : Ulangi (Dorong review salah ke Leitner SRS)</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
