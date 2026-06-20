/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Volume2, BookOpen, Award, Smile, Gamepad2, Check, ChevronRight, 
  Sparkles, RotateCcw, ArrowLeft, Clock, Brain, AlertTriangle, ShieldCheck, Trophy, Globe, Flame
} from 'lucide-react';
import { UNGKAPAN_KELAS_SALAM, VOCABULARY_DATA, PARTICLE_QUESTIONS, SENTENCE_PUZZLES } from '../data';

interface ClassroomProps {
  onBackToLanding: () => void;
  isFocusModeActive: boolean;
}

export default function Classroom({ onBackToLanding, isFocusModeActive }: ClassroomProps) {
  const [activeTab, setActiveTab] = useState<'kana' | 'materi' | 'game' | 'tips'>('kana');
  const [kanaType, setKanaType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [kanaSubTab, setKanaSubTab] = useState<'dasar' | 'varian' | 'kombinasi'>('dasar');

  // Interactive Game Leveling State
  const [gameDifficulty, setGameDifficulty] = useState<number>(1); // Level 1 to 4
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [showResult, setShowResult] = useState<boolean>(false);

  // Lesson states
  const [selectedLesson, setSelectedLesson] = useState<number>(1);
  const [activeSectionUnderLesson, setActiveSectionUnderLesson] = useState<'kosakata' | 'tata' | 'dialog' | 'latihan'>('kosakata');
  const [streakCount, setStreakCount] = useState<number>(12);

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

  // ==========================================
  // KANA TABLE DEFINITIONS
  // ==========================================
  const KANA_DATA = {
    hiragana: {
      dasar: [
        { char: 'あ', rom: 'a' }, { char: 'い', rom: 'i' }, { char: 'う', rom: 'u' }, { char: 'え', rom: 'e' }, { char: 'お', rom: 'o' },
        { char: 'か', rom: 'ka' }, { char: 'き', rom: 'ki' }, { char: 'く', rom: 'ku' }, { char: 'け', rom: 'ke' }, { char: 'こ', rom: 'ko' },
        { char: 'さ', rom: 'sa' }, { char: 'し', rom: 'shi' }, { char: 'す', rom: 'su' }, { char: 'せ', rom: 'se' }, { char: 'そ', rom: 'so' },
        { char: 'た', rom: 'ta' }, { char: 'ち', rom: 'chi' }, { char: 'つ', rom: 'tsu' }, { char: 'て', rom: 'te' }, { char: 'と', rom: 'to' },
        { char: 'な', rom: 'na' }, { char: 'に', rom: 'ni' }, { char: 'ぬ', rom: 'nu' }, { char: 'ね', rom: 'ne' }, { char: 'の', rom: 'no' },
        { char: 'は', rom: 'ha' }, { char: 'ひ', rom: 'hi' }, { char: 'ふ', rom: 'fu' }, { char: 'へ', rom: 'he' }, { char: 'ほ', rom: 'ho' },
        { char: 'ま', rom: 'ma' }, { char: 'み', rom: 'mi' }, { char: 'む', rom: 'mu' }, { char: 'め', rom: 'me' }, { char: 'も', rom: 'mo' },
        { char: 'や', rom: 'ya' }, { char: '—', rom: '' }, { char: 'ゆ', rom: 'yu' }, { char: '—', rom: '' }, { char: 'よ', rom: 'yo' },
        { char: 'ら', rom: 'ra' }, { char: 'り', rom: 'ri' }, { char: 'る', rom: 'ru' }, { char: 'れ', rom: 're' }, { char: 'ろ', rom: 'ro' },
        { char: 'わ', rom: 'wa' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: 'を', rom: 'wo' },
        { char: 'ん', rom: 'n' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: '—', rom: '' }
      ],
      varian: [
        { char: 'が', rom: 'ga' }, { char: 'ぎ', rom: 'gi' }, { char: 'ぐ', rom: 'gu' }, { char: 'げ', rom: 'ge' }, { char: 'ご', rom: 'go' },
        { char: 'ざ', rom: 'za' }, { char: 'じ', rom: 'ji' }, { char: 'ず', rom: 'zu' }, { char: 'ぜ', rom: 'ze' }, { char: 'ぞ', rom: 'zo' },
        { char: 'だ', rom: 'da' }, { char: 'ぢ', rom: 'di' }, { char: 'づ', rom: 'du' }, { char: 'で', rom: 'de' }, { char: 'ど', rom: 'do' },
        { char: 'ば', rom: 'ba' }, { char: 'び', rom: 'bi' }, { char: 'ぶ', rom: 'bu' }, { char: 'べ', rom: 'be' }, { char: 'ぼ', rom: 'bo' },
        { char: 'ぱ', rom: 'pa' }, { char: 'ぴ', rom: 'pi' }, { char: 'ぷ', rom: 'pu' }, { char: 'ぺ', rom: 'pe' }, { char: 'ぽ', rom: 'po' }
      ],
      kombinasi: [
        { char: 'きゃ', rom: 'kya' }, { char: 'きゅ', rom: 'kyu' }, { char: 'きょ', rom: 'kyo' },
        { char: 'しゃ', rom: 'sha' }, { char: 'しゅ', rom: 'shu' }, { char: 'しょ', rom: 'sho' },
        { char: 'ちゃ', rom: 'cha' }, { char: 'ちゅ', rom: 'chu' }, { char: 'ちょ', rom: 'cho' },
        { char: 'にゃ', rom: 'nya' }, { char: 'にゅ', rom: 'nyu' }, { char: 'にょ', rom: 'nyo' },
        { char: 'ひゃ', rom: 'hya' }, { char: 'ひゅ', rom: 'hyu' }, { char: 'ひょ', rom: 'hyo' },
        { char: 'みゃ', rom: 'mya' }, { char: 'みゅ', rom: 'myu' }, { char: 'みょ', rom: 'myo' },
        { char: 'りゃ', rom: 'rya' }, { char: 'りゅ', rom: 'ryu' }, { char: 'りょ', rom: 'ryo' },
        { char: 'ぎゃ', rom: 'gya' }, { char: 'ぎゅ', rom: 'gyu' }, { char: 'ぎょ', rom: 'gyo' },
        { char: 'じゃ', rom: 'jya' }, { char: 'じゅ', rom: 'jyu' }, { char: 'じょ', rom: 'jyo' },
        { char: 'びゃ', rom: 'bya' }, { char: 'びゅ', rom: 'byu' }, { char: 'びょ', rom: 'byo' },
        { char: 'ぴゃ', rom: 'pya' }, { char: 'ぴゅ', rom: 'pyu' }, { char: 'ぴょ', rom: 'pyo' }
      ]
    },
    katakana: {
      dasar: [
        { char: 'ア', rom: 'a' }, { char: 'イ', rom: 'i' }, { char: 'ウ', rom: 'u' }, { char: 'エ', rom: 'e' }, { char: 'オ', rom: 'o' },
        { char: 'カ', rom: 'ka' }, { char: 'キ', rom: 'ki' }, { char: 'ク', rom: 'ku' }, { char: 'ケ', rom: 'ke' }, { char: 'コ', rom: 'ko' },
        { char: 'サ', rom: 'sa' }, { char: 'シ', rom: 'shi' }, { char: 'ス', rom: 'su' }, { char: 'セ', rom: 'se' }, { char: 'ソ', rom: 'so' },
        { char: 'タ', rom: 'ta' }, { char: 'チ', rom: 'chi' }, { char: 'ツ', rom: 'tsu' }, { char: 'テ', rom: 'te' }, { char: 'ト', rom: 'to' },
        { char: 'ナ', rom: 'na' }, { char: 'ニ', rom: 'ni' }, { char: 'ヌ', rom: 'nu' }, { char: 'ネ', rom: 'ne' }, { char: 'ノ', rom: 'no' },
        { char: 'ハ', rom: 'ha' }, { char: 'ヒ', rom: 'hi' }, { char: 'フ', rom: 'fu' }, { char: 'ヘ', rom: 'he' }, { char: 'ホ', rom: 'ho' },
        { char: 'マ', rom: 'ma' }, { char: 'ミ', rom: 'mi' }, { char: 'ム', rom: 'mu' }, { char: 'メ', rom: 'me' }, { char: 'モ', rom: 'mo' },
        { char: 'ヤ', rom: 'ya' }, { char: '—', rom: '' }, { char: 'ユ', rom: 'yu' }, { char: '—', rom: '' }, { char: 'ヨ', rom: 'yo' },
        { char: 'ラ', rom: 'ra' }, { char: 'リ', rom: 'ri' }, { char: 'ル', rom: 'ru' }, { char: 'レ', rom: 're' }, { char: 'ロ', rom: 'ro' },
        { char: 'ワ', rom: 'wa' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: 'ヲ', rom: 'wo' },
        { char: 'ン', rom: 'n' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: '—', rom: '' }
      ],
      varian: [
        { char: 'ガ', rom: 'ga' }, { char: 'ギ', rom: 'gi' }, { char: 'グ', rom: 'gu' }, { char: 'ゲ', rom: 'ge' }, { char: 'ゴ', rom: 'go' },
        { char: 'ザ', rom: 'za' }, { char: 'ジ', rom: 'ji' }, { char: 'ズ', rom: 'zu' }, { char: 'ゼ', rom: 'ze' }, { char: 'ゾ', rom: 'zo' },
        { char: 'ダ', rom: 'da' }, { char: 'ヂ', rom: 'di' }, { char: 'ヅ', rom: 'du' }, { char: 'デ', rom: 'de' }, { char: 'ド', rom: 'do' },
        { char: 'バ', rom: 'ba' }, { char: 'ビ', rom: 'bi' }, { char: 'ブ', rom: 'bu' }, { char: 'ベ', rom: 'be' }, { char: 'ボ', rom: 'bo' },
        { char: 'パ', rom: 'pa' }, { char: 'ピ', rom: 'pi' }, { char: 'プ', rom: 'pu' }, { char: 'ペ', rom: 'pe' }, { char: 'ポ', rom: 'po' }
      ],
      kombinasi: [
        { char: 'キャ', rom: 'kya' }, { char: 'キュ', rom: 'kyu' }, { char: 'キョ', rom: 'kyo' },
        { char: 'シャ', rom: 'sha' }, { char: 'シュ', rom: 'shu' }, { char: 'ショ', rom: 'sho' },
        { char: 'チャ', rom: 'cha' }, { char: 'チュ', rom: 'chu' }, { char: 'チョ', rom: 'cho' },
        { char: 'ニャ', rom: 'nya' }, { char: 'ニュ', rom: 'nyu' }, { char: 'ニョ', rom: 'nyo' },
        { char: 'ヒャ', rom: 'hya' }, { char: 'ヒュ', rom: 'hyu' }, { char: 'ヒョ', rom: 'hyo' },
        { char: 'ミャ', rom: 'mya' }, { char: 'ミュ', rom: 'myu' }, { char: 'ミョ', rom: 'myo' },
        { char: 'リャ', rom: 'rya' }, { char: 'リュ', rom: 'ryu' }, { char: 'リョ', rom: 'ryo' },
        { char: 'ギャ', rom: 'gya' }, { char: 'ギュ', rom: 'gyu' }, { char: 'ギョ', rom: 'gyo' },
        { char: 'ジャ', rom: 'jya' }, { char: 'ジュ', rom: 'jyu' }, { char: 'ジョ', rom: 'jyo' },
        { char: 'ビャ', rom: 'bya' }, { char: 'ビュ', rom: 'byu' }, { char: 'ビョ', rom: 'byo' },
        { char: 'ピャ', rom: 'pya' }, { char: 'ピュ', rom: 'pyu' }, { char: 'ピョ', rom: 'pyo' }
      ]
    }
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { id: 'kana', label: 'Tabel Kana Lengkap', icon: <Globe className="w-4 h-4" /> },
          { id: 'materi', label: 'Materi Komplit & Detail', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'game', label: 'Tantangan Game Pro', icon: <Gamepad2 className="w-4 h-4" /> },
          { id: 'tips', label: 'Panduan Guru Profesional', icon: <Smile className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { triggerTick(440); setActiveTab(tab.id as any); }}
            className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider cursor-pointer ${
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

      {/* ======================================================== */}
      {/* MODULE 2: MATERI KOMPLIT & DETAIL (MINNA NO NIHONGO CH) */}
      {/* ======================================================== */}
      {activeTab === 'materi' && (
        <div id="classroom-materi-module" className="animate-fade-rise space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar list of complete lessons based on user's PRD requirements */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold px-1">Indeks Pelajaran Inti</span>
              
              {[
                { num: 1, title: 'Bab 1 — Salam Kenal!', subtitle: 'X wa Y desu (Perkenalan Diri)', flag: 'SSW / N5' },
                { num: 2, title: 'Bab 2 — Mohon Bantuan Anda', subtitle: 'Kore, Sore, Are (Kata Benda)', flag: 'SSW / N5' },
                { num: 3, title: 'Bab 3 — Berapa Harganya?', subtitle: 'Koko, Soko, Asoko (Arah & Harga)', flag: 'N5' },
                { num: 4, title: 'Bab 4 — Pukul Berapa?', subtitle: 'Waktu Harian, Jam, Menit, Hari', flag: 'N5' }
              ].map((les) => (
                <button
                  key={les.num}
                  onClick={() => { triggerTick(220); setSelectedLesson(les.num); }}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    selectedLesson === les.num 
                      ? 'bg-white/10 border-white/20 text-white font-semibold' 
                      : 'bg-white/2 hover:bg-white/5 border-white/5 text-zinc-400'
                  }`}
                >
                  <div className="flex gap-4 items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold">{les.title}</h4>
                      <p className="text-xs text-zinc-500 font-light mt-0.5">{les.subtitle}</p>
                    </div>
                    <span className="text-[9px] uppercase px-2 py-0.5 bg-white/5 rounded-full font-bold text-zinc-400 shrink-0">
                      {les.flag}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Lesson detail viewer holding detailed professional lessons */}
            <div className="lg:col-span-8">
              <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between min-h-[500px]">
                
                {/* Lesson inner subsegments (Vocab, Gram, Dialog, Drill) */}
                <div className="flex flex-wrap justify-between items-start gap-4 border-b border-white/5 pb-5 mb-6">
                  <div>
                    <span className="text-[10px] bg-yellow-500/10 border border-yellow-500/10 rounded-full px-2.5 py-1 text-yellow-300 uppercase tracking-widest font-extrabold flex items-center gap-1 inline-flex">
                      <Sparkles className="w-3 h-3" />
                      KURIKULUM MINNA NO NIHONGO
                    </span>
                    <h3 className="text-2xl font-display text-white mt-1 leading-none font-normal">
                      Pelajaran {selectedLesson}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {[
                      { id: 'kosakata', label: 'Kosakata' },
                      { id: 'tata', label: 'Tata Bahasa' },
                      { id: 'dialog', label: 'Dialog' },
                      { id: 'latihan', label: 'Drill Tes' }
                    ].map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => { triggerTick(330); setActiveSectionUnderLesson(sec.id as any); }}
                        className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                          activeSectionUnderLesson === sec.id 
                            ? 'bg-white text-slate-950 font-semibold' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {sec.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DYNAMIC LESSON SECTION CONTENTS */}
                {activeSectionUnderLesson === 'kosakata' && (
                  <div className="space-y-4 animate-fade-rise">
                    <p className="text-xs text-zinc-400 font-light">Daftar kata wajib dihafal sebelum masuk ke bab ini. Ketuk ikon suara untuk menyimak ucapan native:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedLesson === 1 && [
                        { jp: "わたし (Watashi)", rom: "Saya / Aku", cat: "Kata Ganti", desc: "Dipakai secara sopan umum." },
                        { jp: "〜じん (〜Jin)", rom: "Orang dari negara 〜", cat: "Sufiks", desc: "Contoh: Indonesia-jin." },
                        { jp: "はい (Hai)", rom: "Ya", cat: "Ungkapan", desc: "Bentuk menyetujui." },
                        { jp: "いいえ (Iie)", rom: "Tidak", cat: "Ungkapan", desc: "Bentuk penolakan." }
                      ].map((v, i) => (
                        <div key={i} className="bg-white/2 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                          <div>
                            <h5 className="text-sm font-semibold text-white">{v.jp}</h5>
                            <p className="text-xs text-zinc-400 font-light">{v.rom} • <span className="text-[10px] text-zinc-500">{v.cat}</span></p>
                            <p className="text-[10px] text-zinc-500 italic mt-1">{v.desc}</p>
                          </div>
                          <button 
                            onClick={() => playKanaSound(v.jp, 'a')}
                            className="p-2 h-8 w-8 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {selectedLesson === 2 && [
                        { jp: "これ (Kore)", rom: "Ini", cat: "Kata Benda", desc: "Dekat dengan pihak pembicara." },
                        { jp: "それ (Sore)", rom: "Itu", cat: "Kata Benda", desc: "Dekat dengan pihak lawan bicara." },
                        { jp: "あれ (Are)", rom: "Itu", cat: "Kata Benda", desc: "Jauh dari kedua pihak." },
                        { jp: "ほん (Hon)", rom: "Buku", cat: "Kata Benda", desc: "Bahan bacaan umum." }
                      ].map((v, i) => (
                        <div key={i} className="bg-white/2 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                          <div>
                            <h5 className="text-sm font-semibold text-white">{v.jp}</h5>
                            <p className="text-xs text-zinc-400 font-light">{v.rom} • <span className="text-[10px] text-zinc-500">{v.cat}</span></p>
                            <p className="text-[10px] text-zinc-500 italic mt-1">{v.desc}</p>
                          </div>
                          <button 
                            onClick={() => playKanaSound(v.jp, 'o')}
                            className="p-2 h-8 w-8 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {selectedLesson >= 3 && [
                        { jp: "ここ (Koko)", rom: "Di sini", cat: "Lokasi", desc: "Lokasi di dekat pembicara." },
                        { jp: "そこ (Soko)", rom: "Di situ", cat: "Lokasi", desc: "Lokasi lawan bicara." },
                        { jp: "あそこ (Asoko)", rom: "Di sana", cat: "Lokasi", desc: "Lokasi di kejauhan." },
                        { jp: "いくら (Ikura)", rom: "Berapa Harganya?", cat: "Kata Tanya", desc: "Bertanya nilai nominal uang." }
                      ].map((v, i) => (
                        <div key={i} className="bg-white/2 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                          <div>
                            <h5 className="text-sm font-semibold text-white">{v.jp}</h5>
                            <p className="text-xs text-zinc-400 font-light">{v.rom} • <span className="text-[10px] text-zinc-500">{v.cat}</span></p>
                            <p className="text-[10px] text-zinc-500 italic mt-1">{v.desc}</p>
                          </div>
                          <button 
                            onClick={() => playKanaSound(v.jp, 'u')}
                            className="p-2 h-8 w-8 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSectionUnderLesson === 'tata' && (
                  <div className="space-y-6 animate-fade-rise">
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Brain className="w-5 h-5 text-zinc-400" />
                      Analisis Struktur Guru Profesional
                    </h4>
                    
                    {selectedLesson === 1 && (
                      <div className="space-y-4">
                        <div className="bg-white/3 p-5 rounded-2xl border border-white/5 space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Pola Rumus 1:</span>
                          <span className="text-lg text-white font-mono font-medium block">KB1 は KB2 です</span>
                          <span className="text-xs text-zinc-400 block italic">"KB1 adalah KB2"</span>
                          <p className="text-sm text-zinc-300 font-light pt-2 border-t border-white/5 leading-relaxed">
                            Partikel <strong>は (wa)</strong> digunakan sebagai penanda topik pembicaraan. Predikat kalimat diakhiri dengan kopula <strong>です (desu)</strong> yang menandakan kesopanan dan penegasan positif.
                          </p>
                        </div>
                        <div className="bg-white/3 p-5 rounded-2xl border border-white/5 space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Pola Rumus 2:</span>
                          <span className="text-lg text-white font-mono font-medium block">〜は〜じゃ ありません</span>
                          <span className="text-xs text-zinc-400 block italic">"〜 bukanlah / adalah bukan 〜"</span>
                          <p className="text-sm text-zinc-300 font-light pt-2 border-t border-white/5 leading-relaxed">
                            Pola negatif dari <strong>です (desu)</strong> adalah <strong>じゃ ありません (ja arimasen)</strong>. Dalam ragam penulisan resmi formal digunakan pula <strong>では ありません (dewa arimasen)</strong>.
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedLesson === 2 && (
                      <div className="space-y-4">
                        <div className="bg-white/3 p-5 rounded-2xl border border-white/5 space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Kore, Sore, Are:</span>
                          <p className="text-sm text-zinc-300 font-light leading-relaxed">
                            Digunakan sebagai kata tunjuk benda murni. <strong>Kore</strong> menunjuk benda di dekat speaker. <strong>Sore</strong> di dekat lawan bicara. <strong>Are</strong> jauh dari keduanya.
                          </p>
                        </div>
                        <div className="bg-white/3 p-5 rounded-2xl border border-white/5 space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Hubungan Pola Menerangkan:</span>
                          <span className="text-base text-white font-mono font-medium block">Kata Benda1 の Kata Benda2</span>
                          <p className="text-sm text-zinc-300 font-light pt-1 border-t border-white/5 leading-relaxed">
                            Partikel <strong>の (no)</strong> merangkaikan hubungan modifikasi. Contoh kepemilikan:  <em>watashi no hon</em> (buku saya).
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedLesson >= 3 && (
                      <div className="space-y-4">
                        <div className="bg-white/3 p-5 rounded-2xl border border-white/5 space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Bertanya Berapa Harga:</span>
                          <span className="text-lg text-white font-mono font-medium block">これは いくら ですか</span>
                          <p className="text-sm text-zinc-300 font-light pt-1 border-t border-white/5 leading-relaxed">
                            Gunakan partikel tanya <strong>か (ka)</strong> di ujung kalimat tanpa perlu memakai tanda tanya Latin.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSectionUnderLesson === 'dialog' && (
                  <div className="space-y-6 animate-fade-rise">
                    <p className="text-xs text-zinc-400 font-light">Simulasi adegan dialog harian yang sering diujikan dalam tes SSW dan JLPT N5-N4. Simak lagunya:</p>
                    
                    <div className="bg-slate-950/30 p-5 rounded-2xl border border-white/5 space-y-4 text-left">
                      <div className="border-l-4 border-amber-400 pl-3">
                        <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Guru Satuan / Sensei:</span>
                        <p className="text-sm text-white font-display">はじめまして。(Hajimemashite.)</p>
                        <p className="text-xs text-zinc-400 font-light">"Senang berkenalan denganmu."</p>
                      </div>

                      <div className="border-l-4 border-zinc-500 pl-3">
                        <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Peserta / Murid:</span>
                        <p className="text-sm text-white font-display">はじめまして、ルカです。インドネシアから来ました。どうぞよろしく。(Hajimemashite, Ruka desu. Indonesia kara kimashite. Douzo yoroshiku.)</p>
                        <p className="text-xs text-zinc-400 font-light">"Perkenalkan saya Ruka, datang dari Indonesia. Mohon bantuannya."</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => playKanaSound('はじめまして', 'a')}
                      className="liquid-glass text-xs font-semibold px-5 py-3 rounded-full text-white hover:scale-105 transition-all text-center mx-auto flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      Mainkan Percakapan Natural
                    </button>
                  </div>
                )}

                {activeSectionUnderLesson === 'latihan' && (
                  <div className="space-y-6 animate-fade-rise text-center py-6">
                    <Trophy className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                    <h4 className="text-lg font-display text-white">Siap Menguji Penguasaan Bab?</h4>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto font-light leading-relaxed">
                      Latihan bab berisi drilling partikel pelengkap dan kalimat acak yang diadaptasi dari tes uji kompetensi bahasa Jepang.
                    </p>
                    <button
                      onClick={() => { triggerTick(); setActiveTab('game'); }}
                      className="liquid-glass text-xs font-semibold px-6 py-3 rounded-full text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Buka Game Latihan
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      )}

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
