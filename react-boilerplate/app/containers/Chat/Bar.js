import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';
import { ButtonOutline } from 'style-store';

const StyledBar = ButtonOutline.extend`
  padding: 3px;
  margin: 5px 0 5px 0;
  width: 100%;
  border-radius: 0;
  box-shadow: 0 0 0 2px sienna;
  color: brown;
  &:hover {
    box-shadow: 0 0 0 2px sienna;
    background-color: rgba(0, 0, 0, 0.1);
    color: brown;
  }
`;

function Bar(props) {
  const { open, children, ...others } = props;
  return (
    <StyledBar {...others}>
      <Flex w={1} mx={1}>
        <Box>{children}</Box>
        <Box ml="auto" mr={2}>
          {open ? '-' : '+'}
        </Box>
      </Flex>
    </StyledBar>
  );
}

Bar.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.any,
};

export default Bar;
