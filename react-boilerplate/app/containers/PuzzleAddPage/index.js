/**
 *
 * PuzzleAddPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, intlShape } from 'react-intl';
import { Heading } from 'style-store';
import { compose } from 'redux';
import styled from 'styled-components';

import { Constrained } from 'components/Constrained';
import PuzzleAddForm from 'containers/PuzzleAddForm';
import PuzzleNavbar from 'components/PuzzleNavbar';

import messages from './messages';

export function PuzzleAddPage(props, context) {
  const _ = context.intl.formatMessage;
  return (
    <Constrained level={5}>
      <Helmet>
        <title>{_(messages.title)}</title>
        <meta name="description" content={_(messages.description)} />
      </Helmet>
      <Heading>
        <FormattedMessage {...messages.header} />
      </Heading>
      <PuzzleNavbar />
      <PuzzleAddForm {...props} />
      <div style={{ marginBottom: '30px' }} />
    </Constrained>
  );
}

PuzzleAddPage.contextTypes = {
  intl: intlShape,
};

PuzzleAddPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(PuzzleAddPage);
