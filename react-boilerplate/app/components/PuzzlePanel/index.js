/**
*
* PuzzlePanel
*
*/

import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { push } from "react-router-redux";
import { Panel, Grid, Col, Row, Clearfix } from "react-bootstrap";
import styled from "styled-components";

import { graphql, createFragmentContainer } from "react-relay";

import ProcessLabel from "components/ProcessLabel";
import StarLabel from "components/StarLabel";
import StatusLabel from "components/StatusLabel";
import TitleLabel from "components/TitleLabel";
import UserLabel, { UserLabel as UserLabelPlain } from "components/UserLabel";
import UserAwardPopover from "components/UserAwardPopover";

const PuzzleDate = styled.span`
  color: gray;
  font-size: 0.8em;
`;

const RoundedPanel = styled(Panel)`border-radius: 20px;`;

const UserCol = styled(Col)`
  text-align: center;
  margin-top: 5px;
`;

export function PuzzlePanel(props) {
  const UserLabelInst = props.relay === undefined ? UserLabelPlain : UserLabel;
  const node = props.node;
  return (
    <RoundedPanel>
      <Grid fluid>
        <Row>
          <UserCol xs={3} sm={2} md={1}>
            <UserLabelInst user={node.user} />
          </UserCol>
          <Col xs={9} sm={10} md={11}>
            <Row>
              <TitleLabel
                genre={node.genre}
                puzzleId={node.rowid}
                title={node.title}
              />
              <PuzzleDate>{moment(node.created).format("llll")}</PuzzleDate>
            </Row>
            <Row>
              <StatusLabel status={node.status} />
              <StarLabel starSet={node.starSet} />
            </Row>
          </Col>
        </Row>
        <Clearfix />
      </Grid>
    </RoundedPanel>
  );
}

PuzzlePanel.propTypes = {
  node: PropTypes.object.isRequired
};

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
