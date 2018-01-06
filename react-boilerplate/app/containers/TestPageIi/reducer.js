/*
 *
 * TestPageIi reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
} from './constants';

const initialState = fromJS({
  data: 0
});

function testPageIiReducer(state = initialState, action) {
  switch (action.type) {
    case "TEST_TWO":
      return state.set("data", action.data);
    default:
      return state;
  }
}

export default testPageIiReducer;
