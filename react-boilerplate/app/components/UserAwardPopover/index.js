/**
 *
 * UserAwardPopover
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Popover, OverlayTrigger } from 'react-bootstrap';
// import styled from 'styled-components';

class UserAwardPopover extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const ua = this.props.userAward;
    if (!ua) {
      return null;
    }
    const popoverAward = (
      <Popover id={ua.id} title={ua.award.name}>
        {ua.award.description}
        <br />
        <span
          className="pull-right"
          style={{ color: '#ff582b', fontWeight: 'bold' }}
        >
          <span role="img" aria-label="gold-cup">
            🏆
          </span>
          {ua.created}
        </span>
      </Popover>
    );
    return (
      <OverlayTrigger placement="top" trigger="focus" overlay={popoverAward}>
        <button style={{ color: 'black', padding: '0', ...this.props.style }}>
          [{ua.award.name}]
        </button>
      </OverlayTrigger>
    );
  }
}

UserAwardPopover.propTypes = {
  userAward: PropTypes.object,
  style: PropTypes.object,
};

UserAwardPopover.defaultProps = {
  style: {},
};

export default UserAwardPopover;
