/*
 *
 * WebSocketInterface constants
 *
 */

import {
  SET_CURRENT_USER,
} from 'containers/UserNavbar/constants';

import {
  SEND_DIRECTCHAT,
} from 'containers/Chat/constants';

export const INTERNAL_ACTIONS = [
  SET_CURRENT_USER,
  SEND_DIRECTCHAT,
];

export const WS_CONNECT = 'app/WebSocketInterface/WS_CONNECT';
export const WS_DISCONNECT = 'app/WebSocketInterface/WS_DISCONNECT';
