/*
 *
 * TopNavbar reducer
 *
 */

import { fromJS } from 'immutable';
import { TOGGLE_SUBNAV } from './constants';

const initialState = fromJS({
  subnav: null,
});

function userNavbarReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SUBNAV:
      return state.set('subnav', action.subnav);
    case '@@router/LOCATION_CHANGE':
      return state.set('subnav', null);
    default:
      return state;
  }
}

export default userNavbarReducer;
