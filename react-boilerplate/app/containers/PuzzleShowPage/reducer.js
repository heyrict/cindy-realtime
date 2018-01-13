/*
 *
 * PuzzleShowPage reducer
 *
 */

import { fromJS } from 'immutable';
import { UPDATE_DIALOGUE } from 'containers/Dialogue/constants';
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
    case UPDATE_DIALOGUE:
      console.log(state);
      return state.updateIn(['puzzleShowUnion', 'edges'], (edges) =>
        edges.map(
          (edge) =>
            edge.node.id === action.data.dialogue.id
              ? { node: action.data.dialogue }
              : edge
        )
      );
    default:
      return state;
  }
}

export default puzzleShowPageReducer;
