import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { QueryRenderer } from "react-relay";
import jQuery from "jquery";

import { Provider } from "react-redux";
import { createStore } from "redux";

import { IndexBody } from "./components/Index.jsx";
import { LeftBar } from "./components/SideBar.jsx";
import { MondaiListBody } from "./components/MondaiList.jsx";
import { MondaiAddBody } from "./components/MondaiAdd.jsx";
import { MondaiShowBody } from "./components/MondaiShow.jsx";
import { TopNavbar } from "./components/Navbar.jsx";
import App from "./App.jsx";

import socketMiddleware from "./socketMiddleware";
import common from "../common";
import cindyApp from "./reducers";

var $ = jQuery;
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
});
