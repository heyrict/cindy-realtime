/**
 *
 * PuzzleAddPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import styled from 'styled-components';

import { Grid, Col } from 'react-bootstrap';
import PuzzleAddForm from 'containers/PuzzleAddForm';

import messages from './messages';

const Heading = styled.h1`
  font-size: 3em;
  color: tomato;
  margin-left: 0.5em;
  margin-top: 0;
  padding-top: 0.5em;
`;

export function PuzzleAddPage(props) {
  return (
    <div>
      <Helmet>
        <title>PuzzleAddPage</title>
        <meta
          name="description"
          content="Create a lateral thinking puzzle of your own!"
        />
      </Helmet>
      <Grid>
        <Col xs={12}>
          <Heading>
            <FormattedMessage {...messages.header} />
          </Heading>
          <PuzzleAddForm {...props} />
        </Col>
      </Grid>
    </div>
  );
}

PuzzleAddPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(PuzzleAddPage);
