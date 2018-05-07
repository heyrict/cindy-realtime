/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Flex, Box } from 'rebass';
import { ButtonOutline } from 'style-store';
import LoadingDots from 'components/LoadingDots';
import { nAlert } from 'containers/Notifier/actions';

import { graphql } from 'react-apollo';
import CreateDirectmessageMutation from 'graphql/CreateDirectmessageMutation';
import DirectmessageQuery from 'graphql/DirectmessageQuery';

import Wrapper from './Wrapper';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import messages from './messages';

const MessageWrapper = Wrapper.extend`
  overflow-y: auto;
  height: ${(props) => props.height}px;
  width: 100%;
  margin-bottom: 5px;
  border-radius: 0 0 10px 10px;
  border-color: darkgoldenrod;
`;

const PrecedingSpan = styled.span`
  color: chocolate;
  font-family: consolas, inconsolata, monaco, sans-serif;
  word-break: break-all;
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
    const receiver = this.props.chat.dmReceiver.id;
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
    const user = this.props.chat.dmReceiver;
    return (
      <Flex wrap justify="center">
        <MessageWrapper height={this.props.height - this.state.taHeight - 10}>
          {this.props.loading ? (
            <LoadingDots />
          ) : (
            this.props.hasPreviousPage && (
              <ButtonOutline p="5px" w={1} onClick={this.props.loadMore}>
                <FormattedMessage {...messages.loadMore} />
              </ButtonOutline>
            )
          )}
          {this.props.allDirectmessages &&
            this.props.allDirectmessages.edges.map(
              (edge) =>
                edge.node.sender.id === this.props.currentUser.id ? (
                  <ChatMessage
                    user={edge.node.receiver}
                    precedingStr="TO"
                    key={edge.node.id}
                    content={edge.node.content}
                    created={edge.node.created}
                  />
                ) : (
                  <ChatMessage
                    user={edge.node.sender}
                    precedingStr="FROM"
                    key={edge.node.id}
                    content={edge.node.content}
                    created={edge.node.created}
                  />
                )
            )}
        </MessageWrapper>
        <Flex mx="10px" w={1}>
          {user &&
            user.id !== this.props.currentUser.id && (
              <Box>
                <PrecedingSpan>&gt;&gt;{user.nickname}</PrecedingSpan>
              </Box>
            )}
          <Box w={1}>
            <ChatInput
              ref={(ins) => (this.input = ins)}
              sendPolicy={this.props.sendPolicy}
              disabled={
                !user ||
                !this.props.currentUser ||
                this.props.currentUser.id === user.id
              }
              onSubmit={this.handleSubmit}
              onHeightChange={this.handleHeightChange}
              loading={this.state.loading}
            />
          </Box>
        </Flex>
      </Flex>
    );
  }
}

DirectChat.propTypes = {
  chat: PropTypes.shape({
    dmReceiver: PropTypes.object,
  }),
  mutate: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  allDirectmessages: PropTypes.object,
  hasPreviousPage: PropTypes.bool,
  loadMore: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  sendPolicy: PropTypes.string.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(null, mapDispatchToProps);

const withMutation = graphql(CreateDirectmessageMutation);

export default compose(withConnect, withMutation)(DirectChat);
