/*
 *
 * Dialogue actions
 *
 */

import {
  UPDATE_ANSWER,
} from './constants';

export function updateAnswer(data) {
  return {
    type: UPDATE_ANSWER,
    data,
  };
}
