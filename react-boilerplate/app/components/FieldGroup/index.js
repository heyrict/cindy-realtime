/**
*
* FieldGroup
*
*/

import React from "react";
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

export default FieldGroup;
