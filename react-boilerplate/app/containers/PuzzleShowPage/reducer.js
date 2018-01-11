/*
 *
 * PuzzleShowPage reducer
 *
 */

import { fromJS } from 'immutable';
import { PUZZLE_SHOWN } from './constants';

const initialState = fromJS({
  puzzleId: 0,
});

function puzzleShowPageReducer(state = initialState, action) {
  switch (action.type) {
    case PUZZLE_SHOWN:
      return state.set('puzzleId', action.puzzleId);
    default:
      return state;
  }
}

export default puzzleShowPageReducer;
