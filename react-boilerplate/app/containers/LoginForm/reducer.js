/*
 *
 * LoginForm reducer
 *
 */

import { fromJS } from "immutable";
import { SHOW_MODAL } from "./constants";

const initialState = fromJS({});

function loginFormReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default loginFormReducer;
