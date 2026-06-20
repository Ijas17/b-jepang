import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, RotateCcw, Check, Flame, ChevronRight, ChevronLeft, Sparkles, 
  HelpCircle, Shuffle, Eye, Layers, BookOpen, Edit3, Trash2, Award, Info
} from 'lucide-react';
import { KANA_DATA, KanaItem } from '../data/kana';

interface KanaTrainerProps {
  onTriggerSound?: (freq: number) => void;
  onIncrementStreak?: () => void;
}

export default function KanaTrainer({ onTriggerSound, onIncrementStreak }: KanaTrainerProps) {
  // Mode selection: 'flashcards' (Belajar) | 'quiz' (Uji Romaji) | 'canvas' (Tulis Manual)
  const [trainerMode, setTrainerMode] = useState<'flashcards' | 'quiz' | 'canvas'>('flashcards');

  // Deck selector filters
  const [selectedKanaType, setSelectedKanaType] = useState<'hiragana' | 'katakana' | 'both'>('hiragana');
  const [selectedSets, setSelectedSets] = useState<{ dasar: boolean; varian: boolean; kombinasi: boolean }>({
    dasar: true,
    varian: false,
    kombinasi: false
  });

  // Master Deck state
  const [deck, setDeck] = useState<KanaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Score & Performance state
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [wrongCounter, setWrongCounter] = useState<Record<string, number>>({});
  const [correctStreak, setCorrectStreak] = useState<number>(0);

  // Quiz game state
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Helper sound trigger
  const playBeep = (freq = 440) => {
    if (onTriggerSound) {
      onTriggerSound(freq);
    }
  };

  // Build the deck dynamically when the filters change
  useEffect(() => {
    const items: KanaItem[] = [];

    const addGroupItems = (group: 'hiragana' | 'katakana') => {
      if (selectedSets.dasar) {
        items.push(...KANA_DATA[group].dasar.filter(k => k.char !== '—'));
      }
      if (selectedSets.varian) {
        items.push(...KANA_DATA[group].varian.filter(k => k.char !== '—'));
      }
      if (selectedSets.kombinasi) {
        items.push(...KANA_DATA[group].kombinasi.filter(k => k.char !== '—'));
      }
    };

    if (selectedKanaType === 'hiragana' || selectedKanaType === 'both') {
      addGroupItems('hiragana');
    }
    if (selectedKanaType === 'katakana' || selectedKanaType === 'both') {
      addGroupItems('katakana');
    }

    // Shuffle by default to make it engaging
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setDeck(shuffled.length > 0 ? shuffled : [{ char: 'あ', rom: 'a' }]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setQuizSelectedAnswer(null);
    setQuizAnswered(false);
  }, [selectedKanaType, selectedSets]);

  // Generate options for the current flashcard in Quiz Mode
  useEffect(() => {
    if (deck.length === 0 || trainerMode !== 'quiz') return;
    const currentItem = deck[currentIndex];
    if (!currentItem) return;

    // Grab up to 3 random distractors from total pool of Romanizations
    const allRoms = Array.from(new Set(deck.map(d => d.rom).filter(r => r !== '')));
    const distractors = allRoms
      .filter(r => r !== currentItem.rom)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const generated = [...distractors, currentItem.rom]
      .sort(() => Math.random() - 0.5);
    
    setQuizOptions(generated);
    setQuizSelectedAnswer(null);
    setQuizAnswered(false);
  }, [deck, currentIndex, trainerMode]);

  // Trigger web speech synthesis for the Japanese kana character
  const speakKana = (character: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(character);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis not supported', e);
    }
    playBeep(660);
  };

  const handleNext = () => {
    playBeep(580);
    setIsFlipped(false);
    setQuizSelectedAnswer(null);
    setQuizAnswered(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    playBeep(480);
    setIsFlipped(false);
    setQuizSelectedAnswer(null);
    setQuizAnswered(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleShuffle = () => {
    playBeep(880);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const toggleSetFilter = (type: 'dasar' | 'varian' | 'kombinasi') => {
    playBeep(320);
    setSelectedSets(prev => {
      const copy = { ...prev, [type]: !prev[type] };
      // Prevent having absolutely nothing selected
      if (!copy.dasar && !copy.varian && !copy.kombinasi) {
        return prev;
      }
      return copy;
    });
  };

  // Mark as Mastered
  const handleMarkMastered = (item: KanaItem) => {
    if (!masteredIds.includes(item.char)) {
      playBeep(880);
      setMasteredIds(prev => [...prev, item.char]);
      
      // Trigger user study streak reward
      if (onIncrementStreak) {
        onIncrementStreak();
      }
    }
    handleNext();
  };

  // Submit Answer in Quiz Mode
  const handleSelectQuizAnswer = (selectedRom: string) => {
    if (quizAnswered) return;
    const currentItem = deck[currentIndex];
    if (!currentItem) return;

    setQuizSelectedAnswer(selectedRom);
    setQuizAnswered(true);
    
    const isCorrect = selectedRom === currentItem.rom;
    setQuizIsCorrect(isCorrect);

    if (isCorrect) {
      playBeep(880);
      setQuizScore(prev => prev + 10);
      setCorrectStreak(prev => {
        const next = prev + 1;
        if (next % 5 === 0 && onIncrementStreak) {
          onIncrementStreak();
        }
        return next;
      });
    } else {
      playBeep(150);
      setCorrectStreak(0);
      setWrongCounter(prev => ({
        ...prev,
        [currentItem.char]: (prev[currentItem.char] || 0) + 1
      }));
    }
  };

  // --- HTML5 Drawing Canvas logic ---
  useEffect(() => {
    if (trainerMode !== 'canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configure aesthetic solid white ink stroke
    ctx.strokeStyle = '#ffffff';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 14;
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#818cf8'; // Indigo glow
  }, [trainerMode, currentIndex]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      // Prevent scrolling while drawing on mobile devices
      e.preventDefault();
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    playBeep(220);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const currentItem = deck[currentIndex];

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <h2 className="text-3xl font-display text-white font-normal mb-1">
            Kana Trainer Pro
          </h2>
          <p className="text-xs text-zinc-400 font-light font-sans max-w-xl">
            Sistem flashcard dan latihan menulis interaktif untuk menghafal Hiragana dan Katakana dengan cepat. Dilengkapi pendukung bunyi varian (Dakuten) serta kombinasi gabungan (Yō-on).
          </p>
        </div>

        {/* Mode Selector pills */}
        <div className="flex items-center gap-2 p-1 bg-white/2 border border-white/5 rounded-2xl">
          <button
            onClick={() => { playBeep(523); setTrainerMode('flashcards'); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              trainerMode === 'flashcards'
                ? 'bg-white text-slate-950 font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Flashcard
          </button>
          
          <button
            onClick={() => { playBeep(587); setTrainerMode('quiz'); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              trainerMode === 'quiz'
                ? 'bg-white text-slate-950 font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Kuis Romaji
          </button>

          <button
            onClick={() => { playBeep(659); setTrainerMode('canvas'); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              trainerMode === 'canvas'
                ? 'bg-white text-slate-950 font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Latihan Tulis
          </button>
        </div>
      </div>

      {/* Main interactive segment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="liquid-glass border border-white/5 p-5 rounded-2xl text-left space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 font-sans flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Konfigurasi Hafalan
            </h3>

            {/* Input Filter 1: Subset type */}
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">1. Jenis Aksara</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-950/40 p-1 rounded-xl border border-white/2">
                <button
                  onClick={() => setSelectedKanaType('hiragana')}
                  className={`py-1.5 rounded-lg text-[10px] uppercase font-bold cursor-pointer transition-all text-center ${
                    selectedKanaType === 'hiragana'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Hiragana
                </button>
                <button
                  onClick={() => setSelectedKanaType('katakana')}
                  className={`py-1.5 rounded-lg text-[10px] uppercase font-bold cursor-pointer transition-all text-center ${
                    selectedKanaType === 'katakana'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Katakana
                </button>
                <button
                  onClick={() => setSelectedKanaType('both')}
                  className={`py-1.5 rounded-lg text-[10px] uppercase font-bold cursor-pointer transition-all text-center ${
                    selectedKanaType === 'both'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Campuran
                </button>
              </div>
            </div>

            {/* Input Filter 2: Character Lists */}
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">2. Kategori Bunyi</label>
              <div className="flex flex-col gap-1.5">
                {[
                  { key: 'dasar' as const, label: 'Huruf Dasar (Gojūon)', desc: 'あ, カ, さ, ミ, dll.' },
                  { key: 'varian' as const, label: 'Bunyi Varian (Dakuten)', desc: 'が, じ, ぱ, べ, dll.' },
                  { key: 'kombinasi' as const, label: 'Huruf Kombinasi (Yō-on)', desc: 'きゃ, しゅ, びょ, dll.' }
                ].map((item) => {
                  const isActive = selectedSets[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleSetFilter(item.key)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                        isActive
                          ? 'bg-white/5 border-white/10 text-white'
                          : 'bg-white/1 border-white/2 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <div>
                        <span className="text-[11px] font-semibold block">{item.label}</span>
                        <span className="text-[9px] text-zinc-500 block font-sans">{item.desc}</span>
                      </div>
                      
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isActive ? 'bg-indigo-500 border-indigo-400 text-slate-950' : 'border-white/10 text-transparent'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card Pool statistics */}
            <div className="pt-3 border-t border-white/5 space-y-2 text-[11px] text-zinc-400 font-sans">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Statistik Deck</span>
              <div className="flex justify-between">
                <span>Total Kartu dalam Antrean:</span>
                <span className="font-mono font-bold text-white">{deck.length} Huruf</span>
              </div>
              <div className="flex justify-between">
                <span>Jumlah yang Dihafal:</span>
                <span className="font-mono font-bold text-emerald-400">{masteredIds.length} Huruf</span>
              </div>
              <div className="flex justify-between">
                <span>Skor Kuis Terbaik Anda:</span>
                <span className="font-mono font-bold text-yellow-400">{quizScore} Pt</span>
              </div>
            </div>

            {/* Deck Mass controls */}
            <div className="grid grid-cols-2 gap-2 pt-3">
              <button
                onClick={handleShuffle}
                className="px-3 py-2 bg-white/2 border border-white/5 text-[10px] text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 hover:bg-white/5"
              >
                <Shuffle className="w-3 h-3" /> Acak Deck
              </button>
              <button
                onClick={() => {
                  playBeep(220);
                  setMasteredIds([]);
                  setQuizScore(0);
                  setCorrectStreak(0);
                  setWrongCounter({});
                }}
                className="px-3 py-2 bg-rose-500/5 hover:bg-rose-500/15 border border-rose-500/10 hover:border-rose-500/30 text-[10px] font-semibold text-rose-300 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Stat
              </button>
            </div>

          </div>
        </div>

        {/* Right column: Interactive Sandbox Board */}
        <div className="lg:col-span-8">
          
          {/* FLASHCARD MODE */}
          {trainerMode === 'flashcards' && currentItem && (
            <div className="space-y-6 max-w-xl mx-auto animate-fade-rise">
              
              {/* Progress pill indicator */}
              <div className="flex justify-between items-center text-xs text-zinc-500 font-mono">
                <span>Antrean: {currentIndex + 1} / {deck.length}</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <Check className="w-3.5 h-3.5" /> {masteredIds.includes(currentItem.char) ? 'Sudah Dihafal' : 'Belum Ditandai'}
                </span>
              </div>

              {/* Huge Flipper Card */}
              <div 
                onClick={() => { playBeep(isFlipped ? 380 : 445); setIsFlipped(!isFlipped); }}
                className={`relative w-full h-80 cursor-pointer rounded-3xl border transition-all duration-500 [transform-style:preserve-3d] ${
                  isFlipped 
                    ? 'bg-indigo-600/10 border-indigo-500/40 rotate-y-180' 
                    : 'bg-white/2 border-white/5 hover:border-white/10'
                }`}
              >
                
                {/* Front Side */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 [backface-visibility:hidden] ${
                  isFlipped ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
                }`}>
                  <span className="text-8xl font-display text-white filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    {currentItem.char}
                  </span>
                  
                  <span className="text-[10px] font-sans text-indigo-400 bg-indigo-500/10 border border-indigo-500/10 rounded-full px-4 py-1 uppercase font-bold tracking-widest mt-8">
                    Klik atau ketuk kartu untuk membalik
                  </span>
                </div>

                {/* Back Side (Romaji & Audio trigger) */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 [backface-visibility:hidden] transform [transform:rotateY(180deg)] ${
                  isFlipped ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block mb-1">Ejaan Romaji:</span>
                  <span className="text-7xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-amber-300">
                    {currentItem.rom}
                  </span>
                  
                  {/* Visual pronunciation descriptor */}
                  <span className="text-xs text-zinc-400 font-light font-sans mt-3">
                    Dibaca: <strong className="text-white">"{currentItem.rom === 'wo' ? 'o (wo)' : currentItem.rom}"</strong>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid reflipping the card
                      speakKana(currentItem.char);
                    }}
                    className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-white text-slate-950 font-bold font-sans text-xs rounded-full hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
                  >
                    <Volume2 className="w-4 h-4 fill-current text-slate-950 animate-pulse" /> Dengarkan Lafal Asli
                  </button>
                </div>

              </div>

              {/* Handlers navigators below card */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handlePrev}
                  className="p-4 bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl transition-all cursor-pointer text-zinc-400 hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Mark as mastered shortcut badge */}
                <button
                  onClick={() => handleMarkMastered(currentItem)}
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-lg hover:scale-[1.02]"
                >
                  <Check className="w-4 h-4" /> Tandai Paham & Simpan
                </button>

                <button
                  onClick={handleNext}
                  className="p-4 bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl transition-all cursor-pointer text-zinc-400 hover:text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          )}

          {/* QUIZ MATCHING MODE */}
          {trainerMode === 'quiz' && currentItem && (
            <div className="space-y-6 max-w-xl mx-auto animate-fade-rise text-left">
              
              {/* Score ticker panel */}
              <div className="flex justify-between items-center bg-white/2 border border-white/5 p-4 rounded-2xl">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Antrean</span>
                  <span className="text-sm font-semibold text-white font-mono">{currentIndex + 1} / {deck.length}</span>
                </div>

                <div className="flex gap-3 text-right">
                  <div className="bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                    <span className="text-[8px] text-zinc-500 uppercase block leading-tight">Total Skor</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 leading-none">{quizScore} Pt</span>
                  </div>

                  {correctStreak > 0 && (
                    <div className="bg-amber-500/5 px-3 py-1.5 rounded-xl border border-amber-500/10 flex items-center gap-1 text-left">
                      <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
                      <div>
                        <span className="text-[8px] text-zinc-500 uppercase block leading-none">Streak</span>
                        <span className="text-xs font-mono font-bold text-amber-400 leading-none">x{correctStreak}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Prompt Block */}
              <div className="bg-white/3 border border-white/5 rounded-3xl p-8 text-center space-y-4">
                <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-extrabold block">Tebak Ejaan Romaji Karakter Ini</span>
                <span className="text-9xl font-display text-white block select-none">
                  {currentItem.char}
                </span>

                <button
                  onClick={() => speakKana(currentItem.char)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-full transition-all cursor-pointer text-zinc-300 inline-flex items-center gap-1.5 text-xs"
                >
                  <Volume2 className="w-4 h-4" /> Mainkan Bunyi Suara
                </button>
              </div>

              {/* Choices grid */}
              <div className="grid grid-cols-2 gap-3">
                {quizOptions.map((opt, idx) => {
                  const isOptionChosen = quizSelectedAnswer === opt;
                  const isActualAnswer = opt === currentItem.rom;

                  let style = "bg-white/2 hover:bg-white/5 border-white/5 text-zinc-300";
                  if (quizAnswered) {
                    if (isActualAnswer) {
                      style = "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold scale-[1.01]";
                    } else if (isOptionChosen) {
                      style = "bg-rose-500/15 border-rose-500/50 text-rose-300 font-bold line-through";
                    } else {
                      style = "bg-slate-900/30 border-white/2 opacity-40 text-zinc-500";
                    }
                  } else if (isOptionChosen) {
                    style = "bg-white border-white text-slate-950 font-bold";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={quizAnswered}
                      onClick={() => handleSelectQuizAnswer(opt)}
                      className={`p-4 rounded-2xl border text-sm cursor-pointer transition-all ${style}`}
                    >
                      <div className="flex gap-2 items-center justify-between">
                        <span className="text-xs uppercase font-mono text-zinc-500">Pilihan {String.fromCharCode(65 + idx)}</span>
                        <span className="text-lg font-mono font-bold leading-none">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback banner */}
              {quizAnswered && (
                <div className="bg-white/3 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-rise">
                  <div>
                    {quizIsCorrect ? (
                      <div className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                        <Check className="w-4 h-4 text-emerald-400" /> Jawaban Anda Benar! (+10 Poin)
                      </div>
                    ) : (
                      <div className="text-rose-400 font-bold text-sm">
                        ❌ Salah! Kunci jawaban adalah: <strong className="font-mono underline text-white font-black text-base">{currentItem.rom}</strong>
                      </div>
                    )}
                    <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                      Karakter <strong className="text-zinc-200">"{currentItem.char}"</strong> merepresentasikan penyebutan bunyi bahasa Jepang <strong className="text-zinc-200">"{currentItem.rom}"</strong>.
                    </p>
                  </div>

                  <button
                    onClick={handleNext}
                    className="bg-white hover:bg-zinc-200 text-slate-950 font-bold font-sans text-xs px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-lg flex items-center gap-1 self-stretch sm:self-auto justify-center shrink-0"
                  >
                    Pertanyaan Lanjut <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ACTIVE DRAWING CANVAS MODE */}
          {trainerMode === 'canvas' && currentItem && (
            <div className="space-y-6 max-w-xl mx-auto animate-fade-rise text-left">
              
              <div className="bg-white/2 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Metode Belajar</span>
                  <span className="text-xs font-semibold text-white">Visualisasi Kinestetik Karakter Kana</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => speakKana(currentItem.char)}
                    className="px-3.5 py-1.5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 text-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Lafalkan
                  </button>
                  <button
                    onClick={clearCanvas}
                    className="px-3.5 py-1.5 bg-rose-500/5 hover:bg-rose-500/15 border border-rose-500/10 hover:border-rose-500/30 rounded-xl text-rose-300 text-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Bersihkan
                  </button>
                </div>
              </div>

              {/* Main Canvas sandbox and compare overlay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Referensi box */}
                <div className="bg-white/3 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center relative select-none">
                  <span className="absolute top-2 left-2 text-[8px] bg-white/5 border border-white/5 text-zinc-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    1. Pola Model Karakter
                  </span>

                  <span className="text-9xl text-white font-display select-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]">
                    {currentItem.char}
                  </span>

                  <div className="mt-4 text-center space-y-1">
                    <span className="text-xs font-mono font-bold text-zinc-300 block">Romaji: {currentItem.rom}</span>
                    <span className="text-[10px] text-zinc-400 font-light block font-sans">Perhatikan bentuk goresan guratan dasar di atas sebelum melukisnya.</span>
                  </div>
                </div>

                {/* Interactive Drawing area */}
                <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-4 flex flex-col items-center justify-center relative min-h-64">
                  <span className="absolute top-2 left-2 text-[8px] bg-white/5 border border-white/5 text-indigo-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    2. Canvas Goresan Tulis
                  </span>

                  <canvas
                    ref={canvasRef}
                    width={220}
                    height={220}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="bg-[#0b0f19] border border-white/5 rounded-2xl cursor-crosshair touch-none transition-shadow hover:shadow-[0_0_15px_rgba(129,140,248,0.1)] shrink-0 w-[220px] h-[220px]"
                  />

                  <span className="text-[9px] text-zinc-500 font-light text-center mt-3 font-sans leading-tight">
                    Tekan, seret, dan gerakkan mouse atau jari Anda di atas kanvas untuk melukis aksara.
                  </span>
                </div>

              </div>

              {/* Navigation launcher */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => { clearCanvas(); handlePrev(); }}
                  className="px-5 py-3 bg-white/2 hover:bg-white/5 border border-white/5 text-zinc-400 hover:text-white rounded-2xl transition-all cursor-pointer text-xs uppercase tracking-wider font-semibold"
                >
                  Kembali
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (onIncrementStreak) {
                        onIncrementStreak();
                        playBeep(880);
                      }
                      clearCanvas();
                      handleNext();
                    }}
                    className="px-6 py-3 bg-indigo-600 border border-indigo-500 hover:bg-indigo-500 text-white font-semibold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-lg hover:scale-[1.02]"
                  >
                    Paham & Lanjut <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
