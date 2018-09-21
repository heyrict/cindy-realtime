/*
 *
 * UserNavbar actions
 *
 */

import { SET_CURRENT_USER } from './constants';

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    currentUser: user,
  };
}
