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
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { intlShape } from 'react-intl';
import messages from './messages';

import MainFrame from './MainFrame';
import PuzzleDescribeList from './PuzzleDescribeList';

const PurpleBg = styled.div`
  background: linear-gradient(#5f293e, #330617);
`;

function HomePage(props, context) {
  const _ = context.intl.formatMessage;
  const now = new Date(Date.now());
  const dateOfReflesh = 15;
  let year;
  let month;
  year = now.getYear() + 1900; // Current Year
  month = now.getMonth() + 1; // Current Month (1-12)
  const date = now.getDate(); // Current Date (1-31)

  if (date <= dateOfReflesh) {
    month -= 2;
  } else {
    month -= 1;
  }
  if (month <= 0) {
    month += 12;
    year -= 1;
  }

  return (
    <PurpleBg>
      <Helmet>
        <title>{_(messages.title)}</title>
        <meta name="description" content={_(messages.description)} />
      </Helmet>
      <MainFrame />
      <PuzzleDescribeList
        variables={{ year, month, orderBy: ['-starCount'] }}
        itemsPerPage={5}
      />
    </PurpleBg>
  );
}

HomePage.contextTypes = {
  intl: intlShape,
};

export default HomePage;
