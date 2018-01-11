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

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import WebSocketInterface from 'containers/WebSocketInterface';
import Notifier from 'containers/Notifier';
import TopNavbar from 'containers/TopNavbar';
import HomePage from 'containers/HomePage/Loadable';
import PuzzlePage from 'containers/PuzzlePage/Loadable';
import PuzzleAddPage from 'containers/PuzzleAddPage/Loadable';
import PuzzleShowPage from 'containers/PuzzleShowPage';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import common from 'common';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'alertifyjs/build/css/alertify.min.css';
import 'alertifyjs/build/css/themes/semantic.min.css';

export default function App() {
  common.StartCountdown();
  return (
    <div>
      <Notifier />
      <WebSocketInterface />
      <TopNavbar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/puzzle" component={PuzzlePage} />
        <Route exact path="/puzzle/add" component={PuzzleAddPage} />
        <Route path="/puzzle/show/:id" component={PuzzleShowPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}
