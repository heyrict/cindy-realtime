import { SET_CURRENT_USER, EXTERNAL_ACTIONS } from "./actions";
import { setCurrentUser } from "./actions";

const initialState = {
  currentUser: {
    userId: window.django.user_id,
    nickname: window.django.user_nickname
  },
  onlineViewerCount: 0
};

const {
  UPDATE_ONLINE_VIEWER_COUNT,
  ADD_ONLINE_USER,
  REMOVE_ONLINE_USER
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

    default:
      return state;
  }
}

export default cindyApp;
