import { SET_CURRENT_USER, EXTERNAL_ACTIONS } from "./actions";
import { setCurrentUser } from "./actions";

const initialState = {
  currentUser: {
    userId: window.django.user_id,
    nickname: window.django.user_nickname
  },
  onlineViewerCount: 0,
  soupList: {
    allMondais: {
      edges: []
    }
  }
};

const {
  UPDATE_ONLINE_VIEWER_COUNT,
  ADD_ONLINE_USER,
  REMOVE_ONLINE_USER,
  INIT_SOUP_LIST,
  PREPEND_SOUP_LIST,
  UPDATE_SOUP_LIST
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
    case EXTERNAL_ACTIONS.INIT_SOUP_LIST:
      return {
        ...state,
        soupList: action.soupList
      };
    case PREPEND_SOUP_LIST:
      return {
        ...state,
        soupList: {
          allMondais: {
            edges: Array.concat(
              [{ node: action.soupNode.mondai }],
              state.soupList.allMondais.edges
            )
          }
        }
      };

    default:
      return state;
  }
}

export default cindyApp;
