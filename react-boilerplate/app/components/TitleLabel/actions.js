/**
 *
 * TitleLabel actions
 *
 */

import { SHOW_PUZZLE } from './constants';

export function showPuzzle({ puzzleId, id }) {
  return {
    type: SHOW_PUZZLE,
    data: {
      puzzleId,
      id,
    },
  };
}
