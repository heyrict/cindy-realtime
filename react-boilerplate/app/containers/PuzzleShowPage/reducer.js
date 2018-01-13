/*
 *
 * PuzzleShowPage reducer
 *
 */

import { fromJS } from 'immutable';
import { PUZZLE_SHOWN, INIT_PUZZLE_SHOW, QUESTION_ADDED } from './constants';

const initialState = fromJS({
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
        .setIn(['puzzleShowUnion', 'edges'], action.data.puzzleShowUnion.edges);
    case QUESTION_ADDED:
      return state.updateIn(['puzzleShowUnion', 'edges'], (e) =>
        Array.concat(e, [{ node: action.data.dialogue }])
      );
    default:
      return state;
  }
}

export default puzzleShowPageReducer;
