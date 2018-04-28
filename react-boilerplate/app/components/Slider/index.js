/**
 *
 * Slider
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Slider as RebassSlider } from 'rebass';
import { Tooltip } from 'react-tippy';

function Slider(props) {
  const { value, template, placement, style, ...others } = props;
  return (
    <Tooltip position={placement} html={template(props.value)}>
      <RebassSlider
        value={value}
        style={{ margin: '5px 3px', ...style }}
        {...others}
      />
    </Tooltip>
  );
}

Slider.propTypes = {
  value: PropTypes.number.isRequired,
  template: PropTypes.func,
  placement: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
};

Slider.defaultProps = {
  template: (t) => t,
  placement: 'top',
};

export default Slider;
