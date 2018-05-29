import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonOutline } from 'style-store';
import { Flex } from 'rebass';

function BtnSwitch(props) {
  const { onChange, options, selected } = props;
  return (
    <Flex flexWrap="wrap">
      {options.map((opt) => (
        <span key={opt.id}>
          {opt.id === selected ? (
            <Button
              px={1}
              py={1}
              onClick={() => onChange(opt)}
              style={{ marginRight: '5px' }}
            >
              {opt.label}
            </Button>
          ) : (
            <ButtonOutline
              px={1}
              py={1}
              onClick={() => onChange(opt)}
              style={{ marginRight: '5px' }}
            >
              {opt.label}
            </ButtonOutline>
          )}
        </span>
      ))}
    </Flex>
  );
}

BtnSwitch.propTypes = {
  selected: PropTypes.any,
  /* options of shape:
   * { id, label }
   */
  options: PropTypes.array,
  onChange: PropTypes.func,
};

export default BtnSwitch;
