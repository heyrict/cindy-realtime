/**
 *
 * LoginMenuItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { MenuItem } from 'react-bootstrap';
import LoginModal from 'containers/LoginForm';

export class LoginMenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }
  render() {
    return (
      <MenuItem eventKey={this.props.eventKey}>
        <div
          onClick={() => this.setState({ show: true })}
          role="button"
          tabIndex={this.props.tabIndex ? this.props.tabIndex : '-1'}
        >
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
  eventKey: PropTypes.number,
  children: PropTypes.node,
  tabIndex: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(LoginMenuItem);
