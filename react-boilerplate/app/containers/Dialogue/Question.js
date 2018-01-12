import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { Flex, Box, Circle } from 'rebass';
import { StyledNicknameLink as Link } from 'components/UserLabel';
import UserAwardPopover from 'components/UserAwardPopover';

import { PuzzleFrame } from 'containers/PuzzleShowPage/Frame';

const StyledNicknameLink = Link.extend`
  font-size: 1em;
  color: #b928d7;
  margin: 5px;
  word-break: break-all;
`;

const StyledTime = styled.span`
  font-size: 0.8em;
  color: gray;
  margin: 5px;
`;

const Splitter = styled.hr`
  border-top: 1px solid #b928d7;
  margin: 5px 0;
  width: 100%;
`;

const Indexer = styled.span`
  background-color: #9716ba;
  color: #fce6d3;
  font-weight: bold;
  padding: 2px;
  min-width: 24px;
  border-radius: 100px;
`;

function Question(props) {
  return (
    <PuzzleFrame>
      <Box width={1}>
        <Indexer>{props.index}</Indexer>
        <StyledNicknameLink to={`/profile/${props.user.rowid}`}>
          {props.user.nickname}
        </StyledNicknameLink>
        <UserAwardPopover
          style={{ color: '#b928d7', fontSize: '1em' }}
          userAward={props.user.currentAward}
        />
        <StyledTime>
          {moment(props.created).format('YYYY-MM-DD HH:mm')}
        </StyledTime>
      </Box>
      <Splitter />
      <Box width={1}>{props.question}</Box>
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
