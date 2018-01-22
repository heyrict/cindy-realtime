/*
 *
 * WebSocketInterface constants
 *
 */

import {
  VIEWER_CONNECT,
  VIEWER_DISCONNECT,
  SET_CURRENT_USER,
} from 'containers/UserNavbar/constants';

import { PUZZLE_SHOWN, PUZZLE_HID } from 'containers/PuzzleShowPage/constants';

import {
  MINICHAT_CONNECT,
  MINICHAT_DISCONNECT,
  SEND_DIRECTCHAT,
} from 'containers/Chat/constants';

export const INTERNAL_ACTIONS = [
  VIEWER_CONNECT,
  VIEWER_DISCONNECT,
  SET_CURRENT_USER,
  PUZZLE_SHOWN,
  PUZZLE_HID,
  MINICHAT_CONNECT,
  MINICHAT_DISCONNECT,
  SEND_DIRECTCHAT,
];

export const WS_CONNECT = 'app/WebSocketInterface/WS_CONNECT';
export const WS_DISCONNECT = 'app/WebSocketInterface/WS_DISCONNECT';
