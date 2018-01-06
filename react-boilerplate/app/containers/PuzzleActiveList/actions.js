/*
 *
 * PuzzleActiveList actions
 *
 */

import {
  PUZZLE_CONNECT,
} from './constants';

export function connectPuzzle() {
  return {
    type: PUZZLE_CONNECT,
    stream: "puzzleList",
  };
}
