/*
 *
 * WebSocketInterface constants
 *
 */

import {
  VIEWER_CONNECT,
  VIEWER_DISCONNECT,
} from 'containers/UserNavbar/constants';

import { PUZZLE_SHOWN, PUZZLE_HID } from 'containers/PuzzleShowPage/constants';

import {
  MINICHAT_CONNECT,
  MINICHAT_DISCONNECT,
} from 'containers/Chat/constants';

export const INTERNAL_ACTIONS = [
  VIEWER_CONNECT,
  VIEWER_DISCONNECT,
  PUZZLE_SHOWN,
  PUZZLE_HID,
  MINICHAT_CONNECT,
  MINICHAT_DISCONNECT,
];

export const WS_CONNECT = 'app/WebSocketInterface/WS_CONNECT';
export const WS_DISCONNECT = 'app/WebSocketInterface/WS_DISCONNECT';
