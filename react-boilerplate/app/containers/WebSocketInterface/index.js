/**
 *
 * WebSocketInterface
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";

import injectSaga from "utils/injectSaga";
import injectReducer from "utils/injectReducer";
import makeSelectWebSocketInterface from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import { DAEMON } from "utils/constants";

import { wsConnect } from "./actions";

export class WebSocketInterface extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.dispatch(wsConnect())
  }

  render() {
    return <div id="WebSocketInterface" />;
  }
}

WebSocketInterface.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  websocketinterface: makeSelectWebSocketInterface()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: "webSocketInterface", reducer });
const withSaga = injectSaga({ key: "webSocketInterface", saga, mode: DAEMON });

export default compose(withReducer, withSaga, withConnect)(WebSocketInterface);
