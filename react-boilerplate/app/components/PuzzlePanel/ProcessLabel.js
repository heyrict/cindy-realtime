/**
 *
 * ProcessLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ProcessBase = styled.span`
  border-radius: 10px;
  display: inline-block;
  font-weight: bold;
  margin-bottom: 3px;
  margin-right: 6px;
  padding: 0 6px;
  text-align: center;
`;

const styledProcess = (uaquesCount) => {
  switch (uaquesCount) {
    case 0: // answered
      return styled(ProcessBase)`
  background: #85d514;
  color: #eee8d5;
`;
    default:
      // unanswered
      return styled(ProcessBase)`
  background: #b58900;
  color: #eee8d5;
`;
  }
};

function ProcessLabel(props) {
  const qCount = props.qCount;
  const uaCount = props.uaCount;
  const content = `${uaCount}/${qCount}`;
  const ProcessStatus = styledProcess(uaCount);
  return <ProcessStatus>{content}</ProcessStatus>;
}

ProcessLabel.propTypes = {
  qCount: PropTypes.number.isRequired,
  uaCount: PropTypes.number.isRequired,
};

export default ProcessLabel;
