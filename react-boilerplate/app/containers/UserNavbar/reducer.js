/*
 *
 * UserNavbar reducer
 *
 */

import { fromJS } from 'immutable';
import { UPDATE_ONLINE_VIEWER_COUNT, SET_CURRENT_USER } from './constants';

const initialState = fromJS({
  user: {
    userId: window.django.user_id,
    nickname: window.django.user_nickname,
  },
  onlineViewerCount: 0,
});

function userNavbarReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ONLINE_VIEWER_COUNT:
      return state.set('onlineViewerCount', action.data.onlineViewerCount);
    case SET_CURRENT_USER:
      return state.setIn(['user', 'userId'], action.currentUser.userId)
        .setIn(['user', 'nickname'], action.currentUser.nickname);
    default:
      return state;
  }
}

export default userNavbarReducer;
