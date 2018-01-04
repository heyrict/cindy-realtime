/*
 *
 * WebSocketInterface actions
 *
 */

import {
  WS_CONNECT,
} from './constants';

export function wsConnect() {
  return {
    type: WS_CONNECT,
  };
}
