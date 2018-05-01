/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Flex, Box } from 'rebass';
import { Button } from 'style-store';
import { nAlert } from 'containers/Notifier/actions';

import { graphql } from 'react-apollo';
import CreateDirectmessageMutation from 'graphql/CreateDirectmessageMutation';
import DirectmessageQuery from 'graphql/DirectmessageQuery';

import Wrapper from './Wrapper';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { changeDirectchat } from './actions';
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
      loading: false,
    };
    this.handleHeightChange = (h, inst) =>
      this.setState({ taHeight: inst._rootDOMNode.clientHeight });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(content) {
    if (this.state.loading) return;
    if (!content.trim()) {
      this.input.setContent('');
      return;
    }
    const receiver = this.props.chat.activeDirectChat;
    const currentUser = this.props.currentUser;
    this.setState({ loading: true });
    this.input.setContent('');

    this.props
      .mutate({
        variables: {
          input: {
            content,
            receiver,
          },
        },
        update(proxy, { data: { createDirectmessage: { directmessage } } }) {
          const data = proxy.readQuery({
            query: DirectmessageQuery,
            variables: { userId: currentUser.id },
          });
          const responseData = {
            __typename: 'DirectMessageNodeEdge',
            node: {
              content,
              sender: currentUser,
              ...directmessage,
            },
          };
          data.allDirectmessages.edges.push(responseData);
          proxy.writeQuery({
            query: DirectmessageQuery,
            variables: { userId: currentUser.id },
            data,
          });
        },
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.input.setContent(content);
        this.props.alert(error.message);
        this.setState({ loading: false });
      });
  }

  render() {
    const userId = this.props.chat.activeDirectChat;
    let userNickname = `Unknown User <${userId}>`;
    const filteredMessages = this.props.allDirectmessages
      ? this.props.allDirectmessages.edges.filter((edge, index) => {
          if (index < 1) {
            userNickname =
              edge.node.sender.id === userId
                ? edge.node.sender.nickname
                : edge.node.receiver.nickname;
          }
          return (
            edge.node.sender.id === userId || edge.node.receiver.id === userId
          );
        })
      : null;
    return (
      <Flex wrap justify="center">
        <Topbar w={1}>
          <BackBtn onClick={this.props.back}>
            <FormattedMessage {...messages.back} />
          </BackBtn>
          <Box m="auto">{userNickname}</Box>
        </Topbar>
        <MessageWrapper height={this.props.height - this.state.taHeight - 50}>
          {filteredMessages &&
            filteredMessages.map((edge) => (
              <ChatMessage
                user={edge.node.sender}
                key={edge.node.id}
                content={edge.node.content}
                created={edge.node.created}
              />
            ))}
        </MessageWrapper>
        <ChatInput
          ref={(ins) => (this.input = ins)}
          sendPolicy={this.props.sendPolicy}
          disabled={!this.props.currentUser}
          onSubmit={this.handleSubmit}
          onHeightChange={this.handleHeightChange}
          loading={this.state.loading}
        />
      </Flex>
    );
  }
}

DirectChat.propTypes = {
  back: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  chat: PropTypes.shape({
    activeDirectChat: PropTypes.string.isRequired,
  }),
  currentUser: PropTypes.object,
  allDirectmessages: PropTypes.object,
  height: PropTypes.number.isRequired,
  sendPolicy: PropTypes.string.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  back: () => dispatch(changeDirectchat(null)),
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(null, mapDispatchToProps);

const withMutation = graphql(CreateDirectmessageMutation);

export default compose(withConnect, withMutation)(DirectChat);
