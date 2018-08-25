/**
 *
 * FieldGroup
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';
// import styled from 'styled-components';

function FieldGroup({ label, help, Ctl, CtlElement, ...props }) {
  return (
    <Flex flexWrap="wrap" mb={1} px={1} w={1}>
      <Box w={[0.28, 0.2, 0.1]}>{label}</Box>
      <Box w={[0.68, 0.75, 0.82]} ml="auto">
        {Ctl && <Ctl {...props} />}
        {CtlElement}
        {help && <span>{help}</span>}
      </Box>
    </Flex>
  );
}

FieldGroup.propTypes = {
  label: PropTypes.node,
  help: PropTypes.node,
  Ctl: PropTypes.any,
  CtlElement: PropTypes.any,
  style: PropTypes.object,
};

FieldGroup.defaultProps = {
  style: {},
};

export default FieldGroup;
