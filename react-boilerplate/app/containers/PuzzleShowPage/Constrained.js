import React from 'react';
import PropTypes from 'prop-types';
import { Box, Flex } from 'rebass';

export function Constrained(props) {
  const { children, level = 2, ...others } = props;
  const styles = {
    wrap: true,
    ml: -2,
    pl: 2,
    justify: 'center',
    align: 'center',
    ...others,
  };
  let PW;
  let MW;
  if (level === 1) {
    PW = [1 / 12, 1 / 10, 1 / 8, 1 / 6];
    MW = [5 / 6, 4 / 5, 3 / 4, 2 / 3];
  } else if (level === 2) {
    PW = [1 / 16, 1 / 12, 1 / 10, 1 / 8];
    MW = [7 / 8, 5 / 6, 4 / 5, 3 / 4];
  } else if (level === 3) {
    PW = [1 / 24, 1 / 16, 1 / 12, 1 / 10];
    MW = [11 / 12, 7 / 8, 5 / 6, 4 / 5];
  } else {
    PW = [1 / 36, 1 / 24, 1 / 16, 1 / 12];
    MW = [17 / 18, 11 / 12, 7 / 8, 5 / 6];
  }
  return (
    <Flex {...styles}>
      <Box width={PW} />
      <Box width={MW}>{children}</Box>
      <Box width={PW} />
    </Flex>
  );
}

Constrained.propTypes = {
  level: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default Constrained;
