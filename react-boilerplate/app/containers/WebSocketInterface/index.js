/**
 *
 * WebSocketInterface
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import injectSaga from 'utils/injectSaga';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { DAEMON } from 'utils/constants';

import saga from './saga';
import { wsConnect } from './actions';

export class WebSocketInterface extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.dispatch(wsConnect());
  }

  render() {
    return <div id="WebSocketInterface" />;
  }
}

WebSocketInterface.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);
const withSaga = injectSaga({ key: 'webSocketInterface', saga, mode: DAEMON });

export default compose(withSaga, withConnect)(WebSocketInterface);
