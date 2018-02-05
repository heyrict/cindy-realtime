/**
 *
 * SponsersMenuItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'rebass';

import SponsersModal from 'components/SponsersModal/Loadable';

class SponsersMenuItem extends React.PureComponent {
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
        <SponsersModal
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
        />
      </span>
    );
  }
}

SponsersMenuItem.propTypes = {
  children: PropTypes.node,
};

export default SponsersMenuItem;
