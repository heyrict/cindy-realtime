/*
 *
 * Settings reducer
 *
 */

import { fromJS } from 'immutable';
import { getCookie, setCookie } from 'common';
import { CHANGE_SETTING, SAVE_SETTINGS, defaultSettings } from './constants';

let savedSettings;

try {
  savedSettings = JSON.parse(getCookie('cindyuiset'));
} catch (e) {
  savedSettings = {};
}

const initialState = fromJS({
  ...defaultSettings,
  ...savedSettings,
});

function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SETTING:
      return state.set(action.payload.key, action.payload.value);
    case SAVE_SETTINGS:
      setCookie('cindyuiset', JSON.stringify(state.toJS()), 31536000);
      return state;
    default:
      return state;
  }
}

export default settingsReducer;
