import React from 'react';
import styled from 'styled-components';
import { DarkNicknameLink as NicknameLink } from 'style-store';
import UserAwardPopover from 'components/UserAwardPopover';
import PropTypes from 'prop-types';

const MessageWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid #006388;
  padding: 3px;
  margin: 5px 0;
  background-color: rgba(255, 255, 255, 0.382);
  font-size: 1.1em;
`;

function ChatMessage(props) {
  return (
    <MessageWrapper>
      <NicknameLink to={`/profile/${props.user.rowid}`}>
        {props.user.nickname}
      </NicknameLink>
      <UserAwardPopover
        userAward={props.user.currentAward}
        style={{ color: '#23527c', fontSize: '0.9em' }}
      />
      {'  '}
      {props.content}
    </MessageWrapper>
  );
}

ChatMessage.propTypes = {
  user: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
};

export default ChatMessage;
