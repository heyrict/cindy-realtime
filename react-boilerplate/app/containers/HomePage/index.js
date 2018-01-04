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
import { Grid, Jumbotron, Col, Image, Clearfix } from "react-bootstrap";
import messages from "./messages";

export default class HomePage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Grid>
        <Jumbotron bsClass="jumbotron indexHero">
          <Col xs={12} md={3}>
            <Image
              src="/static/pictures/cindylogo.png"
              responsive
              rounded
              thumbnail
            />
          </Col>
          <Col xs={12} md={9}>
            <h2>
              <FormattedMessage {...messages.header} />
            </h2>
            <p>
              <FormattedMessage {...messages.description} />
            </p>
          </Col>
          <Clearfix />
        </Jumbotron>
      </Grid>
    );
  }
}
