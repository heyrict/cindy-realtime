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
import RewardingModal from 'components/RewardingModal/Loadable';

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

const StyledButton = styled.button`
  padding: 0;
  margin-right: 6px;
`;

export class PuzzlePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rewardingShown: false,
    };
    this.toggleRewardingPanel = (s) => this.setState({ rewardingShown: s });
  }
  render() {
    const UserLabelInst =
      this.props.relay === undefined ? UserLabelPlain : UserLabel;
    const node = this.props.node;
    return (
      <RoundedPanel my={10}>
        <Row mx={10} py={10}>
          <UserCol w={[1 / 4, 1 / 6]} px={10}>
            <UserLabelInst user={node.user} break />
            {this.props.additional}
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
              <Box ml="auto" style={{ alignSelf: 'center' }}>
                <PuzzleDate>
                  Created: {moment(node.created).format('YYYY-MM-DD HH:mm')}
                </PuzzleDate>
              </Box>
            </Flex>
            <Divider my={5} />
            <ProcessLabel qCount={node.quesCount} uaCount={node.uaquesCount} />
            <StatusLabel status={node.status} />
            {node.starSet &&
              node.starSet.edges.length > 0 && (
                <StarLabel starSet={node.starSet} puzzleId={node.id} />
              )}
            {node.commentCount !== undefined &&
              node.commentCount !== null && (
                <StyledButton onClick={() => this.toggleRewardingPanel(true)}>
                  <CommentLabel commentCount={node.commentCount} />
                </StyledButton>
              )}
          </Box>
          <RewardingModal
            id={node.id}
            show={this.state.rewardingShown}
            title={node.title}
            genre={node.genre}
            yami={node.yami}
            onHide={() => this.toggleRewardingPanel(false)}
          />
        </Row>
      </RoundedPanel>
    );
  }
}

PuzzlePanel.propTypes = {
  node: PropTypes.object.isRequired,
  relay: PropTypes.object,
  additional: PropTypes.any,
};

export default Relay.createFragmentContainer(
  PuzzlePanel,
  PuzzlePanelNodeFragment
);
