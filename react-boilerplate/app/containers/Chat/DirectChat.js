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
import { from_global_id as f, to_global_id as t } from 'common';
import LoadingDots from 'components/LoadingDots';
import { nAlert, nMessage } from 'containers/Notifier/actions';
import assurePropsLoaded from 'components/assurePropsLoaded';
import notifierMessages from 'containers/Notifier/messages';

import { graphql } from 'react-apollo';
import CreateDirectmessageMutation from 'graphql/CreateDirectmessageMutation';
import DirectmessageQuery from 'graphql/DirectmessageQuery';
import DirectmessageSubscription from 'graphql/DirectmessageSubscription';
import UpdateLastReadDmMutation from 'graphql/UpdateLastReadDmMutation';

import Wrapper from './Wrapper';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import messages from './messages';
import { directchatReceived, openDirectChat } from './actions';

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
    this.updateLastReadDm = this.updateLastReadDm.bind(this);
  }

  componentWillMount() {
    const adm = this.props.allDirectmessages;
    const currentUser = this.props.currentUser;
    /*
     * Upon first load, check new messages.
     */
    if (
      adm.edges.length > 0 &&
      (!currentUser.lastReadDm ||
        f(adm.edges[adm.edges.length - 1].node.id)[1] >
          f(currentUser.lastReadDm.id)[1])
    ) {
      this.props.notifyOfflineDms(
        <FormattedMessage {...messages.notifyOfflineDms} />,
      );
    }

    this.props.subscribeToDirectmessages();
    this.updateLastReadDmHandle = window.setInterval(
      this.updateLastReadDm,
      6000,
    );
  }

  componentWillUnmount() {
    window.clearInterval(this.updateLastReadDmHandle);
  }

  updateLastReadDm() {
    const adm = this.props.allDirectmessages;
    const currentUser = this.props.currentUser;
    if (
      adm.edges.length > 0 &&
      (!currentUser.lastReadDm ||
        f(adm.edges[adm.edges.length - 1].node.id)[1] >
          f(currentUser.lastReadDm.id)[1])
    ) {
      const lastMessageId = adm.edges[adm.edges.length - 1].node.id;
      this.props
        .mutateUpdateLastReadDm({
          variables: { input: { directmessageId: lastMessageId } },
        })
        .then(() => {})
        .catch((error) => {
          this.props.alert(error.message);
        });
    }
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
      .mutateCreateDm({
        variables: {
          input: {
            content,
            receiver,
          },
        },
        update(
          proxy,
          {
            data: {
              createDirectmessage: { directmessage },
            },
          },
        ) {
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
    if (!this.props.display) return null;
    const user = this.props.chat.dmReceiver;
    return (
      <Flex flexWrap="wrap" justifyContent="center">
        <MessageWrapper height={this.props.height - this.state.taHeight - 15}>
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
                ),
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
            <FormattedMessage {...messages.directChatInputPlaceholder}>
              {(msg) => (
                <ChatInput
                  ref={(ins) => (this.input = ins)}
                  sendPolicy={this.props.sendPolicy}
                  placeholder={user ? null : msg}
                  disabled={
                    !user ||
                    !this.props.currentUser ||
                    this.props.currentUser.id === user.id
                  }
                  onSubmit={this.handleSubmit}
                  onHeightChange={this.handleHeightChange}
                  loading={this.state.loading}
                />
              )}
            </FormattedMessage>
          </Box>
        </Flex>
      </Flex>
    );
  }
}

DirectChat.propTypes = {
  chat: PropTypes.shape({
    dmReceiver: PropTypes.object,
    activeTab: PropTypes.string,
  }),
  display: PropTypes.bool.isRequired,
  subscribeToDirectmessages: PropTypes.func.isRequired,
  mutateCreateDm: PropTypes.func.isRequired,
  mutateUpdateLastReadDm: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  allDirectmessages: PropTypes.object.isRequired,
  hasPreviousPage: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  sendPolicy: PropTypes.string.isRequired,
  alert: PropTypes.func.isRequired,
  notifyOfflineDms: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
  notifyOfflineDms: (message) =>
    dispatch(
      nMessage({
        autoDismiss: 0,
        action: {
          label: <FormattedMessage {...notifierMessages.open} />,
          callback: () => dispatch(openDirectChat({ chat: null })),
        },
        message,
      }),
    ),
  notify: (payload) => dispatch(directchatReceived(payload)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

const withCreateDmMutation = graphql(CreateDirectmessageMutation, {
  name: 'mutateCreateDm',
});
const withUpdateLastReadDmMutation = graphql(UpdateLastReadDmMutation, {
  name: 'mutateUpdateLastReadDm',
});
const withDirectMessages = graphql(DirectmessageQuery, {
  options: ({ currentUser }) => ({
    variables: { userId: currentUser.id, last: 10 },
    fetchPolicy: 'cache-and-network',
  }),
  props({ data, ownProps }) {
    const { allDirectmessages, loading, fetchMore, subscribeToMore } = data;
    const { currentUser, notify } = ownProps;
    return {
      allDirectmessages,
      loading,
      hasPreviousPage:
        allDirectmessages && allDirectmessages.pageInfo.hasPreviousPage,
      loadMore: () =>
        fetchMore({
          query: DirectmessageQuery,
          variables: {
            userId: currentUser.id,
            last: 10,
            before: allDirectmessages.pageInfo.startCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.allDirectmessages.edges;
            const pageInfo = fetchMoreResult.allDirectmessages.pageInfo;

            return newEdges.length
              ? {
                  allDirectmessages: {
                    __typename: previousResult.allDirectmessages.__typename,
                    edges: [
                      ...newEdges,
                      ...previousResult.allDirectmessages.edges,
                    ],
                    pageInfo,
                  },
                }
              : previousResult;
          },
        }),
      subscribeToDirectmessages: () =>
        subscribeToMore({
          document: DirectmessageSubscription,
          variables: {
            userId: currentUser ? currentUser.id : t('UserNode', '-1'),
          },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const node = subscriptionData.data.directmessageSub;
            if (!node) return prev;

            notify({
              sender: {
                id: node.sender.id,
                nickname: node.sender.nickname,
              },
            });
            return {
              ...prev,
              allDirectmessages: {
                ...prev.allDirectmessages,
                edges: [
                  ...prev.allDirectmessages.edges,
                  { __typename: 'DirectMessageNodeEdge', node },
                ],
              },
            };
          },
        }),
    };
  },
});

export default compose(
  withConnect,
  withDirectMessages,
  withCreateDmMutation,
  withUpdateLastReadDmMutation,
  assurePropsLoaded({
    requiredProps: ['allDirectmessages', 'currentUser'],
  }),
)(DirectChat);
