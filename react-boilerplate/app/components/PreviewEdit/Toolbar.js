import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { Flex, Box } from 'rebass';
import { Tooltip } from 'react-tippy';
import { Button } from 'style-store';

const ToolbarBtn = styled(Button)`
  padding: 5px 10px;
  margin: 0;
  border-radius: 0;
`;

export const Toolbar = ({ options }) => (
  <Flex flexWrap="wrap">
    {options.map((obj) => (
      <Box key={obj.name}>
        {obj.tooltipEnabled ? (
          <Tooltip {...obj.tooltipOptions}>
            <ToolbarBtn>{obj.icon || obj.name}</ToolbarBtn>
          </Tooltip>
        ) : (
          <ToolbarBtn onClick={obj.callback}>{obj.icon || obj.name}</ToolbarBtn>
        )}
      </Box>
    ))}
  </Flex>
);

Toolbar.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      callback: PropTypes.func,
      tooltipEnabled: PropTypes.bool,
      tooltipOptions: PropTypes.object,
      icon: PropTypes.any,
    }),
  ),
};

export default Toolbar;
