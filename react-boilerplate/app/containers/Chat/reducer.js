/*
 *
 * Chat reducer
 *
 */

import { fromJS } from 'immutable';
import { SET_CURRENT_USER } from 'containers/UserNavbar/constants';
import {
  OPEN_DIRECTCHAT,
  CHANGE_CHANNEL,
  OPEN_MINICHAT,
  CLOSE_MINICHAT,
  OPEN_MEMO,
  CLOSE_MEMO,
  CHANGE_TAB,
  CHANGE_DIRECTCHAT,
  ADD_FAVCHAN,
  REMOVE_FAVCHAN,
  SET_DM_RECEIVER,
} from './constants';

const initialState = fromJS({
  // Sidebar State Stuff
  open:
    (window.innerWidth || document.documentElement.clientWidth) < 576
      ? null
      : 'chat',
  activeTab: 'TAB_CHAT',
  // Chat State Stuff
  channel: null, // default channel
  chatMessages: [],
  // User state Stuff
  activeDirectChat: null,
  dmReceiver: null,
  favChannels: window.django.user_favChannels || [],
});

function chatReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_DIRECTCHAT:
      return state
        .setIn(['open'], 'chat')
        .setIn(['activeTab'], 'TAB_DIRECTCHAT')
        .setIn(['dmReceiver'], action.chat);
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
    case CHANGE_DIRECTCHAT:
      return state.setIn(['dmReceiver'], action.chat);
    case ADD_FAVCHAN:
      return state.updateIn(['favChannels'], (prev) =>
        prev.concat([action.chatroomName]),
      );
    case REMOVE_FAVCHAN:
      return state.updateIn(['favChannels'], (prev) =>
        prev.map((cn) => (cn === action.chatroomName ? null : cn)),
      );
    case SET_CURRENT_USER:
      if (!action.currentUser.favoritechatroomSet) {
        return state.setIn(['favChannels'], []);
      }
      return state.setIn(
        ['favChannels'],
        action.currentUser.favoritechatroomSet.edges.map(
          (e) => e.node.chatroom.name,
        ),
      );
    case SET_DM_RECEIVER:
      return state.setIn(['dmReceiver'], action.payload);
    default:
      return state;
  }
}

export default chatReducer;
