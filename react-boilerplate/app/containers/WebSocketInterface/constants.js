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

export const INTERNAL_ACTIONS = [
  VIEWER_CONNECT,
  VIEWER_DISCONNECT,
  PUZZLE_SHOWN,
  PUZZLE_HID,
];

export const WS_CONNECT = 'app/WebSocketInterface/WS_CONNECT';
export const WS_DISCONNECT = 'app/WebSocketInterface/WS_DISCONNECT';
