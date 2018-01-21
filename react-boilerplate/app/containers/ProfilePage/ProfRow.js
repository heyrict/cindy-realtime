import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Box } from 'rebass';

const StyledFlex = styled(Flex)`
  border: 2px solid darkgoldenrod;
  padding: 3px 0;
  margin: 3px 0;
  font-size: 1.1em;
  border-radius: 5px;
`;

function ProfRow(props) {
  return (
    <StyledFlex w={1}>
      <Box w={[1 / 4, 1 / 6]}>{props.heading}</Box>
      <Box w={[3 / 4, 5 / 6]}>{props.content}</Box>
    </StyledFlex>
  );
}

ProfRow.propTypes = {
  heading: PropTypes.any.isRequired,
  content: PropTypes.element,
};

export default ProfRow;
