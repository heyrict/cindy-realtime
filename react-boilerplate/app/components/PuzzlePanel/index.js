/**
 *
 * PuzzlePanel
 *
 */

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Box, Row, Divider, Flex } from 'rebass';
import { RoundedPanel } from 'style-store';
import styled from 'styled-components';

import Relay from 'react-relay';

import ProcessLabel from 'components/ProcessLabel';
import StatusLabel from 'components/StatusLabel';
import TitleLabel from 'components/TitleLabel';
import UserLabel, { UserLabel as UserLabelPlain } from 'components/UserLabel';

import PuzzlePanelNodeFragment from 'graphql/PuzzlePanel';

import StarLabel from './StarLabel';
import CommentLabel from './CommentLabel';

const PuzzleDate = styled.span`
  color: gray;
  @media (max-width: 760px) {
    font-size: 0.9em;
  }
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
        <UserCol w={[1 / 4, 1 / 6]} px={10}>
          <UserLabelInst user={node.user} />
        </UserCol>
        <Box w={[3 / 4, 5 / 6]} px={10}>
          <Flex wrap>
            <Box>
              <TitleLabel
                genre={node.genre}
                puzzleId={node.rowid}
                title={node.title}
                yami={node.yami}
              />
            </Box>
            <Box ml="auto">
              <PuzzleDate>
                Created: {moment(node.created).format('YYYY-MM-DD HH:mm')}
              </PuzzleDate>
            </Box>
          </Flex>
          <Divider my={5} />
          <ProcessLabel qCount={node.quesCount} uaCount={node.uaquesCount} />
          <StatusLabel status={node.status} />
          {node.starCount !== undefined &&
            node.starSum !== undefined && (
              <StarLabel starCount={node.starCount} starSum={node.starSum} />
            )}
          {node.commentCount !== undefined && (
            <CommentLabel commentCount={node.commentCount} />
          )}
        </Box>
      </Row>
    </RoundedPanel>
  );
}

PuzzlePanel.propTypes = {
  node: PropTypes.object.isRequired,
  relay: PropTypes.object,
};

export default Relay.createFragmentContainer(
  PuzzlePanel,
  PuzzlePanelNodeFragment
);
