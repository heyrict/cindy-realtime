/**
 *
 * StampTooltip
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';

import StampTooltipContent from './StampTooltipContent';

const StampTooltip = (props) => (
  <Tooltip
    html={
      <StampTooltipContent
        onClick={props.onClick}
        chatStamps={props.chatStamps}
        puzzleStamps={props.puzzleStamps}
      />
    }
    interactive
    position="top"
    theme="cindy"
    trigger="click"
  >
    {props.children}
  </Tooltip>
);

StampTooltip.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any,
  chatStamps: PropTypes.bool,
  puzzleStamps: PropTypes.bool,
};

StampTooltip.defaultProps = {
  onClick: () => {},
};

export default StampTooltip;
