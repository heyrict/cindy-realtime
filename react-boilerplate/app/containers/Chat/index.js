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
import makeSelectChat from './selectors';
import saga from './saga';
import messages from './messages';
import { changeChannel } from './actions';

const StyledToolbar = styled(Toolbar)`
  background-color: sienna;
  font-weight: bold;
  color: blanchedalmond;
  height: 50px;
  overflow-y: auto;
`;

export class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
    };
    this.changeTab = (t) => this.setState({ activeTab: t });
    this.tune = this.tune.bind(this);
  }
  tune(channel) {
    if (channel !== this.props.chat.channel) {
      this.props.dispatch(changeChannel(channel));
    }
    this.changeTab(0);
  }
  render() {
    return (
      <div>
        <StyledToolbar>
          <NavLink onClick={() => this.changeTab(0)}>
            <FormattedMessage {...messages.chatroom} />
          </NavLink>
          <NavLink onClick={() => this.changeTab(1)}>
            <FormattedMessage {...messages.channel} />
          </NavLink>
          <NavLink onClick={() => this.changeTab(2)}>
            <FormattedMessage {...messages.onlineUsers} />
          </NavLink>
        </StyledToolbar>
        <div hidden={this.state.activeTab !== 0}>
          <ChatRoom
            chatMessages={this.props.chat.chatMessages}
            channel={this.props.chat.currentChannel}
            currentUserId={this.props.currentUser.user.userId}
            hasPreviousPage={this.props.chat.hasPreviousPage}
            height={this.props.height - 50}
          />
        </div>
        <div hidden={this.state.activeTab !== 1}>
          <Channels tune={this.tune} />
        </div>
      </div>
    );
  }
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
