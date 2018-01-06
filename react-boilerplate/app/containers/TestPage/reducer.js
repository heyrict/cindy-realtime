/*
 *
 * TestPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
} from './constants';

const initialState = fromJS({
  data: 0
});

function testPageReducer(state = initialState, action) {
  switch (action.type) {
    case "TEST_ONE":
      return state.set("data", action.data)
    default:
      return state;
  }
}

export default testPageReducer;
