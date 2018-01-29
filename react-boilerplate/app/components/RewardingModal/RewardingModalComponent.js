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
`;

const JumpButton = ButtonOutline.extend`
  border-radius: 10px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  &:hover {
    background-color: blanchedalmond;
    color: #4297e9;
    border: 2px solid #2075c7;
  }
`;

function RewardingModalComponent(props, context) {
  const _ = context.intl.formatMessage;
  const translateGenreCode = (x) => _(genreMessages[genreType[x]]);
  const genre = translateGenreCode(props.genre);
  const yami = props.yami ? ` x ${_(genreMessages.yami)}` : '';
  console.log(props.commentSet.edges);
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
      <JumpButton onClick={() => props.jumpToPuzzle(f(props.id)[1])}>
        <FormattedMessage {...messages.jump} />
      </JumpButton>
    </div>
  );
}

RewardingModalComponent.contextTypes = {
  intl: intlShape,
};

RewardingModalComponent.propTypes = {
  title: PropTypes.string.isRequired,
  genre: PropTypes.number.isRequired,
  yami: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
  commentSet: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  jumpToPuzzle: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  jumpToPuzzle: (id) => dispatch(push(`/puzzle/show/${id}`)),
});

export default connect(null, mapDispatchToProps)(RewardingModalComponent);
