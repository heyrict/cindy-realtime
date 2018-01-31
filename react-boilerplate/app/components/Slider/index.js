/**
 *
 * Slider
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Slider as RebassSlider } from 'rebass';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function Slider(props) {
  const { value, template, placement, onChange, style, ...others } = props;
  return (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip id="sliderTooltip">{template(props.value)}</Tooltip>}
    >
      <RebassSlider
        value={value}
        readOnly={onChange === null}
        style={{ margin: '5px 3px', ...style }}
        {...others}
      />
    </OverlayTrigger>
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
  onChange: null,
};

export default Slider;
