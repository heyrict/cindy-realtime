/*
 *
 * Notifier reducer
 *
 */

import { fromJS } from 'immutable';

import { NOTE_NEEDED } from './constants';

const { WS_CONNECT, PUZZLE_ADDED, DIRECTCHAT_RECEIVED } = NOTE_NEEDED;


const initialState = fromJS({
  notification: {},
});

function notifierReducer(state = initialState, action) {
  switch (action.type) {
    case WS_CONNECT:
    case PUZZLE_ADDED:
    case DIRECTCHAT_RECEIVED:
      return state.set('notification', action);
    default:
      return state;
  }
}

export default notifierReducer;
