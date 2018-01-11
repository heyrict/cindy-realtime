/*
 *
 * PuzzleShowPage actions
 *
 */

import { PUZZLE_SHOWN } from './constants';

export function puzzleShown(puzzleId) {
  return {
    type: PUZZLE_SHOWN,
    data: { puzzleId },
  };
}
