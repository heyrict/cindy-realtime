/*
 *
 * LoginForm reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_CURRENT_USER,
} from './constants';

const initialState = fromJS({});

function loginFormReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default loginFormReducer;
