/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

import languageProviderReducer from 'containers/LanguageProvider/reducer';

const userNavbar = require('containers/UserNavbar/reducer').default;
const topNavbar = require('containers/TopNavbar/reducer').default;
const chat = require('containers/Chat/reducer').default;
const notifier = require('containers/Notifier/reducer').default;
const settings = require('containers/Settings/reducer').default;

const initialReducers = {
  userNavbar,
  topNavbar,
  chat,
  notifier,
  settings,
};

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@5
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  location: { pathname: window.location.pathname },
});

export function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return state.merge({
        location: action.payload,
      });
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
  return combineReducers({
    route: routeReducer,
    language: languageProviderReducer,
    ...initialReducers,
    ...injectedReducers,
  });
}
