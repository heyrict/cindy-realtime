/*
 *
 * Notifier reducer
 *
 */

import { fromJS } from 'immutable';

import { NOTE_NEEDED } from './constants';

const {
  WS_CONNECT,
  PUZZLE_ADDED,
  DIRECTCHAT_NOTIFY,
  GOTID_MINICHAT,
} = NOTE_NEEDED;

const initialState = fromJS({
  notification: {},
});

function notifierReducer(state = initialState, action) {
  switch (action.type) {
    case WS_CONNECT:
    case PUZZLE_ADDED:
    case DIRECTCHAT_NOTIFY:
      return state.set('notification', action);
    case GOTID_MINICHAT:
      if (!action.chatroom) return state.set('notification', action);
      return state;
    default:
      return state;
  }
}

export default notifierReducer;
