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
import { Splitter, PuzzleFrame, ButtonOutline } from 'style-store';
import genreMessages from 'components/TitleLabel/messages';

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
      </Frame>
      {props.commentSet.edges.map((edge) => (
        <Frame key={edge.node.id}>
          <CommentShowPanel node={edge.node} />
        </Frame>
      ))}
      <Flex wrap>
        <Box w={2 / 3}>
          <JumpButton
            onClick={() => props.jumpToPuzzle(f(props.id)[1])}
            style={{ borderRadius: '10px 0 0 10px' }}
          >
            <FormattedMessage {...messages.jump} />
          </JumpButton>
        </Box>
        <Box w={1 / 3}>
          <JumpButton
            onClick={props.onHide}
            style={{ borderRadius: '0 10px 10px 0' }}
          >
            <FormattedMessage {...messages.close} />
          </JumpButton>
        </Box>
      </Flex>
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
  content: PropTypes.string.isRequired,
  commentSet: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  jumpToPuzzle: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  jumpToPuzzle: (id) => dispatch(push(`/puzzle/show/${id}`)),
});

export default connect(null, mapDispatchToProps)(RewardingModalComponent);
