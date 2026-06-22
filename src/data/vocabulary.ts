/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VOCAB_N5 } from './vocabN5';
import { VOCAB_N4 } from './vocabN4';

export interface VocabularyWord {
  id: string;
  jp: string;
  rom: string;
  translation: string;
  type: string;
  desc: string;
  jlpt: 'N5' | 'N4';
  bab: number;
}

/**
 * Japanese-Indonesian Vocabulary Database for JLPT N5 and N4.
 * Spans Chapters (Bab) 1 through 25, imported from modular files.
 */
export const VOCABULARY_DATABASE: VocabularyWord[] = [
  ...VOCAB_N5,
  ...VOCAB_N4
];

/**
 * Filter vocabulary by JLPT levels.
 */
export const getVocabByJlpt = (level: 'N5' | 'N4'): VocabularyWord[] => {
  return VOCABULARY_DATABASE.filter(v => v.jlpt === level);
};

/**
 * Filter vocabulary by Bab (Chapter).
 */
export const getVocabByBab = (bab: number): VocabularyWord[] => {
  return VOCABULARY_DATABASE.filter(v => v.bab === bab);
};

/**
 * Search vocabulary by Japanese, Romaji, or Indonesian translation.
 */
export const searchVocab = (query: string): VocabularyWord[] => {
  const normQuery = query.toLowerCase().trim();
  if (!normQuery) return VOCABULARY_DATABASE;
  return VOCABULARY_DATABASE.filter(v => 
    v.jp.toLowerCase().includes(normQuery) ||
    v.rom.toLowerCase().includes(normQuery) ||
    v.translation.toLowerCase().includes(normQuery) ||
    v.type.toLowerCase().includes(normQuery) ||
    v.desc.toLowerCase().includes(normQuery)
  );
};
