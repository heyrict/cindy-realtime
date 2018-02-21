/**
 *
 * StatusLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { status_code_dict as STATUS_CODE } from 'common';

const StatusBase = styled.span`
  text-align: center;
  border-radius: 10px;
  padding: 0 6px;
  margin-right: 6px;
  margin-bottom: 3px;
`;

const styledStatus = (statusCode) => {
  switch (statusCode) {
    case 0: // unsolved
      return StatusBase.extend`
        border: 1px solid #cb4b16;
        color: #cb4b16;
      `;
    case 1: // solved
      return StatusBase.extend`
        border: 1px solid #859900;
        color: #859900;
      `;
    case 2: // dazed
      return StatusBase.extend`
        border: 1px solid #259185;
        color: #259185;
      `;
    case 3: // hidden
    case 4: // forced hidden
    default:
      return StatusBase.extend`
        border: 1px solid gray;
        color: gray;
      `;
  }
};

function StatusLabel(props) {
  const status = props.status;
  const translatedStatus = STATUS_CODE[status];
  const StyledStatus = styledStatus(status);
  return <StyledStatus>{translatedStatus}</StyledStatus>;
}

StatusLabel.propTypes = {
  status: PropTypes.number.isRequired,
};

export default StatusLabel;
