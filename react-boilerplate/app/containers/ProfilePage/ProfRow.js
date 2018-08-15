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
      <Box w={[1 / 3, 1 / 4]} px={1}>
        {props.heading}
      </Box>
      <Box w={[2 / 3, 3 / 4]} px={1}>
        {props.content}
      </Box>
    </StyledFlex>
  );
}

ProfRow.propTypes = {
  heading: PropTypes.any.isRequired,
  content: PropTypes.any.isRequired,
};

export default ProfRow;
