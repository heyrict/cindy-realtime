/**
 *
 * RegisterMenuItem
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { MenuItem } from "react-bootstrap";
import RegisterModal from "containers/RegisterForm/Loadable";

class RegisterMenuItem extends React.Component {
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
        <RegisterModal
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
        />
      </MenuItem>
    );
  }
}

RegisterMenuItem.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(RegisterMenuItem);
