import React from 'react';
import PropTypes from 'prop-types';

import DirectChat from './DirectChat';
import Users from './Users';

function Direct(props) {
  return props.chat.activeDirectChat ? (
    <DirectChat {...props} />
  ) : (
    <Users {...props} />
  );
}

Direct.propTypes = {
  chat: PropTypes.shape({
    activeDirectChat: PropTypes.string,
  }),
};

export default Direct;
