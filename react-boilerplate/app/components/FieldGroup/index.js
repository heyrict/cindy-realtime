/**
*
* FieldGroup
*
*/

import React from "react";
import PropTypes from "prop-types";
import { Col, FormGroup, ControlLabel, HelpBlock } from "react-bootstrap";
// import styled from 'styled-components';

function FieldGroup({ id, label, help, Ctl, valid, ...props }) {
  return (
    <FormGroup controlId={id} validationState={valid}>
      <Col componentClass={ControlLabel} xs={2}>
        {label}
      </Col>
      <Col xs={10}>
        <Ctl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </Col>
    </FormGroup>
  );
}

FieldGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  help: PropTypes.node,
  Ctl: PropTypes.any.isRequired,
  Valid: PropTypes.string
};

export default FieldGroup;
