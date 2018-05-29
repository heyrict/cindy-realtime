import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';
import { ButtonOutline } from 'style-store';

const StyledBar = ButtonOutline.extend`
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    color: brown;
  }
`;

function Bar(props) {
  const { open, children, ...others } = props;
  return (
    <StyledBar
      {...others}
      color="brown"
      border="2px solid brown"
      borderRadius={0}
      my={1}
      w={1}
      p={1}
    >
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
