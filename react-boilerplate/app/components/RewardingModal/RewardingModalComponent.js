import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  text2md,
  genre_type_dict as genreType,
  from_global_id as f,
} from 'common';
import { FormattedMessage, intlShape } from 'react-intl';
import { Flex, Box } from 'rebass';
import {
  Splitter,
  PuzzleFrame,
  ButtonOutline,
  DarkNicknameLink as NicknameLink,
} from 'style-store';
import genreMessages from 'components/TitleLabel/messages';
import UserAwardPopover from 'components/UserAwardPopover';

import CommentShowPanel from './CommentShowPanel';
import messages from './messages';

const Title = styled.h2`
  font-size: 1.4em;
  text-align: center;
`;

const Frame = PuzzleFrame.extend`
  margin: 5px 0;
  overflow: auto;
`;

const JumpButton = ButtonOutline.extend`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: inset 0 0 0 2px #2075c7;
    color: #4297e9;
  }
`;

const CloseButton = ButtonOutline.extend`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  color: #aa6644;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: inset 0 0 0 2px #b58900;
    color: #b58900;
  }
`;

const PuzzleUserLabel = NicknameLink.extend`
  padding: 5px;
  font-size: 1.1em;
  color: #033393;
`;

function RewardingModalComponent(props, context) {
  const _ = context.intl.formatMessage;
  const translateGenreCode = (x) => _(genreMessages[genreType[x]]);
  const genre = translateGenreCode(props.genre);
  const yami = props.yami ? ` x ${_(genreMessages.yami)}` : '';
  return (
    <div>
      <Frame>
        <Title>{`[${genre}${yami}] ${props.title}`}</Title>
        <Splitter />
        <div dangerouslySetInnerHTML={{ __html: text2md(props.content) }} />
        <div style={{ textAlign: 'right' }}>
          {'——'}
          <PuzzleUserLabel to={`/profile/show/${props.user.rowid}`}>
            {props.user.nickname}
          </PuzzleUserLabel>
          <UserAwardPopover
            style={{ color: '#033393' }}
            userAward={props.user.currentAward}
          />
        </div>
      </Frame>
      {props.commentSet.edges.map((edge) => (
        <Frame key={edge.node.id}>
          <CommentShowPanel node={edge.node} />
        </Frame>
      ))}
      {props.onHide && (
        <Flex wrap>
          <Box w={2 / 3}>
            <JumpButton
              px={1}
              onClick={() => props.jumpToPuzzle(f(props.id)[1])}
              style={{ borderRadius: '10px 0 0 10px' }}
            >
              <FormattedMessage {...messages.jump} />
            </JumpButton>
          </Box>
          <Box w={1 / 3}>
            <CloseButton
              px={1}
              onClick={props.onHide}
              style={{ borderRadius: '0 10px 10px 0' }}
            >
              <FormattedMessage {...messages.close} />
            </CloseButton>
          </Box>
        </Flex>
      )}
      {!props.onHide && (
        <JumpButton onClick={() => props.jumpToPuzzle(f(props.id)[1])}>
          <FormattedMessage {...messages.jump} />
        </JumpButton>
      )}
    </div>
  );
}

RewardingModalComponent.contextTypes = {
  intl: intlShape,
};

RewardingModalComponent.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  genre: PropTypes.number.isRequired,
  yami: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  commentSet: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  jumpToPuzzle: PropTypes.func.isRequired,
  onHide: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  jumpToPuzzle: (id) => dispatch(push(`/puzzle/show/${id}`)),
});

export default connect(null, mapDispatchToProps)(RewardingModalComponent);
