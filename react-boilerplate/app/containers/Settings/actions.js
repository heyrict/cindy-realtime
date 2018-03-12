/*
 *
 * Settings actions
 *
 */

import { CHANGE_SETTING, SAVE_SETTINGS } from './constants';

export function changeSetting(key, value) {
  return {
    type: CHANGE_SETTING,
    payload: {
      key,
      value,
    },
  };
}

export function saveSettings() {
  return {
    type: SAVE_SETTINGS,
  };
}
