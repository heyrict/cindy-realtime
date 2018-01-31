/**
 *
 * Slider
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Slider as RebassSlider } from 'rebass';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function Slider(props) {
  const { value, template, placement, ...others } = props;
  return (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip id="sliderTooltip">{template(props.value)}</Tooltip>}
    >
      <RebassSlider value={value} {...others} />
    </OverlayTrigger>
  );
}

Slider.propTypes = {
  value: PropTypes.number.isRequired,
  template: PropTypes.func,
  placement: PropTypes.string,
};

Slider.defaultProps = {
  template: (t) => t,
  placement: 'top',
};

export default Slider;
