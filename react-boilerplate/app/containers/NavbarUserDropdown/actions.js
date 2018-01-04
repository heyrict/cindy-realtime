/*
 *
 * NavbarUserDropdown actions
 *
 */

import { VIEWER_CONNECT, SET_CURRENT_USER } from "./constants";

export function connectViewer() {
  return {
    type: VIEWER_CONNECT
  };
}

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    currentUser: user
  };
}
