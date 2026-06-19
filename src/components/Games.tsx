/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PARTICLE_QUESTIONS, SENTENCE_PUZZLES } from '../data';
import { Gamepad2, Volume2, Sparkles, CheckCircle, AlertTriangle, RotateCcw, ArrowRight, Zap, HelpCircle } from 'lucide-react';

export default function Games() {
  const [activeGame, setActiveGame] = useState<'karuta' | 'memory' | 'particle' | 'sentence'>('karuta');

  // ==========================================
  // GAME 1: KARUTA KANA STATE & LOGIC
  // ==========================================
  const karutaPool = [
    { kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' }, 
    { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' }, { kana: 'か', romaji: 'ka' },
    { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' }, { kana: 'け', romaji: 'ke' },
    { kana: 'こ', romaji: 'ko' }, { kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }
  ];

  const [karutaTarget, setKarutaTarget] = useState({ kana: 'あ', romaji: 'a' });
  const [karutaOptions, setKarutaOptions] = useState<typeof karutaPool>([]);
  const [karutaScore, setKarutaScore] = useState(0);
  const [karutaFeedback, setKarutaFeedback] = useState<string | null>(null);

  const initKaruta = () => {
    const target = karutaPool[Math.floor(Math.random() * karutaPool.length)];
    setKarutaTarget(target);
    
    // Pick 3 random wrong options
    const poolWithoutTarget = karutaPool.filter(k => k.romaji !== target.romaji);
    const shuffledWrong = [...poolWithoutTarget].sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [...shuffledWrong, target].sort(() => 0.5 - Math.random());
    
    setKarutaOptions(combined);
    setKarutaFeedback(null);
  };

  useEffect(() => {
    initKaruta();
  }, [activeGame]);

  const handleKarutaAnswer = (chosen: string) => {
    if (chosen === karutaTarget.romaji) {
      setKarutaScore(prev => prev + 1);
      setKarutaFeedback('Tepat! Correct.');
      setTimeout(() => initKaruta(), 1200);
    } else {
      setKarutaFeedback(`Kurang tepat, itu dibaca "${chosen}". Coba lagi.`);
    }
  };

  // ==========================================
  // GAME 2: MEMORY MATCH STATE & LOGIC
  // ==========================================
  const pairItems = [
    { id: '1', kana: 'す (su)', matchId: '1', matched: false, flipped: false },
    { id: '1-m', kana: 'su', matchId: '1', matched: false, flipped: false },
    { id: '2', kana: 'た (ta)', matchId: '2', matched: false, flipped: false },
    { id: '2-m', kana: 'ta', matchId: '2', matched: false, flipped: false },
    { id: '3', kana: 'め (me)', matchId: '3', matched: false, flipped: false },
    { id: '3-m', kana: 'me', matchId: '3', matched: false, flipped: false },
    { id: '4', kana: 'る (ru)', matchId: '4', matched: false, flipped: false },
    { id: '4-m', kana: 'ru', matchId: '4', matched: false, flipped: false }
  ];

  const [memoryCards, setMemoryCards] = useState<typeof pairItems>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [memoryScore, setMemoryScore] = useState(0);

  const initMemory = () => {
    const shuffled = [...pairItems].sort(() => 0.5 - Math.random());
    setMemoryCards(shuffled);
    setSelectedCards([]);
    setMemoryScore(0);
  };

  useEffect(() => {
    initMemory();
  }, [activeGame]);

  const handleCardClick = (index: number) => {
    if (selectedCards.length >= 2 || memoryCards[index].matched || memoryCards[index].flipped) return;

    const updated = [...memoryCards];
    updated[index].flipped = true;
    setMemoryCards(updated);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const first = memoryCards[newSelected[0]];
      const second = memoryCards[newSelected[1]];

      if (first.matchId === second.matchId) {
        // Matched!
        setTimeout(() => {
          const matchedList = updated.map((card, i) => {
            if (i === newSelected[0] || i === newSelected[1]) {
              return { ...card, matched: true, flipped: true };
            }
            return card;
          });
          setMemoryCards(matchedList);
          setSelectedCards([]);
          setMemoryScore(prev => prev + 10);
        }, 500);
      } else {
        // Mis-matched
        setTimeout(() => {
          const resetList = updated.map((card, i) => {
            if (i === newSelected[0] || i === newSelected[1]) {
              return { ...card, flipped: false };
            }
            return card;
          });
          setMemoryCards(resetList);
          setSelectedCards([]);
        }, 1200);
      }
    }
  };

  // ==========================================
  // GAME 3: PARTICLE RUNNER STATE & LOGIC
  // ==========================================
  const [particleIndex, setParticleIndex] = useState(0);
  const [particleSelected, setParticleSelected] = useState<string | null>(null);
  const [particleScore, setParticleScore] = useState(0);
  const [showParticleExplain, setShowParticleExplain] = useState(false);

  const currentParticleQ = PARTICLE_QUESTIONS[particleIndex];

  const handleParticleAnswer = (ans: string) => {
    if (particleSelected) return; // already answered
    setParticleSelected(ans);
    setShowParticleExplain(true);
    if (ans === currentParticleQ.correctAnswer) {
      setParticleScore(prev => prev + 25);
    }
  };

  const nextParticle = () => {
    setParticleIndex((prev) => (prev + 1) % PARTICLE_QUESTIONS.length);
    setParticleSelected(null);
    setShowParticleExplain(false);
  };

  // ==========================================
  // GAME 4: SENTENCE BUILDER STATE & LOGIC
  // ==========================================
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [scrambledList, setScrambledList] = useState<string[]>([]);
  const [sentenceStatus, setSentenceStatus] = useState<'neutral' | 'correct' | 'wrong'>('neutral');

  const currentSentence = SENTENCE_PUZZLES[sentenceIndex];

  const initSentence = () => {
    setScrambledList([...currentSentence.scrambledWords]);
    setSelectedWords([]);
    setSentenceStatus('neutral');
  };

  useEffect(() => {
    initSentence();
  }, [sentenceIndex, activeGame]);

  const toggleWord = (word: string, side: 'scrambled' | 'answer') => {
    if (sentenceStatus !== 'neutral') return;
    
    if (side === 'scrambled') {
      setSelectedWords([...selectedWords, word]);
      setScrambledList(scrambledList.filter(w => w !== word));
    } else {
      setScrambledList([...scrambledList, word]);
      setSelectedWords(selectedWords.filter(w => w !== word));
    }
  };

  const checkSentenceResult = () => {
    const isCorrect = selectedWords.join(' ') === currentSentence.correctOrder.join(' ');
    setSentenceStatus(isCorrect ? 'correct' : 'wrong');
  };

  // Web synthetic acoustic sound effect generator for extreme game touch responsiveness without audio assets
  const playBeep = (freq: number, duration: number, type: OscillatorType = 'sine') => {
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
      // browser blocked or not supported, ignore gracefully
    }
  };

  return (
    <section id="game" className="relative z-10 py-24 border-t border-white/5 bg-slate-950/20 backdrop-blur-md">
      <div id="game-main-container" className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div id="game-badge" className="text-xs text-zinc-400 font-medium tracking-widest uppercase mb-3 px-3 py-1 bg-white/5 rounded-full inline-flex items-center gap-1.5">
            <Gamepad2 className="w-4.5 h-4.5 text-zinc-300" />
            SISTEM RECALL AKTIF
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display text-white font-normal leading-tight mb-6">
            Mini-Game <span className="italic text-zinc-400">Edukasi Interaktif</span>
          </h2>
          <p className="text-zinc-300 font-light text-sm sm:text-base leading-relaxed">
            Mainkan langsung kuis demonstrasi di bawah ini untuk merasakan metode belajar asyik 
            dan tidak membosankan dari RukaaIjass.
          </p>
        </div>

        {/* Tab Selector */}
        <div id="game-tab-bar" className="flex flex-wrap justify-center gap-3 mb-10 max-w-3xl mx-auto">
          {[
            { id: 'karuta', label: '1. Karuta Kana' },
            { id: 'memory', label: '2. Memory Match' },
            { id: 'particle', label: '3. Particle Runner' },
            { id: 'sentence', label: '4. Sentence Builder' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                playBeep(440, 0.1);
                setActiveGame(tab.id as any);
              }}
              className={`px-5 py-3 rounded-full text-xs font-semibold tracking-wider transition-all uppercase cursor-pointer ${
                activeGame === tab.id 
                  ? 'bg-white text-slate-900 border border-white font-bold' 
                  : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Playable Game Frame */}
        <div id="game-display-frame" className="max-w-4xl mx-auto liquid-glass rounded-3xl p-6 sm:p-10 border border-white/5 min-h-[420px] flex flex-col justify-between">
          
          {/* ======================================================== */}
          {/* GAME 1: KARUTA KANA */}
          {/* ======================================================== */}
          {activeGame === 'karuta' && (
            <div id="game-karuta-panel" className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-xs uppercase tracking-wider text-zinc-400 font-light flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Karuta: Dengarkan / Tebak Bunysi Karakter
                  </div>
                  <div className="text-xs bg-white/5 px-2.5 py-1 rounded-full text-zinc-300">
                    Skor: <span className="font-semibold text-white">{karutaScore}</span>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <p className="text-xs text-zinc-400 font-light mb-2">Simbol Bunyi Target:</p>
                  <div className="inline-flex flex-col items-center gap-2">
                    <button 
                      onClick={() => {
                        playBeep(659.25, 0.35, 'triangle');
                        playBeep(440, 0.2, 'sine');
                      }}
                      className="p-6 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-white border border-white/5 shadow-md flex items-center gap-2 group cursor-pointer"
                    >
                      <Volume2 className="w-7 h-7 text-white/90 group-hover:scale-110 transition-transform" />
                      <span className="font-display text-2xl font-light select-none">Putar Bunyi</span>
                    </button>
                    <span className="text-[10px] text-zinc-500 italic mt-1">(Suara melafalkan "{karutaTarget.romaji}")</span>
                  </div>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="space-y-6">
                <p className="text-xs text-zinc-400 text-center font-light">Pilih kartu Hiragana yang sesuai dengan bunyi di atas:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {karutaOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        playBeep(330, 0.1);
                        handleKarutaAnswer(opt.romaji);
                      }}
                      className="h-28 rounded-2xl bg-white/3 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white active:scale-95 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer font-display"
                    >
                      <span className="text-4xl font-normal leading-none">{opt.kana}</span>
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                <div className="text-center h-8">
                  {karutaFeedback && (
                    <p className={`text-sm font-medium ${karutaFeedback.startsWith('Tepat') ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {karutaFeedback}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* GAME 2: MEMORY MATCH */}
          {/* ======================================================== */}
          {activeGame === 'memory' && (
            <div id="game-memory-panel" className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-xs uppercase tracking-wider text-zinc-400 font-light flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    Memory Match: Temukan Pasangan Suku Kata
                  </div>
                  <button 
                    onClick={() => {
                      playBeep(220, 0.1);
                      initMemory();
                    }}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Kartu
                  </button>
                </div>
                
                <p className="text-xs text-zinc-400 text-center font-light mb-6">Buka kartu dan cocokkan karakter hiragana dengan transliterasi romajinya!</p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto w-full my-auto py-4">
                {memoryCards.map((card, idx) => {
                  const isRevealed = card.flipped || card.matched;
                  return (
                    <button
                      key={card.id}
                      onClick={() => {
                        playBeep(400 + idx * 30, 0.08);
                        handleCardClick(idx);
                      }}
                      className={`h-24 rounded-2xl border transition-all duration-300 text-center flex items-center justify-center font-semibold text-lg cursor-pointer ${
                        card.matched 
                          ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 pointer-events-none' 
                          : isRevealed 
                            ? 'bg-white/10 border-white/20 text-white' 
                            : 'bg-zinc-900 border-white/5 text-transparent hover:border-white/10 hover:bg-zinc-850'
                      }`}
                    >
                      {isRevealed ? (
                        <span className="font-display text-xl sm:text-2xl font-light">{card.kana}</span>
                      ) : (
                        <HelpCircle className="w-6 h-6 text-zinc-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status */}
              <div className="text-center h-8 mt-4">
                {memoryScore === 40 ? (
                  <p className="text-emerald-400 font-medium flex items-center justify-center gap-2 animate-bounce text-sm">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    Selesai! Selamat, semua pasangan cocok! (+40 Pts)
                  </p>
                ) : (
                  <div className="text-xs text-zinc-500 font-light">
                    Kecocokan: <span className="text-zinc-300">{memoryScore / 10} / 4 pasang</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* GAME 3: PARTICLE RUNNER */}
          {/* ======================================================== */}
          {activeGame === 'particle' && (
            <div id="game-particle-panel" className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-xs uppercase tracking-wider text-zinc-400 font-light flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Particle Runner: Ketangkasan Menghubung Pola
                  </div>
                  <div className="text-xs bg-emerald-500/10 border border-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full font-semibold">
                    Akumulasi: {particleScore} Pts
                  </div>
                </div>

                {/* Sentence Question Display */}
                <div className="text-center py-6 bg-slate-950/20 rounded-2xl border border-white/5 my-4">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono mb-2">Pilih Partikel Pelengkap:</p>
                  <h3 className="text-3xl sm:text-4xl text-white font-medium tracking-wide mb-3">
                    {currentParticleQ.sentence}
                  </h3>
                  <p className="text-sm font-light italic text-zinc-400">
                    "{currentParticleQ.translation}"
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {currentParticleQ.options.map((opt, i) => {
                    const isSelected = particleSelected === opt;
                    const isCorrect = opt === currentParticleQ.correctAnswer;
                    let btnStyle = 'bg-white/3 border-white/5 text-zinc-300 hover:bg-white/5';

                    if (particleSelected) {
                      if (isSelected) {
                        btnStyle = isCorrect 
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                          : 'bg-rose-500/20 border-rose-500/40 text-rose-300';
                      } else if (isCorrect) {
                        btnStyle = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300';
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          playBeep(opt === currentParticleQ.correctAnswer ? 523.25 : 180, 0.15);
                          handleParticleAnswer(opt);
                        }}
                        disabled={!!particleSelected}
                        className={`py-4 rounded-xl text-sm font-semibold tracking-wide border transition-all cursor-pointer ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explain & Next */}
                <div className="min-h-[80px]">
                  {showParticleExplain && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/2 p-4 rounded-2xl border border-white/5">
                      <div className="text-left">
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Penjelasan Guru:</span>
                        <p className="text-xs text-zinc-300 font-light mt-0.5">{currentParticleQ.explanation}</p>
                      </div>
                      <button
                        onClick={() => {
                          playBeep(659.25, 0.1);
                          nextParticle();
                        }}
                        className="liquid-glass text-xs font-semibold px-4 py-2 rounded-full text-white hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        Kalimat Berikutnya
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* GAME 4: SENTENCE BUILDER */}
          {/* ======================================================== */}
          {activeGame === 'sentence' && (
            <div id="game-sentence-panel" className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs uppercase tracking-wider text-zinc-400 font-light flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    Sentence Builder: Arsitek Struktur Kalimat
                  </div>
                  <button 
                    onClick={() => {
                      playBeep(220, 0.1);
                      setSentenceIndex(prev => (prev + 1) % SENTENCE_PUZZLES.length);
                    }}
                    className="text-xs text-zinc-400 hover:text-white bg-white/5 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                  >
                    Misi Lainnya
                  </button>
                </div>

                <div className="bg-slate-950/20 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">Terjemahan Target:</span>
                  <p className="text-lg text-white font-medium mt-1">"{currentSentence.meaning}"</p>
                </div>
              </div>

              {/* Working Board space */}
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase text-zinc-400 tracking-wider mb-2">Slot Konstruksi Kalimat:</p>
                  <div className="min-h-[64px] bg-white/3 border border-dashed border-white/10 rounded-2xl p-3 flex flex-wrap gap-2 items-center justify-center">
                    {selectedWords.length === 0 ? (
                      <span className="text-xs text-zinc-500 font-light italic">Ketuk potongan kata di bawah untuk menyusun kalimat</span>
                    ) : (
                      selectedWords.map((word, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            playBeep(350, 0.08);
                            toggleWord(word, 'answer');
                          }}
                          className="bg-white/10 hover:bg-rose-500/15 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white transition-all cursor-pointer select-none ring-1 ring-white/5"
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Scrambled bricks */}
                <div>
                  <p className="text-[10px] uppercase text-zinc-400 tracking-wider mb-2">Pilihan Bata Kata:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {scrambledList.map((word, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          playBeep(450, 0.08);
                          toggleWord(word, 'scrambled');
                        }}
                        className="bg-zinc-900 hover:bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center select-none"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submisi check */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                  <div className="text-left">
                    {sentenceStatus === 'correct' && (
                      <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-pulse">
                        <CheckCircle className="w-4 h-4" />
                        Hebat! Susunan Sempurna: {currentSentence.hintJa}
                      </p>
                    )}
                    {sentenceStatus === 'wrong' && (
                      <p className="text-xs text-rose-450 font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        Kurang tepat. Perhatikan letak partikel/predikat.
                      </p>
                    )}
                    {sentenceStatus === 'neutral' && (
                      <p className="text-[10px] text-zinc-400 font-light">
                        Petunjuk: Predikat selalu diletakkan di paling akhir kalimat Jepang.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        playBeep(220, 0.1);
                        initSentence();
                      }}
                      className="px-4 py-2 rounded-xl border border-white/5 text-zinc-400 hover:text-white text-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1"
                    >
                      Ulangi
                    </button>
                    <button
                      onClick={() => {
                        playBeep(587.33, 0.15);
                        checkSentenceResult();
                      }}
                      disabled={selectedWords.length === 0}
                      className="liquid-glass text-xs font-semibold uppercase px-6 py-2.5 rounded-xl text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      Uji Susunan
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Informative Footnote matching the PRD */}
        <div id="game-info-card" className="mt-8 text-center max-w-xl mx-auto text-xs text-zinc-500 font-light">
          Sistem game ini bekerja beriringan dengan <span className="text-zinc-400 font-medium font-sans">Review Cerdas</span>. 
          Setiap kesalahan analisis Anda disimpan dalam riwayat belajar untuk memperkokoh materi 
          tata bahasa dan melatih memori otot vokal jangka panjang.
        </div>

      </div>
    </section>
  );
}
