/*
 *
 * Chat actions
 *
 */

import moment from 'moment';
import {
  TOGGLE_MINICHAT,
  TOGGLE_MEMO,
  CHANGE_TAB,
  CHANGE_CHANNEL,
  MINICHAT_CONNECT,
  MINICHAT_DISCONNECT,
  MINICHAT_MORE,
  CHANGE_DIRECTCHAT,
  SEND_DIRECTCHAT,
  ADD_DIRECTCHAT_MESSAGE,
  OPEN_DIRECTCHAT,
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
    type: MINICHAT_CONNECT,
    channel,
  };
}

export function disconnectChat(channel) {
  return {
    type: MINICHAT_DISCONNECT,
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

export function sendDirectchat(data) {
  return {
    type: SEND_DIRECTCHAT,
    data: { ...data, created: moment() },
  };
}

export function addDirectchatMessage(data) {
  return {
    type: ADD_DIRECTCHAT_MESSAGE,
    ...data,
  };
}

export function openDirectChat(data) {
  return {
    type: OPEN_DIRECTCHAT,
    ...data,
  };
}
