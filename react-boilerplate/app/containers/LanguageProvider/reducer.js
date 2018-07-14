/*
 *
 * LanguageProvider reducer
 *
 */

import { combineReducers } from 'redux-immutable';
import moment from 'moment';

import { CHANGE_LOCALE } from './constants';

import { DEFAULT_DISPLAY_LOCALE } from '../App/constants';

function locale(state = DEFAULT_DISPLAY_LOCALE, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      moment.locale(action.locale);
      return action.locale;
    default:
      return state;
  }
}

export default combineReducers({
  locale,
});
