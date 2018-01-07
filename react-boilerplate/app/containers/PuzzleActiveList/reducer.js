/*
 *
 * PuzzleActiveList reducer
 *
 */

import { fromJS } from "immutable";
import { INIT_PUZZLE_LIST, UPDATE_PUZZLE, ADD_PUZZLE } from "./constants";

const initialState = fromJS({
  allPuzzles: {
    edges: []
  }
});

function puzzleActiveListReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_PUZZLE_LIST:
      return state.setIn(["allPuzzles", "edges"], action.data.allPuzzles.edges);
    case UPDATE_PUZZLE:
      return state.updateIn(["allPuzzles", "edges"], e =>
        e.map(
          edge =>
            edge.node.id == action.data.puzzle.id
              ? { ...edge, node: { ...edge.node, ...action.data.puzzle } }
              : edge
        )
      );
    case ADD_PUZZLE:
      return state.updateIn(["allPuzzles", "edges"], e =>
        Array.concat([{ node: action.data.puzzle }], e)
      );
    default:
      return state;
  }
}

export default puzzleActiveListReducer;
