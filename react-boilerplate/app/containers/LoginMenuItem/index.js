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
import ModalWrapper from "components/ModalWrapper";
import LoginForm from "containers/LoginForm";

export class LoginMenuItem extends React.Component {
  render() {
    return (
      <MenuItem eventKey={this.props.eventKey}>
        <div onClick={() => this.childModal.showModal()}>{this.props.children}</div>
        <ModalWrapper
          header="Login"
          body={LoginForm}
          footer={{ confirm: true, close: true }}
          ref={instance => {
            this.childModal = instance;
          }}
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
