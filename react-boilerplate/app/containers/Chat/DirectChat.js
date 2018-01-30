/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Flex, Box } from 'rebass';
import { Button, ButtonOutline } from 'style-store';

import Wrapper from './Wrapper';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import { changeDirectchat, sendDirectchat } from './actions';
import messages from './messages';

const MessageWrapper = Wrapper.extend`
  overflow-y: auto;
  height: ${(props) => props.height}px;
  width: 100%;
  margin-bottom: 5px;
  border-radius: 0 0 10px 10px;
  border-color: darkgoldenrod;
`;

const Topbar = styled(Flex)`
  font-size: 1.2em;
  color: blanchedalmond;
  background: darkgoldenrod;
  padding: 5px 0;
`;

const BackBtn = Button.extend`
  padding: 5px;
  background-color: darkgoldenrod;
  &:hover {
    background-color: sienna;
  }
`;

class DirectChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      taHeight: 36,
    };
    this.handleChange = (e) => this.setState({ content: e.target.value });
    this.handleHeightChange = (h, inst) =>
      this.setState({ taHeight: inst._rootDOMNode.clientHeight });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.setState({ content: '' });
    if (!this.state.content) return;
    this.props.sendMessage({
      from: this.props.currentUser,
      to: parseInt(this.props.chat.activeDirectChat, 10),
      message: this.state.content,
    });
  }

  render() {
    const C = this.props.chat;
    return (
      <Flex wrap justify="center">
        <Topbar w={1}>
          <BackBtn onClick={this.props.back}>
            <FormattedMessage {...messages.back} />
          </BackBtn>
          <Box m="auto">
            {C.onlineUsers[C.activeDirectChat] ||
              `User ${C.activeDirectChat} (Offline)`}
          </Box>
        </Topbar>
        <MessageWrapper height={this.props.height - this.state.taHeight - 50}>
          {C.activeDirectChat in C.directMessages &&
            C.directMessages[C.activeDirectChat].map((msg) => (
              <ChatMessage
                user={{ rowid: msg.from.userId, nickname: msg.from.nickname }}
                key={`DirectChat:${msg.from.userId}:${msg.created}`}
                content={msg.message}
              />
            ))}
        </MessageWrapper>
        <Flex mx={1} w={1}>
          <MessageInput
            value={this.state.content}
            onChange={this.handleChange}
            onHeightChange={this.handleHeightChange}
            disabled={
              C.onlineUsers[C.activeDirectChat] === undefined ||
              !this.props.currentUser.userId
            }
          />
          <ButtonOutline
            onClick={this.handleSubmit}
            p={10}
            style={{ wordBreak: 'keep-all' }}
            disabled={
              C.onlineUsers[C.activeDirectChat] === undefined ||
              !this.props.currentUser.userId
            }
          >
            <FormattedMessage {...messages.send} />
          </ButtonOutline>
        </Flex>
      </Flex>
    );
  }
}

DirectChat.propTypes = {
  back: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  chat: PropTypes.shape({
    directMessages: PropTypes.object.isRequired,
    activeDirectChat: PropTypes.string.isRequired,
    onlineUsers: PropTypes.object.isRequired,
  }),
  currentUser: PropTypes.object,
  height: PropTypes.number.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  back: () => dispatch(changeDirectchat(null)),
  sendMessage: (data) => dispatch(sendDirectchat(data)),
});

export default connect(null, mapDispatchToProps)(DirectChat);
