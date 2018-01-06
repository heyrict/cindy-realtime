/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from "react";
import { Switch, Route } from "react-router-dom";

import HomePage from "containers/HomePage/Loadable";
import TestPage from "containers/TestPage/Loadable";
import TestPageII from "containers/TestPageIi/Loadable";
import NotFoundPage from "containers/NotFoundPage/Loadable";
import { getCookie } from "common";

import "bootstrap/dist/css/bootstrap.min.css";

const csrftoken = getCookie("csrftoken");

export default function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/test" component={TestPage} />
        <Route exact path="/test2" component={TestPageII} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}
