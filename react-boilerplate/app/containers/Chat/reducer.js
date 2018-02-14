/*
 *
 * Chat reducer
 *
 */

import { fromJS } from 'immutable';
import {
  UPDATE_ONLINE_VIEWER_COUNT,
  SET_CURRENT_USER,
} from 'containers/UserNavbar/constants';
import {
  OPEN_DIRECTCHAT,
  CHANGE_CHANNEL,
  OPEN_MINICHAT,
  CLOSE_MINICHAT,
  OPEN_MEMO,
  CLOSE_MEMO,
  CHANGE_TAB,
  INIT_MINICHAT,
  MORE_MINICHAT,
  ADD_CHATMESSAGE,
  CHATROOM_CONNECT,
  CHATROOM_DISCONNECT,
  CHANGE_DIRECTCHAT,
  ADD_DIRECTCHAT_MESSAGE,
  GOTID_MINICHAT,
  ADD_FAVCHAN,
  REMOVE_FAVCHAN,
} from './constants';

const initialState = fromJS({
  // Sidebar State Stuff
  open: null,
  activeTab: 'TAB_CHAT',
  // Chat State Stuff
  channel: null, // default channel
  currentChannel: null,
  channelInfo: {},
  startCursor: null,
  hasPreviousPage: false,
  chatMessages: [],
  // User state Stuff
  activeDirectChat: null,
  onlineUsers: {},
  directMessages: {},
  favChannels: window.django.user_favChannels || [],
});

function chatReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_DIRECTCHAT:
      return state
        .setIn(['open'], 'chat')
        .setIn(['activeTab'], 'TAB_DIRECTCHAT')
        .setIn(['activeDirectChat'], action.chat);
    case OPEN_MINICHAT:
      return state.setIn(['open'], 'chat');
    case OPEN_MEMO:
      return state.setIn(['open'], 'memo');
    case CLOSE_MINICHAT:
    case CLOSE_MEMO:
      return state.setIn(['open'], null);
    case CHANGE_TAB:
      return state.setIn(['activeTab'], action.tab);
    case CHANGE_CHANNEL:
      return state.setIn(['channel'], action.channel);
    case CHATROOM_CONNECT:
    case CHATROOM_DISCONNECT:
      return state.setIn(['currentChannel'], action.channel);
    case INIT_MINICHAT:
      return state
        .setIn(['chatMessages'], action.data.allChatmessages.edges)
        .setIn(
          ['hasPreviousPage'],
          action.data.allChatmessages.pageInfo.hasPreviousPage
        )
        .setIn(
          ['startCursor'],
          action.data.allChatmessages.pageInfo.startCursor
        );
    case MORE_MINICHAT:
      return state
        .setIn(
          ['startCursor'],
          action.data.allChatmessages.pageInfo.startCursor
        )
        .setIn(
          ['hasPreviousPage'],
          action.data.allChatmessages.pageInfo.hasPreviousPage
        )
        .updateIn(['chatMessages'], () =>
          Array.concat(
            action.data.allChatmessages.edges,
            state.get('chatMessages')
          )
        );
    case ADD_CHATMESSAGE: {
      const chatMessageIds = state
        .get('chatMessages')
        .map((edge) => edge.node.id);
      for (let i = 0; i < chatMessageIds.length; i += 1) {
        if (action.data.data.chatmessage.id === chatMessageIds[i]) {
          return state;
        }
      }
      return state.updateIn(['chatMessages'], () =>
        Array.concat(state.get('chatMessages'), [
          { node: action.data.data.chatmessage },
        ])
      );
    }
    case UPDATE_ONLINE_VIEWER_COUNT:
      return state.setIn(['onlineUsers'], action.data.onlineUsers);
    case CHANGE_DIRECTCHAT:
      return state.setIn(['activeDirectChat'], action.chat);
    case ADD_DIRECTCHAT_MESSAGE:
      return state.updateIn(['directMessages', action.chat], (prev) =>
        Array.concat(prev || [], [action.data])
      );
    case GOTID_MINICHAT:
      return state.setIn(['channelInfo', action.name], action.chatroom);
    case ADD_FAVCHAN:
      return state.updateIn(['favChannels'], (prev) =>
        prev.concat([action.chatroomName])
      );
    case REMOVE_FAVCHAN:
      return state.updateIn(['favChannels'], (prev) =>
        prev.map((cn) => (cn === action.chatroomName ? null : cn))
      );
    case SET_CURRENT_USER:
      if (!action.currentUser.favoritechatroomSet) {
        return state.setIn(['favChannels'], []);
      }
      return state.setIn(
        ['favChannels'],
        action.currentUser.favoritechatroomSet.edges.map(
          (e) => e.node.chatroom.name
        )
      );
    default:
      return state;
  }
}

export default chatReducer;
