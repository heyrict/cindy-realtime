/*
 *
 * Chat reducer
 *
 */

import { fromJS } from 'immutable';
import { UPDATE_ONLINE_VIEWER_COUNT } from 'containers/UserNavbar/constants';
import {
  OPEN_DIRECTCHAT,
  CHANGE_CHANNEL,
  OPEN_MINICHAT,
  CLOSE_MINICHAT,
  CHANGE_TAB,
  INIT_MINICHAT,
  MORE_MINICHAT,
  ADD_MINICHAT,
  MINICHAT_CONNECT,
  MINICHAT_DISCONNECT,
  CHANGE_DIRECTCHAT,
  ADD_DIRECTCHAT_MESSAGE,
} from './constants';

const initialState = fromJS({
  // Sidebar State Stuff
  open: false,
  activeTab: 'TAB_CHAT',
  // Chat State Stuff
  channel: null, // default channel
  currentChannel: null,
  startCursor: null,
  hasPreviousPage: false,
  chatMessages: [],
  // User state Stuff
  activeDirectChat: null,
  onlineUsers: {},
  directMessages: {},
});

function chatReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_DIRECTCHAT:
      return state
        .setIn(['open'], true)
        .setIn(['activeTab'], 'TAB_DIRECTCHAT')
        .setIn(['activeDirectChat'], action.chat);
    case OPEN_MINICHAT:
      return state.setIn(['open'], true);
    case CLOSE_MINICHAT:
      return state.setIn(['open'], false);
    case CHANGE_TAB:
      return state.setIn(['activeTab'], action.tab);
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
      return state.updateIn(['chatMessages'], () =>
        Array.concat(state.get('chatMessages'), [
          { node: action.data.data.minichat },
        ])
      );
    case UPDATE_ONLINE_VIEWER_COUNT:
      return state.setIn(['onlineUsers'], action.data.onlineUsers);
    case CHANGE_DIRECTCHAT:
      return state.setIn(['activeDirectChat'], action.chat);
    case ADD_DIRECTCHAT_MESSAGE:
      return state.updateIn(['directMessages', action.chat], (prev) =>
        Array.concat(prev || [], [action.data])
      );
    default:
      return state;
  }
}

export default chatReducer;
