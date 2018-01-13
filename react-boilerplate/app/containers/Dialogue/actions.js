/*
 *
 * Dialogue actions
 *
 */

import {
  UPDATE_DIALOGUE,
} from './constants';

export function updateDialogue(data) {
  return {
    type: UPDATE_DIALOGUE,
    data,
  };
}
