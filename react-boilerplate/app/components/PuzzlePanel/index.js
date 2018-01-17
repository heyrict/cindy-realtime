/**
 *
 * PuzzlePanel
 *
 */

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Panel, Box, Row, Divider } from 'rebass';
import styled from 'styled-components';

import { createFragmentContainer } from 'react-relay';

import ProcessLabel from 'components/ProcessLabel';
import StarLabel from 'components/StarLabel';
import StatusLabel from 'components/StatusLabel';
import TitleLabel from 'components/TitleLabel';
import UserLabel, { UserLabel as UserLabelPlain } from 'components/UserLabel';

const PuzzleDate = styled.span`
  color: gray;
  font-size: 0.8em;
`;

const RoundedPanel = styled(Panel)`
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.382);
`;

const UserCol = styled(Box)`
  text-align: center;
  align-self: center;
  margin-top: 5px;
`;

export function PuzzlePanel(props) {
  const UserLabelInst = props.relay === undefined ? UserLabelPlain : UserLabel;
  const node = props.node;
  return (
    <RoundedPanel my={10}>
      <Row mx={10} py={10}>
        <UserCol w={[1 / 3, 1 / 4, 1 / 6]} px={10}>
          <UserLabelInst user={node.user} />
        </UserCol>
        <Box w={[2 / 3, 3 / 4, 5 / 6]} px={10}>
          <TitleLabel
            genre={node.genre}
            puzzleId={node.rowid}
            title={node.title}
            yami={node.yami}
          />
          <PuzzleDate>{moment(node.created).format('llll')}</PuzzleDate>
          <Divider mt={10} mb={5} />
          <ProcessLabel qCount={node.quesCount} uaCount={node.uaquesCount} />
          <StatusLabel status={node.status} />
          {node.starSet ? <StarLabel starSet={node.starSet} /> : null}
        </Box>
      </Row>
    </RoundedPanel>
  );
}

PuzzlePanel.propTypes = {
  node: PropTypes.object.isRequired,
  relay: PropTypes.object,
};

export default createFragmentContainer(PuzzlePanel, {
  node: graphql`
    fragment PuzzlePanel_node on PuzzleNode {
      id
      rowid
      genre
      yami
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
  `,
});
