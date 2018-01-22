/**
 *
 * Chat
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Toolbar, NavLink } from 'rebass';

import injectSaga from 'utils/injectSaga';
import makeSelectUserNavbar from 'containers/UserNavbar/selectors';
import ChatRoom from './ChatRoom';
import Channels from './Channels';
import Direct from './Direct';
import makeSelectChat from './selectors';
import saga from './saga';
import messages from './messages';
import { changeChannel, changeTab } from './actions';
import { TABS } from './constants';

const { TAB_CHAT, TAB_CHANNEL, TAB_USERS } = TABS;

const StyledToolbar = styled(Toolbar)`
  background-color: sienna;
  font-weight: bold;
  color: blanchedalmond;
  height: 50px;
  overflow-y: auto;
`;

export function Chat(props) {
  function setActiveTab(tab) {
    props.dispatch(changeTab(tab));
  }
  function tune(channel) {
    if (channel !== props.chat.channel) {
      props.dispatch(changeChannel(channel));
    }
    props.dispatch(changeTab(TAB_CHAT));
  }
  return (
    <div>
      <StyledToolbar>
        <NavLink onClick={() => setActiveTab(TAB_CHAT)}>
          <FormattedMessage {...messages.chatroom} />
        </NavLink>
        <NavLink onClick={() => setActiveTab(TAB_CHANNEL)}>
          <FormattedMessage {...messages.channel} />
        </NavLink>
        {props.currentUser.user.userId && (
          <NavLink onClick={() => setActiveTab(TAB_USERS)}>
            <FormattedMessage {...messages.direct} />
          </NavLink>
        )}
      </StyledToolbar>
      {props.chat.activeTab === TAB_CHAT && (
        <ChatRoom
          chatMessages={props.chat.chatMessages}
          channel={props.chat.currentChannel}
          currentUserId={props.currentUser.user.userId}
          hasPreviousPage={props.chat.hasPreviousPage}
          height={props.height - 50}
        />
      )}
      {props.chat.activeTab === TAB_CHANNEL && <Channels tune={tune} />}
      {props.chat.activeTab === TAB_USERS && (
        <Direct
          currentUser={props.currentUser.user}
          chat={props.chat}
          height={props.height - 50}
        />
      )}
    </div>
  );
}

Chat.propTypes = {
  chat: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  chat: makeSelectChat(),
  currentUser: makeSelectUserNavbar(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'chat', saga });

export default compose(withSaga, withConnect)(Chat);
