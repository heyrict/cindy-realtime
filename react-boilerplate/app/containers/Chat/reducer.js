/*
 *
 * Chat reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CHANGE_CHANNEL,
  OPEN_MINICHAT,
  CLOSE_MINICHAT,
  INIT_MINICHAT,
  MORE_MINICHAT,
  ADD_MINICHAT,
  MINICHAT_CONNECT,
  MINICHAT_DISCONNECT,
} from './constants';

const initialState = fromJS({
  open: false,
  channel: null,
  currentChannel: null,
  chatMessages: [],
  hasPreviousPage: false,
  startCursor: null,
});

function chatReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MINICHAT:
      return state.setIn(['open'], true);
    case CLOSE_MINICHAT:
      return state.setIn(['open'], false);
    case CHANGE_CHANNEL:
      return state.setIn(['channel'], action.channel);
    case MINICHAT_CONNECT:
    case MINICHAT_DISCONNECT:
      return state.setIn(['currentChannel'], action.channel);
    case INIT_MINICHAT:
      return state
        .setIn(['chatMessages'], action.data.allMinichats.edges)
        .setIn(
          ['hasPreviousPage'],
          action.data.allMinichats.pageInfo.hasPreviousPage
        )
        .setIn(['startCursor'], action.data.allMinichats.pageInfo.startCursor);
    case MORE_MINICHAT:
      return state
        .setIn(['startCursor'], action.data.allMinichats.pageInfo.startCursor)
        .setIn(
          ['hasPreviousPage'],
          action.data.allMinichats.pageInfo.hasPreviousPage
        )
        .updateIn(['chatMessages'], () =>
          Array.concat(
            action.data.allMinichats.edges,
            state.get('chatMessages')
          )
        );
    case ADD_MINICHAT:
      console.log(action.data.data.minichat);
      return state.updateIn(['chatMessages'], () =>
        Array.concat(state.get('chatMessages'), [
          { node: action.data.data.minichat },
        ])
      );
    default:
      return state;
  }
}

export default chatReducer;
