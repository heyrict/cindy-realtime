import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonOutline } from 'style-store';
import { Flex } from 'rebass';

const StyledButtonOutline = ButtonOutline.extend`
  border-radius: 10px;
  padding: 10px;
`;

const StyledButton = Button.extend`
  border-radius: 10px;
  padding: 10px;
`;

function BtnSwitch(props) {
  const { onChange, options, selected } = props;
  return (
    <Flex wrap>
      {options.map((opt) => (
        <span key={opt.id}>
          {opt.id === selected ? (
            <StyledButton
              onClick={() => onChange(opt)}
              style={{ marginRight: '5px' }}
            >
              {opt.label}
            </StyledButton>
          ) : (
            <StyledButtonOutline
              onClick={() => onChange(opt)}
              style={{ marginRight: '5px' }}
            >
              {opt.label}
            </StyledButtonOutline>
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
