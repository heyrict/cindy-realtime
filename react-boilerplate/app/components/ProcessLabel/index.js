/**
*
* ProcessLabel
*
*/

import React from "react";
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import common from "common";

function ProcessLabel(props) {
  const qCount = props.qCount;
  const uaCount = props.uaCount;
  const content = uaCount + "/" + qCount;
  if (uaCount == 0) {
    return <div className="process_label answered">{content}</div>;
  } else {
    return <div className="process_label unanswered">{content}</div>;
  }
}

ProcessLabel.propTypes = {
  qCount: PropTypes.number.isRequired,
  uaCount: PropTypes.number.isRequired
};

export default ProcessLabel;
