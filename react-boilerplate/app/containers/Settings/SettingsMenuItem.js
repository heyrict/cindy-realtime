/**
 *
 * SettingsMenuItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'style-store';

import SettingsModal from './index';

class SettingsMenuItem extends React.PureComponent {
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
        <SettingsModal
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
        />
      </span>
    );
  }
}

SettingsMenuItem.propTypes = {
  children: PropTypes.node,
};

export default SettingsMenuItem;
