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
import { text2md, to_global_id as t } from 'common';
import { Toolbar, NavLink } from 'rebass';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import UserLabel from 'graphql/UserLabel';
import FavoriteChatRoomQuery from 'graphql/FavoriteChatRoomQuery';

import injectSaga from 'utils/injectSaga';
import { makeSelectLocation } from 'containers/App/selectors';
import makeSelectUserNavbar from 'containers/UserNavbar/selectors';
import makeSelectSettings from 'containers/Settings/selectors';
import ChatRoom from './ChatRoom';
import Channels from './Channels';
import DirectChat from './DirectChat';
import Broadcast from './Broadcast';
import Wrapper from './Wrapper';
import makeSelectChat from './selectors';
import saga from './saga';
import messages from './messages';
import { changeChannel, changeTab } from './actions';
import { defaultChannel, TABS } from './constants';

const { TAB_CHAT, TAB_CHANNEL, TAB_DIRECTCHAT, TAB_BROADCAST } = TABS;

const StyledToolbar = styled(Toolbar)`
  background-color: sienna;
  font-weight: bold;
  color: blanchedalmond;
  height: 50px;
  overflow-y: auto;
`;

export function Chat(props) {
  if (props.chat.open === 'memo' && props.puzzle) {
    return (
      <Wrapper style={{ height: `${props.height}px`, overflow: 'auto' }}>
        <div dangerouslySetInnerHTML={{ __html: text2md(props.puzzle.memo) }} />
      </Wrapper>
    );
  }

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
        {props.usernavbar.user.userId && (
          <NavLink onClick={() => setActiveTab(TAB_DIRECTCHAT)}>
            <FormattedMessage {...messages.direct} />
          </NavLink>
        )}
        {props.currentUser &&
          props.currentUser.canSendGlobalNotification && (
            <NavLink onClick={() => setActiveTab(TAB_BROADCAST)}>
              <FormattedMessage {...messages.broadcast} />
            </NavLink>
          )}
      </StyledToolbar>
      <ChatRoom
        key={props.chat.channel || defaultChannel(props.location.pathname)}
        channel={props.chat.channel}
        favChannels={props.allFavoriteChatrooms}
        currentUser={props.currentUser}
        sendPolicy={props.settings.sendChat}
        pathname={props.location.pathname}
        height={props.height - 50}
        hidden={props.chat.activeTab !== TAB_CHAT}
        tune={tune}
      />
      {props.chat.activeTab === TAB_CHANNEL && (
        <Channels
          tune={tune}
          favChannels={props.allFavoriteChatrooms}
          height={props.height - 50}
        />
      )}
      {props.currentUser && (
        <DirectChat
          currentUser={props.currentUser}
          sendPolicy={props.settings.sendChat}
          height={props.height - 50}
          chat={props.chat}
          display={
            props.chat.activeTab === TAB_DIRECTCHAT &&
            Boolean(props.currentUser)
          }
        />
      )}
      {props.chat.activeTab === TAB_BROADCAST && (
        <Broadcast height={props.height - 50} />
      )}
    </div>
  );
}

Chat.propTypes = {
  chat: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  usernavbar: PropTypes.object,
  settings: PropTypes.shape({
    sendChat: PropTypes.string.isRequired,
  }),
  dispatch: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  puzzle: PropTypes.shape({
    memo: PropTypes.string.isRequired,
  }),
  allFavoriteChatrooms: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  // eslint-disable-next-line react/no-unused-prop-types
  location: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  chat: makeSelectChat(),
  usernavbar: makeSelectUserNavbar(),
  settings: makeSelectSettings(),
  location: makeSelectLocation(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withSaga = injectSaga({ key: 'chat', saga });

const withMemo = graphql(
  gql`
    query($id: ID) {
      puzzle(id: $id) {
        id
        memo
      }
    }
  `,
  {
    options: (props) => {
      const defaultOpt = { fetchPolicy: 'cache-only' };
      if (!props.location) return defaultOpt;
      const match = props.location.pathname.match(/\/puzzle\/show\/(\d+)$/);
      if (!match) return defaultOpt;
      const id = t('PuzzleNode', match[1]);
      return {
        ...defaultOpt,
        variables: {
          id,
        },
      };
    },
    props({ data }) {
      const { puzzle } = data;
      return {
        puzzle,
      };
    },
  }
);

const withFavChannels = graphql(FavoriteChatRoomQuery, {
  options: ({ usernavbar }) => ({
    variables: {
      userId: t('UserNode', usernavbar.user.userId || '-1'),
    },
  }),
  props({ data }) {
    const { allFavoriteChatrooms } = data;
    return {
      allFavoriteChatrooms,
    };
  },
});

const withCurrentUser = graphql(
  gql`
    query($id: ID!) {
      user(id: $id) {
        ...UserLabel_user
        canSendGlobalNotification
        lastReadDm {
          id
        }
      }
    }
    ${UserLabel}
  `,
  {
    options: ({
      usernavbar: {
        user: { userId },
      },
    }) => ({
      variables: {
        id: t('UserNode', userId || '-1'),
      },
      fetchPolicy: 'cache-first',
    }),
    props({ data }) {
      const { user: currentUser } = data;
      return { currentUser };
    },
  }
);

export default compose(
  withSaga,
  withConnect,
  withCurrentUser,
  withMemo,
  withFavChannels
)(Chat);
