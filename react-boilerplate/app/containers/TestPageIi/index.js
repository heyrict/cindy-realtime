/**
 *
 * TestPageIi
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectTestPageIi from './selectors';
import saga from './saga';
import messages from './messages';

export class TestPageIi extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.dispatch({type: "TEST_TWO", data: 2})
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>TestPageIi</title>
          <meta name="description" content="Description of TestPageIi" />
        </Helmet>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

TestPageIi.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  testpageii: makeSelectTestPageIi(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'testPageIi', saga });

export default compose(
  withSaga,
  withConnect,
)(TestPageIi);
