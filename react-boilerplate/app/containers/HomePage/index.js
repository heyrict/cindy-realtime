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

import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, intlShape } from 'react-intl';
import { Grid, Jumbotron, Col, Image, Clearfix } from 'react-bootstrap';
import messages from './messages';

export default function HomePage(props, context) {
  const _ = context.intl.formatMessage;
  return (
    <div>
      <Helmet>
        <title>{_(messages.title)}</title>
        <meta name="description" content={_(messages.description)}/>
      </Helmet>
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
              <FormattedMessage {...messages.body} />
            </p>
          </Col>
          <Clearfix />
        </Jumbotron>
      </Grid>
    </div>
  );
}

HomePage.contextTypes = {
  intl: intlShape,
};
