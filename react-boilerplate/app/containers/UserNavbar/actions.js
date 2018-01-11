/*
 *
 * UserNavbar actions
 *
 */

import {
  VIEWER_CONNECT,
  VIEWER_DISCONNECT,
  SET_CURRENT_USER,
} from './constants';

export function connectViewer() {
  return {
    type: VIEWER_CONNECT,
  };
}

export function disconnectViewer() {
  return {
    type: VIEWER_DISCONNECT,
  };
}

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    currentUser: user,
  };
}
