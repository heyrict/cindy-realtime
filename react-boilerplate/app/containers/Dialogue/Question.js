import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { line2md } from 'common';
import { Box } from 'rebass';
import UserAwardPopover from 'components/UserAwardPopover';
import {
  DarkNicknameLink as NicknameLink,
  Time,
  Splitter,
  Indexer,
  PuzzleFrame,
} from 'style-store';

function Question(props) {
  return (
    <PuzzleFrame>
      <Box width={1}>
        <Indexer>{props.index}</Indexer>
        <NicknameLink to={`/profile/${props.user.rowid}`}>
          {props.user.nickname}
        </NicknameLink>
        <UserAwardPopover
          style={{ color: '#006388', fontSize: '1em' }}
          userAward={props.user.currentAward}
        />
        <Time>{moment(props.created).format('YYYY-MM-DD HH:mm')}</Time>
      </Box>
      <Splitter />
      <Box width={1}>
        <span dangerouslySetInnerHTML={{ __html: line2md(props.question) }} />
      </Box>
    </PuzzleFrame>
  );
}

Question.propTypes = {
  index: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  created: PropTypes.string.isRequired,
};

export default Question;
