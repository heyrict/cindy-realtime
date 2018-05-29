import React from 'react';
import PropTypes from 'prop-types';
import { Box, Flex } from 'rebass';

export function Constrained(props) {
  const { children, level = 2, ...others } = props;
  const styles = {
    flexWrap: 'wrap',
    ml: -2,
    pl: 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...others,
  };
  let MW;
  if (level === 1) {
    MW = [5 / 6, 4 / 5, 3 / 4, 2 / 3];
  } else if (level === 2) {
    MW = [7 / 8, 5 / 6, 4 / 5, 3 / 4];
  } else if (level === 3) {
    MW = [11 / 12, 7 / 8, 5 / 6, 4 / 5];
  } else if (level === 4) {
    MW = [17 / 18, 11 / 12, 7 / 8, 5 / 6];
  } else {
    MW = [1, 17 / 18, 11 / 12, 7 / 8];
  }
  return (
    <Flex {...styles}>
      <Box width={MW}>{children}</Box>
    </Flex>
  );
}

Constrained.propTypes = {
  level: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default Constrained;
