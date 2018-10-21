/**
 *
 * PuzzlePanel
 *
 */
/* eslint-disable indent */

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Row, Divider } from 'rebass';
import { ImgXs, RoundedPanel } from 'style-store';
import styled from 'styled-components';

import TitleLabel from 'components/TitleLabel';
import UserLabel from 'components/UserLabel';
import RewardingModal from 'components/RewardingModal/Loadable';
import anonymousIcon from 'images/anonymous.png';

import StarLabel from './StarLabel';
import CommentLabel from './CommentLabel';
import BookmarkLabel from './BookmarkLabel';
import ProcessLabel from './ProcessLabel';
import StatusLabel from './StatusLabel';

const UserCol = styled(Box)`
  text-align: center;
  align-self: center;
  margin-top: 5px;
`;

const StyledButton = styled.button`
  padding: 0;
  margin-right: 6px;
`;

const AnonymousIcon = styled(ImgXs)`
  border: 1px solid #888;
  border-radius: 9999px;
  margin-bottom: 3px;
  margin-right: 6px;
  padding: 0 2px;
  display: inline-block;
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
    const { node, locale } = this.props;
    return (
      <RoundedPanel my={10}>
        <Row mx={10} py={10}>
          <UserCol w={[1 / 4, 1 / 6]} px={10}>
            <UserLabel
              user={node.user}
              anonymous={node.anonymous && node.status === 0}
              break
            />
            {this.props.additional}
          </UserCol>
          <Box w={[3 / 4, 5 / 6]} px={10}>
            <TitleLabel
              genre={node.genre}
              puzzleId={node.rowid}
              title={node.title}
              yami={node.yami}
              locale={locale}
              created={node.created}
            />
            <Divider my={2} />
            {node.anonymous && (
              <AnonymousIcon alt="anonymous" src={anonymousIcon} />
            )}
            <ProcessLabel qCount={node.quesCount} uaCount={node.uaquesCount} />
            <StatusLabel status={node.status} />
            {node.status > 0 && (
              <span>
                {node.starCount > 0 && (
                  <StarLabel
                    starCount={node.starCount}
                    starSum={node.starSum}
                  />
                )}
                {node.commentCount !== undefined &&
                  node.commentCount !== null && (
                    <StyledButton
                      onClick={() => this.toggleRewardingPanel(true)}
                    >
                      <CommentLabel commentCount={node.commentCount} />
                    </StyledButton>
                  )}
                {node.bookmarkCount !== undefined &&
                  node.bookmarkCount !== null && (
                    <BookmarkLabel bookmarkCount={node.bookmarkCount} />
                  )}
              </span>
            )}
          </Box>
          {node.status > 0 && (
            <RewardingModal
              id={node.id}
              show={this.state.rewardingShown}
              onHide={() => this.toggleRewardingPanel(false)}
            />
          )}
        </Row>
      </RoundedPanel>
    );
  }
}

PuzzlePanel.propTypes = {
  node: PropTypes.object.isRequired,
  additional: PropTypes.any,
  locale: PropTypes.string,
};

PuzzlePanel.defaultProps = {
  locale: 'ja',
};

export default PuzzlePanel;
