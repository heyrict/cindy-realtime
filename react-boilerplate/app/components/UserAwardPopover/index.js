/**
 *
 * UserAwardPopover
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { line2md } from 'common';
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
        <span
          dangerouslySetInnerHTML={{ __html: line2md(ua.award.description) }}
        />
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
      <OverlayTrigger
        trigger="click"
        rootClose
        overlay={popoverAward}
        placement={this.props.placement || 'top'}
      >
        <button style={{ color: 'black', padding: '0', ...this.props.style }}>
          [{ua.award.name}]
        </button>
      </OverlayTrigger>
    );
  }
}

UserAwardPopover.propTypes = {
  userAward: PropTypes.object,
  placement: PropTypes.string,
  style: PropTypes.object,
};

UserAwardPopover.defaultProps = {
  style: {},
};

export default UserAwardPopover;
