/**
 *
 * StampTooltip
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';
import { Tooltip } from 'react-tippy';
// import styled from 'styled-components';

import { ImgMd } from 'style-store';
import { stamps } from 'stamps';

const StampTooltip = (props) => (
  <Tooltip
    html={
      <Flex style={{ maxHeight: '8em' }}>
        {Object.entries(stamps).map(([name, src]) => (
          <Box
            is="button"
            w={0.25}
            key={name}
            onClick={() => props.onClick(name, src)}
          >
            <ImgMd alt={name} src={src} />
          </Box>
        ))}
      </Flex>
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
};

StampTooltip.defaultProps = {
  onClick: () => {},
};

export default StampTooltip;
