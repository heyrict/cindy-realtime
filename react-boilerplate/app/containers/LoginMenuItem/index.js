/**
 *
 * LoginMenuItem
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { MenuItem } from "react-bootstrap";
import LoginForm from "containers/LoginForm";

import { show } from "containers/LoginForm/actions";

export class LoginMenuItem extends React.Component {
  render() {
    return (
      <MenuItem eventKey={this.props.eventKey}>
        <div onClick={() => this.props.dispatch(show())}>
          {this.props.children}
        </div>
        <LoginForm />
      </MenuItem>
    );
  }
}

LoginMenuItem.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(LoginMenuItem);
