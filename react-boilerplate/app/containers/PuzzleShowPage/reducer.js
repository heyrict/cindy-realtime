/*
 *
 * PuzzleShowPage reducer
 *
 */

import { fromJS } from 'immutable';
import { PUZZLE_SHOWN, INIT_PUZZLE_SHOW } from './constants';

const initialState = fromJS({
  puzzleId: 0,
  puzzle: null,
  puzzleShowUnion: {
    edges: [],
  },
});

function puzzleShowPageReducer(state = initialState, action) {
  switch (action.type) {
    case PUZZLE_SHOWN:
      return state.set('puzzleId', action.puzzleId);
    case INIT_PUZZLE_SHOW:
      return state
        .setIn(['puzzle'], action.data.puzzle)
        .setIn(
          ['puzzleShowUnion', 'edges'],
          action.data.puzzleShowUnion.edges
        );
    default:
      return state;
  }
}

export default puzzleShowPageReducer;
