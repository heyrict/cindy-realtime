import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { createStore } from "redux";
import cindyApp from "./redux/reducers";

import App from "./App.jsx";
import common from "./common";

import jQuery from "jquery";
import moment from "moment";

var $ = jQuery;
var language_code = window.django.LANGUAGE_CODE
var lang = language_code == "zh-hans" ? "zh-cn" : language_code | "en";
moment.locale(lang);

let store = createStore(
  cindyApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

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

  // Replace /countdown()/
  common.StartCountdown();
});
