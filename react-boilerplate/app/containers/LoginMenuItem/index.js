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
import LoginModal from "containers/LoginForm";

import { show } from "containers/LoginForm/actions";

export class LoginMenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }
  render() {
    return (
      <MenuItem eventKey={this.props.eventKey}>
        <div onClick={() => this.setState({ show: true })}>
          {this.props.children}
        </div>
        <LoginModal
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
        />
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
