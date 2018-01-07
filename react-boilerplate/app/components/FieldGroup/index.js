/**
*
* FieldGroup
*
*/

import React from "react";
import PropTypes from "prop-types";
import { Col, FormGroup, ControlLabel } from "react-bootstrap";
// import styled from 'styled-components';

function FieldGroup({ id, label, help, Ctl, ...props }) {
  return (
    <FormGroup controlId={id}>
      {help && <HelpBlock>{help}</HelpBlock>}
      <Col componentClass={ControlLabel} xs={2}>
        {label}
      </Col>
      <Col xs={10}>
        <Ctl {...props} />
      </Col>
    </FormGroup>
  );
}

FieldGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  help: PropTypes.node,
  Ctl: PropTypes.any.isRequired
};

export default FieldGroup;
