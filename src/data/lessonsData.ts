/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson, LESSONS_PART1 } from './lessonsPart1';
import { LESSONS_PART2 } from './lessonsPart2';

export type { Lesson };

export const ALL_LESSONS: Lesson[] = [
  ...LESSONS_PART1,
  ...LESSONS_PART2
];

/**
 * Helper to group lessons by LPK Class Level (Kelas 1 to Kelas 10)
 */
export const groupLessonsByClassLevel = () => {
  const grouped: { [key: string]: Lesson[] } = {};
  
  ALL_LESSONS.forEach(lesson => {
    const levelKey = lesson.classLevel;
    if (!grouped[levelKey]) {
      grouped[levelKey] = [];
    }
    grouped[levelKey].push(lesson);
  });
  
  return grouped;
};
