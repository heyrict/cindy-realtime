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
import { intlShape } from 'react-intl';
import Constrained from 'components/Constrained';
import messages from './messages';

import MainFrame from './MainFrame';

export default function HomePage(props, context) {
  const _ = context.intl.formatMessage;
  return (
    <div>
      <Helmet>
        <title>{_(messages.title)}</title>
        <meta name="description" content={_(messages.description)} />
      </Helmet>
      <MainFrame />
    </div>
  );
}

HomePage.contextTypes = {
  intl: intlShape,
};
