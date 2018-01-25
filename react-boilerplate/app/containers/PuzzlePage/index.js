/**
 *
 * PuzzlePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import injectSaga from 'utils/injectSaga';
import environment from 'Environment';

import { QueryRenderer } from 'react-relay';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Heading } from 'style-store';
import Constrained from 'components/Constrained';
import LoadingDots from 'components/LoadingDots';

import PuzzleList from 'containers/PuzzleList';
import PuzzleListInitQuery from 'graphql/PuzzleListInitQuery';
import PuzzleActiveList from 'containers/PuzzleActiveList';
import AddPuzzleBtn from './AddPuzzleBtn';

import makeSelectPuzzlePage from './selectors';
import saga from './saga';
import messages from './messages';

function PuzzlePage(p, context) {
  const _ = context.intl.formatMessage;
  return (
    <Constrained level={4}>
      <Helmet>
        <title>{_(messages.title)}</title>
        <meta name="description" content={_(messages.description)} />
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
          return <LoadingDots />;
        }}
      />
    </Constrained>
  );
}

PuzzlePage.contextTypes = {
  intl: intlShape,
};

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
