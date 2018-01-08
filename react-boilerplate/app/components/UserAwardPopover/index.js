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
        <a href="#null" role="button" style={{ color: 'black' }}>
          [{ua.award.name}]
        </a>
      </OverlayTrigger>
    );
  }
}

UserAwardPopover.propTypes = {
  userAward: PropTypes.object,
};

export default UserAwardPopover;
