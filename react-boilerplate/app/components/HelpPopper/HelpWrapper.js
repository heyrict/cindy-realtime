import React from 'react';
import { line2md } from 'common';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { intlShape } from 'react-intl';
import messages from './messages';

function HelpWrapper({ messageId, children }, { intl }) {
  const _ = intl.formatMessage;
  const popoverDetail = (
    <div
      dangerouslySetInnerHTML={{ __html: line2md(_(messages[messageId])) }}
    />
  );

  return (
    <Tooltip position="top" html={popoverDetail} theme="cindy" interactive>
      {children}
    </Tooltip>
  );
}

HelpWrapper.propTypes = {
  messageId: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
};

HelpWrapper.contextTypes = {
  intl: intlShape,
};

export default HelpWrapper;
