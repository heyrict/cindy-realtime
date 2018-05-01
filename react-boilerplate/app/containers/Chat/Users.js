import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Flex, Border } from 'rebass';
import { ButtonOutline } from 'style-store';
import { FormattedMessage } from 'react-intl';
import LoadingDots from 'components/LoadingDots';

import { changeDirectchat } from './actions';
import messages from './messages';

const StyledButton = ButtonOutline.extend`
  padding: 5px;
  margin: 5px 3px;
`;

function Users(props) {
  const sessions = {};
  const { currentUser, loading } = props;
  if (props.allDirectmessages) {
    props.allDirectmessages.edges.forEach((edge) => {
      const user =
        edge.node.sender.id === currentUser.id
          ? edge.node.receiver
          : edge.node.sender;
      sessions[user.id] = user;
    });
  }
  return (
    <div>
      {props.allDirectmessages && (
        <Border top bottom py={1} my={1}>
          <FormattedMessage {...messages.recent} />
        </Border>
      )}
      {loading && <LoadingDots />}
      {props.allDirectmessages && (
        <Flex wrap>
          {Object.entries(sessions).map(([userId, user]) => (
            <StyledButton
              key={userId}
              onClick={() => props.openChat(`${userId}:${user.nickname}`)}
            >
              {user.nickname}
            </StyledButton>
          ))}
        </Flex>
      )}
    </div>
  );
}

Users.propTypes = {
  currentUser: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  allDirectmessages: PropTypes.object,
  // eslint-disable-next-line react/no-unused-prop-types
  openChat: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  openChat: (chat) => dispatch(changeDirectchat(chat)),
});

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(Users);
