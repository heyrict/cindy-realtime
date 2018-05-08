/**
 *
 * UserAwardPopover
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { line2md } from 'common';
import { Tooltip } from 'react-tippy';
// import styled from 'styled-components';

function UserAwardPopover(props) {
  const ua = props.userAward;
  if (!ua) {
    return null;
  }
  const popoverAward = (
    <div>
      <h3>{ua.award.name}</h3>
      <span
        dangerouslySetInnerHTML={{ __html: line2md(ua.award.description) }}
      />
      <br />
      {ua.created && (
        <span style={{ color: '#ff582b', fontWeight: 'bold' }}>
          <span role="img" aria-label="gold-cup">
            🏆
          </span>
          {ua.created}
        </span>
      )}
    </div>
  );
  return (
    <Tooltip
      position={props.placement || 'top'}
      html={popoverAward}
      theme="cindy"
    >
      <button style={{ color: 'black', padding: '0', ...props.style }}>
        [{ua.award.name}]
      </button>
    </Tooltip>
  );
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
