/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ALL_LESSONS } from './lessonsData';

export interface VocabularyItem {
  jp: string;
  rom: string;
  translation: string;
  type: string;
  desc: string;
}

export interface GrammarPoint {
  title: string;
  explanation: string;
  exJp: string;
  exRom: string;
  exId: string;
  commonMistakeJp?: string;
  commonMistakeId?: string;
  drillText?: string;
  drillSolution?: string;
}

export interface SentencePattern {
  pattern: string;
  meaning: string;
}

export interface ExerciseItem {
  type: 'A' | 'B' | 'C';
  title: string;
  sentence: string;
  options: string[];
  correct: string;
  explanation: string;
}

export interface DialogueItem {
  speaker: string;
  textJp: string;
  textRom: string;
  textId: string;
}

export interface QuizItem {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface CurriculumLesson {
  id: number;
  judul: string;
  tema: string;
  level: string;
  estimatedMinutes: number;
  objectives: string[];
  vocabulary: VocabularyItem[];
  grammar: GrammarPoint[];
  sentencePatterns: SentencePattern[];
  exercises: ExerciseItem[];
  dialogue: DialogueItem[];
  quiz: QuizItem[];
  cultureNote: string;
  reviewSummary: string[];
}

/**
 * Kurikulum Lengkap 25 Bab Bahasa Jepang LPK & Magang Industri (Minna no Nihongo N5 - N4)
 * Berisi struktur lengkap: judul, tema, level, vocabulary, grammar, exercises, quiz, dan reviewSummary.
 */
export const lessons: CurriculumLesson[] = ALL_LESSONS.map(lesson => ({
  id: lesson.id,
  judul: lesson.title,
  tema: lesson.theme,
  level: lesson.classLevel,
  estimatedMinutes: lesson.estimatedMinutes,
  objectives: lesson.objectives,
  vocabulary: lesson.vocabulary,
  grammar: lesson.grammarPoints,
  sentencePatterns: lesson.sentencePatterns,
  exercises: lesson.exercises,
  dialogue: lesson.dialogue,
  quiz: lesson.quiz,
  cultureNote: lesson.cultureNote,
  reviewSummary: lesson.reviewSummary
}));
