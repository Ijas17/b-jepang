/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VocabularyWord {
  id: string;
  word: string; // kanji/kana
  reading: string; // furigana/romaji
  translation: string; // Indonesian meaning
  category: string; // noun, verb, adjective, etc.
  exampleJa: string; // example sentence in JP
  exampleId: string; // example sentence in Bahasa Indonesia
  audioUrl?: string; // local simulation audio or synthetic speech
  label?: string; // custom flags, e.g. "Pelajaran 1", "Salam", etc.
  partOfSpeech: 'Kata Benda' | 'Kata Kerja' | 'Kata Sifat' | 'Partikel' | 'Keterangan' | 'Ungkapan';
}

export interface RoadmapPhase {
  id: number;
  title: string;
  subtitle: string;
  target: string;
  description: string;
  themes: string[];
  grammarPoints: string[];
  lessonReferences: string[];
}

export interface AmbientTrack {
  id: string;
  title: string;
  mood: string;
  youtubeId?: string;
  sourceUrl: string; // free audio sample URL or synthesizer
  isSynthesized?: boolean;
}

export interface KarutaCard {
  id: string;
  kana: string;
  romaji: string;
}

export interface MemoryCard {
  id: string;
  content: string; // can be Kana or Romaji/Meaning
  matchId: string; // the ID to match with
  isFlipped: boolean;
  isMatched: boolean;
  type: 'kana' | 'meaning';
}

export interface ParticleQuestion {
  sentence: string; // "Watashi __ Nihonjin desu."
  translation: string; // "Saya adalah orang Jepang."
  options: string[]; // ["wa", "ga", "wo", "ni"]
  correctAnswer: string;
  explanation: string;
}

export interface SentencePuzzle {
  scrambledWords: string[]; // ["desu", "wa", "nihonjin", "Watashi"]
  correctOrder: string[]; // ["Watashi", "wa", "nihonjin", "desu"]
  meaning: string; // "Saya adalah orang Jepang."
  hintJa: string; // "私は日本人です。"
}
