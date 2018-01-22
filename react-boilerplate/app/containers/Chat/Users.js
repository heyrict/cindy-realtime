import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Flex, Border } from 'rebass';
import { FormattedMessage } from 'react-intl';
import { ButtonOutline } from 'style-store';

import { changeDirectchat } from './actions';
import messages from './messages';

const StyledButton = ButtonOutline.extend`
  border-radius: 10px;
  padding: 5px;
  margin: 5px 3px;
`;

function Users(props) {
  const C = props.chat;
  return (
    <div>
      {Object.keys(C.directMessages).length !== 0 && (
        <Border top bottom py={1} my={1}>
          <FormattedMessage {...messages.recent} />
        </Border>
      )}
      <Flex wrap>
        {Object.entries(C.directMessages).map((u) => (
          <StyledButton key={u[0]} onClick={() => props.openChat(u[0])}>
            {C.onlineUsers[u[0]] || `User ${u[0]} (Offline)`}
          </StyledButton>
        ))}
      </Flex>
      <Border top bottom py={1} my={1}>
        <FormattedMessage {...messages.onlineUsers} />
      </Border>
      <Flex wrap>
        {Object.entries(C.onlineUsers).map((u) => {
          const userId = parseInt(u[0], 10);
          if (userId !== props.currentUser.userId) {
            return (
              <StyledButton key={u[0]} onClick={() => props.openChat(u[0])}>
                {u[1]}
              </StyledButton>
            );
          }
          return null;
        })}
      </Flex>
    </div>
  );
}

Users.propTypes = {
  chat: PropTypes.shape({
    directMessages: PropTypes.object.isRequired,
    onlineUsers: PropTypes.object.isRequired,
  }),
  currentUser: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  openChat: (chat) => dispatch(changeDirectchat(chat)),
});

export default connect(null, mapDispatchToProps)(Users);
