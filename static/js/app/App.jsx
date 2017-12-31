import React from "react";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { QueryRenderer } from "react-relay";
import jQuery from "jquery";

import { IndexBody } from "./components/Index.jsx";
import { LeftBar } from "./components/SideBar.jsx";
import { PuzzleListBody } from "./components/PuzzleList.jsx";
import { PuzzleAddBody } from "./components/PuzzleAdd.jsx";
import { PuzzleShowBody } from "./components/PuzzleShow.jsx";
import { TopNavbar } from "./components/Navbar.jsx";

import common from "./common";

const App = () => (
  <BrowserRouter>
    <div>
      <LeftBar />
      <noscript>This appication requires javascript to function</noscript>
      <TopNavbar />
      <Switch>
        <Route exact path="/" component={IndexBody} />
        <Route exact path="/puzzle" component={PuzzleListBody} />
        <Route exact path="/puzzle/show/:puzzleId" component={PuzzleShowBody} />
        <Route exact path="/puzzle/add" component={PuzzleAddBody} />
        <Route render={() => <h1>NOT FOUND!</h1>} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
