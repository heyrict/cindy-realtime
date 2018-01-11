/**
 *
 * PuzzlePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import injectSaga from 'utils/injectSaga';
import styled from 'styled-components';
import environment from 'Environment';

import { QueryRenderer } from 'react-relay';
import { ProgressBar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import PuzzleList, { PuzzleListInitQuery } from 'containers/PuzzleList';
import PuzzleActiveList from 'containers/PuzzleActiveList';
import AddPuzzleBtn from './AddPuzzleBtn';

import makeSelectPuzzlePage from './selectors';
import saga from './saga';
import messages from './messages';

const Heading = styled.h1`
  font-size: 3em;
  color: tomato;
  margin-left: 0.5em;
  margin-top: 0;
  padding-top: 0.5em;
`;

function PuzzlePage() {
  return (
    <div>
      <Helmet>
        <title>PuzzlePage</title>
        <meta name="description" content="Description of PuzzlePage" />
      </Helmet>
      <Heading>
        <FormattedMessage {...messages.header} />
        <span style={{ padding: '0 10px' }} />
        <AddPuzzleBtn />
      </Heading>
      <PuzzleActiveList />
      <QueryRenderer
        environment={environment}
        component={PuzzleList}
        query={PuzzleListInitQuery}
        variables={{
          orderBy: ['-modified', '-id'],
          count: 3,
          status: null,
          status__gt: 0,
        }}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          } else if (props) {
            return <PuzzleList list={props} />;
          }
          return <ProgressBar now={100} label={'Loading...'} striped active />;
        }}
      />
    </div>
  );
}

PuzzlePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  puzzlepage: makeSelectPuzzlePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'puzzlePage', saga });

export default compose(withSaga, withConnect)(PuzzlePage);
