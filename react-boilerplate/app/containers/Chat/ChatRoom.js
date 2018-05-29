/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { from_global_id as f } from 'common';
import { FormattedMessage } from 'react-intl';
import { Flex } from 'rebass';
import { ButtonOutline } from 'style-store';
import { nAlert } from 'containers/Notifier/actions';

import { graphql } from 'react-apollo';
import ChatQuery from 'graphql/ChatQuery';
import CreateChatmessageMutation from 'graphql/CreateChatmessageMutation';
import ChatMessageSubscription from 'graphql/ChatMessageSubscription';

import LoadingDots from 'components/LoadingDots';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import DescriptionPanel from './DescriptionPanel';
import Wrapper from './Wrapper';
import messages from './messages';

import { defaultChannel } from './constants';

const MessageWrapper = Wrapper.extend`
  overflow-y: auto;
  height: ${(props) => props.height}px;
  width: 100%;
  margin-bottom: 5px;
  border-radius: 0 0 10px 10px;
`;

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loading: false, taHeight: 36, dpHeight: 20 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleHeightChange = (h, inst) =>
      this.setState({ taHeight: inst._rootDOMNode.clientHeight || h });
    this.handleDPHeightChange = (h) => this.setState({ dpHeight: h });
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    this.props.subscribeChatUpdates();
  }

  componentDidUpdate(prevProps) {
    // If chatroom not exist, jump to lobby
    if (
      this.props.allChatmessages === undefined &&
      this.props.loading === false
    ) {
      if (this.props.channel !== null) {
        this.props.alert(`Chatroom "${this.props.channel}" does not exist`);
      }
      this.props.tune('lobby');
    }

    // scroll to bottom upon update
    if (!prevProps.allChatmessages && this.props.allChatmessages) {
      this.scrollToBottom();
    } else if (
      this.props.allChatmessages &&
      prevProps.allChatmessages &&
      this.props.allChatmessages.edges.length !==
        prevProps.allChatmessages.edges.length
    ) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    if (!this.lastcmref || !this.btmref) {
      return;
    }
    const domrect = this.lastcmref.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    if (domrect.top <= windowHeight && domrect.top > 0) {
      this.btmref.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleSubmit(content) {
    if (this.state.loading) return;
    if (!content.trim()) {
      this.input.setContent('');
      return;
    }
    const { channel, currentUser, pathname } = this.props;
    const chatroomName = channel || defaultChannel(pathname);
    this.setState({ loading: true });
    this.input.setContent('');

    this.props
      .mutate({
        variables: {
          input: {
            content,
            chatroomName,
          },
        },
        update(proxy, { data: { createChatmessage: { chatmessage } } }) {
          const data = proxy.readQuery({
            query: ChatQuery,
            variables: { chatroomName },
          });
          const responseData = {
            __typename: 'ChatMessageNodeEdge',
            node: {
              content,
              editTimes: 0,
              user: currentUser,
              ...chatmessage,
            },
          };

          let update = false;
          const prevEdges = data.allChatmessages.edges.map((edge) => {
            if (edge.node.id === responseData.node.id) {
              update = true;
              return responseData;
            }
            const pk = (id) => id && parseInt(f(id)[1], 10);
            if (pk(edge.node.id) > pk(responseData.node.id)) {
              update = true;
            }
            return edge;
          });

          if (update) {
            proxy.writeQuery({
              query: ChatQuery,
              variables: { chatroomName },
              data: {
                ...data,
                allChatmessages: {
                  ...data.allChatmessages,
                  edges: prevEdges,
                },
              },
            });
          } else {
            proxy.writeQuery({
              query: ChatQuery,
              variables: { chatroomName },
              data: {
                ...data,
                allChatmessages: {
                  ...data.allChatmessages,
                  edges: [...prevEdges, responseData],
                },
              },
            });
          }
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
    if (this.props.hidden) return null;

    return (
      <Flex flexWrap="wrap" justifyContent="center">
        <DescriptionPanel
          height={this.state.dpHeight}
          changeHeight={this.handleDPHeightChange}
          name={this.props.channel || defaultChannel(this.props.pathname)}
          currentUserId={this.props.currentUser && this.props.currentUser.id}
          favChannels={this.props.favChannels}
        />
        <MessageWrapper
          height={
            this.props.height - this.state.taHeight - this.state.dpHeight - 14
          }
        >
          {this.props.loading ? (
            <LoadingDots />
          ) : (
            this.props.hasPreviousPage && (
              <ButtonOutline p="5px" w={1} onClick={this.props.loadMore}>
                <FormattedMessage {...messages.loadMore} />
              </ButtonOutline>
            )
          )}
          {this.props.allChatmessages
            ? this.props.allChatmessages.edges.map((edge, i) => {
                if (i + 1 === this.props.allChatmessages.edges.length) {
                  return (
                    <div
                      ref={(lastcm) => (this.lastcmref = lastcm)}
                      key={edge.node.id}
                    >
                      <ChatMessage {...edge.node} />
                    </div>
                  );
                }
                return <ChatMessage key={edge.node.id} {...edge.node} />;
              })
            : null}
          <div ref={(btm) => (this.btmref = btm)} />
        </MessageWrapper>
        <ChatInput
          ref={(ins) => (this.input = ins)}
          sendPolicy={this.props.sendPolicy}
          disabled={this.props.currentUser === null}
          onSubmit={this.handleSubmit}
          onHeightChange={this.handleHeightChange}
          loading={this.state.loading}
        />
      </Flex>
    );
  }
}

ChatRoom.propTypes = {
  mutate: PropTypes.func.isRequired,
  allChatmessages: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  loading: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  subscribeChatUpdates: PropTypes.func.isRequired,
  hasPreviousPage: PropTypes.bool,
  channel: PropTypes.string,
  height: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
  sendPolicy: PropTypes.string.isRequired,
  favChannels: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  // eslint-disable-next-line react/no-unused-prop-types
  pathname: PropTypes.string.isRequired,
  alert: PropTypes.func.isRequired,
  tune: PropTypes.func.isRequired,
  hidden: PropTypes.bool,
};

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(null, mapDispatchToProps);

const withMutation = graphql(CreateChatmessageMutation);

const withChat = graphql(ChatQuery, {
  options: ({ channel, pathname }) => {
    const chatroomName = channel || defaultChannel(pathname);
    return {
      variables: { chatroomName },
      fetchPolicy: 'cache-and-network',
    };
  },
  props({ data, ownProps }) {
    const { allChatmessages, loading, fetchMore, subscribeToMore } = data;
    const { channel, pathname } = ownProps;
    const chatroomName = channel || defaultChannel(pathname);
    return {
      allChatmessages,
      loading,
      hasPreviousPage:
        allChatmessages && allChatmessages.pageInfo.hasPreviousPage,
      loadMore: () =>
        fetchMore({
          query: ChatQuery,
          variables: {
            chatroomName,
            before: allChatmessages.pageInfo.startCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.allChatmessages.edges;
            const pageInfo = fetchMoreResult.allChatmessages.pageInfo;

            return newEdges.length
              ? {
                  allChatmessages: {
                    __typename: previousResult.allChatmessages.__typename,
                    edges: [
                      ...newEdges,
                      ...previousResult.allChatmessages.edges,
                    ],
                    pageInfo,
                  },
                }
              : previousResult;
          },
        }),
      subscribeChatUpdates: () =>
        subscribeToMore({
          document: ChatMessageSubscription,
          variables: { chatroomName },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const newNode = subscriptionData.data.chatmessageSub;
            if (!newNode) return prev;

            let update = false;
            const prevEdges = prev.allChatmessages.edges.map((edge) => {
              if (edge.node.id === newNode.id) {
                update = true;
                return { __typename: 'ChatMessageNodeEdge', node: newNode };
              }
              const pk = (id) => id && parseInt(f(id)[1], 10);
              if (pk(edge.node.id) > pk(newNode.id)) {
                update = true;
              }
              return edge;
            });

            if (update) {
              return {
                ...prev,
                allChatmessages: {
                  ...prev.allChatmessages,
                  edges: prevEdges,
                },
              };
            }

            return {
              ...prev,
              allChatmessages: {
                ...prev.allChatmessages,
                edges: [
                  ...prev.allChatmessages.edges,
                  { __typename: 'ChatMessageNodeEdge', node: newNode },
                ],
              },
            };
          },
        }),
    };
  },
});

export default compose(withChat, withMutation, withConnect)(ChatRoom);
