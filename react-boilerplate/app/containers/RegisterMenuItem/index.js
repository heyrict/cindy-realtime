/**
 *
 * RegisterMenuItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { NavLink } from 'style-store';

import RegisterModal from 'containers/RegisterForm/Loadable';

class RegisterMenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }
  render() {
    return (
      <span>
        <NavLink
          onClick={() => this.setState({ show: true })}
          role="button"
          tabIndex="0"
        >
          {this.props.children}
        </NavLink>
        <RegisterModal
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
        />
      </span>
    );
  }
}

RegisterMenuItem.propTypes = {
  children: PropTypes.node,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(RegisterMenuItem);
