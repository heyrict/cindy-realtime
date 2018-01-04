/*
 *
 * LoginForm reducer
 *
 */

import { fromJS } from "immutable";
import { SHOW_MODAL } from "./constants";

const initialState = fromJS({
  show: false
});

function loginFormReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_MODAL:
      return state.set("show", action.show);
    default:
      return state;
  }
}

export default loginFormReducer;
