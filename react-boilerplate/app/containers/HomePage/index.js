/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import messages from "./messages";

export default class HomePage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Link to="/test">
          <h1>Test</h1>
        </Link>
        <Link to="/test2">
          <h1>Test2</h1>
        </Link>
      </div>
    );
  }
}
