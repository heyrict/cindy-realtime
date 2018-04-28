/**
 *
 * FieldGroup
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';
// import styled from 'styled-components';

function FieldGroup({ label, help, Ctl, valid, style, ...props }) {
  return (
    <Flex wrap mb={1}>
      <Box w={[0.28, 0.2, 0.1]}>{label}</Box>
      <Box w={[0.68, 0.75, 0.82]} ml="auto">
        <Ctl
          style={{
            ...style,
            boxShadow:
              valid === 'error'
                ? 'inset 0 0 0 1px #d01b24'
                : 'inset 0 0 0 1px #2075c7',
          }}
          {...props}
        />
        {help && <span>{help}</span>}
      </Box>
    </Flex>
  );
}

FieldGroup.propTypes = {
  label: PropTypes.node.isRequired,
  help: PropTypes.node,
  Ctl: PropTypes.any.isRequired,
  style: PropTypes.object,
  valid: PropTypes.string,
};

FieldGroup.defaultProps = {
  style: {},
};

export default FieldGroup;
