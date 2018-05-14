import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';
import { ImgXs, Button } from 'style-store';

const ToolbarBtn = Button.extend`
  padding: 5px 10px;
  margin: 0;
  border-radius: 0;
`;

export const Toolbar = ({ options }) => (
  <Flex>
    {options.map((obj) => (
      <Box key={obj.name}>
        <ToolbarBtn onClick={obj.callback}>
          {obj.icon ? <ImgXs alt={obj.name} src={obj.icon} /> : obj.name}
        </ToolbarBtn>
      </Box>
    ))}
  </Flex>
);

Toolbar.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
      icon: PropTypes.any,
    })
  ),
};

export default Toolbar;
