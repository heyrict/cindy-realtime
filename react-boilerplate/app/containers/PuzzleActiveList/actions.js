/*
 *
 * PuzzleActiveList actions
 *
 */

import {
  LOAD_ALL_PUZZLES,
} from './constants';

export function loadAllPuzzles() {
  return {
    type: LOAD_ALL_PUZZLES,
  };
}
