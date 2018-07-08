/*
 *
 * Notifier reducer
 *
 */

import { fromJS } from 'immutable';

import { NOTE_NEEDED } from './constants';

const {
  WS_CONNECTED,
  WS_DISCONNECTED,
  PUZZLE_ADDED,
  DIRECTCHAT_NOTIFY,
  GOTID_MINICHAT,
  NOTIFIER_MESSAGE,
  BROADCAST_MESSAGE,
} = NOTE_NEEDED;

const initialState = fromJS({
  notification: {},
});

function notifierReducer(state = initialState, action) {
  switch (action.type) {
    case WS_CONNECTED:
    case WS_DISCONNECTED:
    case PUZZLE_ADDED:
    case DIRECTCHAT_NOTIFY:
    case NOTIFIER_MESSAGE:
    case BROADCAST_MESSAGE:
      return state.set('notification', action);
    case GOTID_MINICHAT:
      if (!action.chatroom) return state.set('notification', action);
      return state;
    default:
      return state;
  }
}

export default notifierReducer;
