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
  const { onChange } = props;
  return (
    <Flex flexWrap="wrap">
      {props.options.map(
        (option) =>
          option.value === props.value ? (
            <Button
              key={option.value}
              p={1}
              mx={1}
              onClick={() => onChange(option)}
            >
              {option.label || option.value}
            </Button>
          ) : (
            <ButtonOutline
              key={option.value}
              p={1}
              mx={1}
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
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.any,
    }),
  ),
};

export default ButtonSelect;
