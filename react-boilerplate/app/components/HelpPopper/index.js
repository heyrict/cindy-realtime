/**
 *
 * HelpPopper
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ImgXs } from 'style-store';
import help from 'images/help.svg';
// import styled from 'styled-components';

import HelpWrapper from './HelpWrapper';

function HelpPopper({ messageId }) {
  return (
    <HelpWrapper messageId={messageId}>
      <sup style={{ cursor: 'pointer' }}>
        <ImgXs src={help} alt="help" />
      </sup>
    </HelpWrapper>
  );
}

HelpPopper.propTypes = {
  messageId: PropTypes.string.isRequired,
};

export default HelpPopper;
