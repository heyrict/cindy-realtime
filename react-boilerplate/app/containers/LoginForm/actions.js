/*
 *
 * LoginForm actions
 *
 */

import { SHOW_MODAL } from './constants';

export function show(status = true) {
  return {
    type: SHOW_MODAL,
    show: status,
  };
}
