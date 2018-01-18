import React from 'react';
import PropTypes from 'prop-types';

function ChatMessage(props) {
  return (
    <div>
      {props.user.nickname} puts {props.content}
    </div>
  );
}

ChatMessage.propTypes = {
  user: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
};

export default ChatMessage;
