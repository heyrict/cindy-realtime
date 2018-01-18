/*
 *
 * Chat reducer
 *
 */

import { fromJS } from 'immutable';
import {
  OPEN_MINICHAT,
  CLOSE_MINICHAT,
  INIT_MINICHAT,
  MORE_MINICHAT,
  MINICHAT_CONNECT,
  MINICHAT_DISCONNECT,
} from './constants';

const initialState = fromJS({
  open: false,
  channel: null,
  currentChannel: null,
  chatMessages: [],
  startCursor: null,
});

function chatReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MINICHAT:
      return state.setIn(['open'], true);
    case CLOSE_MINICHAT:
      return state.setIn(['open'], false);
    case MINICHAT_CONNECT:
    case MINICHAT_DISCONNECT:
      return state.setIn(['currentChannel'], action.channel);
    case INIT_MINICHAT:
      return state
        .setIn(['chatMessages'], action.data.allMinichats.edges)
        .setIn(['startCursor'], action.data.allMinichats.pageInfo.startCursor);
    case MORE_MINICHAT:
      return state
        .setIn(['startCursor'], action.data.allMinichats.pageInfo.startCursor)
        .updateIn(['chatMessages'], () =>
          Array.concat(
            action.data.allMinichats.edges,
            state.get('chatMessages')
          )
        );
    default:
      return state;
  }
}

export default chatReducer;
