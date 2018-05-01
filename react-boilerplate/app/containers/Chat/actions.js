/*
 *
 * Chat actions
 *
 */

import {
  TOGGLE_MINICHAT,
  TOGGLE_MEMO,
  CHANGE_TAB,
  CHANGE_CHANNEL,
  CHATROOM_CONNECT,
  CHATROOM_DISCONNECT,
  MINICHAT_MORE,
  CHANGE_DIRECTCHAT,
  DIRECTCHAT_RECEIVED,
  OPEN_CHAT,
  OPEN_DIRECTCHAT,
  GOTID_MINICHAT,
  ADD_FAVCHAN,
  REMOVE_FAVCHAN,
} from './constants';

export function toggleChat(open) {
  return {
    type: TOGGLE_MINICHAT,
    open,
  };
}

export function toggleMemo(open) {
  return {
    type: TOGGLE_MEMO,
    open,
  };
}

export function changeTab(tab) {
  return {
    type: CHANGE_TAB,
    tab,
  };
}

export function connectChat(channel) {
  return {
    type: CHATROOM_CONNECT,
    channel,
  };
}

export function disconnectChat(channel) {
  return {
    type: CHATROOM_DISCONNECT,
    channel,
  };
}

export function loadMore() {
  return {
    type: MINICHAT_MORE,
  };
}

export function changeChannel(channel) {
  return {
    type: CHANGE_CHANNEL,
    channel,
  };
}

export function changeDirectchat(chat) {
  return {
    type: CHANGE_DIRECTCHAT,
    chat,
  };
}

export function openChat(channel) {
  return {
    type: OPEN_CHAT,
    channel,
  };
}

export function openDirectChat(data) {
  return {
    type: OPEN_DIRECTCHAT,
    ...data,
  };
}

export function updateChannel(name, chatroom) {
  return {
    type: GOTID_MINICHAT,
    name,
    chatroom,
  };
}

export function addFavoriteChatRoom(chatroomName) {
  return {
    type: ADD_FAVCHAN,
    chatroomName,
  };
}

export function removeFavoriteChatRoom(chatroomName) {
  return {
    type: REMOVE_FAVCHAN,
    chatroomName,
  };
}

export function directchatReceived(payload) {
  return {
    type: DIRECTCHAT_RECEIVED,
    payload,
  };
}
