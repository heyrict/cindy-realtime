/**
*
* PuzzlePanel
*
*/

import React from "react";
import { push } from "react-router-redux";
import { Panel, Grid, Col, Row, Clearfix } from "react-bootstrap";
// import styled from 'styled-components';
import ProcessLabel from "components/ProcessLabel";
import StarLabel from "components/StarLabel";
import StatusLabel from "components/StatusLabel";
import TitleLabel from "components/TitleLabel";
import UserAwardPopover from "components/UserAwardPopover";

function PuzzlePanel() {
  return (
    <Panel>
      <Grid fluid>
        <Row>
          <Col xs={3} sm={2} md={1}>
            {"user"}
          </Col>
          <Col xs={9} sm={10} md={11}>
            <Row>{"title"}</Row>
            <Row>{"statistics"}</Row>
          </Col>
        </Row>
        <Clearfix />
        <Row>{"preview"}</Row>
        <Row>{"comment"}</Row>
      </Grid>
    </Panel>
  );
}

PuzzlePanel.propTypes = {};

export default PuzzlePanel;
