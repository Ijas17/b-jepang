/**
 * Spaced Repetition System (SRS) for RukaaClass
 * Uses a Leitner system with exponential time offsets.
 */

export interface SrsItem {
  id: string; // Unique ID (e.g., "kana_あ", "particle_0")
  type: 'kana' | 'particle' | 'sentence' | 'vocab' | 'kanji';
  question: string; // The prompt/question text
  correct: string; // The correct answer text
  translation?: string; // Optional translation
  explanation?: string; // Optional explanation
  options?: string[]; // Multiple choice options
  scrambledWords?: string[]; // For sentence builder
  correctOrder?: string[]; // For sentence builder
  weight: number; // Mistake multiplier / difficulty weight
  box: number; // Leitner box (1 to 5)
  mistakeCount: number; // Total mistakes on this item
  correctCountOnRow: number; // Consecutive correct reviews
  lastReviewed?: number; // UTC Timestamp
  nextReviewAfter?: number; // UTC Timestamp (due when <= Current Time)
}

// Leitner system intervals in seconds:
// Box 1: 15 seconds (immediate review)
// Box 2: 60 seconds (1 minute)
// Box 3: 300 seconds (5 minutes)
// Box 4: 1800 seconds (30 minutes)
// Box 5: 86400 seconds (24 hours - mastered!)
const BOX_INTERVALS = [0, 15, 60, 300, 1800, 86400];

/**
 * Fetch all tracked SRS items from localStorage
 */
export function getSrsItems(): SrsItem[] {
  try {
    const saved = localStorage.getItem('ruka_srs_mistakes');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse SRS mistakes', e);
  }
  return [];
}

/**
 * Save SRS items back to localStorage
 */
export function saveSrsItems(items: SrsItem[]): void {
  try {
    localStorage.setItem('ruka_srs_mistakes', JSON.stringify(items));
    // Dispatch custom event to notify UI components to refresh
    window.dispatchEvent(new Event('ruka_srs_updated'));
  } catch (e) {
    console.error('Failed to save SRS mistakes', e);
  }
}

/**
 * Record a mistake (user chose an incorrect answer) in a game/quiz.
 * If the item is already tracked, reset box to 1 and increment weights.
 * If not tracked, initialize state at Box 1.
 */
export function recordSrsMistake(params: {
  id: string;
  type: SrsItem['type'];
  question: string;
  correct: string;
  translation?: string;
  explanation?: string;
  options?: string[];
  scrambledWords?: string[];
  correctOrder?: string[];
}): void {
  const items = getSrsItems();
  const existingIndex = items.findIndex(item => item.id === params.id);
  const now = Date.now();

  if (existingIndex > -1) {
    const existing = items[existingIndex];
    existing.mistakeCount += 1;
    existing.correctCountOnRow = 0;
    // Demote to Box 1 for intensive practice
    existing.box = 1;
    existing.weight = Math.min(existing.weight + 1, 10);
    existing.lastReviewed = now;
    // Next review available after 15s
    existing.nextReviewAfter = now + BOX_INTERVALS[1] * 1000;
  } else {
    // New item to track
    const newItem: SrsItem = {
      id: params.id,
      type: params.type,
      question: params.question,
      correct: params.correct,
      translation: params.translation,
      explanation: params.explanation,
      options: params.options,
      scrambledWords: params.scrambledWords,
      correctOrder: params.correctOrder,
      weight: 2, // Moderate initial weight
      box: 1, // Start at Leitner Box 1
      mistakeCount: 1,
      correctCountOnRow: 0,
      lastReviewed: now,
      nextReviewAfter: now + BOX_INTERVALS[1] * 1000 // 15 seconds backoff
    };
    items.push(newItem);
  }

  saveSrsItems(items);
}

/**
 * Record a successful correct answer during targeted SRS review.
 * Promote to next Leitner Box and extend the backoff interval.
 */
export function recordSrsSuccess(id: string): void {
  const items = getSrsItems();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return;

  const item = items[index];
  const now = Date.now();
  item.correctCountOnRow += 1;
  
  // Promote box (maximum is Box 5)
  const nextBox = Math.min(item.box + 1, 5);
  item.box = nextBox;
  
  // Reduce weight as player demonstrates retention
  item.weight = Math.max(item.weight - 1, 1);
  item.lastReviewed = now;
  item.nextReviewAfter = now + BOX_INTERVALS[nextBox] * 1000;

  saveSrsItems(items);
}

/**
 * Get all items currently due for review or sorted by highest severity (weight / mistakes)
 */
export function getDueSrsItems(): SrsItem[] {
  const items = getSrsItems();
  const now = Date.now();
  
  // Sort: 1) Due items first, then 2) items with higher mistake counts/weights
  return [...items].sort((a, b) => {
    const aDue = (a.nextReviewAfter || 0) <= now;
    const bDue = (b.nextReviewAfter || 0) <= now;

    if (aDue && !bDue) return -1;
    if (!aDue && bDue) return 1;

    // Both due or both not due: sort by severity/priority
    return (b.weight * b.mistakeCount) - (a.weight * a.mistakeCount);
  });
}

/**
 * Reset all SRS progress (clear history)
 */
export function resetSrsDatabase(): void {
  localStorage.removeItem('ruka_srs_mistakes');
  window.dispatchEvent(new Event('ruka_srs_updated'));
}
