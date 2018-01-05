/**
*
* StatusLabel
*
*/

import React from "react";
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import common from "common";

function StatusLabel(props) {
  const status = props.status;
  const status_class = common.status_class_dict[status];
  const translatedStatus = common.status_code_dict[status];
  return <div className={"status_label "+status_class}>{translatedStatus}</div>;
}

StatusLabel.propTypes = {
  status: PropTypes.number.isRequired
};

export default StatusLabel;
