/*
 *
 * PuzzleShowPage actions
 *
 */

import { PUZZLE_SHOWN, QUESTION_ADDED } from './constants';

export function puzzleShown(puzzleId) {
  return {
    type: PUZZLE_SHOWN,
    data: { puzzleId },
  };
}

export function putQuestion(data) {
  return {
    type: QUESTION_ADDED,
    data,
  };
}
