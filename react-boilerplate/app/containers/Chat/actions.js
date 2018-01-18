/*
 *
 * Chat actions
 *
 */

import {
  TOGGLE_MINICHAT,
  MINICHAT_CONNECT,
  MINICHAT_DISCONNECT,
  MINICHAT_MORE,
} from './constants';

export function toggleChat(open) {
  return {
    type: TOGGLE_MINICHAT,
    open,
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
