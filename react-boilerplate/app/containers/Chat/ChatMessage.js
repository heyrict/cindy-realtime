import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Time } from 'style-store';
import UserLabel from 'components/UserLabel';
import { line2md } from 'common';

const MessageWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid #006388;
  padding: 3px;
  margin: 5px 0;
  background-color: rgba(255, 255, 255, 0.382);
  font-size: 1.1em;
`;

const PrecedingSpan = styled.span`
  color: chocolate;
  font-family: consolas, inconsolata, monaco, sans-serif;
`;

function ChatMessage(props) {
  return (
    <MessageWrapper>
      {props.precedingStr && (
        <PrecedingSpan>{props.precedingStr}</PrecedingSpan>
      )}
      <UserLabel user={props.user} />
      {props.created && (
        <Time>{moment(props.created).format('YYYY-MM-DD HH:mm')}</Time>
      )}
      <div
        style={{ overflow: 'auto' }}
        dangerouslySetInnerHTML={{ __html: line2md(props.content) }}
      />
    </MessageWrapper>
  );
}

ChatMessage.propTypes = {
  user: PropTypes.shape({
    rowid: PropTypes.number.isRequired,
    nickname: PropTypes.string.isRequired,
    currentAward: PropTypes.object,
  }),
  precedingStr: PropTypes.string,
  created: PropTypes.string,
  content: PropTypes.string.isRequired,
};

export default ChatMessage;
