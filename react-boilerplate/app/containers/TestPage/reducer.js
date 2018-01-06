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
  console.log("IN TESTPAGE REDUCER", state, action)
  switch (action.type) {
    case "TEST_ONE":
      return state
    default:
      return state;
  }
}

export default testPageReducer;
