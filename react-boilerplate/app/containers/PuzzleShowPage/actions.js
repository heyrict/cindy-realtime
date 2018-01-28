/*
 *
 * PuzzleShowPage actions
 *
 */

import { PUZZLE_SHOWN, PUZZLE_HID } from './constants';

export function puzzleShown(puzzleId) {
  return {
    type: PUZZLE_SHOWN,
    data: { puzzleId },
  };
}

export function puzzleHid(puzzleId) {
  return {
    type: PUZZLE_HID,
    data: { puzzleId },
  };
}
