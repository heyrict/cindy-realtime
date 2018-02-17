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
import FavoriteChatRoomQuery from 'graphql/FavoriteChatRoomQuery';

import injectSaga from 'utils/injectSaga';
import { makeSelectLocation } from 'containers/App/selectors';
import makeSelectUserNavbar from 'containers/UserNavbar/selectors';
import ChatRoom from './ChatRoom';
import Channels from './Channels';
import Direct from './Direct';
import Wrapper from './Wrapper';
import makeSelectChat from './selectors';
import saga from './saga';
import messages from './messages';
import { changeChannel, changeTab } from './actions';
import { TABS } from './constants';

const { TAB_CHAT, TAB_CHANNEL, TAB_DIRECTCHAT } = TABS;

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
      <Wrapper style={{ height: '100%', overflow: 'auto' }}>
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
        {props.currentUser.user.userId && (
          <NavLink onClick={() => setActiveTab(TAB_DIRECTCHAT)}>
            <FormattedMessage {...messages.direct} />
          </NavLink>
        )}
      </StyledToolbar>
      {props.chat.activeTab === TAB_CHAT && (
        <ChatRoom
          channel={props.chat.channel}
          favChannels={props.allFavoriteChatrooms}
          currentUserId={props.currentUser.user.userId}
          pathname={props.location.pathname}
          height={props.height - 50}
        />
      )}
      {props.chat.activeTab === TAB_CHANNEL && (
        <Channels tune={tune} favChannels={props.allFavoriteChatrooms} />
      )}
      {props.chat.activeTab === TAB_DIRECTCHAT && (
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
  currentUser: makeSelectUserNavbar(),
  location: makeSelectLocation(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

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
      const match = props.location.pathname.match(/^\/puzzle\/show\/(\d+)$/);
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
  options: ({ currentUser }) => ({
    variables: {
      userId: t('UserNode', currentUser.user.userId || '-1'),
    },
  }),
  props({ data }) {
    const { allFavoriteChatrooms } = data;
    return {
      allFavoriteChatrooms,
    };
  },
});

export default compose(withSaga, withConnect, withMemo, withFavChannels)(Chat);
