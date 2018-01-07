/*
 *
 * PuzzleActiveList reducer
 *
 */

import { fromJS } from 'immutable';
import {
  INIT_PUZZLE_LIST
} from './constants';

const initialState = fromJS({
  allPuzzles: {
    edges: []
  }
});

function puzzleActiveListReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_PUZZLE_LIST:
      return state.set("allPuzzles", action.data.allPuzzles)
    default:
      return state;
  }
}

export default puzzleActiveListReducer;
