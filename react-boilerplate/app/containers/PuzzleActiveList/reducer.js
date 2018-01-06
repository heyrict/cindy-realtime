/*
 *
 * PuzzleActiveList reducer
 *
 */

import { fromJS } from 'immutable';
import {
  PUZZLE_CONNECT,
  PUZZLE_DISCONNECT,
  INIT_PUZZLE_LIST
} from './constants';

const initialState = fromJS({
  connected: false,
  allPuzzles: {
    edges: []
  }
});

function puzzleActiveListReducer(state = initialState, action) {
  switch (action.type) {
    case PUZZLE_CONNECT:
      return state.set("connected", true)
    case INIT_PUZZLE_LIST:
      return state.set("allPuzzles", action.data.allPuzzles)
    case PUZZLE_DISCONNECT:
      return state.set("connected", false)
    default:
      return state;
  }
}

export default puzzleActiveListReducer;
