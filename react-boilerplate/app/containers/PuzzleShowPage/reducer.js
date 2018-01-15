/*
 *
 * PuzzleShowPage reducer
 *
 */

import { fromJS } from 'immutable';
import { UPDATE_ANSWER } from 'containers/Dialogue/constants';
import {
  PUZZLE_SHOWN,
  INIT_PUZZLE_SHOW,
  ADD_QUESTION,
  ADD_HINT,
  UPDATE_HINT,
  UPDATE_PUZZLE,
} from './constants';

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
    case ADD_QUESTION:
      return state.updateIn(['puzzleShowUnion', 'edges'], (e) =>
        Array.concat(e, [{ node: action.data.dialogue }])
      );
    case UPDATE_ANSWER:
      return state.updateIn(['puzzleShowUnion', 'edges'], (edges) =>
        edges.map(
          (edge) =>
            edge.node.id === action.data.dialogue.id
              ? { node: action.data.dialogue }
              : edge
        )
      );
    case ADD_HINT:
      return state.updateIn(['puzzleShowUnion', 'edges'], (e) =>
        Array.concat(e, [{ node: action.data.hint }])
      );
    case UPDATE_HINT:
      return state.updateIn(['puzzleShowUnion', 'edges'], (edges) =>
        edges.map(
          (edge) =>
            edge.node.id === action.data.hint.id
              ? { node: action.data.hint }
              : edge
        )
      );
    case UPDATE_PUZZLE:
      return state.updateIn(['puzzle'], (pzl) => ({
        ...pzl,
        ...action.data.puzzle,
      }));
    default:
      return state;
  }
}

export default puzzleShowPageReducer;
