/**
 *
 * ButtonSelect
 *
 */

import React from 'react';
import { Flex } from 'rebass';
import { Button, ButtonOutline } from 'style-store';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

export function ButtonSelect(props) {
  const { onChange, buttonProps } = props;
  return (
    <Flex style={props.style} flexWrap="wrap">
      {props.options.map(
        (option) =>
          option.value === props.value ? (
            <Button
              key={option.value}
              p={1}
              mr={1}
              mb={1}
              {...buttonProps}
              onClick={() => onChange(option)}
            >
              {option.label || option.value}
            </Button>
          ) : (
            <ButtonOutline
              key={option.value}
              p={1}
              mr={1}
              mb={1}
              {...buttonProps}
              onClick={() => onChange(option)}
            >
              {option.label || option.value}
            </ButtonOutline>
          ),
      )}
    </Flex>
  );
}

ButtonSelect.propTypes = {
  value: PropTypes.any,
  style: PropTypes.object,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.any,
    }),
  ),
  buttonProps: PropTypes.object,
};

ButtonSelect.defaultProps = {
  buttonProps: {},
  style: {},
};

export default ButtonSelect;
