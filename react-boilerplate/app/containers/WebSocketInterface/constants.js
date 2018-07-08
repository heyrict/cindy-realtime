/*
 *
 * WebSocketInterface constants
 *
 */

import { SET_CURRENT_USER } from 'containers/UserNavbar/constants';

import { SEND_BROADCAST } from 'containers/Chat/constants';

export const INTERNAL_ACTIONS = [SET_CURRENT_USER, SEND_BROADCAST];

export const WS_CONNECT = 'app/WebSocketInterface/WS_CONNECT';
export const WS_DISCONNECT = 'app/WebSocketInterface/WS_DISCONNECT';

export const WS_CONNECTED = 'app/WebSocketInterface/WS_CONNECTED';
export const WS_DISCONNECTED = 'app/WebSocketInterface/WS_DISCONNECTED';
