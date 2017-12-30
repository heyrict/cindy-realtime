import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import cindyApp from "./redux/reducers";
import { rootSaga } from "./redux/sagas";
import { INTERNAL_ACTIONS } from "./redux/actions";

import App from "./App.jsx";
import common from "./common";

import jQuery from "jquery";
import moment from "moment";

var $ = jQuery;
var language_code = window.django.LANGUAGE_CODE;
var lang = language_code == "zh-hans" ? "zh-cn" : language_code | "en";
moment.locale(lang);

const sagaMiddleware = createSagaMiddleware({
  onError: console.log,
  emitter: emit => action => {
    if (Array.isArray(action)) {
      action.forEach(emit);
      return;
    }
    emit(action);
  }
});

let store = createStore(
  cindyApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(sagaMiddleware)
);

export const dispatch = action => store.dispatch(action);

sagaMiddleware.run(rootSaga);

$(document).ready(function() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );

  $("form").each(function(index) {
    can_submit[index] = true;
    $(this).on("submit", function() {
      if (!can_submit[index]) {
        return false;
      }
      can_submit[index] = false;
      return true;
    });
  });

  dispatch({ type: INTERNAL_ACTIONS.CONNECT });

  // Replace /countdown()/
  common.StartCountdown();
});
