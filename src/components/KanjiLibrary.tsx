import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Search, Check, RefreshCw, Eye, BookOpen, Edit2, 
  Trash2, ChevronRight, HelpCircle, Award, Sparkles, Filter 
} from 'lucide-react';
import { KANJI_DATA, KanjiEntry } from '../data/kanji';

interface KanjiLibraryProps {
  onTriggerSound?: (freq: number) => void;
  onIncrementStreak?: () => void;
  onAddXP?: (amount: number) => void;
  onUnlockBadge?: (badgeName: string) => void;
}

export default function KanjiLibrary({ onTriggerSound, onIncrementStreak, onAddXP, onUnlockBadge }: KanjiLibraryProps) {
  // Tabs: 'browse' | 'quiz' | 'tulis'
  const [subMode, setSubMode] = useState<'browse' | 'quiz' | 'tulis'>('browse');
  
  // Filtering and Searching
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | 'N5' | 'N4'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKanji, setSelectedKanji] = useState<KanjiEntry | null>(KANJI_DATA[0] || null);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Kanji stroke tracing and validation states
  const [currentStrokeIdx, setCurrentStrokeIdx] = useState<number>(0);
  const [hasDrawnCurrentStroke, setHasDrawnCurrentStroke] = useState<boolean>(false);
  const [strokesCompleted, setStrokesCompleted] = useState<boolean>(false);
  const [showSampleShadow, setShowSampleShadow] = useState<boolean>(true);

  // Reset stroke tracking when tab or kanji changes
  useEffect(() => {
    setCurrentStrokeIdx(0);
    setHasDrawnCurrentStroke(false);
    setStrokesCompleted(false);
  }, [selectedKanji, subMode]);

  // Quiz state
  const [quizPool, setQuizPool] = useState<KanjiEntry[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<string | null>(null);
  const [quizIsCorrect, setQuizIsCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Play Sound helper
  const playBeep = (freq = 440) => {
    if (onTriggerSound) {
      onTriggerSound(freq);
    }
  };

  // Filter Kanji list based on settings
  const filteredKanji = KANJI_DATA.filter(item => {
    const matchLevel = selectedLevel === 'ALL' || item.level === selectedLevel;
    const matchSearch = item.kanji.includes(searchQuery) || 
                        item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.onyomi.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.kunyomi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLevel && matchSearch;
  });

  // Keep selected Kanji safe when filtered list changes
  useEffect(() => {
    if (filteredKanji.length > 0 && !filteredKanji.includes(selectedKanji!)) {
      setSelectedKanji(filteredKanji[0]);
    }
  }, [selectedLevel, searchQuery]);

  // Handle Speech synthesis of Kanji characters / words
  const speakText = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ja-JP';
        utter.rate = 0.8;
        window.speechSynthesis.speak(utter);
      }
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
    playBeep(600);
  };

  // Canvas Stroke initialization
  useEffect(() => {
    if (subMode !== 'tulis') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#38bdf8'; // Sky blue stroke for kanji writing
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 12;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#0284c7';
  }, [subMode, selectedKanji]);

  // Drawing helper methods
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
      e.preventDefault();
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawnCurrentStroke(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    playBeep(180);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnCurrentStroke(false);
    setCurrentStrokeIdx(0);
    setStrokesCompleted(false);
  };

  const handleValidateStroke = () => {
    if (!selectedKanji) return;
    if (!hasDrawnCurrentStroke) {
      playBeep(220); // alert sound
      return;
    }

    const nextIdx = currentStrokeIdx + 1;
    if (nextIdx >= selectedKanji.strokes) {
      setStrokesCompleted(true);
      setCurrentStrokeIdx(selectedKanji.strokes);
      playBeep(880);
      setTimeout(() => playBeep(1200), 120);
      if (onAddXP) {
        onAddXP(30);
      }
      if (onUnlockBadge) {
        onUnlockBadge('Scribe Master ✍️');
      }
    } else {
      playBeep(520 + currentStrokeIdx * 60);
      setCurrentStrokeIdx(nextIdx);
      setHasDrawnCurrentStroke(false);
    }
  };

  // Initialize Quiz Game Pool
  const startQuiz = () => {
    playBeep(880);
    const shuffled = [...KANJI_DATA].sort(() => Math.random() - 0.5);
    setQuizPool(shuffled);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswered(false);
    setQuizSelectedAnswer(null);
    generateQuizOptions(shuffled[0], shuffled);
    setSubMode('quiz');
  };

  const generateQuizOptions = (current: KanjiEntry, all: KanjiEntry[]) => {
    const distractors = all
      .filter(item => item.kanji !== current.kanji)
      .map(item => item.meaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const generated = [...distractors, current.meaning].sort(() => Math.random() - 0.5);
    setQuizOptions(generated);
  };

  const handleSelectQuizOption = (opt: string) => {
    if (quizAnswered || !quizPool[quizIndex]) return;
    const current = quizPool[quizIndex];
    setQuizSelectedAnswer(opt);
    setQuizAnswered(true);

    const isCorrect = opt === current.meaning;
    setQuizIsCorrect(isCorrect);

    if (isCorrect) {
      playBeep(880);
      setQuizScore(prev => prev + 10);
      if (onIncrementStreak) {
        onIncrementStreak();
      }
    } else {
      playBeep(180);
    }
  };

  const loadNextQuiz = () => {
    playBeep(580);
    const nextIdx = quizIndex + 1;
    if (nextIdx >= quizPool.length) {
      // Re-shuffled reset
      const reshuffled = [...KANJI_DATA].sort(() => Math.random() - 0.5);
      setQuizPool(reshuffled);
      setQuizIndex(0);
      setQuizAnswered(false);
      setQuizSelectedAnswer(null);
      generateQuizOptions(reshuffled[0], reshuffled);
    } else {
      setQuizIndex(nextIdx);
      setQuizAnswered(false);
      setQuizSelectedAnswer(null);
      generateQuizOptions(quizPool[nextIdx], quizPool);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upper header title with descriptive label */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h2 className="text-3xl font-display text-white font-normal mb-1 flex items-center gap-2">
            Kanji Library N5 & N4
          </h2>
          <p className="text-xs text-zinc-400 font-light font-sans max-w-xl">
            Modul perpustakaan kanji interaktif, lengkap dengan cara baca Onyomi & Kunyomi, arti dalam bahasa Indonesia, panduan urutan coretan (stroke steps), dan kuis tebakan makna.
          </p>
        </div>

        {/* Learning Sub-tabs */}
        <div className="flex bg-white/2 border border-white/5 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => { playBeep(440); setSubMode('browse'); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              subMode === 'browse'
                ? 'bg-white text-slate-950 font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Telusuri Kamus
          </button>
          
          <button
            onClick={() => { playBeep(490); setSubMode('tulis'); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              subMode === 'tulis'
                ? 'bg-white text-slate-950 font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" /> Latihan Menulis
          </button>

          <button
            onClick={startQuiz}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              subMode === 'quiz'
                ? 'bg-white text-slate-950 font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Kuis Kanji
          </button>
        </div>
      </div>

      {/* ======================================= */}
      {/* BROWSE MODE: DOCK AND DETAILS VIEW PANEL */}
      {/* ======================================= */}
      {subMode === 'browse' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left panel: Search filter + Kanji list */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            <div className="bg-white/2 border border-white/5 p-4 rounded-2xl space-y-4 text-left">
              <span className="text-[10px] text-zinc-500 uppercase font-sans font-bold tracking-wider block">Navigasi Filter</span>
              
              <div className="flex gap-2">
                {['ALL', 'N5', 'N4'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => { playBeep(320); setSelectedLevel(lvl as any); }}
                    className={`flex-1 py-2 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${
                      selectedLevel === lvl
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/45'
                        : 'bg-white/2 hover:bg-white/5 border-white/5 text-zinc-400'
                    }`}
                  >
                    {lvl === 'ALL' ? 'Semua' : lvl}
                  </button>
                ))}
              </div>

              {/* Search input bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Cari Kanji, arti, atau cara baca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/40 hover:bg-slate-950/60 border border-white/5 focus:border-indigo-400 placeholder-zinc-500 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none transition-all font-sans"
                />
              </div>
            </div>

            {/* Scrolling list panel */}
            <div className="bg-white/2 border border-white/5 p-4 rounded-2xl flex-1 max-h-[500px] overflow-y-auto space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase font-sans font-bold tracking-wider block text-left mb-2">
                Daftar Kanji ({filteredKanji.length} ditemukan)
              </span>

              {filteredKanji.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs font-sans">
                  Kanji tidak ditemukan. Coba ganti filter atau kata pencarian.
                </div>
              ) : (
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
                  {filteredKanji.map((item) => {
                    const isSelected = selectedKanji?.kanji === item.kanji;
                    return (
                      <button
                        key={item.kanji}
                        onClick={() => { playBeep(380); setSelectedKanji(item); }}
                        className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-500/10 border-indigo-400 text-white shadow'
                            : 'bg-white/2 hover:bg-white/5 border-white/5 text-zinc-300 hover:text-white'
                        }`}
                      >
                        <span className="text-3xl font-display block mb-1">{item.kanji}</span>
                        <div className="flex items-center justify-between gap-1 text-[8px] uppercase tracking-wider font-mono">
                          <span className={`${item.level === 'N5' ? 'text-teal-400' : 'text-rose-400'}`}>
                            {item.level}
                          </span>
                          <span className="text-zinc-500 truncate max-w-[50px]">{item.meaning}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right panel: Full inspect details */}
          <div className="lg:col-span-7">
            {selectedKanji ? (
              <div className="liquid-glass border border-white/5 p-6 sm:p-8 rounded-3xl text-left space-y-6">
                
                {/* Upper block with Huge Symbol */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-5">
                    
                    {/* Big glowing Kanji box */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-950/50 border border-white/10 flex items-center justify-center relative shrink-0">
                      <span className="text-6xl sm:text-7xl font-display text-white select-none filter drop-shadow-[0_0_10px_rgba(255,255,255,0.08)]">
                        {selectedKanji.kanji}
                      </span>
                      <span className={`absolute top-1.5 left-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded ${
                        selectedKanji.level === 'N5' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/10' : 'bg-rose-500/20 text-rose-300 border border-rose-500/10'
                      }`}>
                        {selectedKanji.level}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{selectedKanji.meaning}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-zinc-500 font-sans">Jumlah Coretan:</span>
                        <span className="text-xs font-mono font-bold text-sky-450">{selectedKanji.strokes} Stroke</span>
                      </div>
                      <button
                        onClick={() => speakText(selectedKanji.kanji)}
                        className="p-1 px-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] transition-all cursor-pointer inline-flex items-center gap-1.5 text-zinc-200 mt-1"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Lafalkan Kanji
                      </button>
                    </div>

                  </div>
                </div>

                {/* Grid for readings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-white/2 space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-400 block">Onyomi Cara Baca Cina (Katakana)</span>
                    <span className="text-xs font-semibold text-white block leading-relaxed">{selectedKanji.onyomi}</span>
                  </div>

                  <div className="bg-slate-950/40 p-4 rounded-xl border border-white/2 space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-amber-400 block">Kunyomi Cara Baca Jepang (Hiragana)</span>
                    <span className="text-xs font-semibold text-white block leading-relaxed">{selectedKanji.kunyomi}</span>
                  </div>
                </div>

                {/* Stroke steps breakdown list */}
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-sans font-bold tracking-wider block">Goresan Menulis (Stroke Order Steps)</span>
                  <div className="bg-white/1 border border-white/2 rounded-xl p-4 space-y-2">
                    {selectedKanji.strokeSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs font-sans leading-relaxed text-zinc-300">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 font-mono text-[9px] font-black text-indigo-300">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example sentence & word applications */}
                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-500 uppercase font-sans font-bold tracking-wider block">Kosakata & Contoh Penggunaan Praktis</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedKanji.examples.map((ex, i) => (
                      <div 
                        key={i} 
                        className="bg-white/2 hover:bg-white/4 border border-white/5 p-3.5 rounded-xl transition-all cursor-pointer text-left flex justify-between items-center gap-3"
                        onClick={() => speakText(ex.word)}
                      >
                        <div className="space-y-1">
                          <span className="text-base font-bold text-white block">{ex.word}</span>
                          <span className="text-[10px] text-zinc-400 block font-mono bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 max-w-max">
                            {ex.kana}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-sans block leading-snug">{ex.meaning}</span>
                        </div>
                        <Volume2 className="w-4 h-4 text-zinc-500 shrink-0 hover:text-white" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500 font-sans border border-dashed border-white/10 rounded-2xl">
                Pilih kanji dari panel kiri untuk melihat informasi selengkapnya.
              </div>
            )}
          </div>

        </div>
      )}

      {/* ================================== */}
      {/* TULIS MODE: DIRECT CANVAS PRACTICES */}
      {/* ================================== */}
      {subMode === 'tulis' && selectedKanji && (
        <div className="space-y-6 max-w-2xl mx-auto animate-fade-rise text-left">
          
          <div className="bg-white/2 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Latihan Menulis Kanji</span>
              <span className="text-xs font-semibold text-white font-sans">
                Melatih guratan tangan dengan menulis karakter <strong className="text-indigo-400">"{selectedKanji.kanji}"</strong>.
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => speakText(selectedKanji.kanji)}
                className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 text-xs transition-all cursor-pointer flex items-center gap-1 text-zinc-200"
              >
                <Volume2 className="w-3.5 h-3.5" /> Lafalkan
              </button>
              <button
                onClick={clearCanvas}
                className="px-3 py-1.5 bg-rose-500/5 hover:bg-rose-500/15 border border-rose-500/10 hover:border-rose-500/30 rounded-xl text-rose-300 text-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Bersihkan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Guide box with stroke details */}
            <div className="bg-white/3 border border-white/5 rounded-3xl p-6 flex flex-col justify-between relative min-h-[320px]">
              <span className="absolute top-2 left-2 text-[8px] bg-white/5 text-zinc-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                1. Instruksi Model & Urutan Goresan
              </span>

              <div className="flex flex-col items-center justify-center flex-1 py-4">
                <span className="text-8xl text-white font-display select-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.08)] mb-1">
                  {selectedKanji.kanji}
                </span>
                <span className="text-xs font-mono text-zinc-400 mb-4">
                  Total {selectedKanji.strokes} goresan utama
                </span>

                {/* Checklist of all steps */}
                <div className="w-full space-y-1.5 text-left text-[11px] max-h-[120px] overflow-y-auto pr-1">
                  {selectedKanji.strokeSteps.map((step, idx) => {
                    const isCurrent = idx === currentStrokeIdx;
                    const isPassed = idx < currentStrokeIdx;
                    return (
                      <div 
                        key={idx}
                        className={`p-2 rounded-xl border flex items-start gap-2 transition-all ${
                          isCurrent 
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200 font-bold ring-1 ring-indigo-500/20' 
                            : isPassed 
                              ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400/80 opacity-60' 
                              : 'bg-white/2 border-white/5 text-zinc-500'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full font-mono text-[9px] flex items-center justify-center shrink-0 ${
                          isCurrent 
                            ? 'bg-indigo-400 text-slate-950 font-black' 
                            : isPassed 
                              ? 'bg-emerald-500/20 text-emerald-300' 
                              : 'bg-white/5 text-zinc-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Toggle to show shadow on canvas */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[10px] text-zinc-400 font-sans">Model Bayangan (Shadow Model)</span>
                <button
                  type="button"
                  onClick={() => { playBeep(330); setShowSampleShadow(!showSampleShadow); }}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                    showSampleShadow 
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30' 
                      : 'bg-white/5 text-zinc-500 border border-white/5'
                  }`}
                >
                  {showSampleShadow ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>
            </div>

            {/* Practical Canvas Drawing Space */}
            <div className="bg-slate-950/85 border border-white/10 rounded-3xl p-5 flex flex-col items-center justify-center relative min-h-[320px] overflow-hidden">
              <span className="absolute top-2 left-2 text-[8px] bg-sky-500/10 text-sky-350 border border-sky-500/10 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                2. Canvas Praktek Goresan ({currentStrokeIdx}/{selectedKanji.strokes})
              </span>

              {/* Complete state success overlay */}
              {strokesCompleted ? (
                <div className="absolute inset-0 bg-[#070b13]/95 flex flex-col items-center justify-center p-6 text-center z-10 animate-fade-rise">
                  <Sparkles className="w-12 h-12 text-yellow-300 animate-bounce mb-3" />
                  <h4 className="text-lg font-bold text-white mb-1">Goresan Terverifikasi! 🎉</h4>
                  <p className="text-xs text-zinc-400 font-light max-w-xs mb-4">
                    Selamat! Anda berhasil menulis karakter kanji <strong className="text-white">"{selectedKanji.kanji}"</strong> ({selectedKanji.meaning}) dengan sisa urutan goresan yang tepat dan akurat!
                  </p>
                  <div className="bg-emerald-500/15 border border-emerald-500/20 rounded-xl px-4 py-2 font-mono text-emerald-300 text-xs font-bold mb-4">
                    Bonus +30 XP Diperoleh
                  </div>
                  <button
                    onClick={() => {
                      clearCanvas();
                    }}
                    className="px-4 py-2 bg-white text-slate-950 font-bold font-sans text-xs rounded-xl hover:bg-zinc-200 transition-all cursor-pointer shadow"
                  >
                    Tulis Ulang Kanji Ini
                  </button>
                </div>
              ) : null}

              {/* Canvas Interactive Section */}
              <div className="relative w-[210px] h-[210px] bg-[#0b0f19] border border-white/5 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(30,41,59,0.5)]">
                
                {/* Kanji Overlay transparent shadow */}
                {showSampleShadow && !strokesCompleted && (
                  <span className="absolute inset-0 font-display text-8xl text-white/5 select-none pointer-events-none flex items-center justify-center select-none">
                    {selectedKanji.kanji}
                  </span>
                )}

                <canvas
                  ref={canvasRef}
                  width={210}
                  height={210}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="absolute inset-0 cursor-crosshair touch-none transition-shadow hover:shadow-[0_0_15px_rgba(56,189,248,0.1)] w-[210px] h-[210px]"
                />
              </div>

              {/* Action Buttons to Validate details */}
              <div className="w-full mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleValidateStroke}
                  disabled={strokesCompleted}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    hasDrawnCurrentStroke 
                      ? 'bg-sky-500 hover:bg-sky-450 text-white shadow-lg shadow-sky-500/20' 
                      : 'bg-white/5 border border-white/5 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" /> Verifikasi Goresan Ke-{currentStrokeIdx + 1}
                </button>

                <p className="text-[9px] text-zinc-500 font-light text-center leading-relaxed">
                  Digores? {hasDrawnCurrentStroke ? '🟢 Terdeteksi' : '⚪ Belum ada guratan harian'}. Selesai melukis goresan saat ini sesuai petunjuk model langkah-demi-langkah, klik 'Verifikasi Coretan' di atas.
                </p>
              </div>

            </div>

          </div>

          <div className="flex justify-between items-center bg-white/2 border border-white/5 p-4 rounded-xl">
            <span className="text-xs text-zinc-400 font-sans">
              Mari ganti kanji latihan melalui tab 'Telusuri Kamus' jika ingin berlatih menulis aksara kanji yang lain.
            </span>
            <button
              onClick={() => {
                if (onIncrementStreak) {
                  onIncrementStreak();
                  playBeep(880);
                }
                clearCanvas();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow"
            >
              Simpan & Lanjut <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ======================================= */}
      {/* KUIS MODE: MULTIPLE CHOICE KANJI GUESS */}
      {/* ======================================= */}
      {subMode === 'quiz' && quizPool.length > 0 && quizPool[quizIndex] && (() => {
        const current = quizPool[quizIndex];
        return (
          <div className="space-y-6 max-w-xl mx-auto animate-fade-rise text-left">
            
            {/* Scoring state panel */}
            <div className="flex justify-between items-center bg-white/2 border border-white/5 p-4 rounded-2xl">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Antrean Kuis</span>
                <span className="text-sm font-semibold text-white font-mono">{quizIndex + 1} / {quizPool.length} Kanji</span>
              </div>

              <div className="bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/10 text-right">
                <span className="text-[8px] text-zinc-500 uppercase block leading-tight">Total Skor Kuis</span>
                <span className="text-xs font-mono font-bold text-emerald-400 leading-none">{quizScore} Pt</span>
              </div>
            </div>

            {/* Prompt Card */}
            <div className="bg-white/3 border border-white/5 rounded-3xl p-8 text-center space-y-4">
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-extrabold block">Tebak Arti Makna Huruf Kanji Ini</span>
              <span className="text-8xl font-display text-white block select-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                {current.kanji}
              </span>

              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-4 text-xs font-sans text-zinc-400">
                  <span>Onyomi: <strong>{current.onyomi}</strong></span>
                  <span>Kun-yomi: <strong>{current.kunyomi}</strong></span>
                </div>
                <button
                  onClick={() => speakText(current.kanji)}
                  className="p-1 px-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-all cursor-pointer text-zinc-300 inline-flex items-center gap-1.5 text-[10px]"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Putar Bunyi
                </button>
              </div>
            </div>

            {/* Answer select options */}
            <div className="grid grid-cols-2 gap-3">
              {quizOptions.map((opt, i) => {
                const isSelected = quizSelectedAnswer === opt;
                const isCorrectOpt = opt === current.meaning;

                let btnStyle = "bg-white/2 hover:bg-white/5 border-white/5 text-zinc-300";
                if (quizAnswered) {
                  if (isCorrectOpt) {
                    btnStyle = "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold scale-[1.01]";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-500/15 border-rose-500/50 text-rose-300 font-bold line-through";
                  } else {
                    btnStyle = "bg-slate-900/30 border-white/2 opacity-40 text-zinc-500";
                  }
                } else if (isSelected) {
                  btnStyle = "bg-white border-white text-slate-950 font-bold";
                }

                return (
                  <button
                    key={i}
                    disabled={quizAnswered}
                    onClick={() => handleSelectQuizOption(opt)}
                    className={`p-4 rounded-2xl border text-sm cursor-pointer transition-all ${btnStyle}`}
                  >
                    <div className="flex justify-between items-center gap-2 w-full">
                      <span className="text-xs uppercase font-mono text-zinc-500">Opsi {String.fromCharCode(65 + i)}</span>
                      <span className="font-sans font-bold leading-none">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Answer Feed back screen footer */}
            {quizAnswered && (
              <div className="bg-white/3 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-rise">
                <div>
                  {quizIsCorrect ? (
                    <div className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-400" /> Jawaban Tepat! (+10 Poin)
                    </div>
                  ) : (
                    <div className="text-rose-400 font-bold text-sm">
                      ❌ Salah! Kunci jawaban: <strong className="underline text-white font-black">{current.meaning}</strong>
                    </div>
                  )}
                  <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                    Kanji <strong className="text-zinc-200">"{current.kanji}"</strong> berarti <strong className="text-zinc-200">"{current.meaning}"</strong>, dibaca kunyomi: {current.kunyomi}.
                  </p>
                </div>

                <button
                  onClick={loadNextQuiz}
                  className="bg-white hover:bg-zinc-200 text-slate-950 font-bold font-sans text-xs px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-lg flex items-center gap-1 self-stretch sm:self-auto justify-center shrink-0"
                >
                  Kanji Berikutnya <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        );
      })()}

    </div>
  );
}
