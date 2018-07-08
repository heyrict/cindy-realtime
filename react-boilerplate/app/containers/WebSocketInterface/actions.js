/*
 *
 * WebSocketInterface actions
 *
 */

import {
  WS_CONNECT,
  WS_CONNECTED,
  WS_DISCONNECTED,
} from './constants';

export function wsConnect() {
  return {
    type: WS_CONNECT,
  };
}

export function wsConnected() {
  return {
    type: WS_CONNECTED,
  };
}

export function wsDisconnected() {
  return {
    type: WS_DISCONNECTED,
  };
}
