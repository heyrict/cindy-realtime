import { SET_CURRENT_USER, EXTERNAL_ACTIONS } from "./actions";
import { setCurrentUser } from "./actions";

const initialState = {
  currentUser: {
    userId: window.django.user_id,
    nickname: window.django.user_nickname
  },
  onlineViewerCount: 0,
  puzzleList: {
    allPuzzles: {
      edges: []
    }
  }
};

const {
  UPDATE_ONLINE_VIEWER_COUNT,
  ADD_ONLINE_USER,
  REMOVE_ONLINE_USER,
  INIT_PUZZLE_LIST,
  PREPEND_PUZZLE_LIST,
  UPDATE_PUZZLE_LIST
} = EXTERNAL_ACTIONS;

function cindyApp(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.currentUser
      };
    case UPDATE_ONLINE_VIEWER_COUNT:
      return {
        ...state,
        onlineViewerCount: action.onlineViewerCount
      };
    case EXTERNAL_ACTIONS.INIT_PUZZLE_LIST:
      return {
        ...state,
        puzzleList: action.puzzleList
      };
    case PREPEND_PUZZLE_LIST:
      return {
        ...state,
        puzzleList: {
          allPuzzles: {
            edges: Array.concat(
              [{ node: action.puzzleNode.puzzle }],
              state.puzzleList.allPuzzles.edges
            )
          }
        }
      };

    default:
      return state;
  }
}

export default cindyApp;
