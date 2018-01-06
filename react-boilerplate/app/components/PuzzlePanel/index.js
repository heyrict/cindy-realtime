/**
*
* PuzzlePanel
*
*/

import React from "react";
import moment from "moment";
import { push } from "react-router-redux";
import { Panel, Grid, Col, Row, Clearfix } from "react-bootstrap";
import styled from "styled-components";

import { graphql, createFragmentContainer } from "react-relay";

import ProcessLabel from "components/ProcessLabel";
import StarLabel from "components/StarLabel";
import StatusLabel from "components/StatusLabel";
import TitleLabel from "components/TitleLabel";
import UserLabel from "components/UserLabel";
import UserAwardPopover from "components/UserAwardPopover";

const PuzzleTitle = styled.h3`
  display: inline-block;
  color: brown;
  font-size: 1.5em;
  margin: 0.2em;
  padding: 0.1em 0.25em;
`;

const PuzzleDate = styled.span`
  color: gray;
  font-size: 0.8em;
`;

const SolarizedPanel = styled(Panel)`border-radius: 20px;`;

function PuzzlePanel(props) {
  const node = props.node;
  return (
    <SolarizedPanel>
      <Grid fluid>
        <Row>
          <Col xs={3} sm={2} md={1} style={{ "text-align": "center", "margin-top": "5px" }}>
            <UserLabel user={node.user} />
          </Col>
          <Col xs={9} sm={10} md={11}>
            <Row>
              <PuzzleTitle>{node.title}</PuzzleTitle>
              <PuzzleDate>{moment(node.created).format("llll")}</PuzzleDate>
            </Row>
            <Row>
              <StarLabel starSet={node.starSet} />
            </Row>
          </Col>
        </Row>
        <Clearfix />
      </Grid>
    </SolarizedPanel>
  );
}

PuzzlePanel.propTypes = {};

export default createFragmentContainer(PuzzlePanel, {
  node: graphql`
    fragment PuzzlePanel_node on PuzzleNode {
      id
      rowid
      genre
      title
      status
      created
      content
      quesCount
      uaquesCount
      starSet {
        edges {
          node {
            value
          }
        }
      }
      user {
        ...UserLabel_user
      }
    }
  `
});
